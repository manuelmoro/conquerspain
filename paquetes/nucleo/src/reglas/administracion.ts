// Administracion: lo que cuesta gobernar cada comarca desde la capital (docs/03-economia.md §3.9;
// fichas T-032 y T-036).
//
// Las jornadas a la capital se miden por el mejor camino **conocido** y **en verano**, con los
// puentes y calzadas construidos: asi el coste no oscila con la estacion y un camino bueno abarata
// gobernar lo que queda lejos.
import { jornadasDeTramoMil } from './jornadas.ts';
import type { Mejoras } from './ruta.ts';
import { calidadDeTramo, comarcasTransitables, tienePuente } from './ruta.ts';
import type { EstadoComarca, EstadoJugador } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import type { Camino, Mundo } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { MIL, multiplicarFactores } from '../utiles/enteros.ts';
import { comparar } from '../utiles/orden.ts';

/** Jornadas de un tramo en verano y sin barro, en milesimas: la vara de medir administrativa. */
export function jornadasAdministrativasMil(
  camino: Camino,
  reglas: TablasDeReglas,
  mejoras: Mejoras,
): Milesimas {
  const coste = jornadasDeTramoMil(camino, 'verano', calidadDeTramo(camino, mejoras), reglas, {
    puente: tienePuente(camino, mejoras),
  });
  // En verano no hay puerto cerrado; si una tabla lo cerrara, el tramo no sirve para medir.
  return coste === 'cerrado' ? Number.MAX_SAFE_INTEGER : coste;
}

/**
 * Milesimas de jornada desde un origen a cada comarca por el camino mas corto (Dijkstra). Si se da
 * `transitables`, el camino solo pasa por esas comarcas. No depende del orden de los tramos.
 */
export function jornadasDesde(
  origen: string,
  mundo: Mundo,
  coste: (camino: Camino) => Milesimas,
  transitables?: ReadonlySet<string>,
): Map<string, Milesimas> {
  const vecinos = new Map<string, [string, number][]>();
  const unir = (desde: string, hasta: string, jornadas: number): void => {
    const lista = vecinos.get(desde) ?? [];
    lista.push([hasta, jornadas]);
    vecinos.set(desde, lista);
  };
  for (const camino of mundo.caminos) {
    if (
      transitables !== undefined &&
      (!transitables.has(camino.desde) || !transitables.has(camino.hasta))
    ) {
      continue;
    }
    const jornadas = coste(camino);
    unir(camino.desde, camino.hasta, jornadas);
    unir(camino.hasta, camino.desde, jornadas);
  }

  const distancia = new Map<string, number>([[origen, 0]]);
  const cerradas = new Set<string>();
  for (;;) {
    let actual: string | null = null;
    let mejor = Number.POSITIVE_INFINITY;
    for (const [id, d] of distancia) {
      if (cerradas.has(id)) continue;
      if (d < mejor || (d === mejor && actual !== null && comparar(id, actual) < 0)) {
        actual = id;
        mejor = d;
      }
    }
    if (actual === null) return distancia;
    cerradas.add(actual);
    for (const [vecino, jornadas] of vecinos.get(actual) ?? []) {
      const nueva = mejor + jornadas;
      const vieja = distancia.get(vecino);
      if (vieja === undefined || nueva < vieja) distancia.set(vecino, nueva);
    }
  }
}

export interface Cercania {
  readonly comarca: IdComarca;
  readonly jornadasMil: Milesimas;
}

/**
 * Las comarcas de un jugador de la mas cercana a su capital a la mas lejana. El camino pasa solo
 * por comarcas exploradas o propias, como las rutas de las recuas; si no hay ninguno conocido, por
 * el mejor que exista. Es el orden en que se reparte lo que no llega para todas: las lejanas son
 * las primeras en quedarse sin nada.
 */
export function comarcasPorCercania(
  comarcas: readonly EstadoComarca[],
  jugador: EstadoJugador,
  mundo: Mundo,
  reglas: TablasDeReglas,
  mejoras: Mejoras,
): Cercania[] {
  const coste = (camino: Camino): Milesimas => jornadasAdministrativasMil(camino, reglas, mejoras);
  const transitables = comarcasTransitables(jugador);
  for (const comarca of comarcas) transitables.add(comarca.id);
  const porLoConocido = jornadasDesde(jugador.capital, mundo, coste, transitables);
  let porCualquiera: Map<string, number> | null = null;

  const cercanias = comarcas.map((comarca) => {
    let jornadasMil = porLoConocido.get(comarca.id);
    if (jornadasMil === undefined) {
      porCualquiera ??= jornadasDesde(jugador.capital, mundo, coste);
      jornadasMil = porCualquiera.get(comarca.id) ?? 0;
    }
    return { comarca: comarca.id, jornadasMil };
  });
  return cercanias.sort((a, b) => a.jornadasMil - b.jornadasMil || comparar(a.comarca, b.comarca));
}

export interface CosteDeAdministracion extends Cercania {
  readonly coste: number;
}

/**
 * Lo que cuesta administrar cada comarca, `(4 + 2 × jornadas a la capital) × fuero`, en el orden
 * en que se paga. Mientras la corte se traslada, todo cuesta un 25 % mas.
 */
export function costesDeAdministracion(
  comarcas: readonly EstadoComarca[],
  jugador: EstadoJugador,
  mundo: Mundo,
  reglas: TablasDeReglas,
  mejoras: Mejoras,
): CosteDeAdministracion[] {
  const fueroDe = new Map(comarcas.map((c) => [c.id, c.fuero]));
  const trasladoMil =
    jugador.traslado === null ? MIL : MIL + reglas.territorio.recargoAdministracionTrasladoMil;
  return comarcasPorCercania(comarcas, jugador, mundo, reglas, mejoras).map((cercania) => {
    const bruto =
      reglas.consumo.administracionBase +
      multiplicarFactores(reglas.consumo.administracionPorJornada, [cercania.jornadasMil]);
    const fuero = fueroDe.get(cercania.comarca) ?? 'ninguno';
    const fueroMil = reglas.poblacion.fueros[fuero].administracionMil;
    return { ...cercania, coste: multiplicarFactores(bruto, [fueroMil, trasladoMil]) };
  });
}
