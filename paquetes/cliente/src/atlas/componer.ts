// La composicion del atlas (ficha T-081 §4.2 a §4.5): del atlas del jugador y su vista a una lista de
// figuras por capa. Pura: se prueba sin DOM, y `svg.ts` solo pinta lo que sale de aqui.
import { POTENCIALES } from '@conquer/nucleo';
import type {
  AtlasDeJugador,
  ComarcaEnAtlas,
  Estacion,
  IdComarca,
  Potencial,
  Punto,
  SituacionMovil,
  VistaJugador,
} from '@conquer/nucleo';

export const MODOS_DE_ATLAS = ['economico', 'logistico', 'politico'] as const;
export type ModoDeAtlas = (typeof MODOS_DE_ATLAS)[number];

export const CAPAS = [
  'terreno',
  'comarcas',
  'niebla',
  'caminos',
  'movimiento',
  'avisos',
  'rotulos',
] as const;
export type Capa = (typeof CAPAS)[number];

export interface Figura {
  readonly capa: Capa;
  readonly forma: 'poligono' | 'linea' | 'circulo' | 'texto';
  readonly puntos: readonly Punto[];
  readonly clase: string;
  readonly texto?: string;
  /** Solo los rotulos: mas alto, antes se coloca. */
  readonly prioridad?: number;
  /** A que comarca se refiere, para seleccionarla al tocar. */
  readonly comarca?: IdComarca;
}

export interface Dibujo {
  readonly figuras: readonly Figura[];
  /** La caja que ocupa todo el mapa, en unidades de atlas. */
  readonly caja: {
    readonly x: number;
    readonly y: number;
    readonly ancho: number;
    readonly alto: number;
  };
}

export const PRIORIDAD = { capital: 100, propia: 80, explorada: 50, oida: 20, dato: 10 } as const;

export const NOMBRE_DE_POTENCIAL: Readonly<Record<Potencial, string>> = {
  labor: 'labor',
  monte: 'monte',
  pasto: 'pasto',
  piedra: 'piedra',
  hierro: 'hierro',
  sal: 'sal',
  pesca: 'pesca',
};

/** El potencial mas alto de una comarca; a igualdad, el primero de la lista del nucleo. */
export function potencialPrincipal(c: ComarcaEnAtlas): Potencial | null {
  if (c.potenciales === null) return null;
  let mejor: Potencial | null = null;
  for (const p of POTENCIALES) {
    if (c.potenciales[p] > 0 && (mejor === null || c.potenciales[p] > c.potenciales[mejor]))
      mejor = p;
  }
  return mejor;
}

