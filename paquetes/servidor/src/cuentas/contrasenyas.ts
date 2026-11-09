// Las contrasenyas (ficha T-091 §2): scrypt de `node:crypto`, sin dependencias. Se guarda
// `scrypt$<log2 N>$<r>$<p>$<sal>$<hash>` en base64url y se compara en tiempo constante. La contrasenya
// en claro no sale nunca de aqui: ni a la base, ni al registro.
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

/** N = 2^15, r = 8, p = 1: unos 32 MB y algo menos de una decima de segundo por intento. */
const LOG2_N = 15;
const R = 8;
const P = 1;
const LARGO_DE_CLAVE = 64;
const MEMORIA_MAXIMA = 128 * 1024 * 1024;

export const LARGO_MINIMO = 10;
export const LARGO_MAXIMO = 200;

/** Las que primero se prueban: ni una sirve, aunque cumpla el largo. */
const COMUNES: ReadonlySet<string> = new Set([
  '1234567890',
  '12345678910',
  '0987654321',
  'qwertyuiop',
  'contraseña',
  'contrasena1',
  'contraseña1',
  'contraseña123',
  'password123',
  'password1234',
  'passwordpassword',
  'iloveyou123',
  'abcdefghij',
  'aaaaaaaaaa',
  'conquerspain',
  'conquerspain1',
]);

function derivar(clave: string, sal: Buffer, log2N: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolver, rechazar) => {
    scrypt(
      clave.normalize('NFKC'),
      sal,
      LARGO_DE_CLAVE,
      { N: 2 ** log2N, r, p, maxmem: MEMORIA_MAXIMA },
      (error, derivada) => {
        if (error === null) resolver(derivada);
        else rechazar(error);
      },
    );
  });
}

/** El hash que se guarda de una contrasenya, con su sal propia: dos iguales no dan el mismo. */
export async function hashDeClave(clave: string): Promise<string> {
  const sal = randomBytes(16);
  const hash = await derivar(clave, sal, LOG2_N, R, P);
  return [
    'scrypt',
    String(LOG2_N),
    String(R),
    String(P),
    sal.toString('base64url'),
    hash.toString('base64url'),
  ].join('$');
}

/** Si la contrasenya es la de ese hash. Un hash que no se entiende no da paso nunca. */
export async function claveCorrecta(clave: string, guardado: string): Promise<boolean> {
  const [nombre, log2N, r, p, sal, hash] = guardado.split('$');
  if (
    nombre !== 'scrypt' ||
    log2N === undefined ||
    r === undefined ||
    p === undefined ||
    sal === undefined ||
    hash === undefined
  )
    return false;
  const esperado = Buffer.from(hash, 'base64url');
  const calculado = await derivar(
    clave,
    Buffer.from(sal, 'base64url'),
    Number(log2N),
    Number(r),
    Number(p),
  );
  return calculado.length === esperado.length && timingSafeEqual(calculado, esperado);
}

/**
 * Un hash de una contrasenya cualquiera, para gastar el mismo tiempo cuando el correo no tiene cuenta:
 * asi el tiempo de respuesta no dice si existe (T-091 §2).
 */
let hashDeRelleno: Promise<string> | null = null;
export async function gastarComoSiExistiera(clave: string): Promise<void> {
  hashDeRelleno ??= hashDeClave(randomBytes(16).toString('base64url'));
  await claveCorrecta(clave, await hashDeRelleno);
}

/** Por que no vale esta contrasenya, en palabras del jugador; null si vale. */
export function problemaDeClave(clave: unknown, correo: string): string | null {
  if (typeof clave !== 'string' || clave.length < LARGO_MINIMO)
    return `La contraseña tiene que tener al menos ${String(LARGO_MINIMO)} caracteres.`;
  if (clave.length > LARGO_MAXIMO)
    return `La contraseña no puede pasar de ${String(LARGO_MAXIMO)} caracteres.`;
  const minuscula = clave.toLowerCase();
  if (minuscula === correo.toLowerCase() || minuscula === correo.split('@')[0]?.toLowerCase())
    return 'La contraseña no puede ser tu correo.';
  if (COMUNES.has(minuscula) || /^(.)\1+$/.test(clave))
    return 'Esa contraseña es de las primeras que se prueban: elige otra.';
  return null;
}
