// Contratos entre casas y credito (ficha T-103 §2 y §3): cada tipo se firma, se cumple y se incumple
// como dice la ficha; el incumplido paga su penalizacion y pierde credito, y queda en la cronica de
// las dos partes; con poco credito se paga por adelantado y no se pide prestado; y barajar las
// ordenes no cambia nada.
import { describe, expect, it } from 'vitest';

import { CASAS_DE_OFICIO } from '../src/datos/casas.ts';
import { fuentesDeInfluencia } from '../src/reglas/influencia.ts';
import { puedeEntrar } from '../src/reglas/rebanyos.ts';
import { tramoEntre } from '../src/reglas/ruta.ts';
import type { Contrato } from '../src/tipos/contratos.ts';
import type { EstadoJugador, EstadoPartida, Recua } from '../src/tipos/estado.ts';
import type { IdContrato, IdJugador } from '../src/tipos/ids.ts';
import type { CondicionesDeContrato, Orden } from '../src/tipos/ordenes.ts';
import type { Casa, TablasDeReglas, Tradicion } from '../src/tipos/reglas.ts';
import { huella } from '../src/utiles/huella.ts';
import {
  DOS,
  UNO,
  base,
  c,
  comarcaDe,
  conComarca,
  escenario,
  mundo,
  recua,
  recursos,
  reglas,
  turno,
} from './recuas.ts';

// Las casas de verdad: sus permisos (vender aperos, obra ajena, portazgo) son los que se prueban.
const REALES: TablasDeReglas = { ...reglas, casas: CASAS_DE_OFICIO };
const jugar = (estado: EstadoPartida, ordenes: readonly Orden[] = []) =>
  turno(estado, ordenes, REALES);

const COSTA = 'prueba-costa';
const LLANO = 'prueba-llano';

function jugadorDe(estado: EstadoPartida, id: IdJugador): EstadoJugador {
  const j = estado.jugadores[id];
  if (j === undefined) throw new Error(`falta ${id}`);
  return j;
}

function conJugador(
  estado: EstadoPartida,
  id: IdJugador,
  cambios: Partial<EstadoJugador>,
): EstadoPartida {
  return {
    ...estado,
    jugadores: { ...estado.jugadores, [id]: { ...jugadorDe(estado, id), ...cambios } },
  };
}

/** Dos casas: UNO en el llano y DOS en la costa, cada una con su comarca y la casa que se diga. */
function partida(
  opciones: { casaDos?: Casa; recuas?: readonly Recua[]; tradicionesUno?: Tradicion[] } = {},
): EstadoPartida {
  const estado = conComarca(escenario({ conDos: true, recuas: opciones.recuas ?? [] }), COSTA, {
    duenyo: DOS,
  });
  const conCasa = conJugador(estado, DOS, {
    casa: opciones.casaDos ?? 'mesta',
    almacen: recursos({ pan: 500, sal: 50, maravedis: 500, madera: 50, piedra: 200, hierro: 40 }),
  });
  return conJugador(conCasa, UNO, { tradiciones: opciones.tradicionesUno ?? [] });
}

function propuesta(
  estado: EstadoPartida,
  condiciones: CondicionesDeContrato,
  opciones: { de?: IdJugador; plazo?: number; penalizacion?: number } = {},
): Orden {
  const de = opciones.de ?? UNO;
  return {
    ...base(estado.turno),
    jugador: de,
    tipo: 'contrato',
    con: de === UNO ? DOS : UNO,
    plazo: estado.turno + (opciones.plazo ?? 5),
    penalizacion: opciones.penalizacion ?? 30,
    condiciones,
  };
}

function respuesta(estado: EstadoPartida, contrato: IdContrato, acepta = true, de = DOS): Orden {
  return { ...base(estado.turno), jugador: de, tipo: 'responder-contrato', contrato, acepta };
}

function unico(estado: EstadoPartida): Contrato {
  const contratos = Object.values(estado.contratos ?? {});
  const [contrato] = contratos;
  if (contratos.length !== 1 || contrato === undefined)
    throw new Error(`se esperaba un contrato y hay ${String(contratos.length)}`);
  return contrato;
}

