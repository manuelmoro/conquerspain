// Datos del mundo: catalogo geografico escrito a mano y mundo generado a partir de el.
export const VERSION_MUNDO = '0.1.0';

export { cargarCatalogo, cargarCatalogoOFallar, cargarMundo } from './cargador.ts';
export { informeCobertura, informeLegible } from './cobertura.ts';
export type { CoberturaDeRegion, InformeCobertura } from './cobertura.ts';
export { leerJsonc, limpiarJsonc } from './jsonc.ts';
export { DATOS_RASGOS, esRasgo } from './rasgos.ts';
export type { DatosRasgo } from './rasgos.ts';
export type { ComarcaCatalogo, FeriaCatalogo, LocalidadCatalogo } from './tipos.ts';
export { validarCatalogoCompleto, validarRegion } from './validarCatalogo.ts';
