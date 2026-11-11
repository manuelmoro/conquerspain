// La cronica de una partida larga de las ocho casas (ficha T-088 §2.8 y criterio 9): ningun texto
// deja un hueco `{…}` sin rellenar, y toda accion sugerida es un tipo de orden que la interfaz sabe
// contar en castellano. Y todo movimiento del almacen tiene su concepto para el desglose (T-126).
import { describe, expect, it } from 'vitest';

import {
  CASAS,
  TABLAS_DEL_JUEGO,
  TIPOS_DE_ORDEN,
  conceptoDeMovimiento,
  entradaDe,
} from '@conquer/nucleo';
import type { EstadoPartida, FuentesDeCronica } from '@conquer/nucleo';

import { jugarTurno } from './ejecutar.ts';
import { altaDelBanco, mundoPeninsula } from './partida.ts';
import { origenPreferido, robotDe } from './robots/index.ts';

const TURNOS = 72;

describe('la crónica de una partida larga de todas las casas', () => {
  it('no deja ningún hueco sin rellenar ni ninguna acción sugerida desconocida', () => {
    const reglas = TABLAS_DEL_JUEGO;
    const alta = altaDelBanco({
      semilla: '1492',
      casas: CASAS,
      reglas,
      mundo: mundoPeninsula(),
      preferencia: origenPreferido,
    });
    const robots = CASAS.map((casa) => robotDe(casa));
    let estado: EstadoPartida = alta.estado;
    const faltan = new Set<string>();
    const acciones = new Set<string>();
    const tipos = new Set<string>();
    let entradas = 0;
    let sinPastoConRebanyo = 0;
    const unidadesAjenas: string[] = [];
    const sinConcepto = new Set<string>();
    for (let i = 0; i < TURNOS; i += 1) {
      const turno = jugarTurno(estado, robots, alta.mundo, reglas);
      const fuentes: FuentesDeCronica = {
        estado: turno.estado,
        sucesos: turno.sucesos,
        turno: estado.turno,
        mundo: alta.mundo,
        reglas,
      };
      for (const suceso of turno.sucesos) {
        if (suceso.tipo === 'almacen.cambio') {
          const motivo = String(suceso.datos['motivo']);
          if (conceptoDeMovimiento(motivo).clase === 'otro') sinConcepto.add(motivo);
        }
        for (const lector of Object.values(turno.estado.jugadores)) {
          const entrada = entradaDe(suceso, lector, fuentes);
          if (entrada === null) continue;
          entradas += 1;
          tipos.add(suceso.tipo);
          for (const hueco of entrada.faltan) faltan.add(`${suceso.tipo}: {${hueco}}`);
          if (entrada.accionSugerida !== null) acciones.add(entrada.accionSugerida);
          // La unidad solo se nombra en la cronica de su duenyo (T-083 §4.5).
          if (entrada.unidad !== null && suceso.jugador !== lector.id)
            unidadesAjenas.push(suceso.tipo);
          if (suceso.tipo === 'rebanyo.sin-pasto' && entrada.unidad?.clase === 'rebanyo')
            sinPastoConRebanyo += 1;
        }
      }
      estado = turno.estado;
    }
    expect([...faltan]).toEqual([]);
    expect([...sinConcepto]).toEqual([]);
    expect([...acciones].filter((a) => !(TIPOS_DE_ORDEN as readonly string[]).includes(a))).toEqual(
      [],
    );
    // Que la partida haya contado de verdad: muchas entradas y de muchos tipos, rebaños incluidos.
    expect(entradas).toBeGreaterThan(1000);
    expect(tipos.size).toBeGreaterThan(30);
    expect(tipos.has('rebanyo.sin-pasto')).toBe(true);
    // El aviso de rebaño sin pasto lleva al rebaño (criterio 5 de T-083).
    expect(sinPastoConRebanyo).toBeGreaterThan(0);
    expect(unidadesAjenas).toEqual([]);
  }, 120_000);
});
