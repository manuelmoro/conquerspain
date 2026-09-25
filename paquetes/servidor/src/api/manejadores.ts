// Las rutas de la API (ficha T-062 §4.3). Toda respuesta de estado pasa por `vistaDeJugador`: ninguna
// ruta devuelve el estado completo ni los sucesos crudos.
import {
  VERSION_REGLAS,
  atlasDeJugador,
  canonico,
  construirOrden,
  explicar,
  validarIntencion,
  vistaDeJugador,
} from '@conquer/nucleo';
import type { IdJugador, IdOrden, IdPartida, TablasDeReglas } from '@conquer/nucleo';

import { ErrorDePersistencia } from '../persistencia/repositorio.ts';
import type { FilaDePartida, Repositorio } from '../persistencia/repositorio.ts';
import type { CanalDeAvisos } from '../avisos/canal.ts';
import { modoPorDefecto } from '../avisos/preferencias.ts';
import { avisosDe } from '../avisos/texto.ts';
import type { ServicioDeAltas } from '../altas/servicio.ts';
import type { ServicioDeCuentas } from '../cuentas/servicio.ts';
import { MODOS_DE_AVISO } from '../persistencia/avisos.ts';
import type { RepositorioDeAvisos } from '../persistencia/avisos.ts';
import type { ProveedorDeMundo } from '../reloj/mundoDeLaPartida.ts';
import type { Registro } from '../reloj/registro.ts';
import { ErrorDeApi } from './errores.ts';
import { encontrar } from './enrutador.ts';
import type { Ruta } from './enrutador.ts';
import {
  CUERPO_MAXIMO_BYTES,
  CuboDeFichas,
  ORDENES_PENDIENTES_MAXIMAS,
  PETICIONES_POR_MINUTO,
  RAFAGA_DE_PETICIONES,
} from './limites.ts';
import type { Autenticador, Flujo, PeticionHttp, RespuestaHttp } from './tipos.ts';

export interface DependenciasDeApi {
  readonly repo: Repositorio;
  readonly reglas: TablasDeReglas;
  readonly proveedorDeMundo: ProveedorDeMundo;
  readonly autenticador: Autenticador;
  readonly registro: Registro;
  /** Milisegundos Unix. */
  readonly ahora: () => number;
  /** El limitador de frecuencia; por defecto, el de la ficha. */
  readonly cubo?: CuboDeFichas;
  /** Cuentas y sesiones (T-063): si falta, no hay rutas de cuenta. */
  readonly cuentas?: ServicioDeCuentas;
  /** Avisos (T-064): el canal en vivo y las preferencias. Sin ellos, no hay esas rutas. */
  readonly canal?: CanalDeAvisos;
  readonly avisos?: RepositorioDeAvisos;
  /** Alta de partidas (T-065): convocar, unirse, sortear y elegir. */
  readonly altas?: ServicioDeAltas;
  /** Cada cuanto se manda un latido por el flujo de eventos; por defecto, 25 s. */
  readonly latidoMs?: number;
}

interface Contexto {
  readonly cuenta: string;
  readonly parametros: Readonly<Record<string, string>>;
  readonly peticion: PeticionHttp;
}

interface Salida {
  readonly estado: number;
  readonly datos: Record<string, unknown>;
  readonly cabeceras?: Readonly<Record<string, string>>;
  readonly flujo?: Flujo;
}

type Manejador = (ctx: Contexto) => Promise<Salida>;

/** Lo que sabe una ruta antes de saber quien pregunta. */
interface Base {
  readonly cuenta: string | null;
  readonly parametros: Readonly<Record<string, string>>;
  readonly peticion: PeticionHttp;
  readonly origen: string;
}

/** Una ruta: publica (no pide sesion) o privada (la pide y recibe la cuenta). */
interface Entrada {
  readonly publica: boolean;
  readonly ejecutar: (base: Base) => Promise<Salida>;
}

function publica(ejecutar: (base: Base) => Promise<Salida>): Entrada {
  return { publica: true, ejecutar };
}

function privada(manejador: Manejador): Entrada {
  return {
    publica: false,
    ejecutar: (base) => {
      if (base.cuenta === null) {
        throw new ErrorDeApi('no-autenticado', 'Hace falta iniciar sesion para usar la API.');
      }
      return manejador({
        cuenta: base.cuenta,
        parametros: base.parametros,
        peticion: base.peticion,
      });
    },
  };
}

