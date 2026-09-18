// Todo cambio del estado pasa por aqui. Tres cosas siempre, y en este orden:
// 1) se comprueban los invariantes, 2) se aplica la mutacion, 3) se registra el suceso.
// Gracias a eso, cualquier cifra que vea el jugador se puede explicar leyendo la lista de sucesos.
import type { Contexto } from './contexto.ts';
import { comoBorrador } from './contexto.ts';
import { ErrorDeMotor } from './errores.ts';
import { registrarSuceso } from './sucesos.ts';
import type { IdComarca, IdJugador, IdOrden, IdRecua } from './tipos/ids.ts';
import type { EstadoDeOrden, Orden } from './tipos/ordenes.ts';
import type { Cometido, Recua, RecursoAgotable, SituacionMovil } from './tipos/estado.ts';
import { LONGITUD_MAXIMA_DE_RUTA } from './tipos/estado.ts';
import type { Recurso, Recursos } from './tipos/recursos.ts';
import { RECURSOS } from './tipos/recursos.ts';
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
      readonly tipo: 'aperos';
      readonly comarca: IdComarca;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'mantenimiento';
      readonly comarca: IdComarca;
      readonly turnosSinMantenimiento: number;
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
      readonly tipo: 'agotamiento';
      readonly comarca: IdComarca;
      readonly valores: Readonly<Record<RecursoAgotable, number>>;
    }
  | {
      readonly tipo: 'produccion-comarca';
      readonly comarca: IdComarca;
      readonly produccion: Recursos;
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
    }
  | {
      readonly tipo: 'orden-retirar';
      readonly orden: IdOrden;
    }
  | {
      /** Consume el siguiente numero de identificador de la partida. */
      readonly tipo: 'siguiente-id';
    }
  | {
      readonly tipo: 'recua-alta';
      readonly recua: Recua;
    }
  | {
      readonly tipo: 'recua-mover';
      readonly recua: IdRecua;
      readonly situacion: SituacionMovil;
      readonly ruta: readonly IdComarca[];
    }
  | {
      readonly tipo: 'recua-ruta';
      readonly recua: IdRecua;
      readonly ruta: readonly IdComarca[];
      readonly circular: boolean;
    }
  | {
      readonly tipo: 'recua-carga';
      readonly recua: IdRecua;
      readonly recurso: Recurso;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'recua-vecinos';
      readonly recua: IdRecua;
      readonly delta: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'recua-acemilas';
      readonly recua: IdRecua;
      readonly delta: number;
      /** Porte que queda con las acemilas nuevas (depende de la casa: lo calcula quien llama). */
      readonly porte: number;
      readonly motivo: string;
    }
  | {
      readonly tipo: 'recua-bastimento';
      readonly recua: IdRecua;
      readonly avisada: boolean;
    }
  | {
      readonly tipo: 'recua-cometido';
      readonly recua: IdRecua;
      readonly cometido: Cometido | null;
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

function recuaDe(ctx: Contexto, id: IdRecua): NonNullable<Contexto['estado']['recuas'][string]> {
  const recua = ctx.estado.recuas[id];
  if (recua === undefined) {
    throw new ErrorDeMotor('entidad-desconocida', `No hay ninguna recua "${id}" en la partida.`);
  }
  return recua;
}

/** La ruta de una unidad es coherente con donde esta: si va de camino, empieza por su destino. */
function comprobarRuta(id: string, situacion: SituacionMovil, ruta: readonly IdComarca[]): void {
  if (ruta.length > LONGITUD_MAXIMA_DE_RUTA) {
    throw new ErrorDeMotor(
      'invariante-rota',
      `La ruta de ${id} tendria ${String(ruta.length)} comarcas y el maximo es ${String(LONGITUD_MAXIMA_DE_RUTA)}.`,
      { unidad: id },
    );
  }
  if (situacion.donde === 'camino' && ruta[0] !== situacion.hasta) {
    throw new ErrorDeMotor(
      'invariante-rota',
      `${id} va de camino a ${situacion.hasta} y su ruta no empieza por alli.`,
      { unidad: id },
    );
  }
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
      // Se aplica una vez por turno y jugador: cada turno con escasez suma uno a la racha.
      const jugador = jugadorDe(ctx, cambio.jugador);
      if (!jugador.escasez && !cambio.hay) return;
      const clave = !cambio.hay
        ? 'escasez.termina'
        : jugador.escasez
          ? 'escasez.sigue'
          : 'escasez.empieza';
      jugador.escasez = cambio.hay;
      jugador.escasezSeguidas = cambio.hay ? jugador.escasezSeguidas + 1 : 0;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        clave,
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

    case 'aperos': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      const despues = comarca.aperos + cambio.delta;
      if (despues < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Los aperos de ${cambio.comarca} quedarian en el nivel ${String(despues)}.`,
          { comarca: cambio.comarca, delta: cambio.delta },
        );
      }
      comarca.aperos = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'aperos.cambio',
        { delta: cambio.delta, nivel: despues, motivo: cambio.motivo },
        { comarca: cambio.comarca, jugador: comarca.duenyo },
      );
      return;
    }

    case 'mantenimiento': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      if (
        !Number.isSafeInteger(cambio.turnosSinMantenimiento) ||
        cambio.turnosSinMantenimiento < 0
      ) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Los turnos sin mantenimiento de ${cambio.comarca} no pueden ser ${String(cambio.turnosSinMantenimiento)}.`,
          { comarca: cambio.comarca },
        );
      }
      comarca.turnosSinMantenimiento = cambio.turnosSinMantenimiento;
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

    case 'agotamiento': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      const maximo = ctx.reglas.produccion.agotamiento.maximo;
      for (const [recurso, valor] of Object.entries(cambio.valores)) {
        if (!Number.isSafeInteger(valor) || valor < 0 || valor > maximo) {
          throw new ErrorDeMotor(
            'invariante-rota',
            `El agotamiento de ${recurso} en ${cambio.comarca} seria ${String(valor)} y tiene que quedar entre 0 y ${String(maximo)}.`,
            { comarca: cambio.comarca, recurso, valor },
          );
        }
      }
      comarca.agotamiento = { ...cambio.valores };
      return;
    }

    case 'produccion-comarca': {
      const comarca = comarcaDe(ctx, cambio.comarca);
      for (const [recurso, valor] of Object.entries(cambio.produccion)) {
        if (!Number.isSafeInteger(valor) || valor < 0) {
          throw new ErrorDeMotor(
            'invariante-rota',
            `La produccion de ${recurso} en ${cambio.comarca} no puede ser ${String(valor)}.`,
            { comarca: cambio.comarca, recurso, valor },
          );
        }
      }
      comarca.produccionUltimoTurno = { ...cambio.produccion };
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

    case 'orden-retirar': {
      const indice = ctx.estado.ordenes.findIndex((o) => o.id === cambio.orden);
      const orden = ctx.estado.ordenes[indice];
      if (orden === undefined) {
        throw new ErrorDeMotor('entidad-desconocida', `No hay ninguna orden "${cambio.orden}".`);
      }
      if (orden.estado !== 'terminada' && orden.estado !== 'cancelada') {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La orden "${cambio.orden}" sigue viva (${orden.estado}) y no se puede retirar.`,
          { orden: cambio.orden },
        );
      }
      ctx.estado.ordenes.splice(indice, 1);
      return;
    }

    case 'siguiente-id': {
      ctx.estado.siguienteId += 1;
      return;
    }

    case 'recua-alta': {
      if (ctx.estado.recuas[cambio.recua.id] !== undefined) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `Ya hay una recua con el identificador "${cambio.recua.id}".`,
          { recua: cambio.recua.id },
        );
      }
      jugadorDe(ctx, cambio.recua.jugador);
      comprobarRuta(cambio.recua.id, cambio.recua.situacion, cambio.recua.ruta);
      ctx.estado.recuas[cambio.recua.id] = comoBorrador(cambio.recua);
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.formada',
        {
          recua: cambio.recua.id,
          nombre: cambio.recua.nombre,
          acemilas: cambio.recua.acemilas,
          vecinos: cambio.recua.vecinos,
        },
        {
          jugador: cambio.recua.jugador,
          comarca:
            cambio.recua.situacion.donde === 'comarca' ? cambio.recua.situacion.comarca : null,
        },
      );
      return;
    }

    case 'recua-mover': {
      const recua = recuaDe(ctx, cambio.recua);
      comprobarRuta(cambio.recua, cambio.situacion, cambio.ruta);
      recua.situacion = comoBorrador(cambio.situacion);
      recua.ruta = [...cambio.ruta];
      return;
    }

    case 'recua-ruta': {
      const recua = recuaDe(ctx, cambio.recua);
      comprobarRuta(cambio.recua, recua.situacion, cambio.ruta);
      recua.ruta = [...cambio.ruta];
      recua.rutaCircular = cambio.circular;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.ruta',
        {
          recua: cambio.recua,
          comarcas: cambio.ruta.length,
          destino: cambio.ruta.at(-1) ?? '',
          circular: cambio.circular ? 1 : 0,
        },
        { jugador: recua.jugador },
      );
      return;
    }

    case 'recua-carga': {
      const recua = recuaDe(ctx, cambio.recua);
      const despues = recua.carga[cambio.recurso] + cambio.delta;
      if (despues < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La recua ${cambio.recua} se quedaria con ${String(despues)} de ${cambio.recurso}.`,
          { recua: cambio.recua, recurso: cambio.recurso },
        );
      }
      const peso = RECURSOS.filter((r) => r !== 'maravedis').reduce(
        (total, r) => total + (r === cambio.recurso ? despues : recua.carga[r]),
        0,
      );
      if (cambio.delta > 0 && cambio.recurso !== 'maravedis' && peso > recua.porte) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La recua ${cambio.recua} llevaria ${String(peso)} cargas y su porte es ${String(recua.porte)}.`,
          { recua: cambio.recua },
        );
      }
      recua.carga[cambio.recurso] = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.carga',
        {
          recua: cambio.recua,
          recurso: cambio.recurso,
          delta: cambio.delta,
          total: despues,
          motivo: cambio.motivo,
        },
        { jugador: recua.jugador },
      );
      return;
    }

    case 'recua-vecinos': {
      const recua = recuaDe(ctx, cambio.recua);
      const despues = recua.vecinos + cambio.delta;
      const maximo = ctx.reglas.movimiento.vecinosMaximosPorRecua;
      if (despues < 0 || (cambio.delta > 0 && despues > maximo)) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La recua ${cambio.recua} llevaria ${String(despues)} vecinos y caben ${String(maximo)}.`,
          { recua: cambio.recua },
        );
      }
      recua.vecinos = despues;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.vecinos',
        { recua: cambio.recua, delta: cambio.delta, total: despues, motivo: cambio.motivo },
        { jugador: recua.jugador },
      );
      return;
    }

    case 'recua-acemilas': {
      const recua = recuaDe(ctx, cambio.recua);
      const despues = recua.acemilas + cambio.delta;
      // Una recua nunca desaparece sola: se queda al menos con una acemila.
      if (despues < 1 || cambio.porte < 0) {
        throw new ErrorDeMotor(
          'invariante-rota',
          `La recua ${cambio.recua} se quedaria con ${String(despues)} acemilas.`,
          { recua: cambio.recua },
        );
      }
      recua.acemilas = despues;
      recua.porte = cambio.porte;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.acemilas',
        {
          recua: cambio.recua,
          delta: cambio.delta,
          acemilas: despues,
          porte: cambio.porte,
          motivo: cambio.motivo,
        },
        { jugador: recua.jugador },
      );
      return;
    }

    case 'recua-bastimento': {
      const recua = recuaDe(ctx, cambio.recua);
      recua.avisadaSinBastimento = cambio.avisada;
      return;
    }

    case 'recua-cometido': {
      const recua = recuaDe(ctx, cambio.recua);
      recua.cometido = cambio.cometido;
      recua.turnosDeCometido = 0;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'recua.cometido',
        { recua: cambio.recua, cometido: cambio.cometido ?? '' },
        { jugador: recua.jugador },
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
