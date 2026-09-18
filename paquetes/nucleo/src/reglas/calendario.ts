// El calendario del juego (docs/02-diseno-nucleo.md §2.1): turno = quincena, 24 turnos al anyo.
//
// Todo lo de aqui es funcion pura del numero de turno, del mundo, de las tablas y de la semilla:
// nada se guarda en el estado, porque lo derivado que se guarda acaba desfasado.
import type { IdFeria } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { Estacion, TablasDeReglas } from '../tipos/reglas.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { azarDe } from '../utiles/azar.ts';
import { comparar } from '../utiles/orden.ts';

export const TURNOS_POR_ANYO = 24;

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

export interface Calendario {
  readonly turno: number;
  /** 1, 2, 3… El anyo 1 son los turnos 1 a 24. */
  readonly anyo: number;
  /** Turno dentro del anyo, de 1 (primera quincena de enero) a 24. */
  readonly turnoDelAnyo: number;
  readonly mes: number;
  readonly quincena: 1 | 2;
  readonly estacion: Estacion;
  /** «segunda quincena de mayo» */
  readonly nombre: string;
  readonly esEsquileo: boolean;
  readonly feriasActivas: readonly IdFeria[];
}

/** Resumen de lo que la estacion cambia en el mapa, para que lo consulten las demas fases. */
export interface EstadoEstacional {
  readonly estacion: Estacion;
  readonly barro: boolean;
  /** Nombres de los puertos cerrados por nieve, ordenados. */
  readonly puertosCerrados: readonly string[];
  readonly pastosDeVerano: boolean;
  readonly pastosDeInvierno: boolean;
  readonly factorPanMil: Milesimas;
  readonly factorObraPiedraMil: Milesimas;
}

export const EFECTOS_DE_CLIMA = ['seco', 'lluvioso', 'duro', 'benigno'] as const;
export type EfectoDeClima = (typeof EFECTOS_DE_CLIMA)[number];

export interface ModificadorDeClima {
  /** Una o dos regiones del catalogo: el clima nunca es un castigo peninsular. */
  readonly regiones: readonly string[];
  readonly estacion: Estacion;
  readonly efecto: EfectoDeClima;
  readonly factorPanMil: Milesimas;
}

export interface ClimaAnual {
  readonly anyo: number;
  readonly modificadores: readonly ModificadorDeClima[];
}

/** Topes del clima (ficha T-030 §4.3): como mucho tres modificadores, ±30 %, dos regiones. */
export const CLIMA = {
  maximoModificadores: 3,
  maximoRegiones: 2,
  minimoMil: 700,
  maximoMil: 1300,
} as const;

function exigirTurno(turno: number): void {
  if (!Number.isSafeInteger(turno) || turno < 1) {
    throw new Error(`El turno tiene que ser un entero desde 1 y es ${String(turno)}.`);
  }
}

export function turnoDelAnyo(turno: number): number {
  exigirTurno(turno);
  return ((turno - 1) % TURNOS_POR_ANYO) + 1;
}

export function anyoDe(turno: number): number {
  exigirTurno(turno);
  return Math.floor((turno - 1) / TURNOS_POR_ANYO) + 1;
}

export function estacionDe(turno: number, reglas: TablasDeReglas): Estacion {
  const estacion = reglas.estaciones.estacionPorTurno[turnoDelAnyo(turno) - 1];
  if (estacion === undefined) {
    throw new Error(
      `Las tablas no dicen la estacion del turno ${String(turnoDelAnyo(turno))} del anyo.`,
    );
  }
  return estacion;
}

