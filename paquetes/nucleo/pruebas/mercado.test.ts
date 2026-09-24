// Mercados, ferias y formacion de precios (T-037): la casacion como funcion pura y la fase 7 entera.
import { describe, expect, it } from 'vitest';

import { aplicar } from '../src/cambios.ts';
import { crearContexto } from '../src/contexto.ts';
import { MERCADO } from '../src/datos/mercado.ts';
import { DATOS_DE_RECURSOS } from '../src/datos/recursos.ts';
import type { EntradaDePlaza, LineaDePlaza } from '../src/reglas/mercado.ts';
import {
  casarPlaza,
  costeDeCompra,
  importeDeCompra,
  importeDeVenta,
  maximoComprable,
} from '../src/reglas/mercado.ts';
import { limitesDeMenores } from '../src/reglas/mercaderesMenores.ts';
import { limitesDePrecio, nivelAlcanzadoMil } from '../src/reglas/precios.ts';
import { jornadasAdministrativasMil, jornadasDesde } from '../src/reglas/administracion.ts';
import type { EstadoComarca, EstadoPartida, Recua } from '../src/tipos/estado.ts';
import type { IdFeria, IdJugador, IdMercado, IdRecua } from '../src/tipos/ids.ts';
import { idDeMercadoDeFeria, idDeMercadoLocal } from '../src/tipos/ids.ts';
import type { Mundo, VolumenFeria } from '../src/tipos/mundo.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import type { Recurso } from '../src/tipos/recursos.ts';
import { RECURSOS_COMERCIABLES } from '../src/tipos/recursos.ts';
import type { TablasDeReglas } from '../src/tipos/reglas.ts';
import { azarDeTexto } from '../src/utiles/azar.ts';
import { hash32 } from '../src/utiles/huella.ts';
import { validarOrdenEntrante } from '../src/validacion/validarOrden.ts';
import {
  DOS,
  PRIMAVERA,
  UNO,
  base,
  c,
  de,
  escenario,
  mundo,
  ordenRuta,
  parada,
  recua,
  recursos,
  reglas,
  tipos,
  turno,
} from './recuas.ts';

const lana = DATOS_DE_RECURSOS.lana;

// ——— La casacion, sin estado ni fases —————————————————————————————————————

function linea(clave: string, cambios: Partial<LineaDePlaza>): LineaDePlaza {
  return {
    clave,
    jugador: clave,
    operacion: 'vender',
    cantidad: 10,
    limiteMil: 40000,
    fondos: 100000,
    comisionMil: 20,
    ...cambios,
  };
}

function entrada(
  lineas: readonly LineaDePlaza[],
  cambios: Partial<EntradaDePlaza> = {},
): EntradaDePlaza {
  return {
    precioMil: 50000,
    recurso: lana,
    tope: 40,
    lineas,
    tabla: MERCADO,
    desempate: (jugador) => hash32(`prueba|${jugador}`),
    ...cambios,
  };
}

const sinMenores = { ...MERCADO, liquidezMercaderesMenoresMil: 0 };

function delResultado(resultado: ReturnType<typeof casarPlaza>, clave: string) {
  const encontrada = resultado.lineas.find((l) => l.clave === clave);
  if (encontrada === undefined) throw new Error(`falta la linea ${clave}`);
  return encontrada;
}

describe('importes y comision', () => {
  it('el que vende cobra a la baja y el que compra paga al alza', () => {
    expect(importeDeVenta(3, 1500)).toBe(4);
    expect(importeDeCompra(3, 1500)).toBe(5);
    expect(importeDeVenta(4, 1500)).toBe(6);
    expect(importeDeCompra(4, 1500)).toBe(6);
  });

  it('el coste de una compra suma importe y comision', () => {
    expect(costeDeCompra(20, 50000, 20)).toEqual({ importe: 1000, comision: 20, total: 1020 });
  });

  it('lo maximo que se puede comprar con unos fondos sale del coste con comision', () => {
    // A 50 mrs la carga y un 2 % caben 5 cargas con 260 mrs (255) pero no 6 (306).
    expect(maximoComprable(10, 260, 50000, 20)).toBe(5);
    expect(maximoComprable(3, 260, 50000, 20)).toBe(3);
    expect(maximoComprable(10, 0, 50000, 20)).toBe(0);
  });
});

