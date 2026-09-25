// La parte del almacen que guarda cuentas, enlaces de acceso y sesiones (ficha T-063). Lo implementa
// `RepositorioSqlite`; el servicio de cuentas solo conoce esta interfaz.
import type { IdJugador, IdPartida } from '@conquer/nucleo';

export interface Cuenta {
  readonly id: string;
  readonly correo: string;
  readonly nombre: string;
  readonly creadaEn: number;
  readonly borradaEn: number | null;
}

export interface EnlaceNuevo {
  readonly hash: string;
  readonly correo: string;
  readonly nombre: string | null;
  readonly creadoEn: number;
  readonly expiraEn: number;
}

export interface SesionNueva {
  readonly hash: string;
  readonly cuenta: string;
  readonly creadaEn: number;
  readonly expiraEn: number;
}

export interface SesionGuardada {
  readonly cuenta: string;
  readonly expiraEn: number;
  readonly revocadaEn: number | null;
}

export interface RepositorioDeCuentas {
  crearEnlace(enlace: EnlaceNuevo): Promise<void>;
  /**
   * Consume un enlace **de forma atomica**: solo si existe, no se ha usado y no ha caducado. Devuelve
   * el correo y el nombre pedido, o null; con dos usos a la vez, solo uno lo consigue.
   */
  consumirEnlace(
    hash: string,
    ahora: number,
  ): Promise<{ readonly correo: string; readonly nombre: string | null } | null>;
  /** Cuantos enlaces se han pedido para ese correo desde ese instante. */
  enlacesPedidos(correo: string, desde: number): Promise<number>;
  /** La cuenta de un correo, creandola con `id` y `nombre` si no existia. */
  cuentaDeCorreo(correo: string, id: string, nombre: string, ahora: number): Promise<Cuenta>;
  cuenta(id: string): Promise<Cuenta | null>;

  crearSesion(sesion: SesionNueva): Promise<void>;
  sesion(hash: string): Promise<SesionGuardada | null>;
  revocarSesion(hash: string, ahora: number): Promise<boolean>;
  revocarSesionesDe(cuenta: string, ahora: number): Promise<number>;

  /**
   * Borra la cuenta: anonimiza el correo y el nombre, revoca sus sesiones, invalida sus enlaces y
   * deja `participante.cuenta` a NULL. No toca ninguna partida.
   */
  borrarCuenta(id: string, ahora: number): Promise<void>;
  /** Enlaza una cuenta con un jugador de una partida (lo usara el alta de T-065). */
  unirCuenta(partida: IdPartida, jugador: IdJugador, cuenta: string): Promise<void>;
}
