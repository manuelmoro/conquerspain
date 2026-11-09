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

/** Lo que hace falta para entrar con contrasenya (T-091). Nunca sale del servidor. */
export interface CuentaConClave extends Cuenta {
  /** El hash scrypt, o null si la cuenta solo entra por enlace. */
  readonly clave: string | null;
  readonly confirmadaEn: number | null;
  readonly fallos: number;
  readonly bloqueadaHasta: number | null;
}

export interface RestablecimientoNuevo {
  readonly hash: string;
  readonly cuenta: string;
  readonly creadoEn: number;
  readonly expiraEn: number;
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

  // ——— Contrasenyas (T-091) ———
  /** La cuenta viva de un correo, con lo de entrar con contrasenya; null si no hay. */
  cuentaConClave(correo: string): Promise<CuentaConClave | null>;
  /** Crea una cuenta sin confirmar con su contrasenya; false si el correo ya tenia cuenta. */
  crearCuentaConClave(
    id: string,
    correo: string,
    nombre: string,
    clave: string,
    ahora: number,
  ): Promise<boolean>;
  /** El correo de la cuenta queda confirmado (si no lo estaba ya). */
  confirmarCuenta(id: string, ahora: number): Promise<void>;
  /** Un fallo mas; al llegar a `maximo`, la cuenta queda bloqueada hasta `bloqueoHasta`. */
  anotarFallo(id: string, maximo: number, bloqueoHasta: number): Promise<void>;
  anotarAcierto(id: string): Promise<void>;
  /** Contrasenya nueva: sin fallos ni bloqueo, y con el correo confirmado. */
  ponerClave(id: string, clave: string, ahora: number): Promise<void>;
  crearRestablecimiento(restablecimiento: RestablecimientoNuevo): Promise<void>;
  /** Consume **de forma atomica** un restablecimiento vivo; devuelve su cuenta o null. */
  consumirRestablecimiento(hash: string, ahora: number): Promise<string | null>;
  restablecimientosPedidos(cuenta: string, desde: number): Promise<number>;

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
