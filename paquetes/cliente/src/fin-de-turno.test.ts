import { describe, expect, it } from 'vitest';

import { filasDeQuienJuega, resumenDelFinDeTurno } from './fin-de-turno.ts';

const q = (jugador: string, nombre: string, terminado: boolean) => ({ jugador, nombre, terminado });

describe('resumenDelFinDeTurno', () => {
  it('cuenta quien ha terminado y nombra a quien falta, sin contarme a mi', () => {
    const r = resumenDelFinDeTurno(
      [q('mesta', 'Ana', true), q('monjes', 'Luis', false), q('canteros', 'Eva', false)],
      'monjes',
    );
    expect(r).toMatchObject({ yo: false, terminados: 1, total: 3 });
    expect(r.linea).toBe('Han terminado 1 de 3. Falta: Eva.');
    expect(r.explicacion).toMatch(/sin esperar al corte/);
  });

  it('si solo falto yo, lo dice y avisa de que se resolvera en el acto', () => {
    const r = resumenDelFinDeTurno([q('mesta', 'Ana', true), q('monjes', 'Luis', false)], 'monjes');
    expect(r.linea).toBe('Han terminado 1 de 2: solo faltas tú.');
    expect(r.explicacion).toMatch(/último/);
  });

  it('con varios que faltan, los enumera en castellano', () => {
    const r = resumenDelFinDeTurno(
      [q('a', 'Ana', true), q('b', 'Luis', false), q('c', 'Eva', false), q('d', 'Yo', false)],
      'd',
    );
    expect(r.linea).toBe('Han terminado 1 de 4. Faltan: Luis y Eva.');
  });

  it('quien ya ha terminado puede reabrir', () => {
    const r = resumenDelFinDeTurno([q('mesta', 'Ana', true), q('monjes', 'Luis', false)], 'mesta');
    expect(r.yo).toBe(true);
    expect(r.explicacion).toMatch(/reabre/);
  });

  it('jugando solo, terminar resuelve en el acto', () => {
    expect(resumenDelFinDeTurno([q('mesta', 'Ana', false)], 'mesta').linea).toMatch(/solo/);
  });
});

describe('filasDeQuienJuega', () => {
  it('pone primero a quien falta, con su casa y si lleva turnos sin órdenes', () => {
    const filas = filasDeQuienJuega(
      [q('mesta', 'Ana', true), q('monjes', 'Luis', false), q('canteros', 'Eva', false)],
      [
        { id: 'mesta', nombre: 'La Mesta', turnosSinOrdenes: 0 },
        { id: 'monjes', nombre: 'Monjes repobladores', turnosSinOrdenes: 3 },
        { id: 'canteros', nombre: 'Canteros trasmeranos', turnosSinOrdenes: 1 },
      ],
      'canteros',
    );
    expect(filas.map((f) => [f.nombre, f.terminado, f.soyYo])).toEqual([
      ['Luis', false, false],
      ['Eva', false, true],
      ['Ana', true, false],
    ]);
    expect(filas[0]).toMatchObject({
      casa: 'Monjes repobladores',
      ausencia: '3 turnos sin dar órdenes',
    });
    expect(filas[1]?.ausencia).toBeNull();
    // Tampoco se dice de uno mismo, aunque lleve turnos sin ordenes.
    const mias = filasDeQuienJuega(
      [q('mesta', 'Ana', false)],
      [{ id: 'mesta', nombre: 'La Mesta', turnosSinOrdenes: 5 }],
      'mesta',
    );
    expect(mias[0]?.ausencia).toBeNull();
  });
});
