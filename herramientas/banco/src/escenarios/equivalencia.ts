// Equivalencia de ejecución (ficha T-051 §4.1.1): el mismo plan, jugado de dos maneras.
//
// El jugador diligente entra cada turno y da cada orden el día que toca. El ausente entra una vez
// cada seis turnos y deja ese mismo plan por delante: órdenes fechadas (el plan de temporada llega
// justo a seis turnos), colas, rutas con paradas y reglas de mayordomo. **Los dos deciden con la
// misma información**: la foto del estado al empezar el bloque; ninguno reoptimiza al ver algo que
// pasó dentro del bloque. Si el motor deja jugar sin estar, el resultado tiene que ser el mismo.
//
// Lo que se compara es el **dominio**: comarcas, jugadores, recuas, rebaños, obras y mercados. No
// se comparan la lista de órdenes ni la huella del turno, porque una orden fechada lleva escrito el
// día en que se dio y la del diligente, el día en que se ejecuta: son la misma orden, dicha antes.
import { resolverTurno, vistaDeJugador } from '@conquer/nucleo';
import type {
  EstadoPartida,
  IdJugador,
  IdOrden,
  Mundo,
  Orden,
  OrdenBase,
  Recursos,
  Suceso,
  TablasDeReglas,
  VistaJugador,
} from '@conquer/nucleo';

/** Cada cuántos turnos entra el jugador ausente: el bloque del plan de temporada. */
export const TURNOS_DEL_BLOQUE = 6;

const SIN_COSTE: Recursos = {
  pan: 0,
  madera: 0,
  piedra: 0,
  maravedis: 0,
  sal: 0,
  hierro: 0,
  lana: 0,
};

/**
 * Fabrica las órdenes de un turno del guion. El identificador va por el turno **previsto**, no por
 * el turno en que se envía: así la orden del día 9 se llama igual la dé quien la dé, y el dominio
 * de las dos variantes se puede comparar tal cual.
 */
export class Emisor {
  private contador = 0;

  constructor(
    readonly jugador: IdJugador,
    /** El turno en que el plan quiere que la orden trabaje. */
    readonly turnoPrevisto: number,
  ) {}

  /** Los campos comunes de una orden del guion. */
  base(cambios: Partial<OrdenBase> = {}): OrdenBase {
    this.contador += 1;
    const numero = String(this.contador).padStart(2, '0');
    return {
      id: `g-${this.jugador}-${String(this.turnoPrevisto)}-${numero}` as IdOrden,
      jugador: this.jugador,
      turnoAlta: this.turnoPrevisto,
      estado: 'pendiente',
      coste: SIN_COSTE,
      turnosTotales: 1,
      turnosHechos: 0,
      motivoEspera: null,
      delMayordomo: false,
      turnoProgramado: null,
      cola: null,
      ...cambios,
    };
  }
}

/** Lo que el guion sabe al escribir las órdenes de un turno. */
export interface PasoDelGuion {
  /** El turno en que estas órdenes tienen que trabajar. */
  readonly turno: number;
  /** El estado al empezar el bloque de seis turnos: la única información permitida. */
  readonly bloque: EstadoPartida;
  readonly emisor: Emisor;
}

/** Lo que el jugador ausente sabe al dejar el plan de un bloque. */
export interface BloqueDelGuion {
  /** El primer turno del bloque. */
  readonly turno: number;
  /** Turnos que cubre el plan (seis, o menos si la partida se acaba antes). */
  readonly turnos: number;
  readonly bloque: EstadoPartida;
  /** Un emisor por turno previsto: las órdenes se llaman igual en las dos variantes. */
  emisorDe(turno: number): Emisor;
}

/**
 * Un plan de juego escrito por un humano. `diaria` es lo que teclearía quien entra todos los días;
 * `ausente`, cómo lo deja dicho quien entra una vez por bloque. Si no se dice otra cosa, el plan
 * ausente son las mismas órdenes fechadas con `turnoProgramado`.
 */
