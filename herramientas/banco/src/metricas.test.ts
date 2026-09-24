// Lo que mide el banco (ficha T-048 §4.1 y §4.2), pieza a pieza y con casos reducidos.
//
// Son las regresiones de los tres errores que la revision del 19-09-2026 encontro en el
// instrumento: contar solo donde acaba el turno una unidad, llamar arbitraje a cualquier compra y
// venta sueltas, y contar como racha de mercado los turnos en que la plaza ni siquiera abre.
import { describe, expect, it } from 'vitest';

import { RECURSOS, explicar, limitesDePrecio, validarMundo } from '@conquer/nucleo';
import type {
  EstadoMercado,
  EstadoPartida,
  IdJugador,
  Mundo,
  Recursos,
  Suceso,
} from '@conquer/nucleo';

import { estadoMini, mundoMini, tablasMini } from '../../../paquetes/nucleo/pruebas/mundo-mini.ts';
import { Registro } from './metricas.ts';
import { LibroDeNegocios, tratoDeSuceso } from './negocios.ts';
import { SUCESOS_DE_ENTRADA, pasoDelTurno } from './visitas.ts';

const REGLAS = tablasMini();

function recursos(cantidades: Partial<Recursos> = {}): Recursos {
  const base = { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 };
  return { ...base, ...cantidades };
}

function suceso(tipo: string, datos: Record<string, number | string>, comarca?: string): Suceso {
  return {
    orden: 1,
    fase: 'mercado',
    tipo,
    jugador: 'casa-uno' as IdJugador,
    comarca: (comarca ?? null) as Suceso['comarca'],
    datos,
  };
}

function trato(
  operacion: 'comprar' | 'vender',
  mercado: string,
  cantidad: number,
  importe: number,
  comision = 0,
  recua = 'recua-1',
): Suceso {
  return suceso('mercado.trato', {
    mercado,
    recua,
    recurso: 'lana',
    operacion,
    cantidad,
    precioMil: 1000,
    importe,
    comision,
    via: 'orden',
  });
}

// ——— Visitas ——————————————————————————————————————————————————————————————

describe('las comarcas que se pisan de paso', () => {
  it('cuentan las entradas de recuas y rebaños y la posición de cada unidad', () => {
    const inicial = estadoMini();
    const ahora: EstadoPartida = {
      ...inicial,
      rebanyos: {
        'rebanyo-1': {
          id: 'rebanyo-1' as never,
          jugador: 'casa-uno' as IdJugador,
          nombre: 'Rebaño',
          situacion: { donde: 'comarca', comarca: 'prueba-monte' as never },
          ruta: [],
          cabezas: 100,
          pastoDelAnyoMil: 0,
          turnosSinPasto: 0,
        },
      },
    };
    const pisadas = pasoDelTurno(ahora, ['prueba-vega', 'prueba-rio'] as never);
    expect([...pisadas].sort()).toEqual(['prueba-monte', 'prueba-rio', 'prueba-vega']);
  });

  it('los dos sucesos de entrada son los de recuas y rebaños', () => {
    expect(SUCESOS_DE_ENTRADA).toEqual(['recua.entra', 'rebanyo.entra']);
  });

  it('la recua cuenta sus entradas por los sucesos, y llegan al registro', () => {
    const registro = new Registro(REGLAS, mundoMini(), 1);
    const estado = { ...estadoMini(), turno: 2 };
    registro.empezar(estadoMini());
    registro.anotar(
      estado,
      [
        {
          orden: 1,
          fase: 'movimiento',
          tipo: 'recua.entra',
          jugador: 'casa-uno' as IdJugador,
          comarca: 'prueba-monte' as never,
          datos: { recua: 'recua-1' },
        },
      ],
      new Map(),
    );
    const partida = registro.cerrar(estado, 'prueba', 1);
    expect(partida.comarcasTocadas).toContain('prueba-monte');
    expect(partida.comarcasDelMapa).toEqual(Object.keys(mundoMini().comarcas).sort());
  });
});

// ——— Arbitraje ————————————————————————————————————————————————————————————

