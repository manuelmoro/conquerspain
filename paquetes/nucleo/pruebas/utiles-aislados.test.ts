// Los utiles son la base de todo el motor: no pueden depender de nada, ni siquiera de otras
// carpetas del propio nucleo. Si algun dia importan reglas, el determinismo deja de ser auditable
// en un solo sitio.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const DIRECTORIO_UTILES = fileURLToPath(new URL('../src/utiles', import.meta.url));

const IMPORTACION = /^\s*(?:import|export)[^'"]*from\s+['"]([^'"]+)['"]/gm;

function archivosDe(directorio: string): string[] {
  return readdirSync(directorio, { withFileTypes: true })
    .filter((entrada) => entrada.isFile() && entrada.name.endsWith('.ts'))
    .map((entrada) => entrada.name)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

describe('aislamiento de los utiles', () => {
  it('solo importan de la propia carpeta (y vitest en los tests)', () => {
    const problemas: string[] = [];
    for (const archivo of archivosDe(DIRECTORIO_UTILES)) {
      const contenido = readFileSync(join(DIRECTORIO_UTILES, archivo), 'utf8');
      for (const coincidencia of contenido.matchAll(IMPORTACION)) {
        const destino = coincidencia[1] ?? '';
        const permitido =
          (destino.startsWith('./') && !destino.startsWith('../')) ||
          (archivo.endsWith('.test.ts') && destino === 'vitest');
        if (!permitido) {
          problemas.push(`${archivo} importa "${destino}"`);
        }
      }
    }
    expect(problemas.join('\n')).toBe('');
  });

  it('revisa todos los archivos de utiles', () => {
    expect(archivosDe(DIRECTORIO_UTILES)).toContain('enteros.ts');
    expect(archivosDe(DIRECTORIO_UTILES).length).toBeGreaterThanOrEqual(10);
  });
});
