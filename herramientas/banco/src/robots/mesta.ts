// La Mesta: rebanyos que suben a los agostaderos en mayo y bajan a los invernaderos en otonyo, lana
// en el esquileo y la lana a la feria. Compra el pan que no cria (docs/04 §4.1.1).
import type { IdComarca, Rebanyo } from '@conquer/nucleo';
import { costeDeRebanyo } from '@conquer/nucleo';

import type { Decision } from './impulsos.ts';
import type { Estrategia } from './robot.ts';
import { Tablero } from './tablero.ts';

/** Rebanyos que quiere: el primero en cuanto pueda, y uno mas por cada 150 maravedis, hasta cinco. */
const REBANYOS_MAXIMOS = 5;
const MARAVEDIS_POR_REBANYO = 150;
/** Lo que guarda para la administracion antes de comprar ganado. */
const COLCHON = 40;
/** Turnos de antelacion con que echa a andar el ganado antes de que cambie el pasto. */
const ANTELACION = 2;

/** El pasto que toca dentro de `turnos` turnos: el de verano o el de invierno. */
function pastoQueToca(d: Decision, turnos: number): 'verano' | 'invierno' {
  const { t } = d;
  const anyo = t.reglas.estaciones.turnosPorAnyo;
  const turno = ((t.calendario.turnoDelAnyo - 1 + turnos) % anyo) + 1;
  return t.reglas.estaciones.turnosPastoDeVerano.includes(turno) ? 'verano' : 'invierno';
}

function sirve(d: Decision, id: string, pasto: 'verano' | 'invierno'): boolean {
  const geografia = d.t.geografia(id);
  if (geografia === null || geografia.potenciales.pasto < d.t.reglas.ganaderia.pastoMinimo) {
    return false;
  }
  return pasto === 'verano'
    ? geografia.rasgos.includes('pasto-de-verano')
    : geografia.rasgos.some((r) => r === 'pasto-de-invierno' || r === 'dehesa' || r === 'montado');
}

/** El pasto conocido mas cercano con sitio para un rebanyo mas. */
function pastoPara(
  d: Decision,
  rebanyo: Rebanyo,
  pasto: 'verano' | 'invierno',
  ocupado: Map<string, number>,
): IdComarca | null {
  const { t } = d;
  const distancias = t.jornadasDesde(Tablero.donde(rebanyo));
  let mejor: { id: IdComarca; jornadas: number } | null = null;
  for (const [id, jornadas] of distancias) {
    if (!sirve(d, id, pasto)) continue;
    const geografia = t.geografia(id);
    const cabe = (geografia?.potenciales.pasto ?? 0) > (ocupado.get(id) ?? 0);
    if (!cabe) continue;
    if (mejor === null || jornadas < mejor.jornadas) mejor = { id, jornadas };
  }
  return mejor?.id ?? null;
}

function trashumancia(d: Decision): void {
  const { t, p } = d;
  const pasto = pastoQueToca(d, ANTELACION);
  const ocupado = new Map<string, number>();
  const destinoDe = (r: Rebanyo): string => r.ruta.at(-1) ?? Tablero.donde(r);
  for (const r of t.rebanyos) ocupado.set(destinoDe(r), (ocupado.get(destinoDe(r)) ?? 0) + 1);
  for (const rebanyo of t.rebanyos) {
    if (!Tablero.quieta(rebanyo)) continue;
    if (t.ordenes.some((o) => o.tipo === 'ruta' && o.rebanyo === rebanyo.id)) continue;
    const aqui = Tablero.donde(rebanyo);
    if (sirve(d, aqui, pasto)) continue;
    ocupado.set(aqui, (ocupado.get(aqui) ?? 1) - 1);
    const destino = pastoPara(d, rebanyo, pasto, ocupado);
    if (destino === null) continue;
    ocupado.set(destino, (ocupado.get(destino) ?? 0) + 1);
    p.moverRebanyo(rebanyo.id, destino);
  }
}

/**
 * Conoce algun pasto, de verano o de invierno. Con uno solo el rebanyo pasa hambre media anyo y
 * esquila menos, pero esquila; sin ninguno, se moriria en casa.
 */
function conocePastos(d: Decision): boolean {
  const conocidas = d.t.conocidas();
  return (['verano', 'invierno'] as const).some((pasto) =>
    conocidas.some((id) => sirve(d, id, pasto)),
  );
}

function formarRebanyos(d: Decision): void {
  const { t, p } = d;
  const sede = t.sede;
  if (sede === null || t.yo.escasez || t.rebanyos.length >= REBANYOS_MAXIMOS) return;
  if (!conocePastos(d)) return;
  if (t.ordenes.some((o) => o.tipo === 'formar-rebanyo')) return;
  const coste = costeDeRebanyo(t.casa, t.reglas);
  const sobra = t.disponible('maravedis') - p.reservado('maravedis') - COLCHON - coste.maravedis;
  const quiere = sobra < 0 ? 0 : 1 + Math.floor(sobra / MARAVEDIS_POR_REBANYO);
  if (t.rebanyos.length >= quiere || !p.alcanza(coste) || sede.poblacion < 30) return;
  p.formarRebanyo(sede.id);
}

export const MESTA: Estrategia = {
  perfil: {
    casa: 'mesta',
    nombre: 'Robot de la Mesta',
    capital: [
      ['mercado', 1],
      ['aserradero', 1],
      ['casas', 1],
      ['casas', 2],
    ],
    comarcas: [
      ['granja', 1],
      ['majada', 1],
      ['casas', 1],
    ],
    obrasMayores: ['muralla'],
    recuas: ['explorar', 'tratar', 'feriar', 'emisario'],
    vende: { lana: 0 },
    feria: ['lana'],
    criterio: 'profundizar',
    valorDe: (g) =>
      g.potenciales.pasto * 3 +
      (g.rasgos.includes('pasto-de-verano') || g.rasgos.includes('dehesa') ? 5 : 0) +
      g.potenciales.labor,
  },
  via: (d) => {
    formarRebanyos(d);
    trashumancia(d);
  },
};
