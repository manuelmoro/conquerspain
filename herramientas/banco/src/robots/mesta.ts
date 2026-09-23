// La Mesta: rebanyos que suben a los agostaderos en mayo y bajan a los invernaderos en otonyo, lana
// en el esquileo y la lana a la feria. Compra el pan que no cria (docs/04 §4.1.1).
//
// La trashumancia se planifica con el trayecto de verdad (ficha T-050 §4.1.4): el ganado sale cuando
// llegaria al otro pasto justo al cambiar la estacion, sin antelacion fija. Con los dos pastos y un
// camino razonable entre ellos, la cabanya crece; con uno solo, un rebanyo que da renta mientras se
// busca el otro.
import { costeDeRebanyo, turnoDelAnyo } from '@conquer/nucleo';
import type { IdComarca, Rebanyo } from '@conquer/nucleo';

import type { Decision } from './impulsos.ts';
import type { Estrategia } from './robot.ts';
import { Tablero } from './tablero.ts';
import { preverRebanyo } from './viaje.ts';

/** Rebanyos que quiere: el primero en cuanto pueda, y uno mas por cada 150 maravedis, hasta cinco. */
const REBANYOS_MAXIMOS = 5;
const MARAVEDIS_POR_REBANYO = 150;
/** Lo que guarda para la administracion antes de comprar ganado. */
const COLCHON = 40;
/**
 * Turnos de camino al anyo, ida y vuelta, que acepta: medio anyo. El ganado sale para llegar justo
 * al cambio, asi que cada turno de canyada es un turno sin pastar, y pasadas dos jornadas sin pasto
 * pierde cabezas. Con medio anyo de camino la calidad baja a la mitad y aun esquila mas que quieto
 * en un solo pasto, que pierde un cinco por ciento de cabezas cada turno de la otra estacion.
 */
const CAMINO_MAXIMO_AL_ANYO = 12;
/** Pastos de cada clase que se prevén como mucho: los mas cercanos. */
const PASTOS_QUE_SE_MIRAN = 6;

type Pasto = 'verano' | 'invierno';

function otro(pasto: Pasto): Pasto {
  return pasto === 'verano' ? 'invierno' : 'verano';
}

/** El pasto que toca en un turno de la partida. */
function pastoDelTurno(d: Decision, turno: number): Pasto {
  return d.t.reglas.estaciones.turnosPastoDeVerano.includes(turnoDelAnyo(turno))
    ? 'verano'
    : 'invierno';
}

/** Turnos que faltan para que cambie el pasto (1 si cambia el turno que viene). */
function turnosHastaElCambio(d: Decision): number {
  const hoy = pastoDelTurno(d, d.t.turno);
  for (let k = 1; k <= d.t.reglas.estaciones.turnosPorAnyo; k += 1) {
    if (pastoDelTurno(d, d.t.turno + k) !== hoy) return k;
  }
  return d.t.reglas.estaciones.turnosPorAnyo;
}

function sirve(d: Decision, id: string, pasto: Pasto): boolean {
  const geografia = d.t.geografia(id);
  if (geografia === null || geografia.potenciales.pasto < d.t.reglas.ganaderia.pastoMinimo) {
    return false;
  }
  return pasto === 'verano'
    ? geografia.rasgos.includes('pasto-de-verano')
    : geografia.rasgos.some((r) => r === 'pasto-de-invierno' || r === 'dehesa' || r === 'montado');
}

/** Cabezas que mantiene un pasto, con el potencial que el jugador sabe de el. */
function capacidad(d: Decision, id: string): number {
  const { t } = d;
  const propia = t.propias.find((c) => c.id === id);
  const pasto =
    propia?.potenciales.pasto ??
    t.explorada(id)?.datos?.potenciales.pasto ??
    t.geografia(id)?.potenciales.pasto ??
    0;
  return pasto * t.reglas.ganaderia.cabezasPorPuntoDePasto;
}

/**
 * Cabezas que ya cuentan con cada pasto: los rebanyos propios (donde estan o adonde van) y los
 * ajenos que se ven, de los que no se saben las cabezas y se cuentan como un rebanyo entero.
 */
