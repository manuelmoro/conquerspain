// Fase 08 · Territorio (T-036 y T-038, docs/03-economia.md §3.6 y §3.9 y docs/06 §6.2).
//
// Por este orden: las ordenes de politica y de traslado de la corte, el avance de los traslados,
// la lealtad de cada comarca propia con todas sus fuentes y la cuenta atras de las desleales, que
// al acabar vuelven a ser neutrales. Despues, la influencia y las incorporaciones (08-influencia).
// Cada jugador solo toca lo suyo, asi que el orden entre jugadores no cambia nada.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { cancelarOrden, dejarEnEspera, empezarOrden, ordenesVivas } from '../ordenes.ts';
import type { OrdenDe } from '../ordenes.ts';
import { comarcasPorCercania } from '../reglas/administracion.ts';
import { impedimentoDeTraslado } from '../reglas/capital.ts';
import { comarcasDe } from '../reglas/consumo.ts';
import { datosConocidosDe } from '../reglas/explorar.ts';
import { esDesleal, fuentesDeLealtad } from '../reglas/lealtad.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoComarca, EstadoJugador } from '../tipos/estado.ts';
import { idsEnOrden } from '../utiles/orden.ts';
import { incorporaciones, influenciaDelTurno, regalos } from './08-influencia.ts';

export function faseTerritorio(ctx: Contexto): void {
  for (const orden of ordenesVivas(ctx, 'politica')) politica(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'trasladar-corte')) trasladar(ctx, orden);
  for (const id of idsEnOrden(ctx.estado.jugadores)) {
    const jugador = ctx.estado.jugadores[id];
    if (jugador === undefined) continue;
    avanzarTraslado(ctx, jugador);
    lealtad(ctx, jugador);
  }
  regalos(ctx);
  influenciaDelTurno(ctx);
  incorporaciones(ctx);
}

/**
 * Politica de una comarca: fuero, carga fiscal y dehesa, y la sal de las conservas del jugador. Si
 * el fuero no se puede cambiar todavia, la orden entera espera: no se aplica a medias.
 */
function politica(ctx: Contexto, orden: OrdenDe<'politica'>): void {
  const comarca = ctx.estado.comarcas[orden.comarca];
  if (comarca === undefined || comarca.duenyo !== orden.jugador) {
    cancelarOrden(ctx, orden, 'comarca-ajena');
    return;
  }
  const t = ctx.reglas.territorio;
  const cambiaFuero = orden.fuero !== null && orden.fuero !== comarca.fuero;
  const quitaFuero = cambiaFuero && comarca.fuero === 'fuero';
  const desde = ctx.turno - comarca.turnoFuero;
  if (cambiaFuero && comarca.turnoFuero > 0 && desde < t.turnosEntreCambiosDeFuero) {
    dejarEnEspera(ctx, orden, 'fuero-reciente');
    return;
  }
  if (quitaFuero && comarca.turnoFuero > 0 && desde < t.turnosFueroIrreversible) {
    dejarEnEspera(ctx, orden, 'fuero-irreversible');
    return;
  }

  empezarOrden(ctx, orden, 'terminada');
  if (cambiaFuero) {
    aplicar(ctx, { tipo: 'fuero', comarca: comarca.id, fuero: orden.fuero });
    if (quitaFuero) {
      aplicar(ctx, {
        tipo: 'lealtad',
        comarca: comarca.id,
        delta: -t.lealtadPorQuitarFuero,
        motivo: 'se le quita el fuero',
      });
    }
  }
  if (orden.cargaFiscal !== null && orden.cargaFiscal !== comarca.cargaFiscal) {
    aplicar(ctx, { tipo: 'carga-fiscal', comarca: comarca.id, carga: orden.cargaFiscal });
  }
  if (orden.dehesa !== null && orden.dehesa !== comarca.dehesa) {
    aplicar(ctx, { tipo: 'dehesa', comarca: comarca.id, dehesa: orden.dehesa });
  }
  if (orden.conservarConSal !== null) {
    aplicar(ctx, {
      tipo: 'conservar-sal',
      jugador: orden.jugador,
      conservar: orden.conservarConSal,
    });
  }
}

function trasladar(ctx: Contexto, orden: OrdenDe<'trasladar-corte'>): void {
  const jugador = ctx.estado.jugadores[orden.jugador];
  if (jugador === undefined) return;
  const impedimento = impedimentoDeTraslado(jugador, orden.comarca, ctx.estado);
  if (impedimento === 'traslado-en-marcha') {
    dejarEnEspera(ctx, orden, impedimento);
    return;
  }
  if (impedimento !== null) {
    cancelarOrden(ctx, orden, impedimento);
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  aplicar(ctx, {
    tipo: 'traslado',
    jugador: orden.jugador,
    traslado: { destino: orden.comarca, turnosRestantes: ctx.reglas.territorio.turnosTraslado },
  });
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'corte.traslado-empieza',
    { turnos: ctx.reglas.territorio.turnosTraslado },
    { jugador: orden.jugador, comarca: orden.comarca },
  );
}

