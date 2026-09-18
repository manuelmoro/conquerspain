// Fase 05 · Cometidos de las recuas (T-034, docs/03-economia.md §3.7.3).
//
// Lo que hace cada recua donde esta: atender la parada en la que se ha detenido y, si ya no le
// queda camino, cumplir su cometido. Todo se decide sobre una foto del estado tomada al empezar la
// fase y se aplica en orden de identificador de recua; las fundaciones de puebla se reunen y se
// resuelven al final, todas a la vez, por la regla de influencia y nunca por quien se proceso antes.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { cargarDelAlmacen, descargarEnAlmacen, todaLaCarga } from '../porteo.ts';
import { datosConocidosDe, hallazgoDe, vecinasPorOir } from '../reglas/explorar.ts';
import type { CandidatoAPuebla } from '../reglas/poblar.ts';
import { ganadorDePuebla, impedimentoDePuebla, vecinosQueSeQuedan } from '../reglas/poblar.ts';
import { bastimentoDePresencia } from '../reglas/presencia.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoPartida, Recua } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import { clonar } from '../utiles/clonar.ts';
import { multiplicarFactores } from '../utiles/enteros.ts';
import { comparar, idsEnOrden } from '../utiles/orden.ts';

interface Fundacion extends CandidatoAPuebla {
  readonly recua: Recua;
}

export function faseCometidos(ctx: Contexto): void {
  const foto: EstadoPartida = clonar(ctx.estado);
  const fundaciones = new Map<IdComarca, Fundacion[]>();

  for (const id of idsEnOrden(foto.recuas)) {
    const recua = foto.recuas[id];
    if (recua === undefined) continue;
    atenderParada(ctx, foto, recua);
    const quieta = recua.situacion.donde === 'comarca' && recua.ruta.length === 0;
    if (!quieta || recua.cometido === null) {
      if (recua.turnosDeCometido > 0) {
        aplicar(ctx, { tipo: 'recua-turnos-cometido', recua: recua.id, turnos: 0 });
      }
      continue;
    }
    const donde = recua.situacion.comarca;
    switch (recua.cometido) {
      case 'explorar':
        explorar(ctx, foto, recua, donde);
        break;
      case 'portear':
        portear(ctx, foto, recua, donde);
        break;
      case 'poblar':
        poblar(ctx, foto, recua, donde, fundaciones);
        break;
      case 'presencia':
        estarPresente(ctx, foto, recua, donde);
        break;
      case 'disolver':
        disolver(ctx, foto, recua, donde);
        break;
      case 'tratar':
        // Se cumple en la fase de mercado (T-037).
        break;
    }
  }

  for (const comarca of [...fundaciones.keys()].sort(comparar)) {
    resolverFundacion(ctx, comarca, fundaciones.get(comarca) ?? []);
  }
}

function esDe(foto: EstadoPartida, comarca: IdComarca, jugador: string): boolean {
  return foto.comarcas[comarca]?.duenyo === jugador;
}

function sinEfecto(ctx: Contexto, recua: Recua, motivo: string, termina: boolean): void {
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'cometido.sin-efecto',
    { recua: recua.id, cometido: recua.cometido ?? '', motivo },
    { jugador: recua.jugador },
  );
  if (termina) aplicar(ctx, { tipo: 'recua-cometido', recua: recua.id, cometido: null });
}

/** Cargar y descargar en la parada donde se ha detenido; vender y comprar son del mercado. */
function atenderParada(ctx: Contexto, foto: EstadoPartida, recua: Recua): void {
  if (recua.enParada === null || recua.situacion.donde !== 'comarca') return;
  const parada = recua.paradas[recua.enParada];
  const comarca = recua.situacion.comarca;
  if (parada === undefined || !esDe(foto, comarca, recua.jugador)) return;
  descargarEnAlmacen(ctx, recua.id, parada.descargar);
  cargarDelAlmacen(ctx, recua.id, parada.cargar, comarca);
}

