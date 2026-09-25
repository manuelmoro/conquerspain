# 07 · Arquitectura técnica

Objetivo: un motor de reglas en el que se pueda confiar durante años de partidas, y alrededor de él
lo mínimo imprescindible. Si algo se puede sacar del motor, se saca.

---

## 7.1 Espacio de trabajo

Monorepo con espacios de trabajo de npm. Node 22 LTS, TypeScript 5 en modo estricto, ESM.

```
paquetes/
  nucleo/       @conquer/nucleo      reglas puras, sin E/S. No depende de nada más.
  mundo/        @conquer/mundo       datos del mundo + cargador y validador tipado.
  servidor/     @conquer/servidor    autoridad: persistencia, reloj, API.
  cliente/      @conquer/cliente     interfaz web (Vite).
herramientas/
  atlas/                             generación del mapa (TypeScript; lo que hoy es Python se porta).
  banco/                             banco de pruebas: partidas automáticas y medición de equilibrio.
```

Dependencias permitidas:

| Paquete | Puede depender de |
|---|---|
| `nucleo` | nada (ni `fs`, ni `window`, ni fechas del sistema) |
| `mundo` | `nucleo` (solo tipos) |
| `servidor` | `nucleo`, `mundo` |
| `cliente` | `nucleo`, `mundo` |
| `banco` | `nucleo`, `mundo` |

La regla «`nucleo` no depende de nada» se verifica con un test: si alguien importa `fs`, el test
falla.

## 7.2 El núcleo

### 7.2.1 Forma

```ts
// Una sola puerta de entrada al motor:
export function resolverTurno(
  estado: EstadoPartida,
  ordenes: readonly Orden[],
  mundo: Mundo,
  reglas: TablasDeReglas,
): ResultadoTurno;

export interface ResultadoTurno {
  estado: EstadoPartida;             // estado nuevo (el de entrada no se muta)
  cronicas: Record<IdJugador, Cronica>;
  sucesos: Suceso[];                 // registro completo, ordenado, para depurar y reproducir
}
```

Además:

```ts
export function validarOrden(estado, orden, mundo, reglas): ResultadoValidacion;
export function preverTurno(estado, ordenes, mundo, reglas): Previsiones;   // para la interfaz
export function hashEstado(estado): string;                                 // huella estable
```

### 7.2.2 Determinismo: cómo se garantiza

1. **Sin fuentes de no determinismo.** Prohibidos `Date`, `Math.random`, `process`, iteración sobre
   `Set`/`Map` sin orden explícito, y cualquier lectura del entorno. Regla verificada con lint y con
   un test que ejecuta el motor en un contexto congelado.
2. **Enteros.** Todas las magnitudes son enteros; las fracciones, en milésimas. Nada de coma
   flotante: ni en porcentajes, ni en precios, ni en distancias.
3. **Orden estable.** Toda iteración sobre jugadores, comarcas, recuas u órdenes se hace sobre
   listas ordenadas por identificador. Hay un ayudante `enOrden()` y está prohibido recorrer objetos
   sin él.
4. **Azar con semilla.** `rng(semillaPartida, turno, ambito, id)` → generador determinista
   (xoshiro128\*\* sobre enteros de 32 bits). Cada uso declara su ámbito, de forma que añadir una
   tirada en un sitio no desplaza las tiradas de otro.
5. **Serialización canónica.** `hashEstado` serializa con claves ordenadas y sin espacios, y aplica
   SHA-256. Dos ejecuciones idénticas dan la misma huella; la huella se guarda en cada turno.
6. **Tests de reproducción.** Partidas guardadas (estado inicial + órdenes de N turnos + huellas
   esperadas) que se vuelven a ejecutar en cada cambio. Si una huella cambia, el motor ha cambiado
   de comportamiento: o es intencionado y se regeneran las partidas, o es un fallo.

### 7.2.3 Estructura interna

```
nucleo/src/
  tipos/          estado, ordenes, mundo, reglas (solo tipos, sin lógica)
  datos/          tablas de equilibrio (edificios, casas, recursos, precios base)
  fases/          una carpeta por fase de resolución (01-calendario … 12-cronica)
  reglas/         funciones puras compartidas (produccion, movimiento, influencia, precios)
  utiles/         enteros, orden estable, rng, hash
  resolver.ts     orquesta las fases en orden
```

Cada fase es una función pura `(contexto) => contexto` con su propio archivo de tests. Añadir una
mecánica nueva es añadir una regla y engancharla en su fase, nunca tocar el orquestador.

### 7.2.4 Versionado

