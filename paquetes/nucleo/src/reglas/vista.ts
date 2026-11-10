// La vista de un jugador: lo unico que el servidor le envia (docs/02-diseno-nucleo.md §2.6; ficha
// T-044 §4.1).
//
// Se construye filtrando el estado con reglas fijas y sin excepciones. Lo propio se ve entero; lo
// ajeno, solo como se supo y cuando se supo; lo desconocido, ni siquiera existe. La semilla de la
// partida no sale nunca: con ella se podria adivinar el azar de los turnos que vienen.
import { ErrorDeMotor } from '../errores.ts';
import type { Casa } from '../tipos/reglas.ts';
import type {
  Acontecimiento,
  CierreDeTemporada,
  Hostilidad,
  Mesnada,
  ConfiguracionPartida,
  Conocimiento,
  DatosConocidos,
  EstadoComarca,
  EstadoJugador,
  EstadoPartida,
  EstadoTramo,
  Obra,
  PuestoEnLaClasificacion,
  Rebanyo,
  Recua,
  SituacionMovil,
} from '../tipos/estado.ts';
import type { Contrato } from '../tipos/contratos.ts';
import type { IdComarca, IdJugador } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { Orden } from '../tipos/ordenes.ts';
import { comparar } from '../utiles/orden.ts';

export type VistaComarca =
  | { readonly nivel: 'propia'; readonly comarca: EstadoComarca }
  | {
      readonly nivel: 'explorada';
      readonly turnoUltimaNoticia: number;
      readonly datos: DatosConocidos | null;
      /** La influencia propia de hoy, si la comarca es neutral. */
      readonly influenciaPropia: number | null;
      /** La de las demas casas, solo con presencia propia allí y en tramos de 10. */
      readonly influenciasAjenas: Readonly<Record<string, number>>;
    }
  | {
      readonly nivel: 'oida';
      readonly turnoUltimaNoticia: number;
      readonly nombre: string;
      readonly region: string;
      /**
       * La influencia propia de hoy, si la comarca es neutral: se acumula con solo conocerla de
       * oidas (docs/06 §6.2), y es un dato del propio jugador. Null, como en las exploradas, si ya
       * tiene duenyo: el concejo deja de atender y eso se nota.
       */
      readonly influenciaPropia: number | null;
    };

export const RUMBOS = [
  'norte',
  'nordeste',
  'este',
  'sudeste',
  'sur',
  'sudoeste',
  'oeste',
  'noroeste',
] as const;
export type Rumbo = (typeof RUMBOS)[number];

/** Una recua o un rebanyo ajenos, vistos de lejos: de que casa son, donde y hacia donde van. */
export interface UnidadAjena {
  readonly clase: 'recua' | 'rebanyo';
  readonly casa: Casa;
  readonly comarca: IdComarca;
  readonly rumbo: Rumbo | null;
}

/** Lo publico de cada casa de la partida. */
export interface CasaPublica {
  readonly id: IdJugador;
  readonly nombre: string;
  readonly casa: Casa;
  readonly prestigio: number;
  /** Su credito, publico: con quien se firma importa (T-103). */
  readonly credito: number;
  /**
   * Turnos seguidos sin dar ordenes: publico, para que nadie pierda el tiempo con quien falta. El
   * escalon sale de `situacionDeAusencia` con las tablas (T-105).
   */
  readonly turnosSinOrdenes: number;
  /** Ultimo turno de su amparo, o null si no lo tiene (T-105). */
  readonly amparoHasta: number | null;
}

export interface VistaJugador {
  /** El turno que toca jugar. */
  readonly turno: number;
  readonly configuracion: ConfiguracionPartida;
  /** El jugador, entero, con su conocimiento sin lo desconocido. */
  readonly jugador: EstadoJugador;
  readonly casas: readonly CasaPublica[];
  readonly clasificacion: readonly PuestoEnLaClasificacion[];
  readonly comarcas: Readonly<Record<string, VistaComarca>>;
  readonly recuas: readonly Recua[];
  readonly rebanyos: readonly Rebanyo[];
  readonly obras: readonly Obra[];
  readonly ordenes: readonly Orden[];
  readonly ajenas: readonly UnidadAjena[];
  /** Los tramos mejorados cuyas dos puntas conoce. */
  readonly caminos: Readonly<Record<string, EstadoTramo>>;
  /** Los acontecimientos anunciados, salvo los de comarcas que no conoce. */
  readonly acontecimientos: readonly Acontecimiento[];
  /** Los contratos en los que es parte, propuestos o firmados (T-103). */
  readonly contratos: readonly Contrato[];
  /** La temporada cerrada, publica: clasificacion final y reconocimientos (T-104). */
  readonly cierre: CierreDeTemporada | null;
  /** Sus mesnadas (T-120). */
  readonly mesnadas: readonly Mesnada[];
  /** Las mesnadas ajenas en comarcas donde tiene tierra o gente, con los hombres en tramos de 10. */
  readonly mesnadasAjenas: readonly MesnadaAjena[];
  /** Todas las hostilidades: son publicas (T-120). */
  readonly hostilidades: readonly Hostilidad[];
}

