// Produccion (T-031): la cadena de factores con casos escritos a mano, sus invariantes y la curva
// estacional de un anyo entero.
import { describe, expect, it } from 'vitest';

import { resolverTurno } from '../src/resolver.ts';
import type { ClimaAnual } from '../src/reglas/calendario.ts';
import {
  explotacionesDe,
  factorAgotamiento,
  siguienteAgotamiento,
} from '../src/reglas/produccion.ts';
import type { EstadoComarca, EstadoPartida } from '../src/tipos/estado.ts';
import type { Estacion } from '../src/tipos/reglas.ts';
import { RECURSOS } from '../src/tipos/recursos.ts';
import { estadoMini, mundoMini, tablasMini } from './mundo-mini.ts';

const reglas = tablasMini();
const SIN_CLIMA: ClimaAnual = { anyo: 1, modificadores: [] };

function comarca(cambios: Partial<EstadoComarca> = {}): EstadoComarca {
  const base = estadoMini().comarcas['prueba-llano'];
  if (base === undefined) throw new Error('falta prueba-llano');
  return {
    ...base,
    poblacion: 40,
    lealtad: 100,
    aperos: 0,
    edificios: { granja: 1 },
    potenciales: { ...base.potenciales, labor: 3, monte: 3 },
    agotamiento: { monte: 0, piedra: 0, hierro: 0, sal: 0 },
    dehesa: false,
    ...cambios,
  };
}

function produce(
  c: EstadoComarca,
  estacion: Estacion,
  edificio: string,
  clima: ClimaAnual = SIN_CLIMA,
): number {
  const explotacion = explotacionesDe(
    { comarca: c, region: 'region-de-prueba', estacion, clima, casaMil: {} },
    reglas,
  ).find((suya) => suya.edificio === edificio);
  return explotacion?.resultado ?? 0;
}

const labor = (n: 1 | 2 | 3 | 4 | 5): EstadoComarca['potenciales'] => ({
  ...comarca().potenciales,
  labor: n,
});

describe('cadena de produccion', () => {
  it.each([
    ['granja plana: labor 3 en otonyo', comarca(), 'otonyo', 'granja', 10],
    ['labor 1 en verano (60 % × 160 %)', comarca({ potenciales: labor(1) }), 'verano', 'granja', 9],
    [
      'labor 5 en verano (150 % × 160 %)',
      comarca({ potenciales: labor(5) }),
      'verano',
      'granja',
      24,
    ],
    [
      'labor 5 en invierno (150 % × 60 %)',
      comarca({ potenciales: labor(5) }),
      'invierno',
      'granja',
      9,
    ],
    ['primavera (80 %)', comarca(), 'primavera', 'granja', 8],
    ['aperos 3 (+30 %)', comarca({ aperos: 3 }), 'otonyo', 'granja', 13],
    ['aperos 0', comarca({ aperos: 0 }), 'otonyo', 'granja', 10],
    ['lealtad 15 (60 %)', comarca({ lealtad: 15 }), 'otonyo', 'granja', 6],
    ['lealtad 35 (75 %)', comarca({ lealtad: 35 }), 'otonyo', 'granja', 7],
    ['lealtad 100', comarca({ lealtad: 100 }), 'otonyo', 'granja', 10],
    ['mano de obra al 50 %', comarca({ poblacion: 4 }), 'otonyo', 'granja', 5],
    ['huerta: no sufre estacion', comarca({ edificios: { huerta: 2 } }), 'invierno', 'huerta', 12],
    [
      'molino: +25 % al pan de la granja',
      comarca({ edificios: { granja: 1, molino: 1 } }),
      'verano',
      'granja',
      20,
    ],
    ['aserradero sin agotar', comarca({ edificios: { aserradero: 1 } }), 'otonyo', 'aserradero', 6],
    [
      'aserradero con agotamiento 60 (suelo 40 %)',
      comarca({
        edificios: { aserradero: 1 },
        agotamiento: { monte: 60, piedra: 0, hierro: 0, sal: 0 },
      }),
      'otonyo',
      'aserradero',
      2,
    ],
    [
      'aserradero con agotamiento 30 (70 %)',
      comarca({
        edificios: { aserradero: 1 },
        agotamiento: { monte: 30, piedra: 0, hierro: 0, sal: 0 },
      }),
      'otonyo',
      'aserradero',
      4,
    ],
    [
      'dehesa: un 25 % menos de madera',
      comarca({ edificios: { aserradero: 1 }, dehesa: true }),
      'otonyo',
      'aserradero',
      4,
    ],
    [
      'todo junto: granja 2, labor 4, aperos 2, verano',
      comarca({ edificios: { granja: 2 }, aperos: 2, potenciales: labor(4) }),
      'verano',
      'granja',
      48,
    ],
  ] as const)('%s → %i', (_nombre, c, estacion, edificio, esperado) => {
    expect(produce(c, estacion, edificio)).toBe(esperado);
  });

  it('aplica el clima anunciado solo en su region y estacion', () => {
    const seco: ClimaAnual = {
      anyo: 1,
      modificadores: [
        { regiones: ['region-de-prueba'], estacion: 'verano', efecto: 'seco', factorPanMil: 700 },
      ],
    };
    expect(produce(comarca(), 'verano', 'granja', seco)).toBe(11);
    expect(produce(comarca(), 'otonyo', 'granja', seco)).toBe(10);
  });

  it('nunca da negativos ni decimales', () => {
    for (const lealtad of [0, 10, 50, 100]) {
      for (const aperos of [0, 3]) {
        for (const estacion of ['primavera', 'verano', 'otonyo', 'invierno'] as const) {
          const valor = produce(comarca({ lealtad, aperos, poblacion: 3 }), estacion, 'granja');
          expect(Number.isInteger(valor) && valor >= 0).toBe(true);
        }
      }
    }
  });
});

