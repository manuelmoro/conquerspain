// Ausencia y amparo (ficha T-105): el contador, los escalones con sus avisos, la lealtad que baja con
// suelo, las comarcas que el concejo deja cortejar (salvo la capital), el reingreso que lo devuelve
// todo, y el amparo frente al portazgo y el cortejo.
import { describe, expect, it } from 'vitest';

import { CASAS_DE_OFICIO } from '../src/datos/casas.ts';
import { cortejable, situacionDeAusencia } from '../src/reglas/ausencia.ts';
import { impedimentoDeIncorporar } from '../src/reglas/incorporar.ts';
import { peajeDe } from '../src/reglas/portazgos.ts';
import { claveDeTramo } from '../src/reglas/ruta.ts';
import type { EstadoJugador, EstadoPartida } from '../src/tipos/estado.ts';
import type { IdJugador } from '../src/tipos/ids.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import {
  DOS,
  UNO,
  base,
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

const t = reglas.ausencia;

function jugadorDe(estado: EstadoPartida, id: IdJugador): EstadoJugador {
  const j = estado.jugadores[id];
  if (j === undefined) throw new Error(`falta ${id}`);
  return j;
}

function con(estado: EstadoPartida, id: IdJugador, cambios: Partial<EstadoJugador>): EstadoPartida {
  return {
    ...estado,
    jugadores: { ...estado.jugadores, [id]: { ...jugadorDe(estado, id), ...cambios } },
  };
}

/** UNO (dueño del llano, su capital, y de la vega) lleva `turnos` sin órdenes; DOS da una orden. */
function partida(turnos: number): EstadoPartida {
  const estado = conComarca(escenario({ conDos: true }), 'prueba-vega', {
    duenyo: UNO,
    lealtad: 80,
  });
  return con(estado, UNO, { turnosSinOrdenes: turnos });
}

function ordenDe(estado: EstadoPartida, jugador: IdJugador): Orden {
  return {
    ...base(estado.turno),
    jugador,
    tipo: 'politica',
    comarca: jugadorDe(estado, jugador).capital,
    fuero: null,
    cargaFiscal: null,
    dehesa: null,
    conservarConSal: null,
  };
}

describe('el contador y los escalones', () => {
  it('suma sin órdenes y vuelve a cero con una', () => {
    const estado = partida(0);
    const sin = turno(estado).estado;
    expect(jugadorDe(sin, UNO).turnosSinOrdenes).toBe(1);
    const conOrden = turno(sin, [ordenDe(sin, UNO)]).estado;
    expect(jugadorDe(conOrden, UNO).turnosSinOrdenes).toBe(0);
  });

  it('avisa a los 5, anuncia a todos a los 15 y a los 30', () => {
    const tipos = (antes: number) =>
      turno(partida(antes - 1)).sucesos.map((s) => [s.tipo, s.jugador]);
    expect(tipos(t.turnosParaAvisar)).toContainEqual(['ausencia.aviso', UNO]);
    expect(tipos(t.turnosParaAusente)).toContainEqual(['ausencia.ausente', null]);
    expect(tipos(t.turnosParaConcejo)).toContainEqual(['ausencia.concejo', null]);
  });

  it('ausente, la lealtad baja despacio y nunca de 50 (criterio 1)', () => {
    let estado = partida(t.turnosParaAusente);
    expect(comarcaDe(turno(estado).estado, 'prueba-vega').lealtad).toBeLessThan(80);
    for (let i = 0; i < 60; i += 1) estado = turno(estado).estado;
    expect(comarcaDe(estado, 'prueba-vega').lealtad).toBeGreaterThanOrEqual(t.lealtadMinimaAusente);
    expect(comarcaDe(estado, 'prueba-vega').duenyo).toBe(UNO);
    expect(situacionDeAusencia(jugadorDe(estado, UNO), reglas)).toBe('concejo');
  });
});

