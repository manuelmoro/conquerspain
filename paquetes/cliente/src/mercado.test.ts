// El mercado en el cliente (ficha T-084, criterios 1 y 4): ningun precio sin su fecha y su fuente, y
// la orden que se da desde la ficha de la plaza la construye el servidor y la casa el motor.
import { describe, expect, it } from 'vitest';

import {
  TABLAS_DEL_JUEGO,
  construirOrden,
  idDeMercadoLocal,
  recursosSegun,
  resolverTurno,
  validarIntencion,
} from '@conquer/nucleo';
import type {
  EstadoPartida,
  IdComarca,
  IdJugador,
  IdOrden,
  IdPartida,
  IdRecua,
  PlazaEnPanel,
  Recua,
} from '@conquer/nucleo';

import {
  avisosDeCompraventa,
  enMaravedis,
  fechaDePrecio,
  intencionesDeCompraventa,
  intencionesDeMercado,
  limitePorDefecto,
  maravedisParaComprar,
  valorar,
} from './mercado.ts';
import { montar } from './prueba-comun.ts';

const PLAZA: PlazaEnPanel = {
  id: 'local-x' as PlazaEnPanel['id'],
  comarca: 'x' as PlazaEnPanel['comarca'],
  nombre: 'Mercado de X',
  tipo: 'local',
  volumen: 'pequenya',
  abierta: true,
  abreEn: 0,
  precios: null,
  turnoDelPrecio: 10,
  fuente: 'rumor',
  recuas: [],
};

describe('la fecha y la fuente de un precio (criterio 1)', () => {
  it('siempre se dicen, y uno viejo se distingue', () => {
    expect(fechaDePrecio(PLAZA, 10)).toEqual({
      texto: 'Precios de este turno, de oídas.',
      viejo: false,
    });
    expect(fechaDePrecio({ ...PLAZA, fuente: 'visita' }, 11).texto).toBe(
      'Precios del turno pasado, lo vio una recua tuya.',
    );
    const viejo = fechaDePrecio(PLAZA, 20);
    expect(viejo.viejo).toBe(true);
    expect(viejo.texto).toMatch(/hace 10 turnos.*pueden haber cambiado/);
    expect(fechaDePrecio({ ...PLAZA, turnoDelPrecio: null, fuente: null }, 20).viejo).toBe(true);
  });

  it('barato y caro frente al base de la comarca; los precios en maravedís', () => {
    expect(valorar({ mil: 2700, baseMil: 3000 })).toBe('barato');
    expect(valorar({ mil: 3300, baseMil: 3000 })).toBe('caro');
    expect(valorar({ mil: 3100, baseMil: 3000 })).toBe('corriente');
    expect(enMaravedis(3000)).toBe('3');
    expect(enMaravedis(3140)).toBe('3,1');
    expect(limitePorDefecto('vender', 50000)).toBe(45000);
    expect(limitePorDefecto('comprar', 50000)).toBe(55000);
  });
});

describe('la orden de mercado desde la ficha de la plaza (criterio 4)', () => {
  it('pone a tratar a la recua, el servidor la construye y el motor la casa', async () => {
    // Una partida de prueba de verdad: en su capital, un mercado y una recua con lana.
    const m = await montar();
    const hoy = await m.e.repo.ultimoEstado('p1' as IdPartida);
    const capital = m.capital as IdComarca;
    const comarca = hoy?.comarcas[capital];
    if (hoy === null || comarca === undefined) throw new Error('sin estado');
    const recua: Recua = {
      id: 'recua-lanera' as IdRecua,
      jugador: 'mesta' as IdJugador,
      nombre: 'Recua lanera',
      situacion: { donde: 'comarca', comarca: capital },
      ruta: [],
      rutaCircular: false,
      paradas: [],
      siguienteParada: 0,
      enParada: null,
      acemilas: 10,
      porte: 10,
      carga: { ...recursosSegun(() => 0), lana: 10 },
      vecinos: 0,
      cometido: null,
      turnosDeCometido: 0,
      avisadaSinBastimento: false,
      enExpedicion: false,
      fallosDePrecio: 0,
    };
    const estado: EstadoPartida = {
      ...hoy,
      comarcas: {
        ...hoy.comarcas,
        [capital]: { ...comarca, edificios: { ...comarca.edificios, mercado: 1 } },
      },
      recuas: { ...hoy.recuas, [recua.id]: recua },
    };
    const intenciones = intencionesDeMercado({
      plaza: idDeMercadoLocal(capital),
      recua: recua.id,
      trata: false,
      operacion: 'vender',
      recurso: 'lana',
      cantidad: 4,
      precioLimiteMil: 1000,
      turnos: 2,
    });
    expect(intenciones.map((i) => i['tipo'])).toEqual(['cometido', 'mercado']);
    const ordenes = intenciones.map((intencion, i) => {
      const forma = validarIntencion({ ...intencion, idCliente: `m-0${String(i)}` });
      if (!forma.ok) throw new Error(JSON.stringify(forma.errores));
      const orden = construirOrden(forma.valor, {
        estado,
        jugador: 'mesta' as IdJugador,
        mundo: m.e.mundo,
        reglas: TABLAS_DEL_JUEGO,
        id: `o-m-0${String(i)}` as IdOrden,
      });
      if (!orden.ok) throw new Error(JSON.stringify(orden.errores));
      return orden.valor;
    });
    const { sucesos, estado: despues } = resolverTurno(
      estado,
      ordenes,
      m.e.mundo,
      TABLAS_DEL_JUEGO,
    );
    expect(sucesos.some((s) => s.tipo === 'mercado.trato' && s.jugador === 'mesta')).toBe(true);
    expect(despues.recuas[recua.id]?.carga.lana).toBeLessThan(10);
    await m.cerrar();
  }, 120_000);
});

