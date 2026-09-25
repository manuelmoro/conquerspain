// El alta de partidas (ficha T-065 §4.1 y §4.2): convocar, unirse, sortear, elegir y fundar, sobre
// el preparador y el fundador puros de T-049. Aqui solo se decide quien puede que y se guarda.
import { randomBytes } from 'node:crypto';

import {
  CASAS,
  VERSION_REGLAS,
  canonico,
  explicar,
  fundarPartida,
  huella,
  prepararPartida,
} from '@conquer/nucleo';
import type {
  Casa,
  IdComarca,
  IdJugador,
  IdPartida,
  Mundo,
  OfertaDeOrigen,
  Participante,
  PartidaPreparada,
  TablasDeReglas,
} from '@conquer/nucleo';

import { ErrorDeApi } from '../api/errores.ts';
import type {
  RepositorioDeConvocatorias,
  Convocatoria,
  PlazaDeConvocatoria,
} from '../persistencia/convocatorias.ts';
import type { RepositorioDeCuentas } from '../persistencia/cuentas.ts';
import { ErrorDePersistencia } from '../persistencia/repositorio.ts';
import type { Repositorio } from '../persistencia/repositorio.ts';
import { proximaResolucion } from '../reloj/calendario.ts';

/** Ritmos de una partida normal (docs/02 §1): una hora, seis o un dia. */
export const INTERVALOS_ADMITIDOS = [60, 360, 1440] as const;
const INTERVALO_MAXIMO_DE_PRUEBA = 10_080;
const PLAZAS_MAXIMAS = 8;
const NOMBRE_MAXIMO = 60;

export interface DependenciasDeAltas {
  readonly repo: Repositorio & RepositorioDeConvocatorias & RepositorioDeCuentas;
  /** El mundo entero: el preparador recorta de el el mapa de cada partida. */
  readonly mundoCompleto: Mundo;
  readonly reglas: TablasDeReglas;
  readonly ahora: () => number;
}

export interface VistaDeConvocatoria {
  readonly id: string;
  readonly nombre: string;
  readonly estado: Convocatoria['estado'];
  readonly intervaloMinutos: number;
  readonly plazas: number;
  readonly esDePrueba: boolean;
  /** Solo para quien convoco. */
  readonly codigo: string | null;
  readonly jugadores: readonly { casa: string; nombre: string; haElegido: boolean }[];
  readonly misOfertas: readonly OfertaDeOrigen[];
  readonly miEleccion: string | null;
  readonly avisos: readonly string[];
  readonly partida: string | null;
}

function esCasa(dato: unknown): dato is Casa {
  return CASAS.some((c) => c === dato);
}

/** Las ofertas guardadas, leidas con cuidado: vienen de la base, no del codigo. */
function leerOfertas(texto: string | null): Record<string, OfertaDeOrigen[]> {
  if (texto === null) return {};
  const dato: unknown = JSON.parse(texto);
  const salida: Record<string, OfertaDeOrigen[]> = {};
  if (typeof dato !== 'object' || dato === null) return salida;
  for (const [jugador, lista] of Object.entries(dato)) {
    if (!Array.isArray(lista)) continue;
    salida[jugador] = lista.filter(
      (o: unknown): o is OfertaDeOrigen =>
        typeof o === 'object' && o !== null && 'comarca' in o && typeof o.comarca === 'string',
    );
  }
  return salida;
}

export class ServicioDeAltas {
  constructor(private readonly dep: DependenciasDeAltas) {}

  private aleatorio(bytes: number): string {
    return randomBytes(bytes).toString('base64url');
  }

  private async nombreDeCuenta(cuenta: string): Promise<string> {
    return (await this.dep.repo.cuenta(cuenta))?.nombre ?? 'Jugador';
  }

  private casaPedida(dato: unknown): Casa {
    if (!esCasa(dato)) {
      throw new ErrorDeApi(
        'configuracion-invalida',
        `La casa tiene que ser una de: ${CASAS.join(', ')}.`,
      );
    }
    return dato;
  }

