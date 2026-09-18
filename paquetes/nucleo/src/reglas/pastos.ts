// Pastos y capacidad de una comarca para los rebanyos (docs/03-economia.md §3.8; ficha T-040 §4.3).
//
// Funciones puras: dicen si una comarca es pasto correcto este turno, cuantas cabezas mantiene y
// cuanto pasta cada rebanyo cuando hay mas ganado que hierba.
import type { EstadoComarca, Rebanyo } from '../tipos/estado.ts';
import type { ComarcaMundo, Rasgo } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { MIL, repartoProporcional } from '../utiles/enteros.ts';
import type { EstadoEstacional } from './calendario.ts';

/** Los rasgos que hacen de una comarca pasto de invierno: la dehesa y el montado tambien. */
const RASGOS_DE_INVIERNO: readonly Rasgo[] = ['pasto-de-invierno', 'dehesa', 'montado'];

export type MotivoSinPasto = 'estacion' | 'sin-pasto' | 'saturado' | 'camino';

/** La comarca es pasto correcto este turno: tiene pasto y el que toca a la estacion. */
export function esPastoCorrecto(
  comarca: EstadoComarca,
  geografia: ComarcaMundo,
  estacional: EstadoEstacional,
  reglas: TablasDeReglas,
): boolean {
  if (comarca.potenciales.pasto < reglas.ganaderia.pastoMinimo) return false;
  const deVerano = geografia.rasgos.includes('pasto-de-verano');
  const deInvierno = geografia.rasgos.some((rasgo) => RASGOS_DE_INVIERNO.includes(rasgo));
  return (deVerano && estacional.pastosDeVerano) || (deInvierno && estacional.pastosDeInvierno);
}

/** Cabezas que mantiene la comarca: `pasto x cabezasPorPuntoDePasto`. */
export function capacidadDePasto(comarca: EstadoComarca, reglas: TablasDeReglas): number {
  return comarca.potenciales.pasto * reglas.ganaderia.cabezasPorPuntoDePasto;
}

/**
 * Lo que pasta cada rebanyo de una comarca este turno, en milesimas (1000 = pasto entero). Si el
 * ganado presente, de quien sea, cabe, todos comen lo suyo; si no, la capacidad se reparte en
 * proporcion a las cabezas con `repartoProporcional`, que no depende del orden.
 */
export function repartoDePasto(
  capacidad: number,
  rebanyos: readonly Rebanyo[],
): Map<string, number> {
  const alimentadas = repartoProporcional(
    capacidad,
    rebanyos.map((rebanyo) => ({ id: rebanyo.id, cantidad: rebanyo.cabezas })),
  );
  return new Map(
    rebanyos.map((rebanyo) => [
      rebanyo.id,
      rebanyo.cabezas === 0
        ? 0
        : Math.floor(((alimentadas.get(rebanyo.id) ?? 0) * MIL) / rebanyo.cabezas),
    ]),
  );
}
