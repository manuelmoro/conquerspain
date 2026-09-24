// Las ocho casas de oficio (T-041): la tabla, cada privilegio con su límite, lo desactivado y la
// regla de que el motor no nombre a ninguna.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { aplicar } from '../src/cambios.ts';
import { crearContexto } from '../src/contexto.ts';
import { CASAS_DE_OFICIO, MODIFICADORES_NEUTROS } from '../src/datos/casas.ts';
import { modificadoresDe, permisosDe, prohibicionesDe } from '../src/reglas/casas/index.ts';
import {
  costeDeAperos,
  costeDeEdificio,
  costeDeObraMayor,
  costeDeRebanyo,
  costeDeRecua,
} from '../src/reglas/casas/costes.ts';
import { insumosDe } from '../src/reglas/insumos.ts';
import { impedimentoDeConstruir, solaresDe } from '../src/reglas/obras.ts';
import { capacidadDe, impedimentoDePuebla } from '../src/reglas/poblar.ts';
import { pasoDeRecua } from '../src/reglas/movimiento.ts';
import { puedeEntrar } from '../src/reglas/rebanyos.ts';
import type { Suceso } from '../src/tipos/cronica.ts';
import type { EstadoComarca, EstadoPartida } from '../src/tipos/estado.ts';
import type { Camino } from '../src/tipos/mundo.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import type { Casa, TablasDeReglas } from '../src/tipos/reglas.ts';
import { CASAS } from '../src/tipos/reglas.ts';
import { validarEstado } from '../src/validacion/validarEstado.ts';
import { validarTablas } from '../src/validacion/validarTablas.ts';
import { tablasDeEjemplo } from './ejemplos.ts';
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

/** Las tablas de las pruebas con las casas de verdad. */
const REAL: TablasDeReglas = { ...reglas, casas: CASAS_DE_OFICIO };

function conCasa(estado: EstadoPartida, casa: Casa, jugador = UNO): EstadoPartida {
  const actual = estado.jugadores[jugador];
  if (actual === undefined) throw new Error(`falta el jugador ${jugador}`);
  return { ...estado, jugadores: { ...estado.jugadores, [jugador]: { ...actual, casa } } };
}

function suceso(sucesos: readonly Suceso[], tipo: string): Suceso[] {
  return sucesos.filter((s) => s.tipo === tipo);
}

function cancelaciones(sucesos: readonly Suceso[]): string[] {
  return suceso(sucesos, 'orden.estado')
    .filter((s) => s.datos['estado'] === 'cancelada')
    .map((s) => String(s.datos['motivo']));
}

const modificadores = (casa: Casa) => CASAS_DE_OFICIO[casa].modificadores;

// ——— La tabla ————————————————————————————————————————————————————————————

describe('la tabla de casas', () => {
  it('las ocho casas validan con las tablas del juego', () => {
    const tablas = { ...tablasDeEjemplo(), casas: structuredClone(CASAS_DE_OFICIO) };
    const resultado = validarTablas(tablas);
    expect(resultado.ok, resultado.ok ? '' : JSON.stringify(resultado.errores)).toBe(true);
    expect(Object.keys(CASAS_DE_OFICIO).sort()).toEqual([...CASAS].sort());
  });

  it('cada casa tiene nombre, privilegio, herramienta y límite propios', () => {
    const nombres = CASAS.map((casa) => CASAS_DE_OFICIO[casa].nombre);
    const textos = CASAS.flatMap((casa) => {
      const datos = CASAS_DE_OFICIO[casa];
      return [datos.privilegio, datos.herramienta, datos.limite];
    });
    expect(new Set(nombres).size).toBe(nombres.length);
    expect(new Set(textos).size).toBe(textos.length);
    for (const texto of textos) expect(texto.length).toBeGreaterThan(20);
  });

  it('ninguna casa es «lo mismo con un +10 %»: cada una cambia algo distinto', () => {
    const huellas = CASAS.map((casa) => {
      const m = modificadores(casa);
      const cambios = Object.entries(m).filter(
        ([clave, valor]) =>
          JSON.stringify(valor) !== JSON.stringify(MODIFICADORES_NEUTROS[clave as keyof typeof m]),
      );
      return cambios
        .map(([clave]) => clave)
        .sort()
        .join(',');
    });
    expect(new Set(huellas).size).toBe(CASAS.length);
    for (const huella of huellas) expect(huella.length).toBeGreaterThan(0);
  });

  it('los modificadores, permisos y prohibiciones de un jugador salen de su casa', () => {
    const estado = conCasa(escenario(), 'canteros');
    expect(modificadoresDe(estado, UNO, REAL).solaresExtra).toBe(-1);
    expect(permisosDe(estado, UNO, REAL).obraEnComarcaAjena).toBe(true);
    expect(prohibicionesDe(estado, UNO, REAL).roturar).toBe(false);
    // Sin jugador, todo neutro.
    expect(modificadoresDe(estado, null, REAL)).toBe(MODIFICADORES_NEUTROS);
    expect(prohibicionesDe(estado, 'nadie' as typeof UNO, REAL).catedral).toBe(false);
  });
});

