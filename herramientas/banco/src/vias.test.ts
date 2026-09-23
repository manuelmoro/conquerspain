// Cada robot juega su vía (fichas T-046 §6.3 y T-050 §6). La prueba es la misma del informe
// (`PRUEBA_DE_VIA`) y exige la acción distintiva de cada casa, no que produzca ni que dos contadores
// coincidan.
//
// Hay dos clases de prueba, y no se mezclan:
// - de **vía en su tierra**: la casa sola en un origen del catálogo donde su vía tiene sentido, sin
//   preparar nada; lo que sale es lo que sale jugando;
// - de **capacidad**: un escenario preparado a mano (lo explorado, una plaza con precios, una
//   carestía) que demuestra que el robot sabe hacer lo que su vía pide cuando la ocasión existe.
//   Que la ocasión exista en una partida normal lo dicen los informes, con su motivo si no.
import { describe, expect, it } from 'vitest';

import {
  TABLAS_DEL_JUEGO,
  claveDeTramo,
  explicar,
  idDeMercadoLocal,
  precioBaseLocalMil,
  validarEstado,
} from '@conquer/nucleo';
import type {
  Casa,
  IdAcontecimiento,
  Conocimiento,
  EstadoMercado,
  EstadoPartida,
  IdComarca,
  IdJugador,
  Mundo,
  Recurso,
  Recursos,
  Suceso,
  Tradicion,
} from '@conquer/nucleo';

import { jugarPartida, jugarTurno } from './ejecutar.ts';
import { PRUEBA_DE_VIA, cifrasDeVia } from './informe.ts';
import type { MetricasDePartida } from './metricas.ts';
import { Registro, resumir } from './metricas.ts';
import { altaDelBanco, mundoPeninsula } from './partida.ts';
import { robotDe } from './robots/index.ts';
import type { Motivo } from './robots/motivos.ts';

const REGLAS = TABLAS_DEL_JUEGO;

/** Las cifras de la partida con los nombres que usa `PRUEBA_DE_VIA`. */
function cifrasDe(partida: MetricasDePartida): Record<string, number> {
  const jugador = partida.jugadores[0];
  if (jugador === undefined) throw new Error('la partida no tiene jugadores');
  return cifrasDeVia(resumir(partida, jugador));
}

/** Los motivos que dio el robot a lo largo de la partida, sin repetir. */
function motivosDe(partida: MetricasDePartida): Set<Motivo> {
  return new Set(partida.jugadores[0]?.filas.flatMap((f) => f.motivos) ?? []);
}

/**
 * La casa sola en la peninsula entera, **sin recortar** y en la comarca que se le diga (T-049):
 * esto prueba que su via es posible donde su via tiene sentido, no que el sorteo se la ponga a tiro.
 */
function sola(casa: Casa, origen: string, turnos: number): MetricasDePartida {
  return jugarPartida({
    semilla: '1492',
    turnos,
    casas: [casa],
    cadencia: 1,
    reglas: REGLAS,
    mundo: mundoPeninsula(),
    estados: null,
    recortar: false,
    origenesFijos: { [casa]: origen as IdComarca },
  });
}

/** Casa, comarca de origen y turnos para que su via salga jugando, sin preparar nada. */
const EN_SU_TIERRA: readonly (readonly [Casa, string, number, string])[] = [
  ['ferrones', 'senyorio-de-molina', 96, 'en el señorío de Molina'],
  ['canteros', 'tierra-de-toledo', 120, 'en la Tierra de Toledo'],
  ['monjes', 'evora', 72, 'en Évora'],
  ['salineros', 'valles-alaveses', 72, 'en los Valles Alaveses, con la sal de Añana'],
  ['hortelanos', 'vega-de-granada', 48, 'en la Vega de Granada, vendiendo el pan que sobra'],
];

/** Una partida preparada a mano, jugada turno a turno con su registro y sus sucesos. */
interface Jugada {
  readonly partida: MetricasDePartida;
  readonly sucesos: readonly (readonly [number, Suceso])[];
  readonly final: EstadoPartida;
}

