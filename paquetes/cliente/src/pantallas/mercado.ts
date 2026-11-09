// El mercado en el panel (ficha T-084 §4.3): las plazas que conoces con sus precios fechados, la ficha
// de una plaza con la serie de cada precio, y la orden de compra o venta con su precio limite.
import { RECURSOS_DE_MERCADO } from '@conquer/nucleo';
import type { PlazaEnPanel, Recurso } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import type { MercadoRecibido } from '../api.ts';
import {
  enMaravedis,
  fechaDePrecio,
  intencionesDeMercado,
  limitePorDefecto,
  valorar,
} from '../mercado.ts';
import { MARCA_DE_RECURSO, NOMBRE_DE_RECURSO } from '../nombres.ts';
import { boton, el } from './dom.ts';

const SVG = 'http://www.w3.org/2000/svg';

function estadoDePlaza(p: PlazaEnPanel): string {
  if (p.abierta) return 'abierta';
  return p.abreEn === 1 ? 'abre el turno que viene' : `abre dentro de ${String(p.abreEn)} turnos`;
}

function fichaDePrecio(p: PlazaEnPanel, recurso: Recurso): HTMLElement {
  const precio = p.precios?.[recurso];
  if (precio === undefined) return el('span');
  const valor = valorar(precio);
  return el(
    'span',
    { class: `chip precio ${valor}`, title: `${NOMBRE_DE_RECURSO[recurso]}: ${valor}` },
    `${MARCA_DE_RECURSO[recurso]} ${enMaravedis(precio.mil)}${valor === 'corriente' ? '' : valor === 'barato' ? ' ↓' : ' ↑'}`,
  );
}

/** Una serie pequeña de precios: puntos en los turnos sabidos, el primero y el ultimo rotulados. */
function serie(puntos: readonly { turno: number; mil: number }[]): SVGSVGElement | HTMLElement {
  if (puntos.length < 2) return el('span', { class: 'suave' }, 'sin serie todavía');
  const ancho = 120;
  const alto = 28;
  const t0 = puntos[0]?.turno ?? 0;
  const t1 = puntos.at(-1)?.turno ?? t0 + 1;
  const min = Math.min(...puntos.map((p) => p.mil));
  const max = Math.max(...puntos.map((p) => p.mil));
  const x = (t: number): number => Math.round(((t - t0) / Math.max(1, t1 - t0)) * (ancho - 4)) + 2;
  const y = (m: number): number =>
    max === min ? alto / 2 : Math.round(alto - 3 - ((m - min) / (max - min)) * (alto - 6));
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', `0 0 ${String(ancho)} ${String(alto)}`);
  svg.setAttribute('class', 'serie');
  svg.setAttribute('role', 'img');
  svg.setAttribute(
    'aria-label',
    `De ${enMaravedis(puntos[0]?.mil ?? 0)} en el turno ${String(t0)} a ${enMaravedis(puntos.at(-1)?.mil ?? 0)} en el ${String(t1)}`,
  );
  const linea = document.createElementNS(SVG, 'polyline');
  linea.setAttribute(
    'points',
    puntos.map((p) => `${String(x(p.turno))},${String(y(p.mil))}`).join(' '),
  );
  svg.append(linea);
  return el(
    'span',
    { class: 'fila' },
    el('span', { class: 'suave' }, enMaravedis(puntos[0]?.mil ?? 0)),
    svg,
    el('span', { class: 'suave' }, enMaravedis(puntos.at(-1)?.mil ?? 0)),
  );
}

function formularioDeOrden(almacen: Almacen, p: PlazaEnPanel): HTMLElement {
  if (p.recuas.length === 0) {
    return el(
      'p',
      { class: 'consejo' },
      'Para comprar o vender aquí hace falta una recua tuya quieta en la plaza: toda la mercancía viaja en recuas. Dale ruta hasta aquí desde «Tus recuas y rebaños».',
    );
  }
  const recua = el('select', { 'aria-label': 'Recua' });
  for (const r of p.recuas) recua.append(el('option', { value: r.id }, r.nombre));
  const operacion = el('select', { 'aria-label': 'Comprar o vender' });
  operacion.append(
    el('option', { value: 'vender' }, 'Vender'),
    el('option', { value: 'comprar' }, 'Comprar'),
  );
  const recurso = el('select', { 'aria-label': 'Recurso' });
  for (const r of RECURSOS_DE_MERCADO)
    recurso.append(el('option', { value: r }, NOMBRE_DE_RECURSO[r]));
  const cantidad = el('input', {
    type: 'number',
    min: '1',
    value: '10',
    inputmode: 'numeric',
    'aria-label': 'Cantidad',
  });
  const limite = el('input', {
    type: 'number',
    min: '0',
    step: '0.1',
    inputmode: 'decimal',
    'aria-label': 'Precio límite en maravedís',
  });
  const turnos = el('input', {
    type: 'number',
    min: '1',
    max: '24',
    value: '4',
    inputmode: 'numeric',
    'aria-label': 'Turnos',
  });
  const recursoElegido = (): Recurso =>
    RECURSOS_DE_MERCADO.find((r) => r === recurso.value) ?? 'pan';
  const operacionElegida = (): 'comprar' | 'vender' =>
    operacion.value === 'comprar' ? 'comprar' : 'vender';
  const proponer = (): void => {
    const mil = p.precios?.[recursoElegido()]?.mil ?? null;
    limite.value =
      mil === null ? '' : enMaravedis(limitePorDefecto(operacionElegida(), mil)).replace(',', '.');
  };
  recurso.addEventListener('change', proponer);
  operacion.addEventListener('change', proponer);
  proponer();
  const dar = boton('Dar la orden', () => {
    const elegida = p.recuas.find((r) => r.id === recua.value);
    if (elegida === undefined) return;
    void almacen.anyadirVarias(
      intencionesDeMercado({
        plaza: p.id,
        recua: elegida.id,
        trata: elegida.trata,
        operacion: operacionElegida(),
        recurso: recursoElegido(),
        cantidad: Number(cantidad.value),
        precioLimiteMil: Math.round(Number(limite.value) * 1000),
        turnos: Number(turnos.value),
      }),
    );
  });
  return el(
    'div',
    { class: 'confirmacion' },
    el('h3', {}, 'Dar una orden aquí'),
    el(
      'p',
      { class: 'consejo' },
      'El precio límite es lo peor que aceptas: vendiendo, lo mínimo que quieres cobrar; comprando, lo máximo que quieres pagar. Si el precio de la plaza no llega, la orden espera los turnos que digas.',
    ),
    el('p', { class: 'fila' }, recua, operacion, recurso),
    el(
      'p',
      { class: 'fila' },
      el('label', { class: 'campo-carga' }, 'Cantidad', cantidad),
      el('label', { class: 'campo-carga' }, 'Límite (mrs)', limite),
      el('label', { class: 'campo-carga' }, 'Turnos', turnos),
    ),
    el('p', {}, dar),
  );
}

