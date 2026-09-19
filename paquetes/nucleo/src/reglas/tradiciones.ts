// Tradiciones: la rama que se elige a mitad de camino (docs/04-casas-y-tradiciones.md §4.3; ficha
// T-042).
//
// Funciones puras: cuando se abre cada ronda, que cartas se ofrecen y por que se rechaza una
// eleccion. Las usan la fase 11, los cambios del estado y, al dar la orden, el servidor (T-062):
// un solo sitio decide si una eleccion vale.
import type { EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type {
  Casa,
  CondicionDeRonda,
  RondaDeTradicion,
  TablasDeReglas,
  Tradicion,
} from '../tipos/reglas.ts';
import { RONDAS_DE_TRADICION } from '../tipos/reglas.ts';
import { comparar } from '../utiles/orden.ts';

/** Lo que mira una ronda para abrirse, medido al final del turno. */
export interface LogrosDelJugador {
  readonly comarcas: number;
  readonly vecinos: number;
  readonly obraMayorTerminada: boolean;
  readonly prestigio: number;
  readonly turno: number;
}

/** Los logros de un jugador; la obra mayor, del registro que apunta la fase 11 (T-043). */
export function logrosDe(
  estado: EstadoPartida,
  jugador: EstadoJugador,
  turno: number,
): LogrosDelJugador {
  const propias = Object.values(estado.comarcas).filter((c) => c.duenyo === jugador.id);
  return {
    comarcas: propias.length,
    vecinos: propias.reduce((total, comarca) => total + comarca.poblacion, 0),
    obraMayorTerminada: Object.values(jugador.registro.obrasMayores).some((n) => n > 0),
    prestigio: jugador.prestigio,
    turno,
  };
}

const alcanza = (valor: number, umbral: number | null): boolean =>
  umbral !== null && valor >= umbral;

/** Basta con una de las condiciones de la ronda. */
export function rondaCumplida(condicion: CondicionDeRonda, logros: LogrosDelJugador): boolean {
  return (
    alcanza(logros.comarcas, condicion.comarcas) ||
    alcanza(logros.vecinos, condicion.vecinos) ||
    (condicion.obraMayorTerminada && logros.obraMayorTerminada) ||
    alcanza(logros.prestigio, condicion.prestigio) ||
    alcanza(logros.turno, condicion.turno)
  );
}

/** Las rondas que se abren ahora: cumplidas y todavia cerradas, en el orden de las rondas. */
export function rondasPorAbrir(
  jugador: EstadoJugador,
  logros: LogrosDelJugador,
  reglas: TablasDeReglas,
): RondaDeTradicion[] {
  return RONDAS_DE_TRADICION.filter(
    (ronda) => jugador.rondas[ronda] === undefined && rondaCumplida(reglas.rondas[ronda], logros),
  );
}

/** Las cartas de una casa en una ronda: las activas, en orden de identificador. */
export function opcionesDeTradicion(
  casa: Casa,
  ronda: RondaDeTradicion,
  reglas: TablasDeReglas,
): Tradicion[] {
  return Object.entries(reglas.tradiciones)
    .filter(([, t]) => t.casa === casa && t.ronda === ronda && !t.desactivada)
    .map(([id]) => id)
    .sort(comparar);
}

/** La tradicion que el jugador eligio en una ronda, o null si aun no eligio. */
export function elegidaEn(
  jugador: EstadoJugador,
  ronda: RondaDeTradicion,
  reglas: TablasDeReglas,
): Tradicion | null {
  return jugador.tradiciones.find((id) => reglas.tradiciones[id]?.ronda === ronda) ?? null;
}

export const MOTIVOS_SIN_TRADICION = [
  'tradicion-desconocida',
  'tradicion-de-otra-casa',
  'tradicion-desactivada',
  'ronda-cerrada',
  'ronda-ya-elegida',
] as const;
export type MotivoSinTradicion = (typeof MOTIVOS_SIN_TRADICION)[number];

/** Por que el jugador no puede elegir esa tradicion ahora; null si puede. */
export function impedimentoDeTradicion(
  jugador: EstadoJugador,
  tradicion: Tradicion,
  reglas: TablasDeReglas,
): MotivoSinTradicion | null {
  const datos = reglas.tradiciones[tradicion];
  if (datos === undefined) return 'tradicion-desconocida';
  if (datos.casa !== jugador.casa) return 'tradicion-de-otra-casa';
  if (datos.desactivada) return 'tradicion-desactivada';
  if (jugador.rondas[datos.ronda] === undefined) return 'ronda-cerrada';
  if (elegidaEn(jugador, datos.ronda, reglas) !== null) return 'ronda-ya-elegida';
  return null;
}
