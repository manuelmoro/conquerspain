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
  // Lo que vale un recurso **en su fuente**, por el nivel de potencial, de 1 a 5 (fichas T-052
  // §4.2 y T-057): la abundancia abarata, porque lo que mueve el comercio es de donde **sale** la
  // mercancia. El nivel 2 es el precio del catalogo. Una comarca de nivel 0 no es fuente; su
  // entrada es la de una plaza que se tantea sin mirar el mapa. Lejos de la fuente manda el
  // recargo por jornada de mas abajo.
  abundanciaMil: [1200, 1100, 1000, 900, 800, 700],
  // Un puerto de mar come pescado, pero su pan sigue mirando a la labor: Bilbao importaba grano
  // y lo pagaba caro, y esa es justo la decision que se quiere. Los maravedis son la moneda y no
  // estan aqui: valen lo mismo en todas partes.
  // Cada jornada desde la fuente suma un 20 % del precio corriente, hasta el doble (ficha T-057):
  // la sal gana 2,8 maravedis por carga y jornada y el hierro 4,8, por encima de lo que come la
  // recua (hasta 1,2 contando la vuelta en vacio). Con 120 apenas hay negocios; con 200, los
  // arrieros cierran unos treinta por partida.
  recargoPorJornadaMil: 200,
  techoDeLejaniaMil: 2000,
  potencialDeRecurso: {
    pan: 'labor',
    madera: 'monte',
    piedra: 'piedra',
    sal: 'sal',
    hierro: 'hierro',
    lana: 'pasto',
  },
};
