// Tablas de equilibrio. Ningun numero de estos vive en la logica: todos entran por aqui,
// desde paquetes/nucleo/datos (docs/07-arquitectura.md §7.9).
import type {
  CargaFiscal,
  EfectoAcontecimiento,
  Fuero,
  QueDeEfecto,
  RecursoAgotable,
} from './estado.ts';
import type { NivelPotencial, Potencial, Rasgo, Terreno, VolumenFeria } from './mundo.ts';
import type { Recurso, Recursos } from './recursos.ts';
import type { Milesimas } from '../utiles/enteros.ts';

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
  'acequia',
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
  /** Permiso de casa sin el cual no se puede levantar (la acequia menor); null: cualquiera. */
  readonly exigePermiso: keyof Permisos | null;
  /**
   * Se puede levantar en **tierra de nadie**: una comarca explorada y sin duenyo (ficha T-053).
   * Solo la venta, la posada del camino, que se hacia fuera de poblado. Lo que se levanta alli no
   * pasa a ser tuyo: si alguien incorpora la comarca, se queda con ella y con lo que haya dentro.
   */
  readonly enTierraDeNadie: boolean;
}

/** Los permisos de casa, en el orden de `Permisos`: para validar y para enumerar. */
export const NOMBRES_DE_PERMISO = [
  'pasoFrancoPorCanyada',
  'obraEnComarcaAjena',
  'letraDeCambio',
  'cobrarPortazgo',
  'venderAperos',
  'acequiaMenor',
  'cartaPuebla',
  'corresponsales',
] as const;

export interface Permisos {
  readonly pasoFrancoPorCanyada: boolean;
  readonly obraEnComarcaAjena: boolean;
  readonly letraDeCambio: boolean;
  readonly cobrarPortazgo: boolean;
  readonly venderAperos: boolean;
  readonly acequiaMenor: boolean;
  readonly cartaPuebla: boolean;
  /** Recibe cada turno los precios de las plazas que visito alguna vez, y rumores de mas. */
  readonly corresponsales: boolean;
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
  /** Lo deprisa que se agota cada recurso en las comarcas de la casa: 1000 si nada. */
  readonly agotamientoMil: Readonly<Partial<Record<RecursoAgotable, number>>>;
  readonly crecimientoMil: number;
  /** Produccion de un edificio concreto (la lonja de quien la trabaja mejor): 1000 si nada. */
  readonly produccionEdificioMil: Readonly<Partial<Record<TipoEdificio, number>>>;
  /** Lo que rinde un edificio en una comarca de vega o con rio: 1000 si nada. */
  readonly produccionEdificioEnVegaMil: Readonly<Partial<Record<TipoEdificio, number>>>;
  /** Lo que rinde el pan de la labor fuera de una vega o un rio: 1000 si nada. */
  readonly laborFueraDeVegaMil: number;
  /** Niveles de un edificio que sostiene cada nivel del que depende (la ferreria de la carbonera). */
  readonly edificiosPorRequisito: Readonly<Partial<Record<TipoEdificio, number>>>;
  /** Coste de una obra mayor concreta (el monasterio de quien mejor lo levanta): 1000 si nada. */
  readonly costeObraMayorMil: Readonly<Partial<Record<TipoObraMayor, number>>>;
  /** Vecinos que suma (o resta) cada nivel de casas a la capacidad de la comarca. */
  readonly capacidadPorCasasExtra: number;
  /** Gente que hace falta para fundar puebla, sobre la de la tabla: 1000 si nada. */
  readonly vecinosParaPueblaMil: number;
  /** Avance de una obra mayor concreta (la catedral de quien sabe cerrar cimborrios): 1000 si nada. */
  readonly avanceObraMayorMil: Readonly<Partial<Record<TipoObraMayor, number>>>;
  /** Cuadrillas que suma (o resta) cada comarca propia. */
  readonly cuadrillasExtra: number;
  /** Lo que rinde cada nivel de aperos, sobre el de la tabla: 1000 si nada. */
  readonly efectoAperosMil: number;
  /** Lo que cuesta administrar cada comarca: 1000 si nada. */
  readonly administracionMil: number;
  /** Lo que aporta cada fuente de influencia y el regalo (no el desgaste): 1000 si nada. */
  readonly influenciaMil: number;
  /** Bastimento que comen las recuas por jornada: 1000 si nada. */
  readonly bastimentoMil: number;
}

