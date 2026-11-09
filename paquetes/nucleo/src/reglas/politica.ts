// La politica de una comarca (docs/03 §3.6 y §3.9): que cambio se puede hacer ahora y cual no. Una
// sola cuenta para la fase 8 y para la ficha (T-089 §4.1).
import type { CargaFiscal, EstadoComarca, Fuero } from '../tipos/estado.ts';
import type { IdJugador } from '../tipos/ids.ts';
import type { Prohibiciones, TablasDeReglas } from '../tipos/reglas.ts';
import { PROHIBIDO_POR_LA_CASA } from './casas/index.ts';

export interface CambioDePolitica {
  readonly fuero: Fuero | null;
  readonly cargaFiscal: CargaFiscal | null;
}

export type MotivoSinPolitica =
  'comarca-ajena' | typeof PROHIBIDO_POR_LA_CASA | 'fuero-reciente' | 'fuero-irreversible';

/**
 * Por que no se puede hacer este cambio de politica ahora, o null si se puede. Los dos primeros
 * motivos cancelan la orden; los del fuero la dejan esperando a que pasen los turnos.
 */
export function impedimentoDePolitica(
  comarca: EstadoComarca | undefined,
  jugador: IdJugador,
  cambio: CambioDePolitica,
  turno: number,
  prohibiciones: Prohibiciones,
  reglas: TablasDeReglas,
): MotivoSinPolitica | null {
  if (comarca === undefined || comarca.duenyo !== jugador) return 'comarca-ajena';
  if (cambio.cargaFiscal === 'dura' && prohibiciones.cargaFiscalDura) return PROHIBIDO_POR_LA_CASA;
  const t = reglas.territorio;
  const cambiaFuero = cambio.fuero !== null && cambio.fuero !== comarca.fuero;
  const desde = turno - comarca.turnoFuero;
  if (cambiaFuero && comarca.turnoFuero > 0 && desde < t.turnosEntreCambiosDeFuero) {
    return 'fuero-reciente';
  }
  if (
    cambiaFuero &&
    comarca.fuero === 'fuero' &&
    comarca.turnoFuero > 0 &&
    desde < t.turnosFueroIrreversible
  ) {
    return 'fuero-irreversible';
  }
  return null;
}
