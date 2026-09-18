// Rutas de las recuas por el grafo de caminos (docs/03-economia.md §3.7.2; ficha T-033 §4.2).
//
// Dijkstra con el coste en milesimas de jornada de la estacion y el turno, solo por comarcas que el
// jugador ha explorado o son suyas: no se traza ruta por donde no se ha estado. Los empates de
// coste los gana la ruta cuya secuencia de identificadores es menor, asi que el resultado no
// depende del orden en que el mundo guarda los tramos.
import type { EstadoEstacional } from './calendario.ts';
import type { CosteDeTramoMil } from './jornadas.ts';
import { jornadasDeTramoMil } from './jornadas.ts';
import type { EstadoJugador, EstadoTramo } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import type { Camino, Mundo } from '../tipos/mundo.ts';
import type { CalidadCamino, TablasDeReglas } from '../tipos/reglas.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { comparar } from '../utiles/orden.ts';

/** Tramos mejorados por obras (`EstadoPartida.caminos`). */
export type Mejoras = Readonly<Record<string, EstadoTramo>>;

/** Clave de un tramo en `EstadoPartida.caminos`: las dos comarcas en orden, con una barra. */
export function claveDeTramo(una: string, otra: string): string {
  return comparar(una, otra) <= 0 ? `${una}|${otra}` : `${otra}|${una}`;
}

/**
 * Calidad de un tramo: la que le hayan dado las obras o, si no, la de partida. Las calzadas romanas
 * empiezan como camino carretero (docs/05 §5.4) y el resto como vereda.
 */
export function calidadDeTramo(camino: Camino, mejoras: Mejoras): CalidadCamino {
  const obra = mejoras[claveDeTramo(camino.desde, camino.hasta)];
  if (obra !== undefined) return obra.calidad;
  return camino.calzadaRomana ? 'carretero' : 'vereda';
}

/** El tramo tiene calzada: nunca se cierra y la recua anda una jornada mas por el. */
export function tieneCalzada(camino: Camino, mejoras: Mejoras): boolean {
  return camino.calzadaRomana || calidadDeTramo(camino, mejoras) === 'calzada';
}

/** El vado del tramo tiene puente. */
export function tienePuente(camino: Camino, mejoras: Mejoras): boolean {
  return mejoras[claveDeTramo(camino.desde, camino.hasta)]?.puente === true;
}

/** Lo que cuesta cruzar un tramo este turno, en milesimas de jornada. */
export function costeDeTramoMil(
  camino: Camino,
  estacional: EstadoEstacional,
  reglas: TablasDeReglas,
  mejoras: Mejoras,
): CosteDeTramoMil {
  const clave = claveDeTramo(camino.desde, camino.hasta);
  return jornadasDeTramoMil(camino, estacional.estacion, calidadDeTramo(camino, mejoras), reglas, {
    barro: estacional.barro,
    puente: tienePuente(camino, mejoras),
    nieveTemprana: estacional.tramosConNieveTemprana.has(clave),
    crecida: estacional.tramosEnCrecida.has(clave),
  });
}

/** Comarcas por las que un jugador puede trazar rutas: las exploradas y las suyas. */
export function comarcasTransitables(jugador: EstadoJugador): Set<string> {
  const transitables = new Set<string>([jugador.capital]);
  for (const [id, conocimiento] of Object.entries(jugador.conocimiento)) {
    if (conocimiento.nivel === 'explorada' || conocimiento.nivel === 'propia') transitables.add(id);
  }
  return transitables;
}

/** Comarcas de las que el jugador sabe al menos el nombre: se puede ir a ellas, no por ellas. */
export function comarcaConocida(jugador: EstadoJugador, comarca: string): boolean {
  const nivel = jugador.conocimiento[comarca]?.nivel;
  return comarca === jugador.capital || (nivel !== undefined && nivel !== 'desconocida');
}

const TRAMOS = new WeakMap<Mundo, Map<string, Camino[]>>();

/** Tramos que salen de cada comarca, en el orden del mundo. Se calcula una vez por mundo. */
function tramosDe(mundo: Mundo): Map<string, Camino[]> {
  const guardados = TRAMOS.get(mundo);
  if (guardados !== undefined) return guardados;
  const tramos = new Map<string, Camino[]>();
  for (const camino of mundo.caminos) {
    for (const extremo of [camino.desde, camino.hasta]) {
      const lista = tramos.get(extremo) ?? [];
      lista.push(camino);
      tramos.set(extremo, lista);
    }
  }
  TRAMOS.set(mundo, tramos);
  return tramos;
}

