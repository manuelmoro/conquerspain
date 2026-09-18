// Bastimento de las recuas (docs/03-economia.md §3.7.1; ficha T-033 §4.3).
import type { Estacion, TablasDeReglas } from '../tipos/reglas.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { MIL, multiplicarFactores } from '../utiles/enteros.ts';

export interface Bastimento {
  readonly pan: number;
  readonly sal: number;
}

/**
 * Lo que come una recua por lo que anda: pan por jornada, truncado, y en verano una carga de sal
 * por cada `jornadasPorSalEnVerano` jornadas **o fraccion** (redondeo hacia arriba, a proposito:
 * si no, una recua de tres jornadas por turno no gastaria nunca sal).
 */
export function bastimentoDe(
  andadoMil: Milesimas,
  estacion: Estacion,
  reglas: TablasDeReglas,
): Bastimento {
  const m = reglas.movimiento;
  const pan = multiplicarFactores(m.bastimentoPorJornada, [andadoMil]);
  const tramoDeSal = m.jornadasPorSalEnVerano * MIL;
  const sal = estacion === 'verano' ? Math.ceil(andadoMil / tramoDeSal) : 0;
  return { pan, sal };
}
