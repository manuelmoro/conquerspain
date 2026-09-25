// El repositorio SQLite (ficha T-060 §9): ida y vuelta, tamano, corrupcion, transaccion,
// idempotencia, encadenado, ordenes y partidas por resolver.
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

import { afterEach, describe, expect, it } from 'vitest';

import { canonico, huella } from '@conquer/nucleo';
import type { EstadoPartida, IdJugador, Mundo } from '@conquer/nucleo';

import { ErrorDePersistencia } from './errores.ts';
import {
  AHORA,
  TODAS_LAS_CASAS,
  datosDePartida,
  ordenDeEjemplo,
  partidaDePrueba,
  resolverParaGuardar,
} from './prueba-comun.ts';
import { RepositorioSqlite } from './sqlite.ts';

const carpetas: string[] = [];
afterEach(() => {
  for (const c of carpetas.splice(0)) {
    rmSync(c, { recursive: true, force: true });
  }
});

function fichero(): string {
  const carpeta = mkdtempSync(join(tmpdir(), 'conquer-repo-'));
  carpetas.push(carpeta);
  return join(carpeta, 'base.sqlite');
}

async function repositorioCon(
  estado: EstadoPartida,
  mundo: Mundo,
  ruta = ':memory:',
): Promise<RepositorioSqlite> {
  const repo = new RepositorioSqlite(ruta);
  await repo.migrar(AHORA);
  await repo.crearPartida(datosDePartida(estado, mundo), estado, AHORA);
  return repo;
}

async function codigoDelError(accion: () => unknown): Promise<string> {
  try {
    await accion();
  } catch (error) {
    if (error instanceof ErrorDePersistencia) return error.codigo;
    throw error;
  }
  return 'no-fallo';
}

/** Juega `turnos` turnos guardando cada resolucion; devuelve los estados de cada turno. */
async function jugarYGuardar(
  repo: RepositorioSqlite,
  inicial: EstadoPartida,
  mundo: Mundo,
  turnos: number,
): Promise<EstadoPartida[]> {
  const estados = [inicial];
  let actual = inicial;
  for (let i = 0; i < turnos; i += 1) {
    const resolucion = resolverParaGuardar(actual, mundo);
    await repo.guardarResolucion(resolucion, AHORA + i);
    actual = resolucion.estadoNuevo;
    estados.push(actual);
  }
  return estados;
}

describe('guardar y releer una partida', () => {
  it('cada turno vuelve con la misma huella y la misma forma canonica', async () => {
    const { estado, mundo } = partidaDePrueba();
    const repo = await repositorioCon(estado, mundo);
    const estados = await jugarYGuardar(repo, estado, mundo, 30);
    for (const original of estados) {
      const leido = await repo.estado(estado.id, original.turno, { mundo });
      expect(leido === null ? null : huella(leido)).toBe(huella(original));
      expect(leido === null ? '' : canonico(leido)).toBe(canonico(original));
    }
    const ultimo = await repo.ultimoEstado(estado.id);
    expect(ultimo?.turno).toBe(31);
    expect((await repo.partida(estado.id))?.turnoActual).toBe(31);
    await repo.cerrar();
  }, 60_000);

  it('guarda la cronica de cada jugador, los sucesos y la auditoria del turno', async () => {
    const { estado, mundo } = partidaDePrueba();
    const repo = await repositorioCon(estado, mundo);
    const resolucion = resolverParaGuardar(estado, mundo);
    await repo.guardarResolucion(resolucion, AHORA);
    for (const jugador of Object.keys(estado.jugadores)) {
      const cronica = await repo.cronica(estado.id, estado.turno, jugador as IdJugador);
      expect(cronica?.jugador).toBe(jugador);
      expect(cronica?.turno).toBe(estado.turno);
    }
    const auditoria = await repo.auditoria(estado.id, estado.turno);
    expect(auditoria).toMatchObject({
      turno: estado.turno,
      huellaEntrada: huella(estado),
      huellaSalida: huella(resolucion.estadoNuevo),
      ordenes: 0,
    });
    expect(await repo.cronica(estado.id, 99, 'mesta' as IdJugador)).toBeNull();
    await repo.cerrar();
  });

  it('una partida de 200 turnos con ocho casas ocupa menos de 6 MB en disco (§9.1)', async () => {
    const { estado, mundo } = partidaDePrueba(TODAS_LAS_CASAS);
    const ruta = fichero();
    const repo = await repositorioCon(estado, mundo, ruta);
    await jugarYGuardar(repo, estado, mundo, 200);
    await repo.cerrar();
    // WAL: el contenido puede estar aun en el fichero -wal; al cerrar se consolida en la base.
    const bytes = statSync(ruta).size;
    const megas = bytes / (1024 * 1024);
    console.info(`Partida de 200 turnos, ocho casas: ${megas.toFixed(2)} MB en disco.`);
    expect(megas).toBeLessThan(6);
  }, 180_000);
});

