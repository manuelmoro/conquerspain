// El plano de una comarca propia (ficha T-092): al abrir una comarca tuya, el mapa deja sitio a su
// plano en perspectiva, con cada solar dibujado como lo que lo ocupa. Tocar una parcela dice que es,
// por que ocupa el solar y que da; «Volver al mapa» devuelve el atlas sin cerrar la ficha.
import { MOTIVOS, TABLAS_DEL_JUEGO, rangoDe } from '@conquer/nucleo';
import type { DetalleDePropia, FichaDeComarca } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';

import {
  MEDIO_ALTO,
  MEDIO_ANCHO,
  dibujoDeEdificio,
  dibujoDeObra,
  dibujoDePlaza,
  dibujoLibre,
  dibujoPedido,
  insigniaDeNivel,
  marcaDeAmpliacion,
  tachado,
} from '../arte/edificios.ts';
import { ICONO_DE_EDIFICIO } from '../estado-de-comarca.ts';
import type { ObraPedida, Parcela } from '../plano.ts';
import {
  COLUMNAS_DEL_PLANO,
  accionesDeParcela,
  textoDeRango,
  explicarParcela,
  parcelasDe,
  rejillaDelPlano,
} from '../plano.ts';
import { tarjetaDeAccion } from './acciones.ts';
import { boton, el } from './dom.ts';

const SVG = 'http://www.w3.org/2000/svg';
/** Lo que se eleva un edificio por encima de su rombo, para que no se corte arriba. */
const ALTURA_MAXIMA = 80;

/** La parcela tocada, por comarca: sobrevive a las repintadas. */
let elegida: { readonly comarca: string; readonly indice: number } | null = null;

function dibujo(parcela: Parcela): string {
  if (parcela.clase === 'libre') return dibujoLibre();
  if (parcela.clase === 'obra') return dibujoDeObra(parcela.avance);
  if (parcela.clase === 'pedida') return dibujoPedido(parcela.edificio);
  return (
    dibujoDeEdificio(parcela.edificio) +
    insigniaDeNivel(parcela.nivel, parcela.maximo) +
    (parcela.ampliando !== null
      ? marcaDeAmpliacion(true)
      : parcela.ampliacionPedida
        ? marcaDeAmpliacion(false)
        : '') +
    (parcela.derribo ? tachado() : '')
  );
}

function etiqueta(parcela: Parcela): string {
  if (parcela.clase === 'libre') return 'Solar libre';
  if (parcela.clase === 'obra') return `${parcela.nombre}, en obras al ${String(parcela.avance)} %`;
  if (parcela.clase === 'pedida') return `${parcela.nombre}, pedida`;
  return `${parcela.nombre}, nivel ${String(parcela.nivel)} de ${String(parcela.maximo)}${parcela.ampliando === null ? '' : ', ampliándose'}${parcela.derribo ? ', se va a derribar' : ''}`;
}

/**
 * Lo pedido en esta comarca que aun no ha empezado: lo dado este turno y lo que espera en su cola.
 * Lo que ya esta en obras sale de la ficha; una orden que se esta anulando ya no cuenta.
 */
function pedidasEn(almacen: Almacen, comarca: string): readonly ObraPedida[] {
  const anuladas = new Set(
    almacen.estado.enviadas.flatMap((o) => (o.orden.tipo === 'anular' ? [o.orden.orden] : [])),
  );
  const vivas = almacen.estado.partida?.recibido.vista.ordenes ?? [];
  const ordenes = [
    ...almacen.estado.enviadas.map((o) => o.orden),
    ...vivas.filter((o) => o.estado !== 'en curso' && !anuladas.has(o.id)),
  ];
  return ordenes.flatMap((o): ObraPedida[] =>
    (o.tipo === 'construir' || o.tipo === 'derribar') && o.comarca === comarca
      ? [
          {
            tipo: o.tipo,
            edificio: o.edificio,
            espera: o.motivoEspera === null ? null : (MOTIVOS[o.motivoEspera] ?? o.motivoEspera),
          },
        ]
      : [],
  );
}

