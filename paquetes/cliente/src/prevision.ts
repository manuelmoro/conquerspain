// La prevision de la bandeja (ficha T-080 §4.1): lo que reserva cada orden y si alcanza, con la misma
// funcion de coste que usa el servidor. Es una prevision: el motor decide al resolver.
import { RECURSOS, costeDeIntencion, validarIntencion } from '@conquer/nucleo';
import type { Recurso, Recursos, TablasDeReglas, VistaJugador } from '@conquer/nucleo';

export interface LineaDePrevision {
  readonly idCliente: string;
  readonly coste: Recursos | null;
  /** false si con lo anterior de la bandeja ya no alcanza; null si la intencion no es valida. */
  readonly cabe: boolean | null;
}

export interface PrevisionDeBandeja {
  readonly lineas: readonly LineaDePrevision[];
  readonly disponible: Recursos;
  readonly restante: Recursos;
}

function sumar(a: Recursos, b: Recursos, signo: 1 | -1): Recursos {
  const salida: Record<Recurso, number> = { ...a };
  for (const r of RECURSOS) salida[r] = a[r] + signo * b[r];
  return salida;
}

export function preverBandeja(
  vista: VistaJugador,
  intenciones: readonly Readonly<Record<string, unknown>>[],
  reglas: TablasDeReglas,
): PrevisionDeBandeja {
  const disponible = sumar(vista.jugador.almacen, vista.jugador.reservado, -1);
  let restante = disponible;
  const lineas: LineaDePrevision[] = [];
  for (const intencion of intenciones) {
    const clave = intencion['idCliente'];
    const idCliente = typeof clave === 'string' ? clave : '';
    const forma = validarIntencion(intencion);
    if (!forma.ok) {
      lineas.push({ idCliente, coste: null, cabe: null });
      continue;
    }
    const orden = forma.valor.bosquejo;
    const citada = 'comarca' in orden ? vista.comarcas[orden.comarca] : undefined;
    const comarca = citada?.nivel === 'propia' ? citada.comarca : undefined;
    const coste = costeDeIntencion(orden, vista.jugador, comarca, reglas);
    // Lo que va en cola no reserva hasta empezar (docs/02 §2.5.1), pero la bandeja lo cuenta: es lo
    // que el jugador se ha comprometido a pagar.
    const despues = sumar(restante, coste, -1);
    const cabe = RECURSOS.every((r) => despues[r] >= 0);
    if (cabe) restante = despues;
    lineas.push({ idCliente, coste, cabe });
  }
  return { lineas, disponible, restante };
}
