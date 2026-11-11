// La API del servidor vista desde el cliente (ficha T-080). Distingue tres cosas: respuesta buena,
// error del servidor (con su codigo y su mensaje en espanyol) y **ninguna respuesta** (red caida),
// que es la que decide si una orden se queda en la bandeja para reintentarla.
import { VERSION_REGLAS } from '@conquer/nucleo';
import type {
  ClaseDeConcepto,
  ResumenParaLaLista,
  AtlasDeJugador,
  ClasificacionPublica,
  Cronica,
  FichaDeComarca,
  Orden,
  PanelDeMercado,
  PrevisionDeRuta,
  Recurso,
  OfertaDeOrigen,
  VistaJugador,
} from '@conquer/nucleo';

export type RespuestaDeApi<T> =
  | { readonly ok: true; readonly estado: number; readonly datos: T }
  | {
      readonly ok: false;
      readonly tipo: 'error';
      readonly estado: number;
      readonly codigo: string;
      readonly mensaje: string;
    }
  | { readonly ok: false; readonly tipo: 'sin-red'; readonly mensaje: string };

export interface CuentaDelCliente {
  readonly id: string;
  readonly nombre: string;
}

export interface PartidaDeLaLista {
  readonly id: string;
  readonly nombre: string;
  readonly casa: string;
  readonly turno: number;
  readonly estado: string;
  readonly proximaResolucion: number | null;
  /** Lo que la lista avisa (T-086): fecha, prestigio y puesto, y abastecimiento. */
  readonly resumen: ResumenParaLaLista | null;
  /** Ordenes suyas recibidas este turno y aun sin resolver. */
  readonly ordenesDadas: number;
}

/** Cada cuanto llega el aviso por correo de una partida (T-064). */
export type ModoDeAviso = 'cada-turno' | 'diario' | 'nada';

export interface EstadoRecibido {
  readonly turno: number;
  readonly estadoDeLaPartida: string;
  readonly proximaResolucion: number | null;
  /** Quien convoco la partida: puede avanzar el turno a mano (T-090). */
  readonly esAdministrador?: boolean;
  /** Las comarcas que ya puede incorporar, para resaltarlas en el mapa (T-092). */
  readonly incorporables?: readonly string[];
  /** El codigo para invitar a mas gente, solo para quien convoco la partida (T-125). */
  readonly codigoDeInvitacion?: string | null;
  /** Mensajes de la charla que aun no ha leido (T-129). */
  readonly charlaSinLeer?: number;
  /** Quien ha dado ya por terminado este turno (T-124). */
  readonly finDeTurno?: readonly QuienJuega[];
  readonly vista: VistaJugador;
}

/** Lo que ensenya un enlace de invitacion, aun sin cuenta (T-125). */
export interface InvitacionRecibida {
  readonly nombre: string;
  readonly convoca: string;
  readonly momento: 'apuntandose' | 'sorteando' | 'empezada' | 'cerrada';
  readonly turno: number | null;
  readonly intervaloMinutos: number;
  readonly casas: readonly {
    readonly casa: string;
    readonly nombre: string;
    readonly veces: number;
  }[];
  readonly casasLlenas: readonly string[];
  readonly plazasLibres: number;
}

/** Un mensaje de la charla de la partida (T-129). */
export interface MensajeRecibido {
  readonly id: number;
  readonly jugador: string;
  readonly nombre: string;
  /** La casa de quien escribe, o null si ya no esta en la partida. */
  readonly casa: string | null;
  readonly turno: number;
  readonly texto: string;
  readonly enviadoEn: number;
}

/** Un jugador de la partida y si ha dado por terminado el turno (T-124). */
export interface QuienJuega {
  readonly jugador: string;
  readonly nombre: string;
  readonly terminado: boolean;
}

export interface OfertaRecibida {
  readonly comarca: string;
  readonly nombre: string;
  readonly perfil: string;
  readonly ventaja: string;
  readonly limitacion: string;
}

/** Una orden ya enviada que el servidor guarda hasta resolver el turno. */
/** El mercado del jugador (T-084 §4.2): su panel y la serie de precios que supo por plaza. */
export interface MercadoRecibido {
  readonly turno: number;
  readonly panel: PanelDeMercado;
  readonly series: Readonly<
    Record<string, Readonly<Partial<Record<Recurso, readonly { turno: number; mil: number }[]>>>>
  >;
}

/** Lo que movio un concepto en un turno (T-126): positivo si entro, negativo si salio. */
export interface PartidaDelDesglose {
  readonly clase: ClaseDeConcepto;
  readonly ref: string | null;
  readonly delta: number;
}

