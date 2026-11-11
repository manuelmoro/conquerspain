// Migracion 8 (ficha T-124 §2.1): quien ha dado por terminado su turno. Una fila por partida, turno y
// jugador; al resolverse el turno las filas quedan como historia y el turno nuevo empieza sin ninguna.
import type { Migracion } from './tipos.ts';

export const MIGRACION_DE_FIN_DE_TURNO: Migracion = {
  version: 8,
  nombre: 'fin-de-turno',
  subir: [
    `CREATE TABLE turno_terminado (
      partida    TEXT NOT NULL REFERENCES partida(id),
      turno      INTEGER NOT NULL,
      jugador    TEXT NOT NULL,
      marcado_en INTEGER NOT NULL,
      PRIMARY KEY (partida, turno, jugador)
    ) STRICT`,
  ],
  bajar: ['DROP TABLE turno_terminado'],
};
