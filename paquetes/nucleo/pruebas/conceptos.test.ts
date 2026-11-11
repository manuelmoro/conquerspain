// En que se gasta cada recurso (ficha T-126 §4): cada motivo que el motor escribe al mover el almacen
// tiene su concepto. La lista de abajo copia los motivos tal como los escriben las fases; si una fase
// cambia la forma de uno, la partida larga del banco (`herramientas/banco/src/cronica.test.ts`) lo
// delata con un «otro».
import { describe, expect, it } from 'vitest';

import { conceptoDeMovimiento } from '../src/reglas/conceptos.ts';

describe('conceptoDeMovimiento', () => {
  it.each([
    ['produccion de c-12', 'produccion', 'c-12'],
    ['insumos de c-12', 'insumos', 'c-12'],
    ['pan de la poblacion', 'comida', null],
    ['pan de las cuadrillas', 'cuadrillas', null],
    ['sal para conservar el pan', 'conservar', null],
    ['merma del pan', 'merma', null],
    ['aperos de c-3', 'aperos', 'c-3'],
    ['administracion de c-3', 'administracion', 'c-3'],
    ['deuda de administracion', 'deuda', null],
    ['orden o-3-mesta-a1', 'orden', 'o-3-mesta-a1'],
    ['devolucion de la orden o-3-mesta-a1', 'devolucion', 'o-3-mesta-a1'],
    ['devolucion de la letra o-4-mesta-l', 'devolucion', 'o-4-mesta-l'],
    ['obra o-9-monjes-x', 'obra', 'o-9-monjes-x'],
    ['derribo de molino', 'derribo', 'molino'],
    ['peregrinos de c-1', 'peregrinos', 'c-1'],
    ['carga de r-mesta-1', 'carga', 'r-mesta-1'],
    ['descarga de r-mesta-1', 'descarga', 'r-mesta-1'],
    ['repuesto de r-mesta-1', 'repuesto', 'r-mesta-1'],
    ['bastimento de r-mesta-1', 'bastimento', 'r-mesta-1'],
    ['venta de c-7', 'venta', 'c-7'],
    ['se disuelve r-mesta-1', 'disolver', 'r-mesta-1'],
    ['queso y corderos de b-mesta-1', 'queso', 'b-mesta-1'],
    ['esquileo de b-mesta-1', 'esquileo', 'b-mesta-1'],
    ['contrato k-1', 'contrato', 'k-1'],
    ['deposito del contrato k-1', 'deposito', 'k-1'],
    ['devolucion del deposito del contrato k-1', 'devolucion-deposito', 'k-1'],
    ['devolucion del contrato k-1', 'prestamo', 'k-1'],
    ['portazgo de c-1>c-2', 'portazgo', 'c-1>c-2'],
    ['mantenimiento de m-1', 'soldada', 'm-1'],
    ['rescate de c-5', 'rescate', 'c-5'],
  ] as const)('«%s» es %s', (motivo, clase, ref) => {
    expect(conceptoDeMovimiento(motivo)).toEqual({ clase, ref });
  });

  it('lo desconocido queda como «otro», con el motivo tal cual', () => {
    expect(conceptoDeMovimiento('algo nuevo')).toEqual({ clase: 'otro', ref: 'algo nuevo' });
    // Un prefijo sin nada detras no se refiere a nada.
    expect(conceptoDeMovimiento('orden ').clase).toBe('otro');
  });
});
