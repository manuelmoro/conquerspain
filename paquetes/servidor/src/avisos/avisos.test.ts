// Avisos de resolucion (ficha T-064 §6): en vivo, una sola vez, reintentos, preferencias, texto
// legible y sin fuga, y sin cuenta no hay correo.
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { ReadableStreamReadResult } from 'node:stream/web';

import { afterEach, describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO, resolverTurno } from '@conquer/nucleo';
import type { Cronica, EstadoPartida, IdJugador, IdPartida } from '@conquer/nucleo';

import { crearApi } from '../api/manejadores.ts';
import { servirHttp } from '../api/http.ts';
import type { PeticionHttp, RespuestaHttp } from '../api/tipos.ts';
import { CorreoEnMemoria } from '../cuentas/correo.ts';
import {
  AHORA,
  datosDePartida,
  mundoPeninsula,
  partidaDePrueba,
  resolverParaGuardar,
} from '../persistencia/prueba-comun.ts';
import { RepositorioSqlite } from '../persistencia/sqlite.ts';
import { proximaResolucion } from '../reloj/calendario.ts';
import { proveedorDeRecorte } from '../reloj/mundoDeLaPartida.ts';
import { RegistroEnMemoria } from '../reloj/registro.ts';
import { Reloj } from '../reloj/reloj.ts';
import { resolverUnTurno } from '../reloj/resolucion.ts';
import { CanalDeAvisos } from './canal.ts';
import { DespachadorDeCorreos, INTENTOS_MAXIMOS, esperaTrasFallo } from './despachador.ts';
import { modoPorDefecto } from './preferencias.ts';
import { asuntoDelAviso, cronicaEnTexto } from './texto.ts';

const P = 'p1' as IdPartida;
const MESTA = 'mesta' as IdJugador;
const MONJES = 'monjes' as IdJugador;
const DIA = 24 * 60 * 60 * 1000;
const carpetas: string[] = [];
afterEach(() => {
  for (const c of carpetas.splice(0)) {
    rmSync(c, { recursive: true, force: true });
  }
});

interface Entorno {
  readonly repo: RepositorioSqlite;
  readonly correo: CorreoEnMemoria;
  readonly registro: RegistroEnMemoria;
  readonly canal: CanalDeAvisos;
  readonly despachador: DespachadorDeCorreos;
  readonly ahora: { valor: number };
  readonly cuentas: Readonly<Record<string, string>>;
  resolver(): Promise<EstadoPartida>;
  pedir(cuenta: string, metodo: string, ruta: string, cuerpo?: unknown): Promise<RespuestaHttp>;
  readonly api: (p: PeticionHttp) => Promise<RespuestaHttp>;
}