export interface Guion {
  readonly nombre: string;
  readonly jugador: IdJugador;
  diaria(paso: PasoDelGuion): readonly Orden[];
  ausente?(bloque: BloqueDelGuion): readonly Orden[];
}

/**
 * El plan de un bloque, fechado: lo que vale para cualquier guion sin mayordomo ni colas. Toda
 * orden entrante lleva el turno en que se envía (`turnoAlta`, que el motor comprueba); la del día
 * que viene lleva además su fecha en `turnoProgramado`, y espera ahí sin reservar nada.
 */
export function fechadas(guion: Guion, bloque: BloqueDelGuion): Orden[] {
  const ordenes: Orden[] = [];
  for (let k = 0; k < bloque.turnos; k += 1) {
    const turno = bloque.turno + k;
    const delDia = guion.diaria({
      turno,
      bloque: bloque.bloque,
      emisor: bloque.emisorDe(turno),
    });
    for (const suya of delDia) {
      ordenes.push(k === 0 ? suya : { ...suya, turnoAlta: bloque.turno, turnoProgramado: turno });
    }
  }
  return ordenes;
}

export interface Ejecucion {
  readonly estado: EstadoPartida;
  /** Las órdenes que se enviaron, por turno de envío. */
  readonly enviadas: ReadonlyMap<number, readonly Orden[]>;
  readonly sucesos: readonly (readonly [number, Suceso])[];
  /** El dominio al acabar cada turno, en forma canónica: para ver dónde empieza una diferencia. */
  readonly dominios: readonly (readonly [number, string])[];
  /** El prestigio de cada jugador al acabar cada turno. */
  readonly prestigios: readonly (readonly [number, Readonly<Record<string, number>>])[];
}

export interface OpcionesDeGuion {
  readonly estado: EstadoPartida;
  readonly mundo: Mundo;
  readonly reglas: TablasDeReglas;
  readonly turnos: number;
  /** 1, el jugador diligente; `TURNOS_DEL_BLOQUE`, el ausente. */
  readonly cadencia: number;
}

/**
 * Juega el guion. Con cadencia 1 cada orden se envía el turno en que trabaja; con la cadencia del
 * bloque, todas las del bloque se envían el primer turno, fechadas con `turnoProgramado`.
 */
export function jugarConGuion(guion: Guion, opciones: OpcionesDeGuion): Ejecucion {
  const { mundo, reglas, turnos, cadencia } = opciones;
  let estado = opciones.estado;
  let bloque = estado;
  const enviadas = new Map<number, readonly Orden[]>();
  const sucesos: [number, Suceso][] = [];
  const dominios: [number, string][] = [];
  const prestigios: [number, Record<string, number>][] = [];
  for (let i = 0; i < turnos; i += 1) {
    const turno = estado.turno;
    const empiezaBloque = i % TURNOS_DEL_BLOQUE === 0;
    if (empiezaBloque) bloque = estado;
    const ordenes: Orden[] = [];
    if (cadencia === 1) {
      ordenes.push(...guion.diaria({ turno, bloque, emisor: new Emisor(guion.jugador, turno) }));
    } else if (empiezaBloque) {
      const plan: BloqueDelGuion = {
        turno,
        turnos: Math.min(TURNOS_DEL_BLOQUE, turnos - i),
        bloque,
        emisorDe: (previsto) => new Emisor(guion.jugador, previsto),
      };
      const suyas = guion.ausente === undefined ? fechadas(guion, plan) : guion.ausente(plan);
      // Se envían hoy, digan la fecha que digan: el motor no acepta una orden de otro turno.
      ordenes.push(...suyas.map((o) => ({ ...o, turnoAlta: turno })));
    }
    enviadas.set(turno, ordenes);
    const resuelto = resolverTurno(estado, ordenes, mundo, reglas);
    for (const suceso of resuelto.sucesos) sucesos.push([turno, suceso]);
    estado = resuelto.estado;
    dominios.push([turno, JSON.stringify(dominioDe(estado))]);
    prestigios.push([turno, prestigiosDe(estado)]);
  }
  return { estado, enviadas, sucesos, dominios, prestigios };
}

