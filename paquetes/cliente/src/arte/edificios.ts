// Los edificios en perspectiva isometrica para el plano de la comarca (ficha T-092). Cada parcela es un
// rombo de suelo con su edificio encima, dibujado con caras planas: se reconoce de un vistazo que es una
// granja, una salina o una ferreria. Todo sale de aqui como marcado SVG fijo, sin datos del jugador.
import type { TipoEdificio } from '@conquer/nucleo';

/** Medio ancho y medio alto del rombo de una parcela, en unidades del plano. */
export const MEDIO_ANCHO = 60;
export const MEDIO_ALTO = 30;

/** Un punto del suelo de la parcela (u, v entre -1 y 1) a `z` de altura, en pantalla. */
function p(u: number, v: number, z = 0): string {
  const x = ((u - v) * MEDIO_ANCHO) / 2;
  const y = ((u + v) * MEDIO_ALTO) / 2 - z;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

function poligono(puntos: readonly string[], relleno: string, extra = ''): string {
  return `<polygon points="${puntos.join(' ')}" fill="${relleno}"${extra}/>`;
}

const LINEA = ' stroke="#3b2f22" stroke-opacity=".35" stroke-width=".8" stroke-linejoin="round"';

interface Colores {
  readonly cara: string;
  readonly lado: string;
  readonly techo: string;
}

const CAL: Colores = { cara: '#f3ead6', lado: '#d8c7a6', techo: '#efe4cc' };
const PIEDRA: Colores = { cara: '#c9c2b4', lado: '#a69f90', techo: '#d6d0c3' };
const MADERA: Colores = { cara: '#b7834f', lado: '#8e6237', techo: '#c99862' };
const TEJA = { frente: '#c0573c', fondo: '#933f2b' };
const PIZARRA = { frente: '#5d6168', fondo: '#43464c' };

/** Una caja de u0..u1 por v0..v1 y altura h, con las dos caras que se ven y el techo plano. */
function caja(
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  h: number,
  c: Colores,
  z = 0,
): string {
  return [
    poligono([p(u0, v1, z), p(u1, v1, z), p(u1, v1, z + h), p(u0, v1, z + h)], c.cara, LINEA),
    poligono([p(u1, v0, z), p(u1, v1, z), p(u1, v1, z + h), p(u1, v0, z + h)], c.lado, LINEA),
    poligono(
      [p(u0, v0, z + h), p(u1, v0, z + h), p(u1, v1, z + h), p(u0, v1, z + h)],
      c.techo,
      LINEA,
    ),
  ].join('');
}

/** Un tejado a dos aguas sobre la caja, con la cumbrera a lo largo de u. */
function tejado(
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  h: number,
  alto: number,
  t: { frente: string; fondo: string } = TEJA,
): string {
  const vm = (v0 + v1) / 2;
  return [
    poligono(
      [p(u0, v0, h), p(u1, v0, h), p(u1, vm, h + alto), p(u0, vm, h + alto)],
      t.fondo,
      LINEA,
    ),
    poligono([p(u1, v0, h), p(u1, v1, h), p(u1, vm, h + alto)], CAL.lado, LINEA),
    poligono(
      [p(u0, v1, h), p(u1, v1, h), p(u1, vm, h + alto), p(u0, vm, h + alto)],
      t.frente,
      LINEA,
    ),
  ].join('');
}

function casita(
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  h: number,
  c: Colores = CAL,
  t = TEJA,
): string {
  return caja(u0, v0, u1, v1, h, c) + tejado(u0, v0, u1, v1, h, h * 0.7, t);
}

function punto(u: number, v: number, z: number, r: number, color: string, extra = ''): string {
  const [x, y] = p(u, v, z).split(',');
  return `<circle cx="${x ?? '0'}" cy="${y ?? '0'}" r="${String(r)}" fill="${color}"${extra}/>`;
}

function raya(a: string, b: string, color: string, ancho: number, extra = ''): string {
  const [x1, y1] = a.split(',');
  const [x2, y2] = b.split(',');
  return `<line x1="${x1 ?? '0'}" y1="${y1 ?? '0'}" x2="${x2 ?? '0'}" y2="${y2 ?? '0'}" stroke="${color}" stroke-width="${String(ancho)}" stroke-linecap="round"${extra}/>`;
}

/** El rombo de suelo con su grosor, del color del terreno de la parcela. */
export function losa(color: string, borde = ''): string {
  const g = 7;
  return [
    poligono([p(-1, 1), p(1, 1), p(1, 1, -g), p(-1, 1, -g)], '#8a7650'),
    poligono([p(1, -1), p(1, 1), p(1, 1, -g), p(1, -1, -g)], '#6f5e3f'),
    poligono([p(-1, -1), p(1, -1), p(1, 1), p(-1, 1)], color, borde),
  ].join('');
}

const SUELO: Readonly<Record<TipoEdificio, string>> = {
  granja: '#dcc46e',
  huerta: '#86b25e',
  molino: '#cdbb7a',
  granero: '#c9b98f',
  aserradero: '#7f9e5c',
  carbonera: '#8c8a6a',
  cantera: '#bdb5a5',
  ferreria: '#a99c86',
  salina: '#e3ecee',
  majada: '#9dbb6c',
  lonja: '#d4c39b',
  mercado: '#d9cba9',
  venta: '#c8b88f',
  casas: '#d7c7a2',
  cerca: '#a3b974',
  acequia: '#8fba68',
};

export function sueloDe(tipo: TipoEdificio): string {
  return SUELO[tipo];
}

function surcos(color: string, paso: number): string {
  const lineas: string[] = [];
  for (let v = -0.85; v <= 0.86; v += paso) lineas.push(raya(p(-0.9, v), p(0.9, v), color, 1.4));
  return lineas.join('');
}

const DIBUJOS: Readonly<Record<TipoEdificio, () => string>> = {
  // De atras adelante: la del fondo primero, y las dos de delante a cada lado.
  casas: () =>
    casita(-0.65, -0.8, -0.1, -0.3, 12) +
    casita(-0.8, 0.05, -0.2, 0.65, 13) +
    casita(0.05, -0.8, 0.65, -0.2, 11),
  granja: () => surcos('#b89a3c', 0.22) + casita(0.35, -0.9, 0.85, -0.45, 11, MADERA),
  huerta: () => {
    const plantas: string[] = [];
    for (let u = -0.7; u <= 0.71; u += 0.28)
      for (let v = -0.7; v <= 0.5; v += 0.3) plantas.push(punto(u, v, 2, 3.2, '#3f7a32'));
    return plantas.join('') + raya(p(-0.95, 0.82), p(0.95, 0.82), '#5aa0c8', 3);
  },
  molino: () => {
    const cuerpo = caja(-0.25, -0.25, 0.25, 0.25, 30, CAL);
    const tejadillo = poligono(
      [p(-0.25, 0.25, 30), p(0.25, 0.25, 30), p(0.25, -0.25, 30), p(0, 0, 44)],
      TEJA.frente,
      LINEA,
    );
    const eje = p(0.3, 0.3, 28);
    const [x, y] = eje.split(',').map(Number);
    const aspas = [0, 90, 180, 270]
      .map((a) => {
        const r = ((a + 25) * Math.PI) / 180;
        const fin = `${((x ?? 0) + Math.cos(r) * 24).toFixed(1)},${((y ?? 0) + Math.sin(r) * 24).toFixed(1)}`;
        return raya(eje, fin, '#6b4a2a', 2.2);
      })
      .join('');
    return (
      surcos('#b8a35a', 0.3) + cuerpo + tejadillo + aspas + punto(0.3, 0.3, 28, 2.6, '#3b2f22')
    );
  },
  granero: () =>
    casita(-0.55, -0.45, 0.55, 0.45, 22, PIEDRA) +
    raya(p(0.55, 0, 2), p(0.55, 0, 12), '#5b4630', 5),
  aserradero: () =>
    caja(-0.7, -0.7, 0.1, 0.0, 12, MADERA) +
    tejado(-0.7, -0.7, 0.1, 0.0, 12, 8) +
    [0.25, 0.45, 0.65].map((u) => raya(p(u, 0.15, 3), p(u, 0.8, 3), '#7a5230', 6)).join('') +
    punto(-0.4, 0.6, 4, 7, '#3f6b30') +
    punto(-0.7, 0.35, 4, 6, '#4b7a37'),
  carbonera: () =>
    `<ellipse cx="0" cy="3" rx="36" ry="17" fill="#6d5f4f"/>` +
    `<path d="M-28 5 C-25 -36 25 -36 28 5 Q0 14 -28 5 Z" fill="#4a423c"${LINEA}/>` +
    `<path d="M-14 -16 C-8 -26 6 -27 12 -20" fill="none" stroke="#6a6058" stroke-width="3" stroke-linecap="round"/>` +
    [0, 1, 2]
      .map((i) => punto(0.1 * i, -0.1 * i, 30 + 10 * i, 5 + i * 1.5, '#9a958e', ' opacity=".55"'))
      .join(''),
  cantera: () =>
    caja(-0.85, -0.85, 0.3, -0.2, 22, PIEDRA) +
    caja(-0.85, -0.2, -0.1, 0.5, 12, PIEDRA) +
    caja(0.35, 0.3, 0.6, 0.55, 6, PIEDRA) +
    caja(0.55, -0.1, 0.8, 0.15, 6, PIEDRA),
  ferreria: () =>
    caja(-0.6, -0.5, 0.4, 0.4, 15, PIEDRA) +
    tejado(-0.6, -0.5, 0.4, 0.4, 15, 9, PIZARRA) +
    caja(-0.45, -0.35, -0.2, -0.1, 36, PIEDRA) +
    punto(-0.33, -0.22, 42, 6, '#8a8580', ' opacity=".5"') +
    poligono([p(0.0, 0.4, 0), p(0.25, 0.4, 0), p(0.25, 0.4, 9), p(0.0, 0.4, 9)], '#f08a2c'),
  salina: () => {
    const balsas: string[] = [];
    for (let i = 0; i < 3; i += 1)
      for (let j = 0; j < 3; j += 1) {
        const u = -0.9 + i * 0.62;
        const v = -0.9 + j * 0.62;
        const color = (i + j) % 2 === 0 ? '#a9cfe0' : '#f6f7f4';
        balsas.push(
          poligono([p(u, v), p(u + 0.52, v), p(u + 0.52, v + 0.52), p(u, v + 0.52)], color, LINEA),
        );
      }
    const monton = `<path d="M${p(0.55, 0.55)} L${p(0.85, 0.85, 0)} L${p(0.7, 0.7, 16)} Z" fill="#ffffff"${LINEA}/>`;
    return balsas.join('') + monton;
  },
  majada: () => {
    const valla = [p(-0.85, -0.85, 5), p(0.85, -0.85, 5), p(0.85, 0.85, 5), p(-0.85, 0.85, 5)];
    const ovejas = [
      [-0.4, -0.3],
      [0.1, -0.5],
      [0.3, 0.1],
      [-0.2, 0.3],
      [0.5, 0.5],
      [-0.6, 0.4],
    ]
      .map(
        ([u, v]) =>
          punto(u ?? 0, v ?? 0, 4, 5, '#fbf8f0', LINEA) +
          punto((u ?? 0) + 0.1, (v ?? 0) - 0.05, 5, 2, '#2e2a26'),
      )
      .join('');
    return (
      `<polygon points="${valla.join(' ')}" fill="none" stroke="#7a5230" stroke-width="2" stroke-dasharray="5 3"/>` +
      casita(-0.85, -0.85, -0.4, -0.45, 9, MADERA) +
      ovejas
    );
  },
  lonja: () =>
    poligono([p(0.2, -1), p(1, -1), p(1, 1), p(0.2, 1)], '#5d9fc4') +
    raya(p(0.2, -1), p(0.2, 1), '#e8f2f6', 1.5) +
    casita(-0.8, -0.5, -0.05, 0.4, 12, CAL) +
    `<path d="M${p(0.45, 0.1, 1)} L${p(0.75, 0.1, 1)} L${p(0.7, 0.35, 1)} L${p(0.5, 0.35, 1)} Z" fill="#7a5230"/>`,
  mercado: () => {
    const puesto = (u: number, v: number, color: string): string =>
      caja(u, v, u + 0.4, v + 0.4, 6, MADERA) +
      poligono(
        [
          p(u - 0.05, v - 0.05, 14),
          p(u + 0.45, v - 0.05, 14),
          p(u + 0.45, v + 0.45, 10),
          p(u - 0.05, v + 0.45, 10),
        ],
        color,
        LINEA,
      );
    return (
      puesto(-0.7, -0.7, '#c0573c') +
      puesto(0.15, -0.7, '#e7c14a') +
      puesto(-0.7, 0.15, '#4f86b8') +
      puesto(0.2, 0.2, '#c0573c')
    );
  },
  venta: () =>
    raya(p(-1, 0.6), p(1, 0.6), '#bca77b', 9) +
    casita(-0.7, -0.75, 0.4, -0.05, 15, CAL) +
    raya(p(0.6, 0.15, 0), p(0.6, 0.15, 22), '#5b4630', 2) +
    poligono([p(0.6, 0.15, 22), p(0.6, 0.45, 22), p(0.6, 0.45, 15), p(0.6, 0.15, 15)], '#c0573c'),
  cerca: () =>
    caja(-0.95, -0.95, 0.95, -0.8, 10, PIEDRA) +
    caja(-0.95, -0.8, -0.8, 0.95, 10, PIEDRA) +
    caja(0.8, -0.8, 0.95, 0.95, 10, PIEDRA) +
    caja(-0.8, 0.8, 0.95, 0.95, 10, PIEDRA) +
    caja(0.75, 0.75, 1.0, 1.0, 18, PIEDRA),
  acequia: () =>
    surcos('#6e9a4a', 0.3) +
    poligono([p(-1, -0.15), p(1, -0.15), p(1, 0.15), p(-1, 0.15)], '#5aa0c8', LINEA) +
    caja(-0.1, -0.3, 0.1, 0.3, 4, PIEDRA),
};

export function dibujoDeEdificio(tipo: TipoEdificio): string {
  return losa(SUELO[tipo]) + DIBUJOS[tipo]();
}

/** Una obra: el edificio a medio levantar entre andamios, mas alto cuanto mas avanza. */
export function dibujoDeObra(avance: number): string {
  const h = 4 + Math.round((14 * Math.max(0, Math.min(100, avance))) / 100);
  const postes = [
    [-0.6, -0.6],
    [0.6, -0.6],
    [0.6, 0.6],
    [-0.6, 0.6],
  ]
    .map(([u, v]) => raya(p(u ?? 0, v ?? 0, 0), p(u ?? 0, v ?? 0, 26), '#7a5230', 1.8))
    .join('');
  return (
    losa('#cbb68c') +
    caja(-0.5, -0.5, 0.5, 0.5, h, CAL) +
    postes +
    raya(p(-0.6, 0.6, 18), p(0.6, 0.6, 18), '#7a5230', 1.8) +
    raya(p(0.6, -0.6, 18), p(0.6, 0.6, 18), '#7a5230', 1.8) +
    raya(p(-0.6, 0.6, 4), p(0.6, 0.6, 22), '#7a5230', 1.2)
  );
}

/** Lo pedido que aun no empieza: el edificio en transparencia sobre el solar, con un reloj de arena. */
export function dibujoPedido(tipo: TipoEdificio): string {
  return (
    losa('#e6dcc3', ' stroke="#1f4e9c" stroke-width="1.4" stroke-dasharray="5 4"') +
    `<g opacity=".45">${DIBUJOS[tipo]()}</g>` +
    '<circle cy="-4" r="11" fill="#faf5e8" stroke="#1f4e9c" stroke-width="1.5"/>' +
    '<text y="1" text-anchor="middle" font-size="13">⏳</text>'
  );
}

/** Un nivel que se va a derribar: tachado con un aspa roja. */
export function tachado(): string {
  return (
    // En pantalla, no sobre el rombo: sobre el rombo, la perspectiva la convertia en una cruz.
    raya('-18,-14', '18,14', '#b3261e', 5, ' opacity=".9"') +
    raya('18,-14', '-18,14', '#b3261e', 5, ' opacity=".9"')
  );
}

/** Un solar libre: tierra con el contorno a trazos y una cruz de «aqui cabe algo». */
export function dibujoLibre(): string {
  return (
    losa('#e6dcc3', ' stroke="#8a7650" stroke-width="1.2" stroke-dasharray="5 4"') +
    '<circle r="9" fill="#faf5e8" stroke="#8a7650" stroke-width="1.2" opacity=".85"/>' +
    raya('-4.5,0', '4.5,0', '#8a7650', 2) +
    raya('0,-4.5', '0,4.5', '#8a7650', 2)
  );
}

/** La plaza del pueblo, que no es un solar: la iglesia, y en la capital una torre con su pendon. */
export function dibujoDePlaza(capital: boolean): string {
  const torre = capital ? 46 : 32;
  return (
    losa('#d8cdb5') +
    caja(-0.55, -0.15, 0.25, 0.4, 15, PIEDRA) +
    tejado(-0.55, -0.15, 0.25, 0.4, 15, 9) +
    caja(0.25, -0.3, 0.6, 0.05, torre, PIEDRA) +
    poligono(
      [p(0.25, 0.05, torre), p(0.6, 0.05, torre), p(0.6, -0.3, torre), p(0.42, -0.12, torre + 14)],
      TEJA.frente,
      LINEA,
    ) +
    (capital
      ? raya(p(0.42, -0.12, torre + 14), p(0.42, -0.12, torre + 30), '#3b2f22', 1.5) +
        poligono(
          [p(0.42, -0.12, torre + 30), p(0.42, 0.25, torre + 26), p(0.42, -0.12, torre + 22)],
          '#b3261e',
        )
      : '')
  );
}
