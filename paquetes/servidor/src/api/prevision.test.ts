// La prevision de ruta y las misiones de recua por la API (ficha T-083 §4.2 y §4.3).
import { describe, expect, it } from 'vitest';

import type { FichaDeComarca, IdPartida, PrevisionDeRuta, VistaJugador } from '@conquer/nucleo';

import { apiDePrueba, CUENTAS } from './prueba-comun.ts';

const MESTA = CUENTAS['mesta'] ?? '';

async function vistaDe(e: Awaited<ReturnType<typeof apiDePrueba>>): Promise<VistaJugador> {
  const r = await e.pedir(MESTA, 'GET', '/partidas/p1/estado');
  return (r.cuerpo as { vista: VistaJugador }).vista;
}

/** Una vecina de la capital que no es propia: a ella siempre se sabe ir. */
function vecinaDeLaCapital(
  e: Awaited<ReturnType<typeof apiDePrueba>>,
  vista: VistaJugador,
): string {
  const vecina = (e.mundo.vecinos[vista.jugador.capital] ?? []).find((id) => {
    const v = vista.comarcas[id];
    return v !== undefined && v.nivel !== 'propia';
  });
  if (vecina === undefined) throw new Error('la capital no tiene vecinas conocidas');
  return vecina;
}

describe('la previsión de ruta por la API', () => {
  it('prevé el viaje de un rebaño propio y rechaza lo ajeno o lo desconocido', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const antes = await vistaDe(e);
    const formar = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', {
      tipo: 'formar-rebanyo',
      comarca: antes.jugador.capital,
      idCliente: 'rebanyo',
    });
    expect(formar.estado, JSON.stringify(formar.cuerpo)).toBe(201);
    await e.resolver();
    const vista = await vistaDe(e);
    const rebanyo = vista.rebanyos[0];
    if (rebanyo === undefined) throw new Error('no se formó el rebaño');
    const destino = vecinaDeLaCapital(e, vista);
    const r = await e.pedir(MESTA, 'POST', '/partidas/p1/prevision-de-ruta', {
      rebanyo: rebanyo.id,
      paradas: [destino],
    });
    expect(r.estado, JSON.stringify(r.cuerpo)).toBe(200);
    const p = (r.cuerpo as { prevision: PrevisionDeRuta }).prevision;
    expect(p.ok || p.motivo !== null).toBe(true);
    if (p.ok) expect(p.llegadas[0]).toBeGreaterThanOrEqual(1);

    const ajeno = await e.pedir(MESTA, 'POST', '/partidas/p1/prevision-de-ruta', {
      recua: 'recua-de-nadie',
      paradas: [destino],
    });
    expect((ajeno.cuerpo as { error: { codigo: string } }).error.codigo).toBe('unidad-desconocida');
    const conocidas = new Set(Object.keys(vista.comarcas));
    const desconocida = Object.keys(e.mundo.comarcas).find((id) => !conocidas.has(id));
    const lejos = await e.pedir(MESTA, 'POST', '/partidas/p1/prevision-de-ruta', {
      rebanyo: rebanyo.id,
      paradas: [desconocida],
    });
    expect((lejos.cuerpo as { error: { codigo: string } }).error.codigo).toBe(
      'comarca-desconocida',
    );
    const mal = await e.pedir(MESTA, 'POST', '/partidas/p1/prevision-de-ruta', {
      rebanyo: rebanyo.id,
      paradas: 'aqui',
    });
    expect(mal.estado).toBe(400);
    await e.repo.cerrar();
  }, 120_000);

  it('una misión de la ficha se da entera: todas sus intenciones entran', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const vista = await vistaDe(e);
    // Una recua para la mision, formada en la capital y resuelto el turno.
    const formar = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', {
      tipo: 'formar-recua',
      comarca: vista.jugador.capital,
      vecinos: 0,
      idCliente: 'formar',
    });
    expect(formar.estado, JSON.stringify(formar.cuerpo)).toBe(201);
    await e.resolver();
    const conRecua = await vistaDe(e);
    const neutral = vecinaDeLaCapital(e, conRecua);
    const r = await e.pedir(MESTA, 'GET', `/partidas/p1/comarcas/${neutral}`);
    const ficha = (r.cuerpo as { ficha: FichaDeComarca }).ficha;
    const mision = ficha.acciones.find((a) => a.clave.startsWith('mision-') && a.bloqueo === null);
    if (mision === undefined) throw new Error(JSON.stringify(ficha.acciones.map((a) => a.bloqueo)));
    for (const [i, intencion] of mision.intenciones.entries()) {
      const dada = await e.pedir(MESTA, 'POST', '/partidas/p1/ordenes', {
        ...intencion,
        idCliente: `m${String(i)}`,
      });
      expect(dada.estado, JSON.stringify(dada.cuerpo)).toBe(201);
    }
    expect((await e.repo.ultimoEstado('p1' as IdPartida))?.turno).toBe(conRecua.turno);
    await e.repo.cerrar();
  }, 120_000);
});
