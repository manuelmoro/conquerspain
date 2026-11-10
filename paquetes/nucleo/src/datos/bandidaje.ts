// El bandidaje (ficha T-122): un riesgo pequeno, previsible y que se baja invirtiendo.
import type { DatosBandidaje } from '../tipos/reglas.ts';

export const BANDIDAJE: DatosBandidaje = {
  baseMil: 40,
  puertoMil: 30,
  terrenoAgresteMil: 20,
  sinDuenoMil: 10,
  deslealMil: 20,
  ventaMil: 15,
  lealMil: 10,
  lealtadSegura: 70,
  calzadaMil: 20,
  // Nunca mas de uno de cada diez pasos.
  riesgoMaximoMil: 100,
  // Un asalto se lleva la cuarta parte de la carga, y la recua sigue entera.
  perdidaMil: 250,
  avisoMil: 50,
};
