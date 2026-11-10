// El atlas de un jugador (ficha T-081 §4.1): lo que el cliente puede dibujar, construido a partir de
// su vista, asi que no puede ensenyar mas que ella. De lo desconocido solo queda la silueta, sin id ni
// nombre: es la niebla.
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import type { Camino, Mundo, NivelPotencial, Potencial, Punto, Terreno } from '../tipos/mundo.ts';
import type { CalidadCamino, TablasDeReglas } from '../tipos/reglas.ts';
import { comparar } from '../utiles/orden.ts';
import { riesgoDeTramoMil } from './bandidaje.ts';
import type { PuntaDelTramo } from './bandidaje.ts';
import { calidadDeTramo, tieneCalzada } from './ruta.ts';
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
  /** Riesgo de asalto estimado con lo que sabe el jugador, en milesimas (T-122). */
  readonly riesgoMil: number;
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

export function atlasDeJugador(
  vista: VistaJugador,
  mundo: Mundo,
  reglas: TablasDeReglas,
): AtlasDeJugador {
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
      riesgoMil: riesgoEstimado(vista, camino, reglas),
    });
  }
  return { comarcas, niebla, tramos };
}

/**
 * El riesgo de asalto de un tramo con lo que sabe el jugador (T-122): de lo suyo, todo; de lo
 * explorado, si tiene dueno y venta; de lo demas, nada, y cuenta como tierra sin dueno.
 */
function riesgoEstimado(vista: VistaJugador, camino: Camino, reglas: TablasDeReglas): number {
  const punta = (id: string): PuntaDelTramo => {
    const v = vista.comarcas[id];
    if (v?.nivel === 'propia') {
      return {
        conDueno: true,
        venta: (v.comarca.edificios['venta'] ?? 0) > 0,
        lealtad: v.comarca.lealtad,
      };
    }
    const datos = v?.nivel === 'explorada' ? v.datos : null;
    return {
      conDueno: datos !== null && datos.duenyo !== null,
      venta: (datos?.edificios['venta'] ?? 0) > 0,
      lealtad: null,
    };
  };
  const escoltada = vista.mesnadas.some(
    (m) =>
      m.situacion.donde === 'comarca' &&
      (m.situacion.comarca === camino.desde || m.situacion.comarca === camino.hasta),
  );
  return riesgoDeTramoMil(
    camino,
    [punta(camino.desde), punta(camino.hasta)],
    tieneCalzada(camino, vista.caminos),
    escoltada,
    reglas,
  );
}
