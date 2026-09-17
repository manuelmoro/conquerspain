// Azar con semilla: el motor nunca usa el azar de la plataforma.
// Cada tirada declara su ambito, de modo que anyadir una tirada en una fase no desplaza las
// tiradas de otra fase, que es el fallo clasico que rompe las partidas guardadas.
import type { Milesimas } from './enteros.ts';
import { sha256Hex } from './huella.ts';

const DOS_A_LA_32 = 0x100000000;

export interface Azar {
  /** Entero uniforme en [0, maximoExclusivo). */
  entero(maximoExclusivo: number): number;
  /** Entero uniforme en [minimo, maximo], ambos incluidos. */
  entreInclusive(minimo: number, maximo: number): number;
  /** Milesimas uniformes en [minimoMil, maximoMil], ambos incluidos. */
  milesimas(minimoMil: Milesimas, maximoMil: Milesimas): Milesimas;
  /** Un elemento de la lista, que no puede estar vacia. */
  elegir<T>(lista: readonly T[]): T;
  /** Copia barajada de la lista; la original no se toca. */
  barajar<T>(lista: readonly T[]): T[];
}

function rotarIzquierda(valor: number, bits: number): number {
  return ((valor << bits) | (valor >>> (32 - bits))) >>> 0;
}

/**
 * Generador xoshiro128** sobre enteros de 32 bits sin signo.
 * El estado inicial sale de la huella del texto de semilla, asi que semillas parecidas
 * («cosecha» y «cosechas») dan secuencias completamente distintas.
 */
export function azarDeTexto(semilla: string): Azar {
  const digesto = sha256Hex(semilla);
  let s0 = Number.parseInt(digesto.slice(0, 8), 16) >>> 0;
  let s1 = Number.parseInt(digesto.slice(8, 16), 16) >>> 0;
  let s2 = Number.parseInt(digesto.slice(16, 24), 16) >>> 0;
  let s3 = Number.parseInt(digesto.slice(24, 32), 16) >>> 0;
  if ((s0 | s1 | s2 | s3) === 0) s0 = 1;

  function siguiente(): number {
    const resultado = Math.imul(rotarIzquierda(Math.imul(s1, 5) >>> 0, 7), 9) >>> 0;
    const desplazado = (s1 << 9) >>> 0;
    s2 = (s2 ^ s0) >>> 0;
    s3 = (s3 ^ s1) >>> 0;
    s1 = (s1 ^ s2) >>> 0;
    s0 = (s0 ^ s3) >>> 0;
    s2 = (s2 ^ desplazado) >>> 0;
    s3 = rotarIzquierda(s3, 11);
    return resultado;
  }

  function entero(maximoExclusivo: number): number {
    if (!Number.isSafeInteger(maximoExclusivo) || maximoExclusivo <= 0) {
      throw new Error(
        `El maximo de una tirada debe ser un entero positivo y es ${String(maximoExclusivo)}.`,
      );
    }
    if (maximoExclusivo > DOS_A_LA_32) {
      throw new Error('Las tiradas del motor no pasan de 2^32 valores distintos.');
    }
    // Se descartan los valores del tramo sobrante para que el reparto sea uniforme.
    const limite = DOS_A_LA_32 - (DOS_A_LA_32 % maximoExclusivo);
    let valor = siguiente();
    while (valor >= limite) valor = siguiente();
    return valor % maximoExclusivo;
  }

  function entreInclusive(minimo: number, maximo: number): number {
    if (!Number.isSafeInteger(minimo) || !Number.isSafeInteger(maximo)) {
      throw new Error('Los extremos de una tirada deben ser enteros.');
    }
    if (minimo > maximo) {
      throw new Error(`El intervalo [${String(minimo)}, ${String(maximo)}] esta del reves.`);
    }
    return minimo + entero(maximo - minimo + 1);
  }

  return {
    entero,
    entreInclusive,
    milesimas: (minimoMil, maximoMil) => entreInclusive(minimoMil, maximoMil),
    elegir<T>(lista: readonly T[]): T {
      if (lista.length === 0) {
        throw new Error('No se puede elegir de una lista vacia.');
      }
      const elegido = lista[entero(lista.length)];
      if (elegido === undefined) {
        throw new Error('La lista tiene huecos: el azar del motor solo recorre listas completas.');
      }
      return elegido;
    },
    barajar<T>(lista: readonly T[]): T[] {
      const copia = [...lista];
      for (let i = copia.length - 1; i > 0; i -= 1) {
        const j = entero(i + 1);
        const a = copia[i];
        const b = copia[j];
        if (a === undefined || b === undefined) {
          throw new Error('La lista tiene huecos: el azar del motor solo baraja listas completas.');
        }
        copia[i] = b;
        copia[j] = a;
      }
      return copia;
    },
  };
}

/**
 * Generador de una tirada concreta de la partida.
 * El ambito identifica para que es la tirada («cosecha», «hallazgo», «rumor»), y el
 * identificador, sobre que entidad se tira.
 */
export function azarDe(semillaPartida: string, turno: number, ambito: string, id: string): Azar {
  if (!Number.isSafeInteger(turno)) {
    throw new Error(`El turno de una tirada debe ser un entero y es ${String(turno)}.`);
  }
  return azarDeTexto(`${semillaPartida}|${String(turno)}|${ambito}|${id}`);
}
