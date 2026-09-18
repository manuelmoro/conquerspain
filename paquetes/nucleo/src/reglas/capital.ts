// Traslado de la corte (docs/03-economia.md §3.9; ficha T-036 §4.6).
import type { EstadoJugador, EstadoPartida } from '../tipos/estado.ts';

export type MotivoSinTraslado = 'comarca-ajena' | 'ya-es-capital' | 'traslado-en-marcha';

/** Por que no se puede trasladar la corte a esa comarca, o null si se puede. */
export function impedimentoDeTraslado(
  jugador: EstadoJugador,
  destino: string,
  estado: EstadoPartida,
): MotivoSinTraslado | null {
  if (estado.comarcas[destino]?.duenyo !== jugador.id) return 'comarca-ajena';
  if (jugador.capital === destino) return 'ya-es-capital';
  if (jugador.traslado !== null) return 'traslado-en-marcha';
  return null;
}
