// Lo que una casa cambia, visto desde las fases (docs/04-casas-y-tradiciones.md; fichas T-041 y
// T-042).
//
// Las fases no saben de casas ni de tradiciones: piden aqui los modificadores, los permisos o las
// prohibiciones de un jugador y reciben los de su casa compuestos con las tradiciones que eligio,
// o los neutros si no hay jugador. Ninguna regla de esta carpeta ni de las fases nombra a una casa
// concreta: todas salen de las tablas (`datos/casas.ts` y `datos/tradiciones.ts`).
import { MODIFICADORES_NEUTROS, SIN_PERMISOS, SIN_PROHIBICIONES } from '../../datos/casas.ts';
import { ErrorDeMotor } from '../../errores.ts';
import type { EstadoJugador, EstadoPartida } from '../../tipos/estado.ts';
import { RECURSOS_AGOTABLES } from '../../tipos/estado.ts';
import type { IdJugador } from '../../tipos/ids.ts';
import { RECURSOS } from '../../tipos/recursos.ts';
import type {
  Casa,
  DatosTradicion,
  Modificadores,
  Permisos,
  Prohibiciones,
  TablasDeReglas,
  TipoEdificio,
} from '../../tipos/reglas.ts';
import { RONDAS_DE_TRADICION, TIPOS_DE_EDIFICIO, TIPOS_DE_OBRA_MAYOR } from '../../tipos/reglas.ts';
import { MIL, multiplicarFactores } from '../../utiles/enteros.ts';

type PorClave<K extends string> = Readonly<Partial<Record<K, number>>>;

/** Compone dos tablas por clave; lo que la tradicion no toca se queda como estaba. */
function porClave<K extends string>(
  claves: readonly K[],
  casa: PorClave<K>,
  tradicion: PorClave<K> | undefined,
  componer: (deLaCasa: number | undefined, deLaTradicion: number) => number,
): PorClave<K> {
  if (tradicion === undefined) return casa;
  const resultado: Partial<Record<K, number>> = {};
  for (const clave of claves) {
    const suyo = tradicion[clave];
    const antes = casa[clave];
    if (suyo !== undefined) resultado[clave] = componer(antes, suyo);
    else if (antes !== undefined) resultado[clave] = antes;
  }
  return resultado;
}

const factor = (casa: number, tradicion: number | undefined): number =>
  tradicion === undefined ? casa : multiplicarFactores(casa, [tradicion]);
const factorDeClave = (casa: number | undefined, tradicion: number): number =>
  multiplicarFactores(casa ?? MIL, [tradicion]);
const suma = (casa: number, tradicion: number | undefined): number => casa + (tradicion ?? 0);
const fija = (_casa: number | undefined, tradicion: number): number => tradicion;

/**
 * Los modificadores de una casa con los de una tradicion encima, segun
 * `COMPOSICION_DE_MODIFICADORES`: los factores se multiplican, los sumandos se suman y los
 * valores fijos los pone la tradicion.
 */
