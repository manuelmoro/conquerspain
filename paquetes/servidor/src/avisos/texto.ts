// El correo se lee sin abrir el juego (ficha T-064 §4.5): la cronica del propio jugador en texto
// plano, por secciones, con la accion sugerida debajo de cada aviso.
import { SECCIONES_DE_CRONICA } from '@conquer/nucleo';
import type { Cronica, SeccionDeCronica } from '@conquer/nucleo';

const TITULOS: Readonly<Record<SeccionDeCronica, string>> = {
  avisos: 'Avisos',
  sucesos: 'Sucesos',
  economia: 'Economía',
  rumores: 'Rumores',
  hitos: 'Hitos',
};

export function cronicaEnTexto(cronica: Cronica): string {
  const lineas = [`${cronica.fecha} (turno ${String(cronica.turno)})`];
  for (const seccion of SECCIONES_DE_CRONICA) {
    const entradas = cronica.entradas.filter((e) => e.seccion === seccion);
    if (entradas.length === 0) continue;
    lineas.push('', TITULOS[seccion]);
    for (const entrada of entradas) {
      lineas.push(`· ${entrada.texto}`);
      if (entrada.accionSugerida !== null) lineas.push(`  Qué hacer: ${entrada.accionSugerida}`);
    }
  }
  return lineas.join('\n');
}

export function asuntoDelAviso(nombrePartida: string, turnos: readonly number[]): string {
  const ordenados = [...turnos].sort((a, b) => a - b);
  const primero = ordenados[0] ?? 0;
  const ultimo = ordenados.at(-1) ?? primero;
  const cuales =
    primero === ultimo
      ? `turno ${String(primero)}`
      : `turnos ${String(primero)} a ${String(ultimo)}`;
  return `ConquerSpain · ${nombrePartida} · ${cuales} resuelto${primero === ultimo ? '' : 's'}`;
}

/** Cuantas entradas de la seccion de avisos tiene una cronica. */
export function avisosDe(cronica: Cronica): number {
  return cronica.entradas.filter((e) => e.seccion === 'avisos').length;
}
