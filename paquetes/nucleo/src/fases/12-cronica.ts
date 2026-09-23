// Fase 12 · Cronica (docs/02-diseno-nucleo.md §2.6 y §2.7; ficha T-044).
//
// Lo que cada jugador llega a saber al acabar el turno, en este orden:
// 1. Lo que ven sus recuas: donde hay una quieta, sabe los precios exactos de las plazas abiertas
//    y, si la comarca ya estaba explorada, la ve como esta hoy.
// 2. Lo que le escriben sus corresponsales, si su casa los tiene: los precios de hoy de las plazas
//    que visito alguna vez.
// 3. Lo que oye: rumores de precios, redondeados, y de comarcas por conocer.
// La cronica de cada jugador se compone despues, fuera del estado (`reglas/cronica.ts`), con los
// sucesos del turno entero.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { permisosDelJugador } from '../reglas/casas/index.ts';
import { datosConocidosDe } from '../reglas/explorar.ts';
import { catalogoDePlazas } from '../reglas/plazas.ts';
import type { Plaza } from '../reglas/plazas.ts';
import { comarcasConRecua, preciosDeOido, sortearRumores, viasDeRumor } from '../reglas/rumores.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoJugador } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import { comparar, idsEnOrden } from '../utiles/orden.ts';

export function faseCronica(ctx: Contexto): void {
  const abiertas = catalogoDePlazas(ctx.estado, ctx.mundo, ctx.calendario.feriasActivas).abiertas;
  for (const id of idsEnOrden(ctx.estado.jugadores)) {
    const jugador = ctx.estado.jugadores[id];
    if (jugador === undefined) continue;
    loQueVeLoSuyo(ctx, jugador, abiertas);
    loQueEscribenSusCorresponsales(ctx, jugador);
    loQueOye(ctx, jugador, abiertas);
  }
}

function saberPrecios(
  ctx: Contexto,
  jugador: EstadoJugador,
  mercado: string,
  fuente: 'visita' | 'corresponsal',
): void {
  const precios = ctx.estado.mercados[mercado]?.preciosMil;
  if (precios === undefined) return;
  const antes = jugador.plazas[mercado];
  aplicar(ctx, {
    tipo: 'plaza-conocida',
    jugador: jugador.id,
    mercado,
    precios: {
      turno: ctx.turno,
      fuente,
      preciosMil: { ...precios },
      visitada: fuente === 'visita' || antes?.visitada === true,
    },
  });
}

/**
 * Las comarcas donde el jugador tiene gente suya: donde para una recua y donde tiene la venta que
 * levanto en tierra de nadie (ficha T-053). De las dos sabe lo que pasa y lo que se paga; una
 * venta sin ventero que cuente los precios no serviria para decidir ningun viaje.
 */
function dondeTieneGente(ctx: Contexto, jugador: EstadoJugador): IdComarca[] {
  const suyas = new Set<IdComarca>(comarcasConRecua(ctx.estado, jugador));
  for (const id of idsEnOrden(ctx.estado.comarcas)) {
    if (ctx.estado.comarcas[id]?.ventaDe === jugador.id) suyas.add(id as IdComarca);
  }
  return [...suyas].sort(comparar);
}

function loQueVeLoSuyo(ctx: Contexto, jugador: EstadoJugador, abiertas: readonly Plaza[]): void {
  for (const comarca of dondeTieneGente(ctx, jugador)) {
    for (const plaza of abiertas.filter((p) => p.comarca === comarca)) {
      saberPrecios(ctx, jugador, plaza.id, 'visita');
    }
    const estado = ctx.estado.comarcas[comarca];
    const geografia = ctx.mundo.comarcas[comarca];
    if (
      jugador.conocimiento[comarca]?.nivel === 'explorada' &&
      estado !== undefined &&
      geografia !== undefined
    ) {
      aplicar(ctx, {
        tipo: 'conocimiento',
        jugador: jugador.id,
        comarca,
        conocimiento: {
          nivel: 'explorada',
          turnoUltimaNoticia: ctx.turno,
          datos: datosConocidosDe(estado, geografia),
        },
      });
    }
  }
}

function loQueEscribenSusCorresponsales(ctx: Contexto, jugador: EstadoJugador): void {
  if (!permisosDelJugador(jugador, ctx.reglas).corresponsales) return;
  for (const mercado of Object.keys(jugador.plazas).sort(comparar)) {
    const conocida = jugador.plazas[mercado];
    if (conocida?.visitada === true && conocida.turno < ctx.turno) {
      saberPrecios(ctx, jugador, mercado, 'corresponsal');
    }
  }
}

function loQueOye(ctx: Contexto, jugador: EstadoJugador, abiertas: readonly Plaza[]): void {
  const corresponsales = permisosDelJugador(jugador, ctx.reglas).corresponsales;
  const vias = viasDeRumor(ctx.estado, ctx.mundo, jugador, abiertas, corresponsales, ctx.reglas);
  const rumores = sortearRumores(
    ctx.estado,
    ctx.mundo,
    jugador,
    abiertas,
    vias,
    ctx.turno,
    ctx.reglas,
  );
  for (const rumor of rumores) {
    if (rumor.tipo === 'precios') {
      const precios = ctx.estado.mercados[rumor.plaza.id]?.preciosMil;
      const antes = jugador.plazas[rumor.plaza.id];
      // Un rumor no pisa lo que se supo de primera mano este mismo turno.
      if (precios === undefined || antes?.turno === ctx.turno) continue;
      const deOido = preciosDeOido(precios);
      aplicar(ctx, {
        tipo: 'plaza-conocida',
        jugador: jugador.id,
        mercado: rumor.plaza.id,
        precios: {
          turno: ctx.turno,
          fuente: 'rumor',
          preciosMil: deOido,
          visitada: antes?.visitada === true,
        },
      });
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'rumor.precios',
        { mercado: rumor.plaza.id, via: rumor.via, panMil: deOido.pan, lanaMil: deOido.lana },
        { jugador: jugador.id, comarca: rumor.plaza.comarca },
      );
    } else {
      aplicar(ctx, {
        tipo: 'conocimiento',
        jugador: jugador.id,
        comarca: rumor.comarca,
        conocimiento: { nivel: 'oida', turnoUltimaNoticia: ctx.turno, datos: null },
      });
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'rumor.comarca',
        { via: rumor.via },
        { jugador: jugador.id, comarca: rumor.comarca },
      );
    }
  }
}
