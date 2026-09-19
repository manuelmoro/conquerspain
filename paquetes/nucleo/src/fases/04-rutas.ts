// Rutas permanentes (docs/02-diseno-nucleo.md §2.5.2; ficha T-045 §4.2).
//
// Una ruta circular se repite sola hasta que algo la para: que falte bastimento (fase 4) o que un
// precio limite no se cumpla varias paradas seguidas (fase 7). Las dos la paran igual.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { Recua } from '../tipos/estado.ts';

/**
 * Una ruta permanente se detiene sola (ficha T-045 §4.2): la recua deja el circuito y, si va de
 * camino, termina el tramo que lleva. La cronica dice por que.
 */
export function detenerRuta(ctx: Contexto, recua: Recua, motivo: string): void {
  const ruta = recua.situacion.donde === 'camino' ? [recua.situacion.hasta] : [];
  aplicar(ctx, { tipo: 'recua-ruta', recua: recua.id, ruta, circular: false, paradas: [] });
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'recua.ruta-detenida',
    { recua: recua.id, motivo },
    {
      jugador: recua.jugador,
      comarca:
        recua.situacion.donde === 'comarca' ? recua.situacion.comarca : recua.situacion.desde,
    },
  );
}
