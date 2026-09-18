import { describe, expect, it } from 'vitest';

import type { ErrorValidacion, Resultado } from '../src/validacion/validador.ts';
import { explicar } from '../src/validacion/validador.ts';
import { validarEstado } from '../src/validacion/validarEstado.ts';
import { validarMundo } from '../src/validacion/validarMundo.ts';
import { validarOrdenEnMundo, validarOrdenEntrante } from '../src/validacion/validarOrden.ts';
import { validarTablas } from '../src/validacion/validarTablas.ts';
import {
  con,
  dentro,
  estadoDeEjemplo,
  mundoDeEjemplo,
  ordenDeEjemplo,
  recursosCon,
  tablasDeEjemplo,
} from './ejemplos.ts';

function errores<T>(resultado: Resultado<T>): readonly ErrorValidacion[] {
  return resultado.ok ? [] : resultado.errores;
}

/** Comprueba que hay un error en esa ruta y que su mensaje dice lo que tiene que decir. */
function esperarError<T>(resultado: Resultado<T>, ruta: string, contiene: RegExp): void {
  const lista = errores(resultado);
  const encontrado = lista.find((error) => error.ruta === ruta);
  expect(encontrado, `no hay error en "${ruta}":\n${explicar(lista)}`).toBeDefined();
  expect(encontrado?.mensaje ?? '').toMatch(contiene);
}

const noEntero = 5 / 2;

describe('validacion del mundo', () => {
  it('acepta el mundo de ejemplo', () => {
    const resultado = validarMundo(mundoDeEjemplo());
    expect(explicar(errores(resultado))).toBe('');
    expect(resultado.ok).toBe(true);
  });

  it('rechaza un identificador que no coincide con su clave', () => {
    const mundo = mundoDeEjemplo();
    const resultado = validarMundo(dentro(mundo, 'comarcas', 'prueba-llano', { id: 'otra-cosa' }));
    esperarError(resultado, 'comarcas.prueba-llano.id', /no coincide con su clave/);
  });

  it('rechaza un camino hacia una comarca que no existe', () => {
    const mundo = mundoDeEjemplo();
    const resultado = validarMundo(
      con(mundo, {
        caminos: [
          {
            desde: 'prueba-llano',
            hasta: 'comarca-fantasma',
            terreno: 'llano',
            jornadasBase: 2,
            vado: false,
            puertoDeMontanya: null,
            cierraEnInvierno: false,
            canyada: null,
            calzadaRomana: false,
          },
        ],
      }),
    );
    esperarError(resultado, 'caminos.0.hasta', /no existe/);
  });

  it('rechaza una comarca sin vecinos y una vecindad que falta', () => {
    const mundo = mundoDeEjemplo();
    esperarError(
      validarMundo(
        con(mundo, { vecinos: { 'prueba-llano': [], 'prueba-sierra': ['prueba-llano'] } }),
      ),
      'vecinos.prueba-llano',
      /sin vecinos/,
    );
    esperarError(
      validarMundo(con(mundo, { vecinos: { 'prueba-llano': ['prueba-sierra'] } })),
      'vecinos.prueba-sierra',
      /falta la vecindad/,
    );
  });

  it('rechaza dos cabeceras o una cabecera que no cuadra', () => {
    const mundo = mundoDeEjemplo();
    const dos = dentro(mundo, 'comarcas', 'prueba-llano', {
      localidades: [
        { nombre: 'Llano', coord: [-2879, 41934], cabecera: true },
        { nombre: 'Otra', coord: [-2880, 41935], cabecera: true },
      ],
    });
    esperarError(validarMundo(dos), 'comarcas.prueba-llano.localidades', /exactamente una/);
  });

  it('rechaza una feria sin el rasgo de villa de feria', () => {
    const mundo = mundoDeEjemplo();
    const conFeria = dentro(mundo, 'comarcas', 'prueba-llano', {
      ferias: [
        {
          id: 'feria-prueba',
          nombre: 'Feria de prueba',
          turnos: [10],
          volumen: 'mediana',
          recursosDestacados: ['lana'],
        },
      ],
    });
    esperarError(validarMundo(conFeria), 'comarcas.prueba-llano.ferias', /villa-de-feria/);
  });

  it('rechaza coordenadas con decimales y campos que faltan', () => {
    const mundo = mundoDeEjemplo();
    esperarError(
      validarMundo(dentro(mundo, 'comarcas', 'prueba-llano', { centro: [noEntero, 41920] })),
      'comarcas.prueba-llano.centro.0',
      /entero seguro/,
    );
    const sinTerreno = dentro(mundo, 'comarcas', 'prueba-llano', {});
    const comarcas = { ...(sinTerreno['comarcas'] as Record<string, Record<string, unknown>>) };
    const llano = { ...comarcas['prueba-llano'] };
    delete llano['terreno'];
    comarcas['prueba-llano'] = llano;
    esperarError(
      validarMundo({ ...sinTerreno, comarcas }),
      'comarcas.prueba-llano.terreno',
      /falta este campo/,
    );
  });
});

