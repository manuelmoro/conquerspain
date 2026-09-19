// El mayordomo (docs/02-diseno-nucleo.md §2.5.3; ficha T-045 §4.3).
//
// Funciones puras: cuantas reglas tiene activas un jugador, si una condicion se cumple y que orden
// sale de una accion. No es una IA: es un capataz con instrucciones. Sus ordenes son ordenes de
// jugador, con las mismas validaciones, y nunca incorpora comarcas.
import type { EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type { IdComarca, IdOrden } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type {
  AccionDeMayordomo,
  CondicionDeMayordomo,
  Orden,
  OrdenBase,
  ParadaDeRuta,
  ReglaDeMayordomo,
} from '../tipos/ordenes.ts';
import { recursosSegun } from '../tipos/recursos.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import type { EstadoEstacional } from './calendario.ts';
import { estacionDe } from './calendario.ts';
import { esPastoCorrecto } from './pastos.ts';

/** Reglas que el mayordomo atiende: 3 y una mas por nivel de mercado en la capital, hasta 6. */
export function limiteDeReglas(
  jugador: EstadoJugador,
  estado: EstadoPartida,
  reglas: TablasDeReglas,
): number {
  const t = reglas.mayordomo;
  const mercado = estado.comarcas[jugador.capital]?.edificios['mercado'] ?? 0;
  return Math.min(t.reglasMaximas, t.reglasIniciales + mercado * t.reglasPorNivelDeMercado);
}

/** Las reglas que se evaluan este turno: las de menor prioridad, hasta el limite. */
export function reglasActivas(
  jugador: EstadoJugador,
  estado: EstadoPartida,
  reglas: TablasDeReglas,
): ReglaDeMayordomo[] {
  return [...jugador.mayordomo]
    .sort((a, b) => a.prioridad - b.prioridad)
    .slice(0, limiteDeReglas(jugador, estado, reglas));
}

export interface SituacionDelMayordomo {
  readonly estado: EstadoPartida;
  readonly jugador: EstadoJugador;
  readonly mundo: Mundo;
  readonly reglas: TablasDeReglas;
  readonly turno: number;
  readonly estacional: EstadoEstacional;
}

/**
 * Si la condicion se cumple al empezar el turno. Los precios son los que el jugador sabe, con su
 * fecha: el mayordomo no ve mas que su amo.
 */
export function cumple(condicion: CondicionDeMayordomo, s: SituacionDelMayordomo): boolean {
  const { jugador } = s;
  switch (condicion.tipo) {
    case 'pan-disponible-menor-que':
      return jugador.almacen.pan - jugador.reservado.pan < condicion.cantidad;
    case 'recurso-almacenado-mayor-que':
      return jugador.almacen[condicion.recurso] > condicion.cantidad;
    case 'precio-en-plaza-menor-que':
    case 'precio-en-plaza-mayor-que': {
      const precio = jugador.plazas[condicion.plaza]?.preciosMil[condicion.recurso];
      if (precio === undefined) return false;
      return condicion.tipo === 'precio-en-plaza-menor-que'
        ? precio < condicion.precioMil
        : precio > condicion.precioMil;
    }
    case 'obra-terminada-en':
      return (
        s.estado.comarcas[condicion.comarca]?.duenyo === jugador.id &&
        !Object.values(s.estado.obras).some(
          (o) => o.comarca === condicion.comarca && o.jugador === jugador.id && !o.abandonada,
        )
      );
    case 'escasez':
      return jugador.escasez;
    case 'estacion-empieza':
      return (
        estacionDe(s.turno, s.reglas) === condicion.estacion &&
        (s.turno === 1 || estacionDe(s.turno - 1, s.reglas) !== condicion.estacion)
      );
    case 'rebanyo-sin-pasto':
      return Object.values(s.estado.rebanyos).some((rebanyo) => {
        if (rebanyo.jugador !== jugador.id || rebanyo.situacion.donde !== 'comarca') return false;
        const comarca = s.estado.comarcas[rebanyo.situacion.comarca];
        const geografia = s.mundo.comarcas[rebanyo.situacion.comarca];
        return (
          comarca !== undefined &&
          geografia !== undefined &&
          !esPastoCorrecto(comarca, geografia, s.estacional, s.reglas)
        );
      });
  }
}

/** Una orden de su casa, sin coste y en marcha desde ya. */
function base(id: IdOrden, jugador: EstadoJugador, turno: number): OrdenBase {
  return {
    id,
    jugador: jugador.id,
    turnoAlta: turno,
    estado: 'pendiente',
    coste: recursosSegun(() => 0),
    turnosTotales: 1,
    turnosHechos: 0,
    motivoEspera: null,
    delMayordomo: true,
    turnoProgramado: null,
    cola: null,
  };
}

/** La orden que da el mayordomo por una accion: la misma que daria el jugador. */
export function ordenDeAccion(
  accion: AccionDeMayordomo,
  id: IdOrden,
  jugador: EstadoJugador,
  turno: number,
): Orden {
  const b = base(id, jugador, turno);
  const parada = (comarca: IdComarca): ParadaDeRuta => ({
    comarca,
    cargar: {},
    descargar: {},
    vender: {},
    comprar: {},
  });
  switch (accion.tipo) {
    case 'mercado':
      return {
        ...b,
        tipo: 'mercado',
        mercado: accion.mercado,
        recua: accion.recua,
        recurso: accion.recurso,
        operacion: accion.operacion,
        cantidad: accion.cantidad,
        precioLimiteMil: accion.precioLimiteMil,
      };
    case 'enviar-recua':
      return {
        ...b,
        tipo: 'ruta',
        recua: accion.recua,
        rebanyo: null,
        paradas: [parada(accion.comarca)],
        circular: false,
      };
    case 'mover-rebanyo':
      return {
        ...b,
        tipo: 'ruta',
        recua: null,
        rebanyo: accion.rebanyo,
        paradas: [parada(accion.comarca)],
        circular: false,
      };
    case 'carga-fiscal':
      return {
        ...b,
        tipo: 'politica',
        comarca: accion.comarca,
        fuero: null,
        cargaFiscal: accion.carga,
        dehesa: null,
        conservarConSal: null,
      };
  }
}

/**
 * La accion no hace falta: ya hay una orden viva que hace lo mismo (del jugador o del propio
 * mayordomo), o ya esta hecho. Asi una condicion que dura varios turnos no amontona ordenes.
 */
export function sobra(
  accion: AccionDeMayordomo,
  jugador: EstadoJugador,
  estado: EstadoPartida,
): boolean {
  const vivas = estado.ordenes.filter(
    (o) => o.jugador === jugador.id && o.estado !== 'terminada' && o.estado !== 'cancelada',
  );
  switch (accion.tipo) {
    case 'mercado':
      return vivas.some(
        (o) =>
          o.tipo === 'mercado' &&
          o.recua === accion.recua &&
          o.mercado === accion.mercado &&
          o.recurso === accion.recurso &&
          o.operacion === accion.operacion,
      );
    case 'enviar-recua': {
      const recua = estado.recuas[accion.recua];
      const yaAlli =
        recua?.situacion.donde === 'comarca' &&
        recua.situacion.comarca === accion.comarca &&
        recua.ruta.length === 0;
      return yaAlli || vivas.some((o) => o.tipo === 'ruta' && o.recua === accion.recua);
    }
    case 'mover-rebanyo': {
      const rebanyo = estado.rebanyos[accion.rebanyo];
      const yaAlli =
        rebanyo?.situacion.donde === 'comarca' &&
        rebanyo.situacion.comarca === accion.comarca &&
        rebanyo.ruta.length === 0;
      return (
        yaAlli ||
        (rebanyo?.ruta.at(-1) ?? null) === accion.comarca ||
        vivas.some((o) => o.tipo === 'ruta' && o.rebanyo === accion.rebanyo)
      );
    }
    case 'carga-fiscal':
      return (
        estado.comarcas[accion.comarca]?.cargaFiscal === accion.carga ||
        vivas.some((o) => o.tipo === 'politica' && o.comarca === accion.comarca)
      );
  }
}
