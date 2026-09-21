// Trazabilidad del arbitraje (ficha T-048 §4.2).
//
// Que una casa compre lana en una plaza y venda lana en otra no prueba ningun negocio: puede ser
// lana que produjo ella, o una venta anterior a la compra. Aqui se sigue cada carga comprada
// —quien la compro, cuando, donde y por cuanto— hasta que se vende, y solo entonces se cuenta un
// negocio, con su margen. Lo que no se puede atribuir a una compra se publica aparte, no se calla.
import { comparar, multiplicarFactores, repartoProporcional } from '@conquer/nucleo';
import type { Recurso, Recursos, Suceso, TablasDeReglas } from '@conquer/nucleo';

/** Un trato cerrado en una plaza, tal como lo cuenta el suceso `mercado.trato`. */
export interface Trato {
  readonly jugador: string;
  readonly recua: string;
  readonly mercado: string;
  readonly recurso: Recurso;
  readonly operacion: 'comprar' | 'vender';
  readonly cantidad: number;
  readonly importe: number;
  readonly comision: number;
}

/** Una compra seguida de la venta de esa misma mercancia en otra plaza. */
export interface Negocio {
  readonly jugador: string;
  readonly recua: string;
  readonly recurso: Recurso;
  readonly plazaDeCompra: string;
  readonly turnoDeCompra: number;
  readonly plazaDeVenta: string;
  readonly turnoDeVenta: number;
  readonly cargas: number;
  /** Lo que costo comprarlas, con su comision. */
  readonly costeDeCompra: number;
  /** Lo que se cobro por ellas, ya descontada la comision de la venta. */
  readonly ingresoDeVenta: number;
  /** Bastimento que gasto la recua mientras las llevaba encima. */
  readonly bastimento: { readonly pan: number; readonly sal: number };
  readonly margen: number;
  /** El margen menos el bastimento, valorado al precio base de cada recurso. */
  readonly margenNeto: number;
}

/** Mercancia vendida que no viene de ninguna compra de esa recua: produccion propia o carga de casa. */
export interface VentaSinCompra {
  readonly jugador: string;
  readonly recua: string;
  readonly recurso: Recurso;
  readonly plaza: string;
  readonly turno: number;
  readonly cargas: number;
  readonly ingreso: number;
}

export interface TrazaDeNegocios {
  readonly negocios: readonly Negocio[];
  /** Ventas en la misma plaza en que se compro: no son arbitraje, pero si mercancia comprada. */
  readonly reventas: readonly Negocio[];
  readonly ventasSinCompra: readonly VentaSinCompra[];
  /** Cargas compradas que salieron de la recua sin venderse (se descargaron en casa). */
  readonly cargasDescargadas: number;
  /** Bastimento gastado por recuas que no llevaban ninguna carga comprada. */
  readonly bastimentoSinCarga: { readonly pan: number; readonly sal: number };
}

interface Lote {
  readonly jugador: string;
  readonly recua: string;
  readonly recurso: Recurso;
  readonly plaza: string;
  readonly turno: number;
  cargas: number;
  coste: number;
  pan: number;
  sal: number;
}

function texto(valor: number | string | undefined): string {
  return valor === undefined ? '' : String(valor);
}

function numero(valor: number | string | undefined): number {
  return typeof valor === 'number' ? valor : 0;
}

/** El trato que cuenta un suceso `mercado.trato`, o null si el suceso es otra cosa. */
export function tratoDeSuceso(suceso: Suceso): Trato | null {
  if (suceso.tipo !== 'mercado.trato' || suceso.jugador === null) return null;
  const operacion = texto(suceso.datos['operacion']);
  const cantidad = numero(suceso.datos['cantidad']);
  if ((operacion !== 'comprar' && operacion !== 'vender') || cantidad <= 0) return null;
  return {
    jugador: suceso.jugador,
    recua: texto(suceso.datos['recua']),
    mercado: texto(suceso.datos['mercado']),
    recurso: texto(suceso.datos['recurso']) as Recurso,
    operacion,
    cantidad,
    importe: numero(suceso.datos['importe']),
    comision: numero(suceso.datos['comision']),
  };
}

