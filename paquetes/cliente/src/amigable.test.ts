// Lo que el jugador lee y toca (ficha T-088): nombres en castellano sin identificadores, el resumen
// del turno con sus cambios, y el umbral que separa tocar una comarca de arrastrar el mapa.
import { describe, expect, it } from 'vitest';

import { ESTADOS_DE_ORDEN, TIPOS_DE_ORDEN, recursosSegun } from '@conquer/nucleo';
import type { VistaJugador } from '@conquer/nucleo';

import { apiDePrueba, CUENTAS } from '../../servidor/src/api/prueba-comun.ts';
import { esArrastre } from './atlas/gestos.ts';
import { textoDeGanar } from './ganar.ts';
import {
  NOMBRE_DE_ESTADO,
  NOMBRE_DE_ORDEN,
  QUE_HACER,
  nombreDeOrden,
  queHacer,
} from './nombres.ts';
import { resumirTurno } from './resumen.ts';

describe('los nombres (criterio 5)', () => {
  it('todo tipo y estado de orden tiene nombre, y ninguno es su identificador con guiones', () => {
    for (const tipo of TIPOS_DE_ORDEN) {
      expect(NOMBRE_DE_ORDEN[tipo]).not.toMatch(/-/);
      expect(nombreDeOrden(tipo)).toBe(NOMBRE_DE_ORDEN[tipo]);
    }
    for (const estado of ESTADOS_DE_ORDEN)
      expect(NOMBRE_DE_ESTADO[estado].length).toBeGreaterThan(0);
  });

  it('un tipo desconocido se lee «Orden», nunca «¿?» ni el texto crudo', () => {
    expect(nombreDeOrden('inventado')).toBe('Orden');
    expect(nombreDeOrden(undefined)).toBe('Orden');
  });

  it('toda acción sugerida se lee en castellano y, si no tiene pantalla, dice cuándo llega (criterio 9)', () => {
    for (const tipo of TIPOS_DE_ORDEN) {
      const q = QUE_HACER[tipo];
      expect(queHacer(tipo)).toBe(q);
      expect(q.texto, tipo).toMatch(/^[A-ZÁÉÍÓÚ].*\.$/);
      expect(q.texto, tipo).not.toContain(tipo.includes('-') ? tipo : `«${tipo}»`);
      expect(q.donde === null, tipo).toBe(q.llega !== null);
    }
    expect(queHacer('inventada')).toBeNull();
    expect(queHacer(null)).toBeNull();
  });
});

describe('cómo ganar una comarca, en palabras (T-088 §2.7)', () => {
  const base = {
    actual: 12,
    necesaria: 60,
    ventaja: 15,
    cambio: 2,
    motivos: [
      { texto: 'una recua tuya presente', puntos: 2 },
      { texto: 'comarcas tuyas vecinas', puntos: 1 },
      { texto: 'nadie tuyo está ni comercia allí', puntos: -1 },
    ],
    aceleraria: [{ texto: 'un regalo al concejo', puntos: 5 }],
    turnosHastaLaNecesaria: 24,
  };

  it('dice lo que tiene, lo que falta, el ritmo y el porqué con su signo', () => {
    const t = textoDeGanar(base);
    expect(t.cabecera).toBe(
      'Tu influencia: 12 de los 60 que pide incorporarla (y 15 de ventaja sobre la segunda casa).',
    );
    expect(t.ritmo).toBe('Este turno: +2. A este paso llegas en 24 turnos.');
    expect(t.motivos).toEqual([
      '+2: una recua tuya presente',
      '+1: comarcas tuyas vecinas',
      '-1: nadie tuyo está ni comercia allí',
    ]);
    expect(t.aceleraria).toEqual(['+5: un regalo al concejo']);
  });

  it('si no se mueve o baja, avisa de que así no se llega', () => {
    expect(textoDeGanar({ ...base, cambio: 0, turnosHastaLaNecesaria: null }).ritmo).toBe(
      'Este turno no se mueve. A este paso no llegas.',
    );
    expect(textoDeGanar({ ...base, cambio: -1, turnosHastaLaNecesaria: null }).ritmo).toBe(
      'Este turno: -1. A este paso no llegas.',
    );
    expect(textoDeGanar({ ...base, actual: 70, turnosHastaLaNecesaria: 0 }).cabecera).toMatch(
      /Ya llega/,
    );
  });
});

describe('el resumen del turno (criterio 3)', () => {
  it('cuenta lo que sube y lo que baja de cada recurso y la poblacion', async () => {
    const e = await apiDePrueba({ turnosJugados: 2 });
    const r = await e.pedir(CUENTAS['mesta'] ?? '', 'GET', '/partidas/p1/estado');
    const despues = (r.cuerpo as { vista: VistaJugador }).vista;
    await e.repo.cerrar();
    const antes: VistaJugador = {
      ...despues,
      turno: despues.turno - 1,
      jugador: {
        ...despues.jugador,
        almacen: recursosSegun(
          (x) => despues.jugador.almacen[x] + (x === 'pan' ? 10 : x === 'madera' ? -3 : 0),
        ),
      },
    };
    const resumen = resumirTurno(antes, despues, []);
    expect(resumen.desde).toBe(despues.turno - 1);
    expect(resumen.hasta).toBe(despues.turno);
    expect(resumen.recursos.find((c) => c.recurso === 'pan')?.cambio).toBe(-10);
    expect(resumen.recursos.find((c) => c.recurso === 'madera')?.cambio).toBe(3);
    expect(resumen.recursos.find((c) => c.recurso === 'sal')?.cambio).toBe(0);
    // Lo que explica el cambio: producido mas lo demas, y producido es lo de tus comarcas.
    const pan = resumen.recursos.find((c) => c.recurso === 'pan');
    expect(pan?.producido).toBeGreaterThan(0);
    for (const c of resumen.recursos) expect(c.producido + c.otros).toBe(c.cambio);
    expect(resumen.poblacion.antes).toBe(resumen.poblacion.despues);
    expect(resumen.poblacion.despues).toBeGreaterThan(0);
  }, 120_000);
});

describe('tocar o arrastrar (criterio 1)', () => {
  it('moverse hasta 4 pixeles es tocar; mas, arrastrar', () => {
    expect(esArrastre({ x: 10, y: 10 }, { x: 13, y: 10 })).toBe(false);
    expect(esArrastre({ x: 10, y: 10 }, { x: 12, y: 13 })).toBe(false);
    expect(esArrastre({ x: 10, y: 10 }, { x: 15, y: 10 })).toBe(true);
  });
});