function explorar(ctx: Contexto, foto: EstadoPartida, recua: Recua, donde: IdComarca): void {
  const jugador = foto.jugadores[recua.jugador];
  const comarca = foto.comarcas[donde];
  const geografia = ctx.mundo.comarcas[donde];
  if (jugador === undefined || comarca === undefined || geografia === undefined) return;
  const antes = jugador.conocimiento[donde]?.nivel ?? 'desconocida';
  if (antes === 'propia') {
    sinEfecto(ctx, recua, 'comarca-propia', true);
    return;
  }

  aplicar(ctx, {
    tipo: 'conocimiento',
    jugador: recua.jugador,
    comarca: donde,
    conocimiento: {
      nivel: 'explorada',
      turnoUltimaNoticia: ctx.turno,
      datos: datosConocidosDe(comarca, geografia),
    },
  });
  const nueva = antes !== 'explorada';
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'recua.explora',
    { recua: recua.id, nueva: nueva ? 1 : 0 },
    { jugador: recua.jugador, comarca: donde },
  );
  if (nueva) {
    for (const vecina of vecinasPorOir(donde, ctx.mundo, jugador)) {
      aplicar(ctx, {
        tipo: 'conocimiento',
        jugador: recua.jugador,
        comarca: vecina,
        conocimiento: { nivel: 'oida', turnoUltimaNoticia: ctx.turno, datos: null },
      });
    }
    aplicarHallazgo(ctx, foto, recua, donde);
  }
  aplicar(ctx, { tipo: 'recua-cometido', recua: recua.id, cometido: null });
}

function aplicarHallazgo(ctx: Contexto, foto: EstadoPartida, recua: Recua, donde: IdComarca): void {
  const hallazgo = hallazgoDe(
    foto,
    ctx.turno,
    recua.id,
    donde,
    recua.jugador,
    ctx.mundo,
    ctx.reglas,
  );
  if (hallazgo.tipo === 'nada') return;
  if (hallazgo.tipo === 'localidad') {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'recua.hallazgo',
      { recua: recua.id, tipo: 'localidad', nombre: hallazgo.nombre },
      { jugador: recua.jugador, comarca: donde },
    );
    return;
  }
  const ajena = foto.comarcas[hallazgo.comarca];
  const geografia = ctx.mundo.comarcas[hallazgo.comarca];
  const actual = foto.jugadores[recua.jugador]?.conocimiento[hallazgo.comarca];
  if (ajena === undefined || geografia === undefined) return;
  const nivel = actual === undefined || actual.nivel === 'desconocida' ? 'oida' : actual.nivel;
  aplicar(ctx, {
    tipo: 'conocimiento',
    jugador: recua.jugador,
    comarca: hallazgo.comarca,
    conocimiento: {
      nivel,
      turnoUltimaNoticia: ctx.turno,
      datos: datosConocidosDe(ajena, geografia),
    },
  });
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'recua.hallazgo',
    { recua: recua.id, tipo: 'noticias', de: hallazgo.de, sobre: hallazgo.comarca },
    { jugador: recua.jugador, comarca: donde },
  );
}

/** Portear: al llegar a una comarca propia, la recua descarga todo en el almacen. */
function portear(ctx: Contexto, foto: EstadoPartida, recua: Recua, donde: IdComarca): void {
  if (!esDe(foto, donde, recua.jugador)) {
    sinEfecto(ctx, recua, 'comarca-ajena', true);
    return;
  }
  descargarEnAlmacen(ctx, recua.id, todaLaCarga(ctx, recua.id));
  aplicar(ctx, { tipo: 'recua-cometido', recua: recua.id, cometido: null });
}

