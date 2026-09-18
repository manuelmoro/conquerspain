// Fase 04 · Los rebanyos: formar, ruta, movimiento y pasto (T-040, docs/03-economia.md §3.8).
//
// Lo llama la fase de movimiento despues de las recuas. Un rebanyo anda como una recua pero mas
// despacio, no come pan sino pasto, y al acabar el turno se apunta lo que ha pastado donde este.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { cancelarOrden, dejarEnEspera, empezarOrden, ordenesVivas } from '../ordenes.ts';
import type { OrdenDe } from '../ordenes.ts';
import { estadoEstacionalDe } from '../reglas/calendario.ts';
import { esDesleal } from '../reglas/lealtad.ts';
import { avanzar } from '../reglas/movimiento.ts';
import { capacidadDePasto, esPastoCorrecto, repartoDePasto } from '../reglas/pastos.ts';
import type { MotivoSinPasto } from '../reglas/pastos.ts';
import {
  cabezasPerdidasPorFaltaDePasto,
  opcionesDeRutaDeRebanyo,
  pasoDeRebanyo,
  puedeEntrar,
  puertosQueVanACerrar,
  rebanyosEnOrden,
} from '../reglas/rebanyos.ts';
import {
  comarcaConocida,
  comarcasTransitables,
  costeDeTramoMil,
  rutaPorParadas,
  tramoEntre,
} from '../reglas/ruta.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { Rebanyo } from '../tipos/estado.ts';
import { LONGITUD_MAXIMA_DE_RUTA } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import { nuevoId } from '../tipos/ids.ts';
import { MIL } from '../utiles/enteros.ts';
import { idsEnOrden } from '../utiles/orden.ts';

export function movimientoDeRebanyos(ctx: Contexto): void {
  for (const orden of ordenesVivas(ctx, 'formar-rebanyo')) formarRebanyo(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'ruta')) if (orden.rebanyo !== null) fijarRuta(ctx, orden);
  for (const id of idsEnOrden(ctx.estado.rebanyos)) moverRebanyo(ctx, id);
  avisarDePuertos(ctx);
  pastar(ctx);
}

// ——— Formar y dar ruta ————————————————————————————————————————————————————

/** «Rebano de Vinuesa» y, si ya lo hay, «Rebano de Vinuesa 2»: el primer nombre libre. */
function nombreDeRebanyo(ctx: Contexto, jugador: string, comarca: IdComarca): string {
  const base = `Rebaño de ${ctx.mundo.comarcas[comarca]?.nombre ?? comarca}`.slice(0, 55);
  const usados = new Set(
    Object.values(ctx.estado.rebanyos)
      .filter((r) => r.jugador === jugador)
      .map((r) => r.nombre),
  );
  let numero = 1;
  const nombre = (n: number): string => (n === 1 ? base : `${base} ${String(n)}`);
  while (usados.has(nombre(numero))) numero += 1;
  return nombre(numero);
}

function formarRebanyo(ctx: Contexto, orden: OrdenDe<'formar-rebanyo'>): void {
  const g = ctx.reglas.ganaderia;
  const comarca = ctx.estado.comarcas[orden.comarca];
  if (comarca === undefined || comarca.duenyo !== orden.jugador) {
    cancelarOrden(ctx, orden, 'comarca-ajena');
    return;
  }
  if (orden.cabezas !== g.cabezasPorRebanyo) {
    cancelarOrden(ctx, orden, 'cabezas-invalidas');
    return;
  }
  if (esDesleal(comarca, ctx.reglas)) {
    dejarEnEspera(ctx, orden, 'comarca-desleal');
    return;
  }
  // Los pastores se van con el ganado: la comarca no se queda vacia por formar un rebanyo.
  if (comarca.poblacion <= g.vecinosPorRebanyo) {
    dejarEnEspera(ctx, orden, 'faltan-vecinos');
    return;
  }

  empezarOrden(ctx, orden, 'terminada');
  const id = nuevoId('rebanyo', ctx.estado.siguienteId);
  aplicar(ctx, { tipo: 'siguiente-id' });
  aplicar(ctx, {
    tipo: 'poblacion',
    comarca: comarca.id,
    delta: -g.vecinosPorRebanyo,
    motivo: `salen con el rebanyo ${id}`,
  });
  aplicar(ctx, {
    tipo: 'rebanyo-alta',
    rebanyo: {
      id,
      jugador: orden.jugador,
      nombre: nombreDeRebanyo(ctx, orden.jugador, comarca.id),
      situacion: { donde: 'comarca', comarca: comarca.id },
      ruta: [],
      cabezas: g.cabezasPorRebanyo,
      pastoDelAnyoMil: 0,
      turnosSinPasto: 0,
    },
  });
}

