// Utiles deterministas del motor: aritmetica entera, orden estable, azar con semilla y huella.
export {
  MIL,
  aEntero,
  aMilesimas,
  limitar,
  multiplicarFactores,
  porcentaje,
  repartoProporcional,
} from './enteros.ts';
export type { Milesimas, Peticion } from './enteros.ts';
export { azarDe, azarDeTexto } from './azar.ts';
export type { Azar } from './azar.ts';
export { comparar, enOrden, idsEnOrden, ordenarPor } from './orden.ts';
export { canonico } from './serializacion.ts';
export { aBytesUtf8, hash32, huella, sha256Hex } from './huella.ts';
export { clonar } from './clonar.ts';
export type { Mutable } from './clonar.ts';
