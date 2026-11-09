// El tutorial (ficha T-090, criterio 5): avanza cuando el jugador hace cada paso, y saltado no vuelve.
import { describe, expect, it } from 'vitest';

import {
  PASOS_DEL_TUTORIAL,
  alDia,
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
    // Aunque ya tenga la capital abierta, el primer paso pide «Entendido».
    p = alDia(p, { ...NADA, comarcaAbierta: 'burgos', abiertaEsPropia: true });
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
