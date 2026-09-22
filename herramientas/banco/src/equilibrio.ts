// Evaluacion de los criterios de T-047 §5 (ficha T-048 §4.2).
//
// Esto no es el informe bonito: es el juez. Cada criterio numerico de T-047 se mide donde dice su
// ficha —por casa y partida, o por partida— y sale con su veredicto: cumple, incumple o no
// evaluable. Un agregado no sustituye nunca a una partida: una semilla mala tiene su propia fila.
//
// «No evaluable» no es un aprobado con reparos: mientras quede uno, el equilibrio no se cierra.
import { comparar } from '@conquer/nucleo';
import type { Casa } from '@conquer/nucleo';

import type { ResultadoDelBanco } from './ejecutar.ts';
import type { MetricasDePartida } from './metricas.ts';

/**
 * Los objetivos de T-047 §5, en un solo sitio. Los intervalos son cerrados (extremos incluidos) y
 * los limites sueltos son estrictos: «menos de 10 turnos» falla con 10 justos.
 */
export const OBJETIVOS = {
  /** Prestigio de cada casa frente a la mediana de su partida. */
  prestigioPct: [80, 120],
  /** Turnos sin decision util sobre los turnos en que el robot entro. */
  actividadPct: 10,
  /** Turnos con escasez sobre los turnos de la partida. */
  escasezPct: [2, 15],
  /** Turnos seguidos de mercado abierto con el precio pegado a un extremo. */
  preciosTurnos: 10,
  /** Comarcas del mapa jugado que no toca nadie. */
  tierraPct: 5,
  /** Diferencia de prestigio entre entrar cada turno y entrar cada seis. */
  ausenciaPct: 5,
  /** Turno del primer «Un pequeño dominio» de la partida. */
  dominioTurnos: [60, 100],
  /** Turno de la primera obra mayor terminada de la partida. */
  obraTurnos: [80, 130],
  /** Turnos en los que se compara la ausencia. */
  cortesDeAusencia: [100, 200],
  /** Repeticiones que tiene una campaña completa. */
  repeticionesDeCampanya: 3,
} as const;

export type EstadoDeCriterio = 'cumple' | 'incumple' | 'no evaluable';

export type AmbitoDeCriterio = 'casa y partida' | 'partida' | 'campaña';

/** Una fila del juicio: un criterio, medido en un sitio concreto, con su veredicto. */
export interface Evaluacion {
  readonly criterio: string;
  readonly ambito: AmbitoDeCriterio;
  readonly unidad: string;
  readonly semilla: string;
  readonly casa: Casa | null;
  readonly turno: number | null;
  /** Lo medido, sin redondear. Null si no se pudo medir. */
  readonly observado: number | null;
  readonly objetivo: string;
  readonly estado: EstadoDeCriterio;
  /** Lo que hace falta de otra tarea para que un «cumple» signifique algo, o null. */
  readonly precondicion: string | null;
  readonly detalle: string;
}

// ——— Comparaciones ————————————————————————————————————————————————————————

/** La mediana exacta, sin redondear: con un numero par de valores, la media de los dos centrales. */
export function medianaExacta(valores: readonly number[]): number | null {
  if (valores.length === 0) return null;
  const orden = [...valores].sort((a, b) => a - b);
  const mitad = Math.floor(orden.length / 2);
  if (orden.length % 2 === 1) return orden[mitad] ?? null;
  const antes = orden[mitad - 1];
  const despues = orden[mitad];
  return antes === undefined || despues === undefined ? null : (antes + despues) / 2;
}

/** Intervalo cerrado: los extremos cumplen. */
export function enIntervalo(
  valor: number | null,
  [minimo, maximo]: readonly [number, number],
): EstadoDeCriterio {
  if (valor === null) return 'no evaluable';
  return valor >= minimo && valor <= maximo ? 'cumple' : 'incumple';
}

/** Limite estricto: el valor justo del limite incumple. */
export function menorQue(valor: number | null, limite: number): EstadoDeCriterio {
  if (valor === null) return 'no evaluable';
  return valor < limite ? 'cumple' : 'incumple';
}

