// Validacion de las ordenes que llegan de un cliente. Es estricta a proposito: un campo de mas
// es un error, para que nadie pueda colar datos que el motor ignoraria en silencio.
import { CARGAS_FISCALES, COMETIDOS, FUEROS } from '../tipos/estado.ts';
import type {
  IdComarca,
  IdJugador,
  IdMercado,
  IdObra,
  IdOrden,
  IdRebanyo,
  IdRecua,
} from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type {
  Orden,
  OrdenBase,
  OrdenCarga,
  OrdenCometido,
  OrdenConstruir,
  OrdenDerribar,
  OrdenFormarRebanyo,
  OrdenFormarRecua,
  OrdenIncorporar,
  OrdenMayordomo,
  OrdenMercado,
  OrdenObraMayor,
  OrdenPolitica,
  OrdenRoturar,
  OrdenRuta,
  OrdenTradicion,
  OrdenTrasladarCorte,
  ParadaDeRuta,
  ReglaDeMayordomo,
} from '../tipos/ordenes.ts';
import { ESTADOS_DE_ORDEN } from '../tipos/ordenes.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import { TIPOS_DE_EDIFICIO } from '../tipos/reglas.ts';
import { recursos, recursosParciales } from './comunes.ts';
import type { CamposDe, ErrorValidacion, Resultado, Validador } from './validador.ts';
import {
  booleano,
  entero,
  enteroNoNegativo,
  identificador,
  invalidos,
  lista,
  oNulo,
  objeto,
  porTipo,
  registro,
  texto,
  unoDe,
  valido,
} from './validador.ts';

const camposBase: CamposDe<OrdenBase> = {
  id: identificador<IdOrden>(),
  jugador: identificador<IdJugador>(),
  turnoAlta: entero({ minimo: 1 }),
  estado: unoDe(ESTADOS_DE_ORDEN),
  coste: recursos(),
  turnosTotales: enteroNoNegativo(500),
  turnosHechos: enteroNoNegativo(500),
  motivoEspera: oNulo(texto({ maximo: 200 })),
  delMayordomo: booleano(),
};

const validarOferta = objeto<{ cantidad: number; precioMinimoMil: number }>({
  cantidad: enteroNoNegativo(),
  precioMinimoMil: enteroNoNegativo(),
});

const validarDemanda = objeto<{ cantidad: number; precioMaximoMil: number }>({
  cantidad: enteroNoNegativo(),
  precioMaximoMil: enteroNoNegativo(),
});

const validarParada: Validador<ParadaDeRuta> = objeto<ParadaDeRuta>({
  comarca: identificador<IdComarca>(),
  cargar: recursosParciales(),
  descargar: recursosParciales(),
  vender: registro(validarOferta, unoDe(RECURSOS)),
  comprar: registro(validarDemanda, unoDe(RECURSOS)),
});

const validarValorDeParametro: Validador<number | string> = (dato, ruta) =>
  typeof dato === 'string' ? valido<number | string>(dato) : entero()(dato, ruta);

const validarReglaDeMayordomo: Validador<ReglaDeMayordomo> = objeto<ReglaDeMayordomo>({
  condicion: texto({ minimo: 1, maximo: 60 }),
  parametros: registro(validarValorDeParametro),
  accion: texto({ minimo: 1, maximo: 60 }),
  prioridad: entero({ minimo: 1, maximo: 10 }),
});

const construir: Validador<OrdenConstruir> = objeto<OrdenConstruir>({
  ...camposBase,
  tipo: unoDe(['construir'] as const),
  comarca: identificador<IdComarca>(),
  edificio: unoDe(TIPOS_DE_EDIFICIO),
});

const derribar: Validador<OrdenDerribar> = objeto<OrdenDerribar>({
  ...camposBase,
  tipo: unoDe(['derribar'] as const),
  comarca: identificador<IdComarca>(),
  edificio: unoDe(TIPOS_DE_EDIFICIO),
});

const roturar: Validador<OrdenRoturar> = objeto<OrdenRoturar>({
  ...camposBase,
  tipo: unoDe(['roturar'] as const),
  comarca: identificador<IdComarca>(),
});

const politica: Validador<OrdenPolitica> = objeto<OrdenPolitica>({
  ...camposBase,
  tipo: unoDe(['politica'] as const),
  comarca: identificador<IdComarca>(),
  fuero: oNulo(unoDe(FUEROS)),
  cargaFiscal: oNulo(unoDe(CARGAS_FISCALES)),
  dehesa: oNulo(booleano()),
  conservarConSal: oNulo(booleano()),
});

const formarRecua: Validador<OrdenFormarRecua> = objeto<OrdenFormarRecua>({
  ...camposBase,
  tipo: unoDe(['formar-recua'] as const),
  comarca: identificador<IdComarca>(),
  acemilas: entero({ minimo: 1, maximo: 100 }),
  vecinos: enteroNoNegativo(100),
});

const formarRebanyo: Validador<OrdenFormarRebanyo> = objeto<OrdenFormarRebanyo>({
  ...camposBase,
  tipo: unoDe(['formar-rebanyo'] as const),
  comarca: identificador<IdComarca>(),
  cabezas: entero({ minimo: 1, maximo: 10000 }),
});