/**
 * Como se compone cada modificador de una tradicion con el de la casa: los factores se multiplican,
 * los sumandos se suman y los valores fijos (niveles, tasas, minimos) los pone la tradicion.
 */
export type ComposicionDeModificador = 'factor' | 'suma' | 'fija';

export const COMPOSICION_DE_MODIFICADORES: {
  readonly [K in keyof Modificadores]-?: ComposicionDeModificador;
} = {
  produccionMil: 'factor',
  costeEdificioMil: 'factor',
  nivelMaximoEdificio: 'fija',
  potencialMinimoEdificio: 'fija',
  solaresExtra: 'suma',
  aperosMaximo: 'fija',
  pasoRecuaMil: 'suma',
  costeRecuaMil: 'factor',
  porteExtra: 'suma',
  obraMayorCosteMil: 'factor',
  obraMayorAvanceMil: 'factor',
  obraSinFrenazoInvernal: 'fija',
  mermaPanMil: 'fija',
  comisionMercadoMil: 'fija',
  lanaEsquileoMil: 'factor',
  costeRebanyoMil: 'factor',
  lealtadMinima: 'fija',
  agotamientoMil: 'factor',
  crecimientoMil: 'factor',
  produccionEdificioMil: 'factor',
  produccionEdificioEnVegaMil: 'factor',
  laborFueraDeVegaMil: 'factor',
  edificiosPorRequisito: 'fija',
  costeObraMayorMil: 'factor',
  capacidadPorCasasExtra: 'suma',
  vecinosParaPueblaMil: 'factor',
  avanceObraMayorMil: 'factor',
  cuadrillasExtra: 'suma',
  efectoAperosMil: 'factor',
  administracionMil: 'factor',
  influenciaMil: 'factor',
  bastimentoMil: 'factor',
};

/**
 * Una manera de ser buen origen para una casa: cumple todo lo que pida. Los potenciales son
 * minimos; `rasgos` y `terrenos` piden alguno de la lista; `vecinaConPotencial`, que una vecina
 * lo tenga.
 */
export interface CriterioDeOrigen {
  readonly potenciales: Readonly<Partial<Record<Potencial, number>>>;
  readonly rasgos: readonly Rasgo[];
  readonly terrenos: readonly Terreno[];
  readonly vecinaConPotencial: { readonly potencial: Potencial; readonly nivel: number } | null;
}

export interface DatosCasa {
  readonly nombre: string;
  readonly privilegio: string;
  readonly herramienta: string;
  readonly limite: string;
  readonly modificadores: Modificadores;
  readonly permisos: Permisos;
  readonly prohibiciones: Prohibiciones;
  /** Comarcas que puede ofrecerle el sorteo de origen: basta con cumplir un criterio. */
  readonly origenes: readonly CriterioDeOrigen[];
  /**
   * La primera pieza de su oficio, que el alta le levanta en la capital si la comarca la admite;
   * null si su oficio no empieza por un edificio (ficha T-049 §4.5).
   */
  readonly edificioDeOrigen: TipoEdificio | null;
  /**
   * Su diseno es comprar el pan, no cultivarlo: el arranque no le exige alimentarse de su tierra
   * y le da maravedis en su lugar (docs/04 §4.1).
   */
  readonly compraElPan: boolean;
}

/** Las tres rondas de eleccion, en el orden en que suelen abrirse (docs/04 §4.3). */
export const RONDAS_DE_TRADICION = ['renombre', 'fama', 'linaje'] as const;
export type RondaDeTradicion = (typeof RONDAS_DE_TRADICION)[number];

/**
 * Lo que hace una tradicion con su casa (ficha T-042 §4.3): profundizar en lo suyo con un coste,
 * compensar su limite sin quitarle identidad, o abrir una via inesperada.
 */
export const CRITERIOS_DE_TRADICION = ['profundizar', 'compensar', 'abrir'] as const;
export type CriterioDeTradicion = (typeof CRITERIOS_DE_TRADICION)[number];

export interface DatosTradicion {
  readonly casa: Casa;
  readonly ronda: RondaDeTradicion;
  readonly criterio: CriterioDeTradicion;
  readonly nombre: string;
  /** El efecto en una frase, tal como se ensenya en la carta. */
  readonly descripcion: string;
  /** La nota historica de la carta: contenido, no relleno. */
  readonly nota: string;
  /** Solo lo que cambia; se compone con la casa segun `COMPOSICION_DE_MODIFICADORES`. */
  readonly modificadores: Readonly<Partial<Modificadores>>;
  readonly permisos: Readonly<Partial<Permisos>>;
  readonly prohibiciones: Readonly<Partial<Prohibiciones>>;
  /** Las que dependen de mecanicas aun no implementadas no se ofrecen. */
  readonly desactivada: boolean;
  /** La tarea que la activara; null si esta activa. */
  readonly pendienteDe: string | null;
}

