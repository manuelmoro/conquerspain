// La composicion del atlas (ficha T-081 §4.2 a §4.5): del atlas del jugador y su vista a una lista de
// figuras por capa. Pura: se prueba sin DOM, y `svg.ts` solo pinta lo que sale de aqui.
import { POTENCIALES } from '@conquer/nucleo';

import { COLOR_DE_CASA, COLOR_DE_POTENCIAL, COLOR_NEUTRAL, COLOR_PROPIO } from './paleta.ts';
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
  readonly forma: 'poligono' | 'linea' | 'circulo' | 'texto' | 'torre' | 'ficha';
  readonly puntos: readonly Punto[];
  readonly clase: string;
  /** Color de relleno, de la paleta (`paleta.ts`). */
  readonly relleno?: string;
  readonly texto?: string;
  /** Solo los rotulos: mas alto, antes se coloca. */
  readonly prioridad?: number;
  /** A que comarca se refiere, para seleccionarla al tocar. */
  readonly comarca?: IdComarca;
  /** Lo que dice al pasar por encima: el nombre de una recua y lo que hace (T-093). */
  readonly titulo?: string;
  /** Solo las fichas: cuanto se apartan de su punto, en pixeles, para no taparse entre ellas. */
  readonly desplazamiento?: readonly [number, number];
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

export const PRIORIDAD = {
  capital: 100,
  incorporable: 90,
  propia: 80,
  explorada: 50,
  oida: 20,
  dato: 10,
} as const;

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

