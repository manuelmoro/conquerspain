// Fase 04 · Movimiento de recuas (T-033, docs/03-economia.md §3.7).
//
// Primero se atienden las ordenes de recua (formar, cargar, cometido y ruta), cada clase en orden
// de identificador; despues anda cada recua por su ruta, pagando el bastimento de lo que anda. Las
// recuas no se estorban entre si: el orden en que se mueven solo decide, dentro de un mismo
// jugador, quien come primero si el pan no llega para todas, y es el de su identificador.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { ErrorDeMotor } from '../errores.ts';
import { cancelarOrden, dejarEnEspera, empezarOrden, ordenesVivas } from '../ordenes.ts';
import { cargarDelAlmacen, descargarEnAlmacen } from '../porteo.ts';
import type { OrdenDe } from '../ordenes.ts';
import { bastimentoDe } from '../reglas/bastimento.ts';
import { permiteIniciar } from '../reglas/escasez.ts';
import { avanzar, pasoDeRecua, porteDe } from '../reglas/movimiento.ts';
import {
  comarcaConocida,
  comarcasTransitables,
  costeDeTramoMil,
  rutaPorParadas,
  tieneCalzada,
  tramoEntre,
} from '../reglas/ruta.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoJugador, Recua } from '../tipos/estado.ts';
import { LONGITUD_MAXIMA_DE_RUTA } from '../tipos/estado.ts';
import type { IdComarca, IdRecua } from '../tipos/ids.ts';
import { nuevoId } from '../tipos/ids.ts';
import type { Camino } from '../tipos/mundo.ts';
import type { ParadaDeRuta } from '../tipos/ordenes.ts';
import type { Recurso } from '../tipos/recursos.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import { idsEnOrden } from '../utiles/orden.ts';

export function faseMovimiento(ctx: Contexto): void {
  for (const orden of ordenesVivas(ctx, 'formar-recua')) formarRecua(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'carga')) cargarRecua(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'cometido')) fijarCometido(ctx, orden);
  // Las rutas de rebanyos son de T-040.
  for (const orden of ordenesVivas(ctx, 'ruta')) if (orden.recua !== null) fijarRuta(ctx, orden);
  for (const id of idsEnOrden(ctx.estado.recuas)) moverRecua(ctx, id);
}

function disponible(jugador: EstadoJugador, recurso: Recurso): number {
  return jugador.almacen[recurso] - jugador.reservado[recurso];
}

/** La recua de la orden, si existe y es de quien la ordena. */
function recuaDeLaOrden(ctx: Contexto, jugador: string, id: IdRecua): Recua | null {
  const recua = ctx.estado.recuas[id];
  return recua !== undefined && recua.jugador === jugador ? recua : null;
}

/** La recua esta en una comarca del jugador: alli puede cargar, descargar y comer del almacen. */
function enCasa(ctx: Contexto, recua: Recua): IdComarca | null {
  if (recua.situacion.donde !== 'comarca') return null;
  const comarca = ctx.estado.comarcas[recua.situacion.comarca];
  return comarca?.duenyo === recua.jugador ? recua.situacion.comarca : null;
}

/** «Recua de Vinuesa», y si ya la hay, «Recua de Vinuesa 2», «… 3»: el primer nombre libre. */
function nombreDeRecua(ctx: Contexto, jugador: string, comarca: IdComarca): string {
  const base = `Recua de ${ctx.mundo.comarcas[comarca]?.nombre ?? comarca}`.slice(0, 55);
  const usados = new Set(
    Object.values(ctx.estado.recuas)
      .filter((r) => r.jugador === jugador)
      .map((r) => r.nombre),
  );
  let numero = 1;
  const nombre = (n: number): string => (n === 1 ? base : `${base} ${String(n)}`);
  while (usados.has(nombre(numero))) numero += 1;
  return nombre(numero);
}

