// Todo cambio del estado pasa por aqui. Tres cosas siempre, y en este orden:
// 1) se comprueban los invariantes, 2) se aplica la mutacion, 3) se registra el suceso.
// Gracias a eso, cualquier cifra que vea el jugador se puede explicar leyendo la lista de sucesos.
import type { Contexto } from './contexto.ts';
import { comoBorrador } from './contexto.ts';
import { ErrorDeMotor } from './errores.ts';
import { registrarSuceso } from './sucesos.ts';
import type {
  IdAcontecimiento,
  IdComarca,
  IdJugador,
  IdMercado,
  IdObra,
  IdOrden,
  IdRebanyo,
  IdRecua,
} from './tipos/ids.ts';
import type { EstadoDeOrden, Orden, ParadaDeRuta, ReglaDeMayordomo } from './tipos/ordenes.ts';
import type {
  Acontecimiento,
  Cometido,
  Conocimiento,
  EstadoMercado,
  EstadoTramo,
  Fuero,
  CargaFiscal,
  Obra,
  PreciosConocidos,
  PuestoEnLaClasificacion,
  Rebanyo,
  Recua,
  RecursoAgotable,
  RegistroDeJugador,
  SituacionMovil,
  TrasladoDeCorte,
} from './tipos/estado.ts';
import type { NivelPotencial, Potencial } from './tipos/mundo.ts';
import type { Hito, RondaDeTradicion, TipoObraMayor, Tradicion } from './tipos/reglas.ts';
import { LONGITUD_MAXIMA_DE_RUTA } from './tipos/estado.ts';
import type { Recurso, Recursos } from './tipos/recursos.ts';
import { RECURSOS } from './tipos/recursos.ts';
import { precioBaseEfectivo } from './reglas/acontecimientos.ts';
import { precioBaseLocalMil } from './reglas/precios.ts';
import { modificadoresDe } from './reglas/casas/index.ts';
import { impedimentoDeTradicion, opcionesDeTradicion } from './reglas/tradiciones.ts';
import { limitar, multiplicarFactores } from './utiles/enteros.ts';
import { comparar } from './utiles/orden.ts';

