// Sucesos y cronica. Los sucesos no llevan texto redactado: el texto se compone despues con
// plantillas, para poder cambiar la redaccion sin tocar el motor (docs/02 §2.7).
import type { IdComarca, IdJugador } from './ids.ts';
import type { TipoDeOrden } from './ordenes.ts';

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
  /** «Segunda quincena de mayo del año 3». */
  readonly fecha: string;
  readonly jugador: IdJugador;
  readonly entradas: readonly EntradaDeCronica[];
}

/**
 * Como se cuenta un tipo de suceso en la cronica (ficha T-044 §4.4). El texto lleva huecos
 * `{campo}` que se rellenan con los datos del suceso ya traducidos a nombres; `{campo:formato}`
 * aplica un formato (`mil`, `pct`, `abs`, `fecha`, `infinitivo`).
 */
export interface Plantilla {
  readonly seccion: SeccionDeCronica;
  readonly texto: string;
  /** La orden que resolveria lo que cuenta, para que la interfaz ofrezca el boton. */
  readonly accion: TipoDeOrden | null;
  /**
   * Va en el parte de todos los que conocen la comarca del suceso (o de todos, si no tiene), no
   * solo en el de su jugador. Con jugador, los demas leen `textoAjeno`.
   */
  readonly publica: boolean;
  readonly textoAjeno: string | null;
}

/**
 * Lo que dice la cronica de un tipo de suceso: una plantilla, `null` si no se cuenta suelto (va al
 * resumen o es detalle para auditar), o una plantilla por cada valor de un campo.
 */
export type PlantillaDeSuceso =
  | Plantilla
  | null
  | { readonly segun: string; readonly casos: Readonly<Record<string, Plantilla | null>> };
