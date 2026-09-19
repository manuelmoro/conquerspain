// El prestigio de un jugador, por capitulos (docs/06-competicion.md §6.3; ficha T-043 §4.1).
//
// Se recalcula entero a partir del estado cada vez que se pide: lo que ya paso y no se puede
// deducir del estado (obras terminadas, anyos trashumantes, ferias, perdidas, escaseces, hitos) se
// lee del registro del jugador, que no se deriva de nada. Asi no hay derivas por acumular.
import type { EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type { Hito, TablasDeReglas } from '../tipos/reglas.ts';
import { HITOS, TIPOS_DE_OBRA_MAYOR } from '../tipos/reglas.ts';

export const CAPITULOS_DE_PRESTIGIO = [
  'poblacion',
  'territorio',
  'obras',
  'caminos',
  'comercio',
  'exploracion',
  'ganaderia',
  'industria',
  'hitos',
] as const;
export type CapituloDePrestigio = (typeof CAPITULOS_DE_PRESTIGIO)[number];

export interface Prestigio {
  readonly total: number;
  readonly capitulos: Readonly<Record<CapituloDePrestigio, number>>;
  /** Lo que se resta, en positivo: comarcas perdidas y turnos de escasez. */
  readonly penalizaciones: number;
}

/** Los hitos en los que el jugador fue el primero de la partida. */
export function primiciasDe(estado: EstadoPartida, jugador: EstadoJugador): Hito[] {
  return HITOS.filter((hito) => estado.primicias[hito] === jugador.id);
}

export function prestigioDe(
  estado: EstadoPartida,
  jugador: EstadoJugador,
  reglas: TablasDeReglas,
): Prestigio {
  const t = reglas.prestigio;
  const r = jugador.registro;
  const propias = Object.values(estado.comarcas).filter((c) => c.duenyo === jugador.id);
  const vecinos = propias.reduce((total, comarca) => total + comarca.poblacion, 0);
  const exploradas = Object.values(jugador.conocimiento).filter(
    (c) => c.nivel === 'explorada' || c.nivel === 'propia',
  ).length;
  const hitos = HITOS.filter((hito) => jugador.hitos[hito] !== undefined);

  const capitulos: Record<CapituloDePrestigio, number> = {
    poblacion: Math.floor(vecinos / 5) * t.porCadaCincoVecinos,
    territorio: propias.reduce(
      (total, c) => total + (c.fuero === 'fuero' ? t.porComarcaConFuero : t.porComarca),
      0,
    ),
    obras: TIPOS_DE_OBRA_MAYOR.reduce(
      (total, tipo) => total + (r.obrasMayores[tipo] ?? 0) * t.porObraMayor[tipo],
      0,
    ),
    caminos: (r.obrasMayores.calzada ?? 0) * t.porTramoDeCamino,
    comercio: r.feriasDestacadas * t.porFeriaDestacada,
    exploracion: exploradas * t.porComarcaExplorada,
    ganaderia: r.anyosTrashumantes * t.porAnyoTrashumante,
    industria: propias.filter((c) => c.aperos >= t.nivelDeAperosAltos).length * t.porAperosAltos,
    hitos:
      hitos.reduce((total, hito) => total + reglas.hitos[hito].prestigio, 0) +
      primiciasDe(estado, jugador).length * t.porPrimicia,
  };
  const penalizaciones =
    r.comarcasPerdidas * t.penalizacionPorComarcaPerdida +
    r.turnosConEscasez * t.penalizacionPorEscasez;
  const suma = Object.values(capitulos).reduce((total, puntos) => total + puntos, 0);
  return { total: suma - penalizaciones, capitulos, penalizaciones };
}
