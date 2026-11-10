// La disputa por una comarca (ficha T-101): el concejo dividido da la mitad a cada uno, asi que una
// comarca disputada cuesta el doble; la influencia ajena solo se ve con gente alli y en tramos de 10;
// quien tiene la comarca cerca se entera de que otro la corteja o la incorpora; y la que se va por
// deslealtad la puede recoger un vecino atento.
import { describe, expect, it } from 'vitest';

import { aplicar } from '../src/cambios.ts';
import { crearContexto } from '../src/contexto.ts';
import { fuentesDeInfluencia } from '../src/reglas/influencia.ts';
import { impedimentoDeIncorporar } from '../src/reglas/incorporar.ts';
import { vistaDeJugador } from '../src/reglas/vista.ts';
import type { EstadoJugador, EstadoPartida, Recua } from '../src/tipos/estado.ts';
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

const VEGA = 'prueba-vega';
const SIN_ACTIVIDAD = { importe: new Map<string, number>(), vaciaronElPan: new Set<string>() };

function presente(id: string, jugador: IdJugador): Recua {
  return recua(id, {
    jugador,
    situacion: { donde: 'comarca', comarca: c(VEGA) },
    cometido: 'presencia',
    carga: recursos({ pan: 40, sal: 5 }),
  });
}

function jugadorDe(estado: EstadoPartida, id: IdJugador): EstadoJugador {
  const j = estado.jugadores[id];
  if (j === undefined) throw new Error(`falta ${id}`);
  return j;
}

function fuentes(estado: EstadoPartida, jugador: IdJugador) {
  return fuentesDeInfluencia(
    {
      comarca: comarcaDe(estado, VEGA),
      jugador: jugadorDe(estado, jugador),
      actividad: SIN_ACTIVIDAD,
    },
    estado,
    mundo,
    reglas,
  );
}

const sola = escenario({ conDos: true, recuas: [presente('recua-1', UNO)] });
const disputada = escenario({
  conDos: true,
  recuas: [presente('recua-1', UNO), presente('recua-2', DOS)],
});

describe('el concejo dividido', () => {
  it('con otra casa presente, el concejo se queda la mitad de lo aportado', () => {
    const libre = fuentes(sola, UNO);
    const partida = fuentes(disputada, UNO);
    expect(libre.disputada).toBe(false);
    expect(partida.disputada).toBe(true);
    const aportes = libre.neto + libre.desgaste;
    expect(partida.concejoDividido).toBe(aportes - Math.floor(aportes / 2));
    expect(partida.neto).toBe(Math.floor(aportes / 2));
  });

  it('una comarca disputada tarda al menos el doble en estar a punto que una libre (criterio 1)', () => {
    const turnosHasta60 = (porTurno: number): number =>
      Math.ceil(reglas.influencia.minimaParaIncorporar / porTurno);
    const libre = fuentes(sola, UNO).neto;
    const partida = fuentes(disputada, UNO).neto;
    expect(partida).toBeGreaterThan(0);
    expect(turnosHasta60(partida)).toBeGreaterThanOrEqual(2 * turnosHasta60(libre));
  });

  it('el regalo también vale la mitad con el concejo dividido', () => {
    const regalo = (estado: EstadoPartida): number => {
      const orden: Orden = {
        ...base(estado.turno, { maravedis: 50 }),
        tipo: 'regalo',
        comarca: c(VEGA),
      };
      const { sucesos } = turno(estado, [orden]);
      return Number(sucesos.find((s) => s.tipo === 'influencia.regalo')?.datos['influencia'] ?? 0);
    };
    expect(regalo(disputada)).toBe(Math.floor(regalo(sola) / 2));
  });

  it('la previsión de la ficha no delata a un rival que no se ve (sin gente propia allí)', () => {
    const soloElOtro = escenario({ conDos: true, recuas: [presente('recua-2', DOS)] });
    const prevision = fuentesDeInfluencia(
      {
        comarca: comarcaDe(soloElOtro, VEGA),
        jugador: jugadorDe(soloElOtro, UNO),
        actividad: SIN_ACTIVIDAD,
      },
      soloElOtro,
      mundo,
      reglas,
      false,
    );
    expect(prevision.disputada).toBe(false);
  });
});

describe('lo que se ve de la influencia ajena (criterio 3)', () => {
  it('solo con gente propia allí, y en tramos de diez', () => {
    const con = conComarca(disputada, VEGA, { influencias: { [UNO]: 33, [DOS]: 47 } });
    const sinGente = conComarca(
      escenario({ conDos: true, recuas: [presente('recua-2', DOS)] }),
      VEGA,
      { influencias: { [UNO]: 33, [DOS]: 47 } },
    );
    const conocida = (estado: EstadoPartida) => {
      const v = vistaDeJugador(estado, UNO, mundo).comarcas[VEGA];
      return v?.nivel === 'explorada' ? v.influenciasAjenas : null;
    };
    expect(conocida(con)).toEqual({ [DOS]: 40 });
    expect(conocida(sinGente)).toEqual({});
  });
});

describe('quien tiene la comarca cerca se entera', () => {
  it('de que otra casa empieza a cortejarla', () => {
    // UNO tiene gente en la vega desde antes; DOS llega este turno.
    const antes = conComarca(disputada, VEGA, { presenciaSeguida: { [UNO]: 3 } });
    const { sucesos } = turno(antes);
    const avisos = sucesos.filter((s) => s.tipo === 'influencia.cortejo');
    expect(avisos.map((s) => [s.jugador, s.datos['de']])).toEqual([[UNO, DOS]]);
    // Y la segunda vez ya no se avisa: la racha sigue.
    expect(turno(turno(antes).estado).sucesos.some((s) => s.tipo === 'influencia.cortejo')).toBe(
      false,
    );
  });

  it('de que otra casa empieza a incorporarla', () => {
    const conRio = conComarca(disputada, 'prueba-rio', { duenyo: DOS });
    const lista = conComarca(conRio, VEGA, { influencias: { [DOS]: 80 } });
    const orden: Orden = {
      ...base(lista.turno, { pan: 40, maravedis: 30 }),
      jugador: DOS,
      tipo: 'incorporar',
      comarca: c(VEGA),
    };
    const { sucesos } = turno(lista, [orden]);
    const aviso = sucesos.find((s) => s.tipo === 'incorporar.de-otro');
    expect(aviso).toMatchObject({ jugador: UNO, comarca: VEGA, datos: { de: DOS } });
  });
});

describe('la comarca que se va por deslealtad (criterio 4)', () => {
  it('vuelve a neutral sin favores de nadie y un vecino con influencia la puede recoger', () => {
    const ctx = crearContexto(escenario({ conDos: true }), [], mundo, reglas);
    aplicar(ctx, { tipo: 'duenyo', comarca: c('prueba-llano'), jugador: null });
    const estado: EstadoPartida = conComarca(
      conComarca(ctx.estado, 'prueba-vega', { duenyo: DOS }),
      'prueba-llano',
      { influencias: { [DOS]: 70 } },
    );
    expect(comarcaDe(estado, 'prueba-llano').exDuenyo).toBe(UNO);
    expect(
      impedimentoDeIncorporar(
        estado,
        comarcaDe(estado, 'prueba-llano'),
        jugadorDe(estado, DOS),
        mundo,
        reglas,
      ),
    ).toBeNull();
  });
});
