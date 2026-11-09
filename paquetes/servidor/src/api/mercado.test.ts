// El mercado por la API (ficha T-084 §4.2, criterios 2 y 3): el panel solo trae lo que el jugador
// conoce y la serie de cada plaza son los precios que supo, turno a turno.
import { describe, expect, it } from 'vitest';

import {
  TABLAS_DEL_JUEGO,
  Tablero,
  panelDeMercado,
  recursosSegun,
  vistaDeJugador,
} from '@conquer/nucleo';
import type { EstadoPartida, IdJugador, IdPartida, VistaJugador } from '@conquer/nucleo';

import { mercadoDelJugador } from './mercado.ts';
import type { MercadoDelJugador } from './mercado.ts';
import { apiDePrueba, CUENTAS } from './prueba-comun.ts';

const MESTA = CUENTAS['mesta'] ?? '';
const MESTA_ID = 'mesta' as IdJugador;

describe('el mercado por la API', () => {
  it('trae solo las plazas de comarcas que el jugador conoce (criterio 2)', async () => {
    const e = await apiDePrueba({ turnosJugados: 2 });
    const r = await e.pedir(MESTA, 'GET', '/partidas/p1/mercado');
    expect(r.estado, JSON.stringify(r.cuerpo)).toBe(200);
    const m = r.cuerpo as MercadoDelJugador;
    const vista = (
      (await e.pedir(MESTA, 'GET', '/partidas/p1/estado')).cuerpo as { vista: VistaJugador }
    ).vista;
    // Solo plazas de comarcas que conoce (criterio 2): las ferias se saben de oídas desde el principio.
    expect(m.panel.plazas.length).toBeGreaterThan(0);
    for (const plaza of m.panel.plazas) expect(vista.comarcas[plaza.comarca]).toBeDefined();

    await e.repo.cerrar();
  }, 120_000);

  it('la serie de una plaza son los precios que el jugador supo, turno a turno (criterio 3)', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const hoy = await e.repo.ultimoEstado('p1' as IdPartida);
    if (hoy === null) throw new Error('sin estado');
    const vista = vistaDeJugador(hoy, MESTA_ID, e.mundo);
    const plaza = panelDeMercado(new Tablero(vista, e.mundo, TABLAS_DEL_JUEGO), e.mundo).plazas[0];
    if (plaza === undefined) throw new Error('la Mesta no conoce ninguna plaza');
    const mesta = hoy.jugadores[MESTA_ID];
    if (mesta === undefined) throw new Error('sin la Mesta');
    // Noticias de la lana de esa plaza: en el turno 2 (dos estados la repiten) y en el 4.
    const con = (turnoDeNoticia: number, lana: number, turnoDelEstado: number): EstadoPartida => ({
      ...hoy,
      turno: turnoDelEstado,
      jugadores: {
        ...hoy.jugadores,
        [MESTA_ID]: {
          ...mesta,
          plazas: {
            [plaza.id]: {
              turno: turnoDeNoticia,
              fuente: 'rumor',
              preciosMil: { ...recursosSegun(() => 1000), lana },
              visitada: false,
            },
          },
        },
      },
    });
    const guardados: Record<number, EstadoPartida> = {
      2: con(2, 50000, 2),
      3: con(2, 50000, 3),
      4: con(4, 61000, 4),
    };
    const actual = con(4, 61000, 6);
    const m = await mercadoDelJugador(
      { estado: (_id, turno) => Promise.resolve(guardados[turno] ?? null) },
      'p1' as IdPartida,
      MESTA_ID,
      actual,
      vistaDeJugador(actual, MESTA_ID, e.mundo),
      e.mundo,
      TABLAS_DEL_JUEGO,
    );
    expect(m.series[plaza.id]?.lana).toEqual([
      { turno: 2, mil: 50000 },
      { turno: 4, mil: 61000 },
    ]);
    expect(m.panel.plazas.find((p) => p.id === plaza.id)?.precios?.lana?.mil).toBe(61000);
    await e.repo.cerrar();
  }, 120_000);
});
