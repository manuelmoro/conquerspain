// Migracion 1 (ficha T-060 §5): partidas, participantes, estados por turno, ordenes entrantes,
// cronicas, sucesos y auditoria de resolucion. `cuenta` la anyade T-063.
import type { Migracion } from './tipos.ts';

export const MIGRACION_INICIAL: Migracion = {
  version: 1,
  nombre: 'inicial',
  subir: [
    `CREATE TABLE partida (
      id                  TEXT PRIMARY KEY,
      nombre              TEXT NOT NULL,
      semilla             TEXT NOT NULL,
      version_reglas      INTEGER NOT NULL,
      huella_mundo        TEXT NOT NULL,
      intervalo_segundos  INTEGER NOT NULL CHECK (intervalo_segundos > 0),
      ancla               INTEGER NOT NULL,
      turno_actual        INTEGER NOT NULL CHECK (turno_actual >= 1),
      proxima_resolucion  INTEGER,
      estado              TEXT NOT NULL CHECK (estado IN ('activa','detenida','terminada')),
      motivo_detencion    TEXT,
      de_prueba           INTEGER NOT NULL DEFAULT 0 CHECK (de_prueba IN (0,1)),
      creada_en           INTEGER NOT NULL
    ) STRICT`,
    `CREATE INDEX partida_por_resolver ON partida (proxima_resolucion) WHERE estado = 'activa'`,
    `CREATE TABLE participante (
      partida  TEXT NOT NULL REFERENCES partida(id),
      jugador  TEXT NOT NULL,
      casa     TEXT NOT NULL,
      cuenta   TEXT,
      PRIMARY KEY (partida, jugador)
    ) STRICT`,
    `CREATE TABLE estado_turno (
      partida              TEXT NOT NULL REFERENCES partida(id),
      turno                INTEGER NOT NULL,
      huella               TEXT NOT NULL,
      huella_turno_anterior TEXT,
      contenido            BLOB NOT NULL,
      bytes_sin_comprimir  INTEGER NOT NULL,
      guardado_en          INTEGER NOT NULL,
      PRIMARY KEY (partida, turno)
    ) STRICT`,
    `CREATE TABLE orden (
      partida         TEXT NOT NULL REFERENCES partida(id),
      id              TEXT NOT NULL,
      jugador         TEXT NOT NULL,
      turno_recibida  INTEGER NOT NULL,
      recibida_en     INTEGER NOT NULL,
      estado          TEXT NOT NULL CHECK (estado IN ('pendiente','aplicada','cancelada','rechazada')),
      turno_aplicada  INTEGER,
      motivo          TEXT,
      contenido       TEXT NOT NULL,
      PRIMARY KEY (partida, id)
    ) STRICT`,
    `CREATE INDEX orden_pendientes ON orden (partida, estado, turno_recibida)`,
    `CREATE TABLE cronica (
      partida   TEXT NOT NULL REFERENCES partida(id),
      turno     INTEGER NOT NULL,
      jugador   TEXT NOT NULL,
      contenido TEXT NOT NULL,
      PRIMARY KEY (partida, turno, jugador)
    ) STRICT`,
    `CREATE TABLE suceso_turno (
      partida   TEXT NOT NULL REFERENCES partida(id),
      turno     INTEGER NOT NULL,
      contenido BLOB NOT NULL,
      PRIMARY KEY (partida, turno)
    ) STRICT`,
    `CREATE TABLE auditoria_resolucion (
      partida         TEXT NOT NULL REFERENCES partida(id),
      turno           INTEGER NOT NULL,
      huella_entrada  TEXT NOT NULL,
      huella_salida   TEXT NOT NULL,
      huella_ordenes  TEXT NOT NULL,
      ordenes         INTEGER NOT NULL,
      duracion_ms     INTEGER NOT NULL,
      version_reglas  INTEGER NOT NULL,
      version_nucleo  TEXT NOT NULL,
      resuelta_en     INTEGER NOT NULL,
      PRIMARY KEY (partida, turno)
    ) STRICT`,
  ],
  bajar: [
    'DROP TABLE auditoria_resolucion',
    'DROP TABLE suceso_turno',
    'DROP TABLE cronica',
    'DROP INDEX orden_pendientes',
    'DROP TABLE orden',
    'DROP TABLE estado_turno',
    'DROP TABLE participante',
    'DROP INDEX partida_por_resolver',
    'DROP TABLE partida',
  ],
};
