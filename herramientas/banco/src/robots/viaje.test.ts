// Regresiones de los defectos de los robots que corrige T-050 (ficha §4.1 y §6.1): la prevision de
// un viaje con las reglas del nucleo, las recuas que no salen a malvivir y las que se rehacen.
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { TABLAS_DEL_JUEGO, idDeMercadoLocal, vistaDeJugador } from '@conquer/nucleo';
import type {
  EstadoPartida,
  IdComarca,
  IdJugador,
  Mundo,
  Recua,
  Recursos,
  TablasDeReglas,
} from '@conquer/nucleo';

import { jugarTurno } from '../ejecutar.ts';
import { altaDelBanco, mundoPeninsula } from '../partida.ts';
import { papeles } from './impulsos.ts';
import { ESTRATEGIAS, robotDe } from './index.ts';
import type { PlazaConocida } from './tablero.ts';
import { Tablero } from './tablero.ts';
import { leLlega, preverViaje, provisionPara } from './viaje.ts';

const REGLAS = TABLAS_DEL_JUEGO;
const YO = 'hortelanos' as IdJugador;
/** Un turno de verano (junio) y otro de primavera (abril). */
const VERANO = 12;
const PRIMAVERA = 7;

let mundo: Mundo;
let base: EstadoPartida;

beforeAll(() => {
  // Los hortelanos en la Vega de Granada, doce turnos jugados: ya tienen recuas y tierra explorada.
  const alta = altaDelBanco({
    semilla: '1492',
    casas: ['hortelanos'],
    reglas: REGLAS,
    mundo: mundoPeninsula(),
    recortar: false,
    origenesFijos: { hortelanos: 'vega-de-granada' as IdComarca },
  });
  mundo = alta.mundo;
  let estado = alta.estado;
  const robots = [robotDe('hortelanos')];
  for (let i = 0; i < 12; i += 1) estado = jugarTurno(estado, robots, mundo, REGLAS).estado;
  base = estado;
}, 60_000);

/** El jugador de la partida, que existe siempre. */
function jugador(estado: EstadoPartida) {
  const j = estado.jugadores[YO];
  if (j === undefined) throw new Error('falta el hortelano');
  return j;
}

/**
 * La partida con la primera recua quieta y vacia en la capital, sin ordenes pendientes, en el turno
 * y con el almacen que se digan: el escenario de cada prueba.
 */
function preparar(
  turno: number,
  almacen: Partial<Recursos> = {},
  recua: Partial<Recua> = {},
): { estado: EstadoPartida; recua: Recua } {
  const j = jugador(base);
  const primera = Object.values(base.recuas)
    .filter((r) => r.jugador === YO)
    .sort((a, b) => a.id.localeCompare(b.id))[0];
  if (primera === undefined) throw new Error('los hortelanos no tienen recuas');
  const quieta: Recua = {
    ...primera,
    situacion: { donde: 'comarca', comarca: j.capital },
    ruta: [],
    paradas: [],
    enParada: null,
    cometido: null,
    carga: { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 },
    ...recua,
  };
  const estado: EstadoPartida = {
    ...base,
    turno,
    jugadores: {
      ...base.jugadores,
      [YO]: { ...j, almacen: { ...j.almacen, pan: 400, sal: 20, maravedis: 300, ...almacen } },
    },
    recuas: { ...base.recuas, [quieta.id]: quieta },
    ordenes: base.ordenes.filter((o) => !('recua' in o) || o.recua !== quieta.id),
  };
  return { estado, recua: quieta };
}

function tablero(estado: EstadoPartida, reglas: TablasDeReglas = REGLAS): Tablero {
  return new Tablero(vistaDeJugador(estado, YO, mundo), mundo, reglas);
}

/** Las oidas y exploradas a las que se llega desde la capital, de la mas cercana a la mas lejana. */
function destinos(t: Tablero): IdComarca[] {
  return [...t.jornadasDesde(t.capital)]
    .filter(([id]) => id !== t.capital && !t.esPropia(id))
    .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
    .map(([id]) => id);
}

function idaYVuelta(t: Tablero, destino: IdComarca) {
  return [
    { comarca: destino, detiene: true },
    { comarca: t.capital, detiene: false },
  ];
}

