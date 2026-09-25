// La interfaz de persistencia (ficha T-060 §6): lo unico que el resto del servidor sabe del
// almacenamiento. Es asincrona aunque SQLite no lo sea, para poder pasar a Postgres sin tocar a
// quien la usa.
import type {
  Cronica,
  EstadoPartida,
  IdJugador,
  IdOrden,
  IdPartida,
  Mundo,
  Orden,
  Suceso,
} from '@conquer/nucleo';

export { ErrorDePersistencia } from './errores.ts';
export type { CodigoDePersistencia } from './errores.ts';

export const ESTADOS_DE_PARTIDA = ['activa', 'detenida', 'terminada'] as const;
export type EstadoDeLaPartida = (typeof ESTADOS_DE_PARTIDA)[number];

export interface ParticipanteNuevo {
  readonly jugador: IdJugador;
  readonly casa: string;
  /** Cuenta que lo juega; T-063 la enlaza. */
  readonly cuenta: string | null;
}

export interface NuevaPartida {
  readonly id: IdPartida;
  readonly nombre: string;
  readonly semilla: string;
  readonly versionReglas: number;
  /** Huella del mundo con el que se crea la partida. */
  readonly huellaMundo: string;
  readonly intervaloSegundos: number;
  /** Milisegundos Unix del instante del turno 1: de aqui cuenta T-061. */
  readonly ancla: number;
  readonly proximaResolucion: number | null;
  readonly esDePrueba: boolean;
  readonly participantes: readonly ParticipanteNuevo[];
}

export interface FilaDePartida {
  readonly id: IdPartida;
  readonly nombre: string;
  readonly semilla: string;
  readonly versionReglas: number;
  readonly huellaMundo: string;
  readonly intervaloSegundos: number;
  readonly ancla: number;
  readonly turnoActual: number;
  readonly proximaResolucion: number | null;
  readonly estado: 'activa' | 'detenida' | 'terminada';
  readonly motivoDetencion: string | null;
  readonly esDePrueba: boolean;
  readonly creadaEn: number;
}

export interface Participante {
  readonly jugador: IdJugador;
  readonly casa: string;
  readonly cuenta: string | null;
}

export interface OpcionesDeLectura {
  /** Mundo contra el que se valida el estado leido; sin el, solo se valida su forma. */
  readonly mundo?: Mundo;
}

export const ESTADOS_DE_ORDEN_GUARDADA = [
  'pendiente',
  'aplicada',
  'cancelada',
  'rechazada',
] as const;
export type EstadoDeOrdenGuardada = (typeof ESTADOS_DE_ORDEN_GUARDADA)[number];

export interface OrdenGuardada {
  readonly id: IdOrden;
  readonly jugador: IdJugador;
  readonly turnoRecibida: number;
  readonly recibidaEn: number;
  readonly estado: EstadoDeOrdenGuardada;
  readonly turnoAplicada: number | null;
  readonly motivo: string | null;
  readonly orden: Orden;
}

export interface AuditoriaDeResolucion {
  readonly turno: number;
  readonly huellaEntrada: string;
  readonly huellaSalida: string;
  readonly huellaOrdenes: string;
  readonly ordenes: number;
  readonly duracionMs: number;
  readonly versionReglas: number;
  readonly versionNucleo: string;
  readonly resueltaEn: number;
}

export interface OrdenRechazada {
  readonly id: IdOrden;
  readonly motivo: string;
}

/** Todo lo que sale de resolver un turno y hay que guardar junto, o no guardar nada. */
export interface ResolucionDeTurno {
  readonly partida: IdPartida;
  /** El turno que se ha resuelto (N): el estado nuevo es el del turno N + 1. */
  readonly turnoResuelto: number;
  readonly estadoNuevo: EstadoPartida;
  readonly cronicas: Readonly<Record<string, Cronica>>;
  readonly sucesos: readonly Suceso[];
  readonly ordenesAplicadas: readonly IdOrden[];
  readonly ordenesRechazadas: readonly OrdenRechazada[];
  readonly auditoria: Omit<AuditoriaDeResolucion, 'turno' | 'resueltaEn'>;
  readonly proximaResolucion: number | null;
}

export interface Repositorio {
  /** Aplica las migraciones pendientes y devuelve la version final del esquema. */
  migrar(ahora: number): Promise<number>;
  versionDelEsquema(): Promise<number>;

  crearPartida(datos: NuevaPartida, estadoInicial: EstadoPartida, ahora: number): Promise<void>;
  partida(id: IdPartida): Promise<FilaDePartida | null>;
  /** Partidas activas cuya proxima resolucion ya ha llegado, las mas atrasadas primero. */
  partidasPorResolver(hasta: number, limite: number): Promise<readonly FilaDePartida[]>;
  detenerPartida(id: IdPartida, motivo: string): Promise<void>;
  participantes(id: IdPartida): Promise<readonly Participante[]>;

  estado(id: IdPartida, turno: number, opciones?: OpcionesDeLectura): Promise<EstadoPartida | null>;
  ultimoEstado(id: IdPartida, opciones?: OpcionesDeLectura): Promise<EstadoPartida | null>;

  /** Las ordenes entrantes solo se anyaden y cambian de estado: nunca se borran. */
  guardarOrden(id: IdPartida, orden: Orden, ahora: number): Promise<void>;
  ordenesPendientes(id: IdPartida): Promise<readonly OrdenGuardada[]>;
  /** true si estaba pendiente y ahora esta cancelada; false si ya no se podia. */
  cancelarOrden(id: IdPartida, orden: IdOrden, motivo: string): Promise<boolean>;

  /** Las ordenes que entraron al motor en ese turno, en el orden en que se le dieron. */
  ordenesDelTurno(id: IdPartida, turno: number): Promise<readonly OrdenGuardada[]>;
  /** El instante de la proxima resolucion mas cercana de cualquier partida activa, si hay. */
  proximaHora(): Promise<number | null>;

  cronica(id: IdPartida, turno: number, jugador: IdJugador): Promise<Cronica | null>;
  auditoria(id: IdPartida, turno: number): Promise<AuditoriaDeResolucion | null>;

  /**
   * Guarda en una sola transaccion la resolucion del turno `turnoResuelto`: el estado nuevo, las
   * cronicas, los sucesos, la auditoria, el estado de las ordenes y el avance de la partida. Si
   * falla, no queda nada. Lanza `conflicto-de-turno` si la partida ya no esta en ese turno.
   */
  guardarResolucion(resolucion: ResolucionDeTurno, ahora: number): Promise<void>;

  cerrar(): Promise<void>;
}
