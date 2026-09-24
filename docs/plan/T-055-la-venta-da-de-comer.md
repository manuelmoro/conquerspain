# T-055 · La venta da de comer a las recuas

**Fase:** 2 · Motor · **Depende de:** T-053, T-054 · **Estado:** en curso

## 1. Contexto

Nace de la aritmética, medida el 24-09-2026 con todo lo demás ya resuelto. El hallazgo, en una
frase:

> **Una recua no puede cargar el pan de una ida y vuelta de tres jornadas y además llevar algo.**

Con `bastimentoPorJornada: 2` y `portePorAcemila: 1`, un viaje de seis jornadas pide **12 cargas de
pan** de un porte de **10**. El volcado de la rutina de arbitraje, ya con el precio con geografía
(T-054), las plazas del camino (T-053) y la bolsa resuelta, lo enseña sin lugar a dudas:

```
T160 parejas=106 bolsa=200 porte=10
  pallars-jussa->segria       margen=5000 hueco=0 bast=41  pan:- madera:- … lana:-
  pallars-jussa->bajo-aragon  margen=5000 VIAJE=no-cabe
  pallars-jussa->bajo-martin  margen=5000 VIAJE=no-cabe
```

**106 parejas de plazas con diferencia de precio, doscientos maravedís en la bolsa, y `hueco = 0`.**
No falta ocasión, ni dinero, ni plazas, ni precio: falta sitio en la recua.

## 2. Objetivo

Que una recua pueda hacer un viaje de comercio sin llevar encima toda su comida, **sin** agrandar
las recuas ni abaratar el bastimento de todo el juego —las dos cosas están medidas y hunden el
criterio de escasez, porque las recuas acaban acarreando pan a casa.

La respuesta la tiene el propio diseño, sin implementar desde T-035:
[docs/03-economia.md §3.3](../03-economia.md) dice de la venta que **«recuas propias y ajenas
reponen»**. Una venta cada pocas jornadas convierte un viaje largo en varios tramos cortos, y eso
es exactamente lo que era: se comía y se dormía en la venta.

## 3. Alcance

**Entra:** que una recua reponga bastimento al pasar por una comarca con venta, y que la previsión
de los robots lo cuente.

**No entra:** el porte, el bastimento por jornada ni la tabla de abundancia. Están medidos y
descartados (§6).

## 4. Diseño (a detallar antes de implementar)

Lo que hay que decidir, con medición:

1. **Qué repone exactamente.** Lo natural: las jornadas que salen de una comarca con venta no se
   comen el pan de la carga. Alternativa más simple: la recua que **acaba el turno** en una comarca
   con venta no gasta bastimento ese turno.
2. **Quién puede usarla.** El diseño dice «propias y ajenas», así que cualquiera. El dueño cobrará
   el portazgo cuando T-103 lo active; hasta entonces es un bien común que alguien paga.
3. **Qué ve la previsión.** `preverViaje` (banco) tiene que contar las ventas del camino, o los
   robots seguirán creyendo que el viaje no cabe.

## 5. Criterios de aceptación

1. Una recua que pasa por una venta llega más lejos con la misma carga, probado con cifras.
2. `negociosRentables` deja de ser 0 en al menos una casa y una campaña.
3. El criterio `escasez` de T-047 §5 **no empeora**: es lo que hundieron los otros caminos.
4. `npm run verificar` en verde.

## 6. Lo medido y descartado, para no repetirlo

Todo con la base `T-055-*` (116, 118 y 112 filas cumplen) y las tres campañas:

| Camino | Resultado |
|---|---|
| `portePorAcemila` 1 → 2 | Cero negocios, y la **escasez cae de 11 a 4 filas**: las recuas acarrean pan a casa |
| Porte 2 + `bastimentoPorJornada` 1 + escalón de abundancia 2 | **Primer negocio rentable de toda la investigación** (2 negocios, margen neto +51), pero la escasez se hunde a 3 filas y el recuento cae a 109 |
| Escalón 2 + abundancia más ancha (sin tocar recuas) | 118 / 114 / 114, pero **cero negocios** y el prestigio empeora (12 filas frente a 14) |
| Fondo de comercio para mercaderes y arrieros | Funciona: el mercader pasa de 95 a **343 maravedís**. Pero el recuento cae a 338: **ahorrar para un comercio que aún no existe es peor que construir**. Vuelve cuando el comercio funcione |

## 7. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --evaluar --fecha T-055b
npm run banco:comparar -- herramientas/banco/informes/T-055-1492.csv herramientas/banco/informes/T-055b-1492.csv
```

## 8. Dónde va (24-09-2026)

**Entregado y verificado**: una corrección del arbitraje que estaba escondida debajo de todo lo
demás. El robot ordenaba las parejas de plazas con los precios **acolchados** —puja un 20 % y
rebaja un 10 %—, así que necesitaba una diferencia bruta **del 33 %** antes de mirar siquiera una
pareja. Con la sal de 9800 a 12600 entre dos plazas suyas (un 28 %), veía **cero parejas en toda la
partida**. Ahora ordena por la diferencia que sabe y deja el acolchado donde corresponde: en los
límites de la orden, que tienen que ser holgados o la compra se cae por precio en cuanto la plaza
se mueve (medido: con un 5 % se rompe la prueba de vía del arriero).

Resultado: 106 parejas donde había 0, y el recuento sin moverse (116 / 118 / 112, igual que la base).

**Falta** el diseño de §4 y su implementación.