// ——— Mesta ——————————————————————————————————————————————————————————————

describe('la Mesta', () => {
  const camino = (canyada: string | null): Camino => ({
    ...(mundo.caminos[0] as Camino),
    canyada,
  });
  const ajena = (estado: EstadoPartida): EstadoComarca => ({
    ...comarcaDe(estado, 'prueba-llano'),
    duenyo: DOS,
  });

  it('paso franco: solo ella cruza tierra ajena por cañada', () => {
    const estado = escenario({ conDos: true });
    for (const casa of CASAS) {
      const entra = puedeEntrar(
        camino('Cañada Real'),
        ajena(estado),
        { ...(estado.jugadores[UNO] as object), casa } as never,
        REAL,
      );
      expect(entra, casa).toBe(casa === 'mesta');
    }
  });

  it('rebaño merino: a mitad de precio y con un 25 % más de lana', () => {
    expect(costeDeRebanyo(modificadores('mesta'), REAL).maravedis).toBe(30);
    expect(costeDeRebanyo(modificadores('ferrones'), REAL).maravedis).toBe(60);
    expect(modificadores('mesta').lanaEsquileoMil).toBe(1250);
  });

  it('su límite duele: no puede roturar y su pan propio es un 30 % menor', () => {
    const orden: Orden = { ...base(7), tipo: 'roturar', comarca: c('prueba-llano') };
    const estado = conComarca(escenario(), 'prueba-llano', {
      potenciales: { ...comarcaDe(escenario(), 'prueba-llano').potenciales, monte: 3 },
    });
    const mesta = turno(conCasa(estado, 'mesta'), [orden], REAL);
    expect(cancelaciones(mesta.sucesos)).toContain('prohibido-por-la-casa');
    // Otra casa sí puede empezar a roturar: la misma orden no se cancela por prohibición.
    const otra = turno(
      conCasa(estado, 'hortelanos'),
      [{ ...orden, id: 'orden-otra' } as Orden],
      REAL,
    );
    expect(cancelaciones(otra.sucesos)).not.toContain('prohibido-por-la-casa');

    const pan = (casa: Casa) => {
      const { estado: despues } = turno(conCasa(escenario({ turno: 12 }), casa), [], REAL);
      return comarcaDe(despues, 'prueba-llano').produccionUltimoTurno.pan;
    };
    expect(pan('mesta')).toBeLessThan(pan('canteros') * 0.75);
  });
});

// ——— Ferrones ————————————————————————————————————————————————————————————

