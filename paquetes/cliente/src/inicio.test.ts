// La entrada al juego en palabras (ficha T-086, criterio 3): el hambre y el turno sin ordenes se
// avisan con texto, y cada convocatoria dice lo que toca.
import { describe, expect, it } from 'vitest';

import type { ConvocatoriaRecibida, PartidaDeLaLista } from './api.ts';
import { abastecimiento, esperaOrdenes, pasoDe, ritmoEnPalabras } from './inicio.ts';

const PARTIDA: PartidaDeLaLista = {
  id: 'p',
  nombre: 'P',
  casa: 'mesta',
  turno: 5,
  estado: 'activa',
  proximaResolucion: null,
  resumen: {
    fecha: 'f',
    prestigio: 10,
    puesto: 1,
    casas: 2,
    pan: 30,
    turnosDePan: 2,
    escasez: false,
  },
  ordenesDadas: 0,
};

const CONVOCATORIA: ConvocatoriaRecibida = {
  id: 'c',
  nombre: 'C',
  estado: 'abierta',
  intervaloMinutos: 1440,
  plazas: 3,
  esDePrueba: false,
  codigo: null,
  jugadores: [{ casa: 'mesta', nombre: 'Yo', haElegido: false }],
  misOfertas: [],
  miEleccion: null,
  avisos: [],
  partida: null,
};

describe('lo que avisa la lista', () => {
  it('el pan que queda, urgente si es poco; el hambre, con su texto', () => {
    expect(abastecimiento(PARTIDA)).toEqual({ texto: 'Pan para 2 turnos', urgente: true });
    const base = PARTIDA.resumen;
    if (base === null) throw new Error('sin resumen');
    expect(abastecimiento({ ...PARTIDA, resumen: { ...base, escasez: true } })).toEqual({
      texto: 'Hambre: falta pan',
      urgente: true,
    });
    expect(abastecimiento({ ...PARTIDA, resumen: { ...base, turnosDePan: 9 } })?.urgente).toBe(
      false,
    );
    expect(abastecimiento({ ...PARTIDA, resumen: null })).toBeNull();
  });

  it('espera órdenes la partida activa en la que no se ha dado ninguna', () => {
    expect(esperaOrdenes(PARTIDA)).toBe(true);
    expect(esperaOrdenes({ ...PARTIDA, ordenesDadas: 2 })).toBe(false);
    expect(esperaOrdenes({ ...PARTIDA, estado: 'detenida' })).toBe(false);
  });
});

describe('lo que toca en cada convocatoria', () => {
  it('quien convoca sortea; los demás esperan; con ofertas, se elige; fundada, se abre', () => {
    expect(pasoDe(CONVOCATORIA)).toEqual({ tipo: 'esperar-jugadores', faltan: 2, codigo: null });
    expect(pasoDe({ ...CONVOCATORIA, codigo: 'abc' })).toEqual({
      tipo: 'sortear',
      faltan: 2,
      codigo: 'abc',
    });
    const oferta = { comarca: 'x', nombre: 'X', perfil: 'labor', ventaja: 'v', limitacion: 'l' };
    expect(pasoDe({ ...CONVOCATORIA, estado: 'eligiendo', misOfertas: [oferta] }).tipo).toBe(
      'elegir-origen',
    );
    expect(
      pasoDe({ ...CONVOCATORIA, estado: 'eligiendo', misOfertas: [oferta], miEleccion: 'x' }),
    ).toEqual({ tipo: 'esperar-eleccion', faltan: 1 });
    expect(pasoDe({ ...CONVOCATORIA, partida: 'p1' })).toEqual({ tipo: 'abrir', partida: 'p1' });
    expect(ritmoEnPalabras(1440)).toBe('Un turno cada día');
  });
});
