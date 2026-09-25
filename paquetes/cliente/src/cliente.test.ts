// La capa de datos del cliente (ficha T-080 §6): prevision exacta, sin perdidas, turno nuevo, sin
// conexion, eventos con reintento y el recorrido completo contra el servidor real.
import { describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO, costeDeIntencion, validarIntencion } from '@conquer/nucleo';
import type { IdPartida } from '@conquer/nucleo';

import { apiDePrueba, CUENTAS } from '../../servidor/src/api/prueba-comun.ts';
import { servirHttp } from '../../servidor/src/api/http.ts';
import { crearApi } from '../../servidor/src/api/manejadores.ts';
import { ServicioDeAltas } from '../../servidor/src/altas/servicio.ts';
import { autenticadorDeSesiones } from '../../servidor/src/cuentas/autenticador.ts';
import { CorreoEnMemoria } from '../../servidor/src/cuentas/correo.ts';
import { ServicioDeCuentas } from '../../servidor/src/cuentas/servicio.ts';
import { AHORA, mundoPeninsula } from '../../servidor/src/persistencia/prueba-comun.ts';
import { RepositorioSqlite } from '../../servidor/src/persistencia/sqlite.ts';
import { proveedorDeRecorte } from '../../servidor/src/reloj/mundoDeLaPartida.ts';
import { RegistroEnMemoria } from '../../servidor/src/reloj/registro.ts';
import { Almacen, leerPendientes } from './almacen.ts';
import { ClienteApi } from './api.ts';
import type { TarroDeCookies } from './api.ts';
import { escucharEventos, esperaDeReconexion } from './eventos.ts';
import type { FuenteDeEventos } from './eventos.ts';
import { GuardadoEnMemoria } from './guardado.ts';
import { preverBandeja } from './prevision.ts';

const MESTA = CUENTAS['mesta'] ?? '';

