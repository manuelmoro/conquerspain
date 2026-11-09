// El mercado de un jugador por la API (ficha T-084 §4.2): su panel y, por plaza y recurso, la serie de
// precios que supo en los ultimos turnos. Se lee de sus propias noticias guardadas en los estados de
// cada turno: no cambia el estado y no ensenya nada que el jugador no supiera entonces.
import { RECURSOS_DE_MERCADO, Tablero, panelDeMercado } from '@conquer/nucleo';
import type {
  EstadoPartida,
  IdJugador,
  IdPartida,
  Mundo,
  PanelDeMercado,
  Recurso,
  TablasDeReglas,
  VistaJugador,
} from '@conquer/nucleo';

import type { Repositorio } from '../persistencia/repositorio.ts';

/** Cuantos turnos hacia atras se mira la serie: un anyo. */
export const TURNOS_DE_SERIE = 24;

export interface PuntoDePrecio {
  readonly turno: number;
  readonly mil: number;
}

/** Plaza → recurso → los precios sabidos, del mas viejo al mas nuevo. */
export type SeriesDePrecios = Readonly<
  Record<string, Readonly<Partial<Record<Recurso, readonly PuntoDePrecio[]>>>>
>;

export interface MercadoDelJugador {
  readonly turno: number;
  readonly panel: PanelDeMercado;
  readonly series: SeriesDePrecios;
}

export async function mercadoDelJugador(
  repo: Pick<Repositorio, 'estado'>,
  partida: IdPartida,
  jugador: IdJugador,
  estado: EstadoPartida,
  vista: VistaJugador,
  mundo: Mundo,
  reglas: TablasDeReglas,
): Promise<MercadoDelJugador> {
  const panel = panelDeMercado(new Tablero(vista, mundo, reglas), mundo);
  const plazas = new Set<string>(panel.plazas.map((p) => p.id));
  // Una noticia por plaza y turno en que se supo: la de cada estado guardado, y la de hoy.
  const noticias = new Map<string, Map<number, Readonly<Record<Recurso, number>>>>();
  const anotar = (e: EstadoPartida): void => {
    for (const [plaza, sabido] of Object.entries(e.jugadores[jugador]?.plazas ?? {})) {
      if (!plazas.has(plaza)) continue;
      const deLaPlaza = noticias.get(plaza) ?? new Map<number, Readonly<Record<Recurso, number>>>();
      deLaPlaza.set(sabido.turno, sabido.preciosMil);
      noticias.set(plaza, deLaPlaza);
    }
  };
  for (let turno = Math.max(1, estado.turno - TURNOS_DE_SERIE); turno < estado.turno; turno += 1) {
    const antes = await repo.estado(partida, turno);
    if (antes !== null) anotar(antes);
  }
  anotar(estado);
  const series: Record<string, Partial<Record<Recurso, PuntoDePrecio[]>>> = {};
  for (const [plaza, porTurno] of noticias) {
    const turnos = [...porTurno.keys()].sort((a, b) => a - b);
    series[plaza] = Object.fromEntries(
      RECURSOS_DE_MERCADO.map((r) => [
        r,
        turnos.map((turno) => ({ turno, mil: porTurno.get(turno)?.[r] ?? 0 })),
      ]),
    );
  }
  return { turno: estado.turno, panel, series };
}
