// Por que un robot no hace lo propio de su casa este turno (ficha T-050 §6.4). Cada motivo lleva su
// categoria: el mapa no lo ofrece, las reglas no lo hacen rentable, faltan recursos o el plan del
// robot aun no ha llegado ahi. Asi una via ausente en el informe tiene causa, no solo un «no».
//
// Es un catalogo cerrado: un motivo que no esta aqui no se puede anotar, y el informe los ensenya
// con su texto.

export const CATEGORIAS_DE_MOTIVO = ['mapa', 'reglas', 'recursos', 'plan'] as const;
export type CategoriaDeMotivo = (typeof CATEGORIAS_DE_MOTIVO)[number];

interface DatosDeMotivo {
  readonly categoria: CategoriaDeMotivo;
  readonly texto: string;
}

export const MOTIVOS = {
  // Recuas en general.
  'sin-oida-al-alcance': {
    categoria: 'reglas',
    texto:
      'ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta',
  },
  'sin-pan-para-el-viaje': {
    categoria: 'recursos',
    texto: 'no hay pan en el almacén para cargar el viaje',
  },
  'sin-sal-de-verano': {
    categoria: 'recursos',
    texto: 'es verano y no hay sal para las conservas del camino',
  },
  'recua-mermada': {
    categoria: 'plan',
    texto: 'la recua ha perdido acémilas y vuelve a disolverse para formarla de nuevo',
  },
  escasez: {
    categoria: 'recursos',
    texto: 'hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan',
  },
  'esencial-sin-recursos': {
    categoria: 'recursos',
    texto: 'no tiene con qué levantar un edificio esencial de su vía',
  },
  'recua-sin-formar': {
    categoria: 'recursos',
    texto: 'no tiene la gente, el pan o los maravedís para formar la recua que le falta',
  },
  'obra-mayor-en-marcha': {
    categoria: 'plan',
    texto: 'tiene una obra mayor en marcha y aún no la ha terminado',
  },
  'obra-mayor-sin-recursos': {
    categoria: 'recursos',
    texto: 'junta el material y los maravedís de su próxima obra mayor',
  },
  'sin-tierra-que-ganar': {
    categoria: 'mapa',
    texto: 'no hay comarca neutral explorada y vecina que se pueda ganar',
  },
  // Mesta.
  'sin-pasto-de-verano': {
    categoria: 'mapa',
    texto: 'no conoce ningún agostadero al que pueda llegar el ganado',
  },
  'sin-pasto-de-invierno': {
    categoria: 'mapa',
    texto: 'no conoce ningún invernadero al que pueda llegar el ganado',
  },
  'pastos-demasiado-lejos': {
    categoria: 'mapa',
    texto: 'los pastos conocidos quedan tan lejos que el ganado pasaría el año en el camino',
  },
  'sin-maravedis-para-rebanyo': {
    categoria: 'recursos',
    texto: 'no hay maravedís para formar un rebaño sin quedarse sin colchón',
  },
  'sin-lana-que-vender': {
    categoria: 'plan',
    texto: 'aún no hay lana esquilada que llevar a la feria',
  },
  // Ferias.
  'sin-feria-al-alcance': {
    categoria: 'mapa',
    texto: 'no conoce ninguna feria a la que llegar y volver con la mercancía',
  },
  'esperando-a-la-feria': {
    categoria: 'plan',
    texto: 'la feria abre más tarde: sale cuando llegaría con ella abierta',
  },
  // Comercio.
  'sin-mercado-propio': {
    categoria: 'plan',
    texto: 'aún no tiene mercado en la capital donde vender lo que sobra',
  },
  'sin-precios-sabidos': {
    categoria: 'mapa',
    texto: 'no sabe precios recientes de dos plazas a su alcance',
  },
  'sin-negocio-rentable': {
    categoria: 'reglas',
    texto: 'con los precios que sabe, ningún viaje deja ganancia después del bastimento',
  },
  'sin-viaje-que-quepa': {
    categoria: 'reglas',
    texto:
      'hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento',
  },
  'sin-bolsa-para-comprar': {
    categoria: 'recursos',
    texto: 'no hay maravedís de sobra para comprar mercancía',
  },
} as const satisfies Readonly<Record<string, DatosDeMotivo>>;

export type Motivo = keyof typeof MOTIVOS;

/** Los motivos de un turno: sin repetir y en el orden en que se anotaron. */
export class Motivos {
  private readonly lista: Motivo[] = [];

  anotar(motivo: Motivo): void {
    if (!this.lista.includes(motivo)) this.lista.push(motivo);
  }

  get todos(): readonly Motivo[] {
    return this.lista;
  }
}
