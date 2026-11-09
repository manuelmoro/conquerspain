// La ficha de comarca (T-082, T-088): panel lateral en escritorio y hoja inferior en movil. Cada accion
// es una tarjeta con su coste y su duracion; al elegirla, la confirmacion se abre ahi mismo con el
// efecto previsto, o con la causa y la salida si esta bloqueada. Nada se da sin verlo antes.
import { POTENCIALES, TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type { AccionDeFicha, Casa, FichaDeComarca } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import { NOMBRE_DE_POTENCIAL, NOMBRE_DE_TERRENO } from '../nombres.ts';
import {
  ICONO_DE_EDIFICIO,
  datoDeFuero,
  datoDeLealtad,
  datoDeSolares,
  datoDeVecinos,
  nivelEnPuntos,
  notaDeNivel,
} from '../estado-de-comarca.ts';
import { textoDeGanar } from '../ganar.ts';
import { fichasDeRecursos } from './comun.ts';
import { accionAbierta, cerrarAccion, tarjetaDeAccion } from './acciones.ts';
import { boton, el } from './dom.ts';
import { planoEnFicha } from './plano.ts';

/** Si el jugador ha desplegado lo que todavia no puede hacer; se recuerda entre repintadas. */
let verBloqueadas = false;

export function pantallaDeFicha(
  almacen: Almacen,
  ficha: FichaDeComarca,
  turno: number,
  casaDelJugador: Casa,
): HTMLElement {
  const cabecera: (Node | string)[] = [
    el('h2', {}, ficha.nombre),
    boton(
      '✕',
      () => {
        cerrarAccion();
        almacen.abrirComarca(null);
      },
      'cerrar secundario icono',
    ),
  ];
  const partes: (Node | string)[] = [...cabecera];
  const dueño =
    ficha.nivel === 'propia'
      ? 'Tuya'
      : ficha.nivel === 'oida'
        ? 'Solo la conoces de oídas'
        : ficha.duenyo === null
          ? 'De nadie'
          : 'De otra casa';
  const terreno = ficha.terreno === null ? '' : ` · ${NOMBRE_DE_TERRENO[ficha.terreno]}`;
  partes.push(el('p', { class: 'suave' }, `${dueño}${terreno}`));
  if (ficha.potenciales !== null) {
    const potenciales = ficha.potenciales;
    const lista = POTENCIALES.filter((p) => potenciales[p] > 0).map((p) =>
      el('span', { class: 'chip' }, `${NOMBRE_DE_POTENCIAL[p]} ${String(potenciales[p])}`),
    );
    partes.push(el('p', { class: 'recursos' }, ...lista));
  }
  const p = ficha.propia;
  if (p !== null) {
    // Cada dato con su icono y lo que implica (T-090: «caben 60» o «Granja 3/4» no se entendian).
    const porCasas =
      TABLAS_DEL_JUEGO.poblacion.capacidadPorCasas +
      TABLAS_DEL_JUEGO.casas[casaDelJugador].modificadores.capacidadPorCasasExtra;
    const datos = [
      datoDeVecinos(p.poblacion, p.capacidad, porCasas),
      datoDeSolares(p.solares.usados, p.solares.total),
      datoDeLealtad(p.lealtad),
      datoDeFuero(p.fuero),
    ];
    partes.push(
      el(
        'ul',
        { class: 'datos-de-comarca' },
        ...datos.map((d) =>
          el(
            'li',
            { class: d.alerta ? 'alerta' : '' },
            el('span', { class: 'icono-de-dato', 'aria-hidden': 'true' }, d.icono),
            el('span', { class: 'titulo-de-dato' }, d.titulo),
            el('strong', {}, d.valor),
            el('span', { class: 'nota-de-dato' }, d.nota),
          ),
        ),
      ),
      planoEnFicha(
        ficha,
        almacen.estado.partida?.recibido.vista.jugador.capital === ficha.id,
        almacen,
        turno,
      ) ?? '',
      el('h3', {}, 'Edificios'),
      p.edificios.length === 0
        ? el('p', { class: 'suave' }, 'Ninguno todavía.')
        : el(
            'ul',
            { class: 'edificios' },
            ...p.edificios.map((e) =>
              el(
                'li',
                { title: notaDeNivel(e.nivel, e.maximo) },
                el(
                  'span',
                  { class: 'icono-de-dato', 'aria-hidden': 'true' },
                  ICONO_DE_EDIFICIO[e.tipo],
                ),
                el('span', {}, e.nombre),
                el(
                  'span',
                  { class: 'puntos', 'aria-hidden': 'true' },
                  nivelEnPuntos(e.nivel, e.maximo),
                ),
                el('span', { class: 'nota-de-dato' }, notaDeNivel(e.nivel, e.maximo)),
              ),
            ),
          ),
    );
    if (p.obras.length > 0) {
      partes.push(
        el(
          'p',
          {},
          el('strong', {}, 'En obras: '),
          p.obras
            .map(
              (o) =>
                `${o.que} (${String(Math.floor((100 * o.avanceMil) / Math.max(1, o.necesarioMil)))} %)`,
            )
            .join(', '),
        ),
      );
    }
    partes.push(
      el(
        'p',
        { class: 'fila' },
        el('strong', {}, 'Produjo el último turno:'),
        fichasDeRecursos(p.producido),
      ),
    );
    const desglose = el('details', {}, el('summary', {}, 'Por qué produce eso'));
    for (const e of p.prevision) {
      const factores = e.factores
        .map((f) => `${f.nombre} ×${(f.mil / 1000).toFixed(2)}`)
        .join(' · ');
      desglose.append(
        el(
          'p',
          { class: 'suave' },
          `${e.edificio} (nivel ${String(e.nivel)}): ${String(e.base)} de ${e.recurso} × ${factores} = ${String(e.resultado)}`,
        ),
      );
    }
    partes.push(desglose);
  }
  if (ficha.comoGanarLa !== null) {
    const t = textoDeGanar(ficha.comoGanarLa);
    const bloque = el(
      'section',
      { class: 'ganar' },
      el('h3', {}, 'Cómo ganarla'),
      el('p', {}, t.cabecera),
      el('p', {}, el('strong', {}, t.ritmo)),
    );
    // Si ya se puede, decirlo; si no, por que, sin esconderlo en «Todavia no puedes» (T-092).
    const incorporar = ficha.acciones.find((a) => a.clave === 'incorporar');
    if (incorporar !== undefined && ficha.comoGanarLa.actual >= ficha.comoGanarLa.necesaria) {
      bloque.append(
        el(
          'p',
          { class: incorporar.bloqueo === null ? 'aviso' : 'mensaje-error' },
          incorporar.bloqueo === null
            ? '✅ Ya puedes incorporarla: «Incorporar la comarca», abajo.'
            : `Aún no puedes incorporarla: ${incorporar.bloqueo.causa} ${incorporar.bloqueo.salida}`,
        ),
      );
    }
    if (t.motivos.length > 0) {
      const lista = el('ul', { class: 'suave' });
      for (const m of t.motivos) lista.append(el('li', {}, m));
      bloque.append(lista);
    }
    const mas = el('details', {}, el('summary', {}, 'Qué la haría subir más deprisa'));
    const lista = el('ul', { class: 'suave' });
    for (const a of t.aceleraria) lista.append(el('li', {}, a));
    mas.append(lista);
    bloque.append(mas);
    partes.push(bloque);
  }
  if (ficha.consejo !== null) partes.push(el('p', { class: 'consejo' }, ficha.consejo));

  // Lo que se puede hacer, arriba (derribar al final); lo bloqueado, debajo y plegado (J-01).
  const posibles = ficha.acciones
    .filter((a) => a.bloqueo === null)
    .sort(
      (a, b) =>
        Number(a.intencion['tipo'] === 'derribar') - Number(b.intencion['tipo'] === 'derribar'),
    );
  const bloqueadas = ficha.acciones.filter((a) => a.bloqueo !== null);
  const listaDe = (acciones: readonly AccionDeFicha[]): HTMLElement => {
    const lista = el('ul', { class: 'lista' });
    for (const accion of acciones) lista.append(tarjetaDeAccion(almacen, ficha.id, accion, turno));
    return lista;
  };
  partes.push(el('h3', {}, 'Qué puedes hacer'));
  if (ficha.acciones.length === 0) {
    partes.push(el('p', { class: 'suave' }, 'Aquí no puedes dar ninguna orden.'));
  } else {
    partes.push(
      posibles.length === 0
        ? el('p', { class: 'suave' }, 'Ahora mismo, nada: mira abajo qué falta.')
        : listaDe(posibles),
    );
  }
  if (bloqueadas.length > 0) {
    const plegable = el(
      'details',
      { class: 'bloqueadas' },
      el('summary', {}, `Todavía no puedes (${String(bloqueadas.length)})`),
      listaDe(bloqueadas),
    );
    const abiertaAqui = bloqueadas.some((a) => accionAbierta(ficha.id, a.clave));
    if (verBloqueadas || abiertaAqui) plegable.setAttribute('open', '');
    plegable.addEventListener('toggle', () => {
      verBloqueadas = plegable.hasAttribute('open');
    });
    partes.push(plegable);
  }
  return el(
    'section',
    { class: 'ficha tarjeta hoja', 'data-conservar-scroll': 'ficha' },
    ...partes,
  );
}
