// Poblacion, lealtad, fueros, administracion y traslado de la corte (T-036).
import { describe, expect, it } from 'vitest';

import { crearContexto } from '../src/contexto.ts';
import { fasePoblacion } from '../src/fases/09-poblacion.ts';
import { faseTerritorio } from '../src/fases/08-territorio.ts';
import { costesDeAdministracion } from '../src/reglas/administracion.ts';
import { fuentesDeLealtad } from '../src/reglas/lealtad.ts';
import { crecimientoPosible } from '../src/reglas/poblacion.ts';
import { factorLealtad } from '../src/reglas/produccion.ts';
import type { Suceso } from '../src/tipos/cronica.ts';
import type { EstadoComarca, EstadoJugador, EstadoPartida } from '../src/tipos/estado.ts';
import type { IdComarca } from '../src/tipos/ids.ts';
import type { Mundo } from '../src/tipos/mundo.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import { validarEstado } from '../src/validacion/validarEstado.ts';
import { validarMundo } from '../src/validacion/validarMundo.ts';
import { explicar } from '../src/validacion/validador.ts';
import { estadoMini } from './mundo-mini.ts';
import { UNO, base, c, escenario, mundo, recua, recursos, reglas, turno } from './recuas.ts';

const LLANO = 'prueba-llano';

function conComarca(
  estado: EstadoPartida,
  id: string,
  cambios: Partial<EstadoComarca>,
): EstadoPartida {
  const comarca = estado.comarcas[id];
  if (comarca === undefined) throw new Error(`falta ${id}`);
  return { ...estado, comarcas: { ...estado.comarcas, [id]: { ...comarca, ...cambios } } };
}

function comarca(estado: EstadoPartida, id = LLANO): EstadoComarca {
  const encontrada = estado.comarcas[id];
  if (encontrada === undefined) throw new Error(`falta ${id}`);
  return encontrada;
}

function jugador(estado: EstadoPartida): EstadoJugador {
  const casa = estado.jugadores[UNO];
  if (casa === undefined) throw new Error('falta la casa');
  return casa;
}

/** Una sola fase sobre el estado tal cual. */
function soloFase(
  estado: EstadoPartida,
  fase: typeof fasePoblacion,
  nombre: 'territorio' | 'poblacion',
  elMundo: Mundo = mundo,
): { estado: EstadoPartida; sucesos: Suceso[] } {
  const ctx = crearContexto(estado, [], elMundo, reglas);
  ctx.fase = nombre;
  fase(ctx);
  return { estado: ctx.estado, sucesos: ctx.sucesos };
}

function politica(t: number, cambios: Partial<Record<string, unknown>>, comarcaId = LLANO): Orden {
  return {
    ...base(t),
    tipo: 'politica',
    comarca: c(comarcaId),
    fuero: null,
    cargaFiscal: null,
    dehesa: null,
    conservarConSal: null,
    ...cambios,
  };
}

