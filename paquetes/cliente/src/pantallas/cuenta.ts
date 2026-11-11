// La cuenta desde el menu (ficha T-091 §3.3): la barra de arriba con «Entrar» y «Crear cuenta» (o tu
// nombre y «Salir»), y un dialogo con los formularios de entrar, crear cuenta, olvido de la contrasenya,
// restablecerla y entrar con un enlace. Las reglas de la contrasenya se ven antes de enviar.
import type { Almacen, EstadoDelCliente, Resultado } from '../almacen.ts';
import { LOGO } from '../arte/index.ts';
import { boton, el } from './dom.ts';
import { olvidarPartidas } from './partidas.ts';

type Modo = 'entrar' | 'crear' | 'olvido' | 'enlace' | 'restablecer';

const dialogo: {
  modo: Modo | null;
  token: string | null;
  aviso: Resultado | null;
  /** Lo escrito, que sobrevive a las repintadas (las contrasenyas no se guardan). */
  escrito: Partial<Record<'correo' | 'nombre', string>>;
} = { modo: null, token: null, aviso: null, escrito: {} };

/** Un campo de texto que recuerda lo escrito entre repintadas. */
function recordado(
  clave: 'correo' | 'nombre',
  atributos: Record<string, string>,
): HTMLInputElement {
  const i = entrada({ ...atributos, value: dialogo.escrito[clave] ?? '' });
  i.addEventListener('input', () => {
    dialogo.escrito[clave] = i.value;
  });
  return i;
}

export function abrirCuenta(almacen: Almacen, modo: Modo): void {
  dialogo.modo = modo;
  dialogo.aviso = null;
  almacen.refrescar();
}

/** Al llegar con `?restablecer=<token>` en la direccion. */
export function abrirRestablecer(token: string): void {
  dialogo.modo = 'restablecer';
  dialogo.token = token;
  dialogo.aviso = null;
}

function cerrar(almacen: Almacen): void {
  dialogo.modo = null;
  dialogo.aviso = null;
  almacen.refrescar();
}

/** La barra de arriba de la portada y de «Mis partidas». */
export function barraDeCuenta(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  const cuenta = estado.cuenta;
  const derecha =
    cuenta === null
      ? el(
          'div',
          { class: 'fila' },
          boton(
            'Entrar',
            () => {
              abrirCuenta(almacen, 'entrar');
            },
            'secundario',
          ),
          boton('Crear cuenta', () => {
            abrirCuenta(almacen, 'crear');
          }),
        )
      : el(
          'div',
          { class: 'fila' },
          el('span', { class: 'suave' }, `Hola, ${cuenta.nombre}`),
          boton(
            'Salir',
            () => {
              olvidarPartidas();
              void almacen.salir();
            },
            'secundario',
          ),
        );
  return el(
    'header',
    { class: 'barra-de-cuenta' },
    el(
      'a',
      { class: 'logo', href: './' },
      el('img', { src: LOGO, alt: '', width: '40', height: '40' }),
      el('span', {}, 'Conquer', el('span', { class: 'marca-spain' }, 'Spain')),
    ),
    derecha,
  );
}

/** Un campo con su etiqueta encima. */
function campo(etiqueta: string, entrada: HTMLInputElement, ayuda?: HTMLElement): HTMLElement {
  return el('label', {}, etiqueta, entrada, ...(ayuda === undefined ? [] : [ayuda]));
}

function entrada(atributos: Record<string, string>): HTMLInputElement {
  return el('input', { required: '', ...atributos });
}

/** Lo que pide la contrasenya, a la vista mientras se escribe (la regla la vuelve a mirar el servidor). */
function reglasDeClave(clave: HTMLInputElement, repetida: HTMLInputElement | null): HTMLElement {
  const lista = el('ul', { class: 'reglas-de-clave' });
  const pintar = (): void => {
    const reglas: [boolean, string][] = [[clave.value.length >= 10, 'Al menos 10 caracteres']];
    if (repetida !== null)
      reglas.push([repetida.value !== '' && repetida.value === clave.value, 'Las dos iguales']);
    lista.replaceChildren(
      ...reglas.map(([ok, texto]) =>
        el('li', { class: ok ? 'cumple' : '' }, `${ok ? '✓' : '·'} ${texto}`),
      ),
    );
  };
  clave.addEventListener('input', pintar);
  repetida?.addEventListener('input', pintar);
  pintar();
  return lista;
}

/** Monta un formulario que, al enviarse, deshabilita el boton, llama y ensenya el resultado. */
function formulario(
  almacen: Almacen,
  hijos: (Node | string)[],
  textoDelBoton: string,
  enviar: () => Promise<Resultado> | null,
  alAcertar?: () => void,
): HTMLFormElement {
  const b = el('button', { type: 'submit' }, textoDelBoton);
  const f = el('form', { class: 'formulario-de-cuenta' }, ...hijos, b);
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const promesa = enviar();
    if (promesa === null) return;
    b.disabled = true;
    void promesa.then((r) => {
      dialogo.aviso = r;
      if (r.ok && alAcertar !== undefined) alAcertar();
      almacen.refrescar();
    });
  });
  return f;
}