/** El prestigio de cada jugador, para comparar las dos maneras de jugar el mismo plan. */
function prestigiosDe(estado: EstadoPartida): Record<string, number> {
  return Object.fromEntries(Object.entries(estado.jugadores).map(([id, j]) => [id, j.prestigio]));
}

/**
 * El dominio: lo que tiene que salir igual se juegue como se juegue. Deja fuera la lista de órdenes
 * y la huella del turno, que llevan escrito cuándo se dio cada orden.
 */
export function dominioDe(estado: EstadoPartida): Record<string, unknown> {
  const { ordenes: _ordenes, huellaTurnoAnterior: _huella, jugadores, ...dominio } = estado;
  // Las colas son listas de identificadores de órdenes: dicen cómo se dijo el plan, no cómo va el
  // dominio. Fuera, como la lista de órdenes.
  const sinColas = Object.fromEntries(
    Object.entries(jugadores).map(([id, jugador]) => {
      // Lo reservado es el espejo de las órdenes en vuelo: una orden que espera pendiente reserva
      // su coste, y una que espera en cola no. Como no se comparan las órdenes, su reserva tampoco.
      const { colas: _colas, reservado: _reservado, ...resto } = jugador;
      return [id, resto];
    }),
  );
  return { ...dominio, jugadores: sinColas };
}

/** Cómo se comportó cada variante del mismo guion. */
export interface Equivalencia {
  readonly diligente: Ejecucion;
  readonly ausente: Ejecucion;
  readonly igual: boolean;
  /** El primer turno en que los dominios dejan de coincidir, o null si nunca. */
  readonly primeraDiferencia: number | null;
}

/** Juega el guion de las dos maneras y dice si el dominio sale igual, turno a turno. */
export function compararGuion(guion: Guion, opciones: OpcionesDeGuion): Equivalencia {
  const diligente = jugarConGuion(guion, { ...opciones, cadencia: 1 });
  const ausente = jugarConGuion(guion, { ...opciones, cadencia: TURNOS_DEL_BLOQUE });
  let primeraDiferencia: number | null = null;
  for (let i = 0; i < diligente.dominios.length && primeraDiferencia === null; i += 1) {
    const a = diligente.dominios[i];
    const b = ausente.dominios[i];
    if (a === undefined || b === undefined || a[1] !== b[1]) {
      primeraDiferencia = a?.[0] ?? ausente.dominios[i]?.[0] ?? null;
    }
  }
  return { diligente, ausente, igual: primeraDiferencia === null, primeraDiferencia };
}

/**
 * El plan que deja un robot que entra cada seis turnos, entregado a mano día a día (ficha T-051
 * §4.1.1). Primero se juega con el robot; se apunta en qué turno empieza a trabajar cada orden que
 * dio, y después se vuelve a jugar entregando esa misma orden **ese** día, sin cola ni fecha. Es el
 * mismo plan y las mismas decisiones: si el dominio sale igual, jugar sin estar no cuesta nada.
 */
export interface PlanDeRobot {
  /** Las órdenes que dio el robot, con el turno en que empezaron a trabajar. */
  readonly ordenes: ReadonlyMap<number, readonly Orden[]>;
  readonly ejecucion: Ejecucion;
}

/**
 * El turno en que cada orden **empieza a trabajar**: el que la pone en curso o la termina. Para una
 * orden en cola o fechada no vale el turno en que se dio: no reserva nada hasta que empieza, y darla
 * a mano antes de tiempo si reservaria.
 */
