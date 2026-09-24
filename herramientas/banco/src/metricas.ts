// Lo que se mide de cada partida (ficha T-046 §4.3, ampliada por T-048 §4.1 y §4.2): una fila por
// jugador y turno, y el resumen de la partida. Todo se saca del estado y de los sucesos del turno,
// como lo veria un auditor.
//
// T-048 anyade lo que hacia falta para verificar los criterios de T-047 §5 sin abrir snapshots:
// el turno de cada hito y de la primera obra mayor, las rachas de precio contadas solo en turnos de
// mercado abierto, las comarcas pisadas de paso y la traza de cada negocio de arbitraje.
import {
  CAPITULOS_DE_PRESTIGIO,
  HITOS,
  RECURSOS,
  bastimentoDe,
  calendarioDe,
  catalogoDePlazas,
  comparar,
  esPastoCorrecto,
  estacionDe,
  estadoEstacionalDe,
  limitesDePrecio,
  modificadoresDelJugador,
  prestigioDe,
} from '@conquer/nucleo';
import type {
  CapituloDePrestigio,
  Casa,
  EstadoPartida,
  Hito,
  IdComarca,
  IdJugador,
  Mundo,
  Recursos,
  Recurso,
  Suceso,
  TablasDeReglas,
} from '@conquer/nucleo';

import { LibroDeNegocios, tratoDeSuceso } from './negocios.ts';
import type { Motivo } from './robots/motivos.ts';
import type { TrazaDeNegocios } from './negocios.ts';
import { SUCESOS_DE_ENTRADA, pasoDelTurno } from './visitas.ts';

/**
 * Version de las metricas: sube cuando cambia lo que significa una cifra. Va en el manifiesto, para
 * que nadie compare dos informes que no miden lo mismo (ficha T-048 §4.1).
 */
export const VERSION_METRICAS = 5;

/** Lo que decidio un robot en un turno, para medir si sirvio de algo (ficha T-050 §4.1.6). */
export interface DecisionDeRobot {
  /** Identificadores de las ordenes que propuso. */
  readonly ordenes: readonly string[];
  /** Cuantas ordenes de cada clase propuso: para ver que trae entrar mas veces (T-051 §4.1.2). */
  readonly porTipo: Readonly<Record<string, number>>;
  /** Ordenes vivas que ya tenia al decidir: obras, colas y rutas de su plan en marcha. */
  readonly enMarcha: number;
  /** Por que su via no avanzo, si lo dijo. */
  readonly motivos: readonly Motivo[];
}

