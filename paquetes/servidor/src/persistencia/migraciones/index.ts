// Las migraciones, en orden. Nunca se edita una ya publicada: se anyade otra al final.
import { MIGRACION_INICIAL } from './0001-inicial.ts';
import { MIGRACION_DE_CUENTAS } from './0002-cuentas.ts';
import { MIGRACION_DE_AVISOS } from './0003-avisos.ts';
import { MIGRACION_DE_CONVOCATORIAS } from './0004-convocatorias.ts';
import { MIGRACION_DE_CONTRASENYAS } from './0005-contrasenyas.ts';
import { MIGRACION_DE_CASAS_REPETIDAS } from './0006-casas-repetidas.ts';
import { MIGRACION_DE_TEMPORADAS } from './0007-temporadas.ts';
import { MIGRACION_DE_FIN_DE_TURNO } from './0008-fin-de-turno.ts';
import { MIGRACION_DE_CHARLA } from './0009-charla.ts';
import type { Migracion } from './tipos.ts';

export type { Migracion } from './tipos.ts';

export const MIGRACIONES: readonly Migracion[] = [
  MIGRACION_INICIAL,
  MIGRACION_DE_CUENTAS,
  MIGRACION_DE_AVISOS,
  MIGRACION_DE_CONVOCATORIAS,
  MIGRACION_DE_CONTRASENYAS,
  MIGRACION_DE_CASAS_REPETIDAS,
  MIGRACION_DE_TEMPORADAS,
  MIGRACION_DE_FIN_DE_TURNO,
  MIGRACION_DE_CHARLA,
];

/** Las versiones son consecutivas desde 1: si no, alguien ha editado la lista a mano. */
export function comprobarMigraciones(lista: readonly Migracion[] = MIGRACIONES): void {
  lista.forEach((migracion, i) => {
    if (migracion.version !== i + 1) {
      throw new Error(
        `La migracion "${migracion.nombre}" tiene la version ${String(migracion.version)} y le tocaba la ${String(i + 1)}: las versiones son consecutivas y no se renumeran.`,
      );
    }
  });
}
