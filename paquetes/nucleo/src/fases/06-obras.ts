// Fase 06 · Obras (T-035, docs/03-economia.md §3.3 y §3.11).
//
// Primero se atienden las ordenes de obra (construir, derribar, roturar y obra mayor) todas juntas
// en orden de identificador, porque compiten por las mismas cuadrillas y solares. Despues avanza
// cada obra, y al final se aplican los efectos que las obras mayores terminadas dan cada turno.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import {
  cancelarOrden,
  compararOrdenes,
  dejarEnEspera,
  empezarOrden,
  ordenesVivas,
  puedePagarse,
} from '../ordenes.ts';
import type { OrdenDe } from '../ordenes.ts';
import { cuadrillasLibres, turnosHastaCuadrillaLibre } from '../reglas/cuadrillas.ts';
import { permiteIniciar } from '../reglas/escasez.ts';
import { factorDeAcontecimientos } from '../reglas/acontecimientos.ts';
import {
  PROHIBIDO_POR_LA_CASA,
  modificadoresDelJugador,
  permisosDelJugador,
  prohibicionesDe,
} from '../reglas/casas/index.ts';
import {
  avanceDelTurnoMil,
  avanceTrasDeterioro,
  costeDeObraMayor,
  cuotaHasta,
  devolucionDeDerribo,
  impedimentoDeConstruir,
  impedimentoDeObraMayor,
} from '../reglas/obras.ts';
import { impedimentoDeRoturar, potencialesTrasRoturar } from '../reglas/roturar.ts';
import { claveDeTramo, tramoEntre } from '../reglas/ruta.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoComarca, EstadoJugador, Obra, TipoDeObra } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import { nuevoId } from '../tipos/ids.ts';
import type { Orden } from '../tipos/ordenes.ts';
import { RECURSOS, recursosSegun } from '../tipos/recursos.ts';
import type { Recursos } from '../tipos/recursos.ts';
import { OBRAS_MAYORES_DE_TRAMO, esTipoDeEdificio, esTipoDeObraMayor } from '../tipos/reglas.ts';
import type { TipoObraMayor } from '../tipos/reglas.ts';
import { MIL, multiplicarFactores } from '../utiles/enteros.ts';
import { idsEnOrden } from '../utiles/orden.ts';

type OrdenDeObra =
  | OrdenDe<'construir'>
  | OrdenDe<'derribar'>
  | OrdenDe<'roturar'>
  | OrdenDe<'obra-mayor'>
  | OrdenDe<'aperos'>;

export function faseObras(ctx: Contexto): void {
  const ordenes: OrdenDeObra[] = [
    ...ordenesVivas(ctx, 'construir'),
    ...ordenesVivas(ctx, 'derribar'),
    ...ordenesVivas(ctx, 'roturar'),
    ...ordenesVivas(ctx, 'obra-mayor'),
    ...ordenesVivas(ctx, 'aperos'),
  ].sort(compararOrdenes(ctx));
  for (const orden of ordenes) atenderOrden(ctx, orden);

  for (const id of idsEnOrden(ctx.estado.obras)) avanzarObra(ctx, id);
  efectosDeCadaTurno(ctx);
}

const SIN_NADA: Recursos = recursosSegun(() => 0);

/**
 * Se puede obrar aqui: o la comarca es del dominio, o es una **venta en tierra de nadie**, que es
 * el unico edificio que se levanta fuera de poblado (ficha T-053). Para eso hay que haberla
 * explorado: no se planta una posada en un sitio del que solo se ha oido hablar.
 */
function puedeObrarEn(
  ctx: Contexto,
  orden: OrdenDeObra,
  comarca: EstadoComarca,
  jugador: EstadoJugador,
): boolean {
  if (comarca.duenyo === orden.jugador) return true;
  if (comarca.duenyo !== null) return false;
  if (orden.tipo !== 'construir') return false;
  if (!ctx.reglas.edificios[orden.edificio].enTierraDeNadie) return false;
  return jugador.conocimiento[comarca.id]?.nivel === 'explorada';
}

