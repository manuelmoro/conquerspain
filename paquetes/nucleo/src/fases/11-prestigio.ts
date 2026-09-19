// Fase 11 · Prestigio y hitos
// El recuento de prestigio, los hitos y la clasificacion llegan con T-043. De momento la fase
// resuelve las tradiciones: se eligen las de las rondas abiertas y se abren las rondas nuevas.
import type { Contexto } from '../contexto.ts';
import { tradiciones } from './11-tradiciones.ts';

export function fasePrestigio(ctx: Contexto): void {
  tradiciones(ctx);
}
