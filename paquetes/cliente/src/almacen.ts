// El estado del cliente y sus acciones (ficha T-080 §4.2 a §4.5). Las pantallas solo leen y llaman
// acciones; nada de aqui toca el DOM.
import type { AtlasDeJugador, FichaDeComarca, TablasDeReglas } from '@conquer/nucleo';

import type { ClienteApi, CuentaDelCliente, EstadoRecibido, OrdenEnviada } from './api.ts';
import type { Guardado } from './guardado.ts';
import { preverBandeja } from './prevision.ts';
import type { PrevisionDeBandeja } from './prevision.ts';

export interface IntencionLocal {
  readonly idCliente: string;
  /** La intencion tal como se manda, con su `idCliente` dentro. */
  readonly intencion: Readonly<Record<string, unknown>>;
  /** El error del servidor si la rechazo; null mientras se pueda enviar. */
  readonly error: { readonly codigo: string; readonly mensaje: string } | null;
}

export interface PartidaAbierta {
  readonly id: string;
  readonly recibido: EstadoRecibido;
  /** El atlas del jugador (T-081), o null si aun no ha llegado. */
  readonly atlas: AtlasDeJugador | null;
  /** Milisegundos Unix en que el servidor la dio. */
  readonly recibidaEn: number;
  readonly desactualizada: boolean;
}

export interface EstadoDelCliente {
  readonly cuenta: CuentaDelCliente | null;
  readonly partida: PartidaAbierta | null;
  readonly pendientes: readonly IntencionLocal[];
  readonly conexion: 'conectado' | 'sin-conexion';
  readonly turnoNuevo: number | null;
  /** Las ordenes ya enviadas que esperan a la resolucion: se pueden retirar. */
  readonly enviadas: readonly OrdenEnviada[];
  /** La comarca cuya ficha esta abierta. */
  readonly comarcaAbierta: string | null;
  readonly errores: readonly { readonly codigo: string; readonly mensaje: string }[];
}

export interface DependenciasDelAlmacen {
  readonly api: ClienteApi;
  readonly guardado: Guardado;
  readonly reglas: TablasDeReglas;
  readonly ahora: () => number;
  /** Una clave nueva para cada orden. */
  readonly nuevaClave: () => string;
}

const INICIAL: EstadoDelCliente = {
  cuenta: null,
  partida: null,
  pendientes: [],
  conexion: 'conectado',
  turnoNuevo: null,
  enviadas: [],
  comarcaAbierta: null,
  errores: [],
};

function claveDeVista(partida: string): string {
  return `conquer:vista:${partida}`;
}

function claveDePendientes(partida: string): string {
  return `conquer:pendientes:${partida}`;
}

/** La bandeja guardada, leida con cuidado: si algo no tiene forma, se descarta esa entrada. */
export function leerPendientes(texto: string | null): IntencionLocal[] {
  if (texto === null) return [];
  let dato: unknown;
  try {
    dato = JSON.parse(texto);
  } catch {
    return [];
  }
  if (!Array.isArray(dato)) return [];
  const salida: IntencionLocal[] = [];
  for (const entrada of dato as unknown[]) {
    if (typeof entrada !== 'object' || entrada === null) continue;
    if (!('idCliente' in entrada) || typeof entrada.idCliente !== 'string') continue;
    if (
      !('intencion' in entrada) ||
      typeof entrada.intencion !== 'object' ||
      entrada.intencion === null
    ) {
      continue;
    }
    const e = 'error' in entrada ? entrada.error : null;
    const error =
      typeof e === 'object' &&
      e !== null &&
      'codigo' in e &&
      'mensaje' in e &&
      typeof e.codigo === 'string' &&
      typeof e.mensaje === 'string'
        ? { codigo: e.codigo, mensaje: e.mensaje }
        : null;
    salida.push({
      idCliente: entrada.idCliente,
      intencion: Object.fromEntries(Object.entries(entrada.intencion)),
      error,
    });
  }
  return salida;
}

export class Almacen {
  private estadoActual: EstadoDelCliente = INICIAL;
  private readonly oyentes = new Set<(estado: EstadoDelCliente) => void>();

  constructor(private readonly dep: DependenciasDelAlmacen) {}

  get estado(): EstadoDelCliente {
    return this.estadoActual;
  }

