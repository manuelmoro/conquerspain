// Incorporar comarcas (T-038): los requisitos, la disputa, el ciclo de vida de la orden y la
// prevision que ve el jugador contra lo que hace la fase de verdad.
import { describe, expect, it } from 'vitest';

import { crearContexto } from '../src/contexto.ts';
import { faseTerritorio } from '../src/fases/08-territorio.ts';
import { costesDeAdministracion } from '../src/reglas/administracion.ts';
import { comarcasDe, turnosDeReserva } from '../src/reglas/consumo.ts';
import {
  balancePanMil,
  estadoTrasIncorporar,
  ganadorDeIncorporacion,
  impedimentoDeIncorporar,
  jornadasHastaElDominio,
  previsionIncorporar,
} from '../src/reglas/incorporar.ts';
import type { EstadoJugador, EstadoPartida } from '../src/tipos/estado.ts';
import type { IdJugador } from '../src/tipos/ids.ts';
import type { Orden, OrdenIncorporar } from '../src/tipos/ordenes.ts';
import type { Recursos } from '../src/tipos/recursos.ts';
import type { TablasDeReglas } from '../src/tipos/reglas.ts';
import { azarDeTexto } from '../src/utiles/azar.ts';
import { MIL } from '../src/utiles/enteros.ts';
import {
  DOS,
  UNO,
  base,
  c,
  comarcaDe,
  conComarca,
  escenario,
  mundo,
  recua,
  recursos,
  reglas,
  turno,
} from './recuas.ts';

const VEGA = 'prueba-vega';
const COSTE = { pan: 40, maravedis: 30 };

function incorporar(
  turnoDeAlta: number,
  cambios: { comarca?: string; jugador?: IdJugador; coste?: Partial<Recursos> } = {},
): OrdenIncorporar {
  return {
    ...base(turnoDeAlta, cambios.coste ?? COSTE),
    jugador: cambios.jugador ?? UNO,
    tipo: 'incorporar',
    comarca: c(cambios.comarca ?? VEGA),
    turnosTotales: 3,
  };
}

/** El estado mini con la influencia dada en la vega. */
function conInfluencia(
  influencias: Record<string, number>,
  opciones: { conDos?: boolean; turno?: number } = {},
): EstadoPartida {
  return conComarca(escenario({ conDos: opciones.conDos ?? true, ...opciones }), VEGA, {
    influencias,
  });
}

function jugadorDe(estado: EstadoPartida, id: IdJugador): EstadoJugador {
  const jugador = estado.jugadores[id];
  if (jugador === undefined) throw new Error(`falta el jugador ${id}`);
  return jugador;
}

function impedimento(
  estado: EstadoPartida,
  opciones: { comarca?: string; jugador?: IdJugador; tablas?: TablasDeReglas } = {},
) {
  return impedimentoDeIncorporar(
    estado,
    comarcaDe(estado, opciones.comarca ?? VEGA),
    jugadorDe(estado, opciones.jugador ?? UNO),
    mundo,
    opciones.tablas ?? reglas,
  );
}

