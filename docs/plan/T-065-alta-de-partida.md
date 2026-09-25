# T-065 · Alta de partida: casa, sorteo de orígenes y recorte de mapa

**Fase:** 3 · Servidor · **Depende de:** T-062, T-049 · **Estado:** **hecha (25-09-2026)**

## 1. Contexto

Crear una partida es elegir mundo, ritmo, casa y capital. El sorteo de orígenes tiene que ser
justo, reproducible y guardado.

Lee antes: [docs/04-casas-y-tradiciones.md](../04-casas-y-tradiciones.md) §4.2 y [docs/05-geografia.md](../05-geografia.md) §5.7.

### Separación de responsabilidades (19-09-2026; T-049 hecha el 21-09-2026)

El recorte, las ofertas de origen y el arranque puro **ya están hechos** en
[T-049](T-049-preparacion-pura-de-partidas.md). Esta ficha consume ese contrato, persiste las
ofertas y elecciones y permite crear/unirse a partidas. No debe mantener otro algoritmo de
recorte ni una copia de las tablas de arranque.

**El contrato que hay que consumir** (`paquetes/nucleo/src/partidas/`):

```ts
prepararPartida({ mundo, reglas, semilla, participantes, recortar?, origenesFijos? })
  → Resultado<{ mundo, ofertas, avisos, comarcas, intentos }>
fundarPartida({ preparada, reglas, semilla, participantes, elecciones, configuracion, id })
  → Resultado<EstadoPartida>
```

Lo que le toca al servidor, y que T-049 deja fuera a propósito:

- **Persistir** el mundo recortado y las ofertas antes de preguntar. `prepararPartida` sortea y no
  funda justamente para eso: recargar no vuelve a sortear.
- Enseñar las tarjetas (`ventaja`, `limitacion`, `perfil`) y recoger la elección de cada jugador.
- Llamar a `fundarPartida` cuando estén todas; sus errores ya vienen con ruta y mensaje en español
  (elección que no estaba entre las ofertas, jugador sin elegir, capitales demasiado cerca).
- Publicar los `avisos` (a alguien le cupieron menos de tres ofertas) en el alta, no esconderlos.
- No tocar `origenesFijos` salvo para escenarios declarados: en una partida normal se sortea.

Los puntos heredados de abajo explican los requisitos que motivaron la extracción; **ya resueltos
en T-049**: algoritmo de recorte, sorteo con separación, distancia mínima entre capitales y
economía de arranque por origen. Aquí quedan la persistencia, la unión de participantes y la API.

## 2. Objetivo

Crear partidas con su semilla, su recorte de mapa, su casa elegida y sus tres orígenes
sorteados y persistidos.

## 3. Alcance

**Entra:** creación y unión de participantes, persistencia de ofertas y elecciones, y consumo del preparador de T-049 para recorte y fundación de capitales.

**No entra:** emparejamiento automático ni partidas públicas (más adelante).

## 4. Puntos que hay que resolver al detallar

- ~~Algoritmo de recorte~~ **hecho en T-049** (`recortarMundo`): región contigua con sal, hierro,
  pan, feria y pastos dentro, y su horquilla medida.
- ~~Sorteo de tres orígenes de perfiles distintos con separación~~ **hecho en T-049**
  (`ofertasDeOrigen`): cualquier combinación de elecciones respeta las seis jornadas.
- **Persistencia del sorteo: recargar no vuelve a sortear.** Esto sigue siendo de esta ficha.
- ~~Distancia mínima entre capitales~~ **hecha en T-049**: 6 jornadas base, en la tabla `recorte`.
- **Semilla privada:** no sale por la API ni por las ofertas de origen, como exige docs/02 §2.6
  y prueba T-044. La antigua propuesta de hacerla visible contradecía la niebla. Cualquier
  publicación posterior requerirá una política de final de partida explícita; no se añade aquí.
- ~~**Economía de arranque**~~ **hecha en T-049** (`arranqueDe`): los edificios se ajustan a la
  población, a la labor y a la vía de la casa, y hay una prueba de viabilidad por perfil de origen.
  El alta solo tiene que llamarla a través de `fundarPartida`.

- ~~**Sustituir el alta provisional del banco**~~ **hecho en T-049**: `herramientas/banco/src/partida.ts`
  es ya un adaptador de `prepararPartida`/`fundarPartida`, con recorte y arranque por origen. El
  servidor tiene que usar el mismo contrato, no copiarlo.

