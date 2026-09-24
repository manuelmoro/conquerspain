// Acontecimientos anunciados (T-039): el sorteo del calendario, los modificadores, la fase 10 turno a
// turno y lo que hace cada fase que los consulta.
import { describe, expect, it } from 'vitest';

import { aplicar } from '../src/cambios.ts';
import { crearContexto } from '../src/contexto.ts';
import { ACONTECIMIENTOS } from '../src/datos/acontecimientos.ts';
import { faseAcontecimientos } from '../src/fases/10-acontecimientos.ts';
import {
  acontecimientosActivos,
  afectaA,
  efectosActivos,
  factorDeAcontecimientos,
  precioBaseEfectivo,
  ultimoTurnoDe,
} from '../src/reglas/acontecimientos.ts';
import { jornadasAdministrativasMil, jornadasDesde } from '../src/reglas/administracion.ts';
import { nivelAlcanzadoMil } from '../src/reglas/precios.ts';
import { estadoEstacionalDe } from '../src/reglas/calendario.ts';
import {
  calendarioDeAcontecimientos,
  turnoAbsoluto,
} from '../src/reglas/calendarioDeAcontecimientos.ts';
import { claveDeTramo, costeDeTramoMil } from '../src/reglas/ruta.ts';
import type { Suceso } from '../src/tipos/cronica.ts';
import type { Acontecimiento, EstadoPartida } from '../src/tipos/estado.ts';
import type { IdAcontecimiento, IdFeria, IdMercado } from '../src/tipos/ids.ts';
import { idDeMercadoDeFeria } from '../src/tipos/ids.ts';
import type { ComarcaMundo, Mundo } from '../src/tipos/mundo.ts';
import type { Recurso } from '../src/tipos/recursos.ts';
import type { TipoDeAcontecimiento } from '../src/tipos/reglas.ts';
import { TIPOS_DE_ACONTECIMIENTO } from '../src/tipos/reglas.ts';
import { validarEstado } from '../src/validacion/validarEstado.ts';
import { validarTablas } from '../src/validacion/validarTablas.ts';
import { estadoDeEjemplo, tablasDeEjemplo } from './ejemplos.ts';
import {
  PRIMAVERA,
  UNO,
  c,
  comarcaDe,
  conComarca,
  escenario,
  mundo,
  ordenRuta,
  parada,
  recua,
  recursos,
  reglas,
  turno,
} from './recuas.ts';

const CATALOGO = ACONTECIMIENTOS.catalogo;
const NORTE = '01-norte';
const SUR = '02-sur';

/** El mundo mini repartido en dos regiones, con una feria en el rio (region sur). */
function mundoConRegiones(alReves = false): Mundo {
  const sur = new Set(['prueba-vega', 'prueba-rio', 'prueba-costa']);
  const entradas = Object.entries(mundo.comarcas).map(([id, comarca]): [string, ComarcaMundo] => [
    id,
    {
      ...comarca,
      region: sur.has(id) ? SUR : NORTE,
      ferias:
        id === 'prueba-rio'
          ? [
              {
                id: 'rio' as IdFeria,
                nombre: 'Feria del Rio',
                turnos: [12, 13],
                volumen: 'mediana' as const,
                recursosDestacados: [],
              },
            ]
          : comarca.ferias,
    },
  ]);
  return { ...mundo, comarcas: Object.fromEntries(alReves ? entradas.reverse() : entradas) };
}

const elMundo = mundoConRegiones();

/** Un acontecimiento a mano con los efectos del catalogo, para probar las fases una a una. */
function evento(
  tipo: TipoDeAcontecimiento,
  inicio: number,
  cambios: Partial<Acontecimiento> = {},
): Acontecimiento {
  const datos = CATALOGO[tipo];
  return {
    id: `ac-prueba-${tipo}` as IdAcontecimiento,
    tipo,
    region: NORTE,
    comarca: null,
    turnoAnuncio: inicio - 2,
    turnoInicio: inicio,
    turnosDuracion: datos.duracion.tipo === 'fija' ? datos.duracion.turnos : 1,
    efectos: datos.efectos,
    ...cambios,
  };
}

function conEventos(estado: EstadoPartida, ...eventos: Acontecimiento[]): EstadoPartida {
  return { ...estado, acontecimientos: eventos };
}

function tipos(sucesos: readonly Suceso[], prefijo: string): Suceso[] {
  return sucesos.filter((s) => s.tipo.startsWith(prefijo));
}

// ——— El sorteo ———————————————————————————————————————————————————————————————

