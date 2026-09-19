// El informe del banco (ficha T-046 §4.4 y §4.5): un Markdown para leer y dos CSV para comparar.
//
// Nada de lo que se escribe depende de la hora ni de la maquina: la misma semilla da el mismo
// informe byte a byte. La fecha va solo en el nombre del archivo.
import { CAPITULOS_DE_PRESTIGIO, RECURSOS, comparar } from '@conquer/nucleo';
import type { CapituloDePrestigio, Casa, Mundo, Recurso } from '@conquer/nucleo';

import type { ResultadoDelBanco } from './ejecutar.ts';
import { ESCENARIOS } from './escenarios/index.ts';
import type { MetricasDePartida, PrecioPegado, ResumenDeJugador } from './metricas.ts';
import { resumir } from './metricas.ts';

/** Los umbrales de salud del juego (ficha T-046 §4.5). */
export const SALUD = {
  horquillaMinimaPct: 80,
  horquillaMaximaPct: 120,
  sinDecisionMaximaPct: 10,
  escasezCronicaPct: 20,
  turnosDePrecioPegado: 20,
} as const;

const NOMBRES_DE_CASA: Readonly<Record<Casa, string>> = {
  mesta: 'Mesta',
  ferrones: 'Ferrones',
  canteros: 'Canteros',
  mercaderes: 'Mercaderes',
  monjes: 'Monjes',
  salineros: 'Salineros',
  arrieros: 'Arrieros',
  hortelanos: 'Hortelanos',
};

/** Un numero con coma decimal y un decimal. */
function decimal(valor: number): string {
  return valor.toFixed(1).replace('.', ',');
}

/** Tanto por ciento de `parte` sobre `total`, con un decimal; «—» si no hay total. */
function pct(parte: number, total: number): string {
  return total === 0 ? '—' : `${decimal((parte * 100) / total)} %`;
}

function media(valores: readonly number[]): number {
  return valores.length === 0 ? 0 : Math.round(valores.reduce((a, b) => a + b, 0) / valores.length);
}

function mediana(valores: readonly number[]): number {
  const orden = [...valores].sort((a, b) => a - b);
  if (orden.length === 0) return 0;
  const mitad = Math.floor(orden.length / 2);
  return orden.length % 2 === 1
    ? (orden[mitad] ?? 0)
    : Math.round(((orden[mitad - 1] ?? 0) + (orden[mitad] ?? 0)) / 2);
}

/** Los resumenes de cada casa en cada partida. */
function resumenes(partidas: readonly MetricasDePartida[]): Map<Casa, ResumenDeJugador[]> {
  const porCasa = new Map<Casa, ResumenDeJugador[]>();
  for (const partida of partidas) {
    for (const jugador of partida.jugadores) {
      porCasa.set(jugador.casa, [...(porCasa.get(jugador.casa) ?? []), resumir(partida, jugador)]);
    }
  }
  return porCasa;
}

/** La media de cada cifra de una casa en todas sus partidas. */
type Medias = Record<string, number>;

const CIFRAS: readonly (keyof ResumenDeJugador)[] = [
  'prestigio',
  'puesto',
  'primicias',
  'poblacion',
  'comarcas',
  'maravedis',
  'turnosConEscasez',
  'obrasTerminadas',
  'obrasMayores',
  'jornadas',
  'volumenComerciado',
  'volumenEnRuta',
  'arbitrajes',
  'ingresosDeFeria',
  'lanaEsquilada',
  'pueblasFundadas',
  'comarcasIncorporadas',
  'turnosDeDecision',
  'turnosSinDecision',
];

function mediasDe(lista: readonly ResumenDeJugador[]): Medias {
  const m: Medias = {};
  for (const cifra of CIFRAS) m[cifra] = media(lista.map((r) => Number(r[cifra])));
  for (const c of CAPITULOS_DE_PRESTIGIO)
    m[`capitulo_${c}`] = media(lista.map((r) => r.capitulos[c]));
  for (const r of RECURSOS) m[`producido_${r}`] = media(lista.map((x) => x.producido[r]));
  const edificios = new Set(lista.flatMap((x) => Object.keys(x.porEdificio)));
  for (const e of [...edificios].sort(comparar)) {
    m[`edificio_${e}`] = media(lista.map((x) => x.porEdificio[e] ?? 0));
  }
  return m;
}

