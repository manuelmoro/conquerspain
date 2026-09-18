// Fase 07 · Mercado (T-037, docs/03-economia.md §3.10; ficha T-037).
//
// Cada plaza abierta casa, recurso a recurso, las lineas de compra y de venta de las recuas que
// comercian en ella —paradas de ruta y ordenes `mercado`— y fija su precio nuevo; las plazas
// cerradas solo dejan que su precio vuelva al base. Las plazas van por identificador y los
// recursos en el orden de `RECURSOS`, asi que el resultado no depende del orden de llegada.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { cancelarOrden, dejarEnEspera, ordenesVivas } from '../ordenes.ts';
import type { OrdenDe } from '../ordenes.ts';
import { factorDeAcontecimientos, precioBaseEfectivo } from '../reglas/acontecimientos.ts';
import type { ResultadoDeLinea } from '../reglas/mercado.ts';
import { casarPlaza } from '../reglas/mercado.ts';
import type { CatalogoDePlazas, Plaza } from '../reglas/plazas.ts';
import { catalogoDePlazas } from '../reglas/plazas.ts';
import { nuevoPrecioMil, topeDeVolumen } from '../reglas/precios.ts';
import type { Solicitud, SolicitudConLinea } from '../reglas/solicitudes.ts';
import { lineasDeSolicitudes } from '../reglas/solicitudes.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoMercado } from '../tipos/estado.ts';
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import type { DatosRecurso } from '../tipos/reglas.ts';
import { multiplicarFactores } from '../utiles/enteros.ts';
import type { Recurso } from '../tipos/recursos.ts';
import { RECURSOS_COMERCIABLES, recursosSegun } from '../tipos/recursos.ts';
import { hash32 } from '../utiles/huella.ts';
import { idsEnOrden } from '../utiles/orden.ts';

type Solicitudes = Map<string, Solicitud[]>;

export function faseMercado(ctx: Contexto): void {
  const catalogo = catalogoDePlazas(ctx.estado, ctx.mundo, ctx.calendario.feriasActivas);
  for (const plaza of catalogo.abiertas) {
    if (ctx.estado.mercados[plaza.id] === undefined) abrirMercado(ctx, plaza);
  }
  const solicitudes = reunirSolicitudes(ctx, catalogo);

  for (const id of idsEnOrden(ctx.estado.mercados)) {
    const mercado = ctx.estado.mercados[id];
    if (mercado === undefined) continue;
    const plaza = catalogo.abierta(mercado.id);
    for (const recurso of RECURSOS_COMERCIABLES) {
      if (plaza === null) {
        dejarVolverAlBase(ctx, mercado, recurso);
      } else {
        casar(ctx, plaza, mercado, recurso, solicitudes.get(`${plaza.id}|${recurso}`) ?? []);
      }
    }
  }
}

function abrirMercado(ctx: Contexto, plaza: Plaza): void {
  aplicar(ctx, {
    tipo: 'mercado-alta',
    mercado: {
      id: plaza.id,
      comarca: plaza.comarca,
      tipo: plaza.tipo,
      volumen: plaza.volumen,
      preciosMil: recursosSegun((r) => ctx.reglas.recursos[r].precioBaseMil),
      ultimoVolumen: recursosSegun(() => 0),
    },
  });
}

// ——— Solicitudes ——————————————————————————————————————————————————————————

function reunirSolicitudes(ctx: Contexto, catalogo: CatalogoDePlazas): Solicitudes {
  const reunidas: Solicitudes = new Map();
  const anyadir = (solicitud: Solicitud): void => {
    const clave = `${solicitud.plaza}|${solicitud.recurso}`;
    reunidas.set(clave, [...(reunidas.get(clave) ?? []), solicitud]);
  };
  for (const solicitud of solicitudesDeParadas(ctx, catalogo)) anyadir(solicitud);
  for (const orden of ordenesVivas(ctx, 'mercado')) {
    const solicitud = solicitudDeOrden(ctx, catalogo, orden);
    if (solicitud !== null) anyadir(solicitud);
  }
  return reunidas;
}

