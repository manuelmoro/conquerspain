// Los asedios (T-121, docs/06 §6.6), al final de la fase de las mesnadas: las ordenes de asediar, de
// ofrecer rescate y de aceptarlo, en orden de identificador; y despues cada asedio en marcha, que se
// levanta si el sitiador ya no esta, espera sus seis turnos y, desde entonces, rinde la comarca si la
// fuerza del sitiador supera su defensa. Nada se destruye: la comarca cambia de manos entera.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { cancelarOrden, empezarOrden, ordenesVivas } from '../ordenes.ts';
import type { OrdenDe } from '../ordenes.ts';
import { estaAmparado } from '../reglas/ausencia.ts';
import { defensaDe, fuerzaDe, sonHostiles } from '../reglas/milicia.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { Asedio } from '../tipos/estado.ts';
import { nuevoId } from '../tipos/ids.ts';
import { idsEnOrden } from '../utiles/orden.ts';

export function asedios(ctx: Contexto): void {
  for (const orden of ordenesVivas(ctx, 'asediar')) asediar(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'tregua')) ofrecer(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'aceptar-tregua')) aceptar(ctx, orden);
  for (const id of idsEnOrden(ctx.estado.asedios ?? {})) seguir(ctx, id);
}

function asediar(ctx: Contexto, orden: OrdenDe<'asediar'>): void {
  const mesnada = ctx.estado.mesnadas?.[orden.mesnada];
  if (mesnada?.jugador !== orden.jugador || mesnada.situacion.donde !== 'comarca') {
    cancelarOrden(ctx, orden, 'mesnada-desconocida');
    return;
  }
  const comarca = ctx.estado.comarcas[mesnada.situacion.comarca];
  const duenyo =
    comarca?.duenyo === undefined || comarca.duenyo === null
      ? null
      : ctx.estado.jugadores[comarca.duenyo];
  if (comarca === undefined || duenyo === null || duenyo === undefined) {
    cancelarOrden(ctx, orden, 'sin-nada-que-asediar');
    return;
  }
  if (duenyo.capital === comarca.id) {
    cancelarOrden(ctx, orden, 'capital-intocable');
    return;
  }
  if (
    !sonHostiles(ctx.estado, orden.jugador, duenyo.id, ctx.turno) ||
    estaAmparado(duenyo, ctx.turno)
  ) {
    cancelarOrden(ctx, orden, 'tierra-vedada');
    return;
  }
  if (Object.values(ctx.estado.asedios ?? {}).some((a) => a.comarca === comarca.id)) {
    cancelarOrden(ctx, orden, 'ya-asediada');
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  const id = nuevoId('asedio', ctx.estado.siguienteId);
  aplicar(ctx, { tipo: 'siguiente-id' });
  aplicar(ctx, {
    tipo: 'asedio',
    asedio: {
      id,
      comarca: comarca.id,
      sitiador: orden.jugador,
      mesnada: mesnada.id,
      desde: ctx.turno,
      rescate: null,
    },
  });
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'asedio.empieza',
    { de: orden.jugador, contra: duenyo.id, turnos: ctx.reglas.milicia.turnosMinimosAsedio },
    { comarca: comarca.id },
  );
}

function ofrecer(ctx: Contexto, orden: OrdenDe<'tregua'>): void {
  const asedio = ctx.estado.asedios?.[orden.asedio];
  if (asedio === undefined || ctx.estado.comarcas[asedio.comarca]?.duenyo !== orden.jugador) {
    cancelarOrden(ctx, orden, 'asedio-desconocido');
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  aplicar(ctx, { tipo: 'asedio', asedio: { ...asedio, rescate: orden.rescate } });
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'asedio.rescate',
    { de: orden.jugador, rescate: orden.rescate },
    { jugador: asedio.sitiador, comarca: asedio.comarca },
  );
}

