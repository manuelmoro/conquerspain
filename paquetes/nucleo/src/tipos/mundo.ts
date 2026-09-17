// El mundo son los datos fijos del tablero: no cambian durante la partida.
// Se generan con la herramienta atlas a partir del catalogo (docs/05-geografia.md §5.8).
import type { IdComarca, IdFeria } from './ids.ts';

export const TERRENOS = ['llano', 'ondulado', 'sierra', 'costa', 'vega'] as const;
export type Terreno = (typeof TERRENOS)[number];

export const POTENCIALES = ['labor', 'monte', 'pasto', 'piedra', 'hierro', 'sal', 'pesca'] as const;
export type Potencial = (typeof POTENCIALES)[number];

/** Aptitud fija de una comarca para un recurso, de 0 (imposible) a 5 (excepcional). */
export type NivelPotencial = 0 | 1 | 2 | 3 | 4 | 5;

export const RASGOS = [
  'salinas-historicas',
  'vena-de-hierro',
  'ferreria-de-agua',
  'cantera-noble',
  'pinar-maderable',
  'pasto-de-verano',
  'pasto-de-invierno',
  'dehesa',
  'marisma',
  'vega-fluvial',
  'ciudad-episcopal',
  'villa-de-feria',
  'puerto-de-mar',
  'camino-de-santiago',
  'calzada-romana',
  'vinyedo',
  'montado',
] as const;
export type Rasgo = (typeof RASGOS)[number];

export const VOLUMENES_FERIA = ['pequenya', 'mediana', 'grande'] as const;
export type VolumenFeria = (typeof VOLUMENES_FERIA)[number];

/** Coordenada geografica en milesimas de grado: [longitud, latitud]. */
export type Coordenada = readonly [number, number];

/** Punto del mapa en unidades de atlas (1 unidad ≈ 1,11 km), enteras. */
export type Punto = readonly [number, number];

export interface Localidad {
  readonly nombre: string;
  readonly coord: Coordenada;
  readonly cabecera: boolean;
}

export interface Feria {
  readonly id: IdFeria;
  readonly nombre: string;
  readonly turnos: readonly number[];
  readonly volumen: VolumenFeria;
  readonly recursosDestacados: readonly string[];
}

export interface ComarcaMundo {
  readonly id: IdComarca;
  readonly nombre: string;
  readonly cabecera: string;
  readonly region: string;
  readonly centro: Coordenada;
  readonly poligono: readonly Punto[];
  readonly terreno: Terreno;
  readonly potenciales: Readonly<Record<Potencial, NivelPotencial>>;
  readonly solares: number;
  readonly poblacionInicial: number;
  readonly localidades: readonly Localidad[];
  readonly rasgos: readonly Rasgo[];
  readonly feria: Feria | null;
  readonly esOrigen: boolean;
}

/** Tramo entre dos comarcas vecinas (docs/03-economia.md §3.7.2). */
export interface Camino {
  readonly desde: IdComarca;
  readonly hasta: IdComarca;
  readonly terreno: Terreno;
  readonly jornadasBase: number;
  readonly vado: boolean;
  /** Nombre historico del puerto de montanya, o null si el tramo no lo cruza. */
  readonly puertoDeMontanya: string | null;
  /** Nombre de la canyada real que usa este tramo, o null. */
  readonly canyada: string | null;
  readonly calzadaRomana: boolean;
}

export interface Mundo {
  readonly version: string;
  readonly comarcas: Readonly<Record<string, ComarcaMundo>>;
  readonly caminos: readonly Camino[];
  /** Vecindad derivada del grafo, siempre ordenada. */
  readonly vecinos: Readonly<Record<string, readonly IdComarca[]>>;
}
