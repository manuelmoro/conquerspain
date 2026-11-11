// Quien ha dado por terminado el turno (ficha T-124 §2.2). Cuentan los que juegan de verdad: con una
// cuenta y ya dados de alta en el estado. Quien acaba de pedir entrar aun no tiene casa que mandar, y
// las plazas sin cuenta (las de las herramientas) no pueden pulsar nada: ninguno de los dos frena.
import type { IdJugador, IdPartida } from '@conquer/nucleo';

import type { Repositorio } from '../persistencia/repositorio.ts';

export interface QuienJuega {
  readonly jugador: IdJugador;
  readonly nombre: string;
  readonly terminado: boolean;
}

/** Quien ha pedido entrar con la partida empezada y entra al resolverse este turno (T-131). */
export interface QuienEntra {
  readonly nombre: string;
  readonly casa: string;
}

export interface FinDeTurno {
  readonly turno: number;
  readonly quienes: readonly QuienJuega[];
  /** No frenan el turno (aun no tienen casa que mandar), pero quien convoca debe saber que esperan. */
  readonly entrando: readonly QuienEntra[];
  /** true si hay alguien que cuente y todos lo han terminado. */
  readonly todos: boolean;
}

export async function finDeTurno(
  repo: Pick<
    Repositorio,
    'partida' | 'participantes' | 'ultimoEstado' | 'turnoTerminadoPor' | 'ordenesPendientes'
  >,
  id: IdPartida,
): Promise<FinDeTurno | null> {
  const fila = await repo.partida(id);
  const estado = await repo.ultimoEstado(id);
  if (fila === null || estado === null) return null;
  const terminados = new Set(await repo.turnoTerminadoPor(id, fila.turnoActual));
  const quienes = (await repo.participantes(id)).flatMap((p) => {
    const jugador = estado.jugadores[p.jugador];
    if (p.cuenta === null || jugador === undefined) return [];
    return [{ jugador: p.jugador, nombre: jugador.nombre, terminado: terminados.has(p.jugador) }];
  });
  const entrando = (await repo.ordenesPendientes(id)).flatMap((o) =>
    o.orden.tipo === 'entrar' ? [{ nombre: o.orden.nombre, casa: o.orden.casa }] : [],
  );
  return {
    turno: fila.turnoActual,
    quienes,
    entrando,
    todos: quienes.length > 0 && quienes.every((q) => q.terminado),
  };
}