function jugar(
  estado: EstadoPartida,
  mundo: Mundo,
  casa: Casa,
  turnos: number,
  semilla: string,
): Jugada {
  const robots = [robotDe(casa)];
  const registro = new Registro(REGLAS, mundo, 1);
  registro.empezar(estado);
  const sucesos: [number, Suceso][] = [];
  let actual = estado;
  for (let i = 0; i < turnos; i += 1) {
    const turno = jugarTurno(actual, robots, mundo, REGLAS);
    for (const s of turno.sucesos) sucesos.push([actual.turno, s]);
    actual = turno.estado;
    registro.anotar(actual, turno.sucesos, turno.decisiones);
  }
  return { partida: registro.cerrar(actual, semilla, turnos), sucesos, final: actual };
}

function validar(estado: EstadoPartida, mundo: Mundo): EstadoPartida {
  const valido = validarEstado(estado, mundo);
  if (!valido.ok) throw new Error(explicar(valido.errores));
  return valido.valor;
}

/** La casa sola en su origen, con las comarcas a `tramos` tramos o menos ya exploradas. */
function conLoCercanoExplorado(casa: Casa, origen: string, tramos: number) {
  const alta = altaDelBanco({
    semilla: '1492',
    casas: [casa],
    reglas: REGLAS,
    mundo: mundoPeninsula(),
    recortar: false,
    origenesFijos: { [casa]: origen as IdComarca },
  });
  const yo = casa as string as IdJugador;
  const jugador = alta.estado.jugadores[yo];
  if (jugador === undefined) throw new Error(`falta el jugador ${casa}`);
  const distancia = new Map<string, number>([[origen, 0]]);
  const pendientes = [origen];
  for (let actual = pendientes.shift(); actual !== undefined; actual = pendientes.shift()) {
    for (const vecina of alta.mundo.vecinos[actual] ?? []) {
      if (distancia.has(vecina)) continue;
      distancia.set(vecina, (distancia.get(actual) ?? 0) + 1);
      pendientes.push(vecina);
    }
  }
  const conocimiento: Record<string, Conocimiento> = { ...jugador.conocimiento };
  for (const [id, n] of distancia) {
    if (n > 0 && n <= tramos) {
      conocimiento[id] = { nivel: 'explorada', turnoUltimaNoticia: 1, datos: null };
    }
  }
  const estado = validar(
    { ...alta.estado, jugadores: { [yo]: { ...jugador, conocimiento } } },
    alta.mundo,
  );
  return { estado, mundo: alta.mundo };
}

describe('cada robot juega su vía en su tierra', () => {
  it.each(EN_SU_TIERRA)(
    '%s (origen %s, %i turnos, %s)',
    (casa, origen, turnos) => {
      const cifras = cifrasDe(sola(casa, origen, turnos));
      expect(PRUEBA_DE_VIA[casa].cumple(cifras), JSON.stringify(cifras)).toBe(true);
    },
    60_000,
  );
});

