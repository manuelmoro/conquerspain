// Lo que comparten las pruebas de persistencia: una partida real (mundo recortado, casas de
// verdad) y la resolucion de un turno lista para guardar. No es codigo de produccion.
import { fileURLToPath } from 'node:url';

import { cargarMundo } from '@conquer/mundo';
import {
  CASAS,
  TABLAS_DEL_JUEGO,
  VERSION_NUCLEO,
  VERSION_REGLAS,
  explicar,
  fundarPartida,
  huella,
  prepararPartida,
  resolverTurno,
} from '@conquer/nucleo';
import type {
  Casa,
  EstadoPartida,
  IdComarca,
  IdJugador,
  IdOrden,
  IdPartida,
  Mundo,
  Orden,
  Participante,
} from '@conquer/nucleo';

import type { NuevaPartida, ResolucionDeTurno } from './repositorio.ts';

const RUTA_MUNDO = fileURLToPath(new URL('../../../mundo/datos/mundo.v1.json', import.meta.url));

export const AHORA = 1_800_000_000_000;
export const INTERVALO_SEGUNDOS = 86_400;

let mundoCargado: Mundo | null = null;

export function mundoPeninsula(): Mundo {
  if (mundoCargado !== null) return mundoCargado;
  const resultado = cargarMundo(RUTA_MUNDO);
  if (!resultado.ok) throw new Error(`El mundo no valida:\n${explicar(resultado.errores)}`);
  mundoCargado = resultado.valor;
  return mundoCargado;
}

export interface PartidaDePrueba {
  readonly estado: EstadoPartida;
  readonly mundo: Mundo;
}

/** Una partida recien fundada con estas casas, en el mapa recortado a los que juegan. */
export function partidaDePrueba(
  casas: readonly Casa[] = ['mesta', 'monjes'],
  semilla = '1492',
  id = 'prueba-1',
): PartidaDePrueba {
  const participantes: Participante[] = casas.map((casa) => ({
    id: casa as string as IdJugador,
    nombre: `Jugador ${casa}`,
    casa,
  }));
  const preparada = prepararPartida({
    mundo: mundoPeninsula(),
    reglas: TABLAS_DEL_JUEGO,
    semilla,
    participantes,
    recortar: true,
    origenesFijos: {},
  });
  if (!preparada.ok) throw new Error(`No se prepara:\n${explicar(preparada.errores)}`);
  const elecciones: Record<string, IdComarca> = {};
  for (const p of participantes) {
    const primera = preparada.valor.ofertas[p.id]?.[0];
    if (primera === undefined) throw new Error(`Sin oferta para ${p.nombre}`);
    elecciones[p.id] = primera.comarca;
  }
  const estado = fundarPartida({
    preparada: preparada.valor,
    reglas: TABLAS_DEL_JUEGO,
    semilla,
    participantes,
    elecciones,
    id: id as IdPartida,
    configuracion: {
      nombre: 'Partida de prueba',
      intervaloMinutos: INTERVALO_SEGUNDOS / 60,
      modo: casas.length === 1 ? 'solitario' : 'vecindad',
      turnosDeTemporada: null,
      reservaMinimaDePan: 30,
      esDePrueba: true,
    },
  });
  if (!estado.ok) throw new Error(`No se funda:\n${explicar(estado.errores)}`);
  return { estado: estado.valor, mundo: preparada.valor.mundo };
}

export const TODAS_LAS_CASAS: readonly Casa[] = CASAS;

export function datosDePartida(estado: EstadoPartida, mundo: Mundo): NuevaPartida {
  return {
    id: estado.id,
    nombre: estado.configuracion.nombre,
    semilla: estado.semilla,
    versionReglas: VERSION_REGLAS,
    huellaMundo: huella(mundo),
    intervaloSegundos: INTERVALO_SEGUNDOS,
    ancla: AHORA,
    proximaResolucion: AHORA + INTERVALO_SEGUNDOS * 1000,
    esDePrueba: true,
    participantes: Object.values(estado.jugadores).map((j) => ({
      jugador: j.id,
      casa: j.casa,
      cuenta: null,
    })),
  };
}

/** Resuelve un turno con el motor y lo deja como lo entregara el reloj de T-061. */
export function resolverParaGuardar(
  estado: EstadoPartida,
  mundo: Mundo,
  ordenes: readonly Orden[] = [],
): ResolucionDeTurno {
  const inicio = performance.now();
  const resultado = resolverTurno(estado, ordenes, mundo, TABLAS_DEL_JUEGO);
  return {
    partida: estado.id,
    turnoResuelto: estado.turno,
    estadoNuevo: resultado.estado,
    cronicas: resultado.cronicas,
    sucesos: resultado.sucesos,
    ordenesAplicadas: ordenes.map((o) => o.id),
    ordenesRechazadas: [],
    auditoria: {
      huellaEntrada: huella(estado),
      huellaSalida: huella(resultado.estado),
      huellaOrdenes: huella(ordenes),
      ordenes: ordenes.length,
      duracionMs: Math.round(performance.now() - inicio),
      versionReglas: VERSION_REGLAS,
      versionNucleo: VERSION_NUCLEO,
    },
    proximaResolucion: AHORA + INTERVALO_SEGUNDOS * 1000 * (estado.turno + 1),
  };
}

/** Una orden entrante con forma valida (no hace falta que el motor la ejecute). */
export function ordenDeEjemplo(
  id: string,
  jugador: IdJugador,
  comarca: IdComarca,
  turnoAlta = 1,
): Orden {
  return {
    id: id as IdOrden,
    jugador,
    turnoAlta,
    estado: 'pendiente',
    coste: { pan: 0, madera: 10, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 },
    turnosTotales: 2,
    turnosHechos: 0,
    motivoEspera: null,
    delMayordomo: false,
    turnoProgramado: null,
    cola: null,
    tipo: 'construir',
    comarca,
    edificio: 'granja',
  };
}
