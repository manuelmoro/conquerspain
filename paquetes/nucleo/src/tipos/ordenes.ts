// Las ordenes que puede dar un jugador (docs/02-diseno-nucleo.md §2.3).
// Una orden es una intencion registrada: se valida al darla, reserva sus recursos y se ejecuta
// en la resolucion. Ninguna orden guarda texto libre.
import type { Cometido, CargaFiscal, Fuero } from './estado.ts';
import type {
  IdComarca,
  IdJugador,
  IdMercado,
  IdObra,
  IdOrden,
  IdRebanyo,
  IdRecua,
} from './ids.ts';
import type { Recurso, Recursos } from './recursos.ts';
import type { Estacion, Tradicion, TipoEdificio, TipoObraMayor } from './reglas.ts';

export const ESTADOS_DE_ORDEN = [
  'pendiente',
  'en curso',
  'terminada',
  'cancelada',
  'en espera',
  /** Del plan de temporada: todavia no ha llegado su turno. No reserva nada. */
  'programada',
  /** En una cola: espera su vez sin reservar nada (docs/02 §2.5.1). */
  'en cola',
] as const;
export type EstadoDeOrden = (typeof ESTADOS_DE_ORDEN)[number];

export const TIPOS_DE_ORDEN = [
  'construir',
  'derribar',
  'roturar',
  'politica',
  'formar-recua',
  'ruta',
  'carga',
  'cometido',
  'formar-rebanyo',
  'incorporar',
  'regalo',
  'aperos',
  'letra-de-cambio',
  'mercado',
  'obra-mayor',
  'tradicion',
  'mayordomo',
  'trasladar-corte',
  'cola',
] as const;
export type TipoDeOrden = (typeof TIPOS_DE_ORDEN)[number];

export interface OrdenBase {
  readonly id: IdOrden;
  readonly jugador: IdJugador;
  readonly turnoAlta: number;
  readonly estado: EstadoDeOrden;
  readonly coste: Recursos;
  readonly turnosTotales: number;
  readonly turnosHechos: number;
  /** Motivo por el que quedo en espera, para poder explicarlo en la cronica. */
  readonly motivoEspera: string | null;
  /** True si la dio el mayordomo y no el jugador (docs/02 §2.5.3). */
  readonly delMayordomo: boolean;
  /** Plan de temporada: el turno en que entra; null si entra ya (docs/02 §2.5.4). */
  readonly turnoProgramado: number | null;
  /**
   * La cola en la que espera su vez, `comarca:<id>` o `recua:<id>`, o null si no va en cola. Una
   * orden en cola no reserva nada: empieza cuando puede, en el orden de su cola (docs/02 §2.5.1).
   */
  readonly cola: string | null;
}

export interface OrdenConstruir extends OrdenBase {
  readonly tipo: 'construir';
  readonly comarca: IdComarca;
  readonly edificio: TipoEdificio;
}

export interface OrdenDerribar extends OrdenBase {
  readonly tipo: 'derribar';
  readonly comarca: IdComarca;
  readonly edificio: TipoEdificio;
}

export interface OrdenRoturar extends OrdenBase {
  readonly tipo: 'roturar';
  readonly comarca: IdComarca;
}

export interface OrdenPolitica extends OrdenBase {
  readonly tipo: 'politica';
  readonly comarca: IdComarca;
  readonly fuero: Fuero | null;
  readonly cargaFiscal: CargaFiscal | null;
  readonly dehesa: boolean | null;
  /** Gastar sal en conservar el granero (docs/03-economia.md §3.1). */
  readonly conservarConSal: boolean | null;
}

export interface OrdenFormarRecua extends OrdenBase {
  readonly tipo: 'formar-recua';
  readonly comarca: IdComarca;
  readonly acemilas: number;
  readonly vecinos: number;
}

export interface OrdenFormarRebanyo extends OrdenBase {
  readonly tipo: 'formar-rebanyo';
  readonly comarca: IdComarca;
  readonly cabezas: number;
}

export interface ParadaDeRuta {
  readonly comarca: IdComarca;
  readonly cargar: Readonly<Partial<Record<Recurso, number>>>;
  readonly descargar: Readonly<Partial<Record<Recurso, number>>>;
  readonly vender: Readonly<
    Partial<Record<Recurso, { cantidad: number; precioMinimoMil: number }>>
  >;
  readonly comprar: Readonly<
    Partial<Record<Recurso, { cantidad: number; precioMaximoMil: number }>>
  >;
}

export interface OrdenRuta extends OrdenBase {
  readonly tipo: 'ruta';
  readonly recua: IdRecua | null;
  readonly rebanyo: IdRebanyo | null;
  readonly paradas: readonly ParadaDeRuta[];
  readonly circular: boolean;
}

export interface OrdenCarga extends OrdenBase {
  readonly tipo: 'carga';
  readonly recua: IdRecua;
  readonly cargar: Readonly<Partial<Record<Recurso, number>>>;
  readonly descargar: Readonly<Partial<Record<Recurso, number>>>;
  readonly vecinosCargados: number;
}

export interface OrdenCometido extends OrdenBase {
  readonly tipo: 'cometido';
  readonly recua: IdRecua;
  readonly cometido: Cometido;
}

export interface OrdenIncorporar extends OrdenBase {
  readonly tipo: 'incorporar';
  readonly comarca: IdComarca;
}

/** Instala un nivel de aperos en una comarca propia (docs/03-economia.md §3.3.1). */
export interface OrdenAperos extends OrdenBase {
  readonly tipo: 'aperos';
  readonly comarca: IdComarca;
}

