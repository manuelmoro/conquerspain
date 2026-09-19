// Tradiciones (T-042): el catalogo, las tres rondas y sus condiciones, la orden `tradicion` y sus
// rechazos, la acumulacion con la casa, los puntos de extension nuevos y lo que ninguna tradicion
// puede romper.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { aplicar } from '../src/cambios.ts';
import { crearContexto } from '../src/contexto.ts';
import { CASAS_DE_OFICIO, MODIFICADORES_NEUTROS } from '../src/datos/casas.ts';
import { TRADICIONES } from '../src/datos/tradiciones.ts';
import { bastimentoDe } from '../src/reglas/bastimento.ts';
import { costesDeAdministracion } from '../src/reglas/administracion.ts';
import {
  componerModificadores,
  modificadoresDe,
  permisosDe,
  prohibicionesDe,
} from '../src/reglas/casas/index.ts';
import { cuadrillasDe } from '../src/reglas/cuadrillas.ts';
import { fuentesDeInfluencia } from '../src/reglas/influencia.ts';
import { factorAperos, siguienteAgotamiento } from '../src/reglas/produccion.ts';
import type { LogrosDelJugador } from '../src/reglas/tradiciones.ts';
import {
  impedimentoDeTradicion,
  logrosDe,
  opcionesDeTradicion,
  rondaCumplida,
} from '../src/reglas/tradiciones.ts';
import type { Suceso } from '../src/tipos/cronica.ts';
import type { EstadoJugador, EstadoPartida } from '../src/tipos/estado.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import type { Casa, RondaDeTradicion, TablasDeReglas } from '../src/tipos/reglas.ts';
import {
  CASAS,
  COMPOSICION_DE_MODIFICADORES,
  CRITERIOS_DE_TRADICION,
  RONDAS_DE_TRADICION,
} from '../src/tipos/reglas.ts';
import { multiplicarFactores } from '../src/utiles/enteros.ts';
import { validarEstado } from '../src/validacion/validarEstado.ts';
import { explicar } from '../src/validacion/validador.ts';
import { validarTablas } from '../src/validacion/validarTablas.ts';
import {
  DOS,
  UNO,
  base,
  c,
  comarcaDe,
  conComarca,
  escenario,
  mundo,
  recursos,
  reglas,
  turno,
} from './recuas.ts';

/** Las tablas de las pruebas con las casas y las tradiciones de verdad. */
const REAL: TablasDeReglas = { ...reglas, casas: CASAS_DE_OFICIO };

const TODAS_ABIERTAS: EstadoJugador['rondas'] = { renombre: 2, fama: 3, linaje: 4 };

/** Un escenario con el jugador de la casa, las tradiciones y las rondas dadas. */
function conTradiciones(
  casa: Casa,
  tradiciones: readonly string[] = [],
  rondas: EstadoJugador['rondas'] = {},
  estado: EstadoPartida = escenario(),
): EstadoPartida {
  const jugador = estado.jugadores[UNO];
  if (jugador === undefined) throw new Error('falta el jugador');
  return {
    ...estado,
    jugadores: { ...estado.jugadores, [UNO]: { ...jugador, casa, tradiciones, rondas } },
  };
}

function jugadorDe(estado: EstadoPartida, id = UNO): EstadoJugador {
  const jugador = estado.jugadores[id];
  if (jugador === undefined) throw new Error(`falta el jugador ${id}`);
  return jugador;
}

function elegir(estado: EstadoPartida, tradicion: string, coste = {}): Orden {
  return { ...base(estado.turno, coste), tipo: 'tradicion', tradicion };
}

function sucesos(lista: readonly Suceso[], tipo: string): Suceso[] {
  return lista.filter((s) => s.tipo === tipo);
}

function cancelaciones(lista: readonly Suceso[]): string[] {
  return sucesos(lista, 'orden.estado')
    .filter((s) => s.datos['estado'] === 'cancelada')
    .map((s) => String(s.datos['motivo']));
}

const entradas = Object.entries(TRADICIONES);
const deCasaYRonda = (casa: Casa, ronda: RondaDeTradicion) =>
  entradas.filter(([, t]) => t.casa === casa && t.ronda === ronda);

// ——— El catalogo ———————————————————————————————————————————————————————————

