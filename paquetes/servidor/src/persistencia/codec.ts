// Estado <-> bytes (ficha T-060 §4.2 y §4.3): la forma canonica del nucleo comprimida con gzip, y
// la huella que se comprueba al leer para detectar corrupcion.
import { gunzipSync, gzipSync } from 'node:zlib';

import { canonico, explicar, huella, validarEstado } from '@conquer/nucleo';
import type { EstadoPartida, Mundo } from '@conquer/nucleo';

import { ErrorDePersistencia } from './errores.ts';

export interface EstadoCodificado {
  readonly huella: string;
  readonly contenido: Uint8Array;
  readonly bytesSinComprimir: number;
}

export function codificarEstado(estado: EstadoPartida): EstadoCodificado {
  const texto = canonico(estado);
  const crudo = Buffer.from(texto, 'utf8');
  return {
    huella: huella(estado),
    contenido: gzipSync(crudo, { level: 6 }),
    bytesSinComprimir: crudo.length,
  };
}

export interface OpcionesDeDecodificado {
  readonly partida: string;
  readonly turno: number;
  readonly huellaEsperada: string;
  readonly mundo?: Mundo | undefined;
}

/** Lee un estado guardado: descomprime, comprueba la huella y valida su forma (y el mundo, si se da). */
export function decodificarEstado(
  contenido: Uint8Array,
  opciones: OpcionesDeDecodificado,
): EstadoPartida {
  const { partida, turno, huellaEsperada } = opciones;
  let dato: unknown;
  try {
    dato = JSON.parse(gunzipSync(contenido).toString('utf8'));
  } catch (causa) {
    throw new ErrorDePersistencia(
      'huella-no-coincide',
      `El estado del turno ${String(turno)} de la partida "${partida}" no se puede descomprimir (${
        causa instanceof Error ? causa.message : 'error desconocido'
      }): esta corrupto. Restaura la copia de seguridad de esa base.`,
      { partida, turno },
    );
  }
  const calculada = huella(dato);
  if (calculada !== huellaEsperada) {
    throw new ErrorDePersistencia(
      'huella-no-coincide',
      `El estado del turno ${String(turno)} de la partida "${partida}" no coincide con su huella guardada (guardada ${huellaEsperada.slice(0, 12)}…, calculada ${calculada.slice(0, 12)}…): ha cambiado desde que se guardo. Restaura la copia de seguridad.`,
      { partida, turno },
    );
  }
  const resultado = validarEstado(dato, opciones.mundo);
  if (!resultado.ok) {
    throw new ErrorDePersistencia(
      'estado-invalido',
      `El estado del turno ${String(turno)} de la partida "${partida}" tiene la huella bien pero no valida:\n${explicar(resultado.errores)}\nProbablemente es de otra version de reglas: migralo antes de leerlo.`,
      { partida, turno },
    );
  }
  return resultado.valor;
}
