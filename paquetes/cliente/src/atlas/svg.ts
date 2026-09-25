// El pintado del atlas en SVG y sus gestos (ficha T-081 §4.2). Pintar crea un <g> por capa; moverse y
// hacer zoom solo cambian el viewBox, y los rotulos se recolocan cuando el gesto termina.
import type { IdComarca } from '@conquer/nucleo';

import { CAPAS } from './componer.ts';
import type { Capa, Dibujo, Figura } from './componer.ts';
import { acercar, desplazar, encuadreInicial, escalaDe } from './encuadre.ts';
import { esArrastre } from './gestos.ts';
import type { Encuadre, Limites } from './encuadre.ts';
import { TAMANYO_DE_ROTULO_PX, colocarRotulos } from './rotulos.ts';

const NS = 'http://www.w3.org/2000/svg';
const ESPERA_DE_ROTULOS_MS = 120;

function nodo<K extends keyof SVGElementTagNameMap>(
  etiqueta: K,
  atributos: Record<string, string>,
): SVGElementTagNameMap[K] {
  const n = document.createElementNS(NS, etiqueta);
  for (const [a, v] of Object.entries(atributos)) n.setAttribute(a, v);
  return n;
}

function puntosEnTexto(f: Figura): string {
  return f.puntos.map(([x, y]) => `${String(x)},${String(y)}`).join(' ');
}

function figuraSvg(f: Figura, escala: number): SVGElement {
  const [x, y] = f.puntos[0] ?? [0, 0];
  switch (f.forma) {
    case 'poligono':
      return nodo('polygon', {
        points: puntosEnTexto(f),
        class: f.relleno === undefined ? f.clase : `${f.clase} con-relleno`,
        ...(f.relleno === undefined ? {} : { fill: f.relleno }),
      });
    case 'linea':
      return nodo('polyline', { points: puntosEnTexto(f), class: f.clase, fill: 'none' });
    case 'circulo':
      return nodo('circle', {
        cx: String(x),
        cy: String(y),
        r: String(5 / escala),
        class: f.clase,
      });
    case 'texto': {
      const t = nodo('text', {
        x: String(x),
        y: String(y),
        class: f.clase,
        'font-size': String(TAMANYO_DE_ROTULO_PX / escala),
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
      });
      t.textContent = f.texto ?? '';
      return t;
    }
  }
}

export interface AtlasMontado {
  pintar(dibujo: Dibujo): void;
  /** Resalta la comarca abierta en la ficha (null: ninguna). */
  seleccionar(comarca: string | null): void;
  destruir(): void;
}