describe('la traza del arbitraje', () => {
  it('cuenta un negocio cuando la mercancía comprada se vende en otra plaza', () => {
    const libro = new LibroDeNegocios(REGLAS);
    libro.anotarTrato(1, tratoDe(trato('comprar', 'local-a', 10, 100, 2)));
    libro.anotarTrato(3, tratoDe(trato('vender', 'local-b', 10, 200, 4)));
    const traza = libro.trazaDe('casa-uno');
    expect(traza.negocios).toHaveLength(1);
    expect(traza.negocios[0]).toMatchObject({
      cargas: 10,
      plazaDeCompra: 'local-a',
      turnoDeCompra: 1,
      plazaDeVenta: 'local-b',
      turnoDeVenta: 3,
      costeDeCompra: 102,
      ingresoDeVenta: 196,
      margen: 94,
    });
    expect(traza.ventasSinCompra).toEqual([]);
  });

  it('una venta anterior a la compra no es un negocio: no había nada que vender', () => {
    const libro = new LibroDeNegocios(REGLAS);
    libro.anotarTrato(1, tratoDe(trato('vender', 'local-b', 5, 100)));
    libro.anotarTrato(2, tratoDe(trato('comprar', 'local-a', 5, 40)));
    const traza = libro.trazaDe('casa-uno');
    expect(traza.negocios).toEqual([]);
    expect(traza.ventasSinCompra).toHaveLength(1);
    expect(traza.ventasSinCompra[0]?.cargas).toBe(5);
  });

  it('la mercancía propia no se atribuye a una compra: se publica aparte', () => {
    const libro = new LibroDeNegocios(REGLAS);
    libro.anotarTrato(1, tratoDe(trato('comprar', 'local-a', 4, 40)));
    libro.anotarTrato(2, tratoDe(trato('vender', 'local-b', 10, 200)));
    const traza = libro.trazaDe('casa-uno');
    expect(traza.negocios).toHaveLength(1);
    expect(traza.negocios[0]?.cargas).toBe(4);
    expect(traza.ventasSinCompra[0]?.cargas).toBe(6);
  });

  it('lo que se descarga en casa ya no se puede vender veinte turnos después', () => {
    const libro = new LibroDeNegocios(REGLAS);
    libro.anotarTrato(1, tratoDe(trato('comprar', 'local-a', 10, 100)));
    libro.ajustarCarga('casa-uno', 'recua-1', recursos({ lana: 0 }));
    libro.anotarTrato(20, tratoDe(trato('vender', 'local-b', 10, 300)));
    const traza = libro.trazaDe('casa-uno');
    expect(traza.negocios).toEqual([]);
    expect(traza.cargasDescargadas).toBe(10);
    expect(traza.ventasSinCompra[0]?.cargas).toBe(10);
  });

  it('vender donde se compró es una reventa, no arbitraje', () => {
    const libro = new LibroDeNegocios(REGLAS);
    libro.anotarTrato(1, tratoDe(trato('comprar', 'local-a', 3, 30)));
    libro.anotarTrato(2, tratoDe(trato('vender', 'local-a', 3, 45)));
    const traza = libro.trazaDe('casa-uno');
    expect(traza.negocios).toEqual([]);
    expect(traza.reventas).toHaveLength(1);
  });

  it('el bastimento del viaje lo paga la mercancía que va encima', () => {
    const libro = new LibroDeNegocios(REGLAS);
    libro.anotarTrato(1, tratoDe(trato('comprar', 'local-a', 10, 100)));
    libro.anotarBastimento('casa-uno', 'recua-1', 6, 0);
    libro.anotarTrato(3, tratoDe(trato('vender', 'local-b', 10, 200)));
    const negocio = libro.trazaDe('casa-uno').negocios[0];
    expect(negocio?.bastimento).toEqual({ pan: 6, sal: 0 });
    expect(negocio?.margenNeto).toBeLessThan(negocio?.margen ?? 0);
  });

  it('el bastimento de una recua que no lleva nada comprado no se le carga a ningún negocio', () => {
    const libro = new LibroDeNegocios(REGLAS);
    libro.anotarBastimento('casa-uno', 'recua-1', 4, 1);
    expect(libro.trazaDe('casa-uno').bastimentoSinCarga).toEqual({ pan: 4, sal: 1 });
  });

  it('solo son tratos los sucesos de mercado con cantidad', () => {
    expect(tratoDeSuceso(suceso('recua.avanza', { andadoMil: 1000 }))).toBeNull();
    expect(tratoDeSuceso(trato('comprar', 'local-a', 0, 0))).toBeNull();
    expect(tratoDeSuceso(trato('comprar', 'local-a', 2, 20))?.recurso).toBe('lana');
  });
});

