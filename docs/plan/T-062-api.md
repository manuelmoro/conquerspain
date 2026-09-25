# T-062 · API de partida, órdenes y vista por jugador

**Fase:** 3 · Servidor · **Depende de:** T-061 · **Estado:** en curso (ficha **detallada el 25-09-2026**)

## 1. Contexto

La puerta entre el cliente y la autoridad. Su regla fundamental: **nunca sale del servidor un dato
que ese jugador no deba conocer**. Ya existen todas las piezas de dentro: el motor
(`resolverTurno`), la niebla (`vistaDeJugador`, T-044), la persistencia (`Repositorio`, T-060) y el
reloj (T-061). Esta tarea pone la cara HTTP y, sobre todo, **la frontera de confianza**: convertir
lo que dice un cliente que puede estar manipulado en órdenes que el motor pueda fiarse de ejecutar.

Lee antes: [docs/07-arquitectura.md](../07-arquitectura.md) §7.4, [T-044](T-044-cronica-y-niebla.md) y
[T-060](T-060-persistencia.md) / [T-061](T-061-reloj-de-turnos.md) (lo que el repositorio y el reloj ya
hacen). Heredado de T-032 a T-035: el motor se fía del `coste` de cada orden y lo reserva al darla de
alta; el servidor tiene que calcularlo con las reglas y con los modificadores efectivos de la casa.

## 2. Objetivo

Una API REST sin dependencias nuevas, en `paquetes/servidor/src/api/`, que:

1. da a cada jugador **solo su vista** del estado y **solo su crónica**;
2. recibe **intenciones** del jugador y las convierte en órdenes internas que el motor acepta,
   fijando autor, turno, coste, estado y cola; el cliente no elige ninguno de esos campos;
3. permite consultar y retirar las órdenes pendientes propias, con **idempotencia** en el alta;
4. responde siempre con errores de código estable y mensaje en español.

## 3. Alcance

**Entra:** el módulo de **intenciones** del núcleo (DTO público → orden interna con coste), el
enrutador y los manejadores, el control de acceso por participante, los límites de tamaño, de
cantidad y de frecuencia, el adaptador `node:http`, y los dos arreglos que la frontera exige en el
repositorio y en el reloj (§4.8).

**No entra:** cuentas, sesiones y contraseñas (T-063: aquí `Autenticador` es una interfaz), avisos y
SSE (T-064: `GET /eventos`), alta de partidas (`POST /partidas`, T-065) y el cliente (fase 4).

## 4. Decisiones

### 4.1 `node:http` y un enrutador mínimo, sin Fastify

La arquitectura decía Fastify. Se descarta **por ahora**: no hay nada instalado, cada dependencia
es superficie que auditar, y lo que Fastify daría (esquemas, registro) ya lo hacen los validadores
del núcleo y el `Registro`. El corazón es una **función pura** `manejar(peticion): Promise<Respuesta>`
que se prueba sin abrir un puerto; encima, un adaptador `node:http` de veinte líneas
(`servirHttp`). Si un día hace falta Fastify, se cambia el adaptador y las rutas no se enteran.

### 4.2 Acceso: el `Autenticador` es una interfaz

```ts
interface Autenticador { identificar(peticion: PeticionHttp): Promise<string | null>; } // la cuenta
```

Sin cuenta → `401 no-autenticado`. Con cuenta, se busca a qué jugador de esa partida corresponde
(`participante.cuenta`); si no juega en ella → `404 partida-desconocida` (no se distingue «no existe»
de «no es tuya»: no se filtra qué partidas hay). T-063 pone el autenticador real; aquí solo hay uno
**de pruebas** (`autenticadorDePrueba`, cabecera `x-cuenta`) que no se cablea en el servidor de verdad.

### 4.3 Rutas

Todas bajo `/partidas`. Toda respuesta correcta lleva `version` (versión de reglas) y `turno`.

