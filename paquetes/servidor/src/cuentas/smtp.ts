// El correo de verdad por SMTP (ficha T-066), sin dependencias: `node:net` y `node:tls`. Una conexion
// por mensaje, con TLS desde el principio (puerto 465) o subida con STARTTLS (587); autenticacion
// PLAIN; texto plano en UTF-8. Si algo falla, lanza: el despachador de avisos reintenta (T-064). Ni
// la clave ni el contenido van nunca a un mensaje de error ni al registro.
import { randomBytes } from 'node:crypto';
import { connect as conectarSinCifrar } from 'node:net';
import type { Socket } from 'node:net';
import { connect as conectarConTls } from 'node:tls';

import type { EnviadorDeCorreo, MensajeDeAviso, MensajeDeEnlace } from './correo.ts';
import { componerAviso, componerEnlace } from './textos-de-correo.ts';

export type SeguridadSmtp = 'tls' | 'starttls' | 'ninguna';

export interface ConfiguracionSmtp {
  readonly host: string;
  readonly puerto: number;
  /** `ninguna` solo se admite contra la propia maquina (las pruebas): la clave iria en claro. */
  readonly seguridad: SeguridadSmtp;
  readonly usuario: string | null;
  readonly clave: string | null;
  /** «ConquerSpain <avisos@ejemplo.es>» o solo la direccion. */
  readonly remitente: string;
  readonly responderA: string | null;
  /** Para el pie de los avisos y la cabecera de baja. */
  readonly urlPublica: string;
  readonly tiempoMaximoMs: number;
  /** Solo pruebas: aceptar el certificado de un servidor local. */
  readonly certificadoDePrueba?: boolean;
}

/** Un error de transporte: el codigo SMTP si lo hubo, y nada del mensaje ni de la clave. */
export class ErrorDeSmtp extends Error {
  constructor(
    mensaje: string,
    readonly codigo: number | null,
  ) {
    super(mensaje);
    this.name = 'ErrorDeSmtp';
  }
}

const LOCALES = new Set(['localhost', '127.0.0.1', '::1']);

/** La direccion de «Nombre <dir>» o la direccion tal cual. */
export function direccionDe(remitente: string): string {
  const m = /<([^>]+)>/.exec(remitente);
  return (m?.[1] ?? remitente).trim();
}

/** Un asunto con acentos, en la forma que entienden todos los clientes (RFC 2047). */
export function codificarCabecera(texto: string): string {
  // Solo ASCII imprimible: va tal cual.
  if (/^[\x20-\x7e]*$/.test(texto)) return texto;
  return `=?UTF-8?B?${Buffer.from(texto, 'utf8').toString('base64')}?=`;
}

/** El cuerpo en base64 en lineas de 76: sin problemas con acentos ni con lineas que empiezan por punto. */
function cuerpoEnBase64(texto: string): string {
  const b64 = Buffer.from(texto.replace(/\r?\n/g, '\r\n'), 'utf8').toString('base64');
  return (b64.match(/.{1,76}/g) ?? []).join('\r\n');
}

export interface CorreoListo {
  readonly para: string;
  readonly asunto: string;
  readonly texto: string;
  /** Cabeceras de mas: la de baja de los avisos. */
  readonly extra: Readonly<Record<string, string>>;
}

/** El mensaje entero, cabeceras y cuerpo, listo para DATA. */
export function componerMensaje(
  c: CorreoListo,
  config: ConfiguracionSmtp,
  fecha: Date,
  id: string,
): string {
  const dominio = direccionDe(config.remitente).split('@')[1] ?? 'localhost';
  const cabeceras: [string, string][] = [
    ['From', config.remitente],
    ['To', c.para],
    ['Subject', codificarCabecera(c.asunto)],
    ['Date', fecha.toUTCString().replace('GMT', '+0000')],
    ['Message-ID', `<${id}@${dominio}>`],
    ['MIME-Version', '1.0'],
    ['Content-Type', 'text/plain; charset=utf-8'],
    ['Content-Transfer-Encoding', 'base64'],
    ...(config.responderA === null ? [] : [['Reply-To', config.responderA] as [string, string]]),
    ...Object.entries(c.extra),
  ];
  return `${cabeceras.map(([k, v]) => `${k}: ${v}`).join('\r\n')}\r\n\r\n${cuerpoEnBase64(c.texto)}`;
}

