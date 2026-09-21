// Consumo, merma y escasez (T-032): casos escritos a mano, la propiedad de que el almacen nunca
// queda en negativo ni toca lo reservado, y un anyo entero con la economia de arranque.
import { describe, expect, it } from 'vitest';

import { crearContexto } from '../src/contexto.ts';
import { arranqueDe } from '../src/partidas/arranque.ts';
import { faseConsumo } from '../src/fases/03-consumo.ts';
import {
  costesDeAdministracion,
  jornadasAdministrativasMil,
  jornadasDesde,
} from '../src/reglas/administracion.ts';
import { turnosDeReserva } from '../src/reglas/consumo.ts';
import { emigrantes, permiteCrecer, permiteIniciar } from '../src/reglas/escasez.ts';
import { insumosDe } from '../src/reglas/insumos.ts';
import { mermaDelPan } from '../src/reglas/merma.ts';
import { validarTablas } from '../src/validacion/validarTablas.ts';
import { dentro, tablasDeEjemplo } from './ejemplos.ts';
import { resolverTurno } from '../src/resolver.ts';
import type { Suceso } from '../src/tipos/cronica.ts';
import type { EstadoComarca, EstadoJugador, EstadoPartida, Obra } from '../src/tipos/estado.ts';
import type { IdComarca, IdJugador, IdObra } from '../src/tipos/ids.ts';
import type { Camino } from '../src/tipos/mundo.ts';
import type { Recursos } from '../src/tipos/recursos.ts';
import { RECURSOS } from '../src/tipos/recursos.ts';
import { azarDeTexto } from '../src/utiles/azar.ts';
import { estadoMini, mundoMini, tablasMini } from './mundo-mini.ts';

const reglas = tablasMini();
const mundo = mundoMini();
const CASA = 'casa-uno' as IdJugador;
const LLANO = 'prueba-llano' as IdComarca;

function recursos(cantidades: Partial<Recursos> = {}): Recursos {
  const base = Object.fromEntries(RECURSOS.map((r) => [r, 0])) as Record<string, number>;
  return { ...base, ...cantidades } as Recursos;
}

interface Escenario {
  readonly almacen?: Partial<Recursos>;
  readonly reservado?: Partial<Recursos>;
  readonly jugador?: Partial<EstadoJugador>;
  readonly llano?: Partial<EstadoComarca>;
  readonly obras?: number;
}

/** El estado mini con el jugador y su comarca retocados. */
function escenario(opciones: Escenario = {}): EstadoPartida {
  const base = estadoMini();
  const casa = base.jugadores[CASA];
  const llano = base.comarcas[LLANO];
  if (casa === undefined || llano === undefined) throw new Error('el estado mini ha cambiado');
  const obras: Record<string, Obra> = {};
  for (let i = 1; i <= (opciones.obras ?? 0); i += 1) {
    const id = `obra-${String(i)}` as IdObra;
    obras[id] = {
      id,
      jugador: CASA,
      comarca: LLANO,
      tipo: 'edificio',
      que: 'granja',
      hacia: null,
      avanceMil: 0,
      avanceNecesarioMil: 2000,
      entregado: recursos(),
      costeTotal: recursos(),
      abandonada: false,
    };
  }
  return {
    ...base,
    obras,
    jugadores: {
      [CASA]: {
        ...casa,
        almacen: recursos(opciones.almacen ?? {}),
        reservado: recursos(opciones.reservado ?? {}),
        ...opciones.jugador,
      },
    },
    comarcas: { ...base.comarcas, [LLANO]: { ...llano, ...opciones.llano } },
  };
}

/** Solo la fase de consumo, sobre el estado tal cual. */
function consumir(estado: EstadoPartida): { estado: EstadoPartida; sucesos: Suceso[] } {
  const ctx = crearContexto(estado, [], mundo, reglas);
  ctx.fase = 'consumo';
  faseConsumo(ctx);
  return { estado: ctx.estado, sucesos: ctx.sucesos };
}

