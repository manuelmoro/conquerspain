// El calendario del reloj (fichas T-061 §4.1 y T-124 §2.3). El primer turno se resuelve un intervalo
// despues de fundar la partida; cada turno siguiente, un intervalo despues de resolverse el anterior,
// sea a su hora, porque todos lo dieron por terminado o porque lo avanzo quien administra: el plazo se
// reinicia en cada avance, y nadie se encuentra con un turno recortado. Funciones puras; el tiempo
// entra como parametro.

/** El instante (ms Unix) en que vence el turno que empieza en `desde`: un intervalo despues. */
export function vencimientoDesde(desde: number, intervaloSegundos: number): number {
  return desde + intervaloSegundos * 1000;
}
