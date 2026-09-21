// La preparacion de una partida (ficha T-049 §4.1): recorte del mapa y ofertas de origen.
//
// Es puro y sin E/S: el banco y el servidor llaman a lo mismo. Sortea y no funda; quien reciba el
// resultado puede guardarlo, ensenyarlo y preguntar antes de que exista ninguna capital.
import type { IdComarca } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { comparar } from '../utiles/orden.ts';
import type { ErrorValidacion, Resultado } from '../validacion/validador.ts';
import { invalidos, valido } from '../validacion/validador.ts';
import { origenesPosibles } from '../reglas/casas/origenes.ts';
import { ofertasDeOrigen } from './ofertas.ts';
import type { OfertaDeOrigen, Participante } from './ofertas.ts';
import { recortarMundo } from './recorte.ts';

export interface PeticionDePreparacion {
  readonly mundo: Mundo;
  readonly reglas: TablasDeReglas;
  readonly semilla: string;
  readonly participantes: readonly Participante[];
  /** Recortar el mapa a los que juegan; false deja el mundo entero. */
  readonly recortar?: boolean;
  /**
   * Origenes fijados de antemano, por jugador: quien lo traiga no sortea. Sirve para escenarios y
   * para las pruebas que quieren una comarca concreta; tiene que ser un origen valido de su casa.
   */
  readonly origenesFijos?: Readonly<Record<string, IdComarca>>;
}

export interface PartidaPreparada {
  readonly mundo: Mundo;
  /** Jugador → sus ofertas, en el orden en que se le ensenyan. */
  readonly ofertas: Readonly<Record<string, readonly OfertaDeOrigen[]>>;
  /** Lo que hubo que ceder para que cupieran todos; vacio si no se cedio nada. */
  readonly avisos: readonly string[];
  /** Comarcas del mapa que se va a jugar y intentos que costo recortarlo. */
  readonly comarcas: number;
  readonly intentos: number;
}

/** Los jugadores que se quedarian sin ninguna comarca donde empezar. */
function sinSitio(
  mundo: Mundo,
  reglas: TablasDeReglas,
  semilla: string,
  participantes: readonly Participante[],
  fijos: Readonly<Record<string, IdComarca>>,
): string[] {
  const ofertas = ofertasDeOrigen(mundo, reglas, semilla, participantes, fijos);
  return participantes
    .filter((p) => (ofertas.porJugador[p.id] ?? []).length === 0)
    .map(
      (p) =>
        `${p.nombre} (${reglas.casas[p.casa].nombre}) se queda sin origen a ${String(reglas.arranque.recorte.jornadasEntreCapitales)} jornadas de los demas`,
    );
}

/** Comprueba lo que no puede fallar en silencio: que haya gente y que nadie repita identificador. */
function comprobarParticipantes(participantes: readonly Participante[]): ErrorValidacion[] {
  if (participantes.length === 0) {
    return [{ ruta: 'participantes', mensaje: 'no hay ningun participante' }];
  }
  const vistos = new Set<string>();
  const errores: ErrorValidacion[] = [];
  for (const participante of [...participantes].sort((a, b) => comparar(a.id, b.id))) {
    if (vistos.has(participante.id)) {
      errores.push({
        ruta: `participantes.${participante.id}`,
        mensaje: 'hay dos participantes con el mismo identificador',
      });
    }
    vistos.add(participante.id);
  }
  return errores;
}

/** Un origen fijado tiene que existir y servirle a su casa; si no, se dice antes de sortear nada. */
function comprobarOrigenesFijos(
  mundo: Mundo,
  reglas: TablasDeReglas,
  participantes: readonly Participante[],
  fijos: Readonly<Record<string, IdComarca>>,
): ErrorValidacion[] {
  const errores: ErrorValidacion[] = [];
  for (const participante of [...participantes].sort((a, b) => comparar(a.id, b.id))) {
    const fijo = fijos[participante.id];
    if (fijo === undefined) continue;
    const suyos = origenesPosibles(mundo, participante.casa, reglas);
    if (!suyos.some((comarca) => comarca.id === fijo)) {
      errores.push({
        ruta: `origenesFijos.${participante.id}`,
        mensaje: `"${fijo}" no es un origen posible para ${reglas.casas[participante.casa].nombre}`,
      });
    }
  }
  return errores;
}

/**
 * Prepara la partida: recorta el mapa (si se pide) y reparte las tarjetas de origen. Cualquier
 * combinacion de elecciones sobre estas ofertas respeta la separacion entre capitales.
 */
export function prepararPartida(peticion: PeticionDePreparacion): Resultado<PartidaPreparada> {
  const { reglas, semilla, participantes } = peticion;
  const fijos = peticion.origenesFijos ?? {};
  const errores = [
    ...comprobarParticipantes(participantes),
    ...comprobarOrigenesFijos(peticion.mundo, reglas, participantes, fijos),
  ];
  if (errores.length > 0) return invalidos(errores);

  let mundo = peticion.mundo;
  let intentos = 0;
  if (peticion.recortar ?? true) {
    const recorte = recortarMundo(
      peticion.mundo,
      reglas,
      semilla,
      participantes.map((p) => p.casa),
      (recortado) => sinSitio(recortado, reglas, semilla, participantes, fijos),
    );
    if (!recorte.ok) return recorte;
    mundo = recorte.valor.mundo;
    intentos = recorte.valor.intentos;
  }
  const ofertas = ofertasDeOrigen(mundo, reglas, semilla, participantes, fijos);
  const faltas = sinSitio(mundo, reglas, semilla, participantes, fijos);
  if (faltas.length > 0) {
    return invalidos(faltas.map((falta) => ({ ruta: 'ofertas', mensaje: falta })));
  }
  return valido({
    mundo,
    ofertas: ofertas.porJugador,
    avisos: ofertas.avisos,
    comarcas: Object.keys(mundo.comarcas).length,
    intentos,
  });
}

/** La comarca que elegiria quien se quede con la primera tarjeta: el atajo de las pruebas. */
export function primeraOferta(preparada: PartidaPreparada, jugador: string): IdComarca | undefined {
  return preparada.ofertas[jugador]?.[0]?.comarca;
}
