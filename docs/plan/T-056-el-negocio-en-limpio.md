# T-056 · El negocio se cuenta con el precio que se espera

**Fase:** 2 · Motor (banco de pruebas) · **Depende de:** T-055 (su mecánica) · **Estado:** hecha (24-09-2026)

## 1. Contexto

Nace de la medición de [T-055](T-055-la-venta-da-de-comer.md) el 24-09-2026, cuando la venta ya
da de comer a las recuas y el sitio en la recua deja de ser el muro. El hallazgo, en una frase:

> **Ni con la comida gratis en la venta aparece un negocio: el robot cuenta la ganancia con los
> límites de la orden, no con el precio que espera.**

La cota se midió con `ventaCobraMil: 0` (la venta no cobra) en la campaña `1492`: cero negocios, y
el motivo dominante del mercader pasa a ser «ningún viaje deja ganancia después del bastimento»
(134 turnos). El volcado del turno 160, repetición 1:

```
capital segria  maravedis 107  bolsa 47
urgell-i-segarra -> monegros  sal  pa=9800 pb=12600  hueco=8  n=3  bruto=22  bast=8  neto=-10
monegros -> bajo-martin       pan  pa=2100 pb=2400   hueco=8  n=8  bruto=2   bast=8  neto=-12
```

Dos cosas, las dos del robot y ninguna del motor:

1. **La ganancia se calcula con los precios acolchados.** `negocioDe` (banco,
   `robots/arbitraje.ts`) paga al precio máximo de la orden (+20 %) y cobra al mínimo (−10 %). Es
   el peor caso, no el esperado: un colchón del 30 % que se come cualquier diferencia menor, y la
   mejor de la partida es del 28 % (sal de 9800 a 12600). Los límites tienen que seguir holgados
   —medido en T-055 §8: con un 5 % la compra se cae por precio—, pero **la cuenta** debe hacerse
   con lo que se espera pagar y cobrar.
2. **La bolsa es corta.** El mercader tiene 107 maravedís en el turno 160 y guarda 60 de colchón:
   47 para comprar y comer en las ventas. Con eso compra tres cargas de sal. Un fondo de comercio ya
   se ensayó en T-055 §6 y se descartó *por ahora* («ahorrar para un comercio que aún no existe es
   peor que construir»): vuelve a medirse aquí, cuando el punto 1 deje un comercio que exista.

## 2. Objetivo

Que la rutina de arbitraje decida con la **ganancia esperada** y siga poniendo en la orden los
**límites holgados**, y medir si con eso aparece el comercio.

## 3. Alcance

**Entra:** la cuenta de la ganancia en `robots/arbitraje.ts` (precio esperado de compra y venta,
comisiones y bastimento), y el fondo de comercio si la medición lo pide. Sube la versión de los
robots.

**No entra:** el motor. Ni la venta (T-055), ni el precio (T-052, T-054), ni el porte o el
bastimento (descartados en T-055 §6).

## 4. Diseño

### 4.1 La plaza se pregunta, no se adivina

El motor casa una orden al precio **después** del impulso que ella misma provoca
(`casarPlaza`: `p1 = nuevoPrecioMil(p0, desequilibrio)`), con los mercaderes menores cubriendo el
cupo del otro lado mientras el precio esté en su banda. Así que el precio esperado no es una
corazonada: es lo que devuelve `casarPlaza` con **la línea del propio robot sola**. El robot se
pregunta a la plaza lo que haría el motor con su orden:

```
esperadoEn(plaza, recurso, operacion, cantidad, limiteMil, fondos) =
  casarPlaza({
    precioMil:  precio sabido de la plaza,
    recurso:    { ...reglas.recursos[r], precioBaseMil: precio sabido },
    tope:       topeDeVolumen(volumen de la plaza),
    lineas:     [ la del robot, con la comision de su casa en esa plaza ],
    tabla, desempate: () => 0,
  }).lineas[0]            → { casada, importe, comision }
```

**Por qué el base es el precio sabido.** Desde T-054 el base de una plaza depende de lo que alcanza
en todo el mapa, y la niebla le oculta al jugador los potenciales de lo que no ha explorado: el
`baseEn` del tablero no lo puede saber. El precio que dice el ventero cada turno es la mejor
estimación del equilibrio que tiene el jugador, y suponerla equilibrio deja a los menores en su
banda y mide solo **lo que mueve la plaza su propia orden**. Es el deslizamiento: comprar ocho cargas
de sal en una plaza pequeña (tope 40) la encarece un 5 % antes de pagar.

