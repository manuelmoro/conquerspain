// El servicio de cuentas (ficha T-063 §4.2 a §4.7): enlace magico, sesiones, limites y borrado.
import { ErrorDeApi } from '../api/errores.ts';
import { LimitePorVentana } from '../api/limites.ts';
import type { Cuenta, CuentaConClave, RepositorioDeCuentas } from '../persistencia/cuentas.ts';
import type { Registro } from '../reloj/registro.ts';
import type { EnviadorDeCorreo } from './correo.ts';
import {
  LARGO_MAXIMO,
  claveCorrecta,
  gastarComoSiExistiera,
  hashDeClave,
  problemaDeClave,
} from './contrasenyas.ts';
import {
  CLAVE_MINIMA_BYTES,
  cabeceraSetCookie,
  hashDeToken,
  nuevoIdDeCuenta,
  nuevoToken,
  tokenDeLaCookie,
  valorDeCookie,
  valorEnLaCabecera,
} from './tokens.ts';

export const CADUCIDAD_DEL_ENLACE_MS = 15 * 60 * 1000;
export const CADUCIDAD_DE_LA_SESION_MS = 30 * 24 * 60 * 60 * 1000;
/** Sin «recordarme», la sesion caduca a las 12 horas aunque el navegador siga abierto (T-091). */
export const SESION_SIN_RECORDAR_MS = 12 * 60 * 60 * 1000;
export const CADUCIDAD_DEL_RESTABLECIMIENTO_MS = 30 * 60 * 1000;
/** Fallos seguidos que bloquean la cuenta, y cuanto (T-091 §2). */
export const FALLOS_PARA_BLOQUEAR = 5;
export const BLOQUEO_MS = 15 * 60 * 1000;
const RESTABLECIMIENTOS_POR_CUENTA_Y_HORA = 5;
const HORA_MS = 60 * 60 * 1000;
const ENLACES_POR_CORREO_Y_HORA = 5;
const ENLACES_POR_ORIGEN_Y_HORA = 20;
const ENTRADAS_POR_ORIGEN_Y_MINUTO = 10;
const NOMBRE_MAXIMO = 40;

export interface DependenciasDeCuentas {
  readonly repo: RepositorioDeCuentas;
  readonly correo: EnviadorDeCorreo;
  /** La clave con la que se firma la cookie: al menos 32 bytes. */
  readonly claveDeCookies: Uint8Array;
  /** Direccion publica del sitio, sin barra final: `https://conquerspain.example`. */
  readonly urlPublica: string;
  readonly registro: Registro;
  readonly ahora: () => number;
  /** false solo en desarrollo, sin https. */
  readonly cookieSegura?: boolean;
}

export interface SesionAbierta {
  readonly cuenta: Cuenta;
  /** El valor de la cabecera `set-cookie` que hay que mandar. */
  readonly setCookie: string;
}

function normalizarCorreo(dato: unknown): string {
  const correo = typeof dato === 'string' ? dato.trim().toLowerCase() : '';
  if (correo.length === 0 || correo.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    throw new ErrorDeApi(
      'correo-invalido',
      'El correo no tiene una forma valida: escribelo como nombre@dominio.es.',
    );
  }
  return correo;
}

function nombreVisible(pedido: unknown, correo: string): string {
  const limpio = typeof pedido === 'string' ? pedido.trim().slice(0, NOMBRE_MAXIMO) : '';
  if (limpio.length > 0) return limpio;
  return (correo.split('@')[0] ?? 'jugador').slice(0, NOMBRE_MAXIMO);
}

export class ServicioDeCuentas {
  private readonly enlacesPorOrigen = new LimitePorVentana(ENLACES_POR_ORIGEN_Y_HORA, HORA_MS);
  private readonly entradasPorOrigen = new LimitePorVentana(ENTRADAS_POR_ORIGEN_Y_MINUTO, 60_000);

  constructor(private readonly dep: DependenciasDeCuentas) {
    if (dep.claveDeCookies.length < CLAVE_MINIMA_BYTES) {
      throw new Error(
        `La clave de las cookies tiene ${String(dep.claveDeCookies.length)} bytes y hacen falta al menos ${String(CLAVE_MINIMA_BYTES)}: configura "claveDeCookies" con un valor aleatorio largo.`,
      );
    }
  }

