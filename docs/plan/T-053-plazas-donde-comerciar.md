# T-053 · Plazas donde comerciar

**Fase:** 2 · Motor · **Depende de:** T-049, T-052 · **Estado:** pendiente

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

1. **Más ferias en el recorte.** `recorte.feriasMinimas` es 1. El catálogo tiene ferias de sobra; el
   recorte se queda con las justas. Es un cambio de **datos** y por tanto el más barato de probar:
   subirlo obliga a que el mapa jugado traiga varias ferias repartidas. Hay que mirar también sus
   calendarios: una feria que abre dos turnos al año no es una plaza a la que ir.
2. **Mercado en comarca ajena o neutral.** Hoy solo hay plaza donde alguien tiene un mercado, y solo
   se construye en tierra propia. Una **venta** o un mercado en comarca neutral —la pieza de origen
   del arriero se llama justamente `venta`— daría plazas sin necesidad de conquistar. Es **lógica**
   del motor: decidir si se permite, con qué coste y qué lealtad o influencia da.
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
