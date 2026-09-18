// Solicitudes de mercado: lo que una recua quiere comprar o vender en una plaza este turno, venga
// de una parada de su ruta o de una orden `mercado` (ficha T-037 §4.2). Aqui se convierten en
// lineas de plaza, con lo que la recua puede de verdad entregar, cargar y pagar.
import type { Recua } from '../tipos/estado.ts';
import type { IdJugador, IdMercado, IdOrden, IdRecua } from '../tipos/ids.ts';
import type { Recurso } from '../tipos/recursos.ts';
import { comparar } from '../utiles/orden.ts';
import { pesoDeLaCarga } from './movimiento.ts';
import type { LineaDePlaza, OperacionDeMercado } from './mercado.ts';
import { costeDeCompra } from './mercado.ts';

export interface Solicitud {
  readonly via: 'parada' | 'orden';
  /** Unica en la partida: es la clave de la linea. */
  readonly clave: string;
  readonly jugador: IdJugador;
  readonly recua: IdRecua;
  readonly plaza: IdMercado;
  readonly recurso: Recurso;
  readonly operacion: OperacionDeMercado;
  /** Lo que pide el jugador, sin recortar. */
  readonly cantidad: number;
  readonly limiteMil: number;
  readonly orden: IdOrden | null;
}

export interface SolicitudConLinea {
  readonly solicitud: Solicitud;
  readonly linea: LineaDePlaza;
}

/**
 * Convierte las solicitudes de un recurso en una plaza en lineas, mirando la recua tal como esta
 * ahora. Las de una misma recua y operacion se acumulan en un orden fijo —la parada primero, luego
 * las ordenes por identificador— para no prometer mas de lo que lleva, ni comprar mas de lo que cabe
 * en su porte, ni gastar dos veces los mismos maravedis.
 */
export function lineasDeSolicitudes(
  solicitudes: readonly Solicitud[],
  recuas: Readonly<Record<string, Recua>>,
  comisionMilDe: (jugador: IdJugador) => number,
): SolicitudConLinea[] {
  const ordenadas = [...solicitudes].sort(
    (a, b) =>
      comparar(a.recua, b.recua) ||
      comparar(a.operacion, b.operacion) ||
      (a.via === b.via ? 0 : a.via === 'parada' ? -1 : 1) ||
      comparar(a.clave, b.clave),
  );

  const resultado: SolicitudConLinea[] = [];
  let grupo = '';
  let usado = 0;
  let reservado = 0;
  for (const solicitud of ordenadas) {
    const recua = recuas[solicitud.recua];
    if (recua === undefined) continue;
    const clave = `${solicitud.recua}|${solicitud.operacion}`;
    if (clave !== grupo) {
      grupo = clave;
      usado = 0;
      reservado = 0;
    }
    const comisionMil = comisionMilDe(solicitud.jugador);

    if (solicitud.operacion === 'vender') {
      const cantidad = Math.max(
        0,
        Math.min(solicitud.cantidad, recua.carga[solicitud.recurso] - usado),
      );
      usado += cantidad;
      resultado.push({
        solicitud,
        linea: { ...base(solicitud, comisionMil), cantidad, fondos: 0 },
      });
      continue;
    }

    const cabe = Math.max(0, recua.porte - pesoDeLaCarga(recua.carga) - usado);
    const cantidad = Math.min(solicitud.cantidad, cabe);
    usado += cantidad;
    const fondos = Math.max(0, recua.carga.maravedis - reservado);
    reservado += costeDeCompra(cantidad, solicitud.limiteMil, comisionMil).total;
    resultado.push({ solicitud, linea: { ...base(solicitud, comisionMil), cantidad, fondos } });
  }
  return resultado;
}

function base(
  solicitud: Solicitud,
  comisionMil: number,
): Pick<LineaDePlaza, 'clave' | 'jugador' | 'operacion' | 'limiteMil' | 'comisionMil'> {
  return {
    clave: solicitud.clave,
    jugador: solicitud.jugador,
    operacion: solicitud.operacion,
    limiteMil: solicitud.limiteMil,
    comisionMil,
  };
}
