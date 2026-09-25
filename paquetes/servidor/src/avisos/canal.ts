// El canal en vivo (ficha T-064 §4.2): publicar/suscribir en memoria por partida. El reloj publica
// despues de guardar; las conexiones SSE se suscriben. Con varias instancias habria que compartirlo.
import type { IdPartida } from '@conquer/nucleo';

export interface TurnoResuelto {
  readonly partida: IdPartida;
  readonly turno: number;
}

type Oyente = (evento: TurnoResuelto) => void;

export class CanalDeAvisos {
  private readonly oyentes = new Map<string, Set<Oyente>>();

  /** Se suscribe a una partida; devuelve la funcion que da de baja. */
  suscribir(partida: IdPartida, oyente: Oyente): () => void {
    const suyos = this.oyentes.get(partida) ?? new Set<Oyente>();
    suyos.add(oyente);
    this.oyentes.set(partida, suyos);
    return () => {
      suyos.delete(oyente);
      if (suyos.size === 0) this.oyentes.delete(partida);
    };
  }

  publicar(evento: TurnoResuelto): void {
    for (const oyente of [...(this.oyentes.get(evento.partida) ?? [])]) oyente(evento);
  }

  /** Cuantas conexiones escuchan una partida (para pruebas y metricas). */
  escuchando(partida: IdPartida): number {
    return this.oyentes.get(partida)?.size ?? 0;
  }
}
