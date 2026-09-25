# T-061 · Reloj de turnos idempotente con auditoría

**Fase:** 3 · Servidor · **Depende de:** T-060 · **Estado:** **hecha (25-09-2026)**

## 1. Contexto

El corazón del juego asíncrono: un proceso que resuelve los turnos a su hora, aunque nadie esté
conectado, y que jamás resuelve dos veces el mismo turno. T-060 dejó la persistencia: el
`Repositorio` ya sabe guardar la resolución de un turno **en una transacción o nada**
(`guardarResolucion`), rechaza el mismo turno dos veces (`conflicto-de-turno`) y encadena las huellas.
Esta tarea pone encima **quién decide cuándo resolver, qué se resuelve y qué hacer si algo falla**.

Lee antes: [docs/07-arquitectura.md](../07-arquitectura.md) §7.4, [docs/02-diseno-nucleo.md](../02-diseno-nucleo.md)
§2.4 y [T-060](T-060-persistencia.md) §4 a §6.

## 2. Objetivo

Resolución programada, transaccional, idempotente y auditada, con protección frente a dos
instancias, en `paquetes/servidor/src/reloj/`.

## 3. Alcance

**Entra:** el cálculo de la próxima resolución, la resolución de un turno de una partida
(`resolverUnTurno`), el reloj que despierta y recorre las partidas debidas (`Reloj`), la recuperación
tras una caída, la detención de una partida cuyo motor falla, el avance manual de las partidas de
prueba, la reconstrucción del mundo de una partida y la reproducción auditada de un turno pasado.

**No entra:** avisos al jugador (T-064), API (T-062), cuentas (T-063), interfaz (fase 4). Las
órdenes llegan **ya validadas por la API**; el reloj solo las vuelve a comprobar contra el mundo.

## 4. Decisiones

### 4.1 El calendario está anclado, no acumula deriva

La partida tiene `ancla` (instante del turno 1, en ms Unix) e `intervaloSegundos`. El **turno N**
transcurre en `[ancla + (N−1)·I, ancla + N·I)` y se resuelve al **acabar**: su `proxima_resolucion` es

```
proximaResolucion(N) = ancla + N · intervaloSegundos · 1000
```

Se calcula siempre desde el ancla, **nunca** desde el instante en que acabó el cálculo anterior: si
resolver tarda 800 ms, el turno siguiente no se retrasa. `crearPartida` (T-060) ya deja la del turno 1
así. Función pura `proximaResolucion(ancla, intervaloSegundos, turno)` con su prueba.

### 4.2 Tras una caída se resuelve **en cadena**

Si el servidor estuvo caído tres horas y el intervalo es de una, al volver hay tres turnos debidos.
**Se resuelven todos, en orden, uno tras otro**, porque el calendario del mundo no espera a nadie: las
recuas siguen andando, las estaciones cambian y los acontecimientos anunciados ocurren. Lo que
haya pendiente de órdenes entra en el **primer** turno de la cadena y los demás turnos van sin órdenes
nuevas (nadie ha podido darlas). Salvaguardas:

- **Tope por pasada** (`maximoDeTurnosPorPasada`, 24 por defecto): una partida muy atrasada no deja
  sin servicio a las demás; la siguiente pasada sigue donde quedó.
- Cada turno de la cadena es su propia transacción: si el tercero falla, los dos primeros quedan.

### 4.3 Dos instancias no resuelven lo mismo: concurrencia optimista

No se añade una columna de bloqueo (habría que migrar y caducar arrendamientos). La resolución es
**determinista**, así que dos instancias que resuelvan el mismo turno calculan **lo mismo**; la que
guarda primero gana, y la otra recibe `conflicto-de-turno` de `guardarResolucion` (comprueba
`turno_actual` **dentro** de la transacción `BEGIN IMMEDIATE`) y descarta su trabajo sin escribir.
Además, dentro de un proceso, un cerrojo por partida evita calcular dos veces lo mismo. El
conflicto **no es un error**: se anota en el registro y se sigue.

### 4.4 Qué pasa si el motor falla

