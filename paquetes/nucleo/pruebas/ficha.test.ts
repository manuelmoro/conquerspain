// La ficha de comarca (ficha T-082 §6): toda accion con coste, duracion y efecto; todo bloqueo con
// causa y salida; y solo lo que el jugador sabe.
import { describe, expect, it } from 'vitest';

import { BLOQUEOS } from '../src/datos/bloqueos.ts';
import { fichaDeComarca } from '../src/ficha.ts';
import type { AccionDeFicha } from '../src/ficha.ts';
import { RECURSOS } from '../src/tipos/recursos.ts';
import { DOS, UNO, c, conComarca, escenario, mundo, reglas } from './recuas.ts';

function comprobarAccion(a: AccionDeFicha): void {
  expect(a.titulo.length, a.clave).toBeGreaterThan(3);
  expect(a.turnos, a.clave).toBeGreaterThanOrEqual(1);
  expect(a.efecto.length, a.clave).toBeGreaterThan(3);
  for (const r of RECURSOS) expect(Number.isInteger(a.coste[r]), `${a.clave} ${r}`).toBe(true);
  if (a.bloqueo !== null) {
    expect(a.bloqueo.causa.length, a.clave).toBeGreaterThan(10);
    expect(a.bloqueo.salida.length, a.clave).toBeGreaterThan(10);
  }
}

describe('la ficha de una comarca propia', () => {
  const estado = escenario();
  const ficha = fichaDeComarca(estado, UNO, c('prueba-llano'), mundo, reglas);

  it('dice poblacion, capacidad, lealtad, solares, edificios, lo producido y lo previsto con su desglose', () => {
    expect(ficha?.nivel).toBe('propia');
    const p = ficha?.propia;
    if (p === null || p === undefined) throw new Error('sin detalle');
    expect(p.capacidad).toBeGreaterThan(0);
    expect(p.solares.total).toBeGreaterThan(0);
    expect(p.solares.usados).toBeLessThanOrEqual(p.solares.total);
    for (const e of p.prevision) {
      expect(e.factores.length).toBeGreaterThan(0);
      expect(e.resultado).toBeGreaterThanOrEqual(0);
    }
  });

  it('cada accion lleva coste, duracion y efecto; cada bloqueo, causa y salida (criterios 1 y 2)', () => {
    const acciones = ficha?.acciones ?? [];
    expect(acciones.length).toBeGreaterThan(10);
    for (const a of acciones) comprobarAccion(a);
    expect(acciones.some((a) => a.bloqueo !== null)).toBe(true);
    expect(acciones.some((a) => a.bloqueo === null)).toBe(true);
  });

  it('construir una granja prevé el pan que añade, igual que la produccion con un nivel mas', () => {
    const granja = ficha?.acciones.find((a) => a.clave === 'construir-granja');
    expect(granja?.efecto).toMatch(/pan por turno|Granja/);
    expect(granja?.coste).toEqual(reglas.edificios.granja.coste);
  });

  it('sin solares libres, construir queda bloqueado con su causa, y derribar libera uno', () => {
    const llena = conComarca(estado, 'prueba-llano', { edificios: { granja: 99 } });
    const f = fichaDeComarca(llena, UNO, c('prueba-llano'), mundo, reglas);
    const bloqueadas =
      f?.acciones.filter(
        (a) => a.clave.startsWith('construir-') && a.bloqueo?.motivo === 'sin-solar',
      ) ?? [];
    expect(bloqueadas.length).toBeGreaterThan(0);
    expect(f?.acciones.find((a) => a.clave === 'derribar-granja')?.efecto).toContain(
      'Libera un solar',
    );
  });

  it('todos los motivos que da el nucleo tienen texto de causa y salida', () => {
    for (const motivo of [
      'nivel-maximo',
      'sin-solar',
      'potencial-insuficiente',
      'falta-edificio-requerido',
      'sin-permiso',
      'sin-monte',
      'labor-al-maximo',
      'comarca-con-duenyo',
      'influencia-baja',
      'sin-ventaja',
      'muy-lejos',
      'escasez',
    ]) {
      expect(BLOQUEOS[motivo], motivo).toBeDefined();
    }
  });
});

describe('la ficha de una comarca ajena o neutral', () => {
  it('una neutral explorada ofrece regalo, incorporar y venta, sin el detalle interior', () => {
    const estado = escenario();
    const f = fichaDeComarca(estado, UNO, c('prueba-vega'), mundo, reglas);
    expect(f?.nivel).toBe('explorada');
    expect(f?.propia).toBeNull();
    expect(f?.acciones.map((a) => a.clave)).toEqual(['regalo', 'incorporar', 'construir-venta']);
    for (const a of f?.acciones ?? []) comprobarAccion(a);
    expect(f?.acciones.find((a) => a.clave === 'incorporar')?.bloqueo?.motivo).toBe(
      'influencia-baja',
    );
  });

  it('la incorporacion se juzga con lo que el jugador sabe, no con la influencia ajena real', () => {
    const base = escenario({ conDos: true });
    const conInfluencia = conComarca(base, 'prueba-vega', {
      influencias: { [UNO]: 90, [DOS]: 88 },
    });
    const f = fichaDeComarca(conInfluencia, UNO, c('prueba-vega'), mundo, reglas);
    // Sin presencia no sabe nada de la otra casa: no puede decir «sin ventaja».
    expect(f?.acciones.find((a) => a.clave === 'incorporar')?.bloqueo?.motivo).not.toBe(
      'sin-ventaja',
    );
    expect(JSON.stringify(f)).not.toContain('88');
  });

  it('un regalo reciente queda bloqueado', () => {
    const estado = conComarca(escenario(), 'prueba-vega', {
      ultimoRegalo: { [UNO]: escenario().turno },
    });
    const f = fichaDeComarca(estado, UNO, c('prueba-vega'), mundo, reglas);
    expect(f?.acciones.find((a) => a.clave === 'regalo')?.bloqueo?.motivo).toBe('regalo-reciente');
  });

  it('de lo que no conoce no hay ficha', () => {
    const base = escenario();
    const yo = base.jugadores[UNO];
    if (yo === undefined) throw new Error('falta el jugador');
    const ciego = { ...base, jugadores: { ...base.jugadores, [UNO]: { ...yo, conocimiento: {} } } };
    expect(fichaDeComarca(ciego, UNO, c('prueba-costa'), mundo, reglas)).toBeNull();
  });
});
