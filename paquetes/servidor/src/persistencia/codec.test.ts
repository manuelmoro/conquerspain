// El codec del estado (ficha T-060 §4.2 y §4.3): ida y vuelta exacta y corrupcion detectada.
import { gzipSync } from 'node:zlib';

import { describe, expect, it } from 'vitest';

import { canonico, huella } from '@conquer/nucleo';

import { codificarEstado, decodificarEstado } from './codec.ts';
import { ErrorDePersistencia } from './errores.ts';
import { partidaDePrueba } from './prueba-comun.ts';

const { estado, mundo } = partidaDePrueba();

function opciones(huellaEsperada: string) {
  return { partida: estado.id, turno: estado.turno, huellaEsperada, mundo };
}

describe('el codec del estado', () => {
  it('guarda y relee el mismo estado: misma huella y misma forma canonica', () => {
    const codificado = codificarEstado(estado);
    expect(codificado.huella).toBe(huella(estado));
    const leido = decodificarEstado(codificado.contenido, opciones(codificado.huella));
    expect(huella(leido)).toBe(codificado.huella);
    expect(canonico(leido)).toBe(canonico(estado));
  });

  it('comprime: el estado ocupa una fraccion de su forma canonica', () => {
    const codificado = codificarEstado(estado);
    expect(codificado.contenido.length).toBeLessThan(codificado.bytesSinComprimir / 4);
  });

  it('un estado alterado con la huella vieja no se lee: huella-no-coincide', () => {
    const codificado = codificarEstado(estado);
    const alterado = { ...estado, siguienteId: estado.siguienteId + 1 };
    const contenido = gzipSync(Buffer.from(canonico(alterado), 'utf8'));
    expect(() => decodificarEstado(contenido, opciones(codificado.huella))).toThrow(
      expect.objectContaining({ codigo: 'huella-no-coincide' }) as Error,
    );
  });

  it('bytes que no son un gzip: huella-no-coincide, con la partida y el turno en el mensaje', () => {
    let error: unknown;
    try {
      decodificarEstado(new Uint8Array([1, 2, 3]), opciones('x'));
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(ErrorDePersistencia);
    expect((error as ErrorDePersistencia).codigo).toBe('huella-no-coincide');
    expect((error as ErrorDePersistencia).message).toContain(estado.id);
  });

  it('un estado con la huella bien y la forma rota: estado-invalido', () => {
    const roto = { ...estado, turno: 'uno' };
    const contenido = gzipSync(Buffer.from(canonico(roto), 'utf8'));
    expect(() => decodificarEstado(contenido, opciones(huella(roto)))).toThrow(
      expect.objectContaining({ codigo: 'estado-invalido' }) as Error,
    );
  });
});