/** Propone (UNO a DOS salvo que se diga) y la otra parte responde el turno siguiente. */
function proponerYResponder(
  estado: EstadoPartida,
  condiciones: CondicionesDeContrato,
  opciones: { de?: IdJugador; plazo?: number; penalizacion?: number; acepta?: boolean } = {},
) {
  const primero = jugar(estado, [propuesta(estado, condiciones, opciones)]);
  const propuesto = unico(primero.estado);
  const quien = (opciones.de ?? UNO) === UNO ? DOS : UNO;
  const segundo = jugar(primero.estado, [
    respuesta(primero.estado, propuesto.id, opciones.acepta ?? true, quien),
  ]);
  return { primero, segundo, contrato: unico(segundo.estado) };
}

/** Avanza turnos sin ordenes hasta el turno dado (incluido). */
function hasta(estado: EstadoPartida, ultimo: number) {
  let actual = jugar(estado);
  while (actual.estado.turno <= ultimo) actual = jugar(actual.estado);
  return actual;
}

const ENTREGA: CondicionesDeContrato = {
  tipo: 'entrega',
  activa: 'propone',
  recurso: 'sal',
  cantidad: 20,
  comarca: c(COSTA),
  precio: 100,
};

const conSalEnLaCosta = recua('recua-1', {
  situacion: { donde: 'comarca', comarca: c(COSTA) },
  carga: recursos({ sal: 20 }),
});

describe('el ciclo de una propuesta', () => {
  it('la propuesta se ve en la vista y la crónica de las dos partes', () => {
    const estado = partida();
    const { sucesos, estado: despues } = jugar(estado, [propuesta(estado, ENTREGA)]);
    const contrato = unico(despues);
    expect(contrato).toMatchObject({
      estado: 'propuesto',
      propone: UNO,
      recibe: DOS,
      entrega: UNO,
    });
    const avisos = sucesos.filter((s) => s.tipo === 'contrato.propuesto');
    expect(avisos.map((s) => [s.jugador, s.datos['rol'], s.datos['de']])).toEqual([
      [UNO, 'propone', DOS],
      [DOS, 'recibe', UNO],
    ]);
  });

  it('sin respuesta caduca a los dos turnos, y al turno siguiente sale del estado', () => {
    const estado = partida();
    const uno = jugar(estado, [propuesta(estado, ENTREGA)]);
    const dos = jugar(uno.estado);
    expect(unico(dos.estado).estado).toBe('propuesto');
    const tres = jugar(dos.estado);
    expect(unico(tres.estado)).toMatchObject({ estado: 'caducado', motivo: 'sin-respuesta' });
    expect(tres.sucesos.filter((s) => s.tipo === 'contrato.caducado')).toHaveLength(2);
    expect(Object.keys(jugar(tres.estado).estado.contratos ?? {})).toEqual([]);
  });

  it('la otra parte puede rechazarla', () => {
    const { contrato, segundo } = proponerYResponder(partida(), ENTREGA, { acepta: false });
    expect(contrato).toMatchObject({ estado: 'rechazado', motivo: 'contrato-rechazado' });
    expect(segundo.sucesos.filter((s) => s.tipo === 'contrato.rechazado')).toHaveLength(2);
  });
});

