// Lo que cuesta cada cosa a cada casa (docs/04-casas-y-tradiciones.md; ficha T-041 §4.3).
//
// Funciones puras: son lo que reservara el servidor al dar la orden (T-062) y lo que ensenya la
// interfaz. El motor paga siempre lo que reservo la orden, asi que ninguna casa puede pagar menos
// de lo que dice esta tabla sin que el servidor lo consienta.
import type { Recursos } from '../../tipos/recursos.ts';
import { recursosSegun } from '../../tipos/recursos.ts';
import type { Modificadores, TablasDeReglas, TipoEdificio } from '../../tipos/reglas.ts';
import { MIL, multiplicarFactores } from '../../utiles/enteros.ts';

export { costeDeObraMayor } from '../obras.ts';

function porFactor(base: Recursos, factorMil: number): Recursos {
  return recursosSegun((r) => multiplicarFactores(base[r], [factorMil]));
}

export function costeDeEdificio(
  tipo: TipoEdificio,
  casa: Modificadores,
  reglas: TablasDeReglas,
): Recursos {
  return porFactor(reglas.edificios[tipo].coste, casa.costeEdificioMil[tipo] ?? MIL);
}

export function costeDeRecua(casa: Modificadores, reglas: TablasDeReglas): Recursos {
  return porFactor(reglas.movimiento.costeFormarRecua, casa.costeRecuaMil);
}

export function costeDeRebanyo(casa: Modificadores, reglas: TablasDeReglas): Recursos {
  return porFactor(reglas.ganaderia.costeFormarRebanyo, casa.costeRebanyoMil);
}

export function costeDeAperos(reglas: TablasDeReglas): Recursos {
  return reglas.obras.costeAperos;
}