/** Pasa maravedis del almacen a una recua que esta en una plaza, con demora y comision. */
export interface OrdenLetraDeCambio extends OrdenBase {
  readonly tipo: 'letra-de-cambio';
  readonly recua: IdRecua;
  readonly cantidad: number;
}

export interface OrdenRegalo extends OrdenBase {
  readonly tipo: 'regalo';
  readonly comarca: IdComarca;
}

export interface OrdenMercado extends OrdenBase {
  readonly tipo: 'mercado';
  readonly mercado: IdMercado;
  /** Recua que comercia: quieta en la comarca de la plaza y con cometido `tratar`. */
  readonly recua: IdRecua;
  readonly recurso: Recurso;
  readonly operacion: 'comprar' | 'vender';
  readonly cantidad: number;
  readonly precioLimiteMil: number;
}

export interface OrdenObraMayor extends OrdenBase {
  readonly tipo: 'obra-mayor';
  readonly comarca: IdComarca;
  readonly obra: TipoObraMayor;
  /** Otra punta del tramo para el puente y la calzada; null en las demas. */
  readonly hacia: IdComarca | null;
  /** Obra ya empezada a la que se refiere la orden, o null si se empieza ahora. */
  readonly continuar: IdObra | null;
  /** Con `continuar`: true la abandona, false la retoma. */
  readonly abandonar: boolean;
}

export interface OrdenTradicion extends OrdenBase {
  readonly tipo: 'tradicion';
  readonly tradicion: Tradicion;
}

/** El precio de una plaza, tal como lo sabe el jugador, por debajo o por encima de un umbral. */
export interface CondicionDePrecio {
  readonly tipo: 'precio-en-plaza-menor-que' | 'precio-en-plaza-mayor-que';
  readonly plaza: IdMercado;
  readonly recurso: Recurso;
  readonly precioMil: number;
}

/** Lo que puede mirar el mayordomo (ficha T-045 §4.3): una lista cerrada, no un lenguaje. */
export type CondicionDeMayordomo =
  | { readonly tipo: 'pan-disponible-menor-que'; readonly cantidad: number }
  | {
      readonly tipo: 'recurso-almacenado-mayor-que';
      readonly recurso: Recurso;
      readonly cantidad: number;
    }
  | CondicionDePrecio
  /** No queda ninguna obra en marcha en la comarca: la cuadrilla esta libre. */
  | { readonly tipo: 'obra-terminada-en'; readonly comarca: IdComarca }
  | { readonly tipo: 'escasez' }
  | { readonly tipo: 'estacion-empieza'; readonly estacion: Estacion }
  | { readonly tipo: 'rebanyo-sin-pasto' };

export const CONDICIONES_DE_MAYORDOMO = [
  'pan-disponible-menor-que',
  'recurso-almacenado-mayor-que',
  'precio-en-plaza-menor-que',
  'precio-en-plaza-mayor-que',
  'obra-terminada-en',
  'escasez',
  'estacion-empieza',
  'rebanyo-sin-pasto',
] as const;

/**
 * Lo que puede ordenar el mayordomo: un subconjunto seguro de lo que puede ordenar el jugador. Nunca
 * incorpora comarcas: las decisiones de territorio son del jugador.
 */
export type AccionDeMayordomo =
  | {
      readonly tipo: 'mercado';
      readonly recua: IdRecua;
      readonly mercado: IdMercado;
      readonly recurso: Recurso;
      readonly operacion: 'comprar' | 'vender';
      readonly cantidad: number;
      readonly precioLimiteMil: number;
    }
  | { readonly tipo: 'enviar-recua'; readonly recua: IdRecua; readonly comarca: IdComarca }
  | { readonly tipo: 'mover-rebanyo'; readonly rebanyo: IdRebanyo; readonly comarca: IdComarca }
  | { readonly tipo: 'carga-fiscal'; readonly comarca: IdComarca; readonly carga: CargaFiscal };

export const ACCIONES_DE_MAYORDOMO = [
  'mercado',
  'enviar-recua',
  'mover-rebanyo',
  'carga-fiscal',
] as const;

/** «Cuando <condicion>, entonces <accion>», con su prioridad: se evaluan de menor a mayor. */
export interface ReglaDeMayordomo {
  readonly prioridad: number;
  readonly condicion: CondicionDeMayordomo;
  readonly accion: AccionDeMayordomo;
}

export interface OrdenMayordomo extends OrdenBase {
  readonly tipo: 'mayordomo';
  readonly alta: ReglaDeMayordomo | null;
  readonly bajaPrioridad: number | null;
}

/** Reordena una cola: la lista tiene que ser exactamente las ordenes que esperan en ella. */
export interface OrdenCola extends OrdenBase {
  readonly tipo: 'cola';
  readonly clave: string;
  readonly orden: readonly IdOrden[];
}

export interface OrdenTrasladarCorte extends OrdenBase {
  readonly tipo: 'trasladar-corte';
  readonly comarca: IdComarca;
}

export type Orden =
  | OrdenConstruir
  | OrdenDerribar
  | OrdenRoturar
  | OrdenPolitica
  | OrdenFormarRecua
  | OrdenFormarRebanyo
  | OrdenRuta
  | OrdenCarga
  | OrdenCometido
  | OrdenIncorporar
  | OrdenRegalo
  | OrdenAperos
  | OrdenLetraDeCambio
  | OrdenMercado
  | OrdenObraMayor
  | OrdenTradicion
  | OrdenMayordomo
  | OrdenTrasladarCorte
  | OrdenCola;
