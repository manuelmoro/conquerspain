// Los siete recursos del juego (docs/03-economia.md §3.1): cuatro basicos que todos manejan y
// tres estrategicos que solo existen donde los puso la geografia.

export const RECURSOS = ['pan', 'madera', 'piedra', 'maravedis', 'sal', 'hierro', 'lana'] as const;

export type Recurso = (typeof RECURSOS)[number];

/** Cantidades enteras de cada recurso. Nunca negativas en el almacen. */
export type Recursos = Readonly<Record<Recurso, number>>;

/** Los recursos que se echan a perder si no se conservan (docs/03-economia.md §3.1). */
export const RECURSOS_PERECEDEROS = ['pan'] as const;

/** Unas cantidades de los siete recursos, calculadas una a una. */
export function recursosSegun(cantidad: (recurso: Recurso) => number): Recursos {
  return {
    pan: cantidad('pan'),
    madera: cantidad('madera'),
    piedra: cantidad('piedra'),
    maravedis: cantidad('maravedis'),
    sal: cantidad('sal'),
    hierro: cantidad('hierro'),
    lana: cantidad('lana'),
  };
}
