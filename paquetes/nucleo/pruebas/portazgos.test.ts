// Portazgos (ficha T-103 §5): se cobran al entrar en un tramo mejorado y salen en la cronica de las
// dos partes; quien no puede pagar va por el camino viejo, mas despacio y sin pagar; los arrieros no
// pagan el ajeno; y lo que una venta de arrieros cobra a recuas ajenas es para ellos.
import { describe, expect, it } from 'vitest';

import { CASAS_DE_OFICIO } from '../src/datos/casas.ts';
import { construirOrden, validarIntencion } from '../src/ordenes/intencion.ts';
import { explicar } from '../src/validacion/validador.ts';
import { claveDeTramo } from '../src/reglas/ruta.ts';
import { idDeMercadoLocal } from '../src/tipos/ids.ts';
import type { EstadoJugador, EstadoMercado, EstadoPartida, Recua } from '../src/tipos/estado.ts';
import type { IdJugador, IdOrden } from '../src/tipos/ids.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import type { Recursos } from '../src/tipos/recursos.ts';
import type { Casa, TablasDeReglas } from '../src/tipos/reglas.ts';
import {
  DOS,
  UNO,
  c,
  comarcaDe,
  conComarca,
  de,
  escenario,
  mundo,
  recua,
  recursos,
  reglas,
  turno,
} from './recuas.ts';

const REALES: TablasDeReglas = { ...reglas, casas: CASAS_DE_OFICIO };
const jugar = (estado: EstadoPartida, ordenes: readonly Orden[] = []) =>
  turno(estado, ordenes, REALES);

const LLANO = c('prueba-llano');
const VEGA = c('prueba-vega');
const TRAMO = claveDeTramo(LLANO, VEGA);

function jugadorDe(estado: EstadoPartida, id: IdJugador): EstadoJugador {
  const j = estado.jugadores[id];
  if (j === undefined) throw new Error(`falta ${id}`);
  return j;
}

function conCasa(estado: EstadoPartida, id: IdJugador, cambios: Partial<EstadoJugador>) {
  return {
    ...estado,
    jugadores: { ...estado.jugadores, [id]: { ...jugadorDe(estado, id), ...cambios } },
  };
}

/** Recua de UNO en el llano, camino de la vega por la calzada de peaje de DOS. */
function haciaLaVega(carga: Partial<Recursos>): Recua {
  return recua('recua-1', { ruta: [VEGA], carga: recursos({ pan: 20, sal: 5, ...carga }) });
}

/** La calzada del llano a la vega, de DOS (arrieros), con su portazgo. */
function conPeaje(opciones: {
  recuas: readonly Recua[];
  casaUno?: Casa;
  portazgo?: number;
  maravedisUno?: number;
}): EstadoPartida {
  let estado = escenario({ conDos: true, recuas: opciones.recuas });
  estado = conCasa(estado, DOS, { casa: 'arrieros' });
  estado = conCasa(estado, UNO, {
    casa: opciones.casaUno ?? 'mesta',
    almacen: recursos({ pan: 500, sal: 50, maravedis: opciones.maravedisUno ?? 500 }),
  });
  return {
    ...estado,
    caminos: {
      ...estado.caminos,
      [TRAMO]: { calidad: 'calzada', puente: false, duenyo: DOS, portazgo: opciones.portazgo ?? 5 },
    },
  };
}

describe('el cobro (criterio 2)', () => {
  it('la recua ajena paga al entrar, y sale en la crónica de las dos casas', () => {
    const estado = conPeaje({ recuas: [haciaLaVega({ maravedis: 20 })] });
    const { estado: despues, sucesos } = jugar(estado);
    expect(de(despues, 'recua-1').carga.maravedis).toBe(15);
    const pagado = sucesos.find((s) => s.tipo === 'portazgo.pagado');
    const cobrado = sucesos.find((s) => s.tipo === 'portazgo.cobrado');
    expect(pagado).toMatchObject({ jugador: UNO, datos: { cantidad: 5, de: DOS, por: 'recua' } });
    expect(cobrado).toMatchObject({ jugador: DOS, datos: { cantidad: 5, de: UNO } });
  });

  it('si la recua no lleva, paga del almacén', () => {
    const estado = conPeaje({ recuas: [haciaLaVega({})] });
    const { estado: despues, sucesos } = jugar(estado);
    expect(sucesos.find((s) => s.tipo === 'portazgo.pagado')?.datos['cantidad']).toBe(5);
    expect(jugadorDe(despues, UNO).almacen.maravedis).toBeLessThan(500);
  });

  it('los arrieros no pagan el portazgo ajeno, ni nadie el suyo propio', () => {
    const arriero = conPeaje({ recuas: [haciaLaVega({ maravedis: 20 })], casaUno: 'arrieros' });
    expect(jugar(arriero).sucesos.some((s) => s.tipo.startsWith('portazgo.'))).toBe(false);
    const propio = conPeaje({ recuas: [haciaLaVega({ maravedis: 20 })] });
    const delDueno: EstadoPartida = {
      ...propio,
      caminos: {
        ...propio.caminos,
        [TRAMO]: { calidad: 'calzada', puente: false, duenyo: UNO, portazgo: 5 },
      },
    };
    expect(jugar(delDueno).sucesos.some((s) => s.tipo.startsWith('portazgo.'))).toBe(false);
  });
});

