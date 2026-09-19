// De donde salen los rumores (docs/02-diseno-nucleo.md §2.6; ficha T-044 §4.3).
//
// La feria es la manera barata de enterarse: cuanto mas grande, mas se oye. El Camino de Santiago
// trae noticias de lejos y una venta propia es una oreja fija en el camino.
import type { DatosRumores } from '../tipos/reglas.ts';

export const RUMORES: DatosRumores = {
  porFeria: { pequenya: 1, mediana: 2, grande: 3 },
  porCaminoDeSantiago: 1,
  porVenta: 1,
  corresponsalesMil: 2000,
  maximoPorTurno: 6,
  dePreciosMil: 700,
};
