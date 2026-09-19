// La clasificacion (ficha T-043 §4.5): por prestigio y, si empatan, por vecinos, por comarcas y por
// `hash(partida, turno, clasificacion, jugador)`. Es estable: no depende del orden de los jugadores.
import type { EstadoPartida, PuestoEnLaClasificacion } from '../tipos/estado.ts';
import type { IdJugador } from '../tipos/ids.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { hash32 } from '../utiles/huella.ts';
import { comparar } from '../utiles/orden.ts';
import type { Prestigio } from './prestigio.ts';
import { prestigioDe } from './prestigio.ts';

interface Candidato {
  readonly jugador: IdJugador;
  readonly prestigio: number;
  readonly vecinos: number;
  readonly comarcas: number;
  readonly desempate: number;
}

/** Los puestos del estado tal como esta, con el puesto que cada uno tenia en la anterior. */
export function clasificar(
  estado: EstadoPartida,
  reglas: TablasDeReglas,
): PuestoEnLaClasificacion[] {
  const anterior = new Map(estado.clasificacion.map((p) => [p.jugador, p.puesto]));
  const candidatos: Candidato[] = Object.values(estado.jugadores)
    .sort((a, b) => comparar(a.id, b.id))
    .map((jugador) => {
      const propias = Object.values(estado.comarcas).filter((c) => c.duenyo === jugador.id);
      return {
        jugador: jugador.id,
        prestigio: prestigioDe(estado, jugador, reglas).total,
        vecinos: propias.reduce((total, c) => total + c.poblacion, 0),
        comarcas: propias.length,
        desempate: hash32(`${estado.semilla}|${String(estado.turno)}|clasificacion|${jugador.id}`),
      };
    });
  candidatos.sort(
    (a, b) =>
      b.prestigio - a.prestigio ||
      b.vecinos - a.vecinos ||
      b.comarcas - a.comarcas ||
      a.desempate - b.desempate,
  );
  return candidatos.map((c, i) => ({
    jugador: c.jugador,
    puesto: i + 1,
    puestoAnterior: anterior.get(c.jugador) ?? null,
    prestigio: c.prestigio,
  }));
}

export interface LineaDeClasificacion {
  readonly jugador: IdJugador;
  readonly puesto: number;
  readonly prestigio: Prestigio;
  /** Puestos ganados desde el turno anterior (negativo si baja; 0 si es su primera clasificacion). */
  readonly variacion: number;
}

/** La clasificacion guardada del ultimo turno, con el desglose de cada jugador para ensenyarla. */
export function clasificacion(
  estado: EstadoPartida,
  reglas: TablasDeReglas,
): LineaDeClasificacion[] {
  return estado.clasificacion.flatMap((puesto) => {
    const jugador = estado.jugadores[puesto.jugador];
    if (jugador === undefined) return [];
    return [
      {
        jugador: puesto.jugador,
        puesto: puesto.puesto,
        prestigio: prestigioDe(estado, jugador, reglas),
        variacion: puesto.puestoAnterior === null ? 0 : puesto.puestoAnterior - puesto.puesto,
      },
    ];
  });
}
