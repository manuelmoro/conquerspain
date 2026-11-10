// El asalto en los caminos (T-122), al entrar una recua en un tramo: el azar de la partida decide con
// el riesgo del tramo, y si hay asalto se lleva una parte de la carga. La recua sigue entera.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { botinDe, riesgoEnElEstado } from '../reglas/bandidaje.ts';
import type { Avance } from '../reglas/movimiento.ts';
import { tramosEmpezados } from '../reglas/portazgos.ts';
import type { Mejoras } from '../reglas/ruta.ts';
import { claveDeTramo, tramoEntre } from '../reglas/ruta.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { SituacionMovil } from '../tipos/estado.ts';
import type { IdRecua } from '../tipos/ids.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import { azarDe } from '../utiles/azar.ts';

export function asaltos(
  ctx: Contexto,
  idRecua: IdRecua,
  situacion: SituacionMovil,
  avance: Avance,
  mejoras: Mejoras,
): void {
  for (const [desde, hasta] of tramosEmpezados(situacion, avance)) {
    const recua = ctx.estado.recuas[idRecua];
    const camino = tramoEntre(ctx.mundo, desde, hasta);
    if (recua === undefined || camino === undefined) return;
    const riesgo = riesgoEnElEstado(ctx.estado, camino, recua.jugador, mejoras, ctx.reglas);
    if (riesgo <= 0) continue;
    const tirada = azarDe(
      ctx.semilla,
      ctx.turno,
      'bandidaje',
      `${recua.id}|${claveDeTramo(desde, hasta)}`,
    ).entero(1000);
    if (tirada >= riesgo) continue;
    const botin = botinDe(recua.carga, ctx.reglas);
    const total = RECURSOS.reduce((t, r) => t + botin[r], 0);
    for (const recurso of RECURSOS) {
      if (botin[recurso] > 0) {
        aplicar(ctx, {
          tipo: 'recua-carga',
          recua: recua.id,
          recurso,
          delta: -botin[recurso],
          motivo: 'asalto en el camino',
        });
      }
    }
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'bandidaje.asalto',
      { recua: recua.id, desde, hasta, perdido: total },
      { jugador: recua.jugador, comarca: hasta },
    );
  }
}
