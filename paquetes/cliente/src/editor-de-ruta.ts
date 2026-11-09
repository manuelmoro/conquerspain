// El editor de ruta (ficha T-083 §4.5): su estado es puro y se prueba sin DOM. Mientras esta abierto,
// tocar una comarca del mapa anyade una parada (tocar la ultima la quita); cada cambio pide de nuevo
// la prevision al servidor, que la calcula con el mismo tablero que los robots y el motor.
import { RECURSOS } from '@conquer/nucleo';
import type { PrevisionDeRuta, Recua, Recurso } from '@conquer/nucleo';

export interface UnidadEditada {
  readonly clase: 'recua' | 'rebanyo';
  readonly id: string;
}

/** Lo que se hace en una parada: lo mismo que `ParadaDeRuta` del nucleo, sin la comarca. */
export interface TratosDeParada {
  readonly cargar: Readonly<Partial<Record<Recurso, number>>>;
  readonly descargar: Readonly<Partial<Record<Recurso, number>>>;
  /** Vender con precio minimo (T-084): «no menos de». */
  readonly vender: Readonly<Partial<Record<Recurso, LineaDeTrato>>>;
  /** Comprar con precio maximo (T-084): «no mas de». */
  readonly comprar: Readonly<Partial<Record<Recurso, LineaDeTrato>>>;
}

export interface LineaDeTrato {
  readonly cantidad: number;
  readonly precioMil: number;
}

const SIN_TRATOS: TratosDeParada = { cargar: {}, descargar: {}, vender: {}, comprar: {} };

export interface EditorDeRuta {
  readonly unidad: UnidadEditada;
  readonly paradas: readonly string[];
  /** Solo las recuas: la ruta se repite sola hasta que algo la para. */
  readonly circular: boolean;
  /** Si sale de casa con menos bastimento del que come el viaje, cargarlo antes de salir. */
  readonly cargarBastimento: boolean;
  /** Lo que se hace en cada parada, por su posicion (recuas): cargar, descargar y tratar. */
  readonly tratos: readonly TratosDeParada[];
  /** La prevision de lo que hay ahora en el editor, o null si aun no ha llegado. */
  readonly prevision: PrevisionDeRuta | null;
  /** Cuenta los cambios: una prevision de un cambio anterior no pisa la de uno nuevo. */
  readonly version: number;
}

/** Hasta cuantas paradas se trazan a mano: las mismas que acepta la API. */
export const PARADAS_MAXIMAS = 12;

/** Los tratos de una parada del nucleo, con su precio limite, como los guarda el editor. */
function lineasDe<T extends { readonly cantidad: number }>(
  tratos: Readonly<Partial<Record<Recurso, T>>>,
  precio: (t: T) => number,
): Partial<Record<Recurso, LineaDeTrato>> {
  const fuera: Partial<Record<Recurso, LineaDeTrato>> = {};
  for (const r of RECURSOS) {
    const t = tratos[r];
    if (t !== undefined) fuera[r] = { cantidad: t.cantidad, precioMil: precio(t) };
  }
  return fuera;
}

/**
 * El editor de una unidad. De una recua se parte de las paradas que ya lleva, para cambiar un
 * circuito sin rehacerlo; un rebanyo empieza en blanco (su ruta no guarda paradas).
 */
export function editorDe(unidad: UnidadEditada, actual: Recua | null): EditorDeRuta {
  const paradas = actual === null ? [] : actual.paradas.map((p) => p.comarca as string);
  const circular = actual?.rutaCircular ?? false;
  return {
    unidad,
    paradas,
    circular,
    cargarBastimento: true,
    tratos: (actual?.paradas ?? []).map((p): TratosDeParada => ({
      cargar: p.cargar,
      descargar: p.descargar,
      vender: lineasDe(p.vender, (v) => v.precioMinimoMil),
      comprar: lineasDe(p.comprar, (v) => v.precioMaximoMil),
    })),
    prevision: null,
    version: 0,
  };
}

function cambiado(e: EditorDeRuta, cambios: Partial<EditorDeRuta>): EditorDeRuta {
  return { ...e, ...cambios, prevision: null, version: e.version + 1 };
}

/** Tocar una comarca: la anyade al final; tocar la ultima la quita. Un rebanyo va a una sola. */
export function tocar(e: EditorDeRuta, comarca: string): EditorDeRuta {
  if (e.paradas.at(-1) === comarca) return quitar(e, e.paradas.length - 1);
  if (e.unidad.clase === 'rebanyo') {
    return cambiado(e, { paradas: [comarca], tratos: [SIN_TRATOS] });
  }
  if (e.paradas.length >= PARADAS_MAXIMAS) return e;
  return cambiado(e, { paradas: [...e.paradas, comarca], tratos: [...e.tratos, SIN_TRATOS] });
}

export function quitar(e: EditorDeRuta, i: number): EditorDeRuta {
  const fuera = <T>(lista: readonly T[]): T[] => lista.filter((_, j) => j !== i);
  return cambiado(e, { paradas: fuera(e.paradas), tratos: fuera(e.tratos) });
}

