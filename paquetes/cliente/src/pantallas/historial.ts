// El historico de un recurso (T-090): al pulsar un recurso de «Tienes», en que se fue y de donde vino
// (T-126), lo que entro y salio cada turno y lo que quedo, con un grafico pequenyo y la tabla. Es lo
// propio del jugador, de sus movimientos.
import type { Recurso } from '@conquer/nucleo';

import type { HistorialRecibido, TurnoDelHistorial } from '../api.ts';
import { desgloseDe } from '../desglose.ts';
import type { LineaDelDesglose, NombresDelDesglose } from '../desglose.ts';
import { MARCA_DE_RECURSO, NOMBRE_DE_RECURSO } from '../nombres.ts';
import { boton, el } from './dom.ts';

const SVG = 'http://www.w3.org/2000/svg';

function nodo(etiqueta: string, atributos: Record<string, string>): SVGElement {
  const n = document.createElementNS(SVG, etiqueta);
  for (const [k, v] of Object.entries(atributos)) n.setAttribute(k, v);
  return n;
}

/** Barras de lo que entra (arriba, verde) y sale (abajo, rojo), y la linea de lo que queda. */
function grafico(turnos: readonly TurnoDelHistorial[], recurso: Recurso): SVGSVGElement {
  const ancho = 320;
  const alto = 140;
  const medio = 70;
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', `0 0 ${String(ancho)} ${String(alto)}`);
  svg.setAttribute('class', 'grafico-historial');
  svg.setAttribute('role', 'img');
  svg.setAttribute(
    'aria-label',
    `Entradas, salidas y lo que quedó de ${NOMBRE_DE_RECURSO[recurso]} por turno`,
  );
  const datos = turnos.map((t) => t.recursos[recurso]);
  const maxMov = Math.max(1, ...datos.map((d) => Math.max(d.entra, d.sale)));
  const maxQueda = Math.max(1, ...datos.map((d) => d.queda));
  const paso = ancho / Math.max(1, datos.length);
  svg.append(
    nodo('line', {
      x1: '0',
      x2: String(ancho),
      y1: String(medio),
      y2: String(medio),
      class: 'eje',
    }),
  );
  datos.forEach((d, i) => {
    const x = i * paso + paso * 0.2;
    const w = paso * 0.6;
    const hE = (d.entra / maxMov) * (medio - 6);
    const hS = (d.sale / maxMov) * (medio - 6);
    if (hE > 0)
      svg.append(
        nodo('rect', {
          x: String(x),
          y: String(medio - hE),
          width: String(w),
          height: String(hE),
          class: 'entra',
        }),
      );
    if (hS > 0)
      svg.append(
        nodo('rect', {
          x: String(x),
          y: String(medio),
          width: String(w),
          height: String(hS),
          class: 'sale',
        }),
      );
  });
  const puntos = datos
    .map(
      (d, i) =>
        `${String(i * paso + paso / 2)},${String(alto - 4 - (d.queda / maxQueda) * (alto - 8))}`,
    )
    .join(' ');
  svg.append(nodo('polyline', { points: puntos, class: 'queda' }));
  return svg;
}

/** El turno cuyo desglose se mira: null es el ultimo; 0, todos los del historico. */
let turnoElegido: number | null = null;

/** Una lista del desglose: cada concepto con su cantidad y una barra de lo que pesa. */
function listaDeDesglose(
  titulo: string,
  lineas: readonly LineaDelDesglose[],
  clase: 'sube' | 'baja',
): HTMLElement {
  const total = lineas.reduce((t, l) => t + Math.abs(l.delta), 0);
  return el(
    'div',
    { class: `desglose ${clase}` },
    el('h3', {}, titulo),
    lineas.length === 0
      ? el('p', { class: 'suave' }, 'Nada.')
      : el(
          'ul',
          {},
          ...lineas.map((l) => {
            const peso = total === 0 ? 0 : Math.round((Math.abs(l.delta) * 100) / total);
            return el(
              'li',
              {},
              el('span', { class: 'concepto' }, l.texto),
              el(
                'span',
                { class: 'cantidad' },
                `${l.delta > 0 ? '+' : '−'}${String(Math.abs(l.delta))}`,
              ),
              el('span', {
                class: 'barra',
                style: `width: ${String(peso)}%`,
                'aria-hidden': 'true',
              }),
            );
          }),
        ),
  );
}

