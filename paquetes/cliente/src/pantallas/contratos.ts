// «Tus contratos» en «Tu casa» (ficha T-103): el credito de cada casa, los contratos con lo que dicen
// y su plazo, aceptar o rechazar lo que te proponen, proponer uno nuevo y fijar tus portazgos.
import {
  OBRAS_MAYORES_DE_TRAMO,
  TABLAS_DEL_JUEGO,
  TIPOS_DE_CONTRATO,
  TIPOS_DE_OBRA_MAYOR,
} from '@conquer/nucleo';
import type { VistaJugador } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import {
  CAMPOS_DE_CONTRATO,
  ESTADO_DE_CONTRATO,
  NOMBRE_DE_CONTRATO,
  PORTAZGO_MAXIMO,
  QUIEN_HACE,
  cierreDeContrato,
  contratosEnOrden,
  famaDeCredito,
  fijarPortazgo,
  frasesDeContrato,
  intencionDeContrato,
  plazoDeContrato,
  responderContrato,
  tramosPropios,
} from '../contratos.ts';
import type { FormularioDeContrato } from '../contratos.ts';
import { NOMBRE_DE_RECURSO } from '../nombres.ts';
import { boton, el } from './dom.ts';

export interface OpcionesDeContratos {
  readonly comarca: (id: string) => string;
  /** Las comarcas que se conocen, para la entrega y la obra en tierra del otro. */
  readonly comarcas: readonly { id: string; nombre: string }[];
  readonly propias: readonly { id: string; nombre: string }[];
}

/** El formulario sobrevive a las repintadas, como el del mayordomo. */
let formulario: FormularioDeContrato = {
  tipo: 'entrega',
  con: '',
  activa: 'yo',
  recurso: 'pan',
  cantidad: '',
  comarca: '',
  hacia: '',
  obra: 'puente',
  niveles: '1',
  precio: '',
  devolver: '',
  turnos: '6',
  penalizacion: '',
};

const ETIQUETA: Readonly<Partial<Record<keyof FormularioDeContrato, string>>> = {
  recurso: 'Mercancía',
  cantidad: 'Cantidad',
  comarca: 'Comarca',
  hacia: 'Hacia',
  obra: 'Obra',
  niveles: 'Niveles',
  precio: 'Precio (mrs)',
  devolver: 'Devuelve (mrs)',
};

function cambiar(almacen: Almacen, campo: keyof FormularioDeContrato, valor: string): void {
  formulario = { ...formulario, [campo]: valor };
  almacen.refrescar();
}

function selector(
  almacen: Almacen,
  campo: keyof FormularioDeContrato,
  etiqueta: string,
  opciones: readonly { id: string; nombre: string }[],
): HTMLElement {
  const s = el('select', { 'aria-label': etiqueta });
  s.append(el('option', { value: '' }, '—'));
  for (const op of opciones) {
    const opcion = el('option', { value: op.id }, op.nombre);
    if (op.id === formulario[campo]) opcion.setAttribute('selected', '');
    s.append(opcion);
  }
  s.addEventListener('change', () => {
    cambiar(almacen, campo, s.value);
  });
  return el('label', { class: 'campo-carga' }, etiqueta, s);
}

function numero(
  almacen: Almacen,
  campo: keyof FormularioDeContrato,
  etiqueta: string,
): HTMLElement {
  const i = el('input', {
    type: 'number',
    min: '0',
    step: '1',
    value: formulario[campo],
    'aria-label': etiqueta,
  });
  i.addEventListener('change', () => {
    cambiar(almacen, campo, i.value);
  });
  return el('label', { class: 'campo-carga' }, etiqueta, i);
}

/** Las comarcas de quien recibe la mercancia o la obra: las mias si soy yo, las conocidas si no. */
function comarcasDelOtroLado(o: OpcionesDeContratos): readonly { id: string; nombre: string }[] {
  const recibeYo = formulario.activa === 'ella';
  return recibeYo ? o.propias : o.comarcas;
}

