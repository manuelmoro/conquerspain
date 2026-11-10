// Entrar en una partida empezada (ficha T-107). El que entra tarde elige entre las ofertas de su
// casa que siguen libres y lejos de todos, y entra con su arranque, su alfoz y su amparo. Funciones
// puras: la fase 0 las aplica con la orden `entrar` que da el servidor.
import { origenesPosibles, elegirOrigenes } from '../reglas/casas/origenes.ts';
import type { EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import type { ComarcaMundo, Mundo } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { arranqueDe } from './arranque.ts';
import type { Arranque } from './arranque.ts';
import { indiceDeCaminos, jornadasDesde } from './distancias.ts';
import { conSuCanyada, jugadorInicial } from './fundar.ts';
import type { OfertaDeOrigen, Participante } from './ofertas.ts';
import { tarjetaDe } from './ofertas.ts';

export type MotivoSinEntrada = 'ya-en-la-partida' | 'temporada-cerrada' | 'origen-no-ofrecido';

/** La comarca esta libre: sin dueno, sin unidades ajenas dentro y sin obras ni venta de nadie. */
function libre(estado: EstadoPartida, id: string): boolean {
  const comarca = estado.comarcas[id];
  if (comarca?.duenyo !== null || comarca.ventaDe !== null) return false;
  const dentro = (situacion: { donde: string; comarca?: string }): boolean =>
    situacion.donde === 'comarca' && situacion.comarca === id;
  return (
    !Object.values(estado.recuas).some((r) => dentro(r.situacion)) &&
    !Object.values(estado.rebanyos).some((r) => dentro(r.situacion)) &&
    !Object.values(estado.obras).some((o) => o.comarca === id)
  );
}

/**
 * Las ofertas para quien entra: los origenes de su casa que siguen libres y a la distancia de
 * siempre de cualquier comarca con dueno. Las elige el azar de la partida, con su turno y su
 * jugador: las mismas para quien pregunta dos veces el mismo turno.
 */
export function ofertasDeEntrada(
  estado: EstadoPartida,
  mundo: Mundo,
  reglas: TablasDeReglas,
  participante: Participante,
): readonly OfertaDeOrigen[] {
  const minima = reglas.arranque.recorte.jornadasEntreCapitales;
  const indice = indiceDeCaminos(mundo);
  const conDueno = Object.values(estado.comarcas)
    .filter((c) => c.duenyo !== null)
    .map((c) => c.id);
  const candidatas = origenesPosibles(mundo, participante.casa, reglas).filter((comarca) => {
    if (!libre(estado, comarca.id)) return false;
    const distancia = jornadasDesde(mundo, comarca.id, indice);
    return conDueno.every((otra) => (distancia.get(otra) ?? Number.POSITIVE_INFINITY) >= minima);
  });
  const elegidas = elegirOrigenes(
    candidatas,
    participante.casa,
    `${estado.semilla}|entrada|${participante.id}|${String(estado.turno)}`,
    reglas.arranque.recorte.origenesPorCasa,
  );
  return elegidas.flatMap((id) => {
    const comarca: ComarcaMundo | undefined = mundo.comarcas[id];
    return comarca === undefined ? [] : [tarjetaDe(comarca, reglas, participante.casa)];
  });
}

/** Por que no puede entrar con ese origen, o null si puede. */
export function impedimentoDeEntrada(
  estado: EstadoPartida,
  mundo: Mundo,
  reglas: TablasDeReglas,
  participante: Participante,
  comarca: IdComarca,
): MotivoSinEntrada | null {
  if (estado.jugadores[participante.id] !== undefined) return 'ya-en-la-partida';
  if (estado.cierre !== undefined) return 'temporada-cerrada';
  const ofrecidas = ofertasDeEntrada(estado, mundo, reglas, participante);
  return ofrecidas.some((o) => o.comarca === comarca) ? null : 'origen-no-ofrecido';
}

export interface Entrada {
  readonly jugador: EstadoJugador;
  readonly arranque: Arranque;
}

/** El jugador que entra, con su capital, su arranque y su amparo desde este turno. */
export function entradaDe(
  estado: EstadoPartida,
  mundo: Mundo,
  reglas: TablasDeReglas,
  participante: Participante,
  capital: IdComarca,
): Entrada {
  const geografia = mundo.comarcas[capital];
  if (geografia === undefined) throw new Error(`La comarca "${capital}" no esta en el mundo.`);
  const arranque = arranqueDe(geografia, participante.casa, reglas);
  const base = jugadorInicial(participante, capital, arranque.almacen, mundo, estado.turno);
  const conCanyada = conSuCanyada(base, mundo, estado.comarcas, reglas, estado.turno);
  return {
    jugador: {
      ...conCanyada,
      amparoHasta: estado.turno + reglas.ausencia.turnosDeAmparo,
    },
    arranque,
  };
}
