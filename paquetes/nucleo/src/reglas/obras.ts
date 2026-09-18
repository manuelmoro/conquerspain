// Obras: requisitos, avance y efectos de las obras mayores (docs/03-economia.md §3.3 y §3.11;
// ficha T-035).
import type { EstadoEstacional } from './calendario.ts';
import type { Mejoras } from './ruta.ts';
import { calidadDeTramo, tienePuente, tramoEntre } from './ruta.ts';
import type { EstadoComarca, EstadoPartida, Obra } from '../tipos/estado.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { Recursos } from '../tipos/recursos.ts';
import { recursosSegun } from '../tipos/recursos.ts';
import type {
  Modificadores,
  Permisos,
  TablasDeReglas,
  TipoEdificio,
  TipoObraMayor,
} from '../tipos/reglas.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { MIL, multiplicarFactores } from '../utiles/enteros.ts';

/**
 * Avance de una obra en un turno, en milesimas: una obra de tres turnos necesita 3000. En invierno
 * la piedra va a la mitad y la madera tarda un 50 % mas (redondeando el avance hacia arriba, para
 * que una obra de dos turnos tarde tres y no cuatro).
 */
export function avanceDelTurnoMil(
  esDePiedra: boolean,
  estacional: EstadoEstacional,
  casa: Modificadores,
): Milesimas {
  if (casa.obraSinFrenazoInvernal) return MIL;
  const factor = esDePiedra ? estacional.factorObraPiedraMil : estacional.factorObraMaderaMil;
  return Math.ceil((MIL * MIL) / factor);
}

/** Solares de la comarca: los del mapa mas los que de la casa. */
export function solaresDe(solaresDelMapa: number, casa: Modificadores): number {
  return solaresDelMapa + casa.solaresExtra;
}

/** Cada nivel de edificio ocupa un solar, y cada edificio en obra, el suyo. */
export function solaresOcupados(comarca: EstadoComarca, obras: readonly Obra[]): number {
  const niveles = Object.values(comarca.edificios).reduce((total, nivel) => total + nivel, 0);
  const enObra = obras.filter((o) => o.comarca === comarca.id && o.tipo === 'edificio').length;
  return niveles + enObra;
}

export type MotivoSinConstruir =
  | 'nivel-maximo'
  | 'sin-solar'
  | 'potencial-insuficiente'
  | 'falta-edificio-requerido'
  | 'sin-permiso';

/** Por que no se puede empezar este edificio en esta comarca, o null si se puede. */
export function impedimentoDeConstruir(
  comarca: EstadoComarca,
  edificio: TipoEdificio,
  obras: readonly Obra[],
  solaresDelMapa: number,
  casa: Modificadores,
  reglas: TablasDeReglas,
  /** Permisos de la casa: algunos edificios (la acequia menor) los exigen. */
  permisos: Permisos,
): MotivoSinConstruir | null {
  const datos = reglas.edificios[edificio];
  if (datos.exigePermiso !== null && !permisos[datos.exigePermiso]) return 'sin-permiso';
  const enObra = obras.filter(
    (o) => o.comarca === comarca.id && o.tipo === 'edificio' && o.que === edificio,
  ).length;
  const maximo = casa.nivelMaximoEdificio[edificio] ?? datos.nivelMaximo;
  if ((comarca.edificios[edificio] ?? 0) + enObra >= maximo) return 'nivel-maximo';
  if (solaresOcupados(comarca, obras) >= solaresDe(solaresDelMapa, casa)) return 'sin-solar';
  const minimo = casa.potencialMinimoEdificio[edificio] ?? datos.potencialMinimo;
  if (datos.potencial !== null && comarca.potenciales[datos.potencial] < minimo) {
    return 'potencial-insuficiente';
  }
  if (datos.requiereEdificio !== null && (comarca.edificios[datos.requiereEdificio] ?? 0) < 1) {
    return 'falta-edificio-requerido';
  }
  return null;
}

/** Lo que devuelve derribar un nivel: la mitad del material, truncando. */
export function devolucionDeDerribo(edificio: TipoEdificio, reglas: TablasDeReglas): Recursos {
  const coste = reglas.edificios[edificio].coste;
  return recursosSegun((r) => multiplicarFactores(coste[r], [reglas.obras.devolucionDerriboMil]));
}

/** Una ciudad: bastantes vecinos y muralla (docs/03 §3.11). */
export function esCiudad(comarca: EstadoComarca, reglas: TablasDeReglas): boolean {
  return (
    comarca.poblacion >= reglas.obras.vecinosDeCiudad && comarca.obrasMayores.includes('muralla')
  );
}

export type MotivoSinObraMayor =
  | 'ya-construida'
  | 'ya-en-obra'
  | 'sin-tramo'
  | 'sin-vado'
  | 'sin-camino-carretero'
  | 'poca-lealtad'
  | 'no-es-ciudad'
  | 'sin-sede-episcopal'
  | 'sin-cantera'
  | 'no-es-costa'
  | 'sin-vega-fluvial';

