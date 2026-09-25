// Autoridad de la partida: persistencia, reloj de turnos y API.
export const VERSION_SERVIDOR = '0.1.0';

export { ErrorDePersistencia } from './persistencia/errores.ts';
export type { CodigoDePersistencia } from './persistencia/errores.ts';
export { RepositorioSqlite } from './persistencia/sqlite.ts';
export type {
  AuditoriaDeResolucion,
  FilaDePartida,
  NuevaPartida,
  OpcionesDeLectura,
  OrdenGuardada,
  Participante,
  Repositorio,
  ResolucionDeTurno,
} from './persistencia/repositorio.ts';
export { reproducirTurno } from './reloj/auditoria.ts';
export { proximaResolucion, turnosDebidos } from './reloj/calendario.ts';
export { proveedorDeRecorte } from './reloj/mundoDeLaPartida.ts';
export type { ProveedorDeMundo } from './reloj/mundoDeLaPartida.ts';
export { Reloj } from './reloj/reloj.ts';
export type { InformeDePasada, OpcionesDelReloj } from './reloj/reloj.ts';
export { RegistroEnMemoria } from './reloj/registro.ts';
export type { Registro } from './reloj/registro.ts';
export { resolverUnTurno } from './reloj/resolucion.ts';
export type { DependenciasDeResolucion, ResultadoDeUnTurno } from './reloj/resolucion.ts';
