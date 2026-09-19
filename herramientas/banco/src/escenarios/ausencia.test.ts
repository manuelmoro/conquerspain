// El principio fundacional (ficha T-045 §4.5): entrar cada turno o cada seis, con colas, plan y
// mayordomo, deja el mismo prestigio al turno 100, con menos de un 5 % de diferencia.
import { describe, expect, it } from 'vitest';

import { compararAusencia } from './ausencia.ts';

describe('conectarse más no da ventaja', () => {
  it('la misma estrategia, cada turno o cada seis, difiere menos de un 5 % al turno 100', () => {
    const informe = compararAusencia(100);
    expect(informe.prestigioDiligente).toBeGreaterThan(100);
    expect(informe.prestigioAusente).toBeGreaterThan(100);
    expect(informe.diferenciaMil).toBeLessThan(50);
  }, 60_000);
});