  private limitar(espera: number, que: string): void {
    if (espera > 0) {
      throw new ErrorDeApi(
        'demasiadas-peticiones',
        `Has pedido ${que} demasiadas veces: espera ${String(espera)} s antes de volver a intentarlo.`,
        { 'retry-after': String(espera) },
      );
    }
  }

  /**
   * Pide un enlace de acceso. No dice si el correo tiene cuenta: hace lo mismo exista o no, y el
   * llamante responde siempre igual.
   */
  async pedirEnlace(correoPedido: unknown, nombrePedido: unknown, origen: string): Promise<void> {
    const correo = normalizarCorreo(correoPedido);
    const ahora = this.dep.ahora();
    this.limitar(this.enlacesPorOrigen.usar(origen, ahora), 'enlaces');
    if (
      (await this.dep.repo.enlacesPedidos(correo, ahora - HORA_MS)) >= ENLACES_POR_CORREO_Y_HORA
    ) {
      this.limitar(60, 'enlaces para ese correo');
    }
    const token = nuevoToken();
    const nombre =
      typeof nombrePedido === 'string' && nombrePedido.trim() !== ''
        ? nombreVisible(nombrePedido, correo)
        : null;
    await this.dep.repo.crearEnlace({
      hash: hashDeToken(token),
      correo,
      nombre,
      creadoEn: ahora,
      expiraEn: ahora + CADUCIDAD_DEL_ENLACE_MS,
    });
    await this.dep.correo.enviarEnlace({
      para: correo,
      nombre,
      enlace: `${this.dep.urlPublica}/entrar?token=${token}`,
      caducaEnMinutos: CADUCIDAD_DEL_ENLACE_MS / 60_000,
    });
    this.dep.registro.anotar('info', 'enlace-enviado', {});
  }

  /** Usa un enlace: lo consume, busca o crea la cuenta y abre una sesion. Todo fallo es el mismo. */
  async entrar(tokenPedido: unknown, origen: string): Promise<SesionAbierta> {
    const ahora = this.dep.ahora();
    this.limitar(this.entradasPorOrigen.usar(origen, ahora), 'entrar');
    const invalido = new ErrorDeApi(
      'enlace-invalido',
      'El enlace no vale: puede haber caducado (dura 15 minutos) o haberse usado ya. Pide uno nuevo.',
    );
    if (typeof tokenPedido !== 'string' || tokenPedido.length === 0 || tokenPedido.length > 200) {
      throw invalido;
    }
    const enlace = await this.dep.repo.consumirEnlace(hashDeToken(tokenPedido), ahora);
    if (enlace === null) throw invalido;
    const cuenta = await this.dep.repo.cuentaDeCorreo(
      enlace.correo,
      nuevoIdDeCuenta(),
      nombreVisible(enlace.nombre, enlace.correo),
      ahora,
    );
    await this.dep.repo.confirmarCuenta(cuenta.id, ahora);
    return this.abrirSesion(cuenta, true);
  }

  /** Abre una sesion: con «recordarme», 30 dias y cookie que dura; sin el, 12 horas y de sesion. */
  private async abrirSesion(cuenta: Cuenta, recordar: boolean): Promise<SesionAbierta> {
    const ahora = this.dep.ahora();
    const dura = recordar ? CADUCIDAD_DE_LA_SESION_MS : SESION_SIN_RECORDAR_MS;
    const token = nuevoToken();
    await this.dep.repo.crearSesion({
      hash: hashDeToken(token),
      cuenta: cuenta.id,
      creadaEn: ahora,
      expiraEn: ahora + dura,
    });
    this.dep.registro.anotar('info', 'sesion-abierta', { cuenta: cuenta.id });
    return {
      cuenta,
      setCookie: cabeceraSetCookie(valorDeCookie(token, this.dep.claveDeCookies), {
        maxAgeSegundos: recordar ? dura / 1000 : null,
        segura: this.dep.cookieSegura ?? true,
      }),
    };
  }

  // ——— Contrasenyas (T-091) ———————————————————————————————————————————————————

  /** Manda un enlace de un solo uso a un correo, con su motivo. */
  private async mandarEnlace(
    correo: string,
    nombre: string | null,
    motivo: 'entrar' | 'confirmar',
  ): Promise<void> {
    const ahora = this.dep.ahora();
    const token = nuevoToken();
    await this.dep.repo.crearEnlace({
      hash: hashDeToken(token),
      correo,
      nombre,
      creadoEn: ahora,
      expiraEn: ahora + CADUCIDAD_DEL_ENLACE_MS,
    });
    await this.dep.correo.enviarEnlace({
      para: correo,
      nombre,
      motivo,
      enlace: `${this.dep.urlPublica}/entrar?token=${token}`,
      caducaEnMinutos: CADUCIDAD_DEL_ENLACE_MS / 60_000,
    });
  }