/** Un cliente contra la API de pruebas por HTTP real, entrando como una cuenta (cabecera x-cuenta). */
async function montar(opciones: { turnosJugados?: number } = {}) {
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
    nuevaClave: () => {
      n += 1;
      return `k${String(n)}`;
    },
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

describe('la prevision es exacta (criterio 1)', () => {
  it('el coste que prevé el cliente con su vista es el de la orden que construye el servidor', async () => {
    const m = await montar();
    await m.almacen.abrirPartida('p1');
    const partida = m.almacen.estado.partida;
    if (partida === null) throw new Error('sin partida');
    const vista = partida.recibido.vista;
    const intenciones = [
      { tipo: 'construir', comarca: m.capital, edificio: 'granja' },
      { tipo: 'roturar', comarca: m.capital },
      { tipo: 'aperos', comarca: m.capital },
      { tipo: 'formar-recua', comarca: m.capital, vecinos: 0 },
      { tipo: 'formar-rebanyo', comarca: m.capital },
      {
        tipo: 'obra-mayor',
        comarca: m.capital,
        obra: 'muralla',
        hacia: null,
        continuar: null,
        abandonar: false,
      },
    ].map((x, i) => ({ ...x, idCliente: `p${String(i)}` }));
    const prevista = preverBandeja(vista, intenciones, TABLAS_DEL_JUEGO);
    for (const [i, intencion] of intenciones.entries()) {
      const r = await m.e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', intencion);
      expect(r.estado, JSON.stringify(r.cuerpo)).toBe(201);
      const delServidor = (r.cuerpo as { orden: { coste: unknown } }).orden.coste;
      expect(prevista.lineas[i]?.coste, intencion.tipo).toEqual(delServidor);
    }
    // Y la funcion de coste es una sola: el nucleo la usa con los datos de la vista.
    const forma = validarIntencion(intenciones[0]);
    if (!forma.ok) throw new Error('no valida');
    expect(
      costeDeIntencion(forma.valor.bosquejo, vista.jugador, undefined, TABLAS_DEL_JUEGO),
    ).toEqual(prevista.lineas[0]?.coste);
    await m.cerrar();
  }, 120_000);

  it('marca lo que ya no alcanza, acumulando la bandeja', async () => {
    const m = await montar();
    await m.almacen.abrirPartida('p1');
    const vista = m.almacen.estado.partida?.recibido.vista;
    if (vista === undefined) throw new Error('sin vista');
    const muchas = Array.from({ length: 40 }, (_, i) => ({
      idCliente: `g${String(i)}`,
      tipo: 'construir',
      comarca: m.capital,
      edificio: 'granja',
    }));
    const p = preverBandeja(vista, muchas, TABLAS_DEL_JUEGO);
    expect(p.lineas[0]?.cabe).toBe(true);
    expect(p.lineas.some((l) => l.cabe === false)).toBe(true);
    expect(
      preverBandeja(vista, [{ idCliente: 'x', tipo: 'saquear' }], TABLAS_DEL_JUEGO).lineas[0],
    ).toEqual({ idCliente: 'x', coste: null, cabe: null });
    await m.cerrar();
  }, 120_000);
});

describe('sin perdidas (criterio 2)', () => {
  it('con la red caida se quedan en la bandeja y en el guardado; al volver se mandan sin duplicar', async () => {
    const m = await montar();
    await m.almacen.abrirPartida('p1');
    m.red.caida = true;
    await m.almacen.anyadir({ tipo: 'roturar', comarca: m.capital });
    await m.almacen.anyadir({ tipo: 'aperos', comarca: m.capital });
    expect(m.almacen.estado.conexion).toBe('sin-conexion');
    expect(m.almacen.estado.pendientes.map((p) => p.idCliente)).toEqual(['k1', 'k2']);
    expect(
      leerPendientes(m.guardado.leer('conquer:pendientes:p1')).map((p) => p.idCliente),
    ).toEqual(['k1', 'k2']);

    // La respuesta se pierde despues de que el servidor la guardara: el reenvio no duplica.
    m.red.caida = false;
    m.red.perderRespuestas = true;
    await m.almacen.sincronizar();
    expect(m.almacen.estado.pendientes).toHaveLength(2);
    m.red.perderRespuestas = false;
    await m.almacen.sincronizar();
    expect(m.almacen.estado.pendientes).toHaveLength(0);
    expect(m.almacen.estado.conexion).toBe('conectado');
    expect(await m.e.repo.ordenesPendientes('p1' as IdPartida)).toHaveLength(2);
    await m.cerrar();
  }, 120_000);

  it('una orden que el servidor rechaza se queda marcada con su mensaje', async () => {
    const m = await montar();
    await m.almacen.abrirPartida('p1');
    await m.almacen.anyadir({ tipo: 'roturar', comarca: 'comarca-que-no-es-mia' });
    const p = m.almacen.estado.pendientes[0];
    expect(p?.error?.codigo).toBe('orden-invalida');
    expect(p?.error?.mensaje.length).toBeGreaterThan(10);
    m.almacen.quitar(p?.idCliente ?? '');
    expect(m.almacen.estado.pendientes).toHaveLength(0);
    await m.cerrar();
  }, 120_000);

  it('la bandeja guardada mal formada no rompe: se descartan las entradas raras', () => {
    expect(leerPendientes('no es json')).toEqual([]);
    expect(leerPendientes('{"a":1}')).toEqual([]);
    expect(
      leerPendientes('[{"idCliente":3},{"idCliente":"k","intencion":{"tipo":"x"},"error":null}]'),
    ).toEqual([{ idCliente: 'k', intencion: { tipo: 'x' }, error: null }]);
  });
});

describe('turno nuevo y sin conexion (criterios 3 y 4)', () => {
  it('un turno nuevo no cambia la vista hasta recargar', async () => {
    const m = await montar();
    await m.almacen.abrirPartida('p1');
    const antes = m.almacen.estado.partida?.recibido.turno;
    await m.e.resolver();
    m.almacen.alTurnoResuelto(2);
    expect(m.almacen.estado.turnoNuevo).toBe(2);
    expect(m.almacen.estado.partida?.recibido.turno).toBe(antes);
    await m.almacen.recargar();
    expect(m.almacen.estado.turnoNuevo).toBeNull();
    expect(m.almacen.estado.partida?.recibido.turno).toBe((antes ?? 0) + 1);
    await m.cerrar();
  }, 120_000);

  it('sin red, abre la ultima vista guardada, con su hora y marcada como vieja', async () => {
    const m = await montar();
    await m.almacen.abrirPartida('p1');
    const turno = m.almacen.estado.partida?.recibido.turno;
    m.red.caida = true;
    const otro = new Almacen({
      api: new ClienteApi({
        base: 'http://127.0.0.1:1',
        fetch: () => Promise.reject(new TypeError('sin red')),
      }),
      guardado: m.guardado,
      reglas: TABLAS_DEL_JUEGO,
      ahora: () => AHORA,
      nuevaClave: () => 'z',
    });
    await otro.abrirPartida('p1');
    expect(otro.estado.partida).toMatchObject({ desactualizada: true, recibidaEn: AHORA + 1000 });
    expect(otro.estado.partida?.recibido.turno).toBe(turno);
    expect(otro.estado.conexion).toBe('sin-conexion');
    await otro.abrirPartida('otra');
    expect(otro.estado.errores.at(-1)?.codigo).toBe('sin-red');
    await m.cerrar();
  }, 120_000);
});

describe('los eventos', () => {
  it('avisan del turno y se reconectan con espera creciente', () => {
    const fuentes: {
      mensajes: Map<string, (d: string) => void>;
      error: () => void;
      cerrada: boolean;
    }[] = [];
    const esperas: number[] = [];
    const pendientes: (() => void)[] = [];
    const turnos: number[] = [];
    const parar = escucharEventos({
      url: '/api/partidas/p1/eventos',
      crear: (): FuenteDeEventos => {
        const f: (typeof fuentes)[number] = {
          mensajes: new Map<string, (d: string) => void>(),
          error: () => undefined,
          cerrada: false,
        };
        fuentes.push(f);
        return {
          alMensaje: (tipo, oyente) => {
            f.mensajes.set(tipo, oyente);
          },
          alError: (oyente) => {
            f.error = oyente;
          },
          cerrar: () => {
            f.cerrada = true;
          },
        };
      },
      alTurno: (t) => turnos.push(t),
      programar: (hacer, ms) => {
        esperas.push(ms);
        pendientes.push(hacer);
      },
    });
    fuentes[0]?.mensajes.get('turno-resuelto')?.('{"turno":4,"avisos":1}');
    fuentes[0]?.mensajes.get('turno-resuelto')?.('no es json');
    expect(turnos).toEqual([4]);
    fuentes[0]?.error();
    pendientes.shift()?.();
    fuentes[1]?.error();
    pendientes.shift()?.();
    expect(esperas).toEqual([1000, 2000]);
    expect(fuentes[0]?.cerrada).toBe(true);
    expect(esperaDeReconexion(10)).toBe(30_000);
    parar();
    expect(fuentes[2]?.cerrada).toBe(true);
  });
});

describe('de punta a punta con el servidor real (criterio 6)', () => {
  it('enlace, entrar, convocar en solitario, sortear, elegir, ver la partida y dar una orden', async () => {
    const repo = new RepositorioSqlite(':memory:');
    await repo.migrar(AHORA);
    const correo = new CorreoEnMemoria();
    const registro = new RegistroEnMemoria();
    const ahora = () => AHORA;
    const cuentas = new ServicioDeCuentas({
      repo,
      correo,
      claveDeCookies: new Uint8Array(32).fill(3),
      urlPublica: 'http://x',
      registro,
      ahora,
      cookieSegura: false,
    });
    const api = crearApi({
      repo,
      reglas: TABLAS_DEL_JUEGO,
      proveedorDeMundo: proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO),
      autenticador: autenticadorDeSesiones(cuentas),
      registro,
      ahora,
      cuentas,
      altas: new ServicioDeAltas({
        repo,
        mundoCompleto: mundoPeninsula(),
        reglas: TABLAS_DEL_JUEGO,
        ahora,
      }),
    });
    const servidor = await servirHttp(api);
    try {
      const tarro: TarroDeCookies = { cookie: null };
      const cliente = new ClienteApi({
        base: `http://127.0.0.1:${String(servidor.puerto)}`,
        tarro,
      });
      const almacen = new Almacen({
        api: cliente,
        guardado: new GuardadoEnMemoria(),
        reglas: TABLAS_DEL_JUEGO,
        ahora,
        nuevaClave: () => 'k1',
      });

      expect(await almacen.pedirEnlace('ana@correo.es')).toBe(true);
      const token = correo.ultimoToken('ana@correo.es') ?? '';
      expect(await almacen.entrar(token)).toBe(true);
      expect(tarro.cookie).toMatch(/^sesion=/);

      const convocada = await cliente.convocar({
        nombre: 'Mi partida',
        casa: 'hortelanos',
        intervaloMinutos: 1440,
        plazas: 1,
      });
      if (!convocada.ok) throw new Error(convocada.mensaje);
      const sorteada = await cliente.sortear(convocada.datos.id);
      if (!sorteada.ok) throw new Error(sorteada.mensaje);
      const comarca = sorteada.datos.convocatoria.misOfertas[0]?.comarca ?? '';
      const elegida = await cliente.elegir(convocada.datos.id, comarca);
      expect(elegida.ok && elegida.datos.convocatoria.estado).toBe('fundada');

      const mias = await cliente.misPartidas();
      expect(mias.ok && mias.datos.partidas.map((p) => p.id)).toEqual([convocada.datos.id]);
      await almacen.abrirPartida(convocada.datos.id);
      expect(almacen.estado.partida?.recibido.vista.jugador.capital).toBe(comarca);
      await almacen.anyadir({ tipo: 'roturar', comarca });
      expect(almacen.estado.pendientes).toEqual([]);
      const enElServidor = await cliente.ordenesPendientes(convocada.datos.id);
      expect(enElServidor.ok && enElServidor.datos.ordenes.map((o) => o.id)).toEqual([
        `o-1-hortelanos-k1`,
      ]);
    } finally {
      await servidor.cerrar();
      await repo.cerrar();
    }
  }, 120_000);
});
