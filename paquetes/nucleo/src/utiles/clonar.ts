// Copia profunda de valores serializables. El motor trabaja siempre sobre una copia del estado:
// el que le entra no se toca nunca (docs/07-arquitectura.md §7.2).

/** Copia profunda de objetos, listas y valores primitivos. No admite funciones ni clases. */
export function clonar<T>(valor: T): T {
  if (valor === null || typeof valor !== 'object') return valor;
  if (Array.isArray(valor)) {
    const copia: unknown[] = [];
    for (const elemento of valor) copia.push(clonar(elemento));
    return copia as T;
  }
  const copia: Record<string, unknown> = {};
  for (const [clave, contenido] of Object.entries(valor)) {
    copia[clave] = clonar(contenido);
  }
  return copia as T;
}

/**
 * Version mutable de un tipo de solo lectura, para el borrador que manejan las fases.
 *
 * La recursion se para en los primitivos: los identificadores del dominio son cadenas con marca
 * de tipo, y recorrerlos como si fueran objetos destruiria la marca.
 */
export type Mutable<T> = T extends string | number | boolean | bigint | symbol | null | undefined
  ? T
  : T extends readonly (infer Elemento)[]
    ? Mutable<Elemento>[]
    : T extends object
      ? { -readonly [Clave in keyof T]: Mutable<T[Clave]> }
      : T;
