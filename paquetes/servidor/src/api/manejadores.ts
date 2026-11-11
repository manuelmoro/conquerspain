// Las rutas de la API (ficha T-062 §4.3). Toda respuesta de estado pasa por `vistaDeJugador` o por una
// funcion del nucleo que solo da lo publico (la clasificacion, T-085) o lo que el jugador supo (la serie
// de precios, T-084): ninguna ruta devuelve el estado completo ni los sucesos crudos.
import {
  clasificacionPublica,
  resumenParaLaLista,
  VERSION_REGLAS,
  atlasDeJugador,
  fichaDeComarca,
  canonico,
  construirOrden,
  explicar,
  comarcasIncorporables,
  regaloYaPedido,
  validarIntencion,
  vistaDeJugador,
} from '@conquer/nucleo';
import type { IdComarca, IdJugador, IdOrden, IdPartida, TablasDeReglas } from '@conquer/nucleo';

import { ErrorDePersistencia } from '../persistencia/repositorio.ts';
import type { FilaDePartida, Repositorio } from '../persistencia/repositorio.ts';
import type { CanalDeAvisos } from '../avisos/canal.ts';
import { modoPorDefecto } from '../avisos/preferencias.ts';
import { avisosDe } from '../avisos/texto.ts';
import type { ServicioDeAltas } from '../altas/servicio.ts';
import type { ServicioDeCuentas } from '../cuentas/servicio.ts';
import { MODOS_DE_AVISO } from '../persistencia/avisos.ts';
import type { RepositorioDeAvisos } from '../persistencia/avisos.ts';
import type { RepositorioDeCharla } from '../persistencia/charla.ts';
import { MENSAJES_POR_PAGINA, conAutor, textoDeMensaje } from './charla.ts';
import type { ProveedorDeMundo } from '../reloj/mundoDeLaPartida.ts';
import { finDeTurno } from '../reloj/fin-de-turno.ts';
import type { Registro } from '../reloj/registro.ts';
import { ErrorDeApi } from './errores.ts';
import { preverRutaPedida } from './prevision.ts';
import { mercadoDelJugador } from './mercado.ts';
import { historialDeRecursos } from './historial.ts';
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
  /** La charla de cada partida (T-129); si falta, no hay esas rutas. */
  readonly charla?: RepositorioDeCharla;
  /** Alta de partidas (T-065): convocar, unirse, sortear y elegir. */
  readonly altas?: ServicioDeAltas;
  /** Resuelve un turno ya, solo en partidas de prueba (T-061 §4.7); si falta, no hay esa ruta. */
  readonly avanzar?: (
    id: IdPartida,
    opciones: { readonly porElAdministrador: boolean },
  ) => Promise<{ readonly tipo: string }>;
  /**
   * Resuelve el turno si todos los que juegan lo han dado por terminado (T-124); si falta, la marca
   * se guarda igual y el turno espera a su hora.
   */
  readonly alTerminarElTurno?: (id: IdPartida) => Promise<{ readonly tipo: string }>;
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
    if (estado.jugadores[jugador] === undefined) {
      throw new ErrorDeApi(
        'entrada-en-espera',
        'Entras en la partida al resolverse este turno: vuelve entonces y ya tendras tu casa.',
      );
    }
    const mundo = dep.proveedorDeMundo(fila, estado);
    return { fila, jugador, id, estado, mundo, vista: vistaDeJugador(estado, jugador, mundo) };
  }

  const misPartidas: Manejador = async (ctx) => {
    const filas = await dep.repo.partidasDeCuenta(ctx.cuenta);
    const partidas = await Promise.all(
      filas.map(async (p) => {
        // Lo que la lista avisa (T-086): abastecimiento, puesto y si ya dio ordenes este turno.
        const estado = await dep.repo.ultimoEstado(p.partida.id);
        // Quien acaba de pedir entrar aun no esta en el estado: sin resumen hasta el turno.
        const resumen =
          estado === null || estado.jugadores[p.jugador] === undefined
            ? null
            : resumenParaLaLista(
                estado,
                p.jugador,
                dep.proveedorDeMundo(p.partida, estado),
                dep.reglas,
              );
        const pendientes = await dep.repo.ordenesPendientes(p.partida.id);
        return {
          id: p.partida.id,
          nombre: p.partida.nombre,
          casa: p.casa,
          turno: p.partida.turnoActual,
          estado: p.partida.estado,
          proximaResolucion: p.partida.proximaResolucion,
          esDePrueba: p.partida.esDePrueba,
          resumen,
          ordenesDadas: pendientes.filter((o) => o.orden.jugador === p.jugador).length,
        };
      }),
    );
    return { estado: 200, datos: { partidas } };
  };

  const verEstado: Manejador = async (ctx) => {
    const { fila, estado, vista, id, jugador, mundo } = await estadoYVista(ctx);
    return {
      estado: 200,
      datos: {
        turno: estado.turno,
        // Lo que ya puede incorporar, con lo que sabe (T-092): el mapa lo resalta.
        incorporables: comarcasIncorporables(estado, jugador, mundo, dep.reglas),
        estadoDeLaPartida: fila.estado,
        proximaResolucion: fila.proximaResolucion,
        // Quien administra ve el boton de avanzar el turno (T-090).
        esAdministrador: (await dep.repo.administradorDePartida(id)) === ctx.cuenta,
        // Quien convoco puede invitar a mas gente con un enlace (T-125).
        codigoDeInvitacion: (await dep.altas?.codigoParaInvitar(ctx.cuenta, id)) ?? null,
        // Mensajes de la charla que aun no ha leido (T-129): el numerito de la pestanya.
        charlaSinLeer: (await dep.charla?.sinLeer(id, jugador)) ?? 0,
        // Quien ha dado ya por terminado el turno (T-124): se ve en la cabecera.
        finDeTurno: (await finDeTurno(dep.repo, id))?.quienes ?? [],
        vista,
      },
    };
  };

  const verAtlas: Manejador = async (ctx) => {
    const { estado, mundo, vista } = await estadoYVista(ctx);
    return {
      estado: 200,
      datos: { turno: estado.turno, atlas: atlasDeJugador(vista, mundo, dep.reglas) },
    };
  };

  const verHistorial: Manejador = async (ctx) => {
    const { id, jugador, estado } = await estadoYVista(ctx);
    return {
      estado: 200,
      datos: { ...(await historialDeRecursos(dep.repo, id, jugador, estado)) },
    };
  };

  const verMercado: Manejador = async (ctx) => {
    const { id, jugador, estado, mundo, vista } = await estadoYVista(ctx);
    return {
      estado: 200,
      datos: {
        ...(await mercadoDelJugador(dep.repo, id, jugador, estado, vista, mundo, dep.reglas)),
      },
    };
  };

  const preverRuta: Manejador = async (ctx) => {
    const { estado, mundo, vista } = await estadoYVista(ctx);
    const prevision = preverRutaPedida(objetoJson(ctx.peticion.cuerpo), vista, mundo, dep.reglas);
    return { estado: 200, datos: { turno: estado.turno, prevision } };
  };

  const verFicha: Manejador = async (ctx) => {
    const { fila, jugador, id } = await partidaDelJugador(ctx);
    const estado = await dep.repo.ultimoEstado(id);
    if (estado === null) throw new Error(`La partida "${id}" no tiene ningun estado guardado.`);
    const mundo = dep.proveedorDeMundo(fila, estado);
    const pendientes = (await dep.repo.ordenesPendientes(id))
      .filter((o) => o.jugador === jugador)
      .map((o) => o.orden);
    const ficha = fichaDeComarca(
      estado,
      jugador,
      (ctx.parametros['comarca'] ?? '') as IdComarca,
      mundo,
      dep.reglas,
      pendientes,
    );
    if (ficha === null) {
      throw new ErrorDeApi(
        'comarca-desconocida',
        'No sabes nada de esa comarca: explorala o espera a oir de ella.',
      );
    }
    return { estado: 200, datos: { turno: estado.turno, ficha } };
  };

  const avanzar = dep.avanzar;
  // Avanzar el turno a mano (T-090): en una partida de prueba, cualquiera de sus jugadores; en una de
  // verdad, solo quien la administra (quien la convoco). Corta el tiempo de los demas: es un poder del
  // anfitrion, como en VGA Planets cuando todos han mandado su turno.
  const avanzarTurno: Manejador = async (ctx) => {
    const { fila, id } = await partidaDelJugador(ctx);
    const administra = (await dep.repo.administradorDePartida(id)) === ctx.cuenta;
    if (avanzar === undefined || (!fila.esDePrueba && !administra)) {
      throw new ErrorDeApi(
        'solo-en-pruebas',
        'Solo quien administra la partida (quien la convocó) puede avanzar el turno a mano.',
      );
    }
    const resultado = await avanzar(id, { porElAdministrador: administra });
    return { estado: 200, datos: { resultado: resultado.tipo } };
  };

  // Dar por terminado el turno (T-124): cuando lo han hecho todos los que juegan, se resuelve ya y el
  // plazo del siguiente empieza a contar. Se puede deshacer mientras no se haya resuelto.
  const terminarTurno: Manejador = async (ctx) => {
    const { fila, jugador, id } = await estadoYVista(ctx);
    if (fila.estado !== 'activa') {
      throw new ErrorDeApi(
        'partida-detenida',
        `La partida "${id}" esta ${fila.estado}: ya no tiene turnos que terminar.`,
      );
    }
    const pedido = objetoJson(ctx.peticion.cuerpo)['terminado'];
    if (typeof pedido !== 'boolean') {
      throw new ErrorDeApi(
        'cuerpo-invalido',
        'Manda {"terminado": true} para dar el turno por terminado, o false para seguir con él.',
      );
    }
    try {
      await dep.repo.marcarTurnoTerminado(id, jugador, fila.turnoActual, pedido, dep.ahora());
    } catch (error) {
      if (error instanceof ErrorDePersistencia && error.codigo === 'turno-cerrado') {
        throw new ErrorDeApi('turno-cerrado', error.message);
      }
      throw error;
    }
    dep.canal?.publicar({ tipo: 'fin-de-turno', partida: id, turno: fila.turnoActual });
    const resultado = pedido
      ? ((await dep.alTerminarElTurno?.(id))?.tipo ?? 'no-debida')
      : 'no-debida';
    return {
      estado: 200,
      datos: {
        resultado,
        finDeTurno: (await finDeTurno(dep.repo, id))?.quienes ?? [],
      },
    };
  };

  // La charla (T-129): leer, escribir y dar por leido. Solo quien juega; quien espera a entrar, no.
  const repoDeCharla = dep.charla;
  const verCharla =
    (antesDe: (ctx: Contexto) => number | null): Manejador =>
    async (ctx) => {
      if (repoDeCharla === undefined)
        throw new ErrorDeApi('ruta-desconocida', 'Este servidor no tiene charla.');
      const { id, jugador, estado } = await estadoYVista(ctx);
      const mensajes = await repoDeCharla.mensajes(id, antesDe(ctx), MENSAJES_POR_PAGINA);
      return {
        estado: 200,
        datos: {
          mensajes: mensajes.map((m) => conAutor(m, estado)),
          hayMas: mensajes.length === MENSAJES_POR_PAGINA,
          ultimoLeido: await repoDeCharla.ultimoLeido(id, jugador),
          sinLeer: await repoDeCharla.sinLeer(id, jugador),
        },
      };
    };

  const escribirEnLaCharla: Manejador = async (ctx) => {
    if (repoDeCharla === undefined)
      throw new ErrorDeApi('ruta-desconocida', 'Este servidor no tiene charla.');
    const { id, jugador, estado } = await estadoYVista(ctx);
    const texto = textoDeMensaje(objetoJson(ctx.peticion.cuerpo)['texto']);
    const guardado = await repoDeCharla.guardarMensaje(id, jugador, texto, dep.ahora());
    // Lo propio esta leido: no cuenta como pendiente para quien lo escribe.
    await repoDeCharla.marcarLeidos(id, jugador, guardado.id);
    const mensaje = conAutor(guardado, estado);
    dep.canal?.publicar({ tipo: 'mensaje', partida: id, mensaje });
    return { estado: 201, datos: { mensaje } };
  };

  const leerLaCharla: Manejador = async (ctx) => {
    if (repoDeCharla === undefined)
      throw new ErrorDeApi('ruta-desconocida', 'Este servidor no tiene charla.');
    const { id, jugador } = await estadoYVista(ctx);
    const hasta = objetoJson(ctx.peticion.cuerpo)['hasta'];
    if (typeof hasta !== 'number' || !Number.isSafeInteger(hasta) || hasta < 0) {
      throw new ErrorDeApi(
        'cuerpo-invalido',
        'Manda {"hasta": n} con el identificador del último mensaje que has leído.',
      );
    }
    await repoDeCharla.marcarLeidos(id, jugador, hasta);
    return { estado: 200, datos: { sinLeer: await repoDeCharla.sinLeer(id, jugador) } };
  };

  const clasificacion: Manejador = async (ctx) => {
    const { estado, vista, jugador, mundo } = await estadoYVista(ctx);
    return {
      estado: 200,
      datos: {
        turno: estado.turno,
        clasificacion: vista.clasificacion,
        // El prestigio y su desglose son publicos; los hitos con fecha, solo los propios (T-085).
        publica: clasificacionPublica(estado, jugador, mundo, dep.reglas),
      },
    };
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
    // Un segundo regalo al mismo concejo no suma: solo dejaria maravedis comprometidos (T-090).
    if (
      orden.tipo === 'regalo' &&
      regaloYaPedido([...estado.ordenes, ...pendientes.map((o) => o.orden)], jugador, orden.comarca)
    ) {
      throw new ErrorDeApi(
        'orden-invalida',
        'Ya tienes un regalo pedido para ese concejo: acepta uno cada pocos turnos. Espera a que se entregue el que está pedido.',
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
          // ——— Contrasenyas (T-091): mismas respuestas exista o no la cuenta ———
          {
            metodo: 'POST',
            patron: '/cuentas/registro',
            manejador: publica(async (base) => {
              const cuerpo = objetoJson(base.peticion.cuerpo);
              await cuentas.registrar(
                cuerpo['correo'],
                cuerpo['nombre'],
                cuerpo['clave'],
                base.origen,
              );
              return {
                estado: 202,
                datos: {
                  mensaje:
                    'Te hemos mandado un correo para confirmar tu cuenta: ábrelo y ya podrás entrar. Si ya tenías cuenta con ese correo, te lo decimos allí.',
                },
              };
            }),
          },
          {
            metodo: 'POST',
            patron: '/sesion/clave',
            manejador: publica(async (base) => {
              const cuerpo = objetoJson(base.peticion.cuerpo);
              const abierta = await cuentas.entrarConClave(
                cuerpo['correo'],
                cuerpo['clave'],
                cuerpo['recordar'],
                base.origen,
              );
              return {
                estado: 200,
                datos: { cuenta: { id: abierta.cuenta.id, nombre: abierta.cuenta.nombre } },
                cabeceras: { 'set-cookie': abierta.setCookie },
              };
            }),
          },
          {
            metodo: 'POST',
            patron: '/cuentas/olvido',
            manejador: publica(async (base) => {
              const cuerpo = objetoJson(base.peticion.cuerpo);
              await cuentas.pedirRestablecimiento(cuerpo['correo'], base.origen);
              return {
                estado: 202,
                datos: {
                  mensaje:
                    'Si ese correo tiene cuenta, te hemos mandado un enlace para poner una contraseña nueva. Dura 30 minutos.',
                },
              };
            }),
          },
          {
            metodo: 'POST',
            patron: '/cuentas/restablecer',
            manejador: publica(async (base) => {
              const cuerpo = objetoJson(base.peticion.cuerpo);
              const abierta = await cuentas.restablecer(
                cuerpo['token'],
                cuerpo['clave'],
                base.origen,
              );
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
        if (evento.tipo === 'mensaje') {
          escribir(`event: mensaje\ndata: ${JSON.stringify(evento.mensaje)}\n\n`);
          return;
        }
        if (evento.tipo === 'fin-de-turno') {
          void finDeTurno(dep.repo, id).then((fin) => {
            if (fin === null || fin.turno !== evento.turno) return;
            const datos = { turno: fin.turno, quienes: fin.quienes };
            escribir(`event: fin-de-turno\ndata: ${JSON.stringify(datos)}\n\n`);
          });
          return;
        }
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
            // Publica (T-125): quien abre un enlace de invitacion aun puede no tener cuenta.
            metodo: 'GET',
            patron: '/invitaciones/:codigo',
            manejador: publica(async (base) => ({
              estado: 200,
              datos: { invitacion: await altas.invitacion(base.parametros['codigo'] ?? '') },
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
            metodo: 'POST',
            patron: '/partidas/entrada/ofertas',
            manejador: privada(async (ctx) => ({
              estado: 200,
              datos: await altas.ofertasParaEntrar(
                ctx.cuenta,
                objetoJson(ctx.peticion.cuerpo),
                dep.proveedorDeMundo,
              ),
            })),
          },
          {
            metodo: 'POST',
            patron: '/partidas/entrada',
            manejador: privada(async (ctx) => ({
              estado: 200,
              datos: await altas.entrarEnPartida(
                ctx.cuenta,
                objetoJson(ctx.peticion.cuerpo),
                dep.proveedorDeMundo,
              ),
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
            patron: '/convocatorias/:id/fundar',
            manejador: privada(async (ctx) => ({
              estado: 200,
              datos: { convocatoria: await altas.fundarYa(ctx.cuenta, ctx.parametros['id'] ?? '') },
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
    { metodo: 'GET', patron: '/partidas/:id/comarcas/:comarca', manejador: privada(verFicha) },
    { metodo: 'POST', patron: '/partidas/:id/avanzar', manejador: privada(avanzarTurno) },
    { metodo: 'PUT', patron: '/partidas/:id/fin-de-turno', manejador: privada(terminarTurno) },
    ...(repoDeCharla === undefined
      ? []
      : [
          {
            metodo: 'GET',
            patron: '/partidas/:id/charla',
            manejador: privada(verCharla(() => null)),
          },
          {
            metodo: 'GET',
            patron: '/partidas/:id/charla/antes/:mensaje',
            manejador: privada(
              verCharla((ctx) => {
                const n = Number(ctx.parametros['mensaje']);
                return Number.isSafeInteger(n) && n > 0 ? n : null;
              }),
            ),
          },
          {
            metodo: 'POST',
            patron: '/partidas/:id/charla',
            manejador: privada(escribirEnLaCharla),
          },
          {
            metodo: 'PUT',
            patron: '/partidas/:id/charla/leidos',
            manejador: privada(leerLaCharla),
          },
        ]),
    { metodo: 'POST', patron: '/partidas/:id/prevision-de-ruta', manejador: privada(preverRuta) },
    { metodo: 'GET', patron: '/partidas/:id/mercado', manejador: privada(verMercado) },
    {
      metodo: 'GET',
      patron: '/partidas/:id/historial-de-recursos',
      manejador: privada(verHistorial),
    },
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
