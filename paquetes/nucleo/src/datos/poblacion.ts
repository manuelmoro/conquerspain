// Cifras de la poblacion y de los fueros (docs/03-economia.md §3.6 y §3.9).
import type { DatosPoblacion } from '../tipos/reglas.ts';

export const POBLACION: DatosPoblacion = {
  consumoPorVecinoMil: 250,
  vecinosPorCuadrilla: 40,
  cuadrillasMaximas: 4,
  capacidadBase: 60,
  capacidadPorCasas: 30,
  crecimientoBase: 2,
  crecimientoMaximoMil: 50,
  emigracionPorHambreMil: 30,
  lealtadInicialIncorporada: 60,
  turnosDeslealParaPerderla: 6,
  capacidadPorMuralla: 20,
  fueros: {
    ninguno: {
      administracionMil: 1000,
      impuestosMil: 1000,
      lealtadPorTurno: 0,
      crecimientoMil: 1000,
    },
    'carta puebla': {
      administracionMil: 750,
      impuestosMil: 700,
      lealtadPorTurno: 2,
      crecimientoMil: 1200,
    },
    fuero: { administracionMil: 500, impuestosMil: 500, lealtadPorTurno: 3, crecimientoMil: 1000 },
  },
};
