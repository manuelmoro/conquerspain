// El reloj (ficha T-061 §6): a su hora, sin deriva, en cadena tras una caida, sin doble resolucion,
// con el motor que falla y con la auditoria reproducible.
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

import { afterEach, describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO, canonico, huella, resolverTurno } from '@conquer/nucleo';
import type { EstadoPartida, IdJugador, IdPartida } from '@conquer/nucleo';

import {
  AHORA as ANCLA,
  datosDePartida,
  mundoPeninsula,
  ordenDeEjemplo,
  partidaDePrueba,
} from '../persistencia/prueba-comun.ts';
import { RepositorioSqlite } from '../persistencia/sqlite.ts';
import type { Repositorio } from '../persistencia/repositorio.ts';
import { reproducirTurno } from './auditoria.ts';
import { proveedorDeRecorte } from './mundoDeLaPartida.ts';
import { proximaResolucion } from './calendario.ts';
import { Reloj } from './reloj.ts';
import { RegistroEnMemoria } from './registro.ts';
import type { DependenciasDeResolucion } from './resolucion.ts';

const HORA = 3600;
const MS = 1000;
const carpetas: string[] = [];
afterEach(() => {
  for (const c of carpetas.splice(0)) {
    rmSync(c, { recursive: true, force: true });
  }
});

interface Entorno {
  readonly repo: RepositorioSqlite;
  readonly registro: RegistroEnMemoria;
  readonly reloj: Reloj;
  readonly dep: DependenciasDeResolucion;
  reloj_a(instante: number): void;
}

function entorno(
  opciones: {
    ruta?: string;
    resolver?: typeof resolverTurno;
    maximo?: number;
    repo?: RepositorioSqlite;
  } = {},
): Entorno & { ahora: { valor: number } } {
  const repo = opciones.repo ?? new RepositorioSqlite(opciones.ruta ?? ':memory:');
  const ahora = { valor: ANCLA };
  const registro = new RegistroEnMemoria();
  const dep: DependenciasDeResolucion = {
    repo,
    reglas: TABLAS_DEL_JUEGO,
    proveedorDeMundo: proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO),
    resolverTurno: opciones.resolver ?? resolverTurno,
    registro,
    ahora: () => ahora.valor,
  };
  const reloj = new Reloj(
    dep,
    opciones.maximo === undefined ? {} : { maximoDeTurnosPorPasada: opciones.maximo },
  );
  return {
    repo,
    registro,
    reloj,
    dep,
    ahora,
    reloj_a: (instante) => {
      ahora.valor = instante;
    },
  };
}

async function crearPartida(
  repo: Repositorio,
  id: string,
  extra: { esDePrueba?: boolean; casas?: readonly ('mesta' | 'monjes')[] } = {},
): Promise<EstadoPartida> {
  const { estado, mundo } = partidaDePrueba(extra.casas ?? ['mesta'], '1492', id);
  const datos = {
    ...datosDePartida(estado, mundo),
    intervaloSegundos: HORA,
    proximaResolucion: proximaResolucion(ANCLA, HORA, 1),
    esDePrueba: extra.esDePrueba ?? true,
  };
  await repo.migrar(ANCLA);
  await repo.crearPartida(datos, estado, ANCLA);
  return estado;
}

/** Lo que el proxy no cambia se comporta como el objeto: los metodos, atados a el. */
function enlazar(objetivo: object, propiedad: string | symbol): unknown {
  const valor: unknown = Reflect.get(objetivo, propiedad);
  if (typeof valor !== 'function') return valor;
  const atada: unknown = valor.bind(objetivo);
  return atada;
}

