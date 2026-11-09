// El montaje de las pruebas del cliente: la API de pruebas del servidor servida por HTTP real, y un
// almacen que entra como la Mesta. Lo comparten las pruebas del cliente.
import { TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type { IdPartida } from '@conquer/nucleo';

import { apiDePrueba, CUENTAS } from '../../servidor/src/api/prueba-comun.ts';
import { servirHttp } from '../../servidor/src/api/http.ts';
import { AHORA } from '../../servidor/src/persistencia/prueba-comun.ts';
import { Almacen } from './almacen.ts';
import { ClienteApi } from './api.ts';
import { GuardadoEnMemoria } from './guardado.ts';

export const MESTA = CUENTAS['mesta'] ?? '';

/** Un cliente contra la API de pruebas por HTTP real, entrando como una cuenta (cabecera x-cuenta). */
export async function montar(opciones: { turnosJugados?: number; nuevaClave?: () => string } = {}) {
  const e = await apiDePrueba({ turnosJugados: opciones.turnosJugados ?? 1 });
  const servidor = await servirHttp(e.api);
  const base = `http://127.0.0.1:${String(servidor.puerto)}`;
  const red = { caida: false, perderRespuestas: false };
  const conCuenta: typeof fetch = async (url, init) => {
    if (red.caida) throw new TypeError('fetch failed');
    const respuesta = await fetch(url, {
      ...init,
      headers: { ...Object.fromEntries(new Headers(init?.headers).entries()), 'x-cuenta': MESTA },
    });
    if (red.perderRespuestas) throw new TypeError('fetch failed');
    return respuesta;
  };
  const api = new ClienteApi({ base, fetch: conCuenta });
  const guardado = new GuardadoEnMemoria();
  let n = 0;
  const almacen = new Almacen({
    api,
    guardado,
    reglas: TABLAS_DEL_JUEGO,
    ahora: () => AHORA + 1000,
    nuevaClave:
      opciones.nuevaClave ??
      (() => {
        n += 1;
        return `k${String(n)}`;
      }),
  });
  const capital = (await e.repo.ultimoEstado('p1' as IdPartida))?.jugadores['mesta']?.capital ?? '';
  return {
    e,
    almacen,
    guardado,
    red,
    capital,
    cerrar: async () => {
      await servidor.cerrar();
      await e.repo.cerrar();
    },
  };
}
