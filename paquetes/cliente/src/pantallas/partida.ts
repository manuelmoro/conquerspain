// La partida (T-081, T-082, T-088): cabecera con el turno y el corte; el mapa con su conmutador, su
// explicacion y su leyenda; y el panel con la ficha de la comarca tocada y la bandeja. En escritorio el
// panel va al lado y fijo; en movil, debajo, y la ficha sube como hoja sobre el mapa.
import { RECURSOS, TABLAS_DEL_JUEGO, estacionDe } from '@conquer/nucleo';
import type { FichaDeComarca } from '@conquer/nucleo';

import type { Almacen, EstadoDelCliente } from '../almacen.ts';
import { MODOS_DE_ATLAS, componerAtlas } from '../atlas/componer.ts';
import type { ModoDeAtlas } from '../atlas/componer.ts';
import { EXPLICACION_DE_MODO, NOMBRE_DE_MODO, leyendaDe } from '../atlas/leyenda.ts';
import { montarAtlas } from '../atlas/svg.ts';
import type { AtlasMontado } from '../atlas/svg.ts';
import { colasDe, moverEnLaCola, resumenDeRecursos, tiempoHastaElCorte } from '../bandeja.ts';
import { MARCA_DE_RECURSO, NOMBRE_DE_ESTADO, NOMBRE_DE_RECURSO } from '../nombres.ts';
import { describirOrden, fichasDeRecursos } from './comun.ts';
import { boton, el } from './dom.ts';
import { tocar } from '../editor-de-ruta.ts';
import type {
  AtlasDeJugador,
  ClasificacionPublica,
  Cronica,
  Recurso,
  Recursos,
} from '@conquer/nucleo';

import { comarcasEnLista, textoDeLaBarra } from '../accesibilidad.ts';
import { CacheDeServidor } from '../cache.ts';
import { EMBLEMA_DE_CASA } from '../arte/index.ts';
import { PASOS_DEL_TUTORIAL, terminado } from '../tutorial.ts';
import { enfocar } from './foco.ts';

import type { MercadoRecibido, TurnoDelHistorial } from '../api.ts';
import { pantallaDeAyuda } from './ayuda.ts';
import { dialogoDeHistorial } from './historial.ts';
import { pantallaDeCasa } from './casa.ts';
import { pantallaDeCronica } from './cronica.ts';
import { pantallaDeFicha } from './ficha.ts';
import { pantallaDePlano } from './plano.ts';
import { pantallaDeMercado } from './mercado.ts';
import { pantallaDeRuta } from './ruta.ts';
import { pantallaDeUnidades } from './unidades.ts';
import { dialogoDeResumen } from './resumen.ts';

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

/** La ruta del editor para dibujarla: desde donde esta la unidad, por los tramos previstos. */
function rutaPropuesta(estado: EstadoDelCliente): string[] {
  const e = estado.editor;
  const vista = estado.partida?.recibido.vista;
  if (e === null || vista === undefined || e.paradas.length === 0) return [];
  const unidades = e.unidad.clase === 'recua' ? vista.recuas : vista.rebanyos;
  const situacion = unidades.find((u) => u.id === e.unidad.id)?.situacion;
  if (situacion === undefined) return [];
  const desde = situacion.donde === 'comarca' ? situacion.comarca : situacion.desde;
  const tramos = e.prevision?.tramos ?? [];
  return tramos.length > 0 ? [desde, ...tramos.map((t) => t.hasta)] : [desde, ...e.paradas];
}

/**
 * Todo lo que se hace tocando el mapa, sin el mapa (T-087): cada comarca conocida con un boton que
 * hace lo mismo que tocarla, abrir su ficha o, con el editor abierto, anyadirla como parada.
 */