describe('los ferrones', () => {
  it('ferrería con hierro 1: los demás necesitan 2', () => {
    const comarca = {
      ...comarcaDe(escenario(), 'prueba-llano'),
      potenciales: { ...comarcaDe(escenario(), 'prueba-llano').potenciales, hierro: 1 as const },
      edificios: { carbonera: 1 },
    };
    const puede = (casa: Casa) =>
      impedimentoDeConstruir(
        comarca,
        'ferreria',
        [],
        6,
        modificadores(casa),
        REAL,
        CASAS_DE_OFICIO[casa].permisos,
      );
    expect(puede('ferrones')).toBeNull();
    expect(puede('mesta')).toBe('potencial-insuficiente');
    expect(puede('canteros')).toBe('potencial-insuficiente');
  });

  it('una carbonera sostiene dos niveles de ferrería (a los demás, uno)', () => {
    const comarca = {
      ...comarcaDe(escenario(), 'prueba-llano'),
      edificios: { carbonera: 1, ferreria: 3 },
    };
    const niveles = (casa: Casa) =>
      insumosDe(comarca, { madera: 100 }, REAL, modificadores(casa).edificiosPorRequisito)
        .nivelesActivos['ferreria'];
    expect(niveles('ferrones')).toBe(2);
    expect(niveles('mesta')).toBe(1);
  });

  it('aperos de cuarta: el nivel 4 solo es suyo, y cuestan ocho de hierro', () => {
    const aperos = (casa: Casa) => {
      let estado = conCasa(escenario({ almacen: { hierro: 100 } }), casa);
      for (let i = 0; i < 4; i += 1) {
        const orden: Orden = {
          ...base(estado.turno, { hierro: 8 }),
          tipo: 'aperos',
          comarca: c('prueba-llano'),
        };
        estado = turno(estado, [orden], REAL).estado;
      }
      return comarcaDe(estado, 'prueba-llano').aperos;
    };
    expect(aperos('ferrones')).toBe(4);
    expect(aperos('mesta')).toBe(3);
    expect(costeDeAperos(REAL).hierro).toBe(8);
  });

  it('el aperos de otra comarca, o que ya está al máximo, se cancela', () => {
    const estado = conComarca(escenario({ almacen: { hierro: 100 } }), 'prueba-llano', {
      aperos: 3,
    });
    const orden: Orden = {
      ...base(estado.turno, { hierro: 8 }),
      tipo: 'aperos',
      comarca: c('prueba-llano'),
    };
    const { estado: despues, sucesos } = turno(conCasa(estado, 'mesta'), [orden], REAL);
    expect(cancelaciones(sucesos)).toContain('nivel-maximo');
    expect(comarcaDe(despues, 'prueba-llano').aperos).toBe(3);
    const ajena: Orden = {
      ...base(estado.turno, { hierro: 8 }),
      tipo: 'aperos',
      comarca: c('prueba-monte'),
    };
    expect(cancelaciones(turno(estado, [ajena], REAL).sucesos)).toContain('comarca-ajena');
  });

  it('su límite duele: el monte se le agota un 50 % más deprisa', () => {
    const agotamiento = (casa: Casa) => {
      let estado = conComarca(
        conCasa(escenario({ turno: 12, almacen: { pan: 5000 } }), casa),
        'prueba-llano',
        {
          edificios: { aserradero: 4 },
          potenciales: { ...comarcaDe(escenario(), 'prueba-llano').potenciales, monte: 4 },
        },
      );
      for (let i = 0; i < 6; i += 1) estado = turno(estado, [], REAL).estado;
      return comarcaDe(estado, 'prueba-llano').agotamiento.monte;
    };
    const normal = agotamiento('mesta');
    const ferron = agotamiento('ferrones');
    expect(normal).toBeGreaterThan(0);
    expect(ferron).toBeGreaterThan(normal);
    expect(ferron / normal).toBeGreaterThan(1.3);
  });
});

// ——— Canteros ————————————————————————————————————————————————————————————

describe('los canteros', () => {
  it('las obras mayores cuestan un 25 % menos', () => {
    const muralla = (casa: Casa) => costeDeObraMayor('muralla', modificadores(casa), REAL);
    expect(muralla('canteros').piedra).toBe(Math.floor((muralla('mesta').piedra * 3) / 4));
  });

  it('avanzan un 30 % más rápido y no sufren el frenazo del invierno', () => {
    const avance = (casa: Casa) => {
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
      const estado = {
        ...conCasa(escenario({ turno: 2 }), casa),
        obras: { 'obra-1': obra },
      } as unknown as EstadoPartida;
      return turno(estado, [], REAL).estado.obras['obra-1']?.avanceMil ?? 0;
    };
    // En invierno la piedra va a la mitad para todos... menos para ellos.
    expect(avance('canteros')).toBe(1300);
    expect(avance('mesta')).toBe(500);
  });

  it('su límite duele: un solar menos en cada comarca', () => {
    expect(solaresDe(6, modificadores('canteros'))).toBe(5);
    expect(solaresDe(6, modificadores('mesta'))).toBe(6);
    const comarca = {
      ...comarcaDe(escenario(), 'prueba-llano'),
      edificios: { granja: 1, casas: 1, cerca: 1, granero: 1, aserradero: 1 },
    };
    const puede = (casa: Casa) =>
      impedimentoDeConstruir(
        comarca,
        'cantera',
        [],
        6,
        modificadores(casa),
        REAL,
        CASAS_DE_OFICIO[casa].permisos,
      );
    expect(puede('canteros')).toBe('sin-solar');
    expect(puede('mesta')).toBeNull();
  });
});