/**
 * Cuando se abre una ronda: basta con cumplir una de las condiciones (los umbrales a null no
 * cuentan). La obra mayor es una que el jugador termina, no una que hereda al incorporar una
 * comarca.
 */
export interface CondicionDeRonda {
  /** Comarcas propias. */
  readonly comarcas: number | null;
  /** Vecinos en todo el dominio. */
  readonly vecinos: number | null;
  readonly obraMayorTerminada: boolean;
  readonly prestigio: number | null;
  readonly turno: number | null;
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
  /** Lo que cuesta instalar un nivel de aperos (docs/03 §3.3.1). */
  readonly costeAperos: Recursos;
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
  readonly capacidadPorMuralla: number;
  readonly fueros: Readonly<Record<Fuero, DatosFuero>>;
}

/** Lealtad, fueros, administracion y traslado de la corte (docs/03 §3.6 y §3.9; ficha T-036). */
export interface DatosTerritorio {
  /** El fuero sube la lealtad hasta aqui, no mas. */
  readonly lealtadMaximaPorFuero: number;
  readonly lealtadPorMercado: number;
  readonly lealtadPorObraMayorCerca: number;
  readonly lealtadPorCargaLigera: number;
  readonly lealtadPorCargaDura: number;
  /** Mas alla de estas jornadas de la capital, la comarca se siente lejos. */
  readonly jornadasDeLejania: number;
  readonly lealtadPorLejania: number;
  readonly lealtadPorAbandono: number;
  /** Por debajo, la comarca es desleal: no forma recuas y empieza la cuenta atras. */
  readonly lealtadDesleal: number;
  readonly turnosEntreCambiosDeFuero: number;
  readonly turnosFueroIrreversible: number;
  readonly lealtadPorQuitarFuero: number;
  readonly turnosTraslado: number;
  /** Coste de la orden de traslado (lo calcula el servidor al darla). */
  readonly costeTraslado: Recursos;
  readonly recargoAdministracionTrasladoMil: number;
}

export interface DatosFuero {
  readonly administracionMil: number;
  readonly impuestosMil: number;
  readonly lealtadPorTurno: number;
  readonly crecimientoMil: number;
}

/** Mercados, ferias y precios (docs/03-economia.md §3.10; ficha T-037). */
/** Los rebanyos, sus pastos y el esquileo (docs/03-economia.md §3.8; ficha T-040). */
export interface DatosGanaderia {
  readonly cabezasPorRebanyo: number;
  /** Lo que cuesta formar un rebanyo antes de lo que cambie la casa. */
  readonly costeFormarRebanyo: Recursos;
  /** Vecinos que se van con el ganado al formar un rebanyo. */
  readonly vecinosPorRebanyo: number;
  /** Jornadas por turno, en milesimas, y lo que suma ir por una canyada. */
  readonly pasoBaseMil: number;
  readonly pasoCanyadaMil: number;
  /** Potencial de pasto minimo para que una comarca sea pasto correcto. */
  readonly pastoMinimo: number;
  /** Cabezas que mantiene cada punto de pasto de una comarca. */
  readonly cabezasPorPuntoDePasto: number;
  readonly sacasPorRebanyo: number;
  /** Pan por turno y por cada rebanyo estandar (queso y corderos). */
  readonly panPorTurno: number;
  readonly turnosSinPastoParaPerder: number;
  readonly perdidaPorSinPastoMil: number;
  /** Turnos de invernada en una comarca propia para ganar un nivel de estiercol. */
  readonly turnosDeInvernadaParaAbono: number;
  readonly abonoPorNivelMil: number;
  readonly nivelesDeAbono: number;
  /** Turnos de antelacion con que se avisa de un puerto que va a cerrar. */
  readonly avisoDePuertoTurnos: number;
  /** Lo que cuesta una canyada al trazar la ruta de un rebanyo (500 = la mitad). */
  readonly costeCanyadaMil: number;
}

