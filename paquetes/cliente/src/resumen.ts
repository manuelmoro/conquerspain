// El resumen de lo que ha pasado al resolver (ficha T-088 §2.3): como ha cambiado cada recurso entre
// la vista de antes y la de despues, y las cronicas de los turnos resueltos entre medias.
import { RECURSOS } from '@conquer/nucleo';
import type { Cronica, Recurso, VistaJugador } from '@conquer/nucleo';

export interface CambioDeRecurso {
  readonly recurso: Recurso;
  readonly antes: number;
  readonly despues: number;
  readonly cambio: number;
  /** Lo que produjeron tus comarcas en el ultimo turno resuelto. */
  readonly producido: number;
  /** Todo lo demas, con su signo: comida, insumos, obras, derribos, comercio… (cambio − producido). */
  readonly otros: number;
}

export interface ResumenDeTurno {
  readonly desde: number;
  readonly hasta: number;
  readonly recursos: readonly CambioDeRecurso[];
  readonly poblacion: { readonly antes: number; readonly despues: number };
  readonly cronicas: readonly Cronica[];
}

function poblacionDe(vista: VistaJugador): number {
  return Object.values(vista.comarcas).reduce(
    (total, c) => total + (c.nivel === 'propia' ? c.comarca.poblacion : 0),
    0,
  );
}

function producidoDe(vista: VistaJugador, recurso: Recurso): number {
  return Object.values(vista.comarcas).reduce(
    (total, c) => total + (c.nivel === 'propia' ? c.comarca.produccionUltimoTurno[recurso] : 0),
    0,
  );
}

export function resumirTurno(
  antes: VistaJugador,
  despues: VistaJugador,
  cronicas: readonly Cronica[],
): ResumenDeTurno {
  return {
    desde: antes.turno,
    hasta: despues.turno,
    recursos: RECURSOS.map((recurso) => {
      const a = antes.jugador.almacen[recurso];
      const d = despues.jugador.almacen[recurso];
      const producido = producidoDe(despues, recurso);
      return {
        recurso,
        antes: a,
        despues: d,
        cambio: d - a,
        producido,
        otros: d - a - producido,
      };
    }),
    poblacion: { antes: poblacionDe(antes), despues: poblacionDe(despues) },
    cronicas,
  };
}
