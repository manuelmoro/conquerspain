// El panel de mercado de un jugador (ficha T-084 §4.1, criterio 2): solo las plazas que conoce, con
// sus precios fechados y su fuente; de una plaza que no conoce, nada.
import { describe, expect, it } from 'vitest';

import { panelDeMercado } from '../src/prevision/mercado.ts';
import { Tablero } from '../src/prevision/tablero.ts';
import { vistaDeJugador } from '../src/reglas/vista.ts';
import type { EstadoJugador, EstadoPartida } from '../src/tipos/estado.ts';
import { DOS, UNO, conComarca, escenario, mundo, recua, recursos, reglas } from './recuas.ts';

function partida(): EstadoPartida {
  let estado = escenario({
    conDos: true,
    recuas: [recua('recua-1', { cometido: 'tratar' })],
  });
  estado = conComarca(estado, 'prueba-llano', {
    edificios: { ...estado.comarcas['prueba-llano']?.edificios, mercado: 1 },
  });
  estado = conComarca(estado, 'prueba-costa', { duenyo: DOS, edificios: { mercado: 1 } });
  const uno = estado.jugadores[UNO] as EstadoJugador;
  const conocimiento = Object.fromEntries(
    Object.entries(uno.conocimiento).filter(([id]) => id !== 'prueba-costa'),
  );
  return {
    ...estado,
    jugadores: {
      ...estado.jugadores,
      [UNO]: {
        ...uno,
        conocimiento,
        plazas: {
          'local-prueba-llano': {
            turno: estado.turno - 3,
            fuente: 'visita',
            preciosMil: recursos({ pan: 3100, lana: 61000 }),
            visitada: true,
          },
          // Un precio que se supo de una plaza ajena: aunque se sepa, la comarca no se conoce.
          'local-prueba-costa': {
            turno: estado.turno - 1,
            fuente: 'rumor',
            preciosMil: recursos({ pan: 9999 }),
            visitada: false,
          },
        },
      },
    },
  };
}

describe('el panel de mercado', () => {
  const estado = partida();
  const panel = panelDeMercado(
    new Tablero(vistaDeJugador(estado, UNO, mundo), mundo, reglas),
    mundo,
  );

  it('trae la plaza propia con su precio, su fecha, su fuente, su base y la recua que trata', () => {
    const llano = panel.plazas.find((p) => p.id === 'local-prueba-llano');
    expect(llano).toMatchObject({
      nombre: 'Mercado de Llano de Prueba',
      tipo: 'local',
      abierta: true,
      abreEn: 0,
      turnoDelPrecio: estado.turno - 3,
      fuente: 'visita',
      recuas: [{ id: 'recua-1', nombre: 'Recua recua-1', trata: true }],
    });
    expect(llano?.precios?.pan?.mil).toBe(3100);
    expect(llano?.precios?.pan?.baseMil).toBeGreaterThan(0);
    expect(llano?.precios?.maravedis).toBeUndefined();
  });

  it('de una plaza de una comarca que no conoce no sale nada, ni su precio (criterio 2)', () => {
    expect(panel.plazas.some((p) => p.comarca === 'prueba-costa')).toBe(false);
    expect(JSON.stringify(panel)).not.toContain('9999');
  });
});
