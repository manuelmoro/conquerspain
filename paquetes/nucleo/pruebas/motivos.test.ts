// Cada motivo con el que una orden espera o se cancela tiene su frase en castellano: en la bandeja y
// en la crónica no puede salir nunca la clave interna («Espera: sin-recursos», T-092 tras jugar).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { MOTIVOS } from '../src/datos/plantillas.ts';

function fuentes(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? fuentes(join(dir, e.name))
      : e.name.endsWith('.ts')
        ? [join(dir, e.name)]
        : [],
  );
}

describe('los motivos de espera y cancelación', () => {
  it('todos tienen su texto', () => {
    const usados = new Set<string>();
    for (const archivo of fuentes(join(import.meta.dirname, '../src'))) {
      const codigo = readFileSync(archivo, 'utf8');
      for (const m of codigo.matchAll(/(?:dejarEnEspera|cancelarOrden)\(ctx, [\w.]+, '([a-z-]+)'/g))
        usados.add(m[1] ?? '');
    }
    // Los que el mercado elige antes de llamar (fases/07-mercado.ts).
    for (const m of ['recua-lejos', 'recua-en-ruta', 'recua-sin-cometido']) usados.add(m);
    expect(usados.size).toBeGreaterThan(20);
    const sinTexto = [...usados].filter((m) => !Object.hasOwn(MOTIVOS, m)).sort();
    expect(sinTexto).toEqual([]);
  });
});