describe('crecimiento', () => {
  /** El llano produce de sobra, tiene reserva y le cabe gente. */
  function listo(cambios: Partial<EstadoComarca> = {}): EstadoPartida {
    return conComarca(escenario(), LLANO, {
      produccionUltimoTurno: recursos({ pan: 40 }),
      ...cambios,
    });
  }

  it('crece 2 + lealtad/25, con el tope del 5 % y como poco un vecino', () => {
    const llano = comarca(listo());
    expect(crecimientoPosible({ ...llano, poblacion: 40, lealtad: 100 }, [], reglas)).toBe(2);
    expect(crecimientoPosible({ ...llano, poblacion: 58, lealtad: 100 }, [], reglas)).toBe(2);
    expect(crecimientoPosible({ ...llano, poblacion: 10, lealtad: 0 }, [], reglas)).toBe(1);
    // Con casas cabe mas (150) y el 5 % de 140 son 7: manda la formula (2 + 4).
    const grande = { ...llano, poblacion: 140, lealtad: 100, edificios: { casas: 3 } };
    expect(crecimientoPosible(grande, [], reglas)).toBe(6);
    // Carta puebla: +20 %.
    expect(crecimientoPosible(grande, [1200], reglas)).toBe(7);
  });

  it('crece cuando se cumplen las cuatro condiciones', () => {
    const { estado } = soloFase(listo(), fasePoblacion, 'poblacion');
    expect(comarca(estado).poblacion).toBe(42);
  });

  const casos: readonly [string, EstadoPartida][] = [
    ['escasez', { ...listo(), jugadores: { [UNO]: { ...jugador(listo()), escasez: true } } }],
    ['sin-capacidad', listo({ poblacion: 60 })],
    [
      'reserva-baja',
      { ...listo(), jugadores: { [UNO]: { ...jugador(listo()), almacen: recursos({ pan: 29 }) } } },
    ],
    ['balance-negativo', listo({ produccionUltimoTurno: recursos({ pan: 9 }) })],
  ];
  for (const [motivo, estado] of casos) {
    it(`no crece por ${motivo}, y lo dice`, () => {
      const resultado = soloFase(estado, fasePoblacion, 'poblacion');
      expect(comarca(resultado.estado).poblacion).toBe(comarca(estado).poblacion);
      expect(resultado.sucesos.find((s) => s.tipo === 'poblacion.no-crece')?.datos).toEqual({
        motivo,
      });
    });
  }
});

describe('lealtad', () => {
  const situacion = (cambios: Partial<EstadoComarca>, jornadasALaCapitalMil = 0) => ({
    comarca: { ...comarca(escenario()), ...cambios },
    esCapital: false,
    jornadasALaCapitalMil,
  });
  const fuentes = (cambios: Partial<EstadoComarca>, jornadas = 0) =>
    fuentesDeLealtad(situacion(cambios, jornadas), escenario(), mundo, reglas).map((f) => [
      f.motivo,
      f.delta,
    ]);

  it('suma las fuentes de la tabla del diseno', () => {
    expect(fuentes({ fuero: 'fuero', lealtad: 50 })).toEqual([['fuero', 3]]);
    // El fuero no sube de 90.
    expect(fuentes({ fuero: 'fuero', lealtad: 89 })).toEqual([['fuero', 1]]);
    expect(fuentes({ fuero: 'fuero', lealtad: 95 })).toEqual([]);
    expect(fuentes({ edificios: { mercado: 1 }, cargaFiscal: 'ligera' })).toEqual([
      ['mercado', 1],
      ['carga-ligera', 2],
    ]);
    expect(fuentes({ cargaFiscal: 'dura' }, 5000)).toEqual([
      ['carga-dura', -3],
      ['lejania', -1],
    ]);
    // Sin edificios, sin obras y sin recuas: abandonada.
    expect(fuentes({ edificios: {} })).toEqual([['abandono', -1]]);
  });

  it('nunca sale de 0..100 y aplica los umbrales', () => {
    const { estado } = soloFase(
      conComarca(escenario(), LLANO, { lealtad: 1, cargaFiscal: 'dura' }),
      faseTerritorio,
      'territorio',
    );
    expect(comarca(estado).lealtad).toBe(0);
    const arriba = soloFase(
      conComarca(escenario(), LLANO, { lealtad: 99, cargaFiscal: 'ligera' }),
      faseTerritorio,
      'territorio',
    );
    expect(comarca(arriba.estado).lealtad).toBe(100);
    // Umbrales: < 40 produce un 25 % menos; < 20 no forma recuas.
    expect(factorLealtad(39, reglas)).toBe(750);
    const desleal = conComarca(escenario(), LLANO, { lealtad: 10 });
    const formar: Orden = {
      ...base(desleal.turno, { maravedis: 20, pan: 10 }),
      tipo: 'formar-recua',
      comarca: c(LLANO),
      acemilas: 10,
      vecinos: 0,
    };
    expect(turno(desleal, [formar]).estado.ordenes[0]?.motivoEspera).toBe('comarca-desleal');
  });

  it('una comarca desleal seis turnos vuelve a neutral, avisando cada turno', () => {
    const vega = 'prueba-vega';
    let estado = conComarca(
      escenario({
        recuas: [recua('recua-1', { situacion: { donde: 'comarca', comarca: c(vega) } })],
      }),
      vega,
      {
        duenyo: UNO,
        lealtad: 15,
        edificios: { granja: 1 },
      },
    );
    const restantes: number[] = [];
    for (let i = 0; i < 6; i += 1) {
      const resultado = soloFase(estado, faseTerritorio, 'territorio');
      estado = resultado.estado;
      const aviso = resultado.sucesos.find((s) => s.tipo === 'lealtad.cuenta-atras');
      if (aviso !== undefined) restantes.push(Number(aviso.datos['turnosRestantes']));
    }
    expect(restantes).toEqual([5, 4, 3, 2, 1]);
    const ida = comarca(estado, vega);
    expect(ida.duenyo).toBeNull();
    expect(ida.influencias).toEqual({ [UNO]: 15 });
    expect(jugador(estado).conocimiento[vega]?.nivel).toBe('explorada');
  });

  it('la comarca de la corte no se va nunca', () => {
    let estado = conComarca(escenario(), LLANO, { lealtad: 5 });
    for (let i = 0; i < 8; i += 1) estado = soloFase(estado, faseTerritorio, 'territorio').estado;
    expect(comarca(estado).duenyo).toBe(UNO);
  });
});

