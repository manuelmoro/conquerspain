// La cadena de produccion de una explotacion (docs/03-economia.md §3.4 y ficha T-031 §4.1).
//
// Cada factor se calcula aparte y viaja con su nombre, porque la interfaz tiene que poder
// desplegar la cuenta entera: «20 = 12 base × 125 % × 160 % × …». El truncado ocurre una sola vez.
import type { ClimaAnual } from './calendario.ts';
import type { Acontecimiento, CargaFiscal, EstadoComarca, Fuero } from '../tipos/estado.ts';
import type { NivelPotencial, Terreno } from '../tipos/mundo.ts';
import type { Recurso } from '../tipos/recursos.ts';
import type { Estacion, Modificadores, TablasDeReglas, TipoEdificio } from '../tipos/reglas.ts';
import { TIPOS_DE_EDIFICIO } from '../tipos/reglas.ts';
import { RECURSOS_AGOTABLES } from '../tipos/estado.ts';
import type { RecursoAgotable } from '../tipos/estado.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { MIL, limitar, multiplicarFactores } from '../utiles/enteros.ts';
import { factorDeAcontecimientos } from './acontecimientos.ts';
import { factorDeEstiercolMil } from './esquileo.ts';

/** Un factor de la cadena, con nombre para poder explicarlo. */
export interface Factor {
  readonly nombre:
    | 'potencial'
    | 'estacion'
    | 'clima'
    | 'acontecimiento'
    | 'estiercol'
    | 'molino'
    | 'aperos'
    | 'lealtad'
    | 'agotamiento'
    | 'dehesa'
    | 'mano-de-obra'
    | 'acequia'
    | 'casa';
  readonly mil: Milesimas;
}

export interface Explotacion {
  readonly edificio: TipoEdificio;
  readonly nivel: number;
  readonly recurso: Recurso;
  readonly base: number;
  readonly factores: readonly Factor[];
  readonly resultado: number;
}

export interface DatosDeComarcaParaProducir {
  readonly comarca: EstadoComarca;
  readonly region: string;
  readonly estacion: Estacion;
  readonly clima: ClimaAnual;
  /** Modificador de produccion de la casa del duenyo, por recurso (enganche para T-041). */
  readonly casaMil: Readonly<Partial<Record<Recurso, number>>>;
  /** Niveles que trabajan este turno si no son todos los construidos (insumos, T-032). */
  readonly nivelesActivos?: Readonly<Partial<Record<TipoEdificio, number>>>;
  /** Acontecimientos anunciados, el turno en que se produce y el terreno de la comarca (T-039). */
  readonly acontecimientos?: readonly Acontecimiento[];
  readonly turno?: number;
  readonly terreno?: Terreno | undefined;
  /** Lo que cambia la casa del duenyo (docs/04) y si la comarca es de vega o tiene rio (T-041). */
  readonly casa?: Modificadores | undefined;
  readonly enVega?: boolean;
}

export function multiplicadorPotencial(nivel: NivelPotencial, reglas: TablasDeReglas): Milesimas {
  return reglas.produccion.multiplicadorPotencialMil[nivel] ?? 0;
}

export function factorLealtad(lealtad: number, reglas: TablasDeReglas): Milesimas {
  for (const tramo of reglas.produccion.lealtad) {
    if (lealtad < tramo.menorQue) return tramo.factorMil;
  }
  return MIL;
}

export function factorAgotamiento(agotamiento: number, reglas: TablasDeReglas): Milesimas {
  const datos = reglas.produccion.agotamiento;
  return Math.max(datos.sueloMil, MIL - agotamiento * datos.factorPorPuntoMil);
}

export function factorAperos(aperos: number, reglas: TablasDeReglas): Milesimas {
  return MIL + aperos * reglas.produccion.aperoMil;
}

/** Vecinos que hacen falta para trabajar todas las explotaciones de la comarca. */
export function vecinosNecesarios(comarca: EstadoComarca, reglas: TablasDeReglas): number {
  let total = 0;
  for (const tipo of TIPOS_DE_EDIFICIO) {
    total += (comarca.edificios[tipo] ?? 0) * reglas.edificios[tipo].vecinosPorNivel;
  }
  return total;
}

/** Si falta gente, todo rinde proporcionalmente menos (docs/03 §3.4). */
export function factorManoDeObra(comarca: EstadoComarca, reglas: TablasDeReglas): Milesimas {
  const necesarios = vecinosNecesarios(comarca, reglas);
  if (necesarios === 0) return MIL;
  return Math.min(MIL, Math.floor((comarca.poblacion * MIL) / necesarios));
}

