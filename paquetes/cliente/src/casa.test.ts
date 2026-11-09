// «Tu casa» (ficha T-089, criterios 3 y 4): las reglas del mayordomo en castellano y aceptadas por el
// servidor, y ningún tipo de orden sin su sitio en la interfaz.
import { describe, expect, it } from 'vitest';

import {
  ACCIONES_DE_MAYORDOMO,
  CONDICIONES_DE_MAYORDOMO,
  TIPOS_DE_ORDEN,
  validarIntencion,
} from '@conquer/nucleo';

import {
  CAMPOS_DE_ACCION,
  CAMPOS_DE_CONDICION,
  altaDeRegla,
  bajaDeRegla,
  componerAccion,
  componerCondicion,
  conservarConSal,
  describirRegla,
} from './casa.ts';
import type { Campo } from './casa.ts';
import { QUE_HACER } from './nombres.ts';

/** Un valor de prueba para cada campo del formulario. */
const VALORES: Readonly<Record<Campo, string>> = {
  cantidad: '40',
  recurso: 'lana',
  plaza: 'local-burgos',
  precio: '52,5',
  comarca: 'burgos',
  estacion: 'otonyo',
  recua: 'recua-3',
  rebanyo: 'rebanyo-2',
  operacion: 'vender',
  carga: 'ligera',
};

const NOMBRES = {
  comarca: () => 'Burgos',
  plaza: () => 'el Mercado de Burgos',
  unidad: () => 'la Recua de Burgos',
};

describe('el mayordomo en castellano (criterio 3)', () => {
  it('cada condición y cada acción se componen, se leen sin identificadores y el servidor las acepta', () => {
    for (const tc of CONDICIONES_DE_MAYORDOMO) {
      const c = componerCondicion(
        tc,
        Object.fromEntries(CAMPOS_DE_CONDICION[tc].map((k) => [k, VALORES[k]])),
      );
      if (c === null) throw new Error(`no se compone ${tc}`);
      for (const ta of ACCIONES_DE_MAYORDOMO) {
        const a = componerAccion(
          ta,
          Object.fromEntries(CAMPOS_DE_ACCION[ta].map((k) => [k, VALORES[k]])),
        );
        if (a === null) throw new Error(`no se compone ${ta}`);
        const texto = describirRegla({ prioridad: 1, condicion: c, accion: a }, NOMBRES);
        expect(texto, texto).toMatch(/^Si .+\.$/);
        expect(texto, texto).not.toMatch(/recua-3|rebanyo-2|local-burgos|otonyo|undefined|-que/);
        const intencion = altaDeRegla([{ prioridad: 4 }], c, a);
        expect(intencion['alta']).toMatchObject({ prioridad: 5 });
        const forma = validarIntencion({ ...intencion, idCliente: 'regla' });
        expect(forma.ok, `${tc} + ${ta}: ${JSON.stringify(forma)}`).toBe(true);
      }
    }
    expect(validarIntencion({ ...bajaDeRegla(4), idCliente: 'baja' }).ok).toBe(true);
    expect(validarIntencion({ ...conservarConSal('burgos', true), idCliente: 'sal' }).ok).toBe(
      true,
    );
  });

  it('un campo que falta o no vale no compone nada', () => {
    expect(componerCondicion('pan-disponible-menor-que', {})).toBeNull();
    expect(
      componerCondicion('recurso-almacenado-mayor-que', { recurso: 'oro', cantidad: '3' }),
    ).toBeNull();
    expect(componerAccion('mercado', { ...VALORES, cantidad: '0' })).toBeNull();
    expect(componerAccion('carga-fiscal', { comarca: 'x', carga: 'brutal' })).toBeNull();
    expect(componerAccion('mercado', VALORES)).toMatchObject({ precioLimiteMil: 52500 });
  });
});

describe('cada orden tiene su sitio (criterio 4)', () => {
  it('solo la letra de cambio espera, y dice a qué', () => {
    for (const tipo of TIPOS_DE_ORDEN) {
      const q = QUE_HACER[tipo];
      if (tipo === 'letra-de-cambio') expect(q.llega).toMatch(/contratos/);
      else expect(q.donde, tipo).not.toBeNull();
    }
  });
});