describe('agotamiento', () => {
  it('sube con lo explotado, se regenera y nunca sale de 0..60', () => {
    let c = comarca({ edificios: { aserradero: 4, cantera: 4 } });
    for (let i = 0; i < 100; i += 1) {
      const siguiente = siguienteAgotamiento(c, reglas);
      for (const valor of Object.values(siguiente)) {
        expect(valor).toBeGreaterThanOrEqual(0);
        expect(valor).toBeLessThanOrEqual(60);
      }
      c = { ...c, agotamiento: siguiente };
    }
    expect(c.agotamiento.monte).toBe(60);
    // Sin explotar, la sal y el hierro no se mueven de cero.
    expect(c.agotamiento.sal).toBe(0);
  });

  it('la dehesa agota el monte a la mitad: 4 niveles suben 4 y el monte regenera 3', () => {
    const sin = siguienteAgotamiento(comarca({ edificios: { aserradero: 4 } }), reglas);
    const con = siguienteAgotamiento(
      comarca({ edificios: { aserradero: 4 }, dehesa: true }),
      reglas,
    );
    expect(sin.monte).toBe(5);
    expect(con.monte).toBe(1);
  });

  it('el factor tiene suelo del 40 %', () => {
    expect(factorAgotamiento(0, reglas)).toBe(1000);
    expect(factorAgotamiento(60, reglas)).toBe(400);
    expect(factorAgotamiento(100, reglas)).toBe(400);
  });
});

