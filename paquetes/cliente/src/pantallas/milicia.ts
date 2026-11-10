// «Milicia y hostilidad» en «Tu casa» (ficha T-120): las mesnadas con su coste, marchar y licenciar,
// la leva, y la hostilidad con cada casa, que avisa con un turno.
import type { VistaJugador } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import {
  fraseDeHostilidad,
  fraseDeMesnada,
  hostilidad,
  hostilidadCon,
  levaMaxima,
  levar,
  licenciar,
  marchar,
} from '../milicia.ts';
import { boton, el } from './dom.ts';

export interface OpcionesDeMilicia {
  readonly comarca: (id: string) => string;
  readonly comarcas: readonly { id: string; nombre: string }[];
  readonly propias: readonly { id: string; nombre: string }[];
}

/** Lo que se ha elegido en los formularios, para que sobreviva a las repintadas. */
const elegido: { comarca: string; hombres: string; destino: Record<string, string> } = {
  comarca: '',
  hombres: '',
  destino: {},
};

function selector(
  etiqueta: string,
  opciones: readonly { id: string; nombre: string }[],
  valor: string,
  cambiar: (v: string) => void,
): HTMLElement {
  const s = el('select', { 'aria-label': etiqueta });
  s.append(el('option', { value: '' }, '—'));
  for (const o of opciones) {
    const op = el('option', { value: o.id }, o.nombre);
    if (o.id === valor) op.setAttribute('selected', '');
    s.append(op);
  }
  s.addEventListener('change', () => {
    cambiar(s.value);
  });
  return el('label', { class: 'campo-carga' }, etiqueta, s);
}

function mesnadas(almacen: Almacen, vista: VistaJugador, o: OpcionesDeMilicia): HTMLElement {
  if (vista.mesnadas.length === 0) {
    return el('p', { class: 'suave' }, 'No tienes milicia levada.');
  }
  const ul = el('ul', { class: 'lista' });
  for (const m of vista.mesnadas) {
    const destino = elegido.destino[m.id] ?? '';
    const ir = boton('Marchar', () => {
      if (destino !== '') void almacen.anyadir(marchar(m.id, destino));
    });
    if (destino === '' || m.situacion.donde !== 'comarca') ir.setAttribute('disabled', '');
    ul.append(
      el(
        'li',
        {},
        el('strong', {}, `🛡️ ${m.nombre}`),
        el('p', {}, fraseDeMesnada(m, o.comarca)),
        el(
          'p',
          { class: 'fila' },
          selector('Hacia', o.comarcas, destino, (v) => {
            elegido.destino[m.id] = v;
            almacen.refrescar();
          }),
          ir,
          boton(
            'Licenciar',
            () => {
              void almacen.anyadir(licenciar(m.id));
            },
            'secundario',
          ),
        ),
      ),
    );
  }
  return ul;
}

function leva(almacen: Almacen, vista: VistaJugador, o: OpcionesDeMilicia): HTMLElement[] {
  const poblacion =
    elegido.comarca === ''
      ? 0
      : (() => {
          const v = vista.comarcas[elegido.comarca];
          return v?.nivel === 'propia' ? v.comarca.poblacion : 0;
        })();
  const maximo = levaMaxima(poblacion);
  const hombres = el('input', {
    type: 'number',
    min: '1',
    max: String(maximo),
    value: elegido.hombres,
    'aria-label': 'Hombres',
  });
  hombres.addEventListener('change', () => {
    elegido.hombres = hombres.value;
    almacen.refrescar();
  });
  const cuantos = Number(elegido.hombres);
  const dar = boton('Levar', () => {
    void almacen.anyadir(levar(elegido.comarca, cuantos));
    elegido.hombres = '';
  });
  if (elegido.comarca === '' || !Number.isInteger(cuantos) || cuantos < 1 || cuantos > maximo)
    dar.setAttribute('disabled', '');
  return [
    el('h4', {}, 'Levar milicia'),
    el(
      'p',
      { class: 'consejo' },
      'Los hombres dejan de trabajar mientras estén en armas, comen pan y cobran soldada, que sube cuanto más tiempo pasen lejos de casa. Nunca mueren: vuelven a su comarca al licenciarlos, al desertar o al perder.',
    ),
    el(
      'p',
      { class: 'fila' },
      selector('Comarca', o.propias, elegido.comarca, (v) => {
        elegido.comarca = v;
        almacen.refrescar();
      }),
      el('label', { class: 'campo-carga' }, `Hombres (hasta ${String(maximo)})`, hombres),
      dar,
    ),
  ];
}

function hostilidades(almacen: Almacen, vista: VistaJugador): HTMLElement[] {
  const yo = vista.jugador.id;
  const jugador = (id: string): string => vista.casas.find((c) => c.id === id)?.nombre ?? id;
  const ul = el('ul', { class: 'lista' });
  for (const casa of vista.casas.filter((c) => c.id !== yo)) {
    const h = hostilidadCon(vista, casa.id);
    const amparada = casa.amparoHasta !== null && casa.amparoHasta >= vista.turno;
    const accion =
      h === undefined
        ? amparada
          ? el('span', { class: 'suave' }, 'Amparada: no se le puede declarar.')
          : boton(
              'Declarar la hostilidad',
              () => {
                void almacen.anyadir(hostilidad(casa.id, true));
              },
              'secundario',
            )
        : h.de === yo
          ? boton(
              'Retirar la hostilidad',
              () => {
                void almacen.anyadir(hostilidad(casa.id, false));
              },
              'secundario',
            )
          : el('span', { class: 'suave' }, 'Te la declaró: solo ella puede retirarla.');
    ul.append(
      el(
        'li',
        {},
        el('strong', {}, casa.nombre),
        el('p', {}, h === undefined ? 'En paz.' : fraseDeHostilidad(h, yo, vista.turno, jugador)),
        accion,
      ),
    );
  }
  return [
    el('h4', {}, 'Hostilidad'),
    el(
      'p',
      { class: 'consejo' },
      'Declararla se anuncia a todos y vale desde el turno siguiente. Con ella, vuestras milicias pueden entrar en tierra de la otra y enfrentarse; perder solo cuesta la posición.',
    ),
    ul,
  ];
}

export function seccionDeMilicia(
  almacen: Almacen,
  vista: VistaJugador,
  o: OpcionesDeMilicia,
): (Node | string)[] {
  return [
    el('h3', {}, 'Milicia y hostilidad'),
    mesnadas(almacen, vista, o),
    ...leva(almacen, vista, o),
    ...(vista.casas.length > 1 ? hostilidades(almacen, vista) : []),
  ];
}
