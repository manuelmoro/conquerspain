// El esquileo y el estiercol (docs/03-economia.md §3.8; ficha T-040 §4.5 y §4.6).
import type { Milesimas } from '../utiles/enteros.ts';
import { MIL, multiplicarFactores } from '../utiles/enteros.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import type { Rebanyo } from '../tipos/estado.ts';
import { TURNOS_POR_ANYO } from './calendario.ts';

/**
 * Lo pastado del anyo sobre el anyo entero, de 0 a 1000. Se mide sobre los 24 turnos y no sobre los
 * que lleva el rebanyo: asi no se compra uno el turno antes del esquileo para cobrar la lana.
 */
export function calidadDelAnyoMil(pastoDelAnyoMil: number): Milesimas {
  return Math.min(MIL, Math.floor(pastoDelAnyoMil / TURNOS_POR_ANYO));
}

/**
 * Sacas de lana del esquileo: doce por cada mil cabezas, por la calidad, por lo que da la casa y
 * por lo que digan los acontecimientos de la region (la peste). Se trunca una sola vez.
 */
export function lanaDelEsquileo(
  rebanyo: Rebanyo,
  casaMil: Milesimas,
  acontecimientosMil: Milesimas,
  reglas: TablasDeReglas,
): number {
  return multiplicarFactores(reglas.ganaderia.sacasPorRebanyo, [
    rebanyo.cabezas,
    calidadDelAnyoMil(rebanyo.pastoDelAnyoMil),
    casaMil,
    acontecimientosMil,
  ]);
}

/** Pan de un turno de un rebanyo: queso y corderos. */
export function panDelRebanyo(rebanyo: Rebanyo, reglas: TablasDeReglas): number {
  return multiplicarFactores(reglas.ganaderia.panPorTurno, [rebanyo.cabezas]);
}

/**
 * Niveles de estiercol de una comarca tras un anyo: uno mas si invernaron suficientes rebanyos
 * propios y uno menos si no, entre 0 y el tope.
 */
export function estiercolTrasElAnyo(
  estiercol: number,
  turnosDeAbono: number,
  reglas: TablasDeReglas,
): number {
  const g = reglas.ganaderia;
  const cambio = turnosDeAbono >= g.turnosDeInvernadaParaAbono ? 1 : -1;
  return Math.max(0, Math.min(g.nivelesDeAbono, estiercol + cambio));
}

/** Lo que multiplica el estiercol la produccion de pan de la labor. */
export function factorDeEstiercolMil(estiercol: number, reglas: TablasDeReglas): Milesimas {
  return MIL + estiercol * reglas.ganaderia.abonoPorNivelMil;
}
