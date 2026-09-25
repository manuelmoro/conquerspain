// Un enrutador minimo: patrones con `:parametro`, 404 si la ruta no existe y 405 si existe con otro
// metodo (ficha T-062 §4.1).
import { ErrorDeApi } from './errores.ts';

export interface Ruta<M> {
  readonly metodo: string;
  readonly patron: string;
  readonly manejador: M;
}

export interface Encontrada<M> {
  readonly manejador: M;
  readonly parametros: Readonly<Record<string, string>>;
}

function segmentos(ruta: string): string[] {
  return ruta.split('/').filter((s) => s !== '');
}

function casar(patron: readonly string[], ruta: readonly string[]): Record<string, string> | null {
  if (patron.length !== ruta.length) return null;
  const parametros: Record<string, string> = {};
  for (const [i, parte] of patron.entries()) {
    const real = ruta[i];
    if (real === undefined) return null;
    if (parte.startsWith(':')) parametros[parte.slice(1)] = decodeURIComponent(real);
    else if (parte !== real) return null;
  }
  return parametros;
}

export function encontrar<M>(
  rutas: readonly Ruta<M>[],
  metodo: string,
  ruta: string,
): Encontrada<M> {
  const partes = segmentos(ruta);
  const otrosMetodos: string[] = [];
  for (const candidata of rutas) {
    let parametros: Record<string, string> | null;
    try {
      parametros = casar(segmentos(candidata.patron), partes);
    } catch {
      throw new ErrorDeApi('ruta-desconocida', `La ruta "${ruta}" no tiene un formato valido.`);
    }
    if (parametros === null) continue;
    if (candidata.metodo === metodo) return { manejador: candidata.manejador, parametros };
    otrosMetodos.push(candidata.metodo);
  }
  if (otrosMetodos.length > 0) {
    throw new ErrorDeApi(
      'metodo-no-permitido',
      `La ruta "${ruta}" no admite ${metodo}: prueba con ${[...new Set(otrosMetodos)].join(' o ')}.`,
      { allow: [...new Set(otrosMetodos)].join(', ') },
    );
  }
  throw new ErrorDeApi('ruta-desconocida', `No existe la ruta "${ruta}".`);
}
