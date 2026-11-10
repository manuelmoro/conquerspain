// Validacion de las ordenes que llegan de un cliente. Es estricta a proposito: un campo de mas
// es un error, para que nadie pueda colar datos que el motor ignoraria en silencio.
import { CARGAS_FISCALES, COMETIDOS, FUEROS } from '../tipos/estado.ts';
import type {
  IdAsedio,
  IdComarca,
  IdContrato,
  IdJugador,
  IdMercado,
  IdMesnada,
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
  OrdenAperos,
  OrdenLetraDeCambio,
  OrdenMercado,
  OrdenRegalo,
  OrdenObraMayor,
  OrdenPolitica,
  OrdenRoturar,
  OrdenRuta,
  OrdenTradicion,
  OrdenTrasladarCorte,
  OrdenAnular,
  OrdenCola,
  CondicionesDeContrato,
  OrdenContrato,
  OrdenPortazgo,
  OrdenEntrar,
  OrdenLevar,
  OrdenLicenciar,
  OrdenMarchar,
  OrdenHostilidad,
  OrdenAsediar,
  OrdenTregua,
  OrdenAceptarTregua,
  OrdenResponderContrato,
  ParadaDeRuta,
  ReglaDeMayordomo,
  AccionDeMayordomo,
  CondicionDeMayordomo,
  CondicionDePrecio,
} from '../tipos/ordenes.ts';
import { TURNOS_POR_ANYO } from '../reglas/calendario.ts';
import { ESTADOS_DE_ORDEN } from '../tipos/ordenes.ts';
import { RECURSOS, RECURSOS_COMERCIABLES } from '../tipos/recursos.ts';
import { CASAS, ESTACIONES, TIPOS_DE_EDIFICIO, TIPOS_DE_OBRA_MAYOR } from '../tipos/reglas.ts';
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
  turnoProgramado: oNulo(entero({ minimo: 1 })),
  cola: oNulo(texto({ minimo: 1, maximo: 80 })),
};

const validarOferta = objeto<{ cantidad: number; precioMinimoMil: number }>({
  cantidad: enteroNoNegativo(),
  precioMinimoMil: enteroNoNegativo(),
});

const validarDemanda = objeto<{ cantidad: number; precioMaximoMil: number }>({
  cantidad: enteroNoNegativo(),
  precioMaximoMil: enteroNoNegativo(),
});

export const validarParada: Validador<ParadaDeRuta> = objeto<ParadaDeRuta>({
  comarca: identificador<IdComarca>(),
  cargar: recursosParciales(),
  descargar: recursosParciales(),
  vender: registro(validarOferta, unoDe(RECURSOS_COMERCIABLES)),
  comprar: registro(validarDemanda, unoDe(RECURSOS_COMERCIABLES)),
});

type Condicion<T extends CondicionDeMayordomo['tipo']> = Extract<CondicionDeMayordomo, { tipo: T }>;
type Accion<T extends AccionDeMayordomo['tipo']> = Extract<AccionDeMayordomo, { tipo: T }>;

const condicionDePrecio = objeto<CondicionDePrecio>({
  tipo: unoDe(['precio-en-plaza-menor-que', 'precio-en-plaza-mayor-que'] as const),
  plaza: identificador<IdMercado>(),
  recurso: unoDe(RECURSOS_COMERCIABLES),
  precioMil: enteroNoNegativo(),
});

const validarCondicion = porTipo<CondicionDeMayordomo>({
  'pan-disponible-menor-que': objeto<Condicion<'pan-disponible-menor-que'>>({
    tipo: unoDe(['pan-disponible-menor-que'] as const),
    cantidad: enteroNoNegativo(),
  }),
  'recurso-almacenado-mayor-que': objeto<Condicion<'recurso-almacenado-mayor-que'>>({
    tipo: unoDe(['recurso-almacenado-mayor-que'] as const),
    recurso: unoDe(RECURSOS),
    cantidad: enteroNoNegativo(),
  }),
  'precio-en-plaza-menor-que': condicionDePrecio,
  'precio-en-plaza-mayor-que': condicionDePrecio,
  'obra-terminada-en': objeto<Condicion<'obra-terminada-en'>>({
    tipo: unoDe(['obra-terminada-en'] as const),
    comarca: identificador<IdComarca>(),
  }),
  escasez: objeto<Condicion<'escasez'>>({ tipo: unoDe(['escasez'] as const) }),
  'estacion-empieza': objeto<Condicion<'estacion-empieza'>>({
    tipo: unoDe(['estacion-empieza'] as const),
    estacion: unoDe(ESTACIONES),
  }),
  'rebanyo-sin-pasto': objeto<Condicion<'rebanyo-sin-pasto'>>({
    tipo: unoDe(['rebanyo-sin-pasto'] as const),
  }),
});

