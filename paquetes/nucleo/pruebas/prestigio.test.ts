// Prestigio, hitos y clasificacion (T-043): el marcador por capitulos con cifras hechas a mano, el
// recuento sin acumulacion, los doce hitos en su umbral exacto, las primicias, los desempates de la
// clasificacion, las penalizaciones y lo que la fase 11 apunta en el registro.
import { describe, expect, it } from 'vitest';

import { aplicar } from '../src/cambios.ts';
import { crearContexto } from '../src/contexto.ts';
import { DATOS_DE_HITOS, PRESTIGIO } from '../src/datos/prestigio.ts';
import { fasePrestigio } from '../src/fases/11-prestigio.ts';
import { clasificacion, clasificar } from '../src/reglas/clasificacion.ts';
import type { HechosDelTurno } from '../src/reglas/hitos.ts';
import { ganadorDePrimicia, hitosNuevos } from '../src/reglas/hitos.ts';
import { prestigioDe } from '../src/reglas/prestigio.ts';
import { registrarSuceso } from '../src/sucesos.ts';
import type {
  Conocimiento,
  EstadoJugador,
  EstadoPartida,
  RegistroDeJugador,
} from '../src/tipos/estado.ts';
import type { IdJugador } from '../src/tipos/ids.ts';
import type { Hito } from '../src/tipos/reglas.ts';
import { HITOS } from '../src/tipos/reglas.ts';
import { validarEstado } from '../src/validacion/validarEstado.ts';
import { validarTablas } from '../src/validacion/validarTablas.ts';
import { explicar } from '../src/validacion/validador.ts';
import { DOS, UNO, c, conComarca, escenario, mundo, reglas, turno } from './recuas.ts';

const REGISTRO_VACIO: RegistroDeJugador = {
  obrasMayores: {},
  anyosTrashumantes: 0,
  feriasDestacadas: 0,
  volumenEnFerias: {},
  comarcasPerdidas: 0,
  turnosConEscasez: 0,
  turnosDeDespensaEstable: 0,
};

function jugadorDe(estado: EstadoPartida, id: IdJugador = UNO): EstadoJugador {
  const jugador = estado.jugadores[id];
  if (jugador === undefined) throw new Error(`falta el jugador ${id}`);
  return jugador;
}

/** El estado con campos del jugador cambiados. */
function conJugador(
  estado: EstadoPartida,
  cambios: Partial<EstadoJugador>,
  id: IdJugador = UNO,
): EstadoPartida {
  return {
    ...estado,
    jugadores: { ...estado.jugadores, [id]: { ...jugadorDe(estado, id), ...cambios } },
  };
}

const conRegistro = (estado: EstadoPartida, registro: Partial<RegistroDeJugador>, id = UNO) =>
  conJugador(estado, { registro: { ...REGISTRO_VACIO, ...registro } }, id);

const SIN_HECHOS: HechosDelTurno = { mejorEsquileoMil: 0, prestigio: 0 };

/** Solo la comarca de origen, sin nada explorado alrededor. */
function soloElOrigen(estado: EstadoPartida): EstadoPartida {
  const conocimiento: Record<string, Conocimiento> = {
    'prueba-llano': { nivel: 'propia', turnoUltimaNoticia: 1, datos: null },
  };
  return conJugador(estado, { conocimiento });
}

/** Cada jugador conoce solo su capital: asi ningun hito salta sin que la prueba lo busque. */
function sinExplorar(estado: EstadoPartida): EstadoPartida {
  return {
    ...estado,
    jugadores: Object.fromEntries(
      Object.entries(estado.jugadores).map(([id, jugador]) => [
        id,
        {
          ...jugador,
          conocimiento: {
            [jugador.capital]: { nivel: 'propia' as const, turnoUltimaNoticia: 1, datos: null },
          },
        },
      ]),
    ),
  };
}

// ——— El prestigio por capitulos ————————————————————————————————————————————

