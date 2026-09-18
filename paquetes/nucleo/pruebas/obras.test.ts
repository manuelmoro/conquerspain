// Obras (T-035): duracion con el frenazo invernal, cuadrillas, solares y niveles, obras mayores a
// plazos con su parada y su abandono, roturar, derribar y los efectos de las siete obras mayores.
import { describe, expect, it } from 'vitest';

import { costeDeTramoMil } from '../src/reglas/ruta.ts';
import { estadoEstacionalDe } from '../src/reglas/calendario.ts';
import { cuadrillasDe } from '../src/reglas/cuadrillas.ts';
import {
  factorCrecimientoPorObrasMil,
  habilitaComercioMaritimo,
  protegeDelBandidaje,
} from '../src/reglas/obras.ts';
import { explotacionesDe } from '../src/reglas/produccion.ts';
import { costeDeRoturar } from '../src/reglas/roturar.ts';
import type { EstadoComarca, EstadoPartida, Obra } from '../src/tipos/estado.ts';
import type { IdObra } from '../src/tipos/ids.ts';
import type { Camino, Mundo, Rasgo, Terreno } from '../src/tipos/mundo.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import type { Recursos } from '../src/tipos/recursos.ts';
import { RECURSOS } from '../src/tipos/recursos.ts';
import type { TipoEdificio, TipoObraMayor } from '../src/tipos/reglas.ts';
import { TIPOS_DE_EDIFICIO } from '../src/tipos/reglas.ts';
import { azarDeTexto } from '../src/utiles/azar.ts';
import { UNO, base, c, escenario, mundo, recursos, reglas, tipos, turno } from './recuas.ts';

const LLANO = 'prueba-llano';
const RICO: Partial<Recursos> = { pan: 5000, madera: 5000, piedra: 5000, maravedis: 5000 };

function construir(t: number, edificio: TipoEdificio, comarca = LLANO): Orden {
  return {
    ...base(t, reglas.edificios[edificio].coste),
    tipo: 'construir',
    comarca: c(comarca),
    edificio,
  };
}

function obraMayor(
  t: number,
  obra: TipoObraMayor,
  opciones: { comarca?: string; hacia?: string; continuar?: string; abandonar?: boolean } = {},
): Orden {
  return {
    ...base(t),
    tipo: 'obra-mayor',
    comarca: c(opciones.comarca ?? LLANO),
    obra,
    hacia: opciones.hacia === undefined ? null : c(opciones.hacia),
    continuar: opciones.continuar === undefined ? null : (opciones.continuar as IdObra),
    abandonar: opciones.abandonar ?? false,
  };
}

function conComarca(estado: EstadoPartida, id: string, cambios: Partial<EstadoComarca>) {
  const comarca = estado.comarcas[id];
  if (comarca === undefined) throw new Error(`falta ${id}`);
  return { ...estado, comarcas: { ...estado.comarcas, [id]: { ...comarca, ...cambios } } };
}

function llano(estado: EstadoPartida): EstadoComarca {
  const comarca = estado.comarcas[LLANO];
  if (comarca === undefined) throw new Error('falta el llano');
  return comarca;
}

/** Resuelve turnos hasta que la condicion se cumple; devuelve cuantos hicieron falta. */
function turnosHasta(
  estado: EstadoPartida,
  hecho: (e: EstadoPartida) => boolean,
  ordenes: readonly Orden[] = [],
  m: Mundo = mundo,
): { turnos: number; estado: EstadoPartida } {
  let actual = estado;
  for (let i = 1; i <= 60; i += 1) {
    actual = turno(actual, i === 1 ? ordenes : [], reglas, m).estado;
    if (hecho(actual)) return { turnos: i, estado: actual };
  }
  throw new Error('no termino en 60 turnos');
}

