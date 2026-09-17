// Validacion de todo lo que entra al motor desde fuera.
// Los combinadores se exportan tambien para que otros paquetes (el mundo, el servidor) validen
// sus propios datos con el mismo estilo de errores: ruta del campo y mensaje en espanyol.
export type { CamposDe, ErrorValidacion, Resultado, Validador } from './validador.ts';
export {
  booleano,
  conRegla,
  entero,
  enteroNoNegativo,
  explicar,
  identificador,
  invalido,
  invalidos,
  lista,
  oNulo,
  objeto,
  porTipo,
  registro,
  registroCompleto,
  texto,
  unoDe,
  valido,
} from './validador.ts';
export { validarMundo } from './validarMundo.ts';
export { validarEstado } from './validarEstado.ts';
export { validarOrdenEnMundo, validarOrdenEntrante } from './validarOrden.ts';
export { validarTablas } from './validarTablas.ts';
