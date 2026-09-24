// Cifras del movimiento de recuas (docs/03-economia.md §3.7; ficha T-033).
import type { DatosMovimiento } from '../tipos/reglas.ts';

export const MOVIMIENTO: DatosMovimiento = {
  jornadasPorTerreno: { llano: 2, ondulado: 3, sierra: 5, costa: 2, vega: 2 },
  factorCaminoMil: { vereda: 1000, herradura: 800, carretero: 650, calzada: 500 },
  jornadasDeVado: 2,
  // Tres jornadas por quincena: una recua de mulas andaba mucho mas, pero paraba en ferias,
  // ventas y portazgos. Una menos cargada a tope o con barro, una mas por calzada.
  pasoBaseMil: 3000,
  pasoCargadaMil: 1000,
  pasoBarroMil: 1000,
  pasoCalzadaMil: 1000,
  pasoMinimoMil: 1000,
  cargaPesadaMil: 800,
  bastimentoPorJornada: 2,
  bastimentoExploradoraMil: 250,
  jornadasPorSalEnVerano: 4,
  // El ventero cobra el pan y la sal a lo que valen en su plaza (T-055).
  ventaCobraMil: 1000,
  acemilasPorRecua: 10,
  portePorAcemila: 1,
  arrierosPorRecua: 4,
  vecinosMaximosPorRecua: 20,
  costeFormarRecua: { pan: 10, madera: 0, piedra: 0, maravedis: 20, sal: 0, hierro: 0, lana: 0 },
  factorBarroMil: 1250,
  factorNieveMil: 1500,
  factorVeranoMil: 900,
};
