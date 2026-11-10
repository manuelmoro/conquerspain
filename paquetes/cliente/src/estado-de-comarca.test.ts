// El estado de una comarca en palabras (T-090): cada dato dice lo que implica.
import { describe, expect, it } from 'vitest';

import { TIPOS_DE_EDIFICIO } from '@conquer/nucleo';

import {
  ICONO_DE_EDIFICIO,
  datoDeLealtad,
  datoDeSolares,
  datoDeVecinos,
  nivelEnPuntos,
  notaDeNivel,
} from './estado-de-comarca.ts';

describe('el estado de una comarca, en palabras', () => {
  it('más vecinos que sitio: dice que no crece y qué hacer', () => {
    const d = datoDeVecinos(120, 60, 30);
    expect(d.alerta).toBe(true);
    expect(d.nota).toBe('Caben 60: ya no crece. Cada nivel de casas da sitio a 30 más.');
    expect(datoDeVecinos(40, 60, 30)).toMatchObject({
      alerta: false,
      nota: 'Caben 60: puede crecer 20 más.',
    });
  });

  it('los solares llenos se avisan, y ampliar no gasta solar (T-094)', () => {
    expect(datoDeSolares(4, 4)).toMatchObject({ alerta: true, valor: '4 de 4 ocupados' });
    expect(datoDeSolares(4, 4).nota).toMatch(/ampliar los que tienes no gasta solar/);
    expect(datoDeSolares(2, 4).nota).toBe(
      'Quedan 2 para edificios nuevos; ampliar no gasta solar.',
    );
  });

  it('la lealtad baja se avisa con su consecuencia', () => {
    expect(datoDeLealtad(100).alerta).toBe(false);
    expect(datoDeLealtad(30)).toMatchObject({
      alerta: true,
      nota: 'Descontenta: produce un 25 % menos.',
    });
  });

  it('el nivel de un edificio en puntos y en una frase, y cada edificio con icono', () => {
    expect(nivelEnPuntos(3, 4)).toBe('●●●○');
    expect(notaDeNivel(3, 4)).toBe('Nivel 3 de 4: se puede ampliar una vez más');
    expect(notaDeNivel(1, 3)).toBe('Nivel 1 de 3: se puede ampliar 2 veces más');
    expect(notaDeNivel(2, 2)).toBe('Nivel 2 de 2: al máximo');
    for (const t of TIPOS_DE_EDIFICIO) expect(ICONO_DE_EDIFICIO[t].length, t).toBeGreaterThan(0);
  });
});
