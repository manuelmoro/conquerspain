// Lo puro de la accesibilidad (ficha T-087 §4): el nombre de los botones de solo icono, las comarcas
// en lista para hacer sin mapa lo que se hace en el mapa, y el texto de la barra de abajo en movil.
import type { AtlasDeJugador } from '@conquer/nucleo';

const ICONOS: Readonly<Record<string, string>> = {
  '✕': 'Cerrar',
  '↑': 'Subir',
  '↓': 'Bajar',
};

/** El nombre de un boton que solo lleva un icono, o null si su texto ya se lee. */
export function etiquetaDeIcono(texto: string): string | null {
  return ICONOS[texto.trim()] ?? null;
}

export interface ComarcaEnLista {
  readonly id: string;
  readonly nombre: string;
  readonly nivel: 'propia' | 'explorada' | 'oida';
}

const ORDEN_DE_NIVEL: Readonly<Record<ComarcaEnLista['nivel'], number>> = {
  propia: 0,
  explorada: 1,
  oida: 2,
};

/** Las comarcas conocidas, propias primero, despues exploradas y oidas; cada grupo por nombre. */
export function comarcasEnLista(atlas: AtlasDeJugador): readonly ComarcaEnLista[] {
  return atlas.comarcas
    .map((c) => ({ id: c.id, nombre: c.nombre, nivel: c.nivel }))
    .sort(
      (a, b) =>
        ORDEN_DE_NIVEL[a.nivel] - ORDEN_DE_NIVEL[b.nivel] || a.nombre.localeCompare(b.nombre, 'es'),
    );
}

/** «3 órdenes · faltan 5 h»: lo que dice la barra de abajo en movil. */
export function textoDeLaBarra(ordenes: number, corte: string): string {
  const cuantas =
    ordenes === 0 ? 'Sin órdenes' : `${String(ordenes)} ${ordenes === 1 ? 'orden' : 'órdenes'}`;
  return `${cuantas} · ${corte}`;
}
