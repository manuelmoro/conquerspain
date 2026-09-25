// La partida (fichas T-081 y T-082): el atlas con su conmutador, la ficha de la comarca tocada y la
// bandeja, con lo disponible, lo reservado y lo producido bien separados.
import { TABLAS_DEL_JUEGO, estacionDe } from '@conquer/nucleo';
import type { FichaDeComarca } from '@conquer/nucleo';

import { MODOS_DE_ATLAS, componerAtlas } from '../atlas/componer.ts';
import type { ModoDeAtlas } from '../atlas/componer.ts';
import { montarAtlas } from '../atlas/svg.ts';
import type { AtlasMontado } from '../atlas/svg.ts';

import type { Almacen, EstadoDelCliente } from '../almacen.ts';
import {
  colasDe,
  moverEnLaCola,
  recursosEnTexto,
  resumenDeRecursos,
  tiempoHastaElCorte,
} from '../bandeja.ts';
import { pantallaDeFicha } from './ficha.ts';
import { boton, el } from './dom.ts';

const NOMBRE_DE_MODO: Readonly<Record<ModoDeAtlas, string>> = {
  economico: 'Economía',
  logistico: 'Caminos',
  politico: 'Dominios',
};

/**
 * El atlas vive fuera de las repintadas de la pantalla: el mismo <svg> se reutiliza, asi no se pierde
 * el encuadre, y solo se recompone cuando cambian el atlas, el turno o el modo.
 */
interface EstadoDelAtlas {
  svg: SVGSVGElement | null;
  montado: AtlasMontado | null;
  modo: ModoDeAtlas;
  /** Lo que hay pintado: partida, turno, modo e instante de la vista. */
  pintado: string;
}

const atlas: EstadoDelAtlas = { svg: null, montado: null, modo: 'economico', pintado: '' };
let alTocarComarca: (comarca: string) => void = () => undefined;

function atlasDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  alTocarComarca = (comarca) => {
    almacen.abrirComarca(comarca);
  };
  const partida = estado.partida;
  if (partida === null || partida.atlas === null) return el('p', {}, 'Sin mapa todavía.');
  if (atlas.svg === null) {
    atlas.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    atlas.svg.setAttribute('class', 'atlas');
    atlas.montado = montarAtlas(atlas.svg, (comarca) => {
      alTocarComarca(comarca);
    });
  }
  const clave = `${partida.id}|${String(partida.recibido.turno)}|${atlas.modo}|${String(partida.recibidaEn)}`;
  const contenedor = el('div', { class: 'contenedor-atlas' }, atlas.svg);
  if (clave !== atlas.pintado) {
    const dibujo = componerAtlas(partida.atlas, partida.recibido.vista, {
      modo: atlas.modo,
      estacion: estacionDe(partida.recibido.turno, TABLAS_DEL_JUEGO),
    });
    atlas.pintado = clave;
    // Se pinta cuando el <svg> ya esta en el documento, para que tenga tamanyo.
    requestAnimationFrame(() => {
      atlas.montado?.pintar(dibujo);
    });
  }
  const modos = el(
    'nav',
    { class: 'modos' },
    ...MODOS_DE_ATLAS.map((modo) => {
      const b = boton(NOMBRE_DE_MODO[modo], () => {
        atlas.modo = modo;
        almacen.refrescar();
      });
      if (modo === atlas.modo) b.setAttribute('aria-pressed', 'true');
      return b;
    }),
  );
  return el('div', {}, contenedor, modos);
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
    return el('p', {}, 'Cargando la comarca…');
  }
  if (guardada === 'cargando') return el('p', {}, 'Cargando la comarca…');
  return pantallaDeFicha(almacen, guardada, partida.recibido.turno);
}

function bandejaDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  const partida = estado.partida;
  if (partida === null) return el('div');
  const { vista } = partida.recibido;
  const resumen = resumenDeRecursos(vista);
  const partes: (Node | string)[] = [
    el('h2', {}, 'Bandeja'),
    el(
      'p',
      {},
      `Corte del turno ${String(vista.turno)}: ${tiempoHastaElCorte(partida.recibido.proximaResolucion, Date.now())}`,
    ),
    el(
      'table',
      { class: 'recursos' },
      el('tr', {}, el('th', {}, 'Disponible'), el('td', {}, recursosEnTexto(resumen.disponible))),
      el('tr', {}, el('th', {}, 'Reservado'), el('td', {}, recursosEnTexto(resumen.reservado))),
      el(
        'tr',
        {},
        el('th', {}, 'Producido el último turno'),
        el('td', {}, recursosEnTexto(resumen.producido)),
      ),
    ),
  ];
  if (vista.configuracion.esDePrueba) {
    partes.push(
      boton('Resolver el turno ya (partida de prueba)', () => {
        void almacen.avanzar();
      }),
    );
  }
  // Por enviar: en este dispositivo, con su prevision.
  const prevision = almacen.prevision();
  const locales = el('ul');
  for (const p of estado.pendientes) {
    const linea = prevision?.lineas.find((l) => l.idCliente === p.idCliente);
    const tipo = typeof p.intencion['tipo'] === 'string' ? p.intencion['tipo'] : '¿?';
    const coste = linea === undefined || linea.coste === null ? '' : recursosEnTexto(linea.coste);
    locales.append(
      el(
        'li',
        {},
        `${tipo} · ${coste}`,
        linea?.cabe === false ? el('span', { class: 'error' }, ' · no alcanza') : '',
        p.error === null
          ? ' · por enviar'
          : el('span', { class: 'error' }, ` · ${p.error.mensaje}`),
        ' ',
        boton('Quitar', () => {
          almacen.quitar(p.idCliente);
        }),
      ),
    );
  }
  if (estado.pendientes.length > 0) partes.push(el('h3', {}, 'Por enviar'), locales);
  // Enviadas: en el servidor, esperando al corte; se pueden retirar.
  const enviadas = el('ul');
  for (const o of estado.enviadas) {
    enviadas.append(
      el(
        'li',
        {},
        `${o.orden.tipo} · reserva ${recursosEnTexto(o.orden.coste)}${o.orden.turnoProgramado === null ? '' : ` · para el turno ${String(o.orden.turnoProgramado)}`} `,
        boton('Retirar', () => {
          void almacen.retirar(o.id);
        }),
      ),
    );
  }
  partes.push(
    el('h3', {}, 'Enviadas, hasta el corte'),
    estado.enviadas.length === 0 ? el('p', {}, 'Ninguna.') : enviadas,
  );
  // En marcha: las que ya estan en el juego, con su estado y su cola.
  const colas = colasDe(vista);
  const enMarcha = el('ul');
  for (const o of vista.ordenes) {
    const item = el(
      'li',
      {},
      `${o.tipo} · ${o.estado}${o.motivoEspera === null ? '' : ` (${o.motivoEspera})`}`,
    );
    if (o.cola !== null && (colas.get(o.cola)?.length ?? 0) > 1) {
      for (const hacia of ['arriba', 'abajo'] as const) {
        const intencion = moverEnLaCola(vista, o.cola, o.id, hacia);
        if (intencion !== null) {
          item.append(
            ' ',
            boton(hacia === 'arriba' ? '↑' : '↓', () => {
              void almacen.anyadir(intencion);
            }),
          );
        }
      }
    }
    enMarcha.append(item);
  }
  partes.push(
    el('h3', {}, 'En marcha'),
    vista.ordenes.length === 0 ? el('p', {}, 'Ninguna.') : enMarcha,
  );
  return el('section', { class: 'bandeja' }, ...partes);
}

export function pantallaDePartida(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  const partida = estado.partida;
  if (partida === null) return el('p', {}, 'Cargando la partida…');
  const { vista } = partida.recibido;
  const partes: (Node | string)[] = [
    el('h1', {}, `Turno ${String(vista.turno)} · ${vista.jugador.nombre}`),
  ];
  if (partida.desactualizada) {
    const hora = new Date(partida.recibidaEn).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    partes.push(el('p', { class: 'aviso' }, `Sin conexion: esto es de las ${hora}.`));
  }
  if (estado.turnoNuevo !== null) {
    partes.push(
      el(
        'p',
        { class: 'aviso' },
        `Se ha resuelto el turno ${String(estado.turnoNuevo)}. `,
        boton('Recargar', () => {
          void almacen.recargar();
        }),
      ),
    );
  }
  partes.push(atlasDe(almacen, estado));
  const ficha = fichaDe(almacen, estado);
  if (ficha !== null) partes.push(ficha);
  partes.push(bandejaDe(almacen, estado));
  for (const e of estado.errores) partes.push(el('p', { class: 'error' }, e.mensaje));
  return el('section', {}, ...partes);
}
