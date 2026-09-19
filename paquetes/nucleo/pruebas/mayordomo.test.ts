// Jugar sin estar (T-045): colas de obra y de recua, rutas permanentes con precio limite y
// bastimento, el mayordomo con sus limites y su orden, el plan de temporada y lo que la cronica
// marca como automatico.
import { describe, expect, it } from 'vitest';

import { costeDeEdificio } from '../src/reglas/casas/costes.ts';
import { componerCronica } from '../src/reglas/cronica.ts';
import { cumple, limiteDeReglas, reglasActivas } from '../src/reglas/mayordomo.ts';
import type { SituacionDelMayordomo } from '../src/reglas/mayordomo.ts';
import { estadoEstacionalDe } from '../src/reglas/calendario.ts';
import { MODIFICADORES_NEUTROS } from '../src/datos/casas.ts';
import type { Suceso } from '../src/tipos/cronica.ts';
import type { EstadoJugador, EstadoPartida, Rebanyo } from '../src/tipos/estado.ts';
import type { IdFeria, IdMercado, IdOrden, IdRebanyo, IdRecua } from '../src/tipos/ids.ts';
import type { Mundo } from '../src/tipos/mundo.ts';
import type {
  AccionDeMayordomo,
  CondicionDeMayordomo,
  Orden,
  ReglaDeMayordomo,
} from '../src/tipos/ordenes.ts';
import type { TipoEdificio } from '../src/tipos/reglas.ts';
import { validarEstado } from '../src/validacion/validarEstado.ts';
import {
  INVIERNO,
  PRIMAVERA,
  UNO,
  base,
  c,
  conComarca,
  de,
  escenario,
  mundo,
  ordenRuta,
  parada,
  recua,
  recursos,
  reglas,
  turno,
} from './recuas.ts';

// ——— Utiles ———————————————————————————————————————————————————————————————————

function jugadorDe(estado: EstadoPartida): EstadoJugador {
  const jugador = estado.jugadores[UNO];
  if (jugador === undefined) throw new Error('falta el jugador');
  return jugador;
}

function conJugador(estado: EstadoPartida, cambios: Partial<EstadoJugador>): EstadoPartida {
  return {
    ...estado,
    jugadores: { ...estado.jugadores, [UNO]: { ...jugadorDe(estado), ...cambios } },
  };
}

function sucesos(lista: readonly Suceso[], tipo: string): Suceso[] {
  return lista.filter((s) => s.tipo === tipo);
}

function estadosDe(lista: readonly Suceso[], orden: string): string[] {
  return sucesos(lista, 'orden.estado')
    .filter((s) => s.datos['orden'] === orden)
    .map(
      (s) =>
        `${String(s.datos['estado'])}${s.datos['motivo'] === '' ? '' : `:${String(s.datos['motivo'])}`}`,
    );
}

function ordenDe(estado: EstadoPartida, id: string): Orden | undefined {
  return estado.ordenes.find((o) => o.id === id);
}

/** Una orden de construir con el coste que le pondria el servidor. */
function construir(
  estado: EstadoPartida,
  edificio: TipoEdificio,
  cambios: Partial<Orden> = {},
): Orden {
  return {
    ...base(estado.turno, costeDeEdificio(edificio, MODIFICADORES_NEUTROS, reglas)),
    tipo: 'construir',
    comarca: c('prueba-llano'),
    edificio,
    ...cambios,
  } as Orden;
}

const COLA_DEL_LLANO = 'comarca:prueba-llano';

/** Avanza turnos sin ordenes nuevas, juntando los sucesos. */
function avanzar(estado: EstadoPartida, turnos: number, elMundo: Mundo = mundo) {
  let actual = estado;
  const todos: Suceso[] = [];
  for (let i = 0; i < turnos; i += 1) {
    const resultado = turno(actual, [], reglas, elMundo);
    actual = resultado.estado;
    todos.push(...resultado.sucesos);
  }
  return { estado: actual, sucesos: todos };
}

// ——— Colas ———————————————————————————————————————————————————————————————————

