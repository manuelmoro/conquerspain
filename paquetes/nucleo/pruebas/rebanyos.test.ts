// Rebaños, pastos y trashumancia (T-040): formar, pasto y su reparto, movimiento por cañadas, pérdidas,
// esquileo, estiércol, puertos y tierra ajena.
import { describe, expect, it } from 'vitest';

import { aplicar } from '../src/cambios.ts';
import { crearContexto } from '../src/contexto.ts';
import { GANADERIA } from '../src/datos/ganaderia.ts';
import { estadoEstacionalDe } from '../src/reglas/calendario.ts';
import {
  calidadDelAnyoMil,
  estiercolTrasElAnyo,
  factorDeEstiercolMil,
  lanaDelEsquileo,
} from '../src/reglas/esquileo.ts';
import { esPastoCorrecto, repartoDePasto } from '../src/reglas/pastos.ts';
import {
  cabezasPerdidasPorFaltaDePasto,
  pasoDeRebanyo,
  puedeEntrar,
} from '../src/reglas/rebanyos.ts';
import { claveDeTramo } from '../src/reglas/ruta.ts';
import type { Suceso } from '../src/tipos/cronica.ts';
import type { EstadoPartida, Rebanyo } from '../src/tipos/estado.ts';
import type { IdAcontecimiento, IdJugador, IdRebanyo } from '../src/tipos/ids.ts';
import type { Camino, ComarcaMundo, Mundo, Rasgo } from '../src/tipos/mundo.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import type { TablasDeReglas } from '../src/tipos/reglas.ts';
import { azarDeTexto } from '../src/utiles/azar.ts';
import { validarEstado } from '../src/validacion/validarEstado.ts';
import { validarTablas } from '../src/validacion/validarTablas.ts';
import { estadoDeEjemplo, tablasDeEjemplo } from './ejemplos.ts';
import {
  DOS,
  UNO,
  base,
  c,
  comarcaDe,
  conComarca,
  escenario,
  mundo,
  ordenRuta,
  parada,
  reglas,
  turno,
} from './recuas.ts';

const SIERRA = 'prueba-sierra';
const RIO = 'prueba-rio';
const LLANO = 'prueba-llano';

/**
 * El mundo mini con pastos: la sierra es pasto de verano, el rio dehesa (pasto de invierno) y la
 * vega pasto de invierno. Una cañada une la sierra con el rio pasando por el monte y el llano.
 */
function mundoDeRebanos(opciones: { canyada?: boolean; region?: string } = {}): Mundo {
  const rasgos: Record<string, readonly Rasgo[]> = {
    [SIERRA]: ['pasto-de-verano'],
    [RIO]: ['dehesa'],
    'prueba-vega': ['pasto-de-invierno'],
  };
  const conCanyada = opciones.canyada ?? true;
  const lasCanyadas = new Set([
    claveDeTramo('prueba-monte', SIERRA),
    claveDeTramo(LLANO, 'prueba-monte'),
    claveDeTramo(LLANO, RIO),
  ]);
  const comarcas = Object.fromEntries(
    Object.entries(mundo.comarcas).map(([id, comarca]): [string, ComarcaMundo] => [
      id,
      {
        ...comarca,
        region: opciones.region ?? comarca.region,
        rasgos: rasgos[id] ?? comarca.rasgos,
      },
    ]),
  );
  const caminos = mundo.caminos.map((camino): Camino =>
    conCanyada && lasCanyadas.has(claveDeTramo(camino.desde, camino.hasta))
      ? { ...camino, canyada: 'Cañada de Prueba' }
      : camino,
  );
  return { ...mundo, comarcas, caminos };
}

const elMundo = mundoDeRebanos();

function rebano(id: string, donde: string, cambios: Partial<Rebanyo> = {}): Rebanyo {
  return {
    id: id as IdRebanyo,
    jugador: UNO,
    nombre: `Rebaño ${id}`,
    situacion: { donde: 'comarca', comarca: c(donde) },
    ruta: [],
    cabezas: 1000,
    pastoDelAnyoMil: 0,
    turnosSinPasto: 0,
    ...cambios,
  };
}

/** El estado mini con despensa llena, dos jugadores y estos rebaños. */
function partida(turnoInicial: number, ...rebanos: Rebanyo[]): EstadoPartida {
  const estado = escenario({ turno: turnoInicial, almacen: { pan: 5000 }, conDos: true });
  return { ...estado, rebanyos: Object.fromEntries(rebanos.map((r) => [r.id, r])) };
}

function rutaDeRebano(turnoDeAlta: number, id: string, ...destinos: string[]): Orden {
  return {
    ...ordenRuta(
      turnoDeAlta,
      'recua-0',
      destinos.map((d) => parada(d)),
    ),
    tipo: 'ruta',
    recua: null,
    rebanyo: id as IdRebanyo,
  } as Orden;
}

function formar(turnoDeAlta: number, cambios: { comarca?: string; cabezas?: number } = {}): Orden {
  return {
    ...base(turnoDeAlta, { maravedis: 60 }),
    tipo: 'formar-rebanyo',
    comarca: c(cambios.comarca ?? LLANO),
    cabezas: cambios.cabezas ?? 1000,
  };
}

function suceso(sucesos: readonly Suceso[], tipo: string): Suceso[] {
  return sucesos.filter((s) => s.tipo === tipo);
}

