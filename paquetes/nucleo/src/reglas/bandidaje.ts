// El bandidaje en los caminos (docs/06 §6.6; ficha T-122). Funciones puras: el riesgo de un tramo,
// desde lo que se sabe de sus dos puntas, y lo que se lleva un asalto. La fase de movimiento lo aplica
// y el cliente lo estima con lo que el jugador conoce.
import type { EstadoPartida } from '../tipos/estado.ts';
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import type { Camino } from '../tipos/mundo.ts';
import type { Recursos } from '../tipos/recursos.ts';
import { recursosSegun } from '../tipos/recursos.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { MIL } from '../utiles/enteros.ts';
import type { Mejoras } from './ruta.ts';
import { tieneCalzada } from './ruta.ts';

/** Lo que importa de cada punta del tramo. La lealtad es null si no se conoce. */
export interface PuntaDelTramo {
  readonly conDueno: boolean;
  readonly venta: boolean;
  readonly lealtad: number | null;
}

/** El riesgo de asalto al entrar en el tramo, en milesimas, entre 0 y el maximo de la tabla. */
export function riesgoDeTramoMil(
  camino: Camino,
  puntas: readonly [PuntaDelTramo, PuntaDelTramo],
  calzada: boolean,
  escoltada: boolean,
  reglas: TablasDeReglas,
): number {
  if (escoltada) return 0;
  const t = reglas.bandidaje;
  let riesgo = t.baseMil;
  if (camino.puertoDeMontanya !== null) riesgo += t.puertoMil;
  if (camino.terreno === 'sierra') riesgo += t.terrenoAgresteMil;
  for (const punta of puntas) {
    if (!punta.conDueno) riesgo += t.sinDuenoMil;
    if (punta.venta) riesgo -= t.ventaMil;
    if (punta.conDueno && punta.lealtad !== null) {
      if (punta.lealtad < reglas.territorio.lealtadDesleal) riesgo += t.deslealMil;
      else if (punta.lealtad >= t.lealtadSegura) riesgo -= t.lealMil;
    }
  }
  if (calzada) riesgo -= t.calzadaMil;
  return Math.max(0, Math.min(t.riesgoMaximoMil, riesgo));
}

/** El riesgo de un tramo con el estado entero: lo que usa el motor. */
export function riesgoEnElEstado(
  estado: EstadoPartida,
  camino: Camino,
  jugador: IdJugador,
  mejoras: Mejoras,
  reglas: TablasDeReglas,
): number {
  const punta = (id: IdComarca): PuntaDelTramo => {
    const c = estado.comarcas[id];
    return {
      conDueno: c !== undefined && c.duenyo !== null,
      venta: (c?.edificios['venta'] ?? 0) > 0,
      lealtad: c === undefined || c.duenyo === null ? null : c.lealtad,
    };
  };
  const escoltada = Object.values(estado.mesnadas ?? {}).some(
    (m) =>
      m.jugador === jugador &&
      m.situacion.donde === 'comarca' &&
      (m.situacion.comarca === camino.desde || m.situacion.comarca === camino.hasta),
  );
  return riesgoDeTramoMil(
    camino,
    [punta(camino.desde), punta(camino.hasta)],
    tieneCalzada(camino, mejoras),
    escoltada,
    reglas,
  );
}

/** Lo que se lleva un asalto: una parte de cada cosa, redondeando hacia abajo. Nunca las acemilas. */
export function botinDe(carga: Recursos, reglas: TablasDeReglas): Recursos {
  return recursosSegun((r) => Math.floor((carga[r] * reglas.bandidaje.perdidaMil) / MIL));
}