Cualquier excepción al resolver (del motor, de una huella que no cuadra, de un mundo que no
coincide, de una versión de reglas ajena) **detiene la partida**: `estado = 'detenida'`,
`proxima_resolucion = NULL` y el `motivo_detencion` con el mensaje. **No se pierde nada**: el último
estado guardado está intacto. Se anota en el registro como error y queda a la vista de quien opere
(T-064 lo convertirá en aviso). Un `conflicto-de-turno` no detiene nada.

### 4.5 Las órdenes

Las pendientes de la partida entran al motor en el primer turno que se resuelve. Antes se comprueban
con `validarOrdenEnMundo` contra el mundo de la partida: la que no vale se marca `rechazada` (motivo:
el mensaje del validador) y **no** entra. Las que entran quedan `aplicada` con `turno_aplicada = N`;
lo que el juego haga con ellas (esperar, cancelarse, cumplirse) es cosa del estado y de la crónica.

### 4.6 El mundo de la partida se reconstruye

El estado no guarda el mapa; el motor lo necesita. El mundo de una partida es el **recorte** que
produce `prepararPartida` con el mundo completo, la semilla y los participantes: es determinista, así
que el servidor lo **reconstruye** (`mundoDeLaPartida`) y comprueba que su huella es la
`huella_mundo` guardada al crear la partida. Si no coincide, la partida se detiene con el motivo
`mundo-no-coincide` (el atlas cambió desde que se creó). Se guarda en una caché por partida.

### 4.7 Avance manual

`Reloj.avanzarManual(id, ahora)` resuelve **un** turno ahora mismo, sin esperar a la hora, y **solo**
si `de_prueba = 1`; en una partida de verdad lanza un error que dice por qué. Recoloca
`proxima_resolucion` con la misma fórmula (4.1): el avance manual no desplaza el calendario.

### 4.8 Auditoría reproducible

Cada turno resuelto deja su fila de `auditoria_resolucion` (T-060) con las huellas de entrada, de
salida y de las órdenes, la duración y las versiones. **`reproducirTurno(repo, id, turno)`** relee
el estado guardado del turno N, las órdenes que entraron en él (`ordenesDelTurno`, nuevo en el
repositorio), vuelve a llamar al motor y compara la huella obtenida con la de la auditoría. Devuelve
`{ coincide, esperada, obtenida }`: si no coincide, el motor cambió **o** los datos se corrompieron.

## 5. Piezas

```
paquetes/servidor/src/reloj/
  calendario.ts          proximaResolucion, turnosDebidos (puro)
  mundoDeLaPartida.ts    recorte determinista + comprobación de su huella
  resolucion.ts          resolverUnTurno: un turno de una partida, con todas sus salvaguardas
  reloj.ts               Reloj: pasada(ahora), iniciar(), parar(), avanzarManual()
  auditoria.ts           reproducirTurno
  registro.ts            interfaz Registro (info, aviso, error) y uno que guarda en memoria
  *.test.ts
paquetes/servidor/src/persistencia/repositorio.ts   + ordenesDelTurno, proximaHora
paquetes/servidor/src/persistencia/sqlite.ts        idem
```

Dependencias inyectadas (para probar sin relojes ni motores reales): `ahora()`, la función
`resolverTurno`, el `proveedorDeMundo` y el `Registro`.

## 6. Criterios de aceptación

1. **Caída a mitad:** un fallo inyectado justo después de calcular y antes de guardar (o dentro de la
   transacción) no duplica ni corrompe nada; la pasada siguiente resuelve ese turno **una sola vez**.
2. **Doble resolución imposible:** resolver el turno N dos veces (dos relojes sobre la misma base, con
   una carrera provocada a mitad del cálculo) guarda **un** turno; el otro registra el conflicto y no
   escribe.
3. **A su hora:** una partida con intervalo de 1 s resuelve con **menos de 2 s** de desviación
   (`auditoria.resueltaEn − proximaResolucion`), con el reloj real y con el simulado.
4. **Recuperación en cadena:** con tres turnos debidos, una pasada guarda los tres, en orden, con las
   órdenes pendientes solo en el primero; con el tope a 2, la siguiente pasada guarda el tercero.
5. **Motor que falla:** la partida queda `detenida` con su motivo, el último estado intacto, y las
   demás partidas se siguen resolviendo.
6. **Sin deriva:** el calendario sale del ancla (`proximaResolucion` es función pura de ella), aunque
   resolver tarde.