/** Factor del clima anunciado para esta region y estacion; 1000 si no le toca nada. */
export function factorClima(region: string, estacion: Estacion, clima: ClimaAnual): Milesimas {
  let factor = MIL;
  for (const modificador of clima.modificadores) {
    if (modificador.estacion !== estacion || !modificador.regiones.includes(region)) continue;
    factor = Math.floor((factor * modificador.factorPanMil) / MIL);
  }
  return factor;
}

/** Produccion de cada explotacion de la comarca, con su desglose. */
export function explotacionesDe(
  datos: DatosDeComarcaParaProducir,
  reglas: TablasDeReglas,
): Explotacion[] {
  const { comarca } = datos;
  const produccion = reglas.produccion;
  const comunes: Factor[] = [
    { nombre: 'aperos', mil: factorAperos(comarca.aperos, reglas) },
    { nombre: 'lealtad', mil: factorLealtad(comarca.lealtad, reglas) },
    { nombre: 'mano-de-obra', mil: factorManoDeObra(comarca, reglas) },
  ];
  const resultado: Explotacion[] = [];
  for (const tipo of TIPOS_DE_EDIFICIO) {
    const nivel = Math.min(
      comarca.edificios[tipo] ?? 0,
      datos.nivelesActivos?.[tipo] ?? Number.POSITIVE_INFINITY,
    );
    if (nivel <= 0) continue;
    const edificio = reglas.edificios[tipo];
    for (const recurso of Object.keys(edificio.produccion).sort() as Recurso[]) {
      const porNivel = edificio.produccion[recurso] ?? 0;
      if (porNivel <= 0) continue;
      const base = porNivel * nivel;
      const factores: Factor[] = [];
      if (edificio.potencial !== null) {
        factores.push({
          nombre: 'potencial',
          mil: multiplicadorPotencial(comarca.potenciales[edificio.potencial], reglas),
        });
      }
      // La acequia mayor riega la labor: rinde mas y no depende de la estacion (docs/03 §3.11).
      const regada =
        edificio.potencial === 'labor' && comarca.obrasMayores.includes('acequia-mayor');
      if (regada) factores.push({ nombre: 'acequia', mil: reglas.obras.laborPorAcequiaMil });
      // La acequia menor riega sin dar mas: solo le quita al pan el factor de la estacion.
      const sinEstacion = regada || (comarca.edificios['acequia'] ?? 0) > 0;
      // Un acontecimiento activo en la region (sequia, buenas lluvias) o sobre la labor de un terreno
      // (la riada en las vegas) entra como un factor mas, para que se vea en el desglose.
      const lugar = { region: datos.region, comarca: comarca.id, terreno: datos.terreno ?? null };
      const deLaRegion = (que: 'pan' | 'labor'): Milesimas =>
        factorDeAcontecimientos(datos.acontecimientos ?? [], datos.turno ?? 0, que, lugar);
      const acontecimientoMil = multiplicarFactores(MIL, [
        recurso === 'pan' && produccion.edificiosEstacionales.includes(tipo)
          ? deLaRegion('pan')
          : MIL,
        recurso === 'pan' && edificio.potencial === 'labor' ? deLaRegion('labor') : MIL,
      ]);
      if (acontecimientoMil !== MIL) {
        factores.push({ nombre: 'acontecimiento', mil: acontecimientoMil });
      }
      // El estiercol de los rebanyos que invernan en la comarca abona su labor.
      if (recurso === 'pan' && edificio.potencial === 'labor' && comarca.estiercol > 0) {
        factores.push({
          nombre: 'estiercol',
          mil: factorDeEstiercolMil(comarca.estiercol, reglas),
        });
      }
      if (recurso === 'pan' && produccion.edificiosEstacionales.includes(tipo)) {
        if (!sinEstacion) {
          factores.push({
            nombre: 'estacion',
            mil: reglas.estaciones.factorPanMil[datos.estacion],
          });
        }
        factores.push({
          nombre: 'clima',
          mil: factorClima(datos.region, datos.estacion, datos.clima),
        });
      }
      if (tipo === 'granja' && (comarca.edificios['molino'] ?? 0) > 0) {
        factores.push({
          nombre: 'molino',
          mil: MIL + (comarca.edificios['molino'] ?? 0) * produccion.molinoMil,
        });
      }
      factores.push(...comunes);
      const agotable = edificio.potencial as RecursoAgotable | null;
      if (agotable !== null && RECURSOS_AGOTABLES.includes(agotable)) {
        factores.push({
          nombre: 'agotamiento',
          mil: factorAgotamiento(comarca.agotamiento[agotable], reglas),
        });
      }
      if (agotable === 'monte' && comarca.dehesa) {
        factores.push({ nombre: 'dehesa', mil: produccion.dehesa.maderaMil });
      }
      // Lo de la casa: su modificador por recurso, el de este edificio y, para la labor, si la
      // comarca tiene vega o rio (los hortelanos rinden mas en ella y menos fuera).
      const enVega = datos.enVega ?? false;
      const casaMil = multiplicarFactores(MIL, [
        datos.casaMil[recurso] ?? MIL,
        datos.casa?.produccionEdificioMil[tipo] ?? MIL,
        enVega ? (datos.casa?.produccionEdificioEnVegaMil[tipo] ?? MIL) : MIL,
        recurso === 'pan' && edificio.potencial === 'labor' && !enVega
          ? (datos.casa?.laborFueraDeVegaMil ?? MIL)
          : MIL,
      ]);
      if (casaMil !== MIL) factores.push({ nombre: 'casa', mil: casaMil });
      resultado.push({
        edificio: tipo,
        nivel,
        recurso,
        base,
        factores,
        resultado: multiplicarFactores(
          base,
          factores.map((factor) => factor.mil),
        ),
      });
    }
  }
  return resultado;
}

