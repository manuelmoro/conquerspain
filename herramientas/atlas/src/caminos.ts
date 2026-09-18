// Aplica al grafo generado la capa historica de caminos (T-013): puertos, vados, calzadas y
// canyadas. El atlas sabe que comarcas se tocan; el catalogo dice que hay entre ellas.
import type { Camino, Mundo } from '@conquer/nucleo';
import { JORNADAS_DE_PUERTO, comparar } from '@conquer/nucleo';
import type { CaminosCatalogo } from '@conquer/mundo';

/** Coste maximo, con camino de herradura, para considerar que una comarca no esta incomunicada. */
const JORNADAS_DE_COMUNICACION = 4;

function clave(a: string, b: string): string {
  return comparar(a, b) < 0 ? `${a}|${b}` : `${b}|${a}`;
}

function paresDeRuta(comarcas: readonly string[]): string[] {
  const pares: string[] = [];
  for (let i = 0; i + 1 < comarcas.length; i += 1) {
    const a = comarcas[i];
    const b = comarcas[i + 1];
    if (a === undefined || b === undefined) continue;
    pares.push(clave(a, b));
  }
  return pares;
}

/**
 * Devuelve los caminos del mundo con la capa historica puesta. No modifica el mundo recibido:
 * el atlas sigue siendo reproducible byte a byte.
 */
export function aplicarCaminos(
  caminos: readonly Camino[],
  capa: CaminosCatalogo,
): readonly Camino[] {
  const puertos = new Map<string, { nombre: string; cierre: string }>();
  for (const puerto of capa.puertos) {
    puertos.set(clave(puerto.entre[0], puerto.entre[1]), {
      nombre: puerto.nombre,
      cierre: puerto.cierre,
    });
  }
  const vados = new Set(capa.vados.map((vado) => clave(vado.entre[0], vado.entre[1])));
  const calzadas = new Set(capa.calzadas.flatMap((ruta) => paresDeRuta(ruta.comarcas)));
  const canyadas = new Map<string, string>();
  for (const canyada of capa.canyadas) {
    for (const par of paresDeRuta(canyada.comarcas)) {
      if (!canyadas.has(par)) canyadas.set(par, canyada.nombre);
    }
  }

  return caminos.map((camino) => {
    const suya = clave(camino.desde, camino.hasta);
    const puerto = puertos.get(suya);
    // Todos los puertos cuestan lo mismo de subir; solo unos pocos se cierran por nieve.
    return {
      ...camino,
      jornadasBase: puerto === undefined ? camino.jornadasBase : JORNADAS_DE_PUERTO,
      vado: vados.has(suya),
      puertoDeMontanya: puerto?.nombre ?? null,
      cierraEnInvierno: puerto?.cierre === 'invierno',
      canyada: canyadas.get(suya) ?? null,
      calzadaRomana: calzadas.has(suya),
    };
  });
}

/**
 * Coste de un tramo con camino de herradura, sin efectos de estacion. El atlas no conoce las
 * tablas de reglas de la partida (llegan en T-030), asi que usa los numeros documentados en
 * docs/03-economia.md §3.7.2: base del terreno o 7 si es puerto, por el 80 % de la herradura.
 */
function jornadasConHerradura(camino: Camino): number {
  const base = camino.puertoDeMontanya !== null ? JORNADAS_DE_PUERTO : camino.jornadasBase;
  const conCamino = Math.floor((base * 800) / 1000);
  return Math.max(1, conCamino + (camino.vado && !camino.calzadaRomana ? 2 : 0));
}

/** Un puerto cerrado en invierno solo se cruza si el tramo tiene calzada (docs/03 §3.7.2). */
function abiertoEnInvierno(camino: Camino): boolean {
  return !camino.cierraEnInvierno || camino.calzadaRomana;
}

/** Comarcas que no tienen ni un tramo de cuatro jornadas o menos (ficha T-013 §4.6). */
export function comarcasIncomunicadas(mundo: Mundo): string[] {
  const mejor = new Map<string, number>();
  for (const camino of mundo.caminos) {
    const coste = jornadasConHerradura(camino);
    for (const id of [camino.desde, camino.hasta]) {
      const anterior = mejor.get(id);
      if (anterior === undefined || coste < anterior) mejor.set(id, coste);
    }
  }
  return Object.keys(mundo.comarcas)
    .filter((id) => (mejor.get(id) ?? Number.MAX_SAFE_INTEGER) > JORNADAS_DE_COMUNICACION)
    .sort(comparar);
}

/** Comarcas que quedan aisladas en invierno, usando solo los tramos abiertos (§4.6). */
export function comarcasAisladasEnInvierno(mundo: Mundo): string[] {
  const abiertos = new Map<string, string[]>();
  const anyadir = (a: string, b: string): void => {
    const lista = abiertos.get(a);
    if (lista === undefined) abiertos.set(a, [b]);
    else lista.push(b);
  };
  for (const camino of mundo.caminos) {
    if (!abiertoEnInvierno(camino)) continue;
    anyadir(camino.desde, camino.hasta);
    anyadir(camino.hasta, camino.desde);
  }
  const ids = Object.keys(mundo.comarcas).sort(comparar);
  const vistos = new Set<string>();
  const pila = ids.slice(0, 1);
  while (pila.length > 0) {
    const actual = pila.pop();
    if (actual === undefined || vistos.has(actual)) continue;
    vistos.add(actual);
    for (const vecino of abiertos.get(actual) ?? []) pila.push(vecino);
  }
  return ids.filter((id) => !vistos.has(id));
}
