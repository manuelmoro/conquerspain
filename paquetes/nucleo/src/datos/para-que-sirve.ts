// Para que sirve cada edificio, en una linea (docs/03 §3.2; T-092). Es texto de interfaz, pero vive aqui,
// como los bloqueos, porque la ficha lo usa de efecto cuando un edificio no cambia ningun recurso.
import type { TipoEdificio } from '../tipos/reglas.ts';

export const PARA_QUE_SIRVE: Readonly<Record<TipoEdificio, string>> = {
  granja: 'Campos de cereal: da pan, más o menos según la estación.',
  huerta: 'Regadío pegado al pueblo: da pan sin depender de la estación.',
  molino: 'Muele el grano: más pan de las granjas de la comarca.',
  granero: 'Guarda el grano: se pudre menos y cabe más en el almacén.',
  aserradero: 'Tala el monte: da madera, y el monte se va agotando.',
  carbonera: 'Quema madera para hacer carbón, que piden las ferrerías.',
  cantera: 'Saca piedra para obras y edificios; la veta se agota.',
  ferreria: 'Funde el hierro de la comarca; consume carbón.',
  salina: 'Evapora agua salada: da sal, que se vende cara.',
  majada: 'Corrales y pasto: un rebaño puede invernar aquí.',
  lonja: 'Lonja de pescado: da pan del mar y gasta algo de sal.',
  mercado: 'Plaza del pueblo: da maravedís y abre el comercio local.',
  venta: 'Posada del camino: abre plaza y cobra a quien pasa.',
  casas: 'Viviendas: más sitio para vecinos, y con ellos más brazos.',
  cerca: 'Muralla de piedra: la comarca es más leal y está más segura.',
  acequia: 'Canal de riego: la tierra de labor rinde más.',
};
