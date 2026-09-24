// La prevision de un viaje (ficha T-050 §4.1.3): cuantos turnos tarda, cuando llega a cada parada y
// que bastimento se come, turno a turno y con las mismas funciones con las que andara el motor.
//
// Lo unico que el robot no puede saber es lo que no sabe el jugador: unas nieves o una riada que aun
// no se han anunciado. Todo lo demas —el paso de su casa, la carga pesada, el barro, las calzadas,
// el verano que pide sal, el primer turno que come del almacen y la venta que le da de comer si
// lleva con que pagarla— sale como saldra en el turno.
import {
  avanzar,
  bastimentoDe,
  bastimentoDeLaRecuaMil,
  bastimentoDePresencia,
  costeEnLaVenta,
  pasoDeRebanyo,
  pasoDeRecua,
  pesoDeLaCarga,
  ventaDelTurno,
} from '@conquer/nucleo';
import type { IdComarca, Recua, Recurso, Recursos, SituacionMovil } from '@conquer/nucleo';

import type { Tablero } from './tablero.ts';

/** Turnos que se preven como mucho: un viaje mas largo no se plantea. */
export const TURNOS_MAXIMOS_DE_VIAJE = 24;

/** Por que un viaje no se puede hacer, dicho como lo leeria el jugador en su mapa. */
export type ViajeImposible =
  /** No hay ruta por lo conocido. */
  | 'sin-ruta'
  /** Un puerto se cierra por el camino antes de cruzarlo. */
  | 'puerto-cerrado'
  /** Tarda mas de lo que se plantea nadie. */
  | 'demasiado-largo'
  /** El pan y la sal del viaje, con la mercancia, no caben en la recua. */
  | 'no-cabe'
  /** Es verano y no hay sal en el almacen para las conservas del camino. */
  | 'sin-sal'
  /** No hay pan en el almacen para lo que se come el camino. */
  | 'sin-pan';

export interface Parada {
  readonly comarca: IdComarca;
  /** Hay algo que hacer en ella: la recua se detiene hasta el turno siguiente. */
  readonly detiene: boolean;
}

export interface Prevision {
  /** Turno, contando desde 1 (el que se juega), en que llega a cada parada. */
  readonly llegadas: readonly number[];
  readonly turnos: number;
  /** Bastimento que sale de la carga: lo que hay que llevar encima. */
  readonly pan: number;
  readonly sal: number;
  /** El que paga el almacen: los turnos que la recua empieza en una comarca propia. */
  readonly panDeCasa: number;
  readonly salDeCasa: number;
  /** Lo que se paga en las ventas del camino, a los precios sabidos (T-055). */
  readonly maravedis: number;
}

export type Resultado<T> =
  | { readonly ok: true; readonly valor: T }
  | { readonly ok: false; readonly motivo: ViajeImposible };

function fallo<T>(motivo: ViajeImposible): Resultado<T> {
  return { ok: false, motivo };
}

/** La lista de comarcas en las que se detiene, con la de llegada siempre al final. */
function paradasDelMotor(paradas: readonly Parada[]): {
  comarcas: { comarca: IdComarca; detiene: boolean }[];
  siguiente: number;
} {
  return { comarcas: paradas.map((p) => ({ ...p })), siguiente: 0 };
}

/**
 * El viaje de una recua quieta que sale este turno con esta carga. El bastimento de cada turno se
 * cobra como en la fase de movimiento: del almacen si empieza en comarca propia, de la carga si no.
 */