export function componerModificadores(
  casa: Modificadores,
  t: Readonly<Partial<Modificadores>>,
): Modificadores {
  return {
    produccionMil: porClave(RECURSOS, casa.produccionMil, t.produccionMil, factorDeClave),
    costeEdificioMil: porClave(
      TIPOS_DE_EDIFICIO,
      casa.costeEdificioMil,
      t.costeEdificioMil,
      factorDeClave,
    ),
    nivelMaximoEdificio: porClave(
      TIPOS_DE_EDIFICIO,
      casa.nivelMaximoEdificio,
      t.nivelMaximoEdificio,
      fija,
    ),
    potencialMinimoEdificio: porClave(
      TIPOS_DE_EDIFICIO,
      casa.potencialMinimoEdificio,
      t.potencialMinimoEdificio,
      fija,
    ),
    solaresExtra: suma(casa.solaresExtra, t.solaresExtra),
    aperosMaximo: t.aperosMaximo ?? casa.aperosMaximo,
    pasoRecuaMil: suma(casa.pasoRecuaMil, t.pasoRecuaMil),
    costeRecuaMil: factor(casa.costeRecuaMil, t.costeRecuaMil),
    porteExtra: suma(casa.porteExtra, t.porteExtra),
    obraMayorCosteMil: factor(casa.obraMayorCosteMil, t.obraMayorCosteMil),
    obraMayorAvanceMil: factor(casa.obraMayorAvanceMil, t.obraMayorAvanceMil),
    obraSinFrenazoInvernal: t.obraSinFrenazoInvernal ?? casa.obraSinFrenazoInvernal,
    mermaPanMil: t.mermaPanMil ?? casa.mermaPanMil,
    comisionMercadoMil: t.comisionMercadoMil ?? casa.comisionMercadoMil,
    lanaEsquileoMil: factor(casa.lanaEsquileoMil, t.lanaEsquileoMil),
    costeRebanyoMil: factor(casa.costeRebanyoMil, t.costeRebanyoMil),
    lealtadMinima: t.lealtadMinima ?? casa.lealtadMinima,
    agotamientoMil: porClave(
      RECURSOS_AGOTABLES,
      casa.agotamientoMil,
      t.agotamientoMil,
      factorDeClave,
    ),
    crecimientoMil: factor(casa.crecimientoMil, t.crecimientoMil),
    produccionEdificioMil: porClave(
      TIPOS_DE_EDIFICIO,
      casa.produccionEdificioMil,
      t.produccionEdificioMil,
      factorDeClave,
    ),
    produccionEdificioEnVegaMil: porClave(
      TIPOS_DE_EDIFICIO,
      casa.produccionEdificioEnVegaMil,
      t.produccionEdificioEnVegaMil,
      factorDeClave,
    ),
    laborFueraDeVegaMil: factor(casa.laborFueraDeVegaMil, t.laborFueraDeVegaMil),
    edificiosPorRequisito: porClave(
      TIPOS_DE_EDIFICIO,
      casa.edificiosPorRequisito,
      t.edificiosPorRequisito,
      fija,
    ),
    costeObraMayorMil: porClave(
      TIPOS_DE_OBRA_MAYOR,
      casa.costeObraMayorMil,
      t.costeObraMayorMil,
      factorDeClave,
    ),
    capacidadPorCasasExtra: suma(casa.capacidadPorCasasExtra, t.capacidadPorCasasExtra),
    vecinosParaPueblaMil: factor(casa.vecinosParaPueblaMil, t.vecinosParaPueblaMil),
    avanceObraMayorMil: porClave(
      TIPOS_DE_OBRA_MAYOR,
      casa.avanceObraMayorMil,
      t.avanceObraMayorMil,
      factorDeClave,
    ),
    cuadrillasExtra: suma(casa.cuadrillasExtra, t.cuadrillasExtra),
    efectoAperosMil: factor(casa.efectoAperosMil, t.efectoAperosMil),
    administracionMil: factor(casa.administracionMil, t.administracionMil),
    influenciaMil: factor(casa.influenciaMil, t.influenciaMil),
    bastimentoMil: factor(casa.bastimentoMil, t.bastimentoMil),
  };
}

/**
 * Las tradiciones elegidas por el jugador, en el orden de las rondas. Los factores se redondean a
 * cada paso, asi que se componen siempre en ese orden y no en el que se eligieron; y como dos
 * tradiciones de una casa no pueden fijar lo mismo (lo vigila el validador de tablas), los valores
 * fijos tampoco dependen de el.
 */
