// Partidas de mentira para las pruebas del banco: se arman a mano, cifra a cifra, para que cada
// alerta y cada criterio salten exactamente por lo que tienen que saltar. No juegan nada.
import { HITOS, TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type { Casa, Hito, IdJugador, Recursos } from '@conquer/nucleo';

import { mundoMini } from '../../../paquetes/nucleo/pruebas/mundo-mini.ts';
import type { OpcionesDelBanco, ResultadoDelBanco } from './ejecutar.ts';
import type {
  FilaDeTurno,
  MetricasDeJugador,
  MetricasDePartida,
  PrecioPegado,
} from './metricas.ts';
import type { TrazaDeNegocios } from './negocios.ts';
import { componerManifiesto } from './procedencia.ts';
import type { Manifiesto } from './procedencia.ts';

const CERO: Recursos = { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 };
const CAPITULOS = {
  poblacion: 0,
  territorio: 0,
  obras: 0,
  caminos: 0,
  comercio: 0,
  exploracion: 0,
  ganaderia: 0,
  industria: 0,
  hitos: 0,
};

export const TURNOS_DE_PRUEBA = 20;

export function fila(turno: number, cambios: Partial<FilaDeTurno> = {}): FilaDeTurno {
  return {
    turno,
    prestigio: 0,
    capitulos: CAPITULOS,
    penalizaciones: 0,
    poblacion: 60,
    comarcas: 1,
    almacen: CERO,
    escasez: false,
    produccion: CERO,
    obrasTerminadas: 0,
    obrasMayoresTerminadas: 0,
    hitosLogrados: 0,
    jornadasMil: 0,
    volumenComerciado: 0,
    volumenEnRuta: 0,
    porEdificio: {},
    ingresosDeFeria: 0,
    lanaEsquilada: 0,
    vendido: {},
    ventasFuera: 0,
    aperos: 0,
    trashumancias: 0,
    pueblasFundadas: 0,
    comarcasIncorporadas: 0,
    decidio: true,
    ordenesPropuestas: 1,
    sinOrdenes: false,
    ordenesDeAlta: 0,
    ordenesTerminadas: 0,
    ordenesCanceladas: 0,
    ordenesEnEspera: 0,
    ordenesUtiles: 1,
    enMarcha: false,
    sinDecisionUtil: false,
    motivos: [],
    porTipo: {},
    ...cambios,
  };
}

export function trazaVacia(): TrazaDeNegocios {
  return {
    negocios: [],
    reventas: [],
    ventasSinCompra: [],
    cargasDescargadas: 0,
    bastimentoSinCarga: { pan: 0, sal: 0 },
  };
}

export interface Jugada {
  readonly casa: Casa;
  /** Prestigio del ultimo turno. */
  readonly prestigio: number;
  /** Turnos (los primeros) en que el robot no propuso ninguna orden. */
  readonly sinOrdenes?: number;
  /** Turnos (los primeros) con escasez. */
  readonly escasez?: number;
  /** Turno del hito «Un pequeño dominio»; null si no lo logro. */
  readonly dominio?: number | null;
  /** Turno de la primera obra mayor terminada; null si no termino ninguna. */
  readonly obraMayor?: number | null;
  /** Prestigio en turnos concretos, para las parejas de ausencia. */
  readonly enTurno?: Readonly<Record<number, number>>;
  readonly traza?: TrazaDeNegocios;
}

export interface Extras {
  readonly semilla?: string;
  readonly turnos?: number;
  readonly cadencia?: number;
  readonly preciosPegados?: readonly PrecioPegado[];
  readonly tocadas?: readonly string[];
  readonly mapa?: readonly string[];
  readonly visitasCompletas?: boolean;
}

function hitosDe(jugada: Jugada): Record<Hito, number | null> {
  const hitos = {} as Record<Hito, number | null>;
  for (const hito of HITOS) hitos[hito] = null;
  hitos['pequenyo-dominio'] = jugada.dominio ?? null;
  return hitos;
}

export function partida(jugadas: readonly Jugada[], extra: Extras = {}): MetricasDePartida {
  const turnos = extra.turnos ?? TURNOS_DE_PRUEBA;
  const jugadores: MetricasDeJugador[] = jugadas.map((j) => ({
    jugador: j.casa as string as IdJugador,
    casa: j.casa,
    hitos: hitosDe(j),
    primeraObraMayor: j.obraMayor ?? null,
    compras: [],
    ventas: [],
    traza: j.traza ?? trazaVacia(),
    cancelacionesPorMotivo: {},
    esperasPorMotivo: {},
    filas: Array.from({ length: turnos }, (_, i) => {
      const turno = i + 1;
      return fila(turno, {
        prestigio: j.enTurno?.[turno] ?? (turno === turnos ? j.prestigio : 0),
        sinOrdenes: i < (j.sinOrdenes ?? 0),
        ordenesPropuestas: i < (j.sinOrdenes ?? 0) ? 0 : 1,
        ordenesUtiles: i < (j.sinOrdenes ?? 0) ? 0 : 1,
        sinDecisionUtil: i < (j.sinOrdenes ?? 0),
        escasez: i < (j.escasez ?? 0),
        obrasMayoresTerminadas: turno === j.obraMayor ? 1 : 0,
      });
    }),
  }));
  const mapa = extra.mapa ?? Object.keys(mundoMini().comarcas);
  return {
    semilla: extra.semilla ?? 'prueba',
    turnos,
    cadencia: extra.cadencia ?? 1,
    jugadores,
    puestos: Object.fromEntries(jugadas.map((j, i) => [j.casa, i + 1])),
    primicias: {},
    preciosPegados: extra.preciosPegados ?? [],
    comarcasTocadas: extra.tocadas ?? mapa,
    comarcasDelMapa: mapa,
    visitasCompletas: extra.visitasCompletas ?? true,
    huellaFinal: 'huella',
  };
}

export function resultado(
  partidas: readonly MetricasDePartida[],
  ausentes: readonly MetricasDePartida[] = [],
  opciones: Partial<OpcionesDelBanco> = {},
  equivalencia: ResultadoDelBanco['equivalencia'] = [],
): ResultadoDelBanco {
  const primera = partidas[0];
  return {
    opciones: {
      semilla: primera?.semilla ?? 'prueba',
      turnos: primera?.turnos ?? TURNOS_DE_PRUEBA,
      casas: primera?.jugadores.map((j) => j.casa) ?? [],
      repeticiones: partidas.length,
      escenario: 'normal',
      ausencia: ausentes.length > 0,
      estados: null,
      ...opciones,
    },
    partidas,
    ausentes,
    equivalencia,
  };
}

export function manifiesto(resultadoDelBanco: ResultadoDelBanco): Manifiesto {
  return componerManifiesto(resultadoDelBanco, mundoMini(), TABLAS_DEL_JUEGO, {
    revision: 'prueba',
    etiqueta: 'prueba',
    cambios: '',
  });
}
