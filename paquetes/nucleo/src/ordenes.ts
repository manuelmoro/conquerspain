// Ciclo de vida de las ordenes en el motor (docs/02-diseno-nucleo.md §2.3.3).
//
//   alta ──► pendiente ──(la fase la empieza)──► en curso / terminada
//                 │  ▲
//                 ▼  │ (se revalida cada turno)
//             en espera
//
// Una orden viva (pendiente o en espera) tiene su coste reservado en el almacen: nadie puede
// gastarlo dos veces. Al empezar se libera la reserva y se paga; al cancelar se libera sin pagar.
// Las terminadas y canceladas se retiran del estado al acabar el turno.
import { aplicar } from './cambios.ts';
import type { Contexto } from './contexto.ts';
import type { Orden, TipoDeOrden } from './tipos/ordenes.ts';
import { RECURSOS } from './tipos/recursos.ts';
import { ErrorDeMotor } from './errores.ts';
import { registrarSuceso } from './sucesos.ts';
import { comparar } from './utiles/orden.ts';

export type OrdenDe<T extends TipoDeOrden> = Extract<Orden, { readonly tipo: T }>;

function cabe(ctx: Contexto, orden: Orden): boolean {
  const jugador = ctx.estado.jugadores[orden.jugador];
  if (jugador === undefined) return false;
  return RECURSOS.every((r) => jugador.almacen[r] - jugador.reservado[r] >= orden.coste[r]);
}

function reservar(ctx: Contexto, orden: Orden, signo: 1 | -1, motivo: string): void {
  for (const recurso of RECURSOS) {
    const cantidad = orden.coste[recurso];
    if (cantidad > 0) {
      aplicar(ctx, {
        tipo: 'reservado',
        jugador: orden.jugador,
        recurso,
        delta: signo * cantidad,
        motivo,
      });
    }
  }
}

/** Una orden reserva su coste mientras esta pendiente o en espera; programada o en cola, no. */
export function reservada(orden: Orden): boolean {
  return orden.estado === 'pendiente' || orden.estado === 'en espera';
}

/** Las ordenes que admite cada clase de cola (docs/02 §2.5.1). */
const ADMITE: Readonly<Record<string, readonly TipoDeOrden[]>> = {
  comarca: ['construir', 'derribar', 'roturar', 'obra-mayor', 'aperos'],
  recua: ['ruta', 'cometido', 'carga'],
};

/** La cola de una orden existe y admite su tipo: `comarca:<id>` del mundo o `recua:<id>`. */
function colaAdmite(ctx: Contexto, orden: Orden): boolean {
  if (orden.cola === null) return false;
  const [clase, id] = orden.cola.split(':');
  if (clase === undefined || id === undefined || id === '') return false;
  if (!(ADMITE[clase] ?? []).includes(orden.tipo)) return false;
  return clase === 'recua' || ctx.mundo.comarcas[id] !== undefined;
}

/**
 * Lo que pasa con una orden cuando entra en juego —al darla o al llegar su turno del plan—: a su
 * cola sin reservar nada, o pendiente con su coste reservado, o cancelada si no cabe.
 */
function entrar(ctx: Contexto, orden: Orden, alta: boolean): void {
  let estado: 'en cola' | 'pendiente' | 'cancelada';
  let motivo: string | null = null;
  if (orden.cola !== null) {
    estado = colaAdmite(ctx, orden) ? 'en cola' : 'cancelada';
    if (estado === 'cancelada') motivo = 'cola-no-admitida';
  } else if (cabe(ctx, orden)) {
    estado = 'pendiente';
  } else {
    estado = 'cancelada';
    motivo = 'sin-recursos';
  }
  if (alta) {
    // La que no puede entrar se da de alta pendiente y se cancela a continuacion, con su motivo.
    const deAlta = estado === 'en cola' ? 'en cola' : 'pendiente';
    aplicar(ctx, { tipo: 'orden-alta', orden: { ...orden, estado: deAlta, motivoEspera: null } });
    if (estado === 'cancelada')
      aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado, motivo });
  } else {
    aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado, motivo });
  }
  if (estado === 'pendiente') reservar(ctx, orden, 1, `reserva de la orden ${orden.id}`);
}

/**
 * Da de alta las ordenes nuevas del turno, en orden de identificador. Las del plan de temporada
 * esperan programadas a su turno (como mucho `turnosDePlan` por delante); las demas entran ya.
 */
export function darDeAltaOrdenesNuevas(ctx: Contexto): void {
  for (const orden of ctx.ordenes) darDeAlta(ctx, orden);
}

/** Da de alta una orden: la del jugador al empezar el turno o la que da el mayordomo. */
export function darDeAlta(ctx: Contexto, orden: Orden): void {
  const turno = orden.turnoProgramado;
  if (turno === null || turno <= ctx.turno) {
    entrar(ctx, orden, true);
    return;
  }
  const lejos = turno > ctx.turno + ctx.reglas.mayordomo.turnosDePlan;
  aplicar(ctx, {
    tipo: 'orden-alta',
    orden: { ...orden, estado: lejos ? 'pendiente' : 'programada', motivoEspera: null },
  });
  if (lejos) {
    aplicar(ctx, {
      tipo: 'orden-estado',
      orden: orden.id,
      estado: 'cancelada',
      motivo: 'fuera-de-temporada',
    });
  }
}

