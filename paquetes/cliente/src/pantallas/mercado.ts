// El mercado en el panel (fichas T-084 §4.3 y T-093): arriba, comerciar con cada recua que esta en una
// plaza, en pocos toques; despues, tus ordenes de mercado y la tabla de precios que conoces. La ficha de
// una plaza tiene la serie de cada precio.
import {
  MOTIVOS,
  RECURSOS_DE_MERCADO,
  TABLAS_DEL_JUEGO,
  modificadoresDelJugador,
  pesoDeLaCarga,
} from '@conquer/nucleo';
import type { PlazaEnPanel, Recurso } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import type { MercadoRecibido } from '../api.ts';
import {
  avisosDeCompraventa,
  enMaravedis,
  fechaDePrecio,
  intencionesDeCompraventa,
  limitePorDefecto,
  valorar,
} from '../mercado.ts';
import type { PedidoDeMercado, RecuaQueTrata } from '../mercado.ts';
import { fraseDeOrden } from '../ordenes-en-palabras.ts';
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

/** Lo elegido en cada formulario (plaza|recua): sobrevive a las repintadas. */
const elegido = new Map<
  string,
  { operacion: 'comprar' | 'vender'; recurso: Recurso; cantidad: number }
>();

function recuaQueTrata(almacen: Almacen, id: string): RecuaQueTrata | null {
  const vista = almacen.estado.partida?.recibido.vista;
  const r = vista?.recuas.find((x) => x.id === id);
  if (vista === undefined || r === undefined) return null;
  const donde = r.situacion.donde === 'comarca' ? r.situacion.comarca : null;
  return {
    enCasa: donde !== null && vista.comarcas[donde]?.nivel === 'propia',
    carga: r.carga,
    sitioLibre: Math.max(0, r.porte - pesoDeLaCarga(r.carga)),
  };
}

/**
 * Comprar o vender con una recua que esta en la plaza, en pocos toques (T-093): que, cual, cuanto y
 * dar la orden. El precio limite y los turnos van plegados en «Más opciones», con un valor sensato.
 */
function formularioSencillo(
  almacen: Almacen,
  p: PlazaEnPanel,
  recua: { readonly id: string; readonly nombre: string; readonly trata: boolean },
): HTMLElement {
  const clave = `${p.id}|${recua.id}`;
  const actual = elegido.get(clave) ?? { operacion: 'comprar', recurso: 'pan', cantidad: 10 };
  const cambiar = (cambio: Partial<typeof actual>): void => {
    elegido.set(clave, { ...actual, ...cambio });
    almacen.refrescar();
  };
  const datos = recuaQueTrata(almacen, recua.id);
  const casa = almacen.estado.partida?.recibido.vista.jugador;
  const comision =
    casa === undefined ? 20 : modificadoresDelJugador(casa, TABLAS_DEL_JUEGO).comisionMercadoMil;
  const precio = p.precios?.[actual.recurso]?.mil ?? null;
  const limite = el('input', {
    type: 'number',
    min: '0',
    step: '0.1',
    inputmode: 'decimal',
    value:
      precio === null
        ? ''
        : enMaravedis(limitePorDefecto(actual.operacion, precio)).replace(',', '.'),
  });
  const turnos = el('input', {
    type: 'number',
    min: '1',
    max: '24',
    value: '4',
    inputmode: 'numeric',
  });
  const pedido = (): PedidoDeMercado => ({
    plaza: p.id,
    recua: recua.id,
    trata: recua.trata,
    operacion: actual.operacion,
    recurso: actual.recurso,
    cantidad: actual.cantidad,
    precioLimiteMil: Math.round(Number(limite.value) * 1000),
    turnos: Number(turnos.value),
  });

  const conmutador = el(
    'div',
    { class: 'conmutador', role: 'group', 'aria-label': 'Comprar o vender' },
    ...(['comprar', 'vender'] as const).map((op) => {
      const b = boton(
        op === 'comprar' ? '🛒 Comprar' : '💰 Vender',
        () => {
          cambiar({ operacion: op });
        },
        op === actual.operacion ? '' : 'secundario',
      );
      b.setAttribute('aria-pressed', op === actual.operacion ? 'true' : 'false');
      return b;
    }),
  );
  const recursos = el(
    'div',
    { class: 'eleccion-de-recurso', role: 'group', 'aria-label': 'Qué' },
    ...RECURSOS_DE_MERCADO.map((r) => {
      const mil = p.precios?.[r]?.mil;
      const b = boton(
        `${MARCA_DE_RECURSO[r]} ${NOMBRE_DE_RECURSO[r]}${mil === undefined ? '' : ` · ${enMaravedis(mil)}`}`,
        () => {
          cambiar({ recurso: r });
        },
        r === actual.recurso ? 'chip elegido' : 'chip',
      );
      b.setAttribute('aria-pressed', r === actual.recurso ? 'true' : 'false');
      return b;
    }),
  );
  const cantidad = el(
    'div',
    { class: 'fila cantidad' },
    el('span', { class: 'suave' }, 'Cuánto:'),
    ...[5, 10, 20, 50].map((n) =>
      boton(
        String(n),
        () => {
          cambiar({ cantidad: n });
        },
        n === actual.cantidad ? 'chip elegido' : 'chip',
      ),
    ),
  );
  const total =
    precio === null
      ? 'Aún no sabes su precio aquí: la recua lo verá al llegar.'
      : `≈ ${String(Math.round((actual.cantidad * precio) / 1000))} maravedís al precio de ahora (${enMaravedis(precio)} cada uno).`;
  const avisos = datos === null ? [] : avisosDeCompraventa(pedido(), datos, comision);
  const dar = boton(
    `${actual.operacion === 'comprar' ? 'Comprar' : 'Vender'} ${String(actual.cantidad)} de ${NOMBRE_DE_RECURSO[actual.recurso]}`,
    () => {
      if (datos === null) return;
      void almacen.anyadirVarias(intencionesDeCompraventa(pedido(), datos, comision));
    },
    'dar-la-orden',
  );
  if (precio === null) dar.setAttribute('disabled', '');
  return el(
    'div',
    { class: 'tarjeta comerciar' },
    el('h3', {}, `🐴 ${recua.nombre} en ${p.nombre}`),
    conmutador,
    recursos,
    cantidad,
    el('p', { class: 'total-de-orden' }, total),
    ...avisos.map((a) => el('p', { class: 'suave' }, `ℹ️ ${a}`)),
    el(
      'details',
      { class: 'mas-opciones' },
      el('summary', {}, 'Más opciones'),
      el(
        'p',
        { class: 'suave' },
        actual.operacion === 'comprar'
          ? 'Precio límite: lo máximo que pagas por cada uno. Si la plaza pide más, la orden espera.'
          : 'Precio límite: lo mínimo que cobras por cada uno. Si la plaza da menos, la orden espera.',
      ),
      el(
        'p',
        { class: 'fila' },
        el('label', { class: 'campo-carga' }, 'Límite (mrs)', limite),
        el('label', { class: 'campo-carga' }, 'Turnos que espera', turnos),
      ),
    ),
    el('p', {}, dar),
  );
}