describe('casarPlaza', () => {
  it('un jugador que vende solo se lo vende a los menores, con el precio ya movido por su venta', () => {
    const resultado = casarPlaza(entrada([linea('a', { cantidad: 20 })]));
    // Demanda 40 (menores) y oferta 20 + 40: desequilibrio -200, precio 45000 + regresion 500.
    expect(resultado).toMatchObject({
      precioAnteriorMil: 50000,
      precioMil: 45500,
      demanda: 40,
      oferta: 60,
      desequilibrioMil: -200,
      cupoDeMenores: 40,
      menoresCompran: 20,
      menoresVenden: 0,
      volumen: 20,
    });
    expect(delResultado(resultado, 'a')).toEqual({
      clave: 'a',
      casada: 20,
      conJugadores: 0,
      conMenores: 20,
      importe: 910,
      comision: 18,
      motivo: null,
    });
  });

  it('si el precio se mueve por debajo de su minimo, la venta no se cierra y dice por que', () => {
    const resultado = casarPlaza(entrada([linea('a', { cantidad: 20, limiteMil: 48000 })]));
    expect(resultado.precioMil).toBe(45500);
    expect(delResultado(resultado, 'a')).toMatchObject({ casada: 0, motivo: 'precio-limite' });
  });

  it('un comprador y un vendedor de la misma cantidad se casan entre ellos y sin menores', () => {
    const resultado = casarPlaza(
      entrada([
        linea('vende', { cantidad: 30, limiteMil: 40000 }),
        linea('compra', { operacion: 'comprar', cantidad: 30, limiteMil: 70000 }),
      ]),
    );
    expect(resultado.precioMil).toBe(50000);
    expect(resultado.menoresCompran + resultado.menoresVenden).toBe(0);
    expect(delResultado(resultado, 'vende')).toMatchObject({
      casada: 30,
      conJugadores: 30,
      importe: 1500,
      comision: 30,
    });
    expect(delResultado(resultado, 'compra')).toMatchObject({
      casada: 30,
      conJugadores: 30,
      importe: 1500,
      comision: 30,
    });
    expect(resultado.volumen).toBe(30);
  });

  it('el lado largo se reparte en proporcion a lo pedido', () => {
    const resultado = casarPlaza(
      entrada(
        [
          linea('a', { cantidad: 60 }),
          linea('b', { cantidad: 30 }),
          linea('compra', { operacion: 'comprar', cantidad: 45, limiteMil: 70000 }),
        ],
        { tope: 100, tabla: sinMenores },
      ),
    );
    expect(delResultado(resultado, 'a').casada).toBe(30);
    expect(delResultado(resultado, 'b').casada).toBe(15);
    expect(delResultado(resultado, 'compra').casada).toBe(45);
    // Lo que no se cierra sin menores es por falta de contraparte.
    expect(delResultado(resultado, 'a').motivo).toBe('sin-contraparte');
  });

  it('el sobrante de un redondeo va al que ofrece mejor precio', () => {
    const resultado = casarPlaza(
      entrada(
        [
          linea('a', { cantidad: 10, limiteMil: 42000 }),
          linea('b', { cantidad: 10, limiteMil: 41000 }),
          linea('c', { cantidad: 10, limiteMil: 43000 }),
          linea('compra', { operacion: 'comprar', cantidad: 10, limiteMil: 70000 }),
        ],
        { tope: 100, tabla: sinMenores },
      ),
    );
    // 10 entre tres son 3,33 cada uno: sobra una carga y es del que vende mas barato.
    expect(delResultado(resultado, 'b').casada).toBe(4);
    expect(delResultado(resultado, 'a').casada).toBe(3);
    expect(delResultado(resultado, 'c').casada).toBe(3);
  });

  it('a igualdad de precio, el sobrante va al de menor huella y no al primero que llego', () => {
    const lineas = ['a', 'b', 'c'].map((clave) => linea(clave, { cantidad: 10 }));
    const compra = linea('compra', { operacion: 'comprar', cantidad: 10, limiteMil: 70000 });
    for (const ganador of ['a', 'b', 'c']) {
      const resultado = casarPlaza(
        entrada([...lineas, compra], {
          tope: 100,
          tabla: sinMenores,
          desempate: (jugador) => (jugador === ganador ? 0 : 1),
        }),
      );
      expect(delResultado(resultado, ganador).casada).toBe(4);
    }
  });

  it('la plaza no absorbe mas que su tope de volumen', () => {
    const resultado = casarPlaza(
      entrada(
        [
          linea('vende', { cantidad: 200, limiteMil: 1000 }),
          linea('compra', { operacion: 'comprar', cantidad: 200, limiteMil: 90000 }),
        ],
        { tope: 40 },
      ),
    );
    expect(delResultado(resultado, 'vende').casada).toBe(40);
    expect(delResultado(resultado, 'compra').casada).toBe(40);
    expect(delResultado(resultado, 'vende').motivo).toBe('volumen-de-plaza');
  });

  it('el comprador solo compra lo que le alcanza para pagar con su comision', () => {
    const resultado = casarPlaza(
      entrada([
        linea('compra', { operacion: 'comprar', cantidad: 10, limiteMil: 90000, fondos: 260 }),
      ]),
    );
    const compra = delResultado(resultado, 'compra');
    // La compra empuja el precio arriba (un 10 %), y con 260 mrs solo llegan cuatro cargas.
    expect(compra.casada).toBe(4);
    expect(compra.importe + compra.comision).toBeLessThanOrEqual(260);
    expect(compra.motivo).toBe('sin-fondos');
  });

  it('con mucho comercio entre jugadores los menores casi desaparecen', () => {
    const resultado = casarPlaza(
      entrada(
        [
          linea('vende', { cantidad: 40, limiteMil: 1000 }),
          linea('compra', { operacion: 'comprar', cantidad: 40, limiteMil: 90000 }),
        ],
        { tope: 40 },
      ),
    );
    expect(resultado.cupoDeMenores).toBe(0);
    expect(resultado.menoresCompran + resultado.menoresVenden).toBe(0);
  });

  it('con la plaza fuera de la banda de los menores, solo actua el que sujeta el precio', () => {
    const limites = limitesDeMenores(lana.precioBaseMil, MERCADO);
    // Con el precio por debajo del base los menores compran y no venden.
    const abajo = casarPlaza(
      entrada([linea('vende', { cantidad: 10, limiteMil: 1000 })], { precioMil: 40000 }),
    );
    expect(abajo.precioAnteriorMil).toBeLessThan(limites.vendeDesdeMil);
    expect(abajo.menoresCompran).toBe(10);
    // Y por encima venden y no compran: un vendedor no encuentra a quien vender. El precio tiene que
    // partir de mas arriba: su propia venta lo baja un 15 % y, en la banda, los menores volverian.
    const arriba = casarPlaza(
      entrada([linea('vende', { cantidad: 10, limiteMil: 1000 })], { precioMil: 80000 }),
    );
    expect(arriba.precioAnteriorMil).toBeGreaterThan(limites.compraHastaMil);
    expect(arriba.menoresCompran).toBe(0);
    expect(delResultado(arriba, 'vende')).toMatchObject({ casada: 0, motivo: 'sin-contraparte' });
  });

  it('sin lineas, el precio solo regresa al base', () => {
    const resultado = casarPlaza(entrada([], { precioMil: 45000 }));
    expect(resultado.desequilibrioMil).toBe(0);
    expect(resultado.precioMil).toBe(45500);
    expect(resultado.volumen).toBe(0);
  });
});

