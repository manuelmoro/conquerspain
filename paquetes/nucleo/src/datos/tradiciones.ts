// Las tradiciones de las ocho casas (docs/04-casas-y-tradiciones.md §4.3; ficha T-042).
//
// Tres por casa y ronda, una por criterio: **profundizar** en lo suyo con un coste, **compensar**
// su limite sin quitarle identidad y **abrir** una via inesperada. Cada una es solo lo que cambia
// sobre su casa; `reglas/casas` las compone. Las que necesitan a otro jugador o el conflicto estan
// escritas pero desactivadas, con la tarea que las activara. Los numeros son de primera mano: los
// ajusta T-047.
import type {
  Casa,
  CondicionDeRonda,
  CriterioDeTradicion,
  DatosTradicion,
  Modificadores,
  Permisos,
  Prohibiciones,
  RondaDeTradicion,
} from '../tipos/reglas.ts';

/** Cuando se abre cada ronda (docs/04 §4.3): basta con una condicion. */
export const RONDAS: Readonly<Record<RondaDeTradicion, CondicionDeRonda>> = {
  renombre: {
    comarcas: 3,
    vecinos: 150,
    obraMayorTerminada: false,
    prestigio: null,
    turno: null,
  },
  fama: { comarcas: null, vecinos: null, obraMayorTerminada: true, prestigio: 400, turno: null },
  linaje: {
    comarcas: null,
    vecinos: null,
    obraMayorTerminada: false,
    prestigio: 1000,
    turno: 150,
  },
};

function tradicion(datos: {
  readonly casa: Casa;
  readonly ronda: RondaDeTradicion;
  readonly criterio: CriterioDeTradicion;
  readonly nombre: string;
  readonly descripcion: string;
  readonly nota: string;
  readonly modificadores?: Partial<Modificadores>;
  readonly permisos?: Partial<Permisos>;
  readonly prohibiciones?: Partial<Prohibiciones>;
  /** La tarea de la que depende, si todavia no se puede ofrecer. */
  readonly pendienteDe?: string;
}): DatosTradicion {
  return {
    casa: datos.casa,
    ronda: datos.ronda,
    criterio: datos.criterio,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    nota: datos.nota,
    modificadores: datos.modificadores ?? {},
    permisos: datos.permisos ?? {},
    prohibiciones: datos.prohibiciones ?? {},
    desactivada: datos.pendienteDe !== undefined,
    pendienteDe: datos.pendienteDe ?? null,
  };
}