const validarAccion = porTipo<AccionDeMayordomo>({
  mercado: objeto<Accion<'mercado'>>({
    tipo: unoDe(['mercado'] as const),
    recua: identificador<IdRecua>(),
    mercado: identificador<IdMercado>(),
    recurso: unoDe(RECURSOS_COMERCIABLES),
    operacion: unoDe(['comprar', 'vender'] as const),
    cantidad: entero({ minimo: 1 }),
    // El precio limite es obligatorio: el mayordomo nunca compra ni vende a cualquier precio.
    precioLimiteMil: entero({ minimo: 1 }),
  }),
  'enviar-recua': objeto<Accion<'enviar-recua'>>({
    tipo: unoDe(['enviar-recua'] as const),
    recua: identificador<IdRecua>(),
    comarca: identificador<IdComarca>(),
  }),
  'mover-rebanyo': objeto<Accion<'mover-rebanyo'>>({
    tipo: unoDe(['mover-rebanyo'] as const),
    rebanyo: identificador<IdRebanyo>(),
    comarca: identificador<IdComarca>(),
  }),
  'carga-fiscal': objeto<Accion<'carga-fiscal'>>({
    tipo: unoDe(['carga-fiscal'] as const),
    comarca: identificador<IdComarca>(),
    carga: unoDe(CARGAS_FISCALES),
  }),
});