describe('entrega (criterios 1 y 5)', () => {
  it('se cumple cuando la recua del que entrega está en la comarca con la mercancía', () => {
    const estado = partida({ recuas: [conSalEnLaCosta] });
    const { contrato, segundo } = proponerYResponder(estado, ENTREGA);
    expect(contrato.estado).toBe('cumplido');
    const uno = jugadorDe(segundo.estado, UNO);
    const dos = jugadorDe(segundo.estado, DOS);
    expect(segundo.estado.recuas['recua-1']?.carga.sal).toBe(0);
    expect(dos.almacen.sal).toBeGreaterThanOrEqual(jugadorDe(estado, DOS).almacen.sal);
    expect(segundo.sucesos.some((s) => s.tipo === 'contrato.cumplido' && s.jugador === UNO)).toBe(
      true,
    );
    expect(uno.credito).toBe(50 + reglas.contratos.creditoPorCumplir);
    expect(dos.credito).toBe(50 + reglas.contratos.creditoPorCumplir);
    expect(uno.registro.contratosCumplidos).toBe(1);
    // El precio pasa del que recibe al que entrega.
    const pagos = segundo.sucesos.filter(
      (s) => s.tipo === 'almacen.cambio' && s.datos['motivo'] === `contrato ${contrato.id}`,
    );
    expect(pagos.length).toBeGreaterThan(0);
  });

  it('sin entrega al plazo falla quien entrega: paga la penalización y pierde crédito', () => {
    const estado = partida();
    const { contrato, segundo } = proponerYResponder(estado, ENTREGA, { plazo: 3 });
    expect(contrato.estado).toBe('vigente');
    const final = hasta(segundo.estado, contrato.plazo);
    const cerrado = unico(final.estado);
    expect(cerrado).toMatchObject({ estado: 'incumplido', fallo: UNO, motivo: 'sin-entrega' });
    expect(jugadorDe(final.estado, UNO).credito).toBe(50 - reglas.contratos.creditoPorIncumplir);
    expect(jugadorDe(final.estado, DOS).credito).toBe(50);
    const avisos = final.sucesos.filter((s) => s.tipo === 'contrato.incumplido');
    expect(avisos.map((s) => [s.jugador, s.datos['rol'], s.datos['penalizacion']])).toEqual([
      [UNO, 'falla', 30],
      [DOS, 'cobra', 30],
    ]);
  });

  it('si al entregar el que paga no tiene el precio, falla él', () => {
    const estado = conJugador(partida({ recuas: [conSalEnLaCosta] }), DOS, {
      almacen: recursos({ pan: 500, sal: 50, maravedis: 10 }),
    });
    const { contrato } = proponerYResponder(estado, ENTREGA);
    expect(contrato).toMatchObject({ estado: 'incumplido', fallo: DOS, motivo: 'sin-fondos' });
  });
});

describe('crédito bajo (criterio 4)', () => {
  it('quien paga una entrega con poco crédito deposita el precio al firmar', () => {
    const estado = conJugador(partida(), DOS, { credito: 20 });
    const { contrato } = proponerYResponder(estado, ENTREGA);
    expect(contrato).toMatchObject({ estado: 'vigente', depositado: 100 });
  });

  it('con poco crédito no se puede pedir prestado; la banca sí presta', () => {
    const prestamo: CondicionesDeContrato = {
      tipo: 'prestamo',
      activa: 'propone',
      cantidad: 100,
      devolver: 120,
    };
    const estado = conJugador(partida(), DOS, { credito: 20 });
    expect(proponerYResponder(estado, prestamo).contrato).toMatchObject({
      estado: 'rechazado',
      motivo: 'poco-credito',
    });
    const conBanca = conJugador(estado, UNO, {
      casa: 'mercaderes',
      tradiciones: ['mercaderes-banca'],
    });
    expect(proponerYResponder(conBanca, prestamo).contrato.estado).toBe('vigente');
  });

  it('con poco crédito, el concejo da un 20 % menos de influencia', () => {
    const estado = partida({
      recuas: [
        recua('recua-1', {
          situacion: { donde: 'comarca', comarca: c('prueba-vega') },
          cometido: 'presencia',
          carga: recursos({ pan: 40, sal: 5 }),
        }),
      ],
    });
    const neto = (credito: number): number => {
      const jugador = { ...jugadorDe(estado, UNO), credito };
      return fuentesDeInfluencia(
        {
          comarca: comarcaDe(estado, 'prueba-vega'),
          jugador,
          actividad: { importe: new Map(), vaciaronElPan: new Set() },
        },
        estado,
        mundo,
        reglas,
      ).presencia;
    };
    expect(neto(20)).toBe(
      Math.floor((neto(50) * reglas.contratos.influenciaConCreditoBajoMil) / 1000),
    );
    expect(neto(20)).toBeLessThan(neto(50));
  });
});

