// La vista de un jugador (T-044 §4.1): las diez reglas de filtrado una a una, y una prueba de fuga
// que busca en la vista serializada cualquier dato que el jugador no deberia conocer.
import { describe, expect, it } from 'vitest';

import { ErrorDeMotor } from '../src/errores.ts';
import { rumboEntre, vistaDeJugador } from '../src/reglas/vista.ts';
import type {
  Conocimiento,
  EstadoJugador,
  EstadoPartida,
  Obra,
  Recua,
} from '../src/tipos/estado.ts';
import type { IdComarca, IdJugador, IdObra } from '../src/tipos/ids.ts';
import type { Orden } from '../src/tipos/ordenes.ts';
import { DOS, UNO, base, c, conComarca, escenario, mundo, recua, recursos } from './recuas.ts';

const SECRETO_ALMACEN = 987_654;

function conocimientoDeUno(): Record<string, Conocimiento> {
  return {
    'prueba-llano': { nivel: 'propia', turnoUltimaNoticia: 1, datos: null },
    'prueba-vega': {
      nivel: 'explorada',
      turnoUltimaNoticia: 3,
      datos: {
        duenyo: null,
        poblacion: 20,
        terreno: 'vega',
        potenciales: { labor: 4, monte: 1, pasto: 2, piedra: 1, hierro: 0, sal: 0, pesca: 0 },
        edificios: {},
      },
    },
    'prueba-monte': { nivel: 'oida', turnoUltimaNoticia: 2, datos: null },
    'prueba-sierra': { nivel: 'desconocida', turnoUltimaNoticia: 1, datos: null },
  };
}

const deDos = (id: string, cambios: Partial<Recua> = {}): Recua =>
  recua(id, { jugador: DOS, ...cambios });

/**
 * Dos casas. La uno tiene el llano, conoce la vega de hace tiempo, ha oido del monte y no sabe nada
 * de la sierra, la mina, el rio ni la costa. La dos tiene la costa y el rio y guarda secretos.
 */
function partida(opciones: { presenciaEnLaVega?: boolean } = {}): EstadoPartida {
  let estado = escenario({ conDos: true });
  estado = conComarca(estado, 'prueba-costa', { duenyo: DOS });
  estado = conComarca(estado, 'prueba-rio', { duenyo: DOS });
  estado = conComarca(estado, 'prueba-vega', {
    poblacion: 55,
    influencias: { [UNO]: 23, [DOS]: 37 },
  });
  const uno = estado.jugadores[UNO] as EstadoJugador;
  const dos = estado.jugadores[DOS] as EstadoJugador;
  const recuas: Record<string, Recua> = {
    'recua-uno': recua('recua-uno', {
      situacion: {
        donde: 'comarca',
        comarca: c(opciones.presenciaEnLaVega === true ? 'prueba-vega' : 'prueba-llano'),
      },
    }),
    'recua-dos-lejos': deDos('recua-dos-lejos', {
      situacion: { donde: 'comarca', comarca: c('prueba-mina') },
    }),
    'recua-dos-en-casa-ajena': deDos('recua-dos-en-casa-ajena', {
      situacion: { donde: 'comarca', comarca: c('prueba-llano') },
      ruta: [c('prueba-vega')],
    }),
    'recua-dos-en-la-vega': deDos('recua-dos-en-la-vega', {
      situacion: { donde: 'comarca', comarca: c('prueba-vega') },
    }),
  };
  const obra: Obra = {
    id: 'obra-secreta-dos' as IdObra,
    jugador: DOS,
    comarca: c('prueba-costa'),
    tipo: 'edificio',
    que: 'granja',
    hacia: null,
    avanceMil: 0,
    avanceNecesarioMil: 3000,
    entregado: recursos(),
    costeTotal: recursos(),
    abandonada: false,
  };
  const orden: Orden = {
    ...base(estado.turno),
    id: 'orden-secreta-dos' as Orden['id'],
    jugador: DOS,
    tipo: 'regalo',
    comarca: c('prueba-vega'),
  };
  return {
    ...estado,
    semilla: 'semilla-que-no-debe-salir',
    jugadores: {
      [UNO]: {
        ...uno,
        conocimiento: conocimientoDeUno(),
        plazas: {
          'feria-prueba': {
            turno: 2,
            fuente: 'rumor',
            preciosMil: recursos({ pan: 3000, lana: 50000 }),
            visitada: false,
          },
        },
      },
      [DOS]: {
        ...dos,
        prestigio: 321,
        almacen: recursos({ pan: SECRETO_ALMACEN }),
        conocimiento: {
          'prueba-costa': { nivel: 'propia', turnoUltimaNoticia: 1, datos: null },
          'prueba-mina': { nivel: 'explorada', turnoUltimaNoticia: 4, datos: null },
        },
      },
    },
    recuas,
    obras: { [obra.id]: obra },
    ordenes: [orden],
    clasificacion: [
      { jugador: DOS, puesto: 1, puestoAnterior: 2, prestigio: 321 },
      { jugador: UNO, puesto: 2, puestoAnterior: 1, prestigio: 0 },
    ],
  };
}

