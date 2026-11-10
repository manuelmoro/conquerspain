// La ficha de comarca (ficha T-082 §6): toda accion con coste, duracion y efecto; todo bloqueo con
// causa y salida; y solo lo que el jugador sabe.
import { describe, expect, it } from 'vitest';

import { BLOQUEOS } from '../src/datos/bloqueos.ts';
import { fichaDeComarca } from '../src/ficha.ts';
import type { AccionDeFicha } from '../src/ficha.ts';
import { construirOrden, validarIntencion } from '../src/ordenes/intencion.ts';
import { resolverTurno } from '../src/resolver.ts';
import type { IdOrden } from '../src/tipos/ids.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import type { EstadoPartida } from '../src/tipos/estado.ts';
import { RECURSOS } from '../src/tipos/recursos.ts';
import { TIPOS_DE_EDIFICIO } from '../src/tipos/reglas.ts';
import { DOS, UNO, c, conComarca, escenario, mundo, recua, recursos, reglas } from './recuas.ts';

function comprobarAccion(a: AccionDeFicha): void {
  expect(a.titulo.length, a.clave).toBeGreaterThan(3);
  expect(a.turnos, a.clave).toBeGreaterThanOrEqual(1);
  expect(a.efecto.length, a.clave).toBeGreaterThan(3);
  for (const r of RECURSOS) expect(Number.isInteger(a.coste[r]), `${a.clave} ${r}`).toBe(true);
  if (a.bloqueo !== null) {
    expect(a.bloqueo.causa.length, a.clave).toBeGreaterThan(10);
    expect(a.bloqueo.salida.length, a.clave).toBeGreaterThan(10);
  }
}

describe('la ficha de una comarca propia', () => {
  const estado = escenario();
  const ficha = fichaDeComarca(estado, UNO, c('prueba-llano'), mundo, reglas);

  it('dice poblacion, capacidad, lealtad, solares, edificios, lo producido y lo previsto con su desglose', () => {
    expect(ficha?.nivel).toBe('propia');
    const p = ficha?.propia;
    if (p === null || p === undefined) throw new Error('sin detalle');
    expect(p.capacidad).toBeGreaterThan(0);
    expect(p.solares.total).toBeGreaterThan(0);
    expect(p.solares.usados).toBeLessThanOrEqual(p.solares.total);
    for (const e of p.prevision) {
      expect(e.factores.length).toBeGreaterThan(0);
      expect(e.resultado).toBeGreaterThanOrEqual(0);
    }
  });

  it('cada accion lleva coste, duracion y efecto; cada bloqueo, causa y salida (criterios 1 y 2)', () => {
    const acciones = ficha?.acciones ?? [];
    expect(acciones.length).toBeGreaterThan(10);
    for (const a of acciones) comprobarAccion(a);
    expect(acciones.some((a) => a.bloqueo !== null)).toBe(true);
    expect(acciones.some((a) => a.bloqueo === null)).toBe(true);
  });

  it('construir una granja prevé el pan que añade, igual que la produccion con un nivel mas', () => {
    const granja = ficha?.acciones.find((a) => a.clave === 'construir-granja');
    expect(granja?.efecto).toMatch(/pan por turno|Granja/);
    expect(granja?.coste).toEqual(reglas.edificios.granja.coste);
  });

  it('sin solares libres, construir queda bloqueado con su causa, y derribar libera uno', () => {
    // Doce edificios distintos llenan cualquier aldea; lo nuevo no cabe, ampliar si (T-094).
    const doce = Object.fromEntries(TIPOS_DE_EDIFICIO.slice(0, 12).map((t) => [t, 1]));
    const llena = conComarca(estado, 'prueba-llano', { edificios: doce });
    const f = fichaDeComarca(llena, UNO, c('prueba-llano'), mundo, reglas);
    const bloqueadas =
      f?.acciones.filter(
        (a) => a.clave.startsWith('construir-') && a.bloqueo?.motivo === 'sin-solar',
      ) ?? [];
    expect(bloqueadas.length).toBeGreaterThan(0);
    expect(bloqueadas.every((a) => !Object.hasOwn(doce, a.clave.slice('construir-'.length)))).toBe(
      true,
    );
    expect(f?.acciones.find((a) => a.clave === 'construir-granja')?.bloqueo?.motivo).not.toBe(
      'sin-solar',
    );
    expect(f?.acciones.find((a) => a.clave === 'derribar-granja')?.efecto).toContain(
      'Libera un solar',
    );
  });

  it('todos los motivos que da el nucleo tienen texto de causa y salida', () => {
    for (const motivo of [
      'nivel-maximo',
      'sin-solar',
      'potencial-insuficiente',
      'falta-edificio-requerido',
      'sin-permiso',
      'sin-monte',
      'labor-al-maximo',
      'comarca-con-duenyo',
      'influencia-baja',
      'sin-ventaja',
      'muy-lejos',
      'escasez',
    ]) {
      expect(BLOQUEOS[motivo], motivo).toBeDefined();
    }
  });
});

