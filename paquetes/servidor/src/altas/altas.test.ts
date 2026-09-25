// Alta de partidas (ficha T-065 §5): convocar, unirse, sortear, elegir y fundar.
import { describe, expect, it } from 'vitest';

import {
  CASAS,
  TABLAS_DEL_JUEGO,
  canonico,
  huella,
  prepararPartida,
  resolverTurno,
} from '@conquer/nucleo';
import type { Casa, IdJugador, IdPartida, OfertaDeOrigen } from '@conquer/nucleo';

import { CuboDeFichas } from '../api/limites.ts';
import { crearApi } from '../api/manejadores.ts';
import type { RespuestaHttp } from '../api/tipos.ts';
import { AHORA, mundoPeninsula } from '../persistencia/prueba-comun.ts';
import { RepositorioSqlite } from '../persistencia/sqlite.ts';
import { proveedorDeRecorte } from '../reloj/mundoDeLaPartida.ts';
import { RegistroEnMemoria } from '../reloj/registro.ts';
import { resolverUnTurno } from '../reloj/resolucion.ts';
import { ServicioDeAltas } from './servicio.ts';
import type { VistaDeConvocatoria } from './servicio.ts';

interface Entorno {
  readonly repo: RepositorioSqlite;
  readonly altas: ServicioDeAltas;
  pedir(cuenta: string, metodo: string, ruta: string, cuerpo?: unknown): Promise<RespuestaHttp>;
  cuenta(nombre: string): Promise<string>;
}

async function entorno(repo = new RepositorioSqlite(':memory:')): Promise<Entorno> {
  await repo.migrar(AHORA);
  const altas = new ServicioDeAltas({
    repo,
    mundoCompleto: mundoPeninsula(),
    reglas: TABLAS_DEL_JUEGO,
    ahora: () => AHORA,
  });
  const api = crearApi({
    repo,
    reglas: TABLAS_DEL_JUEGO,
    proveedorDeMundo: proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO),
    autenticador: { identificar: (p) => Promise.resolve(p.cabeceras['x-cuenta'] ?? null) },
    registro: new RegistroEnMemoria(),
    ahora: () => AHORA,
    altas,
    cubo: new CuboDeFichas(100_000, 100_000),
  });
  return {
    repo,
    altas,
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
    cuenta: async (nombre) =>
      (await repo.cuentaDeCorreo(`${nombre}@correo.es`, `c-${nombre}`, nombre, AHORA)).id,
  };
}

function vista(r: RespuestaHttp): VistaDeConvocatoria {
  return (r.cuerpo as { convocatoria: VistaDeConvocatoria }).convocatoria;
}

function codigoDe(r: RespuestaHttp): string {
  return (r.cuerpo as { error?: { codigo?: string } }).error?.codigo ?? '';
}

/** Convoca con estas casas (la primera convoca) y devuelve el id y las cuentas por casa. */
async function convocar(
  e: Entorno,
  casas: readonly Casa[],
  extra: Record<string, unknown> = {},
): Promise<{ id: string; codigo: string; cuentas: Record<string, string> }> {
  const cuentas: Record<string, string> = {};
  for (const casa of casas)
    cuentas[casa] = await e.cuenta(`${casa}${String(Math.random()).slice(2, 8)}`);
  const primera = casas[0] ?? 'mesta';
  const r = await e.pedir(cuentas[primera] ?? '', 'POST', '/convocatorias', {
    nombre: 'Partida de amigos',
    casa: primera,
    intervaloMinutos: 1440,
    plazas: casas.length,
    ...extra,
  });
  expect(r.estado, JSON.stringify(r.cuerpo)).toBe(201);
  const { id, codigo } = r.cuerpo as { id: string; codigo: string };
  for (const casa of casas.slice(1)) {
    const u = await e.pedir(cuentas[casa] ?? '', 'POST', '/convocatorias/unirse', { codigo, casa });
    expect(u.estado, casa).toBe(200);
  }
  return { id, codigo, cuentas };
}

