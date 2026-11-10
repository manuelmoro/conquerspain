// Portazgos (ficha T-103 §5): quien mejoro un tramo con puente o calzada cobra a las recuas y
// rebanyos ajenos que entran en el. Quien no puede pagar va por el camino viejo: el mismo tramo sin
// la mejora, con sus jornadas de antes, y no paga nada. Asi siempre hay alternativa.
//
// Funciones puras: dicen cuanto se cobra en un tramo, por donde va quien no llega y que tramos se
// empezaron en un avance. Quien cobra y en que orden es cosa de las fases de movimiento.
import type { EstadoJugador, EstadoPartida, EstadoTramo, SituacionMovil } from '../tipos/estado.ts';
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { permisosDelJugador, prohibicionesDelJugador } from './casas/index.ts';
import type { Avance } from './movimiento.ts';
import { claveDeTramo } from './ruta.ts';

/** Puede cobrar portazgo: su casa tiene el permiso y nada se lo prohibe. */
export function puedeCobrarPortazgo(
  estado: EstadoPartida,
  jugador: IdJugador,
  reglas: TablasDeReglas,
): boolean {
  const datos = estado.jugadores[jugador];
  if (datos === undefined) return false;
  return (
    permisosDelJugador(datos, reglas).cobrarPortazgo &&
    !prohibicionesDelJugador(datos, reglas).cobrarPortazgo
  );
}

/** Lo que se cobra en un tramo, y a quien. */
export interface Peaje {
  readonly clave: string;
  readonly desde: IdComarca;
  readonly hasta: IdComarca;
  readonly duenyo: IdJugador;
  readonly cantidad: number;
}

/**
 * El peaje que paga un jugador al entrar en un tramo, o null si no paga: el tramo no tiene
 * portazgo, es suyo, su dueno ya no puede cobrar o su casa no paga portazgo ajeno (los arrieros).
 */
export function peajeDe(
  estado: EstadoPartida,
  desde: IdComarca,
  hasta: IdComarca,
  jugador: EstadoJugador,
  reglas: TablasDeReglas,
): Peaje | null {
  const clave = claveDeTramo(desde, hasta);
  const tramo = estado.caminos[clave];
  const duenyo = tramo?.duenyo;
  const cantidad = tramo?.portazgo ?? 0;
  if (duenyo === undefined || cantidad <= 0 || duenyo === jugador.id) return null;
  if (permisosDelJugador(jugador, reglas).cobrarPortazgo) return null;
  if (!puedeCobrarPortazgo(estado, duenyo, reglas)) return null;
  return { clave, desde, hasta, duenyo, cantidad };
}

/**
 * Las mejoras con las que anda quien viaja con `presupuesto` maravedis: los tramos de peaje que
 * paga, en el orden de su ruta, siguen mejorados; los que ya no le llegan quedan sin la mejora (el
 * camino viejo). El tramo en el que ya esta se pago al entrar.
 */
export function mejorasDelViaje(
  estado: EstadoPartida,
  situacion: SituacionMovil,
  ruta: readonly IdComarca[],
  jugador: EstadoJugador,
  presupuesto: number,
  reglas: TablasDeReglas,
): Readonly<Record<string, EstadoTramo>> {
  let donde = situacion.donde === 'comarca' ? situacion.comarca : situacion.desde;
  let queda = presupuesto;
  const sinMejora = new Set<string>();
  for (const [i, hasta] of ruta.entries()) {
    const yaPagado = i === 0 && situacion.donde === 'camino';
    const peaje = yaPagado ? null : peajeDe(estado, donde, hasta, jugador, reglas);
    if (peaje !== null) {
      if (peaje.cantidad <= queda) {
        queda -= peaje.cantidad;
      } else {
        sinMejora.add(peaje.clave);
      }
    }
    donde = hasta;
  }
  if (sinMejora.size === 0) return estado.caminos;
  // Sin la entrada, el tramo es el del mundo: sin puente y con su calidad de siempre.
  return Object.fromEntries(
    Object.entries(estado.caminos).filter(([clave]) => !sinMejora.has(clave)),
  );
}

/**
 * Los tramos en los que entro en este avance, en orden: los que tiene que pagar. El tramo en el
 * que ya estaba al empezar se pago cuando entro en el.
 */
export function tramosEmpezados(
  situacion: SituacionMovil,
  avance: Avance,
): readonly (readonly [IdComarca, IdComarca])[] {
  if (avance.retrocede) return [];
  const puntos: IdComarca[] = [
    situacion.donde === 'comarca' ? situacion.comarca : situacion.desde,
    ...avance.entradas,
  ];
  const final = avance.situacion;
  if (final.donde === 'camino' && final.hasta !== puntos.at(-1)) puntos.push(final.hasta);
  const tramos: (readonly [IdComarca, IdComarca])[] = [];
  for (let i = 1; i < puntos.length; i++) {
    const desde = puntos[i - 1];
    const hasta = puntos[i];
    if (desde === undefined || hasta === undefined) continue;
    if (i === 1 && situacion.donde === 'camino') continue;
    tramos.push([desde, hasta]);
  }
  return tramos;
}
