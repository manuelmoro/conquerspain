// La portada sin sesion (T-063, T-090, T-091): arriba el menu con «Entrar» y «Crear cuenta», y la
// portada que explica el juego. Los formularios de cuenta van en su dialogo (`cuenta.ts`).
import type { Almacen, EstadoDelCliente } from '../almacen.ts';
import type { ClienteApi } from '../api.ts';
import { tarjetaDeInvitacion } from './invitacion.ts';
import { barraDeCuenta, abrirCuenta, dialogoDeCuenta } from './cuenta.ts';
import { boton, el } from './dom.ts';
import { portada } from './portada.ts';

export function pantallaDeEntrada(
  almacen: Almacen,
  api: ClienteApi,
  estado: EstadoDelCliente,
): HTMLElement {
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
  // Llega por un enlace de invitacion (T-125): se le dice a que, y que al entrar le llevamos.
  const codigo = almacen.invitacionPendiente();
  const invitacion =
    codigo === null
      ? []
      : [
          tarjetaDeInvitacion(
            api,
            codigo,
            () => {
              almacen.refrescar();
            },
            el(
              'p',
              { class: 'suave' },
              'Crea tu cuenta o entra con la tuya: en cuanto estés dentro te llevamos a la partida para elegir tu casa.',
            ),
          ),
        ];
  return el(
    'div',
    {},
    barraDeCuenta(almacen, estado),
    ...invitacion,
    portada(llamada),
    ...(dialogo === null ? [] : [dialogo]),
  );
}
