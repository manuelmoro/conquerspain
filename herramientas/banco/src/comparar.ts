// Compara dos informes del banco (ficha T-046 §4.4): lee sus CSV y ensenya que cifras cambian, para
// ver que ha hecho un cambio de equilibrio.
//
// Uso: npx tsx herramientas/banco/src/comparar.ts informes/a.csv informes/b.csv [--todas]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { comparar } from '@conquer/nucleo';

/** `casa|metrica` → valor. */
export type Cifras = ReadonlyMap<string, number>;

export function leerCsv(texto: string, origen: string): Cifras {
  const lineas = texto.split('\n').filter((l) => l.trim() !== '');
  if (lineas[0] !== 'casa,metrica,valor') {
    throw new Error(
      `${origen} no es un CSV del banco: la primera linea tiene que ser "casa,metrica,valor". ¿Has pasado el de turnos?`,
    );
  }
  const cifras = new Map<string, number>();
  lineas.slice(1).forEach((linea, i) => {
    const [casa, metrica, valor] = linea.split(',');
    const numero = Number(valor);
    if (
      casa === undefined ||
      metrica === undefined ||
      valor === undefined ||
      !Number.isFinite(numero)
    ) {
      throw new Error(`${origen}, linea ${String(i + 2)}: "${linea}" no es "casa,metrica,valor".`);
    }
    cifras.set(`${casa}|${metrica}`, numero);
  });
  return cifras;
}

export interface Diferencia {
  readonly casa: string;
  readonly metrica: string;
  readonly antes: number | null;
  readonly despues: number | null;
}

/** Las cifras que cambian (o todas), en orden de casa y de metrica. */
export function diferencias(a: Cifras, b: Cifras, todas = false): Diferencia[] {
  const claves = [...new Set([...a.keys(), ...b.keys()])].sort(comparar);
  return claves
    .map((clave) => {
      const [casa = '', metrica = ''] = clave.split('|');
      return { casa, metrica, antes: a.get(clave) ?? null, despues: b.get(clave) ?? null };
    })
    .filter((d) => todas || d.antes !== d.despues);
}

function variacion(d: Diferencia): string {
  if (d.antes === null || d.despues === null) return d.antes === null ? 'nueva' : 'desaparece';
  const delta = d.despues - d.antes;
  const signo = delta > 0 ? '+' : '';
  if (d.antes === 0) return `${signo}${String(delta)}`;
  const pct = ((delta * 100) / Math.abs(d.antes)).toFixed(1).replace('.', ',');
  return `${signo}${String(delta)} (${signo}${pct} %)`;
}

export function componerComparacion(
  nombreA: string,
  nombreB: string,
  lista: readonly Diferencia[],
): string {
  if (lista.length === 0) return `${nombreA} y ${nombreB} dan exactamente las mismas cifras.\n`;
  const filas = lista.map(
    (d) =>
      `| ${d.casa} | ${d.metrica} | ${d.antes === null ? '—' : String(d.antes)} | ${d.despues === null ? '—' : String(d.despues)} | ${variacion(d)} |`,
  );
  return `${[
    `# ${nombreA} → ${nombreB}`,
    '',
    `${String(lista.length)} cifras cambian.`,
    '',
    '| Casa | Métrica | Antes | Después | Cambio |',
    '| --- | --- | ---: | ---: | ---: |',
    ...filas,
  ].join('\n')}\n`;
}

function principal(argumentos: readonly string[]): void {
  const rutas = argumentos.filter((a) => !a.startsWith('--'));
  const [rutaA, rutaB] = rutas;
  if (rutaA === undefined || rutaB === undefined) {
    throw new Error('Uso: comparar.ts <informe-a.csv> <informe-b.csv> [--todas]');
  }
  const a = leerCsv(readFileSync(rutaA, 'utf8'), rutaA);
  const b = leerCsv(readFileSync(rutaB, 'utf8'), rutaB);
  process.stdout.write(
    componerComparacion(rutaA, rutaB, diferencias(a, b, argumentos.includes('--todas'))),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    principal(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
