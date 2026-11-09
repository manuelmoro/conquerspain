// Cuentas con contrasenya (ficha T-091 §4): hash sin claro, sin enumerar cuentas, correo confirmado,
// bloqueo por fuerza bruta, recordarme y restablecer.
import { describe, expect, it } from 'vitest';

import { RepositorioSqlite } from '../persistencia/sqlite.ts';
import { AHORA } from '../persistencia/prueba-comun.ts';
import { RegistroEnMemoria } from '../reloj/registro.ts';
import { claveCorrecta, hashDeClave, problemaDeClave } from './contrasenyas.ts';
import { CorreoEnMemoria } from './correo.ts';
import {
  BLOQUEO_MS,
  CADUCIDAD_DEL_RESTABLECIMIENTO_MS,
  SESION_SIN_RECORDAR_MS,
  ServicioDeCuentas,
} from './servicio.ts';

const CLAVE_DE_COOKIES = new Uint8Array(32).fill(9);
const CORREO = 'ana@ejemplo.es';
const BUENA = 'una contraseña larga';

async function montar() {
  const repo = new RepositorioSqlite(':memory:');
  await repo.migrar(AHORA);
  const correo = new CorreoEnMemoria();
  const ahora = { valor: AHORA };
  const servicio = new ServicioDeCuentas({
    repo,
    correo,
    claveDeCookies: CLAVE_DE_COOKIES,
    urlPublica: 'https://conquerspain.example',
    registro: new RegistroEnMemoria(),
    ahora: () => ahora.valor,
  });
  /** Registra y confirma el correo con el enlace que llega. */
  const registrada = async (): Promise<void> => {
    await servicio.registrar(CORREO, 'Ana', BUENA, 'o1');
    await servicio.entrar(correo.ultimoToken(CORREO), 'o1');
  };
  return { repo, correo, ahora, servicio, registrada };
}

/** El codigo del error que lanza una promesa. */
async function codigo(p: Promise<unknown>): Promise<string> {
  try {
    await p;
    return 'sin-error';
  } catch (e) {
    return e instanceof Error && 'codigo' in e ? String(e.codigo) : 'otro';
  }
}

describe('las contraseñas', () => {
  it('se guardan con scrypt y sal: no en claro, y dos iguales no dan el mismo hash (criterio 1)', async () => {
    const a = await hashDeClave(BUENA);
    const b = await hashDeClave(BUENA);
    expect(a).toMatch(/^scrypt\$15\$8\$1\$/);
    expect(a).not.toContain(BUENA);
    expect(a).not.toBe(b);
    expect(await claveCorrecta(BUENA, a)).toBe(true);
    expect(await claveCorrecta('otra contraseña', a)).toBe(false);
    expect(await claveCorrecta(BUENA, 'basura')).toBe(false);
  });

  it('la política dice lo que falta', () => {
    expect(problemaDeClave('corta', CORREO)).toMatch(/al menos 10/);
    expect(problemaDeClave('1234567890', CORREO)).toMatch(/primeras que se prueban/);
    expect(problemaDeClave(CORREO, CORREO)).toMatch(/tu correo/);
    expect(problemaDeClave(BUENA, CORREO)).toBeNull();
  });
});