describe('la ficha de una comarca ajena o neutral', () => {
  it('una neutral explorada ofrece regalo, incorporar y venta, sin el detalle interior', () => {
    const estado = escenario();
    const f = fichaDeComarca(estado, UNO, c('prueba-vega'), mundo, reglas);
    expect(f?.nivel).toBe('explorada');
    expect(f?.propia).toBeNull();
    expect(f?.acciones.map((a) => a.clave)).toEqual([
      'regalo',
      'incorporar',
      'mision-presencia',
      'mision-explorar',
      'construir-venta',
    ]);
    for (const a of f?.acciones ?? []) comprobarAccion(a);
    expect(f?.acciones.find((a) => a.clave === 'incorporar')?.bloqueo?.motivo).toBe(
      'influencia-baja',
    );
  });

  it('la incorporacion se juzga con lo que el jugador sabe, no con la influencia ajena real', () => {
    const base = escenario({ conDos: true });
    const conInfluencia = conComarca(base, 'prueba-vega', {
      influencias: { [UNO]: 90, [DOS]: 88 },
    });
    const f = fichaDeComarca(conInfluencia, UNO, c('prueba-vega'), mundo, reglas);
    // Sin presencia no sabe nada de la otra casa: no puede decir «sin ventaja».
    expect(f?.acciones.find((a) => a.clave === 'incorporar')?.bloqueo?.motivo).not.toBe(
      'sin-ventaja',
    );
    expect(JSON.stringify(f)).not.toContain('88');
  });

  it('un regalo reciente queda bloqueado', () => {
    const estado = conComarca(escenario(), 'prueba-vega', {
      ultimoRegalo: { [UNO]: escenario().turno },
    });
    const f = fichaDeComarca(estado, UNO, c('prueba-vega'), mundo, reglas);
    expect(f?.acciones.find((a) => a.clave === 'regalo')?.bloqueo?.motivo).toBe('regalo-reciente');
  });

  it('un regalo ya pedido, este turno o en espera, bloquea el siguiente al mismo concejo', () => {
    const estado = escenario();
    const forma = validarIntencion({ idCliente: 'r', tipo: 'regalo', comarca: 'prueba-vega' });
    if (!forma.ok) throw new Error('intencion invalida');
    const hecha = construirOrden(forma.valor, {
      estado,
      jugador: UNO,
      mundo,
      reglas,
      id: 'o-r' as IdOrden,
    });
    if (!hecha.ok) throw new Error('orden invalida');
    const motivo = (e: EstadoPartida, pendientes: readonly Orden[] = []): string | undefined =>
      fichaDeComarca(e, UNO, c('prueba-vega'), mundo, reglas, pendientes)?.acciones.find(
        (a) => a.clave === 'regalo',
      )?.bloqueo?.motivo;
    expect(motivo(estado)).toBeUndefined();
    expect(motivo(estado, [hecha.valor])).toBe('regalo-pedido');
    const enEspera: Orden = {
      ...hecha.valor,
      estado: 'en espera',
      motivoEspera: 'regalo-reciente',
    };
    expect(motivo({ ...estado, ordenes: [enEspera] })).toBe('regalo-pedido');
    // El de otra casa no cuenta.
    expect(motivo(estado, [{ ...hecha.valor, jugador: DOS }])).toBeUndefined();
  });

  it('de lo que no conoce no hay ficha', () => {
    const base = escenario();
    const yo = base.jugadores[UNO];
    if (yo === undefined) throw new Error('falta el jugador');
    const ciego = { ...base, jugadores: { ...base.jugadores, [UNO]: { ...yo, conocimiento: {} } } };
    expect(fichaDeComarca(ciego, UNO, c('prueba-costa'), mundo, reglas)).toBeNull();
  });
});

