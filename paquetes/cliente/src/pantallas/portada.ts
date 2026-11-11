// La portada (ficha T-090 §2.4): que se entienda de un vistazo de que va el juego y apetezca jugar. La
// peninsula con sus canyadas y recuas en marcha, tres pasos de como se juega y las ocho casas con su
// emblema. La accion (entrar o convocar) la pone quien la usa.
import { CASAS, TABLAS_DEL_JUEGO } from '@conquer/nucleo';

import { EMBLEMA_DE_CASA, PENINSULA } from '../arte/index.ts';
import { el } from './dom.ts';

const PASOS: readonly { readonly titulo: string; readonly texto: string }[] = [
  {
    titulo: 'Lee la crónica',
    texto:
      'Cada turno te cuentan qué ha pasado en tus tierras: cosechas, recuas que llegan, precios, hambre.',
  },
  {
    titulo: 'Da tus órdenes',
    texto:
      'Construye, manda recuas, compra y vende, gana comarcas. Con calma: tienes hasta el corte.',
  },
  {
    titulo: 'La partida avanza sola',
    texto:
      'A su hora se resuelve el turno de todos a la vez. Gana quien mejor lee su tierra, no quien más se conecta.',
  },
];

/** La primera frase del privilegio de una casa: lo que la hace distinta, en pocas palabras. */
function lema(privilegio: string): string {
  const corte = privilegio.indexOf(':');
  return corte > 0 ? privilegio.slice(0, corte) : privilegio;
}

export function portada(accion: HTMLElement): HTMLElement {
  const pasos = el(
    'ol',
    { class: 'pasos' },
    ...PASOS.map((p, i) =>
      el(
        'li',
        {},
        el('span', { class: 'numero', 'aria-hidden': 'true' }, String(i + 1)),
        el('h3', {}, p.titulo),
        el('p', {}, p.texto),
      ),
    ),
  );
  const casas = el(
    'ul',
    { class: 'casas-portada' },
    ...CASAS.map((casa) => {
      const d = TABLAS_DEL_JUEGO.casas[casa];
      return el(
        'li',
        {},
        el('img', { src: EMBLEMA_DE_CASA[casa], alt: '', width: '56', height: '65' }),
        el('strong', {}, d.nombre),
        el('span', {}, lema(d.privilegio)),
      );
    }),
  );
  return el(
    'div',
    { class: 'portada' },
    el(
      'section',
      { class: 'heroe' },
      el(
        'div',
        { class: 'heroe-texto' },
        el(
          'p',
          { class: 'antetitulo' },
          'Estrategia por turnos · Península ibérica, siglos XIII–XVI',
        ),
        el('h1', { class: 'marca' }, 'Conquer', el('span', { class: 'marca-spain' }, 'Spain')),
        el(
          'p',
          { class: 'entradilla' },
          'Gobierna una casa de oficio —pastores de la Mesta, ferrones, mercaderes, monjes…— y hazla crecer sobre la geografía real: dónde hay sal, hierro, lana o pastos decide tu estrategia.',
        ),
        accion,
      ),
      el(
        'figure',
        { class: 'heroe-mapa' },
        el('img', {
          src: PENINSULA,
          alt: 'La península ibérica dividida en sus 403 comarcas, con las cañadas reales y recuas que las recorren.',
        }),
      ),
    ),
    el('section', { class: 'como-se-juega' }, el('h2', {}, 'Cómo se juega'), pasos),
    el(
      'section',
      { class: 'casas-del-juego' },
      el('h2', {}, 'Ocho casas, ocho maneras de jugar'),
      el(
        'p',
        { class: 'suave' },
        'Cada casa juega a un juego distinto, no a lo mismo con un bonus.',
      ),
      casas,
    ),
  );
}
