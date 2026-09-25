# T-060 · Persistencia y esquema de datos

**Fase:** 3 · Servidor · **Depende de:** T-047 · **Estado:** en curso (ficha **detallada el 25-09-2026**)

## 1. Contexto

El motor ya resuelve turnos en memoria (`resolverTurno`, T-004 a T-043). Para que una partida
sobreviva a un reinicio y a meses de juego hace falta persistencia seria: estados, órdenes, crónicas y
auditoría, con una capa de acceso que el resto del servidor no sepa de qué motor es.

Lee antes: [docs/07-arquitectura.md](../07-arquitectura.md) §7.4 y [docs/02-diseno-nucleo.md](../02-diseno-nucleo.md)
§2.4 (la huella del turno). Lo que sigue **no inventa reglas**: T-061 (reloj), T-062 (API) y T-063
(cuentas) se apoyan en lo que esta tarea deja escrito.

## 2. Objetivo

Un paquete `paquetes/servidor` con:

1. un esquema versionado y reversible;
2. una interfaz `Repositorio` (asíncrona, sin SQL a la vista) y su implementación en SQLite;
3. la operación transaccional que necesita el reloj: **guardar la resolución de un turno** o nada;
4. detección de corrupción por la huella del núcleo.

## 3. Alcance

**Entra:** tablas, migraciones, `Repositorio`, códec de estados, guardado de estados, crónicas,
sucesos y auditoría, y las órdenes entrantes.

**No entra:** el reloj y el cálculo de la próxima resolución (T-061), la API y la niebla (T-062), las
cuentas y sesiones (T-063; aquí `participante.cuenta` es un texto sin más), los avisos (T-064).

## 4. Decisiones (con cifras)

### 4.1 Motor: `node:sqlite`, sin dependencias

Node 22 (`.nvmrc`) trae `node:sqlite` incorporado (`DatabaseSync`): no hay que compilar nada nativo ni
añadir un paquete. Es **experimental** (avisa por `stderr`); el riesgo se aísla en una sola clase
(`RepositorioSqlite`) detrás de la interfaz, y pasar a `better-sqlite3` o a Postgres es cambiar esa
clase. Los tipos vienen en `@types/node` (22.20). Se abre siempre con `PRAGMA journal_mode = WAL`,
`foreign_keys = ON` y `busy_timeout`.

### 4.2 Se guarda el estado **completo de cada turno**, comprimido

Medido con una partida de ocho casas (208 comarcas, turno 200): **245 KB de JSON, 18 KB con gzip**
(163 KB / 9 KB en el turno 10). Proyección a 12 jugadores y 240 turnos: unas 400 comarcas → ~370 KB
por estado → **~89 MB sin comprimir, ~7 MB comprimido**. Es poco. Guardar el estado entero por turno
permite auditar, reproducir cualquier turno (`resolverTurno(estado[N], ordenes[N])` debe dar
`estado[N+1]`) y no exige reconstruir nada. Descartado: «un estado cada N turnos más los sucesos»,
que ahorra espacio que no hace falta y añade un camino de reconstrucción que probar. Los estados se
guardan en la **forma canónica** del núcleo (`canonico`) comprimida con `zlib` (`gzip`, nivel 6).

Política de retención (decisión, no código todavía): no se borra nada mientras la partida esté viva.

### 4.3 Integridad

- Cada `estado_turno` guarda `huella` = `huella(estado)` del núcleo. Al leer se **recalcula** y, si no
  coincide, se lanza `ErrorDePersistencia('huella-no-coincide', …)` con la partida y el turno.
- Al leer también se valida con `validarEstado` (el núcleo) contra el mundo de la partida, salvo que
  se pida lo contrario (lectura de auditoría).
- El estado guardado del turno N+1 lleva `huellaTurnoAnterior = huella(estado N)` (lo pone el motor):
  se comprueba en la transacción de resolución que **encadena** con el guardado del turno N.

### 4.4 Las órdenes

Hay dos cosas distintas y no se mezclan:

