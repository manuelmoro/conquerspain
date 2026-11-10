// Las órdenes en palabras (ficha T-093): cada una en una frase con su icono, repartidas en tres
// grupos —para este turno, esperando y en marcha— y, si espera, por qué y qué hacer. Puro.
import { ESTADOS_ANULABLES, MOTIVOS, RECURSOS, TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type { Orden, Recurso } from '@conquer/nucleo';

import { enMaravedis } from './mercado.ts';
import { NOMBRE_DE_COMETIDO, NOMBRE_DE_ORDEN, NOMBRE_DE_RECURSO } from './nombres.ts';

export interface Nombres {
  readonly comarca: (id: string) => string;
  readonly unidad: (id: string) => string;
  /** La orden que se anula, para nombrarla. */
  readonly orden: (id: string) => Orden | undefined;
  /** El nombre de otra casa (contratos, T-103). */
  readonly jugador: (id: string) => string;
}

const ICONO: Readonly<Record<Orden['tipo'], string>> = {
  construir: '🔨',
  derribar: '🪓',
  roturar: '🌱',
  politica: '📜',
  'formar-recua': '🐴',
  ruta: '🗺️',
  carga: '📦',
  cometido: '🎯',
  'formar-rebanyo': '🐑',
  incorporar: '🏳️',
  regalo: '🎁',
  aperos: '⚒️',
  'letra-de-cambio': '✉️',
  mercado: '⚖️',
  'obra-mayor': '🏛️',
  tradicion: '⭐',
  mayordomo: '🤵',
  'trasladar-corte': '👑',
  cola: '↕️',
  anular: '✖️',
  contrato: '🤝',
  'responder-contrato': '✍️',
  portazgo: '🚧',
  entrar: '🚪',
  levar: '🛡️',
  licenciar: '🏠',
  marchar: '⚔️',
  hostilidad: '🚩',
};

function plaza(mercado: string, n: Nombres): string {
  return mercado.startsWith('local-')
    ? `la plaza de ${n.comarca(mercado.slice('local-'.length))}`
    : 'la feria';
}

function edificio(tipo: keyof typeof TABLAS_DEL_JUEGO.edificios): string {
  return TABLAS_DEL_JUEGO.edificios[tipo].nombre.toLowerCase();
}

/** La orden en una frase: «Comprar 10 de pan en la plaza de Burgos (hasta 3 mrs), con Recua 1». */
export function fraseDeOrden(o: Orden, n: Nombres): string {
  switch (o.tipo) {
    case 'construir':
      return `Construir o ampliar ${edificio(o.edificio)} en ${n.comarca(o.comarca)}`;
    case 'derribar':
      return `Derribar un nivel de ${edificio(o.edificio)} en ${n.comarca(o.comarca)}`;
    case 'mercado':
      return `${o.operacion === 'comprar' ? 'Comprar' : 'Vender'} ${String(o.cantidad)} de ${NOMBRE_DE_RECURSO[o.recurso]} en ${plaza(o.mercado, n)} (${o.operacion === 'comprar' ? 'pagando hasta' : 'cobrando al menos'} ${enMaravedis(o.precioLimiteMil)} mrs), con ${n.unidad(o.recua)}`;
    case 'ruta': {
      const quien = n.unidad(o.recua ?? o.rebanyo ?? '');
      const paradas = o.paradas.map((p) => n.comarca(p.comarca)).join(' → ');
      return `${quien}: ir a ${paradas}${o.circular ? ', una y otra vez' : ''}`;
    }
    case 'cometido':
      return `${n.unidad(o.recua)}: encargo de ${NOMBRE_DE_COMETIDO[o.cometido]}`;
    case 'carga': {
      const lista = (q: Readonly<Partial<Record<Recurso, number>>>): string =>
        RECURSOS.filter((r) => (q[r] ?? 0) > 0)
          .map((r) => `${String(q[r] ?? 0)} de ${NOMBRE_DE_RECURSO[r]}`)
          .join(', ');
      const partes = [
        lista(o.cargar) === '' ? '' : `cargar ${lista(o.cargar)}`,
        lista(o.descargar) === '' ? '' : `descargar ${lista(o.descargar)} al almacén`,
      ].filter((t) => t !== '');
      return `${n.unidad(o.recua)}: ${partes.length === 0 ? 'cargar o descargar' : partes.join(' y ')}`;
    }
    case 'regalo':
      return `Regalo al concejo de ${n.comarca(o.comarca)}`;
    case 'incorporar':
      return `Incorporar ${n.comarca(o.comarca)}`;
    case 'anular': {
      const objetivo = n.orden(o.orden);
      return objetivo === undefined ? 'Anular una orden' : `Anular: ${fraseDeOrden(objetivo, n)}`;
    }
    case 'roturar':
    case 'aperos':
    case 'politica':
    case 'formar-recua':
    case 'formar-rebanyo':
    case 'obra-mayor':
    case 'trasladar-corte':
      return `${NOMBRE_DE_ORDEN[o.tipo]} en ${n.comarca(o.comarca)}`;
    case 'contrato':
      return `Proponer un contrato de ${o.condiciones.tipo === 'prestamo' ? 'préstamo' : o.condiciones.tipo} a ${n.jugador(o.con)}`;
    case 'responder-contrato':
      return o.acepta ? 'Aceptar un contrato' : 'Rechazar un contrato';
    case 'portazgo':
      return `Portazgo de ${String(o.cantidad)} mrs entre ${n.comarca(o.desde)} y ${n.comarca(o.hasta)}`;
    case 'entrar':
      return `Entrar en la partida en ${n.comarca(o.comarca)}`;
    case 'levar':
      return `Levar ${String(o.hombres)} hombres en ${n.comarca(o.comarca)}`;
    case 'licenciar':
      return `Licenciar ${n.unidad(o.mesnada)}`;
    case 'marchar':
      return `${n.unidad(o.mesnada)} marcha hacia ${n.comarca(o.destino)}`;
    case 'hostilidad':
      return o.declarar
        ? `Declarar la hostilidad a ${n.jugador(o.contra)}`
        : `Retirar la hostilidad a ${n.jugador(o.contra)}`;
    case 'letra-de-cambio':
      return `Letra de cambio: ${String(o.cantidad)} mrs para ${n.unidad(o.recua)}`;
    case 'tradicion':
    case 'mayordomo':
    case 'cola':
      return NOMBRE_DE_ORDEN[o.tipo];
  }
}

export function iconoDeOrden(o: Orden): string {
  return ICONO[o.tipo];
}

/** Qué hacer con lo que espera, para los motivos de siempre; null si el motivo ya lo dice. */
const QUE_HACER_SI_ESPERA: Readonly<Record<string, string>> = {
  'sin-recursos': 'Consigue lo que falta, o anúlala si ya no la quieres.',
  escasez: 'Con hambre no se empieza nada: consigue pan (granja, huerta o comprarlo).',
  'sin-solar': 'No queda solar para un edificio nuevo: amplía uno que ya tengas, o anúlala.',
  'detras-en-la-cola':
    'Va detrás de otra orden de su cola: si la de delante no puede, súbela con «↑ Antes» o anula la otra.',
  'recua-lejos': 'La recua tiene que llegar a esa plaza: dale ruta hasta allí.',
  'recua-en-ruta': 'Empezará cuando la recua se pare en la plaza.',
  'recua-sin-cometido':
    'La recua necesita el encargo de tratar: llega con su orden, que va en su cola.',
  'regalo-reciente': 'Saldrá sola cuando el concejo vuelva a aceptar regalos.',
  'poca-lealtad': 'La comarca tiene que estar más contenta: baja impuestos o dale fuero.',
};

export interface OrdenEnPalabras {
  readonly id: string;
  readonly icono: string;
  readonly frase: string;
  /** Por qué espera, ya en palabras; null si no espera. */
  readonly espera: string | null;
  readonly queHacer: string | null;
  readonly anulable: boolean;
}

export interface OrdenesAgrupadas {
  /** Dadas este turno: se pueden retirar hasta el corte. */
  readonly paraEsteTurno: readonly OrdenEnPalabras[];
  /** De turnos pasados, que aún no han podido empezar. */
  readonly esperando: readonly OrdenEnPalabras[];
  /** Empezadas: obras y viajes que siguen su curso. */
  readonly enMarcha: readonly OrdenEnPalabras[];
}

function enPalabras(o: Orden, n: Nombres): OrdenEnPalabras {
  return {
    id: o.id,
    icono: iconoDeOrden(o),
    frase: fraseDeOrden(o, n),
    espera: o.motivoEspera === null ? null : (MOTIVOS[o.motivoEspera] ?? o.motivoEspera),
    queHacer: o.motivoEspera === null ? null : (QUE_HACER_SI_ESPERA[o.motivoEspera] ?? null),
    anulable: ESTADOS_ANULABLES.includes(o.estado),
  };
}

export function agruparOrdenes(
  dadas: readonly Orden[],
  vivas: readonly Orden[],
  n: Nombres,
): OrdenesAgrupadas {
  return {
    paraEsteTurno: dadas.map((o) => enPalabras(o, n)),
    esperando: vivas
      .filter((o) => ESTADOS_ANULABLES.includes(o.estado))
      .map((o) => enPalabras(o, n)),
    enMarcha: vivas
      .filter((o) => !ESTADOS_ANULABLES.includes(o.estado))
      .map((o) => enPalabras(o, n)),
  };
}