export function preverViaje(
  t: Tablero,
  recua: Recua,
  paradas: readonly Parada[],
  carga: Recursos,
  /** Turnos que faltan para salir: 0 si sale este turno. */
  salida = 0,
): Resultado<Prevision> {
  const desde = recua.situacion.donde === 'comarca' ? recua.situacion.comarca : null;
  if (desde === null || paradas.length === 0) return fallo('sin-ruta');
  const ruta = t.rutaDeRecua(
    desde,
    paradas.map((p) => p.comarca),
  );
  if (ruta === null) return fallo('sin-ruta');

  let situacion: SituacionMovil = recua.situacion;
  let pendiente: readonly IdComarca[] = ruta.comarcas;
  let siguiente = 0;
  const llegadas: number[] = [];
  const encima: Record<Recurso, number> = { ...carga };
  let pan = 0;
  let sal = 0;
  let panDeCasa = 0;
  let salDeCasa = 0;
  let maravedis = 0;
  const motor = paradasDelMotor(paradas);
  // Ya esta en la unica parada: no anda nada.
  if (pendiente.length === 0) {
    return {
      ok: true,
      valor: {
        llegadas: paradas.map(() => 1),
        turnos: 1,
        pan,
        sal,
        panDeCasa,
        salDeCasa,
        maravedis,
      },
    };
  }

  for (let k = 0; k < TURNOS_MAXIMOS_DE_VIAJE; k += 1) {
    const estacional = t.estacional(t.turno + salida + k);
    const donde = situacion.donde === 'comarca' ? situacion.comarca : situacion.desde;
    const proxima = pendiente[0];
    if (proxima === undefined) break;
    const paso = pasoDeRecua(
      { ...recua, carga: encima },
      {
        barro: estacional.barro,
        calzada: t.calzadaEntre(donde, proxima),
        pasoCasaMil: t.casa.pasoRecuaMil,
      },
      t.reglas,
    );
    const avance = avanzar(
      situacion,
      pendiente,
      false,
      paso,
      (a, b) => t.costeDeTramo(a, b, estacional),
      { ...motor, siguiente },
    );
    if (avance.cerrado !== null) return fallo('puerto-cerrado');
    const come = bastimentoDe(
      avance.andadoMil,
      estacional.estacion,
      t.reglas,
      bastimentoDeLaRecuaMil(recua.enExpedicion, t.casa.bastimentoMil, t.reglas),
    );
    const empieza = situacion.donde === 'comarca' ? situacion.comarca : null;
    const enCasa = empieza !== null && t.esPropia(empieza);
    const venta = enCasa ? null : ventaDelTurno((c) => t.daDeComerEn(c), empieza, avance.entradas);
    const cuenta =
      venta === null ? null : costeEnLaVenta(come, t.preciosDeLaVenta(venta), t.reglas);
    if (enCasa) {
      panDeCasa += come.pan;
      salDeCasa += come.sal;
    } else if (cuenta !== null && encima.maravedis >= cuenta) {
      maravedis += cuenta;
      encima.maravedis -= cuenta;
    } else {
      pan += come.pan;
      sal += come.sal;
      encima.pan = Math.max(0, encima.pan - come.pan);
      encima.sal = Math.max(0, encima.sal - come.sal);
    }
    if (avance.enParada !== null) llegadas[avance.enParada] = k + 1;
    situacion = avance.situacion;
    pendiente = avance.ruta;
    siguiente = avance.siguienteParada;
    if (pendiente.length === 0) {
      return {
        ok: true,
        valor: { llegadas, turnos: k + 1, pan, sal, panDeCasa, salDeCasa, maravedis },
      };
    }
  }
  return fallo('demasiado-largo');
}

/** Lo que hay que cargar para un viaje: el pan y la sal que se comeran fuera, con su prevision. */
export interface Provision {
  readonly pan: number;
  readonly sal: number;
  /** Maravedis que hay que cargar, ademas de los que ya lleva, para comer en las ventas. */
  readonly maravedis: number;
  readonly prevision: Prevision;
}

/** Pan de mas que se lleva por si el viaje se tuerce: una jornada de camino. */
export function margenDePan(t: Tablero): number {
  return t.reglas.movimiento.bastimentoPorJornada;
}

/**
 * Los precios de una venta se mueven entre que se sabe y se llega: se lleva un 25 % de mas (en
 * milesimas). Si la bolsa se queda corta, el motor da de comer de la carga, y ese pan no va.
 */
const HOLGURA_DE_VENTAS_MIL = 1250;

/**
 * El pan y la sal que tiene que llevar una recua quieta en casa para hacer este viaje con esta
 * mercancia, contando con lo que ya lleva. La carga pesa y una recua cargada anda menos, asi que
 * se recalcula hasta que la prevision no cambia. Falla si no cabe o si el verano pide sal que no hay.
 *
 * Con `bolsaParaVentas`, los maravedis que se pueden llevar de mas, la recua come en las ventas del
 * camino en vez de cargar su pan (T-055): si lo que cobrarian, con su holgura, cabe en la bolsa.
 */
export function provisionPara(
  t: Tablero,
  recua: Recua,
  paradas: readonly Parada[],
  mercancia: Partial<Recursos> = {},
  /** Turnos que faltan para salir: la compra en casa se hace hoy y la recua sale el que viene. */
  salida = 0,
  bolsaParaVentas = 0,
): Resultado<Provision> {
  if (bolsaParaVentas > 0) {
    const tanteo = provisionConMaravedis(t, recua, paradas, mercancia, salida, bolsaParaVentas);
    if (!tanteo.ok) return tanteo;
    const cobran = tanteo.valor.prevision.maravedis;
    const lleva = Math.ceil((cobran * HOLGURA_DE_VENTAS_MIL) / 1000);
    if (cobran > 0 && lleva <= bolsaParaVentas) {
      return provisionConMaravedis(t, recua, paradas, mercancia, salida, lleva);
    }
  }
  return provisionConMaravedis(t, recua, paradas, mercancia, salida, 0);
}