describe('los requisitos de incorporar', () => {
  it('una comarca con dueño no se incorpora', () => {
    expect(impedimento(conInfluencia({ [UNO]: 90 }), { comarca: 'prueba-llano' })).toBe(
      'comarca-con-duenyo',
    );
  });

  it('hace falta al menos 60 de influencia', () => {
    expect(impedimento(conInfluencia({ [UNO]: 59 }))).toBe('influencia-baja');
    expect(impedimento(conInfluencia({}))).toBe('influencia-baja');
    expect(impedimento(conInfluencia({ [UNO]: 60 }))).toBeNull();
  });

  it('hace falta ser el que mas tiene y sacarle 15 puntos al segundo', () => {
    expect(impedimento(conInfluencia({ [UNO]: 70, [DOS]: 56 }))).toBe('sin-ventaja');
    expect(impedimento(conInfluencia({ [UNO]: 70, [DOS]: 55 }))).toBeNull();
    expect(impedimento(conInfluencia({ [UNO]: 70, [DOS]: 70 }))).toBe('sin-ventaja');
    expect(impedimento(conInfluencia({ [UNO]: 65, [DOS]: 90 }))).toBe('sin-ventaja');
  });

  it('hace falta una comarca propia a seis jornadas o menos por camino conocido', () => {
    const estado = conInfluencia({ [UNO]: 70 });
    const jornadas = jornadasHastaElDominio(
      estado,
      jugadorDe(estado, UNO),
      comarcaDe(estado, VEGA),
      mundo,
      reglas,
    );
    // Una comarca de llano son dos jornadas, y en verano se miden con un 10 % menos.
    expect(jornadas).toBe(1800);
    const conLimite = (jornadasMaximas: number): TablasDeReglas => ({
      ...reglas,
      influencia: { ...reglas.influencia, jornadasMaximasDesdeElDominio: jornadasMaximas },
    });
    expect(impedimento(estado, { tablas: conLimite(2) })).toBeNull();
    expect(impedimento(estado, { tablas: conLimite(1) })).toBe('muy-lejos');
  });

  it('sin un camino conocido hasta la comarca, esta lejos aunque sea vecina de otra', () => {
    // El jugador solo conoce el llano y la costa: no sabe como llegar del uno a la otra.
    const base = conComarca(escenario({ conDos: true }), 'prueba-costa', {
      influencias: { [UNO]: 90 },
    });
    const jugador = jugadorDe(base, UNO);
    const ciego: EstadoPartida = {
      ...base,
      jugadores: {
        ...base.jugadores,
        [UNO]: {
          ...jugador,
          conocimiento: {
            'prueba-llano': { nivel: 'propia', turnoUltimaNoticia: 1, datos: null },
            'prueba-costa': { nivel: 'explorada', turnoUltimaNoticia: 1, datos: null },
          },
        },
      },
    };
    expect(impedimento(ciego, { comarca: 'prueba-costa' })).toBe('muy-lejos');
    // Con el rio explorado, si.
    expect(impedimento(base, { comarca: 'prueba-costa' })).toBeNull();
  });

  it('no se puede incorporar en escasez', () => {
    const estado = conInfluencia({ [UNO]: 70 });
    const enEscasez: EstadoPartida = {
      ...estado,
      jugadores: { ...estado.jugadores, [UNO]: { ...jugadorDe(estado, UNO), escasez: true } },
    };
    expect(impedimento(enEscasez)).toBe('escasez');
  });

  it('se dice el primero que falla, en el orden de la ficha', () => {
    // Sin influencia y ademas en escasez: manda la influencia.
    const estado = conInfluencia({ [UNO]: 10 });
    const enEscasez: EstadoPartida = {
      ...estado,
      jugadores: { ...estado.jugadores, [UNO]: { ...jugadorDe(estado, UNO), escasez: true } },
    };
    expect(impedimento(enEscasez)).toBe('influencia-baja');
  });
});

describe('la disputa entre ordenes que terminan el mismo turno', () => {
  const candidato = (jugador: string, influencia: number, presenciaSeguida: number) => ({
    jugador: jugador as IdJugador,
    influencia,
    presenciaSeguida,
  });

  it('1) gana el de mas influencia, aunque tenga menos presencia', () => {
    const ganador = ganadorDeIncorporacion(
      [candidato('a', 70, 9), candidato('b', 75, 0)],
      'semilla',
      5,
      VEGA,
    );
    expect(ganador).toBe('b');
  });

  it('2) si empatan en influencia, el que lleva mas turnos seguidos de presencia', () => {
    expect(
      ganadorDeIncorporacion([candidato('a', 70, 3), candidato('b', 70, 8)], 'semilla', 5, VEGA),
    ).toBe('b');
    expect(
      ganadorDeIncorporacion([candidato('b', 70, 8), candidato('a', 70, 3)], 'semilla', 5, VEGA),
    ).toBe('b');
  });

  it('3) si siguen empatados, decide la huella, sin importar el orden ni cuando se dio la orden', () => {
    const empatados = [candidato('a', 70, 4), candidato('b', 70, 4), candidato('c', 70, 4)];
    const ganadores = new Set<string | null>();
    for (let turnoDeLaTirada = 1; turnoDeLaTirada <= 40; turnoDeLaTirada += 1) {
      const esperado = ganadorDeIncorporacion(empatados, 'semilla', turnoDeLaTirada, VEGA);
      ganadores.add(esperado);
      // Barajar los candidatos no cambia nada.
      const azar = azarDeTexto(`baraja-${String(turnoDeLaTirada)}`);
      for (let i = 0; i < 4; i += 1) {
        expect(
          ganadorDeIncorporacion(azar.barajar(empatados), 'semilla', turnoDeLaTirada, VEGA),
        ).toBe(esperado);
      }
    }
    // La huella reparte: en cuarenta turnos gana mas de uno.
    expect(ganadores.size).toBeGreaterThan(1);
  });

  it('sin candidatos no gana nadie', () => {
    expect(ganadorDeIncorporacion([], 'semilla', 1, VEGA)).toBeNull();
  });
});

