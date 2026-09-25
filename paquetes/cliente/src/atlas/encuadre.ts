// El encuadre del atlas (ficha T-081 §4.2 y §6.4): zoom y desplazamiento como aritmetica pura sobre
// el `viewBox`. Moverse no toca el DOM: solo cambia estos cuatro numeros.
export interface Encuadre {
  readonly x: number;
  readonly y: number;
  readonly ancho: number;
  readonly alto: number;
}

export interface Limites {
  /** La caja del mapa. */
  readonly caja: Encuadre;
  /** El ancho mas pequenyo que se deja ver (zoom maximo). */
  readonly anchoMinimo: number;
}

function acotar(e: Encuadre, limites: Limites): Encuadre {
  const { caja } = limites;
  const ancho = Math.min(Math.max(e.ancho, limites.anchoMinimo), caja.ancho * 1.2);
  const alto = (e.alto * ancho) / e.ancho;
  // El centro del encuadre no sale de la caja del mapa.
  const cx = Math.min(caja.x + caja.ancho, Math.max(caja.x, e.x + e.ancho / 2));
  const cy = Math.min(caja.y + caja.alto, Math.max(caja.y, e.y + e.alto / 2));
  return { x: cx - ancho / 2, y: cy - alto / 2, ancho, alto };
}

/** Encuadre inicial: todo el mapa con la proporcion de la pantalla. */
export function encuadreInicial(caja: Encuadre, proporcion: number): Encuadre {
  const margen = 1.05;
  let ancho = caja.ancho * margen;
  let alto = ancho / proporcion;
  if (alto < caja.alto * margen) {
    alto = caja.alto * margen;
    ancho = alto * proporcion;
  }
  return {
    x: caja.x + caja.ancho / 2 - ancho / 2,
    y: caja.y + caja.alto / 2 - alto / 2,
    ancho,
    alto,
  };
}

/**
 * Zoom con `factor` (>1 acerca) manteniendo fijo el punto `[px, py]` del mapa (el que esta bajo el dedo
 * o el raton).
 */
export function acercar(
  e: Encuadre,
  factor: number,
  punto: readonly [number, number],
  limites: Limites,
): Encuadre {
  const [px, py] = punto;
  const ancho = e.ancho / factor;
  const alto = e.alto / factor;
  const x = px - ((px - e.x) * ancho) / e.ancho;
  const y = py - ((py - e.y) * alto) / e.alto;
  const nuevo = acotar({ x, y, ancho, alto }, limites);
  // Si hubo que acotar el tamanyo, el punto fijo se recoloca con el tamanyo final.
  if (nuevo.ancho === ancho) return nuevo;
  const fx = (px - e.x) / e.ancho;
  const fy = (py - e.y) / e.alto;
  return acotar(
    { x: px - fx * nuevo.ancho, y: py - fy * nuevo.alto, ancho: nuevo.ancho, alto: nuevo.alto },
    limites,
  );
}

/** Desplaza el encuadre (en unidades de atlas), sin sacar el centro de la caja del mapa. */
export function desplazar(e: Encuadre, dx: number, dy: number, limites: Limites): Encuadre {
  return acotar({ ...e, x: e.x + dx, y: e.y + dy }, limites);
}

/** Pixeles de pantalla por unidad de atlas. */
export function escalaDe(e: Encuadre, anchoPantalla: number): number {
  return anchoPantalla / e.ancho;
}
