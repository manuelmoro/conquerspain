// La partida del banco: el mapa real, las tablas del juego y una casa de cada oficio.
//
// Es un alta provisional. El alta de verdad (T-065) recortara el mapa segun las plazas y ajustara el
// arranque a cada origen; hasta entonces el banco reparte las casas por la peninsula entera con las
// mismas reglas que tendra que respetar aquella: el sorteo de origenes de cada casa y una distancia
// minima entre capitales.
import { fileURLToPath } from 'node:url';

import { cargarMundo } from '@conquer/mundo';
import {
  CASAS,
  TABLAS_DEL_JUEGO,
  VERSION_REGLAS,
  comparar,
  explicar,
  origenesPosibles,
  sortearOrigenes,
  validarEstado,
} from '@conquer/nucleo';
import type {
  Casa,
  ComarcaMundo,
  Conocimiento,
  EstadoComarca,
  EstadoJugador,
  EstadoPartida,
  IdComarca,
  IdJugador,
  IdPartida,
  Mundo,
  Recursos,
  TablasDeReglas,
} from '@conquer/nucleo';

const RUTA_MUNDO = fileURLToPath(
  new URL('../../../paquetes/mundo/datos/mundo.v1.json', import.meta.url),
);

/** Jornadas minimas entre dos capitales, por el camino mas corto en su estado base (T-065 §4). */
export const JORNADAS_ENTRE_CAPITALES = 6;

let mundoCargado: Mundo | null = null;

/** El mundo generado por el atlas, validado. Se carga una vez por proceso. */
export function mundoPeninsula(): Mundo {
  if (mundoCargado !== null) return mundoCargado;
  const resultado = cargarMundo(RUTA_MUNDO);
  if (!resultado.ok) {
    throw new Error(
      `El mundo de ${RUTA_MUNDO} no valida; regeneralo con npm run atlas:\n${explicar(resultado.errores)}`,
    );
  }
  mundoCargado = resultado.valor;
  return mundoCargado;
}

function sinRecursos(): Recursos {
  return { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 };
}

/** Jornadas base desde una comarca a todas las demas (Dijkstra sobre los caminos del mapa). */
export function jornadasDesde(mundo: Mundo, origen: IdComarca): Map<string, number> {
  const vecinas = new Map<string, { hacia: string; jornadas: number }[]>();
  for (const camino of mundo.caminos) {
    vecinas.set(camino.desde, [
      ...(vecinas.get(camino.desde) ?? []),
      { hacia: camino.hasta, jornadas: camino.jornadasBase },
    ]);
    vecinas.set(camino.hasta, [
      ...(vecinas.get(camino.hasta) ?? []),
      { hacia: camino.desde, jornadas: camino.jornadasBase },
    ]);
  }
  const distancia = new Map<string, number>([[origen, 0]]);
  const hechas = new Set<string>();
  for (;;) {
    let actual: string | null = null;
    for (const [id, d] of distancia) {
      if (hechas.has(id)) continue;
      const mejor = actual === null ? undefined : distancia.get(actual);
      if (mejor === undefined || d < mejor || (d === mejor && comparar(id, actual ?? '') < 0)) {
        actual = id;
      }
    }
    if (actual === null) return distancia;
    hechas.add(actual);
    const base = distancia.get(actual) ?? 0;
    for (const { hacia, jornadas } of vecinas.get(actual) ?? []) {
      const nueva = base + jornadas;
      if (nueva < (distancia.get(hacia) ?? Number.POSITIVE_INFINITY)) distancia.set(hacia, nueva);
    }
  }
}

/**
 * Lo que vale una comarca de origen para una casa: el jugador elige entre sus tres origenes
 * sorteados (docs/04 §4.2), y el robot, con su perfil.
 */
export type PreferenciaDeOrigen = (casa: Casa, comarca: ComarcaMundo) => number;

/**
 * La capital de cada casa: el preferido de sus tres origenes sorteados que quede lejos de las ya
 * puestas (a igualdad, el del sorteo); si ninguno, el primero de todos sus origenes posibles que lo
 * este.
 */
export function capitalesDe(
  mundo: Mundo,
  casas: readonly Casa[],
  semilla: string,
  reglas: TablasDeReglas,
  preferencia: PreferenciaDeOrigen = () => 0,
): Map<Casa, IdComarca> {
  const puestas = new Map<Casa, IdComarca>();
  const cercanias: Map<string, number>[] = [];
  const lejos = (id: IdComarca): boolean =>
    cercanias.every((d) => (d.get(id) ?? Number.POSITIVE_INFINITY) >= JORNADAS_ENTRE_CAPITALES);
  for (const casa of casas) {
    const valor = (id: IdComarca): number => {
      const comarca = mundo.comarcas[id];
      return comarca === undefined ? 0 : preferencia(casa, comarca);
    };
    const sorteadas = sortearOrigenes(mundo, casa, semilla, reglas)
      .map((id, i) => ({ id, i, valor: valor(id) }))
      .sort((a, b) => b.valor - a.valor || a.i - b.i)
      .map((c) => c.id);
    const candidatas = [...sorteadas, ...origenesPosibles(mundo, casa, reglas).map((c) => c.id)];
    const elegida = candidatas.find((id) => lejos(id) && ![...puestas.values()].includes(id));
    if (elegida === undefined) {
      throw new Error(
        `No queda ningun origen para la casa "${casa}" a ${String(JORNADAS_ENTRE_CAPITALES)} jornadas de las demas: prueba con menos casas.`,
      );
    }
    puestas.set(casa, elegida);
    cercanias.push(jornadasDesde(mundo, elegida));
  }
  return puestas;
}

