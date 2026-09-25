// Interfaz de juego: atlas, ordenes y cronica. La capa de datos se exporta para las pruebas y para
// las herramientas; el navegador entra por `main.ts`.
export const VERSION_CLIENTE = '0.1.0';

export { Almacen, leerPendientes } from './almacen.ts';
export type { EstadoDelCliente, IntencionLocal } from './almacen.ts';
export { ClienteApi } from './api.ts';
export { escucharEventos, esperaDeReconexion } from './eventos.ts';
export { GuardadoEnMemoria, guardadoDelNavegador } from './guardado.ts';
export { preverBandeja } from './prevision.ts';