/** Un turno del historico de recursos (T-090): lo que entro, salio y quedo de cada uno, y en que. */
export interface TurnoDelHistorial {
  readonly turno: number;
  readonly recursos: Readonly<
    Record<
      Recurso,
      {
        readonly entra: number;
        readonly sale: number;
        readonly queda: number;
        readonly desglose: readonly PartidaDelDesglose[];
      }
    >
  >;
}

/** El historico con lo que hace falta para nombrar las ordenes y obras que nombra (T-126). */
export interface HistorialRecibido {
  readonly turnos: readonly TurnoDelHistorial[];
  readonly referencias: {
    readonly ordenes: Readonly<Record<string, Orden>>;
    readonly obras: Readonly<Record<string, { readonly que: string; readonly comarca: string }>>;
  };
}

export interface OrdenEnviada {
  readonly id: string;
  readonly estado: string;
  readonly turnoRecibida: number;
  readonly orden: Orden;
}

export interface ConvocatoriaRecibida {
  readonly id: string;
  readonly nombre: string;
  readonly estado: 'abierta' | 'eligiendo' | 'fundada';
  readonly intervaloMinutos: number;
  readonly plazas: number;
  readonly esDePrueba: boolean;
  readonly codigo: string | null;
  readonly jugadores: readonly { casa: string; nombre: string; haElegido: boolean }[];
  /** Quien mira es quien convoco: puede fundar sin esperar a todos (T-100). */
  readonly esQuienConvoca?: boolean;
  readonly misOfertas: readonly OfertaRecibida[];
  readonly miEleccion: string | null;
  readonly avisos: readonly string[];
  readonly partida: string | null;
}

/**
 * Donde se guarda la cookie de sesion fuera del navegador (pruebas y herramientas). En el navegador
 * no hace falta: `credentials: 'include'` la manda sola.
 */
export interface TarroDeCookies {
  cookie: string | null;
}

export interface OpcionesDeApi {
  /** `/api` en el navegador (proxy de Vite), o `http://127.0.0.1:8080` fuera. */
  readonly base: string;
  readonly fetch?: typeof fetch;
  readonly tarro?: TarroDeCookies;
}

function objeto(dato: unknown): Record<string, unknown> {
  return typeof dato === 'object' && dato !== null && !Array.isArray(dato)
    ? Object.fromEntries(Object.entries(dato))
    : {};
}

export class ClienteApi {
  private readonly base: string;
  private readonly hacerFetch: typeof fetch;
  private readonly tarro: TarroDeCookies | null;

  constructor(opciones: OpcionesDeApi) {
    this.base = opciones.base.replace(/\/$/, '');
    this.hacerFetch = opciones.fetch ?? ((...args) => fetch(...args));
    this.tarro = opciones.tarro ?? null;
  }

  /** La peticion cruda; los metodos de abajo dicen que forma tiene lo que vuelve. */
  async pedir<T>(metodo: string, ruta: string, cuerpo?: unknown): Promise<RespuestaDeApi<T>> {
    const cabeceras: Record<string, string> = {};
    if (cuerpo !== undefined) cabeceras['content-type'] = 'application/json';
    if (this.tarro !== null && this.tarro.cookie !== null) cabeceras['cookie'] = this.tarro.cookie;
    let respuesta: Response;
    try {
      respuesta = await this.hacerFetch(`${this.base}${ruta}`, {
        method: metodo,
        headers: cabeceras,
        credentials: 'include',
        ...(cuerpo === undefined ? {} : { body: JSON.stringify(cuerpo) }),
      });
    } catch {
      return { ok: false, tipo: 'sin-red', mensaje: 'No hay conexion con el servidor.' };
    }
    const setCookie = respuesta.headers.get('set-cookie');
    if (this.tarro !== null && setCookie !== null) {
      const valor = setCookie.split(';')[0] ?? '';
      this.tarro.cookie = setCookie.includes('Max-Age=0') ? null : valor;
    }
    let dato: unknown;
    try {
      dato = await respuesta.json();
    } catch {
      dato = null;
    }
    const version = objeto(dato)['version'];
    if (typeof version === 'number' && version !== VERSION_REGLAS) {
      return {
        ok: false,
        tipo: 'error',
        estado: respuesta.status,
        codigo: 'version-distinta',
        mensaje: 'El servidor juega con otra version de las reglas: recarga la pagina.',
      };
    }
    // El servidor es del mismo repositorio y de la misma version de reglas (se acaba de comprobar):
    // su respuesta tiene la forma que dicen sus tipos. Es la frontera en la que el cliente se fia.
    if (respuesta.ok) return { ok: true, estado: respuesta.status, datos: dato as T };
    const error = objeto(objeto(dato)['error']);
    return {
      ok: false,
      tipo: 'error',
      estado: respuesta.status,
      codigo: typeof error['codigo'] === 'string' ? error['codigo'] : 'desconocido',
      mensaje:
        typeof error['mensaje'] === 'string'
          ? error['mensaje']
          : `El servidor respondio ${String(respuesta.status)}.`,
    };
  }

