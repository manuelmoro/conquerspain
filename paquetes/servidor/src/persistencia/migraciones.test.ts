// Las migraciones (ficha T-060 §7): se aplican, son idempotentes, se revierten y no degradan.
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { MIGRACIONES, comprobarMigraciones } from './migraciones/index.ts';
import type { Migracion } from './migraciones/index.ts';
import { AHORA, datosDePartida, partidaDePrueba } from './prueba-comun.ts';
import { RepositorioSqlite } from './sqlite.ts';

const carpetas: string[] = [];
afterEach(() => {
  for (const c of carpetas.splice(0)) {
    rmSync(c, { recursive: true, force: true });
  }
});

function fichero(): string {
  const carpeta = mkdtempSync(join(tmpdir(), 'conquer-mig-'));
  carpetas.push(carpeta);
  return join(carpeta, 'base.sqlite');
}

function tablas(ruta: string): string[] {
  const bd = new DatabaseSync(ruta);
  const filas = bd
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
    .all();
  bd.close();
  return filas.map((f) => String(f['name']));
}

describe('las migraciones', () => {
  it('las versiones son consecutivas desde 1', () => {
    expect(() => {
      comprobarMigraciones();
    }).not.toThrow();
    expect(MIGRACIONES.map((m) => m.version)).toEqual(MIGRACIONES.map((_, i) => i + 1));
    const rota: Migracion = { version: 3, nombre: 'salto', subir: [], bajar: [] };
    expect(() => {
      comprobarMigraciones([rota]);
    }).toThrow(/consecutivas/);
  });

  it('sobre una base vacia dejan todas las tablas, y volver a aplicarlas no hace nada', async () => {
    const ruta = fichero();
    const repo = new RepositorioSqlite(ruta);
    expect(await repo.versionDelEsquema()).toBe(0);
    expect(await repo.migrar(AHORA)).toBe(MIGRACIONES.length);
    expect(await repo.migrar(AHORA + 1)).toBe(MIGRACIONES.length);
    await repo.cerrar();
    expect(tablas(ruta)).toEqual([
      'auditoria_resolucion',
      'aviso_correo',
      'convocatoria',
      'cronica',
      'cuenta',
      'enlace_de_acceso',
      'estado_turno',
      'migracion',
      'orden',
      'participante',
      'partida',
      'plaza_convocatoria',
      'preferencia_aviso',
      'sesion',
      'suceso_turno',
    ]);
  });

  it('se revierten de una en una hasta dejar la base vacia', async () => {
    const ruta = fichero();
    const repo = new RepositorioSqlite(ruta);
    await repo.migrar(AHORA);
    for (let version = MIGRACIONES.length; version > 0; version -= 1) {
      expect(repo.revertirUna()).toBe(version - 1);
    }
    await repo.cerrar();
    expect(tablas(ruta)).toEqual([]);
  });

  it('una base con datos sigue leyendose despues de volver a migrar', async () => {
    const ruta = fichero();
    const primero = new RepositorioSqlite(ruta);
    await primero.migrar(AHORA);
    const { estado, mundo } = partidaDePrueba();
    await primero.crearPartida(datosDePartida(estado, mundo), estado, AHORA);
    await primero.cerrar();

    const segundo = new RepositorioSqlite(ruta);
    expect(await segundo.migrar(AHORA + 1)).toBe(MIGRACIONES.length);
    expect((await segundo.partida(estado.id))?.turnoActual).toBe(estado.turno);
    await segundo.cerrar();
  });

  it('una base de una version futura no se abre: esquema-desactualizado', async () => {
    const ruta = fichero();
    const conMas: Migracion = {
      version: MIGRACIONES.length + 1,
      nombre: 'futura',
      subir: ['CREATE TABLE futura (x INTEGER)'],
      bajar: ['DROP TABLE futura'],
    };
    const nueva = new RepositorioSqlite(ruta, [...MIGRACIONES, conMas]);
    await nueva.migrar(AHORA);
    await nueva.cerrar();

    const vieja = new RepositorioSqlite(ruta);
    await expect(vieja.migrar(AHORA)).rejects.toMatchObject({ codigo: 'esquema-desactualizado' });
    await vieja.cerrar();
  });

  it('una migracion que falla se deshace entera: migracion-fallida y version intacta', async () => {
    const mala: Migracion = {
      version: 1,
      nombre: 'mala',
      subir: ['CREATE TABLE a (x INTEGER)', 'SENTENCIA ROTA'],
      bajar: [],
    };
    const repo = new RepositorioSqlite(':memory:', [mala]);
    await expect(repo.migrar(AHORA)).rejects.toMatchObject({ codigo: 'migracion-fallida' });
    expect(await repo.versionDelEsquema()).toBe(0);
    await repo.cerrar();
  });
});