  async convocar(
    cuenta: string,
    cuerpo: Record<string, unknown>,
  ): Promise<{ id: string; codigo: string }> {
    const nombre = typeof cuerpo['nombre'] === 'string' ? cuerpo['nombre'].trim() : '';
    if (nombre.length === 0 || nombre.length > NOMBRE_MAXIMO) {
      throw new ErrorDeApi(
        'configuracion-invalida',
        `La partida necesita un nombre de 1 a ${String(NOMBRE_MAXIMO)} caracteres.`,
      );
    }
    const casa = this.casaPedida(cuerpo['casa']);
    const esDePrueba = cuerpo['esDePrueba'] === true;
    const intervalo = cuerpo['intervaloMinutos'];
    const intervaloValido =
      typeof intervalo === 'number' &&
      Number.isInteger(intervalo) &&
      (esDePrueba
        ? intervalo >= 1 && intervalo <= INTERVALO_MAXIMO_DE_PRUEBA
        : INTERVALOS_ADMITIDOS.some((i) => i === intervalo));
    if (!intervaloValido) {
      throw new ErrorDeApi(
        'configuracion-invalida',
        esDePrueba
          ? `El ritmo de una partida de prueba es de 1 a ${String(INTERVALO_MAXIMO_DE_PRUEBA)} minutos.`
          : `El ritmo tiene que ser de ${INTERVALOS_ADMITIDOS.join(', ')} minutos (una hora, seis o un dia).`,
      );
    }
    const plazas = cuerpo['plazas'];
    if (
      typeof plazas !== 'number' ||
      !Number.isInteger(plazas) ||
      plazas < 1 ||
      plazas > PLAZAS_MAXIMAS
    ) {
      throw new ErrorDeApi(
        'configuracion-invalida',
        `Una partida es de 1 a ${String(PLAZAS_MAXIMAS)} jugadores.`,
      );
    }
    const id = `p-${randomBytes(6).toString('hex')}`;
    const codigo = this.aleatorio(16);
    await this.dep.repo.crearConvocatoria(
      {
        id,
        nombre,
        creador: cuenta,
        codigo,
        intervaloMinutos: intervalo,
        plazas,
        esDePrueba,
        semilla: this.aleatorio(32),
        creadaEn: this.dep.ahora(),
      },
      casa,
      await this.nombreDeCuenta(cuenta),
    );
    return { id, codigo };
  }

  async unirse(cuenta: string, cuerpo: Record<string, unknown>): Promise<{ id: string }> {
    const codigo = typeof cuerpo['codigo'] === 'string' ? cuerpo['codigo'] : '';
    const convocatoria = codigo === '' ? null : await this.dep.repo.convocatoriaPorCodigo(codigo);
    if (convocatoria === null) {
      throw new ErrorDeApi(
        'convocatoria-desconocida',
        'Ese codigo de invitacion no es de ninguna partida: revisalo.',
      );
    }
    const casa = this.casaPedida(cuerpo['casa']);
    const rechazo = await this.dep.repo.anyadirPlaza(
      convocatoria.id,
      cuenta,
      casa,
      await this.nombreDeCuenta(cuenta),
    );
    switch (rechazo) {
      case null:
        return { id: convocatoria.id };
      case 'ya-dentro':
        throw new ErrorDeApi('ya-dentro', 'Ya estas en esta partida.');
      case 'casa-ocupada':
        throw new ErrorDeApi(
          'casa-ocupada',
          `La casa "${casa}" ya la lleva otro jugador: en cada partida, cada casa una vez.`,
        );
      case 'llena':
        throw new ErrorDeApi('convocatoria-llena', 'La partida ya tiene todas sus plazas.');
      case 'cerrada':
        throw new ErrorDeApi(
          'convocatoria-cerrada',
          'La partida ya se ha sorteado: no admite mas jugadores.',
        );
    }
  }

  private async miConvocatoria(
    cuenta: string,
    id: string,
  ): Promise<{
    convocatoria: Convocatoria;
    plazas: readonly PlazaDeConvocatoria[];
    mia: PlazaDeConvocatoria;
  }> {
    const convocatoria = await this.dep.repo.convocatoria(id);
    const plazas = convocatoria === null ? [] : await this.dep.repo.plazas(id);
    const mia = plazas.find((p) => p.cuenta === cuenta);
    if (convocatoria === null || mia === undefined) {
      throw new ErrorDeApi(
        'convocatoria-desconocida',
        `No hay ninguna partida "${id}" en la que estes.`,
      );
    }
    return { convocatoria, plazas, mia };
  }

  async ver(cuenta: string, id: string): Promise<VistaDeConvocatoria> {
    const { convocatoria: c, plazas, mia } = await this.miConvocatoria(cuenta, id);
    return {
      id: c.id,
      nombre: c.nombre,
      estado: c.estado,
      intervaloMinutos: c.intervaloMinutos,
      plazas: c.plazas,
      esDePrueba: c.esDePrueba,
      codigo: c.creador === cuenta ? c.codigo : null,
      jugadores: plazas.map((p) => ({
        casa: p.casa,
        nombre: p.nombre,
        haElegido: p.eleccion !== null,
      })),
      misOfertas: leerOfertas(c.ofertas)[mia.casa] ?? [],
      miEleccion: mia.eleccion,
      avisos: c.avisos,
      partida: c.partida,
    };
  }

  async mias(cuenta: string): Promise<readonly VistaDeConvocatoria[]> {
    const lista = await this.dep.repo.convocatoriasDeCuenta(cuenta);
    return Promise.all(lista.map((c) => this.ver(cuenta, c.id)));
  }

  private participantes(plazas: readonly PlazaDeConvocatoria[]): Participante[] {
    return plazas.map((p) => ({
      id: p.casa as IdJugador,
      nombre: p.nombre,
      casa: this.casaPedida(p.casa),
    }));
  }

