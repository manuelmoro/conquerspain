// La guia (ficha T-127 §4): cada imagen que cita existe, cada captura se usa, el indice lleva a una
// seccion de verdad y ningun identificador se repite.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const html = readFileSync(fileURLToPath(new URL('../../guia/index.html', import.meta.url)), 'utf8');
const capturas = readdirSync(fileURLToPath(new URL('../../public/guia', import.meta.url))).filter(
  (f) => f.endsWith('.jpg'),
);

function todos(patron: RegExp): string[] {
  return [...html.matchAll(patron)].map((m) => m[1] ?? '');
}

describe('la guía', () => {
  it('cita solo capturas que existen, y usa todas las que hay', () => {
    const citadas = todos(/src="\/guia\/([^"]+)"/g);
    expect(citadas.length).toBeGreaterThan(20);
    expect(citadas.filter((c) => !capturas.includes(c))).toEqual([]);
    expect(capturas.filter((c) => !citadas.includes(c))).toEqual([]);
  });

  it('cada imagen dice lo que enseña', () => {
    const sinAlt = [...html.matchAll(/<img\b[^>]*>/g)]
      .map((m) => m[0])
      .filter((img) => !img.includes('class="logo"') && !/alt="[^"]{8,}"/.test(img));
    expect(sinAlt).toEqual([]);
  });

  it('el índice lleva a secciones que existen, y ningún id se repite', () => {
    const ids = todos(/\sid="([^"]+)"/g);
    expect(new Set(ids).size).toBe(ids.length);
    const enlaces = todos(/href="#([^"]+)"/g);
    expect(enlaces.length).toBeGreaterThan(15);
    expect(enlaces.filter((e) => !ids.includes(e))).toEqual([]);
  });

  it('deja el hueco donde se pintan las casas y carga su script', () => {
    expect(html).toContain('id="fichas-de-casas"');
    expect(html).toContain('src="/src/guia/guia.ts"');
  });
});