/** Lo que las recuas detenidas en una parada quieren vender y comprar en la plaza de su comarca. */
function solicitudesDeParadas(ctx: Contexto, catalogo: CatalogoDePlazas): Solicitud[] {
  const solicitudes: Solicitud[] = [];
  for (const id of idsEnOrden(ctx.estado.recuas)) {
    const recua = ctx.estado.recuas[id];
    if (recua === undefined || recua.enParada === null || recua.situacion.donde !== 'comarca') {
      continue;
    }
    const parada = recua.paradas[recua.enParada];
    if (parada === undefined) continue;
    const comarca = recua.situacion.comarca;
    const quiere = RECURSOS_COMERCIABLES.some(
      (r) => parada.vender[r] !== undefined || parada.comprar[r] !== undefined,
    );
    if (!quiere) continue;
    const plaza = catalogo.abiertaEn(comarca);
    if (plaza === null) {
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'mercado.sin-plaza',
        { recua: recua.id, comarca },
        { jugador: recua.jugador, comarca },
      );
      continue;
    }
    for (const recurso of RECURSOS_COMERCIABLES) {
      const vende = parada.vender[recurso];
      const compra = parada.comprar[recurso];
      const comunes = {
        via: 'parada',
        jugador: recua.jugador,
        recua: recua.id,
        plaza: plaza.id,
        recurso,
        orden: null,
      } as const;
      if (vende !== undefined && vende.cantidad > 0) {
        solicitudes.push({
          ...comunes,
          clave: `parada:${recua.id}:${recurso}:vender`,
          operacion: 'vender',
          cantidad: vende.cantidad,
          limiteMil: vende.precioMinimoMil,
        });
      }
      if (compra !== undefined && compra.cantidad > 0) {
        solicitudes.push({
          ...comunes,
          clave: `parada:${recua.id}:${recurso}:comprar`,
          operacion: 'comprar',
          cantidad: compra.cantidad,
          limiteMil: compra.precioMaximoMil,
        });
      }
    }
  }
  return solicitudes;
}

/**
 * Una orden `mercado` la ejecuta la recua que nombra, quieta en la comarca de la plaza y con
 * cometido `tratar`. Si no puede, la orden espera; si no tiene remedio, se cancela.
 */
function solicitudDeOrden(
  ctx: Contexto,
  catalogo: CatalogoDePlazas,
  orden: OrdenDe<'mercado'>,
): Solicitud | null {
  const recua = ctx.estado.recuas[orden.recua];
  if (recua === undefined || recua.jugador !== orden.jugador) {
    cancelarOrden(ctx, orden, 'recua-desconocida');
    return null;
  }
  if (orden.recurso === 'maravedis') {
    cancelarOrden(ctx, orden, 'no-se-comercia-con-maravedis');
    return null;
  }
  const situacion = catalogo.situacionDe(orden.mercado);
  if (situacion === 'desconocida') {
    cancelarOrden(ctx, orden, 'mercado-desconocido');
    return null;
  }
  const plaza = catalogo.abierta(orden.mercado);
  if (plaza === null) {
    dejarEnEspera(ctx, orden, 'plaza-cerrada');
    return null;
  }
  const espera =
    recua.situacion.donde !== 'comarca' || recua.situacion.comarca !== plaza.comarca
      ? 'recua-lejos'
      : recua.ruta.length > 0
        ? 'recua-en-ruta'
        : recua.cometido !== 'tratar'
          ? 'recua-sin-cometido'
          : null;
  if (espera !== null) {
    dejarEnEspera(ctx, orden, espera);
    return null;
  }
  if (orden.estado === 'en espera') {
    aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado: 'pendiente', motivo: null });
  }
  return {
    via: 'orden',
    clave: `orden:${orden.id}`,
    jugador: orden.jugador,
    recua: recua.id,
    plaza: plaza.id,
    recurso: orden.recurso,
    operacion: orden.operacion,
    cantidad: orden.cantidad,
    limiteMil: orden.precioLimiteMil,
    orden: orden.id,
  };
}

