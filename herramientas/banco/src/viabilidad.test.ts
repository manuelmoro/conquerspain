// Viabilidad del arranque (ficha T-049 §4.6): ningún origen empieza condenado.
//
// El escenario es el más duro que se puede pedir sin mentir: la casa sola en su comarca y **sin dar
// una sola orden** durante un año entero. Nadie juega peor que no jugar, así que esto es la cota
// inferior. Un origen es viable si no pasa escasez, o si con lo que recauda puede comprar el pan
// que le falta: eso es lo que dice su casa que va a hacer.
//
// La muestra no la elige quien escribe la prueba: para cada casa y cada perfil de origen se toma el
// primero en orden de identificador, y se publican también los resultados desfavorables.
import { describe, expect, it } from 'vitest';

import {
  CASAS,
  TABLAS_DEL_JUEGO,
  arranqueDe,
  comparar,
  origenesPosibles,
  panDelAnyo,
  panQueComeElAnyo,
  perfilDe,
  resolverTurno,
} from '@conquer/nucleo';
import type { Casa, ComarcaMundo, EstadoPartida, IdComarca, IdJugador } from '@conquer/nucleo';

import { altaDelBanco, mundoPeninsula } from './partida.ts';

const REGLAS = TABLAS_DEL_JUEGO;
const MUNDO = mundoPeninsula();
const TURNOS_DEL_ANYO = 24;

interface Resultado {
  readonly casa: Casa;
  readonly comarca: string;
  readonly perfil: string;
  readonly turnosConEscasez: number;
  readonly faltaDePan: number;
  readonly poderDeCompra: number;
  readonly poblacionFinal: number;
  readonly viable: boolean;
}

/** Un origen por perfil y casa: el primero en orden de identificador, sin escoger el que convenga. */
function muestraDe(casa: Casa): ComarcaMundo[] {
  const porPerfil = new Map<string, ComarcaMundo>();
  for (const comarca of [...origenesPosibles(MUNDO, casa, REGLAS)].sort((a, b) =>
    comparar(a.id, b.id),
  )) {
    const perfil = perfilDe(comarca);
    if (!porPerfil.has(perfil)) porPerfil.set(perfil, comarca);
  }
  return [...porPerfil.values()];
}

/** Un año entero sin dar ninguna orden, en la comarca dada. */
function unAnyoQuieto(casa: Casa, comarca: ComarcaMundo): Resultado {
  const alta = altaDelBanco({
    semilla: `viabilidad-${comarca.id}`,
    casas: [casa],
    reglas: REGLAS,
    recortar: false,
    origenesFijos: { [casa]: comarca.id },
  });
  let estado: EstadoPartida = alta.estado;
  const jugador = casa as string as IdJugador;
  let turnosConEscasez = 0;
  for (let turno = 0; turno < TURNOS_DEL_ANYO; turno += 1) {
    estado = resolverTurno(estado, [], alta.mundo, REGLAS).estado;
    if (estado.jugadores[jugador]?.escasez === true) turnosConEscasez += 1;
  }
  const arranque = arranqueDe(comarca, casa, REGLAS);
  const maravedis = estado.jugadores[jugador]?.almacen.maravedis ?? 0;
  const precio = REGLAS.recursos.pan.precioBaseMil;
  const poderDeCompra = precio === 0 ? 0 : Math.floor((maravedis * 1000) / precio);
  const faltaDePan = Math.max(
    0,
    panQueComeElAnyo(comarca, REGLAS) - panDelAnyo(comarca, arranque.edificios, casa, REGLAS),
  );
  return {
    casa,
    comarca: comarca.id,
    perfil: perfilDe(comarca),
    turnosConEscasez,
    faltaDePan,
    poderDeCompra,
    poblacionFinal: estado.comarcas[comarca.id]?.poblacion ?? 0,
    viable: turnosConEscasez === 0 || poderDeCompra >= faltaDePan,
  };
}

describe('ningún origen empieza condenado', () => {
  const resultados: Resultado[] = [];

  it.each(CASAS.map((casa) => [casa]))(
    '%s: todos los perfiles de origen aguantan el primer año',
    (casa) => {
      const suyos = muestraDe(casa).map((comarca) => unAnyoQuieto(casa, comarca));
      resultados.push(...suyos);
      const malos = suyos.filter((r) => !r.viable);
      expect(
        malos,
        malos
          .map(
            (r) =>
              `${r.casa} en ${r.comarca} (${r.perfil}): ${String(r.turnosConEscasez)} turnos de escasez, le faltan ${String(r.faltaDePan)} de pan y solo puede comprar ${String(r.poderDeCompra)}`,
          )
          .join('\n'),
      ).toEqual([]);
      expect(suyos.length).toBeGreaterThan(0);
    },
    120_000,
  );

  it('los casos duros del catálogo están en la muestra y también aguantan', () => {
    // Los que la bitácora señaló como orígenes condenados, y los perfiles que pide la ficha.
    const duros: readonly (readonly [Casa, IdComarca])[] = [
      ['ferrones', 'senyorio-de-molina' as IdComarca], // labor 1
      ['salineros', 'bahia-de-cadiz' as IdComarca], // costa pesquera y salinera
      ['salineros', 'valles-alaveses' as IdComarca], // salina de tierra adentro
      ['hortelanos', 'vega-de-granada' as IdComarca], // vega
      ['mesta', 'zafra-rio-bodion' as IdComarca], // pasto de invierno
    ];
    const malos: string[] = [];
    for (const [casa, id] of duros) {
      const comarca = MUNDO.comarcas[id];
      if (comarca === undefined) throw new Error(`no existe la comarca ${id}`);
      const posible = origenesPosibles(MUNDO, casa, REGLAS).some((c) => c.id === id);
      expect(posible, `${id} no es origen de ${casa}`).toBe(true);
      const resultado = unAnyoQuieto(casa, comarca);
      if (!resultado.viable) {
        malos.push(
          `${casa} en ${id}: ${String(resultado.turnosConEscasez)} turnos de escasez, faltan ${String(resultado.faltaDePan)} y compra ${String(resultado.poderDeCompra)}`,
        );
      }
    }
    expect(malos).toEqual([]);
  }, 120_000);
});
