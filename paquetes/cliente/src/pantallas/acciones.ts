// Las tarjetas de accion (T-082, T-092): cada una con su coste, su duracion y su confirmacion con el
// efecto previsto, o la causa y la salida si esta bloqueada. Las usan la ficha y el plano de la comarca,
// y comparten cual esta abierta: elegir en el plano abre la misma que en la ficha.
import type { AccionDeFicha } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import { fichasDeRecursos } from './comun.ts';
import { boton, el } from './dom.ts';

const TURNOS_DE_PLAN = 6;
/** La accion abierta y la ultima dada, por comarca: sobreviven a las repintadas. */
let abierta: string | null = null;
let dada: string | null = null;

function confirmacion(
  almacen: Almacen,
  accion: AccionDeFicha,
  turno: number,
  clave: string,
): HTMLElement {
  if (accion.bloqueo !== null) {
    return el(
      'div',
      { class: 'confirmacion' },
      el('p', {}, el('strong', {}, 'No se puede: '), accion.bloqueo.causa),
      el('p', {}, el('strong', {}, 'Qué hacer: '), accion.bloqueo.salida),
    );
  }
  // Una mision son varias ordenes encadenadas con sus fechas: se da entera y ahora.
  if (accion.intenciones.length > 1) {
    return el(
      'div',
      { class: 'confirmacion' },
      el('p', {}, el('strong', {}, 'Previsto: '), accion.efecto),
      el(
        'p',
        { class: 'fila' },
        el('strong', {}, 'Se lleva del almacén:'),
        fichasDeRecursos(accion.coste),
      ),
      el(
        'p',
        { class: 'fila' },
        boton('Mandarla', () => {
          dada = clave;
          abierta = null;
          void almacen.anyadirVarias(accion.intenciones);
        }),
        boton(
          'Cancelar',
          () => {
            abierta = null;
            almacen.refrescar();
          },
          'secundario',
        ),
      ),
    );
  }
  const cuando = el('select', { 'aria-label': 'Cuándo' });
  cuando.append(el('option', { value: '' }, 'Ahora'));
  for (let t = turno + 1; t <= turno + TURNOS_DE_PLAN; t += 1) {
    cuando.append(el('option', { value: String(t) }, `En el turno ${String(t)}`));
  }
  return el(
    'div',
    { class: 'confirmacion' },
    el('p', {}, el('strong', {}, 'Previsto: '), accion.efecto),
    el('p', { class: 'fila' }, el('strong', {}, 'Coste:'), fichasDeRecursos(accion.coste)),
    el(
      'p',
      {},
      el('strong', {}, 'Tarda: '),
      `${String(accion.turnos)} turno${accion.turnos === 1 ? '' : 's'}`,
    ),
    el(
      'p',
      { class: 'fila' },
      el('label', { class: 'suave' }, 'Cuándo'),
      cuando,
      boton(
        'Dar la orden',
        () => {
          const programado = cuando.value === '' ? {} : { turnoProgramado: Number(cuando.value) };
          dada = clave;
          abierta = null;
          void almacen.anyadir({ ...accion.intencion, ...programado });
        },
        'dar-la-orden',
      ),
      boton(
        'Cancelar',
        () => {
          abierta = null;
          almacen.refrescar();
        },
        'secundario',
      ),
    ),
  );
}

export function accionAbierta(comarca: string, clave: string): boolean {
  return abierta === `${comarca}|${clave}`;
}

export function cerrarAccion(): void {
  abierta = null;
}

export function tarjetaDeAccion(
  almacen: Almacen,
  comarca: string,
  accion: AccionDeFicha,
  turno: number,
): HTMLElement {
  const clave = `${comarca}|${accion.clave}`;
  const item = el('li', {
    class: accion.bloqueo === null ? 'accion' : 'accion bloqueada',
    'data-clave': accion.clave,
  });
  item.append(
    el(
      'div',
      { class: 'fila' },
      el('span', { class: 'titulo' }, accion.titulo),
      accion.bloqueo === null ? fichasDeRecursos(accion.coste, { vacio: 'gratis' }) : '',
      el('span', { class: 'etiqueta' }, `${String(accion.turnos)} t`),
      dada === clave ? el('span', { class: 'etiqueta' }, '✓ enviada') : '',
      boton(
        abierta === clave ? 'Cerrar' : accion.bloqueo === null ? 'Elegir' : 'Por qué',
        () => {
          abierta = abierta === clave ? null : clave;
          almacen.refrescar();
        },
        'secundario icono empuje',
      ),
    ),
  );
  // Lo que da, a la vista sin abrirla (T-092): «+5 pan por turno», «Capacidad de 60 a 90 vecinos».
  if (abierta === clave) item.append(confirmacion(almacen, accion, turno, clave));
  else if (accion.bloqueo === null && accion.efecto !== '')
    item.append(el('p', { class: 'suave efecto-de-accion' }, accion.efecto));
  return item;
}