function turnoDeTrabajo(sucesos: readonly (readonly [number, Suceso])[]): Map<string, number> {
  const empieza = new Map<string, number>();
  for (const [turno, suceso] of sucesos) {
    if (suceso.tipo !== 'orden.estado') continue;
    const estado = String(suceso.datos['estado']);
    if (estado !== 'en curso' && estado !== 'terminada') continue;
    const id = String(suceso.datos['orden']);
    if (!empieza.has(id)) empieza.set(id, turno);
  }
  return empieza;
}

/** Juega con el robot y devuelve su plan, ordenado por el turno en que cada orden trabajó. */
export function planDeRobot(
  robots: readonly RobotDelPlan[],
  opciones: Omit<OpcionesDeGuion, 'cadencia'>,
): PlanDeRobot {
  const ejecucion = jugarConRobots(robots, opciones);
  const empieza = turnoDeTrabajo(ejecucion.sucesos);
  const ordenes = new Map<number, Orden[]>();
  for (const [dada, delTurno] of ejecucion.enviadas) {
    for (const orden of delTurno) {
      // Una orden sin cola ni fecha reserva al darse, trabaje o no: el diligente la da ese mismo
      // día. Las de cola o fechadas no reservan hasta empezar, así que a mano se dan cuando
      // empiezan a trabajar, y las que nunca trabajaron no se habrían dado.
      const alDarse = orden.cola === null && orden.turnoProgramado === null;
      const turno = alDarse ? dada : empieza.get(orden.id);
      if (turno === undefined) continue;
      // A mano se da el día en que hace falta, sin fecha por delante. La cola se conserva: es
      // parte de cómo se dice el plan y la tiene igual quien entra cada día (T-045), no un privilegio
      // del que se va. Lo único que cambia entre las dos variantes es cuándo se manda la orden.
      const aMano: Orden = { ...orden, turnoProgramado: null, turnoAlta: turno };
      ordenes.set(turno, [...(ordenes.get(turno) ?? []), aMano]);
    }
  }
  return { ordenes, ejecucion };
}

/** Lo que el arnés necesita de un robot: su jugador, cada cuánto entra y qué decide. */
export interface RobotDelPlan {
  readonly jugador: IdJugador;
  readonly cadencia: number;
  decidir(
    vista: VistaJugador,
    mundo: Mundo,
    reglas: TablasDeReglas,
  ): { readonly ordenes: readonly Orden[] };
}

/** Juega una partida con sus robots, apuntando lo que envía cada uno y lo que pasa. */
export function jugarConRobots(
  robots: readonly RobotDelPlan[],
  opciones: Omit<OpcionesDeGuion, 'cadencia'>,
): Ejecucion {
  const { mundo, reglas, turnos } = opciones;
  let estado = opciones.estado;
  const enviadas = new Map<number, readonly Orden[]>();
  const sucesos: [number, Suceso][] = [];
  const dominios: [number, string][] = [];
  const prestigios: [number, Record<string, number>][] = [];
  for (let i = 0; i < turnos; i += 1) {
    const turno = estado.turno;
    const delTurno: Orden[] = [];
    for (const robot of robots) {
      if (i % robot.cadencia !== 0) continue;
      const vista = vistaDeJugador(estado, robot.jugador, mundo);
      delTurno.push(...robot.decidir(vista, mundo, reglas).ordenes);
    }
    enviadas.set(turno, delTurno);
    const resuelto = resolverTurno(estado, delTurno, mundo, reglas);
    for (const suceso of resuelto.sucesos) sucesos.push([turno, suceso]);
    estado = resuelto.estado;
    dominios.push([turno, JSON.stringify(dominioDe(estado))]);
    prestigios.push([turno, prestigiosDe(estado)]);
  }
  return { estado, enviadas, sucesos, dominios, prestigios };
}

