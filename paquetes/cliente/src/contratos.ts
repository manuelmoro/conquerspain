// «Tus contratos» (ficha T-103): lo que dice cada contrato en castellano, las intenciones para
// proponer, responder y fijar portazgos, y los tramos en los que la casa puede cobrar.
import { TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type {
  CondicionesDeContrato,
  Contrato,
  EstadoDeContrato,
  TipoDeContrato,
  VistaJugador,
} from '@conquer/nucleo';

import { NOMBRE_DE_OBRA, NOMBRE_DE_RECURSO } from './nombres.ts';

export interface NombresDeContrato {
  readonly comarca: (id: string) => string;
  readonly jugador: (id: string) => string;
}

export const NOMBRE_DE_CONTRATO: Readonly<Record<TipoDeContrato, string>> = {
  entrega: 'Entrega de mercancía',
  prestamo: 'Préstamo',
  aperos: 'Aperos instalados',
  obra: 'Obra por encargo',
  paso: 'Paso de ganado',
};

export const ESTADO_DE_CONTRATO: Readonly<Record<EstadoDeContrato, string>> = {
  propuesto: 'Propuesto',
  vigente: 'Firmado',
  cumplido: 'Cumplido',
  incumplido: 'Incumplido',
  rechazado: 'No firmado',
  caducado: 'Caducado',
};

/** Lo que dice el contrato, contado desde quien lo lee. */
export function frasesDeContrato(contrato: Contrato, yo: string, n: NombresDeContrato): string {
  const quien = (id: string): string => (id === yo ? 'Tú' : n.jugador(id));
  const a = (id: string): string => (id === yo ? 'a ti' : `a ${n.jugador(id)}`);
  const otra = contrato.propone === yo ? contrato.recibe : contrato.propone;
  switch (contrato.tipo) {
    case 'entrega': {
      const paga = contrato.entrega === contrato.propone ? contrato.recibe : contrato.propone;
      return `${quien(contrato.entrega)} entrega ${String(contrato.cantidad)} de ${NOMBRE_DE_RECURSO[contrato.recurso].toLowerCase()} en ${n.comarca(contrato.comarca)}, y ${quien(paga).toLowerCase() === 'tú' ? 'tú pagas' : `${n.jugador(paga)} paga`} ${String(contrato.precio)} maravedís al recibirla.`;
    }
    case 'prestamo': {
      const pide = contrato.presta === contrato.propone ? contrato.recibe : contrato.propone;
      return `${quien(contrato.presta)} presta ${String(contrato.cantidad)} maravedís ${a(pide)}, que devuelve ${String(contrato.devolver)} al plazo.`;
    }
    case 'aperos':
      return `${quien(contrato.vende)} instala ${String(contrato.niveles)} ${contrato.niveles === 1 ? 'nivel' : 'niveles'} de aperos en ${n.comarca(contrato.comarca)} por ${String(contrato.precio)} maravedís.`;
    case 'obra': {
      const tramo = contrato.hacia === null ? '' : ` hacia ${n.comarca(contrato.hacia)}`;
      return `${quien(contrato.construye)} levanta ${NOMBRE_DE_OBRA[contrato.obra] ?? contrato.obra} en ${n.comarca(contrato.comarca)}${tramo}, poniendo el material, por ${String(contrato.precio)} maravedís.`;
    }
    case 'paso':
      return `${quien(contrato.concede)} deja pasar los rebaños de ${contrato.concede === yo ? n.jugador(otra) : 'tu casa'} por sus tierras, por cualquier camino, por ${String(contrato.precio)} maravedís.`;
  }
}

/** Plazo y penalizacion, dichos como se leen. */
export function plazoDeContrato(contrato: Contrato, turno: number): string {
  const quedan = contrato.plazo - turno;
  const plazo =
    quedan <= 0 ? 'vence este turno' : `vence en ${String(quedan)} ${quedan === 1 ? 'turno' : 'turnos'}`;
  return contrato.penalizacion > 0
    ? `${plazo}; quien falle paga ${String(contrato.penalizacion)} maravedís`
    : plazo;
}

/** Los contratos que esperan mi respuesta, primero; despues el resto, del mas nuevo al mas viejo. */
export function contratosEnOrden(vista: VistaJugador): readonly Contrato[] {
  const yo = vista.jugador.id;
  const espera = (c: Contrato): number => (c.estado === 'propuesto' && c.recibe === yo ? 0 : 1);
  return [...vista.contratos].sort(
    (a, b) => espera(a) - espera(b) || b.propuestoEn - a.propuestoEn || (a.id < b.id ? -1 : 1),
  );
}

export function proponerContrato(
  con: string,
  plazo: number,
  penalizacion: number,
  condiciones: CondicionesDeContrato,
): Readonly<Record<string, unknown>> {
  return { tipo: 'contrato', con, plazo, penalizacion, condiciones };
}

export function responderContrato(
  contrato: string,
  acepta: boolean,
): Readonly<Record<string, unknown>> {
  return { tipo: 'responder-contrato', contrato, acepta };
}

export function fijarPortazgo(
  desde: string,
  hasta: string,
  cantidad: number,
): Readonly<Record<string, unknown>> {
  return { tipo: 'portazgo', desde, hasta, cantidad };
}

export interface TramoDePeaje {
  readonly desde: string;
  readonly hasta: string;
  readonly portazgo: number;
}

/** Los tramos que la casa mejoro y en los que cobra (o puede cobrar) portazgo. */
export function tramosPropios(vista: VistaJugador): readonly TramoDePeaje[] {
  const yo = vista.jugador.id;
  return Object.entries(vista.caminos).flatMap(([clave, tramo]) => {
    const [desde, hasta] = clave.split('|');
    if (tramo.duenyo !== yo || desde === undefined || hasta === undefined) return [];
    return [{ desde, hasta, portazgo: tramo.portazgo ?? 0 }];
  });
}

/** El portazgo mas alto que se puede fijar. */
export const PORTAZGO_MAXIMO = TABLAS_DEL_JUEGO.contratos.portazgoMaximo;

/** Lo que el credito dice de una casa, para la clasificacion y las propuestas. */
export function famaDeCredito(credito: number): string {
  if (credito < TABLAS_DEL_JUEGO.contratos.creditoBajo)
    return 'mal pagador: paga por adelantado y no le prestan';
  if (credito >= TABLAS_DEL_JUEGO.hitos['buen-nombre'].umbral) return 'buen nombre';
  return 'cumplidor';
}
