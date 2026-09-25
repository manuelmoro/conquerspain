// La bandeja (ficha T-082 §6): reservado, disponible y producido separados; colas; corte; y retirar
// una orden enviada contra el servidor de pruebas.
import { describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO, recursosSegun } from '@conquer/nucleo';
import type {
  IdComarca,
  IdJugador,
  IdOrden,
  IdPartida,
  Orden,
  VistaJugador,
} from '@conquer/nucleo';

import { apiDePrueba, CUENTAS } from '../../servidor/src/api/prueba-comun.ts';
import { servirHttp } from '../../servidor/src/api/http.ts';
import { AHORA } from '../../servidor/src/persistencia/prueba-comun.ts';
import { Almacen } from './almacen.ts';
import { ClienteApi } from './api.ts';
import { colasDe, moverEnLaCola, resumenDeRecursos, tiempoHastaElCorte } from './bandeja.ts';
import { GuardadoEnMemoria } from './guardado.ts';

function orden(id: string, cola: string | null, estado: Orden['estado']): Orden {
  return {
    id: id as IdOrden,
    jugador: 'mesta' as IdJugador,
    turnoAlta: 1,
    estado,
    coste: recursosSegun(() => 0),
    turnosTotales: 1,
    turnosHechos: 0,
    motivoEspera: null,
    delMayordomo: false,
    turnoProgramado: null,
    cola,
    tipo: 'roturar',
    comarca: 'c' as IdComarca,
  };
}

describe('lo que hay, bien separado (criterio 3)', () => {
  it('disponible es almacen menos reservado; producido suma lo de las propias en el ultimo turno', async () => {
    const e = await apiDePrueba({ turnosJugados: 2 });
    const r = await e.pedir(CUENTAS['mesta'] ?? '', 'GET', '/partidas/p1/estado');
    const vista = (r.cuerpo as { vista: VistaJugador }).vista;
    const resumen = resumenDeRecursos(vista);
    expect(resumen.disponible.pan).toBe(vista.jugador.almacen.pan - vista.jugador.reservado.pan);
    expect(resumen.reservado).toEqual(vista.jugador.reservado);
    const propias = Object.values(vista.comarcas).flatMap((c) =>
      c.nivel === 'propia' ? [c.comarca] : [],
    );
    expect(resumen.producido.pan).toBe(
      propias.reduce((t, c) => t + c.produccionUltimoTurno.pan, 0),
    );
    expect(resumen.producido.pan).toBeGreaterThan(0);
    await e.repo.cerrar();
  }, 120_000);
});

describe('las colas', () => {
  const vista: Pick<VistaJugador, 'ordenes'> = {
    ordenes: [
      orden('a', 'comarca:x', 'en cola'),
      orden('b', 'comarca:x', 'en cola'),
      orden('c', 'comarca:x', 'en cola'),
      orden('d', null, 'en curso'),
    ],
  };

  it('agrupa las que esperan en cada cola, en su orden', () => {
    expect([...colasDe(vista).entries()].map(([k, v]) => [k, v.map((o) => o.id)])).toEqual([
      ['comarca:x', ['a', 'b', 'c']],
    ]);
  });

  it('subir y bajar dan la intencion cola con la lista entera; en el borde, nada', () => {
    expect(moverEnLaCola(vista, 'comarca:x', 'b', 'arriba')).toEqual({
      tipo: 'cola',
      clave: 'comarca:x',
      orden: ['b', 'a', 'c'],
    });
    expect(moverEnLaCola(vista, 'comarca:x', 'b', 'abajo')).toEqual({
      tipo: 'cola',
      clave: 'comarca:x',
      orden: ['a', 'c', 'b'],
    });
    expect(moverEnLaCola(vista, 'comarca:x', 'a', 'arriba')).toBeNull();
    expect(moverEnLaCola(vista, 'comarca:x', 'c', 'abajo')).toBeNull();
    expect(moverEnLaCola(vista, 'comarca:x', 'd', 'abajo')).toBeNull();
  });
});

describe('el corte', () => {
  it('dice cuanto falta, y que se esta resolviendo si ya paso la hora', () => {
    expect(tiempoHastaElCorte(null, 0)).toBe('partida detenida');
    expect(tiempoHastaElCorte(1000, 2000)).toBe('resolviendo');
    expect(tiempoHastaElCorte(25 * 60_000, 0)).toBe('faltan 25 min');
    expect(tiempoHastaElCorte(3 * 3_600_000 + 20 * 60_000, 0)).toBe('faltan 3 h 20 min');
    expect(tiempoHastaElCorte(2 * 86_400_000 + 3_600_000, 0)).toBe('faltan 2 d 1 h');
  });
});

describe('enviar, ver y retirar contra el servidor', () => {
  it('una orden enviada aparece en la bandeja del servidor y se puede retirar; la ficha llega', async () => {
    const e = await apiDePrueba({ turnosJugados: 1 });
    const servidor = await servirHttp(e.api);
    try {
      const api = new ClienteApi({
        base: `http://127.0.0.1:${String(servidor.puerto)}`,
        fetch: (url, init) =>
          fetch(url, {
            ...init,
            headers: {
              ...Object.fromEntries(new Headers(init?.headers).entries()),
              'x-cuenta': CUENTAS['mesta'] ?? '',
            },
          }),
      });
      const almacen = new Almacen({
        api,
        guardado: new GuardadoEnMemoria(),
        reglas: TABLAS_DEL_JUEGO,
        ahora: () => AHORA,
        nuevaClave: () => 'k1',
      });
      await almacen.abrirPartida('p1');
      const capital = almacen.estado.partida?.recibido.vista.jugador.capital ?? '';
      const ficha = await almacen.pedirFicha(capital);
      const roturar = ficha?.acciones.find((a) => a.clave === 'roturar' || a.bloqueo === null);
      if (roturar === undefined) throw new Error('sin acciones libres');
      await almacen.anyadir(roturar.intencion);
      expect(almacen.estado.pendientes).toEqual([]);
      const turno = almacen.estado.partida?.recibido.turno ?? 0;
      expect(almacen.estado.enviadas.map((o) => o.id)).toEqual([`o-${String(turno)}-mesta-k1`]);
      await almacen.retirar(`o-${String(turno)}-mesta-k1`);
      expect(almacen.estado.enviadas).toEqual([]);
      expect(await e.repo.ordenesPendientes('p1' as IdPartida)).toHaveLength(0);
      expect(await almacen.pedirFicha('no-existe')).toBeNull();
      expect(almacen.estado.errores.at(-1)?.codigo).toBe('comarca-desconocida');
    } finally {
      await servidor.cerrar();
      await e.repo.cerrar();
    }
  }, 120_000);
});