7. **Avance manual** solo en partidas de prueba y sin mover el calendario.
8. **Auditoría:** `reproducirTurno` devuelve `coincide: true` para cada turno de una partida de 20
   turnos con órdenes, y `false` (con las dos huellas) si se altera el estado guardado o se sustituye
   el motor por uno distinto.
9. **Órdenes inválidas** se marcan rechazadas con su motivo y no entran al motor.
10. `npm run verificar` en verde y el núcleo sigue puro.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/servidor
```

## 8. Al terminar

1. Índice: T-061 `hecha`.
2. `ESTADO.md`: siguiente tarea T-062; bitácora.
3. `docs/07-arquitectura.md` §7.4: reloj, recuperación y auditoría.
4. Commit: `T-061: reloj de turnos idempotente con auditoría`.

## 9. Cierre (25-09-2026)

**Hecha.** `paquetes/servidor/src/reloj/` (`calendario`, `mundoDeLaPartida`, `resolucion`, `reloj`,
`auditoria`, `registro`), dos métodos nuevos en el repositorio (`ordenesDelTurno`, `proximaHora`) y la
API pública exportada desde `paquetes/servidor/src/index.ts`. 19 pruebas nuevas (44 en el servidor;
1099 en total).

**Criterios:**

1. **Caída a mitad:** un proceso que muere justo antes de guardar (la llamada nunca vuelve) no deja
   nada, y el proceso nuevo, sobre la misma base, resuelve ese turno una sola vez.
2. **Doble resolución:** con una carrera provocada (el segundo reloj resuelve entero mientras el primero
   está a punto de guardar), el primero recibe el conflicto, lo registra y no escribe; queda un solo
   turno guardado.
3. **A su hora:** con el reloj real, intervalo de 1 s y sondeo de 200 ms, todas las resoluciones caen
   entre 0 y 2 s de su hora (`resueltaEn − proximaResolucion`). Con el reloj simulado: nada un
   milisegundo antes, y el turno en punto.
4. **Recuperación en cadena:** con tres turnos debidos, una pasada guarda los tres en orden y encadenados
   (`huellaEntrada` de cada uno = `huellaSalida` del anterior), con la orden pendiente solo en el
   primero; con tope 2, la siguiente pasada guarda el tercero.
5. **Motor que falla:** la partida queda `detenida` con el motivo y `proxima_resolucion` a `NULL`, su
   último estado intacto y la otra partida se resuelve; una detenida no se vuelve a tocar. Una versión
   de reglas ajena también la detiene.
6. **Sin deriva:** resolver con 40 minutos de retraso deja el turno siguiente en `ancla + 2·I`.
7. **Avance manual:** solo en partidas de prueba (`no es de prueba` si no) y sin mover el calendario.
8. **Auditoría:** `reproducirTurno` da `coincide: true` en cada uno de los 20 turnos de una partida con
   órdenes (con las órdenes que entraron en cada uno), y `false` con un motor distinto y con un estado
   guardado alterado (aunque se le ponga su huella al día).
9. **Órdenes inválidas:** una que cita una comarca inexistente queda `rechazada`, no entra, y la
   resolución registra que rechazó una.
10. `npm run verificar` en verde.

**Decisiones no escritas antes:**

- **Sin columna de bloqueo:** la concurrencia optimista (la comprobación de `turno_actual` dentro de la
  transacción de T-060) más un cerrojo por partida dentro del proceso bastan; una carrera solo cuesta
  calcular dos veces. Si algún día el cálculo se encarece, se añade un arrendamiento en una migración 2.
- **El mundo se reconstruye** con `prepararPartida(recortar, origenesFijos: {})`, y **eso no vale si
  T-065 crea partidas con orígenes fijos** (escenarios): entonces habrá que guardar el recorte o los
  orígenes fijos junto a la partida. Queda anotado como riesgo para T-065.
- **Cualquier error al resolver detiene la partida**, salvo el conflicto de turno y un bloqueo
  transitorio de la base (`database is locked`), que se reintenta en la pasada siguiente.
- Las órdenes deben llevar como `turnoAlta` el turno de la partida cuando llegaron: lo sella la API de
  T-062 (el motor lo exige); el reloj no lo cambia.
