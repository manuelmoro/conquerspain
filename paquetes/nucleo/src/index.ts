// Motor de reglas: puro, determinista, sin E/S.
export const VERSION_NUCLEO = '0.1.0';

export * from './utiles/index.ts';
export * from './tipos/index.ts';
export * from './validacion/index.ts';
export { aplicar } from './cambios.ts';
export type { Cambio } from './cambios.ts';
export { crearContexto } from './contexto.ts';
export type { Contexto, EstadoBorrador } from './contexto.ts';
export { ErrorDeMotor } from './errores.ts';
export type { CodigoDeError } from './errores.ts';
export { registrarSuceso } from './sucesos.ts';
export { FASES, resolverTurno } from './resolver.ts';
export type { Fase, ResultadoTurno } from './resolver.ts';