describe('a su hora', () => {
  it('antes de la hora no hace nada; en punto resuelve el turno y programa el siguiente desde el ancla', async () => {
    const e = entorno();
    const estado = await crearPartida(e.repo, 'p1');
    const hora1 = proximaResolucion(ANCLA, HORA, 1);

    e.reloj_a(hora1 - 1);
    expect((await e.reloj.pasada()).resueltos).toBe(0);

    e.reloj_a(hora1);
    expect((await e.reloj.pasada()).resueltos).toBe(1);
    const fila = await e.repo.partida(estado.id);
    expect(fila?.turnoActual).toBe(2);
    expect(fila?.proximaResolucion).toBe(proximaResolucion(ANCLA, HORA, 2));
    await e.repo.cerrar();
  }, 60_000);

  it('sin deriva: resolver tarde no desplaza el calendario', async () => {
    const e = entorno();
    const estado = await crearPartida(e.repo, 'p1');
    // Se despierta con 40 minutos de retraso: el turno siguiente sigue siendo el del ancla.
    e.reloj_a(proximaResolucion(ANCLA, HORA, 1) + 40 * 60 * MS);
    await e.reloj.pasada();
    expect((await e.repo.partida(estado.id))?.proximaResolucion).toBe(
      proximaResolucion(ANCLA, HORA, 2),
    );
    await e.repo.cerrar();
  }, 60_000);

  it('con el reloj real y un intervalo de un segundo resuelve con menos de 2 s de desviacion', async () => {
    const e = entorno();
    const ancla = Date.now();
    const { estado, mundo } = partidaDePrueba(['mesta'], '1492', 'p-real');
    await e.repo.migrar(ancla);
    await e.repo.crearPartida(
      {
        ...datosDePartida(estado, mundo),
        ancla,
        intervaloSegundos: 1,
        proximaResolucion: proximaResolucion(ancla, 1, 1),
      },
      estado,
      ancla,
    );
    const real = new Reloj({ ...e.dep, ahora: () => Date.now() }, { sondeoMs: 200 });
    real.iniciar();
    await new Promise((seguir) => setTimeout(seguir, 3200));
    await real.parar();
    const resueltos = ((await e.repo.partida(estado.id))?.turnoActual ?? 1) - 1;
    expect(resueltos).toBeGreaterThanOrEqual(2);
    for (let turno = 1; turno <= resueltos; turno += 1) {
      const auditoria = await e.repo.auditoria(estado.id, turno);
      const desviacion = (auditoria?.resueltaEn ?? 0) - proximaResolucion(ancla, 1, turno);
      expect(desviacion).toBeGreaterThanOrEqual(0);
      expect(desviacion).toBeLessThan(2000);
    }
    await e.repo.cerrar();
  }, 30_000);
});

describe('tras una caida', () => {
  it('resuelve en cadena, con las ordenes pendientes solo en el primer turno', async () => {
    const e = entorno();
    const estado = await crearPartida(e.repo, 'p1');
    const comarca = Object.keys(estado.comarcas)[0] ?? '';
    await e.repo.guardarOrden(
      estado.id,
      ordenDeEjemplo('o1', 'mesta' as IdJugador, comarca as never),
      ANCLA,
    );

    e.reloj_a(proximaResolucion(ANCLA, HORA, 3) + 5);
    const informe = await e.reloj.pasada();
    expect(informe.resueltos).toBe(3);
    expect(informe.porPartida[estado.id]).toBe(3);
    expect((await e.repo.partida(estado.id))?.turnoActual).toBe(4);
    expect(await e.repo.ordenesDelTurno(estado.id, 1)).toHaveLength(1);
    expect(await e.repo.ordenesDelTurno(estado.id, 2)).toHaveLength(0);
    expect(await e.repo.ordenesDelTurno(estado.id, 3)).toHaveLength(0);
    // En orden: cada auditoria encadena con la anterior.
    const a1 = await e.repo.auditoria(estado.id, 1);
    const a2 = await e.repo.auditoria(estado.id, 2);
    expect(a2?.huellaEntrada).toBe(a1?.huellaSalida);
    await e.repo.cerrar();
  }, 60_000);

  it('con un tope por pasada, la siguiente sigue donde quedo', async () => {
    const e = entorno({ maximo: 2 });
    const estado = await crearPartida(e.repo, 'p1');
    e.reloj_a(proximaResolucion(ANCLA, HORA, 3) + 5);
    expect((await e.reloj.pasada()).resueltos).toBe(2);
    expect((await e.reloj.pasada()).resueltos).toBe(1);
    expect((await e.reloj.pasada()).resueltos).toBe(0);
    expect((await e.repo.partida(estado.id))?.turnoActual).toBe(4);
    await e.repo.cerrar();
  }, 60_000);
});

