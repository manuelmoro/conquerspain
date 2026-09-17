// SHA-256 escrito a mano: el nucleo no puede usar el modulo de criptografia de la plataforma
// (CLAUDE.md §4), asi que la huella del estado se calcula aqui, con enteros de 32 bits.
import { canonico } from './serializacion.ts';

const CONSTANTES: readonly number[] = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

const ESTADO_INICIAL: readonly number[] = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];

function rotarDerecha(valor: number, bits: number): number {
  return ((valor >>> bits) | (valor << (32 - bits))) >>> 0;
}

function leer(lista: readonly number[], indice: number): number {
  return lista[indice] ?? 0;
}

/** Codifica un texto en bytes UTF-8, sin depender de la plataforma. */
export function aBytesUtf8(texto: string): number[] {
  const bytes: number[] = [];
  for (const caracter of texto) {
    const punto = caracter.codePointAt(0) ?? 0;
    if (punto < 0x80) {
      bytes.push(punto);
    } else if (punto < 0x800) {
      bytes.push(0xc0 | (punto >> 6), 0x80 | (punto & 0x3f));
    } else if (punto < 0x10000) {
      bytes.push(0xe0 | (punto >> 12), 0x80 | ((punto >> 6) & 0x3f), 0x80 | (punto & 0x3f));
    } else {
      bytes.push(
        0xf0 | (punto >> 18),
        0x80 | ((punto >> 12) & 0x3f),
        0x80 | ((punto >> 6) & 0x3f),
        0x80 | (punto & 0x3f),
      );
    }
  }
  return bytes;
}

/** SHA-256 de un texto, en hexadecimal minusculo. */
export function sha256Hex(texto: string): string {
  const bytes = aBytesUtf8(texto);
  const longitudBits = bytes.length * 8;

  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const alto = Math.floor(longitudBits / 0x100000000);
  const bajo = longitudBits >>> 0;
  bytes.push((alto >>> 24) & 0xff, (alto >>> 16) & 0xff, (alto >>> 8) & 0xff, alto & 0xff);
  bytes.push((bajo >>> 24) & 0xff, (bajo >>> 16) & 0xff, (bajo >>> 8) & 0xff, bajo & 0xff);

  const estado = [...ESTADO_INICIAL];
  const palabras = new Array<number>(64).fill(0);

  for (let inicio = 0; inicio < bytes.length; inicio += 64) {
    for (let i = 0; i < 16; i += 1) {
      const base = inicio + i * 4;
      palabras[i] =
        ((leer(bytes, base) << 24) |
          (leer(bytes, base + 1) << 16) |
          (leer(bytes, base + 2) << 8) |
          leer(bytes, base + 3)) >>>
        0;
    }
    for (let i = 16; i < 64; i += 1) {
      const anterior = leer(palabras, i - 15);
      const reciente = leer(palabras, i - 2);
      const mezcla0 =
        (rotarDerecha(anterior, 7) ^ rotarDerecha(anterior, 18) ^ (anterior >>> 3)) >>> 0;
      const mezcla1 =
        (rotarDerecha(reciente, 17) ^ rotarDerecha(reciente, 19) ^ (reciente >>> 10)) >>> 0;
      palabras[i] = (leer(palabras, i - 16) + mezcla0 + leer(palabras, i - 7) + mezcla1) >>> 0;
    }

    let a = leer(estado, 0);
    let b = leer(estado, 1);
    let c = leer(estado, 2);
    let d = leer(estado, 3);
    let e = leer(estado, 4);
    let f = leer(estado, 5);
    let g = leer(estado, 6);
    let h = leer(estado, 7);

    for (let i = 0; i < 64; i += 1) {
      const sigma1 = (rotarDerecha(e, 6) ^ rotarDerecha(e, 11) ^ rotarDerecha(e, 25)) >>> 0;
      const eleccion = ((e & f) ^ (~e & g)) >>> 0;
      const temporal1 = (h + sigma1 + eleccion + leer(CONSTANTES, i) + leer(palabras, i)) >>> 0;
      const sigma0 = (rotarDerecha(a, 2) ^ rotarDerecha(a, 13) ^ rotarDerecha(a, 22)) >>> 0;
      const mayoria = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
      const temporal2 = (sigma0 + mayoria) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temporal1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temporal1 + temporal2) >>> 0;
    }

    estado[0] = (leer(estado, 0) + a) >>> 0;
    estado[1] = (leer(estado, 1) + b) >>> 0;
    estado[2] = (leer(estado, 2) + c) >>> 0;
    estado[3] = (leer(estado, 3) + d) >>> 0;
    estado[4] = (leer(estado, 4) + e) >>> 0;
    estado[5] = (leer(estado, 5) + f) >>> 0;
    estado[6] = (leer(estado, 6) + g) >>> 0;
    estado[7] = (leer(estado, 7) + h) >>> 0;
  }

  return estado.map((palabra) => palabra.toString(16).padStart(8, '0')).join('');
}

/** Huella estable de cualquier valor serializable: la firma de un estado de partida. */
export function huella(valor: unknown): string {
  return sha256Hex(canonico(valor));
}

/**
 * Entero de 32 bits derivado de un texto. Se usa para deshacer empates de forma determinista
 * (docs/02-diseno-nucleo.md §2.4.4), nunca para generar azar de juego.
 */
export function hash32(texto: string): number {
  return Number.parseInt(sha256Hex(texto).slice(0, 8), 16) >>> 0;
}
