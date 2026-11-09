// El historico de un recurso (T-090): al pulsar un recurso de «Tienes», lo que entro y salio cada turno
// y lo que quedo, con un grafico pequenyo y la tabla. Es lo propio del jugador, de sus movimientos.
import type { Recurso } from '@conquer/nucleo';

import type { TurnoDelHistorial } from '../api.ts';
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

export function dialogoDeHistorial(
  recurso: Recurso,
  turnos: readonly TurnoDelHistorial[] | null,
  fallo: boolean,
  cerrar: () => void,
): HTMLElement {
  const partes: (Node | string)[] = [
    boton('✕', cerrar, 'cerrar secundario icono'),
    el('h2', {}, `${MARCA_DE_RECURSO[recurso]} ${NOMBRE_DE_RECURSO[recurso]}`),
  ];
  if (turnos === null)
    partes.push(
      el('p', { class: 'suave' }, fallo ? 'No se pudo traer el histórico.' : 'Cargando…'),
    );
  else if (turnos.length === 0)
    partes.push(el('p', { class: 'suave' }, 'Todavía no se ha resuelto ningún turno.'));
  else {
    const entra = turnos.reduce((t, x) => t + x.recursos[recurso].entra, 0);
    const sale = turnos.reduce((t, x) => t + x.recursos[recurso].sale, 0);
    partes.push(
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
        '▮ verde: entró · ▮ rojo: salió · línea: lo que te quedó',
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
          return el(
            'tr',
            {},
            el('td', {}, String(t.turno)),
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
        class: 'dialogo',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': `Histórico de ${NOMBRE_DE_RECURSO[recurso]}`,
      },
      ...partes,
    ),
  );
  fondo.addEventListener('click', (e) => {
    if (e.target === fondo) cerrar();
  });
  return fondo;
}
