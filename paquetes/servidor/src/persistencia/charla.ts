// La parte del almacen que guarda la charla de cada partida (ficha T-129). La implementa
// `RepositorioSqlite`.
import type { IdJugador, IdPartida } from '@conquer/nucleo';

export interface MensajeGuardado {
  readonly id: number;
  readonly jugador: IdJugador;
  /** El turno en que se escribio: la charla se lee junto a la cronica. */
  readonly turno: number;
  readonly texto: string;
  readonly enviadoEn: number;
}

export interface RepositorioDeCharla {
  /** Guarda un mensaje con el turno en que esta la partida; devuelve el mensaje guardado. */
  guardarMensaje(
    partida: IdPartida,
    jugador: IdJugador,
    texto: string,
    ahora: number,
  ): Promise<MensajeGuardado>;
  /** Los `limite` mensajes anteriores a `antesDe` (o los ultimos), del mas viejo al mas nuevo. */
  mensajes(
    partida: IdPartida,
    antesDe: number | null,
    limite: number,
  ): Promise<readonly MensajeGuardado[]>;
  /** El ultimo mensaje leido por el jugador (0 si ninguno). */
  ultimoLeido(partida: IdPartida, jugador: IdJugador): Promise<number>;
  /** Da por leido hasta `hasta`; nunca hacia atras. */
  marcarLeidos(partida: IdPartida, jugador: IdJugador, hasta: number): Promise<void>;
  /** Cuantos mensajes de otros hay despues del ultimo leido. */
  sinLeer(partida: IdPartida, jugador: IdJugador): Promise<number>;
}