describe('la Mesta hace la trashumancia', () => {
  it('en Sayago, con lo que tiene a dos tramos explorado: invernadero, agostadero, lana vendida', () => {
    // Sayago es invernadero; Sanabria y Bragança, agostaderos a dos tramos. Se le da explorado lo
    // que un jugador conoceria tras sus primeras salidas: el resto lo decide el robot.
    const { estado, mundo } = conLoCercanoExplorado('mesta', 'sayago', 2);
    const jugada = jugar(estado, mundo, 'mesta', 96, 'mesta-sayago');
    const cifras = cifrasDe(jugada.partida);
    expect(PRUEBA_DE_VIA.mesta.cumple(cifras), JSON.stringify(cifras)).toBe(true);

    // Llega a los dos pastos, cada uno en su estacion.
    const verano = REGLAS.estaciones.turnosPastoDeVerano;
    const delAnyo = (turno: number): number => ((turno - 1) % REGLAS.estaciones.turnosPorAnyo) + 1;
    const llegadas = jugada.sucesos.filter(([, s]) => s.tipo === 'rebanyo.llega');
    const aUnPasto = (turno: number, comarca: string | null, deVerano: boolean): boolean => {
      const rasgos = comarca === null ? [] : (mundo.comarcas[comarca]?.rasgos ?? []);
      const pasto = deVerano
        ? rasgos.includes('pasto-de-verano')
        : rasgos.some((r) => r === 'pasto-de-invierno' || r === 'dehesa' || r === 'montado');
      // Llega el turno del cambio o el anterior: el que sale para llegar justo al cambio.
      const siguiente = verano.includes(delAnyo(turno + 1));
      return pasto && (verano.includes(delAnyo(turno)) === deVerano || siguiente === deVerano);
    };
    expect(llegadas.some(([t, s]) => aUnPasto(t, s.comarca, true))).toBe(true);
    expect(llegadas.some(([t, s]) => aUnPasto(t, s.comarca, false))).toBe(true);

    // Esquila con calidad: pasta la mayor parte del anyo en el pasto que toca.
    const calidades = jugada.sucesos
      .filter(([, s]) => s.tipo === 'rebanyo.esquileo')
      .map(([, s]) => Number(s.datos['calidadMil']));
    expect(Math.max(...calidades)).toBeGreaterThanOrEqual(700);

    // El ganado sobrevive: el primer rebanyo conserva mas de la mitad de sus cabezas en cuatro anyos
    // de canyadas, y la cabanya crece.
    const rebanyos = Object.values(jugada.final.rebanyos);
    expect(rebanyos.length).toBeGreaterThan(1);
    expect(Math.max(...rebanyos.map((r) => r.cabezas))).toBeGreaterThan(
      REGLAS.ganaderia.cabezasPorRebanyo / 2,
    );
  }, 60_000);

  it('en Zafra, sin agostadero conocido, cria un solo rebaño y dice por qué no trashuma', () => {
    const partida = sola('mesta', 'zafra-rio-bodion', 72);
    const cifras = cifrasDe(partida);
    expect(cifras['lanaEsquilada'], JSON.stringify(cifras)).toBeGreaterThan(0);
    expect(cifras['trashumancias']).toBe(0);
    expect(PRUEBA_DE_VIA.mesta.cumple(cifras)).toBe(false);
    expect(motivosDe(partida)).toContain('sin-pasto-de-verano');
  }, 60_000);
});

/**
 * La casa sola en su capital de siempre, con mercado, y una comarca vecina **neutral** explorada
 * con plaza, de la que sabe los precios. Una carestia de sal allí la mantiene cara durante todo
 * el escenario: sin ella, los mercaderes menores igualan cualquier diferencia en pocos turnos.
 */