/** El cuerpo como JSON: o un error claro. */
function leerJson(cuerpo: string | null): unknown {
  if (cuerpo === null || cuerpo.trim() === '') {
    throw new ErrorDeApi('cuerpo-invalido', 'Falta el cuerpo: manda un objeto JSON.');
  }
  try {
    return JSON.parse(cuerpo);
  } catch {
    throw new ErrorDeApi(
      'cuerpo-invalido',
      'El cuerpo no es JSON valido: revisa las comillas y las comas.',
    );
  }
}

function objetoJson(cuerpo: string | null): Record<string, unknown> {
  const dato = leerJson(cuerpo);
  if (typeof dato !== 'object' || dato === null || Array.isArray(dato)) {
    throw new ErrorDeApi('cuerpo-invalido', 'El cuerpo tiene que ser un objeto JSON.');
  }
  return Object.fromEntries(Object.entries(dato));
}

const CABECERAS_JSON = { 'content-type': 'application/json; charset=utf-8' };

function respuesta(
  estado: number,
  cuerpo: Record<string, unknown>,
  cabeceras: Readonly<Record<string, string>> = {},
): RespuestaHttp {
  return {
    estado,
    cuerpo: { ...cuerpo, version: VERSION_REGLAS },
    cabeceras: { ...CABECERAS_JSON, ...cabeceras },
  };
}

function respuestaDeError(error: ErrorDeApi): RespuestaHttp {
  return respuesta(
    error.estado,
    { error: { codigo: error.codigo, mensaje: error.message } },
    error.cabeceras,
  );
}