describe('la fase en el turno', () => {
  function estadoConVariasComarcas(): EstadoPartida {
    const estado = estadoMini();
    const comarcas = { ...estado.comarcas };
    for (const id of ['prueba-llano', 'prueba-vega']) {
      const suya = comarcas[id];
      if (suya === undefined) continue;
      comarcas[id] = {
        ...suya,
        duenyo: estado.jugadores['casa-uno']?.id ?? null,
        edificios: { granja: 2, huerta: 1, mercado: 1 },
        poblacion: 40,
        lealtad: 80,
      };
    }
    return { ...estado, comarcas };
  }

  it('lo que producen las comarcas es exactamente lo que entra en el almacen', () => {
    const estado = estadoConVariasComarcas();
    const { estado: despues, sucesos } = resolverTurno(estado, [], mundoMini(), reglas);
    for (const recurso of RECURSOS) {
      const producido = Object.values(despues.comarcas).reduce(
        (total, c) => total + c.produccionUltimoTurno[recurso],
        0,
      );
      // Solo lo que entro en la fase de produccion: el consumo de la fase 3 va aparte.
      const entrado = sucesos
        .filter((s) => s.fase === 'produccion' && s.tipo === 'almacen.cambio')
        .filter((s) => s.datos['recurso'] === recurso)
        .reduce((total, s) => total + Number(s.datos['delta']), 0);
      expect(entrado, recurso).toBe(producido);
    }
  });

  it('cada explotacion deja su suceso con el desglose completo y reproducible', () => {
    const estado = estadoConVariasComarcas();
    const uno = resolverTurno(estado, [], mundoMini(), reglas).sucesos;
    const otro = resolverTurno(estado, [], mundoMini(), reglas).sucesos;
    expect(uno).toEqual(otro);
    const granja = uno.find(
      (s) => s.tipo === 'produccion.explotacion' && s.datos['edificio'] === 'granja',
    );
    expect(granja?.datos).toMatchObject({ recurso: 'pan', nivel: 2, base: 20 });
    expect(Object.keys(granja?.datos ?? {})).toEqual(
      expect.arrayContaining([
        'potencialMil',
        'estacionMil',
        'aperosMil',
        'lealtadMil',
        'resultado',
      ]),
    );
    expect(uno.some((s) => s.tipo === 'produccion.maravedis')).toBe(true);
  });

  it('avisa cuando falta mano de obra', () => {
    const estado = estadoConVariasComarcas();
    const llano = estado.comarcas['prueba-llano'];
    if (llano === undefined) throw new Error('falta prueba-llano');
    const falto = {
      ...estado,
      comarcas: { ...estado.comarcas, 'prueba-llano': { ...llano, poblacion: 12 } },
    };
    const { sucesos } = resolverTurno(falto, [], mundoMini(), reglas);
    const aviso = sucesos.find((s) => s.tipo === 'produccion.falta-mano-de-obra');
    expect(aviso?.datos).toMatchObject({ necesarios: 24, vecinos: 12, faltan: 12 });
  });

  it('un anyo entero dibuja la curva del pan: maximo en verano, minimo en invierno', () => {
    // Con la despensa sobrada, ni el hambre ni la deuda tocan la lealtad y la curva es pura.
    const inicial = estadoMini();
    const casa = inicial.jugadores['casa-uno'];
    if (casa === undefined) throw new Error('falta casa-uno');
    let estado: EstadoPartida = {
      ...inicial,
      jugadores: {
        'casa-uno': { ...casa, almacen: { ...casa.almacen, pan: 100_000, maravedis: 10_000 } },
      },
    };
    const porTurno: number[] = [];
    for (let i = 0; i < 24; i += 1) {
      estado = resolverTurno(estado, [], mundoMini(), reglas).estado;
      porTurno.push(estado.comarcas['prueba-llano']?.produccionUltimoTurno.pan ?? 0);
    }
    const verano = porTurno.slice(10, 16);
    const invierno = [...porTurno.slice(0, 4), ...porTurno.slice(22, 24)];
    expect(Math.min(...verano)).toBe(Math.max(...porTurno));
    expect(Math.max(...invierno)).toBe(Math.min(...porTurno));
    // La media anual es el valor plano de la granja (estacion al 100 %).
    const plano = explotacionesDe(
      {
        comarca: estadoMini().comarcas['prueba-llano'] as EstadoComarca,
        region: 'x',
        estacion: 'otonyo',
        clima: SIN_CLIMA,
        casaMil: {},
      },
      reglas,
    )[0]?.resultado;
    const media = porTurno.reduce((a, b) => a + b, 0) / 24;
    expect(Math.abs(media - (plano ?? 0))).toBeLessThanOrEqual(1);
  });
});
