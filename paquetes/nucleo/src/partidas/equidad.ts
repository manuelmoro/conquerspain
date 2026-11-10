// La equidad del reparto (ficha T-100 §4.2): que tiene a mano cada comienzo. Desde un origen, las
// comarcas a `jornadasDeAlcance` o menos por camino: si entre ellas hay pan, madera, piedra y algo
// estrategico, y cuanto suman. Asi se comprueba que nadie empieza sin lo basico y que la diferencia
// entre el mejor y el peor comienzo de una partida no pasa del umbral. Puro.
import type { IdComarca } from '../tipos/ids.ts';
import type { Mundo, Potencial } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { comparar } from '../utiles/orden.ts';
import { indiceDeCaminos, jornadasDesde } from './distancias.ts';
import type { IndiceDeCaminos } from './distancias.ts';

/** Lo basico de un comienzo: de que vive, con que construye y que tiene para comerciar. */
export const LO_BASICO = ['pan', 'madera', 'piedra', 'estrategico'] as const;
export type Basico = (typeof LO_BASICO)[number];

/** De que potenciales sale cada cosa basica. */
const FUENTES: Readonly<Record<Basico, readonly Potencial[]>> = {
  pan: ['labor', 'pesca'],
  madera: ['monte'],
  piedra: ['piedra'],
  estrategico: ['hierro', 'sal', 'pasto'],
};

/**
 * Cuanto pesa cada cosa en la calidad: el pan, lo que mas, porque sin el no se crece; lo
 * estrategico, lo que distingue un comienzo de otro.
 */
const PESO: Readonly<Record<Basico, number>> = { pan: 3, madera: 2, piedra: 1, estrategico: 2 };

/** Lo que cuenta de cada cosa: mas alla de esto, tener mas no hace mejor un comienzo. */
const TOPE_POR_BASICO = 12;

export interface Comienzo {
  readonly origen: IdComarca;
  /** Lo basico que no hay a su alcance: tiene que estar vacio. */
  readonly falta: readonly Basico[];
  /** Suma ponderada de lo basico a su alcance, con tope: para comparar comienzos. */
  readonly calidad: number;
}

/** Lo que tiene a mano un origen. */
export function comienzoDe(
  mundo: Mundo,
  origen: IdComarca,
  reglas: TablasDeReglas,
  indice: IndiceDeCaminos = indiceDeCaminos(mundo),
): Comienzo {
  const alcance = reglas.arranque.recorte.jornadasDeAlcance;
  const cerca = [...jornadasDesde(mundo, origen, indice)]
    .filter(([, jornadas]) => jornadas <= alcance)
    .map(([id]) => mundo.comarcas[id])
    .filter((c) => c !== undefined);
  let calidad = 0;
  const falta: Basico[] = [];
  for (const basico of LO_BASICO) {
    const suma = cerca.reduce(
      (total, c) => total + Math.max(...FUENTES[basico].map((p) => c.potenciales[p])),
      0,
    );
    if (suma === 0) falta.push(basico);
    calidad += PESO[basico] * Math.min(TOPE_POR_BASICO, suma);
  }
  return { origen, falta, calidad };
}

export interface EquidadDelReparto {
  /** El comienzo que cada jugador puede escoger: la mejor de sus ofertas. */
  readonly porJugador: Readonly<Record<string, Comienzo>>;
  /** El peor de esos comienzos frente al mejor, en milesimas: 1000 es un reparto perfecto. */
  readonly peorFrenteAlMejorMil: number;
  /** Ofertas a las que les falta algo basico. */
  readonly sinLoBasico: readonly { readonly jugador: string; readonly comienzo: Comienzo }[];
}

/** La equidad de un reparto de ofertas: el mejor comienzo de cada uno y cuanto distan. */
export function equidadDelReparto(
  mundo: Mundo,
  ofertas: Readonly<Record<string, readonly { readonly comarca: string }[]>>,
  reglas: TablasDeReglas,
): EquidadDelReparto {
  const indice = indiceDeCaminos(mundo);
  const porJugador: Record<string, Comienzo> = {};
  const sinLoBasico: { jugador: string; comienzo: Comienzo }[] = [];
  for (const jugador of Object.keys(ofertas).sort(comparar)) {
    const comienzos = (ofertas[jugador] ?? []).map((o) =>
      comienzoDe(mundo, o.comarca as IdComarca, reglas, indice),
    );
    for (const comienzo of comienzos)
      if (comienzo.falta.length > 0) sinLoBasico.push({ jugador, comienzo });
    const mejor = [...comienzos].sort((a, b) => b.calidad - a.calidad)[0];
    if (mejor !== undefined) porJugador[jugador] = mejor;
  }
  const calidades = Object.values(porJugador).map((c) => c.calidad);
  const mejor = Math.max(1, ...calidades);
  const peor = Math.min(...calidades);
  return {
    porJugador,
    peorFrenteAlMejorMil: calidades.length === 0 ? 1000 : Math.floor((peor * 1000) / mejor),
    sinLoBasico,
  };
}
