// Consumo de pan (docs/03-economia.md §3.1 y §3.6; ficha T-032).
//
// Funciones puras: dicen cuanto pan hay que pagar. Quien cobra y que pasa cuando no llega es cosa
// de la fase 3.
import type { EstadoComarca, EstadoPartida } from '../tipos/estado.ts';
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
 * Turnos que aguanta la reserva de pan con el balance de este turno, o null si el balance no es
 * negativo y la reserva no baja.
 */
export function turnosDeReserva(disponible: number, balance: number): number | null {
  if (balance >= 0) return null;
  return Math.floor(disponible / -balance);
}
