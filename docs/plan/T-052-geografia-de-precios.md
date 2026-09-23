# T-052 · Geografía de precios

**Fase:** 2 · Motor · **Depende de:** T-048, T-050 · **Estado:** hecha (23-09-2026)

## 1. Contexto

Esta ficha nace de una medición de [T-047](T-047-equilibrio-v1.md), anotada en la
[bitácora de equilibrio](bitacora-equilibrio.md) el 23-09-2026. El hallazgo, en una frase:

> **El precio base de cada recurso es un número global, así que la sal de Añana vale lo mismo que
> la de Sevilla y comerciar no puede pagar el camino.**

Las cifras que lo demuestran, sobre las nueve partidas de la base de T-051 y las tres de
`T-047-hierro-*`:

- `negociosRentables`, `ventasFuera` e `ingresosDeFeria` valen **0 en las nueve partidas**.
- Al turno 100, entre las diez plazas de una partida, la dispersión de precios es de **0,0 puntos
  en la lana, 0,4 en el hierro y 0,6 en la sal**. Solo se mueven el pan (16,2) y la piedra (8,6),
  que son lo que los jugadores producen y vuelcan en su propia plaza.
- Cuatro de los nueve capítulos del prestigio —comercio, ganadería, industria y caminos— dan **cero
  a todas las casas**, porque ninguno se puede alcanzar sin comerciar.

Y lo que ya se ha probado y **no** lo arregla, medido y anotado en la bitácora: abaratar el
bastimento a la mitad, subir el colchón de maravedís del arranque, abaratar la sal de la lonja,
bajar la liquidez de los mercaderes menores a un 30 % y estrechar su margen al 2 %. Ninguno crea un
solo negocio rentable, porque **ninguna cifra puede abaratar la sal donde hay salinas si solo existe
un número para la sal**.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.1 y §3.10,
[docs/01-vision.md](../01-vision.md) §1.2.

## 2. Objetivo

Que la geografía se note en el precio: lo que sobra en una comarca vale menos allí y lo que no hay
cuesta más. Con eso, llevar mercancía de donde abunda a donde falta paga el camino, y las casas que
viven del comercio —mercaderes, arrieros y la Mesta— tienen por fin economía.

Es el principio que el proyecto ya tiene escrito («la geografía real manda: dónde hay sal, hierro,
lana, pastos o piedra decide tu estrategia») y que hoy el mercado no cumple.

## 3. Alcance

**Entra:** el precio base **por comarca**, derivado de sus potenciales, y su propagación a todo lo
que hoy usa el precio base global.

**No entra:** el equilibrio de las cifras resultantes. Los valores de partida de esta ficha son
deliberadamente redondos; afinarlos es trabajo de T-047, que se reanuda con la base nueva.

**Tampoco entra:** cambiar la casación, el cupo de los menores, la regresión ni la horquilla. Esta
ficha cambia **a qué precio regresa cada plaza**, no cómo se mueve.

## 4. Diseño

### 4.1 El precio base de una comarca

Cada recurso tiene un potencial que lo produce. El precio base de ese recurso en una comarca es el
precio base del catálogo multiplicado por un factor de abundancia que depende de ese potencial:

```
precioBaseLocalMil(recurso, comarca) = precioBaseMil(recurso) × abundanciaMil[potencial]
```

La correspondencia es una tabla cerrada, una sola por recurso:

| Recurso | Potencial | Por qué |
|---|---|---|
| pan | `labor` | el pan sale de la tierra de labor |
| madera | `monte` | el monte |
| piedra | `piedra` | la cantera |
| sal | `sal` | las salinas y las marismas |
| hierro | `hierro` | las venas de mineral |
| lana | `pasto` | donde pace el ganado |
| maravedís | ninguno | es la moneda: factor 1000 siempre |

Un puerto de mar come pescado, pero **el pan sigue mirando a `labor`**: Bilbao importaba grano y lo
pagaba caro, y eso es justo la decisión que se quiere. No se mezcla `pesca` en el precio del pan.

### 4.2 La tabla de abundancia

En `datos/mercado.ts`, indexada por el potencial 0…5:

```ts
/** Lo que sobra vale menos donde sobra; lo que no hay, cuesta mas traerlo. */
abundanciaMil: [1400, 1200, 1100, 1000, 900, 800],
```

Cifras de partida, para que T-047 las afine. Lo que hacen hoy, con el catálogo real:

- La **sal** existe en 12 comarcas de 403 (391 tienen `sal 0`). Sale a **0,8×** en las tres mejores
  salinas y a **1,4×** en casi toda la península: una diferencia bruta del **75 %**, frente al 4 %
  de comisión de ida y vuelta.
- El **hierro** existe en 17 de 403. Mismo caso.
- El **pasto** y la **labor** están repartidos, así que la lana y el pan varían poco: entre 0,9× y
  1,2×. Es lo correcto —son mercancías de todas partes—, y por eso la lana se vende en **feria**,
  donde el volumen es grande, no en la plaza de al lado.

### 4.3 Dónde se aplica

