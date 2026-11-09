// La recua o el rebanyo que el jugador ha pedido ver en el mapa (T-093): late hasta que pide otra o
// la vuelve a pulsar. Vive fuera del almacen porque solo cambia el dibujo, nunca el juego.
let destacada: string | null = null;
/** Recien pedida: el mapa se centra en ella una vez, no en cada repintada. */
let porCentrar = false;

export function unidadDestacada(): string | null {
  return destacada;
}

export function destacarUnidad(id: string | null): void {
  destacada = destacada === id ? null : id;
  porCentrar = destacada !== null;
}

/** True una sola vez tras pedirla: quien pinta el mapa la centra y lo da por hecho. */
export function hayQueCentrar(): boolean {
  const toca = porCentrar;
  porCentrar = false;
  return toca;
}
