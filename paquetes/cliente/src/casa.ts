// «Tu casa» en palabras (ficha T-089 §4.3), puro: las tradiciones por elegir, el mayordomo con sus
// reglas en castellano y como se compone una regla nueva. La pantalla solo pinta y recoge.
import {
  CARGAS_FISCALES,
  ESTACIONES,
  RECURSOS,
  RONDAS_DE_TRADICION,
  elegidaEn,
  opcionesDeTradicion,
} from '@conquer/nucleo';
import type {
  AccionDeMayordomo,
  CondicionDeMayordomo,
  IdComarca,
  IdMercado,
  IdRebanyo,
  IdRecua,
  Recurso,
  ReglaDeMayordomo,
  RondaDeTradicion,
  TablasDeReglas,
  Tradicion,
  VistaJugador,
} from '@conquer/nucleo';

import { enMaravedis } from './mercado.ts';
import { NOMBRE_DE_RECURSO } from './nombres.ts';

export const NOMBRE_DE_RONDA: Readonly<Record<RondaDeTradicion, string>> = {
  renombre: 'Renombre',
  fama: 'Fama',
  linaje: 'Linaje',
};

export interface CartaDeTradicion {
  readonly id: Tradicion;
  readonly nombre: string;
  readonly descripcion: string;
  readonly nota: string;
}

/** Las rondas abiertas y aun sin elegir, con sus cartas. */
export function rondasPorElegir(
  vista: VistaJugador,
  reglas: TablasDeReglas,
): readonly { readonly ronda: RondaDeTradicion; readonly cartas: readonly CartaDeTradicion[] }[] {
  const yo = vista.jugador;
  return RONDAS_DE_TRADICION.filter(
    (ronda) => yo.rondas[ronda] !== undefined && elegidaEn(yo, ronda, reglas) === null,
  ).map((ronda) => ({
    ronda,
    cartas: opcionesDeTradicion(yo.casa, ronda, reglas).map((id) => {
      const t = reglas.tradiciones[id];
      return {
        id,
        nombre: t?.nombre ?? 'Tradición',
        descripcion: t?.descripcion ?? '',
        nota: t?.nota ?? '',
      };
    }),
  }));
}

/** Cuantas reglas atiende el mayordomo: 3 y una mas por nivel de mercado en la capital, hasta 6. */
export function limiteDelMayordomo(vista: VistaJugador, reglas: TablasDeReglas): number {
  const capital = vista.comarcas[vista.jugador.capital];
  const mercado = capital?.nivel === 'propia' ? (capital.comarca.edificios['mercado'] ?? 0) : 0;
  const t = reglas.mayordomo;
  return Math.min(t.reglasMaximas, t.reglasIniciales + mercado * t.reglasPorNivelDeMercado);
}

export interface Nombres {
  readonly comarca: (id: string) => string;
  readonly plaza: (id: string) => string;
  readonly unidad: (id: string) => string;
}

const ESTACION: Readonly<Record<string, string>> = {
  primavera: 'la primavera',
  verano: 'el verano',
  otonyo: 'el otoño',
  invierno: 'el invierno',
};

export function describirCondicion(c: CondicionDeMayordomo, n: Nombres): string {
  switch (c.tipo) {
    case 'pan-disponible-menor-que':
      return `te quedan menos de ${String(c.cantidad)} de pan para gastar`;
    case 'recurso-almacenado-mayor-que':
      return `tienes más de ${String(c.cantidad)} de ${NOMBRE_DE_RECURSO[c.recurso]} guardado`;
    case 'precio-en-plaza-menor-que':
      return `sabes que en ${n.plaza(c.plaza)} la carga de ${NOMBRE_DE_RECURSO[c.recurso]} baja de ${enMaravedis(c.precioMil)} mrs`;
    case 'precio-en-plaza-mayor-que':
      return `sabes que en ${n.plaza(c.plaza)} la carga de ${NOMBRE_DE_RECURSO[c.recurso]} pasa de ${enMaravedis(c.precioMil)} mrs`;
    case 'obra-terminada-en':
      return `no queda ninguna obra en marcha en ${n.comarca(c.comarca)}`;
    case 'escasez':
      return 'falta pan';
    case 'estacion-empieza':
      return `empieza ${ESTACION[c.estacion] ?? c.estacion}`;
    case 'rebanyo-sin-pasto':
      return 'un rebaño se queda sin pasto';
  }
}