/** Partida de mesta y monjes, con cuenta solo la mesta y los monjes si `conMonjes`. */
async function entorno(
  opciones: { intervaloSegundos?: number; conMonjes?: boolean; ruta?: string } = {},
): Promise<Entorno> {
  const repo = new RepositorioSqlite(opciones.ruta ?? ':memory:');
  await repo.migrar(AHORA);
  const { estado, mundo } = partidaDePrueba(['mesta', 'monjes'], 'semilla-avisos', 'p1');
  await repo.crearPartida(
    { ...datosDePartida(estado, mundo), intervaloSegundos: opciones.intervaloSegundos ?? 86_400 },
    estado,
    AHORA,
  );
  const ana = await repo.cuentaDeCorreo('ana@correo.es', 'c-ana', 'Ana', AHORA);
  await repo.unirCuenta(P, MESTA, ana.id);
  const cuentas: Record<string, string> = { mesta: ana.id };
  if (opciones.conMonjes === true) {
    const beto = await repo.cuentaDeCorreo('beto@correo.es', 'c-beto', 'Beto', AHORA);
    await repo.unirCuenta(P, MONJES, beto.id);
    cuentas['monjes'] = beto.id;
  }
  const correo = new CorreoEnMemoria();
  const registro = new RegistroEnMemoria();
  const canal = new CanalDeAvisos();
  const ahora = { valor: AHORA };
  const despachador = new DespachadorDeCorreos({
    repo,
    correo,
    registro,
    ahora: () => ahora.valor,
  });
  const api = crearApi({
    repo,
    reglas: TABLAS_DEL_JUEGO,
    proveedorDeMundo: proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO),
    autenticador: { identificar: (p) => Promise.resolve(p.cabeceras['x-cuenta'] ?? null) },
    registro,
    ahora: () => ahora.valor,
    canal,
    avisos: repo,
    latidoMs: 50,
  });
  return {
    repo,
    correo,
    registro,
    canal,
    despachador,
    ahora,
    cuentas,
    api,
    resolver: async () => {
      const actual = await repo.ultimoEstado(P);
      if (actual === null) throw new Error('sin estado');
      const r = resolverParaGuardar(actual, mundo);
      await repo.guardarResolucion(r, ahora.valor);
      return r.estadoNuevo;
    },
    pedir: (cuenta, metodo, ruta, cuerpo) =>
      api({
        metodo,
        ruta,
        cabeceras: {
          'x-cuenta': cuenta,
          ...(cuerpo === undefined ? {} : { 'content-type': 'application/json' }),
        },
        cuerpo: cuerpo === undefined ? null : JSON.stringify(cuerpo),
      }),
  };
}

describe('la cola de correos', () => {
  it('cada resolucion encola uno por jugador con cuenta; sin cuenta o con la cuenta borrada, nada (criterio 6)', async () => {
    const e = await entorno();
    await e.resolver();
    expect((await e.repo.avisosPendientes(e.ahora.valor)).map((a) => [a.turno, a.jugador])).toEqual(
      [[1, 'mesta']],
    );
    await e.repo.borrarCuenta(e.cuentas['mesta'] ?? '', e.ahora.valor);
    await e.resolver();
    expect(await e.repo.avisosPendientes(e.ahora.valor)).toEqual([]);
    await e.repo.cerrar();
  }, 60_000);

  it('una resolucion que no se guarda no encola nada', async () => {
    const carpeta = mkdtempSync(join(tmpdir(), 'conquer-avisos-'));
    carpetas.push(carpeta);
    const ruta = join(carpeta, 'b.sqlite');
    const e = await entorno({ ruta });
    const otra = new DatabaseSync(ruta);
    otra
      .prepare(
        `INSERT INTO auditoria_resolucion (partida, turno, huella_entrada, huella_salida,
           huella_ordenes, ordenes, duracion_ms, version_reglas, version_nucleo, resuelta_en)
         VALUES ('p1', 1, 'a', 'b', 'c', 0, 0, 1, '0', 0)`,
      )
      .run();
    otra.close();
    await expect(e.resolver()).rejects.toThrow();
    expect(await e.repo.avisosPendientes(e.ahora.valor)).toEqual([]);
    await e.repo.cerrar();
  }, 60_000);
});

describe('una sola vez por turno (criterio 2)', () => {
  it('cada turno manda un correo, y la segunda pasada no manda nada', async () => {
    const e = await entorno();
    await e.resolver();
    expect(await e.despachador.pasada()).toMatchObject({ enviados: 1 });
    expect(await e.despachador.pasada()).toMatchObject({ enviados: 0 });
    await e.resolver();
    await e.despachador.pasada();
    expect(e.correo.avisos.map((m) => m.asunto)).toEqual([
      asuntoDelAviso('Partida de prueba', [1]),
      asuntoDelAviso('Partida de prueba', [2]),
    ]);
    expect(e.correo.avisos.every((m) => m.para === 'ana@correo.es')).toBe(true);
    await e.repo.cerrar();
  }, 60_000);

  it('dos despachadores a la vez no duplican el correo', async () => {
    const e = await entorno();
    await e.resolver();
    const otro = new DespachadorDeCorreos({
      repo: e.repo,
      correo: e.correo,
      registro: e.registro,
      ahora: () => e.ahora.valor,
    });
    await Promise.all([e.despachador.pasada(), otro.pasada()]);
    expect(e.correo.avisos).toHaveLength(1);
    await e.repo.cerrar();
  }, 60_000);
});

