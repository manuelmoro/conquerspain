// Tablas de equilibrio. Ningun numero de estos vive en la logica: todos entran por aqui,
// desde paquetes/nucleo/datos (docs/07-arquitectura.md §7.9).
import type { CargaFiscal, Fuero, RecursoAgotable } from './estado.ts';
import type { Potencial } from './mundo.ts';
import type { Recurso, Recursos } from './recursos.ts';

/** Version de las reglas. Sube con cada cambio que altere resultados. */
export const VERSION_REGLAS = 1;

export const CASAS = [
  'mesta',
  'ferrones',
  'canteros',
  'mercaderes',
  'monjes',
  'salineros',
  'arrieros',
  'hortelanos',
] as const;
export type Casa = (typeof CASAS)[number];

/** Las tradiciones se identifican como `<casa>-<nombre>` (docs/04 §4.3). */
export type Tradicion = string;

export const TIPOS_DE_EDIFICIO = [
  'granja',
  'huerta',
  'molino',
  'granero',
  'aserradero',
  'carbonera',
  'cantera',
  'ferreria',
  'salina',
  'majada',
  'lonja',
  'mercado',
  'venta',
  'casas',
  'cerca',
] as const;
export type TipoEdificio = (typeof TIPOS_DE_EDIFICIO)[number];

export function esTipoDeEdificio(texto: string): texto is TipoEdificio {
  return (TIPOS_DE_EDIFICIO as readonly string[]).includes(texto);
}

export const ESTACIONES = ['primavera', 'verano', 'otonyo', 'invierno'] as const;
export type Estacion = (typeof ESTACIONES)[number];

/** Calidad de un tramo de camino (docs/03-economia.md §3.7.2). La calzada nunca se cierra. */
export const CALIDADES_CAMINO = ['vereda', 'herradura', 'carretero', 'calzada'] as const;
export type CalidadCamino = (typeof CALIDADES_CAMINO)[number];

export interface DatosRecurso {
  readonly precioBaseMil: number;
  readonly elasticidadMil: number;
  readonly mermaPorTurnoMil: number;
  readonly perecedero: boolean;
}

export interface DatosEdificio {
  readonly nombre: string;
  readonly potencial: Potencial | null;
  readonly potencialMinimo: number;
  readonly coste: Recursos;
  readonly turnos: number;
  readonly nivelMaximo: number;
  /** Produccion por nivel, antes de aplicar factores. */
  readonly produccion: Readonly<Partial<Record<Recurso, number>>>;
  /** Consumo por turno y nivel (la ferreria quema carbon, la lonja gasta sal). */
  readonly consumo: Readonly<Partial<Record<Recurso, number>>>;
  readonly vecinosPorNivel: number;
  readonly requiereEdificio: TipoEdificio | null;
  readonly esDePiedra: boolean;
}

export interface Permisos {
  readonly pasoFrancoPorCanyada: boolean;
  readonly obraEnComarcaAjena: boolean;
  readonly letraDeCambio: boolean;
  readonly cobrarPortazgo: boolean;
  readonly venderAperos: boolean;
  readonly acequiaMenor: boolean;
  readonly cartaPuebla: boolean;
}

export interface Prohibiciones {
  readonly roturar: boolean;
  readonly cargaFiscalDura: boolean;
  readonly catedral: boolean;
  readonly cobrarPortazgo: boolean;
}

/** Modificadores de una casa o de una tradicion (docs/04 §4.1 y §4.3). */
export interface Modificadores {
  readonly produccionMil: Readonly<Partial<Record<Recurso, number>>>;
  readonly costeEdificioMil: Readonly<Partial<Record<TipoEdificio, number>>>;
  readonly nivelMaximoEdificio: Readonly<Partial<Record<TipoEdificio, number>>>;
  readonly potencialMinimoEdificio: Readonly<Partial<Record<TipoEdificio, number>>>;
  readonly solaresExtra: number;
  readonly aperosMaximo: number;
  /** Jornadas de paso que suma la casa a sus recuas, en milesimas (arrieros: +1000). */
  readonly pasoRecuaMil: number;
  readonly costeRecuaMil: number;
  readonly porteExtra: number;
  readonly obraMayorCosteMil: number;
  readonly obraMayorAvanceMil: number;
  readonly obraSinFrenazoInvernal: boolean;
  readonly mermaPanMil: number;
  readonly comisionMercadoMil: number;
  readonly lanaEsquileoMil: number;
  readonly costeRebanyoMil: number;
  readonly lealtadMinima: number;
  readonly agotamientoMonteMil: number;
  readonly crecimientoMil: number;
}

