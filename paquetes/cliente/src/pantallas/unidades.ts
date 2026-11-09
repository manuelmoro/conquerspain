// Tus recuas y rebaños (fichas T-083 §4.5 y T-093): dónde están, adónde van, qué hacen y qué llevan,
// línea a línea, con «Ver en el mapa» y el botón para darles ruta. Va en el panel, encima de la bandeja.
import { RECURSOS } from '@conquer/nucleo';
import type { Orden, Rebanyo, Recua, SituacionMovil } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import { destacarUnidad, unidadDestacada } from '../destacada.ts';
import { lineasDeRecua } from '../recuas.ts';
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

function verEnElMapa(almacen: Almacen, id: string): HTMLElement {
  const b = boton(
    unidadDestacada() === id ? '📍 Dejar de señalar' : '📍 Ver en el mapa',
    () => {
      destacarUnidad(id);
      // El mapa tiene que verse: fuera la ficha (y con ella el plano) y arriba la vista.
      almacen.abrirComarca(null);
      requestAnimationFrame(() => {
        document.querySelector('.contenedor-atlas')?.scrollIntoView({ block: 'center' });
      });
    },
    'secundario',
  );
  return b;
}

/**
 * En casa y con mercancia: un toque para pasarla al almacen (T-093). Lo comprado viaja en la recua, y
 * sin descargarlo no se come ni se gasta. Los maravedis se quedan: son para la proxima compra.
 */
function descargar(almacen: Almacen, r: Recua): HTMLElement | string {
  const vista = almacen.estado.partida?.recibido.vista;
  const donde = r.situacion.donde === 'comarca' ? r.situacion.comarca : null;
  if (donde === null || vista?.comarcas[donde]?.nivel !== 'propia') return '';
  const mercancia = Object.fromEntries(
    RECURSOS.filter((k) => k !== 'maravedis' && r.carga[k] > 0).map((k) => [k, r.carga[k]]),
  );
  if (Object.keys(mercancia).length === 0) return '';
  return boton('📥 Descargar al almacén', () => {
    void almacen.anyadir({
      tipo: 'carga',
      recua: r.id,
      cargar: {},
      descargar: mercancia,
      vecinosCargados: 0,
    });
  });
}

function tarjetaDeRecua(
  almacen: Almacen,
  r: Recua,
  ordenes: readonly Orden[],
  nombre: (id: string) => string,
): HTMLElement {
  return el(
    'li',
    { class: unidadDestacada() === r.id ? 'unidad destacada' : 'unidad' },
    el('strong', {}, `🐴 ${r.nombre}`),
    el(
      'ul',
      { class: 'lineas-de-unidad' },
      ...lineasDeRecua(r, ordenes, nombre).map((l) =>
        el('li', {}, el('span', { 'aria-hidden': 'true' }, l.icono), ` ${l.texto}`),
      ),
    ),
    el(
      'p',
      { class: 'fila' },
      descargar(almacen, r),
      verEnElMapa(almacen, r.id),
      boton(
        r.ruta.length === 0 ? 'Darle ruta' : 'Cambiar su ruta',
        () => {
          almacen.abrirEditor({ clase: 'recua', id: r.id });
        },
        'secundario',
      ),
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
    el('strong', {}, `🐑 ${r.nombre}`),
    el(
      'p',
      { class: 'suave' },
      `${dondeEsta(r.situacion, nombre)}. ${String(r.cabezas)} cabezas. ${rutaQueQueda(r.ruta, nombre)}`,
    ),
    el(
      'p',
      { class: 'fila' },
      verEnElMapa(almacen, r.id),
      boton(
        'Darle ruta',
        () => {
          almacen.abrirEditor({ clase: 'rebanyo', id: r.id });
        },
        'secundario',
      ),
    ),
  );
}

export function pantallaDeUnidades(
  almacen: Almacen,
  recuas: readonly Recua[],
  rebanyos: readonly Rebanyo[],
  ordenes: readonly Orden[],
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
        ...recuas.map((r) => tarjetaDeRecua(almacen, r, ordenes, nombre)),
        ...rebanyos.map((r) => tarjetaDeRebanyo(almacen, r, nombre)),
      ),
    );
  }
  return el('section', { class: 'unidades tarjeta' }, ...partes);
}
