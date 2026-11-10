// «Tu casa» en el panel (ficha T-089 §4.3): la tradicion de cada ronda abierta, el mayordomo con sus
// reglas en castellano y su formulario, y la sal de las conservas.
import {
  ACCIONES_DE_MAYORDOMO,
  CARGAS_FISCALES,
  CONDICIONES_DE_MAYORDOMO,
  ESTACIONES,
  RECURSOS_DE_MERCADO,
  TABLAS_DEL_JUEGO,
} from '@conquer/nucleo';
import type { AccionDeMayordomo, CondicionDeMayordomo, VistaJugador } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import type { ModoDeAviso } from '../api.ts';
import {
  CAMPOS_DE_ACCION,
  CAMPOS_DE_CONDICION,
  NOMBRE_DE_ACCION,
  NOMBRE_DE_CONDICION,
  NOMBRE_DE_RONDA,
  altaDeRegla,
  bajaDeRegla,
  componerAccion,
  componerCondicion,
  conservarConSal,
  describirRegla,
  elegirTradicion,
  limiteDelMayordomo,
  rondasPorElegir,
} from '../casa.ts';
import type { Campo, Nombres } from '../casa.ts';
import { NOMBRE_DE_RECURSO } from '../nombres.ts';
import { seccionDeContratos } from './contratos.ts';
import { boton, el } from './dom.ts';

/** El estado del formulario del mayordomo: sobrevive a las repintadas. */
const formulario: {
  condicion: CondicionDeMayordomo['tipo'];
  accion: AccionDeMayordomo['tipo'];
  valores: Partial<Record<string, string>>;
} = { condicion: 'pan-disponible-menor-que', accion: 'mercado', valores: {} };

const CAMPOS: readonly Campo[] = [
  'cantidad',
  'recurso',
  'plaza',
  'precio',
  'comarca',
  'estacion',
  'recua',
  'rebanyo',
  'operacion',
  'carga',
];

const ETIQUETA: Readonly<Record<Campo, string>> = {
  cantidad: 'Cantidad',
  recurso: 'Recurso',
  plaza: 'Plaza',
  precio: 'Precio (mrs)',
  comarca: 'Comarca',
  estacion: 'Estación',
  recua: 'Recua',
  rebanyo: 'Rebaño',
  operacion: 'Qué',
  carga: 'Carga',
};

export interface Opciones {
  readonly plazas: readonly { id: string; nombre: string }[];
  readonly comarcas: readonly { id: string; nombre: string }[];
  readonly propias: readonly { id: string; nombre: string }[];
  /** Como llegan los avisos por correo; null si aun no se sabe (T-066). */
  readonly avisos: ModoDeAviso | null;
  readonly cambiarAvisos: (modo: ModoDeAviso) => void;
}

const MODOS_DE_AVISO: readonly { readonly modo: ModoDeAviso; readonly texto: string }[] = [
  { modo: 'cada-turno', texto: 'Cada turno' },
  { modo: 'diario', texto: 'Uno al día' },
  { modo: 'nada', texto: 'Ninguno' },
];

/** Los avisos por correo: cada turno, uno al dia o ninguno (T-064; aqui se cambian desde T-066). */
function avisosPorCorreo(o: Opciones): HTMLElement {
  return el(
    'section',
    {},
    el('h3', {}, 'Avisos por correo'),
    el(
      'p',
      { class: 'suave' },
      'Te escribimos cuando se resuelve el turno, con lo que pide tu atención. Elige cuántos quieres recibir.',
    ),
    o.avisos === null
      ? el('p', { class: 'suave' }, 'Cargando…')
      : el(
          'div',
          { class: 'conmutador', role: 'group', 'aria-label': 'Avisos por correo' },
          ...MODOS_DE_AVISO.map(({ modo, texto }) => {
            const b = boton(
              texto,
              () => {
                o.cambiarAvisos(modo);
              },
              modo === o.avisos ? '' : 'secundario',
            );
            b.setAttribute('aria-pressed', modo === o.avisos ? 'true' : 'false');
            return b;
          }),
        ),
  );
}

