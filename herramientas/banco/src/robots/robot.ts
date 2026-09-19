// Un robot es una estrategia escrita a mano, no una IA (ficha T-046 §4.1): una funcion pura que,
// dada la vista de su jugador, devuelve ordenes. Juega la via de su casa con prioridades simples y
// sin trampas: todo lo que sabe pasa por el `Tablero`, que solo ensenya lo que el jugador ve.
import type { Casa, Mundo, Orden, TablasDeReglas, VistaJugador } from '@conquer/nucleo';

import type { Decision, Papel, Perfil, Rutina } from './impulsos.ts';
import { decidirComoSiempre } from './impulsos.ts';
import { Pedidos } from './pedidos.ts';
import { Tablero } from './tablero.ts';

export interface Robot {
  readonly casa: Casa;
  readonly nombre: string;
  /** Cada cuantos turnos entra: 1 es el jugador diligente; 6, el que deja colas y mayordomo. */
  readonly cadencia: number;
  decidir(vista: VistaJugador, mundo: Mundo, reglas: TablasDeReglas): Orden[];
}

/** Lo que distingue a un robot: su perfil, lo que hace por su via y sus rutinas de recua propias. */
export interface Estrategia {
  readonly perfil: Perfil;
  readonly via: (d: Decision) => void;
  readonly rutinas?: Partial<Record<Papel, Rutina>>;
}

export function crearRobot(estrategia: Estrategia, cadencia = 1): Robot {
  const { perfil, via, rutinas } = estrategia;
  return {
    casa: perfil.casa,
    nombre: perfil.nombre,
    cadencia,
    decidir(vista, mundo, reglas) {
      const t = new Tablero(vista, mundo, reglas);
      const d: Decision = { t, p: new Pedidos(t), perfil, cadencia };
      return [...decidirComoSiempre(d, via, rutinas)];
    },
  };
}

/** No hace nada mas que lo comun. */
export function sinVia(): void {
  // Algunas casas no tienen nada propio que hacer cada turno: su via esta en su perfil.
}
