// Los contratos entre jugadores (ficha T-103 §3): acuerdos que el motor verifica y ejecuta. Cada uno
// tiene dos partes —quien propone y quien recibe la propuesta—, un plazo, una penalizacion por
// incumplir y lo propio de su tipo. Nada se cumple ni se incumple sin que el motor lo vea.
import type { IdComarca, IdContrato, IdJugador, IdObra } from './ids.ts';
import type { Recurso } from './recursos.ts';
import type { TipoObraMayor } from './reglas.ts';

export const TIPOS_DE_CONTRATO = [
  'entrega',
  'prestamo',
  'aperos',
  'obra',
  'paso',
  'no-agresion',
  'no-cortejo',
  'exclusiva',
] as const;
export type TipoDeContrato = (typeof TIPOS_DE_CONTRATO)[number];

export const ESTADOS_DE_CONTRATO = [
  'propuesto',
  'vigente',
  'cumplido',
  'incumplido',
  'rechazado',
  'caducado',
  /** Un acuerdo que una parte rompio antes de su plazo (T-123). */
  'roto',
] as const;
export type EstadoDeContrato = (typeof ESTADOS_DE_CONTRATO)[number];

/** Lo que tiene todo contrato. */
export interface BaseDeContrato {
  readonly id: IdContrato;
  readonly propone: IdJugador;
  readonly recibe: IdJugador;
  readonly estado: EstadoDeContrato;
  readonly propuestoEn: number;
  /** Ultimo turno para cumplirlo: pasado, se incumple (o se cumple, el de paso). */
  readonly plazo: number;
  /** Maravedis que paga a la otra parte quien incumple, hasta lo que tenga. */
  readonly penalizacion: number;
  /** Por que se rechazo, caduco o se incumplio; quien fallo, si lo hubo. */
  readonly motivo: string | null;
  readonly fallo: IdJugador | null;
}

/** Entregar mercancia en una comarca del que la recibe, y cobrarla al entregar. */
export interface ContratoEntrega extends BaseDeContrato {
  readonly tipo: 'entrega';
  /** Quien pone la mercancia: una de las dos partes. */
  readonly entrega: IdJugador;
  readonly recurso: Recurso;
  readonly cantidad: number;
  /** Comarca del que recibe donde una recua del que entrega tiene que estar con la carga. */
  readonly comarca: IdComarca;
  readonly precio: number;
  /** El pago que se aparto al firmar, si el que paga tenia poco credito (pago por adelantado). */
  readonly depositado: number;
}

/** Prestar maravedis y cobrar la devolucion al plazo. */
export interface ContratoPrestamo extends BaseDeContrato {
  readonly tipo: 'prestamo';
  /** Quien presta: una de las dos partes. */
  readonly presta: IdJugador;
  readonly cantidad: number;
  readonly devolver: number;
}

/** Un ferron instala aperos en una comarca del comprador, al firmar. */
export interface ContratoAperos extends BaseDeContrato {
  readonly tipo: 'aperos';
  readonly vende: IdJugador;
  readonly comarca: IdComarca;
  readonly niveles: number;
  readonly precio: number;
}

/** Un cantero levanta una obra mayor en una comarca del cliente, con su material y sus ventajas. */
export interface ContratoObra extends BaseDeContrato {
  readonly tipo: 'obra';
  readonly construye: IdJugador;
  readonly comarca: IdComarca;
  readonly obra: TipoObraMayor;
  /** Otra punta del tramo, en puente y calzada. */
  readonly hacia: IdComarca | null;
  readonly precio: number;
  /** La obra que salio del contrato, desde que se firma. */
  readonly idObra: IdObra | null;
}

/** Quien tiene la tierra deja pasar los rebanyos de la otra parte hasta el plazo. */
export interface ContratoPaso extends BaseDeContrato {
  readonly tipo: 'paso';
  readonly concede: IdJugador;
  readonly precio: number;
}

/** Ninguna de las dos casas declara la hostilidad a la otra hasta el plazo (T-123). */
export interface ContratoNoAgresion extends BaseDeContrato {
  readonly tipo: 'no-agresion';
  /** Quien la propone comprometiendose; el efecto es para las dos. */
  readonly compromete: IdJugador;
  readonly precio: number;
}

/** La parte que se compromete no corteja esas comarcas hasta el plazo (T-123). */
export interface ContratoNoCortejo extends BaseDeContrato {
  readonly tipo: 'no-cortejo';
  readonly compromete: IdJugador;
  readonly comarcas: readonly IdComarca[];
  readonly precio: number;
}

/** La parte que se compromete no vende ese recurso en ninguna plaza hasta el plazo (T-123). */
export interface ContratoExclusiva extends BaseDeContrato {
  readonly tipo: 'exclusiva';
  readonly compromete: IdJugador;
  readonly recurso: Recurso;
  readonly precio: number;
}

export type Contrato =
  | ContratoEntrega
  | ContratoPrestamo
  | ContratoAperos
  | ContratoObra
  | ContratoPaso
  | ContratoNoAgresion
  | ContratoNoCortejo
  | ContratoExclusiva;

/** Los contratos que son acuerdos: duran hasta su plazo y se pueden romper (T-123). */
export const TIPOS_DE_ACUERDO: readonly TipoDeContrato[] = [
  'paso',
  'no-agresion',
  'no-cortejo',
  'exclusiva',
];
