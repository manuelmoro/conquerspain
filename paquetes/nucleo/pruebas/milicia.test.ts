// Milicia y hostilidad (ficha T-120): la leva cuesta gente, lealtad, pan y soldada; la hostilidad
// avisa con un turno; el enfrentamiento solo cuesta la posición; y los hombres nunca mueren.
import { describe, expect, it } from 'vitest';

import { claveDeHostilidad, costeDeMesnada } from '../src/reglas/milicia.ts';
import type { EstadoJugador, EstadoPartida, Mesnada } from '../src/tipos/estado.ts';
import type { IdComarca, IdJugador, IdMesnada } from '../src/tipos/ids.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import {
  DOS,
  UNO,
  base,
  c,
  comarcaDe,
  conComarca,
  escenario,
  recursos,
  reglas,
  turno,
} from './recuas.ts';

const LLANO = c('prueba-llano');
const VEGA = c('prueba-vega');

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

/** UNO en el llano con 400 vecinos; DOS, dueña de la vega. */
function partida(): EstadoPartida {
  const estado = conComarca(escenario({ conDos: true }), 'prueba-llano', { poblacion: 400 });
  return conComarca(estado, 'prueba-vega', { duenyo: DOS, lealtad: 100 });
}

const levar = (e: EstadoPartida, comarca: IdComarca, hombres: number): Orden => ({
  ...base(e.turno),
  jugador: UNO,
  tipo: 'levar',
  comarca,
  hombres,
});
const licenciar = (e: EstadoPartida, m: string): Orden => ({
  ...base(e.turno),
  jugador: UNO,
  tipo: 'licenciar',
  mesnada: m as IdMesnada,
});
const marchar = (e: EstadoPartida, m: string, destino: IdComarca): Orden => ({
  ...base(e.turno),
  jugador: UNO,
  tipo: 'marchar',
  mesnada: m as IdMesnada,
  destino,
});
const declarar = (e: EstadoPartida): Orden => ({
  ...base(e.turno),
  jugador: UNO,
  tipo: 'hostilidad',
  contra: DOS,
  declarar: true,
});

function mesnada(
  id: string,
  jugador: IdJugador,
  origen: IdComarca,
  hombres: number,
  en: IdComarca,
): Mesnada {
  return {
    id: id as IdMesnada,
    jugador,
    nombre: `Mesnada ${id}`,
    origen,
    hombres,
    situacion: { donde: 'comarca', comarca: en },
    turnosFuera: 0,
  };
}

function conHostilidad(estado: EstadoPartida, vigenteDesde: number): EstadoPartida {
  return {
    ...estado,
    hostilidades: {
      [claveDeHostilidad(UNO, DOS)]: {
        de: UNO,
        contra: DOS,
        declaradaEn: vigenteDesde - 1,
        vigenteDesde,
      },
    },
  };
}

describe('la leva', () => {
  it('saca hombres de la comarca, baja la lealtad y crea la mesnada; licenciar los devuelve', () => {
    const estado = partida();
    const levado = turno(estado, [levar(estado, LLANO, 60)]);
    const [m] = Object.values(levado.estado.mesnadas ?? {});
    expect(m).toMatchObject({ jugador: UNO, origen: LLANO, hombres: 60 });
    expect(comarcaDe(levado.estado, 'prueba-llano').poblacion).toBeLessThan(
      comarcaDe(turno(estado).estado, 'prueba-llano').poblacion - 50,
    );
    expect(levado.sucesos.some((s) => s.tipo === 'milicia.leva')).toBe(true);
    if (m === undefined) throw new Error('sin mesnada');
    const antes = comarcaDe(levado.estado, 'prueba-llano').poblacion;
    const licencia = turno(levado.estado, [licenciar(levado.estado, m.id)]);
    expect(licencia.estado.mesnadas?.[m.id]).toBeUndefined();
    expect(comarcaDe(licencia.estado, 'prueba-llano').poblacion).toBeGreaterThanOrEqual(
      antes + 60 - 5,
    );
  });

  it('no más del 20 % de la comarca', () => {
    const estado = partida();
    const { sucesos } = turno(estado, [levar(estado, LLANO, 90)]);
    expect(
      sucesos.find((s) => s.tipo === 'orden.estado' && s.datos['estado'] === 'cancelada')?.datos[
        'motivo'
      ],
    ).toBe('demasiados-hombres');
  });

  it('mantener milicia un año fuera de casa arruina a quien no tiene con qué (criterio 1)', () => {
    // 80 hombres apostados en tierra de nadie: 8 de pan y 48 maravedís por turno, que suben hasta el
    // triple por estar lejos. La misma casa sin milicia acaba el año con el arca llena.
    const inicio = con(partida(), UNO, {
      almacen: recursos({ pan: 500, sal: 50, maravedis: 100 }),
    });
    const anyo = (conMilicia: boolean) => {
      let estado = conMilicia
        ? turno(inicio, [levar(inicio, LLANO, 80)]).estado
        : turno(inicio).estado;
      const id = Object.keys(estado.mesnadas ?? {})[0];
      if (conMilicia && id !== undefined)
        estado = turno(estado, [marchar(estado, id, c('prueba-rio'))]).estado;
      let deserciones = 0;
      for (let i = 0; i < 24; i += 1) {
        const r = turno(estado);
        deserciones += r.sucesos.filter((s) => s.tipo === 'milicia.desercion').length;
        estado = r.estado;
      }
      const hombres = Object.values(estado.mesnadas ?? {}).reduce((t, m) => t + m.hombres, 0);
      return { maravedis: jugadorDe(estado, UNO).almacen.maravedis, deserciones, hombres };
    };
    const sin = anyo(false);
    const conMilicia = anyo(true);
    // No puede sostenerla: la mayoría deserta, y aun así el arca queda muy por debajo.
    expect(conMilicia.deserciones).toBeGreaterThan(0);
    expect(conMilicia.hombres).toBeLessThan(40);
    expect(conMilicia.maravedis).toBeLessThan((sin.maravedis * 4) / 5);
  });

  it('el recargo de estar lejos llega al triple, no más', () => {
    const lejos = { ...mesnada('m', UNO, LLANO, 100, VEGA), turnosFuera: 100 };
    expect(costeDeMesnada(lejos, reglas).maravedis).toBe(
      3 * costeDeMesnada({ ...lejos, turnosFuera: 0 }, reglas).maravedis,
    );
  });
});

