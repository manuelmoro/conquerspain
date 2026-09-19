// Comprar donde sobra y vender donde falta: la rutina de las recuas de los mercaderes y de los
// arrieros. Solo usa los precios que el jugador sabe, con su fecha; si no sabe ninguno que merezca
// la pena, va a enterarse a la plaza conocida mas cercana.
import { RECURSOS } from '@conquer/nucleo';
import type { IdComarca, IdMercado, Recua, Recurso } from '@conquer/nucleo';

import type { Decision, Rutina } from './impulsos.ts';
import { panDeViaje, volverACasa } from './impulsos.ts';
import { parada } from './pedidos.ts';
import type { PlazaConocida } from './tablero.ts';
import { Tablero } from './tablero.ts';

/** Maravedis que se lleva la recua para comprar, como mucho. */
const BOLSA_MAXIMA = 200;
/** Ganancia minima que justifica el viaje, en maravedis. */
const GANANCIA_MINIMA = 8;
/** Un precio sabido hace mas de esto ya no sirve para decidir. */
const PRECIO_CADUCA_EN = 24;

interface Negocio {
  readonly compra: PlazaConocida;
  readonly venta: PlazaConocida;
  readonly recurso: Recurso;
  readonly cantidad: number;
  readonly precioCompraMil: number;
  readonly precioVentaMil: number;
  readonly ganancia: number;
  readonly jornadas: number;
}

const COMERCIABLES = RECURSOS.filter((r) => r !== 'maravedis');

function precioSabido(t: Tablero, plaza: IdMercado, recurso: Recurso): number | null {
  const sabido = t.yo.plazas[plaza];
  if (sabido === undefined || t.turno - sabido.turno > PRECIO_CADUCA_EN) return null;
  return sabido.preciosMil[recurso];
}

/** El mejor negocio que la recua puede hacer con lo que sabe y lo que carga. */
function mejorNegocio(t: Tablero, recua: Recua, bolsa: number): Negocio | null {
  const fuera = t.jornadasDesdeLoPropio();
  const plazas = t.plazasConocidas().filter((p) => fuera.has(p.comarca));
  let mejor: Negocio | null = null;
  for (const compra of plazas) {
    for (const venta of plazas) {
      if (venta.id === compra.id) continue;
      // Lo que se anda fuera de lo propio, que es lo que se come de la carga.
      const jornadas = Math.max(fuera.get(compra.comarca) ?? 0, fuera.get(venta.comarca) ?? 0);
      const pan = panDeViaje(t, jornadas);
      const hueco = recua.porte - pan;
      if (hueco <= 0) continue;
      for (const recurso of COMERCIABLES) {
        const pa = precioSabido(t, compra.id, recurso);
        const pb = precioSabido(t, venta.id, recurso);
        if (pa === null || pb === null || pa <= 0) continue;
        const cantidad = Math.min(hueco, Math.floor((bolsa * 1000) / Math.ceil((pa * 12) / 10)));
        const ganancia = Math.floor((cantidad * (pb * 0.9 - pa * 1.2)) / 1000);
        if (cantidad <= 0 || ganancia < GANANCIA_MINIMA) continue;
        if (mejor === null || ganancia > mejor.ganancia) {
          mejor = {
            compra,
            venta,
            recurso,
            cantidad,
            precioCompraMil: pa,
            precioVentaMil: pb,
            ganancia,
            jornadas,
          };
        }
      }
    }
  }
  return mejor;
}

/** La plaza conocida mas cercana de la que no se sabe el precio de hoy, al alcance de la recua. */
function plazaPorConocer(t: Tablero, recua: Recua): IdComarca | null {
  const fuera = t.jornadasDesdeLoPropio();
  let mejor: { comarca: IdComarca; jornadas: number } | null = null;
  for (const plaza of t.plazasConocidas()) {
    if (precioSabido(t, plaza.id, 'pan') !== null) continue;
    const jornadas = fuera.get(plaza.comarca);
    if (jornadas === undefined || panDeViaje(t, jornadas) > recua.porte) continue;
    if (t.turnosHastaQueAbra(plaza) > Math.ceil(jornadas / 3) + 1) continue;
    if (mejor === null || jornadas < mejor.jornadas) mejor = { comarca: plaza.comarca, jornadas };
  }
  return mejor?.comarca ?? null;
}

/** Lo que lleva la recua para vender: todo menos el pan del camino y los maravedis. */
function mercancias(recua: Recua): Recurso[] {
  return COMERCIABLES.filter((r) => r !== 'pan' && recua.carga[r] > 0);
}