describe('el prestigio por capítulos', () => {
  it('la tabla y los hitos validan con las tablas del juego', () => {
    const resultado = validarTablas(structuredClone(reglas));
    expect(explicar(resultado.ok ? [] : resultado.errores)).toBe('');
    expect(reglas.prestigio).toEqual(PRESTIGIO);
    expect(Object.keys(DATOS_DE_HITOS)).toEqual([...HITOS]);
  });

  it('escenario 1, el origen: 40 vecinos, una comarca y siete conocidas = 49', () => {
    const estado = escenario();
    const p = prestigioDe(estado, jugadorDe(estado), reglas);
    expect(p.capitulos).toEqual({
      poblacion: 8, // 40 / 5
      territorio: 20,
      obras: 0,
      caminos: 0,
      comercio: 0,
      exploracion: 21, // 6 exploradas y la propia, a 3
      ganaderia: 0,
      industria: 0,
      hitos: 0,
    });
    expect(p.penalizaciones).toBe(0);
    expect(p.total).toBe(49);
  });

  it('escenario 2, un dominio hecho: 853', () => {
    let estado = conComarca(escenario(), 'prueba-llano', { poblacion: 150, fuero: 'fuero' });
    estado = conComarca(estado, 'prueba-vega', { duenyo: UNO, poblacion: 60, aperos: 3 });
    estado = conComarca(estado, 'prueba-costa', { duenyo: UNO, poblacion: 23, aperos: 2 });
    estado = conRegistro(estado, {
      obrasMayores: { catedral: 1, calzada: 2 },
      anyosTrashumantes: 2,
      feriasDestacadas: 1,
      comarcasPerdidas: 1,
      turnosConEscasez: 4,
    });
    estado = {
      ...conJugador(estado, {
        hitos: { villa: 10, 'pequenyo-dominio': 12 },
        registro: jugadorDe(estado).registro,
      }),
      primicias: { villa: UNO },
    };
    const p = prestigioDe(estado, jugadorDe(estado), reglas);
    expect(p.capitulos).toEqual({
      poblacion: 46, // 233 vecinos / 5
      territorio: 70, // 30 con fuero + 20 + 20
      obras: 550, // catedral 250 + dos calzadas a 150
      caminos: 30, // dos tramos de calzada a 15
      comercio: 30,
      exploracion: 21,
      ganaderia: 20,
      industria: 10, // solo la vega llega a aperos 3
      hitos: 100, // villa 20 + dominio 30 + primicia 50
    });
    expect(p.penalizaciones).toBe(24); // 20 por la comarca perdida y 4 turnos de escasez
    expect(p.total).toBe(853);
  });

  it('escenario 3, una casa en apuros: el prestigio puede ser negativo', () => {
    let estado = soloElOrigen(conComarca(escenario(), 'prueba-llano', { poblacion: 12 }));
    estado = conRegistro(estado, { turnosConEscasez: 10 });
    expect(prestigioDe(estado, jugadorDe(estado), reglas).total).toBe(2 + 20 + 3 - 10);
    estado = conRegistro(estado, { turnosConEscasez: 10, comarcasPerdidas: 3 });
    const p = prestigioDe(estado, jugadorDe(estado), reglas);
    expect(p.penalizaciones).toBe(70);
    expect(p.total).toBe(-45);
  });

  it('el almacén no da prestigio: se premia lo hecho, no lo guardado', () => {
    const pobre = escenario({ almacen: { pan: 0, maravedis: 0 } });
    const rico = escenario({ almacen: { pan: 9000, maravedis: 9000, piedra: 900 } });
    expect(prestigioDe(rico, jugadorDe(rico), reglas)).toEqual(
      prestigioDe(pobre, jugadorDe(pobre), reglas),
    );
  });

  it('recalcular dos veces da lo mismo, y el total guardado es siempre el recalculado', () => {
    const estado = conComarca(escenario(), 'prueba-llano', { poblacion: 150 });
    expect(prestigioDe(estado, jugadorDe(estado), reglas)).toEqual(
      prestigioDe(estado, jugadorDe(estado), reglas),
    );
    // Seis turnos: el total guardado es siempre el recalculado sobre el estado final, y los cambios
    // publicados suman exactamente lo que se movio. Nada se acumula a escondidas.
    let actual = estado;
    let publicado = 0;
    for (let i = 0; i < 6; i += 1) {
      const resultado = turno(actual);
      actual = resultado.estado;
      publicado += resultado.sucesos
        .filter((s) => s.tipo === 'prestigio.cambio')
        .reduce((total, s) => total + Number(s.datos['delta']), 0);
      expect(jugadorDe(actual).prestigio).toBe(
        prestigioDe(actual, jugadorDe(actual), reglas).total,
      );
    }
    expect(jugadorDe(actual).prestigio - jugadorDe(estado).prestigio).toBe(publicado);
    expect(publicado).not.toBe(0);
  });

  it('la fase publica el desglose de cada jugador', () => {
    const resultado = turno(escenario());
    const [desglose] = resultado.sucesos.filter((s) => s.tipo === 'prestigio.desglose');
    expect(desglose?.jugador).toBe(UNO);
    expect(desglose?.datos['total']).toBe(jugadorDe(resultado.estado).prestigio);
  });
});