describe('el calendario de un anyo', () => {
  it('es reproducible por semilla y no depende del orden de las claves del mundo', () => {
    const a = calendarioDeAcontecimientos('semilla', 3, elMundo, reglas);
    expect(calendarioDeAcontecimientos('semilla', 3, elMundo, reglas)).toEqual(a);
    expect(calendarioDeAcontecimientos('semilla', 3, mundoConRegiones(true), reglas)).toEqual(a);
    expect(a.length).toBeGreaterThanOrEqual(2);
    // Otro anyo u otra semilla dan otro calendario.
    const distintos = new Set(
      [1, 2, 3, 4, 5, 6].map((anyo) =>
        JSON.stringify(calendarioDeAcontecimientos('semilla', anyo, elMundo, reglas)),
      ),
    );
    expect(distintos.size).toBeGreaterThan(3);
  });

  it('un mundo sin regiones del catalogo (el de prueba y el relleno) no tiene acontecimientos', () => {
    expect(calendarioDeAcontecimientos('semilla', 1, mundo, reglas)).toEqual([]);
  });

  it('cada acontecimiento sale con su aviso de dos turnos, dentro de su anyo y con el catalogo', () => {
    for (let anyo = 1; anyo <= 3; anyo += 1) {
      for (const ac of calendarioDeAcontecimientos('semilla', anyo, elMundo, reglas)) {
        expect(ac.turnoInicio - ac.turnoAnuncio).toBe(2);
        const delAnyo = ac.turnoInicio - (anyo - 1) * 24;
        expect(delAnyo).toBeGreaterThanOrEqual(3);
        expect(delAnyo + ac.turnosDuracion - 1).toBeLessThanOrEqual(24);
        expect(ac.efectos).toEqual(CATALOGO[ac.tipo as TipoDeAcontecimiento].efectos);
        expect(ac.id).toMatch(new RegExp(`^ac-${String(anyo)}-\\d+$`));
      }
    }
  });

  it('cumple las reglas del sorteo en 500 anyos simulados', () => {
    const vistos = new Set<string>();
    for (let anyo = 1; anyo <= 500; anyo += 1) {
      const calendario = calendarioDeAcontecimientos(
        `semilla-${String(anyo % 7)}`,
        anyo,
        elMundo,
        reglas,
      );
      const { minimoPorAnyo, maximoPorAnyo } = reglas.acontecimientos.sorteo;
      // Entre dos y cuatro, con al menos uno positivo.
      expect(calendario.length).toBeGreaterThanOrEqual(minimoPorAnyo);
      expect(calendario.length).toBeLessThanOrEqual(maximoPorAnyo);
      expect(
        calendario.some((ac) => CATALOGO[ac.tipo as TipoDeAcontecimiento].signo === 'positivo'),
      ).toBe(true);

      const negativos = calendario.filter(
        (ac) => CATALOGO[ac.tipo as TipoDeAcontecimiento].signo === 'negativo',
      );
      // Como mucho un negativo por region: asi nunca se solapan dos en la misma.
      const porRegion = negativos.map((ac) => ac.region);
      expect(new Set(porRegion).size).toBe(porRegion.length);
      for (const a of negativos) {
        for (const b of negativos) {
          if (a === b || a.region !== b.region) continue;
          expect(a.turnoInicio > ultimoTurnoDe(b) || b.turnoInicio > ultimoTurnoDe(a)).toBe(true);
        }
      }
      // Un tipo no se repite en una region, y los ids son unicos y van por orden de inicio.
      const claves = calendario.map((ac) => `${ac.tipo}|${ac.region}`);
      expect(new Set(claves).size).toBe(claves.length);
      expect(new Set(calendario.map((ac) => ac.id)).size).toBe(calendario.length);
      expect(calendario.map((ac) => ac.turnoInicio)).toEqual(
        [...calendario.map((ac) => ac.turnoInicio)].sort((x, y) => x - y),
      );

      for (const ac of calendario) {
        vistos.add(ac.tipo);
        const datos = CATALOGO[ac.tipo as TipoDeAcontecimiento];
        const delAnyo = ac.turnoInicio - (anyo - 1) * 24;
        if (datos.inicio !== null) {
          expect(delAnyo).toBeGreaterThanOrEqual(datos.inicio.desde);
          expect(delAnyo).toBeLessThanOrEqual(datos.inicio.hasta);
        }
        if (ac.tipo === 'peste-de-ganado') {
          expect(delAnyo + ac.turnosDuracion - 1).toBe(reglas.estaciones.turnoDeEsquileo);
        }
        if (ac.tipo === 'buen-ano-de-feria') {
          // La feria del rio: turnos 12 y 13, en la comarca del rio.
          expect(ac).toMatchObject({ comarca: 'prueba-rio', region: SUR, turnosDuracion: 2 });
          expect(delAnyo).toBe(12);
        }
        if (ac.tipo === 'incendio') {
          const comarca = elMundo.comarcas[ac.comarca ?? ''];
          expect(comarca?.region).toBe(ac.region);
          expect(comarca?.potenciales.monte ?? 0).toBeGreaterThanOrEqual(2);
        }
        if (datos.objetivo === 'comarca') expect(ac.comarca).not.toBeNull();
        // Ningun efecto se sale de la horquilla del catalogo.
        for (const efecto of ac.efectos) {
          const medida = ['pan', 'labor', 'lana', 'precio', 'volumen', 'obra', 'ingresos'].includes(
            efecto.que,
          )
            ? efecto.factorMil
            : efecto.cantidad;
          const { minimo, maximo } = reglas.acontecimientos.limites[efecto.que];
          expect(medida).toBeGreaterThanOrEqual(minimo);
          expect(medida).toBeLessThanOrEqual(maximo);
        }
      }
    }
    // En quinientos anyos sale todo el catalogo.
    expect([...vistos].sort()).toEqual([...TIPOS_DE_ACONTECIMIENTO].sort());
  });

  it('con una sola region siguen saliendo entre dos y cuatro, con un negativo como mucho', () => {
    const soloNorte: Mundo = {
      ...elMundo,
      comarcas: Object.fromEntries(
        Object.entries(elMundo.comarcas).map(([id, comarca]) => [
          id,
          { ...comarca, region: NORTE },
        ]),
      ),
    };
    for (let anyo = 1; anyo <= 100; anyo += 1) {
      const calendario = calendarioDeAcontecimientos('una', anyo, soloNorte, reglas);
      expect(calendario.length).toBeGreaterThanOrEqual(2);
      expect(
        calendario.filter((ac) => CATALOGO[ac.tipo as TipoDeAcontecimiento].signo === 'negativo')
          .length,
      ).toBeLessThanOrEqual(1);
    }
  });

  it('el turno absoluto de la partida sale del anyo y del turno del anyo', () => {
    expect(turnoAbsoluto(1, 5)).toBe(5);
    expect(turnoAbsoluto(3, 1)).toBe(49);
  });
});

// ——— Los modificadores ——————————————————————————————————————————————————————