function ganadoPrevisto(d: Decision): Map<string, number> {
  const { t } = d;
  const ocupado = new Map<string, number>();
  const sumar = (id: string, cabezas: number): void => {
    ocupado.set(id, (ocupado.get(id) ?? 0) + cabezas);
  };
  for (const r of t.rebanyos) sumar(r.ruta.at(-1) ?? Tablero.donde(r), r.cabezas);
  for (const ajena of t.vista.ajenas) {
    if (ajena.clase === 'rebanyo') sumar(ajena.comarca, t.reglas.ganaderia.cabezasPorRebanyo);
  }
  return ocupado;
}

/** El pasto conocido de esa clase con sitio para `cabezas`, al que antes llega el ganado. */
function pastoPara(
  d: Decision,
  desde: IdComarca,
  pasto: Pasto,
  cabezas: number,
  ocupado: ReadonlyMap<string, number>,
): { id: IdComarca; turnos: number } | null {
  const { t } = d;
  const distancias = t.jornadasDesde(desde);
  const candidatos = [...distancias]
    .filter(([id]) => sirve(d, id, pasto))
    .filter(([id]) => (ocupado.get(id) ?? 0) + cabezas <= capacidad(d, id))
    .sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : 1))
    .slice(0, PASTOS_QUE_SE_MIRAN);
  let mejor: { id: IdComarca; turnos: number } | null = null;
  for (const [id] of candidatos) {
    const viaje = preverRebanyo(t, desde, id);
    if (!viaje.ok) continue;
    if (mejor === null || viaje.valor < mejor.turnos) mejor = { id, turnos: viaje.valor };
  }
  return mejor;
}

/**
 * Cada rebanyo quieto en el pasto que toca se queda hasta que tenga que salir para llegar al otro
 * justo al cambiar la estacion. El que no esta en su pasto va al que toca si llega antes de que
 * cambie; si no, directamente al de la estacion que viene.
 */
function trashumancia(d: Decision): void {
  const { t, p } = d;
  const hoy = pastoDelTurno(d, t.turno);
  const cambio = turnosHastaElCambio(d);
  const ocupado = new Map(ganadoPrevisto(d));
  for (const rebanyo of t.rebanyos) {
    if (!Tablero.quieta(rebanyo) && !detenido(d, rebanyo)) continue;
    if (t.ordenes.some((o) => o.tipo === 'ruta' && o.rebanyo === rebanyo.id)) continue;
    const aqui = Tablero.donde(rebanyo);
    // El rebanyo no cuenta en su propio pasto mientras se busca adonde ir.
    ocupado.set(aqui, (ocupado.get(aqui) ?? 0) - rebanyo.cabezas);
    const destino = destinoDe(d, rebanyo, hoy, cambio, ocupado);
    const queda = destino?.id ?? aqui;
    ocupado.set(queda, (ocupado.get(queda) ?? 0) + rebanyo.cabezas);
    if (destino !== null && destino.id !== aqui) p.moverRebanyo(rebanyo.id, destino.id);
  }
}

/**
 * El rebanyo esta parado en una comarca con ruta por delante que hoy el motor ya no trazaria: una
 * comarca del camino ha pasado a otro jugador. Se le busca otro pasto en vez de esperar alli.
 */
function detenido(d: Decision, rebanyo: Rebanyo): boolean {
  if (rebanyo.situacion.donde !== 'comarca') return false;
  const destino = rebanyo.ruta.at(-1);
  if (destino === undefined) return false;
  const hoy = d.t.rutaDeRebanyo(rebanyo.situacion.comarca, destino);
  return hoy === null || hoy.comarcas[0] !== rebanyo.ruta[0];
}

/** Turnos de un solo trayecto que acepta: la mitad del camino del anyo. */
const TRAYECTO_MAXIMO = CAMINO_MAXIMO_AL_ANYO / 2;

/**
 * Adonde va un rebanyo. En el pasto que toca, sale hacia el otro cuando llegaria justo al cambio.
 * Fuera de el, va al que toca si llega antes de que cambie, o al de la estacion que viene. Nunca a un
 * pasto a mas de medio anyo de camino: con eso, quedarse en el suyo pierde menos cabezas.
 */
