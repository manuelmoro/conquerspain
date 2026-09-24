// Cifras de los rebanyos, los pastos y el esquileo (docs/03-economia.md §3.8; ficha T-040).
import type { DatosGanaderia } from '../tipos/reglas.ts';

export const GANADERIA: DatosGanaderia = {
  cabezasPorRebanyo: 1000,
  costeFormarRebanyo: { pan: 0, madera: 0, piedra: 0, maravedis: 60, sal: 0, hierro: 0, lana: 0 },
  vecinosPorRebanyo: 2,
  // El ganado va despacio fuera de cañada: dos jornadas por turno. Por la cañada real anda
  // cuatro y media, y sus tramos cuentan la mitad: las merinas bajaban de Soria a Extremadura en
  // dos o tres quincenas (T-047, medido con T-058). Con una jornada de mas, como antes, la Mesta de
  // Cameros tardaba siete turnos en llegar al Valle de Alcudia y no trashumaba nunca.
  pasoBaseMil: 2000,
  pasoCanyadaMil: 2500,
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