// ——— Los hitos ——————————————————————————————————————————————————————————————

describe('los doce hitos, ni antes ni después', () => {
  const nuevos = (estado: EstadoPartida, hechos: HechosDelTurno = SIN_HECHOS): Hito[] =>
    hitosNuevos(estado, jugadorDe(estado), hechos, reglas);
  const base = soloElOrigen(escenario());

  it('sin nada hecho no se logra ninguno', () => {
    expect(nuevos(base)).toEqual([]);
  });

  it('primer horizonte: la primera comarca explorada', () => {
    const explorada = conJugador(base, {
      conocimiento: {
        ...jugadorDe(base).conocimiento,
        'prueba-vega': { nivel: 'explorada', turnoUltimaNoticia: 3, datos: null },
      },
    });
    const oida = conJugador(base, {
      conocimiento: {
        ...jugadorDe(base).conocimiento,
        'prueba-vega': { nivel: 'oida', turnoUltimaNoticia: 3, datos: null },
      },
    });
    expect(nuevos(oida)).toEqual([]);
    expect(nuevos(explorada)).toEqual(['primer-horizonte']);
  });

  it('despensa estable: al tercer turno seguido', () => {
    expect(nuevos(conRegistro(base, { turnosDeDespensaEstable: 2 }))).toEqual([]);
    expect(nuevos(conRegistro(base, { turnosDeDespensaEstable: 3 }))).toEqual(['despensa-estable']);
  });

  it('villa a 150 vecinos en la capital y ciudad a 260', () => {
    const capital = (poblacion: number) => nuevos(conComarca(base, 'prueba-llano', { poblacion }));
    expect(capital(149)).toEqual([]);
    expect(capital(150)).toEqual(['villa']);
    expect(capital(259)).toEqual(['villa']);
    expect(capital(260)).toEqual(['villa', 'ciudad']);
    // Los vecinos de otras comarcas no hacen villa a la capital.
    const repartidos = conComarca(
      conComarca(base, 'prueba-vega', { duenyo: UNO, poblacion: 200 }),
      'prueba-llano',
      { poblacion: 40 },
    );
    expect(nuevos(repartidos)).toEqual(['mas-alla-del-origen']);
  });

  it('más allá del origen con dos comarcas y un pequeño dominio con tres', () => {
    const dos = conComarca(base, 'prueba-vega', { duenyo: UNO });
    const tres = conComarca(dos, 'prueba-costa', { duenyo: UNO });
    expect(nuevos(dos)).toEqual(['mas-alla-del-origen']);
    expect(nuevos(tres)).toEqual(['mas-alla-del-origen', 'pequenyo-dominio']);
  });

  it('año redondo con un esquileo de calidad 900 o más', () => {
    expect(nuevos(base, { mejorEsquileoMil: 899, prestigio: 0 })).toEqual([]);
    expect(nuevos(base, { mejorEsquileoMil: 900, prestigio: 0 })).toEqual(['anyo-redondo']);
  });

  it('maestro de obra con cualquier obra mayor; camino abierto solo con una calzada', () => {
    expect(nuevos(conRegistro(base, { obrasMayores: { muralla: 1 } }))).toEqual([
      'maestro-de-obra',
    ]);
    expect(nuevos(conRegistro(base, { obrasMayores: { calzada: 1 } }))).toEqual([
      'maestro-de-obra',
      'camino-abierto',
    ]);
  });

  it('señor de ferias con 1 000 de volumen propio en el año, sumando todas las ferias', () => {
    const volumen = (volumenEnFerias: Record<string, number>) =>
      nuevos(conRegistro(base, { volumenEnFerias }));
    expect(volumen({ 'feria-a': 999 })).toEqual([]);
    expect(volumen({ 'feria-a': 600, 'feria-b': 400 })).toEqual(['senyor-de-ferias']);
  });

  it('casa conocida a 1 000 de prestigio', () => {
    expect(nuevos(base, { mejorEsquileoMil: 0, prestigio: 999 })).toEqual([]);
    expect(nuevos(base, { mejorEsquileoMil: 0, prestigio: 1000 })).toEqual(['casa-conocida']);
  });

  it('buen nombre está desactivado hasta los contratos (T-103)', () => {
    expect(DATOS_DE_HITOS['buen-nombre'].desactivado).toBe(true);
    expect(DATOS_DE_HITOS['buen-nombre'].pendienteDe).toBe('T-103');
    const todo = conJugador(base, { credito: 100 });
    expect(nuevos(todo)).not.toContain('buen-nombre');
  });

  it('un hito no se repite: el que ya se tiene no vuelve a salir, y el motor no lo deja apuntar', () => {
    const villa = conJugador(conComarca(base, 'prueba-llano', { poblacion: 200 }), {
      hitos: { villa: 4 },
    });
    expect(nuevos(villa)).toEqual([]);
    const ctx = crearContexto(villa, [], mundo, reglas);
    expect(() => {
      aplicar(ctx, { tipo: 'hito', jugador: UNO, hito: 'villa' });
    }).toThrow(/no se repite/);
  });

  it('en el motor: el hito se apunta con su turno, da su prestigio y se anuncia', () => {
    const estado = conComarca(sinExplorar(escenario()), 'prueba-llano', { poblacion: 200 });
    const resultado = turno(estado);
    expect(jugadorDe(resultado.estado).hitos.villa).toBe(estado.turno);
    const logrados = resultado.sucesos.filter((s) => s.tipo === 'hito.logrado');
    expect(logrados.map((s) => s.datos)).toEqual([{ hito: 'villa', prestigio: 20 }]);
    // Y al turno siguiente no se repite.
    const siguiente = turno(resultado.estado);
    expect(siguiente.sucesos.filter((s) => s.tipo === 'hito.logrado')).toEqual([]);
  });
});

