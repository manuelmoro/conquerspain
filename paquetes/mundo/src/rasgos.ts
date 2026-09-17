// Catalogo cerrado de rasgos de comarca. Anyadir un rasgo nuevo obliga a tocar este archivo,
// docs/05-geografia.md §5.5 y la tarea que lo use: asi ningun rasgo entra sin efecto.
import type { Rasgo } from '@conquer/nucleo';
import { RASGOS } from '@conquer/nucleo';

export interface DatosRasgo {
  readonly nombre: string;
  /** Que hace en el juego. Si un rasgo no cambia una decision, sobra. */
  readonly efecto: string;
}

export const DATOS_RASGOS: Readonly<Record<Rasgo, DatosRasgo>> = {
  'salinas-historicas': {
    nombre: 'Salinas historicas',
    efecto: 'Permite salina de nivel alto; +1 al potencial efectivo de sal',
  },
  'vena-de-hierro': {
    nombre: 'Vena de hierro',
    efecto: 'Permite ferreria de nivel alto; el hierro se agota la mitad de rapido',
  },
  'ferreria-de-agua': { nombre: 'Ferreria de agua', efecto: 'Las ferrerias cuestan un 25 % menos' },
  'cantera-noble': {
    nombre: 'Cantera noble',
    efecto: 'Obras mayores un 15 % mas baratas y con mas prestigio',
  },
  'pinar-maderable': { nombre: 'Pinar maderable', efecto: 'Aserraderos con un nivel maximo mas' },
  'pasto-de-verano': {
    nombre: 'Pasto de verano',
    efecto: 'Valido para rebanyos de mayo a septiembre',
  },
  'pasto-de-invierno': {
    nombre: 'Pasto de invierno',
    efecto: 'Valido para rebanyos de octubre a abril',
  },
  dehesa: {
    nombre: 'Dehesa',
    efecto: 'Pasto de invierno; el monte se agota a la mitad y roturar cuesta el doble',
  },
  marisma: { nombre: 'Marisma', efecto: 'Sal y pesca; la labor rinde menos' },
  'vega-fluvial': {
    nombre: 'Vega fluvial',
    efecto: 'Permite acequia; la estacion afecta la mitad al pan',
  },
  'ciudad-episcopal': {
    nombre: 'Ciudad episcopal',
    efecto: 'Requisito de catedral; +10 de lealtad de partida',
  },
  'villa-de-feria': { nombre: 'Villa de feria', efecto: 'Tiene derecho de feria' },
  'puerto-de-mar': {
    nombre: 'Puerto de mar',
    efecto: 'Requisito de atarazana y del comercio maritimo',
  },
  'camino-de-santiago': {
    nombre: 'Camino de Santiago',
    efecto: 'Ingresos por peregrinos y rumores mas frecuentes',
  },
  'calzada-romana': {
    nombre: 'Calzada romana',
    efecto: 'Sus tramos empiezan con calidad de camino carretero',
  },
  vinyedo: { nombre: 'Vinyedo', efecto: 'Permite bodega; pequenyo ingreso en maravedis' },
  montado: { nombre: 'Montado', efecto: 'Dehesa alentejana: pasto de invierno y monte protegido' },
};

export function esRasgo(valor: string): valor is Rasgo {
  return RASGOS.some((rasgo) => rasgo === valor);
}