describe('el ciclo de vida de una orden de incorporar', () => {
  const enCurso = (
    orden: OrdenIncorporar,
    hechos: number,
    jugador: IdJugador = orden.jugador,
  ): Orden => ({ ...orden, jugador, estado: 'en curso', turnosHechos: hechos });

  it('paga al empezar, tarda tres turnos y deja la comarca propia con lealtad 60', () => {
    const estado = conInfluencia({ [UNO]: 70 });
    const orden = incorporar(estado.turno);
    const primero = turno(estado, [orden]);
    const pago = primero.sucesos.filter(
      (s) => s.tipo === 'almacen.cambio' && String(s.datos['motivo']) === `orden ${orden.id}`,
    );
    expect(pago.map((s) => [s.datos['recurso'], s.datos['delta']])).toEqual([
      ['pan', -40],
      ['maravedis', -30],
    ]);
    expect(primero.estado.ordenes[0]).toMatchObject({ estado: 'en curso', turnosHechos: 1 });
    expect(comarcaDe(primero.estado, VEGA).duenyo).toBeNull();

    const segundo = turno(primero.estado);
    expect(segundo.estado.ordenes[0]).toMatchObject({ estado: 'en curso', turnosHechos: 2 });
    expect(comarcaDe(segundo.estado, VEGA).duenyo).toBeNull();

    const tercero = turno(segundo.estado);
    expect(tercero.estado.ordenes).toHaveLength(0);
    expect(comarcaDe(tercero.estado, VEGA)).toMatchObject({
      duenyo: UNO,
      lealtad: 60,
      influencias: {},
      presenciaSeguida: {},
      ultimoRegalo: {},
      exDuenyo: null,
    });
    expect(jugadorDe(tercero.estado, UNO).conocimiento[VEGA]?.nivel).toBe('propia');
    expect(tercero.sucesos.some((s) => s.tipo === 'incorporar.completa' && s.jugador === UNO)).toBe(
      true,
    );
    expect(tercero.sucesos.some((s) => s.tipo === 'comarca.incorporada')).toBe(true);
  });

  it('conserva la poblacion de la comarca', () => {
    const estado = conComarca(conInfluencia({ [UNO]: 70 }), VEGA, { poblacion: 33 });
    const { sucesos } = turno({ ...estado, ordenes: [enCurso(incorporar(estado.turno), 2)] });
    expect(sucesos.find((s) => s.tipo === 'incorporar.completa')?.datos).toMatchObject({
      vecinos: 33,
    });
  });

  it('espera con su motivo mientras no se cumplan los requisitos y arranca sola cuando se cumplen', () => {
    const estado = conInfluencia({ [UNO]: 50 });
    const esperando = turno(estado, [incorporar(estado.turno)]).estado;
    expect(esperando.ordenes[0]).toMatchObject({
      estado: 'en espera',
      motivoEspera: 'influencia-baja',
    });
    // Nada se ha pagado: sigue reservado.
    expect(jugadorDe(esperando, UNO).reservado).toMatchObject({ pan: 40, maravedis: 30 });

    const subida = conComarca(esperando, VEGA, { influencias: { [UNO]: 70 } });
    const despues = turno(subida).estado;
    expect(despues.ordenes[0]).toMatchObject({ estado: 'en curso', turnosHechos: 1 });
    expect(jugadorDe(despues, UNO).reservado).toMatchObject({ pan: 0, maravedis: 0 });
  });

  it('se cancela sin coste si la comarca ya tiene dueño', () => {
    const estado = conComarca(conInfluencia({}), VEGA, { duenyo: DOS });
    const { estado: despues, sucesos } = turno(estado, [incorporar(estado.turno)]);
    expect(despues.ordenes).toHaveLength(0);
    expect(jugadorDe(despues, UNO).reservado).toMatchObject({ pan: 0, maravedis: 0 });
    expect(
      sucesos.some((s) => s.tipo === 'orden.estado' && s.datos['motivo'] === 'comarca-con-duenyo'),
    ).toBe(true);
  });

  it('si mientras corre otro se queda la comarca, se cancela y devuelve todo el coste', () => {
    const estado = conComarca(conInfluencia({}), VEGA, { duenyo: DOS });
    const orden = enCurso(incorporar(estado.turno), 1);
    const { estado: despues, sucesos } = turno({ ...estado, ordenes: [orden] });
    expect(despues.ordenes).toHaveLength(0);
    const devuelto = sucesos.filter(
      (s) => s.tipo === 'almacen.cambio' && String(s.datos['motivo']).startsWith('devolucion'),
    );
    expect(devuelto.map((s) => [s.datos['recurso'], s.datos['delta']])).toEqual([
      ['pan', 40],
      ['maravedis', 30],
    ]);
  });

  it('una segunda orden del mismo jugador sobre la misma comarca se cancela', () => {
    const estado = conInfluencia({ [UNO]: 70 });
    const primera = incorporar(estado.turno);
    const segunda = incorporar(estado.turno);
    const { estado: despues, sucesos } = turno(estado, [primera, segunda]);
    expect(despues.ordenes.map((o) => o.estado)).toEqual(['en curso']);
    expect(
      sucesos.some((s) => s.tipo === 'orden.estado' && s.datos['motivo'] === 'orden-duplicada'),
    ).toBe(true);
    expect(jugadorDe(despues, UNO).reservado).toMatchObject({ pan: 0, maravedis: 0 });
  });

  it('dos jugadores no pueden empezar a la vez sobre la misma comarca: solo uno cumple el requisito', () => {
    const estado = conInfluencia({ [UNO]: 75, [DOS]: 60 }, { conDos: true });
    const conCapital = conComarca(estado, 'prueba-costa', { duenyo: DOS });
    const { estado: despues } = turno(conCapital, [
      incorporar(estado.turno, { jugador: UNO }),
      incorporar(estado.turno, { jugador: DOS }),
    ]);
    const porJugador = Object.fromEntries(despues.ordenes.map((o) => [o.jugador, o.estado]));
    expect(porJugador).toEqual({ [UNO]: 'en curso', [DOS]: 'en espera' });
  });
});

