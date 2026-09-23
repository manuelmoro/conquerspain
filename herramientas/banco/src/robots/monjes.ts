// Los monjes: el monasterio primero, cartas pueblas en todas sus comarcas y pueblas nuevas con poca
// gente; muchas comarcas medianas y leales (docs/04 §4.1.5).
import type { Decision } from './impulsos.ts';
import type { Estrategia } from './robot.ts';

/** Carta puebla en las comarcas propias que no tienen fuero, una por decision. */
function cartasPueblas(d: Decision): void {
  const { t, p } = d;
  if (t.ordenes.some((o) => o.tipo === 'politica' && o.fuero !== null)) return;
  const sinFuero = t.propias.find(
    (c) =>
      c.fuero === 'ninguno' &&
      t.turno - c.turnoFuero >= t.reglas.territorio.turnosEntreCambiosDeFuero,
  );
  if (sinFuero !== undefined) p.politica(sinFuero.id, 'carta puebla', null);
}

export const MONJES: Estrategia = {
  perfil: {
    casa: 'monjes',
    nombre: 'Robot monje',
    capital: [
      ['mercado', 1],
      ['granja', 3],
      ['casas', 1],
    ],
    esenciales: ['mercado'],
    comarcas: [
      ['granja', 1],
      ['aserradero', 1],
      ['casas', 1],
      ['huerta', 1],
    ],
    obrasMayores: ['monasterio', 'muralla'],
    recuas: ['tratar', 'explorar', 'emisario', 'poblar'],
    vende: { pan: 200 },
    feria: [],
    criterio: 'profundizar',
    valorDe: (g) => g.potenciales.labor * 3 + g.potenciales.pasto + g.potenciales.monte,
  },
  via: cartasPueblas,
};
