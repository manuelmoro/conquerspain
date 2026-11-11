// El historico de recursos por la API (T-090): lo que entro, salio y quedo cada turno, de lo propio.
import { describe, expect, it } from 'vitest';

import { RECURSOS } from '@conquer/nucleo';
import type { IdPartida } from '@conquer/nucleo';

import type { ReferenciasDelHistorial, TurnoDelHistorial } from './historial.ts';
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
    // El desglose (T-126) suma exactamente lo que entro y salio, y dice en que.
    for (const t of turnos) {
      for (const recurso of RECURSOS) {
        const c = t.recursos[recurso];
        const positivos = c.desglose.filter((p) => p.delta > 0).reduce((s, p) => s + p.delta, 0);
        const negativos = c.desglose.filter((p) => p.delta < 0).reduce((s, p) => s - p.delta, 0);
        expect(positivos - negativos, `${recurso} ${String(t.turno)}`).toBe(c.entra - c.sale);
        expect(c.desglose.every((p) => p.clase !== 'otro')).toBe(true);
      }
    }
    const pan = turnos.at(-1)?.recursos.pan.desglose ?? [];
    expect(pan.find((p) => p.clase === 'comida')?.delta).toBeLessThan(0);
    expect(pan.some((p) => p.clase === 'produccion' && p.ref !== null && p.delta > 0)).toBe(true);
    // De lo que mas movio a lo que menos.
    const magnitudes = pan.map((p) => Math.abs(p.delta));
    expect(magnitudes).toEqual([...magnitudes].sort((a, b) => b - a));
    await e.repo.cerrar();
  }, 120_000);

  it('las órdenes que pagan algo vienen con la orden, para nombrarlas', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const mesta = CUENTAS['mesta'] ?? '';
    const capital = (await e.repo.ultimoEstado('p1' as IdPartida))?.jugadores['mesta']?.capital;
    const dada = await e.pedir(mesta, 'POST', '/partidas/p1/ordenes', {
      idCliente: 'recua-1',
      tipo: 'formar-recua',
      comarca: capital,
      vecinos: 0,
    });
    expect(dada.estado, JSON.stringify(dada.cuerpo)).toBe(201);
    await e.resolver();
    const r = await e.pedir(mesta, 'GET', '/partidas/p1/historial-de-recursos');
    const { turnos, referencias } = r.cuerpo as {
      turnos: TurnoDelHistorial[];
      referencias: ReferenciasDelHistorial;
    };
    const pago = turnos.at(-1)?.recursos.maravedis.desglose.find((p) => p.clase === 'orden');
    expect(pago?.delta).toBeLessThan(0);
    expect(referencias.ordenes[pago?.ref ?? '']?.tipo).toBe('formar-recua');
    await e.repo.cerrar();
  }, 120_000);
});