export const TRADICIONES: Readonly<Record<string, DatosTradicion>> = {
  // ——— La Mesta ——————————————————————————————————————————————————————————————
  'mesta-lanas-finas': tradicion({
    casa: 'mesta',
    ronda: 'renombre',
    criterio: 'profundizar',
    nombre: 'Lanas finas',
    descripcion: 'Merinas de vellón corto: un 30 % más de lana, y cada rebaño cuesta un 20 % más.',
    nota: 'La lana castellana se pagaba en Flandes por su finura, no por su cantidad: el vellón merino era el más fino de Europa.',
    modificadores: { lanaEsquileoMil: 1300, costeRebanyoMil: 1200 },
  }),
  'mesta-ganado-mayor': tradicion({
    casa: 'mesta',
    ronda: 'renombre',
    criterio: 'compensar',
    nombre: 'Ganado mayor',
    descripcion:
      'Bueyes y vacas de labor: puedes roturar y tu pan rinde un 30 % más, pero la lana baja un 30 %.',
    nota: 'Donde el merino no llegaba, araba la yunta: el vacuno era ganado de labor y de carne, no de vellón, y abría tierra donde la oveja solo pastaba.',
    modificadores: { lanaEsquileoMil: 700, produccionMil: { pan: 1300 } },
    prohibiciones: { roturar: false },
  }),
  'mesta-concejo-fuerte': tradicion({
    casa: 'mesta',
    ronda: 'renombre',
    criterio: 'abrir',
    nombre: 'Concejo fuerte',
    descripcion: 'Los alcaldes de la Mesta pesan en los concejos: tu influencia rinde un 40 % más.',
    nota: 'El Honrado Concejo de la Mesta tenía alcaldes entregadores que recorrían las cañadas y pleiteaban con los concejos por cada pasto y cada paso.',
    modificadores: { influenciaMil: 1400 },
  }),
  'mesta-cabanya-real': tradicion({
    casa: 'mesta',
    ronda: 'fama',
    criterio: 'profundizar',
    nombre: 'Gran cabaña',
    descripcion:
      'Rebaños un 20 % más baratos y un 10 % más de lana, pero administrar cada comarca cuesta un 15 % más.',
    nota: 'Las grandes cabañas de monasterios y nobles —el Paular, Guadalupe, el duque del Infantado— movían decenas de miles de cabezas cada otoño.',
    modificadores: { costeRebanyoMil: 800, lanaEsquileoMil: 1100, administracionMil: 1150 },
  }),
  'mesta-positos': tradicion({
    casa: 'mesta',
    ronda: 'fama',
    criterio: 'compensar',
    nombre: 'Pósitos',
    descripcion: 'Graneros concejiles: el pan del almacén se pierde a la mitad de ritmo.',
    nota: 'Los pósitos guardaban trigo para prestarlo en los años malos; se extendieron por toda Castilla en el siglo XVI.',
    modificadores: { mermaPanMil: 20 },
  }),
  'mesta-cabanya-de-carreteros': tradicion({
    casa: 'mesta',
    ronda: 'fama',
    criterio: 'abrir',
    nombre: 'Cabaña de carreteros',
    descripcion:
      'Tus recuas cuestan un 15 % menos y cargan cuatro más: la cañada también es camino.',
    nota: 'La Cabaña Real de Carreteros, reconocida por los Reyes Católicos en 1497, gozaba de privilegios de paso y pasto parecidos a los de la Mesta.',
    modificadores: { costeRecuaMil: 850, porteExtra: 4 },
  }),
  'mesta-lana-para-flandes': tradicion({
    casa: 'mesta',
    ronda: 'linaje',
    criterio: 'profundizar',
    nombre: 'Lana para Flandes',
    descripcion: 'Un 25 % más de lana, pero tu gente crece un 10 % más despacio.',
    nota: 'Se decía que la Mesta despoblaba Castilla: donde pastaba el merino no se araba, y los pueblos menguaban mientras las sacas salían por Bilbao.',
    modificadores: { lanaEsquileoMil: 1250, crecimientoMil: 900 },
  }),
  'mesta-corredores-de-lana': tradicion({
    casa: 'mesta',
    ronda: 'linaje',
    criterio: 'compensar',
    nombre: 'Corredores de lana',
    descripcion: 'Tus corredores compran y venden en cualquier plaza a mitad de comisión.',
    nota: 'Los corredores de Burgos y Segovia ajustaban en la sierra, antes del esquileo, la lana que luego se embarcaba; con lo cobrado se compraba el pan.',
    modificadores: { comisionMercadoMil: 10 },
  }),
  'mesta-panyeros-de-segovia': tradicion({
    casa: 'mesta',
    ronda: 'linaje',
    criterio: 'abrir',
    nombre: 'Pañeros de Segovia',
    descripcion:
      'Mercados e impuestos dan un 30 % más de maravedís, pero la lana del esquileo baja un 15 %.',
    nota: 'Segovia fue en el siglo XVI la gran ciudad pañera de Castilla: sus batanes del Eresma tejían la lana que no iba a Flandes.',
    modificadores: { produccionMil: { maravedis: 1300 }, lanaEsquileoMil: 850 },
  }),

  // ——— Ferrones de Vizcaya ———————————————————————————————————————————————————
  'ferrones-maestros-de-forja': tradicion({
    casa: 'ferrones',
    ronda: 'renombre',
    criterio: 'profundizar',
    nombre: 'Maestros de forja',
    descripcion:
      'Tus aperos rinden un 30 % más, pero tu pan un 10 % menos; con T-103, los vendidos pagan más renta.',
    nota: 'Las rejas, azadas y hoces de hierro vizcaíno se vendían por toda Castilla: un buen apero duraba una vida y se heredaba.',
    modificadores: { efectoAperosMil: 1300, produccionMil: { pan: 900 } },
  }),
  'ferrones-vena-profunda': tradicion({
    casa: 'ferrones',
    ronda: 'renombre',
    criterio: 'compensar',
    nombre: 'Vena profunda',
    descripcion:
      'El hierro se agota a la mitad y el monte un 20 % más despacio; las ferrerías cuestan un 25 % más.',
    nota: 'Las venas de Somorrostro se explotaban a cielo abierto y parecían no acabarse; seguirlas bajo tierra costaba más, pero duraban siglos.',
    modificadores: {
      agotamientoMil: { hierro: 500, monte: 800 },
      costeEdificioMil: { ferreria: 1250 },
    },
  }),
  'ferrones-armas': tradicion({
    casa: 'ferrones',
    ronda: 'renombre',
    criterio: 'abrir',
    nombre: 'Armas',
    descripcion:
      'Espadas, lanzas y corazas: con la fase de conflicto, milicia temprana y más barata.',
    nota: 'De las ferrerías de Placencia y de los talleres de Eugui salían armas para los tercios; el hierro que hacía rejas también hacía picas.',
    pendienteDe: 'T-120',
  }),
  'ferrones-ferreria-mayor': tradicion({
    casa: 'ferrones',
    ronda: 'fama',
    criterio: 'profundizar',
    nombre: 'Ferrería mayor',
    descripcion: 'Tus ferrerías rinden un 30 % más, pero cada carbonera cuesta un 30 % más.',
    nota: 'La ferrería mayor reducía la vena en su horno bajo; la menor solo labraba el hierro. Las mayores quemaban montes enteros de carbón.',
    modificadores: {
      produccionEdificioMil: { ferreria: 1300 },
      costeEdificioMil: { carbonera: 1300 },
    },
  }),
  'ferrones-trasmochos': tradicion({
    casa: 'ferrones',
    ronda: 'fama',
    criterio: 'compensar',
    nombre: 'Trasmochos',
    descripcion: 'Se corta la rama y no el tronco: el monte se te agota un 30 % más despacio.',
    nota: 'Los carboneros guipuzcoanos trasmochaban hayas y robles para que el árbol rebrotara: las ordenanzas de montes lo exigían ya en el siglo XVI.',
    modificadores: { agotamientoMil: { monte: 700 } },
  }),
  'ferrones-anclas-y-clavazon': tradicion({
    casa: 'ferrones',
    ronda: 'fama',
    criterio: 'abrir',
    nombre: 'Anclas y clavazón',
    descripcion:
      'Mercados e impuestos dan un 20 % más de maravedís y la atarazana te cuesta un 40 % menos.',
    nota: 'Las ferrerías vizcaínas forjaban anclas, clavos y herrajes para los astilleros del Cantábrico y para las flotas que salían de Sevilla.',
    modificadores: { produccionMil: { maravedis: 1200 }, costeObraMayorMil: { atarazana: 600 } },
  }),
  'ferrones-hierro-de-vizcaya': tradicion({
    casa: 'ferrones',
    ronda: 'linaje',
    criterio: 'profundizar',
    nombre: 'Hierro de Vizcaya',
    descripcion: 'Un 30 % más de hierro, pero administrar cada comarca cuesta un 10 % más.',
    nota: 'El hierro vizcaíno se exportaba a Inglaterra, Flandes y las Indias: era, con la lana, la gran mercancía de la costa cantábrica.',
    modificadores: { produccionMil: { hierro: 1300 }, administracionMil: 1100 },
  }),
  'ferrones-martinetes': tradicion({
    casa: 'ferrones',
    ronda: 'linaje',
    criterio: 'compensar',
    nombre: 'Martinetes',
    descripcion:
      'El mazo de agua aprovecha el carbón: cada carbonera sostiene tres niveles de ferrería.',
    nota: 'El martinete, un mazo movido por rueda hidráulica, multiplicó lo que una ferrería sacaba de cada carga de carbón.',
    modificadores: { edificiosPorRequisito: { ferreria: 3 } },
  }),
  'ferrones-hidalguia-universal': tradicion({
    casa: 'ferrones',
    ronda: 'linaje',
    criterio: 'abrir',
    nombre: 'Hidalguía universal',
    descripcion: 'La lealtad de tus comarcas no baja de 30 y administrarlas cuesta un 15 % menos.',
    nota: 'Los fueros reconocían la hidalguía de todos los vizcaínos: nadie pechaba, y todos defendían el fuero como cosa propia.',
    modificadores: { lealtadMinima: 30, administracionMil: 850 },
  }),

  // ——— Canteros trasmeranos ——————————————————————————————————————————————————
  'canteros-cimborrio': tradicion({
    casa: 'canteros',
    ronda: 'renombre',
    criterio: 'profundizar',
    nombre: 'Cimborrio',
    descripcion: 'Tus catedrales se levantan en la mitad de tiempo, y cuestan un 10 % más.',
    nota: 'El cimborrio de la catedral de Burgos se hundió en 1539 y lo levantó de nuevo Juan de Vallejo: cerrar una bóveda así era la prueba del maestro.',
    modificadores: {
      avanceObraMayorMil: { catedral: 2000 },
      costeObraMayorMil: { catedral: 1100 },
    },
  }),
  'canteros-gremio': tradicion({
    casa: 'canteros',
    ronda: 'renombre',
    criterio: 'compensar',
    nombre: 'Gremio',
    descripcion:
      'Una cuadrilla más en cada comarca; con T-103, además, contratos de obra simultáneos.',
    nota: 'Las cuadrillas de Trasmiera salían cada primavera de sus valles con el maestro al frente y volvían por San Martín: el oficio pasaba de padres a hijos.',
    modificadores: { cuadrillasExtra: 1 },
  }),
  'canteros-ingenieros': tradicion({
    casa: 'canteros',
    ronda: 'renombre',
    criterio: 'abrir',
    nombre: 'Ingenieros',
    descripcion: 'Puentes y calzadas un 40 % más baratos y otro 40 % más rápidos.',
    nota: 'Los grandes puentes de piedra del siglo XVI, como el de Almaraz sobre el Tajo, se sacaban a subasta y se contrataban con maestros canteros.',
    modificadores: {
      costeObraMayorMil: { puente: 600, calzada: 600 },
      avanceObraMayorMil: { puente: 1400, calzada: 1400 },
    },
  }),
  'canteros-maestro-mayor': tradicion({
    casa: 'canteros',
    ronda: 'fama',
    criterio: 'profundizar',
    nombre: 'Maestro mayor',
    descripcion: 'Todas tus obras mayores avanzan un 20 % más, pero tu pan rinde un 10 % menos.',
    nota: 'El maestro mayor de una catedral gobernaba la obra de por vida: trazaba, contrataba canteros y respondía ante el cabildo.',
    modificadores: { obraMayorAvanceMil: 1200, produccionMil: { pan: 900 } },
  }),
  'canteros-bancales': tradicion({
    casa: 'canteros',
    ronda: 'fama',
    criterio: 'compensar',
    nombre: 'Bancales',
    descripcion:
      'Muros de piedra seca ganan tierra a la ladera: recuperas el solar que te faltaba.',
    nota: 'Bancales y paredes de piedra seca convirtieron laderas imposibles en huertos y viñas; el cantero sabía hacerlos sin una gota de cal.',
    modificadores: { solaresExtra: 1 },
  }),
  'canteros-cal-y-canto': tradicion({
    casa: 'canteros',
    ronda: 'fama',
    criterio: 'abrir',
    nombre: 'Cal y canto',
    descripcion: 'Casas, cercas, ventas y mercados te cuestan un 30 % menos.',
    nota: 'Lo hecho «de cal y canto» era para siempre: la expresión viene de la mampostería trabada con cal que los canteros levantaban en villas y aldeas.',
    modificadores: {
      costeEdificioMil: { casas: 700, cerca: 700, venta: 700, mercado: 700 },
    },
  }),
  'canteros-escuela-de-trasmiera': tradicion({
    casa: 'canteros',
    ronda: 'linaje',
    criterio: 'profundizar',
    nombre: 'Escuela de Trasmiera',
    descripcion:
      'Obras mayores un 10 % más baratas, pero administrar cada comarca cuesta un 10 % más.',
    nota: 'De Trasmiera salieron los Gil de Hontañón, Juan de Rasines y cientos de maestros que levantaron media Castilla.',
    modificadores: { obraMayorCosteMil: 900, administracionMil: 1100 },
  }),
  'canteros-casas-de-piedra': tradicion({
    casa: 'canteros',
    ronda: 'linaje',
    criterio: 'compensar',
    nombre: 'Casas de piedra',
    descripcion: 'Cada nivel de casas aloja dos vecinos más.',
    nota: 'La casona montañesa, de sillería con escudo en la fachada, se pagaba con lo ganado en las obras de fuera y se heredaba durante generaciones.',
    modificadores: { capacidadPorCasasExtra: 2 },
  }),
  'canteros-villas-muradas': tradicion({
    casa: 'canteros',
    ronda: 'linaje',
    criterio: 'abrir',
    nombre: 'Villas muradas',
    descripcion: 'La muralla te cuesta la mitad y la lealtad de tus comarcas no baja de 25.',
    nota: 'Una villa con muralla cobraba portazgo, guardaba su mercado y sus vecinos dormían tranquilos: la cerca era orgullo del concejo.',
    modificadores: { costeObraMayorMil: { muralla: 500 }, lealtadMinima: 25 },
  }),

  // ——— Mercaderes de feria ———————————————————————————————————————————————————
  'mercaderes-consulado': tradicion({
    casa: 'mercaderes',
    ronda: 'renombre',
    criterio: 'profundizar',
    nombre: 'Consulado',
    descripcion:
      'El consulado negocia por ti: no pagas comisión en ninguna plaza, pero administrar cuesta un 10 % más.',
    nota: 'El Consulado de Burgos (1494) organizaba las flotas de lana a Flandes y arbitraba los pleitos entre mercaderes sin pasar por los jueces del rey.',
    modificadores: { comisionMercadoMil: 0, administracionMil: 1100 },
  }),
  'mercaderes-flota': tradicion({
    casa: 'mercaderes',
    ronda: 'renombre',
    criterio: 'compensar',
    nombre: 'Flota',
    descripcion: 'La atarazana te cuesta la mitad y tus lonjas rinden un 30 % más.',
    nota: 'Los mercaderes burgaleses fletaban naos en Bilbao, Laredo y Santander: salía la lana y volvían el pescado, el trigo de Bretaña y los paños.',
    modificadores: {
      costeObraMayorMil: { atarazana: 500 },
      produccionEdificioMil: { lonja: 1300 },
    },
  }),
  'mercaderes-banca': tradicion({
    casa: 'mercaderes',
    ronda: 'renombre',
    criterio: 'abrir',
    nombre: 'Banca',
    descripcion:
      'Prestar maravedís a otros jugadores con interés, con contrato que el motor cumple.',
    nota: 'Los banqueros de Medina y Burgos prestaban a nobles, concejos y al propio rey: el dinero de la lana acabó financiando imperios.',
    pendienteDe: 'T-103',
  }),
  'mercaderes-compania': tradicion({
    casa: 'mercaderes',
    ronda: 'fama',
    criterio: 'profundizar',
    nombre: 'Compañía',
    descripcion:
      'Tus recuas cuestan un 20 % menos y cargan tres más, pero tu gente crece un 5 % más despacio.',
    nota: 'Las compañías mercantiles repartían capital y riesgo entre socios y factores repartidos por Brujas, Nantes, Florencia y Sevilla.',
    modificadores: { costeRecuaMil: 800, porteExtra: 3, crecimientoMil: 950 },
  }),
  'mercaderes-censos': tradicion({
    casa: 'mercaderes',
    ronda: 'fama',
    criterio: 'compensar',
    nombre: 'Censos',
    descripcion: 'Compras rentas sobre tierras ajenas: tu pan rinde un 20 % más.',
    nota: 'Los mercaderes enriquecidos compraban juros y censos: rentas en pan y en dinero cargadas sobre tierras que nunca pisaban.',
    modificadores: { produccionMil: { pan: 1200 } },
  }),
  'mercaderes-asentistas': tradicion({
    casa: 'mercaderes',
    ronda: 'fama',
    criterio: 'abrir',
    nombre: 'Asentistas',
    descripcion: 'Adelantas dinero y material: tus obras mayores cuestan un 20 % menos.',
    nota: 'Los asentistas adelantaban a la Corona dinero y suministros a cambio de rentas: el crédito se convertía en obras, oficios y privilegios.',
    modificadores: { obraMayorCosteMil: 800 },
  }),
  'mercaderes-ferias-de-pagos': tradicion({
    casa: 'mercaderes',
    ronda: 'linaje',
    criterio: 'profundizar',
    nombre: 'Ferias de pagos',
    descripcion:
      'Mercados e impuestos dan un 30 % más de maravedís, y administrar cuesta otro 10 % más.',
    nota: 'En las ferias de Medina del Campo se liquidaban las letras de media Europa: eran ferias de pagos más que de mercancías.',
    modificadores: { produccionMil: { maravedis: 1300 }, administracionMil: 1100 },
  }),
  'mercaderes-alhondigas': tradicion({
    casa: 'mercaderes',
    ronda: 'linaje',
    criterio: 'compensar',
    nombre: 'Alhóndigas',
    descripcion: 'El pan del almacén se pierde a menos de la mitad de ritmo.',
    nota: 'La alhóndiga era el almacén público de grano donde los forasteros debían vender el trigo que traían, a precio y peso vigilados.',
    modificadores: { mermaPanMil: 15 },
  }),
  'mercaderes-mecenazgo': tradicion({
    casa: 'mercaderes',
    ronda: 'linaje',
    criterio: 'abrir',
    nombre: 'Mecenazgo',
    descripcion: 'Catedrales y monasterios te cuestan un 30 % menos.',
    nota: 'Los mercaderes de Burgos y de Medina pagaban capillas funerarias en iglesias y conventos: el dinero de la feria buscaba memoria en piedra.',
    modificadores: { costeObraMayorMil: { catedral: 700, monasterio: 700 } },
  }),

  // ——— Monjes repobladores ———————————————————————————————————————————————————
  'monjes-granjas-monasticas': tradicion({
    casa: 'monjes',
    ronda: 'renombre',
    criterio: 'profundizar',
    nombre: 'Granjas monásticas',
    descripcion: 'Tu pan rinde un 25 % más, pero cada granja cuesta un 20 % más.',
    nota: 'Las granjas cistercienses eran explotaciones trabajadas por legos conversos, a veces a leguas del monasterio, con su propia bodega y su palomar.',
    modificadores: { produccionMil: { pan: 1250 }, costeEdificioMil: { granja: 1200 } },
  }),
  'monjes-hospitalidad': tradicion({
    casa: 'monjes',
    ronda: 'renombre',
    criterio: 'compensar',
    nombre: 'Hospitalidad',
    descripcion:
      'Peregrinos que dejan limosna y a veces se quedan: un 25 % más de maravedís y un 10 % más de crecimiento.',
    nota: 'Hospitales como el de Roncesvalles o el de San Marcos acogían a los peregrinos de Santiago; muchos pueblos del Camino nacieron de los que se quedaron.',
    modificadores: { produccionMil: { maravedis: 1250 }, crecimientoMil: 1100 },
  }),
  'monjes-scriptorium': tradicion({
    casa: 'monjes',
    ronda: 'renombre',
    criterio: 'abrir',
    nombre: 'Scriptorium',
    descripcion: 'Cartularios y deslindes: administrar cada comarca te cuesta un 30 % menos.',
    nota: 'Los cartularios copiaban privilegios, donaciones y deslindes: con ellos un abad gobernaba valles enteros sin salir del claustro.',
    modificadores: { administracionMil: 700 },
  }),
  'monjes-reforma': tradicion({
    casa: 'monjes',
    ronda: 'fama',
    criterio: 'profundizar',
    nombre: 'Reforma',
    descripcion:
      'La lealtad de tus comarcas no baja de 60, pero mercados e impuestos rinden un 10 % menos.',
    nota: 'Las reformas de Cluny, del Císter y, siglos después, de los jerónimos devolvían la regla a su rigor: menos rentas, más devoción.',
    modificadores: { lealtadMinima: 60, produccionMil: { maravedis: 900 } },
  }),
  'monjes-senyorio-abacial': tradicion({
    casa: 'monjes',
    ronda: 'fama',
    criterio: 'compensar',
    nombre: 'Señorío abacial',
    descripcion: 'El abad es señor: puedes fijar una carga fiscal dura.',
    nota: 'Los abades cobraban rentas, diezmos y martiniegas como cualquier noble: Sahagún o Poblet eran señoríos con villas enteras, pese al voto de pobreza.',
    prohibiciones: { cargaFiscalDura: false },
  }),
  'monjes-pontifices': tradicion({
    casa: 'monjes',
    ronda: 'fama',
    criterio: 'abrir',
    nombre: 'Puentes del Camino',
    descripcion: 'Puentes un 40 % y calzadas un 30 % más baratos.',
    nota: 'Santo Domingo de la Calzada desbrozó el Camino, levantó un puente sobre el Oja y un hospital: es el patrón de los ingenieros de caminos.',
    modificadores: { costeObraMayorMil: { puente: 600, calzada: 700 } },
  }),
  'monjes-cister': tradicion({
    casa: 'monjes',
    ronda: 'linaje',
    criterio: 'profundizar',
    nombre: 'Císter',
    descripcion:
      'Tus pueblas nacen con un 20 % menos de gente y tu gente crece un 15 % más, pero tu pan rinde un 10 % menos.',
    nota: 'El Císter llegó a la península en el siglo XII y en un siglo la sembró de abadías: Poblet, Santes Creus, Las Huelgas, Alcobaça…',
    modificadores: { vecinosParaPueblaMil: 800, crecimientoMil: 1150, produccionMil: { pan: 900 } },
  }),
  'monjes-granja-franca': tradicion({
    casa: 'monjes',
    ronda: 'linaje',
    criterio: 'compensar',
    nombre: 'Granja franca',
    descripcion: 'Lo que vendes de tus granjas paga la mitad de comisión.',
    nota: 'Muchos monasterios estaban exentos de alcabala y de portazgo en lo que vendían de sus granjas: la pobreza del monje no era la de su bodega.',
    modificadores: { comisionMercadoMil: 10 },
  }),
  'monjes-estudio-general': tradicion({
    casa: 'monjes',
    ronda: 'linaje',
    criterio: 'abrir',
    nombre: 'Estudio general',
    descripcion: 'Tus letrados pesan en los concejos: tu influencia rinde un 30 % más.',
    nota: 'Salamanca y Alcalá nacieron al amparo de la Iglesia; sus letrados acabaron en los consejos del rey y en las mesas de los concejos.',
    modificadores: { influenciaMil: 1300 },
  }),

  // ——— Salineros y almadraberos ——————————————————————————————————————————————
  'salineros-almadraba': tradicion({
    casa: 'salineros',
    ronda: 'renombre',
    criterio: 'profundizar',
    nombre: 'Almadraba',
    descripcion: 'Pesca mayor: tus lonjas rinden un 30 % más, y cuestan otro 30 % más.',
    nota: 'Las almadrabas de Zahara y Conil, del duque de Medina Sidonia, calaban redes de leguas para atrapar el atún que pasaba el Estrecho cada primavera.',
    modificadores: { produccionEdificioMil: { lonja: 1300 }, costeEdificioMil: { lonja: 1300 } },
  }),
  'salineros-salazon-de-exportacion': tradicion({
    casa: 'salineros',
    ronda: 'renombre',
    criterio: 'compensar',
    nombre: 'Salazón de exportación',
    descripcion:
      'Pescado salado para el camino: tus recuas comen un 30 % menos y ganas un 10 % más de maravedís.',
    nota: 'El pescado en salazón subía a la meseta a lomo de mula y aguantaba meses: era la carne de los días de vigilia de media Castilla.',
    modificadores: { bastimentoMil: 700, produccionMil: { maravedis: 1100 } },
  }),
  'salineros-alfoli': tradicion({
    casa: 'salineros',
    ronda: 'renombre',
    criterio: 'abrir',
    nombre: 'Alfolí',
    descripcion: 'Monopolio: fijas el precio de la sal en las plazas donde vendes.',
    nota: 'El alfolí era el almacén de la sal del rey: quien lo tenía decidía a cuánto se vendía la sal en toda la comarca.',
    pendienteDe: 'T-102',
  }),
  'salineros-eras-de-sal': tradicion({
    casa: 'salineros',
    ronda: 'fama',
    criterio: 'profundizar',
    nombre: 'Eras de sal',
    descripcion: 'Tus salinas rinden un 25 % más, pero la sal se te agota un 30 % más deprisa.',
    nota: 'En Añana la salmuera corría por canales de madera hasta miles de eras levantadas sobre la ladera; cada familia tenía las suyas.',
    modificadores: { produccionEdificioMil: { salina: 1250 }, agotamientoMil: { sal: 1300 } },
  }),
  'salineros-salinas-de-interior': tradicion({
    casa: 'salineros',
    ronda: 'fama',
    criterio: 'compensar',
    nombre: 'Salinas de interior',
    descripcion: 'Granjas, aserraderos y canteras vuelven a llegar a nivel 3.',
    nota: 'Añana, Imón o Poza: la sal de tierra adentro hizo prósperos valles lejos del mar, y con ella llegaron molinos, bosques cuidados y caminos.',
    modificadores: { nivelMaximoEdificio: { granja: 3, aserradero: 3, cantera: 3 } },
  }),
  'salineros-sal-para-el-ganado': tradicion({
    casa: 'salineros',
    ronda: 'fama',
    criterio: 'abrir',
    nombre: 'Sal para el ganado',
    descripcion: 'Tus rebaños cuestan un 30 % menos y dan un 10 % más de lana.',
    nota: 'El ganado necesita sal: los pastores la compraban por fanegas para las majadas, y las salinas vivían también de la trashumancia.',
    modificadores: { costeRebanyoMil: 700, lanaEsquileoMil: 1100 },
  }),
  'salineros-regalia-de-la-sal': tradicion({
    casa: 'salineros',
    ronda: 'linaje',
    criterio: 'profundizar',
    nombre: 'Regalía de la sal',
    descripcion: 'Un 30 % más de sal, pero tu gente crece un 5 % más despacio.',
    nota: 'Alfonso XI hizo de la sal una regalía de la Corona en el siglo XIV: desde entonces los salineros trabajaban para el rey, y el rey cuidaba sus salinas.',
    modificadores: { produccionMil: { sal: 1300 }, crecimientoMil: 950 },
  }),
  'salineros-caminos-de-la-sal': tradicion({
    casa: 'salineros',
    ronda: 'linaje',
    criterio: 'compensar',
    nombre: 'Caminos de la sal',
    descripcion: 'Tus recuas cuestan un 20 % menos y andan media jornada más.',
    nota: 'Las recuas de la sal subían de Añana y de Imón a la meseta por caminos que aún se llaman de la sal.',
    modificadores: { costeRecuaMil: 800, pasoRecuaMil: 500 },
  }),
  'salineros-hermandad-de-las-marismas': tradicion({
    casa: 'salineros',
    ronda: 'linaje',
    criterio: 'abrir',
    nombre: 'Hermandad de las Marismas',
    descripcion: 'Una liga de puertos con voz propia: tu influencia rinde un 30 % más.',
    nota: 'La Hermandad de las Marismas unió en 1296 a las villas del Cantábrico para defender su comercio: pactaba con Inglaterra y Francia como un reino más.',
    modificadores: { influenciaMil: 1300 },
  }),

  // ——— Arrieros maragatos ————————————————————————————————————————————————————
  'arrieros-carreteria': tradicion({
    casa: 'arrieros',
    ronda: 'renombre',
    criterio: 'profundizar',
    nombre: 'Carretería',
    descripcion:
      'Carretas de bueyes: diez de porte más por recua, pero media jornada menos de paso.',
    nota: 'La carreta de bueyes cargaba mucho más que la mula, pero solo por camino carretero y a paso de buey.',
    modificadores: { porteExtra: 10, pasoRecuaMil: -500 },
  }),
  'arrieros-ventas-reales': tradicion({
    casa: 'arrieros',
    ronda: 'renombre',
    criterio: 'compensar',
    nombre: 'Ventas reales',
    descripcion:
      'Tus recuas comen un 30 % menos en el camino y tus ventas cuestan un 30 % menos; con T-102, dan noticias.',
    nota: 'Las ventas, a una jornada unas de otras, daban cama, pienso y noticias: allí se sabía todo antes que en la corte.',
    modificadores: { bastimentoMil: 700, costeEdificioMil: { venta: 700 } },
  }),
  'arrieros-correo': tradicion({
    casa: 'arrieros',
    ronda: 'renombre',
    criterio: 'abrir',
    nombre: 'Correo',
    descripcion: 'Vendes información a otros jugadores, con precio y fecha.',
    nota: 'Los Tassis organizaron el correo de los Austrias, pero las cartas de los particulares viajaban en la alforja de los arrieros.',
    pendienteDe: 'T-102',
  }),
  'arrieros-mulas-de-tiro': tradicion({
    casa: 'arrieros',
    ronda: 'fama',
    criterio: 'profundizar',
    nombre: 'Mulas de tiro',
    descripcion:
      'Recuas un 20 % más baratas y con tres más de porte, pero tu pan rinde un 10 % menos.',
    nota: 'La mula manchega y la leonesa eran las mejores del reino: fuertes, sobrias y caras. El arriero cuidaba más de ellas que de sí mismo.',
    modificadores: { costeRecuaMil: 800, porteExtra: 3, produccionMil: { pan: 900 } },
  }),
  'arrieros-casa-solariega': tradicion({
    casa: 'arrieros',
    ronda: 'fama',
    criterio: 'compensar',
    nombre: 'Casa solariega',
    descripcion: 'Tu gente echa raíces: recuperas el vecino por nivel de casas.',
    nota: 'Los maragatos volvían siempre a su pueblo de la Maragatería: casonas de piedra con portalón para las recuas, pagadas con el camino.',
    modificadores: { capacidadPorCasasExtra: 1 },
  }),
  'arrieros-abastecedores': tradicion({
    casa: 'arrieros',
    ronda: 'fama',
    criterio: 'abrir',
    nombre: 'Abastecedores',
    descripcion: 'Compras y vendes por tu cuenta: pagas la mitad de comisión en cualquier plaza.',
    nota: 'Los maragatos llevaban pescado de Galicia a Madrid y volvían con garbanzos y vino: no solo porteaban, compraban y vendían.',
    modificadores: { comisionMercadoMil: 10 },
  }),
  'arrieros-arrieria-mayor': tradicion({
    casa: 'arrieros',
    ronda: 'linaje',
    criterio: 'profundizar',
    nombre: 'Arriería mayor',
    descripcion:
      'Media jornada más de paso y recuas un 10 % más baratas, pero tu gente crece un 10 % más despacio.',
    nota: 'A finales del siglo XVI la arriería maragata movía buena parte del tráfico entre Galicia, León y la corte.',
    modificadores: { pasoRecuaMil: 500, costeRecuaMil: 900, crecimientoMil: 900 },
  }),
  'arrieros-mesones': tradicion({
    casa: 'arrieros',
    ronda: 'linaje',
    criterio: 'compensar',
    nombre: 'Mesones',
    descripcion: 'Donde paran tus recuas nacen mesones: tu gente crece un 15 % más.',
    nota: 'Mesones, herrerías y posadas crecían donde paraban las recuas: los pueblos del camino vivían del tráfico.',
    modificadores: { crecimientoMil: 1150 },
  }),
  'arrieros-santa-hermandad': tradicion({
    casa: 'arrieros',
    ronda: 'linaje',
    criterio: 'abrir',
    nombre: 'Santa Hermandad',
    descripcion:
      'Caminos seguros: tu influencia rinde un 30 % más y la lealtad de tus comarcas no baja de 20.',
    nota: 'La Santa Hermandad de 1476 guardaba los caminos con cuadrilleros pagados por los concejos: el arriero fue su mejor cliente.',
    modificadores: { influenciaMil: 1300, lealtadMinima: 20 },
  }),

  // ——— Hortelanos de la vega —————————————————————————————————————————————————
  'hortelanos-tribunal-de-aguas': tradicion({
    casa: 'hortelanos',
    ronda: 'renombre',
    criterio: 'profundizar',
    nombre: 'Tribunal de las aguas',
    descripcion:
      'El riego repartido con justicia: huertas y granjas de vega rinden un 20 % más. Con T-103, también a tus aliados.',
    nota: 'El Tribunal de las Aguas de València se reúne cada jueves a la puerta de la catedral: juicio oral, en valenciano y sin apelación.',
    modificadores: { produccionEdificioEnVegaMil: { huerta: 1200, granja: 1200 } },
  }),
  'hortelanos-azud-mayor': tradicion({
    casa: 'hortelanos',
    ronda: 'renombre',
    criterio: 'compensar',
    nombre: 'Azud mayor',
    descripcion: 'El agua llega más lejos: tu labor ya no pierde nada fuera de la vega.',
    nota: 'Los azudes, presas bajas de piedra, levantaban el agua del río para llevarla por acequias a tierras que nunca la habían visto.',
    modificadores: { laborFueraDeVegaMil: 1334 },
  }),
  'hortelanos-morera-y-seda': tradicion({
    casa: 'hortelanos',
    ronda: 'renombre',
    criterio: 'abrir',
    nombre: 'Morera y seda',
    descripcion: 'Un lujo que se paga: un 30 % más de maravedís, pero tu pan rinde un 10 % menos.',
    nota: 'La seda de Valencia, Murcia y Granada, criada en moreras de huerta, fue durante siglos el lujo que más dinero movía en el reino.',
    modificadores: { produccionMil: { maravedis: 1300, pan: 900 } },
  }),
  'hortelanos-norias': tradicion({
    casa: 'hortelanos',
    ronda: 'fama',
    criterio: 'profundizar',
    nombre: 'Norias',
    descripcion: 'Tus huertas llegan a nivel 5, y cada huerta cuesta un 20 % más.',
    nota: 'La noria de sangre, movida por una mula con los ojos vendados, subía el agua de pozos y acequias bajas: sus cangilones marcaban el ritmo de la huerta.',
    modificadores: { nivelMaximoEdificio: { huerta: 5 }, costeEdificioMil: { huerta: 1200 } },
  }),
  'hortelanos-aljibes': tradicion({
    casa: 'hortelanos',
    ronda: 'fama',
    criterio: 'compensar',
    nombre: 'Aljibes',
    descripcion: 'Balsas y aljibes guardan el agua: fuera de la vega tu labor rinde un 15 % más.',
    nota: 'Los aljibes andalusíes recogían la lluvia de tejados y laderas; en el secano, una balsa llena era la diferencia entre cosecha y hambre.',
    modificadores: { laborFueraDeVegaMil: 1150 },
  }),
  'hortelanos-alquerias': tradicion({
    casa: 'hortelanos',
    ronda: 'fama',
    criterio: 'abrir',
    nombre: 'Alquerías',
    descripcion:
      'Aldeas de huerta siguiendo la acequia: pueblas con un 30 % menos de gente y un 10 % más de crecimiento.',
    nota: 'Las alquerías, pequeñas aldeas de huerta, se multiplicaban siguiendo las acequias: muchas son hoy barrios de València o de Murcia.',
    modificadores: { vecinosParaPueblaMil: 700, crecimientoMil: 1100 },
  }),
  'hortelanos-marjales': tradicion({
    casa: 'hortelanos',
    ronda: 'linaje',
    criterio: 'profundizar',
    nombre: 'Marjales',
    descripcion: 'Tu pan rinde un 20 % más, pero administrar cada comarca cuesta un 10 % más.',
    nota: 'Desecar marjales para cultivarlos era obra de generaciones: canales, motas y turnos de agua que había que vigilar sin descanso.',
    modificadores: { produccionMil: { pan: 1200 }, administracionMil: 1100 },
  }),
  'hortelanos-comunidad-de-regantes': tradicion({
    casa: 'hortelanos',
    ronda: 'linaje',
    criterio: 'compensar',
    nombre: 'Comunidad de regantes',
    descripcion: 'El agua hace comunidad: la lealtad de tus comarcas no baja de 30.',
    nota: 'Las comunidades de regantes elegían a su síndico, fijaban los turnos de riego y juzgaban entre ellas: el agua obligaba a entenderse.',
    modificadores: { lealtadMinima: 30 },
  }),
  'hortelanos-arrozales': tradicion({
    casa: 'hortelanos',
    ronda: 'linaje',
    criterio: 'abrir',
    nombre: 'Arrozales',
    descripcion:
      'Granjas de vega un 30 % más y un 20 % más de maravedís, pero tu gente crece un 10 % más despacio.',
    nota: 'El arrozal daba mucho y mataba: las fiebres de los marjales obligaron a los reyes a acotar dónde se podía plantar arroz.',
    modificadores: {
      produccionEdificioEnVegaMil: { granja: 1300 },
      produccionMil: { maravedis: 1200 },
      crecimientoMil: 900,
    },
  }),
};
