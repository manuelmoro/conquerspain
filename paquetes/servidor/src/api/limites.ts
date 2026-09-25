// Los limites de la API (ficha T-062 §4.6): cuerpo, ordenes por turno y frecuencia por cuenta.
export const CUERPO_MAXIMO_BYTES = 64 * 1024;
export const ORDENES_PENDIENTES_MAXIMAS = 200;
export const PETICIONES_POR_MINUTO = 60;
export const RAFAGA_DE_PETICIONES = 30;

/**
 * Cubo de fichas por clave: cada peticion gasta una, y se recuperan `porSegundo` cada segundo hasta
 * `capacidad`. En memoria: con varias instancias haria falta compartirlo (anotado en la ficha).
 */
export class CuboDeFichas {
  private readonly cubos = new Map<string, { fichas: number; instante: number }>();

  constructor(
    private readonly capacidad: number,
    private readonly porSegundo: number,
  ) {}

  /** Intenta gastar una ficha; devuelve 0 si se pudo o los segundos que faltan para la siguiente. */
  gastar(clave: string, ahora: number): number {
    const cubo = this.cubos.get(clave) ?? { fichas: this.capacidad, instante: ahora };
    const transcurridos = Math.max(0, ahora - cubo.instante) / 1000;
    const fichas = Math.min(this.capacidad, cubo.fichas + transcurridos * this.porSegundo);
    if (fichas >= 1) {
      this.cubos.set(clave, { fichas: fichas - 1, instante: ahora });
      return 0;
    }
    this.cubos.set(clave, { fichas, instante: ahora });
    return Math.ceil((1 - fichas) / this.porSegundo);
  }
}