describe('el recorrido completo por la API', () => {
  it('convocar, unirse, sortear, elegir y fundar; la partida se juega', async () => {
    const e = await entorno();
    const casas: Casa[] = ['mesta', 'monjes', 'canteros'];
    const { id, codigo, cuentas } = await convocar(e, casas);
    const creador = cuentas['mesta'] ?? '';
    const otro = cuentas['monjes'] ?? '';

    const antes = vista(await e.pedir(creador, 'GET', `/convocatorias/${id}`));
    expect(antes).toMatchObject({ estado: 'abierta', codigo, misOfertas: [] });
    expect(vista(await e.pedir(otro, 'GET', `/convocatorias/${id}`)).codigo).toBeNull();

    expect(codigoDe(await e.pedir(otro, 'POST', `/convocatorias/${id}/sortear`))).toBe(
      'solo-quien-convoca',
    );
    const sorteada = vista(await e.pedir(creador, 'POST', `/convocatorias/${id}/sortear`));
    expect(sorteada.estado).toBe('eligiendo');
    expect(sorteada.misOfertas.length).toBeGreaterThan(0);
    expect(codigoDe(await e.pedir(creador, 'POST', `/convocatorias/${id}/sortear`))).toBe(
      'convocatoria-cerrada',
    );

    // Cada uno ve sus ofertas y no las de los demas; la semilla no sale nunca.
    const ofertas: Record<string, readonly OfertaDeOrigen[]> = {};
    for (const casa of casas) {
      const r = await e.pedir(cuentas[casa] ?? '', 'GET', `/convocatorias/${id}`);
      ofertas[casa] = vista(r).misOfertas;
      const convocatoria = await e.repo.convocatoria(id);
      expect(JSON.stringify(r.cuerpo)).not.toContain(convocatoria?.semilla ?? 'x');
    }
    const deMonjes = JSON.stringify(ofertas['monjes']);
    expect(
      JSON.stringify((await e.pedir(creador, 'GET', `/convocatorias/${id}`)).cuerpo),
    ).not.toContain(deMonjes);

    expect(
      codigoDe(
        await e.pedir(creador, 'POST', `/convocatorias/${id}/eleccion`, { comarca: 'no-existe' }),
      ),
    ).toBe('eleccion-invalida');
    const ajena = ofertas['monjes']?.find(
      (o) => !(ofertas['mesta'] ?? []).some((m) => m.comarca === o.comarca),
    );
    if (ajena !== undefined) {
      expect(
        codigoDe(
          await e.pedir(creador, 'POST', `/convocatorias/${id}/eleccion`, {
            comarca: ajena.comarca,
          }),
        ),
      ).toBe('eleccion-invalida');
    }
    for (const casa of casas) {
      const comarca = ofertas[casa]?.[0]?.comarca ?? '';
      const r = await e.pedir(cuentas[casa] ?? '', 'POST', `/convocatorias/${id}/eleccion`, {
        comarca,
      });
      expect(r.estado, casa).toBe(200);
    }
    const fundada = vista(await e.pedir(creador, 'GET', `/convocatorias/${id}`));
    expect(fundada).toMatchObject({ estado: 'fundada', partida: id });
    expect(
      codigoDe(await e.pedir(creador, 'POST', `/convocatorias/${id}/eleccion`, { comarca: 'x' })),
    ).toBe('convocatoria-cerrada');

    // La partida esta en «mis partidas» de cada jugador y el reloj la resuelve (mundo reconstruido).
    for (const casa of casas) {
      const mias = (await e.pedir(cuentas[casa] ?? '', 'GET', '/partidas/mias')).cuerpo as {
        partidas: { id: string; casa: string }[];
      };
      expect(mias.partidas).toEqual([expect.objectContaining({ id, casa })]);
    }
    const estado = await e.repo.ultimoEstado(id as IdPartida);
    expect(estado?.jugadores['mesta']?.capital).toBe(ofertas['mesta']?.[0]?.comarca);
    const resuelto = await resolverUnTurno(
      {
        repo: e.repo,
        reglas: TABLAS_DEL_JUEGO,
        proveedorDeMundo: proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO),
        resolverTurno,
        registro: new RegistroEnMemoria(),
        ahora: () => AHORA + 2 * 86_400_000,
      },
      id as IdPartida,
    );
    expect(resuelto.tipo).toBe('resuelto');
    await e.repo.cerrar();
  }, 120_000);
});