describe('el catálogo de tradiciones', () => {
  it('valida con las tablas del juego', () => {
    const resultado = validarTablas(structuredClone(REAL));
    expect(explicar(resultado.ok ? [] : resultado.errores)).toBe('');
  });

  it('hay 72: tres por casa y ronda, una de cada criterio', () => {
    expect(entradas).toHaveLength(72);
    for (const casa of CASAS) {
      for (const ronda of RONDAS_DE_TRADICION) {
        const criterios = deCasaYRonda(casa, ronda).map(([, t]) => t.criterio);
        expect(criterios.sort(), `${casa} · ${ronda}`).toEqual([...CRITERIOS_DE_TRADICION].sort());
      }
    }
  });

  it('todas tienen nombre propio, efecto en una frase y nota histórica', () => {
    for (const casa of CASAS) {
      const nombres = entradas.filter(([, t]) => t.casa === casa).map(([, t]) => t.nombre);
      expect(new Set(nombres).size, casa).toBe(9);
    }
    for (const [id, t] of entradas) {
      expect(t.nota.length, id).toBeGreaterThanOrEqual(60);
      expect(t.descripcion.length, id).toBeGreaterThanOrEqual(30);
      expect(t.nota, id).not.toBe(t.descripcion);
    }
  });

  it('las que dependen del conflicto o de otro jugador están desactivadas y dicen hasta cuándo', () => {
    const desactivadas = entradas
      .filter(([, t]) => t.desactivada)
      .map(([id, t]) => [id, t.pendienteDe]);
    expect(desactivadas.sort()).toEqual([
      ['arrieros-correo', 'T-102'],
      ['ferrones-armas', 'T-120'],
      ['mercaderes-banca', 'T-103'],
      ['salineros-alfoli', 'T-102'],
    ]);
    // No cambian nada mientras tanto: si alguien las eligiera por error, no harian efecto.
    for (const [id] of desactivadas) {
      const t = TRADICIONES[String(id)];
      expect(t?.modificadores).toEqual({});
      expect(t?.permisos).toEqual({});
      expect(t?.prohibiciones).toEqual({});
    }
  });

  it('las desactivadas no aparecen como opción, y cada ronda ofrece al menos dos cartas', () => {
    for (const casa of CASAS) {
      for (const ronda of RONDAS_DE_TRADICION) {
        const opciones = opcionesDeTradicion(casa, ronda, REAL);
        expect(opciones.length, `${casa} · ${ronda}`).toBeGreaterThanOrEqual(2);
        for (const id of opciones) expect(TRADICIONES[id]?.desactivada).toBe(false);
      }
    }
    expect(opcionesDeTradicion('ferrones', 'renombre', REAL)).not.toContain('ferrones-armas');
  });

  it('ninguna es «lo mismo» que otra de su casa', () => {
    for (const casa of CASAS) {
      const efectos = entradas
        .filter(([, t]) => t.casa === casa && !t.desactivada)
        .map(([, t]) => JSON.stringify([t.modificadores, t.permisos, t.prohibiciones]));
      expect(new Set(efectos).size, casa).toBe(efectos.length);
    }
  });

  it('el validador rechaza dos tradiciones de una casa que fijan lo mismo', () => {
    const tablas = structuredClone(REAL) as unknown as Record<string, Record<string, unknown>>;
    const tradiciones = tablas['tradiciones'] as Record<string, Record<string, unknown>>;
    tradiciones['mesta-lanas-finas'] = {
      ...tradiciones['mesta-lanas-finas'],
      modificadores: { mermaPanMil: 10 },
    };
    const resultado = validarTablas(tablas);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(resultado.errores.map((e) => e.ruta)).toContain(
        'tradiciones.mesta-positos.modificadores.mermaPanMil',
      );
    }
  });

  it('el validador rechaza una desactivada sin tarea, o una activa con ella', () => {
    const tablas = structuredClone(REAL) as unknown as Record<string, Record<string, unknown>>;
    const tradiciones = tablas['tradiciones'] as Record<string, Record<string, unknown>>;
    tradiciones['ferrones-armas'] = { ...tradiciones['ferrones-armas'], pendienteDe: null };
    tradiciones['mesta-positos'] = { ...tradiciones['mesta-positos'], pendienteDe: 'T-999' };
    const resultado = validarTablas(tablas);
    expect(resultado.ok ? [] : resultado.errores.map((e) => e.ruta)).toEqual([
      'tradiciones.ferrones-armas.pendienteDe',
      'tradiciones.mesta-positos.pendienteDe',
    ]);
  });
});