export function montarAtlas(
  svg: SVGSVGElement,
  alTocar: (comarca: IdComarca) => void,
): AtlasMontado {
  const capas = new Map<Capa, SVGGElement>();
  for (const capa of CAPAS) {
    const g = nodo('g', { class: `capa capa-${capa}` });
    capas.set(capa, g);
    svg.append(g);
  }
  let dibujo: Dibujo | null = null;
  let encuadre: Encuadre = { x: 0, y: 0, ancho: 1, alto: 1 };
  let limites: Limites = { caja: encuadre, anchoMinimo: 1 };
  let temporizador: ReturnType<typeof setTimeout> | null = null;

  const anchoEnPantalla = (): number => Math.max(1, svg.clientWidth);
  const aplicarEncuadre = (): void => {
    svg.setAttribute(
      'viewBox',
      `${String(encuadre.x)} ${String(encuadre.y)} ${String(encuadre.ancho)} ${String(encuadre.alto)}`,
    );
  };
  const pintarRotulos = (): void => {
    const capa = capas.get('rotulos');
    if (capa === undefined || dibujo === null) return;
    const escala = escalaDe(encuadre, anchoEnPantalla());
    const puestos = colocarRotulos(
      dibujo.figuras.filter((f) => f.capa === 'rotulos'),
      escala,
    );
    capa.replaceChildren(...puestos.map((f) => figuraSvg(f, escala)));
  };
  const rotulosLuego = (): void => {
    if (temporizador !== null) clearTimeout(temporizador);
    temporizador = setTimeout(pintarRotulos, ESPERA_DE_ROTULOS_MS);
  };
  const aPunto = (clienteX: number, clienteY: number): [number, number] => {
    const r = svg.getBoundingClientRect();
    return [
      encuadre.x + ((clienteX - r.left) / r.width) * encuadre.ancho,
      encuadre.y + ((clienteY - r.top) / r.height) * encuadre.alto,
    ];
  };

  // Gestos (ficha T-088 §2.1): nada se captura al pulsar, para que el toque llegue a la comarca con raton
  // y con dedo. Si el gesto pasa del umbral es un arrastre (y entonces se captura el puntero); si no, al
  // soltar es un toque y se abre la comarca que haya debajo, aunque se pinche su feria o un aviso.
  const punteros = new Map<number, { x: number; y: number }>();
  let inicio: { x: number; y: number } | null = null;
  let arrastrando = false;
  let distancia = 0;
  const alBajar = (e: PointerEvent): void => {
    punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (punteros.size === 1) {
      inicio = { x: e.clientX, y: e.clientY };
      arrastrando = false;
    } else {
      arrastrando = true;
    }
  };
  const alMover = (e: PointerEvent): void => {
    const antes = punteros.get(e.pointerId);
    if (antes === undefined) return;
    const ahora = { x: e.clientX, y: e.clientY };
    if (!arrastrando && inicio !== null && esArrastre(inicio, ahora)) {
      arrastrando = true;
      svg.setPointerCapture(e.pointerId);
    }
    punteros.set(e.pointerId, ahora);
    if (!arrastrando) return;
    const lista = [...punteros.values()];
    const [a, b] = lista;
    if (lista.length === 2 && a !== undefined && b !== undefined) {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (distancia > 0)
        encuadre = acercar(
          encuadre,
          d / distancia,
          aPunto((a.x + b.x) / 2, (a.y + b.y) / 2),
          limites,
        );
      distancia = d;
    } else {
      const r = svg.getBoundingClientRect();
      encuadre = desplazar(
        encuadre,
        ((antes.x - ahora.x) / r.width) * encuadre.ancho,
        ((antes.y - ahora.y) / r.height) * encuadre.alto,
        limites,
      );
    }
    aplicarEncuadre();
    rotulosLuego();
  };
  const alSubir = (e: PointerEvent): void => {
    const eraToque = !arrastrando && punteros.size === 1;
    punteros.delete(e.pointerId);
    if (punteros.size < 2) distancia = 0;
    if (punteros.size === 0) inicio = null;
    if (!eraToque) return;
    // Toda la pila bajo el puntero, no solo lo de arriba: por encima de la comarca pasan caminos,
    // rutas y rotulos (en J-01, un camino tapaba la capital y el clic no abria nada).
    for (const debajo of document.elementsFromPoint(e.clientX, e.clientY)) {
      const id = debajo instanceof SVGElement ? debajo.dataset['comarca'] : undefined;
      if (id !== undefined) {
        alTocar(id as IdComarca);
        return;
      }
    }
  };
  const alRueda = (e: WheelEvent): void => {
    e.preventDefault();
    encuadre = acercar(
      encuadre,
      e.deltaY < 0 ? 1.2 : 1 / 1.2,
      aPunto(e.clientX, e.clientY),
      limites,
    );
    aplicarEncuadre();
    rotulosLuego();
  };
  svg.addEventListener('pointerdown', alBajar);
  svg.addEventListener('pointermove', alMover);
  svg.addEventListener('pointerup', alSubir);
  svg.addEventListener('pointercancel', (e) => {
    punteros.delete(e.pointerId);
    arrastrando = punteros.size > 0;
  });
  svg.addEventListener('wheel', alRueda, { passive: false });

  let seleccionada: string | null = null;
  const marcarSeleccion = (): void => {
    for (const n of capas.get('comarcas')?.querySelectorAll('[data-comarca]') ?? []) {
      if (n instanceof SVGElement)
        n.classList.toggle('seleccionada', n.dataset['comarca'] === seleccionada);
    }
  };

  return {
    pintar: (nuevo) => {
      const primeraVez = dibujo === null;
      dibujo = nuevo;
      limites = { caja: nuevo.caja, anchoMinimo: nuevo.caja.ancho / 12 };
      if (primeraVez)
        encuadre = encuadreInicial(nuevo.caja, anchoEnPantalla() / Math.max(1, svg.clientHeight));
      aplicarEncuadre();
      const escala = escalaDe(encuadre, anchoEnPantalla());
      for (const capa of CAPAS) {
        if (capa === 'rotulos') continue;
        const figuras = nuevo.figuras
          .filter((f) => f.capa === capa)
          .map((f) => {
            const n = figuraSvg(f, escala);
            if (f.comarca !== undefined) n.dataset['comarca'] = f.comarca;
            return n;
          });
        capas.get(capa)?.replaceChildren(...figuras);
      }
      pintarRotulos();
      marcarSeleccion();
    },
    seleccionar: (comarca) => {
      seleccionada = comarca;
      marcarSeleccion();
    },
    destruir: () => {
      if (temporizador !== null) clearTimeout(temporizador);
      svg.replaceChildren();
    },
  };
}
