// Cuentas y sesiones (ficha T-063 §6): los tres ataques, enumeracion, caducidad y revocacion,
// nada en claro, limites, borrado y el recorrido completo por HTTP real.
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type { IdJugador, IdPartida } from '@conquer/nucleo';

import { crearApi } from '../api/manejadores.ts';
import { servirHttp } from '../api/http.ts';
import type { PeticionHttp, RespuestaHttp } from '../api/tipos.ts';
import {
  AHORA,
  datosDePartida,
  mundoPeninsula,
  partidaDePrueba,
} from '../persistencia/prueba-comun.ts';
import { RepositorioSqlite } from '../persistencia/sqlite.ts';
import { proveedorDeRecorte } from '../reloj/mundoDeLaPartida.ts';
import { RegistroEnMemoria } from '../reloj/registro.ts';
import { autenticadorDeSesiones } from './autenticador.ts';
import { CorreoEnMemoria } from './correo.ts';
import {
  CADUCIDAD_DEL_ENLACE_MS,
  CADUCIDAD_DE_LA_SESION_MS,
  ServicioDeCuentas,
} from './servicio.ts';
import { hashDeToken, valorDeCookie } from './tokens.ts';

const CLAVE = new Uint8Array(32).fill(7);
const carpetas: string[] = [];
afterEach(() => {
  for (const c of carpetas.splice(0)) {
    rmSync(c, { recursive: true, force: true });
  }
});

interface Entorno {
  readonly repo: RepositorioSqlite;
  readonly correo: CorreoEnMemoria;
  readonly servicio: ServicioDeCuentas;
  readonly registro: RegistroEnMemoria;
  readonly api: (peticion: PeticionHttp) => Promise<RespuestaHttp>;
  readonly ahora: { valor: number };
  pedir(
    cookie: string | null,
    metodo: string,
    ruta: string,
    cuerpo?: unknown,
    origen?: string,
  ): Promise<RespuestaHttp>;
  /** Pide el enlace, lo usa y devuelve la cookie (`sesion=...`) y el id de la cuenta. */
  iniciarSesion(correo: string, nombre?: string): Promise<{ cookie: string; cuenta: string }>;
}

async function entorno(ruta = ':memory:'): Promise<Entorno> {
  const repo = new RepositorioSqlite(ruta);
  await repo.migrar(AHORA);
  const { estado, mundo } = partidaDePrueba(['mesta', 'monjes'], 'semilla-x', 'p1');
  await repo.crearPartida(datosDePartida(estado, mundo), estado, AHORA);
  const correo = new CorreoEnMemoria();
  const registro = new RegistroEnMemoria();
  const ahora = { valor: AHORA };
  const servicio = new ServicioDeCuentas({
    repo,
    correo,
    claveDeCookies: CLAVE,
    urlPublica: 'https://conquerspain.example',
    registro,
    ahora: () => ahora.valor,
  });
  const api = crearApi({
    repo,
    reglas: TABLAS_DEL_JUEGO,
    proveedorDeMundo: proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO),
    autenticador: autenticadorDeSesiones(servicio),
    registro,
    ahora: () => ahora.valor,
    cuentas: servicio,
  });
  const pedir: Entorno['pedir'] = (cookie, metodo, ruta, cuerpo, origen = 'origen-1') =>
    api({
      metodo,
      ruta,
      origen,
      cabeceras: {
        ...(cookie === null ? {} : { cookie }),
        ...(cuerpo === undefined ? {} : { 'content-type': 'application/json' }),
      },
      cuerpo:
        cuerpo === undefined ? null : typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo),
    });
  return {
    repo,
    correo,
    servicio,
    registro,
    api,
    ahora,
    pedir,
    iniciarSesion: async (direccion, nombre) => {
      const pedido = await pedir(
        null,
        'POST',
        '/cuentas/enlace',
        { correo: direccion, nombre },
        `origen-${direccion}`,
      );
      expect(pedido.estado).toBe(202);
      const token = correo.ultimoToken(direccion.toLowerCase());
      if (token === null) throw new Error('no llego el correo');
      const entrada = await pedir(null, 'POST', '/sesion', { token }, `origen-${direccion}`);
      expect(entrada.estado).toBe(200);
      const setCookie = entrada.cabeceras['set-cookie'] ?? '';
      const cuenta = (entrada.cuerpo as { cuenta: { id: string } }).cuenta.id;
      return { cookie: setCookie.split(';')[0] ?? '', cuenta };
    },
  };
}

