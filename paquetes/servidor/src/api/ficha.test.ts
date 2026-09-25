// Las rutas de la ficha de comarca y del avance manual (ficha T-082).
import { describe, expect, it } from 'vitest';

import type { FichaDeComarca, IdPartida } from '@conquer/nucleo';

import { crearApi } from './manejadores.ts';
import { apiDePrueba, CUENTAS } from './prueba-comun.ts';

const MESTA = CUENTAS['mesta'] ?? '';

describe('la ficha por la API', () => {
  it('la de la capital trae sus acciones, y el coste de cada una es el de la orden que se da', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const capital =
      (await e.repo.ultimoEstado('p1' as IdPartida))?.jugadores['mesta']?.capital ?? '';
    const r = await e.pedir(MESTA, 'GET', `/partidas/p1/comarcas/${capital}`);
    expect(r.estado).toBe(200);
    const ficha = (r.cuerpo as { ficha: FichaDeComarca }).ficha;
    expect(ficha.nivel).toBe('propia');
    const libres = ficha.acciones.filter((a) => a.bloqueo === null).slice(0, 4);
    expect(libres.length).toBeGreaterThan(0);
    for (const [i, a] of libres.entries()) {
      const dada = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', {
        ...a.intencion,
        idCliente: `f${String(i)}`,
      });
      expect(dada.estado, `${a.clave}: ${JSON.stringify(dada.cuerpo)}`).toBe(201);
      expect((dada.cuerpo as { orden: { coste: unknown } }).orden.coste, a.clave).toEqual(a.coste);
    }
    await e.repo.cerrar();
  }, 120_000);

  it('de una comarca que no conoce, 404; de una ajena en otra partida, tambien', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const estado = await e.repo.ultimoEstado('p1' as IdPartida);
    const conocidas = new Set(Object.keys(estado?.jugadores['mesta']?.conocimiento ?? {}));
    const desconocida = Object.keys(e.mundo.comarcas).find((id) => !conocidas.has(id)) ?? '';
    const r = await e.pedir(MESTA, 'GET', `/partidas/p1/comarcas/${desconocida}`);
    expect((r.cuerpo as { error: { codigo: string } }).error.codigo).toBe('comarca-desconocida');
    expect((await e.pedir('otra', 'GET', `/partidas/p1/comarcas/${desconocida}`)).estado).toBe(404);
    await e.repo.cerrar();
  }, 120_000);
});

describe('el avance manual por la API', () => {
  it('solo en partidas de prueba', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const avanzados: string[] = [];
    const conAvance = crearApi({
      ...e.dep,
      avanzar: (id) => {
        avanzados.push(id);
        return Promise.resolve({ tipo: 'resuelto' });
      },
    });
    const pedir = (cuenta: string) =>
      conAvance({
        metodo: 'POST',
        ruta: '/partidas/p1/avanzar',
        cabeceras: { 'x-cuenta': cuenta },
        cuerpo: null,
      });
    const r = await pedir(MESTA);
    expect(r.estado).toBe(200);
    expect(avanzados).toEqual(['p1']);
    // Un servidor sin avance configurado lo niega.
    const sinAvance = await e.pedir(MESTA, 'POST', '/partidas/p1/avanzar');
    expect((sinAvance.cuerpo as { error: { codigo: string } }).error.codigo).toBe(
      'solo-en-pruebas',
    );
    await e.repo.cerrar();
  }, 120_000);
});
