// Movimiento de recuas (T-033): paso, avance por varias comarcas, nieve, bastimento, ordenes de
// recua y la independencia del orden en que llegan.
import { describe, expect, it } from 'vitest';

import { bastimentoDe } from '../src/reglas/bastimento.ts';
import { avanzar, pasoDeRecua } from '../src/reglas/movimiento.ts';
import type { EstadoJugador, EstadoPartida, Recua, SituacionMovil } from '../src/tipos/estado.ts';
import type { IdComarca, IdJugador, IdRecua } from '../src/tipos/ids.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import type { TablasDeReglas } from '../src/tipos/reglas.ts';
import { azarDeTexto } from '../src/utiles/azar.ts';
import { estadoMini } from './mundo-mini.ts';
import {
  DOS,
  INVIERNO,
  UNO,
  VERANO,
  base,
  c,
  de,
  escenario,
  ordenCarga,
  ordenFormar,
  ordenRuta,
  recua,
  recursos,
  reglas,
  tipos,
  turno,
} from './recuas.ts';

function conPaso(extraMil: number): TablasDeReglas {
  const casas = { ...reglas.casas };
  casas.mesta = {
    ...casas.mesta,
    modificadores: { ...casas.mesta.modificadores, pasoRecuaMil: extraMil },
  };
  return { ...reglas, casas };
}

describe('el paso', () => {
  const sin = { barro: false, calzada: false, pasoCasaMil: 0 };

  it('son tres jornadas; una menos cargada a tope o con barro, una mas por calzada', () => {
    expect(pasoDeRecua(recua('r'), sin, reglas)).toBe(3000);
    const cargada = recua('r', { carga: recursos({ pan: 8 }) });
    expect(pasoDeRecua(cargada, sin, reglas)).toBe(2000);
    // Los maravedis no pesan.
    expect(pasoDeRecua(recua('r', { carga: recursos({ maravedis: 900 }) }), sin, reglas)).toBe(
      3000,
    );
    expect(pasoDeRecua(recua('r'), { ...sin, barro: true }, reglas)).toBe(2000);
    expect(pasoDeRecua(recua('r'), { ...sin, calzada: true }, reglas)).toBe(4000);
    expect(pasoDeRecua(recua('r'), { ...sin, pasoCasaMil: 1000 }, reglas)).toBe(4000);
  });

  it('nunca baja de una jornada por turno', () => {
    const lenta = { ...reglas, movimiento: { ...reglas.movimiento, pasoBaseMil: 1500 } };
    const cargada = recua('r', { carga: recursos({ pan: 10 }) });
    expect(pasoDeRecua(cargada, { ...sin, barro: true }, lenta)).toBe(1000);
  });
});