function poblar(
  ctx: Contexto,
  foto: EstadoPartida,
  recua: Recua,
  donde: IdComarca,
  fundaciones: Map<IdComarca, Fundacion[]>,
): void {
  const comarca = foto.comarcas[donde];
  if (comarca === undefined) return;

  if (comarca.duenyo === recua.jugador) {
    // Se mide contra la comarca de ahora: si dos recuas pueblan la misma, la segunda ve lo que dejo
    // la primera y nunca se pasa de la capacidad.
    const ahora = ctx.estado.comarcas[donde] ?? comarca;
    const seQuedan = vecinosQueSeQuedan(ahora, recua, ctx.reglas);
    if (seQuedan > 0) {
      aplicar(ctx, { tipo: 'recua-vecinos', recua: recua.id, delta: -seQuedan, motivo: 'poblar' });
      aplicar(ctx, {
        tipo: 'poblacion',
        comarca: donde,
        delta: seQuedan,
        motivo: `llegan con ${recua.id}`,
      });
    }
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'recua.puebla',
      { recua: recua.id, vecinos: seQuedan, sobran: recua.vecinos - seQuedan },
      { jugador: recua.jugador, comarca: donde },
    );
    aplicar(ctx, { tipo: 'recua-cometido', recua: recua.id, cometido: null });
    return;
  }

  const impedimento = impedimentoDePuebla(comarca, recua, ctx.reglas);
  if (impedimento !== null) {
    if (recua.turnosDeCometido > 0) {
      aplicar(ctx, { tipo: 'recua-turnos-cometido', recua: recua.id, turnos: 0 });
    }
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'recua.puebla-imposible',
      { recua: recua.id, motivo: impedimento },
      { jugador: recua.jugador, comarca: donde },
    );
    return;
  }

  const turnos = recua.turnosDeCometido + 1;
  if (turnos < ctx.reglas.cometidos.turnosParaPuebla) {
    aplicar(ctx, { tipo: 'recua-turnos-cometido', recua: recua.id, turnos });
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'recua.puebla-en-marcha',
      { recua: recua.id, turnos, necesarios: ctx.reglas.cometidos.turnosParaPuebla },
      { jugador: recua.jugador, comarca: donde },
    );
    return;
  }
  const lista = fundaciones.get(donde) ?? [];
  lista.push({
    recua,
    jugador: recua.jugador,
    influencia: comarca.influencias[recua.jugador] ?? 0,
  });
  fundaciones.set(donde, lista);
}

/**
 * La comarca pasa a quien gana la fundacion, con la gente que ha traido, lealtad de puebla y
 * carta puebla. Los demas conservan sus vecinos y reciben aviso.
 */
function resolverFundacion(
  ctx: Contexto,
  donde: IdComarca,
  candidatas: readonly Fundacion[],
): void {
  // Varias recuas del mismo jugador cuentan como una sola candidatura: la de identificador menor.
  const porJugador = new Map<string, Fundacion>();
  for (const candidata of candidatas) {
    if (!porJugador.has(candidata.jugador)) porJugador.set(candidata.jugador, candidata);
  }
  const ganador = ganadorDePuebla([...porJugador.values()], ctx.semilla, ctx.turno, donde);
  const comarca = ctx.estado.comarcas[donde];
  if (ganador === null || comarca === undefined) return;

  for (const candidata of candidatas) {
    const { recua } = candidata;
    const funda = candidata === porJugador.get(ganador);
    if (!funda) {
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.puebla-perdida',
        { recua: recua.id, ganador },
        { jugador: recua.jugador, comarca: donde },
      );
      aplicar(ctx, { tipo: 'recua-turnos-cometido', recua: recua.id, turnos: 0 });
      aplicar(ctx, { tipo: 'recua-cometido', recua: recua.id, cometido: null });
      continue;
    }
    const vecinos = recua.vecinos;
    aplicar(ctx, { tipo: 'duenyo', comarca: donde, jugador: recua.jugador });
    // La puebla empieza con la gente que llega (docs/03 §3.7.3): es una fundacion, no una conquista.
    aplicar(ctx, {
      tipo: 'poblacion',
      comarca: donde,
      delta: vecinos - comarca.poblacion,
      motivo: `puebla de ${recua.id}`,
    });
    aplicar(ctx, {
      tipo: 'lealtad',
      comarca: donde,
      delta: ctx.reglas.cometidos.lealtadDePuebla - comarca.lealtad,
      motivo: 'carta puebla',
    });
    aplicar(ctx, { tipo: 'fuero', comarca: donde, fuero: 'carta puebla' });
    aplicar(ctx, {
      tipo: 'conocimiento',
      jugador: recua.jugador,
      comarca: donde,
      conocimiento: { nivel: 'propia', turnoUltimaNoticia: ctx.turno, datos: null },
    });
    aplicar(ctx, {
      tipo: 'recua-vecinos',
      recua: recua.id,
      delta: -vecinos,
      motivo: 'fundan puebla',
    });
    aplicar(ctx, { tipo: 'recua-turnos-cometido', recua: recua.id, turnos: 0 });
    aplicar(ctx, { tipo: 'recua-cometido', recua: recua.id, cometido: null });
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'recua.funda-puebla',
      { recua: recua.id, vecinos },
      { jugador: recua.jugador, comarca: donde },
    );
  }
}

