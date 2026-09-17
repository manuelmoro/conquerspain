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
import type { Tradicion, TipoEdificio } from './reglas.ts';

export const ESTADOS_DE_ORDEN = [
  'pendiente',
  'en curso',
  'terminada',
  'cancelada',
  'en espera',
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
  'mercado',
  'obra-mayor',
  'tradicion',
  'mayordomo',
  'trasladar-corte',
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

export interface OrdenMercado extends OrdenBase {
  readonly tipo: 'mercado';
  readonly mercado: IdMercado;
  readonly recurso: Recurso;
  readonly operacion: 'comprar' | 'vender';
  readonly cantidad: number;
  readonly precioLimiteMil: number;
}

export interface OrdenObraMayor extends OrdenBase {
  readonly tipo: 'obra-mayor';
  readonly comarca: IdComarca;
  readonly obra: string;
  /** Obra ya empezada a la que se aporta material, o null si se empieza ahora. */
  readonly continuar: IdObra | null;
}

export interface OrdenTradicion extends OrdenBase {
  readonly tipo: 'tradicion';
  readonly tradicion: Tradicion;
}

export interface ReglaDeMayordomo {
  readonly condicion: string;
  readonly parametros: Readonly<Record<string, number | string>>;
  readonly accion: string;
  readonly prioridad: number;
}

export interface OrdenMayordomo extends OrdenBase {
  readonly tipo: 'mayordomo';
  readonly alta: ReglaDeMayordomo | null;
  readonly bajaPrioridad: number | null;
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
  | OrdenMercado
  | OrdenObraMayor
  | OrdenTradicion
  | OrdenMayordomo
  | OrdenTrasladarCorte;