// ——— Casacion de una plaza y un recurso ———————————————————————————————————

/** Comision de un jugador en una plaza: la de su casa y, en feria, como mucho la de la feria. */
function comisionMilDe(ctx: Contexto, jugador: IdJugador, plaza: Plaza): number {
  const casa = ctx.estado.jugadores[jugador]?.casa;
  const propia = casa === undefined ? 0 : ctx.reglas.casas[casa].modificadores.comisionMercadoMil;
  return plaza.tipo === 'feria' ? Math.min(propia, ctx.reglas.mercado.comisionFeriaMil) : propia;
}

/**
 * Lo que el catalogo dice de un recurso, con el precio base que le dan los acontecimientos en la
 * region de la comarca: una carestia de sal sube el base hacia el que regresa la plaza.
 */
function recursoEnLaPlaza(ctx: Contexto, comarca: IdComarca, recurso: Recurso): DatosRecurso {
  const datos = ctx.reglas.recursos[recurso];
  const lugar = { region: ctx.mundo.comarcas[comarca]?.region ?? '', comarca };
  return {
    ...datos,
    precioBaseMil: precioBaseEfectivo(
      datos.precioBaseMil,
      ctx.estado.acontecimientos,
      ctx.turno,
      lugar,
      recurso,
    ),
  };
}

/** El tope de la plaza, con el buen anyo de feria si lo hay. */
function topeDeLaPlaza(ctx: Contexto, plaza: Plaza): number {
  const tope = topeDeVolumen(plaza.volumen, ctx.reglas.mercado);
  if (plaza.tipo !== 'feria') return tope;
  const lugar = { region: ctx.mundo.comarcas[plaza.comarca]?.region ?? '', comarca: plaza.comarca };
  return multiplicarFactores(tope, [
    factorDeAcontecimientos(ctx.estado.acontecimientos, ctx.turno, 'volumen', lugar),
  ]);
}

function casar(
  ctx: Contexto,
  plaza: Plaza,
  mercado: EstadoMercado,
  recurso: Recurso,
  solicitudes: readonly Solicitud[],
): void {
  const tabla = ctx.reglas.mercado;
  const lineas = lineasDeSolicitudes(solicitudes, ctx.estado.recuas, (jugador) =>
    comisionMilDe(ctx, jugador, plaza),
  );
  const resultado = casarPlaza({
    precioMil: mercado.preciosMil[recurso],
    recurso: recursoEnLaPlaza(ctx, plaza.comarca, recurso),
    tope: topeDeLaPlaza(ctx, plaza),
    lineas: lineas.map((l) => l.linea),
    tabla,
    desempate: (jugador) =>
      hash32(`${ctx.semilla}|${String(ctx.turno)}|mercado:${plaza.id}:${recurso}|${jugador}`),
  });

  const porClave = new Map(lineas.map((l) => [l.solicitud.clave, l]));
  for (const linea of resultado.lineas) {
    const origen = porClave.get(linea.clave);
    if (origen !== undefined) cumplir(ctx, plaza, recurso, resultado.precioMil, origen, linea);
  }

  aplicar(ctx, {
    tipo: 'mercado-precio',
    mercado: plaza.id,
    recurso,
    precioMil: resultado.precioMil,
    volumen: resultado.volumen,
  });
  if (resultado.precioMil !== resultado.precioAnteriorMil || resultado.volumen > 0) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'mercado.precio',
      {
        mercado: plaza.id,
        recurso,
        antes: resultado.precioAnteriorMil,
        despues: resultado.precioMil,
        demanda: resultado.demanda,
        oferta: resultado.oferta,
        volumen: resultado.volumen,
      },
      { comarca: plaza.comarca },
    );
  }
}