export function crearApi(
  dep: DependenciasDeApi,
): (peticion: PeticionHttp) => Promise<RespuestaHttp> {
  const cubo = dep.cubo ?? new CuboDeFichas(RAFAGA_DE_PETICIONES, PETICIONES_POR_MINUTO / 60);

  /** La partida y el jugador de esta cuenta en ella; si no juega, no se distingue de que no exista. */
  async function partidaDelJugador(
    ctx: Contexto,
  ): Promise<{ fila: FilaDePartida; jugador: IdJugador; id: IdPartida }> {
    const id = (ctx.parametros['id'] ?? '') as IdPartida;
    const fila = await dep.repo.partida(id);
    const participante = (await dep.repo.participantes(id)).find((p) => p.cuenta === ctx.cuenta);
    if (fila === null || participante === undefined) {
      throw new ErrorDeApi(
        'partida-desconocida',
        `No hay ninguna partida "${id}" en la que juegues. Mira tus partidas en GET /partidas/mias.`,
      );
    }
    return { fila, jugador: participante.jugador, id };
  }

  async function estadoYVista(ctx: Contexto) {
    const { fila, jugador, id } = await partidaDelJugador(ctx);
    const estado = await dep.repo.ultimoEstado(id);
    if (estado === null) {
      throw new Error(`La partida "${id}" no tiene ningun estado guardado.`);
    }
    const mundo = dep.proveedorDeMundo(fila, estado);
    return { fila, jugador, id, estado, mundo, vista: vistaDeJugador(estado, jugador, mundo) };
  }

  const misPartidas: Manejador = async (ctx) => {
    const filas = await dep.repo.partidasDeCuenta(ctx.cuenta);
    return {
      estado: 200,
      datos: {
        partidas: filas.map((p) => ({
          id: p.partida.id,
          nombre: p.partida.nombre,
          casa: p.casa,
          turno: p.partida.turnoActual,
          estado: p.partida.estado,
          proximaResolucion: p.partida.proximaResolucion,
          esDePrueba: p.partida.esDePrueba,
        })),
      },
    };
  };

  const verEstado: Manejador = async (ctx) => {
    const { fila, estado, vista } = await estadoYVista(ctx);
    return {
      estado: 200,
      datos: {
        turno: estado.turno,
        estadoDeLaPartida: fila.estado,
        proximaResolucion: fila.proximaResolucion,
        vista,
      },
    };
  };

  const verAtlas: Manejador = async (ctx) => {
    const { estado, mundo, vista } = await estadoYVista(ctx);
    return { estado: 200, datos: { turno: estado.turno, atlas: atlasDeJugador(vista, mundo) } };
  };

  const clasificacion: Manejador = async (ctx) => {
    const { estado, vista } = await estadoYVista(ctx);
    return { estado: 200, datos: { turno: estado.turno, clasificacion: vista.clasificacion } };
  };

  const verCronica: Manejador = async (ctx) => {
    const { jugador, id } = await partidaDelJugador(ctx);
    const texto = ctx.parametros['turno'] ?? '';
    const turno = /^[0-9]+$/.test(texto) ? Number(texto) : Number.NaN;
    const cronica =
      Number.isSafeInteger(turno) && turno >= 1 ? await dep.repo.cronica(id, turno, jugador) : null;
    if (cronica === null) {
      throw new ErrorDeApi(
        'cronica-no-disponible',
        `No hay cronica tuya del turno "${texto}": solo existen las de los turnos ya resueltos.`,
      );
    }
    return { estado: 200, datos: { turno, cronica } };
  };

  const listarOrdenes: Manejador = async (ctx) => {
    const { jugador, id, fila } = await partidaDelJugador(ctx);
    const suyas = (await dep.repo.ordenesPendientes(id)).filter((o) => o.jugador === jugador);
    return {
      estado: 200,
      datos: {
        turno: fila.turnoActual,
        ordenes: suyas.map((o) => ({
          id: o.id,
          estado: o.estado,
          turnoRecibida: o.turnoRecibida,
          orden: o.orden,
        })),
      },
    };
  };

  const darOrden: Manejador = async (ctx) => {
    const dato = leerJson(ctx.peticion.cuerpo);
    const { fila, jugador, id, estado, mundo } = await estadoYVista(ctx);
    if (fila.estado !== 'activa') {
      throw new ErrorDeApi(
        'partida-detenida',
        `La partida "${id}" esta ${fila.estado}: ya no admite ordenes.`,
      );
    }
    const forma = validarIntencion(dato);
    if (!forma.ok) {
      throw new ErrorDeApi('orden-invalida', `La orden no es valida:\n${explicar(forma.errores)}`);
    }
    const ordenId = `o-${String(estado.turno)}-${jugador}-${forma.valor.idCliente}` as IdOrden;
    if (ordenId.length > 64) {
      throw new ErrorDeApi(
        'orden-invalida',
        'La clave de la orden es demasiado larga para este jugador: acortala.',
      );
    }
    const construida = construirOrden(forma.valor, {
      estado,
      jugador,
      mundo,
      reglas: dep.reglas,
      id: ordenId,
    });
    if (!construida.ok) {
      throw new ErrorDeApi(
        'orden-invalida',
        `La orden no es valida:\n${explicar(construida.errores)}`,
      );
    }
    const orden = construida.valor;

    const existente = await dep.repo.orden(id, ordenId);
    if (existente !== null)
      return repetida(existente.orden, canonico(orden), existente.estado, ordenId);

    const pendientes = (await dep.repo.ordenesPendientes(id)).filter((o) => o.jugador === jugador);
    if (pendientes.length >= ORDENES_PENDIENTES_MAXIMAS) {
      throw new ErrorDeApi(
        'demasiadas-ordenes',
        `Ya tienes ${String(ORDENES_PENDIENTES_MAXIMAS)} ordenes pendientes este turno: retira alguna o espera a que se resuelva.`,
      );
    }
    try {
      await dep.repo.guardarOrden(id, orden, dep.ahora(), estado.turno);
    } catch (error) {
      if (error instanceof ErrorDePersistencia && error.codigo === 'turno-cerrado') {
        throw new ErrorDeApi('turno-cerrado', error.message);
      }
      if (error instanceof ErrorDePersistencia && error.codigo === 'orden-duplicada') {
        const carrera = await dep.repo.orden(id, ordenId);
        if (carrera !== null)
          return repetida(carrera.orden, canonico(orden), carrera.estado, ordenId);
      }
      throw error;
    }
    return { estado: 201, datos: { turno: estado.turno, orden } };
  };

  function repetida(
    guardada: { readonly id: IdOrden },
    nueva: string,
    estadoGuardado: string,
    ordenId: IdOrden,
  ): Salida {
    if (canonico(guardada) !== nueva) {
      throw new ErrorDeApi(
        'clave-reutilizada',
        `La clave de la orden "${ordenId}" ya se uso con otra orden distinta: usa una clave nueva para cada orden.`,
      );
    }
    return {
      estado: 200,
      datos: { repetida: true, estadoDeLaOrden: estadoGuardado, orden: guardada },
    };
  }

  const retirarOrden: Manejador = async (ctx) => {
    const { jugador, id } = await partidaDelJugador(ctx);
    const ordenId = (ctx.parametros['orden'] ?? '') as IdOrden;
    const guardada = await dep.repo.orden(id, ordenId);
    if (guardada?.jugador !== jugador) {
      throw new ErrorDeApi(
        'orden-desconocida',
        `No tienes ninguna orden "${ordenId}" en esta partida.`,
      );
    }
    if (
      guardada.estado !== 'pendiente' ||
      !(await dep.repo.cancelarOrden(id, ordenId, 'retirada por el jugador'))
    ) {
      throw new ErrorDeApi(
        'orden-no-retirable',
        `La orden "${ordenId}" esta ${guardada.estado}: solo se pueden retirar las pendientes, antes de que se resuelva el turno.`,
      );
    }
    return { estado: 200, datos: { retirada: ordenId } };
  };

  const cuentas = dep.cuentas;
  const rutasDeCuenta: readonly Ruta<Entrada>[] =
    cuentas === undefined
      ? []
      : [
          {
            metodo: 'POST',
            patron: '/cuentas/enlace',
            manejador: publica(async (base) => {
              const cuerpo = objetoJson(base.peticion.cuerpo);
              await cuentas.pedirEnlace(cuerpo['correo'], cuerpo['nombre'], base.origen);
              // Siempre la misma respuesta, exista o no la cuenta (T-063 §4.5).
              return {
                estado: 202,
                datos: {
                  mensaje:
                    'Si el correo es valido, te hemos enviado un enlace para entrar. Dura 15 minutos.',
                },
              };
            }),
          },
          {
            metodo: 'POST',
            patron: '/sesion',
            manejador: publica(async (base) => {
              const cuerpo = objetoJson(base.peticion.cuerpo);
              const abierta = await cuentas.entrar(cuerpo['token'], base.origen);
              return {
                estado: 200,
                datos: { cuenta: { id: abierta.cuenta.id, nombre: abierta.cuenta.nombre } },
                cabeceras: { 'set-cookie': abierta.setCookie },
              };
            }),
          },
          {
            metodo: 'GET',
            patron: '/cuenta',
            manejador: privada(async (ctx) => {
              const cuenta = await cuentas.cuenta(ctx.cuenta);
              if (cuenta === null) {
                throw new ErrorDeApi(
                  'no-autenticado',
                  'La cuenta ya no existe: inicia sesion de nuevo.',
                );
              }
              return {
                estado: 200,
                datos: { cuenta: { id: cuenta.id, nombre: cuenta.nombre, correo: cuenta.correo } },
              };
            }),
          },
          {
            metodo: 'DELETE',
            patron: '/sesion',
            manejador: privada(async (ctx) => ({
              estado: 200,
              datos: { cerrada: true },
              cabeceras: {
                'set-cookie': await cuentas.cerrarSesion(ctx.peticion.cabeceras['cookie']),
              },
            })),
          },
          {
            metodo: 'POST',
            patron: '/sesion/cerrar-todas',
            manejador: privada(async (ctx) => ({
              estado: 200,
              datos: { cerradas: await cuentas.cerrarTodas(ctx.cuenta) },
            })),
          },
          {
            metodo: 'DELETE',
            patron: '/cuenta',
            manejador: privada(async (ctx) => {
              if (objetoJson(ctx.peticion.cuerpo)['confirmo'] !== true) {
                throw new ErrorDeApi(
                  'confirmacion-necesaria',
                  'Borrar la cuenta no se puede deshacer: manda { "confirmo": true } para confirmarlo.',
                );
              }
              return {
                estado: 200,
                datos: { borrada: true },
                cabeceras: { 'set-cookie': await cuentas.borrar(ctx.cuenta) },
              };
            }),
          },
        ];

  const canal = dep.canal;
  const eventos: Manejador = async (ctx) => {
    const { jugador, id } = await partidaDelJugador(ctx);
    if (canal === undefined)
      throw new ErrorDeApi('ruta-desconocida', 'Este servidor no da eventos en vivo.');
    const flujo: Flujo = (escribir) => {
      escribir(': conectado\n\n');
      const baja = canal.suscribir(id, (evento) => {
        void dep.repo.cronica(id, evento.turno, jugador).then((cronica) => {
          const datos = { turno: evento.turno, avisos: cronica === null ? 0 : avisosDe(cronica) };
          escribir(`event: turno-resuelto\ndata: ${JSON.stringify(datos)}\n\n`);
        });
      });
      const latido = setInterval(() => {
        escribir(': latido\n\n');
      }, dep.latidoMs ?? 25_000);
      return () => {
        clearInterval(latido);
        baja();
      };
    };
    return { estado: 200, datos: {}, flujo };
  };

  const repoDeAvisos = dep.avisos;
  const verAvisos: Manejador = async (ctx) => {
    const { fila, jugador, id } = await partidaDelJugador(ctx);
    if (repoDeAvisos === undefined)
      throw new ErrorDeApi('ruta-desconocida', 'Este servidor no manda avisos.');
    const porDefecto = modoPorDefecto(fila.intervaloSegundos);
    const modo = (await repoDeAvisos.preferencia(id, jugador)) ?? porDefecto;
    return { estado: 200, datos: { modo, porDefecto, modos: MODOS_DE_AVISO } };
  };

  const fijarAvisos: Manejador = async (ctx) => {
    const { jugador, id } = await partidaDelJugador(ctx);
    if (repoDeAvisos === undefined)
      throw new ErrorDeApi('ruta-desconocida', 'Este servidor no manda avisos.');
    const pedido = objetoJson(ctx.peticion.cuerpo)['modo'];
    const modo = MODOS_DE_AVISO.find((m) => m === pedido);
    if (modo === undefined) {
      throw new ErrorDeApi(
        'cuerpo-invalido',
        `El modo de aviso tiene que ser uno de: ${MODOS_DE_AVISO.join(', ')}.`,
      );
    }
    await repoDeAvisos.fijarPreferencia(id, jugador, modo);
    return { estado: 200, datos: { modo } };
  };

  const rutasDeAvisos: readonly Ruta<Entrada>[] = [
    ...(canal === undefined
      ? []
      : [{ metodo: 'GET', patron: '/partidas/:id/eventos', manejador: privada(eventos) }]),
    ...(repoDeAvisos === undefined
      ? []
      : [
          { metodo: 'GET', patron: '/partidas/:id/avisos', manejador: privada(verAvisos) },
          { metodo: 'PUT', patron: '/partidas/:id/avisos', manejador: privada(fijarAvisos) },
        ]),
  ];

  const altas = dep.altas;
  const rutasDeAltas: readonly Ruta<Entrada>[] =
    altas === undefined
      ? []
      : [
          {
            metodo: 'POST',
            patron: '/convocatorias',
            manejador: privada(async (ctx) => ({
              estado: 201,
              datos: await altas.convocar(ctx.cuenta, objetoJson(ctx.peticion.cuerpo)),
            })),
          },
          {
            metodo: 'GET',
            patron: '/convocatorias/mias',
            manejador: privada(async (ctx) => ({
              estado: 200,
              datos: { convocatorias: await altas.mias(ctx.cuenta) },
            })),
          },
          {
            metodo: 'POST',
            patron: '/convocatorias/unirse',
            manejador: privada(async (ctx) => ({
              estado: 200,
              datos: await altas.unirse(ctx.cuenta, objetoJson(ctx.peticion.cuerpo)),
            })),
          },
          {
            metodo: 'GET',
            patron: '/convocatorias/:id',
            manejador: privada(async (ctx) => ({
              estado: 200,
              datos: { convocatoria: await altas.ver(ctx.cuenta, ctx.parametros['id'] ?? '') },
            })),
          },
          {
            metodo: 'POST',
            patron: '/convocatorias/:id/sortear',
            manejador: privada(async (ctx) => ({
              estado: 200,
              datos: { convocatoria: await altas.sortear(ctx.cuenta, ctx.parametros['id'] ?? '') },
            })),
          },
          {
            metodo: 'POST',
            patron: '/convocatorias/:id/eleccion',
            manejador: privada(async (ctx) => ({
              estado: 200,
              datos: {
                convocatoria: await altas.elegir(
                  ctx.cuenta,
                  ctx.parametros['id'] ?? '',
                  objetoJson(ctx.peticion.cuerpo),
                ),
              },
            })),
          },
        ];

  const rutas: readonly Ruta<Entrada>[] = [
    { metodo: 'GET', patron: '/partidas/mias', manejador: privada(misPartidas) },
    { metodo: 'GET', patron: '/partidas/:id/estado', manejador: privada(verEstado) },
    { metodo: 'GET', patron: '/partidas/:id/clasificacion', manejador: privada(clasificacion) },
    { metodo: 'GET', patron: '/partidas/:id/atlas', manejador: privada(verAtlas) },
    { metodo: 'GET', patron: '/partidas/:id/cronica/:turno', manejador: privada(verCronica) },
    { metodo: 'GET', patron: '/partidas/:id/ordenes', manejador: privada(listarOrdenes) },
    { metodo: 'POST', patron: '/partidas/:id/ordenes', manejador: privada(darOrden) },
    { metodo: 'DELETE', patron: '/partidas/:id/ordenes/:orden', manejador: privada(retirarOrden) },
    ...rutasDeCuenta,
    ...rutasDeAvisos,
    ...rutasDeAltas,
  ];

  return async (peticion) => {
    try {
      if (Buffer.byteLength(peticion.cuerpo ?? '', 'utf8') > CUERPO_MAXIMO_BYTES) {
        throw new ErrorDeApi(
          'cuerpo-demasiado-grande',
          `El cuerpo pasa de ${String(CUERPO_MAXIMO_BYTES / 1024)} KiB: manda menos cosas en cada orden.`,
        );
      }
      const cuerpo = peticion.cuerpo;
      if (
        cuerpo !== null &&
        cuerpo !== '' &&
        !(peticion.cabeceras['content-type'] ?? '').toLowerCase().startsWith('application/json')
      ) {
        throw new ErrorDeApi(
          'tipo-de-contenido',
          'El cuerpo tiene que ir como JSON: manda la cabecera "content-type: application/json".',
        );
      }
      const encontrada = encontrar(rutas, peticion.metodo, peticion.ruta);
      let cuenta: string | null = null;
      if (!encontrada.manejador.publica) {
        cuenta = await dep.autenticador.identificar(peticion);
        if (cuenta === null) {
          throw new ErrorDeApi('no-autenticado', 'Hace falta iniciar sesion para usar la API.');
        }
        const espera = cubo.gastar(cuenta, dep.ahora());
        if (espera > 0) {
          throw new ErrorDeApi(
            'demasiadas-peticiones',
            `Vas demasiado deprisa: espera ${String(espera)} s antes de volver a pedir.`,
            { 'retry-after': String(espera) },
          );
        }
      }
      const salida = await encontrada.manejador.ejecutar({
        cuenta,
        parametros: encontrada.parametros,
        peticion,
        origen: peticion.origen ?? 'desconocido',
      });
      if (salida.flujo !== undefined) {
        return {
          estado: 200,
          cuerpo: null,
          cabeceras: {
            'content-type': 'text/event-stream; charset=utf-8',
            'cache-control': 'no-cache',
            connection: 'keep-alive',
          },
          flujo: salida.flujo,
        };
      }
      return respuesta(salida.estado, salida.datos, salida.cabeceras);
    } catch (error) {
      if (error instanceof ErrorDeApi) return respuestaDeError(error);
      dep.registro.anotar('error', 'error-interno', {
        ruta: peticion.ruta,
        detalle: error instanceof Error ? error.message : 'error desconocido',
      });
      return respuestaDeError(
        new ErrorDeApi(
          'error-interno',
          'Ha pasado algo inesperado en el servidor. Prueba de nuevo en un rato.',
        ),
      );
    }
  };
}
