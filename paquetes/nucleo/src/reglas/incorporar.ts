// Incorporar una comarca neutral (docs/06-competicion.md §6.2; ficha T-038 §4.4 a §4.6).
//
// Funciones puras: los requisitos, el ganador de una disputa y la prevision que ve el jugador antes
// de confirmar. La fase 8 las usa para decidir y aplica los efectos con cambios.
import type { EstadoComarca, EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import type { Camino, Mundo } from '../tipos/mundo.ts';
import type { Recursos } from '../tipos/recursos.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { clonar } from '../utiles/clonar.ts';
import type { Mutable } from '../utiles/clonar.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { MIL } from '../utiles/enteros.ts';
import { hash32 } from '../utiles/huella.ts';
import { comparar } from '../utiles/orden.ts';
import {
  costesDeAdministracion,
  jornadasAdministrativasMil,
  jornadasDesde,
} from './administracion.ts';
import { comarcasDe, panDeLasCuadrillas, turnosDeReserva } from './consumo.ts';
import { comarcasTransitables } from './ruta.ts';

export type MotivoSinIncorporar =
  'comarca-con-duenyo' | 'influencia-baja' | 'sin-ventaja' | 'muy-lejos' | 'escasez';

/**
 * Jornadas, en milesimas, desde la comarca propia mas cercana hasta esta, por camino conocido y en
 * verano, o null si no hay ninguna que se pueda recorrer con lo que el jugador sabe.
 */
export function jornadasHastaElDominio(
  estado: EstadoPartida,
  jugador: EstadoJugador,
  comarca: EstadoComarca,
  mundo: Mundo,
  reglas: TablasDeReglas,
): Milesimas | null {
  const propias = comarcasDe(estado, jugador.id);
  const transitables = comarcasTransitables(jugador);
  for (const propia of propias) transitables.add(propia.id);
  transitables.add(comarca.id);
  const desde = jornadasDesde(
    comarca.id,
    mundo,
    (camino: Camino) => jornadasAdministrativasMil(camino, reglas, estado.caminos),
    transitables,
  );
  let mejor: Milesimas | null = null;
  for (const propia of propias) {
    const jornadas = desde.get(propia.id);
    if (jornadas !== undefined && (mejor === null || jornadas < mejor)) mejor = jornadas;
  }
  return mejor;
}

/**
 * Por que este jugador no puede incorporar la comarca ahora, o null si puede. Los requisitos van en
 * este orden y el primero que falla es el que se dice; los recursos los reserva el alta de la orden.
 */
export function impedimentoDeIncorporar(
  estado: EstadoPartida,
  comarca: EstadoComarca,
  jugador: EstadoJugador,
  mundo: Mundo,
  reglas: TablasDeReglas,
): MotivoSinIncorporar | null {
  const t = reglas.influencia;
  if (comarca.duenyo !== null) return 'comarca-con-duenyo';
  const propia = comarca.influencias[jugador.id] ?? 0;
  if (propia < t.minimaParaIncorporar) return 'influencia-baja';
  const mejorRival = Object.entries(comarca.influencias)
    .filter(([id]) => id !== jugador.id)
    .reduce((mejor, [, valor]) => Math.max(mejor, valor), 0);
  if (propia - mejorRival < t.ventajaSobreElSegundo) return 'sin-ventaja';
  const lejania = jornadasHastaElDominio(estado, jugador, comarca, mundo, reglas);
  if (lejania === null || lejania > t.jornadasMaximasDesdeElDominio * MIL) return 'muy-lejos';
  if (jugador.escasez) return 'escasez';
  return null;
}

export interface CandidatoAIncorporar {
  readonly jugador: IdJugador;
  readonly influencia: number;
  readonly presenciaSeguida: number;
}

/**
 * Quien se queda la comarca si varias ordenes terminan el mismo turno: el de mas influencia; si
 * empatan, el de mas turnos seguidos de presencia; y si siguen empatados, el menor
 * `hash(partida, turno, comarca, jugador)` (docs/02 §2.4.4). Nunca quien dio la orden antes.
 */
export function ganadorDeIncorporacion(
  candidatos: readonly CandidatoAIncorporar[],
  semilla: string,
  turno: number,
  comarca: string,
): IdJugador | null {
  const desempate = (jugador: string): number =>
    hash32(`${semilla}|${String(turno)}|incorporar:${comarca}|${jugador}`);
  const ordenados = [...candidatos].sort(
    (a, b) =>
      b.influencia - a.influencia ||
      b.presenciaSeguida - a.presenciaSeguida ||
      desempate(a.jugador) - desempate(b.jugador) ||
      comparar(a.jugador, b.jugador),
  );
  return ordenados[0]?.jugador ?? null;
}

/**
 * El estado tal como queda la comarca al incorporarse: es del jugador con la lealtad de una
 * incorporada, sin las cuentas del concejo, y el jugador la conoce como propia. Su poblacion y
 * sus edificios no cambian. La usan la prevision y el test que la compara con la fase.
 */
export function estadoTrasIncorporar(
  estado: EstadoPartida,
  comarca: IdComarca,
  jugador: IdJugador,
  reglas: TablasDeReglas,
): EstadoPartida {
  const copia: Mutable<EstadoPartida> = clonar(estado) as Mutable<EstadoPartida>;
  const destino = copia.comarcas[comarca];
  const propietario = copia.jugadores[jugador];
  if (destino === undefined || propietario === undefined) return copia;
  destino.duenyo = jugador;
  destino.lealtad = reglas.poblacion.lealtadInicialIncorporada;
  destino.influencias = {};
  destino.presenciaSeguida = {};
  destino.ultimoRegalo = {};
  destino.exDuenyo = null;
  propietario.conocimiento[comarca] = {
    nivel: 'propia',
    turnoUltimaNoticia: copia.turno,
    datos: null,
  };
  return copia;
}

/**
 * Balance de pan por turno de todo el dominio, en milesimas: lo producido el ultimo turno menos lo
 * que come la gente y las cuadrillas. No cuenta la merma, que depende del granero y de la sal.
 */
export function balancePanMil(
  estado: EstadoPartida,
  jugador: IdJugador,
  reglas: TablasDeReglas,
): Milesimas {
  const propias = comarcasDe(estado, jugador);
  const producido = propias.reduce((total, c) => total + c.produccionUltimoTurno.pan, 0);
  const vecinos = propias.reduce((total, c) => total + c.poblacion, 0);
  const cuadrillas = panDeLasCuadrillas(estado, jugador, reglas);
  return producido * MIL - vecinos * reglas.poblacion.consumoPorVecinoMil - cuadrillas * MIL;
}

function administracionTotal(
  estado: EstadoPartida,
  jugador: EstadoJugador,
  mundo: Mundo,
  reglas: TablasDeReglas,
): number {
  return costesDeAdministracion(
    comarcasDe(estado, jugador.id),
    jugador,
    mundo,
    reglas,
    estado.caminos,
  ).reduce((total, c) => total + c.coste, 0);
}

export interface PrevisionDeIncorporar {
  readonly costeTotal: Recursos;
  readonly balancePanAntesMil: Milesimas;
  readonly balancePanDespuesMil: Milesimas;
  /** Turnos que aguanta la reserva de pan tras incorporar, o null si no baja. */
  readonly turnosDeReservaDespues: number | null;
  /** Maravedis por turno de administracion que anyade la comarca. */
  readonly administracionExtra: number;
}

/**
 * Lo que le pasaria al jugador si incorporase la comarca: lo que cuesta, como queda su balance de
 * pan, cuanto aguanta la reserva y cuanto mas cuesta administrar el dominio. Va en el nucleo para
 * que el cliente muestre lo mismo que el servidor resolvera.
 */
export function previsionIncorporar(
  estado: EstadoPartida,
  comarca: IdComarca,
  jugador: IdJugador,
  mundo: Mundo,
  reglas: TablasDeReglas,
): PrevisionDeIncorporar {
  const despues = estadoTrasIncorporar(estado, comarca, jugador, reglas);
  const antes = estado.jugadores[jugador];
  const propietario = despues.jugadores[jugador];
  const balancePanAntesMil = balancePanMil(estado, jugador, reglas);
  const balancePanDespuesMil = balancePanMil(despues, jugador, reglas);
  const pan = propietario === undefined ? 0 : propietario.almacen.pan - propietario.reservado.pan;
  return {
    costeTotal: reglas.influencia.costeIncorporar,
    balancePanAntesMil,
    balancePanDespuesMil,
    turnosDeReservaDespues: turnosDeReserva(pan * MIL, balancePanDespuesMil),
    administracionExtra:
      antes === undefined || propietario === undefined
        ? 0
        : administracionTotal(despues, propietario, mundo, reglas) -
          administracionTotal(estado, antes, mundo, reglas),
  };
}