function campo(
  almacen: Almacen,
  lado: 'c' | 'a',
  c: Campo,
  vista: VistaJugador,
  o: Opciones,
): HTMLElement {
  const clave = `${lado}.${c}`;
  const valor = formulario.valores[clave] ?? '';
  const guardar = (v: string): void => {
    formulario.valores[clave] = v;
    almacen.refrescar();
  };
  const elegir = (opciones: readonly { id: string; nombre: string }[]): HTMLElement => {
    const s = el('select', { 'aria-label': ETIQUETA[c] });
    s.append(el('option', { value: '' }, '—'));
    for (const op of opciones) {
      const opcion = el('option', { value: op.id }, op.nombre);
      if (op.id === valor) opcion.setAttribute('selected', '');
      s.append(opcion);
    }
    s.addEventListener('change', () => {
      guardar(s.value);
    });
    return s;
  };
  let entrada: HTMLElement;
  switch (c) {
    case 'cantidad':
    case 'precio': {
      const i = el('input', {
        type: 'number',
        min: '0',
        step: c === 'precio' ? '0.1' : '1',
        value: valor,
        'aria-label': ETIQUETA[c],
      });
      i.addEventListener('change', () => {
        guardar(i.value);
      });
      entrada = i;
      break;
    }
    case 'recurso':
      entrada = elegir(RECURSOS_DE_MERCADO.map((r) => ({ id: r, nombre: NOMBRE_DE_RECURSO[r] })));
      break;
    case 'plaza':
      entrada = elegir(o.plazas);
      break;
    case 'comarca':
      entrada = elegir(
        lado === 'a' && formulario.accion === 'carga-fiscal'
          ? o.propias
          : lado === 'c'
            ? o.propias
            : o.comarcas,
      );
      break;
    case 'estacion':
      entrada = elegir(ESTACIONES.map((e) => ({ id: e, nombre: e === 'otonyo' ? 'otoño' : e })));
      break;
    case 'recua':
      entrada = elegir(vista.recuas.map((r) => ({ id: r.id, nombre: r.nombre })));
      break;
    case 'rebanyo':
      entrada = elegir(vista.rebanyos.map((r) => ({ id: r.id, nombre: r.nombre })));
      break;
    case 'operacion':
      entrada = elegir([
        { id: 'comprar', nombre: 'comprar' },
        { id: 'vender', nombre: 'vender' },
      ]);
      break;
    case 'carga':
      entrada = elegir(CARGAS_FISCALES.map((x) => ({ id: x, nombre: x })));
      break;
  }
  return el('label', { class: 'campo-carga' }, ETIQUETA[c], entrada);
}

function valoresDe(lado: 'c' | 'a'): Partial<Record<Campo, string>> {
  const fuera: Partial<Record<Campo, string>> = {};
  for (const [k, v] of Object.entries(formulario.valores)) {
    const [l, nombre] = k.split('.');
    const c = CAMPOS.find((x) => x === nombre);
    if (l === lado && c !== undefined && v !== undefined) fuera[c] = v;
  }
  return fuera;
}

function mayordomo(
  almacen: Almacen,
  vista: VistaJugador,
  n: Nombres,
  o: Opciones,
): (Node | string)[] {
  const limite = limiteDelMayordomo(vista, TABLAS_DEL_JUEGO);
  const reglas = [...vista.jugador.mayordomo].sort((a, b) => a.prioridad - b.prioridad);
  const lista = el('ol', { class: 'lista' });
  reglas.forEach((r, i) => {
    lista.append(
      el(
        'li',
        { class: i < limite ? '' : 'plaza vieja' },
        el('p', {}, describirRegla(r, n)),
        i < limite ? '' : el('p', { class: 'suave' }, 'Fuera del límite: no la atiende.'),
        boton(
          'Quitar',
          () => {
            void almacen.anyadir(bajaDeRegla(r.prioridad));
          },
          'secundario icono',
        ),
      ),
    );
  });
  const condicion = el('select', { 'aria-label': 'Condición' });
  for (const t of CONDICIONES_DE_MAYORDOMO) {
    const op = el('option', { value: t }, NOMBRE_DE_CONDICION[t]);
    if (t === formulario.condicion) op.setAttribute('selected', '');
    condicion.append(op);
  }
  condicion.addEventListener('change', () => {
    formulario.condicion =
      CONDICIONES_DE_MAYORDOMO.find((t) => t === condicion.value) ?? formulario.condicion;
    almacen.refrescar();
  });
  const accion = el('select', { 'aria-label': 'Acción' });
  for (const t of ACCIONES_DE_MAYORDOMO) {
    const op = el('option', { value: t }, NOMBRE_DE_ACCION[t]);
    if (t === formulario.accion) op.setAttribute('selected', '');
    accion.append(op);
  }
  accion.addEventListener('change', () => {
    formulario.accion = ACCIONES_DE_MAYORDOMO.find((t) => t === accion.value) ?? formulario.accion;
    almacen.refrescar();
  });
  const c = componerCondicion(formulario.condicion, valoresDe('c'));
  const a = componerAccion(formulario.accion, valoresDe('a'));
  const dar = boton('Dar la regla', () => {
    if (c === null || a === null) return;
    formulario.valores = {};
    void almacen.anyadir(altaDeRegla(vista.jugador.mayordomo, c, a));
  });
  if (c === null || a === null) dar.setAttribute('disabled', '');
  return [
    el('h3', {}, 'El mayordomo'),
    el(
      'p',
      { class: 'consejo' },
      `Hace por ti lo que le dejes dicho mientras no estás. Atiende ${String(limite)} reglas (una más por cada nivel de mercado en tu capital, hasta 6), en este orden.`,
    ),
    reglas.length === 0 ? el('p', { class: 'suave' }, 'No le has dejado ninguna regla.') : lista,
    el('h3', {}, 'Una regla nueva'),
    el(
      'p',
      { class: 'fila' },
      condicion,
      ...CAMPOS_DE_CONDICION[formulario.condicion].map((x) => campo(almacen, 'c', x, vista, o)),
    ),
    el(
      'p',
      { class: 'fila' },
      accion,
      ...CAMPOS_DE_ACCION[formulario.accion].map((x) => campo(almacen, 'a', x, vista, o)),
    ),
    c !== null && a !== null
      ? el('p', { class: 'suave' }, describirRegla({ prioridad: 0, condicion: c, accion: a }, n))
      : el('p', { class: 'suave' }, 'Completa los campos para ver la regla.'),
    el('p', {}, dar),
  ];
}