/** Una obra mayor a la que le falta un turno, con lo debido ya entregado. */
function casiAcabada(tipo: TipoObraMayor, comarca = LLANO, hacia: string | null = null): Obra {
  const datos = reglas.obrasMayores[tipo];
  const necesario = datos.turnos * 1000;
  const hecho = necesario - 1000;
  const entregado = Object.fromEntries(
    RECURSOS.map((r) => [r, Math.floor((datos.coste[r] * hecho) / necesario)]),
  ) as Recursos;
  return {
    id: 'obra-9' as IdObra,
    jugador: UNO,
    comarca: c(comarca),
    tipo: 'obra mayor',
    que: tipo,
    hacia: hacia === null ? null : c(hacia),
    avanceMil: hecho,
    avanceNecesarioMil: necesario,
    entregado,
    costeTotal: datos.coste,
    abandonada: false,
  };
}

function conObra(estado: EstadoPartida, obra: Obra): EstadoPartida {
  return { ...estado, obras: { ...estado.obras, [obra.id]: obra } };
}

/** El mundo mini con cambios en un tramo y en una comarca. */
function mundoCon(
  tramo: Partial<Camino> | null,
  comarca?: { id: string; rasgos?: Rasgo[]; terreno?: Terreno },
): Mundo {
  const caminos = mundo.caminos.map((camino) =>
    tramo !== null && camino.desde === 'prueba-llano' && camino.hasta === 'prueba-vega'
      ? { ...camino, ...tramo }
      : camino,
  );
  const comarcas = { ...mundo.comarcas };
  if (comarca !== undefined) {
    const actual = comarcas[comarca.id];
    if (actual === undefined) throw new Error(`falta ${comarca.id}`);
    comarcas[comarca.id] = {
      ...actual,
      rasgos: comarca.rasgos ?? actual.rasgos,
      terreno: comarca.terreno ?? actual.terreno,
    };
  }
  return { ...mundo, caminos, comarcas };
}

describe('duracion y frenazo invernal', () => {
  it('un granero de tres turnos tarda tres en verano y seis en pleno invierno', () => {
    const verano = escenario({ turno: 12, almacen: RICO });
    const hecho = (e: EstadoPartida) => llano(e).edificios['granero'] === 1;
    expect(turnosHasta(verano, hecho, [construir(12, 'granero')]).turnos).toBe(3);
    const invierno = escenario({ turno: 23, almacen: RICO });
    expect(turnosHasta(invierno, hecho, [construir(23, 'granero')]).turnos).toBe(6);
  });

  it('la madera en invierno tarda un 50 % mas: una granja de dos turnos, tres', () => {
    const invierno = escenario({ turno: 23, almacen: RICO });
    const hecho = (e: EstadoPartida) => llano(e).edificios['granja'] === 2;
    expect(turnosHasta(invierno, hecho, [construir(23, 'granja')]).turnos).toBe(3);
  });

  it('pagar la obra de edificio es pagar la orden: lo reservado', () => {
    const estado = escenario({ turno: 12, almacen: RICO });
    const orden = construir(12, 'granero');
    const { sucesos } = turno(estado, [orden]);
    const pagado = sucesos.filter(
      (s) => s.tipo === 'almacen.cambio' && s.datos['motivo'] === `orden ${orden.id}`,
    );
    expect(pagado.map((s) => [s.datos['recurso'], s.datos['delta']])).toEqual([
      ['madera', -15],
      ['piedra', -20],
    ]);
  });
});