export const validarReglaDeMayordomo: Validador<ReglaDeMayordomo> = objeto<ReglaDeMayordomo>({
  prioridad: entero({ minimo: 1, maximo: 99 }),
  condicion: validarCondicion,
  accion: validarAccion,
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
  expedicion: booleano(),
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

const regalo: Validador<OrdenRegalo> = objeto<OrdenRegalo>({
  ...camposBase,
  tipo: unoDe(['regalo'] as const),
  comarca: identificador<IdComarca>(),
});

const aperos: Validador<OrdenAperos> = objeto<OrdenAperos>({
  ...camposBase,
  tipo: unoDe(['aperos'] as const),
  comarca: identificador<IdComarca>(),
});

const letraDeCambio: Validador<OrdenLetraDeCambio> = objeto<OrdenLetraDeCambio>({
  ...camposBase,
  tipo: unoDe(['letra-de-cambio'] as const),
  recua: identificador<IdRecua>(),
  cantidad: entero({ minimo: 1 }),
});

const mercado: Validador<OrdenMercado> = objeto<OrdenMercado>({
  ...camposBase,
  // Una orden de mercado vale como mucho un anyo: lo que no se casa en tanto tiempo ya no interesa.
  turnosTotales: entero({ minimo: 1, maximo: TURNOS_POR_ANYO }),
  tipo: unoDe(['mercado'] as const),
  mercado: identificador<IdMercado>(),
  recua: identificador<IdRecua>(),
  recurso: unoDe(RECURSOS_COMERCIABLES),
  operacion: unoDe(['comprar', 'vender'] as const),
  cantidad: entero({ minimo: 1 }),
  precioLimiteMil: enteroNoNegativo(),
});

const obraMayor: Validador<OrdenObraMayor> = objeto<OrdenObraMayor>({
  ...camposBase,
  tipo: unoDe(['obra-mayor'] as const),
  comarca: identificador<IdComarca>(),
  obra: unoDe(TIPOS_DE_OBRA_MAYOR),
  hacia: oNulo(identificador<IdComarca>()),
  continuar: oNulo(identificador<IdObra>()),
  abandonar: booleano(),
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
  bajaPrioridad: oNulo(entero({ minimo: 1, maximo: 99 })),
});

const cola: Validador<OrdenCola> = objeto<OrdenCola>({
  ...camposBase,
  tipo: unoDe(['cola'] as const),
  clave: texto({ minimo: 1, maximo: 80 }),
  orden: lista(identificador<IdOrden>(), { maximo: 50 }),
});

const anular: Validador<OrdenAnular> = objeto<OrdenAnular>({
  ...camposBase,
  tipo: unoDe(['anular'] as const),
  orden: identificador<IdOrden>(),
});

// ——— Contratos y portazgos (T-103) ————————————————————————————————————————————

const activa = unoDe(['propone', 'recibe'] as const);
const MARAVEDIS_MAXIMOS = 100_000;

const condiciones: Validador<CondicionesDeContrato> = porTipo<CondicionesDeContrato>({
  entrega: objeto({
    tipo: unoDe(['entrega'] as const),
    activa,
    recurso: unoDe(RECURSOS_COMERCIABLES),
    cantidad: entero({ minimo: 1, maximo: 10_000 }),
    comarca: identificador<IdComarca>(),
    precio: enteroNoNegativo(MARAVEDIS_MAXIMOS),
  }),
  prestamo: objeto({
    tipo: unoDe(['prestamo'] as const),
    activa,
    cantidad: entero({ minimo: 1, maximo: MARAVEDIS_MAXIMOS }),
    devolver: enteroNoNegativo(MARAVEDIS_MAXIMOS),
  }),
  aperos: objeto({
    tipo: unoDe(['aperos'] as const),
    activa,
    comarca: identificador<IdComarca>(),
    niveles: entero({ minimo: 1, maximo: 4 }),
    precio: enteroNoNegativo(MARAVEDIS_MAXIMOS),
  }),
  obra: objeto({
    tipo: unoDe(['obra'] as const),
    activa,
    comarca: identificador<IdComarca>(),
    obra: unoDe(TIPOS_DE_OBRA_MAYOR),
    hacia: oNulo(identificador<IdComarca>()),
    precio: enteroNoNegativo(MARAVEDIS_MAXIMOS),
  }),
  paso: objeto({
    tipo: unoDe(['paso'] as const),
    activa,
    precio: enteroNoNegativo(MARAVEDIS_MAXIMOS),
  }),
});

const contrato: Validador<OrdenContrato> = objeto<OrdenContrato>({
  ...camposBase,
  tipo: unoDe(['contrato'] as const),
  con: identificador<IdJugador>(),
  plazo: entero({ minimo: 1 }),
  penalizacion: enteroNoNegativo(MARAVEDIS_MAXIMOS),
  condiciones,
});

const responderContrato: Validador<OrdenResponderContrato> = objeto<OrdenResponderContrato>({
  ...camposBase,
  tipo: unoDe(['responder-contrato'] as const),
  contrato: identificador<IdContrato>(),
  acepta: booleano(),
});

const entrar: Validador<OrdenEntrar> = objeto<OrdenEntrar>({
  ...camposBase,
  tipo: unoDe(['entrar'] as const),
  casa: unoDe(CASAS),
  nombre: texto({ minimo: 1, maximo: 60 }),
  comarca: identificador<IdComarca>(),
});

const levar: Validador<OrdenLevar> = objeto<OrdenLevar>({
  ...camposBase,
  tipo: unoDe(['levar'] as const),
  comarca: identificador<IdComarca>(),
  hombres: entero({ minimo: 1, maximo: 100_000 }),
});

const licenciar: Validador<OrdenLicenciar> = objeto<OrdenLicenciar>({
  ...camposBase,
  tipo: unoDe(['licenciar'] as const),
  mesnada: identificador<IdMesnada>(),
});

const marchar: Validador<OrdenMarchar> = objeto<OrdenMarchar>({
  ...camposBase,
  tipo: unoDe(['marchar'] as const),
  mesnada: identificador<IdMesnada>(),
  destino: identificador<IdComarca>(),
});

const hostilidad: Validador<OrdenHostilidad> = objeto<OrdenHostilidad>({
  ...camposBase,
  tipo: unoDe(['hostilidad'] as const),
  contra: identificador<IdJugador>(),
  declarar: booleano(),
});

const asediar: Validador<OrdenAsediar> = objeto<OrdenAsediar>({
  ...camposBase,
  tipo: unoDe(['asediar'] as const),
  mesnada: identificador<IdMesnada>(),
});

const tregua: Validador<OrdenTregua> = objeto<OrdenTregua>({
  ...camposBase,
  tipo: unoDe(['tregua'] as const),
  asedio: identificador<IdAsedio>(),
  rescate: enteroNoNegativo(MARAVEDIS_MAXIMOS),
});

const aceptarTregua: Validador<OrdenAceptarTregua> = objeto<OrdenAceptarTregua>({
  ...camposBase,
  tipo: unoDe(['aceptar-tregua'] as const),
  asedio: identificador<IdAsedio>(),
});

const portazgo: Validador<OrdenPortazgo> = objeto<OrdenPortazgo>({
  ...camposBase,
  tipo: unoDe(['portazgo'] as const),
  desde: identificador<IdComarca>(),
  hasta: identificador<IdComarca>(),
  cantidad: enteroNoNegativo(1000),
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
  regalo,
  aperos,
  'letra-de-cambio': letraDeCambio,
  mercado,
  'obra-mayor': obraMayor,
  tradicion,
  mayordomo,
  'trasladar-corte': trasladarCorte,
  cola,
  anular,
  contrato,
  'responder-contrato': responderContrato,
  portazgo,
  entrar,
  levar,
  licenciar,
  marchar,
  hostilidad,
  asediar,
  tregua,
  'aceptar-tregua': aceptarTregua,
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
  if (orden.tipo === 'mercado' && RECURSOS.some((r) => orden.coste[r] > 0)) {
    return invalidos([
      {
        ruta: 'coste',
        mensaje:
          'una orden de mercado no reserva nada en el almacen: comercia con lo que lleva la recua, asi que su coste es cero',
      },
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
    case 'regalo':
    case 'aperos':
    case 'obra-mayor':
    case 'trasladar-corte':
      return [orden.comarca];
    case 'ruta':
      return orden.paradas.map((parada) => parada.comarca);
    case 'portazgo':
      return [orden.desde, orden.hasta];
    case 'entrar':
    case 'levar':
      return [orden.comarca];
    case 'marchar':
      return [orden.destino];
    case 'contrato': {
      const c = orden.condiciones;
      if (c.tipo === 'obra') return c.hacia === null ? [c.comarca] : [c.comarca, c.hacia];
      return c.tipo === 'entrega' || c.tipo === 'aperos' ? [c.comarca] : [];
    }
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
