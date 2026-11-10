// Fase 08 · Influencia e incorporacion de comarcas (T-038, docs/06-competicion.md §6.2).
//
// Tres pasos que la fase de territorio llama despues de la lealtad y por este orden: los regalos
// al concejo, la influencia de cada comarca neutral y las incorporaciones, que se resuelven con la
// influencia ya actualizada. La influencia se calcula sobre una foto del estado, asi que ni el orden
// de las comarcas ni el de los jugadores cambian nada.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import {
  cancelarOrden,
  dejarEnEspera,
  empezarOrden,
  ordenesEnCurso,
  ordenesVivas,
} from '../ordenes.ts';
import type { OrdenDe } from '../ordenes.ts';
import { modificadoresDelJugador } from '../reglas/casas/index.ts';
import {
  actividadDeMercado,
  fuentesDeInfluencia,
  hayOtraCasaPresente,
} from '../reglas/influencia.ts';
import type { CandidatoAIncorporar } from '../reglas/incorporar.ts';
import { ganadorDeIncorporacion, impedimentoDeIncorporar } from '../reglas/incorporar.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoPartida } from '../tipos/estado.ts';
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import { clonar } from '../utiles/clonar.ts';
import { MIL, multiplicarFactores } from '../utiles/enteros.ts';
import { comparar, idsEnOrden } from '../utiles/orden.ts';

// ——— Regalos ————————————————————————————————————————————————————————————————

/** Un regalo al concejo: +5 de influencia por 50 mrs, una vez cada cuatro turnos por comarca. */
export function regalos(ctx: Contexto): void {
  for (const orden of ordenesVivas(ctx, 'regalo')) regalo(ctx, orden);
}

function regalo(ctx: Contexto, orden: OrdenDe<'regalo'>): void {
  const comarca = ctx.estado.comarcas[orden.comarca];
  const jugador = ctx.estado.jugadores[orden.jugador];
  const conoce = (jugador?.conocimiento[orden.comarca]?.nivel ?? 'desconocida') !== 'desconocida';
  if (comarca === undefined || jugador === undefined || !conoce) {
    cancelarOrden(ctx, orden, 'comarca-desconocida');
    return;
  }
  if (comarca.duenyo !== null) {
    cancelarOrden(ctx, orden, 'comarca-con-duenyo');
    return;
  }
  const t = ctx.reglas.influencia;
  const ultimo = comarca.ultimoRegalo[orden.jugador];
  if (ultimo !== undefined && ctx.turno - ultimo < t.turnosEntreRegalos) {
    dejarEnEspera(ctx, orden, 'regalo-reciente');
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  // Con otra casa presente, el concejo dividido tambien se hace de rogar con los regalos (T-101).
  const dividido = hayOtraCasaPresente(ctx.estado, comarca, orden.jugador)
    ? t.concejoDivididoMil
    : MIL;
  const delta = multiplicarFactores(t.porRegalo, [
    modificadoresDelJugador(jugador, ctx.reglas).influenciaMil,
    dividido,
  ]);
  aplicar(ctx, {
    tipo: 'influencia',
    comarca: comarca.id,
    jugador: orden.jugador,
    delta,
    motivo: 'regalo al concejo',
  });
  aplicar(ctx, { tipo: 'regalo', comarca: comarca.id, jugador: orden.jugador, influencia: delta });
}

// ——— Influencia de cada turno ————————————————————————————————————————————————

/**
 * Para cada comarca neutral y cada jugador que la conoce: las fuentes del turno menos el desgaste,
 * recortado a 0..100 una sola vez. Cada cambio deja un suceso con el desglose.
 */
export function influenciaDelTurno(ctx: Contexto): void {
  const foto: EstadoPartida = clonar(ctx.estado);
  const actividad = actividadDeMercado(ctx.sucesos);
  for (const idComarca of idsEnOrden(foto.comarcas)) {
    const comarca = foto.comarcas[idComarca];
    if (comarca === undefined || comarca.duenyo !== null) continue;
    for (const idJugador of idsEnOrden(foto.jugadores)) {
      const jugador = foto.jugadores[idJugador];
      const nivel = jugador?.conocimiento[idComarca]?.nivel ?? 'desconocida';
      if (jugador === undefined || nivel === 'desconocida') continue;

      const fuentes = fuentesDeInfluencia(
        { comarca, jugador, actividad },
        foto,
        ctx.mundo,
        ctx.reglas,
      );
      const antes = comarca.influencias[idJugador] ?? 0;
      const seguida = comarca.presenciaSeguida[idJugador] ?? 0;
      if (fuentes.presente) {
        // Empieza a cortejar: los que tienen la comarca cerca se enteran (T-101).
        if (seguida === 0) {
          for (const otro of quienesLaTienenCerca(foto, ctx.mundo, comarca.id, jugador.id)) {
            registrarSuceso(
              ctx.sucesos,
              ctx.fase,
              'influencia.cortejo',
              { de: jugador.id },
              { jugador: otro, comarca: comarca.id },
            );
          }
        }
        aplicar(ctx, {
          tipo: 'presencia-seguida',
          comarca: comarca.id,
          jugador: jugador.id,
          turnos: seguida + 1,
        });
      } else if (seguida > 0) {
        aplicar(ctx, {
          tipo: 'presencia-seguida',
          comarca: comarca.id,
          jugador: jugador.id,
          turnos: 0,
        });
      }
      if (fuentes.neto === 0 || (antes === 0 && fuentes.neto < 0)) continue;

      aplicar(ctx, {
        tipo: 'influencia',
        comarca: comarca.id,
        jugador: jugador.id,
        delta: fuentes.neto,
        motivo: 'fuentes del turno',
      });
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'influencia.fuentes',
        {
          presencia: fuentes.presencia,
          vecinas: fuentes.vecinas,
          mercado: fuentes.mercado,
          comercio: fuentes.comercio,
          monasterio: fuentes.monasterio,
          camino: fuentes.camino,
          concejoDividido: fuentes.concejoDividido,
          desgaste: fuentes.desgaste,
          escasez: fuentes.escasez,
          neto: fuentes.neto,
          total: ctx.estado.comarcas[idComarca]?.influencias[idJugador] ?? 0,
        },
        { comarca: comarca.id, jugador: jugador.id },
      );
    }
  }
}