describe('el avance', () => {
  const coste = (): number => 1500;

  it('cruza varias comarcas en un turno si el paso da', () => {
    const avance = avanzar(
      { donde: 'comarca', comarca: c('a') },
      [c('b'), c('c'), c('d')],
      false,
      4000,
      coste,
    );
    expect(avance.entradas).toEqual(['b', 'c']);
    expect(avance.situacion).toEqual({
      donde: 'camino',
      desde: 'c',
      hasta: 'd',
      jornadasHechasMil: 1000,
    });
    expect(avance.ruta).toEqual(['d']);
    expect(avance.andadoMil).toBe(4000);
  });

  it('para al llegar y solo cuenta lo andado', () => {
    const avance = avanzar({ donde: 'comarca', comarca: c('a') }, [c('b')], false, 4000, coste);
    expect(avance.situacion).toEqual({ donde: 'comarca', comarca: 'b' });
    expect(avance.ruta).toEqual([]);
    expect(avance.andadoMil).toBe(1500);
  });

  it('en ruta circular vuelve a empezar y no para', () => {
    const avance = avanzar(
      { donde: 'comarca', comarca: c('a') },
      [c('b'), c('a')],
      true,
      4000,
      coste,
    );
    expect(avance.entradas).toEqual(['b', 'a']);
    expect(avance.ruta).toEqual(['b', 'a']);
    expect(avance.situacion).toEqual({
      donde: 'camino',
      desde: 'a',
      hasta: 'b',
      jornadasHechasMil: 1000,
    });
  });

  it('no entra en un tramo cerrado, y si la nieve la pilla dentro, vuelve', () => {
    const cerrado = (desde: IdComarca, hasta: IdComarca) =>
      desde === 'b' && hasta === 'c' ? ('cerrado' as const) : 1500;
    const ante = avanzar(
      { donde: 'comarca', comarca: c('a') },
      [c('b'), c('c')],
      false,
      3000,
      cerrado,
    );
    expect(ante.situacion).toEqual({ donde: 'comarca', comarca: 'b' });
    expect(ante.cerrado).toEqual({ desde: 'b', hasta: 'c' });
    expect(ante.andadoMil).toBe(1500);

    const dentro: SituacionMovil = {
      donde: 'camino',
      desde: c('b'),
      hasta: c('c'),
      jornadasHechasMil: 500,
    };
    const vuelve = avanzar(dentro, [c('c')], false, 3000, cerrado);
    expect(vuelve).toMatchObject({ retrocede: true, andadoMil: 0, ruta: ['c'] });
    expect(vuelve.situacion).toEqual({ donde: 'comarca', comarca: 'b' });
  });
});

describe('el bastimento', () => {
  it('dos panes por jornada, truncados, y sal en verano por cada cuatro jornadas o fraccion', () => {
    expect(bastimentoDe(3000, 'primavera', reglas)).toEqual({ pan: 6, sal: 0 });
    expect(bastimentoDe(2700, 'otonyo', reglas)).toEqual({ pan: 5, sal: 0 });
    expect(bastimentoDe(3000, 'verano', reglas)).toEqual({ pan: 6, sal: 1 });
    expect(bastimentoDe(4001, 'verano', reglas)).toEqual({ pan: 8, sal: 2 });
    expect(bastimentoDe(0, 'verano', reglas)).toEqual({ pan: 0, sal: 0 });
  });

  it('en comarca propia sale del almacen; fuera, de la carga', () => {
    const enCasa = recua('recua-1', { ruta: [c('prueba-vega')] });
    const r1 = turno(escenario({ recuas: [enCasa] }));
    // Del llano a la vega son 2 jornadas: 4 panes del almacen.
    const pan = r1.sucesos.filter(
      (s) => s.fase === 'movimiento' && s.tipo === 'almacen.cambio' && s.datos['recurso'] === 'pan',
    );
    expect(pan.map((s) => s.datos['delta'])).toEqual([-4]);

    const fuera = recua('recua-1', {
      situacion: { donde: 'comarca', comarca: c('prueba-vega') },
      ruta: [c('prueba-rio')],
      carga: recursos({ pan: 9 }),
    });
    const r2 = turno(escenario({ recuas: [fuera] }));
    expect(de(r2.estado, 'recua-1').carga.pan).toBe(5);
  });

  it('en verano gasta sal de conservas', () => {
    const fuera = recua('recua-1', {
      situacion: { donde: 'comarca', comarca: c('prueba-vega') },
      ruta: [c('prueba-rio'), c('prueba-costa')],
      carga: recursos({ pan: 9, sal: 2 }),
    });
    const { estado } = turno(escenario({ turno: VERANO, recuas: [fuera] }));
    // Va cargada (11 de 10 cargas): anda 2 jornadas, 4 panes y una carga de sal.
    expect(de(estado, 'recua-1').carga).toMatchObject({ pan: 5, sal: 1 });
  });

  it('sin bastimento: aviso y parada; despues pierde acemilas y malvive al paso minimo', () => {
    let estado = escenario({
      recuas: [
        recua('recua-1', {
          situacion: { donde: 'comarca', comarca: c('prueba-vega') },
          ruta: [c('prueba-rio'), c('prueba-costa')],
        }),
      ],
    });
    const primero = turno(estado);
    estado = primero.estado;
    expect(tipos(primero.sucesos)).toContain('recua.sin-bastimento');
    expect(de(estado, 'recua-1')).toMatchObject({
      acemilas: 10,
      avisadaSinBastimento: true,
      situacion: { donde: 'comarca', comarca: 'prueba-vega' },
    });

    const segundo = turno(estado);
    estado = segundo.estado;
    expect(de(estado, 'recua-1')).toMatchObject({ acemilas: 9, porte: 9 });
    expect(de(estado, 'recua-1').situacion).toEqual({
      donde: 'camino',
      desde: 'prueba-vega',
      hasta: 'prueba-rio',
      jornadasHechasMil: 1000,
    });

    estado = turno(estado).estado;
    expect(de(estado, 'recua-1')).toMatchObject({ acemilas: 8 });
    expect(de(estado, 'recua-1').situacion).toEqual({ donde: 'comarca', comarca: 'prueba-rio' });
  });

  it('una recua nunca se queda sin su ultima acemila', () => {
    let estado = escenario({
      recuas: [
        recua('recua-1', {
          acemilas: 1,
          porte: 1,
          avisadaSinBastimento: true,
          situacion: { donde: 'comarca', comarca: c('prueba-vega') },
          ruta: [c('prueba-rio')],
        }),
      ],
    });
    estado = turno(estado).estado;
    expect(de(estado, 'recua-1').acemilas).toBe(1);
  });
});

