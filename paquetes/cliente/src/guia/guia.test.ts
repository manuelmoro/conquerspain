// La guia (ficha T-127 §4): cada imagen que cita existe, cada captura se usa, el indice lleva a una
// seccion de verdad y ningun identificador se repite.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { dimensionesDeJpeg, ponerDimensiones } from '../../herramientas/jpeg.ts';

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

  it('cada imagen declara el tamaño de su captura: los enlaces del índice no se descolocan (T-130)', () => {
    const carpeta = fileURLToPath(new URL('../../public/guia/', import.meta.url));
    const mal = [...html.matchAll(/<img\b[^>]*src="\/guia\/([^"]+)"[^>]*>/g)].flatMap((m) => {
      const fichero = m[1] ?? '';
      const d = dimensionesDeJpeg(readFileSync(`${carpeta}${fichero}`));
      return m[0].includes(`width="${String(d.ancho)}"`) &&
        m[0].includes(`height="${String(d.alto)}"`)
        ? []
        : [
            `${fichero}: debe llevar width="${String(d.ancho)}" height="${String(d.alto)}" (npm run guia:capturas lo pone)`,
          ];
    });
    expect(mal).toEqual([]);
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

describe('el tamaño de las capturas', () => {
  it('lee el ancho y el alto de un JPEG y los pone en su imagen, sustituyendo los que hubiera', () => {
    // Una cabecera minima: SOI, un APP0 de relleno y un SOF0 de 300 x 200.
    const jpeg = Uint8Array.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0xc8,
      0x01, 0x2c, 0x03,
    ]);
    expect(dimensionesDeJpeg(jpeg)).toEqual({ ancho: 300, alto: 200 });
    expect(() => dimensionesDeJpeg(Uint8Array.from([1, 2, 3]))).toThrow(/JPEG/);
    const html = '<img src="/guia/a.jpg" width="1" height="2" alt="x" /><img src="/otra.png" />';
    expect(ponerDimensiones(html, { 'a.jpg': { ancho: 300, alto: 200 } })).toBe(
      '<img src="/guia/a.jpg" width="300" height="200" alt="x" /><img src="/otra.png" />',
    );
  });
});
