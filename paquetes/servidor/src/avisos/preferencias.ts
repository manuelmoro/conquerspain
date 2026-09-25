// La preferencia por defecto depende del ritmo (ficha T-064 §4.4): una partida de una hora no puede
// mandar veinticuatro correos al dia.
import type { ModoDeAviso } from '../persistencia/avisos.ts';

/** Intervalo a partir del cual se avisa cada turno por defecto: 6 horas. */
export const INTERVALO_PARA_CADA_TURNO_SEGUNDOS = 6 * 60 * 60;

export function modoPorDefecto(intervaloSegundos: number): ModoDeAviso {
  return intervaloSegundos >= INTERVALO_PARA_CADA_TURNO_SEGUNDOS ? 'cada-turno' : 'diario';
}