describe('la nieve', () => {
  it('una recua no entra en un puerto cerrado: espera y lo dice', () => {
    const r = recua('recua-1', {
      situacion: { donde: 'comarca', comarca: c('prueba-sierra') },
      ruta: [c('prueba-mina')],
      carga: recursos({ pan: 20 }),
    });
    const { estado, sucesos } = turno(escenario({ turno: INVIERNO, recuas: [r] }));
    expect(de(estado, 'recua-1').situacion).toEqual({ donde: 'comarca', comarca: 'prueba-sierra' });
    expect(de(estado, 'recua-1').carga.pan).toBe(20);
    expect(sucesos.find((s) => s.tipo === 'recua.detenida')?.datos).toMatchObject({
      motivo: 'puerto-cerrado',
      puerto: 'Puerto de Prueba',
    });
  });

  it('si la nieve la pilla a medio puerto, vuelve a la comarca de salida', () => {
    const r = recua('recua-1', {
      situacion: {
        donde: 'camino',
        desde: c('prueba-sierra'),
        hasta: c('prueba-mina'),
        jornadasHechasMil: 2000,
      },
      ruta: [c('prueba-mina')],
    });
    const { estado, sucesos } = turno(escenario({ turno: INVIERNO, recuas: [r] }));
    expect(de(estado, 'recua-1').situacion).toEqual({ donde: 'comarca', comarca: 'prueba-sierra' });
    expect(tipos(sucesos)).toContain('recua.vuelve-por-nieve');
  });
});

