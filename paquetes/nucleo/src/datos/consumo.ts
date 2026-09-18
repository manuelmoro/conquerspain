// Cifras del consumo, la merma y la escasez (docs/03-economia.md §3.1, §3.6 y §3.9; ficha T-032).
import type { DatosConsumo } from '../tipos/reglas.ts';

export const CONSUMO: DatosConsumo = {
  panPorCuadrilla: 2,
  hierroPorApero: 1,
  turnosSinHierroParaPerderApero: 2,
  // El pan pierde un 4 % por turno (la merma base es de cada casa); el granero y la sal rebajan
  // dos puntos cada uno.
  mermaGraneroMil: 20,
  mermaSalMil: 20,
  panPorSal: 50,
  administracionBase: 4,
  administracionPorJornada: 2,
  lealtadPorEscasez: 5,
  lealtadPorHambreProlongada: 10,
  lealtadPorDeudaDeAdministracion: 2,
  escasezParaEmigrar: 3,
  turnosDeAvisoDeHambre: 3,
};
