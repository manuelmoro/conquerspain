// Comprar donde sobra y vender donde falta: la rutina de las recuas de los mercaderes y de los
// arrieros. Solo usa los precios que el jugador sabe, con su fecha; si no sabe ninguno que merezca
// la pena, va a enterarse a la plaza conocida mas cercana.
//
// Un negocio se cuenta en limpio (ficha T-050 §4.1.5): se puja por encima del precio sabido y se
// acepta vender por debajo, se pagan las comisiones de la casa en las dos plazas y el pan y la sal
// que se come la recua por el camino, al precio base. Si con eso no queda ganancia, no se sale.
import { comparar, multiplicarFactores } from '@conquer/nucleo';
import type { IdMercado, Recua, Recurso } from '@conquer/nucleo';

import type { Decision, Rutina } from './impulsos.ts';
import { COMERCIABLES, volverACasa } from './impulsos.ts';
import { parada } from './pedidos.ts';
import type { PlazaConocida } from './tablero.ts';
import { Tablero } from './tablero.ts';
import type { Parada, Provision } from './viaje.ts';
import { provisionPara } from './viaje.ts';

/** Maravedis que se lleva la recua para comprar, como mucho. */
const BOLSA_MAXIMA = 200;
/** Maravedis que se quedan siempre en el almacen: son para la administracion. */
const COLCHON = 60;
/** Ganancia neta minima que justifica el viaje, en maravedis. */
const GANANCIA_MINIMA = 8;
/** Un precio sabido hace mas de esto ya no sirve para decidir. */
const PRECIO_CADUCA_EN = 24;
/**
 * Los precios se mueven de un turno a otro y con la propia compra: se puja hasta un 20 % por encima
 * del precio sabido y se acepta vender hasta un 10 % por debajo (en milesimas).
 */
const PUJA_MIL = 1200;
const REBAJA_MIL = 900;
/** Parejas de plazas que se prevén como mucho: las de mejor diferencia de precio. */
const PAREJAS_QUE_SE_PREVEN = 8;

interface Negocio {
  readonly compra: PlazaConocida;
  readonly venta: PlazaConocida;
  readonly recurso: Recurso;
  readonly cantidad: number;
  /** Lo mas que paga por carga y lo menos que acepta por ella, en milesimas. */
  readonly precioMaximoMil: number;
  readonly precioMinimoMil: number;
  /** Lo que se lleva para comprar, comision incluida. */
  readonly bolsa: number;
  readonly ganancia: number;
  readonly provision: Provision;
}

function precioSabido(t: Tablero, plaza: IdMercado, recurso: Recurso): number | null {
  const sabido = t.yo.plazas[plaza];
  if (sabido === undefined || t.turno - sabido.turno > PRECIO_CADUCA_EN) return null;
  return sabido.preciosMil[recurso];
}

/** La comision de la casa en una plaza: en feria, la menor entre la suya y la de la feria. */
function comisionMil(t: Tablero, plaza: PlazaConocida): number {
  const propia = t.casa.comisionMercadoMil;
  return plaza.tipo === 'feria' ? Math.min(propia, t.reglas.mercado.comisionFeriaMil) : propia;
}

/** Lo que cuesta comprar `cantidad` a `precioMil` con la comision: como lo cobra el motor. */
function costeDeCompra(cantidad: number, precioMil: number, comision: number): number {
  const importe = multiplicarFactores(cantidad, [precioMil]);
  return importe + multiplicarFactores(importe, [comision]);
}

/** Lo que se cobra vendiendo `cantidad` a `precioMil`, descontada la comision. */
function ingresoDeVenta(cantidad: number, precioMil: number, comision: number): number {
  const importe = multiplicarFactores(cantidad, [precioMil]);
  return importe - multiplicarFactores(importe, [comision]);
}

/**
 * El pan y la sal del viaje, al precio base **de la capital**: sale del almacen de casa, asi que
 * lo que cuesta mover la mercancia es lo que alli valdria (T-052).
 */
function valorDelBastimento(t: Tablero, provision: Provision): number {
  const p = provision.prevision;
  return (
    multiplicarFactores(p.pan + p.panDeCasa, [t.baseEn(t.capital, 'pan')]) +
    multiplicarFactores(p.sal + p.salDeCasa, [t.baseEn(t.capital, 'sal')])
  );
}

/** Las plazas conocidas a las que se llega, con precio sabido y reciente. */
function plazasConPrecio(t: Tablero): PlazaConocida[] {
  const alcance = t.jornadasDesdeLoPropio();
  return t
    .plazasConocidas()
    .filter((pl) => alcance.has(pl.comarca) && precioSabido(t, pl.id, 'pan') !== null);
}

