// La cronica y la clasificacion en el panel (ficha T-085 §4.3): el archivo de turnos con ← → y saltos
// por anyo, avisos primero y con su accion; y la clasificacion con el desglose de cada casa y tus hitos.
import { CAPITULOS_DE_PRESTIGIO } from '@conquer/nucleo';
import type { CapituloDePrestigio, ClasificacionPublica, Cronica } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import { anyoDe, anyosDelArchivo, moverTurno, ultimoResuelto } from '../archivo.ts';
import { boton, el } from './dom.ts';
import { seccionesDeCronica } from './entradas.ts';

const NOMBRE_DE_CAPITULO: Readonly<Record<CapituloDePrestigio, string>> = {
  poblacion: 'población',
  territorio: 'territorio',
  obras: 'obras',
  caminos: 'caminos',
  comercio: 'comercio',
  exploracion: 'exploración',
  ganaderia: 'ganadería',
  industria: 'industria',
  hitos: 'hitos',
};

function pestanyas(
  almacen: Almacen,
  vista: 'cronica' | 'clasificacion',
  turno: number,
): HTMLElement {
  const b = (texto: string, esta: 'cronica' | 'clasificacion'): HTMLButtonElement => {
    const boton_ = boton(
      texto,
      () => {
        almacen.abrirCronica(turno, esta);
      },
      esta === vista ? '' : 'secundario',
    );
    boton_.setAttribute('aria-pressed', esta === vista ? 'true' : 'false');
    return boton_;
  };
  return el(
    'nav',
    { class: 'modos' },
    b('Crónica', 'cronica'),
    b('Clasificación', 'clasificacion'),
  );
}

function archivo(
  almacen: Almacen,
  cronica: Cronica | null,
  turno: number,
  turnoQueSeJuega: number,
  turnosPorAnyo: number,
  nombre: (id: string) => string,
  corte: string,
): (Node | string)[] {
  const ultimo = ultimoResuelto(turnoQueSeJuega);
  // El primer turno aun no tiene cronica: se dice por que y cuando llega (T-090).
  if (ultimo === 0)
    return [
      el(
        'div',
        { class: 'tarjeta vacia' },
        el('p', { class: 'icono-grande', 'aria-hidden': 'true' }, '📜'),
        el('h3', {}, 'Aún no hay crónica'),
        el(
          'p',
          {},
          `Estás en el primer turno. La crónica cuenta lo que pasó en cada turno resuelto, y la primera llegará cuando se resuelva este (${corte}).`,
        ),
        el(
          'p',
          { class: 'suave' },
          'Mientras tanto, da tus primeras órdenes: toca tu capital en el mapa.',
        ),
      ),
    ];
  const ir = (paso: number): HTMLButtonElement => {
    const destino = moverTurno(turno, paso, ultimo);
    const b = boton(
      paso < 0 ? '← Anterior' : 'Siguiente →',
      () => {
        almacen.abrirCronica(destino);
      },
      'secundario',
    );
    if (destino === turno) b.setAttribute('disabled', '');
    return b;
  };
  const anyo = el('select', { 'aria-label': 'Año' });
  for (const a of anyosDelArchivo(ultimo, turnosPorAnyo)) {
    const opcion = el('option', { value: String(a.turno) }, `Año ${String(a.anyo)}`);
    if (a.anyo === anyoDe(turno, turnosPorAnyo)) opcion.setAttribute('selected', '');
    anyo.append(opcion);
  }
  anyo.addEventListener('change', () => {
    almacen.abrirCronica(Number(anyo.value));
  });
  const partes: (Node | string)[] = [
    el('p', { class: 'fila' }, ir(-1), anyo, ir(1)),
    el(
      'h3',
      {},
      cronica === null ? `Turno ${String(turno)}` : `Turno ${String(turno)} · ${cronica.fecha}`,
    ),
  ];
  if (cronica === null) partes.push(el('p', { class: 'suave' }, 'Cargando la crónica…'));
  else partes.push(...seccionesDeCronica(almacen, [cronica], nombre, () => undefined));
  return partes;
}

