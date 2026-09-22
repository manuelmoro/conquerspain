// Los seis escenarios mínimos de la ficha T-051 §4.2: el mismo plan, tecleado cada día o dejado
// dicho una vez cada seis turnos. Todas las órdenes son órdenes que un jugador puede enviar; el
// ausente solo usa lo que el motor le da para jugar sin estar: fechas, colas, rutas y mayordomo.
//
// Lo que se exige es **igualdad exacta del dominio**, no un parecido: en estos escenarios no hay
// ninguna decisión que dependa de algo que se sepa dentro del bloque.
import { describe, expect, it } from 'vitest';

import {
  CASAS,
  TABLAS_DEL_JUEGO,
  costeDeEdificio,
  costeDeRebanyo,
  costeDeRecua,
  explicar,
  idDeMercadoDeFeria,
  idDeMercadoLocal,
  modificadoresDe,
  validarEstado,
  validarOrdenEntrante,
} from '@conquer/nucleo';
import type {
  CargaFiscal,
  Cometido,
  EstadoPartida,
  IdComarca,
  IdJugador,
  IdMercado,
  IdRebanyo,
  IdRecua,
  Orden,
  ParadaDeRuta,
  Recurso,
  ReglaDeMayordomo,
  TipoEdificio,
} from '@conquer/nucleo';

import {
  estadoMini,
  mundoMini,
  tablasMini,
} from '../../../../paquetes/nucleo/pruebas/mundo-mini.ts';
import { altaDelBanco, mundoPeninsula } from '../partida.ts';
import { robotDe } from '../robots/index.ts';
import type {
  BloqueDelGuion,
  Emisor,
  Guion,
  OpcionesDeGuion,
  PasoDelGuion,
  RobotDelPlan,
} from './equivalencia.ts';
import { TURNOS_DEL_BLOQUE, compararGuion, equivalenciaDeLaPartida } from './equivalencia.ts';

const YO = 'casa-uno' as IdJugador;
const CAPITAL = 'prueba-llano' as IdComarca;
const VEGA = 'prueba-vega' as IdComarca;
const SIERRA = 'prueba-sierra' as IdComarca;

