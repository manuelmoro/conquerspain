// La frontera intencion -> orden (ficha T-062 §4.4): forma estricta, propiedad, coste con la casa y
// que el motor acepta lo que se construye.
import { describe, expect, it } from 'vitest';

import { costeDeAperos, costeDeEdificio, costeDeRecua } from '../src/reglas/casas/costes.ts';
import { modificadoresDelJugador } from '../src/reglas/casas/index.ts';
import { CAMPOS_INTERNOS, construirOrden, validarIntencion } from '../src/ordenes/intencion.ts';
import type { ContextoDeIntencion } from '../src/ordenes/intencion.ts';
import type { EstadoPartida } from '../src/tipos/estado.ts';
import type { IdOrden } from '../src/tipos/ids.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import { explicar } from '../src/validacion/validador.ts';
import { DOS, UNO, conComarca, de, escenario, mundo, recua, reglas, turno } from './recuas.ts';

const CLAVE = { idCliente: 'clave-1' };

function contexto(estado: EstadoPartida, jugador = UNO): ContextoDeIntencion {
  return { estado, jugador, mundo, reglas, id: 'o-1-clave-1' as IdOrden };
}

function construir(dato: unknown, estado: EstadoPartida, jugador = UNO): Orden {
  const forma = validarIntencion(dato);
  if (!forma.ok) throw new Error(`no valida de forma:\n${explicar(forma.errores)}`);
  const orden = construirOrden(forma.valor, contexto(estado, jugador));
  if (!orden.ok) throw new Error(`no se construye:\n${explicar(orden.errores)}`);
  return orden.valor;
}

function motivos(dato: unknown, estado: EstadoPartida, jugador = UNO): string {
  const forma = validarIntencion(dato);
  if (!forma.ok) return explicar(forma.errores);
  const orden = construirOrden(forma.valor, contexto(estado, jugador));
  return orden.ok ? '' : explicar(orden.errores);
}

/** Una intencion bien formada de cada tipo que un jugador puede dar, sobre el estado del escenario. */
const UNA_DE_CADA: readonly (readonly [string, Record<string, unknown>])[] = [
  ['construir', { tipo: 'construir', comarca: 'prueba-llano', edificio: 'granja' }],
  ['derribar', { tipo: 'derribar', comarca: 'prueba-llano', edificio: 'granja' }],
  ['roturar', { tipo: 'roturar', comarca: 'prueba-llano' }],
  [
    'politica',
    {
      tipo: 'politica',
      comarca: 'prueba-llano',
      fuero: null,
      cargaFiscal: null,
      dehesa: null,
      conservarConSal: null,
    },
  ],
  ['formar-recua', { tipo: 'formar-recua', comarca: 'prueba-llano', vecinos: 0 }],
  ['formar-rebanyo', { tipo: 'formar-rebanyo', comarca: 'prueba-llano' }],
  [
    'ruta',
    {
      tipo: 'ruta',
      recua: 'recua-1',
      rebanyo: null,
      paradas: [{ comarca: 'prueba-vega', cargar: {}, descargar: {}, vender: {}, comprar: {} }],
      circular: false,
      expedicion: false,
    },
  ],
  [
    'carga',
    { tipo: 'carga', recua: 'recua-1', cargar: { pan: 2 }, descargar: {}, vecinosCargados: 0 },
  ],
  ['cometido', { tipo: 'cometido', recua: 'recua-1', cometido: 'explorar' }],
  ['aperos', { tipo: 'aperos', comarca: 'prueba-llano' }],
  ['tradicion', { tipo: 'tradicion', tradicion: 'contra-el-frio' }],
];

function conRecua(): EstadoPartida {
  return escenario({ recuas: [recua('recua-1')], conDos: true });
}