El motor ya tiene el sitio: `recursoEnLaPlaza` en `fases/07-mercado.ts` compone hoy el precio base
con los acontecimientos de la región. La abundancia se compone **antes**, sobre el mismo `DatosRecurso`:

```ts
function recursoEnLaPlaza(ctx: Contexto, comarca: IdComarca, recurso: Recurso): DatosRecurso {
  const datos = ctx.reglas.recursos[recurso];
  const local = precioBaseLocalMil(datos.precioBaseMil, ctx.mundo.comarcas[comarca], recurso, ctx.reglas);
  return { ...datos, precioBaseMil: precioBaseEfectivo(local, ...) };
}
```

Con eso heredan el precio local, **sin tocarlas**, las tres piezas que ya leen `DatosRecurso`:
`limitesDePrecio` (suelo y techo), `limitesDeMenores` (a qué precio compran y venden) y la regresión
al base de `nuevoPrecioMil`.

Hay que repasar además los cuatro sitios que hoy usan el número global:

1. **El nacimiento de una plaza** (`fases/07-mercado.ts`, `preciosMil: recursosSegun(...)`): una
   plaza nueva empieza en el precio base **de su comarca**, no en el del catálogo.
2. **El arranque** (`partidas/arranque.ts`): los maravedís que compensan el pan que falta se cuentan
   al precio base **de la comarca de origen**. En una comarca de labor 1 el pan cuesta un 20 % más,
   y el colchón tiene que dar para comprarlo.
3. **La vista y la crónica** (`cambios.ts`): lo que el jugador ve de una plaza es el precio de esa
   plaza; comprobar que no se cuela el global en ningún mensaje.
4. **Los robots** (`herramientas/banco/src/robots/`): leen los precios de la vista, así que no hace
   falta cambiarlos. Si la medición destapa que `arbitraje.ts` no aprovecha la diferencia por un
   defecto propio, **se corrige aquí** y se sube `VERSION_ROBOTS` a 4.

### 4.4 Determinismo

`abundanciaMil` se indexa con el potencial **del mundo**, no con el agotamiento de la comarca: el
precio base no puede oscilar turno a turno con la explotación, igual que la administración se mide
siempre en verano. Es una función pura del catálogo, sin azar ni estado, así que la huella de un
turno sigue siendo reproducible byte a byte.

### 4.5 Lo que esto abre, y lo que no

Abre tres decisiones que hoy no existen:

- **Dónde vender.** Sacar la sal de la salina o dejarla en casa ya no da igual.
- **Dónde comprar el pan.** Una casa de montaña puede llevar su hierro a la vega y volver cargada.
- **Para qué sirve un camino.** Una calzada que acorta la ruta a una plaza cara pasa a tener precio.

No resuelve, y no debe fingir que resuelve: el porte de una recua, la densidad de ferias ni el
reparto del prestigio. Todo eso vuelve a medirse en T-047 con la base nueva.

## 5. Archivos

```
paquetes/nucleo/src/datos/mercado.ts            abundanciaMil y el potencial de cada recurso
paquetes/nucleo/src/tipos/reglas.ts             los campos nuevos de DatosMercado
paquetes/nucleo/src/reglas/precios.ts           precioBaseLocalMil
paquetes/nucleo/src/fases/07-mercado.ts         recursoEnLaPlaza y el nacimiento de una plaza
paquetes/nucleo/src/partidas/arranque.ts        el colchon, al precio de su comarca
paquetes/nucleo/src/cambios.ts                  la vista y la cronica
paquetes/nucleo/src/validacion/validarTablas.ts la tabla nueva, validada
paquetes/nucleo/pruebas/precios.test.ts         (nuevo) la formula y sus extremos
paquetes/nucleo/pruebas/partidas/               huellas regeneradas con `npm run partidas`
docs/03-economia.md §3.10                       el diseño, con la tabla
```

## 6. Criterios de aceptación

1. `precioBaseLocalMil` es una función pura del catálogo: mismo mundo, mismo precio, sin estado ni
   azar. Probada en los seis extremos (potencial 0 y 5 de cada recurso) y en los maravedís.
2. **La dispersión aparece donde tiene que aparecer.** En una partida de 200 turnos con las ocho
   casas, la diferencia entre la plaza más barata y la más cara es de **más de 30 puntos en la sal y
   en el hierro** (antes 0,6 y 0,4).
3. **Un viaje de comercio paga el camino** cuando hay dos plazas al alcance: la prueba de vía de
   `vias.test.ts` lo exige con cifras, no con un «debería».
4. Los límites de precio de los robots se miden contra el base **de la plaza en la que tratan**, no
   contra el del catálogo.
5. El criterio `precios` de T-047 §5 sigue cumpliendo: ninguna racha pegada al suelo o al techo de
   10 turnos o más de plaza abierta.
6. Las huellas de las partidas de reproducción se regeneran y el test las acepta; la crónica no
   enseña ningún precio que no sea el de su plaza.
7. `npm run verificar` en verde, y el núcleo sigue puro (las dos guardas, lint y `pureza.test.ts`).