/** La plaza conocida que mejor paga un recurso, al alcance de la recua. */
function mejorPlazaParaVender(t: Tablero, recua: Recua, recurso: Recurso): PlazaConocida | null {
  const fuera = t.jornadasDesdeLoPropio();
  let mejor: { plaza: PlazaConocida; precio: number } | null = null;
  for (const plaza of t.plazasConocidas()) {
    const precio = precioSabido(t, plaza.id, recurso);
    const jornadas = fuera.get(plaza.comarca);
    if (precio === null || jornadas === undefined) continue;
    if (panDeViaje(t, jornadas) + recua.carga[recurso] > recua.porte + recua.carga.pan) continue;
    if (mejor === null || precio > mejor.precio) mejor = { plaza, precio };
  }
  return mejor?.plaza ?? null;
}

/** Vende lo que lleva donde mejor se lo pagan: aqui mismo con una orden, o yendo a la plaza. */
function venderLoQueLleva(d: Decision, recua: Recua, recurso: Recurso): void {
  const { t, p } = d;
  const plaza = mejorPlazaParaVender(t, recua, recurso);
  const cantidad = recua.carga[recurso];
  if (plaza === null) {
    if (Tablero.donde(recua) !== t.capital) p.ir(recua.id, t.capital);
    p.carga(recua.id, {}, { [recurso]: cantidad });
    return;
  }
  const precio = precioSabido(t, plaza.id, recurso) ?? t.precioMil(plaza.id, recurso);
  const minimo = Math.floor((precio * 9) / 10);
  if (plaza.comarca === Tablero.donde(recua)) {
    if (recua.cometido !== 'tratar') p.cometido(recua.id, 'tratar');
    const turnos = t.turnosHastaQueAbra(plaza) + d.cadencia;
    p.mercado(recua.id, plaza.id, recurso, 'vender', cantidad, minimo, turnos);
    return;
  }
  const pan = Math.max(
    0,
    panDeViaje(t, t.jornadasDesdeLoPropio().get(plaza.comarca) ?? 0) - recua.carga.pan,
  );
  if (pan > 0 && t.esPropia(Tablero.donde(recua))) p.carga(recua.id, { pan }, {});
  p.ruta(recua.id, [
    parada(plaza.comarca, { vender: { [recurso]: { cantidad, precioMinimoMil: minimo } } }),
    parada(t.capital),
  ]);
}

export const arbitraje: Rutina = (d, recua) => {
  const { t, p } = d;
  const aqui = Tablero.donde(recua);
  if (!t.esPropia(aqui)) {
    volverACasa(d, recua);
    return;
  }
  const lleva = mercancias(recua)[0];
  if (lleva !== undefined) {
    venderLoQueLleva(d, recua, lleva);
    return;
  }
  const bolsa = Math.min(t.disponible('maravedis') - p.reservado('maravedis') - 60, BOLSA_MAXIMA);
  const negocio = bolsa > 0 ? mejorNegocio(t, recua, bolsa) : null;
  if (negocio !== null) {
    // Los precios se mueven de un turno a otro: se puja con un margen sobre lo sabido.
    const precioMaximoMil = Math.floor((negocio.precioCompraMil * 12) / 10);
    const maravedis = Math.ceil((negocio.cantidad * precioMaximoMil) / 1000);
    if (negocio.compra.comarca === aqui) {
      // La plaza barata esta aqui: se compra con una orden y, con la carga hecha, se va a vender.
      p.carga(recua.id, { maravedis }, {});
      if (recua.cometido !== 'tratar') p.cometido(recua.id, 'tratar');
      const turnos = t.turnosHastaQueAbra(negocio.compra) + d.cadencia;
      p.mercado(
        recua.id,
        negocio.compra.id,
        negocio.recurso,
        'comprar',
        negocio.cantidad,
        precioMaximoMil,
        turnos,
      );
      return;
    }
    const pan = Math.max(0, panDeViaje(t, negocio.jornadas) - recua.carga.pan);
    p.carga(recua.id, { maravedis, pan }, {});
    p.ruta(recua.id, [
      parada(negocio.compra.comarca, {
        comprar: { [negocio.recurso]: { cantidad: negocio.cantidad, precioMaximoMil } },
      }),
      parada(negocio.venta.comarca, {
        vender: {
          [negocio.recurso]: {
            cantidad: negocio.cantidad,
            precioMinimoMil: Math.floor((negocio.precioVentaMil * 9) / 10),
          },
        },
      }),
      parada(t.capital),
    ]);
    return;
  }
  const porConocer = plazaPorConocer(t, recua);
  if (porConocer !== null && porConocer !== aqui) {
    const falta = Math.max(0, recua.porte - recua.carga.pan);
    if (falta > 0) p.carga(recua.id, { pan: falta }, {});
    p.ruta(recua.id, [parada(porConocer), parada(t.capital)]);
    return;
  }
  // Sin negocio a la vista la recua espera en casa: no hay nada sensato que hacer con ella.
  if (recua.carga.maravedis > 0) p.carga(recua.id, {}, { maravedis: recua.carga.maravedis });
};
