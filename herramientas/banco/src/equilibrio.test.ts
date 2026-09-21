// El juez de los criterios de T-047 §5 (ficha T-048 §6).
//
// Aqui se prueba lo que mas facil es hacer mal: los bordes de cada umbral, y que una partida mala no
// desaparezca dentro de una media. Cada caso arma la partida a mano con la cifra justa.
import { describe, expect, it } from 'vitest';

import {
  OBJETIVOS,
  codigoDeEvaluacion,
  componerEvaluacion,
  componerEvaluacionCsv,
  diferenciaDeAusencia,
  enIntervalo,
  evaluarEquilibrio,
  medianaExacta,
  menorQue,
  pendientes,
  recuentoDe,
} from './equilibrio.ts';
import type { Evaluacion } from './equilibrio.ts';
import type { Jugada } from './partidas-de-prueba.ts';
import { partida, resultado } from './partidas-de-prueba.ts';

/** Los criterios numericos de T-047 §5, uno por uno. Si falta alguno, la tabla no sirve. */
const CRITERIOS = [
  'prestigio',
  'ganadores',
  'actividad',
  'decisiones útiles',
  'escasez',
  'precios',
  'tierra',
  'ausencia',
  'dominio',
  'obra mayor',
];

function filasDe(evaluacion: readonly Evaluacion[], criterio: string): Evaluacion[] {
  return evaluacion.filter((f) => f.criterio === criterio);
}

function estadoDe(evaluacion: readonly Evaluacion[], criterio: string, casa?: string): string {
  const fila = evaluacion.find(
    (f) => f.criterio === criterio && (casa === undefined || f.casa === casa),
  );
  return fila?.estado ?? 'no hay fila';
}

/** Tres casas con la mediana en 100: el banco de pruebas del propio juez. */
const MEDIANA_100: readonly Jugada[] = [
  { casa: 'mesta', prestigio: 100, dominio: 70, obraMayor: 90 },
  { casa: 'ferrones', prestigio: 100, dominio: 80, obraMayor: 100 },
  { casa: 'canteros', prestigio: 100, dominio: 90, obraMayor: 110 },
];

function unaPartida(jugadas: readonly Jugada[], extra = {}) {
  return resultado([partida(jugadas, { turnos: 200, ...extra })]);
}

describe('las comparaciones del juez', () => {
  it('la mediana es exacta y no se redondea', () => {
    expect(medianaExacta([1, 2, 3, 4])).toBe(2.5);
    expect(medianaExacta([5])).toBe(5);
    expect(medianaExacta([])).toBeNull();
  });

  it('los intervalos incluyen sus extremos y los límites sueltos son estrictos', () => {
    expect(enIntervalo(80, OBJETIVOS.prestigioPct)).toBe('cumple');
    expect(enIntervalo(120, OBJETIVOS.prestigioPct)).toBe('cumple');
    expect(enIntervalo(79.9, OBJETIVOS.prestigioPct)).toBe('incumple');
    expect(enIntervalo(120.1, OBJETIVOS.prestigioPct)).toBe('incumple');
    expect(enIntervalo(null, OBJETIVOS.prestigioPct)).toBe('no evaluable');
    expect(menorQue(9, OBJETIVOS.preciosTurnos)).toBe('cumple');
    expect(menorQue(10, OBJETIVOS.preciosTurnos)).toBe('incumple');
    expect(menorQue(OBJETIVOS.ausenciaPct, OBJETIVOS.ausenciaPct)).toBe('incumple');
  });

  it('la diferencia de ausencia se mide sobre el mayor de los dos, con suelo de uno', () => {
    expect(diferenciaDeAusencia(100, 95)).toEqual({ absoluta: 5, porcentaje: 5 });
    expect(diferenciaDeAusencia(0, 0)).toEqual({ absoluta: 0, porcentaje: 0 });
    expect(diferenciaDeAusencia(-10, 0).porcentaje).toBe(100);
  });
});