function comarcaInicial(
  mundo: Mundo,
  id: IdComarca,
  duenyo: IdJugador | null,
  reglas: TablasDeReglas,
): EstadoComarca {
  const geografia = mundo.comarcas[id];
  if (geografia === undefined) throw new Error(`La comarca "${id}" no esta en el mundo.`);
  return {
    id,
    duenyo,
    poblacion: geografia.poblacionInicial,
    lealtad: duenyo === null ? 50 : 100,
    edificios: duenyo === null ? {} : { ...reglas.arranque.edificiosDeOrigen },
    aperos: 0,
    fuero: 'ninguno',
    turnoFuero: 0,
    cargaFiscal: 'normal',
    dehesa: false,
    potenciales: geografia.potenciales,
    agotamiento: { monte: 0, piedra: 0, hierro: 0, sal: 0 },
    influencias: {},
    presenciaSeguida: {},
    ultimoRegalo: {},
    exDuenyo: null,
    turnosDesleal: 0,
    turnosSinMantenimiento: 0,
    turnosDeAbono: 0,
    estiercol: 0,
    obrasMayores: [],
    produccionUltimoTurno: sinRecursos(),
  };
}

const NOMBRES: Readonly<Record<Casa, string>> = {
  mesta: 'Robot de la Mesta',
  ferrones: 'Robot ferrón',
  canteros: 'Robot cantero',
  mercaderes: 'Robot mercader',
  monjes: 'Robot monje',
  salineros: 'Robot salinero',
  arrieros: 'Robot arriero',
  hortelanos: 'Robot hortelano',
};

function jugadorInicial(
  casa: Casa,
  capital: IdComarca,
  mundo: Mundo,
  reglas: TablasDeReglas,
): EstadoJugador {
  // Se conoce la capital, y de oidas las comarcas que la rodean.
  const conocimiento: Record<string, Conocimiento> = {
    [capital]: { nivel: 'propia', turnoUltimaNoticia: 1, datos: null },
  };
  for (const vecina of mundo.vecinos[capital] ?? []) {
    conocimiento[vecina] = { nivel: 'oida', turnoUltimaNoticia: 1, datos: null };
  }
  return {
    id: casa as string as IdJugador,
    nombre: NOMBRES[casa],
    casa,
    tradiciones: [],
    rondas: {},
    capital,
    almacen: { ...reglas.arranque.almacen },
    reservado: sinRecursos(),
    prestigio: 0,
    credito: 50,
    hitos: {},
    registro: {
      obrasMayores: {},
      anyosTrashumantes: 0,
      feriasDestacadas: 0,
      volumenEnFerias: {},
      comarcasPerdidas: 0,
      turnosConEscasez: 0,
      turnosDeDespensaEstable: 0,
    },
    conocimiento,
    plazas: {},
    escasez: false,
    escasezSeguidas: 0,
    conservarConSal: true,
    deudaAdministracion: 0,
    traslado: null,
    turnosSinOrdenes: 0,
    mayordomo: [],
    colas: {},
  };
}

/** La partida inicial del banco con estas casas, validada como la validaria el servidor. */
export function partidaInicial(
  semilla: string,
  casas: readonly Casa[] = CASAS,
  reglas: TablasDeReglas = TABLAS_DEL_JUEGO,
  mundo: Mundo = mundoPeninsula(),
  preferencia: PreferenciaDeOrigen = () => 0,
): EstadoPartida {
  const capitales = capitalesDe(mundo, casas, semilla, reglas, preferencia);
  const duenyoDe = new Map<string, IdJugador>();
  for (const [casa, capital] of capitales) duenyoDe.set(capital, casa as string as IdJugador);

  const comarcas: Record<string, EstadoComarca> = {};
  for (const id of Object.keys(mundo.comarcas).sort(comparar)) {
    comarcas[id] = comarcaInicial(mundo, id as IdComarca, duenyoDe.get(id) ?? null, reglas);
  }
  const jugadores: Record<string, EstadoJugador> = {};
  for (const [casa, capital] of capitales) {
    jugadores[casa] = jugadorInicial(casa, capital, mundo, reglas);
  }

  const estado: EstadoPartida = {
    version: VERSION_REGLAS,
    id: `banco-${semilla}` as IdPartida,
    semilla,
    turno: 1,
    configuracion: {
      nombre: `Banco de pruebas, semilla ${semilla}`,
      intervaloMinutos: 1440,
      modo: casas.length === 1 ? 'solitario' : 'vecindad',
      turnosDeTemporada: null,
      reservaMinimaDePan: 30,
      esDePrueba: true,
    },
    jugadores,
    comarcas,
    recuas: {},
    rebanyos: {},
    obras: {},
    caminos: {},
    mercados: {},
    acontecimientos: [],
    ordenes: [],
    siguienteId: 1,
    huellaTurnoAnterior: null,
    primicias: {},
    clasificacion: [],
  };
  const resultado = validarEstado(estado, mundo);
  if (!resultado.ok) {
    throw new Error(`La partida del banco no valida:\n${explicar(resultado.errores)}`);
  }
  return resultado.valor;
}