/**
 * Comprar en una plaza, vender en otra y volver a la capital. Si se vende **en casa** —lo normal
 * desde T-052, cuando la mercancia es barata en la vecina y cara en la propia comarca— la vuelta
 * ya es la parada de venta y no se repite: una ruta con la misma comarca dos veces seguidas no
 * es un viaje.
 */
function paradasDe(t: Tablero, compra: PlazaConocida, venta: PlazaConocida): Parada[] {
  const paradas: Parada[] = [
    { comarca: compra.comarca, detiene: true },
    { comarca: venta.comarca, detiene: true },
  ];
  if (venta.comarca !== t.capital) paradas.push({ comarca: t.capital, detiene: false });
  return paradas;
}

/** El negocio de un recurso entre dos plazas para una recua con esta provision, o null. */
function negocioDe(
  t: Tablero,
  compra: PlazaConocida,
  venta: PlazaConocida,
  recurso: Recurso,
  bolsa: number,
  hueco: number,
  provision: Provision,
): Omit<Negocio, 'provision'> | null {
  const pa = precioSabido(t, compra.id, recurso);
  const pb = precioSabido(t, venta.id, recurso);
  if (pa === null || pb === null || pa <= 0) return null;
  const precioMaximoMil = multiplicarFactores(pa, [PUJA_MIL]);
  const precioMinimoMil = multiplicarFactores(pb, [REBAJA_MIL]);
  const [ca, cb] = [comisionMil(t, compra), comisionMil(t, venta)];
  let cantidad = Math.min(hueco, Math.floor((bolsa * 1000) / precioMaximoMil));
  while (cantidad > 0 && costeDeCompra(cantidad, precioMaximoMil, ca) > bolsa) cantidad -= 1;
  if (cantidad <= 0) return null;
  const pagado = costeDeCompra(cantidad, precioMaximoMil, ca);
  const ganancia =
    ingresoDeVenta(cantidad, precioMinimoMil, cb) - pagado - valorDelBastimento(t, provision);
  return {
    compra,
    venta,
    recurso,
    cantidad,
    precioMaximoMil,
    precioMinimoMil,
    bolsa: pagado,
    ganancia,
  };
}

/**
 * El negocio tanteado con la recua vacia, comprobado con la mercancia encima: cargada anda menos y
 * come mas. Si no cabe, se prueba con menos cargas; si con ninguna deja ganancia, no hay negocio.
 */
function conLaCarga(
  t: Tablero,
  recua: Recua,
  paradas: readonly Parada[],
  tanteo: Omit<Negocio, 'provision'>,
  bolsa: number,
  salida = 0,
): Negocio | null {
  for (let cargas = tanteo.cantidad; cargas > 0; cargas -= 1) {
    const llena = provisionPara(t, recua, paradas, { [tanteo.recurso]: cargas }, salida);
    if (!llena.ok) continue;
    const final = negocioDe(
      t,
      tanteo.compra,
      tanteo.venta,
      tanteo.recurso,
      bolsa,
      cargas,
      llena.valor,
    );
    if (final !== null && final.ganancia >= GANANCIA_MINIMA)
      return { ...final, provision: llena.valor };
  }
  return null;
}

/** Diferencia bruta de precio mas alta entre dos plazas: para mirar primero las prometedoras. */
function diferencia(t: Tablero, compra: PlazaConocida, venta: PlazaConocida): number {
  let mejor = Number.NEGATIVE_INFINITY;
  for (const recurso of COMERCIABLES) {
    const pa = precioSabido(t, compra.id, recurso);
    const pb = precioSabido(t, venta.id, recurso);
    if (pa === null || pb === null || pa <= 0) continue;
    mejor = Math.max(
      mejor,
      multiplicarFactores(pb, [REBAJA_MIL]) - multiplicarFactores(pa, [PUJA_MIL]),
    );
  }
  return mejor;
}

/**
 * El mejor negocio que la recua, quieta en la capital, puede hacer con lo que sabe: el que mas
 * gana en limpio. Si no hay ninguno, dice por que.
 */
