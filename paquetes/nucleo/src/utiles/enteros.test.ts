import { describe, expect, it } from 'vitest';

import { azarDeTexto } from './azar.ts';
import {
  MIL,
  aEntero,
  aMilesimas,
  limitar,
  multiplicarFactores,
  porcentaje,
  repartoProporcional,
} from './enteros.ts';

describe('aritmetica en milesimas', () => {
  it('convierte entre enteros y milesimas', () => {
    expect(MIL).toBe(1000);
    expect(aMilesimas(3)).toBe(3000);
    expect(aEntero(3999)).toBe(3);
    expect(aEntero(4000)).toBe(4);
  });

  it('trunca siempre hacia abajo, tambien con negativos', () => {
    expect(aEntero(-1)).toBe(-1);
    expect(aEntero(-1000)).toBe(-1);
    expect(aEntero(-1001)).toBe(-2);
  });

  it('rechaza valores que no son enteros seguros', () => {
    const noEntero = 5 / 2;
    expect(() => aMilesimas(noEntero)).toThrow(/entero seguro/);
    expect(() => aEntero(noEntero)).toThrow(/entero seguro/);
  });

  it('aplica porcentajes en milesimas', () => {
    expect(porcentaje(100, 1250)).toBe(125);
    expect(porcentaje(100, 800)).toBe(80);
    expect(porcentaje(100, 1000)).toBe(100);
    expect(porcentaje(7, 1250)).toBe(8);
    expect(porcentaje(0, 1500)).toBe(0);
  });

  it('encadena factores truncando una sola vez', () => {
    expect(multiplicarFactores(100, [1250, 800])).toBe(100);
    expect(multiplicarFactores(7, [1250])).toBe(8);
    expect(multiplicarFactores(10, [])).toBe(10);
    // Si se truncara en cada paso, 10 × 125 % × 80 % daria 9 en vez de 10.
    expect(multiplicarFactores(10, [1250, 800])).toBe(10);
  });

  it('mantiene la precision con cadenas largas de factores', () => {
    // Seis factores neutros superan 2^53 si se multiplican sin cuidado.
    expect(multiplicarFactores(1000, [1000, 1000, 1000, 1000, 1000, 1000])).toBe(1000);
    expect(multiplicarFactores(1000, [1500, 1500, 1500, 1500, 1500, 1500])).toBe(11390);
  });

  it('limita valores a un intervalo', () => {
    expect(limitar(5, 0, 100)).toBe(5);
    expect(limitar(-5, 0, 100)).toBe(0);
    expect(limitar(500, 0, 100)).toBe(100);
    expect(() => limitar(5, 100, 0)).toThrow(/del reves/);
  });
});

describe('reparto proporcional', () => {
  it('reparte por igual lo que se divide exacto', () => {
    const reparto = repartoProporcional(10, [
      { id: 'a', cantidad: 7 },
      { id: 'b', cantidad: 7 },
    ]);
    expect(reparto.get('a')).toBe(5);
    expect(reparto.get('b')).toBe(5);
  });

  it('entrega el sobrante siempre al mismo identificador', () => {
    for (let intento = 0; intento < 1000; intento += 1) {
      const peticiones =
        intento % 2 === 0
          ? [
              { id: 'a', cantidad: 7 },
              { id: 'b', cantidad: 7 },
            ]
          : [
              { id: 'b', cantidad: 7 },
              { id: 'a', cantidad: 7 },
            ];
      const reparto = repartoProporcional(11, peticiones);
      expect(reparto.get('a')).toBe(6);
      expect(reparto.get('b')).toBe(5);
    }
  });

  it('da a cada uno lo pedido cuando sobra de todo', () => {
    const reparto = repartoProporcional(100, [
      { id: 'a', cantidad: 7 },
      { id: 'b', cantidad: 3 },
    ]);
    expect(reparto.get('a')).toBe(7);
    expect(reparto.get('b')).toBe(3);
  });

  it('reparte cero cuando no hay nada que repartir o nadie pide', () => {
    expect([...repartoProporcional(0, [{ id: 'a', cantidad: 7 }]).values()]).toEqual([0]);
    expect([...repartoProporcional(10, [{ id: 'a', cantidad: 0 }]).values()]).toEqual([0]);
    expect(repartoProporcional(10, []).size).toBe(0);
  });

  it('respeta las proporciones cuando son desiguales', () => {
    const reparto = repartoProporcional(10, [
      { id: 'grande', cantidad: 30 },
      { id: 'mediano', cantidad: 15 },
      { id: 'pequenyo', cantidad: 5 },
    ]);
    expect(reparto.get('grande')).toBe(6);
    expect(reparto.get('mediano')).toBe(3);
    expect(reparto.get('pequenyo')).toBe(1);
  });

  it('rechaza peticiones negativas o repetidas', () => {
    expect(() => repartoProporcional(10, [{ id: 'a', cantidad: -1 }])).toThrow(/negativa/);
    expect(() =>
      repartoProporcional(10, [
        { id: 'a', cantidad: 1 },
        { id: 'a', cantidad: 2 },
      ]),
    ).toThrow(/dos peticiones/);
    expect(() => repartoProporcional(-1, [])).toThrow(/negativa/);
  });

  it('nunca reparte de mas ni de menos (10 000 casos con semilla fija)', () => {
    const azar = azarDeTexto('reparto-proporcional');
    for (let caso = 0; caso < 10000; caso += 1) {
      const cuantos = azar.entreInclusive(1, 6);
      const peticiones = [];
      for (let i = 0; i < cuantos; i += 1) {
        peticiones.push({ id: `p${String(i)}`, cantidad: azar.entreInclusive(0, 500) });
      }
      const disponible = azar.entreInclusive(0, 1500);
      const total = peticiones.reduce((suma, p) => suma + p.cantidad, 0);
      const reparto = repartoProporcional(disponible, peticiones);
      const repartido = [...reparto.values()].reduce((suma, v) => suma + v, 0);

      expect(repartido).toBe(Math.min(disponible, total));
      for (const peticion of peticiones) {
        const recibido = reparto.get(peticion.id) ?? -1;
        expect(recibido).toBeGreaterThanOrEqual(0);
        expect(recibido).toBeLessThanOrEqual(peticion.cantidad);
      }
    }
  });
});
