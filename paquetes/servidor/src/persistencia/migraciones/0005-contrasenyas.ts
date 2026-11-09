// Migracion 5 (ficha T-091 §3.1): cuentas con contrasenya. La contrasenya se guarda solo como hash
// scrypt; el correo confirmado, los fallos seguidos y el bloqueo por fuerza bruta van en la cuenta; y
// los enlaces para restablecerla, como los de acceso, guardan solo el SHA-256 de su token. Las cuentas
// que ya existian entraron por un enlace a su correo: se dan por confirmadas.
import type { Migracion } from './tipos.ts';

export const MIGRACION_DE_CONTRASENYAS: Migracion = {
  version: 5,
  nombre: 'contrasenyas',
  subir: [
    'ALTER TABLE cuenta ADD COLUMN clave TEXT',
    'ALTER TABLE cuenta ADD COLUMN confirmada_en INTEGER',
    'ALTER TABLE cuenta ADD COLUMN fallos INTEGER NOT NULL DEFAULT 0',
    'ALTER TABLE cuenta ADD COLUMN bloqueada_hasta INTEGER',
    'UPDATE cuenta SET confirmada_en = creada_en',
    `CREATE TABLE restablecimiento (
      hash       TEXT PRIMARY KEY,
      cuenta     TEXT NOT NULL REFERENCES cuenta(id),
      creado_en  INTEGER NOT NULL,
      expira_en  INTEGER NOT NULL,
      usado_en   INTEGER
    ) STRICT`,
    'CREATE INDEX restablecimiento_por_cuenta ON restablecimiento (cuenta, creado_en)',
  ],
  bajar: [
    'DROP INDEX restablecimiento_por_cuenta',
    'DROP TABLE restablecimiento',
    'ALTER TABLE cuenta DROP COLUMN bloqueada_hasta',
    'ALTER TABLE cuenta DROP COLUMN fallos',
    'ALTER TABLE cuenta DROP COLUMN confirmada_en',
    'ALTER TABLE cuenta DROP COLUMN clave',
  ],
};
