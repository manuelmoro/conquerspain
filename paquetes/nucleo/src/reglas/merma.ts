// Merma del pan almacenado (docs/03-economia.md §3.1; ficha T-032 §4.3).
import type { EstadoComarca } from '../tipos/estado.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { limitar, porcentaje } from '../utiles/enteros.ts';

export interface Merma {
  readonly mermaMil: Milesimas;
  readonly salGastada: number;
  readonly panPerdido: number;
}

/** Un granero en cualquier comarca propia basta: el pan del jugador se guarda en un almacen comun. */
export function hayGranero(comarcas: readonly EstadoComarca[]): boolean {
  return comarcas.some((comarca) => (comarca.edificios['granero'] ?? 0) > 0);
}

/**
 * La base es la de la casa; el granero y la sal rebajan cada uno lo suyo. La sal solo se gasta si
 * alcanza para conservar todo el pan (una carga por cada `panPorSal` o fraccion) y si el jugador
 * no lo ha desactivado.
 */
export function mermaDelPan(
  pan: number,
  sal: number,
  granero: boolean,
  conservarConSal: boolean,
  mermaBaseMil: Milesimas,
  reglas: TablasDeReglas,
): Merma {
  if (pan <= 0) return { mermaMil: 0, salGastada: 0, panPerdido: 0 };
  let mermaMil = mermaBaseMil;
  if (granero) mermaMil -= reglas.consumo.mermaGraneroMil;
  const salNecesaria = Math.ceil(pan / reglas.consumo.panPorSal);
  const salGastada = conservarConSal && sal >= salNecesaria ? salNecesaria : 0;
  if (salGastada > 0) mermaMil -= reglas.consumo.mermaSalMil;
  mermaMil = limitar(mermaMil, 0, mermaBaseMil);
  return { mermaMil, salGastada, panPerdido: porcentaje(pan, mermaMil) };
}
