// Lo que la Mesta sabe de sus canyadas al empezar (ficha T-058 §4.1).
//
// Las ovejas subian a Urbion en mayo y bajaban a Extremadura por San Miguel: la Mesta no tenia que
// descubrir adonde bajar. Quien tiene el permiso `conoceLasCanyadas` empieza conociendo la canyada
// real mas cercana a su capital, entera, y el camino hasta ella.
import type { IdComarca } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import { comparar } from '../utiles/orden.ts';
import type { IndiceDeCaminos } from './distancias.ts';
import { caminoMasCorto, indiceDeCaminos, jornadasDesde } from './distancias.ts';

/** Las canyadas reales que pasan por cada comarca, por su nombre. */
function canyadasPorComarca(mundo: Mundo): Map<string, Set<string>> {
  const por = new Map<string, Set<string>>();
  for (const camino of mundo.caminos) {
    if (camino.canyada === null) continue;
    for (const comarca of [camino.desde, camino.hasta]) {
      const suyas = por.get(comarca) ?? new Set<string>();
      suyas.add(camino.canyada);
      por.set(comarca, suyas);
    }
  }
  return por;
}

/**
 * Las comarcas que conoce desde el turno 1 quien tiene el permiso: las de las canyadas que pasan
 * por la comarca de canyada mas cercana a la capital (en jornadas base; a igualdad, la de menor
 * identificador) y las del camino mas corto hasta ella. Sin la capital, que ya es propia, y en orden
 * de identificador. Vacio si no hay canyadas en el mapa o no se llega a ninguna.
 */
export function comarcasDeSuCanyada(
  mundo: Mundo,
  capital: IdComarca,
  indice: IndiceDeCaminos = indiceDeCaminos(mundo),
): IdComarca[] {
  const canyadas = canyadasPorComarca(mundo);
  const distancias = jornadasDesde(mundo, capital, indice);
  let cercana: IdComarca | null = null;
  let mejor = Number.POSITIVE_INFINITY;
  for (const comarca of [...canyadas.keys()].sort(comparar)) {
    const lejos = distancias.get(comarca);
    if (lejos !== undefined && lejos < mejor) {
      mejor = lejos;
      cercana = comarca as IdComarca;
    }
  }
  if (cercana === null) return [];

  const suyas = canyadas.get(cercana) ?? new Set<string>();
  const conocidas = new Set<string>(caminoMasCorto(mundo, capital, cercana, indice));
  for (const [comarca, nombres] of canyadas) {
    if ([...nombres].some((nombre) => suyas.has(nombre))) conocidas.add(comarca);
  }
  conocidas.delete(capital);
  return [...conocidas].sort(comparar) as IdComarca[];
}