// ——— Las primicias ——————————————————————————————————————————————————————————

describe('las primicias', () => {
  const dosEnVilla = (prestigioUno: number, prestigioDos: number): EstadoPartida => {
    let estado = sinExplorar(escenario({ conDos: true }));
    estado = conComarca(estado, 'prueba-llano', { poblacion: 200 });
    estado = conComarca(estado, 'prueba-costa', { duenyo: DOS, poblacion: 200 });
    estado = conJugador(estado, { prestigio: prestigioUno });
    return conJugador(estado, { prestigio: prestigioDos }, DOS);
  };
  const primicias = (estado: EstadoPartida) =>
    turno(estado).sucesos.filter((s) => s.tipo === 'hito.primicia');

  it('el primero se lleva 50 más y se anuncia a todos', () => {
    const estado = conComarca(sinExplorar(escenario()), 'prueba-llano', { poblacion: 200 });
    const resultado = turno(estado);
    expect(resultado.estado.primicias).toEqual({ villa: UNO });
    const [primicia] = resultado.sucesos.filter((s) => s.tipo === 'hito.primicia');
    expect(primicia?.datos).toEqual({ hito: 'villa', prestigio: 50, publico: 1 });
    expect(prestigioDe(resultado.estado, jugadorDe(resultado.estado), reglas).capitulos.hitos).toBe(
      70,
    );
  });

  it('una sola vez por hito y partida: el segundo logra el hito, pero no la primicia', () => {
    const estado = {
      ...conComarca(dosEnVilla(0, 0), 'prueba-llano', { poblacion: 40 }),
      primicias: {},
    };
    const primero = turno(estado);
    expect(primero.estado.primicias).toEqual({ villa: DOS });
    const segundo = turno(conComarca(primero.estado, 'prueba-llano', { poblacion: 200 }));
    expect(jugadorDe(segundo.estado).hitos.villa).toBe(primero.estado.turno);
    expect(segundo.estado.primicias).toEqual({ villa: DOS });
    expect(segundo.sucesos.filter((s) => s.tipo === 'hito.primicia')).toEqual([]);
    const ctx = crearContexto(segundo.estado, [], mundo, reglas);
    expect(() => {
      aplicar(ctx, { tipo: 'primicia', jugador: UNO, hito: 'villa' });
    }).toThrow(/ya es de otro/);
  });

  it('si dos llegan a la vez, gana el de más prestigio; si empatan, el hash, y nunca el orden', () => {
    expect(primicias(dosEnVilla(10, 5)).map((s) => s.jugador)).toEqual([UNO]);
    expect(primicias(dosEnVilla(5, 10)).map((s) => s.jugador)).toEqual([DOS]);
    const empate = [
      { jugador: UNO, prestigio: 7 },
      { jugador: DOS, prestigio: 7 },
    ];
    const ganador = ganadorDePrimicia(empate, 'villa', 'semilla', 9);
    expect(ganadorDePrimicia([...empate].reverse(), 'villa', 'semilla', 9)).toBe(ganador);
    expect([UNO, DOS]).toContain(ganador);
  });
});

