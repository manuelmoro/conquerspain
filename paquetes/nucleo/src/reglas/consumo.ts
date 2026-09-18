// Consumo y administracion (docs/03-economia.md §3.1, §3.6 y §3.9; ficha T-032).
//
// Funciones puras: dicen cuanto hay que pagar y en que orden. Quien cobra y que pasa cuando no
// llega es cosa de la fase 3.
import type { EstadoComarca, EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { multiplicarFactores } from '../utiles/enteros.ts';
import { comparar } from '../utiles/orden.ts';

/** Comarcas de un jugador, en orden de identificador. */
export function comarcasDe(estado: EstadoPartida, jugador: string): EstadoComarca[] {
  return Object.keys(estado.comarcas)
    .sort(comparar)
    .map((id) => estado.comarcas[id])
    .filter((comarca): comarca is EstadoComarca => comarca?.duenyo === jugador);
}

/** Pan que come la gente de todas las comarcas propias; se trunca una vez, sobre el total. */
export function panDeLaPoblacion(
  comarcas: readonly EstadoComarca[],
  reglas: TablasDeReglas,
): number {
  const vecinos = comarcas.reduce((total, c) => total + c.poblacion, 0);
  return multiplicarFactores(vecinos, [reglas.poblacion.consumoPorVecinoMil]);
}

/** Pan de las cuadrillas: una por cada obra que el jugador tiene en marcha. */
export function panDeLasCuadrillas(
  estado: EstadoPartida,
  jugador: string,
  reglas: TablasDeReglas,
): number {
  const obras = Object.values(estado.obras).filter(
    (obra) => obra.jugador === jugador && !obra.abandonada,
  ).length;
  return obras * reglas.consumo.panPorCuadrilla;
}

/**
 * Jornadas desde un origen a cada comarca por el mejor camino (Dijkstra sobre la base de cada
 * tramo, sin estacion ni calidad: es la distancia administrativa, no la de una recua concreta).
 * Si se da `transitables`, el camino solo pasa por esas comarcas. El resultado no depende del
 * orden en que el mundo guarda los tramos.
 */
export function jornadasDesde(
  origen: string,
  mundo: Mundo,
  transitables?: ReadonlySet<string>,
): Map<string, number> {
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
    unir(camino.desde, camino.hasta, camino.jornadasBase);
    unir(camino.hasta, camino.desde, camino.jornadasBase);
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
  readonly jornadas: number;
}

/**
 * Las comarcas de un jugador de la mas cercana a su capital a la mas lejana, con las jornadas por
 * el mejor camino que conoce (si no conoce ninguno, por el mejor que existe). Es el orden en que se
 * reparte lo que no llega para todas: las lejanas son las primeras en quedarse sin nada.
 */
export function comarcasPorCercania(
  comarcas: readonly EstadoComarca[],
  jugador: EstadoJugador,
  mundo: Mundo,
): Cercania[] {
  const conocidas = new Set(Object.keys(jugador.conocimiento));
  for (const comarca of comarcas) conocidas.add(comarca.id);
  conocidas.add(jugador.capital);
  const porLoConocido = jornadasDesde(jugador.capital, mundo, conocidas);
  let porCualquiera: Map<string, number> | null = null;

  const cercanias = comarcas.map((comarca) => {
    let jornadas = porLoConocido.get(comarca.id);
    if (jornadas === undefined) {
      porCualquiera ??= jornadasDesde(jugador.capital, mundo);
      jornadas = porCualquiera.get(comarca.id) ?? 0;
    }
    return { comarca: comarca.id, jornadas };
  });
  return cercanias.sort((a, b) => a.jornadas - b.jornadas || comparar(a.comarca, b.comarca));
}

export interface CosteDeAdministracion extends Cercania {
  readonly coste: number;
}

/**
 * Lo que cuesta administrar cada comarca, `(base + 2 × jornadas a la capital) × fuero`, en el
 * orden en que se paga: de la mas cercana a la mas lejana.
 */
export function costesDeAdministracion(
  comarcas: readonly EstadoComarca[],
  jugador: EstadoJugador,
  mundo: Mundo,
  reglas: TablasDeReglas,
): CosteDeAdministracion[] {
  const fueroDe = new Map(comarcas.map((c) => [c.id, c.fuero]));
  return comarcasPorCercania(comarcas, jugador, mundo).map((cercania) => {
    const bruto =
      reglas.consumo.administracionBase +
      reglas.consumo.administracionPorJornada * cercania.jornadas;
    const fuero = fueroDe.get(cercania.comarca) ?? 'ninguno';
    const fueroMil = reglas.poblacion.fueros[fuero].administracionMil;
    return { ...cercania, coste: multiplicarFactores(bruto, [fueroMil]) };
  });
}

/**
 * Turnos que aguanta la reserva de pan con el balance de este turno, o null si el balance no es
 * negativo y la reserva no baja.
 */
export function turnosDeReserva(disponible: number, balance: number): number | null {
  if (balance >= 0) return null;
  return Math.floor(disponible / -balance);
}