/** Lo que se sabe de un jugador al acabar un turno. */
export interface FilaDeTurno {
  readonly turno: number;
  readonly prestigio: number;
  readonly capitulos: Readonly<Record<CapituloDePrestigio, number>>;
  readonly penalizaciones: number;
  readonly poblacion: number;
  readonly comarcas: number;
  readonly almacen: Recursos;
  readonly escasez: boolean;
  /** Lo que dieron sus comarcas este turno. */
  readonly produccion: Recursos;
  readonly obrasTerminadas: number;
  readonly obrasMayoresTerminadas: number;
  /** Hitos logrados hasta este turno. */
  readonly hitosLogrados: number;
  /** Jornadas andadas por sus recuas este turno, en milesimas. */
  readonly jornadasMil: number;
  /** Cargas compradas y vendidas en cualquier plaza. */
  readonly volumenComerciado: number;
  /** De ellas, las tratadas por recuas en las paradas de una ruta: el comercio de camino. */
  readonly volumenEnRuta: number;
  /** Lo que dio cada clase de edificio este turno, sumando todos sus recursos. */
  readonly porEdificio: Readonly<Record<string, number>>;
  /** Maravedis cobrados vendiendo en una feria. */
  readonly ingresosDeFeria: number;
  readonly lanaEsquilada: number;
  /** Cargas vendidas de cada recurso, en cualquier plaza. */
  readonly vendido: Readonly<Partial<Record<Recurso, number>>>;
  /** Cargas vendidas en plazas de comarcas que no son suyas: mercancia llevada por el camino. */
  readonly ventasFuera: number;
  /** Niveles de aperos instalados este turno. */
  readonly aperos: number;
  /** Rebanyos que llegaron a un pasto que es el correcto de la estacion: la trashumancia. */
  readonly trashumancias: number;
  readonly pueblasFundadas: number;
  readonly comarcasIncorporadas: number;
  /** El robot decidio este turno; null si no le tocaba entrar. */
  readonly decidio: boolean | null;
  /** Ordenes que propuso el robot. Cero no significa que no hubiera nada util que hacer. */
  readonly ordenesPropuestas: number;
  /** Decidio y no propuso ninguna orden: indicador de actividad, no de utilidad (T-048 §4.2). */
  readonly sinOrdenes: boolean;
  /** Ordenes que entraron en juego este turno (suceso `orden.alta`). */
  readonly ordenesDeAlta: number;
  readonly ordenesTerminadas: number;
  readonly ordenesCanceladas: number;
  readonly ordenesEnEspera: number;
  /** Ordenes que propuso y que el motor no cancelo al darlas de alta: las que trabajan. */
  readonly ordenesUtiles: number;
  /** Tenia ordenes vivas de turnos anteriores: su plan seguia en marcha aunque no diera otras. */
  readonly enMarcha: boolean;
  /**
   * Entro y no hizo nada que sirviera: ninguna orden nueva que trabaje y ningun plan en marcha
   * (ficha T-050 §4.1.6). Es lo que mide el criterio de decisiones utiles.
   */
  readonly sinDecisionUtil: boolean;
  /** Por que su via no avanzo este turno, segun el robot. */
  readonly motivos: readonly Motivo[];
  /** Ordenes por clase, para el diagnostico de frecuencia. */
  readonly porTipo: Readonly<Record<string, number>>;
}

export interface MetricasDeJugador {
  readonly jugador: IdJugador;
  readonly casa: Casa;
  readonly filas: readonly FilaDeTurno[];
  /** Turno en que logro cada hito; null si no lo logro (nunca cero ni omitido). */
  readonly hitos: Readonly<Record<Hito, number | null>>;
  /** Turno en que termino su primera obra mayor; null si no termino ninguna. */
  readonly primeraObraMayor: number | null;
  /** Compras y ventas por `plaza|recurso`: el indicio antiguo, que no prueba ningun negocio. */
  readonly compras: readonly string[];
  readonly ventas: readonly string[];
  /** El arbitraje de verdad, carga a carga (ficha T-048 §4.2). */
  readonly traza: TrazaDeNegocios;
  /** Motivo → ordenes canceladas por el. */
  readonly cancelacionesPorMotivo: Readonly<Record<string, number>>;
  /** Motivo → veces que una orden se quedo esperando por el. */
  readonly esperasPorMotivo: Readonly<Record<string, number>>;
}

/** Un precio que se quedo en el suelo o en el techo de su plaza muchos turnos seguidos. */
export interface PrecioPegado {
  readonly mercado: string;
  readonly recurso: Recurso;
  readonly extremo: 'suelo' | 'techo';
  /** Turnos seguidos **con la plaza abierta**: el cierre de una feria rompe la racha. */
  readonly turnos: number;
}

export interface MetricasDePartida {
  readonly semilla: string;
  readonly turnos: number;
  readonly cadencia: number;
  readonly jugadores: readonly MetricasDeJugador[];
  /** Puesto final de cada jugador (1 es el primero). */
  readonly puestos: Readonly<Record<string, number>>;
  /** Hitos en los que cada jugador fue el primero. */
  readonly primicias: Readonly<Record<string, number>>;
  /** La racha mas larga de cada precio pegado a un extremo, de mas de un turno. */
  readonly preciosPegados: readonly PrecioPegado[];
  /** Comarcas que alguien poseyo, piso o influyo en algun momento. */
  readonly comarcasTocadas: readonly string[];
  /** Las comarcas del mapa que se jugo de verdad: el criterio de tierra se mide sobre ellas. */
  readonly comarcasDelMapa: readonly string[];
  /** Huella del ultimo turno: si dos ejecuciones la dan distinta, no son la misma partida. */
  readonly huellaFinal: string;
}