function jugador(estado: EstadoPartida): EstadoJugador {
  const casa = estado.jugadores[CASA];
  if (casa === undefined) throw new Error('falta la casa');
  return casa;
}

function llano(estado: EstadoPartida): EstadoComarca {
  const comarca = estado.comarcas[LLANO];
  if (comarca === undefined) throw new Error('falta el llano');
  return comarca;
}

function tipos(sucesos: readonly Suceso[]): string[] {
  return sucesos.map((s) => s.tipo);
}

describe('el pan', () => {
  it('cada vecino come un cuarto de pan, truncado sobre el total del jugador', () => {
    // 40 vecinos × 250 milesimas = 10 panes.
    const { estado, sucesos } = consumir(escenario({ almacen: { pan: 100, maravedis: 100 } }));
    expect(sucesos.find((s) => s.tipo === 'consumo.pan')?.datos).toMatchObject({
      poblacion: 10,
      cuadrillas: 0,
      faltante: 0,
    });
    // 100 − 10 = 90, y la merma del 4 % se lleva 3.
    expect(jugador(estado).almacen.pan).toBe(87);
  });

  it('cada obra en marcha da de comer a su cuadrilla', () => {
    const { sucesos } = consumir(escenario({ almacen: { pan: 100, maravedis: 100 }, obras: 2 }));
    expect(sucesos.find((s) => s.tipo === 'consumo.pan')?.datos).toMatchObject({
      poblacion: 10,
      cuadrillas: 4,
    });
  });

  it('lo reservado por ordenes pendientes no se toca jamas', () => {
    const { estado } = consumir(
      escenario({
        almacen: { pan: 16, sal: 5, maravedis: 3 },
        reservado: { pan: 10, sal: 5, maravedis: 3 },
      }),
    );
    const casa = jugador(estado);
    expect(casa.almacen.pan).toBe(10);
    expect(casa.reservado.pan).toBe(10);
    expect(casa.almacen.sal).toBe(5);
    expect(casa.almacen.maravedis).toBe(3);
    expect(casa.escasez).toBe(true);
  });

  it('propiedad: en 10 000 estados, ningun recurso queda negativo ni por debajo de lo reservado', () => {
    const azar = azarDeTexto('consumo-propiedad');
    for (let i = 0; i < 10_000; i += 1) {
      const almacen: Partial<Record<string, number>> = {};
      const reservado: Partial<Record<string, number>> = {};
      for (const recurso of RECURSOS) {
        const hay = azar.entero(120);
        almacen[recurso] = hay;
        reservado[recurso] = azar.entero(hay + 1);
      }
      const antes = escenario({
        almacen,
        reservado,
        obras: azar.entero(4),
        jugador: {
          escasez: azar.entero(2) === 1,
          escasezSeguidas: azar.entero(5),
          conservarConSal: azar.entero(2) === 1,
        },
        llano: {
          poblacion: azar.entero(300),
          aperos: azar.entero(4),
          turnosSinMantenimiento: azar.entero(2),
          lealtad: azar.entero(101),
          edificios: azar.entero(2) === 1 ? { granja: 1, granero: 1 } : { granja: 1 },
        },
      });
      const casa = jugador(consumir(antes).estado);
      for (const recurso of RECURSOS) {
        expect(casa.almacen[recurso]).toBeGreaterThanOrEqual(casa.reservado[recurso]);
        expect(casa.reservado[recurso]).toBe(reservado[recurso]);
      }
    }
    // Diez mil turnos de consumo: con toda la bateria en paralelo roza los cinco segundos de serie.
  }, 30_000);
});

