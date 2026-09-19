// El estado de una partida: todo lo que cambia turno a turno.
// Es serializable, comparable y versionado; de su forma canonica sale la huella del turno.
import type {
  IdAcontecimiento,
  IdComarca,
  IdJugador,
  IdMercado,
  IdObra,
  IdPartida,
  IdRebanyo,
  IdRecua,
} from './ids.ts';
import type { Recurso, Recursos } from './recursos.ts';
import type {
  CalidadCamino,
  Casa,
  Hito,
  RondaDeTradicion,
  TipoObraMayor,
  Tradicion,
} from './reglas.ts';
import type { Potencial, NivelPotencial, Terreno, VolumenFeria } from './mundo.ts';
import type { Orden, ParadaDeRuta } from './ordenes.ts';

export const MODOS_DE_PARTIDA = ['solitario', 'vecindad', 'temporada', 'comarcal'] as const;
export type ModoDePartida = (typeof MODOS_DE_PARTIDA)[number];

export interface ConfiguracionPartida {
  readonly nombre: string;
  /** Minutos reales entre resoluciones. El calendario del juego no depende de esto. */
  readonly intervaloMinutos: number;
  readonly modo: ModoDePartida;
  /** Turnos que dura una temporada, o null en las partidas abiertas. */
  readonly turnosDeTemporada: number | null;
  /** Reserva de pan por debajo de la cual la poblacion deja de crecer. */
  readonly reservaMinimaDePan: number;
  /** Las partidas de prueba admiten resolver el turno a mano. */
  readonly esDePrueba: boolean;
}

// ——— Jugador ———————————————————————————————————————————————————————————————

export const NIVELES_DE_CONOCIMIENTO = ['desconocida', 'oida', 'explorada', 'propia'] as const;
export type NivelDeConocimiento = (typeof NIVELES_DE_CONOCIMIENTO)[number];

/** Foto fechada de lo que un jugador supo de una comarca ajena. */
export interface DatosConocidos {
  readonly duenyo: IdJugador | null;
  readonly poblacion: number;
  readonly terreno: string;
  readonly potenciales: Readonly<Record<Potencial, NivelPotencial>>;
  readonly edificios: Readonly<Record<string, number>>;
}

export interface Conocimiento {
  readonly nivel: NivelDeConocimiento;
  /** Turno en que se supo lo que aqui se guarda. La informacion no se actualiza sola. */
  readonly turnoUltimaNoticia: number;
  readonly datos: DatosConocidos | null;
}

export const FUENTES_DE_PRECIOS = ['visita', 'corresponsal', 'rumor'] as const;
export type FuenteDePrecios = (typeof FUENTES_DE_PRECIOS)[number];

/**
 * Lo que un jugador sabe de los precios de una plaza (ficha T-044 §4.2): los de la ultima vez que
 * estuvo una recua suya, que le escribio un corresponsal o que le llego un rumor. No se actualiza
 * solo. Los de rumor van redondeados.
 */
export interface PreciosConocidos {
  readonly turno: number;
  readonly fuente: FuenteDePrecios;
  readonly preciosMil: Readonly<Record<Recurso, number>>;
  /** Alguna recua suya estuvo alguna vez en la plaza: los corresponsales escriben de ella. */
  readonly visitada: boolean;
}

export interface TrasladoDeCorte {
  readonly destino: IdComarca;
  readonly turnosRestantes: number;
}

/**
 * Lo que el prestigio no puede recalcular del estado porque ya paso: obras terminadas, anyos
 * trashumantes, ferias, perdidas y escaseces (ficha T-043 §4.2). Lo apunta la fase 11.
 */
export interface RegistroDeJugador {
  /** Obras mayores terminadas por el jugador, por tipo. */
  readonly obrasMayores: Readonly<Partial<Record<TipoObraMayor, number>>>;
  readonly anyosTrashumantes: number;
  /** Ferias en las que un anyo paso del volumen de feria destacada. */
  readonly feriasDestacadas: number;
  /** Volumen propio de este anyo en cada feria; se vacia el primer turno del anyo. */
  readonly volumenEnFerias: Readonly<Record<string, number>>;
  /** Comarcas que volvieron a neutral por deslealtad. */
  readonly comarcasPerdidas: number;
  readonly turnosConEscasez: number;
  /** Turnos seguidos sin perder pan y con reserva: para el hito de la despensa. */
  readonly turnosDeDespensaEstable: number;
}