// ——— Mercaderes ————————————————————————————————————————————————————————

describe('los mercaderes', () => {
  /** Una recua en el llano, que tiene mercado, y otra en la sierra, que no. */
  function conMercado(casa: Casa): EstadoPartida {
    const estado = escenario({
      almacen: { maravedis: 1000 },
      recuas: [
        recua('recua-1', { situacion: { donde: 'comarca', comarca: c('prueba-llano') } }),
        recua('recua-2', { situacion: { donde: 'comarca', comarca: c('prueba-sierra') } }),
      ],
    });
    return conCasa(
      conComarca(estado, 'prueba-llano', { edificios: { granja: 1, mercado: 1 } }),
      casa,
    );
  }
  const letra = (turnoDeAlta: number, recuaId: string, cantidad: number): Orden => ({
    ...base(turnoDeAlta, { maravedis: cantidad }),
    tipo: 'letra-de-cambio',
    recua: recuaId as never,
    cantidad,
  });

  it('letra de cambio: se paga hoy, llega mañana a la recua y cuesta un 3 %', () => {
    const inicio = conMercado('mercaderes');
    const primero = turno(inicio, [letra(inicio.turno, 'recua-1', 200)], REAL);
    expect(suceso(primero.sucesos, 'letra.emitida')).toHaveLength(1);
    expect(primero.estado.recuas['recua-1']?.carga.maravedis).toBe(0);
    expect(primero.estado.ordenes[0]).toMatchObject({ estado: 'en curso' });
    const pago = primero.sucesos.find(
      (s) =>
        s.tipo === 'almacen.cambio' &&
        s.datos['delta'] === -200 &&
        String(s.datos['motivo']).startsWith('orden'),
    );
    expect(pago).toBeDefined();

    const segundo = turno(primero.estado, [], REAL);
    expect(segundo.estado.recuas['recua-1']?.carga.maravedis).toBe(194);
    expect(suceso(segundo.sucesos, 'letra.cobrada')[0]?.datos).toMatchObject({
      cantidad: 200,
      comision: 6,
    });
    expect(segundo.estado.ordenes).toHaveLength(0);
  });

  it('si la recua ya no está en una plaza cuando llega, la letra se devuelve entera', () => {
    const inicio = conMercado('mercaderes');
    const primero = turno(inicio, [letra(inicio.turno, 'recua-1', 200)], REAL).estado;
    const sierra = {
      ...primero,
      recuas: {
        ...primero.recuas,
        'recua-1': {
          ...(primero.recuas['recua-1'] as object),
          situacion: { donde: 'comarca', comarca: c('prueba-sierra') },
        },
      },
    } as unknown as EstadoPartida;
    const { estado, sucesos } = turno(sierra, [], REAL);
    expect(estado.recuas['recua-1']?.carga.maravedis).toBe(0);
    expect(cancelaciones(sucesos)).toContain('recua-sin-plaza');
    const devuelto = sucesos.find(
      (s) => s.tipo === 'almacen.cambio' && String(s.datos['motivo']).startsWith('devolucion'),
    );
    expect(devuelto?.datos).toMatchObject({ delta: 200 });
  });

  it('una recua fuera de una plaza no la recibe: la orden espera', () => {
    const inicio = conMercado('mercaderes');
    const { estado } = turno(inicio, [letra(inicio.turno, 'recua-2', 100)], REAL);
    expect(estado.ordenes[0]).toMatchObject({
      estado: 'en espera',
      motivoEspera: 'recua-sin-plaza',
    });
  });

  it('solo los mercaderes tienen letra de cambio', () => {
    const inicio = conMercado('mesta');
    const { sucesos } = turno(inicio, [letra(inicio.turno, 'recua-1', 100)], REAL);
    expect(cancelaciones(sucesos)).toContain('prohibido-por-la-casa');
  });

  it('una letra cuyo coste no es lo que cambia se cancela', () => {
    const inicio = conMercado('mercaderes');
    const mala: Orden = {
      ...letra(inicio.turno, 'recua-1', 200),
      coste: recursos({ maravedis: 150 }),
    };
    expect(cancelaciones(turno(inicio, [mala], REAL).sucesos)).toContain('coste-incoherente');
  });

  it('su límite duele: un solar menos y un 25 % menos de pan propio', () => {
    expect(solaresDe(6, modificadores('mercaderes'))).toBe(5);
    expect(modificadores('mercaderes').produccionMil['pan']).toBe(750);
  });
});

