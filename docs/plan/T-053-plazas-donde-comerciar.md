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
  plantan de verdad (Arlanza, Monegros, Montes de Oca en `1492`) y las plazas de la partida suben
  de 10 a 20.
- **Diseño escrito** en `docs/03-economia.md` §3.3 y §3.10.1.

### Lo que falta, y es una sola cosa

**Un jugador no se entera de lo que él mismo ha construido fuera de su dominio.** Medido con un
volcado de la rutina de arbitraje: el robot planta su venta en Arlanza y en el turno 100 sigue
diciendo `conocidas=2`, las dos plazas de su propia capital. La causa está en
`fases/12-cronica.ts`: el conocimiento de una comarca ajena es una **foto** que solo se refresca
donde el jugador tiene una recua, así que su venta no aparece nunca en `conocimiento.datos.edificios`.

El paso siguiente, en orden:

1. **Guardar de quién es la venta.** Hoy `EstadoComarca.edificios` es un recuento sin dueño, así que
   en tierra de nadie la venta no es de nadie. Un campo `ventaDe: IdJugador | null` en la comarca
   (la venta tiene `nivelMaximo: 1`, así que basta uno) lo resuelve y además deja preparado el
   portazgo del arriero, que docs/03 ya promete y T-103 activará.
2. **Que tu venta te informe**: refrescar cada turno el conocimiento de la comarca y los precios de
   su plaza para el dueño de la venta, como hace `loQueVenSusRecuas` con las comarcas donde hay
   recua. Es lo que hacía un ventero.
3. **Volver a medir** `negociosRentables` en las tres campañas. Si sigue en 0, el siguiente
   sospechoso está medido y listo: con porte 10 y dos panes por jornada **una recua no llega a una
   plaza a tres jornadas y vuelve** (12 de pan para 10 de porte), y eso es tabla de T-047.

### Lo que ya se ha descartado, con su medida

No repetir ninguno de estos sin una razón nueva:

| Sospecha | Ensayo | Resultado |
|---|---|---|
| Faltan mercados | Un mercado en cada comarca propia (robots) | Plazas de 10 a 17. **Cero negocios**: el mercader tiene **una sola comarca** toda la partida |
| Falta porte | `portePorAcemila` 1 → 2, con y sin ventas | **Cero negocios** en los dos casos |
| Falta dinero | `COLCHON_DE_MARAVEDIS` 60 → 20 | **Cero negocios** (la casa tiene ~65 maravedís: la bolsa de comercio era de 5) |
| Faltan ferias | Medición del catálogo | 9 comarcas con feria de 403, abiertas 1–2 turnos al año |
