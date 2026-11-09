// El plano de una comarca propia (ficha T-092): cada solar es una parcela, y se ve que la ocupa y por
// que. Cada nivel de cada edificio ocupa una, cada obra de edificio la suya, y el resto quedan libres.
// Puro: la pantalla solo dibuja lo que esto decide.
import { PARA_QUE_SIRVE, TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type { AccionDeFicha, DetalleDePropia, Recurso, TipoEdificio } from '@conquer/nucleo';

import { NOMBRE_DE_RECURSO } from './nombres.ts';

export type Parcela =
  | {
      readonly clase: 'edificio';
      readonly edificio: TipoEdificio;
      readonly nombre: string;
      /** Que nivel de ese edificio es esta parcela (1..nivel). */
      readonly orden: number;
      readonly nivel: number;
      readonly maximo: number;
      /** Has pedido derribar este nivel (T-092): se pinta tachado. */
      readonly derribo: boolean;
    }
  | {
      /** Lo pedido que aun no ha empezado, en el solar libre donde ira (T-092). */
      readonly clase: 'pedida';
      readonly edificio: TipoEdificio;
      readonly nombre: string;
      /** El motivo por el que espera, ya en palabras; null si empieza al resolverse el turno. */
      readonly espera: string | null;
    }
  | {
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

/**
 * Las parcelas de la comarca: primero las casas, despues los edificios en su orden, las obras, lo
 * pedido (en los solares libres que queden) y lo libre. Un derribo pedido tacha el ultimo nivel.
 */
export function parcelasDe(
  propia: DetalleDePropia,
  pedidas: readonly ObraPedida[] = [],
): readonly Parcela[] {
  const derribos = new Map<TipoEdificio, number>();
  for (const p of pedidas)
    if (p.tipo === 'derribar') derribos.set(p.edificio, (derribos.get(p.edificio) ?? 0) + 1);
  const edificios = [...propia.edificios].sort(
    (a, b) => Number(b.tipo === 'casas') - Number(a.tipo === 'casas'),
  );
  const parcelas: Parcela[] = [];
  for (const e of edificios) {
    for (let orden = 1; orden <= e.nivel; orden += 1) {
      parcelas.push({
        clase: 'edificio',
        edificio: e.tipo,
        nombre: e.nombre,
        orden,
        nivel: e.nivel,
        maximo: e.maximo,
        derribo: orden > e.nivel - (derribos.get(e.tipo) ?? 0),
      });
    }
  }
  for (const o of propia.obras) {
    if (o.edificio === null) continue;
    parcelas.push({
      clase: 'obra',
      edificio: o.edificio,
      nombre: o.que,
      avance: Math.min(100, Math.floor((100 * o.avanceMil) / Math.max(1, o.necesarioMil))),
    });
  }
  for (const p of pedidas) {
    if (p.tipo !== 'construir' || parcelas.length >= propia.solares.total) continue;
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
        'Aquí cabe un edificio nuevo o un nivel más de uno que ya tienes.',
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
    parcela.nivel === 1
      ? `Nivel 1 de ${String(parcela.maximo)}: ocupa este solar.`
      : `Nivel ${String(parcela.nivel)} de ${String(parcela.maximo)}: cada nivel ocupa un solar, y este es el ${String(parcela.orden)}.º de ${String(parcela.nivel)}.`,
  ];
  if (produce.length > 0)
    lineas.push(
      `Cada turno: ${parcela.nivel === 1 ? 'da' : 'entre sus niveles da'} ${produce.join(' y ')}.`,
    );
  const consumo = Object.entries(TABLAS_DEL_JUEGO.edificios[parcela.edificio].consumo)
    .filter((par): par is [Recurso, number] => par[1] > 0)
    .map(([r, n]) => `${String(n * parcela.nivel)} de ${NOMBRE_DE_RECURSO[r]}`);
  if (consumo.length > 0) lineas.push(`Gasta ${consumo.join(' y ')} por turno; sin eso, se para.`);
  if (parcela.derribo)
    lineas.push('Has pedido derribar este nivel: el solar quedará libre y te devuelven la mitad.');
  return { titulo: parcela.nombre, lineas };
}

/**
 * Lo que se puede hacer desde una parcela: en un edificio, ampliarlo o derribar un nivel (lo bloqueado
 * tambien, para ver por que); en un solar libre, lo que se puede levantar ya; en una obra, nada.
 */
export function accionesDeParcela(
  parcela: Parcela,
  acciones: readonly AccionDeFicha[],
): readonly AccionDeFicha[] {
  if (parcela.clase === 'obra' || parcela.clase === 'pedida') return [];
  if (parcela.clase === 'edificio') {
    const propias = [`construir-${parcela.edificio}`, `derribar-${parcela.edificio}`];
    return acciones.filter((a) => propias.includes(a.clave));
  }
  return acciones.filter((a) => a.clave.startsWith('construir-') && a.bloqueo === null);
}
