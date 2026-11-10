// Migracion 6 (ficha T-100 §4.1): hasta doce plazas, y una casa puede repetirse una vez. La plaza
// lleva su identificador de jugador (la casa, o «casa-2» para el segundo de esa casa), que es con el
// que se reparten las ofertas y se funda la partida. SQLite no quita una restriccion: la tabla se
// rehace sin `UNIQUE (convocatoria, casa)`. Las plazas que ya habia eran de casas unicas: su jugador
// es su casa, como antes.
import type { Migracion } from './tipos.ts';

export const MIGRACION_DE_CASAS_REPETIDAS: Migracion = {
  version: 6,
  nombre: 'casas-repetidas',
  subir: [
    `CREATE TABLE plaza_convocatoria_nueva (
      convocatoria TEXT NOT NULL REFERENCES convocatoria(id),
      cuenta       TEXT NOT NULL REFERENCES cuenta(id),
      casa         TEXT NOT NULL,
      jugador      TEXT NOT NULL,
      nombre       TEXT NOT NULL,
      eleccion     TEXT,
      orden        INTEGER NOT NULL,
      PRIMARY KEY (convocatoria, cuenta),
      UNIQUE (convocatoria, jugador)
    ) STRICT`,
    `INSERT INTO plaza_convocatoria_nueva (convocatoria, cuenta, casa, jugador, nombre, eleccion, orden)
      SELECT convocatoria, cuenta, casa, casa, nombre, eleccion, orden FROM plaza_convocatoria`,
    'DROP TABLE plaza_convocatoria',
    'ALTER TABLE plaza_convocatoria_nueva RENAME TO plaza_convocatoria',
  ],
  bajar: [
    `CREATE TABLE plaza_convocatoria_vieja (
      convocatoria TEXT NOT NULL REFERENCES convocatoria(id),
      cuenta       TEXT NOT NULL REFERENCES cuenta(id),
      casa         TEXT NOT NULL,
      nombre       TEXT NOT NULL,
      eleccion     TEXT,
      orden        INTEGER NOT NULL,
      PRIMARY KEY (convocatoria, cuenta),
      UNIQUE (convocatoria, casa)
    ) STRICT`,
    `INSERT INTO plaza_convocatoria_vieja (convocatoria, cuenta, casa, nombre, eleccion, orden)
      SELECT convocatoria, cuenta, casa, nombre, eleccion, orden FROM plaza_convocatoria
      WHERE jugador = casa`,
    'DROP TABLE plaza_convocatoria',
    'ALTER TABLE plaza_convocatoria_vieja RENAME TO plaza_convocatoria',
  ],
};
