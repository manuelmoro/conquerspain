// Salud de la partida con rivales (docs/06 §6.8; ficha T-106). Juega cada semilla dos veces con las
// mismas casas: una con todos los robots diligentes (entran cada turno) y otra con cadencias
// mezcladas (unos entran cada turno, otros cada 2, 3 o 6). De ahi salen las seis metricas: el
// primero frente a la mediana, quien queda entre los tres primeros, la correlacion entre entrar mas
// veces y ganar mas, los abandonos, las comarcas perdidas por deslealtad y los turnos sin decision.
import { CASAS } from '@conquer/nucleo';
import type { Casa, EstadoPartida, IdJugador, Mundo, TablasDeReglas } from '@conquer/nucleo';

import { jugarTurno } from './ejecutar.ts';
import { altaDelBanco } from './partida.ts';
import { origenPreferido, robotDe } from './robots/index.ts';

/**
 * Las cadencias de la partida mezclada: de quien entra cada turno a quien entra cada seis, que es
 * hasta donde llega el plan de temporada (docs/02 §2.5.4). Mas alla, el juego no promete nada.
 */
export const CADENCIAS_MEZCLADAS: readonly number[] = [1, 2, 3, 6];

/** Los objetivos de docs/06 §6.8, con las cifras de la ficha T-106. */
export const OBJETIVOS = {
  primeroSobreLaMedianaMaximoPct: 60,
  casasDistintasEnElPodioMinimo: 5,
  correlacionMaxima: 0.15,
  abandonosMaximoPct: 15,
  deslealtadMaximaPct: 10,
  sinDecisionMaximaPct: 10,
} as const;

export interface PartidaDeSalud {
  readonly semilla: string;
  readonly cadencias: Readonly<Record<string, number>>;
  readonly prestigio: Readonly<Record<string, number>>;
  /** Turnos en que cada robot entro y en cuantos no dio ninguna orden. */
  readonly entradas: Readonly<Record<string, number>>;
  readonly sinOrdenes: Readonly<Record<string, number>>;
  readonly perdidasPorDeslealtad: number;
  /** Comarcas con dueno al final mas las que se perdieron: las que alguien llego a tener. */
  readonly comarcasConDueno: number;
  /** Casas que acabaron administradas por el concejo antes del turno 60 (abandono). */
  readonly abandonos: number;
}

export function jugarPartidaDeSalud(opciones: {
  readonly semilla: string;
  readonly turnos: number;
  readonly casas: readonly Casa[];
  readonly cadencias: Readonly<Record<string, number>>;
  readonly reglas: TablasDeReglas;
  readonly mundo: Mundo;
}): PartidaDeSalud {
  const { semilla, turnos, casas, cadencias, reglas } = opciones;
  const alta = altaDelBanco({
    semilla,
    casas,
    reglas,
    mundo: opciones.mundo,
    preferencia: origenPreferido,
  });
  const robots = casas.map((casa) => robotDe(casa, cadencias[casa] ?? 1));
  const entradas: Record<string, number> = {};
  const sinOrdenes: Record<string, number> = {};
  let perdidas = 0;
  let abandonos = 0;
  let estado: EstadoPartida = alta.estado;
  for (let i = 0; i < turnos; i += 1) {
    const jugado = jugarTurno(estado, robots, alta.mundo, reglas);
    estado = jugado.estado;
    perdidas += jugado.sucesos.filter((s) => s.tipo === 'comarca.vuelve-neutral').length;
    if (estado.turno <= 60) {
      abandonos += jugado.sucesos.filter((s) => s.tipo === 'ausencia.concejo').length;
    }
    for (const [jugador, decision] of jugado.decisiones) {
      if (decision === null) continue;
      entradas[jugador] = (entradas[jugador] ?? 0) + 1;
      if (decision.ordenes.length === 0) sinOrdenes[jugador] = (sinOrdenes[jugador] ?? 0) + 1;
    }
  }
  const prestigio: Record<string, number> = {};
  for (const casa of casas) prestigio[casa] = estado.jugadores[casa as IdJugador]?.prestigio ?? 0;
  const conDueno = Object.values(estado.comarcas).filter((c) => c.duenyo !== null).length;
  return {
    semilla,
    cadencias,
    prestigio,
    entradas,
    sinOrdenes,
    perdidasPorDeslealtad: perdidas,
    comarcasConDueno: conDueno + perdidas,
    abandonos,
  };
}

/** La mediana de unos numeros (la media de los dos centrales si son pares). */
export function mediana(valores: readonly number[]): number {
  const orden = [...valores].sort((a, b) => a - b);
  const medio = Math.floor(orden.length / 2);
  if (orden.length === 0) return 0;
  return orden.length % 2 === 1
    ? (orden[medio] ?? 0)
    : ((orden[medio - 1] ?? 0) + (orden[medio] ?? 0)) / 2;
}