// ——— Monjes ————————————————————————————————————————————————————————————

describe('los monjes', () => {
  it('la lealtad de sus comarcas nunca baja de 50', () => {
    const lealtadTras = (casa: Casa) => {
      const ctx = crearContexto(conCasa(escenario(), casa), [], mundo, REAL);
      aplicar(ctx, { tipo: 'lealtad', comarca: c('prueba-llano'), delta: -100, motivo: 'prueba' });
      return ctx.estado.comarcas['prueba-llano']?.lealtad;
    };
    expect(lealtadTras('monjes')).toBe(50);
    expect(lealtadTras('mesta')).toBe(0);
  });

  it('funda puebla con la mitad de gente', () => {
    const comarca = { ...comarcaDe(escenario(), 'prueba-vega'), influencias: { [UNO]: 60 } };
    const cinco = recua('recua-1', { vecinos: 5 });
    const impedimento = (casa: Casa) =>
      impedimentoDePuebla(comarca, cinco, REAL, modificadores(casa).vecinosParaPueblaMil);
    expect(impedimento('monjes')).toBeNull();
    expect(impedimento('mesta')).toBe('pocos-vecinos');
    expect(impedimentoDePuebla(comarca, recua('recua-2', { vecinos: 4 }), REAL, 500)).toBe(
      'pocos-vecinos',
    );
  });

  it('el monasterio les cuesta un 30 % menos, y solo el monasterio', () => {
    const coste = (casa: Casa, obra: 'monasterio' | 'muralla') =>
      costeDeObraMayor(obra, modificadores(casa), REAL).piedra;
    expect(coste('monjes', 'monasterio')).toBe(Math.floor((coste('mesta', 'monasterio') * 7) / 10));
    expect(coste('monjes', 'muralla')).toBe(coste('mesta', 'muralla'));
  });

  it('su límite duele: no pueden fijar una carga fiscal dura', () => {
    const orden: Orden = {
      ...base(7),
      tipo: 'politica',
      comarca: c('prueba-llano'),
      fuero: null,
      cargaFiscal: 'dura',
      dehesa: null,
      conservarConSal: null,
    };
    const monjes = turno(conCasa(escenario(), 'monjes'), [orden], REAL);
    expect(cancelaciones(monjes.sucesos)).toContain('prohibido-por-la-casa');
    expect(comarcaDe(monjes.estado, 'prueba-llano').cargaFiscal).toBe('normal');
    const otra = turno(
      conCasa(escenario(), 'mesta'),
      [{ ...orden, id: 'orden-otra' } as Orden],
      REAL,
    );
    expect(comarcaDe(otra.estado, 'prueba-llano').cargaFiscal).toBe('dura');
  });
});

// ——— Salineros ————————————————————————————————————————————————————————