describe('el camino viejo (criterio 3)', () => {
  it('quien no puede pagar no paga y va por el tramo sin la mejora, más despacio', () => {
    const pobre = conPeaje({ recuas: [haciaLaVega({})], maravedisUno: 0, portazgo: 20 });
    const rica = conPeaje({ recuas: [haciaLaVega({ maravedis: 20 })], portazgo: 20 });
    const sinPagar = jugar(pobre);
    const pagando = jugar(rica);
    expect(sinPagar.sucesos.some((s) => s.tipo === 'portazgo.pagado')).toBe(false);
    expect(sinPagar.sucesos.find((s) => s.tipo === 'portazgo.camino-viejo')).toMatchObject({
      jugador: UNO,
      datos: { de: DOS, cantidad: 20 },
    });
    expect(jugadorDe(sinPagar.estado, DOS).almacen.maravedis).toBe(
      jugadorDe(pobre, DOS).almacen.maravedis,
    );
    // Por la calzada la vega queda a una jornada; por la vereda de antes, a dos.
    const andado = (sucesos: typeof pagando.sucesos) =>
      sucesos.find((s) => s.tipo === 'recua.avanza')?.datos['andadoMil'];
    expect(andado(pagando.sucesos)).toBe(1000);
    expect(andado(sinPagar.sucesos)).toBe(2000);
  });
});

describe('quién cobra', () => {
  it('el tramo apunta a quien lo mejora solo si puede cobrar portazgo, y empieza sin él', () => {
    const terminar = (casa: Casa) => {
      let estado = conCasa(escenario({ conDos: true }), UNO, { casa });
      estado = {
        ...estado,
        obras: {
          'obra-1': {
            id: 'obra-1' as never,
            jugador: UNO,
            comarca: LLANO,
            tipo: 'obra mayor',
            que: 'calzada',
            hacia: VEGA,
            avanceMil: 7999,
            avanceNecesarioMil: 8000,
            entregado: recursos(),
            costeTotal: recursos(),
            abandonada: false,
          },
        },
      };
      return jugar(estado).estado.caminos[TRAMO];
    };
    expect(terminar('arrieros')).toMatchObject({ calidad: 'calzada', duenyo: UNO, portazgo: 0 });
    expect(terminar('mesta')?.duenyo).toBeUndefined();
  });

  it('el arriero fija su portazgo con una orden; el monje no puede', () => {
    let estado = conPeaje({ recuas: [], portazgo: 0 });
    const intencion = (sobre: EstadoPartida) => {
      const forma = validarIntencion({
        idCliente: 'peaje-1',
        tipo: 'portazgo',
        desde: LLANO,
        hasta: VEGA,
        cantidad: 7,
      });
      if (!forma.ok) throw new Error(explicar(forma.errores));
      return construirOrden(forma.valor, {
        estado: sobre,
        jugador: DOS,
        mundo,
        reglas: REALES,
        id: 'o-1-peaje-1' as IdOrden,
      });
    };
    const orden = intencion(estado);
    if (!orden.ok) throw new Error(explicar(orden.errores));
    estado = jugar(estado, [orden.valor]).estado;
    expect(estado.caminos[TRAMO]?.portazgo).toBe(7);
    const rechazada = intencion(conCasa(estado, DOS, { casa: 'monjes' }));
    expect(rechazada.ok).toBe(false);
  });

  it('lo que cobra una venta de arrieros a una recua ajena es para ellos', () => {
    const plaza: EstadoMercado = {
      id: idDeMercadoLocal(VEGA),
      comarca: VEGA,
      tipo: 'local',
      volumen: 'pequenya',
      preciosMil: recursos({ pan: 3000, sal: 14000 }),
      ultimoVolumen: recursos(),
    };
    let estado = escenario({
      conDos: true,
      recuas: [
        recua('recua-1', {
          situacion: { donde: 'comarca', comarca: VEGA },
          ruta: [c('prueba-rio'), c('prueba-costa')],
          carga: recursos({ maravedis: 40 }),
        }),
      ],
    });
    estado = conComarca(estado, VEGA, {
      duenyo: DOS,
      edificios: { ...comarcaDe(estado, VEGA).edificios, venta: 1 },
    });
    estado = { ...estado, mercados: { ...estado.mercados, [plaza.id]: plaza } };
    const arrieros = conCasa(estado, DOS, { casa: 'arrieros' });
    const cobro = jugar(arrieros).sucesos.find((s) => s.tipo === 'venta.cobrada');
    expect(cobro).toMatchObject({ jugador: DOS, comarca: VEGA, datos: { cantidad: 18, de: UNO } });
    const mesta = conCasa(estado, DOS, { casa: 'mesta' });
    expect(jugar(mesta).sucesos.some((s) => s.tipo === 'venta.cobrada')).toBe(false);
  });
});
