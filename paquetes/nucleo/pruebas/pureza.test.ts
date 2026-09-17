// Segunda guarda de pureza del nucleo (la primera es ESLint). Recorre el codigo fuente del
// motor y falla si encuentra algo que rompa el determinismo: reloj, azar del sistema, entrada
// y salida, o numeros con coma flotante.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const DIRECTORIO_FUENTE = fileURLToPath(new URL('../src', import.meta.url));

interface Prohibicion {
  readonly nombre: string;
  readonly patron: RegExp;
  readonly motivo: string;
  /** true: se busca sobre el codigo sin comentarios ni cadenas. */
  readonly soloCodigo: boolean;
}

const PROHIBICIONES: readonly Prohibicion[] = [
  {
    nombre: 'reloj del sistema',
    patron: /\bDate\b/,
    motivo: 'el tiempo entra al motor como parametro, nunca se lee del sistema',
    soloCodigo: true,
  },
  {
    nombre: 'azar del sistema',
    patron: /\bMath\s*\.\s*random\b/,
    motivo: 'el azar se genera con semilla (utiles/azar), nunca con Math.random',
    soloCodigo: true,
  },
  {
    nombre: 'entrada y salida',
    patron: /from\s+'(node:)?(fs|path|os|crypto|child_process|url|process)'/,
    motivo: 'el nucleo no toca el sistema de archivos ni el entorno',
    soloCodigo: false,
  },
  {
    nombre: 'entorno de ejecucion',
    patron: /\b(process|globalThis|window|document|performance)\b/,
    motivo: 'el nucleo no conoce su entorno: recibe todo por parametro',
    soloCodigo: true,
  },
  {
    nombre: 'carga dinamica',
    patron: /\brequire\s*\(|\bimport\s*\(/,
    motivo: 'las dependencias del nucleo son estaticas y conocidas',
    soloCodigo: true,
  },
  {
    nombre: 'coma flotante',
    patron: /(?<![\w.])\d+\.\d+/,
    motivo: 'todas las magnitudes son enteras; las fracciones van en milesimas',
    soloCodigo: true,
  },
];

/** Sustituye comentarios y cadenas por espacios, conservando los saltos de linea. */
export function limpiarCodigo(texto: string): string {
  let resultado = '';
  let i = 0;
  let estado: 'codigo' | 'linea' | 'bloque' | 'comilla' | 'doble' | 'plantilla' = 'codigo';
  while (i < texto.length) {
    const caracter = texto[i] ?? '';
    const siguiente = texto[i + 1] ?? '';
    if (estado === 'codigo') {
      if (caracter === '/' && siguiente === '/') {
        estado = 'linea';
        resultado += '  ';
        i += 2;
        continue;
      }
      if (caracter === '/' && siguiente === '*') {
        estado = 'bloque';
        resultado += '  ';
        i += 2;
        continue;
      }
      if (caracter === "'" || caracter === '"' || caracter === '`') {
        estado = caracter === "'" ? 'comilla' : caracter === '"' ? 'doble' : 'plantilla';
        resultado += ' ';
        i += 1;
        continue;
      }
      resultado += caracter;
      i += 1;
      continue;
    }
    if (estado === 'linea') {
      if (caracter === '\n') {
        estado = 'codigo';
        resultado += '\n';
      } else {
        resultado += ' ';
      }
      i += 1;
      continue;
    }
    if (estado === 'bloque') {
      if (caracter === '*' && siguiente === '/') {
        estado = 'codigo';
        resultado += '  ';
        i += 2;
        continue;
      }
      resultado += caracter === '\n' ? '\n' : ' ';
      i += 1;
      continue;
    }
    // Dentro de una cadena
    if (caracter === '\\') {
      resultado += '  ';
      i += 2;
      continue;
    }
    const cierre = estado === 'comilla' ? "'" : estado === 'doble' ? '"' : '`';
    if (caracter === cierre) {
      estado = 'codigo';
      resultado += ' ';
      i += 1;
      continue;
    }
    resultado += caracter === '\n' ? '\n' : ' ';
    i += 1;
  }
  return resultado;
}

interface Infraccion {
  readonly archivo: string;
  readonly linea: number;
  readonly texto: string;
  readonly prohibicion: Prohibicion;
}

export function buscarInfracciones(archivo: string, contenido: string): Infraccion[] {
  const lineasOriginales = contenido.split('\n');
  const lineasLimpias = limpiarCodigo(contenido).split('\n');
  const infracciones: Infraccion[] = [];
  for (const prohibicion of PROHIBICIONES) {
    const lineas = prohibicion.soloCodigo ? lineasLimpias : lineasOriginales;
    lineas.forEach((linea, indice) => {
      if (prohibicion.patron.test(linea)) {
        infracciones.push({
          archivo,
          linea: indice + 1,
          texto: (lineasOriginales[indice] ?? '').trim(),
          prohibicion,
        });
      }
    });
  }
  return infracciones;
}

function archivosDe(directorio: string): string[] {
  const encontrados: string[] = [];
  for (const entrada of readdirSync(directorio, { withFileTypes: true })) {
    const ruta = join(directorio, entrada.name);
    if (entrada.isDirectory()) {
      encontrados.push(...archivosDe(ruta));
    } else if (entrada.name.endsWith('.ts')) {
      encontrados.push(ruta);
    }
  }
  return encontrados.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

describe('pureza del nucleo', () => {
  it('encuentra archivos que revisar', () => {
    expect(archivosDe(DIRECTORIO_FUENTE).length).toBeGreaterThan(0);
  });

  it('no usa reloj, azar del sistema, entrada y salida ni coma flotante', () => {
    const infracciones = archivosDe(DIRECTORIO_FUENTE).flatMap((ruta) =>
      buscarInfracciones(relative(DIRECTORIO_FUENTE, ruta), readFileSync(ruta, 'utf8')),
    );
    const informe = infracciones
      .map(
        (i) =>
          `  · ${i.archivo}:${i.linea} → ${i.prohibicion.nombre}: ${i.prohibicion.motivo}\n    ${i.texto}`,
      )
      .join('\n');
    expect(informe, `El nucleo debe ser puro y determinista:\n${informe}`).toBe('');
  });

  it('detecta las infracciones cuando las hay', () => {
    const ejemplos = [
      'const ahora = new Date();',
      'const tirada = Math.random();',
      "import { readFileSync } from 'node:fs';",
      'const factor = 1.25;',
      'const raiz = process.cwd();',
    ];
    for (const ejemplo of ejemplos) {
      expect(buscarInfracciones('ejemplo.ts', ejemplo).length, ejemplo).toBeGreaterThan(0);
    }
  });

  it('no confunde comentarios ni cadenas con codigo', () => {
    const inocentes = [
      "export const VERSION = '0.1.0';",
      '// Este comentario habla de Math.random y de Date a proposito.',
      '/* Ni 1.25 ni process deben contar aqui. */',
      "const mensaje = 'la cosecha rinde 1.5 veces mas';",
    ];
    for (const inocente of inocentes) {
      expect(buscarInfracciones('ejemplo.ts', inocente), inocente).toEqual([]);
    }
  });
});