### 4.2 La cuenta del negocio

En `negocioDe` (banco, `robots/arbitraje.ts`):

1. **Compra esperada**: `esperadoEn(compra, r, 'comprar', cantidad, precioMaximoMil, paraComprar)`.
   Si casa 0, no hay negocio.
2. **Venta esperada**: `esperadoEn(venta, r, 'vender', casada, precioMinimoMil, 0)`.
3. `ganancia = (venta.importe − venta.comision) − (compra.importe + compra.comision) − bastimento`.
4. La orden sigue saliendo con los **límites holgados** (puja +20 %, rebaja −10 %) y con la cantidad
   que casa la compra esperada. La **bolsa** que se carga sigue siendo el peor caso —la cantidad al
   precio máximo con comisión—: si no, la compra se cae por `sin-fondos` en cuanto el precio sube.

**El riesgo** no necesita regla propia: el límite de venta ya lo acota. Si la plaza de venta cae por
debajo del mínimo, la recua no vende y vuelve con la mercancía, que se venderá en otro viaje
(`venderLoQueLleva`); lo que se pierde es el bastimento del viaje.

### 4.3 El fondo de comercio

Solo si, con 4.1 y 4.2, los negocios aparecen pero se quedan pequeños por la bolsa. Se mide antes
de decidir y cada ensayo va a la bitácora.

### 4.4 Piezas

- `herramientas/banco/src/robots/tablero.ts`: `PlazaConocida` gana su `volumen` (el de la feria
  del atlas; `pequenya` en una plaza local, como en el motor).
- `herramientas/banco/src/robots/arbitraje.ts`: `esperadoEn` y la cuenta nueva de `negocioDe`.
- `herramientas/banco/src/robots/arbitraje.test.ts` (o el de robots que ya lo cubra): una prueba
  de que la ganancia esperada casa con lo que el motor cobra y paga de verdad.
- `herramientas/banco/src/version.ts`: robots 6.

## 5. Criterios de aceptación

1. `negociosRentables` deja de ser 0 en al menos una casa y una campaña (el criterio 2 de T-055).
2. La ganancia media de los negocios hechos es **positiva** en el recuento real del banco: la
   esperada no puede ser una ilusión.
3. El recuento de criterios no empeora respecto a la base `T-055b-*` (116 / 118 / 114).
4. `npm run verificar` en verde.

