// Los hitos y sus primicias (ficha T-043 §4.3 y §4.4).
//
// Funciones puras: que hitos logra un jugador con lo que tiene al final del turno y quien se lleva
// la primicia cuando varios llegan a la vez. Los umbrales estan en la tabla de hitos.
import type { EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type { IdJugador } from '../tipos/ids.ts';
import type { Hito, TablasDeReglas } from '../tipos/reglas.ts';
import { HITOS } from '../tipos/reglas.ts';
import { hash32 } from '../utiles/huella.ts';

/** Lo que miran los hitos y no esta en el estado: lo que paso este turno y el prestigio. */
export interface HechosDelTurno {
  /** La mejor calidad del anyo de los rebanyos del jugador que esquilaron este turno (0 si nada). */
  readonly mejorEsquileoMil: number;
  /** El prestigio del jugador medido al empezar la fase, sin los hitos de este turno. */
  readonly prestigio: number;
}

function cumple(
  hito: Hito,
  umbral: number,
  estado: EstadoPartida,
  jugador: EstadoJugador,
  hechos: HechosDelTurno,
): boolean {
  const propias = Object.values(estado.comarcas).filter((c) => c.duenyo === jugador.id);
  const capital = estado.comarcas[jugador.capital]?.poblacion ?? 0;
  const r = jugador.registro;
  switch (hito) {
    case 'primer-horizonte':
      return (
        Object.values(jugador.conocimiento).filter((c) => c.nivel === 'explorada').length >= umbral
      );
    case 'despensa-estable':
      return r.turnosDeDespensaEstable >= umbral;
    case 'villa':
    case 'ciudad':
      return capital >= umbral;
    case 'mas-alla-del-origen':
    case 'pequenyo-dominio':
      return propias.length >= umbral;
    case 'anyo-redondo':
      return hechos.mejorEsquileoMil >= umbral;
    case 'maestro-de-obra':
      return Object.values(r.obrasMayores).reduce((total, n) => total + n, 0) >= umbral;
    case 'camino-abierto':
      return (r.obrasMayores.calzada ?? 0) >= umbral;
    case 'buen-nombre':
      // Los contratos llegan con T-103; mientras, el hito esta desactivado en la tabla.
      return false;
    case 'senyor-de-ferias':
      return Object.values(r.volumenEnFerias).reduce((total, v) => total + v, 0) >= umbral;
    case 'casa-conocida':
      return hechos.prestigio >= umbral;
  }
}

/** Los hitos que el jugador logra ahora: cumplidos, activos y que no tenia. */
export function hitosNuevos(
  estado: EstadoPartida,
  jugador: EstadoJugador,
  hechos: HechosDelTurno,
  reglas: TablasDeReglas,
): Hito[] {
  return HITOS.filter((hito) => {
    const datos = reglas.hitos[hito];
    return (
      !datos.desactivado &&
      jugador.hitos[hito] === undefined &&
      cumple(hito, datos.umbral, estado, jugador, hechos)
    );
  });
}

export interface AspiranteAPrimicia {
  readonly jugador: IdJugador;
  /** Prestigio al empezar la fase: el merito que desempata. */
  readonly prestigio: number;
}

/**
 * Quien se lleva la primicia de un hito que varios logran el mismo turno: el de mas prestigio y,
 * si empatan, el de menor `hash(partida, turno, primicia:hito, jugador)`. Nunca el que llego antes.
 */
export function ganadorDePrimicia(
  aspirantes: readonly AspiranteAPrimicia[],
  hito: Hito,
  semilla: string,
  turno: number,
): IdJugador | null {
  const desempate = (jugador: IdJugador): number =>
    hash32(`${semilla}|${String(turno)}|primicia:${hito}|${jugador}`);
  const ordenados = [...aspirantes].sort(
    (a, b) => b.prestigio - a.prestigio || desempate(a.jugador) - desempate(b.jugador),
  );
  return ordenados[0]?.jugador ?? null;
}
