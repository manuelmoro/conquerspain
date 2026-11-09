// La prevision de una ruta que el jugador esta trazando (ficha T-083 §4.3): se calcula con su
// tablero, construido desde su vista, asi que no puede contar nada que el no sepa.
import { Tablero, previsionDeRuta } from '@conquer/nucleo';
import type {
  IdComarca,
  Mundo,
  PrevisionDeRuta,
  TablasDeReglas,
  UnidadQueViaja,
  VistaJugador,
} from '@conquer/nucleo';

import { ErrorDeApi } from './errores.ts';

/** Una ruta de mas paradas no la traza nadie a mano: el motor tampoco la aceptaria. */
const PARADAS_MAXIMAS = 12;

function invalido(mensaje: string): ErrorDeApi {
  return new ErrorDeApi('cuerpo-invalido', mensaje);
}

/** La unidad que se pide, que tiene que ser del jugador: si no, ni se dice si existe. */
function unidadPedida(
  cuerpo: Readonly<Record<string, unknown>>,
  vista: VistaJugador,
): UnidadQueViaja {
  const { recua, rebanyo } = cuerpo;
  if (typeof recua === 'string' && rebanyo === undefined) {
    const propia = vista.recuas.find((r) => r.id === recua);
    if (propia !== undefined) return { clase: 'recua', recua: propia };
  } else if (typeof rebanyo === 'string' && recua === undefined) {
    const propio = vista.rebanyos.find((r) => r.id === rebanyo);
    if (propio !== undefined) return { clase: 'rebanyo', rebanyo: propio };
  } else {
    throw invalido('Di una recua o un rebaño: "recua" o "rebanyo", uno de los dos.');
  }
  throw new ErrorDeApi('unidad-desconocida', 'Esa recua o ese rebaño no es tuyo.');
}

export function preverRutaPedida(
  cuerpo: Readonly<Record<string, unknown>>,
  vista: VistaJugador,
  mundo: Mundo,
  reglas: TablasDeReglas,
): PrevisionDeRuta {
  const unidad = unidadPedida(cuerpo, vista);
  const { paradas, circular } = cuerpo;
  if (
    !Array.isArray(paradas) ||
    paradas.length > PARADAS_MAXIMAS ||
    !paradas.every((p): p is string => typeof p === 'string')
  ) {
    throw invalido(
      `"paradas" es una lista de hasta ${String(PARADAS_MAXIMAS)} comarcas: sus identificadores.`,
    );
  }
  if (circular !== undefined && typeof circular !== 'boolean') {
    throw invalido('"circular" es true o false.');
  }
  if (!paradas.every((p) => vista.comarcas[p] !== undefined)) {
    throw new ErrorDeApi(
      'comarca-desconocida',
      'Alguna parada es una comarca de la que no sabes nada: explórala o espera a oír de ella.',
    );
  }
  return previsionDeRuta(
    new Tablero(vista, mundo, reglas),
    unidad,
    paradas as IdComarca[],
    circular === true,
  );
}