function rebanyoDe(estado: EstadoPartida, id: string): Rebanyo {
  const encontrado = estado.rebanyos[id];
  if (encontrado === undefined) throw new Error(`falta el rebaño ${id}`);
  return encontrado;
}

// ——— Formar ————————————————————————————————————————————————————————————————

describe('formar un rebaño', () => {
  it('cuesta 60 mrs y dos vecinos y nace quieto en la comarca, con las cuentas a cero', () => {
    const estado = partida(7);
    const { estado: despues, sucesos } = turno(estado, [formar(estado.turno)], reglas, elMundo);
    const nuevo = Object.values(despues.rebanyos)[0];
    expect(nuevo).toMatchObject({
      jugador: UNO,
      nombre: 'Rebaño de Llano de Prueba',
      situacion: { donde: 'comarca', comarca: LLANO },
      ruta: [],
      cabezas: 1000,
      pastoDelAnyoMil: 0,
      // El turno en que se forma ya cuenta: en primavera el llano no es pasto de nadie.
      turnosSinPasto: 1,
    });
    expect(suceso(sucesos, 'poblacion.cambio').some((s) => s.datos['delta'] === -2)).toBe(true);
    const pago = sucesos.find(
      (s) =>
        s.tipo === 'almacen.cambio' &&
        s.datos['recurso'] === 'maravedis' &&
        s.datos['delta'] === -60,
    );
    expect(pago).toBeDefined();
    expect(suceso(sucesos, 'rebanyo.forma')).toHaveLength(1);
  });

  it('el segundo rebaño de la misma comarca lleva un número en el nombre', () => {
    const estado = partida(7);
    const { estado: despues } = turno(
      estado,
      [formar(estado.turno), formar(estado.turno)],
      reglas,
      elMundo,
    );
    expect(
      Object.values(despues.rebanyos)
        .map((r) => r.nombre)
        .sort(),
    ).toEqual(['Rebaño de Llano de Prueba', 'Rebaño de Llano de Prueba 2']);
  });

  it.each([
    {
      caso: 'la comarca no es suya',
      orden: (t: number) => formar(t, { comarca: SIERRA }),
      motivo: 'comarca-ajena',
    },
    {
      caso: 'no tiene mil cabezas',
      orden: (t: number) => formar(t, { cabezas: 500 }),
      motivo: 'cabezas-invalidas',
    },
  ])('se cancela si $caso', ({ orden, motivo }) => {
    const estado = partida(7);
    const { estado: despues, sucesos } = turno(estado, [orden(estado.turno)], reglas, elMundo);
    expect(despues.rebanyos).toEqual({});
    expect(sucesos.some((s) => s.tipo === 'orden.estado' && s.datos['motivo'] === motivo)).toBe(
      true,
    );
  });

  it('espera si la comarca se quedaría sin gente o es desleal, y no gasta nada', () => {
    const sinGente = conComarca(partida(7), LLANO, { poblacion: 2 });
    const a = turno(sinGente, [formar(sinGente.turno)], reglas, elMundo).estado;
    expect(a.ordenes[0]).toMatchObject({ estado: 'en espera', motivoEspera: 'faltan-vecinos' });
    const desleal = conComarca(partida(7), LLANO, { lealtad: 5 });
    const b = turno(desleal, [formar(desleal.turno)], reglas, elMundo).estado;
    expect(b.ordenes[0]).toMatchObject({ estado: 'en espera', motivoEspera: 'comarca-desleal' });
    expect(b.rebanyos).toEqual({});
  });
});

// ——— Pasto ———————————————————————————————————————————————————————————————

describe('pasto correcto', () => {
  const estado = escenario();
  const correcto = (comarca: string, turnoActual: number): boolean =>
    esPastoCorrecto(
      comarcaDe(estado, comarca),
      elMundo.comarcas[comarca] as ComarcaMundo,
      estadoEstacionalDe(turnoActual, elMundo, reglas),
      reglas,
    );

  it('el pasto de verano solo vale en verano y la dehesa o el pasto de invierno solo en invierno', () => {
    // La sierra: pasto de verano, turnos 9 a 18.
    expect([8, 9, 12, 18, 19].map((t) => correcto(SIERRA, t))).toEqual([
      false,
      true,
      true,
      true,
      false,
    ]);
    // El rio (dehesa) y la vega (pasto de invierno): el resto del anyo.
    expect([8, 9, 18, 19, 24].map((t) => correcto(RIO, t))).toEqual([
      true,
      false,
      false,
      true,
      true,
    ]);
    expect([2, 12, 20].map((t) => correcto('prueba-vega', t))).toEqual([true, false, true]);
  });

  it('hace falta pasto 2 como minimo y un rasgo de pasto', () => {
    // La costa tiene pasto 1; el monte pasto 3 pero sin rasgo de pasto.
    expect([2, 12].map((t) => correcto('prueba-costa', t))).toEqual([false, false]);
    expect([2, 12].map((t) => correcto('prueba-monte', t))).toEqual([false, false]);
  });
});