describe('comprar y vender en pocos toques (T-093)', () => {
  const vacia = {
    enCasa: true,
    carga: { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 },
    sitioLibre: 10,
  };
  const pedido = {
    plaza: 'local-x',
    recua: 'recua-1',
    trata: false,
    operacion: 'comprar' as const,
    recurso: 'pan' as const,
    cantidad: 10,
    precioLimiteMil: 3300,
    turnos: 4,
  };

  it('los maravedís para comprar cuentan el precio límite y la comisión', () => {
    expect(maravedisParaComprar(10, 3300, 20)).toBe(34);
    expect(maravedisParaComprar(10, 3000, 0)).toBe(30);
  });

  it('en casa carga antes lo que falta; fuera, solo trata con lo que lleva y lo avisa', () => {
    expect(intencionesDeCompraventa(pedido, vacia, 20).map((i) => i['tipo'])).toEqual([
      'carga',
      'cometido',
      'mercado',
    ]);
    expect(intencionesDeCompraventa(pedido, vacia, 20)[0]).toMatchObject({
      cargar: { maravedis: 34 },
    });
    const fuera = { ...vacia, enCasa: false };
    expect(intencionesDeCompraventa(pedido, fuera, 20).map((i) => i['tipo'])).toEqual([
      'cometido',
      'mercado',
    ]);
    expect(avisosDeCompraventa(pedido, fuera, 20).join(' ')).toMatch(/harían falta 34/);
    const venta = { ...pedido, operacion: 'vender' as const, recurso: 'lana' as const };
    expect(intencionesDeCompraventa(venta, vacia, 20)[0]).toMatchObject({
      cargar: { lana: 10 },
    });
  });

  it('de punta a punta: la recua en casa y sin dinero compra pan, y al descargarlo va al almacén', async () => {
    const m = await montar();
    const hoy = await m.e.repo.ultimoEstado('p1' as IdPartida);
    const capital = m.capital as IdComarca;
    const comarca = hoy?.comarcas[capital];
    if (hoy === null || comarca === undefined) throw new Error('sin estado');
    const recua: Recua = {
      id: 'recua-panera' as IdRecua,
      jugador: 'mesta' as IdJugador,
      nombre: 'Recua panera',
      situacion: { donde: 'comarca', comarca: capital },
      ruta: [],
      rutaCircular: false,
      paradas: [],
      siguienteParada: 0,
      enParada: null,
      acemilas: 10,
      porte: 10,
      carga: recursosSegun(() => 0),
      vecinos: 0,
      cometido: null,
      turnosDeCometido: 0,
      avisadaSinBastimento: false,
      enExpedicion: false,
      fallosDePrecio: 0,
    };
    const estado: EstadoPartida = {
      ...hoy,
      comarcas: {
        ...hoy.comarcas,
        [capital]: { ...comarca, edificios: { ...comarca.edificios, mercado: 1 } },
      },
      recuas: { ...hoy.recuas, [recua.id]: recua },
    };
    const construir = (
      e: EstadoPartida,
      intenciones: readonly Readonly<Record<string, unknown>>[],
      prefijo: string,
    ) =>
      intenciones.map((intencion, i) => {
        const forma = validarIntencion({ ...intencion, idCliente: `${prefijo}${String(i)}` });
        if (!forma.ok) throw new Error(JSON.stringify(forma.errores));
        const orden = construirOrden(forma.valor, {
          estado: e,
          jugador: 'mesta' as IdJugador,
          mundo: m.e.mundo,
          reglas: TABLAS_DEL_JUEGO,
          id: `o-${prefijo}${String(i)}` as IdOrden,
        });
        if (!orden.ok) throw new Error(JSON.stringify(orden.errores));
        return orden.valor;
      });
    const compra = construir(
      estado,
      intencionesDeCompraventa(
        {
          plaza: idDeMercadoLocal(capital),
          recua: recua.id,
          trata: false,
          operacion: 'comprar',
          recurso: 'pan',
          cantidad: 5,
          precioLimiteMil: 20_000,
          turnos: 2,
        },
        { enCasa: true, carga: recua.carga, sitioLibre: 10 },
        20,
      ),
      'c',
    );
    const tras = resolverTurno(estado, compra, m.e.mundo, TABLAS_DEL_JUEGO).estado;
    const pan = tras.recuas[recua.id]?.carga.pan ?? 0;
    expect(pan).toBeGreaterThan(0);
    const descarga = construir(
      tras,
      [{ tipo: 'carga', recua: recua.id, cargar: {}, descargar: { pan }, vecinosCargados: 0 }],
      'd',
    );
    const luego = resolverTurno(tras, descarga, m.e.mundo, TABLAS_DEL_JUEGO).estado;
    expect(luego.recuas[recua.id]?.carga.pan).toBe(0);
    // Lo descargado entra antes de que la gente coma: el almacén lo nota frente a no descargarlo.
    const sinDescargar = resolverTurno(tras, [], m.e.mundo, TABLAS_DEL_JUEGO).estado;
    expect(
      (luego.jugadores['mesta']?.almacen.pan ?? 0) -
        (sinDescargar.jugadores['mesta']?.almacen.pan ?? 0),
    ).toBe(pan);
    await m.cerrar();
  }, 120_000);
});
