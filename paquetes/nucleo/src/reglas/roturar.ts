// Roturar: convertir monte en tierra de labor (docs/03-economia.md §3.3; ficha T-035 §4.5).
import type { EstadoComarca } from '../tipos/estado.ts';
import type { Potencial, NivelPotencial } from '../tipos/mundo.ts';
import type { Recursos } from '../tipos/recursos.ts';
import { recursosSegun } from '../tipos/recursos.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { multiplicarFactores } from '../utiles/enteros.ts';

export type MotivoSinRoturar = 'sin-monte' | 'labor-al-maximo';

export function impedimentoDeRoturar(comarca: EstadoComarca): MotivoSinRoturar | null {
  if (comarca.potenciales.monte < 1) return 'sin-monte';
  if (comarca.potenciales.labor >= 5) return 'labor-al-maximo';
  return null;
}

const NIVELES: readonly NivelPotencial[] = [0, 1, 2, 3, 4, 5];

/** Los potenciales efectivos despues de roturar (un punto de monte pasa a labor), o null. */
export function potencialesTrasRoturar(
  potenciales: Readonly<Record<Potencial, NivelPotencial>>,
): Record<Potencial, NivelPotencial> | null {
  const monte = NIVELES[potenciales.monte - 1];
  const labor = NIVELES[potenciales.labor + 1];
  if (monte === undefined || labor === undefined) return null;
  return { ...potenciales, monte, labor };
}

/**
 * Lo que cuesta roturar en una comarca: el doble en dehesa y nada si hay monasterio (los monjes
 * roturan por su cuenta). Lo usa el servidor al calcular el coste de la orden.
 */
export function costeDeRoturar(comarca: EstadoComarca, reglas: TablasDeReglas): Recursos {
  const o = reglas.obras;
  const factorMil = comarca.obrasMayores.includes('monasterio')
    ? 0
    : comarca.dehesa
      ? o.costeRoturarDehesaMil
      : 1000;
  return recursosSegun((r) => multiplicarFactores(o.costeRoturar[r], [factorMil]));
}