/** La uno oye hablar del monte (vecino de su llano) sin haberlo explorado. */
function conMonteOido(estado: EstadoPartida): EstadoPartida {
  const yo = estado.jugadores[UNO];
  if (yo === undefined) throw new Error('falta el jugador');
  const conocimiento = {
    ...yo.conocimiento,
    'prueba-monte': { nivel: 'oida' as const, turnoUltimaNoticia: 1, datos: null },
  };
  return { ...estado, jugadores: { ...estado.jugadores, [UNO]: { ...yo, conocimiento } } };
}

describe('como se gana una comarca (T-088 §2.7)', () => {
  it('una oida ensenya la influencia propia, ofrece regalo e incorporar y aconseja explorarla', () => {
    const estado = conComarca(conMonteOido(escenario()), 'prueba-monte', {
      influencias: { [UNO]: 14 },
    });
    const f = fichaDeComarca(estado, UNO, c('prueba-monte'), mundo, reglas);
    expect(f?.nivel).toBe('oida');
    expect(f?.influenciaPropia).toBe(14);
    expect(f?.consejo).toMatch(/Explórala con una recua/);
    expect(f?.acciones.map((a) => a.clave)).toEqual(['regalo', 'incorporar', 'mision-explorar']);
    for (const a of f?.acciones ?? []) comprobarAccion(a);
    // Sin recua, la mision dice por que no y como arreglarlo.
    expect(f?.acciones.find((a) => a.clave === 'mision-explorar')?.bloqueo?.motivo).toBe(
      'sin-recua-libre',
    );
    expect(f?.comoGanarLa?.actual).toBe(14);
    expect(f?.comoGanarLa?.necesaria).toBe(reglas.influencia.minimaParaIncorporar);
  });

  it('dice por que sube o baja: vecina propia +1, sin nadie allí −1, y que lo aceleraria', () => {
    const estado = conComarca(escenario(), 'prueba-vega', { influencias: { [UNO]: 10 } });
    const g = fichaDeComarca(estado, UNO, c('prueba-vega'), mundo, reglas)?.comoGanarLa;
    expect(g?.motivos).toEqual([
      { texto: 'comarcas tuyas vecinas', puntos: 1 },
      { texto: 'nadie tuyo está ni comercia allí', puntos: -1 },
    ]);
    expect(g?.cambio).toBe(0);
    expect(g?.turnosHastaLaNecesaria).toBeNull();
    const textos = (g?.aceleraria ?? []).map((a) => a.texto).join(' | ');
    expect(textos).toMatch(/recua presente/);
    expect(textos).toMatch(/regalo al concejo/);
    expect(textos).toMatch(/mercado/);
    // Con un mercado en el llano sube un punto por turno: 50 que faltan, 50 turnos.
    const conMercado = conComarca(estado, 'prueba-llano', {
      edificios: { ...estado.comarcas['prueba-llano']?.edificios, mercado: 1 },
    });
    const h = fichaDeComarca(conMercado, UNO, c('prueba-vega'), mundo, reglas)?.comoGanarLa;
    expect(h?.cambio).toBe(1);
    expect(h?.turnosHastaLaNecesaria).toBe(50);
  });

  it('lo previsto coincide con lo que da la fase 8 al resolver (criterio 8)', () => {
    let estado = conMonteOido(escenario());
    estado = conComarca(estado, 'prueba-vega', { influencias: { [UNO]: 10 } });
    estado = conComarca(estado, 'prueba-monte', { influencias: { [UNO]: 7 } });
    estado = conComarca(estado, 'prueba-sierra', { influencias: { [UNO]: 3 } });
    estado = conComarca(estado, 'prueba-rio', { influencias: { [UNO]: 100 } });
    estado = conComarca(estado, 'prueba-llano', {
      edificios: { ...estado.comarcas['prueba-llano']?.edificios, mercado: 1 },
    });
    const previstos: Record<string, number> = {};
    for (const id of Object.keys(estado.comarcas)) {
      const f = fichaDeComarca(estado, UNO, c(id), mundo, reglas);
      if (f?.comoGanarLa !== null && f?.comoGanarLa !== undefined)
        previstos[id] = f.comoGanarLa.cambio;
    }
    expect(Object.keys(previstos).length).toBeGreaterThanOrEqual(4);
    const despues = resolverTurno(estado, [], mundo, reglas).estado;
    for (const [id, cambio] of Object.entries(previstos)) {
      const antes = estado.comarcas[id]?.influencias[UNO] ?? 0;
      expect((despues.comarcas[id]?.influencias[UNO] ?? 0) - antes, id).toBe(cambio);
    }
    // Hay de todo: algo que sube, algo que baja y algo recortado en el 100.
    expect(Object.values(previstos).some((v) => v > 0)).toBe(true);
    expect(Object.values(previstos).some((v) => v < 0)).toBe(true);
  });
});