/** Sin recua en ninguna plaza: qué hacer, con un boton por plaza (T-093). */
function sinRecuaEnPlaza(almacen: Almacen, plazas: readonly PlazaEnPanel[]): HTMLElement {
  const vista = almacen.estado.partida?.recibido.vista;
  const sinRecuas = (vista?.recuas.length ?? 0) === 0;
  return el(
    'div',
    { class: 'tarjeta consejo' },
    el('h3', {}, 'Para comerciar hace falta una recua en una plaza'),
    el(
      'p',
      {},
      'Se compra y se vende con una recua parada en una plaza: lleva el dinero, carga lo comprado y lo trae a casa.',
    ),
    sinRecuas
      ? boton('🐴 Formar una recua en tu capital', () => {
          const capital = vista?.jugador.capital;
          if (capital !== undefined) almacen.abrirComarca(capital);
        })
      : el(
          'p',
          { class: 'fila' },
          ...plazas
            .filter((p) => p.abierta)
            .slice(0, 4)
            .map((p) =>
              boton(
                `Mandar una recua a ${p.nombre}`,
                () => {
                  almacen.mandarRecuaA(p.comarca);
                },
                'secundario',
              ),
            ),
        ),
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
    boton(
      '← Todas las plazas',
      () => {
        almacen.abrirMercado(null);
      },
      'enlace',
    ),
    el('h2', {}, p.nombre),
    el('p', { class: 'suave' }, `En ${nombre(p.comarca)} · ${estadoDePlaza(p)}`),
    el('p', { class: fecha.viejo ? 'aviso' : 'suave' }, fecha.texto),
    // Lo que se puede hacer va arriba; la lista de precios, debajo.
    ...(p.recuas.length === 0
      ? [sinRecuaEnPlaza(almacen, [p])]
      : p.recuas.map((r) => formularioSencillo(almacen, p, r))),
    filas,
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
  // Desde el plano de una comarca se llega con la comarca, no con la plaza (T-092): vale su plaza local.
  const abierta =
    plaza === null
      ? undefined
      : (m.panel.plazas.find((p) => p.id === plaza) ??
        m.panel.plazas.find((p) => p.comarca === plaza && p.tipo === 'local'));
  if (abierta !== undefined) return fichaDePlaza(almacen, abierta, m, nombre);

  // Arriba lo que se puede hacer ya: comerciar con cada recua que esta en una plaza abierta (T-093).
  const conRecua = m.panel.plazas.filter((p) => p.abierta && p.recuas.length > 0);
  const comerciar =
    conRecua.length === 0
      ? [sinRecuaEnPlaza(almacen, m.panel.plazas)]
      : conRecua.flatMap((p) => p.recuas.map((r) => formularioSencillo(almacen, p, r)));

  // Tus ordenes de mercado: las de este turno y las que esperan, en una frase cada una.
  const vista = almacen.estado.partida?.recibido.vista;
  const unidades = vista?.recuas ?? [];
  const palabras = {
    comarca: nombre,
    unidad: (id: string) => unidades.find((u) => u.id === id)?.nombre ?? 'una recua',
    orden: () => undefined,
  };
  const dadas = almacen.estado.enviadas.map((o) => o.orden).filter((o) => o.tipo === 'mercado');
  const vivas = (vista?.ordenes ?? []).filter((o) => o.tipo === 'mercado');
  const anulandose = new Set(
    almacen.estado.enviadas.flatMap((o) => (o.orden.tipo === 'anular' ? [o.orden.orden] : [])),
  );
  const ordenes = [
    ...dadas.map((o) =>
      el(
        'li',
        {},
        `⚖️ ${fraseDeOrden(o, palabras)}`,
        el('span', { class: 'etiqueta' }, 'este turno'),
      ),
    ),
    ...vivas.map((o) =>
      el(
        'li',
        {},
        `⚖️ ${fraseDeOrden(o, palabras)}`,
        o.motivoEspera === null
          ? el('span', { class: 'etiqueta' }, 'tratando')
          : el(
              'p',
              { class: 'motivo-de-espera' },
              `Espera: ${MOTIVOS[o.motivoEspera] ?? o.motivoEspera}.`,
            ),
        anulandose.has(o.id)
          ? el('span', { class: 'etiqueta' }, '✖️ se anulará al resolverse el turno')
          : boton(
              'Anular',
              () => {
                void almacen.anyadir({ tipo: 'anular', orden: o.id });
              },
              'secundario icono',
            ),
      ),
    ),
  ];

  // Los precios que conoces, en una tabla: una fila por plaza.
  const tabla = el(
    'table',
    { class: 'tabla-de-precios' },
    el(
      'thead',
      {},
      el(
        'tr',
        {},
        el('th', {}, 'Plaza'),
        ...RECURSOS_DE_MERCADO.map((r) =>
          el('th', { title: NOMBRE_DE_RECURSO[r] }, MARCA_DE_RECURSO[r]),
        ),
      ),
    ),
    el(
      'tbody',
      {},
      ...m.panel.plazas.map((p) => {
        const fecha = fechaDePrecio(p, m.turno);
        const ver = boton(
          p.nombre,
          () => {
            almacen.abrirMercado(p.id);
          },
          'enlace',
        );
        return el(
          'tr',
          { class: fecha.viejo ? 'vieja' : '' },
          el('th', { scope: 'row' }, ver, el('small', { class: 'suave' }, ` ${estadoDePlaza(p)}`)),
          ...RECURSOS_DE_MERCADO.map((r) => el('td', {}, fichaDePrecio(p, r))),
        );
      }),
    ),
  );

  return el(
    'section',
    { class: 'ficha tarjeta hoja', 'data-conservar-scroll': 'mercado' },
    el('h2', {}, 'Mercado'),
    cerrar,
    el(
      'p',
      { class: 'suave' },
      'Se compra y se vende con una recua parada en una plaza. Lo comprado viaja en la recua: descárgalo en casa para usarlo.',
    ),
    el('h3', {}, 'Comerciar ahora'),
    ...comerciar,
    el('h3', {}, `Tus órdenes de mercado (${String(ordenes.length)})`),
    ordenes.length === 0
      ? el('p', { class: 'suave' }, 'Ninguna.')
      : el('ul', { class: 'lista' }, ...ordenes),
    el('h3', {}, 'Precios que conoces'),
    m.panel.plazas.length === 0
      ? el(
          'p',
          { class: 'suave' },
          'No conoces ninguna plaza todavía: explora, o levanta un mercado o una venta.',
        )
      : el(
          'div',
          {},
          el(
            'p',
            { class: 'suave' },
            '↓ barato y ↑ caro, frente a lo que vale en esa comarca. Toca una plaza para ver sus precios con detalle.',
          ),
          el('div', { class: 'desplazable' }, tabla),
        ),
  );
}
