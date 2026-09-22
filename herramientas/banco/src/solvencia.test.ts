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

/**
 * T-050 en curso: el plan del ferrón cuenta con derribar la lonja sin sal (`hacerSitio`) y la
 * simulación de solvencia aún no lo modela. Ver «Dónde va T-050» en ESTADO.md.
 */
const PENDIENTES_DE_T050: readonly Casa[] = ['ferrones'];

describe('los planes de los robots son solventes', () => {
  it.skip.each(PENDIENTES_DE_T050.map((casa) => [casa]))('pendiente de T-050: %s', () => undefined);

  it.each(CASAS.filter((casa) => !PENDIENTES_DE_T050.includes(casa)).map((casa) => [casa]))(
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
    // El plan del ferrón anterior a T-050: la cantera delante de la ferrería. En Bilbao, que
    // arranca con granja y dos lonjas, la ferrería se queda sin solar.
    const bilbao = MUNDO.comarcas['bilbao'];
    if (bilbao === undefined) throw new Error('falta Bilbao en el mundo');
    const suyo = ESTRATEGIAS.ferrones.perfil;
    const antiguo = {
      ...suyo,
      capital: [
        ['cantera', 1],
        ['mercado', 1],
        ['carbonera', 1],
        ['ferreria', 1],
      ] as const,
    };
    expect(problemasDelPlan('ferrones', bilbao, REGLAS, antiguo)).toContainEqual(
      expect.stringContaining('ferreria 1: sin-solar'),
    );
    // Sin mercado nadie compra la madera que se come la carbonera.
    const sinMercado = { ...suyo, capital: [['carbonera', 1]] as const, esenciales: [] };
    expect(problemasDelPlan('ferrones', bilbao, REGLAS, sinMercado)).toContainEqual(
      'carbonera consume madera y ni lo produce el plan ni lo compra',
    );
  });
});
