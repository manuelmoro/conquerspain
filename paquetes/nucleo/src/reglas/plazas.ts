// Plazas: los mercados abiertos este turno (docs/03-economia.md §3.10.1; ficha T-037 §4.1).
//
// Una plaza es local (una comarca con edificio de mercado, abierta siempre) o de feria (abierta solo
// en los turnos de su calendario). Una comarca puede tener las dos a la vez.
import type { EstadoPartida } from '../tipos/estado.ts';
import type { IdComarca, IdFeria, IdMercado } from '../tipos/ids.ts';
import { idDeMercadoDeFeria, idDeMercadoLocal } from '../tipos/ids.ts';
import type { Mundo, VolumenFeria } from '../tipos/mundo.ts';
import { VOLUMENES_FERIA } from '../tipos/mundo.ts';
import { comparar, idsEnOrden } from '../utiles/orden.ts';

export interface Plaza {
  readonly id: IdMercado;
  readonly comarca: IdComarca;
  readonly tipo: 'local' | 'feria';
  readonly volumen: VolumenFeria;
}

export type SituacionDePlaza = 'abierta' | 'cerrada' | 'desconocida';

export interface CatalogoDePlazas {
  /** Las plazas abiertas, ordenadas por identificador. */
  readonly abiertas: readonly Plaza[];
  readonly situacionDe: (id: IdMercado) => SituacionDePlaza;
  /** La plaza con ese identificador, si esta abierta. */
  readonly abierta: (id: IdMercado) => Plaza | null;
  readonly abiertaEn: (comarca: IdComarca) => Plaza | null;
}

const PREFIJO_LOCAL = 'local-';

/** Los edificios que abren plaza local: el mercado del pueblo y la venta del camino (T-053). */
const EDIFICIOS_DE_PLAZA = ['mercado', 'venta'] as const;

/** Niveles de edificio de plaza que hay en la comarca; 0 si no hay ninguno. */
function nivelDePlaza(estado: EstadoPartida, comarca: IdComarca): number {
  const edificios = estado.comarcas[comarca]?.edificios;
  if (edificios === undefined) return 0;
  return EDIFICIOS_DE_PLAZA.reduce((total, tipo) => total + (edificios[tipo] ?? 0), 0);
}

/** La comarca tiene una plaza, abierta o no: un mercado local, una venta o una feria del anyo. */
export function hayPlazaEn(estado: EstadoPartida, mundo: Mundo, comarca: IdComarca): boolean {
  return nivelDePlaza(estado, comarca) > 0 || (mundo.comarcas[comarca]?.ferias.length ?? 0) > 0;
}

/** Lo que hay abierto este turno y lo que el mundo permite que exista. */
export function catalogoDePlazas(
  estado: EstadoPartida,
  mundo: Mundo,
  feriasActivas: readonly IdFeria[],
): CatalogoDePlazas {
  const activas = new Set<string>(feriasActivas);
  const ferias = new Map<IdMercado, Plaza>();
  const abiertas = new Map<IdMercado, Plaza>();

  for (const idComarca of idsEnOrden(mundo.comarcas)) {
    const comarca = mundo.comarcas[idComarca];
    if (comarca === undefined) continue;
    for (const feria of comarca.ferias) {
      const plaza: Plaza = {
        id: idDeMercadoDeFeria(feria.id),
        comarca: comarca.id,
        tipo: 'feria',
        volumen: feria.volumen,
      };
      ferias.set(plaza.id, plaza);
      if (activas.has(feria.id)) abiertas.set(plaza.id, plaza);
    }
  }
  for (const idComarca of idsEnOrden(estado.comarcas)) {
    const comarca = estado.comarcas[idComarca];
    if (comarca === undefined || nivelDePlaza(estado, comarca.id) <= 0) continue;
    const id = idDeMercadoLocal(comarca.id);
    abiertas.set(id, { id, comarca: comarca.id, tipo: 'local', volumen: 'pequenya' });
  }

  const ordenadas = [...abiertas.values()].sort((a, b) => comparar(a.id, b.id));

  return {
    abiertas: ordenadas,
    abierta: (id) => abiertas.get(id) ?? null,
    situacionDe: (id) => {
      if (abiertas.has(id)) return 'abierta';
      if (ferias.has(id)) return 'cerrada';
      return id.startsWith(PREFIJO_LOCAL) &&
        mundo.comarcas[id.slice(PREFIJO_LOCAL.length)] !== undefined
        ? 'cerrada'
        : 'desconocida';
    },
    abiertaEn: (comarca) => {
      const aqui = ordenadas.filter((plaza) => plaza.comarca === comarca);
      // La feria manda sobre el mercado local; entre ferias, la de mas volumen y luego la de menor id.
      const ferias = aqui
        .filter((plaza) => plaza.tipo === 'feria')
        .sort(
          (a, b) =>
            VOLUMENES_FERIA.indexOf(b.volumen) - VOLUMENES_FERIA.indexOf(a.volumen) ||
            comparar(a.id, b.id),
        );
      return ferias[0] ?? aqui[0] ?? null;
    },
  };
}
