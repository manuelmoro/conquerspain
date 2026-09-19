// Cada robot juega su via (ficha T-046 §6.3). Cada casa juega sola en un origen donde su via es
// posible, y la cifra que la prueba (`PRUEBA_DE_VIA`, la misma del informe) tiene que salir.
//
// El informe de referencia dice si la via sale tambien con las ocho casas juntas; cuando no sale,
// es un asunto de equilibrio (T-047), no del robot: aqui se ve que el robot sabe jugarla.
import { describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO, explicar, idDeMercadoLocal, validarEstado } from '@conquer/nucleo';
import type {
  Casa,
  EstadoMercado,
  EstadoPartida,
  IdAcontecimiento,
  IdComarca,
  IdJugador,
  Recursos,
} from '@conquer/nucleo';

import { jugarPartida, jugarTurno } from './ejecutar.ts';
import { PRUEBA_DE_VIA } from './informe.ts';
import type { MetricasDePartida } from './metricas.ts';
import { Registro, resumir } from './metricas.ts';
import { mundoPeninsula, partidaInicial } from './partida.ts';
import { origenPreferido, robotDe } from './robots/index.ts';

/** Las cifras de un resumen con los nombres que usa `PRUEBA_DE_VIA`. */
function cifrasDe(partida: MetricasDePartida): Record<string, number> {
  const jugador = partida.jugadores[0];
  if (jugador === undefined) throw new Error('la partida no tiene jugadores');
  const r = resumir(partida, jugador);
  const cifras: Record<string, number> = {
    lanaEsquilada: r.lanaEsquilada,
    ingresosDeFeria: r.ingresosDeFeria,
    obrasMayores: r.obrasMayores,
    arbitrajes: r.arbitrajes,
    pueblasFundadas: r.pueblasFundadas,
    jornadas: r.jornadas,
    volumenComerciado: r.volumenComerciado,
  };
  for (const [edificio, cantidad] of Object.entries(r.porEdificio)) {
    cifras[`edificio_${edificio}`] = cantidad;
  }
  return cifras;
}

function sola(casa: Casa, semilla: string, turnos: number): MetricasDePartida {
  return jugarPartida({
    semilla,
    turnos,
    casas: [casa],
    cadencia: 1,
    reglas: TABLAS_DEL_JUEGO,
    mundo: mundoPeninsula(),
    estados: null,
  });
}

/** Casa, semilla (que fija su origen) y turnos para que su via salga. */
const ESCENARIOS: readonly (readonly [Casa, string, number, string])[] = [
  ['mesta', 'mesta-26', 72, 'en Zafra, con su feria en casa'],
  ['ferrones', '1492', 96, 'en el señorío de Molina'],
  ['canteros', '1492', 120, 'en la Tierra de Toledo'],
  ['monjes', '1492', 72, 'en Évora'],
  ['salineros', '1492', 72, 'en los Valles Alaveses, con la sal de Añana'],
  ['arrieros', '1492', 48, 'en El Bierzo'],
  ['hortelanos', '1492', 48, 'en la Vega de Granada'],
];

describe('cada robot juega su vía', () => {
  it.each(ESCENARIOS)(
    '%s (semilla %s, %i turnos, %s)',
    (casa, semilla, turnos) => {
      const cifras = cifrasDe(sola(casa, semilla, turnos));
      expect(PRUEBA_DE_VIA[casa].cumple(cifras), JSON.stringify(cifras)).toBe(true);
    },
    60_000,
  );

  it('mercaderes: con la sal cara en una plaza propia vecina, la compra en casa y la vende allí', () => {
    // En solitario los precios no se mueven (nadie mas comercia) y los mercaderes menores igualan
    // cualquier diferencia en pocos turnos. Se le dan dos plazas propias y una carestia de sal en la
    // vecina, que la mantiene cara: la diferencia dura y el mercader tiene que aprovecharla.
    const mundo = mundoPeninsula();
    const reglas = TABLAS_DEL_JUEGO;
    const inicial = partidaInicial('1492', ['mercaderes'], reglas, mundo, origenPreferido);
    const yo = 'mercaderes' as IdJugador;
    const capital = inicial.jugadores[yo]?.capital as IdComarca;
    const vecina = mundo.vecinos[capital]?.[0] as IdComarca;
    const precios = (sal: number): Recursos => ({
      pan: reglas.recursos.pan.precioBaseMil,
      madera: reglas.recursos.madera.precioBaseMil,
      piedra: reglas.recursos.piedra.precioBaseMil,
      maravedis: reglas.recursos.maravedis.precioBaseMil,
      sal,
      hierro: reglas.recursos.hierro.precioBaseMil,
      lana: reglas.recursos.lana.precioBaseMil,
    });
    const plaza = (comarca: IdComarca, sal: number): EstadoMercado => ({
      id: idDeMercadoLocal(comarca),
      comarca,
      tipo: 'local',
      volumen: 'pequenya',
      preciosMil: precios(sal),
      ultimoVolumen: { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 },
    });
    const jugador = inicial.jugadores[yo];
    if (jugador === undefined) throw new Error('falta el mercader');
    const conMercado = (id: IdComarca) => ({
      ...inicial.comarcas[id],
      duenyo: yo,
      edificios: { ...inicial.comarcas[id]?.edificios, mercado: 1, granja: 2 },
    });
    const preparado = {
      ...inicial,
      jugadores: {
        [yo]: {
          ...jugador,
          almacen: { ...jugador.almacen, maravedis: 900, pan: 300 },
          conocimiento: {
            ...jugador.conocimiento,
            [vecina]: { nivel: 'propia', turnoUltimaNoticia: 1, datos: null },
          },
          plazas: {
            [idDeMercadoLocal(capital)]: {
              turno: 1,
              fuente: 'visita',
              preciosMil: precios(reglas.recursos.sal.precioBaseMil),
              visitada: true,
            },
            [idDeMercadoLocal(vecina)]: {
              turno: 1,
              fuente: 'visita',
              preciosMil: precios(30000),
              visitada: true,
            },
          },
        },
      },
      comarcas: {
        ...inicial.comarcas,
        [capital]: conMercado(capital),
        [vecina]: conMercado(vecina),
      },
      mercados: {
        [idDeMercadoLocal(capital)]: plaza(capital, reglas.recursos.sal.precioBaseMil),
        [idDeMercadoLocal(vecina)]: plaza(vecina, 30000),
      },
      acontecimientos: [
        {
          id: 'ac-1-1' as IdAcontecimiento,
          tipo: 'carestia-de-sal',
          region: mundo.comarcas[vecina]?.region ?? '',
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
    };
    const valido = validarEstado(preparado, mundo);
    if (!valido.ok) throw new Error(explicar(valido.errores));
    let estado: EstadoPartida = valido.valor;
    const robots = [robotDe('mercaderes')];
    const registro = new Registro(reglas, 1);
    for (let i = 0; i < 16; i += 1) {
      const turno = jugarTurno(estado, robots, mundo, reglas);
      estado = turno.estado;
      registro.anotar(estado, turno.sucesos, turno.decisiones);
    }
    const partida = registro.cerrar(estado, '1492', 16);
    const cifras = cifrasDe(partida);
    expect(PRUEBA_DE_VIA.mercaderes.cumple(cifras), JSON.stringify(cifras)).toBe(true);
  }, 60_000);
});