describe('los modificadores', () => {
  const sequia = evento('sequia', 10);

  it('un acontecimiento esta activo desde su inicio y durante su duracion, ni un turno mas', () => {
    expect(ultimoTurnoDe(sequia)).toBe(15);
    const activos = (turnoActual: number) => acontecimientosActivos([sequia], turnoActual).length;
    expect([9, 10, 15, 16].map(activos)).toEqual([0, 1, 1, 0]);
  });

  it('solo afecta a su region o, si trae comarca, solo a esa comarca', () => {
    expect(afectaA(sequia, { region: NORTE })).toBe(true);
    expect(afectaA(sequia, { region: SUR })).toBe(false);
    const romeria = evento('romeria', 8, { comarca: c('prueba-llano') });
    expect(afectaA(romeria, { region: NORTE, comarca: c('prueba-llano') })).toBe(true);
    expect(afectaA(romeria, { region: NORTE, comarca: c('prueba-monte') })).toBe(false);
  });

  it('multiplica los factores de los que estan activos y afectan al lugar', () => {
    const lluvias = evento('buenas-lluvias', 8);
    const lista = [sequia, lluvias];
    const norte = { region: NORTE };
    // Sequia (700) y lluvias (1250) a la vez: 700 x 1250 / 1000 = 875.
    expect(factorDeAcontecimientos(lista, 10, 'pan', norte)).toBe(875);
    expect(factorDeAcontecimientos(lista, 8, 'pan', norte)).toBe(1250);
    expect(factorDeAcontecimientos(lista, 16, 'pan', norte)).toBe(1000);
    expect(factorDeAcontecimientos(lista, 10, 'pan', { region: SUR })).toBe(1000);
    expect(factorDeAcontecimientos(lista, 10, 'obra', norte)).toBe(1000);
  });

  it('un efecto con terreno o con recurso solo vale para ese terreno o ese recurso', () => {
    const riada = evento('riada', 7);
    expect(factorDeAcontecimientos([riada], 7, 'labor', { region: NORTE, terreno: 'vega' })).toBe(
      800,
    );
    expect(factorDeAcontecimientos([riada], 7, 'labor', { region: NORTE, terreno: 'llano' })).toBe(
      1000,
    );
    expect(factorDeAcontecimientos([riada], 7, 'labor', { region: NORTE })).toBe(1000);
    const peste = evento('peste-de-ganado', 5);
    expect(factorDeAcontecimientos([peste], 5, 'lana', { region: NORTE }, 'lana')).toBe(750);
    expect(factorDeAcontecimientos([peste], 5, 'lana', { region: NORTE }, 'pan')).toBe(1000);
    expect(efectosActivos([riada], 7, 'vados', { region: NORTE })).toHaveLength(1);
  });

  it('el precio base de un recurso sube con una carestia solo en su region y mientras dura', () => {
    const carestia = evento('carestia-de-sal', 14);
    const precio = (turnoActual: number, region: string, recurso: 'sal' | 'pan') =>
      precioBaseEfectivo(14000, [carestia], turnoActual, { region }, recurso);
    expect(precio(14, NORTE, 'sal')).toBe(21000);
    expect(precio(18, NORTE, 'sal')).toBe(21000);
    expect(precio(19, NORTE, 'sal')).toBe(14000);
    expect(precio(14, SUR, 'sal')).toBe(14000);
    expect(precio(14, NORTE, 'pan')).toBe(14000);
  });
});

// ——— La fase 10, turno a turno ———————————————————————————————————————————————

