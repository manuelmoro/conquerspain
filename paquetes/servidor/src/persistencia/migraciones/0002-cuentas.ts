// Migracion 2 (ficha T-063 §4.8): cuentas, enlaces de acceso y sesiones. De los tokens solo se
// guarda el SHA-256: un volcado de la base no sirve para entrar.
import type { Migracion } from './tipos.ts';

export const MIGRACION_DE_CUENTAS: Migracion = {
  version: 2,
  nombre: 'cuentas',
  subir: [
    `CREATE TABLE cuenta (
      id         TEXT PRIMARY KEY,
      correo     TEXT NOT NULL UNIQUE,
      nombre     TEXT NOT NULL,
      creada_en  INTEGER NOT NULL,
      borrada_en INTEGER
    ) STRICT`,
    `CREATE TABLE enlace_de_acceso (
      hash       TEXT PRIMARY KEY,
      correo     TEXT NOT NULL,
      nombre     TEXT,
      creado_en  INTEGER NOT NULL,
      expira_en  INTEGER NOT NULL,
      usado_en   INTEGER
    ) STRICT`,
    'CREATE INDEX enlace_por_correo ON enlace_de_acceso (correo, creado_en)',
    `CREATE TABLE sesion (
      hash        TEXT PRIMARY KEY,
      cuenta      TEXT NOT NULL REFERENCES cuenta(id),
      creada_en   INTEGER NOT NULL,
      expira_en   INTEGER NOT NULL,
      revocada_en INTEGER
    ) STRICT`,
    'CREATE INDEX sesion_por_cuenta ON sesion (cuenta)',
  ],
  bajar: [
    'DROP INDEX sesion_por_cuenta',
    'DROP TABLE sesion',
    'DROP INDEX enlace_por_correo',
    'DROP TABLE enlace_de_acceso',
    'DROP TABLE cuenta',
  ],
};
