# T-104 · Clasificación pública y temporadas

**Fase:** 5 · Multijugador · **Depende de:** T-101 · **Estado:** **hecha (10-11-2026)**

## 1. Contexto

Para que haya competición de verdad hace falta un marcador público y un corte. Lee antes
[docs/06-competicion.md](../06-competicion.md) §6.3 y §6.7.

**Lo que ya existe:**

- La **clasificación en vivo**, con desglose por capítulos, primicias e hitos (T-043 y T-085:
  `reglas/clasificacion-publica.ts`, pestaña «Clasificación»). Se recalcula cada turno en la fase 11.
- `ConfiguracionPartida.turnosDeTemporada` y el modo `temporada`, que nadie usaba: el alta siempre
  ponía `null`.
- La tabla `partida` admite el estado `terminada`, que nadie ponía.

## 2. Diseño

### 2.1 Crear una partida de temporada

- La convocatoria lleva `turnosDeTemporada` (migración 7: columna `turnos_de_temporada`, nula en las
  abiertas). El formulario de convocar ofrece «Temporada de diez años (240 turnos)» o «Partida
  abierta, sin final».
- El número sale de la tabla: `prestigio.turnosDeTemporada` (240). Con temporada y más de un jugador,
  el modo es `temporada`; en solitario sigue siendo `solitario`, con su final igual.

### 2.2 El cierre, en el motor

- **Cuándo:** en la fase 11, después de la clasificación, en el turno `turnosDeTemporada`. Se apunta en
  el estado `cierre: CierreDeTemporada` (opcional en el validador, para que las partidas viejas se sigan
  leyendo con la misma huella).
- **Qué guarda:** el turno, la clasificación final (jugador, puesto, prestigio) y los reconocimientos.
- **Reconocimientos** (`reglas/temporada.ts`), uno por capítulo, al primero en él:

  | Reconocimiento | Se mide por |
  |---|---|
  | Mayor población | capítulo `poblacion` del prestigio |
  | Mayor obra | capítulo `obras` |
  | Mejor comerciante | capítulo `comercio` |
  | Mayor red de caminos | capítulo `caminos` |
  | Mejor trashumancia | capítulo `ganaderia` (años trashumantes); el registro no guarda el mejor año, y un año suelto premiaría la suerte |

  Solo hay reconocimiento si el mejor tiene más de 0. **Empates:** gana el de más prestigio; si siguen,
  el de menor identificador (regla explícita y determinista).
- **La crónica** lo anuncia a todos: `temporada.cerrada` (quién gana) y un `temporada.reconocimiento`
  por cada uno.
- **Después del cierre** el motor no resuelve más turnos: `resolverTurno` rechaza un estado cerrado con
  un error que lo explica.

### 2.3 El cierre, en el servidor

- Tras guardar el turno que cierra, el reloj marca la partida como `terminada` y sin próxima resolución
  (`repo.terminarPartida`). No se aceptan órdenes (ya se rechazaban fuera de `activa`).
- **Lo que se puede seguir consultando:** todo. La vista del último estado, la crónica de cada turno
  (historial), la clasificación con su desglose y el atlas. Lo único que se congela es el estado: no
  hay más turnos.

### 2.4 En el cliente

- **La cabecera** de una partida de temporada dice «turno 37 de 240».
- **Partida terminada:** una tarjeta «Temporada cerrada» arriba de la clasificación con el podio, los
  reconocimientos y tu puesto; la bandeja de órdenes no se ofrece.
- **Que informe sin desanimar:** la clasificación dice a cada uno **su mejor capítulo** y su puesto en
  él («Vas 2.º en obras»), y cuánto le falta para el puesto de arriba.
- **Mis partidas** marca las terminadas («Temporada cerrada · 3.º de 5») y siguen abriéndose.

## 3. Criterios de aceptación

1. Una temporada se cierra sola en su turno 240 y publica la clasificación y los reconocimientos.
2. La partida cerrada se puede consultar entera, con su crónica; no admite órdenes ni más turnos.
3. La clasificación en vivo se actualiza cada turno con su desglose, y cada jugador ve su mejor capítulo.
4. Las partidas abiertas no se cierran nunca.

## 4. Verificación

**Hecho:** `nucleo/pruebas/temporada.test.ts` (cierre en su turno, abiertas sin cierre, nada después,
vista pública, reconocimientos y desempates), `servidor` (alta con y sin temporada; el reloj deja la partida
`terminada`, sin próxima resolución y con su crónica) y `cliente/src/temporada.test.ts` (mejor capítulo y
cierre en palabras).


`npm run verificar`, con pruebas del motor (cierre en su turno, reconocimientos y desempates, nada
después del cierre, abiertas sin cierre), del servidor (alta con temporada, migración, partida que pasa a
terminada y sigue consultable) y del cliente (mejor capítulo, cabecera).

ar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-104: <resumen>`.