export function describirAccion(a: AccionDeMayordomo, n: Nombres): string {
  switch (a.tipo) {
    case 'mercado':
      return `${a.operacion === 'comprar' ? 'comprar' : 'vender'} ${String(a.cantidad)} de ${NOMBRE_DE_RECURSO[a.recurso]} en ${n.plaza(a.mercado)} con ${n.unidad(a.recua)}, a ${a.operacion === 'comprar' ? 'no más' : 'no menos'} de ${enMaravedis(a.precioLimiteMil)} mrs`;
    case 'enviar-recua':
      return `mandar ${n.unidad(a.recua)} a ${n.comarca(a.comarca)}`;
    case 'mover-rebanyo':
      return `llevar ${n.unidad(a.rebanyo)} a ${n.comarca(a.comarca)}`;
    case 'carga-fiscal':
      return `poner carga fiscal ${a.carga} en ${n.comarca(a.comarca)}`;
  }
}

/** «Si el pan disponible baja de 40, comprar 80 de pan en …»: una regla en una frase. */
export function describirRegla(r: ReglaDeMayordomo, n: Nombres): string {
  const frase = `Si ${describirCondicion(r.condicion, n)}, ${describirAccion(r.accion, n)}.`;
  return frase.charAt(0).toUpperCase() + frase.slice(1);
}

/** La orden que da de alta una regla, con la prioridad siguiente a la mas alta que haya. */
export function altaDeRegla(
  actuales: readonly { readonly prioridad: number }[],
  condicion: CondicionDeMayordomo,
  accion: AccionDeMayordomo,
): Readonly<Record<string, unknown>> {
  const prioridad = Math.max(0, ...actuales.map((r) => r.prioridad)) + 1;
  return { tipo: 'mayordomo', alta: { prioridad, condicion, accion }, bajaPrioridad: null };
}

export function bajaDeRegla(prioridad: number): Readonly<Record<string, unknown>> {
  return { tipo: 'mayordomo', alta: null, bajaPrioridad: prioridad };
}

/** Gastar o no sal en conservar el pan del almacen: una orden de politica sobre la capital. */
export function conservarConSal(
  capital: string,
  conservar: boolean,
): Readonly<Record<string, unknown>> {
  return {
    tipo: 'politica',
    comarca: capital,
    fuero: null,
    cargaFiscal: null,
    dehesa: null,
    conservarConSal: conservar,
  };
}

export function elegirTradicion(tradicion: Tradicion): Readonly<Record<string, unknown>> {
  return { tipo: 'tradicion', tradicion };
}

/** Los campos que pide cada condicion y cada accion del formulario, en orden. */
export type Campo =
  | 'cantidad'
  | 'recurso'
  | 'plaza'
  | 'precio'
  | 'comarca'
  | 'estacion'
  | 'recua'
  | 'rebanyo'
  | 'operacion'
  | 'carga';

export const CAMPOS_DE_CONDICION: Readonly<Record<CondicionDeMayordomo['tipo'], readonly Campo[]>> =
  {
    'pan-disponible-menor-que': ['cantidad'],
    'recurso-almacenado-mayor-que': ['recurso', 'cantidad'],
    'precio-en-plaza-menor-que': ['plaza', 'recurso', 'precio'],
    'precio-en-plaza-mayor-que': ['plaza', 'recurso', 'precio'],
    'obra-terminada-en': ['comarca'],
    escasez: [],
    'estacion-empieza': ['estacion'],
    'rebanyo-sin-pasto': [],
  };

export const CAMPOS_DE_ACCION: Readonly<Record<AccionDeMayordomo['tipo'], readonly Campo[]>> = {
  mercado: ['recua', 'plaza', 'operacion', 'recurso', 'cantidad', 'precio'],
  'enviar-recua': ['recua', 'comarca'],
  'mover-rebanyo': ['rebanyo', 'comarca'],
  'carga-fiscal': ['comarca', 'carga'],
};

export const NOMBRE_DE_CONDICION: Readonly<Record<CondicionDeMayordomo['tipo'], string>> = {
  'pan-disponible-menor-que': 'Si queda poco pan',
  'recurso-almacenado-mayor-que': 'Si sobra un recurso',
  'precio-en-plaza-menor-que': 'Si un precio baja',
  'precio-en-plaza-mayor-que': 'Si un precio sube',
  'obra-terminada-en': 'Si una comarca se queda sin obras',
  escasez: 'Si falta pan',
  'estacion-empieza': 'Al empezar una estación',
  'rebanyo-sin-pasto': 'Si un rebaño se queda sin pasto',
};

