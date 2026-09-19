// Los escenarios del ejecutor (ficha T-046 §4.2): cambian las reglas de la partida del banco.
import type { TablasDeReglas } from '@conquer/nucleo';

import { reglasDeHambre } from './hambre.ts';

export interface Escenario {
  readonly descripcion: string;
  reglas(base: TablasDeReglas): TablasDeReglas;
}

export const ESCENARIOS = {
  normal: {
    descripcion: 'Las reglas del juego tal cual.',
    reglas: (base: TablasDeReglas) => base,
  },
  hambre: {
    descripcion: 'Granero casi vacío y una sola granja al empezar.',
    reglas: reglasDeHambre,
  },
} as const satisfies Record<string, Escenario>;

export type NombreDeEscenario = keyof typeof ESCENARIOS;
