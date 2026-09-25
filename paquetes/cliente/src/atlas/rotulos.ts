// Rotulos que no se amontonan (ficha T-081 §4.4): se colocan por prioridad y se descarta el que se
// solaparia con uno ya puesto. La caja se estima por caracteres: el texto mide lo mismo en pantalla a
// cualquier zoom, asi que en unidades de atlas encoge al acercar.
import type { Figura } from './componer.ts';

/** Tamanyo del texto en pixeles de pantalla. */
export const TAMANYO_DE_ROTULO_PX = 12;
const ANCHO_POR_CARACTER = 0.55;

interface Caja {
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
}

export function cajaDeRotulo(figura: Figura, escala: number): Caja {
  const [x, y] = figura.puntos[0] ?? [0, 0];
  const alto = TAMANYO_DE_ROTULO_PX / escala;
  const ancho = (figura.texto?.length ?? 0) * alto * ANCHO_POR_CARACTER;
  return { x0: x - ancho / 2, y0: y - alto / 2, x1: x + ancho / 2, y1: y + alto / 2 };
}

function solapan(a: Caja, b: Caja): boolean {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

/**
 * Los rotulos que caben a esta escala (pixeles por unidad de atlas), en orden de prioridad y, a igual
 * prioridad, por texto: el resultado no depende del orden en que llegan.
 */
export function colocarRotulos(rotulos: readonly Figura[], escala: number): Figura[] {
  const ordenados = [...rotulos].sort(
    (a, b) =>
      (b.prioridad ?? 0) - (a.prioridad ?? 0) || (a.texto ?? '').localeCompare(b.texto ?? ''),
  );
  const puestos: Figura[] = [];
  const cajas: Caja[] = [];
  for (const r of ordenados) {
    const caja = cajaDeRotulo(r, escala);
    if (cajas.some((c) => solapan(c, caja))) continue;
    puestos.push(r);
    cajas.push(caja);
  }
  return puestos;
}
