// Piezas que comparten las pantallas (T-088): recursos como fichas, y el nombre legible de una orden.
import { RECURSOS, TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type { Recursos } from '@conquer/nucleo';

import { MARCA_DE_RECURSO, NOMBRE_DE_RECURSO, nombreDeOrden } from '../nombres.ts';
import { el } from './dom.ts';

/** Una ficha por recurso distinto de cero; con `signo`, verde lo que sube y rojo lo que baja. */
export function fichasDeRecursos(r: Recursos, opciones: { signo?: boolean } = {}): HTMLElement {
  const caja = el('span', { class: 'recursos' });
  const hay = RECURSOS.filter((x) => r[x] !== 0);
  if (hay.length === 0)
    caja.append(el('span', { class: 'suave' }, opciones.signo === true ? 'sin cambios' : 'nada'));
  for (const x of hay) {
    const valor = r[x];
    const texto = opciones.signo === true && valor > 0 ? `+${String(valor)}` : String(valor);
    const clase = opciones.signo === true ? (valor > 0 ? 'chip sube' : 'chip baja') : 'chip';
    caja.append(
      el(
        'span',
        { class: clase, title: NOMBRE_DE_RECURSO[x] },
        `${MARCA_DE_RECURSO[x]} ${texto} ${NOMBRE_DE_RECURSO[x]}`,
      ),
    );
  }
  return caja;
}

/**
 * «Construir granja en Llanada Alavesa»: el tipo de orden, lo que construye y donde, con nombres. La
 * comarca se nombra con la funcion que se le da (el atlas sabe los nombres).
 */
export function describirOrden(orden: object, nombreDeComarca: (id: string) => string): string {
  const campos = new Map<string, unknown>(Object.entries(orden));
  const partes = [nombreDeOrden(campos.get('tipo'))];
  const edificio = campos.get('edificio');
  if (typeof edificio === 'string') {
    const datos = Object.entries(TABLAS_DEL_JUEGO.edificios).find(([k]) => k === edificio)?.[1];
    if (datos !== undefined) partes.push(datos.nombre.toLowerCase());
  }
  const comarca = campos.get('comarca');
  if (typeof comarca === 'string') partes.push(`en ${nombreDeComarca(comarca)}`);
  return partes.join(' ');
}