function fijarRuta(ctx: Contexto, orden: OrdenDe<'ruta'>): void {
  const rebanyo = orden.rebanyo === null ? undefined : ctx.estado.rebanyos[orden.rebanyo];
  const jugador = ctx.estado.jugadores[orden.jugador];
  if (rebanyo?.jugador !== orden.jugador || jugador === undefined) {
    cancelarOrden(ctx, orden, 'rebanyo-desconocido');
    return;
  }
  // La ida y la vuelta de la trashumancia son dos ordenes al anyo, no un circuito que no para.
  if (orden.circular) {
    cancelarOrden(ctx, orden, 'ruta-circular-de-rebanyo');
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

  const transitables = comarcasTransitables(jugador);
  for (const [id, comarca] of Object.entries(ctx.estado.comarcas)) {
    if (comarca.duenyo === orden.jugador) transitables.add(id);
  }
  const salida =
    rebanyo.situacion.donde === 'comarca' ? rebanyo.situacion.comarca : rebanyo.situacion.hasta;
  const ruta = rutaPorParadas(
    salida,
    paradas,
    false,
    ctx.mundo,
    ctx.estacional,
    transitables,
    ctx.reglas,
    ctx.estado.caminos,
    opcionesDeRutaDeRebanyo(ctx.estado.comarcas, jugador, ctx.reglas),
  );
  if (ruta === null) {
    dejarEnEspera(ctx, orden, 'sin-ruta-conocida');
    return;
  }
  // Si va de camino, primero termina el tramo.
  const comarcas: IdComarca[] =
    rebanyo.situacion.donde === 'comarca'
      ? [...ruta.comarcas]
      : [rebanyo.situacion.hasta, ...ruta.comarcas];
  if (comarcas.length > LONGITUD_MAXIMA_DE_RUTA) {
    cancelarOrden(ctx, orden, 'ruta-demasiado-larga');
    return;
  }
  aplicar(ctx, {
    tipo: 'rebanyo-mover',
    rebanyo: rebanyo.id,
    situacion: rebanyo.situacion,
    ruta: comarcas,
  });
  empezarOrden(ctx, orden, 'terminada');
}

// ——— Movimiento ———————————————————————————————————————————————————————————

function moverRebanyo(ctx: Contexto, id: string): void {
  const rebanyo = ctx.estado.rebanyos[id];
  const jugador = rebanyo === undefined ? undefined : ctx.estado.jugadores[rebanyo.jugador];
  const siguiente = rebanyo?.ruta[0];
  if (rebanyo === undefined || jugador === undefined || siguiente === undefined) return;
  const donde =
    rebanyo.situacion.donde === 'comarca' ? rebanyo.situacion.comarca : rebanyo.situacion.desde;
  const primero = tramoEntre(ctx.mundo, donde, siguiente);
  const pasoMil = pasoDeRebanyo(
    (primero?.canyada ?? null) !== null,
    ctx.estacional.barro,
    ctx.reglas,
  );

  // Un tramo que no existe, que la nieve o una riada cierran o que cruza tierra ajena sin permiso
  // esta cerrado para el rebanyo.
  const costeDe = (a: IdComarca, b: IdComarca) => {
    const camino = tramoEntre(ctx.mundo, a, b);
    if (camino === undefined || !puedeEntrar(camino, ctx.estado.comarcas[b], jugador, ctx.reglas)) {
      return 'cerrado' as const;
    }
    return costeDeTramoMil(camino, ctx.estacional, ctx.reglas, ctx.estado.caminos);
  };
  const avance = avanzar(rebanyo.situacion, rebanyo.ruta, false, pasoMil, costeDe);
  aplicar(ctx, {
    tipo: 'rebanyo-mover',
    rebanyo: rebanyo.id,
    situacion: avance.situacion,
    ruta: avance.ruta,
  });

  const donde2 = { jugador: rebanyo.jugador };
  if (avance.retrocede && avance.cerrado !== null) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'rebanyo.vuelve-por-nieve',
      { rebanyo: rebanyo.id, desde: avance.cerrado.desde, hasta: avance.cerrado.hasta },
      donde2,
    );
    return;
  }
  const ultima = avance.entradas.at(-1);
  if (ultima !== undefined && avance.ruta.length === 0) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'rebanyo.llega',
      { rebanyo: rebanyo.id },
      {
        ...donde2,
        comarca: ultima,
      },
    );
  }
  if (avance.cerrado !== null) {
    const camino = tramoEntre(ctx.mundo, avance.cerrado.desde, avance.cerrado.hasta);
    const ajena =
      camino !== undefined &&
      !puedeEntrar(camino, ctx.estado.comarcas[avance.cerrado.hasta], jugador, ctx.reglas);
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'rebanyo.detenido',
      {
        rebanyo: rebanyo.id,
        motivo: ajena ? 'tierra-ajena' : 'camino-cerrado',
        puerto: camino?.puertoDeMontanya ?? '',
        hasta: avance.cerrado.hasta,
      },
      { ...donde2, comarca: avance.cerrado.desde },
    );
  }
}

