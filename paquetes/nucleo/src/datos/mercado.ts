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
  // Lo que sobra vale menos donde sobra, y lo que no hay cuesta mas traerlo (ficha T-052 §4.2).
  // Indexada por el nivel de potencial de la comarca, de 0 a 5. El precio del catalogo es el de
  // una comarca corriente (potencial 2): desde ahi, la escasez encarece poco y la abundancia
  // abarata mucho, porque lo que mueve el comercio es de donde **sale** la mercancia. La sal
  // existe en 12 comarcas de 403 y el hierro en 17: entre una salina y el secano hay un 70 % de
  // diferencia, mientras que el pan y la lana, que se dan en todas partes, apenas se mueven.
  abundanciaMil: [1200, 1100, 1000, 900, 800, 700],
  // Un puerto de mar come pescado, pero su pan sigue mirando a la labor: Bilbao importaba grano
  // y lo pagaba caro, y esa es justo la decision que se quiere. Los maravedis son la moneda y no
  // estan aqui: valen lo mismo en todas partes.
  potencialDeRecurso: {
    pan: 'labor',
    madera: 'monte',
    piedra: 'piedra',
    sal: 'sal',
    hierro: 'hierro',
    lana: 'pasto',
  },
};