describe('la corrupcion se detecta al leer', () => {
  it('un byte cambiado en un estado guardado lanza huella-no-coincide con su turno', async () => {
    const { estado, mundo } = partidaDePrueba();
    const ruta = fichero();
    const repo = await repositorioCon(estado, mundo, ruta);
    await jugarYGuardar(repo, estado, mundo, 3);

    const otra = new DatabaseSync(ruta);
    const alterado = { ...estado, siguienteId: estado.siguienteId + 7, turno: 2 };
    otra
      .prepare('UPDATE estado_turno SET contenido = ? WHERE partida = ? AND turno = 2')
      .run(gzipSync(Buffer.from(canonico(alterado), 'utf8')), estado.id);
    otra.close();

    expect(await codigoDelError(() => repo.estado(estado.id, 2))).toBe('huella-no-coincide');
    expect(await codigoDelError(() => repo.estado(estado.id, 3))).toBe('no-fallo');
    await repo.cerrar();
  });
});

describe('guardar la resolucion de un turno', () => {
  it('con un fallo a mitad no deja rastro: ni estado, ni cronicas, ni avance', async () => {
    const { estado, mundo } = partidaDePrueba();
    const ruta = fichero();
    const repo = await repositorioCon(estado, mundo, ruta);
    // Fallo inyectado: la auditoria de ese turno ya existe, asi que la insercion revienta despues
    // de haber escrito el estado nuevo y las cronicas dentro de la transaccion.
    const otra = new DatabaseSync(ruta);
    otra
      .prepare(
        `INSERT INTO auditoria_resolucion (partida, turno, huella_entrada, huella_salida,
           huella_ordenes, ordenes, duracion_ms, version_reglas, version_nucleo, resuelta_en)
         VALUES (?, ?, 'a', 'b', 'c', 0, 0, 1, '0', 0)`,
      )
      .run(estado.id, estado.turno);
    otra.close();

    const resolucion = resolverParaGuardar(estado, mundo);
    await expect(repo.guardarResolucion(resolucion, AHORA)).rejects.toThrow();
    expect((await repo.partida(estado.id))?.turnoActual).toBe(estado.turno);
    expect(await repo.estado(estado.id, estado.turno + 1)).toBeNull();
    expect(await repo.cronica(estado.id, estado.turno, 'mesta' as IdJugador)).toBeNull();
    await repo.cerrar();
  });

  it('resolver el mismo turno dos veces es imposible: conflicto-de-turno y nada cambia', async () => {
    const { estado, mundo } = partidaDePrueba();
    const repo = await repositorioCon(estado, mundo);
    const resolucion = resolverParaGuardar(estado, mundo);
    await repo.guardarResolucion(resolucion, AHORA);
    const antes = await repo.ultimoEstado(estado.id);
    expect(await codigoDelError(() => repo.guardarResolucion(resolucion, AHORA + 5))).toBe(
      'conflicto-de-turno',
    );
    const despues = await repo.ultimoEstado(estado.id);
    expect(despues === null ? '' : huella(despues)).toBe(antes === null ? 'x' : huella(antes));
    expect((await repo.partida(estado.id))?.turnoActual).toBe(estado.turno + 1);
    await repo.cerrar();
  });

  it('un estado nuevo que no encadena con el guardado se rechaza sin escribir', async () => {
    const { estado, mundo } = partidaDePrueba();
    const repo = await repositorioCon(estado, mundo);
    const buena = resolverParaGuardar(estado, mundo);

    const firmaFalsa = {
      ...buena,
      estadoNuevo: { ...buena.estadoNuevo, huellaTurnoAnterior: 'no' },
    };
    expect(await codigoDelError(() => repo.guardarResolucion(firmaFalsa, AHORA))).toBe(
      'encadenado-roto',
    );

    const tocado = {
      ...buena,
      estadoNuevo: { ...buena.estadoNuevo, siguienteId: buena.estadoNuevo.siguienteId + 1 },
    };
    expect(await codigoDelError(() => repo.guardarResolucion(tocado, AHORA))).toBe(
      'encadenado-roto',
    );

    const otraEntrada = { ...buena, auditoria: { ...buena.auditoria, huellaEntrada: 'otra' } };
    expect(await codigoDelError(() => repo.guardarResolucion(otraEntrada, AHORA))).toBe(
      'encadenado-roto',
    );

    expect((await repo.partida(estado.id))?.turnoActual).toBe(estado.turno);
    expect(await repo.estado(estado.id, estado.turno + 1)).toBeNull();
    // La buena, despues de los rechazos, se guarda sin problemas.
    await repo.guardarResolucion(buena, AHORA);
    expect((await repo.partida(estado.id))?.turnoActual).toBe(estado.turno + 1);
    await repo.cerrar();
  });

  it('una partida desconocida o un turno saltado no se guardan', async () => {
    const { estado, mundo } = partidaDePrueba();
    const repo = await repositorioCon(estado, mundo);
    const buena = resolverParaGuardar(estado, mundo);
    expect(
      await codigoDelError(() =>
        repo.guardarResolucion({ ...buena, partida: 'no-existe' as typeof buena.partida }, AHORA),
      ),
    ).toBe('partida-desconocida');
    const saltada = { ...buena, estadoNuevo: { ...buena.estadoNuevo, turno: estado.turno + 5 } };
    expect(await codigoDelError(() => repo.guardarResolucion(saltada, AHORA))).toBe(
      'estado-invalido',
    );
    await repo.cerrar();
  });
});

