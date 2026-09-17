// Forma canonica de un valor: la misma entrada produce siempre exactamente el mismo texto.
// De aqui sale la huella del estado, y con ella los tests de reproduccion de partidas.
import { comparar } from './orden.ts';

function rutaHija(ruta: string, clave: string): string {
  return ruta === '' ? clave : `${ruta}.${clave}`;
}

function escribir(valor: unknown, ruta: string, partes: string[]): void {
  if (valor === null) {
    partes.push('null');
    return;
  }
  switch (typeof valor) {
    case 'boolean':
      partes.push(valor ? 'true' : 'false');
      return;
    case 'number':
      if (!Number.isSafeInteger(valor)) {
        throw new Error(
          `El campo "${ruta === '' ? '(raiz)' : ruta}" no es un entero seguro: ${String(valor)}. ` +
            'En el motor no hay coma flotante: las fracciones van en milesimas (CLAUDE.md §4).',
        );
      }
      partes.push(String(valor));
      return;
    case 'string':
      partes.push(JSON.stringify(valor));
      return;
    case 'object':
      break;
    default:
      throw new Error(
        `El campo "${ruta === '' ? '(raiz)' : ruta}" es de tipo ${typeof valor}, ` +
          'que no se puede serializar de forma canonica.',
      );
  }

  if (Array.isArray(valor)) {
    partes.push('[');
    valor.forEach((elemento: unknown, indice) => {
      if (indice > 0) partes.push(',');
      // En una lista, un hueco vacio se escribe como null, igual que en JSON.
      escribir(elemento === undefined ? null : elemento, rutaHija(ruta, String(indice)), partes);
    });
    partes.push(']');
    return;
  }

  const registro = valor as Record<string, unknown>;
  const claves = Object.keys(registro)
    .filter((clave) => registro[clave] !== undefined)
    .sort(comparar);
  partes.push('{');
  claves.forEach((clave, indice) => {
    if (indice > 0) partes.push(',');
    partes.push(JSON.stringify(clave), ':');
    escribir(registro[clave], rutaHija(ruta, clave), partes);
  });
  partes.push('}');
}

/**
 * Serializa en forma canonica: claves ordenadas, sin espacios, solo enteros.
 * Lanza error si aparece un numero con decimales, indicando la ruta del campo culpable.
 */
export function canonico(valor: unknown): string {
  if (valor === undefined) {
    throw new Error('No se puede serializar "undefined" en forma canonica.');
  }
  const partes: string[] = [];
  escribir(valor, '', partes);
  return partes.join('');
}