function clasificacion(c: ClasificacionPublica | null): (Node | string)[] {
  if (c === null) return [el('p', { class: 'suave' }, 'Cargando la clasificación…')];
  const lista = el('ol', { class: 'lista clasificacion' });
  for (const f of c.filas) {
    const cambio =
      f.puestoAnterior === null || f.puestoAnterior === f.puesto
        ? ''
        : f.puestoAnterior > f.puesto
          ? ' ↑ sube'
          : ' ↓ baja';
    const maximo = Math.max(1, ...CAPITULOS_DE_PRESTIGIO.map((k) => f.capitulos[k]));
    const desglose = el('details', {}, el('summary', {}, 'Por qué'));
    for (const k of CAPITULOS_DE_PRESTIGIO) {
      if (f.capitulos[k] === 0) continue;
      desglose.append(
        el(
          'p',
          { class: 'fila barra-de-capitulo' },
          el('span', {}, NOMBRE_DE_CAPITULO[k]),
          el('span', {
            class: 'barra',
            style: `--ancho: ${String(Math.round((100 * f.capitulos[k]) / maximo))}%`,
          }),
          el('strong', {}, String(f.capitulos[k])),
        ),
      );
    }
    if (f.penalizaciones > 0)
      desglose.append(
        el(
          'p',
          { class: 'suave' },
          `Menos ${String(f.penalizaciones)} de penalizaciones (comarcas perdidas y hambre).`,
        ),
      );
    if (f.primicias.length > 0)
      desglose.append(
        el(
          'p',
          { class: 'suave' },
          `Primero de la partida en ${String(f.primicias.length)} hito${f.primicias.length === 1 ? '' : 's'}.`,
        ),
      );
    lista.append(
      el(
        'li',
        {},
        el(
          'div',
          { class: 'fila' },
          el('strong', {}, `${String(f.puesto)}.º ${f.nombre}`),
          el('span', {}, `${String(f.prestigio)} de prestigio${cambio}`),
        ),
        desglose,
      ),
    );
  }
  const hitos = el('ul', { class: 'lista' });
  for (const h of c.misHitos) {
    hitos.append(
      el(
        'li',
        {},
        el(
          'div',
          { class: 'fila' },
          el('strong', {}, h.nombre),
          el('span', { class: 'etiqueta' }, h.fecha),
        ),
        el(
          'p',
          { class: 'suave' },
          `+${String(h.prestigio)} de prestigio${h.primicia ? ', y el primero de la partida' : ''}.`,
        ),
      ),
    );
  }
  const faltan = el('ul', { class: 'lista suave' });
  for (const h of c.porLograr)
    faltan.append(el('li', {}, `${h.nombre}: ${h.condicion} (+${String(h.prestigio)})`));
  return [
    lista,
    el('h3', {}, 'Tus hitos'),
    c.misHitos.length === 0 ? el('p', { class: 'suave' }, 'Ninguno todavía.') : hitos,
    el(
      'details',
      {},
      el('summary', {}, `Los que te quedan (${String(c.porLograr.length)})`),
      faltan,
    ),
  ];
}

export function pantallaDeCronica(
  almacen: Almacen,
  abierta: { readonly turno: number; readonly vista: 'cronica' | 'clasificacion' },
  datos: { cronica: Cronica | null; clasificacion: ClasificacionPublica | null },
  turnoQueSeJuega: number,
  turnosPorAnyo: number,
  nombre: (id: string) => string,
  /** Lo que falta para el corte, en palabras: «faltan 5 h». */
  corte: string,
): HTMLElement {
  return el(
    'section',
    { class: 'ficha tarjeta hoja', 'data-conservar-scroll': 'cronica' },
    el('h2', {}, abierta.vista === 'cronica' ? 'Crónica' : 'Clasificación'),
    boton(
      '✕',
      () => {
        almacen.cerrarCronica();
      },
      'cerrar secundario icono',
    ),
    pestanyas(almacen, abierta.vista, abierta.turno),
    ...(abierta.vista === 'cronica'
      ? archivo(
          almacen,
          datos.cronica,
          abierta.turno,
          turnoQueSeJuega,
          turnosPorAnyo,
          nombre,
          corte,
        )
      : clasificacion(datos.clasificacion)),
  );
}
