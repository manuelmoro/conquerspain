// Errores del motor. Todos llevan un codigo estable (para el servidor y los registros) y un
// mensaje en espanyol que explica que paso y que hacer.

export type CodigoDeError =
  | 'version-incompatible'
  | 'orden-de-otro-turno'
  | 'orden-invalida'
  | 'estado-invalido'
  | 'invariante-rota'
  | 'entidad-desconocida';

export class ErrorDeMotor extends Error {
  constructor(
    readonly codigo: CodigoDeError,
    mensaje: string,
    readonly datos?: Readonly<Record<string, number | string>>,
  ) {
    super(mensaje);
    this.name = 'ErrorDeMotor';
  }
}