/** Correlacion de Pearson; 0 si alguna de las dos series no varia. */
export function correlacion(x: readonly number[], y: readonly number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;
  const mx = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const my = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = (x[i] ?? 0) - mx;
    const dy = (y[i] ?? 0) - my;
    sxy += dx * dy;
    sxx += dx * dx;
    syy += dy * dy;
  }
  return sxx === 0 || syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
}

/** Las casas ordenadas por prestigio, de mas a menos (empates por nombre). */
export function podio(prestigio: Readonly<Record<string, number>>): string[] {
  return Object.entries(prestigio)
    .sort(([a, x], [b, y]) => y - x || (a < b ? -1 : 1))
    .map(([casa]) => casa);
}

export interface InformeDeSalud {
  readonly diligentes: readonly PartidaDeSalud[];
  readonly mezcladas: readonly PartidaDeSalud[];
  /** Por semilla: cuanto saca el primero a la mediana, en %. */
  readonly primeroSobreLaMedianaPct: readonly number[];
  readonly ganadores: readonly string[];
  readonly casasEnElPodio: readonly string[];
  /** Entre las conexiones de cada casa y su prestigio con cadencia mezclada sobre el diligente. */
  readonly correlacionConexiones: number;
  readonly abandonosPct: number;
  readonly deslealtadPct: number;
  readonly sinDecisionPct: Readonly<Record<string, number>>;
  readonly cumple: Readonly<Record<string, boolean>>;
}

/** Cadencias rotadas por semilla: cada casa prueba distintas cadencias en distintas semillas. */
export function cadenciasDe(casas: readonly Casa[], indice: number): Record<string, number> {
  const cadencias: Record<string, number> = {};
  casas.forEach((casa, i) => {
    cadencias[casa] = CADENCIAS_MEZCLADAS[(i + indice) % CADENCIAS_MEZCLADAS.length] ?? 1;
  });
  return cadencias;
}

export function saludMultijugador(opciones: {
  readonly semillas: readonly string[];
  readonly turnos: number;
  readonly casas?: readonly Casa[];
  readonly reglas: TablasDeReglas;
  readonly mundo: Mundo;
}): InformeDeSalud {
  const casas = opciones.casas ?? CASAS;
  const comun = { turnos: opciones.turnos, casas, reglas: opciones.reglas, mundo: opciones.mundo };
  const diligentes = opciones.semillas.map((semilla) =>
    jugarPartidaDeSalud({
      ...comun,
      semilla,
      cadencias: Object.fromEntries(casas.map((c) => [c, 1])),
    }),
  );
  const mezcladas = opciones.semillas.map((semilla, i) =>
    jugarPartidaDeSalud({ ...comun, semilla, cadencias: cadenciasDe(casas, i) }),
  );

  const primeroSobreLaMedianaPct = diligentes.map((p) => {
    const valores = Object.values(p.prestigio);
    const m = mediana(valores);
    return m <= 0 ? Infinity : ((Math.max(...valores) - m) * 100) / m;
  });
  const ganadores = diligentes.map((p) => podio(p.prestigio)[0] ?? '');
  const casasEnElPodio = [
    ...new Set(diligentes.flatMap((p) => podio(p.prestigio).slice(0, 3))),
  ].sort();

  // Conexiones de la partida mezclada frente a lo que gano esa casa respecto de su partida diligente.
  const x: number[] = [];
  const y: number[] = [];
  mezcladas.forEach((p, i) => {
    const base = diligentes[i];
    for (const casa of casas) {
      const diligente = base?.prestigio[casa] ?? 0;
      if (diligente <= 0) continue;
      x.push(p.entradas[casa] ?? 0);
      y.push((p.prestigio[casa] ?? 0) / diligente);
    }
  });
  const correlacionConexiones = correlacion(x, y);

  const todas = [...diligentes, ...mezcladas];
  const abandonosPct =
    (todas.reduce((t, p) => t + p.abandonos, 0) * 100) / Math.max(1, todas.length * casas.length);
  const perdidas = todas.reduce((t, p) => t + p.perdidasPorDeslealtad, 0);
  const conDueno = todas.reduce((t, p) => t + p.comarcasConDueno, 0);
  const deslealtadPct = (perdidas * 100) / Math.max(1, conDueno);
  const sinDecisionPct: Record<string, number> = {};
  for (const casa of casas) {
    const entradas = diligentes.reduce((t, p) => t + (p.entradas[casa] ?? 0), 0);
    const sin = diligentes.reduce((t, p) => t + (p.sinOrdenes[casa] ?? 0), 0);
    sinDecisionPct[casa] = (sin * 100) / Math.max(1, entradas);
  }
  const vecesGanador = new Map<string, number>();
  for (const g of ganadores) vecesGanador.set(g, (vecesGanador.get(g) ?? 0) + 1);

  const o = OBJETIVOS;
  return {
    diligentes,
    mezcladas,
    primeroSobreLaMedianaPct,
    ganadores,
    casasEnElPodio,
    correlacionConexiones,
    abandonosPct,
    deslealtadPct,
    sinDecisionPct,
    cumple: {
      primeroSobreLaMediana: primeroSobreLaMedianaPct.every(
        (v) => v < o.primeroSobreLaMedianaMaximoPct,
      ),
      casasEnElPodio: casasEnElPodio.length >= o.casasDistintasEnElPodioMinimo,
      ningunaGanaDosVeces: [...vecesGanador.values()].every((v) => v <= 1),
      correlacion: Math.abs(correlacionConexiones) < o.correlacionMaxima,
      abandonos: abandonosPct < o.abandonosMaximoPct,
      deslealtad: perdidas > 0 && deslealtadPct < o.deslealtadMaximaPct,
      sinDecision: Object.values(sinDecisionPct).every((v) => v < o.sinDecisionMaximaPct),
    },
  };
}