describe('cuadrillas, solares y niveles', () => {
  it('una tercera obra en una comarca con dos cuadrillas espera, con motivo y prevision', () => {
    const estado = escenario({ turno: 12, almacen: RICO });
    expect(cuadrillasDe(llano(estado), reglas)).toBe(2);
    const ordenes = [construir(12, 'granja'), construir(12, 'huerta'), construir(12, 'granero')];
    const { estado: despues, sucesos } = turno(estado, ordenes);
    expect(Object.keys(despues.obras)).toHaveLength(2);
    expect(despues.ordenes.map((o) => [o.estado, o.motivoEspera])).toEqual([
      ['en espera', 'sin-cuadrilla'],
    ]);
    expect(sucesos.find((s) => s.tipo === 'obra.sin-cuadrilla')?.datos).toMatchObject({
      turnoPrevisto: 14,
    });
    // La granja acaba al final del turno 13 y la tercera obra empieza sola en el 14.
    const trece = turno(despues).estado;
    expect(trece.ordenes).toHaveLength(1);
    expect(turno(trece).estado.ordenes).toEqual([]);
  });

  it('el fuero y el monasterio dan una cuadrilla mas cada uno', () => {
    const comarca = llano(escenario());
    expect(cuadrillasDe({ ...comarca, fuero: 'fuero' }, reglas)).toBe(3);
    expect(cuadrillasDe({ ...comarca, obrasMayores: ['monasterio'] }, reglas)).toBe(3);
    expect(cuadrillasDe({ ...comarca, poblacion: 400 }, reglas)).toBe(4);
  });

  it('propiedad: nunca se pasa del nivel maximo ni de los solares', () => {
    const azar = azarDeTexto('obras-propiedad');
    for (let partida = 0; partida < 30; partida += 1) {
      let estado = conComarca(escenario({ turno: 12, almacen: RICO }), LLANO, {
        poblacion: 400,
        potenciales: { labor: 5, monte: 5, pasto: 5, piedra: 5, hierro: 5, sal: 5, pesca: 5 },
      });
      for (let t = 0; t < 12; t += 1) {
        const ordenes = [0, 1, 2].map(() =>
          construir(estado.turno, azar.elegir(TIPOS_DE_EDIFICIO)),
        );
        estado = turno(estado, ordenes).estado;
        const comarca = llano(estado);
        const niveles = Object.values(comarca.edificios).reduce((a, b) => a + b, 0);
        const enObra = Object.values(estado.obras).filter((o) => o.tipo === 'edificio').length;
        expect(niveles + enObra).toBeLessThanOrEqual(6);
        for (const [edificio, nivel] of Object.entries(comarca.edificios)) {
          expect(nivel).toBeLessThanOrEqual(reglas.edificios[edificio as TipoEdificio].nivelMaximo);
        }
      }
    }
  });
});

