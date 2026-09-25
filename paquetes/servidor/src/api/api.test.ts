// La API (ficha T-062 §6): fuga, cliente manipulado, idempotencia, coste, carrera, limites,
// retirada, errores y HTTP real.
import { describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO, vistaDeJugador } from '@conquer/nucleo';
import type { IdPartida } from '@conquer/nucleo';

import { AHORA } from '../persistencia/prueba-comun.ts';
import type { Repositorio } from '../persistencia/repositorio.ts';
import { CODIGOS_DE_API } from './errores.ts';
import { servirHttp } from './http.ts';
import { CUERPO_MAXIMO_BYTES, CuboDeFichas } from './limites.ts';
import { apiDePrueba, CUENTAS } from './prueba-comun.ts';
import type { ApiDePrueba } from './prueba-comun.ts';

const MESTA = CUENTAS['mesta'] ?? '';
const MONJES = CUENTAS['monjes'] ?? '';
const CANTEROS = CUENTAS['canteros'] ?? '';
const AJENA = 'cuenta-que-no-juega';

function cuerpoDe(respuesta: { cuerpo: unknown }): Record<string, unknown> {
  return respuesta.cuerpo as Record<string, unknown>;
}

function codigoDe(respuesta: { cuerpo: unknown }): string {
  const error = cuerpoDe(respuesta)['error'] as { codigo?: string } | undefined;
  return error?.codigo ?? '';
}

/** Una comarca propia de esa casa, para dar ordenes que valen. */
async function capitalDe(e: ApiDePrueba, casa: string): Promise<string> {
  const estado = await e.repo.ultimoEstado('p1' as IdPartida);
  const jugador = estado?.jugadores[casa];
  if (jugador === undefined) throw new Error(`no hay ${casa}`);
  return jugador.capital;
}

describe('las rutas de lectura', () => {
  it('cada cuenta ve solo sus partidas, y el estado es exactamente su vista', async () => {
    const e = await apiDePrueba();
    const mias = await e.pedir(MESTA, 'GET', '/partidas/mias');
    expect(mias.estado).toBe(200);
    expect(cuerpoDe(mias)['partidas']).toEqual([
      expect.objectContaining({ id: 'p1', casa: 'mesta', turno: 6, estado: 'activa' }),
    ]);
    expect(cuerpoDe(await e.pedir(AJENA, 'GET', '/partidas/mias'))['partidas']).toEqual([]);

    const respuesta = await e.pedir(MESTA, 'GET', '/partidas/p1/estado');
    const estado = await e.repo.ultimoEstado('p1' as IdPartida);
    if (estado === null) throw new Error('sin estado');
    const esperada = vistaDeJugador(estado, 'mesta' as never, e.mundo);
    expect(respuesta.estado).toBe(200);
    expect(cuerpoDe(respuesta)['turno']).toBe(6);
    expect(cuerpoDe(respuesta)['version']).toBe(1);
    expect(cuerpoDe(respuesta)['vista']).toEqual(JSON.parse(JSON.stringify(esperada)));
    await e.repo.cerrar();
  }, 120_000);

  it('la clasificacion y la cronica propia de un turno resuelto; las de un turno futuro, no', async () => {
    const e = await apiDePrueba();
    const clasificacion = await e.pedir(MONJES, 'GET', '/partidas/p1/clasificacion');
    expect(cuerpoDe(clasificacion)['clasificacion']).toHaveLength(3);
    const cronica = await e.pedir(MONJES, 'GET', '/partidas/p1/cronica/3');
    expect(cronica.estado).toBe(200);
    expect(cuerpoDe(cronica)['cronica']).toMatchObject({ turno: 3, jugador: 'monjes' });
    for (const turno of ['6', '99', '0', 'x', '-1', '1.5']) {
      const r = await e.pedir(MONJES, 'GET', `/partidas/p1/cronica/${turno}`);
      expect(codigoDe(r), turno).toBe('cronica-no-disponible');
    }
    await e.repo.cerrar();
  }, 120_000);
});

