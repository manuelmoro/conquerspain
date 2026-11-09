// La peninsula de la portada (ficha T-090 §2.3): un dibujo de las 403 comarcas con su terreno y las
// canyadas reales, con unas recuas y rebanyos que van y vienen. Se genera desde `mundo.v1.json`, nunca a
// mano, y `--comprobar` (en `verificar`) falla si el dibujo guardado ya no es el que sale de los datos.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { componerPeninsula } from '../src/arte/peninsula.ts';
import type { MundoParaLaPortada } from '../src/arte/peninsula.ts';

const DATOS = fileURLToPath(new URL('../../mundo/datos/mundo.v1.json', import.meta.url));
const SALIDA = fileURLToPath(new URL('../src/arte/peninsula.svg', import.meta.url));

const mundo = JSON.parse(readFileSync(DATOS, 'utf8')) as MundoParaLaPortada;
const svg = componerPeninsula(mundo);
if (process.argv.includes('--comprobar')) {
  if (readFileSync(SALIDA, 'utf8') !== svg) {
    console.error(
      'La peninsula de la portada no esta al dia con el mundo: ejecuta `npm run portada`.',
    );
    process.exit(1);
  }
  console.log('La peninsula de la portada esta al dia.');
} else {
  writeFileSync(SALIDA, svg, 'utf8');
  console.log(`Escrita ${SALIDA} (${String(Math.round(svg.length / 1024))} KB).`);
}