function formarRecua(ctx: Contexto, orden: OrdenDe<'formar-recua'>): void {
  const m = ctx.reglas.movimiento;
  const comarca = ctx.estado.comarcas[orden.comarca];
  const jugador = ctx.estado.jugadores[orden.jugador];
  if (comarca === undefined || jugador === undefined || comarca.duenyo !== orden.jugador) {
    cancelarOrden(ctx, orden, 'comarca-ajena');
    return;
  }
  if (orden.acemilas < 1 || orden.acemilas > m.acemilasPorRecua) {
    cancelarOrden(ctx, orden, 'acemilas-fuera-de-rango');
    return;
  }
  if (orden.vecinos > m.vecinosMaximosPorRecua) {
    cancelarOrden(ctx, orden, 'demasiada-gente');
    return;
  }
  // La comarca no se queda nunca vacia por formar una recua.
  const gente = m.arrierosPorRecua + orden.vecinos;
  if (comarca.poblacion <= gente) {
    dejarEnEspera(ctx, orden, 'faltan-vecinos');
    return;
  }

  empezarOrden(ctx, orden, 'terminada');
  const id = nuevoId('recua', ctx.estado.siguienteId);
  aplicar(ctx, { tipo: 'siguiente-id' });
  aplicar(ctx, {
    tipo: 'poblacion',
    comarca: orden.comarca,
    delta: -gente,
    motivo: `salen con la recua ${id}`,
  });
  aplicar(ctx, {
    tipo: 'recua-alta',
    recua: {
      id,
      jugador: orden.jugador,
      nombre: nombreDeRecua(ctx, orden.jugador, orden.comarca),
      situacion: { donde: 'comarca', comarca: orden.comarca },
      ruta: [],
      rutaCircular: false,
      paradas: [],
      siguienteParada: 0,
      enParada: null,
      acemilas: orden.acemilas,
      porte: porteDe(
        orden.acemilas,
        ctx.reglas.casas[jugador.casa].modificadores.porteExtra,
        ctx.reglas,
      ),
      carga: Object.fromEntries(RECURSOS.map((r) => [r, 0])) as Record<Recurso, number>,
      vecinos: orden.vecinos,
      cometido: null,
      turnosDeCometido: 0,
      avisadaSinBastimento: false,
    },
  });
}

function cargarRecua(ctx: Contexto, orden: OrdenDe<'carga'>): void {
  const recua = recuaDeLaOrden(ctx, orden.jugador, orden.recua);
  const jugador = ctx.estado.jugadores[orden.jugador];
  if (recua === null || jugador === undefined) {
    cancelarOrden(ctx, orden, 'recua-desconocida');
    return;
  }
  const casa = enCasa(ctx, recua);
  if (casa === null) {
    dejarEnEspera(ctx, orden, 'recua-fuera-de-casa');
    return;
  }

  descargarEnAlmacen(ctx, recua.id, orden.descargar);
  cargarDelAlmacen(ctx, recua.id, orden.cargar, casa);

  const comarca = ctx.estado.comarcas[casa];
  const vecinos = Math.min(
    orden.vecinosCargados,
    ctx.reglas.movimiento.vecinosMaximosPorRecua - recua.vecinos,
    Math.max(0, (comarca?.poblacion ?? 0) - 1),
  );
  if (vecinos > 0) {
    aplicar(ctx, {
      tipo: 'poblacion',
      comarca: casa,
      delta: -vecinos,
      motivo: `suben a ${recua.id}`,
    });
    aplicar(ctx, { tipo: 'recua-vecinos', recua: recua.id, delta: vecinos, motivo: 'suben' });
  }
  empezarOrden(ctx, orden, 'terminada');
}

function fijarCometido(ctx: Contexto, orden: OrdenDe<'cometido'>): void {
  const recua = recuaDeLaOrden(ctx, orden.jugador, orden.recua);
  if (recua === null) {
    cancelarOrden(ctx, orden, 'recua-desconocida');
    return;
  }
  aplicar(ctx, { tipo: 'recua-cometido', recua: recua.id, cometido: orden.cometido });
  empezarOrden(ctx, orden, 'terminada');
}