function campoDe(
  almacen: Almacen,
  campo: keyof FormularioDeContrato,
  o: OpcionesDeContratos,
): HTMLElement | null {
  const etiqueta = ETIQUETA[campo] ?? campo;
  switch (campo) {
    case 'recurso':
      return selector(
        almacen,
        campo,
        etiqueta,
        Object.entries(NOMBRE_DE_RECURSO)
          .filter(([r]) => r !== 'maravedis')
          .map(([id, nombre]) => ({ id, nombre })),
      );
    case 'comarca':
      return selector(almacen, campo, etiqueta, comarcasDelOtroLado(o));
    case 'hacia': {
      const obra = TIPOS_DE_OBRA_MAYOR.find((t) => t === formulario.obra);
      if (obra === undefined || !OBRAS_MAYORES_DE_TRAMO.includes(obra)) return null;
      return selector(almacen, campo, etiqueta, o.comarcas);
    }
    case 'obra':
      return selector(
        almacen,
        campo,
        etiqueta,
        TIPOS_DE_OBRA_MAYOR.map((t) => ({
          id: t,
          nombre: TABLAS_DEL_JUEGO.obrasMayores[t].nombre,
        })),
      );
    default:
      return numero(almacen, campo, etiqueta);
  }
}

function proponer(almacen: Almacen, vista: VistaJugador, o: OpcionesDeContratos): HTMLElement[] {
  const otras = vista.casas.filter((c) => c.id !== vista.jugador.id);
  if (otras.length === 0) {
    return [el('p', { class: 'suave' }, 'No hay otras casas en la partida con quien tratar.')];
  }
  const tipo = el('select', { 'aria-label': 'Tipo de contrato' });
  for (const t of TIPOS_DE_CONTRATO) {
    const op = el('option', { value: t }, NOMBRE_DE_CONTRATO[t]);
    if (t === formulario.tipo) op.setAttribute('selected', '');
    tipo.append(op);
  }
  tipo.addEventListener('change', () => {
    const elegido = TIPOS_DE_CONTRATO.find((t) => t === tipo.value);
    if (elegido !== undefined) cambiar(almacen, 'tipo', elegido);
  });
  const quien = el(
    'div',
    { class: 'conmutador', role: 'group', 'aria-label': QUIEN_HACE[formulario.tipo] },
    ...(['yo', 'ella'] as const).map((lado) => {
      const b = boton(
        lado === 'yo' ? 'Tu casa' : 'La otra casa',
        () => {
          cambiar(almacen, 'activa', lado);
        },
        lado === formulario.activa ? '' : 'secundario',
      );
      b.setAttribute('aria-pressed', lado === formulario.activa ? 'true' : 'false');
      return b;
    }),
  );
  const intencion = intencionDeContrato(formulario, vista.turno);
  const dar = boton('Proponer el contrato', () => {
    if (intencion === null) return;
    void almacen.anyadir(intencion);
  });
  if (intencion === null) dar.setAttribute('disabled', '');
  const campos = CAMPOS_DE_CONTRATO[formulario.tipo]
    .map((c) => campoDe(almacen, c, o))
    .filter((c): c is HTMLElement => c !== null);
  return [
    el('h3', {}, 'Proponer un contrato'),
    el(
      'p',
      { class: 'fila' },
      selector(
        almacen,
        'con',
        'Con',
        otras.map((c) => ({ id: c.id, nombre: `${c.nombre} (crédito ${String(c.credito)})` })),
      ),
      el('label', { class: 'campo-carga' }, 'Contrato', tipo),
    ),
    el('p', {}, QUIEN_HACE[formulario.tipo], quien),
    el('p', { class: 'fila' }, ...campos),
    el(
      'p',
      { class: 'fila' },
      numero(almacen, 'turnos', 'Plazo (turnos)'),
      numero(almacen, 'penalizacion', 'Penalización (mrs)'),
    ),
    el(
      'p',
      { class: 'consejo' },
      'Lo comprueba el motor al firmar: si falta dinero, material o permiso, no se firma. Quien falle al plazo paga la penalización y pierde crédito.',
    ),
    el('p', {}, dar),
  ];
}