/** Las órdenes del protocolo que usan los guiones, con el emisor que las numera. */
const orden = {
  construir(e: Emisor, estado: EstadoPartida, edificio: TipoEdificio, cola: string | null): Orden {
    const casa = modificadoresDe(estado, e.jugador, TABLAS_DEL_JUEGO);
    return {
      ...e.base({ coste: costeDeEdificio(edificio, casa, TABLAS_DEL_JUEGO), cola }),
      tipo: 'construir',
      comarca: estado.jugadores[e.jugador]?.capital ?? CAPITAL,
      edificio,
    };
  },
  formarRecua(e: Emisor, estado: EstadoPartida): Orden {
    const casa = modificadoresDe(estado, e.jugador, TABLAS_DEL_JUEGO);
    return {
      ...e.base({ coste: costeDeRecua(casa, TABLAS_DEL_JUEGO) }),
      tipo: 'formar-recua',
      comarca: estado.jugadores[e.jugador]?.capital ?? CAPITAL,
      acemilas: TABLAS_DEL_JUEGO.movimiento.acemilasPorRecua,
      vecinos: 0,
    };
  },
  formarRebanyo(e: Emisor, estado: EstadoPartida): Orden {
    const casa = modificadoresDe(estado, e.jugador, TABLAS_DEL_JUEGO);
    return {
      ...e.base({ coste: costeDeRebanyo(casa, TABLAS_DEL_JUEGO) }),
      tipo: 'formar-rebanyo',
      comarca: estado.jugadores[e.jugador]?.capital ?? CAPITAL,
      cabezas: TABLAS_DEL_JUEGO.ganaderia.cabezasPorRebanyo,
    };
  },
  ruta(
    e: Emisor,
    recua: IdRecua | null,
    rebanyo: IdRebanyo | null,
    paradas: readonly ParadaDeRuta[],
    cola: string | null = null,
  ): Orden {
    return { ...e.base({ cola }), tipo: 'ruta', recua, rebanyo, paradas, circular: false };
  },
  carga(
    e: Emisor,
    recua: IdRecua,
    cargar: Partial<Record<Recurso, number>>,
    cola: string | null = null,
  ): Orden {
    return {
      ...e.base({ cola }),
      tipo: 'carga',
      recua,
      cargar,
      descargar: {},
      vecinosCargados: 0,
    };
  },
  cometido(e: Emisor, recua: IdRecua, cometido: Cometido, cola: string | null = null): Orden {
    return { ...e.base({ cola }), tipo: 'cometido', recua, cometido };
  },
  mercado(
    e: Emisor,
    recua: IdRecua,
    mercado: IdMercado,
    recurso: Recurso,
    operacion: 'comprar' | 'vender',
    cantidad: number,
    precioLimiteMil: number,
    turnos = 1,
  ): Orden {
    return {
      ...e.base({ turnosTotales: turnos }),
      tipo: 'mercado',
      mercado,
      recua,
      recurso,
      operacion,
      cantidad,
      precioLimiteMil,
    };
  },
  politica(e: Emisor, comarca: IdComarca, carga: CargaFiscal): Orden {
    return {
      ...e.base(),
      tipo: 'politica',
      comarca,
      fuero: null,
      cargaFiscal: carga,
      dehesa: null,
      conservarConSal: null,
    };
  },
  regalo(e: Emisor, comarca: IdComarca): Orden {
    const coste = {
      pan: 0,
      madera: 0,
      piedra: 0,
      maravedis: TABLAS_DEL_JUEGO.influencia.costeRegalo,
      sal: 0,
      hierro: 0,
      lana: 0,
    };
    return { ...e.base({ coste }), tipo: 'regalo', comarca };
  },
  mayordomo(e: Emisor, regla: ReglaDeMayordomo): Orden {
    return { ...e.base(), tipo: 'mayordomo', alta: regla, bajaPrioridad: null };
  },
};

function parada(comarca: IdComarca, cambios: Partial<ParadaDeRuta> = {}): ParadaDeRuta {
  return { comarca, cargar: {}, descargar: {}, vender: {}, comprar: {}, ...cambios };
}

/** La recua del jugador (la única de estos guiones), tal como estaba al empezar el bloque. */
function suRecua(estado: EstadoPartida, jugador: IdJugador): IdRecua | null {
  return Object.values(estado.recuas).find((r) => r.jugador === jugador)?.id ?? null;
}

function suRebanyo(estado: EstadoPartida, jugador: IdJugador): IdRebanyo | null {
  return Object.values(estado.rebanyos).find((r) => r.jugador === jugador)?.id ?? null;
}

/** Lo que hay en el estado, o un error claro: en un escenario escrito a mano no puede faltar. */
function exigir<T>(valor: T | undefined, que: string): T {
  if (valor === undefined) throw new Error(`falta ${que} en el escenario`);
  return valor;
}

/** El mundo, las reglas y el estado de los escenarios del mundo mini. */
function enElMini(cambios: (estado: EstadoPartida) => EstadoPartida = (e) => e): OpcionesDeGuion {
  const estado = cambios(estadoMini());
  const valido = validarEstado(estado, mundoMini());
  if (!valido.ok) throw new Error(explicar(valido.errores));
  return {
    estado: valido.valor,
    mundo: mundoMini(),
    reglas: tablasMini(),
    turnos: 14,
    cadencia: 1,
  };
}

/** Comprueba la equivalencia y, de paso, que todas las órdenes las aceptaría el servidor. */
function equivale(guion: Guion, opciones: OpcionesDeGuion): void {
  const comparacion = compararGuion(guion, opciones);
  for (const ejecucion of [comparacion.diligente, comparacion.ausente]) {
    for (const ordenes of ejecucion.enviadas.values()) {
      for (const enviada of ordenes) {
        const valida = validarOrdenEntrante(enviada);
        expect(valida.ok, `${enviada.id}: ${JSON.stringify(enviada)}`).toBe(true);
      }
    }
  }
  expect(
    comparacion.primeraDiferencia,
    `el dominio se separa en el turno ${String(comparacion.primeraDiferencia)}`,
  ).toBeNull();
  // Las dos variantes tienen que haber hecho algo: una igualdad de dos partidas vacías no prueba nada.
  const trabajo = comparacion.diligente.sucesos.filter(([, s]) => s.tipo === 'orden.estado').length;
  expect(trabajo).toBeGreaterThan(0);
}

