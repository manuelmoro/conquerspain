// Tus recuas y rebaños (ficha T-083 §4.5): dónde están, qué llevan, qué ruta les queda y qué hacen,
// con el botón para darles ruta. Va en el panel, encima de la bandeja.
import type { Rebanyo, Recua, SituacionMovil } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import { NOMBRE_DE_COMETIDO } from '../nombres.ts';
import { fichasDeRecursos } from './comun.ts';
import { boton, el } from './dom.ts';

function dondeEsta(situacion: SituacionMovil, nombre: (id: string) => string): string {
  return situacion.donde === 'comarca'
    ? `En ${nombre(situacion.comarca)}`
    : `De camino de ${nombre(situacion.desde)} a ${nombre(situacion.hasta)}`;
}

function rutaQueQueda(ruta: readonly string[], nombre: (id: string) => string): string {
  if (ruta.length === 0) return 'Quieta, sin ruta.';
  const destino = ruta[ruta.length - 1] ?? '';
  return `Va hacia ${nombre(destino)} (${String(ruta.length)} comarca${ruta.length === 1 ? '' : 's'} por delante).`;
}

function tarjetaDeRecua(almacen: Almacen, r: Recua, nombre: (id: string) => string): HTMLElement {
  const lleva = Object.values(r.carga).reduce((total, n) => total + n, 0);
  return el(
    'li',
    {},
    el('div', { class: 'fila' }, el('strong', {}, r.nombre), dondeEsta(r.situacion, nombre)),
    el(
      'p',
      { class: 'suave' },
      `${rutaQueQueda(r.ruta, nombre)}${r.rutaCircular ? ' Ruta circular.' : ''}${
        r.cometido === null ? '' : ` Encargo: ${NOMBRE_DE_COMETIDO[r.cometido]}.`
      }`,
    ),
    el(
      'p',
      { class: 'fila suave' },
      `Lleva ${String(lleva)} de ${String(r.porte)}:`,
      fichasDeRecursos(r.carga),
    ),
    boton(
      r.rutaCircular ? 'Cambiar su ruta' : 'Darle ruta',
      () => {
        almacen.abrirEditor({ clase: 'recua', id: r.id });
      },
      'secundario',
    ),
  );
}

function tarjetaDeRebanyo(
  almacen: Almacen,
  r: Rebanyo,
  nombre: (id: string) => string,
): HTMLElement {
  return el(
    'li',
    {},
    el('div', { class: 'fila' }, el('strong', {}, r.nombre), dondeEsta(r.situacion, nombre)),
    el('p', { class: 'suave' }, `${String(r.cabezas)} cabezas. ${rutaQueQueda(r.ruta, nombre)}`),
    boton(
      'Darle ruta',
      () => {
        almacen.abrirEditor({ clase: 'rebanyo', id: r.id });
      },
      'secundario',
    ),
  );
}

export function pantallaDeUnidades(
  almacen: Almacen,
  recuas: readonly Recua[],
  rebanyos: readonly Rebanyo[],
  nombre: (id: string) => string,
): HTMLElement {
  const partes: (Node | string)[] = [el('h2', {}, 'Tus recuas y rebaños')];
  if (recuas.length === 0 && rebanyos.length === 0) {
    partes.push(
      el(
        'p',
        { class: 'suave' },
        'No tienes ninguna. Fórmalas desde la ficha de una comarca tuya: sin recuas no se explora ni se gana tierra.',
      ),
    );
  } else {
    partes.push(
      el(
        'ul',
        { class: 'lista' },
        ...recuas.map((r) => tarjetaDeRecua(almacen, r, nombre)),
        ...rebanyos.map((r) => tarjetaDeRebanyo(almacen, r, nombre)),
      ),
    );
  }
  return el('section', { class: 'unidades tarjeta' }, ...partes);
}