// ——— Las rondas ————————————————————————————————————————————————————————————

describe('las rondas se abren exactamente con sus condiciones', () => {
  const nada: LogrosDelJugador = {
    comarcas: 1,
    vecinos: 40,
    obraMayorTerminada: false,
    prestigio: 0,
    turno: 1,
  };
  const abre = (ronda: RondaDeTradicion, logros: Partial<LogrosDelJugador>): boolean =>
    rondaCumplida(REAL.rondas[ronda], { ...nada, ...logros });

  it('renombre: 3 comarcas o 150 vecinos', () => {
    expect(abre('renombre', {})).toBe(false);
    expect(abre('renombre', { comarcas: 2 })).toBe(false);
    expect(abre('renombre', { comarcas: 3 })).toBe(true);
    expect(abre('renombre', { vecinos: 149 })).toBe(false);
    expect(abre('renombre', { vecinos: 150 })).toBe(true);
    // Lo de las otras rondas no la abre.
    expect(abre('renombre', { obraMayorTerminada: true, prestigio: 5000, turno: 500 })).toBe(false);
  });

  it('fama: la primera obra mayor terminada o 400 de prestigio', () => {
    expect(abre('fama', {})).toBe(false);
    expect(abre('fama', { obraMayorTerminada: true })).toBe(true);
    expect(abre('fama', { prestigio: 399 })).toBe(false);
    expect(abre('fama', { prestigio: 400 })).toBe(true);
    expect(abre('fama', { comarcas: 30, vecinos: 5000, turno: 500 })).toBe(false);
  });

  it('linaje: turno 150 o 1 000 de prestigio', () => {
    expect(abre('linaje', {})).toBe(false);
    expect(abre('linaje', { turno: 149 })).toBe(false);
    expect(abre('linaje', { turno: 150 })).toBe(true);
    expect(abre('linaje', { prestigio: 999 })).toBe(false);
    expect(abre('linaje', { prestigio: 1000 })).toBe(true);
    expect(abre('linaje', { obraMayorTerminada: true, comarcas: 30 })).toBe(false);
  });

  it('los logros se miden sobre el dominio y la obra mayor sale del registro del jugador', () => {
    const estado = conComarca(
      conComarca(escenario({ conDos: true }), 'prueba-vega', { duenyo: UNO, poblacion: 60 }),
      'prueba-costa',
      { duenyo: DOS },
    );
    expect(logrosDe(estado, jugadorDe(estado), 9)).toEqual({
      comarcas: 2,
      vecinos: 100,
      obraMayorTerminada: false,
      prestigio: 0,
      turno: 9,
    });
    const jugador = jugadorDe(estado);
    const conObra = {
      ...jugador,
      registro: { ...jugador.registro, obrasMayores: { muralla: 1 } },
    };
    expect(logrosDe(estado, conObra, 9).obraMayorTerminada).toBe(true);
  });

  it('el motor abre renombre al llegar a 150 vecinos, lo anuncia con sus cartas y no lo repite', () => {
    const pocos = turno(conTradiciones('mesta'), [], REAL);
    expect(sucesos(pocos.sucesos, 'tradicion.ronda-abierta')).toEqual([]);

    const estado = conComarca(conTradiciones('mesta'), 'prueba-llano', { poblacion: 200 });
    const primero = turno(estado, [], REAL);
    const [abierta] = sucesos(primero.sucesos, 'tradicion.ronda-abierta');
    expect(abierta?.jugador).toBe(UNO);
    expect(abierta?.datos).toEqual({
      ronda: 'renombre',
      opciones: 'mesta-concejo-fuerte,mesta-ganado-mayor,mesta-lanas-finas',
    });
    expect(jugadorDe(primero.estado).rondas).toEqual({ renombre: estado.turno });

    const segundo = turno(primero.estado, [], REAL);
    expect(sucesos(segundo.sucesos, 'tradicion.ronda-abierta')).toEqual([]);
    // Perder el hito no la cierra.
    const menguado = conComarca(segundo.estado, 'prueba-llano', { poblacion: 40 });
    expect(jugadorDe(turno(menguado, [], REAL).estado).rondas.renombre).toBe(estado.turno);
  });

  it('el motor abre renombre con tres comarcas', () => {
    const estado = conComarca(
      conComarca(conTradiciones('monjes'), 'prueba-vega', { duenyo: UNO }),
      'prueba-costa',
      { duenyo: UNO },
    );
    const resultado = turno(estado, [], REAL);
    expect(
      sucesos(resultado.sucesos, 'tradicion.ronda-abierta').map((s) => s.datos['ronda']),
    ).toEqual(['renombre']);
  });

  it('el motor abre fama el turno en que el jugador termina su primera obra mayor', () => {
    const obra = {
      id: 'obra-1',
      jugador: UNO,
      comarca: c('prueba-llano'),
      tipo: 'obra mayor',
      que: 'muralla',
      hacia: null,
      avanceMil: 17500,
      avanceNecesarioMil: 18000,
      entregado: recursos(),
      costeTotal: recursos(),
      abandonada: false,
    } as const;
    const estado = {
      ...conTradiciones('canteros'),
      obras: { 'obra-1': obra },
    } as unknown as EstadoPartida;
    const resultado = turno(estado, [], REAL);
    expect(sucesos(resultado.sucesos, 'hito.obra-mayor')).toHaveLength(1);
    expect(
      sucesos(resultado.sucesos, 'tradicion.ronda-abierta').map((s) => s.datos['ronda']),
    ).toEqual(['fama']);
  });

  it('el motor abre linaje en el turno 150', () => {
    const antes = turno(conTradiciones('arrieros', [], {}, escenario({ turno: 149 })), [], REAL);
    expect(sucesos(antes.sucesos, 'tradicion.ronda-abierta')).toEqual([]);
    const resultado = turno(
      conTradiciones('arrieros', [], {}, escenario({ turno: 150 })),
      [],
      REAL,
    );
    expect(
      sucesos(resultado.sucesos, 'tradicion.ronda-abierta').map((s) => s.datos['ronda']),
    ).toEqual(['linaje']);
  });
});