/** Lee respuestas SMTP enteras (las de varias lineas acaban en «NNN »). */
class Conversacion {
  private bufer = '';
  private esperando: ((r: { codigo: number; texto: string }) => void) | null = null;
  private fallo: Error | null = null;

  constructor(
    private socket: Socket,
    private readonly tiempoMaximoMs: number,
  ) {
    this.escuchar(socket);
  }

  private escuchar(socket: Socket): void {
    socket.setEncoding('utf8');
    socket.on('data', (trozo: string) => {
      this.bufer += trozo;
      this.intentar();
    });
    socket.on('error', (e: Error) => {
      this.fallo = new ErrorDeSmtp(
        `la conexion con el servidor de correo fallo: ${e.message}`,
        null,
      );
      this.intentar();
    });
    socket.on('close', () => {
      this.fallo ??= new ErrorDeSmtp('el servidor de correo cerro la conexion', null);
      this.intentar();
    });
  }

  private intentar(): void {
    if (this.esperando === null) return;
    const lineas = this.bufer.split('\r\n');
    const fin = lineas.findIndex((l) => /^\d{3} /.test(l) || /^\d{3}$/.test(l));
    if (fin >= 0) {
      const texto = lineas.slice(0, fin + 1).join('\n');
      this.bufer = lineas.slice(fin + 1).join('\r\n');
      const ultima = lineas[fin] ?? '';
      const resolver = this.esperando;
      this.esperando = null;
      resolver({ codigo: Number(ultima.slice(0, 3)), texto });
      return;
    }
    if (this.fallo !== null) {
      const resolver = this.esperando;
      this.esperando = null;
      resolver({ codigo: -1, texto: this.fallo.message });
    }
  }

  /** La siguiente respuesta; lanza si no es la esperada o si se agota el tiempo. */
  async respuesta(esperado: number, paso: string): Promise<string> {
    const r = await new Promise<{ codigo: number; texto: string }>((resolver, rechazar) => {
      const reloj = setTimeout(() => {
        this.esperando = null;
        rechazar(new ErrorDeSmtp(`el servidor de correo no contesto a tiempo (${paso})`, null));
      }, this.tiempoMaximoMs);
      this.esperando = (x) => {
        clearTimeout(reloj);
        resolver(x);
      };
      this.intentar();
    });
    if (r.codigo === -1) throw new ErrorDeSmtp(`${r.texto} (${paso})`, null);
    if (Math.floor(r.codigo / 100) !== Math.floor(esperado / 100)) {
      // Solo la primera linea y sin datos nuestros: el servidor no repite la clave.
      const primera = (r.texto.split('\n')[0] ?? '').slice(0, 200);
      throw new ErrorDeSmtp(`el servidor de correo rechazo ${paso}: ${primera}`, r.codigo);
    }
    return r.texto;
  }

  enviar(linea: string): void {
    this.socket.write(`${linea}\r\n`);
  }

  /** Tras STARTTLS, la conversacion sigue por el canal cifrado. */
  cambiarA(socket: Socket): void {
    this.socket = socket;
    this.bufer = '';
    this.escuchar(socket);
  }

  cerrar(): void {
    this.socket.end();
  }
}

export class CorreoPorSmtp implements EnviadorDeCorreo {
  constructor(
    private readonly config: ConfiguracionSmtp,
    private readonly ahora: () => number = Date.now,
  ) {
    if (config.seguridad === 'ninguna' && !LOCALES.has(config.host)) {
      throw new Error(
        'SMTP sin cifrar solo se admite contra la propia maquina: usa SMTP_SEGURIDAD=tls (puerto 465) o starttls (587).',
      );
    }
  }