describe('obras mayores', () => {
  it('se pagan a plazos y, al terminar, se ha pagado exactamente el total', () => {
    const m = mundoCon({ vado: true });
    const estado = escenario({ turno: 5, almacen: RICO });
    const orden = obraMayor(5, 'puente', { hacia: 'prueba-vega' });
    const pagos: Record<string, number> = {};
    let actual = estado;
    let turnos = 0;
    for (;;) {
      const resultado = turno(actual, turnos === 0 ? [orden] : [], reglas, m);
      actual = resultado.estado;
      turnos += 1;
      for (const s of resultado.sucesos) {
        if (s.tipo === 'almacen.cambio' && String(s.datos['motivo']).startsWith('obra obra-')) {
          const recurso = String(s.datos['recurso']);
          pagos[recurso] = (pagos[recurso] ?? 0) - Number(s.datos['delta']);
        }
      }
      if (actual.caminos['prueba-llano|prueba-vega']?.puente === true) break;
      if (turnos > 20) throw new Error('el puente no termina');
    }
    expect(turnos).toBe(12);
    expect(pagos).toEqual({ madera: 40, piedra: 120, maravedis: 60 });
  });

  it('sin material se detiene y se reanuda sola cuando lo hay', () => {
    const estado = escenario({ turno: 7, almacen: { maravedis: 500 } });
    const primero = turno(estado, [obraMayor(7, 'muralla')]);
    const obra = Object.values(primero.estado.obras)[0];
    expect(obra?.avanceMil).toBe(0);
    expect(tipos(primero.sucesos)).toContain('obra.detenida');

    const jugador = primero.estado.jugadores[UNO];
    if (jugador === undefined) throw new Error('falta la casa');
    const conPiedra: EstadoPartida = {
      ...primero.estado,
      jugadores: { [UNO]: { ...jugador, almacen: { ...jugador.almacen, piedra: 500 } } },
    };
    const segundo = turno(conPiedra);
    expect(Object.values(segundo.estado.obras)[0]?.avanceMil).toBe(1000);
  });

  it('abandonada se deteriora un 1 % por turno, no ocupa cuadrilla y se puede retomar', () => {
    const obra: Obra = { ...casiAcabada('muralla'), avanceMil: 10000 };
    const estado = conObra(escenario({ turno: 7, almacen: RICO }), obra);
    const abandono = turno(estado, [
      obraMayor(7, 'muralla', { continuar: 'obra-9', abandonar: true }),
    ]);
    expect(abandono.estado.obras['obra-9']).toMatchObject({ abandonada: true, avanceMil: 9900 });
    const otro = turno(abandono.estado);
    expect(otro.estado.obras['obra-9']?.avanceMil).toBe(9801);

    const retomada = turno(otro.estado, [
      obraMayor(otro.estado.turno, 'muralla', { continuar: 'obra-9', abandonar: false }),
    ]);
    expect(retomada.estado.obras['obra-9']).toMatchObject({ abandonada: false, avanceMil: 10801 });
  });

  it('los requisitos: vado para el puente, carretero para la calzada, costa, vega, ciudad…', () => {
    const estado = escenario({ turno: 7, almacen: RICO });
    const motivos = (orden: Orden, m: Mundo = mundo) =>
      turno(estado, [orden], reglas, m).estado.ordenes[0]?.motivoEspera;
    expect(motivos(obraMayor(7, 'puente', { hacia: 'prueba-vega' }))).toBe('sin-vado');
    expect(motivos(obraMayor(7, 'puente', { hacia: 'prueba-costa' }))).toBe('sin-tramo');
    expect(motivos(obraMayor(7, 'calzada', { hacia: 'prueba-vega' }))).toBe('sin-camino-carretero');
    expect(motivos(obraMayor(7, 'atarazana'))).toBe('no-es-costa');
    expect(motivos(obraMayor(7, 'acequia-mayor'))).toBe('sin-vega-fluvial');
    expect(motivos(obraMayor(7, 'catedral'))).toBe('no-es-ciudad');
    const pocaLealtad = conComarca(estado, LLANO, { lealtad: 59 });
    expect(turno(pocaLealtad, [obraMayor(7, 'monasterio')]).estado.ordenes[0]?.motivoEspera).toBe(
      'poca-lealtad',
    );
  });
});