/** Avisa a cada rebanyo con ruta de los puertos que cierran dentro de exactamente dos turnos. */
function avisarDePuertos(ctx: Contexto): void {
  const aviso = ctx.reglas.ganaderia.avisoDePuertoTurnos;
  const conRuta = rebanyosEnOrden(ctx.estado.rebanyos).filter((r) => r.ruta.length > 0);
  if (conRuta.length === 0) return;
  const cierraEn = estadoEstacionalDe(
    ctx.turno + aviso,
    ctx.mundo,
    ctx.reglas,
    ctx.estado.acontecimientos,
  );
  const abiertoEn = estadoEstacionalDe(
    ctx.turno + aviso - 1,
    ctx.mundo,
    ctx.reglas,
    ctx.estado.acontecimientos,
  );
  for (const rebanyo of conRuta) {
    const puertos = puertosQueVanACerrar(
      rebanyo,
      ctx.mundo,
      cierraEn,
      abiertoEn,
      ctx.reglas,
      ctx.estado.caminos,
    );
    for (const puerto of puertos) {
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'rebanyo.aviso-puerto',
        { rebanyo: rebanyo.id, puerto, turnos: aviso },
        { jugador: rebanyo.jugador },
      );
    }
  }
}

// ——— Pasto ————————————————————————————————————————————————————————————————

/**
 * Lo que pasta cada rebanyo donde ha acabado el turno: entero si va por una canyada o si su
 * comarca es pasto correcto y hay hierba para todos, a medias si no la hay y nada si no. Ese pasto
 * decide la calidad de la lana, las cabezas que pierde y el estiercol de la comarca donde inverna.
 */
