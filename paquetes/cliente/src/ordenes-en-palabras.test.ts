// Las órdenes en palabras (T-093): cada una en una frase, en su grupo, y lo que espera con su porqué.
import { describe, expect, it } from 'vitest';

import { recursosSegun } from '@conquer/nucleo';
import type {
  IdComarca,
  IdJugador,
  IdMercado,
  IdOrden,
  IdRecua,
  Orden,
  OrdenBase,
  Recua,
} from '@conquer/nucleo';

import { agruparOrdenes, fraseDeOrden } from './ordenes-en-palabras.ts';
import { lineasDeRecua } from './recuas.ts';

function base(
  id: string,
  estado: OrdenBase['estado'] = 'pendiente',
  motivo: string | null = null,
): OrdenBase {
  return {
    id: id as IdOrden,
    jugador: 'mesta' as IdJugador,
    turnoAlta: 3,
    estado,
    coste: recursosSegun(() => 0),
    turnosTotales: 1,
    turnosHechos: 0,
    motivoEspera: motivo,
    delMayordomo: false,
    turnoProgramado: null,
    cola: null,
  };
}

const BURGOS = 'burgos' as IdComarca;
const ODRA = 'odra' as IdComarca;

const compra: Orden = {
  ...base('o-1', 'en espera', 'recua-lejos'),
  tipo: 'mercado',
  mercado: 'local-burgos' as IdMercado,
  recua: 'recua-2' as IdRecua,
  recurso: 'pan',
  operacion: 'comprar',
  cantidad: 10,
  precioLimiteMil: 3000,
};
const regalo: Orden = { ...base('o-2'), tipo: 'regalo', comarca: ODRA };

const nombres = {
  comarca: (id: string) => ({ burgos: 'Alfoz de Burgos', odra: 'Odra-Pisuerga' })[id] ?? id,
  unidad: () => 'Recua de Burgos',
  orden: (id: string) => (id === 'o-1' ? compra : undefined),
};

describe('las órdenes en palabras', () => {
  it('cada tipo en una frase que se entiende', () => {
    expect(fraseDeOrden(compra, nombres)).toBe(
      'Comprar 10 de pan en la plaza de Alfoz de Burgos (pagando hasta 3 mrs), con Recua de Burgos',
    );
    expect(fraseDeOrden(regalo, nombres)).toBe('Regalo al concejo de Odra-Pisuerga');
    expect(
      fraseDeOrden({ ...base('o-3'), tipo: 'anular', orden: 'o-1' as IdOrden }, nombres),
    ).toMatch(/^Anular: Comprar 10 de pan/);
    expect(
      fraseDeOrden(
        { ...base('o-4'), tipo: 'construir', comarca: BURGOS, edificio: 'granja' },
        nombres,
      ),
    ).toBe('Construir o ampliar granja en Alfoz de Burgos');
    expect(
      fraseDeOrden(
        {
          ...base('o-7'),
          tipo: 'carga',
          recua: 'recua-2' as IdRecua,
          cargar: { maravedis: 34 },
          descargar: { pan: 10 },
          vecinosCargados: 0,
        },
        nombres,
      ),
    ).toBe('Recua de Burgos: cargar 34 de maravedís y descargar 10 de pan al almacén');
  });

  it('tres grupos: lo de este turno, lo que espera (con su porqué y anulable) y lo que va en marcha', () => {
    const obra: Orden = { ...base('o-5', 'en curso'), tipo: 'roturar', comarca: BURGOS };
    const g = agruparOrdenes([{ ...regalo, id: 'o-6' as IdOrden }], [compra, obra], nombres);
    expect(g.paraEsteTurno.map((o) => o.id)).toEqual(['o-6']);
    expect(g.esperando).toEqual([
      expect.objectContaining({
        id: 'o-1',
        espera: 'la recua no está en esa plaza',
        anulable: true,
      }),
    ]);
    expect(g.esperando[0]?.queHacer).toMatch(/dale ruta/);
    expect(g.enMarcha.map((o) => [o.id, o.anulable])).toEqual([['o-5', false]]);
  });
});

describe('una recua en palabras', () => {
  const recua: Recua = {
    id: 'recua-2' as IdRecua,
    jugador: 'mesta' as IdJugador,
    nombre: 'Recua de Burgos',
    situacion: { donde: 'camino', desde: BURGOS, hasta: ODRA, jornadasHechasMil: 1000 },
    ruta: [ODRA, BURGOS],
    rutaCircular: true,
    paradas: [],
    siguienteParada: 0,
    enParada: null,
    acemilas: 10,
    porte: 10,
    carga: { ...recursosSegun(() => 0), pan: 3, maravedis: 12 },
    vecinos: 0,
    cometido: 'tratar',
    turnosDeCometido: 0,
    avisadaSinBastimento: false,
    enExpedicion: false,
    fallosDePrecio: 0,
  };

  it('dónde está, su ruta, su encargo, lo que lleva y lo que la espera', () => {
    const lineas = lineasDeRecua(recua, [compra], nombres.comarca).map(
      (l) => `${l.icono} ${l.texto}`,
    );
    expect(lineas).toEqual([
      '🚶 De camino: de Alfoz de Burgos a Odra-Pisuerga.',
      '➡️ Ruta: Odra-Pisuerga → Alfoz de Burgos, y vuelta a empezar.',
      '🎯 Encargo: comprar y vender en las plazas donde para.',
      '📦 Lleva 3 de pan y 12 maravedís para pagar (le caben 10).',
      '⏳ Una orden suya espera: mira «Esperando» en tus órdenes.',
    ]);
  });
});