// ——— Incorporaciones ————————————————————————————————————————————————————————

interface Candidata {
  readonly orden: OrdenDe<'incorporar'>;
  readonly candidato: CandidatoAIncorporar;
}

export function incorporaciones(ctx: Contexto): void {
  for (const orden of ordenesVivas(ctx, 'incorporar')) empezar(ctx, orden);

  const terminan = new Map<IdComarca, Candidata[]>();
  for (const orden of ordenesEnCurso(ctx, 'incorporar')) {
    const candidata = avanzar(ctx, orden);
    if (candidata === null) continue;
    terminan.set(orden.comarca, [...(terminan.get(orden.comarca) ?? []), candidata]);
  }
  for (const comarca of [...terminan.keys()].sort(comparar)) {
    resolverDisputa(ctx, comarca, terminan.get(comarca) ?? []);
  }
}

/** Comprueba los requisitos; si se cumplen la orden paga y arranca, y si no, espera o se cancela. */
function empezar(ctx: Contexto, orden: OrdenDe<'incorporar'>): void {
  const comarca = ctx.estado.comarcas[orden.comarca];
  const jugador = ctx.estado.jugadores[orden.jugador];
  if (comarca === undefined || jugador === undefined) {
    cancelarOrden(ctx, orden, 'comarca-desconocida');
    return;
  }
  const repetida = ctx.estado.ordenes.some(
    (otra) =>
      otra.tipo === 'incorporar' &&
      otra.id !== orden.id &&
      otra.jugador === orden.jugador &&
      otra.comarca === orden.comarca &&
      otra.estado === 'en curso',
  );
  if (repetida) {
    cancelarOrden(ctx, orden, 'orden-duplicada');
    return;
  }
  const impedimento = impedimentoDeIncorporar(ctx.estado, comarca, jugador, ctx.mundo, ctx.reglas);
  if (impedimento === 'comarca-con-duenyo') {
    cancelarOrden(ctx, orden, impedimento);
    return;
  }
  if (impedimento !== null) {
    dejarEnEspera(ctx, orden, impedimento);
    return;
  }
  empezarOrden(ctx, orden, 'en curso');
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'incorporar.empieza',
    { turnos: orden.turnosTotales },
    { jugador: orden.jugador, comarca: comarca.id },
  );
  // Los que la tienen cerca se enteran: el concejo lo anuncia (T-101).
  for (const otro of quienesLaTienenCerca(ctx.estado, ctx.mundo, comarca.id, orden.jugador)) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'incorporar.de-otro',
      { de: orden.jugador, turnos: orden.turnosTotales },
      { jugador: otro, comarca: comarca.id },
    );
  }
}