  suscribir(oyente: (estado: EstadoDelCliente) => void): () => void {
    this.oyentes.add(oyente);
    return () => this.oyentes.delete(oyente);
  }

  private cambiar(cambios: Partial<EstadoDelCliente>): void {
    this.estadoActual = { ...this.estadoActual, ...cambios };
    for (const oyente of [...this.oyentes]) oyente(this.estadoActual);
  }

  private anotarError(codigo: string, mensaje: string): void {
    this.cambiar({ errores: [...this.estadoActual.errores, { codigo, mensaje }].slice(-5) });
  }

  /** Vuelve a avisar a quien escucha con el mismo estado: lo usa la interfaz al cambiar algo suyo. */
  refrescar(): void {
    this.cambiar({});
  }

  limpiarErrores(): void {
    this.cambiar({ errores: [] });
  }

  /** La prevision de la bandeja con la vista que se tenga. */
  prevision(): PrevisionDeBandeja | null {
    const partida = this.estadoActual.partida;
    if (partida === null) return null;
    return preverBandeja(
      partida.recibido.vista,
      this.estadoActual.pendientes.map((p) => p.intencion),
      this.dep.reglas,
    );
  }

  // ---------------------------------------------------------------- cuenta

  async pedirEnlace(correo: string): Promise<boolean> {
    const r = await this.dep.api.pedirEnlace(correo);
    if (!r.ok) this.anotarError(r.tipo === 'error' ? r.codigo : 'sin-red', r.mensaje);
    return r.ok;
  }

  async entrar(token: string): Promise<boolean> {
    const r = await this.dep.api.entrar(token);
    if (!r.ok) {
      this.anotarError(r.tipo === 'error' ? r.codigo : 'sin-red', r.mensaje);
      return false;
    }
    this.cambiar({ cuenta: r.datos.cuenta });
    return true;
  }

  /** Mira si hay sesion abierta (la cookie la guarda el navegador). */
  async cargarCuenta(): Promise<void> {
    const r = await this.dep.api.cuenta();
    this.cambiar({
      cuenta: r.ok ? r.datos.cuenta : null,
      conexion: r.ok || r.tipo === 'error' ? 'conectado' : 'sin-conexion',
    });
  }

  // ---------------------------------------------------------------- partida

  /** Abre una partida: su vista del servidor o, sin red, la ultima guardada y marcada como vieja. */
  async abrirPartida(id: string): Promise<void> {
    const guardadas = this.dep.guardado.leer(claveDePendientes(id));
    const pendientes = leerPendientes(guardadas);
    const r = await this.dep.api.estado(id);
    if (r.ok) {
      const atlas = await this.dep.api.atlas(id);
      const partida: PartidaAbierta = {
        id,
        recibido: r.datos,
        atlas: atlas.ok ? atlas.datos.atlas : null,
        recibidaEn: this.dep.ahora(),
        desactualizada: false,
      };
      this.dep.guardado.escribir(
        claveDeVista(id),
        JSON.stringify({ recibido: r.datos, atlas: partida.atlas, recibidaEn: partida.recibidaEn }),
      );
      this.cambiar({ partida, pendientes, conexion: 'conectado', turnoNuevo: null });
      return;
    }
    if (r.tipo === 'error') {
      this.anotarError(r.codigo, r.mensaje);
      this.cambiar({ pendientes });
      return;
    }
    const vieja = this.dep.guardado.leer(claveDeVista(id));
    if (vieja !== null) {
      // La copia la escribio este mismo cliente con lo que dio el servidor (ver `api.ts`).
      const { recibido, atlas, recibidaEn } = JSON.parse(vieja) as {
        recibido: EstadoRecibido;
        atlas: AtlasDeJugador | null;
        recibidaEn: number;
      };
      this.cambiar({
        partida: { id, recibido, atlas, recibidaEn, desactualizada: true },
        pendientes,
        conexion: 'sin-conexion',
      });
    } else {
      this.cambiar({ pendientes, conexion: 'sin-conexion' });
      this.anotarError(
        'sin-red',
        'No hay conexion y no hay ninguna copia guardada de esta partida.',
      );
    }
  }

  private guardarPendientes(pendientes: readonly IntencionLocal[]): void {
    const partida = this.estadoActual.partida;
    if (partida === null) return;
    this.dep.guardado.escribir(claveDePendientes(partida.id), JSON.stringify(pendientes));
    this.cambiar({ pendientes });
  }