describe('la cola de obras de una comarca', () => {
  // Con 30 vecinos el llano tiene una sola cuadrilla: 1 + 30 / 40.
  const rico = () =>
    conComarca(
      escenario({ almacen: { madera: 400, piedra: 400, maravedis: 900 } }),
      'prueba-llano',
      {
        poblacion: 30,
      },
    );

  it('no reserva nada, empieza por orden cuando hay cuadrilla y explica por qué espera', () => {
    const estado = rico();
    const primera = construir(estado, 'granja', { cola: COLA_DEL_LLANO });
    const segunda = construir(estado, 'huerta', { cola: COLA_DEL_LLANO });
    const primero = turno(estado, [primera, segunda]);
    // La primera empieza; la segunda espera su cuadrilla, sin reservar nada.
    expect(estadosDe(primero.sucesos, primera.id)).toEqual(['terminada']);
    expect(estadosDe(primero.sucesos, segunda.id)).toEqual(['en cola:sin-cuadrilla']);
    expect(jugadorDe(primero.estado).reservado).toEqual(recursos());
    expect(jugadorDe(primero.estado).colas).toEqual({ [COLA_DEL_LLANO]: [segunda.id] });
    expect(sucesos(primero.sucesos, 'cola.empieza').map((s) => s.datos['orden'])).toEqual([
      primera.id,
    ]);
    // Al terminar la primera obra, sale la segunda sola.
    const despues = avanzar(primero.estado, 6);
    expect(estadosDe(despues.sucesos, segunda.id)).toContain('terminada');
    expect(jugadorDe(despues.estado).colas).toEqual({});
  });

  it('empieza la siguiente que cumpla requisitos: la que no se puede pagar se salta y espera', () => {
    const estado = escenario({ almacen: { madera: 10, piedra: 0, maravedis: 100 } });
    const cara = construir(estado, 'molino', { cola: COLA_DEL_LLANO });
    const barata = construir(estado, 'huerta', { cola: COLA_DEL_LLANO });
    const coste = costeDeEdificio('huerta', MODIFICADORES_NEUTROS, reglas);
    expect(coste.madera).toBeLessThanOrEqual(10);
    const resultado = turno(estado, [cara, barata]);
    expect(estadosDe(resultado.sucesos, cara.id)).toEqual(['en cola:sin-recursos']);
    expect(estadosDe(resultado.sucesos, barata.id)).toEqual(['terminada']);
  });

  it('se puede reordenar: la orden `cola` cambia quién va primero', () => {
    const estado = rico();
    const cuadrillaOcupada = construir(estado, 'granero');
    const a = construir(estado, 'granja', { cola: COLA_DEL_LLANO });
    const b = construir(estado, 'huerta', { cola: COLA_DEL_LLANO });
    const primero = turno(estado, [cuadrillaOcupada, a, b]);
    expect(jugadorDe(primero.estado).colas[COLA_DEL_LLANO]).toEqual([a.id, b.id]);
    const reordenar: Orden = {
      ...base(primero.estado.turno),
      tipo: 'cola',
      clave: COLA_DEL_LLANO,
      orden: [b.id, a.id],
    };
    const segundo = turno(primero.estado, [reordenar]);
    expect(jugadorDe(segundo.estado).colas[COLA_DEL_LLANO]).toEqual([b.id, a.id]);
    // Una lista que no es la de la cola se rechaza.
    const mala: Orden = {
      ...reordenar,
      id: 'orden-mala' as IdOrden,
      turnoAlta: segundo.estado.turno,
      orden: [a.id],
    };
    expect(estadosDe(turno(segundo.estado, [mala]).sucesos, mala.id)).toEqual([
      'cancelada:cola-distinta',
    ]);
  });

  it('una orden en una cola que no le corresponde se cancela', () => {
    const estado = rico();
    const mal = construir(estado, 'granja', { cola: 'recua:recua-1' });
    expect(estadosDe(turno(estado, [mal]).sucesos, mal.id)).toEqual(['cancelada:cola-no-admitida']);
  });
});