describe('reintentos (criterio 3)', () => {
  it('si el correo falla, espera cada vez mas y lo manda una sola vez al volver', async () => {
    const e = await entorno();
    await e.resolver();
    e.correo.fallosPendientes = 2;
    expect(await e.despachador.pasada()).toMatchObject({ reintentos: 1 });
    expect(await e.despachador.pasada()).toMatchObject({ reintentos: 0, enviados: 0 });
    e.ahora.valor += esperaTrasFallo(1);
    expect(await e.despachador.pasada()).toMatchObject({ reintentos: 1 });
    e.ahora.valor += esperaTrasFallo(2) - 1;
    expect(await e.despachador.pasada()).toMatchObject({ enviados: 0 });
    e.ahora.valor += 1;
    expect(await e.despachador.pasada()).toMatchObject({ enviados: 1 });
    expect(e.correo.avisos).toHaveLength(1);
    expect(esperaTrasFallo(1)).toBe(2 * 60_000);
    expect(esperaTrasFallo(20)).toBe(6 * 60 * 60_000);
    await e.repo.cerrar();
  }, 60_000);

  it(`a los ${String(INTENTOS_MAXIMOS)} fallos se da por fallido y se registra`, async () => {
    const e = await entorno();
    await e.resolver();
    e.correo.fallosPendientes = 100;
    for (let i = 1; i <= INTENTOS_MAXIMOS; i += 1) {
      await e.despachador.pasada();
      e.ahora.valor += esperaTrasFallo(i);
    }
    expect(e.registro.eventos('error')).toContain('aviso-fallido');
    expect(await e.repo.avisosPendientes(e.ahora.valor + DIA)).toEqual([]);
    expect(e.correo.avisos).toHaveLength(0);
    await e.repo.cerrar();
  }, 60_000);
});

describe('preferencias (criterio 4)', () => {
  it('por defecto: cada turno desde 6 horas; por debajo, diario', () => {
    expect(modoPorDefecto(3600)).toBe('diario');
    expect(modoPorDefecto(6 * 3600 - 1)).toBe('diario');
    expect(modoPorDefecto(6 * 3600)).toBe('cada-turno');
    expect(modoPorDefecto(86_400)).toBe('cada-turno');
  });

  it('diario agrupa los turnos en un solo correo a las 24 horas', async () => {
    const e = await entorno({ intervaloSegundos: 3600 });
    for (let i = 0; i < 3; i += 1) {
      await e.resolver();
      e.ahora.valor += 3_600_000;
      await e.despachador.pasada();
    }
    expect(e.correo.avisos).toHaveLength(0);
    e.ahora.valor = AHORA + DIA;
    await e.despachador.pasada();
    expect(e.correo.avisos.map((m) => m.asunto)).toEqual([
      asuntoDelAviso('Partida de prueba', [1, 2, 3]),
    ]);
    // El siguiente correo diario, 24 horas despues del ultimo.
    await e.resolver();
    e.ahora.valor += DIA - 1;
    await e.despachador.pasada();
    expect(e.correo.avisos).toHaveLength(1);
    e.ahora.valor += 1;
    await e.despachador.pasada();
    expect(e.correo.avisos).toHaveLength(2);
    await e.repo.cerrar();
  }, 60_000);

  it('nada no manda nada y descarta; las rutas leen y fijan la preferencia', async () => {
    const e = await entorno();
    const cuenta = e.cuentas['mesta'] ?? '';
    expect((await e.pedir(cuenta, 'GET', '/partidas/p1/avisos')).cuerpo).toMatchObject({
      modo: 'cada-turno',
      porDefecto: 'cada-turno',
    });
    const malo = await e.pedir(cuenta, 'PUT', '/partidas/p1/avisos', { modo: 'a-veces' });
    expect(malo.estado).toBe(400);
    expect((await e.pedir(cuenta, 'PUT', '/partidas/p1/avisos', { modo: 'nada' })).estado).toBe(
      200,
    );
    expect((await e.pedir(cuenta, 'GET', '/partidas/p1/avisos')).cuerpo).toMatchObject({
      modo: 'nada',
    });
    expect((await e.pedir('otra-cuenta', 'GET', '/partidas/p1/avisos')).estado).toBe(404);

    await e.resolver();
    expect(await e.despachador.pasada()).toMatchObject({ descartados: 1, enviados: 0 });
    expect(await e.repo.avisosPendientes(e.ahora.valor)).toEqual([]);
    expect(e.correo.avisos).toHaveLength(0);
    await e.repo.cerrar();
  }, 60_000);
});

