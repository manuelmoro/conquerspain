// Coste en jornadas de cruzar un tramo (docs/03-economia.md §3.7.2).
//
// Es funcion pura: mismo tramo, misma estacion, misma calidad y mismas tablas, mismo numero.
// El movimiento (T-033) la usa para gastar jornadas; el cliente, para ensenyar la prevision.
import type { Camino } from '../tipos/mundo.ts';
import type { CalidadCamino, Estacion, TablasDeReglas } from '../tipos/reglas.ts';
import { MIL, aEntero, aMilesimas, multiplicarFactores } from '../utiles/enteros.ts';

/** Un puerto de montanya cuesta lo mismo sea cual sea el terreno de las comarcas que une. */
export const JORNADAS_DE_PUERTO = 7;

export interface OpcionesDeTramo {
  /**
   * El vado tiene puente (obra de T-035) y deja de costar jornadas de mas. Una calzada romana
   * o un tramo con calidad de calzada llevan puente por definicion.
   */
  readonly puente?: boolean;
  /**
   * El turno es de barro (`estaciones.turnosDeBarro`). Depende del turno, no de la estacion,
   * asi que lo decide quien llama: el resolutor lo sabe, esta funcion no.
   */
  readonly barro?: boolean;
  /** Unas nieves tempranas han cerrado ya el puerto de este tramo (ficha T-039). */
  readonly nieveTemprana?: boolean;
  /** Una riada tiene cortado el vado de este tramo, salvo que lleve puente (ficha T-039). */
  readonly crecida?: boolean;
}

/** Lo que cuesta cruzar un tramo, o `cerrado` si el puerto esta cerrado por nieve. */
export type CosteDeTramo = number | 'cerrado';

function llevaPuente(camino: Camino, calidad: CalidadCamino, opciones: OpcionesDeTramo): boolean {
  return opciones.puente === true || camino.calzadaRomana || calidad === 'calzada';
}

/** Lo que cuesta cruzar un tramo en milesimas de jornada, o `cerrado`. */
export type CosteDeTramoMil = number | 'cerrado';

/**
 * Jornadas que cuesta cruzar un tramo, en milesimas y sin truncar:
 * `base × factor de camino × factores de estacion`, mas el vado, con un minimo de una jornada.
 * Es lo que gasta una recua al andar (T-033).
 *
 * Un puerto de montanya en invierno es **intransitable** salvo que el tramo tenga calzada; esa es
 * la regla que hace existir la trashumancia y que convierte una obra en una decision (docs/03
 * §3.7.2).
 */
export function jornadasDeTramoMil(
  camino: Camino,
  estacion: Estacion,
  calidad: CalidadCamino,
  reglas: TablasDeReglas,
  opciones: OpcionesDeTramo = {},
): CosteDeTramoMil {
  const movimiento = reglas.movimiento;
  const esPuerto = camino.puertoDeMontanya !== null;
  const hayCalzada = camino.calzadaRomana || calidad === 'calzada';

  const nieva = estacion === 'invierno' || opciones.nieveTemprana === true;
  if (camino.cierraEnInvierno && nieva && !hayCalzada) return 'cerrado';
  if (opciones.crecida === true && camino.vado && !llevaPuente(camino, calidad, opciones)) {
    return 'cerrado';
  }

  const base = esPuerto
    ? JORNADAS_DE_PUERTO
    : (movimiento.jornadasPorTerreno[camino.terreno] ??
      movimiento.jornadasPorTerreno['llano'] ??
      2);

  const factores: number[] = [movimiento.factorCaminoMil[calidad]];
  if (estacion === 'invierno' && (esPuerto || camino.terreno === 'sierra')) {
    factores.push(movimiento.factorNieveMil);
  }
  if (estacion === 'verano') factores.push(movimiento.factorVeranoMil);
  if (opciones.barro === true) factores.push(movimiento.factorBarroMil);

  const jornadasMil = multiplicarFactores(aMilesimas(base), factores);
  const vado =
    camino.vado && !llevaPuente(camino, calidad, opciones) ? movimiento.jornadasDeVado : 0;
  return Math.max(MIL, jornadasMil + vado * MIL);
}

/** Lo mismo en jornadas enteras, truncadas: es la cifra que se ensenya en el mapa. */
export function jornadasDeTramo(
  camino: Camino,
  estacion: Estacion,
  calidad: CalidadCamino,
  reglas: TablasDeReglas,
  opciones: OpcionesDeTramo = {},
): CosteDeTramo {
  const mil = jornadasDeTramoMil(camino, estacion, calidad, reglas, opciones);
  return mil === 'cerrado' ? mil : aEntero(mil);
}
