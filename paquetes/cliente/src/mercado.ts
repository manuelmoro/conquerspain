// El mercado en palabras (ficha T-084 §4.3): la fecha y la fuente de cada precio, lo barato y lo caro
// frente al base de la comarca, y la orden de mercado con su precio limite. Puro: la pantalla pinta.
import type { FuenteDePrecios, PlazaEnPanel, PrecioEnPlaza, Recurso } from '@conquer/nucleo';

/** A partir de cuantos turnos un precio sabido «puede haber cambiado». */
export const TURNOS_DE_PRECIO_FRESCO = 6;

/** Lo que se aparta del base para llamarlo barato o caro: un 10 %. */
const MARGEN_MIL = 100;

const FUENTE: Readonly<Record<FuenteDePrecios, string>> = {
  visita: 'lo vio una recua tuya',
  corresponsal: 'te lo escribe un corresponsal',
  rumor: 'de oídas',
};

export interface FechaDePrecio {
  /** «de este turno, lo vio una recua tuya» / «de hace 5 turnos, de oídas». */
  readonly texto: string;
  /** Viejo: se pinta apagado y con el aviso de que puede haber cambiado. */
  readonly viejo: boolean;
}

/** La fecha y la fuente de los precios de una plaza: nunca un precio sin ellas (criterio 1). */
export function fechaDePrecio(plaza: PlazaEnPanel, turno: number): FechaDePrecio {
  if (plaza.turnoDelPrecio === null || plaza.fuente === null) {
    return {
      texto:
        'Aún no sabes sus precios. Se saben cuando una recua tuya llega a la plaza; también te llegan de oídas (rumores) desde tus ventas, las ferias y el Camino de Santiago.',
      viejo: true,
    };
  }
  const hace = Math.max(0, turno - plaza.turnoDelPrecio);
  const cuando =
    hace === 0
      ? 'de este turno'
      : hace === 1
        ? 'del turno pasado'
        : `de hace ${String(hace)} turnos`;
  const viejo = hace > TURNOS_DE_PRECIO_FRESCO;
  return {
    texto: `Precios ${cuando}, ${FUENTE[plaza.fuente]}${viejo ? ': pueden haber cambiado' : ''}.`,
    viejo,
  };
}

export type Valoracion = 'barato' | 'caro' | 'corriente';

/** Barato o caro frente al precio base de esa comarca (±10 %). */
export function valorar(precio: PrecioEnPlaza): Valoracion {
  const margen = Math.floor((precio.baseMil * MARGEN_MIL) / 1000);
  if (precio.mil <= precio.baseMil - margen) return 'barato';
  if (precio.mil >= precio.baseMil + margen) return 'caro';
  return 'corriente';
}

/** Un precio en maravedís por carga, con un decimal si hace falta: 3100 → «3,1». */
export function enMaravedis(mil: number): string {
  const decimas = Math.round(mil / 100);
  return decimas % 10 === 0
    ? String(decimas / 10)
    : `${String(Math.floor(decimas / 10))},${String(decimas % 10)}`;
}

/** El precio limite por defecto: el sabido, un 10 % a favor de quien da la orden. */
export function limitePorDefecto(operacion: 'comprar' | 'vender', mil: number): number {
  const margen = Math.floor((mil * MARGEN_MIL) / 1000);
  return operacion === 'vender' ? Math.max(0, mil - margen) : mil + margen;
}

export interface PedidoDeMercado {
  readonly plaza: string;
  readonly recua: string;
  /** La recua ya tiene el cometido `tratar`. */
  readonly trata: boolean;
  readonly operacion: 'comprar' | 'vender';
  readonly recurso: Recurso;
  readonly cantidad: number;
  readonly precioLimiteMil: number;
  readonly turnos: number;
}

/**
 * Lo que se manda, en orden: el cometido `tratar` si la recua no lo tiene (sin el, la orden espera),
 * y la orden de mercado con su precio limite.
 */