/** Las intenciones de una accion, convertidas en ordenes como lo haria la API. */
function ordenesDe(
  intenciones: readonly Readonly<Record<string, unknown>>[],
  estado: EstadoPartida,
): Orden[] {
  return intenciones.map((intencion, i) => {
    const forma = validarIntencion({ ...intencion, idCliente: `mision-${String(i)}` });
    if (!forma.ok) throw new Error(JSON.stringify(forma.errores));
    const orden = construirOrden(forma.valor, {
      estado,
      jugador: UNO,
      mundo,
      reglas,
      id: `o-${String(estado.turno)}-mision-${String(i)}` as IdOrden,
    });
    if (!orden.ok) throw new Error(JSON.stringify(orden.errores));
    return orden.valor;
  });
}

describe('mandar una recua desde la ficha (T-083 §4.2, criterio 4)', () => {
  const conRecua = (): EstadoPartida =>
    conComarca(
      escenario({ recuas: [recua('recua-1', { acemilas: 20, porte: 200, carga: recursos() })] }),
      'prueba-vega',
      { influencias: { [UNO]: 10 } },
    );

  it('presencia: llega cuando dice y, ya allí, la influencia sube lo que prevé la ficha', () => {
    let estado = conRecua();
    const accion = fichaDeComarca(estado, UNO, c('prueba-vega'), mundo, reglas)?.acciones.find(
      (a) => a.clave === 'mision-presencia',
    );
    if (accion === undefined) throw new Error('falta la mision');
    expect(accion.bloqueo).toBeNull();
    expect(accion.intenciones.map((i) => i['tipo'])).toEqual(['carga', 'ruta', 'cometido', 'ruta']);
    expect(accion.efecto).toMatch(/llega en \d+ turnos?; \+2 de influencia por turno/);
    const llegada = accion.turnos;
    estado = resolverTurno(estado, ordenesDe(accion.intenciones, estado), mundo, reglas).estado;
    for (let k = 1; k < llegada; k += 1) estado = resolverTurno(estado, [], mundo, reglas).estado;
    expect(estado.recuas['recua-1']?.situacion).toEqual({
      donde: 'comarca',
      comarca: 'prueba-vega',
    });
    // Desde que esta presente, cada turno sube lo que dice la ficha, y la ficha cuenta la presencia.
    let presente = false;
    for (let k = 0; k < 3; k += 1) {
      const g = fichaDeComarca(estado, UNO, c('prueba-vega'), mundo, reglas)?.comoGanarLa;
      const antes = estado.comarcas['prueba-vega']?.influencias[UNO] ?? 0;
      estado = resolverTurno(estado, [], mundo, reglas).estado;
      const cambio = (estado.comarcas['prueba-vega']?.influencias[UNO] ?? 0) - antes;
      if (g?.motivos.some((m) => m.texto === 'una recua tuya presente') === true) {
        presente = true;
        expect(cambio).toBe(g.cambio);
      }
    }
    expect(presente).toBe(true);
  });

  it('explorar: la recua va como expedición, explora y vuelve sola a casa', () => {
    let estado = conMonteOido(conRecua());
    const accion = fichaDeComarca(estado, UNO, c('prueba-monte'), mundo, reglas)?.acciones.find(
      (a) => a.clave === 'mision-explorar',
    );
    if (accion === undefined || accion.bloqueo !== null) throw new Error('la mision no se puede');
    estado = resolverTurno(estado, ordenesDe(accion.intenciones, estado), mundo, reglas).estado;
    for (let k = 0; k < 12; k += 1) estado = resolverTurno(estado, [], mundo, reglas).estado;
    expect(estado.jugadores[UNO]?.conocimiento['prueba-monte']?.nivel).toBe('explorada');
    expect(estado.recuas['recua-1']?.situacion).toEqual({
      donde: 'comarca',
      comarca: 'prueba-llano',
    });
  });
});

