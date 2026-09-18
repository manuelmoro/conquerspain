// Datos del mundo: catalogo geografico escrito a mano y mundo generado a partir de el.
export const VERSION_MUNDO = '0.1.0';

export {
  cargarCaminos,
  cargarCatalogo,
  cargarCatalogoOFallar,
  cargarFeriasDelMapa,
  cargarMundo,
} from './cargador.ts';
export { informeCobertura, informeLegible } from './cobertura.ts';
export type { CoberturaDeRegion, InformeCobertura } from './cobertura.ts';
export { leerJsonc, limpiarJsonc } from './jsonc.ts';
export { DATOS_RASGOS, esRasgo } from './rasgos.ts';
export type { DatosRasgo } from './rasgos.ts';
export type { ComarcaCatalogo, LocalidadCatalogo } from './tipos.ts';
export { validarCatalogoCompleto, validarRegion } from './validarCatalogo.ts';
export { CIERRES, comprobarCaminos, validarCaminos } from './validarCaminos.ts';
export type {
  CaminosCatalogo,
  CierreDePuerto,
  PuertoCatalogo,
  RutaCatalogo,
  VadoCatalogo,
} from './validarCaminos.ts';
export {
  FERIAS_GRANDES,
  SEPARACION_ENTRE_GRANDES,
  comprobarFerias,
  comprobarRasgos,
  validarFerias,
} from './validarFerias.ts';
export type { FeriaDelMapa } from './validarFerias.ts';
