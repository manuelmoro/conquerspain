// La charla de la partida (ficha T-129 §2.3), en su pestanya del panel: los mensajes por turno, los
// nuevos marcados, y un campo para escribir que no pierde lo escrito aunque la pantalla se repinte (la
// pantalla entera se rehace con cada cambio, tambien al llegar un mensaje).
import { CASAS, TABLAS_DEL_JUEGO } from '@conquer/nucleo';

import type { Almacen, CharlaDelCliente } from '../almacen.ts';
import type { MensajeRecibido } from '../api.ts';
import { boton, el } from './dom.ts';

/** Lo mas largo de un mensaje: lo mismo que acepta el servidor. */
const LARGO_MAXIMO = 500;

/** Lo que se esta escribiendo, y si el campo tenia el foco: sobreviven a las repintadas. */
let borrador = '';
let conFoco = false;
let enviando = false;
/** Cuantos mensajes habia la ultima vez: si llegan mas y se estaba abajo, se baja con ellos. */
let mensajesPintados = 0;
let estabaAbajo = true;

function nombreDeCasa(casa: string | null): string {
  const c = CASAS.find((x) => x === casa);
  return c === undefined ? '' : TABLAS_DEL_JUEGO.casas[c].nombre;
}

/** «14:05», o «12 nov, 14:05» si no es de hoy. */
export function horaDeMensaje(instante: number, ahora: number): string {
  const fecha = new Date(instante);
  const hora = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  if (new Date(ahora).toDateString() === fecha.toDateString()) return hora;
  return `${fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}, ${hora}`;
}

function mensaje(m: MensajeRecibido, propio: boolean, ahora: number): HTMLElement {
  const casa = nombreDeCasa(m.casa);
  return el(
    'li',
    { class: propio ? 'mensaje propio' : 'mensaje' },
    el(
      'p',
      { class: 'autor' },
      el('strong', {}, propio ? 'Tú' : m.nombre),
      casa === '' ? '' : el('span', { class: 'suave' }, ` · ${casa}`),
      el('span', { class: 'suave hora' }, horaDeMensaje(m.enviadoEn, ahora)),
    ),
    el('p', { class: 'texto' }, m.texto),
  );
}

function listaDeMensajes(
  charla: CharlaDelCliente,
  yo: string,
  ahora: number,
): (HTMLElement | string)[] {
  const filas: HTMLElement[] = [];
  let turno: number | null = null;
  let nuevosMarcados = false;
  for (const m of charla.mensajes) {
    if (m.turno !== turno) {
      turno = m.turno;
      filas.push(el('li', { class: 'separador' }, `Turno ${String(m.turno)}`));
    }
    const propio = m.jugador === yo;
    if (!nuevosMarcados && !propio && m.id > charla.leidoAlAbrir) {
      nuevosMarcados = true;
      filas.push(el('li', { class: 'separador nuevos' }, 'Nuevos'));
    }
    filas.push(mensaje(m, propio, ahora));
  }
  return filas;
}

export function pantallaDeCharla(almacen: Almacen, yo: string, ahora: number): HTMLElement {
  const charla = almacen.estado.charla;
  const lista = el('ol', { class: 'mensajes', 'aria-live': 'polite', 'aria-label': 'Mensajes' });
  const caja = el('div', { class: 'caja-de-mensajes' }, lista);
  if (charla === null) lista.append(el('li', { class: 'suave' }, 'Cargando…'));
  else if (charla.mensajes.length === 0)
    lista.append(
      el('li', { class: 'suave vacia' }, 'Nadie ha escrito todavía. Rompe el hielo: saluda.'),
    );
  else lista.append(...listaDeMensajes(charla, yo, ahora));
  caja.addEventListener('scroll', () => {
    estabaAbajo = caja.scrollHeight - caja.scrollTop - caja.clientHeight < 40;
  });
  // Abajo del todo al abrir, y con lo que llega si ya se estaba abajo.
  const cuantos = charla?.mensajes.length ?? 0;
  const bajar = cuantos !== mensajesPintados && estabaAbajo;
  mensajesPintados = cuantos;
  const anteriores =
    charla?.hayMas === true
      ? boton(
          'Ver mensajes anteriores',
          () => {
            estabaAbajo = false;
            void almacen.charlaAnterior();
          },
          'secundario anteriores',
        )
      : '';

  const campo = el('textarea', {
    rows: '2',
    maxlength: String(LARGO_MAXIMO),
    placeholder: 'Escribe a las demás casas…',
    'aria-label': 'Tu mensaje',
  });
  campo.value = borrador;
  const cuenta = el(
    'span',
    { class: 'suave cuenta' },
    `${String(borrador.length)}/${String(LARGO_MAXIMO)}`,
  );
  campo.addEventListener('input', () => {
    borrador = campo.value;
    cuenta.textContent = `${String(borrador.length)}/${String(LARGO_MAXIMO)}`;
  });
  campo.addEventListener('focus', () => {
    conFoco = true;
  });
  campo.addEventListener('blur', () => {
    conFoco = false;
  });
  const enviar = (): void => {
    const texto = borrador.trim();
    if (texto === '' || enviando) return;
    enviando = true;
    estabaAbajo = true;
    void almacen.escribirEnLaCharla(texto).then((ok) => {
      enviando = false;
      if (ok) borrador = '';
      almacen.refrescar();
    });
  };
  // Intro envia; Mayusculas + Intro, salto de linea.
  campo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      enviar();
    }
  });
  const formulario = el(
    'form',
    { class: 'escribir' },
    campo,
    el(
      'div',
      { class: 'fila' },
      cuenta,
      el('span', { class: 'suave' }, 'Intro envía · Mayús + Intro, otra línea'),
      el('button', { type: 'submit', class: 'empuje' }, enviando ? 'Enviando…' : 'Enviar'),
    ),
  );
  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    enviar();
  });
  // Los nodos son nuevos en cada repintada: el foco y el desplazamiento se ponen ya en la pagina.
  setTimeout(() => {
    if (bajar) caja.scrollTop = caja.scrollHeight;
    if (conFoco) {
      campo.focus();
      campo.setSelectionRange(campo.value.length, campo.value.length);
    }
  }, 0);

  return el(
    'section',
    { class: 'ficha tarjeta hoja charla' },
    el('h2', {}, '💬 Charla'),
    boton(
      '✕',
      () => {
        almacen.cerrarCharla();
      },
      'cerrar secundario icono',
    ),
    el(
      'p',
      { class: 'suave' },
      'Para hablar con las demás casas de la partida. Lo que se pacta aquí no obliga: los acuerdos con efecto son los contratos de «Tu casa».',
    ),
    anteriores,
    caja,
    formulario,
  );
}