function negocioPreparado(
  casa: Casa,
  origen: string,
  tradiciones: readonly Tradicion[] = [],
): { estado: EstadoPartida; mundo: Mundo } {
  const alta = altaDelBanco({
    semilla: '1492',
    casas: [casa],
    reglas: REGLAS,
    recortar: false,
    origenesFijos: { [casa]: origen as IdComarca },
  });
  const mundo = alta.mundo;
  const inicial = alta.estado;
  const yo = casa as string as IdJugador;
  const jugador = inicial.jugadores[yo];
  if (jugador === undefined) throw new Error(`falta el jugador ${casa}`);
  const capital = jugador.capital;
  // La vecina neutral a la que se lleva la sal: la que menos tiene, y entre esas la mas cercana,
  // porque el negocio tiene que caber en el porte de cualquiera. Desde T-052 esto importa: una
  // carestia de sal en una comarca con salinas no encarece nada, que es lo que hay al lado de
  // Alfoz de Burgos (la Bureba, la de las salinas de Poza).
  const salDe = (id: string): number =>
    precioBaseLocalMil(
      REGLAS.recursos.sal.precioBaseMil,
      mundo.comarcas[id as IdComarca],
      'sal',
      REGLAS.mercado,
    );
  const jornadas = (id: string): number =>
    mundo.caminos.find(
      (c) => (c.desde === capital && c.hasta === id) || (c.hasta === capital && c.desde === id),
    )?.jornadasBase ?? Number.POSITIVE_INFINITY;
  const vecina = (mundo.vecinos[capital] ?? [])
    .filter((id) => inicial.comarcas[id]?.duenyo === null && mundo.comarcas[id] !== undefined)
    .sort((a, b) => salDe(b) - salDe(a) || jornadas(a) - jornadas(b) || (a < b ? -1 : 1))[0];
  const suya = inicial.comarcas[capital];
  const ajena = vecina === undefined ? undefined : inicial.comarcas[vecina];
  const geografia = vecina === undefined ? undefined : mundo.comarcas[vecina];
  if (vecina === undefined || suya === undefined || ajena === undefined || !geografia) {
    throw new Error(`${capital} no tiene ninguna vecina neutral`);
  }
  /** Cada recurso en el precio base **de esa comarca** (T-052), con la sal a lo que se diga. */
  const baseLocal = (comarca: IdComarca, recurso: Recurso): number =>
    precioBaseLocalMil(
      REGLAS.recursos[recurso].precioBaseMil,
      mundo.comarcas[comarca],
      recurso,
      REGLAS.mercado,
    );
  const precios = (comarca: IdComarca, sal: number): Recursos => ({
    pan: baseLocal(comarca, 'pan'),
    madera: baseLocal(comarca, 'madera'),
    piedra: baseLocal(comarca, 'piedra'),
    maravedis: baseLocal(comarca, 'maravedis'),
    sal,
    hierro: baseLocal(comarca, 'hierro'),
    lana: baseLocal(comarca, 'lana'),
  });
  // La vecina paga por la sal el doble de lo que vale en la plaza de casa. Desde T-052 esa cifra
  // se mide sobre el base **de cada comarca**, no sobre el del catalogo.
  const cara = Math.floor((baseLocal(vecina, 'sal') * 30) / 14);
  const plaza = (comarca: IdComarca, sal: number): EstadoMercado => ({
    id: idDeMercadoLocal(comarca),
    comarca,
    tipo: 'local',
    volumen: 'pequenya',
    preciosMil: precios(comarca, sal),
    ultimoVolumen: { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 },
  });
  const edificiosVecina = { ...ajena.edificios, mercado: 1 };
  const estado = validar(
    {
      ...inicial,
      // El camino real entre las dos plazas: un mercader de Burgos no comerciaba por veredas, y
      // sin calzada la ida y vuelta se come el porte entero en pan (T-050 §6.1). Asi la prueba
      // mide lo que dice medir —que el robot sepa hacer el negocio— y no si el camino da de si.
      caminos: {
        ...inicial.caminos,
        [claveDeTramo(capital, vecina)]: { calidad: 'calzada', puente: false },
      },
      jugadores: {
        [yo]: {
          ...jugador,
          almacen: { ...jugador.almacen, maravedis: 900, pan: 300 },
          tradiciones: [...tradiciones],
          rondas: tradiciones.length > 0 ? { renombre: 1, fama: 1 } : jugador.rondas,
          conocimiento: {
            ...jugador.conocimiento,
            [vecina]: {
              nivel: 'explorada',
              turnoUltimaNoticia: 1,
              datos: {
                duenyo: null,
                poblacion: ajena.poblacion,
                terreno: geografia.terreno,
                potenciales: ajena.potenciales,
                edificios: edificiosVecina,
              },
            },
          },
          plazas: {
            [idDeMercadoLocal(capital)]: {
              turno: 1,
              fuente: 'visita',
              preciosMil: precios(capital, baseLocal(capital, 'sal')),
              visitada: true,
            },
            [idDeMercadoLocal(vecina)]: {
              turno: 1,
              fuente: 'visita',
              preciosMil: precios(vecina, cara),
              visitada: true,
            },
          },
        },
      },
      comarcas: {
        ...inicial.comarcas,
        [capital]: { ...suya, edificios: { ...suya.edificios, mercado: 1, granja: 2 } },
        [vecina]: { ...ajena, edificios: edificiosVecina },
      },
      mercados: {
        // La plaza de su casa, en el precio base **de su comarca** (T-052): es de ahi de donde
        // parte, y hacia ahi vuelve si nadie la mueve.
        [idDeMercadoLocal(capital)]: plaza(capital, baseLocal(capital, 'sal')),
        [idDeMercadoLocal(vecina)]: plaza(vecina, cara),
      },
      // La carestia sostiene la diferencia mientras dura la prueba: aqui se mide que el robot
      // sepa aprovechar una ocasion, no cuanta ocasion da el mapa (eso lo mide el banco).
      acontecimientos: [
        {
          id: 'ac-1-1' as IdAcontecimiento,
          tipo: 'carestia-de-sal',
          region: geografia.region,
          comarca: vecina,
          turnoAnuncio: 1,
          turnoInicio: 1,
          turnosDuracion: 40,
          efectos: [
            {
              que: 'precio' as const,
              recurso: 'sal' as const,
              terreno: null,
              factorMil: 2500,
              cantidad: 0,
            },
          ],
        },
      ],
    },
    mundo,
  );
  return { estado, mundo };
}

