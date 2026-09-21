// Procedencia de un informe del banco (ficha T-048 §4.1).
//
// Un informe sin procedencia no sirve para equilibrar: dentro de un mes nadie sabra con que codigo,
// que tablas, que mapa ni que robots se saco, y dos informes que no miden lo mismo acabaran
// comparados. El manifiesto lo fija todo con huellas, y `comparar` avisa si ha cambiado algo mas
// que el grupo de valores que se estaba ensayando.
//
// Nada de aqui depende de la hora ni de la maquina: la revision y la etiqueta entran como dato.
import { VERSION_REGLAS, huella } from '@conquer/nucleo';
import type { Mundo, TablasDeReglas } from '@conquer/nucleo';

import type { ResultadoDelBanco } from './ejecutar.ts';
import { OBJETIVOS } from './equilibrio.ts';
import { VERSION_METRICAS } from './metricas.ts';
import { CADENCIA_AUSENTE, VERSION_BANCO, VERSION_ROBOTS } from './version.ts';

/** Lo que el banco no puede saber de si mismo y le tiene que decir quien lo ejecuta. */
export interface Procedencia {
  /** Revision del codigo con la que se ejecuto (`git rev-parse HEAD`), o «desconocida». */
  readonly revision: string;
  /** La etiqueta con la que se nombran los archivos del informe. */
  readonly etiqueta: string;
  /** Los cambios experimentales aplicados a mano, campo a campo; vacio si no hay ninguno. */
  readonly cambios: string;
}

export interface PartidaDelManifiesto {
  readonly semilla: string;
  readonly cadencia: number;
  /** Comarcas del mapa que se jugo de verdad: desde T-049 cada partida lleva su recorte. */
  readonly comarcas: number;
  readonly huellaFinal: string;
  readonly visitasCompletas: boolean;
}

export interface Manifiesto {
  readonly versiones: {
    readonly banco: string;
    readonly metricas: number;
    readonly robots: number;
    readonly reglas: number;
  };
  readonly revision: string;
  readonly etiqueta: string;
  readonly cambios: string;
  readonly campanya: {
    readonly semilla: string;
    readonly semillas: readonly string[];
    readonly turnos: number;
    readonly repeticiones: number;
    readonly casas: readonly string[];
    readonly escenario: string;
    readonly cadencias: readonly number[];
  };
  /** El catalogo entero del que se recorta cada partida, no el mapa que se juega. */
  readonly mundo: { readonly version: string; readonly comarcas: number; readonly huella: string };
  /** Huella de las tablas completas: `VERSION_REGLAS` no distingue un ensayo de otro. */
  readonly reglas: { readonly huella: string };
  /** Huella de los objetivos de T-047: si se mueve un umbral, se ve. */
  readonly objetivos: { readonly huella: string };
  readonly partidas: readonly PartidaDelManifiesto[];
}

export function componerManifiesto(
  resultado: ResultadoDelBanco,
  mundo: Mundo,
  reglas: TablasDeReglas,
  procedencia: Procedencia,
): Manifiesto {
  const partidas = [...resultado.partidas, ...resultado.ausentes].map((p) => ({
    semilla: p.semilla,
    cadencia: p.cadencia,
    comarcas: p.comarcasDelMapa.length,
    huellaFinal: p.huellaFinal,
    visitasCompletas: p.visitasCompletas,
  }));
  return {
    versiones: {
      banco: VERSION_BANCO,
      metricas: VERSION_METRICAS,
      robots: VERSION_ROBOTS,
      reglas: VERSION_REGLAS,
    },
    revision: procedencia.revision,
    etiqueta: procedencia.etiqueta,
    cambios: procedencia.cambios,
    campanya: {
      semilla: resultado.opciones.semilla,
      semillas: resultado.partidas.map((p) => p.semilla),
      turnos: resultado.opciones.turnos,
      repeticiones: resultado.opciones.repeticiones,
      casas: [...resultado.opciones.casas],
      escenario: resultado.opciones.escenario,
      cadencias: resultado.opciones.ausencia ? [1, CADENCIA_AUSENTE] : [1],
    },
    mundo: {
      version: mundo.version,
      comarcas: Object.keys(mundo.comarcas).length,
      huella: huella(mundo),
    },
    reglas: { huella: huella(reglas) },
    objetivos: { huella: huella(OBJETIVOS) },
    partidas,
  };
}

export function textoDeManifiesto(manifiesto: Manifiesto): string {
  return `${JSON.stringify(manifiesto, null, 2)}\n`;
}

// ——— Leer y comparar ——————————————————————————————————————————————————————

/** Un valor suelto del manifiesto como texto; lo que no sea un dato simple se marca con «?». */
function texto(valor: unknown): string {
  switch (typeof valor) {
    case 'string':
      return valor;
    case 'number':
    case 'boolean':
      return String(valor);
    default:
      return '?';
  }
}

function campo(valor: unknown, ruta: readonly string[]): string {
  let actual: unknown = valor;
  for (const paso of ruta) {
    if (typeof actual !== 'object' || actual === null) return '?';
    actual = (actual as Record<string, unknown>)[paso];
  }
  if (Array.isArray(actual)) return actual.map((x) => texto(x)).join('+');
  return texto(actual);
}

/** Lo que tiene que ser igual para poder comparar dos informes de equilibrio. */
export const CAMPOS_DE_IDENTIDAD: readonly (readonly string[])[] = [
  ['revision'],
  ['versiones', 'metricas'],
  ['versiones', 'robots'],
  ['mundo', 'huella'],
  ['reglas', 'huella'],
  ['objetivos', 'huella'],
  ['campanya', 'escenario'],
  ['campanya', 'semillas'],
  ['campanya', 'turnos'],
  ['campanya', 'cadencias'],
  ['cambios'],
];

export interface DiferenciaDeProcedencia {
  readonly campo: string;
  readonly antes: string;
  readonly despues: string;
}

/**
 * Que ha cambiado de la procedencia entre dos informes. Si cambia mas de una cosa a la vez, la
 * comparacion de cifras no dice que ha hecho el cambio ensayado: lo dice `comparar` en su aviso.
 */
export function diferenciasDeProcedencia(a: unknown, b: unknown): DiferenciaDeProcedencia[] {
  const diferencias: DiferenciaDeProcedencia[] = [];
  for (const ruta of CAMPOS_DE_IDENTIDAD) {
    const antes = campo(a, ruta);
    const despues = campo(b, ruta);
    if (antes !== despues) diferencias.push({ campo: ruta.join('.'), antes, despues });
  }
  return diferencias;
}

export function avisoDeProcedencia(
  diferencias: readonly DiferenciaDeProcedencia[],
  grupoEnsayado: string,
): string {
  if (diferencias.length === 0) {
    return 'Los dos informes tienen la misma procedencia: lo que cambie en las cifras es del grupo de valores ensayado.\n';
  }
  const lineas = diferencias.map(
    (d) =>
      `- \`${d.campo}\`: ${d.antes} → ${d.despues}${d.campo === grupoEnsayado ? ' (lo ensayado)' : ''}`,
  );
  const otros = diferencias.filter((d) => d.campo !== grupoEnsayado);
  return [
    '⚠️ **La procedencia no es la misma.**',
    '',
    ...lineas,
    '',
    otros.length === 0
      ? 'Solo cambia lo ensayado.'
      : 'Cambia más de una cosa a la vez: esta comparación no demuestra qué ha hecho el cambio. Genera una base nueva (T-047 §4, paso 5).',
    '',
  ].join('\n');
}