// ——— La orden ————————————————————————————————————————————————————————————————

describe('la orden tradicion', () => {
  const abierta = (casa: Casa, tradiciones: readonly string[] = []) =>
    conTradiciones(casa, tradiciones, { renombre: 2 });

  it('elige para siempre, lo anuncia y se nota en los modificadores', () => {
    const estado = abierta('mesta');
    const resultado = turno(estado, [elegir(estado, 'mesta-lanas-finas')], REAL);
    expect(cancelaciones(resultado.sucesos)).toEqual([]);
    expect(jugadorDe(resultado.estado).tradiciones).toEqual(['mesta-lanas-finas']);
    const [elegida] = sucesos(resultado.sucesos, 'tradicion.elegida');
    expect(elegida?.datos).toEqual({ tradicion: 'mesta-lanas-finas', ronda: 'renombre' });
    expect(modificadoresDe(resultado.estado, UNO, REAL).lanaEsquileoMil).toBe(1625);
    // La orden no cuesta nada y sale del estado al terminar.
    expect(jugadorDe(resultado.estado).almacen).toEqual(
      turno(estado, [], REAL).estado.jugadores[UNO]?.almacen,
    );
    expect(resultado.estado.ordenes).toEqual([]);
  });

  it('es irreversible: una segunda eleccion en la misma ronda se rechaza', () => {
    const estado = abierta('mesta', ['mesta-lanas-finas']);
    const resultado = turno(estado, [elegir(estado, 'mesta-ganado-mayor')], REAL);
    expect(cancelaciones(resultado.sucesos)).toEqual(['ronda-ya-elegida']);
    expect(jugadorDe(resultado.estado).tradiciones).toEqual(['mesta-lanas-finas']);
    // Ni siquiera el motor puede colarla por detras.
    const ctx = crearContexto(estado, [], mundo, REAL);
    expect(() => {
      aplicar(ctx, { tipo: 'tradicion', jugador: UNO, tradicion: 'mesta-ganado-mayor' });
    }).toThrow(/ronda-ya-elegida/);
  });

  it('se rechaza con la ronda cerrada, aunque se abra ese mismo turno', () => {
    const cerrada = conTradiciones('mesta');
    expect(
      cancelaciones(turno(cerrada, [elegir(cerrada, 'mesta-lanas-finas')], REAL).sucesos),
    ).toEqual(['ronda-cerrada']);
    // Primero se elige y despues se abre: las cartas se ven antes de elegir.
    const seAbre = conComarca(cerrada, 'prueba-llano', { poblacion: 200 });
    const resultado = turno(seAbre, [elegir(seAbre, 'mesta-lanas-finas')], REAL);
    expect(cancelaciones(resultado.sucesos)).toEqual(['ronda-cerrada']);
    expect(jugadorDe(resultado.estado).rondas.renombre).toBe(seAbre.turno);
  });

  it('se rechaza la de otra casa, la desactivada, la desconocida y la que cuesta algo', () => {
    const mesta = abierta('mesta');
    const ferrones = abierta('ferrones');
    const motivos = (estado: EstadoPartida, orden: Orden) =>
      cancelaciones(turno(estado, [orden], REAL).sucesos);
    expect(motivos(mesta, elegir(mesta, 'ferrones-vena-profunda'))).toEqual([
      'tradicion-de-otra-casa',
    ]);
    expect(motivos(ferrones, elegir(ferrones, 'ferrones-armas'))).toEqual([
      'tradicion-desactivada',
    ]);
    expect(motivos(mesta, elegir(mesta, 'mesta-lanas-gruesas'))).toEqual(['tradicion-desconocida']);
    expect(motivos(mesta, elegir(mesta, 'mesta-lanas-finas', { maravedis: 5 }))).toEqual([
      'coste-incoherente',
    ]);
  });

  it('dos elecciones para la misma ronda en el mismo turno se cancelan las dos', () => {
    const estado = abierta('mesta');
    const resultado = turno(
      estado,
      [elegir(estado, 'mesta-lanas-finas'), elegir(estado, 'mesta-ganado-mayor')],
      REAL,
    );
    expect(cancelaciones(resultado.sucesos)).toEqual(['eleccion-ambigua', 'eleccion-ambigua']);
    expect(jugadorDe(resultado.estado).tradiciones).toEqual([]);
  });

  it('en rondas distintas se puede elegir en el mismo turno', () => {
    const estado = conTradiciones('monjes', [], TODAS_ABIERTAS);
    const resultado = turno(
      estado,
      [
        elegir(estado, 'monjes-scriptorium'),
        elegir(estado, 'monjes-reforma'),
        elegir(estado, 'monjes-cister'),
      ],
      REAL,
    );
    expect(cancelaciones(resultado.sucesos)).toEqual([]);
    expect([...jugadorDe(resultado.estado).tradiciones].sort()).toEqual([
      'monjes-cister',
      'monjes-reforma',
      'monjes-scriptorium',
    ]);
  });

  it('impedimentoDeTradicion es la misma regla que aplica el motor', () => {
    const jugador = jugadorDe(abierta('salineros', ['salineros-almadraba']));
    expect(impedimentoDeTradicion(jugador, 'salineros-eras-de-sal', REAL)).toBe('ronda-cerrada');
    expect(impedimentoDeTradicion(jugador, 'salineros-almadraba', REAL)).toBe('ronda-ya-elegida');
    expect(impedimentoDeTradicion(jugador, 'salineros-alfoli', REAL)).toBe('tradicion-desactivada');
  });
});

