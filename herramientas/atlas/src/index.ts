// Generacion reproducible del mapa desde fuentes abiertas (docs/05-geografia.md §5.8).
export const VERSION_ATLAS = '0.1.0';

export { CACHE, fuentes, obtener } from './descargar.ts';
export type { Fuente } from './descargar.ts';
export {
  comprobar,
  generarMundo,
  principal,
  textoDelMundo,
  RUTA_INFORME,
  RUTA_MUNDO,
} from './generar.ts';
export type { ResultadoGeneracion } from './generar.ts';
export {
  area,
  centroide,
  dentroDelPoligono,
  porcionSobreTierra,
  recortarATierra,
  simplificar,
} from './geometria.ts';
export type { Punto } from './geometria.ts';
export {
  ALTO,
  ANCHO,
  aKilometros,
  proyectar,
  proyectarMilesimas,
  redondear,
} from './proyeccion.ts';
export { cargarRelieve, potencialesDe, terrenoDe, terrenoDeTramo } from './terreno.ts';
