// Formacion de precios (T-037): desequilibrio, impulso, regresion al base, recortes y horquilla.
import { describe, expect, it } from 'vitest';

import { MERCADO } from '../src/datos/mercado.ts';
import { DATOS_DE_RECURSOS } from '../src/datos/recursos.ts';
import { cupoDeMenores, limitesDeMenores } from '../src/reglas/mercaderesMenores.ts';
import {
  desequilibrioMil,
  limitesDePrecio,
  nuevoPrecioMil,
  topeDeVolumen,
} from '../src/reglas/precios.ts';
import { RECURSOS_COMERCIABLES } from '../src/tipos/recursos.ts';
import { azarDeTexto } from '../src/utiles/azar.ts';

const lana = DATOS_DE_RECURSOS.lana;

describe('topeDeVolumen', () => {
  it('multiplica la base por el volumen de la plaza: pequenya x1, mediana x3, grande x8', () => {
    expect(topeDeVolumen('pequenya', MERCADO)).toBe(40);
    expect(topeDeVolumen('mediana', MERCADO)).toBe(120);
    expect(topeDeVolumen('grande', MERCADO)).toBe(320);
  });

  it('si la tabla no dice cuanto multiplica un volumen, lo dice en castellano', () => {
    const tabla = { ...MERCADO, multiplicadorVolumen: { pequenya: 1 } };
    expect(() => topeDeVolumen('grande', tabla)).toThrow(/multiplicadorVolumen/);
  });
});

describe('desequilibrioMil', () => {
  it('va de -1000 (todo oferta) a 1000 (todo demanda) y es 0 sin nada que casar', () => {
    expect(desequilibrioMil(0, 0)).toBe(0);
    expect(desequilibrioMil(10, 0)).toBe(1000);
    expect(desequilibrioMil(0, 10)).toBe(-1000);
    expect(desequilibrioMil(30, 10)).toBe(500);
    expect(desequilibrioMil(20, 20)).toBe(0);
  });

  it('redondea hacia abajo tambien con desequilibrio negativo', () => {
    expect(desequilibrioMil(40, 60)).toBe(-200);
    expect(desequilibrioMil(0, 3)).toBe(-1000);
    expect(desequilibrioMil(1, 2)).toBe(-334);
  });
});

describe('limitesDePrecio y limitesDeMenores', () => {
  it('el suelo es el 40 % y el techo el 250 % del base', () => {
    expect(limitesDePrecio(lana.precioBaseMil, MERCADO)).toEqual({
      sueloMil: 20000,
      techoMil: 125000,
    });
  });

  it('los menores compran hasta un 10 % sobre el base y venden desde un 10 % bajo el base', () => {
    expect(limitesDeMenores(lana.precioBaseMil, MERCADO)).toEqual({
      compraHastaMil: 55000,
      vendeDesdeMil: 45000,
    });
  });

  it('el cupo de los menores baja con el comercio entre jugadores y nunca es negativo', () => {
    expect(cupoDeMenores(320, 0, MERCADO)).toBe(320);
    expect(cupoDeMenores(320, 100, MERCADO)).toBe(220);
    expect(cupoDeMenores(320, 500, MERCADO)).toBe(0);
    expect(cupoDeMenores(320, 0, { ...MERCADO, liquidezMercaderesMenoresMil: 0 })).toBe(0);
  });
});

