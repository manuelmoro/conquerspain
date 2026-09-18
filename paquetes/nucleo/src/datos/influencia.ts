// Cifras de la influencia y de la incorporacion de comarcas (docs/06-competicion.md §6.2;
// ficha T-038).
import type { DatosInfluencia } from '../tipos/reglas.ts';

export const INFLUENCIA: DatosInfluencia = {
  // Las fuentes de cada turno.
  porPresencia: 2,
  porComarcaVecina: 1,
  maximoPorComarcasVecinas: 3,
  porMercadoVecino: 1,
  maravedisPorBloqueDeComercio: 50,
  porBloqueDeComercio: 1,
  maximoPorComercio: 3,
  porMonasterio: 2,
  porCamino: 1,
  // El regalo al concejo: 5 puntos de golpe por 50 mrs, una vez cada 4 turnos.
  porRegalo: 5,
  costeRegalo: 50,
  turnosEntreRegalos: 4,
  // Lo que se pierde: un punto por turno sin presencia ni comercio y cinco por vaciar el pan.
  desgastePorTurno: 1,
  desgastePorEscasez: 5,
  // Incorporar: 60 de influencia y 15 de ventaja, a seis jornadas del dominio, en tres turnos.
  minimaParaIncorporar: 60,
  ventajaSobreElSegundo: 15,
  jornadasMaximasDesdeElDominio: 6,
  costeIncorporar: { pan: 40, madera: 0, piedra: 0, maravedis: 30, sal: 0, hierro: 0, lana: 0 },
  turnosIncorporar: 3,
};
