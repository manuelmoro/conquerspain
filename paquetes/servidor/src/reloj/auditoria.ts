// La auditoria reproduce un turno pasado (ficha T-061 §4.8): mismo estado, mismas ordenes, mismo
// motor y misma huella; si no, o cambio el motor o se corrompieron los datos.
import { huella } from '@conquer/nucleo';
import type { IdPartida, TablasDeReglas, resolverTurno } from '@conquer/nucleo';

import type { Repositorio } from '../persistencia/repositorio.ts';
import type { ProveedorDeMundo } from './mundoDeLaPartida.ts';

export interface ReproduccionDeTurno {
  readonly coincide: boolean;
  readonly esperada: string;
  readonly obtenida: string;
}

export async function reproducirTurno(
  dep: {
    readonly repo: Repositorio;
    readonly reglas: TablasDeReglas;
    readonly proveedorDeMundo: ProveedorDeMundo;
    readonly resolverTurno: typeof resolverTurno;
  },
  id: IdPartida,
  turno: number,
): Promise<ReproduccionDeTurno> {
  const fila = await dep.repo.partida(id);
  const estado = await dep.repo.estado(id, turno);
  const auditoria = await dep.repo.auditoria(id, turno);
  if (fila === null || estado === null || auditoria === null) {
    throw new Error(
      `No hay auditoria del turno ${String(turno)} de la partida "${id}": solo se pueden reproducir turnos ya resueltos.`,
    );
  }
  const ordenes = (await dep.repo.ordenesDelTurno(id, turno)).map((o) => o.orden);
  const mundo = dep.proveedorDeMundo(fila, estado);
  const obtenida = huella(dep.resolverTurno(estado, ordenes, mundo, dep.reglas).estado);
  return {
    coincide: obtenida === auditoria.huellaSalida,
    esperada: auditoria.huellaSalida,
    obtenida,
  };
}