export interface DatosCasa {
  readonly nombre: string;
  readonly privilegio: string;
  readonly herramienta: string;
  readonly limite: string;
  readonly modificadores: Modificadores;
  readonly permisos: Permisos;
  readonly prohibiciones: Prohibiciones;
  /** Potenciales que el sorteo de origen le exige a su comarca de partida. */
  readonly potencialesDeOrigen: Readonly<Partial<Record<Potencial, number>>>;
}

export interface DatosTradicion {
  readonly casa: Casa;
  readonly ronda: 'renombre' | 'fama' | 'linaje';
  readonly nombre: string;
  readonly descripcion: string;
  readonly nota: string;
  readonly modificadores: Modificadores;
  /** Las tradiciones que dependen de mecanicas aun no implementadas no se ofrecen. */
  readonly desactivada: boolean;
}

export interface DatosEstaciones {
  readonly turnosPorAnyo: number;
  readonly estacionPorTurno: readonly Estacion[];
  readonly factorPanMil: Readonly<Record<Estacion, number>>;
  /** Coste de las obras de canteria por estacion: en invierno la helada estropea la cal. */
  /** Lo que se alarga una obra de piedra o de madera en cada estacion (2000 = el doble). */
  readonly factorObraPiedraMil: Readonly<Record<Estacion, number>>;
  readonly factorObraMaderaMil: Readonly<Record<Estacion, number>>;
  readonly turnosDeBarro: readonly number[];
  readonly turnoDeEsquileo: number;
  readonly turnosPastoDeVerano: readonly number[];
}

/** Cadena de produccion de una explotacion (docs/03-economia.md §3.2 a §3.5). */
export interface DatosProduccion {
  /** Multiplicador por nivel de potencial, de 0 a 5. */
  readonly multiplicadorPotencialMil: readonly number[];
  /** Lo que suma cada nivel de aperos a la produccion de toda la comarca. */
  readonly aperoMil: number;
  /** Tramos de lealtad: el primero cuyo `menorQue` supere la lealtad fija el factor. */
  readonly lealtad: readonly { readonly menorQue: number; readonly factorMil: number }[];
  readonly agotamiento: {
    readonly factorPorPuntoMil: number;
    readonly sueloMil: number;
    readonly porNivel: number;
    readonly maximo: number;
    readonly regeneracion: Readonly<Record<RecursoAgotable, number>>;
  };
  /** La dehesa: menos agotamiento del monte a cambio de menos madera. */
  readonly dehesa: { readonly agotamientoMonteMil: number; readonly maderaMil: number };
  /** Explotaciones cuyo pan sigue la estacion; la huerta y la lonja no. */
  readonly edificiosEstacionales: readonly TipoEdificio[];
  /** Lo que cada nivel de molino suma al pan de las granjas. */
  readonly molinoMil: number;
  readonly maravedis: {
    readonly porNivelMercado: number;
    readonly vecinosPorPunto: number;
    readonly cargaFiscal: Readonly<Record<CargaFiscal, number>>;
  };
}

/** Lo que se come, se mantiene y se pierde cada turno (docs/03 §3.1, §3.6 y §3.9; T-032). */
export interface DatosConsumo {
  readonly panPorCuadrilla: number;
  readonly hierroPorApero: number;
  /** Turnos seguidos sin hierro tras los que los aperos bajan un nivel. */
  readonly turnosSinHierroParaPerderApero: number;
  /** Lo que rebajan la merma del pan un granero y la sal gastada en conservarlo. */
  readonly mermaGraneroMil: number;
  readonly mermaSalMil: number;
  /** Una carga de sal conserva esta cantidad de pan. */
  readonly panPorSal: number;
  readonly administracionBase: number;
  readonly administracionPorJornada: number;
  readonly lealtadPorEscasez: number;
  /** Lo que baja la lealtad por turno cuando el hambre se alarga y la gente ya se va. */
  readonly lealtadPorHambreProlongada: number;
  readonly lealtadPorDeudaDeAdministracion: number;
  /** Escaseces seguidas a partir de las que la gente se va. */
  readonly escasezParaEmigrar: number;
  /** Turnos de reserva por debajo de los que se avisa del hambre. */
  readonly turnosDeAvisoDeHambre: number;
}

