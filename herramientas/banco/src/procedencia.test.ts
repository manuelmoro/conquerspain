// La procedencia de un informe (ficha T-048 §4.1 y §6.5): misma entrada y misma procedencia, mismo
// manifiesto byte a byte; y si cambia algo que no se estaba ensayando, hay que decirlo.
import { describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO } from '@conquer/nucleo';

import { mundoMini } from '../../../paquetes/nucleo/pruebas/mundo-mini.ts';
import { avisoDeDosInformes } from './comparar.ts';
import { partida, resultado } from './partidas-de-prueba.ts';
import {
  avisoDeProcedencia,
  componerManifiesto,
  diferenciasDeProcedencia,
  textoDeManifiesto,
} from './procedencia.ts';

const PROCEDENCIA = { revision: 'abc123', etiqueta: 'T-048', cambios: '' };

const CAMPANYA = resultado([
  partida([{ casa: 'mesta', prestigio: 100 }], { semilla: '1492' }),
  partida([{ casa: 'mesta', prestigio: 90 }], { semilla: '1492-2' }),
]);

function manifiestoDe(cambios = PROCEDENCIA.cambios) {
  return componerManifiesto(CAMPANYA, mundoMini(), TABLAS_DEL_JUEGO, { ...PROCEDENCIA, cambios });
}

describe('el manifiesto', () => {
  it('fija con qué se sacó el informe: código, tablas, mundo, semillas y objetivos', () => {
    const m = manifiestoDe();
    expect(m.revision).toBe('abc123');
    expect(m.campanya.semillas).toEqual(['1492', '1492-2']);
    expect(m.campanya.cadencias).toEqual([1]);
    expect(m.mundo.comarcas).toBe(Object.keys(mundoMini().comarcas).length);
    expect(m.reglas.huella).toMatch(/^[0-9a-f]{64}$/u);
    expect(m.mundo.huella).toMatch(/^[0-9a-f]{64}$/u);
    expect(m.objetivos.huella).toMatch(/^[0-9a-f]{64}$/u);
    expect(m.versiones.metricas).toBeGreaterThan(0);
  });

  it('la huella de las tablas distingue un ensayo de otro, y VERSION_REGLAS no', () => {
    const otras = {
      ...TABLAS_DEL_JUEGO,
      movimiento: { ...TABLAS_DEL_JUEGO.movimiento, portePorAcemila: 4 },
    };
    const ensayo = componerManifiesto(CAMPANYA, mundoMini(), otras, PROCEDENCIA);
    const base = manifiestoDe();
    expect(ensayo.versiones.reglas).toBe(base.versiones.reglas);
    expect(ensayo.reglas.huella).not.toBe(base.reglas.huella);
  });

  it('con la misma entrada y la misma procedencia sale byte a byte igual', () => {
    expect(textoDeManifiesto(manifiestoDe())).toBe(textoDeManifiesto(manifiestoDe()));
  });

  it('guarda la huella final y el mapa jugado de cada partida', () => {
    const m = manifiestoDe();
    expect(m.partidas).toHaveLength(2);
    expect(m.partidas[0]).toMatchObject({ semilla: '1492', cadencia: 1 });
    expect(m.partidas[0]?.huellaFinal).toBeTruthy();
    expect(m.partidas[0]?.comarcas).toBeGreaterThan(0);
  });
});

describe('el aviso de procedencia', () => {
  it('dice que no cambia nada cuando los dos informes son el mismo', () => {
    const m = manifiestoDe();
    expect(diferenciasDeProcedencia(m, m)).toEqual([]);
    expect(avisoDeProcedencia([], 'reglas.huella')).toContain('misma procedencia');
  });

  it('avisa cuando cambia el grupo ensayado y solo ese', () => {
    const otras = {
      ...TABLAS_DEL_JUEGO,
      movimiento: { ...TABLAS_DEL_JUEGO.movimiento, portePorAcemila: 4 },
    };
    const diferencias = diferenciasDeProcedencia(
      manifiestoDe(),
      componerManifiesto(CAMPANYA, mundoMini(), otras, PROCEDENCIA),
    );
    expect(diferencias.map((d) => d.campo)).toEqual(['reglas.huella']);
    const aviso = avisoDeProcedencia(diferencias, 'reglas.huella');
    expect(aviso).toContain('(lo ensayado)');
    expect(aviso).toContain('Solo cambia lo ensayado.');
  });

  it('cuando cambian dos cosas a la vez, dice que la comparación no demuestra nada', () => {
    const diferencias = diferenciasDeProcedencia(manifiestoDe(), {
      ...manifiestoDe('porte 4'),
      revision: 'otra',
    });
    expect(diferencias.map((d) => d.campo).sort()).toEqual(['cambios', 'revision']);
    expect(avisoDeProcedencia(diferencias, 'reglas.huella')).toContain(
      'no demuestra qué ha hecho el cambio',
    );
  });

  it('un informe sin manifiesto no se compara a ciegas: se dice', () => {
    expect(avisoDeDosInformes('no-existe.csv', 'tampoco.csv', 'reglas.huella')).toContain(
      'no trae manifiesto',
    );
  });

  it('un manifiesto ilegible no revienta: cada campo que falta se ve como «?»', () => {
    const diferencias = diferenciasDeProcedencia(manifiestoDe(), null);
    expect(diferencias.every((d) => d.despues === '?')).toBe(true);
  });
});
