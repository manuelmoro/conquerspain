// El editor de ruta en el panel (ficha T-083 §4.5): las paradas que se van tocando en el mapa, la
// prevision tramo a tramo con el turno de llegada a cada parada, y los avisos antes de confirmar.
import { BLOQUEOS, RECURSOS } from '@conquer/nucleo';
import type { Recurso } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import type { EditorDeRuta } from '../editor-de-ruta.ts';
import {
  alternarBastimento,
  alternarCircular,
  fijarCarga,
  puedeConfirmar,
  quitar,
  subir,
} from '../editor-de-ruta.ts';
import { MARCA_DE_RECURSO, NOMBRE_DE_RECURSO } from '../nombres.ts';
import { boton, el } from './dom.ts';

/** Un campo para cargar o descargar un recurso en una parada. */
function campoDeCarga(
  almacen: Almacen,
  i: number,
  que: 'cargar' | 'descargar',
  recurso: Recurso,
  valor: number,
): HTMLElement {
  const entrada = el('input', {
    type: 'number',
    min: '0',
    inputmode: 'numeric',
    value: valor === 0 ? '' : String(valor),
    'aria-label': `${que === 'cargar' ? 'Cargar' : 'Descargar'} ${NOMBRE_DE_RECURSO[recurso]}`,
    placeholder: '0',
  });
  entrada.addEventListener('change', () => {
    const cantidad = Number(entrada.value);
    almacen.editar((e) => fijarCarga(e, i, que, recurso, Number.isFinite(cantidad) ? cantidad : 0));
  });
  return el('label', { class: 'campo-carga' }, MARCA_DE_RECURSO[recurso], entrada);
}

function cargasDeParada(almacen: Almacen, e: EditorDeRuta, i: number): HTMLElement {
  const plegable = el('details', {}, el('summary', {}, 'Cargar y descargar aquí'));
  for (const que of ['cargar', 'descargar'] as const) {
    const lista = que === 'cargar' ? e.cargas : e.descargas;
    const fila = el(
      'p',
      { class: 'fila' },
      el('span', { class: 'suave' }, que === 'cargar' ? 'Cargar:' : 'Descargar:'),
    );
    for (const recurso of RECURSOS)
      fila.append(campoDeCarga(almacen, i, que, recurso, lista[i]?.[recurso] ?? 0));
    plegable.append(fila);
  }
  if (Object.keys(e.cargas[i] ?? {}).length + Object.keys(e.descargas[i] ?? {}).length > 0)
    plegable.setAttribute('open', '');
  return plegable;
}

export function pantallaDeRuta(
  almacen: Almacen,
  e: EditorDeRuta,
  nombreDeUnidad: string,
  nombre: (id: string) => string,
): HTMLElement {
  const partes: (Node | string)[] = [
    el('h2', {}, `Ruta de ${nombreDeUnidad}`),
    boton(
      '✕',
      () => {
        almacen.cerrarEditor();
      },
      'cerrar secundario icono',
    ),
    el(
      'p',
      { class: 'consejo' },
      e.unidad.clase === 'rebanyo'
        ? 'Toca en el mapa la comarca adonde llevarlo.'
        : 'Toca en el mapa las comarcas por las que tiene que parar, en orden. Tocar la última la quita.',
    ),
  ];

  const p = e.prevision;
  const lista = el('ol', { class: 'lista paradas' });
  e.paradas.forEach((comarca, i) => {
    const llegada = p?.ok === true ? p.llegadas[i] : undefined;
    const item = el(
      'li',
      {},
      el(
        'div',
        { class: 'fila' },
        el('strong', {}, nombre(comarca)),
        llegada === undefined
          ? ''
          : el(
              'span',
              { class: 'etiqueta' },
              llegada === 1 ? 'llega este turno' : `llega en ${String(llegada)} turnos`,
            ),
        i > 0
          ? boton(
              '↑',
              () => {
                almacen.editar((x) => subir(x, i));
              },
              'secundario icono',
            )
          : '',
        boton(
          'Quitar',
          () => {
            almacen.editar((x) => quitar(x, i));
          },
          'secundario icono empuje',
        ),
      ),
    );
    if (e.unidad.clase === 'recua') item.append(cargasDeParada(almacen, e, i));
    lista.append(item);
  });
  partes.push(
    e.paradas.length === 0 ? el('p', { class: 'suave' }, 'Todavía no hay paradas.') : lista,
  );

  if (e.unidad.clase === 'recua') {
    const circular = el('input', { type: 'checkbox' });
    circular.checked = e.circular;
    circular.addEventListener('change', () => {
      almacen.editar(alternarCircular);
    });
    const bastimento = el('input', { type: 'checkbox' });
    bastimento.checked = e.cargarBastimento;
    bastimento.addEventListener('change', () => {
      almacen.editar(alternarBastimento);
    });
    partes.push(
      el(
        'label',
        { class: 'casilla' },
        circular,
        'Circular: al acabar vuelve a empezar, sola, hasta que algo la pare',
      ),
      el(
        'label',
        { class: 'casilla' },
        bastimento,
        'Cargar antes de salir el pan y la sal que comerá el viaje',
      ),
    );
  }

  if (e.paradas.length > 0) {
    if (p === null) partes.push(el('p', { class: 'suave' }, 'Calculando el viaje…'));
    else if (!p.ok) {
      const texto = p.motivo === null ? undefined : BLOQUEOS[p.motivo];
      partes.push(
        el(
          'div',
          { class: 'confirmacion' },
          el('p', {}, el('strong', {}, 'No se puede: '), texto?.causa ?? 'el viaje no sale'),
          texto === undefined ? '' : el('p', {}, el('strong', {}, 'Qué hacer: '), texto.salida),
        ),
      );
    } else {
      const tramos = el(
        'details',
        {},
        el('summary', {}, `El camino, tramo a tramo (${String(p.tramos.length)})`),
      );
      const ol = el('ol', { class: 'suave' });
      for (const t of p.tramos) {
        ol.append(
          el(
            'li',
            {},
            `${nombre(t.desde)} → ${nombre(t.hasta)}: ${t.jornadas === null ? 'cerrado' : `${String(t.jornadas)} jornada${t.jornadas === 1 ? '' : 's'}`}${t.puerto === null ? '' : ` · ${t.puerto}`}`,
          ),
        );
      }
      tramos.append(ol);
      partes.push(tramos);
      if (e.unidad.clase === 'recua') {
        partes.push(
          el(
            'p',
            {},
            `El viaje come ${String(p.pan)} de pan${p.sal > 0 ? ` y ${String(p.sal)} de sal` : ''}${
              p.faltaPan + p.faltaSal > 0
                ? `; le faltan ${String(p.faltaPan)} de pan${p.faltaSal > 0 ? ` y ${String(p.faltaSal)} de sal` : ''}`
                : ''
            }.`,
          ),
        );
      }
      for (const aviso of p.avisos) partes.push(el('p', { class: 'aviso' }, aviso));
    }
  }

  const confirmar = boton('Dar la ruta', () => {
    void almacen.confirmarEditor();
  });
  if (!puedeConfirmar(e)) confirmar.setAttribute('disabled', '');
  partes.push(
    el(
      'p',
      { class: 'fila' },
      confirmar,
      boton(
        'Cancelar',
        () => {
          almacen.cerrarEditor();
        },
        'secundario',
      ),
    ),
  );
  return el('section', { class: 'ficha tarjeta hoja', 'data-conservar-scroll': 'ruta' }, ...partes);
}