export type Cambio =
  | {
      readonly tipo: 'recurso';
      readonly jugador: IdJugador;
      readonly recurso: Recurso;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'reservado';
      readonly jugador: IdJugador;
      readonly recurso: Recurso;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'prestigio';
      readonly jugador: IdJugador;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'deuda';
      readonly jugador: IdJugador;
      readonly deuda: number;
    }
  | {
      readonly tipo: 'escasez';
      readonly jugador: IdJugador;
      readonly hay: boolean;
    }
  | {
      readonly tipo: 'poblacion';
      readonly comarca: IdComarca;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'lealtad';
      readonly comarca: IdComarca;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'aperos';
      readonly comarca: IdComarca;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'mantenimiento';
      readonly comarca: IdComarca;
      readonly turnosSinMantenimiento: number;
    }
  | {
      readonly tipo: 'edificio';
      readonly comarca: IdComarca;
      readonly edificio: string;
      readonly delta: number;
    }
  | {
      /** Quien levanto la venta de una comarca de nadie; null cuando deja de haberla (T-053). */
      readonly tipo: 'venta-de';
      readonly comarca: IdComarca;
      readonly jugador: IdJugador | null;
    }
  | {
      readonly tipo: 'influencia';
      readonly comarca: IdComarca;
      readonly jugador: IdJugador;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'agotamiento';
      readonly comarca: IdComarca;
      readonly valores: Readonly<Record<RecursoAgotable, number>>;
    }
  | {
      readonly tipo: 'produccion-comarca';
      readonly comarca: IdComarca;
      readonly produccion: Recursos;
    }
  | {
      readonly tipo: 'duenyo';
      readonly comarca: IdComarca;
      readonly jugador: IdJugador | null;
    }
  | {
      /** Turnos seguidos con una recua presente en una comarca neutral; 0 borra la cuenta. */
      readonly tipo: 'presencia-seguida';
      readonly comarca: IdComarca;
      readonly jugador: IdJugador;
      readonly turnos: number;
    }
  | {
      /** El jugador ha hecho un regalo al concejo de una comarca neutral este turno. */
      readonly tipo: 'regalo';
      readonly comarca: IdComarca;
      readonly jugador: IdJugador;
    }
  | {
      readonly tipo: 'orden-alta';
      readonly orden: Orden;
    }
  | {
      readonly tipo: 'orden-estado';
      readonly orden: IdOrden;
      readonly estado: EstadoDeOrden;
      readonly motivo: string | null;
    }
  | {
      readonly tipo: 'orden-avance';
      readonly orden: IdOrden;
      readonly turnos: number;
    }
  | {
      readonly tipo: 'orden-retirar';
      readonly orden: IdOrden;
    }
  | {
      /** Consume el siguiente numero de identificador de la partida. */
      readonly tipo: 'siguiente-id';
    }
  | {
      readonly tipo: 'recua-alta';
      readonly recua: Recua;
    }
  | {
      readonly tipo: 'recua-mover';
      readonly recua: IdRecua;
      readonly situacion: SituacionMovil;
      readonly ruta: readonly IdComarca[];
      readonly siguienteParada: number;
      readonly enParada: number | null;
    }
  | {
      readonly tipo: 'recua-ruta';
      readonly recua: IdRecua;
      readonly ruta: readonly IdComarca[];
      readonly circular: boolean;
      readonly paradas: readonly ParadaDeRuta[];
    }
  | {
      readonly tipo: 'recua-fallos-de-precio';
      readonly recua: IdRecua;
      readonly fallos: number;
    }
  | {
      readonly tipo: 'recua-carga';
      readonly recua: IdRecua;
      readonly recurso: Recurso;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'recua-vecinos';
      readonly recua: IdRecua;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'recua-acemilas';
      readonly recua: IdRecua;
      readonly delta: number;
      /** Porte que queda con las acemilas nuevas (depende de la casa: lo calcula quien llama). */
      readonly porte: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'recua-bastimento';
      readonly recua: IdRecua;
      readonly avisada: boolean;
    }
  | {
      readonly tipo: 'recua-cometido';
      readonly recua: IdRecua;
      readonly cometido: Cometido | null;
    }
  | {
      readonly tipo: 'recua-turnos-cometido';
      readonly recua: IdRecua;
      readonly turnos: number;
    }
  | {
      /** La recua se disuelve; tiene que llegar vacia: su carga y su gente ya se devolvieron. */
      readonly tipo: 'recua-baja';
      readonly recua: IdRecua;
    }
  | {
      readonly tipo: 'conocimiento';
      readonly jugador: IdJugador;
      readonly comarca: IdComarca;
      readonly conocimiento: Conocimiento;
    }
  | {
      /** Cambia el fuero y apunta el turno, que cuenta para los plazos (ficha T-036 §4.4). */
      readonly tipo: 'fuero';
      readonly comarca: IdComarca;
      readonly fuero: Fuero;
    }
  | {
      readonly tipo: 'carga-fiscal';
      readonly comarca: IdComarca;
      readonly carga: CargaFiscal;
    }
  | {
      readonly tipo: 'dehesa';
      readonly comarca: IdComarca;
      readonly dehesa: boolean;
    }
  | {
      readonly tipo: 'conservar-sal';
      readonly jugador: IdJugador;
      readonly conservar: boolean;
    }
  | {
      readonly tipo: 'desleal';
      readonly comarca: IdComarca;
      readonly turnos: number;
    }
  | {
      readonly tipo: 'traslado';
      readonly jugador: IdJugador;
      readonly traslado: TrasladoDeCorte | null;
    }
  | {
      readonly tipo: 'capital';
      readonly jugador: IdJugador;
      readonly comarca: IdComarca;
    }
  | {
      readonly tipo: 'obra-alta';
      readonly obra: Obra;
    }
  | {
      readonly tipo: 'obra-avance';
      readonly obra: IdObra;
      readonly avanceMil: number;
      readonly entregado: Recursos;
    }
  | {
      readonly tipo: 'obra-abandono';
      readonly obra: IdObra;
      readonly abandonada: boolean;
    }
  | {
      readonly tipo: 'obra-baja';
      readonly obra: IdObra;
    }
  | {
      /** Los potenciales efectivos de una comarca (roturar los cambia). */
      readonly tipo: 'potenciales';
      readonly comarca: IdComarca;
      readonly potenciales: Readonly<Record<Potencial, NivelPotencial>>;
    }
  | {
      readonly tipo: 'obra-mayor-terminada';
      readonly comarca: IdComarca;
      readonly obra: TipoObraMayor;
    }
  | {
      readonly tipo: 'tramo';
      readonly clave: string;
      readonly tramo: EstadoTramo;
    }
  | {
      readonly tipo: 'rebanyo-alta';
      readonly rebanyo: Rebanyo;
    }
  | {
      /** El rebanyo se ha quedado sin cabezas: desaparece. */
      readonly tipo: 'rebanyo-baja';
      readonly rebanyo: IdRebanyo;
    }
  | {
      readonly tipo: 'rebanyo-mover';
      readonly rebanyo: IdRebanyo;
      readonly situacion: SituacionMovil;
      readonly ruta: readonly IdComarca[];
    }
  | {
      /** Lo pastado en el anyo y los turnos seguidos sin pasto de un rebanyo. */
      readonly tipo: 'rebanyo-cuentas';
      readonly rebanyo: IdRebanyo;
      readonly pastoDelAnyoMil: number;
      readonly turnosSinPasto: number;
    }
  | {
      readonly tipo: 'rebanyo-cabezas';
      readonly rebanyo: IdRebanyo;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      /** Turnos de invernada y niveles de estiercol de una comarca. */
      readonly tipo: 'abono';
      readonly comarca: IdComarca;
      readonly turnosDeAbono: number;
      readonly estiercol: number;
    }
  | {
      /** Un acontecimiento se anuncia: entra en el estado dos turnos antes de empezar. */
      readonly tipo: 'acontecimiento-alta';
      readonly acontecimiento: Acontecimiento;
    }
  | {
      /** Un acontecimiento ha terminado y sale del estado. */
      readonly tipo: 'acontecimiento-baja';
      readonly acontecimiento: IdAcontecimiento;
    }
  | {
      /** Nace un mercado: la primera vez que se abre su plaza. */
      readonly tipo: 'mercado-alta';
      readonly mercado: EstadoMercado;
    }
  | {
      /** Precio de un recurso en un mercado y lo que se comercio en el ultimo turno. */
      readonly tipo: 'mercado-precio';
      readonly mercado: IdMercado;
      readonly recurso: Recurso;
      readonly precioMil: number;
      readonly volumen: number;
    }
  | {
      /** Lo que le falta por casar a una orden de mercado que sigue vigente. */
      readonly tipo: 'orden-cantidad';
      readonly orden: IdOrden;
      readonly cantidad: number;
    }
  | {
      /** Lo que el prestigio no puede recalcular: lo reescribe entero la fase 11. */
      readonly tipo: 'registro';
      readonly jugador: IdJugador;
      readonly registro: RegistroDeJugador;
    }
  | {
      readonly tipo: 'hito';
      readonly jugador: IdJugador;
      readonly hito: Hito;
    }
  | {
      /** El primero de la partida en lograr un hito. Se da una sola vez. */
      readonly tipo: 'primicia';
      readonly jugador: IdJugador;
      readonly hito: Hito;
    }
  | {
      /** Lo que el jugador sabe ahora de los precios de una plaza. */
      readonly tipo: 'plaza-conocida';
      readonly jugador: IdJugador;
      readonly mercado: string;
      readonly precios: PreciosConocidos;
    }
  | {
      readonly tipo: 'clasificacion';
      readonly puestos: readonly PuestoEnLaClasificacion[];
    }
  | {
      /** Las reglas del mayordomo de un jugador, de menor a mayor prioridad. */
      readonly tipo: 'mayordomo';
      readonly jugador: IdJugador;
      readonly reglas: readonly ReglaDeMayordomo[];
    }
  | {
      /** El jugador reordena una cola; tiene que traer exactamente las ordenes que hay en ella. */
      readonly tipo: 'cola';
      readonly jugador: IdJugador;
      readonly clave: string;
      readonly orden: readonly IdOrden[];
    }
  | {
      /** Se abre una ronda de tradiciones: desde el turno siguiente se puede elegir. */
      readonly tipo: 'ronda';
      readonly jugador: IdJugador;
      readonly ronda: RondaDeTradicion;
    }
  | {
      /** El jugador elige una tradicion. Es para siempre. */
      readonly tipo: 'tradicion';
      readonly jugador: IdJugador;
      readonly tradicion: Tradicion;
    };

/** Una orden que entra en su cola va al final. */
function ponerEnCola(ctx: Contexto, orden: Orden): void {
  if (orden.cola === null) {
    throw new ErrorDeMotor('invariante-rota', `La orden "${orden.id}" no dice en que cola va.`, {
      orden: orden.id,
    });
  }
  const jugador = jugadorDe(ctx, orden.jugador);
  const lista = jugador.colas[orden.cola] ?? [];
  if (!lista.includes(orden.id))
    jugador.colas = { ...jugador.colas, [orden.cola]: [...lista, orden.id] };
}

/** La que sale de su cola (empieza o se cancela) deja su sitio; una cola vacia desaparece. */
function sacarDeLaCola(ctx: Contexto, orden: Orden): void {
  if (orden.cola === null) return;
  const jugador = jugadorDe(ctx, orden.jugador);
  const clave = orden.cola;
  const lista = (jugador.colas[clave] ?? []).filter((id) => id !== orden.id);
  jugador.colas = Object.fromEntries(
    Object.entries(jugador.colas)
      .map(([c, ids]): [string, IdOrden[]] => [c, c === clave ? lista : [...ids]])
      .filter(([, ids]) => ids.length > 0),
  );
}

function jugadorDe(
  ctx: Contexto,
  id: IdJugador,
): NonNullable<Contexto['estado']['jugadores'][string]> {
  const jugador = ctx.estado.jugadores[id];
  if (jugador === undefined) {
    throw new ErrorDeMotor('entidad-desconocida', `No hay ningun jugador "${id}" en la partida.`);
  }
  return jugador;
}

