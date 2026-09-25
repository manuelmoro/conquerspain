// Migracion 4 (ficha T-065 §4.3): convocatorias y sus plazas. La semilla se guarda para fundar y
// reconstruir el mundo, pero ninguna ruta la lee.
import type { Migracion } from './tipos.ts';

export const MIGRACION_DE_CONVOCATORIAS: Migracion = {
  version: 4,
  nombre: 'convocatorias',
  subir: [
    `CREATE TABLE convocatoria (
      id                TEXT PRIMARY KEY,
      nombre            TEXT NOT NULL,
      creador           TEXT NOT NULL REFERENCES cuenta(id),
      codigo            TEXT NOT NULL UNIQUE,
      intervalo_minutos INTEGER NOT NULL CHECK (intervalo_minutos > 0),
      plazas            INTEGER NOT NULL CHECK (plazas BETWEEN 1 AND 8),
      de_prueba         INTEGER NOT NULL CHECK (de_prueba IN (0,1)),
      semilla           TEXT NOT NULL,
      estado            TEXT NOT NULL CHECK (estado IN ('abierta','eligiendo','fundada')),
      ofertas           TEXT,
      avisos            TEXT,
      huella_mundo      TEXT,
      partida           TEXT,
      creada_en         INTEGER NOT NULL
    ) STRICT`,
    `CREATE TABLE plaza_convocatoria (
      convocatoria TEXT NOT NULL REFERENCES convocatoria(id),
      cuenta       TEXT NOT NULL REFERENCES cuenta(id),
      casa         TEXT NOT NULL,
      nombre       TEXT NOT NULL,
      eleccion     TEXT,
      orden        INTEGER NOT NULL,
      PRIMARY KEY (convocatoria, cuenta),
      UNIQUE (convocatoria, casa)
    ) STRICT`,
  ],
  bajar: ['DROP TABLE plaza_convocatoria', 'DROP TABLE convocatoria'],
};