function mejorNegocio(d: Decision, recua: Recua, bolsa: number, enCasa: Tanteo): Negocio | null {
  const { t } = d;
  const plazas = plazasConPrecio(t);
  if (plazas.length < 2) {
    d.m.anotar('sin-precios-sabidos');
    return null;
  }
  const parejas: [PlazaConocida, PlazaConocida, number][] = [];
  for (const compra of plazas) {
    for (const venta of plazas) {
      if (venta.id === compra.id || compra.comarca === t.capital) continue;
      const margen = diferencia(t, compra, venta);
      if (margen > 0) parejas.push([compra, venta, margen]);
    }
  }
  parejas.sort((a, b) => b[2] - a[2] || comparar(a[0].id, b[0].id) || comparar(a[1].id, b[1].id));
  let mejor: Negocio | null = null;
  let algunViaje = false;
  for (const [compra, venta] of parejas.slice(0, PAREJAS_QUE_SE_PREVEN)) {
    const vacia = provisionPara(t, recua, paradasDe(t, compra, venta));
    if (!vacia.ok) continue;
    algunViaje = true;
    const hueco = recua.porte - vacia.valor.pan - vacia.valor.sal;
    for (const recurso of COMERCIABLES) {
      const tanteo = negocioDe(t, compra, venta, recurso, bolsa, hueco, vacia.valor);
      if (tanteo === null || tanteo.ganancia < GANANCIA_MINIMA) continue;
      if (mejor !== null && tanteo.ganancia <= mejor.ganancia) continue;
      const final = conLaCarga(t, recua, paradasDe(t, compra, venta), tanteo, bolsa);
      if (final !== null && (mejor === null || final.ganancia > mejor.ganancia)) mejor = final;
    }
  }
  if (mejor === null) {
    const sinViaje =
      (parejas.length > 0 && !algunViaje) || (parejas.length === 0 && enCasa === 'sin-viaje');
    d.m.anotar(sinViaje ? 'sin-viaje-que-quepa' : 'sin-negocio-rentable');
  }
  return mejor;
}

/** Lo que salio de mirar un negocio: hecho, imposible por el viaje o sin ninguno a la vista. */
type Tanteo = 'hecho' | 'sin-viaje' | 'ninguno';

/** La compra se hace en la plaza de la capital, donde esta la recua: con una orden de mercado. */
function negocioEnCasa(d: Decision, recua: Recua, bolsa: number): Tanteo {
  const { t, p } = d;
  const plazas = plazasConPrecio(t);
  const casa = plazas.find((pl) => pl.comarca === t.capital && pl.tipo === 'local');
  if (casa === undefined) return 'ninguno';
  let mejor: Negocio | null = null;
  let conDiferencia = false;
  let algunViaje = false;
  for (const venta of plazas) {
    if (venta.id === casa.id || diferencia(t, casa, venta) <= 0) continue;
    conDiferencia = true;
    const paradas: Parada[] = [
      { comarca: venta.comarca, detiene: true },
      { comarca: t.capital, detiene: false },
    ];
    // Se compra hoy en la plaza y se sale el turno que viene: la prevision empieza entonces.
    const vacia = provisionPara(t, recua, paradas, {}, 1);
    if (!vacia.ok) continue;
    algunViaje = true;
    const hueco = recua.porte - vacia.valor.pan - vacia.valor.sal;
    for (const recurso of COMERCIABLES) {
      const tanteo = negocioDe(t, casa, venta, recurso, bolsa, hueco, vacia.valor);
      if (tanteo === null || tanteo.ganancia < GANANCIA_MINIMA) continue;
      if (mejor !== null && tanteo.ganancia <= mejor.ganancia) continue;
      const final = conLaCarga(t, recua, paradas, tanteo, bolsa, 1);
      if (final !== null && (mejor === null || final.ganancia > mejor.ganancia)) mejor = final;
    }
  }
  if (mejor === null) return conDiferencia && !algunViaje ? 'sin-viaje' : 'ninguno';
  p.carga(recua.id, { maravedis: mejor.bolsa }, {});
  if (recua.cometido !== 'tratar') p.cometido(recua.id, 'tratar');
  p.mercado(
    recua.id,
    casa.id,
    mejor.recurso,
    'comprar',
    mejor.cantidad,
    mejor.precioMaximoMil,
    t.turnosHastaQueAbra(casa) + d.cadencia,
  );
  return 'hecho';
}

/** Lo que lleva la recua para vender, en la capital: todo menos el pan y los maravedis. */
function mercancias(recua: Recua): Recurso[] {
  return COMERCIABLES.filter((r) => r !== 'pan' && recua.carga[r] > 0);
}

/**
 * Vende lo que lleva en la plaza que mejor lo paga de las que alcanza con ello a cuestas y desde la
 * que vuelve; si no alcanza ninguna, lo descarga en casa.
 */
