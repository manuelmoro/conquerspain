// Cometidos de las recuas (T-034): explorar y sus hallazgos, poblar y fundar puebla, estar
// presente, portear, disolver, las paradas de una ruta y la independencia del orden.
import { describe, expect, it } from 'vitest';

import { HALLAZGOS, hallazgoDe } from '../src/reglas/explorar.ts';
import { capacidadDe, ganadorDePuebla } from '../src/reglas/poblar.ts';
import { estaPresente } from '../src/reglas/presencia.ts';
import type { EstadoComarca, EstadoJugador, EstadoPartida, Recua } from '../src/tipos/estado.ts';
import type { IdJugador } from '../src/tipos/ids.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import { azarDeTexto } from '../src/utiles/azar.ts';
import {
  DOS,
  UNO,
  base,
  c,
  de,
  escenario,
  mundo,
  ordenRuta,
  parada,
  recua,
  recursos,
  reglas,
  tipos,
  turno,
} from './recuas.ts';

function conComarca(
  estado: EstadoPartida,
  id: string,
  cambios: Partial<EstadoComarca>,
): EstadoPartida {
  const comarca = estado.comarcas[id];
  if (comarca === undefined) throw new Error(`falta ${id}`);
  return { ...estado, comarcas: { ...estado.comarcas, [id]: { ...comarca, ...cambios } } };
}

function conocimientoDe(estado: EstadoPartida, jugador: string, comarca: string) {
  return estado.jugadores[jugador]?.conocimiento[comarca];
}

function quieta(id: string, comarca: string, cambios: Partial<Recua> = {}): Recua {
  return recua(id, { situacion: { donde: 'comarca', comarca: c(comarca) }, ...cambios });
}