describe('obras sucesivas: en su día o en la cola de la comarca', () => {
  const OBRAS: readonly TipoEdificio[] = ['aserradero', 'granja', 'casas'];
  /** Los turnos en que el diligente pide cada obra: cuando la anterior ya está pagada y en marcha. */
  const CUANDO = [1, 4, 8];

  const guion: Guion = {
    nombre: 'obras sucesivas',
    jugador: YO,
    diaria({ turno, bloque, emisor }: PasoDelGuion) {
      const i = CUANDO.indexOf(turno);
      const obra = OBRAS[i];
      return obra === undefined ? [] : [orden.construir(emisor, bloque, obra, null)];
    },
  };

  it('fechadas: el ausente deja las tres puestas para su turno', () => {
    equivale(guion, enElMini());
  });

  it('en cola: las tres el primer día, y la comarca las va empezando', () => {
    // Otra manera de decir lo mismo, la que usa quien no va a volver: la cola de la comarca. El
    // dominio tiene que salir igual que tecleándolas cada día.
    const conCola: Guion = {
      ...guion,
      ausente(plan: BloqueDelGuion) {
        if (plan.turno !== 1) return [];
        const emisor = plan.emisorDe(1);
        return OBRAS.map((obra) =>
          orden.construir(emisor, plan.bloque, obra, `comarca:${CAPITAL}`),
        );
      },
    };
    const comparacion = compararGuion(conCola, enElMini());
    // La cola no da el mismo dominio turno a turno que pedirlas en fechas fijas, y eso hay que
    // decirlo: empieza cada obra en cuanto hay cuadrilla, sin esperar al día previsto.
    expect(comparacion.primeraDiferencia).not.toBeNull();
    const edificios = (estado: EstadoPartida) => estado.comarcas[CAPITAL]?.edificios;
    expect(edificios(comparacion.ausente.estado)).toEqual(edificios(comparacion.diligente.estado));
  });
});

describe('comercio: comprar, vender y una parada con precio límite', () => {
  const PLAZA = idDeMercadoLocal(CAPITAL);
  const conMercado = enElMini((estado) => {
    const capital = exigir(estado.comarcas[CAPITAL], 'la capital');
    const vega = exigir(estado.comarcas[VEGA], 'la vega');
    const jugador = exigir(estado.jugadores[YO], 'el jugador');
    return {
      ...estado,
      comarcas: {
        ...estado.comarcas,
        [CAPITAL]: { ...capital, edificios: { ...capital.edificios, mercado: 1 } },
        [VEGA]: { ...vega, edificios: { ...vega.edificios, mercado: 1 } },
      },
      jugadores: {
        [YO]: {
          ...jugador,
          conocimiento: {
            ...jugador.conocimiento,
            [VEGA]: { nivel: 'explorada' as const, turnoUltimaNoticia: 1, datos: null },
          },
        },
      },
    };
  });

  const guion: Guion = {
    nombre: 'comercio',
    jugador: YO,
    diaria({ turno, bloque, emisor }: PasoDelGuion) {
      const recua = suRecua(bloque, YO);
      if (turno === 1) return [orden.formarRecua(emisor, bloque)];
      if (recua === null) return [];
      const base = TABLAS_DEL_JUEGO.recursos;
      if (turno === 2) return [orden.cometido(emisor, recua, 'tratar')];
      // Vender pan en casa un día y comprar madera otro: la compra recurrente del plan.
      if (turno === 3) {
        return [
          orden.carga(emisor, recua, { pan: 6, maravedis: 30 }),
          orden.mercado(emisor, recua, PLAZA, 'pan', 'vender', 6, base.pan.precioBaseMil),
        ];
      }
      if (turno === 5) {
        return [
          orden.mercado(
            emisor,
            recua,
            PLAZA,
            'madera',
            'comprar',
            4,
            base.madera.precioBaseMil * 2,
          ),
        ];
      }
      // Y una parada de ruta con precio límite en la plaza de la vecina, ida y vuelta.
      if (turno === 7) {
        return [
          orden.ruta(emisor, recua, null, [
            parada(VEGA, {
              vender: { pan: { cantidad: 2, precioMinimoMil: base.pan.precioBaseMil } },
            }),
            parada(CAPITAL),
          ]),
        ];
      }
      return [];
    },
  };

  it('el mismo comercio, tecleado cada día o fechado por bloques', () => {
    equivale(guion, conMercado);
  });
});