describe('fueros y politica', () => {
  it('conceder fuero cambia el fuero; cambiarlo otra vez espera diez turnos', () => {
    const estado = escenario();
    const primero = turno(estado, [politica(estado.turno, { fuero: 'carta puebla' })]);
    expect(comarca(primero.estado)).toMatchObject({
      fuero: 'carta puebla',
      turnoFuero: estado.turno,
    });
    const segundo = turno(primero.estado, [politica(primero.estado.turno, { fuero: 'fuero' })]);
    expect(segundo.estado.ordenes[0]).toMatchObject({
      estado: 'en espera',
      motivoEspera: 'fuero-reciente',
    });
  });

  it('el fuero es irreversible veinte turnos, y quitarlo despues cuesta 20 de lealtad', () => {
    const recien = conComarca(escenario({ turno: 30 }), LLANO, { fuero: 'fuero', turnoFuero: 15 });
    const pronto = turno(recien, [politica(30, { fuero: 'ninguno' })]);
    expect(pronto.estado.ordenes[0]?.motivoEspera).toBe('fuero-irreversible');
    const viejo = conComarca(escenario({ turno: 40 }), LLANO, {
      fuero: 'fuero',
      turnoFuero: 15,
      lealtad: 80,
    });
    const { estado, sucesos } = turno(viejo, [politica(40, { fuero: 'ninguno' })]);
    expect(comarca(estado).fuero).toBe('ninguno');
    expect(sucesos.find((s) => s.datos['motivo'] === 'se le quita el fuero')?.datos['delta']).toBe(
      -20,
    );
  });

  it('carga fiscal, dehesa y sal de conservas', () => {
    const estado = escenario();
    const { estado: despues } = turno(estado, [
      politica(estado.turno, { cargaFiscal: 'ligera', dehesa: true, conservarConSal: false }),
    ]);
    expect(comarca(despues)).toMatchObject({ cargaFiscal: 'ligera', dehesa: true });
    expect(jugador(despues).conservarConSal).toBe(false);
  });
});