describe('el correo se lee sin abrir el juego (criterio 5)', () => {
  it('lleva la cronica del propio jugador por secciones y nada de la de otro', async () => {
    const e = await entorno({ conMonjes: true });
    await e.resolver();
    await e.resolver();
    await e.despachador.pasada();
    const deAna = e.correo.avisos.find((m) => m.para === 'ana@correo.es');
    const deBeto = e.correo.avisos.find((m) => m.para === 'beto@correo.es');
    const suya = await e.repo.cronica(P, 2, MESTA);
    const ajena = await e.repo.cronica(P, 2, MONJES);
    if (deAna === undefined || deBeto === undefined || suya === null || ajena === null) {
      throw new Error('faltan correos o cronicas');
    }
    expect(deAna.texto).toContain(cronicaEnTexto(suya));
    const soloDeBeto = ajena.entradas
      .map((x) => x.texto)
      .filter((t) => !suya.entradas.some((y) => y.texto === t));
    for (const texto of soloDeBeto) expect(deAna.texto).not.toContain(texto);
    await e.repo.cerrar();
  }, 60_000);

  it('el texto va por secciones con la accion sugerida', () => {
    const cronica: Cronica = {
      turno: 4,
      fecha: 'Segunda quincena de febrero del año 1',
      jugador: MESTA,
      entradas: [
        { seccion: 'sucesos', texto: 'Llego la recua.', comarca: null, accionSugerida: null },
        {
          seccion: 'avisos',
          texto: 'Queda poco pan.',
          comarca: null,
          accionSugerida: 'comprar pan',
        },
      ],
    };
    expect(cronicaEnTexto(cronica)).toBe(
      [
        'Segunda quincena de febrero del año 1 (turno 4)',
        '',
        'Avisos',
        '· Queda poco pan.',
        '  Qué hacer: comprar pan',
        '',
        'Sucesos',
        '· Llego la recua.',
      ].join('\n'),
    );
  });
});