describe('la vista de un jugador, regla a regla', () => {
  const estado = partida();
  const vista = vistaDeJugador(estado, UNO, mundo);

  it('1. comarca propia: siempre y completa', () => {
    expect(vista.comarcas['prueba-llano']).toEqual({
      nivel: 'propia',
      comarca: estado.comarcas['prueba-llano'],
    });
  });

  it('2. comarca explorada: los datos de cuando se supieron, con su fecha', () => {
    const vega = vista.comarcas['prueba-vega'];
    expect(vega?.nivel).toBe('explorada');
    if (vega?.nivel !== 'explorada') return;
    expect(vega.turnoUltimaNoticia).toBe(3);
    // Hoy tiene 55 vecinos; se sabe que tenia 20.
    expect(vega.datos?.poblacion).toBe(20);
  });

  it('3. comarca oída: solo nombre y región', () => {
    expect(vista.comarcas['prueba-monte']).toEqual({
      nivel: 'oida',
      turnoUltimaNoticia: 2,
      nombre: mundo.comarcas['prueba-monte']?.nombre,
      region: mundo.comarcas['prueba-monte']?.region,
    });
  });

  it('4. comarca desconocida: nada, ni siquiera que existe', () => {
    for (const id of ['prueba-sierra', 'prueba-mina', 'prueba-rio', 'prueba-costa']) {
      expect(vista.comarcas[id]).toBeUndefined();
      expect(vista.jugador.conocimiento[id]).toBeUndefined();
    }
    expect(Object.keys(vista.comarcas).sort()).toEqual([
      'prueba-llano',
      'prueba-monte',
      'prueba-vega',
    ]);
  });

  it('5. recua propia: siempre, entera', () => {
    expect(vista.recuas).toEqual([estado.recuas['recua-uno']]);
  });

  it('6. recua ajena: solo en comarca propia o explorada con presencia, y de forma imprecisa', () => {
    // En el llano, que es propio, se ve la de la dos: su casa y su rumbo, nada mas.
    expect(vista.ajenas).toEqual([
      {
        clase: 'recua',
        casa: estado.jugadores[DOS]?.casa,
        comarca: 'prueba-llano',
        rumbo: rumboEntre(c('prueba-llano'), c('prueba-vega'), mundo),
      },
    ]);
    // En la vega, explorada, solo con una recua propia allí.
    const conPresencia = vistaDeJugador(partida({ presenciaEnLaVega: true }), UNO, mundo);
    expect(conPresencia.ajenas.map((a) => a.comarca)).toEqual(['prueba-llano', 'prueba-vega']);
    // La de la mina no se ve nunca: la mina ni se conoce.
    expect(conPresencia.ajenas.some((a) => a.comarca === 'prueba-mina')).toBe(false);
  });

  it('7. almacén ajeno: nunca', () => {
    for (const casa of vista.casas)
      expect(Object.keys(casa).sort()).toEqual(['casa', 'id', 'nombre', 'prestigio']);
    expect(JSON.stringify(vista)).not.toContain(String(SECRETO_ALMACEN));
  });

  it('8. precios de una plaza: los de la última vez que se supieron', () => {
    expect(vista.jugador.plazas).toEqual(estado.jugadores[UNO]?.plazas);
    expect(vista.jugador.plazas['feria-prueba']?.turno).toBe(2);
  });

  it('9. prestigio y clasificación: siempre, son públicos', () => {
    expect(vista.casas.find((c2) => c2.id === DOS)?.prestigio).toBe(321);
    expect(vista.clasificacion).toEqual(estado.clasificacion);
  });

  it('10. influencia ajena en comarca neutral: solo con presencia, y en tramos de 10', () => {
    const vega = vista.comarcas['prueba-vega'];
    if (vega?.nivel !== 'explorada') throw new Error('la vega tenia que verse explorada');
    expect(vega.influenciaPropia).toBe(23);
    expect(vega.influenciasAjenas).toEqual({});
    const conPresencia = vistaDeJugador(partida({ presenciaEnLaVega: true }), UNO, mundo);
    const vista2 = conPresencia.comarcas['prueba-vega'];
    if (vista2?.nivel !== 'explorada') throw new Error('la vega tenia que verse explorada');
    expect(vista2.influenciasAjenas).toEqual({ [DOS]: 30 });
  });

  it('un jugador que no está en la partida es un error, no una vista vacía', () => {
    expect(() => vistaDeJugador(estado, 'nadie' as IdJugador, mundo)).toThrow(ErrorDeMotor);
  });
});

describe('ninguna fuga de información', () => {
  it('la vista serializada no contiene nada de lo que el jugador no debe saber', () => {
    for (const presenciaEnLaVega of [false, true]) {
      const texto = JSON.stringify(vistaDeJugador(partida({ presenciaEnLaVega }), UNO, mundo));
      const prohibidos = [
        // Comarcas que no conoce, ni por su identificador.
        'prueba-sierra',
        'prueba-mina',
        'prueba-rio',
        'prueba-costa',
        // Unidades, obras y ordenes ajenas, ni por su identificador.
        'recua-dos-lejos',
        'recua-dos-en-casa-ajena',
        'recua-dos-en-la-vega',
        'obra-secreta-dos',
        'orden-secreta-dos',
        // El almacen ajeno y la semilla, que dejaria adivinar el azar.
        String(SECRETO_ALMACEN),
        'semilla-que-no-debe-salir',
        // La influencia exacta de la otra casa.
        `"${DOS}":37`,
      ];
      for (const prohibido of prohibidos) {
        expect(
          texto,
          `${prohibido} (presencia en la vega: ${String(presenciaEnLaVega)})`,
        ).not.toContain(prohibido);
      }
    }
  });
});

describe('el rumbo de una unidad ajena', () => {
  it('se da en ocho puntos, y no se da si no se mueve', () => {
    const llano = c('prueba-llano');
    const rumbos = Object.keys(mundo.comarcas)
      .filter((id) => id !== llano)
      .map((id) => rumboEntre(llano, id as IdComarca, mundo));
    for (const rumbo of rumbos) expect(rumbo).not.toBeNull();
    expect(rumboEntre(llano, llano, mundo)).toBeNull();
  });
});
