// La fundacion de la partida (ficha T-049 §4.1): de las elecciones al estado del turno 1.
//
// Va aparte de `prepararPartida` a proposito: el servidor sortea, guarda las ofertas, pregunta y
// solo despues funda. Aqui no se sortea nada; lo que llega ya esta decidido.
import type {
  Conocimiento,
  ConfiguracionPartida,
  EstadoComarca,
  EstadoJugador,
  EstadoPartida,
} from '../tipos/estado.ts';
import type { IdComarca, IdJugador, IdPartida } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { Recursos } from '../tipos/recursos.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { VERSION_REGLAS } from '../tipos/reglas.ts';
import { comparar, idsEnOrden } from '../utiles/orden.ts';
import type { Resultado } from '../validacion/validador.ts';
import { invalidos } from '../validacion/validador.ts';
import { validarEstado } from '../validacion/validarEstado.ts';
import { permisosDelJugador } from '../reglas/casas/index.ts';
import { datosConocidosDe } from '../reglas/explorar.ts';
import { arranqueDe } from './arranque.ts';
import { comarcasDeSuCanyada } from './canyadas.ts';
import { indiceDeCaminos, jornadasDesde } from './distancias.ts';
import type { PartidaPreparada } from './preparar.ts';
import type { Participante } from './ofertas.ts';

export interface PeticionDeFundacion {
  readonly preparada: PartidaPreparada;
  readonly reglas: TablasDeReglas;
  readonly semilla: string;
  readonly participantes: readonly Participante[];
  /** Jugador → comarca elegida entre sus ofertas. */
  readonly elecciones: Readonly<Record<string, IdComarca>>;
  readonly configuracion: ConfiguracionPartida;
  readonly id: IdPartida;
}

function sinRecursos(): Recursos {
  return { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 };
}

function comarcaInicial(
  mundo: Mundo,
  id: IdComarca,
  duenyo: IdJugador | null,
  edificios: Readonly<Record<string, number>>,
): EstadoComarca {
  const geografia = mundo.comarcas[id];
  if (geografia === undefined) throw new Error(`La comarca "${id}" no esta en el mundo.`);
  return {
    id,
    duenyo,
    poblacion: geografia.poblacionInicial,
    lealtad: duenyo === null ? 50 : 100,
    edificios,
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
    ventaDe: null,
    obrasMayores: [],
    produccionUltimoTurno: sinRecursos(),
    turnosDeAbono: 0,
    estiercol: 0,
  };
}

