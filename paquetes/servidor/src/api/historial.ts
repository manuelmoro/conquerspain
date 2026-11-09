// El historico de los recursos de un jugador (T-090): por turno y recurso, lo que entro, lo que salio y
// lo que quedo, de los ultimos turnos. Sale de sus propios movimientos de almacen: nada de otras casas.
import { recursosSegun } from '@conquer/nucleo';
import type { IdJugador, IdPartida, Recurso } from '@conquer/nucleo';

import type { Repositorio } from '../persistencia/repositorio.ts';

/** Cuantos turnos hacia atras: un anyo. */
export const TURNOS_DE_HISTORIAL = 24;

export interface CuentaDelTurno {
  readonly entra: number;
  readonly sale: number;
  /** Lo que habia al acabar el turno. */
  readonly queda: number;
}

export interface TurnoDelHistorial {
  readonly turno: number;
  readonly recursos: Readonly<Record<Recurso, CuentaDelTurno>>;
}

export async function historialDeRecursos(
  repo: Pick<Repositorio, 'estado' | 'movimientosDeAlmacen'>,
  partida: IdPartida,
  jugador: IdJugador,
  turnoActual: number,
): Promise<readonly TurnoDelHistorial[]> {
  const hasta = turnoActual - 1;
  const desde = Math.max(1, hasta - TURNOS_DE_HISTORIAL + 1);
  if (hasta < desde) return [];
  // Lo que habia al empezar el primer turno mirado, y de ahi se suman los movimientos.
  const inicial = (await repo.estado(partida, desde))?.jugadores[jugador]?.almacen;
  const movimientos = await repo.movimientosDeAlmacen(partida, jugador, desde, hasta);
  const queda: Record<Recurso, number> = { ...recursosSegun((r) => inicial?.[r] ?? 0) };
  const turnos: TurnoDelHistorial[] = [];
  for (let turno = desde; turno <= hasta; turno += 1) {
    const cuenta = (r: Recurso): CuentaDelTurno => {
      let entra = 0;
      let sale = 0;
      for (const m of movimientos) {
        if (m.turno !== turno || m.recurso !== r) continue;
        if (m.delta > 0) entra += m.delta;
        else sale -= m.delta;
      }
      queda[r] += entra - sale;
      return { entra, sale, queda: queda[r] };
    };
    turnos.push({
      turno,
      recursos: {
        pan: cuenta('pan'),
        madera: cuenta('madera'),
        piedra: cuenta('piedra'),
        maravedis: cuenta('maravedis'),
        sal: cuenta('sal'),
        hierro: cuenta('hierro'),
        lana: cuenta('lana'),
      },
    });
  }
  return turnos;
}
