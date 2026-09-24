# T-059 · Las ferias se conocen y se buscan

**Fase:** 2 · Motor y banco · **Depende de:** T-053 · **Estado:** en curso

## 1. Contexto

Nace de [T-047](T-047-equilibrio-v1.md) y del criterio 3 de [T-053](T-053-plazas-donde-comerciar.md),
por medición, el 24-09-2026. **Ningún robot pisa una feria en doscientos turnos**: el capítulo de
comercio del prestigio, que cuenta ferias destacadas, vale 0 para las ocho casas en las nueve
partidas. La Mesta, que es quien tiene mercancía de feria, vende sus 434 sacas de lana en el mercado
de su capital: no conoce ninguna feria, y su robot solo las busca entre las comarcas ya exploradas.

Es un contrasentido de diseño. Las ferias son *«citas fijas del calendario»* ([docs/05 §5.6](../05-geografia.md)),
*«el acontecimiento anual, el punto de encuentro»* ([docs/03 §3.10.1](../03-economia.md)), y la
interfaz enseña a todos el calendario de ferias ([docs/08 §8.2.7](../08-interfaz.md)). Medina del
Campo no era un secreto.

Medido antes de escribir esta ficha: dar las ferias de oídas **sin más** no cambia nada (ensayo
`E-feriasOidas`, 118 filas igual, cero ingresos de feria). Para llegar hay que ir por comarcas
exploradas, y ningún explorador abre camino hacia una feria.

## 2. Objetivo

Que todo jugador sepa desde el principio dónde están las ferias del reino, y que el robot de una
casa con mercancía de feria explore hacia la más cercana cuando no alcance ninguna.

## 3. Alcance

**Entra:** el conocimiento inicial de las ferias (motor), lo que el tablero del robot sabe de una
comarca oída y la elección del explorador (banco).

**No entra:** el calendario, el volumen de las ferias ni el umbral de la feria destacada.

## 4. Diseño

### 4.1 Las ferias se saben de oídas

Al fundar la partida, cada jugador conoce **de oídas** todas las comarcas con feria (las que no
conozca ya mejor). De oídas no se sabe su geografía, solo que está ahí y cuándo abre: el calendario
es público.

### 4.2 Lo que sabe el robot de una comarca oída

Su nombre, **dónde está en el mapa** (su centro, que el atlas dibuja para todos) y, si tiene feria,
la feria con su calendario. Nada de su geografía económica. El tablero lo documenta en su cabecera
y `robots.test.ts` sigue vigilando que no se filtren potenciales ni rasgos.

### 4.3 El explorador que busca feria

Una casa con mercancía de feria (`perfil.feria` no vacío) cuyo feriante no alcanza ninguna feria
elige, entre las oídas a las que puede ir y volver, **la más cercana en el mapa a la feria oída más
próxima**, en vez de la más cercana a la recua. Así cada salida abre camino hacia la feria.

### 4.4 Piezas

- `paquetes/nucleo/src/partidas/fundar.ts`: las comarcas con feria, de oídas.
- `herramientas/banco/src/robots/tablero.ts`: `centroDe` y las ferias de las comarcas oídas.
- `herramientas/banco/src/robots/impulsos.ts`: la elección del explorador.
- Documentación: docs/03 §3.10.1 y docs/05 §5.6.

## 5. Criterios de aceptación

1. Al fundar, todo jugador conoce de oídas las comarcas con feria (probado).
2. El tablero da el centro y la feria de una comarca oída, y ni un potencial (probado).
3. Alguna casa hace ventas en feria en las tres campañas, y el capítulo de comercio deja de ser 0.
4. El recuento no empeora respecto a `T-047-metricas5` (353).
5. `npm run verificar` en verde.

