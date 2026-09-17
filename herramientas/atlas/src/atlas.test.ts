import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import type { Mundo } from '@conquer/nucleo';
import { explicar } from '@conquer/nucleo';
import { cargarMundo } from '@conquer/mundo';

import { CACHE, fuentes } from './descargar.ts';
import { RUTA_INFORME, RUTA_MUNDO, comprobar, generarMundo, textoDelMundo } from './generar.ts';
import type { Punto } from './geometria.ts';
import {
  area,
  centroide,
  dentroDelPoligono,
  porcionSobreTierra,
  recortarATierra,
  simplificar,
} from './geometria.ts';
import { ALTO, ANCHO, aKilometros, proyectar, redondear } from './proyeccion.ts';
import { terrenoDe, terrenoDeTramo } from './terreno.ts';

const hayCache = fuentes().every((fuente) => existsSync(join(CACHE, fuente.archivo)));
const cuadrado: Punto[] = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
];

describe('proyeccion', () => {
  it('coloca el noroeste en el origen y respeta el tamanyo del mapa', () => {
    expect(redondear(proyectar(-9.6, 43.85))).toEqual([0, 0]);
    expect(ANCHO).toBe(997);
    expect(ALTO).toBe(800);
    expect(aKilometros(1)).toBeCloseTo(1.11, 2);
  });

  it('situa Soria donde le toca', () => {
    const [x, y] = redondear(proyectar(-2.46, 41.76));
    expect(x).toBeGreaterThan(500);
    expect(x).toBeLessThan(600);
    expect(y).toBeGreaterThan(190);
    expect(y).toBeLessThan(230);
  });
});

describe('geometria', () => {
  it('mide areas y centroides', () => {
    expect(area(cuadrado)).toBe(10000);
    expect(centroide(cuadrado)).toEqual([50, 50]);
  });

  it('sabe si un punto esta dentro', () => {
    expect(dentroDelPoligono([50, 50], cuadrado)).toBe(true);
    expect(dentroDelPoligono([150, 50], cuadrado)).toBe(false);
  });

  it('simplifica sin llevarse la figura por delante, tambien con anillos cerrados', () => {
    const escalera: Punto[] = [];
    for (let i = 0; i <= 100; i += 1) escalera.push([i, i % 2 === 0 ? 0 : 0.2]);
    expect(simplificar(escalera, 0.5).length).toBeLessThan(10);

    // Un anillo cerrado repite el primer punto al final: ahi estaba el fallo que borraba la costa.
    const cerrado: Punto[] = [...cuadrado, [0, 0]];
    const simple = simplificar(cerrado, 0.7);
    expect(simple.length).toBeGreaterThanOrEqual(4);
    expect(area(simple)).toBeCloseTo(10000, 0);
  });

  it('recorta una celda a la tierra y se queda con el trozo mayor', () => {
    const celda: Punto[] = [
      [50, 50],
      [150, 50],
      [150, 150],
      [50, 150],
    ];
    const recorte = recortarATierra(celda, [cuadrado]);
    expect(recorte).not.toBeNull();
    expect(area(recorte?.poligono ?? [])).toBeCloseTo(2500, 0);
    expect(
      recortarATierra(
        [
          [500, 500],
          [600, 500],
          [600, 600],
        ],
        [cuadrado],
      ),
    ).toBeNull();
  });

  it('mide que parte de un tramo va por tierra', () => {
    expect(porcionSobreTierra([10, 50], [90, 50], [cuadrado])).toBe(1000);
    expect(porcionSobreTierra([10, 50], [400, 50], [cuadrado])).toBeLessThan(400);
  });
});

describe('terreno', () => {
  it('reconoce las zonas del relieve', () => {
    expect(
      terrenoDe(-2.5, 42.0, [{ terreno: 'sierra', nombre: 'x', caja: [-3.2, -0.7, 40.2, 42.3] }]),
    ).toBe('sierra');
    expect(
      terrenoDe(-5.0, 39.0, [{ terreno: 'sierra', nombre: 'x', caja: [-3.2, -0.7, 40.2, 42.3] }]),
    ).toBe('llano');
  });

  it('en un tramo manda el terreno mas duro', () => {
    expect(terrenoDeTramo('llano', 'sierra')).toBe('sierra');
    expect(terrenoDeTramo('vega', 'ondulado')).toBe('ondulado');
  });
});