function venderLoQueLleva(d: Decision, recua: Recua, recurso: Recurso): void {
  const { t, p } = d;
  const cantidad = recua.carga[recurso];
  let mejor: { plaza: PlazaConocida; precio: number; provision: Provision } | null = null;
  // En la plaza de casa no: es donde se compro, y alli la vende el tratante si sobra.
  for (const plaza of plazasConPrecio(t).filter((pl) => pl.comarca !== t.capital)) {
    const precio = precioSabido(t, plaza.id, recurso);
    if (precio === null || (mejor !== null && precio <= mejor.precio)) continue;
    const provision = provisionPara(t, recua, [
      { comarca: plaza.comarca, detiene: true },
      { comarca: t.capital, detiene: false },
    ]);
    if (provision.ok) mejor = { plaza, precio, provision: provision.valor };
  }
  if (mejor === null) {
    p.carga(recua.id, {}, { [recurso]: cantidad });
    return;
  }
  const minimo = multiplicarFactores(mejor.precio, [REBAJA_MIL]);
  if (mejor.plaza.comarca === Tablero.donde(recua)) {
    if (recua.cometido !== 'tratar') p.cometido(recua.id, 'tratar');
    const turnos = t.turnosHastaQueAbra(mejor.plaza) + d.cadencia;
    p.mercado(recua.id, mejor.plaza.id, recurso, 'vender', cantidad, minimo, turnos);
    return;
  }
  cargarBastimento(d, recua, mejor.provision);
  p.ruta(recua.id, [
    parada(mejor.plaza.comarca, { vender: { [recurso]: { cantidad, precioMinimoMil: minimo } } }),
    parada(t.capital),
  ]);
}

/** Carga el pan y la sal que le falten a la recua para el viaje previsto. */
function cargarBastimento(d: Decision, recua: Recua, provision: Provision, maravedis = 0): void {
  const pan = provision.pan - recua.carga.pan;
  const sal = provision.sal - recua.carga.sal;
  const cargar: Partial<Record<Recurso, number>> = {
    ...(pan > 0 ? { pan } : {}),
    ...(sal > 0 ? { sal } : {}),
    ...(maravedis > 0 ? { maravedis } : {}),
  };
  if (Object.keys(cargar).length > 0) d.p.carga(recua.id, cargar, {});
}

/** La plaza conocida mas cercana de la que no se sabe el precio de hoy, a la que se va y se vuelve. */
function plazaPorConocer(d: Decision, recua: Recua): Provision | null {
  const { t, p } = d;
  const alcance = t.jornadasDesdeLoPropio();
  const porConocer = t
    .plazasConocidas()
    .filter((pl) => precioSabido(t, pl.id, 'pan') === null && alcance.has(pl.comarca))
    .filter((pl) => pl.comarca !== t.capital)
    .sort(
      (a, b) =>
        (alcance.get(a.comarca) ?? 0) - (alcance.get(b.comarca) ?? 0) || comparar(a.id, b.id),
    );
  for (const plaza of porConocer) {
    // Se va cuando llegaria con la plaza abierta: una feria cerrada no dice sus precios.
    const provision = provisionPara(t, recua, [
      { comarca: plaza.comarca, detiene: true },
      { comarca: t.capital, detiene: false },
    ]);
    if (!provision.ok) continue;
    const llegada = provision.valor.prevision.llegadas[0] ?? 1;
    if (t.turnosHastaQueAbraEn(plaza, t.turno + llegada - 1) > 0) continue;
    cargarBastimento(d, recua, provision.valor);
    p.ruta(recua.id, [parada(plaza.comarca), parada(t.capital)]);
    return provision.valor;
  }
  return null;
}

export const arbitraje: Rutina = (d, recua) => {
  const { t, p } = d;
  const aqui = Tablero.donde(recua);
  if (aqui !== t.capital) {
    volverACasa(d, recua);
    return;
  }
  const lleva = mercancias(recua)[0];
  if (lleva !== undefined) {
    venderLoQueLleva(d, recua, lleva);
    return;
  }
  const bolsa = Math.min(
    t.disponible('maravedis') - p.reservado('maravedis') - COLCHON,
    BOLSA_MAXIMA,
  );
  if (bolsa <= 0) {
    d.m.anotar('sin-bolsa-para-comprar');
    return;
  }
  const enCasa = negocioEnCasa(d, recua, bolsa);
  if (enCasa === 'hecho') return;
  const negocio = mejorNegocio(d, recua, bolsa, enCasa);
  if (negocio !== null) {
    cargarBastimento(d, recua, negocio.provision, negocio.bolsa);
    p.ruta(recua.id, [
      parada(negocio.compra.comarca, {
        comprar: {
          [negocio.recurso]: {
            cantidad: negocio.cantidad,
            precioMaximoMil: negocio.precioMaximoMil,
          },
        },
      }),
      parada(negocio.venta.comarca, {
        vender: {
          [negocio.recurso]: {
            cantidad: negocio.cantidad,
            precioMinimoMil: negocio.precioMinimoMil,
          },
        },
      }),
      parada(t.capital),
    ]);
    return;
  }
  if (plazaPorConocer(d, recua) !== null) return;
  // Sin negocio a la vista la recua espera en casa, con la bolsa en el almacen.
  if (recua.carga.maravedis > 0) p.carga(recua.id, {}, { maravedis: recua.carga.maravedis });
};
