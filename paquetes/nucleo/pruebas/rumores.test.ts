// Rumores e informacion fechada (T-044 §4.2 y §4.3): la imprecision acotada, las vias por las que
// llegan, el determinismo, y que lo que se sabe conserva su fecha y no se actualiza solo.
import { describe, expect, it } from 'vitest';

import { CASAS_DE_OFICIO } from '../src/datos/casas.ts';
import { catalogoDePlazas } from '../src/reglas/plazas.ts';
import {
  preciosDeOido,
  redondearDeOido,
  sortearRumores,
  viasDeRumor,
} from '../src/reglas/rumores.ts';
import type { EstadoJugador, EstadoPartida, Recua } from '../src/tipos/estado.ts';
import type { IdFeria, IdMercado } from '../src/tipos/ids.ts';
import type { Mundo } from '../src/tipos/mundo.ts';
import type { TablasDeReglas } from '../src/tipos/reglas.ts';
import { azarDeTexto } from '../src/utiles/azar.ts';
import {
  PRIMAVERA,
  UNO,
  c,
  conComarca,
  escenario,
  mundo,
  recua,
  recursos,
  reglas,
  turno,
} from './recuas.ts';

const FERIA = 'feria-prueba';

/** El mundo mini con una feria grande en la vega, abierta todo el anyo. */
function mundoConFeria(volumen: 'pequenya' | 'mediana' | 'grande' = 'grande'): Mundo {
  const vega = mundo.comarcas['prueba-vega'];
  if (vega === undefined) throw new Error('el mundo mini ha cambiado');
  const todos = Array.from({ length: 24 }, (_, i) => i + 1);
  return {
    ...mundo,
    comarcas: {
      ...mundo.comarcas,
      'prueba-vega': {
        ...vega,
        rasgos: [...vega.rasgos, 'camino-de-santiago'],
        ferias: [
          {
            id: 'prueba' as IdFeria,
            nombre: 'Feria de Prueba',
            turnos: todos,
            volumen,
            recursosDestacados: [],
          },
        ],
      },
    },
  };
}

const quieta = (id: string, comarca: string): Recua =>
  recua(id, { situacion: { donde: 'comarca', comarca: c(comarca) } });

function jugadorDe(estado: EstadoPartida): EstadoJugador {
  const jugador = estado.jugadores[UNO];
  if (jugador === undefined) throw new Error('falta el jugador');
  return jugador;
}

const REAL: TablasDeReglas = { ...reglas, casas: CASAS_DE_OFICIO };

describe('la imprecisión de un rumor', () => {
  it('va a dos cifras significativas y nunca se aparta más de un 5 %', () => {
    expect(redondearDeOido(43_250)).toBe(43_000);
    expect(redondearDeOido(43_500)).toBe(44_000);
    expect(redondearDeOido(1_049)).toBe(1_000);
    expect(redondearDeOido(99)).toBe(99);
    const azar = azarDeTexto('rumores-acotados');
    for (let i = 0; i < 5000; i += 1) {
      const valor = azar.entreInclusive(0, 5_000_000);
      const oido = redondearDeOido(valor);
      expect(Math.abs(oido - valor) * 100).toBeLessThanOrEqual(valor * 5);
      expect(redondearDeOido(valor)).toBe(oido);
    }
  });

  it('se aplica a todos los precios, y lo que ya es redondo se queda igual', () => {
    const exactos = recursos({ pan: 3_250, lana: 51_700, sal: 14_000 });
    expect(preciosDeOido(exactos)).toEqual(recursos({ pan: 3_300, lana: 52_000, sal: 14_000 }));
  });
});

describe('por dónde llegan los rumores', () => {
  const conFeria = mundoConFeria();
  const abiertas = (estado: EstadoPartida) =>
    catalogoDePlazas(estado, conFeria, ['prueba' as IdFeria]).abiertas;

  it('una recua en una feria grande trae tres, y por el Camino de Santiago uno más', () => {
    const estado = escenario({ recuas: [quieta('recua-1', 'prueba-vega')] });
    expect(
      viasDeRumor(estado, conFeria, jugadorDe(estado), abiertas(estado), false, reglas),
    ).toEqual(['feria', 'feria', 'feria', 'camino']);
  });

  it('una venta propia es una oreja fija; sin nada de eso, no se oye nada', () => {
    const sinNada = escenario();
    expect(
      viasDeRumor(sinNada, conFeria, jugadorDe(sinNada), abiertas(sinNada), false, reglas),
    ).toEqual([]);
    const conVenta = conComarca(sinNada, 'prueba-llano', { edificios: { granja: 1, venta: 1 } });
    expect(
      viasDeRumor(conVenta, conFeria, jugadorDe(conVenta), abiertas(conVenta), false, reglas),
    ).toEqual(['venta']);
  });

  it('los corresponsales doblan lo que se oye, hasta el máximo del turno', () => {
    const estado = conComarca(
      escenario({ recuas: [quieta('recua-1', 'prueba-vega')] }),
      'prueba-llano',
      {
        edificios: { granja: 1, venta: 1 },
      },
    );
    const vias = viasDeRumor(estado, conFeria, jugadorDe(estado), abiertas(estado), true, reglas);
    expect(vias).toHaveLength(reglas.rumores.maximoPorTurno);
    expect(vias.slice(0, 2)).toEqual(['feria', 'feria']);
  });
});

