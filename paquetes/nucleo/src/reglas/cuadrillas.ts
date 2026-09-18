// Cuadrillas: cuanta obra puede llevar una comarca a la vez (docs/03-economia.md §3.3; ficha
// T-035 §4.1).
import type { EstadoComarca, EstadoPartida, Obra } from '../tipos/estado.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { MIL } from '../utiles/enteros.ts';
import { comparar } from '../utiles/orden.ts';

/** `1 + floor(vecinos / 40)`, con su maximo; el fuero y el monasterio dan una mas cada uno. */
export function cuadrillasDe(comarca: EstadoComarca, reglas: TablasDeReglas): number {
  const p = reglas.poblacion;
  let cuadrillas = Math.min(
    p.cuadrillasMaximas,
    1 + Math.floor(comarca.poblacion / p.vecinosPorCuadrilla),
  );
  if (comarca.fuero === 'fuero') cuadrillas += reglas.obras.cuadrillasPorFuero;
  if (comarca.obrasMayores.includes('monasterio'))
    cuadrillas += reglas.obras.cuadrillasPorMonasterio;
  return cuadrillas;
}

/** Obras que ocupan una cuadrilla de la comarca: todas las que no estan abandonadas. */
export function obrasQueOcupan(estado: EstadoPartida, comarca: string): Obra[] {
  return Object.values(estado.obras)
    .filter((obra) => obra.comarca === comarca && !obra.abandonada)
    .sort((a, b) => comparar(a.id, b.id));
}

export function cuadrillasLibres(
  estado: EstadoPartida,
  comarca: EstadoComarca,
  reglas: TablasDeReglas,
): number {
  return cuadrillasDe(comarca, reglas) - obrasQueOcupan(estado, comarca.id).length;
}

/**
 * Turnos que faltan, al paso normal, para que acabe la primera obra de la comarca y quede una
 * cuadrilla libre. Es una prevision: el invierno o la falta de material la pueden retrasar.
 */
export function turnosHastaCuadrillaLibre(estado: EstadoPartida, comarca: string): number {
  const restantes = obrasQueOcupan(estado, comarca).map((obra) =>
    Math.ceil(Math.max(0, obra.avanceNecesarioMil - obra.avanceMil) / MIL),
  );
  return restantes.length === 0 ? 0 : Math.min(...restantes);
}
