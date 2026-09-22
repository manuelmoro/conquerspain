// Los planes de los ocho robots son solventes (ficha T-050 §4.1.6) en todos los perfiles de origen
// que el sorteo puede dar a su casa: la muestra es la misma de la prueba de viabilidad, el primer
// origen de cada perfil en orden de identificador, sin escoger el que convenga.
import { describe, expect, it } from 'vitest';

import { CASAS, TABLAS_DEL_JUEGO, comparar, origenesPosibles, perfilDe } from '@conquer/nucleo';
import type { Casa, ComarcaMundo } from '@conquer/nucleo';

import { mundoPeninsula } from './partida.ts';
import { ESTRATEGIAS } from './robots/index.ts';
import { problemasDelPlan } from './solvencia.ts';

const REGLAS = TABLAS_DEL_JUEGO;
const MUNDO = mundoPeninsula();

function muestraDe(casa: Casa): ComarcaMundo[] {
  const porPerfil = new Map<string, ComarcaMundo>();
  for (const comarca of [...origenesPosibles(MUNDO, casa, REGLAS)].sort((a, b) =>
    comparar(a.id, b.id),
  )) {
    const perfil = perfilDe(comarca);
    if (!porPerfil.has(perfil)) porPerfil.set(perfil, comarca);
  }
  return [...porPerfil.values()];
}

describe('los planes de los robots son solventes', () => {
  it.each(CASAS.map((casa) => [casa]))(
    '%s: el plan de la capital cabe y tiene de donde sacar lo que consume',
    (casa) => {
      const problemas = muestraDe(casa).flatMap((comarca) =>
        problemasDelPlan(casa, comarca, REGLAS).map(
          (p) => `${comarca.id} (${perfilDe(comarca)}): ${p}`,
        ),
      );
      expect(problemas).toEqual([]);
    },
    120_000,
  );

  it('la prueba ve un plan mal ordenado y un insumo sin fuente', () => {
    // Bilbao arranca con granja y dos lonjas. Un plan que las quiere conservar (estan en el plan, no
    // se derriban) y pone la cantera delante de la ferreria deja a la ferreria sin solar.
    const bilbao = MUNDO.comarcas['bilbao'];
    if (bilbao === undefined) throw new Error('falta Bilbao en el mundo');
    const suyo = ESTRATEGIAS.ferrones.perfil;
    const conLonjas = {
      ...suyo,
      capital: [
        ['lonja', 2],
        ['cantera', 1],
        ['mercado', 1],
        ['aserradero', 1],
        ['carbonera', 1],
        ['ferreria', 1],
      ] as const,
    };
    expect(problemasDelPlan('ferrones', bilbao, REGLAS, conLonjas)).toContainEqual(
      expect.stringContaining('sin-solar'),
    );
    // Con el plan de verdad, las lonjas sin sal se derriban y la cadena del hierro cabe.
    expect(problemasDelPlan('ferrones', bilbao, REGLAS)).toEqual([]);
    // Sin mercado nadie compra la madera que se come la carbonera.
    const sinMercado = { ...suyo, capital: [['carbonera', 1]] as const, esenciales: [] };
    expect(problemasDelPlan('ferrones', bilbao, REGLAS, sinMercado)).toContainEqual(
      'carbonera consume madera y ni lo produce el plan ni lo compra',
    );
  });
});
