// Bastimento de las recuas (docs/03-economia.md §3.7.1; fichas T-033 §4.3 y T-055).
import type { EstadoPartida } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import type { Recurso } from '../tipos/recursos.ts';
import type { Estacion, TablasDeReglas } from '../tipos/reglas.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { MIL, multiplicarFactores, porcentaje } from '../utiles/enteros.ts';
import { importeDeCompra } from './mercado.ts';

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
  /** Lo que come en el camino una recua de la casa: 1000 si nada (las ventas la alimentan). */
  bastimentoMil: Milesimas = MIL,
): Bastimento {
  const m = reglas.movimiento;
  const pan = multiplicarFactores(m.bastimentoPorJornada, [andadoMil, bastimentoMil]);
  const tramoDeSal = m.jornadasPorSalEnVerano * MIL;
  const sal = estacion === 'verano' ? Math.ceil(andadoMil / tramoDeSal) : 0;
  return { pan, sal };
}

/** La comarca tiene una venta en pie: alli come cualquier recua que pase, sea de quien sea. */
export function hayVentaEn(estado: EstadoPartida, comarca: IdComarca): boolean {
  return (estado.comarcas[comarca]?.edificios['venta'] ?? 0) > 0;
}

/**
 * La primera venta que pisa una recua este turno: la de la comarca donde empieza, o la de la
 * primera en la que entra. Se come en ella el bastimento del turno entero, igual que una ruta
 * circular come del almacen si pasa por comarca propia: la cuenta es por turno, no por jornada.
 * Quien sabe si hay venta lo dice `hayVenta`: el motor mira el estado, un robot lo que sabe.
 */
export function ventaDelTurno(
  hayVenta: (comarca: IdComarca) => boolean,
  empieza: IdComarca | null,
  entradas: readonly IdComarca[],
): IdComarca | null {
  const pisadas = empieza === null ? entradas : [empieza, ...entradas];
  return pisadas.find(hayVenta) ?? null;
}

/**
 * Lo que cobra el ventero por el bastimento de un turno: el pan y la sal a lo que valen en su
 * plaza, por la tarifa de la tabla, redondeado al alza como toda compra. Se paga con los maravedis que lleva la recua, que no
 * pesan: eso es lo que deja sitio en la carga para la mercancia (T-055).
 */
export function costeEnLaVenta(
  bastimento: Bastimento,
  preciosMil: Readonly<Record<Recurso, number>>,
  reglas: TablasDeReglas,
): number {
  const cobra = reglas.movimiento.ventaCobraMil;
  return (
    importeDeCompra(bastimento.pan, porcentaje(preciosMil.pan, cobra)) +
    importeDeCompra(bastimento.sal, porcentaje(preciosMil.sal, cobra))
  );
}