describe('la prueba de fuga (criterio 1)', () => {
  it('ninguna respuesta de ninguna ruta lleva la semilla ni nada de otro jugador', async () => {
    const e = await apiDePrueba({ semilla: 'semilla-secreta-del-servidor' });
    const casas = [
      ['mesta', MESTA],
      ['monjes', MONJES],
      ['canteros', CANTEROS],
    ] as const;
    // Cada jugador da una orden que otro no debe ver salir por ninguna parte.
    const suyas = new Map<string, string>();
    for (const [casa, cuenta] of casas) {
      const capital = await capitalDe(e, casa);
      const r = await e.pedir(cuenta, 'POST', '/partidas/p1/ordenes', {
        idCliente: `secreta-${casa}`,
        tipo: 'roturar',
        comarca: capital,
      });
      expect(r.estado, casa).toBe(201);
      suyas.set(casa, `secreta-${casa}`);
    }
    const estado = await e.repo.ultimoEstado('p1' as IdPartida);
    if (estado === null) throw new Error('sin estado');

    for (const [casa, cuenta] of casas) {
      const respuestas: unknown[] = [
        (await e.pedir(cuenta, 'GET', '/partidas/mias')).cuerpo,
        (await e.pedir(cuenta, 'GET', '/partidas/p1/estado')).cuerpo,
        (await e.pedir(cuenta, 'GET', '/partidas/p1/clasificacion')).cuerpo,
        (await e.pedir(cuenta, 'GET', '/partidas/p1/ordenes')).cuerpo,
      ];
      for (let turno = 1; turno <= 5; turno += 1) {
        respuestas.push(
          (await e.pedir(cuenta, 'GET', `/partidas/p1/cronica/${String(turno)}`)).cuerpo,
        );
      }
      const texto = JSON.stringify(respuestas);
      expect(texto, `${casa}: la semilla`).not.toContain('semilla-secreta-del-servidor');
      for (const [otra, clave] of suyas) {
        if (otra === casa) continue;
        expect(texto, `${casa} no ve la orden ${clave} de ${otra}`).not.toContain(clave);
        expect(texto, `${casa} no ve la cuenta de ${otra}`).not.toContain(CUENTAS[otra] ?? 'x');
      }
      // Ni los almacenes ajenos, exactos, en ninguna parte de la vista.
      for (const otro of Object.values(estado.jugadores)) {
        if (otro.id === (casa as string)) continue;
        expect(texto, `${casa}: almacen de ${otro.id}`).not.toContain(JSON.stringify(otro.almacen));
      }
      expect((cuerpoDe({ cuerpo: respuestas[3] })['ordenes'] as unknown[]).length).toBe(1);
    }
    await e.repo.cerrar();
  }, 180_000);

  it('una cuenta que no juega no ve nada de la partida, y no se distingue de que no exista', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    for (const [metodo, ruta] of [
      ['GET', '/partidas/p1/estado'],
      ['GET', '/partidas/p1/clasificacion'],
      ['GET', '/partidas/p1/ordenes'],
      ['GET', '/partidas/p1/cronica/1'],
      ['POST', '/partidas/p1/ordenes'],
      ['DELETE', '/partidas/p1/ordenes/x'],
    ] as const) {
      const ajena = await e.pedir(AJENA, metodo, ruta, metodo === 'POST' ? {} : undefined);
      const inexistente = await e.pedir(
        AJENA,
        metodo,
        ruta.replace('p1', 'no-existe'),
        metodo === 'POST' ? {} : undefined,
      );
      expect(codigoDe(ajena), ruta).toBe('partida-desconocida');
      expect(ajena.estado).toBe(inexistente.estado);
    }
    await e.repo.cerrar();
  }, 120_000);
});