function tradicionesDe(jugador: EstadoJugador, reglas: TablasDeReglas): DatosTradicion[] {
  const elegidas = jugador.tradiciones.map((id) => {
    const datos = reglas.tradiciones[id];
    if (datos === undefined) {
      throw new ErrorDeMotor(
        'entidad-desconocida',
        `${jugador.id} tiene la tradicion "${id}", que no esta en las tablas: las tablas no son las de la partida.`,
        { jugador: jugador.id, tradicion: id },
      );
    }
    return datos;
  });
  const puesto = (t: DatosTradicion): number => RONDAS_DE_TRADICION.indexOf(t.ronda);
  return elegidas.sort((a, b) => puesto(a) - puesto(b));
}

/** Los modificadores de un jugador: los de su casa con los de sus tradiciones encima. */
export function modificadoresDelJugador(
  jugador: EstadoJugador,
  reglas: TablasDeReglas,
): Modificadores {
  return tradicionesDe(jugador, reglas).reduce(
    (modificadores, tradicion) => componerModificadores(modificadores, tradicion.modificadores),
    reglas.casas[jugador.casa].modificadores,
  );
}

/** Lo que una tradicion dice de un permiso o de una prohibicion manda sobre lo de la casa. */
export function permisosDelJugador(jugador: EstadoJugador, reglas: TablasDeReglas): Permisos {
  return tradicionesDe(jugador, reglas).reduce<Permisos>(
    (permisos, tradicion) => ({ ...permisos, ...tradicion.permisos }),
    reglas.casas[jugador.casa].permisos,
  );
}

export function prohibicionesDelJugador(
  jugador: EstadoJugador,
  reglas: TablasDeReglas,
): Prohibiciones {
  return tradicionesDe(jugador, reglas).reduce<Prohibiciones>(
    (prohibiciones, tradicion) => ({ ...prohibiciones, ...tradicion.prohibiciones }),
    reglas.casas[jugador.casa].prohibiciones,
  );
}

/** Los modificadores de un jugador por su id; los neutros si no hay jugador. */
export function modificadoresDe(
  estado: EstadoPartida,
  jugador: IdJugador | null,
  reglas: TablasDeReglas,
): Modificadores {
  const datos = jugador === null ? undefined : estado.jugadores[jugador];
  return datos === undefined ? MODIFICADORES_NEUTROS : modificadoresDelJugador(datos, reglas);
}

export function permisosDe(
  estado: EstadoPartida,
  jugador: IdJugador | null,
  reglas: TablasDeReglas,
): Permisos {
  const datos = jugador === null ? undefined : estado.jugadores[jugador];
  return datos === undefined ? SIN_PERMISOS : permisosDelJugador(datos, reglas);
}

export function prohibicionesDe(
  estado: EstadoPartida,
  jugador: IdJugador | null,
  reglas: TablasDeReglas,
): Prohibiciones {
  const datos = jugador === null ? undefined : estado.jugadores[jugador];
  return datos === undefined ? SIN_PROHIBICIONES : prohibicionesDelJugador(datos, reglas);
}

/** Motivo con el que se cancela una orden que la casa del jugador tiene prohibida. */
export const PROHIBIDO_POR_LA_CASA = 'prohibido-por-la-casa';

/**
 * Lo que trae la casa de salida, sin tradiciones: lo que consulta el alta (ficha T-049 §4.5).
 * Tambien el alta lee la tabla de casas por aqui, no por su cuenta.
 */
export function modificadoresDeCasa(casa: Casa, reglas: TablasDeReglas): Modificadores {
  return reglas.casas[casa].modificadores;
}

export function permisosDeCasa(casa: Casa, reglas: TablasDeReglas): Permisos {
  return reglas.casas[casa].permisos;
}

/** Como empieza la casa: su primera pieza de oficio y si su pan viene del mercado. */
export function arranqueDeCasa(
  casa: Casa,
  reglas: TablasDeReglas,
): { readonly edificioDeOrigen: TipoEdificio | null; readonly compraElPan: boolean } {
  const datos = reglas.casas[casa];
  return { edificioDeOrigen: datos.edificioDeOrigen, compraElPan: datos.compraElPan };
}
