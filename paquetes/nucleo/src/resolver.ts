// La unica puerta de entrada al motor: resolver un turno.
//
// El orden de las fases es fijo y esta documentado en docs/02-diseno-nucleo.md §2.4.1. Dentro de
// una fase, el resultado no puede depender del orden en que llegaron las ordenes ni del orden de
// los jugadores: por eso las ordenes se ordenan por identificador antes de empezar.
import { crearContexto } from './contexto.ts';
import type { Contexto } from './contexto.ts';
import { ErrorDeMotor } from './errores.ts';
import { faseCalendario } from './fases/01-calendario.ts';
import { faseProduccion } from './fases/02-produccion.ts';
import { faseConsumo } from './fases/03-consumo.ts';
import { faseMovimiento } from './fases/04-movimiento.ts';
import { faseCometidos } from './fases/05-cometidos.ts';
import { faseObras } from './fases/06-obras.ts';
import { faseMercado } from './fases/07-mercado.ts';
import { faseTerritorio } from './fases/08-territorio.ts';
import { fasePoblacion } from './fases/09-poblacion.ts';
import { faseAcontecimientos } from './fases/10-acontecimientos.ts';
import { fasePrestigio } from './fases/11-prestigio.ts';
import { faseCronica } from './fases/12-cronica.ts';
import { darDeAltaOrdenesNuevas, retirarOrdenesCerradas } from './ordenes.ts';
import { registrarSuceso } from './sucesos.ts';
import type { Cronica, NombreFase, Suceso } from './tipos/cronica.ts';
import type { EstadoPartida } from './tipos/estado.ts';
import type { IdJugador } from './tipos/ids.ts';
import type { Mundo } from './tipos/mundo.ts';
import type { Orden } from './tipos/ordenes.ts';
import type { TablasDeReglas } from './tipos/reglas.ts';
import { VERSION_REGLAS } from './tipos/reglas.ts';
import { componerCronica } from './reglas/cronica.ts';
import { huella } from './utiles/huella.ts';
import { idsEnOrden } from './utiles/orden.ts';

export type Fase = (ctx: Contexto) => void;

/** Las doce fases del turno, en el orden en que se ejecutan. */
export const FASES: readonly (readonly [NombreFase, Fase])[] = [
  ['calendario', faseCalendario],
  ['produccion', faseProduccion],
  ['consumo', faseConsumo],
  ['movimiento', faseMovimiento],
  ['cometidos', faseCometidos],
  ['obras', faseObras],
  ['mercado', faseMercado],
  ['territorio', faseTerritorio],
  ['poblacion', fasePoblacion],
  ['acontecimientos', faseAcontecimientos],
  ['prestigio', fasePrestigio],
  ['cronica', faseCronica],
];

export interface ResultadoTurno {
  /** Estado nuevo. El de entrada no se toca. */
  readonly estado: EstadoPartida;
  readonly cronicas: Readonly<Record<string, Cronica>>;
  /** Registro completo y ordenado de lo que paso, para depurar y para auditar. */
  readonly sucesos: readonly Suceso[];
}

function comprobarEntrada(estado: EstadoPartida, ordenes: readonly Orden[]): void {
  if (estado.version !== VERSION_REGLAS) {
    throw new ErrorDeMotor(
      'version-incompatible',
      `La partida es de la version de reglas ${String(estado.version)} y el motor es la ${String(VERSION_REGLAS)}: hay que migrarla antes de resolver.`,
      { partida: estado.version, motor: VERSION_REGLAS },
    );
  }
  for (const orden of ordenes) {
    if (orden.turnoAlta !== estado.turno) {
      throw new ErrorDeMotor(
        'orden-de-otro-turno',
        `La orden "${orden.id}" es del turno ${String(orden.turnoAlta)} y se esta resolviendo el ${String(estado.turno)}.`,
        { orden: orden.id, turnoAlta: orden.turnoAlta, turno: estado.turno },
      );
    }
    if (estado.jugadores[orden.jugador] === undefined) {
      throw new ErrorDeMotor(
        'orden-invalida',
        `La orden "${orden.id}" es de un jugador que no esta en la partida.`,
        { orden: orden.id, jugador: orden.jugador },
      );
    }
  }
}

/**
 * Resuelve un turno completo.
 *
 * `ordenes` son las **nuevas** de este turno; las que ya estaban vivas viajan en el estado.
 * El resultado es determinista: mismo estado, mismas ordenes y misma semilla dan el mismo turno.
 */
export function resolverTurno(
  estado: EstadoPartida,
  ordenes: readonly Orden[],
  mundo: Mundo,
  reglas: TablasDeReglas,
): ResultadoTurno {
  comprobarEntrada(estado, ordenes);

  const ctx = crearContexto(estado, ordenes, mundo, reglas);
  registrarSuceso(ctx.sucesos, 'calendario', 'turno.empieza', {
    turno: ctx.turno,
    ordenesNuevas: ctx.ordenes.length,
  });

  darDeAltaOrdenesNuevas(ctx);

  for (const [nombre, fase] of FASES) {
    ctx.fase = nombre;
    fase(ctx);
  }
  retirarOrdenesCerradas(ctx);

  ctx.estado.turno = ctx.turno + 1;
  ctx.estado.huellaTurnoAnterior = huella(ctx.estado);

  const cronicas: Record<string, Cronica> = {};
  const fuentes = { estado: ctx.estado, sucesos: ctx.sucesos, turno: ctx.turno, mundo, reglas };
  for (const id of idsEnOrden(ctx.estado.jugadores)) {
    cronicas[id] = componerCronica(id as IdJugador, fuentes);
  }

  return { estado: ctx.estado, cronicas, sucesos: ctx.sucesos };
}
