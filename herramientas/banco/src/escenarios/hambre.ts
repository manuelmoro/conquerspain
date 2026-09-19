// Escenario «hambre»: todas las casas empiezan con el granero casi vacio y una sola granja. Sirve
// para ver quien sale del primer invierno y quien se queda en escasez cronica: la alerta de §4.5
// tiene que saltar aqui antes que en ninguna otra partida.
import type { TablasDeReglas } from '@conquer/nucleo';

/** Lo que se quita al arranque: el pan de la despensa y una de las dos granjas. */
export const PAN_DE_ARRANQUE_CON_HAMBRE = 10;

export function reglasDeHambre(reglas: TablasDeReglas): TablasDeReglas {
  return {
    ...reglas,
    arranque: {
      almacen: { ...reglas.arranque.almacen, pan: PAN_DE_ARRANQUE_CON_HAMBRE },
      edificiosDeOrigen: { ...reglas.arranque.edificiosDeOrigen, granja: 1 },
    },
  };
}
