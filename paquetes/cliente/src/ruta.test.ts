// El editor de ruta (ficha T-083 §4.5, criterios 1, 2 y 5): su estado puro, y el recorrido entero
// desde el almacen hasta las ordenes que acepta el servidor.
import { describe, expect, it } from 'vitest';

import { recursosSegun } from '@conquer/nucleo';
import type {
  FichaDeComarca,
  IdComarca,
  IdJugador,
  IdRecua,
  PrevisionDeRuta,
  Recua,
} from '@conquer/nucleo';

import {
  alternarCircular,
  conPrevision,
  editorDe,
  fijarCarga,
  fijarTrato,
  intencionesDe,
  puedeConfirmar,
  quitar,
  subir,
  tocar,
} from './editor-de-ruta.ts';
import { claveOrdenada } from './almacen.ts';
import { montar } from './prueba-comun.ts';

/** Una recua quieta y vacia, con lo que se le cambie. */
function recuaDePrueba(cambios: Partial<Recua>): Recua {
  return {
    id: 'r' as IdRecua,
    jugador: 'yo' as IdJugador,
    nombre: 'Recua de prueba',
    situacion: { donde: 'comarca', comarca: 'a' as IdComarca },
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
    ...cambios,
  };
}

const BUENA: PrevisionDeRuta = {
  ok: true,
  motivo: null,
  tramos: [],
  llegadas: [1, 2],
  pan: 12,
  sal: 1,
  faltaPan: 12,
  faltaSal: 1,
  avisos: [],
};

describe('el estado del editor de ruta', () => {
  it('un circuito se monta tocando paradas y marcando «circular» (criterio 2)', () => {
    let e = editorDe({ clase: 'recua', id: 'recua-1' }, null);
    e = tocar(e, 'a');
    e = tocar(e, 'b');
    e = alternarCircular(e);
    expect(e.paradas).toEqual(['a', 'b']);
    expect(e.circular).toBe(true);
    expect(puedeConfirmar(e)).toBe(false);
    e = conPrevision(e, e.version, BUENA);
    expect(puedeConfirmar(e)).toBe(true);
    const intenciones = intencionesDe(e, true);
    expect(intenciones.map((i) => i['tipo'])).toEqual(['carga', 'ruta']);
    expect(intenciones[0]).toMatchObject({ cargar: { pan: 12, sal: 1 } });
    expect(intenciones[1]).toMatchObject({ circular: true, recua: 'recua-1', rebanyo: null });
  });

  it('tocar la última parada la quita; subir y quitar llevan consigo su carga', () => {
    let e = editorDe({ clase: 'recua', id: 'r' }, null);
    e = tocar(tocar(tocar(e, 'a'), 'b'), 'c');
    e = fijarCarga(e, 2, 'cargar', 'lana', 5);
    e = subir(e, 2);
    expect(e.paradas).toEqual(['a', 'c', 'b']);
    expect(e.tratos[1]?.cargar).toEqual({ lana: 5 });
    e = tocar(e, 'b');
    expect(e.paradas).toEqual(['a', 'c']);
    e = quitar(e, 0);
    expect(e.paradas).toEqual(['c']);
    expect(e.tratos.map((t) => t.cargar)).toEqual([{ lana: 5 }]);
    expect(fijarCarga(e, 0, 'cargar', 'lana', 0).tratos[0]?.cargar).toEqual({});
  });

  it('vender y comprar con precio límite en una parada llegan al motor tal cual (T-084, criterio 5)', () => {
    let e = tocar(editorDe({ clase: 'recua', id: 'r' }, null), 'a');
    e = fijarTrato(e, 0, 'vender', 'lana', { cantidad: 8, precioMil: 52000 });
    e = fijarTrato(e, 0, 'comprar', 'sal', { cantidad: 3, precioMil: 15000 });
    e = fijarTrato(e, 0, 'vender', 'maravedis', { cantidad: 3, precioMil: 1 });
    e = conPrevision(e, e.version, BUENA);
    const ruta = intencionesDe(e, false)[0];
    expect(ruta?.['paradas']).toEqual([
      {
        comarca: 'a',
        cargar: {},
        descargar: {},
        vender: { lana: { cantidad: 8, precioMinimoMil: 52000 } },
        comprar: { sal: { cantidad: 3, precioMaximoMil: 15000 } },
      },
    ]);
    // Y se vuelve a leer igual de la recua que ya la lleva: un circuito se edita sin rehacerlo.
    const leida = editorDe(
      { clase: 'recua', id: 'r' },
      recuaDePrueba({
        rutaCircular: true,
        paradas: [
          {
            comarca: 'a' as IdComarca,
            cargar: {},
            descargar: {},
            vender: { lana: { cantidad: 8, precioMinimoMil: 52000 } },
            comprar: {},
          },
        ],
      }),
    );
    expect(leida.tratos[0]?.vender).toEqual({ lana: { cantidad: 8, precioMil: 52000 } });
    expect(leida.circular).toBe(true);
    // Quitar la cantidad quita el trato.
    expect(
      fijarTrato(e, 0, 'vender', 'lana', { cantidad: 0, precioMil: 1 }).tratos[0]?.vender,
    ).toEqual({});
  });

  it('una previsión vieja no pisa la de un cambio nuevo; fuera de casa no se carga', () => {
    let e = tocar(editorDe({ clase: 'recua', id: 'r' }, null), 'a');
    const vieja = e.version;
    e = tocar(e, 'b');
    expect(conPrevision(e, vieja, BUENA).prevision).toBeNull();
    e = conPrevision(e, e.version, BUENA);
    expect(intencionesDe(e, false).map((i) => i['tipo'])).toEqual(['ruta']);
  });

  it('un rebaño va a una sola comarca y no hace circuitos', () => {
    let e = editorDe({ clase: 'rebanyo', id: 'reb' }, null);
    e = alternarCircular(tocar(tocar(e, 'a'), 'b'));
    expect(e.paradas).toEqual(['b']);
    expect(e.circular).toBe(false);
    e = conPrevision(e, e.version, { ...BUENA, llegadas: [3] });
    expect(intencionesDe(e, true)).toEqual([
      {
        tipo: 'ruta',
        recua: null,
        rebanyo: 'reb',
        paradas: [{ comarca: 'b', cargar: {}, descargar: {}, vender: {}, comprar: {} }],
        circular: false,
        expedicion: false,
      },
    ]);
  });
});

