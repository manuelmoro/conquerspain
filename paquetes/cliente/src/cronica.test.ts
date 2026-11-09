// El archivo de cronicas y la clasificacion (ficha T-085, criterio 2): navegar por turno y por anyo,
// y traer del servidor la cronica de cualquier turno pasado y la clasificacion con su desglose.
import { describe, expect, it } from 'vitest';

import { anyoDe, anyosDelArchivo, moverTurno, ultimoResuelto } from './archivo.ts';
import { montar } from './prueba-comun.ts';

describe('la navegación del archivo', () => {
  it('va del 1 al último turno resuelto, sin salirse', () => {
    expect(ultimoResuelto(1)).toBe(0);
    expect(ultimoResuelto(30)).toBe(29);
    expect(moverTurno(5, -1, 29)).toBe(4);
    expect(moverTurno(1, -1, 29)).toBe(1);
    expect(moverTurno(29, 1, 29)).toBe(29);
  });

  it('salta a cada año por su primer turno', () => {
    expect(anyoDe(24, 24)).toBe(1);
    expect(anyoDe(25, 24)).toBe(2);
    expect(anyosDelArchivo(0, 24)).toEqual([]);
    expect(anyosDelArchivo(50, 24)).toEqual([
      { anyo: 1, turno: 1 },
      { anyo: 2, turno: 25 },
      { anyo: 3, turno: 49 },
    ]);
  });
});

describe('el archivo y la clasificación contra el servidor', () => {
  it('trae la crónica de un turno pasado y la clasificación con su desglose', async () => {
    const m = await montar({ turnosJugados: 3 });
    await m.almacen.abrirPartida('p1');
    m.almacen.abrirCronica(1);
    expect(m.almacen.estado.cronica).toEqual({ turno: 1, vista: 'cronica' });
    const primera = await m.almacen.pedirCronica(1);
    expect(primera?.turno).toBe(1);
    expect(primera?.entradas.length).toBeGreaterThan(0);
    const c = await m.almacen.pedirClasificacion();
    expect(c?.filas.length).toBeGreaterThan(0);
    for (const f of c?.filas ?? []) {
      const suma = Object.values(f.capitulos).reduce((t, n) => t + n, 0) - f.penalizaciones;
      expect(suma).toBe(f.prestigio);
    }
    // Abrir otra cosa cierra la crónica: el panel enseña una sola.
    m.almacen.abrirMercado();
    expect(m.almacen.estado.cronica).toBeNull();
    await m.cerrar();
  }, 120_000);
});