describe('administracion y corte', () => {
  it('el coste crece con la distancia, baja con los fueros y con los caminos buenos', () => {
    const estado = conComarca(
      conComarca(escenario(), 'prueba-rio', { duenyo: UNO }),
      'prueba-costa',
      {
        duenyo: UNO,
      },
    );
    const propias = ['prueba-llano', 'prueba-rio', 'prueba-costa'].map((id) => comarca(estado, id));
    const coste = (mejoras = {}, comarcas = propias) =>
      costesDeAdministracion(comarcas, jugador(estado), mundo, reglas, mejoras).map((x) => x.coste);
    expect(coste()).toEqual([4, 7, 11]);
    expect(
      coste(
        {},
        propias.map((p) => ({ ...p, fuero: 'fuero' as const })),
      ),
    ).toEqual([2, 3, 5]);
    const calzadas = {
      'prueba-llano|prueba-rio': { calidad: 'calzada' as const, puente: false },
      'prueba-costa|prueba-rio': { calidad: 'calzada' as const, puente: false },
    };
    // Con calzada, cada tramo cuesta una jornada: nunca menos.
    expect(coste(calzadas)).toEqual([4, 6, 8]);
  });

  it('la deuda castiga primero a las comarcas mas lejanas', () => {
    const estado = conComarca(
      conComarca(
        conComarca(escenario({ almacen: { pan: 500, maravedis: 0 } }), 'prueba-rio', {
          duenyo: UNO,
          lealtad: 80,
        }),
        'prueba-costa',
        { duenyo: UNO, lealtad: 80 },
      ),
      LLANO,
      { lealtad: 80 },
    );
    const { sucesos } = turno(estado);
    // Solo hay lo que rinden este turno (8 + 4 + 4): el llano (4) y el rio (7) se pagan, la costa
    // (11) no.
    const castigadas = sucesos
      .filter(
        (s) => s.tipo === 'lealtad.cambio' && s.datos['motivo'] === 'administracion sin pagar',
      )
      .map((s) => s.comarca);
    expect(castigadas).toEqual(['prueba-costa']);
  });

  it('el traslado de la corte tarda diez turnos, encarece la administracion y cambia las distancias', () => {
    let estado = conComarca(
      escenario({ almacen: { pan: 5000, maravedis: 5000, piedra: 100 } }),
      'prueba-costa',
      {
        duenyo: UNO,
      },
    );
    const orden: Orden = {
      ...base(estado.turno, reglas.territorio.costeTraslado),
      tipo: 'trasladar-corte',
      comarca: c('prueba-costa'),
    };
    const primero = turno(estado, [orden]);
    estado = primero.estado;
    expect(jugador(estado).traslado).toEqual({ destino: 'prueba-costa', turnosRestantes: 9 });
    const admin = (e: EstadoPartida) =>
      costesDeAdministracion(
        Object.values(e.comarcas).filter((x) => x.duenyo === UNO),
        jugador(e),
        mundo,
        reglas,
        {},
      );
    // Durante el traslado: (4 × 1,25) y (11 × 1,25).
    expect(admin(estado).map((x) => x.coste)).toEqual([5, 13]);
    for (let i = 0; i < 9; i += 1) estado = turno(estado).estado;
    expect(jugador(estado)).toMatchObject({ capital: 'prueba-costa', traslado: null });
    expect(admin(estado).map((x) => [x.comarca, x.coste])).toEqual([
      ['prueba-costa', 4],
      ['prueba-llano', 11],
    ]);
  });
});

/**
 * Un dominio de ocho comarcas en fila, cada una a un tramo de llano de la anterior: la ultima
 * queda a 7 × 1,8 jornadas de la capital en verano.
 */