describe('trashumancia: la salida va con fecha, no con el jugador delante', () => {
  const guion: Guion = {
    nombre: 'trashumancia',
    jugador: YO,
    diaria({ turno, bloque, emisor }: PasoDelGuion) {
      if (turno === 1) return [orden.formarRebanyo(emisor, bloque)];
      const rebanyo = suRebanyo(bloque, YO);
      if (rebanyo === null) return [];
      // Sube al agostadero el turno 9, cuando empieza el pasto de verano, y baja el 19.
      if (turno === 9) return [orden.ruta(emisor, null, rebanyo, [parada(SIERRA)])];
      if (turno === 19) return [orden.ruta(emisor, null, rebanyo, [parada(CAPITAL)])];
      return [];
    },
  };

  it('el ganado sube y baja igual con el plan dejado por bloques', () => {
    equivale(guion, { ...enElMini(), turnos: 24 });
  });
});

describe('gobierno: el mayordomo hace lo que el jugador haría cada estación', () => {
  const REGLAS_DE_GOBIERNO: readonly ReglaDeMayordomo[] = [
    {
      prioridad: 1,
      condicion: { tipo: 'estacion-empieza', estacion: 'invierno' },
      accion: { tipo: 'carga-fiscal', comarca: CAPITAL, carga: 'ligera' },
    },
    {
      prioridad: 2,
      condicion: { tipo: 'estacion-empieza', estacion: 'primavera' },
      accion: { tipo: 'carga-fiscal', comarca: CAPITAL, carga: 'normal' },
    },
  ];

  const guion: Guion = {
    nombre: 'gobierno',
    jugador: YO,
    diaria({ turno, emisor }: PasoDelGuion) {
      // El primer turno de primavera (5) y el primero de invierno (23) del año del mundo mini.
      if (turno === 5) return [orden.politica(emisor, CAPITAL, 'normal')];
      if (turno === 23) return [orden.politica(emisor, CAPITAL, 'ligera')];
      return [];
    },
    ausente(plan: BloqueDelGuion) {
      // El ausente no teclea nada cada estación: deja las dos reglas el primer día.
      if (plan.turno !== 1) return [];
      const emisor = plan.emisorDe(1);
      return REGLAS_DE_GOBIERNO.map((regla) => orden.mayordomo(emisor, regla));
    },
  };

  it('la carga fiscal acaba igual con reglas que tecleándola cada estación', () => {
    const comparacion = compararGuion(guion, { ...enElMini(), turnos: 24 });
    const carga = (estado: EstadoPartida) => estado.comarcas[CAPITAL]?.cargaFiscal;
    expect(carga(comparacion.ausente.estado)).toBe(carga(comparacion.diligente.estado));
    // El mayordomo deja su marca en las órdenes que da, y el jugador ve cuáles fueron suyas.
    const delMayordomo = comparacion.ausente.sucesos.filter(
      ([, s]) => s.tipo === 'orden.estado' && s.datos['delMayordomo'] === 1,
    );
    expect(delMayordomo.length).toBeGreaterThan(0);
  });
});

