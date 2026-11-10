// Milicia y hostilidad en el cliente (ficha T-120): las frases de cada mesnada y de cada hostilidad, y
// las intenciones de levar, marchar, licenciar y declarar o retirar la hostilidad.
import { TABLAS_DEL_JUEGO, costeDeMesnada } from '@conquer/nucleo';
import type { Asedio, Hostilidad, Mesnada, VistaJugador } from '@conquer/nucleo';

export function levar(comarca: string, hombres: number): Readonly<Record<string, unknown>> {
  return { tipo: 'levar', comarca, hombres };
}

export function licenciar(mesnada: string): Readonly<Record<string, unknown>> {
  return { tipo: 'licenciar', mesnada };
}

export function marchar(mesnada: string, destino: string): Readonly<Record<string, unknown>> {
  return { tipo: 'marchar', mesnada, destino };
}

export function hostilidad(contra: string, declarar: boolean): Readonly<Record<string, unknown>> {
  return { tipo: 'hostilidad', contra, declarar };
}

/** Los hombres que se pueden levar en una comarca de esa poblacion. */
export function levaMaxima(poblacion: number): number {
  return Math.floor((poblacion * TABLAS_DEL_JUEGO.milicia.levaMaximaMil) / 1000);
}

/** Donde esta y lo que cuesta, en una frase. */
export function fraseDeMesnada(m: Mesnada, comarca: (id: string) => string): string {
  const donde =
    m.situacion.donde === 'comarca'
      ? `en ${comarca(m.situacion.comarca)}`
      : `de marcha hacia ${comarca(m.situacion.hacia)} (${String(m.situacion.turnosQueFaltan)} ${m.situacion.turnosQueFaltan === 1 ? 'turno' : 'turnos'})`;
  const coste = costeDeMesnada(m, TABLAS_DEL_JUEGO);
  const lejos = m.turnosFuera > 0 ? `, ${String(m.turnosFuera)} turnos lejos de casa` : '';
  return `${String(m.hombres)} hombres ${donde}${lejos}. Cuesta ${String(coste.pan)} de pan y ${String(coste.maravedis)} maravedís por turno.`;
}

/** Una hostilidad dicha para quien la lee. */
export function fraseDeHostilidad(
  h: Hostilidad,
  yo: string,
  turno: number,
  jugador: (id: string) => string,
): string {
  const quien = (id: string): string => (id === yo ? 'tu casa' : jugador(id));
  const cuando =
    turno >= h.vigenteDesde ? 'vigente' : `vale desde el turno ${String(h.vigenteDesde)}`;
  return `${quien(h.de)} contra ${quien(h.contra)}: ${cuando}.`;
}

/** La hostilidad que tiene esta casa con otra, si la hay. */
export function hostilidadCon(vista: VistaJugador, otra: string): Hostilidad | undefined {
  const yo = vista.jugador.id;
  return vista.hostilidades.find(
    (h) => (h.de === yo && h.contra === otra) || (h.de === otra && h.contra === yo),
  );
}

export function asediar(mesnada: string): Readonly<Record<string, unknown>> {
  return { tipo: 'asediar', mesnada };
}

export function ofrecerRescate(asedio: string, rescate: number): Readonly<Record<string, unknown>> {
  return { tipo: 'tregua', asedio, rescate };
}

export function aceptarRescate(asedio: string): Readonly<Record<string, unknown>> {
  return { tipo: 'aceptar-tregua', asedio };
}

/** Un asedio dicho para quien lo lee: quien sitia, desde cuando y cuando podria rendirse. */
export function fraseDeAsedio(
  a: Asedio,
  yo: string,
  turno: number,
  comarca: (id: string) => string,
  jugador: (id: string) => string,
): string {
  const quien = a.sitiador === yo ? 'Tu milicia' : `La milicia de ${jugador(a.sitiador)}`;
  const rinde = a.desde + TABLAS_DEL_JUEGO.milicia.turnosMinimosAsedio - 1;
  const cuando =
    turno < rinde
      ? `no puede rendirse antes del turno ${String(rinde)}`
      : 'ya puede rendirse si el sitiador puede más que la defensa';
  const rescate = a.rescate === null ? '' : ` Rescate ofrecido: ${String(a.rescate)} maravedís.`;
  return `${quien} asedia ${comarca(a.comarca)} desde el turno ${String(a.desde)}: ${cuando}.${rescate}`;
}
