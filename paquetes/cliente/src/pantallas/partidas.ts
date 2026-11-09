// La entrada al juego (ficha T-086 §4.2): mis partidas con lo que avisan, las convocatorias en marcha,
// convocar o unirse eligiendo casa, y elegir origen entre las tres ofertas.
import { CASAS, POTENCIALES, TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type { Casa } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import type { ClienteApi, ConvocatoriaRecibida, PartidaDeLaLista } from '../api.ts';
import { tiempoHastaElCorte } from '../bandeja.ts';
import { RITMOS, abastecimiento, esperaOrdenes, pasoDe, ritmoEnPalabras } from '../inicio.ts';
import { NOMBRE_DE_POTENCIAL } from '../nombres.ts';
import { boton, el } from './dom.ts';

type Modo = 'lista' | 'convocar' | 'unirse';

function nombreDeCasa(id: string): string {
  const casa = CASAS.find((c) => c === id);
  return casa === undefined ? id : TABLAS_DEL_JUEGO.casas[casa].nombre;
}

function nombreDePerfil(id: string): string {
  const potencial = POTENCIALES.find((p) => p === id);
  return potencial === undefined ? id : NOMBRE_DE_POTENCIAL[potencial];
}

/** Lo que la pantalla recuerda entre repintadas: el modo, lo traido y los errores de la ultima accion. */
const estado: {
  modo: Modo;
  partidas: readonly PartidaDeLaLista[] | null;
  convocatorias: readonly ConvocatoriaRecibida[] | null;
  cargando: boolean;
  error: string | null;
  casa: Casa;
} = {
  modo: 'lista',
  partidas: null,
  convocatorias: null,
  cargando: false,
  error: null,
  casa: 'hortelanos',
};

function recargar(almacen: Almacen, api: ClienteApi): void {
  if (estado.cargando) return;
  estado.cargando = true;
  void Promise.all([api.misPartidas(), api.misConvocatorias()]).then(([p, c]) => {
    estado.cargando = false;
    estado.partidas = p.ok ? p.datos.partidas : [];
    estado.convocatorias = c.ok ? c.datos.convocatorias.filter((x) => x.partida === null) : [];
    estado.error = p.ok ? null : p.mensaje;
    almacen.refrescar();
  });
}

/** Tras una accion que cambia la lista: se vuelve a traer y se ensenya el error, si lo hubo. */
function despues(almacen: Almacen, api: ClienteApi, r: { ok: boolean; mensaje?: string }): void {
  estado.error = r.ok ? null : (r.mensaje ?? 'No se pudo.');
  if (r.ok) estado.modo = 'lista';
  estado.partidas = null;
  recargar(almacen, api);
  almacen.refrescar();
}

function tarjetaDePartida(p: PartidaDeLaLista, abrir: (id: string) => void): HTMLElement {
  const pan = abastecimiento(p);
  const r = p.resumen;
  return el(
    'li',
    {},
    el(
      'div',
      { class: 'fila' },
      el('strong', {}, p.nombre),
      el('span', { class: 'etiqueta' }, nombreDeCasa(p.casa)),
    ),
    el(
      'p',
      { class: 'suave' },
      `Turno ${String(p.turno)}${r === null ? '' : ` · ${r.fecha}`} · corte: ${tiempoHastaElCorte(p.proximaResolucion, Date.now())}`,
    ),
    el(
      'p',
      { class: 'fila' },
      pan === null ? '' : el('span', { class: pan.urgente ? 'chip baja' : 'chip' }, pan.texto),
      r === null
        ? ''
        : el(
            'span',
            { class: 'chip' },
            `${String(r.prestigio)} de prestigio${r.puesto === null ? '' : ` · ${String(r.puesto)}.º de ${String(r.casas)}`}`,
          ),
      esperaOrdenes(p) ? el('span', { class: 'chip baja' }, 'Sin órdenes este turno') : '',
    ),
    boton('Abrir', () => {
      abrir(p.id);
    }),
  );
}

function tarjetaDeConvocatoria(
  almacen: Almacen,
  api: ClienteApi,
  c: ConvocatoriaRecibida,
  abrir: (id: string) => void,
): HTMLElement {
  const paso = pasoDe(c);
  const partes: (Node | string)[] = [
    el(
      'div',
      { class: 'fila' },
      el('strong', {}, c.nombre),
      el('span', { class: 'etiqueta' }, ritmoEnPalabras(c.intervaloMinutos)),
    ),
    el(
      'p',
      { class: 'suave' },
      `Casas: ${c.jugadores.map((j) => nombreDeCasa(j.casa)).join(', ')}`,
    ),
  ];
  switch (paso.tipo) {
    case 'sortear':
      partes.push(
        el(
          'p',
          {},
          `Código para invitar: `,
          el('strong', {}, paso.codigo),
          paso.faltan > 0 ? ` (quedan ${String(paso.faltan)} plazas)` : '',
        ),
        boton('Cerrar la lista y sortear los orígenes', () => {
          void api.sortear(c.id).then((r) => {
            despues(almacen, api, r);
          });
        }),
      );
      break;
    case 'esperar-jugadores':
      partes.push(
        el(
          'p',
          { class: 'suave' },
          `Esperando a que se cierre la lista (quedan ${String(paso.faltan)} plazas).`,
        ),
      );
      break;
    case 'esperar-eleccion':
      partes.push(
        el(
          'p',
          { class: 'suave' },
          `Ya elegiste. Faltan ${String(paso.faltan)} por elegir origen.`,
        ),
      );
      break;
    case 'abrir':
      partes.push(
        boton('Abrir', () => {
          abrir(paso.partida);
        }),
      );
      break;
    case 'elegir-origen': {
      partes.push(
        el('p', { class: 'consejo' }, 'Elige dónde empieza tu casa. Es para toda la partida.'),
      );
      const ofertas = el('ul', { class: 'lista' });
      for (const o of c.misOfertas) {
        ofertas.append(
          el(
            'li',
            {},
            el(
              'div',
              { class: 'fila' },
              el('strong', {}, o.nombre),
              el('span', { class: 'etiqueta' }, nombreDePerfil(o.perfil)),
            ),
            el('p', {}, el('strong', {}, 'A favor: '), o.ventaja),
            el('p', {}, el('strong', {}, 'En contra: '), o.limitacion),
            boton(
              `Empezar en ${o.nombre}`,
              () => {
                void api.elegir(c.id, o.comarca).then((r) => {
                  if (r.ok && r.datos.convocatoria.partida !== null)
                    abrir(r.datos.convocatoria.partida);
                  else despues(almacen, api, r);
                });
              },
              'secundario',
            ),
          ),
        );
      }
      partes.push(ofertas);
      break;
    }
  }
  return el('li', {}, ...partes);
}

/** La eleccion de casa: privilegio, herramienta y limite, los tres con el mismo peso. */
function eleccionDeCasa(almacen: Almacen): HTMLElement {
  const lista = el('ul', { class: 'lista casas' });
  for (const casa of CASAS) {
    const d = TABLAS_DEL_JUEGO.casas[casa];
    const elegida = casa === estado.casa;
    const tarjeta = el(
      'li',
      { class: elegida ? 'casa elegida' : 'casa' },
      el(
        'div',
        { class: 'fila' },
        el('strong', {}, d.nombre),
        elegida ? el('span', { class: 'etiqueta' }, 'elegida') : '',
      ),
      el('p', {}, el('strong', {}, 'Privilegio: '), d.privilegio),
      el('p', {}, el('strong', {}, 'Herramienta: '), d.herramienta),
      el('p', {}, el('strong', {}, 'Límite: '), d.limite),
      elegida
        ? ''
        : boton(
            `Jugar con ${d.nombre}`,
            () => {
              estado.casa = casa;
              almacen.refrescar();
            },
            'secundario',
          ),
    );
    lista.append(tarjeta);
  }
  return lista;
}

function convocar(almacen: Almacen, api: ClienteApi): HTMLElement {
  const nombre = el('input', {
    type: 'text',
    required: '',
    maxlength: '60',
    'aria-label': 'Nombre de la partida',
    placeholder: 'La partida de los jueves',
  });
  const ritmo = el('select', { 'aria-label': 'Ritmo' });
  for (const r of RITMOS) ritmo.append(el('option', { value: String(r.minutos) }, r.texto));
  ritmo.value = '1440';
  const plazas = el('input', {
    type: 'number',
    min: '1',
    max: '8',
    value: '4',
    'aria-label': 'Plazas',
  });
  const formulario = el(
    'form',
    {},
    el('label', {}, 'Nombre', nombre),
    el('label', {}, 'Ritmo', ritmo),
    el('label', {}, 'Casas que juegan (1 a 8)', plazas),
    el('h3', {}, 'Tu casa'),
    eleccionDeCasa(almacen),
    el(
      'p',
      {},
      el('button', { type: 'submit' }, 'Convocar'),
      ' ',
      boton(
        'Volver',
        () => {
          estado.modo = 'lista';
          almacen.refrescar();
        },
        'secundario',
      ),
    ),
  );
  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    void api
      .convocar({
        nombre: nombre.value,
        casa: estado.casa,
        intervaloMinutos: Number(ritmo.value),
        plazas: Number(plazas.value),
      })
      .then((r) => {
        despues(almacen, api, r);
      });
  });
  return el('section', { class: 'tarjeta' }, el('h2', {}, 'Convocar una partida'), formulario);
}

