// El reloj (ficha T-061 §4.2, §4.3 y §4.7): despierta, recorre las partidas debidas y las resuelve,
// en cadena si estuvo caido, sin resolver dos veces lo mismo.
import type { IdPartida } from '@conquer/nucleo';

import { resolverUnTurno } from './resolucion.ts';
import type { DependenciasDeResolucion, ResultadoDeUnTurno } from './resolucion.ts';

export interface OpcionesDelReloj {
  /** Turnos que se resuelven de una partida en una pasada; el resto, en la siguiente. */
  readonly maximoDeTurnosPorPasada?: number;
  /** Partidas que se miran por pasada. */
  readonly partidasPorPasada?: number;
  /** Lo mas que duerme el bucle entre dos pasadas. */
  readonly sondeoMs?: number;
  /** Lo que se hace tras cada pasada con el mismo bucle: el despachador de correos (T-064). */
  readonly despachador?: { pasada(): Promise<unknown> };
}

export interface InformeDePasada {
  readonly resueltos: number;
  readonly conflictos: number;
  readonly detenidas: readonly IdPartida[];
  readonly porPartida: Readonly<Record<string, number>>;
}

const POR_DEFECTO = { maximoDeTurnosPorPasada: 24, partidasPorPasada: 50, sondeoMs: 1000 } as const;
const ESPERA_MINIMA_MS = 10;

export class Reloj {
  private readonly maximo: number;
  private readonly partidasPorPasada: number;
  private readonly sondeoMs: number;
  private readonly despachador: { pasada(): Promise<unknown> } | null;
  /** Cerrojo por partida dentro del proceso: no se calcula dos veces lo mismo. */
  private readonly enCurso = new Set<string>();
  private parado = true;
  private bucle: Promise<void> | null = null;
  private despertar: (() => void) | null = null;

  constructor(
    private readonly dep: DependenciasDeResolucion,
    opciones: OpcionesDelReloj = {},
  ) {
    this.maximo = opciones.maximoDeTurnosPorPasada ?? POR_DEFECTO.maximoDeTurnosPorPasada;
    this.partidasPorPasada = opciones.partidasPorPasada ?? POR_DEFECTO.partidasPorPasada;
    this.sondeoMs = opciones.sondeoMs ?? POR_DEFECTO.sondeoMs;
    this.despachador = opciones.despachador ?? null;
  }

  /** Una pasada: resuelve lo que este debido a la hora que da `ahora()`. */
  async pasada(): Promise<InformeDePasada> {
    const debidas = await this.dep.repo.partidasPorResolver(
      this.dep.ahora(),
      this.partidasPorPasada,
    );
    let resueltos = 0;
    let conflictos = 0;
    const detenidas: IdPartida[] = [];
    const porPartida: Record<string, number> = {};
    for (const fila of debidas) {
      if (this.enCurso.has(fila.id)) continue;
      this.enCurso.add(fila.id);
      try {
        for (let i = 0; i < this.maximo; i += 1) {
          const resultado = await resolverUnTurno(this.dep, fila.id);
          if (resultado.tipo === 'resuelto') {
            resueltos += 1;
            porPartida[fila.id] = (porPartida[fila.id] ?? 0) + 1;
            continue;
          }
          if (resultado.tipo === 'conflicto') conflictos += 1;
          if (resultado.tipo === 'detenida') detenidas.push(fila.id);
          break;
        }
      } finally {
        this.enCurso.delete(fila.id);
      }
    }
    return { resueltos, conflictos, detenidas, porPartida };
  }

  /** Cuanto dormir hasta la proxima resolucion, sin pasarse del sondeo. */
  async esperaHastaLaSiguiente(): Promise<number> {
    const proxima = await this.dep.repo.proximaHora();
    if (proxima === null) return this.sondeoMs;
    return Math.min(this.sondeoMs, Math.max(ESPERA_MINIMA_MS, proxima - this.dep.ahora()));
  }

  /** Resuelve un turno ahora mismo, sin esperar la hora: solo en las partidas de prueba. */
  async avanzarManual(id: IdPartida): Promise<ResultadoDeUnTurno> {
    const fila = await this.dep.repo.partida(id);
    if (fila === null) throw new Error(`No hay ninguna partida "${id}".`);
    if (!fila.esDePrueba) {
      throw new Error(
        `La partida "${id}" no es de prueba: el avance manual solo existe para partidas de prueba, porque en una de verdad el calendario es de todos.`,
      );
    }
    return resolverUnTurno(this.dep, id, { ignorarHora: true });
  }

  iniciar(): void {
    if (!this.parado) return;
    this.parado = false;
    this.bucle = this.correr();
  }

  async parar(): Promise<void> {
    this.parado = true;
    this.despertar?.();
    await this.bucle;
    this.bucle = null;
  }

  /** Una funcion y no el campo: `parar()` lo cambia mientras el bucle espera. */
  private estaParado(): boolean {
    return this.parado;
  }

  private async correr(): Promise<void> {
    while (!this.estaParado()) {
      try {
        await this.pasada();
        await this.despachador?.pasada();
      } catch (error) {
        this.dep.registro.anotar('error', 'pasada-fallida', {
          detalle: error instanceof Error ? error.message : 'error desconocido',
        });
      }
      if (this.estaParado()) break;
      const espera = await this.esperaHastaLaSiguiente().catch(() => this.sondeoMs);
      await new Promise<void>((seguir) => {
        const temporizador = setTimeout(seguir, espera);
        this.despertar = () => {
          clearTimeout(temporizador);
          seguir();
        };
      });
      this.despertar = null;
    }
  }
}