function tratoDe(suceso: Suceso) {
  const trato = tratoDeSuceso(suceso);
  if (trato === null) throw new Error('el suceso no es un trato');
  return trato;
}

// ——— Precios ——————————————————————————————————————————————————————————————

/** El mundo mini con una feria en el llano, abierta solo en los turnos del anyo que se le digan. */
function mundoConFeria(turnos: readonly number[] | null): Mundo {
  const base = mundoMini();
  const crudo = JSON.parse(JSON.stringify(base)) as {
    comarcas: Record<string, { ferias: unknown[]; rasgos: string[] }>;
  };
  const llano = crudo.comarcas['prueba-llano'];
  if (llano === undefined) throw new Error('falta prueba-llano');
  if (turnos !== null && !llano.rasgos.includes('villa-de-feria'))
    llano.rasgos.push('villa-de-feria');
  llano.ferias =
    turnos === null
      ? []
      : [
          {
            id: 'feria-prueba',
            nombre: 'Feria de Prueba',
            turnos: [...turnos],
            volumen: 'pequenya',
            recursosDestacados: [],
          },
        ];
  const resultado = validarMundo(crudo);
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  return resultado.valor;
}

function mercadoEnElSuelo(id: string, tipo: 'local' | 'feria'): EstadoMercado {
  const preciosMil = {} as Record<(typeof RECURSOS)[number], number>;
  for (const recurso of RECURSOS) {
    preciosMil[recurso] = limitesDePrecio(
      REGLAS.recursos[recurso].precioBaseMil,
      REGLAS.mercado,
    ).sueloMil;
  }
  const ultimoVolumen = {} as Record<(typeof RECURSOS)[number], number>;
  for (const recurso of RECURSOS) ultimoVolumen[recurso] = 0;
  return {
    id: id as never,
    comarca: 'prueba-llano' as never,
    tipo,
    volumen: 'pequenya',
    preciosMil,
    ultimoVolumen,
  };
}

/** Juega `turnos` turnos sin sucesos, con los mercados dados clavados en el suelo. */
function rachaDe(mundo: Mundo, mercados: Record<string, EstadoMercado>, turnos: number): number {
  const registro = new Registro(REGLAS, mundo, 1);
  const base = estadoMini();
  const llano = base.comarcas['prueba-llano'];
  if (llano === undefined) throw new Error('falta prueba-llano');
  const inicial = {
    ...base,
    comarcas: { ...base.comarcas, 'prueba-llano': { ...llano, edificios: { mercado: 1 } } },
    mercados,
  };
  registro.empezar(inicial);
  let ultimo = inicial;
  for (let t = 1; t <= turnos; t += 1) {
    ultimo = { ...inicial, turno: t + 1 };
    registro.anotar(ultimo, [], new Map());
  }
  return registro.cerrar(ultimo, 'prueba', turnos).preciosPegados[0]?.turnos ?? 0;
}

describe('las rachas de precio', () => {
  it('una plaza local abierta siempre acumula todos sus turnos', () => {
    const mundo = mundoConFeria(null);
    const racha = rachaDe(
      mundo,
      { 'local-prueba-llano': mercadoEnElSuelo('local-prueba-llano', 'local') },
      6,
    );
    expect(racha).toBe(6);
  });

  it('la feria que no abre rompe la racha: no cuenta su precio almacenado', () => {
    // La feria abre en los turnos 1 y 2 del año (el máximo que admite el mundo); del 3 al 8 no.
    const mundo = mundoConFeria([1, 2]);
    const racha = rachaDe(
      mundo,
      { 'feria-feria-prueba': mercadoEnElSuelo('feria-feria-prueba', 'feria') },
      8,
    );
    expect(racha).toBe(2);
  });
});

