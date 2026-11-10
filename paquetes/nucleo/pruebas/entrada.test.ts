// Entrar en una partida empezada (ficha T-107): las ofertas libres y lejos de todos, la orden que
// lo da de alta en la fase 0 con su arranque, su alfoz y su amparo, y lo que no se puede.
import { describe, expect, it } from 'vitest';

import { CASAS_DE_OFICIO } from '../src/datos/casas.ts';
import { impedimentoDeEntrada, ofertasDeEntrada } from '../src/partidas/entrada.ts';
import type { EstadoPartida } from '../src/tipos/estado.ts';
import type { IdComarca, IdJugador } from '../src/tipos/ids.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import type { Casa, TablasDeReglas } from '../src/tipos/reglas.ts';
import { CASAS } from '../src/tipos/reglas.ts';
import { base, comarcaDe, escenario, mundo, reglas, turno } from './recuas.ts';

// Las casas de verdad (sus origenes) y un mundo pequeño: basta con dos jornadas de separación.
const REALES: TablasDeReglas = {
  ...reglas,
  casas: CASAS_DE_OFICIO,
  arranque: {
    ...reglas.arranque,
    recorte: { ...reglas.arranque.recorte, jornadasEntreCapitales: 2 },
  },
};
const NUEVO = 'casa-nueva' as IdJugador;

/** La primera casa que tiene sitio en el mundo de prueba, con sus ofertas. */
function conSitio(estado: EstadoPartida) {
  for (const casa of CASAS) {
    const ofertas = ofertasDeEntrada(estado, mundo, REALES, { id: NUEVO, nombre: 'Nueva', casa });
    if (ofertas.length > 0) return { casa, ofertas };
  }
  throw new Error('ninguna casa tiene sitio en el mundo de prueba');
}

function ordenDeEntrar(estado: EstadoPartida, casa: Casa, comarca: IdComarca): Orden {
  return { ...base(estado.turno), jugador: NUEVO, tipo: 'entrar', casa, nombre: 'Nueva', comarca };
}

describe('las ofertas de entrada', () => {
  it('son comarcas libres y lejos de cualquier comarca con dueño, las mismas si se pregunta otra vez', () => {
    const estado = escenario();
    const { casa, ofertas } = conSitio(estado);
    for (const o of ofertas) {
      expect(comarcaDe(estado, o.comarca).duenyo).toBeNull();
      expect(o.comarca).not.toBe('prueba-llano');
    }
    expect(ofertasDeEntrada(estado, mundo, REALES, { id: NUEVO, nombre: 'Nueva', casa })).toEqual(
      ofertas,
    );
  });
});

describe('la orden entrar (criterio 1 y 2)', () => {
  it('da de alta al jugador en la fase 0 con su capital, su arranque, su alfoz y su amparo', () => {
    const estado = escenario();
    const { casa, ofertas } = conSitio(estado);
    const comarca = ofertas[0]?.comarca;
    if (comarca === undefined) throw new Error('sin oferta');
    const { estado: despues, sucesos } = turno(
      estado,
      [ordenDeEntrar(estado, casa, comarca)],
      REALES,
    );
    const nuevo = despues.jugadores[NUEVO];
    expect(nuevo?.capital).toBe(comarca);
    expect(nuevo?.amparoHasta).toBe(estado.turno + REALES.ausencia.turnosDeAmparo);
    expect(comarcaDe(despues, comarca).duenyo).toBe(NUEVO);
    expect(comarcaDe(despues, comarca).lealtad).toBeGreaterThan(90);
    expect(sucesos.find((s) => s.tipo === 'jugador.entra')).toMatchObject({
      jugador: null,
      comarca,
      datos: { de: NUEVO },
    });
    // Juega desde este turno: sigue presente y su almacén tiene el arranque.
    expect(nuevo?.turnosSinOrdenes).toBe(0);
    expect((nuevo?.almacen.pan ?? 0) + (nuevo?.almacen.maravedis ?? 0)).toBeGreaterThan(0);
  });

  it('nadie más ve cambiado su estado por la entrada, salvo la comarca que ocupa (criterio 3)', () => {
    const estado = escenario();
    const { casa, ofertas } = conSitio(estado);
    const comarca = ofertas[0]?.comarca;
    if (comarca === undefined) throw new Error('sin oferta');
    const con = turno(estado, [ordenDeEntrar(estado, casa, comarca)], REALES).estado;
    const sin = turno(estado, [], REALES).estado;
    expect(con.jugadores['casa-uno']?.almacen).toEqual(sin.jugadores['casa-uno']?.almacen);
    expect(comarcaDe(con, 'prueba-llano')).toEqual(comarcaDe(sin, 'prueba-llano'));
  });

  it('no se entra en un origen que no se ofrece, ni dos veces', () => {
    const estado = escenario();
    const { casa } = conSitio(estado);
    const participante = { id: NUEVO, nombre: 'Nueva', casa };
    expect(
      impedimentoDeEntrada(estado, mundo, REALES, participante, 'prueba-llano' as IdComarca),
    ).toBe('origen-no-ofrecido');
    const conUno = { ...participante, id: 'casa-uno' as IdJugador };
    expect(impedimentoDeEntrada(estado, mundo, REALES, conUno, 'prueba-vega' as IdComarca)).toBe(
      'ya-en-la-partida',
    );
    const { sucesos } = turno(
      estado,
      [ordenDeEntrar(estado, casa, 'prueba-llano' as IdComarca)],
      REALES,
    );
    expect(
      sucesos.find((s) => s.tipo === 'orden.estado' && s.datos['estado'] === 'cancelada')?.datos[
        'motivo'
      ],
    ).toBe('origen-no-ofrecido');
  });
});
