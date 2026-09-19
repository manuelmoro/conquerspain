// Fase 0 · Mayordomo, plan y colas (docs/02-diseno-nucleo.md §2.5; ficha T-045).
//
// Antes que nada en el turno, y en este orden:
// 1. Entran las ordenes del plan de temporada cuyo turno ha llegado.
// 2. Se atienden las ordenes que cambian las reglas del mayordomo y las que reordenan colas.
// 3. El mayordomo mira sus reglas, de menor a mayor prioridad y hasta su limite, sobre el estado
//    con que empieza el turno, y da las ordenes que tocan. Son ordenes de jugador: pasan por la
//    misma alta y las mismas fases, y la cronica las marca como suyas.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { activarPlan, cancelarOrden, darDeAlta, empezarOrden, ordenesVivas } from '../ordenes.ts';
import type { OrdenDe } from '../ordenes.ts';
import { cumple, ordenDeAccion, reglasActivas, sobra } from '../reglas/mayordomo.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoJugador } from '../tipos/estado.ts';
import { nuevoId } from '../tipos/ids.ts';
import type { ReglaDeMayordomo } from '../tipos/ordenes.ts';
import { comparar, idsEnOrden } from '../utiles/orden.ts';
import { validarOrdenEntrante } from '../validacion/validarOrden.ts';

export function faseMayordomo(ctx: Contexto): void {
  activarPlan(ctx);
  for (const orden of ordenesVivas(ctx, 'mayordomo')) cambiarReglas(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'cola')) reordenarCola(ctx, orden);
  for (const id of idsEnOrden(ctx.estado.jugadores)) {
    const jugador = ctx.estado.jugadores[id];
    if (jugador !== undefined) atenderReglas(ctx, jugador);
  }
}

/** Da de baja una regla (por su prioridad) y da de alta otra; si ya habia una con esa prioridad, la cambia. */
function cambiarReglas(ctx: Contexto, orden: OrdenDe<'mayordomo'>): void {
  const jugador = ctx.estado.jugadores[orden.jugador];
  if (jugador === undefined) {
    cancelarOrden(ctx, orden, 'jugador-desconocido');
    return;
  }
  let reglas: ReglaDeMayordomo[] = [...jugador.mayordomo];
  if (orden.bajaPrioridad !== null) {
    if (!reglas.some((r) => r.prioridad === orden.bajaPrioridad)) {
      cancelarOrden(ctx, orden, 'regla-desconocida');
      return;
    }
    reglas = reglas.filter((r) => r.prioridad !== orden.bajaPrioridad);
  }
  const alta = orden.alta;
  if (alta !== null) {
    const cambia = reglas.some((r) => r.prioridad === alta.prioridad);
    if (!cambia && reglas.length >= ctx.reglas.mayordomo.reglasMaximas) {
      cancelarOrden(ctx, orden, 'mayordomo-lleno');
      return;
    }
    reglas = [...reglas.filter((r) => r.prioridad !== alta.prioridad), alta];
  }
  reglas.sort((a, b) => a.prioridad - b.prioridad);
  aplicar(ctx, { tipo: 'mayordomo', jugador: jugador.id, reglas });
  empezarOrden(ctx, orden, 'terminada');
}

function reordenarCola(ctx: Contexto, orden: OrdenDe<'cola'>): void {
  const jugador = ctx.estado.jugadores[orden.jugador];
  const actual = [...(jugador?.colas[orden.clave] ?? [])].sort(comparar);
  const nueva = [...orden.orden].sort(comparar);
  if (
    jugador === undefined ||
    actual.length !== nueva.length ||
    actual.some((id, i) => id !== nueva[i])
  ) {
    cancelarOrden(ctx, orden, 'cola-distinta');
    return;
  }
  aplicar(ctx, { tipo: 'cola', jugador: jugador.id, clave: orden.clave, orden: orden.orden });
  empezarOrden(ctx, orden, 'terminada');
}

function atenderReglas(ctx: Contexto, jugador: EstadoJugador): void {
  const situacion = {
    estado: ctx.estado,
    jugador,
    mundo: ctx.mundo,
    reglas: ctx.reglas,
    turno: ctx.turno,
    estacional: ctx.estacional,
  };
  for (const regla of reglasActivas(jugador, ctx.estado, ctx.reglas)) {
    if (!cumple(regla.condicion, situacion) || sobra(regla.accion, jugador, ctx.estado)) continue;
    const id = nuevoId('orden', ctx.estado.siguienteId);
    aplicar(ctx, { tipo: 'siguiente-id' });
    const orden = ordenDeAccion(regla.accion, id, jugador, ctx.turno);
    // El mayordomo no se salta nada: su orden pasa por la misma validacion que la del jugador.
    if (!validarOrdenEntrante(orden).ok) continue;
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'mayordomo.ordena',
      { prioridad: regla.prioridad, orden: id, clase: orden.tipo, delMayordomo: 1 },
      { jugador: jugador.id },
    );
    darDeAlta(ctx, orden);
  }
}
