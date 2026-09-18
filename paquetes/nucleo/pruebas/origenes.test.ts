// El sorteo de origen (T-041, docs/04 §4.2): filtra por casa, ofrece tres perfiles distintos y es
// reproducible. Se prueba con el mundo real: es donde de verdad tiene que haber tres para cada casa.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

import { CASAS_DE_OFICIO } from '../src/datos/casas.ts';
import { origenesPosibles, perfilDe, sortearOrigenes } from '../src/reglas/casas/origenes.ts';
import type { ComarcaMundo, Mundo } from '../src/tipos/mundo.ts';
import type { Casa, TablasDeReglas } from '../src/tipos/reglas.ts';
import { CASAS } from '../src/tipos/reglas.ts';
import { validarMundo } from '../src/validacion/validarMundo.ts';
import { reglas } from './recuas.ts';

const REAL: TablasDeReglas = { ...reglas, casas: CASAS_DE_OFICIO };
const RUTA = fileURLToPath(new URL('../../mundo/datos/mundo.v1.json', import.meta.url));

let mundo: Mundo;
beforeAll(() => {
  const resultado = validarMundo(JSON.parse(readFileSync(RUTA, 'utf8')) as unknown);
  if (!resultado.ok)
    throw new Error(`el mundo real no valida: ${JSON.stringify(resultado.errores)}`);
  mundo = resultado.valor;
});

const comarca = (id: string): ComarcaMundo => {
  const encontrada = mundo.comarcas[id];
  if (encontrada === undefined) throw new Error(`falta ${id}`);
  return encontrada;
};

/** Lo que pide cada casa, escrito otra vez y a mano, sin pasar por la tabla. */
const PIDE: Readonly<Record<Casa, (c: ComarcaMundo) => boolean>> = {
  mesta: (c) => c.potenciales.pasto >= 3,
  ferrones: (c) =>
    c.potenciales.hierro >= 1 ||
    (mundo.vecinos[c.id] ?? []).some((v) => comarca(v).potenciales.hierro >= 2),
  canteros: (c) => c.potenciales.piedra >= 3,
  mercaderes: (c) => c.rasgos.includes('villa-de-feria') || c.rasgos.includes('puerto-de-mar'),
  monjes: (c) => c.potenciales.labor >= 4,
  salineros: (c) => c.potenciales.sal >= 2 || c.potenciales.pesca >= 3,
  arrieros: (c) => c.rasgos.includes('camino-de-santiago') || c.rasgos.includes('calzada-romana'),
  hortelanos: (c) => c.terreno === 'vega' || c.rasgos.includes('vega-fluvial'),
};

describe('los orígenes posibles', () => {
  it.each(CASAS)('a %s solo se le ofrecen orígenes que le sirven, y hay de sobra', (casa) => {
    const posibles = origenesPosibles(mundo, casa, REAL);
    expect(posibles.length).toBeGreaterThanOrEqual(3);
    expect(posibles.every((c) => c.esOrigen && PIDE[casa](c))).toBe(true);
    // Y no se deja fuera ninguno que sirva.
    const todos = Object.values(mundo.comarcas).filter((c) => c.esOrigen && PIDE[casa](c));
    expect(posibles.map((c) => c.id).sort()).toEqual(todos.map((c) => c.id).sort());
  });

  it('cada casa tiene un filtro distinto: no todas ven los mismos orígenes', () => {
    const conjuntos = CASAS.map((casa) =>
      origenesPosibles(mundo, casa, REAL)
        .map((c) => c.id)
        .join(','),
    );
    expect(new Set(conjuntos).size).toBe(CASAS.length);
  });

  it('a los ferrones no se les ofrece una comarca sin hierro cerca', () => {
    for (const id of origenesPosibles(mundo, 'ferrones', REAL).map((c) => c.id)) {
      expect(PIDE.ferrones(comarca(id))).toBe(true);
    }
  });
});

