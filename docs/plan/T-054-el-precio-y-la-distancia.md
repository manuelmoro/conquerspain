# T-054 · El precio y la distancia

**Fase:** 2 · Motor · **Depende de:** T-052 · **Estado:** hecha (24-09-2026)


> **24-09-2026 · Regla sustituida por [T-057](T-057-la-distancia-paga-el-camino.md).** Los
> escalones de nivel cada tres jornadas dejaban la sal ganando 0,47 maravedís por carga y jornada,
> menos de lo que come la recua: el comercio era imposible por construcción. Desde T-057 el precio
> sube un tanto fijo por jornada desde la fuente más barata, hasta el doble. Lo de abajo se conserva
> como historia de la decisión.

## 1. Contexto

Nace de una medición de [T-053](T-053-plazas-donde-comerciar.md), anotada en la
[bitácora de equilibrio](bitacora-equilibrio.md) el 24-09-2026. El hallazgo, en una frase:

> **Una comarca sin sal pegada a una salina cotiza igual que otra a trescientos kilómetros.**

[T-052](T-052-geografia-de-precios.md) puso la geografía en el precio, pero mirando solo el
potencial **de la propia comarca**. El volcado de la rutina de arbitraje del mercader en el turno
120, ya con nueve plazas conocidas y una recua generosísima, lo enseña:

```
T120 plazas=9 parejas=1 bolsa=2 porte=20
  segria(f)          sal=16800 pan=2100 hierro=28800
  bajo-aragon        sal=16800 pan=2700 hierro=28800
  campo-de-belchite  sal=16800 pan=3000 hierro=28800
  … las nueve, sal=16800 y hierro=28800
  pallars-jussa -> segria  margen=180   (0,18 maravedis por carga)
```

Ninguna de las nueve tiene sal ni hierro, así que **todas valen exactamente `base × 1,2`**. Sin
gradiente no hay nada que recorrer, y por eso `negociosRentables` sigue en 0 después de descartar,
con su medida, el porte, el bastimento, el dinero, las plazas y las ferias.

Es lo contrario de cómo funcionaba: **la sal era cara tierra adentro porque había que llevarla
hasta allí**.

## 2. Objetivo

Que el precio de un recurso en una plaza dependa de **lo lejos que esté de donde se produce**, y no
solo de lo que esa comarca tenga. Con eso aparece el gradiente que hace del comercio una decisión.

## 3. Alcance

**Entra:** el cálculo del precio base de una plaza mirando la mejor fuente a su alcance.

**No entra:** el equilibrio de las cifras, que vuelve a T-047; ni las plazas, que son de T-053.

## 4. Diseño

### 4.1 La abundancia que alcanza una plaza

El precio base de un recurso en una comarca sigue siendo `precioBase × abundanciaMil[nivel]`, pero
el **nivel** ya no es el potencial de la comarca: es el mejor que alcanza, descontando la distancia.

```
nivelAlcanzado(recurso, comarca) =
  max sobre las comarcas c del mapa de
    potencial(c) − floor(jornadas(comarca, c) / jornadasPorEscalon)
  acotado a [0, 5]
```

Con `jornadasPorEscalon: 3`, una salina de `sal 5` hace que una comarca a tres jornadas cotice como
`sal 4`, a seis como `sal 3`, y así hasta apagarse. **Dos comarcas vecinas sin sal ya no cotizan
igual**: manda cuál de las dos está más cerca de la salina.

Las jornadas se miden **en verano y sin mejoras**, igual que la administración (`jornadasDesde` en
`reglas/administracion.ts`): el precio base no puede oscilar con la estación ni con un puente nuevo.

### 4.2 Dónde se calcula

Solo las **plazas** necesitan precio, y hay diez o veinte por partida, así que no hace falta tocar
el mundo ni su formato. Se calcula en la fase 7, con una memoria por turno en el `Contexto`:
`recursoEnLaPlaza` pide el nivel alcanzado en vez del potencial propio.