describe('los salineros', () => {
  it('sus salinas rinden un 50 % más', () => {
    const sal = (casa: Casa) => {
      const estado = conComarca(conCasa(escenario({ turno: 12 }), casa), 'prueba-llano', {
        edificios: { salina: 1 },
        potenciales: { ...comarcaDe(escenario(), 'prueba-llano').potenciales, sal: 3 },
      });
      return comarcaDe(turno(estado, [], REAL).estado, 'prueba-llano').produccionUltimoTurno.sal;
    };
    expect(sal('salineros')).toBe(Math.floor((sal('mesta') * 3) / 2));
    expect(sal('mesta')).toBeGreaterThan(0);
  });

  it('su pan no sufre merma', () => {
    const merma = (casa: Casa) => {
      const { sucesos } = turno(
        conCasa(escenario({ almacen: { pan: 1000, sal: 0 } }), casa),
        [],
        REAL,
      );
      return sucesos.find(
        (s) => s.tipo === 'almacen.cambio' && s.datos['motivo'] === 'merma del pan',
      )?.datos['delta'];
    };
    expect(merma('mesta')).toBeLessThan(0);
    expect(merma('salineros')).toBeUndefined();
  });

  it('su lonja rinde un 50 % más y llega a nivel 3; su límite duele: la tierra adentro se queda corta', () => {
    const nivel = (casa: Casa, edificio: 'lonja' | 'granja') => {
      const comarca = {
        ...comarcaDe(escenario(), 'prueba-llano'),
        potenciales: { ...comarcaDe(escenario(), 'prueba-llano').potenciales, pesca: 3 as const },
        edificios: { [edificio]: 2 },
      };
      return impedimentoDeConstruir(
        comarca,
        edificio,
        [],
        8,
        modificadores(casa),
        REAL,
        CASAS_DE_OFICIO[casa].permisos,
      );
    };
    expect(nivel('salineros', 'lonja')).toBeNull();
    expect(nivel('mesta', 'lonja')).toBe('nivel-maximo');
    // Una granja de nivel 2 es su tope; a cualquier otra casa le caben cuatro.
    expect(nivel('salineros', 'granja')).toBe('nivel-maximo');
    expect(nivel('mesta', 'granja')).toBeNull();
    expect(modificadores('salineros').produccionEdificioMil['lonja']).toBe(1500);
  });
});

// ——— Arrieros ————————————————————————————————————————————————————————————

describe('los arrieros', () => {
  it('la recua maragata: un 40 % más barata, una jornada más de paso y cinco de porte', () => {
    expect(costeDeRecua(modificadores('arrieros'), REAL).maravedis).toBe(12);
    expect(costeDeRecua(modificadores('mesta'), REAL).maravedis).toBe(20);
    const r = recua('recua-1');
    const paso = (casa: Casa) =>
      pasoDeRecua(
        r,
        { barro: false, calzada: false, pasoCasaMil: modificadores(casa).pasoRecuaMil },
        REAL,
      );
    expect(paso('arrieros')).toBe(paso('mesta') + 1000);
    expect(modificadores('arrieros').porteExtra).toBe(5);
  });

  it('su límite duele: un vecino menos por nivel de casas', () => {
    const comarca = { ...comarcaDe(escenario(), 'prueba-llano'), edificios: { casas: 2 } };
    expect(capacidadDe(comarca, REAL, modificadores('mesta').capacidadPorCasasExtra)).toBe(120);
    expect(capacidadDe(comarca, REAL, modificadores('arrieros').capacidadPorCasasExtra)).toBe(118);
  });

  it('su límite duele: no pueden levantar catedral', () => {
    const catedral: Orden = {
      ...base(7),
      tipo: 'obra-mayor',
      comarca: c('prueba-llano'),
      obra: 'catedral',
      hacia: null,
      continuar: null,
      abandonar: false,
    };
    const arrieros = turno(conCasa(escenario(), 'arrieros'), [catedral], REAL);
    expect(cancelaciones(arrieros.sucesos)).toContain('prohibido-por-la-casa');
    // Otra casa no se topa con la prohibición (espera por lo que le falte: no es ciudad).
    const otra = turno(
      conCasa(escenario(), 'canteros'),
      [{ ...catedral, id: 'orden-otra' } as Orden],
      REAL,
    );
    expect(cancelaciones(otra.sucesos)).not.toContain('prohibido-por-la-casa');
  });
});

