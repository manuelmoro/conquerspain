// Tradiciones (T-042, docs/04-casas-y-tradiciones.md §4.3; ficha T-042 §4.1).
//
// Primero se eligen y despues se abren: una orden solo puede elegir en una ronda que ya estaba
// abierta al empezar el turno, porque las cartas se ensenyan en la cronica del turno en que la
// ronda se abre. La tradicion elegida rige desde el turno siguiente: todas las fases de este ya
// han pasado. Elegir no cuesta nada, y dos elecciones del mismo jugador para la misma ronda en el
// mismo turno se cancelan las dos: nunca decide el orden en que llegaron.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { cancelarOrden, empezarOrden, ordenesVivas } from '../ordenes.ts';
import type { OrdenDe } from '../ordenes.ts';
import { impedimentoDeTradicion, logrosDe, rondasPorAbrir } from '../reglas/tradiciones.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import { idsEnOrden } from '../utiles/orden.ts';

export function tradiciones(ctx: Contexto): void {
  const ordenes = ordenesVivas(ctx, 'tradicion');
  for (const orden of ordenes) elegir(ctx, orden, ordenes);
  abrirRondas(ctx);
}

/** Clave de jugador y ronda de una orden, o null si la tradicion no existe. */
function rondaDe(ctx: Contexto, orden: OrdenDe<'tradicion'>): string | null {
  const datos = ctx.reglas.tradiciones[orden.tradicion];
  return datos === undefined ? null : `${orden.jugador}|${datos.ronda}`;
}

function elegir(
  ctx: Contexto,
  orden: OrdenDe<'tradicion'>,
  todas: readonly OrdenDe<'tradicion'>[],
): void {
  const jugador = ctx.estado.jugadores[orden.jugador];
  if (jugador === undefined) {
    cancelarOrden(ctx, orden, 'jugador-desconocido');
    return;
  }
  if (RECURSOS.some((recurso) => orden.coste[recurso] !== 0)) {
    cancelarOrden(ctx, orden, 'coste-incoherente');
    return;
  }
  const clave = rondaDe(ctx, orden);
  if (
    clave !== null &&
    todas.some((otra) => otra.id !== orden.id && rondaDe(ctx, otra) === clave)
  ) {
    cancelarOrden(ctx, orden, 'eleccion-ambigua');
    return;
  }
  const impedimento = impedimentoDeTradicion(jugador, orden.tradicion, ctx.reglas);
  if (impedimento !== null) {
    cancelarOrden(ctx, orden, impedimento);
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  aplicar(ctx, { tipo: 'tradicion', jugador: orden.jugador, tradicion: orden.tradicion });
}

function abrirRondas(ctx: Contexto): void {
  for (const id of idsEnOrden(ctx.estado.jugadores)) {
    const jugador = ctx.estado.jugadores[id];
    if (jugador === undefined) continue;
    const logros = logrosDe(ctx.estado, jugador, ctx.turno, ctx.sucesos);
    for (const ronda of rondasPorAbrir(jugador, logros, ctx.reglas)) {
      aplicar(ctx, { tipo: 'ronda', jugador: jugador.id, ronda });
    }
  }
}