describe('el gobierno en la ficha de una comarca propia (T-089 §4.2)', () => {
  it('ofrece fuero, carga, dehesa, obras mayores y traslado, con efecto y bloqueo con salida', () => {
    let estado = escenario();
    estado = conComarca(estado, 'prueba-vega', { duenyo: UNO });
    const f = fichaDeComarca(estado, UNO, c('prueba-vega'), mundo, reglas);
    const claves = f?.acciones.map((a) => a.clave) ?? [];
    for (const clave of [
      'fuero-carta-puebla',
      'fuero-fuero',
      'carga-ligera',
      'carga-dura',
      'acotar-dehesa',
      'obra-muralla',
      'obra-monasterio',
      'trasladar-corte',
    ])
      expect(claves, clave).toContain(clave);
    for (const a of f?.acciones ?? []) comprobarAccion(a);
    expect(f?.acciones.find((a) => a.clave === 'trasladar-corte')?.coste).toEqual(
      reglas.territorio.costeTraslado,
    );
    // En la capital no se ofrece trasladar la corte.
    const capital = fichaDeComarca(estado, UNO, c('prueba-llano'), mundo, reglas);
    expect(capital?.acciones.some((a) => a.clave === 'trasladar-corte')).toBe(false);
  });

  it('el fuero recién cambiado queda bloqueado en la ficha y en espera en la fase (criterio 1)', () => {
    const estado = conComarca(escenario(), 'prueba-llano', {
      fuero: 'carta puebla',
      turnoFuero: escenario().turno - 1,
    });
    const f = fichaDeComarca(estado, UNO, c('prueba-llano'), mundo, reglas);
    const darFuero = f?.acciones.find((a) => a.clave === 'fuero-fuero');
    expect(darFuero?.bloqueo?.motivo).toBe('fuero-reciente');
    const libre = f?.acciones.find((a) => a.clave === 'carga-ligera');
    expect(libre?.bloqueo).toBeNull();
    if (darFuero === undefined || libre === undefined) throw new Error('faltan acciones');
    const [ordenFuero, ordenCarga] = ordenesDe([darFuero.intencion, libre.intencion], estado);
    if (ordenFuero === undefined || ordenCarga === undefined) throw new Error('sin órdenes');
    const r = resolverTurno(
      estado,
      [ordenFuero, { ...ordenCarga, id: 'o-z' as IdOrden }],
      mundo,
      reglas,
    );
    expect(r.estado.ordenes.find((o) => o.id === ordenFuero.id)).toMatchObject({
      estado: 'en espera',
      motivoEspera: 'fuero-reciente',
    });
    expect(r.estado.comarcas['prueba-llano']?.cargaFiscal).toBe('ligera');
  });
});