describe('los efectos de las siete obras mayores', () => {
  const PRIMAVERA = estadoEstacionalDe(7, mundo, reglas);
  const INVIERNO = estadoEstacionalDe(2, mundo, reglas);

  it('puente: el vado deja de costar dos jornadas', () => {
    const m = mundoCon({ vado: true });
    const estado = conObra(
      escenario({ turno: 7, almacen: RICO }),
      casiAcabada('puente', LLANO, 'prueba-vega'),
    );
    const { estado: despues } = turno(estado, [], reglas, m);
    const tramo = m.caminos.find((t) => t.desde === 'prueba-llano' && t.hasta === 'prueba-vega');
    if (tramo === undefined) throw new Error('falta el tramo');
    expect(costeDeTramoMil(tramo, PRIMAVERA, reglas, {})).toBe(4000);
    expect(costeDeTramoMil(tramo, PRIMAVERA, reglas, despues.caminos)).toBe(2000);
  });

  it('calzada: factor del 50 % y nunca se cierra por nieve', () => {
    const m = mundoCon({
      calzadaRomana: true,
      puertoDeMontanya: 'Puerto de Prueba',
      cierraEnInvierno: true,
    });
    const estado = conObra(
      escenario({ turno: 7, almacen: RICO }),
      casiAcabada('calzada', LLANO, 'prueba-vega'),
    );
    const { estado: despues } = turno(estado, [], reglas, m);
    expect(despues.caminos['prueba-llano|prueba-vega']).toEqual({
      calidad: 'calzada',
      puente: false,
    });
    const tramo = m.caminos.find((t) => t.desde === 'prueba-llano' && t.hasta === 'prueba-vega');
    if (tramo === undefined) throw new Error('falta el tramo');
    // Puerto: 7 jornadas; como carretero (65 %) 4550, como calzada (50 %) 3500.
    expect(costeDeTramoMil(tramo, PRIMAVERA, reglas, {})).toBe(4550);
    expect(costeDeTramoMil(tramo, PRIMAVERA, reglas, despues.caminos)).toBe(3500);
    expect(costeDeTramoMil(tramo, INVIERNO, reglas, despues.caminos)).not.toBe('cerrado');
  });

  it('monasterio: una cuadrilla mas, mas crecimiento alrededor y roturar gratis', () => {
    const estado = conObra(escenario({ turno: 7, almacen: RICO }), casiAcabada('monasterio'));
    const { estado: despues } = turno(estado);
    expect(llano(despues).obrasMayores).toEqual(['monasterio']);
    expect(cuadrillasDe(llano(despues), reglas)).toBe(3);
    expect(factorCrecimientoPorObrasMil('prueba-llano', despues, mundo, reglas)).toBe(1200);
    expect(factorCrecimientoPorObrasMil('prueba-vega', despues, mundo, reglas)).toBe(1200);
    expect(factorCrecimientoPorObrasMil('prueba-costa', despues, mundo, reglas)).toBe(1000);
    expect(costeDeRoturar(llano(despues), reglas)).toEqual(recursos());
  });

  it('muralla: +15 de lealtad y protege del bandidaje', () => {
    const estado = conComarca(
      conObra(escenario({ turno: 7, almacen: RICO }), casiAcabada('muralla')),
      LLANO,
      { lealtad: 70 },
    );
    const { estado: despues } = turno(estado);
    expect(llano(despues).lealtad).toBe(85);
    expect(protegeDelBandidaje(llano(despues))).toBe(true);
  });

  it('catedral: pide ciudad, sede y cantera; da lealtad a la region y peregrinos', () => {
    const m = mundoCon(null, { id: LLANO, rasgos: ['ciudad-episcopal'] });
    const ciudad = conComarca(escenario({ turno: 7, almacen: RICO }), LLANO, {
      poblacion: 220,
      obrasMayores: ['muralla'],
      edificios: { granja: 1, cantera: 1 },
      lealtad: 50,
    });
    const empieza = turno(ciudad, [obraMayor(7, 'catedral')], reglas, m);
    expect(Object.values(empieza.estado.obras)[0]?.que).toBe('catedral');

    const hecha = conObra(ciudad, casiAcabada('catedral'));
    const primero = turno(hecha, [], reglas, m);
    expect(llano(primero.estado).obrasMayores).toContain('catedral');
    const segundo = turno(primero.estado, [], reglas, m);
    const peregrinos = segundo.sucesos.find(
      (s) => s.tipo === 'almacen.cambio' && s.datos['motivo'] === 'peregrinos de prueba-llano',
    );
    expect(peregrinos?.datos['delta']).toBe(12);
    const lealtad = segundo.sucesos.find(
      (s) => s.tipo === 'lealtad.cambio' && s.datos['motivo'] === 'catedral de prueba-llano',
    );
    expect(lealtad?.datos['delta']).toBe(2);
  });

  it('atarazana: solo en la costa, y habilita el comercio maritimo', () => {
    const estado = conComarca(
      conObra(escenario({ turno: 7, almacen: RICO }), casiAcabada('atarazana', 'prueba-costa')),
      'prueba-costa',
      { duenyo: UNO },
    );
    const { estado: despues } = turno(estado);
    const costa = despues.comarcas['prueba-costa'] as EstadoComarca;
    expect(habilitaComercioMaritimo(costa)).toBe(true);
  });

  it('acequia mayor: +50 % de labor y sin estacion', () => {
    const comarca: EstadoComarca = {
      ...llano(escenario()),
      edificios: { granja: 1 },
      obrasMayores: ['acequia-mayor'],
    };
    const [granja] = explotacionesDe(
      {
        comarca,
        region: 'x',
        estacion: 'invierno',
        clima: { anyo: 1, modificadores: [] },
        casaMil: {},
      },
      reglas,
    );
    expect(granja?.factores.map((f) => f.nombre)).toContain('acequia');
    expect(granja?.factores.map((f) => f.nombre)).not.toContain('estacion');
    // 10 × potencial 3 (100 %) × 150 %.
    expect(granja?.resultado).toBe(15);
  });
});

