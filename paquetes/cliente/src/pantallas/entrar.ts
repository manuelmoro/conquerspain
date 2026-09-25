// Entrar con enlace magico (T-063): se pide el enlace y, al volver con `?token=`, se entra.
import type { Almacen } from '../almacen.ts';
import { boton, el } from './dom.ts';

export function pantallaDeEntrada(almacen: Almacen): HTMLElement {
  const correo = el('input', { type: 'email', placeholder: 'tu@correo.es', autocomplete: 'email' });
  const mensaje = el('p');
  return el(
    'section',
    {},
    el('h1', {}, 'ConquerSpain'),
    el('p', {}, 'Escribe tu correo y te mandamos un enlace para entrar. No hay contraseña.'),
    correo,
    ' ',
    boton('Mandar enlace', () => {
      void almacen.pedirEnlace(correo.value).then((ok) => {
        mensaje.textContent = ok
          ? 'Mira tu correo: el enlace dura 15 minutos.'
          : 'No se pudo mandar el enlace.';
      });
    }),
    mensaje,
  );
}