function recursosCero(): Record<Recurso, number> {
  return { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 };
}

function numero(valor: number | string | undefined): number {
  return typeof valor === 'number' ? valor : 0;
}

function texto(valor: number | string | undefined): string {
  return valor === undefined ? '' : String(valor);
}

/** Suma un dato de los sucesos de un tipo y un jugador. */
function sumar(
  sucesos: readonly Suceso[],
  jugador: IdJugador,
  tipo: string,
  dato: string,
  filtro: (s: Suceso) => boolean = () => true,
): number {
  return sucesos
    .filter((s) => s.tipo === tipo && s.jugador === jugador && filtro(s))
    .reduce((total, s) => total + numero(s.datos[dato]), 0);
}

function contar(
  sucesos: readonly Suceso[],
  jugador: IdJugador,
  tipo: string,
  filtro: (s: Suceso) => boolean = () => true,
): number {
  return sucesos.filter((s) => s.tipo === tipo && s.jugador === jugador && filtro(s)).length;
}

/** Lo producido por cada clase de edificio, segun las explotaciones del turno. */
function porEdificio(sucesos: readonly Suceso[], jugador: IdJugador): Record<string, number> {
  const total: Record<string, number> = {};
  for (const s of sucesos) {
    if (s.tipo !== 'produccion.explotacion' || s.jugador !== jugador) continue;
    const edificio = String(s.datos['edificio']);
    total[edificio] = (total[edificio] ?? 0) + numero(s.datos['resultado']);
  }
  return total;
}

/** Las ordenes propuestas que no se cancelaron este mismo turno. */
function ordenesUtiles(decision: DecisionDeRobot | null, sucesos: readonly Suceso[]): number {
  if (decision === null) return 0;
  const canceladas = new Set(
    sucesos
      .filter((s) => s.tipo === 'orden.estado' && s.datos['estado'] === 'cancelada')
      .map((s) => texto(s.datos['orden'])),
  );
  return decision.ordenes.filter((id) => !canceladas.has(id)).length;
}

/** Cargas vendidas de cada recurso por un jugador en el turno. */
function vendidoPorRecurso(
  sucesos: readonly Suceso[],
  jugador: IdJugador,
): Partial<Record<Recurso, number>> {
  const vendido: Partial<Record<Recurso, number>> = {};
  for (const s of sucesos) {
    if (s.tipo !== 'mercado.trato' || s.jugador !== jugador || s.datos['operacion'] !== 'vender') {
      continue;
    }
    const recurso = texto(s.datos['recurso']) as Recurso;
    vendido[recurso] = (vendido[recurso] ?? 0) + numero(s.datos['cantidad']);
  }
  return vendido;
}

/** Va apuntando cada turno de una partida y al final da sus metricas. */
export class Registro {
  private readonly filas = new Map<string, FilaDeTurno[]>();
  private readonly casas = new Map<string, Casa>();
  private readonly rachas = new Map<string, { extremo: 'suelo' | 'techo'; turnos: number }>();
  private readonly peores = new Map<string, PrecioPegado>();
  private readonly tocadas = new Set<string>();
  private readonly compras = new Map<string, Set<string>>();
  private readonly ventas = new Map<string, Set<string>>();
  private readonly cancelaciones = new Map<string, Map<string, number>>();
  private readonly esperas = new Map<string, Map<string, number>>();
  private readonly libro: LibroDeNegocios;
  private anterior: EstadoPartida | null = null;