describe('el sorteo es reproducible y persiste (criterios 1 y 4)', () => {
  it('lo guardado es lo que sale de la misma semilla, y otro servicio lee lo mismo', async () => {
    const e = await entorno();
    const { id, cuentas } = await convocar(e, ['arrieros', 'salineros']);
    const creador = cuentas['arrieros'] ?? '';
    const sorteada = vista(await e.pedir(creador, 'POST', `/convocatorias/${id}/sortear`));
    const guardada = await e.repo.convocatoria(id);
    const plazas = await e.repo.plazas(id);
    const otra = prepararPartida({
      mundo: mundoPeninsula(),
      reglas: TABLAS_DEL_JUEGO,
      semilla: guardada?.semilla ?? '',
      participantes: plazas.map((p) => ({
        id: p.casa as IdJugador,
        nombre: p.nombre,
        casa: p.casa as Casa,
      })),
      recortar: true,
    });
    if (!otra.ok) throw new Error('no se prepara');
    expect(canonico(otra.valor.ofertas)).toBe(guardada?.ofertas);
    expect(huella(otra.valor.mundo)).toBe(guardada?.huellaMundo);

    const releida = await new ServicioDeAltas({
      repo: e.repo,
      mundoCompleto: mundoPeninsula(),
      reglas: TABLAS_DEL_JUEGO,
      ahora: () => AHORA,
    }).ver(creador, id);
    expect(releida.misOfertas).toEqual(sorteada.misOfertas);
    await e.repo.cerrar();
  }, 120_000);
});

describe('con ocho casas, cualquier eleccion respeta la distancia (criterio 2)', () => {
  it.each([0, 1, 2])(
    'combinacion %i',
    async (desplazamiento) => {
      const e = await entorno();
      const { id, cuentas } = await convocar(e, CASAS);
      await e.pedir(cuentas[CASAS[0]] ?? '', 'POST', `/convocatorias/${id}/sortear`);
      for (const [i, casa] of CASAS.entries()) {
        const cuenta = cuentas[casa] ?? '';
        const suyas = vista(await e.pedir(cuenta, 'GET', `/convocatorias/${id}`)).misOfertas;
        const comarca = suyas[(i + desplazamiento) % suyas.length]?.comarca ?? '';
        const r = await e.pedir(cuenta, 'POST', `/convocatorias/${id}/eleccion`, { comarca });
        expect(r.estado, JSON.stringify(r.cuerpo)).toBe(200);
      }
      expect((await e.repo.convocatoria(id))?.estado).toBe('fundada');
      expect(
        Object.keys((await e.repo.ultimoEstado(id as IdPartida))?.jugadores ?? {}),
      ).toHaveLength(8);
      await e.repo.cerrar();
    },
    120_000,
  );
});

