// El marcador y los hitos (docs/06-competicion.md §6.3; ficha T-043).
//
// El prestigio mide lo que se deja hecho, no lo que se acumula: por eso no hay ni un punto por
// almacen. Los hitos no dan recursos, solo prestigio y una linea en la cronica; el primero de la
// partida en lograr cada uno se lleva la primicia.
import type { DatosHito, DatosPrestigio, Hito } from '../tipos/reglas.ts';

export const PRESTIGIO: DatosPrestigio = {
  porCadaCincoVecinos: 1,
  porComarca: 20,
  // Una comarca con fuero vale 30 en lugar de 20 (docs/06: «20, +10 si tiene fuero»).
  porComarcaConFuero: 30,
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
  porFeriaDestacada: 30,
  volumenDeFeriaDestacada: 500,
  porPrimicia: 50,
  porComarcaExplorada: 3,
  porAnyoTrashumante: 10,
  // Un rebanyo quieto en la sierra se queda en torno a 580 milesimas; el ciclo completo pasa de 750.
  calidadDeAnyoTrashumanteMil: 750,
  porAperosAltos: 10,
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