  constructor(
    private readonly reglas: TablasDeReglas,
    private readonly mundo: Mundo,
    private readonly cadencia: number,
  ) {
    this.libro = new LibroDeNegocios(reglas);
  }

  /** El estado con el que empieza la partida, antes de resolver ningun turno. */
  empezar(estado: EstadoPartida): void {
    this.anterior = estado;
    this.anotarTierra(estado, []);
  }

  /** Apunta el turno recien resuelto. `decisiones` dice cuantas ordenes dio cada robot, o null. */
  anotar(
    estado: EstadoPartida,
    sucesos: readonly Suceso[],
    decisiones: ReadonlyMap<string, DecisionDeRobot | null>,
  ): void {
    const turno = estado.turno - 1;
    for (const id of Object.keys(estado.jugadores).sort(comparar)) {
      const jugador = estado.jugadores[id];
      if (jugador === undefined) continue;
      this.casas.set(id, jugador.casa);
      const propias = Object.values(estado.comarcas).filter((c) => c.duenyo === jugador.id);
      const produccion = recursosCero();
      for (const comarca of propias) {
        for (const r of RECURSOS) produccion[r] += comarca.produccionUltimoTurno[r];
      }
      const prestigio = prestigioDe(estado, jugador, this.reglas);
      const decision = decisiones.get(id) ?? null;
      const utiles = ordenesUtiles(decision, sucesos);
      const fila: FilaDeTurno = {
        turno,
        prestigio: jugador.prestigio,
        capitulos: prestigio.capitulos,
        penalizaciones: prestigio.penalizaciones,
        poblacion: propias.reduce((total, c) => total + c.poblacion, 0),
        comarcas: propias.length,
        almacen: jugador.almacen,
        escasez: jugador.escasez,
        produccion,
        obrasTerminadas: contar(sucesos, jugador.id, 'obra.termina'),
        obrasMayoresTerminadas: contar(
          sucesos,
          jugador.id,
          'obra.termina',
          (s) => s.datos['clase'] === 'obra mayor',
        ),
        hitosLogrados: Object.keys(jugador.hitos).length,
        jornadasMil: sumar(sucesos, jugador.id, 'recua.avanza', 'andadoMil'),
        volumenComerciado: sumar(sucesos, jugador.id, 'mercado.trato', 'cantidad'),
        volumenEnRuta: sumar(
          sucesos,
          jugador.id,
          'mercado.trato',
          'cantidad',
          (s) => s.datos['via'] === 'parada',
        ),
        porEdificio: porEdificio(sucesos, jugador.id),
        ingresosDeFeria: sumar(
          sucesos,
          jugador.id,
          'mercado.trato',
          'importe',
          (s) =>
            s.datos['operacion'] === 'vender' && String(s.datos['mercado']).startsWith('feria-'),
        ),
        lanaEsquilada: sumar(sucesos, jugador.id, 'rebanyo.esquileo', 'lana'),
        vendido: vendidoPorRecurso(sucesos, jugador.id),
        ventasFuera: sumar(
          sucesos,
          jugador.id,
          'mercado.trato',
          'cantidad',
          (s) =>
            s.datos['operacion'] === 'vender' &&
            s.comarca !== null &&
            estado.comarcas[s.comarca]?.duenyo !== jugador.id,
        ),
        aperos: contar(
          sucesos,
          jugador.id,
          'orden.estado',
          (s) => s.datos['clase'] === 'aperos' && s.datos['estado'] === 'terminada',
        ),
        trashumancias: contar(sucesos, jugador.id, 'rebanyo.llega', (s) =>
          this.enPastoCorrecto(estado, s, turno),
        ),
        pueblasFundadas: contar(sucesos, jugador.id, 'recua.funda-puebla'),
        comarcasIncorporadas: contar(sucesos, jugador.id, 'incorporar.completa'),
        decidio: decision === null ? null : true,
        ordenesPropuestas: decision?.ordenes.length ?? 0,
        sinOrdenes: decision?.ordenes.length === 0,
        ordenesDeAlta: contar(sucesos, jugador.id, 'orden.alta'),
        ordenesTerminadas: contar(
          sucesos,
          jugador.id,
          'orden.estado',
          (s) => s.datos['estado'] === 'terminada',
        ),
        ordenesCanceladas: contar(
          sucesos,
          jugador.id,
          'orden.estado',
          (s) => s.datos['estado'] === 'cancelada',
        ),
        ordenesEnEspera: contar(
          sucesos,
          jugador.id,
          'orden.estado',
          (s) => s.datos['estado'] === 'en espera' || s.datos['estado'] === 'en cola',
        ),
        ordenesUtiles: utiles,
        enMarcha: (decision?.enMarcha ?? 0) > 0,
        sinDecisionUtil: decision !== null && utiles === 0 && decision.enMarcha === 0,
        motivos: decision?.motivos ?? [],
        porTipo: decision?.porTipo ?? {},
      };
      this.filas.set(id, [...(this.filas.get(id) ?? []), fila]);
    }
    this.anotarMotivos(sucesos);
    this.anotarPrecios(estado, turno);
    this.anotarTierra(estado, sucesos);
    this.anotarNegocios(estado, sucesos, turno);
    this.anterior = estado;
  }