function contenido(almacen: Almacen, modo: Modo): (Node | string)[] {
  const enlace = (texto: string, a: Modo): HTMLElement =>
    boton(
      texto,
      () => {
        abrirCuenta(almacen, a);
      },
      'enlace',
    );
  switch (modo) {
    case 'entrar': {
      const correo = recordado('correo', { type: 'email', autocomplete: 'email', name: 'correo' });
      const clave = entrada({ type: 'password', autocomplete: 'current-password', name: 'clave' });
      const recordar = el('input', { type: 'checkbox', checked: '' });
      return [
        el('h2', {}, 'Entrar'),
        formulario(
          almacen,
          [
            campo('Correo', correo),
            campo('Contraseña', clave),
            el('label', { class: 'casilla' }, recordar, 'Recordarme en este dispositivo'),
          ],
          'Entrar',
          () => almacen.entrarConClave(correo.value, clave.value, recordar.checked),
          () => {
            dialogo.modo = null;
          },
        ),
        el(
          'p',
          { class: 'fila' },
          enlace('¿Olvidaste la contraseña?', 'olvido'),
          enlace('Entrar con un enlace por correo', 'enlace'),
        ),
        el('p', { class: 'suave' }, '¿No tienes cuenta? ', enlace('Crea una', 'crear')),
      ];
    }
    case 'crear': {
      const nombre = recordado('nombre', {
        type: 'text',
        autocomplete: 'nickname',
        maxlength: '40',
      });
      const correo = recordado('correo', { type: 'email', autocomplete: 'email' });
      const clave = entrada({ type: 'password', autocomplete: 'new-password', minlength: '10' });
      const repetida = entrada({ type: 'password', autocomplete: 'new-password', minlength: '10' });
      return [
        el('h2', {}, 'Crear cuenta'),
        formulario(
          almacen,
          [
            campo('Tu nombre en las partidas', nombre),
            campo('Correo', correo),
            campo('Contraseña', clave),
            campo('Repítela', repetida, reglasDeClave(clave, repetida)),
          ],
          'Crear cuenta',
          () => {
            if (clave.value !== repetida.value) {
              dialogo.aviso = { ok: false, mensaje: 'Las dos contraseñas no son iguales.' };
              almacen.refrescar();
              return null;
            }
            return almacen.registrar(correo.value, nombre.value, clave.value);
          },
        ),
        el(
          'p',
          { class: 'suave' },
          'Te mandaremos un correo para confirmar que es tuyo. ¿Ya tienes cuenta? ',
          enlace('Entra', 'entrar'),
        ),
      ];
    }
    case 'olvido': {
      const correo = recordado('correo', { type: 'email', autocomplete: 'email' });
      return [
        el('h2', {}, 'Olvidé la contraseña'),
        el('p', {}, 'Escribe tu correo y te mandamos un enlace para poner una contraseña nueva.'),
        formulario(almacen, [campo('Correo', correo)], 'Mandarme el enlace', () =>
          almacen.olvido(correo.value),
        ),
        el('p', {}, enlace('Volver a entrar', 'entrar')),
      ];
    }
    case 'enlace': {
      const correo = recordado('correo', { type: 'email', autocomplete: 'email' });
      return [
        el('h2', {}, 'Entrar con un enlace'),
        el('p', {}, 'Sin contraseña: te mandamos un enlace que vale 15 minutos.'),
        formulario(almacen, [campo('Correo', correo)], 'Mandarme el enlace', () =>
          almacen.pedirEnlace(correo.value).then((ok) => ({
            ok,
            mensaje: ok
              ? 'Te hemos mandado un enlace. Ábrelo en este navegador.'
              : 'No se pudo mandar el enlace.',
          })),
        ),
        el('p', {}, enlace('Volver a entrar', 'entrar')),
      ];
    }
    case 'restablecer': {
      const clave = entrada({ type: 'password', autocomplete: 'new-password', minlength: '10' });
      const repetida = entrada({ type: 'password', autocomplete: 'new-password', minlength: '10' });
      return [
        el('h2', {}, 'Contraseña nueva'),
        el(
          'p',
          { class: 'suave' },
          'Al cambiarla se cierran las sesiones abiertas en otros dispositivos.',
        ),
        formulario(
          almacen,
          [
            campo('Contraseña nueva', clave),
            campo('Repítela', repetida, reglasDeClave(clave, repetida)),
          ],
          'Guardar y entrar',
          () => {
            if (clave.value !== repetida.value) {
              dialogo.aviso = { ok: false, mensaje: 'Las dos contraseñas no son iguales.' };
              almacen.refrescar();
              return null;
            }
            return almacen.restablecer(dialogo.token ?? '', clave.value);
          },
          () => {
            dialogo.modo = null;
            dialogo.token = null;
            history.replaceState(null, '', location.pathname);
          },
        ),
      ];
    }
  }
}

/** El dialogo de cuenta, si esta abierto. */
export function dialogoDeCuenta(almacen: Almacen): HTMLElement | null {
  const modo = dialogo.modo;
  if (modo === null) return null;
  const aviso = dialogo.aviso;
  const caja = el(
    'div',
    {
      class: 'dialogo dialogo-de-cuenta',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Tu cuenta',
    },
    boton(
      '✕',
      () => {
        cerrar(almacen);
      },
      'cerrar secundario icono',
    ),
    ...contenido(almacen, modo),
  );
  if (aviso !== null) {
    caja.insertBefore(
      el(
        'p',
        { class: aviso.ok ? 'aviso' : 'mensaje-error', role: aviso.ok ? 'status' : 'alert' },
        aviso.mensaje,
      ),
      caja.children[2] ?? null,
    );
  }
  const fondo = el('div', { class: 'fondo' }, caja);
  fondo.addEventListener('click', (e) => {
    if (e.target === fondo) cerrar(almacen);
  });
  requestAnimationFrame(() => {
    caja.querySelector('input')?.focus({ preventScroll: true });
  });
  return fondo;
}
