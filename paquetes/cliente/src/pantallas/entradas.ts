// Las entradas de una cronica, por secciones y con avisos primero (T-085 §4.3): cada una con «Qué
// hacer», «Darle ruta» y «Ver comarca». Lo comparten el resumen del turno y el archivo de cronicas.
import { SECCIONES_DE_CRONICA } from '@conquer/nucleo';
import type { Cronica, SeccionDeCronica } from '@conquer/nucleo';

import type { Almacen } from '../almacen.ts';
import { queHacer } from '../nombres.ts';
import { boton, el } from './dom.ts';

export const TITULO_DE_SECCION: Readonly<Record<SeccionDeCronica, string>> = {
  avisos: 'Lo que pide tu atención',
  sucesos: 'Lo que ha pasado',
  economia: 'Cuentas',
  rumores: 'Rumores',
  hitos: 'Hitos',
};

/** Una seccion por cada una que tenga entradas, en el orden de lectura; `alSalir` cierra lo que haya. */
export function seccionesDeCronica(
  almacen: Almacen,
  cronicas: readonly Cronica[],
  nombreDeComarca: (id: string) => string,
  alSalir: () => void,
): HTMLElement[] {
  const secciones: HTMLElement[] = [];
  for (const seccion of SECCIONES_DE_CRONICA) {
    const entradas = cronicas.flatMap((c) => c.entradas.filter((e) => e.seccion === seccion));
    if (entradas.length === 0) continue;
    const lista = el('ul', { class: `lista seccion-${seccion}` });
    for (const entrada of entradas) {
      const item = el('li', {}, entrada.texto);
      const sugerida = queHacer(entrada.accionSugerida);
      if (sugerida !== null) {
        const cuando = sugerida.llega === null ? '' : ` (desde aquí todavía no: ${sugerida.llega})`;
        item.append(el('p', { class: 'suave' }, `Qué hacer: ${sugerida.texto}${cuando}`));
      }
      const unidad = entrada.unidad;
      if (unidad !== null && entrada.accionSugerida === 'ruta') {
        item.append(
          boton(
            unidad.clase === 'rebanyo' ? 'Darle ruta al rebaño' : 'Darle ruta a la recua',
            () => {
              alSalir();
              almacen.abrirEditor(unidad);
            },
            'secundario icono',
          ),
        );
      }
      const comarca = entrada.comarca;
      if (comarca !== null) {
        item.append(
          boton(
            `Ver ${nombreDeComarca(comarca)}`,
            () => {
              alSalir();
              almacen.abrirComarca(comarca);
            },
            'secundario icono',
          ),
        );
      }
      lista.append(item);
    }
    secciones.push(el('section', {}, el('h3', {}, TITULO_DE_SECCION[seccion]), lista));
  }
  return secciones;
}