function destinoDe(
  d: Decision,
  rebanyo: Rebanyo,
  hoy: Pasto,
  cambio: number,
  ocupado: ReadonlyMap<string, number>,
): { id: IdComarca; turnos: number } | null {
  const aqui = Tablero.donde(rebanyo);
  const cerca = (pasto: Pasto): { id: IdComarca; turnos: number } | null => {
    const destino = pastoPara(d, aqui, pasto, rebanyo.cabezas, ocupado);
    return destino !== null && destino.turnos <= TRAYECTO_MAXIMO ? destino : null;
  };
  if (sirve(d, aqui, hoy)) {
    const siguiente = cerca(otro(hoy));
    return siguiente !== null && siguiente.turnos >= cambio ? siguiente : null;
  }
  const ahora = cerca(hoy);
  if (ahora !== null && ahora.turnos < cambio) return ahora;
  if (sirve(d, aqui, otro(hoy))) return null;
  return cerca(otro(hoy)) ?? ahora;
}

/** Lo que la Mesta sabe de sus pastos: los dos con camino razonable, uno solo o ninguno. */
type Ciclo = 'completo' | 'a-medias' | 'ninguno';

/**
 * Hay ciclo completo si se conocen los dos pastos, se llega a ellos desde la capital y el camino de
 * ida y vuelta entre los dos deja pastar la mayor parte del anyo. Con uno solo el ciclo va a medias:
 * el rebanyo pasta su estacion y malpasa la otra perdiendo cabezas, pero aun da pan y lana.
 */
function cicloDe(d: Decision, sede: IdComarca): Ciclo {
  const { t } = d;
  const cabezas = t.reglas.ganaderia.cabezasPorRebanyo;
  const ocupado = ganadoPrevisto(d);
  const verano = pastoPara(d, sede, 'verano', cabezas, ocupado);
  const invierno = pastoPara(d, sede, 'invierno', cabezas, ocupado);
  if (verano === null) d.m.anotar('sin-pasto-de-verano');
  if (invierno === null) d.m.anotar('sin-pasto-de-invierno');
  if (verano === null && invierno === null) return 'ninguno';
  if (verano === null || invierno === null) return 'a-medias';
  const bajar = preverRebanyo(t, verano.id, invierno.id);
  const subir = preverRebanyo(t, invierno.id, verano.id);
  if (!bajar.ok || !subir.ok || bajar.valor + subir.valor > CAMINO_MAXIMO_AL_ANYO) {
    d.m.anotar('pastos-demasiado-lejos');
    return 'a-medias';
  }
  return 'completo';
}

/**
 * Con el ciclo completo, un rebanyo mas por cada 150 maravedis que sobren, hasta cinco. A medias,
 * uno solo: da la renta con que seguir explorando hasta dar con el otro pasto.
 */
function formarRebanyos(d: Decision): void {
  const { t, p } = d;
  const sede = t.sede;
  if (sede === null || t.yo.escasez || t.rebanyos.length >= REBANYOS_MAXIMOS) return;
  if (t.ordenes.some((o) => o.tipo === 'formar-rebanyo')) return;
  const ciclo = cicloDe(d, sede.id);
  const tope = ciclo === 'completo' ? REBANYOS_MAXIMOS : ciclo === 'a-medias' ? 1 : 0;
  if (t.rebanyos.length >= tope) return;
  const coste = costeDeRebanyo(t.casa, t.reglas);
  const sobra = t.disponible('maravedis') - p.reservado('maravedis') - COLCHON - coste.maravedis;
  const quiere = sobra < 0 ? 0 : 1 + Math.floor(sobra / MARAVEDIS_POR_REBANYO);
  if (t.rebanyos.length >= quiere || !p.alcanza(coste)) {
    if (t.rebanyos.length === 0) d.m.anotar('sin-maravedis-para-rebanyo');
    return;
  }
  if (sede.poblacion < 30) return;
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
    esenciales: ['mercado'],
    comarcas: [
      ['granja', 1],
      ['majada', 1],
      ['casas', 1],
    ],
    obrasMayores: ['muralla'],
    // El tratante primero: la Mesta compra el pan que no cria, y sin el no hay pan para lo demas.
    recuas: ['tratar', 'explorar', 'feriar', 'emisario'],
    // La madera del aserradero es su unica renta hasta la primera lana: se vende la que sobra.
    vende: { lana: 0, madera: 60 },
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
