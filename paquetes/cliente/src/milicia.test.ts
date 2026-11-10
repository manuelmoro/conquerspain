// Milicia en el cliente (T-120): la mesnada y la hostilidad en una frase, y la leva máxima.
import type { IdAsedio, IdComarca, IdJugador, IdMesnada, Mesnada } from '@conquer/nucleo';
import { describe, expect, it } from 'vitest';

import {
  fraseDeAsedio,
  fraseDeHostilidad,
  fraseDeMesnada,
  hostilidad,
  levaMaxima,
  levar,
} from './milicia.ts';

const m: Mesnada = {
  id: 'mesnada-1' as IdMesnada,
  jugador: 'mesta' as IdJugador,
  nombre: 'Mesnada de Soria',
  origen: 'soria' as IdComarca,
  hombres: 40,
  situacion: { donde: 'marcha', hacia: 'almazan' as IdComarca, turnosQueFaltan: 2 },
  turnosFuera: 0,
};

describe('la milicia en palabras', () => {
  it('dice dónde va y lo que cuesta', () => {
    expect(fraseDeMesnada(m, (id) => id.toUpperCase())).toBe(
      '40 hombres de marcha hacia ALMAZAN (2 turnos). Cuesta 4 de pan y 24 maravedís por turno.',
    );
  });

  it('la hostilidad, desde quien la lee', () => {
    const h = {
      de: 'mesta' as IdJugador,
      contra: 'monjes' as IdJugador,
      declaradaEn: 4,
      vigenteDesde: 5,
    };
    expect(fraseDeHostilidad(h, 'mesta', 4, () => 'Los monjes')).toBe(
      'tu casa contra Los monjes: vale desde el turno 5.',
    );
    expect(fraseDeHostilidad(h, 'monjes', 6, () => 'La Mesta')).toBe(
      'La Mesta contra tu casa: vigente.',
    );
  });

  it('la leva máxima es una quinta parte, y las intenciones son las del motor', () => {
    expect(levaMaxima(400)).toBe(80);
    expect(levar('soria', 20)).toEqual({ tipo: 'levar', comarca: 'soria', hombres: 20 });
    expect(hostilidad('monjes', true)).toEqual({
      tipo: 'hostilidad',
      contra: 'monjes',
      declarar: true,
    });
  });
});

describe('el asedio en palabras (T-121)', () => {
  it('quién sitia, desde cuándo y cuándo puede rendirse', () => {
    const a = {
      id: 'asedio-1' as IdAsedio,
      comarca: 'almazan' as IdComarca,
      sitiador: 'mesta' as IdJugador,
      mesnada: 'mesnada-1' as IdMesnada,
      desde: 10,
      rescate: 30,
    };
    expect(
      fraseDeAsedio(
        a,
        'monjes',
        12,
        (id) => id,
        () => 'La Mesta',
      ),
    ).toBe(
      'La milicia de La Mesta asedia almazan desde el turno 10: no puede rendirse antes del turno 15. Rescate ofrecido: 30 maravedís.',
    );
  });
});
