import { describe, expect, it } from 'vitest';

import { CASAS_DE_OFICIO } from './datos/casas.ts';
import { TABLAS_DEL_JUEGO, VERSION_NUCLEO, explicar, validarTablas } from './index.ts';

describe('motor de reglas', () => {
  it('exporta su version', () => {
    expect(VERSION_NUCLEO).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('exporta las tablas del juego, que validan y llevan las casas de verdad', () => {
    const resultado = validarTablas(TABLAS_DEL_JUEGO);
    if (!resultado.ok) throw new Error(explicar(resultado.errores));
    expect(resultado.valor.casas).toEqual(CASAS_DE_OFICIO);
    expect(resultado.valor.estaciones.estacionPorTurno).toHaveLength(24);
  });
});
