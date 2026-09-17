// Lector de JSON con comentarios. El catalogo geografico se escribe a mano y cada decision
// discutible lleva su comentario al lado: es documentacion viva del criterio, y tiene que poder
// convivir con los datos en el mismo archivo.

/** Quita comentarios de linea y de bloque, y las comas sobrantes antes de } o ]. */
export function limpiarJsonc(texto: string): string {
  let resultado = '';
  let i = 0;
  let enCadena = false;
  let escapado = false;
  while (i < texto.length) {
    const caracter = texto[i] ?? '';
    const siguiente = texto[i + 1] ?? '';
    if (enCadena) {
      resultado += caracter;
      if (escapado) escapado = false;
      else if (caracter === '\\') escapado = true;
      else if (caracter === '"') enCadena = false;
      i += 1;
      continue;
    }
    if (caracter === '"') {
      enCadena = true;
      resultado += caracter;
      i += 1;
      continue;
    }
    if (caracter === '/' && siguiente === '/') {
      while (i < texto.length && texto[i] !== '\n') i += 1;
      continue;
    }
    if (caracter === '/' && siguiente === '*') {
      i += 2;
      while (i < texto.length && !(texto[i] === '*' && texto[i + 1] === '/')) {
        if (texto[i] === '\n') resultado += '\n';
        i += 1;
      }
      i += 2;
      continue;
    }
    resultado += caracter;
    i += 1;
  }
  return resultado.replace(/,(\s*[}\]])/g, '$1');
}

export interface ErrorDeLectura {
  readonly archivo: string;
  readonly mensaje: string;
  readonly linea: number | null;
}

/** Interpreta un texto .jsonc. Si falla, dice el archivo y la linea. */
export function leerJsonc(
  archivo: string,
  texto: string,
): { ok: true; valor: unknown } | { ok: false; error: ErrorDeLectura } {
  const limpio = limpiarJsonc(texto);
  try {
    return { ok: true, valor: JSON.parse(limpio) as unknown };
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    const posicion = /position (\d+)/.exec(mensaje)?.[1];
    const linea =
      posicion === undefined ? null : limpio.slice(0, Number(posicion)).split('\n').length;
    return { ok: false, error: { archivo, mensaje, linea } };
  }
}
