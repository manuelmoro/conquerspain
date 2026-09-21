// El ejecutor del banco (ficha T-046 §4.2): partidas automaticas con un robot por casa, deterministas
// (misma semilla, misma partida) y con su informe.
//
// Uso:
//   npx tsx herramientas/banco/src/ejecutar.ts --semilla 1492 --turnos 200 --casas todas \
//     --repeticiones 3 [--escenario hambre] [--sin-ausencia] [--fecha 2026-09-19] \
//     [--cambios "movimiento.portePorAcemila=4"] [--revision <sha>] [--evaluar]
//
// Con `--evaluar`, el proceso termina con codigo 2 si algun criterio de T-047 incumple o no se
// puede evaluar (ficha T-048 §7).
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CASAS,
  TABLAS_DEL_JUEGO,
  explicar,
  resolverTurno,
  validarOrdenEntrante,
  vistaDeJugador,
} from '@conquer/nucleo';
import type {
  Casa,
  EstadoPartida,
  IdJugador,
  Mundo,
  Orden,
  Suceso,
  TablasDeReglas,
} from '@conquer/nucleo';

import { ESCENARIOS } from './escenarios/index.ts';
import type { NombreDeEscenario } from './escenarios/index.ts';
import {
  codigoDeEvaluacion,
  componerEvaluacionCsv,
  evaluarEquilibrio,
  pendientes,
} from './equilibrio.ts';
import { componerCsv, componerInforme, componerSerieCsv } from './informe.ts';
import type { MetricasDePartida } from './metricas.ts';
import { Registro } from './metricas.ts';
import { mundoPeninsula, partidaInicial } from './partida.ts';
import { componerManifiesto, textoDeManifiesto } from './procedencia.ts';
import type { Robot } from './robots/index.ts';
import { origenPreferido, robotDe } from './robots/index.ts';

export const DIRECTORIO_DE_INFORMES = fileURLToPath(new URL('../informes', import.meta.url));

import { CADENCIA_AUSENTE } from './version.ts';

export { CADENCIA_AUSENTE } from './version.ts';

export interface OpcionesDePartida {
  readonly semilla: string;
  readonly turnos: number;
  readonly casas: readonly Casa[];
  /** Cada cuantos turnos deciden los robots. */
  readonly cadencia: number;
  readonly reglas: TablasDeReglas;
  readonly mundo: Mundo;
  /** Directorio donde guardar el estado cada 10 turnos; null para no guardarlo. */
  readonly estados: string | null;
}

/** Un robot que da una orden que el servidor no aceptaria es un robot roto: se para todo. */
function comprobar(orden: Orden, casa: Casa): Orden {
  const resultado = validarOrdenEntrante(orden);
  if (!resultado.ok) {
    throw new Error(
      `El robot de ${casa} ha dado una orden que el servidor rechazaria (${orden.id}):\n${explicar(resultado.errores)}`,
    );
  }
  return resultado.valor;
}

export interface TurnoJugado {
  readonly estado: EstadoPartida;
  readonly sucesos: readonly Suceso[];
  /** Cuantas ordenes dio cada robot; null si no le tocaba entrar. */
  readonly decisiones: ReadonlyMap<string, number | null>;
}

/**
 * Un turno: cada robot al que le toca entrar mira su vista y da sus ordenes, y el motor resuelve.
 * Los robots entran en el turno 1 y despues cada `cadencia` turnos.
 */
export function jugarTurno(
  estado: EstadoPartida,
  robots: readonly Robot[],
  mundo: Mundo,
  reglas: TablasDeReglas,
): TurnoJugado {
  const ordenes: Orden[] = [];
  const decisiones = new Map<string, number | null>();
  for (const robot of robots) {
    const jugador = robot.casa as string as IdJugador;
    if ((estado.turno - 1) % robot.cadencia !== 0) {
      decisiones.set(jugador, null);
      continue;
    }
    const vista = vistaDeJugador(estado, jugador, mundo);
    const suyas = robot.decidir(vista, mundo, reglas).map((o) => comprobar(o, robot.casa));
    decisiones.set(jugador, suyas.length);
    ordenes.push(...suyas);
  }
  const resultado = resolverTurno(estado, ordenes, mundo, reglas);
  return { estado: resultado.estado, sucesos: resultado.sucesos, decisiones };
}

