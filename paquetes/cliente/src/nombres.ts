// Lo que se lee en pantalla, en castellano (ficha T-088 §2.5): ningun identificador interno llega al
// jugador. Las tablas son completas por tipo: si el nucleo anyade un valor, esto no compila.
import type {
  Cometido,
  EstadoDeOrden,
  Potencial,
  Recurso,
  Terreno,
  TipoDeOrden,
} from '@conquer/nucleo';

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
  anular: 'Anular una orden',
  contrato: 'Proponer un contrato',
  'responder-contrato': 'Responder a un contrato',
  portazgo: 'Fijar un portazgo',
  entrar: 'Entrar en la partida',
};

export const NOMBRE_DE_COMETIDO: Readonly<Record<Cometido, string>> = {
  explorar: 'explorar',
  portear: 'portear',
  tratar: 'tratar en la plaza',
  poblar: 'fundar puebla',
  presencia: 'estar presente',
  emisario: 'hacer de emisario',
  disolver: 'disolverse',
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

/** Donde se da cada orden en el cliente, o en que pantalla llegara si aun no hay ninguna. */
export interface QueHacer {
  /** Lo que se le propone al jugador, en una frase. */
  readonly texto: string;
  /** Donde se hace hoy; null si todavia no hay pantalla. */
  readonly donde: 'ficha' | 'bandeja' | 'unidades' | 'mercado' | 'casa' | null;
  /** Si no hay pantalla, cuando llega. */
  readonly llega: string | null;
}

const CON_LOS_CONTRATOS = 'llegará con los contratos entre casas';

/** La accion sugerida de cada aviso de la cronica, en castellano (ficha T-088 §2.9). */
export const QUE_HACER: Readonly<Record<TipoDeOrden, QueHacer>> = {
  construir: {
    texto: 'Levanta o amplía un edificio desde la ficha de la comarca.',
    donde: 'ficha',
    llega: null,
  },
  derribar: {
    texto: 'Derriba un edificio desde la ficha de la comarca.',
    donde: 'ficha',
    llega: null,
  },
  roturar: { texto: 'Rotura monte desde la ficha de la comarca.', donde: 'ficha', llega: null },
  aperos: { texto: 'Instala aperos desde la ficha de la comarca.', donde: 'ficha', llega: null },
  'formar-recua': {
    texto: 'Forma una recua desde la ficha de una comarca tuya.',
    donde: 'ficha',
    llega: null,
  },
  'formar-rebanyo': {
    texto: 'Forma un rebaño desde la ficha de una comarca tuya.',
    donde: 'ficha',
    llega: null,
  },
  regalo: {
    texto: 'Haz un regalo al concejo desde la ficha de la comarca.',
    donde: 'ficha',
    llega: null,
  },
  incorporar: { texto: 'Incorpora la comarca desde su ficha.', donde: 'ficha', llega: null },
  cola: { texto: 'Reordena la cola desde la bandeja de órdenes.', donde: 'bandeja', llega: null },
  anular: {
    texto: 'Anula la orden que espera desde «En marcha», en la bandeja.',
    donde: 'bandeja',
    llega: null,
  },
  contrato: { texto: 'Propón un contrato desde «Tus contratos».', donde: 'casa', llega: null },
  'responder-contrato': {
    texto: 'Acepta o rechaza la propuesta en «Tus contratos».',
    donde: 'casa',
    llega: null,
  },
  portazgo: { texto: 'Fija el portazgo de tus tramos en «Tu casa».', donde: 'casa', llega: null },
  entrar: {
    texto: 'Se entra desde «Unirse a una partida», con su código.',
    donde: 'casa',
    llega: null,
  },
  ruta: {
    texto: 'Dale otro camino a la recua o al rebaño desde «Tus recuas y rebaños».',
    donde: 'unidades',
    llega: null,
  },
  carga: {
    texto: 'Carga o descarga en las paradas de su ruta, desde «Tus recuas y rebaños».',
    donde: 'unidades',
    llega: null,
  },
  cometido: {
    texto: 'Mándala a estar presente o a explorar desde la ficha de la comarca.',
    donde: 'ficha',
    llega: null,
  },
  mercado: {
    texto: 'Compra o vende desde el mercado, con una recua en la plaza.',
    donde: 'mercado',
    llega: null,
  },
  'letra-de-cambio': {
    texto: 'Mueve dinero con una letra de cambio.',
    donde: null,
    llega: CON_LOS_CONTRATOS,
  },
  politica: {
    texto: 'Cambia el fuero, la carga fiscal o la dehesa desde la ficha de la comarca.',
    donde: 'ficha',
    llega: null,
  },
  'obra-mayor': {
    texto: 'Emprende una obra mayor desde la ficha de la comarca.',
    donde: 'ficha',
    llega: null,
  },
  tradicion: { texto: 'Elige una tradición desde «Tu casa».', donde: 'casa', llega: null },
  mayordomo: { texto: 'Deja una regla al mayordomo desde «Tu casa».', donde: 'casa', llega: null },
  'trasladar-corte': {
    texto: 'Traslada la corte desde la ficha de la comarca de destino.',
    donde: 'ficha',
    llega: null,
  },
};

/** La accion sugerida en palabras, o null si no hay o no se reconoce (nunca el identificador). */
export function queHacer(accion: string | null): QueHacer | null {
  if (accion === null) return null;
  const encontrado = Object.entries(QUE_HACER).find(([clave]) => clave === accion);
  return encontrado === undefined ? null : encontrado[1];
}
