// Las rutas de la API (ficha T-062 §4.3). Toda respuesta de estado pasa por `vistaDeJugador`: ninguna
// ruta devuelve el estado completo ni los sucesos crudos.
import {
  VERSION_REGLAS,
  canonico,
  construirOrden,
  explicar,
  validarIntencion,
  vistaDeJugador,
} from '@conquer/nucleo';
import type { IdJugador, IdOrden, IdPartida, TablasDeReglas } from '@conquer/nucleo';

import { ErrorDePersistencia } from '../persistencia/repositorio.ts';
import type { FilaDePartida, Repositorio } from '../persistencia/repositorio.ts';
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
import type { Autenticador, PeticionHttp, RespuestaHttp } from './tipos.ts';

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
}

interface Contexto {
  readonly cuenta: string;
  readonly parametros: Readonly<Record<string, string>>;
  readonly peticion: PeticionHttp;
}

interface Salida {
  readonly estado: number;
  readonly datos: Record<string, unknown>;
}

type Manejador = (ctx: Contexto) => Promise<Salida>;

const CABECERAS_JSON = { 'content-type': 'application/json; charset=utf-8' };

function respuesta(estado: number, cuerpo: Record<string, unknown>, cabeceras = {}): RespuestaHttp {
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
    if (ctx.peticion.cuerpo === null || ctx.peticion.cuerpo.trim() === '') {
      throw new ErrorDeApi(
        'cuerpo-invalido',
        'Falta el cuerpo: manda la orden como un objeto JSON.',
      );
    }
    let dato: unknown;
    try {
      dato = JSON.parse(ctx.peticion.cuerpo);
    } catch {
      throw new ErrorDeApi(
        'cuerpo-invalido',
        'El cuerpo no es JSON valido: revisa las comillas y las comas.',
      );
    }
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

  const rutas: readonly Ruta<Manejador>[] = [
    { metodo: 'GET', patron: '/partidas/mias', manejador: misPartidas },
    { metodo: 'GET', patron: '/partidas/:id/estado', manejador: verEstado },
    { metodo: 'GET', patron: '/partidas/:id/clasificacion', manejador: clasificacion },
    { metodo: 'GET', patron: '/partidas/:id/cronica/:turno', manejador: verCronica },
    { metodo: 'GET', patron: '/partidas/:id/ordenes', manejador: listarOrdenes },
    { metodo: 'POST', patron: '/partidas/:id/ordenes', manejador: darOrden },
    { metodo: 'DELETE', patron: '/partidas/:id/ordenes/:orden', manejador: retirarOrden },
  ];

  return async (peticion) => {
    try {
      if (Buffer.byteLength(peticion.cuerpo ?? '', 'utf8') > CUERPO_MAXIMO_BYTES) {
        throw new ErrorDeApi(
          'cuerpo-demasiado-grande',
          `El cuerpo pasa de ${String(CUERPO_MAXIMO_BYTES / 1024)} KiB: manda menos cosas en cada orden.`,
        );
      }
      const encontrada = encontrar(rutas, peticion.metodo, peticion.ruta);
      const cuenta = await dep.autenticador.identificar(peticion);
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
      const salida = await encontrada.manejador({
        cuenta,
        parametros: encontrada.parametros,
        peticion,
      });
      return respuesta(salida.estado, salida.datos);
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
