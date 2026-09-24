// Banco de pruebas: partidas automaticas y medicion de equilibrio (fichas T-046 y T-048).
export { CADENCIA_AUSENTE, VERSION_BANCO, VERSION_ROBOTS } from './version.ts';

export { ejecutarBanco, jugarPartida, jugarTurno } from './ejecutar.ts';
export type { OpcionesDelBanco, OpcionesDePartida, ResultadoDelBanco } from './ejecutar.ts';
export {
  OBJETIVOS,
  codigoDeEvaluacion,
  componerEvaluacion,
  componerEvaluacionCsv,
  evaluarEquilibrio,
  pendientes,
  recuentoDe,
} from './equilibrio.ts';
export type { Evaluacion, EstadoDeCriterio } from './equilibrio.ts';
export { alertasDeSalud, componerCsv, componerInforme, componerSerieCsv } from './informe.ts';
export { VERSION_METRICAS } from './metricas.ts';
export type { MetricasDePartida, MetricasDeJugador } from './metricas.ts';
export { LibroDeNegocios, tratoDeSuceso } from './negocios.ts';
export { altaDelBanco, mundoPeninsula } from './partida.ts';
export type { PartidaDelBanco } from './partida.ts';
export {
  avisoDeProcedencia,
  componerManifiesto,
  diferenciasDeProcedencia,
  textoDeManifiesto,
} from './procedencia.ts';
export type { Manifiesto, Procedencia } from './procedencia.ts';
export { ESTRATEGIAS, robotDe } from './robots/index.ts';
export type { Robot } from './robots/index.ts';
export { SUCESOS_DE_ENTRADA, pasoDelTurno } from './visitas.ts';
