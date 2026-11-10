// El emisario (ficha T-102, docs/06 §6.5.3): en tierra de otra casa reune en dos turnos un informe de
// todo su dominio, y el espiado se entera de la visita.
import { describe, expect, it } from 'vitest';

import { fichaDeComarca } from '../src/ficha.ts';
import { datosConocidosDe } from '../src/reglas/explorar.ts';
import type { ComarcaMundo } from '../src/tipos/mundo.ts';
import type { EstadoPartida, Recua } from '../src/tipos/estado.ts';
import {
  DOS,
  UNO,
  c,
  comarcaDe,
  conComarca,
  escenario,
  mundo,
  recua,
  recursos,
  reglas,
  turno,
} from './recuas.ts';

const RIO = 'prueba-rio';

function conEmisario(donde: string): EstadoPartida {
  const emisario: Recua = recua('recua-1', {
    jugador: UNO,
    situacion: { donde: 'comarca', comarca: c(donde) },
    cometido: 'emisario',
    carga: recursos({ pan: 40, sal: 5 }),
  });
  const base = escenario({ conDos: true, recuas: [emisario] });
  return conComarca(conComarca(base, RIO, { duenyo: DOS, poblacion: 77 }), 'prueba-costa', {
    duenyo: DOS,
  });
}

describe('el emisario', () => {
  it('el primer turno lo ve el espiado; al segundo trae el informe de todo el dominio y acaba', () => {
    const inicial = conEmisario(RIO);
    const primero = turno(inicial);
    expect(
      primero.sucesos
        .filter((s) => s.tipo === 'emisario.visto')
        .map((s) => [s.jugador, s.datos['de']]),
    ).toEqual([[DOS, UNO]]);
    expect(primero.sucesos.some((s) => s.tipo === 'emisario.informe')).toBe(false);

    const segundo = turno(primero.estado);
    const informe = segundo.sucesos.find((s) => s.tipo === 'emisario.informe');
    expect(informe).toMatchObject({ jugador: UNO, datos: { de: DOS, comarcas: 2 } });
    const sabe = segundo.estado.jugadores[UNO]?.conocimiento ?? {};
    for (const id of [RIO, 'prueba-costa']) {
      expect(sabe[id]).toMatchObject({
        nivel: 'explorada',
        turnoUltimaNoticia: primero.estado.turno,
      });
    }
    expect(sabe[RIO]?.datos?.poblacion).toBe(segundo.estado.comarcas[RIO]?.poblacion);
    expect(segundo.estado.recuas['recua-1']?.cometido).toBeNull();
    // El segundo turno ya no se avisa otra vez al espiado.
    expect(segundo.sucesos.some((s) => s.tipo === 'emisario.visto')).toBe(false);
  });

  it('en tierra de nadie no hace nada: no hay dominio que contar', () => {
    const { estado, sucesos } = turno(conEmisario('prueba-vega'));
    expect(sucesos.find((s) => s.tipo === 'cometido.sin-efecto')?.datos['motivo']).toBe(
      'comarca-sin-duenyo',
    );
    expect(estado.recuas['recua-1']?.cometido).toBeNull();
  });
});

function geografiaDe(id: string): ComarcaMundo {
  const g = mundo.comarcas[id];
  if (g === undefined) throw new Error(`falta ${id}`);
  return g;
}

describe('mandar un emisario desde la ficha', () => {
  it('una comarca de otra casa, explorada, ofrece la misión con sus órdenes', () => {
    const casa: Recua = recua('recua-1', { jugador: UNO, carga: recursos({}) });
    const base = conComarca(escenario({ conDos: true, recuas: [casa] }), RIO, { duenyo: DOS });
    const yo = base.jugadores[UNO];
    if (yo === undefined) throw new Error('falta UNO');
    const estado: EstadoPartida = {
      ...base,
      jugadores: {
        ...base.jugadores,
        [UNO]: {
          ...yo,
          conocimiento: {
            ...yo.conocimiento,
            [RIO]: {
              nivel: 'explorada',
              turnoUltimaNoticia: 1,
              datos: datosConocidosDe(comarcaDe(base, RIO), geografiaDe(RIO)),
            },
          },
        },
      },
    };
    const accion = fichaDeComarca(estado, UNO, c(RIO), mundo, reglas)?.acciones.find(
      (a) => a.clave === 'mision-emisario',
    );
    expect(accion?.titulo).toBe('Enviar un emisario');
    if (accion?.bloqueo === null) {
      expect(accion.intenciones.map((i) => i['tipo'])).toEqual([
        'carga',
        'ruta',
        'cometido',
        'ruta',
      ]);
      expect(accion.intenciones[2]).toMatchObject({ cometido: 'emisario' });
    }
  });
});
