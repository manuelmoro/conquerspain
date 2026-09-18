// Fase 09 · Poblacion (T-036, docs/03-economia.md §3.6).
//
// Cada comarca propia crece si se cumplen los cuatro requisitos; si no, se dice por que (el primero
// que falla), para que nadie vea un «no crece» sin explicacion. El balance de pan se mide con la
// gente nueva de las comarcas ya atendidas del mismo jugador, en orden de identificador. La
// emigracion por hambre ya la hizo la fase de consumo.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { comarcasDe, panDeLaPoblacion, panDeLasCuadrillas } from '../reglas/consumo.ts';
import { permiteCrecer } from '../reglas/escasez.ts';
import { factorCrecimientoPorObrasMil } from '../reglas/obras.ts';
import type { MotivoSinCrecer } from '../reglas/poblacion.ts';
import { crecimientoPosible } from '../reglas/poblacion.ts';
import { capacidadDe } from '../reglas/poblar.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoJugador } from '../tipos/estado.ts';
import { idsEnOrden } from '../utiles/orden.ts';

export function fasePoblacion(ctx: Contexto): void {
  for (const id of idsEnOrden(ctx.estado.jugadores)) {
    const jugador = ctx.estado.jugadores[id];
    if (jugador !== undefined) crecer(ctx, jugador);
  }
}

function crecer(ctx: Contexto, jugador: EstadoJugador): void {
  const comarcas = comarcasDe(ctx.estado, jugador.id);
  const producido = comarcas.reduce((total, c) => total + c.produccionUltimoTurno.pan, 0);
  const cuadrillas = panDeLasCuadrillas(ctx.estado, jugador.id, ctx.reglas);
  const reserva = jugador.almacen.pan - jugador.reservado.pan;
  const casaMil = ctx.reglas.casas[jugador.casa].modificadores.crecimientoMil;

  for (const comarca of comarcas) {
    const crecimiento = crecimientoPosible(
      comarca,
      [
        ctx.reglas.poblacion.fueros[comarca.fuero].crecimientoMil,
        factorCrecimientoPorObrasMil(comarca.id, ctx.estado, ctx.mundo, ctx.reglas),
        casaMil,
      ],
      ctx.reglas,
    );
    let motivo: MotivoSinCrecer | null = null;
    if (!permiteCrecer(jugador)) motivo = 'escasez';
    else if (comarca.poblacion >= capacidadDe(comarca, ctx.reglas)) motivo = 'sin-capacidad';
    else if (reserva < ctx.estado.configuracion.reservaMinimaDePan) motivo = 'reserva-baja';
    else {
      // Las comarcas son objetos vivos del estado: las ya atendidas cuentan con su gente nueva.
      const conLaNueva = panDeLaPoblacion(
        comarcas.map((c) =>
          c.id === comarca.id ? { ...c, poblacion: c.poblacion + crecimiento } : c,
        ),
        ctx.reglas,
      );
      if (producido - conLaNueva - cuadrillas < 0) motivo = 'balance-negativo';
    }

    if (motivo !== null || crecimiento === 0) {
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'poblacion.no-crece',
        { motivo: motivo ?? 'sin-capacidad' },
        { jugador: jugador.id, comarca: comarca.id },
      );
      continue;
    }
    aplicar(ctx, {
      tipo: 'poblacion',
      comarca: comarca.id,
      delta: crecimiento,
      motivo: 'crecimiento',
    });
  }
}