  /** La comarca a la que llega un rebanyo es pasto correcto el turno en que llega. */
  private enPastoCorrecto(estado: EstadoPartida, suceso: Suceso, turno: number): boolean {
    const id = suceso.comarca;
    const comarca = id === null ? undefined : estado.comarcas[id];
    const geografia = id === null ? undefined : this.mundo.comarcas[id];
    if (comarca === undefined || geografia === undefined) return false;
    const estacional = estadoEstacionalDe(turno, this.mundo, this.reglas, estado.acontecimientos);
    return esPastoCorrecto(comarca, geografia, estacional, this.reglas);
  }

  /** Por que se cancelan y por que esperan las ordenes: sin esto, «sin decision» no explica nada. */
  private anotarMotivos(sucesos: readonly Suceso[]): void {
    for (const s of sucesos) {
      if (s.tipo !== 'orden.estado' || s.jugador === null) continue;
      const estado = texto(s.datos['estado']);
      const donde =
        estado === 'cancelada'
          ? this.cancelaciones
          : estado === 'en espera' || estado === 'en cola'
            ? this.esperas
            : null;
      if (donde === null) continue;
      const motivo = texto(s.datos['motivo']) || 'sin motivo';
      const clave = `${texto(s.datos['clase'])}: ${motivo}`;
      const suyos = donde.get(s.jugador) ?? new Map<string, number>();
      suyos.set(clave, (suyos.get(clave) ?? 0) + 1);
      donde.set(s.jugador, suyos);
    }
  }

  /** La traza del arbitraje: el bastimento del viaje y cada trato, en el orden en que pasaron. */
  private anotarNegocios(estado: EstadoPartida, sucesos: readonly Suceso[], turno: number): void {
    const estacion = estacionDe(turno, this.reglas);
    for (const s of sucesos) {
      if (s.tipo === 'recua.avanza' && s.jugador !== null) {
        const jugador = estado.jugadores[s.jugador];
        const bastimento = bastimentoDe(
          numero(s.datos['andadoMil']),
          estacion,
          this.reglas,
          jugador === undefined
            ? undefined
            : modificadoresDelJugador(jugador, this.reglas).bastimentoMil,
        );
        this.libro.anotarBastimento(
          s.jugador,
          texto(s.datos['recua']),
          bastimento.pan,
          bastimento.sal,
        );
        continue;
      }
      const trato = tratoDeSuceso(s);
      if (trato === null) continue;
      this.libro.anotarTrato(turno, trato);
      const donde = trato.operacion === 'comprar' ? this.compras : this.ventas;
      const clave = `${trato.mercado}|${trato.recurso}`;
      donde.set(trato.jugador, (donde.get(trato.jugador) ?? new Set<string>()).add(clave));
    }
    for (const recua of Object.values(estado.recuas)) {
      this.libro.ajustarCarga(recua.jugador, recua.id, recua.carga);
    }
    for (const recua of Object.values(this.anterior?.recuas ?? {})) {
      if (estado.recuas[recua.id] === undefined) {
        this.libro.ajustarCarga(recua.jugador, recua.id, null);
      }
    }
  }