describe('registrarse y entrar', () => {
  it('sin confirmar el correo no se entra; con el enlace, sí (criterio 3)', async () => {
    const m = await montar();
    await m.servicio.registrar(CORREO, 'Ana', BUENA, 'o1');
    const guardada = await m.repo.cuentaConClave(CORREO);
    expect(guardada?.clave).not.toContain(BUENA);
    expect(await codigo(m.servicio.entrarConClave(CORREO, BUENA, true, 'o1'))).toBe(
      'correo-sin-confirmar',
    );
    await m.servicio.entrar(m.correo.ultimoToken(CORREO), 'o1');
    const sesion = await m.servicio.entrarConClave(CORREO, BUENA, true, 'o1');
    expect(sesion.cuenta.correo).toBe(CORREO);
    expect(await codigo(m.servicio.entrarConClave(CORREO, 'mala contraseña', true, 'o1'))).toBe(
      'credenciales-invalidas',
    );
  });

  it('registrarse con un correo ya registrado responde igual y no cambia su contraseña (criterio 2)', async () => {
    const m = await montar();
    await m.registrada();
    await expect(
      m.servicio.registrar(CORREO, 'Intruso', 'la del intruso 123', 'o2'),
    ).resolves.toBeUndefined();
    expect(m.correo.enviados.at(-1)?.motivo).toBe('ya-registrado');
    expect(await codigo(m.servicio.entrarConClave(CORREO, 'la del intruso 123', true, 'o2'))).toBe(
      'credenciales-invalidas',
    );
    expect((await m.servicio.entrarConClave(CORREO, BUENA, true, 'o3')).cuenta.nombre).toBe('Ana');
  });

  it('un correo sin cuenta da el mismo error que una contraseña mala', async () => {
    const m = await montar();
    await m.registrada();
    expect(await codigo(m.servicio.entrarConClave('nadie@ejemplo.es', BUENA, true, 'o1'))).toBe(
      'credenciales-invalidas',
    );
  });

  it('cinco fallos bloquean 15 minutos aunque luego se acierte (criterio 4)', async () => {
    const m = await montar();
    await m.registrada();
    for (let i = 0; i < 5; i += 1) {
      m.ahora.valor += 1000;
      expect(
        await codigo(
          m.servicio.entrarConClave(CORREO, `mala ${String(i)} contraseña`, true, `o${String(i)}`),
        ),
      ).toBe('credenciales-invalidas');
    }
    expect(await codigo(m.servicio.entrarConClave(CORREO, BUENA, true, 'o9'))).toBe(
      'credenciales-invalidas',
    );
    m.ahora.valor += BLOQUEO_MS;
    expect((await m.servicio.entrarConClave(CORREO, BUENA, true, 'o9')).cuenta.correo).toBe(CORREO);
  });

  it('«recordarme» da una cookie que dura; sin él, de sesión y 12 horas en el servidor (criterio 5)', async () => {
    const m = await montar();
    await m.registrada();
    const recordada = await m.servicio.entrarConClave(CORREO, BUENA, true, 'o1');
    expect(recordada.setCookie).toMatch(/Max-Age=\d+/);
    const deSesion = await m.servicio.entrarConClave(CORREO, BUENA, false, 'o1');
    expect(deSesion.setCookie).not.toMatch(/Max-Age/);
    const cookie = `sesion=${deSesion.setCookie.split(';')[0]?.split('=').slice(1).join('=') ?? ''}`;
    expect(await m.servicio.autenticar(cookie)).not.toBeNull();
    m.ahora.valor += SESION_SIN_RECORDAR_MS;
    expect(await m.servicio.autenticar(cookie)).toBeNull();
  });
});

describe('olvidé la contraseña', () => {
  it('responde igual exista o no la cuenta, y solo a la que existe le llega correo (criterio 2)', async () => {
    const m = await montar();
    await m.registrada();
    const antes = m.correo.enviados.length;
    await expect(
      m.servicio.pedirRestablecimiento('nadie@ejemplo.es', 'o1'),
    ).resolves.toBeUndefined();
    expect(m.correo.enviados.length).toBe(antes);
    await m.servicio.pedirRestablecimiento(CORREO, 'o1');
    expect(m.correo.enviados.at(-1)?.motivo).toBe('restablecer');
  });

  it('el enlace vale una vez, cierra las sesiones de antes y la contraseña vieja deja de valer (criterio 6)', async () => {
    const m = await montar();
    await m.registrada();
    const vieja = await m.servicio.entrarConClave(CORREO, BUENA, true, 'o1');
    const cookieVieja = `sesion=${vieja.setCookie.split(';')[0]?.split('=').slice(1).join('=') ?? ''}`;
    await m.servicio.pedirRestablecimiento(CORREO, 'o1');
    const token = m.correo.ultimoToken(CORREO);
    const NUEVA = 'otra contraseña distinta';
    expect(await codigo(m.servicio.restablecer(token, 'corta', 'o1'))).toBe('clave-invalida');
    await m.servicio.restablecer(token, NUEVA, 'o1');
    expect(await m.servicio.autenticar(cookieVieja)).toBeNull();
    expect(await codigo(m.servicio.restablecer(token, NUEVA, 'o1'))).toBe('enlace-invalido');
    expect(await codigo(m.servicio.entrarConClave(CORREO, BUENA, true, 'o2'))).toBe(
      'credenciales-invalidas',
    );
    expect((await m.servicio.entrarConClave(CORREO, NUEVA, true, 'o2')).cuenta.correo).toBe(CORREO);
  });

  it('el enlace caduca a los 30 minutos', async () => {
    const m = await montar();
    await m.registrada();
    await m.servicio.pedirRestablecimiento(CORREO, 'o1');
    const token = m.correo.ultimoToken(CORREO);
    m.ahora.valor += CADUCIDAD_DEL_RESTABLECIMIENTO_MS;
    expect(await codigo(m.servicio.restablecer(token, 'otra contraseña distinta', 'o1'))).toBe(
      'enlace-invalido',
    );
  });
});
