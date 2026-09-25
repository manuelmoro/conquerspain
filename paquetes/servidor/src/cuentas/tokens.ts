// Tokens y cookie de sesion (ficha T-063 §4.3). De un token solo se guarda su SHA-256, y la cookie
// va firmada con HMAC para rechazar sin tocar la base lo que no viene de este servidor.
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const NOMBRE_DE_COOKIE = 'sesion';
export const CLAVE_MINIMA_BYTES = 32;

/** 256 bits aleatorios en base64url: no se adivina. */
export function nuevoToken(): string {
  return randomBytes(32).toString('base64url');
}

/** Identificador de cuenta: opaco y sin relacion con el correo. */
export function nuevoIdDeCuenta(): string {
  return `c-${randomBytes(8).toString('hex')}`;
}

export function hashDeToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

function firma(token: string, clave: Uint8Array): string {
  return createHmac('sha256', clave).update(token, 'utf8').digest('base64url');
}

/** El valor de la cookie: `<token>.<firma>`. */
export function valorDeCookie(token: string, clave: Uint8Array): string {
  return `${token}.${firma(token, clave)}`;
}

/** El token de la cookie si viene firmado con esta clave, comparando en tiempo constante. */
export function tokenDeLaCookie(valor: string, clave: Uint8Array): string | null {
  const punto = valor.lastIndexOf('.');
  if (punto <= 0) return null;
  const token = valor.slice(0, punto);
  const recibida = Buffer.from(valor.slice(punto + 1), 'utf8');
  const esperada = Buffer.from(firma(token, clave), 'utf8');
  if (recibida.length !== esperada.length) return null;
  return timingSafeEqual(recibida, esperada) ? token : null;
}

/** El valor de nuestra cookie dentro de la cabecera `cookie`, o null. */
export function valorEnLaCabecera(cabecera: string | undefined): string | null {
  if (cabecera === undefined) return null;
  for (const trozo of cabecera.split(';')) {
    const [nombre, ...resto] = trozo.trim().split('=');
    if (nombre === NOMBRE_DE_COOKIE) return resto.join('=');
  }
  return null;
}

export function cabeceraSetCookie(
  valor: string,
  opciones: { readonly maxAgeSegundos: number; readonly segura: boolean },
): string {
  const partes = [
    `${NOMBRE_DE_COOKIE}=${valor}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${String(opciones.maxAgeSegundos)}`,
  ];
  if (opciones.segura) partes.push('Secure');
  return partes.join('; ');
}
