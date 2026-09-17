import { describe, expect, it } from 'vitest';

import { azarDe, azarDeTexto } from './azar.ts';

function cien(semilla: { entero(max: number): number }): number[] {
  const valores: number[] = [];
  for (let i = 0; i < 100; i += 1) valores.push(semilla.entero(1000000));
  return valores;
}

describe('azar con semilla', () => {
  it('da la misma secuencia con los mismos argumentos', () => {
    const uno = azarDe('semilla-de-partida', 14, 'cosecha', 'pinares');
    const otro = azarDe('semilla-de-partida', 14, 'cosecha', 'pinares');
    expect(cien(uno)).toEqual(cien(otro));
  });

  it('cambia de secuencia si cambia el ambito, el turno o la entidad', () => {
    const base = cien(azarDe('semilla', 14, 'cosecha', 'pinares'));
    expect(cien(azarDe('semilla', 14, 'hallazgo', 'pinares'))).not.toEqual(base);
    expect(cien(azarDe('semilla', 15, 'cosecha', 'pinares'))).not.toEqual(base);
    expect(cien(azarDe('semilla', 14, 'cosecha', 'soria'))).not.toEqual(base);
    expect(cien(azarDe('otra-semilla', 14, 'cosecha', 'pinares'))).not.toEqual(base);
  });

  it('respeta los limites de cada tirada', () => {
    const azar = azarDeTexto('limites');
    for (let i = 0; i < 5000; i += 1) {
      const valor = azar.entero(7);
      expect(valor).toBeGreaterThanOrEqual(0);
      expect(valor).toBeLessThan(7);
      const entre = azar.entreInclusive(-3, 3);
      expect(entre).toBeGreaterThanOrEqual(-3);
      expect(entre).toBeLessThanOrEqual(3);
      const mil = azar.milesimas(900, 1100);
      expect(mil).toBeGreaterThanOrEqual(900);
      expect(mil).toBeLessThanOrEqual(1100);
    }
    expect(azar.entero(1)).toBe(0);
  });

  it('reparte de forma razonablemente uniforme', () => {
    const azar = azarDeTexto('uniformidad');
    const cuenta = [0, 0];
    for (let i = 0; i < 10000; i += 1) {
      const indice = azar.entero(2);
      cuenta[indice] = (cuenta[indice] ?? 0) + 1;
    }
    expect(cuenta[0]).toBeGreaterThan(4700);
    expect(cuenta[0]).toBeLessThan(5300);
  });

  it('rechaza tiradas imposibles', () => {
    const azar = azarDeTexto('errores');
    expect(() => azar.entero(0)).toThrow(/entero positivo/);
    expect(() => azar.entero(-2)).toThrow(/entero positivo/);
    expect(() => azar.entreInclusive(5, 1)).toThrow(/del reves/);
    expect(() => azar.elegir([])).toThrow(/lista vacia/);
    expect(() => azarDe('semilla', 5 / 2, 'cosecha', 'pinares')).toThrow(/entero/);
  });

  it('elige de una lista sin salirse de ella', () => {
    const azar = azarDeTexto('eleccion');
    const comarcas = ['pinares', 'soria', 'almazan'];
    for (let i = 0; i < 500; i += 1) {
      expect(comarcas).toContain(azar.elegir(comarcas));
    }
  });

  it('baraja de forma determinista y sin tocar la lista original', () => {
    const original = ['a', 'b', 'c', 'd', 'e', 'f'];
    const uno = azarDeTexto('barajar').barajar(original);
    const otro = azarDeTexto('barajar').barajar(original);
    expect(uno).toEqual(otro);
    expect(original).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    expect([...uno].sort()).toEqual([...original].sort());
    expect(azarDeTexto('otra-semilla').barajar(original)).not.toEqual(uno);
  });
});
