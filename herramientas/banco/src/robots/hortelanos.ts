// Los hortelanos: huertas y acequias en la vega, mucha gente en poca tierra y el pan que sobra a la
// plaza de su capital: son el granero de la partida (docs/04 §4.1.8).
import type { Estrategia } from './robot.ts';
import { sinVia } from './robot.ts';

export const HORTELANOS: Estrategia = {
  perfil: {
    casa: 'hortelanos',
    nombre: 'Robot hortelano',
    // El mercado va antes que la acequia: con la piedra del arranque llega para uno de los dos, y
    // sin mercado no se compra la que falta para el otro ni se vende el pan que sobra.
    capital: [
      ['huerta', 1],
      ['mercado', 1],
      ['acequia', 1],
      ['casas', 1],
      ['huerta', 2],
    ],
    esenciales: ['huerta', 'mercado', 'acequia'],
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
