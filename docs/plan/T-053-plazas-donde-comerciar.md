# T-053 · Plazas donde comerciar

**Fase:** 2 · Motor · **Depende de:** T-049, T-052 · **Estado:** en curso

## 1. Contexto

Esta ficha nace de una medición de [T-052](T-052-geografia-de-precios.md), anotada en la
[bitácora de equilibrio](bitacora-equilibrio.md) el 23-09-2026. El hallazgo, en una frase:

> **En una partida de ocho casas hay diez plazas para 208 comarcas, y las capitales están a seis
> jornadas unas de otras: el comercio no tiene adónde ir.**

El recuento exacto, leído del estado guardado del turno 100 de `T-052-1492`:

| Plazas | Cuáles |
|---|---|
| 7 mercados locales | uno por capital; los levanta el propio jugador |
| 3 ferias | las que el recorte garantiza (`recorte.feriasMinimas: 1`) |

Un robot solo puede negociar entre plazas **a su alcance y con precio sabido reciente**. Con este
mapa, casi siempre conoce una sola: la suya. Por eso `arbitraje.ts` anota `sin-precios-sabidos` y no
hay un solo negocio con traza en las nueve partidas.

**Lo que ya se ha descartado como causa**, cada uno con su medida en la bitácora:

1. **No es el precio.** T-052 llevó la dispersión entre plazas de 0,6 a 40,4 puntos en la sal y de
   0,4 a 40,3 en el hierro. `negociosRentables` siguió en 0.
2. **No es el porte.** Con la geografía de precios ya puesta, doblar `portePorAcemila` (1 → 2)
   tampoco crea un solo negocio. Mejora a los mercaderes (59 → 73 % de la mediana) y a la Mesta
   (24 → 48 %), pero la cifra de negocios no se mueve de cero.
3. **No es la liquidez ni el margen de los menores.** Los dos ensayos están medidos y descartados.

## 2. Objetivo

Que en el mapa jugado haya plazas suficientes y bastante repartidas como para que llevar mercancía
de una a otra sea una decisión real, y que el jugador tenga una manera de crear las que le falten.

## 3. Alcance

**Entra:** la densidad de plazas del mapa jugado y el camino por el que un jugador abre una nueva.

**No entra:** el equilibrio de las cifras resultantes, que vuelve a T-047.

## 4. Lo que hay que decidir (con medición antes)

Tres caminos, que no se excluyen. Hay que medir cada uno por separado, como manda T-047 §4.

1. ~~**Más ferias en el recorte.**~~ **Descartado por medición** (23-09-2026): el catálogo entero
   tiene **9 comarcas con feria de 403**, once ferias, y **cada una abre uno o dos turnos al año**
   de veinticuatro. Las ferias son el acontecimiento anual, no el mercado de cada quincena, y
   `feriasMinimas` no puede repartir lo que no existe. No se toca su calendario: es histórico.
2. **Mercado en comarca ajena o neutral. Decidido y hecho el 23-09-2026** (ver §8): la **venta**
   abre plaza y es el único edificio que se levanta en tierra de nadie. No da los maravedís ni la
   lealtad del mercado: el mercado es el pueblo, la venta es el camino.
3. **Que los menores tengan precio propio donde no hay plaza.** Descartado de entrada por diseño:
   convertiría cualquier comarca en un mercado y quitaría valor a las ferias y a los caminos. Se
   anota para no volver a proponerlo.

## 5. Criterios de aceptación

1. En el mapa jugado de una partida de ocho casas hay **al menos una plaza cada 20 comarcas**, y
   ninguna capital queda a más de tres jornadas de una plaza que no sea la suya.
2. `negociosRentables` deja de ser 0: al menos una casa cierra negocios con traza en cada una de las
   tres campañas (1492, 1085 y 1212), con su margen neto positivo después del bastimento.
3. Los capítulos de **comercio** del prestigio dejan de ser cero para todas las casas.
4. El criterio `precios` de T-047 §5 sigue cumpliendo: ninguna racha pegada al suelo o al techo de
   10 turnos o más de plaza abierta.
5. `npm run verificar` en verde y el núcleo sigue puro.

