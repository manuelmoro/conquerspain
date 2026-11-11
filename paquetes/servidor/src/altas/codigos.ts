// Los codigos de invitacion (ficha T-131 §2.1). Se dictan, se copian de una captura y se teclean en un
// movil: van en el alfabeto de Crockford (sin I, L, O ni U, que se confunden con 1, 0 y V), en mayusculas
// y en tres grupos de cuatro, «K7QD-3MX9-P2RT». Al buscarlos se perdonan los espacios, los guiones, las
// minusculas y las letras parecidas. Los codigos antiguos (base64url, de antes de T-131) se siguen
// aceptando tal cual.
import { randomBytes } from 'node:crypto';

import type { Convocatoria, RepositorioDeConvocatorias } from '../persistencia/convocatorias.ts';

const ALFABETO = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const LARGO = 12;

/** Un codigo nuevo: 12 simbolos de 32, 60 bits; se guarda sin guiones. */
export function codigoNuevo(bytes: Uint8Array = randomBytes(LARGO)): string {
  let codigo = '';
  for (let i = 0; i < LARGO; i += 1) codigo += ALFABETO[(bytes[i] ?? 0) % ALFABETO.length] ?? '0';
  return codigo;
}

/** Lo que alguien ha escrito, en la forma en que se guardan los codigos nuevos; null si no lo es. */
export function normalizarCodigo(escrito: string): string | null {
  const limpio = escrito
    .replace(/[\s-]/g, '')
    .toUpperCase()
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1')
    .replace(/U/g, 'V');
  return new RegExp(`^[${ALFABETO}]{${String(LARGO)}}$`).test(limpio) ? limpio : null;
}

/** La convocatoria de un codigo escrito: tal cual (los antiguos) o normalizado (los nuevos). */
export async function convocatoriaDelCodigo(
  repo: Pick<RepositorioDeConvocatorias, 'convocatoriaPorCodigo'>,
  pedido: unknown,
): Promise<Convocatoria | null> {
  const escrito = typeof pedido === 'string' ? pedido.trim() : '';
  if (escrito === '') return null;
  const exacta = await repo.convocatoriaPorCodigo(escrito);
  if (exacta !== null) return exacta;
  const normal = normalizarCodigo(escrito);
  return normal === null ? null : repo.convocatoriaPorCodigo(normal);
}
