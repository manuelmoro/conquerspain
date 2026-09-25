# T-059 · Las ferias se conocen y se buscan

**Fase:** 2 · Motor y banco · **Depende de:** T-053 · **Estado:** **hecha (v1; 25-09-2026), con su criterio 3 como excepción de T-047 v1**

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
2. `Recua` gana `enExpedicion: boolean`. Lo fija el cambio `recua-ruta` (que ya lleva `circular`)
   con lo que diga la orden, y lo apaga `recua-mover` cuando la recua queda quieta en una comarca
   **propia** con la ruta vacía. No hace falta un cambio nuevo.
3. `bastimentoDeLaRecuaMil(enExpedicion, casaMil, reglas)`: la fracción se aplica si la recua va de
   expedición (no depende del cometido, que se fija al llegar). El motor
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

### 8.5 Dónde va (24-09-2026)

**Implementado y verificado** (`npm run verificar`: 1054 pruebas). `OrdenRuta.expedicion`,
`Recua.enExpedicion`, `bastimentoDeLaRecuaMil` compartida por el motor y la previsión del robot,
`movimiento.bastimentoExploradoraMil: 250` y robots 10 (la exploradora planifica y pide sus
rutas con `expedicion`). Pruebas: función pura y cobro reducido en el motor, la bandera se fija con
la orden y se apaga solo al pisar comarca propia, y la previsión del robot pide menos pan.
Huellas de `humo-02` regeneradas (el estado gana un campo).

**La fracción, medida** (1492, tres semillas; `E-exp250`, `E-exp0`): con 0 la tierra mejora solo una
décima más que con 250 (35,1 frente a 35,6 % sin tocar en la primera semilla), así que **el pan ya
no es el freno** y se queda 250 —salir cuesta algo—. La 500 no se ha medido: 250 ya no es el cuello.

**Resultado, tres campañas** (`E-exp250-*` frente a `T-059-*`):

| Campaña | Filas que cumplen | Tierra sin tocar (por semilla) |
|---|---|---|
| 1492 | 120 → 116 | 44,2 / 38,0 / 41,8 → 35,6 / 30,3 / 32,7 |
| 1085 | 117 → 118 | 43,8 / 57,8 / 42,8 → 36,1 / 46,6 / 36,1 |
| 1212 | 118 → 116 | 55,4 / 63,9 / 50,6 → 45,4 / 54,6 / 39,4 |

Total **355 → 350**. Las filas perdidas son de escasez en el borde de la horquilla y una de
prestigio, sin patrón. **Adoptado por corregir algo indefendible** (media docena de casas no podían
explorar) y con una prueba que impide que vuelva; no mejora el recuento.

**Criterios de §8.4:** 1, 2, 3 y 5 se cumplen; **4 a medias** (la tierra baja en las nueve partidas,
pero ninguna casa vende en feria y el recuento queda en 350, no en 355).

**Lo que falta para las ferias:** la exploración sigue siendo lenta (8–24 comarcas conocidas por casa
a los 200 turnos) y los motivos que quedan son otros: la Mesta `sin-feria-al-alcance` (83 turnos) y
`sin-lana-que-vender` (102), los salineros `sin-pan-para-el-viaje` (64), y `esencial-sin-recursos`
en dos casas pobres. Es el mismo estudio de «qué frena a cada casa», ya sin el freno del pan.

## 9. El camino de la feria (medido el 24-09-2026, con `expedicion` ya en marcha)

Instrumentado `feriaAlAlcance` (1492, 200 turnos), por casa con mercancía de feria:

| Casa | Ferias conocidas | Con ruta conocida | Jornadas a la más cercana | Provisión |
|---|---|---|---|---|
| Mesta | 3 | 1 (en 332 de 359 miradas) | 8 (190), 13 (118), 9 (24) | `no-cabe` 320, ok 6, `sin-sal` 6 |
| Ferrones | 3 | 1 (en 87 de 281) | **21** | `no-cabe` 81, `demasiado-largo` 6 |
| Salineros | 3 | **0** | — | — |

