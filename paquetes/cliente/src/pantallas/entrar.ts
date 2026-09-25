// Entrar con enlace magico (T-063, T-088): un formulario de verdad, con etiqueta, foco y validacion, y
// los errores a la vista (un enlace usado o caducado lo dice y deja pedir otro).
import type { Almacen, EstadoDelCliente } from '../almacen.ts';
import { el } from './dom.ts';

/** Si ya se mando un enlace en esta visita, para decirlo aunque la pantalla se repinte. */
let enviadoA: string | null = null;

export function pantallaDeEntrada(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  const correo = el('input', {
    id: 'correo',
    type: 'email',
    name: 'correo',
    required: '',
    autocomplete: 'email',
    placeholder: 'tu@correo.es',
  });
  const enviar = el('button', { type: 'submit' }, 'Mandarme el enlace');
  const mensaje = el('p', { 'aria-live': 'polite' });
  if (enviadoA !== null)
    mensaje.textContent = `Te hemos mandado un enlace a ${enviadoA}. Dura 15 minutos: ábrelo en este navegador.`;
  const formulario = el(
    'form',
    { novalidate: '' },
    el('label', { for: 'correo' }, 'Tu correo'),
    correo,
    enviar,
    mensaje,
  );
  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!correo.checkValidity()) {
      mensaje.textContent = 'Escribe un correo válido, como nombre@dominio.es.';
      correo.focus();
      return;
    }
    enviar.disabled = true;
    mensaje.textContent = 'Mandando…';
    almacen.limpiarErrores();
    void almacen.pedirEnlace(correo.value).then((ok) => {
      enviar.disabled = false;
      if (ok) {
        enviadoA = correo.value;
        mensaje.textContent = `Te hemos mandado un enlace a ${correo.value}. Dura 15 minutos: ábrelo en este navegador.`;
      } else {
        mensaje.textContent = '';
      }
    });
  });
  requestAnimationFrame(() => {
    correo.focus();
  });
  const errores = estado.errores.map((e) =>
    el('p', { class: 'mensaje-error', role: 'alert' }, e.mensaje),
  );
  return el(
    'section',
    { class: 'entrada tarjeta' },
    el('h1', {}, 'ConquerSpain'),
    el('p', {}, 'Escribe tu correo y te mandamos un enlace para entrar. No hace falta contraseña.'),
    ...errores,
    formulario,
  );
}