describe('un turno se resuelve una sola vez', () => {
  it('un proceso que muere antes de guardar no deja nada, y el siguiente lo resuelve una vez', async () => {
    const ruta = join(mkdtempSync(join(tmpdir(), 'conquer-reloj-')), 'b.sqlite');
    carpetas.push(ruta.replace(/[/\\]b\.sqlite$/, ''));
    const repo = new RepositorioSqlite(ruta);
    const estado = await crearPartida(repo, 'p1');

    // El primer proceso llega a calcular y se cuelga (muere) justo antes de guardar.
    const colgado = new Proxy(repo, {
      get(objetivo, propiedad) {
        if (propiedad === 'guardarResolucion') return () => new Promise<void>(() => undefined);
        return enlazar(objetivo, propiedad);
      },
    });
    const primero = entorno({ repo: colgado });
    primero.reloj_a(proximaResolucion(ANCLA, HORA, 1));
    void primero.reloj.pasada();
    await new Promise((seguir) => setTimeout(seguir, 300));
    expect((await repo.partida(estado.id))?.turnoActual).toBe(1);
    expect(await repo.estado(estado.id, 2)).toBeNull();

    // El proceso nuevo, sobre la misma base, lo resuelve una sola vez.
    const segundo = entorno({ repo });
    segundo.reloj_a(proximaResolucion(ANCLA, HORA, 1));
    expect((await segundo.reloj.pasada()).resueltos).toBe(1);
    expect((await segundo.reloj.pasada()).resueltos).toBe(0);
    expect((await repo.partida(estado.id))?.turnoActual).toBe(2);
    await repo.cerrar();
  }, 60_000);

  it('dos relojes sobre la misma base: el que llega segundo registra el conflicto y no escribe', async () => {
    const repo = new RepositorioSqlite(':memory:');
    const estado = await crearPartida(repo, 'p1');
    const segundo = entorno({ repo });
    // El primero se detiene a mitad, justo antes de guardar, y el segundo resuelve entero.
    const cuandoGuarda = new Proxy(repo, {
      get(objetivo, propiedad) {
        if (propiedad === 'guardarResolucion') {
          return async (...argumentos: Parameters<Repositorio['guardarResolucion']>) => {
            await segundo.reloj.pasada();
            return objetivo.guardarResolucion(...argumentos);
          };
        }
        return enlazar(objetivo, propiedad);
      },
    });
    const primero = entorno({ repo: cuandoGuarda });
    const hora = proximaResolucion(ANCLA, HORA, 1);
    primero.reloj_a(hora);
    segundo.reloj_a(hora);

    const informe = await primero.reloj.pasada();
    expect(informe).toMatchObject({ resueltos: 0, conflictos: 1 });
    expect(primero.registro.eventos('aviso')).toContain('conflicto-de-turno');
    expect(segundo.registro.eventos('info')).toContain('turno-resuelto');
    expect((await repo.partida(estado.id))?.turnoActual).toBe(2);
    expect(await repo.auditoria(estado.id, 1)).not.toBeNull();
    expect(await repo.estado(estado.id, 3)).toBeNull();
    await repo.cerrar();
  }, 60_000);
});

describe('el motor que falla', () => {
  it('detiene esa partida con su motivo, sin perder su estado, y sigue con las demas', async () => {
    const e = entorno({
      resolver: (estado, ordenes, mundo, reglas) => {
        if (estado.id === ('mala' as IdPartida)) throw new Error('el motor se ha roto en Fase 7');
        return resolverTurno(estado, ordenes, mundo, reglas);
      },
    });
    const mala = await crearPartida(e.repo, 'mala');
    const buena = await crearPartida(e.repo, 'buena');
    e.reloj_a(proximaResolucion(ANCLA, HORA, 1));
    const informe = await e.reloj.pasada();
    expect(informe.detenidas).toEqual(['mala']);
    expect(informe.resueltos).toBe(1);

    const filaMala = await e.repo.partida(mala.id);
    expect(filaMala).toMatchObject({ estado: 'detenida', proximaResolucion: null });
    expect(filaMala?.motivoDetencion).toContain('Fase 7');
    expect(await e.repo.estado(mala.id, 1)).not.toBeNull();
    expect((await e.repo.partida(buena.id))?.turnoActual).toBe(2);
    expect(e.registro.eventos('error')).toContain('partida-detenida');

    // Una detenida no vuelve a resolverse.
    e.reloj_a(proximaResolucion(ANCLA, HORA, 5));
    expect((await e.reloj.pasada()).detenidas).toEqual([]);
    await e.repo.cerrar();
  }, 60_000);

  it('una version de reglas ajena tambien detiene la partida', async () => {
    const e = entorno();
    const estado = await crearPartida(e.repo, 'p1');
    // Un repositorio que finge otra version de reglas en la fila de la partida.
    const conVersion = new Proxy(e.repo, {
      get(objetivo, propiedad) {
        if (propiedad === 'partida') {
          return async (id: IdPartida) => {
            const fila = await objetivo.partida(id);
            return fila === null ? null : { ...fila, versionReglas: 99 };
          };
        }
        return enlazar(objetivo, propiedad);
      },
    });
    const otroReloj = new Reloj({ ...e.dep, repo: conVersion });
    e.reloj_a(proximaResolucion(ANCLA, HORA, 1));
    expect((await otroReloj.pasada()).detenidas).toEqual([estado.id]);
    await e.repo.cerrar();
  }, 60_000);
});