**El viaje de feria es el mismo problema que era el de exploración:** ida y vuelta de 16 a 42
jornadas piden de 32 a 84 panes para un porte de 10, así que la mercancía no cabe con su comida. La
expedición no ayuda (no es un viaje de exploración). Tampoco la venta, todavía: `feriar` no lleva
bolsa (`provisionPara` sin `bolsaParaVentas`) y **no hay ventas en el camino de ninguna feria**
(los robots las plantan solo donde el arbitraje ve diferencia de precio, cerca de casa).

**Lo que la historia y el diseño ya dicen** (docs/03 §3.3, T-055): las ventas del camino de la lana
son justo lo que permitía llegar a Medina. Propuesta, solo del lado del robot, sin regla nueva:

1. **`feriar` lleva bolsa.** Igual que el arbitraje desde T-055, carga maravedís para comer en las
   ventas del camino y solo el pan que falte donde no las haya (`provisionPara(..., bolsaParaVentas)`).
2. **Ventas hacia la feria.** `plantarVentas` también planta, para las casas con mercancía de feria,
   ventas **en la ruta de la feria conocida** a intervalos de unas cuatro jornadas, en comarcas
   exploradas de nadie (T-053). Cuestan 10 de madera y 10 de piedra cada una: una vez puesta, es de
   quien pase (T-055), así que el coste es de quien madruga.
3. Nueva medida en las tres campañas: viajes de feria que salen y ventas hechas en feria.

**Criterio de cierre de T-059 (§5.3):** alguna casa hace ventas en feria en las tres campañas y el
capítulo de comercio del prestigio deja de ser 0. Si con esto no se cumple, el motivo que quede se
mide antes de tocar nada más (posibles: el porte para la lana misma, o que las ferias abren un solo
turno al año y la recua llega tarde).

### 9.1 Dónde va (25-09-2026)

**Implementado y verificado** (1056 pruebas): tres piezas.

1. **La comarca con feria da de comer** (motor, `daDeComerEn` en `reglas/bastimento.ts`): lo que
   faltaba de verdad. Una venta no hacía falta en el camino de la Mesta (la feria está a ≤ 4 jornadas
   de su última comarca propia); lo que costaba era **la vuelta desde la feria**, que salía de la
   carga. Pruebas en `venta.test.ts`.
2. **`feriar` lleva bolsa** de maravedís para comer en las ventas y ferias del camino
   (`bolsaDeFeria`, robots 11).
3. **`plantarVentasDeFeria`**: una posada cada cuatro jornadas en la ruta a la feria, encolada sin
   exigir que alcance hoy (el tratante compra lo que falte). En 1492 no llega a plantar ninguna: la
   ruta de cada casa ya empieza dentro de cuatro jornadas de lo propio o no tiene ruta explorada.
   Queda como capacidad y se decide su futuro con la medida (ver abajo).

**Medido, tres campañas** (`E-feria3-*` frente a `E-exp250-*`): filas que cumplen **350 → 352**; los
**salineros venden en feria en las tres** (ingresos de 73, 40 y 40) por primera vez en toda la
investigación; la tierra sin tocar igual. **Todavía cero ferias destacadas**: el capítulo de
comercio del prestigio sigue a 0 (hacen falta 500 maravedís de volumen propio en una feria y un
año, y un cargamento de sal son unas decenas).

**Criterio 3 de §5 («alguna casa hace ventas en feria en las tres campañas y el capítulo de comercio
deja de ser 0»):** **a medias**: lo primero se cumple; lo segundo no. T-059 sigue abierta.

**La Mesta sigue sin llegar** (`no-cabe` 237 de 332 miradas con bolsa 0): sus maravedís no pasan del
colchón y no lleva bolsa, y con bolsa aún no cabe (83 veces). Es un caso de la vía de la Mesta
(rebaños y obras se comen sus maravedís), no del camino.

### 9.2 Lo que queda para el capítulo de comercio (25-09-2026)

