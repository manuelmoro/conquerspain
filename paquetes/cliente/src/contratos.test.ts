// «Tus contratos» (T-103): lo que dice cada contrato desde cada parte, la propuesta que sale del
// formulario y que el motor la acepta tal cual, y la fama del crédito.
import { validarIntencion } from '@conquer/nucleo';
import type { Contrato, IdComarca, IdContrato, IdJugador } from '@conquer/nucleo';
import { describe, expect, it } from 'vitest';

import {
  cierreDeContrato,
  estadoDeCasa,
  famaDeCredito,
  frasesDeContrato,
  intencionDeContrato,
  plazoDeContrato,
} from './contratos.ts';
import type { FormularioDeContrato } from './contratos.ts';

const UNO = 'casa-uno' as IdJugador;
const DOS = 'casa-dos' as IdJugador;
const n = {
  comarca: (id: string) => (id === 'costa' ? 'La Costa' : id),
  jugador: (id: string) => (id === DOS ? 'Casa Dos' : 'Casa Uno'),
};

const base = {
  id: 'contrato-1' as IdContrato,
  propone: UNO,
  recibe: DOS,
  estado: 'propuesto' as const,
  propuestoEn: 10,
  plazo: 16,
  penalizacion: 30,
  motivo: null,
  fallo: null,
};

const entrega: Contrato = {
  ...base,
  tipo: 'entrega',
  entrega: UNO,
  recurso: 'sal',
  cantidad: 20,
  comarca: 'costa' as IdComarca,
  precio: 100,
  depositado: 0,
};

describe('lo que dice un contrato', () => {
  it('se cuenta desde quien lo lee: «tú» si es su parte', () => {
    expect(frasesDeContrato(entrega, UNO, n)).toBe(
      'Tú entregas 20 de sal en La Costa a Casa Dos, que paga 100 maravedís al recibirla.',
    );
    expect(frasesDeContrato(entrega, DOS, n)).toBe(
      'Casa Uno entrega 20 de sal en La Costa a ti, que pagas 100 maravedís al recibirla.',
    );
    const paso: Contrato = { ...base, tipo: 'paso', concede: DOS, precio: 40 };
    expect(frasesDeContrato(paso, UNO, n)).toBe(
      'Casa Dos deja pasar los rebaños de tu casa por sus tierras, por cualquier camino, por 40 maravedís.',
    );
    const obra: Contrato = {
      ...base,
      tipo: 'obra',
      construye: DOS,
      comarca: 'costa' as IdComarca,
      obra: 'puente',
      hacia: 'rio' as IdComarca,
      precio: 200,
      idObra: null,
    };
    expect(frasesDeContrato(obra, DOS, n)).toMatch(/^Tú levantas un puente en La Costa hacia rio/);
  });

  it('el plazo y la penalización', () => {
    expect(plazoDeContrato(entrega, 10)).toBe('vence en 6 turnos; quien falle paga 30 maravedís');
    expect(plazoDeContrato({ ...entrega, penalizacion: 0 }, 16)).toBe('vence este turno');
  });

  it('por qué acabó un contrato cerrado', () => {
    const fallido: Contrato = {
      ...entrega,
      estado: 'incumplido',
      motivo: 'sin-entrega',
      fallo: UNO,
    };
    expect(cierreDeContrato(fallido, UNO, n.jugador)).toBe(
      'La mercancía no llegó a tiempo. Falló tu casa.',
    );
    const rechazado: Contrato = { ...entrega, estado: 'rechazado', motivo: 'sin-recursos' };
    expect(cierreDeContrato(rechazado, DOS, n.jugador)).toBe('No hay recursos.');
  });

  it('la casa ausente, en concejo o amparada se dice (T-105)', () => {
    expect(estadoDeCasa({ turnosSinOrdenes: 2, amparoHasta: null }, 10)).toBe('');
    expect(estadoDeCasa({ turnosSinOrdenes: 16, amparoHasta: null }, 10)).toBe(
      ' — ausente desde hace 16 turnos',
    );
    expect(estadoDeCasa({ turnosSinOrdenes: 30, amparoHasta: null }, 10)).toMatch(/concejo/);
    expect(estadoDeCasa({ turnosSinOrdenes: 0, amparoHasta: 20 }, 10)).toMatch(
      /amparada hasta el turno 20/,
    );
  });

  it('la fama del crédito', () => {
    expect(famaDeCredito(20)).toMatch(/mal pagador/);
    expect(famaDeCredito(50)).toBe('cumplidor');
    expect(famaDeCredito(85)).toBe('buen nombre');
  });
});

describe('la propuesta del formulario', () => {
  const formulario: FormularioDeContrato = {
    tipo: 'entrega',
    con: DOS,
    activa: 'yo',
    recurso: 'sal',
    cantidad: '20',
    comarca: 'prueba-costa',
    hacia: '',
    obra: 'puente',
    niveles: '1',
    precio: '100',
    devolver: '',
    turnos: '6',
    penalizacion: '30',
  };

  it('sale con su plazo en turnos de partida y la valida el motor', () => {
    const intencion = intencionDeContrato(formulario, 10);
    expect(intencion).toEqual({
      tipo: 'contrato',
      con: DOS,
      plazo: 16,
      penalizacion: 30,
      condiciones: {
        tipo: 'entrega',
        activa: 'propone',
        recurso: 'sal',
        cantidad: 20,
        comarca: 'prueba-costa',
        precio: 100,
      },
    });
    expect(validarIntencion({ idCliente: 'c-1', ...intencion }).ok).toBe(true);
  });

  it('cada tipo pide lo suyo; si falta algo, no hay propuesta', () => {
    expect(intencionDeContrato({ ...formulario, cantidad: '' }, 10)).toBeNull();
    expect(intencionDeContrato({ ...formulario, con: '' }, 10)).toBeNull();
    const puente = { ...formulario, tipo: 'obra' as const, activa: 'ella' as const };
    expect(intencionDeContrato(puente, 10)).toBeNull();
    const conTramo = intencionDeContrato({ ...puente, hacia: 'prueba-rio' }, 10);
    expect(conTramo?.['condiciones']).toMatchObject({
      obra: 'puente',
      hacia: 'prueba-rio',
      activa: 'recibe',
    });
    expect(validarIntencion({ idCliente: 'c-2', ...conTramo }).ok).toBe(true);
    const paso = intencionDeContrato({ ...formulario, tipo: 'paso' }, 10);
    expect(validarIntencion({ idCliente: 'c-3', ...paso }).ok).toBe(true);
    const prestamo = intencionDeContrato(
      { ...formulario, tipo: 'prestamo', cantidad: '100', devolver: '120' },
      10,
    );
    expect(validarIntencion({ idCliente: 'c-4', ...prestamo }).ok).toBe(true);
  });
});
