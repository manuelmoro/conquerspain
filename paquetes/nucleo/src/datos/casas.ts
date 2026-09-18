// Las ocho casas de oficio (docs/04-casas-y-tradiciones.md §4.1; ficha T-041).
//
// Cada casa es una fila sobre puntos de extension genericos: el motor no nombra a ninguna, solo
// consulta estos numeros, permisos y prohibiciones. Lo que exige a otro jugador (contratos de
// aperos y de obra, portazgo) queda desactivado hasta T-103: el permiso esta aqui, pero ninguna
// fase lo lee todavia.
import type {
  Casa,
  CriterioDeOrigen,
  DatosCasa,
  Modificadores,
  Permisos,
  Prohibiciones,
} from '../tipos/reglas.ts';

/** Una casa sin privilegios ni limites: la base sobre la que cada casa cambia lo suyo. */
export const MODIFICADORES_NEUTROS: Modificadores = {
  produccionMil: {},
  costeEdificioMil: {},
  nivelMaximoEdificio: {},
  potencialMinimoEdificio: {},
  solaresExtra: 0,
  aperosMaximo: 3,
  pasoRecuaMil: 0,
  costeRecuaMil: 1000,
  porteExtra: 0,
  obraMayorCosteMil: 1000,
  obraMayorAvanceMil: 1000,
  obraSinFrenazoInvernal: false,
  mermaPanMil: 40,
  comisionMercadoMil: 20,
  lanaEsquileoMil: 1000,
  costeRebanyoMil: 1000,
  lealtadMinima: 0,
  agotamientoMonteMil: 1000,
  crecimientoMil: 1000,
  produccionEdificioMil: {},
  produccionEdificioEnVegaMil: {},
  laborFueraDeVegaMil: 1000,
  edificiosPorRequisito: {},
  costeObraMayorMil: {},
  capacidadPorCasasExtra: 0,
  vecinosParaPueblaMil: 1000,
};

export const SIN_PERMISOS: Permisos = {
  pasoFrancoPorCanyada: false,
  obraEnComarcaAjena: false,
  letraDeCambio: false,
  cobrarPortazgo: false,
  venderAperos: false,
  acequiaMenor: false,
  cartaPuebla: false,
};

export const SIN_PROHIBICIONES: Prohibiciones = {
  roturar: false,
  cargaFiscalDura: false,
  catedral: false,
  cobrarPortazgo: false,
};

/** Un criterio de origen: lo que no se dice no se pide. */
function origen(parte: Partial<CriterioDeOrigen>): CriterioDeOrigen {
  return { potenciales: {}, rasgos: [], terrenos: [], vecinaConPotencial: null, ...parte };
}

function casa(datos: {
  readonly nombre: string;
  readonly privilegio: string;
  readonly herramienta: string;
  readonly limite: string;
  readonly modificadores?: Partial<Modificadores>;
  readonly permisos?: Partial<Permisos>;
  readonly prohibiciones?: Partial<Prohibiciones>;
  readonly origenes: readonly CriterioDeOrigen[];
}): DatosCasa {
  return {
    nombre: datos.nombre,
    privilegio: datos.privilegio,
    herramienta: datos.herramienta,
    limite: datos.limite,
    modificadores: { ...MODIFICADORES_NEUTROS, ...datos.modificadores },
    permisos: { ...SIN_PERMISOS, ...datos.permisos },
    prohibiciones: { ...SIN_PROHIBICIONES, ...datos.prohibiciones },
    origenes: datos.origenes,
  };
}

