// En que se gasta y de donde viene cada recurso (ficha T-126 §2.3): cada concepto del desglose en una
// frase, y la suma de varios turnos. Puro: la pantalla solo lo pinta.
import { TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type { ClaseDeConcepto, Orden, Recurso } from '@conquer/nucleo';

import type { PartidaDelDesglose, TurnoDelHistorial } from './api.ts';

export interface NombresDelDesglose {
  readonly comarca: (id: string) => string;
  /** Una recua, un rebanyo o una mesnada propios; si ya no existen, uno generico. */
  readonly unidad: (id: string) => string;
  readonly orden: (id: string) => Orden | undefined;
  /** La orden en una frase (la de la bandeja, `fraseDeOrden`). */
  readonly frase: (orden: Orden) => string;
  readonly obra: (id: string) => { readonly que: string; readonly comarca: string } | undefined;
}

function nombreDeObra(que: string): string {
  const edificios: Readonly<Record<string, { readonly nombre: string }>> =
    TABLAS_DEL_JUEGO.edificios;
  const mayores: Readonly<Record<string, { readonly nombre: string }>> =
    TABLAS_DEL_JUEGO.obrasMayores;
  return (edificios[que] ?? mayores[que])?.nombre.toLowerCase() ?? 'una obra';
}

type Texto = (ref: string, n: NombresDelDesglose, delta: number) => string;

/** Una frase por concepto. Completa por tipo: si el nucleo anyade una clase, esto no compila. */
const TEXTO: Readonly<Record<ClaseDeConcepto, Texto>> = {
  produccion: (ref, n) => `Producción de ${n.comarca(ref)}`,
  insumos: (ref, n) => `Lo que gastan los talleres de ${n.comarca(ref)}`,
  comida: () => 'Lo que come tu gente',
  cuadrillas: () => 'Lo que comen las cuadrillas de obra',
  conservar: () => 'Sal para conservar el pan',
  merma: () => 'Pan que se echa a perder',
  aperos: (ref, n) => `Hierro para los aperos de ${n.comarca(ref)}`,
  administracion: (ref, n) => `Administración de ${n.comarca(ref)}`,
  deuda: () => 'Pago de la deuda de administración',
  orden: (ref, n) => {
    const orden = n.orden(ref);
    return orden === undefined ? 'Una orden tuya' : n.frase(orden);
  },
  devolucion: (ref, n) => {
    const orden = n.orden(ref);
    return orden === undefined
      ? 'Te devuelven lo de una orden que no salió'
      : `Te devuelven lo de: ${n.frase(orden)}`;
  },
  obra: (ref, n) => {
    const obra = n.obra(ref);
    return obra === undefined
      ? 'Plazo de una obra mayor'
      : `Plazo de la obra: ${nombreDeObra(obra.que)} en ${n.comarca(obra.comarca)}`;
  },
  derribo: (ref) => `Lo que se recupera al derribar ${nombreDeObra(ref)}`,
  peregrinos: (ref, n) => `Peregrinos de la catedral de ${n.comarca(ref)}`,
  carga: (ref, n) => `Cargado en ${n.unidad(ref)}`,
  descarga: (ref, n) => `Descargado de ${n.unidad(ref)}`,
  repuesto: (ref, n) => `Acémilas de repuesto para ${n.unidad(ref)}`,
  bastimento: (ref, n) => `Bastimento de ${n.unidad(ref)}`,
  venta: (ref, n) => `Lo que cobra tu venta de ${n.comarca(ref)}`,
  disolver: (ref, n) => `Al disolver ${n.unidad(ref)}`,
  queso: (ref, n) => `Queso y corderos de ${n.unidad(ref)}`,
  esquileo: (ref, n) => `Esquileo de ${n.unidad(ref)}`,
  contrato: (_ref, _n, delta) => (delta > 0 ? 'Cobro de un contrato' : 'Pago de un contrato'),
  deposito: () => 'Depósito de un contrato',
  'devolucion-deposito': () => 'Te devuelven el depósito de un contrato',
  prestamo: (_ref, _n, delta) => (delta > 0 ? 'Te devuelven un préstamo' : 'Devuelves un préstamo'),
  portazgo: (_ref, _n, delta) => (delta > 0 ? 'Portazgos que cobras' : 'Portazgos que pagas'),
  soldada: (ref, n) => `Soldada de ${n.unidad(ref)}`,
  rescate: (ref, n, delta) =>
    delta > 0 ? `Rescate cobrado por ${n.comarca(ref)}` : `Rescate pagado por ${n.comarca(ref)}`,
  otro: (ref) => ref,
};

export function textoDeConcepto(p: PartidaDelDesglose, n: NombresDelDesglose): string {
  return TEXTO[p.clase](p.ref ?? '', n, p.delta);
}

export interface LineaDelDesglose {
  readonly texto: string;
  readonly delta: number;
}

/**
 * El desglose de un recurso en los turnos dados, sumado por concepto, en dos listas: lo que entro y
 * lo que salio, de mayor a menor. Dos conceptos que se dicen igual (dos ordenes iguales) se suman.
 */
export function desgloseDe(
  turnos: readonly TurnoDelHistorial[],
  recurso: Recurso,
  n: NombresDelDesglose,
): { readonly entra: readonly LineaDelDesglose[]; readonly sale: readonly LineaDelDesglose[] } {
  const suma = new Map<string, number>();
  for (const t of turnos) {
    for (const p of t.recursos[recurso].desglose) {
      const texto = textoDeConcepto(p, n);
      suma.set(texto, (suma.get(texto) ?? 0) + p.delta);
    }
  }
  const lineas = [...suma.entries()].map(([texto, delta]) => ({ texto, delta }));
  const porTamanyo = (a: LineaDelDesglose, b: LineaDelDesglose): number =>
    Math.abs(b.delta) - Math.abs(a.delta) || (a.texto < b.texto ? -1 : 1);
  return {
    entra: lineas.filter((l) => l.delta > 0).sort(porTamanyo),
    sale: lineas.filter((l) => l.delta < 0).sort(porTamanyo),
  };
}
