// La portada sin sesion (T-063, T-090, T-091): arriba el menu con «Entrar» y «Crear cuenta», y la
// portada que explica el juego. Los formularios de cuenta van en su dialogo (`cuenta.ts`).
import type { Almacen, EstadoDelCliente } from '../almacen.ts';
import { barraDeCuenta, abrirCuenta, dialogoDeCuenta } from './cuenta.ts';
import { boton, el } from './dom.ts';
import { portada } from './portada.ts';

export function pantallaDeEntrada(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  const errores = estado.errores.map((e) =>
    el('p', { class: 'mensaje-error', role: 'alert' }, e.mensaje),
  );
  const llamada = el(
    'div',
    { class: 'llamada' },
    ...errores,
    el(
      'p',
      { class: 'fila' },
      boton('Crear cuenta y jugar', () => {
        abrirCuenta(almacen, 'crear');
      }),
      boton(
        'Ya tengo cuenta',
        () => {
          abrirCuenta(almacen, 'entrar');
        },
        'secundario',
      ),
    ),
  );
  const dialogo = dialogoDeCuenta(almacen);
  return el(
    'div',
    {},
    barraDeCuenta(almacen, estado),
    portada(llamada),
    ...(dialogo === null ? [] : [dialogo]),
  );
}
