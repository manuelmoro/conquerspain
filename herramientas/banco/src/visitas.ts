// Que comarcas pisa alguien de verdad (fichas T-048 §4.2 y T-047).
//
// Mirar donde acaba el turno una unidad no basta: una recua puede cruzar tres comarcas en un turno
// y no quedarse en ninguna. Las recuas y los rebanyos lo cuentan ellos, con un suceso por comarca
// en la que entran (`recua.entra` y `rebanyo.entra`), asi que la cuenta es exacta.
import type { EstadoPartida, IdComarca, SituacionMovil } from '@conquer/nucleo';

/** Los sucesos que dicen en que comarca entra una unidad que se mueve. */
export const SUCESOS_DE_ENTRADA: readonly string[] = ['recua.entra', 'rebanyo.entra'];

function donde(situacion: SituacionMovil): IdComarca {
  return situacion.donde === 'comarca' ? situacion.comarca : situacion.desde;
}

/**
 * Las comarcas que ha pisado alguien en el turno recien resuelto: las de los sucesos de entrada y
 * la de la posicion de cada unidad, que puede no haberse movido.
 */
export function pasoDelTurno(
  ahora: EstadoPartida,
  entradas: readonly IdComarca[],
): ReadonlySet<IdComarca> {
  const comarcas = new Set<IdComarca>(entradas);
  for (const unidad of [...Object.values(ahora.recuas), ...Object.values(ahora.rebanyos)]) {
    comarcas.add(donde(unidad.situacion));
  }
  return comarcas;
}