describe('validacion de ordenes', () => {
  it('acepta una orden bien formada', () => {
    const resultado = validarOrdenEntrante(ordenDeEjemplo());
    expect(explicar(errores(resultado))).toBe('');
  });

  it('rechaza un campo de mas, aunque parezca inofensivo', () => {
    const resultado = validarOrdenEntrante(con(ordenDeEjemplo(), { prestigioExtra: 1000 }));
    esperarError(resultado, 'prestigioExtra', /campo desconocido/);
  });

  it('rechaza un tipo de orden que no existe', () => {
    const resultado = validarOrdenEntrante(con(ordenDeEjemplo(), { tipo: 'invocar-dragon' }));
    esperarError(resultado, 'tipo', /no es un tipo admitido/);
  });

  it('rechaza un edificio que no esta en el catalogo', () => {
    const resultado = validarOrdenEntrante(con(ordenDeEjemplo(), { edificio: 'central-nuclear' }));
    esperarError(resultado, 'edificio', /no es un valor admitido/);
  });

  it('rechaza costes negativos o con decimales', () => {
    esperarError(
      validarOrdenEntrante(con(ordenDeEjemplo(), { coste: recursosCon({ madera: -5 }) })),
      'coste.madera',
      /menor que el minimo/,
    );
    esperarError(
      validarOrdenEntrante(con(ordenDeEjemplo(), { coste: recursosCon({ madera: noEntero }) })),
      'coste.madera',
      /entero seguro/,
    );
  });

  it('rechaza una orden que lleva mas turnos hechos que totales', () => {
    const resultado = validarOrdenEntrante(
      con(ordenDeEjemplo(), { turnosTotales: 2, turnosHechos: 3 }),
    );
    esperarError(resultado, 'turnosHechos', /turnos hechos/);
  });

  it('rechaza una ruta sin recua ni rebanyo', () => {
    const ruta = con(ordenDeEjemplo(), {
      tipo: 'ruta',
      recua: null,
      rebanyo: null,
      circular: false,
      paradas: [{ comarca: 'prueba-llano', cargar: {}, descargar: {}, vender: {}, comprar: {} }],
    });
    const sinEdificio = { ...ruta };
    delete sinEdificio['edificio'];
    delete sinEdificio['comarca'];
    esperarError(validarOrdenEntrante(sinEdificio), 'recua', /recua o de un rebanyo/);
  });

  it('rechaza una orden que cita una comarca inexistente en el mundo', () => {
    const mundo = validarMundo(mundoDeEjemplo());
    expect(mundo.ok).toBe(true);
    const orden = validarOrdenEntrante(con(ordenDeEjemplo(), { comarca: 'comarca-fantasma' }));
    expect(orden.ok).toBe(true);
    if (!orden.ok || !mundo.ok) return;
    const resultado = validarOrdenEnMundo(orden.valor, mundo.valor);
    esperarError(resultado, 'comarca', /no existe en este mundo/);
  });
});