describe('préstamo', () => {
  const PRESTAMO: CondicionesDeContrato = {
    tipo: 'prestamo',
    activa: 'propone',
    cantidad: 100,
    devolver: 120,
  };

  it('al firmar pasa la cantidad; al plazo se cobra la devolución', () => {
    const estado = partida();
    const { contrato, segundo } = proponerYResponder(estado, PRESTAMO, { plazo: 3 });
    expect(contrato.estado).toBe('vigente');
    expect(jugadorDe(segundo.estado, DOS).almacen.maravedis).toBeGreaterThan(
      jugadorDe(estado, DOS).almacen.maravedis,
    );
    const final = hasta(segundo.estado, contrato.plazo);
    expect(unico(final.estado).estado).toBe('cumplido');
  });

  it('si no hay bastante se cobra lo que haya y falla quien pidió', () => {
    const estado = partida();
    const { contrato, segundo } = proponerYResponder(estado, PRESTAMO, { plazo: 3 });
    const pobre = conJugador(segundo.estado, DOS, {
      almacen: { ...jugadorDe(segundo.estado, DOS).almacen, maravedis: 50 },
    });
    const final = hasta(pobre, contrato.plazo);
    expect(unico(final.estado)).toMatchObject({ estado: 'incumplido', fallo: DOS });
    expect(jugadorDe(final.estado, DOS).almacen.maravedis).toBe(0);
  });
});

describe('aperos', () => {
  const APEROS: CondicionesDeContrato = {
    tipo: 'aperos',
    activa: 'recibe',
    comarca: c(LLANO),
    niveles: 2,
    precio: 80,
  };

  it('al firmar, el ferrón pone el hierro, la comarca sube sus aperos y el comprador paga', () => {
    const estado = partida({ casaDos: 'ferrones' });
    const antes = comarcaDe(estado, LLANO).aperos;
    const { contrato, segundo } = proponerYResponder(estado, APEROS);
    expect(contrato.estado).toBe('cumplido');
    expect(comarcaDe(segundo.estado, LLANO).aperos).toBe(antes + 2);
    expect(jugadorDe(segundo.estado, DOS).credito).toBe(55);
  });

  it('no se firma sin el permiso de la casa ni sin hierro', () => {
    expect(proponerYResponder(partida(), APEROS).contrato.motivo).toBe('sin-permiso');
    const sinHierro = conJugador(partida({ casaDos: 'ferrones' }), DOS, {
      almacen: recursos({ pan: 500, maravedis: 500 }),
    });
    expect(proponerYResponder(sinHierro, APEROS).contrato.motivo).toBe('sin-recursos');
  });
});

