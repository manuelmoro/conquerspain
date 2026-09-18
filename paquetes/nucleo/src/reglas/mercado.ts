// Casacion de una plaza (docs/02-diseno-nucleo.md §2.4.4 y docs/03-economia.md §3.10.3; ficha
// T-037 §4.3 y §4.4). Es una funcion pura: recibe las lineas de compra y de venta de un recurso en
// una plaza y devuelve el precio nuevo y lo que casa cada linea.
//
// El orden de las lineas de entrada no influye en nada: los repartos y los empates dependen de
// precios, de la huella del jugador y de la clave de cada linea, jamas de quien llego antes.
import type { DatosMercado, DatosRecurso } from '../tipos/reglas.ts';
import { multiplicarFactores, porcentaje, repartoProporcional } from '../utiles/enteros.ts';
import { comparar } from '../utiles/orden.ts';
import { cupoDeMenores, limitesDeMenores } from './mercaderesMenores.ts';
import { desequilibrioMil, nuevoPrecioMil } from './precios.ts';

export type OperacionDeMercado = 'comprar' | 'vender';

/** Por que una linea no casa todo lo que podia. */
export type MotivoSinCasar =
  'precio-limite' | 'sin-fondos' | 'volumen-de-plaza' | 'sin-contraparte';

export interface LineaDePlaza {
  /** Unica dentro de la plaza y el recurso; es el ultimo desempate. */
  readonly clave: string;
  readonly jugador: string;
  readonly operacion: OperacionDeMercado;
  /** Techo en unidades: lo que lleva la recua (si vende) o lo que le cabe en el porte (si compra). */
  readonly cantidad: number;
  /** Minimo al que vende o maximo al que compra, en milesimas de maravedi por carga. */
  readonly limiteMil: number;
  /** Maravedis con los que cuenta para comprar; al vender no se mira. */
  readonly fondos: number;
  readonly comisionMil: number;
}

export interface EntradaDePlaza {
  /** Precio vigente de la plaza antes de este turno. */
  readonly precioMil: number;
  readonly recurso: DatosRecurso;
  /** Cargas que la plaza absorbe este turno, ya con el multiplicador de su volumen. */
  readonly tope: number;
  readonly lineas: readonly LineaDePlaza[];
  readonly tabla: DatosMercado;
  /** Desempate final entre jugadores: el menor gana. Sale de hash(partida, turno, plaza, jugador). */
  readonly desempate: (jugador: string) => number;
}

export interface ResultadoDeLinea {
  readonly clave: string;
  readonly casada: number;
  readonly conJugadores: number;
  readonly conMenores: number;
  /** Maravedis que cobra (vende) o que paga sin comision (compra). */
  readonly importe: number;
  readonly comision: number;
  readonly motivo: MotivoSinCasar | null;
}

export interface ResultadoDePlaza {
  readonly precioAnteriorMil: number;
  readonly precioMil: number;
  readonly demanda: number;
  readonly oferta: number;
  readonly desequilibrioMil: number;
  readonly cupoDeMenores: number;
  /** Lo que los menores compran a los jugadores y lo que les venden. */
  readonly menoresCompran: number;
  readonly menoresVenden: number;
  /** Cargas que han cambiado de manos con algun jugador, contando una sola vez las que casan entre ellos. */
  readonly volumen: number;
  /** Una por linea de entrada, ordenadas por clave. */
  readonly lineas: readonly ResultadoDeLinea[];
}

// ——— Importes ———————————————————————————————————————————————————————————————

/** Lo que cobra el que vende: se redondea a la baja. */
export function importeDeVenta(cantidad: number, precioMil: number): number {
  return multiplicarFactores(cantidad, [precioMil]);
}

/** Lo que paga el que compra: se redondea al alza, para que los maravedis no salgan de la nada. */
export function importeDeCompra(cantidad: number, precioMil: number): number {
  return -multiplicarFactores(-cantidad, [precioMil]);
}

export function comisionDe(importe: number, comisionMil: number): number {
  return porcentaje(importe, comisionMil);
}

