// La prevision de una ruta trazada a mano (ficha T-083 §4.3): tramo a tramo con sus jornadas, el
// turno de llegada a cada parada, lo que come el viaje y los avisos de la estacion, antes de
// confirmar. Sale del tablero del jugador, asi que solo sabe lo que el sabe.
import type { Rebanyo, Recua } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import { Tablero } from './tablero.ts';
import type { ViajeImposible } from './viaje.ts';
import { preverRebanyo, preverViaje } from './viaje.ts';

export interface TramoPrevisto {
  readonly desde: IdComarca;
  readonly hasta: IdComarca;
  /** Jornadas de este turno, redondeadas hacia arriba; null si hoy esta cerrado. */
  readonly jornadas: number | null;
  readonly puerto: string | null;
}

export interface PrevisionDeRuta {
  readonly ok: boolean;
  readonly motivo: ViajeImposible | null;
  readonly tramos: readonly TramoPrevisto[];
  /** Turno, contando desde 1 (el que se juega), en que llega a cada parada; vacio si no se puede. */
  readonly llegadas: readonly number[];
  /** Lo que come el viaje de la carga (recuas). */
  readonly pan: number;
  readonly sal: number;
  /** Lo que falta cargar en casa para el viaje: lo que come fuera menos lo que ya lleva. */
  readonly faltaPan: number;
  readonly faltaSal: number;
  /** Lo que conviene saber antes de confirmar, en palabras del jugador. */
  readonly avisos: readonly string[];
}

export type UnidadQueViaja =
  | { readonly clase: 'recua'; readonly recua: Recua }
  | { readonly clase: 'rebanyo'; readonly rebanyo: Rebanyo };

function vacia(motivo: ViajeImposible, tramos: readonly TramoPrevisto[] = []): PrevisionDeRuta {
  return {
    ok: false,
    motivo,
    tramos,
    llegadas: [],
    pan: 0,
    sal: 0,
    faltaPan: 0,
    faltaSal: 0,
    avisos: [],
  };
}

function tramosDe(t: Tablero, desde: IdComarca, comarcas: readonly IdComarca[]): TramoPrevisto[] {
  const hoy = t.estacional(t.turno);
  const tramos: TramoPrevisto[] = [];
  let anterior = desde;
  for (const hasta of comarcas) {
    const coste = t.costeDeTramo(anterior, hasta, hoy);
    tramos.push({
      desde: anterior,
      hasta,
      jornadas: coste === 'cerrado' ? null : Math.ceil(coste / 1000),
      puerto: t.tramo(anterior, hasta)?.puertoDeMontanya ?? null,
    });
    anterior = hasta;
  }
  return tramos;
}

/** Los puertos de la ruta que se cierran mientras se viaja, aunque la recua llegue a cruzarlos. */
function avisosDePuertos(t: Tablero, tramos: readonly TramoPrevisto[], turnos: number): string[] {
  const avisos: string[] = [];
  const puertos = [...new Set(tramos.flatMap((tr) => (tr.puerto === null ? [] : [tr.puerto])))];
  for (const puerto of puertos) {
    for (let k = 0; k < turnos; k += 1) {
      if (t.estacional(t.turno + k).puertosCerrados.includes(puerto)) {
        avisos.push(
          k === 0
            ? `${puerto} está cerrado por la nieve.`
            : `${puerto} se cierra dentro de ${String(k)} turno${k === 1 ? '' : 's'}, antes de que acabe el viaje.`,
        );
        break;
      }
    }
  }
  return avisos;
}

export function previsionDeRuta(
  t: Tablero,
  unidad: UnidadQueViaja,
  paradas: readonly IdComarca[],
  circular: boolean,
): PrevisionDeRuta {
  if (paradas.length === 0) return vacia('sin-ruta');
  const movil = unidad.clase === 'recua' ? unidad.recua : unidad.rebanyo;
  const desde = Tablero.donde(movil);

  if (unidad.clase === 'rebanyo') {
    const destino = paradas[paradas.length - 1] ?? desde;
    const ruta = t.rutaDeRebanyo(desde, destino);
    if (ruta === null) return vacia('sin-ruta');
    const tramos = tramosDe(t, desde, ruta.comarcas);
    const turnos = preverRebanyo(t, desde, destino);
    if (!turnos.ok) return vacia(turnos.motivo, tramos);
    return {
      ok: true,
      motivo: null,
      tramos,
      llegadas: [Math.max(1, turnos.valor)],
      pan: 0,
      sal: 0,
      faltaPan: 0,
      faltaSal: 0,
      avisos: avisosDePuertos(t, tramos, turnos.valor),
    };
  }

  const recua = unidad.recua;
  // Una vuelta del circuito: de la ultima parada se vuelve a la primera.
  const vuelta = circular && paradas[0] !== undefined ? [...paradas, paradas[0]] : [...paradas];
  const ruta = t.rutaDeRecua(desde, vuelta);
  if (ruta === null) return vacia('sin-ruta');
  const tramos = tramosDe(t, desde, ruta.comarcas);
  const viaje = preverViaje(
    t,
    recua,
    vuelta.map((comarca) => ({ comarca, detiene: true })),
    recua.carga,
  );
  if (!viaje.ok) return vacia(viaje.motivo, tramos);
  const p = viaje.valor;
  const faltaPan = Math.max(0, p.pan - recua.carga.pan);
  const faltaSal = Math.max(0, p.sal - recua.carga.sal);
  const avisos = avisosDePuertos(t, tramos, p.turnos);
  if (faltaSal > 0) {
    avisos.push(`Es tiempo de calor: el viaje pide ${String(p.sal)} de sal para las conservas.`);
  }
  if (faltaPan > 0 && !t.esPropia(desde)) {
    avisos.push(
      `Lleva ${String(recua.carga.pan)} de pan y el viaje come ${String(p.pan)}: fuera de casa no puede cargar.`,
    );
  }
  return {
    ok: true,
    motivo: null,
    tramos,
    llegadas: p.llegadas.slice(0, paradas.length),
    pan: p.pan,
    sal: p.sal,
    faltaPan,
    faltaSal,
    avisos,
  };
}
