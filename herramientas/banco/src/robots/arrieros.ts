// Los arrieros maragatos: muchas recuas baratas, que exploran lejos y mueven mercancia entre plazas
// (docs/04 §4.1.7). Su mapa se llena de lineas; su dominio, poco.
import { arbitraje } from './arbitraje.ts';
import type { Estrategia } from './robot.ts';
import { sinVia } from './robot.ts';

export const ARRIEROS: Estrategia = {
  perfil: {
    casa: 'arrieros',
    nombre: 'Robot arriero',
    capital: [
      ['mercado', 1],
      ['aserradero', 1],
      ['venta', 1],
      ['casas', 1],
    ],
    esenciales: ['mercado', 'venta'],
    comarcas: [
      ['granja', 1],
      ['venta', 1],
      ['casas', 1],
    ],
    obrasMayores: ['muralla'],
    recuas: ['tratar', 'explorar', 'arbitraje', 'explorar', 'arbitraje', 'emisario'],
    vende: { madera: 40 },
    feria: [],
    criterio: 'profundizar',
    valorDe: (g) =>
      (g.rasgos.includes('camino-de-santiago') || g.rasgos.includes('calzada-romana') ? 6 : 0) +
      (g.ferias.length > 0 ? 4 : 0) +
      g.potenciales.labor * 2,
  },
  via: sinVia,
  rutinas: { arbitraje },
};
