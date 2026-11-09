// Misiones desde la ficha de una comarca (ficha T-083 §4.2): mandar una recua a estar presente o a
// explorar, con una sola confirmacion. Compone las intenciones que daria el jugador a mano —cargar el
// bastimento, ir, el cometido y la vuelta— con la misma prevision de viajes que el motor y los
// robots, asi que la llegada que se promete es la que sera.
import type { IdComarca, IdRecua } from '../tipos/ids.ts';
import type { Recua } from '../tipos/estado.ts';
import type { Recurso } from '../tipos/recursos.ts';
import { Tablero } from './tablero.ts';
import type { ResultadoDeViaje, ViajeImposible } from './viaje.ts';
import { panDePresencia, provisionPara } from './viaje.ts';

export type Mision = 'presencia' | 'explorar';

export interface PlanDeMision {
  readonly recua: IdRecua;
  readonly nombreDeRecua: string;
  /** Donde esta la recua y adonde vuelve. */
  readonly desde: IdComarca;
  readonly vuelta: IdComarca;
  /** Lo que se manda a la API, en este orden (sin `idCliente`). */
  readonly intenciones: readonly Readonly<Record<string, unknown>>[];
  /** Turno, contando desde 1 (el que se juega), en que llega al destino. */
  readonly llegada: number;
  /** Lo que se saca del almacen para el viaje. */
  readonly pan: number;
  readonly sal: number;
  /** Presencia: los turnos que se queda antes de volver sola. */
  readonly turnosPresente: number | null;
}

export type ImposibleDeMision = ViajeImposible | 'sin-recua-libre';

const PARADA_VACIA = { cargar: {}, descargar: {}, vender: {}, comprar: {} };

function parada(comarca: IdComarca): Readonly<Record<string, unknown>> {
  return { comarca, ...PARADA_VACIA };
}

/** Las recuas quietas en casa y sin nada pendiente, la que antes llegaria al destino primero. */
function candidatas(t: Tablero, destino: IdComarca): Recua[] {
  const libres = t.recuas.filter((r) => t.libre(r) && t.esPropia(Tablero.donde(r)));
  const jornadas = (r: Recua): number =>
    t.jornadasDesde(Tablero.donde(r)).get(destino) ?? Number.POSITIVE_INFINITY;
  // `t.recuas` ya va de la mas antigua a la mas nueva y el orden es estable: desempata la antigua.
  return [...libres].sort((a, b) => jornadas(a) - jornadas(b));
}

/** Todo lo que lleva la recua salvo el pan y la sal: se queda en casa al salir. */
function loDemas(recua: Recua): Partial<Record<Recurso, number>> {
  const fuera: Partial<Record<Recurso, number>> = {};
  for (const [recurso, cantidad] of Object.entries(recua.carga) as [Recurso, number][]) {
    if (cantidad > 0 && recurso !== 'pan' && recurso !== 'sal') fuera[recurso] = cantidad;
  }
  return fuera;
}

function intencionDeCarga(
  recua: Recua,
  pan: number,
  sal: number,
): Readonly<Record<string, unknown>> {
  const cargar: Partial<Record<Recurso, number>> = {};
  if (pan > 0) cargar.pan = pan;
  if (sal > 0) cargar.sal = sal;
  return { tipo: 'carga', recua: recua.id, cargar, descargar: loDemas(recua), vecinosCargados: 0 };
}

function ruta(
  recua: Recua,
  destino: IdComarca,
  expedicion: boolean,
  turnoProgramado: number | null = null,
): Readonly<Record<string, unknown>> {
  return {
    tipo: 'ruta',
    recua: recua.id,
    rebanyo: null,
    paradas: [parada(destino)],
    circular: false,
    expedicion,
    ...(turnoProgramado === null ? {} : { turnoProgramado }),
  };
}

/**
 * El plan de una mision a `destino`. Explorar: carga el bastimento de ida y vuelta, va como
 * expedicion, explora y vuelve a la comarca propia mas cercana. Presencia: carga todo el pan que
 * quepa, se queda mientras le dure sin tocar el de la vuelta, y vuelve sola (plan de temporada).
 */
export function planDeMision(
  t: Tablero,
  destino: IdComarca,
  mision: Mision,
): ResultadoDeViaje<PlanDeMision> | { readonly ok: false; readonly motivo: 'sin-recua-libre' } {
  const recuas = candidatas(t, destino);
  const recua = recuas[0];
  if (recua === undefined) return { ok: false, motivo: 'sin-recua-libre' };
  const vuelta = t.casaMasCercana(destino);
  // Quien explora va de expedicion y vive en parte de la tierra: come lo que comera en el motor.
  const viajera = mision === 'explorar' ? { ...recua, enExpedicion: true } : recua;
  const provision = provisionPara(t, viajera, [
    { comarca: destino, detiene: true },
    { comarca: vuelta, detiene: true },
  ]);
  if (!provision.ok) return provision;
  const { prevision } = provision.valor;
  const llegada = prevision.llegadas[0] ?? 1;
  const base = {
    recua: recua.id,
    nombreDeRecua: recua.nombre,
    desde: Tablero.donde(recua),
    vuelta,
    llegada,
  };

  if (mision === 'explorar') {
    const { pan, sal } = provision.valor;
    return {
      ok: true,
      valor: {
        ...base,
        intenciones: [
          intencionDeCarga(recua, pan - recua.carga.pan, sal - recua.carga.sal),
          ruta(recua, destino, true),
          { tipo: 'cometido', recua: recua.id, cometido: 'explorar' },
          ruta(recua, vuelta, true),
        ],
        pan: Math.max(0, pan - recua.carga.pan),
        sal: Math.max(0, sal - recua.carga.sal),
        turnosPresente: null,
      },
    };
  }

  // Presencia: todo el pan que quepa; lo que no se coma en el camino lo come estando presente.
  const sal = provision.valor.sal;
  const pan = Math.min(recua.porte - sal, t.disponible('pan') + recua.carga.pan);
  const unTurno = panDePresencia(t, 1).pan;
  const paraLaVuelta = provision.valor.pan;
  const sobra = pan - paraLaVuelta;
  if (unTurno > 0 && sobra < unTurno) return { ok: false, motivo: 'sin-pan' };
  const aguanta = unTurno <= 0 ? t.reglas.mayordomo.turnosDePlan : Math.floor(sobra / unTurno);
  // La vuelta va en el plan de temporada, que no mira mas alla de `turnosDePlan`.
  const cuando = Math.min(t.turno + llegada + aguanta, t.turno + t.reglas.mayordomo.turnosDePlan);
  const turnosPresente = Math.max(1, cuando - t.turno - llegada);
  return {
    ok: true,
    valor: {
      ...base,
      intenciones: [
        intencionDeCarga(recua, pan - recua.carga.pan, sal - recua.carga.sal),
        ruta(recua, destino, false),
        { tipo: 'cometido', recua: recua.id, cometido: 'presencia' },
        ruta(recua, vuelta, false, t.turno + llegada + turnosPresente),
      ],
      pan: Math.max(0, pan - recua.carga.pan),
      sal: Math.max(0, sal - recua.carga.sal),
      turnosPresente,
    },
  };
}
