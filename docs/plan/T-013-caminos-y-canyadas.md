# T-013 · Caminos, puertos, vados y cañadas reales

**Fase:** 1 · El mundo · **Depende de:** T-011 · **Estado:** pendiente

## 1. Contexto

El grafo que genera el atlas sabe qué comarcas se tocan, pero no sabe que entre Soria y Logroño hay
un puerto que se cierra en enero, que entre Zamora y Toro se vadea el Duero, ni que por la Cañada
Soriana Occidental bajan cada otoño cien mil ovejas. Esa capa es la que convierte el mapa en un
problema logístico.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.7.2 y §3.8,
[docs/05-geografia.md](../05-geografia.md) §5.3 y §5.4.

## 2. Objetivo

Enriquecer el grafo con datos históricos y geográficos: puertos de montaña con su nombre y su
comportamiento estacional, vados, calzadas romanas y las nueve cañadas reales trazadas sobre las
comarcas.

## 3. Alcance

**Entra:** `paquetes/mundo/catalogo/caminos.jsonc` con las capas históricas, su validación, su
integración en el mundo generado y las funciones de consulta del núcleo (coste en jornadas).

**No entra:** la mecánica de movimiento (T-033), la de rebaños (T-040) ni el dibujo (T-081).

## 4. Diseño detallado

### 4.1 Formato

```jsonc
{
  "puertos": [
    {
      "nombre": "Puerto de Piqueras",
      "entre": ["cameros", "tierra-de-soria"],
      "altitud": 1710,
      "cierre": "invierno",          // invierno | ninguno
      "jornadasExtra": 2,
      "nota": "Paso histórico entre el Duero y el Ebro; cerrado por nieve buena parte del invierno."
    }
  ],
  "vados": [
    { "entre": ["tierra-de-toro", "tierra-de-zamora"], "rio": "Duero", "jornadasExtra": 2 }
  ],
  "calzadas": [
    { "nombre": "Vía de la Plata", "tramos": [["merida", "caceres"], ["caceres", "plasencia"]] }
  ],
  "canyadas": [
    {
      "nombre": "Cañada Real Soriana Occidental",
      "comarcas": ["pinares", "tierra-del-burgo", "tierra-de-sepulveda", "…", "tierra-de-barros"],
      "nota": "De los pastos de Urbión a las dehesas extremeñas."
    }
  ]
}
```

### 4.2 Las nueve cañadas reales

Se trazan como **secuencias de comarcas** contiguas, de norte a sur, siguiendo el recorrido
histórico. Los tramos entre comarcas consecutivas de una cañada quedan marcados con su nombre.

| Cañada | De | A |
|---|---|---|
| Soriana Occidental | Sierras de Urbión y Cebollera | Dehesas de Badajoz |
| Soriana Oriental | Tierras Altas de Soria | Sierra de Ayllón y La Mancha |
| Segoviana | Sierra de Guadarrama y Pedraza | Valle de Alcudia y Extremadura |
| Leonesa Occidental | Montañas de León y Babia | Alentejo fronterizo y Badajoz |
| Leonesa Oriental | Riaño y Cantábrica oriental | Extremadura por Béjar |
| Galiana | Rioja y Cameros | La Mancha y Sierra Morena |
| Riojana | Sierra de la Demanda | Valle del Ebro y Bardenas |
| Conquense | Serranía de Cuenca | Sierra Morena y Andalucía |
| de la Plata | Astorga y Zamora | Sevilla, por la calzada romana |

Regla de trazado: cada cañada debe atravesar **entre 8 y 16 comarcas**, empezar en una con
`pasto-de-verano` y terminar en una con `pasto-de-invierno`, y ser un camino conexo en el grafo.
Estas tres condiciones las comprueba el validador.

### 4.3 Puertos de montaña (mínimo a incluir)

Piqueras, Somosierra, Navacerrada, Guadarrama, Pajares, Leitariegos, Padornelo, Manzanal,
Puerto del Pico, Tornavacas, Béjar, Despeñaperros, Portillo de Cotos, Puerto de la Ragua,
Collado de Velate, Puerto de Cantó, Pandols/Beceite, Puerto del Escudo, Puertos de Beceite,
Serra da Estrela (Torre), Portela do Homem.

Cada uno con su nombre real, las dos comarcas que une, su altitud aproximada y si se cierra.

Regla de juego (repetida aquí para quien implemente): un puerto cerrado en invierno es
**intransitable** salvo que el tramo tenga calzada; entonces solo suma jornadas.

### 4.4 Calzadas romanas

Vía de la Plata (Mérida–Astorga), Vía Augusta (Cádiz–Pirineo por Levante), calzada del Duero
(Zaragoza–Astorga por Numancia) y el tramo Braga–Astorga. Sus tramos empiezan la partida con calidad
de camino carretero (§3.7.2 de la economía).

### 4.5 Consulta desde el núcleo

```ts
export function jornadasDeTramo(
  camino: Camino,
  estacion: Estacion,
  calidad: CalidadCamino,
  reglas: TablasDeReglas,
): number | 'cerrado';
```

Función pura, sin estado, probada con tabla de casos: llano en verano, sierra en invierno, puerto
cerrado, puerto con calzada, vado con y sin puente.

### 4.6 Cobertura

El validador exige que **toda** comarca tenga al menos un tramo de coste ≤ 4 jornadas con alguna
vecina (nadie queda incomunicado), y que no exista ninguna región que quede aislada del resto en
invierno (siempre hay una ruta abierta, aunque sea larga).

## 5. Archivos

```
paquetes/mundo/catalogo/caminos.jsonc                   (nuevo)
paquetes/mundo/src/validarCaminos.ts                    (nuevo)
herramientas/atlas/src/caminos.ts                       (integra la capa al mundo generado)
paquetes/nucleo/src/reglas/jornadas.ts                  (nuevo, puro)
paquetes/nucleo/src/reglas/jornadas.test.ts
```

## 6. Criterios de aceptación

1. Las nueve cañadas están trazadas y cumplen las tres condiciones de §4.2 (test).
2. Están los puertos de §4.3, cada uno entre dos comarcas que existen y son vecinas.
3. `jornadasDeTramo` pasa una tabla de al menos 12 casos escritos a mano.
4. En invierno, el grafo sigue conexo usando solo tramos abiertos (test).
5. Ninguna comarca queda sin un tramo de 4 jornadas o menos.
6. `npm run atlas -- --comprobar` sigue pasando y el mundo incluye la capa nueva.
7. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run atlas
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/jornadas.test.ts paquetes/mundo
```

## 8. Al terminar

1. Índice: T-013 `hecha`; `ESTADO.md`: siguiente T-014.
2. Si has añadido rasgos nuevos (`pasto-de-verano`, `pasto-de-invierno`), actualiza
   `docs/05-geografia.md` §5.5.
3. Commit: `T-013: caminos historicos, puertos, vados y canyadas reales`.
