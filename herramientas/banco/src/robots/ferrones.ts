// Los ferrones: carbonera y ferreria donde haya hierro y monte, aperos de cuarta en sus comarcas y
// el hierro que sobra, a la feria (docs/04 §4.1.2).
import { costeDeAperos } from '@conquer/nucleo';

import type { Decision } from './impulsos.ts';
import type { Estrategia } from './robot.ts';

/** Madera para levantar la carbonera y la ferreria y tener la primera carga de carbon. */
const MADERA_PARA_FERRERIA = 50;

/** Hierro que guarda para dar de comer a los aperos (uno por nivel y turno). */
const HIERRO_DE_RESERVA = 12;

/** Un nivel mas de aperos en la comarca propia que menos tenga, si sobra hierro. */
function aperos(d: Decision): void {
  const { t, p } = d;
  if (t.ordenes.some((o) => o.tipo === 'aperos')) return;
  const coste = costeDeAperos(t.reglas);
  if (t.disponible('hierro') < coste.hierro + HIERRO_DE_RESERVA || !p.alcanza(coste)) return;
  const comarca = [...t.propias]
    .filter((c) => c.aperos < t.casa.aperosMaximo)
    .sort((a, b) => a.aperos - b.aperos)[0];
  if (comarca !== undefined) p.aperos(comarca.id);
}

export const FERRONES: Estrategia = {
  perfil: {
    casa: 'ferrones',
    nombre: 'Robot ferrón',
    capital: [
      ['cantera', 1],
      ['mercado', 1],
      // La carbonera se come cuatro de madera por turno: se levanta cuando ya hay madera para ella
      // y para la ferreria, que se pide detras.
      ['carbonera', 1, (t) => t.disponible('madera') >= MADERA_PARA_FERRERIA],
      ['ferreria', 1],
    ],
    comarcas: [
      ['granja', 1],
      ['carbonera', 1],
      ['ferreria', 1],
      ['aserradero', 1],
      ['casas', 1],
    ],
    obrasMayores: ['muralla'],
    recuas: ['tratar', 'explorar', 'feriar', 'emisario'],
    vende: { hierro: HIERRO_DE_RESERVA + 8, piedra: 60 },
    acopio: { madera: MADERA_PARA_FERRERIA },
    feria: ['hierro'],
    criterio: 'profundizar',
    valorDe: (g) => g.potenciales.hierro * 4 + g.potenciales.monte * 2 + g.potenciales.labor,
  },
  via: aperos,
};