describe('la cola de una recua', () => {
  it('va de una en una: la segunda espera a que la recua llegue y termine', () => {
    const estado = escenario({ recuas: [recua('recua-1')] });
    const cola = 'recua:recua-1';
    const ir: Orden = { ...ordenRuta(estado.turno, 'recua-1', ['prueba-vega']), cola };
    const explorar: Orden = {
      ...base(estado.turno),
      tipo: 'cometido',
      recua: 'recua-1' as IdRecua,
      cometido: 'explorar',
      cola,
    };
    const volver: Orden = { ...ordenRuta(estado.turno, 'recua-1', ['prueba-llano']), cola };
    const primero = turno(estado, [ir, explorar, volver]);
    expect(estadosDe(primero.sucesos, ir.id)).toEqual(['terminada']);
    // Sale la ruta; el cometido espera a que la recua llegue, y la vuelta, detras de el.
    expect(estadosDe(primero.sucesos, explorar.id)).toEqual(['en cola:recua-ocupada']);
    expect(estadosDe(primero.sucesos, volver.id)).toEqual(['en cola:detras-en-la-cola']);
    const despues = avanzar(primero.estado, 10);
    const orden = [explorar.id, volver.id].map((id) =>
      despues.sucesos.findIndex(
        (s) =>
          s.tipo === 'orden.estado' && s.datos['orden'] === id && s.datos['estado'] === 'terminada',
      ),
    );
    expect(orden[0]).toBeGreaterThanOrEqual(0);
    expect(orden[1]).toBeGreaterThan(orden[0] ?? 0);
  });
});

// ——— Rutas permanentes ———————————————————————————————————————————————————————

/** El mundo mini con una feria en la vega abierta todo el anyo. */
function mundoConFeria(): Mundo {
  const vega = mundo.comarcas['prueba-vega'];
  if (vega === undefined) throw new Error('el mundo mini ha cambiado');
  return {
    ...mundo,
    comarcas: {
      ...mundo.comarcas,
      'prueba-vega': {
        ...vega,
        ferias: [
          {
            id: 'prueba' as IdFeria,
            nombre: 'Feria de Prueba',
            turnos: Array.from({ length: 24 }, (_, i) => i + 1),
            volumen: 'grande',
            recursosDestacados: [],
          },
        ],
      },
    },
  };
}

describe('una ruta circular con precios límite', () => {
  const conFeria = mundoConFeria();
  const circuito = (precioMinimoMil: number) => (estado: EstadoPartida) =>
    ordenRuta(
      estado.turno,
      'recua-1',
      [
        parada('prueba-vega', { vender: { lana: { cantidad: 5, precioMinimoMil } } }),
        'prueba-llano',
      ],
      true,
    );

  it('vende cuando el precio se cumple y sigue dando vueltas', () => {
    const estado = escenario({
      almacen: { sal: 500 },
      recuas: [recua('recua-1', { porte: 100, carga: recursos({ lana: 40 }) })],
    });
    const { estado: despues, sucesos: todos } = (() => {
      const primero = turno(estado, [circuito(30_000)(estado)], reglas, conFeria);
      const resto = avanzar(primero.estado, 8, conFeria);
      return { estado: resto.estado, sucesos: [...primero.sucesos, ...resto.sucesos] };
    })();
    expect(sucesos(todos, 'mercado.trato').length).toBeGreaterThanOrEqual(2);
    expect(sucesos(todos, 'recua.ruta-detenida')).toEqual([]);
    expect(de(despues, 'recua-1').rutaCircular).toBe(true);
  });

  it('tras tres paradas seguidas sin cumplir el precio, se detiene y lo dice', () => {
    const estado = escenario({
      almacen: { sal: 500 },
      recuas: [recua('recua-1', { porte: 100, carga: recursos({ lana: 40 }) })],
    });
    const primero = turno(estado, [circuito(900_000)(estado)], reglas, conFeria);
    const resto = avanzar(primero.estado, 20, conFeria);
    const todos = [...primero.sucesos, ...resto.sucesos];
    const [detenida] = sucesos(todos, 'recua.ruta-detenida');
    expect(detenida?.datos).toEqual({ recua: 'recua-1', motivo: 'precio-limite' });
    const fallos = sucesos(todos, 'mercado.sin-casar').filter(
      (s) =>
        s.datos['motivo'] === 'precio-limite' &&
        todos.indexOf(s) < todos.indexOf(detenida as Suceso),
    );
    expect(fallos).toHaveLength(reglas.mayordomo.fallosDePrecioParaParar);
    expect(de(resto.estado, 'recua-1').rutaCircular).toBe(false);
    expect(de(resto.estado, 'recua-1').carga.lana).toBe(40);
  });

  it('repone el bastimento del almacén al pasar por comarca propia', () => {
    const sinPan = escenario({
      almacen: { sal: 500 },
      recuas: [recua('recua-1', { porte: 100, carga: recursos({ lana: 40 }) })],
    });
    const primero = turno(sinPan, [circuito(30_000)(sinPan)], reglas, conFeria);
    const resto = avanzar(primero.estado, 10, conFeria);
    expect(sucesos([...primero.sucesos, ...resto.sucesos], 'recua.sin-bastimento')).toEqual([]);
    expect(de(resto.estado, 'recua-1').rutaCircular).toBe(true);
    expect(de(resto.estado, 'recua-1').carga.pan).toBeGreaterThan(0);
  });

  it('sin bastimento ni comarca propia en el camino, se detiene y lo dice', () => {
    const estado = conComarca(
      escenario({
        almacen: { pan: 0 },
        recuas: [recua('recua-1', { situacion: { donde: 'comarca', comarca: c('prueba-vega') } })],
      }),
      'prueba-llano',
      { duenyo: null },
    );
    const lejos = ordenRuta(estado.turno, 'recua-1', ['prueba-monte', 'prueba-vega'], true);
    const resultado = turno(estado, [lejos]);
    expect(sucesos(resultado.sucesos, 'recua.ruta-detenida').map((s) => s.datos['motivo'])).toEqual(
      ['sin-bastimento'],
    );
  });
});

