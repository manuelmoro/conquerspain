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
  /** Lo que implica, en pocas palabras (T-090: «vereda» sola no decia nada). */
  readonly nota?: string;
}

/**
 * Lo que ensenya cada vista del mapa y **para que sirve** (T-090: «no se para que valen los caminos»).
 * Las tres son el mismo mapa: solo cambia lo que se resalta.
 */
export const EXPLICACION_DE_MODO: Readonly<Record<ModoDeAtlas, string>> = {
  economico:
    'Qué da cada comarca que conoces: el color es lo que más produce. Sirve para decidir dónde construir y adónde ir a por sal, hierro o lana.',
  logistico:
    'Por dónde se viaja y cuánto cuesta: cada tramo dice sus jornadas; las calzadas son más rápidas, las cañadas son de los rebaños y los puertos de montaña se cierran en invierno. Sirve para planear las rutas de tus recuas.',
  politico:
    'De quién es cada comarca y tu influencia en las que no son de nadie (el número junto al nombre; con 60 la puedes incorporar). Sirve para ver quién tienes al lado y qué tierra puedes ganar.',
};

/** El boton de cada vista: la pregunta que responde. */
export const NOMBRE_DE_MODO: Readonly<Record<ModoDeAtlas, string>> = {
  economico: '🌾 Qué produce',
  logistico: '🛤️ Cómo se viaja',
  politico: '🏰 De quién es',
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
  // Lo que implica cada trazo para un viaje (docs/03 §3.7.2): para eso sirve esta vista.
  return [
    { texto: 'vereda', trazo: 'calidad-vereda', nota: 'camino sin hacer: el más lento' },
    {
      texto: 'calzada',
      trazo: 'calidad-calzada',
      nota: 'la mitad de jornadas, y nunca se cierra',
    },
    { texto: 'cañada', trazo: 'canyada', nota: 'los rebaños andan más y pastan por ella' },
    {
      texto: 'puerto cerrado',
      trazo: 'puerto-cerrado',
      nota: 'nieve: no se pasa hasta la primavera',
    },
  ];
}
