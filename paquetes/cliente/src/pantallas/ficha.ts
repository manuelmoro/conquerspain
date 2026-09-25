// La ficha de comarca (ficha T-082): estado, potenciales, edificios, produccion con su desglose y las
// acciones. Ninguna se confirma sin ver antes coste, duracion y efecto; una bloqueada dice por que y
// que hacer.
import type { AccionDeFicha, FichaDeComarca } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import { recursosEnTexto } from '../bandeja.ts';
import { boton, el } from './dom.ts';

const TURNOS_DE_PLAN = 6;

function confirmacion(
  almacen: Almacen,
  accion: AccionDeFicha,
  turno: number,
  cerrar: () => void,
): HTMLElement {
  const cuando = el('select', { 'aria-label': 'Cuándo' });
  cuando.append(el('option', { value: '' }, 'Ahora'));
  for (let t = turno + 1; t <= turno + TURNOS_DE_PLAN; t += 1) {
    cuando.append(el('option', { value: String(t) }, `En el turno ${String(t)}`));
  }
  const dar = boton('Dar la orden', () => {
    const programado = cuando.value === '' ? {} : { turnoProgramado: Number(cuando.value) };
    void almacen.anyadir({ ...accion.intencion, ...programado });
    cerrar();
  });
  if (accion.bloqueo !== null) dar.disabled = true;
  return el(
    'div',
    { class: 'confirmacion' },
    el('h3', {}, accion.titulo),
    el('p', {}, `Coste: ${recursosEnTexto(accion.coste)}`),
    el('p', {}, `Tarda: ${String(accion.turnos)} turno${accion.turnos === 1 ? '' : 's'}`),
    el('p', {}, `Previsto: ${accion.efecto}`),
    accion.bloqueo === null
      ? el('p', {}, 'Cuándo: ', cuando)
      : el('p', { class: 'error' }, `${accion.bloqueo.causa} ${accion.bloqueo.salida}`),
    dar,
    ' ',
    boton('Cancelar', cerrar),
  );
}

export function pantallaDeFicha(
  almacen: Almacen,
  ficha: FichaDeComarca,
  turno: number,
): HTMLElement {
  const partes: (Node | string)[] = [
    el('h2', {}, ficha.nombre),
    boton('Cerrar', () => {
      almacen.abrirComarca(null);
    }),
  ];
  if (ficha.potenciales !== null) {
    const pot = Object.entries(ficha.potenciales)
      .filter(([, n]) => n > 0)
      .map(([p, n]) => `${p} ${String(n)}`);
    partes.push(el('p', {}, `${ficha.terreno ?? ''} · ${pot.join(' · ')}`));
  }
  const p = ficha.propia;
  if (p !== null) {
    partes.push(
      el(
        'p',
        {},
        `Vecinos ${String(p.poblacion)} de ${String(p.capacidad)} · lealtad ${String(p.lealtad)} · fuero: ${p.fuero} · solares ${String(p.solares.usados)}/${String(p.solares.total)}`,
      ),
      el(
        'p',
        {},
        `Edificios: ${p.edificios.map((e) => `${e.nombre} ${String(e.nivel)}/${String(e.maximo)}`).join(', ') || 'ninguno'}`,
      ),
      el('p', {}, `Produjo el último turno: ${recursosEnTexto(p.producido)}`),
    );
    const desglose = el('details', {}, el('summary', {}, 'Producción prevista este turno'));
    for (const e of p.prevision) {
      const factores = e.factores
        .map((f) => `${f.nombre} ×${(f.mil / 1000).toFixed(2)}`)
        .join(' · ');
      desglose.append(
        el(
          'p',
          {},
          `${e.recurso} ${String(e.resultado)} = ${String(e.base)} base (${e.edificio} ${String(e.nivel)}) · ${factores}`,
        ),
      );
    }
    partes.push(desglose);
  }
  if (ficha.influenciaPropia !== null)
    partes.push(el('p', {}, `Tu influencia: ${String(ficha.influenciaPropia)}`));
  const panel = el('div', {});
  const lista = el('ul', { class: 'acciones' });
  for (const accion of ficha.acciones) {
    const b = boton(accion.titulo, () => {
      panel.replaceChildren(
        confirmacion(almacen, accion, turno, () => {
          panel.replaceChildren();
        }),
      );
    });
    lista.append(
      el(
        'li',
        { class: accion.bloqueo === null ? '' : 'bloqueada' },
        b,
        ` ${recursosEnTexto(accion.coste)} · ${String(accion.turnos)} t`,
      ),
    );
  }
  partes.push(el('h3', {}, 'Acciones'), lista, panel);
  return el('section', { class: 'ficha' }, ...partes);
}
