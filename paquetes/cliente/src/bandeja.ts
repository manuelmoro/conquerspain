// La bandeja (ficha T-082 §4.4): lo reservado, lo disponible y lo producido, bien separados; las
// colas que se pueden reordenar; y cuanto queda para el corte. Puro, para probarlo sin DOM.
import { RECURSOS, recursosSegun } from '@conquer/nucleo';
import type { Orden, Recursos, VistaJugador } from '@conquer/nucleo';

export interface ResumenDeRecursos {
  /** Lo que hay en el almacen menos lo que ya esta reservado. */
  readonly disponible: Recursos;
  /** Lo que tienen apartado las ordenes en marcha. */
  readonly reservado: Recursos;
  /** Lo que produjeron tus comarcas en el ultimo turno resuelto. */
  readonly producido: Recursos;
}

export function resumenDeRecursos(vista: VistaJugador): ResumenDeRecursos {
  const { almacen, reservado } = vista.jugador;
  const propias = Object.values(vista.comarcas).flatMap((c) =>
    c.nivel === 'propia' ? [c.comarca] : [],
  );
  return {
    disponible: recursosSegun((r) => almacen[r] - reservado[r]),
    reservado,
    producido: recursosSegun((r) => propias.reduce((t, c) => t + c.produccionUltimoTurno[r], 0)),
  };
}

export function recursosEnTexto(r: Recursos): string {
  const partes = RECURSOS.filter((x) => r[x] !== 0).map((x) => `${String(r[x])} ${x}`);
  return partes.length === 0 ? 'nada' : partes.join(' · ');
}

/** Las colas del jugador con sus ordenes en espera, en su orden (T-045). */
export function colasDe(vista: Pick<VistaJugador, 'ordenes'>): Map<string, Orden[]> {
  const colas = new Map<string, Orden[]>();
  for (const orden of vista.ordenes) {
    if (orden.cola === null || orden.estado !== 'en cola') continue;
    colas.set(orden.cola, [...(colas.get(orden.cola) ?? []), orden]);
  }
  return colas;
}

/**
 * La intencion `cola` que sube o baja una orden un puesto en su cola, o null si ya esta en el borde.
 * La lista tiene que ser exactamente la de las ordenes que esperan en ella (T-045).
 */
export function moverEnLaCola(
  vista: Pick<VistaJugador, 'ordenes'>,
  clave: string,
  orden: string,
  hacia: 'arriba' | 'abajo',
): Record<string, unknown> | null {
  const lista = (colasDe(vista).get(clave) ?? []).map((o) => o.id as string);
  const i = lista.indexOf(orden);
  const j = hacia === 'arriba' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= lista.length) return null;
  const nueva = [...lista];
  const a = nueva[i];
  const b = nueva[j];
  if (a === undefined || b === undefined) return null;
  nueva[i] = b;
  nueva[j] = a;
  return { tipo: 'cola', clave, orden: nueva };
}

/** «Faltan 3 h 20 min» hasta la proxima resolucion; «resolviendo» si ya ha pasado la hora. */
export function tiempoHastaElCorte(proxima: number | null, ahora: number): string {
  if (proxima === null) return 'partida detenida';
  const ms = proxima - ahora;
  if (ms <= 0) return 'resolviendo';
  const minutos = Math.ceil(ms / 60_000);
  const dias = Math.floor(minutos / 1440);
  const horas = Math.floor((minutos % 1440) / 60);
  const resto = minutos % 60;
  const partes = [
    dias > 0 ? `${String(dias)} d` : '',
    horas > 0 ? `${String(horas)} h` : '',
    resto > 0 && dias === 0 ? `${String(resto)} min` : '',
  ].filter((p) => p !== '');
  return `faltan ${partes.join(' ')}`;
}