// ——— El mayordomo ————————————————————————————————————————————————————————————

const reglaDe = (
  prioridad: number,
  condicion: CondicionDeMayordomo,
  accion: AccionDeMayordomo,
): ReglaDeMayordomo => ({ prioridad, condicion, accion });

const aLigera: AccionDeMayordomo = {
  tipo: 'carga-fiscal',
  comarca: c('prueba-llano'),
  carga: 'ligera',
};

function darRegla(
  estado: EstadoPartida,
  regla: ReglaDeMayordomo | null,
  baja: number | null = null,
): Orden {
  return { ...base(estado.turno), tipo: 'mayordomo', alta: regla, bajaPrioridad: baja };
}

describe('el mayordomo', () => {
  it('atiende tres reglas, una más por nivel de mercado en la capital, y nunca más de seis', () => {
    const estado = escenario();
    expect(limiteDeReglas(jugadorDe(estado), estado, reglas)).toBe(3);
    const conMercado = conComarca(estado, 'prueba-llano', { edificios: { granja: 1, mercado: 2 } });
    expect(limiteDeReglas(jugadorDe(conMercado), conMercado, reglas)).toBe(5);
    const muchoMercado = conComarca(estado, 'prueba-llano', {
      edificios: { granja: 1, mercado: 9 },
    });
    expect(limiteDeReglas(jugadorDe(muchoMercado), muchoMercado, reglas)).toBe(6);
    // Con seis reglas, las de mayor prioridad duermen hasta que haya sitio.
    const seis = Array.from({ length: 6 }, (_, i) => reglaDe(i + 1, { tipo: 'escasez' }, aLigera));
    const lleno = conJugador(estado, { mayordomo: seis });
    expect(reglasActivas(jugadorDe(lleno), lleno, reglas).map((r) => r.prioridad)).toEqual([
      1, 2, 3,
    ]);
    // Una septima no cabe.
    const septima = darRegla(lleno, reglaDe(7, { tipo: 'escasez' }, aLigera));
    expect(estadosDe(turno(lleno, [septima]).sucesos, septima.id)).toEqual([
      'cancelada:mayordomo-lleno',
    ]);
  });

  it('las reglas se dan de alta, se cambian por su prioridad y se dan de baja', () => {
    const estado = escenario();
    const alta = turno(estado, [darRegla(estado, reglaDe(2, { tipo: 'escasez' }, aLigera))]).estado;
    expect(jugadorDe(alta).mayordomo.map((r) => r.prioridad)).toEqual([2]);
    const otra = reglaDe(2, { tipo: 'pan-disponible-menor-que', cantidad: 5 }, aLigera);
    const cambiada = turno(alta, [darRegla(alta, otra)]).estado;
    expect(jugadorDe(cambiada).mayordomo).toEqual([otra]);
    const baja = turno(cambiada, [darRegla(cambiada, null, 2)]).estado;
    expect(jugadorDe(baja).mayordomo).toEqual([]);
    const nada = darRegla(baja, null, 9);
    expect(estadosDe(turno(baja, [nada]).sucesos, nada.id)).toEqual([
      'cancelada:regla-desconocida',
    ]);
  });

  it('evalúa en el orden declarado, no en el de alta, y siempre igual', () => {
    const aRio: AccionDeMayordomo = {
      tipo: 'enviar-recua',
      recua: 'recua-1' as IdRecua,
      comarca: c('prueba-rio'),
    };
    const aVega: AccionDeMayordomo = {
      tipo: 'enviar-recua',
      recua: 'recua-2' as IdRecua,
      comarca: c('prueba-vega'),
    };
    const reglasDe = [
      reglaDe(5, { tipo: 'escasez' }, aRio),
      reglaDe(1, { tipo: 'escasez' }, aVega),
    ];
    const estado = conJugador(escenario({ recuas: [recua('recua-1'), recua('recua-2')] }), {
      escasez: true,
      mayordomo: [...reglasDe].sort((a, b) => a.prioridad - b.prioridad),
    });
    const uno = turno(estado);
    const ordenadas = sucesos(uno.sucesos, 'mayordomo.ordena').map((s) => s.datos['prioridad']);
    expect(ordenadas).toEqual([1, 5]);
    expect(turno(estado).sucesos).toEqual(uno.sucesos);
  });

  it('solo actúa si la condición se cumple, y no repite lo que ya está en marcha', () => {
    const regla = reglaDe(1, { tipo: 'escasez' }, aLigera);
    const tranquilo = conJugador(escenario(), { mayordomo: [regla] });
    expect(sucesos(turno(tranquilo).sucesos, 'mayordomo.ordena')).toEqual([]);
    const conHambre = conJugador(tranquilo, { escasez: true });
    const primero = turno(conHambre);
    expect(sucesos(primero.sucesos, 'mayordomo.ordena')).toHaveLength(1);
    expect(primero.estado.comarcas['prueba-llano']?.cargaFiscal).toBe('ligera');
    // Ya esta ligera: con la misma condicion, no vuelve a ordenarlo.
    const segundo = turno(conJugador(primero.estado, { escasez: true }));
    expect(sucesos(segundo.sucesos, 'mayordomo.ordena')).toEqual([]);
  });

  it('no se salta ninguna validación: lo que el jugador no podría, el mayordomo tampoco', () => {
    // A una comarca que no conoce, la recua no sale.
    const aLoDesconocido = reglaDe(
      1,
      { tipo: 'escasez' },
      {
        tipo: 'enviar-recua',
        recua: 'recua-1' as IdRecua,
        comarca: c('prueba-mina'),
      },
    );
    const estado = conJugador(escenario({ recuas: [recua('recua-1')] }), {
      escasez: true,
      mayordomo: [aLoDesconocido],
      conocimiento: { 'prueba-llano': { nivel: 'propia', turnoUltimaNoticia: 1, datos: null } },
    });
    const resultado = turno(estado);
    const [ordenada] = sucesos(resultado.sucesos, 'mayordomo.ordena');
    expect(estadosDe(resultado.sucesos, String(ordenada?.datos['orden']))).toEqual([
      'en espera:destino-desconocido',
    ]);
    // Una carga dura, a unos monjes, se la cancela su propia casa.
    const dura = reglaDe(1, { tipo: 'escasez' }, { ...aLigera, carga: 'dura' });
    const monjes = conJugador(escenario(), { casa: 'monjes', escasez: true, mayordomo: [dura] });
    const real = {
      ...reglas,
      casas: {
        ...reglas.casas,
        monjes: {
          ...reglas.casas.monjes,
          prohibiciones: { ...reglas.casas.monjes.prohibiciones, cargaFiscalDura: true },
        },
      },
    };
    const cancelada = turno(monjes, [], real);
    const id = String(sucesos(cancelada.sucesos, 'mayordomo.ordena')[0]?.datos['orden']);
    expect(estadosDe(cancelada.sucesos, id)).toEqual(['cancelada:prohibido-por-la-casa']);
  });

  it('su obra queda marcada en la crónica', () => {
    const aLoDesconocido = reglaDe(
      1,
      { tipo: 'escasez' },
      {
        tipo: 'enviar-recua',
        recua: 'recua-1' as IdRecua,
        comarca: c('prueba-mina'),
      },
    );
    const estado = conJugador(escenario({ recuas: [recua('recua-1')] }), {
      escasez: true,
      mayordomo: [aLoDesconocido],
      conocimiento: { 'prueba-llano': { nivel: 'propia', turnoUltimaNoticia: 1, datos: null } },
    });
    const resultado = turno(estado);
    const cronica = componerCronica(UNO, {
      estado: resultado.estado,
      sucesos: resultado.sucesos,
      turno: estado.turno,
      mundo,
      reglas,
    });
    const textos = cronica.entradas.map((e) => e.texto);
    expect(textos).toContain('El mayordomo da una orden de ruta, por su regla 1.');
    expect(textos).toContain(
      'Por orden del mayordomo: la orden de ruta espera: nadie sabe llegar a ese destino.',
    );
  });
});