export interface LugarDeObraMayor {
  readonly comarca: EstadoComarca;
  /** Otra punta del tramo, en el puente y la calzada. */
  readonly hacia: string | null;
}

/** Por que no se puede empezar esta obra mayor aqui, o null si se puede. */
export function impedimentoDeObraMayor(
  tipo: TipoObraMayor,
  lugar: LugarDeObraMayor,
  estado: EstadoPartida,
  mundo: Mundo,
  reglas: TablasDeReglas,
): MotivoSinObraMayor | null {
  const { comarca, hacia } = lugar;
  const enObra = Object.values(estado.obras).some(
    (o) =>
      o.tipo === 'obra mayor' &&
      o.que === tipo &&
      ((o.comarca === comarca.id && o.hacia === hacia) ||
        (hacia !== null && o.comarca === hacia && o.hacia === comarca.id)),
  );
  if (enObra) return 'ya-en-obra';

  if (tipo === 'puente' || tipo === 'calzada') {
    const camino = hacia === null ? undefined : tramoEntre(mundo, comarca.id, hacia);
    if (camino === undefined) return 'sin-tramo';
    if (tipo === 'puente') {
      if (!camino.vado) return 'sin-vado';
      return tienePuente(camino, estado.caminos) ? 'ya-construida' : null;
    }
    const calidad = calidadDeTramo(camino, estado.caminos);
    if (calidad === 'calzada') return 'ya-construida';
    return calidad === 'carretero' ? null : 'sin-camino-carretero';
  }

  if (comarca.obrasMayores.includes(tipo)) return 'ya-construida';
  const geografia = mundo.comarcas[comarca.id];
  switch (tipo) {
    case 'monasterio':
      return comarca.lealtad >= reglas.obras.lealtadParaMonasterio ? null : 'poca-lealtad';
    case 'catedral':
      if (!esCiudad(comarca, reglas)) return 'no-es-ciudad';
      if (!(geografia?.rasgos.includes('ciudad-episcopal') ?? false)) return 'sin-sede-episcopal';
      return (comarca.edificios['cantera'] ?? 0) > 0 ? null : 'sin-cantera';
    case 'muralla':
      return null;
    case 'atarazana':
      return geografia?.terreno === 'costa' ? null : 'no-es-costa';
    case 'acequia-mayor':
      return geografia?.terreno === 'vega' && geografia.rasgos.includes('vega-fluvial')
        ? null
        : 'sin-vega-fluvial';
  }
}

/** Coste total de una obra mayor para una casa. */
export function costeDeObraMayor(
  tipo: TipoObraMayor,
  casa: Modificadores,
  reglas: TablasDeReglas,
): Recursos {
  const base = reglas.obrasMayores[tipo].coste;
  const propia = casa.costeObraMayorMil[tipo] ?? MIL;
  return recursosSegun((r) => multiplicarFactores(base[r], [casa.obraMayorCosteMil, propia]));
}

/**
 * Lo que hay que entregar para llevar la obra hasta `avanceMil`: el coste se reparte en proporcion
 * al avance, asi que al terminar se ha pagado exactamente el total y nunca se paga dos veces.
 */
export function cuotaHasta(obra: Obra, avanceMil: Milesimas): Recursos {
  return recursosSegun((r) => {
    const debido = Math.floor((obra.costeTotal[r] * avanceMil) / obra.avanceNecesarioMil);
    return Math.max(0, debido - obra.entregado[r]);
  });
}

/** Lo que queda en pie de una obra abandonada tras un turno: pierde un 1 % de lo construido. */
export function avanceTrasDeterioro(obra: Obra, reglas: TablasDeReglas): Milesimas {
  return obra.avanceMil - multiplicarFactores(obra.avanceMil, [reglas.obras.deterioroAbandonoMil]);
}

/** El monasterio da un 20 % mas de crecimiento en su comarca y en las vecinas (lo usa T-036). */
export function factorCrecimientoPorObrasMil(
  comarca: string,
  estado: EstadoPartida,
  mundo: Mundo,
  reglas: TablasDeReglas,
): Milesimas {
  const cerca = [comarca, ...(mundo.vecinos[comarca] ?? [])];
  const hayMonasterio = cerca.some((id) =>
    estado.comarcas[id]?.obrasMayores.includes('monasterio'),
  );
  return hayMonasterio ? MIL + reglas.obras.crecimientoPorMonasterioMil : MIL;
}

/** La atarazana habilita el comercio maritimo de larga distancia (fase posterior). */
export function habilitaComercioMaritimo(comarca: EstadoComarca): boolean {
  return comarca.obrasMayores.includes('atarazana');
}

/** La muralla protege del bandidaje (fase posterior). */
export function protegeDelBandidaje(comarca: EstadoComarca): boolean {
  return comarca.obrasMayores.includes('muralla');
}

/** El puente salva la crecida de un vado (los acontecimientos de T-039 lo consultan). */
export function salvaCrecidas(mejoras: Mejoras, clave: string): boolean {
  return mejoras[clave]?.puente === true;
}