describe('el perfil de una comarca', () => {
  it('es el potencial que más destaca y, a igualdad, el primero de la lista', () => {
    const base = comarca(origenesPosibles(mundo, 'mesta', REAL)[0]?.id ?? '');
    const con = (potenciales: Record<string, number>): ComarcaMundo => ({
      ...base,
      potenciales: {
        labor: 0,
        monte: 0,
        pasto: 0,
        piedra: 0,
        hierro: 0,
        sal: 0,
        pesca: 0,
        ...potenciales,
      },
    });
    expect(perfilDe(con({ hierro: 4, labor: 2 }))).toBe('hierro');
    expect(perfilDe(con({ sal: 3, pesca: 3 }))).toBe('sal');
    expect(perfilDe(con({}))).toBe('labor');
  });
});

describe('el sorteo', () => {
  it.each(CASAS)(
    'a %s le da tres orígenes distintos, de los que le sirven y de perfiles distintos',
    (casa) => {
      const elegidos = sortearOrigenes(mundo, casa, 'semilla-de-prueba', REAL);
      expect(elegidos).toHaveLength(3);
      expect(new Set(elegidos).size).toBe(3);
      expect(elegidos.every((id) => PIDE[casa](comarca(id)))).toBe(true);
      // Tres perfiles distintos siempre que la casa tenga tres perfiles entre los que elegir.
      const perfilesPosibles = new Set(origenesPosibles(mundo, casa, REAL).map(perfilDe));
      const perfiles = new Set(elegidos.map((id) => perfilDe(comarca(id))));
      expect(perfiles.size).toBe(Math.min(3, perfilesPosibles.size));
    },
  );

  it('es reproducible: la misma partida y la misma casa dan siempre las mismas tres', () => {
    for (const casa of CASAS) {
      expect(sortearOrigenes(mundo, casa, 'una', REAL)).toEqual(
        sortearOrigenes(mundo, casa, 'una', REAL),
      );
    }
  });

  it('otra semilla da otras opciones, y otra casa, otro sorteo', () => {
    const resultados = new Set(
      Array.from({ length: 40 }, (_, i) =>
        sortearOrigenes(mundo, 'monjes', `semilla-${String(i)}`, REAL).join(','),
      ),
    );
    expect(resultados.size).toBeGreaterThan(10);
    expect(sortearOrigenes(mundo, 'monjes', 'x', REAL)).not.toEqual(
      sortearOrigenes(mundo, 'hortelanos', 'x', REAL),
    );
  });

  it('no depende del orden de las claves del mundo', () => {
    const alReves: Mundo = {
      ...mundo,
      comarcas: Object.fromEntries(Object.entries(mundo.comarcas).reverse()),
    };
    for (const casa of CASAS) {
      expect(sortearOrigenes(alReves, casa, 'semilla', REAL)).toEqual(
        sortearOrigenes(mundo, casa, 'semilla', REAL),
      );
    }
  });

  it('si a la casa le sirven menos de tres, da las que hay; y con `cuantos` da las que se pidan', () => {
    const pocos: TablasDeReglas = {
      ...REAL,
      casas: {
        ...REAL.casas,
        canteros: {
          ...REAL.casas.canteros,
          origenes: [
            { potenciales: { piedra: 3 }, rasgos: [], terrenos: [], vecinaConPotencial: null },
          ],
        },
      },
    };
    expect(sortearOrigenes(mundo, 'canteros', 's', pocos, 2)).toHaveLength(2);
    expect(sortearOrigenes(mundo, 'canteros', 's', pocos, 10).length).toBeLessThanOrEqual(10);
    const nada: TablasDeReglas = {
      ...REAL,
      casas: {
        ...REAL.casas,
        canteros: {
          ...REAL.casas.canteros,
          origenes: [
            { potenciales: { piedra: 5 }, rasgos: [], terrenos: [], vecinaConPotencial: null },
          ],
        },
      },
    };
    expect(sortearOrigenes(mundo, 'canteros', 's', nada)).toEqual([]);
  });
});
