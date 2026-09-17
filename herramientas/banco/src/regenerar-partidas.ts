// Regenera las partidas de reproduccion: vuelve a resolver sus turnos y reescribe las huellas.
//
// Una huella que cambia significa que el motor se comporta de otra manera. Eso es un fallo o un
// cambio intencionado, nunca un tramite: por eso este script solo escribe con --confirmo y
// siempre ensenya antes que huellas cambian.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolverTurno } from '@conquer/nucleo';
import type { EstadoPartida, Orden } from '@conquer/nucleo';

import { estadoMini, mundoMini, tablasMini } from '../../../paquetes/nucleo/pruebas/mundo-mini.ts';

const DIRECTORIO = fileURLToPath(
  new URL('../../../paquetes/nucleo/pruebas/partidas', import.meta.url),
);

export interface TurnoGuardado {
  turno: number;
  ordenes: Orden[];
  huellaEsperada: string;
}

export interface PartidaGuardada {
  nombre: string;
  descripcion: string;
  versionReglas: number;
  mundo: string;
  estadoInicial: EstadoPartida;
  turnos: TurnoGuardado[];
}

export function cargarPartida(ruta: string): PartidaGuardada {
  return JSON.parse(readFileSync(ruta, 'utf8')) as PartidaGuardada;
}

export function partidasGuardadas(): { nombre: string; ruta: string }[] {
  return readdirSync(DIRECTORIO)
    .filter((archivo) => archivo.endsWith('.json'))
    .sort((a, b) => (a < b ? -1 : 1))
    .map((archivo) => ({
      nombre: archivo.replace(/\.json$/, ''),
      ruta: join(DIRECTORIO, archivo),
    }));
}

/** Vuelve a resolver la partida y devuelve las huellas que salen ahora. */
export function huellasDe(partida: PartidaGuardada): string[] {
  const mundo = mundoMini();
  const reglas = tablasMini();
  let estado = partida.estadoInicial;
  const huellas: string[] = [];
  for (const turno of partida.turnos) {
    const resultado = resolverTurno(estado, turno.ordenes, mundo, reglas);
    estado = resultado.estado;
    huellas.push(estado.huellaTurnoAnterior ?? '');
  }
  return huellas;
}

function crear(nombre: string, turnos: number): PartidaGuardada {
  const partida: PartidaGuardada = {
    nombre,
    descripcion: 'Partida de humo: sin ordenes, solo para detectar cambios no intencionados.',
    versionReglas: estadoMini().version,
    mundo: 'mini',
    estadoInicial: estadoMini(),
    turnos: [],
  };
  for (let i = 0; i < turnos; i += 1) {
    partida.turnos.push({ turno: i + 1, ordenes: [], huellaEsperada: '' });
  }
  return partida;
}

function escribir(ruta: string, partida: PartidaGuardada): void {
  writeFileSync(ruta, `${JSON.stringify(partida, null, 2)}\n`, 'utf8');
}

function principal(argumentos: readonly string[]): number {
  const confirmo = argumentos.includes('--confirmo');
  const indiceCrear = argumentos.indexOf('--crear');
  if (indiceCrear >= 0) {
    const nombre = argumentos[indiceCrear + 1] ?? 'nueva';
    const turnos = Number(argumentos[argumentos.indexOf('--turnos') + 1] ?? '3');
    const partida = crear(nombre, turnos);
    const huellas = huellasDe(partida);
    partida.turnos.forEach((turno, indice) => {
      turno.huellaEsperada = huellas[indice] ?? '';
    });
    const ruta = join(DIRECTORIO, `${nombre}.json`);
    if (!confirmo) {
      console.log(
        `Se crearia ${ruta} con ${String(turnos)} turnos. Anyade --confirmo para escribirla.`,
      );
      return 0;
    }
    escribir(ruta, partida);
    console.log(`Creada ${ruta} con ${String(turnos)} turnos.`);
    return 0;
  }

  let hayCambios = false;
  for (const { nombre, ruta } of partidasGuardadas()) {
    const partida = cargarPartida(ruta);
    const huellas = huellasDe(partida);
    const cambios: string[] = [];
    partida.turnos.forEach((turno, indice) => {
      const nueva = huellas[indice] ?? '';
      if (turno.huellaEsperada !== nueva) {
        cambios.push(
          `  turno ${String(turno.turno)}: ${turno.huellaEsperada.slice(0, 12)}… → ${nueva.slice(0, 12)}…`,
        );
        turno.huellaEsperada = nueva;
      }
    });
    if (cambios.length === 0) {
      console.log(`${nombre}: sin cambios.`);
      continue;
    }
    hayCambios = true;
    console.log(`${nombre}: cambian ${String(cambios.length)} huellas`);
    for (const linea of cambios) console.log(linea);
    if (confirmo) {
      escribir(ruta, partida);
      console.log(`${nombre}: reescrita.`);
    }
  }

  if (hayCambios && !confirmo) {
    console.log('\nNo se ha escrito nada. Si el cambio es intencionado, repite con --confirmo.');
    return 1;
  }
  return 0;
}

if (
  process.argv[1] !== undefined &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))
) {
  process.exitCode = principal(process.argv.slice(2));
}
