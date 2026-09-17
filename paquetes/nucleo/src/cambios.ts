// Todo cambio del estado pasa por aqui. Tres cosas siempre, y en este orden:
// 1) se comprueban los invariantes, 2) se aplica la mutacion, 3) se registra el suceso.
// Gracias a eso, cualquier cifra que vea el jugador se puede explicar leyendo la lista de sucesos.
import type { Contexto } from './contexto.ts';
import { comoBorrador } from './contexto.ts';
import { ErrorDeMotor } from './errores.ts';
import { registrarSuceso } from './sucesos.ts';
import type { IdComarca, IdJugador, IdOrden } from './tipos/ids.ts';
import type { EstadoDeOrden, Orden } from './tipos/ordenes.ts';
import type { Recurso } from './tipos/recursos.ts';
import { limitar } from './utiles/enteros.ts';

export type Cambio =
  | {
      readonly tipo: 'recurso';
      readonly jugador: IdJugador;
      readonly recurso: Recurso;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'reservado';
      readonly jugador: IdJugador;
      readonly recurso: Recurso;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'prestigio';
      readonly jugador: IdJugador;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'escasez';
      readonly jugador: IdJugador;
      readonly hay: boolean;
    }
  | {
      readonly tipo: 'poblacion';
      readonly comarca: IdComarca;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'lealtad';
      readonly comarca: IdComarca;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'edificio';
      readonly comarca: IdComarca;
      readonly edificio: string;
      readonly delta: number;
    }
  | {
      readonly tipo: 'influencia';
      readonly comarca: IdComarca;
      readonly jugador: IdJugador;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'duenyo';
      readonly comarca: IdComarca;
      readonly jugador: IdJugador | null;
    }
  | {
      readonly tipo: 'orden-alta';
      readonly orden: Orden;
    }
  | {
      readonly tipo: 'orden-estado';
      readonly orden: IdOrden;
      readonly estado: EstadoDeOrden;
      readonly motivo: string | null;
    }
  | {
      readonly tipo: 'orden-avance';
      readonly orden: IdOrden;
      readonly turnos: number;
    };

function jugadorDe(
  ctx: Contexto,
  id: IdJugador,
): NonNullable<Contexto['estado']['jugadores'][string]> {
  const jugador = ctx.estado.jugadores[id];
  if (jugador === undefined) {
    throw new ErrorDeMotor('entidad-desconocida', `No hay ningun jugador "${id}" en la partida.`);
  }
  return jugador;
}

function comarcaDe(
  ctx: Contexto,
  id: IdComarca,
): NonNullable<Contexto['estado']['comarcas'][string]> {
  const comarca = ctx.estado.comarcas[id];
  if (comarca === undefined) {
    throw new ErrorDeMotor('entidad-desconocida', `No hay ninguna comarca "${id}" en la partida.`);
  }
  return comarca;
}

function ordenDe(ctx: Contexto, id: IdOrden): NonNullable<Contexto['estado']['ordenes'][number]> {
  const orden = ctx.estado.ordenes.find((candidata) => candidata.id === id);
  if (orden === undefined) {
    throw new ErrorDeMotor('entidad-desconocida', `No hay ninguna orden "${id}" en la partida.`);
  }
  return orden;
}

