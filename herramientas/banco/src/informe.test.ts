// El informe y sus alertas de salud (ficha T-046 §4.4 y §4.5), con partidas hechas a mano para
// que cada alerta salte, o no, por lo que tiene que saltar. Y el comando `comparar`.
import { describe, expect, it } from 'vitest';

import type { Casa, IdJugador } from '@conquer/nucleo';

import { mundoMini } from '../../../paquetes/nucleo/pruebas/mundo-mini.ts';
import { componerComparacion, diferencias, leerCsv } from './comparar.ts';
import type { ResultadoDelBanco } from './ejecutar.ts';
import { SALUD, alertasDeSalud, componerCsv, componerInforme } from './informe.ts';
import type {
  FilaDeTurno,
  MetricasDeJugador,
  MetricasDePartida,
  PrecioPegado,
} from './metricas.ts';

const CERO = { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 };
const CAPITULOS = {
  poblacion: 0,
  territorio: 0,
  obras: 0,
  caminos: 0,
  comercio: 0,
  exploracion: 0,
  ganaderia: 0,
  industria: 0,
  hitos: 0,
};

function fila(turno: number, cambios: Partial<FilaDeTurno> = {}): FilaDeTurno {
  return {
    turno,
    prestigio: 0,
    capitulos: CAPITULOS,
    penalizaciones: 0,
    poblacion: 60,
    comarcas: 1,
    almacen: CERO,
    escasez: false,
    produccion: CERO,
    obrasTerminadas: 0,
    obrasMayoresTerminadas: 0,
    jornadasMil: 0,
    volumenComerciado: 0,
    volumenEnRuta: 0,
    porEdificio: {},
    ingresosDeFeria: 0,
    lanaEsquilada: 0,
    pueblasFundadas: 0,
    comarcasIncorporadas: 0,
    decidio: true,
    sinDecision: false,
    ...cambios,
  };
}

interface Jugada {
  readonly casa: Casa;
  readonly prestigio: number;
  readonly sinDecision?: number;
  readonly escasez?: number;
}

const TURNOS = 20;

function partida(
  jugadas: readonly Jugada[],
  extra: { preciosPegados?: PrecioPegado[]; tocadas?: string[] } = {},
): MetricasDePartida {
  const jugadores: MetricasDeJugador[] = jugadas.map((j) => ({
    jugador: j.casa as string as IdJugador,
    casa: j.casa,
    compras: [],
    ventas: [],
    filas: Array.from({ length: TURNOS }, (_, i) =>
      fila(i + 1, {
        prestigio: i === TURNOS - 1 ? j.prestigio : 0,
        sinDecision: i < (j.sinDecision ?? 0),
        escasez: i < (j.escasez ?? 0),
      }),
    ),
  }));
  return {
    semilla: 'prueba',
    turnos: TURNOS,
    cadencia: 1,
    jugadores,
    puestos: Object.fromEntries(jugadas.map((j, i) => [j.casa, i + 1])),
    primicias: {},
    preciosPegados: extra.preciosPegados ?? [],
    comarcasTocadas: extra.tocadas ?? Object.keys(mundoMini().comarcas),
    huellaFinal: 'huella',
  };
}

function resultado(p: MetricasDePartida): ResultadoDelBanco {
  return {
    opciones: {
      semilla: 'prueba',
      turnos: TURNOS,
      casas: p.jugadores.map((j) => j.casa),
      repeticiones: 1,
      escenario: 'normal',
      ausencia: false,
      estados: null,
    },
    partidas: [p],
    ausentes: [],
  };
}

const SANAS: readonly Jugada[] = [
  { casa: 'mesta', prestigio: 100 },
  { casa: 'ferrones', prestigio: 105 },
  { casa: 'canteros', prestigio: 95 },
];

