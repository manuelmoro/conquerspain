// Las versiones y las constantes que identifican una ejecucion del banco. Viven aparte para que el
// manifiesto (`procedencia.ts`) no tenga que importar el ejecutor y no se formen ciclos.
export const VERSION_BANCO = '0.1.0';

/** Version de los robots: sube cuando cambia como juegan, porque cambia lo que mide el banco. */
export const VERSION_ROBOTS = 4;

/** Cada cuantos turnos entra el jugador que juega sin estar (el mismo plan de seis de T-045). */
export const CADENCIA_AUSENTE = 6;
