// Acuerdos, rupturas y reputación (ficha T-123): cada acuerdo tiene efecto y plazo; romperlo se
// anuncia a todos y cuesta crédito y prestigio; y los límites impiden blindarse contra todos.
import { describe, expect, it } from 'vitest';

import { cortejable } from '../src/reglas/ausencia.ts';
import { claveDeHostilidad } from '../src/reglas/milicia.ts';
import type { Contrato } from '../src/tipos/contratos.ts';
import type { EstadoPartida } from '../src/tipos/estado.ts';
import type { IdContrato, IdJugador, IdMercado, IdRecua } from '../src/tipos/ids.ts';
import type { CondicionesDeContrato, Orden } from '../src/tipos/ordenes.ts';
import { DOS, UNO, base, c, comarcaDe, conComarca, escenario, reglas, turno } from './recuas.ts';

function partida(): EstadoPartida {
  return conComarca(escenario({ conDos: true }), 'prueba-costa', { duenyo: DOS });
}

function proponer(estado: EstadoPartida, condiciones: CondicionesDeContrato, plazo = 5): Orden {
  return {
    ...base(estado.turno),
    jugador: UNO,
    tipo: 'contrato',
    con: DOS,
    plazo: estado.turno + plazo,
    penalizacion: 0,
    condiciones,
  };
}

/** UNO propone y DOS acepta al turno siguiente: el contrato que queda. */
function firmado(estado: EstadoPartida, condiciones: CondicionesDeContrato, plazo = 5) {
  const uno = turno(estado, [proponer(estado, condiciones, plazo)]);
  const id = Object.keys(uno.estado.contratos ?? {}).find(
    (k) => uno.estado.contratos?.[k]?.estado === 'propuesto',
  ) as IdContrato;
  const dos = turno(uno.estado, [
    {
      ...base(uno.estado.turno),
      jugador: DOS,
      tipo: 'responder-contrato',
      contrato: id,
      acepta: true,
    },
  ]);
  const contrato = dos.estado.contratos?.[id];
  if (contrato === undefined) throw new Error('sin contrato');
  return { estado: dos.estado, sucesos: dos.sucesos, contrato };
}

function cancelado(sucesos: readonly { tipo: string; datos: Record<string, unknown> }[]): unknown {
  return sucesos.find((s) => s.tipo === 'orden.estado' && s.datos['estado'] === 'cancelada')?.datos[
    'motivo'
  ];
}

const declarar = (e: EstadoPartida): Orden => ({
  ...base(e.turno),
  jugador: UNO,
  tipo: 'hostilidad',
  contra: DOS,
  declarar: true,
});

describe('no agresión', () => {
  it('al firmarla se retira la hostilidad, y mientras dure no se declara; al plazo se cumple', () => {
    const conHostilidad: EstadoPartida = {
      ...partida(),
      hostilidades: {
        [claveDeHostilidad(UNO, DOS)]: { de: UNO, contra: DOS, declaradaEn: 1, vigenteDesde: 2 },
      },
    };
    const { estado, contrato } = firmado(
      conHostilidad,
      { tipo: 'no-agresion', activa: 'propone', precio: 0 },
      3,
    );
    expect(contrato.estado).toBe('vigente');
    expect(estado.hostilidades?.[claveDeHostilidad(UNO, DOS)]).toBeUndefined();
    expect(cancelado(turno(estado, [declarar(estado)]).sucesos)).toBe('acuerdo-de-no-agresion');
    let final = estado;
    while (final.turno <= contrato.plazo) final = turno(final).estado;
    expect(final.contratos?.[contrato.id]?.estado ?? 'ya retirado').not.toBe('vigente');
  });

  it('como mucho tres a la vez: nadie se blinda contra todos (criterio 3)', () => {
    const tres: Record<string, Contrato> = {};
    for (const n of [1, 2, 3]) {
      const id = `contrato-${String(n)}` as IdContrato;
      tres[id] = {
        id,
        tipo: 'no-agresion',
        propone: UNO,
        recibe: `otra-${String(n)}` as IdJugador,
        compromete: UNO,
        estado: 'vigente',
        propuestoEn: 1,
        plazo: 40,
        penalizacion: 0,
        motivo: null,
        fallo: null,
        precio: 0,
      };
    }
    const { contrato } = firmado(
      { ...partida(), contratos: tres },
      { tipo: 'no-agresion', activa: 'propone', precio: 0 },
    );
    expect(contrato).toMatchObject({ estado: 'rechazado', motivo: 'demasiados-acuerdos' });
  });
});

