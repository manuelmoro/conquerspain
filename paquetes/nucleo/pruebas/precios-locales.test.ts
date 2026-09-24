// El precio base de una comarca (ficha T-052 §4.1): lo que sobra alli vale menos y lo que no hay
// cuesta mas traerlo. Es una funcion pura del catalogo: mismo mundo, mismo precio, siempre.
import { describe, expect, it } from 'vitest';

import { MERCADO } from '../src/datos/mercado.ts';
import { MOVIMIENTO } from '../src/datos/movimiento.ts';
import { DATOS_DE_RECURSOS } from '../src/datos/recursos.ts';
import { factorAlcanzadoMil, precioBaseLocalMil } from '../src/reglas/precios.ts';
import type { ComarcaMundo, NivelPotencial, Potencial } from '../src/tipos/mundo.ts';
import { POTENCIALES } from '../src/tipos/mundo.ts';
import type { IdComarca } from '../src/tipos/ids.ts';
import { RECURSOS } from '../src/tipos/recursos.ts';

/** Una comarca de mentira con los potenciales que se digan: aqui solo se miran esos. */
function comarcaCon(
  potenciales: Partial<Record<Potencial, NivelPotencial>>,
  id = 'inventada',
): ComarcaMundo {
  const llenos = Object.fromEntries(POTENCIALES.map((p) => [p, potenciales[p] ?? 0])) as Record<
    Potencial,
    NivelPotencial
  >;
  return {
    id: id as IdComarca,
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

describe('el factor que alcanza una plaza (T-057)', () => {
  const { abundanciaMil, recargoPorJornadaMil, techoDeLejaniaMil } = MERCADO;

  /** Un mapa de comarcas con su nivel de sal, y las jornadas desde la plaza hasta cada una. */
  function factorDeSal(fuentes: readonly [string, NivelPotencial, number][]): number {
    const comarcas = Object.fromEntries(
      fuentes.map(([id, nivel]) => [id, comarcaCon({ sal: nivel }, id)]),
    );
    const jornadas = new Map(fuentes.map(([id, , lejos]) => [id, lejos]));
    return factorAlcanzadoMil('sal', jornadas, comarcas, MERCADO);
  }

  it('en la fuente vale lo que dice su abundancia', () => {
    expect(factorDeSal([['salina', 5, 0]])).toBe(abundanciaMil[5]);
    expect(factorDeSal([['salina', 1, 0]])).toBe(abundanciaMil[1]);
  });

  it('cada jornada de camino suma el recargo, y los trozos de jornada tambien', () => {
    expect(recargoPorJornadaMil).toBe(200);
    expect(factorDeSal([['salina', 5, 1000]])).toBe(700 + 200);
    expect(factorDeSal([['salina', 5, 2500]])).toBe(700 + 500);
    // 1,8 jornadas suman 360; una milesima de jornada no llega a una milesima de precio.
    expect(factorDeSal([['salina', 5, 1800]])).toBe(700 + 360);
    expect(factorDeSal([['salina', 5, 4]])).toBe(700);
  });

  it('manda la fuente mas barata puesta en la plaza, no la mas cercana', () => {
    // Una salina pequenya al lado (110 % + 20 %) pierde frente a una grande a jornada y media
    // (70 % + 30 %); a tres jornadas, la grande ya no compensa (70 % + 60 %).
    expect(
      factorDeSal([
        ['pequenya', 1, 1000],
        ['grande', 5, 1500],
      ]),
    ).toBe(1000);
    expect(
      factorDeSal([
        ['pequenya', 1, 1000],
        ['grande', 5, 3000],
      ]),
    ).toBe(1300);
  });

  it('nunca pasa del techo, que es tambien el precio donde no llega ninguna fuente', () => {
    expect(techoDeLejaniaMil).toBe(2000);
    expect(factorDeSal([['salina', 5, 10000]])).toBe(2000);
    expect(factorDeSal([['secano', 0, 0]])).toBe(2000);
    expect(factorDeSal([])).toBe(2000);
  });

  it('una comarca sin el potencial no es fuente, aunque este en la plaza', () => {
    expect(
      factorDeSal([
        ['secano', 0, 0],
        ['salina', 4, 2000],
      ]),
    ).toBe(800 + 400);
  });

  it('el precio base de la plaza es el del catalogo por ese factor', () => {
    const plaza = comarcaCon({});
    expect(precioBaseLocalMil(base('sal'), plaza, 'sal', MERCADO, 1260)).toBe(
      Math.floor((base('sal') * 1260) / 1000),
    );
  });
});

describe('la distancia paga el camino (guarda de T-057)', () => {
  it('una carga de sal o de hierro gana por jornada mas de lo que come la recua, ida y vuelta', () => {
    // Lo que come una recua por jornada, repartido entre sus cargas y contando la vuelta en vacio:
    // si esto supera a lo que gana la mercancia, el comercio es imposible por construccion, que es
    // lo que midio T-056 con los escalones de T-054 (0,47 maravedis frente a 1,2).
    const comePorCargaYJornadaMil =
      (2 * MOVIMIENTO.bastimentoPorJornada * base('pan')) /
      (MOVIMIENTO.acemilasPorRecua * MOVIMIENTO.portePorAcemila);
    for (const recurso of ['sal', 'hierro'] as const) {
      const ganaPorJornadaMil = (MERCADO.recargoPorJornadaMil * base(recurso)) / 1000;
      expect(ganaPorJornadaMil, recurso).toBeGreaterThan(comePorCargaYJornadaMil);
    }
  });
});