/** La provision con estos maravedis de mas en la carga para las ventas del camino. */
function provisionConMaravedis(
  t: Tablero,
  recua: Recua,
  paradas: readonly Parada[],
  mercancia: Partial<Recursos>,
  salida: number,
  maravedis: number,
): Resultado<Provision> {
  const base: Record<Recurso, number> = { ...recua.carga };
  for (const [recurso, cantidad] of Object.entries(mercancia) as [Recurso, number][]) {
    base[recurso] += cantidad;
  }
  base.maravedis += maravedis;
  let pan = recua.carga.pan;
  let sal = recua.carga.sal;
  let prevision: Prevision | null = null;
  for (let intento = 0; intento < 4; intento += 1) {
    const resultado = preverViaje(t, recua, paradas, { ...base, pan, sal }, salida);
    if (!resultado.ok) return resultado;
    prevision = resultado.valor;
    const quierePan = Math.max(recua.carga.pan, prevision.pan + margenDePan(t));
    const quiereSal = Math.max(recua.carga.sal, prevision.sal);
    if (quierePan === pan && quiereSal === sal) break;
    pan = quierePan;
    sal = quiereSal;
  }
  if (prevision === null) return fallo('sin-ruta');
  if (pesoDeLaCarga({ ...base, pan, sal }) > recua.porte) return fallo('no-cabe');
  // Lo que se carga y lo que se come en casa salen del mismo almacen.
  if (sal - recua.carga.sal + prevision.salDeCasa > t.disponible('sal')) return fallo('sin-sal');
  if (pan - recua.carga.pan + prevision.panDeCasa > t.disponible('pan')) return fallo('sin-pan');
  return { ok: true, valor: { pan, sal, maravedis, prevision } };
}

/**
 * Lo que le falta a una recua que ya esta fuera para seguir este viaje con lo que lleva: nada si le
 * llega. No puede cargar fuera de casa, asi que el pan y la sal que lleva son todo lo que tiene.
 */
export function leLlega(
  t: Tablero,
  recua: Recua,
  paradas: readonly Parada[],
  carga: Recursos = recua.carga,
): boolean {
  const resultado = preverViaje(t, recua, paradas, carga);
  if (!resultado.ok) return false;
  const p = resultado.valor;
  return (
    p.pan + margenDePan(t) <= carga.pan &&
    p.sal <= carga.sal &&
    p.panDeCasa <= t.disponible('pan') &&
    p.salDeCasa <= t.disponible('sal')
  );
}

/**
 * Lo que come una recua presente en una comarca neutral durante los `turnos` que vienen, cada uno
 * con su estacion: en verano, ademas del pan, la sal de las conservas.
 */
export function panDePresencia(t: Tablero, turnos: number): { pan: number; sal: number } {
  let pan = 0;
  let sal = 0;
  for (let k = 0; k < turnos; k += 1) {
    const come = bastimentoDePresencia(t.estacional(t.turno + k).estacion, t.reglas);
    pan += come.pan;
    sal += come.sal;
  }
  return { pan, sal };
}

/** Turnos que tardaria hoy un rebanyo en ir de una comarca a un pasto, o por que no puede ir. */
export function preverRebanyo(t: Tablero, desde: IdComarca, destino: IdComarca): Resultado<number> {
  const ruta = t.rutaDeRebanyo(desde, destino);
  if (ruta === null) return fallo('sin-ruta');
  let situacion: SituacionMovil = { donde: 'comarca', comarca: desde };
  let pendiente: readonly IdComarca[] = ruta.comarcas;
  if (pendiente.length === 0) return { ok: true, valor: 0 };
  for (let k = 0; k < TURNOS_MAXIMOS_DE_VIAJE; k += 1) {
    const estacional = t.estacional(t.turno + k);
    const donde = situacion.donde === 'comarca' ? situacion.comarca : situacion.desde;
    const proxima = pendiente[0];
    if (proxima === undefined) break;
    const paso = pasoDeRebanyo(t.canyadaEntre(donde, proxima), estacional.barro, t.reglas);
    const avance = avanzar(situacion, pendiente, false, paso, (a, b) =>
      t.costeDeTramo(a, b, estacional),
    );
    if (avance.cerrado !== null) return fallo('puerto-cerrado');
    situacion = avance.situacion;
    pendiente = avance.ruta;
    if (pendiente.length === 0) return { ok: true, valor: k + 1 };
  }
  return fallo('demasiado-largo');
}
