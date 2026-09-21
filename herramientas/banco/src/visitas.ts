// Que comarcas pisa alguien de verdad (ficha T-048 §4.2).
//
// Mirar donde acaba el turno una unidad no basta: una recua puede cruzar tres comarcas en un turno
// y no quedarse en ninguna. Las recuas lo cuentan ellas (suceso `recua.entra`, uno por comarca en
// la que entran); los rebanyos no tienen ese suceso, asi que su paso se reconstruye de lo que se
// les ha consumido de la ruta. Si esa reconstruccion no cuadra, se dice: una cuenta de visitas
// incompleta es una cota inferior, y el informe tiene que avisar de ello.
import type { EstadoPartida, IdComarca, SituacionMovil } from '@conquer/nucleo';

export interface PasoDelTurno {
  /** Comarcas pisadas este turno, sin repetir y sin ordenar. */
  readonly comarcas: ReadonlySet<IdComarca>;
  /** False si alguna unidad se movio y no se pudo saber por donde. */
  readonly completo: boolean;
}

function donde(situacion: SituacionMovil): IdComarca {
  return situacion.donde === 'comarca' ? situacion.comarca : situacion.desde;
}

/**
 * El trozo de ruta que se ha consumido, o null si la ruta de ahora no es el final de la de antes
 * (le dieron una ruta nueva en el mismo turno y ya no se puede saber por donde paso).
 */
export function prefijoConsumido(
  antes: readonly IdComarca[],
  ahora: readonly IdComarca[],
): readonly IdComarca[] | null {
  if (ahora.length > antes.length) return null;
  const corte = antes.length - ahora.length;
  for (let i = 0; i < ahora.length; i += 1) {
    if (antes[corte + i] !== ahora[i]) return null;
  }
  return antes.slice(0, corte);
}

/**
 * Las comarcas que ha pisado alguien en el turno recien resuelto: las de los sucesos `recua.entra`,
 * las de la posicion de cada unidad y las que los rebanyos se han quitado de la ruta.
 */
export function pasoDelTurno(
  anterior: EstadoPartida | null,
  ahora: EstadoPartida,
  entradasDeRecua: readonly IdComarca[],
): PasoDelTurno {
  const comarcas = new Set<IdComarca>(entradasDeRecua);
  let completo = true;
  for (const unidad of [...Object.values(ahora.recuas), ...Object.values(ahora.rebanyos)]) {
    comarcas.add(donde(unidad.situacion));
  }
  for (const rebanyo of Object.values(ahora.rebanyos)) {
    const antes = anterior?.rebanyos[rebanyo.id];
    if (antes === undefined) continue;
    const pasadas = prefijoConsumido(antes.ruta, rebanyo.ruta);
    if (pasadas === null) {
      completo = false;
      continue;
    }
    for (const comarca of pasadas) comarcas.add(comarca);
  }
  // Un rebanyo que desaparece con ruta pendiente se lleva su ultimo tramo sin contar.
  for (const rebanyo of Object.values(anterior?.rebanyos ?? {})) {
    if (ahora.rebanyos[rebanyo.id] !== undefined) continue;
    comarcas.add(donde(rebanyo.situacion));
    if (rebanyo.ruta.length > 0) completo = false;
  }
  return { comarcas, completo };
}
