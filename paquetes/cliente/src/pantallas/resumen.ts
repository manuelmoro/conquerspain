// El resumen del turno (T-088): que ha cambiado en tus recursos y en tu gente, y la cronica del turno
// por secciones, avisos primero, con la accion sugerida y un boton para ver la comarca.
import { SECCIONES_DE_CRONICA } from '@conquer/nucleo';
import type { SeccionDeCronica } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import type { ResumenDeTurno } from '../resumen.ts';
import { MARCA_DE_RECURSO, NOMBRE_DE_RECURSO } from '../nombres.ts';
import { boton, el } from './dom.ts';

const TITULO: Readonly<Record<SeccionDeCronica, string>> = {
  avisos: 'Lo que pide tu atención',
  sucesos: 'Lo que ha pasado',
  economia: 'Cuentas',
  rumores: 'Rumores',
  hitos: 'Hitos',
};

function conSigno(n: number): string {
  return n > 0 ? `+${String(n)}` : String(n);
}

/** Por recurso: lo que habia, lo producido, lo demas (comida, obras, comercio…) y lo que hay; en verde si creces, en rojo si no. */
function tablaDeCambios(resumen: ResumenDeTurno): HTMLElement {
  const filas = resumen.recursos
    .filter((c) => c.antes !== 0 || c.despues !== 0 || c.producido !== 0)
    .map((c) =>
      el(
        'tr',
        {},
        el(
          'th',
          { scope: 'row' },
          `${MARCA_DE_RECURSO[c.recurso]} ${NOMBRE_DE_RECURSO[c.recurso]}`,
        ),
        el('td', {}, String(c.antes)),
        el('td', {}, c.producido === 0 ? '·' : `+${String(c.producido)}`),
        el('td', {}, c.otros === 0 ? '·' : conSigno(c.otros)),
        el('td', {}, String(c.despues)),
        el(
          'td',
          {},
          el(
            'span',
            { class: c.cambio > 0 ? 'chip sube' : c.cambio < 0 ? 'chip baja' : 'suave' },
            conSigno(c.cambio),
          ),
        ),
      ),
    );
  return el(
    'table',
    { class: 'cambios' },
    el(
      'thead',
      {},
      el(
        'tr',
        {},
        ...['', 'Tenías', 'Producido', 'Otros', 'Tienes', 'Cambio'].map((t) =>
          el('th', { scope: 'col' }, t),
        ),
      ),
    ),
    el('tbody', {}, ...filas),
  );
}

export function dialogoDeResumen(
  almacen: Almacen,
  resumen: ResumenDeTurno,
  nombreDeComarca: (id: string) => string,
): HTMLElement {
  const gente = resumen.poblacion.despues - resumen.poblacion.antes;
  const cuantos = resumen.hasta - resumen.desde;
  const partes: (Node | string)[] = [
    boton(
      '✕',
      () => {
        almacen.cerrarResumen();
      },
      'cerrar secundario icono',
    ),
    el(
      'h2',
      {},
      cuantos === 1
        ? `Turno ${String(resumen.desde)} resuelto`
        : `Turnos ${String(resumen.desde)} a ${String(resumen.hasta - 1)} resueltos`,
    ),
    el('p', { class: 'suave' }, resumen.cronicas[0]?.fecha ?? ''),
    el(
      'section',
      {},
      el('h3', {}, 'Cómo han cambiado tus recursos'),
      tablaDeCambios(resumen),
      el(
        'p',
        { class: 'suave' },
        'Otros: lo que come tu gente, lo que apartan las obras, los insumos, los derribos y el comercio; el detalle, en «Cuentas».',
      ),
      el(
        'p',
        { class: gente > 0 ? 'chip sube' : gente < 0 ? 'chip baja' : 'suave' },
        `Vecinos: ${String(resumen.poblacion.antes)} → ${String(resumen.poblacion.despues)}`,
      ),
    ),
  ];
  for (const seccion of SECCIONES_DE_CRONICA) {
    const entradas = resumen.cronicas.flatMap((c) =>
      c.entradas.filter((e) => e.seccion === seccion),
    );
    if (entradas.length === 0) continue;
    const lista = el('ul', { class: `lista seccion-${seccion}` });
    for (const entrada of entradas) {
      const item = el('li', {}, entrada.texto);
      if (entrada.accionSugerida !== null)
        item.append(el('p', { class: 'suave' }, `Qué hacer: ${entrada.accionSugerida}`));
      const comarca = entrada.comarca;
      if (comarca !== null) {
        item.append(
          boton(
            `Ver ${nombreDeComarca(comarca)}`,
            () => {
              almacen.cerrarResumen();
              almacen.abrirComarca(comarca);
            },
            'secundario icono',
          ),
        );
      }
      lista.append(item);
    }
    partes.push(el('section', {}, el('h3', {}, TITULO[seccion]), lista));
  }
  partes.push(
    el(
      'p',
      {},
      boton('Entendido', () => {
        almacen.cerrarResumen();
      }),
    ),
  );
  const fondo = el(
    'div',
    { class: 'fondo', role: 'dialog', 'aria-modal': 'true' },
    el('div', { class: 'dialogo', 'data-conservar-scroll': 'resumen' }, ...partes),
  );
  fondo.addEventListener('click', (e) => {
    if (e.target === fondo) almacen.cerrarResumen();
  });
  return fondo;
}
