// El transporte SMTP (ficha T-066) contra un servidor falso local: la conversacion entera con TLS y
// con STARTTLS, el mensaje que llega, los errores que hacen reintentar y que la clave no se escapa.
import { createServer } from 'node:net';
import type { Server, Socket } from 'node:net';
import { TLSSocket, createServer as crearServidorTls } from 'node:tls';

import { afterEach, describe, expect, it } from 'vitest';

import { CERTIFICADO_DE_PRUEBA, CLAVE_DE_PRUEBA } from './smtp-certificado-de-prueba.ts';
import { CorreoPorSmtp, ErrorDeSmtp, codificarCabecera, direccionDe } from './smtp.ts';
import type { ConfiguracionSmtp, SeguridadSmtp } from './smtp.ts';

interface Recibido {
  readonly ordenes: string[];
  datos: string;
}

interface Comportamiento {
  /** Lo que contesta a RCPT TO; por defecto, 250. */
  readonly rcpt?: string;
  /** No contesta nunca al saludo. */
  readonly mudo?: boolean;
}

/** Un servidor SMTP minimo que apunta lo que le dicen. */
function servidorFalso(
  seguridad: SeguridadSmtp,
  c: Comportamiento = {},
): Promise<{ servidor: Server; puerto: number; recibido: Recibido }> {
  const recibido: Recibido = { ordenes: [], datos: '' };
  const atender = (socket: Socket): void => {
    if (c.mudo === true) return;
    let enDatos = false;
    let bufer = '';
    const conversar = (s: Socket): void => {
      s.setEncoding('utf8');
      s.on('data', (trozo: string) => {
        bufer += trozo;
        for (;;) {
          if (enDatos) {
            const fin = bufer.indexOf('\r\n.\r\n');
            if (fin < 0) return;
            recibido.datos = bufer.slice(0, fin);
            bufer = bufer.slice(fin + 5);
            enDatos = false;
            s.write('250 en cola\r\n');
            continue;
          }
          const corte = bufer.indexOf('\r\n');
          if (corte < 0) return;
          const linea = bufer.slice(0, corte);
          bufer = bufer.slice(corte + 2);
          recibido.ordenes.push(linea);
          const orden = linea.split(' ')[0]?.toUpperCase() ?? '';
          if (orden === 'EHLO')
            s.write(
              seguridad === 'starttls' && !(s instanceof TLSSocket)
                ? '250-localhost\r\n250 STARTTLS\r\n'
                : '250-localhost\r\n250 AUTH PLAIN\r\n',
            );
          else if (orden === 'STARTTLS') {
            s.write('220 adelante\r\n');
            s.removeAllListeners('data');
            const seguro = new TLSSocket(s, {
              isServer: true,
              cert: CERTIFICADO_DE_PRUEBA,
              key: CLAVE_DE_PRUEBA,
            });
            conversar(seguro);
            return;
          } else if (orden === 'AUTH') s.write('235 dentro\r\n');
          else if (orden === 'MAIL') s.write('250 vale\r\n');
          else if (orden === 'RCPT') s.write(`${c.rcpt ?? '250 vale'}\r\n`);
          else if (orden === 'DATA') {
            enDatos = true;
            s.write('354 adelante\r\n');
          } else if (orden === 'QUIT') {
            s.write('221 adios\r\n');
            s.end();
          }
        }
      });
    };
    conversar(socket);
    socket.write('220 localhost SMTP de prueba\r\n');
  };
  const servidor =
    seguridad === 'tls'
      ? crearServidorTls({ cert: CERTIFICADO_DE_PRUEBA, key: CLAVE_DE_PRUEBA }, atender)
      : createServer(atender);
  return new Promise((resolver) => {
    servidor.listen(0, '127.0.0.1', () => {
      const direccion = servidor.address();
      const puerto = typeof direccion === 'object' && direccion !== null ? direccion.port : 0;
      resolver({ servidor, puerto, recibido });
    });
  });
}

const abiertos: Server[] = [];
afterEach(() => {
  for (const s of abiertos.splice(0)) s.close();
});

function configuracion(seguridad: SeguridadSmtp, puerto: number): ConfiguracionSmtp {
  return {
    host: 'localhost',
    puerto,
    seguridad,
    usuario: 'avisos@ejemplo.es',
    clave: 'clave-muy-secreta',
    remitente: 'ConquerSpain <avisos@ejemplo.es>',
    responderA: null,
    urlPublica: 'https://juego.ejemplo.es',
    tiempoMaximoMs: 2000,
    certificadoDePrueba: true,
  };
}

