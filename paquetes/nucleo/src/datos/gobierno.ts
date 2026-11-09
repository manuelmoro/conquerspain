// Lo que hace cada decision de gobierno, en palabras del jugador (ficha T-089 §4.2; docs/03 §3.6,
// §3.9 y §3.11). Es texto de interfaz, pero vive aqui porque la ficha se compone en el nucleo.
import type { CargaFiscal, Fuero } from '../tipos/estado.ts';
import type { TipoObraMayor } from '../tipos/reglas.ts';

export const TITULO_DE_FUERO: Readonly<Record<Fuero, string>> = {
  ninguno: 'Quitar el fuero',
  'carta puebla': 'Dar carta puebla',
  fuero: 'Dar fuero',
};

export const EFECTO_DE_FUERO: Readonly<Record<Fuero, string>> = {
  ninguno:
    'Vuelve a pagar la administración y los impuestos enteros; quitar un fuero pleno cuesta 20 de lealtad',
  'carta puebla':
    'Administración al 75 % e impuestos al 70 %; +2 de lealtad por turno y +20 % de crecimiento',
  fuero:
    'Administración e impuestos a la mitad; +3 de lealtad por turno (hasta 90) y una cuadrilla más',
};

export const EFECTO_DE_CARGA: Readonly<Record<CargaFiscal, string>> = {
  ligera: 'Menos impuestos; +2 de lealtad por turno',
  normal: 'Los impuestos de siempre; la lealtad no se mueve por esto',
  dura: 'Más impuestos; −3 de lealtad por turno',
};

export const EFECTO_DE_DEHESA = {
  acotar:
    'El monte se agota a la mitad, a cambio de un 25 % menos de madera; roturar cuesta el doble',
  levantar: 'Vuelve la madera entera, y el monte se agota a su paso de siempre',
} as const;

export const EFECTO_DE_OBRA_MAYOR: Readonly<Record<TipoObraMayor, string>> = {
  puente: 'El vado deja de costar dos jornadas y el tramo no se corta por crecida',
  calzada: 'El tramo se anda a la mitad y nunca se cierra por nieve',
  monasterio: '+20 % de crecimiento aquí y en las vecinas; roturar gratis y una cuadrilla más',
  catedral:
    'Mucho prestigio; +2 de lealtad por turno en tus comarcas de la región y 12 mrs de peregrinos',
  muralla: 'Protege del bandidaje y da +15 de lealtad; hace falta para ser ciudad',
  atarazana: 'Abre el comercio marítimo de larga distancia (llega en una fase posterior)',
  'acequia-mayor': '+50 % de labor en la comarca y sin la penalización de la estación',
};

export const EFECTO_DE_TRASLADO =
  'La corte se muda aquí en 10 turnos; mientras, la administración cuesta un 25 % más';
