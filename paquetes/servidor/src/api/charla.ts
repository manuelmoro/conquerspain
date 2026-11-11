// La charla de la partida (ficha T-129 §2.2): un canal para todos los que juegan. Los mensajes se
// guardan con el turno en que se escribieron y se ensenyan con el nombre y la casa de quien escribe.
// Lo que se dice aqui no obliga a nada: los pactos con efecto son los contratos del juego.
import type { EstadoPartida } from '@conquer/nucleo';

import type { MensajeGuardado } from '../persistencia/charla.ts';
import { ErrorDeApi } from './errores.ts';

/** Lo mas largo que puede ser un mensaje, en caracteres. */
export const LARGO_MAXIMO_DE_MENSAJE = 500;
/** Cuantos mensajes se traen de una vez. */
export const MENSAJES_POR_PAGINA = 100;

export interface MensajeDeCharla extends MensajeGuardado {
  readonly nombre: string;
  readonly casa: string | null;
}

/** El texto de un mensaje, limpio y comprobado: o un error que dice que falla. */
export function textoDeMensaje(dato: unknown): string {
  if (typeof dato !== 'string') {
    throw new ErrorDeApi('cuerpo-invalido', 'Manda {"texto": "…"} con lo que quieres decir.');
  }
  // Sin caracteres de control (salvo el salto de linea) y sin mas de dos lineas en blanco seguidas.
  // eslint-disable-next-line no-control-regex
  const limpio = dato.replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '').replace(/\n{3,}/g, '\n\n');
  const texto = limpio.trim();
  if (texto === '') {
    throw new ErrorDeApi(
      'cuerpo-invalido',
      'El mensaje está vacío: escribe algo antes de enviarlo.',
    );
  }
  // En unidades UTF-16, como cuenta el `maxlength` del campo del cliente.
  if (texto.length > LARGO_MAXIMO_DE_MENSAJE) {
    throw new ErrorDeApi(
      'cuerpo-invalido',
      `El mensaje es demasiado largo: como mucho ${String(LARGO_MAXIMO_DE_MENSAJE)} caracteres. Pártelo en dos.`,
    );
  }
  return texto;
}

/** El mensaje con el nombre y la casa de quien lo escribio, segun el estado de la partida. */
export function conAutor(m: MensajeGuardado, estado: EstadoPartida | null): MensajeDeCharla {
  const jugador = estado?.jugadores[m.jugador];
  return { ...m, nombre: jugador?.nombre ?? 'Alguien', casa: jugador?.casa ?? null };
}