describe('explorar', () => {
  /** Solo se conoce la capital: el llano. */
  function sinExplorar(recuas: readonly Recua[]): EstadoPartida {
    const estado = escenario({ recuas });
    const jugador = estado.jugadores[UNO] as EstadoJugador;
    return {
      ...estado,
      jugadores: {
        [UNO]: {
          ...jugador,
          conocimiento: {
            'prueba-llano': { nivel: 'propia', turnoUltimaNoticia: 1, datos: null },
            'prueba-monte': { nivel: 'oida', turnoUltimaNoticia: 1, datos: null },
          },
        },
      },
    };
  }

  it('revela la comarca con fecha y deja las vecinas en «oida», sin rebajar las ya sabidas', () => {
    const estado = sinExplorar([
      quieta('recua-1', 'prueba-monte', { cometido: 'explorar', carga: recursos({ pan: 10 }) }),
    ]);
    const { estado: despues, sucesos } = turno(estado);
    expect(conocimientoDe(despues, UNO, 'prueba-monte')).toEqual({
      nivel: 'explorada',
      turnoUltimaNoticia: estado.turno,
      datos: {
        duenyo: null,
        poblacion: 20,
        terreno: 'ondulado',
        potenciales: estado.comarcas['prueba-monte']?.potenciales,
        edificios: {},
        preciosMil: null,
      },
    });
    expect(conocimientoDe(despues, UNO, 'prueba-sierra')).toEqual({
      nivel: 'oida',
      turnoUltimaNoticia: estado.turno,
      datos: null,
    });
    expect(conocimientoDe(despues, UNO, 'prueba-llano')?.nivel).toBe('propia');
    expect(de(despues, 'recua-1').cometido).toBeNull();
    expect(sucesos.find((s) => s.tipo === 'recua.explora')?.datos).toMatchObject({ nueva: 1 });
  });

  it('volver a explorar refresca la noticia, pero no da hallazgos ni vecinas', () => {
    const estado = escenario({
      recuas: [quieta('recua-1', 'prueba-monte', { cometido: 'explorar' })],
    });
    const { estado: despues, sucesos } = turno(estado);
    expect(conocimientoDe(despues, UNO, 'prueba-monte')?.turnoUltimaNoticia).toBe(estado.turno);
    expect(sucesos.find((s) => s.tipo === 'recua.explora')?.datos).toMatchObject({ nueva: 0 });
    expect(tipos(sucesos)).not.toContain('recua.hallazgo');
  });

  it('la comarca propia no se explora', () => {
    const estado = escenario({
      recuas: [quieta('recua-1', 'prueba-llano', { cometido: 'explorar' })],
    });
    const { estado: despues, sucesos } = turno(estado);
    expect(sucesos.find((s) => s.tipo === 'cometido.sin-efecto')?.datos).toMatchObject({
      motivo: 'comarca-propia',
    });
    expect(de(despues, 'recua-1').cometido).toBeNull();
  });

  it('una recua que aun va de camino no explora', () => {
    const estado = sinExplorar([
      recua('recua-1', { cometido: 'explorar', ruta: [c('prueba-monte')] }),
    ]);
    const { estado: despues } = turno(estado, [], {
      ...reglas,
      movimiento: { ...reglas.movimiento, pasoBaseMil: 1000 },
    });
    expect(conocimientoDe(despues, UNO, 'prueba-monte')?.nivel).toBe('oida');
    expect(de(despues, 'recua-1').cometido).toBe('explorar');
  });

  it('propiedad: 1 000 exploraciones dan hallazgos deterministas y siempre de la lista', () => {
    const estado = conComarca(escenario({ conDos: true }), 'prueba-costa', { duenyo: DOS });
    const vistos = new Map<string, number>();
    for (let i = 0; i < 1000; i += 1) {
      const id = `recua-${String(i)}`;
      const uno = hallazgoDe(estado, 7, id, c('prueba-sierra'), UNO, mundo, reglas);
      const otro = hallazgoDe(estado, 7, id, c('prueba-sierra'), UNO, mundo, reglas);
      expect(uno).toEqual(otro);
      expect(['nada', ...HALLAZGOS]).toContain(uno.tipo);
      if (uno.tipo === 'noticias') {
        expect(uno).toEqual({ tipo: 'noticias', comarca: 'prueba-costa', de: DOS });
      }
      vistos.set(uno.tipo, (vistos.get(uno.tipo) ?? 0) + 1);
    }
    // Uno de cada cinco, con la horquilla de 1 000 tiradas; la sierra de prueba no tiene aldeas.
    const algo = 1000 - (vistos.get('nada') ?? 0);
    expect(algo).toBeGreaterThan(150);
    expect(algo).toBeLessThan(250);
    expect(vistos.get('localidad') ?? 0).toBe(0);
  });
  it('las aldeas que no son cabecera pueden aparecer como hallazgo', () => {
    const sierra = mundo.comarcas['prueba-sierra'];
    if (sierra === undefined) throw new Error('falta prueba-sierra');
    const conAldea = {
      ...mundo,
      comarcas: {
        ...mundo.comarcas,
        'prueba-sierra': {
          ...sierra,
          localidades: [
            ...sierra.localidades,
            { nombre: 'Aldea Olvidada', coord: sierra.centro, cabecera: false },
          ],
        },
      },
    };
    const estado = escenario();
    const nombres = new Set<string>();
    for (let i = 0; i < 200; i += 1) {
      const hallazgo = hallazgoDe(
        estado,
        7,
        `r${String(i)}`,
        c('prueba-sierra'),
        UNO,
        conAldea,
        reglas,
      );
      if (hallazgo.tipo === 'localidad') nombres.add(hallazgo.nombre);
      expect(hallazgo.tipo).not.toBe('noticias');
    }
    expect([...nombres]).toEqual(['Aldea Olvidada']);
  });
});