describe('la tabla de criterios', () => {
  it('trae los nueve criterios de T-047 §5, cada uno con su unidad y su ámbito', () => {
    const evaluacion = evaluarEquilibrio(unaPartida(MEDIANA_100));
    expect([...new Set(evaluacion.map((f) => f.criterio))].sort()).toEqual([...CRITERIOS].sort());
    expect(evaluacion.every((f) => f.unidad.length > 0)).toBe(true);
    expect([...new Set(evaluacion.map((f) => f.ambito))].sort()).toEqual([
      'campaña',
      'casa y partida',
      'partida',
    ]);
  });

  it('el prestigio se mide por casa y partida, no por campaña', () => {
    const evaluacion = evaluarEquilibrio(unaPartida(MEDIANA_100));
    expect(filasDe(evaluacion, 'prestigio').every((f) => f.ambito === 'casa y partida')).toBe(true);
    expect(filasDe(evaluacion, 'precios')[0]?.ambito).toBe('partida');
    expect(filasDe(evaluacion, 'ganadores')[0]?.ambito).toBe('campaña');
  });
});

describe('los bordes de cada umbral', () => {
  it('el 80 % y el 120 % de la mediana cumplen; un pelo fuera, no', () => {
    const justo = [...MEDIANA_100, { casa: 'monjes' as const, prestigio: 80 }];
    // Con cuatro casas (80, 100, 100, 100) la mediana exacta es 100.
    expect(estadoDe(evaluarEquilibrio(unaPartida(justo)), 'prestigio', 'monjes')).toBe('cumple');
    const fuera = [...MEDIANA_100, { casa: 'monjes' as const, prestigio: 79 }];
    expect(estadoDe(evaluarEquilibrio(unaPartida(fuera)), 'prestigio', 'monjes')).toBe('incumple');
    const arriba = [...MEDIANA_100, { casa: 'monjes' as const, prestigio: 121 }];
    expect(estadoDe(evaluarEquilibrio(unaPartida(arriba)), 'prestigio', 'monjes')).toBe('incumple');
  });

  it('un 10 % de turnos sin órdenes falla; un 5 %, no', () => {
    const inactiva = (turnos: number): string =>
      estadoDe(
        evaluarEquilibrio(
          resultado([
            partida(
              MEDIANA_100.map((j) => (j.casa === 'mesta' ? { ...j, sinOrdenes: turnos } : j)),
              { turnos: 200 },
            ),
          ]),
        ),
        'actividad',
        'mesta',
      );
    expect(inactiva(20)).toBe('incumple');
    expect(inactiva(19)).toBe('cumple');
  });

  it('la escasez del 2 % y del 15 % cumple; el 1 % y el 16 %, no', () => {
    const conEscasez = (turnos: number): string =>
      estadoDe(
        evaluarEquilibrio(
          resultado([
            partida(
              MEDIANA_100.map((j) => (j.casa === 'mesta' ? { ...j, escasez: turnos } : j)),
              { turnos: 100 },
            ),
          ]),
        ),
        'escasez',
        'mesta',
      );
    expect(conEscasez(2)).toBe('cumple');
    expect(conEscasez(15)).toBe('cumple');
    expect(conEscasez(1)).toBe('incumple');
    expect(conEscasez(16)).toBe('incumple');
  });

  it('diez turnos seguidos de precio en un extremo fallan; nueve, no', () => {
    const conRacha = (turnos: number): string =>
      estadoDe(
        evaluarEquilibrio(
          unaPartida(MEDIANA_100, {
            preciosPegados: [
              { mercado: 'feria-prueba', recurso: 'lana', extremo: 'suelo', turnos },
            ],
          }),
        ),
        'precios',
      );
    expect(conRacha(10)).toBe('incumple');
    expect(conRacha(9)).toBe('cumple');
  });

  it('una diferencia de ausencia del 5 % justo falla', () => {
    const conAusencia = (ausente: number): string => {
      const diligente = partida(
        MEDIANA_100.map((j) => ({ ...j, enTurno: { 100: 100, 200: 100 } })),
        { turnos: 200 },
      );
      const cada6 = partida(
        MEDIANA_100.map((j) => ({ ...j, enTurno: { 100: ausente, 200: ausente } })),
        { turnos: 200, cadencia: 6 },
      );
      return estadoDe(evaluarEquilibrio(resultado([diligente], [cada6])), 'ausencia', 'mesta');
    };
    expect(conAusencia(95)).toBe('incumple');
    expect(conAusencia(96)).toBe('cumple');
  });

  it('el ritmo incluye los extremos: T60 y T100 valen para el dominio', () => {
    const conDominio = (turno: number): string =>
      estadoDe(
        evaluarEquilibrio(unaPartida(MEDIANA_100.map((j) => ({ ...j, dominio: turno })))),
        'dominio',
      );
    expect(conDominio(60)).toBe('cumple');
    expect(conDominio(100)).toBe('cumple');
    expect(conDominio(59)).toBe('incumple');
    expect(conDominio(101)).toBe('incumple');
  });
});