/** Las ordenes del plan cuyo turno ha llegado entran en juego, en orden de identificador. */
export function activarPlan(ctx: Contexto): void {
  const llegadas = ctx.estado.ordenes
    .filter((o) => o.estado === 'programada' && (o.turnoProgramado ?? 0) <= ctx.turno)
    .sort((a, b) => comparar(a.id, b.id));
  for (const orden of llegadas) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'plan.entra',
      { orden: orden.id, clase: orden.tipo, delMayordomo: orden.delMayordomo ? 1 : 0 },
      { jugador: orden.jugador },
    );
    entrar(ctx, orden, false);
  }
}

/** Puesto de una orden en su cola; las que no van en cola, antes que todas. */
function puestoEnCola(ctx: Contexto, orden: Orden): number {
  if (orden.estado !== 'en cola' || orden.cola === null) return -1;
  return ctx.estado.jugadores[orden.jugador]?.colas[orden.cola]?.indexOf(orden.id) ?? -1;
}

/**
 * El orden en que las fases atienden las ordenes: primero las normales, por identificador; despues
 * las de cola, cola a cola y en el orden de cada una. Asi la cola se come lo que sobra y nunca se
 * adelanta a lo que el jugador ordeno suelto.
 */
export function compararOrdenes(ctx: Contexto): (a: Orden, b: Orden) => number {
  return (a, b) => {
    const enColaA = a.estado === 'en cola';
    const enColaB = b.estado === 'en cola';
    if (enColaA !== enColaB) return enColaA ? 1 : -1;
    if (!enColaA) return comparar(a.id, b.id);
    return (
      comparar(a.jugador, b.jugador) ||
      comparar(a.cola ?? '', b.cola ?? '') ||
      puestoEnCola(ctx, a) - puestoEnCola(ctx, b)
    );
  };
}

/** La orden es la primera de su cola: en las colas de recua solo trabaja esa. */
export function esPrimeraDeSuCola(ctx: Contexto, orden: Orden): boolean {
  return puestoEnCola(ctx, orden) === 0;
}

/** Ordenes vivas de un tipo: pendientes, en espera y en cola, en el orden de `compararOrdenes`. */
export function ordenesVivas<T extends TipoDeOrden>(ctx: Contexto, tipo: T): OrdenDe<T>[] {
  const ordenes: readonly Orden[] = ctx.estado.ordenes;
  return ordenes
    .filter(
      (orden): orden is OrdenDe<T> =>
        orden.tipo === tipo && (reservada(orden) || orden.estado === 'en cola'),
    )
    .sort(compararOrdenes(ctx));
}

/** Ordenes de un tipo que ya empezaron y siguen su curso, en orden de identificador. */
export function ordenesEnCurso<T extends TipoDeOrden>(ctx: Contexto, tipo: T): OrdenDe<T>[] {
  const ordenes: readonly Orden[] = ctx.estado.ordenes;
  return ordenes
    .filter((orden): orden is OrdenDe<T> => orden.tipo === tipo && orden.estado === 'en curso')
    .sort((a, b) => comparar(a.id, b.id));
}

/**
 * La orden se puede pagar si empieza ahora: la reservada ya lo tiene apartado; la de cola, si el
 * almacen da para ella en este momento. Las fases lo miran antes de `empezarOrden`.
 */
export function puedePagarse(ctx: Contexto, orden: Orden): boolean {
  return reservada(orden) || cabe(ctx, orden);
}

/** Empieza una orden: paga su coste (reservado o, si venia de su cola, del almacen). */
export function empezarOrden(ctx: Contexto, orden: Orden, queda: 'en curso' | 'terminada'): void {
  const deCola = orden.estado === 'en cola';
  if (deCola && !cabe(ctx, orden)) {
    throw new ErrorDeMotor(
      'invariante-rota',
      `La orden "${orden.id}" sale de su cola sin que el almacen de para pagarla: mira puedePagarse antes.`,
      { orden: orden.id },
    );
  }
  if (!deCola) reservar(ctx, orden, -1, `empieza la orden ${orden.id}`);
  for (const recurso of RECURSOS) {
    const cantidad = orden.coste[recurso];
    if (cantidad > 0) {
      aplicar(ctx, {
        tipo: 'recurso',
        jugador: orden.jugador,
        recurso,
        delta: -cantidad,
        motivo: `orden ${orden.id}`,
      });
    }
  }
  if (deCola && orden.cola !== null) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'cola.empieza',
      { orden: orden.id, clase: orden.tipo, cola: orden.cola },
      { jugador: orden.jugador },
    );
  }
  aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado: queda, motivo: null });
}

/**
 * La orden no puede empezar este turno: se revalida el que viene. La reservada sigue reservada; la
 * de cola sigue en su cola, sin reservar, con el motivo apuntado.
 */
export function dejarEnEspera(ctx: Contexto, orden: Orden, motivo: string): void {
  const estado = orden.estado === 'en cola' ? 'en cola' : 'en espera';
  if (orden.estado === estado && orden.motivoEspera === motivo) return;
  aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado, motivo });
}

/** La orden ya no tiene sentido: se libera lo que tuviera reservado y se cancela. */
export function cancelarOrden(ctx: Contexto, orden: Orden, motivo: string): void {
  if (reservada(orden)) reservar(ctx, orden, -1, `se cancela la orden ${orden.id}`);
  aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado: 'cancelada', motivo });
}

/** Al acabar el turno, las ordenes terminadas y canceladas salen del estado. */
export function retirarOrdenesCerradas(ctx: Contexto): void {
  const cerradas = ctx.estado.ordenes
    .filter((o) => o.estado === 'terminada' || o.estado === 'cancelada')
    .map((o) => o.id);
  for (const id of cerradas) aplicar(ctx, { tipo: 'orden-retirar', orden: id });
}
