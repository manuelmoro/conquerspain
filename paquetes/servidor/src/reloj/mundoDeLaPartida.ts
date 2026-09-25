// El mundo de una partida (ficha T-061 §4.6): el estado no lo guarda, asi que se reconstruye con el
// mismo recorte determinista con que se creo, y se comprueba con la huella guardada.
import { explicar, huella, prepararPartida } from '@conquer/nucleo';
import type { EstadoPartida, Mundo, Participante, TablasDeReglas } from '@conquer/nucleo';

import type { FilaDePartida } from '../persistencia/repositorio.ts';

export type ProveedorDeMundo = (fila: FilaDePartida, estado: EstadoPartida) => Mundo;

export class ErrorDeMundo extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ErrorDeMundo';
  }
}

/** Reconstruye el recorte de cada partida a partir del mundo entero y lo guarda en una cache. */
export function proveedorDeRecorte(mundoCompleto: Mundo, reglas: TablasDeReglas): ProveedorDeMundo {
  const cache = new Map<string, Mundo>();
  return (fila, estado) => {
    const guardado = cache.get(fila.id);
    if (guardado !== undefined) return guardado;
    const participantes: Participante[] = Object.values(estado.jugadores).map((j) => ({
      id: j.id,
      nombre: j.nombre,
      casa: j.casa,
    }));
    const preparada = prepararPartida({
      mundo: mundoCompleto,
      reglas,
      semilla: fila.semilla,
      participantes,
      recortar: true,
      origenesFijos: {},
    });
    if (!preparada.ok) {
      throw new ErrorDeMundo(
        `No se puede reconstruir el mapa de la partida "${fila.id}":\n${explicar(preparada.errores)}`,
      );
    }
    const obtenida = huella(preparada.valor.mundo);
    if (obtenida !== fila.huellaMundo) {
      throw new ErrorDeMundo(
        `mundo-no-coincide: el mapa de la partida "${fila.id}" ya no es el de cuando se creo (huella guardada ${fila.huellaMundo.slice(0, 12)}…, reconstruida ${obtenida.slice(0, 12)}…). El atlas ha cambiado: regenera el mundo con la version de entonces o migra la partida.`,
      );
    }
    cache.set(fila.id, preparada.valor.mundo);
    return preparada.valor.mundo;
  };
}