function lista(almacen: Almacen, vista: VistaJugador, o: OpcionesDeContratos): HTMLElement {
  const yo = vista.jugador.id;
  const jugador = (id: string): string =>
    vista.casas.find((c) => c.id === id)?.nombre ?? 'otra casa';
  const n = { comarca: o.comarca, jugador };
  const contratos = contratosEnOrden(vista);
  if (contratos.length === 0) {
    return el('p', { class: 'suave' }, 'Ningún contrato por ahora. Propón uno abajo.');
  }
  const ul = el('ul', { class: 'lista' });
  for (const contrato of contratos) {
    const espera = contrato.estado === 'propuesto';
    const otra = contrato.propone === yo ? contrato.recibe : contrato.propone;
    const acciones: (HTMLElement | string)[] = [];
    if (espera && contrato.recibe === yo) {
      acciones.push(
        boton('Aceptar y firmar', () => {
          void almacen.anyadir(responderContrato(contrato.id, true));
        }),
        boton(
          'Rechazar',
          () => {
            void almacen.anyadir(responderContrato(contrato.id, false));
          },
          'secundario',
        ),
      );
    } else if (espera) {
      acciones.push(el('p', { class: 'suave' }, `Esperando la respuesta de ${jugador(otra)}.`));
    }
    ul.append(
      el(
        'li',
        {},
        el(
          'strong',
          {},
          `${NOMBRE_DE_CONTRATO[contrato.tipo]} con ${jugador(otra)} · ${ESTADO_DE_CONTRATO[contrato.estado]}`,
        ),
        el('p', {}, frasesDeContrato(contrato, yo, n)),
        el(
          'p',
          { class: 'suave' },
          contrato.estado === 'vigente' || espera
            ? plazoDeContrato(contrato, vista.turno)
            : cierreDeContrato(contrato, yo, jugador),
        ),
        ...acciones,
      ),
    );
  }
  return ul;
}

function portazgos(almacen: Almacen, vista: VistaJugador, o: OpcionesDeContratos): HTMLElement[] {
  const tramos = tramosPropios(vista);
  if (tramos.length === 0) return [];
  const ul = el('ul', { class: 'lista' });
  for (const t of tramos) {
    const i = el('input', {
      type: 'number',
      min: '0',
      max: String(PORTAZGO_MAXIMO),
      step: '1',
      value: String(t.portazgo),
      'aria-label': `Portazgo entre ${o.comarca(t.desde)} y ${o.comarca(t.hasta)}`,
    });
    ul.append(
      el(
        'li',
        {},
        el('strong', {}, `${o.comarca(t.desde)} – ${o.comarca(t.hasta)}`),
        el(
          'p',
          { class: 'suave' },
          t.portazgo > 0 ? `Cobras ${String(t.portazgo)} maravedís por paso.` : 'No cobras nada.',
        ),
        el('label', { class: 'campo-carga' }, 'Maravedís por paso', i),
        boton(
          'Fijar',
          () => {
            const cantidad = Math.max(0, Math.min(PORTAZGO_MAXIMO, Math.floor(Number(i.value))));
            void almacen.anyadir(fijarPortazgo(t.desde, t.hasta, cantidad));
          },
          'secundario',
        ),
      ),
    );
  }
  return [
    el('h3', {}, 'Tus portazgos'),
    el(
      'p',
      { class: 'consejo' },
      `Cobras a las recuas y rebaños de otras casas al entrar en los tramos que mejoraste (de 0 a ${String(PORTAZGO_MAXIMO)}). Quien no pueda pagar irá por el camino viejo, más despacio.`,
    ),
    ul,
  ];
}

export function seccionDeContratos(
  almacen: Almacen,
  vista: VistaJugador,
  o: OpcionesDeContratos,
): (Node | string)[] {
  const yo = vista.jugador;
  const casas = vista.casas.filter((c) => c.id !== yo.id);
  return [
    el('h3', {}, 'Tus contratos'),
    el(
      'p',
      {},
      el('strong', {}, `Tu crédito: ${String(yo.credito)}`),
      ` — ${famaDeCredito(yo.credito)}. Sube al cumplir y baja mucho al fallar; las demás casas lo ven.`,
    ),
    casas.length === 0
      ? ''
      : el(
          'p',
          { class: 'suave' },
          casas
            .map((c) => `${c.nombre}: ${String(c.credito)} (${famaDeCredito(c.credito)})`)
            .join(' · '),
        ),
    lista(almacen, vista, o),
    ...proponer(almacen, vista, o),
    ...portazgos(almacen, vista, o),
  ];
}
