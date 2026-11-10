// La frontera de confianza entre un cliente y el motor (ficha T-062 §4.4).
//
// El cliente manda una **intencion**: solo lo que el jugador decide. El servidor la convierte en
// una orden interna fijando siempre el autor, el turno, el estado, la cola y el **coste** (con las
// reglas y los modificadores efectivos de la casa). El motor se fia del `coste` de cada orden y lo
// reserva al darla de alta, asi que un coste que venga de fuera seria dinero regalado.
//
// Esto comprueba la **forma** y la **propiedad** (lo que cita es del jugador y lo conoce); no
// comprueba que haya recursos o cuadrillas: eso es ejecucion legal y lo decide el motor al darla
// de alta, que la cancela con su motivo y lo cuenta en la cronica.
import { claveDeHostilidad } from '../reglas/milicia.ts';
import { cortejable, estaAmparado } from '../reglas/ausencia.ts';
import {
  costeDeAperos,
  costeDeEdificio,
  costeDeRebanyo,
  costeDeRecua,
} from '../reglas/casas/costes.ts';
import {
  modificadoresDelJugador,
  permisosDelJugador,
  prohibicionesDelJugador,
} from '../reglas/casas/index.ts';
import { costeDeObraMayor } from '../reglas/obras.ts';
import { costeDeRoturar } from '../reglas/roturar.ts';
import { claveDeTramo, comarcaConocida } from '../reglas/ruta.ts';
import type { EstadoComarca, EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type { IdComarca, IdJugador, IdOrden } from '../tipos/ids.ts';
import { ESTADOS_ANULABLES } from '../tipos/ordenes.ts';
import type { Orden } from '../tipos/ordenes.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { Recursos } from '../tipos/recursos.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { invalidos, valido } from '../validacion/validador.ts';
import type { ErrorValidacion, Resultado } from '../validacion/validador.ts';
import { validarOrdenEntrante } from '../validacion/validarOrden.ts';

/** Campos de la orden interna que **solo** fija el servidor: un cliente que los manda se rechaza. */
export const CAMPOS_INTERNOS = [
  'id',
  'jugador',
  'turnoAlta',
  'estado',
  'coste',
  'turnosTotales',
  'turnosHechos',
  'motivoEspera',
  'delMayordomo',
  'cola',
] as const;

/** Campos que el servidor deriva de las tablas de reglas segun el tipo: el cliente no los elige. */
const CAMPOS_DERIVADOS: Readonly<Record<string, Readonly<Record<string, number>>>> = {
  'formar-recua': { acemilas: 1 },
  'formar-rebanyo': { cabezas: 1 },
};

/** Duracion en turnos de plaza abierta de una orden de mercado: lo unico que dura por decision. */
const TURNOS_DE_MERCADO_MAXIMOS = 24;
const PATRON_DE_CLAVE = /^[a-z0-9][a-z0-9-]{0,31}$/;
const NADA: Recursos = { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 };

/**
 * Una intencion ya validada de forma. `bosquejo` es la orden con marcadores en los campos internos:
 * `construirOrden` los sustituye por los verdaderos y nunca se ve fuera de aqui.
 */
export interface Intencion {
  /** La clave que da el cliente: hace idempotente el alta (T-062 §4.5). */
  readonly idCliente: string;
  /** Plan de temporada: el turno en que entra, o null si entra ya. */
  readonly turnoProgramado: number | null;
  /** Solo para las ordenes de mercado: turnos de plaza abierta que dura. */
  readonly turnos: number | null;
  readonly bosquejo: Orden;
}

export interface ContextoDeIntencion {
  readonly estado: EstadoPartida;
  readonly jugador: IdJugador;
  readonly mundo: Mundo;
  readonly reglas: TablasDeReglas;
  /** El identificador interno que se le da a la orden. */
  readonly id: IdOrden;
}

function esObjetoLlano(dato: unknown): dato is Record<string, unknown> {
  return typeof dato === 'object' && dato !== null && !Array.isArray(dato);
}

/** Valida la forma de una intencion que llega de fuera. No mira el estado de la partida. */
export function validarIntencion(dato: unknown): Resultado<Intencion> {
  if (!esObjetoLlano(dato)) {
    return invalidos([{ ruta: '(raiz)', mensaje: 'la intencion tiene que ser un objeto JSON' }]);
  }
  const errores: ErrorValidacion[] = [];
  for (const campo of CAMPOS_INTERNOS) {
    if (campo in dato) {
      errores.push({ ruta: campo, mensaje: 'lo fija el servidor: quitalo de la orden' });
    }
  }
  const tipo = dato['tipo'];
  if (typeof tipo !== 'string') {
    errores.push({ ruta: 'tipo', mensaje: 'falta el tipo de orden' });
  }
  for (const campo of Object.keys(CAMPOS_DERIVADOS[String(tipo)] ?? {})) {
    if (campo in dato) {
      errores.push({ ruta: campo, mensaje: 'lo fijan las reglas del juego: quitalo de la orden' });
    }
  }
  const idCliente = dato['idCliente'];
  if (typeof idCliente !== 'string' || !PATRON_DE_CLAVE.test(idCliente)) {
    errores.push({
      ruta: 'idCliente',
      mensaje:
        'la clave de la orden es obligatoria: de 1 a 32 caracteres, minusculas, digitos y guiones (sirve para reenviarla sin duplicarla)',
    });
  }
  const programado = dato['turnoProgramado'];
  if (
    programado !== undefined &&
    programado !== null &&
    !(typeof programado === 'number' && Number.isInteger(programado) && programado >= 1)
  ) {
    errores.push({
      ruta: 'turnoProgramado',
      mensaje: 'tiene que ser un turno (entero, 1 o mas) o null',
    });
  }
  const turnos = dato['turnos'];
  if (turnos !== undefined && turnos !== null) {
    if (tipo !== 'mercado') {
      errores.push({ ruta: 'turnos', mensaje: 'solo las ordenes de mercado llevan duracion' });
    } else if (!(
      typeof turnos === 'number' &&
      Number.isInteger(turnos) &&
      turnos >= 1 &&
      turnos <= TURNOS_DE_MERCADO_MAXIMOS
    )) {
      errores.push({
        ruta: 'turnos',
        mensaje: `tiene que ser un entero de 1 a ${String(TURNOS_DE_MERCADO_MAXIMOS)}`,
      });
    }
  }
  if (errores.length > 0) return invalidos(errores);

  const { idCliente: _clave, turnoProgramado: _programado, turnos: _turnos, ...resto } = dato;
  const candidato: Record<string, unknown> = {
    ...resto,
    ...CAMPOS_DERIVADOS[String(tipo)],
    id: 'por-fijar',
    jugador: 'por-fijar',
    turnoAlta: 1,
    estado: 'pendiente',
    coste: NADA,
    turnosTotales: 1,
    turnosHechos: 0,
    motivoEspera: null,
    delMayordomo: false,
    turnoProgramado: programado ?? null,
    cola: null,
  };
  const forma = validarOrdenEntrante(candidato);
  if (!forma.ok) return forma;
  return valido({
    idCliente: String(idCliente),
    turnoProgramado: typeof programado === 'number' ? programado : null,
    turnos: typeof turnos === 'number' ? turnos : null,
    bosquejo: forma.valor,
  });
}

function error(ruta: string, mensaje: string): ErrorValidacion {
  return { ruta, mensaje };
}

/** Lo que cita la orden es del jugador y lo conoce: las comprobaciones de propiedad. */
function comprobarPropiedad(
  o: Orden,
  ctx: ContextoDeIntencion,
  yo: EstadoJugador,
): ErrorValidacion[] {
  const { estado, reglas } = ctx;
  const errores: ErrorValidacion[] = [];
  const propia = (ruta: string, comarca: IdComarca): void => {
    if (estado.comarcas[comarca]?.duenyo !== ctx.jugador) {
      errores.push(error(ruta, `la comarca "${comarca}" no es tuya`));
    }
  };
  const conocida = (ruta: string, comarca: IdComarca): void => {
    if (!comarcaConocida(yo, comarca)) {
      errores.push(error(ruta, `todavia no sabes nada de la comarca "${comarca}"`));
    }
  };
  const recuaPropia = (ruta: string, recua: string): void => {
    if (estado.recuas[recua]?.jugador !== ctx.jugador) {
      errores.push(error(ruta, `la recua "${recua}" no es tuya`));
    }
  };
  const rebanyoPropio = (ruta: string, rebanyo: string): void => {
    if (estado.rebanyos[rebanyo]?.jugador !== ctx.jugador) {
      errores.push(error(ruta, `el rebanyo "${rebanyo}" no es tuyo`));
    }
  };
  const neutral = (ruta: string, comarca: IdComarca): void => {
    conocida(ruta, comarca);
    const duenyo = estado.comarcas[comarca]?.duenyo;
    if (duenyo !== null && duenyo !== undefined) {
      errores.push(error(ruta, `la comarca "${comarca}" ya tiene dueño`));
    }
  };

  switch (o.tipo) {
    case 'construir':
      if (reglas.edificios[o.edificio].enTierraDeNadie) {
        if (estado.comarcas[o.comarca]?.duenyo === ctx.jugador) break;
        neutral('comarca', o.comarca);
      } else propia('comarca', o.comarca);
      break;
    case 'derribar':
    case 'roturar':
    case 'aperos':
    case 'politica':
    case 'formar-recua':
    case 'formar-rebanyo':
    case 'trasladar-corte':
      propia('comarca', o.comarca);
      break;
    case 'obra-mayor':
      propia('comarca', o.comarca);
      if (o.hacia !== null) conocida('hacia', o.hacia);
      if (o.continuar !== null && estado.obras[o.continuar]?.jugador !== ctx.jugador) {
        errores.push(error('continuar', `la obra "${o.continuar}" no es tuya`));
      }
      break;
    case 'regalo':
    case 'incorporar': {
      // Neutral, o de una casa que administra el concejo (T-105).
      const comarca = estado.comarcas[o.comarca];
      if (comarca !== undefined && comarca.duenyo !== null && comarca.duenyo !== ctx.jugador) {
        conocida('comarca', o.comarca);
        if (!cortejable(estado, comarca, ctx.jugador, reglas))
          errores.push(error('comarca', `la comarca "${o.comarca}" ya tiene dueño`));
      } else neutral('comarca', o.comarca);
      break;
    }
    case 'ruta':
      if ((o.recua === null) === (o.rebanyo === null)) {
        errores.push(
          error(
            'recua',
            'una ruta es de una recua o de un rebanyo, no de las dos cosas ni de ninguna',
          ),
        );
      }
      if (o.recua !== null) recuaPropia('recua', o.recua);
      if (o.rebanyo !== null) {
        rebanyoPropio('rebanyo', o.rebanyo);
        if (o.circular) errores.push(error('circular', 'un rebanyo no hace rutas circulares'));
      }
      o.paradas.forEach((parada, i) => {
        conocida(`paradas.${String(i)}.comarca`, parada.comarca);
      });
      break;
    case 'carga':
    case 'cometido':
    case 'mercado':
    case 'letra-de-cambio':
      recuaPropia('recua', o.recua);
      break;
    case 'mayordomo': {
      const accion = o.alta?.accion;
      if (accion?.tipo === 'mercado' || accion?.tipo === 'enviar-recua') {
        recuaPropia('alta.accion.recua', accion.recua);
      }
      if (accion?.tipo === 'mover-rebanyo') rebanyoPropio('alta.accion.rebanyo', accion.rebanyo);
      if (
        accion?.tipo === 'enviar-recua' ||
        accion?.tipo === 'mover-rebanyo' ||
        accion?.tipo === 'carga-fiscal'
      ) {
        conocida('alta.accion.comarca', accion.comarca);
      }
      break;
    }
    case 'cola': {
      const [clase, id] = o.clave.split(':');
      if (clase === 'comarca' && id !== undefined) propia('clave', id as IdComarca);
      else if (clase === 'recua' && id !== undefined) recuaPropia('clave', id);
      else errores.push(error('clave', 'la clave de una cola es "comarca:<id>" o "recua:<id>"'));
      for (const orden of o.orden) {
        const viva = estado.ordenes.find((v) => v.id === orden);
        if (viva?.jugador !== ctx.jugador) {
          errores.push(error('orden', `la orden "${orden}" no es tuya o ya no esta viva`));
        }
      }
      break;
    }
    case 'anular': {
      const viva = estado.ordenes.find((v) => v.id === o.orden);
      if (viva?.jugador !== ctx.jugador) {
        errores.push(error('orden', `la orden "${o.orden}" no es tuya o ya no esta viva`));
      } else if (!ESTADOS_ANULABLES.includes(viva.estado)) {
        errores.push(error('orden', 'esa orden ya ha empezado: lo empezado no se anula'));
      }
      break;
    }
    case 'contrato': {
      // Lo que no cambia de aqui a la firma; fondos, permisos y comarcas se miran al firmar (T-103).
      if (o.con === ctx.jugador) errores.push(error('con', 'un contrato es con otra casa'));
      else if (estado.jugadores[o.con] === undefined)
        errores.push(error('con', `no hay ninguna casa "${o.con}" en la partida`));
      if (o.plazo <= estado.turno || o.plazo > estado.turno + reglas.contratos.plazoMaximo)
        errores.push(
          error(
            'plazo',
            `el plazo tiene que estar entre el turno ${String(estado.turno + 1)} y el ${String(estado.turno + reglas.contratos.plazoMaximo)}`,
          ),
        );
      break;
    }
    case 'responder-contrato': {
      const propuesto = estado.contratos?.[o.contrato];
      if (propuesto?.recibe !== ctx.jugador)
        errores.push(error('contrato', `no te han propuesto ningun contrato "${o.contrato}"`));
      else if (propuesto.estado !== 'propuesto')
        errores.push(error('contrato', 'ese contrato ya no espera respuesta'));
      break;
    }
    case 'levar': {
      propia('comarca', o.comarca);
      const comarca = estado.comarcas[o.comarca];
      const maximo =
        comarca === undefined
          ? 0
          : Math.floor((comarca.poblacion * reglas.milicia.levaMaximaMil) / 1000);
      if (o.hombres > maximo)
        errores.push(
          error('hombres', `de esa comarca se pueden levar como mucho ${String(maximo)} hombres`),
        );
      break;
    }
    case 'asediar':
      if (estado.mesnadas?.[o.mesnada]?.jugador !== ctx.jugador)
        errores.push(error('mesnada', `la mesnada "${o.mesnada}" no es tuya`));
      break;
    case 'tregua': {
      const asedio = estado.asedios?.[o.asedio];
      if (asedio === undefined || estado.comarcas[asedio.comarca]?.duenyo !== ctx.jugador)
        errores.push(error('asedio', 'no hay ningun asedio a una comarca tuya con ese nombre'));
      break;
    }
    case 'aceptar-tregua': {
      const asedio = estado.asedios?.[o.asedio];
      if (asedio?.sitiador !== ctx.jugador) errores.push(error('asedio', 'ese asedio no es tuyo'));
      else if (asedio.rescate === null)
        errores.push(error('asedio', 'el defensor aun no ha ofrecido rescate'));
      break;
    }
    case 'licenciar':
    case 'marchar': {
      if (estado.mesnadas?.[o.mesnada]?.jugador !== ctx.jugador)
        errores.push(error('mesnada', `la mesnada "${o.mesnada}" no es tuya`));
      if (o.tipo === 'marchar') conocida('destino', o.destino);
      break;
    }
    case 'hostilidad': {
      const otra = estado.jugadores[o.contra];
      if (o.contra === ctx.jugador || otra === undefined)
        errores.push(error('contra', 'la hostilidad es contra otra casa de la partida'));
      const existente = estado.hostilidades?.[claveDeHostilidad(ctx.jugador, o.contra)];
      if (o.declarar && existente !== undefined)
        errores.push(error('contra', 'ya hay hostilidad con esa casa'));
      if (!o.declarar && existente?.de !== ctx.jugador)
        errores.push(error('contra', 'solo retira la hostilidad quien la declaro'));
      if (o.declarar && otra !== undefined && estaAmparado(otra, estado.turno))
        errores.push(error('contra', 'esa casa esta amparada: acaba de entrar en la partida'));
      break;
    }
    case 'portazgo': {
      const tramo = estado.caminos[claveDeTramo(o.desde, o.hasta)];
      if (tramo?.duenyo !== ctx.jugador)
        errores.push(error('desde', 'ese tramo no lo has mejorado tu: no puedes cobrar en el'));
      if (
        !permisosDelJugador(yo, reglas).cobrarPortazgo ||
        prohibicionesDelJugador(yo, reglas).cobrarPortazgo
      )
        errores.push(error('tipo', 'tu casa no cobra portazgos'));
      if (o.cantidad > reglas.contratos.portazgoMaximo)
        errores.push(
          error(
            'cantidad',
            `el portazgo va de 0 a ${String(reglas.contratos.portazgoMaximo)} maravedis`,
          ),
        );
      break;
    }
    case 'tradicion':
      break;
  }
  return errores;
}

/**
 * Lo que reserva una orden al darse de alta (ficha T-080 §4.1): la unica cuenta de coste, la que usan
 * el servidor al construir la orden y el cliente al prever su bandeja. Solo necesita el jugador y, para
 * roturar, su propia comarca: lo que la vista de ese jugador ya trae.
 */
export function costeDeIntencion(
  o: Orden,
  jugador: EstadoJugador,
  comarca: EstadoComarca | undefined,
  reglas: TablasDeReglas,
): Recursos {
  const casa = modificadoresDelJugador(jugador, reglas);
  switch (o.tipo) {
    case 'construir':
      return costeDeEdificio(o.edificio, casa, reglas);
    case 'roturar':
      return comarca === undefined ? NADA : costeDeRoturar(comarca, reglas);
    case 'obra-mayor':
      return o.continuar === null ? costeDeObraMayor(o.obra, casa, reglas) : NADA;
    case 'aperos':
      return costeDeAperos(reglas);
    case 'formar-recua':
      return costeDeRecua(casa, reglas);
    case 'formar-rebanyo':
      return costeDeRebanyo(casa, reglas);
    case 'regalo':
      return { ...NADA, maravedis: reglas.influencia.costeRegalo };
    case 'incorporar':
      return reglas.influencia.costeIncorporar;
    case 'trasladar-corte':
      return reglas.territorio.costeTraslado;
    case 'letra-de-cambio':
      return { ...NADA, maravedis: Math.max(0, o.cantidad) };
    default:
      return NADA;
  }
}

/**
 * Convierte la intencion en la orden interna: comprueba la propiedad, fija lo que solo fija el
 * servidor y calcula el coste con las reglas y los modificadores efectivos de la casa.
 */
export function construirOrden(intencion: Intencion, ctx: ContextoDeIntencion): Resultado<Orden> {
  const yo = ctx.estado.jugadores[ctx.jugador];
  if (yo === undefined) {
    return invalidos([error('jugador', `no hay ningun jugador "${ctx.jugador}" en la partida`)]);
  }
  const o = intencion.bosquejo;
  const errores = comprobarPropiedad(o, ctx, yo);
  if (errores.length > 0) return invalidos(errores);

  const { estado, reglas } = ctx;
  const coste = costeDeIntencion(
    o,
    yo,
    'comarca' in o ? estado.comarcas[o.comarca] : undefined,
    reglas,
  );
  const fijos = {
    id: ctx.id,
    jugador: ctx.jugador,
    turnoAlta: estado.turno,
    estado: 'pendiente' as const,
    turnosHechos: 0,
    motivoEspera: null,
    delMayordomo: false,
    turnoProgramado: intencion.turnoProgramado,
  };
  const sinCola = { cola: null, turnosTotales: 1, coste: NADA };
  const enComarca = (comarca: IdComarca): string => `comarca:${comarca}`;

  switch (o.tipo) {
    case 'construir':
      return valido({
        ...o,
        ...fijos,
        turnosTotales: 1,
        coste,
        cola: enComarca(o.comarca),
      });
    case 'derribar':
      return valido({ ...o, ...fijos, ...sinCola, cola: enComarca(o.comarca) });
    case 'roturar': {
      const comarca = estado.comarcas[o.comarca];
      if (comarca === undefined) {
        return invalidos([error('comarca', `la comarca "${o.comarca}" no existe en la partida`)]);
      }
      return valido({
        ...o,
        ...fijos,
        turnosTotales: 1,
        coste,
        cola: enComarca(o.comarca),
      });
    }
    case 'obra-mayor':
      return valido({
        ...o,
        ...fijos,
        turnosTotales: 1,
        coste,
        cola: enComarca(o.comarca),
      });
    case 'aperos':
      return valido({
        ...o,
        ...fijos,
        turnosTotales: 1,
        coste,
        cola: enComarca(o.comarca),
      });
    case 'formar-recua':
      return valido({
        ...o,
        ...fijos,
        ...sinCola,
        acemilas: reglas.movimiento.acemilasPorRecua,
        coste,
      });
    case 'formar-rebanyo':
      return valido({
        ...o,
        ...fijos,
        ...sinCola,
        cabezas: reglas.ganaderia.cabezasPorRebanyo,
        coste,
      });
    case 'ruta':
      return valido({
        ...o,
        ...fijos,
        ...sinCola,
        cola: o.recua === null ? null : `recua:${o.recua}`,
      });
    case 'carga':
    case 'cometido':
      return valido({ ...o, ...fijos, ...sinCola, cola: `recua:${o.recua}` });
    case 'mercado':
      return valido({ ...o, ...fijos, ...sinCola, turnosTotales: intencion.turnos ?? 1 });
    case 'regalo':
      return valido({
        ...o,
        ...fijos,
        ...sinCola,
        coste,
      });
    case 'incorporar':
      return valido({
        ...o,
        ...fijos,
        ...sinCola,
        coste,
        turnosTotales: reglas.influencia.turnosIncorporar,
      });
    case 'letra-de-cambio':
      // Reserva justo lo que se cambia: la comision sale de lo que llega (fases/07-letras.ts).
      return valido({ ...o, ...fijos, ...sinCola, coste });
    case 'trasladar-corte':
      return valido({ ...o, ...fijos, ...sinCola, coste });
    case 'politica':
    case 'tradicion':
    case 'mayordomo':
    case 'cola':
    case 'anular':
    case 'contrato':
    case 'responder-contrato':
    case 'portazgo':
      return valido({ ...o, ...fijos, ...sinCola });
    case 'levar':
    case 'licenciar':
    case 'marchar':
    case 'hostilidad':
    case 'asediar':
    case 'tregua':
    case 'aceptar-tregua':
      return valido({ ...o, ...fijos, ...sinCola });
    case 'entrar':
      // Ya esta en la partida: entrar es cosa de la convocatoria, no una orden que se pueda dar.
      return invalidos([error('tipo', 'ya estas en la partida: no se entra dos veces')]);
  }
}
