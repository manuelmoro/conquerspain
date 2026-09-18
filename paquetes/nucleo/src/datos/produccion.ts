// Cifras de la cadena de produccion (docs/03-economia.md §3.2 a §3.5 y ficha T-031 §4).
// Son el punto de partida del equilibrio: se ajustan aqui, jugando, sin tocar el motor.
import type { DatosProduccion } from '../tipos/reglas.ts';

export const PRODUCCION: DatosProduccion = {
  // Potencial 0 impide la explotacion; de 1 a 5, del 60 % al 150 %.
  multiplicadorPotencialMil: [0, 600, 800, 1000, 1250, 1500],
  aperoMil: 100,
  lealtad: [
    { menorQue: 20, factorMil: 600 },
    { menorQue: 40, factorMil: 750 },
    { menorQue: 60, factorMil: 900 },
  ],
  agotamiento: {
    factorPorPuntoMil: 10,
    sueloMil: 400,
    porNivel: 2,
    maximo: 60,
    // La sal y el monte se rehacen; la piedra buena y la vena de hierro, casi no.
    regeneracion: { monte: 3, piedra: 1, hierro: 1, sal: 2 },
  },
  dehesa: { agotamientoMonteMil: 500, maderaMil: 750 },
  edificiosEstacionales: ['granja'],
  molinoMil: 250,
  maravedis: {
    porNivelMercado: 8,
    vecinosPorPunto: 10,
    cargaFiscal: { ligera: 1, normal: 2, dura: 3 },
  },
};