describe('la merma', () => {
  it('da los valores escritos a mano con y sin granero y con sal', () => {
    expect(mermaDelPan(1000, 0, false, true, 40, reglas)).toEqual({
      mermaMil: 40,
      salGastada: 0,
      panPerdido: 40,
    });
    expect(mermaDelPan(1000, 0, true, true, 40, reglas)).toEqual({
      mermaMil: 20,
      salGastada: 0,
      panPerdido: 20,
    });
    // 1000 de pan piden 20 cargas de sal (una por cada 50).
    expect(mermaDelPan(1000, 20, true, true, 40, reglas)).toEqual({
      mermaMil: 0,
      salGastada: 20,
      panPerdido: 0,
    });
    // Sal sin granero: la mitad.
    expect(mermaDelPan(1000, 20, false, true, 40, reglas)).toEqual({
      mermaMil: 20,
      salGastada: 20,
      panPerdido: 20,
    });
  });

  it('no gasta sal si no alcanza para todo el pan ni si el jugador no quiere', () => {
    expect(mermaDelPan(1000, 19, true, true, 40, reglas).salGastada).toBe(0);
    expect(mermaDelPan(1000, 50, true, false, 40, reglas).salGastada).toBe(0);
    expect(mermaDelPan(0, 50, true, true, 40, reglas)).toEqual({
      mermaMil: 0,
      salGastada: 0,
      panPerdido: 0,
    });
  });

  it('la fase gasta la sal, lo anuncia y rebaja la merma', () => {
    const { estado, sucesos } = consumir(
      escenario({
        almacen: { pan: 110, sal: 10, maravedis: 100 },
        llano: { edificios: { granja: 1, granero: 1 } },
      }),
    );
    // Quedan 100 de pan: dos cargas de sal y merma cero.
    expect(sucesos.find((s) => s.tipo === 'consumo.merma')?.datos).toEqual({
      mermaMil: 0,
      panPerdido: 0,
      salGastada: 2,
    });
    expect(jugador(estado).almacen).toMatchObject({ pan: 100, sal: 8 });
  });
});

describe('los aperos', () => {
  it('cobran un hierro por nivel y bajan un nivel al segundo turno seguido sin hierro', () => {
    const conHierro = consumir(
      escenario({ almacen: { pan: 50, hierro: 5, maravedis: 50 }, llano: { aperos: 2 } }),
    );
    expect(jugador(conHierro.estado).almacen.hierro).toBe(3);

    const primero = consumir(
      escenario({ almacen: { pan: 50, hierro: 1, maravedis: 50 }, llano: { aperos: 2 } }),
    );
    expect(llano(primero.estado)).toMatchObject({ aperos: 2, turnosSinMantenimiento: 1 });
    expect(jugador(primero.estado).almacen.hierro).toBe(1);
    expect(primero.sucesos.find((s) => s.tipo === 'consumo.aviso-aperos')?.datos).toMatchObject({
      turnosHastaPerderlos: 1,
    });

    const segundo = consumir(primero.estado);
    expect(llano(segundo.estado)).toMatchObject({ aperos: 1, turnosSinMantenimiento: 0 });
  });

  it('pagar a tiempo borra la cuenta de turnos sin hierro', () => {
    const { estado } = consumir(
      escenario({
        almacen: { pan: 50, hierro: 5, maravedis: 50 },
        llano: { aperos: 1, turnosSinMantenimiento: 1 },
      }),
    );
    expect(llano(estado)).toMatchObject({ aperos: 1, turnosSinMantenimiento: 0 });
  });
});

