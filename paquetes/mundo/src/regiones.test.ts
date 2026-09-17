// Revision de las regiones escritas del catalogo (T-012 §4.4 y T-015 §4.6), como test: lo que
// antes se miraba a ojo en el informe se comprueba solo cada vez que entra una region nueva.
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import type { Mundo } from '@conquer/nucleo';
import { explicar } from '@conquer/nucleo';

import { cargarCatalogo, cargarMundo } from './cargador.ts';
import type { ComarcaCatalogo } from './tipos.ts';

const CATALOGO = fileURLToPath(new URL('../catalogo', import.meta.url));
const MUNDO = fileURLToPath(new URL('../datos/mundo.v1.json', import.meta.url));

/** Las regiones reales escritas hasta ahora. La 00 es el ejemplo del formato y no entra. */
const REGIONES = ['01-iberico-alto-duero', '02-meseta-norte', '03-cantabrico'] as const;

/**
 * Regiones a las que se les exige la proporcion de pan de T-015 §4.6 (una comarca de `labor 4`
 * por cada cinco). La 01 es el Sistema Iberico: sierra y paramo alto, donde esa proporcion seria
 * falsear la geografia. Para ella manda la regla de T-012: nadie a mas de tres jornadas del pan.
 */
const REGIONES_DE_LLANO = ['02-meseta-norte'] as const;

function catalogo(): ComarcaCatalogo[] {
  const resultado = cargarCatalogo(CATALOGO);
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  return resultado.valor;
}

function mundoGenerado(): Mundo {
  const resultado = cargarMundo(MUNDO);
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  return resultado.valor;
}

/** Saltos de camino hasta la comarca con pan (labor 3 o mas) mas cercana. */
function saltosHastaElPan(mundo: Mundo): Map<string, number> {
  const distancia = new Map<string, number>();
  let frente: string[] = [];
  for (const [id, comarca] of Object.entries(mundo.comarcas)) {
    if (comarca.potenciales.labor >= 3) {
      distancia.set(id, 0);
      frente.push(id);
    }
  }
  while (frente.length > 0) {
    const siguiente: string[] = [];
    for (const id of frente) {
      for (const vecino of mundo.vecinos[id] ?? []) {
        if (distancia.has(vecino)) continue;
        distancia.set(vecino, (distancia.get(id) ?? 0) + 1);
        siguiente.push(vecino);
      }
    }
    frente = siguiente;
  }
  return distancia;
}

describe.each(REGIONES)('catalogo de la region %s', (region) => {
  const comarcas = (): ComarcaCatalogo[] => catalogo().filter((c) => c.region === region);

  it('anota el criterio de cada comarca', () => {
    const sinNota = comarcas()
      .filter((comarca) => comarca.nota === null)
      .map((comarca) => comarca.id);
    expect(sinNota).toEqual([]);
  });

  it('no escribe ni un paraiso ni un erial', () => {
    for (const comarca of comarcas()) {
      const suma = Object.values(comarca.potenciales).reduce<number>((total, n) => total + n, 0);
      expect(suma, comarca.id).toBeGreaterThanOrEqual(6);
      expect(suma, comarca.id).toBeLessThanOrEqual(18);
    }
  });

  it('ofrece entre tres y ocho origenes', () => {
    const origenes = comarcas().filter((comarca) => comarca.esOrigen);
    expect(origenes.length).toBeGreaterThanOrEqual(3);
    expect(origenes.length).toBeLessThanOrEqual(8);
  });
});

describe.each(REGIONES_DE_LLANO)('el pan de la region %s', (region) => {
  it('tiene una comarca de labor 4 o mas por cada cinco', () => {
    const lista = catalogo().filter((comarca) => comarca.region === region);
    const conPan = lista.filter((comarca) => comarca.potenciales.labor >= 4);
    expect(conPan.length).toBeGreaterThanOrEqual(Math.ceil(lista.length / 5));
  });
});