/** Lo que cuesta comprar esa cantidad a ese precio: importe y comision. */
export function costeDeCompra(
  cantidad: number,
  precioMil: number,
  comisionMil: number,
): { readonly importe: number; readonly comision: number; readonly total: number } {
  const importe = importeDeCompra(cantidad, precioMil);
  const comision = comisionDe(importe, comisionMil);
  return { importe, comision, total: importe + comision };
}

/** Lo mas que se puede comprar, hasta `cantidad`, con esos maravedis a ese precio. */
export function maximoComprable(
  cantidad: number,
  fondos: number,
  precioMil: number,
  comisionMil: number,
): number {
  let bajo = 0;
  let alto = cantidad;
  while (bajo < alto) {
    const medio = bajo + Math.ceil((alto - bajo) / 2);
    if (costeDeCompra(medio, precioMil, comisionMil).total <= fondos) bajo = medio;
    else alto = medio - 1;
  }
  return bajo;
}

// ——— Lineas ————————————————————————————————————————————————————————————————

/** Lo que puede hacer la linea a ese precio: nada si su limite no lo permite. */
function capacidadA(linea: LineaDePlaza, precioMil: number): number {
  if (linea.operacion === 'vender') return linea.limiteMil <= precioMil ? linea.cantidad : 0;
  if (linea.limiteMil < precioMil) return 0;
  return maximoComprable(linea.cantidad, linea.fondos, precioMil, linea.comisionMil);
}

interface LineaConCapacidad {
  readonly linea: LineaDePlaza;
  readonly capacidad: number;
}

function sumar(lineas: readonly LineaConCapacidad[]): number {
  return lineas.reduce((total, l) => total + l.capacidad, 0);
}

/**
 * Reparte lo disponible en proporcion a la capacidad de cada linea. El sobrante de los redondeos
 * va, entre los que tienen el mismo resto, al de mejor precio y luego al de menor huella: por eso
 * a `repartoProporcional` se le da el puesto del merito como identificador.
 */
function repartir(
  disponible: number,
  lineas: readonly LineaConCapacidad[],
  entrada: EntradaDePlaza,
): Map<string, number> {
  const ordenadas = [...lineas].sort((a, b) => {
    const mejor =
      a.linea.operacion === 'comprar'
        ? b.linea.limiteMil - a.linea.limiteMil
        : a.linea.limiteMil - b.linea.limiteMil;
    return (
      mejor ||
      entrada.desempate(a.linea.jugador) - entrada.desempate(b.linea.jugador) ||
      comparar(a.linea.jugador, b.linea.jugador) ||
      comparar(a.linea.clave, b.linea.clave)
    );
  });
  const puestos = ordenadas.map((l, puesto) => ({
    id: String(puesto).padStart(8, '0'),
    clave: l.linea.clave,
    cantidad: l.capacidad,
  }));
  const reparto = repartoProporcional(
    disponible,
    puestos.map(({ id, cantidad }) => ({ id, cantidad })),
  );
  return new Map(puestos.map((p) => [p.clave, reparto.get(p.id) ?? 0]));
}

function motivoDe(
  linea: LineaDePlaza,
  casada: number,
  precioMil: number,
  totalDelLado: number,
  tope: number,
): MotivoSinCasar | null {
  if (casada >= linea.cantidad) return null;
  const fueraDePrecio =
    linea.operacion === 'vender' ? linea.limiteMil > precioMil : linea.limiteMil < precioMil;
  if (fueraDePrecio) return 'precio-limite';
  if (linea.operacion === 'comprar' && casada >= capacidadA(linea, precioMil)) return 'sin-fondos';
  return totalDelLado >= tope ? 'volumen-de-plaza' : 'sin-contraparte';
}

// ——— Casacion ——————————————————————————————————————————————————————————————

