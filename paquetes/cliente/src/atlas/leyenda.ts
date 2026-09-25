// La leyenda y la explicacion de cada modo del mapa (ficha T-088 §2.5), con los colores de la paleta.
import { POTENCIALES } from '@conquer/nucleo';
import type { VistaJugador } from '@conquer/nucleo';

import { NOMBRE_DE_POTENCIAL } from '../nombres.ts';
import type { ModoDeAtlas } from './componer.ts';
import { COLOR_DE_CASA, COLOR_DE_POTENCIAL, COLOR_NEUTRAL, COLOR_PROPIO } from './paleta.ts';

export interface EntradaDeLeyenda {
  readonly texto: string;
  /** Un color de relleno, o una clase de trazo para los caminos. */
  readonly color?: string;
  readonly trazo?: string;
}

export const EXPLICACION_DE_MODO: Readonly<Record<ModoDeAtlas, string>> = {
  economico: 'Qué da cada comarca que conoces: el color es lo que más produce.',
  logistico: 'Los caminos: grosor según su calidad, jornadas de cada tramo y puertos cerrados.',
  politico: 'De quién es cada comarca, y tu influencia en las que no son de nadie.',
};

export function leyendaDe(modo: ModoDeAtlas, vista: VistaJugador): EntradaDeLeyenda[] {
  if (modo === 'economico') {
    return POTENCIALES.map((p) => ({
      texto: NOMBRE_DE_POTENCIAL[p],
      color: COLOR_DE_POTENCIAL[p],
    }));
  }
  if (modo === 'politico') {
    const otras = vista.casas.filter((c) => c.id !== vista.jugador.id);
    return [
      { texto: 'tuyas', color: COLOR_PROPIO },
      ...otras.map((c) => ({ texto: c.nombre, color: COLOR_DE_CASA[c.casa] })),
      { texto: 'de nadie', color: COLOR_NEUTRAL },
    ];
  }
  return [
    { texto: 'vereda', trazo: 'calidad-vereda' },
    { texto: 'calzada', trazo: 'calidad-calzada' },
    { texto: 'cañada', trazo: 'canyada' },
    { texto: 'puerto cerrado', trazo: 'puerto-cerrado' },
  ];
}
