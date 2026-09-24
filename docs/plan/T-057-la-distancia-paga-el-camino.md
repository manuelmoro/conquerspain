# T-057 · La distancia paga el camino

**Fase:** 2 · Motor · **Depende de:** T-054 · **Estado:** hecha (24-09-2026)

## 1. Contexto

Nace de [T-056](T-056-el-negocio-en-limpio.md) y de una decisión del usuario el 24-09-2026: entre
«que la distancia pague el camino», «que llevar la carga cueste menos» y «aparcar el comercio»,
**que la distancia pague el camino**.

La medición que lo pide, en una frase:

> **Con seis niveles de abundancia no hay a la vez un gradiente empinado y largo.**

La regla de [T-054](T-054-el-precio-y-la-distancia.md) descuenta un nivel cada 3 jornadas desde la
mejor fuente. Así la sal gana 0,47 maravedís por carga y jornada, y la recua come entre 0,6 y 1,2:
llevarla pierde dinero por construcción. Con un nivel por jornada (ensayo `E-escalon1`) el precio se
**satura en el 120 % a cinco jornadas** de la fuente y las plazas del mercader vuelven a cotizar
casi igual (sal a 16 800 y 15 400). Y el techo del 120 % limita la diferencia de la sal a unos 7
maravedís por carga en cualquier distancia: no paga ni diez jornadas de comida.

## 2. Objetivo

Que el precio base de una plaza **suba un tanto fijo por cada jornada** que la separa de la fuente
más barata que alcanza, hasta un techo, en vez de bajar a saltos entre seis niveles.

## 3. Alcance

**Entra:** la regla del factor que alcanza una plaza (motor), su tabla y su documentación.

**No entra:** la tabla de abundancia en la fuente (se queda), el bastimento, el porte, los
robots. El fondo de comercio de los robots va en T-056.

## 4. Diseño

### 4.1 La regla

```
factor que alcanza la plaza P =
  mín( techoDeLejaniaMil,
       mín sobre las comarcas c con potencial(c) ≥ 1 de:
           abundanciaMil[potencial(c)] + ⌊recargoPorJornadaMil × jornadas(P, c) / 1000⌋ )

precio base de P = precio del catálogo × factor / 1000
```

- **La fuente cuenta con su nivel.** Una salina de nivel 5 vende al 70 %; una de nivel 1, al 110 %.
  Por eso la plaza mira la **más barata puesta en casa**, no la más cercana: una salina pequeña al
  lado puede perder frente a una grande a dos jornadas.
- **La propia comarca es una fuente a cero jornadas**, si tiene el potencial. Sin él, no cuenta.
- **Sin ninguna fuente alcanzable**, el techo.
- Las jornadas se miden como en T-054: en verano y sin mejoras, desde la plaza, por todo el mapa.
  El precio base no oscila con la estación ni con un puente nuevo.

En una frase para el jugador: **«la sal vale en la salina lo que dice su abundancia, y cada jornada
de camino le suma un 20 % del precio corriente, hasta el doble»**.

### 4.2 Las cifras (medidas)

| Tabla | Valor | Por qué |
|---|---:|---|
| `recargoPorJornadaMil` | 200 | La sal gana 2,8 maravedís por carga y jornada, y el hierro 4,8: por encima de lo que come la recua (hasta 1,2) con margen para comisiones y deslizamiento |
| `techoDeLejaniaMil` | 2000 | «Hasta el doble»: la sal más lejana cuesta 28, la del catálogo 14 |

Medido con una versión provisional en la campaña 1492 (T-056 §7):

| Recargo por jornada | Filas que cumplen | Escasez | Negocios de los arrieros por partida |
|---:|---:|---:|---|
| (T-054, escalón cada 3) | 116 | 9 | 0 |
| 120 | 116 | 10 | 0 a 2 |
| **200** | **118** | **12** | **29 a 31**, margen neto +1114 a +1242 |

### 4.3 Piezas

- `paquetes/nucleo/src/tipos/reglas.ts` y `datos/mercado.ts`: sale `jornadasPorEscalonDeAbundancia`;
  entran `recargoPorJornadaMil` y `techoDeLejaniaMil`. Validación en `validarTablas.ts`.