describe('la administracion', () => {
  const coste = (camino: Camino) => jornadasAdministrativasMil(camino, reglas, {});

  it('cuesta la base mas dos por jornada a la capital, medidas en verano', () => {
    // Llano-monte 2 × 90 %, monte-sierra 3 × 90 % y el puerto 7 × 90 %.
    expect(jornadasDesde('prueba-llano', mundo, coste).get('prueba-mina')).toBe(10800);
    const base = escenario();
    const comarcas = ['prueba-llano', 'prueba-vega', 'prueba-costa'].map((id) => {
      const comarca = base.comarcas[id];
      if (comarca === undefined) throw new Error(`falta ${id}`);
      return comarca;
    });
    const costes = costesDeAdministracion(comarcas, jugador(base), mundo, reglas, {});
    expect(costes.map((c) => [c.comarca, c.jornadasMil, c.coste])).toEqual([
      ['prueba-llano', 0, 4],
      ['prueba-vega', 1800, 7],
      ['prueba-costa', 3600, 11],
    ]);
  });

  it('el fuero rebaja lo que cuesta y el traslado de la corte lo encarece', () => {
    const conFuero = escenario({ llano: { fuero: 'fuero' } });
    const [rebajado] = costesDeAdministracion(
      [llano(conFuero)],
      jugador(conFuero),
      mundo,
      reglas,
      {},
    );
    expect(rebajado?.coste).toBe(2);
    const trasladando = escenario({
      jugador: { traslado: { destino: 'prueba-vega' as IdComarca, turnosRestantes: 5 } },
    });
    const [caro] = costesDeAdministracion(
      [llano(trasladando)],
      jugador(trasladando),
      mundo,
      reglas,
      {},
    );
    expect(caro?.coste).toBe(5);
  });

  it('sin maravedis, las comarcas sin pagar pierden lealtad y lo debido se acumula', () => {
    const { estado, sucesos } = consumir(
      escenario({ almacen: { pan: 50, maravedis: 3 }, llano: { lealtad: 80 } }),
    );
    expect(llano(estado).lealtad).toBe(78);
    expect(jugador(estado)).toMatchObject({ deudaAdministracion: 4 });
    expect(jugador(estado).almacen.maravedis).toBe(3);
    expect(sucesos.find((s) => s.tipo === 'consumo.administracion')?.datos).toMatchObject({
      total: 4,
      pagado: 0,
      deuda: 4,
      comarcasSinPagar: 1,
    });
  });

  it('la deuda se salda con lo que sobra, y mientras quede, sufre la comarca mas lejana', () => {
    const debe = escenario({
      almacen: { pan: 50, maravedis: 10 },
      jugador: { deudaAdministracion: 20 },
      llano: { lealtad: 80 },
    });
    const { estado } = consumir(debe);
    // Paga los 4 de este turno y 6 de la deuda: quedan 14, y el llano (la unica) pierde 2.
    expect(jugador(estado)).toMatchObject({ deudaAdministracion: 14 });
    expect(llano(estado).lealtad).toBe(78);
    const saldada = consumir(
      escenario({ almacen: { pan: 50, maravedis: 30 }, jugador: { deudaAdministracion: 20 } }),
    );
    expect(jugador(saldada.estado).deudaAdministracion).toBe(0);
    expect(llano(saldada.estado).lealtad).toBe(100);
  });
});

