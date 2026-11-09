// La prevision de una ruta trazada a mano (ficha T-083 §4.3, criterios 1 y 3): la llegada que se
// promete es la que da el motor, y los avisos de la estacion salen antes de confirmar.
import { describe, expect, it } from 'vitest';

import { previsionDeRuta } from '../src/prevision/ruta.ts';
import { Tablero } from '../src/prevision/tablero.ts';
import { estadoEstacionalDe } from '../src/reglas/calendario.ts';
import { resolverTurno } from '../src/resolver.ts';
import { vistaDeJugador } from '../src/reglas/vista.ts';
import type { EstadoPartida, Recua } from '../src/tipos/estado.ts';
import { UNO, c, escenario, mundo, ordenRuta, recua, recursos, reglas } from './recuas.ts';

const tablero = (estado: EstadoPartida): Tablero =>
  new Tablero(vistaDeJugador(estado, UNO, mundo), mundo, reglas);

function conRecua(turno?: number): EstadoPartida {
  return escenario({
    ...(turno === undefined ? {} : { turno }),
    recuas: [recua('recua-1', { acemilas: 20, porte: 200, carga: recursos({ pan: 60, sal: 10 }) })],
  });
}

describe('la previsión de una ruta', () => {
  it('llega a cada parada en el turno que dice, como luego el motor (criterio 1)', () => {
    let estado = conRecua();
    const r = estado.recuas['recua-1'] as Recua;
    const paradas = [c('prueba-vega'), c('prueba-rio')];
    const p = previsionDeRuta(tablero(estado), { clase: 'recua', recua: r }, paradas, false);
    expect(p.ok).toBe(true);
    expect(p.llegadas).toHaveLength(2);
    expect(p.tramos.length).toBeGreaterThanOrEqual(2);
    expect(p.tramos.every((t) => t.jornadas !== null && t.jornadas > 0)).toBe(true);

    // La llegada a una parada es el turno en que la recua entra en ella, en orden.
    const llegadas: number[] = [];
    let ordenes = [ordenRuta(estado.turno, 'recua-1', paradas)];
    for (let k = 1; k <= 12 && llegadas.length < paradas.length; k += 1) {
      const resultado = resolverTurno(estado, ordenes, mundo, reglas);
      ordenes = [];
      for (const s of resultado.sucesos) {
        if (s.tipo === 'recua.entra' && s.comarca === paradas[llegadas.length]) llegadas.push(k);
      }
      estado = resultado.estado;
    }
    expect(llegadas).toEqual(p.llegadas);
  });

  it('un circuito cuenta la vuelta a la primera parada, y un rebaño da su llegada', () => {
    const estado = conRecua();
    const r = estado.recuas['recua-1'] as Recua;
    const ida = previsionDeRuta(
      tablero(estado),
      { clase: 'recua', recua: r },
      [c('prueba-vega')],
      false,
    );
    const circuito = previsionDeRuta(
      tablero(estado),
      { clase: 'recua', recua: r },
      [c('prueba-vega'), c('prueba-llano')],
      true,
    );
    expect(circuito.tramos.length).toBeGreaterThan(ida.tramos.length);
    expect(circuito.pan).toBeGreaterThanOrEqual(ida.pan);
    expect(previsionDeRuta(tablero(estado), { clase: 'recua', recua: r }, [], false).ok).toBe(
      false,
    );
  });

  it('avisa del puerto que se cierra antes de acabar el viaje (criterio 3)', () => {
    // El primer turno en que el puerto aun esta abierto y el siguiente ya no.
    let turno = 1;
    while (
      turno < 48 &&
      !(
        !estadoEstacionalDe(turno, mundo, reglas, []).puertosCerrados.includes(
          'Puerto de Prueba',
        ) &&
        estadoEstacionalDe(turno + 1, mundo, reglas, []).puertosCerrados.includes(
          'Puerto de Prueba',
        )
      )
    )
      turno += 1;
    expect(turno).toBeLessThan(48);
    const estado = conRecua(turno);
    const r = estado.recuas['recua-1'] as Recua;
    const p = previsionDeRuta(
      tablero(estado),
      { clase: 'recua', recua: r },
      [c('prueba-mina')],
      false,
    );
    const avisado =
      p.motivo === 'puerto-cerrado' || p.avisos.some((a) => a.includes('Puerto de Prueba'));
    expect(avisado, JSON.stringify(p)).toBe(true);
  });
});