function comarcaDe(
  ctx: Contexto,
  id: IdComarca,
): NonNullable<Contexto['estado']['comarcas'][string]> {
  const comarca = ctx.estado.comarcas[id];
  if (comarca === undefined) {
    throw new ErrorDeMotor('entidad-desconocida', `No hay ninguna comarca "${id}" en la partida.`);
  }
  return comarca;
}

function recuaDe(ctx: Contexto, id: IdRecua): NonNullable<Contexto['estado']['recuas'][string]> {
  const recua = ctx.estado.recuas[id];
  if (recua === undefined) {
    throw new ErrorDeMotor('entidad-desconocida', `No hay ninguna recua "${id}" en la partida.`);
  }
  return recua;
}

/** La ruta de una unidad es coherente con donde esta: si va de camino, empieza por su destino. */
function comprobarRuta(id: string, situacion: SituacionMovil, ruta: readonly IdComarca[]): void {
  if (ruta.length > LONGITUD_MAXIMA_DE_RUTA) {
    throw new ErrorDeMotor(
      'invariante-rota',
      `La ruta de ${id} tendria ${String(ruta.length)} comarcas y el maximo es ${String(LONGITUD_MAXIMA_DE_RUTA)}.`,
      { unidad: id },
    );
  }
  if (situacion.donde === 'camino' && ruta[0] !== situacion.hasta) {
    throw new ErrorDeMotor(
      'invariante-rota',
      `${id} va de camino a ${situacion.hasta} y su ruta no empieza por alli.`,
      { unidad: id },
    );
  }
}

function comprobarParadas(
  id: string,
  paradas: number,
  siguiente: number,
  enParada: number | null,
): void {
  if (
    siguiente < 0 ||
    siguiente > paradas ||
    (enParada !== null && (enParada < 0 || enParada >= paradas))
  ) {
    throw new ErrorDeMotor(
      'invariante-rota',
      `${id} tiene ${String(paradas)} paradas y apuntaria a la ${String(siguiente)} (detenida en ${String(enParada)}).`,
      { unidad: id },
    );
  }
}

function obraDe(ctx: Contexto, id: IdObra): NonNullable<Contexto['estado']['obras'][string]> {
  const obra = ctx.estado.obras[id];
  if (obra === undefined) {
    throw new ErrorDeMotor('entidad-desconocida', `No hay ninguna obra "${id}" en la partida.`);
  }
  return obra;
}

function mercadoDe(
  ctx: Contexto,
  id: IdMercado,
): NonNullable<Contexto['estado']['mercados'][string]> {
  const mercado = ctx.estado.mercados[id];
  if (mercado === undefined) {
    throw new ErrorDeMotor('entidad-desconocida', `No hay ningun mercado "${id}" en la partida.`);
  }
  return mercado;
}

function rebanyoDe(
  ctx: Contexto,
  id: IdRebanyo,
): NonNullable<Contexto['estado']['rebanyos'][string]> {
  const rebanyo = ctx.estado.rebanyos[id];
  if (rebanyo === undefined) {
    throw new ErrorDeMotor('entidad-desconocida', `No hay ningun rebanyo "${id}" en la partida.`);
  }
  return rebanyo;
}

function ordenDe(ctx: Contexto, id: IdOrden): NonNullable<Contexto['estado']['ordenes'][number]> {
  const orden = ctx.estado.ordenes.find((candidata) => candidata.id === id);
  if (orden === undefined) {
    throw new ErrorDeMotor('entidad-desconocida', `No hay ninguna orden "${id}" en la partida.`);
  }
  return orden;
}