describe('la tierra la decide el jugador, y el plan solo ejecuta', () => {
  const guion: Guion = {
    nombre: 'influencia',
    jugador: YO,
    diaria({ turno, emisor }: PasoDelGuion) {
      // Un regalo al concejo de la vega cada cuatro turnos: la decisión es del jugador, la fecha
      // la lleva el plan. El mayordomo no incorpora comarcas (docs/02 §2.5.3).
      if (turno % 4 !== 1) return [];
      return [orden.regalo(emisor, VEGA)];
    },
  };

  it('los regalos fechados dejan la misma influencia', () => {
    equivale(guion, { ...enElMini(), turnos: 12 });
  });
});

describe('los casos que se tuercen se tuercen igual', () => {
  it('sin pan, con una plaza que no existe y con una orden imposible, las dos variantes se paran igual', () => {
    const guion: Guion = {
      nombre: 'casos límite',
      jugador: YO,
      diaria({ turno, bloque, emisor }: PasoDelGuion) {
        const recua = suRecua(bloque, YO);
        if (turno === 1) return [orden.formarRecua(emisor, bloque)];
        if (recua === null) return [];
        // Una plaza que no existe: la orden se cancela con su motivo, en las dos variantes.
        if (turno === 3) {
          return [
            orden.mercado(
              emisor,
              recua,
              idDeMercadoDeFeria('feria-que-no-hay' as never),
              'pan',
              'vender',
              2,
              1000,
            ),
          ];
        }
        // Una obra en comarca ajena: el motor la rechaza con el mismo motivo.
        if (turno === 5) {
          return [
            {
              ...orden.construir(emisor, bloque, 'granja', null),
              comarca: SIERRA,
            },
          ];
        }
        return [];
      },
    };
    // Con hambre desde el primer día: el granero vacío se nota en las dos por igual.
    const conHambre = enElMini((estado) => {
      const jugador = exigir(estado.jugadores[YO], 'el jugador');
      return {
        ...estado,
        jugadores: { [YO]: { ...jugador, almacen: { ...jugador.almacen, pan: 4 } } },
      };
    });
    const comparacion = compararGuion(guion, conHambre);
    expect(comparacion.primeraDiferencia).toBeNull();
    // Las canceladas se retiran del estado al acabar el turno: su rastro está en los sucesos.
    const motivos = (ejecucion: (typeof comparacion)['diligente']) =>
      ejecucion.sucesos
        .filter(([, s]) => s.tipo === 'orden.estado' && s.datos['estado'] === 'cancelada')
        .map(([, s]) => `${String(s.datos['clase'])}:${String(s.datos['motivo'])}`)
        .sort();
    expect(motivos(comparacion.ausente)).toEqual(motivos(comparacion.diligente));
    expect(motivos(comparacion.diligente).length).toBeGreaterThan(0);
  });
});