export const CASAS_DE_OFICIO: Readonly<Record<Casa, DatosCasa>> = {
  mesta: casa({
    nombre: 'La Mesta',
    privilegio: 'Paso franco: sus rebaños cruzan por cañada real incluso tierra ajena.',
    herramienta: 'Rebaño merino: a mitad de precio y con un 25 % más de lana en el esquileo.',
    limite: 'No puede roturar, y su pan propio es un 30 % menor: depende del mercado.',
    modificadores: { produccionMil: { pan: 700 }, costeRebanyoMil: 500, lanaEsquileoMil: 1250 },
    permisos: { pasoFrancoPorCanyada: true },
    prohibiciones: { roturar: true },
    origenes: [origen({ potenciales: { pasto: 3 } })],
  }),
  ferrones: casa({
    nombre: 'Ferrones de Vizcaya',
    privilegio:
      'Ferrería de monte: con hierro 1 basta, y cada carbonera sostiene dos de sus niveles.',
    herramienta: 'Aperos de cuarta: nivel 4 (los demás, 3) y, con T-103, venderlos instalados.',
    limite: 'Monte devorado: el agotamiento del monte le sube un 50 % más deprisa.',
    modificadores: {
      potencialMinimoEdificio: { ferreria: 1 },
      edificiosPorRequisito: { ferreria: 2 },
      aperosMaximo: 4,
      agotamientoMonteMil: 1500,
    },
    permisos: { venderAperos: true },
    origenes: [
      origen({ potenciales: { hierro: 1 } }),
      origen({ vecinaConPotencial: { potencial: 'hierro', nivel: 2 } }),
    ],
  }),
  canteros: casa({
    nombre: 'Canteros trasmeranos',
    privilegio:
      'Contrato de obra: con T-103, sus cuadrillas trabajarán obras mayores en tierra ajena.',
    herramienta:
      'Maestría: obras mayores un 25 % más baratas, un 30 % más rápidas y sin frenazo de invierno.',
    limite: 'Pocas manos para el campo: un solar menos en cada comarca.',
    modificadores: {
      obraMayorCosteMil: 750,
      obraMayorAvanceMil: 1300,
      obraSinFrenazoInvernal: true,
      solaresExtra: -1,
    },
    permisos: { obraEnComarcaAjena: true },
    origenes: [origen({ potenciales: { piedra: 3 } })],
  }),
  mercaderes: casa({
    nombre: 'Mercaderes de feria',
    privilegio: 'Letra de cambio: pasa maravedís a una recua en otra plaza, con un 3 % y un turno.',
    herramienta: 'Corresponsales: con T-044, ve los precios de las ferias que ha visitado.',
    limite: 'Poca tierra: un solar menos y un 25 % menos de pan propio; vive de comprar.',
    modificadores: { produccionMil: { pan: 750 }, solaresExtra: -1 },
    permisos: { letraDeCambio: true },
    origenes: [origen({ rasgos: ['villa-de-feria'] }), origen({ rasgos: ['puerto-de-mar'] })],
  }),
  monjes: casa({
    nombre: 'Monjes repobladores',
    privilegio:
      'Carta puebla: funda pueblas con la mitad de gente y la lealtad de sus comarcas no baja de 50.',
    herramienta: 'Monasterio: una obra mayor un 30 % más barata.',
    limite: 'Pobreza declarada: sin carga fiscal dura y, con T-103, sin cobrar portazgos.',
    modificadores: {
      lealtadMinima: 50,
      vecinosParaPueblaMil: 500,
      costeObraMayorMil: { monasterio: 700 },
    },
    permisos: { cartaPuebla: true },
    prohibiciones: { cargaFiscalDura: true, cobrarPortazgo: true },
    origenes: [origen({ potenciales: { labor: 4 } })],
  }),
  salineros: casa({
    nombre: 'Salineros y almadraberos',
    privilegio: 'Sal propia: sus salinas rinden un 50 % más y su pan no sufre merma.',
    herramienta: 'Salazón: su lonja rinde un 50 % más y llega a nivel 3.',
    limite: 'Atado al agua: sus explotaciones de tierra adentro quedan un nivel por debajo.',
    modificadores: {
      produccionMil: { sal: 1500 },
      mermaPanMil: 0,
      produccionEdificioMil: { lonja: 1500 },
      nivelMaximoEdificio: {
        salina: 4,
        lonja: 3,
        granja: 2,
        aserradero: 2,
        cantera: 2,
        ferreria: 1,
      },
    },
    origenes: [origen({ potenciales: { sal: 2 } }), origen({ potenciales: { pesca: 3 } })],
  }),
  arrieros: casa({
    nombre: 'Arrieros maragatos',
    privilegio: 'Portazgo: con T-103, cobra por sus caminos y sus recuas no pagan el ajeno.',
    herramienta: 'Recua maragata: un 40 % más barata, una jornada más de paso y cinco de porte.',
    limite: 'Poca raíz: un vecino menos por nivel de casas y no puede levantar catedral.',
    modificadores: {
      costeRecuaMil: 600,
      pasoRecuaMil: 1000,
      porteExtra: 5,
      capacidadPorCasasExtra: -1,
    },
    permisos: { cobrarPortazgo: true },
    prohibiciones: { catedral: true },
    origenes: [origen({ rasgos: ['camino-de-santiago', 'calzada-romana'] })],
  }),
  hortelanos: casa({
    nombre: 'Hortelanos de la vega',
    privilegio: 'Acequia: la acequia menor deja el pan de la comarca sin factor de estación.',
    herramienta: 'Huerta intensiva: nivel 4 y un 50 % más en vega.',
    limite: 'Sed: su labor rinde un 25 % menos fuera de una vega o un río.',
    modificadores: {
      nivelMaximoEdificio: { huerta: 4 },
      produccionEdificioEnVegaMil: { huerta: 1500 },
      laborFueraDeVegaMil: 750,
    },
    permisos: { acequiaMenor: true },
    origenes: [origen({ terrenos: ['vega'] }), origen({ rasgos: ['vega-fluvial'] })],
  }),
};
