// La ausencia (ficha T-105 §2), al empezar la fase 0: quien da alguna orden esta presente; quien no,
// suma un turno. En los escalones se avisa; ausente, la lealtad baja despacio y con suelo; y quien
// vuelve recupera el mando entero, sin la influencia que otros ganaron en sus comarcas.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { situacionDeAusencia } from '../reglas/ausencia.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoJugador } from '../tipos/estado.ts';
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import { idsEnOrden } from '../utiles/orden.ts';

export function contarAusencia(ctx: Contexto): void {
  const conOrdenes = new Set<string>(ctx.ordenes.map((o) => o.jugador));
  for (const id of idsEnOrden(ctx.estado.jugadores)) {
    const jugador = ctx.estado.jugadores[id];
    if (jugador === undefined) continue;
    if (conOrdenes.has(id)) vuelve(ctx, jugador);
    else falta(ctx, jugador);
  }
}

function vuelve(ctx: Contexto, jugador: EstadoJugador): void {
  if (jugador.turnosSinOrdenes === 0) return;
  const antes = situacionDeAusencia(jugador, ctx.reglas);
  // La influencia que otros ganaron mientras el concejo administraba no sobrevive a su vuelta. Se
  // borra antes de volver: despues la comarca ya no admite cambios de influencia.
  if (antes === 'concejo') borrarCortejo(ctx, jugador);
  aplicar(ctx, { tipo: 'ausencia', jugador: jugador.id, turnosSinOrdenes: 0 });
  if (antes === 'presente') return;
  registrarSuceso(ctx.sucesos, ctx.fase, 'ausencia.vuelve', {
    de: jugador.id,
    turnos: jugador.turnosSinOrdenes,
  });
}

function borrarCortejo(ctx: Contexto, jugador: EstadoJugador): void {
  for (const idComarca of idsEnOrden(ctx.estado.comarcas)) {
    const comarca = ctx.estado.comarcas[idComarca];
    if (comarca?.duenyo !== jugador.id) continue;
    for (const otro of idsEnOrden(comarca.influencias)) {
      const influencia = comarca.influencias[otro] ?? 0;
      if (influencia > 0) {
        aplicar(ctx, {
          tipo: 'influencia',
          comarca: comarca.id,
          jugador: otro as IdJugador,
          delta: -influencia,
          motivo: 'vuelve su señor',
        });
      }
    }
    for (const otro of idsEnOrden(comarca.presenciaSeguida)) {
      if ((comarca.presenciaSeguida[otro] ?? 0) > 0) {
        aplicar(ctx, {
          tipo: 'presencia-seguida',
          comarca: comarca.id,
          jugador: otro as IdJugador,
          turnos: 0,
        });
      }
    }
  }
}

function falta(ctx: Contexto, jugador: EstadoJugador): void {
  const t = ctx.reglas.ausencia;
  const turnos = jugador.turnosSinOrdenes + 1;
  aplicar(ctx, { tipo: 'ausencia', jugador: jugador.id, turnosSinOrdenes: turnos });
  if (turnos === t.turnosParaAvisar) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'ausencia.aviso',
      { turnos, ausente: t.turnosParaAusente - turnos },
      { jugador: jugador.id },
    );
  }
  if (turnos === t.turnosParaAusente) {
    registrarSuceso(ctx.sucesos, ctx.fase, 'ausencia.ausente', {
      de: jugador.id,
      concejo: t.turnosParaConcejo - turnos,
    });
  }
  if (turnos === t.turnosParaConcejo) {
    registrarSuceso(ctx.sucesos, ctx.fase, 'ausencia.concejo', { de: jugador.id });
  }
  if (turnos < t.turnosParaAusente || t.lealtadPorTurnoAusente <= 0) return;
  for (const idComarca of idsEnOrden(ctx.estado.comarcas)) {
    const comarca = ctx.estado.comarcas[idComarca];
    if (comarca?.duenyo !== jugador.id || comarca.lealtad <= t.lealtadMinimaAusente) continue;
    aplicar(ctx, {
      tipo: 'lealtad',
      comarca: idComarca as IdComarca,
      delta: -Math.min(t.lealtadPorTurnoAusente, comarca.lealtad - t.lealtadMinimaAusente),
      motivo: 'el señor no está',
    });
  }
}
