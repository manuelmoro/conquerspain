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
import type { Casa, Tradicion } from './reglas.ts';
import type { Potencial, NivelPotencial, VolumenFeria } from './mundo.ts';
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
  readonly preciosMil: Readonly<Record<Recurso, number>> | null;
}

export interface Conocimiento {
  readonly nivel: NivelDeConocimiento;
  /** Turno en que se supo lo que aqui se guarda. La informacion no se actualiza sola. */
  readonly turnoUltimaNoticia: number;
  readonly datos: DatosConocidos | null;
}

export interface EstadoJugador {
  readonly id: IdJugador;
  readonly nombre: string;
  readonly casa: Casa;
  readonly tradiciones: readonly Tradicion[];
  readonly capital: IdComarca;
  readonly almacen: Recursos;
  /** Comprometido por ordenes pendientes: no se puede gastar dos veces. */
  readonly reservado: Recursos;
  readonly prestigio: number;
  /** Reputacion mecanica, de 0 a 100 (docs/06-competicion.md §6.5.1). */
  readonly credito: number;
  /** Hito → turno en que se logro. */
  readonly hitos: Readonly<Record<string, number>>;
  readonly conocimiento: Readonly<Record<string, Conocimiento>>;
  readonly escasez: boolean;
  /** Escaseces seguidas: a la tercera empieza la emigracion. */
  readonly escasezSeguidas: number;
  /** Gastar sal en conservar el pan del almacen; se cambia con una orden de politica. */
  readonly conservarConSal: boolean;
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
  readonly cargaFiscal: CargaFiscal;
  readonly dehesa: boolean;
  /** Potenciales efectivos: cambian al roturar, los del mundo no se tocan. */
  readonly potenciales: Readonly<Record<Potencial, NivelPotencial>>;
  readonly agotamiento: Readonly<Record<RecursoAgotable, number>>;
  /** Influencia de cada jugador mientras la comarca es neutral (0..100). */
  readonly influencias: Readonly<Record<string, number>>;
  /** Turnos seguidos con lealtad por debajo del minimo antes de volver a neutral. */
  readonly turnosDesleal: number;
  /** Turnos seguidos sin hierro para mantener los aperos: al segundo, bajan un nivel. */
  readonly turnosSinMantenimiento: number;
  readonly produccionUltimoTurno: Recursos;
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
  readonly ruta: readonly IdComarca[];
  readonly rutaCircular: boolean;
  readonly cabezas: number;
  /** Turnos del anyo en curso pasados en pasto adecuado, y turnos contados. */
  readonly turnosEnPastoCorrecto: number;
  readonly turnosDelAnyo: number;
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
  /** Avance en milesimas de turno: una obra de tres turnos necesita 3000. */
  readonly avanceMil: number;
  readonly avanceNecesarioMil: number;
  /** Material ya entregado, para las obras mayores que se pagan a plazos. */
  readonly entregado: Recursos;
  readonly costeTotal: Recursos;
  readonly abandonada: boolean;
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

export interface EfectoAcontecimiento {
  readonly que: 'pan' | 'lana' | 'labor' | 'precio' | 'camino' | 'obra';
  readonly recurso: Recurso | null;
  readonly factorMil: number;
}

export interface Acontecimiento {
  readonly id: IdAcontecimiento;
  readonly tipo: string;
  readonly region: string;
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
  readonly mercados: Readonly<Record<string, EstadoMercado>>;
  readonly acontecimientos: readonly Acontecimiento[];
  /** Ordenes vivas: pendientes, en curso o en espera. */
  readonly ordenes: readonly Orden[];
  /** Contador para generar identificadores nuevos sin azar. */
  readonly siguienteId: number;
  /** Huella del estado al terminar el turno anterior, o null en la partida recien creada. */
  readonly huellaTurnoAnterior: string | null;
}
