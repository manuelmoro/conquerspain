// Anular una orden que espera (T-092, tras jugar): unos aperos sin hierro se quedaban en cola para
// siempre y no habia forma de quitarlos. Lo que aun no ha empezado se anula; lo empezado, no.
import { describe, expect, it } from 'vitest';

import { construirOrden, validarIntencion } from '../src/ordenes/intencion.ts';
import type { IdOrden } from '../src/tipos/ids.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import { UNO, base, c, escenario, mundo, reglas, turno } from './recuas.ts';

function aperosSinHierro(t: number): Orden {
  return {
    ...base(t, { hierro: 8 }),
    tipo: 'aperos',
    comarca: c('prueba-llano'),
    cola: 'comarca:prueba-llano',
  };
}

function anular(t: number, orden: string): Orden {
  return { ...base(t), tipo: 'anular', orden: orden as IdOrden };
}

describe('anular una orden', () => {
  const inicial = escenario({ almacen: { hierro: 0 } });
  const aperos = aperosSinHierro(inicial.turno);
  const conCola = turno(inicial, [aperos]).estado;

  it('la orden que espera en cola se anula y sale de la cola', () => {
    expect(conCola.ordenes).toEqual([
      expect.objectContaining({ id: aperos.id, estado: 'en cola', motivoEspera: 'sin-recursos' }),
    ]);
    const { estado, sucesos } = turno(conCola, [anular(conCola.turno, aperos.id)]);
    expect(estado.ordenes).toEqual([]);
    expect(Object.keys(estado.jugadores[UNO]?.colas ?? {})).toEqual([]);
    expect(
      sucesos.some(
        (s) =>
          s.tipo === 'orden.estado' &&
          s.datos['orden'] === aperos.id &&
          s.datos['estado'] === 'cancelada' &&
          s.datos['motivo'] === 'anulada',
      ),
    ).toBe(true);
  });

  it('la que ya no está no se anula: se cae la anulación y lo demás sigue', () => {
    const { estado, sucesos } = turno(conCola, [anular(conCola.turno, 'orden-que-no-hay')]);
    expect(estado.ordenes.map((o) => o.id)).toEqual([aperos.id]);
    const caidas = sucesos.filter(
      (s) => s.tipo === 'orden.estado' && s.datos['motivo'] === 'orden-no-anulable',
    );
    expect(caidas).toHaveLength(1);
  });

  it('lo ya empezado no se puede pedir anular', () => {
    const enCurso: Orden = { ...aperos, estado: 'en curso', motivoEspera: null };
    const estado = { ...conCola, ordenes: [enCurso] };
    const forma = validarIntencion({ idCliente: 'x', tipo: 'anular', orden: aperos.id });
    if (!forma.ok) throw new Error('intencion invalida');
    const ctx = { estado, jugador: UNO, mundo, reglas };
    const r = construirOrden(forma.valor, { ...ctx, id: 'o-x' as IdOrden });
    expect(r.ok).toBe(false);
    const enCola = construirOrden(forma.valor, {
      ...ctx,
      estado: conCola,
      id: 'o-y' as IdOrden,
    });
    expect(enCola.ok).toBe(true);
  });
});