  /**
   * Crea una cuenta con contrasenya y manda el enlace para confirmar el correo. Si el correo ya tenia
   * cuenta no la toca: le avisa por correo, y la respuesta es la misma (no se enumeran cuentas).
   */
  async registrar(
    correoPedido: unknown,
    nombrePedido: unknown,
    clave: unknown,
    origen: string,
  ): Promise<void> {
    const correo = normalizarCorreo(correoPedido);
    const ahora = this.dep.ahora();
    this.limitar(this.enlacesPorOrigen.usar(origen, ahora), 'registros');
    const problema = problemaDeClave(clave, correo);
    if (problema !== null || typeof clave !== 'string') {
      throw new ErrorDeApi('clave-invalida', problema ?? 'Falta la contraseña.');
    }
    if (
      (await this.dep.repo.enlacesPedidos(correo, ahora - HORA_MS)) >= ENLACES_POR_CORREO_Y_HORA
    ) {
      this.limitar(60, 'correos para esa dirección');
    }
    const nombre = nombreVisible(nombrePedido, correo);
    const creada = await this.dep.repo.crearCuentaConClave(
      nuevoIdDeCuenta(),
      correo,
      nombre,
      await hashDeClave(clave),
      ahora,
    );
    if (creada) {
      await this.mandarEnlace(correo, nombre, 'confirmar');
      this.dep.registro.anotar('info', 'cuenta-registrada', {});
      return;
    }
    await this.dep.correo.enviarEnlace({
      para: correo,
      nombre: null,
      motivo: 'ya-registrado',
      enlace: `${this.dep.urlPublica}/`,
      caducaEnMinutos: 0,
    });
  }

  /**
   * Entra con correo y contrasenya. Todo fallo es el mismo, exista o no la cuenta y este o no
   * bloqueada; el correo sin confirmar solo se dice a quien acierta la contrasenya.
   */
  async entrarConClave(
    correoPedido: unknown,
    clave: unknown,
    recordar: unknown,
    origen: string,
  ): Promise<SesionAbierta> {
    const ahora = this.dep.ahora();
    this.limitar(this.entradasPorOrigen.usar(origen, ahora), 'entrar');
    const incorrecto = new ErrorDeApi(
      'credenciales-invalidas',
      'Correo o contraseña incorrectos. Tras cinco fallos seguidos la cuenta se bloquea 15 minutos.',
    );
    if (typeof clave !== 'string' || clave.length === 0 || clave.length > LARGO_MAXIMO) {
      throw incorrecto;
    }
    const correo = normalizarCorreo(correoPedido);
    const cuenta: CuentaConClave | null = await this.dep.repo.cuentaConClave(correo);
    if (cuenta?.clave === null || cuenta === null) {
      await gastarComoSiExistiera(clave);
      throw incorrecto;
    }
    if (cuenta.bloqueadaHasta !== null && cuenta.bloqueadaHasta > ahora) {
      await gastarComoSiExistiera(clave);
      throw incorrecto;
    }
    if (!(await claveCorrecta(clave, cuenta.clave))) {
      await this.dep.repo.anotarFallo(cuenta.id, FALLOS_PARA_BLOQUEAR, ahora + BLOQUEO_MS);
      this.dep.registro.anotar('aviso', 'clave-fallida', { cuenta: cuenta.id });
      throw incorrecto;
    }
    await this.dep.repo.anotarAcierto(cuenta.id);
    if (cuenta.confirmadaEn === null) {
      await this.mandarEnlace(correo, cuenta.nombre, 'confirmar');
      throw new ErrorDeApi(
        'correo-sin-confirmar',
        'Confirma antes tu correo: te hemos mandado otro enlace. Ábrelo y ya podrás entrar.',
      );
    }
    return this.abrirSesion(cuenta, recordar === true);
  }

