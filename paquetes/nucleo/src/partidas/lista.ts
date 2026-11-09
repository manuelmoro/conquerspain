// Lo que la lista de partidas ensenya de cada una (ficha T-086 §4.1): la fecha, el prestigio y el
// puesto, y el abastecimiento. Todo es del propio jugador o publico.
import { Tablero } from '../prevision/tablero.ts';
import { calendarioDe } from '../reglas/calendario.ts';
import { vistaDeJugador } from '../reglas/vista.ts';
import type { EstadoPartida } from '../tipos/estado.ts';
import type { IdJugador } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';

export interface ResumenParaLaLista {
  readonly fecha: string;
  readonly prestigio: number;
  readonly puesto: number | null;
  readonly casas: number;
  /** Pan que se puede gastar: el almacen menos lo apartado. */
  readonly pan: number;
  /** Turnos que aguanta ese pan al paso de ahora; null si no se come nada. */
  readonly turnosDePan: number | null;
  readonly escasez: boolean;
}

export function resumenParaLaLista(
  estado: EstadoPartida,
  jugador: IdJugador,
  mundo: Mundo,
  reglas: TablasDeReglas,
): ResumenParaLaLista {
  const t = new Tablero(vistaDeJugador(estado, jugador, mundo), mundo, reglas);
  const pan = t.disponible('pan');
  const come = t.consumoDePan();
  return {
    fecha: calendarioDe(estado.turno, mundo, reglas).nombre,
    prestigio: t.yo.prestigio,
    puesto: estado.clasificacion.find((p) => p.jugador === jugador)?.puesto ?? null,
    casas: Object.keys(estado.jugadores).length,
    pan,
    turnosDePan: come <= 0 ? null : Math.floor(pan / come),
    escasez: t.yo.escasez,
  };
}
