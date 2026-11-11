// Invitar a una partida (ficha T-125 §2.1). Quien convoca reparte un enlace con el codigo; quien lo
// abre ve, aun sin cuenta, a que partida le invitan, de quien y que casas estan ya cogidas, para elegir
// la suya con conocimiento. No dice nada mas: ni origenes ni estado de nadie.
import { CASAS, TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type { Casa, IdPartida } from '@conquer/nucleo';

import { ErrorDeApi } from '../api/errores.ts';
import type { RepositorioDeConvocatorias } from '../persistencia/convocatorias.ts';
import type { RepositorioDeCuentas } from '../persistencia/cuentas.ts';
import type { Repositorio } from '../persistencia/repositorio.ts';
import { PLAZAS_MAXIMAS } from './entrada.ts';
import { convocatoriaDelCodigo } from './codigos.ts';

/** En que punto esta la partida a la que se invita. */
export type MomentoDeLaPartida = 'apuntandose' | 'sorteando' | 'empezada' | 'cerrada';

export interface VistaDeInvitacion {
  readonly nombre: string;
  /** El nombre de quien convoco: quien invita. */
  readonly convoca: string;
  readonly momento: MomentoDeLaPartida;
  /** El turno en que va, si ya empezo. */
  readonly turno: number | null;
  readonly intervaloMinutos: number;
  /** Las casas que ya juegan, con cuantas veces (como mucho dos). */
  readonly casas: readonly {
    readonly casa: Casa;
    readonly nombre: string;
    readonly veces: number;
  }[];
  /** Las casas que ya no admiten a nadie (dos veces cogidas). */
  readonly casasLlenas: readonly Casa[];
  readonly plazasLibres: number;
}

type RepoDeInvitacion = Pick<Repositorio, 'partida' | 'participantes'> &
  Pick<RepositorioDeConvocatorias, 'convocatoriaPorCodigo' | 'plazas' | 'convocatoriaDePartida'> &
  Pick<RepositorioDeCuentas, 'cuenta'>;

function contarCasas(casas: readonly string[]): VistaDeInvitacion['casas'] {
  return CASAS.flatMap((casa) => {
    const veces = casas.filter((c) => c === casa).length;
    return veces === 0 ? [] : [{ casa, nombre: TABLAS_DEL_JUEGO.casas[casa].nombre, veces }];
  });
}

/** Lo que el enlace de invitacion ensenya. Publico: basta con tener el codigo. */
export async function verInvitacion(
  repo: RepoDeInvitacion,
  codigoPedido: unknown,
): Promise<VistaDeInvitacion> {
  const c = await convocatoriaDelCodigo(repo, codigoPedido);
  if (c === null) {
    throw new ErrorDeApi(
      'convocatoria-desconocida',
      'Ese código de invitación no es de ninguna partida: pide a quien te invitó que te lo mande otra vez.',
    );
  }
  const convoca = (await repo.cuenta(c.creador))?.nombre ?? 'Alguien';
  const fila = c.partida === null ? null : await repo.partida(c.partida as IdPartida);
  if (fila === null) {
    const plazas = await repo.plazas(c.id);
    const casas = contarCasas(plazas.map((p) => p.casa));
    return {
      nombre: c.nombre,
      convoca,
      momento: c.estado === 'abierta' ? 'apuntandose' : 'sorteando',
      turno: null,
      intervaloMinutos: c.intervaloMinutos,
      casas,
      casasLlenas: casas.filter((x) => x.veces >= 2).map((x) => x.casa),
      plazasLibres: Math.max(0, c.plazas - plazas.length),
    };
  }
  const participantes = await repo.participantes(fila.id);
  const casas = contarCasas(participantes.map((p) => p.casa));
  return {
    nombre: c.nombre,
    convoca,
    momento: fila.estado === 'activa' ? 'empezada' : 'cerrada',
    turno: fila.turnoActual,
    intervaloMinutos: c.intervaloMinutos,
    casas,
    casasLlenas: casas.filter((x) => x.veces >= 2).map((x) => x.casa),
    plazasLibres: fila.estado === 'activa' ? Math.max(0, PLAZAS_MAXIMAS - participantes.length) : 0,
  };
}

/**
 * El codigo con el que invitar a una partida en marcha: solo para quien la convoco, que es quien
 * reparte las plazas (T-065), y solo mientras la partida admita a alguien.
 */
export async function codigoParaInvitar(
  repo: Pick<RepositorioDeConvocatorias, 'convocatoriaDePartida'> & Pick<Repositorio, 'partida'>,
  cuenta: string,
  partida: string,
): Promise<string | null> {
  const c = await repo.convocatoriaDePartida(partida);
  if (c?.creador !== cuenta) return null;
  const fila = await repo.partida(partida as IdPartida);
  return fila?.estado === 'activa' ? c.codigo : null;
}
