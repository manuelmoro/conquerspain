import { describe, expect, it } from 'vitest';

import { canonico } from './serializacion.ts';

describe('forma canonica', () => {
  it('ordena las claves', () => {
    expect(canonico({ b: 1, a: 2 })).toBe('{"a":2,"b":1}');
    expect(canonico({ a: 2, b: 1 })).toBe(canonico({ b: 1, a: 2 }));
  });

  it('serializa los tipos basicos sin espacios', () => {
    expect(canonico(7)).toBe('7');
    expect(canonico(-7)).toBe('-7');
    expect(canonico('pinares')).toBe('"pinares"');
    expect(canonico(true)).toBe('true');
    expect(canonico(null)).toBe('null');
    expect(canonico([1, 2, 3])).toBe('[1,2,3]');
  });

  it('conserva el orden de las listas', () => {
    expect(canonico(['soria', 'almazan'])).toBe('["soria","almazan"]');
  });

  it('omite los campos indefinidos y conserva los nulos', () => {
    expect(canonico({ a: undefined, b: null, c: 1 })).toBe('{"b":null,"c":1}');
    expect(canonico([undefined])).toBe('[null]');
  });

  it('rechaza numeros con decimales y dice el campo culpable', () => {
    const factor = 5 / 2;
    expect(() => canonico({ comarca: { produccion: factor } })).toThrow(
      /comarca\.produccion.*entero seguro/,
    );
    expect(() => canonico([1, factor])).toThrow(/"1".*entero seguro/);
    expect(() => canonico(factor)).toThrow(/\(raiz\)/);
  });

  it('rechaza lo que no se puede serializar', () => {
    expect(() => canonico(undefined)).toThrow(/undefined/);
    expect(() => canonico({ f: () => 1 })).toThrow(/tipo function/);
    expect(() => canonico({ n: 10n })).toThrow(/tipo bigint/);
  });

  it('escapa las cadenas de forma estable', () => {
    expect(canonico({ nota: 'comillas "dobles" y \\ barra' })).toBe(
      '{"nota":"comillas \\"dobles\\" y \\\\ barra"}',
    );
    expect(canonico('cañada')).toBe('"cañada"');
  });

  it('anida objetos y listas', () => {
    const estado = { comarcas: [{ id: 'pinares', pob: 40 }], turno: 14 };
    expect(canonico(estado)).toBe('{"comarcas":[{"id":"pinares","pob":40}],"turno":14}');
  });
});
