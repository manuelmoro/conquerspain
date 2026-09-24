// El negocio se cuenta con el precio que se espera (T-056): el robot se pregunta a la plaza lo que
// haria el motor con su orden, en vez de suponer que paga el limite de la puja y cobra el de la rebaja.
import { beforeAll, describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO, idDeMercadoLocal, vistaDeJugador } from '@conquer/nucleo';
import type { EstadoPartida, IdComarca, IdJugador, Recursos } from '@conquer/nucleo';

import { altaDelBanco, mundoPeninsula } from '../partida.ts';
import { esperadoEn } from './arbitraje.ts';
import type { PlazaConocida } from './tablero.ts';
import { Tablero } from './tablero.ts';

const REGLAS = TABLAS_DEL_JUEGO;
const YO = 'mercaderes' as IdJugador;
const BARATA = 'urgell-i-segarra' as IdComarca;
const CARA = 'monegros' as IdComarca;
/** La mejor diferencia medida en la campaña 1492 (T-055 §8): la sal, un 28 %. */
const SAL_BARATA = 9800;
const SAL_CARA = 12600;

let t: Tablero;

function plaza(comarca: IdComarca): PlazaConocida {
  return { id: idDeMercadoLocal(comarca), comarca, tipo: 'local', turnos: [], volumen: 'pequenya' };
}

function precios(sal: number): Recursos {
  return {
    pan: 2400,
    madera: 4000,
    piedra: 6000,
    maravedis: 1000,
    sal,
    hierro: 26400,
    lana: 45000,
  };
}

beforeAll(() => {
  const mundo = mundoPeninsula();
  const { estado } = altaDelBanco({
    semilla: '1492',
    casas: ['mercaderes'],
    reglas: REGLAS,
    mundo,
  });
  const yo = estado.jugadores[YO];
  if (yo === undefined) throw new Error('falta el mercader');
  const sabido = (sal: number) => ({
    turno: estado.turno,
    fuente: 'visita' as const,
    preciosMil: precios(sal),
    visitada: true,
  });
  const conPrecios: EstadoPartida = {
    ...estado,
    jugadores: {
      ...estado.jugadores,
      [YO]: {
        ...yo,
        plazas: {
          ...yo.plazas,
          [idDeMercadoLocal(BARATA)]: sabido(SAL_BARATA),
          [idDeMercadoLocal(CARA)]: sabido(SAL_CARA),
        },
      },
    },
  };
  t = new Tablero(vistaDeJugador(conPrecios, YO, mundo), mundo, REGLAS);
}, 60_000);

describe('lo que se espera de una plaza', () => {
  it('la propia compra encarece la carga, pero nunca por encima del limite', () => {
    const limite = (SAL_BARATA * 1200) / 1000;
    const una = esperadoEn(t, plaza(BARATA), 'sal', 'comprar', 1, limite, 1000);
    const ocho = esperadoEn(t, plaza(BARATA), 'sal', 'comprar', 8, limite, 1000);
    expect(una.casada).toBe(1);
    expect(ocho.casada).toBe(8);
    expect(una.importe).toBeGreaterThanOrEqual(SAL_BARATA / 1000);
    expect(ocho.importe / 8).toBeGreaterThan(una.importe);
    expect(ocho.importe).toBeLessThanOrEqual(Math.ceil((8 * limite) / 1000));
  });

  it('sin fondos no casa nada, y la venta no cobra mas de lo que vale la plaza', () => {
    expect(esperadoEn(t, plaza(BARATA), 'sal', 'comprar', 8, 20000, 5).casada).toBe(0);
    const venta = esperadoEn(t, plaza(CARA), 'sal', 'vender', 8, (SAL_CARA * 900) / 1000, 0);
    expect(venta.casada).toBe(8);
    expect(venta.importe).toBeLessThanOrEqual((8 * SAL_CARA) / 1000);
  });

  it('una diferencia del 28 % deja ganancia esperada; contada con los limites, perdia', () => {
    const [maximo, minimo] = [(SAL_BARATA * 1200) / 1000, (SAL_CARA * 900) / 1000];
    const compra = esperadoEn(t, plaza(BARATA), 'sal', 'comprar', 8, maximo, 1000);
    const venta = esperadoEn(t, plaza(CARA), 'sal', 'vender', compra.casada, minimo, 0);
    const esperada = venta.importe - venta.comision - (compra.importe + compra.comision);
    const conLimites = (8 * minimo - 8 * maximo) / 1000;
    expect(esperada).toBeGreaterThan(0);
    expect(conLimites).toBeLessThan(0);
  });
});