// ——— Hortelanos ————————————————————————————————————————————————————————

describe('los hortelanos', () => {
  const acequia = (turnoDeAlta: number): Orden => ({
    ...base(turnoDeAlta, { madera: 10, piedra: 15, maravedis: 10 }),
    tipo: 'construir',
    comarca: c('prueba-llano'),
    edificio: 'acequia',
  });

  it('la acequia menor solo la levantan ellos', () => {
    const estado = escenario({ almacen: { piedra: 100, madera: 100 } });
    const hortelanos = turno(conCasa(estado, 'hortelanos'), [acequia(estado.turno)], REAL);
    expect(cancelaciones(hortelanos.sucesos)).not.toContain('prohibido-por-la-casa');
    expect(Object.values(hortelanos.estado.obras).some((o) => o.que === 'acequia')).toBe(true);
    const mesta = turno(
      conCasa(estado, 'mesta'),
      [{ ...acequia(estado.turno), id: 'orden-otra' } as Orden],
      REAL,
    );
    expect(cancelaciones(mesta.sucesos)).toContain('prohibido-por-la-casa');
  });

  it('con acequia, el pan de la comarca no sufre el factor de la estación', () => {
    const factor = (acequiaConstruida: boolean) => {
      const estado = conComarca(conCasa(escenario({ turno: 2 }), 'hortelanos'), 'prueba-llano', {
        edificios: acequiaConstruida ? { granja: 1, acequia: 1 } : { granja: 1 },
      });
      const { sucesos } = turno(estado, [], REAL);
      return sucesos.find(
        (s) => s.tipo === 'produccion.explotacion' && s.comarca === 'prueba-llano',
      )?.datos['estacionMil'];
    };
    expect(factor(false)).toBe(500);
    expect(factor(true)).toBeUndefined();
  });

  it('huerta intensiva: nivel 4 y un 50 % más en vega', () => {
    const nivel = (casa: Casa) => {
      const comarca = { ...comarcaDe(escenario(), 'prueba-vega'), edificios: { huerta: 2 } };
      return impedimentoDeConstruir(
        comarca,
        'huerta',
        [],
        8,
        modificadores(casa),
        REAL,
        CASAS_DE_OFICIO[casa].permisos,
      );
    };
    expect(nivel('hortelanos')).toBeNull();
    expect(nivel('mesta')).toBe('nivel-maximo');
    const factor = (comarca: string) => {
      const estado = conComarca(conCasa(escenario({ turno: 12 }), 'hortelanos'), comarca, {
        duenyo: UNO,
        edificios: { huerta: 1 },
      });
      const { sucesos } = turno(estado, [], REAL);
      return sucesos.find((s) => s.tipo === 'produccion.explotacion' && s.comarca === comarca)
        ?.datos['casaMil'];
    };
    expect(factor('prueba-vega')).toBe(1500);
  });

  it('su límite duele: la labor rinde un 25 % menos fuera de una vega o un río', () => {
    const { sucesos } = turno(conCasa(escenario({ turno: 12 }), 'hortelanos'), [], REAL);
    const granja = sucesos.find(
      (s) => s.tipo === 'produccion.explotacion' && s.comarca === 'prueba-llano',
    );
    expect(granja?.datos['casaMil']).toBe(750);
  });
});

// ——— Costes ————————————————————————————————————————————————————————————

describe('los costes que reserva el servidor', () => {
  it('un edificio cuesta lo de la tabla por lo que diga la casa', () => {
    const conDescuento = { ...MODIFICADORES_NEUTROS, costeEdificioMil: { granja: 500 } };
    expect(costeDeEdificio('granja', conDescuento, REAL).madera).toBe(10);
    expect(costeDeEdificio('granja', MODIFICADORES_NEUTROS, REAL).madera).toBe(20);
    expect(costeDeEdificio('cantera', conDescuento, REAL)).toEqual(REAL.edificios.cantera.coste);
  });
});

// ——— Invariantes y código ———————————————————————————————————————————————