describe('la fase 10', () => {
  /** La partida en el turno 1 del anyo 1 sobre el mundo con regiones. */
  function partida(turnoInicial = 1): EstadoPartida {
    return escenario({ turno: turnoInicial });
  }

  function correr(estado: EstadoPartida, turnos: number) {
    const porTurno: { turno: number; estado: EstadoPartida; sucesos: Suceso[] }[] = [];
    let actual = estado;
    for (let i = 0; i < turnos; i += 1) {
      const resultado = turno(actual, [], reglas, elMundo);
      porTurno.push({
        turno: actual.turno,
        estado: resultado.estado,
        sucesos: [...resultado.sucesos],
      });
      actual = resultado.estado;
    }
    return porTurno;
  }

  const semilla = (estado: EstadoPartida): string => estado.semilla;

  it('el primer turno del anyo publica el calendario entero', () => {
    const estado = partida();
    const plan = calendarioDeAcontecimientos(semilla(estado), 1, elMundo, reglas);
    const { sucesos } = turno(estado, [], reglas, elMundo);
    const publicados = tipos(sucesos, 'acontecimiento.calendario');
    expect(publicados.map((s) => s.datos['acontecimiento'])).toEqual(plan.map((ac) => ac.id));
    for (const suceso of publicados) {
      const ac = plan.find((p) => p.id === suceso.datos['acontecimiento']);
      expect(suceso.datos).toMatchObject({
        tipo: ac?.tipo,
        region: ac?.region,
        turnoInicio: ac?.turnoInicio,
        turnosDuracion: ac?.turnosDuracion,
      });
      expect(suceso.comarca).toBe(ac?.comarca);
    }
  });

  it('no publica el calendario en los demas turnos del anyo', () => {
    const [, segundo] = correr(partida(), 2);
    expect(tipos(segundo?.sucesos ?? [], 'acontecimiento.calendario')).toEqual([]);
  });

  it('cada acontecimiento se anuncia exactamente dos turnos antes, empieza y termina en su turno', () => {
    const estado = partida();
    const plan = calendarioDeAcontecimientos(semilla(estado), 1, elMundo, reglas);
    const turnos = correr(estado, 24);
    for (const ac of plan) {
      const cuando = (que: string): number[] =>
        turnos
          .filter((t) =>
            tipos(t.sucesos, `acontecimiento.${que}`).some(
              (s) => s.datos['acontecimiento'] === ac.id,
            ),
          )
          .map((t) => t.turno);
      expect(cuando('anuncia')).toEqual([ac.turnoInicio - 2]);
      expect(cuando('empieza')).toEqual([ac.turnoInicio]);
      expect(cuando('termina')).toEqual([ultimoTurnoDe(ac)]);
      // Esta en el estado desde el anuncio hasta el ultimo turno, ambos incluidos.
      for (const t of turnos) {
        const dentro = t.estado.acontecimientos.some((e) => e.id === ac.id);
        expect(dentro).toBe(t.turno >= ac.turnoAnuncio && t.turno < ultimoTurnoDe(ac));
      }
    }
    // Al acabar el anyo no queda ninguno.
    expect(turnos.at(-1)?.estado.acontecimientos).toEqual([]);
  });

  it('en el estado entra la copia del catalogo, con su comarca si la tiene', () => {
    const estado = partida();
    const plan = calendarioDeAcontecimientos(semilla(estado), 1, elMundo, reglas);
    const primero = plan[0];
    if (primero === undefined) throw new Error('el plan esta vacio');
    const turnos = correr(estado, primero.turnoInicio);
    const anunciado = turnos[primero.turnoAnuncio - 1]?.estado.acontecimientos.find(
      (e) => e.id === primero.id,
    );
    expect(anunciado).toEqual(primero);
  });

  it('en una partida que empieza a mitad de anyo solo ocurre lo que llega a anunciarse', () => {
    const inicio = 8;
    const estado = partida(inicio);
    const plan = calendarioDeAcontecimientos(semilla(estado), 1, elMundo, reglas);
    const posibles = plan.filter((ac) => ac.turnoAnuncio >= inicio);
    const perdidos = plan.filter((ac) => ac.turnoAnuncio < inicio);
    const turnos = correr(estado, 24 - inicio + 1);
    const anunciados = turnos.flatMap((t) => tipos(t.sucesos, 'acontecimiento.anuncia'));
    expect(anunciados.map((s) => s.datos['acontecimiento']).sort()).toEqual(
      posibles.map((ac) => ac.id).sort(),
    );
    for (const ac of perdidos) {
      for (const t of turnos) {
        expect(t.estado.acontecimientos.some((e) => e.id === ac.id)).toBe(false);
        expect(
          tipos(t.sucesos, 'acontecimiento.empieza').some(
            (s) => s.datos['acontecimiento'] === ac.id,
          ),
        ).toBe(false);
      }
    }
    // El primer turno publica solo lo que aun se puede anunciar.
    const publicados = tipos(turnos[0]?.sucesos ?? [], 'acontecimiento.calendario');
    expect(publicados.map((s) => s.datos['acontecimiento']).sort()).toEqual(
      posibles.map((ac) => ac.id).sort(),
    );
  });

  it('el anyo siguiente tiene su propio calendario y se publica su primer turno', () => {
    const estado = partida(25);
    const plan = calendarioDeAcontecimientos(semilla(estado), 2, elMundo, reglas);
    const { sucesos } = turno(estado, [], reglas, elMundo);
    expect(tipos(sucesos, 'acontecimiento.calendario')).toHaveLength(plan.length);
    for (const ac of plan) expect(ac.turnoInicio).toBeGreaterThan(24);
  });

  it('es reproducible: la misma partida da la misma huella turno a turno', () => {
    const a = correr(partida(), 24).map((t) => t.estado.huellaTurnoAnterior);
    const b = correr(partida(), 24).map((t) => t.estado.huellaTurnoAnterior);
    expect(b).toEqual(a);
  });

  it('un mundo sin regiones del catalogo no deja ningun suceso ni cambia el estado', () => {
    const { estado, sucesos } = turno(partida());
    expect(estado.acontecimientos).toEqual([]);
    expect(tipos(sucesos, 'acontecimiento.')).toEqual([]);
  });

  it('los efectos unicos se aplican al empezar: la romeria sube la lealtad y el incendio el agotamiento', () => {
    const base = conComarca(partida(PRIMAVERA), 'prueba-llano', { lealtad: 60 });
    const romeria = evento('romeria', PRIMAVERA, { comarca: c('prueba-llano') });
    const incendio = evento('incendio', PRIMAVERA, {
      comarca: c('prueba-monte'),
      id: 'ac-prueba-incendio' as IdAcontecimiento,
    });
    const con = turno(conEventos(base, romeria, incendio), [], reglas, elMundo);
    const sin = turno(base, [], reglas, elMundo);
    const lealtad = con.sucesos.filter(
      (s) =>
        s.tipo === 'lealtad.cambio' &&
        s.comarca === 'prueba-llano' &&
        s.datos['motivo'] === 'romeria',
    );
    expect(lealtad).toHaveLength(1);
    expect(lealtad[0]?.datos).toMatchObject({ delta: 10 });
    // El incendio sube el monte en veinte puntos respecto de la misma partida sin el.
    expect(
      comarcaDe(con.estado, 'prueba-monte').agotamiento.monte -
        comarcaDe(sin.estado, 'prueba-monte').agotamiento.monte,
    ).toBe(20);
    // Y acabada su duracion, ambos han salido del estado.
    expect(con.estado.acontecimientos.some((e) => e.tipo === 'incendio')).toBe(false);
  });

  it('en dehesa el incendio agota la mitad y el agotamiento nunca pasa del maximo', () => {
    const inicio = (dehesa: boolean, monte: number) => {
      let estado = partida(PRIMAVERA);
      estado = conComarca(estado, 'prueba-monte', {
        dehesa,
        agotamiento: { monte, piedra: 0, hierro: 0, sal: 0 },
      });
      const contexto = crearContexto(
        conEventos(estado, evento('incendio', PRIMAVERA, { comarca: c('prueba-monte') })),
        [],
        elMundo,
        reglas,
      );
      contexto.fase = 'acontecimientos';
      return contexto;
    };
    const normal = inicio(false, 0);
    faseAcontecimientos(normal);
    expect(comarcaDe(normal.estado, 'prueba-monte').agotamiento.monte).toBe(20);
    const enDehesa = inicio(true, 0);
    faseAcontecimientos(enDehesa);
    expect(comarcaDe(enDehesa.estado, 'prueba-monte').agotamiento.monte).toBe(10);
    const quemado = inicio(false, 95);
    faseAcontecimientos(quemado);
    expect(comarcaDe(quemado.estado, 'prueba-monte').agotamiento.monte).toBe(
      reglas.produccion.agotamiento.maximo,
    );
  });

  it('la romeria en una comarca neutral no suma lealtad a nadie', () => {
    const estado = conEventos(
      partida(PRIMAVERA),
      evento('romeria', PRIMAVERA, { comarca: c('prueba-vega'), region: SUR }),
    );
    const { sucesos } = turno(estado, [], reglas, elMundo);
    expect(
      sucesos.some((s) => s.tipo === 'lealtad.cambio' && s.datos['motivo'] === 'romeria'),
    ).toBe(false);
  });
});

