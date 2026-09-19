// Los hortelanos: huertas y acequias en la vega, mucha gente en poca tierra y el pan que sobra a la
// plaza: son el granero de la partida (docs/04 §4.1.8).
import type { Estrategia } from './robot.ts';
import { sinVia } from './robot.ts';

export const HORTELANOS: Estrategia = {
  perfil: {
    casa: 'hortelanos',
    nombre: 'Robot hortelano',
    capital: [
      ['huerta', 1],
      ['acequia', 1],
      ['casas', 1],
      ['huerta', 2],
    ],
    comarcas: [
      ['huerta', 2],
      ['acequia', 1],
      ['casas', 1],
      ['aserradero', 1],
    ],
    obrasMayores: ['acequia-mayor', 'muralla'],
    recuas: ['explorar', 'tratar', 'emisario'],
    vende: { pan: 150 },
    feria: [],
    criterio: 'profundizar',
    valorDe: (g) =>
      g.potenciales.labor * 3 +
      (g.terreno === 'vega' ? 6 : 0) +
      (g.rasgos.includes('vega-fluvial') ? 4 : 0),
  },
  via: sinVia,
};
