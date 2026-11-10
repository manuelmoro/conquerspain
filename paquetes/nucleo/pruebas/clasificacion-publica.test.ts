// La clasificacion publica (ficha T-085 §4.1, criterio 1): el desglose de cada casa suma su prestigio
// con la misma cuenta que la fase 11, y de las demas no sale ningun hito con su fecha.
import { describe, expect, it } from 'vitest';

import { clasificacionPublica } from '../src/reglas/clasificacion-publica.ts';
import { resolverTurno } from '../src/resolver.ts';
import type { EstadoJugador, EstadoPartida } from '../src/tipos/estado.ts';
import { DOS, UNO, escenario, mundo, reglas } from './recuas.ts';

function partida(): EstadoPartida {
  const base = escenario({ conDos: true });
  const dos = base.jugadores[DOS] as EstadoJugador;
  const uno = base.jugadores[UNO] as EstadoJugador;
  return {
    ...base,
    jugadores: {
      [UNO]: { ...uno, hitos: { 'primer-horizonte': 2 } },
      [DOS]: { ...dos, hitos: { 'primer-horizonte': 1, villa: 3 } },
    },
    primicias: { 'primer-horizonte': DOS },
  };
}

describe('la clasificación pública', () => {
  // Resuelto un turno, la fase 11 ha puesto prestigio y clasificación con su cuenta.
  const estado = resolverTurno(partida(), [], mundo, reglas).estado;
  const c = clasificacionPublica(estado, UNO, mundo, reglas);

  it('una fila por casa, en orden de puesto, y su desglose suma su prestigio (criterio 1)', () => {
    expect(c.filas.map((f) => f.puesto)).toEqual([1, 2]);
    for (const f of c.filas) {
      const suma = Object.values(f.capitulos).reduce((t, n) => t + n, 0) - f.penalizaciones;
      expect(suma, f.jugador).toBe(f.prestigio);
    }
    expect(c.filas.find((f) => f.jugador === DOS)?.primicias).toEqual(['primer-horizonte']);
  });

  it('los hitos con fecha son solo los propios; de la otra casa, nada', () => {
    expect(c.misHitos).toEqual([
      {
        hito: 'primer-horizonte',
        nombre: reglas.hitos['primer-horizonte'].nombre,
        prestigio: reglas.hitos['primer-horizonte'].prestigio,
        turno: 2,
        fecha: expect.any(String) as string,
        primicia: false,
      },
    ]);
    expect(JSON.stringify(c.filas)).not.toContain('villa');
    expect(c.porLograr.some((h) => h.hito === 'villa')).toBe(true);
    expect(c.porLograr.some((h) => h.hito === 'buen-nombre')).toBe(true);
  });
});
