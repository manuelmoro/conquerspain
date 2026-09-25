// El adaptador de `node:http` (ficha T-062 §4.1): convierte una peticion de Node en `PeticionHttp`,
// llama a la API y escribe la respuesta. Lo unico que hace es traducir; las reglas estan en la API.
import { createServer } from 'node:http';
import type { IncomingMessage, Server } from 'node:http';
import type { AddressInfo } from 'node:net';

import { CUERPO_MAXIMO_BYTES } from './limites.ts';
import type { PeticionHttp, RespuestaHttp } from './tipos.ts';

export interface ServidorHttp {
  readonly puerto: number;
  cerrar(): Promise<void>;
}

export interface OpcionesDeHttp {
  /** 0 pide uno libre al sistema (para las pruebas). */
  readonly puerto?: number;
  readonly anfitrion?: string;
}

/** Lee el cuerpo sin pasar de un byte mas que el limite: la API rechaza lo que se pase. */
async function leerCuerpo(peticion: IncomingMessage): Promise<string | null> {
  const trozos: Buffer[] = [];
  let total = 0;
  for await (const trozo of peticion) {
    const buffer = Buffer.isBuffer(trozo) ? trozo : Buffer.from(String(trozo));
    if (total <= CUERPO_MAXIMO_BYTES) trozos.push(buffer);
    total += buffer.length;
  }
  return total === 0
    ? null
    : Buffer.concat(trozos)
        .subarray(0, CUERPO_MAXIMO_BYTES + 1)
        .toString('utf8');
}

export async function servirHttp(
  manejar: (peticion: PeticionHttp) => Promise<RespuestaHttp>,
  opciones: OpcionesDeHttp = {},
): Promise<ServidorHttp> {
  const servidor: Server = createServer((entrada, salida) => {
    void (async () => {
      const cabeceras: Record<string, string> = {};
      for (const [nombre, valor] of Object.entries(entrada.headers)) {
        if (typeof valor === 'string') cabeceras[nombre.toLowerCase()] = valor;
      }
      const ruta = new URL(entrada.url ?? '/', 'http://servidor.local').pathname;
      const respuesta = await manejar({
        metodo: (entrada.method ?? 'GET').toUpperCase(),
        ruta,
        cabeceras,
        cuerpo: await leerCuerpo(entrada),
        origen: entrada.socket.remoteAddress ?? 'desconocido',
      });
      salida.writeHead(respuesta.estado, respuesta.cabeceras);
      if (respuesta.flujo !== undefined) {
        const parar = respuesta.flujo((texto) => {
          salida.write(texto);
        });
        salida.once('close', parar);
        return;
      }
      salida.end(JSON.stringify(respuesta.cuerpo));
    })();
  });
  await new Promise<void>((listo, fallo) => {
    servidor.once('error', fallo);
    servidor.listen(opciones.puerto ?? 0, opciones.anfitrion ?? '127.0.0.1', listo);
  });
  const direccion = servidor.address() as AddressInfo;
  return {
    puerto: direccion.port,
    cerrar: () =>
      new Promise<void>((listo, fallo) => {
        // Los flujos de eventos no acaban solos: se cortan al cerrar.
        servidor.closeAllConnections();
        servidor.close((error) => {
          if (error === undefined) listo();
          else fallo(error);
        });
      }),
  };
}
