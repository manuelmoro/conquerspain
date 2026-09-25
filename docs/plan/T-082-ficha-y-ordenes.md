# T-082 · Ficha de comarca y bandeja de órdenes con previsión

**Fase:** 4 · Cliente · **Depende de:** T-081 · **Estado:** **hecha (25-09-2026)**; checkpoint J-01 **pendiente** de sesión humana

## 1. Contexto

Donde se juega. Toda acción debe enseñar su coste, su duración y su efecto previsto antes de
confirmarla, y todo bloqueo debe explicar su causa y ofrecer salida.

Lee antes: [docs/08-interfaz.md](../08-interfaz.md) §8.2.5 y §8.3.

## 2. Objetivo

Ficha de comarca completa y bandeja de órdenes con previsión, reserva de recursos y
cancelación.

## 3. Alcance

**Entra:** ficha, acciones, previsión, bandeja, cancelación, colas y plan de temporada en la interfaz.

**No entra:** mercado (T-084) ni crónica (T-085).

## 4. Puntos que hay que resolver al detallar

- Cómo se enseña el desglose de un número (producción = base × potencial × estación…), sin agobiar.
- Presentación de los motivos de bloqueo con su acción de arreglo.
- Bandeja: qué está reservado, qué se puede cancelar y cuánto queda para el corte.
- Edición de colas y del plan de temporada en móvil.

## 5. Criterios de aceptación provisionales

1. Ninguna acción se puede confirmar sin ver antes coste, duración y previsión.
2. Todo bloqueo muestra causa y salida.
3. Reservado, disponible y producido se distinguen visualmente y no se confunden.

### Checkpoint humano

Al terminar la implementación, realizar **J-01** antes de continuar con T-083: comprensión de
recursos, elección, envío y cancelación de órdenes con la interfaz disponible. Registrar la sesión
según [checkpoints-jugabilidad.md](checkpoints-jugabilidad.md); si el usuario aún no ha jugado,
dejar J-01 pendiente en ESTADO. No exigir todavía crónica completa ni mercado.

## 4 bis. Diseño (detallado el 25-09-2026)

1. **La ficha se compone en el núcleo** (`fichaDeComarca(estado, jugador, comarca, mundo, reglas)`), la sirve el
   servidor (`GET /partidas/:id/comarcas/:comarca`) y el cliente la pinta. Lo propio sale del estado; lo ajeno y
   neutral, de la vista (T-044). Si el jugador no sabe nada de la comarca, no hay ficha (`404 comarca-desconocida`).
2. **Cada acción lleva coste, turnos y efecto previsto** (`AccionDeFicha`). El coste sale de `costeDeIntencion`
   (T-080), el mismo que usa el servidor al dar la orden. El efecto de construir, derribar y aperos es **la
   producción recalculada con un nivel más o menos**, con la misma función que la fase 2
   (`datosDeProduccion`, extraída de la fase para que prevea igual). La previsión supone que no faltan insumos.
3. **Los bloqueos dicen causa y salida** (tabla `BLOQUEOS` en el núcleo): nivel máximo, sin solar, potencial,
   edificio requerido, permiso, roturar sin monte o prohibido, aperos al máximo, incorporar (con su dueño,
   influencia, ventaja, distancia, escasez) y regalo reciente. **La incorporación se juzga con lo que el
   jugador sabe** de las demás casas (las influencias ajenas de su vista), no con la influencia real: la
   ficha no puede filtrar por ahí la niebla.
4. **La producción se enseña sin agobiar**: lo producido en el último turno en una línea
   (`produccionUltimoTurno`); el desglose (base × factores) plegado en un `<details>`.
5. **La bandeja separa tres cosas**: **disponible** (almacén − reservado), **reservado** (lo apartado por lo que
   está en marcha) y **producido** (el último turno, sumando las propias); y dice cuánto falta para el corte.
   Las órdenes se ven en tres grupos: *por enviar* (este dispositivo, con previsión), *enviadas hasta el
   corte* (retirables) y *en marcha* (en el juego, con su estado y motivo de espera).
6. **Colas y plan en móvil**: las órdenes que esperan en una misma cola se suben y bajan con ↑↓, que mandan la
   orden `cola` con la lista entera; al confirmar una acción se elige «ahora» o uno de los seis turnos
   siguientes (`turnoProgramado`, el plan de temporada).
7. **Para J-01**: `POST /partidas/:id/avanzar` resuelve un turno ya, solo en partidas de prueba, y
   `npm run partida:prueba -- correo [casa]` deja una partida de prueba lista en la base de desarrollo (el alta
   desde la interfaz es T-086).

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-082: <resumen>`.

## 8. Cierre (25-09-2026)

**Hecha la implementación.** Núcleo: `ficha.ts`, `datos/bloqueos.ts`, `datosDeProduccion` extraída de la fase 2
(las huellas de reproducción no cambian). Servidor: rutas de ficha y de avance, y la herramienta
`partida:prueba`. Cliente: `bandeja.ts`, `pantallas/ficha.ts`, la bandeja nueva en `pantallas/partida.ts` y el
almacén con `cargarEnviadas`, `retirar`, `pedirFicha`, `avanzar` y `abrirComarca`. 17 pruebas nuevas; 1234 en total.

**Criterios:**

1. **Nada se confirma sin ver coste, duración y previsión:** toda acción de la ficha los trae (probado para todas
   las de una comarca propia y una neutral); el botón «Dar la orden» está en la confirmación, después de verlos, y
   deshabilitado si hay bloqueo. El coste de cada acción libre es exactamente el de la orden que se da.
2. **Todo bloqueo muestra causa y salida:** probado para cada motivo del núcleo, con un caso real de solar lleno,
   regalo reciente e influencia baja.
3. **Reservado, disponible y producido separados:** `resumenDeRecursos` los calcula aparte (probado contra la vista
   de una partida real) y la bandeja los pinta en filas distintas.

**Checkpoint J-01 — pendiente.** Requiere una sesión humana; no se declara hecho. Cómo prepararlo:
`npm run partida:prueba -- tu@correo.es [casa]`, `npm run dev`, abrir `http://localhost:5173`, entrar con el correo
(el enlace sale en la consola) y abrir la partida. Registrar la sesión en
[checkpoints-jugabilidad.md](checkpoints-jugabilidad.md).