function fijarRuta(ctx: Contexto, orden: OrdenDe<'ruta'>): void {
  const jugador = ctx.estado.jugadores[orden.jugador];
  const recua = orden.recua === null ? null : recuaDeLaOrden(ctx, orden.jugador, orden.recua);
  if (recua === null || jugador === undefined) {
    cancelarOrden(ctx, orden, 'recua-desconocida');
    return;
  }
  const paradas = orden.paradas.map((parada) => parada.comarca);
  if (paradas.length === 0) {
    cancelarOrden(ctx, orden, 'sin-paradas');
    return;
  }
  if (!paradas.every((comarca) => comarcaConocida(jugador, comarca))) {
    dejarEnEspera(ctx, orden, 'destino-desconocido');
    return;
  }
  // Con escasez no sale ninguna expedicion nueva; la que ya esta en camino puede cambiar de rumbo.
  if (recua.situacion.donde === 'comarca' && !permiteIniciar(jugador)) {
    dejarEnEspera(ctx, orden, 'escasez');
    return;
  }

  const transitables = comarcasTransitables(jugador);
  for (const [id, comarca] of Object.entries(ctx.estado.comarcas)) {
    if (comarca.duenyo === orden.jugador) transitables.add(id);
  }
  const salida =
    recua.situacion.donde === 'comarca' ? recua.situacion.comarca : recua.situacion.hasta;
  const ruta = rutaPorParadas(
    salida,
    paradas,
    orden.circular,
    ctx.mundo,
    ctx.estacional,
    transitables,
    ctx.reglas,
    ctx.estado.caminos,
  );
  if (ruta === null) {
    dejarEnEspera(ctx, orden, 'sin-ruta-conocida');
    return;
  }
  if (orden.circular && ruta.comarcas.length === 0) {
    cancelarOrden(ctx, orden, 'ruta-circular-vacia');
    return;
  }

  // Si va de camino, primero termina el tramo. En circular, el circuito vuelve a su final.
  const comarcas: IdComarca[] =
    recua.situacion.donde === 'comarca'
      ? [...ruta.comarcas]
      : [recua.situacion.hasta, ...(orden.circular ? ruta.comarcas.slice(0, -1) : ruta.comarcas)];
  if (comarcas.length > LONGITUD_MAXIMA_DE_RUTA) {
    cancelarOrden(ctx, orden, 'ruta-demasiado-larga');
    return;
  }
  aplicar(ctx, {
    tipo: 'recua-ruta',
    recua: recua.id,
    ruta: comarcas,
    circular: orden.circular,
    paradas: orden.paradas,
  });
  empezarOrden(ctx, orden, 'terminada');
}

function tramo(ctx: Contexto, desde: IdComarca, hasta: IdComarca): Camino {
  const camino = tramoEntre(ctx.mundo, desde, hasta);
  if (camino === undefined) {
    throw new ErrorDeMotor(
      'invariante-rota',
      `La ruta pasa de ${desde} a ${hasta} y no hay camino entre ellas.`,
      { desde, hasta },
    );
  }
  return camino;
}

/** Hay algo que hacer en la parada: la recua se detiene en ella. */
function detiene(parada: ParadaDeRuta): boolean {
  return [parada.cargar, parada.descargar, parada.vender, parada.comprar].some(
    (acciones) => Object.keys(acciones).length > 0,
  );
}

