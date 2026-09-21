// Compara dos informes del banco (ficha T-046 §4.4): lee sus CSV y ensenya que cifras cambian, para
// ver que ha hecho un cambio de equilibrio.
//
// Uso: npx tsx herramientas/banco/src/comparar.ts informes/a.csv informes/b.csv [--todas]
//        [--ensayado reglas.huella]
//
// Antes de las cifras enseña la procedencia: si entre los dos informes ha cambiado algo mas que el
// grupo de valores ensayado (los robots, el mapa, las metricas o el escenario), lo dice, porque
// entonces la comparacion no demuestra que ha hecho el cambio (ficha T-048 §4.1).
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { comparar } from '@conquer/nucleo';

import { avisoDeProcedencia, diferenciasDeProcedencia } from './procedencia.ts';

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

/** El manifiesto que acompanya a un CSV del banco, o null si ese informe no lo lleva. */
export function leerManifiesto(rutaCsv: string): unknown {
  const ruta = rutaCsv.replace(/\.csv$/u, '-manifiesto.json');
  if (ruta === rutaCsv || !existsSync(ruta)) return null;
  return JSON.parse(readFileSync(ruta, 'utf8')) as unknown;
}

/** El aviso de procedencia de dos informes; vacio si alguno no trae manifiesto. */
export function avisoDeDosInformes(rutaA: string, rutaB: string, ensayado: string): string {
  const a = leerManifiesto(rutaA);
  const b = leerManifiesto(rutaB);
  if (a === null || b === null) {
    return `Uno de los dos informes no trae manifiesto (${a === null ? rutaA : rutaB}): no se puede comprobar que midan lo mismo.\n`;
  }
  return avisoDeProcedencia(diferenciasDeProcedencia(a, b), ensayado);
}

function valorDe(argumentos: readonly string[], nombre: string): string | undefined {
  const i = argumentos.indexOf(`--${nombre}`);
  return i >= 0 ? argumentos[i + 1] : undefined;
}

function principal(argumentos: readonly string[]): void {
  const opciones = new Set(['--todas', '--ensayado']);
  const rutas = argumentos.filter(
    (a, i) => !a.startsWith('--') && argumentos[i - 1] !== '--ensayado',
  );
  const desconocidas = argumentos.filter((a) => a.startsWith('--') && !opciones.has(a));
  if (desconocidas.length > 0) {
    throw new Error(`No conozco la opcion ${desconocidas.join(', ')}.`);
  }
  const [rutaA, rutaB] = rutas;
  if (rutaA === undefined || rutaB === undefined) {
    throw new Error(
      'Uso: comparar.ts <informe-a.csv> <informe-b.csv> [--todas] [--ensayado <campo>]',
    );
  }
  const a = leerCsv(readFileSync(rutaA, 'utf8'), rutaA);
  const b = leerCsv(readFileSync(rutaB, 'utf8'), rutaB);
  process.stdout.write(
    `${avisoDeDosInformes(rutaA, rutaB, valorDe(argumentos, 'ensayado') ?? 'reglas.huella')}\n`,
  );
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
