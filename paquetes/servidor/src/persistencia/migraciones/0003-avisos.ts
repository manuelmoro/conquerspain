// Migracion 3 (ficha T-064 §4.7): la cola de correos de aviso y las preferencias por partida. La
// clave (partida, turno, jugador) hace imposible encolar dos veces el mismo aviso.
import type { Migracion } from './tipos.ts';

export const MIGRACION_DE_AVISOS: Migracion = {
  version: 3,
  nombre: 'avisos',
  subir: [
    `CREATE TABLE aviso_correo (
      partida           TEXT NOT NULL REFERENCES partida(id),
      turno             INTEGER NOT NULL,
      jugador           TEXT NOT NULL,
      cuenta            TEXT NOT NULL REFERENCES cuenta(id),
      estado            TEXT NOT NULL CHECK (estado IN ('pendiente','enviado','descartado','fallido')),
      creado_en         INTEGER NOT NULL,
      intentos          INTEGER NOT NULL DEFAULT 0,
      siguiente_intento INTEGER NOT NULL,
      enviado_en        INTEGER,
      PRIMARY KEY (partida, turno, jugador)
    ) STRICT`,
    'CREATE INDEX aviso_pendiente ON aviso_correo (estado, siguiente_intento)',
    `CREATE TABLE preferencia_aviso (
      partida TEXT NOT NULL REFERENCES partida(id),
      jugador TEXT NOT NULL,
      modo    TEXT NOT NULL CHECK (modo IN ('cada-turno','diario','nada')),
      PRIMARY KEY (partida, jugador)
    ) STRICT`,
  ],
  bajar: ['DROP TABLE preferencia_aviso', 'DROP INDEX aviso_pendiente', 'DROP TABLE aviso_correo'],
};