/** Juega una partida entera y devuelve sus metricas. */
export function jugarPartida(opciones: OpcionesDePartida): MetricasDePartida {
  const { semilla, turnos, casas, cadencia, reglas, mundo } = opciones;
  let estado: EstadoPartida = partidaInicial(semilla, casas, reglas, mundo, origenPreferido);
  const robots = casas.map((casa) => robotDe(casa, cadencia));
  const registro = new Registro(reglas, mundo, cadencia);
  registro.empezar(estado);
  for (let i = 0; i < turnos; i += 1) {
    const turno = jugarTurno(estado, robots, mundo, reglas);
    estado = turno.estado;
    registro.anotar(estado, turno.sucesos, turno.decisiones);
    if (opciones.estados !== null && (i + 1) % 10 === 0) guardarEstado(opciones.estados, estado);
  }
  return registro.cerrar(estado, semilla, turnos);
}

function guardarEstado(directorio: string, estado: EstadoPartida): void {
  mkdirSync(directorio, { recursive: true });
  const turno = String(estado.turno - 1).padStart(4, '0');
  writeFileSync(join(directorio, `turno-${turno}.json`), `${JSON.stringify(estado)}\n`, 'utf8');
}

export interface OpcionesDelBanco {
  readonly semilla: string;
  readonly turnos: number;
  readonly casas: readonly Casa[];
  readonly repeticiones: number;
  readonly escenario: NombreDeEscenario;
  /** Jugar tambien cada partida entrando cada seis turnos, para comparar (T-045 §4.5). */
  readonly ausencia: boolean;
  readonly estados: string | null;
}

export interface ResultadoDelBanco {
  readonly opciones: OpcionesDelBanco;
  readonly partidas: readonly MetricasDePartida[];
  /** Las mismas partidas, con los robots entrando cada seis turnos. */
  readonly ausentes: readonly MetricasDePartida[];
}

/** La semilla de cada repeticion: la primera es la dada; las demas, derivadas de ella. */
export function semillaDeRepeticion(semilla: string, repeticion: number): string {
  return repeticion === 1 ? semilla : `${semilla}-${String(repeticion)}`;
}

export function ejecutarBanco(
  opciones: OpcionesDelBanco,
  mundo: Mundo = mundoPeninsula(),
): ResultadoDelBanco {
  const reglas = ESCENARIOS[opciones.escenario].reglas(TABLAS_DEL_JUEGO);
  const partidas: MetricasDePartida[] = [];
  const ausentes: MetricasDePartida[] = [];
  for (let r = 1; r <= opciones.repeticiones; r += 1) {
    const semilla = semillaDeRepeticion(opciones.semilla, r);
    const base = { semilla, turnos: opciones.turnos, casas: opciones.casas, reglas, mundo };
    const estados =
      opciones.estados === null ? null : join(opciones.estados, `repeticion-${String(r)}`);
    partidas.push(jugarPartida({ ...base, cadencia: 1, estados }));
    if (opciones.ausencia)
      ausentes.push(jugarPartida({ ...base, cadencia: CADENCIA_AUSENTE, estados: null }));
  }
  return { opciones, partidas, ausentes };
}

// ——— Linea de ordenes ——————————————————————————————————————————————————————

function valorDe(argumentos: readonly string[], nombre: string): string | undefined {
  const i = argumentos.indexOf(`--${nombre}`);
  return i >= 0 ? argumentos[i + 1] : undefined;
}

function entero(texto: string | undefined, porDefecto: number, nombre: string): number {
  if (texto === undefined) return porDefecto;
  const valor = Number(texto);
  if (!Number.isInteger(valor) || valor < 1) {
    throw new Error(`--${nombre} tiene que ser un entero positivo, y es "${texto}".`);
  }
  return valor;
}

function casasDe(texto: string | undefined): Casa[] {
  if (texto === undefined || texto === 'todas') return [...CASAS];
  const pedidas = texto.split(',');
  const desconocidas = pedidas.filter((c) => !(CASAS as readonly string[]).includes(c));
  if (desconocidas.length > 0) {
    throw new Error(
      `No hay ninguna casa "${desconocidas.join(', ')}". Las casas son: ${CASAS.join(', ')}.`,
    );
  }
  return pedidas as Casa[];
}