function mundoEnFila(): Mundo {
  const ids = Array.from({ length: 8 }, (_, i) => `fila-${String(i)}`);
  const comarcas: Record<string, unknown> = {};
  const vecinos: Record<string, string[]> = {};
  const caminos: Record<string, unknown>[] = [];
  ids.forEach((id, i) => {
    comarcas[id] = {
      id,
      nombre: `Fila ${String(i)}`,
      cabecera: `Fila ${String(i)}`,
      region: '00-prueba',
      centro: [-3000 + i * 100, 41000],
      poligono: [
        [i * 10, 0],
        [i * 10 + 10, 0],
        [i * 10 + 10, 10],
        [i * 10, 10],
      ],
      terreno: 'llano',
      potenciales: { labor: 5, monte: 1, pasto: 1, piedra: 1, hierro: 0, sal: 0, pesca: 0 },
      solares: 6,
      poblacionInicial: 60,
      localidades: [
        { nombre: `Fila ${String(i)}`, coord: [-3000 + i * 100, 41000], cabecera: true },
      ],
      rasgos: [],
      ferias: [],
      esOrigen: true,
    };
    vecinos[id] = [ids[i - 1], ids[i + 1]].filter((v): v is string => v !== undefined).sort();
    const siguiente = ids[i + 1];
    if (siguiente !== undefined) {
      caminos.push({
        desde: id,
        hasta: siguiente,
        terreno: 'llano',
        jornadasBase: 2,
        vado: false,
        puertoDeMontanya: null,
        cierraEnInvierno: false,
        canyada: null,
        calzadaRomana: false,
      });
    }
  });
  const resultado = validarMundo({ version: 'fila', comarcas, caminos, vecinos });
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  return resultado.valor;
}

function dominioEnFila(elMundo: Mundo, conFuerosYCaminos: boolean): EstadoPartida {
  const mini = estadoMini();
  const plantilla = mini.comarcas[LLANO];
  const casa = mini.jugadores[UNO];
  if (plantilla === undefined || casa === undefined) throw new Error('el estado mini ha cambiado');
  const comarcas: Record<string, EstadoComarca> = {};
  const conocimiento: Record<string, EstadoJugador['conocimiento'][string]> = {};
  const caminos: Record<string, EstadoPartida['caminos'][string]> = {};
  for (const [id, geografia] of Object.entries(elMundo.comarcas)) {
    comarcas[id] = {
      ...plantilla,
      id: id as IdComarca,
      duenyo: UNO,
      poblacion: 60,
      lealtad: 80,
      edificios: { granja: 4 },
      potenciales: geografia.potenciales,
      fuero: conFuerosYCaminos ? 'fuero' : 'ninguno',
    };
    conocimiento[id] = { nivel: 'propia', turnoUltimaNoticia: 1, datos: null };
  }
  if (conFuerosYCaminos) {
    for (const camino of elMundo.caminos) {
      caminos[`${camino.desde}|${camino.hasta}`] = { calidad: 'calzada', puente: false };
    }
  }
  const estado = {
    ...mini,
    turno: 5,
    comarcas,
    caminos,
    jugadores: {
      [UNO]: {
        ...casa,
        capital: 'fila-0' as IdComarca,
        conocimiento,
        almacen: recursos({ pan: 2000, maravedis: 100 }),
      },
    },
  };
  const valido = validarEstado(estado, elMundo);
  if (!valido.ok) throw new Error(explicar(valido.errores));
  return valido.valor;
}

describe('escenario de cien turnos', () => {
  function jugar(conFuerosYCaminos: boolean) {
    const elMundo = mundoEnFila();
    let estado = dominioEnFila(elMundo, conFuerosYCaminos);
    let turnosConDeuda = 0;
    let deudaMaxima = 0;
    for (let i = 0; i < 100; i += 1) {
      estado = turno(estado, [], reglas, elMundo).estado;
      const deuda = estado.jugadores[UNO]?.deudaAdministracion ?? 0;
      if (deuda > 0) turnosConDeuda += 1;
      deudaMaxima = Math.max(deudaMaxima, deuda);
    }
    const propias = Object.values(estado.comarcas).filter((x) => x.duenyo === UNO).length;
    return { turnosConDeuda, deudaMaxima, propias };
  }

  it('ocho comarcas sin fueros ni caminos se endeudan; con fueros y calzadas, no', () => {
    const sin = jugar(false);
    const con = jugar(true);
    // Cifras registradas en la ficha T-036 §9.
    expect(sin).toMatchSnapshot('sin fueros ni caminos');
    expect(con).toMatchSnapshot('con fueros y calzadas');
    expect(sin.turnosConDeuda).toBeGreaterThan(50);
    expect(con.turnosConDeuda).toBe(0);
  });
});
