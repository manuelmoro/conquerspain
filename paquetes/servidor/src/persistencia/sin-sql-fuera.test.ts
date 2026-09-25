// Ninguna consulta SQL fuera de la capa de acceso (ficha T-060 §9.9): solo `sqlite.ts` y las
// migraciones saben SQL, y solo ellos importan `node:sqlite`. Las pruebas pueden abrir una segunda
// conexion para corromper una base a proposito, y por eso no cuentan.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const PERMITIDOS = [/persistencia[/\\]sqlite\.ts$/, /persistencia[/\\]migraciones[/\\]/];
const SQL = /\b(SELECT\s.+\sFROM|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|CREATE\s+TABLE)\b/i;

function fuentes(carpeta: string): string[] {
  return readdirSync(carpeta, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = join(carpeta, entrada.name);
    if (entrada.isDirectory()) return fuentes(ruta);
    return ruta.endsWith('.ts') && !ruta.endsWith('.test.ts') ? [ruta] : [];
  });
}

describe('la capa de acceso', () => {
  it('es la unica que tiene SQL o importa node:sqlite', () => {
    const culpables = fuentes(RAIZ)
      .filter((ruta) => !PERMITIDOS.some((permitido) => permitido.test(ruta)))
      .filter((ruta) => {
        const texto = readFileSync(ruta, 'utf8');
        return SQL.test(texto) || texto.includes("'node:sqlite'");
      })
      .map((ruta) => relative(RAIZ, ruta));
    expect(culpables).toEqual([]);
  });
});
