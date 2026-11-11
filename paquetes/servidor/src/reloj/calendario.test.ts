import { describe, expect, it } from 'vitest';

import { vencimientoDesde } from './calendario.ts';

const AHORA = Date.UTC(2026, 10, 11, 10, 0, 0);
const HORA = 3600;

describe('vencimientoDesde', () => {
  it('un turno vence un intervalo despues de empezar', () => {
    expect(vencimientoDesde(AHORA, HORA)).toBe(AHORA + 3_600_000);
  });

  it('el plazo se cuenta desde el ultimo avance, no desde la fundacion', () => {
    // Un turno resuelto a los 10 minutos (todos terminaron) da al siguiente su hora entera.
    const resueltoPronto = AHORA + 10 * 60_000;
    expect(vencimientoDesde(resueltoPronto, HORA)).toBe(resueltoPronto + 3_600_000);
  });
});
