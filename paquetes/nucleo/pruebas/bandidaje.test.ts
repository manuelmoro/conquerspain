// Bandidaje (ficha T-122): el riesgo tiene techo y se baja invirtiendo; la escolta lo anula; y un
// asalto se lleva una parte de la carga, nunca la recua.
import { describe, expect, it } from 'vitest';

import { botinDe, riesgoDeTramoMil } from '../src/reglas/bandidaje.ts';
import type { EstadoPartida } from '../src/tipos/estado.ts';
import type { IdComarca, IdMesnada } from '../src/tipos/ids.ts';
import type { Camino } from '../src/tipos/mundo.ts';
import type { TablasDeReglas } from '../src/tipos/reglas.ts';
import { UNO, c, de, escenario, recua, recursos, reglas, turno } from './recuas.ts';

const PUERTO: Camino = {
  desde: 'a' as IdComarca,
  hasta: 'b' as IdComarca,
  terreno: 'sierra',
  jornadasBase: 5,
  vado: false,
  puertoDeMontanya: 'Puerto de Prueba',
  cierraEnInvierno: true,
  canyada: null,
  calzadaRomana: false,
};
const desierta = { conDueno: false, venta: false, lealtad: null };
const segura = { conDueno: true, venta: true, lealtad: 90 };

describe('el riesgo de un tramo (criterio 1)', () => {
  it('nunca pasa del máximo, ni en el peor puerto con las dos puntas desleales', () => {
    const desleal = { conDueno: true, venta: false, lealtad: 5 };
    expect(riesgoDeTramoMil(PUERTO, [desleal, desleal], false, false, reglas)).toBe(
      reglas.bandidaje.riesgoMaximoMil,
    );
    expect(
      riesgoDeTramoMil(PUERTO, [desierta, desierta], false, false, reglas),
    ).toBeLessThanOrEqual(reglas.bandidaje.riesgoMaximoMil);
  });

  it('se baja a casi nada con ventas, lealtad y calzada; y a nada con escolta', () => {
    const llano = { ...PUERTO, terreno: 'llano' as const, puertoDeMontanya: null };
    expect(riesgoDeTramoMil(llano, [segura, segura], true, false, reglas)).toBeLessThanOrEqual(10);
    expect(riesgoDeTramoMil(PUERTO, [desierta, desierta], false, true, reglas)).toBe(0);
  });

  it('el botín es la cuarta parte de cada cosa, redondeando hacia abajo', () => {
    expect(botinDe(recursos({ pan: 40, sal: 7, maravedis: 101 }), reglas)).toEqual(
      recursos({ pan: 10, sal: 1, maravedis: 25 }),
    );
  });
});

describe('el asalto (criterio 2)', () => {
  // Con el riesgo al máximo posible, todo paso es un asalto: se ve lo que se lleva.
  const SEGURO_ASALTO: TablasDeReglas = {
    ...reglas,
    bandidaje: { ...reglas.bandidaje, baseMil: 1000, riesgoMaximoMil: 1000 },
  };
  const conRecua = (): EstadoPartida =>
    escenario({
      recuas: [
        recua('recua-1', {
          ruta: [c('prueba-vega')],
          carga: recursos({ pan: 40, sal: 8, lana: 20 }),
        }),
      ],
    });

  it('se lleva una parte de la carga y la recua sigue entera y en camino', () => {
    const antes = conRecua();
    const { estado, sucesos } = turno(antes, [], SEGURO_ASALTO);
    const r = de(estado, 'recua-1');
    expect(sucesos.find((s) => s.tipo === 'bandidaje.asalto')?.jugador).toBe(UNO);
    expect(r.acemilas).toBe(de(antes, 'recua-1').acemilas);
    expect(r.carga.lana).toBe(15);
    expect(r.situacion).toEqual({ donde: 'comarca', comarca: c('prueba-vega') });
  });

  it('con una mesnada propia en una punta, no hay asalto', () => {
    const escoltada: EstadoPartida = {
      ...conRecua(),
      mesnadas: {
        m: {
          id: 'm' as IdMesnada,
          jugador: UNO,
          nombre: 'Escolta',
          origen: c('prueba-llano'),
          hombres: 10,
          situacion: { donde: 'comarca', comarca: c('prueba-llano') },
          turnosFuera: 0,
        },
      },
    };
    expect(
      turno(escoltada, [], SEGURO_ASALTO).sucesos.some((s) => s.tipo === 'bandidaje.asalto'),
    ).toBe(false);
  });
});
