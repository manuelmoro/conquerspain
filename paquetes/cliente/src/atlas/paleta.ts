// Los colores del mapa, en un solo sitio (ficha T-088 §2.5): los usan la composicion y la leyenda, asi
// nunca dicen cosas distintas.
import type { Casa, Potencial } from '@conquer/nucleo';

export const COLOR_DE_POTENCIAL: Readonly<Record<Potencial, string>> = {
  labor: '#e2c46b',
  monte: '#9fb07a',
  pasto: '#c5cf8c',
  piedra: '#c9b9a0',
  hierro: '#a9a2a8',
  sal: '#f1ece4',
  pesca: '#a7c4c8',
};

export const COLOR_PROPIO = '#1f4e9c';
export const COLOR_NEUTRAL = '#efe6d2';

export const COLOR_DE_CASA: Readonly<Record<Casa, string>> = {
  mesta: '#b0763a',
  ferrones: '#5a5f66',
  canteros: '#9a8f80',
  mercaderes: '#8a3a5c',
  monjes: '#6b4f2a',
  salineros: '#7aa0b8',
  arrieros: '#c08a2a',
  hortelanos: '#5f8a3a',
};
