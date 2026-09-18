// Influencia en las comarcas neutrales (T-038): las siete fuentes con sus topes, el desgaste, los
// recortes, el regalo al concejo y la independencia del orden.
import { describe, expect, it } from 'vitest';

import { aplicar } from '../src/cambios.ts';
import { crearContexto } from '../src/contexto.ts';
import { INFLUENCIA } from '../src/datos/influencia.ts';
import type { ActividadDeMercado } from '../src/reglas/influencia.ts';
import {
  actividadDeMercado,
  claveDeActividad,
  fuentesDeInfluencia,
} from '../src/reglas/influencia.ts';
import { claveDeTramo } from '../src/reglas/ruta.ts';
import type { Suceso } from '../src/tipos/cronica.ts';
import type { EstadoPartida, Recua } from '../src/tipos/estado.ts';
import type { IdFeria } from '../src/tipos/ids.ts';
import type { Mundo } from '../src/tipos/mundo.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import type { TablasDeReglas } from '../src/tipos/reglas.ts';
import { validarEstado } from '../src/validacion/validarEstado.ts';
import { validarOrdenEntrante } from '../src/validacion/validarOrden.ts';
import { estadoDeEjemplo, dentro } from './ejemplos.ts';
import {
  DOS,
  PRIMAVERA,
  UNO,
  base,
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

const VEGA = 'prueba-vega';
const SINGULAR: ActividadDeMercado = { importe: new Map(), vaciaronElPan: new Set() };

function fuentes(
  estado: EstadoPartida,
  opciones: {
    comarca?: string;
    jugador?: typeof UNO;
    actividad?: ActividadDeMercado;
    tablas?: TablasDeReglas;
  } = {},
) {
  const idComarca = opciones.comarca ?? VEGA;
  return fuentesDeInfluencia(
    {
      comarca: comarcaDe(estado, idComarca),
      jugador: estado.jugadores[opciones.jugador ?? UNO] as NonNullable<
        EstadoPartida['jugadores'][string]
      >,
      actividad: opciones.actividad ?? SINGULAR,
    },
    estado,
    mundo,
    opciones.tablas ?? reglas,
  );
}

function presente(id: string, cambios: Partial<Recua> = {}): Recua {
  return recua(id, {
    situacion: { donde: 'comarca', comarca: c(VEGA) },
    cometido: 'presencia',
    carga: recursos({ pan: 20, sal: 5 }),
    ...cambios,
  });
}

function actividad(importe: number, jugador = UNO): ActividadDeMercado {
  return {
    importe: new Map([[claveDeActividad(VEGA, jugador), importe]]),
    vaciaronElPan: new Set(),
  };
}

describe('las siete fuentes de influencia', () => {
  it('presencia: +2 si una recua esta presente, y varias recuas cuentan una vez', () => {
    const una = escenario({ recuas: [presente('recua-1')] });
    expect(fuentes(una)).toMatchObject({ presente: true, presencia: 2 });
    const dos = escenario({ recuas: [presente('recua-1'), presente('recua-2')] });
    expect(fuentes(dos).presencia).toBe(2);
  });

  it.each([
    ['sin cometido de presencia', { cometido: null }],
    ['sin bastimento', { avisadaSinBastimento: true }],
    ['de camino', { ruta: [c('prueba-rio')] }],
    [
      'en otra comarca',
      { situacion: { donde: 'comarca', comarca: c('prueba-rio') } as Recua['situacion'] },
    ],
  ] as const)('presencia: no cuenta una recua %s', (_caso, cambios) => {
    const estado = escenario({ recuas: [presente('recua-1', cambios)] });
    expect(fuentes(estado)).toMatchObject({ presente: false, presencia: 0 });
  });

  it('presencia: la recua de otro jugador no cuenta para este', () => {
    const estado = escenario({ conDos: true, recuas: [presente('recua-1', { jugador: DOS })] });
    expect(fuentes(estado, { jugador: UNO }).presente).toBe(false);
    expect(fuentes(estado, { jugador: DOS }).presente).toBe(true);
  });

  it('comarcas propias vecinas: +1 por cada una, con tope', () => {
    // Las vecinas de la comarca del llano son la vega, el monte y el rio: las tres propias suman 3.
    let estado = escenario();
    estado = conComarca(estado, 'prueba-llano', { duenyo: null });
    for (const id of ['prueba-vega', 'prueba-monte', 'prueba-rio']) {
      estado = conComarca(estado, id, { duenyo: UNO });
    }
    expect(fuentes(estado, { comarca: 'prueba-llano' }).vecinas).toBe(3);
    const tope = { ...reglas, influencia: { ...reglas.influencia, maximoPorComarcasVecinas: 2 } };
    expect(fuentes(estado, { comarca: 'prueba-llano', tablas: tope }).vecinas).toBe(2);
    // Con una sola vecina propia, una.
    expect(fuentes(escenario()).vecinas).toBe(1);
    // Las vecinas de otro no cuentan.
    expect(fuentes(conComarca(escenario(), 'prueba-llano', { duenyo: DOS })).vecinas).toBe(0);
  });

  it('mercado propio en una comarca vecina: +1', () => {
    const sin = escenario();
    expect(fuentes(sin).mercado).toBe(0);
    const con = conComarca(sin, 'prueba-llano', { edificios: { mercado: 1 } });
    expect(fuentes(con).mercado).toBe(1);
    // Un mercado que no es propio no cuenta.
    expect(fuentes(conComarca(con, 'prueba-llano', { duenyo: DOS })).mercado).toBe(0);
  });

  it('comercio: +1 por cada 50 mrs comerciados, hasta +3', () => {
    const estado = escenario();
    expect(fuentes(estado, { actividad: actividad(49) }).comercio).toBe(0);
    expect(fuentes(estado, { actividad: actividad(50) }).comercio).toBe(1);
    expect(fuentes(estado, { actividad: actividad(149) }).comercio).toBe(2);
    expect(fuentes(estado, { actividad: actividad(150) }).comercio).toBe(3);
    expect(fuentes(estado, { actividad: actividad(10000) }).comercio).toBe(3);
    // El comercio de otro jugador no es mio.
    expect(fuentes(estado, { actividad: actividad(500, DOS) }).comercio).toBe(0);
  });

  it('monasterio: +2 para quien tuvo la comarca y conserva su monasterio', () => {
    const estado = conComarca(escenario(), VEGA, { exDuenyo: UNO, obrasMayores: ['monasterio'] });
    expect(fuentes(estado).monasterio).toBe(2);
    expect(fuentes(conComarca(estado, VEGA, { obrasMayores: [] })).monasterio).toBe(0);
    expect(fuentes(conComarca(estado, VEGA, { exDuenyo: DOS })).monasterio).toBe(0);
    expect(fuentes(conComarca(estado, VEGA, { exDuenyo: null })).monasterio).toBe(0);
  });

  it('camino: +1 si un tramo mejorado la une a una comarca propia', () => {
    const estado = escenario();
    expect(fuentes(estado).camino).toBe(0);
    const mejorado = {
      ...estado,
      caminos: { [claveDeTramo(VEGA, 'prueba-llano')]: { calidad: 'herradura', puente: false } },
    } as const;
    expect(fuentes(mejorado).camino).toBe(1);
    // Mejorado, pero hacia una comarca que no es del jugador: no cuenta.
    const ajeno = conComarca(mejorado, 'prueba-llano', { duenyo: DOS });
    expect(fuentes(ajeno).camino).toBe(0);
  });
});

describe('el desgaste y el neto', () => {
  it('sin presencia ni comercio se pierde un punto', () => {
    // Una vecina propia da +1 y el desgaste resta 1.
    expect(fuentes(escenario())).toMatchObject({ desgaste: 1, escasez: 0, neto: 0 });
  });

  it('con presencia o con cualquier comercio no hay desgaste', () => {
    expect(fuentes(escenario({ recuas: [presente('recua-1')] })).desgaste).toBe(0);
    expect(fuentes(escenario(), { actividad: actividad(1) }).desgaste).toBe(0);
  });

  it('vaciar el pan de la plaza resta cinco', () => {
    const vaciada: ActividadDeMercado = {
      importe: new Map([[claveDeActividad(VEGA, UNO), 100]]),
      vaciaronElPan: new Set([claveDeActividad(VEGA, UNO)]),
    };
    // +1 vecina, +2 por 100 mrs, -5 por el pan.
    expect(fuentes(escenario(), { actividad: vaciada })).toMatchObject({
      comercio: 2,
      escasez: 5,
      neto: -2,
    });
  });

  it('la actividad se saca de los sucesos de la fase 7', () => {
    const suceso = (tipo: string, datos: Suceso['datos'], jugador = UNO): Suceso => ({
      orden: 1,
      fase: 'mercado',
      tipo,
      jugador,
      comarca: c(VEGA),
      datos,
    });
    const { importe, vaciaronElPan } = actividadDeMercado([
      suceso('mercado.trato', { importe: 40 }),
      suceso('mercado.trato', { importe: 25 }),
      suceso('mercado.trato', { importe: 900 }, DOS),
      suceso('mercado.sin-casar', {
        recurso: 'pan',
        operacion: 'comprar',
        motivo: 'volumen-de-plaza',
      }),
      suceso(
        'mercado.sin-casar',
        { recurso: 'lana', operacion: 'comprar', motivo: 'volumen-de-plaza' },
        DOS,
      ),
      suceso(
        'mercado.sin-casar',
        { recurso: 'pan', operacion: 'vender', motivo: 'volumen-de-plaza' },
        DOS,
      ),
      suceso(
        'mercado.sin-casar',
        { recurso: 'pan', operacion: 'comprar', motivo: 'sin-fondos' },
        DOS,
      ),
    ]);
    expect(importe.get(claveDeActividad(VEGA, UNO))).toBe(65);
    expect(importe.get(claveDeActividad(VEGA, DOS))).toBe(900);
    expect([...vaciaronElPan]).toEqual([claveDeActividad(VEGA, UNO)]);
  });
});

describe('la fase de influencia', () => {
  const influenciaDe = (estado: EstadoPartida, jugador = UNO, comarca = VEGA): number =>
    comarcaDe(estado, comarca).influencias[jugador] ?? 0;

  it('acumula cada turno lo que suman las fuentes y deja el desglose en un suceso', () => {
    const estado = escenario({ recuas: [presente('recua-1')] });
    const { estado: despues, sucesos } = turno(estado);
    // +2 de presencia y +1 de la vecina propia; sin desgaste porque hay presencia.
    expect(influenciaDe(despues)).toBe(3);
    const desglose = sucesos.find((s) => s.tipo === 'influencia.fuentes');
    expect(desglose).toMatchObject({
      jugador: UNO,
      comarca: VEGA,
      datos: { presencia: 2, vecinas: 1, desgaste: 0, neto: 3, total: 3 },
    });
    expect(turno(despues).estado.comarcas[VEGA]?.influencias[UNO]).toBe(6);
  });

  it('no crea influencia de la nada: con neto cero no hay cambio ni suceso', () => {
    const { estado, sucesos } = turno(escenario());
    expect(comarcaDe(estado, VEGA).influencias).toEqual({});
    expect(sucesos.some((s) => s.tipo === 'influencia.fuentes')).toBe(false);
  });

  it('solo la acumula quien conoce la comarca', () => {
    let estado = escenario({ recuas: [presente('recua-1')] });
    const jugador = estado.jugadores[UNO];
    if (jugador === undefined) throw new Error('falta el jugador');
    estado = {
      ...estado,
      jugadores: {
        [UNO]: {
          ...jugador,
          conocimiento: { 'prueba-llano': { nivel: 'propia', turnoUltimaNoticia: 1, datos: null } },
        },
      },
    };
    expect(influenciaDe(turno(estado).estado)).toBe(0);
  });

  it('nunca sale de 0..100', () => {
    const alta = conComarca(escenario({ recuas: [presente('recua-1')] }), VEGA, {
      influencias: { [UNO]: 99 },
    });
    expect(influenciaDe(turno(alta).estado)).toBe(100);
    const baja = conComarca(escenario(), VEGA, { influencias: { [UNO]: 1 } });
    // -1 de desgaste y +1 de la vecina: se queda; con escasez del pan bajaria de 0.
    expect(influenciaDe(turno(baja).estado)).toBe(1);
    const sinVecinas = conComarca(escenario({ conDos: true }), 'prueba-llano', { duenyo: DOS });
    const desgastada = conComarca(sinVecinas, VEGA, { influencias: { [UNO]: 0 } });
    expect(influenciaDe(turno(desgastada).estado)).toBe(0);
  });

  it('el desgaste y la presencia seguida: un turno de presencia suma uno y uno sin ella lo borra', () => {
    const estado = escenario({ recuas: [presente('recua-1')] });
    const uno = turno(estado).estado;
    expect(comarcaDe(uno, VEGA).presenciaSeguida[UNO]).toBe(1);
    const dos = turno(uno).estado;
    expect(comarcaDe(dos, VEGA).presenciaSeguida[UNO]).toBe(2);
    const sinRecua = turno({ ...dos, recuas: {} }).estado;
    expect(comarcaDe(sinRecua, VEGA).presenciaSeguida).toEqual({});
  });

  it('es identica con los jugadores en cualquier orden', () => {
    const estado = escenario({
      conDos: true,
      recuas: [presente('recua-1'), presente('recua-2', { jugador: DOS })],
    });
    const alReves: EstadoPartida = {
      ...estado,
      jugadores: Object.fromEntries(Object.entries(estado.jugadores).reverse()),
    };
    const a = turno(estado);
    const b = turno(alReves);
    expect(b.estado.huellaTurnoAnterior).toBe(a.estado.huellaTurnoAnterior);
    expect(b.sucesos.map((s) => [s.tipo, s.jugador])).toEqual(
      a.sucesos.map((s) => [s.tipo, s.jugador]),
    );
  });

  it('las comarcas con dueño no acumulan influencia', () => {
    const { estado } = turno(
      escenario({
        recuas: [
          presente('recua-1', { situacion: { donde: 'comarca', comarca: c('prueba-llano') } }),
        ],
      }),
    );
    expect(comarcaDe(estado, 'prueba-llano').influencias).toEqual({});
  });
});

/** Un mundo con una feria en la vega, para que haya comercio en una comarca neutral. */
function mundoConFeriaEnLaVega(): Mundo {
  const vega = mundo.comarcas[VEGA];
  if (vega === undefined) throw new Error('el mundo mini ha cambiado');
  return {
    ...mundo,
    comarcas: {
      ...mundo.comarcas,
      [VEGA]: {
        ...vega,
        ferias: [
          {
            id: 'prueba' as IdFeria,
            nombre: 'Feria de Prueba',
            turnos: [PRIMAVERA],
            volumen: 'pequenya',
            recursosDestacados: [],
          },
        ],
      },
    },
  };
}

describe('el comercio y el pan vaciado, con la fase 7 de por medio', () => {
  it('vender en una feria de la comarca da influencia por el importe', () => {
    const estado = escenario({
      recuas: [recua('recua-1', { carga: recursos({ lana: 10, pan: 20 }) })],
    });
    const ruta = ordenRuta(estado.turno, 'recua-1', [
      parada(VEGA, { vender: { lana: { cantidad: 10, precioMinimoMil: 1000 } } }),
    ]);
    const { estado: despues, sucesos } = turno(estado, [ruta], reglas, mundoConFeriaEnLaVega());
    const trato = sucesos.find((s) => s.tipo === 'mercado.trato');
    const importe = Number(trato?.datos['importe']);
    const bloques = Math.min(Math.floor(importe / INFLUENCIA.maravedisPorBloqueDeComercio), 3);
    expect(bloques).toBeGreaterThan(0);
    // Los bloques de comercio y +1 de la vecina; sin desgaste por haber comerciado.
    expect(comarcaDe(despues, VEGA).influencias[UNO]).toBe(bloques + 1);
  });

  it('comprar mas pan del que da la plaza resta cinco', () => {
    const estado = conComarca(
      escenario({
        recuas: [recua('recua-1', { porte: 400, carga: recursos({ maravedis: 3000, pan: 20 }) })],
      }),
      VEGA,
      { influencias: { [UNO]: 20 } },
    );
    const ruta = ordenRuta(estado.turno, 'recua-1', [
      parada(VEGA, { comprar: { pan: { cantidad: 300, precioMaximoMil: 9000 } } }),
    ]);
    const { estado: despues, sucesos } = turno(estado, [ruta], reglas, mundoConFeriaEnLaVega());
    expect(
      sucesos.some(
        (s) => s.tipo === 'mercado.sin-casar' && s.datos['motivo'] === 'volumen-de-plaza',
      ),
    ).toBe(true);
    const desglose = sucesos.find((s) => s.tipo === 'influencia.fuentes' && s.jugador === UNO);
    expect(desglose?.datos).toMatchObject({ escasez: 5 });
    expect(comarcaDe(despues, VEGA).influencias[UNO]).toBe(20 + Number(desglose?.datos['neto']));
    expect(Number(desglose?.datos['neto'])).toBeLessThan(0);
  });
});

describe('el regalo al concejo', () => {
  function regalo(turnoDeAlta: number, comarca = VEGA, jugador = UNO): Orden {
    return {
      ...base(turnoDeAlta, { maravedis: 50 }),
      jugador,
      tipo: 'regalo',
      comarca: c(comarca),
    };
  }

  it('da +5 de golpe y cuesta 50 mrs', () => {
    const estado = escenario();
    const { estado: despues, sucesos } = turno(estado, [regalo(estado.turno)]);
    // +5 del regalo, +1 de la vecina y -1 de desgaste: el regalo no cuenta como actividad.
    expect(comarcaDe(despues, VEGA).influencias[UNO]).toBe(5);
    const pago = sucesos.find(
      (s) =>
        s.tipo === 'almacen.cambio' &&
        s.jugador === UNO &&
        String(s.datos['motivo']).startsWith('orden '),
    );
    expect(pago?.datos).toMatchObject({ recurso: 'maravedis', delta: -50 });
    expect(despues.jugadores[UNO]?.reservado.maravedis).toBe(0);
    expect(comarcaDe(despues, VEGA).ultimoRegalo[UNO]).toBe(estado.turno);
    expect(sucesos.some((s) => s.tipo === 'influencia.regalo')).toBe(true);
    expect(despues.ordenes).toHaveLength(0);
  });

  it('no se repite antes de cuatro turnos: la segunda orden espera y arranca sola', () => {
    let estado = escenario();
    estado = turno(estado, [regalo(estado.turno)]).estado;
    // El regalo se hizo en el turno anterior al que toca ahora; el siguiente vale cuatro turnos despues.
    const dado = estado.turno - 1;
    estado = turno(estado, [regalo(estado.turno)]).estado;
    for (let esperados = 1; esperados <= 3; esperados += 1) {
      expect(estado.ordenes[0]).toMatchObject({
        estado: 'en espera',
        motivoEspera: 'regalo-reciente',
      });
      expect(comarcaDe(estado, VEGA).ultimoRegalo[UNO]).toBe(dado);
      if (esperados < 3) estado = turno(estado).estado;
    }
    const { estado: despues } = turno(estado);
    expect(despues.ordenes).toHaveLength(0);
    expect(comarcaDe(despues, VEGA).ultimoRegalo[UNO]).toBe(dado + 4);
  });

  it('se cancela si la comarca tiene dueño o el jugador no la conoce, y devuelve la reserva', () => {
    const estado = escenario();
    const propia = turno(estado, [regalo(estado.turno, 'prueba-llano')]);
    expect(
      propia.sucesos.some(
        (s) => s.tipo === 'orden.estado' && s.datos['motivo'] === 'comarca-con-duenyo',
      ),
    ).toBe(true);
    expect(propia.estado.jugadores[UNO]?.reservado.maravedis).toBe(0);

    const jugador = estado.jugadores[UNO];
    if (jugador === undefined) throw new Error('falta el jugador');
    const ciego: EstadoPartida = {
      ...estado,
      jugadores: { [UNO]: { ...jugador, conocimiento: {} } },
    };
    const desconocida = turno(ciego, [regalo(ciego.turno)]);
    expect(
      desconocida.sucesos.some(
        (s) => s.tipo === 'orden.estado' && s.datos['motivo'] === 'comarca-desconocida',
      ),
    ).toBe(true);
  });

  it('cada jugador y cada comarca llevan su propia cuenta', () => {
    const estado = escenario({ conDos: true });
    const { estado: despues } = turno(estado, [
      regalo(estado.turno, VEGA, UNO),
      regalo(estado.turno, VEGA, DOS),
      regalo(estado.turno, 'prueba-rio', UNO),
    ]);
    expect(despues.ordenes).toHaveLength(0);
    expect(comarcaDe(despues, VEGA).ultimoRegalo).toEqual({
      [UNO]: estado.turno,
      [DOS]: estado.turno,
    });
    expect(comarcaDe(despues, 'prueba-rio').ultimoRegalo).toEqual({ [UNO]: estado.turno });
  });

  it('la orden valida en la entrada', () => {
    expect(validarOrdenEntrante(regalo(1)).ok).toBe(true);
    expect(validarOrdenEntrante({ ...regalo(1), comarca: undefined }).ok).toBe(false);
  });
});

describe('las cuentas del concejo en el estado', () => {
  function ctxNeutral() {
    return crearContexto(escenario(), [], mundo, reglas);
  }

  it('al volver a neutral se apunta quien la tenia, y al incorporarse se borra todo', () => {
    const ctx = ctxNeutral();
    aplicar(ctx, { tipo: 'duenyo', comarca: c('prueba-llano'), jugador: null });
    expect(ctx.estado.comarcas['prueba-llano']?.exDuenyo).toBe(UNO);
    aplicar(ctx, {
      tipo: 'presencia-seguida',
      comarca: c('prueba-llano'),
      jugador: DOS,
      turnos: 4,
    });
    aplicar(ctx, { tipo: 'regalo', comarca: c('prueba-llano'), jugador: DOS });
    aplicar(ctx, { tipo: 'duenyo', comarca: c('prueba-llano'), jugador: DOS });
    expect(ctx.estado.comarcas['prueba-llano']).toMatchObject({
      exDuenyo: null,
      presenciaSeguida: {},
      ultimoRegalo: {},
      influencias: {},
    });
  });

  it('solo las comarcas neutrales llevan la presencia y los regalos', () => {
    const ctx = ctxNeutral();
    const llano = c('prueba-llano');
    expect(() => {
      aplicar(ctx, { tipo: 'presencia-seguida', comarca: llano, jugador: UNO, turnos: 1 });
    }).toThrow(/neutrales/);
    expect(() => {
      aplicar(ctx, { tipo: 'regalo', comarca: llano, jugador: UNO });
    }).toThrow(/duenyo/);
    expect(() => {
      aplicar(ctx, { tipo: 'presencia-seguida', comarca: c(VEGA), jugador: UNO, turnos: -1 });
    }).toThrow();
    aplicar(ctx, { tipo: 'presencia-seguida', comarca: c(VEGA), jugador: UNO, turnos: 3 });
    aplicar(ctx, { tipo: 'presencia-seguida', comarca: c(VEGA), jugador: UNO, turnos: 0 });
    expect(ctx.estado.comarcas[VEGA]?.presenciaSeguida).toEqual({});
  });

  it('el validador rechaza cuentas en comarcas con dueño y jugadores que no existen', () => {
    const estado = estadoDeEjemplo();
    const conCuentas = dentro(estado, 'comarcas', 'prueba-llano', {
      presenciaSeguida: { mesta: 2 },
    });
    const rechazada = validarEstado(conCuentas);
    expect(rechazada.ok).toBe(false);
    const fantasma = dentro(estado, 'comarcas', 'prueba-sierra', { exDuenyo: 'fantasma' });
    const rechazadaFantasma = validarEstado(fantasma);
    expect(rechazadaFantasma.ok).toBe(false);
    if (!rechazadaFantasma.ok) {
      expect(rechazadaFantasma.errores.some((e) => e.ruta.endsWith('.exDuenyo'))).toBe(true);
    }
    expect(validarEstado(estado).ok).toBe(true);
  });
});