/** La diferencia de T-045 §4.5: absoluta y relativa al mayor de los dos, con suelo de 1. */
export function diferenciaDeAusencia(
  a: number,
  b: number,
): { readonly absoluta: number; readonly porcentaje: number } {
  const absoluta = Math.abs(a - b);
  return { absoluta, porcentaje: (100 * absoluta) / Math.max(1, Math.abs(a), Math.abs(b)) };
}

// ——— Evaluacion ———————————————————————————————————————————————————————————

interface Parte {
  readonly criterio: string;
  readonly ambito: AmbitoDeCriterio;
  readonly unidad: string;
  readonly objetivo: string;
  readonly observado: number | null;
  readonly estado: EstadoDeCriterio;
  readonly detalle: string;
  readonly casa?: Casa;
  readonly turno?: number;
  readonly precondicion?: string;
}

function fila(semilla: string, parte: Parte): Evaluacion {
  return {
    criterio: parte.criterio,
    ambito: parte.ambito,
    unidad: parte.unidad,
    semilla,
    casa: parte.casa ?? null,
    turno: parte.turno ?? null,
    observado: parte.observado,
    objetivo: parte.objetivo,
    estado: parte.estado,
    precondicion: parte.precondicion ?? null,
    detalle: parte.detalle,
  };
}

function intervalo([minimo, maximo]: readonly [number, number], unidad: string): string {
  return `${String(minimo)}–${String(maximo)} ${unidad} (extremos incluidos)`;
}

function prestigioFinal(partida: MetricasDePartida, jugador: number): number {
  return partida.jugadores[jugador]?.filas.at(-1)?.prestigio ?? 0;
}

function dePrestigio(partida: MetricasDePartida): Evaluacion[] {
  const finales = partida.jugadores.map((_, i) => prestigioFinal(partida, i));
  const mediana = medianaExacta(finales);
  const objetivo = intervalo(OBJETIVOS.prestigioPct, '% de la mediana');
  return partida.jugadores.map((jugador, i) => {
    const suyo = finales[i] ?? 0;
    const evaluable = mediana !== null && mediana > 0;
    const porcentaje = evaluable ? (100 * suyo) / mediana : null;
    return fila(partida.semilla, {
      criterio: 'prestigio',
      ambito: 'casa y partida',
      unidad: '% de la mediana',
      objetivo,
      observado: porcentaje,
      estado: evaluable ? enIntervalo(porcentaje, OBJETIVOS.prestigioPct) : 'no evaluable',
      casa: jugador.casa,
      detalle: evaluable
        ? `prestigio ${String(suyo)} sobre una mediana exacta de ${cifra(mediana)}`
        : `la mediana de la partida es ${cifra(mediana)}: con mediana cero o negativa el porcentaje no significa nada`,
    });
  });
}

function deActividad(partida: MetricasDePartida): Evaluacion[] {
  const filas: Evaluacion[] = [];
  for (const jugador of partida.jugadores) {
    const entro = jugador.filas.filter((f) => f.decidio === true).length;
    const callado = jugador.filas.filter((f) => f.sinOrdenes).length;
    const porcentaje = entro === 0 ? null : (100 * callado) / entro;
    const detalle = `${String(callado)} de ${String(entro)} turnos en que entró el robot`;
    const turnosSinUtil = jugador.filas.filter((f) => f.sinDecisionUtil).length;
    const sinUtil = {
      turnos: turnosSinUtil,
      porcentaje: entro === 0 ? null : (100 * turnosSinUtil) / entro,
    };
    filas.push(
      fila(partida.semilla, {
        criterio: 'actividad',
        ambito: 'casa y partida',
        unidad: '% de turnos sin proponer órdenes',
        objetivo: `< ${String(OBJETIVOS.actividadPct)} %`,
        observado: porcentaje,
        estado: menorQue(porcentaje, OBJETIVOS.actividadPct),
        casa: jugador.casa,
        detalle,
      }),
      fila(partida.semilla, {
        criterio: 'decisiones útiles',
        ambito: 'casa y partida',
        unidad: '% de turnos sin decisión útil',
        objetivo: `< ${String(OBJETIVOS.actividadPct)} %`,
        observado: sinUtil.porcentaje,
        estado: menorQue(sinUtil.porcentaje, OBJETIVOS.actividadPct),
        casa: jugador.casa,
        detalle: `${String(sinUtil.turnos)} de ${String(entro)} turnos sin ninguna orden que trabajara ni plan en marcha`,
      }),
    );
  }
  return filas;
}

