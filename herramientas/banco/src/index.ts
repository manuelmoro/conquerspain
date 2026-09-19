// Banco de pruebas: partidas automaticas y medicion de equilibrio (ficha T-046).
export const VERSION_BANCO = '0.1.0';

export { ejecutarBanco, jugarPartida, jugarTurno } from './ejecutar.ts';
export type { OpcionesDelBanco, OpcionesDePartida, ResultadoDelBanco } from './ejecutar.ts';
export { alertasDeSalud, componerCsv, componerInforme, componerSerieCsv } from './informe.ts';
export { partidaInicial } from './partida.ts';
export { ESTRATEGIAS, robotDe } from './robots/index.ts';
export type { Robot } from './robots/index.ts';
