// El precio base de una comarca (ficha T-052 §4.1): lo que sobra alli vale menos y lo que no hay
// cuesta mas traerlo. Es una funcion pura del catalogo: mismo mundo, mismo precio, siempre.
import { describe, expect, it } from 'vitest';

import { MERCADO } from '../src/datos/mercado.ts';
import { DATOS_DE_RECURSOS } from '../src/datos/recursos.ts';
import { precioBaseLocalMil } from '../src/reglas/precios.ts';
import type { ComarcaMundo, NivelPotencial, Potencial } from '../src/tipos/mundo.ts';
import { POTENCIALES } from '../src/tipos/mundo.ts';
import type { IdComarca } from '../src/tipos/ids.ts';
import { RECURSOS } from '../src/tipos/recursos.ts';

/** Una comarca de mentira con los potenciales que se digan: aqui solo se miran esos. */
function comarcaCon(potenciales: Partial<Record<Potencial, NivelPotencial>>): ComarcaMundo {
  const llenos = Object.fromEntries(POTENCIALES.map((p) => [p, potenciales[p] ?? 0])) as Record<
    Potencial,
    NivelPotencial
  >;
  return {
    id: 'inventada' as IdComarca,
    nombre: 'Inventada',
    cabecera: 'Inventada',
    region: '00-prueba',
    centro: [0, 0],
    poligono: [],
    terreno: 'llano',
    potenciales: llenos,
    solares: 6,
    poblacionInicial: 40,
    localidades: [],
    rasgos: [],
    ferias: [],
    esOrigen: false,
  };
}

const base = (recurso: (typeof RECURSOS)[number]): number =>
  DATOS_DE_RECURSOS[recurso].precioBaseMil;

describe('el precio base de una comarca', () => {
  it('cada recurso mira al potencial que lo produce, y los maravedis a ninguno', () => {
    expect(MERCADO.potencialDeRecurso).toEqual({
      pan: 'labor',
      madera: 'monte',
      piedra: 'piedra',
      sal: 'sal',
      hierro: 'hierro',
      lana: 'pasto',
    });
    // Los maravedis son la moneda: valen lo mismo en todas partes.
    expect(
      precioBaseLocalMil(base('maravedis'), comarcaCon({ labor: 5 }), 'maravedis', MERCADO),
    ).toBe(base('maravedis'));
  });

  it('en los dos extremos de cada recurso: donde no hay es caro y donde sobra es barato', () => {
    for (const recurso of RECURSOS) {
      const potencial = MERCADO.potencialDeRecurso[recurso];
      if (potencial === undefined) continue;
      const sinNada = precioBaseLocalMil(base(recurso), comarcaCon({}), recurso, MERCADO);
      const aRebosar = precioBaseLocalMil(
        base(recurso),
        comarcaCon({ [potencial]: 5 }),
        recurso,
        MERCADO,
      );
      expect(sinNada, recurso).toBe(Math.floor((base(recurso) * 1200) / 1000));
      expect(aRebosar, recurso).toBe(Math.floor((base(recurso) * 700) / 1000));
      // Lo que mueve el comercio: entre la salina y el secano hay un 70 % de diferencia.
      expect(sinNada / aRebosar, recurso).toBeCloseTo(1.714, 2);
    }
  });

  it('el nivel corriente es el precio del catalogo, y de ahi baja sin saltos', () => {
    const precios = [0, 1, 2, 3, 4, 5].map((nivel) =>
      precioBaseLocalMil(base('sal'), comarcaCon({ sal: nivel as NivelPotencial }), 'sal', MERCADO),
    );
    expect(precios[2]).toBe(base('sal'));
    for (let i = 1; i < precios.length; i += 1) {
      expect(precios[i], `nivel ${String(i)}`).toBeLessThan(precios[i - 1] ?? 0);
    }
  });

  it('sin comarca (una plaza que no se sabe donde cae) vale el precio del catalogo', () => {
    expect(precioBaseLocalMil(base('sal'), undefined, 'sal', MERCADO)).toBe(base('sal'));
  });

  it('es pura: el mismo catalogo da el mismo precio siempre', () => {
    const comarca = comarcaCon({ sal: 4, labor: 2 });
    const unas = [0, 1, 2].map(() => precioBaseLocalMil(base('sal'), comarca, 'sal', MERCADO));
    expect(new Set(unas).size).toBe(1);
  });

  it('la tabla tiene una entrada por nivel, de 0 a 5', () => {
    expect(MERCADO.abundanciaMil).toHaveLength(6);
    expect(MERCADO.abundanciaMil.every((f) => f > 0)).toBe(true);
  });
});