// ——— Lo que hace cada fase que los consulta ————————————————————————————————————

describe('producción', () => {
  /** Pan producido por el llano (region norte) este turno y el factor de acontecimiento que se vio. */
  function panDelLlano(estado: EstadoPartida, elMundoDeLaPrueba: Mundo = elMundo) {
    const { estado: despues, sucesos } = turno(estado, [], reglas, elMundoDeLaPrueba);
    const explotacion = sucesos.find(
      (s) =>
        s.tipo === 'produccion.explotacion' &&
        s.comarca === 'prueba-llano' &&
        s.datos['recurso'] === 'pan',
    );
    return {
      pan: comarcaDe(despues, 'prueba-llano').produccionUltimoTurno.pan,
      factor: explotacion?.datos['acontecimientoMil'],
    };
  }

  const sin = panDelLlano(escenario({ turno: 12 }));

  it('una sequia baja el pan de la region y una buena lluvia lo sube, dentro de su ventana', () => {
    expect(sin.factor).toBeUndefined();
    const seca = panDelLlano(conEventos(escenario({ turno: 12 }), evento('sequia', 12)));
    expect(seca.factor).toBe(700);
    expect(seca.pan).toBeLessThan(sin.pan);
    const lluvia = panDelLlano(conEventos(escenario({ turno: 12 }), evento('buenas-lluvias', 12)));
    expect(lluvia.factor).toBe(1250);
    expect(lluvia.pan).toBeGreaterThan(sin.pan);
  });

  it('solo en su region y solo mientras dura', () => {
    const otraRegion = panDelLlano(
      conEventos(escenario({ turno: 12 }), evento('sequia', 12, { region: SUR })),
    );
    expect(otraRegion).toEqual(sin);
    const yaPaso = panDelLlano(conEventos(escenario({ turno: 12 }), evento('sequia', 5)));
    expect(yaPaso).toEqual(sin);
    const noHaEmpezado = panDelLlano(conEventos(escenario({ turno: 12 }), evento('sequia', 13)));
    expect(noHaEmpezado).toEqual(sin);
  });

  it('la riada daña la labor de las vegas y no la de un llano', () => {
    const factorEn = (comarca: string) => {
      const estado = conComarca(
        conEventos(escenario({ turno: 7 }), evento('riada', 7, { region: SUR })),
        comarca,
        { duenyo: UNO, edificios: { granja: 1 } },
      );
      const { sucesos } = turno(estado, [], reglas, elMundo);
      return sucesos.find(
        (s) =>
          s.tipo === 'produccion.explotacion' &&
          s.comarca === comarca &&
          s.datos['recurso'] === 'pan',
      )?.datos['acontecimientoMil'];
    };
    // La vega es terreno de vega; el rio, de llano.
    expect(factorEn('prueba-vega')).toBe(800);
    expect(factorEn('prueba-rio')).toBeUndefined();
  });

  it('una sequia no toca la huerta, que es la respuesta', () => {
    let estado = conComarca(escenario({ turno: 12 }), 'prueba-llano', { edificios: { huerta: 1 } });
    estado = conEventos(estado, evento('sequia', 12));
    const { sucesos } = turno(estado, [], reglas, elMundo);
    const huerta = sucesos.find(
      (s) =>
        s.tipo === 'produccion.explotacion' &&
        s.comarca === 'prueba-llano' &&
        s.datos['edificio'] === 'huerta',
    );
    expect(huerta?.datos['acontecimientoMil']).toBeUndefined();
  });

  it('una romeria sube un 10 % los ingresos de su comarca y de ninguna otra', () => {
    const maravedis = (con: Acontecimiento | null) => {
      let estado = conComarca(escenario({ turno: 8 }), 'prueba-llano', {
        edificios: { mercado: 2 },
        poblacion: 100,
      });
      if (con !== null) estado = conEventos(estado, con);
      const { sucesos } = turno(estado, [], reglas, elMundo);
      return Number(
        sucesos.find((s) => s.tipo === 'produccion.maravedis' && s.comarca === 'prueba-llano')
          ?.datos['total'],
      );
    };
    const normal = maravedis(null);
    const fiesta = maravedis(evento('romeria', 8, { comarca: c('prueba-llano') }));
    expect(fiesta).toBeGreaterThan(normal);
    expect(fiesta).toBeLessThanOrEqual(Math.ceil(normal * 1.1) + 1);
    expect(maravedis(evento('romeria', 8, { comarca: c('prueba-monte') }))).toBe(normal);
  });
});