describe('el comercio fuera de casa', () => {
  // Con porte 10 y dos panes por jornada, un viaje de tres jornadas apenas deja hueco para la
  // mercancia (ver la bitacora de equilibrio, T-050): el mercader juega aqui con su tradicion
  // «Compañía», la que elige quien vive del arbitraje, y el arriero con su recua maragata.
  //
  // Desde T-052 los precios se miden sobre el base de cada comarca, no sobre el del catalogo.
  it.each([
    ['mercaderes', 'alfoz-de-burgos', ['mercaderes-compania']],
    ['arrieros', 'alfoz-de-burgos', []],
  ] as const)(
    '%s en %s compra sal en su plaza, la lleva a la vecina neutral, la vende con ganancia y vuelve',
    (casa, origen, tradiciones) => {
      const { estado, mundo } = negocioPreparado(casa, origen, tradiciones);
      const jugada = jugar(estado, mundo, casa, 16, `negocio-${casa}`);
      const jugador = jugada.partida.jugadores[0];
      if (jugador === undefined) throw new Error('falta el jugador');
      const negocios = jugador.traza.negocios;
      // Negocio con traza: la carga comprada en una plaza se vende en otra, despues de comprarla,
      // y deja ganancia despues del bastimento del viaje.
      expect(
        negocios.length,
        `${JSON.stringify(jugador.traza)} motivos=${[...motivosDe(jugada.partida)].join(',')}`,
      ).toBeGreaterThan(0);
      for (const negocio of negocios) {
        expect(negocio.plazaDeVenta).not.toBe(negocio.plazaDeCompra);
        expect(negocio.turnoDeVenta).toBeGreaterThan(negocio.turnoDeCompra);
      }
      expect(negocios.some((n) => n.margenNeto > 0)).toBe(true);
      const cifras = cifrasDe(jugada.partida);
      expect(cifras['ventasFuera']).toBeGreaterThan(0);
      expect(PRUEBA_DE_VIA[casa].cumple(cifras), JSON.stringify(cifras)).toBe(true);
      // Y la recua que vendio vuelve a la capital.
      const vendedora = negocios[0]?.recua ?? '';
      const volvio = jugada.sucesos.some(
        ([t, s]) =>
          t > (negocios[0]?.turnoDeVenta ?? 0) &&
          s.tipo === 'recua.entra' &&
          s.datos['recua'] === vendedora &&
          s.comarca === jugada.final.jugadores[casa as string as IdJugador]?.capital,
      );
      expect(volvio).toBe(true);
    },
    60_000,
  );
});
