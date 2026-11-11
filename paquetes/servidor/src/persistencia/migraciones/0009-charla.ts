// Migracion 9 (ficha T-129 §2.1): la charla de cada partida. Los mensajes solo se anyaden; el ultimo
// leido se guarda por jugador para que lo no leido se cuente igual en cualquier dispositivo.
import type { Migracion } from './tipos.ts';

export const MIGRACION_DE_CHARLA: Migracion = {
  version: 9,
  nombre: 'charla',
  subir: [
    `CREATE TABLE mensaje (
      id         INTEGER PRIMARY KEY,
      partida    TEXT NOT NULL REFERENCES partida(id),
      jugador    TEXT NOT NULL,
      turno      INTEGER NOT NULL,
      texto      TEXT NOT NULL,
      enviado_en INTEGER NOT NULL
    ) STRICT`,
    'CREATE INDEX mensaje_por_partida ON mensaje (partida, id)',
    `CREATE TABLE mensaje_leido (
      partida TEXT NOT NULL REFERENCES partida(id),
      jugador TEXT NOT NULL,
      ultimo  INTEGER NOT NULL,
      PRIMARY KEY (partida, jugador)
    ) STRICT`,
  ],
  bajar: ['DROP TABLE mensaje_leido', 'DROP INDEX mensaje_por_partida', 'DROP TABLE mensaje'],
};