  private anotarPrecios(estado: EstadoPartida, turno: number): void {
    const calendario = calendarioDe(turno, this.mundo, this.reglas);
    const catalogo = catalogoDePlazas(estado, this.mundo, calendario.feriasActivas);
    for (const id of Object.keys(estado.mercados).sort(comparar)) {
      const mercado = estado.mercados[id];
      if (mercado === undefined) continue;
      // La plaza cerrada no comercia: su precio almacenado no cuenta y su racha se rompe.
      const abierta = catalogo.abierta(mercado.id) !== null;
      for (const recurso of RECURSOS) {
        if (recurso === 'maravedis') continue;
        const clave = `${id}|${recurso}`;
        if (!abierta) {
          this.rachas.delete(clave);
          continue;
        }
        const { sueloMil, techoMil } = limitesDePrecio(
          this.reglas.recursos[recurso].precioBaseMil,
          this.reglas.mercado,
        );
        const precio = mercado.preciosMil[recurso];
        const extremo = precio <= sueloMil ? 'suelo' : precio >= techoMil ? 'techo' : null;
        const racha = this.rachas.get(clave);
        if (extremo === null) {
          this.rachas.delete(clave);
          continue;
        }
        const turnos = racha?.extremo === extremo ? racha.turnos + 1 : 1;
        this.rachas.set(clave, { extremo, turnos });
        const peor = this.peores.get(clave);
        if (turnos > 1 && (peor === undefined || turnos > peor.turnos)) {
          this.peores.set(clave, { mercado: id, recurso, extremo, turnos });
        }
      }
    }
  }

  private anotarTierra(estado: EstadoPartida, sucesos: readonly Suceso[]): void {
    for (const comarca of Object.values(estado.comarcas)) {
      if (comarca.duenyo !== null || Object.keys(comarca.influencias).length > 0) {
        this.tocadas.add(comarca.id);
      }
    }
    const entradas = sucesos
      .filter((s) => SUCESOS_DE_ENTRADA.includes(s.tipo) && s.comarca !== null)
      .map((s) => s.comarca as IdComarca);
    for (const comarca of pasoDelTurno(estado, entradas)) this.tocadas.add(comarca);
  }

  cerrar(estado: EstadoPartida, semilla: string, turnos: number): MetricasDePartida {
    const puestos: Record<string, number> = {};
    for (const linea of estado.clasificacion) puestos[linea.jugador] = linea.puesto;
    const primicias: Record<string, number> = {};
    for (const id of this.filas.keys()) primicias[id] = 0;
    for (const jugador of Object.values(estado.primicias)) {
      primicias[jugador] = (primicias[jugador] ?? 0) + 1;
    }
    return {
      semilla,
      turnos,
      cadencia: this.cadencia,
      jugadores: [...this.filas.keys()].sort(comparar).map((id) => this.jugador(estado, id)),
      puestos,
      primicias,
      preciosPegados: [...this.peores.values()].sort(
        (a, b) =>
          b.turnos - a.turnos || comparar(a.mercado, b.mercado) || comparar(a.recurso, b.recurso),
      ),
      comarcasTocadas: [...this.tocadas].sort(comparar),
      comarcasDelMapa: Object.keys(this.mundo.comarcas).sort(comparar),
      huellaFinal: estado.huellaTurnoAnterior ?? '',
    };
  }