function fichaDePlaza(
  almacen: Almacen,
  p: PlazaEnPanel,
  m: MercadoRecibido,
  nombre: (id: string) => string,
): HTMLElement {
  const fecha = fechaDePrecio(p, m.turno);
  const filas = el('ul', { class: 'lista' });
  for (const r of RECURSOS_DE_MERCADO) {
    const precio = p.precios?.[r];
    filas.append(
      el(
        'li',
        {},
        el(
          'div',
          { class: 'fila' },
          el('strong', {}, `${MARCA_DE_RECURSO[r]} ${NOMBRE_DE_RECURSO[r]}`),
          precio === undefined ? el('span', { class: 'suave' }, 'no se sabe') : fichaDePrecio(p, r),
          precio === undefined
            ? ''
            : el('span', { class: 'suave' }, `base ${enMaravedis(precio.baseMil)}`),
        ),
        serie(m.series[p.id]?.[r] ?? []),
      ),
    );
  }
  return el(
    'section',
    { class: 'ficha tarjeta hoja', 'data-conservar-scroll': 'plaza' },
    el('h2', {}, p.nombre),
    boton(
      '← Plazas',
      () => {
        almacen.abrirMercado(null);
      },
      'cerrar secundario icono',
    ),
    el('p', { class: 'suave' }, `En ${nombre(p.comarca)} · ${estadoDePlaza(p)}`),
    el('p', { class: fecha.viejo ? 'aviso' : 'suave' }, fecha.texto),
    filas,
    formularioDeOrden(almacen, p),
  );
}

export function pantallaDeMercado(
  almacen: Almacen,
  m: MercadoRecibido | null,
  plaza: string | null,
  nombre: (id: string) => string,
): HTMLElement {
  const cerrar = boton(
    '✕',
    () => {
      almacen.cerrarMercado();
    },
    'cerrar secundario icono',
  );
  if (m === null) {
    return el(
      'section',
      { class: 'ficha tarjeta hoja' },
      el('h2', {}, 'Mercado'),
      cerrar,
      el('p', {}, 'Cargando el mercado…'),
    );
  }
  const abierta = plaza === null ? undefined : m.panel.plazas.find((p) => p.id === plaza);
  if (abierta !== undefined) return fichaDePlaza(almacen, abierta, m, nombre);
  const lista = el('ul', { class: 'lista' });
  for (const p of m.panel.plazas) {
    const fecha = fechaDePrecio(p, m.turno);
    const tarjeta = el(
      'li',
      { class: fecha.viejo ? 'plaza vieja' : 'plaza' },
      el(
        'div',
        { class: 'fila' },
        el('strong', {}, p.nombre),
        el('span', { class: 'etiqueta' }, estadoDePlaza(p)),
      ),
      el('p', { class: 'suave' }, fecha.texto),
      el('p', { class: 'recursos' }, ...RECURSOS_DE_MERCADO.map((r) => fichaDePrecio(p, r))),
      boton(
        'Ver la plaza',
        () => {
          almacen.abrirMercado(p.id);
        },
        'secundario',
      ),
    );
    lista.append(tarjeta);
  }
  return el(
    'section',
    { class: 'ficha tarjeta hoja', 'data-conservar-scroll': 'mercado' },
    el('h2', {}, 'Mercado'),
    cerrar,
    el(
      'p',
      { class: 'consejo' },
      'Las plazas que conoces, con lo que sabes de sus precios y desde cuándo. ↓ barato y ↑ caro, frente a lo que vale en esa comarca.',
    ),
    m.panel.plazas.length === 0
      ? el(
          'p',
          { class: 'suave' },
          'No conoces ninguna plaza todavía: explora, o levanta un mercado o una venta.',
        )
      : lista,
  );
}
