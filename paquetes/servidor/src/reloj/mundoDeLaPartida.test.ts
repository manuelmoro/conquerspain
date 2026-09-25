// El mundo de una partida se reconstruye y se comprueba con su huella (ficha T-061 §4.6).
import { describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO, huella } from '@conquer/nucleo';

import type { FilaDePartida } from '../persistencia/repositorio.ts';
import {
  AHORA,
  datosDePartida,
  mundoPeninsula,
  partidaDePrueba,
} from '../persistencia/prueba-comun.ts';
import { proveedorDeRecorte } from './mundoDeLaPartida.ts';

function fila(
  estado: ReturnType<typeof partidaDePrueba>['estado'],
  huellaMundo: string,
): FilaDePartida {
  return {
    id: estado.id,
    nombre: 'p',
    semilla: estado.semilla,
    versionReglas: 1,
    huellaMundo,
    intervaloSegundos: 3600,
    ancla: AHORA,
    turnoActual: estado.turno,
    proximaResolucion: null,
    estado: 'activa',
    motivoDetencion: null,
    esDePrueba: true,
    creadaEn: AHORA,
  };
}

describe('proveedorDeRecorte', () => {
  it('reconstruye el mismo recorte con que se creo la partida', () => {
    const { estado, mundo } = partidaDePrueba(['mesta', 'monjes']);
    const proveedor = proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO);
    const reconstruido = proveedor(fila(estado, datosDePartida(estado, mundo).huellaMundo), estado);
    expect(huella(reconstruido)).toBe(huella(mundo));
    // La segunda vez sale de la cache: es el mismo objeto.
    expect(proveedor(fila(estado, huella(mundo)), estado)).toBe(reconstruido);
  });

  it('si el mapa ya no es el de entonces, se niega y dice por que', () => {
    const { estado } = partidaDePrueba(['mesta']);
    const proveedor = proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO);
    expect(() => proveedor(fila(estado, 'otra-huella'), estado)).toThrow(/mundo-no-coincide/);
  });
});