function atenderOrden(ctx: Contexto, orden: OrdenDeObra): void {
  const comarca = ctx.estado.comarcas[orden.comarca];
  const jugador = ctx.estado.jugadores[orden.jugador];
  if (
    comarca === undefined ||
    jugador === undefined ||
    !puedeObrarEn(ctx, orden, comarca, jugador)
  ) {
    cancelarOrden(ctx, orden, 'comarca-ajena');
    return;
  }
  // Lo que la casa del jugador tiene prohibido no empieza nunca.
  const prohibido = prohibicionesDe(ctx.estado, orden.jugador, ctx.reglas);
  const esCatedral =
    orden.tipo === 'obra-mayor' && orden.continuar === null && orden.obra === 'catedral';
  if ((orden.tipo === 'roturar' && prohibido.roturar) || (esCatedral && prohibido.catedral)) {
    cancelarOrden(ctx, orden, PROHIBIDO_POR_LA_CASA);
    return;
  }
  switch (orden.tipo) {
    case 'aperos':
      instalarAperos(ctx, orden, comarca, jugador);
      return;
    case 'construir':
      construir(ctx, orden, comarca, jugador);
      return;
    case 'derribar':
      derribar(ctx, orden, comarca);
      return;
    case 'roturar':
      roturar(ctx, orden, comarca);
      return;
    case 'obra-mayor':
      obraMayor(ctx, orden, comarca, jugador);
      return;
  }
}

/**
 * Lo comun a empezar cualquier obra: sin escasez y con cuadrilla libre. Si no, la orden espera con
 * su motivo (y, si es por cuadrilla, con la prevision de cuando quedara una libre).
 */
function puedeEmpezar(ctx: Contexto, orden: Orden, comarca: EstadoComarca): boolean {
  const jugador = ctx.estado.jugadores[orden.jugador];
  if (jugador !== undefined && !permiteIniciar(jugador)) {
    dejarEnEspera(ctx, orden, 'escasez');
    return false;
  }
  const extra =
    jugador === undefined ? 0 : modificadoresDelJugador(jugador, ctx.reglas).cuadrillasExtra;
  if (cuadrillasLibres(ctx.estado, comarca, ctx.reglas, extra) <= 0) {
    const turnos = turnosHastaCuadrillaLibre(ctx.estado, comarca.id);
    if (orden.estado !== 'en espera' || orden.motivoEspera !== 'sin-cuadrilla') {
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'obra.sin-cuadrilla',
        { orden: orden.id, turnoPrevisto: ctx.turno + turnos },
        { jugador: orden.jugador, comarca: comarca.id },
      );
    }
    dejarEnEspera(ctx, orden, 'sin-cuadrilla');
    return false;
  }
  // La que viene de su cola no tenia nada reservado: empieza si el almacen da para ella ahora.
  if (!puedePagarse(ctx, orden)) {
    dejarEnEspera(ctx, orden, 'sin-recursos');
    return false;
  }
  return true;
}

function abrirObra(
  ctx: Contexto,
  orden: Orden,
  datos: {
    readonly comarca: IdComarca;
    readonly tipo: TipoDeObra;
    readonly que: string;
    readonly hacia: IdComarca | null;
    readonly turnos: number;
    readonly costeTotal: Recursos;
    readonly entregado: Recursos;
  },
): void {
  const id = nuevoId('obra', ctx.estado.siguienteId);
  aplicar(ctx, { tipo: 'siguiente-id' });
  aplicar(ctx, {
    tipo: 'obra-alta',
    obra: {
      id,
      jugador: orden.jugador,
      comarca: datos.comarca,
      tipo: datos.tipo,
      que: datos.que,
      hacia: datos.hacia,
      avanceMil: 0,
      avanceNecesarioMil: datos.turnos * MIL,
      entregado: datos.entregado,
      costeTotal: datos.costeTotal,
      abandonada: false,
    },
  });
}

function construir(
  ctx: Contexto,
  orden: OrdenDe<'construir'>,
  comarca: EstadoComarca,
  jugador: EstadoJugador,
): void {
  const casa = modificadoresDelJugador(jugador, ctx.reglas);
  const solares = ctx.mundo.comarcas[comarca.id]?.solares ?? 0;
  const obras = Object.values(ctx.estado.obras);
  const impedimento = impedimentoDeConstruir(
    comarca,
    orden.edificio,
    obras,
    solares,
    casa,
    ctx.reglas,
    permisosDelJugador(jugador, ctx.reglas),
  );
  if (impedimento === 'sin-permiso') {
    cancelarOrden(ctx, orden, PROHIBIDO_POR_LA_CASA);
    return;
  }
  if (impedimento !== null) {
    dejarEnEspera(ctx, orden, impedimento);
    return;
  }
  if (!puedeEmpezar(ctx, orden, comarca)) return;
  // La obra de edificio se paga entera al empezar: el coste de la orden estaba reservado.
  empezarOrden(ctx, orden, 'terminada');
  abrirObra(ctx, orden, {
    comarca: comarca.id,
    tipo: 'edificio',
    que: orden.edificio,
    hacia: null,
    turnos: ctx.reglas.edificios[orden.edificio].turnos,
    costeTotal: orden.coste,
    entregado: orden.coste,
  });
}