interface Analisis {
  readonly casas: readonly Casa[];
  readonly medias: ReadonlyMap<Casa, Medias>;
  readonly ausentes: ReadonlyMap<Casa, Medias>;
  readonly medianaDePrestigio: number;
  readonly turnos: number;
}

function analizar(resultado: ResultadoDelBanco): Analisis {
  const porCasa = resumenes(resultado.partidas);
  const casas = [...porCasa.keys()].sort(comparar);
  const medias = new Map<Casa, Medias>(casas.map((c) => [c, mediasDe(porCasa.get(c) ?? [])]));
  const porCasaAusente = resumenes(resultado.ausentes);
  const ausentes = new Map<Casa, Medias>(
    [...porCasaAusente.keys()].map((c) => [c, mediasDe(porCasaAusente.get(c) ?? [])]),
  );
  return {
    casas,
    medias,
    ausentes,
    medianaDePrestigio: mediana(casas.map((c) => medias.get(c)?.['prestigio'] ?? 0)),
    turnos: resultado.opciones.turnos,
  };
}

function cifra(a: Analisis, casa: Casa, nombre: string): number {
  return a.medias.get(casa)?.[nombre] ?? 0;
}

/** Porcentaje del prestigio de la casa sobre la mediana, en milesimas; null si la mediana es 0. */
function sobreLaMedianaMil(a: Analisis, casa: Casa): number | null {
  if (a.medianaDePrestigio <= 0) return null;
  return Math.round((cifra(a, casa, 'prestigio') * 1000) / a.medianaDePrestigio);
}

// ——— Salud ————————————————————————————————————————————————————————————————

export interface Alerta {
  readonly nombre: string;
  readonly enRojo: boolean;
  readonly detalle: readonly string[];
}

function tierraMuerta(resultado: ResultadoDelBanco, mundo: Mundo): string[] {
  const tocadas = new Set<string>(resultado.partidas.flatMap((p) => p.comarcasTocadas));
  return Object.keys(mundo.comarcas)
    .filter((id) => !tocadas.has(id))
    .sort(comparar);
}

function preciosPegados(resultado: ResultadoDelBanco): PrecioPegado[] {
  return resultado.partidas
    .flatMap((p) => p.preciosPegados)
    .filter((p) => p.turnos > SALUD.turnosDePrecioPegado);
}

