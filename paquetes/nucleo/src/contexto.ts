// El contexto de una resolucion: lo que ven las fases mientras resuelven un turno.
import type { Calendario, ClimaAnual, EstadoEstacional } from './reglas/calendario.ts';
import { calendarioDe, climaDelAnyo, estadoEstacionalDe } from './reglas/calendario.ts';
import type { EstadoPartida } from './tipos/estado.ts';
import type { Mundo } from './tipos/mundo.ts';
import type { Orden } from './tipos/ordenes.ts';
import type { TablasDeReglas } from './tipos/reglas.ts';
import type { NombreFase, Suceso } from './tipos/cronica.ts';
import type { Mutable } from './utiles/clonar.ts';
import { clonar } from './utiles/clonar.ts';
import { ordenarPor } from './utiles/orden.ts';

/** Borrador del estado: lo mismo que EstadoPartida, pero con los campos abiertos a escritura. */
export type EstadoBorrador = Mutable<EstadoPartida>;

export interface Contexto {
  readonly mundo: Mundo;
  readonly reglas: TablasDeReglas;
  /** Turno que se esta resolviendo (el que tenia el estado al entrar). */
  readonly turno: number;
  readonly semilla: string;
  /**
   * Calendario, estado estacional y clima del turno. Son funcion pura del turno, asi que se
   * calculan al crear el contexto y no se guardan en el estado; la fase 1 los publica.
   */
  readonly calendario: Calendario;
  readonly estacional: EstadoEstacional;
  readonly clima: ClimaAnual;
  /** Borrador del estado. Solo se toca a traves de `aplicar` (cambios.ts). */
  estado: EstadoBorrador;
  /** Ordenes nuevas de este turno, ya validadas y ordenadas por identificador. */
  readonly ordenes: readonly Orden[];
  readonly sucesos: Suceso[];
  /** Fase que se esta ejecutando; la rellena el orquestador antes de cada fase. */
  fase: NombreFase;
}

/**
 * Copia un valor de solo lectura para meterlo en el borrador del estado.
 * La copia evita ademas que el estado guarde una referencia a datos de quien llamo al motor.
 */
export function comoBorrador<T>(valor: T): Mutable<T> {
  return clonar(valor) as Mutable<T>;
}

export function crearContexto(
  estado: EstadoPartida,
  ordenes: readonly Orden[],
  mundo: Mundo,
  reglas: TablasDeReglas,
): Contexto {
  return {
    mundo,
    reglas,
    turno: estado.turno,
    semilla: estado.semilla,
    calendario: calendarioDe(estado.turno, mundo, reglas),
    estacional: estadoEstacionalDe(estado.turno, mundo, reglas),
    clima: climaDelAnyo(estado.semilla, calendarioDe(estado.turno, mundo, reglas).anyo, mundo),
    // Copia profunda: el estado que nos entra no se toca jamas.
    estado: clonar(estado) as EstadoBorrador,
    ordenes: ordenarPor(ordenes, (orden) => orden.id),
    sucesos: [],
    fase: 'calendario',
  };
}