## 6. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --evaluar --fecha T-059
```

## 7. Dónde va (24-09-2026)

**Entregado y verificado:** §4.1 a §4.3. Las ferias se saben de oídas al fundar (prueba en
`canyadas.test.ts`); el tablero da el centro y la feria de una comarca oída y nada de su geografía
(prueba en `robots.test.ts`, cuya manipulación del mundo conserva ya lo público de lo oído); y el
explorador de una casa con mercancía de feria abre camino hacia la más cercana. Robots 9.

**Lo medido** (`T-059-*` frente a `T-047-metricas5-*`): recuento **355** (120 / 117 / 118) frente a
353. Pero **sigue sin haber una sola venta en feria**. La traza de motivos de una partida lo explica:

| Casa | Lo que la frena |
|---|---|
| Mesta | «no conoce ninguna feria a la que llegar y volver» (126 turnos). Su exploradora no existe: se mermó y no se vuelve a formar («recua-sin-formar», 17) |
| Ferrones | «ninguna oída al alcance del porte y el bastimento» (107 turnos) |
| Salineros | lo mismo (132 turnos), y además sin mercado propio en 199 |

**El cuello de botella es el alcance de exploración**: con diez cargas de porte y dos panes por
jornada, una exploradora no pasa del primer anillo alrededor de lo propio. Es el mismo que deja
entre el 38 % y el 62 % del mapa sin tocar (criterio `tierra` de T-047).

**Criterios:** 1, 2, 4 y 5 se cumplen; **el 3 no**. **Falta:** que una exploradora pueda ir más
lejos que su pan, que es trabajo de T-047 (comer en las ventas con bolsa, como el arbitraje desde
T-055, o reponer en plazas por el camino).

## 8. La exploradora vive de la tierra (diseño del 24-09-2026)

### 8.1 Lo medido

La causa de que casi nadie explore está cerrada y es de **logística**, no de robot: instrumentado el
motivo real de `sin-oida-al-alcance` (1492, 200 turnos) es siempre **`no-cabe`**: el pan y la sal de
un viaje redondo pesan más que el porte. Jornadas hasta la oída más cercana desde la capital:
ferrones 10, Mesta 10, arrieros 6, canteros 5, salineros 4, mercaderes 4; una recua carga pan para
unas cinco jornadas. Con eso, de 208 comarcas una casa conoce entre 2 y 17 tras 200 turnos.

**Los dos ensayos de bastimento anteriores (`E-exploradora500`, `E-vive0`) eran inválidos.** El robot
planificaba con un bastimento menor, pero el motor cobra el bastimento entero porque el `cometido`
de la recua se fija **al llegar**: en ruta es `null` y no sabe que va de exploración. La recua salía
con poco pan y perdía acemillas por el camino (10 → 9 → 7 → 4 → 1 en una traza de los ferrones).
`E-vive0` mejoró el recuento a 123 por rebote (los viajes malviviendo no exploran, pero tampoco
gastan pan de casa); la tierra no se movió. Los valores se han revertido.

### 8.2 Regla, en una frase para el jugador

**Una expedición vive de la tierra: la recua que sale a explorar come una fracción de lo corriente
(`movimiento.bastimentoExploradoraMil`) desde que sale hasta que vuelve a casa.** Se descartó
acortar los saltos del catálogo (reescribe la geografía por un problema de logística) y más porte
(ensayado sin efecto). La fracción es una cifra de equilibrio de la tabla; se ensaya con 0, 250 y
500 y se elige por la medida, no por el gusto.

### 8.3 Diseño

1. `OrdenRuta` gana `expedicion: boolean` (por defecto `false`). La orden es la que sabe que el
   viaje es de exploración: la ejecuta el motor **antes** de que la recua ande.
2. `Recua` gana `enExpedicion: boolean`. Se pone a `true` al ejecutarse una `ruta` con
   `expedicion` y se apaga cuando la recua está quieta en una comarca **propia** con la ruta vacía.
   Cambio nuevo `recua-expedicion` con su invariante y sucesos como el resto.
3. `bastimentoDelCometidoMil` (ya probada en el ensayo) pasa a `bastimentoDeLaRecuaMil(recua, …)`:
   la fracción se aplica si `recua.enExpedicion` o `recua.cometido === 'explorar'`. El motor
   (`fases/04-movimiento.ts`) y la previsión del robot (`robots/viaje.ts`) llaman a la misma
   función, y `metricas.ts` cuenta con ella el bastimento trazado.
4. El robot pide `expedicion: true` en las dos rutas del viaje de exploración (ida y vuelta a lo
   propio) y en la siguiente comarca de una cadena; `siguienteAExplorar` planifica con la recua
   marcada como en expedición.
5. Sube `VERSION_ROBOTS` a 10 y las huellas de reproducción se regeneran (el estado gana un campo);
   se comprueba que los **sucesos** de las fases 1 a 12 son idénticos en las partidas de humo.

### 8.4 Criterios (además de los del §5)

1. Una recua en expedición no pierde acemillas por falta de bastimento en una salida cuyo plan cabe
   (prueba de motor con la ruta de dos turnos y una comarca oída).
2. La misma ruta sin `expedicion` cuesta el bastimento de siempre (prueba de que no se abarata
   nada más).
3. `enExpedicion` se apaga al llegar a casa y no queda a `true` en ningún estado guardado que llegue
   a una comarca propia con la ruta vacía (invariante).
4. Tres campañas con la fracción elegida: **la tierra sin tocar baja** frente a 38–64 %, alguna casa
   vende en feria (criterio 3 de §5) y el recuento no baja de 355.
5. `npm run verificar` en verde y el núcleo sigue puro.