function listaDeComarcas(almacen: Almacen, atlas_: AtlasDeJugador): HTMLElement {
  const plegable = el(
    'details',
    { class: 'comarcas-en-lista' },
    el('summary', {}, 'Las comarcas en lista'),
  );
  const lista = el('ul', { class: 'lista' });
  for (const c of comarcasEnLista(atlas_)) {
    lista.append(
      el(
        'li',
        { class: 'fila' },
        el('span', {}, c.nombre),
        el(
          'span',
          { class: 'etiqueta' },
          c.nivel === 'propia' ? 'tuya' : c.nivel === 'oida' ? 'de oídas' : 'explorada',
        ),
        boton(
          almacen.estado.editor === null ? 'Ver ficha' : 'Añadir parada',
          () => {
            alTocarComarca(c.id);
          },
          'secundario icono empuje',
        ),
      ),
    );
  }
  plegable.append(lista);
  return plegable;
}

function mapaDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  // Con el editor de ruta abierto, tocar el mapa traza la ruta; si no, abre la ficha.
  alTocarComarca = (comarca) => {
    if (almacen.estado.editor !== null) almacen.editar((e) => tocar(e, comarca));
    else almacen.abrirComarca(comarca);
  };
  const partida = estado.partida;
  if (partida === null || partida.atlas === null) return el('p', {}, 'Sin mapa todavía.');
  const plano = planoDe(almacen, estado);
  if (plano !== null) return plano;
  if (atlas.svg === null) {
    atlas.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    atlas.svg.setAttribute('class', 'atlas');
    atlas.svg.setAttribute('aria-label', 'Mapa de la partida: toca una comarca para ver su ficha');
    atlas.montado = montarAtlas(atlas.svg, (comarca) => {
      alTocarComarca(comarca);
    });
  }
  const propuesta = rutaPropuesta(estado);
  const clave = `${partida.id}|${String(partida.recibido.turno)}|${atlas.modo}|${String(partida.recibidaEn)}|${propuesta.join(',')}`;
  if (clave !== atlas.pintado) {
    const dibujo = componerAtlas(partida.atlas, partida.recibido.vista, {
      modo: atlas.modo,
      estacion: estacionDe(partida.recibido.turno, TABLAS_DEL_JUEGO),
      propuesta,
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
    el('span', { class: 'suave' }, 'Ver en el mapa:'),
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
        : el(
            'span',
            { class: `trazo ${e.trazo}` },
            e.texto,
            ...(e.nota === undefined ? [] : [el('small', { class: 'suave' }, ` (${e.nota})`)]),
          ),
    ),
  );
  const abierta = estado.comarcaAbierta;
  const volverAlPlano =
    abierta !== null && abierta === mapaEn
      ? boton(
          '🏘️ Ver su plano',
          () => {
            mapaEn = null;
            almacen.refrescar();
          },
          'secundario',
        )
      : '';
  return el(
    'div',
    { class: 'mapa' },
    modos,
    volverAlPlano,
    el(
      'p',
      { class: 'suave' },
      estado.editor === null
        ? `${EXPLICACION_DE_MODO[atlas.modo]} Toca una comarca para ver su ficha.`
        : 'Trazando una ruta: toca las comarcas donde parar.',
    ),
    el('div', { class: 'contenedor-atlas' }, atlas.svg),
    leyenda,
    listaDeComarcas(almacen, partida.atlas),
  );
}

/**
 * Lo traido del servidor, por partida, turno e instante de la vista: cambia al resolverse el turno. Un
 * fallo no se repite en cada repintada (T-090: el bucle topaba con el limite del servidor).
 */
const fichas = new CacheDeServidor<FichaDeComarca>();
const mercados = new CacheDeServidor<MercadoRecibido>();
const cronicas = new CacheDeServidor<Cronica>();
const clasificaciones = new CacheDeServidor<ClasificacionPublica>();

function claveDeVista(estado: EstadoDelCliente): string {
  const partida = estado.partida;
  return partida === null
    ? ''
    : `${partida.id}|${String(partida.recibido.turno)}|${String(partida.recibidaEn)}`;
}

