import { describe, expect, it } from 'vitest';

import { aplicar } from '../src/cambios.ts';
import { crearContexto } from '../src/contexto.ts';
import { ErrorDeMotor } from '../src/errores.ts';
import { FASES, resolverTurno } from '../src/resolver.ts';
import type { IdComarca, IdJugador, IdOrden } from '../src/tipos/ids.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import { VERSION_REGLAS } from '../src/tipos/reglas.ts';
import { huella } from '../src/utiles/huella.ts';
import { estadoMini, mundoMini, tablasMini } from './mundo-mini.ts';

const JUGADOR = 'casa-uno' as IdJugador;
const COMARCA = 'prueba-llano' as IdComarca;

describe('armazon del resolutor', () => {
  it('recorre las doce fases del turno en el orden del disenyo', () => {
    expect(FASES.map(([nombre]) => nombre)).toEqual([
      'calendario',
      'produccion',
      'consumo',
      'movimiento',
      'cometidos',
      'obras',
      'mercado',
      'territorio',
      'poblacion',
      'acontecimientos',
      'prestigio',
      'cronica',
    ]);
  });

  it('avanza el turno y solo cambia lo que tocan las fases ya implementadas', () => {
    const estado = estadoMini();
    const { estado: despues } = resolverTurno(estado, [], mundoMini(), tablasMini());
    expect(despues.turno).toBe(estado.turno + 1);
    // Fuera del turno, la huella, el almacen y lo que escribe la produccion (T-031), el estado
    // tiene que ser identico: ninguna fase toca lo que no le corresponde.
    const sinVolatiles = (valor: typeof estado): unknown => ({
      ...valor,
      turno: 0,
      huellaTurnoAnterior: null,
      jugadores: Object.fromEntries(
        Object.entries(valor.jugadores).map(([id, jugador]) => [id, { ...jugador, almacen: null }]),
      ),
      comarcas: Object.fromEntries(
        Object.entries(valor.comarcas).map(([id, comarca]) => [
          id,
          { ...comarca, produccionUltimoTurno: null, agotamiento: null },
        ]),
      ),
    });
    expect(huella(sinVolatiles(despues))).toBe(huella(sinVolatiles(estado)));
  });

  it('no toca el estado que le entra', () => {
    const estado = estadoMini();
    const antes = huella(estado);
    resolverTurno(estado, [], mundoMini(), tablasMini());
    expect(huella(estado)).toBe(antes);
  });

  it('resolver dos veces el mismo turno da la misma huella y los mismos sucesos', () => {
    const mundo = mundoMini();
    const reglas = tablasMini();
    const uno = resolverTurno(estadoMini(), [], mundo, reglas);
    const otro = resolverTurno(estadoMini(), [], mundo, reglas);
    expect(uno.estado.huellaTurnoAnterior).toBe(otro.estado.huellaTurnoAnterior);
    expect(uno.sucesos).toEqual(otro.sucesos);
  });

  it('encadena la huella de un turno con la del anterior', () => {
    const mundo = mundoMini();
    const reglas = tablasMini();
    const primero = resolverTurno(estadoMini(), [], mundo, reglas);
    const segundo = resolverTurno(primero.estado, [], mundo, reglas);
    expect(primero.estado.huellaTurnoAnterior).not.toBeNull();
    expect(segundo.estado.huellaTurnoAnterior).not.toBe(primero.estado.huellaTurnoAnterior);
  });

  it('da una cronica por jugador, aunque todavia venga vacia', () => {
    const { cronicas } = resolverTurno(estadoMini(), [], mundoMini(), tablasMini());
    expect(Object.keys(cronicas)).toEqual(['casa-uno']);
    expect(cronicas['casa-uno']?.entradas).toEqual([]);
  });

  it('rechaza una partida de otra version de reglas', () => {
    const estado = { ...estadoMini(), version: VERSION_REGLAS + 1 };
    expect(() => resolverTurno(estado, [], mundoMini(), tablasMini())).toThrow(ErrorDeMotor);
    try {
      resolverTurno(estado, [], mundoMini(), tablasMini());
    } catch (error) {
      expect((error as ErrorDeMotor).codigo).toBe('version-incompatible');
    }
  });

  it('rechaza una orden de otro turno o de un jugador que no juega', () => {
    const estado = estadoMini();
    const orden = {
      id: 'orden-9' as IdOrden,
      jugador: JUGADOR,
      turnoAlta: 7,
      estado: 'pendiente',
      coste: estado.jugadores['casa-uno']?.reservado,
      turnosTotales: 1,
      turnosHechos: 0,
      motivoEspera: null,
      delMayordomo: false,
      tipo: 'roturar',
      comarca: COMARCA,
    } as unknown as Orden;
    expect(() => resolverTurno(estado, [orden], mundoMini(), tablasMini())).toThrow(
      /turno 7 y se esta resolviendo el 1/,
    );
  });
});

