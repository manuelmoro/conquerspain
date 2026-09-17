// Descarga verificada de las fuentes del mapa.
//
// Cada fuente lleva su huella esperada: si el fichero de origen cambia rio arriba, el proceso se
// detiene en vez de generar un mapa distinto sin avisar. Con la cache completa, todo el proceso
// funciona sin conexion.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface Fuente {
  readonly id: string;
  readonly archivo: string;
  readonly url: string;
  readonly sha256: string;
  readonly uso: string;
}

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
export const CACHE = join(RAIZ, 'cache');

export function fuentes(): Fuente[] {
  const texto = readFileSync(join(RAIZ, 'fuentes.json'), 'utf8');
  return (JSON.parse(texto) as { fuentes: Fuente[] }).fuentes;
}

function huellaDe(contenido: Buffer): string {
  return createHash('sha256').update(contenido).digest('hex');
}

/** Devuelve el contenido de una fuente, descargandola solo si no esta en la cache. */
export async function obtener(fuente: Fuente): Promise<string> {
  mkdirSync(CACHE, { recursive: true });
  const ruta = join(CACHE, fuente.archivo);

  if (!existsSync(ruta)) {
    console.log(`  descargando ${fuente.id} (${fuente.url})`);
    const respuesta = await fetch(fuente.url);
    if (!respuesta.ok) {
      throw new Error(
        `No se pudo descargar ${fuente.id}: ${String(respuesta.status)} ${respuesta.statusText}`,
      );
    }
    writeFileSync(ruta, Buffer.from(await respuesta.arrayBuffer()));
  }

  const contenido = readFileSync(ruta);
  const huella = huellaDe(contenido);
  if (huella !== fuente.sha256) {
    throw new Error(
      `La fuente "${fuente.id}" no es la esperada.\n` +
        `  esperada: ${fuente.sha256}\n  encontrada: ${huella}\n` +
        'El mapa no puede cambiar porque alguien haya actualizado un fichero rio arriba: ' +
        'revisa el cambio y, si es correcto, actualiza fuentes.json a conciencia.',
    );
  }
  return contenido.toString('utf8');
}
