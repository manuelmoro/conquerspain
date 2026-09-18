// Lo que gastan los edificios para trabajar (docs/03-economia.md §3.3; ficha T-032 §4.6).
//
// La carbonera quema madera y la lonja sala el pescado. Cada nivel paga su insumo antes de
// producir, de lo que habia disponible al empezar el turno; el nivel que no lo paga se para. Un
// edificio que depende de otro (la ferreria de la carbonera, que le da el carbon) solo trabaja
// tantos niveles como tenga encendidos aquel.
import type { EstadoComarca } from '../tipos/estado.ts';
import type { Recurso } from '../tipos/recursos.ts';
import type { TablasDeReglas, TipoEdificio } from '../tipos/reglas.ts';
import { TIPOS_DE_EDIFICIO } from '../tipos/reglas.ts';
import { comparar } from '../utiles/orden.ts';

export interface Insumos {
  /** Lo que se gasta la comarca, por recurso. */
  readonly gasto: Readonly<Partial<Record<Recurso, number>>>;
  /** Niveles que trabajan este turno, solo de los edificios que gastan o dependen de otro. */
  readonly nivelesActivos: Readonly<Partial<Record<TipoEdificio, number>>>;
  /** Edificios con niveles parados por falta de insumo. */
  readonly parados: readonly { readonly edificio: TipoEdificio; readonly activos: number }[];
}

/**
 * Insumos de una comarca pagados de `disponible`, que se descuenta sobre la marcha para que la
 * siguiente comarca del mismo jugador vea lo que queda.
 */
export function insumosDe(
  comarca: EstadoComarca,
  disponible: Partial<Record<Recurso, number>>,
  reglas: TablasDeReglas,
): Insumos {
  const gasto: Partial<Record<Recurso, number>> = {};
  const nivelesActivos: Partial<Record<TipoEdificio, number>> = {};
  const parados: { edificio: TipoEdificio; activos: number }[] = [];

  for (const tipo of TIPOS_DE_EDIFICIO) {
    const nivel = comarca.edificios[tipo] ?? 0;
    if (nivel <= 0) continue;
    const datos = reglas.edificios[tipo];
    const consumo = Object.entries(datos.consumo)
      .filter((par): par is [Recurso, number] => par[1] > 0)
      .sort((a, b) => comparar(a[0], b[0]));
    const requerido = datos.requiereEdificio;
    const limitePorRequisito = requerido === null ? undefined : nivelesActivos[requerido];
    if (consumo.length === 0 && limitePorRequisito === undefined) continue;

    let activos = Math.min(nivel, limitePorRequisito ?? nivel);
    for (const [recurso, porNivel] of consumo) {
      activos = Math.min(activos, Math.floor((disponible[recurso] ?? 0) / porNivel));
    }
    for (const [recurso, porNivel] of consumo) {
      const cantidad = activos * porNivel;
      disponible[recurso] = (disponible[recurso] ?? 0) - cantidad;
      gasto[recurso] = (gasto[recurso] ?? 0) + cantidad;
    }
    nivelesActivos[tipo] = activos;
    if (activos < nivel) parados.push({ edificio: tipo, activos });
  }
  return { gasto, nivelesActivos, parados };
}
