// El canal de eventos en vivo (ficha T-080 §4.4, T-064): escucha `turno-resuelto` y, si se corta,
// reintenta con espera creciente (1, 2, 4… hasta 30 s).
/** Lo que hace falta de un `EventSource`; en el navegador se adapta uno de verdad. */
export interface FuenteDeEventos {
  alMensaje(tipo: string, oyente: (datos: string) => void): void;
  alError(oyente: () => void): void;
  cerrar(): void;
}

export interface OpcionesDeEventos {
  readonly url: string;
  readonly crear: (url: string) => FuenteDeEventos;
  readonly alTurno: (turno: number) => void;
  /** setTimeout inyectable para las pruebas. */
  readonly programar?: (hacer: () => void, ms: number) => unknown;
}

const ESPERA_MAXIMA_MS = 30_000;

export function esperaDeReconexion(intento: number): number {
  return Math.min(1000 * 2 ** intento, ESPERA_MAXIMA_MS);
}

/** Conecta y devuelve la funcion que desconecta del todo. */
export function escucharEventos(opciones: OpcionesDeEventos): () => void {
  const programar = opciones.programar ?? ((hacer, ms) => setTimeout(hacer, ms));
  let fuente: FuenteDeEventos | null = null;
  let intento = 0;
  let parado = false;
  const conectar = (): void => {
    if (parado) return;
    fuente = opciones.crear(opciones.url);
    fuente.alMensaje('turno-resuelto', (texto) => {
      intento = 0;
      try {
        const datos: unknown = JSON.parse(texto);
        const turno =
          typeof datos === 'object' && datos !== null && 'turno' in datos ? datos.turno : null;
        if (typeof turno === 'number') opciones.alTurno(turno);
      } catch {
        // Un evento mal formado se ignora: el siguiente traera el turno.
      }
    });
    fuente.alError(() => {
      fuente?.cerrar();
      fuente = null;
      const espera = esperaDeReconexion(intento);
      intento += 1;
      programar(conectar, espera);
    });
  };
  conectar();
  return () => {
    parado = true;
    fuente?.cerrar();
  };
}