describe('el editor contra el servidor', () => {
  it('se abre, prevé al tocar el mapa y da la ruta que el servidor acepta', async () => {
    const m = await montar();
    await m.almacen.abrirPartida('p1');
    await m.almacen.anyadir({ tipo: 'formar-rebanyo', comarca: m.capital });
    await m.e.resolver();
    await m.almacen.recargar();
    const vista = m.almacen.estado.partida?.recibido.vista;
    const rebanyo = vista?.rebanyos[0];
    if (vista === undefined || rebanyo === undefined) throw new Error('sin rebaño');
    const vecina = (m.e.mundo.vecinos[m.capital] ?? []).find(
      (id) => vista.comarcas[id] !== undefined,
    );
    if (vecina === undefined) throw new Error('sin vecina');

    m.almacen.abrirEditor({ clase: 'rebanyo', id: rebanyo.id });
    expect(m.almacen.estado.editor?.unidad.id).toBe(rebanyo.id);
    m.almacen.editar((e) => tocar(e, vecina));
    for (let i = 0; i < 50 && m.almacen.estado.editor?.prevision === null; i += 1) {
      await new Promise((r) => setTimeout(r, 20));
    }
    const prevision = m.almacen.estado.editor?.prevision;
    expect(prevision, 'la previsión no llegó').not.toBeNull();
    if (prevision?.ok !== true) throw new Error(JSON.stringify(prevision));
    await m.almacen.confirmarEditor();
    expect(m.almacen.estado.editor).toBeNull();
    expect(m.almacen.estado.pendientes).toEqual([]);
    expect(m.almacen.estado.enviadas.map((o) => o.orden.tipo)).toContain('ruta');
    await m.cerrar();
  }, 120_000);
});

describe('las órdenes que van juntas entran en su cola en orden', () => {
  it('la clave ordena por el instante en que se crea', () => {
    expect(claveOrdenada(1_000, 'ffff') < claveOrdenada(2_000, '0000')).toBe(true);
    expect(claveOrdenada(Date.now(), crypto.randomUUID())).toMatch(/^[a-z0-9]{21}$/);
  });

  it('una misión de explorar dada desde el almacén explora de verdad, aunque las claves bajen', async () => {
    // Claves que salen al reves: antes, la ruta podia entrar en la cola delante de la carga.
    let n = 1000;
    const m = await montar({
      nuevaClave: () => {
        n -= 1;
        return `k${String(n)}`;
      },
    });
    await m.almacen.abrirPartida('p1');
    await m.almacen.anyadir({ tipo: 'formar-recua', comarca: m.capital, vecinos: 0 });
    await m.e.resolver();
    await m.almacen.recargar();
    const vista = m.almacen.estado.partida?.recibido.vista;
    if (vista === undefined) throw new Error('sin vista');
    const oida = (m.e.mundo.vecinos[m.capital] ?? []).find(
      (id) => vista.comarcas[id]?.nivel === 'oida',
    );
    if (oida === undefined) throw new Error('la capital no tiene vecinas oídas');
    const ficha: FichaDeComarca | null = await m.almacen.pedirFicha(oida);
    const mision = ficha?.acciones.find((a) => a.clave === 'mision-explorar');
    if (mision === undefined || mision.bloqueo !== null) throw new Error(JSON.stringify(mision));
    await m.almacen.anyadirVarias(mision.intenciones);
    expect(m.almacen.estado.pendientes).toEqual([]);
    for (let i = 0; i < mision.turnos + 1; i += 1) await m.e.resolver();
    await m.almacen.recargar();
    expect(m.almacen.estado.partida?.recibido.vista.comarcas[oida]?.nivel).toBe('explorada');
    await m.cerrar();
  }, 120_000);
});