export function alertasDeSalud(resultado: ResultadoDelBanco, mundo: Mundo): Alerta[] {
  const a = analizar(resultado);
  const nombre = (c: Casa): string => NOMBRES_DE_CASA[c];

  const fuera = a.casas.filter((c) => {
    const mil = sobreLaMedianaMil(a, c);
    return (
      mil === null || mil < SALUD.horquillaMinimaPct * 10 || mil > SALUD.horquillaMaximaPct * 10
    );
  });
  const horquilla: Alerta = {
    nombre: `Casas fuera de la horquilla ${String(SALUD.horquillaMinimaPct)} %–${String(SALUD.horquillaMaximaPct)} % de la mediana de prestigio`,
    enRojo: fuera.length > 0,
    detalle: fuera.map((c) => {
      const mil = sobreLaMedianaMil(a, c);
      return `${nombre(c)}: ${mil === null ? 'la mediana no es positiva' : `${decimal(mil / 10)} %`}`;
    }),
  };

  const sinDecision = a.casas.filter((c) => {
    const hechas = cifra(a, c, 'turnosDeDecision');
    return (
      hechas > 0 && cifra(a, c, 'turnosSinDecision') * 100 > hechas * SALUD.sinDecisionMaximaPct
    );
  });
  const decision: Alerta = {
    nombre: `Más de un ${String(SALUD.sinDecisionMaximaPct)} % de turnos sin decisión útil`,
    enRojo: sinDecision.length > 0,
    detalle: sinDecision.map(
      (c) =>
        `${nombre(c)}: ${pct(cifra(a, c, 'turnosSinDecision'), cifra(a, c, 'turnosDeDecision'))}`,
    ),
  };

  const cronica: string[] = [];
  for (const partida of resultado.partidas) {
    for (const jugador of partida.jugadores) {
      const turnos = jugador.filas.filter((f) => f.escasez).length;
      if (turnos * 100 > partida.turnos * SALUD.escasezCronicaPct) {
        cronica.push(
          `${nombre(jugador.casa)} (semilla ${partida.semilla}): ${pct(turnos, partida.turnos)} de los turnos`,
        );
      }
    }
  }
  const escasez: Alerta = {
    nombre: `Partidas con escasez crónica (más del ${String(SALUD.escasezCronicaPct)} % de los turnos)`,
    enRojo: cronica.length > 0,
    detalle: cronica,
  };

  const pegados = preciosPegados(resultado);
  const precios: Alerta = {
    nombre: `Precios pegados al suelo o al techo más de ${String(SALUD.turnosDePrecioPegado)} turnos`,
    enRojo: pegados.length > 0,
    detalle: pegados.map(
      (p) => `${p.mercado}, ${p.recurso}: ${String(p.turnos)} turnos en el ${p.extremo}`,
    ),
  };

  const muertas = tierraMuerta(resultado, mundo);
  const porRegion = new Map<string, number>();
  for (const id of muertas) {
    const region = mundo.comarcas[id]?.region ?? '?';
    porRegion.set(region, (porRegion.get(region) ?? 0) + 1);
  }
  const tierra: Alerta = {
    nombre: 'Comarcas que no toca nadie en ninguna partida (tierra muerta)',
    enRojo: muertas.length > 0,
    detalle:
      muertas.length === 0
        ? []
        : [
            `${String(muertas.length)} de ${String(Object.keys(mundo.comarcas).length)} comarcas`,
            ...[...porRegion.entries()]
              .sort((x, y) => comparar(x[0], y[0]))
              .map(([region, n]) => `región ${region}: ${String(n)}`),
          ],
  };

  return [horquilla, decision, escasez, precios, tierra];
}

// ——— Markdown ——————————————————————————————————————————————————————————————

/** Una tabla de Markdown; las columnas de cifras, alineadas a la derecha. */
function tabla(
  cabecera: readonly string[],
  filas: readonly (readonly string[])[],
  deTexto: readonly number[] = [0],
): string {
  const linea = (celdas: readonly string[]): string => `| ${celdas.join(' | ')} |`;
  const alineacion = cabecera.map((_, i) => (deTexto.includes(i) ? '---' : '---:'));
  return [linea(cabecera), linea(alineacion), ...filas.map(linea)].join('\n');
}

function resumenLegible(a: Analisis, alertas: readonly Alerta[]): string {
  const orden = [...a.casas].sort(
    (x, y) => cifra(a, y, 'prestigio') - cifra(a, x, 'prestigio') || comparar(x, y),
  );
  const primera = orden[0];
  const ultima = orden.at(-1);
  if (primera === undefined || ultima === undefined) return 'No se jugó ninguna partida.';
  const enRojo = alertas.filter((x) => x.enRojo).length;
  const sobre = (c: Casa): string => {
    const mil = sobreLaMedianaMil(a, c);
    return mil === null ? 'sin mediana positiva' : `${decimal(mil / 10)} % de la mediana`;
  };
  return [
    `Tras ${String(a.turnos)} turnos, **${NOMBRES_DE_CASA[primera]}** va en cabeza con ${String(cifra(a, primera, 'prestigio'))} de prestigio (${sobre(primera)}) y **${NOMBRES_DE_CASA[ultima]}** cierra la clasificación con ${String(cifra(a, ultima, 'prestigio'))} (${sobre(ultima)}).`,
    `La mediana de prestigio es ${String(a.medianaDePrestigio)}.`,
    enRojo === 0
      ? 'Ninguna alerta de salud en rojo.'
      : `${String(enRojo)} de las ${String(alertas.length)} alertas de salud están en rojo.`,
  ].join(' ');
}