describe('no cortejar', () => {
  it('quien se compromete no corteja esas comarcas; más de tres no se firma', () => {
    const { estado, contrato } = firmado(partida(), {
      tipo: 'no-cortejo',
      activa: 'propone',
      comarcas: [c('prueba-vega')],
      precio: 0,
    });
    expect(contrato.estado).toBe('vigente');
    expect(cortejable(estado, comarcaDe(estado, 'prueba-vega'), UNO, reglas)).toBe(false);
    expect(cortejable(estado, comarcaDe(estado, 'prueba-vega'), DOS, reglas)).toBe(true);
    const muchas = firmado(partida(), {
      tipo: 'no-cortejo',
      activa: 'propone',
      comarcas: [c('prueba-vega'), c('prueba-rio'), c('prueba-monte'), c('prueba-sierra')],
      precio: 0,
    });
    expect(muchas.contrato.motivo).toBe('demasiadas-comarcas');
  });
});

describe('exclusiva de venta', () => {
  it('quien la tiene no vende ese recurso en las plazas', () => {
    const { estado } = firmado(partida(), {
      tipo: 'exclusiva',
      activa: 'propone',
      recurso: 'lana',
      precio: 0,
    });
    const vender: Orden = {
      ...base(estado.turno),
      jugador: UNO,
      tipo: 'mercado',
      mercado: 'local-prueba-llano' as IdMercado,
      recua: 'recua-1' as IdRecua,
      recurso: 'lana',
      operacion: 'vender',
      cantidad: 5,
      precioLimiteMil: 1000,
    };
    expect(cancelado(turno(estado, [vender]).sucesos)).toBe('exclusiva-vigente');
  });
});

describe('romper un acuerdo (criterio 2)', () => {
  it('queda roto, se anuncia a todos y cuesta crédito y prestigio', () => {
    const { estado, contrato } = firmado(
      partida(),
      { tipo: 'no-agresion', activa: 'propone', precio: 0 },
      20,
    );
    const credito = estado.jugadores[UNO]?.credito ?? 0;
    const r = turno(estado, [
      { ...base(estado.turno), jugador: UNO, tipo: 'romper-acuerdo', contrato: contrato.id },
    ]);
    expect(r.estado.contratos?.[contrato.id]).toMatchObject({ estado: 'roto', fallo: UNO });
    expect(r.estado.jugadores[UNO]?.credito).toBe(credito - reglas.contratos.creditoPorRomper);
    const anuncio = r.sucesos.find((s) => s.tipo === 'acuerdo.roto');
    expect(anuncio?.jugador).toBeNull();
    expect(anuncio?.datos['de']).toBe(UNO);
    // El prestigio lo resta la fase 11, y sigue restado los turnos siguientes.
    expect(r.estado.jugadores[UNO]?.registro.acuerdosRotos).toBe(1);
    const sinRomper = turno(estado).estado.jugadores[UNO]?.prestigio ?? 0;
    expect(r.estado.jugadores[UNO]?.prestigio).toBe(
      sinRomper - reglas.contratos.prestigioPorRomper,
    );
    // Y ya se puede declarar la hostilidad.
    expect(cancelado(turno(r.estado, [declarar(r.estado)]).sucesos)).toBeUndefined();
  });

  it('un contrato de entrega no es un acuerdo: no se rompe, se cumple o se incumple', () => {
    const { estado, contrato } = firmado(partida(), {
      tipo: 'entrega',
      activa: 'propone',
      recurso: 'sal',
      cantidad: 5,
      comarca: c('prueba-costa'),
      precio: 10,
    });
    const r = turno(estado, [
      { ...base(estado.turno), jugador: UNO, tipo: 'romper-acuerdo', contrato: contrato.id },
    ]);
    expect(cancelado(r.sucesos)).toBe('contrato-sin-propuesta');
  });
});
