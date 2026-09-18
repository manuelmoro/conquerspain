// Poblar y fundar puebla (docs/03-economia.md §3.6 y §3.7.3; ficha T-034 §4.3).
import type { EstadoComarca, Recua } from '../tipos/estado.ts';
import type { IdJugador } from '../tipos/ids.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { hash32 } from '../utiles/huella.ts';
import { comparar } from '../utiles/orden.ts';

/** Vecinos que caben en una comarca: la base, lo que dan las casas y la muralla. */
export function capacidadDe(comarca: EstadoComarca, reglas: TablasDeReglas): number {
  const p = reglas.poblacion;
  const casas = comarca.edificios['casas'] ?? 0;
  const muralla = comarca.obrasMayores.includes('muralla') ? p.capacidadPorMuralla : 0;
  return p.capacidadBase + casas * p.capacidadPorCasas + muralla;
}

/** Vecinos de la recua que se pueden quedar: nunca se pasa de la capacidad. */
export function vecinosQueSeQuedan(
  comarca: EstadoComarca,
  recua: Recua,
  reglas: TablasDeReglas,
): number {
  return Math.max(0, Math.min(recua.vecinos, capacidadDe(comarca, reglas) - comarca.poblacion));
}

export type MotivoSinPuebla = 'comarca-con-duenyo' | 'poca-influencia' | 'pocos-vecinos';

/** Por que no se puede fundar puebla aqui, o null si se puede. */
export function impedimentoDePuebla(
  comarca: EstadoComarca,
  recua: Recua,
  reglas: TablasDeReglas,
): MotivoSinPuebla | null {
  if (comarca.duenyo !== null) return 'comarca-con-duenyo';
  if ((comarca.influencias[recua.jugador] ?? 0) < reglas.cometidos.influenciaParaPuebla) {
    return 'poca-influencia';
  }
  if (recua.vecinos < reglas.cometidos.vecinosParaPuebla) return 'pocos-vecinos';
  return null;
}

export interface CandidatoAPuebla {
  readonly jugador: IdJugador;
  readonly influencia: number;
}

/**
 * Quien se queda la comarca si varios fundan puebla el mismo turno: el de mas influencia y, si
 * empatan, el menor `hash(partida, turno, contexto, jugador)` (docs/02 §2.4.4). Nunca quien llego
 * antes.
 */
export function ganadorDePuebla(
  candidatos: readonly CandidatoAPuebla[],
  semilla: string,
  turno: number,
  comarca: string,
): IdJugador | null {
  const desempate = (jugador: string): number =>
    hash32(`${semilla}|${String(turno)}|puebla:${comarca}|${jugador}`);
  const ordenados = [...candidatos].sort(
    (a, b) =>
      b.influencia - a.influencia ||
      desempate(a.jugador) - desempate(b.jugador) ||
      comparar(a.jugador, b.jugador),
  );
  return ordenados[0]?.jugador ?? null;
}
