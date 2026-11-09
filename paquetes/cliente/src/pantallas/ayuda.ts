// La ayuda en el panel (T-090, tras jugar): como se hace cada cosa, con botones que llevan a hacerla, y
// un glosario de lo que sale en pantalla. Cada tema es un plegable: se abre lo que se busca.
import type { Almacen } from '../almacen.ts';
import { boton, el } from './dom.ts';

interface Tema {
  readonly titulo: string;
  readonly pasos: readonly string[];
  /** Un boton que lleva a hacerlo, si lo hay. */
  readonly ir?: { readonly texto: string; readonly hacer: (almacen: Almacen) => void };
}

function capital(almacen: Almacen): string | null {
  return almacen.estado.partida?.recibido.vista.jugador.capital ?? null;
}

const TEMAS: readonly Tema[] = [
  {
    titulo: 'Cómo va un turno',
    pasos: [
      'Das órdenes cuando quieras hasta el corte (lo ves arriba: «corte: faltan…»).',
      'A la hora del corte se resuelven las de todas las casas a la vez.',
      'Al volver, el resumen y la crónica te cuentan qué ha pasado. No hace falta estar conectado.',
    ],
  },
  {
    titulo: 'Las tres vistas del mapa',
    pasos: [
      'Son el mismo mapa: los botones de encima solo cambian lo que se resalta.',
      '«Qué produce»: el color de cada comarca es lo que más da (labor, monte, pasto, cantera, hierro, sal, pesca). Para decidir dónde construir y adónde ir a por algo.',
      '«Cómo se viaja»: los caminos con sus jornadas, para planear las rutas de tus recuas. Una vereda es el camino sin hacer, el más lento; una calzada (obra mayor) cuesta la mitad de jornadas y nunca se cierra; por una cañada los rebaños andan más y pastan; y un puerto de montaña con nieve no se pasa hasta la primavera.',
      'Las jornadas de un tramo dependen del terreno (llano 2, ondulado 3, sierra 5, puerto 7), del camino y de la estación: barro en marzo y noviembre, nieve en invierno, y un verano algo más rápido.',
      '«De quién es»: el color de cada casa y tu influencia en las neutrales. Para ver a tus vecinos y qué tierra puedes ganar.',
    ],
  },
  {
    titulo: 'Construir y mejorar tu comarca',
    pasos: [
      'Toca una comarca tuya en el mapa: su ficha dice qué tiene y qué puedes hacer.',
      'Pulsa «Elegir» en una acción y después «Dar la orden». Se paga al empezar.',
      'Cada nivel de cada edificio ocupa un solar: una granja de nivel 3 ocupa tres. Lo ves en el plano de la comarca.',
    ],
    ir: {
      texto: 'Ver tu capital',
      hacer: (a) => {
        const c = capital(a);
        if (c !== null) a.abrirComarca(c);
      },
    },
  },
  {
    titulo: 'Formar y mandar una recua',
    pasos: [
      'Una recua son mulas que llevan carga, exploran, comercian y ganan influencia. Se forma en la ficha de una comarca tuya: «Formar una recua» (tarda un turno).',
      'Para mandarla: pestaña «Órdenes» → «Tus recuas y rebaños» → «Darle ruta», y toca en el mapa las comarcas donde parar.',
      'Atajos: en la ficha de una comarca vecina, «Enviar una recua a explorar» o «a estar presente»; en el mercado, «Mandar una recua aquí».',
    ],
    ir: {
      texto: 'Ver tus recuas',
      hacer: (a) => {
        a.cerrarAyuda();
      },
    },
  },
  {
    titulo: 'Ganar tierra',
    pasos: [
      'Una comarca neutral se incorpora cuando tu influencia llega a 60 y sacas 15 a la segunda casa.',
      'La influencia sube con una recua presente (+2 por turno), un regalo al concejo (+5), tener comarcas vecinas y comerciar allí.',
      'La ficha de la comarca, en «Cómo ganarla», te dice a qué ritmo vas y qué lo aceleraría.',
    ],
  },
  {
    titulo: 'Comerciar',
    pasos: [
      'Se compra y se vende en las plazas (mercados, ventas y ferias), siempre con una recua tuya allí: no se vende desde el almacén.',
      'El precio límite es lo peor que aceptas: vendiendo, lo mínimo; comprando, lo máximo.',
      'Los precios los sabes cuando una recua tuya pasa por la plaza, o de oídas por rumores. Cada precio dice de cuándo es.',
    ],
    ir: {
      texto: 'Abrir el mercado',
      hacer: (a) => {
        a.abrirMercado();
      },
    },
  },
  {
    titulo: 'Jugar sin estar',
    pasos: [
      'En «Tu casa», el mayordomo cumple reglas que le dejas («si queda poco pan, compra…»).',
      'Una ruta circular repite sola su recorrido hasta que algo la para.',
      'Al dar una orden puedes programarla para un turno futuro («Cuándo»).',
    ],
    ir: {
      texto: 'Ir a Tu casa',
      hacer: (a) => {
        a.abrirCasa();
      },
    },
  },
];

