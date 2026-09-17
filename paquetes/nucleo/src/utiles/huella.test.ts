import { describe, expect, it } from 'vitest';

import { aBytesUtf8, hash32, huella, sha256Hex } from './huella.ts';

describe('SHA-256 propio', () => {
  it('reproduce los vectores oficiales', () => {
    expect(sha256Hex('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    expect(sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
    expect(sha256Hex('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq')).toBe(
      '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1',
    );
  });

  it('cambia por completo con un solo caracter distinto', () => {
    expect(sha256Hex('cosecha')).not.toBe(sha256Hex('cosechas'));
    expect(sha256Hex('cosecha')).toHaveLength(64);
  });

  it('codifica UTF-8 a mano, sin depender de la plataforma', () => {
    expect(aBytesUtf8('a')).toEqual([0x61]);
    expect(aBytesUtf8('ñ')).toEqual([0xc3, 0xb1]);
    expect(aBytesUtf8('€')).toEqual([0xe2, 0x82, 0xac]);
    expect(aBytesUtf8(String.fromCodePoint(0x1f600))).toEqual([0xf0, 0x9f, 0x98, 0x80]);
  });

  it('aguanta textos largos que ocupan varios bloques', () => {
    const largo = 'cañada real soriana occidental '.repeat(100);
    expect(sha256Hex(largo)).toHaveLength(64);
    expect(sha256Hex(largo)).toBe(sha256Hex(largo));
  });
});

describe('huella de un valor', () => {
  it('no depende del orden de las claves', () => {
    expect(huella({ a: 1, b: 2 })).toBe(huella({ b: 2, a: 1 }));
  });

  it('cambia si cambia cualquier dato', () => {
    expect(huella({ turno: 14 })).not.toBe(huella({ turno: 15 }));
  });

  it('es la huella de la forma canonica', () => {
    expect(huella({ a: 1 })).toBe(sha256Hex('{"a":1}'));
  });
});

describe('hash de 32 bits para desempates', () => {
  it('es determinista y cabe en 32 bits sin signo', () => {
    const valor = hash32('partida|14|incorporar|pinares');
    expect(valor).toBe(hash32('partida|14|incorporar|pinares'));
    expect(Number.isSafeInteger(valor)).toBe(true);
    expect(valor).toBeGreaterThanOrEqual(0);
    expect(valor).toBeLessThan(0x100000000);
  });

  it('separa entradas parecidas', () => {
    expect(hash32('jugador-a')).not.toBe(hash32('jugador-b'));
  });
});
