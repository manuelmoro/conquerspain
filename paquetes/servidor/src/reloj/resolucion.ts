// Resolver un turno de una partida con todas sus salvaguardas (ficha T-061 §4.2 a §4.5).
import {
  VERSION_NUCLEO,
  VERSION_REGLAS,
  explicar,
  huella,
  validarOrdenEnMundo,
} from '@conquer/nucleo';
import type { IdPartida, Orden, TablasDeReglas, resolverTurno } from '@conquer/nucleo';

import { ErrorDePersistencia } from '../persistencia/repositorio.ts';
import type {
  OrdenRechazada,
  Repositorio,
  ResolucionDeTurno,
} from '../persistencia/repositorio.ts';
import type { ProveedorDeMundo } from './mundoDeLaPartida.ts';
import { proximaResolucion } from './calendario.ts';
import type { Registro } from './registro.ts';

export interface DependenciasDeResolucion {
  readonly repo: Repositorio;
  readonly reglas: TablasDeReglas;
  readonly proveedorDeMundo: ProveedorDeMundo;
  readonly resolverTurno: typeof resolverTurno;
  readonly registro: Registro;
  /** Milisegundos Unix. Es lo unico que sabe la hora. */
  readonly ahora: () => number;
}

export type ResultadoDeUnTurno =
  | { readonly tipo: 'resuelto'; readonly turno: number; readonly ordenes: number }
  | { readonly tipo: 'no-debida' }
  | { readonly tipo: 'conflicto' }
  | { readonly tipo: 'detenida'; readonly motivo: string };

export interface OpcionesDeResolucion {
  /** Resolver aunque aun no sea la hora (avance manual de las partidas de prueba). */
  readonly ignorarHora?: boolean;
}

/** Un fallo transitorio de la base (bloqueo): no es culpa de la partida y no la detiene. */
function esTransitorio(error: unknown): boolean {
  return error instanceof Error && /database is locked|busy/i.test(error.message);
}

export async function resolverUnTurno(
  dep: DependenciasDeResolucion,
  id: IdPartida,
  opciones: OpcionesDeResolucion = {},
): Promise<ResultadoDeUnTurno> {
  const { repo, registro } = dep;
  const fila = await repo.partida(id);
  if (fila === null || fila.estado !== 'activa') return { tipo: 'no-debida' };
  const ahora = dep.ahora();
  if (
    opciones.ignorarHora !== true &&
    (fila.proximaResolucion === null || fila.proximaResolucion > ahora)
  ) {
    return { tipo: 'no-debida' };
  }
  try {
    if (fila.versionReglas !== VERSION_REGLAS) {
      throw new Error(
        `version-de-reglas: la partida es de la version ${String(fila.versionReglas)} y el motor de la ${String(VERSION_REGLAS)}: hay que migrarla antes de resolver.`,
      );
    }
    const estado = await repo.ultimoEstado(id);
    if (estado === null || estado.turno !== fila.turnoActual) {
      throw new Error(
        `estado-desalineado: la partida dice estar en el turno ${String(fila.turnoActual)} y su ultimo estado guardado es el ${String(estado?.turno ?? 'ninguno')}.`,
      );
    }
    const mundo = dep.proveedorDeMundo(fila, estado);

    const pendientes = await repo.ordenesPendientes(id);
    const entran: Orden[] = [];
    const rechazadas: OrdenRechazada[] = [];
    for (const guardada of pendientes) {
      const valida = validarOrdenEnMundo(guardada.orden, mundo);
      if (valida.ok) entran.push(guardada.orden);
      else rechazadas.push({ id: guardada.id, motivo: explicar(valida.errores) });
    }

    const inicio = performance.now();
    const resultado = dep.resolverTurno(estado, entran, mundo, dep.reglas);
    const duracionMs = Math.round(performance.now() - inicio);
    const resolucion: ResolucionDeTurno = {
      partida: id,
      turnoResuelto: estado.turno,
      estadoNuevo: resultado.estado,
      cronicas: resultado.cronicas,
      sucesos: resultado.sucesos,
      ordenesAplicadas: entran.map((o) => o.id),
      ordenesRechazadas: rechazadas,
      auditoria: {
        huellaEntrada: huella(estado),
        huellaSalida: huella(resultado.estado),
        huellaOrdenes: huella(entran),
        ordenes: entran.length,
        duracionMs,
        versionReglas: VERSION_REGLAS,
        versionNucleo: VERSION_NUCLEO,
      },
      proximaResolucion: proximaResolucion(fila.ancla, fila.intervaloSegundos, estado.turno + 1),
    };
    await repo.guardarResolucion(resolucion, dep.ahora());
    registro.anotar('info', 'turno-resuelto', {
      partida: id,
      turno: estado.turno,
      ordenes: entran.length,
      rechazadas: rechazadas.length,
      duracionMs,
    });
    return { tipo: 'resuelto', turno: estado.turno, ordenes: entran.length };
  } catch (error) {
    if (error instanceof ErrorDePersistencia && error.codigo === 'conflicto-de-turno') {
      registro.anotar('aviso', 'conflicto-de-turno', { partida: id, detalle: error.message });
      return { tipo: 'conflicto' };
    }
    if (esTransitorio(error)) throw error;
    const motivo = error instanceof Error ? error.message : 'error desconocido';
    await repo.detenerPartida(id, motivo);
    registro.anotar('error', 'partida-detenida', { partida: id, motivo });
    return { tipo: 'detenida', motivo };
  }
}
