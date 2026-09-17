import { describe, expect, it } from 'vitest';

import { comparar, enOrden, idsEnOrden, ordenarPor } from './orden.ts';

describe('orden estable', () => {
  it('compara por punto de codigo, no por locale', () => {
    expect(comparar('a', 'b')).toBe(-1);
    expect(comparar('b', 'a')).toBe(1);
    expect(comparar('a', 'a')).toBe(0);
    expect(comparar('', 'a')).toBe(-1);
    expect(comparar('abc', 'abcd')).toBe(-1);
    // En locale espanyol la letra con tilde se ordena junto a la vocal; aqui no: manda el codigo.
    expect(comparar('z', 'a')).toBe(1);
    expect(comparar('A', 'a')).toBe(-1);
  });

  it('ordena pares sustitutos por punto de codigo y no por unidad de codigo', () => {
    const emoji = String.fromCodePoint(0x1f600);
    const privado = String.fromCodePoint(0xe000);
    expect(comparar(privado, emoji)).toBe(-1);
    expect(comparar(emoji, privado)).toBe(1);
  });

  it('recorre registros en orden de clave', () => {
    const registro = { soria: 2, almazan: 1, zamora: 3 };
    expect(idsEnOrden(registro)).toEqual(['almazan', 'soria', 'zamora']);
    expect(enOrden(registro)).toEqual([
      ['almazan', 1],
      ['soria', 2],
      ['zamora', 3],
    ]);
  });

  it('da el mismo recorrido aunque el registro se construya al reves', () => {
    const uno: Record<string, number> = {};
    uno['pinares'] = 1;
    uno['arlanza'] = 2;
    const otro: Record<string, number> = {};
    otro['arlanza'] = 2;
    otro['pinares'] = 1;
    expect(enOrden(uno)).toEqual(enOrden(otro));
  });

  it('ordena listas por una clave sin tocar la original', () => {
    const comarcas = [{ id: 'soria' }, { id: 'almazan' }];
    const ordenadas = ordenarPor(comarcas, (c) => c.id);
    expect(ordenadas.map((c) => c.id)).toEqual(['almazan', 'soria']);
    expect(comarcas.map((c) => c.id)).toEqual(['soria', 'almazan']);
  });
});
