/* eslint-disable @typescript-eslint/require-await -- la interfaz es asincrona (Postgres lo sera); SQLite no */
// RepositorioSqlite: la unica clase que sabe SQL (ficha T-060). Usa `node:sqlite`, que viene con
// Node 22 y es experimental: si algun dia cambia, se cambia esta clase y nada mas.
import { gzipSync } from 'node:zlib';
import { DatabaseSync } from 'node:sqlite';
import type { SQLInputValue } from 'node:sqlite';

import { canonico, explicar, huella, validarOrdenEntrante } from '@conquer/nucleo';
import type { Cronica, EstadoPartida, IdJugador, IdOrden, IdPartida, Orden } from '@conquer/nucleo';

import { codificarEstado, decodificarEstado } from './codec.ts';
import { ErrorDePersistencia } from './errores.ts';
import { validarCronica } from './validarCronica.ts';
import { MIGRACIONES, comprobarMigraciones } from './migraciones/index.ts';
import type { Migracion } from './migraciones/index.ts';
import { MODOS_DE_AVISO } from './avisos.ts';
import type {
  Convocatoria,
  ConvocatoriaNueva,
  PlazaDeConvocatoria,
  RechazoDePlaza,
  RepositorioDeConvocatorias,
} from './convocatorias.ts';
import { ESTADOS_DE_CONVOCATORIA } from './convocatorias.ts';
import type { AvisoPendiente, ClaveDeAviso, ModoDeAviso, RepositorioDeAvisos } from './avisos.ts';
import type {
  Cuenta,
  EnlaceNuevo,
  RepositorioDeCuentas,
  SesionGuardada,
  SesionNueva,
} from './cuentas.ts';
import type {
  AuditoriaDeResolucion,
  EstadoDeOrdenGuardada,
  FilaDePartida,
  NuevaPartida,
  OpcionesDeLectura,
  OrdenGuardada,
  Participante,
  PartidaDeCuenta,
  Repositorio,
  ResolucionDeTurno,
} from './repositorio.ts';

type Fila = Record<string, unknown>;

function texto(fila: Fila, columna: string): string {
  const valor = fila[columna];
  if (typeof valor !== 'string') throw new Error(`La columna ${columna} no es texto.`);
  return valor;
}

function textoONulo(fila: Fila, columna: string): string | null {
  const valor = fila[columna];
  return valor === null || valor === undefined ? null : texto(fila, columna);
}

function entero(fila: Fila, columna: string): number {
  const valor = fila[columna];
  if (typeof valor !== 'number') throw new Error(`La columna ${columna} no es un entero.`);
  return valor;
}

function enteroONulo(fila: Fila, columna: string): number | null {
  const valor = fila[columna];
  return valor === null || valor === undefined ? null : entero(fila, columna);
}

function bytes(fila: Fila, columna: string): Uint8Array {
  const valor = fila[columna];
  if (!(valor instanceof Uint8Array)) throw new Error(`La columna ${columna} no son bytes.`);
  return valor;
}

function filaDePartida(fila: Fila): FilaDePartida {
  const estado = texto(fila, 'estado');
  if (estado !== 'activa' && estado !== 'detenida' && estado !== 'terminada') {
    throw new Error(`Estado de partida desconocido en la base: "${estado}".`);
  }
  return {
    id: texto(fila, 'id') as IdPartida,
    nombre: texto(fila, 'nombre'),
    semilla: texto(fila, 'semilla'),
    versionReglas: entero(fila, 'version_reglas'),
    huellaMundo: texto(fila, 'huella_mundo'),
    intervaloSegundos: entero(fila, 'intervalo_segundos'),
    ancla: entero(fila, 'ancla'),
    turnoActual: entero(fila, 'turno_actual'),
    proximaResolucion: enteroONulo(fila, 'proxima_resolucion'),
    estado,
    motivoDetencion: textoONulo(fila, 'motivo_detencion'),
    esDePrueba: entero(fila, 'de_prueba') === 1,
    creadaEn: entero(fila, 'creada_en'),
  };
}

const ESTADOS_DE_ORDEN = ['pendiente', 'aplicada', 'cancelada', 'rechazada'] as const;

function estadoDeOrden(valor: string): EstadoDeOrdenGuardada {
  const encontrado = ESTADOS_DE_ORDEN.find((e) => e === valor);
  if (encontrado === undefined)
    throw new Error(`Estado de orden desconocido en la base: "${valor}".`);
  return encontrado;
}

