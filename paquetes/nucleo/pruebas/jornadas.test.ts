// Tabla de casos de `jornadasDeTramo` (docs/03-economia.md §3.7.2 y ficha T-013 §4.5).
import { describe, expect, it } from 'vitest';

import { tablasDeEjemplo } from './ejemplos.ts';
import type { CalidadCamino, Camino, Estacion, IdComarca, Terreno } from '../src/index.ts';
import { JORNADAS_DE_PUERTO, explicar, jornadasDeTramo, validarTablas } from '../src/index.ts';

const validadas = validarTablas(tablasDeEjemplo());
if (!validadas.ok) throw new Error(explicar(validadas.errores));
const reglas = validadas.valor;

function tramo(cambios: Partial<Camino> = {}): Camino {
  return {
    desde: 'una' as IdComarca,
    hasta: 'otra' as IdComarca,
    terreno: 'llano',
    jornadasBase: 2,
    vado: false,
    puertoDeMontanya: null,
    cierraEnInvierno: false,
    canyada: null,
    calzadaRomana: false,
    ...cambios,
  };
}

interface Caso {
  readonly que: string;
  readonly terreno?: Terreno;
  readonly camino?: Partial<Camino>;
  readonly estacion: Estacion;
  readonly calidad: CalidadCamino;
  readonly barro?: boolean;
  readonly puente?: boolean;
  readonly espera: number | 'cerrado';
}

const CASOS: readonly Caso[] = [
  { que: 'llano por vereda en primavera', estacion: 'primavera', calidad: 'vereda', espera: 2 },
  { que: 'llano por vereda en verano (-10 %)', estacion: 'verano', calidad: 'vereda', espera: 1 },
  {
    que: 'ondulado por vereda en primavera',
    terreno: 'ondulado',
    estacion: 'primavera',
    calidad: 'vereda',
    espera: 3,
  },
  {
    que: 'ondulado por camino carretero (65 %)',
    terreno: 'ondulado',
    estacion: 'primavera',
    calidad: 'carretero',
    espera: 1,
  },
  {
    que: 'sierra por vereda en primavera',
    terreno: 'sierra',
    estacion: 'primavera',
    calidad: 'vereda',
    espera: 5,
  },
  {
    que: 'sierra por vereda en invierno (+50 % de nieve)',
    terreno: 'sierra',
    estacion: 'invierno',
    calidad: 'vereda',
    espera: 7,
  },
  {
    que: 'sierra por herradura en turno de barro (+25 %)',
    terreno: 'sierra',
    estacion: 'otonyo',
    calidad: 'herradura',
    barro: true,
    espera: 5,
  },
  {
    que: 'puerto de montanya en verano',
    camino: { puertoDeMontanya: 'Puerto de Piqueras', terreno: 'sierra', cierraEnInvierno: true },
    estacion: 'verano',
    calidad: 'vereda',
    espera: 6,
  },
  {
    que: 'puerto de montanya cerrado en invierno',
    camino: { puertoDeMontanya: 'Puerto de Piqueras', terreno: 'sierra', cierraEnInvierno: true },
    estacion: 'invierno',
    calidad: 'vereda',
    espera: 'cerrado',
  },
  {
    que: 'puerto con calzada romana: abierto en invierno, pero caro',
    camino: {
      puertoDeMontanya: 'Puerto del Pico',
      terreno: 'sierra',
      calzadaRomana: true,
      cierraEnInvierno: true,
    },
    estacion: 'invierno',
    calidad: 'vereda',
    espera: 10,
  },
  {
    que: 'puerto con calidad de calzada: abierto y rapido',
    camino: { puertoDeMontanya: 'Somosierra', terreno: 'sierra', cierraEnInvierno: true },
    estacion: 'invierno',
    calidad: 'calzada',
    espera: 5,
  },
  {
    que: 'vado sin puente suma dos jornadas',
    camino: { vado: true },
    estacion: 'primavera',
    calidad: 'vereda',
    espera: 4,
  },
  {
    que: 'vado con puente no suma nada',
    camino: { vado: true },
    estacion: 'primavera',
    calidad: 'vereda',
    puente: true,
    espera: 2,
  },
  {
    que: 'vado con calzada: la calzada lleva puente',
    camino: { vado: true, calzadaRomana: true },
    estacion: 'primavera',
    calidad: 'carretero',
    espera: 1,
  },
  {
    que: 'vega por calzada en verano nunca baja de una jornada',
    terreno: 'vega',
    estacion: 'verano',
    calidad: 'calzada',
    espera: 1,
  },
];

describe('jornadasDeTramo', () => {
  it.each(CASOS)('$que', (caso) => {
    const camino = tramo({ terreno: caso.terreno ?? 'llano', ...caso.camino });
    const opciones = {
      ...(caso.barro === undefined ? {} : { barro: caso.barro }),
      ...(caso.puente === undefined ? {} : { puente: caso.puente }),
    };
    const coste = jornadasDeTramo(camino, caso.estacion, caso.calidad, reglas, opciones);
    expect(coste).toBe(caso.espera);
  });

  it('es pura: la misma pregunta da siempre la misma respuesta', () => {
    const camino = tramo({ terreno: 'sierra', puertoDeMontanya: 'Pajares' });
    const uno = jornadasDeTramo(camino, 'otonyo', 'herradura', reglas);
    const dos = jornadasDeTramo(camino, 'otonyo', 'herradura', reglas);
    expect(uno).toBe(dos);
    // 7 jornadas por 800 milesimas = 5,6, y el motor trunca: 5. Nunca hay medias jornadas.
    expect(uno).toBe(5);
  });

  it('un puerto cuesta lo mismo suba de llano o de sierra', () => {
    const deLlano = tramo({ terreno: 'llano', puertoDeMontanya: 'Despenyaperros' });
    const deSierra = tramo({ terreno: 'sierra', puertoDeMontanya: 'Despenyaperros' });
    expect(jornadasDeTramo(deLlano, 'primavera', 'vereda', reglas)).toBe(JORNADAS_DE_PUERTO);
    expect(jornadasDeTramo(deSierra, 'primavera', 'vereda', reglas)).toBe(JORNADAS_DE_PUERTO);
  });
});