- `paquetes/nucleo/src/reglas/precios.ts`: `factorAlcanzadoMil` sustituye a `nivelAlcanzadoMil`, y
  `precioBaseLocalMil` recibe el factor en vez del nivel.
- `paquetes/nucleo/src/contexto.ts`: `factorAlcanzadoDe` (antes `alcanceDe`), con la misma memoria
  del turno; y sus cuatro usos (`cambios.ts`, fases 4 y 7).
- Pruebas: `precios-locales.test.ts` (la regla, caso a caso) y los ayudantes que la escriben a mano
  en `mercado.test.ts` y `acontecimientos.test.ts`.
- Documentación: [docs/03-economia.md](../03-economia.md) §3.10.

## 5. Criterios de aceptación

1. La regla de §4.1, probada caso a caso: en la fuente, a varias jornadas, la fuente más barata
   frente a la más cercana, el techo y sin fuente.
2. `negociosRentables` > 0 con margen neto positivo en la campaña 1492.
3. El recuento no empeora respecto a `T-056-*` (116 / 118 / 114) y la escasez tampoco.
4. `npm run verificar` en verde.

## 6. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --evaluar --fecha T-057
npm run banco:comparar -- herramientas/banco/informes/T-056-1492.csv herramientas/banco/informes/T-057-1492.csv
```

## 7. Dónde va (24-09-2026)

**Entregado y verificado:** la regla de §4.1 en el motor (`factorAlcanzadoMil`,
`factorAlcanzadoDe`), sus dos tablas con validación, la documentación en
[docs/03-economia.md](../03-economia.md) y las pruebas: la regla caso a caso en
`precios-locales.test.ts` y una **guarda sobre las propias tablas**: una carga de sal o de hierro
gana por jornada más de lo que come la recua, ida y vuelta. Las cifras de `mercado.test.ts` y
`acontecimientos.test.ts` se recalcularon a mano y coinciden con las de T-052, porque en el mundo de
prueba la lana vuelve a salir de su propio pasto.

**Calibración del recargo con las tres campañas** (robots 8, con el fondo de T-056):

| Recargo | Filas (1492 / 1085 / 1212) | Total | Negocios | Margen neto |
|---:|---|---:|---:|---:|
| Base `T-056` (T-054, sin comercio) | 116 / 118 / 114 | 348 | 0 | 0 |
| 150 | 117 / 112 / 111 | 340 | 29 | +647 |
| **200** | **120 / 110 / 111** | **341** | **181** | **+7209** |
| 250 | 117 / 109 / 111 | 337 | 260 | +10 221 |

La escasez con 200: 12 / 11 / 9 filas, frente a 9 / 11 / 8.

**Criterios:** 1, 2 y 4 se cumplen. **El 3 no**: 341 frente a 348. El recuento se queda en torno a
340 **con cualquier recargo**, así que la pérdida no es del comercio sino de la forma de la regla: en
la plaza mediana de 1085, al turno 100, la sal pasa de 12 600 a 27 110 y el hierro de 26 400 a
48 000 (el techo), el pan sube un 12 % y la madera un 18 %. Es lo que pide el diseño —lejos de la
fuente, el doble—, pero encarece la vida a quien compra esos recursos. Lo que se pierde: `ganadores`
y `obra mayor` en 1085 (los monjes ganan las tres), cinco horquillas de prestigio y dos filas de
ausencia de los salineros.

**Adoptada igualmente**, por la regla de las tareas iterativas: corrige algo indefendible —el
comercio era imposible por construcción, cero negocios en nueve partidas— y deja una prueba que
impide que vuelva. **Falta** recuperar el recuento, que es trabajo de equilibrio: lo siguiente en
[T-047](T-047-equilibrio-v1.md). Esta ficha se cierra cuando se recupere.

## Cierre (24-09-2026)

El criterio 3 se cumple con las iteraciones de T-047 que vinieron después: la Mesta conoce sus
cañadas y trashuma (T-058) y el invierno aprieta al 50 %. Base `E-invierno500` (robots 8):
**118 / 116 / 119 = 353**, frente a los 348 de la base de antes del comercio (116 / 118 / 114). En
total queda por encima; por semillas, 1492 y 1212 por encima y 1085 dos filas por debajo (116
frente a 118). El comercio sigue en marcha en las tres campañas.
