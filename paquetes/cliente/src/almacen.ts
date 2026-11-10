// El estado del cliente y sus acciones (ficha T-080 §4.2 a §4.5). Las pantallas solo leen y llaman
// acciones; nada de aqui toca el DOM.
import type {
  AtlasDeJugador,
  ClasificacionPublica,
  Cronica,
  FichaDeComarca,
  TablasDeReglas,
} from '@conquer/nucleo';

import type {
  ClienteApi,
  CuentaDelCliente,
  EstadoRecibido,
  MercadoRecibido,
  ModoDeAviso,
  OrdenEnviada,
  TurnoDelHistorial,
} from './api.ts';
import type { EditorDeRuta, UnidadEditada } from './editor-de-ruta.ts';
import { conPrevision, editorDe, intencionesDe, tocar } from './editor-de-ruta.ts';
import type { Guardado } from './guardado.ts';
import { alDia, leerProgreso, saltar, siguiente } from './tutorial.ts';
import type { ProgresoDelTutorial, SituacionDelTutorial } from './tutorial.ts';
import { preverBandeja } from './prevision.ts';
import { resumirTurno } from './resumen.ts';
import type { ResumenDeTurno } from './resumen.ts';
import type { PrevisionDeBandeja } from './prevision.ts';

/** Lo que responde una accion de cuenta: si fue bien y que decirle al jugador. */
export interface Resultado {
  readonly ok: boolean;
  readonly mensaje: string;
}

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
  /** Lo que ha pasado en el ultimo turno resuelto, hasta que el jugador lo cierra (T-088). */
  readonly resumen: ResumenDeTurno | null;
  /** Si el resumen esta a la vista; al cerrarlo se sigue usando en la bandeja. */
  readonly resumenAbierto: boolean;
  readonly errores: readonly { readonly codigo: string; readonly mensaje: string }[];
  /** El editor de ruta abierto (T-083): mientras lo esta, tocar el mapa anyade paradas. */
  readonly editor: EditorDeRuta | null;
  /** El mercado abierto en el panel (T-084), con la plaza que se mira, o null si esta cerrado. */
  readonly mercado: { readonly plaza: string | null } | null;
  /** El tutorial de las primeras acciones de la partida abierta (T-090). */
  readonly tutorial: ProgresoDelTutorial | null;
  /** «Tu casa» abierta en el panel (T-089). */
  readonly casa: boolean;
  /** La ayuda abierta en el panel (T-090). */
  readonly ayuda: boolean;
  /** La cronica abierta en el panel (T-085): el turno del archivo o la clasificacion. */
  readonly cronica: { readonly turno: number; readonly vista: 'cronica' | 'clasificacion' } | null;
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
  resumen: null,
  resumenAbierto: false,
  errores: [],
  editor: null,
  mercado: null,
  cronica: null,
  casa: false,
  ayuda: false,
  tutorial: null,
};

function claveDeVista(partida: string): string {
  return `conquer:vista:${partida}`;
}

function claveDePendientes(partida: string): string {
  return `conquer:pendientes:${partida}`;
}

/** La bandeja guardada, leida con cuidado: si algo no tiene forma, se descarta esa entrada. */
/**
 * Una clave de orden que ordena por el instante en que se crea. El servidor da de alta las ordenes
 * por su identificador, que lleva la clave, y ese es su puesto en una cola: las que se dan despues
 * van detras (T-083).
 */