## 6. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --evaluar --fecha T-053
npm run banco:comparar -- herramientas/banco/informes/T-052-1492.csv herramientas/banco/informes/T-053-1492.csv
```

## 7. Al terminar

1. Índice: T-053 `hecha`.
2. `ESTADO.md`: tarea en curso → T-047, que se reanuda con la base nueva.
3. `docs/03-economia.md` §3.10.1 con lo que se haya decidido sobre dónde hay plaza.
4. Bitácora de equilibrio: una entrada con las plazas de antes y de después y los primeros negocios
   con traza.
5. Commit: `T-053: plazas donde comerciar`.


## 8. Dónde va (23-09-2026)

**En curso.** Lo hecho está verificado: `npm run verificar` pasa con **1016 pruebas** en verde y las
huellas de reproducción no cambian.

### Hecho

- **La venta abre plaza** (`reglas/plazas.ts`): un mercado local y una venta valen igual para
  `hayPlazaEn` y para `catalogoDePlazas`. La venta **no** da los maravedís ni la lealtad del
  mercado, que siguen mirando solo a `edificios.mercado`.
- **La venta se levanta en tierra de nadie** (`fases/06-obras.ts`, `puedeObrarEn`): una comarca
  **explorada** y sin dueño. Es el único edificio con ese permiso, marcado en los datos con
  `enTierraDeNadie` (`datos/edificios.ts`), validado en `validarTablas.ts`.
- **Los robots las plantan** (`robots/impulsos.ts`, `plantarVentas`): solo las casas que mandan una
  recua a arbitrar, hasta tres, donde la mercancía cotiza **distinto** que en casa. Medido: se
  plantan de verdad (Arlanza, Monegros y Montes de Oca en `1492`) y las plazas de la partida suben
  de **10 a 13**. El veredicto del banco queda en 112 filas que cumplen, las mismas que la base
  `T-052`: la venta abre el sitio, todavía no el negocio.
- **Diseño escrito** en `docs/03-economia.md` §3.3 y §3.10.1.

### La venta tiene ventero (24-09-2026)

Hecho lo que faltaba, y **el mecanismo queda desbloqueado**:

- `EstadoComarca.ventaDe` guarda quién levantó la venta mientras la comarca es de nadie. Se pone al
  terminar la obra, se borra al derribarla y **se borra al incorporar la comarca**: quien se queda
  con la tierra se queda con la venta. Deja además preparado el portazgo del arriero que docs/03
  promete y T-103 activará.
- `fases/12-cronica.ts` refresca cada turno el conocimiento de la comarca y los precios de su plaza
  para el ventero, igual que para una comarca donde para una recua. Es lo que hacía un ventero.
- Cinco pruebas nuevas en `obras.test.ts`: se levanta solo en tierra explorada, solo la venta la
  admite, abre plaza, su ventero sabe los precios y quien incorpora se la queda.

**Lo que enseña la medida.** El motivo dominante del mercader deja de ser «no sé precios» y pasa a
ser **«hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su
bastimento»** (74 turnos de 200; 49 en el arriero). Es decir: **el robot ve por fin un negocio de
verdad y lo único que lo frena es la logística.**

### Por qué sigue sin haber negocio: el mundo que alcanza el mercader es igual a sí mismo

`negociosRentables` sigue en 0 y el recuento del banco queda plano (114, 109 y 109 filas cumplen,
frente a 112, 111 y 109 de la base `T-052`). **No es la logística ni el dinero**, y eso está medido:
cinco ensayos, todos con cero negocios, y el último con una recua generosísima (porte 20, un pan por
jornada, sal cada doce jornadas, ventas hasta doce jornadas y el colchón del arbitraje en 10).

La causa está en un volcado de la rutina de arbitraje en el turno 120, con nueve plazas ya conocidas:

```
T120 plazas=9 parejas=1 bolsa=2 porte=20
  plaza segria(f)            sal=16800 pan=2100 hierro=28800
  plaza bajo-aragon          sal=16800 pan=2700 hierro=28800
  plaza campo-de-belchite    sal=16800 pan=3000 hierro=28800
  plaza monegros             sal=16800 pan=3000 hierro=28800
  … (nueve plazas, todas sal=16800 y hierro=28800)
  pallars-jussa -> segria  margen=180 (0,18 maravedis por carga)
```

**La sal cuesta lo mismo en las nueve plazas, y el hierro también.** Solo varía el pan. La razón es
que T-052 hace depender el precio del **potencial de la propia comarca**, y ninguna de las nueve
tiene sal ni hierro: todas valen exactamente `base × 1,2`. Una comarca sin sal pegada a una salina
cotiza igual que otra a trescientos kilómetros.

Eso es justo lo contrario de cómo funcionaba: **la sal era cara tierra adentro porque había que
llevarla hasta allí**. El precio tiene que depender de lo lejos que esté la comarca de donde se
produce, no solo de lo que ella misma tenga. Mientras eso no exista, no hay gradiente que recorrer
y el comercio no puede existir por mucho porte, dinero o plazas que se le den.

**Esto es una decisión de diseño que el usuario debe ver antes de implementarse**, porque amplía
T-052 y toca la lógica (hace falta el grafo de caminos para medir la distancia a la producción).

### Lo ensayado y descartado, para no repetirlo

| Ensayo | Resultado |
|---|---|
| `jornadasPorSalEnVerano` 4 → 12 (la sal del camino costaba más que el pan que conserva) | Cero efecto: no ataba |
| Logística generosa: porte 2, bastimento 1, sal cada 12 jornadas | **Cero negocios** |
| Ventas hasta 12 jornadas en vez de 4 | **Cero negocios** |
| `COLCHON_DE_MARAVEDIS` de `impulsos.ts` 60 → 10 | Cero efecto: **el arbitraje tiene su propio colchón**, que era el que mandaba |
| `COLCHON` de `arbitraje.ts` 60 → 10 (bolsa de 2 a ~52 maravedís) | **Cero negocios** |

### Lo que ya se ha descartado, con su medida

No repetir ninguno de estos sin una razón nueva:

| Sospecha | Ensayo | Resultado |
|---|---|---|
| Faltan mercados | Un mercado en cada comarca propia (robots) | Plazas de 10 a 17. **Cero negocios**: el mercader tiene **una sola comarca** toda la partida. Revertido |
| Falta porte | `portePorAcemila` 1 → 2, con y sin ventas | **Cero negocios** en los dos casos |
| Falta dinero | `COLCHON_DE_MARAVEDIS` 60 → 20 | **Cero negocios** (la casa tiene ~65 maravedís: la bolsa de comercio era de 5) |
| Faltan ferias | Medición del catálogo | 9 comarcas con feria de 403, abiertas 1–2 turnos al año |
