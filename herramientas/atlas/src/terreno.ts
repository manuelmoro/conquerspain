// Terreno y potenciales de las comarcas de relleno: las que el catalogo todavia no ha escrito.
// Es una aproximacion geografica de andar por casa, a proposito: existe para que el mapa sea
// jugable mientras se escribe el catalogo real, y T-012 y T-015 la van sustituyendo por datos
// documentados, comarca a comarca.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { NivelPotencial, Potencial, Terreno } from '@conquer/nucleo';
import { azarDeTexto } from '@conquer/nucleo';
import { limpiarJsonc } from '@conquer/mundo';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));

export interface Zona {
  readonly terreno: Terreno;
  readonly nombre: string;
  readonly caja: readonly [number, number, number, number];
}

export interface PuertoCandidato {
  readonly nombre: string;
  readonly caja: readonly [number, number, number, number];
}

interface Relieve {
  readonly zonas: readonly Zona[];
  readonly puertos: readonly PuertoCandidato[];
}

export function cargarRelieve(): Relieve {
  const texto = readFileSync(join(RAIZ, 'relieve.jsonc'), 'utf8');
  return JSON.parse(limpiarJsonc(texto)) as Relieve;
}

export function dentroDeCaja(
  lon: number,
  lat: number,
  caja: readonly [number, number, number, number],
): boolean {
  return lon >= caja[0] && lon <= caja[1] && lat >= caja[2] && lat <= caja[3];
}

export function terrenoDe(lon: number, lat: number, zonas: readonly Zona[]): Terreno {
  for (const zona of zonas) {
    if (dentroDeCaja(lon, lat, zona.caja)) return zona.terreno;
  }
  return 'llano';
}

/** Potenciales moderados y coherentes con el terreno, sin recursos estrategicos. */
export function potencialesDe(
  terreno: Terreno,
  semilla: string,
): Record<Potencial, NivelPotencial> {
  const azar = azarDeTexto(`potenciales|${semilla}`);
  const entre = (minimo: number, maximo: number): NivelPotencial =>
    azar.entreInclusive(minimo, maximo) as NivelPotencial;

  switch (terreno) {
    case 'vega':
      return {
        labor: entre(3, 4),
        monte: entre(0, 2),
        pasto: entre(1, 2),
        piedra: entre(0, 2),
        hierro: 0,
        sal: 0,
        pesca: 0,
      };
    case 'sierra':
      return {
        labor: entre(0, 2),
        monte: entre(2, 4),
        pasto: entre(2, 4),
        piedra: entre(2, 4),
        hierro: 0,
        sal: 0,
        pesca: 0,
      };
    case 'ondulado':
      return {
        labor: entre(1, 3),
        monte: entre(2, 4),
        pasto: entre(1, 3),
        piedra: entre(1, 3),
        hierro: 0,
        sal: 0,
        pesca: 0,
      };
    case 'costa':
      return {
        labor: entre(1, 3),
        monte: entre(0, 2),
        pasto: entre(1, 2),
        piedra: entre(0, 2),
        hierro: 0,
        sal: 0,
        pesca: entre(2, 4),
      };
    default:
      return {
        labor: entre(2, 4),
        monte: entre(0, 2),
        pasto: entre(1, 3),
        piedra: entre(0, 2),
        hierro: 0,
        sal: 0,
        pesca: 0,
      };
  }
}

/** Jornadas de referencia de un tramo, antes de caminos y estaciones (docs/03 §3.7.2). */
export const JORNADAS_POR_TERRENO: Readonly<Record<Terreno, number>> = {
  llano: 2,
  vega: 2,
  costa: 2,
  ondulado: 3,
  sierra: 5,
};

/** De los dos terrenos de un tramo manda el mas duro. */
export function terrenoDeTramo(a: Terreno, b: Terreno): Terreno {
  return JORNADAS_POR_TERRENO[a] >= JORNADAS_POR_TERRENO[b] ? a : b;
}