describe('la prevision de un viaje usa las reglas del nucleo', () => {
  it('cuenta el bastimento de la casa: con la mitad, se come menos pan', () => {
    const { estado, recua } = preparar(PRIMAVERA);
    const t = tablero(estado);
    const destino = destinos(t)[0];
    if (destino === undefined) throw new Error('no hay adonde ir');
    const reglasFrugales: TablasDeReglas = {
      ...REGLAS,
      casas: {
        ...REGLAS.casas,
        hortelanos: {
          ...REGLAS.casas.hortelanos,
          modificadores: { ...REGLAS.casas.hortelanos.modificadores, bastimentoMil: 500 },
        },
      },
    };
    const normal = preverViaje(t, recua, idaYVuelta(t, destino), recua.carga);
    const frugal = preverViaje(
      tablero(estado, reglasFrugales),
      recua,
      idaYVuelta(t, destino),
      recua.carga,
    );
    if (!normal.ok || !frugal.ok) throw new Error('el viaje tendria que poder hacerse');
    expect(normal.valor.pan + normal.valor.panDeCasa).toBeGreaterThan(0);
    expect(frugal.valor.pan + frugal.valor.panDeCasa).toBeLessThan(
      normal.valor.pan + normal.valor.panDeCasa,
    );
  });

  it('una recua cargada anda menos: el mismo viaje le lleva mas turnos o le cuesta mas pan', () => {
    const { estado, recua } = preparar(PRIMAVERA);
    const t = tablero(estado);
    const vacia = { ...recua.carga };
    const llena = { ...recua.carga, piedra: recua.porte };
    const peor = destinos(t).some((destino) => {
      const a = preverViaje(t, recua, idaYVuelta(t, destino), vacia);
      const b = preverViaje(t, recua, idaYVuelta(t, destino), llena);
      if (!a.ok || !b.ok) return false;
      return b.valor.turnos > a.valor.turnos || b.valor.pan > a.valor.pan;
    });
    expect(peor).toBe(true);
  });

  it('carga insuficiente: si el pan de ida y vuelta no cabe, no se sale', () => {
    const { estado, recua: preparada } = preparar(PRIMAVERA);
    const recua = { ...preparada, enExpedicion: false };
    const t = tablero(estado);
    const lejos = destinos(t).map((d) => provisionPara(t, recua, idaYVuelta(t, d)));
    expect(lejos.some((r) => !r.ok && r.motivo === 'no-cabe')).toBe(true);
    // Y lo que sale bien cabe de verdad en la recua.
    for (const r of lejos) {
      if (r.ok) expect(r.valor.pan + r.valor.sal).toBeLessThanOrEqual(recua.porte);
    }
  });

  it('una recua en expedicion come la fraccion de la tabla: el mismo viaje pide menos pan (T-059 §8)', () => {
    const { estado, recua } = preparar(PRIMAVERA);
    const t = tablero(estado);
    const normal = { ...recua, enExpedicion: false };
    const ligera = { ...recua, enExpedicion: true };
    let comparados = 0;
    for (const destino of destinos(t)) {
      const a = preverViaje(t, normal, idaYVuelta(t, destino), { ...recua.carga, pan: 0 });
      const b = preverViaje(t, ligera, idaYVuelta(t, destino), { ...recua.carga, pan: 0 });
      if (!a.ok || !b.ok) continue;
      comparados += 1;
      expect(b.valor.pan).toBeLessThan(a.valor.pan);
    }
    expect(comparados).toBeGreaterThan(0);
  });

  it('sal de verano: sin sal en el almacén no se sale, con sal se carga la que pide el camino', () => {
    const sinSal = preparar(VERANO, { sal: 0 });
    const t = tablero(sinSal.estado);
    const destino = destinos(t)[0];
    if (destino === undefined) throw new Error('no hay adonde ir');
    const falla = provisionPara(t, sinSal.recua, idaYVuelta(t, destino));
    expect(falla).toEqual({ ok: false, motivo: 'sin-sal' });

    const conSal = preparar(VERANO, { sal: 20 });
    const t2 = tablero(conSal.estado);
    const bien = provisionPara(t2, conSal.recua, idaYVuelta(t2, destino));
    if (!bien.ok) throw new Error(`con sal tendria que poder salir: ${bien.motivo}`);
    expect(bien.valor.sal + bien.valor.prevision.salDeCasa).toBeGreaterThan(0);
  });

  it('lo que se come en casa lo paga el almacén: sin pan en él, no se sale', () => {
    const { estado, recua } = preparar(PRIMAVERA, { pan: 0 });
    const t = tablero(estado);
    const destino = destinos(t)[0];
    if (destino === undefined) throw new Error('no hay adonde ir');
    expect(provisionPara(t, recua, idaYVuelta(t, destino))).toEqual({
      ok: false,
      motivo: 'sin-pan',
    });
  });

  it('fuera de casa, le llega o no con lo que lleva y un margen', () => {
    const { estado, recua } = preparar(PRIMAVERA);
    const t = tablero(estado);
    const destino = destinos(t)[0];
    if (destino === undefined) throw new Error('no hay adonde ir');
    const provision = provisionPara(t, recua, idaYVuelta(t, destino));
    if (!provision.ok) throw new Error(provision.motivo);
    const cargada = { ...recua.carga, pan: provision.valor.pan, sal: provision.valor.sal };
    expect(leLlega(t, recua, idaYVuelta(t, destino), cargada)).toBe(true);
    expect(leLlega(t, recua, idaYVuelta(t, destino), { ...cargada, pan: 0 })).toBe(false);
  });
});

