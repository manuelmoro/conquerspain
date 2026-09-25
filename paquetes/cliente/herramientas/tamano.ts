// Construye el cliente y mide su JavaScript con gzip (ficha T-080 §4.6): el presupuesto es de 150 KB.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

import { build } from 'vite';

export const PRESUPUESTO_KB = 150;

const raiz = fileURLToPath(new URL('..', import.meta.url));
await build({ root: raiz, configFile: join(raiz, 'vite.config.ts'), logLevel: 'warn' });
const carpeta = join(raiz, 'dist-web', 'assets');
let total = 0;
for (const fichero of readdirSync(carpeta).filter((f) => f.endsWith('.js'))) {
  const bytes = gzipSync(readFileSync(join(carpeta, fichero))).length;
  total += bytes;
  console.log(`${fichero}: ${(bytes / 1024).toFixed(1)} KB gzip`);
}
const kb = total / 1024;
console.log(`Total: ${kb.toFixed(1)} KB gzip (presupuesto ${String(PRESUPUESTO_KB)} KB).`);
if (kb > PRESUPUESTO_KB) {
  console.error(
    `El cliente pasa del presupuesto de ${String(PRESUPUESTO_KB)} KB gzip: quita peso antes de seguir.`,
  );
  process.exit(1);
}
