// Tablas de equilibrio. Ningun numero de estos vive en la logica: todos entran por aqui,
// desde paquetes/nucleo/datos (docs/07-arquitectura.md §7.9).
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

export const ESTACIONES = ['primavera', 'verano', 'otonyo', 'invierno'] as const;
export type Estacion = (typeof ESTACIONES)[number];

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
  readonly turnosDeBarro: readonly number[];
  readonly turnoDeEsquileo: number;
  readonly turnosPastoDeVerano: readonly number[];
}

export interface DatosMovimiento {
  readonly jornadasPorTerreno: Readonly<Record<string, number>>;
  readonly factorCaminoMil: Readonly<Record<string, number>>;
  readonly jornadasDeVado: number;
  readonly pasoBaseMil: number;
  readonly bastimentoPorJornada: number;
  readonly porteBase: number;
  readonly costeFormarRecua: Recursos;
  readonly factorBarroMil: number;
  readonly factorNieveMil: number;
  readonly factorVeranoMil: number;
}

export interface DatosPoblacion {
  readonly consumoPorVecino: number;
  readonly vecinosPorCuadrilla: number;
  readonly cuadrillasMaximas: number;
  readonly capacidadBase: number;
  readonly capacidadPorCasas: number;
  readonly crecimientoBase: number;
  readonly crecimientoMaximoMil: number;
  readonly emigracionPorHambreMil: number;
  readonly lealtadInicialIncorporada: number;
  readonly turnosDeslealParaPerderla: number;
  readonly fueros: Readonly<
    Record<string, { administracionMil: number; impuestosMil: number; lealtadPorTurno: number }>
  >;
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

export interface TablasDeReglas {
  readonly version: number;
  readonly recursos: Readonly<Record<Recurso, DatosRecurso>>;
  readonly edificios: Readonly<Record<TipoEdificio, DatosEdificio>>;
  readonly casas: Readonly<Record<Casa, DatosCasa>>;
  readonly tradiciones: Readonly<Record<string, DatosTradicion>>;
  readonly estaciones: DatosEstaciones;
  readonly movimiento: DatosMovimiento;
  readonly poblacion: DatosPoblacion;
  readonly mercado: DatosMercado;
  readonly influencia: DatosInfluencia;
  readonly prestigio: DatosPrestigio;
}
