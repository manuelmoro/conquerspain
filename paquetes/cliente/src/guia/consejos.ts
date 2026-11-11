// Como se juega cada casa (ficha T-127 §2.2): el consejo de estrategia de la guia. Completo por tipo:
// si el nucleo anyade una casa, esto no compila hasta que alguien escriba su consejo.
import type { Casa } from '@conquer/nucleo';

export const CONSEJO_DE_CASA: Readonly<Record<Casa, string>> = {
  mesta:
    'Tu riqueza es la lana y se cobra de golpe, en el esquileo de la segunda quincena de mayo. Forma rebaños pronto (te cuestan la mitad), súbelos a los pastos de verano de la sierra antes del turno 9 y bájalos en otoño a las dehesas: el rebaño que hace el año entero da tres veces más lana que el que se queda quieto. Por la cañada real andas más del doble de rápido y cruzas tierra ajena. Tu pan propio es escaso: ten siempre maravedís para comprarlo y vende la lana en las ferias.',
  ferrones:
    'Levanta ferrería y carboneras en tus comarcas de hierro y monte, y vive de los aperos: cada nivel sube un 10 % todo lo que produce una comarca, y tú llegas al nivel 4. Véndelos instalados a otras casas por contrato. Vigila el monte, que se te agota deprisa: acota dehesa donde talas y reparte las carboneras. Te faltará pan; cómpralo con lo que te den el hierro y los aperos.',
  canteros:
    'Eres la casa de las obras mayores: un monasterio, un puente, una calzada o, al final, una catedral te dan prestigio y efectos para siempre, y a ti te salen más baratas y rápidas, también en invierno. Los primeros turnos son frágiles: asegura el pan y una cantera antes de lanzarte. Después, ofrece obras por contrato a tus vecinos: construyes en su tierra con tus ventajas y cobras.',
  mercaderes:
    'Vives de comprar barato y vender caro. Forma recuas pronto, explora y conoce los precios de las plazas (tus corresponsales te los siguen contando), y lleva la mercancía a las ferias, que abren uno o dos turnos al año y mueven mucho más volumen. La letra de cambio te pone dinero en otra plaza sin cargarlo por el camino. Tienes poca tierra y poco pan: el mercado es tu granero.',
  monjes:
    'Tu fuerza es la gente. Funda pueblas con la mitad de colonos que los demás, da carta puebla y haz crecer tus comarcas: la lealtad de lo tuyo no baja de 50, así que puedes estirarte sin miedo a que se te vaya. El monasterio, más barato para ti, hace crecer la comarca y sus vecinas y roturar gratis. No puedes apretar con carga dura ni cobrar portazgos.',
  salineros:
    'La sal es tuya: tus salinas rinden la mitad más y tu pan no se echa a perder. Todos necesitan sal para conservar su pan y la lonja para comer del mar; véndesela en las plazas y por contrato. Tus explotaciones de tierra adentro rinden menos: quédate en la costa y en las salinas de interior, y defiende esas comarcas, que son pocas y son tu juego.',
  arrieros:
    'Eres el dueño del camino: tus recuas cuestan menos, andan una jornada más y cargan más. Levanta ventas en tierra de nadie (abren plaza y cobran a quien come allí), puentes y calzadas, y fija portazgos en los tramos que mejoras. Cuanto más tráfico ajeno haya, más ganas; un portazgo abusivo empuja a los demás al camino viejo, así que cobra con mesura. No puedes levantar catedral.',
  hortelanos:
    'Busca la vega y el río. Tus huertas llegan a nivel 4 y rinden la mitad más en vega, y la acequia deja el pan sin estación: tienes el pan más estable del juego, sin el bache del invierno. Con pan de sobra, crece en gente, ponles casas y véndele el excedente a quien pasa hambre. Fuera de la vega tu labor rinde menos: no te alejes de los ríos.',
};