function seccionClasificacion(a: Analisis): string {
  const orden = [...a.casas].sort(
    (x, y) => cifra(a, y, 'prestigio') - cifra(a, x, 'prestigio') || comparar(x, y),
  );
  return tabla(
    [
      'Casa',
      'Prestigio',
      '% mediana',
      'Puesto',
      'Primicias',
      'Población',
      'Comarcas',
      'Maravedís',
      'Escasez',
      'Sin decisión',
    ],
    orden.map((c) => {
      const mil = sobreLaMedianaMil(a, c);
      return [
        NOMBRES_DE_CASA[c],
        String(cifra(a, c, 'prestigio')),
        mil === null ? '—' : `${decimal(mil / 10)} %`,
        String(cifra(a, c, 'puesto')),
        String(cifra(a, c, 'primicias')),
        String(cifra(a, c, 'poblacion')),
        String(cifra(a, c, 'comarcas')),
        String(cifra(a, c, 'maravedis')),
        pct(cifra(a, c, 'turnosConEscasez'), a.turnos),
        pct(cifra(a, c, 'turnosSinDecision'), cifra(a, c, 'turnosDeDecision')),
      ];
    }),
  );
}

const NOMBRES_DE_CAPITULO: Readonly<Record<CapituloDePrestigio, string>> = {
  poblacion: 'Población',
  territorio: 'Territorio',
  obras: 'Obras',
  caminos: 'Caminos',
  comercio: 'Comercio',
  exploracion: 'Exploración',
  ganaderia: 'Ganadería',
  industria: 'Industria',
  hitos: 'Hitos',
};

function seccionCapitulos(a: Analisis): string {
  return tabla(
    ['Casa', ...CAPITULOS_DE_PRESTIGIO.map((c) => NOMBRES_DE_CAPITULO[c])],
    a.casas.map((c) => [
      NOMBRES_DE_CASA[c],
      ...CAPITULOS_DE_PRESTIGIO.map((cap) => String(cifra(a, c, `capitulo_${cap}`))),
    ]),
  );
}

const PRODUCTOS: readonly Recurso[] = ['pan', 'madera', 'piedra', 'sal', 'hierro'];

/**
 * Lo que tiene que verse en la partida de cada casa para decir que su robot juega a lo suyo (ficha
 * T-046 §6.3): la cifra que lo prueba y lo que se espera de ella.
 */
export const PRUEBA_DE_VIA: Readonly<
  Record<
    Casa,
    { readonly texto: string; readonly cumple: (m: Readonly<Record<string, number>>) => boolean }
  >
> = {
  mesta: {
    texto: 'esquila lana y la vende en feria',
    cumple: (m) => (m['lanaEsquilada'] ?? 0) > 0 && (m['ingresosDeFeria'] ?? 0) > 0,
  },
  ferrones: {
    texto: 'saca hierro en sus ferrerías',
    cumple: (m) => (m['edificio_ferreria'] ?? 0) > 0,
  },
  canteros: { texto: 'termina obras mayores', cumple: (m) => (m['obrasMayores'] ?? 0) > 0 },
  mercaderes: {
    texto: 'compra en una plaza y vende en otra',
    cumple: (m) => (m['arbitrajes'] ?? 0) > 0,
  },
  monjes: { texto: 'funda pueblas', cumple: (m) => (m['pueblasFundadas'] ?? 0) > 0 },
  salineros: {
    texto: 'saca sal o salazón',
    cumple: (m) => (m['edificio_salina'] ?? 0) + (m['edificio_lonja'] ?? 0) > 0,
  },
  arrieros: {
    texto: 'anda los caminos y comercia',
    cumple: (m) => (m['jornadas'] ?? 0) > 0 && (m['volumenComerciado'] ?? 0) > 0,
  },
  hortelanos: {
    texto: 'vive del pan de sus huertas',
    cumple: (m) => (m['edificio_huerta'] ?? 0) > 0,
  },
};