  private preparar(c: Convocatoria, plazas: readonly PlazaDeConvocatoria[]): PartidaPreparada {
    const preparada = prepararPartida({
      mundo: this.dep.mundoCompleto,
      reglas: this.dep.reglas,
      semilla: c.semilla,
      participantes: this.participantes(plazas),
      recortar: true,
    });
    if (!preparada.ok) {
      throw new ErrorDeApi(
        'sorteo-imposible',
        `No se puede preparar la partida:\n${explicar(preparada.errores)}`,
      );
    }
    return preparada.valor;
  }

  async sortear(cuenta: string, id: string): Promise<VistaDeConvocatoria> {
    const { convocatoria: c, plazas } = await this.miConvocatoria(cuenta, id);
    if (c.creador !== cuenta) {
      throw new ErrorDeApi(
        'solo-quien-convoca',
        'Solo quien convoco la partida puede cerrar la lista y sortear.',
      );
    }
    if (c.estado !== 'abierta') {
      throw new ErrorDeApi(
        'convocatoria-cerrada',
        'La partida ya esta sorteada: el sorteo no se repite.',
      );
    }
    const preparada = this.preparar(c, plazas);
    await this.dep.repo.guardarSorteo(
      id,
      canonico(preparada.ofertas),
      preparada.avisos,
      huella(preparada.mundo),
    );
    return this.ver(cuenta, id);
  }

  async elegir(
    cuenta: string,
    id: string,
    cuerpo: Record<string, unknown>,
  ): Promise<VistaDeConvocatoria> {
    const { convocatoria: c, mia } = await this.miConvocatoria(cuenta, id);
    if (c.estado !== 'eligiendo') {
      throw new ErrorDeApi(
        'convocatoria-cerrada',
        c.estado === 'abierta'
          ? 'Aun no se ha sorteado: espera a que quien convoco cierre la lista.'
          : 'La partida ya esta fundada.',
      );
    }
    const comarca = cuerpo['comarca'];
    const mias = leerOfertas(c.ofertas)[mia.casa] ?? [];
    if (typeof comarca !== 'string' || !mias.some((o) => o.comarca === comarca)) {
      throw new ErrorDeApi(
        'eleccion-invalida',
        'Tienes que elegir una de tus tres comarcas de origen.',
      );
    }
    await this.dep.repo.elegir(id, cuenta, comarca);
    const plazas = await this.dep.repo.plazas(id);
    if (plazas.every((p) => p.eleccion !== null)) await this.fundar(c, plazas);
    return this.ver(cuenta, id);
  }

  /** Todos han elegido: se funda la partida con el mismo sorteo que se guardo. */
  private async fundar(c: Convocatoria, plazas: readonly PlazaDeConvocatoria[]): Promise<void> {
    const preparada = this.preparar(c, plazas);
    if (huella(preparada.mundo) !== c.huellaMundo || canonico(preparada.ofertas) !== c.ofertas) {
      throw new Error(
        `El sorteo de la partida "${c.id}" ya no sale igual: ha cambiado el atlas o las reglas desde que se sorteo.`,
      );
    }
    const elecciones: Record<string, IdComarca> = {};
    for (const p of plazas) if (p.eleccion !== null) elecciones[p.casa] = p.eleccion as IdComarca;
    const estado = fundarPartida({
      preparada,
      reglas: this.dep.reglas,
      semilla: c.semilla,
      participantes: this.participantes(plazas),
      elecciones,
      id: c.id as IdPartida,
      configuracion: {
        nombre: c.nombre,
        intervaloMinutos: c.intervaloMinutos,
        modo: plazas.length === 1 ? 'solitario' : 'vecindad',
        turnosDeTemporada: null,
        reservaMinimaDePan: 30,
        esDePrueba: c.esDePrueba,
      },
    });
    if (!estado.ok) {
      throw new ErrorDeApi(
        'sorteo-imposible',
        `No se puede fundar la partida:\n${explicar(estado.errores)}`,
      );
    }
    const ahora = this.dep.ahora();
    const intervaloSegundos = c.intervaloMinutos * 60;
    try {
      await this.dep.repo.crearPartida(
        {
          id: c.id as IdPartida,
          nombre: c.nombre,
          semilla: c.semilla,
          versionReglas: VERSION_REGLAS,
          huellaMundo: huella(preparada.mundo),
          intervaloSegundos,
          ancla: ahora,
          proximaResolucion: proximaResolucion(ahora, intervaloSegundos, 1),
          esDePrueba: c.esDePrueba,
          participantes: plazas.map((p) => ({
            jugador: p.casa as IdJugador,
            casa: p.casa,
            cuenta: p.cuenta,
          })),
        },
        estado.valor,
        ahora,
      );
    } catch (error) {
      // Dos ultimas elecciones a la vez: el segundo encuentra la partida ya fundada, y esta bien.
      if (!(error instanceof ErrorDePersistencia && error.codigo === 'partida-duplicada'))
        throw error;
    }
    await this.dep.repo.marcarFundada(c.id, c.id);
  }
}
