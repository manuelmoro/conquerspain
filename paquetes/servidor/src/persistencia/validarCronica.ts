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
import type {
  Cronica,
  EntradaDeCronica,
  IdComarca,
  IdJugador,
  Resultado,
  UnidadDeCronica,
  Validador,
} from '@conquer/nucleo';

const validarEntradaEntera = objeto<EntradaDeCronica>({
  seccion: unoDe(SECCIONES_DE_CRONICA),
  texto: texto(),
  comarca: oNulo(identificador<IdComarca>()),
  accionSugerida: oNulo(texto()),
  unidad: oNulo(
    objeto<UnidadDeCronica>({ clase: unoDe(['recua', 'rebanyo'] as const), id: identificador() }),
  ),
});

/** Las cronicas guardadas antes de T-083 no traen `unidad`: se leen como si fuera nula. */
const validarEntrada: Validador<EntradaDeCronica> = (dato, ruta) =>
  validarEntradaEntera(
    typeof dato === 'object' && dato !== null && !Array.isArray(dato) && !('unidad' in dato)
      ? { ...dato, unidad: null }
      : dato,
    ruta,
  );

const validarLaCronica = objeto<Cronica>({
  turno: enteroNoNegativo(),
  fecha: texto(),
  jugador: identificador<IdJugador>(),
  entradas: lista(validarEntrada),
});

export function validarCronica(dato: unknown): Resultado<Cronica> {
  return validarLaCronica(dato, '');
}
