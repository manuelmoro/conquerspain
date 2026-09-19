// Lo que se mide de cada partida (ficha T-046 §4.3): una fila por jugador y turno, y el resumen de
// la partida. Todo se saca del estado y de los sucesos del turno, como lo veria un auditor.
import {
  CAPITULOS_DE_PRESTIGIO,
  RECURSOS,
  comparar,
  limitesDePrecio,
  prestigioDe,
} from '@conquer/nucleo';
import type {
  CapituloDePrestigio,
  Casa,
  EstadoPartida,
  IdJugador,
  Recursos,
  Recurso,
  Suceso,
  TablasDeReglas,
} from '@conquer/nucleo';

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
  readonly pueblasFundadas: number;
  readonly comarcasIncorporadas: number;
  /** El robot decidio este turno; null si no le tocaba entrar. */
  readonly decidio: boolean | null;
  /** Decidio y no encontro ninguna orden sensata que dar. */
  readonly sinDecision: boolean;
}

export interface MetricasDeJugador {
  readonly jugador: IdJugador;
  readonly casa: Casa;
  readonly filas: readonly FilaDeTurno[];
  /** Recursos que compro en una plaza y vendio en otra: `plaza|recurso` de cada compra y venta. */
  readonly compras: readonly string[];
  readonly ventas: readonly string[];
}

/** Un precio que se quedo en el suelo o en el techo de su plaza muchos turnos seguidos. */
export interface PrecioPegado {
  readonly mercado: string;
  readonly recurso: Recurso;
  readonly extremo: 'suelo' | 'techo';
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
  /** Huella del ultimo turno: si dos ejecuciones la dan distinta, no son la misma partida. */
  readonly huellaFinal: string;
}

function recursosCero(): Record<Recurso, number> {
  return { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 };
}

function numero(valor: number | string | undefined): number {
  return typeof valor === 'number' ? valor : 0;
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

/** Va apuntando cada turno de una partida y al final da sus metricas. */
export class Registro {
  private readonly filas = new Map<string, FilaDeTurno[]>();
  private readonly casas = new Map<string, Casa>();
  private readonly rachas = new Map<string, { extremo: 'suelo' | 'techo'; turnos: number }>();
  private readonly peores = new Map<string, PrecioPegado>();
  private readonly tocadas = new Set<string>();
  private readonly compras = new Map<string, Set<string>>();
  private readonly ventas = new Map<string, Set<string>>();

  constructor(
    private readonly reglas: TablasDeReglas,
    private readonly cadencia: number,
  ) {}

  /** Apunta el turno recien resuelto. `decisiones` dice cuantas ordenes dio cada robot, o null. */
  anotar(
    estado: EstadoPartida,
    sucesos: readonly Suceso[],
    decisiones: ReadonlyMap<string, number | null>,
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
        pueblasFundadas: contar(sucesos, jugador.id, 'recua.funda-puebla'),
        comarcasIncorporadas: contar(sucesos, jugador.id, 'incorporar.completa'),
        decidio: decision === null ? null : true,
        sinDecision: decision === 0,
      };
      this.filas.set(id, [...(this.filas.get(id) ?? []), fila]);
    }
    this.anotarPrecios(estado);
    this.anotarTierra(estado);
    this.anotarTratos(sucesos);
  }

  private anotarTratos(sucesos: readonly Suceso[]): void {
    for (const s of sucesos) {
      if (s.tipo !== 'mercado.trato' || s.jugador === null || numero(s.datos['cantidad']) <= 0) {
        continue;
      }
      const donde = s.datos['operacion'] === 'comprar' ? this.compras : this.ventas;
      const clave = `${String(s.datos['mercado'])}|${String(s.datos['recurso'])}`;
      donde.set(s.jugador, (donde.get(s.jugador) ?? new Set<string>()).add(clave));
    }
  }

  private anotarPrecios(estado: EstadoPartida): void {
    for (const id of Object.keys(estado.mercados).sort(comparar)) {
      const mercado = estado.mercados[id];
      if (mercado === undefined) continue;
      for (const recurso of RECURSOS) {
        if (recurso === 'maravedis') continue;
        const { sueloMil, techoMil } = limitesDePrecio(
          this.reglas.recursos[recurso].precioBaseMil,
          this.reglas.mercado,
        );
        const precio = mercado.preciosMil[recurso];
        const extremo = precio <= sueloMil ? 'suelo' : precio >= techoMil ? 'techo' : null;
        const clave = `${id}|${recurso}`;
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

  private anotarTierra(estado: EstadoPartida): void {
    for (const comarca of Object.values(estado.comarcas)) {
      if (comarca.duenyo !== null || Object.keys(comarca.influencias).length > 0) {
        this.tocadas.add(comarca.id);
      }
    }
    for (const unidad of [...Object.values(estado.recuas), ...Object.values(estado.rebanyos)]) {
      const s = unidad.situacion;
      this.tocadas.add(s.donde === 'comarca' ? s.comarca : s.desde);
    }
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
      jugadores: [...this.filas.keys()].sort(comparar).map((id) => ({
        jugador: id as IdJugador,
        casa: this.casas.get(id) ?? 'mesta',
        filas: this.filas.get(id) ?? [],
        compras: [...(this.compras.get(id) ?? [])].sort(comparar),
        ventas: [...(this.ventas.get(id) ?? [])].sort(comparar),
      })),
      puestos,
      primicias,
      preciosPegados: [...this.peores.values()].sort(
        (a, b) =>
          b.turnos - a.turnos || comparar(a.mercado, b.mercado) || comparar(a.recurso, b.recurso),
      ),
      comarcasTocadas: [...this.tocadas].sort(comparar),
      huellaFinal: estado.huellaTurnoAnterior ?? '',
    };
  }
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
  /** Recursos que compro en una plaza y vendio en otra distinta: el arbitraje. */
  readonly arbitrajes: number;
  readonly ingresosDeFeria: number;
  readonly lanaEsquilada: number;
  readonly pueblasFundadas: number;
  readonly comarcasIncorporadas: number;
  /** Lo producido en toda la partida, por recurso. */
  readonly producido: Recursos;
  /** Lo producido en toda la partida, por clase de edificio. */
  readonly porEdificio: Readonly<Record<string, number>>;
  readonly turnosDeDecision: number;
  readonly turnosSinDecision: number;
}

/** Recursos comprados en una plaza y vendidos en otra. */
function arbitrajesDe(jugador: MetricasDeJugador): number {
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
  const capitulos = {} as Record<CapituloDePrestigio, number>;
  for (const c of CAPITULOS_DE_PRESTIGIO) capitulos[c] = ultima?.capitulos[c] ?? 0;
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
    arbitrajes: arbitrajesDe(jugador),
    ingresosDeFeria: suma((f) => f.ingresosDeFeria),
    lanaEsquilada: suma((f) => f.lanaEsquilada),
    pueblasFundadas: suma((f) => f.pueblasFundadas),
    comarcasIncorporadas: suma((f) => f.comarcasIncorporadas),
    producido,
    porEdificio: edificios,
    turnosDeDecision: filas.filter((f) => f.decidio === true).length,
    turnosSinDecision: filas.filter((f) => f.sinDecision).length,
  };
}
