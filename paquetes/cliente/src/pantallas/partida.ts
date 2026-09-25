// La partida (T-081, T-082, T-088): cabecera con el turno y el corte; el mapa con su conmutador, su
// explicacion y su leyenda; y el panel con la ficha de la comarca tocada y la bandeja. En escritorio el
// panel va al lado y fijo; en movil, debajo, y la ficha sube como hoja sobre el mapa.
import { TABLAS_DEL_JUEGO, estacionDe } from '@conquer/nucleo';
import type { FichaDeComarca } from '@conquer/nucleo';

import type { Almacen, EstadoDelCliente } from '../almacen.ts';
import { MODOS_DE_ATLAS, componerAtlas } from '../atlas/componer.ts';
import type { ModoDeAtlas } from '../atlas/componer.ts';
import { EXPLICACION_DE_MODO, leyendaDe } from '../atlas/leyenda.ts';
import { montarAtlas } from '../atlas/svg.ts';
import type { AtlasMontado } from '../atlas/svg.ts';
import { colasDe, moverEnLaCola, resumenDeRecursos, tiempoHastaElCorte } from '../bandeja.ts';
import { NOMBRE_DE_ESTADO } from '../nombres.ts';
import { describirOrden, fichasDeRecursos } from './comun.ts';
import { boton, el } from './dom.ts';
import { pantallaDeFicha } from './ficha.ts';
import { dialogoDeResumen } from './resumen.ts';

const NOMBRE_DE_MODO: Readonly<Record<ModoDeAtlas, string>> = {
  economico: 'Economía',
  logistico: 'Caminos',
  politico: 'Dominios',
};

interface EstadoDelAtlas {
  svg: SVGSVGElement | null;
  montado: AtlasMontado | null;
  modo: ModoDeAtlas;
  /** Lo que hay pintado: partida, turno, modo e instante de la vista. */
  pintado: string;
}

/**
 * El atlas vive fuera de las repintadas de la pantalla: el mismo <svg> se reutiliza, asi no se pierde
 * el encuadre, y solo se recompone cuando cambian el atlas, el turno o el modo.
 */
const atlas: EstadoDelAtlas = { svg: null, montado: null, modo: 'economico', pintado: '' };
let alTocarComarca: (comarca: string) => void = () => undefined;

function nombreDeComarcaEn(estado: EstadoDelCliente): (id: string) => string {
  const comarcas = estado.partida?.atlas?.comarcas ?? [];
  return (id) => comarcas.find((c) => c.id === id)?.nombre ?? 'una comarca';
}

function mapaDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  alTocarComarca = (comarca) => {
    almacen.abrirComarca(comarca);
  };
  const partida = estado.partida;
  if (partida === null || partida.atlas === null) return el('p', {}, 'Sin mapa todavía.');
  if (atlas.svg === null) {
    atlas.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    atlas.svg.setAttribute('class', 'atlas');
    atlas.svg.setAttribute('aria-label', 'Mapa de la partida: toca una comarca para ver su ficha');
    atlas.montado = montarAtlas(atlas.svg, (comarca) => {
      alTocarComarca(comarca);
    });
  }
  const clave = `${partida.id}|${String(partida.recibido.turno)}|${atlas.modo}|${String(partida.recibidaEn)}`;
  if (clave !== atlas.pintado) {
    const dibujo = componerAtlas(partida.atlas, partida.recibido.vista, {
      modo: atlas.modo,
      estacion: estacionDe(partida.recibido.turno, TABLAS_DEL_JUEGO),
    });
    atlas.pintado = clave;
    // Se pinta cuando el <svg> ya esta en el documento, para que tenga tamanyo.
    requestAnimationFrame(() => {
      atlas.montado?.pintar(dibujo);
      atlas.montado?.seleccionar(almacen.estado.comarcaAbierta);
    });
  } else {
    atlas.montado?.seleccionar(estado.comarcaAbierta);
  }
  const modos = el(
    'nav',
    { class: 'modos', 'aria-label': 'Qué enseña el mapa' },
    ...MODOS_DE_ATLAS.map((modo) => {
      const b = boton(
        NOMBRE_DE_MODO[modo],
        () => {
          atlas.modo = modo;
          almacen.refrescar();
        },
        modo === atlas.modo ? '' : 'secundario',
      );
      b.setAttribute('aria-pressed', modo === atlas.modo ? 'true' : 'false');
      return b;
    }),
  );
  const leyenda = el(
    'p',
    { class: 'leyenda' },
    ...leyendaDe(atlas.modo, partida.recibido.vista).map((e) =>
      e.trazo === undefined
        ? el('span', { style: `--color: ${e.color ?? 'transparent'}` }, e.texto)
        : el('span', { class: `trazo ${e.trazo}` }, e.texto),
    ),
  );
  return el(
    'div',
    { class: 'mapa' },
    modos,
    el(
      'p',
      { class: 'suave' },
      `${EXPLICACION_DE_MODO[atlas.modo]} Toca una comarca para ver su ficha.`,
    ),
    el('div', { class: 'contenedor-atlas' }, atlas.svg),
    leyenda,
  );
}