| Método y ruta | Qué hace |
|---|---|
| `GET /partidas/mias` | Las partidas de esta cuenta: id, nombre, casa, turno, estado, próxima resolución |
| `GET /partidas/:id/estado` | `{ version, turno, proximaResolucion, estado, vista }` con `vista = vistaDeJugador(...)` |
| `POST /partidas/:id/ordenes` | Alta de **una intención** (§4.4); `201` la primera vez, `200` si se repite igual |
| `GET /partidas/:id/ordenes` | Las órdenes pendientes propias, con su estado |
| `DELETE /partidas/:id/ordenes/:orden` | Retira una pendiente propia; `409` si ya entró o se cerró |
| `GET /partidas/:id/cronica/:turno` | La crónica de **ese jugador** de un turno ya resuelto |
| `GET /partidas/:id/clasificacion` | `vista.clasificacion` (lo que ya se le deja ver) |

**Ninguna ruta devuelve el estado completo ni los sucesos crudos.** La semilla, los almacenes ajenos
y las influencias exactas solo están ahí (T-044).

### 4.4 Intención → orden: la frontera de confianza

El cliente manda una **intención** (`Intencion`), no una orden: solo lo que el jugador decide.
Un validador estricto (`validarIntencion`, rechaza campos extra) la comprueba, y `construirOrden`
(**en el núcleo**, puro) la convierte:

```ts
construirOrden(intencion, { estado, jugador, mundo, reglas, id }): Resultado<Orden>
```

El servidor fija **siempre**: `id` (`o-<turno>-<idCliente>`), `jugador` (el autenticado), `turnoAlta`
(el turno de la partida), `estado: 'pendiente'`, `coste` (con las funciones de coste del núcleo y los
modificadores efectivos de la casa: `costeDeEdificio`, `costeDeRecua`, `costeDeRebanyo`,
`costeDeAperos`, `costeDeObraMayor`, `costeDeRoturar`), `turnosTotales`/`turnosHechos`,
`motivoEspera`, `delMayordomo: false` (salvo la orden `mayordomo`, cuyas reglas son del jugador) y
`cola` (`comarca:<id>` para lo que se hace en una comarca, `recua:<id>` para las recuas, `null` para
el resto). Esto es lo mismo que hace `Pedidos` en el banco; **se extrae al núcleo y el banco pasa a
usarla** (tarea de limpieza anotada, no bloquea esta).

Tipos de intención: `construir`, `derribar`, `roturar`, `politica`, `formar-recua`, `ruta`, `carga`,
`cometido`, `formar-rebanyo`, `incorporar`, `regalo`, `aperos`, `mercado`, `obra-mayor`, `tradicion`,
`mayordomo`, `trasladar-corte` y `cola`. (`letra-de-cambio` sigue desactivada hasta T-103.) Cada una con
solo los campos de intención de su orden.

**Comprobaciones de propiedad** (semánticas, además de las de forma): la comarca de una obra es del
jugador; la recua o el rebaño citados son suyos; las comarcas citadas existen en el mundo de la
partida y **el jugador las conoce**; el edificio o la obra existen y no están desactivados; la casa no
lo tiene prohibido. **No** se comprueba que haya recursos o cuadrillas: eso es *ejecución legal* y lo
decide el motor al dar de alta la orden (que la cancela con `sin-recursos` y lo cuenta en la crónica).
La distinción queda escrita para el banco (T-048).

### 4.5 Idempotencia

La clave es `idCliente` (1 a 64 caracteres del alfabeto de identificadores), único **por jugador y
turno**. El identificador interno es `o-<turno>-<idCliente>` (con el jugador implícito en la partida,
dos jugadores con la misma clave no chocan porque el id lleva además su casa: `o-<turno>-<jugador>-<idCliente>`).
Mismo `idCliente` con **el mismo contenido** → `200` con la orden ya guardada (un reintento del cliente
no duplica); con **contenido distinto** → `409 clave-reutilizada`.

### 4.6 Límites