export function intencionesDeMercado(
  p: PedidoDeMercado,
): readonly Readonly<Record<string, unknown>>[] {
  const orden = {
    tipo: 'mercado',
    mercado: p.plaza,
    recua: p.recua,
    recurso: p.recurso,
    operacion: p.operacion,
    cantidad: Math.max(1, Math.floor(p.cantidad)),
    precioLimiteMil: Math.max(0, Math.floor(p.precioLimiteMil)),
    turnos: Math.min(24, Math.max(1, Math.floor(p.turnos))),
  };
  return p.trata ? [orden] : [{ tipo: 'cometido', recua: p.recua, cometido: 'tratar' }, orden];
}

/** Lo que el formulario sencillo sabe de la recua que va a tratar (ficha T-093). */
export interface RecuaQueTrata {
  /** Esta en una comarca propia: puede cargar del almacen antes de tratar. */
  readonly enCasa: boolean;
  readonly carga: Readonly<Record<Recurso, number>>;
  /** Lo que le cabe aun, sin contar los maravedis, que no ocupan. */
  readonly sitioLibre: number;
}

/** Los maravedis que hacen falta para comprar al precio limite, con la comision. */
export function maravedisParaComprar(
  cantidad: number,
  precioLimiteMil: number,
  comisionMil: number,
): number {
  const importeMil = Math.max(1, Math.floor(cantidad)) * precioLimiteMil;
  return Math.ceil((importeMil * (1000 + comisionMil)) / 1_000_000);
}

/**
 * Lo que se manda para comprar o vender con una recua, en orden: si esta en casa, cargar antes lo
 * que le falte (los maravedis para pagar, o la mercancia para vender); despues, el cometido y la
 * orden de mercado. Fuera de casa no se puede cargar: solo trata con lo que lleva.
 */
export function intencionesDeCompraventa(
  p: PedidoDeMercado,
  recua: RecuaQueTrata,
  comisionMil: number,
): readonly Readonly<Record<string, unknown>>[] {
  const falta =
    p.operacion === 'comprar'
      ? Math.max(
          0,
          maravedisParaComprar(p.cantidad, p.precioLimiteMil, comisionMil) - recua.carga.maravedis,
        )
      : Math.max(0, Math.floor(p.cantidad) - recua.carga[p.recurso]);
  const cargar =
    recua.enCasa && falta > 0
      ? [
          {
            tipo: 'carga',
            recua: p.recua,
            cargar: { [p.operacion === 'comprar' ? 'maravedis' : p.recurso]: falta },
            descargar: {},
            vecinosCargados: 0,
          },
        ]
      : [];
  return [...cargar, ...intencionesDeMercado(p)];
}

/** Lo que conviene saber antes de dar la orden: si no le alcanza o no le cabe. Vacio si va bien. */
export function avisosDeCompraventa(
  p: PedidoDeMercado,
  recua: RecuaQueTrata,
  comisionMil: number,
): readonly string[] {
  const avisos: string[] = [];
  const cantidad = Math.max(1, Math.floor(p.cantidad));
  if (p.operacion === 'comprar') {
    const hace = maravedisParaComprar(cantidad, p.precioLimiteMil, comisionMil);
    if (recua.enCasa)
      avisos.push(
        `Se le cargarán del almacén los maravedís que falten para pagar (hasta ${String(hace)}).`,
      );
    else if (recua.carga.maravedis < hace)
      avisos.push(
        `Lleva ${String(recua.carga.maravedis)} maravedís y harían falta ${String(hace)}: fuera de casa no puede cargar más.`,
      );
    if (recua.sitioLibre < cantidad)
      avisos.push(`Solo le caben ${String(recua.sitioLibre)} más: comprará como mucho eso.`);
    avisos.push('Lo comprado se queda en la recua: descárgalo en casa para que vaya al almacén.');
  } else if (recua.carga[p.recurso] < cantidad) {
    avisos.push(
      recua.enCasa
        ? 'Se le cargará del almacén lo que falte para vender.'
        : `Lleva ${String(recua.carga[p.recurso])} y quieres vender ${String(cantidad)}: venderá lo que lleve.`,
    );
  }
  return avisos;
}