describe('el cliente manipulado (criterio 2)', () => {
  it('no puede falsificar el coste ni ningun campo interno, ni mandar campos de mas', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const capital = await capitalDe(e, 'mesta');
    const buena = { idCliente: 'k1', tipo: 'roturar', comarca: capital };
    for (const extra of [
      { coste: { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 } },
      { jugador: 'monjes' },
      { turnoAlta: 1 },
      { estado: 'en curso' },
      { cola: 'comarca:x' },
      { delMayordomo: true },
      { id: 'o-1-monjes-k1' },
      { pirata: true },
    ]) {
      const r = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', { ...buena, ...extra });
      expect(r.estado, JSON.stringify(extra)).toBe(400);
      expect(codigoDe(r)).toBe('orden-invalida');
    }
    expect((await e.repo.ordenesPendientes('p1' as IdPartida)).length).toBe(0);
    await e.repo.cerrar();
  }, 120_000);

  it('no puede dar ordenes sobre lo ajeno, y el autor lo pone el servidor', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const capitalMonjes = await capitalDe(e, 'monjes');
    const ajena = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', {
      idCliente: 'k1',
      tipo: 'roturar',
      comarca: capitalMonjes,
    });
    expect(codigoDe(ajena)).toBe('orden-invalida');
    expect(
      String(cuerpoDe(ajena)['error'] && (cuerpoDe(ajena)['error'] as { mensaje: string }).mensaje),
    ).toContain('no es tuya');

    const capital = await capitalDe(e, 'mesta');
    const buena = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', {
      idCliente: 'k2',
      tipo: 'roturar',
      comarca: capital,
    });
    expect(buena.estado).toBe(201);
    expect(cuerpoDe(buena)['orden']).toMatchObject({
      jugador: 'mesta',
      turnoAlta: 2,
      estado: 'pendiente',
    });
    await e.repo.cerrar();
  }, 120_000);

  it('el coste de la orden es el de las reglas con los modificadores de su casa, no el que diga el cliente', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const capital = await capitalDe(e, 'canteros');
    const r = await e.pedir(CANTEROS, 'POST', '/partidas/p1/ordenes', {
      idCliente: 'k1',
      tipo: 'aperos',
      comarca: capital,
    });
    expect(r.estado).toBe(201);
    expect((cuerpoDe(r)['orden'] as { coste: unknown }).coste).toEqual(
      TABLAS_DEL_JUEGO.obras.costeAperos,
    );
    await e.repo.cerrar();
  }, 120_000);

  it('una orden para un turno cerrado se rechaza sin guardar nada (criterio 6)', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const capital = await capitalDe(e, 'mesta');
    // La carrera: entre que la API lee el turno y guarda la orden, el reloj resuelve el turno.
    let resuelto = false;
    const conCarrera = new Proxy(e.repo, {
      get(objetivo, propiedad) {
        if (propiedad === 'ordenesPendientes') {
          return async (...argumentos: Parameters<Repositorio['ordenesPendientes']>) => {
            if (!resuelto) {
              resuelto = true;
              await e.resolver();
            }
            return objetivo.ordenesPendientes(...argumentos);
          };
        }
        const valor: unknown = Reflect.get(objetivo, propiedad);
        if (typeof valor !== 'function') return valor;
        const atada: unknown = valor.bind(objetivo);
        return atada;
      },
    });
    const { crearApi } = await import('./manejadores.ts');
    const api = crearApi({ ...e.dep, repo: conCarrera });
    const r = await api({
      metodo: 'POST',
      ruta: '/partidas/p1/ordenes',
      cabeceras: { 'x-cuenta': MESTA, 'content-type': 'application/json' },
      cuerpo: JSON.stringify({ idCliente: 'k1', tipo: 'roturar', comarca: capital }),
    });
    expect(r.estado).toBe(409);
    expect(codigoDe(r)).toBe('turno-cerrado');
    expect(await e.repo.ordenesPendientes('p1' as IdPartida)).toHaveLength(0);
    await e.repo.cerrar();
  }, 120_000);
});

describe('la idempotencia (criterio 3)', () => {
  it('reenviar la misma orden no la duplica; con otro contenido, la clave esta usada', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const capital = await capitalDe(e, 'mesta');
    const cuerpo = { idCliente: 'reintento', tipo: 'roturar', comarca: capital };
    const primera = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', cuerpo);
    const segunda = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', cuerpo);
    expect(primera.estado).toBe(201);
    expect(segunda.estado).toBe(200);
    expect(cuerpoDe(segunda)['repetida']).toBe(true);
    expect(cuerpoDe(segunda)['orden']).toEqual(cuerpoDe(primera)['orden']);
    expect(await e.repo.ordenesPendientes('p1' as IdPartida)).toHaveLength(1);

    const otra = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', {
      ...cuerpo,
      tipo: 'aperos',
    });
    expect(codigoDe(otra)).toBe('clave-reutilizada');
    expect(await e.repo.ordenesPendientes('p1' as IdPartida)).toHaveLength(1);
    await e.repo.cerrar();
  }, 120_000);

  it('dos jugadores con la misma clave no chocan', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    for (const [casa, cuenta] of [
      ['mesta', MESTA],
      ['monjes', MONJES],
    ] as const) {
      const r = await e.pedir(cuenta, 'POST', '/partidas/p1/ordenes', {
        idCliente: 'misma',
        tipo: 'roturar',
        comarca: await capitalDe(e, casa),
      });
      expect(r.estado, casa).toBe(201);
    }
    await e.repo.cerrar();
  }, 120_000);
});