/** La clase y el color de relleno de una comarca segun el modo. */
function rellenoDeComarca(
  c: ComarcaEnAtlas,
  modo: ModoDeAtlas,
  vista: VistaJugador,
): { clase: string; relleno?: string } {
  const clase = `comarca ${c.nivel}`;
  if (c.nivel === 'oida') return { clase };
  if (modo === 'economico') {
    const p = potencialPrincipal(c);
    return p === null
      ? { clase }
      : { clase: `${clase} potencial-${p}`, relleno: COLOR_DE_POTENCIAL[p] };
  }
  if (modo === 'politico') {
    if (c.duenyo === null) return { clase: `${clase} neutral`, relleno: COLOR_NEUTRAL };
    if (c.duenyo === vista.jugador.id)
      return { clase: `${clase} de-propio`, relleno: COLOR_PROPIO };
    const casa = vista.casas.find((x) => x.id === c.duenyo)?.casa;
    return casa === undefined
      ? { clase: `${clase} de-otro` }
      : { clase: `${clase} de-${casa}`, relleno: COLOR_DE_CASA[casa] };
  }
  return { clase: `${clase} neutra`, relleno: COLOR_NEUTRAL };
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
  /** La ruta que se esta trazando en el editor, comarca a comarca desde donde sale (T-083). */
  readonly propuesta?: readonly string[];
  /** Las comarcas que ya se pueden incorporar: se resaltan en todas las vistas (T-092). */
  readonly incorporables?: readonly string[];
  /** La recua o el rebanyo que se ha pedido ver en el mapa: late (T-093). */
  readonly destacada?: string | null;
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
      ...rellenoDeComarca(c, modo, vista),
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
    // El portazgo lo ve todo el mundo: quien lo cobra y cuanto (T-103).
    const peaje = vista.caminos[claveTramo(t.desde, t.hasta)]?.portazgo ?? 0;
    if (peaje > 0) clases.push('peaje');
    figuras.push({ capa: 'caminos', forma: 'linea', puntos: [a, b], clase: clases.join(' ') });
    if (modo === 'logistico' || peaje > 0) {
      const medio: Punto = [Math.round((a[0] + b[0]) / 2), Math.round((a[1] + b[1]) / 2)];
      figuras.push({
        capa: 'rotulos',
        forma: 'texto',
        puntos: [medio],
        clase: cerrado ? 'rotulo dato cerrado' : 'rotulo dato',
        texto: cerrado
          ? 'cerrado'
          : peaje > 0
            ? `${String(t.jornadasBase)} j · peaje ${String(peaje)}`
            : `${String(t.jornadasBase)} j`,
        prioridad: PRIORIDAD.dato,
      });
    }
  }

  // Cada recua y cada rebanyo, como una ficha que se ve a cualquier zoom, con su ruta y su destino
  // (T-093: un punto de cinco pixeles no se encontraba).
  const moviles = [
    ...vista.recuas.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      clase: 'recua',
      marca: '🐴',
      situacion: r.situacion,
      ruta: r.ruta,
    })),
    ...vista.rebanyos.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      clase: 'rebanyo',
      marca: '🐑',
      situacion: r.situacion,
      ruta: r.ruta,
    })),
    // Las mesnadas propias (T-120): en su comarca, o en la de destino si van de marcha.
    ...vista.mesnadas.map((m) => ({
      id: m.id,
      nombre: m.nombre,
      clase: 'mesnada',
      marca: '🛡️',
      situacion: {
        donde: 'comarca' as const,
        comarca: m.situacion.donde === 'comarca' ? m.situacion.comarca : m.situacion.hacia,
      },
      ruta: [],
    })),
  ];
  const fichas: Figura[] = [];
  for (const m of moviles) {
    const aqui = posicion(m.situacion, centros, jornadas);
    if (aqui === null) continue;
    fichas.push({
      capa: 'movimiento',
      forma: 'ficha',
      puntos: [aqui],
      clase: `ficha-unidad ${m.clase}${opciones.destacada === m.id ? ' destacada' : ''}`,
      texto: m.marca,
      titulo: m.nombre,
    });
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
      clase: `ruta ruta-${m.clase}${opciones.destacada === m.id ? ' destacada' : ''}`,
    });
    const destino = trazo.at(-1) ?? aqui;
    figuras.push({
      capa: 'movimiento',
      forma: 'circulo',
      puntos: [destino],
      clase: 'destino-de-ruta',
    });
    figuras.push({
      capa: 'rotulos',
      forma: 'texto',
      puntos: [destino],
      clase: 'rotulo dato ruta',
      texto: `${String(Math.max(0, Math.ceil(restante / 1000)))} j`,
      prioridad: PRIORIDAD.propia,
    });
  }

  // Lo que ya se puede ganar llama la atencion: un contorno dorado y su rotulo (T-092, tras jugar).
  const incorporables = new Set(opciones.incorporables ?? []);
  for (const c of atlas.comarcas) {
    if (!incorporables.has(c.id)) continue;
    figuras.push({
      capa: 'avisos',
      forma: 'poligono',
      puntos: c.poligono,
      clase: 'incorporable',
      comarca: c.id,
    });
    figuras.push({
      capa: 'rotulos',
      forma: 'texto',
      puntos: [c.centro],
      clase: 'rotulo aviso-incorporable',
      texto: '¡Incorporable!',
      prioridad: PRIORIDAD.incorporable,
    });
  }

  // Las que coinciden en un sitio se ponen en fila por encima del rotulo, sin taparse (T-093).
  const porSitio = new Map<string, number>();
  for (const f of fichas) {
    const clave = f.puntos[0]?.join(',') ?? '';
    porSitio.set(clave, (porSitio.get(clave) ?? 0) + 1);
  }
  const colocadas = new Map<string, number>();
  for (const f of fichas) {
    const clave = f.puntos[0]?.join(',') ?? '';
    const i = colocadas.get(clave) ?? 0;
    colocadas.set(clave, i + 1);
    const total = porSitio.get(clave) ?? 1;
    // Recuas a la izquierda y rebanyos a la derecha: una recua de camino cerca de un rebanyo quieto
    // tampoco se tapa con el.
    const lado = f.clase.includes('rebanyo') ? 16 : -16;
    figuras.push({ ...f, desplazamiento: [lado + Math.round((i - (total - 1) / 2) * 30), -26] });
  }

  const propuesta = (opciones.propuesta ?? []).flatMap((id) => {
    const punto = centros.get(id);
    return punto === undefined ? [] : [punto];
  });
  if (propuesta.length > 1) {
    figuras.push({
      capa: 'movimiento',
      forma: 'linea',
      puntos: propuesta,
      clase: 'ruta propuesta',
    });
  }

  // La capital se ve de un vistazo: una torre sobre su comarca, que tambien abre su ficha (T-090).
  const capital = centros.get(vista.jugador.capital);
  if (capital !== undefined) {
    figuras.push({
      capa: 'avisos',
      forma: 'torre',
      puntos: [capital],
      clase: 'torre-de-capital',
      comarca: vista.jugador.capital,
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
        comarca: a.comarca,
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
      if (
        v !== undefined &&
        v.nivel !== 'propia' &&
        v.influenciaPropia !== null &&
        c.duenyo === null
      )
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