/** Juega el plan ya escrito, entregando cada orden el día en que tiene que trabajar. */
export function jugarPlanAMano(
  plan: PlanDeRobot,
  opciones: Omit<OpcionesDeGuion, 'cadencia'>,
): Ejecucion {
  const { mundo, reglas, turnos } = opciones;
  let estado = opciones.estado;
  const enviadas = new Map<number, readonly Orden[]>();
  const sucesos: [number, Suceso][] = [];
  const dominios: [number, string][] = [];
  const prestigios: [number, Record<string, number>][] = [];
  // Lo que el motor rechaza hoy por falta de recursos, el jugador lo vuelve a mandar manyana: una
  // orden en cola espera a que haya con que pagarla, y a mano se cancela al darla.
  let reenviar: Orden[] = [];
  for (let i = 0; i < turnos; i += 1) {
    const turno = estado.turno;
    const delPlan = plan.ordenes.get(turno) ?? [];
    const suyas = [...reenviar.map((o) => ({ ...o, turnoAlta: turno })), ...delPlan];
    enviadas.set(turno, suyas);
    const resuelto = resolverTurno(estado, suyas, mundo, reglas);
    for (const suceso of resuelto.sucesos) sucesos.push([turno, suceso]);
    const sinRecursos = new Set(
      resuelto.sucesos
        .filter(
          (s) =>
            s.tipo === 'orden.estado' &&
            s.datos['estado'] === 'cancelada' &&
            s.datos['motivo'] === 'sin-recursos',
        )
        .map((s) => String(s.datos['orden'])),
    );
    reenviar = suyas.filter((o) => sinRecursos.has(o.id));
    estado = resuelto.estado;
    dominios.push([turno, JSON.stringify(dominioDe(estado))]);
    prestigios.push([turno, prestigiosDe(estado)]);
  }
  return { estado, enviadas, sucesos, dominios, prestigios };
}

/** Una casa, un turno y lo que dio el mismo plan jugado de las dos maneras. */
export interface FilaDeEquivalencia {
  readonly jugador: string;
  readonly turno: number;
  /** Prestigio del que dejó el plan por bloques y del que lo entregó a mano, día a día. */
  readonly porBloques: number;
  readonly aMano: number;
  /** Diferencia relativa en milésimas, sobre el mayor de los dos (la fórmula de T-048). */
  readonly diferenciaMil: number;
  /** Primer turno en que el dominio de las dos deja de coincidir; null si nunca. */
  readonly primeraDiferencia: number | null;
}

/**
 * Juega la partida con sus robots y después entrega ese mismo plan a mano, día a día, y compara.
 * Es la equivalencia de ejecución de T-051 §4.1.1 medida sobre las ocho vías a la vez.
 */
export function equivalenciaDeLaPartida(
  robots: readonly RobotDelPlan[],
  opciones: Omit<OpcionesDeGuion, 'cadencia'>,
  turnosQueSeMiran: readonly number[],
): FilaDeEquivalencia[] {
  const plan = planDeRobot(robots, opciones);
  const aMano = jugarPlanAMano(plan, opciones);
  let primeraDiferencia: number | null = null;
  for (let i = 0; i < plan.ejecucion.dominios.length && primeraDiferencia === null; i += 1) {
    if (plan.ejecucion.dominios[i]?.[1] !== aMano.dominios[i]?.[1]) {
      primeraDiferencia = plan.ejecucion.dominios[i]?.[0] ?? null;
    }
  }
  const filas: FilaDeEquivalencia[] = [];
  for (const turno of turnosQueSeMiran) {
    const deBloques = plan.ejecucion.prestigios.find(([t]) => t === turno)?.[1] ?? {};
    const deMano = aMano.prestigios.find(([t]) => t === turno)?.[1] ?? {};
    for (const robot of robots) {
      const a = deBloques[robot.jugador] ?? 0;
      const b = deMano[robot.jugador] ?? 0;
      const mayor = Math.max(Math.abs(a), Math.abs(b), 1);
      filas.push({
        jugador: robot.jugador,
        turno,
        porBloques: a,
        aMano: b,
        diferenciaMil: Math.floor((Math.abs(a - b) * 1000) / mayor),
        primeraDiferencia,
      });
    }
  }
  return filas;
}