describe('un viaje de feria que cruza el bloque', () => {
  it('sale con su carga, vende en la feria y vuelve sin que nadie entre a media semana', () => {
    // Los hortelanos en Tierra de Valladolid: la feria de Medina está a dos jornadas y abre en los
    // turnos 10 y 11. El plan se deja el turno 7 y el viaje se pasa el bloque entero fuera.
    const alta = altaDelBanco({
      semilla: '1492',
      casas: ['hortelanos'],
      reglas: TABLAS_DEL_JUEGO,
      mundo: mundoPeninsula(),
      recortar: false,
      origenesFijos: { hortelanos: 'tierra-de-valladolid' as IdComarca },
    });
    const yo = 'hortelanos' as IdJugador;
    const medina = 'tierra-de-medina' as IdComarca;
    const jugador = alta.estado.jugadores[yo];
    if (jugador === undefined) throw new Error('falta el hortelano');
    const feria = alta.mundo.comarcas[medina]?.ferias[0];
    if (feria === undefined) throw new Error('Medina se ha quedado sin feria');
    const estado: EstadoPartida = {
      ...alta.estado,
      jugadores: {
        [yo]: {
          ...jugador,
          conocimiento: {
            ...jugador.conocimiento,
            [medina]: { nivel: 'explorada', turnoUltimaNoticia: 1, datos: null },
          },
        },
      },
    };
    const valido = validarEstado(estado, alta.mundo);
    if (!valido.ok) throw new Error(explicar(valido.errores));

    const guion: Guion = {
      nombre: 'feria',
      jugador: yo,
      diaria({ turno, bloque, emisor }: PasoDelGuion) {
        if (turno === 1) return [orden.formarRecua(emisor, bloque)];
        const recua = suRecua(bloque, yo);
        if (recua === null) return [];
        // El plan se deja el turno 7; la carga va el 9 y la salida el 10, que es cuando abre la
        // feria de Medina (turnos 10 y 11 del año). Nadie entra a media semana a decidirlo.
        if (turno === 9) {
          return [orden.carga(emisor, recua, { pan: 8 }), orden.cometido(emisor, recua, 'tratar')];
        }
        if (turno === 10) {
          return [
            orden.ruta(emisor, recua, null, [
              parada(medina, {
                // Se acepta hasta un 40 % por debajo del precio base: lo que pone quien va a una
                // feria y no puede volver a mirar el precio.
                vender: {
                  pan: {
                    cantidad: 4,
                    precioMinimoMil: Math.floor(
                      (TABLAS_DEL_JUEGO.recursos.pan.precioBaseMil * 6) / 10,
                    ),
                  },
                },
              }),
              parada(jugador.capital),
            ]),
          ];
        }
        return [];
      },
    };
    const opciones: OpcionesDeGuion = {
      estado: valido.valor,
      mundo: alta.mundo,
      reglas: TABLAS_DEL_JUEGO,
      turnos: 18,
      cadencia: 1,
    };
    equivale(guion, opciones);
    // Y el viaje ocurrió de verdad: la recua salió, vendió en la feria y volvió.
    const comparacion = compararGuion(guion, opciones);
    const vendio = comparacion.ausente.sucesos.some(
      ([, s]) =>
        s.tipo === 'mercado.trato' && String(s.datos['mercado']) === idDeMercadoDeFeria(feria.id),
    );
    expect(vendio).toBe(true);
    const enCasa = Object.values(comparacion.ausente.estado.recuas)[0]?.situacion;
    expect(enCasa?.donde === 'comarca' && enCasa.comarca).toBe(jugador.capital);
  }, 60_000);
});

describe('las ocho vías tienen plan equivalente', () => {
  it('el plan que deja el que entra cada seis turnos, entregado a mano, da lo mismo', () => {
    // Las ocho casas en la misma partida, con los robots entrando cada seis turnos. Su plan se
    // vuelve a jugar entregando cada orden el día en que empezó a trabajar, sin colas ni fechas:
    // las mismas decisiones, la misma información y el mismo resultado (ficha T-051 §6.2).
    const alta = altaDelBanco({ semilla: '1492', casas: CASAS, reglas: TABLAS_DEL_JUEGO });
    const robots: RobotDelPlan[] = CASAS.map((casa) => {
      const robot = robotDe(casa, TURNOS_DEL_BLOQUE);
      return {
        jugador: casa as string as IdJugador,
        cadencia: TURNOS_DEL_BLOQUE,
        decidir: (vista, mundo, reglas) => robot.decidir(vista, mundo, reglas),
      };
    });
    const filas = equivalenciaDeLaPartida(
      robots,
      { estado: alta.estado, mundo: alta.mundo, reglas: TABLAS_DEL_JUEGO, turnos: 100 },
      [100],
    );
    expect(filas).toHaveLength(CASAS.length);
    for (const fila of filas) {
      const dicho = `${fila.jugador}: por bloques ${String(fila.porBloques)}, a mano ${String(fila.aMano)}`;
      // No se pide parecido, sino el mismo dominio turno a turno: en este plan no hay ninguna
      // decisión que dependa de algo que se sepa dentro del bloque (ficha T-051 §4.4).
      expect(fila.primeraDiferencia, dicho).toBeNull();
      expect(fila.diferenciaMil, dicho).toBe(0);
    }
  }, 120_000);
});