describe('la escasez', () => {
  it('se activa si el pan no llega: el disponible queda a cero y la lealtad baja', () => {
    const { estado, sucesos } = consumir(
      escenario({ almacen: { pan: 6, maravedis: 50 }, llano: { lealtad: 80 } }),
    );
    const casa = jugador(estado);
    expect(casa.almacen.pan).toBe(0);
    expect(casa).toMatchObject({ escasez: true, escasezSeguidas: 1 });
    expect(llano(estado).lealtad).toBe(75);
    expect(permiteIniciar(casa)).toBe(false);
    expect(permiteCrecer(casa)).toBe(false);
    expect(sucesos.find((s) => s.tipo === 'consumo.pan')?.datos).toMatchObject({ faltante: 4 });
    expect(tipos(sucesos)).toContain('escasez.empieza');
  });

  it('se levanta al recuperar el abastecimiento y todo se reanuda', () => {
    const { estado, sucesos } = consumir(
      escenario({
        almacen: { pan: 50, maravedis: 50 },
        jugador: { escasez: true, escasezSeguidas: 2 },
      }),
    );
    const casa = jugador(estado);
    expect(casa).toMatchObject({ escasez: false, escasezSeguidas: 0 });
    expect(permiteIniciar(casa)).toBe(true);
    expect(permiteCrecer(casa)).toBe(true);
    expect(tipos(sucesos)).toContain('escasez.termina');
    expect(llano(estado).lealtad).toBe(100);
  });

  it('la emigracion empieza en la tercera escasez seguida, ni antes ni despues', () => {
    let estado = escenario({ almacen: { maravedis: 500 }, llano: { poblacion: 100 } });
    const poblaciones: number[] = [];
    const avisos: number[] = [];
    for (let turno = 1; turno <= 4; turno += 1) {
      const resultado = consumir(estado);
      estado = resultado.estado;
      poblaciones.push(llano(estado).poblacion);
      const aviso = resultado.sucesos.find((s) => s.tipo === 'consumo.aviso-emigracion');
      avisos.push(Number(aviso?.datos['turnosHastaEmigrar'] ?? 0));
    }
    expect(jugador(estado).escasezSeguidas).toBe(4);
    // Avisa en las dos anteriores; a la tercera se va un 3 % (3 vecinos) y a la cuarta otro 3 %.
    expect(avisos).toEqual([2, 1, 0, 0]);
    expect(poblaciones).toEqual([100, 100, 97, 95]);
  });

  it('con el hambre prolongada la lealtad cae el doble', () => {
    const { estado } = consumir(
      escenario({
        almacen: { maravedis: 50 },
        jugador: { escasez: true, escasezSeguidas: 2 },
        llano: { lealtad: 80 },
      }),
    );
    expect(llano(estado).lealtad).toBe(70);
  });

  it('en las aldeas pequenyas se va al menos un vecino', () => {
    expect(emigrantes(10, reglas)).toBe(1);
    expect(emigrantes(0, reglas)).toBe(0);
    expect(emigrantes(200, reglas)).toBe(6);
  });
});

describe('el aviso de hambre', () => {
  it('cuenta los turnos que aguanta la reserva', () => {
    expect(turnosDeReserva(30, -10)).toBe(3);
    expect(turnosDeReserva(29, -10)).toBe(2);
    expect(turnosDeReserva(30, 0)).toBeNull();
  });

  it('aparece cuando quedan menos de tres turnos de reserva, y no antes', () => {
    // Sin produccion en el estado, el balance es −(10 de consumo + 1 de merma): con 44 de pan
    // quedan 33, tres turnos justos; con 42 quedan 31, dos turnos.
    const justo = consumir(escenario({ almacen: { pan: 44, maravedis: 50 } }));
    expect(tipos(justo.sucesos)).not.toContain('consumo.aviso-hambre');
    const corto = consumir(escenario({ almacen: { pan: 42, maravedis: 50 } }));
    expect(corto.sucesos.find((s) => s.tipo === 'consumo.aviso-hambre')?.datos).toEqual({
      turnos: 2,
      reserva: 31,
      balance: -11,
    });
  });
});