describe('las condiciones del mayordomo', () => {
  const situacion = (estado: EstadoPartida, turnoDe = estado.turno): SituacionDelMayordomo => ({
    estado,
    jugador: jugadorDe(estado),
    mundo,
    reglas,
    turno: turnoDe,
    estacional: estadoEstacionalDe(turnoDe, mundo, reglas),
  });
  const se = (condicion: CondicionDeMayordomo, estado: EstadoPartida, turnoDe?: number) =>
    cumple(condicion, situacion(estado, turnoDe));

  it('pan disponible y recurso almacenado miran el almacén, restando lo reservado', () => {
    const estado = escenario({ almacen: { pan: 50, lana: 31 } });
    expect(se({ tipo: 'pan-disponible-menor-que', cantidad: 50 }, estado)).toBe(false);
    const reservado = conJugador(estado, { reservado: recursos({ pan: 1 }) });
    expect(se({ tipo: 'pan-disponible-menor-que', cantidad: 50 }, reservado)).toBe(true);
    expect(
      se({ tipo: 'recurso-almacenado-mayor-que', recurso: 'lana', cantidad: 30 }, estado),
    ).toBe(true);
    expect(
      se({ tipo: 'recurso-almacenado-mayor-que', recurso: 'lana', cantidad: 31 }, estado),
    ).toBe(false);
  });

  it('los precios son los que sabe el jugador; si no sabe, no se cumple', () => {
    const plaza = 'feria-prueba' as IdMercado;
    const sinSaber = escenario();
    const precio = (
      tipo: 'precio-en-plaza-menor-que' | 'precio-en-plaza-mayor-que',
      precioMil: number,
    ) => ({ tipo, plaza, recurso: 'lana', precioMil }) as const;
    expect(se(precio('precio-en-plaza-mayor-que', 1), sinSaber)).toBe(false);
    const sabiendo = conJugador(sinSaber, {
      plazas: {
        [plaza]: {
          turno: 3,
          fuente: 'rumor',
          preciosMil: recursos({ lana: 50_000 }),
          visitada: false,
        },
      },
    });
    expect(se(precio('precio-en-plaza-mayor-que', 49_999), sabiendo)).toBe(true);
    expect(se(precio('precio-en-plaza-menor-que', 50_000), sabiendo)).toBe(false);
    expect(se(precio('precio-en-plaza-menor-que', 50_001), sabiendo)).toBe(true);
  });

  it('obra terminada: la comarca propia no tiene obra en marcha', () => {
    const libre = escenario();
    expect(se({ tipo: 'obra-terminada-en', comarca: c('prueba-llano') }, libre)).toBe(true);
    expect(se({ tipo: 'obra-terminada-en', comarca: c('prueba-vega') }, libre)).toBe(false);
    const ocupada = turno(escenario({ almacen: { madera: 400, maravedis: 900 } }), [
      construir(escenario(), 'granja'),
    ]).estado;
    expect(se({ tipo: 'obra-terminada-en', comarca: c('prueba-llano') }, ocupada)).toBe(false);
  });

  it('escasez, estación que empieza y rebaño sin pasto', () => {
    expect(se({ tipo: 'escasez' }, escenario())).toBe(false);
    expect(se({ tipo: 'escasez' }, conJugador(escenario(), { escasez: true }))).toBe(true);
    const estado = escenario();
    const primeroDeInvierno = reglas.estaciones.estacionPorTurno.indexOf('invierno') + 1;
    expect(se({ tipo: 'estacion-empieza', estacion: 'invierno' }, estado, INVIERNO)).toBe(
      INVIERNO === primeroDeInvierno,
    );
    const primeraDePrimavera = reglas.estaciones.estacionPorTurno.indexOf('primavera') + 1;
    expect(
      se({ tipo: 'estacion-empieza', estacion: 'primavera' }, estado, primeraDePrimavera),
    ).toBe(true);
    expect(
      se({ tipo: 'estacion-empieza', estacion: 'primavera' }, estado, primeraDePrimavera + 1),
    ).toBe(false);
    const rebanyo: Rebanyo = {
      id: 'rebanyo-1' as IdRebanyo,
      jugador: UNO,
      nombre: 'Rebaño de prueba',
      situacion: { donde: 'comarca', comarca: c('prueba-llano') },
      ruta: [],
      cabezas: 1000,
      pastoDelAnyoMil: 0,
      turnosSinPasto: 0,
    };
    const conRebanyo = { ...estado, rebanyos: { [rebanyo.id]: rebanyo } };
    expect(se({ tipo: 'rebanyo-sin-pasto' }, conRebanyo, PRIMAVERA)).toBe(true);
  });
});

