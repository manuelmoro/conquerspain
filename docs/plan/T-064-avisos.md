# T-064 · Avisos de resolución

**Fase:** 3 · Servidor · **Depende de:** T-062, T-063 · **Estado:** **hecha (25-09-2026)**

## 1. Contexto

Una partida por turnos vive de que te enteres de que ha pasado algo. Sin avisos, el jugador tiene que
estar mirando, que es justo lo que el juego no quiere (CLAUDE.md §4.4: nada premia conectarse más). El
reloj (T-061) ya resuelve y guarda la crónica de cada jugador (T-060); la API (T-062) y las cuentas
(T-063) ya saben quién es quién y a qué correo escribirle. Falta **avisar**: en vivo a quien tiene el
cliente abierto y por correo a quien no.

## 2. Objetivo

Que al resolverse un turno cada jugador lo sepa: un evento en vivo en menos de 3 s si tiene el cliente
abierto, y un correo con la crónica legible, **una sola vez por turno** (o un resumen diario), con
reintentos y respetando sus preferencias.

## 3. Alcance

**Entra:** el canal en vivo (SSE), la cola de correos con reintento, el texto de la crónica para el
correo, las preferencias por partida y sus rutas, y la migración 3.

**No entra:** el transporte SMTP real (§4.6), notificaciones push móviles, y avisos que no salgan de la
crónica (si algo merece aviso, lo merece también en la crónica, y se añade allí).

## 4. Decisiones

### 4.1 Qué merece aviso: lo que la crónica ya llama aviso

La crónica (T-044) ya separa la sección **`avisos`** —escasez, obras paradas, puertos que cierran,
comarcas que se van, ferias que empiezan, cada uno con su acción sugerida— del resto. El aviso no inventa
otra lista: **todo turno resuelto se avisa**, y el aviso lleva cuántas entradas de `avisos` tiene la
crónica de ese jugador y sus textos. Así la regla vive en un solo sitio (las plantillas del núcleo).

### 4.2 En vivo: SSE con un canal en memoria

- `CanalDeAvisos`: un publicador/suscriptor en memoria por partida. El reloj publica
  `{ partida, turno }` **después** de que `guardarResolucion` confirme (nunca un aviso de algo que no
  quedó guardado).
- `GET /partidas/:id/eventos` (con sesión, y solo si se juega en esa partida; si no, el mismo `404` de
  T-062) abre un flujo `text/event-stream`. Cada resolución manda
  `event: turno-resuelto` con `data: {"turno":N,"avisos":K}` —solo lo del propio jugador; la crónica se
  pide aparte— y cada 25 s un comentario `: latido` para que los proxies no corten.
- El adaptador HTTP deja de ser solo «petición → respuesta JSON»: la API devuelve, para esta ruta, un
  resultado de tipo **flujo** que el adaptador escribe y cierra cuando el cliente se va.
- Con varias instancias, el canal habría que moverlo a algo compartido; se anota, no se resuelve.

### 4.3 Correo: una cola en la base, con la resolución

- La tabla `aviso_correo` (§4.7) tiene clave `(partida, turno, jugador)`: **imposible encolar dos veces**
  el mismo aviso. Las filas se insertan **dentro de la transacción** de `guardarResolucion`, una por
  jugador con cuenta: si la resolución se guarda, el aviso queda encolado; si no, tampoco.
- Un **despachador** (`DespachadorDeCorreos.pasada(ahora)`, llamado por el mismo bucle que el reloj)
  agrupa las filas pendientes por `(partida, jugador)` y, según la preferencia, manda **un** correo con la
  crónica de todos esos turnos (§4.4). Si el envío va bien, marca las filas `enviado`; si falla, las deja
  pendientes con `intentos + 1` y `siguiente_intento = ahora + min(2^intentos min, 6 h)`; a los 8
  intentos, `fallido` y un error en el registro.
- «Una sola vez» se garantiza por la clave y porque el marcado a `enviado` es la misma transacción que
  comprueba que seguían pendientes: dos despachadores a la vez no mandan dos correos del mismo turno
  (el segundo no encuentra pendientes).

### 4.4 Preferencias por partida

