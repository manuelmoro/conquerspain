// Rumores (docs/02-diseno-nucleo.md §2.6; ficha T-044 §4.3).
//
// Un rumor es un dato fechado que llega sin haber ido a buscarlo: de las ferias, del Camino de
// Santiago o de una venta propia. Puede ser impreciso —las cifras van redondeadas a dos cifras
// significativas, asi que nunca se apartan mas de un 5 % de la verdad— pero nunca es falso: el
// juego no miente al jugador. Todo sale de la semilla de la partida, con el ambito `rumor`.
import type { EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { Recurso, Recursos } from '../tipos/recursos.ts';
import { recursosSegun } from '../tipos/recursos.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { azarDe } from '../utiles/azar.ts';
import { multiplicarFactores } from '../utiles/enteros.ts';
import { comparar } from '../utiles/orden.ts';
import type { Plaza } from './plazas.ts';

/**
 * Una cifra de oidas: redondeada a dos cifras significativas, con el medio hacia arriba. El error
 * relativo nunca pasa del 5 %.
 */
export function redondearDeOido(valor: number): number {
  if (valor < 100) return valor;
  let paso = 1;
  while (valor / paso >= 100) paso *= 10;
  return Math.floor((valor + paso / 2) / paso) * paso;
}

export const VIAS_DE_RUMOR = ['feria', 'camino', 'venta'] as const;
export type ViaDeRumor = (typeof VIAS_DE_RUMOR)[number];

export type Rumor =
  | { readonly tipo: 'precios'; readonly plaza: Plaza; readonly via: ViaDeRumor }
  | { readonly tipo: 'comarca'; readonly comarca: IdComarca; readonly via: ViaDeRumor };

/** Donde esta quieta cada recua del jugador al acabar el turno, sin repetir comarca. */
export function comarcasConRecua(estado: EstadoPartida, jugador: EstadoJugador): IdComarca[] {
  const donde = new Set<IdComarca>();
  for (const recua of Object.values(estado.recuas)) {
    if (recua.jugador === jugador.id && recua.situacion.donde === 'comarca') {
      donde.add(recua.situacion.comarca);
    }
  }
  return [...donde].sort(comparar);
}

/**
 * Por donde le llegan rumores al jugador este turno, una entrada por rumor: primero las ferias
 * donde tiene recua, despues el Camino y despues las ventas, hasta el maximo.
 */
export function viasDeRumor(
  estado: EstadoPartida,
  mundo: Mundo,
  jugador: EstadoJugador,
  abiertas: readonly Plaza[],
  corresponsales: boolean,
  reglas: TablasDeReglas,
): ViaDeRumor[] {
  const t = reglas.rumores;
  const presentes = comarcasConRecua(estado, jugador);
  const vias: ViaDeRumor[] = [];
  const repetir = (via: ViaDeRumor, veces: number): void => {
    for (let i = 0; i < veces; i += 1) vias.push(via);
  };
  for (const plaza of abiertas) {
    if (plaza.tipo === 'feria' && presentes.includes(plaza.comarca)) {
      repetir('feria', t.porFeria[plaza.volumen]);
    }
  }
  for (const comarca of presentes) {
    if (mundo.comarcas[comarca]?.rasgos.includes('camino-de-santiago') === true) {
      repetir('camino', t.porCaminoDeSantiago);
    }
  }
  for (const id of Object.keys(estado.comarcas).sort(comparar)) {
    const comarca = estado.comarcas[id];
    if (comarca?.duenyo === jugador.id && (comarca.edificios['venta'] ?? 0) > 0) {
      repetir('venta', t.porVenta);
    }
  }
  // Los corresponsales multiplican lo que se oye por las mismas vias, sin cambiar su orden.
  const total = corresponsales
    ? multiplicarFactores(vias.length, [t.corresponsalesMil])
    : vias.length;
  const todas = Array.from(
    { length: total },
    (_, i) => vias[Math.floor((i * vias.length) / total)],
  );
  return todas.filter((via) => via !== undefined).slice(0, t.maximoPorTurno);
}

/**
 * Que se oye: por cada via, un rumor de precios de una plaza abierta donde el jugador no esta o de
 * una comarca que todavia no conoce, vecina de alguna que si. Sin repetir, y todo de la semilla.
 */
export function sortearRumores(
  estado: EstadoPartida,
  mundo: Mundo,
  jugador: EstadoJugador,
  abiertas: readonly Plaza[],
  vias: readonly ViaDeRumor[],
  turno: number,
  reglas: TablasDeReglas,
): Rumor[] {
  const presentes = new Set(comarcasConRecua(estado, jugador));
  let plazas = abiertas.filter(
    (p) => !presentes.has(p.comarca) && estado.mercados[p.id] !== undefined,
  );
  const conocidas = Object.entries(jugador.conocimiento)
    .filter(([, c]) => c.nivel !== 'desconocida')
    .map(([id]) => id);
  const porConocer = new Set<IdComarca>();
  for (const id of conocidas) {
    for (const vecina of mundo.vecinos[id] ?? []) {
      const nivel = jugador.conocimiento[vecina]?.nivel ?? 'desconocida';
      if (nivel === 'desconocida') porConocer.add(vecina);
    }
  }
  let comarcas = [...porConocer].sort(comparar);

  const azar = azarDe(estado.semilla, turno, 'rumor', jugador.id);
  const rumores: Rumor[] = [];
  for (const via of vias) {
    const dePrecios = azar.milesimas(0, 999) < reglas.rumores.dePreciosMil;
    if ((dePrecios || comarcas.length === 0) && plazas.length > 0) {
      const plaza = azar.elegir(plazas);
      plazas = plazas.filter((p) => p.id !== plaza.id);
      rumores.push({ tipo: 'precios', plaza, via });
    } else if (comarcas.length > 0) {
      const comarca = azar.elegir(comarcas);
      comarcas = comarcas.filter((c) => c !== comarca);
      rumores.push({ tipo: 'comarca', comarca, via });
    }
  }
  return rumores;
}

/** Los precios de una plaza tal como llegan de oidas. */
export function preciosDeOido(preciosMil: Readonly<Record<Recurso, number>>): Recursos {
  return recursosSegun((recurso) => redondearDeOido(preciosMil[recurso]));
}
