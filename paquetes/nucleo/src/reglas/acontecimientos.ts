// Los acontecimientos como modificadores (docs/02 §2.4.5; ficha T-039 §4.5).
//
// Ninguna fase toca nada por su cuenta: consultan aqui cuanto vale un efecto en un lugar y un turno.
// Un acontecimiento esta activo desde `turnoInicio` durante `turnosDuracion` turnos y afecta a su
// region o, si trae comarca, solo a esa.
import type { Acontecimiento, EfectoAcontecimiento, QueDeEfecto } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import type { Terreno } from '../tipos/mundo.ts';
import type { Recurso } from '../tipos/recursos.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { MIL, multiplicarFactores } from '../utiles/enteros.ts';

export interface LugarDeAcontecimiento {
  readonly region: string;
  readonly comarca?: IdComarca | null;
  readonly terreno?: Terreno | null;
}

/** El ultimo turno en que el acontecimiento esta activo. */
export function ultimoTurnoDe(acontecimiento: Acontecimiento): number {
  return acontecimiento.turnoInicio + acontecimiento.turnosDuracion - 1;
}

export function estaActivo(acontecimiento: Acontecimiento, turno: number): boolean {
  return turno >= acontecimiento.turnoInicio && turno <= ultimoTurnoDe(acontecimiento);
}

/** Los acontecimientos activos en ese turno, en el orden en que estan en la lista. */
export function acontecimientosActivos(
  lista: readonly Acontecimiento[],
  turno: number,
): Acontecimiento[] {
  return lista.filter((acontecimiento) => estaActivo(acontecimiento, turno));
}

/** El acontecimiento afecta a ese lugar: a su region o, si es de una comarca, solo a ella. */
export function afectaA(acontecimiento: Acontecimiento, lugar: LugarDeAcontecimiento): boolean {
  if (acontecimiento.comarca !== null) return lugar.comarca === acontecimiento.comarca;
  return acontecimiento.region === lugar.region;
}

function efectoAplica(
  efecto: EfectoAcontecimiento,
  que: QueDeEfecto,
  lugar: LugarDeAcontecimiento,
  recurso: Recurso | null,
): boolean {
  if (efecto.que !== que) return false;
  if (efecto.recurso !== null && efecto.recurso !== recurso) return false;
  return efecto.terreno === null || efecto.terreno === (lugar.terreno ?? null);
}

/** Los efectos de esa clase que estan activos y afectan a ese lugar. */
export function efectosActivos(
  lista: readonly Acontecimiento[],
  turno: number,
  que: QueDeEfecto,
  lugar: LugarDeAcontecimiento,
  recurso: Recurso | null = null,
): EfectoAcontecimiento[] {
  const efectos: EfectoAcontecimiento[] = [];
  for (const acontecimiento of acontecimientosActivos(lista, turno)) {
    if (!afectaA(acontecimiento, lugar)) continue;
    for (const efecto of acontecimiento.efectos) {
      if (efectoAplica(efecto, que, lugar, recurso)) efectos.push(efecto);
    }
  }
  return efectos;
}

/** Cuanto multiplican los acontecimientos activos una cifra de ese lugar (1000: nada). */
export function factorDeAcontecimientos(
  lista: readonly Acontecimiento[],
  turno: number,
  que: QueDeEfecto,
  lugar: LugarDeAcontecimiento,
  recurso: Recurso | null = null,
): Milesimas {
  const factores = efectosActivos(lista, turno, que, lugar, recurso).map((e) => e.factorMil);
  return factores.length === 0 ? MIL : multiplicarFactores(MIL, factores);
}

/** El precio base de un recurso en una plaza: el del catalogo por lo que digan los acontecimientos. */
export function precioBaseEfectivo(
  precioBaseMil: number,
  lista: readonly Acontecimiento[],
  turno: number,
  lugar: LugarDeAcontecimiento,
  recurso: Recurso,
): number {
  return multiplicarFactores(precioBaseMil, [
    factorDeAcontecimientos(lista, turno, 'precio', lugar, recurso),
  ]);
}