## 7. Verificación

```bash
npm run verificar
npm run partidas -- --confirmo          # regenera las huellas, tras leer el porqué de cada cambio
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --evaluar --fecha T-052
npm run banco:comparar -- herramientas/banco/informes/T-047-hierro-1492.csv herramientas/banco/informes/T-052-1492.csv
```

`--evaluar` seguirá terminando con código 2: esta ficha **no** cierra el equilibrio, lo hace medible.
Lo que tiene que enseñar la comparación es comercio donde no había ninguno.

## 8. Al terminar

1. Índice: T-052 `hecha`.
2. `ESTADO.md`: tarea en curso → T-047, que se reanuda con la base nueva `T-052-*`.
3. `docs/03-economia.md` §3.10 con la tabla y el porqué.
4. Bitácora de equilibrio: una entrada con la dispersión de antes y de después, y los primeros
   negocios con traza.
5. Commit: `T-052: geografia de precios`.

## 9. Cómo quedó (23-09-2026)

**Hecha.** El precio base es ya de cada comarca, y la geografía se nota:

| Dispersión entre las diez plazas, turno 100 | Antes | Después |
|---|---:|---:|
| lana | 0,0 pts | **30,0** |
| hierro | 0,4 | **40,3** |
| sal | 0,6 | **40,4** |
| madera | 1,6 | 35,3 |
| piedra | 8,6 | 27,0 |
| pan | 16,2 | 49,3 |

`npm run verificar`: 59 archivos, **1016 pruebas** en verde, y el atlas coincide. Las huellas de las
partidas de reproducción **no cambian**: esas partidas no abren plaza.

### Dos criterios que la medición obligó a rectificar, y por qué

La ficha pedía, además, que el pan y la lana se mantuvieran por debajo de 20 puntos de dispersión y
que `negociosRentables` dejara de ser 0. Ninguna de las dos se cumple, y las dos estaban mal
planteadas. Se rectifican aquí, con la medición delante, en vez de mover el umbral a escondidas:

1. **El pan varía 49 puntos y la lana 30, y está bien.** Se escribió ese tope dando por supuesto que
   el pan sería casi uniforme. La `labor` del catálogo va de 1 a 5 y está repartida, así que el pan
   cuesta un 70 % en una vega y un 119 % en la sierra. Eso **es** el juego: es lo que hace real el
   problema del ferrón, que vive donde hay hierro y no hay pan. Quitarlo sería fabricar una gráfica.
2. **`negociosRentables` sigue en 0, y no es cosa de los precios.** Ese criterio confundía el
   entregable (que los precios tengan geografía) con un efecto que depende de otra cosa. Medido:
   - con la geografía puesta, **doblar el porte** (`portePorAcemila` 1 → 2) tampoco crea un solo
     negocio, aunque mejora a los mercaderes (59 → 73 % de la mediana) y a la Mesta (24 → 48 %);
   - la causa está contada en el estado del turno 100: **hay diez plazas para 208 comarcas**, siete
     mercados —uno por capital, y las capitales se reparten a seis jornadas unas de otras— y tres
     ferias. Un robot casi nunca conoce dos plazas a su alcance, así que no hay entre qué negociar.

   Eso abre [T-053 · Plazas donde comerciar](T-053-plazas-donde-comerciar.md), que hereda el
   criterio con su medida.

### Defectos de los robots que destapó la medida

Los tres estaban ahí desde antes; con un precio único no se notaban. `VERSION_ROBOTS` pasa a 4.

1. **Los límites de precio se medían contra el catálogo**: el robot habría vendido sal al 60 % de
   14 000 en una plaza donde vale 16 800, y no la habría comprado nunca donde sí la hay. Ahora se
   miden contra el base de la plaza en la que trata (`Tablero.baseEn`).
2. **`paradasDe` repetía la capital** cuando la venta era en casa —lo normal desde T-052, con la
   mercancía barata en la vecina y cara en la propia comarca—, y una ruta con la misma comarca dos
   veces no es un viaje.
3. **El bastimento se valoraba al precio del catálogo.** Sale del almacén de casa, así que lo que
   cuesta mover la mercancía es lo que valdría allí.

### Una prueba que decía medir otra cosa

La prueba de vía del mercader fabricaba una carestía de sal **en la comarca vecina con salinas**
—la Bureba, la de Poza de la Sal—, donde una carestía no encarece nada. Ahora la sal va a la vecina
que **no** tiene, que es lo que se hacía, y el tramo lleva calzada: sin ella la ida y vuelta se come
el porte entero en pan (T-050 §6.1), y la prueba medía el camino en vez de medir al robot.

### El veredicto del banco

Tres campañas de tres repeticiones: 112, 111 y 109 filas cumplen, frente a 109, 115 y 113 de la base
`T-047-hierro`. **Plano, y era de esperar**: esta ficha no ajusta nada, pone la geografía donde no
la había. Lo que sí se mueve es `ganadores`, que pasa a cumplir en `1492`.
