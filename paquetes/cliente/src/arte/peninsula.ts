// Compone el SVG de la peninsula para la portada (ficha T-090 §2.3), puro: comarcas con el color de su
// terreno, las canyadas reales punteadas y unas recuas que las recorren. Lo usa `herramientas/portada.ts`.

/** Lo que hace falta del mundo: la forma de cada comarca y los caminos con su canyada. */
export interface MundoParaLaPortada {
  readonly comarcas: Readonly<
    Record<
      string,
      { readonly poligono: readonly (readonly [number, number])[]; readonly terreno: string }
    >
  >;
  readonly caminos: readonly {
    readonly desde: string;
    readonly hasta: string;
    readonly canyada: string | null;
  }[];
}

const COLOR_DE_TERRENO: Readonly<Record<string, string>> = {
  llano: '#e8cf8f',
  ondulado: '#dcc48c',
  sierra: '#cdb08a',
  costa: '#e3d6a8',
  vega: '#cfd08a',
};

/** Las canyadas que recorren las recuas de la portada, y cuanto tarda cada vuelta. */
const RECORRIDOS: readonly {
  readonly canyada: string;
  readonly segundos: number;
  readonly color: string;
}[] = [
  { canyada: 'Cañada Real Leonesa Occidental', segundos: 26, color: '#1f4e9c' },
  { canyada: 'Cañada Real de la Plata', segundos: 32, color: '#a8322b' },
  { canyada: 'Cañada Real Galiana', segundos: 22, color: '#2f7a3a' },
  { canyada: 'Cañada Real Soriana Oriental', segundos: 28, color: '#7a5c3a' },
];

function centro(poligono: readonly (readonly [number, number])[]): [number, number] {
  let x = 0;
  let y = 0;
  for (const [px, py] of poligono) {
    x += px;
    y += py;
  }
  const n = Math.max(1, poligono.length);
  return [Math.round(x / n), Math.round(y / n)];
}

/** El recorrido mas largo de una canyada: se encadenan sus tramos desde una punta. */
function recorrido(mundo: MundoParaLaPortada, canyada: string): string[] {
  const vecinos = new Map<string, string[]>();
  for (const c of mundo.caminos) {
    if (c.canyada !== canyada) continue;
    vecinos.set(c.desde, [...(vecinos.get(c.desde) ?? []), c.hasta].sort());
    vecinos.set(c.hasta, [...(vecinos.get(c.hasta) ?? []), c.desde].sort());
  }
  const puntas = [...vecinos.keys()].filter((k) => (vecinos.get(k) ?? []).length === 1).sort();
  let mejor: string[] = [];
  for (const inicio of puntas.length > 0 ? puntas : [...vecinos.keys()].sort()) {
    const camino = [inicio];
    const vistos = new Set(camino);
    let actual = inicio;
    for (;;) {
      const siguiente = (vecinos.get(actual) ?? []).find((v) => !vistos.has(v));
      if (siguiente === undefined) break;
      camino.push(siguiente);
      vistos.add(siguiente);
      actual = siguiente;
    }
    if (camino.length > mejor.length) mejor = camino;
  }
  return mejor;
}

export function componerPeninsula(mundo: MundoParaLaPortada): string {
  const ids = Object.keys(mundo.comarcas).sort();
  const centros = new Map(ids.map((id) => [id, centro(mundo.comarcas[id]?.poligono ?? [])]));
  const comarcas = ids
    .map((id) => {
      const c = mundo.comarcas[id];
      if (c === undefined) return '';
      const puntos = c.poligono.map(([x, y]) => `${String(x)},${String(y)}`).join(' ');
      return `<polygon points="${puntos}" fill="${COLOR_DE_TERRENO[c.terreno] ?? '#e3d6a8'}"/>`;
    })
    .join('');
  const canyadas = mundo.caminos
    .filter((c) => c.canyada !== null)
    .map((c) => {
      const a = centros.get(c.desde);
      const b = centros.get(c.hasta);
      return a === undefined || b === undefined
        ? ''
        : `<line x1="${String(a[0])}" y1="${String(a[1])}" x2="${String(b[0])}" y2="${String(b[1])}"/>`;
    })
    .join('');
  const recuas = RECORRIDOS.map(({ canyada, segundos, color }, i) => {
    const puntos = recorrido(mundo, canyada).flatMap((id) => {
      const p = centros.get(id);
      return p === undefined ? [] : [p];
    });
    if (puntos.length < 2) return '';
    const ida = puntos
      .map(([x, y], j) => `${j === 0 ? 'M' : 'L'}${String(x)} ${String(y)}`)
      .join(' ');
    const vuelta = [...puntos]
      .reverse()
      .slice(1)
      .map(([x, y]) => `L${String(x)} ${String(y)}`)
      .join(' ');
    return `<g class="recua"><circle r="7" fill="${color}" stroke="#f4ecd8" stroke-width="2.5"><animateMotion dur="${String(segundos)}s" begin="${String(-i * 5)}s" repeatCount="indefinite" path="${ida} ${vuelta}"/></circle></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800">
<style>.recua{opacity:.95}@media (prefers-reduced-motion: reduce){.recua{display:none}}</style>
<g stroke="#8a7a5e" stroke-width="1" stroke-linejoin="round">${comarcas}</g>
<g stroke="#9c6b2f" stroke-width="2.4" stroke-dasharray="5 4" stroke-linecap="round" opacity=".75">${canyadas}</g>
${recuas}
</svg>
`;
}
