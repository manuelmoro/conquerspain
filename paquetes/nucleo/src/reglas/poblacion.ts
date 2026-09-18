// Crecimiento de la poblacion (docs/03-economia.md §3.6; ficha T-036 §4.1).
import { capacidadDe } from './poblar.ts';
import type { EstadoComarca } from '../tipos/estado.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { multiplicarFactores, porcentaje } from '../utiles/enteros.ts';

/** Por que una comarca no crece: el primero de los cuatro requisitos que falla. */
export type MotivoSinCrecer = 'escasez' | 'sin-capacidad' | 'reserva-baja' | 'balance-negativo';

/**
 * Vecinos que ganaria la comarca si se cumplen los requisitos: `2 + floor(lealtad / 25)`, por los
 * factores de crecimiento (fuero, monasterio, casa), con un tope del 5 % de la poblacion y sin
 * pasar de la capacidad. El tope es al menos un vecino: si no, una puebla de diez no creceria nunca.
 */
export function crecimientoPosible(
  comarca: EstadoComarca,
  factoresMil: readonly Milesimas[],
  reglas: TablasDeReglas,
): number {
  const p = reglas.poblacion;
  const bruto = multiplicarFactores(p.crecimientoBase + Math.floor(comarca.lealtad / 25), [
    ...factoresMil,
  ]);
  const tope = Math.max(1, porcentaje(comarca.poblacion, p.crecimientoMaximoMil));
  const hueco = Math.max(0, capacidadDe(comarca, reglas) - comarca.poblacion);
  return Math.min(bruto, tope, hueco);
}
