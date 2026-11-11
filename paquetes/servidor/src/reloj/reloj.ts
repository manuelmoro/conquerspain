// El reloj (fichas T-061 §4.2, §4.3 y §4.7, y T-124): despierta, recorre las partidas debidas y las
// resuelve sin resolver dos veces lo mismo. Tras una caida no encadena turnos: el atrasado se resuelve
// en cuanto despierta y el siguiente tiene su plazo entero, como tras cualquier otro avance.
import type { IdPartida } from '@conquer/nucleo';

import { finDeTurno } from './fin-de-turno.ts';
import { resolverUnTurno } from './resolucion.ts';
import type { DependenciasDeResolucion, ResultadoDeUnTurno } from './resolucion.ts';

export interface OpcionesDelReloj {
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
}

const POR_DEFECTO = { partidasPorPasada: 50, sondeoMs: 1000 } as const;
const ESPERA_MINIMA_MS = 10;

export class Reloj {
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
    for (const fila of debidas) {
      if (this.enCurso.has(fila.id)) continue;
      this.enCurso.add(fila.id);
      try {
        const resultado = await resolverUnTurno(this.dep, fila.id);
        if (resultado.tipo === 'resuelto') resueltos += 1;
        if (resultado.tipo === 'conflicto') conflictos += 1;
        if (resultado.tipo === 'detenida') detenidas.push(fila.id);
      } finally {
        this.enCurso.delete(fila.id);
      }
    }
    return { resueltos, conflictos, detenidas };
  }

  /** Cuanto dormir hasta la proxima resolucion, sin pasarse del sondeo. */
  async esperaHastaLaSiguiente(): Promise<number> {
    const proxima = await this.dep.repo.proximaHora();
    if (proxima === null) return this.sondeoMs;
    return Math.min(this.sondeoMs, Math.max(ESPERA_MINIMA_MS, proxima - this.dep.ahora()));
  }

  /**
   * Resuelve un turno ahora mismo, sin esperar la hora: en las partidas de prueba, o cuando lo pide
   * quien administra la partida (T-090), que la API ya ha comprobado.
   */
  async avanzarManual(
    id: IdPartida,
    opciones: { readonly porElAdministrador: boolean } = { porElAdministrador: false },
  ): Promise<ResultadoDeUnTurno> {
    const fila = await this.dep.repo.partida(id);
    if (fila === null) throw new Error(`No hay ninguna partida "${id}".`);
    if (!fila.esDePrueba && !opciones.porElAdministrador) {
      throw new Error(
        `La partida "${id}" no es de prueba: el avance manual solo existe para partidas de prueba, porque en una de verdad el calendario es de todos.`,
      );
    }
    return resolverUnTurno(this.dep, id, { ignorarHora: true });
  }

  /**
   * Si todos los que juegan han dado por terminado el turno, lo resuelve ya (T-124); si no, nada. El
   * siguiente turno vence un intervalo despues de este avance, como cualquier otro.
   */
  async resolverSiTodosHanTerminado(id: IdPartida): Promise<ResultadoDeUnTurno> {
    if (this.enCurso.has(id)) return { tipo: 'no-debida' };
    this.enCurso.add(id);
    try {
      const fin = await finDeTurno(this.dep.repo, id);
      if (fin === null || !fin.todos) return { tipo: 'no-debida' };
      const resultado = await resolverUnTurno(this.dep, id, { ignorarHora: true });
      if (resultado.tipo === 'resuelto') {
        this.dep.registro.anotar('info', 'turno-terminado-por-todos', {
          partida: id,
          turno: resultado.turno,
        });
      }
      return resultado;
    } finally {
      this.enCurso.delete(id);
    }
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
