// El tutorial (ficha T-090, criterio 5): avanza cuando el jugador hace cada paso, y saltado no vuelve.
import { describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO } from '@conquer/nucleo';

import {
  PASOS_DEL_TUTORIAL,
  alDia,
  junto,
  leerProgreso,
  progresoInicial,
  saltar,
  siguiente,
  terminado,
} from './tutorial.ts';
import type { SituacionDelTutorial } from './tutorial.ts';

const NADA: SituacionDelTutorial = {
  turno: 3,
  capital: 'burgos',
  comarcaAbierta: null,
  abiertaEsPropia: false,
  ordenes: 0,
};

describe('el tutorial', () => {
  it('no se salta los pasos que piden «Entendido», y avanza solo con lo que el jugador hace', () => {
    let p = progresoInicial(3);
    // Aunque ya tenga la capital abierta, los dos primeros pasos piden «Entendido».
    p = alDia(p, { ...NADA, comarcaAbierta: 'burgos', abiertaEsPropia: true });
    expect(PASOS_DEL_TUTORIAL[p.paso]?.id).toBe('casa');
    p = siguiente(p);
    expect(PASOS_DEL_TUTORIAL[p.paso]?.id).toBe('recursos');
    p = siguiente(p);
    p = alDia(p, NADA);
    expect(PASOS_DEL_TUTORIAL[p.paso]?.id).toBe('capital');
    p = alDia(p, { ...NADA, comarcaAbierta: 'burgos', abiertaEsPropia: true });
    expect(PASOS_DEL_TUTORIAL[p.paso]?.id).toBe('obra');
    p = alDia(p, { ...NADA, ordenes: 1 });
    expect(PASOS_DEL_TUTORIAL[p.paso]?.id).toBe('turno');
    expect(alDia(p, { ...NADA, ordenes: 1 })).toBe(p);
    p = alDia(p, { ...NADA, turno: 4, comarcaAbierta: 'vecina' });
    // Pasado el turno, y con una vecina abierta, se cumplen los dos últimos a la vez.
    expect(terminado(p)).toBe(true);
  });

  it('saltado no vuelve, y lo guardado que no se entiende empieza de nuevo', () => {
    const p = saltar(progresoInicial(1));
    expect(terminado(p)).toBe(true);
    expect(leerProgreso(JSON.stringify(p), 9)).toEqual(p);
    expect(leerProgreso('{roto', 9)).toEqual(progresoInicial(9));
    expect(leerProgreso(null, 2)).toEqual(progresoInicial(2));
  });
});

describe('dónde va la tarjeta del tutorial', () => {
  const tarjeta = { ancho: 300, alto: 200 };
  const ventana = { ancho: 1400, alto: 900 };

  it('a la derecha de lo que señala si cabe; si no, a la izquierda; y si tampoco, debajo', () => {
    expect(junto({ x: 100, y: 100, ancho: 200, alto: 40 }, tarjeta, ventana)).toEqual({
      x: 316,
      y: 20,
    });
    expect(junto({ x: 1000, y: 400, ancho: 300, alto: 100 }, tarjeta, ventana)).toEqual({
      x: 684,
      y: 350,
    });
    const ancho = junto({ x: 0, y: 100, ancho: 1400, alto: 50 }, tarjeta, ventana);
    expect(ancho).toEqual({ x: 550, y: 166 });
  });

  it('nunca se sale de la ventana', () => {
    const p = junto({ x: 0, y: 850, ancho: 1400, alto: 40 }, tarjeta, ventana);
    expect(p.y + tarjeta.alto).toBeLessThanOrEqual(ventana.alto);
    expect(p.y).toBeGreaterThanOrEqual(16);
  });

  it('cada paso señala algo de la pantalla, y el de la casa habla de la casa con que se juega', () => {
    for (const paso of PASOS_DEL_TUTORIAL)
      expect(paso.objetivo('burgos').length, paso.id).toBeGreaterThan(0);
    const mercaderes = TABLAS_DEL_JUEGO.casas.mercaderes;
    const primero = PASOS_DEL_TUTORIAL[0];
    expect(primero?.titulo(mercaderes)).toBe(`Juegas con ${mercaderes.nombre}`);
    expect(primero?.texto(mercaderes)).toContain(mercaderes.limite);
  });

  it('la primera orden prefiere una obra; si no, formar recua (los mercaderes empiezan sin solar)', () => {
    const obra = PASOS_DEL_TUTORIAL.find((p) => p.id === 'obra');
    const selectores = obra?.objetivo('burgos') ?? [];
    const construir = selectores.findIndex((s) => s.includes('construir-'));
    const recua = selectores.findIndex((s) => s.includes('formar-recua'));
    expect(construir).toBeGreaterThan(-1);
    expect(recua).toBeGreaterThan(construir);
  });
});