- **Cuerpo:** 64 KiB como máximo; si no, `413 cuerpo-demasiado-grande`.
- **Órdenes pendientes por jugador y turno:** 200 (el mayordomo y un plan de temporada llenan mucho,
  y un jugador legítimo no llega ni a 60). `429 demasiadas-ordenes`.
- **Frecuencia:** cubo de fichas por cuenta, 60 peticiones por minuto con ráfaga de 30
  (`limitarFrecuencia`, en memoria; con varias instancias haría falta compartirlo, y se anota).
  `429 demasiadas-peticiones`, con `Retry-After`.

### 4.7 Versión y forma de los errores

```json
{ "error": { "codigo": "orden-invalida", "mensaje": "La comarca «x» no es tuya…" }, "version": 1 }
```

Códigos cerrados (`CODIGOS_DE_API`): `no-autenticado`, `partida-desconocida`, `ruta-desconocida`,
`metodo-no-permitido`, `cuerpo-invalido`, `cuerpo-demasiado-grande`, `orden-invalida`,
`orden-desconocida`, `orden-no-retirable`, `clave-reutilizada`, `turno-cerrado`, `partida-detenida`,
`cronica-no-disponible`, `demasiadas-ordenes`, `demasiadas-peticiones`, `error-interno`. Todos con
mensaje en español que dice qué pasó y cómo arreglarlo. Un error inesperado devuelve
`500 error-interno` **sin detalle** y lo anota en el `Registro`.

### 4.8 Lo que la frontera obliga a arreglar en T-060 y T-061

Una carrera real: el jugador lee el turno N, el reloj resuelve el N y guarda el N+1, y la orden llega
sellada con `turnoAlta = N`. El motor exige `turnoAlta === turno` y **lanzaría un error que detiene la
partida** en el reloj (T-061 §4.4). Dos arreglos:

1. `Repositorio.guardarOrden(id, orden, ahora, turnoEsperado?)`: si se da, falla con `turno-cerrado`
   cuando `turno_actual !== turnoEsperado`, **dentro de la misma transacción** del alta (la API lo pasa
   siempre).
2. `resolverUnTurno` (reloj): una pendiente cuyo `turnoAlta` no es el turno que se resuelve se marca
   `rechazada` (`turno-cerrado`) y **no entra**, en vez de tumbar la partida. Cinturón y tirantes.

### 4.9 La prueba de fuga

Modelo: `pruebas/vista.test.ts` del núcleo. Para una partida con tres casas y varios turnos, se
piden **todas las rutas de cada jugador**, se serializa cada respuesta y se comprueba que **no
contiene**: la semilla, ningún identificador de un jugador ajeno salvo en lo que la vista ya le
enseña (`casas`, `clasificacion`), los almacenes ajenos ni las crónicas ajenas. Y un jugador **no puede**
leer la crónica de otro (`404`), ni retirar sus órdenes, ni darlas en su nombre aunque las falsifique.

## 5. Piezas

```
paquetes/nucleo/src/ordenes/intencion.ts        Intencion, validarIntencion, construirOrden
paquetes/nucleo/pruebas/intencion.test.ts       cada tipo: forma, propiedad, coste, cola
paquetes/servidor/src/api/
  errores.ts            ErrorDeApi, CODIGOS_DE_API, respuesta de error
  tipos.ts              PeticionHttp, Respuesta, Autenticador
  enrutador.ts          rutas con parametros, metodo no permitido, 404
  limites.ts            cuerpo maximo, cubo de fichas
  ordenes.ts            alta idempotente, listado, retirada
  manejadores.ts        las siete rutas
  http.ts               servirHttp (adaptador node:http)
  prueba-comun.ts       autenticadorDePrueba y una API montada sobre una partida real
  *.test.ts
paquetes/servidor/src/persistencia/*            guardarOrden con turnoEsperado
paquetes/servidor/src/reloj/resolucion.ts       rechaza las de turno cerrado
```