describe('la disputa dentro de la fase', () => {
  const enLaVega = { donde: 'comarca', comarca: c(VEGA) } as const;
  const provisiones = recursos({ pan: 20, sal: 5 });

  /**
   * Dos ordenes que llegan a su ultimo turno a la vez, como en una partida guardada. Los dos tienen
   * una recua presente y una comarca propia vecina: la influencia se actualiza justo antes de la
   * disputa, y asi ambos suman lo mismo y un empate sobrevive a esa actualizacion.
   */
  function escenarioDeDisputa(
    influencias: Record<string, number>,
    presencias: Record<string, number> = {},
  ): EstadoPartida {
    const base0 = escenario({
      conDos: true,
      recuas: [
        recua('recua-1', {
          jugador: UNO,
          situacion: enLaVega,
          cometido: 'presencia',
          carga: provisiones,
        }),
        recua('recua-2', {
          jugador: DOS,
          situacion: enLaVega,
          cometido: 'presencia',
          carga: provisiones,
        }),
      ],
    });
    const estado = conComarca(conComarca(base0, 'prueba-rio', { duenyo: DOS }), VEGA, {
      influencias,
      presenciaSeguida: presencias,
    });
    const ordenes: Orden[] = [UNO, DOS].map((jugador) => ({
      ...incorporar(estado.turno, { jugador }),
      estado: 'en curso',
      turnosHechos: 2,
    }));
    return { ...estado, ordenes };
  }

  it('gana el de mas influencia y el otro recupera el coste entero y sabe quien gano', () => {
    const estado = escenarioDeDisputa({ [UNO]: 70, [DOS]: 80 });
    const antes = jugadorDe(estado, UNO).almacen;
    const { estado: despues, sucesos } = turno(estado);
    expect(comarcaDe(despues, VEGA).duenyo).toBe(DOS);
    expect(despues.ordenes).toHaveLength(0);
    // El perdedor recupera 40 de pan y 30 mrs.
    const devuelto = sucesos.filter(
      (s) =>
        s.tipo === 'almacen.cambio' &&
        s.jugador === UNO &&
        String(s.datos['motivo']).startsWith('devolucion'),
    );
    expect(devuelto.map((s) => [s.datos['recurso'], s.datos['delta']])).toEqual([
      ['pan', 40],
      ['maravedis', 30],
    ]);
    expect(jugadorDe(despues, UNO).almacen.pan).toBeGreaterThan(antes.pan - 100);
    const perdida = sucesos.find((s) => s.tipo === 'incorporar.perdida');
    expect(perdida).toMatchObject({
      jugador: UNO,
      comarca: VEGA,
      datos: { ganador: DOS, nombre: 'Casa Dos' },
    });
    expect(sucesos.filter((s) => s.tipo === 'incorporar.completa').map((s) => s.jugador)).toEqual([
      DOS,
    ]);
  });

  it('con la misma influencia gana el que lleva mas turnos seguidos de presencia', () => {
    const { estado: a } = turno(
      escenarioDeDisputa({ [UNO]: 70, [DOS]: 70 }, { [UNO]: 2, [DOS]: 6 }),
    );
    expect(comarcaDe(a, VEGA).duenyo).toBe(DOS);
    const { estado: b } = turno(
      escenarioDeDisputa({ [UNO]: 70, [DOS]: 70 }, { [UNO]: 6, [DOS]: 2 }),
    );
    expect(comarcaDe(b, VEGA).duenyo).toBe(UNO);
  });

  it('con todo empatado decide la huella del turno, y es la de la regla pura', () => {
    let vistos = new Set<string | null>();
    for (let semillaN = 0; semillaN < 12; semillaN += 1) {
      const estado = {
        ...escenarioDeDisputa({ [UNO]: 70, [DOS]: 70 }, { [UNO]: 3, [DOS]: 3 }),
        semilla: `s${String(semillaN)}`,
      };
      const esperado = ganadorDeIncorporacion(
        [
          { jugador: UNO, influencia: 73, presenciaSeguida: 4 },
          { jugador: DOS, influencia: 73, presenciaSeguida: 4 },
        ],
        estado.semilla,
        estado.turno,
        VEGA,
      );
      const { estado: despues } = turno(estado);
      expect(comarcaDe(despues, VEGA).duenyo).toBe(esperado);
      vistos = vistos.add(esperado);
    }
    expect(vistos.size).toBe(2);
  });

  it('barajar las ordenes no cambia quien gana', () => {
    const estado = escenarioDeDisputa({ [UNO]: 70, [DOS]: 70 }, { [UNO]: 3, [DOS]: 3 });
    const huella = turno(estado).estado.huellaTurnoAnterior;
    const alReves = { ...estado, ordenes: [...estado.ordenes].reverse() };
    expect(turno(alReves).estado.huellaTurnoAnterior).toBe(huella);
  });
});

