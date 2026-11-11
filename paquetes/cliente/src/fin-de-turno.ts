// Dar el turno por terminado (ficha T-124 §3): lo que se cuenta en pantalla de quien ha terminado y
// quien no. Puro: la pantalla solo lo pinta.
import type { QuienJuega } from './api.ts';

export interface ResumenDelFinDeTurno {
  /** Si quien mira ya lo ha dado por terminado. */
  readonly yo: boolean;
  readonly terminados: number;
  readonly total: number;
  /** Una linea: «Habéis terminado 2 de 3. Falta: Casa de la Mesta». */
  readonly linea: string;
  /** Lo que pasara al pulsar, para que nadie lo haga a ciegas. */
  readonly explicacion: string;
}

function enumerar(nombres: readonly string[]): string {
  if (nombres.length <= 1) return nombres.join('');
  return `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1] ?? ''}`;
}

export function resumenDelFinDeTurno(
  quienes: readonly QuienJuega[],
  yo: string,
): ResumenDelFinDeTurno {
  const terminados = quienes.filter((q) => q.terminado).length;
  const total = quienes.length;
  const faltan = quienes.filter((q) => !q.terminado && q.jugador !== yo).map((q) => q.nombre);
  const mio = quienes.find((q) => q.jugador === yo)?.terminado ?? false;
  const linea =
    total <= 1
      ? mio
        ? 'Has terminado el turno.'
        : 'Juegas solo: al terminar el turno se resuelve en el acto.'
      : faltan.length === 0
        ? mio
          ? 'Habéis terminado todos: se está resolviendo.'
          : `Han terminado ${String(terminados)} de ${String(total)}: solo faltas tú.`
        : `Han terminado ${String(terminados)} de ${String(total)}. Falta${faltan.length === 1 ? '' : 'n'}: ${enumerar(faltan)}.`;
  const explicacion = mio
    ? 'Puedes seguir dando órdenes: las nuevas entran igual. Si cambias de idea, reabre el turno.'
    : faltan.length === 0
      ? 'Eres el último: al terminar, el turno se resuelve ahora mismo para todos.'
      : 'Cuando lo hayan terminado todos, el turno se resuelve sin esperar al corte.';
  return { yo: mio, terminados, total, linea, explicacion };
}

/** Una fila de la lista de quien ha terminado (T-128). */
export interface FilaDeQuienJuega {
  readonly nombre: string;
  /** El nombre de su casa, si se sabe. */
  readonly casa: string | null;
  readonly terminado: boolean;
  readonly soyYo: boolean;
  /** «3 turnos sin dar órdenes», si lleva dos o mas: para saber a quien escribir. */
  readonly ausencia: string | null;
}

/**
 * Quien juega, para la lista que se despliega desde «n/m listos» (T-128): primero quien falta, para
 * saber a quien decirle algo; dentro de cada grupo, en el orden en que llegan (el de su identificador).
 */
export function filasDeQuienJuega(
  quienes: readonly QuienJuega[],
  casas: readonly {
    readonly id: string;
    readonly nombre: string;
    readonly turnosSinOrdenes: number;
  }[],
  yo: string,
): readonly FilaDeQuienJuega[] {
  const filas = quienes.map((q) => {
    const casa = casas.find((c) => c.id === q.jugador);
    const sinOrdenes = casa?.turnosSinOrdenes ?? 0;
    return {
      nombre: q.nombre,
      casa: casa?.nombre ?? null,
      terminado: q.terminado,
      soyYo: q.jugador === yo,
      // Lo de uno mismo ya se sabe: solo se dice de los demas.
      ausencia:
        sinOrdenes >= 2 && q.jugador !== yo ? `${String(sinOrdenes)} turnos sin dar órdenes` : null,
    };
  });
  return [...filas.filter((f) => !f.terminado), ...filas.filter((f) => f.terminado)];
}