describe('la hostilidad (criterio 2)', () => {
  it('avisa a todos y vale desde el turno siguiente', () => {
    const estado = partida();
    const { estado: despues, sucesos } = turno(estado, [declarar(estado)]);
    const h = despues.hostilidades?.[claveDeHostilidad(UNO, DOS)];
    expect(h?.vigenteDesde).toBe(estado.turno + 1);
    expect(sucesos.find((s) => s.tipo === 'hostilidad.declarada')?.jugador).toBeNull();
  });

  it('sin hostilidad vigente no se entra en tierra ajena; con ella, sí', () => {
    const conM = { ...partida(), mesnadas: { m: mesnada('m', UNO, LLANO, 50, LLANO) } };
    const hacia = (e: EstadoPartida) => turno(e, [marchar(e, 'm', VEGA)]);
    const sin = hacia(conM);
    expect(
      sin.sucesos.find((s) => s.tipo === 'orden.estado' && s.datos['estado'] === 'cancelada')
        ?.datos['motivo'],
    ).toBe('tierra-vedada');
    // Dos jornadas: llega el mismo turno.
    const conH = hacia(conHostilidad(conM, conM.turno));
    expect(conH.estado.mesnadas?.['m']?.situacion).toEqual({ donde: 'comarca', comarca: VEGA });
  });

  it('no se declara contra quien está amparado', () => {
    const estado = con(partida(), DOS, { amparoHasta: 999 });
    const { sucesos } = turno(estado, [declarar(estado)]);
    expect(
      sucesos.find((s) => s.tipo === 'orden.estado' && s.datos['estado'] === 'cancelada')?.datos[
        'motivo'
      ],
    ).toBe('amparada');
  });
});

describe('el enfrentamiento (criterios 3 y 4)', () => {
  function choque(hombresUno: number, conMuralla = false): EstadoPartida {
    let estado = conHostilidad(partida(), 1);
    if (conMuralla) estado = conComarca(estado, 'prueba-vega', { obrasMayores: ['muralla'] });
    return {
      ...estado,
      mesnadas: {
        a: mesnada('a', UNO, LLANO, hombresUno, VEGA),
        b: mesnada('b', DOS, VEGA, 40, VEGA),
      },
    };
  }
  const total = (e: EstadoPartida) =>
    Object.values(e.comarcas).reduce((t, x) => t + x.poblacion, 0) +
    Object.values(e.mesnadas ?? {}).reduce((t, m) => t + m.hombres, 0);

  it('el que defiende su tierra tiene ventaja; el que pierde vuelve a casa y no pierde nada más', () => {
    const estado = choque(50);
    const { estado: despues, sucesos } = turno(estado);
    expect(sucesos.find((s) => s.tipo === 'milicia.enfrentamiento')?.datos['ganador']).toBe(DOS);
    expect(despues.mesnadas?.['a']?.situacion).toEqual({ donde: 'comarca', comarca: LLANO });
    expect(despues.mesnadas?.['a']?.hombres).toBe(45);
    expect(comarcaDe(despues, 'prueba-vega').duenyo).toBe(DOS);
    expect(comarcaDe(despues, 'prueba-llano').duenyo).toBe(UNO);
  });

  it('con muchos más hombres gana el atacante, pero la muralla dobla al que defiende', () => {
    expect(
      turno(choque(100)).sucesos.find((s) => s.tipo === 'milicia.enfrentamiento')?.datos['ganador'],
    ).toBe(UNO);
    expect(
      turno(choque(100, true)).sucesos.find((s) => s.tipo === 'milicia.enfrentamiento')?.datos[
        'ganador'
      ],
    ).toBe(DOS);
  });

  it('nadie muere: la gente total no baja por el enfrentamiento', () => {
    const estado = choque(50);
    const sinChoque = { ...estado, hostilidades: {} };
    expect(total(turno(estado).estado)).toBe(total(turno(sinChoque).estado));
  });
});
