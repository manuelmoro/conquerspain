// Rutas por el grafo (T-033 §4.2): pares del mundo mini con su ruta escrita a mano, la nieve,
// el conocimiento del jugador y el desempate por identificador.
import { describe, expect, it } from 'vitest';

import { estadoEstacionalDe } from '../src/reglas/calendario.ts';
import { comarcasTransitables, rutaMasCorta, rutaPorParadas } from '../src/reglas/ruta.ts';
import type { IdComarca } from '../src/tipos/ids.ts';
import type { Camino, Mundo } from '../src/tipos/mundo.ts';
import { estadoMini, mundoMini, tablasMini } from './mundo-mini.ts';

const reglas = tablasMini();
const mundo = mundoMini();
const TODAS = new Set(Object.keys(mundo.comarcas));
const PRIMAVERA = estadoEstacionalDe(7, mundo, reglas);
const VERANO = estadoEstacionalDe(12, mundo, reglas);
const INVIERNO = estadoEstacionalDe(2, mundo, reglas);
const BARRO = estadoEstacionalDe(5, mundo, reglas);

const c = (id: string): IdComarca => id as IdComarca;

function ruta(desde: string, hasta: string, estacional = PRIMAVERA, transitables = TODAS) {
  return rutaMasCorta(c(desde), c(hasta), mundo, estacional, transitables, reglas);
}

describe('rutaMasCorta en el mundo mini', () => {
  // Tramos: llano-vega, llano-monte, llano-rio, rio-vega y costa-rio son de llano o costa (2
  // jornadas); monte-sierra es ondulado (3); sierra-mina cruza el Puerto de Prueba (7, se cierra).
  const CASOS: readonly [string, string, string[], number][] = [
    ['prueba-llano', 'prueba-vega', ['prueba-vega'], 2000],
    ['prueba-llano', 'prueba-costa', ['prueba-rio', 'prueba-costa'], 4000],
    ['prueba-vega', 'prueba-costa', ['prueba-rio', 'prueba-costa'], 4000],
    ['prueba-vega', 'prueba-monte', ['prueba-llano', 'prueba-monte'], 4000],
    ['prueba-llano', 'prueba-sierra', ['prueba-monte', 'prueba-sierra'], 5000],
    ['prueba-llano', 'prueba-mina', ['prueba-monte', 'prueba-sierra', 'prueba-mina'], 12000],
    ['prueba-costa', 'prueba-monte', ['prueba-rio', 'prueba-llano', 'prueba-monte'], 6000],
    [
      'prueba-mina',
      'prueba-vega',
      ['prueba-sierra', 'prueba-monte', 'prueba-llano', 'prueba-vega'],
      14000,
    ],
  ];

  for (const [desde, hasta, comarcas, jornadasMil] of CASOS) {
    it(`${desde} → ${hasta}`, () => {
      expect(ruta(desde, hasta)).toEqual({ comarcas, jornadasMil });
    });
  }

  it('ir a donde ya se esta no cuesta nada', () => {
    expect(ruta('prueba-llano', 'prueba-llano')).toEqual({ comarcas: [], jornadasMil: 0 });
  });

  it('la estacion y el barro cambian el coste', () => {
    expect(ruta('prueba-llano', 'prueba-vega', VERANO)?.jornadasMil).toBe(1800);
    expect(ruta('prueba-llano', 'prueba-vega', BARRO)?.jornadasMil).toBe(2500);
  });

  it('en invierno el puerto cerrado deja la mina sin ruta', () => {
    expect(ruta('prueba-llano', 'prueba-mina', INVIERNO)).toBeNull();
    expect(ruta('prueba-llano', 'prueba-sierra', INVIERNO)?.comarcas).toEqual([
      'prueba-monte',
      'prueba-sierra',
    ]);
  });

  it('no pasa por comarcas que no se han explorado, pero puede llegar a ellas', () => {
    const sinRio = new Set([...TODAS].filter((id) => id !== 'prueba-rio'));
    expect(ruta('prueba-llano', 'prueba-costa', PRIMAVERA, sinRio)).toBeNull();
    expect(ruta('prueba-llano', 'prueba-rio', PRIMAVERA, sinRio)?.comarcas).toEqual(['prueba-rio']);
  });

  it('en un empate de jornadas gana la secuencia de identificadores menor', () => {
    const tramo = (desde: string, hasta: string): Camino => ({
      desde: c(desde),
      hasta: c(hasta),
      terreno: 'llano',
      jornadasBase: 2,
      vado: false,
      puertoDeMontanya: null,
      cierraEnInvierno: false,
      canyada: null,
      calzadaRomana: false,
    });
    const cuadrado: Mundo = {
      ...mundo,
      caminos: [tramo('d', 'c'), tramo('a', 'c'), tramo('b', 'd'), tramo('a', 'b')],
    };
    const todas = new Set(['a', 'b', 'c', 'd']);
    const resultado = rutaMasCorta(c('a'), c('d'), cuadrado, PRIMAVERA, todas, reglas);
    expect(resultado?.comarcas).toEqual(['b', 'd']);
  });
});

describe('rutaPorParadas', () => {
  it('encadena las paradas y, si es circular, vuelve a la salida', () => {
    const ida = rutaPorParadas(
      c('prueba-llano'),
      [c('prueba-vega'), c('prueba-costa')],
      false,
      mundo,
      PRIMAVERA,
      TODAS,
      reglas,
    );
    expect(ida?.comarcas).toEqual(['prueba-vega', 'prueba-rio', 'prueba-costa']);
    const vuelta = rutaPorParadas(
      c('prueba-llano'),
      [c('prueba-costa')],
      true,
      mundo,
      PRIMAVERA,
      TODAS,
      reglas,
    );
    expect(vuelta?.comarcas).toEqual(['prueba-rio', 'prueba-costa', 'prueba-rio', 'prueba-llano']);
  });

  it('las transitables son las exploradas y las propias, y la capital', () => {
    const jugador = estadoMini().jugadores['casa-uno'];
    if (jugador === undefined) throw new Error('falta casa-uno');
    // En el estado mini la vega solo es «oida»: se puede ir, no pasar.
    expect([...comarcasTransitables(jugador)]).toEqual(['prueba-llano']);
  });
});