export interface DatosMercado {
  /** Tope de la comision en feria; en el mercado local manda la de cada casa. */
  readonly comisionFeriaMil: number;
  /** Comision de una letra de cambio (los mercaderes): 30 es un 3 %. */
  readonly comisionLetraMil: number;
  readonly movimientoMaximoPorTurnoMil: number;
  readonly regresionAlBaseMil: number;
  readonly sueloMil: number;
  readonly techoMil: number;
  readonly volumenBase: number;
  readonly multiplicadorVolumen: Readonly<Record<string, number>>;
  /** Cupo de los mercaderes menores como parte del tope de volumen (1000 = todo el tope). */
  readonly liquidezMercaderesMenoresMil: number;
  /** Los menores compran hasta base × (1 + margen) y venden desde base × (1 - margen). */
  readonly margenMercaderesMenoresMil: number;
  /**
   * Lo que sobra vale menos donde sobra (ficha T-052 §4.2). Indexada por el nivel de potencial
   * 0…5 de la comarca: el precio base de un recurso alli es el del catalogo por este factor.
   */
  readonly abundanciaMil: readonly number[];
  /** Que potencial abarata cada recurso. Sin entrada, el recurso vale igual en todas partes. */
  readonly potencialDeRecurso: Readonly<Partial<Record<Recurso, Potencial>>>;
}

export interface DatosInfluencia {
  readonly porPresencia: number;
  readonly porComarcaVecina: number;
  readonly maximoPorComarcasVecinas: number;
  readonly porMercadoVecino: number;
  /** Cada bloque de tantos maravedis comerciados en la comarca da `porBloqueDeComercio` puntos. */
  readonly maravedisPorBloqueDeComercio: number;
  readonly porBloqueDeComercio: number;
  readonly maximoPorComercio: number;
  readonly porMonasterio: number;
  readonly porRegalo: number;
  readonly costeRegalo: number;
  readonly turnosEntreRegalos: number;
  readonly porCamino: number;
  readonly desgastePorTurno: number;
  /** Lo que resta vaciar el mercado de pan de una comarca neutral. */
  readonly desgastePorEscasez: number;
  readonly minimaParaIncorporar: number;
  readonly ventajaSobreElSegundo: number;
  readonly jornadasMaximasDesdeElDominio: number;
  readonly costeIncorporar: Recursos;
  readonly turnosIncorporar: number;
}

/** Los limites de jugar sin estar (docs/02 §2.5; ficha T-045). */
export interface DatosMayordomo {
  readonly reglasIniciales: number;
  /** Reglas de mas por cada nivel de mercado en la capital. */
  readonly reglasPorNivelDeMercado: number;
  readonly reglasMaximas: number;
  /** Cuantos turnos por delante se puede programar una orden. */
  readonly turnosDePlan: number;
  /** Jornadas de pan que carga una recua en ruta circular al reponer en comarca propia. */
  readonly jornadasDeRepuesto: number;
  /** Paradas seguidas sin cumplir un precio limite tras las que una ruta circular se detiene. */
  readonly fallosDePrecioParaParar: number;
}

/** De donde salen los rumores y cuantos (ficha T-044 §4.3). */
export interface DatosRumores {
  /** Rumores por cada recua quieta en una feria abierta, segun el volumen de la feria. */
  readonly porFeria: Readonly<Record<VolumenFeria, number>>;
  /** Rumores por cada comarca del Camino de Santiago donde hay una recua propia quieta. */
  readonly porCaminoDeSantiago: number;
  /** Rumores por cada comarca propia con venta. */
  readonly porVenta: number;
  /** Lo que multiplica los rumores quien tiene corresponsales. */
  readonly corresponsalesMil: number;
  readonly maximoPorTurno: number;
  /** De cada mil rumores, cuantos son de precios (los demas, de comarcas por conocer). */
  readonly dePreciosMil: number;
}

/** El marcador (docs/06-competicion.md §6.3; ficha T-043). */
export interface DatosPrestigio {
  readonly porCadaCincoVecinos: number;
  /** Una comarca propia sin fuero; con fuero vale `porComarcaConFuero` en su lugar. */
  readonly porComarca: number;
  readonly porComarcaConFuero: number;
  readonly porObraMayor: Readonly<Record<TipoObraMayor, number>>;
  /** Cada tramo de calzada construido por el jugador. */
  readonly porTramoDeCamino: number;
  readonly porFeriaDestacada: number;
  /** Volumen propio en una feria, en un anyo, para que cuente como destacada. */
  readonly volumenDeFeriaDestacada: number;
  readonly porPrimicia: number;
  readonly porComarcaExplorada: number;
  readonly porAnyoTrashumante: number;
  /** Calidad del anyo del rebanyo, en el esquileo, para contar como anyo trashumante. */
  readonly calidadDeAnyoTrashumanteMil: number;
  readonly porAperosAltos: number;
  /** Nivel de aperos desde el que una comarca cuenta como industria. */
  readonly nivelDeAperosAltos: number;
  /** Pan en el almacen para que un turno sin perder pan cuente como despensa estable. */
  readonly reservaDeDespensaEstable: number;
  readonly penalizacionPorComarcaPerdida: number;
  readonly penalizacionPorEscasez: number;
}

