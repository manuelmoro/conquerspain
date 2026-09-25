// Errores de la API: codigo estable, estado HTTP y un mensaje en espanyol que dice que paso y como
// arreglarlo (ficha T-062 §4.7).
export const CODIGOS_DE_API = [
  'no-autenticado',
  'partida-desconocida',
  'ruta-desconocida',
  'metodo-no-permitido',
  'cuerpo-invalido',
  'cuerpo-demasiado-grande',
  'orden-invalida',
  'orden-desconocida',
  'orden-no-retirable',
  'clave-reutilizada',
  'turno-cerrado',
  'partida-detenida',
  'cronica-no-disponible',
  'demasiadas-ordenes',
  'demasiadas-peticiones',
  'correo-invalido',
  'enlace-invalido',
  'tipo-de-contenido',
  'confirmacion-necesaria',
  'error-interno',
] as const;

export type CodigoDeApi = (typeof CODIGOS_DE_API)[number];

const ESTADO_HTTP: Readonly<Record<CodigoDeApi, number>> = {
  'no-autenticado': 401,
  'partida-desconocida': 404,
  'ruta-desconocida': 404,
  'metodo-no-permitido': 405,
  'cuerpo-invalido': 400,
  'cuerpo-demasiado-grande': 413,
  'orden-invalida': 400,
  'orden-desconocida': 404,
  'orden-no-retirable': 409,
  'clave-reutilizada': 409,
  'turno-cerrado': 409,
  'partida-detenida': 409,
  'cronica-no-disponible': 404,
  'demasiadas-ordenes': 429,
  'demasiadas-peticiones': 429,
  'correo-invalido': 400,
  'enlace-invalido': 401,
  'tipo-de-contenido': 415,
  'confirmacion-necesaria': 400,
  'error-interno': 500,
};

export class ErrorDeApi extends Error {
  readonly codigo: CodigoDeApi;
  readonly estado: number;
  /** Cabeceras que acompanyan al error (por ejemplo `retry-after`). */
  readonly cabeceras: Readonly<Record<string, string>>;

  constructor(
    codigo: CodigoDeApi,
    mensaje: string,
    cabeceras: Readonly<Record<string, string>> = {},
  ) {
    super(mensaje);
    this.name = 'ErrorDeApi';
    this.codigo = codigo;
    this.estado = ESTADO_HTTP[codigo];
    this.cabeceras = cabeceras;
  }
}