  pedirEnlace(correo: string, nombre?: string) {
    return this.pedir<{ mensaje: string }>('POST', '/cuentas/enlace', {
      correo,
      ...(nombre === undefined ? {} : { nombre }),
    });
  }

  entrar(token: string) {
    return this.pedir<{ cuenta: CuentaDelCliente }>('POST', '/sesion', { token });
  }

  salir() {
    return this.pedir<{ cerrada: boolean }>('DELETE', '/sesion');
  }

  // ——— Contrasenyas (T-091) ———
  registrar(datos: { correo: string; nombre: string; clave: string }) {
    return this.pedir<{ mensaje: string }>('POST', '/cuentas/registro', datos);
  }

  entrarConClave(datos: { correo: string; clave: string; recordar: boolean }) {
    return this.pedir<{ cuenta: CuentaDelCliente }>('POST', '/sesion/clave', datos);
  }

  olvido(correo: string) {
    return this.pedir<{ mensaje: string }>('POST', '/cuentas/olvido', { correo });
  }

  restablecer(token: string, clave: string) {
    return this.pedir<{ cuenta: CuentaDelCliente }>('POST', '/cuentas/restablecer', {
      token,
      clave,
    });
  }

  cuenta() {
    return this.pedir<{ cuenta: CuentaDelCliente }>('GET', '/cuenta');
  }

  misPartidas() {
    return this.pedir<{ partidas: PartidaDeLaLista[] }>('GET', '/partidas/mias');
  }

  estado(partida: string) {
    return this.pedir<EstadoRecibido>('GET', `/partidas/${encodeURIComponent(partida)}/estado`);
  }

  atlas(partida: string) {
    return this.pedir<{ turno: number; atlas: AtlasDeJugador }>(
      'GET',
      `/partidas/${encodeURIComponent(partida)}/atlas`,
    );
  }

  ficha(partida: string, comarca: string) {
    return this.pedir<{ turno: number; ficha: FichaDeComarca }>(
      'GET',
      `/partidas/${encodeURIComponent(partida)}/comarcas/${encodeURIComponent(comarca)}`,
    );
  }

  clasificacion(partida: string) {
    return this.pedir<{ turno: number; publica: ClasificacionPublica }>(
      'GET',
      `/partidas/${encodeURIComponent(partida)}/clasificacion`,
    );
  }

  historialDeRecursos(partida: string) {
    return this.pedir<HistorialRecibido>(
      'GET',
      `/partidas/${encodeURIComponent(partida)}/historial-de-recursos`,
    );
  }

  /** Como quiere el jugador los avisos por correo de esta partida (T-064, T-066). */
  avisos(partida: string) {
    return this.pedir<{ modo: ModoDeAviso; porDefecto: ModoDeAviso }>(
      'GET',
      `/partidas/${encodeURIComponent(partida)}/avisos`,
    );
  }

  fijarAvisos(partida: string, modo: ModoDeAviso) {
    return this.pedir<{ modo: ModoDeAviso }>(
      'PUT',
      `/partidas/${encodeURIComponent(partida)}/avisos`,
      { modo },
    );
  }

  mercado(partida: string) {
    return this.pedir<MercadoRecibido>('GET', `/partidas/${encodeURIComponent(partida)}/mercado`);
  }

  /** La prevision de una ruta que se esta trazando (T-083 §4.3). */
  previsionDeRuta(
    partida: string,
    pedida: {
      readonly recua?: string;
      readonly rebanyo?: string;
      readonly paradas: readonly string[];
      readonly circular: boolean;
    },
  ) {
    return this.pedir<{ turno: number; prevision: PrevisionDeRuta }>(
      'POST',
      `/partidas/${encodeURIComponent(partida)}/prevision-de-ruta`,
      pedida,
    );
  }

  retirarOrden(partida: string, orden: string) {
    return this.pedir<{ retirada: string }>(
      'DELETE',
      `/partidas/${encodeURIComponent(partida)}/ordenes/${encodeURIComponent(orden)}`,
    );
  }

  avanzar(partida: string) {
    return this.pedir<{ resultado: string }>(
      'POST',
      `/partidas/${encodeURIComponent(partida)}/avanzar`,
    );
  }