function cajaDe(atlas: AtlasDeJugador): Dibujo['caja'] {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  const todos = [...atlas.comarcas.map((c) => c.poligono), ...atlas.niebla];
  for (const poligono of todos) {
    for (const [x, y] of poligono) {
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
  }
  if (x0 === Infinity) return { x: 0, y: 0, ancho: 1, alto: 1 };
  return { x: x0, y: y0, ancho: x1 - x0, alto: y1 - y0 };
}

/** La clase de relleno de una comarca segun el modo. */
function claseDeComarca(c: ComarcaEnAtlas, modo: ModoDeAtlas, vista: VistaJugador): string {
  const base = `comarca ${c.nivel}`;
  if (c.nivel === 'oida') return base;
  if (modo === 'economico') {
    const p = potencialPrincipal(c);
    return p === null ? base : `${base} potencial-${p}`;
  }
  if (modo === 'politico') {
    if (c.duenyo === null) return `${base} neutral`;
    if (c.duenyo === vista.jugador.id) return `${base} de-propio`;
    return `${base} de-${vista.casas.find((x) => x.id === c.duenyo)?.casa ?? 'otro'}`;
  }
  return `${base} neutra`;
}

/** Posicion de algo que se mueve: en su comarca, o en el tramo segun lo andado. */
function posicion(
  situacion: SituacionMovil,
  centros: ReadonlyMap<string, Punto>,
  jornadas: (a: IdComarca, b: IdComarca) => number,
): Punto | null {
  if (situacion.donde === 'comarca') return centros.get(situacion.comarca) ?? null;
  const a = centros.get(situacion.desde);
  const b = centros.get(situacion.hasta);
  if (a === undefined || b === undefined) return null;
  const total = Math.max(1, jornadas(situacion.desde, situacion.hasta) * 1000);
  const f = Math.min(1, situacion.jornadasHechasMil / total);
  return [Math.round(a[0] + (b[0] - a[0]) * f), Math.round(a[1] + (b[1] - a[1]) * f)];
}

export interface OpcionesDeComposicion {
  readonly modo: ModoDeAtlas;
  readonly estacion: Estacion;
}

export function componerAtlas(
  atlas: AtlasDeJugador,
  vista: VistaJugador,
  opciones: OpcionesDeComposicion,
): Dibujo {
  const { modo, estacion } = opciones;
  const figuras: Figura[] = [];
  const centros = new Map<string, Punto>(atlas.comarcas.map((c) => [c.id, c.centro]));
  const claveTramo = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const tramos = new Map(atlas.tramos.map((t) => [claveTramo(t.desde, t.hasta), t]));
  const jornadas = (a: IdComarca, b: IdComarca): number =>
    tramos.get(claveTramo(a, b))?.jornadasBase ?? 0;

  for (const c of atlas.comarcas) {
    if (c.terreno !== null)
      figuras.push({
        capa: 'terreno',
        forma: 'poligono',
        puntos: c.poligono,
        clase: `terreno terreno-${c.terreno}`,
        comarca: c.id,
      });
    figuras.push({
      capa: 'comarcas',
      forma: 'poligono',
      puntos: c.poligono,
      clase: claseDeComarca(c, modo, vista),
      comarca: c.id,
    });
    if (c.nivel === 'oida')
      figuras.push({
        capa: 'niebla',
        forma: 'poligono',
        puntos: c.poligono,
        clase: 'niebla-ligera',
        comarca: c.id,
      });
  }
  for (const poligono of atlas.niebla)
    figuras.push({ capa: 'niebla', forma: 'poligono', puntos: poligono, clase: 'niebla' });

  for (const t of atlas.tramos) {
    const a = centros.get(t.desde);
    const b = centros.get(t.hasta);
    if (a === undefined || b === undefined) continue;
    const cerrado = estacion === 'invierno' && t.cierraEnInvierno && t.calidad !== 'calzada';
    const clases = [
      'camino',
      `calidad-${t.calidad}`,
      modo === 'logistico' ? 'destacado' : 'discreto',
    ];
    if (t.canyada) clases.push('canyada');
    if (cerrado) clases.push('puerto-cerrado');
    figuras.push({ capa: 'caminos', forma: 'linea', puntos: [a, b], clase: clases.join(' ') });
    if (modo === 'logistico') {
      const medio: Punto = [Math.round((a[0] + b[0]) / 2), Math.round((a[1] + b[1]) / 2)];
      figuras.push({
        capa: 'rotulos',
        forma: 'texto',
        puntos: [medio],
        clase: cerrado ? 'rotulo dato cerrado' : 'rotulo dato',
        texto: cerrado ? 'cerrado' : `${String(t.jornadasBase)} j`,
        prioridad: PRIORIDAD.dato,
      });
    }
  }

  const moviles = [
    ...vista.recuas.map((r) => ({ clase: 'recua', situacion: r.situacion, ruta: r.ruta })),
    ...vista.rebanyos.map((r) => ({ clase: 'rebanyo', situacion: r.situacion, ruta: r.ruta })),
  ];
  for (const m of moviles) {
    const aqui = posicion(m.situacion, centros, jornadas);
    if (aqui === null) continue;
    figuras.push({ capa: 'movimiento', forma: 'circulo', puntos: [aqui], clase: m.clase });
    if (m.ruta.length === 0) continue;
    const trazo: Punto[] = [aqui];
    let restante = 0;
    // En camino, la ruta empieza por el destino del tramo: se cuenta entero y se resta lo andado.
    let previa: IdComarca =
      m.situacion.donde === 'comarca' ? m.situacion.comarca : m.situacion.desde;
    for (const id of m.ruta) {
      const c = centros.get(id);
      if (c !== undefined) trazo.push(c);
      restante += jornadas(previa, id) * 1000;
      previa = id;
    }
    if (m.situacion.donde === 'camino') restante -= m.situacion.jornadasHechasMil;
    figuras.push({
      capa: 'movimiento',
      forma: 'linea',
      puntos: trazo,
      clase: `ruta ruta-${m.clase}`,
    });
    const destino = trazo.at(-1) ?? aqui;
    figuras.push({
      capa: 'rotulos',
      forma: 'texto',
      puntos: [destino],
      clase: 'rotulo dato ruta',
      texto: `${String(Math.max(0, Math.ceil(restante / 1000)))} j`,
      prioridad: PRIORIDAD.propia,
    });
  }

  for (const a of vista.acontecimientos) {
    if (a.comarca === null) continue;
    const donde = centros.get(a.comarca);
    if (donde !== undefined) {
      figuras.push({
        capa: 'avisos',
        forma: 'circulo',
        puntos: [donde],
        clase: `aviso aviso-${a.tipo}`,
        texto: a.tipo,
      });
    }
  }
  for (const c of atlas.comarcas) {
    if (c.feria)
      figuras.push({
        capa: 'avisos',
        forma: 'circulo',
        puntos: [c.centro],
        clase: 'feria',
        comarca: c.id,
      });
  }

  for (const c of atlas.comarcas) {
    const esCapital = c.id === vista.jugador.capital;
    const prioridad = esCapital ? PRIORIDAD.capital : PRIORIDAD[c.nivel];
    let texto = c.nombre;
    if (modo === 'economico') {
      const p = potencialPrincipal(c);
      if (p !== null) texto = `${c.nombre} · ${NOMBRE_DE_POTENCIAL[p]}`;
    }
    if (modo === 'politico') {
      const v = vista.comarcas[c.id];
      if (v?.nivel === 'explorada' && v.influenciaPropia !== null && c.duenyo === null)
        texto = `${c.nombre} · ${String(v.influenciaPropia)}`;
    }
    figuras.push({
      capa: 'rotulos',
      forma: 'texto',
      puntos: [c.centro],
      clase: esCapital ? 'rotulo capital' : `rotulo ${c.nivel}`,
      texto,
      prioridad,
      comarca: c.id,
    });
  }
  return { figuras, caja: cajaDe(atlas) };
}