function escenarioDe(texto: string | undefined): NombreDeEscenario {
  if (texto === undefined) return 'normal';
  if (!Object.hasOwn(ESCENARIOS, texto)) {
    throw new Error(
      `No hay ningun escenario "${texto}". Los hay: ${Object.keys(ESCENARIOS).join(', ')}.`,
    );
  }
  return texto as NombreDeEscenario;
}

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

/** La revision con la que se ejecuta, para el manifiesto. Si no hay git, se dice y ya. */
function revisionDeGit(): string {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'desconocida';
  }
}

/** Cuantos criterios sin cerrar se enseñan por pantalla; el CSV los lleva todos. */
const MUESTRA_DE_PENDIENTES = 10;

function principal(argumentos: readonly string[]): void {
  const semilla = valorDe(argumentos, 'semilla') ?? '1492';
  const mapa = valorDe(argumentos, 'mapa') ?? 'peninsula';
  if (mapa !== 'peninsula') {
    throw new Error(
      `Solo hay un mapa, "peninsula"; los recortes llegan con el alta de partida (T-065).`,
    );
  }
  const escenario = escenarioDe(valorDe(argumentos, 'escenario'));
  const fecha = valorDe(argumentos, 'fecha') ?? hoy();
  const base = escenario === 'normal' ? `${fecha}-${semilla}` : `${fecha}-${semilla}-${escenario}`;
  const opciones: OpcionesDelBanco = {
    semilla,
    turnos: entero(valorDe(argumentos, 'turnos'), 200, 'turnos'),
    casas: casasDe(valorDe(argumentos, 'casas')),
    repeticiones: entero(valorDe(argumentos, 'repeticiones'), 1, 'repeticiones'),
    escenario,
    ausencia: !argumentos.includes('--sin-ausencia'),
    estados: join(DIRECTORIO_DE_INFORMES, 'estados', base),
  };
  const mundo = mundoPeninsula();
  const inicio = performance.now();
  const resultado = ejecutarBanco(opciones, mundo);
  const segundos = ((performance.now() - inicio) / 1000).toFixed(1);
  const manifiesto = componerManifiesto(
    resultado,
    mundo,
    ESCENARIOS[escenario].reglas(TABLAS_DEL_JUEGO),
    {
      revision: valorDe(argumentos, 'revision') ?? revisionDeGit(),
      etiqueta: base,
      cambios: valorDe(argumentos, 'cambios') ?? '',
    },
  );
  const evaluacion = evaluarEquilibrio(resultado);
  mkdirSync(DIRECTORIO_DE_INFORMES, { recursive: true });
  const ruta = join(DIRECTORIO_DE_INFORMES, base);
  writeFileSync(`${ruta}.md`, componerInforme(resultado, mundo, manifiesto), 'utf8');
  writeFileSync(`${ruta}.csv`, componerCsv(resultado), 'utf8');
  writeFileSync(`${ruta}-turnos.csv`, componerSerieCsv(resultado), 'utf8');
  writeFileSync(`${ruta}-evaluacion.csv`, componerEvaluacionCsv(evaluacion), 'utf8');
  writeFileSync(`${ruta}-manifiesto.json`, textoDeManifiesto(manifiesto), 'utf8');
  console.log(`Informe: ${ruta}.md (${segundos} s)`);
  console.log(`Datos:   ${ruta}.csv, ${ruta}-turnos.csv y ${ruta}-evaluacion.csv`);
  console.log(`Procedencia: ${ruta}-manifiesto.json`);
  console.log(`Estados cada 10 turnos: ${opciones.estados ?? ''}`);
  if (!argumentos.includes('--evaluar')) return;
  const codigo = codigoDeEvaluacion(evaluacion);
  const sinCerrar = pendientes(evaluacion);
  console.log(
    codigo === 0
      ? 'Los criterios de T-047 cumplen todos.'
      : `Criterios sin cerrar: ${String(sinCerrar.length)} de ${String(evaluacion.length)}.`,
  );
  for (const f of sinCerrar.slice(0, MUESTRA_DE_PENDIENTES)) {
    console.log(
      `  ${f.estado} · ${f.criterio} · ${f.semilla} · ${f.casa ?? 'partida'}: ${f.detalle}`,
    );
  }
  process.exitCode = codigo;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    principal(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