// ——— Ordenes e hitos ——————————————————————————————————————————————————————

describe('el recuento de órdenes y los turnos de los hitos', () => {
  it('separa lo propuesto de lo que entra, termina, espera o se cancela, con su motivo', () => {
    const registro = new Registro(REGLAS, mundoMini(), 1);
    const inicial = estadoMini();
    registro.empezar(inicial);
    const estado = { ...inicial, turno: 2 };
    const sucesos: Suceso[] = [
      suceso('orden.alta', { orden: 'o1', clase: 'construir' }),
      suceso('orden.estado', { orden: 'o1', clase: 'construir', estado: 'terminada', motivo: '' }),
      suceso('orden.estado', {
        orden: 'o2',
        clase: 'construir',
        estado: 'cancelada',
        motivo: 'sin-solar',
      }),
      suceso('orden.estado', {
        orden: 'o3',
        clase: 'mercado',
        estado: 'en espera',
        motivo: 'sin-plaza',
      }),
    ];
    registro.anotar(
      estado,
      sucesos,
      new Map([
        [
          'casa-uno',
          {
            ordenes: ['o1', 'o2', 'o3'],
            porTipo: { construir: 2, mercado: 1 },
            enMarcha: 0,
            motivos: [],
          },
        ],
      ]),
    );
    const jugador = registro.cerrar(estado, 'prueba', 1).jugadores[0];
    const fila = jugador?.filas[0];
    expect(fila?.ordenesPropuestas).toBe(3);
    // La cancelada no trabaja: quedan dos útiles, y con ellas el turno sirvió de algo.
    expect(fila?.ordenesUtiles).toBe(2);
    expect(fila?.sinDecisionUtil).toBe(false);
    expect(fila?.sinOrdenes).toBe(false);
    expect(fila?.ordenesDeAlta).toBe(1);
    expect(fila?.ordenesTerminadas).toBe(1);
    expect(fila?.ordenesCanceladas).toBe(1);
    expect(fila?.ordenesEnEspera).toBe(1);
    expect(jugador?.cancelacionesPorMotivo).toEqual({ 'construir: sin-solar': 1 });
    expect(jugador?.esperasPorMotivo).toEqual({ 'mercado: sin-plaza': 1 });
  });

  it('el turno de cada hito sale del estado, y «no logrado» es null y no cero', () => {
    const registro = new Registro(REGLAS, mundoMini(), 1);
    const inicial = estadoMini();
    registro.empezar(inicial);
    const jugador = inicial.jugadores['casa-uno'];
    if (jugador === undefined) throw new Error('falta el jugador');
    const estado: EstadoPartida = {
      ...inicial,
      turno: 2,
      jugadores: { 'casa-uno': { ...jugador, hitos: { 'pequenyo-dominio': 64 } } },
    };
    registro.anotar(estado, [], new Map());
    const medido = registro.cerrar(estado, 'prueba', 1).jugadores[0];
    expect(medido?.hitos['pequenyo-dominio']).toBe(64);
    expect(medido?.hitos['maestro-de-obra']).toBeNull();
    expect(medido?.primeraObraMayor).toBeNull();
  });

  it('la primera obra mayor es el turno en que termina, no el número de obras', () => {
    const registro = new Registro(REGLAS, mundoMini(), 1);
    const inicial = estadoMini();
    registro.empezar(inicial);
    let estado = inicial;
    for (let t = 1; t <= 3; t += 1) {
      estado = { ...inicial, turno: t + 1 };
      const sucesos =
        t === 2 ? [suceso('obra.termina', { obra: 'obra-1', clase: 'obra mayor' })] : [];
      registro.anotar(estado, sucesos, new Map());
    }
    expect(registro.cerrar(estado, 'prueba', 3).jugadores[0]?.primeraObraMayor).toBe(2);
  });
});
