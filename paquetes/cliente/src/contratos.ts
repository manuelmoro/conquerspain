// «Tus contratos» (ficha T-103): lo que dice cada contrato en castellano, las intenciones para
// proponer, responder y fijar portazgos, y los tramos en los que la casa puede cobrar.
import {
  MOTIVOS,
  OBRAS_MAYORES_DE_TRAMO,
  RECURSOS_DE_MERCADO,
  TABLAS_DEL_JUEGO,
  TIPOS_DE_OBRA_MAYOR,
} from '@conquer/nucleo';
import type {
  Contrato,
  EstadoDeContrato,
  Recurso,
  TipoDeContrato,
  TipoObraMayor,
  VistaJugador,
} from '@conquer/nucleo';

import { NOMBRE_DE_RECURSO } from './nombres.ts';

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

const ARTICULO: Readonly<Record<TipoObraMayor, 'un' | 'una'>> = {
  puente: 'un',
  calzada: 'una',
  monasterio: 'un',
  catedral: 'una',
  muralla: 'una',
  atarazana: 'una',
  'acequia-mayor': 'una',
};

/** Lo que dice el contrato, contado desde quien lo lee: «tú» si es su parte, el nombre si no. */
export function frasesDeContrato(contrato: Contrato, yo: string, n: NombresDeContrato): string {
  const sujeto = (id: string, tu: string, otro: string): string =>
    id === yo ? `Tú ${tu}` : `${n.jugador(id)} ${otro}`;
  const a = (id: string): string => (id === yo ? 'a ti' : `a ${n.jugador(id)}`);
  const de = (id: string): string => (id === yo ? 'tu casa' : n.jugador(id));
  const pasiva = (activa: string): string =>
    activa === contrato.propone ? contrato.recibe : contrato.propone;
  const mrs = (cantidad: number): string => `${String(cantidad)} maravedís`;
  switch (contrato.tipo) {
    case 'entrega': {
      const paga = pasiva(contrato.entrega);
      const recurso = NOMBRE_DE_RECURSO[contrato.recurso].toLowerCase();
      return `${sujeto(contrato.entrega, 'entregas', 'entrega')} ${String(contrato.cantidad)} de ${recurso} en ${n.comarca(contrato.comarca)} ${a(paga)}, que ${paga === yo ? 'pagas' : 'paga'} ${mrs(contrato.precio)} al recibirla.`;
    }
    case 'prestamo': {
      const pide = pasiva(contrato.presta);
      return `${sujeto(contrato.presta, 'prestas', 'presta')} ${mrs(contrato.cantidad)} ${a(pide)}, que ${pide === yo ? 'devuelves' : 'devuelve'} ${mrs(contrato.devolver)} al plazo.`;
    }
    case 'aperos': {
      const niveles = `${String(contrato.niveles)} ${contrato.niveles === 1 ? 'nivel' : 'niveles'}`;
      return `${sujeto(contrato.vende, 'instalas', 'instala')} ${niveles} de aperos en ${n.comarca(contrato.comarca)}, por ${mrs(contrato.precio)}.`;
    }
    case 'obra': {
      const obra = TABLAS_DEL_JUEGO.obrasMayores[contrato.obra].nombre.toLowerCase();
      const tramo = contrato.hacia === null ? '' : ` hacia ${n.comarca(contrato.hacia)}`;
      return `${sujeto(contrato.construye, 'levantas', 'levanta')} ${ARTICULO[contrato.obra]} ${obra} en ${n.comarca(contrato.comarca)}${tramo}, poniendo el material, por ${mrs(contrato.precio)}.`;
    }
    case 'paso': {
      const pasa = pasiva(contrato.concede);
      const tierras = contrato.concede === yo ? 'tus tierras' : 'sus tierras';
      return `${sujeto(contrato.concede, 'dejas', 'deja')} pasar los rebaños de ${de(pasa)} por ${tierras}, por cualquier camino, por ${mrs(contrato.precio)}.`;
    }
  }
}

/** Plazo y penalizacion, dichos como se leen. */
export function plazoDeContrato(contrato: Contrato, turno: number): string {
  const quedan = contrato.plazo - turno;
  const plazo =
    quedan <= 0
      ? 'vence este turno'
      : `vence en ${String(quedan)} ${quedan === 1 ? 'turno' : 'turnos'}`;
  return contrato.penalizacion > 0
    ? `${plazo}; quien falle paga ${String(contrato.penalizacion)} maravedís`
    : plazo;
}

/** Por que acabo un contrato cerrado, y quien fallo si alguien fallo. */
export function cierreDeContrato(
  contrato: Contrato,
  yo: string,
  jugador: (id: string) => string,
): string {
  const motivo = contrato.motivo === null ? '' : (MOTIVOS[contrato.motivo] ?? contrato.motivo);
  const fallo =
    contrato.fallo === null
      ? ''
      : ` Falló ${contrato.fallo === yo ? 'tu casa' : jugador(contrato.fallo)}.`;
  const porque = motivo === '' ? '' : `${motivo.charAt(0).toUpperCase()}${motivo.slice(1)}.`;
  return `${porque}${fallo}`.trim();
}

