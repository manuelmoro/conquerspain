// El arte del cliente (ficha T-090 §2.3): el emblema de cada casa, la vinyeta de cada entorno de origen y
// la peninsula de la portada, y el sello del juego. Son SVG propios (los emblemas, dibujados para el juego; las vinyetas, de la
// maqueta) o generados por script (la peninsula), servidos como imagenes: nada se inyecta como HTML.
import type { Casa, Potencial } from '@conquer/nucleo';

import arrieros from './casas/arrieros.svg';
import canteros from './casas/canteros.svg';
import ferrones from './casas/ferrones.svg';
import hortelanos from './casas/hortelanos.svg';
import mercaderes from './casas/mercaderes.svg';
import mesta from './casas/mesta.svg';
import monjes from './casas/monjes.svg';
import salineros from './casas/salineros.svg';
import agricola from './entornos/agricola.svg';
import costa from './entornos/costa.svg';
import forestal from './entornos/forestal.svg';
import logo from './logo.svg';
import pastos from './entornos/pastos.svg';
import serrano from './entornos/serrano.svg';
import peninsula from './peninsula.svg';

export const EMBLEMA_DE_CASA: Readonly<Record<Casa, string>> = {
  mesta,
  ferrones,
  canteros,
  mercaderes,
  monjes,
  salineros,
  arrieros,
  hortelanos,
};

/** La vinyeta del entorno de un origen, por el potencial que lo define. */
export const VINYETA_DE_PERFIL: Readonly<Record<Potencial, string>> = {
  labor: agricola,
  monte: forestal,
  pasto: pastos,
  piedra: serrano,
  hierro: serrano,
  sal: costa,
  pesca: costa,
};

export const PENINSULA = peninsula;

/** El sello de ConquerSpain: la peninsula en lacre, con una canyada y un castillo. Va en la cabecera y
 * como icono del navegador (index.html). */
export const LOGO = logo;
