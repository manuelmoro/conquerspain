// El cliente compilado, servido por el mismo proceso que la API (despliegue, docs/07 §7.8): todo lo
// que no empieza por `/api/` es un fichero de `dist-web`, y una ruta sin fichero devuelve la pagina
// principal, que es una aplicacion de una sola pagina. Nada sale de fuera de la carpeta.
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';

const TIPOS: Readonly<Record<string, string>> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

export interface FicheroServido {
  readonly estado: number;
  readonly cabeceras: Readonly<Record<string, string>>;
  readonly cuerpo: Buffer;
}

/**
 * El fichero de la ruta dentro de la carpeta, o la pagina principal. Los de `assets/` llevan huella
 * en el nombre y se guardan un anyo; la pagina principal, nunca, para que una version nueva llegue ya.
 */
export async function ficheroEstatico(carpeta: string, ruta: string): Promise<FicheroServido> {
  const limpia = normalize(decodeURIComponent(ruta)).replace(/^([/\\])+/, '');
  const pedido = join(carpeta, limpia);
  const dentro =
    pedido === carpeta || pedido.startsWith(carpeta.endsWith(sep) ? carpeta : carpeta + sep);
  // Una ruta sin extension es una pagina: la de su carpeta si la hay (la guia, T-127, en `/guia/`) o,
  // si no, la del juego, que se encarga de sus rutas.
  const candidatos =
    !dentro || limpia === ''
      ? []
      : extname(limpia) !== ''
        ? [pedido]
        : [join(pedido, 'index.html')];
  for (const fichero of [...candidatos, join(carpeta, 'index.html')]) {
    try {
      const cuerpo = await readFile(fichero);
      const tipo = TIPOS[extname(fichero)] ?? 'application/octet-stream';
      const conHuella = fichero.includes(`${sep}assets${sep}`);
      return {
        estado: 200,
        cabeceras: {
          'content-type': tipo,
          'cache-control': conHuella ? 'public, max-age=31536000, immutable' : 'no-cache',
          'x-content-type-options': 'nosniff',
        },
        cuerpo,
      };
    } catch {
      // No esta: el siguiente candidato (la pagina principal).
    }
  }
  return {
    estado: 404,
    cabeceras: { 'content-type': 'text/plain; charset=utf-8' },
    cuerpo: Buffer.from(
      'No hay cliente compilado: ejecuta `npm run cliente:tamano`, que lo construye.',
    ),
  };
}
