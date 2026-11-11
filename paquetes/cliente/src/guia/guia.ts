// La guia del juego (ficha T-127 §2.1): una pagina aparte, en /guia/, que no carga el juego. El texto
// esta en `guia/index.html`; aqui solo se ponen las fuentes y los estilos, y las ocho casas, que salen
// de las tablas del juego para que la guia nunca diga de una casa algo distinto de lo que hace.
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/fraunces';
import './guia.css';

import { CASAS, TABLAS_DEL_JUEGO } from '@conquer/nucleo';

import { EMBLEMA_DE_CASA } from '../arte/index.ts';
import { CONSEJO_DE_CASA } from './consejos.ts';

function nodo(etiqueta: string, clase: string, ...hijos: (Node | string)[]): HTMLElement {
  const n = document.createElement(etiqueta);
  if (clase !== '') n.className = clase;
  n.append(...hijos);
  return n;
}

function parrafo(titulo: string, texto: string): HTMLElement {
  return nodo('p', '', nodo('strong', '', `${titulo}: `), texto);
}

function casas(): HTMLElement {
  const lista = nodo('ul', 'casas-de-la-guia');
  for (const casa of CASAS) {
    const d = TABLAS_DEL_JUEGO.casas[casa];
    const emblema = document.createElement('img');
    emblema.src = EMBLEMA_DE_CASA[casa];
    emblema.alt = '';
    emblema.width = 56;
    emblema.height = 65;
    lista.append(
      nodo(
        'li',
        'casa-de-la-guia',
        nodo('div', 'cabeza', emblema, nodo('h3', '', d.nombre)),
        parrafo('Privilegio', d.privilegio),
        parrafo('Herramienta', d.herramienta),
        parrafo('Límite', d.limite),
        nodo('p', 'consejo', nodo('strong', '', 'Cómo se juega: '), CONSEJO_DE_CASA[casa]),
      ),
    );
  }
  return lista;
}

const hueco = document.getElementById('fichas-de-casas');
hueco?.replaceChildren(casas());

// El indice marca la seccion que se esta leyendo.
const enlaces = new Map<string, HTMLAnchorElement>();
for (const a of document.querySelectorAll<HTMLAnchorElement>('nav.indice a[href^="#"]')) {
  enlaces.set(a.hash.slice(1), a);
}
if (typeof IntersectionObserver !== 'undefined') {
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        for (const a of enlaces.values()) a.removeAttribute('aria-current');
        enlaces.get(e.target.id)?.setAttribute('aria-current', 'true');
      }
    },
    { rootMargin: '-20% 0px -70% 0px' },
  );
  for (const id of enlaces.keys()) {
    const seccion = document.getElementById(id);
    if (seccion !== null) observador.observe(seccion);
  }
}
