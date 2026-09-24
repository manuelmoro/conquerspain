// La venta da de comer a las recuas (T-055, docs/03-economia.md §3.3): la recua que pisa una venta
// paga alli su bastimento del turno con maravedis, que no pesan, y deja la carga para la mercancia.
import { describe, expect, it } from 'vitest';

import { costeEnLaVenta, hayVentaEn, ventaDelTurno } from '../src/reglas/bastimento.ts';
import type { EstadoMercado, EstadoPartida, Recua } from '../src/tipos/estado.ts';
import type { IdComarca } from '../src/tipos/ids.ts';
import { idDeMercadoLocal } from '../src/tipos/ids.ts';
import type { Recursos } from '../src/tipos/recursos.ts';
import {
  DOS,
  c,
  comarcaDe,
  conComarca,
  de,
  escenario,
  recua,
  recursos,
  reglas,
  tipos,
  turno,
} from './recuas.ts';

const hay =
  (estado: EstadoPartida) =>
  (comarca: IdComarca): boolean =>
    hayVentaEn(estado, comarca);

const PRECIOS = recursos({ pan: 3000, sal: 14000 });

/** El estado con una venta en pie en la comarca, y su plaza ya abierta con esos precios. */
function conVenta(
  estado: EstadoPartida,
  comarca: string,
  precios: Recursos = PRECIOS,
): EstadoPartida {
  const conEdificio = conComarca(estado, comarca, {
    edificios: { ...comarcaDe(estado, comarca).edificios, venta: 1 },
  });
  const id = idDeMercadoLocal(c(comarca));
  const plaza: EstadoMercado = {
    id,
    comarca: c(comarca),
    tipo: 'local',
    volumen: 'pequenya',
    preciosMil: precios,
    ultimoVolumen: recursos(),
  };
  return { ...conEdificio, mercados: { ...conEdificio.mercados, [id]: plaza } };
}

/** Recua fuera de casa, en la vega, camino de la costa por el rio: seis jornadas en dos turnos. */
function haciaLaCosta(carga: Partial<Recursos>): Recua {
  return recua('recua-1', {
    situacion: { donde: 'comarca', comarca: c('prueba-vega') },
    ruta: [c('prueba-rio'), c('prueba-costa')],
    carga: recursos(carga),
  });
}

describe('la venta del turno', () => {
  it('es la de la comarca donde empieza o la primera en la que entra', () => {
    let estado = escenario();
    expect(ventaDelTurno(hay(estado), c('prueba-vega'), [c('prueba-rio')])).toBeNull();
    estado = conVenta(estado, 'prueba-rio');
    expect(ventaDelTurno(hay(estado), c('prueba-vega'), [c('prueba-rio')])).toBe('prueba-rio');
    expect(ventaDelTurno(hay(estado), null, [c('prueba-rio')])).toBe('prueba-rio');
    estado = conVenta(estado, 'prueba-vega');
    expect(ventaDelTurno(hay(estado), c('prueba-vega'), [c('prueba-rio')])).toBe('prueba-vega');
  });

  it('cobra el pan y la sal a los precios de su plaza, redondeando al alza', () => {
    expect(costeEnLaVenta({ pan: 6, sal: 0 }, PRECIOS, reglas)).toBe(18);
    expect(costeEnLaVenta({ pan: 6, sal: 1 }, PRECIOS, reglas)).toBe(32);
    expect(costeEnLaVenta({ pan: 3, sal: 0 }, recursos({ pan: 2500, sal: 1 }), reglas)).toBe(8);
    // La tarifa de la tabla escala lo que cobra: a la mitad, la mitad.
    const aMitad = { ...reglas, movimiento: { ...reglas.movimiento, ventaCobraMil: 500 } };
    expect(costeEnLaVenta({ pan: 6, sal: 1 }, PRECIOS, aMitad)).toBe(16);
  });
});

describe('comer en la venta', () => {
  it('con una venta en el camino, la misma carga llega mas lejos', () => {
    const carga = { pan: 6, maravedis: 40 };

    // Sin venta: el primer turno se come los seis panes y el segundo se queda con hambre.
    let sin = escenario({ recuas: [haciaLaCosta(carga)] });
    sin = turno(sin).estado;
    expect(de(sin, 'recua-1').carga.pan).toBe(0);
    const segundo = turno(sin);
    expect(tipos(segundo.sucesos)).toContain('recua.sin-bastimento');
    expect(de(segundo.estado, 'recua-1').situacion.donde).toBe('camino');

    // Con venta en el rio: el primer turno come alli (6 panes a 3 = 18 maravedis) y el segundo
    // gasta dos panes de la carga y llega a la costa.
    let con = conVenta(escenario({ recuas: [haciaLaCosta(carga)] }), 'prueba-rio');
    con = turno(con).estado;
    expect(de(con, 'recua-1').carga).toMatchObject({ pan: 6, maravedis: 22 });
    con = turno(con).estado;
    expect(de(con, 'recua-1')).toMatchObject({
      acemilas: 10,
      avisadaSinBastimento: false,
      situacion: { donde: 'comarca', comarca: 'prueba-costa' },
      carga: expect.objectContaining({ pan: 4, maravedis: 22 }) as unknown,
    });
  });

  it('sin maravedis para pagar, come de la carga como siempre', () => {
    // Cargada anda dos jornadas: cuatro panes, doce maravedis en la venta, y solo lleva diez.
    let estado = conVenta(
      escenario({ recuas: [haciaLaCosta({ pan: 9, maravedis: 10 })] }),
      'prueba-rio',
    );
    estado = turno(estado).estado;
    expect(de(estado, 'recua-1').carga).toMatchObject({ pan: 5, maravedis: 10 });
  });

  it('da de comer igual en la venta de otra casa: la venta es de quien pasa', () => {
    let estado = conVenta(
      escenario({ conDos: true, recuas: [haciaLaCosta({ maravedis: 40 })] }),
      'prueba-vega',
    );
    estado = conComarca(estado, 'prueba-vega', { duenyo: DOS });
    estado = turno(estado).estado;
    expect(de(estado, 'recua-1').carga).toMatchObject({ pan: 0, maravedis: 22 });
    expect(de(estado, 'recua-1').avisadaSinBastimento).toBe(false);
  });

  it('en verano cobra tambien la sal de las conservas', () => {
    let estado = conVenta(
      escenario({ turno: 12, recuas: [haciaLaCosta({ maravedis: 40 })] }),
      'prueba-rio',
    );
    estado = turno(estado).estado;
    expect(de(estado, 'recua-1').carga).toMatchObject({ pan: 0, sal: 0, maravedis: 8 });
  });

  it('en comarca propia manda el almacen: la venta no cobra', () => {
    const enCasa = recua('recua-1', {
      ruta: [c('prueba-vega')],
      carga: recursos({ maravedis: 40 }),
    });
    const estado = conVenta(escenario({ recuas: [enCasa] }), 'prueba-llano');
    const { estado: despues } = turno(estado);
    expect(de(despues, 'recua-1').carga.maravedis).toBe(40);
  });

  it('una venta sin plaza abierta todavia cobra al precio base de su comarca', () => {
    const estado = conComarca(
      escenario({ recuas: [haciaLaCosta({ maravedis: 40 })] }),
      'prueba-rio',
      {
        edificios: { venta: 1 },
      },
    );
    const { estado: despues } = turno(estado);
    const recuaDespues = de(despues, 'recua-1');
    expect(recuaDespues.carga.maravedis).toBeLessThan(40);
    expect(recuaDespues.avisadaSinBastimento).toBe(false);
  });
});