const ruta: Validador<OrdenRuta> = objeto<OrdenRuta>({
  ...camposBase,
  tipo: unoDe(['ruta'] as const),
  recua: oNulo(identificador<IdRecua>()),
  rebanyo: oNulo(identificador<IdRebanyo>()),
  paradas: lista(validarParada, { minimo: 1, maximo: 12 }),
  circular: booleano(),
});

const carga: Validador<OrdenCarga> = objeto<OrdenCarga>({
  ...camposBase,
  tipo: unoDe(['carga'] as const),
  recua: identificador<IdRecua>(),
  cargar: recursosParciales(),
  descargar: recursosParciales(),
  vecinosCargados: enteroNoNegativo(100),
});

const cometido: Validador<OrdenCometido> = objeto<OrdenCometido>({
  ...camposBase,
  tipo: unoDe(['cometido'] as const),
  recua: identificador<IdRecua>(),
  cometido: unoDe(COMETIDOS),
});

const incorporar: Validador<OrdenIncorporar> = objeto<OrdenIncorporar>({
  ...camposBase,
  tipo: unoDe(['incorporar'] as const),
  comarca: identificador<IdComarca>(),
});

const mercado: Validador<OrdenMercado> = objeto<OrdenMercado>({
  ...camposBase,
  tipo: unoDe(['mercado'] as const),
  mercado: identificador<IdMercado>(),
  recurso: unoDe(RECURSOS),
  operacion: unoDe(['comprar', 'vender'] as const),
  cantidad: entero({ minimo: 1 }),
  precioLimiteMil: enteroNoNegativo(),
});

const obraMayor: Validador<OrdenObraMayor> = objeto<OrdenObraMayor>({
  ...camposBase,
  tipo: unoDe(['obra-mayor'] as const),
  comarca: identificador<IdComarca>(),
  obra: texto({ minimo: 1, maximo: 40 }),
  continuar: oNulo(identificador<IdObra>()),
});

const tradicion: Validador<OrdenTradicion> = objeto<OrdenTradicion>({
  ...camposBase,
  tipo: unoDe(['tradicion'] as const),
  tradicion: texto({ minimo: 1, maximo: 60 }),
});

const mayordomo: Validador<OrdenMayordomo> = objeto<OrdenMayordomo>({
  ...camposBase,
  tipo: unoDe(['mayordomo'] as const),
  alta: oNulo(validarReglaDeMayordomo),
  bajaPrioridad: oNulo(entero({ minimo: 1, maximo: 10 })),
});

const trasladarCorte: Validador<OrdenTrasladarCorte> = objeto<OrdenTrasladarCorte>({
  ...camposBase,
  tipo: unoDe(['trasladar-corte'] as const),
  comarca: identificador<IdComarca>(),
});

const validarForma = porTipo<Orden>({
  construir,
  derribar,
  roturar,
  politica,
  'formar-recua': formarRecua,
  'formar-rebanyo': formarRebanyo,
  ruta,
  carga,
  cometido,
  incorporar,
  mercado,
  'obra-mayor': obraMayor,
  tradicion,
  mayordomo,
  'trasladar-corte': trasladarCorte,
});

/** Valida la forma de una orden que llega de fuera. No comprueba si sus referencias existen. */
export function validarOrdenEntrante(dato: unknown): Resultado<Orden> {
  const resultado = validarForma(dato, '');
  if (!resultado.ok) return resultado;
  const orden = resultado.valor;
  if (orden.turnosHechos > orden.turnosTotales) {
    return invalidos([
      {
        ruta: 'turnosHechos',
        mensaje: `una orden no puede llevar ${String(orden.turnosHechos)} turnos hechos de ${String(orden.turnosTotales)}`,
      },
    ]);
  }
  if (orden.tipo === 'ruta' && orden.recua === null && orden.rebanyo === null) {
    return invalidos([
      { ruta: 'recua', mensaje: 'una ruta es de una recua o de un rebanyo, y aqui no hay ninguno' },
    ]);
  }
  return valido(orden);
}

/** Comarcas que cita una orden, para comprobar que existen en el mundo. */
function comarcasCitadas(orden: Orden): string[] {
  switch (orden.tipo) {
    case 'construir':
    case 'derribar':
    case 'roturar':
    case 'politica':
    case 'formar-recua':
    case 'formar-rebanyo':
    case 'incorporar':
    case 'obra-mayor':
    case 'trasladar-corte':
      return [orden.comarca];
    case 'ruta':
      return orden.paradas.map((parada) => parada.comarca);
    default:
      return [];
  }
}

/** Comprueba que las referencias de la orden existen en el mundo de la partida. */
export function validarOrdenEnMundo(orden: Orden, mundo: Mundo): Resultado<Orden> {
  const errores: ErrorValidacion[] = [];
  for (const comarca of comarcasCitadas(orden)) {
    if (!Object.hasOwn(mundo.comarcas, comarca)) {
      errores.push({ ruta: 'comarca', mensaje: `la comarca "${comarca}" no existe en este mundo` });
    }
  }
  return errores.length > 0 ? invalidos(errores) : valido(orden);
}