describe('roturar y derribar', () => {
  it('roturar pasa un punto de monte a labor en tres turnos', () => {
    const estado = escenario({ turno: 7, almacen: RICO });
    const orden: Orden = {
      ...base(7, reglas.obras.costeRoturar),
      tipo: 'roturar',
      comarca: c(LLANO),
    };
    const antes = llano(estado).potenciales;
    const { turnos, estado: despues } = turnosHasta(
      estado,
      (e) => llano(e).potenciales.labor !== antes.labor,
      [orden],
    );
    expect(turnos).toBe(3);
    expect(llano(despues).potenciales).toMatchObject({
      monte: antes.monte - 1,
      labor: antes.labor + 1,
    });
  });

  it('en dehesa cuesta el doble y el concejo pierde 5 de lealtad', () => {
    const estado = conComarca(escenario({ turno: 7, almacen: RICO }), LLANO, {
      dehesa: true,
      lealtad: 80,
    });
    expect(costeDeRoturar(llano(estado), reglas)).toMatchObject({ pan: 20, maravedis: 40 });
    const orden: Orden = {
      ...base(7, costeDeRoturar(llano(estado), reglas)),
      tipo: 'roturar',
      comarca: c(LLANO),
    };
    const { estado: despues } = turno(estado, [orden]);
    expect(llano(despues).lealtad).toBeLessThanOrEqual(75);
  });

  it('derribar libera el solar en un turno y devuelve la mitad del material', () => {
    const estado = conComarca(escenario({ turno: 7, almacen: RICO }), LLANO, {
      edificios: { granja: 1, granero: 1 },
    });
    const orden: Orden = { ...base(7), tipo: 'derribar', comarca: c(LLANO), edificio: 'granero' };
    const { estado: despues, sucesos } = turno(estado, [orden]);
    expect(llano(despues).edificios['granero']).toBeUndefined();
    const devuelto = sucesos.filter((s) => s.datos['motivo'] === 'derribo de granero');
    expect(devuelto.map((s) => [s.datos['recurso'], s.datos['delta']])).toEqual([
      ['madera', 7],
      ['piedra', 10],
    ]);
  });
});

describe('simultaneidad', () => {
  it('barajar las ordenes no cambia la huella del turno', () => {
    const estado = conComarca(escenario({ turno: 7, almacen: RICO }), LLANO, { poblacion: 200 });
    const ordenes = [
      construir(7, 'granja'),
      construir(7, 'granero'),
      obraMayor(7, 'muralla'),
      { ...base(7, reglas.obras.costeRoturar), tipo: 'roturar', comarca: c(LLANO) } as Orden,
    ];
    const huella = turno(estado, ordenes).estado.huellaTurnoAnterior;
    const azar = azarDeTexto('barajar-obras');
    for (let i = 0; i < 5; i += 1) {
      expect(turno(estado, azar.barajar(ordenes)).estado.huellaTurnoAnterior).toBe(huella);
    }
  });
});