describe('las ordenes de recua', () => {
  it('formar crea la recua, paga su coste y se lleva a los arrieros', () => {
    const estado = escenario();
    const orden = ordenFormar(estado.turno, 3);
    const { estado: despues, sucesos } = turno(estado, [orden]);
    const nueva = Object.values(despues.recuas);
    expect(nueva).toHaveLength(1);
    expect(nueva[0]).toMatchObject({
      id: 'recua-100',
      nombre: 'Recua de Llano de Prueba',
      acemilas: 10,
      porte: 10,
      vecinos: 3,
    });
    expect(despues.siguienteId).toBe(101);
    expect(despues.comarcas['prueba-llano']?.poblacion).toBe(40 - 7);
    expect(despues.ordenes).toEqual([]);
    const pagado = sucesos.filter(
      (s) => s.tipo === 'almacen.cambio' && s.datos['motivo'] === `orden ${orden.id}`,
    );
    expect(pagado.map((s) => [s.datos['recurso'], s.datos['delta']])).toEqual([
      ['pan', -10],
      ['maravedis', -20],
    ]);
  });

  it('la segunda recua de la misma comarca lleva numero, y el cometido se guarda', () => {
    const estado = escenario({
      recuas: [recua('recua-1', { nombre: 'Recua de Llano de Prueba' })],
    });
    const cometido: Orden = {
      ...base(estado.turno),
      tipo: 'cometido',
      recua: 'recua-1' as IdRecua,
      // «tratar» lo cumple el mercado: la fase de cometidos lo deja como esta.
      cometido: 'tratar',
    };
    const { estado: despues } = turno(estado, [ordenFormar(estado.turno), cometido]);
    expect(de(despues, 'recua-100').nombre).toBe('Recua de Llano de Prueba 2');
    expect(de(despues, 'recua-1').cometido).toBe('tratar');
  });

  it('una orden que ya no cabe en el almacen se cancela al darla de alta', () => {
    const estado = escenario({ almacen: { maravedis: 5 } });
    const { estado: despues, sucesos } = turno(estado, [ordenFormar(estado.turno)]);
    expect(Object.keys(despues.recuas)).toEqual([]);
    expect(sucesos.find((s) => s.tipo === 'orden.estado')?.datos).toMatchObject({
      estado: 'cancelada',
      motivo: 'sin-recursos',
    });
  });

  it('cargar solo en casa: fuera espera, y al volver se hace', () => {
    const fuera = recua('recua-1', {
      situacion: { donde: 'comarca', comarca: c('prueba-vega') },
      ruta: [c('prueba-llano')],
      carga: recursos({ pan: 10 }),
    });
    let estado = escenario({ recuas: [fuera] });
    const carga = ordenCarga(estado.turno, 'recua-1', { madera: 20, sal: 3 });
    const primero = turno(estado, [carga]);
    estado = primero.estado;
    // Ha llegado al llano este turno, pero las cargas se atienden antes de andar.
    expect(estado.ordenes.map((o) => [o.id, o.estado, o.motivoEspera])).toEqual([
      [carga.id, 'en espera', 'recua-fuera-de-casa'],
    ]);
    const segundo = turno(estado);
    // El porte es 10, lleva 6 de pan que le quedan tras comer: caben 4.
    expect(de(segundo.estado, 'recua-1').carga).toMatchObject({ pan: 6, madera: 4, sal: 0 });
    expect(tipos(segundo.sucesos)).toContain('recua.carga-recortada');
    expect(segundo.estado.ordenes).toEqual([]);
  });

  it('una ruta a un destino desconocido o sin camino conocido queda en espera', () => {
    const quieta = recua('recua-1');
    const estado = escenario({ recuas: [quieta] });
    const sinConocer: EstadoPartida = {
      ...estado,
      jugadores: {
        [UNO]: {
          ...(estado.jugadores[UNO] as EstadoJugador),
          conocimiento: estadoMini().jugadores[UNO]?.conocimiento ?? {},
        },
      },
    };
    const aLaCosta = ordenRuta(estado.turno, 'recua-1', ['prueba-costa']);
    expect(turno(sinConocer, [aLaCosta]).estado.ordenes[0]).toMatchObject({
      estado: 'en espera',
      motivoEspera: 'destino-desconocido',
    });

    const invierno = escenario({ turno: INVIERNO, recuas: [quieta] });
    const aLaMina = ordenRuta(invierno.turno, 'recua-1', ['prueba-mina']);
    const { estado: despues } = turno(invierno, [aLaMina]);
    expect(despues.ordenes[0]).toMatchObject({
      estado: 'en espera',
      motivoEspera: 'sin-ruta-conocida',
    });
    expect(de(despues, 'recua-1').ruta).toEqual([]);
  });

  it('con escasez no sale ninguna expedicion nueva, pero la que va de camino sigue', () => {
    const quieta = recua('recua-1');
    const andando = recua('recua-2', {
      situacion: {
        donde: 'camino',
        desde: c('prueba-llano'),
        hasta: c('prueba-vega'),
        jornadasHechasMil: 500,
      },
      ruta: [c('prueba-vega')],
      carga: recursos({ pan: 10 }),
    });
    const estado = escenario({
      recuas: [quieta, andando],
      almacen: { pan: 0 },
    });
    const { estado: despues } = turno(estado, [
      ordenRuta(estado.turno, 'recua-1', ['prueba-vega']),
    ]);
    expect(despues.jugadores[UNO]?.escasez).toBe(true);
    expect(despues.ordenes[0]).toMatchObject({ estado: 'en espera', motivoEspera: 'escasez' });
    expect(de(despues, 'recua-2').situacion).toEqual({ donde: 'comarca', comarca: 'prueba-vega' });
  });

  it('una ruta circular da vueltas sin parar', () => {
    const estado = escenario({ recuas: [recua('recua-1', { carga: recursos({ pan: 10 }) })] });
    let actual = turno(estado, [ordenRuta(estado.turno, 'recua-1', ['prueba-vega'], true)]).estado;
    expect(de(actual, 'recua-1')).toMatchObject({ rutaCircular: true });
    const vistas: string[] = [];
    for (let i = 0; i < 4; i += 1) {
      const resultado = turno(actual);
      actual = resultado.estado;
      vistas.push(
        ...resultado.sucesos.filter((s) => s.tipo === 'recua.entra').map((s) => s.comarca ?? ''),
      );
    }
    expect(vistas.slice(0, 4)).toEqual([
      'prueba-llano',
      'prueba-vega',
      'prueba-llano',
      'prueba-vega',
    ]);
    expect(de(actual, 'recua-1').ruta).toHaveLength(2);
  });
});

