// Un regalo al concejo por comarca y por vez (docs/03 §3.9): si ya hay uno pedido, en espera o en
// cola, otro igual no suma nada y solo deja maravedis comprometidos. La ficha lo bloquea y el
// servidor no lo admite; una sola cuenta para los dos.
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import type { Orden } from '../tipos/ordenes.ts';

const ACABADAS: ReadonlySet<Orden['estado']> = new Set(['terminada', 'cancelada']);

/** True si `jugador` ya tiene un regalo vivo para el concejo de `comarca` entre `ordenes`. */
export function regaloYaPedido(
  ordenes: readonly Orden[],
  jugador: IdJugador,
  comarca: IdComarca,
): boolean {
  return ordenes.some(
    (o) =>
      o.tipo === 'regalo' &&
      o.jugador === jugador &&
      o.comarca === comarca &&
      !ACABADAS.has(o.estado),
  );
}
