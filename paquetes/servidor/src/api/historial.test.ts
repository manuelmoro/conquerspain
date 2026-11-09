// El historico de recursos por la API (T-090): lo que entro, salio y quedo cada turno, de lo propio.
import { describe, expect, it } from 'vitest';

import { RECURSOS } from '@conquer/nucleo';
import type { IdPartida } from '@conquer/nucleo';

import type { TurnoDelHistorial } from './historial.ts';
import { apiDePrueba, CUENTAS } from './prueba-comun.ts';

describe('el histórico de recursos', () => {
  it('cuadra turno a turno y acaba en lo que el jugador tiene hoy', async () => {
    const e = await apiDePrueba({ turnosJugados: 4 });
    const r = await e.pedir(CUENTAS['mesta'] ?? '', 'GET', '/partidas/p1/historial-de-recursos');
    expect(r.estado, JSON.stringify(r.cuerpo)).toBe(200);
    const { turnos } = r.cuerpo as { turnos: TurnoDelHistorial[] };
    expect(turnos.map((t) => t.turno)).toEqual([1, 2, 3, 4]);
    const hoy = (await e.repo.ultimoEstado('p1' as IdPartida))?.jugadores['mesta']?.almacen;
    const ultimo = turnos.at(-1);
    for (const recurso of RECURSOS) {
      expect(ultimo?.recursos[recurso].queda, recurso).toBe(hoy?.[recurso]);
      for (const [i, t] of turnos.entries()) {
        const antes = i === 0 ? undefined : turnos[i - 1]?.recursos[recurso].queda;
        const c = t.recursos[recurso];
        if (antes !== undefined)
          expect(c.queda, `${recurso} ${String(t.turno)}`).toBe(antes + c.entra - c.sale);
      }
    }
    // Ha habido movimiento de verdad: la gente come pan cada turno.
    expect(turnos.some((t) => t.recursos.pan.sale > 0)).toBe(true);
    await e.repo.cerrar();
  }, 120_000);
});