describe('lo que ninguna casa puede romper', () => {
  it('una casa con producción, costes y merma a cero no deja el estado inválido ni almacenes negativos', () => {
    const ceros: TablasDeReglas = {
      ...reglas,
      casas: {
        ...reglas.casas,
        mesta: {
          ...reglas.casas.mesta,
          modificadores: {
            ...MODIFICADORES_NEUTROS,
            produccionMil: {
              pan: 0,
              madera: 0,
              piedra: 0,
              sal: 0,
              hierro: 0,
              lana: 0,
              maravedis: 0,
            },
            costeRecuaMil: 0,
            obraMayorCosteMil: 0,
            mermaPanMil: 0,
            crecimientoMil: 0,
            laborFueraDeVegaMil: 0,
            lealtadMinima: 100,
          },
        },
      },
    };
    let estado = escenario({ turno: 7, almacen: { pan: 300 } });
    for (let i = 0; i < 12; i += 1) {
      estado = turno(estado, [], ceros).estado;
      for (const jugador of Object.values(estado.jugadores)) {
        for (const cantidad of Object.values(jugador.almacen))
          expect(cantidad).toBeGreaterThanOrEqual(0);
      }
    }
    const validado = validarEstado(JSON.parse(JSON.stringify(estado)) as unknown, mundo);
    expect(validado.ok, validado.ok ? '' : JSON.stringify(validado.errores)).toBe(true);
  });

  it('ningún archivo del motor nombra una casa fuera de las tablas, el tipo y reglas/casas', () => {
    const raiz = fileURLToPath(new URL('../src/', import.meta.url));
    const permitidos = new Set(['datos/casas.ts', 'datos/tradiciones.ts', 'tipos/reglas.ts']);
    const nombres =
      /\b(mesta|ferrones|canteros|mercaderes|monjes|salineros|arrieros|hortelanos)\b/i;
    const sinComentarios = (texto: string): string =>
      texto.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
    const fuentes: string[] = [];
    const recorrer = (carpeta: string): void => {
      for (const nombre of readdirSync(carpeta)) {
        const ruta = join(carpeta, nombre);
        if (statSync(ruta).isDirectory()) recorrer(ruta);
        else if (ruta.endsWith('.ts') && !ruta.endsWith('.test.ts')) fuentes.push(ruta);
      }
    };
    recorrer(raiz);
    expect(fuentes.length).toBeGreaterThan(50);
    const infractores = fuentes
      .map((ruta) => ruta.slice(raiz.length))
      .filter((ruta) => !permitidos.has(ruta) && !ruta.startsWith('reglas/casas/'))
      .filter((ruta) => nombres.test(sinComentarios(readFileSync(join(raiz, ruta), 'utf8'))));
    expect(infractores).toEqual([]);
  });

  it('lo desactivado hasta T-103 tiene su permiso en la tabla y ninguna fase lo lee todavía', () => {
    const raiz = fileURLToPath(new URL('../src/', import.meta.url));
    const desactivados = ['venderAperos', 'obraEnComarcaAjena', 'cartaPuebla'] as const;
    // Y el portazgo, que es permiso de los arrieros y prohibición de los monjes.
    expect(CASAS_DE_OFICIO.ferrones.permisos.venderAperos).toBe(true);
    expect(CASAS_DE_OFICIO.canteros.permisos.obraEnComarcaAjena).toBe(true);
    expect(CASAS_DE_OFICIO.monjes.permisos.cartaPuebla).toBe(true);
    expect(CASAS_DE_OFICIO.arrieros.permisos.cobrarPortazgo).toBe(true);
    expect(CASAS_DE_OFICIO.monjes.prohibiciones.cobrarPortazgo).toBe(true);
    const lectores: string[] = [];
    for (const carpeta of ['fases', 'reglas']) {
      const dir = join(raiz, carpeta);
      for (const nombre of readdirSync(dir)) {
        if (!nombre.endsWith('.ts')) continue;
        const texto = readFileSync(join(dir, nombre), 'utf8')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/(^|[^:])\/\/.*$/gm, '$1');
        if ([...desactivados, 'cobrarPortazgo'].some((permiso) => texto.includes(`.${permiso}`))) {
          lectores.push(`${carpeta}/${nombre}`);
        }
      }
    }
    expect(lectores).toEqual([]);
  });
});