describe('validacion del estado', () => {
  it('acepta el estado de ejemplo', () => {
    const resultado = validarEstado(estadoDeEjemplo());
    expect(explicar(errores(resultado))).toBe('');
  });

  it('rechaza una version de reglas distinta y pide migracion', () => {
    const resultado = validarEstado(con(estadoDeEjemplo(), { version: 99 }));
    esperarError(resultado, 'version', /migrarla antes de resolver/);
  });

  it('rechaza reservar mas de lo que hay en el almacen', () => {
    const estado = dentro(estadoDeEjemplo(), 'jugadores', 'mesta', {
      reservado: recursosCon({ pan: 500 }),
    });
    esperarError(resultado_(estado), 'jugadores.mesta.reservado.pan', /solo 80 en el almacen/);
  });

  it('rechaza una capital que no existe', () => {
    const estado = dentro(estadoDeEjemplo(), 'jugadores', 'mesta', { capital: 'comarca-fantasma' });
    esperarError(resultado_(estado), 'jugadores.mesta.capital', /no existe en la partida/);
  });

  it('rechaza influencias en una comarca con duenyo', () => {
    const estado = dentro(estadoDeEjemplo(), 'comarcas', 'prueba-llano', {
      influencias: { mesta: 40 },
    });
    esperarError(resultado_(estado), 'comarcas.prueba-llano.influencias', /solo las neutrales/);
  });

  it('rechaza una influencia de un jugador que no existe', () => {
    const estado = dentro(estadoDeEjemplo(), 'comarcas', 'prueba-sierra', {
      influencias: { fantasma: 40 },
    });
    esperarError(
      resultado_(estado),
      'comarcas.prueba-sierra.influencias.fantasma',
      /no existe en la partida/,
    );
  });

  it('rechaza lealtad fuera de rango y poblacion con decimales', () => {
    esperarError(
      resultado_(dentro(estadoDeEjemplo(), 'comarcas', 'prueba-llano', { lealtad: 120 })),
      'comarcas.prueba-llano.lealtad',
      /mayor que el maximo/,
    );
    esperarError(
      resultado_(dentro(estadoDeEjemplo(), 'comarcas', 'prueba-llano', { poblacion: noEntero })),
      'comarcas.prueba-llano.poblacion',
      /entero seguro/,
    );
  });

  it('rechaza una comarca que no existe en el mundo de la partida', () => {
    const mundo = validarMundo(mundoDeEjemplo());
    if (!mundo.ok) throw new Error('el mundo de ejemplo deberia valer');
    const estado = estadoDeEjemplo();
    const comarcas = { ...(estado['comarcas'] as Record<string, unknown>) };
    comarcas['comarca-inventada'] = {
      ...(comarcas['prueba-sierra'] as Record<string, unknown>),
      id: 'comarca-inventada',
    };
    const resultado = validarEstado({ ...estado, comarcas }, mundo.valor);
    esperarError(resultado, 'comarcas.comarca-inventada', /no existe en el mundo/);
  });

  it('rechaza una orden guardada de un turno futuro', () => {
    const estado = con(estadoDeEjemplo(), {
      ordenes: [{ ...ordenDeEjemplo(), turnoAlta: 9 }],
    });
    esperarError(resultado_(estado), 'ordenes.0.turnoAlta', /la partida va por el 1/);
  });

  it('acumula todos los errores de forma en una sola pasada', () => {
    const conJugadorMalo = dentro(estadoDeEjemplo(), 'jugadores', 'mesta', { credito: 500 });
    const estado = dentro(conJugadorMalo, 'comarcas', 'prueba-llano', { lealtad: 120 });
    const lista = errores(resultado_(estado));
    expect(lista.length).toBeGreaterThanOrEqual(2);
    expect(lista.map((error) => error.ruta)).toContain('jugadores.mesta.credito');
    expect(lista.map((error) => error.ruta)).toContain('comarcas.prueba-llano.lealtad');
  });

  it('acumula tambien los errores de coherencia', () => {
    const conCapitalMala = dentro(estadoDeEjemplo(), 'jugadores', 'mesta', {
      capital: 'comarca-fantasma',
    });
    const estado = dentro(conCapitalMala, 'comarcas', 'prueba-sierra', {
      influencias: { fantasma: 10 },
    });
    const lista = errores(resultado_(estado));
    expect(lista.length).toBeGreaterThanOrEqual(2);
  });
});

function resultado_(estado: unknown): Resultado<unknown> {
  return validarEstado(estado);
}

describe('validacion de las tablas de reglas', () => {
  it('acepta las tablas de ejemplo', () => {
    const resultado = validarTablas(tablasDeEjemplo());
    expect(explicar(errores(resultado))).toBe('');
  });

  it('rechaza una version que no es la del motor', () => {
    esperarError(validarTablas(con(tablasDeEjemplo(), { version: 42 })), 'version', /version 42/);
  });

  it('rechaza un calendario que no cuadra con el anyo', () => {
    const tablas = tablasDeEjemplo();
    const estaciones = { ...(tablas['estaciones'] as Record<string, unknown>), turnosPorAnyo: 12 };
    esperarError(
      validarTablas({ ...tablas, estaciones }),
      'estaciones.estacionPorTurno',
      /el anyo tiene 12/,
    );
  });

  it('rechaza una tradicion cuyo identificador no empieza por su casa', () => {
    const tablas = tablasDeEjemplo();
    const tradiciones = tablas['tradiciones'] as Record<string, unknown>;
    esperarError(
      validarTablas({
        ...tablas,
        tradiciones: { 'ferrones-lanas-finas': tradiciones['mesta-lanas-finas'] },
      }),
      'tradiciones.ferrones-lanas-finas',
      /casa "mesta"/,
    );
  });

  it('rechaza un suelo de precios por encima del techo', () => {
    const tablas = tablasDeEjemplo();
    const mercado = { ...(tablas['mercado'] as Record<string, unknown>), sueloMil: 3000 };
    esperarError(validarTablas({ ...tablas, mercado }), 'mercado.sueloMil', /por debajo del techo/);
  });

  it('rechaza un recurso que falta en la tabla', () => {
    const tablas = tablasDeEjemplo();
    const recursos = { ...(tablas['recursos'] as Record<string, unknown>) };
    delete recursos['sal'];
    esperarError(validarTablas({ ...tablas, recursos }), 'recursos.sal', /falta este campo/);
  });
});