/** En que se fue y de donde vino el recurso: del turno elegido o de todos. */
function seccionDeDesglose(
  turnos: readonly TurnoDelHistorial[],
  recurso: Recurso,
  nombres: NombresDelDesglose,
  repintar: () => void,
): HTMLElement {
  const ultimo = turnos.at(-1)?.turno ?? 0;
  const elegido = turnoElegido ?? ultimo;
  const mirados = elegido === 0 ? turnos : turnos.filter((t) => t.turno === elegido);
  const { entra, sale } = desgloseDe(mirados, recurso, nombres);
  const selector = el(
    'select',
    { 'aria-label': 'De qué turno es el desglose' },
    ...[...turnos]
      .reverse()
      .map((t) =>
        el(
          'option',
          { value: String(t.turno), ...(t.turno === elegido ? { selected: '' } : {}) },
          t.turno === ultimo
            ? `el último turno (${String(t.turno)})`
            : `el turno ${String(t.turno)}`,
        ),
      ),
    el(
      'option',
      { value: '0', ...(elegido === 0 ? { selected: '' } : {}) },
      `los últimos ${String(turnos.length)} turnos`,
    ),
  );
  selector.addEventListener('change', () => {
    turnoElegido = Number(selector.value);
    repintar();
  });
  return el(
    'section',
    { class: 'seccion-de-desglose' },
    el('p', { class: 'fila' }, el('strong', {}, 'En qué se fue y de dónde vino, en'), selector),
    el(
      'div',
      { class: 'desgloses' },
      listaDeDesglose('De dónde vino', entra, 'sube'),
      listaDeDesglose('En qué se fue', sale, 'baja'),
    ),
  );
}

export function dialogoDeHistorial(
  recurso: Recurso,
  historial: HistorialRecibido | null,
  fallo: boolean,
  nombres: (h: HistorialRecibido) => NombresDelDesglose,
  cerrar: () => void,
  repintar: () => void,
): HTMLElement {
  const salir = (): void => {
    turnoElegido = null;
    cerrar();
  };
  const partes: (Node | string)[] = [
    boton('✕', salir, 'cerrar secundario icono'),
    el('h2', {}, `${MARCA_DE_RECURSO[recurso]} ${NOMBRE_DE_RECURSO[recurso]}`),
  ];
  const turnos = historial?.turnos ?? null;
  if (historial === null || turnos === null)
    partes.push(
      el('p', { class: 'suave' }, fallo ? 'No se pudo traer el histórico.' : 'Cargando…'),
    );
  else if (turnos.length === 0)
    partes.push(el('p', { class: 'suave' }, 'Todavía no se ha resuelto ningún turno.'));
  else {
    const entra = turnos.reduce((t, x) => t + x.recursos[recurso].entra, 0);
    const sale = turnos.reduce((t, x) => t + x.recursos[recurso].sale, 0);
    partes.push(
      seccionDeDesglose(turnos, recurso, nombres(historial), repintar),
      el('h3', {}, 'Turno a turno'),
      el(
        'p',
        { class: 'fila' },
        el('span', { class: 'chip sube' }, `+${String(entra)} entró`),
        el('span', { class: 'chip baja' }, `−${String(sale)} salió`),
        el('span', { class: 'suave' }, `en los últimos ${String(turnos.length)} turnos`),
      ),
      grafico(turnos, recurso),
      el(
        'p',
        { class: 'leyenda-historial suave' },
        '▮ verde: entró · ▮ rojo: salió · línea: lo que te quedó. Toca un turno de la tabla para ver su desglose.',
      ),
    );
    const tabla = el(
      'table',
      { class: 'tabla-historial' },
      el(
        'thead',
        {},
        el(
          'tr',
          {},
          ...['Turno', 'Entró', 'Salió', 'Quedó'].map((t) => el('th', { scope: 'col' }, t)),
        ),
      ),
      el(
        'tbody',
        {},
        ...[...turnos].reverse().map((t) => {
          const c = t.recursos[recurso];
          const elegida = (turnoElegido ?? turnos.at(-1)?.turno) === t.turno;
          const ver = boton(
            String(t.turno),
            () => {
              turnoElegido = t.turno;
              repintar();
            },
            'enlace',
          );
          ver.setAttribute('aria-label', `Ver el desglose del turno ${String(t.turno)}`);
          return el(
            'tr',
            elegida ? { class: 'elegida' } : {},
            el('td', {}, ver),
            el(
              'td',
              { class: c.entra > 0 ? 'sube' : '' },
              c.entra > 0 ? `+${String(c.entra)}` : '·',
            ),
            el('td', { class: c.sale > 0 ? 'baja' : '' }, c.sale > 0 ? `−${String(c.sale)}` : '·'),
            el('td', {}, String(c.queda)),
          );
        }),
      ),
    );
    partes.push(tabla);
  }
  const fondo = el(
    'div',
    { class: 'fondo' },
    el(
      'div',
      {
        class: 'dialogo dialogo-ancho',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': `Histórico de ${NOMBRE_DE_RECURSO[recurso]}`,
      },
      ...partes,
    ),
  );
  fondo.addEventListener('click', (e) => {
    if (e.target === fondo) salir();
  });
  return fondo;
}
