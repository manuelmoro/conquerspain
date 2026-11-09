// El plano de una comarca (T-092): una parcela por solar, cada una con lo que la ocupa y por que.
import { describe, expect, it } from 'vitest';

import { TIPOS_DE_EDIFICIO } from '@conquer/nucleo';
import type { DetalleDePropia } from '@conquer/nucleo';

import { dibujoDeEdificio, dibujoDeObra, dibujoDePlaza, dibujoLibre } from './arte/edificios.ts';
import { PARA_QUE_SIRVE, explicarParcela, parcelasDe, rejillaDelPlano } from './plano.ts';

const NADA = { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 };

function comarca(cambios: Partial<DetalleDePropia> = {}): DetalleDePropia {
  return {
    poblacion: 120,
    capacidad: 60,
    lealtad: 70,
    fuero: 'ninguno',
    cargaFiscal: 'normal',
    aperos: 0,
    solares: { usados: 5, total: 7 },
    edificios: [
      { tipo: 'granja', nombre: 'Granja', nivel: 3, maximo: 4 },
      { tipo: 'casas', nombre: 'Casas', nivel: 1, maximo: 3 },
    ],
    obras: [
      { que: 'Mercado', edificio: 'mercado', avanceMil: 1000, necesarioMil: 3000 },
      { que: 'Calzada', edificio: null, avanceMil: 0, necesarioMil: 5000 },
    ],
    producido: { ...NADA },
    prevision: [
      { edificio: 'granja', nivel: 3, recurso: 'pan', base: 30, factores: [], resultado: 27 },
    ],
    ...cambios,
  } as const satisfies DetalleDePropia;
}

describe('las parcelas de una comarca', () => {
  it('una por nivel de edificio, una por obra de edificio y el resto libres; las casas primero', () => {
    const p = parcelasDe(comarca());
    expect(p.map((x) => (x.clase === 'libre' ? 'libre' : `${x.clase}:${x.edificio}`))).toEqual([
      'edificio:casas',
      'edificio:granja',
      'edificio:granja',
      'edificio:granja',
      'obra:mercado',
      'libre',
      'libre',
    ]);
    expect(p[4]).toMatchObject({ clase: 'obra', avance: 33 });
  });

  it('si hay mas ocupado que solares, no se esconde nada', () => {
    const p = parcelasDe(comarca({ solares: { usados: 5, total: 3 } }));
    expect(p).toHaveLength(5);
    expect(p.some((x) => x.clase === 'libre')).toBe(false);
  });

  it('la plaza va en el centro y ninguna parcela la pisa ni se repite', () => {
    for (let n = 0; n <= 12; n += 1) {
      const r = rejillaDelPlano(n);
      expect(r.parcelas).toHaveLength(n);
      const claves = r.parcelas.map((c) => `${String(c.columna)},${String(c.fila)}`);
      expect(new Set(claves).size).toBe(n);
      expect(claves).not.toContain('1,1');
    }
    // Con ocho, el pueblo queda rodeado: una rejilla de 3 por 3.
    expect(Math.max(...rejillaDelPlano(8).parcelas.map((c) => c.fila))).toBe(2);
  });

  it('cada parcela dice qué es, por qué ocupa el solar y qué da', () => {
    const c = comarca();
    const [, granja, , , obra, libre] = parcelasDe(c);
    if (granja === undefined || obra === undefined || libre === undefined)
      throw new Error('faltan');
    const g = explicarParcela(granja, c);
    expect(g.titulo).toBe('Granja');
    expect(g.lineas.join(' ')).toMatch(/cada nivel ocupa un solar, y este es el 1\.º de 3/);
    expect(g.lineas.join(' ')).toMatch(/Entre todos sus niveles da 27 de pan/);
    expect(explicarParcela(obra, c).lineas.join(' ')).toMatch(/ya ocupa su solar/);
    expect(explicarParcela(libre, c).titulo).toBe('Solar libre');
  });
});

describe('el arte del plano', () => {
  it('cada edificio tiene su dibujo y su para qué sirve', () => {
    for (const t of TIPOS_DE_EDIFICIO) {
      expect(dibujoDeEdificio(t), t).toMatch(/^<polygon/);
      expect(PARA_QUE_SIRVE[t].length, t).toBeGreaterThan(20);
    }
    const dibujos = new Set(TIPOS_DE_EDIFICIO.map((t) => dibujoDeEdificio(t)));
    expect(dibujos.size).toBe(TIPOS_DE_EDIFICIO.length);
    expect(dibujoDeObra(50)).not.toBe(dibujoDeObra(100));
    expect(dibujoLibre()).toMatch(/stroke-dasharray/);
    // La capital lleva su pendón; un pueblo, no.
    expect(dibujoDePlaza(true)).toContain('#b3261e');
    expect(dibujoDePlaza(false)).not.toContain('#b3261e');
  });
});
