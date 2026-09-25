// Mis partidas (esqueleto; la pantalla definitiva es T-086).
import type { ClienteApi } from '../api.ts';
import { boton, el } from './dom.ts';

export function pantallaDePartidas(api: ClienteApi, abrir: (id: string) => void): HTMLElement {
  const lista = el('ul', {}, el('li', {}, 'Cargando…'));
  void api.misPartidas().then((r) => {
    lista.replaceChildren();
    if (!r.ok) {
      lista.append(el('li', { class: 'error' }, r.mensaje));
      return;
    }
    if (r.datos.partidas.length === 0)
      lista.append(el('li', {}, 'Todavia no juegas ninguna partida.'));
    for (const p of r.datos.partidas) {
      lista.append(
        el(
          'li',
          {},
          `${p.nombre} · ${p.casa} · turno ${String(p.turno)} `,
          boton('Abrir', () => {
            abrir(p.id);
          }),
        ),
      );
    }
  });
  return el('section', {}, el('h1', {}, 'Mis partidas'), lista);
}
