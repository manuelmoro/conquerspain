// El anyo del juego: 24 quincenas y lo que cada estacion hace con el pan, las obras y los pastos
// (docs/03-economia.md §3.4 y §3.7; ficha T-030).
import type { DatosEstaciones, Estacion } from '../tipos/reglas.ts';

/** Diciembre, enero y febrero son invierno; de marzo a mayo, primavera; y asi. */
function estacionDelMes(mes: number): Estacion {
  if (mes <= 2 || mes === 12) return 'invierno';
  if (mes <= 5) return 'primavera';
  return mes <= 8 ? 'verano' : 'otonyo';
}

export const ESTACIONES: DatosEstaciones = {
  turnosPorAnyo: 24,
  estacionPorTurno: Array.from({ length: 24 }, (_, i) => estacionDelMes(Math.floor(i / 2) + 1)),
  // El pan sigue la estacion: el verano llena el granero y el invierno lo vacia (docs/03 §3.4).
  factorPanMil: { primavera: 800, verano: 1600, otonyo: 1000, invierno: 600 },
  factorObraPiedraMil: { primavera: 1000, verano: 1000, otonyo: 1000, invierno: 2000 },
  factorObraMaderaMil: { primavera: 1000, verano: 1000, otonyo: 1000, invierno: 1500 },
  // Primera quincena de marzo y de noviembre: los caminos se embarran.
  turnosDeBarro: [5, 21],
  // Segunda quincena de mayo.
  turnoDeEsquileo: 10,
  // De mayo a septiembre, los rebanyos suben a los agostaderos.
  turnosPastoDeVerano: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
};