export interface EstadoJugador {
  readonly id: IdJugador;
  readonly nombre: string;
  readonly casa: Casa;
  /** Una por ronda como mucho, en el orden en que se eligieron. */
  readonly tradiciones: readonly Tradicion[];
  /** Ronda → turno en que se abrio. Una ronda abierta no se cierra aunque se pierda el hito. */
  readonly rondas: Readonly<Partial<Record<RondaDeTradicion, number>>>;
  readonly capital: IdComarca;
  readonly almacen: Recursos;
  /** Comprometido por ordenes pendientes: no se puede gastar dos veces. */
  readonly reservado: Recursos;
  readonly prestigio: number;
  /** Reputacion mecanica, de 0 a 100 (docs/06-competicion.md §6.5.1). */
  readonly credito: number;
  /** Hito → turno en que se logro. */
  readonly hitos: Readonly<Partial<Record<Hito, number>>>;
  readonly registro: RegistroDeJugador;
  readonly conocimiento: Readonly<Record<string, Conocimiento>>;
  /** Plaza → lo que se sabe de sus precios y desde cuando. */
  readonly plazas: Readonly<Record<string, PreciosConocidos>>;
  readonly escasez: boolean;
  /** Escaseces seguidas: a la tercera empieza la emigracion. */
  readonly escasezSeguidas: number;
  /** Gastar sal en conservar el pan del almacen; se cambia con una orden de politica. */
  readonly conservarConSal: boolean;
  /** Maravedis de administracion que no se pudieron pagar y siguen debiendose. */
  readonly deudaAdministracion: number;
  /** Traslado de la corte en marcha, o null. */
  readonly traslado: TrasladoDeCorte | null;
  readonly turnosSinOrdenes: number;
}

// ——— Comarca ———————————————————————————————————————————————————————————————

export const FUEROS = ['ninguno', 'carta puebla', 'fuero'] as const;
export type Fuero = (typeof FUEROS)[number];

export const CARGAS_FISCALES = ['ligera', 'normal', 'dura'] as const;
export type CargaFiscal = (typeof CARGAS_FISCALES)[number];

export const RECURSOS_AGOTABLES = ['monte', 'piedra', 'hierro', 'sal'] as const;
export type RecursoAgotable = (typeof RECURSOS_AGOTABLES)[number];

export interface EstadoComarca {
  readonly id: IdComarca;
  readonly duenyo: IdJugador | null;
  readonly poblacion: number;
  readonly lealtad: number;
  readonly edificios: Readonly<Record<string, number>>;
  readonly aperos: number;
  readonly fuero: Fuero;
  /** Turno en que se concedio el fuero actual (0 si lo tiene desde el principio). */
  readonly turnoFuero: number;
  readonly cargaFiscal: CargaFiscal;
  readonly dehesa: boolean;
  /** Potenciales efectivos: cambian al roturar, los del mundo no se tocan. */
  readonly potenciales: Readonly<Record<Potencial, NivelPotencial>>;
  readonly agotamiento: Readonly<Record<RecursoAgotable, number>>;
  /** Influencia de cada jugador mientras la comarca es neutral (0..100). */
  readonly influencias: Readonly<Record<string, number>>;
  /** Turnos seguidos con una recua presente de cada jugador: desempata las disputas. */
  readonly presenciaSeguida: Readonly<Record<string, number>>;
  /** Turno del ultimo regalo de cada jugador al concejo. */
  readonly ultimoRegalo: Readonly<Record<string, number>>;
  /** Quien la tuvo antes de que volviera a neutral; su monasterio le da influencia. */
  readonly exDuenyo: IdJugador | null;
  /** Turnos seguidos con lealtad por debajo del minimo antes de volver a neutral. */
  readonly turnosDesleal: number;
  /** Turnos seguidos sin hierro para mantener los aperos: al segundo, bajan un nivel. */
  readonly turnosSinMantenimiento: number;
  /** Obras mayores terminadas en la comarca (las de tramo se guardan en `EstadoPartida.caminos`). */
  readonly obrasMayores: readonly TipoObraMayor[];
  readonly produccionUltimoTurno: Recursos;
  /** Turnos de invernada de rebanyos propios este anyo, para el estiercol. */
  readonly turnosDeAbono: number;
  /** Niveles de estiercol de la labor, de 0 al tope de la tabla. */
  readonly estiercol: number;
}