/** La parte de `total` que corresponde a `cantidad` de `de`, truncando hacia abajo. */
function parte(total: number, cantidad: number, de: number): number {
  if (de <= 0 || cantidad <= 0) return 0;
  if (cantidad >= de) return total;
  return Math.floor((total * cantidad) / de);
}

/**
 * El libro de los lotes comprados: una cola por recua y recurso, que se consume en el orden en que
 * se compro (lo primero que entra es lo primero que sale).
 */
export class LibroDeNegocios {
  private readonly lotes = new Map<string, Lote[]>();
  private readonly negocios: Negocio[] = [];
  private readonly reventas: Negocio[] = [];
  private readonly sinCompra: VentaSinCompra[] = [];
  private readonly descargadas = new Map<string, number>();
  private readonly sinCarga = new Map<string, { pan: number; sal: number }>();

  constructor(private readonly reglas: TablasDeReglas) {}

  private cola(recua: string, recurso: Recurso): Lote[] {
    const clave = `${recua}|${recurso}`;
    const cola = this.lotes.get(clave) ?? [];
    if (!this.lotes.has(clave)) this.lotes.set(clave, cola);
    return cola;
  }

  anotarTrato(turno: number, trato: Trato): void {
    if (trato.operacion === 'comprar') this.comprar(turno, trato);
    else this.vender(turno, trato);
  }

  private comprar(turno: number, trato: Trato): void {
    this.cola(trato.recua, trato.recurso).push({
      jugador: trato.jugador,
      recua: trato.recua,
      recurso: trato.recurso,
      plaza: trato.mercado,
      turno,
      cargas: trato.cantidad,
      coste: trato.importe + trato.comision,
      pan: 0,
      sal: 0,
    });
  }

  private vender(turno: number, trato: Trato): void {
    const cola = this.cola(trato.recua, trato.recurso);
    let quedan = trato.cantidad;
    let ingreso = trato.importe - trato.comision;
    while (quedan > 0 && cola.length > 0) {
      const lote = cola[0];
      if (lote === undefined) break;
      const cargas = Math.min(quedan, lote.cargas);
      const coste = parte(lote.coste, cargas, lote.cargas);
      const pan = parte(lote.pan, cargas, lote.cargas);
      const sal = parte(lote.sal, cargas, lote.cargas);
      const cobrado = parte(ingreso, cargas, quedan);
      const negocio = this.componer(lote, trato, turno, cargas, coste, cobrado, pan, sal);
      (lote.plaza === trato.mercado ? this.reventas : this.negocios).push(negocio);
      lote.cargas -= cargas;
      lote.coste -= coste;
      lote.pan -= pan;
      lote.sal -= sal;
      if (lote.cargas === 0) cola.shift();
      quedan -= cargas;
      ingreso -= cobrado;
    }
    if (quedan > 0) {
      this.sinCompra.push({
        jugador: trato.jugador,
        recua: trato.recua,
        recurso: trato.recurso,
        plaza: trato.mercado,
        turno,
        cargas: quedan,
        ingreso,
      });
    }
  }

  private componer(
    lote: Lote,
    trato: Trato,
    turno: number,
    cargas: number,
    coste: number,
    ingreso: number,
    pan: number,
    sal: number,
  ): Negocio {
    const margen = ingreso - coste;
    const viaje =
      multiplicarFactores(pan, [this.reglas.recursos.pan.precioBaseMil]) +
      multiplicarFactores(sal, [this.reglas.recursos.sal.precioBaseMil]);
    return {
      jugador: lote.jugador,
      recua: lote.recua,
      recurso: lote.recurso,
      plazaDeCompra: lote.plaza,
      turnoDeCompra: lote.turno,
      plazaDeVenta: trato.mercado,
      turnoDeVenta: turno,
      cargas,
      costeDeCompra: coste,
      ingresoDeVenta: ingreso,
      bastimento: { pan, sal },
      margen,
      margenNeto: margen - viaje,
    };
  }