export interface IngresoDeMaravedis {
  readonly mercado: number;
  readonly impuestos: number;
  readonly total: number;
}

/**
 * Maravedis de la comarca: mercado e impuestos (ficha T-031 §4.3). El fuero rebaja lo que rinden
 * los impuestos (docs/03 §3.9); la actividad comercial la pondra el mercado (T-037) y el ingreso
 * por transito de las ventas, el movimiento (T-033).
 */
export function maravedisDe(
  comarca: EstadoComarca,
  fueroImpuestosMil: Readonly<Record<Fuero, number>>,
  reglas: TablasDeReglas,
  /** Lo que multiplican los acontecimientos (una romeria): 1000 si nada. */
  ingresosMil: Milesimas = MIL,
): IngresoDeMaravedis {
  const datos = reglas.produccion.maravedis;
  const mercado = multiplicarFactores((comarca.edificios['mercado'] ?? 0) * datos.porNivelMercado, [
    ingresosMil,
  ]);
  const carga: CargaFiscal = comarca.cargaFiscal;
  const brutos = Math.floor(comarca.poblacion / datos.vecinosPorPunto) * datos.cargaFiscal[carga];
  const impuestos = multiplicarFactores(brutos, [fueroImpuestosMil[comarca.fuero], ingresosMil]);
  return { mercado, impuestos, total: mercado + impuestos };
}

/** Agotamiento del turno siguiente (ficha T-031 §4.4): primero sube, luego se regenera. */
export function siguienteAgotamiento(
  comarca: EstadoComarca,
  reglas: TablasDeReglas,
  /** Lo deprisa que se le agota el monte a la casa del duenyo: 1000 si nada. */
  agotamientoMonteMil: Milesimas = MIL,
): Record<RecursoAgotable, number> {
  const datos = reglas.produccion.agotamiento;
  const niveles: Record<RecursoAgotable, number> = { monte: 0, piedra: 0, hierro: 0, sal: 0 };
  for (const tipo of TIPOS_DE_EDIFICIO) {
    const nivel = comarca.edificios[tipo] ?? 0;
    const potencial = reglas.edificios[tipo].potencial as RecursoAgotable | null;
    if (nivel <= 0 || potencial === null || !RECURSOS_AGOTABLES.includes(potencial)) continue;
    if (Object.keys(reglas.edificios[tipo].produccion).length === 0) continue;
    niveles[potencial] += nivel;
  }
  const siguiente: Record<RecursoAgotable, number> = { monte: 0, piedra: 0, hierro: 0, sal: 0 };
  for (const recurso of RECURSOS_AGOTABLES) {
    let sube = datos.porNivel * niveles[recurso];
    if (recurso === 'monte') {
      const dehesaMil = comarca.dehesa ? reglas.produccion.dehesa.agotamientoMonteMil : MIL;
      sube = multiplicarFactores(sube, [dehesaMil, agotamientoMonteMil]);
    }
    siguiente[recurso] = limitar(
      comarca.agotamiento[recurso] + sube - datos.regeneracion[recurso],
      0,
      datos.maximo,
    );
  }
  return siguiente;
}
