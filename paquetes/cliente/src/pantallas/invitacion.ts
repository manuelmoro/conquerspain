// Invitar con un enlace (ficha T-125 §2.3): la tarjeta que ve quien abre el enlace (con o sin cuenta)
// y el dialogo con el que quien convoco reparte el enlace desde la partida.
import type { ClienteApi, InvitacionRecibida } from '../api.ts';
import { codigoLegible, enlaceDeInvitacion, textoDeInvitacion } from '../invitacion.ts';
import { boton, el } from './dom.ts';

/** Lo traido por codigo: la invitacion, el mensaje de error o null mientras llega. */
const traidas = new Map<string, InvitacionRecibida | string | null>();

/** La invitacion de ese codigo; la pide una vez y repinta al llegar. */
export function invitacionDe(
  api: ClienteApi,
  codigo: string,
  repintar: () => void,
): InvitacionRecibida | string | null {
  if (!traidas.has(codigo)) {
    traidas.set(codigo, null);
    void api.invitacion(codigo).then((r) => {
      traidas.set(codigo, r.ok ? r.datos.invitacion : r.mensaje);
      repintar();
    });
  }
  return traidas.get(codigo) ?? null;
}

/** La tarjeta de la invitacion: a que partida, de quien, en que punto y que casas hay. */
export function tarjetaDeInvitacion(
  api: ClienteApi,
  codigo: string,
  repintar: () => void,
  ...extra: (Node | string)[]
): HTMLElement {
  const v = invitacionDe(api, codigo, repintar);
  if (v === null) return el('aside', { class: 'invitacion tarjeta' }, el('p', {}, 'Cargando…'));
  if (typeof v === 'string') {
    return el('aside', { class: 'invitacion tarjeta', role: 'alert' }, el('p', {}, v), ...extra);
  }
  const t = textoDeInvitacion(v);
  return el(
    'aside',
    { class: 'invitacion tarjeta' },
    el('p', { class: 'antetitulo' }, '✉ Invitación'),
    el('h2', {}, t.titulo),
    el('p', {}, t.detalle),
    ...extra,
  );
}

/** Lo que la pantalla recuerda del dialogo de invitar: si se ha copiado el enlace. */
let copiado = false;

/** El dialogo de invitar (T-125): el enlace para copiar o compartir, y el codigo por si acaso. */
export function dialogoDeInvitar(
  nombreDeLaPartida: string,
  codigo: string,
  cerrar: () => void,
  repintar: () => void,
): HTMLElement {
  const enlace = enlaceDeInvitacion(location.origin, codigo);
  const campo = el('input', {
    type: 'text',
    readonly: '',
    value: enlace,
    'aria-label': 'Enlace de invitación',
    class: 'enlace-de-invitacion',
  });
  campo.addEventListener('focus', () => {
    campo.select();
  });
  const copiar = boton(copiado ? '✓ Copiado' : 'Copiar el enlace', () => {
    void navigator.clipboard.writeText(enlace).then(
      () => {
        copiado = true;
        repintar();
      },
      () => {
        // Sin permiso para el portapapeles: se deja seleccionado para copiarlo a mano.
        campo.focus();
      },
    );
  });
  const acciones: (Node | string)[] = [copiar];
  if (typeof navigator.share === 'function') {
    acciones.push(
      boton(
        'Compartir…',
        () => {
          void navigator
            .share({
              title: `ConquerSpain · ${nombreDeLaPartida}`,
              text: `Únete a mi partida de ConquerSpain, «${nombreDeLaPartida}»:`,
              url: enlace,
            })
            .catch(() => undefined);
        },
        'secundario',
      ),
    );
  }
  const salir = (): void => {
    copiado = false;
    cerrar();
  };
  const fondo = el(
    'div',
    { class: 'fondo' },
    el(
      'div',
      { class: 'dialogo', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Invitar' },
      boton('✕', salir, 'cerrar secundario icono'),
      el('h2', {}, '✉ Invitar a la partida'),
      el(
        'p',
        {},
        'Manda este enlace a quien quieras. Al abrirlo verá a qué partida le invitas; crea su cuenta (o entra), elige su casa y una comarca libre lejos de los demás, y juega desde el turno siguiente con veinte turnos de amparo.',
      ),
      campo,
      el('p', { class: 'fila' }, ...acciones),
      el(
        'p',
        { class: 'suave' },
        'También puede escribir el código a mano en «Unirme con un código»: ',
        el('strong', { class: 'codigo' }, codigoLegible(codigo)),
      ),
    ),
  );
  fondo.addEventListener('click', (e) => {
    if (e.target === fondo) salir();
  });
  return fondo;
}