describe('las ordenes al entrar', () => {
  it('una orden que cita una comarca que no existe se rechaza con su motivo y no entra', async () => {
    const e = entorno();
    const estado = await crearPartida(e.repo, 'p1');
    const buena = Object.keys(estado.comarcas)[0] ?? '';
    await e.repo.guardarOrden(
      estado.id,
      ordenDeEjemplo('buena', 'mesta' as IdJugador, buena as never),
      ANCLA,
    );
    await e.repo.guardarOrden(
      estado.id,
      ordenDeEjemplo('mala', 'mesta' as IdJugador, 'comarca-fantasma' as never),
      ANCLA,
    );
    e.reloj_a(proximaResolucion(ANCLA, HORA, 1));
    await e.reloj.pasada();
    expect((await e.repo.ordenesDelTurno(estado.id, 1)).map((o) => o.id)).toEqual(['buena']);
    expect(await e.repo.ordenesPendientes(estado.id)).toHaveLength(0);
    expect(
      e.registro.entradas.find((x) => x.evento === 'turno-resuelto')?.datos['rechazadas'],
    ).toBe(1);
    await e.repo.cerrar();
  }, 60_000);
});

describe('el avance manual', () => {
  it('solo en partidas de prueba, y sin mover el calendario', async () => {
    const e = entorno();
    const prueba = await crearPartida(e.repo, 'de-prueba', { esDePrueba: true });
    const real = await crearPartida(e.repo, 'de-verdad', { esDePrueba: false });
    const resultado = await e.reloj.avanzarManual(prueba.id);
    expect(resultado).toMatchObject({ tipo: 'resuelto', turno: 1 });
    expect((await e.repo.partida(prueba.id))?.proximaResolucion).toBe(
      proximaResolucion(ANCLA, HORA, 2),
    );
    await expect(e.reloj.avanzarManual(real.id)).rejects.toThrow(/no es de prueba/);
    await expect(e.reloj.avanzarManual('no-existe' as IdPartida)).rejects.toThrow(
      /No hay ninguna partida/,
    );
    await e.repo.cerrar();
  }, 60_000);
});

describe('la auditoria reproduce cualquier turno', () => {
  it('cada turno de una partida de 20 turnos vuelve a dar su huella; alterar algo lo delata', async () => {
    const ruta = join(mkdtempSync(join(tmpdir(), 'conquer-aud-')), 'b.sqlite');
    carpetas.push(ruta.replace(/[/\\]b\.sqlite$/, ''));
    const e = entorno({ ruta });
    const estado = await crearPartida(e.repo, 'p1');
    const comarca = Object.keys(estado.comarcas)[0] ?? '';
    for (let turno = 1; turno <= 20; turno += 1) {
      if (turno % 5 === 1) {
        await e.repo.guardarOrden(
          estado.id,
          ordenDeEjemplo(`orden-${String(turno)}`, 'mesta' as IdJugador, comarca as never, turno),
          ANCLA,
        );
      }
      const r = await e.reloj.avanzarManual(estado.id);
      expect(JSON.stringify(r), 'turno ' + String(turno)).toContain('resuelto');
    }
    const dep = {
      repo: e.repo,
      reglas: TABLAS_DEL_JUEGO,
      proveedorDeMundo: e.dep.proveedorDeMundo,
      resolverTurno,
    };
    for (let turno = 1; turno <= 20; turno += 1) {
      expect(
        (await reproducirTurno(dep, estado.id, turno)).coincide,
        `turno ${String(turno)}`,
      ).toBe(true);
    }
    expect((await e.repo.ordenesDelTurno(estado.id, 6)).map((o) => o.id)).toEqual(['orden-6']);

    // Un motor distinto no da la misma huella.
    const otroMotor: typeof resolverTurno = (est, ord, mun, reg) => {
      const r = resolverTurno(est, ord, mun, reg);
      return { ...r, estado: { ...r.estado, siguienteId: r.estado.siguienteId + 1 } };
    };
    const distinto = await reproducirTurno({ ...dep, resolverTurno: otroMotor }, estado.id, 7);
    expect(distinto.coincide).toBe(false);
    expect(distinto.esperada).not.toBe(distinto.obtenida);

    // Un estado alterado a mano (con su huella al dia, para que se deje leer) tampoco.
    const leido = await e.repo.estado(estado.id, 9);
    if (leido === null) throw new Error('falta el estado 9');
    const alterado = { ...leido, siguienteId: leido.siguienteId + 5 };
    const bd = new DatabaseSync(ruta);
    bd.prepare(
      'UPDATE estado_turno SET contenido = ?, huella = ? WHERE partida = ? AND turno = 9',
    ).run(gzipSync(Buffer.from(canonico(alterado), 'utf8')), huella(alterado), estado.id);
    bd.close();
    expect((await reproducirTurno(dep, estado.id, 9)).coincide).toBe(false);
    await expect(reproducirTurno(dep, estado.id, 99)).rejects.toThrow(/No hay auditoria/);
    await e.repo.cerrar();
  }, 120_000);
});
