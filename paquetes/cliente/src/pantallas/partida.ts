// La partida (esqueleto): turno, almacen, aviso de turno nuevo y la bandeja con su prevision. La
// ficha de comarca y la bandeja definitiva son T-082; el atlas, T-081.
import { RECURSOS } from '@conquer/nucleo';
import type { Recursos } from '@conquer/nucleo';

import type { Almacen, EstadoDelCliente } from '../almacen.ts';
import { boton, el } from './dom.ts';

function recursosEnTexto(r: Recursos): string {
  return RECURSOS.filter((x) => r[x] !== 0)
    .map((x) => `${x} ${String(r[x])}`)
    .join(' · ');
}

export function pantallaDePartida(almacen: Almacen, estado: EstadoDelCliente): HTMLElement {
  const partida = estado.partida;
  if (partida === null) return el('p', {}, 'Cargando la partida…');
  const { vista } = partida.recibido;
  const partes: (Node | string)[] = [
    el('h1', {}, `Turno ${String(vista.turno)} · ${vista.jugador.nombre}`),
  ];
  if (partida.desactualizada) {
    const hora = new Date(partida.recibidaEn).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    partes.push(el('p', { class: 'aviso' }, `Sin conexion: esto es de las ${hora}.`));
  }
  if (estado.turnoNuevo !== null) {
    partes.push(
      el(
        'p',
        { class: 'aviso' },
        `Se ha resuelto el turno ${String(estado.turnoNuevo)}. `,
        boton('Recargar', () => {
          void almacen.recargar();
        }),
      ),
    );
  }
  partes.push(el('p', {}, `Almacen: ${recursosEnTexto(vista.jugador.almacen)}`));
  const prevision = almacen.prevision();
  const bandeja = el('ul');
  for (const p of estado.pendientes) {
    const linea = prevision?.lineas.find((l) => l.idCliente === p.idCliente);
    const tipo = typeof p.intencion['tipo'] === 'string' ? p.intencion['tipo'] : '¿?';
    const coste = linea === undefined || linea.coste === null ? '' : recursosEnTexto(linea.coste);
    bandeja.append(
      el(
        'li',
        {},
        `${tipo} ${coste}`,
        linea?.cabe === false ? el('span', { class: 'error' }, ' · no alcanza') : '',
        p.error === null
          ? ' · por enviar'
          : el('span', { class: 'error' }, ` · ${p.error.mensaje}`),
        ' ',
        boton('Quitar', () => {
          almacen.quitar(p.idCliente);
        }),
      ),
    );
  }
  partes.push(
    el('h2', {}, 'Bandeja'),
    estado.pendientes.length === 0 ? el('p', {}, 'Sin ordenes por enviar.') : bandeja,
  );
  for (const e of estado.errores) partes.push(el('p', { class: 'error' }, e.mensaje));
  return el('section', {}, ...partes);
}
