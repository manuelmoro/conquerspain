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
