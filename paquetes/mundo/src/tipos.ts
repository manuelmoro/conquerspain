// Forma de una ficha del catalogo geografico (lo que se escribe a mano en catalogo/*.jsonc).
// El mundo que consume el motor se genera a partir de esto con la herramienta atlas (T-011).
// Las ferias no viven aqui: tienen su propio archivo, `catalogo/ferias.jsonc` (T-014).
import type { NivelPotencial, Potencial, Terreno } from '@conquer/nucleo';

export interface LocalidadCatalogo {
  readonly nombre: string;
  /** [longitud, latitud] en milesimas de grado. */
  readonly coord: readonly [number, number];
  /** true en la cabecera de la comarca; null o false en las demas. */
  readonly cabecera: boolean | null;
}

export interface ComarcaCatalogo {
  readonly id: string;
  readonly nombre: string;
  readonly cabecera: string;
  readonly region: string;
  readonly centro: readonly [number, number];
  readonly terreno: Terreno;
  readonly potenciales: Readonly<Record<Potencial, NivelPotencial>>;
  readonly solares: number;
  readonly poblacionInicial: number;
  readonly localidades: readonly LocalidadCatalogo[];
  readonly rasgos: readonly string[];
  readonly esOrigen: boolean;
  /** Obligatoria cuando algun potencial se aparta de lo que sugiere el terreno. */
  readonly nota: string | null;
}
