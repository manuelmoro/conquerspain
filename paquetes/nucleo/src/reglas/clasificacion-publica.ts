// La clasificacion publica (ficha T-085 §4.1): por que va primero cada uno. El prestigio y su
// desglose por capitulos son publicos (docs/06 §6.3.1), y las primicias las anuncia la cronica a
// todos; los hitos con su fecha, solo los propios.
import type { Casa, Hito, TablasDeReglas } from '../tipos/reglas.ts';
import { HITOS } from '../tipos/reglas.ts';
import type { EstadoPartida } from '../tipos/estado.ts';
import type { IdJugador } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import { comparar } from '../utiles/orden.ts';
import { calendarioDe } from './calendario.ts';
import type { CapituloDePrestigio } from './prestigio.ts';
import { prestigioDe, primiciasDe } from './prestigio.ts';

export interface FilaDeClasificacion {
  readonly jugador: IdJugador;
  readonly nombre: string;
  readonly casa: Casa;
  readonly puesto: number;
  readonly puestoAnterior: number | null;
  readonly prestigio: number;
  readonly capitulos: Readonly<Record<CapituloDePrestigio, number>>;
  readonly penalizaciones: number;
  readonly primicias: readonly Hito[];
}

export interface HitoLogrado {
  readonly hito: Hito;
  readonly nombre: string;
  readonly prestigio: number;
  readonly turno: number;
  readonly fecha: string;
  readonly primicia: boolean;
}

export interface HitoPorLograr {
  readonly hito: Hito;
  readonly nombre: string;
  readonly condicion: string;
  readonly prestigio: number;
}

export interface ClasificacionPublica {
  readonly turno: number;
  readonly filas: readonly FilaDeClasificacion[];
  readonly misHitos: readonly HitoLogrado[];
  readonly porLograr: readonly HitoPorLograr[];
}

export function clasificacionPublica(
  estado: EstadoPartida,
  yo: IdJugador,
  mundo: Mundo,
  reglas: TablasDeReglas,
): ClasificacionPublica {
  const puestos = new Map(estado.clasificacion.map((p) => [p.jugador, p]));
  const filas = Object.values(estado.jugadores)
    .map((j): FilaDeClasificacion => {
      const p = prestigioDe(estado, j, reglas);
      const puesto = puestos.get(j.id);
      return {
        jugador: j.id,
        nombre: j.nombre,
        casa: j.casa,
        puesto: puesto?.puesto ?? 0,
        puestoAnterior: puesto?.puestoAnterior ?? null,
        prestigio: j.prestigio,
        capitulos: p.capitulos,
        penalizaciones: p.penalizaciones,
        primicias: primiciasDe(estado, j),
      };
    })
    .sort((a, b) => a.puesto - b.puesto || comparar(a.jugador, b.jugador));

  const jugador = estado.jugadores[yo];
  const primicias = jugador === undefined ? [] : primiciasDe(estado, jugador);
  const misHitos = HITOS.flatMap((hito): HitoLogrado[] => {
    const turno = jugador?.hitos[hito];
    if (turno === undefined) return [];
    const datos = reglas.hitos[hito];
    return [
      {
        hito,
        nombre: datos.nombre,
        prestigio: datos.prestigio,
        turno,
        fecha: calendarioDe(turno, mundo, reglas).nombre,
        primicia: primicias.includes(hito),
      },
    ];
  }).sort((a, b) => a.turno - b.turno || comparar(a.hito, b.hito));
  const porLograr = HITOS.filter(
    (hito) => jugador?.hitos[hito] === undefined && !reglas.hitos[hito].desactivado,
  ).map((hito) => ({
    hito,
    nombre: reglas.hitos[hito].nombre,
    condicion: reglas.hitos[hito].condicion,
    prestigio: reglas.hitos[hito].prestigio,
  }));
  return { turno: estado.turno, filas, misHitos, porLograr };
}
