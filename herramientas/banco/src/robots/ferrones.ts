// Los ferrones: carbonera y ferreria donde haya hierro y monte, aperos de cuarta en sus comarcas y
// el hierro que sobra, a la feria (docs/04 §4.1.2).
import { costeDeAperos, costeDeEdificio } from '@conquer/nucleo';

import type { Decision } from './impulsos.ts';
import type { Tablero } from './tablero.ts';
import type { Estrategia } from './robot.ts';

/** Madera para levantar la carbonera y la ferreria y tener la primera carga de carbon. */
const MADERA_PARA_FERRERIA = 50;

/**
 * La carbonera se come cuatro de madera por turno desde que esta en pie: se pide cuando ya hay
 * madera propia que la alimente (el aserradero) y material para ella y para la ferreria, que va
 * detras. Si no, la madera se va en carbon sin hierro.
 */
function hayParaLaCadena(t: Tablero): boolean {
  const sede = t.sede;
  const carbonera = costeDeEdificio('carbonera', t.casa, t.reglas);
  const ferreria = costeDeEdificio('ferreria', t.casa, t.reglas);
  const maderaPropia =
    t.produccion('madera') >= (t.reglas.edificios.carbonera.consumo.madera ?? 0) ||
    (sede !== null && (sede.edificios['aserradero'] ?? 0) > 0);
  return (
    maderaPropia &&
    t.disponible('madera') >= carbonera.madera + ferreria.madera &&
    t.disponible('piedra') >= carbonera.piedra + ferreria.piedra
  );
}

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
    // La cadena del hierro: el aserradero da la madera que se come la carbonera, y la carbonera
    // sostiene la ferreria. Va delante de todo lo que le quitaria el solar.
    capital: [
      ['mercado', 1],
      ['aserradero', 1],
      ['carbonera', 1, hayParaLaCadena],
      ['ferreria', 1],
      ['cantera', 1],
    ],
    esenciales: ['mercado', 'aserradero', 'carbonera', 'ferreria'],
    comarcas: [
      ['granja', 1],
      ['carbonera', 1],
      ['ferreria', 1],
      ['mercado', 1],
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