export function casarPlaza(entrada: EntradaDePlaza): ResultadoDePlaza {
  const { tabla, recurso, tope } = entrada;
  const p0 = entrada.precioMil;
  const limites = limitesDeMenores(recurso.precioBaseMil, tabla);
  const compras = entrada.lineas.filter((l) => l.operacion === 'comprar');
  const ventas = entrada.lineas.filter((l) => l.operacion === 'vender');
  const conCapacidad = (lineas: readonly LineaDePlaza[], precioMil: number): LineaConCapacidad[] =>
    lineas
      .map((linea) => ({ linea, capacidad: capacidadA(linea, precioMil) }))
      .filter((l) => l.capacidad > 0);

  // 1. Precio nuevo, a partir de lo que se quiere comprar y vender al precio de hoy.
  const compras0 = sumar(conCapacidad(compras, p0));
  const ventas0 = sumar(conCapacidad(ventas, p0));
  const cupo = cupoDeMenores(tope, Math.min(compras0, ventas0), tabla);
  const demanda = compras0 + (p0 <= limites.compraHastaMil ? cupo : 0);
  const oferta = ventas0 + (p0 >= limites.vendeDesdeMil ? cupo : 0);
  const desMil = desequilibrioMil(demanda, oferta);
  const p1 = nuevoPrecioMil(p0, desMil, recurso, tabla);

  // 2. Casacion a ese precio: primero entre jugadores, con reparto proporcional del lado largo.
  const compradoras = conCapacidad(compras, p1);
  const vendedoras = conCapacidad(ventas, p1);
  const entreJugadores = Math.min(sumar(compradoras), sumar(vendedoras), tope);
  const conJugadoresCompra = repartir(entreJugadores, compradoras, entrada);
  const conJugadoresVenta = repartir(entreJugadores, vendedoras, entrada);

  // 3. Lo que sobra se lo quedan (o se lo dan) los menores, sin pasar del tope de la plaza.
  const restante = (
    lineas: readonly LineaConCapacidad[],
    hechas: ReadonlyMap<string, number>,
  ): LineaConCapacidad[] =>
    lineas
      .map((l) => ({ linea: l.linea, capacidad: l.capacidad - (hechas.get(l.linea.clave) ?? 0) }))
      .filter((l) => l.capacidad > 0);
  const cabeAun = Math.min(cupo, tope - entreJugadores);
  const cupoParaComprar = p1 <= limites.compraHastaMil ? cabeAun : 0;
  const cupoParaVender = p1 >= limites.vendeDesdeMil ? cabeAun : 0;
  const conMenoresVenta = repartir(
    cupoParaComprar,
    restante(vendedoras, conJugadoresVenta),
    entrada,
  );
  const conMenoresCompra = repartir(
    cupoParaVender,
    restante(compradoras, conJugadoresCompra),
    entrada,
  );

  // 4. Lo que casa cada linea, con sus importes.
  const totalDeCompras = compradoras.reduce(
    (t, l) =>
      t + (conJugadoresCompra.get(l.linea.clave) ?? 0) + (conMenoresCompra.get(l.linea.clave) ?? 0),
    0,
  );
  const totalDeVentas = vendedoras.reduce(
    (t, l) =>
      t + (conJugadoresVenta.get(l.linea.clave) ?? 0) + (conMenoresVenta.get(l.linea.clave) ?? 0),
    0,
  );
  const lineas = [...entrada.lineas]
    .sort((a, b) => comparar(a.clave, b.clave))
    .map((linea): ResultadoDeLinea => {
      const compra = linea.operacion === 'comprar';
      const conJugadores = (compra ? conJugadoresCompra : conJugadoresVenta).get(linea.clave) ?? 0;
      const conMenores = (compra ? conMenoresCompra : conMenoresVenta).get(linea.clave) ?? 0;
      const casada = conJugadores + conMenores;
      const importe = compra ? importeDeCompra(casada, p1) : importeDeVenta(casada, p1);
      return {
        clave: linea.clave,
        casada,
        conJugadores,
        conMenores,
        importe,
        comision: comisionDe(importe, linea.comisionMil),
        motivo: motivoDe(linea, casada, p1, compra ? totalDeCompras : totalDeVentas, tope),
      };
    });

  return {
    precioAnteriorMil: p0,
    precioMil: p1,
    demanda,
    oferta,
    desequilibrioMil: desMil,
    cupoDeMenores: cupo,
    menoresCompran: [...conMenoresVenta.values()].reduce((t, v) => t + v, 0),
    menoresVenden: [...conMenoresCompra.values()].reduce((t, v) => t + v, 0),
    volumen: totalDeVentas + totalDeCompras - entreJugadores,
    lineas,
  };
}