  /**
   * Reparte el bastimento de un turno entre las cargas compradas que lleva la recua, en proporcion
   * a su tamanyo: el viaje lo paga la mercancia que va encima. Si no lleva ninguna, se apunta aparte.
   */
  anotarBastimento(jugador: string, recua: string, pan: number, sal: number): void {
    if (pan <= 0 && sal <= 0) return;
    const abiertos: Lote[] = [];
    for (const clave of [...this.lotes.keys()].sort(comparar)) {
      if (!clave.startsWith(`${recua}|`)) continue;
      abiertos.push(...(this.lotes.get(clave) ?? []));
    }
    if (abiertos.length === 0) {
      const suyo = this.sinCarga.get(jugador) ?? { pan: 0, sal: 0 };
      this.sinCarga.set(jugador, { pan: suyo.pan + pan, sal: suyo.sal + sal });
      return;
    }
    const peticiones = abiertos.map((lote, i) => ({
      id: String(i).padStart(4, '0'),
      cantidad: lote.cargas,
    }));
    const dePan = repartoProporcional(pan, peticiones);
    const deSal = repartoProporcional(sal, peticiones);
    abiertos.forEach((lote, i) => {
      const id = String(i).padStart(4, '0');
      lote.pan += dePan.get(id) ?? 0;
      lote.sal += deSal.get(id) ?? 0;
    });
  }

  /**
   * Lo que la recua ya no lleva encima no se puede vender despues: se descarta de sus lotes, de los
   * mas antiguos a los mas nuevos. Asi una venta de mercancia propia no se atribuye a una compra
   * que se descargo en casa hace veinte turnos.
   */
  ajustarCarga(jugador: string, recua: string, carga: Recursos | null): void {
    for (const clave of [...this.lotes.keys()].sort(comparar)) {
      if (!clave.startsWith(`${recua}|`)) continue;
      const cola = this.lotes.get(clave) ?? [];
      const recurso = clave.slice(recua.length + 1) as Recurso;
      let sobra = cola.reduce((total, lote) => total + lote.cargas, 0) - (carga?.[recurso] ?? 0);
      while (sobra > 0 && cola.length > 0) {
        const lote = cola[0];
        if (lote === undefined) break;
        const cargas = Math.min(sobra, lote.cargas);
        lote.coste -= parte(lote.coste, cargas, lote.cargas);
        lote.pan -= parte(lote.pan, cargas, lote.cargas);
        lote.sal -= parte(lote.sal, cargas, lote.cargas);
        lote.cargas -= cargas;
        this.descargadas.set(jugador, (this.descargadas.get(jugador) ?? 0) + cargas);
        sobra -= cargas;
        if (lote.cargas === 0) cola.shift();
      }
    }
  }

  /** La traza de un jugador, con todo en orden de turno: se puede leer como un libro de cuentas. */
  trazaDe(jugador: string): TrazaDeNegocios {
    const suyos = (lista: readonly Negocio[]): Negocio[] =>
      lista
        .filter((n) => n.jugador === jugador)
        .sort(
          (a, b) =>
            a.turnoDeVenta - b.turnoDeVenta ||
            comparar(a.recua, b.recua) ||
            comparar(a.recurso, b.recurso),
        );
    return {
      negocios: suyos(this.negocios),
      reventas: suyos(this.reventas),
      ventasSinCompra: this.sinCompra
        .filter((v) => v.jugador === jugador)
        .sort((a, b) => a.turno - b.turno || comparar(a.recua, b.recua)),
      cargasDescargadas: this.descargadas.get(jugador) ?? 0,
      bastimentoSinCarga: this.sinCarga.get(jugador) ?? { pan: 0, sal: 0 },
    };
  }
}