/** Los hitos de la partida (ficha T-043 §4.3). Cada uno se logra una vez y guarda su turno. */
export const HITOS = [
  'primer-horizonte',
  'despensa-estable',
  'villa',
  'mas-alla-del-origen',
  'pequenyo-dominio',
  'anyo-redondo',
  'maestro-de-obra',
  'camino-abierto',
  'buen-nombre',
  'senyor-de-ferias',
  'ciudad',
  'casa-conocida',
] as const;
export type Hito = (typeof HITOS)[number];

export function esHito(texto: string): texto is Hito {
  return (HITOS as readonly string[]).includes(texto);
}

export interface DatosHito {
  readonly nombre: string;
  /** La condicion, tal como se ensenya al jugador. */
  readonly condicion: string;
  /** El numero de la condicion: vecinos, comarcas, turnos, milesimas de calidad, maravedis… */
  readonly umbral: number;
  readonly prestigio: number;
  /** Los que dependen de mecanicas aun no implementadas no se miran. */
  readonly desactivado: boolean;
  readonly pendienteDe: string | null;
}

/** Con que empieza una casa en su comarca de origen (lo usa el alta de partida, T-065). */
export interface DatosArranque {
  readonly almacen: Recursos;
  /** Lo que se levanta en toda capital antes de ajustar nada a su comarca: el suelo del arranque. */
  readonly edificiosDeOrigen: Readonly<Partial<Record<TipoEdificio, number>>>;
  readonly ajuste: DatosAjusteDeArranque;
  readonly recorte: DatosRecorte;
}

/** Como se ajusta el arranque a la comarca de origen y a la casa (ficha T-049 §4.5). */
export interface DatosAjusteDeArranque {
  /** False deja el arranque plano de `edificiosDeOrigen`: asi son los escenarios de hambre. */
  readonly activo: boolean;
  /** Niveles de granja que se pueden llegar a levantar para dar de comer a la capital. */
  readonly granjasMaximas: number;
  /**
   * Parte del pan del anyo que la capital tiene que producir. No se llena de granjas por cubrir el
   * ultimo cinco por ciento: ese solar vale mas para el oficio, y el resto se compra.
   */
  readonly coberturaMinimaMil: Milesimas;
  /**
   * Lo mismo para las casas que viven de comprar el pan: siembran menos y guardan el solar para su
   * oficio, pero tampoco empiezan sin nada que llevarse a la boca.
   */
  readonly coberturaDeCompradorMil: Milesimas;
  /** Con esta labor o menos, y bastante pesca, la capital vive del mar y no del campo. */
  readonly laborDePescador: NivelPotencial;
  readonly pescaDeLonja: NivelPotencial;
  /** Sal del almacen por cada nivel de lonja: sin sal no hay salazon. */
  readonly salPorLonja: number;
  /** Tope de los maravedis del arranque, por mucho pan que falte. */
  readonly maravedisMaximos: number;
}

/** Como se recorta el mapa a los participantes de una partida (ficha T-049 §4.2). */
export interface DatosRecorte {
  readonly comarcasPorJugador: number;
  readonly minimoDeComarcas: number;
  /** Jornadas base que tiene que haber entre dos capitales de jugadores distintos. */
  readonly jornadasEntreCapitales: number;
  readonly intentosMaximos: number;
  /** Cuanto crece el objetivo en cada reintento. */
  readonly crecimientoPorIntentoMil: Milesimas;
  /** Niveles que hacen que una comarca cuente como fuente de cada cosa. */
  readonly salMinima: NivelPotencial;
  readonly hierroMinimo: NivelPotencial;
  readonly laborAlta: NivelPotencial;
  readonly pastoAlto: NivelPotencial;
  /** Comarcas de labor alta y ferias que tiene que haber en el recorte. */
  readonly laborAltaMinima: number;
  readonly feriasMinimas: number;
  /** Origenes posibles que conserva cada casa dentro del recorte. */
  readonly origenesPorCasa: number;
}

