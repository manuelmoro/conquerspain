// Movimiento y riesgos de un rebanyo (docs/03-economia.md §3.8; ficha T-040 §4.4 y §4.6).
//
// Funciones puras: el paso, por donde puede ir, cuantas cabezas pierde y de que puertos hay que
// avisarle. La fase 4 las aplica.
import { permisosDelJugador } from './casas/index.ts';
import type { EstadoComarca, EstadoJugador, Rebanyo } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import type { Camino, Mundo } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { MIL, multiplicarFactores } from '../utiles/enteros.ts';
import { comparar } from '../utiles/orden.ts';
import type { EstadoEstacional } from './calendario.ts';
import type { Mejoras, OpcionesDeRuta } from './ruta.ts';
import { costeDeTramoMil, tramoEntre } from './ruta.ts';

/** Jornadas que anda un rebanyo este turno, en milesimas: despacio, y mas por una canyada. */
export function pasoDeRebanyo(
  primerTramoEsCanyada: boolean,
  barro: boolean,
  reglas: TablasDeReglas,
): Milesimas {
  const g = reglas.ganaderia;
  const m = reglas.movimiento;
  let paso = g.pasoBaseMil + (primerTramoEsCanyada ? g.pasoCanyadaMil : 0);
  if (barro) paso -= m.pasoBarroMil;
  return Math.max(m.pasoMinimoMil, paso);
}

/**
 * Un rebanyo entra en una comarca sin duenyo o propia por cualquier camino; en la de otro jugador,
 * solo por una canyada y solo si su casa tiene paso franco (la Mesta). Hasta que T-103 traiga
 * portazgos y acuerdos, esa es toda la regla de tierra ajena.
 */
export function puedeEntrar(
  camino: Camino,
  destino: EstadoComarca | undefined,
  jugador: EstadoJugador,
  reglas: TablasDeReglas,
): boolean {
  if (destino === undefined || destino.duenyo === null || destino.duenyo === jugador.id)
    return true;
  return camino.canyada !== null && permisosDelJugador(jugador, reglas).pasoFrancoPorCanyada;
}

/** Como elige camino un rebanyo: sin tierra ajena prohibida y prefiriendo las canyadas. */
export function opcionesDeRutaDeRebanyo(
  comarcas: Readonly<Record<string, EstadoComarca>>,
  jugador: EstadoJugador,
  reglas: TablasDeReglas,
): OpcionesDeRuta {
  return {
    permite: (camino, hacia) => puedeEntrar(camino, comarcas[hacia], jugador, reglas),
    pesoMil: (camino) => (camino.canyada === null ? MIL : reglas.ganaderia.costeCanyadaMil),
  };
}

/** Cabezas que pierde un rebanyo por turno sin pasto: un 5 %, y al menos una. */
export function cabezasPerdidasPorFaltaDePasto(cabezas: number, reglas: TablasDeReglas): number {
  if (cabezas <= 0) return 0;
  return Math.min(
    cabezas,
    Math.max(1, multiplicarFactores(cabezas, [reglas.ganaderia.perdidaPorSinPastoMil])),
  );
}

/** Los tramos que le quedan por recorrer a un rebanyo, en orden, empezando por el que anda. */
export function tramosPendientes(rebanyo: Rebanyo, mundo: Mundo): Camino[] {
  const tramos: Camino[] = [];
  let donde: IdComarca =
    rebanyo.situacion.donde === 'comarca' ? rebanyo.situacion.comarca : rebanyo.situacion.desde;
  for (const siguiente of rebanyo.ruta) {
    const tramo = tramoEntre(mundo, donde, siguiente);
    if (tramo !== undefined) tramos.push(tramo);
    donde = siguiente;
  }
  return tramos;
}

/**
 * Puertos que tiene por delante y que **cierran por primera vez** dentro de los turnos de aviso: el
 * turno en que se avisa es exactamente ese numero de turnos antes del cierre. Van por nombre y sin
 * repetir. `cierraEn` es el estado estacional del turno del cierre y `abiertoEn` el del anterior.
 */
export function puertosQueVanACerrar(
  rebanyo: Rebanyo,
  mundo: Mundo,
  cierraEn: EstadoEstacional,
  abiertoEn: EstadoEstacional,
  reglas: TablasDeReglas,
  mejoras: Mejoras,
): string[] {
  const nombres = new Set<string>();
  for (const camino of tramosPendientes(rebanyo, mundo)) {
    if (camino.puertoDeMontanya === null) continue;
    const cerrado = costeDeTramoMil(camino, cierraEn, reglas, mejoras) === 'cerrado';
    const yaCerrado = costeDeTramoMil(camino, abiertoEn, reglas, mejoras) === 'cerrado';
    if (cerrado && !yaCerrado) nombres.add(camino.puertoDeMontanya);
  }
  return [...nombres].sort(comparar);
}

/** Los rebanyos de un registro, en orden de identificador. */
export function rebanyosEnOrden(rebanyos: Readonly<Record<string, Rebanyo>>): Rebanyo[] {
  return Object.keys(rebanyos)
    .sort(comparar)
    .flatMap((id) => {
      const rebanyo = rebanyos[id];
      return rebanyo === undefined ? [] : [rebanyo];
    });
}
