// El cierre de una temporada (docs/06 §6.7; ficha T-104 §2.2): la clasificacion final y el
// reconocimiento al primero de cada capitulo. Funcion pura; la fase 11 la aplica en su turno.
import type {
  CierreDeTemporada,
  EstadoPartida,
  ReconocimientoDeTemporada,
} from '../tipos/estado.ts';
import { RECONOCIMIENTOS } from '../tipos/estado.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { comparar, idsEnOrden } from '../utiles/orden.ts';
import { prestigioDe } from './prestigio.ts';

/** La temporada se cierra este turno: es de temporada, llega a su ultimo turno y no esta cerrada. */
export function tocaCerrar(estado: EstadoPartida, turno: number): boolean {
  const ultimo = estado.configuracion.turnosDeTemporada;
  return ultimo !== null && turno >= ultimo && estado.cierre === undefined;
}

/**
 * El primero de cada capitulo, si alguien tiene algo en el. Empates: mas prestigio, y despues el
 * menor identificador (regla explicita: nunca el orden de llegada).
 */
export function cierreDeTemporada(
  estado: EstadoPartida,
  turno: number,
  reglas: TablasDeReglas,
): CierreDeTemporada {
  const jugadores = idsEnOrden(estado.jugadores).flatMap((id) => {
    const j = estado.jugadores[id];
    return j === undefined
      ? []
      : [{ jugador: j, capitulos: prestigioDe(estado, j, reglas).capitulos }];
  });
  const reconocimientos = RECONOCIMIENTOS.flatMap((reconocimiento): ReconocimientoDeTemporada[] => {
    const [mejor] = [...jugadores].sort(
      (a, b) =>
        b.capitulos[reconocimiento] - a.capitulos[reconocimiento] ||
        b.jugador.prestigio - a.jugador.prestigio ||
        comparar(a.jugador.id, b.jugador.id),
    );
    if (mejor === undefined || mejor.capitulos[reconocimiento] <= 0) return [];
    return [{ reconocimiento, jugador: mejor.jugador.id, valor: mejor.capitulos[reconocimiento] }];
  });
  return { turno, clasificacion: estado.clasificacion, reconocimientos };
}