describe('simultaneidad', () => {
  it('dos recuas iguales de jugadores distintos avanzan exactamente igual', () => {
    const pareja = (id: string, jugador: IdJugador): Recua =>
      recua(id, {
        jugador,
        situacion: { donde: 'comarca', comarca: c('prueba-vega') },
        ruta: [c('prueba-rio'), c('prueba-costa'), c('prueba-rio')],
        carga: recursos({ pan: 40, sal: 5 }),
      });
    let estado = escenario({
      conDos: true,
      recuas: [pareja('recua-a', UNO), pareja('recua-b', DOS)],
    });
    for (let i = 0; i < 3; i += 1) {
      estado = turno(estado).estado;
      const { id: _a, jugador: _j, nombre: _n, ...a } = de(estado, 'recua-a');
      const { id: _b, jugador: _k, nombre: _m, ...b } = de(estado, 'recua-b');
      expect(a).toEqual(b);
    }
  });

  it('barajar las ordenes no cambia la huella del turno', () => {
    const estado = escenario({
      recuas: [recua('recua-1'), recua('recua-2', { carga: recursos({ pan: 10 }) })],
    });
    const ordenes = [
      ordenFormar(estado.turno, 2),
      ordenCarga(estado.turno, 'recua-1', { pan: 5, madera: 3 }),
      ordenRuta(estado.turno, 'recua-1', ['prueba-costa']),
      ordenRuta(estado.turno, 'recua-2', ['prueba-monte'], true),
      ordenFormar(estado.turno, 0),
    ];
    const huella = turno(estado, ordenes).estado.huellaTurnoAnterior;
    const azar = azarDeTexto('barajar-ordenes');
    for (let i = 0; i < 5; i += 1) {
      expect(turno(estado, azar.barajar(ordenes)).estado.huellaTurnoAnterior).toBe(huella);
    }
  });
});

describe('con el paso de los arrieros', () => {
  it('una recua cruza dos comarcas en un turno', () => {
    const r = recua('recua-1', { ruta: [c('prueba-vega'), c('prueba-rio'), c('prueba-costa')] });
    const { estado, sucesos } = turno(escenario({ recuas: [r] }), [], conPaso(1000));
    expect(sucesos.filter((s) => s.tipo === 'recua.entra').map((s) => s.comarca)).toEqual([
      'prueba-vega',
      'prueba-rio',
    ]);
    expect(de(estado, 'recua-1').ruta).toEqual(['prueba-costa']);
  });
});