/** Los acontecimientos del catalogo (docs/01 §1.3, docs/02 §2.4.5; ficha T-039). */
export const TIPOS_DE_ACONTECIMIENTO = [
  'buenas-lluvias',
  'sequia',
  'nieves-tempranas',
  'riada',
  'peste-de-ganado',
  'buen-ano-de-feria',
  'carestia-de-sal',
  'romeria',
  'incendio',
  'maestros',
] as const;
export type TipoDeAcontecimiento = (typeof TIPOS_DE_ACONTECIMIENTO)[number];

export function esTipoDeAcontecimiento(texto: string): texto is TipoDeAcontecimiento {
  return (TIPOS_DE_ACONTECIMIENTO as readonly string[]).includes(texto);
}

export type DuracionDeAcontecimiento =
  | { readonly tipo: 'fija'; readonly turnos: number }
  /** Desde que empieza hasta el turno del esquileo, incluido. */
  | { readonly tipo: 'hasta-el-esquileo' }
  /** Los turnos de la feria elegida. */
  | { readonly tipo: 'de-la-feria' };

/** A que afecta: a toda una region, a una comarca de ella o a una feria de ella. */
export type ObjetivoDeAcontecimiento = 'region' | 'comarca' | 'feria';

export interface DatosAcontecimiento {
  readonly nombre: string;
  readonly signo: 'positivo' | 'negativo';
  /** Peso en el sorteo: 1 es lo normal. */
  readonly peso: number;
  readonly objetivo: ObjetivoDeAcontecimiento;
  /** Turnos del anyo en que puede empezar, ambos incluidos; null en los de feria. */
  readonly inicio: { readonly desde: number; readonly hasta: number } | null;
  readonly duracion: DuracionDeAcontecimiento;
  /** Solo en los de comarca: la potencial minimo que tiene que tener para poder elegirla. */
  readonly potencialMinimo: { readonly potencial: Potencial; readonly nivel: number } | null;
  readonly efectos: readonly EfectoAcontecimiento[];
  /** Que puede hacer el jugador: texto de ayuda para la interfaz, no mecanica. */
  readonly respuestas: readonly string[];
}

export interface DatosSorteoDeAcontecimientos {
  readonly minimoPorAnyo: number;
  readonly maximoPorAnyo: number;
  /** Turnos de antelacion con que se anuncia cada acontecimiento. */
  readonly turnosDeAviso: number;
}

export interface DatosAcontecimientos {
  readonly sorteo: DatosSorteoDeAcontecimientos;
  readonly catalogo: Readonly<Record<TipoDeAcontecimiento, DatosAcontecimiento>>;
  /** Horquilla de cada clase de efecto: sobre `factorMil` si multiplica y sobre `cantidad` si no. */
  readonly limites: Readonly<
    Record<QueDeEfecto, { readonly minimo: number; readonly maximo: number }>
  >;
}

export interface TablasDeReglas {
  readonly version: number;
  readonly recursos: Readonly<Record<Recurso, DatosRecurso>>;
  readonly edificios: Readonly<Record<TipoEdificio, DatosEdificio>>;
  readonly casas: Readonly<Record<Casa, DatosCasa>>;
  readonly tradiciones: Readonly<Record<string, DatosTradicion>>;
  readonly rondas: Readonly<Record<RondaDeTradicion, CondicionDeRonda>>;
  readonly estaciones: DatosEstaciones;
  readonly produccion: DatosProduccion;
  readonly consumo: DatosConsumo;
  readonly movimiento: DatosMovimiento;
  readonly cometidos: DatosCometidos;
  readonly obras: DatosObras;
  readonly obrasMayores: Readonly<Record<TipoObraMayor, DatosObraMayor>>;
  readonly poblacion: DatosPoblacion;
  readonly territorio: DatosTerritorio;
  readonly mercado: DatosMercado;
  readonly influencia: DatosInfluencia;
  readonly prestigio: DatosPrestigio;
  readonly hitos: Readonly<Record<Hito, DatosHito>>;
  readonly rumores: DatosRumores;
  readonly mayordomo: DatosMayordomo;
  readonly arranque: DatosArranque;
  readonly acontecimientos: DatosAcontecimientos;
  readonly ganaderia: DatosGanaderia;
}
