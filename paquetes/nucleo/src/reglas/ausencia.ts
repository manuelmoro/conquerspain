// Ausencia y amparo (docs/06 §6.4.3 y §6.4.4; ficha T-105). Funciones puras: en que escalon de
// ausencia esta una casa, si esta amparada y si una comarca se puede cortejar.
import type { EstadoComarca, EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import { noPuedeCortejar } from './contratos.ts';
import type { IdJugador } from '../tipos/ids.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';

export const SITUACIONES_DE_AUSENCIA = ['presente', 'ausente', 'concejo'] as const;
export type SituacionDeAusencia = (typeof SITUACIONES_DE_AUSENCIA)[number];

export function situacionDeAusencia(
  jugador: EstadoJugador,
  reglas: TablasDeReglas,
): SituacionDeAusencia {
  const turnos = jugador.turnosSinOrdenes;
  if (turnos >= reglas.ausencia.turnosParaConcejo) return 'concejo';
  if (turnos >= reglas.ausencia.turnosParaAusente) return 'ausente';
  return 'presente';
}

/** Esta amparado este turno: quien entra tarde, sus primeros turnos (T-105 §3). */
export function estaAmparado(jugador: EstadoJugador, turno: number): boolean {
  return jugador.amparoHasta !== undefined && turno <= jugador.amparoHasta;
}

/**
 * La comarca de una casa en administracion del concejo se corteja como una neutral, salvo su
 * capital y salvo que la casa este amparada.
 */
export function enManosDelConcejo(
  estado: EstadoPartida,
  comarca: EstadoComarca,
  reglas: TablasDeReglas,
): boolean {
  if (comarca.duenyo === null) return false;
  const duenyo = estado.jugadores[comarca.duenyo];
  if (duenyo === undefined || duenyo.capital === comarca.id) return false;
  return situacionDeAusencia(duenyo, reglas) === 'concejo' && !estaAmparado(duenyo, estado.turno);
}

/** Un jugador puede cortejar la comarca: es neutral, o esta en manos del concejo y no es suya. */
export function cortejable(
  estado: EstadoPartida,
  comarca: EstadoComarca,
  jugador: IdJugador,
  reglas: TablasDeReglas,
): boolean {
  // Quien se comprometio a no cortejarla no la corteja (T-123).
  if (noPuedeCortejar(estado, jugador, comarca.id)) return false;
  if (comarca.duenyo === null) return true;
  return comarca.duenyo !== jugador && enManosDelConcejo(estado, comarca, reglas);
}