function aceptar(ctx: Contexto, orden: OrdenDe<'aceptar-tregua'>): void {
  const asedio = ctx.estado.asedios?.[orden.asedio];
  const defensor = asedio === undefined ? null : ctx.estado.comarcas[asedio.comarca]?.duenyo;
  if (
    asedio?.sitiador !== orden.jugador ||
    asedio.rescate === null ||
    defensor === null ||
    defensor === undefined
  ) {
    cancelarOrden(ctx, orden, 'asedio-desconocido');
    return;
  }
  const paga = ctx.estado.jugadores[defensor];
  const libre = paga === undefined ? 0 : paga.almacen.maravedis - paga.reservado.maravedis;
  if (libre < asedio.rescate) {
    cancelarOrden(ctx, orden, 'rescate-sin-fondos');
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  if (asedio.rescate > 0) {
    const motivo = `rescate de ${asedio.comarca}`;
    aplicar(ctx, {
      tipo: 'recurso',
      jugador: defensor,
      recurso: 'maravedis',
      delta: -asedio.rescate,
      motivo,
    });
    aplicar(ctx, {
      tipo: 'recurso',
      jugador: orden.jugador,
      recurso: 'maravedis',
      delta: asedio.rescate,
      motivo,
    });
  }
  volverACasa(ctx, asedio);
  aplicar(ctx, { tipo: 'asedio-baja', asedio: asedio.id });
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'asedio.tregua',
    { de: orden.jugador, contra: defensor, rescate: asedio.rescate },
    { comarca: asedio.comarca },
  );
}

/** La mesnada sitiadora se vuelve a su origen (o a la capital si ya no es suyo). */
function volverACasa(ctx: Contexto, asedio: Asedio): void {
  const mesnada = ctx.estado.mesnadas?.[asedio.mesnada];
  if (mesnada === undefined) return;
  const casa =
    ctx.estado.comarcas[mesnada.origen]?.duenyo === mesnada.jugador
      ? mesnada.origen
      : (ctx.estado.jugadores[mesnada.jugador]?.capital ?? mesnada.origen);
  aplicar(ctx, {
    tipo: 'mesnada',
    mesnada: { ...mesnada, situacion: { donde: 'comarca', comarca: casa }, turnosFuera: 0 },
  });
}

function seguir(ctx: Contexto, id: string): void {
  const asedio = ctx.estado.asedios?.[id];
  if (asedio === undefined) return;
  const comarca = ctx.estado.comarcas[asedio.comarca];
  const mesnada = ctx.estado.mesnadas?.[asedio.mesnada];
  const defensor = comarca?.duenyo ?? null;
  const sigue =
    mesnada !== undefined &&
    defensor !== null &&
    defensor !== asedio.sitiador &&
    mesnada.situacion.donde === 'comarca' &&
    mesnada.situacion.comarca === asedio.comarca &&
    sonHostiles(ctx.estado, asedio.sitiador, defensor, ctx.turno);
  if (!sigue) {
    aplicar(ctx, { tipo: 'asedio-baja', asedio: asedio.id });
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'asedio.levantado',
      { de: asedio.sitiador },
      { comarca: asedio.comarca },
    );
    return;
  }
  const turnos = ctx.turno - asedio.desde + 1;
  if (turnos < ctx.reglas.milicia.turnosMinimosAsedio) return;
  const fuerza = fuerzaDe(mesnada, asedio.comarca, ctx.estado, ctx.reglas);
  const defensa = defensaDe(ctx.estado, asedio.comarca, ctx.reglas);
  if (fuerza <= defensa) return;
  // La comarca se rinde entera: cambia de manos con poca lealtad; la mesnada se queda de guarnicion.
  aplicar(ctx, { tipo: 'asedio-baja', asedio: asedio.id });
  aplicar(ctx, { tipo: 'duenyo', comarca: asedio.comarca, jugador: asedio.sitiador });
  const lealtad = ctx.estado.comarcas[asedio.comarca]?.lealtad ?? 0;
  const objetivo = ctx.reglas.milicia.lealtadTrasRendicion;
  if (lealtad !== objetivo) {
    aplicar(ctx, {
      tipo: 'lealtad',
      comarca: asedio.comarca,
      delta: objetivo - lealtad,
      motivo: 'rendida tras un asedio',
    });
  }
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'asedio.rendicion',
    { de: asedio.sitiador, contra: defensor, turnos },
    { comarca: asedio.comarca },
  );
}
