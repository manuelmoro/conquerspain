// Letra de cambio (T-041, docs/04-casas-y-tradiciones.md; ficha T-041 §4.3).
//
// Una casa con el permiso pasa maravedis del almacen a una recua que esta en una comarca con plaza,
// sin que la recua vaya a por ellos: paga la comision de la tabla y el dinero llega **un turno
// despues**. Las letras que ya empezaron se cobran primero, asi que una letra dada este turno no
// llega hasta el siguiente. Si la recua ya no esta en una plaza, se devuelve entera.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { PROHIBIDO_POR_LA_CASA, permisosDe } from '../reglas/casas/index.ts';
import { hayPlazaEn } from '../reglas/plazas.ts';
import {
  cancelarOrden,
  dejarEnEspera,
  empezarOrden,
  ordenesEnCurso,
  ordenesVivas,
} from '../ordenes.ts';
import type { OrdenDe } from '../ordenes.ts';
import { registrarSuceso } from '../sucesos.ts';
import { porcentaje } from '../utiles/enteros.ts';

export function letrasDeCambio(ctx: Contexto): void {
  for (const orden of ordenesEnCurso(ctx, 'letra-de-cambio')) cobrar(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'letra-de-cambio')) emitir(ctx, orden);
}

/** La recua de la orden, si es del jugador y esta quieta en una comarca con plaza. */
function recuaEnPlaza(ctx: Contexto, orden: OrdenDe<'letra-de-cambio'>) {
  const recua = ctx.estado.recuas[orden.recua];
  if (recua?.jugador !== orden.jugador) return { recua: null, enPlaza: false };
  const enPlaza =
    recua.situacion.donde === 'comarca' &&
    hayPlazaEn(ctx.estado, ctx.mundo, recua.situacion.comarca);
  return { recua, enPlaza };
}

function emitir(ctx: Contexto, orden: OrdenDe<'letra-de-cambio'>): void {
  if (!permisosDe(ctx.estado, orden.jugador, ctx.reglas).letraDeCambio) {
    cancelarOrden(ctx, orden, PROHIBIDO_POR_LA_CASA);
    return;
  }
  // La orden reserva justo lo que se cambia: si no, lo que llegaria no cuadra con lo que se pago.
  if (orden.coste.maravedis !== orden.cantidad) {
    cancelarOrden(ctx, orden, 'coste-incoherente');
    return;
  }
  const { recua, enPlaza } = recuaEnPlaza(ctx, orden);
  if (recua === null) {
    cancelarOrden(ctx, orden, 'recua-desconocida');
    return;
  }
  if (!enPlaza) {
    dejarEnEspera(ctx, orden, 'recua-sin-plaza');
    return;
  }
  empezarOrden(ctx, orden, 'en curso');
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'letra.emitida',
    { recua: recua.id, cantidad: orden.cantidad },
    { jugador: orden.jugador },
  );
}

function cobrar(ctx: Contexto, orden: OrdenDe<'letra-de-cambio'>): void {
  const { recua, enPlaza } = recuaEnPlaza(ctx, orden);
  if (recua === null || !enPlaza) {
    aplicar(ctx, {
      tipo: 'recurso',
      jugador: orden.jugador,
      recurso: 'maravedis',
      delta: orden.cantidad,
      motivo: `devolucion de la letra ${orden.id}`,
    });
    aplicar(ctx, {
      tipo: 'orden-estado',
      orden: orden.id,
      estado: 'cancelada',
      motivo: recua === null ? 'recua-desconocida' : 'recua-sin-plaza',
    });
    return;
  }
  const comision = porcentaje(orden.cantidad, ctx.reglas.mercado.comisionLetraMil);
  aplicar(ctx, {
    tipo: 'recua-carga',
    recua: recua.id,
    recurso: 'maravedis',
    delta: orden.cantidad - comision,
    motivo: 'letra de cambio',
  });
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'letra.cobrada',
    { recua: recua.id, cantidad: orden.cantidad, comision },
    {
      jugador: orden.jugador,
      comarca: recua.situacion.donde === 'comarca' ? recua.situacion.comarca : null,
    },
  );
  aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado: 'terminada', motivo: null });
}