// ——— La acumulacion ——————————————————————————————————————————————————————————

describe('las tradiciones se acumulan con la casa', () => {
  /** Una clave valida para cada modificador que es una tabla. */
  const CLAVE: Readonly<Record<string, string>> = {
    produccionMil: 'pan',
    costeEdificioMil: 'granja',
    nivelMaximoEdificio: 'huerta',
    potencialMinimoEdificio: 'ferreria',
    agotamientoMil: 'monte',
    produccionEdificioMil: 'lonja',
    produccionEdificioEnVegaMil: 'huerta',
    edificiosPorRequisito: 'ferreria',
    costeObraMayorMil: 'puente',
    avanceObraMayorMil: 'catedral',
  };
  const componer = (casa: Record<string, unknown>, tradicion: Record<string, unknown>) =>
    componerModificadores({ ...MODIFICADORES_NEUTROS, ...casa }, tradicion) as unknown as Record<
      string,
      unknown
    >;

  it('cada campo se compone como dice su tabla: factor, suma o valor fijo', () => {
    for (const [campo, modo] of Object.entries(COMPOSICION_DE_MODIFICADORES)) {
      const neutro: unknown = (MODIFICADORES_NEUTROS as unknown as Record<string, unknown>)[campo];
      if (typeof neutro === 'boolean') {
        expect(modo, campo).toBe('fija');
        expect(componer({ [campo]: false }, { [campo]: true })[campo], campo).toBe(true);
        expect(componer({ [campo]: true }, {})[campo], campo).toBe(true);
      } else if (typeof neutro === 'number') {
        const esperado = { factor: 1800, suma: 2700, fija: 1200 }[modo];
        expect(componer({ [campo]: 1500 }, { [campo]: 1200 })[campo], campo).toBe(esperado);
        expect(componer({ [campo]: 1500 }, {})[campo], campo).toBe(1500);
      } else {
        const clave = CLAVE[campo];
        expect(clave, `falta una clave de prueba para ${campo}`).toBeDefined();
        if (clave === undefined) continue;
        const casa = { [campo]: { [clave]: 1500 } };
        const esperado = modo === 'factor' ? 1800 : 1200;
        expect(componer(casa, { [campo]: { [clave]: 1200 } })[campo], campo).toEqual({
          [clave]: esperado,
        });
        // Lo que la casa no tocaba parte de 1000 si es factor.
        expect(componer({}, { [campo]: { [clave]: 1200 } })[campo], campo).toEqual({
          [clave]: 1200,
        });
        expect(componer(casa, {})[campo], campo).toEqual({ [clave]: 1500 });
      }
    }
  });

  it('dos tradiciones y la casa: la lana de la Mesta', () => {
    const estado = conTradiciones('mesta', ['mesta-lanas-finas', 'mesta-lana-para-flandes']);
    const m = modificadoresDe(estado, UNO, REAL);
    // 1250 de la casa × 1,3 × 1,25.
    expect(m.lanaEsquileoMil).toBe(multiplicarFactores(1250, [1300, 1250]));
    expect(m.costeRebanyoMil).toBe(600);
    expect(m.crecimientoMil).toBe(900);
    // Lo que ninguna toca sigue siendo de la casa.
    expect(m.produccionMil).toEqual({ pan: 700 });
  });

  it('una tradición compensa el límite sin borrar la casa', () => {
    const hortelanos = modificadoresDe(
      conTradiciones('hortelanos', ['hortelanos-azud-mayor']),
      UNO,
      REAL,
    );
    expect(hortelanos.laborFueraDeVegaMil).toBe(1000);
    expect(hortelanos.produccionEdificioEnVegaMil).toEqual({ huerta: 1500 });

    const mesta = conTradiciones('mesta', ['mesta-ganado-mayor']);
    expect(prohibicionesDe(mesta, UNO, REAL).roturar).toBe(false);
    expect(permisosDe(mesta, UNO, REAL).pasoFrancoPorCanyada).toBe(true);
    expect(prohibicionesDe(conTradiciones('mesta'), UNO, REAL).roturar).toBe(true);

    const monjes = conTradiciones('monjes', ['monjes-senyorio-abacial']);
    expect(prohibicionesDe(monjes, UNO, REAL)).toEqual({
      ...CASAS_DE_OFICIO.monjes.prohibiciones,
      cargaFiscalDura: false,
    });
  });

  it('el orden en que se eligen no cambia el resultado', () => {
    for (const casa of CASAS) {
      const [a, b, d] = RONDAS_DE_TRADICION.map((ronda) =>
        deCasaYRonda(casa, ronda).map(([id]) => id),
      );
      for (const x of a ?? []) {
        for (const y of b ?? []) {
          for (const z of d ?? []) {
            const uno = modificadoresDe(conTradiciones(casa, [x, y, z]), UNO, REAL);
            const otro = modificadoresDe(conTradiciones(casa, [z, x, y]), UNO, REAL);
            expect(otro, `${x} ${y} ${z}`).toEqual(uno);
          }
        }
      }
    }
  });

  it('una tradición que no está en las tablas es un error claro, no un modificador neutro', () => {
    expect(() => modificadoresDe(conTradiciones('mesta', ['mesta-perdida']), UNO, REAL)).toThrow(
      /no esta en las tablas/,
    );
  });
});

