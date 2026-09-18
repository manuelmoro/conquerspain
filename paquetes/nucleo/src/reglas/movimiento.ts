// Paso y avance de una recua por su ruta (docs/03-economia.md §3.7.1; ficha T-033 §4.3).
//
// Todo es puro: dada la situacion, la ruta y el paso, dice donde acaba la recua y cuanto anda.
// La fase cobra el bastimento de lo andado y aplica el resultado.
import type { CosteDeTramoMil } from './jornadas.ts';
import type { Recua, SituacionMovil } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import type { Recurso } from '../tipos/recursos.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { MIL } from '../utiles/enteros.ts';

/** Lo que pesa la carga: todo menos los maravedis, que no ocupan porte. */
export function pesoDeLaCarga(carga: Readonly<Record<Recurso, number>>): number {
  return RECURSOS.filter((r) => r !== 'maravedis').reduce((total, r) => total + carga[r], 0);
}

/** Porte de una recua: cargas por acemila mas lo que anyada la casa. */
export function porteDe(acemilas: number, porteExtra: number, reglas: TablasDeReglas): number {
  return Math.max(0, acemilas * reglas.movimiento.portePorAcemila + porteExtra);
}

export interface CondicionesDePaso {
  readonly barro: boolean;
  /** El primer tramo que anda este turno tiene calzada. */
  readonly calzada: boolean;
  /** Jornadas que suma la casa, en milesimas. */
  readonly pasoCasaMil: Milesimas;
}

/** Jornadas que anda la recua este turno, en milesimas; nunca menos del minimo. */
export function pasoDeRecua(
  recua: Recua,
  condiciones: CondicionesDePaso,
  reglas: TablasDeReglas,
): Milesimas {
  const m = reglas.movimiento;
  let paso = m.pasoBaseMil + condiciones.pasoCasaMil;
  if (recua.porte > 0 && pesoDeLaCarga(recua.carga) * MIL >= recua.porte * m.cargaPesadaMil) {
    paso -= m.pasoCargadaMil;
  }
  if (condiciones.barro) paso -= m.pasoBarroMil;
  if (condiciones.calzada) paso += m.pasoCalzadaMil;
  return Math.max(m.pasoMinimoMil, paso);
}

export interface Avance {
  readonly situacion: SituacionMovil;
  readonly ruta: readonly IdComarca[];
  /** Jornadas andadas de verdad, en milesimas: sobre esto se paga el bastimento. */
  readonly andadoMil: Milesimas;
  /** Comarcas en las que ha entrado, en orden. */
  readonly entradas: readonly IdComarca[];
  /** Tramo cerrado ante el que se ha parado, si lo hay. */
  readonly cerrado: { readonly desde: IdComarca; readonly hasta: IdComarca } | null;
  /** Estaba en un tramo que se ha cerrado y ha vuelto a la comarca de la que salio. */
  readonly retrocede: boolean;
}

/**
 * Avanza por la ruta con el paso dado. El primer elemento de la ruta es siempre la siguiente
 * comarca en la que entrar; si la recua esta en un tramo, es la del final del tramo. Con ruta
 * circular, cada comarca en la que entra vuelve al final de la lista y la recua no para nunca.
 */
export function avanzar(
  situacion: SituacionMovil,
  ruta: readonly IdComarca[],
  circular: boolean,
  pasoMil: Milesimas,
  costeDe: (desde: IdComarca, hasta: IdComarca) => CosteDeTramoMil,
): Avance {
  const pendiente = [...ruta];
  const entradas: IdComarca[] = [];
  let donde: IdComarca = situacion.donde === 'comarca' ? situacion.comarca : situacion.desde;
  let hechoMil = situacion.donde === 'camino' ? situacion.jornadasHechasMil : 0;
  let quedaMil = pasoMil;

  const siguiente = pendiente[0];
  if (situacion.donde === 'camino' && siguiente !== undefined) {
    if (costeDe(donde, siguiente) === 'cerrado') {
      // La nieve la pilla a medio puerto: da la vuelta y espera en la comarca de salida.
      return {
        situacion: { donde: 'comarca', comarca: donde },
        ruta: pendiente,
        andadoMil: 0,
        entradas: [],
        cerrado: { desde: donde, hasta: siguiente },
        retrocede: true,
      };
    }
  }

  for (;;) {
    const proxima = pendiente[0];
    if (proxima === undefined || quedaMil <= 0) break;
    const coste = costeDe(donde, proxima);
    if (coste === 'cerrado') {
      return {
        situacion: { donde: 'comarca', comarca: donde },
        ruta: pendiente,
        andadoMil: pasoMil - quedaMil,
        entradas,
        cerrado: { desde: donde, hasta: proxima },
        retrocede: false,
      };
    }
    const faltaMil = Math.max(0, coste - hechoMil);
    if (quedaMil < faltaMil) {
      return {
        situacion: {
          donde: 'camino',
          desde: donde,
          hasta: proxima,
          jornadasHechasMil: hechoMil + quedaMil,
        },
        ruta: pendiente,
        andadoMil: pasoMil,
        entradas,
        cerrado: null,
        retrocede: false,
      };
    }
    quedaMil -= faltaMil;
    hechoMil = 0;
    pendiente.shift();
    if (circular) pendiente.push(proxima);
    entradas.push(proxima);
    donde = proxima;
  }

  return {
    situacion: { donde: 'comarca', comarca: donde },
    ruta: pendiente,
    andadoMil: pasoMil - quedaMil,
    entradas,
    cerrado: null,
    retrocede: false,
  };
}
