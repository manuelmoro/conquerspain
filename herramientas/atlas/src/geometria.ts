// Geometria del atlas: simplificacion de contornos, recorte de celdas a tierra y medidas.
import polygonClipping from 'polygon-clipping';
import type { Geom, Polygon, Ring } from 'polygon-clipping';

export type Punto = [number, number];

/** Douglas-Peucker: quita los puntos que no cambian la forma mas de `tolerancia`. */
export function simplificar(puntos: readonly Punto[], tolerancia: number): Punto[] {
  if (puntos.length < 3) return [...puntos];
  const conservar = new Set<number>([0, puntos.length - 1]);
  const pila: [number, number][] = [[0, puntos.length - 1]];

  while (pila.length > 0) {
    const tramo = pila.pop();
    if (tramo === undefined) break;
    const [inicio, fin] = tramo;
    const a = puntos[inicio];
    const b = puntos[fin];
    if (a === undefined || b === undefined) continue;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const largo = Math.hypot(dx, dy);
    // Un anillo cerrado empieza y acaba en el mismo punto: ahi el segmento es degenerado y hay
    // que medir la distancia al punto, no a la recta, o la simplificacion se lleva la figura entera.
    const degenerado = largo === 0;
    let peor = 0;
    let cual: number | null = null;
    for (let i = inicio + 1; i < fin; i += 1) {
      const p = puntos[i];
      if (p === undefined) continue;
      const distancia = degenerado
        ? Math.hypot(p[0] - a[0], p[1] - a[1])
        : Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / largo;
      if (distancia > peor) {
        peor = distancia;
        cual = i;
      }
    }
    if (cual !== null && peor > tolerancia) {
      conservar.add(cual);
      pila.push([inicio, cual], [cual, fin]);
    }
  }

  return [...conservar].sort((a, b) => a - b).map((indice) => puntos[indice] as Punto);
}

export function area(anillo: readonly Punto[]): number {
  let total = 0;
  for (let i = 0; i < anillo.length; i += 1) {
    const a = anillo[i] as Punto;
    const b = anillo[(i + 1) % anillo.length] as Punto;
    total += a[0] * b[1] - b[0] * a[1];
  }
  return Math.abs(total) / 2;
}

export function centroide(anillo: readonly Punto[]): Punto {
  let x = 0;
  let y = 0;
  let peso = 0;
  for (let i = 0; i < anillo.length; i += 1) {
    const a = anillo[i] as Punto;
    const b = anillo[(i + 1) % anillo.length] as Punto;
    const cruz = a[0] * b[1] - b[0] * a[1];
    peso += cruz;
    x += (a[0] + b[0]) * cruz;
    y += (a[1] + b[1]) * cruz;
  }
  if (peso === 0) return [...(anillo[0] ?? [0, 0])] as Punto;
  return [x / (3 * peso), y / (3 * peso)];
}

export function dentroDelPoligono(punto: Punto, anillo: readonly Punto[]): boolean {
  let dentro = false;
  for (let i = 0, j = anillo.length - 1; i < anillo.length; j = i, i += 1) {
    const a = anillo[i] as Punto;
    const b = anillo[j] as Punto;
    const cruza = a[1] > punto[1] !== b[1] > punto[1];
    if (cruza && punto[0] < ((b[0] - a[0]) * (punto[1] - a[1])) / (b[1] - a[1]) + a[0]) {
      dentro = !dentro;
    }
  }
  return dentro;
}

function comoAnillo(puntos: readonly Punto[]): Ring {
  const anillo: Punto[] = [...puntos];
  const primero = anillo[0];
  const ultimo = anillo[anillo.length - 1];
  if (
    primero !== undefined &&
    ultimo !== undefined &&
    (primero[0] !== ultimo[0] || primero[1] !== ultimo[1])
  ) {
    anillo.push([primero[0], primero[1]]);
  }
  return anillo;
}

/**
 * Recorta una celda a la tierra y devuelve el trozo mayor.
 * Una comarca es una superficie continua: si el recorte la parte, nos quedamos con el pedazo
 * principal y se anota cuanta superficie se ha quedado fuera.
 */
export function recortarATierra(
  celda: readonly Punto[],
  tierra: readonly (readonly Punto[])[],
): { poligono: Punto[]; areaRecortada: number } | null {
  const celdaAnillo: Polygon = [comoAnillo(celda)];
  const tierraGeom: Geom = tierra.map((anillo) => [comoAnillo(anillo)]);
  const trozos = polygonClipping.intersection(celdaAnillo, tierraGeom);
  if (trozos.length === 0) return null;

  let mejor: Punto[] = [];
  let mejorArea = 0;
  let areaTotal = 0;
  for (const trozo of trozos) {
    const exterior = trozo[0];
    if (exterior === undefined) continue;
    const puntos = exterior.slice(0, -1).map((punto) => [punto[0], punto[1]] as Punto);
    const suArea = area(puntos);
    areaTotal += suArea;
    if (suArea > mejorArea) {
      mejorArea = suArea;
      mejor = puntos;
    }
  }
  if (mejor.length < 3) return null;
  return { poligono: mejor, areaRecortada: areaTotal - mejorArea };
}

/** Longitud del tramo de recta entre dos puntos que cae dentro de tierra, en tanto por mil. */
export function porcionSobreTierra(
  a: Punto,
  b: Punto,
  tierra: readonly (readonly Punto[])[],
  muestras = 20,
): number {
  let dentro = 0;
  for (let i = 1; i <= muestras; i += 1) {
    const t = i / (muestras + 1);
    const punto: Punto = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    if (tierra.some((anillo) => dentroDelPoligono(punto, anillo))) dentro += 1;
  }
  return Math.round((dentro * 1000) / muestras);
}