  private jugador(estado: EstadoPartida, id: string): MetricasDeJugador {
    const filas = this.filas.get(id) ?? [];
    const logrados = estado.jugadores[id]?.hitos ?? {};
    const hitos = {} as Record<Hito, number | null>;
    for (const hito of HITOS) hitos[hito] = logrados[hito] ?? null;
    return {
      jugador: id as IdJugador,
      casa: this.casas.get(id) ?? 'mesta',
      filas,
      hitos,
      primeraObraMayor: filas.find((f) => f.obrasMayoresTerminadas > 0)?.turno ?? null,
      compras: [...(this.compras.get(id) ?? [])].sort(comparar),
      ventas: [...(this.ventas.get(id) ?? [])].sort(comparar),
      traza: this.libro.trazaDe(id),
      cancelacionesPorMotivo: ordenado(this.cancelaciones.get(id)),
      esperasPorMotivo: ordenado(this.esperas.get(id)),
    };
  }
}

/** Un recuento por motivo, siempre en el mismo orden: el informe no puede depender de un Map. */
function ordenado(cuenta: ReadonlyMap<string, number> | undefined): Record<string, number> {
  const salida: Record<string, number> = {};
  for (const clave of [...(cuenta?.keys() ?? [])].sort(comparar)) {
    salida[clave] = cuenta?.get(clave) ?? 0;
  }
  return salida;
}

/** Las cifras de un jugador al acabar la partida, para las tablas del informe. */
export interface ResumenDeJugador {
  readonly casa: Casa;
  readonly prestigio: number;
  readonly capitulos: Readonly<Record<CapituloDePrestigio, number>>;
  readonly puesto: number;
  readonly primicias: number;
  readonly poblacion: number;
  readonly comarcas: number;
  readonly maravedis: number;
  readonly turnosConEscasez: number;
  readonly obrasTerminadas: number;
  readonly obrasMayores: number;
  readonly jornadas: number;
  readonly volumenComerciado: number;
  readonly volumenEnRuta: number;
  /** Recursos que compro en una plaza y vendio en otra: solo un indicio (ficha T-048 §4.2). */
  readonly indicioDeArbitraje: number;
  /** Negocios de arbitraje con traza completa: compra seguida de venta de esa misma mercancia. */
  readonly negocios: number;
  readonly cargasArbitradas: number;
  readonly margenDeNegocios: number;
  readonly margenNetoDeNegocios: number;
  /** Cargas vendidas que no vienen de ninguna compra: produccion propia o carga de casa. */
  readonly ventasSinCompra: number;
  readonly ingresosDeFeria: number;
  readonly lanaEsquilada: number;
  /** Cargas vendidas en toda la partida, por recurso. */
  readonly vendido: Recursos;
  readonly ventasFuera: number;
  readonly aperos: number;
  readonly trashumancias: number;
  /** Negocios de arbitraje que dejaron ganancia despues del bastimento. */
  readonly negociosRentables: number;
  readonly pueblasFundadas: number;
  readonly comarcasIncorporadas: number;
  /** Lo producido en toda la partida, por recurso. */
  readonly producido: Recursos;
  /** Lo producido en toda la partida, por clase de edificio. */
  readonly porEdificio: Readonly<Record<string, number>>;
  readonly turnosDeDecision: number;
  readonly turnosSinOrdenes: number;
  readonly ordenesPropuestas: number;
  readonly ordenesDeAlta: number;
  readonly ordenesTerminadas: number;
  readonly ordenesCanceladas: number;
  readonly ordenesEnEspera: number;
  readonly primeraObraMayor: number | null;
}

/** Recursos comprados en una plaza y vendidos en otra, sin mirar ni el orden ni el origen. */
function indicioDeArbitraje(jugador: MetricasDeJugador): number {
  const partes = (clave: string): [string, string] => {
    const [plaza = '', recurso = ''] = clave.split('|');
    return [plaza, recurso];
  };
  const recursos = new Set<string>();
  for (const compra of jugador.compras) {
    const [plazaCompra, recurso] = partes(compra);
    const vende = jugador.ventas.some((venta) => {
      const [plazaVenta, vendido] = partes(venta);
      return vendido === recurso && plazaVenta !== plazaCompra;
    });
    if (vende) recursos.add(recurso);
  }
  return recursos.size;
}

