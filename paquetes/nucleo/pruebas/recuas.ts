// Escenarios con recuas para las pruebas de las fases 4 y 5: el estado mini con todo explorado,
// despensa llena, recuas a medida y ordenes de recua bien formadas.
import { resolverTurno } from '../src/resolver.ts';
import type { Suceso } from '../src/tipos/cronica.ts';
import type { EstadoComarca, EstadoJugador, EstadoPartida, Recua } from '../src/tipos/estado.ts';
import type { IdComarca, IdJugador, IdOrden, IdRecua } from '../src/tipos/ids.ts';
import type { Orden, OrdenBase, ParadaDeRuta } from '../src/tipos/ordenes.ts';
import type { Recursos } from '../src/tipos/recursos.ts';
import { RECURSOS } from '../src/tipos/recursos.ts';
import { estadoMini, mundoMini, tablasMini } from './mundo-mini.ts';

export const reglas = tablasMini();
export const mundo = mundoMini();
export const UNO = 'casa-uno' as IdJugador;
export const DOS = 'casa-dos' as IdJugador;
export const c = (id: string): IdComarca => id as IdComarca;
export const PRIMAVERA = 7;
export const VERANO = 12;
export const INVIERNO = 2;

export function recursos(cantidades: Partial<Recursos> = {}): Recursos {
  const base = Object.fromEntries(RECURSOS.map((r) => [r, 0])) as Record<string, number>;
  return { ...base, ...cantidades } as Recursos;
}

export function recua(id: string, cambios: Partial<Recua> = {}): Recua {
  return {
    id: id as IdRecua,
    jugador: UNO,
    nombre: `Recua ${id}`,
    situacion: { donde: 'comarca', comarca: c('prueba-llano') },
    ruta: [],
    rutaCircular: false,
    paradas: [],
    siguienteParada: 0,
    enParada: null,
    acemilas: 10,
    porte: 10,
    carga: recursos(),
    vecinos: 0,
    cometido: null,
    turnosDeCometido: 0,
    avisadaSinBastimento: false,
    ...cambios,
  };
}

export interface Escenario {
  readonly turno?: number;
  readonly recuas?: readonly Recua[];
  readonly almacen?: Partial<Recursos>;
  readonly jugador?: Partial<EstadoJugador>;
  readonly conDos?: boolean;
}

/** El estado mini con todo explorado, despensa llena y las recuas dadas. */
export function escenario(opciones: Escenario = {}): EstadoPartida {
  const base = estadoMini();
  const casa = base.jugadores[UNO];
  if (casa === undefined) throw new Error('el estado mini ha cambiado');
  const conocimiento: EstadoJugador['conocimiento'] = Object.fromEntries(
    Object.keys(mundo.comarcas).map((id) => [
      id,
      {
        nivel: id === 'prueba-llano' ? ('propia' as const) : ('explorada' as const),
        turnoUltimaNoticia: 1,
        datos: null,
      },
    ]),
  );
  const uno: EstadoJugador = {
    ...casa,
    conocimiento,
    almacen: recursos({ pan: 500, sal: 50, maravedis: 500, madera: 50, ...opciones.almacen }),
    ...opciones.jugador,
  };
  const jugadores: Record<string, EstadoJugador> = { [UNO]: uno };
  if (opciones.conDos === true) {
    jugadores[DOS] = { ...uno, id: DOS, nombre: 'Casa Dos', capital: c('prueba-costa') };
  }
  return {
    ...base,
    turno: opciones.turno ?? PRIMAVERA,
    // Las recuas de prueba se llaman recua-1, recua-2…: las nuevas empiezan mas arriba.
    siguienteId: 100,
    jugadores,
    recuas: Object.fromEntries((opciones.recuas ?? []).map((r) => [r.id, r])),
  };
}

let contador = 0;
export function base(turno: number, coste: Partial<Recursos> = {}): OrdenBase {
  contador += 1;
  return {
    id: `orden-${String(contador).padStart(3, '0')}` as IdOrden,
    jugador: UNO,
    turnoAlta: turno,
    estado: 'pendiente',
    coste: recursos(coste),
    turnosTotales: 1,
    turnosHechos: 0,
    motivoEspera: null,
    delMayordomo: false,
  };
}

/** Una parada sin nada que hacer, con lo que se le quiera anyadir. */
export function parada(comarca: string, cambios: Partial<ParadaDeRuta> = {}): ParadaDeRuta {
  return { comarca: c(comarca), cargar: {}, descargar: {}, vender: {}, comprar: {}, ...cambios };
}

export function ordenRuta(
  turno: number,
  recuaId: string,
  paradas: readonly (string | ParadaDeRuta)[],
  circular = false,
): Orden {
  return {
    ...base(turno),
    tipo: 'ruta',
    recua: recuaId as IdRecua,
    rebanyo: null,
    paradas: paradas.map((p) => (typeof p === 'string' ? parada(p) : p)),
    circular,
  };
}

export function ordenFormar(turno: number, vecinos = 0): Orden {
  return {
    ...base(turno, { maravedis: 20, pan: 10 }),
    tipo: 'formar-recua',
    comarca: c('prueba-llano'),
    acemilas: 10,
    vecinos,
  };
}

export function ordenCarga(turno: number, recuaId: string, cargar: Partial<Recursos>): Orden {
  return {
    ...base(turno),
    tipo: 'carga',
    recua: recuaId as IdRecua,
    cargar,
    descargar: {},
    vecinosCargados: 0,
  };
}

export function turno(
  estado: EstadoPartida,
  ordenes: readonly Orden[] = [],
  tablas = reglas,
  elMundo = mundo,
): ReturnType<typeof resolverTurno> {
  return resolverTurno(estado, ordenes, elMundo, tablas);
}

export function de(estado: EstadoPartida, id: string): Recua {
  const encontrada = estado.recuas[id];
  if (encontrada === undefined) throw new Error(`falta la recua ${id}`);
  return encontrada;
}

export function tipos(sucesos: readonly Suceso[]): string[] {
  return sucesos.map((s) => s.tipo);
}

/** Copia del estado con campos de una comarca cambiados. */
export function conComarca(
  estado: EstadoPartida,
  id: string,
  cambios: Partial<EstadoComarca>,
): EstadoPartida {
  const comarca = estado.comarcas[id];
  if (comarca === undefined) throw new Error(`falta la comarca ${id}`);
  return { ...estado, comarcas: { ...estado.comarcas, [id]: { ...comarca, ...cambios } } };
}

/** La comarca de un estado, o un error claro si no esta. */
export function comarcaDe(estado: EstadoPartida, id: string): EstadoComarca {
  const comarca = estado.comarcas[id];
  if (comarca === undefined) throw new Error(`falta la comarca ${id}`);
  return comarca;
}