`preferencia_aviso (partida, jugador, modo)` con `modo ∈ { 'cada-turno', 'diario', 'nada' }`.
**Por defecto** según el ritmo de la partida: intervalo de **6 h o más → `cada-turno`**; menos → `diario`
(una partida de 1 h no puede mandar 24 correos al día).

- `cada-turno`: se manda en cuanto hay pendientes.
- `diario`: se manda cuando han pasado **24 h desde el último envío** de ese jugador en esa partida (o
  desde el primer pendiente, si nunca se mandó), agrupando todos los turnos pendientes en un correo.
- `nada`: las filas pendientes se marcan `descartado`; no se manda nada. El SSE no se ve afectado (quien
  tiene el cliente abierto lo ha pedido).

Rutas (con sesión): `GET /partidas/:id/avisos` → `{ modo, porDefecto }`; `PUT /partidas/:id/avisos`
`{ modo }`.

### 4.5 El correo se lee sin abrir el juego

`cronicaEnTexto(cronica)` compone texto plano: la fecha, y por secciones (Avisos, Sucesos, Economía,
Rumores, Hitos) sus entradas, con la acción sugerida debajo de cada aviso. El resumen diario encadena
las crónicas de los turnos en orden. El asunto dice la partida y el turno o turnos. Sin HTML: se lee en
cualquier cliente y no hay nada que escapar. **Nada** del correo sale de otro sitio que la crónica del
propio jugador (la misma niebla de T-044).

### 4.6 El transporte es una interfaz

`EnviadorDeCorreo` (T-063) gana `enviarAviso(mensaje)`. Esta tarea **no** escribe un cliente SMTP: sin
dependencias, SMTP con TLS a mano es mucha superficie para algo que se decide al desplegar (servicio,
credenciales, dominio). Se deja `CorreoEnMemoria` (pruebas y desarrollo) y el transporte real va a la
tarea de despliegue, anotado en el índice como pendiente. Todo lo demás —qué, cuándo, cuántas veces,
reintentos— queda hecho y probado aquí.

### 4.7 Esquema (migración 3, `0003-avisos`)

```sql
CREATE TABLE aviso_correo (
  partida TEXT NOT NULL REFERENCES partida(id),
  turno   INTEGER NOT NULL,
  jugador TEXT NOT NULL,
  cuenta  TEXT NOT NULL REFERENCES cuenta(id),
  estado  TEXT NOT NULL CHECK (estado IN ('pendiente','enviado','descartado','fallido')),
  creado_en INTEGER NOT NULL,
  intentos INTEGER NOT NULL DEFAULT 0,
  siguiente_intento INTEGER NOT NULL,
  enviado_en INTEGER,
  PRIMARY KEY (partida, turno, jugador)
) STRICT;
CREATE INDEX aviso_pendiente ON aviso_correo (estado, siguiente_intento);
CREATE TABLE preferencia_aviso (
  partida TEXT NOT NULL REFERENCES partida(id),
  jugador TEXT NOT NULL,
  modo    TEXT NOT NULL CHECK (modo IN ('cada-turno','diario','nada')),
  PRIMARY KEY (partida, jugador)
) STRICT;
```

## 5. Piezas

```
paquetes/servidor/src/persistencia/migraciones/0003-avisos.ts
paquetes/servidor/src/persistencia/avisos.ts       interfaz RepositorioDeAvisos (la implementa RepositorioSqlite)
paquetes/servidor/src/avisos/
  canal.ts          CanalDeAvisos (publicar, suscribir)
  texto.ts          cronicaEnTexto, asunto
  preferencias.ts   modoPorDefecto
  despachador.ts    DespachadorDeCorreos
paquetes/servidor/src/reloj/resolucion.ts         publica en el canal tras guardar
paquetes/servidor/src/api/                         rutas de avisos y de eventos (flujo)
```

## 6. Criterios de aceptación

1. **En vivo:** un cliente conectado a `/eventos` recibe `turno-resuelto` en **menos de 3 s** tras la
   resolución (prueba por HTTP real, con el reloj real); solo el suyo; una cuenta ajena recibe `404`.
2. **Una sola vez:** por cada turno y jugador con cuenta hay como mucho un correo; dos despachadores a la
   vez no lo duplican; una resolución que no se guarda no encola nada.