describe('las ordenes entrantes', () => {
  async function conPartida(): Promise<{
    repo: RepositorioSqlite;
    estado: EstadoPartida;
    mundo: Mundo;
    comarca: string;
  }> {
    const { estado, mundo } = partidaDePrueba();
    const repo = await repositorioCon(estado, mundo);
    const comarca = Object.keys(estado.comarcas)[0] ?? '';
    return { repo, estado, mundo, comarca };
  }

  it('se guardan pendientes, se cancelan una vez y no se pueden borrar ni repetir', async () => {
    const { repo, estado, comarca } = await conPartida();
    const orden = ordenDeEjemplo('orden-1', 'mesta' as IdJugador, comarca as never);
    await repo.guardarOrden(estado.id, orden, AHORA);
    expect(await codigoDelError(() => repo.guardarOrden(estado.id, orden, AHORA))).toBe(
      'orden-duplicada',
    );
    expect(await codigoDelError(() => repo.guardarOrden('no-existe' as never, orden, AHORA))).toBe(
      'partida-desconocida',
    );

    const pendientes = await repo.ordenesPendientes(estado.id);
    expect(pendientes).toHaveLength(1);
    expect(pendientes[0]).toMatchObject({
      id: 'orden-1',
      estado: 'pendiente',
      turnoRecibida: estado.turno,
    });
    expect(pendientes[0]?.orden).toEqual(orden);

    expect(await repo.cancelarOrden(estado.id, orden.id, 'la retira el jugador')).toBe(true);
    expect(await repo.cancelarOrden(estado.id, orden.id, 'otra vez')).toBe(false);
    expect(await repo.ordenesPendientes(estado.id)).toHaveLength(0);
    await repo.cerrar();
  });

  it('con turno esperado, una orden de un turno ya cerrado no se guarda: turno-cerrado (T-062 §4.8)', async () => {
    const { repo, estado, mundo, comarca } = await conPartida();
    const orden = ordenDeEjemplo('tarde', 'mesta' as IdJugador, comarca as never, 1);
    await repo.guardarOrden(estado.id, orden, AHORA, 1);
    await repo.guardarResolucion(resolverParaGuardar(estado, mundo), AHORA);
    const otra = ordenDeEjemplo('otra', 'mesta' as IdJugador, comarca as never, 1);
    expect(await codigoDelError(() => repo.guardarOrden(estado.id, otra, AHORA, 1))).toBe(
      'turno-cerrado',
    );
    expect((await repo.ordenesPendientes(estado.id)).map((o) => o.id)).toEqual(['tarde']);
    await repo.cerrar();
  });

  it('al resolver, las aplicadas y las rechazadas dejan de estar pendientes y no se cancelan', async () => {
    const { repo, estado, mundo, comarca } = await conPartida();
    for (const id of ['a', 'b', 'c']) {
      await repo.guardarOrden(
        estado.id,
        ordenDeEjemplo(id, 'mesta' as IdJugador, comarca as never),
        AHORA,
      );
    }
    const resolucion = {
      ...resolverParaGuardar(estado, mundo),
      ordenesAplicadas: ['a' as never],
      ordenesRechazadas: [{ id: 'b' as never, motivo: 'sin recursos' }],
    };
    await repo.guardarResolucion(resolucion, AHORA);
    const pendientes = await repo.ordenesPendientes(estado.id);
    expect(pendientes.map((o) => o.id)).toEqual(['c']);
    expect(await repo.cancelarOrden(estado.id, 'a' as never, 'tarde')).toBe(false);
    expect(await repo.cancelarOrden(estado.id, 'b' as never, 'tarde')).toBe(false);
    expect(await repo.cancelarOrden(estado.id, 'c' as never, 'a tiempo')).toBe(true);
    await repo.cerrar();
  });
});

