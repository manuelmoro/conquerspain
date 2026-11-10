// Entrar en una partida empezada (ficha T-107 §2). Con el codigo de la convocatoria, quien no juega
// pide sus ofertas y elige una; el servidor le guarda la plaza y la orden `entrar`, y el motor lo da
// de alta al resolverse el turno.
import { CASAS, impedimentoDeEntrada, ofertasDeEntrada, recursosSegun } from '@conquer/nucleo';
import type {
  Casa,
  IdComarca,
  IdJugador,
  IdOrden,
  IdPartida,
  OfertaDeOrigen,
  Orden,
  TablasDeReglas,
} from '@conquer/nucleo';

import { ErrorDeApi } from '../api/errores.ts';
import type { RepositorioDeConvocatorias } from '../persistencia/convocatorias.ts';
import type { RepositorioDeCuentas } from '../persistencia/cuentas.ts';
import type { Repositorio } from '../persistencia/repositorio.ts';
import type { ProveedorDeMundo } from '../reloj/mundoDeLaPartida.ts';

/** Como en la convocatoria: hasta doce, y cada casa como mucho dos veces (T-100). */
const PLAZAS_MAXIMAS = 12;

export interface DependenciasDeEntrada {
  readonly repo: Repositorio & RepositorioDeConvocatorias & RepositorioDeCuentas;
  readonly reglas: TablasDeReglas;
  readonly proveedorDeMundo: ProveedorDeMundo;
  readonly ahora: () => number;
}

function casaDe(dato: unknown): Casa {
  const casa = CASAS.find((c) => c === dato);
  if (casa === undefined) {
    throw new ErrorDeApi(
      'configuracion-invalida',
      `La casa tiene que ser una de: ${CASAS.join(', ')}.`,
    );
  }
  return casa;
}

/** La partida fundada de ese codigo, su ultimo estado, su mundo y el jugador que seria quien entra. */
async function preparar(
  dep: DependenciasDeEntrada,
  cuenta: string,
  cuerpo: Record<string, unknown>,
) {
  const codigo = typeof cuerpo['codigo'] === 'string' ? cuerpo['codigo'] : '';
  const convocatoria = codigo === '' ? null : await dep.repo.convocatoriaPorCodigo(codigo);
  if (convocatoria !== null && convocatoria.partida === null) {
    throw new ErrorDeApi(
      'convocatoria-cerrada',
      'Esa partida se está sorteando: podrás entrar en cuanto empiece.',
    );
  }
  const id = convocatoria?.partida ?? null;
  const fila = id === null ? null : await dep.repo.partida(id as IdPartida);
  if (convocatoria === null || id === null || fila === null) {
    throw new ErrorDeApi(
      'convocatoria-desconocida',
      'Ese codigo no es de ninguna partida empezada: revisalo.',
    );
  }
  if (fila.estado !== 'activa') {
    throw new ErrorDeApi(
      'convocatoria-cerrada',
      'Esa partida ya no admite a nadie: esta terminada o detenida.',
    );
  }
  const casa = casaDe(cuerpo['casa']);
  const participantes = await dep.repo.participantes(fila.id);
  if (participantes.some((p) => p.cuenta === cuenta)) {
    throw new ErrorDeApi('ya-dentro', 'Ya estas en esta partida.');
  }
  if (participantes.length >= PLAZAS_MAXIMAS) {
    throw new ErrorDeApi('convocatoria-llena', 'La partida ya tiene doce jugadores.');
  }
  const deSuCasa = participantes.filter((p) => p.casa === casa).length;
  if (deSuCasa >= 2) {
    throw new ErrorDeApi(
      'casa-ocupada',
      `La casa "${casa}" ya la llevan dos jugadores: en cada partida, cada casa como mucho dos veces.`,
    );
  }
  const jugador = (deSuCasa === 0 ? casa : `${casa}-2`) as IdJugador;
  const estado = await dep.repo.ultimoEstado(fila.id);
  if (estado === null) throw new Error(`La partida "${fila.id}" no tiene ningun estado guardado.`);
  const nombre = (await dep.repo.cuenta(cuenta))?.nombre ?? 'Jugador';
  const mundo = dep.proveedorDeMundo(fila, estado);
  return { fila, estado, mundo, participante: { id: jugador, nombre, casa } };
}

/** Las ofertas de origen para entrar ahora. */
export async function ofertasParaEntrar(
  dep: DependenciasDeEntrada,
  cuenta: string,
  cuerpo: Record<string, unknown>,
): Promise<{ readonly partida: string; readonly ofertas: readonly OfertaDeOrigen[] }> {
  const { fila, estado, mundo, participante } = await preparar(dep, cuenta, cuerpo);
  const ofertas = ofertasDeEntrada(estado, mundo, dep.reglas, participante);
  if (ofertas.length === 0) {
    throw new ErrorDeApi(
      'sin-sitio',
      'No queda ninguna comarca libre y lejos de los demas para tu casa: prueba con otra casa.',
    );
  }
  return { partida: fila.id, ofertas };
}

/** Elige origen: queda su plaza y la orden de entrar; juega desde el turno que se resuelva. */
export async function entrarEnPartida(
  dep: DependenciasDeEntrada,
  cuenta: string,
  cuerpo: Record<string, unknown>,
): Promise<{ readonly partida: string; readonly turno: number }> {
  const { fila, estado, mundo, participante } = await preparar(dep, cuenta, cuerpo);
  const comarca = (typeof cuerpo['comarca'] === 'string' ? cuerpo['comarca'] : '') as IdComarca;
  const impedimento = impedimentoDeEntrada(estado, mundo, dep.reglas, participante, comarca);
  if (impedimento !== null) {
    throw new ErrorDeApi(
      'eleccion-invalida',
      'Ese origen no esta entre tus ofertas: vuelve a pedirlas.',
    );
  }
  // Dos que entran el mismo turno no se pisan la comarca: la primera orden se la queda.
  const pendientes = await dep.repo.ordenesPendientes(fila.id);
  if (pendientes.some((o) => o.orden.tipo === 'entrar' && o.orden.comarca === comarca)) {
    throw new ErrorDeApi(
      'eleccion-invalida',
      'Otro jugador acaba de elegir ese origen: elige otro.',
    );
  }
  const orden: Orden = {
    id: `o-${String(estado.turno)}-${participante.id}-entrar` as IdOrden,
    jugador: participante.id,
    turnoAlta: estado.turno,
    estado: 'pendiente',
    coste: recursosSegun(() => 0),
    turnosTotales: 1,
    turnosHechos: 0,
    motivoEspera: null,
    delMayordomo: false,
    turnoProgramado: null,
    cola: null,
    tipo: 'entrar',
    casa: participante.casa,
    nombre: participante.nombre,
    comarca,
  };
  await dep.repo.guardarOrden(fila.id, orden, dep.ahora(), estado.turno);
  await dep.repo.anyadirParticipante(fila.id, {
    jugador: participante.id,
    casa: participante.casa,
    cuenta,
  });
  return { partida: fila.id, turno: estado.turno };
}