export class RepositorioSqlite
  implements Repositorio, RepositorioDeCuentas, RepositorioDeAvisos, RepositorioDeConvocatorias
{
  private readonly bd: DatabaseSync;

  /** `ruta` es un fichero, o `':memory:'` para las pruebas. */
  constructor(
    ruta: string,
    private readonly migraciones: readonly Migracion[] = MIGRACIONES,
  ) {
    comprobarMigraciones(migraciones);
    this.bd = new DatabaseSync(ruta);
    this.bd.exec('PRAGMA foreign_keys = ON');
    this.bd.exec('PRAGMA busy_timeout = 5000');
    if (ruta !== ':memory:') this.bd.exec('PRAGMA journal_mode = WAL');
  }

  // ---------------------------------------------------------------- utilidades internas

  private uno(sql: string, ...parametros: SQLInputValue[]): Fila | null {
    const fila = this.bd.prepare(sql).get(...parametros);
    return fila === undefined ? null : fila;
  }

  private todos(sql: string, ...parametros: SQLInputValue[]): Fila[] {
    return this.bd.prepare(sql).all(...parametros);
  }

  private ejecutar(sql: string, ...parametros: SQLInputValue[]): number {
    return Number(this.bd.prepare(sql).run(...parametros).changes);
  }

  /** Todo o nada: si `hacer` lanza, no queda nada escrito. */
  private transaccion<T>(hacer: () => T): T {
    this.bd.exec('BEGIN IMMEDIATE');
    try {
      const resultado = hacer();
      this.bd.exec('COMMIT');
      return resultado;
    } catch (error) {
      this.bd.exec('ROLLBACK');
      throw error;
    }
  }

  private existeLaTabla(nombre: string): boolean {
    return (
      this.uno("SELECT 1 AS hay FROM sqlite_master WHERE type = 'table' AND name = ?", nombre) !==
      null
    );
  }

  // ---------------------------------------------------------------- migraciones

  versionDelEsquemaSync(): number {
    if (!this.existeLaTabla('migracion')) return 0;
    const fila = this.uno('SELECT COALESCE(MAX(version), 0) AS version FROM migracion');
    return fila === null ? 0 : entero(fila, 'version');
  }

  async versionDelEsquema(): Promise<number> {
    return this.versionDelEsquemaSync();
  }

  async migrar(ahora: number): Promise<number> {
    const actual = this.versionDelEsquemaSync();
    if (actual > this.migraciones.length) {
      throw new ErrorDePersistencia(
        'esquema-desactualizado',
        `La base esta en la version ${String(actual)} del esquema y este servidor solo conoce hasta la ${String(this.migraciones.length)}: actualiza el servidor, no la base.`,
        { base: actual, servidor: this.migraciones.length },
      );
    }
    for (const migracion of this.migraciones.slice(actual)) this.aplicar(migracion, ahora);
    return this.versionDelEsquemaSync();
  }

  private aplicar(migracion: Migracion, ahora: number): void {
    try {
      this.transaccion(() => {
        this.bd.exec(
          'CREATE TABLE IF NOT EXISTS migracion (version INTEGER PRIMARY KEY, nombre TEXT NOT NULL, aplicada_en INTEGER NOT NULL) STRICT',
        );
        for (const sentencia of migracion.subir) this.bd.exec(sentencia);
        this.ejecutar(
          'INSERT INTO migracion (version, nombre, aplicada_en) VALUES (?, ?, ?)',
          migracion.version,
          migracion.nombre,
          ahora,
        );
      });
    } catch (causa) {
      throw new ErrorDePersistencia(
        'migracion-fallida',
        `La migracion ${String(migracion.version)} ("${migracion.nombre}") ha fallado y se ha deshecho: ${
          causa instanceof Error ? causa.message : 'error desconocido'
        }.`,
        { version: migracion.version },
      );
    }
  }

  /** Deshace la ultima migracion aplicada (solo para pruebas y operacion manual). */
  revertirUna(): number {
    const actual = this.versionDelEsquemaSync();
    const migracion = this.migraciones[actual - 1];
    if (actual === 0 || migracion === undefined) return 0;
    this.transaccion(() => {
      for (const sentencia of migracion.bajar) this.bd.exec(sentencia);
      if (actual > 1) this.ejecutar('DELETE FROM migracion WHERE version = ?', actual);
    });
    if (actual === 1) this.bd.exec('DROP TABLE migracion');
    return this.versionDelEsquemaSync();
  }

  // ---------------------------------------------------------------- partidas

  async crearPartida(
    datos: NuevaPartida,
    estadoInicial: EstadoPartida,
    ahora: number,
  ): Promise<void> {
    if (this.uno('SELECT 1 AS hay FROM partida WHERE id = ?', datos.id) !== null) {
      throw new ErrorDePersistencia(
        'partida-duplicada',
        `Ya existe una partida "${datos.id}": elige otro identificador.`,
        { partida: datos.id },
      );
    }
    this.transaccion(() => {
      this.ejecutar(
        `INSERT INTO partida (id, nombre, semilla, version_reglas, huella_mundo, intervalo_segundos,
           ancla, turno_actual, proxima_resolucion, estado, de_prueba, creada_en)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'activa', ?, ?)`,
        datos.id,
        datos.nombre,
        datos.semilla,
        datos.versionReglas,
        datos.huellaMundo,
        datos.intervaloSegundos,
        datos.ancla,
        estadoInicial.turno,
        datos.proximaResolucion,
        datos.esDePrueba ? 1 : 0,
        ahora,
      );
      for (const p of datos.participantes) {
        this.ejecutar(
          'INSERT INTO participante (partida, jugador, casa, cuenta) VALUES (?, ?, ?, ?)',
          datos.id,
          p.jugador,
          p.casa,
          p.cuenta,
        );
      }
      this.escribirEstado(datos.id, estadoInicial, ahora);
    });
    return;
  }

  private escribirEstado(partida: string, estado: EstadoPartida, ahora: number): void {
    const codificado = codificarEstado(estado);
    this.ejecutar(
      `INSERT INTO estado_turno (partida, turno, huella, huella_turno_anterior, contenido,
         bytes_sin_comprimir, guardado_en) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      partida,
      estado.turno,
      codificado.huella,
      estado.huellaTurnoAnterior,
      codificado.contenido,
      codificado.bytesSinComprimir,
      ahora,
    );
  }

  async partida(id: IdPartida): Promise<FilaDePartida | null> {
    const fila = this.uno('SELECT * FROM partida WHERE id = ?', id);
    return fila === null ? null : filaDePartida(fila);
  }

  async partidasPorResolver(hasta: number, limite: number): Promise<readonly FilaDePartida[]> {
    const filas = this.todos(
      `SELECT * FROM partida WHERE estado = 'activa' AND proxima_resolucion IS NOT NULL
         AND proxima_resolucion <= ? ORDER BY proxima_resolucion, id LIMIT ?`,
      hasta,
      limite,
    );
    return filas.map(filaDePartida);
  }

  async detenerPartida(id: IdPartida, motivo: string): Promise<void> {
    const cambios = this.ejecutar(
      "UPDATE partida SET estado = 'detenida', proxima_resolucion = NULL, motivo_detencion = ? WHERE id = ?",
      motivo,
      id,
    );
    if (cambios === 0) throw this.desconocida(id);
    return;
  }

  async participantes(id: IdPartida): Promise<readonly Participante[]> {
    const filas = this.todos('SELECT * FROM participante WHERE partida = ? ORDER BY jugador', id);
    return filas.map((f) => ({
      jugador: texto(f, 'jugador') as IdJugador,
      casa: texto(f, 'casa'),
      cuenta: textoONulo(f, 'cuenta'),
    }));
  }

  async partidasDeCuenta(cuenta: string): Promise<readonly PartidaDeCuenta[]> {
    const filas = this.todos(
      `SELECT p.*, q.jugador AS jugador_de_la_cuenta, q.casa AS casa_de_la_cuenta
         FROM participante q JOIN partida p ON p.id = q.partida
        WHERE q.cuenta = ? ORDER BY p.creada_en, p.id`,
      cuenta,
    );
    return filas.map((f) => ({
      partida: filaDePartida(f),
      jugador: texto(f, 'jugador_de_la_cuenta') as IdJugador,
      casa: texto(f, 'casa_de_la_cuenta'),
    }));
  }

  private desconocida(id: string): ErrorDePersistencia {
    return new ErrorDePersistencia(
      'partida-desconocida',
      `No hay ninguna partida "${id}" en esta base.`,
      { partida: id },
    );
  }

  // ---------------------------------------------------------------- estados

  async estado(
    id: IdPartida,
    turno: number,
    opciones: OpcionesDeLectura = {},
  ): Promise<EstadoPartida | null> {
    const fila = this.uno('SELECT * FROM estado_turno WHERE partida = ? AND turno = ?', id, turno);
    return fila === null ? null : this.leerEstado(id, fila, opciones);
  }

  async ultimoEstado(
    id: IdPartida,
    opciones: OpcionesDeLectura = {},
  ): Promise<EstadoPartida | null> {
    const fila = this.uno(
      'SELECT * FROM estado_turno WHERE partida = ? ORDER BY turno DESC LIMIT 1',
      id,
    );
    return fila === null ? null : this.leerEstado(id, fila, opciones);
  }

  private leerEstado(id: string, fila: Fila, opciones: OpcionesDeLectura): EstadoPartida {
    return decodificarEstado(bytes(fila, 'contenido'), {
      partida: id,
      turno: entero(fila, 'turno'),
      huellaEsperada: texto(fila, 'huella'),
      mundo: opciones.mundo,
    });
  }

  // ---------------------------------------------------------------- ordenes

  async guardarOrden(
    id: IdPartida,
    orden: Orden,
    ahora: number,
    turnoEsperado?: number,
  ): Promise<void> {
    this.transaccion(() => {
      const partida = this.uno('SELECT turno_actual FROM partida WHERE id = ?', id);
      if (partida === null) throw this.desconocida(id);
      const actual = entero(partida, 'turno_actual');
      if (turnoEsperado !== undefined && turnoEsperado !== actual) {
        throw new ErrorDePersistencia(
          'turno-cerrado',
          `La orden es del turno ${String(turnoEsperado)} y la partida "${id}" ya esta en el ${String(actual)}: ese turno se ha cerrado. Vuelve a leer el estado y da la orden de nuevo.`,
          { partida: id, esperado: turnoEsperado, actual },
        );
      }
      if (
        this.uno('SELECT 1 AS hay FROM orden WHERE partida = ? AND id = ?', id, orden.id) !== null
      ) {
        throw new ErrorDePersistencia(
          'orden-duplicada',
          `La orden "${orden.id}" ya esta guardada en la partida "${id}": cada orden tiene su identificador.`,
          { partida: id, orden: orden.id },
        );
      }
      this.ejecutar(
        `INSERT INTO orden (partida, id, jugador, turno_recibida, recibida_en, estado, contenido)
         VALUES (?, ?, ?, ?, ?, 'pendiente', ?)`,
        id,
        orden.id,
        orden.jugador,
        actual,
        ahora,
        canonico(orden),
      );
    });
  }

  async orden(id: IdPartida, orden: IdOrden): Promise<OrdenGuardada | null> {
    const fila = this.uno('SELECT * FROM orden WHERE partida = ? AND id = ?', id, orden);
    return fila === null ? null : this.ordenGuardada(fila);
  }

  async ordenesPendientes(id: IdPartida): Promise<readonly OrdenGuardada[]> {
    const filas = this.todos(
      "SELECT * FROM orden WHERE partida = ? AND estado = 'pendiente' ORDER BY turno_recibida, recibida_en, id",
      id,
    );
    return filas.map((f) => this.ordenGuardada(f));
  }

  private ordenGuardada(fila: Fila): OrdenGuardada {
    const resultado = validarOrdenEntrante(JSON.parse(texto(fila, 'contenido')));
    if (!resultado.ok) {
      throw new ErrorDePersistencia(
        'estado-invalido',
        `La orden "${texto(fila, 'id')}" guardada no valida:\n${explicar(resultado.errores)}`,
        { orden: texto(fila, 'id') },
      );
    }
    return {
      id: texto(fila, 'id') as IdOrden,
      jugador: texto(fila, 'jugador') as IdJugador,
      turnoRecibida: entero(fila, 'turno_recibida'),
      recibidaEn: entero(fila, 'recibida_en'),
      estado: estadoDeOrden(texto(fila, 'estado')),
      turnoAplicada: enteroONulo(fila, 'turno_aplicada'),
      motivo: textoONulo(fila, 'motivo'),
      orden: resultado.valor,
    };
  }

  async ordenesDelTurno(id: IdPartida, turno: number): Promise<readonly OrdenGuardada[]> {
    const filas = this.todos(
      "SELECT * FROM orden WHERE partida = ? AND estado = 'aplicada' AND turno_aplicada = ? ORDER BY turno_recibida, recibida_en, id",
      id,
      turno,
    );
    return filas.map((f) => this.ordenGuardada(f));
  }

  async proximaHora(): Promise<number | null> {
    const fila = this.uno(
      "SELECT MIN(proxima_resolucion) AS hora FROM partida WHERE estado = 'activa' AND proxima_resolucion IS NOT NULL",
    );
    return fila === null ? null : enteroONulo(fila, 'hora');
  }

  async cancelarOrden(id: IdPartida, orden: IdOrden, motivo: string): Promise<boolean> {
    const cambios = this.ejecutar(
      "UPDATE orden SET estado = 'cancelada', motivo = ? WHERE partida = ? AND id = ? AND estado = 'pendiente'",
      motivo,
      id,
      orden,
    );
    return cambios > 0;
  }

  // ---------------------------------------------------------------- cronicas y auditoria

  async cronica(id: IdPartida, turno: number, jugador: IdJugador): Promise<Cronica | null> {
    const fila = this.uno(
      'SELECT contenido FROM cronica WHERE partida = ? AND turno = ? AND jugador = ?',
      id,
      turno,
      jugador,
    );
    if (fila === null) return null;
    const resultado = validarCronica(JSON.parse(texto(fila, 'contenido')));
    if (!resultado.ok) {
      throw new ErrorDePersistencia(
        'estado-invalido',
        `La cronica del turno ${String(turno)} de "${jugador}" en la partida "${id}" no valida:\n${explicar(resultado.errores)}`,
        { partida: id, turno },
      );
    }
    return resultado.valor;
  }

  async auditoria(id: IdPartida, turno: number): Promise<AuditoriaDeResolucion | null> {
    const f = this.uno(
      'SELECT * FROM auditoria_resolucion WHERE partida = ? AND turno = ?',
      id,
      turno,
    );
    if (f === null) return null;
    return {
      turno: entero(f, 'turno'),
      huellaEntrada: texto(f, 'huella_entrada'),
      huellaSalida: texto(f, 'huella_salida'),
      huellaOrdenes: texto(f, 'huella_ordenes'),
      ordenes: entero(f, 'ordenes'),
      duracionMs: entero(f, 'duracion_ms'),
      versionReglas: entero(f, 'version_reglas'),
      versionNucleo: texto(f, 'version_nucleo'),
      resueltaEn: entero(f, 'resuelta_en'),
    };
  }

  // ---------------------------------------------------------------- la resolucion

  async guardarResolucion(r: ResolucionDeTurno, ahora: number): Promise<void> {
    this.transaccion(() => {
      const partida = this.uno('SELECT turno_actual, estado FROM partida WHERE id = ?', r.partida);
      if (partida === null) throw this.desconocida(r.partida);
      const actual = entero(partida, 'turno_actual');
      if (actual !== r.turnoResuelto) {
        throw new ErrorDePersistencia(
          'conflicto-de-turno',
          `La partida "${r.partida}" esta en el turno ${String(actual)} y se intenta guardar la resolucion del ${String(r.turnoResuelto)}: ya se resolvio (o se resolvio otro). No se ha escrito nada.`,
          { partida: r.partida, actual, intentado: r.turnoResuelto },
        );
      }
      if (r.estadoNuevo.turno !== r.turnoResuelto + 1) {
        throw new ErrorDePersistencia(
          'estado-invalido',
          `El estado nuevo es del turno ${String(r.estadoNuevo.turno)} y debia ser el ${String(r.turnoResuelto + 1)}.`,
          { partida: r.partida },
        );
      }
      const anterior = this.uno(
        'SELECT huella, huella_turno_anterior FROM estado_turno WHERE partida = ? AND turno = ?',
        r.partida,
        r.turnoResuelto,
      );
      if (anterior === null) {
        throw new ErrorDePersistencia(
          'estado-invalido',
          `No hay estado guardado del turno ${String(r.turnoResuelto)} de la partida "${r.partida}": no se puede encadenar el siguiente.`,
          { partida: r.partida, turno: r.turnoResuelto },
        );
      }
      this.comprobarEncadenado(r, textoONulo(anterior, 'huella_turno_anterior'));
      if (textoONulo(anterior, 'huella') !== r.auditoria.huellaEntrada) {
        throw new ErrorDePersistencia(
          'encadenado-roto',
          `La auditoria dice que el estado de entrada tenia la huella ${r.auditoria.huellaEntrada.slice(0, 12)}… y el guardado del turno ${String(r.turnoResuelto)} tiene otra: se resolvio a partir de un estado distinto del guardado.`,
          { partida: r.partida, turno: r.turnoResuelto },
        );
      }

      this.escribirEstado(r.partida, r.estadoNuevo, ahora);
      for (const [jugador, cronica] of Object.entries(r.cronicas)) {
        this.ejecutar(
          'INSERT INTO cronica (partida, turno, jugador, contenido) VALUES (?, ?, ?, ?)',
          r.partida,
          r.turnoResuelto,
          jugador,
          canonico(cronica),
        );
      }
      this.ejecutar(
        'INSERT INTO suceso_turno (partida, turno, contenido) VALUES (?, ?, ?)',
        r.partida,
        r.turnoResuelto,
        gzipSync(Buffer.from(canonico(r.sucesos), 'utf8'), { level: 6 }),
      );
      this.ejecutar(
        `INSERT INTO auditoria_resolucion (partida, turno, huella_entrada, huella_salida, huella_ordenes,
           ordenes, duracion_ms, version_reglas, version_nucleo, resuelta_en)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        r.partida,
        r.turnoResuelto,
        r.auditoria.huellaEntrada,
        r.auditoria.huellaSalida,
        r.auditoria.huellaOrdenes,
        r.auditoria.ordenes,
        r.auditoria.duracionMs,
        r.auditoria.versionReglas,
        r.auditoria.versionNucleo,
        ahora,
      );
      for (const id of r.ordenesAplicadas) {
        this.ejecutar(
          "UPDATE orden SET estado = 'aplicada', turno_aplicada = ? WHERE partida = ? AND id = ? AND estado = 'pendiente'",
          r.turnoResuelto,
          r.partida,
          id,
        );
      }
      for (const rechazada of r.ordenesRechazadas) {
        this.ejecutar(
          "UPDATE orden SET estado = 'rechazada', motivo = ? WHERE partida = ? AND id = ? AND estado = 'pendiente'",
          rechazada.motivo,
          r.partida,
          rechazada.id,
        );
      }
      // El aviso por correo se encola con la resolucion: si ella queda, el queda (T-064 §4.3).
      this.ejecutar(
        `INSERT INTO aviso_correo (partida, turno, jugador, cuenta, estado, creado_en, siguiente_intento)
         SELECT q.partida, ?, q.jugador, q.cuenta, 'pendiente', ?, ?
           FROM participante q JOIN cuenta c ON c.id = q.cuenta
          WHERE q.partida = ? AND c.borrada_en IS NULL`,
        r.turnoResuelto,
        ahora,
        ahora,
        r.partida,
      );
      this.ejecutar(
        'UPDATE partida SET turno_actual = ?, proxima_resolucion = ? WHERE id = ?',
        r.estadoNuevo.turno,
        r.proximaResolucion,
        r.partida,
      );
    });
    return;
  }

  /**
   * La firma del estado nuevo (`huellaTurnoAnterior`) es la huella de ese mismo estado con la firma
   * del turno anterior todavia puesta (`resolverTurno` la calcula asi): se recalcula y se compara.
   */
  private comprobarEncadenado(r: ResolucionDeTurno, firmaDeEntrada: string | null): void {
    const esperada = huella({ ...r.estadoNuevo, huellaTurnoAnterior: firmaDeEntrada });
    if (esperada !== r.estadoNuevo.huellaTurnoAnterior) {
      throw new ErrorDePersistencia(
        'encadenado-roto',
        `El estado nuevo del turno ${String(r.estadoNuevo.turno)} de la partida "${r.partida}" no encadena con el guardado del turno ${String(r.turnoResuelto)}: su firma no es la que sale de resolver ese estado. No se ha escrito nada.`,
        { partida: r.partida, turno: r.estadoNuevo.turno },
      );
    }
  }

  // ---------------------------------------------------------------- cuentas y sesiones (T-063)

  private filaDeCuenta(fila: Fila): Cuenta {
    return {
      id: texto(fila, 'id'),
      correo: texto(fila, 'correo'),
      nombre: texto(fila, 'nombre'),
      creadaEn: entero(fila, 'creada_en'),
      borradaEn: enteroONulo(fila, 'borrada_en'),
    };
  }

  async crearEnlace(enlace: EnlaceNuevo): Promise<void> {
    this.ejecutar(
      'INSERT INTO enlace_de_acceso (hash, correo, nombre, creado_en, expira_en) VALUES (?, ?, ?, ?, ?)',
      enlace.hash,
      enlace.correo,
      enlace.nombre,
      enlace.creadoEn,
      enlace.expiraEn,
    );
  }

  async consumirEnlace(
    hash: string,
    ahora: number,
  ): Promise<{ readonly correo: string; readonly nombre: string | null } | null> {
    return this.transaccion(() => {
      const cambios = this.ejecutar(
        'UPDATE enlace_de_acceso SET usado_en = ? WHERE hash = ? AND usado_en IS NULL AND expira_en > ?',
        ahora,
        hash,
        ahora,
      );
      if (cambios === 0) return null;
      const fila = this.uno('SELECT correo, nombre FROM enlace_de_acceso WHERE hash = ?', hash);
      return fila === null
        ? null
        : { correo: texto(fila, 'correo'), nombre: textoONulo(fila, 'nombre') };
    });
  }

  async enlacesPedidos(correo: string, desde: number): Promise<number> {
    const fila = this.uno(
      'SELECT COUNT(*) AS n FROM enlace_de_acceso WHERE correo = ? AND creado_en >= ?',
      correo,
      desde,
    );
    return fila === null ? 0 : entero(fila, 'n');
  }

  async cuentaDeCorreo(correo: string, id: string, nombre: string, ahora: number): Promise<Cuenta> {
    return this.transaccion(() => {
      const existente = this.uno('SELECT * FROM cuenta WHERE correo = ?', correo);
      if (existente !== null) return this.filaDeCuenta(existente);
      this.ejecutar(
        'INSERT INTO cuenta (id, correo, nombre, creada_en) VALUES (?, ?, ?, ?)',
        id,
        correo,
        nombre,
        ahora,
      );
      return { id, correo, nombre, creadaEn: ahora, borradaEn: null };
    });
  }

  async cuenta(id: string): Promise<Cuenta | null> {
    const fila = this.uno('SELECT * FROM cuenta WHERE id = ?', id);
    return fila === null ? null : this.filaDeCuenta(fila);
  }

  async crearSesion(sesion: SesionNueva): Promise<void> {
    this.ejecutar(
      'INSERT INTO sesion (hash, cuenta, creada_en, expira_en) VALUES (?, ?, ?, ?)',
      sesion.hash,
      sesion.cuenta,
      sesion.creadaEn,
      sesion.expiraEn,
    );
  }

  async sesion(hash: string): Promise<SesionGuardada | null> {
    const fila = this.uno('SELECT * FROM sesion WHERE hash = ?', hash);
    return fila === null
      ? null
      : {
          cuenta: texto(fila, 'cuenta'),
          expiraEn: entero(fila, 'expira_en'),
          revocadaEn: enteroONulo(fila, 'revocada_en'),
        };
  }

  async revocarSesion(hash: string, ahora: number): Promise<boolean> {
    return (
      this.ejecutar(
        'UPDATE sesion SET revocada_en = ? WHERE hash = ? AND revocada_en IS NULL',
        ahora,
        hash,
      ) > 0
    );
  }

  async revocarSesionesDe(cuenta: string, ahora: number): Promise<number> {
    return this.ejecutar(
      'UPDATE sesion SET revocada_en = ? WHERE cuenta = ? AND revocada_en IS NULL',
      ahora,
      cuenta,
    );
  }

  async borrarCuenta(id: string, ahora: number): Promise<void> {
    this.transaccion(() => {
      const fila = this.uno('SELECT correo FROM cuenta WHERE id = ?', id);
      if (fila === null) return;
      this.ejecutar(
        'UPDATE enlace_de_acceso SET usado_en = ? WHERE correo = ? AND usado_en IS NULL',
        ahora,
        texto(fila, 'correo'),
      );
      this.ejecutar(
        'UPDATE sesion SET revocada_en = ? WHERE cuenta = ? AND revocada_en IS NULL',
        ahora,
        id,
      );
      this.ejecutar(
        "UPDATE aviso_correo SET estado = 'descartado' WHERE cuenta = ? AND estado = 'pendiente'",
        id,
      );
      this.ejecutar('UPDATE participante SET cuenta = NULL WHERE cuenta = ?', id);
      this.ejecutar(
        'UPDATE cuenta SET correo = ?, nombre = ?, borrada_en = ? WHERE id = ?',
        `borrada-${id}`,
        'Cuenta borrada',
        ahora,
        id,
      );
    });
  }

  async unirCuenta(partida: IdPartida, jugador: IdJugador, cuenta: string): Promise<void> {
    const cambios = this.ejecutar(
      'UPDATE participante SET cuenta = ? WHERE partida = ? AND jugador = ?',
      cuenta,
      partida,
      jugador,
    );
    if (cambios === 0) {
      throw new ErrorDePersistencia(
        'partida-desconocida',
        `La partida "${partida}" no tiene ningun jugador "${jugador}".`,
        { partida, jugador },
      );
    }
  }

  // ---------------------------------------------------------------- avisos (T-064)

  async avisosPendientes(ahora: number): Promise<readonly AvisoPendiente[]> {
    const filas = this.todos(
      `SELECT a.partida, a.turno, a.jugador, a.creado_en, a.intentos, c.correo,
              p.nombre AS nombre_partida, p.intervalo_segundos
         FROM aviso_correo a
         JOIN cuenta c ON c.id = a.cuenta
         JOIN partida p ON p.id = a.partida
        WHERE a.estado = 'pendiente' AND a.siguiente_intento <= ? AND c.borrada_en IS NULL
        ORDER BY a.partida, a.jugador, a.turno`,
      ahora,
    );
    return filas.map((f) => ({
      partida: texto(f, 'partida') as IdPartida,
      turno: entero(f, 'turno'),
      jugador: texto(f, 'jugador') as IdJugador,
      correo: texto(f, 'correo'),
      nombrePartida: texto(f, 'nombre_partida'),
      intervaloSegundos: entero(f, 'intervalo_segundos'),
      creadoEn: entero(f, 'creado_en'),
      intentos: entero(f, 'intentos'),
    }));
  }

  async reclamarAvisos(
    claves: readonly ClaveDeAviso[],
    hasta: number,
    ahora: number,
  ): Promise<readonly ClaveDeAviso[]> {
    return this.transaccion(() =>
      claves.filter(
        (c) =>
          this.ejecutar(
            `UPDATE aviso_correo SET siguiente_intento = ?
              WHERE partida = ? AND turno = ? AND jugador = ? AND estado = 'pendiente'
                AND siguiente_intento <= ?`,
            hasta,
            c.partida,
            c.turno,
            c.jugador,
            ahora,
          ) > 0,
      ),
    );
  }

  async marcarAvisos(
    claves: readonly ClaveDeAviso[],
    estado: 'enviado' | 'descartado' | 'fallido',
    ahora: number,
  ): Promise<void> {
    this.transaccion(() => {
      for (const c of claves) {
        this.ejecutar(
          `UPDATE aviso_correo SET estado = ?, enviado_en = ?
            WHERE partida = ? AND turno = ? AND jugador = ? AND estado = 'pendiente'`,
          estado,
          estado === 'enviado' ? ahora : null,
          c.partida,
          c.turno,
          c.jugador,
        );
      }
    });
  }

  async reprogramarAvisos(
    claves: readonly ClaveDeAviso[],
    intentos: number,
    siguiente: number,
  ): Promise<void> {
    this.transaccion(() => {
      for (const c of claves) {
        this.ejecutar(
          `UPDATE aviso_correo SET intentos = ?, siguiente_intento = ?
            WHERE partida = ? AND turno = ? AND jugador = ? AND estado = 'pendiente'`,
          intentos,
          siguiente,
          c.partida,
          c.turno,
          c.jugador,
        );
      }
    });
  }

  async ultimoEnvio(partida: IdPartida, jugador: IdJugador): Promise<number | null> {
    const fila = this.uno(
      "SELECT MAX(enviado_en) AS ultimo FROM aviso_correo WHERE partida = ? AND jugador = ? AND estado = 'enviado'",
      partida,
      jugador,
    );
    return fila === null ? null : enteroONulo(fila, 'ultimo');
  }

  async preferencia(partida: IdPartida, jugador: IdJugador): Promise<ModoDeAviso | null> {
    const fila = this.uno(
      'SELECT modo FROM preferencia_aviso WHERE partida = ? AND jugador = ?',
      partida,
      jugador,
    );
    if (fila === null) return null;
    const modo = texto(fila, 'modo');
    const conocido = MODOS_DE_AVISO.find((m) => m === modo);
    if (conocido === undefined) throw new Error(`Modo de aviso desconocido en la base: "${modo}".`);
    return conocido;
  }

  async fijarPreferencia(partida: IdPartida, jugador: IdJugador, modo: ModoDeAviso): Promise<void> {
    this.ejecutar(
      `INSERT INTO preferencia_aviso (partida, jugador, modo) VALUES (?, ?, ?)
       ON CONFLICT (partida, jugador) DO UPDATE SET modo = excluded.modo`,
      partida,
      jugador,
      modo,
    );
  }

  // ---------------------------------------------------------------- convocatorias (T-065)

  private filaDeConvocatoria(f: Fila): Convocatoria {
    const estado = texto(f, 'estado');
    const conocido = ESTADOS_DE_CONVOCATORIA.find((e) => e === estado);
    if (conocido === undefined) throw new Error(`Estado de convocatoria desconocido: "${estado}".`);
    const avisos = textoONulo(f, 'avisos');
    const lista: unknown = avisos === null ? [] : JSON.parse(avisos);
    return {
      id: texto(f, 'id'),
      nombre: texto(f, 'nombre'),
      creador: texto(f, 'creador'),
      codigo: texto(f, 'codigo'),
      intervaloMinutos: entero(f, 'intervalo_minutos'),
      plazas: entero(f, 'plazas'),
      esDePrueba: entero(f, 'de_prueba') === 1,
      semilla: texto(f, 'semilla'),
      creadaEn: entero(f, 'creada_en'),
      estado: conocido,
      ofertas: textoONulo(f, 'ofertas'),
      avisos: Array.isArray(lista) ? lista.map(String) : [],
      huellaMundo: textoONulo(f, 'huella_mundo'),
      partida: textoONulo(f, 'partida'),
    };
  }

  async crearConvocatoria(datos: ConvocatoriaNueva, casa: string, nombre: string): Promise<void> {
    this.transaccion(() => {
      this.ejecutar(
        `INSERT INTO convocatoria (id, nombre, creador, codigo, intervalo_minutos, plazas, de_prueba,
           semilla, estado, creada_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'abierta', ?)`,
        datos.id,
        datos.nombre,
        datos.creador,
        datos.codigo,
        datos.intervaloMinutos,
        datos.plazas,
        datos.esDePrueba ? 1 : 0,
        datos.semilla,
        datos.creadaEn,
      );
      this.ejecutar(
        'INSERT INTO plaza_convocatoria (convocatoria, cuenta, casa, nombre, orden) VALUES (?, ?, ?, ?, 0)',
        datos.id,
        datos.creador,
        casa,
        nombre,
      );
    });
  }

  async convocatoria(id: string): Promise<Convocatoria | null> {
    const f = this.uno('SELECT * FROM convocatoria WHERE id = ?', id);
    return f === null ? null : this.filaDeConvocatoria(f);
  }

  async convocatoriaPorCodigo(codigo: string): Promise<Convocatoria | null> {
    const f = this.uno('SELECT * FROM convocatoria WHERE codigo = ?', codigo);
    return f === null ? null : this.filaDeConvocatoria(f);
  }

  async convocatoriasDeCuenta(cuenta: string): Promise<readonly Convocatoria[]> {
    return this.todos(
      `SELECT c.* FROM convocatoria c JOIN plaza_convocatoria p ON p.convocatoria = c.id
        WHERE p.cuenta = ? ORDER BY c.creada_en, c.id`,
      cuenta,
    ).map((f) => this.filaDeConvocatoria(f));
  }

  async plazas(id: string): Promise<readonly PlazaDeConvocatoria[]> {
    return this.todos(
      'SELECT * FROM plaza_convocatoria WHERE convocatoria = ? ORDER BY orden',
      id,
    ).map((f) => ({
      cuenta: texto(f, 'cuenta'),
      casa: texto(f, 'casa'),
      nombre: texto(f, 'nombre'),
      eleccion: textoONulo(f, 'eleccion'),
    }));
  }

  async anyadirPlaza(
    id: string,
    cuenta: string,
    casa: string,
    nombre: string,
  ): Promise<RechazoDePlaza | null> {
    return this.transaccion(() => {
      const c = this.uno('SELECT estado, plazas FROM convocatoria WHERE id = ?', id);
      if (c === null || texto(c, 'estado') !== 'abierta') return 'cerrada';
      const ocupadas = this.todos(
        'SELECT cuenta, casa FROM plaza_convocatoria WHERE convocatoria = ?',
        id,
      );
      if (ocupadas.some((p) => texto(p, 'cuenta') === cuenta)) return 'ya-dentro';
      if (ocupadas.some((p) => texto(p, 'casa') === casa)) return 'casa-ocupada';
      if (ocupadas.length >= entero(c, 'plazas')) return 'llena';
      this.ejecutar(
        'INSERT INTO plaza_convocatoria (convocatoria, cuenta, casa, nombre, orden) VALUES (?, ?, ?, ?, ?)',
        id,
        cuenta,
        casa,
        nombre,
        ocupadas.length,
      );
      return null;
    });
  }

  async guardarSorteo(
    id: string,
    ofertas: string,
    avisos: readonly string[],
    huellaMundo: string,
  ): Promise<boolean> {
    return (
      this.ejecutar(
        `UPDATE convocatoria SET estado = 'eligiendo', ofertas = ?, avisos = ?, huella_mundo = ?
          WHERE id = ? AND estado = 'abierta'`,
        ofertas,
        JSON.stringify(avisos),
        huellaMundo,
        id,
      ) > 0
    );
  }

  async elegir(id: string, cuenta: string, comarca: string): Promise<boolean> {
    return this.transaccion(() => {
      const c = this.uno('SELECT estado FROM convocatoria WHERE id = ?', id);
      if (c === null || texto(c, 'estado') !== 'eligiendo') return false;
      return (
        this.ejecutar(
          'UPDATE plaza_convocatoria SET eleccion = ? WHERE convocatoria = ? AND cuenta = ?',
          comarca,
          id,
          cuenta,
        ) > 0
      );
    });
  }

  async marcarFundada(id: string, partida: string): Promise<void> {
    this.ejecutar(
      "UPDATE convocatoria SET estado = 'fundada', partida = ? WHERE id = ? AND estado != 'fundada'",
      partida,
      id,
    );
  }

  async cerrar(): Promise<void> {
    this.bd.close();
    return;
  }
}