describe('el reparto de pasto', () => {
  const rebanos = (...cabezas: number[]): Rebanyo[] =>
    cabezas.map((n, i) => rebano(`rebanyo-${String(i + 1)}`, RIO, { cabezas: n }));

  it('si cabe todo el ganado, todos pastan entero', () => {
    const reparto = repartoDePasto(2000, rebanos(1000, 1000));
    expect([...reparto.values()]).toEqual([1000, 1000]);
  });

  it('si no cabe, se reparte en proporcion a las cabezas y no sobra ni falta hierba', () => {
    const lista = rebanos(1000, 1000, 1000);
    const reparto = repartoDePasto(2000, lista);
    const alimentadas = lista.map((r) => ((reparto.get(r.id) ?? 0) * r.cabezas) / 1000);
    expect(alimentadas.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(1998);
    expect(alimentadas.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(2000);
    // Un rebaño mayor se lleva mas hierba, y la parte de cada uno sigue siendo la misma proporcion.
    const desigual = repartoDePasto(1500, rebanos(1000, 500));
    expect(desigual.get('rebanyo-1')).toBe(1000);
    expect(desigual.get('rebanyo-2')).toBe(1000);
  });

  it('no depende del orden en que se den los rebaños (5 000 repartos al azar)', () => {
    const azar = azarDeTexto('reparto-de-pasto');
    for (let caso = 0; caso < 5000; caso += 1) {
      const lista = rebanos(
        ...Array.from({ length: azar.entreInclusive(1, 6) }, () => azar.entreInclusive(1, 1000)),
      );
      const capacidad = azar.entreInclusive(0, 4000);
      const a = repartoDePasto(capacidad, lista);
      const b = repartoDePasto(capacidad, azar.barajar(lista));
      expect([...a.entries()].sort()).toEqual([...b.entries()].sort());
      for (const fraccion of a.values()) {
        expect(fraccion).toBeGreaterThanOrEqual(0);
        expect(fraccion).toBeLessThanOrEqual(1000);
      }
    }
  });

  it('en la fase, tres rebaños de dos jugadores en una dehesa de capacidad 2000 comen a medias', () => {
    const estado = partida(
      20,
      rebano('rebanyo-1', RIO),
      rebano('rebanyo-2', RIO),
      rebano('rebanyo-3', RIO, { jugador: DOS }),
    );
    const { estado: despues, sucesos } = turno(estado, [], reglas, elMundo);
    const pastos = ['rebanyo-1', 'rebanyo-2', 'rebanyo-3'].map(
      (id) => rebanyoDe(despues, id).pastoDelAnyoMil,
    );
    // 667, 667 y 666: 2000 cabezas de hierba para 3000.
    expect(pastos.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(1998);
    expect(pastos.every((p) => p > 600 && p < 700)).toBe(true);
    expect(
      suceso(sucesos, 'rebanyo.sin-pasto').every((s) => s.datos['motivo'] === 'saturado'),
    ).toBe(true);
    expect(suceso(sucesos, 'rebanyo.sin-pasto')).toHaveLength(3);
  });
});

// ——— Movimiento ————————————————————————————————————————————————————————————

describe('el movimiento', () => {
  it('anda dos jornadas por turno, una mas por cañada y una menos con barro', () => {
    expect(pasoDeRebanyo(false, false, reglas)).toBe(2000);
    expect(pasoDeRebanyo(true, false, reglas)).toBe(3000);
    expect(pasoDeRebanyo(true, true, reglas)).toBe(2000);
    expect(pasoDeRebanyo(false, true, reglas)).toBe(1000);
  });

  function turnosHastaLlegar(mundoDeLaPrueba: Mundo): { turnos: number; enCamino: boolean } {
    let estado = partida(12, rebano('rebanyo-1', SIERRA));
    let turnos = 0;
    let enCamino = false;
    let ordenes: Orden[] = [rutaDeRebano(estado.turno, 'rebanyo-1', RIO)];
    while (turnos < 10) {
      const resultado = turno(estado, ordenes, reglas, mundoDeLaPrueba);
      estado = resultado.estado;
      ordenes = [];
      turnos += 1;
      const r = estado.rebanyos['rebanyo-1'];
      if (r?.situacion.donde === 'camino') enCamino = true;
      if (suceso(resultado.sucesos, 'rebanyo.llega').length > 0) break;
    }
    return { turnos, enCamino };
  }

  it('por la cañada llega antes que por un camino corriente', () => {
    const conCanyada = turnosHastaLlegar(mundoDeRebanos());
    const sinCanyada = turnosHastaLlegar(mundoDeRebanos({ canyada: false }));
    // Seis jornadas y pico en verano (2,7 + 1,8 + 1,8): a tres por turno, tres turnos; a dos, cuatro.
    expect(conCanyada.turnos).toBe(3);
    expect(sinCanyada.turnos).toBe(4);
    expect(conCanyada.enCamino).toBe(true);
  });

  it('un rebaño en camino por una cañada pasta; por un camino corriente, no', () => {
    const pasto = (mundoDeLaPrueba: Mundo) => {
      const estado = partida(12, rebano('rebanyo-1', SIERRA));
      const { estado: despues } = turno(
        estado,
        [rutaDeRebano(estado.turno, 'rebanyo-1', RIO)],
        reglas,
        mundoDeLaPrueba,
      );
      const r = rebanyoDe(despues, 'rebanyo-1');
      return { donde: r.situacion.donde, pasto: r.pastoDelAnyoMil };
    };
    // En el primer turno sale de la sierra y se queda en el tramo siguiente (o en el monte).
    expect(pasto(mundoDeRebanos()).pasto).toBe(1000);
    const corriente = pasto(mundoDeRebanos({ canyada: false }));
    expect(corriente.donde === 'camino' ? corriente.pasto : 0).toBe(0);
  });

  it('las órdenes de ruta de un rebaño no admiten ruta circular ni rebaños ajenos o desconocidos', () => {
    const estado = partida(
      12,
      rebano('rebanyo-1', SIERRA),
      rebano('rebanyo-2', SIERRA, { jugador: DOS }),
    );
    const circular = {
      ...(rutaDeRebano(estado.turno, 'rebanyo-1', RIO) as object),
      circular: true,
    } as Orden;
    const ajeno = rutaDeRebano(estado.turno, 'rebanyo-2', RIO);
    const nadie = rutaDeRebano(estado.turno, 'rebanyo-9', RIO);
    const { sucesos } = turno(estado, [circular, ajeno, nadie], reglas, elMundo);
    const motivos = suceso(sucesos, 'orden.estado').map((s) => String(s.datos['motivo']));
    expect(motivos.sort()).toEqual(
      ['rebanyo-desconocido', 'rebanyo-desconocido', 'ruta-circular-de-rebanyo'].sort(),
    );
  });

  it('un destino desconocido espera', () => {
    let estado = partida(12, rebano('rebanyo-1', SIERRA));
    const jugador = estado.jugadores[UNO];
    if (jugador === undefined) throw new Error('falta el jugador');
    estado = { ...estado, jugadores: { [UNO]: { ...jugador, conocimiento: {} } } };
    const { estado: despues } = turno(
      estado,
      [rutaDeRebano(estado.turno, 'rebanyo-1', RIO)],
      reglas,
      elMundo,
    );
    expect(despues.ordenes[0]).toMatchObject({
      estado: 'en espera',
      motivoEspera: 'destino-desconocido',
    });
  });
});

// ——— Tierra ajena ——————————————————————————————————————————————————————————

describe('tierra ajena', () => {
  const estado = partida(12);
  const jugador = (id: IdJugador) =>
    estado.jugadores[id] as NonNullable<EstadoPartida['jugadores'][string]>;
  const camino = (canyada: string | null): Camino => ({
    ...(mundo.caminos[0] as Camino),
    canyada,
  });
  const conPasoFranco = (permite: boolean): TablasDeReglas => ({
    ...reglas,
    casas: {
      ...reglas.casas,
      mesta: {
        ...reglas.casas.mesta,
        permisos: { ...reglas.casas.mesta.permisos, pasoFrancoPorCanyada: permite },
      },
    },
  });
  const ajena = { ...comarcaDe(estado, LLANO), duenyo: DOS };
  const propia = { ...comarcaDe(estado, LLANO), duenyo: UNO };
  const neutral = { ...comarcaDe(estado, LLANO), duenyo: null };

  it('entra en una comarca propia o neutral por cualquier camino', () => {
    for (const destino of [propia, neutral, undefined]) {
      expect(puedeEntrar(camino(null), destino, jugador(UNO), conPasoFranco(false))).toBe(true);
    }
  });

  it('en la de otro jugador solo por una cañada y solo con el paso franco de la Mesta', () => {
    expect(puedeEntrar(camino('Cañada de Prueba'), ajena, jugador(UNO), conPasoFranco(true))).toBe(
      true,
    );
    expect(puedeEntrar(camino('Cañada de Prueba'), ajena, jugador(UNO), conPasoFranco(false))).toBe(
      false,
    );
    expect(puedeEntrar(camino(null), ajena, jugador(UNO), conPasoFranco(true))).toBe(false);
  });

  it('la ruta cruza el monte de otro por la cañada con el paso franco y no encuentra ruta sin él', () => {
    // La sierra solo se une con el monte y la mina: para bajar al rio hay que pasar por el monte.
    const conMonteAjeno = conComarca(partida(12, rebano('rebanyo-1', SIERRA)), 'prueba-monte', {
      duenyo: DOS,
    });
    const orden = rutaDeRebano(conMonteAjeno.turno, 'rebanyo-1', RIO);
    const sin = turno(conMonteAjeno, [orden], conPasoFranco(false), elMundo).estado;
    expect(sin.ordenes[0]).toMatchObject({
      estado: 'en espera',
      motivoEspera: 'sin-ruta-conocida',
    });
    expect(rebanyoDe(sin, 'rebanyo-1').situacion).toMatchObject({
      donde: 'comarca',
      comarca: SIERRA,
    });

    const con = turno(conMonteAjeno, [orden], conPasoFranco(true), elMundo).estado;
    expect(con.ordenes).toHaveLength(0);
    const situacion = rebanyoDe(con, 'rebanyo-1').situacion;
    expect(situacion.donde === 'camino' || situacion.comarca !== SIERRA).toBe(true);
  });

  it('sin cañada, ni siquiera la Mesta cruza tierra ajena', () => {
    const sinCanyada = mundoDeRebanos({ canyada: false });
    const conMonteAjeno = conComarca(partida(12, rebano('rebanyo-1', SIERRA)), 'prueba-monte', {
      duenyo: DOS,
    });
    const orden = rutaDeRebano(conMonteAjeno.turno, 'rebanyo-1', RIO);
    const { estado } = turno(conMonteAjeno, [orden], conPasoFranco(true), sinCanyada);
    expect(estado.ordenes[0]).toMatchObject({ motivoEspera: 'sin-ruta-conocida' });
  });
});

// ——— Pérdidas —————————————————————————————————————————————————————————————

describe('el ganado sin pasto', () => {
  it('pierde un 5 %, y al menos una cabeza', () => {
    expect(cabezasPerdidasPorFaltaDePasto(1000, reglas)).toBe(50);
    expect(cabezasPerdidasPorFaltaDePasto(950, reglas)).toBe(47);
    expect(cabezasPerdidasPorFaltaDePasto(10, reglas)).toBe(1);
    expect(cabezasPerdidasPorFaltaDePasto(1, reglas)).toBe(1);
    expect(cabezasPerdidasPorFaltaDePasto(0, reglas)).toBe(0);
  });

  it('no pierde nada el primer turno sin pasto y empieza a perder exactamente el segundo', () => {
    // La sierra en invierno (turno 3): no hay pasto correcto.
    let estado = partida(3, rebano('rebanyo-1', SIERRA));
    const cabezas: number[] = [];
    const seguidos: number[] = [];
    for (let i = 0; i < 4; i += 1) {
      estado = turno(estado, [], reglas, elMundo).estado;
      cabezas.push(rebanyoDe(estado, 'rebanyo-1').cabezas);
      seguidos.push(rebanyoDe(estado, 'rebanyo-1').turnosSinPasto);
    }
    expect(seguidos).toEqual([1, 2, 3, 4]);
    expect(cabezas).toEqual([1000, 950, 903, 858]);
  });

  it('con pasto entero, las cuentas se ponen a cero y no se pierde nada', () => {
    let estado = partida(12, rebano('rebanyo-1', SIERRA, { turnosSinPasto: 1 }));
    estado = turno(estado, [], reglas, elMundo).estado;
    expect(rebanyoDe(estado, 'rebanyo-1')).toMatchObject({
      cabezas: 1000,
      turnosSinPasto: 0,
      pastoDelAnyoMil: 1000,
    });
  });

  it('un pasto a medias no cuenta como sin pasto', () => {
    const lleno = [1, 2, 3].map((n) => rebano(`rebanyo-${String(n)}`, RIO, { turnosSinPasto: 1 }));
    const estado = partida(20, ...lleno);
    const { estado: despues } = turno(estado, [], reglas, elMundo);
    for (const r of Object.values(despues.rebanyos))
      expect(r).toMatchObject({ turnosSinPasto: 0, cabezas: 1000 });
  });

  it('un rebaño que se queda sin cabezas desaparece', () => {
    const estado = partida(3, rebano('rebanyo-1', SIERRA, { cabezas: 1, turnosSinPasto: 1 }));
    const { estado: despues, sucesos } = turno(estado, [], reglas, elMundo);
    expect(despues.rebanyos).toEqual({});
    expect(suceso(sucesos, 'rebanyo.desaparece')).toHaveLength(1);
  });
});

// ——— Esquileo ——————————————————————————————————————————————————————————————

describe('el esquileo', () => {
  const unRebano = (pastoDelAnyoMil: number, cabezas = 1000): Rebanyo =>
    rebano('rebanyo-1', SIERRA, { pastoDelAnyoMil, cabezas });

  it('la calidad se mide sobre el año entero de 24 turnos', () => {
    expect(calidadDelAnyoMil(24000)).toBe(1000);
    expect(calidadDelAnyoMil(12000)).toBe(500);
    expect(calidadDelAnyoMil(1000)).toBe(41);
    expect(calidadDelAnyoMil(0)).toBe(0);
  });

  it('doce sacas por cada mil cabezas con la calidad entera, y proporcional a las cabezas y a la calidad', () => {
    expect(lanaDelEsquileo(unRebano(24000), 1000, 1000, reglas)).toBe(12);
    expect(lanaDelEsquileo(unRebano(24000, 500), 1000, 1000, reglas)).toBe(6);
    expect(lanaDelEsquileo(unRebano(12000), 1000, 1000, reglas)).toBe(6);
    // El merino de la Mesta: +25 %. La peste de ganado: -25 %.
    expect(lanaDelEsquileo(unRebano(24000), 1250, 1000, reglas)).toBe(15);
    expect(lanaDelEsquileo(unRebano(24000), 1000, 750, reglas)).toBe(9);
    // Un rebaño comprado el turno anterior no cobra un año de lana.
    expect(lanaDelEsquileo(unRebano(1000), 1000, 1000, reglas)).toBe(0);
  });

  it('solo ocurre en el turno 10 y deja el almacén con la lana y los contadores a cero', () => {
    const rebaño = () => rebano('rebanyo-1', SIERRA, { pastoDelAnyoMil: 24000 });
    const en = (turnoActual: number) => turno(partida(turnoActual, rebaño()), [], reglas, elMundo);
    for (const t of [9, 11]) {
      expect(suceso(en(t).sucesos, 'rebanyo.esquileo')).toHaveLength(0);
    }
    const { estado, sucesos } = en(10);
    const esquileo = suceso(sucesos, 'rebanyo.esquileo');
    expect(esquileo).toHaveLength(1);
    expect(esquileo[0]?.datos).toMatchObject({ lana: 12, calidadMil: 1000, cabezas: 1000 });
    const entra = sucesos.find((s) => s.tipo === 'almacen.cambio' && s.datos['recurso'] === 'lana');
    expect(entra?.datos).toMatchObject({ delta: 12 });
    // Este mismo turno cuenta ya para el anyo que empieza, con su pasto de verano.
    expect(rebanyoDe(estado, 'rebanyo-1').pastoDelAnyoMil).toBe(1000);
  });

  it('el rebaño produce dos de pan por turno por cada mil cabezas', () => {
    const { sucesos } = turno(
      partida(12, rebano('rebanyo-1', SIERRA), rebano('rebanyo-2', SIERRA, { cabezas: 500 })),
      [],
      reglas,
      elMundo,
    );
    const panes = sucesos
      .filter(
        (s) =>
          s.tipo === 'almacen.cambio' && String(s.datos['motivo']).startsWith('queso y corderos'),
      )
      .map((s) => s.datos['delta']);
    expect(panes).toEqual([2, 1]);
  });

  it('la casa da lo suyo al esquileo (el merino de la Mesta)', () => {
    const merino: TablasDeReglas = {
      ...reglas,
      casas: {
        ...reglas.casas,
        mesta: {
          ...reglas.casas.mesta,
          modificadores: { ...reglas.casas.mesta.modificadores, lanaEsquileoMil: 1250 },
        },
      },
    };
    const { sucesos } = turno(
      partida(10, rebano('rebanyo-1', SIERRA, { pastoDelAnyoMil: 24000 })),
      [],
      merino,
      elMundo,
    );
    expect(suceso(sucesos, 'rebanyo.esquileo')[0]?.datos['lana']).toBe(15);
  });

  it('la peste de ganado reduce el esquileo solo en su región', () => {
    const conRegiones = mundoDeRebanos({ region: '01-norte' });
    const peste = (region: string) => ({
      id: 'ac-prueba-peste' as IdAcontecimiento,
      tipo: 'peste-de-ganado',
      region,
      comarca: null,
      turnoAnuncio: 3,
      turnoInicio: 5,
      turnosDuracion: 6,
      efectos: [
        {
          que: 'lana' as const,
          recurso: 'lana' as const,
          terreno: null,
          factorMil: 750,
          cantidad: 0,
        },
      ],
    });
    const lana = (region: string) => {
      const estado = {
        ...partida(10, rebano('rebanyo-1', SIERRA, { pastoDelAnyoMil: 24000 })),
        acontecimientos: [peste(region)],
      };
      return turno(estado, [], reglas, conRegiones).sucesos.find(
        (s) => s.tipo === 'rebanyo.esquileo',
      )?.datos;
    };
    expect(lana('01-norte')).toMatchObject({ lana: 9, acontecimientosMil: 750 });
    expect(lana('02-sur')).toMatchObject({ lana: 12, acontecimientosMil: 1000 });
  });
});

// ——— El año entero ———————————————————————————————————————————————————————————

describe('la trashumancia de un año', () => {
  /** Del turno 10 (esquileo) al turno 10 del año siguiente, con las órdenes que se den en cada turno. */
  function anyo(
    estadoInicial: EstadoPartida,
    ordenesDe: (turnoActual: number) => Orden[] = () => [],
  ) {
    let estado = estadoInicial;
    const sucesos: Suceso[] = [];
    for (let turnoActual = 10; turnoActual < 34; turnoActual += 1) {
      const resultado = turno(estado, ordenesDe(turnoActual), reglas, elMundo);
      estado = resultado.estado;
      sucesos.push(...resultado.sucesos);
    }
    const final = turno(estado, [], reglas, elMundo);
    return { estado: final.estado, sucesos: [...sucesos, ...final.sucesos] };
  }

  it('el ciclo completo (sierra en verano, dehesa en invierno) da 12 sacas por mil cabezas', () => {
    const { sucesos } = anyo(partida(10, rebano('rebanyo-1', SIERRA)), (t) => {
      // Baja a la dehesa el ultimo turno de verano y sube a la sierra el ultimo de invierno.
      if (t === 18) return [rutaDeRebano(t, 'rebanyo-1', RIO)];
      if (t === 32) return [rutaDeRebano(t, 'rebanyo-1', SIERRA)];
      return [];
    });
    const esquileos = suceso(sucesos, 'rebanyo.esquileo');
    // El primero (turno 10 del primer anyo) no tenia nada que esquilar; el segundo, un anyo despues.
    expect(esquileos).toHaveLength(2);
    expect(esquileos[1]?.datos).toMatchObject({ lana: 12, calidadMil: 1000, cabezas: 1000 });
    expect(suceso(sucesos, 'rebanyo.pierde-cabezas')).toHaveLength(0);
  });

  it('un rebaño que se queda quieto todo el año en la sierra da menos de 7 sacas', () => {
    const { sucesos } = anyo(partida(10, rebano('rebanyo-1', SIERRA)));
    const esquileos = suceso(sucesos, 'rebanyo.esquileo');
    const lana = Number(esquileos[1]?.datos['lana']);
    expect(lana).toBeLessThan(7);
    // Y pierde ganado en el invierno.
    expect(Number(esquileos[1]?.datos['cabezas'])).toBeLessThan(1000);
  });
});

// ——— Estiércol ————————————————————————————————————————————————————————————

describe('el estiércol', () => {
  it('sube un nivel si invernaron suficientes rebaños, baja uno si no y respeta el tope', () => {
    expect(estiercolTrasElAnyo(0, 10, reglas)).toBe(1);
    expect(estiercolTrasElAnyo(1, 14, reglas)).toBe(2);
    expect(estiercolTrasElAnyo(3, 30, reglas)).toBe(3);
    expect(estiercolTrasElAnyo(2, 9, reglas)).toBe(1);
    expect(estiercolTrasElAnyo(0, 0, reglas)).toBe(0);
    expect(factorDeEstiercolMil(0, reglas)).toBe(1000);
    expect(factorDeEstiercolMil(3, reglas)).toBe(1150);
  });

  /** El llano, propio, es pasto de invierno (dehesa) para estas pruebas. */
  const mundoConDehesaEnCasa: Mundo = {
    ...elMundo,
    comarcas: {
      ...elMundo.comarcas,
      [LLANO]: { ...(elMundo.comarcas[LLANO] as ComarcaMundo), rasgos: ['dehesa'] },
    },
  };

  it('cada turno de invierno que un rebaño pasta en una comarca propia suma uno; en verano o en la ajena, no', () => {
    const abono = (turnoActual: number, donde = LLANO, jugador: IdJugador = UNO) => {
      const estado = partida(turnoActual, rebano('rebanyo-1', donde, { jugador }));
      return comarcaDe(turno(estado, [], reglas, mundoConDehesaEnCasa).estado, donde).turnosDeAbono;
    };
    expect(abono(20)).toBe(1);
    expect(abono(3)).toBe(1);
    expect(abono(12)).toBe(0);
    expect(abono(20, RIO)).toBe(0);
  });

  it('en el esquileo la comarca gana un nivel, se vacía el contador y la labor rinde un 5 % más', () => {
    const conAbono = (turnosDeAbono: number, estiercol: number) =>
      turno(conComarca(partida(10), LLANO, { turnosDeAbono, estiercol }), [], reglas, elMundo);
    const subida = conAbono(10, 0);
    expect(comarcaDe(subida.estado, LLANO)).toMatchObject({ estiercol: 1, turnosDeAbono: 0 });
    expect(suceso(subida.sucesos, 'comarca.estiercol')[0]?.datos).toMatchObject({
      antes: 0,
      despues: 1,
    });
    // Sin invernada baja, y no pasa del tope aunque sobre abono.
    expect(comarcaDe(conAbono(9, 2).estado, LLANO).estiercol).toBe(1);
    expect(comarcaDe(conAbono(40, 3).estado, LLANO).estiercol).toBe(3);
    // Fuera del esquileo no se toca.
    const otroTurno = turno(
      conComarca(partida(11), LLANO, { turnosDeAbono: 10 }),
      [],
      reglas,
      elMundo,
    );
    expect(comarcaDe(otroTurno.estado, LLANO).estiercol).toBe(0);
  });

  it('el estiércol multiplica el pan de la labor y de nada más', () => {
    const factor = (estiercol: number, edificio: string) => {
      const estado = conComarca(partida(12), LLANO, { estiercol, edificios: { [edificio]: 1 } });
      const { sucesos } = turno(estado, [], reglas, elMundo);
      return sucesos.find((s) => s.tipo === 'produccion.explotacion' && s.comarca === LLANO)?.datos[
        'estiercolMil'
      ];
    };
    expect(factor(0, 'granja')).toBeUndefined();
    expect(factor(2, 'granja')).toBe(1100);
    expect(factor(3, 'huerta')).toBe(1150);
    expect(factor(3, 'aserradero')).toBeUndefined();
  });
});

// ——— Puertos ———————————————————————————————————————————————————————————————

describe('los puertos', () => {
  const PUERTO_ABAJO = 'prueba-mina';

  function avisos(turnoActual: number): Suceso[] {
    const estado = partida(turnoActual, rebano('rebanyo-1', PUERTO_ABAJO, { ruta: [c(SIERRA)] }));
    return suceso(turno(estado, [], reglas, elMundo).sucesos, 'rebanyo.aviso-puerto');
  }

  it('avisa exactamente dos turnos antes de que el puerto cierre, y solo entonces', () => {
    // El invierno empieza en el turno 23: el aviso va en el 21.
    expect([19, 20, 21, 22, 23].map((t) => avisos(t).length)).toEqual([0, 0, 1, 0, 0]);
    expect(avisos(21)[0]).toMatchObject({
      jugador: UNO,
      datos: { rebanyo: 'rebanyo-1', puerto: 'Puerto de Prueba', turnos: 2 },
    });
  });

  it('no avisa a un rebaño que no tiene el puerto por delante', () => {
    const estado = partida(
      21,
      rebano('rebanyo-1', 'prueba-llano', { ruta: [c('prueba-monte')] }),
      rebano('rebanyo-2', PUERTO_ABAJO),
    );
    expect(suceso(turno(estado, [], reglas, elMundo).sucesos, 'rebanyo.aviso-puerto')).toHaveLength(
      0,
    );
  });

  it('las nieves tempranas adelantan el aviso porque adelantan el cierre', () => {
    const nieves = {
      id: 'ac-prueba-nieves' as IdAcontecimiento,
      tipo: 'nieves-tempranas',
      region: '01-norte',
      comarca: null,
      turnoAnuncio: 17,
      turnoInicio: 19,
      turnosDuracion: 4,
      efectos: [
        { que: 'puertos' as const, recurso: null, terreno: null, factorMil: 1000, cantidad: 2 },
      ],
    };
    const regiones = mundoDeRebanos({ region: '01-norte' });
    const estado = {
      ...partida(19, rebano('rebanyo-1', PUERTO_ABAJO, { ruta: [c(SIERRA)] })),
      acontecimientos: [nieves],
    };
    // Cierran el 21 en vez del 23: el aviso es del turno 19.
    expect(
      suceso(turno(estado, [], reglas, regiones).sucesos, 'rebanyo.aviso-puerto'),
    ).toHaveLength(1);
  });

  it('con el puerto cerrado se detiene ante él, y si la nieve lo pilla a medio puerto, vuelve', () => {
    const cerrado = turno(
      partida(23, rebano('rebanyo-1', PUERTO_ABAJO, { ruta: [c(SIERRA)] })),
      [],
      reglas,
      elMundo,
    );
    expect(suceso(cerrado.sucesos, 'rebanyo.detenido')[0]?.datos).toMatchObject({
      motivo: 'camino-cerrado',
      puerto: 'Puerto de Prueba',
    });
    expect(rebanyoDe(cerrado.estado, 'rebanyo-1').situacion).toMatchObject({
      donde: 'comarca',
      comarca: PUERTO_ABAJO,
    });

    const amedias = rebano('rebanyo-1', PUERTO_ABAJO, {
      ruta: [c(SIERRA)],
      situacion: {
        donde: 'camino',
        desde: c(PUERTO_ABAJO),
        hasta: c(SIERRA),
        jornadasHechasMil: 3000,
      },
    });
    const vuelve = turno(partida(23, amedias), [], reglas, elMundo);
    expect(suceso(vuelve.sucesos, 'rebanyo.vuelve-por-nieve')).toHaveLength(1);
    expect(rebanyoDe(vuelve.estado, 'rebanyo-1').situacion).toMatchObject({
      donde: 'comarca',
      comarca: PUERTO_ABAJO,
    });
  });
});

// ——— Determinismo, validación y cambios ——————————————————————————————————————

describe('determinismo, validación y cambios', () => {
  it('barajar las órdenes no cambia la huella del turno', () => {
    const estado = partida(12, rebano('rebanyo-1', SIERRA), rebano('rebanyo-2', RIO));
    const ordenes = [
      formar(estado.turno),
      rutaDeRebano(estado.turno, 'rebanyo-1', RIO),
      rutaDeRebano(estado.turno, 'rebanyo-2', SIERRA),
    ];
    const huella = turno(estado, ordenes, reglas, elMundo).estado.huellaTurnoAnterior;
    const azar = azarDeTexto('barajar-rebanos');
    for (let i = 0; i < 6; i += 1) {
      expect(turno(estado, azar.barajar(ordenes), reglas, elMundo).estado.huellaTurnoAnterior).toBe(
        huella,
      );
    }
  });

  it('el estado acepta rebaños y rechaza uno con un jugador que no existe', () => {
    const base0 = estadoDeEjemplo();
    const uno = {
      id: 'rebanyo-1',
      jugador: 'mesta',
      nombre: 'Rebaño de Prueba',
      situacion: { donde: 'comarca', comarca: 'prueba-llano' },
      ruta: [],
      cabezas: 1000,
      pastoDelAnyoMil: 0,
      turnosSinPasto: 0,
    };
    expect(validarEstado({ ...base0, rebanyos: { 'rebanyo-1': uno } }).ok).toBe(true);
    expect(
      validarEstado({ ...base0, rebanyos: { 'rebanyo-1': { ...uno, jugador: 'fantasma' } } }).ok,
    ).toBe(false);
  });

  it('las tablas de ganadería validan y rechazan una cifra imposible', () => {
    expect(validarTablas(tablasDeEjemplo()).ok).toBe(true);
    const mala = structuredClone(tablasDeEjemplo());
    (mala['ganaderia'] as Record<string, unknown>)['cabezasPorRebanyo'] = 0;
    expect(validarTablas(mala).ok).toBe(false);
    expect(GANADERIA.turnosSinPastoParaPerder).toBe(2);
  });

  function contexto() {
    return crearContexto(partida(12, rebano('rebanyo-1', SIERRA)), [], elMundo, reglas);
  }

  it('las cabezas no pueden quedar negativas, el abono no pasa del tope y un rebaño no se repite', () => {
    const ctx = contexto();
    expect(() => {
      aplicar(ctx, {
        tipo: 'rebanyo-cabezas',
        rebanyo: 'rebanyo-1' as IdRebanyo,
        delta: -1001,
        motivo: 'prueba',
      });
    }).toThrow(/se quedaria con -1 cabezas/);
    expect(() => {
      aplicar(ctx, { tipo: 'abono', comarca: c(LLANO), turnosDeAbono: 0, estiercol: 4 });
    }).toThrow(/tope 3/);
    expect(() => {
      aplicar(ctx, { tipo: 'rebanyo-alta', rebanyo: rebano('rebanyo-1', SIERRA) });
    }).toThrow(/Ya hay un rebanyo/);
    expect(() => {
      aplicar(ctx, {
        tipo: 'rebanyo-cuentas',
        rebanyo: 'rebanyo-1' as IdRebanyo,
        pastoDelAnyoMil: -1,
        turnosSinPasto: 0,
      });
    }).toThrow();
    expect(() => {
      aplicar(ctx, { tipo: 'rebanyo-baja', rebanyo: 'rebanyo-9' as IdRebanyo });
    }).toThrow(/ningun rebanyo/);
  });
});
