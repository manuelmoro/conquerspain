// La entrada al juego en palabras (ficha T-086 §4.2), pura: el abastecimiento y el aviso de ordenes
// de cada partida, el ritmo de un turno y lo que toca hacer en cada convocatoria.
import type { ConvocatoriaRecibida, PartidaDeLaLista } from './api.ts';

export interface AvisoDePartida {
  readonly texto: string;
  /** Pide atencion: hambre, o un turno sin ordenes. */
  readonly urgente: boolean;
}

/** El abastecimiento en una frase: el hambre, en rojo y con texto (no solo color). */
export function abastecimiento(p: PartidaDeLaLista): AvisoDePartida | null {
  const r = p.resumen;
  if (r === null) return null;
  if (r.escasez) return { texto: 'Hambre: falta pan', urgente: true };
  if (r.turnosDePan === null) return { texto: `${String(r.pan)} de pan`, urgente: false };
  return {
    texto: `Pan para ${String(r.turnosDePan)} turno${r.turnosDePan === 1 ? '' : 's'}`,
    urgente: r.turnosDePan < 3,
  };
}

/** Si la partida espera ordenes este turno: en marcha y sin ninguna dada. */
export function esperaOrdenes(p: PartidaDeLaLista): boolean {
  return p.estado === 'activa' && p.ordenesDadas === 0;
}

export const RITMOS: readonly { readonly minutos: number; readonly texto: string }[] = [
  { minutos: 60, texto: 'Un turno cada hora' },
  { minutos: 360, texto: 'Un turno cada 6 horas' },
  { minutos: 1440, texto: 'Un turno cada día' },
];

export function ritmoEnPalabras(minutos: number): string {
  return (
    RITMOS.find((r) => r.minutos === minutos)?.texto ?? `Un turno cada ${String(minutos)} minutos`
  );
}

export type PasoDeConvocatoria =
  | { readonly tipo: 'esperar-jugadores'; readonly faltan: number; readonly codigo: null }
  /** Quien convoca cierra la lista cuando quiere: con las plazas llenas o con los que haya. */
  | { readonly tipo: 'sortear'; readonly faltan: number; readonly codigo: string }
  | { readonly tipo: 'elegir-origen' }
  | { readonly tipo: 'esperar-eleccion'; readonly faltan: number }
  | { readonly tipo: 'abrir'; readonly partida: string };

/** Lo que toca hacer en una convocatoria, desde el punto de vista de quien mira. */
export function pasoDe(c: ConvocatoriaRecibida): PasoDeConvocatoria {
  if (c.partida !== null) return { tipo: 'abrir', partida: c.partida };
  if (c.estado === 'eligiendo') {
    if (c.miEleccion === null && c.misOfertas.length > 0) return { tipo: 'elegir-origen' };
    return { tipo: 'esperar-eleccion', faltan: c.jugadores.filter((j) => !j.haElegido).length };
  }
  const faltan = Math.max(0, c.plazas - c.jugadores.length);
  // Abierta: quien convoca tiene el codigo y puede cerrar la lista y sortear.
  if (c.codigo !== null) return { tipo: 'sortear', faltan, codigo: c.codigo };
  return { tipo: 'esperar-jugadores', faltan, codigo: null };
}
