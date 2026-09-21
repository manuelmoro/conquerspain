// El ejecutor (ficha T-046 §4.2 y §6): deterministas, rapidas y con sus escenarios.
import { describe, expect, it } from 'vitest';

import { CASAS, TABLAS_DEL_JUEGO } from '@conquer/nucleo';

import { ejecutarBanco, jugarPartida, semillaDeRepeticion } from './ejecutar.ts';
import type { OpcionesDelBanco } from './ejecutar.ts';
import { ESCENARIOS } from './escenarios/index.ts';
import { PAN_DE_ARRANQUE_CON_HAMBRE } from './escenarios/hambre.ts';
import { componerCsv, componerInforme, componerSerieCsv } from './informe.ts';
import { mundoPeninsula } from './partida.ts';
import { componerManifiesto, textoDeManifiesto } from './procedencia.ts';

const PROCEDENCIA = { revision: 'prueba', etiqueta: 'prueba', cambios: '' };

const CORTA: OpcionesDelBanco = {
  semilla: '1492',
  turnos: 24,
  casas: CASAS,
  repeticiones: 1,
  escenario: 'normal',
  ausencia: true,
  estados: null,
};

describe('el ejecutor del banco', () => {
  it('con la misma semilla da el mismo informe, byte a byte', () => {
    const mundo = mundoPeninsula();
    const a = ejecutarBanco(CORTA, mundo);
    const b = ejecutarBanco(CORTA, mundo);
    const manifiesto = (r: typeof a) => componerManifiesto(r, mundo, TABLAS_DEL_JUEGO, PROCEDENCIA);
    expect(componerInforme(b, mundo, manifiesto(b))).toBe(componerInforme(a, mundo, manifiesto(a)));
    expect(componerCsv(b)).toBe(componerCsv(a));
    expect(componerSerieCsv(b)).toBe(componerSerieCsv(a));
    expect(textoDeManifiesto(manifiesto(b))).toBe(textoDeManifiesto(manifiesto(a)));
    expect(b.partidas[0]?.huellaFinal).toBe(a.partidas[0]?.huellaFinal);
  }, 60_000);

  it('con otra semilla da otra partida', () => {
    const mundo = mundoPeninsula();
    const a = ejecutarBanco({ ...CORTA, turnos: 6, ausencia: false }, mundo);
    const b = ejecutarBanco({ ...CORTA, turnos: 6, ausencia: false, semilla: '1212' }, mundo);
    expect(b.partidas[0]?.huellaFinal).not.toBe(a.partidas[0]?.huellaFinal);
  }, 60_000);

  it('una partida de 200 turnos con los ocho robots tarda menos de dos minutos', () => {
    const inicio = performance.now();
    const partida = jugarPartida({
      semilla: '1492',
      turnos: 200,
      casas: CASAS,
      cadencia: 1,
      reglas: TABLAS_DEL_JUEGO,
      mundo: mundoPeninsula(),
      estados: null,
    });
    const segundos = (performance.now() - inicio) / 1000;
    expect(partida.jugadores).toHaveLength(8);
    expect(partida.jugadores.every((j) => j.filas.length === 200)).toBe(true);
    expect(segundos).toBeLessThan(120);
  }, 120_000);

  it('las repeticiones usan semillas derivadas de la dada', () => {
    expect(semillaDeRepeticion('1492', 1)).toBe('1492');
    expect(semillaDeRepeticion('1492', 3)).toBe('1492-3');
    const resultado = ejecutarBanco({ ...CORTA, turnos: 3, repeticiones: 2, ausencia: false });
    expect(resultado.partidas.map((p) => p.semilla)).toEqual(['1492', '1492-2']);
    expect(resultado.ausentes).toHaveLength(0);
  }, 60_000);

  it('el robot ausente solo entra cada seis turnos', () => {
    const resultado = ejecutarBanco({ ...CORTA, turnos: 13 });
    const ausente = resultado.ausentes[0]?.jugadores[0];
    const decide = ausente?.filas.filter((f) => f.decidio === true).map((f) => f.turno);
    expect(decide).toEqual([1, 7, 13]);
  }, 60_000);

  it('el escenario de hambre empieza con el granero vacío y pasa más hambre', () => {
    const hambre = ESCENARIOS.hambre.reglas(TABLAS_DEL_JUEGO);
    expect(hambre.arranque.almacen.pan).toBe(PAN_DE_ARRANQUE_CON_HAMBRE);
    expect(hambre.arranque.edificiosDeOrigen['granja']).toBe(1);
    const mundo = mundoPeninsula();
    const turnosDeEscasez = (escenario: 'normal' | 'hambre'): number =>
      ejecutarBanco({ ...CORTA, escenario, ausencia: false }, mundo).partidas[0]?.jugadores.reduce(
        (total, j) => total + j.filas.filter((f) => f.escasez).length,
        0,
      ) ?? 0;
    expect(turnosDeEscasez('hambre')).toBeGreaterThan(turnosDeEscasez('normal'));
  }, 60_000);
});
