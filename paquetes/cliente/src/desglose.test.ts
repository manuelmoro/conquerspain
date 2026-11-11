import { describe, expect, it } from 'vitest';

import { CLASES_DE_CONCEPTO } from '@conquer/nucleo';
import type { Orden } from '@conquer/nucleo';

import type { TurnoDelHistorial } from './api.ts';
import { desgloseDe, textoDeConcepto } from './desglose.ts';
import type { NombresDelDesglose } from './desglose.ts';

const orden = { id: 'o-3-mesta-a', tipo: 'formar-recua' } as unknown as Orden;

const nombres: NombresDelDesglose = {
  comarca: (id) => (id === 'c-1' ? 'Burgos' : 'Lerma'),
  unidad: (id) => (id === 'recua-1' ? 'Recua de Burgos' : 'una recua'),
  orden: (id) => (id === orden.id ? orden : undefined),
  frase: () => 'Formar una recua en Burgos',
  obra: (id) => (id === 'obra-2' ? { que: 'puente', comarca: 'c-1' } : undefined),
};

function turno(
  n: number,
  desglose: TurnoDelHistorial['recursos']['pan']['desglose'],
): TurnoDelHistorial {
  const nada = { entra: 0, sale: 0, queda: 0, desglose: [] };
  return {
    turno: n,
    recursos: {
      pan: { entra: 0, sale: 0, queda: 0, desglose },
      madera: nada,
      piedra: nada,
      maravedis: nada,
      sal: nada,
      hierro: nada,
      lana: nada,
    },
  };
}

describe('textoDeConcepto', () => {
  it('cuenta cada concepto en castellano, con sus nombres', () => {
    expect(textoDeConcepto({ clase: 'produccion', ref: 'c-1', delta: 40 }, nombres)).toBe(
      'Producción de Burgos',
    );
    expect(textoDeConcepto({ clase: 'comida', ref: null, delta: -30 }, nombres)).toBe(
      'Lo que come tu gente',
    );
    expect(textoDeConcepto({ clase: 'orden', ref: orden.id, delta: -50 }, nombres)).toBe(
      'Formar una recua en Burgos',
    );
    expect(textoDeConcepto({ clase: 'carga', ref: 'recua-1', delta: -10 }, nombres)).toBe(
      'Cargado en Recua de Burgos',
    );
    expect(textoDeConcepto({ clase: 'obra', ref: 'obra-2', delta: -20 }, nombres)).toMatch(
      /^Plazo de la obra: .+ en Burgos$/,
    );
    expect(textoDeConcepto({ clase: 'portazgo', ref: 'x', delta: 5 }, nombres)).toBe(
      'Portazgos que cobras',
    );
    expect(textoDeConcepto({ clase: 'portazgo', ref: 'x', delta: -5 }, nombres)).toBe(
      'Portazgos que pagas',
    );
  });

  it('lo que ya no existe se nombra igual, sin identificadores', () => {
    expect(textoDeConcepto({ clase: 'orden', ref: 'o-9-x', delta: -1 }, nombres)).toBe(
      'Una orden tuya',
    );
    expect(textoDeConcepto({ clase: 'obra', ref: 'obra-9', delta: -1 }, nombres)).toBe(
      'Plazo de una obra mayor',
    );
  });

  it('ninguna clase deja texto vacío ni enseña un identificador interno', () => {
    for (const clase of CLASES_DE_CONCEPTO) {
      if (clase === 'otro') continue;
      const texto = textoDeConcepto({ clase, ref: 'c-1', delta: -1 }, nombres);
      expect(texto.length, clase).toBeGreaterThan(3);
      expect(texto, clase).not.toContain('c-1');
    }
  });
});

describe('desgloseDe', () => {
  it('suma por concepto en los turnos dados y separa lo que entra de lo que sale', () => {
    const turnos = [
      turno(1, [
        { clase: 'produccion', ref: 'c-1', delta: 40 },
        { clase: 'comida', ref: null, delta: -30 },
      ]),
      turno(2, [
        { clase: 'produccion', ref: 'c-1', delta: 35 },
        { clase: 'produccion', ref: 'c-2', delta: 50 },
        { clase: 'comida', ref: null, delta: -31 },
        { clase: 'carga', ref: 'recua-1', delta: -10 },
      ]),
    ];
    const d = desgloseDe(turnos, 'pan', nombres);
    expect(d.entra).toEqual([
      { texto: 'Producción de Burgos', delta: 75 },
      { texto: 'Producción de Lerma', delta: 50 },
    ]);
    expect(d.sale).toEqual([
      { texto: 'Lo que come tu gente', delta: -61 },
      { texto: 'Cargado en Recua de Burgos', delta: -10 },
    ]);
    expect(desgloseDe(turnos.slice(0, 1), 'pan', nombres).sale).toEqual([
      { texto: 'Lo que come tu gente', delta: -30 },
    ]);
  });
});