- `VERSION_REGLAS` (entero) sube con cada cambio que altere resultados.
- Una partida guarda la versión con la que se creó. El servidor **no** resuelve una partida con una
  versión de reglas distinta sin una migración explícita.
- Las migraciones viven en `nucleo/src/migraciones/` y también tienen tests.

## 7.3 Datos del mundo

- `paquetes/mundo/datos/mundo.v1.json`: comarcas, localidades, grafo de caminos, cañadas, ferias,
  patrimonio. Generado por `herramientas/atlas`, nunca editado a mano.
- `paquetes/mundo/datos/catalogo/*.jsonc`: **fuente** revisada a mano por regiones (lo que sí se
  edita). El generador la consume.
- Cargador tipado con validación en tiempo de ejecución (esquema propio, sin dependencias pesadas):
  si un dato no cuadra, falla al arrancar con un mensaje claro y la comarca culpable.

## 7.4 Servidor

- Node + Fastify. Persistencia: **SQLite** (fichero por instancia) en desarrollo y primeras
  partidas; capa de acceso aislada para poder pasar a Postgres sin tocar la lógica.
- **Persistencia** (T-060, `paquetes/servidor/src/persistencia/`): interfaz `Repositorio` asíncrona y
  una única implementación con SQL, `RepositorioSqlite`, sobre `node:sqlite` (viene con Node 22; es
  experimental y por eso está aislada en una sola clase).
  - Se guarda el **estado completo de cada turno**, en forma canónica comprimida con gzip, con su
    huella (se recalcula al leer: `huella-no-coincide` si no cuadra) y la firma del turno.
  - Tablas: `partida`, `participante`, `estado_turno`, `orden` (entrantes: solo se añaden y cambian de
    estado), `cronica`, `suceso_turno`, `auditoria_resolucion` y `migracion`. La clave `(partida, turno)`
    de estado y auditoría hace imposible guardar dos veces el mismo turno.
  - `guardarResolucion` escribe estado, crónicas, sucesos, auditoría, órdenes y avance de la partida en
    **una transacción**, o nada; falla con `conflicto-de-turno` si la partida ya no está en ese turno y
    con `encadenado-roto` si el estado nuevo no encadena con el guardado.
  - Migraciones versionadas y reversibles; una base más nueva que el servidor no se abre.
  - **Tamaño medido:** 200 turnos con ocho casas, 5,09 MB; 12 jugadores y 240 turnos, unos 12 MB.
- **Reloj de turnos** (T-061, `paquetes/servidor/src/reloj/`): calendario **anclado**
  (`proximaResolucion = ancla + N·intervalo`), recuperación **en cadena** tras una caída (con tope por
  pasada), concurrencia optimista (conflicto de turno = trabajo descartado, no error), detención de la
  partida si el motor falla y `reproducirTurno` para reproducir cualquier turno pasado contra su
  auditoría. Detalle en [T-061](plan/T-061-reloj-de-turnos.md). Descripción original:
  un proceso de resolución que despierta, busca partidas con
  `proxima_resolucion <= ahora` y las resuelve una a una.
  - Idempotente: la resolución del turno N se guarda en una transacción junto con el avance del
    número de turno; si el proceso muere a medias, al reiniciar no duplica nada.
  - Con bloqueo por partida, para que dos instancias no resuelvan lo mismo.
  - Registro de auditoría: estado de entrada (huella), órdenes, huella de salida, duración.
- **API** (T-062, `paquetes/servidor/src/api/`): sin Fastify, sobre `node:http` con un enrutador
  mínimo; el corazón es una función pura `PeticionHttp → RespuestaHttp` que se prueba sin puerto y un
  adaptador de veinte líneas. **La frontera de confianza** es `validarIntencion` + `construirOrden` (en el
  núcleo): el cliente manda intenciones y el servidor fija autor, turno, estado, cola y **coste** con los
  modificadores de la casa. Límites: 64 KiB por cuerpo, 200 órdenes pendientes por jugador y turno, 60
  peticiones por minuto (ráfaga de 30) por cuenta. Descripción original de las rutas:
  - `POST /partidas`, `GET /partidas/mias`
  - `GET /partidas/:id/estado` → la vista **de ese jugador**, ya filtrada por su niebla
  - `POST /partidas/:id/ordenes`, `DELETE /partidas/:id/ordenes/:orden`
  - `GET /partidas/:id/cronica/:turno`
  - `GET /partidas/:id/clasificacion`
  - `GET /partidas/:id/eventos` (SSE: «turno resuelto»)
- **Nunca** se envía al cliente información que su jugador no debe ver. El filtrado se hace en el
  servidor, sobre el estado completo, con una función del núcleo (`vistaDeJugador`).