describe('la administración del concejo (criterio 1)', () => {
  it('sus comarcas se cortejan e incorporan como neutrales, salvo la capital', () => {
    const estado = partida(t.turnosParaConcejo);
    expect(cortejable(estado, comarcaDe(estado, 'prueba-vega'), DOS, reglas)).toBe(true);
    expect(cortejable(estado, comarcaDe(estado, 'prueba-llano'), DOS, reglas)).toBe(false);
    expect(cortejable(estado, comarcaDe(estado, 'prueba-vega'), UNO, reglas)).toBe(false);
    // Con influencia y la vega a mano, DOS la puede incorporar.
    const conRio = conComarca(estado, 'prueba-rio', { duenyo: DOS });
    const cortejada = conComarca(conRio, 'prueba-vega', { influencias: { [DOS]: 80 } });
    expect(
      impedimentoDeIncorporar(
        cortejada,
        comarcaDe(cortejada, 'prueba-vega'),
        jugadorDe(cortejada, DOS),
        mundo,
        reglas,
      ),
    ).toBeNull();
    // Y la influencia del turno ya cuenta allí, con gente de DOS presente.
    const conGente: EstadoPartida = {
      ...conRio,
      recuas: {
        'recua-2': recua('recua-2', {
          jugador: DOS,
          situacion: { donde: 'comarca', comarca: c('prueba-vega') },
          cometido: 'presencia',
          carga: recursos({ pan: 40, sal: 5 }),
        }),
      },
    };
    const tras = turno(conGente, [ordenDe(conGente, DOS)]).estado;
    expect(comarcaDe(tras, 'prueba-vega').influencias[DOS] ?? 0).toBeGreaterThan(0);
  });

  it('presente o solo ausente, sus comarcas no se cortejan', () => {
    for (const turnos of [0, t.turnosParaAusente]) {
      const estado = partida(turnos);
      expect(cortejable(estado, comarcaDe(estado, 'prueba-vega'), DOS, reglas)).toBe(false);
    }
  });
});

describe('el reingreso (criterio 3)', () => {
  it('una orden le devuelve el mando, borra la influencia ajena y lo anuncia a todos', () => {
    const estado = conComarca(partida(t.turnosParaConcejo + 3), 'prueba-vega', {
      influencias: { [DOS]: 40 },
    });
    const { estado: despues, sucesos } = turno(estado, [ordenDe(estado, UNO)]);
    expect(jugadorDe(despues, UNO).turnosSinOrdenes).toBe(0);
    expect(comarcaDe(despues, 'prueba-vega').influencias[DOS] ?? 0).toBe(0);
    expect(comarcaDe(despues, 'prueba-vega').duenyo).toBe(UNO);
    expect(sucesos.find((s) => s.tipo === 'ausencia.vuelve')).toMatchObject({
      jugador: null,
      datos: { de: UNO },
    });
  });
});

describe('el amparo (criterio 2)', () => {
  const REALES = { ...reglas, casas: CASAS_DE_OFICIO };

  it('el amparado no paga portazgo', () => {
    const clave = claveDeTramo(c('prueba-llano'), c('prueba-vega'));
    const conPeaje = con(
      {
        ...escenario({ conDos: true }),
        caminos: { [clave]: { calidad: 'calzada', puente: false, duenyo: DOS, portazgo: 5 } },
      },
      DOS,
      { casa: 'arrieros' },
    );
    const peaje = (estado: EstadoPartida) =>
      peajeDe(estado, c('prueba-llano'), c('prueba-vega'), jugadorDe(estado, UNO), REALES);
    expect(peaje(conPeaje)?.cantidad).toBe(5);
    expect(peaje(con(conPeaje, UNO, { amparoHasta: conPeaje.turno + 3 }))).toBeNull();
    expect(peaje(con(conPeaje, UNO, { amparoHasta: conPeaje.turno - 1 }))?.cantidad).toBe(5);
  });

  it('las comarcas del amparado no se cortejan aunque las administre el concejo', () => {
    const estado = con(partida(t.turnosParaConcejo), UNO, { amparoHasta: 999 });
    expect(cortejable(estado, comarcaDe(estado, 'prueba-vega'), DOS, reglas)).toBe(false);
  });
});
