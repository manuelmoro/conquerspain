# T-056 · El negocio se cuenta con el precio que se espera

**Fase:** 2 · Motor (banco de pruebas) · **Depende de:** T-055 (su mecánica) · **Estado:** pendiente

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

## 4. Diseño (a detallar antes de implementar)

1. **Precio esperado.** Lo natural: el sabido, con un deslizamiento pequeño en contra por la propia
   compra y venta (el impulso de `nuevoPrecioMil` con el volumen del negocio sobre el tope de la
   plaza). Hay que decidirlo midiendo cuántas órdenes se caen por precio con cada margen.
2. **Riesgo.** Si la ganancia esperada es positiva pero el peor caso es muy negativo, ¿se sale?
   Una regla explicable: se sale si la esperada supera `GANANCIA_MINIMA` y el peor caso no pierde
   más que el bastimento.
3. **Fondo de comercio.** Solo si con el punto 1 los negocios aparecen pero se quedan en tres
   cargas por falta de bolsa.

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