## 6. Criterios de aceptación

1. **Fuga:** ninguna respuesta de ninguna ruta contiene datos de otro jugador (§4.9), recorrida sobre
   el JSON serializado para cada jugador de una partida de tres casas y cinco turnos.
2. **Cliente manipulado:** no puede dar una orden con el coste falsificado (se ignora y se recalcula),
   ni con `jugador`, `turnoAlta`, `estado` o cualquier campo extra (`400 orden-invalida`), ni sobre
   una comarca, recua o rebaño ajenos o que no conoce, ni para un turno cerrado (`409 turno-cerrado`),
   ni en una partida ajena (`404`).
3. **Idempotencia:** reenviar la misma intención no la duplica (`200`, misma orden); con contenido
   distinto, `409 clave-reutilizada`.
4. **Coste con la casa:** para cada tipo con coste, el de la orden guardada es el del núcleo con los
   modificadores efectivos de la casa del jugador (probado con dos casas distintas).
5. **La orden dada por la API la ejecuta el motor**: para cada tipo de intención, la orden guardada
   entra al motor sin lanzar error (una prueba por tipo con la partida real).
6. **Carrera:** una orden sellada con el turno N que llega tras resolverse el N recibe `409 turno-cerrado`
   y no toca nada; si ya estaba guardada como pendiente, el reloj la marca `rechazada` y **no detiene la
   partida**.
7. **Límites:** el cuerpo de más de 64 KiB, la orden 201 del turno y la petición 91 del minuto se
   rechazan con su código y mensaje.
8. **Retirada:** una pendiente propia se retira; una ya aplicada, rechazada o ajena no (`409`/`404`).
9. **Todos los errores** tienen código de `CODIGOS_DE_API`, mensaje en español y la versión de reglas.
10. **HTTP real:** el adaptador `node:http` sirve las rutas de verdad en un puerto libre (una prueba de
    extremo a extremo con `fetch`).
11. `npm run verificar` en verde; el núcleo sigue puro y no importa el servidor.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/servidor paquetes/nucleo/pruebas/intencion.test.ts
```

## 8. Al terminar

1. Índice: T-062 `hecha`.
2. `ESTADO.md`: siguiente tarea T-063; bitácora.
3. `docs/07-arquitectura.md` §7.4: rutas, frontera intención→orden, límites y decisión sobre Fastify.
4. Commit: `T-062: API de partida, órdenes y vista por jugador`.

## 9. Dónde va (25-09-2026)

**Hechas y verificadas las partes A y B.**

- **A · `paquetes/nucleo/src/ordenes/intencion.ts`** (exportada por el núcleo): `validarIntencion` (estricta:
  rechaza los diez campos internos, los que fijan las reglas —`acemilas`, `cabezas`— y cualquier campo
  extra; exige `idCliente`; `turnoProgramado` y `turnos` con su forma; la letra de cambio, desactivada) y
  `construirOrden` (comprueba propiedad y conocimiento, fija autor, turno, estado, cola y **coste con los
  modificadores de la casa**). Se reutiliza `validarOrdenEntrante` para la forma de cada tipo: la
  intención se valida como una orden con marcadores en los campos internos, y esos se sustituyen.
  35 pruebas: forma, cada campo interno, coste con dos casas, propiedad (comarca, recua, rebaño,
  conocimiento) y que **el motor acepta** una intención de cada tipo principal.
- **B · carrera de §4.8:** `Repositorio.guardarOrden(..., turnoEsperado?)` falla con `turno-cerrado` dentro de
  la misma transacción; `resolverUnTurno` rechaza (con motivo) las pendientes de un turno cerrado y **no
  detiene la partida**. Dos pruebas nuevas.

**Falta:** (C) `errores`, `tipos`, `enrutador`, `limites`, `ordenes`, `manejadores`; (D) la prueba de fuga
sobre tres casas, los criterios 7 y 10 (límites y HTTP real) y el adaptador `node:http`.