### 4.3 Determinismo

Función pura del catálogo y del recorte: mismo mapa, mismo precio, sin azar ni estado. La memoria
por turno es solo velocidad.

## 5. Archivos

```
paquetes/nucleo/src/datos/mercado.ts          jornadasPorEscalonDeAbundancia
paquetes/nucleo/src/tipos/reglas.ts           el campo nuevo de DatosMercado
paquetes/nucleo/src/reglas/precios.ts         nivelAlcanzado y precioBaseLocalMil
paquetes/nucleo/src/contexto.ts               la memoria por turno
paquetes/nucleo/src/fases/07-mercado.ts       recursoEnLaPlaza
paquetes/nucleo/src/cambios.ts                el suelo y el techo, que miran el mismo base
paquetes/nucleo/src/partidas/arranque.ts      el colchón, al precio de su comarca
paquetes/nucleo/pruebas/precios-locales.test.ts  la fórmula y sus extremos
docs/03-economia.md §3.10.2                   el diseño
```

## 6. Criterios de aceptación

1. `nivelAlcanzado` es función pura del mapa, probada en tres casos escritos a mano: en la fuente,
   a un escalón y fuera de alcance.
2. **Aparece el gradiente**: en una partida de 200 turnos, dos plazas sin sal a distinta distancia
   de una salina cotizan **distinto**, y la dispersión de la sal entre plazas pasa de 0 a más de 20
   puntos dentro de una misma región.
3. `negociosRentables` deja de ser 0 en al menos una casa y una campaña.
4. El criterio `precios` de T-047 §5 sigue cumpliendo.
5. `npm run verificar` en verde y el núcleo sigue puro.

## 7. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --evaluar --fecha T-054
npm run banco:comparar -- herramientas/banco/informes/T-047-marcador-1492.csv herramientas/banco/informes/T-054-1492.csv
```

## 8. Al terminar

1. Índice: T-054 `hecha`.
2. `ESTADO.md`: vuelve T-053 (su criterio de negocios) y después T-047.
3. `docs/03-economia.md` §3.10.2 con la regla y su porqué.
4. Bitácora: la dispersión y los primeros negocios con traza.
5. Commit: `T-054: el precio y la distancia`.


## 9. Cómo quedó (24-09-2026)

**Hecha.** El gradiente existe. En una partida de 200 turnos, al turno 100:

| Recurso | Antes (T-047-marcador) | Ahora |
|---|---|---|
| sal | 120 % en **21 de 23** plazas; un muro plano | **70, 80, 90, 100 y 120 %**: una escalera |
| hierro | 120 % en 22 de 23 | 80, 100, 110 y 120 % |
| pan | 52,4 puntos de dispersión | 26,5, y más repartida |

| Campaña | Base `T-047-marcador` | Con la distancia |
|---|---:|---:|
| 1492 | 116 | 116 |
| 1085 | 112 | **118** |
| 1212 | 113 | 112 |

Lo que más se mueve es el **prestigio**, que es lo que mide si todas las casas compiten: de 4 a 7
filas dentro de la horquilla en `1492`, con los mercaderes al 87 % de la mediana (antes 63 %), los
arrieros al 102 % (antes 90 %) y los ferrones al 64 % (antes 45 %).

### El criterio que no se cumple, y por qué

`negociosRentables` sigue en **0**. No es el precio: el gradiente está ahí y se mide. Lo que falta
está en [T-053 §8](T-053-plazas-donde-comerciar.md) y ya está medido: **la bolsa de comercio del
robot es de dos maravedís** —la casa tiene unos 62 y el arbitraje guarda 60 de colchón— y las
plazas que alcanza siguen siendo pocas y cercanas entre sí, así que el escalón que ve es pequeño
aunque el del mapa entero sea grande. Ese criterio se queda con T-053, que es de quien era.