function derribar(ctx: Contexto, orden: OrdenDe<'derribar'>, comarca: EstadoComarca): void {
  const enDerribo = Object.values(ctx.estado.obras).filter(
    (o) => o.comarca === comarca.id && o.tipo === 'derribo' && o.que === orden.edificio,
  ).length;
  if ((comarca.edificios[orden.edificio] ?? 0) - enDerribo < 1) {
    cancelarOrden(ctx, orden, 'nada-que-derribar');
    return;
  }
  if (!puedeEmpezar(ctx, orden, comarca)) return;
  empezarOrden(ctx, orden, 'terminada');
  abrirObra(ctx, orden, {
    comarca: comarca.id,
    tipo: 'derribo',
    que: orden.edificio,
    hacia: null,
    turnos: ctx.reglas.obras.turnosDerribo,
    costeTotal: orden.coste,
    entregado: orden.coste,
  });
}

/** Un nivel de aperos en una comarca propia, hasta lo que deje la casa; se paga de lo reservado. */
function instalarAperos(
  ctx: Contexto,
  orden: OrdenDe<'aperos'>,
  comarca: EstadoComarca,
  jugador: EstadoJugador,
): void {
  if (comarca.aperos >= modificadoresDelJugador(jugador, ctx.reglas).aperosMaximo) {
    cancelarOrden(ctx, orden, 'nivel-maximo');
    return;
  }
  if (!puedePagarse(ctx, orden)) {
    dejarEnEspera(ctx, orden, 'sin-recursos');
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  aplicar(ctx, { tipo: 'aperos', comarca: comarca.id, delta: 1, motivo: 'se instalan' });
}

function roturar(ctx: Contexto, orden: OrdenDe<'roturar'>, comarca: EstadoComarca): void {
  const enObra = Object.values(ctx.estado.obras).some(
    (o) => o.comarca === comarca.id && o.tipo === 'roturacion',
  );
  const impedimento = enObra ? 'ya-en-obra' : impedimentoDeRoturar(comarca);
  if (impedimento !== null) {
    dejarEnEspera(ctx, orden, impedimento);
    return;
  }
  if (!puedeEmpezar(ctx, orden, comarca)) return;
  empezarOrden(ctx, orden, 'terminada');
  if (comarca.dehesa) {
    aplicar(ctx, {
      tipo: 'lealtad',
      comarca: comarca.id,
      delta: -ctx.reglas.obras.lealtadPorRoturarDehesa,
      motivo: 'roturar la dehesa',
    });
  }
  abrirObra(ctx, orden, {
    comarca: comarca.id,
    tipo: 'roturacion',
    que: 'roturacion',
    hacia: null,
    turnos: ctx.reglas.obras.turnosRoturar,
    costeTotal: orden.coste,
    entregado: orden.coste,
  });
}

function obraMayor(
  ctx: Contexto,
  orden: OrdenDe<'obra-mayor'>,
  comarca: EstadoComarca,
  jugador: EstadoJugador,
): void {
  if (orden.continuar !== null) {
    abandonarORetomar(ctx, orden, comarca);
    return;
  }
  const deTramo = OBRAS_MAYORES_DE_TRAMO.includes(orden.obra);
  const hacia = deTramo ? orden.hacia : null;
  const impedimento = impedimentoDeObraMayor(
    orden.obra,
    { comarca, hacia },
    ctx.estado,
    ctx.mundo,
    ctx.reglas,
  );
  if (impedimento !== null) {
    dejarEnEspera(ctx, orden, impedimento);
    return;
  }
  if (!puedeEmpezar(ctx, orden, comarca)) return;
  empezarOrden(ctx, orden, 'terminada');
  // Las obras mayores se pagan a plazos, segun avanzan.
  abrirObra(ctx, orden, {
    comarca: comarca.id,
    tipo: 'obra mayor',
    que: orden.obra,
    hacia,
    turnos: ctx.reglas.obrasMayores[orden.obra].turnos,
    costeTotal: costeDeObraMayor(
      orden.obra,
      modificadoresDelJugador(jugador, ctx.reglas),
      ctx.reglas,
    ),
    entregado: SIN_NADA,
  });
}

function abandonarORetomar(
  ctx: Contexto,
  orden: OrdenDe<'obra-mayor'>,
  comarca: EstadoComarca,
): void {
  const obra = orden.continuar === null ? undefined : ctx.estado.obras[orden.continuar];
  if (obra === undefined || obra.jugador !== orden.jugador || obra.tipo !== 'obra mayor') {
    cancelarOrden(ctx, orden, 'obra-desconocida');
    return;
  }
  if (orden.abandonar) {
    if (!puedePagarse(ctx, orden)) {
      dejarEnEspera(ctx, orden, 'sin-recursos');
      return;
    }
    if (!obra.abandonada) aplicar(ctx, { tipo: 'obra-abandono', obra: obra.id, abandonada: true });
    empezarOrden(ctx, orden, 'terminada');
    return;
  }
  if (!obra.abandonada) {
    cancelarOrden(ctx, orden, 'no-esta-abandonada');
    return;
  }
  if (!puedeEmpezar(ctx, orden, comarca)) return;
  aplicar(ctx, { tipo: 'obra-abandono', obra: obra.id, abandonada: false });
  empezarOrden(ctx, orden, 'terminada');
}

function esDePiedra(ctx: Contexto, obra: Obra): boolean {
  if (obra.tipo === 'edificio' && esTipoDeEdificio(obra.que)) {
    return ctx.reglas.edificios[obra.que].esDePiedra;
  }
  if (obra.tipo === 'obra mayor' && esTipoDeObraMayor(obra.que)) {
    return ctx.reglas.obrasMayores[obra.que].esDePiedra;
  }
  return false;
}

function avanzarObra(ctx: Contexto, id: string): void {
  const obra = ctx.estado.obras[id];
  const jugador = obra === undefined ? undefined : ctx.estado.jugadores[obra.jugador];
  if (obra === undefined || jugador === undefined) return;
  const casa = modificadoresDelJugador(jugador, ctx.reglas);

  if (obra.abandonada) {
    const queda = avanceTrasDeterioro(obra, ctx.reglas);
    if (queda !== obra.avanceMil) {
      aplicar(ctx, {
        tipo: 'obra-avance',
        obra: obra.id,
        avanceMil: queda,
        entregado: obra.entregado,
      });
    }
    return;
  }

  // Derribar y roturar no dependen de la estacion; levantar, si.
  let paso =
    obra.tipo === 'derribo' || obra.tipo === 'roturacion'
      ? MIL
      : avanceDelTurnoMil(esDePiedra(ctx, obra), ctx.estacional, casa);
  if (obra.tipo === 'obra mayor') {
    // Los maestros que llegan a la region doblan el avance de sus obras mayores.
    const maestrosMil = factorDeAcontecimientos(ctx.estado.acontecimientos, ctx.turno, 'obra', {
      region: ctx.mundo.comarcas[obra.comarca]?.region ?? '',
      comarca: obra.comarca,
    });
    const tipoMil = esTipoDeObraMayor(obra.que) ? (casa.avanceObraMayorMil[obra.que] ?? MIL) : MIL;
    paso = multiplicarFactores(paso, [casa.obraMayorAvanceMil, tipoMil, maestrosMil]);
  }
  const nuevo = Math.min(obra.avanceNecesarioMil, obra.avanceMil + paso);

  let entregado = obra.entregado;
  if (obra.tipo === 'obra mayor') {
    const cuota = cuotaHasta(obra, nuevo);
    const falta = RECURSOS.find((r) => jugador.almacen[r] - jugador.reservado[r] < cuota[r]);
    if (falta !== undefined) {
      // Detenida, no perdida: en cuanto haya material, sigue sola.
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'obra.detenida',
        { obra: obra.id, que: obra.que, falta, necesita: cuota[falta] },
        { jugador: obra.jugador, comarca: obra.comarca },
      );
      return;
    }
    for (const recurso of RECURSOS) {
      if (cuota[recurso] > 0) {
        aplicar(ctx, {
          tipo: 'recurso',
          jugador: obra.jugador,
          recurso,
          delta: -cuota[recurso],
          motivo: `obra ${obra.id}`,
        });
      }
    }
    entregado = recursosSegun((r) => obra.entregado[r] + cuota[r]);
  }
  aplicar(ctx, { tipo: 'obra-avance', obra: obra.id, avanceMil: nuevo, entregado });
  if (nuevo >= obra.avanceNecesarioMil) terminarObra(ctx, obra);
}