  /** Da el turno por terminado (o lo reabre); si era el ultimo en hacerlo, el turno se resuelve. */
  terminarTurno(partida: string, terminado: boolean) {
    return this.pedir<{ resultado: string; finDeTurno: QuienJuega[] }>(
      'PUT',
      `/partidas/${encodeURIComponent(partida)}/fin-de-turno`,
      { terminado },
    );
  }

  /** Los ultimos mensajes de la charla, con lo ultimo que leyo y cuantos no (T-129). */
  charla(partida: string) {
    return this.pedir<{
      mensajes: MensajeRecibido[];
      hayMas: boolean;
      ultimoLeido: number;
      sinLeer: number;
    }>('GET', `/partidas/${encodeURIComponent(partida)}/charla`);
  }

  charlaAntes(partida: string, mensaje: number) {
    return this.pedir<{ mensajes: MensajeRecibido[]; hayMas: boolean }>(
      'GET',
      `/partidas/${encodeURIComponent(partida)}/charla/antes/${String(mensaje)}`,
    );
  }

  escribirEnLaCharla(partida: string, texto: string) {
    return this.pedir<{ mensaje: MensajeRecibido }>(
      'POST',
      `/partidas/${encodeURIComponent(partida)}/charla`,
      { texto },
    );
  }

  leerLaCharla(partida: string, hasta: number) {
    return this.pedir<{ sinLeer: number }>(
      'PUT',
      `/partidas/${encodeURIComponent(partida)}/charla/leidos`,
      { hasta },
    );
  }

  cronica(partida: string, turno: number) {
    return this.pedir<{ cronica: Cronica }>(
      'GET',
      `/partidas/${encodeURIComponent(partida)}/cronica/${String(turno)}`,
    );
  }

  darOrden(partida: string, intencion: Readonly<Record<string, unknown>>) {
    return this.pedir<{ orden: { id: string } }>(
      'POST',
      `/partidas/${encodeURIComponent(partida)}/ordenes`,
      intencion,
    );
  }

  ordenesPendientes(partida: string) {
    return this.pedir<{ ordenes: OrdenEnviada[] }>(
      'GET',
      `/partidas/${encodeURIComponent(partida)}/ordenes`,
    );
  }

  convocar(datos: {
    nombre: string;
    casa: string;
    intervaloMinutos: number;
    plazas: number;
    esDePrueba?: boolean;
    temporada?: boolean;
  }) {
    return this.pedir<{ id: string; codigo: string }>('POST', '/convocatorias', datos);
  }

  /** Lo que dice un enlace de invitacion; no pide sesion (T-125). */
  invitacion(codigo: string) {
    return this.pedir<{ invitacion: InvitacionRecibida }>(
      'GET',
      `/invitaciones/${encodeURIComponent(codigo)}`,
    );
  }

  unirse(codigo: string, casa: string) {
    return this.pedir<{ id: string }>('POST', '/convocatorias/unirse', { codigo, casa });
  }

  /** Ofertas para entrar en una partida ya empezada, con su codigo (T-107). */
  ofertasParaEntrar(codigo: string, casa: string) {
    return this.pedir<{ partida: string; ofertas: OfertaDeOrigen[] }>(
      'POST',
      '/partidas/entrada/ofertas',
      { codigo, casa },
    );
  }

  /** Entra en la partida empezada con el origen elegido: juega desde que se resuelva el turno. */
  entrarEnPartida(codigo: string, casa: string, comarca: string) {
    return this.pedir<{ partida: string; turno: number }>('POST', '/partidas/entrada', {
      codigo,
      casa,
      comarca,
    });
  }

  misConvocatorias() {
    return this.pedir<{ convocatorias: ConvocatoriaRecibida[] }>('GET', '/convocatorias/mias');
  }

  convocatoria(id: string) {
    return this.pedir<{ convocatoria: ConvocatoriaRecibida }>(
      'GET',
      `/convocatorias/${encodeURIComponent(id)}`,
    );
  }

  sortear(id: string) {
    return this.pedir<{ convocatoria: ConvocatoriaRecibida }>(
      'POST',
      `/convocatorias/${encodeURIComponent(id)}/sortear`,
    );
  }

  /** Quien convoco funda sin esperar: a quien no eligio le toca su primera oferta (T-100). */
  fundarYa(id: string) {
    return this.pedir<{ convocatoria: ConvocatoriaRecibida }>(
      'POST',
      `/convocatorias/${encodeURIComponent(id)}/fundar`,
    );
  }

  elegir(id: string, comarca: string) {
    return this.pedir<{ convocatoria: ConvocatoriaRecibida }>(
      'POST',
      `/convocatorias/${encodeURIComponent(id)}/eleccion`,
      { comarca },
    );
  }
}
