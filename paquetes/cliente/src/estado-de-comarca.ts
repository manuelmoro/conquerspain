// El estado de una comarca propia en palabras (T-090, tras jugar): cada dato con su icono y una frase
// de lo que implica. «Granja 3/4» o «caben 60» no se entendian; ahora se dice que significan.
import type { Fuero, TipoEdificio } from '@conquer/nucleo';

export interface DatoDeComarca {
  readonly icono: string;
  readonly titulo: string;
  readonly valor: string;
  /** Lo que implica, en una frase. */
  readonly nota: string;
  /** Pide atencion: no crece, solares llenos, poca lealtad. */
  readonly alerta: boolean;
}

export const ICONO_DE_EDIFICIO: Readonly<Record<TipoEdificio, string>> = {
  granja: '🌾',
  huerta: '🥬',
  molino: '⚙️',
  granero: '🏚️',
  aserradero: '🪚',
  carbonera: '🔥',
  cantera: '🪨',
  ferreria: '⚒️',
  salina: '🧂',
  majada: '🐑',
  lonja: '🐟',
  mercado: '⚖️',
  venta: '🛖',
  casas: '🏠',
  cerca: '🧱',
  acequia: '💧',
};

export function datoDeVecinos(
  poblacion: number,
  capacidad: number,
  porCasas: number,
): DatoDeComarca {
  const lleno = poblacion >= capacidad;
  return {
    icono: '👥',
    titulo: 'Vecinos',
    valor: String(poblacion),
    nota: lleno
      ? `Caben ${String(capacidad)}: ya no crece. Cada nivel de casas da sitio a ${String(porCasas)} más.`
      : `Caben ${String(capacidad)}: puede crecer ${String(capacidad - poblacion)} más.`,
    alerta: lleno,
  };
}

export function datoDeLealtad(lealtad: number): DatoDeComarca {
  const nota =
    lealtad >= 80
      ? 'Muy leal.'
      : lealtad >= 60
        ? 'Leal.'
        : lealtad >= 40
          ? 'Inquieta: sube con fuero, carga ligera, mercado u obras.'
          : lealtad >= 20
            ? 'Descontenta: produce un 25 % menos.'
            : 'A punto de irse: si sigue así, vuelve a ser neutral.';
  return {
    icono: '❤️',
    titulo: 'Lealtad',
    valor: `${String(lealtad)} de 100`,
    nota,
    alerta: lealtad < 40,
  };
}

export function datoDeSolares(usados: number, total: number): DatoDeComarca {
  const libres = Math.max(0, total - usados);
  return {
    icono: '🏗️',
    titulo: 'Solares',
    valor: `${String(usados)} de ${String(total)} ocupados`,
    nota:
      libres === 0
        ? 'Llenos: para un edificio nuevo hay que derribar otro. Ampliar uno que ya tienes no gasta solar.'
        : `Quedan ${String(libres)} para edificios nuevos.`,
    alerta: libres === 0,
  };
}

const FUERO: Readonly<Record<Fuero, string>> = {
  ninguno: 'Sin fuero: paga administración e impuestos enteros.',
  'carta puebla': 'Carta puebla: menos administración y más crecimiento y lealtad.',
  fuero: 'Fuero: la mitad de administración, más lealtad y una cuadrilla más.',
};

export function datoDeFuero(fuero: Fuero): DatoDeComarca {
  return {
    icono: '📜',
    titulo: 'Fuero',
    valor: fuero === 'ninguno' ? 'ninguno' : fuero,
    nota: FUERO[fuero],
    alerta: false,
  };
}

/** «●●●○»: el nivel de un edificio frente a su maximo. */
export function nivelEnPuntos(nivel: number, maximo: number): string {
  return '●'.repeat(Math.min(nivel, maximo)) + '○'.repeat(Math.max(0, maximo - nivel));
}

/** «Nivel 3 de 4: se puede ampliar una vez más» / «Nivel 2 de 2: al máximo». */
export function notaDeNivel(nivel: number, maximo: number): string {
  const faltan = maximo - nivel;
  if (faltan <= 0) return `Nivel ${String(nivel)} de ${String(maximo)}: al máximo`;
  return `Nivel ${String(nivel)} de ${String(maximo)}: se puede ampliar ${faltan === 1 ? 'una vez' : `${String(faltan)} veces`} más`;
}
