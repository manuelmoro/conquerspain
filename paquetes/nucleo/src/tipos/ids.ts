// Identificadores con marca de tipo: asi el compilador no deja pasar el id de una comarca
// donde se espera el de un jugador.

declare const MARCA: unique symbol;

export type Id<Marca extends string> = string & { readonly [MARCA]: Marca };

export type IdPartida = Id<'partida'>;
export type IdJugador = Id<'jugador'>;
export type IdComarca = Id<'comarca'>;
export type IdRecua = Id<'recua'>;
export type IdRebanyo = Id<'rebanyo'>;
export type IdObra = Id<'obra'>;
export type IdOrden = Id<'orden'>;
export type IdMercado = Id<'mercado'>;
export type IdFeria = Id<'feria'>;
export type IdAcontecimiento = Id<'acontecimiento'>;
export type IdContrato = Id<'contrato'>;

/**
 * Unico sitio donde un texto se convierte en identificador: al crear una entidad nueva en el
 * motor, con un numero de `EstadoPartida.siguienteId`.
 */
export function nuevoId<M extends string>(prefijo: M, numero: number): Id<M> {
  return `${prefijo}-${String(numero)}` as Id<M>;
}

/** Identificador del mercado local de una comarca con edificio de mercado. */
export function idDeMercadoLocal(comarca: IdComarca): IdMercado {
  return `local-${comarca}` as IdMercado;
}

/** Identificador del mercado de una feria. Cada feria tiene el suyo, aunque compartan comarca. */
export function idDeMercadoDeFeria(feria: IdFeria): IdMercado {
  return `feria-${feria}` as IdMercado;
}
