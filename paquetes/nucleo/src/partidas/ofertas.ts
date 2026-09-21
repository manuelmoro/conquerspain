// Las tarjetas de origen (ficha T-049 §4.4; docs/04 §4.2, docs/05 §5.7).
//
// A cada jugador se le ofrecen tres comarcas de perfiles distintos, filtradas por lo que su casa
// necesita. Las de un jugador estan lejos de las de todos los demas, asi que puede quedarse con
// cualquiera de las tres: ninguna eleccion deja a otro sin sitio.
//
// Elige primero quien menos donde elegir tiene. Si los canteros sortearan los ultimos —seis
// origenes en toda la peninsula— se quedarian sin mapa.
import { elegirOrigenes, origenesPosibles, perfilDe } from '../reglas/casas/origenes.ts';
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import type { ComarcaMundo, Mundo, Potencial } from '../tipos/mundo.ts';
import { POTENCIALES } from '../tipos/mundo.ts';
import type { Casa, TablasDeReglas } from '../tipos/reglas.ts';
import { azarDe } from '../utiles/azar.ts';
import { comparar } from '../utiles/orden.ts';
import { indiceDeCaminos, jornadasDesde } from './distancias.ts';

/** Quien juega: identificador, nombre publico y casa de oficio. */
export interface Participante {
  readonly id: IdJugador;
  readonly nombre: string;
  readonly casa: Casa;
}

/** Una tarjeta de origen: que te da esta comarca y que te va a faltar, en terminos de tu casa. */
export interface OfertaDeOrigen {
  readonly comarca: IdComarca;
  readonly nombre: string;
  readonly perfil: Potencial;
  readonly ventaja: string;
  readonly limitacion: string;
}

export interface Ofertas {
  /** Jugador → sus ofertas, en el orden en que se le ensenyan. */
  readonly porJugador: Readonly<Record<string, readonly OfertaDeOrigen[]>>;
  /** Lo que hubo que ceder para que cupieran todos; vacio si no se cedio nada. */
  readonly avisos: readonly string[];
}

const NOMBRE_DE_POTENCIAL: Readonly<Record<Potencial, string>> = {
  labor: 'tierra de labor',
  monte: 'monte',
  pasto: 'pasto',
  piedra: 'piedra',
  hierro: 'hierro',
  sal: 'sal',
  pesca: 'pesca',
};

/** El potencial mas flojo de la comarca (a igualdad, el primero de la lista): lo que le va a faltar. */
function flaquezaDe(comarca: ComarcaMundo): Potencial {
  let peor: Potencial = POTENCIALES[0];
  for (const potencial of POTENCIALES) {
    if (comarca.potenciales[potencial] < comarca.potenciales[peor]) peor = potencial;
  }
  return peor;
}

/** La tarjeta que ve el jugador: nada que no pueda mirar en el mapa antes de empezar. */
export function tarjetaDe(
  comarca: ComarcaMundo,
  reglas: TablasDeReglas,
  casa: Casa,
): OfertaDeOrigen {
  const perfil = perfilDe(comarca);
  const flaqueza = flaquezaDe(comarca);
  const rasgos = comarca.rasgos.length === 0 ? '' : `, con ${comarca.rasgos.join(' y ')}`;
  const feria = comarca.ferias.length > 0 ? ' y feria propia' : '';
  return {
    comarca: comarca.id,
    nombre: comarca.nombre,
    perfil,
    ventaja: `${NOMBRE_DE_POTENCIAL[perfil]} de nivel ${String(comarca.potenciales[perfil])}${rasgos}${feria}: sirve a ${reglas.casas[casa].nombre}`,
    limitacion: `poco ${NOMBRE_DE_POTENCIAL[flaqueza]} (nivel ${String(comarca.potenciales[flaqueza])}) y ${String(comarca.solares)} solares`,
  };
}

/**
 * Las ofertas de todos, con la separacion garantizada entre jugadores distintos.
 *
 * El orden de asignacion no es el de llegada: se ordena por escasez (quien menos origenes posibles
 * tiene, primero) y los empates se deshacen con la semilla, nunca con el identificador.
 */
export function ofertasDeOrigen(
  mundo: Mundo,
  reglas: TablasDeReglas,
  semilla: string,
  participantes: readonly Participante[],
  /** Origenes fijados de antemano (escenarios y pruebas): esos jugadores no sortean nada. */
  fijos: Readonly<Record<string, IdComarca>> = {},
): Ofertas {
  const recorte = reglas.arranque.recorte;
  const indice = indiceDeCaminos(mundo);
  const ordenados = [...participantes].sort((a, b) => comparar(a.id, b.id));
  const sorteo = azarDe(semilla, 0, 'preparacion', 'orden').barajar(ordenados);
  const posibles = new Map<string, ComarcaMundo[]>(
    ordenados.map((p) => [p.id, origenesPosibles(mundo, p.casa, reglas)]),
  );
  // Quien trae su origen puesto va primero: su comarca se reserva antes de que nadie sortee.
  const turno = [...sorteo].sort(
    (a, b) =>
      Number(fijos[b.id] !== undefined) - Number(fijos[a.id] !== undefined) ||
      (posibles.get(a.id)?.length ?? 0) - (posibles.get(b.id)?.length ?? 0),
  );

  const porJugador: Record<string, readonly OfertaDeOrigen[]> = {};
  const avisos: string[] = [];
  const tomadas: IdComarca[] = [];
  const distancias = new Map<string, Map<string, number>>();
  const lejosDeLoTomado = (id: IdComarca): boolean =>
    tomadas.every(
      (otra) =>
        (distancias.get(otra)?.get(id) ?? Number.POSITIVE_INFINITY) >=
        recorte.jornadasEntreCapitales,
    );

  for (const participante of turno) {
    const fijo = fijos[participante.id];
    const candidatas = (posibles.get(participante.id) ?? []).filter(
      (comarca) =>
        (fijo === undefined || comarca.id === fijo) &&
        (fijo !== undefined || lejosDeLoTomado(comarca.id)),
    );
    const elegidas = elegirOrigenes(
      candidatas,
      participante.casa,
      `${semilla}|${participante.id}`,
      fijo === undefined ? recorte.origenesPorCasa : 1,
    );
    if (fijo === undefined && elegidas.length < recorte.origenesPorCasa) {
      avisos.push(
        `${reglas.casas[participante.casa].nombre}: solo caben ${String(elegidas.length)} origenes a ${String(recorte.jornadasEntreCapitales)} jornadas de los demas`,
      );
    }
    porJugador[participante.id] = elegidas.map((id) => {
      const comarca = mundo.comarcas[id];
      if (comarca === undefined) throw new Error(`La comarca "${id}" no esta en el mundo.`);
      return tarjetaDe(comarca, reglas, participante.casa);
    });
    for (const id of elegidas) {
      tomadas.push(id);
      distancias.set(id, jornadasDesde(mundo, id, indice));
    }
  }
  return { porJugador, avisos };
}
