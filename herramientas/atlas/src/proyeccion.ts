// Proyeccion del atlas: equirectangular ajustada a 40,2° N, la misma que valido la maqueta v0.1.
// 1 unidad ≈ 1,11 km. Las coordenadas de salida son enteras: se redondea una sola vez, al final.

export const LON0 = -9.6;
export const LAT1 = 43.85;
export const ESCALA = 100;
export const COSENO = Math.cos((40.2 * Math.PI) / 180);

/** Grados decimales → unidades de mapa. */
export function proyectar(lon: number, lat: number): [number, number] {
  return [(lon - LON0) * COSENO * ESCALA, (LAT1 - lat) * ESCALA];
}

/** Milesimas de grado (como las escribe el catalogo) → unidades de mapa. */
export function proyectarMilesimas(lonMil: number, latMil: number): [number, number] {
  return proyectar(lonMil / 1000, latMil / 1000);
}

export function redondear(punto: readonly [number, number]): [number, number] {
  return [Math.round(punto[0]), Math.round(punto[1])];
}

export const ANCHO = Math.round((3.45 - LON0) * COSENO * ESCALA);
export const ALTO = Math.round((LAT1 - 35.85) * ESCALA);

/** Kilometros que representa una distancia en unidades de mapa (1 unidad ≈ 1,11 km). */
export function aKilometros(unidades: number): number {
  return (unidades / ESCALA) * 111.32;
}