function grupo(x: number, y: number, marcado: string): SVGGElement {
  const g = document.createElementNS(SVG, 'g');
  // Algo menores que su celda, para que entre parcela y parcela quede la linde.
  g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(0.95)`);
  // Marcado fijo de arte/edificios.ts: no lleva nada escrito por un jugador.
  g.innerHTML = marcado;
  return g;
}

function lienzo(
  comarca: string,
  parcelas: readonly Parcela[],
  capital: boolean,
  /** Los vecinos de la comarca: la plaza se dibuja segun su rango (T-094). */
  poblacion: number,
  tocar: (indice: number) => void,
): SVGSVGElement {
  const rejilla = rejillaDelPlano(parcelas.length);
  const filas = Math.max(rejilla.plaza.fila + 1, ...rejilla.parcelas.map((c) => c.fila + 1));
  const centro = (c: { columna: number; fila: number }): [number, number] => [
    (c.columna - c.fila) * MEDIO_ANCHO,
    (c.columna + c.fila) * MEDIO_ALTO,
  ];
  const izquierda = -(filas - 1) * MEDIO_ANCHO - MEDIO_ANCHO;
  const derecha = (COLUMNAS_DEL_PLANO - 1) * MEDIO_ANCHO + MEDIO_ANCHO;
  const arriba = -MEDIO_ALTO - ALTURA_MAXIMA;
  const abajo = (COLUMNAS_DEL_PLANO - 1 + filas - 1) * MEDIO_ALTO + MEDIO_ALTO + 10;
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'plano');
  svg.setAttribute(
    'viewBox',
    `${String(izquierda - 8)} ${String(arriba)} ${String(derecha - izquierda + 16)} ${String(abajo - arriba)}`,
  );
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', 'Plano de la comarca: toca una parcela para ver qué es');

  // Se pinta de atras adelante (por fila + columna) para que lo de delante tape lo de detras.
  const piezas: { orden: number; nodo: SVGGElement }[] = [];
  const [px, py] = centro(rejilla.plaza);
  const plaza = grupo(px, py, dibujoDePlaza(capital, rangoDe(poblacion, TABLAS_DEL_JUEGO)));
  plaza.setAttribute('class', 'plaza-del-plano');
  piezas.push({ orden: rejilla.plaza.fila + rejilla.plaza.columna, nodo: plaza });
  parcelas.forEach((parcela, i) => {
    const celda = rejilla.parcelas[i];
    if (celda === undefined) return;
    const [x, y] = centro(celda);
    const g = grupo(x, y, dibujo(parcela));
    const marcada = elegida?.comarca === comarca && elegida.indice === i;
    g.setAttribute('class', `parcela ${parcela.clase}${marcada ? ' elegida' : ''}`);
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', etiqueta(parcela));
    const titulo = document.createElementNS(SVG, 'title');
    titulo.textContent = etiqueta(parcela);
    g.append(titulo);
    g.addEventListener('click', () => {
      tocar(i);
    });
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tocar(i);
      }
    });
    piezas.push({ orden: celda.fila + celda.columna + i / 100, nodo: g });
  });
  piezas.sort((a, b) => a.orden - b.orden);
  for (const pieza of piezas) svg.append(pieza.nodo);
  return svg;
}

function detalle(
  almacen: Almacen,
  ficha: FichaDeComarca,
  parcela: Parcela,
  propia: DetalleDePropia,
  turno: number,
): HTMLElement {
  const texto = explicarParcela(parcela, propia);
  const icono = parcela.clase === 'libre' ? '➕' : ICONO_DE_EDIFICIO[parcela.edificio];
  const acciones = accionesDeParcela(
    parcela,
    ficha.acciones,
    propia.edificios.map((e) => e.tipo),
  );
  const caja = el(
    'div',
    { class: 'tarjeta detalle-de-parcela', role: 'status' },
    el('strong', {}, `${icono} ${texto.titulo}`),
    ...texto.lineas.map((l) => el('p', {}, l)),
  );
  // Un mercado o una venta son una plaza: el atajo a comprar y vender en ella (T-092, tras jugar).
  if (
    parcela.clase === 'edificio' &&
    (parcela.edificio === 'mercado' || parcela.edificio === 'venta')
  )
    caja.append(
      el(
        'p',
        { class: 'fila' },
        boton('⚖️ Comprar o vender aquí', () => {
          almacen.abrirMercado(ficha.id);
        }),
        el('span', { class: 'suave' }, 'Hace falta una recua tuya en la comarca.'),
      ),
    );
  if (acciones.length > 0) {
    caja.append(
      el('h4', {}, parcela.clase === 'libre' ? 'Qué puedes levantar aquí' : 'Qué puedes hacer'),
      el(
        'ul',
        { class: 'lista' },
        ...acciones.map((a) => tarjetaDeAccion(almacen, ficha.id, a, turno)),
      ),
    );
  } else if (parcela.clase === 'libre') {
    caja.append(
      el('p', { class: 'suave' }, 'Ahora no puedes levantar nada: mira en la ficha qué falta.'),
    );
  }
  return caja;
}

/** El dibujo con la explicacion de la parcela tocada: va en el mapa y, en movil, dentro de la ficha. */
function planoYDetalle(
  ficha: FichaDeComarca,
  propia: DetalleDePropia,
  capital: boolean,
  almacen: Almacen,
  turno: number,
): HTMLElement[] {
  const parcelas = parcelasDe(propia, pedidasEn(almacen, ficha.id));
  if (elegida !== null && elegida.comarca !== ficha.id) elegida = null;
  const svg = lienzo(ficha.id, parcelas, capital, propia.poblacion, (indice) => {
    elegida = { comarca: ficha.id, indice };
    almacen.refrescar();
  });
  const tocada = elegida === null ? undefined : parcelas[elegida.indice];
  return [
    el('div', { class: 'contenedor-atlas contenedor-plano' }, svg),
    tocada === undefined
      ? el('p', { class: 'suave' }, 'Toca una parcela para saber qué hay y por qué ocupa el solar.')
      : detalle(almacen, ficha, tocada, propia, turno),
  ];
}

function resumen(propia: DetalleDePropia, capital: boolean): string {
  const libres = parcelasDe(propia).filter((p) => p.clase === 'libre').length;
  return `${textoDeRango(propia.poblacion)} ${String(propia.solares.total - libres)} de ${String(propia.solares.total)} solares ocupados: cada edificio ocupa uno, y ampliarlo no gasta otro. En el centro, la plaza del pueblo${capital ? ' con la torre de tu corte' : ''}. Toca una parcela para ver qué es.`;
}

/** El plano de la comarca abierta en el sitio del mapa, o null si no es tuya. */
export function pantallaDePlano(
  ficha: FichaDeComarca,
  capital: boolean,
  volver: () => void,
  almacen: Almacen,
  turno: number,
): HTMLElement | null {
  const propia = ficha.propia;
  if (propia === null) return null;
  return el(
    'section',
    { class: 'mapa plano-de-comarca' },
    el(
      'div',
      { class: 'fila' },
      el('h2', {}, `${capital ? '🏰 ' : ''}${ficha.nombre}`),
      boton('🗺️ Volver al mapa', volver, 'secundario empuje'),
    ),
    el('p', { class: 'suave explicacion-del-modo' }, resumen(propia, capital)),
    ...planoYDetalle(ficha, propia, capital, almacen, turno),
  );
}

/** El plano dentro de la ficha, solo en movil: alli la hoja tapa el mapa (lo oculta el CSS en escritorio). */
export function planoEnFicha(
  ficha: FichaDeComarca,
  capital: boolean,
  almacen: Almacen,
  turno: number,
): HTMLElement | null {
  const propia = ficha.propia;
  if (propia === null) return null;
  return el(
    'section',
    { class: 'plano-en-ficha' },
    el('h3', {}, 'Plano'),
    el('p', { class: 'suave' }, resumen(propia, capital)),
    ...planoYDetalle(ficha, propia, capital, almacen, turno),
  );
}