function terminarObra(ctx: Contexto, obra: Obra): void {
  switch (obra.tipo) {
    case 'edificio':
      aplicar(ctx, { tipo: 'edificio', comarca: obra.comarca, edificio: obra.que, delta: 1 });
      // Lo levantado en tierra de nadie queda a nombre de quien lo levanto: es su ventero quien
      // le dira lo que alli se paga (T-053). En tierra propia no hace falta: ya es suya.
      if (
        esTipoDeEdificio(obra.que) &&
        ctx.reglas.edificios[obra.que].enTierraDeNadie &&
        ctx.estado.comarcas[obra.comarca]?.duenyo === null
      ) {
        aplicar(ctx, { tipo: 'venta-de', comarca: obra.comarca, jugador: obra.jugador });
      }
      break;
    case 'derribo': {
      aplicar(ctx, { tipo: 'edificio', comarca: obra.comarca, edificio: obra.que, delta: -1 });
      if ((ctx.estado.comarcas[obra.comarca]?.edificios['venta'] ?? 0) === 0) {
        aplicar(ctx, { tipo: 'venta-de', comarca: obra.comarca, jugador: null });
      }
      if (!esTipoDeEdificio(obra.que)) break;
      const devuelto = devolucionDeDerribo(obra.que, ctx.reglas);
      for (const recurso of RECURSOS) {
        if (devuelto[recurso] > 0) {
          aplicar(ctx, {
            tipo: 'recurso',
            jugador: obra.jugador,
            recurso,
            delta: devuelto[recurso],
            motivo: `derribo de ${obra.que}`,
          });
        }
      }
      break;
    }
    case 'roturacion': {
      const comarca = ctx.estado.comarcas[obra.comarca];
      const potenciales =
        comarca === undefined ? null : potencialesTrasRoturar(comarca.potenciales);
      if (potenciales !== null) {
        aplicar(ctx, { tipo: 'potenciales', comarca: obra.comarca, potenciales });
      }
      break;
    }
    case 'obra mayor':
      if (esTipoDeObraMayor(obra.que)) terminarObraMayor(ctx, obra, obra.que);
      break;
  }
  aplicar(ctx, { tipo: 'obra-baja', obra: obra.id });
}

