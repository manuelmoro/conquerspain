// Estar presente (docs/03-economia.md §3.7.3; ficha T-034 §4.4).
//
// Una recua que se queda en una comarca neutral se gana al concejo poco a poco: la influencia la
// suma la fase de territorio (T-038). Aqui solo se decide si esta presente de verdad este turno,
// que es si esta quieta en una comarca sin duenyo y ha podido comer.
import { bastimentoDe } from './bastimento.ts';
import type { Bastimento } from './bastimento.ts';
import type { EstadoComarca, Recua } from '../tipos/estado.ts';
import type { Estacion, TablasDeReglas } from '../tipos/reglas.ts';

/** Lo que come al turno una recua presente. */
export function bastimentoDePresencia(estacion: Estacion, reglas: TablasDeReglas): Bastimento {
  return bastimentoDe(reglas.cometidos.bastimentoPresenciaMil, estacion, reglas);
}

/** La recua cuenta como presente para la influencia (la consulta T-038). */
export function estaPresente(recua: Recua, comarca: EstadoComarca | undefined): boolean {
  return (
    recua.cometido === 'presencia' &&
    recua.situacion.donde === 'comarca' &&
    recua.ruta.length === 0 &&
    comarca !== undefined &&
    comarca.duenyo === null &&
    !recua.avisadaSinBastimento
  );
}
