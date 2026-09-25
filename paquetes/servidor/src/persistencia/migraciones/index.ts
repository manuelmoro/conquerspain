// Las migraciones, en orden. Nunca se edita una ya publicada: se anyade otra al final.
import { MIGRACION_INICIAL } from './0001-inicial.ts';
import type { Migracion } from './tipos.ts';

export type { Migracion } from './tipos.ts';

export const MIGRACIONES: readonly Migracion[] = [MIGRACION_INICIAL];

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
