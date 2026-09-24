// El marcador y los hitos (docs/06-competicion.md §6.3; ficha T-043).
//
// El prestigio mide lo que se deja hecho, no lo que se acumula: por eso no hay ni un punto por
// almacen. Los hitos no dan recursos, solo prestigio y una linea en la cronica; el primero de la
// partida en lograr cada uno se lleva la primicia.
import type { DatosHito, DatosPrestigio, Hito } from '../tipos/reglas.ts';

export const PRESTIGIO: DatosPrestigio = {
  porCadaCincoVecinos: 1,
  // Ocupar tierra pesaba cuatro veces mas que cualquier oficio, asi que ganaba siempre quien mas
  // pan producia (medido en T-047, 24-09-2026). Ahora una comarca vale 8, y 12 si tiene fuero.
  porComarca: 8,
  porComarcaConFuero: 12,
  porObraMayor: {
    puente: 120,
    calzada: 150,
    monasterio: 120,
    catedral: 250,
    muralla: 120,
    atarazana: 120,
    'acequia-mayor': 120,
  },
  porTramoDeCamino: 15,
  // Lo que distingue a una casa vale ahora lo que cuesta lograrlo: una feria destacada, un anyo
  // trashumante entero o una comarca con aperos de sobra no pueden valer menos que ocupar tierra.
  porFeriaDestacada: 60,
  volumenDeFeriaDestacada: 500,
  porPrimicia: 50,
  // Abrir camino es de las pocas cosas que hacen todas las casas, tambien las que no crecen.
  porComarcaExplorada: 8,
  // Cuenta cada rebanyo, y una Mesta que trashuma lleva hasta cinco: a 30, en cuanto su via
  // funciono (T-058) paso del 300 % de la mediana con la ganaderia como tres cuartas partes de su
  // prestigio. A 10 queda entre el 103 % y el 165 % (T-047).
  porAnyoTrashumante: 10,
  // Un rebanyo quieto en la sierra se queda en torno a 580 milesimas; el ciclo completo pasa de 750.
  calidadDeAnyoTrashumanteMil: 750,
  porAperosAltos: 25,
  nivelDeAperosAltos: 3,
  reservaDeDespensaEstable: 60,
  penalizacionPorComarcaPerdida: 20,
  penalizacionPorEscasez: 1,
};

function hito(
  nombre: string,
  condicion: string,
  umbral: number,
  prestigio: number,
  pendienteDe: string | null = null,
): DatosHito {
  return {
    nombre,
    condicion,
    umbral,
    prestigio,
    desactivado: pendienteDe !== null,
    pendienteDe,
  };
}

export const DATOS_DE_HITOS: Readonly<Record<Hito, DatosHito>> = {
  'primer-horizonte': hito('Primer horizonte', 'Explorar la primera comarca', 1, 10),
  'despensa-estable': hito(
    'Despensa estable',
    'Tres turnos seguidos sin perder pan y con 60 o más en el almacén',
    3,
    15,
  ),
  villa: hito('Un pueblo que prospera', 'La capital llega a villa: 150 vecinos', 150, 20),
  'mas-alla-del-origen': hito(
    'Más allá del origen',
    'Una comarca más que la de origen, incorporada o fundada como puebla',
    2,
    20,
  ),
  'pequenyo-dominio': hito('Un pequeño dominio', 'Tres comarcas administradas', 3, 30),
  'anyo-redondo': hito(
    'Año redondo',
    'Un rebaño esquila con una calidad del año del 90 % o más',
    900,
    30,
  ),
  'maestro-de-obra': hito('Maestro de obra', 'Terminar la primera obra mayor', 1, 40),
  'camino-abierto': hito('Camino abierto', 'Terminar la primera calzada', 1, 30),
  'buen-nombre': hito(
    'Buen nombre',
    'Crédito de 80 o más con al menos tres contratos cumplidos',
    80,
    40,
    'T-103',
  ),
  'senyor-de-ferias': hito(
    'Señor de ferias',
    '1 000 maravedís de volumen propio en ferias en un mismo año',
    1000,
    40,
  ),
  ciudad: hito('Ciudad', 'La capital llega a 260 vecinos', 260, 50),
  'casa-conocida': hito('Casa conocida', 'Alcanzar 1 000 de prestigio', 1000, 50),
};