export function pantallaDeCasa(
  almacen: Almacen,
  vista: VistaJugador,
  n: Nombres,
  o: Opciones,
): HTMLElement {
  const partes: (Node | string)[] = [
    el('h2', {}, 'Tu casa'),
    boton(
      '✕',
      () => {
        almacen.cerrarCasa();
      },
      'cerrar secundario icono',
    ),
  ];
  const rondas = rondasPorElegir(vista, TABLAS_DEL_JUEGO);
  partes.push(el('h3', {}, 'Tradiciones'));
  if (rondas.length === 0) {
    partes.push(
      el(
        'p',
        { class: 'suave' },
        'Ninguna ronda por elegir. Se abre una nueva al lograr ciertos hitos.',
      ),
    );
  }
  for (const { ronda, cartas } of rondas) {
    const lista = el('ul', { class: 'lista' });
    for (const carta of cartas) {
      lista.append(
        el(
          'li',
          {},
          el('strong', {}, carta.nombre),
          el('p', {}, carta.descripcion),
          el('p', { class: 'suave' }, carta.nota),
          boton(
            `Elegir «${carta.nombre}» para siempre`,
            () => {
              void almacen.anyadir(elegirTradicion(carta.id));
            },
            'secundario',
          ),
        ),
      );
    }
    partes.push(
      el(
        'p',
        { class: 'consejo' },
        `Ronda de ${NOMBRE_DE_RONDA[ronda]}: elige una carta. No se cambia después.`,
      ),
      lista,
    );
  }
  const elegidas = vista.jugador.tradiciones.map(
    (id) => TABLAS_DEL_JUEGO.tradiciones[id]?.nombre ?? 'Tradición',
  );
  if (elegidas.length > 0)
    partes.push(el('p', {}, el('strong', {}, 'Ya elegidas: '), elegidas.join(', ')));

  partes.push(
    ...seccionDeContratos(almacen, vista, {
      comarca: n.comarca,
      comarcas: o.comarcas,
      propias: o.propias,
    }),
  );
  partes.push(...mayordomo(almacen, vista, n, o));

  const sal = vista.jugador.conservarConSal;
  partes.push(
    el('h3', {}, 'Conservas'),
    el(
      'p',
      {},
      sal
        ? 'Gastas sal en conservar el pan del almacén: se pierde menos.'
        : 'No gastas sal en conservar el pan: el almacén merma a su paso.',
    ),
    boton(
      sal ? 'Dejar de gastar sal en conservas' : 'Gastar sal en conservar el pan',
      () => {
        void almacen.anyadir(conservarConSal(vista.jugador.capital, !sal));
      },
      'secundario',
    ),
  );
  partes.push(avisosPorCorreo(o));
  return el('section', { class: 'ficha tarjeta hoja', 'data-conservar-scroll': 'casa' }, ...partes);
}