Medido con `plantarVentasDeFeria` corregida (la propia comarca de la feria contaba como posada y la
rutina creía la feria cerca) y con el colchón de la bolsa de feria de 60 a 10: **sin ningún cambio**
(117 filas, salineros 73 de ingresos de feria, Mesta 0). Descartados con su medida:

- **El dinero de la bolsa no ata a la Mesta**: bajar el colchón no mueve nada.
- **Las ventas del camino no ata**: en el camino de la Mesta ya hay una a 3 jornadas de la feria
  (Montes de Oca, hacia Alfoz de Burgos).

Lo que sí queda a la vista:

1. **La lana de la Mesta se malvende en casa** (320 vendidos, 0 en feria): `vender` en casa se
   salta lo que va a feria solo si la feria «está al alcance» (`feriaAlAlcance`), y el viaje de
   9–11 turnos (42–56 panes de 10 cargas) no cabe, así que se vende todo en la plaza de casa antes
   de que `feriar` lo pueda llevar. El nudo es circular: no llega porque no cabe, y no guarda
   porque no llega.
2. **Los salineros llevan una sola vez en 200 turnos**: son la casa atrapada de 1492 (95 % de los
   turnos sin proponer órdenes: `esencial-sin-recursos` y `sin-mercado-propio` en 199). Es un
   problema de su arranque, no de la feria.
3. **El umbral de 500 maravedís** de una feria destacada equivale a una recua entera de lana; una de
   sal vende unas decenas. Solo la Mesta puede llegar, y la Mesta no llega.

**Decisión para el usuario** (no se cambia a escondidas ninguna cifra de T-047 §5): o se rebaja el
umbral de la feria destacada a lo que vende un feriante corriente (tabla de prestigio, un solo valor),
o se resuelve primero la viabilidad de la Mesta como feriante (que guarde su lana para la feria
aunque hoy no le quepa el viaje, y que el viaje se dé en tramos con las ventas del camino).

### 9.3 La Mesta como feriante: lo que se ha medido y por qué queda abierto (25-09-2026)

Por decisión del usuario se intentó resolver la Mesta como feriante antes de cerrar T-047 v1. **No
se ha conseguido**, y estos son los ensayos, todos con las tres semillas de 1492 y **descartados**
(y revertidos):

| Ensayo | Resultado |
|---|---|
| `feriar` con bolsa de maravedís, colchón 60 → 10 | Igual: la bolsa no ata |
| Ventas hacia la feria (`plantarVentasDeFeria`), corregida (la feria no cuenta como posada) | Igual: en el camino ya hay una posada a 3 jornadas |
| El planificador cuenta lo cobrado en la feria para pagar la vuelta (`Parada.cobra`) | Igual |
| Guardar la lana en casa si hay feria con ruta conocida | **Peor**: la Mesta esquila 78 en vez de 363 y los salineros pierden su venta en feria (la lana se guarda para un viaje que no ocurre) |
| La posada da de comer hasta el pueblo siguiente (`ultimaComarcaPisada`) | Sin efecto para la Mesta y **los salineros pierden su venta en feria** |
| El tratante compra los materiales de las obras en espera por falta de recursos | Igual |
| Porte extra de la Mesta, +10 (dato) | Su prestigio sube 451 → 686 y se sale de la horquilla; **tampoco llega** |

**El límite es estructural.** Los tramos del catálogo miden de 4 a 10 jornadas y el bastimento se
cobra por turno: en cada turno que cae a mitad de tramo sale de la carga (6 panes). El viaje redondo
de la Mesta (cameros → Demanda → Montes de Oca → Alfoz de Burgos y vuelta) pide **13 a 28 panes**
aun con las posadas y la bolsa, para un porte de 10 que además ha de llevar lana. Una feria destacada
son 500 maravedís de volumen propio, y la lana vale 50 la carga: **el umbral es una recua entera de
lana**, que no cabe en la misma recua que su pan. Resolverlo pide una mecánica nueva (por ejemplo,
que una posada venda pan para el camino y se cargue allí, o caravanas de dos recuas que sumen volumen)
y es material de T-047 v2.