describe('los limites (criterio 7)', () => {
  it('un cuerpo de mas de 64 KiB se rechaza', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const grande = JSON.stringify({ idCliente: 'k', relleno: 'x'.repeat(CUERPO_MAXIMO_BYTES) });
    const r = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', grande);
    expect(r.estado).toBe(413);
    expect(codigoDe(r)).toBe('cuerpo-demasiado-grande');
    await e.repo.cerrar();
  }, 120_000);

  it('la orden 201 del turno se rechaza', async () => {
    const e = await apiDePrueba({ turnosJugados: 1, cubo: new CuboDeFichas(10_000, 10_000) });
    const capital = await capitalDe(e, 'mesta');
    for (let i = 0; i < 200; i += 1) {
      const r = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', {
        idCliente: `orden-${String(i)}`,
        tipo: 'roturar',
        comarca: capital,
      });
      expect(r.estado, String(i)).toBe(201);
    }
    const r = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', {
      idCliente: 'sobra',
      tipo: 'roturar',
      comarca: capital,
    });
    expect(r.estado).toBe(429);
    expect(codigoDe(r)).toBe('demasiadas-ordenes');
    // Otro jugador no paga por ello.
    const otro = await e.pedir(MONJES, 'POST', '/partidas/p1/ordenes', {
      idCliente: 'sobra',
      tipo: 'roturar',
      comarca: await capitalDe(e, 'monjes'),
    });
    expect(otro.estado).toBe(201);
    await e.repo.cerrar();
  }, 180_000);

  it('la peticion 31 seguida se rechaza con retry-after, y a los dos segundos vuelve a pasar', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    for (let i = 0; i < 30; i += 1) {
      expect((await e.pedir(MESTA, 'GET', '/partidas/mias')).estado, String(i)).toBe(200);
    }
    const r = await e.pedir(MESTA, 'GET', '/partidas/mias');
    expect(r.estado).toBe(429);
    expect(codigoDe(r)).toBe('demasiadas-peticiones');
    expect(Number(r.cabeceras['retry-after'])).toBeGreaterThanOrEqual(1);
    // Es por cuenta: otra cuenta sigue pudiendo.
    expect((await e.pedir(MONJES, 'GET', '/partidas/mias')).estado).toBe(200);
    e.ahora.valor = AHORA + 2000;
    expect((await e.pedir(MESTA, 'GET', '/partidas/mias')).estado).toBe(200);
    await e.repo.cerrar();
  }, 120_000);
});

describe('retirar una orden (criterio 8)', () => {
  it('se retira una pendiente propia; una ajena, desconocida o ya aplicada, no', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const capital = await capitalDe(e, 'mesta');
    const alta = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', {
      idCliente: 'k1',
      tipo: 'roturar',
      comarca: capital,
    });
    const id = (cuerpoDe(alta)['orden'] as { id: string }).id;

    expect(codigoDe(await e.pedir(MONJES, 'DELETE', `/partidas/p1/ordenes/${id}`))).toBe(
      'orden-desconocida',
    );
    expect(codigoDe(await e.pedir(MESTA, 'DELETE', '/partidas/p1/ordenes/no-existe'))).toBe(
      'orden-desconocida',
    );
    const retirada = await e.pedir(MESTA, 'DELETE', `/partidas/p1/ordenes/${id}`);
    expect(retirada.estado).toBe(200);
    expect(cuerpoDe(retirada)['retirada']).toBe(id);
    expect(codigoDe(await e.pedir(MESTA, 'DELETE', `/partidas/p1/ordenes/${id}`))).toBe(
      'orden-no-retirable',
    );

    const otra = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', {
      idCliente: 'k2',
      tipo: 'roturar',
      comarca: capital,
    });
    const idOtra = (cuerpoDe(otra)['orden'] as { id: string }).id;
    await e.resolver();
    expect(codigoDe(await e.pedir(MESTA, 'DELETE', `/partidas/p1/ordenes/${idOtra}`))).toBe(
      'orden-no-retirable',
    );
    await e.repo.cerrar();
  }, 120_000);
});