export interface MesnadaAjena {
  readonly jugador: IdJugador;
  readonly comarca: IdComarca;
  readonly hombres: number;
}

/** El rumbo de una comarca a otra, en ocho puntos, por sus centros [longitud, latitud]. */
export function rumboEntre(desde: IdComarca, hacia: IdComarca, mundo: Mundo): Rumbo | null {
  const a = mundo.comarcas[desde]?.centro;
  const b = mundo.comarcas[hacia]?.centro;
  if (a === undefined || b === undefined) return null;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return null;
  // tan(67,5°) ≈ 2,414: por encima, el rumbo es de los cuatro puntos principales.
  const ax = Math.abs(dx) * 1000;
  const ay = Math.abs(dy) * 1000;
  if (ax > Math.abs(dy) * 2414) return dx > 0 ? 'este' : 'oeste';
  if (ay > Math.abs(dx) * 2414) return dy > 0 ? 'norte' : 'sur';
  if (dy > 0) return dx > 0 ? 'nordeste' : 'noroeste';
  return dx > 0 ? 'sudeste' : 'sudoeste';
}

function dondeEsta(situacion: SituacionMovil): IdComarca {
  return situacion.donde === 'comarca' ? situacion.comarca : situacion.desde;
}

function haciaDonde(situacion: SituacionMovil, ruta: readonly IdComarca[]): IdComarca | null {
  return situacion.donde === 'camino' ? situacion.hasta : (ruta[0] ?? null);
}

