// El informe y sus alertas de salud (ficha T-046 §4.4 y §4.5), con partidas hechas a mano para
// que cada alerta salte, o no, por lo que tiene que saltar. Y el comando `comparar`.
import { describe, expect, it } from 'vitest';

import { mundoMini } from '../../../paquetes/nucleo/pruebas/mundo-mini.ts';
import { componerComparacion, diferencias, leerCsv } from './comparar.ts';
import { SALUD, alertasDeSalud, componerCsv, componerInforme } from './informe.ts';
import type { PrecioPegado } from './metricas.ts';
import type { Extras, Jugada } from './partidas-de-prueba.ts';
import { manifiesto, partida, resultado as resultadoDe } from './partidas-de-prueba.ts';

const TURNOS = 20;

function unaPartida(jugadas: readonly Jugada[], extra: Extras = {}) {
  return resultadoDe([partida(jugadas, { turnos: TURNOS, ...extra })]);
}

const SANAS: readonly Jugada[] = [
  { casa: 'mesta', prestigio: 100 },
  { casa: 'ferrones', prestigio: 105 },
  { casa: 'canteros', prestigio: 95 },
];

describe('las alertas de salud', () => {
  it('en una partida sana, las cinco en verde', () => {
    const alertas = alertasDeSalud(unaPartida(SANAS), mundoMini());
    expect(alertas).toHaveLength(5);
    expect(alertas.filter((a) => a.enRojo)).toEqual([]);
  });

  it('marca la casa fuera de la horquilla de la mediana', () => {
    const jugadas = [...SANAS, { casa: 'monjes' as const, prestigio: 300 }];
    const [horquilla] = alertasDeSalud(unaPartida(jugadas), mundoMini());
    expect(horquilla?.enRojo).toBe(true);
    // La mediana de 95, 100, 105 y 300 es 102,5, que se redondea a 103.
    expect(horquilla?.detalle).toEqual(['Monjes: 291,3 %']);
  });

  it('marca más de un 10 % de turnos sin proponer órdenes, y no un 10 % justo', () => {
    const justo = SANAS.map((j) => (j.casa === 'mesta' ? { ...j, sinOrdenes: 2 } : j));
    expect(alertasDeSalud(unaPartida(justo), mundoMini())[1]?.enRojo).toBe(false);
    const pasado = SANAS.map((j) => (j.casa === 'mesta' ? { ...j, sinOrdenes: 3 } : j));
    const alerta = alertasDeSalud(unaPartida(pasado), mundoMini())[1];
    expect(alerta?.enRojo).toBe(true);
    expect(alerta?.detalle).toEqual(['Mesta: 15,0 %']);
  });

  it('marca la escasez crónica, por encima del 20 % de los turnos', () => {
    expect(SALUD.escasezCronicaPct).toBe(20);
    const cronica = SANAS.map((j) => (j.casa === 'ferrones' ? { ...j, escasez: 5 } : j));
    const alerta = alertasDeSalud(unaPartida(cronica), mundoMini())[2];
    expect(alerta?.enRojo).toBe(true);
    expect(alerta?.detalle[0]).toContain('Ferrones');
  });

  it('marca los precios pegados más de 20 turnos', () => {
    const pegados: PrecioPegado[] = [
      { mercado: 'local-a', recurso: 'lana', extremo: 'suelo', turnos: 21 },
      { mercado: 'local-b', recurso: 'sal', extremo: 'techo', turnos: 20 },
    ];
    const alerta = alertasDeSalud(unaPartida(SANAS, { preciosPegados: pegados }), mundoMini())[3];
    expect(alerta?.enRojo).toBe(true);
    expect(alerta?.detalle).toEqual(['local-a, lana: 21 turnos en el suelo']);
  });

  it('marca la tierra muerta: comarcas que nadie toca en ninguna partida', () => {
    const alerta = alertasDeSalud(
      unaPartida(SANAS, { tocadas: ['prueba-llano', 'prueba-vega'] }),
      mundoMini(),
    )[4];
    expect(alerta?.enRojo).toBe(true);
    expect(alerta?.detalle[0]).toMatch(/^\d+ de \d+ comarcas$/);
  });

  it('el informe las enseña todas, en rojo o en verde, con su resumen legible', () => {
    const conMonjes = unaPartida([...SANAS, { casa: 'monjes', prestigio: 300 }]);
    const texto = componerInforme(conMonjes, mundoMini(), manifiesto(conMonjes));
    for (const seccion of [
      '## Resumen',
      '## Procedencia',
      '## Evaluación de los criterios de T-047',
      '## Salud del juego (diagnóstico antiguo)',
      '## Ritmo: hitos y primera obra mayor',
      '## Arbitraje con traza',
      '## Órdenes',
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
  const antes = componerCsv(unaPartida(SANAS));
  const despues = componerCsv(
    unaPartida(SANAS.map((j) => (j.casa === 'mesta' ? { ...j, prestigio: 150 } : j))),
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