/** Cada turno de traslado cuenta; si el destino se pierde por el camino, el traslado se deshace. */
function avanzarTraslado(ctx: Contexto, jugador: EstadoJugador): void {
  const traslado = jugador.traslado;
  if (traslado === null) return;
  if (ctx.estado.comarcas[traslado.destino]?.duenyo !== jugador.id) {
    aplicar(ctx, { tipo: 'traslado', jugador: jugador.id, traslado: null });
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'corte.traslado-perdido',
      {},
      { jugador: jugador.id, comarca: traslado.destino },
    );
    return;
  }
  const quedan = traslado.turnosRestantes - 1;
  if (quedan > 0) {
    aplicar(ctx, {
      tipo: 'traslado',
      jugador: jugador.id,
      traslado: { destino: traslado.destino, turnosRestantes: quedan },
    });
    return;
  }
  aplicar(ctx, { tipo: 'traslado', jugador: jugador.id, traslado: null });
  aplicar(ctx, { tipo: 'capital', jugador: jugador.id, comarca: traslado.destino });
}

function lealtad(ctx: Contexto, jugador: EstadoJugador): void {
  const comarcas = comarcasDe(ctx.estado, jugador.id);
  const cercanias = comarcasPorCercania(
    comarcas,
    jugador,
    ctx.mundo,
    ctx.reglas,
    ctx.estado.caminos,
  );
  const distancia = new Map(cercanias.map((c) => [c.comarca, c.jornadasMil]));
  for (const comarca of comarcas) {
    const fuentes = fuentesDeLealtad(
      {
        comarca,
        esCapital: comarca.id === jugador.capital,
        jornadasALaCapitalMil: distancia.get(comarca.id) ?? 0,
      },
      ctx.estado,
      ctx.mundo,
      ctx.reglas,
    );
    for (const fuente of fuentes) {
      aplicar(ctx, {
        tipo: 'lealtad',
        comarca: comarca.id,
        delta: fuente.delta,
        motivo: fuente.motivo,
      });
    }
    cuentaAtras(ctx, jugador, comarca);
  }
}

/**
 * Una comarca desleal (salvo la de la corte) cuenta los turnos; al llegar al limite vuelve a ser
 * neutral. La cronica lo avisa cada turno con los que quedan.
 */
function cuentaAtras(ctx: Contexto, jugador: EstadoJugador, comarca: EstadoComarca): void {
  const limite = ctx.reglas.poblacion.turnosDeslealParaPerderla;
  if (!esDesleal(comarca, ctx.reglas) || comarca.id === jugador.capital) {
    if (comarca.turnosDesleal > 0)
      aplicar(ctx, { tipo: 'desleal', comarca: comarca.id, turnos: 0 });
    return;
  }
  const turnos = comarca.turnosDesleal + 1;
  if (turnos < limite) {
    aplicar(ctx, { tipo: 'desleal', comarca: comarca.id, turnos });
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'lealtad.cuenta-atras',
      { turnosRestantes: limite - turnos, lealtad: comarca.lealtad },
      { jugador: jugador.id, comarca: comarca.id },
    );
    return;
  }
  volverANeutral(ctx, jugador, comarca);
}

/**
 * La comarca se va. Quien la tenia se queda con la influencia que le quede (su lealtad) y con lo
 * que sabia de ella; sus obras alli se pierden.
 */
function volverANeutral(ctx: Contexto, jugador: EstadoJugador, comarca: EstadoComarca): void {
  const geografia = ctx.mundo.comarcas[comarca.id];
  for (const id of idsEnOrden(ctx.estado.obras)) {
    const obra = ctx.estado.obras[id];
    if (obra?.comarca !== comarca.id) continue;
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'obra.perdida',
      { obra: obra.id, que: obra.que },
      { jugador: obra.jugador, comarca: comarca.id },
    );
    aplicar(ctx, { tipo: 'obra-baja', obra: obra.id });
  }
  aplicar(ctx, { tipo: 'desleal', comarca: comarca.id, turnos: 0 });
  aplicar(ctx, { tipo: 'duenyo', comarca: comarca.id, jugador: null });
  if (comarca.lealtad > 0) {
    aplicar(ctx, {
      tipo: 'influencia',
      comarca: comarca.id,
      jugador: jugador.id,
      delta: comarca.lealtad,
      motivo: 'la cuido mientras fue suya',
    });
  }
  if (geografia !== undefined) {
    aplicar(ctx, {
      tipo: 'conocimiento',
      jugador: jugador.id,
      comarca: comarca.id,
      conocimiento: {
        nivel: 'explorada',
        turnoUltimaNoticia: ctx.turno,
        datos: datosConocidosDe(comarca, geografia),
      },
    });
  }
}