const r1 = (v: number): string => (Number.isFinite(v) ? v.toFixed(1).replace('.', ',') : '∞');
const marca = (bien: boolean | undefined): string => (bien === true ? '✔' : '✘');

/** El informe en Markdown, para leerlo y para la bitacora. */
export function informeDeSalud(i: InformeDeSalud, turnos: number): string {
  const o = OBJETIVOS;
  const lineas = [
    `# Salud multijugador · ${String(i.diligentes.length)} semillas · ${String(turnos)} turnos`,
    '',
    '| Métrica | Objetivo | Medido | |',
    '|---|---|---|---|',
    `| Primero sobre la mediana | < ${String(o.primeroSobreLaMedianaMaximoPct)} % | ${i.primeroSobreLaMedianaPct.map((v) => `${r1(v)} %`).join(' · ')} | ${marca(i.cumple['primeroSobreLaMediana'])} |`,
    `| Casas distintas en el podio | ≥ ${String(o.casasDistintasEnElPodioMinimo)} | ${String(i.casasEnElPodio.length)} (${i.casasEnElPodio.join(', ')}) | ${marca(i.cumple['casasEnElPodio'])} |`,
    `| Ninguna casa gana dos semillas | — | ${i.ganadores.join(', ')} | ${marca(i.cumple['ningunaGanaDosVeces'])} |`,
    `| Correlación conexiones–prestigio | < ${o.correlacionMaxima.toFixed(2).replace('.', ',')} | ${i.correlacionConexiones.toFixed(2).replace('.', ',')} | ${marca(i.cumple['correlacion'])} |`,
    `| Abandonos antes del turno 60 | < ${String(o.abandonosMaximoPct)} % | ${r1(i.abandonosPct)} % | ${marca(i.cumple['abandonos'])} |`,
    `| Comarcas perdidas por deslealtad | > 0 y < ${String(o.deslealtadMaximaPct)} % | ${r1(i.deslealtadPct)} % | ${marca(i.cumple['deslealtad'])} |`,
    `| Turnos sin decisión | < ${String(o.sinDecisionMaximaPct)} % | ${
      Object.entries(i.sinDecisionPct)
        .filter(([, v]) => v >= o.sinDecisionMaximaPct)
        .map(([c, v]) => `${c} ${r1(v)} %`)
        .join(' · ') || 'ninguna casa por encima'
    } | ${marca(i.cumple['sinDecision'])} |`,
    '',
    '## Prestigio por semilla (todos diligentes)',
    '',
  ];
  for (const p of i.diligentes) {
    lineas.push(
      `- ${p.semilla}: ${podio(p.prestigio)
        .map((c) => `${c} ${String(p.prestigio[c] ?? 0)}`)
        .join(' · ')}`,
    );
  }
  lineas.push('', '## Cadencias mezcladas', '');
  i.mezcladas.forEach((p, k) => {
    const base = i.diligentes[k];
    lineas.push(
      `- ${p.semilla}: ${Object.keys(p.cadencias)
        .map(
          (c) =>
            `${c} cada ${String(p.cadencias[c] ?? 1)}: ${String(p.prestigio[c] ?? 0)} (diligente ${String(base?.prestigio[c] ?? 0)})`,
        )
        .join(' · ')}`,
    );
  });
  return `${lineas.join('\n')}\n`;
}
