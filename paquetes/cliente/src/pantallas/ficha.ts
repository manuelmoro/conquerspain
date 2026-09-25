// La ficha de comarca (T-082, T-088): panel lateral en escritorio y hoja inferior en movil. Cada accion
// es una tarjeta con su coste y su duracion; al elegirla, la confirmacion se abre ahi mismo con el
// efecto previsto, o con la causa y la salida si esta bloqueada. Nada se da sin verlo antes.
import { POTENCIALES } from '@conquer/nucleo';
import type { AccionDeFicha, FichaDeComarca } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import { NOMBRE_DE_POTENCIAL, NOMBRE_DE_TERRENO } from '../nombres.ts';
import { fichasDeRecursos } from './comun.ts';
import { boton, el } from './dom.ts';

const TURNOS_DE_PLAN = 6;
/** La accion abierta y la ultima dada, por comarca: sobreviven a las repintadas. */
let abierta: string | null = null;
let dada: string | null = null;
/** Si el jugador ha desplegado lo que todavia no puede hacer; se recuerda entre repintadas. */
let verBloqueadas = false;

function confirmacion(almacen: Almacen, accion: AccionDeFicha, turno: number): HTMLElement {
  if (accion.bloqueo !== null) {
    return el(
      'div',
      { class: 'confirmacion' },
      el('p', {}, el('strong', {}, 'No se puede: '), accion.bloqueo.causa),
      el('p', {}, el('strong', {}, 'Qué hacer: '), accion.bloqueo.salida),
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
      boton('Dar la orden', () => {
        const programado = cuando.value === '' ? {} : { turnoProgramado: Number(cuando.value) };
        dada = accion.clave;
        abierta = null;
        void almacen.anyadir({ ...accion.intencion, ...programado });
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

export function pantallaDeFicha(
  almacen: Almacen,
  ficha: FichaDeComarca,
  turno: number,
): HTMLElement {
  const cabecera: (Node | string)[] = [
    el('h2', {}, ficha.nombre),
    boton(
      '✕',
      () => {
        abierta = null;
        almacen.abrirComarca(null);
      },
      'cerrar secundario icono',
    ),
  ];
  const partes: (Node | string)[] = [...cabecera];
  const dueño =
    ficha.nivel === 'propia' ? 'Tuya' : ficha.duenyo === null ? 'De nadie' : 'De otra casa';
  const terreno = ficha.terreno === null ? '' : ` · ${NOMBRE_DE_TERRENO[ficha.terreno]}`;
  partes.push(el('p', { class: 'suave' }, `${dueño}${terreno}`));
  if (ficha.potenciales !== null) {
    const potenciales = ficha.potenciales;
    const lista = POTENCIALES.filter((p) => potenciales[p] > 0).map((p) =>
      el('span', { class: 'chip' }, `${NOMBRE_DE_POTENCIAL[p]} ${String(potenciales[p])}`),
    );
    partes.push(el('p', { class: 'recursos' }, ...lista));
  }
  const p = ficha.propia;
  if (p !== null) {
    partes.push(
      el(
        'p',
        {},
        `${String(p.poblacion)} vecinos (caben ${String(p.capacidad)}) · lealtad ${String(p.lealtad)} · ${p.fuero === 'ninguno' ? 'sin fuero' : p.fuero} · solares ${String(p.solares.usados)} de ${String(p.solares.total)}`,
      ),
    );
    partes.push(
      el(
        'p',
        {},
        el('strong', {}, 'Edificios: '),
        p.edificios.length === 0
          ? 'ninguno'
          : p.edificios.map((e) => `${e.nombre} ${String(e.nivel)}/${String(e.maximo)}`).join(', '),
      ),
    );
    if (p.obras.length > 0) {
      partes.push(
        el(
          'p',
          {},
          el('strong', {}, 'En obras: '),
          p.obras
            .map(
              (o) =>
                `${o.que} (${String(Math.floor((100 * o.avanceMil) / Math.max(1, o.necesarioMil)))} %)`,
            )
            .join(', '),
        ),
      );
    }
    partes.push(
      el(
        'p',
        { class: 'fila' },
        el('strong', {}, 'Produjo el último turno:'),
        fichasDeRecursos(p.producido),
      ),
    );
    const desglose = el('details', {}, el('summary', {}, 'Por qué produce eso'));
    for (const e of p.prevision) {
      const factores = e.factores
        .map((f) => `${f.nombre} ×${(f.mil / 1000).toFixed(2)}`)
        .join(' · ');
      desglose.append(
        el(
          'p',
          { class: 'suave' },
          `${e.edificio} (nivel ${String(e.nivel)}): ${String(e.base)} de ${e.recurso} × ${factores} = ${String(e.resultado)}`,
        ),
      );
    }
    partes.push(desglose);
  }
  if (ficha.influenciaPropia !== null)
    partes.push(el('p', {}, `Tu influencia aquí: ${String(ficha.influenciaPropia)} de 100`));

  // Lo que se puede hacer, arriba (derribar al final); lo bloqueado, debajo y plegado (J-01).
  const posibles = ficha.acciones
    .filter((a) => a.bloqueo === null)
    .sort(
      (a, b) =>
        Number(a.intencion['tipo'] === 'derribar') - Number(b.intencion['tipo'] === 'derribar'),
    );
  const bloqueadas = ficha.acciones.filter((a) => a.bloqueo !== null);
  const listaDe = (acciones: readonly AccionDeFicha[]): HTMLElement => {
    const lista = el('ul', { class: 'lista' });
    for (const accion of acciones) lista.append(tarjetaDeAccion(almacen, ficha.id, accion, turno));
    return lista;
  };
  partes.push(el('h3', {}, 'Qué puedes hacer'));
  if (ficha.acciones.length === 0) {
    partes.push(el('p', { class: 'suave' }, 'De esta comarca solo conoces el nombre.'));
  } else {
    partes.push(
      posibles.length === 0
        ? el('p', { class: 'suave' }, 'Ahora mismo, nada: mira abajo qué falta.')
        : listaDe(posibles),
    );
  }
  if (bloqueadas.length > 0) {
    const plegable = el(
      'details',
      { class: 'bloqueadas' },
      el('summary', {}, `Todavía no puedes (${String(bloqueadas.length)})`),
      listaDe(bloqueadas),
    );
    const abiertaAqui = bloqueadas.some((a) => abierta === `${ficha.id}|${a.clave}`);
    if (verBloqueadas || abiertaAqui) plegable.setAttribute('open', '');
    plegable.addEventListener('toggle', () => {
      verBloqueadas = plegable.hasAttribute('open');
    });
    partes.push(plegable);
  }
  return el(
    'section',
    { class: 'ficha tarjeta hoja', 'data-conservar-scroll': 'ficha' },
    ...partes,
  );
}

function tarjetaDeAccion(
  almacen: Almacen,
  comarca: string,
  accion: AccionDeFicha,
  turno: number,
): HTMLElement {
  const clave = `${comarca}|${accion.clave}`;
  const item = el('li', { class: accion.bloqueo === null ? 'accion' : 'accion bloqueada' });
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
  if (abierta === clave) item.append(confirmacion(almacen, accion, turno));
  return item;
}
