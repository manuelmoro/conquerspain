// Los salineros: salinas y lonjas donde hay sal o pesca, y la sal que sobra a la feria: sin ella los
// demas no conservan el pan ni viajan en verano (docs/04 §4.1.6).
import type { Estrategia } from './robot.ts';
import { sinVia } from './robot.ts';

export const SALINEROS: Estrategia = {
  perfil: {
    casa: 'salineros',
    nombre: 'Robot salinero',
    capital: [
      ['salina', 2],
      ['mercado', 1],
      ['lonja', 1],
      ['aserradero', 1],
      ['casas', 1],
    ],
    esenciales: ['salina', 'mercado'],
    comarcas: [
      ['granja', 1],
      ['salina', 2],
      ['mercado', 1],
      ['lonja', 1],
      ['casas', 1],
    ],
    obrasMayores: ['atarazana', 'muralla'],
    recuas: ['tratar', 'explorar', 'feriar', 'emisario'],
    // La salazón es pan conservado: el que sobra de la despensa va a la plaza, como la sal.
    vende: { sal: 15, pan: 150 },
    feria: ['sal'],
    criterio: 'profundizar',
    valorDe: (g) => g.potenciales.sal * 4 + g.potenciales.pesca * 3 + g.potenciales.labor,
  },
  via: sinVia,
};
