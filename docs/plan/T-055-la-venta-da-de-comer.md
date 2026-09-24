# T-055 · La venta da de comer a las recuas

**Fase:** 2 · Motor · **Depende de:** T-053, T-054, T-056, T-057 · **Estado:** hecha (24-09-2026)

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

## 4. Diseño (decidido el 24-09-2026)

La regla, en una frase para el jugador: **fuera de casa, una recua que pisa una venta come allí y
lo paga con los maravedís que lleva; si no lleva bastantes, come de su carga.** Escrita en
[docs/03-economia.md §3.7.1](../03-economia.md).

1. **Qué repone.** El bastimento **del turno entero** (pan y, en verano, la sal de las conservas)
   de la recua que empieza el turno en una comarca con venta o entra en alguna durante él. Es la
   misma granularidad que ya tenía la ruta circular que come del almacén al pasar por comarca
   propia: la cuenta es por turno, no por jornada. Precedencia: almacén (comarca propia) → venta →
   carga.
2. **Quién paga y a cuánto.** La recua, con los maravedís de su carga, a los precios de la plaza de
   la venta por la tarifa `movimiento.ventaCobraMil` (1000: el precio entero). Una venta recién
   levantada, sin plaza abierta todavía, cobra al precio base de su comarca. Se descartó que la
   venta diera de comer gratis: sería pan que sale de la nada, y la cota medida (§8) dice además
   que no hace falta para el comercio.
3. **Quién puede usarla.** Cualquiera: propia, ajena o en tierra de nadie. Lo que cobra el ventero
   sale de la partida hasta que T-103 active el portazgo del dueño.
4. **Qué ve la previsión.** `preverViaje` (banco) simula lo mismo que el motor con la carga que se
   le da, maravedís incluidos, y sabe dónde hay venta por lo que sabe el jugador (sus comarcas y
   las exploradas). `provisionPara` acepta una **bolsa para ventas**: si lo que cobrarían, con un
   25 % de holgura, cabe en ella, la recua lleva esos maravedís en vez del pan. De momento solo la
   usa el arbitraje, que la descuenta de lo que puede gastar en mercancía y la cuenta como coste.

Piezas: `hayVentaEn`, `ventaDelTurno` y `costeEnLaVenta` en `paquetes/nucleo/src/reglas/
bastimento.ts`; la fase en `fases/04-movimiento.ts`; la previsión en `herramientas/banco/src/
robots/viaje.ts`, lo que sabe el robot en `tablero.ts` y el arbitraje en `arbitraje.ts`. Robots a
la versión 5.

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

**Entregado y verificado**, en dos sesiones del mismo día:

1. Una corrección del arbitraje que estaba escondida debajo de todo lo demás. El robot ordenaba
   las parejas de plazas con los precios **acolchados** —puja un 20 % y rebaja un 10 %—, así que
   necesitaba una diferencia bruta **del 33 %** antes de mirar siquiera una pareja. Ahora ordena por
   la diferencia que sabe: de 0 parejas a 106, y el recuento sin moverse.
2. **La venta da de comer** (§4), con sus pruebas: `paquetes/nucleo/pruebas/venta.test.ts` (ocho
   casos, entre ellos el del criterio 1) y dos más en `herramientas/banco/src/robots/viaje.test.ts`.

**Criterios:**

| # | Criterio | Estado |
|---|---|---|
| 1 | La misma carga llega más lejos con una venta en el camino | **Cumple.** Seis panes y 40 maravedís, de la vega a la costa: sin venta, el segundo turno se queda con hambre en el camino; con venta en el río, llega con 10 acémilas y 4 panes, y ha pagado 18 maravedís |
| 2 | `negociosRentables` > 0 | **Cumple** desde T-056 y T-057: 181 negocios en las nueve partidas, margen neto +7209, con negocios en las tres campañas |
| 3 | La escasez no empeora | **Cumple.** 9 / 11 / 8 filas con la venta; 12 / 11 / 9 con el comercio en marcha (`T-057-*`) |
| 4 | `npm run verificar` | **Cumple** |

**Lo medido** (base `T-055-*`, nueva `T-055b-*`, robots 5): el recuento pasa de 116 / 118 / 112 a
**116 / 118 / 114**. Los viajes que antes «no cabían» caben: en el volcado del turno 160 del
mercader, todas las parejas que daban `no-cabe` tienen ahora hueco 6 comiendo en las ventas.

**Por qué no hay negocio todavía** (la cota, medida y revertida): con `ventaCobraMil: 0` —comer
gratis— siguen saliendo **cero negocios**, y el motivo dominante pasa a ser «ningún viaje deja
ganancia» (134 turnos). El sitio ya no es el muro: el robot cuenta la ganancia con los límites
acolchados de la orden y tiene 47 maravedís de bolsa. Eso es lógica del robot, fuera del alcance de
esta ficha, y está en [T-056](T-056-el-negocio-en-limpio.md).

**Cerrada el 24-09-2026**, con los cuatro criterios cumplidos. El criterio 2 necesitó dos fichas más: que el robot contara la ganancia con el precio esperado y guardara un fondo de comercio ([T-056](T-056-el-negocio-en-limpio.md)), y que la distancia pagara el camino ([T-057](T-057-la-distancia-paga-el-camino.md)).