export function resumir(partida: MetricasDePartida, jugador: MetricasDeJugador): ResumenDeJugador {
  const filas = jugador.filas;
  const ultima = filas.at(-1);
  const suma = (f: (fila: FilaDeTurno) => number): number =>
    filas.reduce((t, fila) => t + f(fila), 0);
  const producido = recursosCero();
  for (const fila of filas) for (const r of RECURSOS) producido[r] += fila.produccion[r];
  const edificios: Record<string, number> = {};
  for (const fila of filas) {
    for (const [edificio, cantidad] of Object.entries(fila.porEdificio)) {
      edificios[edificio] = (edificios[edificio] ?? 0) + cantidad;
    }
  }
  const vendido = recursosCero();
  for (const fila of filas) {
    for (const [recurso, cantidad] of Object.entries(fila.vendido) as [Recurso, number][]) {
      vendido[recurso] += cantidad;
    }
  }
  const capitulos = {} as Record<CapituloDePrestigio, number>;
  for (const c of CAPITULOS_DE_PRESTIGIO) capitulos[c] = ultima?.capitulos[c] ?? 0;
  const negocios = jugador.traza.negocios;
  return {
    casa: jugador.casa,
    prestigio: ultima?.prestigio ?? 0,
    capitulos,
    puesto: partida.puestos[jugador.jugador] ?? 0,
    primicias: partida.primicias[jugador.jugador] ?? 0,
    poblacion: ultima?.poblacion ?? 0,
    comarcas: ultima?.comarcas ?? 0,
    maravedis: ultima?.almacen.maravedis ?? 0,
    turnosConEscasez: filas.filter((f) => f.escasez).length,
    obrasTerminadas: suma((f) => f.obrasTerminadas),
    obrasMayores: suma((f) => f.obrasMayoresTerminadas),
    jornadas: Math.floor(suma((f) => f.jornadasMil) / 1000),
    volumenComerciado: suma((f) => f.volumenComerciado),
    volumenEnRuta: suma((f) => f.volumenEnRuta),
    indicioDeArbitraje: indicioDeArbitraje(jugador),
    negocios: negocios.length,
    cargasArbitradas: negocios.reduce((t, n) => t + n.cargas, 0),
    margenDeNegocios: negocios.reduce((t, n) => t + n.margen, 0),
    margenNetoDeNegocios: negocios.reduce((t, n) => t + n.margenNeto, 0),
    ventasSinCompra: jugador.traza.ventasSinCompra.reduce((t, v) => t + v.cargas, 0),
    ingresosDeFeria: suma((f) => f.ingresosDeFeria),
    lanaEsquilada: suma((f) => f.lanaEsquilada),
    vendido,
    ventasFuera: suma((f) => f.ventasFuera),
    aperos: suma((f) => f.aperos),
    trashumancias: suma((f) => f.trashumancias),
    negociosRentables: negocios.filter((n) => n.margenNeto > 0).length,
    pueblasFundadas: suma((f) => f.pueblasFundadas),
    comarcasIncorporadas: suma((f) => f.comarcasIncorporadas),
    producido,
    porEdificio: edificios,
    turnosDeDecision: filas.filter((f) => f.decidio === true).length,
    turnosSinOrdenes: filas.filter((f) => f.sinOrdenes).length,
    ordenesPropuestas: suma((f) => f.ordenesPropuestas),
    ordenesDeAlta: suma((f) => f.ordenesDeAlta),
    ordenesTerminadas: suma((f) => f.ordenesTerminadas),
    ordenesCanceladas: suma((f) => f.ordenesCanceladas),
    ordenesEnEspera: suma((f) => f.ordenesEnEspera),
    primeraObraMayor: jugador.primeraObraMayor,
  };
}
