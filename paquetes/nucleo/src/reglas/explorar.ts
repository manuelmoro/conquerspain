// Explorar (docs/03-economia.md §3.7.3 y docs/02 §2.6; ficha T-034 §4.1).
//
// La recua que explora deja la comarca en `explorada` con una foto fechada de lo que vio, y oye
// hablar de las vecinas. A veces encuentra algo mas, con el azar de ambito `hallazgo`: nunca un
// recurso caido del cielo, solo informacion.
import type {
  DatosConocidos,
  EstadoComarca,
  EstadoJugador,
  EstadoPartida,
  NivelDeConocimiento,
} from '../tipos/estado.ts';
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import type { ComarcaMundo, Mundo } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { azarDe } from '../utiles/azar.ts';
import { comparar } from '../utiles/orden.ts';

/** Lo que ve una recua de una comarca el turno que la explora. */
export function datosConocidosDe(comarca: EstadoComarca, geografia: ComarcaMundo): DatosConocidos {
  return {
    duenyo: comarca.duenyo,
    poblacion: comarca.poblacion,
    terreno: geografia.terreno,
    potenciales: { ...comarca.potenciales },
    edificios: { ...comarca.edificios },
  };
}

/**
 * Comarcas que el jugador conoce a esos niveles **por merito propio**: sin las que ya sabia al
 * empezar (T-058). Es lo que cuentan el capitulo de exploracion y el hito del primer horizonte.
 */
export function conocidasPorMerito(
  jugador: EstadoJugador,
  niveles: readonly NivelDeConocimiento[],
): number {
  const deSalida = new Set<string>(jugador.registro.conocidasAlEmpezar);
  return Object.entries(jugador.conocimiento).filter(
    ([id, conocimiento]) => niveles.includes(conocimiento.nivel) && !deSalida.has(id),
  ).length;
}

/** Vecinas de las que el jugador todavia no sabia nada: pasan a `oida`. */
export function vecinasPorOir(
  comarca: IdComarca,
  mundo: Mundo,
  jugador: EstadoJugador,
): IdComarca[] {
  return [...(mundo.vecinos[comarca] ?? [])]
    .filter((vecina) => {
      const nivel = jugador.conocimiento[vecina]?.nivel;
      return nivel === undefined || nivel === 'desconocida';
    })
    .sort(comparar);
}

/** Lo unico que puede traer una exploracion ademas del mapa. */
export const HALLAZGOS = ['localidad', 'noticias'] as const;

export type Hallazgo =
  | { readonly tipo: 'nada' }
  | { readonly tipo: 'localidad'; readonly nombre: string }
  | { readonly tipo: 'noticias'; readonly comarca: IdComarca; readonly de: IdJugador };

/**
 * Hallazgo de una exploracion. Se tira con la semilla, el turno, la recua y la comarca: la misma
 * exploracion da siempre lo mismo, y dos recuas que exploran a la vez no se roban la tirada.
 * - `localidad`: una aldea que no es la cabecera, para la cronica;
 * - `noticias`: una comarca de un rival, de la que se sabe como estaba este turno.
 */
export function hallazgoDe(
  estado: EstadoPartida,
  turno: number,
  recua: string,
  comarca: IdComarca,
  jugador: IdJugador,
  mundo: Mundo,
  reglas: TablasDeReglas,
): Hallazgo {
  const azar = azarDe(estado.semilla, turno, 'hallazgo', `${recua}|${comarca}`);
  if (azar.entero(1000) >= reglas.cometidos.probabilidadHallazgoMil) return { tipo: 'nada' };
  const aldeas = (mundo.comarcas[comarca]?.localidades ?? []).filter((l) => !l.cabecera);
  const ajenas = Object.keys(estado.comarcas)
    .sort(comparar)
    .flatMap((id) => {
      const duenyo = estado.comarcas[id]?.duenyo ?? null;
      return duenyo !== null && duenyo !== jugador ? [{ id: id as IdComarca, duenyo }] : [];
    });
  // Solo se elige entre lo que se puede encontrar aqui: sin aldeas ni rivales, no hay hallazgo.
  const posibles = HALLAZGOS.filter((tipo) =>
    tipo === 'localidad' ? aldeas.length > 0 : ajenas.length > 0,
  );
  if (posibles.length === 0) return { tipo: 'nada' };
  if (azar.elegir(posibles) === 'localidad') {
    return { tipo: 'localidad', nombre: azar.elegir(aldeas).nombre };
  }
  const elegida = azar.elegir(ajenas);
  return { tipo: 'noticias', comarca: elegida.id, de: elegida.duenyo };
}