/** Las fichas ya traidas, por partida, turno y comarca: cambian solo al resolverse el turno. */
const fichas = new Map<string, FichaDeComarca | 'cargando'>();

function fichaDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement | null {
  const partida = estado.partida;
  const comarca = estado.comarcaAbierta;
  if (partida === null || comarca === null) return null;
  const clave = `${partida.id}|${String(partida.recibido.turno)}|${String(partida.recibidaEn)}|${comarca}`;
  const guardada = fichas.get(clave);
  if (guardada === undefined) {
    fichas.set(clave, 'cargando');
    void almacen.pedirFicha(comarca).then((ficha) => {
      if (ficha === null) fichas.delete(clave);
      else fichas.set(clave, ficha);
      almacen.refrescar();
    });
  }
  if (guardada === undefined || guardada === 'cargando') {
    return el('section', { class: 'ficha tarjeta hoja' }, el('p', {}, 'Cargando la comarca…'));
  }
  return pantallaDeFicha(almacen, guardada, partida.recibido.turno);
}

function bandejaDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  const partida = estado.partida;
  if (partida === null) return el('div');
  const { vista } = partida.recibido;
  const nombre = nombreDeComarcaEn(estado);
  const resumen = resumenDeRecursos(vista);
  const partes: (Node | string)[] = [
    el('h2', {}, 'Tus recursos'),
    el(
      'p',
      { class: 'fila' },
      el('strong', {}, 'Para gastar:'),
      fichasDeRecursos(resumen.disponible),
    ),
    el(
      'p',
      { class: 'fila' },
      el('strong', {}, 'Apartado por obras:'),
      fichasDeRecursos(resumen.reservado),
    ),
    el(
      'p',
      { class: 'fila' },
      el('strong', {}, 'Producido el último turno:'),
      fichasDeRecursos(resumen.producido),
    ),
  ];
  const ultimo = estado.resumen;
  if (ultimo !== null && ultimo.hasta === vista.turno) {
    const cambios = Object.fromEntries(ultimo.recursos.map((c) => [c.recurso, c.cambio]));
    partes.push(
      el(
        'p',
        { class: 'fila' },
        el('strong', {}, 'Cambio en el último turno:'),
        fichasDeRecursos({ ...resumen.disponible, ...cambios }, { signo: true }),
        boton(
          'Ver resumen',
          () => {
            almacen.abrirResumen();
          },
          'secundario icono',
        ),
      ),
    );
  }

  const locales = estado.pendientes.map((p) =>
    el(
      'li',
      {},
      el(
        'div',
        { class: 'fila' },
        describirOrden(p.intencion, nombre),
        el('span', { class: 'etiqueta' }, p.error === null ? 'enviando…' : 'rechazada'),
        boton(
          'Quitar',
          () => {
            almacen.quitar(p.idCliente);
          },
          'secundario icono empuje',
        ),
      ),
      p.error === null ? '' : el('p', { class: 'error' }, p.error.mensaje),
    ),
  );
  const enviadas = estado.enviadas.map((o) =>
    el(
      'li',
      {},
      el(
        'div',
        { class: 'fila' },
        describirOrden(o.orden, nombre),
        o.orden.turnoProgramado === null
          ? ''
          : el('span', { class: 'etiqueta' }, `para el turno ${String(o.orden.turnoProgramado)}`),
        boton(
          'Retirar',
          () => {
            void almacen.retirar(o.id);
          },
          'secundario icono empuje',
        ),
      ),
      el('div', { class: 'fila suave' }, 'Apartará:', fichasDeRecursos(o.orden.coste)),
    ),
  );
  const colas = colasDe(vista);
  const enMarcha = vista.ordenes.map((o) => {
    const fila = el(
      'div',
      { class: 'fila' },
      describirOrden(o, nombre),
      el('span', { class: 'etiqueta' }, NOMBRE_DE_ESTADO[o.estado]),
    );
    if (o.cola !== null && (colas.get(o.cola)?.length ?? 0) > 1) {
      for (const hacia of ['arriba', 'abajo'] as const) {
        const intencion = moverEnLaCola(vista, o.cola, o.id, hacia);
        if (intencion !== null) {
          fila.append(
            boton(
              hacia === 'arriba' ? '↑' : '↓',
              () => {
                void almacen.anyadir(intencion);
              },
              'secundario icono',
            ),
          );
        }
      }
    }
    return el(
      'li',
      {},
      fila,
      o.motivoEspera === null ? '' : el('p', { class: 'suave' }, `Espera: ${o.motivoEspera}`),
    );
  });
  partes.push(
    el('h2', {}, 'Tus órdenes'),
    el(
      'p',
      { class: 'suave' },
      `Se resuelven dentro de ${tiempoHastaElCorte(partida.recibido.proximaResolucion, Date.now()).replace('faltan ', '')}. Hasta entonces puedes retirarlas.`,
    ),
  );
  if (locales.length > 0)
    partes.push(el('h3', {}, 'Enviándose'), el('ul', { class: 'lista' }, ...locales));
  partes.push(
    el('h3', {}, 'Dadas este turno'),
    enviadas.length === 0
      ? el('p', { class: 'suave' }, 'Ninguna todavía: toca una comarca en el mapa para dar una.')
      : el('ul', { class: 'lista' }, ...enviadas),
    el('h3', {}, 'En marcha'),
    enMarcha.length === 0
      ? el('p', { class: 'suave' }, 'Nada en marcha.')
      : el('ul', { class: 'lista' }, ...enMarcha),
  );
  return el('section', { class: 'bandeja tarjeta' }, ...partes);
}