describe('validarIntencion: la forma', () => {
  it('acepta una intencion bien formada y guarda su clave y su plan', () => {
    const forma = validarIntencion({
      ...CLAVE,
      turnoProgramado: 4,
      tipo: 'roturar',
      comarca: 'prueba-llano',
    });
    expect(forma.ok && forma.valor.idCliente).toBe('clave-1');
    expect(forma.ok && forma.valor.turnoProgramado).toBe(4);
  });

  it.each(CAMPOS_INTERNOS)('rechaza el campo interno "%s": lo fija el servidor', (campo) => {
    const resultado = validarIntencion({
      ...CLAVE,
      tipo: 'roturar',
      comarca: 'prueba-llano',
      [campo]: 'x',
    });
    expect(resultado.ok ? '' : explicar(resultado.errores)).toContain(campo);
  });

  it('rechaza cualquier campo que no sea de la orden', () => {
    expect(
      validarIntencion({ ...CLAVE, tipo: 'roturar', comarca: 'prueba-llano', pirata: 1 }).ok,
    ).toBe(false);
  });

  it('rechaza lo que no es un objeto y las claves malas', () => {
    for (const malo of [null, 3, 'x', [], undefined]) expect(validarIntencion(malo).ok).toBe(false);
    for (const idCliente of [undefined, '', 'MAYUSCULAS', 'a'.repeat(65), 7, 'con espacio']) {
      expect(validarIntencion({ idCliente, tipo: 'roturar', comarca: 'prueba-llano' }).ok).toBe(
        false,
      );
    }
  });

  it('rechaza un tipo desconocido, las letras de cambio y los campos que fijan las reglas', () => {
    expect(validarIntencion({ ...CLAVE, tipo: 'saquear', comarca: 'prueba-llano' }).ok).toBe(false);
    expect(
      validarIntencion({ ...CLAVE, tipo: 'letra-de-cambio', recua: 'recua-1', cantidad: 5 }).ok,
    ).toBe(false);
    expect(
      validarIntencion({
        ...CLAVE,
        tipo: 'formar-recua',
        comarca: 'prueba-llano',
        vecinos: 0,
        acemilas: 500,
      }).ok,
    ).toBe(false);
    expect(
      validarIntencion({
        ...CLAVE,
        tipo: 'formar-rebanyo',
        comarca: 'prueba-llano',
        cabezas: 99999,
      }).ok,
    ).toBe(false);
  });

  it('el plan y la duracion tienen su forma, y la duracion solo es de mercado', () => {
    expect(
      validarIntencion({ ...CLAVE, turnoProgramado: 0, tipo: 'roturar', comarca: 'prueba-llano' })
        .ok,
    ).toBe(false);
    expect(
      validarIntencion({ ...CLAVE, turnos: 3, tipo: 'roturar', comarca: 'prueba-llano' }).ok,
    ).toBe(false);
  });
});

describe('construirOrden: lo que fija el servidor', () => {
  it('pone autor, turno, estado, identificador y marcas propias, no las del cliente', () => {
    const estado = escenario({ turno: 7 });
    const orden = construir({ ...CLAVE, tipo: 'roturar', comarca: 'prueba-llano' }, estado);
    expect(orden).toMatchObject({
      id: 'o-1-clave-1',
      jugador: UNO,
      turnoAlta: 7,
      estado: 'pendiente',
      turnosHechos: 0,
      motivoEspera: null,
      delMayordomo: false,
      cola: 'comarca:prueba-llano',
    });
  });

  it('el coste sale de las reglas con los modificadores de la casa, para cada tipo con coste', () => {
    const estado = conRecua();
    const yo = estado.jugadores[UNO];
    if (yo === undefined) throw new Error('falta el jugador');
    const casa = modificadoresDelJugador(yo, reglas);
    expect(
      construir(
        { ...CLAVE, tipo: 'construir', comarca: 'prueba-llano', edificio: 'granja' },
        estado,
      ).coste,
    ).toEqual(costeDeEdificio('granja', casa, reglas));
    expect(
      construir({ ...CLAVE, tipo: 'formar-recua', comarca: 'prueba-llano', vecinos: 0 }, estado)
        .coste,
    ).toEqual(costeDeRecua(casa, reglas));
    expect(construir({ ...CLAVE, tipo: 'aperos', comarca: 'prueba-llano' }, estado).coste).toEqual(
      costeDeAperos(reglas),
    );
  });

  it('dos casas distintas pagan lo que dice su casa (modificadores efectivos)', () => {
    const estado = conRecua();
    const yo = estado.jugadores[UNO];
    if (yo === undefined) throw new Error('falta el jugador');
    const otra: EstadoPartida = {
      ...estado,
      jugadores: { ...estado.jugadores, [UNO]: { ...yo, casa: 'canteros' } },
    };
    for (const e of [estado, otra]) {
      const jugador = e.jugadores[UNO];
      if (jugador === undefined) throw new Error('falta el jugador');
      const esperado = costeDeEdificio('granja', modificadoresDelJugador(jugador, reglas), reglas);
      const orden = construir(
        { ...CLAVE, tipo: 'construir', comarca: 'prueba-llano', edificio: 'granja' },
        e,
      );
      expect(orden.coste).toEqual(esperado);
    }
  });

  it('formar recua y rebanyo llevan las acemilas y cabezas de las tablas, no las que diga el cliente', () => {
    const estado = conRecua();
    const recuaNueva = construir(
      { ...CLAVE, tipo: 'formar-recua', comarca: 'prueba-llano', vecinos: 2 },
      estado,
    );
    expect(recuaNueva.tipo === 'formar-recua' && recuaNueva.acemilas).toBe(
      reglas.movimiento.acemilasPorRecua,
    );
    const rebanyo = construir(
      { ...CLAVE, tipo: 'formar-rebanyo', comarca: 'prueba-llano' },
      estado,
    );
    expect(rebanyo.tipo === 'formar-rebanyo' && rebanyo.cabezas).toBe(
      reglas.ganaderia.cabezasPorRebanyo,
    );
  });

  it('las de recua van en la cola de su recua y las de comarca, en la de su comarca', () => {
    const estado = conRecua();
    expect(
      construir({ ...CLAVE, tipo: 'cometido', recua: 'recua-1', cometido: 'explorar' }, estado)
        .cola,
    ).toBe('recua:recua-1');
    expect(construir({ ...CLAVE, tipo: 'roturar', comarca: 'prueba-llano' }, estado).cola).toBe(
      'comarca:prueba-llano',
    );
  });
});