describe('la venta del camino da de comer (T-055)', () => {
  /** El tablero de la partida con una venta sabida en el destino, y el viaje de ida y vuelta. */
  function conVentaEnElDestino() {
    const { estado, recua } = preparar(PRIMAVERA);
    const t = tablero(estado);
    const destino = destinos(t).find((d) => provisionPara(t, recua, idaYVuelta(t, d)).ok);
    if (destino === undefined) throw new Error('no hay adonde ir');
    vi.spyOn(t, 'hayVentaEn').mockImplementation((c) => c === destino);
    return { t, recua, paradas: idaYVuelta(t, destino) };
  }

  it('con bolsa para la venta, se carga menos pan y se lleva lo que cobra con holgura', () => {
    const { t, recua, paradas } = conVentaEnElDestino();
    const sin = provisionPara(t, recua, paradas);
    const con = provisionPara(t, recua, paradas, {}, 0, 100);
    if (!sin.ok || !con.ok) throw new Error('el viaje deberia poder hacerse');
    expect(sin.valor.maravedis).toBe(0);
    expect(con.valor.pan).toBeLessThan(sin.valor.pan);
    expect(con.valor.prevision.maravedis).toBeGreaterThan(0);
    expect(con.valor.maravedis).toBe(Math.ceil((con.valor.prevision.maravedis * 1250) / 1000));
    // Con esa carga le llega; sin los maravedis, el pan que se ahorro le falta.
    const cargada = { ...recua.carga, pan: con.valor.pan, maravedis: con.valor.maravedis };
    expect(leLlega(t, recua, paradas, cargada)).toBe(true);
    expect(leLlega(t, recua, paradas, { ...cargada, maravedis: 0 })).toBe(false);
  });

  it('si la bolsa no llega para la venta, se carga el pan de siempre', () => {
    const { t, recua, paradas } = conVentaEnElDestino();
    const sin = provisionPara(t, recua, paradas);
    expect(provisionPara(t, recua, paradas, {}, 0, 1)).toEqual(sin);
  });
});

describe('las recuas no salen a malvivir y se rehacen', () => {
  it('la exploradora solo sale adonde puede ir y volver, con el pan de la vuelta cargado', () => {
    const { estado, recua } = preparar(PRIMAVERA);
    const t = tablero(estado);
    const ordenes = robotDe('hortelanos').decidir(t.vista, mundo, REGLAS).ordenes;
    const suyas = ordenes.filter((o) => 'recua' in o && o.recua === recua.id);
    const ruta = suyas.find((o) => o.tipo === 'ruta');
    const carga = suyas.find((o) => o.tipo === 'carga');
    if (ruta?.tipo !== 'ruta' || carga?.tipo !== 'carga') {
      throw new Error(`la exploradora tendria que salir: ${JSON.stringify(suyas)}`);
    }
    const destino = ruta.paradas.at(-1)?.comarca;
    if (destino === undefined) throw new Error('ruta sin destino');
    const vuelta = [
      { comarca: destino, detiene: true },
      { comarca: t.casaMasCercana(destino), detiene: false },
    ];
    const prevision = preverViaje(t, recua, vuelta, {
      ...recua.carga,
      pan: carga.cargar.pan ?? 0,
      sal: carga.cargar.sal ?? 0,
    });
    if (!prevision.ok) throw new Error(prevision.motivo);
    expect(carga.cargar.pan ?? 0).toBeGreaterThanOrEqual(prevision.valor.pan);
    expect(carga.cargar.sal ?? 0).toBeGreaterThanOrEqual(prevision.valor.sal);
  });

  it('la recua mermada vuelve a casa y se disuelve', () => {
    const { estado, recua } = preparar(PRIMAVERA, {}, { acemilas: 3, porte: 3 });
    const t = tablero(estado);
    const decidido = robotDe('hortelanos').decidir(t.vista, mundo, REGLAS);
    const disuelve = decidido.ordenes.some(
      (o) => o.tipo === 'cometido' && o.recua === recua.id && o.cometido === 'disolver',
    );
    expect(disuelve).toBe(true);
    expect(decidido.motivos).toContain('recua-mermada');
  });

  it('disolver una recua no cambia el oficio de las demás', () => {
    const t = tablero(base);
    const perfil = ESTRATEGIAS.hortelanos.perfil;
    const antes = papeles(t, perfil);
    const primera = t.recuas[0];
    if (primera === undefined || t.recuas.length < 2) throw new Error('hacen falta dos recuas');
    const sin = Object.fromEntries(Object.entries(base.recuas).filter(([id]) => id !== primera.id));
    const despues = papeles(tablero({ ...base, recuas: sin }), perfil);
    for (const recua of t.recuas.slice(1)) {
      expect(despues.get(recua.id)).toBe(antes.get(recua.id));
    }
  });
});

describe('las ferias se esperan, no se adivinan', () => {
  it('turnos hasta que abra, contados desde el turno en que se llega', () => {
    const t = tablero(base);
    const feria: PlazaConocida = {
      id: idDeMercadoLocal(t.capital),
      comarca: t.capital,
      tipo: 'feria',
      turnos: [10, 11],
      volumen: 'grande',
    };
    expect(t.turnosHastaQueAbraEn(feria, 10)).toBe(0);
    expect(t.turnosHastaQueAbraEn(feria, 11)).toBe(0);
    expect(t.turnosHastaQueAbraEn(feria, 12)).toBe(22);
    expect(t.turnosHastaQueAbraEn(feria, 24 + 9)).toBe(1);
  });
});