/** El tramo que une dos comarcas vecinas, o undefined si no son vecinas. */
export function tramoEntre(mundo: Mundo, una: string, otra: string): Camino | undefined {
  return tramosDe(mundo)
    .get(una)
    ?.find((c) => (c.desde === una && c.hasta === otra) || (c.hasta === una && c.desde === otra));
}

function compararSecuencias(a: readonly string[], b: readonly string[]): number {
  const largo = Math.min(a.length, b.length);
  for (let i = 0; i < largo; i += 1) {
    const orden = comparar(a[i] ?? '', b[i] ?? '');
    if (orden !== 0) return orden;
  }
  return a.length - b.length;
}

export interface Ruta {
  /** Comarcas que se recorren, sin la de salida y con la de llegada. */
  readonly comarcas: readonly IdComarca[];
  readonly jornadasMil: Milesimas;
}

interface Etiqueta {
  readonly coste: number;
  readonly camino: readonly IdComarca[];
}

/**
 * La ruta mas corta entre dos comarcas este turno, o null si no la hay. Las comarcas intermedias
 * tienen que ser transitables; la de llegada basta con que se conozca (se decide fuera). Los tramos
 * cerrados por nieve no se usan.
 */
export function rutaMasCorta(
  desde: IdComarca,
  hasta: IdComarca,
  mundo: Mundo,
  estacional: EstadoEstacional,
  transitables: ReadonlySet<string>,
  reglas: TablasDeReglas,
  mejoras: Mejoras,
): Ruta | null {
  if (desde === hasta) return { comarcas: [], jornadasMil: 0 };
  const etiquetas = new Map<string, Etiqueta>([[desde, { coste: 0, camino: [] }]]);
  const cerradas = new Set<string>();
  const tramos = tramosDe(mundo);

  for (;;) {
    let actual: string | null = null;
    let mejor: Etiqueta | null = null;
    for (const [id, etiqueta] of etiquetas) {
      if (cerradas.has(id)) continue;
      if (
        mejor === null ||
        etiqueta.coste < mejor.coste ||
        (etiqueta.coste === mejor.coste && compararSecuencias(etiqueta.camino, mejor.camino) < 0)
      ) {
        actual = id;
        mejor = etiqueta;
      }
    }
    if (actual === null || mejor === null) return null;
    if (actual === hasta) return { comarcas: mejor.camino, jornadasMil: mejor.coste };
    cerradas.add(actual);
    // Solo se sigue andando desde la salida o desde comarcas transitables.
    if (actual !== desde && !transitables.has(actual)) continue;

    for (const camino of tramos.get(actual) ?? []) {
      const vecina = camino.desde === actual ? camino.hasta : camino.desde;
      if (cerradas.has(vecina)) continue;
      if (vecina !== hasta && !transitables.has(vecina)) continue;
      const coste = costeDeTramoMil(camino, estacional, reglas, mejoras);
      if (coste === 'cerrado') continue;
      const nueva: Etiqueta = { coste: mejor.coste + coste, camino: [...mejor.camino, vecina] };
      const vieja = etiquetas.get(vecina);
      if (
        vieja === undefined ||
        nueva.coste < vieja.coste ||
        (nueva.coste === vieja.coste && compararSecuencias(nueva.camino, vieja.camino) < 0)
      ) {
        etiquetas.set(vecina, nueva);
      }
    }
  }
}

/**
 * Ruta que pasa por las paradas en orden. Si es circular, vuelve al punto de salida: una ruta
 * permanente es un circuito que empieza y acaba donde esta la recua.
 */
export function rutaPorParadas(
  desde: IdComarca,
  paradas: readonly IdComarca[],
  circular: boolean,
  mundo: Mundo,
  estacional: EstadoEstacional,
  transitables: ReadonlySet<string>,
  reglas: TablasDeReglas,
  mejoras: Mejoras,
): Ruta | null {
  const destinos = circular ? [...paradas, desde] : [...paradas];
  const comarcas: IdComarca[] = [];
  let jornadasMil = 0;
  let origen = desde;
  for (const destino of destinos) {
    const tramo = rutaMasCorta(origen, destino, mundo, estacional, transitables, reglas, mejoras);
    if (tramo === null) return null;
    comarcas.push(...tramo.comarcas);
    jornadasMil += tramo.jornadasMil;
    origen = destino;
  }
  return { comarcas, jornadasMil };
}