describe('construirOrden: lo que es del jugador y lo que conoce', () => {
  it('no se construye en una comarca ajena ni neutral, salvo lo que es de tierra de nadie', () => {
    const estado = conComarca(conRecua(), 'prueba-costa', { duenyo: DOS });
    expect(motivos({ ...CLAVE, tipo: 'roturar', comarca: 'prueba-costa' }, estado)).toContain(
      'no es tuya',
    );
    expect(
      motivos({ ...CLAVE, tipo: 'construir', comarca: 'prueba-vega', edificio: 'granja' }, estado),
    ).toContain('no es tuya');
    expect(motivos({ ...CLAVE, tipo: 'incorporar', comarca: 'prueba-costa' }, estado)).toContain(
      'ya tiene dueño',
    );
  });

  it('una recua o un rebanyo ajenos o inexistentes se rechazan', () => {
    const estado = escenario({
      recuas: [recua('recua-9', { jugador: DOS }), recua('recua-1')],
      conDos: true,
    });
    expect(
      motivos({ ...CLAVE, tipo: 'cometido', recua: 'recua-9', cometido: 'explorar' }, estado),
    ).toContain('no es tuya');
    expect(
      motivos({ ...CLAVE, tipo: 'cometido', recua: 'recua-0', cometido: 'explorar' }, estado),
    ).toContain('no es tuya');
    expect(
      motivos(
        {
          ...CLAVE,
          tipo: 'ruta',
          recua: null,
          rebanyo: 'r-x',
          paradas: [{ comarca: 'prueba-vega', cargar: {}, descargar: {}, vender: {}, comprar: {} }],
          circular: false,
          expedicion: false,
        },
        estado,
      ),
    ).toContain('no es tuyo');
  });

  it('una comarca de la que el jugador no sabe nada no se puede citar', () => {
    const base = conRecua();
    const yo = base.jugadores[UNO];
    if (yo === undefined) throw new Error('falta el jugador');
    const sinVer = {
      ...base,
      jugadores: { ...base.jugadores, [UNO]: { ...yo, conocimiento: {} } },
    };
    expect(motivos({ ...CLAVE, tipo: 'regalo', comarca: 'prueba-costa' }, sinVer)).toContain(
      'todavia no sabes nada',
    );
  });

  it('un jugador que no esta en la partida no da ordenes', () => {
    const forma = validarIntencion({ ...CLAVE, tipo: 'roturar', comarca: 'prueba-llano' });
    expect(forma.ok).toBe(true);
    if (!forma.ok) return;
    const orden = construirOrden(forma.valor, contexto(conRecua(), 'fantasma' as never));
    expect(orden.ok).toBe(false);
  });
});

describe('el motor acepta lo que se construye', () => {
  it.each(UNA_DE_CADA)('%s', (_nombre, dato) => {
    const estado = conRecua();
    const orden = construir({ ...CLAVE, ...dato }, estado);
    expect(() => turno(estado, [orden])).not.toThrow();
    const resultado = turno(estado, [orden]);
    // La orden entra en el estado del turno siguiente o se cumple y se retira: nunca se pierde en silencio.
    expect(resultado.sucesos.some((s) => s.tipo === 'orden.alta')).toBe(true);
    expect(de(resultado.estado, 'recua-1')).toBeDefined();
  });
});