3. **Reintento:** con el transporte fallando, el aviso sigue pendiente con la espera creciente; cuando
   vuelve, se manda **una** vez; a los 8 fallos queda `fallido` y se registra.
4. **Preferencias:** `nada` no manda nada (y descarta); `diario` agrupa varios turnos en un solo correo
   a las 24 h; `cada-turno` manda uno por turno; el valor por defecto depende del intervalo (1 h → diario,
   24 h → cada turno); las rutas `GET`/`PUT` funcionan y validan.
5. **Legible y sin fuga:** el correo lleva las entradas de la crónica del propio jugador por secciones, con
   las acciones sugeridas, y ningún texto de la crónica de otro jugador.
6. **Sin cuenta, sin correo:** un jugador sin cuenta (o con la cuenta borrada) no encola nada.
7. **Migración 3** se aplica, es idempotente y se revierte.
8. `npm run verificar` en verde.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/servidor
```

## 8. Al terminar

1. Índice: T-064 `hecha`; tarea nueva de transporte de correo en despliegue.
2. `ESTADO.md`: siguiente tarea T-065; bitácora.
3. `docs/07-arquitectura.md` §7.4: avisos.
4. Commit: `T-064: avisos de resolución`.

## 9. Cierre (25-09-2026)

**Hecha.** `paquetes/servidor/src/avisos/` (`canal`, `texto`, `preferencias`, `despachador`), la migración
`0003-avisos`, `persistencia/avisos.ts` (interfaz que implementa `RepositorioSqlite`), el encolado dentro de
`guardarResolucion`, `enviarAviso` en `EnviadorDeCorreo`, el reloj que publica tras guardar y llama al
despachador en su bucle, el tipo `Flujo` en la API y el adaptador HTTP, y las rutas `GET /partidas/:id/eventos`
y `GET`/`PUT /partidas/:id/avisos`. 14 pruebas nuevas; 1184 en total.

**Criterios:**

1. **En vivo:** por HTTP real con el reloj real (intervalo de 1 s), el `event: turno-resuelto` llega en menos de
   3 s tras la resolución y tras su hora; con `data` del propio jugador (turno y número de avisos); latidos; la
   suscripción se da de baja al cerrar; una cuenta ajena recibe `404`. El reloj solo publica lo guardado (un
   motor que falla no publica).
2. **Una sola vez:** un correo por turno; la segunda pasada no manda nada; dos despachadores a la vez mandan uno;
   una resolución que no se guarda no encola.
3. **Reintento:** con el transporte fallando, espera 2, 4… minutos (tope 6 h), no manda antes de hora y manda
   **uno** al volver; a los 8 fallos, `fallido` y `aviso-fallido` en el registro.
4. **Preferencias:** por defecto diario por debajo de 6 h y cada turno desde 6 h; `diario` agrupa los turnos 1 a
   3 en un solo correo a las 24 h y el siguiente llega 24 h después del anterior; `nada` descarta; las rutas
   leen, validan y fijan.
5. **Legible y sin fuga:** el correo contiene `cronicaEnTexto` de la crónica propia y ninguna entrada que solo
   esté en la del otro jugador; el texto va por secciones con «Qué hacer».
6. **Sin cuenta, sin correo:** un jugador sin cuenta o con la cuenta borrada no encola; borrar la cuenta descarta
   lo pendiente.
7. **Migración 3** en la prueba de migraciones (aplica, idempotente, revierte).
8. `npm run verificar` en verde.

**Decisiones no escritas antes:**

- La exactitud «una sola vez» es **al menos una y como mucho una salvo caída**: el aviso se reclama 10 minutos
  antes de mandarlo; si el proceso muere entre mandar y marcar, se vuelve a mandar pasado ese rato. Es el precio
  de no tener transacciones distribuidas con el servidor de correo.
- El transporte real queda en **T-066** (nueva): SMTP o proveedor, con el despliegue.
- `servirHttp.cerrar()` corta las conexiones abiertas (`closeAllConnections`): un flujo SSE no termina solo.
- El canal SSE es en memoria, como los limitadores: con varias instancias habría que compartirlo.
