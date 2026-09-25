// El calendario anclado (ficha T-061 §4.1): funciones puras del ancla y el intervalo.
import { describe, expect, it } from 'vitest';

import { proximaResolucion, turnosDebidos } from './calendario.ts';

const ANCLA = 1_800_000_000_000;
const HORA = 3600;

describe('proximaResolucion', () => {
  it('el turno N se resuelve al acabar: ancla + N intervalos', () => {
    expect(proximaResolucion(ANCLA, HORA, 1)).toBe(ANCLA + 3_600_000);
    expect(proximaResolucion(ANCLA, HORA, 24)).toBe(ANCLA + 24 * 3_600_000);
  });

  it('no depende de nada mas que del ancla: no hay deriva', () => {
    // Da igual cuanto tardara en resolverse el anterior: la formula no lo ve.
    const enPunto = proximaResolucion(ANCLA, HORA, 6);
    const tras = [1, 2, 3, 4, 5].map((n) => proximaResolucion(ANCLA, HORA, n + 1));
    expect(tras.at(-1)).toBe(enPunto);
    expect(proximaResolucion(ANCLA, 21_600, 2) - proximaResolucion(ANCLA, 21_600, 1)).toBe(
      21_600_000,
    );
  });
});

describe('turnosDebidos', () => {
  const proxima = ANCLA + 3_600_000;

  it('ninguno antes de la hora, uno en punto', () => {
    expect(turnosDebidos(proxima, HORA, proxima - 1)).toBe(0);
    expect(turnosDebidos(proxima, HORA, proxima)).toBe(1);
    expect(turnosDebidos(proxima, HORA, proxima + 3_599_999)).toBe(1);
  });

  it('tras una caida cuenta los que se han acumulado', () => {
    expect(turnosDebidos(proxima, HORA, proxima + 3_600_000)).toBe(2);
    expect(turnosDebidos(proxima, HORA, proxima + 3 * 3_600_000 + 5)).toBe(4);
  });

  it('sin proxima resolucion (detenida) no hay nada debido', () => {
    expect(turnosDebidos(null, HORA, ANCLA)).toBe(0);
  });
});