describe.each(REGIONES)('la region %s dentro del mundo generado', (region) => {
  it('deja a cada comarca con al menos dos vecinos', () => {
    const mundo = mundoGenerado();
    const pocos = Object.values(mundo.comarcas)
      .filter((comarca) => comarca.region === region)
      .filter((comarca) => (mundo.vecinos[comarca.id] ?? []).length < 2)
      .map((comarca) => comarca.id);
    expect(pocos).toEqual([]);
  });

  it('no deja huecos provisionales dentro de la region', () => {
    const mundo = mundoGenerado();
    const huecos = Object.values(mundo.comarcas)
      .filter((comarca) => comarca.region === '99-provisional')
      .filter((comarca) => {
        const vecinos = mundo.vecinos[comarca.id] ?? [];
        return (
          vecinos.length > 0 && vecinos.every((vecino) => mundo.comarcas[vecino]?.region === region)
        );
      })
      .map((comarca) => comarca.id);
    expect(huecos).toEqual([]);
  });

  it('nunca deja a nadie a mas de tres jornadas del pan', () => {
    const mundo = mundoGenerado();
    const saltos = saltosHastaElPan(mundo);
    const lejos = Object.values(mundo.comarcas)
      .filter((comarca) => comarca.region === region)
      .filter((comarca) => (saltos.get(comarca.id) ?? 99) > 3)
      .map((comarca) => comarca.id);
    expect(lejos).toEqual([]);
  });
});

describe('recursos estrategicos region a region', () => {
  it('reparte la sal y el hierro del Iberico solo donde los hubo', () => {
    const iberico = catalogo().filter((c) => c.region === '01-iberico-alto-duero');
    expect(iberico).toHaveLength(35);
    expect(iberico.filter((c) => c.potenciales.sal >= 3).map((c) => c.id)).toEqual([
      'bureba',
      'siguenza',
    ]);
    expect(
      iberico
        .filter((c) => c.potenciales.hierro >= 3)
        .map((c) => c.id)
        .sort(),
    ).toEqual(['jiloca', 'senyorio-de-molina']);
  });

  it('junta en la cornisa el hierro, la sal de Anyana y la pesca', () => {
    const cornisa = catalogo().filter((c) => c.region === '03-cantabrico');
    expect(cornisa).toHaveLength(35);
    expect(cornisa.filter((c) => c.potenciales.sal >= 3).map((c) => c.id)).toEqual([
      'valles-alaveses',
    ]);
    expect(
      cornisa
        .filter((c) => c.potenciales.hierro >= 3)
        .map((c) => c.id)
        .sort(),
    ).toEqual(['bilbao', 'durangaldea', 'encartaciones', 'oiartzun-bidasoa', 'valle-de-mena']);
    // La mar es su despensa, y solo se pesca desde la costa.
    const conPesca = cornisa.filter((c) => c.potenciales.pesca >= 1);
    expect(conPesca.length).toBeGreaterThanOrEqual(12);
    expect(conPesca.every((c) => c.terreno === 'costa')).toBe(true);
    // Y no tiene pan: una sola comarca llega a labor 4, la Llanada alavesa.
    expect(cornisa.filter((c) => c.potenciales.labor >= 4).map((c) => c.id)).toEqual([
      'llanada-alavesa',
    ]);
  });

  it('en la Meseta norte la unica sal es la de las lagunas de Villafafila', () => {
    const meseta = catalogo().filter((c) => c.region === '02-meseta-norte');
    expect(meseta).toHaveLength(36);
    expect(meseta.filter((c) => c.potenciales.sal >= 3).map((c) => c.id)).toEqual([
      'campos-de-villalpando',
    ]);
    expect(meseta.filter((c) => c.potenciales.hierro >= 3)).toEqual([]);
    // El granero: la mitad de la region labra a 4 o mas.
    expect(meseta.filter((c) => c.potenciales.labor >= 4).length).toBeGreaterThanOrEqual(15);
  });
});
