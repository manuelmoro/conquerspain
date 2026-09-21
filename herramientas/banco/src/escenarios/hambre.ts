// Escenario «hambre»: todas las casas empiezan con el granero casi vacio, una sola granja y sin el
// ajuste del arranque a su comarca. Sirve para ver quien sale del primer invierno y quien se queda
// en escasez cronica: la alerta de §4.5 tiene que saltar aqui antes que en ninguna otra partida.
import type { TablasDeReglas } from '@conquer/nucleo';

/** Lo que se quita al arranque: el pan de la despensa y el ajuste a la comarca. */
export const PAN_DE_ARRANQUE_CON_HAMBRE = 10;

export function reglasDeHambre(reglas: TablasDeReglas): TablasDeReglas {
  return {
    ...reglas,
    arranque: {
      ...reglas.arranque,
      almacen: { ...reglas.arranque.almacen, pan: PAN_DE_ARRANQUE_CON_HAMBRE },
      edificiosDeOrigen: { ...reglas.arranque.edificiosDeOrigen, granja: 1 },
      ajuste: { ...reglas.arranque.ajuste, activo: false },
    },
  };
}
