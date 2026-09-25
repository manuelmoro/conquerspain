// El envio de correo, tras una interfaz (ficha T-063 §4.1): T-064 le pone SMTP; mientras tanto, uno
// en memoria para desarrollo y pruebas.
export interface MensajeDeEnlace {
  readonly para: string;
  readonly nombre: string | null;
  /** La direccion completa a la que tiene que ir el jugador, con el token. */
  readonly enlace: string;
  readonly caducaEnMinutos: number;
}

export interface EnviadorDeCorreo {
  enviarEnlace(mensaje: MensajeDeEnlace): Promise<void>;
}

/** Guarda los mensajes en una lista: se leen desde la prueba o desde una consola de desarrollo. */
export class CorreoEnMemoria implements EnviadorDeCorreo {
  readonly enviados: MensajeDeEnlace[] = [];

  enviarEnlace(mensaje: MensajeDeEnlace): Promise<void> {
    this.enviados.push(mensaje);
    return Promise.resolve();
  }

  /** El token del ultimo mensaje enviado a ese correo, o null. */
  ultimoToken(correo: string): string | null {
    const mensaje = [...this.enviados].reverse().find((m) => m.para === correo);
    if (mensaje === undefined) return null;
    return new URL(mensaje.enlace).searchParams.get('token');
  }
}