function deEscasez(partida: MetricasDePartida, escenario: string): Evaluacion[] {
  return partida.jugadores.map((jugador) => {
    const turnos = jugador.filas.filter((f) => f.escasez).length;
    const porcentaje = partida.turnos === 0 ? null : (100 * turnos) / partida.turnos;
    return fila(partida.semilla, {
      criterio: 'escasez',
      ambito: 'casa y partida',
      unidad: '% de turnos con escasez',
      objetivo: intervalo(OBJETIVOS.escasezPct, '%'),
      observado: porcentaje,
      estado:
        escenario === 'normal' ? enIntervalo(porcentaje, OBJETIVOS.escasezPct) : 'no evaluable',
      casa: jugador.casa,
      precondicion: 'T-050: la horquilla vale para una partida bien jugada',
      detalle:
        escenario === 'normal'
          ? `${String(turnos)} de ${String(partida.turnos)} turnos`
          : `escenario «${escenario}»: es una regresión, no un candidato de equilibrio`,
    });
  });
}

function dePrecios(partida: MetricasDePartida): Evaluacion {
  const peor = partida.preciosPegados[0];
  const racha = peor?.turnos ?? 0;
  return fila(partida.semilla, {
    criterio: 'precios',
    ambito: 'partida',
    unidad: 'turnos seguidos de mercado abierto en un extremo',
    objetivo: `< ${String(OBJETIVOS.preciosTurnos)} turnos`,
    observado: racha,
    estado: menorQue(racha, OBJETIVOS.preciosTurnos),
    detalle:
      peor === undefined
        ? 'ningún precio se quedó más de un turno en un extremo'
        : `${peor.mercado}, ${peor.recurso}: ${String(peor.turnos)} turnos en el ${peor.extremo}; la plaza cerrada rompe la racha`,
  });
}

function deTierra(partida: MetricasDePartida): Evaluacion {
  const tocadas = new Set(partida.comarcasTocadas);
  const total = partida.comarcasDelMapa.length;
  const sinUsar = partida.comarcasDelMapa.filter((id) => !tocadas.has(id)).length;
  const porcentaje = total === 0 ? null : (100 * sinUsar) / total;
  const veredicto = menorQue(porcentaje, OBJETIVOS.tierraPct);
  // Si faltan pasos por reconstruir, el porcentaje es una cota superior: solo un «cumple» es firme.
  const estado = partida.visitasCompletas || veredicto === 'cumple' ? veredicto : 'no evaluable';
  return fila(partida.semilla, {
    criterio: 'tierra',
    ambito: 'partida',
    unidad: '% de comarcas del mapa jugado que no toca nadie',
    objetivo: `< ${String(OBJETIVOS.tierraPct)} %`,
    observado: porcentaje,
    estado,
    precondicion: 'T-049: el mapa jugado tiene que ser el recorte de la partida',
    detalle: `${String(sinUsar)} de ${String(total)} comarcas sin tocar${
      partida.visitasCompletas ? '' : '; hay pasos sin reconstruir, así que es una cota superior'
    }`,
  });
}

function deAusencia(partida: MetricasDePartida, ausente: MetricasDePartida | null): Evaluacion[] {
  const filas: Evaluacion[] = [];
  for (const jugador of partida.jugadores) {
    const pareja = ausente?.jugadores.find((j) => j.jugador === jugador.jugador);
    for (const corte of OBJETIVOS.cortesDeAusencia) {
      const diligente = jugador.filas.find((f) => f.turno === corte)?.prestigio;
      const suyo = pareja?.filas.find((f) => f.turno === corte)?.prestigio;
      const hay = diligente !== undefined && suyo !== undefined;
      const ambosCero = hay && diligente === 0 && suyo === 0;
      const diferencia = hay ? diferenciaDeAusencia(diligente, suyo) : null;
      filas.push(
        fila(partida.semilla, {
          criterio: 'ausencia',
          ambito: 'casa y partida',
          unidad: '% de diferencia de prestigio',
          objetivo: `< ${String(OBJETIVOS.ausenciaPct)} %`,
          observado: diferencia?.porcentaje ?? null,
          estado:
            !hay || ambosCero
              ? 'no evaluable'
              : menorQue(diferencia?.porcentaje ?? null, OBJETIVOS.ausenciaPct),
          casa: jugador.casa,
          turno: corte,
          precondicion: 'T-051: los dos planes tienen que ser equivalentes',
          detalle: !hay
            ? `falta la pareja de esta casa en T${String(corte)} (¿se jugó sin ausencia o con menos turnos?)`
            : ambosCero
              ? 'las dos cadencias están a cero: no hay nada que comparar'
              : `cada turno ${String(diligente)} · cada seis ${String(suyo)} · diferencia absoluta ${String(diferencia?.absoluta ?? 0)}`,
        }),
      );
    }
  }
  return filas;
}