describe('propiedades de la casacion', () => {
  function aleatoria(azar: ReturnType<typeof azarDeTexto>): EntradaDePlaza {
    const recurso = DATOS_DE_RECURSOS[azar.elegir(RECURSOS_COMERCIABLES)];
    const { sueloMil, techoMil } = limitesDePrecio(recurso.precioBaseMil, MERCADO);
    // La mitad de los casos parten cerca del base, donde los menores comercian por los dos lados.
    const cerca = azar.entero(2) === 0;
    const precioMil = cerca
      ? azar.entreInclusive(
          Math.floor((recurso.precioBaseMil * 85) / 100),
          Math.floor((recurso.precioBaseMil * 115) / 100),
        )
      : azar.entreInclusive(sueloMil, techoMil);
    const cuantas = azar.entreInclusive(0, 8);
    const lineas: LineaDePlaza[] = [];
    for (let i = 0; i < cuantas; i += 1) {
      const compra = azar.entero(2) === 0;
      lineas.push({
        clave: `l${String(i)}`,
        jugador: `j${String(azar.entero(3))}`,
        operacion: compra ? 'comprar' : 'vender',
        cantidad: azar.entreInclusive(0, 90),
        limiteMil: azar.entreInclusive(
          Math.floor((precioMil * 6) / 10),
          Math.floor((precioMil * 14) / 10),
        ),
        fondos: azar.entreInclusive(0, 6000),
        comisionMil: azar.elegir([0, 10, 20]),
      });
    }
    return {
      precioMil,
      recurso,
      tope: azar.elegir([40, 120, 320]),
      lineas,
      tabla: { ...MERCADO, liquidezMercaderesMenoresMil: azar.elegir([0, 500, 1000]) },
      desempate: (jugador) => hash32(`azar|${jugador}`),
    };
  }

  it('respeta limites, fondos, tope y conservacion en 5 000 casaciones al azar', () => {
    const azar = azarDeTexto('casacion-propiedad');
    for (let caso = 0; caso < 5000; caso += 1) {
      const e = aleatoria(azar);
      const r = casarPlaza(e);
      const limites = limitesDeMenores(e.recurso.precioBaseMil, e.tabla);
      let vendidoConJugadores = 0;
      let compradoConJugadores = 0;
      let vendidoConMenores = 0;
      let compradoConMenores = 0;
      for (const l of e.lineas) {
        const res = delResultado(r, l.clave);
        expect(res.casada).toBe(res.conJugadores + res.conMenores);
        expect(res.casada).toBeLessThanOrEqual(l.cantidad);
        if (res.casada > 0) {
          // Nadie compra por encima de su maximo ni vende por debajo de su minimo.
          if (l.operacion === 'vender') expect(r.precioMil).toBeGreaterThanOrEqual(l.limiteMil);
          else expect(r.precioMil).toBeLessThanOrEqual(l.limiteMil);
        }
        if (l.operacion === 'vender') {
          vendidoConJugadores += res.conJugadores;
          vendidoConMenores += res.conMenores;
        } else {
          // Con lo que paga y la comision no se pasa de sus fondos.
          expect(res.importe + res.comision).toBeLessThanOrEqual(l.fondos);
          compradoConJugadores += res.conJugadores;
          compradoConMenores += res.conMenores;
        }
      }
      // Nada se crea ni se pierde: lo que un jugador vende a otro lo compra el otro.
      expect(vendidoConJugadores).toBe(compradoConJugadores);
      expect(r.menoresCompran).toBe(vendidoConMenores);
      expect(r.menoresVenden).toBe(compradoConMenores);
      // Ni los jugadores ni los menores pasan del tope ni del cupo de los menores.
      expect(vendidoConJugadores + vendidoConMenores).toBeLessThanOrEqual(e.tope);
      expect(compradoConJugadores + compradoConMenores).toBeLessThanOrEqual(e.tope);
      expect(vendidoConMenores).toBeLessThanOrEqual(r.cupoDeMenores);
      expect(compradoConMenores).toBeLessThanOrEqual(r.cupoDeMenores);
      // Los menores solo comercian dentro de su banda de precios.
      if (vendidoConMenores > 0) expect(r.precioMil).toBeLessThanOrEqual(limites.compraHastaMil);
      if (compradoConMenores > 0) expect(r.precioMil).toBeGreaterThanOrEqual(limites.vendeDesdeMil);
      // El precio no se mueve mas de un 15 % ni sale de la horquilla.
      const { sueloMil, techoMil } = limitesDePrecio(e.recurso.precioBaseMil, e.tabla);
      expect(Math.abs(r.precioMil - e.precioMil)).toBeLessThanOrEqual(
        Math.floor((e.precioMil * e.tabla.movimientoMaximoPorTurnoMil) / 1000),
      );
      expect(r.precioMil).toBeGreaterThanOrEqual(sueloMil);
      expect(r.precioMil).toBeLessThanOrEqual(techoMil);
    }
  });

  it('barajar las lineas no cambia el resultado (1 000 casaciones al azar)', () => {
    const azar = azarDeTexto('casacion-orden');
    for (let caso = 0; caso < 1000; caso += 1) {
      const e = aleatoria(azar);
      const esperado = JSON.stringify(casarPlaza(e));
      for (let vez = 0; vez < 3; vez += 1) {
        const barajada = { ...e, lineas: azar.barajar(e.lineas) };
        expect(JSON.stringify(casarPlaza(barajada))).toBe(esperado);
      }
    }
  });
});

// ——— La fase 7 —————————————————————————————————————————————————————————————

const FERIA = 'feria-prueba' as IdMercado;
const LOCAL = idDeMercadoLocal(c('prueba-llano'));

/** El mundo mini con una feria de prueba (en la vega, si no se dice otra), abierta en los turnos dados. */
function mundoConFeria(
  volumen: VolumenFeria = 'grande',
  turnos: readonly number[] = [PRIMAVERA],
  donde = 'prueba-vega',
): Mundo {
  const sede = mundo.comarcas[donde];
  if (sede === undefined) throw new Error('el mundo mini ha cambiado');
  return {
    ...mundo,
    comarcas: {
      ...mundo.comarcas,
      [donde]: {
        ...sede,
        ferias: [
          {
            id: 'prueba' as IdFeria,
            nombre: 'Feria de Prueba',
            turnos,
            volumen,
            recursosDestacados: [],
          },
        ],
      },
    },
  };
}

function conMercadoLocal(estado: EstadoPartida): EstadoPartida {
  const llano = estado.comarcas['prueba-llano'] as EstadoComarca;
  return {
    ...estado,
    comarcas: {
      ...estado.comarcas,
      'prueba-llano': { ...llano, edificios: { ...llano.edificios, mercado: 1 } },
    },
  };
}

function tratante(
  id: string,
  donde: string,
  carga: Partial<Recua['carga']>,
  cambios: Partial<Recua> = {},
): Recua {
  return recua(id, {
    situacion: { donde: 'comarca', comarca: c(donde) },
    cometido: 'tratar',
    porte: 400,
    carga: recursos(carga),
    ...cambios,
  });
}

function ordenDeMercado(
  turnoDeAlta: number,
  recuaId: string,
  mercado: IdMercado,
  recurso: Recurso,
  operacion: 'comprar' | 'vender',
  cantidad: number,
  precioLimiteMil: number,
  cambios: { jugador?: IdJugador; turnosTotales?: number } = {},
): Orden {
  return {
    ...base(turnoDeAlta),
    jugador: cambios.jugador ?? UNO,
    turnosTotales: cambios.turnosTotales ?? 1,
    tipo: 'mercado',
    mercado,
    recua: recuaId as IdRecua,
    recurso,
    operacion,
    cantidad,
    precioLimiteMil,
  };
}

const SIN_MENORES: TablasDeReglas = { ...reglas, mercado: sinMenores };

function mercadoDe(estado: EstadoPartida, id: IdMercado) {
  const encontrado = estado.mercados[id];
  if (encontrado === undefined) throw new Error(`falta el mercado ${id}`);
  return encontrado;
}