describe('los errores (criterio 9)', () => {
  it('todos llevan un codigo de la lista, un mensaje en espanyol y la version de reglas', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const capital = await capitalDe(e, 'mesta');
    const casos: [string | null, string, string, unknown?][] = [
      [null, 'GET', '/partidas/mias'],
      [MESTA, 'GET', '/nada'],
      [MESTA, 'PUT', '/partidas/mias'],
      [MESTA, 'POST', '/partidas/p1/ordenes', '{roto'],
      [MESTA, 'POST', '/partidas/p1/ordenes'],
      [MESTA, 'POST', '/partidas/p1/ordenes', { tipo: 'roturar', comarca: capital }],
      [MESTA, 'GET', '/partidas/no-existe/estado'],
      [MESTA, 'GET', '/partidas/p1/cronica/99'],
    ];
    const vistos = new Set<string>();
    for (const [cuenta, metodo, ruta, cuerpo] of casos) {
      const r = await e.pedir(cuenta, metodo, ruta, cuerpo);
      const error = cuerpoDe(r)['error'] as { codigo: string; mensaje: string };
      expect(CODIGOS_DE_API as readonly string[], `${metodo} ${ruta}`).toContain(error.codigo);
      expect(error.mensaje.length).toBeGreaterThan(15);
      expect(cuerpoDe(r)['version']).toBe(1);
      expect(r.estado).toBeGreaterThanOrEqual(400);
      vistos.add(error.codigo);
    }
    expect([...vistos].sort()).toEqual([
      'cronica-no-disponible',
      'cuerpo-invalido',
      'metodo-no-permitido',
      'no-autenticado',
      'orden-invalida',
      'partida-desconocida',
      'ruta-desconocida',
    ]);
    const put = await e.pedir(MESTA, 'PUT', '/partidas/mias');
    expect(put.cabeceras['allow']).toBe('GET');
    await e.repo.cerrar();
  }, 120_000);

  it('un fallo inesperado devuelve error-interno sin detalle y lo anota', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const { crearApi } = await import('./manejadores.ts');
    const api = crearApi({
      ...e.dep,
      proveedorDeMundo: () => {
        throw new Error('detalle secreto del servidor');
      },
    });
    const r = await api({
      metodo: 'GET',
      ruta: '/partidas/p1/estado',
      cabeceras: { 'x-cuenta': MESTA },
      cuerpo: null,
    });
    expect(r.estado).toBe(500);
    expect(codigoDe(r)).toBe('error-interno');
    expect(JSON.stringify(r.cuerpo)).not.toContain('detalle secreto');
    expect(e.registro.eventos('error')).toContain('error-interno');
    await e.repo.cerrar();
  }, 120_000);

  it('una partida detenida ya no admite ordenes', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    await e.repo.detenerPartida('p1' as IdPartida, 'prueba');
    const r = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', {
      idCliente: 'k1',
      tipo: 'roturar',
      comarca: await capitalDe(e, 'mesta'),
    });
    expect(codigoDe(r)).toBe('partida-detenida');
    // Pero sigue pudiendo leerla.
    expect((await e.pedir(MESTA, 'GET', '/partidas/p1/estado')).estado).toBe(200);
    await e.repo.cerrar();
  }, 120_000);
});

describe('HTTP real (criterio 10)', () => {
  it('sirve las rutas de verdad en un puerto libre', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const servidor = await servirHttp(e.api);
    try {
      const base = `http://127.0.0.1:${String(servidor.puerto)}`;
      const sinCuenta = await fetch(`${base}/partidas/mias`);
      expect(sinCuenta.status).toBe(401);
      const mias = await fetch(`${base}/partidas/mias`, { headers: { 'x-cuenta': MESTA } });
      expect(mias.status).toBe(200);
      expect(mias.headers.get('content-type')).toContain('application/json');
      expect(((await mias.json()) as { partidas: unknown[] }).partidas).toHaveLength(1);

      const alta = await fetch(`${base}/partidas/p1/ordenes`, {
        method: 'POST',
        headers: { 'x-cuenta': MESTA, 'content-type': 'application/json' },
        body: JSON.stringify({
          idCliente: 'http-1',
          tipo: 'roturar',
          comarca: await capitalDe(e, 'mesta'),
        }),
      });
      expect(alta.status).toBe(201);
      const enorme = await fetch(`${base}/partidas/p1/ordenes`, {
        method: 'POST',
        headers: { 'x-cuenta': MESTA },
        body: 'x'.repeat(CUERPO_MAXIMO_BYTES * 3),
      });
      expect(enorme.status).toBe(413);
    } finally {
      await servidor.cerrar();
    }
    await e.repo.cerrar();
  }, 120_000);
});
