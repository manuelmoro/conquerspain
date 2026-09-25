// El autenticador real de la API (T-062 §4.2): la cuenta sale de la cookie de sesion.
import type { Autenticador } from '../api/tipos.ts';
import type { ServicioDeCuentas } from './servicio.ts';

export function autenticadorDeSesiones(servicio: ServicioDeCuentas): Autenticador {
  return { identificar: (peticion) => servicio.autenticar(peticion.cabeceras['cookie']) };
}