/** El cuerpo del mensaje recibido, ya descodificado. */
function cuerpo(datos: string): string {
  const [, b64 = ''] = datos.split('\r\n\r\n');
  return Buffer.from(b64.replace(/\r\n/g, ''), 'base64').toString('utf8');
}

describe('el correo por SMTP', () => {
  for (const seguridad of ['starttls', 'tls'] as const) {
    it(`entrega un enlace con ${seguridad}: autentica, y el texto llega con sus acentos`, async () => {
      const f = await servidorFalso(seguridad);
      abiertos.push(f.servidor);
      const correo = new CorreoPorSmtp(configuracion(seguridad, f.puerto), () => 0);
      await correo.enviarEnlace({
        para: 'jugadora@ejemplo.es',
        nombre: 'Urraca',
        motivo: 'restablecer',
        enlace: 'https://juego.ejemplo.es/?restablecer=abc',
        caducaEnMinutos: 30,
      });
      const auth = f.recibido.ordenes.find((o) => o.startsWith('AUTH PLAIN '));
      expect(Buffer.from(auth?.slice('AUTH PLAIN '.length) ?? '', 'base64').toString()).toBe(
        '\0avisos@ejemplo.es\0clave-muy-secreta',
      );
      expect(f.recibido.ordenes).toContain('MAIL FROM:<avisos@ejemplo.es>');
      expect(f.recibido.ordenes).toContain('RCPT TO:<jugadora@ejemplo.es>');
      expect(f.recibido.datos).toContain(
        `Subject: ${codificarCabecera('Pon una contraseña nueva en ConquerSpain')}`,
      );
      expect(f.recibido.datos).toContain('Content-Type: text/plain; charset=utf-8');
      const texto = cuerpo(f.recibido.datos);
      expect(texto).toContain('Hola, Urraca:');
      expect(texto).toContain('https://juego.ejemplo.es/?restablecer=abc');
      expect(texto).toContain('El enlace vale 30 minutos');
      if (seguridad === 'starttls') expect(f.recibido.ordenes).toContain('STARTTLS');
    });
  }

  it('un aviso lleva la baja: la cabecera y un pie que dice dónde cambiarlo', async () => {
    const f = await servidorFalso('starttls');
    abiertos.push(f.servidor);
    await new CorreoPorSmtp(configuracion('starttls', f.puerto)).enviarAviso({
      para: 'jugadora@ejemplo.es',
      asunto: 'Turno 4 resuelto',
      texto: 'Tu pan se acaba en 2 turnos.',
    });
    expect(f.recibido.datos).toContain('List-Unsubscribe: <https://juego.ejemplo.es>');
    expect(cuerpo(f.recibido.datos)).toMatch(/Para dejar de recibir estos avisos.*«Tu casa»/);
  });

  it('si el servidor rechaza, lanza (el despachador reintenta) y no dice la clave', async () => {
    const f = await servidorFalso('starttls', { rcpt: '550 no existe ese buzon' });
    abiertos.push(f.servidor);
    const error = await new CorreoPorSmtp(configuracion('starttls', f.puerto))
      .enviarAviso({ para: 'nadie@ejemplo.es', asunto: 'x', texto: 'y' })
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ErrorDeSmtp);
    if (!(error instanceof ErrorDeSmtp)) return;
    expect(error.codigo).toBe(550);
    expect(error.message).toContain('el destinatario');
    expect(error.message).not.toContain('clave-muy-secreta');
  });

  it('si el servidor no contesta, se rinde a tiempo y lanza', async () => {
    const f = await servidorFalso('starttls', { mudo: true });
    abiertos.push(f.servidor);
    const config = { ...configuracion('starttls', f.puerto), tiempoMaximoMs: 200 };
    await expect(
      new CorreoPorSmtp(config).enviarAviso({ para: 'a@ejemplo.es', asunto: 'x', texto: 'y' }),
    ).rejects.toThrow(/no contesto a tiempo/);
  });

  it('sin cifrar solo contra la propia máquina: la clave no viaja en claro', () => {
    expect(
      () => new CorreoPorSmtp({ ...configuracion('ninguna', 25), host: 'smtp.ejemplo.es' }),
    ).toThrow(/sin cifrar/);
    expect(() => new CorreoPorSmtp(configuracion('ninguna', 25))).not.toThrow();
  });

  it('las direcciones y los asuntos se escriben como manda el correo', () => {
    expect(direccionDe('ConquerSpain <avisos@ejemplo.es>')).toBe('avisos@ejemplo.es');
    expect(direccionDe('avisos@ejemplo.es')).toBe('avisos@ejemplo.es');
    expect(codificarCabecera('Turno 4')).toBe('Turno 4');
    expect(codificarCabecera('Año 1')).toMatch(/^=\?UTF-8\?B\?.+\?=$/);
  });
});