describe('lo que no se puede esconder', () => {
  it('una semilla mala no desaparece dentro de la media de la campaña', () => {
    const buena = (semilla: string) => partida(MEDIANA_100, { semilla, turnos: 200 });
    const mala = partida(
      [...MEDIANA_100.slice(1), { casa: 'mesta' as const, prestigio: 300, dominio: 70 }],
      { semilla: 'mala', turnos: 200 },
    );
    const evaluacion = evaluarEquilibrio(resultado([buena('1492'), buena('1492-2'), mala]));
    const suya = evaluacion.filter((f) => f.semilla === 'mala' && f.criterio === 'prestigio');
    expect(suya.some((f) => f.estado === 'incumple')).toBe(true);
    expect(
      evaluacion
        .filter((f) => f.semilla === '1492' && f.criterio === 'prestigio')
        .every((f) => f.estado === 'cumple'),
    ).toBe(true);
  });

  it('un hito que no llega es «incumple» si dio tiempo, y «no evaluable» si la partida es corta', () => {
    const sinDominio = MEDIANA_100.map((j) => ({ ...j, dominio: null }));
    expect(estadoDe(evaluarEquilibrio(unaPartida(sinDominio)), 'dominio')).toBe('incumple');
    const corta = resultado([partida(sinDominio, { turnos: 40 })]);
    expect(estadoDe(evaluarEquilibrio(corta), 'dominio')).toBe('no evaluable');
  });

  it('una obra mayor que no termina nadie se cuenta como incumplida, no como cero', () => {
    const sinObra = MEDIANA_100.map((j) => ({ ...j, obraMayor: null }));
    const fila = filasDe(evaluarEquilibrio(unaPartida(sinObra)), 'obra mayor')[0];
    expect(fila?.estado).toBe('incumple');
    expect(fila?.observado).toBeNull();
  });

  it('con la mediana en cero o negativa el porcentaje no se calcula: no evaluable', () => {
    const hundidas = MEDIANA_100.map((j) => ({ ...j, prestigio: -20 }));
    const filas = filasDe(evaluarEquilibrio(unaPartida(hundidas)), 'prestigio');
    expect(filas.every((f) => f.estado === 'no evaluable')).toBe(true);
    expect(filas[0]?.detalle).toContain('mediana');
    expect(filas.every((f) => f.observado === null)).toBe(true);
  });

  it('dos cadencias a cero no son un empate perfecto: no hay nada que comparar', () => {
    const quietas = MEDIANA_100.map((j) => ({ ...j, enTurno: { 100: 0, 200: 0 } }));
    const evaluacion = evaluarEquilibrio(
      resultado(
        [partida(quietas, { turnos: 200 })],
        [partida(quietas, { turnos: 200, cadencia: 6 })],
      ),
    );
    const filas = filasDe(evaluacion, 'ausencia');
    expect(filas.every((f) => f.estado === 'no evaluable')).toBe(true);
    expect(filas[0]?.detalle).toContain('cero');
  });

  it('sin la pareja ausente, la ausencia no se da por buena', () => {
    const evaluacion = evaluarEquilibrio(unaPartida(MEDIANA_100));
    expect(filasDe(evaluacion, 'ausencia').every((f) => f.estado === 'no evaluable')).toBe(true);
  });

  it('el ganador se lee del puesto real de cada partida', () => {
    const tres = ['1492', '1492-2', '1492-3'].map((semilla) =>
      partida(MEDIANA_100, { semilla, turnos: 200 }),
    );
    // En las fixturas el puesto 1 es siempre la primera casa: gana la Mesta las tres.
    expect(estadoDe(evaluarEquilibrio(resultado(tres)), 'ganadores')).toBe('incumple');
    const dos = tres.slice(0, 2);
    expect(estadoDe(evaluarEquilibrio(resultado(dos)), 'ganadores')).toBe('no evaluable');
  });

  it('con visitas sin reconstruir, un mapa mal usado no se declara incumplido', () => {
    const mapa = ['a', 'b', 'c', 'd'];
    const incompleta = unaPartida(MEDIANA_100, {
      mapa,
      tocadas: ['a'],
      visitasCompletas: false,
    });
    expect(estadoDe(evaluarEquilibrio(incompleta), 'tierra')).toBe('no evaluable');
    const completa = unaPartida(MEDIANA_100, { mapa, tocadas: ['a'], visitasCompletas: true });
    expect(estadoDe(evaluarEquilibrio(completa), 'tierra')).toBe('incumple');
    const entera = unaPartida(MEDIANA_100, { mapa, tocadas: mapa, visitasCompletas: false });
    expect(estadoDe(evaluarEquilibrio(entera), 'tierra')).toBe('cumple');
  });

  it('«no propuso órdenes» y «no había nada útil que hacer» son dos criterios distintos', () => {
    const evaluacion = evaluarEquilibrio(unaPartida(MEDIANA_100));
    expect(estadoDe(evaluacion, 'actividad', 'mesta')).toBe('cumple');
    const util = filasDe(evaluacion, 'decisiones útiles')[0];
    expect(util?.estado).toBe('no evaluable');
    expect(util?.precondicion).toContain('T-050');
  });
});