  /** Anyade una intencion a la bandeja: se guarda antes de mandarla y se intenta mandar. */
  async anyadir(intencion: Readonly<Record<string, unknown>>): Promise<string> {
    const idCliente = this.dep.nuevaClave();
    this.guardarPendientes([
      ...this.estadoActual.pendientes,
      { idCliente, intencion: { ...intencion, idCliente }, error: null },
    ]);
    await this.sincronizar();
    return idCliente;
  }

  quitar(idCliente: string): void {
    this.guardarPendientes(this.estadoActual.pendientes.filter((p) => p.idCliente !== idCliente));
  }

  /**
   * Manda lo que quede en la bandeja. Lo que el servidor acepta (o ya tenia: la clave hace idempotente
   * el reenvio) sale; lo que rechaza se queda con su error; sin red, todo se queda para la proxima.
   */
  async sincronizar(): Promise<void> {
    const partida = this.estadoActual.partida;
    if (partida === null) return;
    for (const pendiente of this.estadoActual.pendientes) {
      if (pendiente.error !== null) continue;
      const r = await this.dep.api.darOrden(partida.id, pendiente.intencion);
      const actuales = this.estadoActual.pendientes;
      if (r.ok) {
        this.guardarPendientes(actuales.filter((p) => p.idCliente !== pendiente.idCliente));
        continue;
      }
      if (r.tipo === 'sin-red') {
        this.cambiar({ conexion: 'sin-conexion' });
        return;
      }
      this.cambiar({ conexion: 'conectado' });
      // Un turno cerrado no es culpa de la orden: se conserva y se reenvia al recargar.
      if (r.codigo === 'turno-cerrado') continue;
      this.guardarPendientes(
        actuales.map((p) =>
          p.idCliente === pendiente.idCliente
            ? { ...p, error: { codigo: r.codigo, mensaje: r.mensaje } }
            : p,
        ),
      );
    }
    this.cambiar({ conexion: 'conectado' });
    await this.cargarEnviadas();
  }

  /** Trae del servidor las ordenes enviadas y aun sin resolver. */
  async cargarEnviadas(): Promise<void> {
    const partida = this.estadoActual.partida;
    if (partida === null) return;
    const r = await this.dep.api.ordenesPendientes(partida.id);
    if (r.ok) this.cambiar({ enviadas: r.datos.ordenes });
  }

  /** Retira una orden enviada antes del corte. */
  async retirar(orden: string): Promise<void> {
    const partida = this.estadoActual.partida;
    if (partida === null) return;
    const r = await this.dep.api.retirarOrden(partida.id, orden);
    if (!r.ok) this.anotarError(r.tipo === 'error' ? r.codigo : 'sin-red', r.mensaje);
    await this.cargarEnviadas();
  }

  /** La ficha de una comarca de la partida abierta, o null si no se pudo traer. */
  async pedirFicha(comarca: string): Promise<FichaDeComarca | null> {
    const partida = this.estadoActual.partida;
    if (partida === null) return null;
    const r = await this.dep.api.ficha(partida.id, comarca);
    if (!r.ok) {
      this.anotarError(r.tipo === 'error' ? r.codigo : 'sin-red', r.mensaje);
      return null;
    }
    return r.datos.ficha;
  }

  abrirComarca(comarca: string | null): void {
    this.cambiar({ comarcaAbierta: comarca });
  }

  /** Solo partidas de prueba: resuelve el turno ya y trae el nuevo (J-01). */
  async avanzar(): Promise<void> {
    const partida = this.estadoActual.partida;
    if (partida === null) return;
    const r = await this.dep.api.avanzar(partida.id);
    if (!r.ok) {
      this.anotarError(r.tipo === 'error' ? r.codigo : 'sin-red', r.mensaje);
      return;
    }
    await this.recargar();
  }

  /** Llego un turno nuevo: se avisa, no se cambia la pantalla (ficha T-080 §4.4). */
  alTurnoResuelto(turno: number): void {
    if (this.estadoActual.partida === null) return;
    this.cambiar({ turnoNuevo: turno });
  }

  /** El jugador pide ver el turno nuevo. */
  async recargar(): Promise<void> {
    const partida = this.estadoActual.partida;
    if (partida === null) return;
    await this.abrirPartida(partida.id);
    await this.sincronizar();
    await this.cargarEnviadas();
  }
}
