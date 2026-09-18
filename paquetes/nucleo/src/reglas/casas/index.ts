// Lo que una casa cambia, visto desde las fases (docs/04-casas-y-tradiciones.md; ficha T-041).
//
// Las fases no saben de casas: piden aqui los modificadores, los permisos o las prohibiciones de un
// jugador y reciben los neutros si no lo hay. Ninguna regla de esta carpeta ni de las fases nombra a
// una casa concreta: todas salen de la tabla (`datos/casas.ts`).
import { MODIFICADORES_NEUTROS, SIN_PERMISOS, SIN_PROHIBICIONES } from '../../datos/casas.ts';
import type { EstadoPartida } from '../../tipos/estado.ts';
import type { IdJugador } from '../../tipos/ids.ts';
import type { Modificadores, Permisos, Prohibiciones, TablasDeReglas } from '../../tipos/reglas.ts';

/** Los modificadores de la casa de un jugador; los neutros si no hay jugador. */
export function modificadoresDe(
  estado: EstadoPartida,
  jugador: IdJugador | null,
  reglas: TablasDeReglas,
): Modificadores {
  const casa = jugador === null ? undefined : estado.jugadores[jugador]?.casa;
  return casa === undefined ? MODIFICADORES_NEUTROS : reglas.casas[casa].modificadores;
}

export function permisosDe(
  estado: EstadoPartida,
  jugador: IdJugador | null,
  reglas: TablasDeReglas,
): Permisos {
  const casa = jugador === null ? undefined : estado.jugadores[jugador]?.casa;
  return casa === undefined ? SIN_PERMISOS : reglas.casas[casa].permisos;
}

export function prohibicionesDe(
  estado: EstadoPartida,
  jugador: IdJugador | null,
  reglas: TablasDeReglas,
): Prohibiciones {
  const casa = jugador === null ? undefined : estado.jugadores[jugador]?.casa;
  return casa === undefined ? SIN_PROHIBICIONES : reglas.casas[casa].prohibiciones;
}

/** Motivo con el que se cancela una orden que la casa del jugador tiene prohibida. */
export const PROHIBIDO_POR_LA_CASA = 'prohibido-por-la-casa';
