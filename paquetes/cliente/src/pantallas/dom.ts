// Ayudas minimas para montar el DOM sin `innerHTML`: todo el texto entra como texto, nunca como HTML.
import { etiquetaDeIcono } from '../accesibilidad.ts';

export function el<K extends keyof HTMLElementTagNameMap>(
  etiqueta: K,
  atributos: Readonly<Record<string, string>> = {},
  ...hijos: readonly (Node | string)[]
): HTMLElementTagNameMap[K] {
  const nodo = document.createElement(etiqueta);
  for (const [nombre, valor] of Object.entries(atributos)) nodo.setAttribute(nombre, valor);
  for (const hijo of hijos) nodo.append(hijo);
  return nodo;
}

export function boton(texto: string, alPulsar: () => void, clase = ''): HTMLButtonElement {
  const b = el(
    'button',
    clase === '' ? { type: 'button' } : { type: 'button', class: clase },
    texto,
  );
  // Un boton de solo icono lleva su nombre para quien no lo ve (T-087).
  const etiqueta = etiquetaDeIcono(texto);
  if (etiqueta !== null) b.setAttribute('aria-label', etiqueta);
  b.addEventListener('click', alPulsar);
  return b;
}
