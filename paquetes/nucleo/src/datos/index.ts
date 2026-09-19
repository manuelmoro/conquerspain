// Las tablas de reglas del juego, montadas a partir de cada tabla de datos.
//
// Es lo que resuelve una partida de verdad: las casas de oficio con sus privilegios, no las casas
// neutras de las pruebas del motor.
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { VERSION_REGLAS } from '../tipos/reglas.ts';
import { ACONTECIMIENTOS } from './acontecimientos.ts';
import { ARRANQUE } from './arranque.ts';
import { CASAS_DE_OFICIO } from './casas.ts';
import { COMETIDOS_DE_RECUA } from './cometidos.ts';
import { CONSUMO } from './consumo.ts';
import { EDIFICIOS } from './edificios.ts';
import { ESTACIONES } from './estaciones.ts';
import { GANADERIA } from './ganaderia.ts';
import { INFLUENCIA } from './influencia.ts';
import { MAYORDOMO } from './mayordomo.ts';
import { MERCADO } from './mercado.ts';
import { MOVIMIENTO } from './movimiento.ts';
import { OBRAS, OBRAS_MAYORES } from './obras.ts';
import { POBLACION } from './poblacion.ts';
import { DATOS_DE_HITOS, PRESTIGIO } from './prestigio.ts';
import { PRODUCCION } from './produccion.ts';
import { DATOS_DE_RECURSOS } from './recursos.ts';
import { RUMORES } from './rumores.ts';
import { TERRITORIO } from './territorio.ts';
import { RONDAS, TRADICIONES } from './tradiciones.ts';

export const TABLAS_DEL_JUEGO: TablasDeReglas = {
  version: VERSION_REGLAS,
  recursos: DATOS_DE_RECURSOS,
  edificios: EDIFICIOS,
  casas: CASAS_DE_OFICIO,
  tradiciones: TRADICIONES,
  rondas: RONDAS,
  estaciones: ESTACIONES,
  produccion: PRODUCCION,
  consumo: CONSUMO,
  movimiento: MOVIMIENTO,
  cometidos: COMETIDOS_DE_RECUA,
  obras: OBRAS,
  obrasMayores: OBRAS_MAYORES,
  poblacion: POBLACION,
  territorio: TERRITORIO,
  mercado: MERCADO,
  influencia: INFLUENCIA,
  prestigio: PRESTIGIO,
  hitos: DATOS_DE_HITOS,
  rumores: RUMORES,
  mayordomo: MAYORDOMO,
  arranque: ARRANQUE,
  acontecimientos: ACONTECIMIENTOS,
  ganaderia: GANADERIA,
};