// ——— Unidades moviles ——————————————————————————————————————————————————————

/** Comarcas que puede tener pendientes la ruta de una unidad movil. */
export const LONGITUD_MAXIMA_DE_RUTA = 120;

export type SituacionMovil =
  | { readonly donde: 'comarca'; readonly comarca: IdComarca }
  | {
      readonly donde: 'camino';
      readonly desde: IdComarca;
      readonly hasta: IdComarca;
      readonly jornadasHechasMil: number;
    };

export const COMETIDOS = [
  'explorar',
  'portear',
  'tratar',
  'poblar',
  'presencia',
  'disolver',
] as const;
export type Cometido = (typeof COMETIDOS)[number];

export interface Recua {
  readonly id: IdRecua;
  readonly jugador: IdJugador;
  readonly nombre: string;
  readonly situacion: SituacionMovil;
  /** Comarcas que quedan por recorrer, en orden. */
  readonly ruta: readonly IdComarca[];
  readonly rutaCircular: boolean;
  /** Paradas de la ruta con lo que hay que hacer en cada una (orden `ruta`). */
  readonly paradas: readonly ParadaDeRuta[];
  /** Indice de la proxima parada a la que llegara. */
  readonly siguienteParada: number;
  /** Parada en la que se ha detenido este turno, para que la atiendan los cometidos y el mercado. */
  readonly enParada: number | null;
  readonly acemilas: number;
  readonly porte: number;
  readonly carga: Recursos;
  readonly vecinos: number;
  readonly cometido: Cometido | null;
  /** Turnos que lleva cumpliendo su cometido en destino. */
  readonly turnosDeCometido: number;
  readonly avisadaSinBastimento: boolean;
}

export interface Rebanyo {
  readonly id: IdRebanyo;
  readonly jugador: IdJugador;
  readonly nombre: string;
  readonly situacion: SituacionMovil;
  /** Comarcas que quedan por recorrer. Un rebanyo no lleva ruta circular: la ida y la vuelta son dos ordenes. */
  readonly ruta: readonly IdComarca[];
  readonly cabezas: number;
  /** Lo pastado en el anyo en curso, en milesimas de turno: 1000 es un turno entero de pasto. */
  readonly pastoDelAnyoMil: number;
  /** Turnos seguidos sin nada que comer. */
  readonly turnosSinPasto: number;
}

// ——— Obras ————————————————————————————————————————————————————————————————

export const TIPOS_DE_OBRA = ['edificio', 'obra mayor', 'roturacion', 'derribo'] as const;
export type TipoDeObra = (typeof TIPOS_DE_OBRA)[number];

export interface Obra {
  readonly id: IdObra;
  readonly jugador: IdJugador;
  readonly comarca: IdComarca;
  readonly tipo: TipoDeObra;
  /** Que se levanta: un tipo de edificio o el identificador de una obra mayor. */
  readonly que: string;
  /** Otra punta del tramo, en las obras mayores de camino (puente, calzada); si no, null. */
  readonly hacia: IdComarca | null;
  /** Avance en milesimas de turno: una obra de tres turnos necesita 3000. */
  readonly avanceMil: number;
  readonly avanceNecesarioMil: number;
  /** Material ya entregado, para las obras mayores que se pagan a plazos. */
  readonly entregado: Recursos;
  readonly costeTotal: Recursos;
  readonly abandonada: boolean;
}

/** Lo que se ha construido en un tramo de camino. */
export interface EstadoTramo {
  readonly calidad: CalidadCamino;
  readonly puente: boolean;
}

// ——— Mercado ———————————————————————————————————————————————————————————————

export interface EstadoMercado {
  readonly id: IdMercado;
  readonly comarca: IdComarca;
  readonly tipo: 'local' | 'feria';
  readonly volumen: VolumenFeria;
  readonly preciosMil: Readonly<Record<Recurso, number>>;
  readonly ultimoVolumen: Readonly<Record<Recurso, number>>;
}