/** La comarca propia en la que se ha pedido volver al mapa en vez de ver su plano. */
let mapaEn: string | null = null;

/** Con una comarca tuya abierta, el mapa deja sitio a su plano (T-092); no mientras se traza una ruta. */
function planoDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement | null {
  const partida = estado.partida;
  const comarca = estado.comarcaAbierta;
  if (comarca === null) mapaEn = null;
  if (partida === null || comarca === null || estado.editor !== null || mapaEn === comarca)
    return null;
  const ficha = fichas.leer(
    `${claveDeVista(estado)}|${comarca}`,
    () => almacen.pedirFicha(comarca),
    () => {
      almacen.refrescar();
    },
  );
  if (ficha === null) return null;
  return pantallaDePlano(
    ficha,
    partida.recibido.vista.jugador.capital === comarca,
    () => {
      mapaEn = comarca;
      almacen.refrescar();
    },
    () => {
      almacen.refrescar();
    },
  );
}

function fichaDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement | null {
  const partida = estado.partida;
  const comarca = estado.comarcaAbierta;
  if (partida === null || comarca === null) return null;
  const clave = `${claveDeVista(estado)}|${comarca}`;
  const ficha = fichas.leer(
    clave,
    () => almacen.pedirFicha(comarca),
    () => {
      almacen.refrescar();
    },
  );
  if (ficha === null) {
    return el(
      'section',
      { class: 'ficha tarjeta hoja' },
      el('p', {}, fichas.fallo(clave) ? 'No se pudo traer la comarca.' : 'Cargando la comarca…'),
      fichas.fallo(clave)
        ? boton('Reintentar', () => {
            fichas.olvidar(clave);
            almacen.refrescar();
          })
        : '',
    );
  }
  return pantallaDeFicha(
    almacen,
    ficha,
    partida.recibido.turno,
    partida.recibido.vista.jugador.casa,
  );
}

function mercadoDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement | null {
  if (estado.partida === null || estado.mercado === null) return null;
  const m = mercados.leer(
    claveDeVista(estado),
    () => almacen.pedirMercado(),
    () => {
      almacen.refrescar();
    },
  );
  return pantallaDeMercado(almacen, m, estado.mercado.plaza, nombreDeComarcaEn(estado));
}

function cronicaDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement | null {
  const partida = estado.partida;
  const abierta = estado.cronica;
  if (partida === null || abierta === null) return null;
  const repintar = (): void => {
    almacen.refrescar();
  };
  // En el turno 1 aun no hay ninguna cronica: no se pide nada (antes se pedia y fallaba en bucle).
  const hayCronica = abierta.turno >= 1 && abierta.turno < partida.recibido.turno;
  const cronica =
    abierta.vista === 'cronica' && hayCronica
      ? cronicas.leer(
          `${partida.id}|${String(abierta.turno)}`,
          () => almacen.pedirCronica(abierta.turno),
          repintar,
        )
      : null;
  const clasificacion =
    abierta.vista === 'clasificacion'
      ? clasificaciones.leer(claveDeVista(estado), () => almacen.pedirClasificacion(), repintar)
      : null;
  return pantallaDeCronica(
    almacen,
    abierta,
    { cronica, clasificacion },
    partida.recibido.turno,
    TABLAS_DEL_JUEGO.estaciones.turnosPorAnyo,
    nombreDeComarcaEn(estado),
    tiempoHastaElCorte(partida.recibido.proximaResolucion, Date.now()),
  );
}

function casaDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement | null {
  const partida = estado.partida;
  if (partida === null || !estado.casa) return null;
  const vista = partida.recibido.vista;
  const nombre = nombreDeComarcaEn(estado);
  // Las plazas, con su nombre, salen del mercado: el atlas no las nombra.
  const mercado = mercados.leer(
    claveDeVista(estado),
    () => almacen.pedirMercado(),
    () => {
      almacen.refrescar();
    },
  );
  const plazas = (mercado?.panel.plazas ?? []).map((p) => ({ id: p.id, nombre: p.nombre }));
  const comarcas = (partida.atlas?.comarcas ?? []).map((c) => ({ id: c.id, nombre: c.nombre }));
  const propias = comarcas.filter((c) => vista.comarcas[c.id]?.nivel === 'propia');
  const unidades = [...vista.recuas, ...vista.rebanyos];
  return pantallaDeCasa(
    almacen,
    vista,
    {
      comarca: nombre,
      plaza: (id) => plazas.find((p) => p.id === id)?.nombre ?? 'una plaza',
      unidad: (id) => unidades.find((u) => u.id === id)?.nombre ?? 'una recua',
    },
    { plazas, comarcas, propias },
  );
}

function bandejaDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  const partida = estado.partida;
  if (partida === null) return el('div');
  const { vista } = partida.recibido;
  const nombre = nombreDeComarcaEn(estado);
  const resumen = resumenDeRecursos(vista);
  const partes: (Node | string)[] = [
    el('h2', {}, 'Tus recursos'),
    el('p', { class: 'suave' }, 'Lo que tienes para gastar está arriba, siempre a la vista.'),
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
        boton(
          'Ver la crónica',
          () => {
            almacen.abrirCronica();
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
  return el('section', { class: 'bandeja tarjeta', id: 'bandeja' }, ...partes);
}

/** Las pestanyas del panel (T-090): lo que se ve al lado del mapa, con icono y texto. */
function pestanyasDelPanel(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  const activa = estado.ayuda
    ? 'ayuda'
    : estado.casa
      ? 'casa'
      : estado.cronica !== null
        ? 'cronica'
        : estado.mercado !== null
          ? 'mercado'
          : 'ordenes';
  const pestanya = (
    id: string,
    icono: string,
    texto: string,
    abrir: () => void,
  ): HTMLButtonElement => {
    const b = boton(texto, abrir, id === activa ? 'pestanya activa' : 'pestanya');
    // El icono encima del texto: caben las cuatro en el panel y en un movil.
    b.prepend(el('span', { class: 'icono-de-pestanya', 'aria-hidden': 'true' }, icono), el('br'));
    b.setAttribute('aria-pressed', id === activa ? 'true' : 'false');
    return b;
  };
  return el(
    'nav',
    { class: 'pestanyas', 'aria-label': 'Secciones del panel' },
    pestanya('ordenes', '📋', 'Órdenes', () => {
      almacen.cerrarAyuda();
      almacen.cerrarCasa();
      almacen.cerrarCronica();
      almacen.cerrarMercado();
      almacen.cerrarEditor();
      almacen.abrirComarca(null);
    }),
    pestanya('cronica', '📜', 'Crónica', () => {
      almacen.abrirCronica();
    }),
    pestanya('mercado', '⚖️', 'Mercado', () => {
      almacen.abrirMercado();
    }),
    pestanya('casa', '🏰', 'Tu casa', () => {
      almacen.abrirCasa();
    }),
    pestanya('ayuda', '❓', 'Ayuda', () => {
      almacen.abrirAyuda();
    }),
  );
}

/** El recurso cuyo historico se esta mirando (T-090), o null. */
let recursoAbierto: Recurso | null = null;
const historiales = new CacheDeServidor<readonly TurnoDelHistorial[]>();

/** Lo que tienes, como botones: al pulsar uno se abre su historico por turno. */
function botonesDeRecursos(almacen: Almacen, disponible: Recursos): HTMLElement {
  const caja = el('span', { class: 'recursos' });
  for (const r of RECURSOS) {
    if (disponible[r] === 0 && r !== 'pan') continue;
    const b = boton(
      `${MARCA_DE_RECURSO[r]} ${String(disponible[r])} ${NOMBRE_DE_RECURSO[r]}`,
      () => {
        recursoAbierto = r;
        almacen.refrescar();
      },
      'chip boton-de-recurso',
    );
    b.setAttribute('title', `Ver el histórico de ${NOMBRE_DE_RECURSO[r]}`);
    caja.append(b);
  }
  return caja;
}

/** Si el administrador esta confirmando el avance del turno: sobrevive a las repintadas. */
let confirmandoAvance = false;

/** La tarjeta del tutorial, abajo y sin tapar el mapa (T-090 §2.6). */
function tarjetaDelTutorial(almacen: Almacen, estado: EstadoDelCliente): HTMLElement | null {
  const progreso = estado.tutorial;
  if (progreso === null || terminado(progreso)) return null;
  const paso = PASOS_DEL_TUTORIAL[progreso.paso];
  if (paso === undefined || estado.partida === null) return null;
  // El tutorial habla de la casa con la que se juega: su privilegio y su limite.
  const casa = TABLAS_DEL_JUEGO.casas[estado.partida.recibido.vista.jugador.casa];
  return el(
    'aside',
    { class: 'tutorial', 'aria-live': 'polite', 'aria-label': 'Primeros pasos' },
    el(
      'p',
      { class: 'antetitulo' },
      `Primeros pasos · ${String(progreso.paso + 1)} de ${String(PASOS_DEL_TUTORIAL.length)}`,
    ),
    el('h2', {}, paso.titulo(casa)),
    el('p', {}, paso.texto(casa)),
    el(
      'p',
      { class: 'fila' },
      paso.hecho === null
        ? boton('Entendido', () => {
            almacen.tutorialSiguiente();
          })
        : el('span', { class: 'suave' }, 'Hazlo y seguimos.'),
      boton(
        paso.hecho === null ? 'Saltar el tutorial' : 'Saltar este paso',
        () => {
          if (paso.hecho === null) almacen.saltarTutorial();
          else almacen.tutorialSiguiente();
        },
        'secundario empuje',
      ),
    ),
  );
}

export function pantallaDePartida(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  const partida = estado.partida;
  if (partida === null) return el('p', {}, 'Cargando la partida…');
  const { vista } = partida.recibido;
  const abierta = estado.comarcaAbierta;
  almacen.tutorialAlDia({
    turno: vista.turno,
    capital: vista.jugador.capital,
    comarcaAbierta: abierta,
    abiertaEsPropia: abierta !== null && vista.comarcas[abierta]?.nivel === 'propia',
    ordenes: estado.enviadas.length + estado.pendientes.length + vista.ordenes.length,
  });
  const cabecera = el(
    'header',
    { class: 'cabecera' },
    el('a', { class: 'volver', href: './', 'aria-label': 'Volver a mis partidas' }, '←'),
    el('img', {
      class: 'emblema',
      src: EMBLEMA_DE_CASA[vista.jugador.casa],
      alt: '',
      width: '40',
      height: '47',
    }),
    el(
      'div',
      { class: 'titulo-de-partida' },
      el('h1', {}, vista.configuracion.nombre),
      el(
        'p',
        { class: 'suave' },
        `${TABLAS_DEL_JUEGO.casas[vista.jugador.casa].nombre} · turno ${String(vista.turno)} · corte: ${tiempoHastaElCorte(partida.recibido.proximaResolucion, Date.now())}`,
      ),
    ),
  );
  // Avanzar el turno a mano (T-090): en partidas de prueba, o quien administra la partida. Corta el
  // tiempo de las demas casas, asi que pide confirmarlo.
  if (vista.configuracion.esDePrueba || partida.recibido.esAdministrador === true) {
    const titulo = cabecera.querySelector('.titulo-de-partida h1');
    const avanzarYa = (): void => {
      confirmandoAvance = false;
      void almacen.avanzar();
    };
    const control = confirmandoAvance
      ? el(
          'span',
          { class: 'avanzar confirmando' },
          el('span', { class: 'suave' }, '¿Resolver ya para todas las casas?'),
          boton('Sí, avanzar', avanzarYa),
          boton(
            'No',
            () => {
              confirmandoAvance = false;
              almacen.refrescar();
            },
            'secundario',
          ),
        )
      : boton(
          '⏭ Avanzar turno',
          () => {
            if (vista.configuracion.esDePrueba) avanzarYa();
            else {
              confirmandoAvance = true;
              almacen.refrescar();
            }
          },
          'secundario avanzar',
        );
    titulo?.after(control);
  }
  // Lo que tienes para gastar, siempre a la vista arriba (J-01: costaba encontrarlo en el panel).
  const barra = el(
    'div',
    { class: 'barra-de-recursos', 'aria-label': 'Lo que tienes para gastar' },
    el('strong', {}, 'Tienes:'),
    botonesDeRecursos(almacen, resumenDeRecursos(vista).disponible),
  );
  const partes: (Node | string)[] = [el('div', { class: 'arriba' }, cabecera, barra)];
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
  if (estado.errores.length > 0) {
    partes.push(
      el(
        'div',
        { class: 'mensaje-error fila', role: 'alert' },
        el('div', {}, ...estado.errores.map((e) => el('p', {}, e.mensaje))),
        boton(
          '✕',
          () => {
            almacen.limpiarErrores();
          },
          'secundario icono empuje',
        ),
      ),
    );
  }
  const nombre = nombreDeComarcaEn(estado);
  const editor = estado.editor;
  const nombreDeUnidad =
    editor === null
      ? ''
      : ([...vista.recuas, ...vista.rebanyos].find((u) => u.id === editor.unidad.id)?.nombre ??
        'la unidad');
  const ficha =
    editor !== null
      ? pantallaDeRuta(almacen, editor, nombreDeUnidad, nombre)
      : estado.ayuda
        ? pantallaDeAyuda(almacen)
        : (mercadoDe(almacen, estado) ??
          cronicaDe(almacen, estado) ??
          casaDe(almacen, estado) ??
          fichaDe(almacen, estado));
  partes.push(
    el(
      'div',
      { class: 'juego' },
      mapaDe(almacen, estado),
      el(
        'aside',
        { class: 'panel', 'data-conservar-scroll': 'panel' },
        pestanyasDelPanel(almacen, estado),
        ...(ficha === null ? [] : [ficha]),
        pantallaDeUnidades(almacen, vista.recuas, vista.rebanyos, nombre),
        bandejaDe(almacen, estado),
      ),
    ),
  );
  // En movil, la bandeja queda abajo del todo: una barra fija dice cuantas ordenes hay y el corte.
  const dadas = estado.enviadas.length + estado.pendientes.length;
  partes.push(
    el(
      'a',
      { class: 'barra-inferior', href: '#bandeja' },
      textoDeLaBarra(dadas, tiempoHastaElCorte(partida.recibido.proximaResolucion, Date.now())),
    ),
  );
  if (recursoAbierto !== null) {
    const turnos = historiales.leer(
      claveDeVista(estado),
      () => almacen.pedirHistorial(),
      () => {
        almacen.refrescar();
      },
    );
    partes.push(
      dialogoDeHistorial(recursoAbierto, turnos, historiales.fallo(claveDeVista(estado)), () => {
        recursoAbierto = null;
        almacen.refrescar();
      }),
    );
  }
  const tutorial = tarjetaDelTutorial(almacen, estado);
  if (tutorial !== null) partes.push(tutorial);
  // Oscurece lo que no importa y pone la tarjeta junto a lo que hay que mirar (T-090).
  const paso =
    estado.tutorial === null || terminado(estado.tutorial)
      ? undefined
      : PASOS_DEL_TUTORIAL[estado.tutorial.paso];
  enfocar(paso === undefined ? [] : paso.objetivo(vista.jugador.capital), tutorial);
  if (estado.resumen !== null && estado.resumenAbierto) {
    partes.push(dialogoDeResumen(almacen, estado.resumen, nombreDeComarcaEn(estado)));
  }
  return el('section', {}, ...partes);
}