function suceso(
  sucesos: ReturnType<typeof turno>['sucesos'],
  tipo: string,
  filtro: Record<string, unknown> = {},
) {
  return sucesos.filter(
    (s) =>
      s.tipo === tipo &&
      Object.entries(filtro).every(([k, v]) => (s.datos as Record<string, unknown>)[k] === v),
  );
}

/**
 * El precio base de un recurso en una comarca, escrito otra vez a mano (T-052 §4.1): el del
 * catalogo por el factor de abundancia del potencial que lo produce.
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

describe('las plazas', () => {
  it('un mercado nace la primera vez que se abre su plaza, con todos los recursos a su precio base', () => {
    const estado = conMercadoLocal(escenario());
    const { estado: despues, sucesos } = turno(estado);
    const mercado = mercadoDe(despues, LOCAL);
    expect(mercado).toMatchObject({ comarca: 'prueba-llano', tipo: 'local', volumen: 'pequenya' });
    for (const r of RECURSOS_COMERCIABLES) {
      expect(mercado.preciosMil[r]).toBe(baseEn('prueba-llano', r));
      expect(mercado.ultimoVolumen[r]).toBe(0);
    }
    expect(suceso(sucesos, 'mercado.abre')).toHaveLength(1);
  });

  it('sin edificio de mercado ni feria abierta no hay ningun mercado', () => {
    const { estado } = turno(escenario());
    expect(Object.keys(estado.mercados)).toEqual([]);
    const cerrada = turno(escenario(), [], reglas, mundoConFeria('grande', [PRIMAVERA + 1]));
    expect(Object.keys(cerrada.estado.mercados)).toEqual([]);
  });

  it('una feria abre solo en sus turnos y su mercado se queda, con el precio volviendo al base', () => {
    const elMundo = mundoConFeria('grande', [PRIMAVERA]);
    const abierta = turno(escenario(), [], reglas, elMundo).estado;
    expect(mercadoDe(abierta, FERIA)).toMatchObject({
      tipo: 'feria',
      volumen: 'grande',
      comarca: 'prueba-vega',
    });
    expect(idDeMercadoDeFeria('prueba' as IdFeria)).toBe(FERIA);

    // Cerrada la feria, el mercado sigue en el estado y solo el precio vuelve hacia el base.
    const hundido = {
      ...abierta,
      mercados: {
        [FERIA]: {
          ...mercadoDe(abierta, FERIA),
          preciosMil: { ...mercadoDe(abierta, FERIA).preciosMil, lana: 42500 },
          ultimoVolumen: { ...mercadoDe(abierta, FERIA).ultimoVolumen, lana: 7 },
        },
      },
    };
    const cerrada = turno(hundido, [], reglas, elMundo);
    // Vuelve un 10 % de la distancia a **su** base: la lana mira al pasto, y prueba-vega es
    // pasto 2, el nivel corriente, asi que su base es el del catalogo (T-052).
    const baseDeLaVega = baseEn('prueba-vega', 'lana');
    expect(baseDeLaVega).toBe(45000);
    expect(mercadoDe(cerrada.estado, FERIA).preciosMil.lana).toBe(
      42500 + Math.floor((baseDeLaVega - 42500) / 10),
    );
    expect(mercadoDe(cerrada.estado, FERIA).ultimoVolumen.lana).toBe(0);
    expect(suceso(cerrada.sucesos, 'mercado.precio')).toHaveLength(0);
  });

  it('una comarca con feria y mercado local comercia en la feria mientras esta abierta', () => {
    const estado = conMercadoLocal(
      escenario({
        recuas: [
          recua('recua-1', {
            carga: recursos({ lana: 10, pan: 20 }),
            situacion: { donde: 'comarca', comarca: c('prueba-vega') },
          }),
        ],
      }),
    );
    const ruta = ordenRuta(estado.turno, 'recua-1', [
      parada('prueba-llano', { vender: { lana: { cantidad: 10, precioMinimoMil: 30000 } } }),
    ]);
    const conFeria = turno(
      estado,
      [ruta],
      reglas,
      mundoConFeria('grande', [PRIMAVERA], 'prueba-llano'),
    );
    expect(suceso(conFeria.sucesos, 'mercado.trato')[0]?.datos).toMatchObject({ mercado: FERIA });
    expect(Object.keys(conFeria.estado.mercados).sort()).toEqual([FERIA, LOCAL]);
    // Cerrada la feria, la misma parada comercia en el mercado local.
    const sinFeria = turno(
      estado,
      [ruta],
      reglas,
      mundoConFeria('grande', [PRIMAVERA + 1], 'prueba-llano'),
    );
    expect(suceso(sinFeria.sucesos, 'mercado.trato')[0]?.datos).toMatchObject({ mercado: LOCAL });
  });
});

describe('las paradas de una ruta', () => {
  function ventaEnLaFeria(elMundo: Mundo, tablas: TablasDeReglas = reglas) {
    const estado = escenario({ recuas: [recua('recua-1', { carga: recursos({ lana: 30 }) })] });
    const ruta = ordenRuta(estado.turno, 'recua-1', [
      parada('prueba-vega', { vender: { lana: { cantidad: 30, precioMinimoMil: 30000 } } }),
    ]);
    return turno(estado, [ruta], tablas, elMundo);
  }

  it('la recua que llega a una parada vende en la feria, cobra y paga la comision del 1 %', () => {
    const { estado, sucesos } = ventaEnLaFeria(mundoConFeria());
    // Demanda 320 y oferta 350: el precio cae un 2 % sobre el base de prueba-vega, que con el
    // pasto que alcanza es 45000 (T-054). 30 cargas son 1323 mrs, con 13 de comision.
    expect(de(estado, 'recua-1')).toMatchObject({ enParada: 0 });
    expect(de(estado, 'recua-1').carga).toMatchObject({ lana: 0, maravedis: 1310 });
    const tratos = suceso(sucesos, 'mercado.trato');
    expect(tratos).toHaveLength(1);
    expect(tratos[0]).toMatchObject({
      jugador: UNO,
      comarca: 'prueba-vega',
      datos: {
        mercado: FERIA,
        recua: 'recua-1',
        recurso: 'lana',
        operacion: 'vender',
        cantidad: 30,
        precioMil: 44109,
        importe: 1323,
        comision: 13,
        conJugadores: 0,
        conMenores: 30,
        via: 'parada',
      },
    });
    // La comision sale como un cambio de la carga, con su motivo.
    const comision = suceso(sucesos, 'recua.carga', { motivo: 'comision' });
    expect(comision).toHaveLength(1);
    expect(comision[0]?.datos).toMatchObject({ delta: -13, total: 1310 });
    expect(mercadoDe(estado, FERIA)).toMatchObject({
      preciosMil: { lana: 44109 },
      ultimoVolumen: { lana: 30 },
    });
  });

  it('en el mercado local la comision es la de la casa: el 2 %', () => {
    const estado = conMercadoLocal(
      escenario({
        recuas: [
          recua('recua-1', {
            carga: recursos({ lana: 30, pan: 20 }),
            situacion: { donde: 'comarca', comarca: c('prueba-vega') },
          }),
        ],
      }),
    );
    const ruta = ordenRuta(estado.turno, 'recua-1', [
      parada('prueba-llano', { vender: { lana: { cantidad: 30, precioMinimoMil: 30000 } } }),
    ]);
    const { estado: despues, sucesos } = turno(estado, [ruta]);
    // Plaza pequenya: demanda 40 y oferta 70, sobre el base de prueba-llano, que con el pasto
    // que alcanza es 40000 (T-054). 30 cargas son 1053 mrs y el 2 % de comision son 21.
    expect(suceso(sucesos, 'mercado.trato')[0]?.datos).toMatchObject({
      mercado: LOCAL,
      cantidad: 30,
      precioMil: 35104,
      importe: 1053,
      comision: 21,
    });
    expect(de(despues, 'recua-1').carga).toMatchObject({ lana: 0, maravedis: 1053 - 21 });
  });

  it('comprar paga el importe al alza y la comision, y mete la mercancia en la recua', () => {
    const estado = escenario({
      recuas: [recua('recua-1', { carga: recursos({ maravedis: 1000 }) })],
    });
    const ruta = ordenRuta(estado.turno, 'recua-1', [
      parada('prueba-vega', { comprar: { lana: { cantidad: 8, precioMaximoMil: 90000 } } }),
    ]);
    const { estado: despues, sucesos } = turno(estado, [ruta], reglas, mundoConFeria());
    // Demanda 8 + 320 y oferta 320: 45243. 8 cargas: 362 mrs (al alza) y 3 de comision del 1 %.
    const trato = suceso(sucesos, 'mercado.trato')[0]?.datos;
    expect(trato).toMatchObject({
      operacion: 'comprar',
      precioMil: 45243,
      importe: 362,
      comision: 3,
    });
    expect(de(despues, 'recua-1').carga).toMatchObject({ lana: 8, maravedis: 1000 - 362 - 3 });
  });

  it('una parada donde no hay plaza abierta no comercia y el turno lo dice', () => {
    const estado = escenario({ recuas: [recua('recua-1', { carga: recursos({ lana: 30 }) })] });
    const ruta = ordenRuta(estado.turno, 'recua-1', [
      parada('prueba-vega', { vender: { lana: { cantidad: 30, precioMinimoMil: 30000 } } }),
    ]);
    const { estado: despues, sucesos } = turno(estado, [ruta]);
    expect(de(despues, 'recua-1').carga.lana).toBe(30);
    expect(suceso(sucesos, 'mercado.sin-plaza')).toHaveLength(1);
    expect(suceso(sucesos, 'mercado.trato')).toHaveLength(0);
  });

  it('no se vende lo que la recua no lleva: se casa lo que hay y se avisa', () => {
    const estado = escenario({ recuas: [recua('recua-1', { carga: recursos({ lana: 5 }) })] });
    const ruta = ordenRuta(estado.turno, 'recua-1', [
      parada('prueba-vega', { vender: { lana: { cantidad: 30, precioMinimoMil: 30000 } } }),
    ]);
    const { estado: despues, sucesos } = turno(estado, [ruta], reglas, mundoConFeria());
    expect(de(despues, 'recua-1').carga.lana).toBe(0);
    expect(suceso(sucesos, 'mercado.sin-casar')[0]?.datos).toMatchObject({
      pedido: 30,
      casado: 5,
      motivo: 'sin-carga',
    });
  });

  it('un precio limite por encima del mercado deja la venta sin casar', () => {
    const estado = escenario({ recuas: [recua('recua-1', { carga: recursos({ lana: 30 }) })] });
    const ruta = ordenRuta(estado.turno, 'recua-1', [
      parada('prueba-vega', { vender: { lana: { cantidad: 30, precioMinimoMil: 60000 } } }),
    ]);
    const { estado: despues, sucesos } = turno(estado, [ruta], reglas, mundoConFeria());
    expect(de(despues, 'recua-1').carga.lana).toBe(30);
    expect(suceso(sucesos, 'mercado.sin-casar')[0]?.datos).toMatchObject({ casado: 0 });
    expect(suceso(sucesos, 'mercado.trato')).toHaveLength(0);
  });
});

describe('las ordenes de mercado', () => {
  const elMundo = mundoConFeria('grande', [PRIMAVERA, PRIMAVERA + 1, PRIMAVERA + 2]);

  function escenarioLocal(carga: Partial<Recua['carga']>, cambios: Partial<Recua> = {}) {
    return conMercadoLocal(
      escenario({ recuas: [tratante('recua-1', 'prueba-llano', carga, cambios)] }),
    );
  }

  it('una recua quieta que trata cumple su orden en el mercado local', () => {
    const estado = escenarioLocal({ lana: 20 });
    const orden = ordenDeMercado(estado.turno, 'recua-1', LOCAL, 'lana', 'vender', 20, 30000);
    const { estado: despues, sucesos } = turno(estado, [orden]);
    // Cae con la propia venta sobre el base de prueba-llano (40000): 20 cargas son 728 mrs y el
    // 2 % de comision son 14.
    expect(de(despues, 'recua-1').carga).toMatchObject({ lana: 0, maravedis: 714 });
    expect(suceso(sucesos, 'mercado.trato')[0]?.datos).toMatchObject({
      via: 'orden',
      comision: 14,
    });
    // La orden se ha cumplido entera y sale del estado.
    expect(despues.ordenes).toHaveLength(0);
  });

  it('lo que no se casa queda vigente con lo que falta, y caduca al acabarse sus turnos', () => {
    const estado = escenarioLocal({ lana: 100 });
    const orden = ordenDeMercado(estado.turno, 'recua-1', LOCAL, 'lana', 'vender', 100, 30000, {
      turnosTotales: 2,
    });
    const primero = turno(estado, [orden]);
    // El tope de una plaza local son 40 cargas por turno: quedan 60.
    expect(de(primero.estado, 'recua-1').carga.lana).toBe(60);
    expect(primero.estado.ordenes).toHaveLength(1);
    expect(primero.estado.ordenes[0]).toMatchObject({
      cantidad: 60,
      turnosHechos: 1,
      estado: 'pendiente',
    });
    expect(suceso(primero.sucesos, 'mercado.sin-casar')[0]?.datos).toMatchObject({
      pedido: 100,
      casado: 40,
      motivo: 'volumen-de-plaza',
    });

    const segundo = turno(primero.estado);
    expect(de(segundo.estado, 'recua-1').carga.lana).toBe(20);
    // Se le acaban los dos turnos con 20 cargas sin casar: caduca y lo dice.
    expect(segundo.estado.ordenes).toHaveLength(0);
    expect(suceso(segundo.sucesos, 'mercado.orden-caduca')[0]?.datos).toMatchObject({ sobra: 20 });
  });

  it('una orden con turnos de sobra sigue hasta casarse entera', () => {
    let estado = escenarioLocal({ lana: 100 });
    estado = turno(estado, [
      ordenDeMercado(estado.turno, 'recua-1', LOCAL, 'lana', 'vender', 100, 30000, {
        turnosTotales: 5,
      }),
    ]).estado;
    let turnos = 1;
    while (estado.ordenes.length > 0 && turnos < 10) {
      estado = turno(estado).estado;
      turnos += 1;
    }
    expect(de(estado, 'recua-1').carga.lana).toBe(0);
    expect(turnos).toBeLessThanOrEqual(5);
  });

  it('espera si la feria no esta abierta y arranca sola cuando abre', () => {
    const estado = escenario({
      turno: PRIMAVERA - 1,
      recuas: [tratante('recua-1', 'prueba-vega', { lana: 10 })],
    });
    const orden = ordenDeMercado(estado.turno, 'recua-1', FERIA, 'lana', 'vender', 10, 30000);
    const primero = turno(estado, [orden], reglas, elMundo);
    expect(primero.estado.ordenes[0]).toMatchObject({
      estado: 'en espera',
      motivoEspera: 'plaza-cerrada',
    });
    expect(de(primero.estado, 'recua-1').carga.lana).toBe(10);

    const segundo = turno(primero.estado, [], reglas, elMundo);
    expect(de(segundo.estado, 'recua-1').carga.lana).toBe(0);
    expect(segundo.estado.ordenes).toHaveLength(0);
  });

  it.each([
    {
      caso: 'la recua esta en otra comarca',
      laRecua: tratante('recua-1', 'prueba-llano', { lana: 10 }),
      motivo: 'recua-lejos',
    },
    {
      caso: 'la recua no trata',
      laRecua: tratante('recua-1', 'prueba-vega', { lana: 10 }, { cometido: null }),
      motivo: 'recua-sin-cometido',
    },
  ])('espera si $caso', ({ laRecua, motivo }) => {
    const estado = escenario({ recuas: [laRecua] });
    const orden = ordenDeMercado(estado.turno, 'recua-1', FERIA, 'lana', 'vender', 10, 30000);
    const { estado: despues } = turno(estado, [orden], reglas, elMundo);
    expect(despues.ordenes[0]).toMatchObject({ estado: 'en espera', motivoEspera: motivo });
  });

  it('espera mientras la recua sigue de ruta, aunque se detenga en la plaza', () => {
    const estado = escenario({
      recuas: [tratante('recua-1', 'prueba-llano', { sal: 1 }, { cometido: 'tratar' })],
    });
    // Se detiene en la vega (con algo que vender) y aun le queda el rio: su orden espera.
    const ruta = ordenRuta(estado.turno, 'recua-1', [
      parada('prueba-vega', { vender: { sal: { cantidad: 1, precioMinimoMil: 1000 } } }),
      'prueba-rio',
    ]);
    const orden = ordenDeMercado(estado.turno, 'recua-1', FERIA, 'lana', 'vender', 10, 30000);
    const { estado: despues } = turno(estado, [ruta, orden], reglas, elMundo);
    expect(de(despues, 'recua-1')).toMatchObject({ enParada: 0 });
    expect(despues.ordenes.find((o) => o.tipo === 'mercado')).toMatchObject({
      estado: 'en espera',
      motivoEspera: 'recua-en-ruta',
    });
  });

  it.each([
    {
      caso: 'la recua no existe',
      recuaId: 'recua-9',
      mercado: FERIA,
      recurso: 'lana',
      motivo: 'recua-desconocida',
    },
    {
      caso: 'el mercado no existe',
      recuaId: 'recua-1',
      mercado: 'feria-inventada',
      recurso: 'lana',
      motivo: 'mercado-desconocido',
    },
    {
      caso: 'el mercado local es de una comarca que no existe',
      recuaId: 'recua-1',
      mercado: 'local-nada',
      recurso: 'lana',
      motivo: 'mercado-desconocido',
    },
    {
      caso: 'se pide comerciar con maravedis',
      recuaId: 'recua-1',
      mercado: FERIA,
      recurso: 'maravedis',
      motivo: 'no-se-comercia-con-maravedis',
    },
  ] as const)('se cancela si $caso', ({ recuaId, mercado, recurso, motivo }) => {
    const estado = escenario({ recuas: [tratante('recua-1', 'prueba-vega', { lana: 10 })] });
    const orden = ordenDeMercado(
      estado.turno,
      recuaId,
      mercado as IdMercado,
      recurso,
      'vender',
      10,
      30000,
    );
    const { estado: despues, sucesos } = turno(estado, [orden], reglas, elMundo);
    expect(despues.ordenes).toHaveLength(0);
    expect(suceso(sucesos, 'orden.estado', { estado: 'cancelada', motivo })).toHaveLength(1);
  });

  it('la orden de otro jugador sobre una recua ajena se cancela: no se comercia con lo de otro', () => {
    const estado = escenario({
      conDos: true,
      recuas: [tratante('recua-1', 'prueba-vega', { lana: 10 })],
    });
    const orden = ordenDeMercado(estado.turno, 'recua-1', FERIA, 'lana', 'vender', 10, 30000, {
      jugador: DOS,
    });
    const { estado: despues, sucesos } = turno(estado, [orden], reglas, elMundo);
    expect(despues.ordenes).toHaveLength(0);
    expect(de(despues, 'recua-1').carga.lana).toBe(10);
    expect(suceso(sucesos, 'orden.estado', { motivo: 'recua-desconocida' })).toHaveLength(1);
  });

  it('comprar respeta el porte de la recua: no se compra lo que no cabe', () => {
    const estado = escenario({
      recuas: [tratante('recua-1', 'prueba-vega', { maravedis: 5000, pan: 3 }, { porte: 5 })],
    });
    const orden = ordenDeMercado(estado.turno, 'recua-1', FERIA, 'lana', 'comprar', 20, 90000);
    const { estado: despues, sucesos } = turno(estado, [orden], reglas, elMundo);
    expect(de(despues, 'recua-1').carga.lana).toBe(2);
    expect(suceso(sucesos, 'mercado.sin-casar')[0]?.datos).toMatchObject({
      motivo: 'sin-espacio',
      casado: 2,
    });
  });

  it('varias ordenes de una misma recua no prometen mas de lo que lleva', () => {
    const estado = escenario({ recuas: [tratante('recua-1', 'prueba-vega', { lana: 15 })] });
    const ordenes = [
      ordenDeMercado(estado.turno, 'recua-1', FERIA, 'lana', 'vender', 10, 30000),
      ordenDeMercado(estado.turno, 'recua-1', FERIA, 'lana', 'vender', 10, 30000),
    ];
    const { estado: despues } = turno(estado, ordenes, reglas, elMundo);
    expect(de(despues, 'recua-1').carga.lana).toBe(0);
  });
});

describe('jugadores que comercian entre si', () => {
  it('el vendedor y el comprador se casan al precio de la plaza, sin menores y cada uno con su comision', () => {
    const estado = escenario({
      conDos: true,
      recuas: [
        tratante('recua-1', 'prueba-vega', { lana: 30 }),
        tratante('recua-2', 'prueba-vega', { maravedis: 3000 }, { jugador: DOS }),
      ],
    });
    const ordenes = [
      ordenDeMercado(estado.turno, 'recua-1', FERIA, 'lana', 'vender', 30, 40000),
      ordenDeMercado(estado.turno, 'recua-2', FERIA, 'lana', 'comprar', 30, 70000, {
        jugador: DOS,
      }),
    ];
    const { estado: despues, sucesos } = turno(estado, ordenes, reglas, mundoConFeria());
    // Demanda y oferta empatan (30 y 30 mas 290 de menores a cada lado): el precio no se mueve
    // de su base, que es el del catalogo porque prueba-vega es pasto 2 (T-052).
    expect(mercadoDe(despues, FERIA).preciosMil.lana).toBe(baseEn('prueba-vega', 'lana'));
    expect(de(despues, 'recua-1').carga).toMatchObject({ lana: 0, maravedis: 1350 - 13 });
    expect(de(despues, 'recua-2').carga).toMatchObject({ lana: 30, maravedis: 3000 - 1350 - 13 });
    for (const t of suceso(sucesos, 'mercado.trato')) {
      expect(t.datos).toMatchObject({ conJugadores: 30, conMenores: 0 });
    }
  });

  it('barajar las ordenes de los dos jugadores no cambia el resultado', () => {
    const estado = escenario({
      conDos: true,
      recuas: [
        tratante('recua-1', 'prueba-vega', { lana: 90, hierro: 10 }),
        tratante('recua-2', 'prueba-vega', { maravedis: 5000, lana: 10 }, { jugador: DOS }),
      ],
    });
    const ordenes = [
      ordenDeMercado(estado.turno, 'recua-1', FERIA, 'lana', 'vender', 60, 30000),
      ordenDeMercado(estado.turno, 'recua-1', FERIA, 'hierro', 'vender', 10, 10000),
      ordenDeMercado(estado.turno, 'recua-2', FERIA, 'lana', 'comprar', 45, 70000, {
        jugador: DOS,
      }),
      ordenDeMercado(estado.turno, 'recua-2', FERIA, 'lana', 'vender', 10, 30000, { jugador: DOS }),
    ];
    const elMundo = mundoConFeria();
    const esperada = turno(estado, ordenes, SIN_MENORES, elMundo).estado.huellaTurnoAnterior;
    const azar = azarDeTexto('barajar-mercado');
    for (let i = 0; i < 8; i += 1) {
      expect(
        turno(estado, azar.barajar(ordenes), SIN_MENORES, elMundo).estado.huellaTurnoAnterior,
      ).toBe(esperada);
    }
  });

  it('con la liquidez de los menores a cero, un vendedor solo no encuentra comprador', () => {
    const estado = escenario({ recuas: [tratante('recua-1', 'prueba-vega', { lana: 30 })] });
    const orden = ordenDeMercado(estado.turno, 'recua-1', FERIA, 'lana', 'vender', 30, 30000);
    const { estado: despues, sucesos } = turno(estado, [orden], SIN_MENORES, mundoConFeria());
    expect(de(despues, 'recua-1').carga.lana).toBe(30);
    expect(suceso(sucesos, 'mercado.sin-casar')[0]?.datos).toMatchObject({
      motivo: 'sin-contraparte',
    });
  });
});

describe('una venta masiva de lana en una feria', () => {
  const dosTurnos = [PRIMAVERA, PRIMAVERA + 1, PRIMAVERA + 2];

  function ventaMasiva(tablas: TablasDeReglas) {
    const elMundo = mundoConFeria('grande', dosTurnos);
    const estado = escenario({ recuas: [tratante('recua-1', 'prueba-vega', { lana: 300 })] });
    const orden = ordenDeMercado(estado.turno, 'recua-1', FERIA, 'lana', 'vender', 300, 20000);
    let actual = turno(estado, [orden], tablas, elMundo).estado;
    const precios = [mercadoDe(actual, FERIA).preciosMil.lana];
    for (let i = 0; i < 12; i += 1) {
      actual = turno(actual, [], tablas, elMundo).estado;
      precios.push(mercadoDe(actual, FERIA).preciosMil.lana);
    }
    return { precios, estado: actual };
  }

  it('con menores hunde el precio un 13,5 % y se recupera en el turno siguiente', () => {
    const { precios, estado } = ventaMasiva(reglas);
    // Turno 1: 300 cargas contra un cupo de 320 hunden el precio hasta 43250, y se venden todas.
    // El base de prueba-vega es el del catalogo, porque es pasto 2 (T-052).
    const baseDeLaVega = baseEn('prueba-vega', 'lana');
    expect(precios[0]).toBe(38925);
    expect(de(estado, 'recua-1').carga.lana).toBe(0);
    // Turno 2: los menores solo compran (el precio esta bajo el 90 % del base) y lo suben hasta
    // donde deja el recorte del 15 % por turno: 43250 mas 6487.
    expect(precios[1]).toBe(44763);
    // Y vuelve al base sin pasarse.
    expect(precios.slice(2).every((p) => p >= 44763 && p <= baseDeLaVega)).toBe(true);
    expect(precios.at(-1)).toBeGreaterThan(44900);
  });

  it('sin menores nadie compra la lana, el precio cae un 13,5 % y tarda en volver', () => {
    const { precios } = ventaMasiva(SIN_MENORES);
    expect(precios[0]).toBe(38925);
    // Sin colchon, la recuperacion es la regresion sola: un 10 % de la distancia cada turno.
    expect(precios[1]).toBe(39532);
    for (let i = 1; i < precios.length; i += 1) {
      expect(precios[i]).toBeGreaterThan(precios[i - 1] ?? 0);
    }
    // Diez turnos despues solo ha recuperado dos tercios de lo perdido.
    expect(precios[10]).toBeLessThan(43200);
    expect(precios[10]).toBeGreaterThan(42300);
  });
});

describe('determinismo y validacion', () => {
  it('el mismo turno con el mismo estado da la misma huella', () => {
    const estado = conMercadoLocal(
      escenario({ recuas: [tratante('recua-1', 'prueba-llano', { lana: 100 })] }),
    );
    const orden = ordenDeMercado(estado.turno, 'recua-1', LOCAL, 'lana', 'vender', 100, 30000, {
      turnosTotales: 3,
    });
    const a = turno(estado, [orden]).estado.huellaTurnoAnterior;
    expect(turno(estado, [orden]).estado.huellaTurnoAnterior).toBe(a);
  });

  const ordenValida = () => ({
    ...ordenDeMercado(1, 'recua-1', FERIA, 'lana', 'vender', 10, 30000),
  });

  it('una orden de mercado bien formada valida', () => {
    expect(validarOrdenEntrante(ordenValida()).ok).toBe(true);
  });

  it('una orden de mercado sin recua, con coste o con mas de un anyo de vigencia no valida', () => {
    expect(validarOrdenEntrante({ ...ordenValida(), recua: undefined }).ok).toBe(false);
    const conCoste = { ...ordenValida(), coste: recursos({ maravedis: 5 }) };
    const rechazada = validarOrdenEntrante(conCoste);
    expect(rechazada.ok).toBe(false);
    if (!rechazada.ok) expect(rechazada.errores[0]?.mensaje).toMatch(/coste es cero/);
    expect(validarOrdenEntrante({ ...ordenValida(), turnosTotales: 0 }).ok).toBe(false);
    expect(validarOrdenEntrante({ ...ordenValida(), turnosTotales: 25 }).ok).toBe(false);
  });

  it('los maravedis no se comercian: ni una orden ni una parada pueden pedirlo', () => {
    expect(validarOrdenEntrante({ ...ordenValida(), recurso: 'maravedis' }).ok).toBe(false);
    const ruta = ordenRuta(1, 'recua-1', [
      parada('prueba-vega', { vender: { maravedis: { cantidad: 5, precioMinimoMil: 1000 } } }),
    ]);
    expect(validarOrdenEntrante(ruta).ok).toBe(false);
  });
});

describe('cambios del mercado', () => {
  function contexto() {
    return crearContexto(escenario(), [], mundoConFeria(), reglas);
  }

  it('un mercado nuevo no puede repetir identificador ni estar en una comarca que no existe', () => {
    const ctx = contexto();
    const alta = {
      id: FERIA,
      comarca: c('prueba-vega'),
      tipo: 'feria',
      volumen: 'grande',
      preciosMil: recursos({ lana: 50000 }),
      ultimoVolumen: recursos(),
    } as const;
    aplicar(ctx, { tipo: 'mercado-alta', mercado: alta });
    expect(() => {
      aplicar(ctx, { tipo: 'mercado-alta', mercado: alta });
    }).toThrow(/Ya hay un mercado/);
    expect(() => {
      aplicar(ctx, {
        tipo: 'mercado-alta',
        mercado: { ...alta, id: 'feria-x' as IdMercado, comarca: c('nada') },
      });
    }).toThrow(/ninguna comarca/);
  });

  it('un precio fuera de la horquilla, el de los maravedis o un volumen negativo rompen el invariante', () => {
    const ctx = contexto();
    aplicar(ctx, {
      tipo: 'mercado-alta',
      mercado: {
        id: FERIA,
        comarca: c('prueba-vega'),
        tipo: 'feria',
        volumen: 'grande',
        preciosMil: recursos({ lana: 50000 }),
        ultimoVolumen: recursos(),
      },
    });
    const precio =
      (recurso: Recurso, precioMil: number, volumen = 0) =>
      () => {
        aplicar(ctx, { tipo: 'mercado-precio', mercado: FERIA, recurso, precioMil, volumen });
      };
    // El suelo y el techo se miden sobre el base de **esta** plaza (T-052 y T-054): la lana de
    // prueba-vega alcanza pasto 3, asi que su base es 45000.
    expect(precio('lana', 17999)).toThrow(/entre 18000 y 112500/);
    expect(precio('lana', 112501)).toThrow(/entre 18000 y 112500/);
    expect(precio('maravedis', 1000)).toThrow();
    expect(precio('lana', 50000, -1)).toThrow();
    expect(precio('lana', 42500, 7)).not.toThrow();
    expect(ctx.estado.mercados[FERIA]?.preciosMil.lana).toBe(42500);
    expect(() => {
      aplicar(ctx, {
        tipo: 'mercado-precio',
        mercado: 'feria-nada' as IdMercado,
        recurso: 'lana',
        precioMil: 50000,
        volumen: 0,
      });
    }).toThrow(/ningun mercado/);
  });

  it('la cantidad de una orden solo baja y solo en las ordenes de mercado', () => {
    const estado = escenario({ recuas: [tratante('recua-1', 'prueba-vega', { lana: 10 })] });
    const orden = ordenDeMercado(estado.turno, 'recua-1', FERIA, 'lana', 'vender', 10, 30000);
    const otra = base(estado.turno);
    const ctx = crearContexto(estado, [], mundoConFeria(), reglas);
    aplicar(ctx, { tipo: 'orden-alta', orden });
    aplicar(ctx, {
      tipo: 'orden-alta',
      orden: { ...otra, tipo: 'roturar', comarca: c('prueba-llano') },
    });
    aplicar(ctx, { tipo: 'orden-cantidad', orden: orden.id, cantidad: 4 });
    expect(() => {
      aplicar(ctx, { tipo: 'orden-cantidad', orden: orden.id, cantidad: 5 });
    }).toThrow(/no puede quedar/);
    expect(() => {
      aplicar(ctx, { tipo: 'orden-cantidad', orden: orden.id, cantidad: -1 });
    }).toThrow();
    expect(() => {
      aplicar(ctx, { tipo: 'orden-cantidad', orden: otra.id, cantidad: 0 });
    }).toThrow();
  });
});

describe('el resto de las fases no se altera', () => {
  it('sin mercados ni ferias, la fase 7 no toca el estado ni deja sucesos', () => {
    const estado = escenario();
    const { estado: despues, sucesos } = turno(estado);
    expect(despues.mercados).toEqual({});
    expect(tipos(sucesos).filter((t) => t.startsWith('mercado.'))).toEqual([]);
  });
});
