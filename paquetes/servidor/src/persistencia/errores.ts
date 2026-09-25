// Errores de la capa de persistencia: con un codigo cerrado y un mensaje que dice que paso y como
// arreglarlo (CLAUDE.md §6).
export const CODIGOS_DE_PERSISTENCIA = [
  'huella-no-coincide',
  'estado-invalido',
  'conflicto-de-turno',
  'encadenado-roto',
  'partida-desconocida',
  'partida-duplicada',
  'orden-duplicada',
  'esquema-desactualizado',
  'migracion-fallida',
] as const;

export type CodigoDePersistencia = (typeof CODIGOS_DE_PERSISTENCIA)[number];

export class ErrorDePersistencia extends Error {
  readonly codigo: CodigoDePersistencia;
  readonly detalle: Readonly<Record<string, string | number>>;

  constructor(
    codigo: CodigoDePersistencia,
    mensaje: string,
    detalle: Readonly<Record<string, string | number>> = {},
  ) {
    super(mensaje);
    this.name = 'ErrorDePersistencia';
    this.codigo = codigo;
    this.detalle = detalle;
  }
}
