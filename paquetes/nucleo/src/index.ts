// Motor de reglas: puro, determinista, sin E/S.
export const VERSION_NUCLEO = '0.1.0';

export * from './utiles/index.ts';
export * from './tipos/index.ts';
export * from './validacion/index.ts';
export { TABLAS_DEL_JUEGO } from './datos/index.ts';
export { aplicar } from './cambios.ts';
export type { Cambio } from './cambios.ts';
export { crearContexto } from './contexto.ts';
export type { Contexto, EstadoBorrador } from './contexto.ts';
export { ErrorDeMotor } from './errores.ts';
export type { CodigoDeError } from './errores.ts';
export { registrarSuceso } from './sucesos.ts';
export { JORNADAS_DE_PUERTO, jornadasDeTramo } from './reglas/jornadas.ts';
export {
  CLIMA,
  EFECTOS_DE_CLIMA,
  TURNOS_POR_ANYO,
  anyoDe,
  calendarioDe,
  climaDelAnyo,
  estacionDe,
  estadoEstacionalDe,
  puertosCerradosEn,
  turnoDelAnyo,
} from './reglas/calendario.ts';
export type {
  Calendario,
  ClimaAnual,
  EfectoDeClima,
  EstadoEstacional,
  ModificadorDeClima,
} from './reglas/calendario.ts';
export type { CosteDeTramo, OpcionesDeTramo } from './reglas/jornadas.ts';
export { casarPlaza } from './reglas/mercado.ts';
export type {
  EntradaDePlaza,
  LineaDePlaza,
  MotivoSinCasar,
  OperacionDeMercado,
  ResultadoDeLinea,
  ResultadoDePlaza,
} from './reglas/mercado.ts';
export { cupoDeMenores, limitesDeMenores } from './reglas/mercaderesMenores.ts';
export { catalogoDePlazas } from './reglas/plazas.ts';
export type { CatalogoDePlazas, Plaza, SituacionDePlaza } from './reglas/plazas.ts';
export {
  desequilibrioMil,
  limitesDePrecio,
  nuevoPrecioMil,
  topeDeVolumen,
} from './reglas/precios.ts';
export { FASES, resolverTurno } from './resolver.ts';
export type { Fase, ResultadoTurno } from './resolver.ts';
export {
  MOTIVOS_SIN_TRADICION,
  elegidaEn,
  impedimentoDeTradicion,
  opcionesDeTradicion,
} from './reglas/tradiciones.ts';
export type { MotivoSinTradicion } from './reglas/tradiciones.ts';
export { CAPITULOS_DE_PRESTIGIO, prestigioDe } from './reglas/prestigio.ts';
export type { CapituloDePrestigio, Prestigio } from './reglas/prestigio.ts';
export { clasificacion } from './reglas/clasificacion.ts';
export type { LineaDeClasificacion } from './reglas/clasificacion.ts';
export { RUMBOS, rumboEntre, vistaDeJugador } from './reglas/vista.ts';
export type {
  CasaPublica,
  Rumbo,
  UnidadAjena,
  VistaComarca,
  VistaJugador,
} from './reglas/vista.ts';
export { componerCronica, fechaDe } from './reglas/cronica.ts';
export type { FuentesDeCronica } from './reglas/cronica.ts';
export { redondearDeOido } from './reglas/rumores.ts';
export {
  costeDeAperos,
  costeDeEdificio,
  costeDeObraMayor,
  costeDeRebanyo,
  costeDeRecua,
} from './reglas/casas/costes.ts';
export {
  modificadoresDe,
  modificadoresDelJugador,
  permisosDe,
  permisosDelJugador,
  prohibicionesDe,
  prohibicionesDelJugador,
} from './reglas/casas/index.ts';
export { impedimentoDeConstruir, solaresDe, solaresOcupados } from './reglas/obras.ts';
export type { MotivoSinConstruir } from './reglas/obras.ts';
export { cuadrillasDe } from './reglas/cuadrillas.ts';
export { capacidadDe } from './reglas/poblar.ts';
export { calidadDeTramo, claveDeTramo, tienePuente } from './reglas/ruta.ts';
export { origenesPosibles, perfilDe, sortearOrigenes } from './reglas/casas/origenes.ts';
