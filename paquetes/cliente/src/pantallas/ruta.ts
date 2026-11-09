// El editor de ruta en el panel (ficha T-083 §4.5): las paradas que se van tocando en el mapa, la
// prevision tramo a tramo con el turno de llegada a cada parada, y los avisos antes de confirmar.
import { BLOQUEOS, RECURSOS, RECURSOS_DE_MERCADO } from '@conquer/nucleo';
import type { Recurso } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import type { EditorDeRuta, LineaDeTrato } from '../editor-de-ruta.ts';
import {
  alternarBastimento,
  alternarCircular,
  fijarCarga,
  fijarTrato,
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

/** Vender o comprar un recurso en una parada: cantidad y precio limite en maravedis (T-084). */
function campoDeTrato(
  almacen: Almacen,
  i: number,
  que: 'vender' | 'comprar',
  recurso: Recurso,
  linea: LineaDeTrato | undefined,
): HTMLElement {
  const cantidad = el('input', {
    type: 'number',
    min: '0',
    inputmode: 'numeric',
    value: linea === undefined ? '' : String(linea.cantidad),
    placeholder: '0',
    'aria-label': `${que === 'vender' ? 'Vender' : 'Comprar'} ${NOMBRE_DE_RECURSO[recurso]}: cantidad`,
  });
  const precio = el('input', {
    type: 'number',
    min: '0',
    step: '0.1',
    inputmode: 'decimal',
    value: linea === undefined ? '' : String(linea.precioMil / 1000),
    placeholder: 'mrs',
    'aria-label': `${que === 'vender' ? 'Precio mínimo' : 'Precio máximo'} de ${NOMBRE_DE_RECURSO[recurso]}`,
  });
  const cambiar = (): void => {
    const c = Number(cantidad.value);
    const mil = Math.round(Number(precio.value) * 1000);
    almacen.editar((e) =>
      fijarTrato(e, i, que, recurso, {
        cantidad: Number.isFinite(c) ? c : 0,
        precioMil: Number.isFinite(mil) ? mil : 0,
      }),
    );
  };
  cantidad.addEventListener('change', cambiar);
  precio.addEventListener('change', cambiar);
  return el('label', { class: 'campo-carga' }, MARCA_DE_RECURSO[recurso], cantidad, '×', precio);
}

function cargasDeParada(almacen: Almacen, e: EditorDeRuta, i: number): HTMLElement {
  const t = e.tratos[i];
  const plegable = el('details', {}, el('summary', {}, 'Cargar, descargar y tratar aquí'));
  for (const que of ['cargar', 'descargar'] as const) {
    const fila = el(
      'p',
      { class: 'fila' },
      el('span', { class: 'suave' }, que === 'cargar' ? 'Cargar:' : 'Descargar:'),
    );
    for (const recurso of RECURSOS)
      fila.append(campoDeCarga(almacen, i, que, recurso, t?.[que][recurso] ?? 0));
    plegable.append(fila);
  }
  plegable.append(
    el(
      'p',
      { class: 'consejo' },
      'Si en la parada hay plaza abierta, la recua vende o compra allí ese turno: vendiendo, a no menos del precio que pongas; comprando, a no más.',
    ),
  );
  for (const que of ['vender', 'comprar'] as const) {
    const fila = el(
      'p',
      { class: 'fila' },
      el(
        'span',
        { class: 'suave' },
        que === 'vender' ? 'Vender (cantidad × mínimo):' : 'Comprar (cantidad × máximo):',
      ),
    );
    for (const recurso of RECURSOS_DE_MERCADO)
      fila.append(campoDeTrato(almacen, i, que, recurso, t?.[que][recurso]));
    plegable.append(fila);
  }
  const algo =
    t !== undefined &&
    [t.cargar, t.descargar, t.vender, t.comprar].some((x) => Object.keys(x).length > 0);
  if (algo) plegable.setAttribute('open', '');
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