function moverRecua(ctx: Contexto, id: string): void {
  const recua = ctx.estado.recuas[id];
  if (recua === undefined) return;
  // La parada del turno pasado ya se atendio.
  if (recua.enParada !== null) {
    aplicar(ctx, {
      tipo: 'recua-mover',
      recua: recua.id,
      situacion: recua.situacion,
      ruta: recua.ruta,
      siguienteParada: recua.siguienteParada,
      enParada: null,
    });
  }
  const siguiente = recua.ruta[0];
  if (siguiente === undefined) return;
  const jugador = ctx.estado.jugadores[recua.jugador];
  if (jugador === undefined) return;
  const donde =
    recua.situacion.donde === 'comarca' ? recua.situacion.comarca : recua.situacion.desde;
  const idRecua = recua.id;

  const primerTramo = tramo(ctx, donde, siguiente);
  const pasoMil = pasoDeRecua(
    recua,
    {
      barro: ctx.estacional.barro,
      calzada: tieneCalzada(primerTramo, ctx.estado.caminos),
      pasoCasaMil: ctx.reglas.casas[jugador.casa].modificadores.pasoRecuaMil,
    },
    ctx.reglas,
  );
  const costeDe = (a: IdComarca, b: IdComarca) =>
    costeDeTramoMil(tramo(ctx, a, b), ctx.estacional, ctx.reglas, ctx.estado.caminos);

  // Sin bastimento, el primer turno se para y avisa; despues malvive: anda al paso minimo sin
  // pagar y pierde una acemila por turno, para que siempre pueda volver a casa.
  const hambrienta = recua.avisadaSinBastimento;
  const paradas = {
    comarcas: recua.paradas.map((p) => ({ comarca: p.comarca, detiene: detiene(p) })),
    siguiente: recua.siguienteParada,
  };
  const previsto = avanzar(
    recua.situacion,
    recua.ruta,
    recua.rutaCircular,
    pasoMil,
    costeDe,
    paradas,
  );
  const bastimento = bastimentoDe(previsto.andadoMil, ctx.estacional.estacion, ctx.reglas);
  const casa = enCasa(ctx, recua);
  const puedePagar =
    casa !== null
      ? disponible(jugador, 'pan') >= bastimento.pan && disponible(jugador, 'sal') >= bastimento.sal
      : recua.carga.pan >= bastimento.pan && recua.carga.sal >= bastimento.sal;

  let avance = previsto;
  if (puedePagar) {
    pagarBastimento(ctx, recua, casa !== null, bastimento.pan, bastimento.sal);
    if (hambrienta) aplicar(ctx, { tipo: 'recua-bastimento', recua: idRecua, avisada: false });
  } else if (!hambrienta) {
    aplicar(ctx, { tipo: 'recua-bastimento', recua: idRecua, avisada: true });
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'recua.sin-bastimento',
      { recua: idRecua, pan: bastimento.pan, sal: bastimento.sal },
      { jugador: recua.jugador, comarca: donde },
    );
    return;
  } else {
    if (recua.acemilas > 1) {
      aplicar(ctx, {
        tipo: 'recua-acemilas',
        recua: idRecua,
        delta: -1,
        porte: porteDe(
          recua.acemilas - 1,
          ctx.reglas.casas[jugador.casa].modificadores.porteExtra,
          ctx.reglas,
        ),
        motivo: 'sin bastimento',
      });
    }
    avance = avanzar(
      recua.situacion,
      recua.ruta,
      recua.rutaCircular,
      ctx.reglas.movimiento.pasoMinimoMil,
      costeDe,
      paradas,
    );
  }

  aplicar(ctx, {
    tipo: 'recua-mover',
    recua: idRecua,
    situacion: avance.situacion,
    ruta: avance.ruta,
    siguienteParada: avance.siguienteParada,
    enParada: avance.enParada,
  });
  contarAvance(ctx, recua, avance);
}

function pagarBastimento(
  ctx: Contexto,
  recua: Recua,
  delAlmacen: boolean,
  pan: number,
  sal: number,
): void {
  const pagos: [Recurso, number][] = [
    ['pan', pan],
    ['sal', sal],
  ];
  for (const [recurso, cantidad] of pagos) {
    if (cantidad <= 0) continue;
    if (delAlmacen) {
      aplicar(ctx, {
        tipo: 'recurso',
        jugador: recua.jugador,
        recurso,
        delta: -cantidad,
        motivo: `bastimento de ${recua.id}`,
      });
    } else {
      aplicar(ctx, {
        tipo: 'recua-carga',
        recua: recua.id,
        recurso,
        delta: -cantidad,
        motivo: 'bastimento',
      });
    }
  }
}

function contarAvance(ctx: Contexto, recua: Recua, avance: ReturnType<typeof avanzar>): void {
  const donde = { jugador: recua.jugador };
  if (avance.retrocede && avance.cerrado !== null) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'recua.vuelve-por-nieve',
      { recua: recua.id, desde: avance.cerrado.desde, hasta: avance.cerrado.hasta },
      donde,
    );
    return;
  }
  if (avance.andadoMil > 0) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'recua.avanza',
      { recua: recua.id, andadoMil: avance.andadoMil, comarcas: avance.entradas.length },
      donde,
    );
  }
  for (const comarca of avance.entradas) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'recua.entra',
      { recua: recua.id },
      { ...donde, comarca },
    );
  }
  const ultima = avance.entradas.at(-1);
  if (ultima !== undefined && avance.ruta.length === 0) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'recua.llega',
      { recua: recua.id },
      { ...donde, comarca: ultima },
    );
  }
  if (avance.cerrado !== null) {
    const camino = tramoEntre(ctx.mundo, avance.cerrado.desde, avance.cerrado.hasta);
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'recua.detenida',
      {
        recua: recua.id,
        motivo: 'puerto-cerrado',
        puerto: camino?.puertoDeMontanya ?? '',
        hasta: avance.cerrado.hasta,
      },
      { ...donde, comarca: avance.cerrado.desde },
    );
  }
}
