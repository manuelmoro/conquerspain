// La partida del banco: el mapa real, las tablas del juego y una casa de cada oficio.
//
// Desde T-049 el banco no prepara nada por su cuenta: llama al mismo preparador del nucleo que
// usara el servidor (`prepararPartida` y `fundarPartida`), recorta el mapa a los que juegan y deja
// que cada robot elija su origen entre las tres tarjetas que le tocan, como haria un jugador.
import { fileURLToPath } from 'node:url';

import { cargarMundo } from '@conquer/mundo';
import { CASAS, TABLAS_DEL_JUEGO, explicar, fundarPartida, prepararPartida } from '@conquer/nucleo';
import type {
  Casa,
  ComarcaMundo,
  EstadoPartida,
  IdComarca,
  IdJugador,
  IdPartida,
  Mundo,
  Participante,
  TablasDeReglas,
} from '@conquer/nucleo';

const RUTA_MUNDO = fileURLToPath(
  new URL('../../../paquetes/mundo/datos/mundo.v1.json', import.meta.url),
);

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

/**
 * Lo que vale una comarca de origen para una casa: el jugador elige entre sus tres origenes
 * sorteados (docs/04 §4.2), y el robot, con su perfil.
 */
export type PreferenciaDeOrigen = (casa: Casa, comarca: ComarcaMundo) => number;

/** La partida recien fundada: el estado del turno 1 y el mapa recortado en el que se juega. */
export interface PartidaDelBanco {
  readonly estado: EstadoPartida;
  readonly mundo: Mundo;
  /** Lo que el preparador tuvo que ceder (ofertas reducidas); vacio si no cedio nada. */
  readonly avisos: readonly string[];
}

export interface OpcionesDeAlta {
  readonly semilla: string;
  readonly casas?: readonly Casa[] | undefined;
  readonly reglas?: TablasDeReglas | undefined;
  readonly mundo?: Mundo | undefined;
  readonly preferencia?: PreferenciaDeOrigen | undefined;
  /** Recortar el mapa a los que juegan (T-049); false juega la peninsula entera. */
  readonly recortar?: boolean | undefined;
  /** Origen fijado de una casa, para los escenarios que quieren una comarca concreta. */
  readonly origenesFijos?: Readonly<Record<string, IdComarca>> | undefined;
}

/** La partida inicial del banco con estas casas, preparada y fundada como lo hara el servidor. */
export function altaDelBanco(opciones: OpcionesDeAlta): PartidaDelBanco {
  const {
    semilla,
    casas = CASAS,
    reglas = TABLAS_DEL_JUEGO,
    mundo = mundoPeninsula(),
    preferencia = () => 0,
    recortar = true,
  } = opciones;
  const participantes: Participante[] = casas.map((casa) => ({
    id: casa as string as IdJugador,
    nombre: NOMBRES[casa],
    casa,
  }));
  const preparada = prepararPartida({
    mundo,
    reglas,
    semilla,
    participantes,
    recortar,
    origenesFijos: opciones.origenesFijos ?? {},
  });
  if (!preparada.ok) {
    throw new Error(`El banco no puede preparar la partida:\n${explicar(preparada.errores)}`);
  }
  const elecciones: Record<string, IdComarca> = {};
  for (const participante of participantes) {
    const suyas = preparada.valor.ofertas[participante.id] ?? [];
    const valor = (oferta: (typeof suyas)[number]): number => {
      const comarca = preparada.valor.mundo.comarcas[oferta.comarca];
      return comarca === undefined ? 0 : preferencia(participante.casa, comarca);
    };
    // A igualdad de valor manda el orden del sorteo: ninguna casa gana por como se llame.
    const elegida = [...suyas]
      .map((oferta, i) => ({ oferta, i }))
      .sort((a, b) => valor(b.oferta) - valor(a.oferta) || a.i - b.i)[0]?.oferta;
    if (elegida === undefined) {
      throw new Error(`El preparador no ofrece ningun origen a ${participante.nombre}.`);
    }
    elecciones[participante.id] = elegida.comarca;
  }
  const estado = fundarPartida({
    preparada: preparada.valor,
    reglas,
    semilla,
    participantes,
    elecciones,
    id: `banco-${semilla}` as IdPartida,
    configuracion: {
      nombre: `Banco de pruebas, semilla ${semilla}`,
      intervaloMinutos: 1440,
      modo: casas.length === 1 ? 'solitario' : 'vecindad',
      turnosDeTemporada: null,
      reservaMinimaDePan: 30,
      esDePrueba: true,
    },
  });
  if (!estado.ok) {
    throw new Error(`La partida del banco no valida:\n${explicar(estado.errores)}`);
  }
  return { estado: estado.valor, mundo: preparada.valor.mundo, avisos: preparada.valor.avisos };
}