/** Los contratos que esperan mi respuesta, primero; despues el resto, del mas nuevo al mas viejo. */
export function contratosEnOrden(vista: VistaJugador): readonly Contrato[] {
  const yo = vista.jugador.id;
  const espera = (c: Contrato): number => (c.estado === 'propuesto' && c.recibe === yo ? 0 : 1);
  return [...vista.contratos].sort(
    (a, b) => espera(a) - espera(b) || b.propuestoEn - a.propuestoEn || (a.id < b.id ? -1 : 1),
  );
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

/** Lo que se rellena para proponer un contrato; todo en texto, como sale de los campos. */
export interface FormularioDeContrato {
  readonly tipo: TipoDeContrato;
  readonly con: string;
  /** Quien hace la parte activa (entrega, presta, instala, levanta o deja pasar). */
  readonly activa: 'yo' | 'ella';
  readonly recurso: string;
  readonly cantidad: string;
  readonly comarca: string;
  readonly hacia: string;
  readonly obra: string;
  readonly niveles: string;
  readonly precio: string;
  readonly devolver: string;
  /** Turnos desde ahora hasta el plazo. */
  readonly turnos: string;
  readonly penalizacion: string;
}

/** Lo que pregunta el formulario por la parte activa de cada tipo. */
export const QUIEN_HACE: Readonly<Record<TipoDeContrato, string>> = {
  entrega: 'Quién entrega',
  prestamo: 'Quién presta',
  aperos: 'Quién instala los aperos (un ferrón)',
  obra: 'Quién levanta la obra (un cantero)',
  paso: 'Quién deja pasar por sus tierras',
};

/** Los campos de cada tipo, en orden. */
export const CAMPOS_DE_CONTRATO: Readonly<
  Record<TipoDeContrato, readonly (keyof FormularioDeContrato)[]>
> = {
  entrega: ['recurso', 'cantidad', 'comarca', 'precio'],
  prestamo: ['cantidad', 'devolver'],
  aperos: ['comarca', 'niveles', 'precio'],
  obra: ['obra', 'comarca', 'hacia', 'precio'],
  paso: ['precio'],
};

function entero(texto: string, minimo: number): number | null {
  const n = Number(texto);
  return texto.trim() !== '' && Number.isInteger(n) && n >= minimo ? n : null;
}

function recursoDe(texto: string): Recurso | null {
  return RECURSOS_DE_MERCADO.find((r) => r === texto) ?? null;
}

function obraDe(texto: string): TipoObraMayor | null {
  return TIPOS_DE_OBRA_MAYOR.find((t) => t === texto) ?? null;
}

/** Las condiciones de cada tipo, o null si falta algo (el servidor las valida igual). */
function condicionesDe(
  f: FormularioDeContrato,
  activa: 'propone' | 'recibe',
  precio: number,
): Readonly<Record<string, unknown>> | null {
  switch (f.tipo) {
    case 'entrega': {
      const recurso = recursoDe(f.recurso);
      const cantidad = entero(f.cantidad, 1);
      if (recurso === null || cantidad === null || f.comarca === '') return null;
      return { tipo: 'entrega', activa, recurso, cantidad, comarca: f.comarca, precio };
    }
    case 'prestamo': {
      const cantidad = entero(f.cantidad, 1);
      const devolver = entero(f.devolver, 0);
      if (cantidad === null || devolver === null) return null;
      return { tipo: 'prestamo', activa, cantidad, devolver };
    }
    case 'aperos': {
      const niveles = entero(f.niveles, 1);
      if (niveles === null || f.comarca === '') return null;
      return { tipo: 'aperos', activa, comarca: f.comarca, niveles, precio };
    }
    case 'obra': {
      const obra = obraDe(f.obra);
      if (obra === null || f.comarca === '') return null;
      const deTramo = OBRAS_MAYORES_DE_TRAMO.includes(obra);
      if (deTramo && f.hacia === '') return null;
      return {
        tipo: 'obra',
        activa,
        comarca: f.comarca,
        obra,
        hacia: deTramo ? f.hacia : null,
        precio,
      };
    }
    case 'paso':
      return { tipo: 'paso', activa, precio };
  }
}

/** La intencion de proponer, o null si falta algo. */
export function intencionDeContrato(
  f: FormularioDeContrato,
  turno: number,
): Readonly<Record<string, unknown>> | null {
  const turnos = entero(f.turnos, 1);
  const penalizacion = entero(f.penalizacion === '' ? '0' : f.penalizacion, 0);
  const precio = entero(f.precio === '' ? '0' : f.precio, 0);
  if (f.con === '' || turnos === null || penalizacion === null || precio === null) return null;
  const condiciones = condicionesDe(f, f.activa === 'yo' ? 'propone' : 'recibe', precio);
  return condiciones === null
    ? null
    : { tipo: 'contrato', con: f.con, plazo: turno + turnos, penalizacion, condiciones };
}

/**
 * Si otra casa falta o esta amparada, en pocas palabras y con un guion delante; vacio si esta y no
 * tiene amparo (T-105). Es publico: nadie pierde el tiempo con quien no esta.
 */
export function estadoDeCasa(
  casa: { readonly turnosSinOrdenes: number; readonly amparoHasta: number | null },
  turno: number,
): string {
  const t = TABLAS_DEL_JUEGO.ausencia;
  const partes: string[] = [];
  if (casa.turnosSinOrdenes >= t.turnosParaConcejo)
    partes.push('la administra el concejo: sus comarcas, salvo la capital, se pueden cortejar');
  else if (casa.turnosSinOrdenes >= t.turnosParaAusente)
    partes.push(`ausente desde hace ${String(casa.turnosSinOrdenes)} turnos`);
  if (casa.amparoHasta !== null && casa.amparoHasta >= turno)
    partes.push(`amparada hasta el turno ${String(casa.amparoHasta)}: ni portazgo ni cortejo`);
  return partes.length === 0 ? '' : ` — ${partes.join('; ')}`;
}
