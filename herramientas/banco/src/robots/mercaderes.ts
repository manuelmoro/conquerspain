// Los mercaderes: mercado y venta en casa, y recuas que compran donde sobra y venden donde falta con
// los precios que traen sus corresponsales (docs/04 §4.1.4). Compran el pan que no crian.
import { arbitraje } from './arbitraje.ts';
import type { Estrategia } from './robot.ts';
import { sinVia } from './robot.ts';

export const MERCADERES: Estrategia = {
  perfil: {
    casa: 'mercaderes',
    nombre: 'Robot mercader',
    capital: [
      ['mercado', 1],
      ['aserradero', 1],
      ['casas', 1],
    ],
    esenciales: ['mercado'],
    comarcas: [
      ['granja', 1],
      ['mercado', 1],
      ['casas', 1],
      ['venta', 1],
    ],
    obrasMayores: ['muralla'],
    recuas: ['tratar', 'explorar', 'arbitraje', 'emisario', 'arbitraje'],
    vende: {},
    feria: [],
    criterio: 'profundizar',
    valorDe: (g) =>
      (g.ferias.length > 0 ? 8 : 0) +
      (g.rasgos.includes('puerto-de-mar') ? 4 : 0) +
      g.potenciales.labor * 2,
  },
  via: sinVia,
  rutinas: { arbitraje },
};