describe('lo que se oye', () => {
  const conFeria = mundoConFeria();

  it('es determinista: la misma partida y el mismo turno oyen lo mismo', () => {
    const estado = conComarca(escenario({ turno: PRIMAVERA }), 'prueba-vega', {});
    const catalogo = catalogoDePlazas(estado, conFeria, ['prueba' as IdFeria]).abiertas;
    const conMercado: EstadoPartida = {
      ...estado,
      mercados: {
        [FERIA]: {
          id: FERIA as IdMercado,
          comarca: c('prueba-vega'),
          tipo: 'feria',
          volumen: 'grande',
          preciosMil: recursos({ pan: 3_250 }),
          ultimoVolumen: recursos(),
        },
      },
    };
    const oir = () =>
      sortearRumores(
        conMercado,
        conFeria,
        jugadorDe(conMercado),
        catalogo,
        ['venta', 'venta'],
        PRIMAVERA,
        reglas,
      );
    expect(oir()).toEqual(oir());
    expect(oir().length).toBeGreaterThan(0);
  });

  it('en el motor: los precios oídos quedan redondeados, con su fecha y su fuente', () => {
    const inicial = {
      ...conComarca(escenario({ turno: PRIMAVERA }), 'prueba-llano', {
        edificios: { granja: 1, venta: 1 },
      }),
    };
    // Primer turno: abre la feria; alguien ha tenido que estar para que haya precios.
    const conPrecios = turno(
      { ...inicial, recuas: { 'recua-1': quieta('recua-1', 'prueba-vega') } },
      [],
      reglas,
      conFeria,
    ).estado;
    const exactos = conPrecios.mercados[FERIA]?.preciosMil;
    expect(jugadorDe(conPrecios).plazas[FERIA]).toEqual({
      turno: PRIMAVERA,
      fuente: 'visita',
      preciosMil: exactos,
      visitada: true,
    });
    // Sin recua en la feria, la venta sigue trayendo rumores de ella.
    let estado: EstadoPartida = { ...conPrecios, recuas: {} };
    let oido = false;
    for (let i = 0; i < 12 && !oido; i += 1) {
      const resultado = turno(estado, [], reglas, conFeria);
      estado = resultado.estado;
      oido = resultado.sucesos.some((s) => s.tipo === 'rumor.precios');
    }
    expect(oido).toBe(true);
    const sabido = jugadorDe(estado).plazas[FERIA];
    expect(sabido?.fuente).toBe('rumor');
    expect(sabido?.visitada).toBe(true);
    for (const valor of Object.values(sabido?.preciosMil ?? {})) {
      expect(redondearDeOido(valor)).toBe(valor);
    }
  });
});

describe('la información fechada', () => {
  const conFeria = mundoConFeria('pequenya');

  it('lo que se supo conserva su turno y no se actualiza solo', () => {
    const inicial = escenario({ turno: PRIMAVERA, recuas: [quieta('recua-1', 'prueba-vega')] });
    const visto = turno(inicial, [], reglas, conFeria).estado;
    expect(jugadorDe(visto).plazas[FERIA]?.turno).toBe(PRIMAVERA);
    // Se va la recua: los turnos pasan y lo sabido se queda como estaba (sin venta ni feria, nadie
    // trae rumores).
    let estado: EstadoPartida = { ...visto, recuas: {} };
    for (let i = 0; i < 5; i += 1) estado = turno(estado, [], reglas, conFeria).estado;
    expect(jugadorDe(estado).plazas[FERIA]).toEqual(jugadorDe(visto).plazas[FERIA]);
  });

  it('una comarca explorada se ve al día solo cuando hay una recua propia en ella', () => {
    const inicial = escenario({ turno: PRIMAVERA });
    const antes = jugadorDe(inicial).conocimiento['prueba-sierra'];
    const sinRecua = turno(inicial, [], reglas, conFeria).estado;
    expect(jugadorDe(sinRecua).conocimiento['prueba-sierra']).toEqual(antes);
    const conRecua = turno(
      { ...inicial, recuas: { 'recua-1': quieta('recua-1', 'prueba-sierra') } },
      [],
      reglas,
      conFeria,
    ).estado;
    const ahora = jugadorDe(conRecua).conocimiento['prueba-sierra'];
    expect(ahora?.turnoUltimaNoticia).toBe(PRIMAVERA);
    expect(ahora?.datos?.poblacion).toBe(conRecua.comarcas['prueba-sierra']?.poblacion);
  });

  it('los corresponsales de los mercaderes escriben cada turno de las plazas que visitaron', () => {
    const visita = (casa: 'mercaderes' | 'mesta') => {
      let estado: EstadoPartida = escenario({
        turno: PRIMAVERA,
        recuas: [quieta('recua-1', 'prueba-vega')],
        jugador: { casa },
      });
      estado = turno(estado, [], REAL, conFeria).estado;
      estado = { ...estado, recuas: {} };
      estado = turno(estado, [], REAL, conFeria).estado;
      return jugadorDe(estado).plazas[FERIA];
    };
    expect(visita('mercaderes')).toMatchObject({ turno: PRIMAVERA + 1, fuente: 'corresponsal' });
    expect(visita('mesta')).toMatchObject({ turno: PRIMAVERA, fuente: 'visita' });
  });
});