function deRitmo(
  partida: MetricasDePartida,
  criterio: 'dominio' | 'obra mayor',
  tiempos: readonly (number | null)[],
  objetivo: readonly [number, number],
  unidad: string,
): Evaluacion {
  const logrados = tiempos.filter((t): t is number => t !== null);
  const primero = logrados.length === 0 ? null : Math.min(...logrados);
  const fuera = partida.turnos < objetivo[1];
  return fila(partida.semilla, {
    criterio,
    ambito: 'partida',
    unidad,
    objetivo: intervalo(objetivo, 'turnos'),
    observado: primero,
    estado: primero !== null ? enIntervalo(primero, objetivo) : fuera ? 'no evaluable' : 'incumple',
    detalle:
      primero !== null
        ? `${String(logrados.length)} de ${String(tiempos.length)} casas lo alcanzan; la primera en T${String(primero)}`
        : fuera
          ? `nadie lo alcanza, pero la partida dura ${String(partida.turnos)} turnos y el objetivo llega hasta T${String(objetivo[1])}`
          : 'no lo alcanza ninguna casa dentro de la ventana',
  });
}

function deGanadores(resultado: ResultadoDelBanco): Evaluacion {
  const ganadores = resultado.partidas.map((partida) =>
    partida.jugadores.filter((j) => partida.puestos[j.jugador] === 1).map((j) => j.casa),
  );
  const completa =
    ganadores.length === OBJETIVOS.repeticionesDeCampanya && ganadores.every((g) => g.length === 1);
  const repetida = ganadores[0]?.find((casa) => ganadores.every((g) => g.includes(casa))) ?? null;
  return fila(resultado.opciones.semilla, {
    criterio: 'ganadores',
    ambito: 'campaña',
    unidad: 'repeticiones ganadas por la misma casa',
    objetivo: `ninguna casa gana las ${String(OBJETIVOS.repeticionesDeCampanya)}`,
    observado: repetida === null ? 0 : ganadores.length,
    estado: !completa ? 'no evaluable' : repetida === null ? 'cumple' : 'incumple',
    detalle: completa
      ? `ganan ${ganadores.map((g) => g.join('+')).join(', ')}`
      : `hacen falta ${String(OBJETIVOS.repeticionesDeCampanya)} partidas con un ganador cada una; hay ${String(ganadores.length)}`,
  });
}

/** El juicio entero: una fila por criterio y sitio, en orden fijo. */
export function evaluarEquilibrio(resultado: ResultadoDelBanco): Evaluacion[] {
  const filas: Evaluacion[] = [];
  for (const partida of resultado.partidas) {
    const ausente =
      resultado.ausentes.find((a) => a.semilla === partida.semilla && a.cadencia !== 1) ?? null;
    filas.push(
      ...dePrestigio(partida),
      ...deActividad(partida),
      ...deEscasez(partida, resultado.opciones.escenario),
      dePrecios(partida),
      deTierra(partida),
      ...deAusencia(partida, ausente),
      deRitmo(
        partida,
        'dominio',
        partida.jugadores.map((j) => j.hitos['pequenyo-dominio']),
        OBJETIVOS.dominioTurnos,
        'turno del primer «Un pequeño dominio»',
      ),
      deRitmo(
        partida,
        'obra mayor',
        partida.jugadores.map((j) => j.primeraObraMayor),
        OBJETIVOS.obraTurnos,
        'turno de la primera obra mayor terminada',
      ),
    );
  }
  filas.push(deGanadores(resultado));
  return filas;
}

// ——— Como se cuenta ———————————————————————————————————————————————————————

export interface RecuentoDeEvaluacion {
  readonly cumple: number;
  readonly incumple: number;
  readonly noEvaluable: number;
  readonly conPrecondicion: number;
}

