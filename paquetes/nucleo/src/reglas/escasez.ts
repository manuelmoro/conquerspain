// Escasez y hambre prolongada (docs/03-economia.md §3.6; ficha T-032 §4.4).
//
// La fase 3 decide si hay escasez; estas funciones dicen que supone. Las demas fases consultan
// `permiteIniciar` antes de empezar expediciones u obras y `permiteCrecer` antes de sumar vecinos.
import type { EstadoJugador } from '../tipos/estado.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { porcentaje } from '../utiles/enteros.ts';

/** Con escasez no se empiezan expediciones ni obras; las ya empezadas siguen. */
export function permiteIniciar(jugador: EstadoJugador): boolean {
  return !jugador.escasez;
}

/** Con escasez la poblacion no crece. */
export function permiteCrecer(jugador: EstadoJugador): boolean {
  return !jugador.escasez;
}

/** A partir de la escasez numero `escasezParaEmigrar` seguida, la gente se va. */
export function hayHambreProlongada(seguidas: number, reglas: TablasDeReglas): boolean {
  return seguidas >= reglas.consumo.escasezParaEmigrar;
}

/** Lealtad que pierde cada comarca propia en un turno de escasez. */
export function lealtadPerdidaPorEscasez(seguidas: number, reglas: TablasDeReglas): number {
  return hayHambreProlongada(seguidas, reglas)
    ? reglas.consumo.lealtadPorHambreProlongada
    : reglas.consumo.lealtadPorEscasez;
}

/**
 * Vecinos que emigran de una comarca con hambre prolongada. Al menos uno mientras quede gente:
 * si no, una aldea pequenya no notaria nunca el hambre.
 */
export function emigrantes(poblacion: number, reglas: TablasDeReglas): number {
  if (poblacion <= 0) return 0;
  return Math.min(
    poblacion,
    Math.max(1, porcentaje(poblacion, reglas.poblacion.emigracionPorHambreMil)),
  );
}

/**
 * Turnos de escasez que faltan para que empiece la emigracion, o null si ya empezo o no hay
 * escasez. La fase avisa cuando quedan uno o dos.
 */
export function turnosHastaEmigrar(seguidas: number, reglas: TablasDeReglas): number | null {
  if (seguidas <= 0 || hayHambreProlongada(seguidas, reglas)) return null;
  return reglas.consumo.escasezParaEmigrar - seguidas;
}