/** Aplica un cambio al borrador del estado, comprobando antes que no rompe ningun invariante. */
export function aplicar(ctx: Contexto, cambio: Cambio): void {
  switch (cambio.tipo) {
    case 'recurso': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      const antes = jugador.almacen[cambio.recurso];
      const despues = antes + cambio.delta;
      if (despues < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `El almacen de ${cambio.jugador} se quedaria en ${String(despues)} de ${cambio.recurso}: en el motor no hay deudas de recursos.`,
          { jugador: cambio.jugador, recurso: cambio.recurso, antes, delta: cambio.delta },
        );
      }
      if (despues < jugador.reservado[cambio.recurso]) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Quedarian ${String(despues)} de ${cambio.recurso} y hay ${String(jugador.reservado[cambio.recurso])} reservados para ordenes.`,
          { jugador: cambio.jugador, recurso: cambio.recurso },
        );
      }
      jugador.almacen[cambio.recurso] = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'almacen.cambio',
        { recurso: cambio.recurso, delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { jugador: cambio.jugador },
      );
      return;
    }

    case 'reservado': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      const despues = jugador.reservado[cambio.recurso] + cambio.delta;
      if (despues < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `No se puede liberar mas ${cambio.recurso} del que hay reservado.`,
          { jugador: cambio.jugador, recurso: cambio.recurso },
        );
      }
      if (despues > jugador.almacen[cambio.recurso]) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Se reservarian ${String(despues)} de ${cambio.recurso} y solo hay ${String(jugador.almacen[cambio.recurso])} en el almacen.`,
          { jugador: cambio.jugador, recurso: cambio.recurso },
        );
      }
      jugador.reservado[cambio.recurso] = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'almacen.reserva',
        { recurso: cambio.recurso, delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { jugador: cambio.jugador },
      );
      return;
    }

    case 'prestigio': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      jugador.prestigio += cambio.delta;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'prestigio.cambio',
        { delta: cambio.delta, total: jugador.prestigio, motivo: cambio.motivo },
        { jugador: cambio.jugador },
      );
      return;
    }

    case 'deuda': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      if (!Number.isSafeInteger(cambio.deuda) || cambio.deuda < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La deuda de ${cambio.jugador} no puede ser ${String(cambio.deuda)}.`,
          { jugador: cambio.jugador },
        );
      }
      jugador.deudaAdministracion = cambio.deuda;
      return;
    }

    case 'escasez': {
      // Se aplica una vez por turno y jugador: cada turno con escasez suma uno a la racha.
      const jugador = jugadorDe(ctx, cambio.jugador);
      if (!jugador.escasez && !cambio.hay) return;
      const clave = !cambio.hay
        ? 'escasez.termina'
        : jugador.escasez
          ? 'escasez.sigue'
          : 'escasez.empieza';
      jugador.escasez = cambio.hay;
      jugador.escasezSeguidas = cambio.hay ? jugador.escasezSeguidas + 1 : 0;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        clave,
        { seguidas: jugador.escasezSeguidas },
        { jugador: cambio.jugador },
      );
      return;
    }

    case 'poblacion': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      const despues = comarca.poblacion + cambio.delta;
      if (despues < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La poblacion de ${cambio.comarca} se quedaria en ${String(despues)} vecinos.`,
          { comarca: cambio.comarca, delta: cambio.delta },
        );
      }
      comarca.poblacion = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'poblacion.cambio',
        { delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { comarca: cambio.comarca, jugador: comarca.duenyo },
      );
      return;
    }

    case 'lealtad': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      // Una casa puede tener un suelo de lealtad (los monjes): nunca baja de ahi.
      const suelo =
        comarca.duenyo === null
          ? 0
          : modificadoresDe(ctx.estado, comarca.duenyo, ctx.reglas).lealtadMinima;
      const despues = limitar(comarca.lealtad + cambio.delta, Math.min(suelo, 100), 100);
      if (despues === comarca.lealtad) return;
      comarca.lealtad = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'lealtad.cambio',
        { delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { comarca: cambio.comarca, jugador: comarca.duenyo },
      );
      return;
    }

    case 'aperos': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      const despues = comarca.aperos + cambio.delta;
      if (despues < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Los aperos de ${cambio.comarca} quedarian en el nivel ${String(despues)}.`,
          { comarca: cambio.comarca, delta: cambio.delta },
        );
      }
      comarca.aperos = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'aperos.cambio',
        { delta: cambio.delta, nivel: despues, motivo: cambio.motivo },
        { comarca: cambio.comarca, jugador: comarca.duenyo },
      );
      return;
    }

    case 'mantenimiento': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      if (
        !Number.isSafeInteger(cambio.turnosSinMantenimiento) ||
        cambio.turnosSinMantenimiento < 0
      ) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Los turnos sin mantenimiento de ${cambio.comarca} no pueden ser ${String(cambio.turnosSinMantenimiento)}.`,
          { comarca: cambio.comarca },
        );
      }
      comarca.turnosSinMantenimiento = cambio.turnosSinMantenimiento;
      return;
    }

    case 'edificio': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      const nivel = (comarca.edificios[cambio.edificio] ?? 0) + cambio.delta;
      if (nivel < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `No se puede derribar mas ${cambio.edificio} del que hay en ${cambio.comarca}.`,
          { comarca: cambio.comarca, edificio: cambio.edificio },
        );
      }
      if (nivel === 0) {
        const restantes: Record<string, number> = {};
        for (const [clave, valor] of Object.entries(comarca.edificios)) {
          if (clave !== cambio.edificio) restantes[clave] = valor;
        }
        comarca.edificios = restantes;
      } else {
        comarca.edificios[cambio.edificio] = nivel;
      }
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'edificio.cambio',
        { edificio: cambio.edificio, delta: cambio.delta, nivel },
        { comarca: cambio.comarca, jugador: comarca.duenyo },
      );
      return;
    }

    case 'venta-de': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      if (cambio.jugador !== null && comarca.duenyo !== null) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `${cambio.comarca} tiene duenyo: su venta es de la comarca, no de ${cambio.jugador}.`,
          { comarca: cambio.comarca, jugador: cambio.jugador },
        );
      }
      comarca.ventaDe = cambio.jugador;
      return;
    }

    case 'influencia': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      if (comarca.duenyo !== null) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `${cambio.comarca} tiene duenyo: solo las comarcas neutrales acumulan influencia.`,
          { comarca: cambio.comarca },
        );
      }
      const despues = limitar((comarca.influencias[cambio.jugador] ?? 0) + cambio.delta, 0, 100);
      comarca.influencias[cambio.jugador] = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'influencia.cambio',
        { delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { comarca: cambio.comarca, jugador: cambio.jugador },
      );
      return;
    }

    case 'agotamiento': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      const maximo = ctx.reglas.produccion.agotamiento.maximo;
      for (const [recurso, valor] of Object.entries(cambio.valores)) {
        if (!Number.isSafeInteger(valor) || valor < 0 || valor > maximo) {
          throw new ErrorDeMotor(
            'invariante-rota',
            `El agotamiento de ${recurso} en ${cambio.comarca} seria ${String(valor)} y tiene que quedar entre 0 y ${String(maximo)}.`,
            { comarca: cambio.comarca, recurso, valor },
          );
        }
      }
      comarca.agotamiento = { ...cambio.valores };
      return;
    }

    case 'produccion-comarca': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      for (const [recurso, valor] of Object.entries(cambio.produccion)) {
        if (!Number.isSafeInteger(valor) || valor < 0) {
          throw new ErrorDeMotor(
            'invariante-rota',
            `La produccion de ${recurso} en ${cambio.comarca} no puede ser ${String(valor)}.`,
            { comarca: cambio.comarca, recurso, valor },
          );
        }
      }
      comarca.produccionUltimoTurno = { ...cambio.produccion };
      return;
    }

    case 'duenyo': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      const antes = comarca.duenyo;
      comarca.duenyo = cambio.jugador;
      // Una comarca con duenyo no guarda influencias ni cuentas del concejo: al incorporarse se
      // borran; al volver a neutral se apunta quien la tenia.
      if (cambio.jugador !== null) {
        comarca.influencias = {};
        comarca.presenciaSeguida = {};
        comarca.ultimoRegalo = {};
        comarca.exDuenyo = null;
        // Quien incorpora la comarca se queda con ella y con la venta que haya dentro (T-053).
        comarca.ventaDe = null;
      } else {
        comarca.exDuenyo = antes;
      }
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        cambio.jugador === null ? 'comarca.vuelve-neutral' : 'comarca.incorporada',
        { anterior: antes ?? '(neutral)' },
        { comarca: cambio.comarca, jugador: cambio.jugador ?? antes },
      );
      return;
    }

    case 'presencia-seguida': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      if (comarca.duenyo !== null || !Number.isSafeInteger(cambio.turnos) || cambio.turnos < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La presencia seguida de ${cambio.jugador} en ${cambio.comarca} no puede quedar en ${String(cambio.turnos)} (solo las comarcas neutrales la cuentan).`,
          { comarca: cambio.comarca, jugador: cambio.jugador },
        );
      }
      if (cambio.turnos === 0) {
        const restantes: Record<string, number> = {};
        for (const [id, turnos] of Object.entries(comarca.presenciaSeguida)) {
          if (id !== cambio.jugador) restantes[id] = turnos;
        }
        comarca.presenciaSeguida = restantes;
      } else {
        comarca.presenciaSeguida[cambio.jugador] = cambio.turnos;
      }
      return;
    }

    case 'registro': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      const numeros = [
        ...Object.values(cambio.registro.obrasMayores),
        ...Object.values(cambio.registro.volumenEnFerias),
        cambio.registro.anyosTrashumantes,
        cambio.registro.feriasDestacadas,
        cambio.registro.comarcasPerdidas,
        cambio.registro.turnosConEscasez,
        cambio.registro.turnosDeDespensaEstable,
      ];
      if (numeros.some((n) => !Number.isSafeInteger(n) || n < 0)) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `El registro de ${cambio.jugador} solo lleva cuentas enteras y no negativas.`,
          { jugador: cambio.jugador },
        );
      }
      jugador.registro = comoBorrador(cambio.registro);
      return;
    }

    case 'hito': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      if (jugador.hitos[cambio.hito] !== undefined) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `${cambio.jugador} ya logro "${cambio.hito}": un hito no se repite.`,
          { jugador: cambio.jugador, hito: cambio.hito },
        );
      }
      jugador.hitos = { ...jugador.hitos, [cambio.hito]: ctx.turno };
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'hito.logrado',
        { hito: cambio.hito, prestigio: ctx.reglas.hitos[cambio.hito].prestigio },
        { jugador: cambio.jugador },
      );
      return;
    }

    case 'primicia': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      if (
        ctx.estado.primicias[cambio.hito] !== undefined ||
        jugador.hitos[cambio.hito] === undefined
      ) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La primicia de "${cambio.hito}" ya es de otro o ${cambio.jugador} no tiene ese hito.`,
          { jugador: cambio.jugador, hito: cambio.hito },
        );
      }
      ctx.estado.primicias = { ...ctx.estado.primicias, [cambio.hito]: cambio.jugador };
      // Se anuncia a todos: la cronica (T-044) la ensenya en el parte de cada jugador.
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'hito.primicia',
        { hito: cambio.hito, prestigio: ctx.reglas.prestigio.porPrimicia, publico: 1 },
        { jugador: cambio.jugador },
      );
      return;
    }

    case 'plaza-conocida': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      const antes = jugador.plazas[cambio.mercado];
      if (antes !== undefined && antes.turno > cambio.precios.turno) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `${cambio.jugador} ya sabia precios mas recientes de ${cambio.mercado}: la informacion no retrocede.`,
          { jugador: cambio.jugador, mercado: cambio.mercado },
        );
      }
      jugador.plazas[cambio.mercado] = comoBorrador(cambio.precios);
      return;
    }

    case 'clasificacion': {
      const jugadores = new Set<string>(cambio.puestos.map((p) => p.jugador));
      const esperados = Object.keys(ctx.estado.jugadores);
      if (
        jugadores.size !== cambio.puestos.length ||
        jugadores.size !== esperados.length ||
        esperados.some((id) => !jugadores.has(id)) ||
        cambio.puestos.some((p, i) => p.puesto !== i + 1)
      ) {
        throw new ErrorDeMotor(
          'invariante-rota',
          'La clasificacion tiene que poner a cada jugador una vez, del puesto 1 en adelante.',
        );
      }
      ctx.estado.clasificacion = comoBorrador(cambio.puestos);
      for (const puesto of cambio.puestos) {
        registrarSuceso(
          ctx.sucesos,
          ctx.fase,
          'prestigio.clasificacion',
          {
            puesto: puesto.puesto,
            puestoAnterior: puesto.puestoAnterior ?? 0,
            prestigio: puesto.prestigio,
          },
          { jugador: puesto.jugador },
        );
      }
      return;
    }

    case 'ronda': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      if (jugador.rondas[cambio.ronda] !== undefined) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La ronda "${cambio.ronda}" de ${cambio.jugador} ya estaba abierta.`,
          { jugador: cambio.jugador, ronda: cambio.ronda },
        );
      }
      jugador.rondas = { ...jugador.rondas, [cambio.ronda]: ctx.turno };
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'tradicion.ronda-abierta',
        {
          ronda: cambio.ronda,
          opciones: opcionesDeTradicion(jugador.casa, cambio.ronda, ctx.reglas).join(','),
        },
        { jugador: cambio.jugador },
      );
      return;
    }

    case 'tradicion': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      const impedimento = impedimentoDeTradicion(jugador, cambio.tradicion, ctx.reglas);
      if (impedimento !== null) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `${cambio.jugador} no puede tomar la tradicion "${cambio.tradicion}": ${impedimento}.`,
          { jugador: cambio.jugador, tradicion: cambio.tradicion },
        );
      }
      jugador.tradiciones = [...jugador.tradiciones, cambio.tradicion];
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'tradicion.elegida',
        {
          tradicion: cambio.tradicion,
          ronda: ctx.reglas.tradiciones[cambio.tradicion]?.ronda ?? '',
        },
        { jugador: cambio.jugador },
      );
      return;
    }

    case 'regalo': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      if (comarca.duenyo !== null) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `${cambio.comarca} tiene duenyo: el concejo solo recibe regalos mientras es neutral.`,
          { comarca: cambio.comarca },
        );
      }
      comarca.ultimoRegalo[cambio.jugador] = ctx.turno;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'influencia.regalo',
        { turno: ctx.turno },
        { comarca: cambio.comarca, jugador: cambio.jugador },
      );
      return;
    }

    case 'orden-alta': {
      if (ctx.estado.ordenes.some((existente) => existente.id === cambio.orden.id)) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Ya hay una orden con el identificador "${cambio.orden.id}".`,
          { orden: cambio.orden.id },
        );
      }
      ctx.estado.ordenes.push(comoBorrador(cambio.orden));
      if (cambio.orden.estado === 'en cola') ponerEnCola(ctx, cambio.orden);
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'orden.alta',
        { orden: cambio.orden.id, clase: cambio.orden.tipo },
        { jugador: cambio.orden.jugador },
      );
      return;
    }

    case 'orden-estado': {
      const orden = ordenDe(ctx, cambio.orden);
      const antes = orden.estado;
      orden.estado = cambio.estado;
      orden.motivoEspera = cambio.motivo;
      if (antes === 'en cola' && cambio.estado !== 'en cola') sacarDeLaCola(ctx, orden);
      if (antes !== 'en cola' && cambio.estado === 'en cola') ponerEnCola(ctx, orden);
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'orden.estado',
        {
          orden: cambio.orden,
          clase: orden.tipo,
          estado: cambio.estado,
          motivo: cambio.motivo ?? '',
          delMayordomo: orden.delMayordomo ? 1 : 0,
        },
        { jugador: orden.jugador },
      );
      return;
    }

    case 'mayordomo': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      const prioridades = cambio.reglas.map((r) => r.prioridad);
      const ordenadas = prioridades.every((p, i) => i === 0 || p > (prioridades[i - 1] ?? 0));
      if (!ordenadas || cambio.reglas.length > ctx.reglas.mayordomo.reglasMaximas) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Las reglas del mayordomo de ${cambio.jugador} van sin repetir prioridad, de menor a mayor, y como mucho ${String(ctx.reglas.mayordomo.reglasMaximas)}.`,
          { jugador: cambio.jugador },
        );
      }
      jugador.mayordomo = comoBorrador(cambio.reglas);
      return;
    }

    case 'cola': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      const actual = [...(jugador.colas[cambio.clave] ?? [])].sort(comparar);
      const nueva = [...cambio.orden].sort(comparar);
      if (actual.length !== nueva.length || actual.some((id, i) => id !== nueva[i])) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La cola "${cambio.clave}" de ${cambio.jugador} solo se puede reordenar con las mismas ordenes que tiene.`,
          { jugador: cambio.jugador, cola: cambio.clave },
        );
      }
      jugador.colas = { ...jugador.colas, [cambio.clave]: [...cambio.orden] };
      return;
    }

    case 'orden-retirar': {
      const indice = ctx.estado.ordenes.findIndex((o) => o.id === cambio.orden);
      const orden = ctx.estado.ordenes[indice];
      if (orden === undefined) {
        throw new ErrorDeMotor('entidad-desconocida', `No hay ninguna orden "${cambio.orden}".`);
      }
      if (orden.estado !== 'terminada' && orden.estado !== 'cancelada') {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La orden "${cambio.orden}" sigue viva (${orden.estado}) y no se puede retirar.`,
          { orden: cambio.orden },
        );
      }
      ctx.estado.ordenes.splice(indice, 1);
      return;
    }

    case 'siguiente-id': {
      ctx.estado.siguienteId += 1;
      return;
    }

    case 'recua-alta': {
      if (ctx.estado.recuas[cambio.recua.id] !== undefined) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Ya hay una recua con el identificador "${cambio.recua.id}".`,
          { recua: cambio.recua.id },
        );
      }
      jugadorDe(ctx, cambio.recua.jugador);
      comprobarRuta(cambio.recua.id, cambio.recua.situacion, cambio.recua.ruta);
      ctx.estado.recuas[cambio.recua.id] = comoBorrador(cambio.recua);
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.formada',
        {
          recua: cambio.recua.id,
          nombre: cambio.recua.nombre,
          acemilas: cambio.recua.acemilas,
          vecinos: cambio.recua.vecinos,
        },
        {
          jugador: cambio.recua.jugador,
          comarca:
            cambio.recua.situacion.donde === 'comarca' ? cambio.recua.situacion.comarca : null,
        },
      );
      return;
    }

    case 'recua-mover': {
      const recua = recuaDe(ctx, cambio.recua);
      comprobarRuta(cambio.recua, cambio.situacion, cambio.ruta);
      comprobarParadas(cambio.recua, recua.paradas.length, cambio.siguienteParada, cambio.enParada);
      recua.situacion = comoBorrador(cambio.situacion);
      recua.ruta = [...cambio.ruta];
      recua.siguienteParada = cambio.siguienteParada;
      recua.enParada = cambio.enParada;
      return;
    }

    case 'recua-ruta': {
      const recua = recuaDe(ctx, cambio.recua);
      comprobarRuta(cambio.recua, recua.situacion, cambio.ruta);
      recua.ruta = [...cambio.ruta];
      recua.rutaCircular = cambio.circular;
      recua.paradas = comoBorrador(cambio.paradas);
      recua.siguienteParada = 0;
      recua.enParada = null;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.ruta',
        {
          recua: cambio.recua,
          comarcas: cambio.ruta.length,
          destino: cambio.ruta.at(-1) ?? '',
          circular: cambio.circular ? 1 : 0,
        },
        { jugador: recua.jugador },
      );
      return;
    }

    case 'recua-fallos-de-precio': {
      const recua = recuaDe(ctx, cambio.recua);
      if (!Number.isSafeInteger(cambio.fallos) || cambio.fallos < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Los fallos de precio de ${cambio.recua} no pueden ser ${String(cambio.fallos)}.`,
        );
      }
      recua.fallosDePrecio = cambio.fallos;
      return;
    }

    case 'recua-carga': {
      const recua = recuaDe(ctx, cambio.recua);
      const despues = recua.carga[cambio.recurso] + cambio.delta;
      if (despues < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La recua ${cambio.recua} se quedaria con ${String(despues)} de ${cambio.recurso}.`,
          { recua: cambio.recua, recurso: cambio.recurso },
        );
      }
      const peso = RECURSOS.filter((r) => r !== 'maravedis').reduce(
        (total, r) => total + (r === cambio.recurso ? despues : recua.carga[r]),
        0,
      );
      if (cambio.delta > 0 && cambio.recurso !== 'maravedis' && peso > recua.porte) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La recua ${cambio.recua} llevaria ${String(peso)} cargas y su porte es ${String(recua.porte)}.`,
          { recua: cambio.recua },
        );
      }
      recua.carga[cambio.recurso] = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.carga',
        {
          recua: cambio.recua,
          recurso: cambio.recurso,
          delta: cambio.delta,
          total: despues,
          motivo: cambio.motivo,
        },
        { jugador: recua.jugador },
      );
      return;
    }

    case 'recua-vecinos': {
      const recua = recuaDe(ctx, cambio.recua);
      const despues = recua.vecinos + cambio.delta;
      const maximo = ctx.reglas.movimiento.vecinosMaximosPorRecua;
      if (despues < 0 || (cambio.delta > 0 && despues > maximo)) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La recua ${cambio.recua} llevaria ${String(despues)} vecinos y caben ${String(maximo)}.`,
          { recua: cambio.recua },
        );
      }
      recua.vecinos = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.vecinos',
        { recua: cambio.recua, delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { jugador: recua.jugador },
      );
      return;
    }

    case 'recua-acemilas': {
      const recua = recuaDe(ctx, cambio.recua);
      const despues = recua.acemilas + cambio.delta;
      // Una recua nunca desaparece sola: se queda al menos con una acemila.
      if (despues < 1 || cambio.porte < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La recua ${cambio.recua} se quedaria con ${String(despues)} acemilas.`,
          { recua: cambio.recua },
        );
      }
      recua.acemilas = despues;
      recua.porte = cambio.porte;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.acemilas',
        {
          recua: cambio.recua,
          delta: cambio.delta,
          acemilas: despues,
          porte: cambio.porte,
          motivo: cambio.motivo,
        },
        { jugador: recua.jugador },
      );
      return;
    }

    case 'recua-bastimento': {
      const recua = recuaDe(ctx, cambio.recua);
      recua.avisadaSinBastimento = cambio.avisada;
      return;
    }

    case 'recua-cometido': {
      const recua = recuaDe(ctx, cambio.recua);
      recua.cometido = cambio.cometido;
      recua.turnosDeCometido = 0;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.cometido',
        { recua: cambio.recua, cometido: cambio.cometido ?? '' },
        { jugador: recua.jugador },
      );
      return;
    }

    case 'recua-turnos-cometido': {
      const recua = recuaDe(ctx, cambio.recua);
      if (!Number.isSafeInteger(cambio.turnos) || cambio.turnos < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Los turnos de cometido de ${cambio.recua} no pueden ser ${String(cambio.turnos)}.`,
          { recua: cambio.recua },
        );
      }
      recua.turnosDeCometido = cambio.turnos;
      return;
    }

    case 'recua-baja': {
      const recua = recuaDe(ctx, cambio.recua);
      const lleva = RECURSOS.reduce((total, r) => total + recua.carga[r], 0);
      if (lleva > 0 || recua.vecinos > 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La recua ${cambio.recua} se disolveria con carga o gente dentro: hay que devolverlas antes.`,
          { recua: cambio.recua },
        );
      }
      const restantes: typeof ctx.estado.recuas = {};
      for (const [id, otra] of Object.entries(ctx.estado.recuas)) {
        if (id !== cambio.recua) restantes[id] = otra;
      }
      ctx.estado.recuas = restantes;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.disuelta',
        { recua: cambio.recua, nombre: recua.nombre },
        { jugador: recua.jugador },
      );
      return;
    }

    case 'conocimiento': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      const antes = jugador.conocimiento[cambio.comarca]?.nivel ?? 'desconocida';
      jugador.conocimiento[cambio.comarca] = comoBorrador(cambio.conocimiento);
      if (antes !== cambio.conocimiento.nivel) {
        registrarSuceso(
          ctx.sucesos,
          ctx.fase,
          'conocimiento.cambio',
          { antes, despues: cambio.conocimiento.nivel },
          { jugador: cambio.jugador, comarca: cambio.comarca },
        );
      }
      return;
    }

    case 'fuero': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      comarca.fuero = cambio.fuero;
      comarca.turnoFuero = ctx.turno;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'comarca.fuero',
        { fuero: cambio.fuero },
        { comarca: cambio.comarca, jugador: comarca.duenyo },
      );
      return;
    }

    case 'carga-fiscal': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      comarca.cargaFiscal = cambio.carga;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'comarca.carga-fiscal',
        { carga: cambio.carga },
        { comarca: cambio.comarca, jugador: comarca.duenyo },
      );
      return;
    }

    case 'dehesa': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      comarca.dehesa = cambio.dehesa;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'comarca.dehesa',
        { dehesa: cambio.dehesa ? 1 : 0 },
        { comarca: cambio.comarca, jugador: comarca.duenyo },
      );
      return;
    }

    case 'conservar-sal': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      jugador.conservarConSal = cambio.conservar;
      return;
    }

    case 'desleal': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      if (!Number.isSafeInteger(cambio.turnos) || cambio.turnos < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Los turnos desleales de ${cambio.comarca} no pueden ser ${String(cambio.turnos)}.`,
          { comarca: cambio.comarca },
        );
      }
      comarca.turnosDesleal = cambio.turnos;
      return;
    }

    case 'traslado': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      jugador.traslado = cambio.traslado === null ? null : { ...cambio.traslado };
      return;
    }

    case 'capital': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      const comarca = comarcaDe(ctx, cambio.comarca);
      if (comarca.duenyo !== cambio.jugador) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `${cambio.jugador} no puede tener la corte en ${cambio.comarca}, que no es suya.`,
          { jugador: cambio.jugador, comarca: cambio.comarca },
        );
      }
      const antes = jugador.capital;
      jugador.capital = cambio.comarca;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'corte.trasladada',
        { desde: antes },
        { jugador: cambio.jugador, comarca: cambio.comarca },
      );
      return;
    }

    case 'obra-alta': {
      if (ctx.estado.obras[cambio.obra.id] !== undefined) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Ya hay una obra con el identificador "${cambio.obra.id}".`,
          { obra: cambio.obra.id },
        );
      }
      comarcaDe(ctx, cambio.obra.comarca);
      ctx.estado.obras[cambio.obra.id] = comoBorrador(cambio.obra);
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'obra.empieza',
        {
          obra: cambio.obra.id,
          clase: cambio.obra.tipo,
          que: cambio.obra.que,
          turnos: Math.ceil(cambio.obra.avanceNecesarioMil / 1000),
        },
        { jugador: cambio.obra.jugador, comarca: cambio.obra.comarca },
      );
      return;
    }

    case 'obra-avance': {
      const obra = obraDe(ctx, cambio.obra);
      if (cambio.avanceMil < 0 || cambio.avanceMil > obra.avanceNecesarioMil) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La obra "${cambio.obra}" quedaria en ${String(cambio.avanceMil)} de ${String(obra.avanceNecesarioMil)}.`,
          { obra: cambio.obra },
        );
      }
      for (const recurso of RECURSOS) {
        const entregado = cambio.entregado[recurso];
        if (entregado < 0 || entregado > obra.costeTotal[recurso]) {
          throw new ErrorDeMotor(
            'invariante-rota',
            `La obra "${cambio.obra}" habria recibido ${String(entregado)} de ${recurso} y cuesta ${String(obra.costeTotal[recurso])}.`,
            { obra: cambio.obra, recurso },
          );
        }
      }
      obra.avanceMil = cambio.avanceMil;
      obra.entregado = { ...cambio.entregado };
      return;
    }

    case 'obra-abandono': {
      const obra = obraDe(ctx, cambio.obra);
      if (obra.tipo !== 'obra mayor') {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Solo se abandonan obras mayores y "${cambio.obra}" es de ${obra.tipo}.`,
          { obra: cambio.obra },
        );
      }
      obra.abandonada = cambio.abandonada;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        cambio.abandonada ? 'obra.abandonada' : 'obra.retomada',
        { obra: cambio.obra, que: obra.que },
        { jugador: obra.jugador, comarca: obra.comarca },
      );
      return;
    }

    case 'obra-baja': {
      const obra = obraDe(ctx, cambio.obra);
      const restantes: typeof ctx.estado.obras = {};
      for (const [id, otra] of Object.entries(ctx.estado.obras)) {
        if (id !== cambio.obra) restantes[id] = otra;
      }
      ctx.estado.obras = restantes;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'obra.termina',
        { obra: cambio.obra, clase: obra.tipo, que: obra.que },
        { jugador: obra.jugador, comarca: obra.comarca },
      );
      return;
    }

    case 'potenciales': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      comarca.potenciales = { ...cambio.potenciales };
      return;
    }

    case 'obra-mayor-terminada': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      if (comarca.obrasMayores.includes(cambio.obra)) {
        throw new ErrorDeMotor('invariante-rota', `${cambio.comarca} ya tiene ${cambio.obra}.`, {
          comarca: cambio.comarca,
        });
      }
      comarca.obrasMayores = [...comarca.obrasMayores, cambio.obra];
      return;
    }

    case 'tramo': {
      ctx.estado.caminos[cambio.clave] = { ...cambio.tramo };
      registrarSuceso(ctx.sucesos, ctx.fase, 'camino.mejora', {
        tramo: cambio.clave,
        calidad: cambio.tramo.calidad,
        puente: cambio.tramo.puente ? 1 : 0,
      });
      return;
    }

    case 'rebanyo-alta': {
      if (ctx.estado.rebanyos[cambio.rebanyo.id] !== undefined) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Ya hay un rebanyo con el identificador "${cambio.rebanyo.id}".`,
          { rebanyo: cambio.rebanyo.id },
        );
      }
      jugadorDe(ctx, cambio.rebanyo.jugador);
      comprobarRuta(cambio.rebanyo.id, cambio.rebanyo.situacion, cambio.rebanyo.ruta);
      ctx.estado.rebanyos[cambio.rebanyo.id] = comoBorrador(cambio.rebanyo);
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'rebanyo.forma',
        {
          rebanyo: cambio.rebanyo.id,
          nombre: cambio.rebanyo.nombre,
          cabezas: cambio.rebanyo.cabezas,
        },
        {
          jugador: cambio.rebanyo.jugador,
          comarca:
            cambio.rebanyo.situacion.donde === 'comarca' ? cambio.rebanyo.situacion.comarca : null,
        },
      );
      return;
    }

    case 'rebanyo-baja': {
      const rebanyo = rebanyoDe(ctx, cambio.rebanyo);
      const restantes: typeof ctx.estado.rebanyos = {};
      for (const [id, otro] of Object.entries(ctx.estado.rebanyos)) {
        if (id !== cambio.rebanyo) restantes[id] = otro;
      }
      ctx.estado.rebanyos = restantes;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'rebanyo.desaparece',
        { rebanyo: cambio.rebanyo, nombre: rebanyo.nombre },
        { jugador: rebanyo.jugador },
      );
      return;
    }

    case 'rebanyo-mover': {
      const rebanyo = rebanyoDe(ctx, cambio.rebanyo);
      comprobarRuta(cambio.rebanyo, cambio.situacion, cambio.ruta);
      rebanyo.situacion = comoBorrador(cambio.situacion);
      rebanyo.ruta = [...cambio.ruta];
      return;
    }

    case 'rebanyo-cuentas': {
      const rebanyo = rebanyoDe(ctx, cambio.rebanyo);
      if (
        !Number.isSafeInteger(cambio.pastoDelAnyoMil) ||
        cambio.pastoDelAnyoMil < 0 ||
        !Number.isSafeInteger(cambio.turnosSinPasto) ||
        cambio.turnosSinPasto < 0
      ) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Las cuentas de ${cambio.rebanyo} quedarian en ${String(cambio.pastoDelAnyoMil)} de pasto y ${String(cambio.turnosSinPasto)} turnos sin pasto.`,
          { rebanyo: cambio.rebanyo },
        );
      }
      rebanyo.pastoDelAnyoMil = cambio.pastoDelAnyoMil;
      rebanyo.turnosSinPasto = cambio.turnosSinPasto;
      return;
    }

    case 'rebanyo-cabezas': {
      const rebanyo = rebanyoDe(ctx, cambio.rebanyo);
      const despues = rebanyo.cabezas + cambio.delta;
      if (despues < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `El rebanyo ${cambio.rebanyo} se quedaria con ${String(despues)} cabezas.`,
          { rebanyo: cambio.rebanyo },
        );
      }
      rebanyo.cabezas = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'rebanyo.cabezas',
        { rebanyo: cambio.rebanyo, delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { jugador: rebanyo.jugador },
      );
      return;
    }

    case 'abono': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      const tope = ctx.reglas.ganaderia.nivelesDeAbono;
      if (
        !Number.isSafeInteger(cambio.turnosDeAbono) ||
        cambio.turnosDeAbono < 0 ||
        !Number.isSafeInteger(cambio.estiercol) ||
        cambio.estiercol < 0 ||
        cambio.estiercol > tope
      ) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `El estiercol de ${cambio.comarca} quedaria en ${String(cambio.estiercol)} (tope ${String(tope)}) con ${String(cambio.turnosDeAbono)} turnos de abono.`,
          { comarca: cambio.comarca },
        );
      }
      comarca.turnosDeAbono = cambio.turnosDeAbono;
      comarca.estiercol = cambio.estiercol;
      return;
    }

    case 'acontecimiento-alta': {
      const { acontecimiento } = cambio;
      if (ctx.estado.acontecimientos.some((otro) => otro.id === acontecimiento.id)) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Ya hay un acontecimiento con el identificador "${acontecimiento.id}".`,
          { acontecimiento: acontecimiento.id },
        );
      }
      const aviso = ctx.reglas.acontecimientos.sorteo.turnosDeAviso;
      if (acontecimiento.turnoInicio - acontecimiento.turnoAnuncio !== aviso) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `El acontecimiento "${acontecimiento.id}" se anunciaria ${String(acontecimiento.turnoInicio - acontecimiento.turnoAnuncio)} turnos antes de empezar y tienen que ser ${String(aviso)}.`,
          { acontecimiento: acontecimiento.id },
        );
      }
      ctx.estado.acontecimientos.push(comoBorrador(acontecimiento));
      return;
    }

    case 'acontecimiento-baja': {
      const indice = ctx.estado.acontecimientos.findIndex(
        (otro) => otro.id === cambio.acontecimiento,
      );
      if (indice < 0) {
        throw new ErrorDeMotor(
          'entidad-desconocida',
          `No hay ningun acontecimiento "${cambio.acontecimiento}" en la partida.`,
        );
      }
      ctx.estado.acontecimientos.splice(indice, 1);
      return;
    }

    case 'mercado-alta': {
      if (ctx.estado.mercados[cambio.mercado.id] !== undefined) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Ya hay un mercado con el identificador "${cambio.mercado.id}".`,
          { mercado: cambio.mercado.id },
        );
      }
      comarcaDe(ctx, cambio.mercado.comarca);
      ctx.estado.mercados[cambio.mercado.id] = comoBorrador(cambio.mercado);
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'mercado.abre',
        { mercado: cambio.mercado.id, clase: cambio.mercado.tipo, volumen: cambio.mercado.volumen },
        { comarca: cambio.mercado.comarca },
      );
      return;
    }

    case 'mercado-precio': {
      const mercado = mercadoDe(ctx, cambio.mercado);
      // El suelo y el techo se miden sobre el base de **esta** plaza: primero la abundancia de su
      // comarca (T-052) y encima la carestia que haya. Con el base global se rechazarian precios
      // legitimos de una salina o de un secano.
      const base = precioBaseEfectivo(
        precioBaseLocalMil(
          ctx.reglas.recursos[cambio.recurso].precioBaseMil,
          ctx.mundo.comarcas[mercado.comarca],
          cambio.recurso,
          ctx.reglas.mercado,
        ),
        ctx.estado.acontecimientos,
        ctx.turno,
        {
          region: ctx.mundo.comarcas[mercado.comarca]?.region ?? '',
          comarca: mercado.comarca,
        },
        cambio.recurso,
      );
      const suelo = Math.max(1, multiplicarFactores(base, [ctx.reglas.mercado.sueloMil]));
      const techo = multiplicarFactores(base, [ctx.reglas.mercado.techoMil]);
      if (
        cambio.recurso === 'maravedis' ||
        !Number.isSafeInteger(cambio.precioMil) ||
        cambio.precioMil < suelo ||
        cambio.precioMil > techo ||
        !Number.isSafeInteger(cambio.volumen) ||
        cambio.volumen < 0
      ) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `El precio de ${cambio.recurso} en ${cambio.mercado} quedaria en ${String(cambio.precioMil)} (volumen ${String(cambio.volumen)}) y tiene que estar entre ${String(suelo)} y ${String(techo)}.`,
          { mercado: cambio.mercado, recurso: cambio.recurso },
        );
      }
      mercado.preciosMil[cambio.recurso] = cambio.precioMil;
      mercado.ultimoVolumen[cambio.recurso] = cambio.volumen;
      return;
    }

    case 'orden-cantidad': {
      const orden = ordenDe(ctx, cambio.orden);
      if (orden.tipo !== 'mercado' || cambio.cantidad < 0 || cambio.cantidad > orden.cantidad) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La orden "${cambio.orden}" no puede quedar en ${String(cambio.cantidad)} de cantidad.`,
          { orden: cambio.orden },
        );
      }
      orden.cantidad = cambio.cantidad;
      return;
    }

    case 'orden-avance': {
      const orden = ordenDe(ctx, cambio.orden);
      const despues = orden.turnosHechos + cambio.turnos;
      if (despues < 0 || despues > orden.turnosTotales) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La orden "${cambio.orden}" quedaria en ${String(despues)} turnos de ${String(orden.turnosTotales)}.`,
          { orden: cambio.orden },
        );
      }
      orden.turnosHechos = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'orden.avance',
        { orden: cambio.orden, hechos: despues, totales: orden.turnosTotales },
        { jugador: orden.jugador },
      );
      return;
    }
  }
}