// ——— Acontecimientos ————————————————————————————————————————————————————————

/** Lo que puede cambiar un acontecimiento: multiplica una cifra o la altera una vez o mientras dura. */
export const QUE_DE_EFECTO = [
  'pan',
  'labor',
  'lana',
  'precio',
  'volumen',
  'obra',
  'ingresos',
  'puertos',
  'vados',
  'lealtad',
  'monte',
] as const;
export type QueDeEfecto = (typeof QUE_DE_EFECTO)[number];

/** Los efectos que multiplican (`factorMil`); los demas usan `cantidad`. */
export const EFECTOS_QUE_MULTIPLICAN: readonly QueDeEfecto[] = [
  'pan',
  'labor',
  'lana',
  'precio',
  'volumen',
  'obra',
  'ingresos',
];

export interface EfectoAcontecimiento {
  readonly que: QueDeEfecto;
  /** Solo para `precio` y `lana`: de que recurso; null si vale para cualquiera. */
  readonly recurso: Recurso | null;
  /** Solo lo sufren las comarcas de ese terreno (la riada daña las vegas); null: todas. */
  readonly terreno: Terreno | null;
  /** 1000 si no multiplica. */
  readonly factorMil: number;
  /** Turnos de adelanto (`puertos`) o puntos (`lealtad`, `monte`); 0 si no aplica. */
  readonly cantidad: number;
}

/**
 * Un acontecimiento anunciado. Sale del calendario del anyo (`calendarioDeAcontecimientos`) y entra
 * en el estado exactamente dos turnos antes de empezar; los efectos son una copia del catalogo de
 * ese momento, para que ajustar el equilibrio no cambie lo ya anunciado.
 */
export interface Acontecimiento {
  readonly id: IdAcontecimiento;
  /** Clave del catalogo (`sequia`, `riada`…). */
  readonly tipo: string;
  readonly region: string;
  /** La comarca concreta a la que afecta, o null si afecta a toda la region. */
  readonly comarca: IdComarca | null;
  readonly turnoAnuncio: number;
  readonly turnoInicio: number;
  readonly turnosDuracion: number;
  readonly efectos: readonly EfectoAcontecimiento[];
}

// ——— Partida ———————————————————————————————————————————————————————————————

export interface EstadoPartida {
  /** Version de reglas con la que se creo la partida. */
  readonly version: number;
  readonly id: IdPartida;
  readonly semilla: string;
  readonly turno: number;
  readonly configuracion: ConfiguracionPartida;
  readonly jugadores: Readonly<Record<string, EstadoJugador>>;
  readonly comarcas: Readonly<Record<string, EstadoComarca>>;
  readonly recuas: Readonly<Record<string, Recua>>;
  readonly rebanyos: Readonly<Record<string, Rebanyo>>;
  readonly obras: Readonly<Record<string, Obra>>;
  /** Tramos mejorados por obras, con clave `claveDeTramo(a, b)`; los demas son como en el mundo. */
  readonly caminos: Readonly<Record<string, EstadoTramo>>;
  readonly mercados: Readonly<Record<string, EstadoMercado>>;
  readonly acontecimientos: readonly Acontecimiento[];
  /** Ordenes vivas: pendientes, en curso o en espera. */
  readonly ordenes: readonly Orden[];
  /** Contador para generar identificadores nuevos sin azar. */
  readonly siguienteId: number;
  /** Huella del estado al terminar el turno anterior, o null en la partida recien creada. */
  readonly huellaTurnoAnterior: string | null;
  /** Hito → jugador que lo logro el primero de la partida. */
  readonly primicias: Readonly<Partial<Record<Hito, IdJugador>>>;
  /** La clasificacion del ultimo turno resuelto, del primero al ultimo. */
  readonly clasificacion: readonly PuestoEnLaClasificacion[];
}

export interface PuestoEnLaClasificacion {
  readonly jugador: IdJugador;
  readonly puesto: number;
  /** Puesto del turno anterior, o null si es la primera clasificacion del jugador. */
  readonly puestoAnterior: number | null;
  readonly prestigio: number;
}
