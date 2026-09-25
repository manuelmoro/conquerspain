// El calendario del reloj (ficha T-061 §4.1): anclado en el instante del turno 1, nunca en el
// instante en que acabo el ultimo calculo. Funciones puras; el tiempo entra como parametro.

/**
 * El instante (ms Unix) en que se resuelve el turno `turno`: el turno N transcurre en
 * `[ancla + (N-1)·I, ancla + N·I)` y se resuelve al acabar.
 */
export function proximaResolucion(ancla: number, intervaloSegundos: number, turno: number): number {
  return ancla + turno * intervaloSegundos * 1000;
}

/** Cuantos turnos estan ya debidos si la proxima resolucion era `proxima` y son las `ahora`. */
export function turnosDebidos(
  proxima: number | null,
  intervaloSegundos: number,
  ahora: number,
): number {
  if (proxima === null || proxima > ahora) return 0;
  return Math.floor((ahora - proxima) / (intervaloSegundos * 1000)) + 1;
}
