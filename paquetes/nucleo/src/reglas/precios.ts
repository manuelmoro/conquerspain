// Formacion de precios de una plaza (docs/03-economia.md §3.10.2 y §3.10.3; fichas T-037 §4.3,
// T-052 §4.1 y T-057 §4.1).
//
// El precio de una plaza se mueve por el desequilibrio entre lo que se quiere comprar y lo que se
// quiere vender, vuelve poco a poco al precio base y nunca se sale de la horquilla que la protege.
import { ErrorDeMotor } from '../errores.ts';
import type { ComarcaMundo, Potencial, VolumenFeria } from '../tipos/mundo.ts';
import type { Recurso } from '../tipos/recursos.ts';
import type { DatosMercado, DatosRecurso } from '../tipos/reglas.ts';
import { MIL, limitar, multiplicarFactores, porcentaje } from '../utiles/enteros.ts';

/**
 * El precio base de un recurso **en una comarca** (ficha T-052 §4.1): lo que sobra alli vale menos
 * y lo que no hay cuesta mas traerlo.
 *
 * Se indexa con el potencial **del mundo**, no con el agotamiento de la comarca: el precio base no
 * puede oscilar turno a turno con la explotacion, igual que la administracion se mide siempre en
 * verano. Es una funcion pura del catalogo, sin azar ni estado.
 */
export function precioBaseLocalMil(
  precioBaseMil: number,
  comarca: ComarcaMundo | undefined,
  recurso: Recurso,
  tabla: DatosMercado,
  /**
   * El factor que **alcanza** la comarca contando lo que hay en el mapa (ficha T-057). Sin el, se
   * usa el potencial de la propia comarca: es lo que vale para una plaza suelta o una cuenta de
   * tanteo.
   */
  factorAlcanzadoMil?: number,
): number {
  const potencial = tabla.potencialDeRecurso[recurso];
  // Los maravedis, y cualquier recurso sin potencial, valen lo mismo en todas partes.
  if (potencial === undefined || comarca === undefined) return precioBaseMil;
  if (factorAlcanzadoMil !== undefined)
    return Math.max(1, porcentaje(precioBaseMil, factorAlcanzadoMil));
  const nivel = comarca.potenciales[potencial];
  const factor = tabla.abundanciaMil[nivel];
  if (factor === undefined) {
    throw new ErrorDeMotor(
      'invariante-rota',
      `La tabla de mercado no dice cuanto vale el nivel de potencial ${String(nivel)}: "abundanciaMil" necesita una entrada por cada nivel de 0 a 5.`,
      { recurso, potencial, nivel },
    );
  }
  return Math.max(1, porcentaje(precioBaseMil, factor));
}

/**
 * El factor de precio que **alcanza** una comarca para un potencial (ficha T-057 §4.1): lo que vale
 * en la fuente mas barata puesta alli. Cada fuente vende a lo que dice su abundancia y cada jornada
 * de camino le suma `recargoPorJornadaMil`; manda la mas barata, sea o no la mas cercana, y nada
 * pasa del techo. Sin ninguna fuente alcanzable, el techo: lo que no hay cuesta traerlo de lejos.
 *
 * Las jornadas llegan medidas en verano y sin mejoras, como las de la administracion, para que el
 * precio base no oscile con la estacion ni con un puente nuevo. La propia comarca va en el mapa a
 * cero jornadas: si tiene el potencial, es su propia fuente.
 */
export function factorAlcanzadoMil(
  potencial: Potencial,
  jornadasMil: ReadonlyMap<string, number>,
  comarcas: Readonly<Record<string, ComarcaMundo>>,
  tabla: DatosMercado,
): number {
  let mejor = tabla.techoDeLejaniaMil;
  for (const [id, lejosMil] of jornadasMil) {
    const nivel = comarcas[id]?.potenciales[potencial] ?? 0;
    if (nivel <= 0) continue;
    const enLaFuente = tabla.abundanciaMil[nivel] ?? tabla.techoDeLejaniaMil;
    const puesto = enLaFuente + Math.floor((tabla.recargoPorJornadaMil * lejosMil) / MIL);
    if (puesto < mejor) mejor = puesto;
  }
  return mejor;
}

/** Cargas por recurso y turno que absorbe una plaza: la base por el multiplicador de su volumen. */
export function topeDeVolumen(volumen: VolumenFeria, tabla: DatosMercado): number {
  const multiplicador = tabla.multiplicadorVolumen[volumen];
  if (multiplicador === undefined) {
    throw new ErrorDeMotor(
      'invariante-rota',
      `La tabla de mercado no dice cuanto multiplica un volumen "${volumen}": anyadelo a "multiplicadorVolumen".`,
      { volumen },
    );
  }
  return tabla.volumenBase * multiplicador;
}

/** De −1000 (todo oferta) a 1000 (todo demanda); con nada que casar, 0. */
export function desequilibrioMil(demanda: number, oferta: number): number {
  return Math.floor((MIL * (demanda - oferta)) / Math.max(1, demanda + oferta));
}

/** Suelo y techo absolutos de un recurso: para que nadie arruine una plaza para siempre. */
export function limitesDePrecio(
  precioBaseMil: number,
  tabla: DatosMercado,
): { readonly sueloMil: number; readonly techoMil: number } {
  return {
    sueloMil: Math.max(1, porcentaje(precioBaseMil, tabla.sueloMil)),
    techoMil: porcentaje(precioBaseMil, tabla.techoMil),
  };
}

/**
 * Precio de la plaza tras un turno con ese desequilibrio.
 *
 * Primero el impulso (elasticidad × desequilibrio, recortado al movimiento maximo), despues la
 * regresion al base —un 10 % de la distancia, y al menos una milesima para que llegue— y por
 * ultimo dos recortes: nunca mas del movimiento maximo respecto al precio de partida, y siempre
 * dentro del suelo y el techo.
 */
export function nuevoPrecioMil(
  precioMil: number,
  desMil: number,
  recurso: DatosRecurso,
  tabla: DatosMercado,
): number {
  const maximo = porcentaje(precioMil, tabla.movimientoMaximoPorTurnoMil);
  // Se calcula sobre el valor absoluto para que subir y bajar redondeen igual.
  const impulsoMil = multiplicarFactores(recurso.elasticidadMil, [Math.abs(desMil)]);
  const empuje = Math.min(maximo, porcentaje(precioMil, impulsoMil));
  let nuevo = precioMil + Math.sign(desMil) * empuje;

  const distancia = recurso.precioBaseMil - nuevo;
  if (distancia !== 0) {
    const paso = Math.min(
      Math.abs(distancia),
      Math.max(1, porcentaje(Math.abs(distancia), tabla.regresionAlBaseMil)),
    );
    nuevo += Math.sign(distancia) * paso;
  }

  nuevo = limitar(nuevo, precioMil - maximo, precioMil + maximo);
  const { sueloMil, techoMil } = limitesDePrecio(recurso.precioBaseMil, tabla);
  return limitar(nuevo, sueloMil, techoMil);
}