describe('poblar', () => {
  it('en comarca propia nunca se pasa de la capacidad: el sobrante se queda en la recua', () => {
    expect(capacidadDe(escenario().comarcas['prueba-llano'] as EstadoComarca, reglas)).toBe(60);
    const estado = conComarca(
      escenario({
        recuas: [quieta('recua-1', 'prueba-llano', { cometido: 'poblar', vecinos: 12 })],
      }),
      'prueba-llano',
      { poblacion: 55 },
    );
    const { estado: despues } = turno(estado);
    expect(despues.comarcas['prueba-llano']?.poblacion).toBeLessThanOrEqual(60);
    expect(de(despues, 'recua-1').vecinos).toBe(7);
    expect(de(despues, 'recua-1').cometido).toBeNull();
  });

  function paraFundar(
    influencias: Record<string, number>,
    vecinos: readonly number[],
  ): EstadoPartida {
    const jugadores: IdJugador[] = [UNO, DOS];
    const recuas = vecinos.map((v, i) =>
      quieta(`recua-${String(i + 1)}`, 'prueba-vega', {
        jugador: jugadores[i] ?? UNO,
        cometido: 'poblar',
        vecinos: v,
        carga: recursos({ pan: 20 }),
      }),
    );
    return conComarca(escenario({ conDos: true, recuas }), 'prueba-vega', { influencias });
  }

  it('fundar puebla pide influencia y vecinos, y tarda dos turnos', () => {
    const poca = turno(paraFundar({ [UNO]: 39 }, [10]));
    expect(poca.sucesos.find((s) => s.tipo === 'recua.puebla-imposible')?.datos).toMatchObject({
      motivo: 'poca-influencia',
    });
    const pocos = turno(paraFundar({ [UNO]: 45 }, [9]));
    expect(pocos.sucesos.find((s) => s.tipo === 'recua.puebla-imposible')?.datos).toMatchObject({
      motivo: 'pocos-vecinos',
    });

    const primero = turno(paraFundar({ [UNO]: 45 }, [12]));
    expect(primero.estado.comarcas['prueba-vega']?.duenyo).toBeNull();
    expect(de(primero.estado, 'recua-1').turnosDeCometido).toBe(1);

    const segundo = turno(primero.estado);
    const vega = segundo.estado.comarcas['prueba-vega'];
    expect(vega).toMatchObject({
      duenyo: UNO,
      poblacion: 12,
      lealtad: 50,
      fuero: 'carta puebla',
      influencias: {},
    });
    expect(conocimientoDe(segundo.estado, UNO, 'prueba-vega')?.nivel).toBe('propia');
    expect(de(segundo.estado, 'recua-1')).toMatchObject({ vecinos: 0, cometido: null });
  });

  it('si dos fundan la misma el mismo turno, gana la influencia; el otro conserva su gente', () => {
    let estado = paraFundar({ [UNO]: 45, [DOS]: 50 }, [10, 10]);
    estado = turno(estado).estado;
    const { estado: despues, sucesos } = turno(estado);
    expect(despues.comarcas['prueba-vega']?.duenyo).toBe(DOS);
    expect(de(despues, 'recua-1')).toMatchObject({ vecinos: 10, cometido: null });
    expect(sucesos.find((s) => s.tipo === 'recua.puebla-perdida')?.datos).toMatchObject({
      ganador: DOS,
    });
  });

  it('un empate de influencia se deshace por la huella, no por quien se procesa antes', () => {
    const candidatos = [
      { jugador: UNO, influencia: 50 },
      { jugador: DOS, influencia: 50 },
    ];
    const ganador = ganadorDePuebla(candidatos, 'semilla', 9, 'prueba-vega');
    expect(ganadorDePuebla([...candidatos].reverse(), 'semilla', 9, 'prueba-vega')).toBe(ganador);
    expect([UNO, DOS]).toContain(ganador);
  });
});

describe('estar presente, portear y disolver', () => {
  it('estar presente cuesta bastimento; sin el no cuenta', () => {
    const estado = escenario({
      recuas: [
        quieta('recua-1', 'prueba-vega', { cometido: 'presencia', carga: recursos({ pan: 3 }) }),
      ],
    });
    const primero = turno(estado);
    expect(de(primero.estado, 'recua-1').carga.pan).toBe(1);
    expect(
      estaPresente(de(primero.estado, 'recua-1'), primero.estado.comarcas['prueba-vega']),
    ).toBe(true);
    const segundo = turno(primero.estado);
    expect(
      estaPresente(de(segundo.estado, 'recua-1'), segundo.estado.comarcas['prueba-vega']),
    ).toBe(false);
    expect(tipos(segundo.sucesos)).toContain('recua.sin-bastimento');
  });

  it('portear descarga todo en el almacen al llegar a casa', () => {
    const estado = escenario({
      recuas: [
        quieta('recua-1', 'prueba-llano', {
          cometido: 'portear',
          carga: recursos({ piedra: 6, maravedis: 30 }),
        }),
      ],
    });
    const { estado: despues } = turno(estado);
    expect(de(despues, 'recua-1').carga).toEqual(recursos());
    expect(despues.jugadores[UNO]?.almacen.piedra).toBe(6);
  });

  it('disolver devuelve la gente, los arrieros, la carga y la mitad de los maravedis', () => {
    const estado = escenario({
      recuas: [
        quieta('recua-1', 'prueba-llano', {
          cometido: 'disolver',
          vecinos: 3,
          carga: recursos({ sal: 2 }),
        }),
      ],
    });
    const { estado: despues, sucesos } = turno(estado);
    expect(despues.recuas['recua-1']).toBeUndefined();
    expect(despues.comarcas['prueba-llano']?.poblacion).toBeGreaterThanOrEqual(40 + 3 + 4);
    const devuelto = sucesos.find(
      (s) => s.tipo === 'almacen.cambio' && s.datos['motivo'] === 'se disuelve recua-1',
    );
    expect(devuelto?.datos).toMatchObject({ recurso: 'maravedis', delta: 10 });
    const sal = sucesos.find(
      (s) => s.tipo === 'almacen.cambio' && s.datos['motivo'] === 'descarga de recua-1',
    );
    expect(sal?.datos).toMatchObject({ recurso: 'sal', delta: 2 });
  });

  it('fuera de casa, disolver espera', () => {
    const estado = escenario({
      recuas: [quieta('recua-1', 'prueba-vega', { cometido: 'disolver' })],
    });
    const { estado: despues } = turno(estado);
    expect(de(despues, 'recua-1').cometido).toBe('disolver');
  });
});