// ——— La clasificacion ————————————————————————————————————————————————————————

describe('la clasificación', () => {
  const tres = 'casa-tres' as IdJugador;
  function conTres(): EstadoPartida {
    const estado = escenario({ conDos: true });
    const uno = jugadorDe(estado);
    return {
      ...estado,
      jugadores: {
        ...estado.jugadores,
        [tres]: { ...uno, id: tres, nombre: 'Casa Tres', capital: c('prueba-rio') },
      },
    };
  }

  it('ordena por prestigio y desempata por vecinos, luego comarcas y luego hash', () => {
    let estado = conTres();
    estado = conComarca(estado, 'prueba-costa', { duenyo: DOS, poblacion: 40 });
    estado = conComarca(estado, 'prueba-rio', { duenyo: tres, poblacion: 40 });
    // Mismo prestigio los tres (una comarca, 40 vecinos y lo mismo explorado).
    const totales = [UNO, DOS, tres].map(
      (id) => prestigioDe(estado, jugadorDe(estado, id), reglas).total,
    );
    expect(new Set(totales).size).toBe(1);
    const porHash = clasificar(estado, reglas).map((p) => p.jugador);
    expect(new Set(porHash).size).toBe(3);

    // Mas vecinos en la misma franja de prestigio (41 vecinos no llegan a otro punto).
    const conVecinos = conComarca(estado, 'prueba-rio', { poblacion: 44 });
    expect(clasificar(conVecinos, reglas)[0]?.jugador).toBe(tres);

    // Mas prestigio manda sobre todo lo demas.
    const conPrestigio = conComarca(conVecinos, 'prueba-costa', { poblacion: 45 });
    expect(clasificar(conPrestigio, reglas).map((p) => p.jugador)[0]).toBe(DOS);
  });

  it('no depende del orden en que estén los jugadores', () => {
    const estado = conTres();
    const invertido = {
      ...estado,
      jugadores: Object.fromEntries(Object.entries(estado.jugadores).reverse()),
    };
    expect(clasificar(invertido, reglas)).toEqual(clasificar(estado, reglas));
  });

  it('se guarda cada turno con el puesto anterior, y la variación dice quién sube', () => {
    const estado = conComarca(sinExplorar(escenario({ conDos: true })), 'prueba-costa', {
      duenyo: DOS,
      poblacion: 20,
    });
    const primero = turno(estado);
    expect(
      primero.estado.clasificacion.map((p) => [p.jugador, p.puesto, p.puestoAnterior]),
    ).toEqual([
      [UNO, 1, null],
      [DOS, 2, null],
    ]);
    const sube = conComarca(primero.estado, 'prueba-costa', { poblacion: 300 });
    const segundo = turno(sube);
    expect(
      segundo.estado.clasificacion.map((p) => [p.jugador, p.puesto, p.puestoAnterior]),
    ).toEqual([
      [DOS, 1, 2],
      [UNO, 2, 1],
    ]);
    const lineas = clasificacion(segundo.estado, reglas);
    expect(lineas.map((l) => [l.jugador, l.variacion])).toEqual([
      [DOS, 1],
      [UNO, -1],
    ]);
    expect(lineas[0]?.prestigio.total).toBe(segundo.estado.clasificacion[0]?.prestigio);
  });
});

