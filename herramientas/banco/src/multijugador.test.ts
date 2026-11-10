// Muchas plazas en una partida (ficha T-100): el reparto es justo en cien sorteos, la resolucion con
// doce jugadores cabe en cinco segundos y barajar el orden de los jugadores no cambia nada.
import { describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO as REGLAS, equidadDelReparto, resolverTurno } from '@conquer/nucleo';
import type { Casa, EstadoPartida, IdJugador, Orden, Participante } from '@conquer/nucleo';
import { huella, prepararPartida, vistaDeJugador } from '@conquer/nucleo';

import { jugarTurno } from './ejecutar.ts';
import { altaDelBanco, mundoPeninsula } from './partida.ts';
import { robotDe } from './robots/index.ts';
import type { Robot } from './robots/robot.ts';

const CASAS: readonly Casa[] = [
  'mesta',
  'ferrones',
  'canteros',
  'mercaderes',
  'monjes',
  'salineros',
  'arrieros',
  'hortelanos',
];
/** Las que repiten en una partida de doce. */
const DOBLES: readonly Casa[] = ['mesta', 'mercaderes', 'monjes', 'hortelanos'];

const doce: readonly Participante[] = [
  ...CASAS.map((casa) => ({ id: casa as string as IdJugador, nombre: casa, casa })),
  ...DOBLES.map((casa) => ({ id: `${casa}-2` as IdJugador, nombre: `${casa} (2)`, casa })),
];

function robots(): Robot[] {
  return [
    ...CASAS.map((casa) => robotDe(casa)),
    ...DOBLES.map((casa) => ({ ...robotDe(casa), jugador: `${casa}-2` })),
  ];
}

describe('el reparto con doce jugadores', () => {
  it('en cien sorteos nadie empieza sin lo básico y el peor comienzo no se aleja del mejor', () => {
    const mundo = mundoPeninsula();
    let peor = 1000;
    for (let i = 0; i < 100; i += 1) {
      const r = prepararPartida({
        mundo,
        reglas: REGLAS,
        semilla: `reparto-${String(i)}`,
        participantes: doce,
      });
      if (!r.ok) throw new Error(`el sorteo ${String(i)} no sale`);
      for (const p of doce) expect(r.valor.ofertas[p.id]?.length ?? 0).toBeGreaterThan(0);
      const e = equidadDelReparto(r.valor.mundo, r.valor.ofertas, REGLAS);
      expect(e.sinLoBasico).toEqual([]);
      peor = Math.min(peor, e.peorFrenteAlMejorMil);
    }
    expect(peor).toBeGreaterThanOrEqual(REGLAS.arranque.recorte.equidadMinimaMil);
  }, 300_000);
});

describe('la resolución con doce jugadores', () => {
  const alta = altaDelBanco({ semilla: 'doce', dobles: DOBLES });
  const { mundo } = alta;
  // Unos turnos jugados, para que haya recuas, obras y mercado que resolver.
  let estado: EstadoPartida = alta.estado;
  for (let i = 0; i < 8; i += 1) estado = jugarTurno(estado, robots(), mundo, REGLAS).estado;
  const ordenes: Orden[] = robots().flatMap(
    (r) =>
      r.decidir(vistaDeJugador(estado, (r.jugador ?? r.casa) as IdJugador, mundo), mundo, REGLAS)
        .ordenes,
  );

  it('juegan los doce, con dos jugadores de una misma casa', () => {
    expect(Object.keys(estado.jugadores)).toHaveLength(12);
    expect(estado.jugadores['mesta-2']?.casa).toBe('mesta');
    expect(ordenes.length).toBeGreaterThan(0);
  });

  it('un turno se resuelve en menos de cinco segundos', () => {
    const inicio = performance.now();
    resolverTurno(estado, ordenes, mundo, REGLAS);
    expect(performance.now() - inicio).toBeLessThan(5000);
  }, 60_000);

  it('barajar el orden de los jugadores y de las órdenes no cambia la huella del turno', () => {
    const base = resolverTurno(estado, ordenes, mundo, REGLAS);
    const alReves: EstadoPartida = {
      ...estado,
      jugadores: Object.fromEntries(Object.entries(estado.jugadores).reverse()),
    };
    const barajado = resolverTurno(alReves, [...ordenes].reverse(), mundo, REGLAS);
    expect(huella(barajado.estado)).toBe(huella(base.estado));
    expect(huella(barajado.sucesos)).toBe(huella(base.sucesos));
  }, 60_000);
});