describe('obra', () => {
  const MURALLA: CondicionesDeContrato = {
    tipo: 'obra',
    activa: 'recibe',
    comarca: c(LLANO),
    obra: 'muralla',
    hacia: null,
    precio: 200,
  };

  it('al firmar el cliente paga y empieza la obra en su comarca, con el material del cantero', () => {
    const estado = partida({ casaDos: 'canteros' });
    const { contrato, segundo } = proponerYResponder(estado, MURALLA, { plazo: 40 });
    expect(contrato.tipo === 'obra' ? contrato.idObra : null).not.toBeNull();
    const obra = Object.values(segundo.estado.obras)[0];
    expect(obra).toMatchObject({ jugador: UNO, comarca: LLANO, porContrato: DOS });
    // Un turno de obra: el material sale del cantero, no del cliente.
    const piedraUno = jugadorDe(segundo.estado, UNO).almacen.piedra;
    const piedraDos = jugadorDe(segundo.estado, DOS).almacen.piedra;
    const tercero = jugar(segundo.estado);
    expect(jugadorDe(tercero.estado, UNO).almacen.piedra).toBe(piedraUno);
    expect(jugadorDe(tercero.estado, DOS).almacen.piedra).toBeLessThan(piedraDos);
  });

  it('se cumple al terminarla, y la obra y su prestigio son del dueño de la comarca', () => {
    const estado = partida({ casaDos: 'canteros' });
    const { segundo } = proponerYResponder(estado, MURALLA, { plazo: 40 });
    const [obra] = Object.values(segundo.estado.obras);
    if (obra === undefined) throw new Error('falta la obra');
    const casiAcabada: EstadoPartida = {
      ...segundo.estado,
      obras: { [obra.id]: { ...obra, avanceMil: obra.avanceNecesarioMil - 1 } },
    };
    const final = jugar(casiAcabada);
    expect(unico(final.estado).estado).toBe('cumplido');
    expect(comarcaDe(final.estado, LLANO).obrasMayores).toContain('muralla');
    expect(final.sucesos.find((s) => s.tipo === 'hito.obra-mayor')?.jugador).toBe(UNO);
  });

  it('si no está terminada al plazo falla el cantero y la obra sigue, ya del cliente', () => {
    const estado = partida({ casaDos: 'canteros' });
    const { contrato, segundo } = proponerYResponder(estado, MURALLA, { plazo: 3 });
    const final = hasta(segundo.estado, contrato.plazo);
    expect(unico(final.estado)).toMatchObject({ estado: 'incumplido', fallo: DOS });
    const [obra] = Object.values(final.estado.obras);
    expect(obra?.porContrato).toBeUndefined();
    expect(obra?.jugador).toBe(UNO);
  });
});

describe('paso de ganado', () => {
  const PASO: CondicionesDeContrato = { tipo: 'paso', activa: 'propone', precio: 40 };

  it('con un paso vigente, los rebaños entran por cualquier camino; al plazo se cumple', () => {
    // UNO concede a DOS el paso por sus tierras.
    const estado = partida();
    const { contrato, segundo } = proponerYResponder(estado, PASO, { plazo: 3 });
    expect(contrato.estado).toBe('vigente');
    const camino = tramoEntre(mundo, c('prueba-rio'), c(LLANO));
    if (camino === undefined) throw new Error('falta el camino');
    const llano = comarcaDe(segundo.estado, LLANO);
    const dos = jugadorDe(segundo.estado, DOS);
    const vigentes = Object.values(segundo.estado.contratos ?? {});
    expect(puedeEntrar(camino, llano, dos, REALES, vigentes)).toBe(true);
    expect(puedeEntrar(camino, llano, dos, REALES, [])).toBe(false);
    const final = hasta(segundo.estado, contrato.plazo);
    expect(unico(final.estado).estado).toBe('cumplido');
    // Cumplido ya no deja pasar.
    expect(
      puedeEntrar(camino, llano, dos, REALES, Object.values(final.estado.contratos ?? {})),
    ).toBe(false);
  });
});

describe('barajar las órdenes no cambia nada (criterio 7)', () => {
  it('dos propuestas y dos respuestas, en cualquier orden, dan el mismo estado', () => {
    const estado = partida({ recuas: [conSalEnLaCosta] });
    const primero = jugar(estado, [
      propuesta(estado, ENTREGA),
      propuesta(estado, { tipo: 'paso', activa: 'propone', precio: 400 }, { de: DOS }),
      propuesta(estado, { tipo: 'prestamo', activa: 'propone', cantidad: 300, devolver: 300 }),
    ]);
    const ids = Object.keys(primero.estado.contratos ?? {}).sort() as IdContrato[];
    const deDos = ids.filter((id) => primero.estado.contratos?.[id]?.recibe === DOS);
    const deUno = ids.filter((id) => primero.estado.contratos?.[id]?.recibe === UNO);
    const ordenes = [
      ...deDos.map((id) => respuesta(primero.estado, id, true, DOS)),
      ...deUno.map((id) => respuesta(primero.estado, id, true, UNO)),
    ];
    const derecho = jugar(primero.estado, ordenes);
    const reves = jugar(primero.estado, [...ordenes].reverse());
    expect(huella(reves.estado)).toBe(huella(derecho.estado));
    expect(reves.sucesos).toEqual(derecho.sucesos);
  });
});