/** Sube una parada un puesto (la primera no se mueve). */
export function subir(e: EditorDeRuta, i: number): EditorDeRuta {
  if (i <= 0 || i >= e.paradas.length) return e;
  const cambiar = <T>(lista: readonly T[]): T[] => {
    const copia = [...lista];
    const [a, b] = [copia[i - 1], copia[i]];
    if (a === undefined || b === undefined) return copia;
    copia[i - 1] = b;
    copia[i] = a;
    return copia;
  };
  return cambiado(e, { paradas: cambiar(e.paradas), tratos: cambiar(e.tratos) });
}

export function alternarCircular(e: EditorDeRuta): EditorDeRuta {
  if (e.unidad.clase === 'rebanyo') return e;
  return cambiado(e, { circular: !e.circular });
}

export function alternarBastimento(e: EditorDeRuta): EditorDeRuta {
  // No cambia la ruta: la prevision sigue valiendo.
  return { ...e, cargarBastimento: !e.cargarBastimento };
}

/** Lo que se carga (`cargar`) o se descarga en una parada de un recurso; 0 lo quita. */
export function fijarCarga(
  e: EditorDeRuta,
  i: number,
  que: 'cargar' | 'descargar',
  recurso: Recurso,
  cantidad: number,
): EditorDeRuta {
  const tratos = e.tratos.map((t, j) => {
    if (j !== i) return t;
    const copia: Partial<Record<Recurso, number>> = {};
    for (const r of RECURSOS) {
      const valor = r === recurso ? Math.floor(cantidad) : (t[que][r] ?? 0);
      if (valor > 0) copia[r] = valor;
    }
    return { ...t, [que]: copia };
  });
  return cambiado(e, { tratos });
}

/**
 * Vender (con precio minimo) o comprar (con precio maximo) un recurso en una parada (T-084); una
 * cantidad de 0 lo quita. Los maravedis no se tratan: son la moneda.
 */
export function fijarTrato(
  e: EditorDeRuta,
  i: number,
  que: 'vender' | 'comprar',
  recurso: Recurso,
  linea: LineaDeTrato,
): EditorDeRuta {
  if (recurso === 'maravedis') return e;
  const tratos = e.tratos.map((t, j) => {
    if (j !== i) return t;
    const copia: Partial<Record<Recurso, LineaDeTrato>> = {};
    for (const r of RECURSOS) {
      const actual = r === recurso ? linea : t[que][r];
      if (actual !== undefined && actual.cantidad > 0) {
        copia[r] = {
          cantidad: Math.floor(actual.cantidad),
          precioMil: Math.max(0, Math.floor(actual.precioMil)),
        };
      }
    }
    return { ...t, [que]: copia };
  });
  return cambiado(e, { tratos });
}

/** La prevision que llega del servidor, si es de la version que hay ahora. */
export function conPrevision(
  e: EditorDeRuta,
  version: number,
  prevision: PrevisionDeRuta,
): EditorDeRuta {
  return version === e.version ? { ...e, prevision } : e;
}

/** Se puede confirmar cuando la prevision de lo que hay dice que el viaje se puede hacer. */
export function puedeConfirmar(e: EditorDeRuta): boolean {
  return e.paradas.length > 0 && e.prevision !== null && e.prevision.ok;
}

/**
 * Lo que se manda al confirmar, en orden: si sale de casa corto de bastimento, primero la carga del
 * que falta; despues la ruta, con lo que se carga y descarga en cada parada.
 */
export function intencionesDe(
  e: EditorDeRuta,
  enCasa: boolean,
): readonly Readonly<Record<string, unknown>>[] {
  const p = e.prevision;
  if (p === null || !p.ok) return [];
  const paradas = e.paradas.map((comarca, i) => {
    const t = e.tratos[i] ?? SIN_TRATOS;
    const lineas = (
      que: 'vender' | 'comprar',
    ): Partial<Record<Recurso, Record<string, number>>> => {
      const fuera: Partial<Record<Recurso, Record<string, number>>> = {};
      for (const r of RECURSOS) {
        const l = t[que][r];
        if (l === undefined) continue;
        fuera[r] =
          que === 'vender'
            ? { cantidad: l.cantidad, precioMinimoMil: l.precioMil }
            : { cantidad: l.cantidad, precioMaximoMil: l.precioMil };
      }
      return fuera;
    };
    return {
      comarca,
      cargar: t.cargar,
      descargar: t.descargar,
      vender: lineas('vender'),
      comprar: lineas('comprar'),
    };
  });
  if (e.unidad.clase === 'rebanyo') {
    return [
      {
        tipo: 'ruta',
        recua: null,
        rebanyo: e.unidad.id,
        paradas,
        circular: false,
        expedicion: false,
      },
    ];
  }
  const intenciones: Readonly<Record<string, unknown>>[] = [];
  if (enCasa && e.cargarBastimento && (p.faltaPan > 0 || p.faltaSal > 0)) {
    const cargar: Partial<Record<Recurso, number>> = {};
    if (p.faltaPan > 0) cargar.pan = p.faltaPan;
    if (p.faltaSal > 0) cargar.sal = p.faltaSal;
    intenciones.push({
      tipo: 'carga',
      recua: e.unidad.id,
      cargar,
      descargar: {},
      vecinosCargados: 0,
    });
  }
  intenciones.push({
    tipo: 'ruta',
    recua: e.unidad.id,
    rebanyo: null,
    paradas,
    circular: e.circular,
    expedicion: false,
  });
  return intenciones;
}