// ——— Lo que apunta la fase 11 ————————————————————————————————————————————————

describe('lo que la fase 11 apunta en el registro', () => {
  /** Corre la fase 11 sobre un estado con sucesos de las fases anteriores ya puestos. */
  function fase11(
    estado: EstadoPartida,
    sucesos: readonly {
      tipo: string;
      datos: Record<string, number | string>;
      jugador?: IdJugador;
    }[],
  ) {
    const ctx = crearContexto(estado, [], mundo, reglas);
    for (const s of sucesos) {
      registrarSuceso(ctx.sucesos, 'obras', s.tipo, s.datos, { jugador: s.jugador ?? UNO });
    }
    ctx.fase = 'prestigio';
    fasePrestigio(ctx);
    return ctx;
  }
  const registro = (ctx: ReturnType<typeof fase11>) => jugadorDe(ctx.estado).registro;

  it('las obras mayores terminadas por el jugador, por tipo', () => {
    const ctx = fase11(sinExplorar(escenario()), [
      { tipo: 'hito.obra-mayor', datos: { obra: 'calzada', hacia: 'prueba-vega' } },
      { tipo: 'hito.obra-mayor', datos: { obra: 'muralla', hacia: '' }, jugador: DOS },
    ]);
    expect(registro(ctx).obrasMayores).toEqual({ calzada: 1 });
    expect(jugadorDe(ctx.estado).hitos).toEqual({
      'maestro-de-obra': ctx.turno,
      'camino-abierto': ctx.turno,
    });
  });

  it('los años trashumantes: solo el esquileo de un año bien pastado', () => {
    const ctx = fase11(escenario(), [
      { tipo: 'rebanyo.esquileo', datos: { calidadMil: 749 } },
      { tipo: 'rebanyo.esquileo', datos: { calidadMil: 750 } },
      { tipo: 'rebanyo.esquileo', datos: { calidadMil: 920 } },
    ]);
    expect(registro(ctx).anyosTrashumantes).toBe(2);
    expect(jugadorDe(ctx.estado).hitos['anyo-redondo']).toBe(ctx.turno);
  });

  it('las ferias: cuenta una feria al cruzar los 500 en el año, y el año empieza de cero', () => {
    const trato = (mercado: string, importe: number) => ({
      tipo: 'mercado.trato',
      datos: { mercado, importe },
    });
    const ctx = fase11(escenario({ turno: 30 }), [
      trato('feria-medina', 300),
      trato('feria-medina', 250),
      trato('mercado-llano', 5000),
      trato('feria-sevilla', 100),
    ]);
    expect(registro(ctx).volumenEnFerias).toEqual({ 'feria-medina': 550, 'feria-sevilla': 100 });
    expect(registro(ctx).feriasDestacadas).toBe(1);
    // La misma feria no cuenta dos veces en el año.
    const despues = fase11(conRegistro(escenario({ turno: 31 }), registro(ctx)), [
      trato('feria-medina', 900),
    ]);
    expect(registro(despues).feriasDestacadas).toBe(1);
    // El primer turno del anyo (el 49) se empieza de cero y vuelve a poder contar.
    const nuevoAnyo = fase11(conRegistro(escenario({ turno: 49 }), registro(despues)), [
      trato('feria-medina', 500),
    ]);
    expect(registro(nuevoAnyo).volumenEnFerias).toEqual({ 'feria-medina': 500 });
    expect(registro(nuevoAnyo).feriasDestacadas).toBe(2);
  });

  it('la despensa: turnos seguidos sin perder pan y con reserva; perder pan la reinicia', () => {
    const pan = (delta: number) => ({
      tipo: 'almacen.cambio',
      datos: { recurso: 'pan', delta, total: 0, motivo: 'prueba' },
    });
    const estable = fase11(conRegistro(escenario(), { turnosDeDespensaEstable: 2 }), [
      pan(-10),
      pan(12),
    ]);
    expect(registro(estable).turnosDeDespensaEstable).toBe(3);
    expect(jugadorDe(estable.estado).hitos['despensa-estable']).toBe(estable.turno);
    const pierde = fase11(conRegistro(escenario(), { turnosDeDespensaEstable: 2 }), [pan(-1)]);
    expect(registro(pierde).turnosDeDespensaEstable).toBe(0);
    const sinReserva = fase11(
      conRegistro(escenario({ almacen: { pan: 59 } }), { turnosDeDespensaEstable: 2 }),
      [],
    );
    expect(registro(sinReserva).turnosDeDespensaEstable).toBe(0);
  });
});