describe('nuevoPrecioMil', () => {
  it('sin desequilibrio y en el base, el precio no se mueve', () => {
    expect(nuevoPrecioMil(50000, 0, lana, MERCADO)).toBe(50000);
  });

  it('con toda la plaza comprando sube el maximo, un 15 %, menos la regresion al base', () => {
    // 50000 + 15 % = 57500; la regresion devuelve el 10 % de los 7500 de distancia.
    expect(nuevoPrecioMil(50000, 1000, lana, MERCADO)).toBe(56750);
  });

  it('con toda la plaza vendiendo baja el maximo, un 15 %, mas la regresion al base', () => {
    expect(nuevoPrecioMil(50000, -1000, lana, MERCADO)).toBe(43250);
  });

  it('un desequilibrio pequenyo mueve poco: la elasticidad de la lana es 500', () => {
    // -200 por 500 son -100 milesimas (un 10 %): 45000, y la regresion suma 500.
    expect(nuevoPrecioMil(50000, -200, lana, MERCADO)).toBe(45500);
  });

  it('cada recurso se mueve segun su elasticidad: el hierro mas que la piedra', () => {
    const hierro = DATOS_DE_RECURSOS.hierro;
    const piedra = DATOS_DE_RECURSOS.piedra;
    const sube = (r: typeof hierro): number =>
      nuevoPrecioMil(r.precioBaseMil, 100, r, MERCADO) - r.precioBaseMil;
    expect(sube(hierro) / hierro.precioBaseMil).toBeGreaterThan(
      sube(piedra) / piedra.precioBaseMil,
    );
  });

  it('cuando el impulso y la regresion tiran a la vez, el total sigue sin pasar del 15 %', () => {
    // 21000 esta casi en el suelo (20000): el impulso al alza y la regresion suman en el mismo sentido.
    const sube = nuevoPrecioMil(21000, 1000, lana, MERCADO);
    expect(sube - 21000).toBeLessThanOrEqual(Math.floor((21000 * 150) / 1000));
  });

  it('no baja del suelo ni sube del techo, por mucha oferta o demanda que haya', () => {
    const { sueloMil, techoMil } = limitesDePrecio(lana.precioBaseMil, MERCADO);
    let precio = lana.precioBaseMil;
    for (let i = 0; i < 60; i += 1) precio = nuevoPrecioMil(precio, -1000, lana, MERCADO);
    // La regresion tira hacia el base con la misma fuerza con que la oferta empuja hacia abajo,
    // asi que no llega al suelo; pero no se sale nunca de la horquilla.
    expect(precio).toBeGreaterThanOrEqual(sueloMil);
    expect(nuevoPrecioMil(sueloMil, -1000, lana, MERCADO)).toBeGreaterThanOrEqual(sueloMil);
    expect(nuevoPrecioMil(techoMil, 1000, lana, MERCADO)).toBeLessThanOrEqual(techoMil);
  });

  it('una tabla sin regresion y con impulso alto llega al suelo y se queda ahi', () => {
    const empujon = { ...MERCADO, regresionAlBaseMil: 0 };
    const { sueloMil } = limitesDePrecio(lana.precioBaseMil, empujon);
    let precio = lana.precioBaseMil;
    for (let i = 0; i < 20; i += 1) precio = nuevoPrecioMil(precio, -1000, lana, empujon);
    expect(precio).toBe(sueloMil);
  });
});

describe('propiedades del precio', () => {
  it('nunca se mueve mas de un 15 % por turno ni sale de la horquilla 40 %-250 % (5 000 casos)', () => {
    const azar = azarDeTexto('precios-propiedad');
    for (let caso = 0; caso < 5000; caso += 1) {
      const recurso = DATOS_DE_RECURSOS[azar.elegir(RECURSOS_COMERCIABLES)];
      const { sueloMil, techoMil } = limitesDePrecio(recurso.precioBaseMil, MERCADO);
      const antes = azar.entreInclusive(sueloMil, techoMil);
      const des = azar.entreInclusive(-1000, 1000);
      const despues = nuevoPrecioMil(antes, des, recurso, MERCADO);
      const maximo = Math.floor((antes * MERCADO.movimientoMaximoPorTurnoMil) / 1000);
      expect(Math.abs(despues - antes)).toBeLessThanOrEqual(maximo);
      expect(despues).toBeGreaterThanOrEqual(sueloMil);
      expect(despues).toBeLessThanOrEqual(techoMil);
    }
  });

  it('sin actividad, un precio desviado un 15 % vuelve hacia el base y en diez turnos ha recorrido al menos el 60 % del camino', () => {
    for (const signo of [1, -1]) {
      const inicial = lana.precioBaseMil + signo * 7500;
      let precio = inicial;
      let distancia = Math.abs(precio - lana.precioBaseMil);
      for (let turno = 1; turno <= 10; turno += 1) {
        precio = nuevoPrecioMil(precio, 0, lana, MERCADO);
        const ahora = Math.abs(precio - lana.precioBaseMil);
        expect(ahora).toBeLessThan(distancia);
        distancia = ahora;
      }
      expect(distancia).toBeLessThanOrEqual(Math.floor((7500 * 4) / 10));
    }
  });

  it('sin actividad, la regresion llega exactamente al base y no se pasa', () => {
    for (const inicial of [20000, 42500, 49999, 50001, 57500, 125000]) {
      let precio = inicial;
      for (let turno = 1; turno <= 200; turno += 1) {
        const nuevo = nuevoPrecioMil(precio, 0, lana, MERCADO);
        // Nunca cruza el base: si estaba por debajo, sigue por debajo o llega.
        expect(Math.sign(nuevo - lana.precioBaseMil)).not.toBe(
          -Math.sign(precio - lana.precioBaseMil),
        );
        precio = nuevo;
      }
      expect(precio).toBe(lana.precioBaseMil);
    }
  });
});