export const NOMBRE_DE_ACCION: Readonly<Record<AccionDeMayordomo['tipo'], string>> = {
  mercado: 'Comprar o vender',
  'enviar-recua': 'Mandar una recua',
  'mover-rebanyo': 'Llevar un rebaño',
  'carga-fiscal': 'Cambiar la carga fiscal',
};

type Valores = Readonly<Partial<Record<Campo, string>>>;

function entero(v: string | undefined): number | null {
  const n = Number(v);
  return v === undefined || v === '' || !Number.isFinite(n) || n < 0 ? null : Math.floor(n);
}

function mil(v: string | undefined): number | null {
  const n = Number((v ?? '').replace(',', '.'));
  return v === undefined || v === '' || !Number.isFinite(n) || n < 0 ? null : Math.round(n * 1000);
}

function recursoDe(v: string | undefined): Recurso | null {
  return RECURSOS.find((r) => r === v) ?? null;
}

/** La condicion del formulario, o null si falta algun campo o no vale. */
export function componerCondicion(
  tipo: CondicionDeMayordomo['tipo'],
  v: Valores,
): CondicionDeMayordomo | null {
  switch (tipo) {
    case 'pan-disponible-menor-que': {
      const cantidad = entero(v.cantidad);
      return cantidad === null ? null : { tipo, cantidad };
    }
    case 'recurso-almacenado-mayor-que': {
      const cantidad = entero(v.cantidad);
      const recurso = recursoDe(v.recurso);
      return cantidad === null || recurso === null ? null : { tipo, recurso, cantidad };
    }
    case 'precio-en-plaza-menor-que':
    case 'precio-en-plaza-mayor-que': {
      const precioMil = mil(v.precio);
      const recurso = recursoDe(v.recurso);
      if (precioMil === null || recurso === null || v.plaza === undefined || v.plaza === '')
        return null;
      return { tipo, plaza: v.plaza as IdMercado, recurso, precioMil };
    }
    case 'obra-terminada-en':
      return v.comarca === undefined || v.comarca === ''
        ? null
        : { tipo, comarca: v.comarca as IdComarca };
    case 'escasez':
    case 'rebanyo-sin-pasto':
      return { tipo };
    case 'estacion-empieza': {
      const estacion = ESTACIONES.find((e) => e === v.estacion);
      return estacion === undefined ? null : { tipo, estacion };
    }
  }
}

/** La accion del formulario, o null si falta algun campo o no vale. */
export function componerAccion(
  tipo: AccionDeMayordomo['tipo'],
  v: Valores,
): AccionDeMayordomo | null {
  const lleno = (x: string | undefined): x is string => x !== undefined && x !== '';
  switch (tipo) {
    case 'mercado': {
      const cantidad = entero(v.cantidad);
      const precioLimiteMil = mil(v.precio);
      const recurso = recursoDe(v.recurso);
      const operacion = v.operacion === 'comprar' || v.operacion === 'vender' ? v.operacion : null;
      if (
        !lleno(v.recua) ||
        !lleno(v.plaza) ||
        cantidad === null ||
        cantidad < 1 ||
        precioLimiteMil === null ||
        recurso === null ||
        operacion === null
      )
        return null;
      return {
        tipo,
        recua: v.recua as IdRecua,
        mercado: v.plaza as IdMercado,
        recurso,
        operacion,
        cantidad,
        precioLimiteMil,
      };
    }
    case 'enviar-recua':
      return lleno(v.recua) && lleno(v.comarca)
        ? { tipo, recua: v.recua as IdRecua, comarca: v.comarca as IdComarca }
        : null;
    case 'mover-rebanyo':
      return lleno(v.rebanyo) && lleno(v.comarca)
        ? { tipo, rebanyo: v.rebanyo as IdRebanyo, comarca: v.comarca as IdComarca }
        : null;
    case 'carga-fiscal': {
      const carga = CARGAS_FISCALES.find((c) => c === v.carga);
      return lleno(v.comarca) && carga !== undefined
        ? { tipo, comarca: v.comarca as IdComarca, carga }
        : null;
    }
  }
}
