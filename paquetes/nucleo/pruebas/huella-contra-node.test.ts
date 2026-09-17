// Contraste de nuestro SHA-256 contra el de la plataforma. El nucleo no puede usar el modulo de
// criptografia de Node, pero las pruebas si: es la forma de saber que nuestra implementacion es
// correcta y no solo consistente consigo misma.
import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { azarDeTexto } from '../src/utiles/azar.ts';
import { sha256Hex } from '../src/utiles/huella.ts';

function sha256DeNode(texto: string): string {
  return createHash('sha256').update(texto, 'utf8').digest('hex');
}

describe('SHA-256 contrastado con Node', () => {
  it('coincide en textos con acentos, enyes y simbolos', () => {
    const textos = [
      '',
      'abc',
      'cañada real soriana occidental',
      'Señorío de Molina · hierro 4',
      'feria de Medina del Campo, segunda quincena de mayo',
      String.fromCodePoint(0x1f600),
      '€ 1000 maravedis',
    ];
    for (const texto of textos) {
      expect(sha256Hex(texto), texto).toBe(sha256DeNode(texto));
    }
  });

  it('coincide en 300 textos generados con semilla fija, de longitudes variadas', () => {
    const azar = azarDeTexto('contraste-sha256');
    const alfabeto = 'abcdefghijklmnopqrstuvwxyzáéíóúñÑ0123456789 |-_.';
    for (let caso = 0; caso < 300; caso += 1) {
      // Longitudes alrededor de los limites de bloque (55, 56, 63, 64, 119, 120...).
      const longitud = azar.entreInclusive(0, 200);
      let texto = '';
      for (let i = 0; i < longitud; i += 1) {
        texto += alfabeto.charAt(azar.entero(alfabeto.length));
      }
      expect(sha256Hex(texto), `longitud ${String(longitud)}`).toBe(sha256DeNode(texto));
    }
  });

  it('coincide justo en los limites de bloque', () => {
    for (const longitud of [54, 55, 56, 57, 63, 64, 65, 119, 120, 121, 128]) {
      const texto = 'a'.repeat(longitud);
      expect(sha256Hex(texto), `longitud ${String(longitud)}`).toBe(sha256DeNode(texto));
    }
  });
});