- **Órdenes vivas**: viajan **dentro del estado** (`estado.ordenes`), como en el motor.
- **Órdenes entrantes**: lo que el jugador manda entre turnos (la API de T-062). Tabla `orden`, **solo
  se añade y se cambia de estado, nunca se borra**: `pendiente` → `aplicada` (con el turno en que
  entró al motor) | `cancelada` (la retira el propio jugador antes de resolver) | `rechazada` (el
  motor o la validación la rechazó, con el motivo). Su contenido es el JSON validado por
  `validarOrdenEntrante`.

### 4.5 Las cuentas no son de esta tarea

La ficha original pedía la tabla `cuenta`. Se deja **a T-063** (migración 2): `participante.cuenta` es
un `TEXT NULL` sin clave foránea, que T-063 enlazará. Así esta tarea no fija un modelo de sesiones
que no le toca.

## 5. Esquema (migración 1, `0001-inicial`)

Todas las tablas `STRICT`; las marcas de tiempo son **milisegundos Unix** (`INTEGER`) que entran por
parámetro (el servidor no llama a `Date.now()` dentro del repositorio: lo inyecta el reloj).

```sql
CREATE TABLE migracion (
  version     INTEGER PRIMARY KEY,
  nombre      TEXT NOT NULL,
  aplicada_en INTEGER NOT NULL
) STRICT;

CREATE TABLE partida (
  id                  TEXT PRIMARY KEY,
  nombre              TEXT NOT NULL,
  semilla             TEXT NOT NULL,
  version_reglas      INTEGER NOT NULL,
  huella_mundo        TEXT NOT NULL,          -- del mundo con el que se creó (§4.3)
  intervalo_segundos  INTEGER NOT NULL CHECK (intervalo_segundos > 0),
  ancla               INTEGER NOT NULL,       -- ms: instante del turno 1 (T-061 calcula desde aquí)
  turno_actual        INTEGER NOT NULL CHECK (turno_actual >= 1),
  proxima_resolucion  INTEGER,                -- ms; NULL si está detenida o terminada
  estado              TEXT NOT NULL CHECK (estado IN ('activa','detenida','terminada')),
  motivo_detencion    TEXT,
  de_prueba           INTEGER NOT NULL DEFAULT 0 CHECK (de_prueba IN (0,1)),
  creada_en           INTEGER NOT NULL
) STRICT;
CREATE INDEX partida_por_resolver ON partida (proxima_resolucion) WHERE estado = 'activa';

CREATE TABLE participante (
  partida  TEXT NOT NULL REFERENCES partida(id),
  jugador  TEXT NOT NULL,                     -- IdJugador del núcleo
  casa     TEXT NOT NULL,
  cuenta   TEXT,                              -- T-063
  PRIMARY KEY (partida, jugador)
) STRICT;

CREATE TABLE estado_turno (
  partida    TEXT NOT NULL REFERENCES partida(id),
  turno      INTEGER NOT NULL,
  huella     TEXT NOT NULL,
  contenido  BLOB NOT NULL,                   -- gzip(canónico(estado))
  bytes_sin_comprimir INTEGER NOT NULL,
  guardado_en INTEGER NOT NULL,
  PRIMARY KEY (partida, turno)
) STRICT;

CREATE TABLE orden (
  partida       TEXT NOT NULL REFERENCES partida(id),
  id            TEXT NOT NULL,
  jugador       TEXT NOT NULL,
  turno_recibida INTEGER NOT NULL,            -- turno de la partida cuando llegó
  recibida_en   INTEGER NOT NULL,
  estado        TEXT NOT NULL CHECK (estado IN ('pendiente','aplicada','cancelada','rechazada')),
  turno_aplicada INTEGER,                     -- turno en que entró al motor
  motivo        TEXT,                         -- rechazo o cancelación
  contenido     TEXT NOT NULL,                -- JSON de la orden
  PRIMARY KEY (partida, id)
) STRICT;
CREATE INDEX orden_pendientes ON orden (partida, estado, turno_recibida);

CREATE TABLE cronica (
  partida  TEXT NOT NULL REFERENCES partida(id),
  turno    INTEGER NOT NULL,
  jugador  TEXT NOT NULL,
  contenido TEXT NOT NULL,                    -- JSON de la crónica de ese jugador
  PRIMARY KEY (partida, turno, jugador)
) STRICT;

CREATE TABLE suceso_turno (
  partida   TEXT NOT NULL REFERENCES partida(id),
  turno     INTEGER NOT NULL,
  contenido BLOB NOT NULL,                    -- gzip(JSON de los sucesos), para auditar
  PRIMARY KEY (partida, turno)
) STRICT;

CREATE TABLE auditoria_resolucion (
  partida          TEXT NOT NULL REFERENCES partida(id),
  turno            INTEGER NOT NULL,          -- el turno que se resolvió (N)
  huella_entrada   TEXT NOT NULL,
  huella_salida    TEXT NOT NULL,
  huella_ordenes   TEXT NOT NULL,
  ordenes          INTEGER NOT NULL,
  duracion_ms      INTEGER NOT NULL,
  version_reglas   INTEGER NOT NULL,
  version_nucleo   TEXT NOT NULL,
  resuelta_en      INTEGER NOT NULL,
  PRIMARY KEY (partida, turno)
) STRICT;
```

