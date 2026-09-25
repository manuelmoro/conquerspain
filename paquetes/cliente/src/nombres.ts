// Lo que se lee en pantalla, en castellano (ficha T-088 §2.5): ningun identificador interno llega al
// jugador. Las tablas son completas por tipo: si el nucleo anyade un valor, esto no compila.
import type { EstadoDeOrden, Potencial, Recurso, Terreno, TipoDeOrden } from '@conquer/nucleo';

export const NOMBRE_DE_RECURSO: Readonly<Record<Recurso, string>> = {
  pan: 'pan',
  madera: 'madera',
  piedra: 'piedra',
  maravedis: 'maravedís',
  sal: 'sal',
  hierro: 'hierro',
  lana: 'lana',
};

/** Una marca corta para las fichas de recurso. */
export const MARCA_DE_RECURSO: Readonly<Record<Recurso, string>> = {
  pan: '🌾',
  madera: '🪵',
  piedra: '🪨',
  maravedis: '🪙',
  sal: '🧂',
  hierro: '⚒',
  lana: '🐑',
};

export const NOMBRE_DE_ORDEN: Readonly<Record<TipoDeOrden, string>> = {
  construir: 'Construir',
  derribar: 'Derribar',
  roturar: 'Roturar',
  politica: 'Gobierno de la comarca',
  'formar-recua': 'Formar recua',
  ruta: 'Viaje',
  carga: 'Cargar o descargar',
  cometido: 'Encargo de recua',
  'formar-rebanyo': 'Formar rebaño',
  incorporar: 'Incorporar comarca',
  regalo: 'Regalo al concejo',
  aperos: 'Instalar aperos',
  'letra-de-cambio': 'Letra de cambio',
  mercado: 'Comprar o vender',
  'obra-mayor': 'Obra mayor',
  tradicion: 'Tradición',
  mayordomo: 'Regla del mayordomo',
  'trasladar-corte': 'Trasladar la corte',
  cola: 'Reordenar la cola',
};

export const NOMBRE_DE_ESTADO: Readonly<Record<EstadoDeOrden, string>> = {
  pendiente: 'por empezar',
  'en curso': 'en marcha',
  terminada: 'terminada',
  cancelada: 'cancelada',
  'en espera': 'esperando',
  programada: 'para más adelante',
  'en cola': 'en cola',
};

export const NOMBRE_DE_POTENCIAL: Readonly<Record<Potencial, string>> = {
  labor: 'tierra de labor',
  monte: 'monte',
  pasto: 'pasto',
  piedra: 'cantera',
  hierro: 'hierro',
  sal: 'salinas',
  pesca: 'pesca',
};

export const NOMBRE_DE_TERRENO: Readonly<Record<Terreno, string>> = {
  llano: 'llano',
  ondulado: 'ondulado',
  sierra: 'sierra',
  costa: 'costa',
  vega: 'vega',
};

/** El nombre de un tipo de orden que llega como texto (de una intencion), o un generico. */
export function nombreDeOrden(tipo: unknown): string {
  if (typeof tipo !== 'string') return 'Orden';
  const encontrado = Object.entries(NOMBRE_DE_ORDEN).find(([clave]) => clave === tipo);
  return encontrado === undefined ? 'Orden' : encontrado[1];
}