describe('obras', () => {
  function avance(con: Acontecimiento | null) {
    let estado = escenario({ turno: 12 });
    const obra = {
      id: 'obra-1',
      jugador: UNO,
      comarca: c('prueba-llano'),
      tipo: 'obra mayor',
      que: 'muralla',
      hacia: null,
      avanceMil: 0,
      avanceNecesarioMil: 18000,
      entregado: recursos(),
      costeTotal: recursos(),
      abandonada: false,
    } as const;
    estado = { ...estado, obras: { 'obra-1': obra } as unknown as EstadoPartida['obras'] };
    if (con !== null) estado = conEventos(estado, con);
    return turno(estado, [], reglas, elMundo).estado.obras['obra-1']?.avanceMil ?? 0;
  }

  it('la llegada de maestros dobla el avance de las obras mayores de la region, solo mientras dura', () => {
    const normal = avance(null);
    expect(normal).toBeGreaterThan(0);
    expect(avance(evento('maestros', 12))).toBe(normal * 2);
    expect(avance(evento('maestros', 12, { region: SUR }))).toBe(normal);
    expect(avance(evento('maestros', 5, { turnosDuracion: 4 }))).toBe(normal);
  });
});

/**
 * El precio base de un recurso en una comarca, escrito otra vez a mano (T-052 §4.1). Aqui importa
 * porque la carestia se monta **encima** del base local, no encima del catalogo.
 */
function baseEn(comarca: string, recurso: Recurso): number {
  const base = reglas.recursos[recurso].precioBaseMil;
  const potencial = reglas.mercado.potencialDeRecurso[recurso];
  if (potencial === undefined) return base;
  // La regla de T-054, escrita otra vez a mano: el mejor potencial del mapa menos un escalon por
  // cada tres jornadas de verano que haya que andar hasta el.
  const jornadas = jornadasDesde(comarca, mundo, (camino) =>
    jornadasAdministrativasMil(camino, reglas, {}),
  );
  const nivel = nivelAlcanzadoMil(potencial, jornadas, mundo.comarcas, reglas.mercado);
  return Math.max(1, Math.floor((base * (reglas.mercado.abundanciaMil[nivel] ?? 1000)) / 1000));
}

describe('mercado', () => {
  const FERIA_RIO = idDeMercadoDeFeria('rio' as IdFeria);
  const LOCAL = 'local-prueba-llano' as IdMercado;

  it('una carestia de sal sube el precio base de la plaza y el precio la sigue, sin pasar del 15 % por turno', () => {
    let estado = conComarca(escenario({ turno: 14 }), 'prueba-llano', {
      edificios: { mercado: 1 },
    });
    estado = conEventos(estado, evento('carestia-de-sal', 14));
    const precios: number[] = [];
    for (let i = 0; i < 4; i += 1) {
      estado = turno(estado, [], reglas, elMundo).estado;
      precios.push(estado.mercados[LOCAL]?.preciosMil.sal ?? 0);
    }
    // Sube hacia el base local por 1500 (prueba-llano no tiene sal, asi que su base es el del
    // catalogo por 1,4: T-052), sin pasar del 15 % por turno; al llegar lo sobrepasa un poco y
    // la regresion lo devuelve, como cualquier otro precio.
    const baseDeLaSal = baseEn('prueba-llano', 'sal');
    const conCarestia = Math.floor((baseDeLaSal * 1500) / 1000);
    expect(precios[0]).toBeGreaterThan(baseDeLaSal);
    expect(precios[1]).toBeGreaterThan(precios[0] ?? 0);
    expect(precios[2]).toBeGreaterThan(precios[1] ?? 0);
    for (let i = 0; i < precios.length; i += 1) {
      const anterior = i === 0 ? baseDeLaSal : (precios[i - 1] ?? 0);
      expect(precios[i]).toBeLessThanOrEqual(Math.floor((anterior * 1150) / 1000));
    }
    expect(precios.at(-1)).toBeGreaterThan(Math.floor(conCarestia * 0.9));
    expect(precios.at(-1)).toBeLessThanOrEqual(conCarestia * 1.05);
    // Acabada la carestia, el precio regresa al base normal (en un mundo sin calendario propio, para
    // que otros acontecimientos de anyos posteriores no lo vuelvan a mover).
    let despues: EstadoPartida = { ...estado, acontecimientos: [] };
    for (let i = 0; i < 150; i += 1) despues = turno(despues, [], reglas, mundo).estado;
    expect(despues.mercados[LOCAL]?.preciosMil.sal).toBe(baseDeLaSal);
  });

  it('la carestia no toca otros recursos ni otras regiones', () => {
    let estado = conComarca(escenario({ turno: 14 }), 'prueba-llano', {
      edificios: { mercado: 1 },
    });
    estado = conEventos(estado, evento('carestia-de-sal', 14, { region: SUR }));
    for (let i = 0; i < 5; i += 1) estado = turno(estado, [], reglas, elMundo).estado;
    expect(estado.mercados[LOCAL]?.preciosMil.sal).toBe(baseEn('prueba-llano', 'sal'));
    let norte = conComarca(escenario({ turno: 14 }), 'prueba-llano', { edificios: { mercado: 1 } });
    norte = conEventos(norte, evento('carestia-de-sal', 14));
    for (let i = 0; i < 5; i += 1) norte = turno(norte, [], reglas, elMundo).estado;
    expect(norte.mercados[LOCAL]?.preciosMil.pan).toBe(baseEn('prueba-llano', 'pan'));
  });

  it('el buen anyo de feria sube el tope de volumen de esa feria un 20 %', () => {
    const vendido = (con: Acontecimiento | null) => {
      let estado = escenario({
        turno: 12,
        recuas: [
          recua('recua-1', {
            situacion: { donde: 'comarca', comarca: c('prueba-llano') },
            carga: recursos({ lana: 200, pan: 20 }),
            porte: 400,
          }),
        ],
      });
      if (con !== null) estado = conEventos(estado, con);
      const ruta = ordenRuta(estado.turno, 'recua-1', [
        parada('prueba-rio', { vender: { lana: { cantidad: 200, precioMinimoMil: 1000 } } }),
      ]);
      // Una feria mediana tiene un tope de 120 cargas por turno; con el buen anyo, 144.
      const { estado: despues } = turno(estado, [ruta], reglas, elMundo);
      return despues.mercados[FERIA_RIO]?.ultimoVolumen.lana;
    };
    expect(vendido(null)).toBe(120);
    expect(
      vendido(evento('buen-ano-de-feria', 12, { comarca: c('prueba-rio'), region: SUR })),
    ).toBe(144);
    // Otra comarca con feria no se beneficia.
    expect(
      vendido(evento('buen-ano-de-feria', 12, { comarca: c('prueba-vega'), region: SUR })),
    ).toBe(120);
  });
});

