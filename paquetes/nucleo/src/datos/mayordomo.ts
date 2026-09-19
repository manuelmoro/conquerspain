// Los limites de jugar sin estar (docs/02-diseno-nucleo.md §2.5; ficha T-045).
//
// El mayordomo arranca con tres reglas y gana una por nivel de mercado en la capital, hasta seis:
// es un capataz con instrucciones, no una IA. El plan de temporada llega a seis turnos.
import type { DatosMayordomo } from '../tipos/reglas.ts';

export const MAYORDOMO: DatosMayordomo = {
  reglasIniciales: 3,
  reglasPorNivelDeMercado: 1,
  reglasMaximas: 6,
  turnosDePlan: 6,
  // Lo bastante para dar la vuelta a un circuito corriente sin volver a pasar por casa.
  jornadasDeRepuesto: 12,
  fallosDePrecioParaParar: 3,
};