// ——— Los puntos de extension nuevos ————————————————————————————————————————

describe('los puntos de extensión que abren las tradiciones', () => {
  const m = (casa: Casa, tradiciones: readonly string[]) =>
    modificadoresDe(conTradiciones(casa, tradiciones), UNO, REAL);

  it('agotamiento por recurso: la vena profunda agota el hierro a la mitad', () => {
    const comarca = { ...comarcaDe(escenario(), 'prueba-llano'), edificios: { ferreria: 4 } };
    const sin = siguienteAgotamiento(comarca, REAL, m('ferrones', []).agotamientoMil);
    const con = siguienteAgotamiento(
      comarca,
      REAL,
      m('ferrones', ['ferrones-vena-profunda']).agotamientoMil,
    );
    const sube = REAL.produccion.agotamiento.porNivel * 4;
    const baja = REAL.produccion.agotamiento.regeneracion.hierro;
    expect(sin.hierro).toBe(sube - baja);
    expect(con.hierro).toBe(sube / 2 - baja);
  });

  it('cuadrillas extra: el gremio da una más, y nunca quedan menos de una', () => {
    const comarca = comarcaDe(escenario(), 'prueba-llano');
    const base = cuadrillasDe(comarca, REAL);
    expect(cuadrillasDe(comarca, REAL, m('canteros', ['canteros-gremio']).cuadrillasExtra)).toBe(
      base + 1,
    );
    expect(cuadrillasDe(comarca, REAL, -5)).toBe(1);
  });

  it('efecto de los aperos: los maestros de forja sacan un 30 % más de cada nivel', () => {
    const efecto = m('ferrones', ['ferrones-maestros-de-forja']).efectoAperosMil;
    expect(factorAperos(3, REAL)).toBe(1000 + 3 * REAL.produccion.aperoMil);
    expect(factorAperos(3, REAL, efecto)).toBe(1000 + (3 * REAL.produccion.aperoMil * 13) / 10);
  });

  it('administración: el scriptorium rebaja un 30 % cada comarca', () => {
    const coste = (tradiciones: readonly string[]) => {
      const estado = conTradiciones('monjes', tradiciones);
      return costesDeAdministracion(
        [comarcaDe(estado, 'prueba-vega')],
        jugadorDe(estado),
        mundo,
        REAL,
        {},
      )[0]?.coste;
    };
    expect(coste([])).toBe(7);
    expect(coste(['monjes-scriptorium'])).toBe(4);
  });

  it('influencia: el concejo fuerte escala cada fuente, no el desgaste', () => {
    const fuentes = (tradiciones: readonly string[]) => {
      const estado = conTradiciones('mesta', tradiciones);
      return fuentesDeInfluencia(
        {
          comarca: comarcaDe(estado, 'prueba-vega'),
          jugador: jugadorDe(estado),
          actividad: { importe: new Map(), vaciaronElPan: new Set() },
        },
        estado,
        mundo,
        REAL,
      );
    };
    const sin = fuentes([]);
    const con = fuentes(['mesta-concejo-fuerte']);
    expect(sin.vecinas).toBeGreaterThan(0);
    expect(con.vecinas).toBe(multiplicarFactores(sin.vecinas, [1400]));
    expect(con.desgaste).toBe(sin.desgaste);
    expect(con.neto).toBe(
      con.presencia +
        con.vecinas +
        con.mercado +
        con.comercio +
        con.monasterio +
        con.camino -
        con.desgaste -
        con.escasez,
    );
  });

  it('influencia: el regalo al concejo también rinde más', () => {
    const regalo = (tradiciones: readonly string[]) => {
      const estado = conTradiciones('mesta', tradiciones);
      const orden: Orden = {
        ...base(estado.turno, { maravedis: 50 }),
        tipo: 'regalo',
        comarca: c('prueba-vega'),
      };
      return sucesos(turno(estado, [orden], REAL).sucesos, 'influencia.cambio')
        .filter((s) => s.datos['motivo'] === 'regalo al concejo')
        .map((s) => s.datos['delta']);
    };
    const [sin] = regalo([]);
    expect(regalo(['mesta-concejo-fuerte'])).toEqual([multiplicarFactores(Number(sin), [1400])]);
  });

  it('bastimento: las ventas reales dan de comer a las recuas en el camino', () => {
    const bastimento = m('arrieros', ['arrieros-ventas-reales']).bastimentoMil;
    expect(bastimentoDe(3000, 'verano', REAL)).toEqual({ pan: 6, sal: 1 });
    expect(bastimentoDe(3000, 'verano', REAL, bastimento)).toEqual({ pan: 4, sal: 1 });
  });

  it('avance por tipo de obra mayor: el cimborrio dobla el de las catedrales, no el de otras', () => {
    const avance = (que: string, tradiciones: readonly string[]) => {
      const obra = {
        id: 'obra-1',
        jugador: UNO,
        comarca: c('prueba-llano'),
        tipo: 'obra mayor',
        que,
        hacia: null,
        avanceMil: 0,
        avanceNecesarioMil: 60000,
        entregado: recursos(),
        costeTotal: recursos(),
        abandonada: false,
      } as const;
      const estado = {
        ...conTradiciones('canteros', tradiciones, {}, escenario({ turno: 2 })),
        obras: { 'obra-1': obra },
      } as unknown as EstadoPartida;
      return turno(estado, [], REAL).estado.obras['obra-1']?.avanceMil;
    };
    expect(avance('catedral', [])).toBe(1300);
    expect(avance('catedral', ['canteros-cimborrio'])).toBe(2600);
    expect(avance('muralla', ['canteros-cimborrio'])).toBe(1300);
  });

  it('los maravedís de la casa pesan sobre el mercado y los impuestos', () => {
    const ingresos = (tradiciones: readonly string[]) => {
      const estado = conComarca(conTradiciones('monjes', tradiciones), 'prueba-llano', {
        poblacion: 120,
        edificios: { granja: 1, mercado: 1 },
      });
      const [suceso] = sucesos(turno(estado, [], REAL).sucesos, 'produccion.maravedis');
      return suceso?.datos;
    };
    const sin = ingresos([]);
    const con = ingresos(['monjes-hospitalidad']);
    expect(Number(sin?.['mercado'])).toBeGreaterThan(0);
    expect(Number(sin?.['impuestos'])).toBeGreaterThan(0);
    expect(con?.['mercado']).toBe(multiplicarFactores(Number(sin?.['mercado']), [1250]));
    expect(con?.['impuestos']).toBe(multiplicarFactores(Number(sin?.['impuestos']), [1250]));
  });
});

