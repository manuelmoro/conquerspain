// La parte del almacen que guarda las convocatorias (ficha T-065). La implementa `RepositorioSqlite`.
export const ESTADOS_DE_CONVOCATORIA = ['abierta', 'eligiendo', 'fundada'] as const;
export type EstadoDeConvocatoria = (typeof ESTADOS_DE_CONVOCATORIA)[number];

export interface ConvocatoriaNueva {
  readonly id: string;
  readonly nombre: string;
  readonly creador: string;
  readonly codigo: string;
  readonly intervaloMinutos: number;
  readonly plazas: number;
  readonly esDePrueba: boolean;
  readonly semilla: string;
  readonly creadaEn: number;
}

export interface Convocatoria extends ConvocatoriaNueva {
  readonly estado: EstadoDeConvocatoria;
  /** JSON de las ofertas de `prepararPartida`, por jugador; null hasta sortear. */
  readonly ofertas: string | null;
  readonly avisos: readonly string[];
  readonly huellaMundo: string | null;
  readonly partida: string | null;
}

export interface PlazaDeConvocatoria {
  readonly cuenta: string;
  readonly casa: string;
  readonly nombre: string;
  readonly eleccion: string | null;
}

/** Por que no se pudo entrar en una convocatoria. */
export type RechazoDePlaza = 'casa-ocupada' | 'ya-dentro' | 'llena' | 'cerrada';

export interface RepositorioDeConvocatorias {
  /** Crea la convocatoria con la plaza de quien convoca. */
  crearConvocatoria(datos: ConvocatoriaNueva, casa: string, nombre: string): Promise<void>;
  convocatoria(id: string): Promise<Convocatoria | null>;
  convocatoriaPorCodigo(codigo: string): Promise<Convocatoria | null>;
  convocatoriasDeCuenta(cuenta: string): Promise<readonly Convocatoria[]>;
  plazas(id: string): Promise<readonly PlazaDeConvocatoria[]>;
  /** Anyade una plaza en una transaccion; devuelve null si entro o por que no. */
  anyadirPlaza(
    id: string,
    cuenta: string,
    casa: string,
    nombre: string,
  ): Promise<RechazoDePlaza | null>;
  /** Guarda el sorteo y pasa a `eligiendo`, solo si seguia `abierta`. */
  guardarSorteo(
    id: string,
    ofertas: string,
    avisos: readonly string[],
    huellaMundo: string,
  ): Promise<boolean>;
  /** Anota la eleccion, solo si esta `eligiendo`. */
  elegir(id: string, cuenta: string, comarca: string): Promise<boolean>;
  /** Pasa a `fundada` con su partida (idempotente). */
  marcarFundada(id: string, partida: string): Promise<void>;
}
