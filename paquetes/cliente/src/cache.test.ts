// La cache de lo que se trae del servidor (T-090): un fallo no se repite en bucle.
import { describe, expect, it } from 'vitest';

import { CacheDeServidor } from './cache.ts';

describe('la caché de lo que se trae del servidor', () => {
  it('pide una vez, y tras un fallo no vuelve a pedir en cada repintado', async () => {
    const cache = new CacheDeServidor<string>();
    let pedidas = 0;
    const pedir = (): Promise<string | null> => {
      pedidas += 1;
      return Promise.resolve(null);
    };
    let avisos = 0;
    expect(cache.leer('turno-1', pedir, () => (avisos += 1))).toBeNull();
    await Promise.resolve();
    await Promise.resolve();
    for (let i = 0; i < 20; i += 1) cache.leer('turno-1', pedir, () => (avisos += 1));
    expect(pedidas).toBe(1);
    expect(avisos).toBe(1);
    expect(cache.fallo('turno-1')).toBe(true);
    cache.olvidar('turno-1');
    cache.leer('turno-1', pedir, () => undefined);
    expect(pedidas).toBe(2);
  });

  it('lo que llega se guarda y no se vuelve a pedir', async () => {
    const cache = new CacheDeServidor<string>();
    let pedidas = 0;
    const pedir = (): Promise<string> => {
      pedidas += 1;
      return Promise.resolve('hola');
    };
    cache.leer('a', pedir, () => undefined);
    await Promise.resolve();
    await Promise.resolve();
    expect(cache.leer('a', pedir, () => undefined)).toBe('hola');
    expect(pedidas).toBe(1);
  });
});
