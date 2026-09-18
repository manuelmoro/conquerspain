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

/**
 * Da de alta las ordenes nuevas del turno, en orden de identificador, y reserva su coste. Si ya no
 * cabe (el servidor valida al darla, pero el motor no se fia), la orden se cancela con su motivo.
 */
export function darDeAltaOrdenesNuevas(ctx: Contexto): void {
  for (const orden of ctx.ordenes) {
    aplicar(ctx, {
      tipo: 'orden-alta',
      orden: { ...orden, estado: 'pendiente', motivoEspera: null },
    });
    if (cabe(ctx, orden)) {
      reservar(ctx, orden, 1, `reserva de la orden ${orden.id}`);
    } else {
      aplicar(ctx, {
        tipo: 'orden-estado',
        orden: orden.id,
        estado: 'cancelada',
        motivo: 'sin-recursos',
      });
    }
  }
}

/** Ordenes vivas de un tipo, en orden de identificador. */
export function ordenesVivas<T extends TipoDeOrden>(ctx: Contexto, tipo: T): OrdenDe<T>[] {
  const ordenes: readonly Orden[] = ctx.estado.ordenes;
  return ordenes
    .filter(
      (orden): orden is OrdenDe<T> =>
        orden.tipo === tipo && (orden.estado === 'pendiente' || orden.estado === 'en espera'),
    )
    .sort((a, b) => comparar(a.id, b.id));
}

/** Empieza una orden: paga su coste reservado y la deja en curso o terminada. */
export function empezarOrden(ctx: Contexto, orden: Orden, queda: 'en curso' | 'terminada'): void {
  reservar(ctx, orden, -1, `empieza la orden ${orden.id}`);
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
  aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado: queda, motivo: null });
}

/** La orden no puede empezar este turno: sigue reservada y se revalida el que viene. */
export function dejarEnEspera(ctx: Contexto, orden: Orden, motivo: string): void {
  if (orden.estado === 'en espera' && orden.motivoEspera === motivo) return;
  aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado: 'en espera', motivo });
}

/** La orden ya no tiene sentido: se libera su reserva y se cancela. */
export function cancelarOrden(ctx: Contexto, orden: Orden, motivo: string): void {
  reservar(ctx, orden, -1, `se cancela la orden ${orden.id}`);
  aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado: 'cancelada', motivo });
}

/** Al acabar el turno, las ordenes terminadas y canceladas salen del estado. */
export function retirarOrdenesCerradas(ctx: Contexto): void {
  const cerradas = ctx.estado.ordenes
    .filter((o) => o.estado === 'terminada' || o.estado === 'cancelada')
    .map((o) => o.id);
  for (const id of cerradas) aplicar(ctx, { tipo: 'orden-retirar', orden: id });
}
