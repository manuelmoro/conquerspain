// Aritmetica del motor: todo son enteros y las fracciones viajan en milesimas.
// Es la pieza que hace que dos maquinas resuelvan el mismo turno con el mismo resultado.

/** Una magnitud fraccionaria expresada en milesimas: 1250 son 1,250 (o un 125 %). */
export type Milesimas = number;

/** Una unidad entera, en milesimas. */
export const MIL = 1000;

const MIL_GRANDE = 1000n;

function exigirEntero(valor: number, nombre: string): void {
  if (!Number.isSafeInteger(valor)) {
    throw new Error(
      `El valor de "${nombre}" debe ser un entero seguro y es ${String(valor)}. ` +
        'Las fracciones se expresan en milesimas (CLAUDE.md §4).',
    );
  }
}

/** Division entera que redondea siempre hacia abajo, tambien con negativos. */
function dividirHaciaAbajo(dividendo: bigint, divisor: bigint): bigint {
  const cociente = dividendo / divisor;
  const hayResto = dividendo % divisor !== 0n;
  const signosDistintos = dividendo < 0n !== divisor < 0n;
  return hayResto && signosDistintos ? cociente - 1n : cociente;
}

function aNumeroSeguro(valor: bigint, contexto: string): number {
  const numero = Number(valor);
  if (!Number.isSafeInteger(numero)) {
    throw new Error(
      `El calculo de "${contexto}" se sale del rango de enteros seguros: ${valor.toString()}.`,
    );
  }
  return numero;
}

/** Convierte una cantidad entera a milesimas: 3 → 3000. */
export function aMilesimas(entero: number): Milesimas {
  exigirEntero(entero, 'entero');
  return aNumeroSeguro(BigInt(entero) * MIL_GRANDE, 'aMilesimas');
}

/** Convierte milesimas a unidades enteras, truncando hacia abajo: 3999 → 3. */
export function aEntero(milesimas: Milesimas): number {
  exigirEntero(milesimas, 'milesimas');
  return aNumeroSeguro(dividirHaciaAbajo(BigInt(milesimas), MIL_GRANDE), 'aEntero');
}

/**
 * Aplica una cadena de factores expresados en milesimas sin perder precision intermedia:
 * acumula en milesimas y trunca una sola vez, al final.
 * Es la unica forma permitida de encadenar multiplicadores en el motor.
 */
export function multiplicarFactores(base: number, factoresMil: readonly Milesimas[]): number {
  exigirEntero(base, 'base');
  let acumulado = BigInt(base);
  let divisor = 1n;
  for (const factorMil of factoresMil) {
    exigirEntero(factorMil, 'factorMil');
    acumulado *= BigInt(factorMil);
    divisor *= MIL_GRANDE;
  }
  return aNumeroSeguro(dividirHaciaAbajo(acumulado, divisor), 'multiplicarFactores');
}

/** Aplica un porcentaje expresado en milesimas: porcentaje(100, 1250) = 125. */
export function porcentaje(valor: number, porcentajeMil: Milesimas): number {
  return multiplicarFactores(valor, [porcentajeMil]);
}

/** Deja el valor dentro de un intervalo cerrado. */
export function limitar(valor: number, minimo: number, maximo: number): number {
  exigirEntero(valor, 'valor');
  exigirEntero(minimo, 'minimo');
  exigirEntero(maximo, 'maximo');
  if (minimo > maximo) {
    throw new Error(`El intervalo [${String(minimo)}, ${String(maximo)}] esta del reves.`);
  }
  if (valor < minimo) return minimo;
  if (valor > maximo) return maximo;
  return valor;
}

/** Lo que pide alguien en un reparto: un identificador y una cantidad entera no negativa. */
export interface Peticion {
  readonly id: string;
  readonly cantidad: number;
}

/**
 * Reparte lo disponible en proporcion a lo pedido.
 *
 * Trunca hacia abajo y entrega el resto a quien tenga mayor parte fraccionaria; los empates se
 * deshacen por orden de identificador, nunca por el orden en que llegaron las peticiones.
 * Se cumple siempre: suma(resultado) === min(disponible, suma(peticiones)).
 */
export function repartoProporcional(
  disponible: number,
  peticiones: readonly Peticion[],
): Map<string, number> {
  exigirEntero(disponible, 'disponible');
  if (disponible < 0) {
    throw new Error(`No se puede repartir una cantidad negativa: ${String(disponible)}.`);
  }

  const ordenadas = [...peticiones].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const reparto = new Map<string, number>();
  let total = 0n;
  for (const peticion of ordenadas) {
    exigirEntero(peticion.cantidad, `cantidad de "${peticion.id}"`);
    if (peticion.cantidad < 0) {
      throw new Error(`La peticion de "${peticion.id}" es negativa: ${String(peticion.cantidad)}.`);
    }
    if (reparto.has(peticion.id)) {
      throw new Error(`Hay dos peticiones con el identificador "${peticion.id}".`);
    }
    reparto.set(peticion.id, 0);
    total += BigInt(peticion.cantidad);
  }

  if (total === 0n || disponible === 0) return reparto;

  const disponibleGrande = BigInt(disponible);
  if (disponibleGrande >= total) {
    for (const peticion of ordenadas) reparto.set(peticion.id, peticion.cantidad);
    return reparto;
  }

  const restos: { id: string; resto: bigint }[] = [];
  let entregado = 0n;
  for (const peticion of ordenadas) {
    const producto = disponibleGrande * BigInt(peticion.cantidad);
    const parte = producto / total;
    reparto.set(peticion.id, aNumeroSeguro(parte, 'repartoProporcional'));
    entregado += parte;
    restos.push({ id: peticion.id, resto: producto % total });
  }

  // El sobrante va a quien mas parte fraccionaria le quedo; a igualdad, al identificador menor.
  restos.sort((a, b) => {
    if (a.resto !== b.resto) return a.resto > b.resto ? -1 : 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
  let sobrante = disponibleGrande - entregado;
  for (const { id } of restos) {
    if (sobrante <= 0n) break;
    reparto.set(id, (reparto.get(id) ?? 0) + 1);
    sobrante -= 1n;
  }
  return reparto;
}