  /** Pide el enlace para restablecer la contrasenya. Responde igual exista o no la cuenta. */
  async pedirRestablecimiento(correoPedido: unknown, origen: string): Promise<void> {
    const correo = normalizarCorreo(correoPedido);
    const ahora = this.dep.ahora();
    this.limitar(this.enlacesPorOrigen.usar(origen, ahora), 'restablecer');
    const cuenta = await this.dep.repo.cuentaConClave(correo);
    if (cuenta === null) return;
    if (
      (await this.dep.repo.restablecimientosPedidos(cuenta.id, ahora - HORA_MS)) >=
      RESTABLECIMIENTOS_POR_CUENTA_Y_HORA
    ) {
      return;
    }
    const token = nuevoToken();
    await this.dep.repo.crearRestablecimiento({
      hash: hashDeToken(token),
      cuenta: cuenta.id,
      creadoEn: ahora,
      expiraEn: ahora + CADUCIDAD_DEL_RESTABLECIMIENTO_MS,
    });
    await this.dep.correo.enviarEnlace({
      para: correo,
      nombre: cuenta.nombre,
      motivo: 'restablecer',
      enlace: `${this.dep.urlPublica}/?restablecer=${token}`,
      caducaEnMinutos: CADUCIDAD_DEL_RESTABLECIMIENTO_MS / 60_000,
    });
  }

  /**
   * Pone la contrasenya nueva con un enlace de restablecer: lo consume, cierra todas las sesiones
   * anteriores (si alguien tenia una robada, deja de valer) y abre una nueva.
   */
  async restablecer(tokenPedido: unknown, clave: unknown, origen: string): Promise<SesionAbierta> {
    const ahora = this.dep.ahora();
    this.limitar(this.entradasPorOrigen.usar(origen, ahora), 'restablecer');
    // La forma de la contrasenya se mira antes de gastar el enlace.
    const problema = problemaDeClave(clave, '');
    if (problema !== null || typeof clave !== 'string') {
      throw new ErrorDeApi('clave-invalida', problema ?? 'Falta la contraseña.');
    }
    const invalido = new ErrorDeApi(
      'enlace-invalido',
      'El enlace para cambiar la contraseña no vale: dura 30 minutos y solo se usa una vez. Pide otro.',
    );
    if (typeof tokenPedido !== 'string' || tokenPedido.length === 0 || tokenPedido.length > 200) {
      throw invalido;
    }
    const id = await this.dep.repo.consumirRestablecimiento(hashDeToken(tokenPedido), ahora);
    const cuenta = id === null ? null : await this.dep.repo.cuenta(id);
    if (cuenta === null || cuenta.borradaEn !== null) throw invalido;
    await this.dep.repo.ponerClave(cuenta.id, await hashDeClave(clave), ahora);
    await this.dep.repo.revocarSesionesDe(cuenta.id, ahora);
    this.dep.registro.anotar('info', 'clave-restablecida', { cuenta: cuenta.id });
    return this.abrirSesion(cuenta, false);
  }

  /** La cuenta de una cookie valida, firmada, sin caducar ni revocar; si no, null. */
  async autenticar(cabeceraCookie: string | undefined): Promise<string | null> {
    const valor = valorEnLaCabecera(cabeceraCookie);
    if (valor === null) return null;
    const token = tokenDeLaCookie(valor, this.dep.claveDeCookies);
    if (token === null) return null;
    const sesion = await this.dep.repo.sesion(hashDeToken(token));
    if (sesion === null || sesion.revocadaEn !== null || sesion.expiraEn <= this.dep.ahora())
      return null;
    return sesion.cuenta;
  }

  async cuenta(id: string): Promise<Cuenta | null> {
    return this.dep.repo.cuenta(id);
  }

  /** Cierra la sesion de esta cookie; devuelve la cabecera que la borra del navegador. */
  async cerrarSesion(cabeceraCookie: string | undefined): Promise<string> {
    const valor = valorEnLaCabecera(cabeceraCookie);
    const token = valor === null ? null : tokenDeLaCookie(valor, this.dep.claveDeCookies);
    if (token !== null) await this.dep.repo.revocarSesion(hashDeToken(token), this.dep.ahora());
    return this.cookieQueBorra();
  }

  async cerrarTodas(cuenta: string): Promise<number> {
    return this.dep.repo.revocarSesionesDe(cuenta, this.dep.ahora());
  }

  async borrar(cuenta: string): Promise<string> {
    await this.dep.repo.borrarCuenta(cuenta, this.dep.ahora());
    this.dep.registro.anotar('info', 'cuenta-borrada', { cuenta });
    return this.cookieQueBorra();
  }

  private cookieQueBorra(): string {
    return cabeceraSetCookie('', { maxAgeSegundos: 0, segura: this.dep.cookieSegura ?? true });
  }
}
