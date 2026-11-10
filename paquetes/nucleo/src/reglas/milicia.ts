// Milicia y hostilidad (docs/06 §6.6; ficha T-120). Funciones puras: la hostilidad entre dos casas,
// lo que cuesta una mesnada y la fuerza con que se enfrenta. La fase 4 las aplica.
import type { EstadoPartida, Mesnada } from '../tipos/estado.ts';
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { MIL, multiplicarFactores } from '../utiles/enteros.ts';
import { comparar } from '../utiles/orden.ts';

/** La clave de la hostilidad entre dos casas: la misma la declare quien la declare. */
export function claveDeHostilidad(una: string, otra: string): string {
  return comparar(una, otra) <= 0 ? `${una}|${otra}` : `${otra}|${una}`;
}

/** Hay hostilidad vigente entre las dos casas este turno. */
export function sonHostiles(
  estado: EstadoPartida,
  una: IdJugador,
  otra: IdJugador,
  turno: number,
): boolean {
  const h = estado.hostilidades?.[claveDeHostilidad(una, otra)];
  return h !== undefined && turno >= h.vigenteDesde;
}

/** Lo que cuesta una mesnada este turno: pan y soldada, con el recargo de estar lejos. */
export function costeDeMesnada(
  mesnada: Mesnada,
  reglas: TablasDeReglas,
): { readonly pan: number; readonly maravedis: number } {
  const t = reglas.milicia;
  const decenas = Math.ceil(mesnada.hombres / 10);
  const recargo = Math.min(
    t.recargoLejosMaximoMil,
    MIL + mesnada.turnosFuera * t.recargoLejosPorTurnoMil,
  );
  return {
    pan: decenas * t.panPorCadaDiezHombres,
    maravedis: multiplicarFactores(decenas * t.soldadaPorCadaDiezHombres, [recargo]),
  };
}

/**
 * La fuerza de una mesnada en una comarca: sus hombres, mas si defiende su propia tierra y mas aun
 * si esa comarca tiene muralla. Sin azar (T-120 §6).
 */
export function fuerzaDe(
  mesnada: Mesnada,
  comarca: IdComarca,
  estado: EstadoPartida,
  reglas: TablasDeReglas,
): number {
  const t = reglas.milicia;
  const tierra = estado.comarcas[comarca];
  const defiende = tierra !== undefined && tierra.duenyo === mesnada.jugador;
  const muralla = defiende && tierra.obrasMayores.includes('muralla');
  return multiplicarFactores(mesnada.hombres * MIL, [
    defiende ? t.ventajaEnCasaMil : MIL,
    muralla ? t.ventajaMurallaMil : MIL,
  ]);
}

/** Puede entrar en esa comarca: propia, de nadie, o de una casa con hostilidad vigente y sin amparo. */
export function puedeEntrarLaMesnada(
  estado: EstadoPartida,
  jugador: IdJugador,
  comarca: IdComarca,
  turno: number,
): boolean {
  const duenyo = estado.comarcas[comarca]?.duenyo;
  if (duenyo === undefined) return false;
  if (duenyo === null || duenyo === jugador) return true;
  const otra = estado.jugadores[duenyo];
  const amparada = otra?.amparoHasta !== undefined && turno <= otra.amparoHasta;
  return !amparada && sonHostiles(estado, jugador, duenyo, turno);
}
