// La parte del almacen que guarda la cola de correos de aviso y las preferencias (ficha T-064). La
// implementa `RepositorioSqlite`; el despachador solo conoce esta interfaz.
import type { IdJugador, IdPartida } from '@conquer/nucleo';

export const MODOS_DE_AVISO = ['cada-turno', 'diario', 'nada'] as const;
export type ModoDeAviso = (typeof MODOS_DE_AVISO)[number];

export interface ClaveDeAviso {
  readonly partida: IdPartida;
  readonly turno: number;
  readonly jugador: IdJugador;
}

export interface AvisoPendiente extends ClaveDeAviso {
  readonly correo: string;
  readonly nombrePartida: string;
  readonly intervaloSegundos: number;
  readonly creadoEn: number;
  readonly intentos: number;
}

export interface RepositorioDeAvisos {
  /** Los avisos pendientes cuyo intento ya toca, de cuentas que siguen existiendo. */
  avisosPendientes(ahora: number): Promise<readonly AvisoPendiente[]>;
  /**
   * Reclama los avisos para mandarlos: los aparta hasta `hasta` si seguian pendientes y listos.
   * Devuelve los que consiguio; dos despachadores a la vez no reclaman el mismo.
   */
  reclamarAvisos(
    claves: readonly ClaveDeAviso[],
    hasta: number,
    ahora: number,
  ): Promise<readonly ClaveDeAviso[]>;
  marcarAvisos(
    claves: readonly ClaveDeAviso[],
    estado: 'enviado' | 'descartado' | 'fallido',
    ahora: number,
  ): Promise<void>;
  reprogramarAvisos(
    claves: readonly ClaveDeAviso[],
    intentos: number,
    siguiente: number,
  ): Promise<void>;
  /** El ultimo correo que se le mando a ese jugador en esa partida, o null. */
  ultimoEnvio(partida: IdPartida, jugador: IdJugador): Promise<number | null>;
  preferencia(partida: IdPartida, jugador: IdJugador): Promise<ModoDeAviso | null>;
  fijarPreferencia(partida: IdPartida, jugador: IdJugador, modo: ModoDeAviso): Promise<void>;
}