export interface DatosMovimiento {
  readonly jornadasPorTerreno: Readonly<Record<string, number>>;
  readonly factorCaminoMil: Readonly<Record<CalidadCamino, number>>;
  readonly jornadasDeVado: number;
  /** Jornadas que anda una recua por turno, en milesimas, antes de ajustes. */
  readonly pasoBaseMil: number;
  /** Lo que resta ir cargada (a partir de `cargaPesadaMil` del porte) y el barro; suma la calzada. */
  readonly pasoCargadaMil: number;
  readonly pasoBarroMil: number;
  readonly pasoCalzadaMil: number;
  /** Nunca se anda menos de esto por turno. */
  readonly pasoMinimoMil: number;
  readonly cargaPesadaMil: number;
  readonly bastimentoPorJornada: number;
  /** En verano, una carga de sal de conservas por cada tantas jornadas (o fraccion). */
  readonly jornadasPorSalEnVerano: number;
  /** Acemilas de una recua recien formada; cada una lleva `portePorAcemila` cargas. */
  readonly acemilasPorRecua: number;
  readonly portePorAcemila: number;
  /** Vecinos que salen de la comarca para llevar la recua; vuelven al disolverla. */
  readonly arrierosPorRecua: number;
  /** Gente que puede llevar una recua ademas de sus arrieros. */
  readonly vecinosMaximosPorRecua: number;
  readonly costeFormarRecua: Recursos;
  readonly factorBarroMil: number;
  readonly factorNieveMil: number;
  readonly factorVeranoMil: number;
}

/** Cometidos de las recuas (docs/03-economia.md §3.7.3; ficha T-034). */
export interface DatosCometidos {
  /** Probabilidad de que una exploracion encuentre algo, en milesimas. */
  readonly probabilidadHallazgoMil: number;
  readonly influenciaParaPuebla: number;
  readonly vecinosParaPuebla: number;
  readonly turnosParaPuebla: number;
  readonly lealtadDePuebla: number;
  /** Jornadas de bastimento que gasta al turno una recua que esta presente, en milesimas. */
  readonly bastimentoPresenciaMil: number;
  /** Parte de los maravedis de formacion que se recuperan al disolver. */
  readonly devolucionAlDisolverMil: number;
}

/** Las siete obras mayores (docs/03-economia.md §3.11). */
export const TIPOS_DE_OBRA_MAYOR = [
  'puente',
  'calzada',
  'monasterio',
  'catedral',
  'muralla',
  'atarazana',
  'acequia-mayor',
] as const;
export type TipoObraMayor = (typeof TIPOS_DE_OBRA_MAYOR)[number];

export function esTipoDeObraMayor(texto: string): texto is TipoObraMayor {
  return (TIPOS_DE_OBRA_MAYOR as readonly string[]).includes(texto);
}

/** Las que se levantan en un tramo de camino y no en una comarca. */
export const OBRAS_MAYORES_DE_TRAMO: readonly TipoObraMayor[] = ['puente', 'calzada'];

export interface DatosObraMayor {
  readonly nombre: string;
  readonly turnos: number;
  /** Coste total, que se paga a plazos segun avanza la obra. */
  readonly coste: Recursos;
  readonly esDePiedra: boolean;
}

/** Obras, cuadrillas y efectos de las obras mayores (docs/03 §3.3 y §3.11; ficha T-035). */
export interface DatosObras {
  readonly cuadrillasPorFuero: number;
  readonly cuadrillasPorMonasterio: number;
  readonly turnosDerribo: number;
  /** Parte del material de un edificio que se recupera al derribarlo. */
  readonly devolucionDerriboMil: number;
  readonly turnosRoturar: number;
  readonly costeRoturar: Recursos;
  /** En dehesa roturar cuesta mas (2000 = el doble) y enfada al concejo. */
  readonly costeRoturarDehesaMil: number;
  readonly lealtadPorRoturarDehesa: number;
  /** Lo que se deteriora al turno una obra mayor abandonada, sobre lo construido. */
  readonly deterioroAbandonoMil: number;
  readonly lealtadParaMonasterio: number;
  readonly vecinosDeCiudad: number;
  readonly lealtadPorMuralla: number;
  readonly lealtadRegionalPorCatedral: number;
  readonly maravedisPorPeregrinos: number;
  readonly crecimientoPorMonasterioMil: number;
  readonly laborPorAcequiaMil: number;
}