## 4 bis. Diseño (detallado el 25-09-2026)

### 4.1 La convocatoria

Antes de la partida hay una **convocatoria**: quién juega y con qué casa. `prepararPartida` necesita los
participantes para recortar y sortear, así que el flujo es:

1. **Convocar** — `POST /convocatorias` `{ nombre, casa, intervaloMinutos, plazas, esDePrueba? }`: la cuenta
   que convoca entra con su casa. Devuelve el `id` y un **código de invitación** (128 bits aleatorios): no hay
   partidas públicas ni emparejamiento (fuera de alcance), se entra por invitación.
2. **Unirse** — `POST /convocatorias/unirse` `{ codigo, casa, nombre? }`. **Una casa por partida** («cada casa
   juega a un juego distinto») y una plaza por cuenta; como mucho `plazas` (1 a 8).
3. **Sortear** — `POST /convocatorias/:id/sortear`, solo quien convocó y solo si está `abierta`: el servidor
   genera la **semilla** (256 bits aleatorios, nunca sale por la API), llama a `prepararPartida` y **guarda** las
   ofertas, los avisos y la huella del mundo recortado en la misma transacción que pasa la convocatoria a
   `eligiendo`. Recargar lee lo guardado: **no vuelve a sortear**.
4. **Elegir** — `POST /convocatorias/:id/eleccion` `{ comarca }`, entre las propias ofertas. Cuando el último
   elige, el servidor llama a `fundarPartida` y guarda la partida (`crearPartida`, con la cuenta de cada
   jugador) con `id = id de la convocatoria`, y la convocatoria pasa a `fundada`. Si dos eligen a la vez y los
   dos intentan fundar, el segundo encuentra `partida-duplicada` y se limita a leerla.
5. **Consultar** — `GET /convocatorias/mias` y `GET /convocatorias/:id` (solo quien está dentro): estado,
   nombre, casas y nombres visibles de las plazas (nunca las cuentas ni los correos), **mis** ofertas con sus
   tarjetas (`nombre`, `perfil`, `ventaja`, `limitacion`), mi elección, quién falta por elegir (sin decir qué
   eligieron los demás), los avisos del sorteo y, si está fundada, el id de la partida. Quien convocó puede
   ver también el código; los demás ya lo tenían.

### 4.2 Reglas del alta

- Los jugadores son `id = casa` (una casa por partida lo permite y lo hace legible).
- Ritmo: `intervaloMinutos` ∈ {60, 360, 1440} (docs/02 §1); una partida **de prueba** admite cualquier entero
  de 1 a 10 080 y el avance manual de T-061. `modo` = `solitario` con una plaza, `vecindad` con más.
- `origenesFijos` no se usa: en una partida normal se sortea. Así el mundo de la partida **siempre** se puede
  reconstruir con semilla y participantes (el riesgo que anotó T-061 queda cerrado por construcción), y la
  huella guardada lo comprueba.
- La partida empieza al fundarse: `ancla = ahora` y la primera resolución a `ancla + intervalo`.
- Los errores del preparador y del fundador (vienen con ruta y mensaje) se devuelven como están.

### 4.3 Esquema (migración 4, `0004-convocatorias`)

```sql
CREATE TABLE convocatoria (
  id TEXT PRIMARY KEY, nombre TEXT NOT NULL, creador TEXT NOT NULL REFERENCES cuenta(id),
  codigo TEXT NOT NULL UNIQUE, intervalo_minutos INTEGER NOT NULL, plazas INTEGER NOT NULL,
  de_prueba INTEGER NOT NULL, semilla TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('abierta','eligiendo','fundada')),
  ofertas TEXT, avisos TEXT, huella_mundo TEXT, partida TEXT, creada_en INTEGER NOT NULL
) STRICT;
CREATE TABLE plaza_convocatoria (
  convocatoria TEXT NOT NULL REFERENCES convocatoria(id), cuenta TEXT NOT NULL REFERENCES cuenta(id),
  casa TEXT NOT NULL, nombre TEXT NOT NULL, eleccion TEXT, orden INTEGER NOT NULL,
  PRIMARY KEY (convocatoria, cuenta), UNIQUE (convocatoria, casa)
) STRICT;
```

