// Cargar y descargar una recua contra el almacen de su jugador (docs/03-economia.md §3.7.3).
//
// Lo usan la orden `carga` (fase 4) y las paradas de una ruta (fase 5). La carga de un jugador
// solo sale de su almacen y solo entra en el: los intercambios entre jugadores son contratos.
import { aplicar } from './cambios.ts';
import type { Contexto } from './contexto.ts';
import { pesoDeLaCarga } from './reglas/movimiento.ts';
import { registrarSuceso } from './sucesos.ts';
import type { IdComarca, IdRecua } from './tipos/ids.ts';
import type { Recurso } from './tipos/recursos.ts';
import { RECURSOS } from './tipos/recursos.ts';

export type Pedido = Readonly<Partial<Record<Recurso, number>>>;

/** Descarga en el almacen lo pedido, hasta lo que lleve la recua. */
export function descargarEnAlmacen(ctx: Contexto, idRecua: IdRecua, pedido: Pedido): void {
  for (const recurso of RECURSOS) {
    const recua = ctx.estado.recuas[idRecua];
    if (recua === undefined) return;
    const cantidad = Math.min(pedido[recurso] ?? 0, recua.carga[recurso]);
    if (cantidad <= 0) continue;
    aplicar(ctx, {
      tipo: 'recua-carga',
      recua: idRecua,
      recurso,
      delta: -cantidad,
      motivo: 'descarga en el almacen',
    });
    aplicar(ctx, {
      tipo: 'recurso',
      jugador: recua.jugador,
      recurso,
      delta: cantidad,
      motivo: `descarga de ${idRecua}`,
    });
  }
}

/** Todo lo que lleva la recua, para descargarlo entero. */
export function todaLaCarga(ctx: Contexto, idRecua: IdRecua): Pedido {
  const recua = ctx.estado.recuas[idRecua];
  return recua === undefined ? {} : { ...recua.carga };
}

/**
 * Carga del almacen lo pedido, hasta lo disponible (lo reservado no se toca) y hasta el porte; lo
 * que no cabe se dice en la cronica. Los maravedis no ocupan porte.
 */
export function cargarDelAlmacen(
  ctx: Contexto,
  idRecua: IdRecua,
  pedido: Pedido,
  comarca: IdComarca,
): void {
  for (const recurso of RECURSOS) {
    const quiere = pedido[recurso] ?? 0;
    const recua = ctx.estado.recuas[idRecua];
    const jugador = recua === undefined ? undefined : ctx.estado.jugadores[recua.jugador];
    if (quiere <= 0 || recua === undefined || jugador === undefined) continue;
    const libre =
      recurso === 'maravedis' ? quiere : Math.max(0, recua.porte - pesoDeLaCarga(recua.carga));
    const hay = jugador.almacen[recurso] - jugador.reservado[recurso];
    const cantidad = Math.max(0, Math.min(quiere, hay, libre));
    if (cantidad < quiere) {
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.carga-recortada',
        { recua: idRecua, recurso, pedido: quiere, cargado: cantidad },
        { jugador: recua.jugador, comarca },
      );
    }
    if (cantidad === 0) continue;
    aplicar(ctx, {
      tipo: 'recurso',
      jugador: recua.jugador,
      recurso,
      delta: -cantidad,
      motivo: `carga de ${idRecua}`,
    });
    aplicar(ctx, {
      tipo: 'recua-carga',
      recua: idRecua,
      recurso,
      delta: cantidad,
      motivo: 'carga del almacen',
    });
  }
}
