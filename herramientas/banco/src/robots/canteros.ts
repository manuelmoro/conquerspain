// Los canteros: canteras, piedra acumulada y una obra mayor detras de otra; los puentes y las
// calzadas de su tierra, los primeros (docs/04 §4.1.3).
import { calidadDeTramo, costeDeObraMayor, tienePuente } from '@conquer/nucleo';

import type { Decision } from './impulsos.ts';
import type { Estrategia } from './robot.ts';

/** Un puente sobre un vado o una calzada sobre un camino carretero que salga de lo propio. */
function obraDeCamino(d: Decision): void {
  const { t, p } = d;
  const aMedias =
    t.vista.obras.some((o) => o.tipo === 'obra mayor' && !o.abandonada) ||
    t.ordenes.some((o) => o.tipo === 'obra-mayor');
  if (aMedias) return;
  for (const comarca of t.propias) {
    for (const vecina of t.vecinas(comarca.id)) {
      const tramo = t.tramo(comarca.id, vecina);
      if (tramo === null) continue;
      const obra =
        tramo.vado && !tienePuente(tramo, t.vista.caminos)
          ? 'puente'
          : calidadDeTramo(tramo, t.vista.caminos) === 'carretero'
            ? 'calzada'
            : null;
      if (obra === null) continue;
      if (p.alcanza(costeDeObraMayor(obra, t.casa, t.reglas)))
        p.obraMayor(comarca.id, obra, vecina);
      return;
    }
  }
}

export const CANTEROS: Estrategia = {
  perfil: {
    casa: 'canteros',
    nombre: 'Robot cantero',
    capital: [
      ['cantera', 1],
      ['mercado', 1],
      ['cantera', 2],
    ],
    comarcas: [
      ['granja', 1],
      ['cantera', 1],
      ['aserradero', 1],
      ['casas', 1],
    ],
    obrasMayores: ['monasterio', 'muralla', 'acequia-mayor', 'atarazana', 'catedral'],
    recuas: ['tratar', 'explorar', 'emisario'],
    vende: {},
    feria: [],
    criterio: 'profundizar',
    valorDe: (g) =>
      g.potenciales.piedra * 3 +
      g.potenciales.labor * 2 +
      (g.rasgos.includes('ciudad-episcopal') ? 5 : 0),
  },
  via: obraDeCamino,
};
