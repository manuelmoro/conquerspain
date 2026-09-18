// Fase 03 · Consumo, merma y escasez (T-032, docs/03-economia.md §3.1, §3.6 y §3.9).
//
// Cada jugador paga, por este orden y siempre de lo disponible (lo reservado por ordenes no se
// toca): el pan de su gente, el de sus cuadrillas, el hierro de los aperos y los maravedis de la
// administracion. Lo que no llega tiene su propia consecuencia; nunca se toma de otro recurso.
// Despues se pierde la merma del pan que queda, se decide la escasez y se avisa de lo que viene.
// Cada jugador solo toca su almacen y sus comarcas, asi que el orden entre jugadores no importa.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import type { CosteDeAdministracion } from '../reglas/administracion.ts';
import { costesDeAdministracion } from '../reglas/administracion.ts';
import {
  comarcasDe,
  panDeLaPoblacion,
  panDeLasCuadrillas,
  turnosDeReserva,
} from '../reglas/consumo.ts';
import {
  emigrantes,
  hayHambreProlongada,
  lealtadPerdidaPorEscasez,
  turnosHastaEmigrar,
} from '../reglas/escasez.ts';
import { hayGranero, mermaDelPan } from '../reglas/merma.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoComarca, EstadoJugador } from '../tipos/estado.ts';
import type { IdJugador } from '../tipos/ids.ts';
import type { Recurso } from '../tipos/recursos.ts';
import { idsEnOrden } from '../utiles/orden.ts';

export function faseConsumo(ctx: Contexto): void {
  for (const id of idsEnOrden(ctx.estado.jugadores)) {
    const jugador = ctx.estado.jugadores[id];
    if (jugador !== undefined) consumoDeJugador(ctx, jugador);
  }
}

function disponible(ctx: Contexto, jugador: IdJugador, recurso: Recurso): number {
  const datos = ctx.estado.jugadores[jugador];
  return datos === undefined ? 0 : datos.almacen[recurso] - datos.reservado[recurso];
}

function gastar(
  ctx: Contexto,
  jugador: IdJugador,
  recurso: Recurso,
  cantidad: number,
  motivo: string,
): void {
  if (cantidad > 0) aplicar(ctx, { tipo: 'recurso', jugador, recurso, delta: -cantidad, motivo });
}

function consumoDeJugador(ctx: Contexto, jugador: EstadoJugador): void {
  const id = jugador.id;
  const comarcas = comarcasDe(ctx.estado, id);
  const administracion = costesDeAdministracion(
    comarcas,
    jugador,
    ctx.mundo,
    ctx.reglas,
    ctx.estado.caminos,
  );

  const panDeGente = panDeLaPoblacion(comarcas, ctx.reglas);
  const panDeCuadrillas = panDeLasCuadrillas(ctx.estado, id, ctx.reglas);
  const panNecesario = panDeGente + panDeCuadrillas;
  const panAntes = disponible(ctx, id, 'pan');
  const paraGente = Math.min(panAntes, panDeGente);
  const paraCuadrillas = Math.min(panAntes - paraGente, panDeCuadrillas);
  gastar(ctx, id, 'pan', paraGente, 'pan de la poblacion');
  gastar(ctx, id, 'pan', paraCuadrillas, 'pan de las cuadrillas');
  const faltante = panNecesario - paraGente - paraCuadrillas;
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'consumo.pan',
    {
      poblacion: panDeGente,
      cuadrillas: panDeCuadrillas,
      pagado: panNecesario - faltante,
      faltante,
    },
    { jugador: id },
  );

  pagarAperos(ctx, id, administracion, comarcas);
  pagarAdministracion(ctx, id, administracion);
  const panPerdido = aplicarMerma(ctx, jugador, comarcas);
  decidirEscasez(ctx, id, faltante > 0, comarcas);

  if (faltante === 0) {
    const producido = comarcas.reduce((total, c) => total + c.produccionUltimoTurno.pan, 0);
    const balance = producido - panNecesario - panPerdido;
    const reserva = disponible(ctx, id, 'pan');
    const turnos = turnosDeReserva(reserva, balance);
    if (turnos !== null && turnos < ctx.reglas.consumo.turnosDeAvisoDeHambre) {
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'consumo.aviso-hambre',
        { turnos, reserva, balance },
        { jugador: id },
      );
    }
  }
}

/**
 * Hierro de los aperos, de la comarca mas cercana a la capital a la mas lejana. Una comarca que no
 * cobra su hierro lo apunta; al llegar al limite de turnos seguidos, sus aperos bajan un nivel.
 */
function pagarAperos(
  ctx: Contexto,
  jugador: IdJugador,
  orden: readonly CosteDeAdministracion[],
  comarcas: readonly EstadoComarca[],
): void {
  const reglas = ctx.reglas.consumo;
  for (const { comarca: idComarca } of orden) {
    const comarca = comarcas.find((c) => c.id === idComarca);
    if (comarca === undefined) continue;
    const idC = comarca.id;
    const hierro = comarca.aperos * reglas.hierroPorApero;
    if (hierro === 0 || disponible(ctx, jugador, 'hierro') >= hierro) {
      gastar(ctx, jugador, 'hierro', hierro, `aperos de ${comarca.id}`);
      if (comarca.turnosSinMantenimiento > 0) {
        aplicar(ctx, { tipo: 'mantenimiento', comarca: idC, turnosSinMantenimiento: 0 });
      }
      continue;
    }

    const turnos = comarca.turnosSinMantenimiento + 1;
    if (turnos >= reglas.turnosSinHierroParaPerderApero) {
      aplicar(ctx, { tipo: 'aperos', comarca: idC, delta: -1, motivo: 'aperos sin hierro' });
      aplicar(ctx, { tipo: 'mantenimiento', comarca: idC, turnosSinMantenimiento: 0 });
    } else {
      aplicar(ctx, { tipo: 'mantenimiento', comarca: idC, turnosSinMantenimiento: turnos });
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'consumo.aviso-aperos',
        {
          hierro,
          turnosSinHierro: turnos,
          turnosHastaPerderlos: reglas.turnosSinHierroParaPerderApero - turnos,
        },
        { comarca: idC, jugador },
      );
    }
  }
}

