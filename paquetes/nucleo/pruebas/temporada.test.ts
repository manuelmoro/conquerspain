// El cierre de temporada (ficha T-104 §2.2): se cierra solo en su ultimo turno, con la clasificacion
// y los reconocimientos; los empates por capitulo tienen regla; despues no se resuelve nada; y las
// partidas abiertas no se cierran nunca.
import { describe, expect, it } from 'vitest';

import { cierreDeTemporada } from '../src/reglas/temporada.ts';
import { vistaDeJugador } from '../src/reglas/vista.ts';
import type { EstadoPartida } from '../src/tipos/estado.ts';
import { DOS, UNO, conComarca, escenario, mundo, reglas, turno } from './recuas.ts';

function deTemporada(turnos: number | null, estado = escenario({ conDos: true })): EstadoPartida {
  return { ...estado, configuracion: { ...estado.configuracion, turnosDeTemporada: turnos } };
}

describe('el cierre de temporada (criterio 1)', () => {
  it('se cierra sola en su último turno, con la clasificación y lo anuncia a todos', () => {
    const estado = deTemporada(escenario({ conDos: true }).turno);
    const { estado: despues, sucesos } = turno(estado);
    expect(despues.cierre?.turno).toBe(estado.turno);
    expect(despues.cierre?.clasificacion.map((p) => p.jugador).sort()).toEqual([DOS, UNO].sort());
    const anuncio = sucesos.find((s) => s.tipo === 'temporada.cerrada');
    expect(anuncio?.jugador).toBeNull();
    expect(anuncio?.datos['ganador']).toBe(despues.cierre?.clasificacion[0]?.jugador);
  });

  it('no se cierra antes de su turno, ni nunca si es abierta (criterio 4)', () => {
    const estado = escenario({ conDos: true });
    expect(turno(deTemporada(estado.turno + 5)).estado.cierre).toBeUndefined();
    expect(turno(deTemporada(null)).estado.cierre).toBeUndefined();
  });

  it('después del cierre no se resuelve ningún turno (criterio 2)', () => {
    const estado = deTemporada(escenario({ conDos: true }).turno);
    const cerrada = turno(estado).estado;
    expect(() => turno(cerrada)).toThrow(/la partida queda como archivo/);
  });

  it('la vista de cada jugador trae el cierre, que es público', () => {
    const cerrada = turno(deTemporada(escenario({ conDos: true }).turno)).estado;
    expect(vistaDeJugador(cerrada, DOS, mundo).cierre?.turno).toBe(cerrada.cierre?.turno);
    expect(vistaDeJugador(escenario({ conDos: true }), UNO, mundo).cierre).toBeNull();
  });
});

describe('los reconocimientos', () => {
  it('van al primero de cada capítulo, y solo si tiene algo en él', () => {
    // DOS con mas vecinos que UNO: la mayor poblacion es suya.
    const estado = conComarca(escenario({ conDos: true }), 'prueba-costa', {
      duenyo: DOS,
      poblacion: 400,
    });
    const cierre = cierreDeTemporada(estado, estado.turno, reglas);
    expect(cierre.reconocimientos.find((r) => r.reconocimiento === 'poblacion')?.jugador).toBe(DOS);
    // Nadie ha levantado obras mayores: no hay reconocimiento de obra.
    expect(cierre.reconocimientos.some((r) => r.reconocimiento === 'obras')).toBe(false);
  });

  it('en un empate gana el de más prestigio y, si siguen, el de menor identificador', () => {
    const base = conComarca(
      conComarca(escenario({ conDos: true }), 'prueba-costa', { duenyo: DOS, poblacion: 40 }),
      'prueba-llano',
      { poblacion: 40 },
    );
    const poblacion = (estado: EstadoPartida) =>
      cierreDeTemporada(estado, estado.turno, reglas).reconocimientos.find(
        (r) => r.reconocimiento === 'poblacion',
      )?.jugador;
    // Mismo capitulo y mismo prestigio: el menor identificador ('casa-dos' < 'casa-uno').
    expect(poblacion(base)).toBe(DOS);
    const uno = base.jugadores[UNO];
    if (uno === undefined) throw new Error('falta UNO');
    const masPrestigio = {
      ...base,
      jugadores: { ...base.jugadores, [UNO]: { ...uno, prestigio: 999 } },
    };
    expect(poblacion(masPrestigio)).toBe(UNO);
  });
});
