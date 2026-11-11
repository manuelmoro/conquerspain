// El cliente compilado servido por el mismo proceso (despliegue): ficheros, la pagina principal para
// las rutas de la aplicacion, nada fuera de la carpeta, y la API bajo `/api/` con la IP del proxy.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

import { ficheroEstatico } from './estaticos.ts';
import { servirHttp } from './http.ts';

const carpeta = mkdtempSync(join(tmpdir(), 'cs-estaticos-'));
mkdirSync(join(carpeta, 'assets'));
writeFileSync(join(carpeta, 'index.html'), '<!doctype html><title>ConquerSpain</title>');
writeFileSync(join(carpeta, 'assets', 'index-abc.js'), 'console.log(1)');
mkdirSync(join(carpeta, 'guia'));
writeFileSync(join(carpeta, 'guia', 'index.html'), '<!doctype html><title>Guía</title>');
afterAll(() => {
  rmSync(carpeta, { recursive: true, force: true });
});

describe('los ficheros del cliente', () => {
  it('sirve el fichero con su tipo; los de assets se guardan un año, la página nunca', async () => {
    const js = await ficheroEstatico(carpeta, '/assets/index-abc.js');
    expect(js.cabeceras['content-type']).toMatch(/javascript/);
    expect(js.cabeceras['cache-control']).toMatch(/immutable/);
    const raiz = await ficheroEstatico(carpeta, '/');
    expect(raiz.cuerpo.toString()).toMatch(/ConquerSpain/);
    expect(raiz.cabeceras['cache-control']).toBe('no-cache');
  });

  it('una ruta de la aplicación, o un fichero que no está, da la página principal', async () => {
    expect((await ficheroEstatico(carpeta, '/partidas/p-1')).cuerpo.toString()).toMatch(/<title>/);
    expect((await ficheroEstatico(carpeta, '/no-esta.js')).cuerpo.toString()).toMatch(/<title>/);
  });

  it('una carpeta con su página la sirve: la guía en /guia/ y /guia (T-127)', async () => {
    for (const ruta of ['/guia/', '/guia']) {
      const guia = await ficheroEstatico(carpeta, ruta);
      expect(guia.cuerpo.toString(), ruta).toMatch(/Guía/);
      expect(guia.cabeceras['content-type']).toMatch(/text\/html/);
    }
  });

  it('nada fuera de la carpeta', async () => {
    const fuera = await ficheroEstatico(carpeta, '/../../../etc/passwd');
    expect(fuera.cuerpo.toString()).toMatch(/<title>/);
  });
});

describe('el servidor con cliente', () => {
  it('la API va bajo /api y toma la IP de la cabecera del proxy', async () => {
    const vistas: { ruta: string; origen: string | undefined }[] = [];
    const servidor = await servirHttp(
      (p) => {
        vistas.push({ ruta: p.ruta, origen: p.origen });
        return Promise.resolve({ estado: 200, cabeceras: {}, cuerpo: { ok: true } });
      },
      { estaticos: carpeta, cabeceraDeOrigen: 'cf-connecting-ip' },
    );
    const base = `http://127.0.0.1:${String(servidor.puerto)}`;
    expect(await (await fetch(`${base}/`)).text()).toMatch(/ConquerSpain/);
    await fetch(`${base}/api/partidas/mias`, { headers: { 'cf-connecting-ip': '203.0.113.7' } });
    expect(vistas).toEqual([{ ruta: '/partidas/mias', origen: '203.0.113.7' }]);
    await servidor.cerrar();
  });
});