// ——— El plan de temporada —————————————————————————————————————————————————————

describe('el plan de temporada', () => {
  it('guarda la orden sin reservar hasta su turno, y entonces entra y se cumple', () => {
    const estado = escenario({ almacen: { madera: 400, maravedis: 900 } });
    const plan = construir(estado, 'granja', { turnoProgramado: estado.turno + 3 });
    const primero = turno(estado, [plan]);
    expect(ordenDe(primero.estado, plan.id)?.estado).toBe('programada');
    expect(jugadorDe(primero.estado).reservado).toEqual(recursos());
    const hasta = avanzar(primero.estado, 3);
    expect(sucesos(hasta.sucesos, 'plan.entra').map((s) => s.datos['orden'])).toEqual([plan.id]);
    expect(estadosDe(hasta.sucesos, plan.id)).toContain('terminada');
  });

  it('llega a seis turnos; más allá, se rechaza', () => {
    const estado = escenario({ almacen: { madera: 400, maravedis: 900 } });
    const seis = construir(estado, 'granja', { turnoProgramado: estado.turno + 6 });
    const siete = construir(estado, 'huerta', { turnoProgramado: estado.turno + 7 });
    const resultado = turno(estado, [seis, siete]);
    expect(ordenDe(resultado.estado, seis.id)?.estado).toBe('programada');
    expect(estadosDe(resultado.sucesos, siete.id)).toEqual(['cancelada:fuera-de-temporada']);
  });

  it('lo que ya no cabe al llegar su turno caduca, y la crónica lo dice', () => {
    const estado = escenario({ almacen: { madera: 400, maravedis: 900 } });
    const plan = construir(estado, 'granja', { turnoProgramado: estado.turno + 2 });
    const primero = turno(estado, [plan]);
    const pobre = conJugador(primero.estado, { almacen: recursos({ pan: 500 }) });
    const hasta = avanzar(pobre, 2);
    expect(estadosDe(hasta.sucesos, plan.id)).toEqual(['cancelada:sin-recursos']);
    const cronica = componerCronica(UNO, {
      estado: hasta.estado,
      sucesos: hasta.sucesos.filter((s) => s.datos['orden'] === plan.id),
      turno: hasta.estado.turno - 1,
      mundo,
      reglas,
    });
    expect(cronica.entradas.map((e) => e.texto)).toContain(
      'Se cancela la orden de construir: no hay recursos.',
    );
  });

  it('un plan con colas y órdenes normales deja siempre un estado válido', () => {
    const estado = escenario({ almacen: { madera: 400, piedra: 100, maravedis: 900 } });
    const ordenes = [
      construir(estado, 'granja', { turnoProgramado: estado.turno + 1, cola: COLA_DEL_LLANO }),
      construir(estado, 'huerta', { cola: COLA_DEL_LLANO }),
      construir(estado, 'casas'),
    ];
    let actual = turno(estado, ordenes).estado;
    for (let i = 0; i < 8; i += 1) actual = turno(actual).estado;
    const validado = validarEstado(JSON.parse(JSON.stringify(actual)) as unknown, mundo);
    expect(validado.ok, validado.ok ? '' : JSON.stringify(validado.errores)).toBe(true);
  });
});
