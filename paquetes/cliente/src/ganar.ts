// Como se gana una comarca, en palabras (ficha T-088 §2.7). Puro: la pantalla solo lo pinta.
import type { ComoGanarLa } from '@conquer/nucleo';

export interface TextoDeGanar {
  /** «Tu influencia: 12 de los 60 que pide incorporarla.» */
  readonly cabecera: string;
  /** «Este turno: +1» con el porqué, o que no se mueve. */
  readonly ritmo: string;
  readonly motivos: readonly string[];
  readonly aceleraria: readonly string[];
}

function conSigno(puntos: number): string {
  return puntos > 0 ? `+${String(puntos)}` : String(puntos);
}

export function textoDeGanar(g: ComoGanarLa): TextoDeGanar {
  const cabecera =
    g.actual >= g.necesaria
      ? `Tu influencia: ${String(g.actual)}. Ya llega a los ${String(g.necesaria)} que pide incorporarla, si sacas ${String(g.ventaja)} de ventaja a la segunda casa.`
      : `Tu influencia: ${String(g.actual)} de los ${String(g.necesaria)} que pide incorporarla (y ${String(g.ventaja)} de ventaja sobre la segunda casa).`;
  let ritmo: string;
  const soloResta = g.motivos.length > 0 && g.motivos.every((m) => m.puntos < 0);
  if (g.cambio === 0 && g.actual === 0 && soloResta)
    ritmo = 'Este turno no se mueve: no baja de 0.';
  else if (g.cambio === 0) ritmo = 'Este turno no se mueve.';
  else ritmo = `Este turno: ${conSigno(g.cambio)}.`;
  if (g.actual < g.necesaria) {
    ritmo +=
      g.turnosHastaLaNecesaria === null
        ? ' A este paso no llegas.'
        : ` A este paso llegas en ${String(g.turnosHastaLaNecesaria)} turno${g.turnosHastaLaNecesaria === 1 ? '' : 's'}.`;
  }
  return {
    cabecera,
    ritmo,
    motivos: g.motivos.map((m) => `${conSigno(m.puntos)}: ${m.texto}`),
    aceleraria: g.aceleraria.map((a) => `${conSigno(a.puntos)}: ${a.texto}`),
  };
}