describe('previsionIncorporar', () => {
  function conPan(estado: EstadoPartida, llano: number, vega: number): EstadoPartida {
    const uno = conComarca(estado, 'prueba-llano', {
      poblacion: 40,
      produccionUltimoTurno: recursos({ pan: llano }),
    });
    return conComarca(uno, VEGA, {
      poblacion: 20,
      influencias: { [UNO]: 70 },
      produccionUltimoTurno: recursos({ pan: vega }),
    });
  }

  it('el balance de pan cuenta lo producido, la gente y las cuadrillas, sin merma', () => {
    const estado = conPan(escenario(), 12, 6);
    // 12 de pan contra 40 vecinos que comen 0,25 cada uno.
    expect(balancePanMil(estado, UNO, reglas)).toBe(12 * MIL - 40 * 250);
    const conObra = {
      ...estado,
      obras: {
        'obra-1': {
          id: 'obra-1',
          jugador: UNO,
          comarca: c('prueba-llano'),
          tipo: 'edificio',
          que: 'granja',
          hacia: null,
          avanceMil: 0,
          avanceNecesarioMil: 2000,
          entregado: recursos(),
          costeTotal: recursos(),
          abandonada: false,
        },
      },
    } as unknown as EstadoPartida;
    expect(balancePanMil(conObra, UNO, reglas)).toBe(12 * MIL - 40 * 250 - 2 * MIL);
  });

  it('coincide con lo que pasa al incorporar: balance, reserva, administracion y comarca', () => {
    const estado: EstadoPartida = {
      ...conPan(escenario(), 12, 6),
      ordenes: [{ ...incorporar(7), estado: 'en curso', turnosHechos: 2 }],
    };
    const prevision = previsionIncorporar(estado, c(VEGA), UNO, mundo, reglas);
    expect(prevision.costeTotal).toEqual(reglas.influencia.costeIncorporar);
    expect(prevision.balancePanAntesMil).toBe(12 * MIL - 40 * 250);
    // Con la vega: 18 de pan contra 60 vecinos.
    expect(prevision.balancePanDespuesMil).toBe(18 * MIL - 60 * 250);
    expect(prevision.turnosDeReservaDespues).toBeNull();
    expect(prevision.administracionExtra).toBeGreaterThan(0);

    // Se corre la fase 8 de verdad y se mira como queda el dominio.
    const ctx = crearContexto(estado, [], mundo, reglas);
    ctx.fase = 'territorio';
    faseTerritorio(ctx);
    expect(comarcaDe(ctx.estado, VEGA).duenyo).toBe(UNO);
    expect(balancePanMil(ctx.estado, UNO, reglas)).toBe(prevision.balancePanDespuesMil);

    const administrar = (e: EstadoPartida): number =>
      costesDeAdministracion(
        comarcasDe(e, UNO),
        jugadorDe(e, UNO),
        mundo,
        reglas,
        e.caminos,
      ).reduce((total, coste) => total + coste.coste, 0);
    expect(administrar(ctx.estado) - administrar(estado)).toBe(prevision.administracionExtra);

    // Y la transformacion pura que usa la prevision es exactamente lo que hizo la fase.
    const esperado = estadoTrasIncorporar(estado, c(VEGA), UNO, reglas);
    expect(comarcaDe(ctx.estado, VEGA)).toEqual(comarcaDe(esperado, VEGA));
    expect(jugadorDe(ctx.estado, UNO).conocimiento[VEGA]).toEqual(
      jugadorDe(esperado, UNO).conocimiento[VEGA],
    );
  });

  it('con balance negativo dice cuantos turnos aguanta la reserva', () => {
    const estado = conPan(escenario({ almacen: { pan: 500 } }), 0, 0);
    const prevision = previsionIncorporar(estado, c(VEGA), UNO, mundo, reglas);
    expect(prevision.balancePanAntesMil).toBe(-40 * 250);
    expect(prevision.balancePanDespuesMil).toBe(-60 * 250);
    // 500 de pan a 15 por turno: 33 turnos.
    expect(prevision.turnosDeReservaDespues).toBe(turnosDeReserva(500 * MIL, -60 * 250));
    expect(prevision.turnosDeReservaDespues).toBe(33);
  });

  it('no toca el estado que se le da', () => {
    const estado = conPan(escenario(), 12, 6);
    const copia = JSON.stringify(estado);
    previsionIncorporar(estado, c(VEGA), UNO, mundo, reglas);
    expect(JSON.stringify(estado)).toBe(copia);
  });
});