describe('el veredicto', () => {
  it('no da por cerrado el equilibrio mientras quede un no evaluable o una precondición', () => {
    const evaluacion = evaluarEquilibrio(unaPartida(MEDIANA_100));
    const recuento = recuentoDe(evaluacion);
    expect(recuento.noEvaluable).toBeGreaterThan(0);
    expect(codigoDeEvaluacion(evaluacion)).toBe(2);
    expect(pendientes(evaluacion).length).toBeGreaterThan(0);
    expect(pendientes(evaluacion)[0]?.estado).not.toBe('cumple');
  });

  it('una evaluación vacía tampoco es un aprobado', () => {
    expect(codigoDeEvaluacion([])).toBe(2);
  });

  it('se puede auditar sin abrir nada más: tabla y CSV con una línea por fila', () => {
    const evaluacion = evaluarEquilibrio(unaPartida(MEDIANA_100));
    const csv = componerEvaluacionCsv(evaluacion);
    expect(csv.trim().split('\n')).toHaveLength(evaluacion.length + 1);
    expect(csv.split('\n')[0]).toContain('criterio,ambito,semilla,casa,turno,observado');
    const texto = componerEvaluacion(evaluacion);
    for (const criterio of CRITERIOS) expect(texto).toContain(`| ${criterio} |`);
  });
});