export function calendarioDe(turno: number, mundo: Mundo, reglas: TablasDeReglas): Calendario {
  const delAnyo = turnoDelAnyo(turno);
  const mes = Math.floor((delAnyo - 1) / 2) + 1;
  const quincena = delAnyo % 2 === 1 ? 1 : 2;
  const feriasActivas: IdFeria[] = [];
  for (const id of Object.keys(mundo.comarcas).sort(comparar)) {
    for (const feria of mundo.comarcas[id]?.ferias ?? []) {
      if (feria.turnos.includes(delAnyo)) feriasActivas.push(feria.id);
    }
  }
  return {
    turno,
    anyo: anyoDe(turno),
    turnoDelAnyo: delAnyo,
    mes,
    quincena,
    estacion: estacionDe(turno, reglas),
    nombre: `${quincena === 1 ? 'primera' : 'segunda'} quincena de ${MESES[mes - 1] ?? ''}`,
    esEsquileo: delAnyo === reglas.estaciones.turnoDeEsquileo,
    feriasActivas: feriasActivas.sort(comparar),
  };
}

/** Puertos que la nieve cierra en esa estacion, por nombre y sin repetir. */
export function puertosCerradosEn(estacion: Estacion, mundo: Mundo): string[] {
  if (estacion !== 'invierno') return [];
  const nombres = new Set<string>();
  for (const camino of mundo.caminos) {
    if (camino.cierraEnInvierno && camino.puertoDeMontanya !== null) {
      nombres.add(camino.puertoDeMontanya);
    }
  }
  return [...nombres].sort(comparar);
}

export function estadoEstacionalDe(
  turno: number,
  mundo: Mundo,
  reglas: TablasDeReglas,
): EstadoEstacional {
  const estacion = estacionDe(turno, reglas);
  const delAnyo = turnoDelAnyo(turno);
  const pastosDeVerano = reglas.estaciones.turnosPastoDeVerano.includes(delAnyo);
  return {
    estacion,
    barro: reglas.estaciones.turnosDeBarro.includes(delAnyo),
    puertosCerrados: puertosCerradosEn(estacion, mundo),
    pastosDeVerano,
    pastosDeInvierno: !pastosDeVerano,
    factorPanMil: reglas.estaciones.factorPanMil[estacion],
    factorObraPiedraMil: reglas.estaciones.factorObraPiedraMil[estacion],
  };
}

/** Regiones del mundo que pueden tener clima propio (el relleno y el ejemplo no cuentan). */
function regionesConClima(mundo: Mundo): string[] {
  const regiones = new Set<string>();
  for (const comarca of Object.values(mundo.comarcas)) {
    if (comarca.region.startsWith('00-') || comarca.region.startsWith('99-')) continue;
    regiones.add(comarca.region);
  }
  return [...regiones].sort(comparar);
}

/**
 * El clima de un anyo. Depende solo de la semilla y del anyo, asi que se puede anunciar un anyo
 * antes y reproducir siempre igual. Nunca hay un anyo catastrofico: como mucho tres modificadores,
 * cada uno en una o dos regiones y dentro de ±30 %.
 */
export function climaDelAnyo(semilla: string, anyo: number, mundo: Mundo): ClimaAnual {
  const regiones = regionesConClima(mundo);
  if (regiones.length === 0) return { anyo, modificadores: [] };
  const azar = azarDe(semilla, 0, 'clima', `anyo-${String(anyo)}`);
  const cuantos = azar.entreInclusive(0, CLIMA.maximoModificadores);
  const estaciones: readonly Estacion[] = ['primavera', 'verano', 'otonyo', 'invierno'];
  const modificadores: ModificadorDeClima[] = [];
  for (let i = 0; i < cuantos; i += 1) {
    const cuantasRegiones = Math.min(regiones.length, azar.entreInclusive(1, CLIMA.maximoRegiones));
    const suyas = azar.barajar(regiones).slice(0, cuantasRegiones).sort(comparar);
    const efecto = azar.elegir(EFECTOS_DE_CLIMA);
    const malo = efecto === 'seco' || efecto === 'duro';
    modificadores.push({
      regiones: suyas,
      estacion: azar.elegir(estaciones),
      efecto,
      factorPanMil: malo
        ? azar.milesimas(CLIMA.minimoMil, 950)
        : azar.milesimas(1050, CLIMA.maximoMil),
    });
  }
  return { anyo, modificadores };
}
