// La cronica guardada se valida al leerla, igual que el estado: nada entra al servidor sin pasar por
// un validador (ficha T-060 §4.3).
import {
  SECCIONES_DE_CRONICA,
  enteroNoNegativo,
  identificador,
  lista,
  objeto,
  oNulo,
  texto,
  unoDe,
} from '@conquer/nucleo';
import type { Cronica, EntradaDeCronica, IdComarca, IdJugador, Resultado } from '@conquer/nucleo';

const validarEntrada = objeto<EntradaDeCronica>({
  seccion: unoDe(SECCIONES_DE_CRONICA),
  texto: texto(),
  comarca: oNulo(identificador<IdComarca>()),
  accionSugerida: oNulo(texto()),
});

const validarLaCronica = objeto<Cronica>({
  turno: enteroNoNegativo(),
  fecha: texto(),
  jugador: identificador<IdJugador>(),
  entradas: lista(validarEntrada),
});

export function validarCronica(dato: unknown): Resultado<Cronica> {
  return validarLaCronica(dato, '');
}