  enviarEnlace(mensaje: MensajeDeEnlace): Promise<void> {
    const c = componerEnlace(mensaje);
    return this.entregar({ para: mensaje.para, asunto: c.asunto, texto: c.texto, extra: {} });
  }

  enviarAviso(mensaje: MensajeDeAviso): Promise<void> {
    const c = componerAviso(mensaje, this.config.urlPublica);
    return this.entregar({
      para: mensaje.para,
      asunto: c.asunto,
      texto: c.texto,
      extra: { 'List-Unsubscribe': `<${this.config.urlPublica}>` },
    });
  }

  private conectar(): Promise<Socket> {
    const { host, puerto, seguridad } = this.config;
    return new Promise((resolver, rechazar) => {
      const socket =
        seguridad === 'tls'
          ? conectarConTls({
              host,
              port: puerto,
              servername: host,
              rejectUnauthorized: this.config.certificadoDePrueba !== true,
            })
          : conectarSinCifrar({ host, port: puerto });
      const reloj = setTimeout(() => {
        socket.destroy();
        rechazar(new ErrorDeSmtp('no se pudo conectar con el servidor de correo a tiempo', null));
      }, this.config.tiempoMaximoMs);
      socket.once(seguridad === 'tls' ? 'secureConnect' : 'connect', () => {
        clearTimeout(reloj);
        resolver(socket);
      });
      socket.once('error', (e: Error) => {
        clearTimeout(reloj);
        rechazar(
          new ErrorDeSmtp(`no se pudo conectar con el servidor de correo: ${e.message}`, null),
        );
      });
    });
  }

  private subirATls(socket: Socket): Promise<Socket> {
    return new Promise((resolver, rechazar) => {
      socket.removeAllListeners('data');
      const seguro = conectarConTls({
        socket,
        servername: this.config.host,
        rejectUnauthorized: this.config.certificadoDePrueba !== true,
      });
      seguro.once('secureConnect', () => {
        resolver(seguro);
      });
      seguro.once('error', (e: Error) => {
        rechazar(new ErrorDeSmtp(`no se pudo cifrar la conexion (STARTTLS): ${e.message}`, null));
      });
    });
  }

  private async entregar(c: CorreoListo): Promise<void> {
    const { config } = this;
    const socket = await this.conectar();
    const conv = new Conversacion(socket, config.tiempoMaximoMs);
    const yo = direccionDe(config.remitente).split('@')[1] ?? 'localhost';
    try {
      await conv.respuesta(220, 'el saludo');
      conv.enviar(`EHLO ${yo}`);
      const capacidades = await conv.respuesta(250, 'EHLO');
      if (config.seguridad === 'starttls') {
        if (!/STARTTLS/i.test(capacidades)) {
          throw new ErrorDeSmtp('el servidor de correo no ofrece STARTTLS', null);
        }
        conv.enviar('STARTTLS');
        await conv.respuesta(220, 'STARTTLS');
        conv.cambiarA(await this.subirATls(socket));
        conv.enviar(`EHLO ${yo}`);
        await conv.respuesta(250, 'EHLO tras STARTTLS');
      }
      if (config.usuario !== null && config.clave !== null) {
        const credencial = Buffer.from(`\0${config.usuario}\0${config.clave}`, 'utf8').toString(
          'base64',
        );
        conv.enviar(`AUTH PLAIN ${credencial}`);
        await conv.respuesta(235, 'la autenticacion');
      }
      conv.enviar(`MAIL FROM:<${direccionDe(config.remitente)}>`);
      await conv.respuesta(250, 'el remitente');
      conv.enviar(`RCPT TO:<${c.para}>`);
      await conv.respuesta(250, 'el destinatario');
      conv.enviar('DATA');
      await conv.respuesta(354, 'DATA');
      const id = `${String(this.ahora())}.${randomBytes(8).toString('hex')}`;
      conv.enviar(`${componerMensaje(c, config, new Date(this.ahora()), id)}\r\n.`);
      await conv.respuesta(250, 'el mensaje');
      conv.enviar('QUIT');
    } finally {
      conv.cerrar();
    }
  }
}
