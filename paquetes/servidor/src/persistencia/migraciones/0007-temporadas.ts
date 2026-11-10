// Migracion 7 (ficha T-104 §2.1): una convocatoria puede ser de temporada, con su numero de turnos;
// nula, la partida es abierta y no termina.
import type { Migracion } from './tipos.ts';

export const MIGRACION_DE_TEMPORADAS: Migracion = {
  version: 7,
  nombre: 'temporadas',
  subir: ['ALTER TABLE convocatoria ADD COLUMN turnos_de_temporada INTEGER'],
  bajar: ['ALTER TABLE convocatoria DROP COLUMN turnos_de_temporada'],
};