function terminarObraMayor(ctx: Contexto, obra: Obra, tipo: TipoObraMayor): void {
  if (obra.hacia !== null) {
    const camino = tramoEntre(ctx.mundo, obra.comarca, obra.hacia);
    const clave = claveDeTramo(obra.comarca, obra.hacia);
    const antes = ctx.estado.caminos[clave];
    const calidad = antes?.calidad ?? (camino?.calzadaRomana === true ? 'carretero' : 'vereda');
    aplicar(ctx, {
      tipo: 'tramo',
      clave,
      tramo:
        tipo === 'puente'
          ? { calidad, puente: true }
          : { calidad: 'calzada', puente: antes?.puente ?? false },
    });
  } else {
    aplicar(ctx, { tipo: 'obra-mayor-terminada', comarca: obra.comarca, obra: tipo });
    if (tipo === 'muralla') {
      aplicar(ctx, {
        tipo: 'lealtad',
        comarca: obra.comarca,
        delta: ctx.reglas.obras.lealtadPorMuralla,
        motivo: 'muralla',
      });
    }
  }
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'hito.obra-mayor',
    { obra: tipo, hacia: obra.hacia ?? '' },
    { jugador: obra.jugador, comarca: obra.comarca },
  );
}

/**
 * Lo que dan cada turno las catedrales: lealtad a las comarcas propias de la misma region y
 * maravedis de los peregrinos.
 */
function efectosDeCadaTurno(ctx: Contexto): void {
  for (const id of idsEnOrden(ctx.estado.comarcas)) {
    const comarca = ctx.estado.comarcas[id];
    if (comarca === undefined || comarca.duenyo === null) continue;
    if (!comarca.obrasMayores.includes('catedral')) continue;
    const duenyo = comarca.duenyo;
    const region = ctx.mundo.comarcas[id]?.region;
    for (const otra of idsEnOrden(ctx.estado.comarcas)) {
      if (ctx.estado.comarcas[otra]?.duenyo !== duenyo) continue;
      if (ctx.mundo.comarcas[otra]?.region !== region) continue;
      aplicar(ctx, {
        tipo: 'lealtad',
        comarca: otra as IdComarca,
        delta: ctx.reglas.obras.lealtadRegionalPorCatedral,
        motivo: `catedral de ${id}`,
      });
    }
    aplicar(ctx, {
      tipo: 'recurso',
      jugador: duenyo,
      recurso: 'maravedis',
      delta: ctx.reglas.obras.maravedisPorPeregrinos,
      motivo: `peregrinos de ${id}`,
    });
  }
}
