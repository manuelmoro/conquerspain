// Distancias del mapa en jornadas base (ficha T-049 §4.2).
//
// Son las jornadas del tramo tal cual: sin estacion, sin barro y sin obras. El recorte y la
// separacion entre capitales no pueden depender del mes en que se cree la partida.
import type { IdComarca } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import { comparar } from '../utiles/orden.ts';

interface Salida {
  readonly hacia: IdComarca;
  readonly jornadas: number;
}

/** Las salidas de cada comarca, montadas una sola vez: recorrer los caminos por cada origen es caro. */
export type IndiceDeCaminos = ReadonlyMap<string, readonly Salida[]>;

export function indiceDeCaminos(mundo: Mundo): IndiceDeCaminos {
  const salidas = new Map<string, Salida[]>();
  const anyadir = (desde: IdComarca, hacia: IdComarca, jornadas: number): void => {
    const suyas = salidas.get(desde) ?? [];
    suyas.push({ hacia, jornadas });
    salidas.set(desde, suyas);
  };
  for (const camino of mundo.caminos) {
    anyadir(camino.desde, camino.hasta, camino.jornadasBase);
    anyadir(camino.hasta, camino.desde, camino.jornadasBase);
  }
  for (const [id, suyas] of salidas) {
    salidas.set(
      id,
      [...suyas].sort((a, b) => a.jornadas - b.jornadas || comparar(a.hacia, b.hacia)),
    );
  }
  return salidas;
}

/**
 * Jornadas base desde una comarca a todas las que alcanza (Dijkstra). Las comarcas a las que no se
 * llega no salen en el resultado.
 */
export function jornadasDesde(
  mundo: Mundo,
  origen: IdComarca,
  indice: IndiceDeCaminos = indiceDeCaminos(mundo),
  /** Limitar el recorrido a estas comarcas; por defecto, todo el mundo. */
  dentro?: ReadonlySet<string>,
): Map<string, number> {
  const distancia = new Map<string, number>([[origen, 0]]);
  const pendientes = new Set<string>([origen]);
  const hechas = new Set<string>();
  while (pendientes.size > 0) {
    let actual: string | null = null;
    let mejor = Number.POSITIVE_INFINITY;
    for (const id of [...pendientes].sort(comparar)) {
      const suya = distancia.get(id) ?? Number.POSITIVE_INFINITY;
      if (suya < mejor) {
        mejor = suya;
        actual = id;
      }
    }
    if (actual === null) break;
    pendientes.delete(actual);
    hechas.add(actual);
    for (const { hacia, jornadas } of indice.get(actual) ?? []) {
      if (dentro !== undefined && !dentro.has(hacia)) continue;
      const nueva = mejor + jornadas;
      if (nueva < (distancia.get(hacia) ?? Number.POSITIVE_INFINITY)) {
        distancia.set(hacia, nueva);
        if (!hechas.has(hacia)) pendientes.add(hacia);
      }
    }
  }
  return distancia;
}

/** El camino mas corto entre dos comarcas, las dos incluidas; vacio si no se llega. */
export function caminoMasCorto(
  mundo: Mundo,
  desde: IdComarca,
  hasta: IdComarca,
  indice: IndiceDeCaminos = indiceDeCaminos(mundo),
): IdComarca[] {
  const distancia = jornadasDesde(mundo, desde, indice);
  if (!distancia.has(hasta)) return [];
  const camino: IdComarca[] = [hasta];
  let actual = hasta;
  while (actual !== desde) {
    const suya = distancia.get(actual) ?? 0;
    const anterior = (indice.get(actual) ?? []).find(
      (salida) =>
        (distancia.get(salida.hacia) ?? Number.POSITIVE_INFINITY) + salida.jornadas === suya,
    );
    if (anterior === undefined) return [];
    camino.push(anterior.hacia);
    actual = anterior.hacia;
  }
  return camino.reverse();
}