// ——— Lo que ninguna tradicion puede romper ——————————————————————————————————

describe('lo que ninguna tradición puede romper', () => {
  it('cada tradición activa, sola y con las de su casa, deja un estado válido y almacenes sin negativos', () => {
    const casos: [Casa, string[]][] = [];
    for (const [id, t] of entradas) if (!t.desactivada) casos.push([t.casa, [id]]);
    for (const casa of CASAS) {
      casos.push([
        casa,
        RONDAS_DE_TRADICION.map((ronda) => opcionesDeTradicion(casa, ronda, REAL)[0] ?? ''),
      ]);
    }
    for (const [casa, tradiciones] of casos) {
      let estado = conTradiciones(
        casa,
        tradiciones,
        TODAS_ABIERTAS,
        escenario({ turno: 7, almacen: { pan: 300 } }),
      );
      for (let i = 0; i < 4; i += 1) {
        estado = turno(estado, [], REAL).estado;
        for (const cantidad of Object.values(jugadorDe(estado).almacen)) {
          expect(cantidad, tradiciones.join(' ')).toBeGreaterThanOrEqual(0);
        }
      }
      const validado = validarEstado(JSON.parse(JSON.stringify(estado)) as unknown, mundo);
      expect(validado.ok, tradiciones.join(' ')).toBe(true);
    }
  });

  it('ninguna fase lee la tabla de casas por su cuenta: todo pasa por reglas/casas', () => {
    const raiz = fileURLToPath(new URL('../src/', import.meta.url));
    const fuentes: string[] = [];
    const recorrer = (carpeta: string): void => {
      for (const nombre of readdirSync(carpeta)) {
        const ruta = join(carpeta, nombre);
        if (statSync(ruta).isDirectory()) recorrer(ruta);
        else if (ruta.endsWith('.ts')) fuentes.push(ruta.slice(raiz.length));
      }
    };
    recorrer(raiz);
    const lectura = /casas\[[^\]]+\]\.(modificadores|permisos|prohibiciones)/;
    const infractores = fuentes
      .filter((ruta) => !ruta.startsWith('reglas/casas/'))
      .filter((ruta) => lectura.test(readFileSync(join(raiz, ruta), 'utf8')));
    expect(infractores).toEqual([]);
  });
});
