// El historico de los recursos de un jugador (T-090): por turno y recurso, lo que entro, lo que salio y
// lo que quedo, de los ultimos turnos, y desde T-126 en que se gasto y de donde vino, concepto por
// concepto. Sale de sus propios movimientos de almacen: nada de otras casas.
import { RECURSOS, conceptoDeMovimiento, recursosSegun } from '@conquer/nucleo';
import type {
  ClaseDeConcepto,
  EstadoPartida,
  IdJugador,
  IdOrden,
  IdPartida,
  Orden,
  Recurso,
} from '@conquer/nucleo';

import type { Repositorio } from '../persistencia/repositorio.ts';

/** Cuantos turnos hacia atras: un anyo. */
export const TURNOS_DE_HISTORIAL = 24;

/** Lo que movio un concepto en un turno: positivo si entro, negativo si salio. */
export interface PartidaDelDesglose {
  readonly clase: ClaseDeConcepto;
  readonly ref: string | null;
  readonly delta: number;
}

export interface CuentaDelTurno {
  readonly entra: number;
  readonly sale: number;
  /** Lo que habia al acabar el turno. */
  readonly queda: number;
  /** Concepto por concepto, de lo que mas movio a lo que menos (T-126). */
  readonly desglose: readonly PartidaDelDesglose[];
}

export interface TurnoDelHistorial {
  readonly turno: number;
  readonly recursos: Readonly<Record<Recurso, CuentaDelTurno>>;
}

/** A que se refieren los conceptos que nombran ordenes u obras, para contarlos en castellano. */
export interface ReferenciasDelHistorial {
  /** Las ordenes propias que pagaron o devolvieron algo. */
  readonly ordenes: Readonly<Record<string, Orden>>;
  /** Las obras propias aun en marcha: que se levanta y donde. */
  readonly obras: Readonly<Record<string, { readonly que: string; readonly comarca: string }>>;
}

export interface Historial {
  readonly turnos: readonly TurnoDelHistorial[];
  readonly referencias: ReferenciasDelHistorial;
}

function desglosar(
  movimientos: readonly { readonly motivo: string; readonly delta: number }[],
): PartidaDelDesglose[] {
  const suma = new Map<string, PartidaDelDesglose>();
  for (const m of movimientos) {
    const { clase, ref } = conceptoDeMovimiento(m.motivo);
    const clave = `${clase}\u0000${ref ?? ''}`;
    const antes = suma.get(clave);
    suma.set(clave, { clase, ref, delta: (antes?.delta ?? 0) + m.delta });
  }
  // De lo que mas movio a lo que menos; a igual cantidad, por concepto y referencia: siempre igual.
  return [...suma.values()]
    .filter((p) => p.delta !== 0)
    .sort(
      (a, b) =>
        Math.abs(b.delta) - Math.abs(a.delta) ||
        (a.clase < b.clase ? -1 : a.clase > b.clase ? 1 : 0) ||
        ((a.ref ?? '') < (b.ref ?? '') ? -1 : (a.ref ?? '') > (b.ref ?? '') ? 1 : 0),
    );
}

export async function historialDeRecursos(
  repo: Pick<Repositorio, 'estado' | 'movimientosDeAlmacen' | 'orden'>,
  partida: IdPartida,
  jugador: IdJugador,
  actual: EstadoPartida,
): Promise<Historial> {
  const hasta = actual.turno - 1;
  const desde = Math.max(1, hasta - TURNOS_DE_HISTORIAL + 1);
  if (hasta < desde) return { turnos: [], referencias: { ordenes: {}, obras: {} } };
  // Lo que habia al empezar el primer turno mirado, y de ahi se suman los movimientos.
  const inicial = (await repo.estado(partida, desde))?.jugadores[jugador]?.almacen;
  const movimientos = await repo.movimientosDeAlmacen(partida, jugador, desde, hasta);
  const queda: Record<Recurso, number> = { ...recursosSegun((r) => inicial?.[r] ?? 0) };
  const turnos: TurnoDelHistorial[] = [];
  for (let turno = desde; turno <= hasta; turno += 1) {
    const cuenta = (r: Recurso): CuentaDelTurno => {
      const suyos = movimientos.filter((m) => m.turno === turno && m.recurso === r);
      let entra = 0;
      let sale = 0;
      for (const m of suyos) {
        if (m.delta > 0) entra += m.delta;
        else sale -= m.delta;
      }
      queda[r] += entra - sale;
      return { entra, sale, queda: queda[r], desglose: desglosar(suyos) };
    };
    turnos.push({
      turno,
      recursos: {
        pan: cuenta('pan'),
        madera: cuenta('madera'),
        piedra: cuenta('piedra'),
        maravedis: cuenta('maravedis'),
        sal: cuenta('sal'),
        hierro: cuenta('hierro'),
        lana: cuenta('lana'),
      },
    });
  }
  return { turnos, referencias: await referencias(repo, partida, jugador, actual, turnos) };
}

/** Las ordenes y obras que nombra el desglose, para que el cliente diga cuales eran. */
async function referencias(
  repo: Pick<Repositorio, 'orden'>,
  partida: IdPartida,
  jugador: IdJugador,
  actual: EstadoPartida,
  turnos: readonly TurnoDelHistorial[],
): Promise<ReferenciasDelHistorial> {
  const idsDeOrden = new Set<string>();
  const idsDeObra = new Set<string>();
  for (const t of turnos) {
    for (const r of RECURSOS) {
      for (const p of t.recursos[r].desglose) {
        if (p.ref === null) continue;
        if (p.clase === 'orden' || p.clase === 'devolucion') idsDeOrden.add(p.ref);
        if (p.clase === 'obra') idsDeObra.add(p.ref);
      }
    }
  }
  const ordenes: Record<string, Orden> = {};
  for (const id of [...idsDeOrden].sort()) {
    // Las del mayordomo no pasan por la API: solo estan en el estado mientras siguen vivas.
    const orden =
      (await repo.orden(partida, id as IdOrden))?.orden ?? actual.ordenes.find((o) => o.id === id);
    if (orden?.jugador === jugador) ordenes[id] = orden;
  }
  const obras: Record<string, { que: string; comarca: string }> = {};
  for (const id of [...idsDeObra].sort()) {
    const obra = actual.obras[id];
    if (obra?.jugador === jugador) obras[id] = { que: obra.que, comarca: obra.comarca };
  }
  return { ordenes, obras };
}
