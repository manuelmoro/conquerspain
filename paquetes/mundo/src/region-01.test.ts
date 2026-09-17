// Revision de la region 01 (T-012 §4.4): lo que un humano miraria antes de dar la region por
// buena, escrito como test para que siga mirandose solo cuando lleguen las demas regiones.
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import type { Mundo } from '@conquer/nucleo';
import { explicar } from '@conquer/nucleo';

import { cargarCatalogo, cargarMundo } from './cargador.ts';
import type { ComarcaCatalogo } from './tipos.ts';

const CATALOGO = fileURLToPath(new URL('../catalogo', import.meta.url));
const MUNDO = fileURLToPath(new URL('../datos/mundo.v1.json', import.meta.url));
const REGION = '01-iberico-alto-duero';

function comarcasDeLaRegion(): ComarcaCatalogo[] {
  const resultado = cargarCatalogo(CATALOGO);
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  return resultado.valor.filter((comarca) => comarca.region === REGION);
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

describe('catalogo de la region 01 · Sistema Iberico y Alto Duero', () => {
  it('tiene las 35 comarcas escritas y todas con su criterio anotado', () => {
    const comarcas = comarcasDeLaRegion();
    expect(comarcas).toHaveLength(35);
    const sinNota = comarcas.filter((comarca) => comarca.nota === null).map((c) => c.id);
    expect(sinNota).toEqual([]);
  });

  it('reparte la sal y el hierro solo donde los hubo', () => {
    const comarcas = comarcasDeLaRegion();
    const conSal = comarcas.filter((c) => c.potenciales.sal >= 3).map((c) => c.id);
    const conHierro = comarcas.filter((c) => c.potenciales.hierro >= 3).map((c) => c.id);
    expect(conSal.sort()).toEqual(['bureba', 'siguenza']);
    expect(conHierro.sort()).toEqual(['jiloca', 'senyorio-de-molina']);
  });

  it('ofrece entre tres y seis origenes, y de perfiles distintos', () => {
    const origenes = comarcasDeLaRegion().filter((comarca) => comarca.esOrigen);
    expect(origenes.length).toBeGreaterThanOrEqual(3);
    expect(origenes.length).toBeLessThanOrEqual(6);
    // Un origen de cada oficio: sal, hierro, lana, huerta y plaza mercantil.
    expect(origenes.some((c) => c.potenciales.sal >= 3)).toBe(true);
    expect(origenes.some((c) => c.potenciales.hierro >= 3)).toBe(true);
    expect(origenes.some((c) => c.potenciales.pasto >= 4)).toBe(true);
    expect(origenes.some((c) => c.potenciales.labor >= 4)).toBe(true);
    expect(origenes.some((c) => c.poblacionInicial >= 100)).toBe(true);
  });

  it('no deja ninguna comarca sin un paraiso ni un erial', () => {
    for (const comarca of comarcasDeLaRegion()) {
      const suma = Object.values(comarca.potenciales).reduce<number>((total, n) => total + n, 0);
      expect(suma, comarca.id).toBeGreaterThanOrEqual(6);
      expect(suma, comarca.id).toBeLessThanOrEqual(18);
    }
  });
});

describe('la region 01 dentro del mundo generado', () => {
  it('deja a cada comarca con al menos dos vecinos', () => {
    const mundo = mundoGenerado();
    const pocos = Object.values(mundo.comarcas)
      .filter((comarca) => comarca.region === REGION)
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
          vecinos.length > 0 && vecinos.every((vecino) => mundo.comarcas[vecino]?.region === REGION)
        );
      })
      .map((comarca) => comarca.id);
    expect(huecos).toEqual([]);
  });

  it('nunca deja a nadie a mas de tres jornadas del pan', () => {
    const mundo = mundoGenerado();
    const saltos = saltosHastaElPan(mundo);
    const lejos = Object.values(mundo.comarcas)
      .filter((comarca) => comarca.region === REGION)
      .filter((comarca) => (saltos.get(comarca.id) ?? 99) > 3)
      .map((comarca) => comarca.id);
    expect(lejos).toEqual([]);
  });
});
