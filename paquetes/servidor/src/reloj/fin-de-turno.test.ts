// Dar el turno por terminado (ficha T-124 §4): la marca se guarda por turno, se puede deshacer, cuenta
// solo a quien juega y, cuando la tienen todos, el turno se resuelve ya y el siguiente tiene su plazo
// entero desde ese momento.
import { describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO, resolverTurno } from '@conquer/nucleo';
import type { IdJugador } from '@conquer/nucleo';

import { CUENTAS, apiDePrueba } from '../api/prueba-comun.ts';
import { crearApi } from '../api/manejadores.ts';
import { CanalDeAvisos } from '../avisos/canal.ts';
import type { EventoDePartida } from '../avisos/canal.ts';
import { INTERVALO_SEGUNDOS } from '../persistencia/prueba-comun.ts';
import { finDeTurno } from './fin-de-turno.ts';
import { proveedorDeRecorte } from './mundoDeLaPartida.ts';
import { mundoPeninsula } from '../persistencia/prueba-comun.ts';
import { Reloj } from './reloj.ts';

const MESTA = CUENTAS['mesta'] ?? '';
const MONJES = CUENTAS['monjes'] ?? '';
const CANTEROS = CUENTAS['canteros'] ?? '';

async function entorno() {
  const e = await apiDePrueba({ turnosJugados: 1 });
  const canal = new CanalDeAvisos();
  const reloj = new Reloj({
    repo: e.repo,
    reglas: TABLAS_DEL_JUEGO,
    proveedorDeMundo: proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO),
    resolverTurno,
    registro: e.registro,
    ahora: () => e.ahora.valor,
    canal,
  });
  const api = crearApi({
    ...e.dep,
    canal,
    alTerminarElTurno: (id) => reloj.resolverSiTodosHanTerminado(id),
  });
  const id = e.estado.id;
  const terminar = (cuenta: string, terminado: unknown) =>
    api({
      metodo: 'PUT',
      ruta: `/partidas/${id}/fin-de-turno`,
      cabeceras: { 'x-cuenta': cuenta, 'content-type': 'application/json' },
      cuerpo: JSON.stringify({ terminado }),
    });
  const eventos: EventoDePartida[] = [];
  canal.suscribir(id, (ev) => eventos.push(ev));
  return { ...e, id, terminar, eventos, reloj };
}

describe('dar el turno por terminado', () => {
  it('cuando lo han hecho todos se resuelve ya, y el siguiente tiene su plazo entero', async () => {
    const e = await entorno();
    e.ahora.valor += 10 * 60_000;
    expect((await e.terminar(MESTA, true)).cuerpo).toMatchObject({ resultado: 'no-debida' });
    expect((await e.terminar(MONJES, true)).cuerpo).toMatchObject({ resultado: 'no-debida' });
    expect((await e.repo.partida(e.id))?.turnoActual).toBe(2);

    const ultima = await e.terminar(CANTEROS, true);
    expect(ultima.estado).toBe(200);
    expect(ultima.cuerpo).toMatchObject({ resultado: 'resuelto' });
    const fila = await e.repo.partida(e.id);
    expect(fila?.turnoActual).toBe(3);
    expect(fila?.proximaResolucion).toBe(e.ahora.valor + INTERVALO_SEGUNDOS * 1000);
    // El turno nuevo empieza sin nadie terminado.
    expect((await finDeTurno(e.repo, e.id))?.quienes.every((q) => !q.terminado)).toBe(true);
    // Los demas se enteran de cada marca y de la resolucion.
    expect(e.eventos.map((ev) => ev.tipo)).toEqual([
      'fin-de-turno',
      'fin-de-turno',
      'fin-de-turno',
      'turno-resuelto',
    ]);
    await e.repo.cerrar();
  }, 60_000);

  it('se puede deshacer mientras no se resuelva, y quien lo deshace frena el avance', async () => {
    const e = await entorno();
    await e.terminar(MESTA, true);
    await e.terminar(MONJES, true);
    await e.terminar(MESTA, false);
    expect((await e.terminar(CANTEROS, true)).cuerpo).toMatchObject({ resultado: 'no-debida' });
    expect((await e.repo.partida(e.id))?.turnoActual).toBe(2);
    const fin = await finDeTurno(e.repo, e.id);
    expect(fin?.quienes.map((q) => [q.jugador, q.terminado])).toEqual([
      ['canteros', true],
      ['mesta', false],
      ['monjes', true],
    ]);
    // Marcar dos veces no cuenta doble.
    await e.terminar(MONJES, true);
    expect(await e.repo.turnoTerminadoPor(e.id, 2)).toEqual(['canteros', 'monjes']);
    await e.repo.cerrar();
  }, 60_000);

  it('el estado dice quien ha terminado, con su nombre', async () => {
    const e = await entorno();
    await e.terminar(MONJES, true);
    const r = await e.pedir(MESTA, 'GET', `/partidas/${e.id}/estado`);
    const lista: unknown = (r.cuerpo as { finDeTurno?: unknown }).finDeTurno;
    expect(lista).toHaveLength(3);
    expect(lista).toMatchObject([
      { jugador: 'canteros', terminado: false },
      { jugador: 'mesta', terminado: false },
      { jugador: 'monjes', terminado: true },
    ]);
    expect(JSON.stringify(lista)).not.toContain('"nombre":""');
    await e.repo.cerrar();
  }, 60_000);

  it('una marca de un turno ya resuelto se rechaza con turno-cerrado y no se guarda', async () => {
    const e = await entorno();
    await expect(
      e.repo.marcarTurnoTerminado(e.id, 'mesta' as IdJugador, 1, true, e.ahora.valor),
    ).rejects.toMatchObject({ codigo: 'turno-cerrado' });
    expect(await e.repo.turnoTerminadoPor(e.id, 1)).toEqual([]);
    await e.repo.cerrar();
  }, 60_000);

  it('quien no juega aun (entrada pendiente) o no tiene cuenta no frena el avance', async () => {
    const e = await entorno();
    await e.repo.anyadirParticipante(e.id, {
      jugador: 'ferrones' as IdJugador,
      casa: 'ferrones',
      cuenta: 'cuenta-que-entra',
    });
    await e.repo.anyadirParticipante(e.id, {
      jugador: 'arrieros' as IdJugador,
      casa: 'arrieros',
      cuenta: null,
    });
    expect((await finDeTurno(e.repo, e.id))?.quienes).toHaveLength(3);
    await e.terminar(MESTA, true);
    await e.terminar(MONJES, true);
    expect((await e.terminar(CANTEROS, true)).cuerpo).toMatchObject({ resultado: 'resuelto' });
    await e.repo.cerrar();
  }, 60_000);

  it('pide un booleano, y en una partida terminada no hay turno que terminar', async () => {
    const e = await entorno();
    expect((await e.terminar(MESTA, 'si')).cuerpo).toMatchObject({
      error: { codigo: 'cuerpo-invalido' },
    });
    await e.repo.terminarPartida(e.id);
    expect((await e.terminar(MESTA, true)).cuerpo).toMatchObject({
      error: { codigo: 'partida-detenida' },
    });
    await e.repo.cerrar();
  }, 60_000);
});
