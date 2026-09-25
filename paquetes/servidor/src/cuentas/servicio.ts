// El servicio de cuentas (ficha T-063 §4.2 a §4.7): enlace magico, sesiones, limites y borrado.
import { ErrorDeApi } from '../api/errores.ts';
import { LimitePorVentana } from '../api/limites.ts';
import type { Cuenta, RepositorioDeCuentas } from '../persistencia/cuentas.ts';
import type { Registro } from '../reloj/registro.ts';
import type { EnviadorDeCorreo } from './correo.ts';
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
    const token = nuevoToken();
    await this.dep.repo.crearSesion({
      hash: hashDeToken(token),
      cuenta: cuenta.id,
      creadaEn: ahora,
      expiraEn: ahora + CADUCIDAD_DE_LA_SESION_MS,
    });
    this.dep.registro.anotar('info', 'sesion-abierta', { cuenta: cuenta.id });
    return {
      cuenta,
      setCookie: cabeceraSetCookie(valorDeCookie(token, this.dep.claveDeCookies), {
        maxAgeSegundos: CADUCIDAD_DE_LA_SESION_MS / 1000,
        segura: this.dep.cookieSegura ?? true,
      }),
    };
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
