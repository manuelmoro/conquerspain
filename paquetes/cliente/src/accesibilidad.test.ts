// Accesibilidad del cliente (ficha T-087, criterios 1 a 3): contraste AA de cada par de texto y fondo
// que usa la hoja de estilos, botones de icono con nombre, todo el mapa en lista, y la barra de movil.
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import type { AtlasDeJugador, ComarcaEnAtlas, IdComarca } from '@conquer/nucleo';

import { comarcasEnLista, etiquetaDeIcono, textoDeLaBarra } from './accesibilidad.ts';

const CSS = readFileSync(new URL('./estilo.css', import.meta.url), 'utf8');

/** Los colores con nombre de la hoja (sus variables) y los fondos fijos que usa. */
function color(nombre: string): string {
  const fijos: Record<string, string> = {
    blanco: '#ffffff',
    etiqueta: '#e8dfc9',
    aviso: '#fff3c4',
    error: '#fbe4e2',
  };
  const fijo = fijos[nombre];
  if (fijo !== undefined) {
    expect(CSS, `la hoja ya no usa ${fijo}`).toContain(fijo === '#ffffff' ? 'white' : fijo);
    return fijo;
  }
  const encontrado = new RegExp(`--${nombre}:\\s*(#[0-9a-fA-F]{6})`).exec(CSS)?.[1];
  if (encontrado === undefined) throw new Error(`falta --${nombre} en estilo.css`);
  return encontrado;
}

function luminancia(hex: string): number {
  const canal = (i: number): number => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(0) + 0.7152 * canal(1) + 0.0722 * canal(2);
}

function contraste(a: string, b: string): number {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return ((claro ?? 0) + 0.05) / ((oscuro ?? 0) + 0.05);
}

/** Cada texto sobre cada fondo en que sale (AA pide 4,5:1 para texto normal). */
const PARES: readonly (readonly [string, string])[] = [
  ['tinta', 'papel'],
  ['tinta', 'papel-claro'],
  ['tinta', 'blanco'],
  ['tinta', 'aviso'],
  ['tinta', 'etiqueta'],
  ['tinta-suave', 'papel'],
  ['tinta-suave', 'papel-claro'],
  ['tinta-suave', 'blanco'],
  ['tinta-suave', 'etiqueta'],
  ['cobalto', 'papel'],
  ['cobalto', 'papel-claro'],
  ['cobalto', 'blanco'],
  ['blanco', 'cobalto'],
  ['rojo', 'error'],
  ['rojo', 'blanco'],
  ['rojo', 'papel-claro'],
  ['verde', 'blanco'],
  ['verde', 'papel-claro'],
];

describe('el contraste (criterio 1)', () => {
  it('cada par de texto y fondo llega a AA (4,5:1)', () => {
    for (const [texto, fondo] of PARES) {
      const r = contraste(color(texto), color(fondo));
      expect(r, `${texto} sobre ${fondo}: ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('ningún texto se apaga con opacity, y el foco se ve', () => {
    expect(CSS).not.toMatch(/opacity:\s*0?\.\d/);
    expect(CSS).toMatch(/:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--cobalto\)/);
    expect(CSS).toMatch(/prefers-reduced-motion:\s*reduce/);
  });
});

describe('sin mapa y con una mano (criterios 2 y 3)', () => {
  it('los botones de icono tienen nombre', () => {
    expect(etiquetaDeIcono('✕')).toBe('Cerrar');
    expect(etiquetaDeIcono('↑')).toBe('Subir');
    expect(etiquetaDeIcono('Dar la orden')).toBeNull();
  });

  it('las comarcas conocidas en lista: propias, exploradas y oídas, cada grupo por nombre', () => {
    const c = (id: string, nivel: ComarcaEnAtlas['nivel']): ComarcaEnAtlas => ({
      id: id as IdComarca,
      nivel,
      nombre: id,
      poligono: [],
      centro: [0, 0],
      terreno: null,
      potenciales: null,
      feria: false,
      duenyo: null,
    });
    const atlas: AtlasDeJugador = {
      comarcas: [
        c('Zamora', 'oida'),
        c('Ávila', 'explorada'),
        c('Burgos', 'propia'),
        c('Aranda', 'propia'),
      ],
      niebla: [],
      tramos: [],
    };
    expect(comarcasEnLista(atlas).map((x) => x.id)).toEqual([
      'Aranda',
      'Burgos',
      'Ávila',
      'Zamora',
    ]);
  });

  it('la barra de abajo dice cuántas órdenes y el corte', () => {
    expect(textoDeLaBarra(0, 'faltan 5 h')).toBe('Sin órdenes · faltan 5 h');
    expect(textoDeLaBarra(1, 'faltan 5 h')).toBe('1 orden · faltan 5 h');
    expect(textoDeLaBarra(3, 'faltan 2 d')).toBe('3 órdenes · faltan 2 d');
  });
});
