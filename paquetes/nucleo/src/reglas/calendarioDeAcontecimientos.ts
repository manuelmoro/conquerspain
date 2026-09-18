// El calendario de acontecimientos de un anyo (docs/02 §2.4.5; ficha T-039 §4.1 y §4.4).
//
// Es funcion pura de la semilla, el anyo y el mundo, como el clima: se puede publicar entero el
// primer turno del anyo y siempre sale igual. Los acontecimientos empiezan a partir del turno
// siguiente al aviso y terminan antes de que acabe el anyo, asi que ninguno cruza de anyo.
import type { Acontecimiento } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import { idDeAcontecimiento } from '../tipos/ids.ts';
import type { ComarcaMundo, Feria, Mundo } from '../tipos/mundo.ts';
import type { DatosAcontecimiento, TablasDeReglas, TipoDeAcontecimiento } from '../tipos/reglas.ts';
import { TIPOS_DE_ACONTECIMIENTO } from '../tipos/reglas.ts';
import { azarDe } from '../utiles/azar.ts';
import { comparar, idsEnOrden } from '../utiles/orden.ts';
import { TURNOS_POR_ANYO, regionesConClima } from './calendario.ts';

/** El turno absoluto de la partida que corresponde a un turno del anyo. */
export function turnoAbsoluto(anyo: number, turnoDelAnyo: number): number {
  return (anyo - 1) * TURNOS_POR_ANYO + turnoDelAnyo;
}

interface Elegido {
  readonly tipo: TipoDeAcontecimiento;
  readonly region: string;
  readonly comarca: IdComarca | null;
  readonly inicio: number;
  readonly duracion: number;
}

interface FeriaDeRegion {
  readonly comarca: ComarcaMundo;
  readonly feria: Feria;
}

/** Lo que el mundo ofrece a cada region: sus comarcas y sus ferias, siempre en orden. */
function contenidoPorRegion(mundo: Mundo, regiones: readonly string[]) {
  const comarcas = new Map<string, ComarcaMundo[]>();
  const ferias = new Map<string, FeriaDeRegion[]>();
  for (const region of regiones) {
    comarcas.set(region, []);
    ferias.set(region, []);
  }
  for (const id of idsEnOrden(mundo.comarcas)) {
    const comarca = mundo.comarcas[id];
    if (comarca === undefined || !comarcas.has(comarca.region)) continue;
    comarcas.get(comarca.region)?.push(comarca);
    for (const feria of [...comarca.ferias].sort((a, b) => comparar(a.id, b.id))) {
      ferias.get(comarca.region)?.push({ comarca, feria });
    }
  }
  return { comarcas, ferias };
}

/** El calendario de acontecimientos de un anyo, ordenado por inicio y numerado. */
export function calendarioDeAcontecimientos(
  semilla: string,
  anyo: number,
  mundo: Mundo,
  reglas: TablasDeReglas,
): Acontecimiento[] {
  const { sorteo, catalogo } = reglas.acontecimientos;
  const regiones = regionesConClima(mundo);
  if (regiones.length === 0) return [];
  const { comarcas, ferias } = contenidoPorRegion(mundo, regiones);
  const azar = azarDe(semilla, 0, 'acontecimientos', `anyo-${String(anyo)}`);

  const comarcasPara = (datos: DatosAcontecimiento, region: string): ComarcaMundo[] =>
    (comarcas.get(region) ?? []).filter(
      (comarca) =>
        datos.potencialMinimo === null ||
        comarca.potenciales[datos.potencialMinimo.potencial] >= datos.potencialMinimo.nivel,
    );
  // Una feria solo sirve si se puede anunciar dentro del mismo anyo.
  const feriasPara = (region: string): FeriaDeRegion[] =>
    (ferias.get(region) ?? []).filter(
      ({ feria }) => Math.min(...feria.turnos) > sorteo.turnosDeAviso,
    );
  const esPosible = (tipo: TipoDeAcontecimiento, region: string): boolean => {
    const datos = catalogo[tipo];
    if (datos.objetivo === 'comarca') return comarcasPara(datos, region).length > 0;
    if (datos.objetivo === 'feria') return feriasPara(region).length > 0;
    return true;
  };

  const cuantos = azar.entreInclusive(sorteo.minimoPorAnyo, sorteo.maximoPorAnyo);
  const elegidos: Elegido[] = [];
  const negativasPorRegion = new Set<string>();
  const repetidos = new Set<string>();

  for (let i = 0; i < cuantos; i += 1) {
    // El primero es siempre positivo: cada anyo lleva al menos uno.
    const candidatos = TIPOS_DE_ACONTECIMIENTO.flatMap((tipo) =>
      regiones.map((region) => ({ tipo, region })),
    ).filter(({ tipo, region }) => {
      const signo = catalogo[tipo].signo;
      if (i === 0 && signo !== 'positivo') return false;
      if (signo === 'negativo' && negativasPorRegion.has(region)) return false;
      return !repetidos.has(`${tipo}|${region}`) && esPosible(tipo, region);
    });
    if (candidatos.length === 0) break;

    const pesoTotal = candidatos.reduce((total, c) => total + catalogo[c.tipo].peso, 0);
    let tirada = azar.entero(pesoTotal);
    const elegido = candidatos.find((c) => {
      tirada -= catalogo[c.tipo].peso;
      return tirada < 0;
    });
    if (elegido === undefined) break;
    const { tipo, region } = elegido;
    const datos = catalogo[tipo];
    repetidos.add(`${tipo}|${region}`);
    if (datos.signo === 'negativo') negativasPorRegion.add(region);

    if (datos.objetivo === 'feria') {
      const { comarca, feria } = azar.elegir(feriasPara(region));
      const inicio = Math.min(...feria.turnos);
      elegidos.push({
        tipo,
        region,
        comarca: comarca.id,
        inicio,
        duracion: Math.max(...feria.turnos) - inicio + 1,
      });
      continue;
    }

    const comarca = datos.objetivo === 'comarca' ? azar.elegir(comarcasPara(datos, region)) : null;
    const ventana = datos.inicio ?? {
      desde: sorteo.turnosDeAviso + 1,
      hasta: sorteo.turnosDeAviso + 1,
    };
    const inicio = azar.entreInclusive(ventana.desde, ventana.hasta);
    const duracion =
      datos.duracion.tipo === 'fija'
        ? datos.duracion.turnos
        : reglas.estaciones.turnoDeEsquileo - inicio + 1;
    elegidos.push({ tipo, region, comarca: comarca?.id ?? null, inicio, duracion });
  }

  return elegidos
    .sort((a, b) => a.inicio - b.inicio || comparar(a.tipo, b.tipo) || comparar(a.region, b.region))
    .map((e, indice): Acontecimiento => {
      const turnoInicio = turnoAbsoluto(anyo, e.inicio);
      return {
        id: idDeAcontecimiento(anyo, indice + 1),
        tipo: e.tipo,
        region: e.region,
        comarca: e.comarca,
        turnoAnuncio: turnoInicio - sorteo.turnosDeAviso,
        turnoInicio,
        turnosDuracion: e.duracion,
        efectos: catalogo[e.tipo].efectos,
      };
    });
}