export function pantallaDePartida(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  const partida = estado.partida;
  if (partida === null) return el('p', {}, 'Cargando la partida…');
  const { vista } = partida.recibido;
  const cabecera = el(
    'header',
    { class: 'cabecera' },
    el('h1', {}, `${vista.configuracion.nombre} · turno ${String(vista.turno)}`),
    el(
      'span',
      { class: 'etiqueta' },
      `corte: ${tiempoHastaElCorte(partida.recibido.proximaResolucion, Date.now())}`,
    ),
  );
  if (vista.configuracion.esDePrueba) {
    cabecera.append(
      boton(
        'Resolver el turno ya',
        () => {
          void almacen.avanzar();
        },
        'empuje',
      ),
    );
  }
  const partes: (Node | string)[] = [cabecera];
  if (partida.desactualizada) {
    const hora = new Date(partida.recibidaEn).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    partes.push(el('p', { class: 'aviso' }, `Sin conexión: lo que ves es de las ${hora}.`));
  }
  if (estado.turnoNuevo !== null) {
    partes.push(
      el(
        'p',
        { class: 'aviso fila' },
        `Se ha resuelto el turno. `,
        boton('Ver qué ha pasado', () => {
          void almacen.recargar();
        }),
      ),
    );
  }
  for (const e of estado.errores)
    partes.push(el('p', { class: 'mensaje-error', role: 'alert' }, e.mensaje));
  const ficha = fichaDe(almacen, estado);
  partes.push(
    el(
      'div',
      { class: 'juego' },
      mapaDe(almacen, estado),
      el(
        'aside',
        { class: 'panel', 'data-conservar-scroll': 'panel' },
        ...(ficha === null ? [] : [ficha]),
        bandejaDe(almacen, estado),
      ),
    ),
  );
  if (estado.resumen !== null && estado.resumenAbierto) {
    partes.push(dialogoDeResumen(almacen, estado.resumen, nombreDeComarcaEn(estado)));
  }
  return el('section', {}, ...partes);
}
