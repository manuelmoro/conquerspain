// Recorrido estable. Ninguna fase del motor puede depender del orden en que un objeto
// devuelve sus claves ni de la configuracion regional de la maquina.

/**
 * Compara dos cadenas por punto de codigo Unicode, sin locale.
 * `localeCompare` depende del entorno, asi que aqui no se usa nunca.
 */
export function comparar(a: string, b: string): -1 | 0 | 1 {
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    const puntoA = a.codePointAt(i) ?? 0;
    const puntoB = b.codePointAt(j) ?? 0;
    if (puntoA !== puntoB) return puntoA < puntoB ? -1 : 1;
    i += puntoA > 0xffff ? 2 : 1;
    j += puntoB > 0xffff ? 2 : 1;
  }
  const quedaA = i < a.length;
  const quedaB = j < b.length;
  if (quedaA === quedaB) return 0;
  return quedaA ? 1 : -1;
}

/** Las entradas de un registro, ordenadas por clave. */
export function enOrden<T>(registro: Readonly<Record<string, T>>): [string, T][] {
  return Object.entries(registro).sort(([a], [b]) => comparar(a, b));
}

/** Las claves de un registro, ordenadas. */
export function idsEnOrden(registro: Readonly<Record<string, unknown>>): string[] {
  return Object.keys(registro).sort(comparar);
}

/** Copia la lista ordenada por una clave de texto; no toca la original. */
export function ordenarPor<T>(lista: readonly T[], clave: (elemento: T) => string): T[] {
  return [...lista].sort((a, b) => comparar(clave(a), clave(b)));
}