La semilla se guarda (hace falta para fundar y para reconstruir el mundo) pero ninguna ruta la lee.

### 4.4 Piezas

`persistencia/convocatorias.ts` (interfaz), métodos en `RepositorioSqlite`, `altas/servicio.ts`
(`ServicioDeAltas`: convocar, unirse, sortear, elegir, ver), y las rutas en la API.

## 5. Criterios de aceptación

1. Con la misma semilla y participantes, el recorte y el sorteo son idénticos (lo guardado es igual a lo
   recalculado, y el mundo reconstruido por el reloj coincide con la huella guardada).
2. Ningún jugador empieza a menos de la distancia mínima de otro: con ocho casas, cualquier combinación de
   elecciones probada funda sin error (el fundador lo comprueba).
3. Cada casa recibe orígenes viables: por cada casa, una convocatoria en solitario sortea, funda con cada una
   de sus ofertas y la partida resuelve turnos sin error.
4. El sorteo persiste: releer la convocatoria (y otro servicio sobre la misma base) da las mismas ofertas.
5. La semilla no sale por ninguna ruta; un jugador no ve las ofertas ni la elección de otro.
6. Reglas: casa repetida, plaza llena, código falso, sortear sin ser quien convoca, elegir fuera de las
   ofertas o fuera de plazo, ritmo no admitido: cada uno con su código y mensaje en español.
7. Fundada, la partida aparece en `GET /partidas/mias` de cada jugador y el reloj la resuelve.
8. Migración 4 aplica, es idempotente y se revierte. `npm run verificar` en verde.

## 5 bis. Cierre (25-09-2026)

**Hecha.** `paquetes/servidor/src/altas/servicio.ts` (`ServicioDeAltas`), la migración `0004-convocatorias`,
`persistencia/convocatorias.ts` (interfaz que implementa `RepositorioSqlite`) y seis rutas: `POST /convocatorias`,
`GET /convocatorias/mias`, `POST /convocatorias/unirse`, `GET /convocatorias/:id`, `POST /convocatorias/:id/sortear`
y `POST /convocatorias/:id/eleccion`. 14 pruebas nuevas; 1198 en total.

**Criterios:**

1. **Reproducible:** las ofertas y la huella del mundo guardadas son las que salen de volver a llamar a
   `prepararPartida` con la misma semilla y participantes, y el reloj reconstruye el mundo de la partida fundada
   y la resuelve (su huella coincide con la guardada).
2. **Distancia:** con las ocho casas, tres combinaciones distintas de elecciones fundan sin error (el fundador
   rechazaría capitales demasiado cerca).
3. **Viables:** para cada una de las ocho casas, una partida en solitario funda con cada una de sus tres ofertas y
   resuelve dos turnos sin error (24 partidas).
4. **Persiste:** otro `ServicioDeAltas` sobre la misma base devuelve las mismas ofertas; sortear dos veces da
   `convocatoria-cerrada`.
5. **Privado:** la semilla no aparece en ninguna respuesta; cada jugador ve solo sus ofertas; el código solo lo ve
   quien convocó; quien no está dentro recibe `convocatoria-desconocida`.
6. **Reglas:** nombre vacío, casa inexistente, ritmo no admitido (normal: 60/360/1440; de prueba: 1–10 080),
   plazas fuera de 1–8, código falso, casa ocupada, ya dentro, llena, sortear sin convocar, elegir fuera de las
   ofertas, elegir antes del sorteo o después de fundar, y unirse tras el sorteo: cada uno con su código.
7. **Fundada:** la partida aparece en `GET /partidas/mias` de cada jugador y el reloj la resuelve.
8. Migración 4 en la prueba de migraciones; `npm run verificar` en verde.

**Decisiones no escritas antes:** el id de la partida es el de la convocatoria (`p-<12 hex>`); el jugador es su casa;
la partida empieza al fundarse (`ancla = ahora`); dos últimas elecciones a la vez fundan una sola vez (el segundo
encuentra `partida-duplicada`); si al fundar el sorteo ya no sale igual (cambió el atlas o las reglas), se detiene
con un error claro en vez de fundar un mapa distinto del que se enseñó. Sin `origenesFijos`, el riesgo de T-061
queda cerrado por construcción.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-065: <resumen>`.