- Cuentas (T-063, `paquetes/servidor/src/cuentas/`): **solo enlace mágico** por correo (sin contraseñas, así que
  nada que guardar ni filtrar, y sin `argon2`, que exige una dependencia nativa). El envío va tras la interfaz
  `EnviadorDeCorreo` (SMTP en T-064). Tokens de 256 bits de los que **solo se guarda el SHA-256**; sesión con
  cookie `HttpOnly; Secure; SameSite=Lax` firmada con HMAC y caducidad absoluta de 30 días; misma respuesta
  exista o no el correo; límites por correo y origen; borrado que anonimiza y deja al jugador vivo hasta T-105.

## 7.5 Cliente

- TypeScript + Vite, sin framework de interfaz. El atlas es SVG con D3 solo para el zoom y el
  Voronoi; el resto es DOM directo, como en la maqueta, que ya demostró que da el resultado que
  queremos con muy poco peso.
- Arquitectura: `estado remoto` (lo que manda el servidor) + `órdenes locales pendientes`. La
  previsión de la interfaz («si hago esto, mi balance queda así») se calcula con el **mismo núcleo**
  compilado para el navegador.
- Renderizado del mapa por capas, con las capas caras (terreno, niebla) cacheadas y solo repintadas
  cuando cambian.
- Objetivo de rendimiento: 60 fps al desplazar el mapa en un móvil de gama media, y menos de 1,5 s
  desde abrir la partida hasta ver el atlas con datos.

## 7.6 Pruebas

| Tipo | Qué cubre | Dónde |
|---|---|---|
| Unitarias | Cada regla: producción, merma, movimiento, precios, influencia | `nucleo/**/*.test.ts` |
| De fase | Una fase completa con un estado de ejemplo | `nucleo/src/fases/**` |
| De propiedad | Invariantes: no hay recursos negativos, el pan nunca queda en deuda, la suma de influencia es coherente | `nucleo/pruebas/propiedades` |
| De reproducción | Partidas guardadas con huellas esperadas | `nucleo/pruebas/partidas` |
| De equilibrio | Partidas automáticas de 200 turnos con jugadores artificiales por casa | `herramientas/banco` |
| De interfaz | Recorridos críticos (crear partida, dar orden, ver crónica) | `cliente/pruebas` |

`npm run verificar` = tipos + lint + unitarias + reproducción. Es lo que tiene que pasar antes de
cerrar cualquier tarea.

## 7.7 Jugadores artificiales (banco de pruebas)

No son una IA rival del juego: son **robots de prueba** que juegan cada casa con una estrategia
escrita a mano y sirven para medir el equilibrio y detectar bloqueos (T-046).

- Uno por casa, con su plan (trashumante, ferrón, cantero…), escrito con prioridades legibles.
- **Juegan limpio**: deciden solo con la vista de su jugador. El mundo lo miran a través de un
  tablero que lo filtra por lo que conocen, y hay un test que les cambia el mundo y el estado justo
  donde el jugador no mira y exige las mismas órdenes.
- Deterministas: mismo mapa y misma semilla, misma partida; y mismo informe, byte a byte.
- Usan colas, plan de temporada y mayordomo, así que la misma estrategia vale entrando cada turno o
  cada seis: el informe compara las dos cadencias por casa (docs/02 §2.5).
- Producen un informe (`herramientas/banco/informes/<fecha>-<semilla>.md`): prestigio por turno y por
  capítulos, población, maravedís, comarcas, producción por recurso y por edificio, comercio, obras,
  jornadas, turnos con escasez y turnos sin decisión útil; más cinco alertas de salud del juego y una
  tabla de si cada casa juega su vía.
- El informe se guarda y se compara entre versiones (`npm run banco:comparar`) para ver el efecto de
  un cambio de equilibrio.

```bash
npm run banco -- --semilla 1492 --turnos 200 --casas todas --repeticiones 3 [--escenario hambre]
npm run banco:comparar -- informes/antes.csv informes/despues.csv
```

## 7.8 Despliegue (cuando toque)

- Un contenedor con el servidor y el cliente estático servido por el mismo proceso.
- Copias de seguridad diarias de la base de datos y de los registros de auditoría de resolución.
- Sin proveedor elegido todavía; nada del diseño depende de uno concreto.

## 7.9 Lo que NO se va a hacer

- Nada de reglas en la base de datos ni en el cliente.
- Nada de resolver turnos «al abrir el navegador».
- Nada de dependencias grandes en el núcleo.
- Nada de números mágicos dentro de la lógica: todo a las tablas de datos.