describe('un anyo con la economia de arranque', () => {
  it('llena la reserva en verano y la vacia en invierno sin llegar a la escasez', () => {
    // Un origen tipico del catalogo: labor 3 y 75 vecinos (la mediana de los origenes). Desde
    // T-049 el arranque no es plano: se le pide al preparador lo que le tocaria a esa comarca.
    const geografia = mundo.comarcas['prueba-llano'];
    if (geografia === undefined) throw new Error('falta la comarca de prueba');
    const arranque = arranqueDe({ ...geografia, poblacionInicial: 75 }, 'mesta', reglas);
    let estado = escenario({
      almacen: arranque.almacen,
      llano: { poblacion: 75, edificios: { ...arranque.edificios } },
    });
    const reserva: number[] = [];
    const avisos: string[] = [];
    for (let turno = 1; turno <= 24; turno += 1) {
      const resultado = resolverTurno(estado, [], mundo, reglas);
      estado = resultado.estado;
      expect(jugador(estado).escasez, `turno ${String(turno)}`).toBe(false);
      avisos.push(...tipos(resultado.sucesos).filter((t) => t.startsWith('consumo.aviso')));
      reserva.push(jugador(estado).almacen.pan);
    }
    const [inicioInvierno, finInvierno] = [reserva[0] ?? 0, reserva[3] ?? 0];
    const [inicioVerano, finVerano] = [reserva[9] ?? 0, reserva[15] ?? 0];
    expect(finInvierno).toBeLessThan(inicioInvierno);
    expect(finVerano).toBeGreaterThan(inicioVerano + 50);
    expect(reserva[23]).toBeLessThan(reserva[21] ?? 0);
    expect(Math.min(...reserva)).toBeGreaterThan(0);
    expect(avisos).toEqual([]);
  });
});

describe('los insumos de los edificios', () => {
  const herreria = (disponible: Partial<Record<string, number>>) =>
    insumosDe(
      { ...llano(escenario()), edificios: { carbonera: 2, ferreria: 2, lonja: 1 } },
      disponible,
      reglas,
    );

  it('cada nivel paga lo suyo y el que no llega se para', () => {
    const disponible = { madera: 5, sal: 2 };
    const insumos = herreria(disponible);
    expect(insumos.gasto).toEqual({ madera: 4, sal: 2 });
    expect(insumos.nivelesActivos).toEqual({ carbonera: 1, ferreria: 1, lonja: 1 });
    expect(insumos.parados).toEqual([
      { edificio: 'carbonera', activos: 1 },
      { edificio: 'ferreria', activos: 1 },
    ]);
    // Lo pagado se descuenta para la siguiente comarca del jugador.
    expect(disponible).toEqual({ madera: 1, sal: 0 });
  });

  it('sin carbon no hay ferreria, y sin sal no hay lonja', () => {
    const insumos = herreria({ madera: 0, sal: 1 });
    expect(insumos.nivelesActivos).toEqual({ carbonera: 0, ferreria: 0, lonja: 0 });
    expect(insumos.gasto).toEqual({ madera: 0, sal: 0 });
  });

  it('en la fase, la comarca mas cercana a la capital se sirve primero', () => {
    const base = escenario({
      almacen: { madera: 4, pan: 100, maravedis: 100 },
      llano: { edificios: { carbonera: 1, ferreria: 1 } },
    });
    const monte = base.comarcas['prueba-monte'];
    if (monte === undefined) throw new Error('falta prueba-monte');
    const estado: EstadoPartida = {
      ...base,
      comarcas: {
        ...base.comarcas,
        'prueba-monte': { ...monte, duenyo: CASA, edificios: { carbonera: 1 } },
      },
    };
    const { sucesos } = resolverTurno(estado, [], mundo, reglas);
    const parados = sucesos.filter((s) => s.tipo === 'produccion.sin-insumo');
    expect(parados.map((s) => [s.comarca, s.datos['edificio']])).toEqual([
      ['prueba-monte', 'carbonera'],
    ]);
    // El llano es la capital: su carbonera se lleva la madera.
    const madera = sucesos.filter(
      (s) => s.tipo === 'almacen.cambio' && String(s.datos['motivo']).startsWith('insumos'),
    );
    expect(madera.map((s) => [s.datos['motivo'], s.datos['delta']])).toEqual([
      ['insumos de prueba-llano', -4],
    ]);
  });

  it('las tablas exigen que el edificio requerido vaya antes en la lista', () => {
    const tablas = dentro(tablasDeEjemplo(), 'edificios', 'granja', {
      requiereEdificio: 'molino',
    });
    const resultado = validarTablas(tablas);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(resultado.errores.map((e) => e.ruta)).toContain('edificios.granja.requiereEdificio');
    }
  });
});