// ——— Las penalizaciones ————————————————————————————————————————————————————————

describe('las penalizaciones restan lo estipulado', () => {
  it('−1 por cada turno con escasez', () => {
    const conEscasez = conJugador(escenario({ almacen: { pan: 0 } }), { escasez: true });
    const ctx = crearContexto(conEscasez, [], mundo, reglas);
    ctx.fase = 'prestigio';
    const antes = prestigioDe(conEscasez, jugadorDe(conEscasez), reglas);
    fasePrestigio(ctx);
    const despues = prestigioDe(ctx.estado, jugadorDe(ctx.estado), reglas);
    expect(jugadorDe(ctx.estado).registro.turnosConEscasez).toBe(1);
    expect(despues.penalizaciones - antes.penalizaciones).toBe(1);
  });

  it('−20 por comarca perdida por deslealtad, aunque ya no se tenga', () => {
    const estado = conComarca(escenario(), 'prueba-vega', { duenyo: UNO, poblacion: 20 });
    const ctx = crearContexto(estado, [], mundo, reglas);
    registrarSuceso(
      ctx.sucesos,
      'territorio',
      'comarca.vuelve-neutral',
      { anterior: UNO },
      {
        comarca: c('prueba-vega'),
        jugador: UNO,
      },
    );
    ctx.fase = 'prestigio';
    fasePrestigio(ctx);
    const p = prestigioDe(ctx.estado, jugadorDe(ctx.estado), reglas);
    expect(jugadorDe(ctx.estado).registro.comarcasPerdidas).toBe(1);
    expect(p.penalizaciones).toBe(20);
  });

  it('en el motor: una comarca desleal que vuelve a neutral cuesta 20', () => {
    const estado = conComarca(escenario(), 'prueba-vega', {
      duenyo: UNO,
      lealtad: 0,
      turnosDesleal: 50,
    });
    const resultado = turno(estado);
    expect(resultado.sucesos.map((s) => s.tipo)).toContain('comarca.vuelve-neutral');
    expect(jugadorDe(resultado.estado).registro.comarcasPerdidas).toBe(1);
  });
});

describe('el estado guarda el marcador con coherencia', () => {
  it('una primicia sin su hito o una clasificación con huecos no validan', () => {
    const bueno = turno(escenario()).estado;
    const valida = (estado: unknown) => validarEstado(JSON.parse(JSON.stringify(estado)), mundo);
    expect(valida(bueno).ok).toBe(true);
    const sinHito = { ...bueno, primicias: { ciudad: UNO } };
    const rutas = (r: ReturnType<typeof valida>) => (r.ok ? [] : r.errores.map((e) => e.ruta));
    expect(rutas(valida(sinHito))).toEqual(['primicias.ciudad']);
    const conHueco = {
      ...bueno,
      clasificacion: bueno.clasificacion.map((p) => ({ ...p, puesto: p.puesto + 1 })),
    };
    expect(rutas(valida(conHueco))).toEqual(['clasificacion.0']);
  });
});
