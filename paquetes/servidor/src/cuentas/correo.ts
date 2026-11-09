// El envio de correo, tras una interfaz (ficha T-063 §4.1): T-064 le pone SMTP; mientras tanto, uno
// en memoria para desarrollo y pruebas.
/** Para que es el correo (T-091): entrar, confirmar la cuenta, restablecer o un registro repetido. */
export type MotivoDeEnlace = 'entrar' | 'confirmar' | 'restablecer' | 'ya-registrado';

export interface MensajeDeEnlace {
  readonly para: string;
  readonly nombre: string | null;
  /** Por defecto, entrar. */
  readonly motivo?: MotivoDeEnlace;
  /** La direccion completa a la que tiene que ir el jugador, con el token. */
  readonly enlace: string;
  readonly caducaEnMinutos: number;
}

/** Un aviso de resolucion (T-064): texto plano, que se lee sin abrir el juego. */
export interface MensajeDeAviso {
  readonly para: string;
  readonly asunto: string;
  readonly texto: string;
}

export interface EnviadorDeCorreo {
  enviarEnlace(mensaje: MensajeDeEnlace): Promise<void>;
  /** Lanza si no se pudo entregar: el despachador reintenta. */
  enviarAviso(mensaje: MensajeDeAviso): Promise<void>;
}

/** Guarda los mensajes en una lista: se leen desde la prueba o desde una consola de desarrollo. */
export class CorreoEnMemoria implements EnviadorDeCorreo {
  readonly enviados: MensajeDeEnlace[] = [];
  readonly avisos: MensajeDeAviso[] = [];
  /** Cuantos avisos seguidos fallaran, para probar los reintentos. */
  fallosPendientes = 0;

  enviarAviso(mensaje: MensajeDeAviso): Promise<void> {
    if (this.fallosPendientes > 0) {
      this.fallosPendientes -= 1;
      return Promise.reject(new Error('el servidor de correo no responde'));
    }
    this.avisos.push(mensaje);
    return Promise.resolve();
  }

  enviarEnlace(mensaje: MensajeDeEnlace): Promise<void> {
    this.enviados.push(mensaje);
    return Promise.resolve();
  }

  /** El token del ultimo mensaje enviado a ese correo, o null. */
  ultimoToken(correo: string): string | null {
    const mensaje = [...this.enviados].reverse().find((m) => m.para === correo);
    if (mensaje === undefined) return null;
    const parametros = new URL(mensaje.enlace).searchParams;
    return parametros.get('token') ?? parametros.get('restablecer');
  }
}

/**
 * En desarrollo, el correo se escribe en la consola: asi se puede entrar sin servidor de correo
 * (el transporte real es T-066). Nunca en produccion: el enlace da acceso a la cuenta.
 */
export class CorreoPorConsola implements EnviadorDeCorreo {
  constructor(private readonly escribir: (linea: string) => void = console.log) {}

  enviarEnlace(mensaje: MensajeDeEnlace): Promise<void> {
    const motivo = mensaje.motivo ?? 'entrar';
    this.escribir(`[correo] Enlace para ${mensaje.para} (${motivo}): ${mensaje.enlace}`);
    return Promise.resolve();
  }

  enviarAviso(mensaje: MensajeDeAviso): Promise<void> {
    this.escribir(`[correo] ${mensaje.asunto} → ${mensaje.para}`);
    return Promise.resolve();
  }
}
