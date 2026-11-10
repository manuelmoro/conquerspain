// Una recua en palabras (ficha T-093): dónde está, adónde va, qué hace, qué lleva y qué órdenes la
// esperan. Puro: la tarjeta del panel solo pinta estas líneas.
import { RECURSOS } from '@conquer/nucleo';
import type { Orden, Recua } from '@conquer/nucleo';

import { NOMBRE_DE_RECURSO } from './nombres.ts';

export interface LineaDeRecua {
  readonly icono: string;
  readonly texto: string;
}

const ENCARGO: Readonly<Record<NonNullable<Recua['cometido']>, string>> = {
  explorar: 'explorar lo que encuentra',
  portear: 'llevar carga de un sitio a otro',
  tratar: 'comprar y vender en las plazas donde para',
  poblar: 'fundar una puebla',
  presencia: 'estar presente para ganar influencia',
  emisario: 'reunir un informe del dominio de su dueño',
  disolver: 'disolverse al llegar',
};

export function lineasDeRecua(
  r: Recua,
  ordenes: readonly Orden[],
  nombre: (id: string) => string,
): readonly LineaDeRecua[] {
  const lineas: LineaDeRecua[] = [];
  lineas.push(
    r.situacion.donde === 'comarca'
      ? { icono: '📍', texto: `Está en ${nombre(r.situacion.comarca)}.` }
      : {
          icono: '🚶',
          texto: `De camino: de ${nombre(r.situacion.desde)} a ${nombre(r.situacion.hasta)}.`,
        },
  );
  lineas.push(
    r.ruta.length === 0
      ? { icono: '⏸️', texto: 'Quieta: no tiene ruta. Dale una para que se mueva.' }
      : {
          icono: '➡️',
          texto: `Ruta: ${r.ruta.map(nombre).join(' → ')}${r.rutaCircular ? ', y vuelta a empezar' : ''}.`,
        },
  );
  lineas.push(
    r.cometido === null
      ? { icono: '🎯', texto: 'Sin encargo.' }
      : { icono: '🎯', texto: `Encargo: ${ENCARGO[r.cometido]}.` },
  );
  const mercancia = RECURSOS.filter((k) => k !== 'maravedis' && r.carga[k] > 0).map(
    (k) => `${String(r.carga[k])} de ${NOMBRE_DE_RECURSO[k]}`,
  );
  const dinero =
    r.carga.maravedis > 0 ? ` y ${String(r.carga.maravedis)} maravedís para pagar` : '';
  lineas.push({
    icono: '📦',
    texto:
      mercancia.length === 0
        ? `Va sin mercancía${dinero} (le caben ${String(r.porte)}).`
        : `Lleva ${mercancia.join(', ')}${dinero} (le caben ${String(r.porte)}).`,
  });
  const esperan = ordenes.filter(
    (o) => 'recua' in o && o.recua === r.id && o.estado !== 'en curso',
  ).length;
  if (esperan > 0)
    lineas.push({
      icono: '⏳',
      texto:
        esperan === 1
          ? 'Una orden suya espera: mira «Esperando» en tus órdenes.'
          : `${String(esperan)} órdenes suyas esperan: mira «Esperando» en tus órdenes.`,
    });
  return lineas;
}
