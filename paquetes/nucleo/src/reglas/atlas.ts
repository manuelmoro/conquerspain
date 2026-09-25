// El atlas de un jugador (ficha T-081 §4.1): lo que el cliente puede dibujar, construido a partir de
// su vista, asi que no puede ensenyar mas que ella. De lo desconocido solo queda la silueta, sin id ni
// nombre: es la niebla.
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import type { Mundo, NivelPotencial, Potencial, Punto, Terreno } from '../tipos/mundo.ts';
import type { CalidadCamino } from '../tipos/reglas.ts';
import { comparar } from '../utiles/orden.ts';
import { calidadDeTramo } from './ruta.ts';
import type { VistaJugador } from './vista.ts';

export interface ComarcaEnAtlas {
  readonly id: IdComarca;
  readonly nivel: 'propia' | 'explorada' | 'oida';
  readonly nombre: string;
  readonly poligono: readonly Punto[];
  /** Centro del poligono en unidades de atlas (media de sus vertices), para rotulos y trazos. */
  readonly centro: Punto;
  /** Solo de las propias y exploradas. */
  readonly terreno: Terreno | null;
  readonly potenciales: Readonly<Record<Potencial, NivelPotencial>> | null;
  readonly feria: boolean;
  /** El duenyo que conoce el jugador: el suyo, o la foto de cuando la exploro; null si no lo sabe. */
  readonly duenyo: IdJugador | null;
}

export interface TramoEnAtlas {
  readonly desde: IdComarca;
  readonly hasta: IdComarca;
  readonly jornadasBase: number;
  readonly calidad: CalidadCamino;
  readonly vado: boolean;
  readonly puerto: string | null;
  readonly cierraEnInvierno: boolean;
  readonly canyada: boolean;
}

export interface AtlasDeJugador {
  readonly comarcas: readonly ComarcaEnAtlas[];
  /** La tierra que aun no conoce: solo su silueta, ordenada por su primer vertice. */
  readonly niebla: readonly (readonly Punto[])[];
  readonly tramos: readonly TramoEnAtlas[];
}

function centroDe(poligono: readonly Punto[]): Punto {
  if (poligono.length === 0) return [0, 0];
  let x = 0;
  let y = 0;
  for (const [px, py] of poligono) {
    x += px;
    y += py;
  }
  return [Math.round(x / poligono.length), Math.round(y / poligono.length)];
}

export function atlasDeJugador(vista: VistaJugador, mundo: Mundo): AtlasDeJugador {
  const comarcas: ComarcaEnAtlas[] = [];
  const niebla: (readonly Punto[])[] = [];
  for (const id of Object.keys(mundo.comarcas).sort(comparar)) {
    const geografia = mundo.comarcas[id];
    if (geografia === undefined) continue;
    const vista_ = vista.comarcas[id];
    if (vista_ === undefined) {
      niebla.push(geografia.poligono);
      continue;
    }
    const base = {
      id: geografia.id,
      nombre: geografia.nombre,
      poligono: geografia.poligono,
      centro: centroDe(geografia.poligono),
    };
    if (vista_.nivel === 'oida') {
      comarcas.push({
        ...base,
        nivel: 'oida',
        terreno: null,
        potenciales: null,
        feria: geografia.ferias.length > 0,
        duenyo: null,
      });
      continue;
    }
    comarcas.push({
      ...base,
      nivel: vista_.nivel,
      terreno: geografia.terreno,
      potenciales: geografia.potenciales,
      feria: geografia.ferias.length > 0,
      duenyo: vista_.nivel === 'propia' ? vista.jugador.id : (vista_.datos?.duenyo ?? null),
    });
  }
  niebla.sort((a, b) => (a[0]?.[0] ?? 0) - (b[0]?.[0] ?? 0) || (a[0]?.[1] ?? 0) - (b[0]?.[1] ?? 0));
  const tramos: TramoEnAtlas[] = [];
  for (const camino of mundo.caminos) {
    if (vista.comarcas[camino.desde] === undefined || vista.comarcas[camino.hasta] === undefined)
      continue;
    tramos.push({
      desde: camino.desde,
      hasta: camino.hasta,
      jornadasBase: camino.jornadasBase,
      calidad: calidadDeTramo(camino, vista.caminos),
      vado: camino.vado,
      puerto: camino.puertoDeMontanya,
      cierraEnInvierno: camino.cierraEnInvierno,
      canyada: camino.canyada !== null,
    });
  }
  return { comarcas, niebla, tramos };
}
