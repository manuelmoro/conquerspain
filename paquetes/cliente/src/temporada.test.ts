// Temporadas en el cliente (T-104): la cabecera, el mejor capitulo de cada uno y el cierre en palabras.
import type { ClasificacionPublica, FilaDeClasificacion, IdJugador } from '@conquer/nucleo';
import { describe, expect, it } from 'vitest';

import { animo, lineasDeCierre, mejorCapitulo } from './temporada.ts';

const CERO = {
  poblacion: 0,
  territorio: 0,
  obras: 0,
  caminos: 0,
  comercio: 0,
  exploracion: 0,
  ganaderia: 0,
  industria: 0,
  hitos: 0,
};

function fila(
  jugador: string,
  puesto: number,
  capitulos: Partial<typeof CERO>,
): FilaDeClasificacion {
  return {
    jugador: jugador as IdJugador,
    nombre: jugador,
    casa: 'mesta',
    puesto,
    puestoAnterior: null,
    prestigio: 100 - puesto,
    capitulos: { ...CERO, ...capitulos },
    penalizaciones: 0,
    primicias: [],
  };
}

const c: ClasificacionPublica = {
  turno: 10,
  filas: [
    fila('ana', 1, { poblacion: 50, obras: 120 }),
    fila('beto', 2, { poblacion: 40, obras: 20, comercio: 30 }),
    fila('ceci', 3, { poblacion: 10, obras: 30 }),
  ],
  misHitos: [],
  porLograr: [],
};

describe('la clasificación que informa sin desanimar', () => {
  it('cada uno ve su mejor capítulo, aunque vaya último en el total', () => {
    expect(mejorCapitulo(c, 'beto')).toEqual({ capitulo: 'comercio', puesto: 1, faltan: 0 });
    expect(mejorCapitulo(c, 'ceci')).toEqual({ capitulo: 'obras', puesto: 2, faltan: 90 });
    expect(animo(c, 'ceci')).toBe('Vas 2.º en obras: te faltan 90 para alcanzar al de delante.');
    expect(animo(c, 'beto')).toBe('Vas primero en comercio.');
  });

  it('el cierre: podio y reconocimientos con nombres', () => {
    const lineas = lineasDeCierre(
      {
        turno: 240,
        clasificacion: [
          { jugador: 'ana' as IdJugador, puesto: 1, puestoAnterior: 1, prestigio: 900 },
          { jugador: 'beto' as IdJugador, puesto: 2, puestoAnterior: 2, prestigio: 700 },
        ],
        reconocimientos: [{ reconocimiento: 'comercio', jugador: 'beto' as IdJugador, valor: 30 }],
      },
      (id) => id.toUpperCase(),
    );
    expect(lineas).toEqual([
      '1.º ANA, con 900 de prestigio',
      '2.º BETO, con 700 de prestigio',
      'Mejor comerciante: BETO (30)',
    ]);
  });
});