## 6. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --evaluar --fecha T-056
npm run banco:comparar -- herramientas/banco/informes/T-055b-1492.csv herramientas/banco/informes/T-056-1492.csv
```

## 7. Dónde va (24-09-2026)

**Entregado y verificado:** la cuenta de §4.1 y §4.2. `esperadoEn` pregunta a `casarPlaza` qué
haría el motor con la orden sola en la plaza, y `negocioDe` cuenta la ganancia con eso; la orden
sigue saliendo con los límites holgados y la bolsa del peor caso. Pruebas en
`herramientas/banco/src/robots/arbitraje.test.ts`: la propia compra encarece la carga sin pasar del
límite, sin fondos no casa, y la diferencia del 28 % de la sal deja ganancia esperada donde la
cuenta con los límites daba pérdida. Robots 6.

**Lo medido:** la campaña `1492` da **exactamente las mismas cifras** que `T-055b`. La traza de la
rutina (quitada después) dice por qué:

1. **La bolsa en los turnos de decisión es de 1 a 9 maravedís.** El mercader y el arriero viven en
   el colchón de 60: no compran ni una carga, así que la cuenta nueva ni llega a usarse.
2. **Ni con 150 maravedís hay un viaje con ganancia.** Tanteado a mano en los mismos turnos, el
   mejor pierde 18 (lana de Pallars a Segrià); la sal de Bureba a Odra-Pisuerga, con su 28 %, pierde
   53: nueve cargas ganan 25 en bruto y el viaje come 43 de pan del almacén y 40 en las ventas.

**La causa, en las tablas.** Un escalón de abundancia es un 10 % del precio de catálogo cada 3
jornadas (`jornadasPorEscalonDeAbundancia`). Para la sal son **0,47 maravedís por carga y jornada**;
para el hierro, 0,8. La recua come 2 panes por jornada a unos 2,4: **0,6 por carga útil y jornada**,
y **1,2** contando la vuelta en vacío. **Llevar sal o hierro pierde dinero por construcción**, antes
de comisiones y deslizamiento. Ningún robot, por listo que sea, encuentra un negocio que las tablas
no permiten; y el fondo de comercio (§4.3) no sirve de nada mientras sea así.

Las tres campañas (`T-056-*`, robots 6) dan **exactamente las mismas cifras** que `T-055b`: 116 /
118 / 114.

**Ensayo medido y revertido:** `jornadasPorEscalonDeAbundancia` 3 → 1, el precio cambia un escalón
por jornada en vez de por tres (informe `E-escalon1-1492`). **Cero negocios**, el recuento baja a
115 y la escasez a 10 filas (antes 9). Con más margen, la bolsa sigue siendo de 1 a 9 maravedís:
**hay dos muros a la vez, el margen y el dinero**, y cada uno tapa lo que haría quitar el otro.

**Criterios:** el 1 y el 2 no se cumplen (no hay negocios); el 3 (116 / 118 / 114, igual) y el 4
(`verificar`) sí.

**Falta: una decisión de diseño, pendiente del usuario.** Qué debe valer mover mercancía frente a lo
que come la recua: un gradiente de precio que pague el camino (y con él un fondo de comercio, que
solo sirve si hay negocio), abaratar lo que cuesta llevar la carga, o aceptar que el arbitraje
suelto no es vía hasta que lleguen los caminos y las ferias (T-013, T-014) y dar a los mercaderes
otra. Escrito con cifras en la [bitácora de equilibrio](bitacora-equilibrio.md).

### Después de la decisión del usuario (24-09-2026)

El usuario eligió **que la distancia pague el camino**, con un fondo de comercio. El gradiente va
en [T-057](T-057-la-distancia-paga-el-camino.md), porque es regla del motor; aquí queda el fondo.

**El fondo de comercio** (§4.3, robots 8). La bolsa de la recua de comercio **viaja cargada y no se
descarga al volver**: en el almacén se la comerían las obras de la cola en cuanto hubiera con qué
empezarlas, y los maravedís de una recua no los toca ninguna. Sin negocio a la vista, la recua la
rellena con lo que sobra por encima del colchón, hasta 200. Si la casa pasa hambre, la bolsa vuelve
al almacén. Dos ensayos para llegar ahí, los dos medidos:

| Regla del fondo | Resultado |
|---|---|
| Se guarda siempre | Los arrieros de Lugo guardan 400 maravedís en dos recuas paradas mientras la casa pasa 31 turnos de escasez (1085-2): 118 → 111 en esa campaña |
| Vuelve a casa si hay escasez **o** el almacén baja del colchón | Lo segundo pasa casi siempre en una casa que construye: la bolsa vuelve cada turno y **no queda un solo negocio** en 1492 |
| **Vuelve a casa solo si hay escasez** | Adoptada. Con T-057, 181 negocios en nueve partidas |

Medido aparte, el fondo **ayuda**: sin él, con el precio de T-057, 1085 y 1212 dan 111 y 111; con
él, 110 y 111 pero con el comercio funcionando (en 1085 sin fondo no hay ni un negocio).

**Criterios, con `T-057-*`:**

| # | Criterio | Estado |
|---|---|---|
| 1 | `negociosRentables` > 0 | **Cumple**: arrieros en las tres campañas (9 a 48 por partida), mercaderes en las tres |
| 2 | Ganancia media positiva | **Cumple**: +7209 en 181 negocios; una sola partida en negativo (mercaderes 1085, −44 en 4) |
| 3 | El recuento no empeora (116 / 118 / 114) | **No cumple**: 120 / 110 / 111 |
| 4 | `verificar` | **Cumple** |

**Falta:** el criterio 3. La pérdida no viene del robot ni del fondo, sino del precio nuevo (T-057
§7): se cierra cuando T-047 recupere el recuento.

## Cierre (24-09-2026)

El criterio 3 se cumple con las iteraciones de T-047 que vinieron después: la Mesta conoce sus
cañadas y trashuma (T-058) y el invierno aprieta al 50 %. Base `E-invierno500` (robots 8):
**118 / 116 / 119 = 353**, frente a los 348 de la base de antes del comercio (116 / 118 / 114). En
total queda por encima; por semillas, 1492 y 1212 por encima y 1085 dos filas por debajo (116
frente a 118). El comercio sigue en marcha en las tres campañas.
