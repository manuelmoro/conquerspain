// Los codigos de invitacion legibles (ficha T-131 §2.1).
import { describe, expect, it } from 'vitest';

import { codigoNuevo, convocatoriaDelCodigo, normalizarCodigo } from './codigos.ts';

describe('los códigos de invitación', () => {
  it('son doce símbolos sin letras que se confundan', () => {
    for (let i = 0; i < 200; i += 1) expect(codigoNuevo()).toMatch(/^[0-9A-HJKMNP-TV-Z]{12}$/);
    expect(codigoNuevo(Uint8Array.from({ length: 12 }, (_, i) => i * 3))).toBe('0369CFJNRVY1');
  });

  it('se perdonan guiones, espacios, minúsculas y las letras parecidas', () => {
    expect(normalizarCodigo('k7qd-3mx9-p2rt')).toBe('K7QD3MX9P2RT');
    expect(normalizarCodigo(' K7QD 3MX9 P2RT ')).toBe('K7QD3MX9P2RT');
    // O es 0; I y L son 1; U es V.
    expect(normalizarCodigo('OOIL-UUUU-0000')).toBe('0011VVVV0000');
    expect(normalizarCodigo('demasiado-corto')).toBeNull();
    expect(normalizarCodigo('G_VuKtIFiG91cfUpVB48vA')).toBeNull();
  });

  it('busca tal cual (los códigos antiguos) y, si no, normalizado', async () => {
    const guardados = new Map([
      ['G_VuKtIFiG91cfUpVB48vA', 'antigua'],
      ['K7QD3MX9P2RT', 'nueva'],
    ]);
    const repo = {
      convocatoriaPorCodigo: (c: string) =>
        Promise.resolve(guardados.has(c) ? ({ id: guardados.get(c) } as unknown as never) : null),
    };
    const id = async (escrito: unknown) =>
      ((await convocatoriaDelCodigo(repo, escrito)) as { id: string } | null)?.id ?? null;
    expect(await id('G_VuKtIFiG91cfUpVB48vA')).toBe('antigua');
    expect(await id('  G_VuKtIFiG91cfUpVB48vA ')).toBe('antigua');
    expect(await id('k7qd-3mx9-p2rt')).toBe('nueva');
    expect(await id('K7QD-3MX9-P2RO')).toBeNull();
    expect(await id('')).toBeNull();
    expect(await id(42)).toBeNull();
  });
});