const GLOSARIO: readonly (readonly [string, string])[] = [
  [
    'Comarca de oídas',
    'Sabes que existe y su nombre, pero no qué tiene: para saberlo, mándale una recua a explorar.',
  ],
  [
    'Explorada',
    'La has visto: sabes su terreno y lo que produce, tal como estaba cuando la viste.',
  ],
  [
    'Influencia',
    'Tu peso en el concejo de una comarca neutral, de 0 a 100. Con 60 (y 15 de ventaja) la puedes incorporar.',
  ],
  [
    'Vecinos y «caben»',
    'La gente de la comarca y el tope hasta el que puede crecer. Por encima del tope no crece: hacen falta casas.',
  ],
  [
    'Solares',
    'Las parcelas de la comarca. Cada nivel de cada edificio ocupa una, y cada obra en marcha la suya.',
  ],
  ['Nivel de un edificio', 'Los puntos ●●●○ son el nivel que tiene frente al máximo que admite.'],
  [
    'Lealtad',
    'Lo contenta que está la comarca. Por debajo de 40 produce menos; por debajo de 20, se acaba yendo.',
  ],
  [
    'Fuero y carta puebla',
    'Privilegios que das a una comarca: cuesta menos gobernarla y es más leal, pero paga menos impuestos.',
  ],
  [
    'Plaza',
    'Donde se compra y se vende: el mercado de un pueblo, una venta del camino o una feria cuando abre.',
  ],
  ['Corte', 'Tu capital. Se puede trasladar a otra comarca tuya.'],
  [
    'Rumores',
    'Noticias que llegan sin ir: precios de plazas lejanas o comarcas nuevas que pasan a «de oídas».',
  ],
];

export function pantallaDeAyuda(almacen: Almacen): HTMLElement {
  const temas = TEMAS.map((t) => {
    const plegable = el(
      'details',
      { class: 'tema-de-ayuda' },
      el('summary', {}, t.titulo),
      el('ol', {}, ...t.pasos.map((p) => el('li', {}, p))),
    );
    if (t.ir !== undefined) {
      const ir = t.ir;
      plegable.append(
        boton(
          ir.texto,
          () => {
            ir.hacer(almacen);
          },
          'secundario',
        ),
      );
    }
    return plegable;
  });
  return el(
    'section',
    { class: 'ficha tarjeta hoja', 'data-conservar-scroll': 'ayuda' },
    el('h2', {}, 'Ayuda'),
    boton(
      '✕',
      () => {
        almacen.cerrarAyuda();
      },
      'cerrar secundario icono',
    ),
    ...temas,
    el('h3', {}, 'Qué quiere decir…'),
    el(
      'dl',
      { class: 'glosario' },
      ...GLOSARIO.flatMap(([t, d]) => [el('dt', {}, t), el('dd', {}, d)]),
    ),
  );
}