describe('las paradas de una ruta', () => {
  it('una ruta circular se detiene en cada parada con algo que hacer y lo hace', () => {
    // Carga sal en el llano, la lleva a la vega (neutral: no se descarga) y vuelve.
    const estado = escenario({
      recuas: [recua('recua-1', { carga: recursos({ pan: 20 }) })],
    });
    const ruta: Orden = ordenRuta(
      estado.turno,
      'recua-1',
      [parada('prueba-vega', { vender: { sal: { cantidad: 2, precioMinimoMil: 1000 } } })],
      true,
    );
    let actual = turno(estado, [ruta]).estado;
    // Entra en la vega y se detiene aunque le sobre paso.
    expect(de(actual, 'recua-1')).toMatchObject({
      situacion: { donde: 'comarca', comarca: 'prueba-vega' },
      enParada: 0,
      siguienteParada: 0,
    });
    actual = turno(actual).estado;
    expect(de(actual, 'recua-1')).toMatchObject({
      situacion: { donde: 'comarca', comarca: 'prueba-llano' },
      enParada: null,
    });
  });

  it('en una parada propia carga del almacen', () => {
    const estado = escenario({
      recuas: [quieta('recua-1', 'prueba-vega', { carga: recursos({ pan: 5 }) })],
    });
    const ruta = ordenRuta(estado.turno, 'recua-1', [
      parada('prueba-llano', { cargar: { madera: 5 } }),
      'prueba-rio',
    ]);
    const { estado: despues } = turno(estado, [ruta]);
    expect(de(despues, 'recua-1')).toMatchObject({
      situacion: { donde: 'comarca', comarca: 'prueba-llano' },
      enParada: 0,
    });
    expect(de(despues, 'recua-1').carga.madera).toBe(5);
  });
});

describe('simultaneidad', () => {
  it('barajar las ordenes no cambia la huella del turno', () => {
    const estado = escenario({
      conDos: true,
      recuas: [
        quieta('recua-1', 'prueba-vega', { carga: recursos({ pan: 20 }) }),
        quieta('recua-2', 'prueba-monte', { jugador: DOS, carga: recursos({ pan: 20 }) }),
        quieta('recua-3', 'prueba-llano', { vecinos: 5 }),
      ],
    });
    const cometido = (recuaId: string, que: 'explorar' | 'poblar' | 'presencia', jugador = UNO) =>
      ({
        ...base(estado.turno),
        jugador,
        tipo: 'cometido',
        recua: recuaId,
        cometido: que,
      }) as Orden;
    const ordenes = [
      cometido('recua-1', 'presencia'),
      cometido('recua-2', 'explorar', DOS),
      cometido('recua-3', 'poblar'),
    ];
    const huella = turno(estado, ordenes).estado.huellaTurnoAnterior;
    const azar = azarDeTexto('barajar-cometidos');
    for (let i = 0; i < 5; i += 1) {
      expect(turno(estado, azar.barajar(ordenes)).estado.huellaTurnoAnterior).toBe(huella);
    }
  });
});