describe('en vivo (criterio 1)', () => {
  it('el flujo de eventos avisa del turno propio con sus avisos; una cuenta ajena recibe 404', async () => {
    const e = await entorno();
    const cuenta = e.cuentas['mesta'] ?? '';
    const r = await e.pedir(cuenta, 'GET', '/partidas/p1/eventos');
    expect(r.estado).toBe(200);
    expect(r.cabeceras['content-type']).toContain('text/event-stream');
    const escrito: string[] = [];
    const parar = r.flujo?.((t) => escrito.push(t));
    expect(e.canal.escuchando(P)).toBe(1);
    const nuevo = await e.resolver();
    e.canal.publicar({ partida: P, turno: nuevo.turno - 1 });
    await new Promise((listo) => setTimeout(listo, 120));
    const evento = escrito.find((t) => t.startsWith('event: turno-resuelto'));
    expect(evento).toMatch(/data: \{"turno":1,"avisos":\d+\}/);
    expect(escrito.some((t) => t.includes(': latido'))).toBe(true);
    parar?.();
    expect(e.canal.escuchando(P)).toBe(0);
    expect((await e.pedir('otra-cuenta', 'GET', '/partidas/p1/eventos')).estado).toBe(404);
    await e.repo.cerrar();
  }, 60_000);

  it('por HTTP real, con el reloj real, el aviso llega en menos de 3 s', async () => {
    const e = await entorno();
    const ancla = Date.now();
    await e.repo.cerrar();
    const repo = new RepositorioSqlite(':memory:');
    await repo.migrar(ancla);
    const { estado, mundo } = partidaDePrueba(['mesta'], 'semilla-vivo', 'p1');
    await repo.crearPartida(
      {
        ...datosDePartida(estado, mundo),
        ancla,
        intervaloSegundos: 1,
        proximaResolucion: proximaResolucion(ancla, 1, 1),
      },
      estado,
      ancla,
    );
    const ana = await repo.cuentaDeCorreo('ana@correo.es', 'c-ana', 'Ana', ancla);
    await repo.unirCuenta(P, MESTA, ana.id);
    const canal = new CanalDeAvisos();
    const registro = new RegistroEnMemoria();
    const proveedor = proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO);
    const api = crearApi({
      repo,
      reglas: TABLAS_DEL_JUEGO,
      proveedorDeMundo: proveedor,
      autenticador: { identificar: (p) => Promise.resolve(p.cabeceras['x-cuenta'] ?? null) },
      registro,
      ahora: () => Date.now(),
      canal,
    });
    const servidor = await servirHttp(api);
    const reloj = new Reloj(
      {
        repo,
        reglas: TABLAS_DEL_JUEGO,
        proveedorDeMundo: proveedor,
        resolverTurno,
        registro,
        ahora: () => Date.now(),
        canal,
      },
      { sondeoMs: 100 },
    );
    const abortar = new AbortController();
    try {
      const respuesta = await fetch(
        `http://127.0.0.1:${String(servidor.puerto)}/partidas/p1/eventos`,
        {
          headers: { 'x-cuenta': ana.id },
          signal: abortar.signal,
        },
      );
      expect(respuesta.status).toBe(200);
      const lector = respuesta.body?.getReader();
      if (lector === undefined) throw new Error('sin cuerpo');
      reloj.iniciar();
      const decodificador = new TextDecoder();
      let texto = '';
      let llegada = 0;
      while (!texto.includes('event: turno-resuelto')) {
        const trozo: ReadableStreamReadResult<Uint8Array> = await lector.read();
        if (trozo.done) break;
        texto += decodificador.decode(trozo.value);
        llegada = Date.now();
      }
      const auditoria = await repo.auditoria(P, 1);
      expect(texto).toContain('event: turno-resuelto');
      expect(llegada - (auditoria?.resueltaEn ?? 0)).toBeLessThan(3000);
      expect(llegada - proximaResolucion(ancla, 1, 1)).toBeLessThan(3000);
    } finally {
      abortar.abort();
      await reloj.parar();
      await servidor.cerrar();
      await repo.cerrar();
    }
  }, 30_000);

  it('el reloj solo publica lo que ha guardado', async () => {
    const e = await entorno();
    const publicados: number[] = [];
    e.canal.suscribir(P, (ev) => publicados.push(ev.turno));
    const dep = {
      repo: e.repo,
      reglas: TABLAS_DEL_JUEGO,
      proveedorDeMundo: proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO),
      registro: e.registro,
      ahora: () => AHORA + DIA,
      canal: e.canal,
    };
    expect((await resolverUnTurno({ ...dep, resolverTurno }, P)).tipo).toBe('resuelto');
    const roto: typeof resolverTurno = () => {
      throw new Error('motor roto');
    };
    expect(
      (await resolverUnTurno({ ...dep, resolverTurno: roto, ahora: () => AHORA + 3 * DIA }, P))
        .tipo,
    ).toBe('detenida');
    expect(publicados).toEqual([1]);
    await e.repo.cerrar();
  }, 60_000);
});