describe('comprobaciones del mapa', () => {
  function mundoDePrueba(cambios: Partial<Mundo> = {}): Mundo {
    const base = {
      version: 'v1',
      comarcas: {},
      caminos: [],
      vecinos: {},
      ...cambios,
    };
    return base;
  }

  it('avisa si el mapa tiene un numero de comarcas fuera de lo esperable', () => {
    const problemas = comprobar(mundoDePrueba(), new Map());
    expect(problemas.join('\n')).toMatch(/0 comarcas/);
  });

  it('avisa de comarcas sin vecinos y de un grafo partido', () => {
    const mundo = cargarMundo(RUTA_MUNDO);
    if (!mundo.ok) throw new Error(explicar(mundo.errores));
    const ids = Object.keys(mundo.valor.comarcas);
    const primera = ids[0] ?? '';
    const roto = mundoDePrueba({
      comarcas: mundo.valor.comarcas,
      caminos: mundo.valor.caminos,
      vecinos: { ...mundo.valor.vecinos, [primera]: [] },
    });
    const problemas = comprobar(roto, new Map()).join('\n');
    expect(problemas).toMatch(new RegExp(`${primera}: se ha quedado sin vecinos`));
  });
});

describe('el mundo generado', () => {
  it('existe, valida y tiene el tamanyo esperado', () => {
    const mundo = cargarMundo(RUTA_MUNDO);
    expect(explicar(mundo.ok ? [] : mundo.errores)).toBe('');
    if (!mundo.ok) return;
    const comarcas = Object.keys(mundo.valor.comarcas).length;
    expect(comarcas).toBeGreaterThanOrEqual(300);
    expect(comarcas).toBeLessThanOrEqual(380);
    expect(mundo.valor.caminos.length).toBeGreaterThan(comarcas);
  });

  it('tiene todas sus coordenadas enteras', () => {
    const mundo = cargarMundo(RUTA_MUNDO);
    if (!mundo.ok) throw new Error(explicar(mundo.errores));
    for (const comarca of Object.values(mundo.valor.comarcas)) {
      for (const punto of comarca.poligono) {
        expect(Number.isInteger(punto[0]) && Number.isInteger(punto[1])).toBe(true);
      }
    }
  });

  it('su grafo es conexo', () => {
    const mundo = cargarMundo(RUTA_MUNDO);
    if (!mundo.ok) throw new Error(explicar(mundo.errores));
    const ids = Object.keys(mundo.valor.comarcas);
    const vistos = new Set<string>();
    const pila = ids.slice(0, 1);
    while (pila.length > 0) {
      const actual = pila.pop();
      if (actual === undefined || vistos.has(actual)) continue;
      vistos.add(actual);
      for (const vecino of mundo.valor.vecinos[actual] ?? []) pila.push(vecino);
    }
    expect(vistos.size).toBe(ids.length);
  });

  it('el informe cuenta lo que hay', () => {
    const informe = readFileSync(RUTA_INFORME, 'utf8');
    expect(informe).toMatch(/# Informe del atlas/);
    expect(informe).toMatch(/## Comarcas por región/);
    expect(informe).toMatch(/## Vecindades extremas/);
  });
});

describe.skipIf(!hayCache)('generacion completa (necesita la cache de fuentes)', () => {
  it('dos ejecuciones seguidas producen el mismo mundo', async () => {
    const una = await generarMundo();
    const otra = await generarMundo();
    expect(textoDelMundo(una.mundo)).toBe(textoDelMundo(otra.mundo));
    expect(una.avisos).toEqual(otra.avisos);
  }, 120000);

  it('lo generado coincide con el fichero del repositorio', async () => {
    const { mundo } = await generarMundo();
    expect(textoDelMundo(mundo)).toBe(readFileSync(RUTA_MUNDO, 'utf8'));
  }, 120000);
});
