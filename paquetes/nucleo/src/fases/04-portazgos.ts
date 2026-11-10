// Cobro de portazgos al moverse (ficha T-103 §5), comun a recuas y rebanyos.
//
// Antes de andar, quien viaja mira que peajes le llegan (`mejorasDelViaje`); despues de andar paga
// los tramos en los que entro con su mejora y avisa de los que hizo por el camino viejo.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import type { Avance } from '../reglas/movimiento.ts';
import { peajeDe, tramosEmpezados } from '../reglas/portazgos.ts';
import type { Mejoras } from '../reglas/ruta.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoJugador, SituacionMovil } from '../tipos/estado.ts';
import type { IdRebanyo, IdRecua } from '../tipos/ids.ts';

/** Quien viaja: una recua (paga con lo que lleva y despues del almacen) o un rebanyo (del almacen). */
export type Viajero =
  { readonly recua: IdRecua; readonly lleva: number } | { readonly rebanyo: IdRebanyo };

/** Lo que el jugador tiene libre en el almacen, sin lo reservado. */
export function maravedisLibres(jugador: EstadoJugador): number {
  return Math.max(0, jugador.almacen.maravedis - jugador.reservado.maravedis);
}

export function cobrarPortazgos(
  ctx: Contexto,
  viajero: Viajero,
  jugador: EstadoJugador,
  situacion: SituacionMovil,
  avance: Avance,
  mejoras: Mejoras,
): void {
  // La plantilla elige por `por`; el otro identificador va vacio y no se lee.
  const por = 'recua' in viajero ? 'recua' : 'rebanyo';
  const recua = 'recua' in viajero ? viajero.recua : '';
  const rebanyo = 'rebanyo' in viajero ? viajero.rebanyo : '';
  let enLaCarga = 'recua' in viajero ? viajero.lleva : 0;
  for (const [desde, hasta] of tramosEmpezados(situacion, avance)) {
    const peaje = peajeDe(ctx.estado, desde, hasta, jugador, ctx.reglas);
    if (peaje === null) continue;
    if (mejoras[peaje.clave] === undefined) {
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'portazgo.camino-viejo',
        { por, recua, rebanyo, desde, hasta, cantidad: peaje.cantidad, de: peaje.duenyo },
        { jugador: jugador.id, comarca: hasta },
      );
      continue;
    }
    const deLaCarga = Math.min(enLaCarga, peaje.cantidad);
    const almacen = ctx.estado.jugadores[jugador.id] ?? jugador;
    const delAlmacen = Math.min(peaje.cantidad - deLaCarga, maravedisLibres(almacen));
    if ('recua' in viajero && deLaCarga > 0) {
      enLaCarga -= deLaCarga;
      aplicar(ctx, {
        tipo: 'recua-carga',
        recua: viajero.recua,
        recurso: 'maravedis',
        delta: -deLaCarga,
        motivo: `portazgo de ${peaje.clave}`,
      });
    }
    if (delAlmacen > 0) {
      aplicar(ctx, {
        tipo: 'recurso',
        jugador: jugador.id,
        recurso: 'maravedis',
        delta: -delAlmacen,
        motivo: `portazgo de ${peaje.clave}`,
      });
    }
    const pagado = deLaCarga + delAlmacen;
    if (pagado <= 0) continue;
    aplicar(ctx, {
      tipo: 'recurso',
      jugador: peaje.duenyo,
      recurso: 'maravedis',
      delta: pagado,
      motivo: `portazgo de ${peaje.clave}`,
    });
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'portazgo.pagado',
      { por, recua, rebanyo, desde, hasta, cantidad: pagado, de: peaje.duenyo },
      { jugador: jugador.id, comarca: hasta },
    );
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'portazgo.cobrado',
      { desde, hasta, cantidad: pagado, de: jugador.id },
      { jugador: peaje.duenyo, comarca: hasta },
    );
  }
}
