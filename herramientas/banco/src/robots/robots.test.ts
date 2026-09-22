// Los robots juegan limpio (ficha T-046 §6.4): deciden solo con lo que su jugador ve. Se les pasa
// un mundo y un estado manipulados justo donde el jugador no mira, y tienen que decidir lo mismo.
// Un robot tramposo de control demuestra que la prueba sabe ver una trampa.
import { beforeAll, describe, expect, it } from 'vitest';

import {
  CASAS,
  RASGOS,
  TABLAS_DEL_JUEGO,
  validarOrdenEntrante,
  vistaDeJugador,
} from '@conquer/nucleo';
import type {
  Casa,
  ComarcaMundo,
  EstadoPartida,
  IdFeria,
  IdJugador,
  Mundo,
  Orden,
  VistaJugador,
} from '@conquer/nucleo';

import { jugarTurno } from '../ejecutar.ts';
import { altaDelBanco } from '../partida.ts';
import type { Robot } from './index.ts';
import { origenPreferido, robotDe } from './index.ts';
import { Pedidos } from './pedidos.ts';
import { Tablero } from './tablero.ts';

const REGLAS = TABLAS_DEL_JUEGO;
/** Turnos que se juegan antes de mirar: los robots ya tienen recuas, obras y tierra conocida. */
const TURNOS = 30;

let mundo: Mundo;
let estado: EstadoPartida;

beforeAll(() => {
  const alta = altaDelBanco({
    semilla: '1492',
    casas: CASAS,
    reglas: REGLAS,
    preferencia: origenPreferido,
  });
  mundo = alta.mundo;
  estado = alta.estado;
  const robots = CASAS.map((casa) => robotDe(casa));
  for (let i = 0; i < TURNOS; i += 1) estado = jugarTurno(estado, robots, mundo, REGLAS).estado;
}, 60_000);

function jugador(casa: Casa): IdJugador {
  return casa as string as IdJugador;
}

/** Lo que el jugador sabe de cada comarca: la geografia solo de lo explorado y lo propio. */
function geografiaConocida(vista: VistaJugador, id: string): boolean {
  const nivel = vista.comarcas[id]?.nivel;
  return nivel === 'explorada' || nivel === 'propia';
}

/** El mundo con todo lo que el jugador no conoce cambiado: potenciales, rasgos, ferias y caminos. */
function mundoManipulado(original: Mundo, vista: VistaJugador): Mundo {
  const comarcas: Record<string, ComarcaMundo> = {};
  for (const [id, comarca] of Object.entries(original.comarcas)) {
    comarcas[id] = geografiaConocida(vista, id)
      ? comarca
      : {
          ...comarca,
          terreno: 'vega',
          potenciales: { labor: 5, monte: 5, pasto: 5, piedra: 5, hierro: 5, sal: 5, pesca: 5 },
          rasgos: [...RASGOS],
          solares: 9,
          poblacionInicial: 999,
          ferias: [
            {
              id: `falsa-${id}` as IdFeria,
              nombre: 'Feria que no existe',
              turnos: [1, 2, 3],
              volumen: 'grande',
              recursosDestacados: [],
            },
          ],
        };
  }
  const caminos = original.caminos.map((camino) =>
    geografiaConocida(vista, camino.desde) || geografiaConocida(vista, camino.hasta)
      ? camino
      : { ...camino, jornadasBase: 1 },
  );
  return { ...original, comarcas, caminos };
}

/** El estado con lo ajeno y lo desconocido cambiado: almacenes, gente, obras y la semilla. */
function estadoManipulado(original: EstadoPartida, yo: IdJugador): EstadoPartida {
  const suyo = original.jugadores[yo];
  if (suyo === undefined) throw new Error(`falta el jugador ${yo}`);
  const jugadores = Object.fromEntries(
    Object.entries(original.jugadores).map(([id, j]) => [
      id,
      id === yo
        ? j
        : {
            ...j,
            almacen: {
              pan: 9999,
              madera: 9999,
              piedra: 9999,
              maravedis: 9999,
              sal: 99,
              hierro: 99,
              lana: 99,
            },
            deudaAdministracion: 77,
          },
    ]),
  );
  const comarcas = Object.fromEntries(
    Object.entries(original.comarcas).map(([id, c]) => {
      const nivel = suyo.conocimiento[id]?.nivel ?? 'desconocida';
      const oculta = nivel === 'desconocida' || nivel === 'oida';
      return [id, oculta ? { ...c, poblacion: c.poblacion + 57, lealtad: 1, aperos: 3 } : c];
    }),
  );
  return { ...original, semilla: 'otra-semilla-cualquiera', jugadores, comarcas };
}