export function vistaDeJugador(
  estado: EstadoPartida,
  jugador: IdJugador,
  mundo: Mundo,
): VistaJugador {
  const yo = estado.jugadores[jugador];
  if (yo === undefined) {
    throw new ErrorDeMotor(
      'entidad-desconocida',
      `No hay ningun jugador "${jugador}" en la partida.`,
    );
  }

  const conocimiento: Record<string, Conocimiento> = {};
  for (const [id, c] of Object.entries(yo.conocimiento)) {
    if (c.nivel !== 'desconocida') conocimiento[id] = c;
  }
  const nivelDe = (id: string) => conocimiento[id]?.nivel ?? 'desconocida';
  const conoce = (id: string): boolean => nivelDe(id) !== 'desconocida';

  const propias = <T extends { readonly jugador: IdJugador; readonly id: string }>(
    unidades: Readonly<Record<string, T>>,
  ): T[] =>
    Object.values(unidades)
      .filter((u) => u.jugador === jugador)
      .sort((a, b) => comparar(a.id, b.id));
  const recuas = propias(estado.recuas);
  const presencia = new Set<string>(
    recuas.flatMap((r) => (r.situacion.donde === 'comarca' ? [r.situacion.comarca] : [])),
  );

  const comarcas: Record<string, VistaComarca> = {};
  for (const id of Object.keys(conocimiento).sort(comparar)) {
    const c = conocimiento[id];
    const hoy = estado.comarcas[id];
    const geografia = mundo.comarcas[id];
    if (c === undefined) continue;
    if (hoy?.duenyo === jugador) {
      comarcas[id] = { nivel: 'propia', comarca: hoy };
    } else if (c.nivel === 'explorada' || c.nivel === 'propia') {
      const neutral = hoy !== undefined && hoy.duenyo === null;
      const ajenas: Record<string, number> = {};
      if (neutral && presencia.has(id)) {
        for (const otro of Object.keys(hoy.influencias).sort(comparar)) {
          if (otro !== jugador) ajenas[otro] = Math.floor((hoy.influencias[otro] ?? 0) / 10) * 10;
        }
      }
      comarcas[id] = {
        nivel: 'explorada',
        turnoUltimaNoticia: c.turnoUltimaNoticia,
        datos: c.datos,
        influenciaPropia: neutral ? (hoy.influencias[jugador] ?? 0) : null,
        influenciasAjenas: ajenas,
      };
    } else if (geografia !== undefined) {
      comarcas[id] = {
        nivel: 'oida',
        turnoUltimaNoticia: c.turnoUltimaNoticia,
        nombre: geografia.nombre,
        region: geografia.region,
        influenciaPropia:
          hoy !== undefined && hoy.duenyo === null ? (hoy.influencias[jugador] ?? 0) : null,
      };
    }
  }

  // Lo ajeno se ve en lo propio y donde hay una recua propia; de lejos: la casa y el rumbo.
  const seVe = (comarca: IdComarca): boolean =>
    estado.comarcas[comarca]?.duenyo === jugador ||
    (nivelDe(comarca) === 'explorada' && presencia.has(comarca));
  const ajenas: UnidadAjena[] = [];
  const unidades: { clase: 'recua' | 'rebanyo'; u: Recua | Rebanyo }[] = [
    ...Object.values(estado.recuas).map((u) => ({ clase: 'recua' as const, u })),
    ...Object.values(estado.rebanyos).map((u) => ({ clase: 'rebanyo' as const, u })),
  ];
  for (const { clase, u } of unidades) {
    const casa = estado.jugadores[u.jugador]?.casa;
    const comarca = dondeEsta(u.situacion);
    if (u.jugador === jugador || casa === undefined || !seVe(comarca)) continue;
    const hacia = haciaDonde(u.situacion, u.ruta);
    ajenas.push({
      clase,
      casa,
      comarca,
      rumbo: hacia === null ? null : rumboEntre(comarca, hacia, mundo),
    });
  }
  // Sin identificadores, el orden no puede delatar nada: se ordena por lo que se ve.
  ajenas.sort(
    (a, b) =>
      comparar(a.comarca, b.comarca) ||
      comparar(a.clase, b.clase) ||
      comparar(a.casa, b.casa) ||
      comparar(a.rumbo ?? '', b.rumbo ?? ''),
  );

  const caminos: Record<string, EstadoTramo> = {};
  for (const clave of Object.keys(estado.caminos).sort(comparar)) {
    const [una, otra] = clave.split('|');
    const tramo = estado.caminos[clave];
    if (
      una !== undefined &&
      otra !== undefined &&
      tramo !== undefined &&
      conoce(una) &&
      conoce(otra)
    ) {
      caminos[clave] = tramo;
    }
  }

  return {
    turno: estado.turno,
    configuracion: estado.configuracion,
    jugador: { ...yo, conocimiento },
    casas: Object.values(estado.jugadores)
      .sort((a, b) => comparar(a.id, b.id))
      .map((j) => ({
        id: j.id,
        nombre: j.nombre,
        casa: j.casa,
        prestigio: j.prestigio,
        credito: j.credito,
        turnosSinOrdenes: j.turnosSinOrdenes,
        amparoHasta:
          j.amparoHasta !== undefined && j.amparoHasta >= estado.turno ? j.amparoHasta : null,
      })),
    clasificacion: estado.clasificacion,
    comarcas,
    recuas,
    rebanyos: propias(estado.rebanyos),
    obras: propias(estado.obras),
    ordenes: estado.ordenes.filter((o) => o.jugador === jugador),
    ajenas,
    caminos,
    acontecimientos: estado.acontecimientos.filter((a) => a.comarca === null || conoce(a.comarca)),
    contratos: Object.values(estado.contratos ?? {})
      .filter((c) => c.propone === jugador || c.recibe === jugador)
      .sort((a, b) => comparar(a.id, b.id)),
    cierre: estado.cierre ?? null,
    mesnadas: Object.values(estado.mesnadas ?? {})
      .filter((m) => m.jugador === jugador)
      .sort((a, b) => comparar(a.id, b.id)),
    mesnadasAjenas: mesnadasAjenasDe(estado, jugador),
    hostilidades: Object.keys(estado.hostilidades ?? {})
      .sort(comparar)
      .flatMap((clave) => {
        const h = estado.hostilidades?.[clave];
        return h === undefined ? [] : [h];
      }),
  };
}

/** Las mesnadas ajenas que se ven: donde el jugador tiene tierra o una recua (T-120). */
function mesnadasAjenasDe(estado: EstadoPartida, jugador: IdJugador): MesnadaAjena[] {
  const vigila = new Set<string>();
  for (const c of Object.values(estado.comarcas)) if (c.duenyo === jugador) vigila.add(c.id);
  for (const r of Object.values(estado.recuas)) {
    if (r.jugador === jugador && r.situacion.donde === 'comarca') vigila.add(r.situacion.comarca);
  }
  return Object.values(estado.mesnadas ?? {})
    .filter(
      (m) =>
        m.jugador !== jugador && m.situacion.donde === 'comarca' && vigila.has(m.situacion.comarca),
    )
    .sort((a, b) => comparar(a.id, b.id))
    .flatMap((m) =>
      m.situacion.donde === 'comarca'
        ? [
            {
              jugador: m.jugador,
              comarca: m.situacion.comarca,
              hombres: Math.max(10, Math.round(m.hombres / 10) * 10),
            },
          ]
        : [],
    );
}
