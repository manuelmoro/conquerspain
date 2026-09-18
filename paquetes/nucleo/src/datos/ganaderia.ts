// Cifras de los rebanyos, los pastos y el esquileo (docs/03-economia.md §3.8; ficha T-040).
import type { DatosGanaderia } from '../tipos/reglas.ts';

export const GANADERIA: DatosGanaderia = {
  cabezasPorRebanyo: 1000,
  vecinosPorRebanyo: 2,
  // El ganado va despacio: dos jornadas por turno, y una mas si va por una canyada.
  pasoBaseMil: 2000,
  pasoCanyadaMil: 1000,
  pastoMinimo: 2,
  cabezasPorPuntoDePasto: 1000,
  sacasPorRebanyo: 12,
  panPorTurno: 2,
  turnosSinPastoParaPerder: 2,
  perdidaPorSinPastoMil: 50,
  turnosDeInvernadaParaAbono: 10,
  abonoPorNivelMil: 50,
  nivelesDeAbono: 3,
  avisoDePuertoTurnos: 2,
  costeCanyadaMil: 500,
};
