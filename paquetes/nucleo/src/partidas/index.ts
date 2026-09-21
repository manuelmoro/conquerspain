// Preparacion de partidas (ficha T-049): recorte del mapa, ofertas de origen, arranque y fundacion.
// Todo puro: el banco y el servidor comparten este contrato y no hay una segunda copia en ninguno.
export { arranqueDe, panDelAnyo, panQueComeElAnyo } from './arranque.ts';
export type { Arranque } from './arranque.ts';
export { caminoMasCorto, indiceDeCaminos, jornadasDesde } from './distancias.ts';
export type { IndiceDeCaminos } from './distancias.ts';
export { fundarPartida } from './fundar.ts';
export type { PeticionDeFundacion } from './fundar.ts';
export { ofertasDeOrigen, tarjetaDe } from './ofertas.ts';
export type { Ofertas, OfertaDeOrigen, Participante } from './ofertas.ts';
export { prepararPartida, primeraOferta } from './preparar.ts';
export type { PartidaPreparada, PeticionDePreparacion } from './preparar.ts';
export { faltasDelRecorte, mundoCon, recortarMundo, requisitosDe } from './recorte.ts';
export type { Requisito, ResultadoDeRecorte } from './recorte.ts';
