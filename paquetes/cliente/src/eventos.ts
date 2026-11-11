// El canal de eventos en vivo (ficha T-080 §4.4, T-064): escucha `turno-resuelto` y `fin-de-turno`
// (T-124) y, si se corta, reintenta con espera creciente (1, 2, 4… hasta 30 s).
import type { MensajeRecibido, QuienJuega } from './api.ts';

/** Lo que hace falta de un `EventSource`; en el navegador se adapta uno de verdad. */
export interface FuenteDeEventos {
  alMensaje(tipo: string, oyente: (datos: string) => void): void;
  alError(oyente: () => void): void;
  cerrar(): void;
}

export interface OpcionesDeEventos {
  readonly url: string;
  readonly crear: (url: string) => FuenteDeEventos;
  readonly alTurno: (turno: number) => void;
  /** Alguien ha terminado o reabierto su turno (T-124). */
  readonly alFinDeTurno?: (turno: number, quienes: readonly QuienJuega[]) => void;
  /** Un mensaje nuevo en la charla (T-129). */
  readonly alMensaje?: (mensaje: MensajeRecibido) => void;
  /** setTimeout inyectable para las pruebas. */
  readonly programar?: (hacer: () => void, ms: number) => unknown;
}

const ESPERA_MAXIMA_MS = 30_000;

export function esperaDeReconexion(intento: number): number {
  return Math.min(1000 * 2 ** intento, ESPERA_MAXIMA_MS);
}

/** Conecta y devuelve la funcion que desconecta del todo. */
export function escucharEventos(opciones: OpcionesDeEventos): () => void {
  const programar = opciones.programar ?? ((hacer, ms) => setTimeout(hacer, ms));
  let fuente: FuenteDeEventos | null = null;
  let intento = 0;
  let parado = false;
  const conectar = (): void => {
    if (parado) return;
    fuente = opciones.crear(opciones.url);
    fuente.alMensaje('turno-resuelto', (texto) => {
      intento = 0;
      try {
        const datos: unknown = JSON.parse(texto);
        const turno =
          typeof datos === 'object' && datos !== null && 'turno' in datos ? datos.turno : null;
        if (typeof turno === 'number') opciones.alTurno(turno);
      } catch {
        // Un evento mal formado se ignora: el siguiente traera el turno.
      }
    });
    fuente.alMensaje('fin-de-turno', (texto) => {
      const fin = leerFinDeTurno(texto);
      if (fin !== null) opciones.alFinDeTurno?.(fin.turno, fin.quienes);
    });
    fuente.alMensaje('mensaje', (texto) => {
      const mensaje = leerMensaje(texto);
      if (mensaje !== null) opciones.alMensaje?.(mensaje);
    });
    fuente.alError(() => {
      fuente?.cerrar();
      fuente = null;
      const espera = esperaDeReconexion(intento);
      intento += 1;
      programar(conectar, espera);
    });
  };
  conectar();
  return () => {
    parado = true;
    fuente?.cerrar();
  };
}

function esQuienJuega(dato: unknown): dato is QuienJuega {
  return (
    typeof dato === 'object' &&
    dato !== null &&
    'jugador' in dato &&
    typeof dato.jugador === 'string' &&
    'nombre' in dato &&
    typeof dato.nombre === 'string' &&
    'terminado' in dato &&
    typeof dato.terminado === 'boolean'
  );
}

/** El evento `fin-de-turno` leido con cuidado: si viene mal formado, null y se ignora. */
export function leerFinDeTurno(
  texto: string,
): { readonly turno: number; readonly quienes: readonly QuienJuega[] } | null {
  let datos: unknown;
  try {
    datos = JSON.parse(texto);
  } catch {
    return null;
  }
  if (typeof datos !== 'object' || datos === null) return null;
  const turno = 'turno' in datos ? datos.turno : null;
  const quienes = 'quienes' in datos ? datos.quienes : null;
  if (typeof turno !== 'number' || !Array.isArray(quienes)) return null;
  const lista: readonly unknown[] = quienes;
  return lista.every(esQuienJuega) ? { turno, quienes: lista.filter(esQuienJuega) } : null;
}

/** El evento `mensaje` leido con cuidado: si viene mal formado, null y se ignora. */
export function leerMensaje(texto: string): MensajeRecibido | null {
  let d: unknown;
  try {
    d = JSON.parse(texto);
  } catch {
    return null;
  }
  if (
    typeof d !== 'object' ||
    d === null ||
    !('id' in d && typeof d.id === 'number') ||
    !('jugador' in d && typeof d.jugador === 'string') ||
    !('nombre' in d && typeof d.nombre === 'string') ||
    !('casa' in d && (typeof d.casa === 'string' || d.casa === null)) ||
    !('turno' in d && typeof d.turno === 'number') ||
    !('texto' in d && typeof d.texto === 'string') ||
    !('enviadoEn' in d && typeof d.enviadoEn === 'number')
  ) {
    return null;
  }
  return {
    id: d.id,
    jugador: d.jugador,
    nombre: d.nombre,
    casa: d.casa,
    turno: d.turno,
    texto: d.texto,
    enviadoEn: d.enviadoEn,
  };
}
