// La partida (esqueleto): turno, almacen, aviso de turno nuevo y la bandeja con su prevision. La
// ficha de comarca y la bandeja definitiva son T-082; el atlas, T-081.
import { RECURSOS, TABLAS_DEL_JUEGO, estacionDe } from '@conquer/nucleo';
import type { Recursos } from '@conquer/nucleo';

import { MODOS_DE_ATLAS, componerAtlas } from '../atlas/componer.ts';
import type { ModoDeAtlas } from '../atlas/componer.ts';
import { montarAtlas } from '../atlas/svg.ts';
import type { AtlasMontado } from '../atlas/svg.ts';

import type { Almacen, EstadoDelCliente } from '../almacen.ts';
import { boton, el } from './dom.ts';

function recursosEnTexto(r: Recursos): string {
  return RECURSOS.filter((x) => r[x] !== 0)
    .map((x) => `${x} ${String(r[x])}`)
    .join(' · ');
}

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

function atlasDe(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  const partida = estado.partida;
  if (partida === null || partida.atlas === null) return el('p', {}, 'Sin mapa todavía.');
  if (atlas.svg === null) {
    atlas.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    atlas.svg.setAttribute('class', 'atlas');
    atlas.montado = montarAtlas(atlas.svg, () => undefined);
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
  partes.push(el('p', {}, `Almacen: ${recursosEnTexto(vista.jugador.almacen)}`));
  const prevision = almacen.prevision();
  const bandeja = el('ul');
  for (const p of estado.pendientes) {
    const linea = prevision?.lineas.find((l) => l.idCliente === p.idCliente);
    const tipo = typeof p.intencion['tipo'] === 'string' ? p.intencion['tipo'] : '¿?';
    const coste = linea === undefined || linea.coste === null ? '' : recursosEnTexto(linea.coste);
    bandeja.append(
      el(
        'li',
        {},
        `${tipo} ${coste}`,
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
  partes.push(
    el('h2', {}, 'Bandeja'),
    estado.pendientes.length === 0 ? el('p', {}, 'Sin ordenes por enviar.') : bandeja,
  );
  for (const e of estado.errores) partes.push(el('p', { class: 'error' }, e.mensaje));
  return el('section', {}, ...partes);
}
