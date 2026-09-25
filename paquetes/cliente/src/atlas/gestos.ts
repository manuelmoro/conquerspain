// Toque o arrastre (ficha T-088 §2.1): con raton y con dedo, un gesto que se mueve menos de unos
// pixeles es un toque y abre la comarca; si se mueve mas, es un arrastre y mueve el mapa.
export const UMBRAL_DE_ARRASTRE_PX = 4;

export function esArrastre(
  inicio: { readonly x: number; readonly y: number },
  ahora: { readonly x: number; readonly y: number },
): boolean {
  return Math.hypot(ahora.x - inicio.x, ahora.y - inicio.y) > UMBRAL_DE_ARRASTRE_PX;
}