/**
 * Las otras casas que tienen una comarca neutral a la vista (T-101): con gente propia alli o con una
 * comarca suya al lado. Son las que se enteran de que alguien la corteja o la incorpora.
 */
function quienesLaTienenCerca(
  estado: EstadoPartida,
  mundo: Mundo,
  comarca: IdComarca,
  salvo: string,
): IdJugador[] {
  const vecinas = mundo.vecinos[comarca] ?? [];
  return Object.values(estado.jugadores)
    .map((j) => j.id)
    .filter((id) => {
      if (id === salvo) return false;
      const conGente = Object.values(estado.recuas).some(
        (r) =>
          r.jugador === id && r.situacion.donde === 'comarca' && r.situacion.comarca === comarca,
      );
      return conGente || vecinas.some((v) => estado.comarcas[v]?.duenyo === id);
    })
    .sort(comparar);
}

/** Suma un turno a una orden en curso; si le llega el ultimo, entra en la disputa de su comarca. */
function avanzar(ctx: Contexto, orden: OrdenDe<'incorporar'>): Candidata | null {
  const comarca = ctx.estado.comarcas[orden.comarca];
  if (comarca === undefined || comarca.duenyo !== null) {
    devolverCoste(ctx, orden, 'comarca-con-duenyo');
    return null;
  }
  aplicar(ctx, { tipo: 'orden-avance', orden: orden.id, turnos: 1 });
  const hechos = ctx.estado.ordenes.find((o) => o.id === orden.id)?.turnosHechos ?? 0;
  if (hechos < orden.turnosTotales) return null;
  return {
    orden,
    candidato: {
      jugador: orden.jugador,
      influencia: comarca.influencias[orden.jugador] ?? 0,
      presenciaSeguida: comarca.presenciaSeguida[orden.jugador] ?? 0,
    },
  };
}

/** El ganador se queda la comarca; los demas recuperan lo que pagaron y saben quien la gano. */
function resolverDisputa(
  ctx: Contexto,
  idComarca: IdComarca,
  candidatas: readonly Candidata[],
): void {
  const ganador = ganadorDeIncorporacion(
    candidatas.map((c) => c.candidato),
    ctx.semilla,
    ctx.turno,
    idComarca,
  );
  const comarca = ctx.estado.comarcas[idComarca];
  if (ganador === null || comarca === undefined) return;

  for (const { orden } of candidatas) {
    if (orden.jugador !== ganador) {
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'incorporar.perdida',
        { ganador, nombre: ctx.estado.jugadores[ganador]?.nombre ?? ganador },
        { jugador: orden.jugador, comarca: idComarca },
      );
      devolverCoste(ctx, orden, 'disputa-perdida');
      continue;
    }
    const vecinos = comarca.poblacion;
    aplicar(ctx, { tipo: 'duenyo', comarca: idComarca, jugador: ganador });
    aplicar(ctx, {
      tipo: 'lealtad',
      comarca: idComarca,
      delta: ctx.reglas.poblacion.lealtadInicialIncorporada - comarca.lealtad,
      motivo: 'incorporada',
    });
    aplicar(ctx, {
      tipo: 'conocimiento',
      jugador: ganador,
      comarca: idComarca,
      conocimiento: { nivel: 'propia', turnoUltimaNoticia: ctx.turno, datos: null },
    });
    aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado: 'terminada', motivo: null });
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'incorporar.completa',
      { vecinos },
      { jugador: ganador, comarca: idComarca },
    );
  }
}

/** Una orden que ya pago y no llega a buen puerto devuelve todo su coste. */
function devolverCoste(ctx: Contexto, orden: OrdenDe<'incorporar'>, motivo: string): void {
  for (const recurso of RECURSOS) {
    const cantidad = orden.coste[recurso];
    if (cantidad > 0) {
      aplicar(ctx, {
        tipo: 'recurso',
        jugador: orden.jugador,
        recurso,
        delta: cantidad,
        motivo: `devolucion de la orden ${orden.id}`,
      });
    }
  }
  aplicar(ctx, { tipo: 'orden-estado', orden: orden.id, estado: 'cancelada', motivo });
}