describe('cambios controlados del estado', () => {
  function contexto(): ReturnType<typeof crearContexto> {
    return crearContexto(estadoMini(), [], mundoMini(), tablasMini());
  }

  it('registra un suceso por cada cambio', () => {
    const ctx = contexto();
    aplicar(ctx, {
      tipo: 'recurso',
      jugador: JUGADOR,
      recurso: 'pan',
      delta: -10,
      motivo: 'prueba',
    });
    expect(ctx.estado.jugadores['casa-uno']?.almacen.pan).toBe(70);
    expect(ctx.sucesos).toHaveLength(1);
    expect(ctx.sucesos[0]?.tipo).toBe('almacen.cambio');
    expect(ctx.sucesos[0]?.datos['motivo']).toBe('prueba');
  });

  it('rechaza dejar un recurso en negativo', () => {
    const ctx = contexto();
    try {
      aplicar(ctx, {
        tipo: 'recurso',
        jugador: JUGADOR,
        recurso: 'pan',
        delta: -1000,
        motivo: 'prueba',
      });
      throw new Error('deberia haber fallado');
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorDeMotor);
      expect((error as ErrorDeMotor).codigo).toBe('invariante-rota');
      expect((error as ErrorDeMotor).message).toMatch(/no hay deudas de recursos/);
    }
    expect(ctx.estado.jugadores['casa-uno']?.almacen.pan).toBe(80);
  });

  it('rechaza gastar lo que esta reservado para una orden', () => {
    const ctx = contexto();
    aplicar(ctx, {
      tipo: 'reservado',
      jugador: JUGADOR,
      recurso: 'madera',
      delta: 50,
      motivo: 'obra',
    });
    expect(() => {
      aplicar(ctx, {
        tipo: 'recurso',
        jugador: JUGADOR,
        recurso: 'madera',
        delta: -40,
        motivo: 'gasto',
      });
    }).toThrow(/reservados para ordenes/);
  });

  it('rechaza reservar mas de lo que hay', () => {
    const ctx = contexto();
    expect(() => {
      aplicar(ctx, {
        tipo: 'reservado',
        jugador: JUGADOR,
        recurso: 'piedra',
        delta: 999,
        motivo: 'obra',
      });
    }).toThrow(/solo hay 20 en el almacen/);
  });

  it('rechaza poblacion negativa y acota la lealtad', () => {
    const ctx = contexto();
    expect(() => {
      aplicar(ctx, { tipo: 'poblacion', comarca: COMARCA, delta: -100, motivo: 'prueba' });
    }).toThrow(/se quedaria en -60 vecinos/);
    aplicar(ctx, { tipo: 'lealtad', comarca: COMARCA, delta: 50, motivo: 'prueba' });
    expect(ctx.estado.comarcas['prueba-llano']?.lealtad).toBe(100);
  });

  it('solo acumula influencia en comarcas neutrales', () => {
    const ctx = contexto();
    expect(() => {
      aplicar(ctx, {
        tipo: 'influencia',
        comarca: COMARCA,
        jugador: JUGADOR,
        delta: 5,
        motivo: 'presencia',
      });
    }).toThrow(/solo las comarcas neutrales/);
    const neutral = 'prueba-vega' as IdComarca;
    aplicar(ctx, {
      tipo: 'influencia',
      comarca: neutral,
      jugador: JUGADOR,
      delta: 5,
      motivo: 'presencia',
    });
    expect(ctx.estado.comarcas['prueba-vega']?.influencias['casa-uno']).toBe(5);
  });

  it('al incorporar una comarca se borran las influencias acumuladas', () => {
    const ctx = contexto();
    const neutral = 'prueba-vega' as IdComarca;
    aplicar(ctx, {
      tipo: 'influencia',
      comarca: neutral,
      jugador: JUGADOR,
      delta: 60,
      motivo: 'presencia',
    });
    aplicar(ctx, { tipo: 'duenyo', comarca: neutral, jugador: JUGADOR });
    expect(ctx.estado.comarcas['prueba-vega']?.duenyo).toBe('casa-uno');
    expect(ctx.estado.comarcas['prueba-vega']?.influencias).toEqual({});
  });

  it('no deja derribar mas de lo construido', () => {
    const ctx = contexto();
    expect(() => {
      aplicar(ctx, { tipo: 'edificio', comarca: COMARCA, edificio: 'granja', delta: -2 });
    }).toThrow(/No se puede derribar/);
    aplicar(ctx, { tipo: 'edificio', comarca: COMARCA, edificio: 'granja', delta: -1 });
    expect(ctx.estado.comarcas['prueba-llano']?.edificios['granja']).toBeUndefined();
  });

  it('avisa cuando el cambio habla de una entidad que no existe', () => {
    const ctx = contexto();
    try {
      aplicar(ctx, {
        tipo: 'poblacion',
        comarca: 'comarca-fantasma' as IdComarca,
        delta: 1,
        motivo: 'x',
      });
      throw new Error('deberia haber fallado');
    } catch (error) {
      expect((error as ErrorDeMotor).codigo).toBe('entidad-desconocida');
    }
  });
});