/** Aplica un cambio al borrador del estado, comprobando antes que no rompe ningun invariante. */
export function aplicar(ctx: Contexto, cambio: Cambio): void {
  switch (cambio.tipo) {
    case 'recurso': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      const antes = jugador.almacen[cambio.recurso];
      const despues = antes + cambio.delta;
      if (despues < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `El almacen de ${cambio.jugador} se quedaria en ${String(despues)} de ${cambio.recurso}: en el motor no hay deudas de recursos.`,
          { jugador: cambio.jugador, recurso: cambio.recurso, antes, delta: cambio.delta },
        );
      }
      if (despues < jugador.reservado[cambio.recurso]) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Quedarian ${String(despues)} de ${cambio.recurso} y hay ${String(jugador.reservado[cambio.recurso])} reservados para ordenes.`,
          { jugador: cambio.jugador, recurso: cambio.recurso },
        );
      }
      jugador.almacen[cambio.recurso] = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'almacen.cambio',
        { recurso: cambio.recurso, delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { jugador: cambio.jugador },
      );
      return;
    }

    case 'reservado': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      const despues = jugador.reservado[cambio.recurso] + cambio.delta;
      if (despues < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `No se puede liberar mas ${cambio.recurso} del que hay reservado.`,
          { jugador: cambio.jugador, recurso: cambio.recurso },
        );
      }
      if (despues > jugador.almacen[cambio.recurso]) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Se reservarian ${String(despues)} de ${cambio.recurso} y solo hay ${String(jugador.almacen[cambio.recurso])} en el almacen.`,
          { jugador: cambio.jugador, recurso: cambio.recurso },
        );
      }
      jugador.reservado[cambio.recurso] = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'almacen.reserva',
        { recurso: cambio.recurso, delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { jugador: cambio.jugador },
      );
      return;
    }

    case 'prestigio': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      jugador.prestigio += cambio.delta;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'prestigio.cambio',
        { delta: cambio.delta, total: jugador.prestigio, motivo: cambio.motivo },
        { jugador: cambio.jugador },
      );
      return;
    }

    case 'escasez': {
      const jugador = jugadorDe(ctx, cambio.jugador);
      if (jugador.escasez === cambio.hay) return;
      jugador.escasez = cambio.hay;
      jugador.escasezSeguidas = cambio.hay ? jugador.escasezSeguidas + 1 : 0;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        cambio.hay ? 'escasez.empieza' : 'escasez.termina',
        { seguidas: jugador.escasezSeguidas },
        { jugador: cambio.jugador },
      );
      return;
    }

    case 'poblacion': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      const despues = comarca.poblacion + cambio.delta;
      if (despues < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La poblacion de ${cambio.comarca} se quedaria en ${String(despues)} vecinos.`,
          { comarca: cambio.comarca, delta: cambio.delta },
        );
      }
      comarca.poblacion = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'poblacion.cambio',
        { delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { comarca: cambio.comarca, jugador: comarca.duenyo },
      );
      return;
    }

    case 'lealtad': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      const despues = limitar(comarca.lealtad + cambio.delta, 0, 100);
      if (despues === comarca.lealtad) return;
      comarca.lealtad = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'lealtad.cambio',
        { delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { comarca: cambio.comarca, jugador: comarca.duenyo },
      );
      return;
    }

    case 'edificio': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      const nivel = (comarca.edificios[cambio.edificio] ?? 0) + cambio.delta;
      if (nivel < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `No se puede derribar mas ${cambio.edificio} del que hay en ${cambio.comarca}.`,
          { comarca: cambio.comarca, edificio: cambio.edificio },
        );
      }
      if (nivel === 0) {
        const restantes: Record<string, number> = {};
        for (const [clave, valor] of Object.entries(comarca.edificios)) {
          if (clave !== cambio.edificio) restantes[clave] = valor;
        }
        comarca.edificios = restantes;
      } else {
        comarca.edificios[cambio.edificio] = nivel;
      }
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'edificio.cambio',
        { edificio: cambio.edificio, delta: cambio.delta, nivel },
        { comarca: cambio.comarca, jugador: comarca.duenyo },
      );
      return;
    }

    case 'influencia': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      if (comarca.duenyo !== null) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `${cambio.comarca} tiene duenyo: solo las comarcas neutrales acumulan influencia.`,
          { comarca: cambio.comarca },
        );
      }
      const despues = limitar((comarca.influencias[cambio.jugador] ?? 0) + cambio.delta, 0, 100);
      comarca.influencias[cambio.jugador] = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'influencia.cambio',
        { delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { comarca: cambio.comarca, jugador: cambio.jugador },
      );
      return;
    }

    case 'duenyo': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      const antes = comarca.duenyo;
      comarca.duenyo = cambio.jugador;
      // Una comarca con duenyo no guarda influencias: al incorporarse, se borran.
      if (cambio.jugador !== null) comarca.influencias = {};
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        cambio.jugador === null ? 'comarca.vuelve-neutral' : 'comarca.incorporada',
        { anterior: antes ?? '(neutral)' },
        { comarca: cambio.comarca, jugador: cambio.jugador ?? antes },
      );
      return;
    }

    case 'orden-alta': {
      if (ctx.estado.ordenes.some((existente) => existente.id === cambio.orden.id)) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Ya hay una orden con el identificador "${cambio.orden.id}".`,
          { orden: cambio.orden.id },
        );
      }
      ctx.estado.ordenes.push(comoBorrador(cambio.orden));
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'orden.alta',
        { orden: cambio.orden.id, clase: cambio.orden.tipo },
        { jugador: cambio.orden.jugador },
      );
      return;
    }

    case 'orden-estado': {
      const orden = ordenDe(ctx, cambio.orden);
      orden.estado = cambio.estado;
      orden.motivoEspera = cambio.motivo;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'orden.estado',
        { orden: cambio.orden, estado: cambio.estado, motivo: cambio.motivo ?? '' },
        { jugador: orden.jugador },
      );
      return;
    }

    case 'orden-avance': {
      const orden = ordenDe(ctx, cambio.orden);
      const despues = orden.turnosHechos + cambio.turnos;
      if (despues < 0 || despues > orden.turnosTotales) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La orden "${cambio.orden}" quedaria en ${String(despues)} turnos de ${String(orden.turnosTotales)}.`,
          { orden: cambio.orden },
        );
      }
      orden.turnosHechos = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'orden.avance',
        { orden: cambio.orden, hechos: despues, totales: orden.turnosTotales },
        { jugador: orden.jugador },
      );
      return;
    }
  }
}
