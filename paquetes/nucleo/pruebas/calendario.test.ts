// Calendario, estaciones y clima (T-030).
import { describe, expect, it } from 'vitest';

import type { EstadoPartida, IdFeria, Mundo } from '../src/index.ts';
import {
  CLIMA,
  calendarioDe,
  climaDelAnyo,
  estadoEstacionalDe,
  resolverTurno,
} from '../src/index.ts';
import { estadoMini, mundoMini, tablasMini } from './mundo-mini.ts';

const reglas = tablasMini();

/** El mundo mini con una feria de dos turnos y cuatro regiones con clima propio. */
function mundoConFeriaYRegiones(): Mundo {
  const base = mundoMini();
  const comarcas: Record<string, Mundo['comarcas'][string]> = {};
  Object.entries(base.comarcas).forEach(([id, comarca], indice) => {
    comarcas[id] = {
      ...comarca,
      region: `0${String((indice % 4) + 1)}-prueba`,
      rasgos: indice === 0 ? [...comarca.rasgos, 'villa-de-feria'] : comarca.rasgos,
      ferias:
        indice === 0
          ? [
              {
                id: 'feria-de-prueba' as IdFeria,
                nombre: 'Feria de Prueba',
                turnos: [10, 11],
                volumen: 'grande',
                recursosDestacados: ['lana'],
              },
            ]
          : [],
    };
  });
  return { ...base, comarcas };
}

describe('calendarioDe', () => {
  it.each([
    [1, 'primera quincena de enero', 1, 'invierno'],
    [10, 'segunda quincena de mayo', 1, 'primavera'],
    [24, 'segunda quincena de diciembre', 1, 'invierno'],
    [25, 'primera quincena de enero', 2, 'invierno'],
    [240, 'segunda quincena de diciembre', 10, 'invierno'],
    [13, 'primera quincena de julio', 1, 'verano'],
    [19, 'primera quincena de octubre', 1, 'otonyo'],
  ] as const)('el turno %i es la %s del anyo %i', (turno, nombre, anyo, estacion) => {
    const calendario = calendarioDe(turno, mundoMini(), reglas);
    expect(calendario.nombre).toBe(nombre);
    expect(calendario.anyo).toBe(anyo);
    expect(calendario.estacion).toBe(estacion);
  });

  it('marca el esquileo solo en su turno', () => {
    const esquileos = Array.from({ length: 48 }, (_, i) => i + 1).filter(
      (turno) => calendarioDe(turno, mundoMini(), reglas).esEsquileo,
    );
    expect(esquileos).toEqual([10, 34]);
  });

  it('rechaza turnos que no existen', () => {
    expect(() => calendarioDe(0, mundoMini(), reglas)).toThrow(/desde 1/);
  });
});

describe('estado estacional', () => {
  it('cierra los puertos exactamente en los turnos 23-24 y 1-4', () => {
    const cerrados = Array.from({ length: 24 }, (_, i) => i + 1).filter(
      (turno) => estadoEstacionalDe(turno, mundoMini(), reglas).puertosCerrados.length > 0,
    );
    expect(cerrados).toEqual([1, 2, 3, 4, 23, 24]);
    expect(estadoEstacionalDe(1, mundoMini(), reglas).puertosCerrados).toEqual([
      'Puerto de Prueba',
    ]);
  });

  it('alterna pastos de verano e invierno y encarece la canteria en invierno', () => {
    const mayo = estadoEstacionalDe(9, mundoMini(), reglas);
    expect(mayo.pastosDeVerano && !mayo.pastosDeInvierno).toBe(true);
    const enero = estadoEstacionalDe(1, mundoMini(), reglas);
    expect(enero.pastosDeInvierno && !enero.pastosDeVerano).toBe(true);
    expect(enero.factorObraPiedraMil).toBe(2000);
    expect(mayo.factorObraPiedraMil).toBe(1000);
    expect(estadoEstacionalDe(5, mundoMini(), reglas).barro).toBe(true);
  });

  it('activa las ferias solo en sus turnos', () => {
    const mundo = mundoConFeriaYRegiones();
    const conFeria = Array.from({ length: 48 }, (_, i) => i + 1).filter(
      (turno) => calendarioDe(turno, mundo, reglas).feriasActivas.length > 0,
    );
    expect(conFeria).toEqual([10, 11, 34, 35]);
  });
});

describe('clima anunciado', () => {
  it('es el mismo al reproducir la partida y cambia con la semilla', () => {
    const mundo = mundoConFeriaYRegiones();
    const uno = Array.from({ length: 20 }, (_, i) => climaDelAnyo('semilla-a', i + 1, mundo));
    const otra = Array.from({ length: 20 }, (_, i) => climaDelAnyo('semilla-a', i + 1, mundo));
    const distinta = Array.from({ length: 20 }, (_, i) => climaDelAnyo('semilla-b', i + 1, mundo));
    expect(otra).toEqual(uno);
    expect(distinta).not.toEqual(uno);
  });

  it('nunca se sale de ±30 % ni afecta a mas de dos regiones (500 anyos)', () => {
    const mundo = mundoConFeriaYRegiones();
    for (let anyo = 1; anyo <= 500; anyo += 1) {
      const clima = climaDelAnyo('propiedad', anyo, mundo);
      expect(clima.modificadores.length).toBeLessThanOrEqual(CLIMA.maximoModificadores);
      for (const modificador of clima.modificadores) {
        expect(modificador.regiones.length).toBeGreaterThanOrEqual(1);
        expect(modificador.regiones.length).toBeLessThanOrEqual(CLIMA.maximoRegiones);
        expect(modificador.factorPanMil).toBeGreaterThanOrEqual(CLIMA.minimoMil);
        expect(modificador.factorPanMil).toBeLessThanOrEqual(CLIMA.maximoMil);
      }
    }
  });

  it('el clima del anyo N se anuncia en el ultimo turno del anyo N-1', () => {
    const mundo = mundoConFeriaYRegiones();
    const estado: EstadoPartida = { ...estadoMini(), turno: 24, huellaTurnoAnterior: 'x' };
    const { sucesos } = resolverTurno(estado, [], mundo, reglas);
    const anuncios = sucesos.filter((suceso) => suceso.tipo === 'calendario.clima-anunciado');
    expect(anuncios.length).toBeGreaterThan(0);
    expect(anuncios.every((suceso) => suceso.datos['anyo'] === 2)).toBe(true);

    const mitad: EstadoPartida = { ...estadoMini(), turno: 12, huellaTurnoAnterior: 'x' };
    const sinAnuncio = resolverTurno(mitad, [], mundo, reglas).sucesos;
    expect(sinAnuncio.some((suceso) => suceso.tipo === 'calendario.clima-anunciado')).toBe(false);
  });

  it('publica la estacion, los puertos y la feria cuando cambian', () => {
    const mundo = mundoConFeriaYRegiones();
    const tipos = (turno: number): string[] =>
      resolverTurno({ ...estadoMini(), turno, huellaTurnoAnterior: 'x' }, [], mundo, reglas)
        .sucesos.map((suceso) => suceso.tipo)
        .filter((tipo) => tipo.startsWith('calendario.'));
    expect(tipos(23)).toEqual(['calendario.estacion', 'calendario.puerto-cerrado']);
    expect(tipos(5)).toEqual(['calendario.estacion', 'calendario.puerto-abierto']);
    expect(tipos(10)).toEqual(['calendario.feria-abierta']);
    expect(tipos(11)).toEqual(['calendario.estacion']);
    expect(tipos(12)).toEqual([]);
  });
});