describe('los robots juegan limpio', () => {
  it.each(CASAS)('%s decide siempre lo mismo ante la misma vista', (casa) => {
    const robot = robotDe(casa);
    const vista = vistaDeJugador(estado, jugador(casa), mundo);
    expect(robot.decidir(vista, mundo, REGLAS)).toEqual(robot.decidir(vista, mundo, REGLAS));
  });

  it.each(CASAS)('%s no mira el mundo que su jugador no conoce', (casa) => {
    const robot = robotDe(casa);
    const vista = vistaDeJugador(estado, jugador(casa), mundo);
    const trucado = mundoManipulado(mundo, vista);
    expect(robot.decidir(vista, trucado, REGLAS)).toEqual(robot.decidir(vista, mundo, REGLAS));
  });

  it.each(CASAS)('%s no ve lo ajeno ni lo desconocido del estado', (casa) => {
    const robot = robotDe(casa);
    const vista = vistaDeJugador(estado, jugador(casa), mundo);
    const trucada = vistaDeJugador(estadoManipulado(estado, jugador(casa)), jugador(casa), mundo);
    expect(trucada).toEqual(vista);
    expect(robot.decidir(trucada, mundo, REGLAS)).toEqual(robot.decidir(vista, mundo, REGLAS));
  });

  it('la prueba descubre a un robot que mira donde no debe', () => {
    // Manda su recua a la comarca con mas hierro de toda la peninsula, la conozca o no.
    const tramposo: Robot = {
      casa: 'ferrones',
      nombre: 'Tramposo',
      cadencia: 1,
      decidir(vista, m, reglas) {
        const t = new Tablero(vista, m, reglas);
        const p = new Pedidos(t);
        const recua = t.recuas[0];
        const mejor = Object.values(m.comarcas).sort(
          (a, b) => b.potenciales.hierro - a.potenciales.hierro || (a.id < b.id ? -1 : 1),
        )[0];
        if (recua !== undefined && mejor !== undefined) p.ir(recua.id, mejor.id);
        return { ordenes: [...p.ordenes], motivos: [] };
      },
    };
    const vista = vistaDeJugador(estado, jugador('ferrones'), mundo);
    const trucado = mundoManipulado(mundo, vista);
    expect(tramposo.decidir(vista, trucado, REGLAS)).not.toEqual(
      tramposo.decidir(vista, mundo, REGLAS),
    );
  });

  it('una vista distinta en lo que el jugador si ve cambia lo que decide', () => {
    // La otra cara: los robots miran su vista de verdad. Sin pan ni maravedis, deciden otra cosa.
    const cambian = CASAS.filter((casa) => {
      const robot = robotDe(casa);
      const vista = vistaDeJugador(estado, jugador(casa), mundo);
      const pobre: VistaJugador = {
        ...vista,
        jugador: { ...vista.jugador, almacen: { ...vista.jugador.almacen, pan: 0, maravedis: 0 } },
      };
      return (
        JSON.stringify(robot.decidir(pobre, mundo, REGLAS)) !==
        JSON.stringify(robot.decidir(vista, mundo, REGLAS))
      );
    });
    expect(cambian.length).toBeGreaterThan(0);
  });

  it.each(CASAS)('todas las ordenes de %s las aceptaria el servidor', (casa) => {
    const vista = vistaDeJugador(estado, jugador(casa), mundo);
    const ordenes: readonly Orden[] = robotDe(casa).decidir(vista, mundo, REGLAS).ordenes;
    for (const orden of ordenes) {
      const resultado = validarOrdenEntrante(orden);
      expect(resultado.ok, `${orden.id}: ${JSON.stringify(orden)}`).toBe(true);
      expect(orden.jugador).toBe(jugador(casa));
      expect(orden.turnoAlta).toBe(vista.turno);
    }
  });
});