`(partida, turno)` como clave primaria de `auditoria_resolucion` y de `estado_turno` es lo que hace
**imposible por construcción** guardar dos veces el mismo turno (lo que T-061 necesita).

## 6. La interfaz (`paquetes/servidor/src/persistencia/repositorio.ts`)

```ts
export interface Repositorio {
  /** Aplica las migraciones pendientes; devuelve la versión final. */
  migrar(ahora: number): Promise<number>;
  versionDelEsquema(): Promise<number>;

  crearPartida(datos: NuevaPartida, estadoInicial: EstadoPartida, ahora: number): Promise<void>;
  partida(id: IdPartida): Promise<FilaDePartida | null>;
  partidasPorResolver(hasta: number, limite: number): Promise<readonly FilaDePartida[]>;
  detenerPartida(id: IdPartida, motivo: string): Promise<void>;
  participantes(id: IdPartida): Promise<readonly Participante[]>;

  /** El estado guardado de un turno, con huella y (por defecto) validación. */
  estado(id: IdPartida, turno: number, opciones?: OpcionesDeLectura): Promise<EstadoPartida | null>;
  ultimoEstado(id: IdPartida, opciones?: OpcionesDeLectura): Promise<EstadoPartida | null>;

  /** Órdenes entrantes: solo se añaden y cambian de estado. */
  guardarOrden(id: IdPartida, orden: OrdenEntrante, ahora: number): Promise<void>;
  ordenesPendientes(id: IdPartida): Promise<readonly OrdenGuardada[]>;
  cancelarOrden(id: IdPartida, orden: IdOrden, motivo: string): Promise<boolean>;

  cronica(id: IdPartida, turno: number, jugador: IdJugador): Promise<Cronica | null>;
  auditoria(id: IdPartida, turno: number): Promise<AuditoriaDeResolucion | null>;

  /**
   * Guarda en **una sola transacción** la resolución del turno `esperado`: el estado nuevo
   * (turno esperado + 1), las crónicas, los sucesos, la auditoría, el estado de las órdenes que
   * entraron, y el avance de `turno_actual` y `proxima_resolucion`. Falla, sin escribir nada, si
   * `turno_actual` ya no es `esperado` (`ConflictoDeTurno`) o si el encadenado de huellas no cuadra.
   */
  guardarResolucion(resolucion: ResolucionDeTurno, ahora: number): Promise<void>;
}
```

`ResolucionDeTurno` agrupa: `partida`, `turnoResuelto`, `estadoNuevo`, `cronicas`, `sucesos`,
`ordenesAplicadas` (ids), `ordenesRechazadas` (id + motivo), `auditoria` y `proximaResolucion`.

Errores: `ErrorDePersistencia` con `codigo` cerrado (`huella-no-coincide`, `estado-invalido`,
`conflicto-de-turno`, `partida-desconocida`, `esquema-desactualizado`, `migracion-fallida`) y mensaje
en español que dice qué pasó y cómo arreglarlo (regla de estilo de CLAUDE.md §6).

