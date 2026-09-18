// Cifras de los mercados, las ferias y la formacion de precios (docs/03-economia.md §3.10;
// ficha T-037).
import type { DatosMercado } from '../tipos/reglas.ts';

export const MERCADO: DatosMercado = {
  // En feria se paga la menor entre la comision de la casa (2 % de partida) y esta (1 %).
  comisionFeriaMil: 10,
  // La letra de cambio cuesta un 3 % y tarda un turno.
  comisionLetraMil: 30,
  // Un precio nunca se mueve mas de un 15 % por turno y vuelve al base un 10 % de la distancia.
  movimientoMaximoPorTurnoMil: 150,
  regresionAlBaseMil: 100,
  // Suelo y techo absolutos: entre el 40 % y el 250 % del precio base.
  sueloMil: 400,
  techoMil: 2500,
  // Cargas por recurso y turno que absorbe una plaza pequenya; la mediana triplica y la grande x8.
  volumenBase: 40,
  multiplicadorVolumen: { pequenya: 1, mediana: 3, grande: 8 },
  // En solitario los menores cubren todo el tope; con mucho comercio entre jugadores desaparecen.
  liquidezMercaderesMenoresMil: 1000,
  margenMercaderesMenoresMil: 100,
};