/** Sin plaza abierta no se casa nada: el precio solo vuelve hacia el base. */
function dejarVolverAlBase(ctx: Contexto, mercado: EstadoMercado, recurso: Recurso): void {
  const antes = mercado.preciosMil[recurso];
  const datos = recursoEnLaPlaza(ctx, mercado.comarca, recurso);
  const despues = nuevoPrecioMil(antes, 0, datos, ctx.reglas.mercado);
  if (despues === antes && mercado.ultimoVolumen[recurso] === 0) return;
  aplicar(ctx, {
    tipo: 'mercado-precio',
    mercado: mercado.id,
    recurso,
    precioMil: despues,
    volumen: 0,
  });
}

// ——— Lo que pasa con cada linea ———————————————————————————————————————————

function cumplir(
  ctx: Contexto,
  plaza: Plaza,
  recurso: Recurso,
  precioMil: number,
  { solicitud, linea }: SolicitudConLinea,
  resultado: ResultadoDeLinea,
): void {
  const vende = solicitud.operacion === 'vender';
  const carga = (r: Recurso, delta: number, motivo: string): void => {
    if (delta === 0) return;
    aplicar(ctx, { tipo: 'recua-carga', recua: solicitud.recua, recurso: r, delta, motivo });
  };

  if (resultado.casada > 0) {
    if (vende) {
      carga(recurso, -resultado.casada, 'venta');
      carga('maravedis', resultado.importe, 'venta');
      carga('maravedis', -resultado.comision, 'comision');
    } else {
      carga('maravedis', -resultado.importe, 'compra');
      carga('maravedis', -resultado.comision, 'comision');
      carga(recurso, resultado.casada, 'compra');
    }
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'mercado.trato',
      {
        mercado: plaza.id,
        recua: solicitud.recua,
        recurso,
        operacion: solicitud.operacion,
        cantidad: resultado.casada,
        precioMil,
        importe: resultado.importe,
        comision: resultado.comision,
        conJugadores: resultado.conJugadores,
        conMenores: resultado.conMenores,
        via: solicitud.via,
      },
      { jugador: solicitud.jugador, comarca: plaza.comarca },
    );
  }

  // Lo que la recua no podia ni prometer (no lo lleva o no le cabe) tambien se avisa.
  const motivo =
    resultado.motivo ??
    (linea.cantidad < solicitud.cantidad ? (vende ? 'sin-carga' : 'sin-espacio') : null);
  if (resultado.casada < solicitud.cantidad && motivo !== null) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'mercado.sin-casar',
      {
        mercado: plaza.id,
        recua: solicitud.recua,
        recurso,
        operacion: solicitud.operacion,
        pedido: solicitud.cantidad,
        casado: resultado.casada,
        motivo,
      },
      { jugador: solicitud.jugador, comarca: plaza.comarca },
    );
  }

  if (solicitud.orden !== null) cerrarTurnoDeOrden(ctx, solicitud.orden, resultado.casada);
}

/**
 * La orden de mercado queda con lo que falta por casar. Se termina cuando no falta nada o cuando
 * se le acaban los turnos, y en ese caso el sobrante se dice.
 */
function cerrarTurnoDeOrden(ctx: Contexto, id: string, casada: number): void {
  const orden = ctx.estado.ordenes.find((o) => o.id === id);
  if (orden?.tipo !== 'mercado') return;
  const falta = orden.cantidad - casada;
  if (casada > 0) aplicar(ctx, { tipo: 'orden-cantidad', orden: orden.id, cantidad: falta });
  aplicar(ctx, { tipo: 'orden-avance', orden: orden.id, turnos: 1 });
  if (falta === 0) {
    aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado: 'terminada', motivo: null });
  } else if (orden.turnosHechos >= orden.turnosTotales) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'mercado.orden-caduca',
      { orden: orden.id, sobra: falta },
      { jugador: orden.jugador },
    );
    aplicar(ctx, {
      tipo: 'orden-estado',
      orden: orden.id,
      estado: 'terminada',
      motivo: 'caducada',
    });
  }
}
