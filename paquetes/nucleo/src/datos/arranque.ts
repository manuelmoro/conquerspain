// Con que empieza cada casa en su comarca de origen (ficha T-032 §4.6; lo aplica el alta, T-065).
//
// Dos niveles de granja alimentan de sobra a un origen tipico (labor 3, unos 75 vecinos) en la
// media del anyo, pero no en invierno: el primer invierno se pasa con la despensa inicial y el
// primer verano es el que hay que aprovechar para llenar el granero.
import type { DatosArranque } from '../tipos/reglas.ts';

export const ARRANQUE: DatosArranque = {
  almacen: { pan: 80, madera: 60, piedra: 20, maravedis: 60, sal: 0, hierro: 0, lana: 0 },
  edificiosDeOrigen: { granja: 2 },
};
