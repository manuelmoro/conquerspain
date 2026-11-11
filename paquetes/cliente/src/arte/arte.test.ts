// El arte del cliente (ficha T-090, criterios 3 y 4): un emblema por casa, una vinyeta por perfil, y la
// peninsula de la portada al dia con el mundo.
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { CASAS, POTENCIALES } from '@conquer/nucleo';

import { EMBLEMA_DE_CASA, LOGO, VINYETA_DE_PERFIL } from './index.ts';
import { componerPeninsula } from './peninsula.ts';
import type { MundoParaLaPortada } from './peninsula.ts';

describe('el arte', () => {
  it('cada casa tiene su emblema y cada perfil de origen su vinyeta', () => {
    for (const casa of CASAS) expect(EMBLEMA_DE_CASA[casa], casa).toMatch(/svg/);
    for (const p of POTENCIALES) expect(VINYETA_DE_PERFIL[p], p).toMatch(/svg/);
  });

  it('el sello del juego es un SVG y es el icono del navegador', () => {
    expect(LOGO).toMatch(/svg/);
    expect(readFileSync(new URL('../../index.html', import.meta.url), 'utf8')).toContain(
      '<link rel="icon" type="image/svg+xml" href="/src/arte/logo.svg" />',
    );
  });

  it('la peninsula se compone igual desde el mundo, con sus 403 comarcas y recuas que se paran con «menos movimiento»', () => {
    const mundo = JSON.parse(
      readFileSync(new URL('../../../mundo/datos/mundo.v1.json', import.meta.url), 'utf8'),
    ) as MundoParaLaPortada;
    const svg = componerPeninsula(mundo);
    expect(svg).toBe(componerPeninsula(mundo));
    expect(svg.match(/<polygon /g)?.length).toBe(403);
    expect(svg).toContain('animateMotion');
    expect(svg).toMatch(/prefers-reduced-motion: reduce\)\{\.recua\{display:none\}/);
  });
});