function unirse(almacen: Almacen, api: ClienteApi): HTMLElement {
  const codigo = el('input', {
    type: 'text',
    required: '',
    'aria-label': 'Código de invitación',
    autocapitalize: 'none',
  });
  const formulario = el(
    'form',
    {},
    el('label', {}, 'Código de invitación', codigo),
    el('h3', {}, 'Tu casa'),
    eleccionDeCasa(almacen),
    el(
      'p',
      {},
      el('button', { type: 'submit' }, 'Unirme'),
      ' ',
      boton(
        'Volver',
        () => {
          estado.modo = 'lista';
          almacen.refrescar();
        },
        'secundario',
      ),
    ),
  );
  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    void api.unirse(codigo.value.trim(), estado.casa).then((r) => {
      despues(almacen, api, r);
    });
  });
  return el('section', { class: 'tarjeta' }, el('h2', {}, 'Unirse a una partida'), formulario);
}

export function pantallaDePartidas(
  almacen: Almacen,
  api: ClienteApi,
  abrir: (id: string) => void,
): HTMLElement {
  if (estado.partidas === null) recargar(almacen, api);
  const partes: (Node | string)[] = [el('h1', {}, 'Mis partidas')];
  if (estado.error !== null)
    partes.push(el('p', { class: 'mensaje-error', role: 'alert' }, estado.error));
  if (estado.modo === 'convocar') return el('section', {}, ...partes, convocar(almacen, api));
  if (estado.modo === 'unirse') return el('section', {}, ...partes, unirse(almacen, api));

  const partidas = estado.partidas;
  if (partidas === null) partes.push(el('p', { class: 'suave' }, 'Cargando…'));
  else if (partidas.length === 0 && (estado.convocatorias ?? []).length === 0)
    partes.push(
      el(
        'p',
        { class: 'suave' },
        'Todavía no juegas ninguna partida: convoca una o únete con un código.',
      ),
    );
  else {
    // Primero las que esperan algo de ti.
    const orden = [...partidas].sort((a, b) => Number(esperaOrdenes(b)) - Number(esperaOrdenes(a)));
    partes.push(el('ul', { class: 'lista' }, ...orden.map((p) => tarjetaDePartida(p, abrir))));
  }
  const convocatorias = estado.convocatorias ?? [];
  if (convocatorias.length > 0) {
    partes.push(
      el('h2', {}, 'Convocatorias en marcha'),
      el(
        'ul',
        { class: 'lista' },
        ...convocatorias.map((c) => tarjetaDeConvocatoria(almacen, api, c, abrir)),
      ),
    );
  }
  partes.push(
    el(
      'p',
      { class: 'fila' },
      boton('Convocar una partida', () => {
        estado.modo = 'convocar';
        almacen.refrescar();
      }),
      boton(
        'Unirme con un código',
        () => {
          estado.modo = 'unirse';
          almacen.refrescar();
        },
        'secundario',
      ),
    ),
  );
  return el('section', {}, ...partes);
}