function pastar(ctx: Contexto): void {
  const g = ctx.reglas.ganaderia;
  const rebanyos = rebanyosEnOrden(ctx.estado.rebanyos);

  const porComarca = new Map<IdComarca, Rebanyo[]>();
  for (const rebanyo of rebanyos) {
    if (rebanyo.situacion.donde !== 'comarca') continue;
    const lista = porComarca.get(rebanyo.situacion.comarca) ?? [];
    lista.push(rebanyo);
    porComarca.set(rebanyo.situacion.comarca, lista);
  }
  const repartos = new Map<IdComarca, Map<string, number>>();
  const correctas = new Set<IdComarca>();
  for (const [idComarca, lista] of porComarca) {
    const comarca = ctx.estado.comarcas[idComarca];
    const geografia = ctx.mundo.comarcas[idComarca];
    if (comarca === undefined || geografia === undefined) continue;
    if (!esPastoCorrecto(comarca, geografia, ctx.estacional, ctx.reglas)) continue;
    correctas.add(idComarca);
    repartos.set(idComarca, repartoDePasto(capacidadDePasto(comarca, ctx.reglas), lista));
  }

  const abono = new Map<IdComarca, number>();
  for (const rebanyo of rebanyos) {
    let pastoMil = 0;
    let motivo: MotivoSinPasto | null = null;
    if (rebanyo.situacion.donde === 'camino') {
      // El ganado come andando solo por una canyada.
      const camino = tramoEntre(ctx.mundo, rebanyo.situacion.desde, rebanyo.situacion.hasta);
      if ((camino?.canyada ?? null) !== null) pastoMil = MIL;
      else motivo = 'camino';
    } else {
      const idComarca = rebanyo.situacion.comarca;
      const comarca = ctx.estado.comarcas[idComarca];
      // Un rebanyo que sigue por una canyada pasta aunque el turno acabe en una comarca del camino.
      const siguiente = rebanyo.ruta[0];
      const porCanyada =
        siguiente !== undefined &&
        (tramoEntre(ctx.mundo, idComarca, siguiente)?.canyada ?? null) !== null;
      if (porCanyada) {
        pastoMil = MIL;
      } else if (correctas.has(idComarca)) {
        pastoMil = repartos.get(idComarca)?.get(rebanyo.id) ?? 0;
        if (pastoMil < MIL) motivo = 'saturado';
      } else {
        motivo = (comarca?.potenciales.pasto ?? 0) < g.pastoMinimo ? 'sin-pasto' : 'estacion';
      }
      if (pastoMil > 0 && comarca?.duenyo === rebanyo.jugador && ctx.estacional.pastosDeInvierno) {
        abono.set(idComarca, (abono.get(idComarca) ?? 0) + 1);
      }
    }
    if (motivo !== null) {
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'rebanyo.sin-pasto',
        { rebanyo: rebanyo.id, motivo, pastoMil },
        { jugador: rebanyo.jugador },
      );
    }
    contarPasto(ctx, rebanyo, pastoMil);
  }

  for (const [idComarca, turnos] of abono) {
    const comarca = ctx.estado.comarcas[idComarca];
    if (comarca === undefined) continue;
    aplicar(ctx, {
      tipo: 'abono',
      comarca: idComarca,
      turnosDeAbono: comarca.turnosDeAbono + turnos,
      estiercol: comarca.estiercol,
    });
  }
}

/** Apunta el pasto del turno y, con dos turnos seguidos sin nada, pierde cabezas. */
function contarPasto(ctx: Contexto, rebanyo: Rebanyo, pastoMil: number): void {
  const g = ctx.reglas.ganaderia;
  const sinPasto = pastoMil === 0 ? rebanyo.turnosSinPasto + 1 : 0;
  aplicar(ctx, {
    tipo: 'rebanyo-cuentas',
    rebanyo: rebanyo.id,
    pastoDelAnyoMil: rebanyo.pastoDelAnyoMil + pastoMil,
    turnosSinPasto: sinPasto,
  });
  if (sinPasto < g.turnosSinPastoParaPerder) return;
  const perdidas = cabezasPerdidasPorFaltaDePasto(rebanyo.cabezas, ctx.reglas);
  aplicar(ctx, {
    tipo: 'rebanyo-cabezas',
    rebanyo: rebanyo.id,
    delta: -perdidas,
    motivo: 'sin pasto',
  });
  if (rebanyo.cabezas - perdidas <= 0) aplicar(ctx, { tipo: 'rebanyo-baja', rebanyo: rebanyo.id });
}