## 7. Migraciones (`paquetes/servidor/src/persistencia/migraciones/`)

Cada migración es `{ version, nombre, subir: string[], bajar: string[] }` y se aplica dentro de una
transacción, junto con su fila en `migracion`. **Reversibles**: `bajar` deshace exactamente `subir`.
Reglas: nunca se edita una migración ya publicada; las versiones son consecutivas; `migrar()` es
idempotente y falla con `esquema-desactualizado` si la base es de una versión **más nueva** que el
código (no degrada por accidente). Un test aplica todas sobre una base vacía, otra vez (idempotencia),
las revierte de una en una, y aplica la migración N sobre una base de la N−1 **con datos**.

## 8. Archivos

```
paquetes/servidor/src/persistencia/
  repositorio.ts          interfaz, tipos y errores
  sqlite.ts               RepositorioSqlite (única clase que sabe SQL)
  migraciones/index.ts    lista ordenada
  migraciones/0001-inicial.ts
  codec.ts                estado ⇄ bytes (canónico + gzip), huella
  memoria.ts              RepositorioEnMemoria (SQLite ':memory:') para pruebas de otros paquetes
paquetes/servidor/src/persistencia/*.test.ts
docs/07-arquitectura.md   §7.4: tabla de decisiones y esquema
```

`package.json` de `servidor`: nada nuevo que instalar. `tsconfig.json`: ya ve Node.

## 9. Criterios de aceptación

1. **Tamaño** (§4.2): una partida de 200 turnos con ocho casas ocupa, en disco, menos de 6 MB, y el
   test lo mide y lo escribe en la bitácora; la proyección a 12 jugadores y 240 turnos queda en
   `docs/07-arquitectura.md`.
2. **Ida y vuelta**: guardar y releer el estado de cada turno de una partida de reproducción
   (`humo-01`, `humo-02`) devuelve un objeto con **la misma huella**, byte a byte en su forma canónica.
3. **Corrupción**: alterar un byte del `contenido` de un `estado_turno` hace que la lectura lance
   `huella-no-coincide` con el turno; un estado con la forma rota lanza `estado-invalido`.
4. **Transacción**: `guardarResolucion` con un fallo inyectado a mitad (por ejemplo, la auditoría
   duplicada) **no deja rastro**: ni estado, ni crónicas, ni cambio de `turno_actual`.
5. **Idempotencia**: guardar dos veces la resolución del mismo turno lanza `conflicto-de-turno` la
   segunda vez y no modifica nada.
6. **Encadenado**: un `estadoNuevo` cuya `huellaTurnoAnterior` no es la huella guardada del turno N
   se rechaza sin escribir.
7. **Órdenes**: nunca se borran (`DELETE` no existe en el repositorio de órdenes); el ciclo
   pendiente → aplicada/cancelada/rechazada se prueba, y una orden aplicada no se puede cancelar.
8. **Migraciones**: se aplican, son idempotentes, se revierten de una en una y se aplican sobre una
   base con datos (§7). Una base de versión futura no se abre.
9. **Ninguna consulta SQL fuera de la capa de acceso**: un test recorre `paquetes/servidor/src` y
   falla si algún archivo distinto de `persistencia/sqlite.ts` y `persistencia/migraciones/*` contiene
   `SELECT|INSERT|UPDATE|DELETE|CREATE TABLE` o importa `node:sqlite`.
10. `npm run verificar` en verde y el núcleo sigue puro (el servidor **no** se importa desde él).

## 10. Verificación

```bash
npm run verificar
npx vitest run paquetes/servidor
```

## 11. Al terminar

1. Índice: T-060 `hecha`.
2. `ESTADO.md`: siguiente tarea T-061; bitácora con las cifras de tamaño.
3. `docs/07-arquitectura.md` §7.4: esquema, decisiones y tamaño proyectado.
4. Commit: `T-060: persistencia y esquema de datos`.

## 12. Dónde va

Ficha detallada el 25-09-2026. **Nada implementado todavía.** Siguiente paso: `codec.ts` y la migración
1 con sus tests, después `RepositorioSqlite` y la transacción de resolución.
