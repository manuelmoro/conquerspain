// Carga del catalogo geografico y del mundo ya generado.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import type { ErrorValidacion, Mundo, Resultado } from '@conquer/nucleo';
import { explicar, invalidos, valido, validarMundo } from '@conquer/nucleo';

import { leerJsonc } from './jsonc.ts';
import type { ComarcaCatalogo } from './tipos.ts';
import { validarCatalogoCompleto, validarRegion } from './validarCatalogo.ts';

/** Lee todas las regiones de un directorio de catalogo, en orden de archivo. */
export function cargarCatalogo(directorio: string): Resultado<ComarcaCatalogo[]> {
  const archivos = readdirSync(directorio)
    .filter((archivo) => archivo.endsWith('.jsonc'))
    .sort((a, b) => (a < b ? -1 : 1));

  const comarcas: ComarcaCatalogo[] = [];
  const errores: ErrorValidacion[] = [];

  for (const archivo of archivos) {
    const texto = readFileSync(join(directorio, archivo), 'utf8');
    const lectura = leerJsonc(archivo, texto);
    if (!lectura.ok) {
      const donde =
        lectura.error.linea === null ? archivo : `${archivo}:${String(lectura.error.linea)}`;
      errores.push({ ruta: donde, mensaje: `no se puede leer: ${lectura.error.mensaje}` });
      continue;
    }
    const region = validarRegion(lectura.valor, archivo);
    if (region.ok) comarcas.push(...region.valor);
    else errores.push(...region.errores);
  }

  errores.push(...validarCatalogoCompleto(comarcas));
  return errores.length > 0 ? invalidos(errores) : valido(comarcas);
}

/** Carga el mundo ya generado (paquetes/mundo/datos/mundo.vN.json) y lo valida. */
export function cargarMundo(ruta: string): Resultado<Mundo> {
  const texto = readFileSync(ruta, 'utf8');
  let datos: unknown;
  try {
    datos = JSON.parse(texto) as unknown;
  } catch (error) {
    return invalidos([
      {
        ruta,
        mensaje: `no es un JSON valido: ${error instanceof Error ? error.message : String(error)}`,
      },
    ]);
  }
  return validarMundo(datos);
}

/** Carga el catalogo o revienta con un mensaje legible: para scripts y arranques. */
export function cargarCatalogoOFallar(directorio: string): ComarcaCatalogo[] {
  const resultado = cargarCatalogo(directorio);
  if (!resultado.ok) {
    throw new Error(`El catalogo de ${directorio} no valida:\n${explicar(resultado.errores)}`);
  }
  return resultado.valor;
}