describe('cada casa recibe origenes viables (criterio 3)', () => {
  it.each(CASAS)(
    '%s: funda con cada una de sus ofertas y resuelve dos turnos',
    async (casa) => {
      const e = await entorno();
      const proveedor = proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO);
      for (let indice = 0; indice < 3; indice += 1) {
        const { id, cuentas } = await convocar(e, [casa], {
          esDePrueba: true,
          intervaloMinutos: 1,
        });
        const cuenta = cuentas[casa] ?? '';
        const suyas = vista(
          await e.pedir(cuenta, 'POST', `/convocatorias/${id}/sortear`),
        ).misOfertas;
        const oferta = suyas[indice];
        if (oferta === undefined) continue;
        const r = await e.pedir(cuenta, 'POST', `/convocatorias/${id}/eleccion`, {
          comarca: oferta.comarca,
        });
        expect(vista(r).estado, `${casa} ${oferta.comarca}`).toBe('fundada');
        for (let t = 1; t <= 2; t += 1) {
          const resultado = await resolverUnTurno(
            {
              repo: e.repo,
              reglas: TABLAS_DEL_JUEGO,
              proveedorDeMundo: proveedor,
              resolverTurno,
              registro: new RegistroEnMemoria(),
              ahora: () => AHORA + t * 60_000,
            },
            id as IdPartida,
          );
          expect(resultado.tipo, `${casa} ${oferta.comarca} turno ${String(t)}`).toBe('resuelto');
        }
      }
      await e.repo.cerrar();
    },
    180_000,
  );
});

describe('las reglas del alta (criterio 6)', () => {
  it('cada rechazo con su codigo', async () => {
    const e = await entorno();
    const a = await e.cuenta('ana');
    const b = await e.cuenta('beto');
    const c = await e.cuenta('carla');
    const base = { nombre: 'P', casa: 'mesta', intervaloMinutos: 1440, plazas: 2 };
    for (const malo of [
      { ...base, nombre: '' },
      { ...base, casa: 'templarios' },
      { ...base, intervaloMinutos: 90 },
      { ...base, plazas: 0 },
      { ...base, plazas: 9 },
      { ...base, esDePrueba: true, intervaloMinutos: 0 },
    ]) {
      expect(codigoDe(await e.pedir(a, 'POST', '/convocatorias', malo)), JSON.stringify(malo)).toBe(
        'configuracion-invalida',
      );
    }
    expect(
      (
        await e.pedir(a, 'POST', '/convocatorias', {
          ...base,
          esDePrueba: true,
          intervaloMinutos: 7,
        })
      ).estado,
    ).toBe(201);

    const { id, codigo } = (await e.pedir(a, 'POST', '/convocatorias', base)).cuerpo as {
      id: string;
      codigo: string;
    };
    expect(
      codigoDe(
        await e.pedir(b, 'POST', '/convocatorias/unirse', { codigo: 'falso', casa: 'monjes' }),
      ),
    ).toBe('convocatoria-desconocida');
    expect(
      codigoDe(await e.pedir(b, 'POST', '/convocatorias/unirse', { codigo, casa: 'mesta' })),
    ).toBe('casa-ocupada');
    expect(
      codigoDe(await e.pedir(a, 'POST', '/convocatorias/unirse', { codigo, casa: 'monjes' })),
    ).toBe('ya-dentro');
    expect(
      (await e.pedir(b, 'POST', '/convocatorias/unirse', { codigo, casa: 'monjes' })).estado,
    ).toBe(200);
    expect(
      codigoDe(await e.pedir(c, 'POST', '/convocatorias/unirse', { codigo, casa: 'canteros' })),
    ).toBe('convocatoria-llena');
    expect(codigoDe(await e.pedir(c, 'GET', `/convocatorias/${id}`))).toBe(
      'convocatoria-desconocida',
    );
    expect(
      codigoDe(await e.pedir(b, 'POST', `/convocatorias/${id}/eleccion`, { comarca: 'x' })),
    ).toBe('convocatoria-cerrada');
    await e.pedir(a, 'POST', `/convocatorias/${id}/sortear`);
    expect(
      codigoDe(await e.pedir(c, 'POST', '/convocatorias/unirse', { codigo, casa: 'canteros' })),
    ).toBe('convocatoria-cerrada');
    const mias = (await e.pedir(b, 'GET', '/convocatorias/mias')).cuerpo as {
      convocatorias: VistaDeConvocatoria[];
    };
    expect(mias.convocatorias.map((x) => x.id)).toEqual([id]);
    await e.repo.cerrar();
  }, 120_000);
});