function seccionVia(a: Analisis): string {
  const pruebas = tabla(
    ['Casa', 'Su vía', '¿La juega?'],
    a.casas.map((c) => [
      NOMBRES_DE_CASA[c],
      PRUEBA_DE_VIA[c].texto,
      PRUEBA_DE_VIA[c].cumple(a.medias.get(c) ?? {}) ? 'sí' : '**no**',
    ]),
    [0, 1, 2],
  );
  const cifras = tabla(
    [
      'Casa',
      'Lana esquilada',
      'Ingresos de feria',
      ...PRODUCTOS.map((r) => `${r[0]?.toUpperCase() ?? ''}${r.slice(1)} producido`),
      'Obras',
      'Obras mayores',
      'Jornadas',
      'Comerciado',
      'En ruta',
      'Arbitrajes',
      'Pueblas',
      'Incorporadas',
    ],
    a.casas.map((c) => [
      NOMBRES_DE_CASA[c],
      String(cifra(a, c, 'lanaEsquilada')),
      String(cifra(a, c, 'ingresosDeFeria')),
      ...PRODUCTOS.map((r) => String(cifra(a, c, `producido_${r}`))),
      String(cifra(a, c, 'obrasTerminadas')),
      String(cifra(a, c, 'obrasMayores')),
      String(cifra(a, c, 'jornadas')),
      String(cifra(a, c, 'volumenComerciado')),
      String(cifra(a, c, 'volumenEnRuta')),
      String(cifra(a, c, 'arbitrajes')),
      String(cifra(a, c, 'pueblasFundadas')),
      String(cifra(a, c, 'comarcasIncorporadas')),
    ]),
  );
  return `${pruebas}\n\n${cifras}`;
}

function seccionAusencia(a: Analisis): string {
  if (a.ausentes.size === 0) return 'No se jugó la comparación (`--sin-ausencia`).';
  return tabla(
    ['Casa', 'Entrando cada turno', 'Entrando cada seis', 'Diferencia'],
    a.casas.map((c) => {
      const diligente = cifra(a, c, 'prestigio');
      const ausente = a.ausentes.get(c)?.['prestigio'] ?? 0;
      const mayor = Math.max(Math.abs(diligente), Math.abs(ausente), 1);
      return [
        NOMBRES_DE_CASA[c],
        String(diligente),
        String(ausente),
        `${decimal((Math.abs(diligente - ausente) * 100) / mayor)} %`,
      ];
    }),
  );
}

/** El prestigio medio de cada casa cada tantos turnos. */
function seccionEvolucion(resultado: ResultadoDelBanco, a: Analisis): string {
  const paso = Math.max(1, Math.ceil(a.turnos / 10));
  const cortes: number[] = [];
  for (let t = paso; t < a.turnos; t += paso) cortes.push(t);
  cortes.push(a.turnos);
  return tabla(
    ['Casa', ...cortes.map((t) => `T${String(t)}`)],
    a.casas.map((c) => [
      NOMBRES_DE_CASA[c],
      ...cortes.map((t) =>
        String(
          media(
            resultado.partidas.flatMap((p) =>
              p.jugadores
                .filter((j) => j.casa === c)
                .map((j) => j.filas.find((f) => f.turno === t)?.prestigio ?? 0),
            ),
          ),
        ),
      ),
    ]),
  );
}

function seccionAlertas(alertas: readonly Alerta[]): string {
  return alertas
    .map((alerta) => {
      const marca = alerta.enRojo ? '🔴 **EN ROJO**' : '🟢 bien';
      const detalle = alerta.detalle.map((d) => `  - ${d}`).join('\n');
      return detalle === ''
        ? `- ${marca} · ${alerta.nombre}`
        : `- ${marca} · ${alerta.nombre}\n${detalle}`;
    })
    .join('\n');
}