export function recuentoDe(filas: readonly Evaluacion[]): RecuentoDeEvaluacion {
  return {
    cumple: filas.filter((f) => f.estado === 'cumple').length,
    incumple: filas.filter((f) => f.estado === 'incumple').length,
    noEvaluable: filas.filter((f) => f.estado === 'no evaluable').length,
    conPrecondicion: filas.filter((f) => f.estado === 'cumple' && f.precondicion !== null).length,
  };
}

/**
 * El codigo de salida del modo `--evaluar`: 0 solo si todo cumple y ninguna precondicion queda
 * pendiente. Mientras haya un «no evaluable» o un «cumple» apoyado en una tarea sin terminar, el
 * equilibrio no esta cerrado.
 */
export function codigoDeEvaluacion(filas: readonly Evaluacion[]): number {
  const recuento = recuentoDe(filas);
  const todoBien =
    filas.length > 0 &&
    recuento.incumple === 0 &&
    recuento.noEvaluable === 0 &&
    recuento.conPrecondicion === 0;
  return todoBien ? 0 : 2;
}

/** Un numero para leer: entero tal cual, con decimales a una cifra y coma. */
export function cifra(valor: number | null): string {
  if (valor === null) return '—';
  return Number.isInteger(valor) ? String(valor) : valor.toFixed(1).replace('.', ',');
}

const MARCAS: Readonly<Record<EstadoDeCriterio, string>> = {
  cumple: '🟢 cumple',
  incumple: '🔴 incumple',
  'no evaluable': '⚪ no evaluable',
};

/** Solo las filas que impiden cerrar el equilibrio, de peor a mejor. */
export function pendientes(filas: readonly Evaluacion[]): Evaluacion[] {
  const orden: Readonly<Record<EstadoDeCriterio, number>> = {
    incumple: 0,
    'no evaluable': 1,
    cumple: 2,
  };
  return filas
    .filter((f) => f.estado !== 'cumple' || f.precondicion !== null)
    .sort(
      (a, b) =>
        orden[a.estado] - orden[b.estado] ||
        comparar(a.criterio, b.criterio) ||
        comparar(a.semilla, b.semilla) ||
        comparar(a.casa ?? '', b.casa ?? ''),
    );
}

export function componerEvaluacion(filas: readonly Evaluacion[]): string {
  const recuento = recuentoDe(filas);
  const linea = (f: Evaluacion): string =>
    `| ${f.criterio} | ${f.ambito} | ${f.semilla} | ${f.casa ?? '—'} | ${f.turno === null ? '—' : `T${String(f.turno)}`} | ${cifra(f.observado)} | ${f.unidad} | ${f.objetivo} | ${MARCAS[f.estado]} | ${f.detalle.replaceAll('|', '/')} |`;
  return [
    `${String(recuento.cumple)} cumplen, ${String(recuento.incumple)} incumplen y ${String(recuento.noEvaluable)} no se pueden evaluar.`,
    recuento.conPrecondicion === 0
      ? 'Ninguna fila depende de una tarea sin terminar.'
      : `${String(recuento.conPrecondicion)} filas cumplen apoyadas en una precondición que todavía no está: no valen para cerrar el equilibrio.`,
    '',
    '| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |',
    '| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |',
    ...filas.map(linea),
  ].join('\n');
}

/** El mismo juicio en CSV, para auditarlo sin leer el Markdown. */
export function componerEvaluacionCsv(filas: readonly Evaluacion[]): string {
  const escapar = (texto: string): string => `"${texto.replaceAll('"', '""')}"`;
  const lineas = [
    'criterio,ambito,semilla,casa,turno,observado,unidad,objetivo,estado,precondicion,detalle',
    ...filas.map((f) =>
      [
        escapar(f.criterio),
        escapar(f.ambito),
        escapar(f.semilla),
        escapar(f.casa ?? ''),
        f.turno === null ? '' : String(f.turno),
        f.observado === null ? '' : String(f.observado),
        escapar(f.unidad),
        escapar(f.objetivo),
        escapar(f.estado),
        escapar(f.precondicion ?? ''),
        escapar(f.detalle),
      ].join(','),
    ),
  ];
  return `${lineas.join('\n')}\n`;
}