describe('caminos', () => {
  const PUERTO = claveDeTramo('prueba-mina', 'prueba-sierra');

  it('unas nieves tempranas cierran dos turnos antes los puertos de su region', () => {
    const nieves = evento('nieves-tempranas', 19);
    const cerrados = (turnoActual: number, eventos: Acontecimiento[] = [nieves]) => [
      ...estadoEstacionalDe(turnoActual, elMundo, reglas, eventos).tramosConNieveTemprana,
    ];
    expect(cerrados(19)).toEqual([]);
    expect(cerrados(20)).toEqual([]);
    expect(cerrados(21)).toEqual([PUERTO]);
    expect(cerrados(22)).toEqual([PUERTO]);
    // Acabadas las nieves, cierra solo el invierno de siempre.
    expect(cerrados(23)).toEqual([]);
    expect(estadoEstacionalDe(23, elMundo, reglas, [nieves]).puertosCerrados).toEqual([
      'Puerto de Prueba',
    ]);
    // Otra region, nada.
    expect(cerrados(21, [evento('nieves-tempranas', 19, { region: SUR })])).toEqual([]);
    // El puerto aparece entre los cerrados al adelantar el cierre.
    expect(estadoEstacionalDe(21, elMundo, reglas, [nieves]).puertosCerrados).toEqual([
      'Puerto de Prueba',
    ]);
    expect(estadoEstacionalDe(21, elMundo, reglas).puertosCerrados).toEqual([]);
  });

  it('un puerto cerrado antes de tiempo cierra el tramo al movimiento, salvo con calzada', () => {
    const camino = elMundo.caminos.find((t) => claveDeTramo(t.desde, t.hasta) === PUERTO);
    if (camino === undefined) throw new Error('falta el tramo del puerto');
    const nieves = [evento('nieves-tempranas', 19)];
    const cerrado = estadoEstacionalDe(21, elMundo, reglas, nieves);
    expect(costeDeTramoMil(camino, cerrado, reglas, {})).toBe('cerrado');
    expect(costeDeTramoMil(camino, estadoEstacionalDe(21, elMundo, reglas), reglas, {})).not.toBe(
      'cerrado',
    );
    expect(
      costeDeTramoMil(camino, cerrado, reglas, { [PUERTO]: { calidad: 'calzada', puente: false } }),
    ).not.toBe('cerrado');
  });

  it('el aviso de puertos de la fase 1 cuenta el cierre adelantado', () => {
    let estado = conEventos(escenario({ turno: 20 }), evento('nieves-tempranas', 19));
    estado = turno(estado, [], reglas, elMundo).estado;
    const { sucesos } = turno(estado, [], reglas, elMundo);
    const cierres = sucesos.filter((s) => s.tipo === 'calendario.puerto-cerrado');
    expect(cierres.map((s) => s.datos['puerto'])).toEqual(['Puerto de Prueba']);
  });

  it('una riada corta los vados de su region salvo que lleven puente', () => {
    const conVado: Mundo = {
      ...elMundo,
      caminos: elMundo.caminos.map((t) =>
        claveDeTramo(t.desde, t.hasta) === claveDeTramo('prueba-llano', 'prueba-monte')
          ? { ...t, vado: true }
          : t,
      ),
    };
    const vado = conVado.caminos.find((t) => t.vado);
    if (vado === undefined) throw new Error('falta el vado');
    const clave = claveDeTramo(vado.desde, vado.hasta);
    const riada = [evento('riada', 7)];
    const durante = estadoEstacionalDe(7, conVado, reglas, riada);
    expect([...durante.tramosEnCrecida]).toEqual([clave]);
    expect(costeDeTramoMil(vado, durante, reglas, {})).toBe('cerrado');
    expect(
      costeDeTramoMil(vado, durante, reglas, { [clave]: { calidad: 'vereda', puente: true } }),
    ).not.toBe('cerrado');
    // Antes, despues y en otra region, transitable.
    expect(estadoEstacionalDe(6, conVado, reglas, riada).tramosEnCrecida.size).toBe(0);
    expect(estadoEstacionalDe(10, conVado, reglas, riada).tramosEnCrecida.size).toBe(0);
    expect(
      estadoEstacionalDe(7, conVado, reglas, [evento('riada', 7, { region: SUR })]).tramosEnCrecida
        .size,
    ).toBe(0);
  });
});

// ——— Tablas, estado y cambios ————————————————————————————————————————————————

