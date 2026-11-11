// El tamano de las capturas de la guia (ficha T-130 §2.2). Cada imagen de la guia declara su ancho y su
// alto: asi el navegador reserva su hueco antes de cargarla y los enlaces del indice llevan a su seccion
// (sin tamano, las imagenes perezosas crecian al llegar y empujaban la seccion miles de pixeles).

export interface Dimensiones {
  readonly ancho: number;
  readonly alto: number;
}

/** El ancho y el alto de un JPEG, leidos de su cabecera (el marcador SOF). */
export function dimensionesDeJpeg(datos: Uint8Array): Dimensiones {
  if (datos[0] !== 0xff || datos[1] !== 0xd8) throw new Error('No es un JPEG: falta su firma.');
  let i = 2;
  while (i + 9 < datos.length) {
    if (datos[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marcador = datos[i + 1] ?? 0;
    const largo = ((datos[i + 2] ?? 0) << 8) | (datos[i + 3] ?? 0);
    // SOF0 a SOF15, salvo DHT (C4), JPG (C8) y DAC (CC), que no son cabeceras de imagen.
    if (marcador >= 0xc0 && marcador <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marcador)) {
      const alto = ((datos[i + 5] ?? 0) << 8) | (datos[i + 6] ?? 0);
      const ancho = ((datos[i + 7] ?? 0) << 8) | (datos[i + 8] ?? 0);
      return { ancho, alto };
    }
    i += 2 + largo;
  }
  throw new Error('El JPEG no tiene cabecera de imagen (SOF).');
}

/**
 * Pone a cada `<img src="/guia/…">` de la pagina el ancho y el alto de su captura, quitando los que
 * tuviera. Las imagenes sin captura en `tamanos` se quedan como estan.
 */
export function ponerDimensiones(
  html: string,
  tamanos: Readonly<Record<string, Dimensiones>>,
): string {
  return html.replace(/<img\b[^>]*>/g, (img) => {
    const fichero = /src="\/guia\/([^"]+)"/.exec(img)?.[1];
    const d = fichero === undefined ? undefined : tamanos[fichero];
    if (d === undefined) return img;
    const sin = img.replace(/\s(width|height)="\d+"/g, '');
    return sin.replace(
      /src="\/guia\/[^"]+"/,
      (src) => `${src} width="${String(d.ancho)}" height="${String(d.alto)}"`,
    );
  });
}
