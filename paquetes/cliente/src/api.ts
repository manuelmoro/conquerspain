// La API del servidor vista desde el cliente (ficha T-080). Distingue tres cosas: respuesta buena,
// error del servidor (con su codigo y su mensaje en espanyol) y **ninguna respuesta** (red caida),
// que es la que decide si una orden se queda en la bandeja para reintentarla.
import { VERSION_REGLAS } from '@conquer/nucleo';
import type { AtlasDeJugador, Cronica, VistaJugador } from '@conquer/nucleo';

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
}

export interface EstadoRecibido {
  readonly turno: number;
  readonly estadoDeLaPartida: string;
  readonly proximaResolucion: number | null;
  readonly vista: VistaJugador;
}

export interface OfertaRecibida {
  readonly comarca: string;
  readonly nombre: string;
  readonly perfil: string;
  readonly ventaja: string;
  readonly limitacion: string;
}

export interface ConvocatoriaRecibida {
  readonly id: string;
  readonly nombre: string;
  readonly estado: 'abierta' | 'eligiendo' | 'fundada';
  readonly codigo: string | null;
  readonly jugadores: readonly { casa: string; nombre: string; haElegido: boolean }[];
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
    return this.pedir<{ ordenes: { id: string }[] }>(
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
  }) {
    return this.pedir<{ id: string; codigo: string }>('POST', '/convocatorias', datos);
  }

  unirse(codigo: string, casa: string) {
    return this.pedir<{ id: string }>('POST', '/convocatorias/unirse', { codigo, casa });
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

  elegir(id: string, comarca: string) {
    return this.pedir<{ convocatoria: ConvocatoriaRecibida }>(
      'POST',
      `/convocatorias/${encodeURIComponent(id)}/eleccion`,
      { comarca },
    );
  }
}
