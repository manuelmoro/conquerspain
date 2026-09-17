// Sucesos y cronica. Los sucesos no llevan texto redactado: el texto se compone despues con
// plantillas, para poder cambiar la redaccion sin tocar el motor (docs/02 §2.7).
import type { IdComarca, IdJugador } from './ids.ts';

export const NOMBRES_DE_FASE = [
  'mayordomo',
  'calendario',
  'produccion',
  'consumo',
  'movimiento',
  'cometidos',
  'obras',
  'mercado',
  'territorio',
  'poblacion',
  'acontecimientos',
  'prestigio',
  'cronica',
] as const;
export type NombreFase = (typeof NOMBRES_DE_FASE)[number];

export interface Suceso {
  /** Secuencial dentro del turno: fija el orden de lectura y de depuracion. */
  readonly orden: number;
  readonly fase: NombreFase;
  /** Tipo con espacio de nombres: 'produccion.explotacion', 'recua.llegada'… */
  readonly tipo: string;
  readonly jugador: IdJugador | null;
  readonly comarca: IdComarca | null;
  readonly datos: Readonly<Record<string, number | string>>;
}

export const SECCIONES_DE_CRONICA = ['avisos', 'sucesos', 'economia', 'rumores', 'hitos'] as const;
export type SeccionDeCronica = (typeof SECCIONES_DE_CRONICA)[number];

export interface EntradaDeCronica {
  readonly seccion: SeccionDeCronica;
  readonly texto: string;
  readonly comarca: IdComarca | null;
  /** Orden que resolveria el aviso, para que la interfaz ofrezca el boton. */
  readonly accionSugerida: string | null;
}

export interface Cronica {
  readonly turno: number;
  readonly jugador: IdJugador;
  readonly entradas: readonly EntradaDeCronica[];
}
