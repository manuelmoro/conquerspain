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

/**
 * Limite por ventana deslizante: como mucho `maximo` usos de una clave en `ventanaMs`. Sirve para lo
 * que se limita por origen (entradas y enlaces). En memoria, como el cubo de fichas.
 */
export class LimitePorVentana {
  private readonly usos = new Map<string, number[]>();

  constructor(
    private readonly maximo: number,
    private readonly ventanaMs: number,
  ) {}

  /** Registra un uso; devuelve 0 si cabia o los segundos que faltan para que vuelva a caber. */
  usar(clave: string, ahora: number): number {
    const recientes = (this.usos.get(clave) ?? []).filter((t) => t > ahora - this.ventanaMs);
    if (recientes.length >= this.maximo) {
      this.usos.set(clave, recientes);
      const primero = recientes[0] ?? ahora;
      return Math.max(1, Math.ceil((primero + this.ventanaMs - ahora) / 1000));
    }
    recientes.push(ahora);
    this.usos.set(clave, recientes);
    return 0;
  }
}