/**
 * Administracion en maravedis (fichas T-032 y T-036). Primero se paga lo de este turno, de la
 * comarca mas cercana a la mas lejana: en cuanto una no llega, esa y las mas lejanas quedan sin
 * pagar, pierden lealtad y lo suyo pasa a la deuda. Lo que sobre salda la deuda vieja; mientras
 * quede deuda, la comarca mas lejana sigue perdiendo lealtad aunque este turno se haya pagado.
 */
function pagarAdministracion(
  ctx: Contexto,
  jugador: IdJugador,
  orden: readonly CosteDeAdministracion[],
): void {
  const perdida = ctx.reglas.consumo.lealtadPorDeudaDeAdministracion;
  const deudaVieja = ctx.estado.jugadores[jugador]?.deudaAdministracion ?? 0;
  const total = orden.reduce((suma, c) => suma + c.coste, 0);
  let pagado = 0;
  let sinPagar: CosteDeAdministracion[] = [];
  for (const [indice, coste] of orden.entries()) {
    if (disponible(ctx, jugador, 'maravedis') < coste.coste) {
      sinPagar = orden.slice(indice);
      break;
    }
    gastar(ctx, jugador, 'maravedis', coste.coste, `administracion de ${coste.comarca}`);
    pagado += coste.coste;
  }
  const saldado = Math.min(deudaVieja, disponible(ctx, jugador, 'maravedis'));
  gastar(ctx, jugador, 'maravedis', saldado, 'deuda de administracion');
  const deuda = deudaVieja - saldado + (total - pagado);
  if (deuda !== deudaVieja) aplicar(ctx, { tipo: 'deuda', jugador, deuda });

  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'consumo.administracion',
    { total, pagado, saldado, deuda, comarcasSinPagar: sinPagar.length },
    { jugador },
  );
  const castigadas = sinPagar.length > 0 || deuda === 0 ? sinPagar : orden.slice(-1);
  for (const coste of castigadas) {
    aplicar(ctx, {
      tipo: 'lealtad',
      comarca: coste.comarca,
      delta: -perdida,
      motivo: sinPagar.length > 0 ? 'administracion sin pagar' : 'deuda de administracion',
    });
  }
}

/** Merma del pan que queda disponible; devuelve el pan perdido. */
function aplicarMerma(
  ctx: Contexto,
  jugador: EstadoJugador,
  comarcas: readonly EstadoComarca[],
): number {
  const merma = mermaDelPan(
    disponible(ctx, jugador.id, 'pan'),
    disponible(ctx, jugador.id, 'sal'),
    hayGranero(comarcas),
    jugador.conservarConSal,
    ctx.reglas.casas[jugador.casa].modificadores.mermaPanMil,
    ctx.reglas,
  );
  gastar(ctx, jugador.id, 'sal', merma.salGastada, 'sal para conservar el pan');
  gastar(ctx, jugador.id, 'pan', merma.panPerdido, 'merma del pan');
  if (merma.panPerdido > 0 || merma.salGastada > 0) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'consumo.merma',
      { mermaMil: merma.mermaMil, panPerdido: merma.panPerdido, salGastada: merma.salGastada },
      { jugador: jugador.id },
    );
  }
  return merma.panPerdido;
}

/** Marca o levanta la escasez y aplica sus efectos sobre las comarcas propias. */
function decidirEscasez(
  ctx: Contexto,
  jugador: IdJugador,
  hay: boolean,
  comarcas: readonly EstadoComarca[],
): void {
  aplicar(ctx, { tipo: 'escasez', jugador, hay });
  if (!hay) return;

  const seguidas = ctx.estado.jugadores[jugador]?.escasezSeguidas ?? 0;
  const lealtad = lealtadPerdidaPorEscasez(seguidas, ctx.reglas);
  const prolongada = hayHambreProlongada(seguidas, ctx.reglas);
  for (const comarca of comarcas) {
    const idC = comarca.id;
    aplicar(ctx, { tipo: 'lealtad', comarca: idC, delta: -lealtad, motivo: 'escasez de pan' });
    const actual = ctx.estado.comarcas[comarca.id]?.poblacion ?? 0;
    const seVan = prolongada ? emigrantes(actual, ctx.reglas) : 0;
    if (seVan > 0) {
      aplicar(ctx, {
        tipo: 'poblacion',
        comarca: idC,
        delta: -seVan,
        motivo: 'emigracion por hambre',
      });
    }
  }

  const faltan = turnosHastaEmigrar(seguidas, ctx.reglas);
  if (faltan !== null) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'consumo.aviso-emigracion',
      { escasecesSeguidas: seguidas, turnosHastaEmigrar: faltan },
      { jugador },
    );
  }
}
