// Cifras de los contratos, el credito y los portazgos (ficha T-103 §2 a §5).
import type { DatosContratos } from '../tipos/reglas.ts';

export const CONTRATOS: DatosContratos = {
  // Cumplir sube poco y fallar baja mucho: una mala jugada pesa mas que cuatro buenas.
  creditoPorCumplir: 5,
  creditoPorIncumplir: 20,
  // Por debajo, pago por adelantado, sin prestamos y un 20 % menos de influencia en los concejos.
  creditoBajo: 30,
  influenciaConCreditoBajoMil: 800,
  // Una propuesta sin respuesta caduca a los dos turnos.
  turnosParaResponder: 2,
  // Ningun contrato a mas de dos anyos vista.
  plazoMaximo: 48,
  // El portazgo de un tramo, en maravedis por paso (docs/06 §6.5.2).
  portazgoMaximo: 20,
  // Romper un acuerdo (T-123) cuesta mas que incumplir un contrato: se hace a sabiendas.
  creditoPorRomper: 25,
  prestigioPorRomper: 30,
  comarcasMaximasNoCortejo: 3,
  acuerdosMaximosNoAgresion: 3,
};
