// Cifras de la lealtad, los fueros y el traslado de la corte (docs/03-economia.md §3.6 y §3.9;
// ficha T-036).
import type { DatosTerritorio } from '../tipos/reglas.ts';

export const TERRITORIO: DatosTerritorio = {
  lealtadMaximaPorFuero: 90,
  lealtadPorMercado: 1,
  lealtadPorObraMayorCerca: 2,
  lealtadPorCargaLigera: 2,
  lealtadPorCargaDura: 3,
  jornadasDeLejania: 4,
  lealtadPorLejania: 1,
  lealtadPorAbandono: 1,
  lealtadDesleal: 20,
  turnosEntreCambiosDeFuero: 10,
  turnosFueroIrreversible: 20,
  lealtadPorQuitarFuero: 20,
  turnosTraslado: 10,
  costeTraslado: { pan: 0, madera: 0, piedra: 50, maravedis: 200, sal: 0, hierro: 0, lana: 0 },
  recargoAdministracionTrasladoMil: 250,
};
