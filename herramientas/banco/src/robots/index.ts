// Los ocho robots del banco, uno por casa (ficha T-046 §4.1).
import type { Casa, ComarcaMundo } from '@conquer/nucleo';

import { ARRIEROS } from './arrieros.ts';
import { CANTEROS } from './canteros.ts';
import { FERRONES } from './ferrones.ts';
import { HORTELANOS } from './hortelanos.ts';
import { MERCADERES } from './mercaderes.ts';
import { MESTA } from './mesta.ts';
import { MONJES } from './monjes.ts';
import type { Estrategia, Robot } from './robot.ts';
import { crearRobot } from './robot.ts';
import { SALINEROS } from './salineros.ts';

export type { Robot } from './robot.ts';

export const ESTRATEGIAS: Readonly<Record<Casa, Estrategia>> = {
  mesta: MESTA,
  ferrones: FERRONES,
  canteros: CANTEROS,
  mercaderes: MERCADERES,
  monjes: MONJES,
  salineros: SALINEROS,
  arrieros: ARRIEROS,
  hortelanos: HORTELANOS,
};

/** Como elige cada robot su origen entre los tres sorteados: por lo que vale para su via. */
export function origenPreferido(casa: Casa, comarca: ComarcaMundo): number {
  return ESTRATEGIAS[casa].perfil.valorDe(comarca);
}

/** El robot de una casa, que decide cada `cadencia` turnos. */
export function robotDe(casa: Casa, cadencia = 1): Robot {
  return crearRobot(ESTRATEGIAS[casa], cadencia);
}