export function componerInforme(resultado: ResultadoDelBanco, mundo: Mundo): string {
  const { opciones } = resultado;
  const a = analizar(resultado);
  const alertas = alertasDeSalud(resultado, mundo);
  const huellas = resultado.partidas.map((p) => `- semilla \`${p.semilla}\`: \`${p.huellaFinal}\``);
  return `${[
    `# Banco de pruebas · semilla ${opciones.semilla}`,
    '',
    `${String(opciones.turnos)} turnos · ${String(opciones.repeticiones)} partida(s) · casas: ${opciones.casas.map((c) => NOMBRES_DE_CASA[c]).join(', ')} · escenario **${opciones.escenario}** (${ESCENARIOS[opciones.escenario].descripcion}) · mundo \`${mundo.version}\``,
    '',
    '## Resumen',
    '',
    resumenLegible(a, alertas),
    '',
    '## Salud del juego',
    '',
    seccionAlertas(alertas),
    '',
    '## Clasificación final',
    '',
    'Media de las partidas. La escasez y los turnos sin decisión, sobre los turnos jugados y los turnos en que el robot decidió.',
    '',
    seccionClasificacion(a),
    '',
    '## Capítulos de prestigio',
    '',
    seccionCapitulos(a),
    '',
    '## La vía de cada casa',
    '',
    'Lo acumulado en toda la partida: cada robot tiene que jugar a lo suyo, y aquí se ve.',
    '',
    seccionVia(a),
    '',
    '## Jugar sin estar',
    '',
    'El mismo robot entrando cada turno o cada seis, con colas, plan y mayordomo (docs/02 §2.5). La diferencia tiene que ser pequeña: conectarse más no puede dar ventaja.',
    '',
    seccionAusencia(a),
    '',
    '## Evolución del prestigio',
    '',
    seccionEvolucion(resultado, a),
    '',
    '## Huellas',
    '',
    'La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.',
    '',
    ...huellas,
  ].join('\n')}\n`;
}

// ——— CSV ——————————————————————————————————————————————————————————————————

/** Formato largo: `casa,metrica,valor`, una fila por cifra. Asi comparar no depende de columnas. */
export function componerCsv(resultado: ResultadoDelBanco): string {
  const a = analizar(resultado);
  const filas: string[] = ['casa,metrica,valor'];
  for (const casa of a.casas) {
    const medias = a.medias.get(casa) ?? {};
    for (const nombre of Object.keys(medias).sort(comparar)) {
      filas.push(`${casa},${nombre},${String(medias[nombre] ?? 0)}`);
    }
    const mil = sobreLaMedianaMil(a, casa);
    if (mil !== null) filas.push(`${casa},prestigio_sobre_mediana_mil,${String(mil)}`);
    const ausente = a.ausentes.get(casa);
    if (ausente !== undefined)
      filas.push(`${casa},prestigio_entrando_cada_seis,${String(ausente['prestigio'] ?? 0)}`);
  }
  filas.push(`partida,mediana_de_prestigio,${String(a.medianaDePrestigio)}`);
  filas.push(`partida,precios_pegados,${String(preciosPegados(resultado).length)}`);
  const tocadas = new Set<string>(resultado.partidas.flatMap((p) => p.comarcasTocadas));
  filas.push(`partida,comarcas_tocadas,${String(tocadas.size)}`);
  return `${filas.join('\n')}\n`;
}

/** La serie turno a turno, para dibujarla o compararla con detalle. */
export function componerSerieCsv(resultado: ResultadoDelBanco): string {
  const filas: string[] = [
    'semilla,turno,casa,prestigio,poblacion,comarcas,maravedis,pan,escasez,decidio,sin_decision',
  ];
  for (const partida of resultado.partidas) {
    for (const jugador of partida.jugadores) {
      for (const f of jugador.filas) {
        filas.push(
          [
            partida.semilla,
            String(f.turno),
            jugador.casa,
            String(f.prestigio),
            String(f.poblacion),
            String(f.comarcas),
            String(f.almacen.maravedis),
            String(f.almacen.pan),
            f.escasez ? '1' : '0',
            f.decidio === null ? '' : '1',
            f.sinDecision ? '1' : '0',
          ].join(','),
        );
      }
    }
  }
  return `${filas.join('\n')}\n`;
}