describe('las alertas de salud', () => {
  it('en una partida sana, las cinco en verde', () => {
    const alertas = alertasDeSalud(resultado(partida(SANAS)), mundoMini());
    expect(alertas).toHaveLength(5);
    expect(alertas.filter((a) => a.enRojo)).toEqual([]);
  });

  it('marca la casa fuera de la horquilla de la mediana', () => {
    const jugadas = [...SANAS, { casa: 'monjes' as const, prestigio: 300 }];
    const [horquilla] = alertasDeSalud(resultado(partida(jugadas)), mundoMini());
    expect(horquilla?.enRojo).toBe(true);
    // La mediana de 95, 100, 105 y 300 es 102,5, que se redondea a 103.
    expect(horquilla?.detalle).toEqual(['Monjes: 291,3 %']);
  });

  it('marca más de un 10 % de turnos sin decisión útil, y no un 10 % justo', () => {
    const justo = SANAS.map((j) => (j.casa === 'mesta' ? { ...j, sinDecision: 2 } : j));
    expect(alertasDeSalud(resultado(partida(justo)), mundoMini())[1]?.enRojo).toBe(false);
    const pasado = SANAS.map((j) => (j.casa === 'mesta' ? { ...j, sinDecision: 3 } : j));
    const alerta = alertasDeSalud(resultado(partida(pasado)), mundoMini())[1];
    expect(alerta?.enRojo).toBe(true);
    expect(alerta?.detalle).toEqual(['Mesta: 15,0 %']);
  });

  it('marca la escasez crónica, por encima del 20 % de los turnos', () => {
    expect(SALUD.escasezCronicaPct).toBe(20);
    const cronica = SANAS.map((j) => (j.casa === 'ferrones' ? { ...j, escasez: 5 } : j));
    const alerta = alertasDeSalud(resultado(partida(cronica)), mundoMini())[2];
    expect(alerta?.enRojo).toBe(true);
    expect(alerta?.detalle[0]).toContain('Ferrones');
  });

  it('marca los precios pegados más de 20 turnos', () => {
    const pegados: PrecioPegado[] = [
      { mercado: 'local-a', recurso: 'lana', extremo: 'suelo', turnos: 21 },
      { mercado: 'local-b', recurso: 'sal', extremo: 'techo', turnos: 20 },
    ];
    const alerta = alertasDeSalud(
      resultado(partida(SANAS, { preciosPegados: pegados })),
      mundoMini(),
    )[3];
    expect(alerta?.enRojo).toBe(true);
    expect(alerta?.detalle).toEqual(['local-a, lana: 21 turnos en el suelo']);
  });

  it('marca la tierra muerta: comarcas que nadie toca en ninguna partida', () => {
    const alerta = alertasDeSalud(
      resultado(partida(SANAS, { tocadas: ['prueba-llano', 'prueba-vega'] })),
      mundoMini(),
    )[4];
    expect(alerta?.enRojo).toBe(true);
    expect(alerta?.detalle[0]).toMatch(/^\d+ de \d+ comarcas$/);
  });

  it('el informe las enseña todas, en rojo o en verde, con su resumen legible', () => {
    const texto = componerInforme(
      resultado(partida([...SANAS, { casa: 'monjes', prestigio: 300 }])),
      mundoMini(),
    );
    for (const seccion of [
      '## Resumen',
      '## Salud del juego',
      '## Clasificación final',
      '## La vía de cada casa',
      '## Jugar sin estar',
      '## Huellas',
    ]) {
      expect(texto).toContain(seccion);
    }
    expect(texto.match(/^- (🔴|🟢)/gmu)).toHaveLength(5);
    expect(texto).toContain('**Monjes** va en cabeza con 300 de prestigio');
  });
});

describe('comparar dos informes', () => {
  const antes = componerCsv(resultado(partida(SANAS)));
  const despues = componerCsv(
    resultado(partida(SANAS.map((j) => (j.casa === 'mesta' ? { ...j, prestigio: 150 } : j)))),
  );

  it('lee el CSV del banco y rechaza el de turnos con un mensaje claro', () => {
    expect(leerCsv(antes, 'a.csv').get('mesta|prestigio')).toBe(100);
    expect(() => leerCsv('semilla,turno,casa\n', 'turnos.csv')).toThrow(/casa,metrica,valor/);
    expect(() => leerCsv('casa,metrica,valor\nmesta,prestigio,mucho\n', 'a.csv')).toThrow(
      /linea 2/,
    );
  });

  it('enseña solo lo que cambia, con la diferencia y el tanto por ciento', () => {
    const lista = diferencias(leerCsv(antes, 'a'), leerCsv(despues, 'b'));
    expect(lista).toContainEqual({ casa: 'mesta', metrica: 'prestigio', antes: 100, despues: 150 });
    expect(lista.every((d) => d.antes !== d.despues)).toBe(true);
    const texto = componerComparacion('a.csv', 'b.csv', lista);
    expect(texto).toContain('| mesta | prestigio | 100 | 150 | +50 (+50,0 %) |');
  });

  it('dice que no cambia nada cuando no cambia nada', () => {
    const lista = diferencias(leerCsv(antes, 'a'), leerCsv(antes, 'b'));
    expect(componerComparacion('a.csv', 'b.csv', lista)).toContain('exactamente las mismas cifras');
  });
});