export interface DatosPoblacion {
  /**
   * Pan que come cada vecino por turno, en milesimas. El vecino es una familia que vive casi toda
   * de lo suyo: el pan del almacen es el excedente que la sostiene en los malos meses.
   */
  readonly consumoPorVecinoMil: number;
  readonly vecinosPorCuadrilla: number;
  readonly cuadrillasMaximas: number;
  readonly capacidadBase: number;
  readonly capacidadPorCasas: number;
  readonly crecimientoBase: number;
  readonly crecimientoMaximoMil: number;
  readonly emigracionPorHambreMil: number;
  readonly lealtadInicialIncorporada: number;
  readonly turnosDeslealParaPerderla: number;
  readonly fueros: Readonly<Record<Fuero, DatosFuero>>;
}

export interface DatosFuero {
  readonly administracionMil: number;
  readonly impuestosMil: number;
  readonly lealtadPorTurno: number;
}

export interface DatosMercado {
  readonly comisionMil: number;
  readonly comisionFeriaMil: number;
  readonly movimientoMaximoPorTurnoMil: number;
  readonly regresionAlBaseMil: number;
  readonly sueloMil: number;
  readonly techoMil: number;
  readonly volumenBase: number;
  readonly multiplicadorVolumen: Readonly<Record<string, number>>;
  readonly liquidezMercaderesMenoresMil: number;
}

export interface DatosInfluencia {
  readonly porPresencia: number;
  readonly porComarcaVecina: number;
  readonly maximoPorComarcasVecinas: number;
  readonly porMercadoVecino: number;
  readonly porComercioPorCadaCincuenta: number;
  readonly maximoPorComercio: number;
  readonly porMonasterio: number;
  readonly porRegalo: number;
  readonly costeRegalo: number;
  readonly turnosEntreRegalos: number;
  readonly porCamino: number;
  readonly desgastePorTurno: number;
  readonly minimaParaIncorporar: number;
  readonly ventajaSobreElSegundo: number;
  readonly jornadasMaximasDesdeElDominio: number;
  readonly costeIncorporar: Recursos;
  readonly turnosIncorporar: number;
}

export interface DatosPrestigio {
  readonly porCadaCincoVecinos: number;
  readonly porComarca: number;
  readonly porComarcaConFuero: number;
  readonly porObraMayor: Readonly<Record<string, number>>;
  readonly porTramoDeCamino: number;
  readonly porFeriaDestacada: number;
  readonly porPrimicia: number;
  readonly porComarcaExplorada: number;
  readonly porAnyoTrashumante: number;
  readonly porAperosAltos: number;
  readonly penalizacionPorComarcaPerdida: number;
  readonly penalizacionPorEscasez: number;
}

/** Con que empieza una casa en su comarca de origen (lo usa el alta de partida, T-065). */
export interface DatosArranque {
  readonly almacen: Recursos;
  readonly edificiosDeOrigen: Readonly<Partial<Record<TipoEdificio, number>>>;
}

export interface TablasDeReglas {
  readonly version: number;
  readonly recursos: Readonly<Record<Recurso, DatosRecurso>>;
  readonly edificios: Readonly<Record<TipoEdificio, DatosEdificio>>;
  readonly casas: Readonly<Record<Casa, DatosCasa>>;
  readonly tradiciones: Readonly<Record<string, DatosTradicion>>;
  readonly estaciones: DatosEstaciones;
  readonly produccion: DatosProduccion;
  readonly consumo: DatosConsumo;
  readonly movimiento: DatosMovimiento;
  readonly cometidos: DatosCometidos;
  readonly obras: DatosObras;
  readonly obrasMayores: Readonly<Record<TipoObraMayor, DatosObraMayor>>;
  readonly poblacion: DatosPoblacion;
  readonly mercado: DatosMercado;
  readonly influencia: DatosInfluencia;
  readonly prestigio: DatosPrestigio;
  readonly arranque: DatosArranque;
}