function jugadorInicial(
  participante: Participante,
  capital: IdComarca,
  almacen: Recursos,
  mundo: Mundo,
): EstadoJugador {
  // Se conoce la capital, y de oidas las comarcas que la rodean.
  const conocimiento: Record<string, Conocimiento> = {
    [capital]: { nivel: 'propia', turnoUltimaNoticia: 1, datos: null },
  };
  for (const vecina of mundo.vecinos[capital] ?? []) {
    conocimiento[vecina] = { nivel: 'oida', turnoUltimaNoticia: 1, datos: null };
  }
  return {
    id: participante.id,
    nombre: participante.nombre,
    casa: participante.casa,
    tradiciones: [],
    rondas: {},
    capital,
    almacen,
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
      conocidasAlEmpezar: [],
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

/** Funda la partida con las elecciones ya tomadas: el estado del turno 1, validado. */
export function fundarPartida(peticion: PeticionDeFundacion): Resultado<EstadoPartida> {
  const { preparada, reglas, elecciones, participantes } = peticion;
  const mundo = preparada.mundo;
  const ordenados = [...participantes].sort((a, b) => comparar(a.id, b.id));
  const errores = comprobarElecciones(peticion, ordenados);
  if (errores.length > 0) return invalidos(errores);

  const duenyoDe = new Map<string, IdJugador>();
  const edificiosDe = new Map<string, Readonly<Record<string, number>>>();
  const jugadores: Record<string, EstadoJugador> = {};
  for (const participante of ordenados) {
    const capital = elecciones[participante.id];
    if (capital === undefined) continue;
    const geografia = mundo.comarcas[capital];
    if (geografia === undefined) continue;
    const arranque = arranqueDe(geografia, participante.casa, reglas);
    duenyoDe.set(capital, participante.id);
    edificiosDe.set(capital, arranque.edificios);
    jugadores[participante.id] = jugadorInicial(participante, capital, arranque.almacen, mundo);
  }

  const comarcas: Record<string, EstadoComarca> = {};
  for (const id of idsEnOrden(mundo.comarcas)) {
    comarcas[id] = comarcaInicial(
      mundo,
      id as IdComarca,
      duenyoDe.get(id) ?? null,
      edificiosDe.get(id) ?? {},
    );
  }

  for (const id of Object.keys(jugadores).sort(comparar)) {
    const jugador = jugadores[id];
    if (jugador !== undefined) jugadores[id] = conSuCanyada(jugador, mundo, comarcas, reglas);
  }

  const estado: EstadoPartida = {
    version: VERSION_REGLAS,
    id: peticion.id,
    semilla: peticion.semilla,
    turno: 1,
    configuracion: peticion.configuracion,
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
  return validarEstado(estado, mundo);
}

/**
 * Quien conoce las canyadas empieza con su canyada y el camino hasta ella exploradas, con la foto
 * del turno 1, y oye hablar de sus vecinas, igual que si una recua lo hubiera recorrido (T-058).
 */
function conSuCanyada(
  jugador: EstadoJugador,
  mundo: Mundo,
  comarcas: Readonly<Record<string, EstadoComarca>>,
  reglas: TablasDeReglas,
): EstadoJugador {
  if (!permisosDelJugador(jugador, reglas).conoceLasCanyadas) return jugador;
  const conocimiento: Record<string, Conocimiento> = { ...jugador.conocimiento };
  const exploradas = comarcasDeSuCanyada(mundo, jugador.capital);
  for (const id of exploradas) {
    const comarca = comarcas[id];
    const geografia = mundo.comarcas[id];
    if (comarca === undefined || geografia === undefined) continue;
    conocimiento[id] = {
      nivel: 'explorada',
      turnoUltimaNoticia: 1,
      datos: datosConocidosDe(comarca, geografia),
    };
  }
  for (const id of exploradas) {
    for (const vecina of [...(mundo.vecinos[id] ?? [])].sort(comparar)) {
      if (conocimiento[vecina] !== undefined) continue;
      conocimiento[vecina] = { nivel: 'oida', turnoUltimaNoticia: 1, datos: null };
    }
  }
  return {
    ...jugador,
    conocimiento,
    registro: { ...jugador.registro, conocidasAlEmpezar: exploradas },
  };
}

/** Que una eleccion no valga se dice con su ruta y su motivo, no con una excepcion. */
function comprobarElecciones(
  peticion: PeticionDeFundacion,
  ordenados: readonly Participante[],
): { readonly ruta: string; readonly mensaje: string }[] {
  const { preparada, reglas, elecciones } = peticion;
  const errores: { ruta: string; mensaje: string }[] = [];
  const indice = indiceDeCaminos(preparada.mundo);
  const puestas: IdComarca[] = [];
  for (const participante of ordenados) {
    const ruta = `elecciones.${participante.id}`;
    const elegida = elecciones[participante.id];
    if (elegida === undefined) {
      errores.push({ ruta, mensaje: `${participante.nombre} no ha elegido origen` });
      continue;
    }
    const suyas = preparada.ofertas[participante.id] ?? [];
    if (!suyas.some((oferta) => oferta.comarca === elegida)) {
      errores.push({
        ruta,
        mensaje: `"${elegida}" no esta entre las ofertas de ${participante.nombre}`,
      });
      continue;
    }
    const distancia = jornadasDesde(preparada.mundo, elegida, indice);
    const minima = reglas.arranque.recorte.jornadasEntreCapitales;
    const cerca = puestas.find((otra) => (distancia.get(otra) ?? 0) < minima);
    if (cerca !== undefined) {
      errores.push({
        ruta,
        mensaje: `"${elegida}" esta a menos de ${String(minima)} jornadas de "${cerca}"`,
      });
      continue;
    }
    puestas.push(elegida);
  }
  return errores;
}