describe('validación y cambios', () => {
  function entrada(
    acontecimientos: Record<string, unknown>,
    tipo: string,
  ): Record<string, unknown> {
    const catalogo = acontecimientos['catalogo'] as Record<string, Record<string, unknown>>;
    const encontrada = catalogo[tipo];
    if (encontrada === undefined) throw new Error(`falta ${tipo} en el catalogo`);
    return encontrada;
  }
  function tablasCon(cambios: (acontecimientos: Record<string, unknown>) => void) {
    const tablas = structuredClone(tablasDeEjemplo());
    cambios(tablas['acontecimientos'] as Record<string, unknown>);
    return validarTablas(tablas);
  }
  const mensajes = (resultado: ReturnType<typeof validarTablas>): string =>
    resultado.ok ? '' : resultado.errores.map((e) => `${e.ruta}: ${e.mensaje}`).join('\n');
  const con = (tipo: string, campo: string, valor: unknown) =>
    tablasCon((a) => {
      entrada(a, tipo)[campo] = valor;
    });

  it('el catalogo real valida', () => {
    expect(validarTablas(tablasDeEjemplo()).ok).toBe(true);
  });

  it('rechaza un efecto fuera de la horquilla, uno que usa la medida equivocada y uno sin efectos', () => {
    const unPan = (factorMil: number, cantidad: number) => [
      { que: 'pan', recurso: null, terreno: null, factorMil, cantidad },
    ];
    expect(mensajes(con('sequia', 'efectos', unPan(100, 0)))).toMatch(
      /sequia.*pan vale 100 y su horquilla va de 700 a 1300/s,
    );
    expect(mensajes(con('sequia', 'efectos', unPan(700, 5)))).toMatch(
      /otra medida tiene que quedar neutra/,
    );
    expect(con('sequia', 'efectos', []).ok).toBe(false);
  });

  it('rechaza una ventana que no deja aviso, que cruza de anyo o una duracion que no encaja', () => {
    expect(mensajes(con('sequia', 'inicio', { desde: 2, hasta: 5 }))).toMatch(
      /despues del turno 2/,
    );
    expect(mensajes(con('sequia', 'inicio', { desde: 9, hasta: 22 }))).toMatch(
      /ningun acontecimiento cruza de anyo/,
    );
    expect(mensajes(con('sequia', 'duracion', { tipo: 'de-la-feria' }))).toMatch(
      /solo de los acontecimientos de feria/,
    );
    expect(mensajes(con('peste-de-ganado', 'inicio', { desde: 3, hasta: 12 }))).toMatch(
      /pasa del esquileo/,
    );
  });

  it('rechaza un catalogo sin ningun acontecimiento positivo', () => {
    const sinBuenos = tablasCon((a) => {
      for (const tipo of TIPOS_DE_ACONTECIMIENTO) entrada(a, tipo)['signo'] = 'negativo';
    });
    expect(mensajes(sinBuenos)).toMatch(/al menos un acontecimiento positivo/);
  });

  it('el estado acepta acontecimientos anunciados y rechaza una comarca que no existe', () => {
    const estado = estadoDeEjemplo();
    const ac = (comarca: string | null) => ({
      id: 'ac-1-1',
      tipo: 'sequia',
      region: 'prueba',
      comarca,
      turnoAnuncio: 1,
      turnoInicio: 3,
      turnosDuracion: 6,
      efectos: CATALOGO.sequia.efectos,
    });
    expect(
      validarEstado({
        ...estado,
        acontecimientos: [ac(null), { ...ac('prueba-llano'), id: 'ac-1-2' }],
      }).ok,
    ).toBe(true);
    const rechazado = validarEstado({ ...estado, acontecimientos: [ac('nada')] });
    expect(rechazado.ok).toBe(false);
    if (!rechazado.ok) expect(rechazado.errores[0]?.ruta).toBe('acontecimientos.0.comarca');
  });

  function contexto() {
    return crearContexto(escenario({ turno: 5 }), [], elMundo, reglas);
  }

  it('un acontecimiento se anuncia con su aviso exacto, sin repetir id, y solo se da de baja el que esta', () => {
    const ctx = contexto();
    const bueno = evento('sequia', 7);
    aplicar(ctx, { tipo: 'acontecimiento-alta', acontecimiento: bueno });
    expect(ctx.estado.acontecimientos).toHaveLength(1);
    expect(() => {
      aplicar(ctx, { tipo: 'acontecimiento-alta', acontecimiento: bueno });
    }).toThrow(/Ya hay un acontecimiento/);
    expect(() => {
      aplicar(ctx, {
        tipo: 'acontecimiento-alta',
        acontecimiento: evento('riada', 9, { id: 'ac-otro' as IdAcontecimiento, turnoAnuncio: 5 }),
      });
    }).toThrow(/4 turnos antes de empezar y tienen que ser 2/);
    aplicar(ctx, { tipo: 'acontecimiento-baja', acontecimiento: bueno.id });
    expect(ctx.estado.acontecimientos).toHaveLength(0);
    expect(() => {
      aplicar(ctx, { tipo: 'acontecimiento-baja', acontecimiento: bueno.id });
    }).toThrow(/ningun acontecimiento/);
  });

  it('una plaza no puede quedarse por encima del techo del precio base efectivo', () => {
    const ctx = crearContexto(
      conComarca(
        conEventos(escenario({ turno: 14 }), evento('carestia-de-sal', 14)),
        'prueba-llano',
        { edificios: { mercado: 1 } },
      ),
      [],
      elMundo,
      reglas,
    );
    aplicar(ctx, {
      tipo: 'mercado-alta',
      mercado: {
        id: 'local-prueba-llano' as IdMercado,
        comarca: c('prueba-llano'),
        tipo: 'local',
        volumen: 'pequenya',
        preciosMil: recursos({ sal: baseEn('prueba-llano', 'sal') }),
        ultimoVolumen: recursos(),
      },
    });
    // El techo es el 250 % del base local con la carestia encima. Prueba-llano no tiene sal, pero
    // **alcanza** la de la costa a dos jornadas (T-054), asi que su base es 12600 y el techo
    // 12600 x 1,5 x 2,5 = 47250. Sin la carestia seria 31500, y con el base del catalogo, 35000.
    const techo = Math.floor(
      (Math.floor((baseEn('prueba-llano', 'sal') * 1500) / 1000) * 2500) / 1000,
    );
    expect(techo).toBe(47250);
    expect(() => {
      aplicar(ctx, {
        tipo: 'mercado-precio',
        mercado: 'local-prueba-llano' as IdMercado,
        recurso: 'sal',
        precioMil: techo,
        volumen: 0,
      });
    }).not.toThrow();
    expect(() => {
      aplicar(ctx, {
        tipo: 'mercado-precio',
        mercado: 'local-prueba-llano' as IdMercado,
        recurso: 'sal',
        precioMil: techo + 1,
        volumen: 0,
      });
    }).toThrow();
  });
});
