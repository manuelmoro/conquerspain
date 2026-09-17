// Partidas de reproduccion: la red de seguridad del motor.
//
// Cada partida guardada lleva su estado inicial, sus ordenes y la huella esperada de cada turno.
// Si una huella cambia, el motor se comporta de otra manera: o es un fallo, o es un cambio
// intencionado y hay que regenerarlas a conciencia con `npm run partidas -- --confirmo`.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { resolverTurno } from '../src/resolver.ts';
import type { EstadoPartida } from '../src/tipos/estado.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import { validarEstado } from '../src/validacion/validarEstado.ts';
import { explicar } from '../src/validacion/validador.ts';
import { mundoMini, tablasMini } from './mundo-mini.ts';

const DIRECTORIO = fileURLToPath(new URL('./partidas', import.meta.url));

interface TurnoGuardado {
  readonly turno: number;
  readonly ordenes: Orden[];
  readonly huellaEsperada: string;
}

interface PartidaGuardada {
  readonly nombre: string;
  readonly descripcion: string;
  readonly versionReglas: number;
  readonly mundo: string;
  readonly estadoInicial: EstadoPartida;
  readonly turnos: readonly TurnoGuardado[];
}

function partidas(): PartidaGuardada[] {
  return readdirSync(DIRECTORIO)
    .filter((archivo) => archivo.endsWith('.json'))
    .sort((a, b) => (a < b ? -1 : 1))
    .map(
      (archivo) => JSON.parse(readFileSync(join(DIRECTORIO, archivo), 'utf8')) as PartidaGuardada,
    );
}

describe('partidas de reproduccion', () => {
  const guardadas = partidas();

  it('hay al menos una partida guardada', () => {
    expect(guardadas.length).toBeGreaterThan(0);
  });

  for (const partida of guardadas) {
    describe(partida.nombre, () => {
      it('su estado inicial sigue siendo valido', () => {
        const resultado = validarEstado(partida.estadoInicial, mundoMini());
        expect(explicar(resultado.ok ? [] : resultado.errores)).toBe('');
      });

      it('reproduce exactamente las huellas guardadas', () => {
        const mundo = mundoMini();
        const reglas = tablasMini();
        let estado = partida.estadoInicial;
        for (const turno of partida.turnos) {
          const resultado = resolverTurno(estado, turno.ordenes, mundo, reglas);
          estado = resultado.estado;
          expect(
            estado.huellaTurnoAnterior,
            `turno ${String(turno.turno)} de "${partida.nombre}": si el cambio es intencionado, regenera las partidas con "npm run partidas -- --confirmo"`,
          ).toBe(turno.huellaEsperada);
        }
      });

      it('es reproducible dos veces seguidas', () => {
        const mundo = mundoMini();
        const reglas = tablasMini();
        const primera = resolverTurno(
          partida.estadoInicial,
          partida.turnos[0]?.ordenes ?? [],
          mundo,
          reglas,
        );
        const segunda = resolverTurno(
          partida.estadoInicial,
          partida.turnos[0]?.ordenes ?? [],
          mundo,
          reglas,
        );
        expect(primera.estado.huellaTurnoAnterior).toBe(segunda.estado.huellaTurnoAnterior);
      });
    });
  }
});