export function claveOrdenada(instante: number, azar: string): string {
  return `${Math.max(0, Math.floor(instante)).toString(36).padStart(9, '0')}${azar.replaceAll('-', '').slice(0, 12)}`;
}

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

  /** Un error a la vista; el mismo dos veces no se repite en pantalla (T-090), y se guardan 3. */
  private anotarError(codigo: string, mensaje: string): void {
    const otros = this.estadoActual.errores.filter((e) => e.mensaje !== mensaje);
    this.cambiar({ errores: [...otros, { codigo, mensaje }].slice(-3) });
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

  // ——— Contrasenyas (T-091): cada una devuelve el mensaje para la pantalla ———

  /** Lo que dice una respuesta: el mensaje del servidor, o el de no tener red. */
  private mensajeDe(r: { ok: false; mensaje: string }): string {
    return r.mensaje;
  }

  async registrar(correo: string, nombre: string, clave: string): Promise<Resultado> {
    const r = await this.dep.api.registrar({ correo, nombre, clave });
    return r.ok
      ? { ok: true, mensaje: r.datos.mensaje }
      : { ok: false, mensaje: this.mensajeDe(r) };
  }

  async entrarConClave(correo: string, clave: string, recordar: boolean): Promise<Resultado> {
    const r = await this.dep.api.entrarConClave({ correo, clave, recordar });
    if (!r.ok) return { ok: false, mensaje: this.mensajeDe(r) };
    this.cambiar({ cuenta: r.datos.cuenta, errores: [] });
    return { ok: true, mensaje: '' };
  }

  async olvido(correo: string): Promise<Resultado> {
    const r = await this.dep.api.olvido(correo);
    return r.ok
      ? { ok: true, mensaje: r.datos.mensaje }
      : { ok: false, mensaje: this.mensajeDe(r) };
  }

  async restablecer(token: string, clave: string): Promise<Resultado> {
    const r = await this.dep.api.restablecer(token, clave);
    if (!r.ok) return { ok: false, mensaje: this.mensajeDe(r) };
    this.cambiar({ cuenta: r.datos.cuenta, errores: [] });
    return { ok: true, mensaje: '' };
  }

  /** Cierra la sesion de este navegador y vuelve a la portada. */
  async salir(): Promise<void> {
    await this.dep.api.salir();
    this.cambiar({ cuenta: null, partida: null });
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
      const tutorial = leerProgreso(
        this.dep.guardado.leer(`conquer:tutorial:${id}`),
        r.datos.vista.turno,
      );
      // Las de otra partida no valen aqui; las dadas este turno se traen siempre al abrir (T-092: al
      // recargar no salian, y el jugador volvia a darlas).
      this.cambiar({
        partida,
        pendientes,
        enviadas: [],
        conexion: 'conectado',
        turnoNuevo: null,
        tutorial,
      });
      await this.cargarEnviadas();
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

  /**
   * Varias intenciones que van juntas (una mision, una ruta con su carga), en este orden: comparten
   * clave con un sufijo creciente, asi entran en la cola de la recua en el orden en que se dieron.
   */
  async anyadirVarias(intenciones: readonly Readonly<Record<string, unknown>>[]): Promise<void> {
    const clave = this.dep.nuevaClave();
    const nuevas = intenciones.map((intencion, i) => {
      const idCliente = `${clave}-${String(i).padStart(2, '0')}`;
      return { idCliente, intencion: { ...intencion, idCliente }, error: null };
    });
    this.guardarPendientes([...this.estadoActual.pendientes, ...nuevas]);
    await this.sincronizar();
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
    this.cambiar(
      comarca === null ? { comarcaAbierta: null } : { comarcaAbierta: comarca, mercado: null },
    );
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
    const antes = partida.recibido.vista;
    await this.abrirPartida(partida.id);
    await this.sincronizar();
    await this.cargarEnviadas();
    const ahora = this.estadoActual.partida;
    if (ahora === null || ahora.desactualizada || ahora.recibido.vista.turno <= antes.turno) return;
    // Las cronicas de los turnos resueltos entre medias: normalmente uno.
    const cronicas = [];
    for (let turno = antes.turno; turno < ahora.recibido.vista.turno; turno += 1) {
      const r = await this.dep.api.cronica(partida.id, turno);
      if (r.ok) cronicas.push(r.datos.cronica);
    }
    this.cambiar({
      resumen: resumirTurno(antes, ahora.recibido.vista, cronicas),
      resumenAbierto: true,
    });
  }

  // ——— El tutorial (T-090 §2.6) ———————————————————————————————————————————————

  private guardarTutorial(progreso: ProgresoDelTutorial): void {
    const partida = this.estadoActual.partida;
    if (partida === null) return;
    this.dep.guardado.escribir(`conquer:tutorial:${partida.id}`, JSON.stringify(progreso));
    this.cambiar({ tutorial: progreso });
  }

  /** Avanza los pasos que el jugador ya ha hecho; solo cambia algo si hay que avanzar. */
  tutorialAlDia(situacion: SituacionDelTutorial): void {
    const actual = this.estadoActual.tutorial;
    if (actual === null) return;
    const nuevo = alDia(actual, situacion);
    if (nuevo !== actual) this.guardarTutorial(nuevo);
  }

  tutorialSiguiente(): void {
    const actual = this.estadoActual.tutorial;
    if (actual !== null) this.guardarTutorial(siguiente(actual));
  }

  saltarTutorial(): void {
    const actual = this.estadoActual.tutorial;
    if (actual !== null) this.guardarTutorial(saltar(actual));
  }

  // ——— Tu casa (T-089 §4.3) ———————————————————————————————————————————————————

  abrirCasa(): void {
    this.cambiar({
      casa: true,
      ayuda: false,
      comarcaAbierta: null,
      editor: null,
      mercado: null,
      cronica: null,
    });
  }

  abrirAyuda(): void {
    this.cambiar({
      ayuda: true,
      casa: false,
      comarcaAbierta: null,
      editor: null,
      mercado: null,
      cronica: null,
    });
  }

  cerrarAyuda(): void {
    this.cambiar({ ayuda: false });
  }

  cerrarCasa(): void {
    this.cambiar({ casa: false, ayuda: false });
  }

  // ——— La cronica y la clasificacion (T-085 §4.3) ————————————————————————————————

  /** Abre el archivo en un turno (por defecto, el ultimo resuelto) o la clasificacion. */
  abrirCronica(turno: number | null = null, vista: 'cronica' | 'clasificacion' = 'cronica'): void {
    const partida = this.estadoActual.partida;
    if (partida === null) return;
    const elegido = turno ?? Math.max(1, partida.recibido.vista.turno - 1);
    this.cambiar({
      cronica: { turno: elegido, vista },
      comarcaAbierta: null,
      editor: null,
      mercado: null,
      casa: false,
      ayuda: false,
    });
  }

  cerrarCronica(): void {
    this.cambiar({ cronica: null });
  }

  async pedirCronica(turno: number): Promise<Cronica | null> {
    const partida = this.estadoActual.partida;
    if (partida === null) return null;
    const r = await this.dep.api.cronica(partida.id, turno);
    if (!r.ok) {
      this.anotarError(r.tipo === 'error' ? r.codigo : 'sin-red', r.mensaje);
      return null;
    }
    return r.datos.cronica;
  }

  async pedirClasificacion(): Promise<ClasificacionPublica | null> {
    const partida = this.estadoActual.partida;
    if (partida === null) return null;
    const r = await this.dep.api.clasificacion(partida.id);
    if (!r.ok) {
      this.anotarError(r.tipo === 'error' ? r.codigo : 'sin-red', r.mensaje);
      return null;
    }
    return r.datos.publica;
  }

  // ——— El mercado (T-084 §4.3) —————————————————————————————————————————————————

  /** Abre el mercado en el panel (en una plaza, si se dice); cierra la ficha y el editor. */
  abrirMercado(plaza: string | null = null): void {
    this.cambiar({
      mercado: { plaza },
      comarcaAbierta: null,
      editor: null,
      cronica: null,
      casa: false,
      ayuda: false,
    });
  }

  cerrarMercado(): void {
    this.cambiar({ mercado: null });
  }

  /** El historico de recursos de la partida abierta (T-090), o null si no se pudo traer. */
  async pedirHistorial(): Promise<readonly TurnoDelHistorial[] | null> {
    const partida = this.estadoActual.partida;
    if (partida === null) return null;
    const r = await this.dep.api.historialDeRecursos(partida.id);
    if (!r.ok) {
      this.anotarError(r.tipo === 'error' ? r.codigo : 'sin-red', r.mensaje);
      return null;
    }
    return r.datos.turnos;
  }

  /** Los avisos por correo de la partida abierta (T-066), o null si no se pudo traer. */
  async pedirAvisos(): Promise<ModoDeAviso | null> {
    const partida = this.estadoActual.partida;
    if (partida === null) return null;
    const r = await this.dep.api.avisos(partida.id);
    if (!r.ok) {
      this.anotarError(r.tipo === 'error' ? r.codigo : 'sin-red', r.mensaje);
      return null;
    }
    return r.datos.modo;
  }

  /** Cambia los avisos por correo de la partida abierta; true si el servidor lo guardo. */
  async fijarAvisos(modo: ModoDeAviso): Promise<boolean> {
    const partida = this.estadoActual.partida;
    if (partida === null) return false;
    const r = await this.dep.api.fijarAvisos(partida.id, modo);
    if (!r.ok) this.anotarError(r.tipo === 'error' ? r.codigo : 'sin-red', r.mensaje);
    return r.ok;
  }

  /** El panel de mercado y las series de la partida abierta, o null si no se pudo traer. */
  async pedirMercado(): Promise<MercadoRecibido | null> {
    const partida = this.estadoActual.partida;
    if (partida === null) return null;
    const r = await this.dep.api.mercado(partida.id);
    if (!r.ok) {
      this.anotarError(r.tipo === 'error' ? r.codigo : 'sin-red', r.mensaje);
      return null;
    }
    return r.datos;
  }

  // ——— El editor de ruta (T-083 §4.5) ————————————————————————————————————————

  /** Abre el editor de una recua o un rebanyo propios; cierra la ficha que hubiera abierta. */
  abrirEditor(unidad: UnidadEditada): void {
    const vista = this.estadoActual.partida?.recibido.vista;
    if (vista === undefined) return;
    const recua =
      unidad.clase === 'recua' ? (vista.recuas.find((r) => r.id === unidad.id) ?? null) : null;
    this.cambiar({
      editor: editorDe(unidad, recua),
      comarcaAbierta: null,
      resumenAbierto: false,
      mercado: null,
      cronica: null,
      casa: false,
      ayuda: false,
    });
    void this.preverRuta();
  }

  /**
   * «Mandar una recua aqui» (T-090): abre el editor de la recua mas a mano —quieta en casa y sin ruta,
   * si la hay— con `comarca` ya puesta de parada. Devuelve false si no hay ninguna recua.
   */
  mandarRecuaA(comarca: string): boolean {
    const vista = this.estadoActual.partida?.recibido.vista;
    if (vista === undefined) return false;
    const enCasa = vista.recuas.find(
      (r) =>
        r.situacion.donde === 'comarca' &&
        r.ruta.length === 0 &&
        vista.comarcas[r.situacion.comarca]?.nivel === 'propia',
    );
    const recua = enCasa ?? vista.recuas[0];
    if (recua === undefined) return false;
    this.abrirEditor({ clase: 'recua', id: recua.id });
    this.editar((e) => tocar(e, comarca));
    return true;
  }

  cerrarEditor(): void {
    this.cambiar({ editor: null });
  }

  /** Aplica un cambio al editor y, si cambia la ruta, pide la prevision nueva. */
  editar(cambio: (e: EditorDeRuta) => EditorDeRuta): void {
    const editor = this.estadoActual.editor;
    if (editor === null) return;
    const nuevo = cambio(editor);
    this.cambiar({ editor: nuevo });
    if (nuevo.version !== editor.version) void this.preverRuta();
  }

  private async preverRuta(): Promise<void> {
    const partida = this.estadoActual.partida;
    const editor = this.estadoActual.editor;
    if (partida === null || editor === null || editor.paradas.length === 0) return;
    const r = await this.dep.api.previsionDeRuta(partida.id, {
      [editor.unidad.clase]: editor.unidad.id,
      paradas: editor.paradas,
      circular: editor.circular,
    });
    if (!r.ok) {
      this.anotarError(r.tipo === 'error' ? r.codigo : 'sin-red', r.mensaje);
      return;
    }
    const actual = this.estadoActual.editor;
    if (actual !== null)
      this.cambiar({ editor: conPrevision(actual, editor.version, r.datos.prevision) });
  }

  /** Da la ruta del editor (con su carga, si hace falta) y lo cierra. */
  async confirmarEditor(): Promise<void> {
    const editor = this.estadoActual.editor;
    const vista = this.estadoActual.partida?.recibido.vista;
    if (editor === null || vista === undefined) return;
    const recua = vista.recuas.find((r) => r.id === editor.unidad.id);
    const donde = recua?.situacion.donde === 'comarca' ? recua.situacion.comarca : null;
    const enCasa = donde !== null && vista.comarcas[donde]?.nivel === 'propia';
    const intenciones = intencionesDe(editor, enCasa);
    if (intenciones.length === 0) return;
    this.cambiar({ editor: null });
    await this.anyadirVarias(intenciones);
  }

  abrirResumen(): void {
    if (this.estadoActual.resumen !== null) this.cambiar({ resumenAbierto: true });
  }

  cerrarResumen(): void {
    this.cambiar({ resumenAbierto: false });
  }
}
