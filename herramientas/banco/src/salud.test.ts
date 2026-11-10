// La salud multijugador (ficha T-106): las cuentas de las métricas y una partida corta de verdad.
import { TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import { describe, expect, it } from 'vitest';

import { mundoPeninsula } from './partida.ts';
import {
  CADENCIAS_MEZCLADAS,
  cadenciasDe,
  correlacion,
  informeDeSalud,
  mediana,
  podio,
  saludMultijugador,
} from './salud.ts';

describe('las cuentas', () => {
  it('mediana, correlación y podio', () => {
    expect(mediana([3, 1, 2])).toBe(2);
    expect(mediana([4, 1, 2, 3])).toBe(2.5);
    expect(correlacion([1, 2, 3], [2, 4, 6])).toBeCloseTo(1);
    expect(correlacion([1, 2, 3], [6, 4, 2])).toBeCloseTo(-1);
    expect(correlacion([1, 1, 1], [1, 2, 3])).toBe(0);
    expect(podio({ b: 10, a: 10, c: 30 })).toEqual(['c', 'a', 'b']);
  });

  it('las cadencias rotan por semilla y no pasan de seis turnos', () => {
    expect(Math.max(...CADENCIAS_MEZCLADAS)).toBe(6);
    const a = cadenciasDe(['mesta', 'ferrones'], 0);
    const b = cadenciasDe(['mesta', 'ferrones'], 1);
    expect(a['mesta']).not.toBe(b['mesta']);
  });
});

describe('una medición corta', () => {
  it('juega las dos variantes de cada semilla y da las siete comprobaciones', () => {
    const informe = saludMultijugador({
      semillas: ['1492'],
      turnos: 6,
      casas: ['mesta', 'hortelanos'],
      reglas: TABLAS_DEL_JUEGO,
      mundo: mundoPeninsula(),
    });
    expect(informe.diligentes).toHaveLength(1);
    expect(informe.mezcladas).toHaveLength(1);
    expect(Object.keys(informe.cumple).sort()).toEqual([
      'abandonos',
      'casasEnElPodio',
      'correlacion',
      'deslealtad',
      'ningunaGanaDosVeces',
      'primeroSobreLaMediana',
      'sinDecision',
    ]);
    // Los diligentes entran todos los turnos.
    expect(informe.diligentes[0]?.entradas['mesta']).toBe(6);
    expect(informeDeSalud(informe, 6)).toMatch(/Primero sobre la mediana/);
  }, 120_000);
});