/** Estar presente en una comarca neutral cuesta bastimento; sin el, no cuenta ese turno. */
function estarPresente(ctx: Contexto, foto: EstadoPartida, recua: Recua, donde: IdComarca): void {
  if (foto.comarcas[donde]?.duenyo !== null) {
    sinEfecto(ctx, recua, 'comarca-con-duenyo', false);
    return;
  }
  const bastimento = bastimentoDePresencia(ctx.estacional.estacion, ctx.reglas);
  const puede = recua.carga.pan >= bastimento.pan && recua.carga.sal >= bastimento.sal;
  if (!puede) {
    if (!recua.avisadaSinBastimento) {
      aplicar(ctx, { tipo: 'recua-bastimento', recua: recua.id, avisada: true });
    }
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'recua.sin-bastimento',
      { recua: recua.id, pan: bastimento.pan, sal: bastimento.sal },
      { jugador: recua.jugador, comarca: donde },
    );
    return;
  }
  for (const [recurso, cantidad] of [
    ['pan', bastimento.pan],
    ['sal', bastimento.sal],
  ] as const) {
    if (cantidad > 0) {
      aplicar(ctx, {
        tipo: 'recua-carga',
        recua: recua.id,
        recurso,
        delta: -cantidad,
        motivo: 'bastimento',
      });
    }
  }
  if (recua.avisadaSinBastimento) {
    aplicar(ctx, { tipo: 'recua-bastimento', recua: recua.id, avisada: false });
  }
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'recua.presente',
    { recua: recua.id },
    { jugador: recua.jugador, comarca: donde },
  );
}

/**
 * Disolver en una comarca propia: la gente y los arrieros vuelven a ella, la carga al almacen y se
 * recupera parte de los maravedis de formarla. Fuera de casa, la recua espera a volver.
 */
function disolver(ctx: Contexto, foto: EstadoPartida, recua: Recua, donde: IdComarca): void {
  const jugador = foto.jugadores[recua.jugador];
  if (jugador === undefined) return;
  if (!esDe(foto, donde, recua.jugador)) {
    sinEfecto(ctx, recua, 'fuera-de-casa', false);
    return;
  }
  descargarEnAlmacen(ctx, recua.id, todaLaCarga(ctx, recua.id));
  if (recua.vecinos > 0) {
    aplicar(ctx, {
      tipo: 'recua-vecinos',
      recua: recua.id,
      delta: -recua.vecinos,
      motivo: 'disolver',
    });
  }
  aplicar(ctx, {
    tipo: 'poblacion',
    comarca: donde,
    delta: recua.vecinos + ctx.reglas.movimiento.arrierosPorRecua,
    motivo: `vuelven de ${recua.id}`,
  });
  const devolucion = multiplicarFactores(ctx.reglas.movimiento.costeFormarRecua.maravedis, [
    ctx.reglas.casas[jugador.casa].modificadores.costeRecuaMil,
    ctx.reglas.cometidos.devolucionAlDisolverMil,
  ]);
  if (devolucion > 0) {
    aplicar(ctx, {
      tipo: 'recurso',
      jugador: recua.jugador,
      recurso: 'maravedis',
      delta: devolucion,
      motivo: `se disuelve ${recua.id}`,
    });
  }
  aplicar(ctx, { tipo: 'recua-baja', recua: recua.id });
}
