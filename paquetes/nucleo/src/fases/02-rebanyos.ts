// Fase 02 · Lo que dan los rebanyos: pan cada turno, lana en el esquileo y estiercol (T-040).
//
// El esquileo es el turno 10 del anyo (segunda quincena de mayo): cada rebanyo entrega su lana al
// almacen del dueño segun lo pastado desde el esquileo anterior y vuelve a empezar. Ese mismo turno
// se cuenta el anyo de estiercol de cada comarca.
import { modificadoresDelJugador } from '../reglas/casas/index.ts';
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { factorDeAcontecimientos } from '../reglas/acontecimientos.ts';
import {
  calidadDelAnyoMil,
  estiercolTrasElAnyo,
  lanaDelEsquileo,
  panDelRebanyo,
} from '../reglas/esquileo.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { Rebanyo } from '../tipos/estado.ts';
import { rebanyosEnOrden } from '../reglas/rebanyos.ts';
import { idsEnOrden } from '../utiles/orden.ts';

export function produccionDeRebanyos(ctx: Contexto): void {
  const rebanyos = rebanyosEnOrden(ctx.estado.rebanyos);
  for (const rebanyo of rebanyos) {
    const pan = panDelRebanyo(rebanyo, ctx.reglas);
    if (pan > 0) {
      aplicar(ctx, {
        tipo: 'recurso',
        jugador: rebanyo.jugador,
        recurso: 'pan',
        delta: pan,
        motivo: `queso y corderos de ${rebanyo.id}`,
      });
    }
  }
  if (!ctx.calendario.esEsquileo) return;
  for (const rebanyo of rebanyos) esquilar(ctx, rebanyo);
  contarElAnyoDeEstiercol(ctx);
}

function esquilar(ctx: Contexto, rebanyo: Rebanyo): void {
  const jugador = ctx.estado.jugadores[rebanyo.jugador];
  if (jugador === undefined) return;
  const donde =
    rebanyo.situacion.donde === 'comarca' ? rebanyo.situacion.comarca : rebanyo.situacion.desde;
  // La peste de ganado de la region donde esta el rebanyo ese dia.
  const acontecimientosMil = factorDeAcontecimientos(
    ctx.estado.acontecimientos,
    ctx.turno,
    'lana',
    { region: ctx.mundo.comarcas[donde]?.region ?? '', comarca: donde },
    'lana',
  );
  const lana = lanaDelEsquileo(
    rebanyo,
    modificadoresDelJugador(jugador, ctx.reglas).lanaEsquileoMil,
    acontecimientosMil,
    ctx.reglas,
  );
  if (lana > 0) {
    aplicar(ctx, {
      tipo: 'recurso',
      jugador: rebanyo.jugador,
      recurso: 'lana',
      delta: lana,
      motivo: `esquileo de ${rebanyo.id}`,
    });
  }
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'rebanyo.esquileo',
    {
      rebanyo: rebanyo.id,
      lana,
      cabezas: rebanyo.cabezas,
      calidadMil: calidadDelAnyoMil(rebanyo.pastoDelAnyoMil),
      acontecimientosMil,
    },
    { jugador: rebanyo.jugador, comarca: donde },
  );
  aplicar(ctx, {
    tipo: 'rebanyo-cuentas',
    rebanyo: rebanyo.id,
    pastoDelAnyoMil: 0,
    turnosSinPasto: rebanyo.turnosSinPasto,
  });
}

/** Un nivel mas de estiercol a las comarcas donde invernaron rebanyos propios y uno menos al resto. */
function contarElAnyoDeEstiercol(ctx: Contexto): void {
  for (const id of idsEnOrden(ctx.estado.comarcas)) {
    const comarca = ctx.estado.comarcas[id];
    if (comarca === undefined || (comarca.estiercol === 0 && comarca.turnosDeAbono === 0)) continue;
    const antes = comarca.estiercol;
    const niveles = estiercolTrasElAnyo(antes, comarca.turnosDeAbono, ctx.reglas);
    aplicar(ctx, { tipo: 'abono', comarca: comarca.id, turnosDeAbono: 0, estiercol: niveles });
    if (niveles !== antes) {
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'comarca.estiercol',
        { antes, despues: niveles },
        { comarca: comarca.id, jugador: comarca.duenyo },
      );
    }
  }
}