describe('las partidas por resolver', () => {
  it('salen las activas cuya hora ha llegado, las mas atrasadas primero, y las detenidas no', async () => {
    const repo = new RepositorioSqlite(':memory:');
    await repo.migrar(AHORA);
    const ids = ['p-tarde', 'p-pronto', 'p-futura', 'p-parada'];
    for (const [i, id] of ids.entries()) {
      const { estado, mundo } = partidaDePrueba(['mesta'], '1492', id);
      const datos = {
        ...datosDePartida(estado, mundo),
        proximaResolucion: [2000, 1000, 9000, 500][i] ?? null,
      };
      await repo.crearPartida(datos, estado, AHORA);
    }
    await repo.detenerPartida('p-parada' as never, 'el motor lanzo un error');
    const debidas = await repo.partidasPorResolver(5000, 10);
    expect(debidas.map((p) => p.id)).toEqual(['p-pronto', 'p-tarde']);
    expect((await repo.partidasPorResolver(5000, 1)).map((p) => p.id)).toEqual(['p-pronto']);
    const parada = await repo.partida('p-parada' as never);
    expect(parada).toMatchObject({
      estado: 'detenida',
      proximaResolucion: null,
      motivoDetencion: 'el motor lanzo un error',
    });
    expect(await codigoDelError(() => repo.detenerPartida('no-existe' as never, 'x'))).toBe(
      'partida-desconocida',
    );
    await repo.cerrar();
  }, 60_000);

  it('no se crea dos veces la misma partida y se leen sus participantes', async () => {
    const { estado, mundo } = partidaDePrueba();
    const repo = await repositorioCon(estado, mundo);
    expect(
      await codigoDelError(() => repo.crearPartida(datosDePartida(estado, mundo), estado, AHORA)),
    ).toBe('partida-duplicada');
    const participantes = await repo.participantes(estado.id);
    expect(participantes.map((p) => p.casa).sort()).toEqual(['mesta', 'monjes']);
    await repo.cerrar();
  });
});