function codigoDe(r: RespuestaHttp): string {
  return (r.cuerpo as { error?: { codigo?: string } }).error?.codigo ?? '';
}

describe('el recorrido normal', () => {
  it('pedir enlace, entrar, ver la cuenta y usar la API con la cookie', async () => {
    const e = await entorno();
    const { cookie, cuenta } = await e.iniciarSesion('Ana@Correo.ES', 'Ana');
    const yo = await e.pedir(cookie, 'GET', '/cuenta');
    expect(yo.estado).toBe(200);
    expect(yo.cuerpo).toMatchObject({
      cuenta: { id: cuenta, nombre: 'Ana', correo: 'ana@correo.es' },
    });
    expect((await e.pedir(null, 'GET', '/cuenta')).estado).toBe(401);
    expect((await e.pedir(cookie, 'GET', '/partidas/mias')).estado).toBe(200);
    // El correo llevo un enlace a la direccion publica con el token.
    expect(e.correo.enviados[0]?.enlace).toMatch(
      /^https:\/\/conquerspain\.example\/entrar\?token=/,
    );
    expect(e.correo.enviados[0]?.caducaEnMinutos).toBe(15);
    await e.repo.cerrar();
  }, 60_000);

  it('la cookie lleva los atributos de seguridad', async () => {
    const e = await entorno();
    await e.pedir(null, 'POST', '/cuentas/enlace', { correo: 'a@b.es' });
    const token = e.correo.ultimoToken('a@b.es') ?? '';
    const r = await e.pedir(null, 'POST', '/sesion', { token });
    const cookie = r.cabeceras['set-cookie'] ?? '';
    for (const atributo of [
      'HttpOnly',
      'Secure',
      'SameSite=Lax',
      'Path=/',
      `Max-Age=${String(CADUCIDAD_DE_LA_SESION_MS / 1000)}`,
    ]) {
      expect(cookie, atributo).toContain(atributo);
    }
    expect(cookie).toMatch(/^sesion=[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+;/);
    await e.repo.cerrar();
  }, 60_000);

  it('las rutas con cuerpo exigen content-type JSON, y un correo imposible se dice', async () => {
    const e = await entorno();
    const sinTipo = await e.api({
      metodo: 'POST',
      ruta: '/cuentas/enlace',
      cabeceras: {},
      cuerpo: '{"correo":"a@b.es"}',
      origen: 'o',
    });
    expect(codigoDe(sinTipo)).toBe('tipo-de-contenido');
    for (const malo of ['', 'sin-arroba', 'a@b', 'a b@c.es', 7, null, 'x'.repeat(260) + '@b.es']) {
      expect(
        codigoDe(await e.pedir(null, 'POST', '/cuentas/enlace', { correo: malo })),
        String(malo),
      ).toBe('correo-invalido');
    }
    await e.repo.cerrar();
  }, 60_000);

  it('una clave de cookies corta impide arrancar', () => {
    expect(
      () =>
        new ServicioDeCuentas({
          repo: new RepositorioSqlite(':memory:'),
          correo: new CorreoEnMemoria(),
          claveDeCookies: new Uint8Array(8),
          urlPublica: 'x',
          registro: new RegistroEnMemoria(),
          ahora: () => 0,
        }),
    ).toThrow(/al menos 32/);
  });
});

describe('los tres ataques (criterio 4)', () => {
  it('a) sesion ajena: una cookie manipulada, sin firma o con otra clave no autentica', async () => {
    const e = await entorno();
    const a = await e.iniciarSesion('ana@correo.es');
    const [, valor = ''] = a.cookie.split('=');
    const token = valor.split('.')[0] ?? '';
    const otraClave = valorDeCookie(token, new Uint8Array(32).fill(9));
    const falsas = [
      a.cookie.slice(0, -2) + 'xx',
      `sesion=${token}`,
      `sesion=${token}.`,
      `sesion=${otraClave}`,
      'sesion=basura.basura',
      `sesion=${token}.${valor.split('.')[1] ?? ''}.mas`,
      '',
    ];
    for (const falsa of falsas) {
      expect((await e.pedir(falsa, 'GET', '/cuenta')).estado, falsa).toBe(401);
    }
    expect((await e.pedir(a.cookie, 'GET', '/cuenta')).estado).toBe(200);
    // El hash del token guardado no sirve como cookie: lo que se guarda no abre nada.
    const hash = hashDeToken(token);
    expect((await e.pedir(`sesion=${hash}.${hash}`, 'GET', '/cuenta')).estado).toBe(401);
    await e.repo.cerrar();
  }, 60_000);

  it('b) suplantacion: el jugador sale de la cuenta, no de lo que mande el cliente', async () => {
    const e = await entorno();
    const a = await e.iniciarSesion('ana@correo.es');
    const b = await e.iniciarSesion('beto@correo.es');
    await e.repo.unirCuenta('p1' as IdPartida, 'mesta' as IdJugador, a.cuenta);
    await e.repo.unirCuenta('p1' as IdPartida, 'monjes' as IdJugador, b.cuenta);

    const ana = (await e.pedir(a.cookie, 'GET', '/partidas/p1/estado')).cuerpo as {
      vista: { jugador: { id: string } };
    };
    const beto = (await e.pedir(b.cookie, 'GET', '/partidas/p1/estado')).cuerpo as {
      vista: { jugador: { id: string } };
    };
    expect(ana.vista.jugador.id).toBe('mesta');
    expect(beto.vista.jugador.id).toBe('monjes');

    // Ana intenta hablar en nombre de Beto: por el cuerpo, y con cabeceras de cosecha propia.
    const capital = ana.vista.jugador.id;
    const suplantar = await e.api({
      metodo: 'POST',
      ruta: '/partidas/p1/ordenes',
      origen: 'o',
      cabeceras: {
        cookie: a.cookie,
        'content-type': 'application/json',
        'x-jugador': 'monjes',
        'x-cuenta': b.cuenta,
      },
      cuerpo: JSON.stringify({
        idCliente: 'k1',
        tipo: 'roturar',
        comarca: capital,
        jugador: 'monjes',
      }),
    });
    expect(codigoDe(suplantar)).toBe('orden-invalida');
    expect((await e.repo.ordenesPendientes('p1' as IdPartida)).length).toBe(0);

    // Una tercera cuenta, que no juega, no ve nada aunque sepa el identificador.
    const c = await e.iniciarSesion('carla@correo.es');
    for (const ruta of [
      '/partidas/p1/estado',
      '/partidas/p1/ordenes',
      '/partidas/p1/clasificacion',
    ]) {
      expect(codigoDe(await e.pedir(c.cookie, 'GET', ruta)), ruta).toBe('partida-desconocida');
    }
    expect(
      ((await e.pedir(c.cookie, 'GET', '/partidas/mias')).cuerpo as { partidas: unknown[] })
        .partidas,
    ).toEqual([]);
    await e.repo.cerrar();
  }, 120_000);

  it('c) un enlace usado, caducado o inexistente da siempre el mismo error; y dos usos a la vez, uno', async () => {
    const e = await entorno();
    await e.pedir(null, 'POST', '/cuentas/enlace', { correo: 'ana@correo.es' });
    const token = e.correo.ultimoToken('ana@correo.es') ?? '';
    const primero = await e.pedir(null, 'POST', '/sesion', { token });
    const segundo = await e.pedir(null, 'POST', '/sesion', { token });
    expect(primero.estado).toBe(200);
    expect(segundo.estado).toBe(401);
    expect(codigoDe(segundo)).toBe('enlace-invalido');

    // Caducado: a los 15 minutos exactos ya no vale; un segundo antes, si.
    await e.pedir(null, 'POST', '/cuentas/enlace', { correo: 'beto@correo.es' });
    const tarde = e.correo.ultimoToken('beto@correo.es') ?? '';
    e.ahora.valor = AHORA + CADUCIDAD_DEL_ENLACE_MS;
    const caducado = await e.pedir(null, 'POST', '/sesion', { token: tarde });
    await e.pedir(null, 'POST', '/cuentas/enlace', { correo: 'carla@correo.es' });
    const justo = e.correo.ultimoToken('carla@correo.es') ?? '';
    e.ahora.valor += CADUCIDAD_DEL_ENLACE_MS - 1000;
    expect((await e.pedir(null, 'POST', '/sesion', { token: justo })).estado).toBe(200);

    const inexistente = await e.pedir(null, 'POST', '/sesion', { token: 'no-existe' });
    for (const r of [segundo, caducado, inexistente]) {
      expect(r.estado).toBe(401);
      expect(r.cuerpo).toEqual(segundo.cuerpo);
    }

    // Dos usos a la vez: solo uno abre sesion.
    await e.pedir(null, 'POST', '/cuentas/enlace', { correo: 'dani@correo.es' });
    const doble = e.correo.ultimoToken('dani@correo.es') ?? '';
    const resultados = await Promise.all([
      e.pedir(null, 'POST', '/sesion', { token: doble }, 'origen-a'),
      e.pedir(null, 'POST', '/sesion', { token: doble }, 'origen-b'),
    ]);
    expect(resultados.map((r) => r.estado).sort()).toEqual([200, 401]);
    await e.repo.cerrar();
  }, 60_000);
});

describe('enumeracion y limites', () => {
  it('pedir enlace responde igual para un correo con cuenta y para otro sin ella', async () => {
    const e = await entorno();
    await e.iniciarSesion('ana@correo.es');
    const conCuenta = await e.pedir(
      null,
      'POST',
      '/cuentas/enlace',
      { correo: 'ana@correo.es' },
      'o1',
    );
    const sinCuenta = await e.pedir(
      null,
      'POST',
      '/cuentas/enlace',
      { correo: 'nadie@correo.es' },
      'o2',
    );
    expect(conCuenta.estado).toBe(202);
    expect(sinCuenta.estado).toBe(202);
    expect(conCuenta.cuerpo).toEqual(sinCuenta.cuerpo);
    expect(conCuenta.cabeceras).toEqual(sinCuenta.cabeceras);
    await e.repo.cerrar();
  }, 60_000);

  it('5 enlaces por hora y correo; el sexto, 429 con retry-after; a la hora vuelve', async () => {
    const e = await entorno();
    for (let i = 0; i < 5; i += 1) {
      expect(
        (
          await e.pedir(
            null,
            'POST',
            '/cuentas/enlace',
            { correo: 'ana@correo.es' },
            `o${String(i)}`,
          )
        ).estado,
      ).toBe(202);
    }
    const sexto = await e.pedir(null, 'POST', '/cuentas/enlace', { correo: 'ana@correo.es' }, 'o9');
    expect(sexto.estado).toBe(429);
    expect(codigoDe(sexto)).toBe('demasiadas-peticiones');
    expect(Number(sexto.cabeceras['retry-after'])).toBeGreaterThan(0);
    expect(
      (await e.pedir(null, 'POST', '/cuentas/enlace', { correo: 'otra@correo.es' }, 'o9')).estado,
    ).toBe(202);
    e.ahora.valor = AHORA + 60 * 60 * 1000 + 1;
    expect(
      (await e.pedir(null, 'POST', '/cuentas/enlace', { correo: 'ana@correo.es' }, 'o9')).estado,
    ).toBe(202);
    await e.repo.cerrar();
  }, 60_000);

  it('20 enlaces por hora y origen, y 10 entradas por minuto y origen', async () => {
    const e = await entorno();
    for (let i = 0; i < 20; i += 1) {
      expect(
        (
          await e.pedir(
            null,
            'POST',
            '/cuentas/enlace',
            { correo: `u${String(i)}@correo.es` },
            'mismo',
          )
        ).estado,
      ).toBe(202);
    }
    expect(
      (await e.pedir(null, 'POST', '/cuentas/enlace', { correo: 'u99@correo.es' }, 'mismo')).estado,
    ).toBe(429);
    for (let i = 0; i < 10; i += 1) {
      expect(
        (await e.pedir(null, 'POST', '/sesion', { token: `t${String(i)}` }, 'atacante')).estado,
      ).toBe(401);
    }
    const once = await e.pedir(null, 'POST', '/sesion', { token: 'otro' }, 'atacante');
    expect(once.estado).toBe(429);
    expect(once.cabeceras['retry-after']).toBeDefined();
    e.ahora.valor += 61_000;
    expect((await e.pedir(null, 'POST', '/sesion', { token: 'otro' }, 'atacante')).estado).toBe(
      401,
    );
    await e.repo.cerrar();
  }, 60_000);
});

describe('sesiones que caducan y se revocan (criterio 3)', () => {
  it('caduca a los 30 dias exactos', async () => {
    const e = await entorno();
    const { cookie } = await e.iniciarSesion('ana@correo.es');
    e.ahora.valor = AHORA + CADUCIDAD_DE_LA_SESION_MS - 1;
    expect((await e.pedir(cookie, 'GET', '/cuenta')).estado).toBe(200);
    e.ahora.valor = AHORA + CADUCIDAD_DE_LA_SESION_MS;
    expect((await e.pedir(cookie, 'GET', '/cuenta')).estado).toBe(401);
    await e.repo.cerrar();
  }, 60_000);

  it('cerrar la sesion la invalida al instante y borra la cookie; cerrar todas, las de la cuenta', async () => {
    const e = await entorno();
    const uno = await e.iniciarSesion('ana@correo.es');
    // Segunda sesion de la misma cuenta.
    await e.pedir(null, 'POST', '/cuentas/enlace', { correo: 'ana@correo.es' }, 'otro-origen');
    const entrada = await e.pedir(
      null,
      'POST',
      '/sesion',
      { token: e.correo.ultimoToken('ana@correo.es') ?? '' },
      'otro-origen',
    );
    const dos = (entrada.cabeceras['set-cookie'] ?? '').split(';')[0] ?? '';

    const cierre = await e.pedir(uno.cookie, 'DELETE', '/sesion');
    expect(cierre.estado).toBe(200);
    expect(cierre.cabeceras['set-cookie']).toContain('Max-Age=0');
    expect((await e.pedir(uno.cookie, 'GET', '/cuenta')).estado).toBe(401);
    expect((await e.pedir(dos, 'GET', '/cuenta')).estado).toBe(200);

    const todas = await e.pedir(dos, 'POST', '/sesion/cerrar-todas', {});
    expect(todas.cuerpo).toMatchObject({ cerradas: 1 });
    expect((await e.pedir(dos, 'GET', '/cuenta')).estado).toBe(401);
    await e.repo.cerrar();
  }, 60_000);
});

describe('nada en claro (criterio 2)', () => {
  it('en la base solo hay hashes de los tokens, y el registro no lleva tokens ni correos', async () => {
    const carpeta = mkdtempSync(join(tmpdir(), 'conquer-cuentas-'));
    carpetas.push(carpeta);
    const ruta = join(carpeta, 'b.sqlite');
    const e = await entorno(ruta);
    const { cookie } = await e.iniciarSesion('ana@correo.es', 'Ana');
    const tokenDelEnlace = e.correo.ultimoToken('ana@correo.es') ?? '';
    const valorDeLaCookie = cookie.split('=')[1] ?? '';
    const tokenDeSesion = valorDeLaCookie.split('.')[0] ?? '';
    expect(tokenDelEnlace.length).toBeGreaterThan(30);
    await e.repo.cerrar();

    const bd = new DatabaseSync(ruta);
    const tablas = bd
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .all()
      .map((t) => String(t['name']));
    for (const tabla of tablas) {
      const volcado = JSON.stringify(bd.prepare(`SELECT * FROM ${tabla}`).all());
      for (const secreto of [tokenDelEnlace, tokenDeSesion, valorDeLaCookie]) {
        expect(volcado, `${tabla} no guarda ${secreto.slice(0, 6)}…`).not.toContain(secreto);
      }
    }
    const hashes = bd
      .prepare('SELECT hash FROM enlace_de_acceso UNION SELECT hash FROM sesion')
      .all()
      .map((f) => String(f['hash']));
    expect(hashes).toContain(hashDeToken(tokenDelEnlace));
    expect(hashes).toContain(hashDeToken(tokenDeSesion));
    bd.close();

    const registro = JSON.stringify(e.registro.entradas);
    for (const prohibido of [tokenDelEnlace, tokenDeSesion, valorDeLaCookie, 'ana@correo.es']) {
      expect(registro).not.toContain(prohibido);
    }
  }, 60_000);
});

describe('borrar la cuenta (criterio 8)', () => {
  it('sin confirmar no hace nada; confirmado, anonimiza, revoca y deja al jugador vivo', async () => {
    const e = await entorno();
    const a = await e.iniciarSesion('ana@correo.es', 'Ana');
    await e.repo.unirCuenta('p1' as IdPartida, 'mesta' as IdJugador, a.cuenta);
    const antes = await e.repo.ultimoEstado('p1' as IdPartida);

    expect(codigoDe(await e.pedir(a.cookie, 'DELETE', '/cuenta', {}))).toBe(
      'confirmacion-necesaria',
    );
    expect(codigoDe(await e.pedir(a.cookie, 'DELETE', '/cuenta', { confirmo: 'si' }))).toBe(
      'confirmacion-necesaria',
    );
    expect((await e.pedir(a.cookie, 'GET', '/cuenta')).estado).toBe(200);

    const borrada = await e.pedir(a.cookie, 'DELETE', '/cuenta', { confirmo: true });
    expect(borrada.estado).toBe(200);
    expect(borrada.cabeceras['set-cookie']).toContain('Max-Age=0');
    expect((await e.pedir(a.cookie, 'GET', '/cuenta')).estado).toBe(401);

    const cuenta = await e.repo.cuenta(a.cuenta);
    expect(cuenta).toMatchObject({ nombre: 'Cuenta borrada', correo: `borrada-${a.cuenta}` });
    expect(cuenta?.borradaEn).toBe(AHORA);
    const jugadores = await e.repo.participantes('p1' as IdPartida);
    expect(jugadores.map((p) => [p.jugador, p.cuenta])).toContainEqual(['mesta', null]);
    // La partida sigue como estaba.
    const despues = await e.repo.ultimoEstado('p1' as IdPartida);
    expect(despues?.turno).toBe(antes?.turno);
    expect((await e.repo.partida('p1' as IdPartida))?.estado).toBe('activa');

    // El mismo correo puede volver a registrarse, y es otra cuenta.
    const otra = await e.iniciarSesion('ana@correo.es');
    expect(otra.cuenta).not.toBe(a.cuenta);
    await e.repo.cerrar();
  }, 60_000);

  it('un enlace pendiente de una cuenta borrada deja de valer', async () => {
    const e = await entorno();
    const a = await e.iniciarSesion('ana@correo.es');
    await e.pedir(null, 'POST', '/cuentas/enlace', { correo: 'ana@correo.es' }, 'o2');
    const pendiente = e.correo.ultimoToken('ana@correo.es') ?? '';
    await e.pedir(a.cookie, 'DELETE', '/cuenta', { confirmo: true });
    expect(codigoDe(await e.pedir(null, 'POST', '/sesion', { token: pendiente }))).toBe(
      'enlace-invalido',
    );
    await e.repo.cerrar();
  }, 60_000);
});

describe('de punta a punta por HTTP real (criterio 10)', () => {
  it('enlace por correo, entrar, llamar a la API con la cookie y cerrar sesion', async () => {
    const e = await entorno();
    const servidor = await servirHttp(e.api);
    try {
      const base = `http://127.0.0.1:${String(servidor.puerto)}`;
      const json = { 'content-type': 'application/json' };
      const pedido = await fetch(`${base}/cuentas/enlace`, {
        method: 'POST',
        headers: json,
        body: JSON.stringify({ correo: 'ana@correo.es', nombre: 'Ana' }),
      });
      expect(pedido.status).toBe(202);
      const token = e.correo.ultimoToken('ana@correo.es') ?? '';
      const entrada = await fetch(`${base}/sesion`, {
        method: 'POST',
        headers: json,
        body: JSON.stringify({ token }),
      });
      expect(entrada.status).toBe(200);
      const cookie = (entrada.headers.get('set-cookie') ?? '').split(';')[0] ?? '';
      expect(cookie).toMatch(/^sesion=/);

      const mias = await fetch(`${base}/partidas/mias`, { headers: { cookie } });
      expect(mias.status).toBe(200);
      expect((await fetch(`${base}/partidas/mias`)).status).toBe(401);
      const cierre = await fetch(`${base}/sesion`, { method: 'DELETE', headers: { cookie } });
      expect(cierre.status).toBe(200);
      expect((await fetch(`${base}/partidas/mias`, { headers: { cookie } })).status).toBe(401);
    } finally {
      await servidor.cerrar();
    }
    await e.repo.cerrar();
  }, 60_000);
});
