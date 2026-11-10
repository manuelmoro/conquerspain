// Asedios y pasos (ficha T-121): el bloqueo cierra el paso a las recuas hostiles; el asedio espera
// seis turnos y rinde la comarca si el sitiador puede más que la defensa; la muralla y el pan
// defienden; se negocia con un rescate; y la capital nunca se asedia.
import { describe, expect, it } from 'vitest';

import { claveDeHostilidad } from '../src/reglas/milicia.ts';
import type { EstadoPartida, Mesnada } from '../src/tipos/estado.ts';
import type { IdAsedio, IdComarca, IdJugador, IdMesnada } from '../src/tipos/ids.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import {
  DOS,
  UNO,
  base,
  c,
  comarcaDe,
  conComarca,
  escenario,
  recua,
  recursos,
  turno,
} from './recuas.ts';

const LLANO = c('prueba-llano');
const VEGA = c('prueba-vega');
const COSTA = c('prueba-costa');

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

/** UNO con mucho dinero; DOS con la vega y su capital en la costa; hostilidad vigente. */
function partida(
  opciones: { poblacionVega?: number; muralla?: boolean; hostiles?: boolean } = {},
): EstadoPartida {
  let estado = escenario({ conDos: true, almacen: { maravedis: 5000, pan: 2000 } });
  estado = conComarca(estado, 'prueba-vega', {
    duenyo: DOS,
    lealtad: 100,
    poblacion: opciones.poblacionVega ?? 20,
    obrasMayores: opciones.muralla === true ? ['muralla'] : [],
  });
  estado = conComarca(estado, 'prueba-costa', { duenyo: DOS, lealtad: 100 });
  return {
    ...estado,
    hostilidades:
      opciones.hostiles === false
        ? {}
        : {
            [claveDeHostilidad(UNO, DOS)]: {
              de: UNO,
              contra: DOS,
              declaradaEn: 1,
              vigenteDesde: 1,
            },
          },
  };
}

const asediar = (e: EstadoPartida, m: string): Orden => ({
  ...base(e.turno),
  jugador: UNO,
  tipo: 'asediar',
  mesnada: m as IdMesnada,
});

function cancelacion(
  sucesos: readonly { tipo: string; datos: Record<string, unknown> }[],
): unknown {
  return sucesos.find((s) => s.tipo === 'orden.estado' && s.datos['estado'] === 'cancelada')?.datos[
    'motivo'
  ];
}

describe('el bloqueo de un paso (criterio 4)', () => {
  it('una mesnada hostil en la comarca cierra la entrada a las recuas; sin hostilidad, no', () => {
    const conRecua = (hostiles: boolean): EstadoPartida => ({
      ...partida({ hostiles }),
      recuas: {
        'recua-1': recua('recua-1', { ruta: [VEGA], carga: recursos({ pan: 20, sal: 5 }) }),
      },
      mesnadas: { b: mesnada('b', DOS, VEGA, 30, VEGA) },
    });
    const llega = (hostiles: boolean) =>
      turno(conRecua(hostiles)).estado.recuas['recua-1']?.situacion;
    expect(llega(true)).toEqual({ donde: 'comarca', comarca: LLANO });
    expect(llega(false)).toEqual({ donde: 'comarca', comarca: VEGA });
  });
});

describe('el asedio (criterios 1, 2 y 3)', () => {
  function asediada(opciones: Parameters<typeof partida>[0] = {}) {
    const estado = { ...partida(opciones), mesnadas: { a: mesnada('a', UNO, LLANO, 100, VEGA) } };
    return turno(estado, [asediar(estado, 'a')]);
  }

  it('empieza en público y no rinde nada antes de seis turnos; después, sí', () => {
    const primero = asediada();
    expect(Object.values(primero.estado.asedios ?? {})).toHaveLength(1);
    expect(primero.sucesos.find((s) => s.tipo === 'asedio.empieza')?.jugador).toBeNull();
    let estado = primero.estado;
    for (let i = 0; i < 4; i += 1) estado = turno(estado).estado;
    expect(comarcaDe(estado, 'prueba-vega').duenyo).toBe(DOS);
    const sexto = turno(estado);
    expect(sexto.sucesos.some((s) => s.tipo === 'asedio.rendicion')).toBe(true);
    expect(comarcaDe(sexto.estado, 'prueba-vega').duenyo).toBe(UNO);
    // Queda con 40 de lealtad, y la fase de territorio aún le resta lo suyo de ese turno.
    expect(comarcaDe(sexto.estado, 'prueba-vega').lealtad).toBeLessThanOrEqual(40);
    expect(comarcaDe(sexto.estado, 'prueba-vega').lealtad).toBeGreaterThanOrEqual(35);
    // El vencido conserva el resto: su capital sigue siendo suya.
    expect(comarcaDe(sexto.estado, 'prueba-costa').duenyo).toBe(DOS);
  });

  it('con muralla y pan, la defensa aguanta', () => {
    let estado = asediada({ poblacionVega: 400, muralla: true }).estado;
    for (let i = 0; i < 10; i += 1) estado = turno(estado).estado;
    expect(comarcaDe(estado, 'prueba-vega').duenyo).toBe(DOS);
  });

  it('el defensor ofrece rescate y el sitiador lo acepta: se paga y la mesnada vuelve a casa', () => {
    const inicio = asediada().estado;
    const id = Object.keys(inicio.asedios ?? {})[0] as IdAsedio;
    const oferta = turno(inicio, [
      { ...base(inicio.turno), jugador: DOS, tipo: 'tregua', asedio: id, rescate: 50 },
    ]);
    expect(oferta.sucesos.find((s) => s.tipo === 'asedio.rescate')?.jugador).toBe(UNO);
    const antes = oferta.estado.jugadores[DOS]?.almacen.maravedis ?? 0;
    const trato = turno(oferta.estado, [
      { ...base(oferta.estado.turno), jugador: UNO, tipo: 'aceptar-tregua', asedio: id },
    ]);
    expect(trato.estado.asedios?.[id]).toBeUndefined();
    expect(trato.estado.mesnadas?.['a']?.situacion).toEqual({ donde: 'comarca', comarca: LLANO });
    expect(trato.estado.jugadores[DOS]?.almacen.maravedis ?? 0).toBeLessThan(antes - 40);
    expect(comarcaDe(trato.estado, 'prueba-vega').duenyo).toBe(DOS);
  });

  it('la capital no se asedia', () => {
    const estado = { ...partida(), mesnadas: { a: mesnada('a', UNO, LLANO, 100, COSTA) } };
    expect(cancelacion(turno(estado, [asediar(estado, 'a')]).sucesos)).toBe('capital-intocable');
  });

  it('si el sitiador se va, el asedio se levanta', () => {
    const inicio = asediada().estado;
    const sinMesnada = { ...inicio, mesnadas: {} };
    const r = turno(sinMesnada);
    expect(Object.keys(r.estado.asedios ?? {})).toEqual([]);
    expect(r.sucesos.some((s) => s.tipo === 'asedio.levantado')).toBe(true);
  });
});
