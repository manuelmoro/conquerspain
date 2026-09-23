// Mercaderes menores: la liquidez de fondo de cada plaza (docs/03-economia.md §3.10.3; ficha T-037
// §4.5). No son jugadores ni tienen almacen ni memoria: son un cupo y dos limites de precio.
import type { DatosMercado } from '../tipos/reglas.ts';
import { MIL, multiplicarFactores, porcentaje } from '../utiles/enteros.ts';

export interface LimitesDeMenores {
  /** Compran a los jugadores mientras el precio no pase de aqui. */
  readonly compraHastaMil: number;
  /** Venden a los jugadores mientras el precio no baje de aqui. */
  readonly vendeDesdeMil: number;
}

export function limitesDeMenores(precioBaseMil: number, tabla: DatosMercado): LimitesDeMenores {
  return {
    compraHastaMil: porcentaje(precioBaseMil, MIL + tabla.margenMercaderesMenoresMil),
    vendeDesdeMil: porcentaje(precioBaseMil, MIL - tabla.margenMercaderesMenoresMil),
  };
}

/**
 * Cargas por turno y lado que ponen los menores: el tope de la plaza por su liquidez, menos lo
 * que los jugadores ya se comercian entre si. Con mucho comercio entre jugadores, desaparecen.
 */
export function cupoDeMenores(
  tope: number,
  volumenEntreJugadores: number,
  tabla: DatosMercado,
): number {
  return Math.max(
    0,
    multiplicarFactores(tope, [tabla.liquidezMercaderesMenoresMil]) - volumenEntreJugadores,
  );
}
