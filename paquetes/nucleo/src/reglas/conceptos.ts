// En que se gasta y de donde viene cada recurso (ficha T-126 §2.1). Cada cambio del almacen lleva su
// motivo, escrito por la fase que lo causa («produccion de c-12», «orden o-3-mesta-a1»…); aqui se lee
// ese motivo y se dice a que concepto pertenece y a que cosa se refiere, para que la interfaz lo cuente
// en castellano. Vive junto al motor porque los motivos los escribe el motor: si una fase cambia uno,
// las pruebas de este modulo lo delatan.

export const CLASES_DE_CONCEPTO = [
  'produccion',
  'insumos',
  'comida',
  'cuadrillas',
  'conservar',
  'merma',
  'aperos',
  'administracion',
  'deuda',
  'orden',
  'devolucion',
  'obra',
  'derribo',
  'peregrinos',
  'carga',
  'descarga',
  'repuesto',
  'bastimento',
  'venta',
  'disolver',
  'queso',
  'esquileo',
  'contrato',
  'deposito',
  'devolucion-deposito',
  'prestamo',
  'portazgo',
  'soldada',
  'rescate',
  'otro',
] as const;
export type ClaseDeConcepto = (typeof CLASES_DE_CONCEPTO)[number];

export interface ConceptoDeMovimiento {
  readonly clase: ClaseDeConcepto;
  /**
   * A que se refiere: una comarca, una orden, una obra, una recua, un rebanyo, un contrato, una
   * mesnada, un edificio o un paso de portazgo, segun la clase. Null si el concepto es del jugador
   * entero (lo que come su gente). En `otro`, el motivo tal cual.
   */
  readonly ref: string | null;
}

/** Motivos fijos, sin nada a lo que referirse. */
const FIJOS: Readonly<Record<string, ClaseDeConcepto>> = {
  'pan de la poblacion': 'comida',
  'pan de las cuadrillas': 'cuadrillas',
  'sal para conservar el pan': 'conservar',
  'merma del pan': 'merma',
  'deuda de administracion': 'deuda',
};

/**
 * Motivos con lo que nombran detras de un prefijo. El orden importa: los prefijos mas largos van
 * antes que los que empiezan igual («devolucion del deposito del contrato» antes que «devolucion del
 * contrato»).
 */
const CON_REFERENCIA: readonly (readonly [string, ClaseDeConcepto])[] = [
  ['produccion de ', 'produccion'],
  ['insumos de ', 'insumos'],
  ['aperos de ', 'aperos'],
  ['administracion de ', 'administracion'],
  ['devolucion de la orden ', 'devolucion'],
  ['devolucion de la letra ', 'devolucion'],
  ['devolucion del deposito del contrato ', 'devolucion-deposito'],
  ['devolucion del contrato ', 'prestamo'],
  ['deposito del contrato ', 'deposito'],
  ['orden ', 'orden'],
  ['obra ', 'obra'],
  ['derribo de ', 'derribo'],
  ['peregrinos de ', 'peregrinos'],
  ['carga de ', 'carga'],
  ['descarga de ', 'descarga'],
  ['repuesto de ', 'repuesto'],
  ['bastimento de ', 'bastimento'],
  ['venta de ', 'venta'],
  ['se disuelve ', 'disolver'],
  ['queso y corderos de ', 'queso'],
  ['esquileo de ', 'esquileo'],
  ['contrato ', 'contrato'],
  ['portazgo de ', 'portazgo'],
  ['mantenimiento de ', 'soldada'],
  ['rescate de ', 'rescate'],
];

export function conceptoDeMovimiento(motivo: string): ConceptoDeMovimiento {
  const fijo = FIJOS[motivo];
  if (fijo !== undefined) return { clase: fijo, ref: null };
  for (const [prefijo, clase] of CON_REFERENCIA) {
    if (motivo.startsWith(prefijo) && motivo.length > prefijo.length) {
      return { clase, ref: motivo.slice(prefijo.length) };
    }
  }
  return { clase: 'otro', ref: motivo };
}
