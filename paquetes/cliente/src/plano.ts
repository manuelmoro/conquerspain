// El plano de una comarca propia (fichas T-092 y T-094): cada solar es una parcela, y se ve que la
// ocupa y por que. Cada edificio distinto ocupa una, con su nivel a la vista; un edificio nuevo en
// obras, la suya; el resto quedan libres. Puro: la pantalla solo dibuja lo que esto decide.
import { PARA_QUE_SIRVE, TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type { AccionDeFicha, DetalleDePropia, Recurso, TipoEdificio } from '@conquer/nucleo';

import { NOMBRE_DE_RECURSO } from './nombres.ts';

export type Parcela =
  | {
      readonly clase: 'edificio';
      readonly edificio: TipoEdificio;
      readonly nombre: string;
      readonly nivel: number;
      readonly maximo: number;
      /** Su ampliacion en obras, con su avance en %; null si no se amplia (T-094). */
      readonly ampliando: number | null;
      /** Has pedido ampliarlo y aun no ha empezado (T-094). */
      readonly ampliacionPedida: boolean;
      /** Has pedido derribar un nivel (T-092): se pinta tachado. */
      readonly derribo: boolean;
    }
  | {
      /** Un edificio nuevo pedido que aun no ha empezado, en el solar libre donde ira (T-092). */
      readonly clase: 'pedida';
      readonly edificio: TipoEdificio;
      readonly nombre: string;
      /** El motivo por el que espera, ya en palabras; null si empieza al resolverse el turno. */
      readonly espera: string | null;
    }
  | {
      /** Un edificio nuevo en obras: ya ocupa su solar. */
      readonly clase: 'obra';
      readonly edificio: TipoEdificio;
      readonly nombre: string;
      readonly avance: number;
    }
  | { readonly clase: 'libre' };

/** Una orden de construir o derribar en esta comarca que aun no ha empezado. */
export interface ObraPedida {
  readonly tipo: 'construir' | 'derribar';
  readonly edificio: TipoEdificio;
  readonly espera: string | null;
}

function porcentaje(avanceMil: number, necesarioMil: number): number {
  return Math.min(100, Math.floor((100 * avanceMil) / Math.max(1, necesarioMil)));
}

/**
 * Las parcelas de la comarca (T-094): una por edificio distinto, sea cual sea su nivel —ampliar no
 * gasta solar—, primero las casas; despues los edificios nuevos en obras, los nuevos pedidos (en los
 * solares libres que queden) y lo libre. Una ampliacion o un derribo se marcan en su parcela.
 */
export function parcelasDe(
  propia: DetalleDePropia,
  pedidas: readonly ObraPedida[] = [],
): readonly Parcela[] {
  const presentes = new Set(propia.edificios.map((e) => e.tipo));
  const edificios = [...propia.edificios].sort(
    (a, b) => Number(b.tipo === 'casas') - Number(a.tipo === 'casas'),
  );
  const parcelas: Parcela[] = edificios.map((e) => {
    const obra = propia.obras.find((o) => o.edificio === e.tipo);
    return {
      clase: 'edificio',
      edificio: e.tipo,
      nombre: e.nombre,
      nivel: e.nivel,
      maximo: e.maximo,
      ampliando: obra === undefined ? null : porcentaje(obra.avanceMil, obra.necesarioMil),
      ampliacionPedida: pedidas.some((p) => p.tipo === 'construir' && p.edificio === e.tipo),
      derribo: pedidas.some((p) => p.tipo === 'derribar' && p.edificio === e.tipo),
    };
  });
  const enObra = new Set<TipoEdificio>();
  for (const o of propia.obras) {
    if (o.edificio === null || presentes.has(o.edificio) || enObra.has(o.edificio)) continue;
    enObra.add(o.edificio);
    parcelas.push({
      clase: 'obra',
      edificio: o.edificio,
      nombre: o.que,
      avance: porcentaje(o.avanceMil, o.necesarioMil),
    });
  }
  const pedidosNuevos = new Set<TipoEdificio>();
  for (const p of pedidas) {
    if (p.tipo !== 'construir' || presentes.has(p.edificio) || enObra.has(p.edificio)) continue;
    if (pedidosNuevos.has(p.edificio) || parcelas.length >= propia.solares.total) continue;
    pedidosNuevos.add(p.edificio);
    parcelas.push({
      clase: 'pedida',
      edificio: p.edificio,
      nombre: TABLAS_DEL_JUEGO.edificios[p.edificio].nombre,
      espera: p.espera,
    });
  }
  while (parcelas.length < propia.solares.total) parcelas.push({ clase: 'libre' });
  return parcelas;
}

/** Una celda del plano en perspectiva: columna y fila de la rejilla. */
export interface Celda {
  readonly columna: number;
  readonly fila: number;
}

export const COLUMNAS_DEL_PLANO = 3;

/**
 * Donde va cada parcela y donde la plaza del pueblo: la plaza en el centro de una rejilla de tres
 * columnas, y las parcelas alrededor, por filas. Con ocho o menos, el pueblo queda rodeado.
 */
export function rejillaDelPlano(parcelas: number): {
  readonly plaza: Celda;
  readonly parcelas: readonly Celda[];
} {
  const plaza: Celda = { columna: 1, fila: 1 };
  const celdas: Celda[] = [];
  for (let i = 0; celdas.length < parcelas; i += 1) {
    const celda = { columna: i % COLUMNAS_DEL_PLANO, fila: Math.floor(i / COLUMNAS_DEL_PLANO) };
    if (celda.columna !== plaza.columna || celda.fila !== plaza.fila) celdas.push(celda);
  }
  return { plaza, parcelas: celdas };
}

/** Lo que se dice de una parcela al tocarla: que hay, por que ocupa el solar y que da. */
export function explicarParcela(
  parcela: Parcela,
  propia: DetalleDePropia,
): { readonly titulo: string; readonly lineas: readonly string[] } {
  if (parcela.clase === 'libre') {
    return {
      titulo: 'Solar libre',
      lineas: [
        'Aquí cabe un edificio nuevo. Para ampliar uno que ya tienes no hace falta solar: tócalo.',
        'Debajo tienes lo que puedes levantar ya, con lo que cuesta y lo que da cada turno.',
      ],
    };
  }
  if (parcela.clase === 'pedida') {
    return {
      titulo: `${parcela.nombre}: pedida`,
      lineas: [
        parcela.espera === null
          ? 'La has pedido: empezará al resolverse el turno, si hay con qué pagarla.'
          : `La has pedido, pero espera: ${parcela.espera}.`,
        'Irá en este solar. Si te arrepientes, la puedes retirar o anular en «Tus órdenes».',
      ],
    };
  }
  if (parcela.clase === 'obra') {
    return {
      titulo: `${parcela.nombre} en obras (${String(parcela.avance)} %)`,
      lineas: ['Una obra ya ocupa su solar mientras se levanta.', PARA_QUE_SIRVE[parcela.edificio]],
    };
  }
  const produce = propia.prevision
    .filter((p) => p.edificio === parcela.edificio && p.resultado !== 0)
    .map((p) => `${String(p.resultado)} de ${NOMBRE_DE_RECURSO[p.recurso]}`);
  const lineas = [
    PARA_QUE_SIRVE[parcela.edificio],
    parcela.nivel < parcela.maximo
      ? `Nivel ${String(parcela.nivel)} de ${String(parcela.maximo)}. Ampliarlo no ocupa otro solar, pero cada nivel pide sus brazos: sin gente, todo rinde menos.`
      : `Nivel ${String(parcela.nivel)} de ${String(parcela.maximo)}: al máximo.`,
  ];
  if (produce.length > 0) lineas.push(`Cada turno da ${produce.join(' y ')}.`);
  const consumo = Object.entries(TABLAS_DEL_JUEGO.edificios[parcela.edificio].consumo)
    .filter((par): par is [Recurso, number] => par[1] > 0)
    .map(([r, n]) => `${String(n * parcela.nivel)} de ${NOMBRE_DE_RECURSO[r]}`);
  if (consumo.length > 0) lineas.push(`Gasta ${consumo.join(' y ')} por turno; sin eso, se para.`);
  if (parcela.ampliando !== null)
    lineas.push(`Se está ampliando: va por el ${String(parcela.ampliando)} %.`);
  else if (parcela.ampliacionPedida)
    lineas.push('Has pedido ampliarlo: empezará al resolverse el turno, si hay con qué pagarlo.');
  if (parcela.derribo)
    lineas.push(
      parcela.nivel === 1
        ? 'Has pedido derribarlo: el solar quedará libre y te devuelven la mitad.'
        : 'Has pedido derribar un nivel: te devuelven la mitad de lo que costó.',
    );
  return { titulo: parcela.nombre, lineas };
}

/**
 * Lo que se puede hacer desde una parcela: en un edificio, ampliarlo o derribar un nivel (lo bloqueado
 * tambien, para ver por que); en un solar libre, lo que se puede levantar ya; en una obra, nada.
 */
export function accionesDeParcela(
  parcela: Parcela,
  acciones: readonly AccionDeFicha[],
  /** Los edificios que ya tiene: en un solar libre solo va uno nuevo (T-094). */
  presentes: readonly TipoEdificio[] = [],
): readonly AccionDeFicha[] {
  if (parcela.clase === 'obra' || parcela.clase === 'pedida') return [];
  if (parcela.clase === 'edificio') {
    const propias = [`construir-${parcela.edificio}`, `derribar-${parcela.edificio}`];
    return acciones.filter((a) => propias.includes(a.clave));
  }
  const ya = new Set(presentes.map((t) => `construir-${t}`));
  return acciones.filter(
    (a) => a.clave.startsWith('construir-') && a.bloqueo === null && !ya.has(a.clave),
  );
}

/** El rango de la comarca y lo que le falta para el siguiente (T-094): crece solo, con su gente. */
export function textoDeRango(poblacion: number): string {
  const o = TABLAS_DEL_JUEGO.obras;
  if (poblacion >= o.vecinosDeCiudad)
    return `Ciudad de ${String(poblacion)} vecinos: el rango más alto, con ${String(o.solaresDeCiudad)} solares de más.`;
  if (poblacion >= o.vecinosDeVilla)
    return `Villa de ${String(poblacion)} vecinos: a los ${String(o.vecinosDeCiudad)} será ciudad y tendrá ${String(o.solaresDeCiudad - o.solaresDeVilla)} solar más.`;
  return `Aldea de ${String(poblacion)} vecinos: a los ${String(o.vecinosDeVilla)} será villa y ganará ${String(o.solaresDeVilla)} solar. Para que crezca hacen falta casas y pan.`;
}
