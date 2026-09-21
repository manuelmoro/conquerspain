# T-049 · Preparación de partidas sin servidor

**Fase:** 2 · Motor · **Depende de:** T-048 · **Estado:** **hecha** (21-09-2026)

## 1. Contexto

T-047 pide menos del 5 % de tierra sin usar y orígenes viables, pero T-065 reservaba el recorte y
el arranque para después de T-062, que depende de T-047. Se extrae aquí la preparación sin E/S;
T-065 conserva la API, persistencia y unión de participantes.

Lee [docs/05 §5.7](../05-geografia.md), [docs/04 §4.2](../04-casas-y-tradiciones.md),
[T-065](T-065-alta-de-partida.md), [la bitácora](bitacora-equilibrio.md) y
`herramientas/banco/src/partida.ts`.

## 2. Objetivo

Compartir entre banco y futuro servidor un recorte y un arranque reproducibles, con orígenes
viables para cada casa, sin depender de cuentas, reloj, HTTP ni base de datos.

## 3. Alcance

**Entra:** selección de subgrafo, orígenes y estado inicial; tablas de configuración; integración
en el banco y pruebas de viabilidad inicial. **No entra:** generar otro atlas, renumerar comarcas,
inventar ferias, cambiar el equilibrio global ni implementar el servidor.

## 4. Diseño detallado

### 4.0 Lo que se midió antes de decidir (21-09-2026)

Sobre el mundo `v1` (403 comarcas), con las jornadas base de los tramos:

| Medida | Valor |
|---|---|
| Comarcas a menos de 6 jornadas de una dada | 5 mínimo, **10 de mediana**, 22 máximo |
| Orígenes del catálogo | 69 |
| Orígenes que caben separados 6 jornadas entre sí (greedy) | **39** en toda la península |
| Orígenes por casa | canteros 6, ferrones 10, salineros 20, mercaderes 21, hortelanos 22, mesta 24, arrieros 25, monjes 26 |
| Comarcas con sal ≥ 3 / hierro ≥ 3 / labor ≥ 4 / pasto ≥ 4 / feria | 12 / 9 / 78 / 68 / 9 |

Dos consecuencias mandan sobre el diseño:

1. **Tres ofertas por jugador no pueden ser todas mutuamente lejanas.** Con ocho casas serían 24
   comarcas separadas seis jornadas entre sí, y en toda la península solo caben 39: no quedaría
   margen para recortar nada. La separación se garantiza **entre la oferta elegida de un jugador y
   las de los demás**, no entre las tres de cada uno (§4.4).
2. **Las casas escasas eligen primero.** Los canteros tienen seis orígenes en todo el mapa; si
   sortean los últimos, se quedan sin sitio. El orden de asignación es por escasez, no por llegada.

### 4.1 Contrato compartido

Las funciones puras viven en `paquetes/nucleo/src/partidas/` y las cifras, en la tabla `arranque`
de las reglas (`paquetes/nucleo/src/datos/arranque.ts`, con sus apartados `ajuste` y `recorte`), más
lo que es propio de cada casa en `datos/casas.ts`. Nada de allí toca disco, reloj ni azar sin
semilla, y el motor sigue sin nombrar a ninguna casa: el arranque la consulta por `reglas/casas`.

```ts
export interface Participante {
  readonly id: IdJugador;
  readonly nombre: string;
  readonly casa: Casa;
}

/** Una tarjeta de origen (docs/04 §4.2): qué te da y qué te falta, dicho en términos de tu casa. */
export interface OfertaDeOrigen {
  readonly comarca: IdComarca;
  readonly nombre: string;
  readonly perfil: Potencial;
  readonly ventaja: string;
  readonly limitacion: string;
}

export interface PeticionDePreparacion {
  readonly mundo: Mundo;
  readonly reglas: TablasDeReglas;
  readonly semilla: string;
  readonly participantes: readonly Participante[];
  /** Recortar el mapa; false deja el mundo entero (lo que hacía el banco hasta T-048). */
  readonly recortar?: boolean;
}

export interface PartidaPreparada {
  readonly mundo: Mundo;
  /** Jugador → sus tres ofertas, en el orden en que se le enseñan. */
  readonly ofertas: Readonly<Record<string, readonly OfertaDeOrigen[]>>;
  /** Lo que hubo que ceder para que cupiera todo el mundo; vacío si no se cedió nada. */
  readonly avisos: readonly string[];
}

export interface PeticionDeFundacion {
  readonly preparada: PartidaPreparada;
  readonly reglas: TablasDeReglas;
  readonly semilla: string;
  readonly participantes: readonly Participante[];
  /** Jugador → comarca elegida entre sus ofertas. */
  readonly elecciones: Readonly<Record<string, IdComarca>>;
  readonly configuracion: ConfiguracionPartida;
  readonly id: IdPartida;
}

export function prepararPartida(peticion: PeticionDePreparacion): Resultado<PartidaPreparada>;
export function fundarPartida(peticion: PeticionDeFundacion): Resultado<EstadoPartida>;
```

`Resultado` es el de la validación del núcleo: `ok` con valor, o la lista de errores con ruta y
mensaje en español. Ningún camino lanza una excepción para un fallo previsible.

**Determinismo y orden.** Los participantes se ordenan siempre por `id` con `comparar` antes de
nada; el azar sale de `azarDe(semilla, 0, 'preparacion', <asunto>)`. Permutar la lista de entrada
no cambia una coma del resultado: el orden de elección no es el de llegada (§4.4).

**Separación de fases.** `prepararPartida` sortea y no funda; `fundarPartida` recibe las elecciones
ya tomadas. El servidor (T-065) persiste lo primero, pregunta y luego llama a lo segundo. El banco
llama a las dos seguidas y elige con el perfil de cada robot, que solo mira la tarjeta de la oferta.

### 4.2 Recorte

`recortarMundo(mundo, reglas, semilla, jugadores, requisitos)`:

1. **Tamaño objetivo:** `max(minimoDeComarcas, comarcasPorJugador × jugadores)`, sin pasar del
   mundo entero. Las cifras van en `ARRANQUE.recorte`; §9 documenta la horquilla medida.
2. **Anclas:** una comarca por requisito (sal, hierro, labor alta, feria, pasto de verano y pasto
   de invierno si juega la Mesta). Se toma el ancla **más cercana al centro** por caminos, con el
   azar decidiendo solo entre las empatadas.
3. **Centro:** se sortea entre los orígenes de una de las casas que juegan, empezando por la que
   menos tiene (los canteros) y rotando en cada reintento. Recortar lejos de sus seis orígenes
   sería dejarla fuera de su propio juego.
4. **Esqueleto:** el centro más el camino más corto del centro a cada ancla. Garantiza conexo.
5. **Crecimiento:** se añade, de la frontera, la comarca más cercana al centro (desempate por
   identificador) hasta llegar al objetivo.
6. **Cierre:** se copian comarcas, tramos entre comarcas incluidas y listas de vecinos filtradas;
   se conservan identificadores, geografía, cañadas, puertos y ferias. El mundo recortado pasa
   `validarMundo` o el recorte se rechaza con su error.

Las jornadas son las **base** del tramo (sin estación, sin obras): el recorte no puede depender de
en qué mes se cree la partida. Queda escrito en `docs/05`.

**Reintentos.** Si el recorte no cumple los requisitos o no deja sitio a las ofertas, se reintenta
con otro centro y el objetivo un 20 % mayor, hasta `intentosDeRecorte` veces. Al agotarlos se
devuelve un error que dice qué faltó y qué hacer (menos casas, o `recortar: false`). Nunca hay
bucle sin límite ni recorte que incumpla en silencio.

### 4.3 Requisitos del recorte

| Requisito | Cómo se comprueba |
|---|---|
| Conexo | Por construcción (esqueleto de caminos) y comprobado con un recorrido |
| Sal alcanzable | Alguna comarca con `sal ≥ 3` |
| Hierro alcanzable | Alguna comarca con `hierro ≥ 3` |
| Pan | Al menos `laborAltaMinima` comarcas con `labor ≥ 4` |
| Comercio | Al menos `feriasMinimas` comarcas con feria (hoy, una) |
| Pastos | Si alguna casa que juega busca su origen por el pasto: una comarca con `pasto-de-verano` y otra con `pasto-de-invierno` |
| Orígenes | Cada casa participante conserva al menos un origen posible dentro del recorte; que le quepan las tres tarjetas lo comprueba el sorteo, que además mira la separación |

El acceso se mide por caminos (Dijkstra sobre jornadas base), nunca en línea recta. El recorte no
regala conocimiento: el jugador sigue empezando viendo solo su capital y lo que la rodea.

### 4.4 Ofertas de origen

`ofertasDeOrigen(mundo, reglas, semilla, participantes, origenesFijos)`:

1. **Orden de elección:** por número de orígenes posibles dentro del recorte (el que menos tiene,
   primero); a igualdad, por el barajado de la semilla. Ni por identificador ni por llegada.
2. Para cada participante, candidatas = sus orígenes posibles que estén a `jornadasEntreCapitales`
   o más de **todas las ofertas ya asignadas a otros jugadores**. Así cualquier combinación de
   elecciones respeta la separación: el jugador puede quedarse con cualquiera de sus tres tarjetas.
3. De esas candidatas se sortean tres con la escalera de `sortearOrigenes`: primero de perfiles
   distintos, luego de regiones distintas, luego las que haya.
4. Si quedan menos de tres, se ofrecen las que haya y se anota un aviso («a los canteros solo les
   caben dos orígenes a seis jornadas de los demás»). Si no queda ninguna, el recorte se reintenta;
   si ya no hay reintentos, error explicable.

La tarjeta de cada oferta dice su perfil, su ventaja y su limitación **en términos de la casa**
(docs/04 §4.2), sacadas de los potenciales de la comarca y de los criterios de origen de la casa.
No lleva nada que el jugador no pueda ver en el mapa antes de empezar.

**Orígenes fijados.** `origenesFijos` permite traer la comarca decidida de antemano (escenarios y
pruebas): quien la trae no sortea, su comarca se reserva antes que ninguna otra, y si no es un
origen válido de su casa la preparación falla diciéndolo. En una partida normal no se usa.

### 4.5 Arranque por origen

Hoy `comarcaInicial` copia `{ granja: 2 }` a todas las capitales. Con `labor 1` eso no da de comer.
El arranque pasa a calcularse con la comarca y la casa delante, y **con las reglas del núcleo**:

```ts
export interface Arranque {
  readonly edificios: Readonly<Record<string, number>>;
  readonly almacen: Recursos;
  /** Por qué se dio cada cosa, para la crónica de alta y para los tests. */
  readonly motivos: readonly string[];
}
export function arranqueDe(comarca: ComarcaMundo, casa: Casa, reglas: TablasDeReglas): Arranque;
```

Reglas, en este orden y con los topes de la tabla:

1. **Comer primero.** Se ponen niveles de granja hasta cubrir el pan de la población en la media del
   año, calculando la producción con `explotacionesDe` del núcleo, no con una fórmula paralela.
   Topes: nivel máximo del edificio, solares de la comarca, vecinos disponibles y `granjasMaximas`.
2. **Donde la tierra no da, da el mar.** Con `labor ≤ laborDePescador` y `pesca ≥ pescaDeLonja`, la
   primera plaza de granja se cambia por una lonja (y su sal viene en el almacén).
3. **La primera pieza del oficio.** Un edificio de la vía de la casa si la comarca lo permite y
   quedan solares: lo dice `DatosCasa.edificioDeOrigen` (salina al salinero, cantera al cantero,
   majada a la Mesta, mercado al mercader, casas al monje, venta al arriero, huerta al hortelano).
   Se respetan potencial mínimo, permisos y prohibiciones de la casa; si no cabe, no se da y se
   anota el motivo. Nunca se regala un edificio imposible ni un descuento particular.
   **Ni uno que coma lo que el arranque no le da:** por eso el ferrón empieza sin carbonera, que se
   comería sus 60 de madera (4 por turno) antes de que tenga con qué levantar la ferrería. Hay un
   test que lo vigila para todas las casas y todas las comarcas.
4. **Lo que no da la tierra se compra.** El pan que falte en el año se compensa con maravedís del
   almacén inicial, al precio base del pan: `maravedís = base + falta × precioBasePan`, con el tope
   `maravedisMaximos`. A las casas marcadas con `compraElPan` **no se les exige** autosuficiencia:
   les basta cubrir `coberturaDeCompradorMil` (70 %) en vez del 95 %, siembran menos y salen con más
   dinero. Lo que **no** se hace es dejarlas sin granjas: probado en T-049, un mercader sin granjas
   no sobrevive al primer año ni con el tope entero de maravedís.

### 4.6 Escenario de viabilidad inicial

Un origen es **viable** cuando, con su arranque y **sin dar una sola orden**, la casa aguanta el
primer año. Sin órdenes es la cota inferior: nadie juega peor que no jugar.

Se simulan 24 turnos (y 48 como diagnóstico) y se mide:

| Cifra | Qué es |
|---|---|
| `turnosConEscasez` | Turnos en los que faltó pan |
| `faltaDePan` | Suma de `max(0, consumo − producción)` de los 24 turnos |
| `poderDeCompra` | `maravedís del turno 24 ÷ precio base del pan` |
| `poblacionFinal` | Para ver si emigró gente |

**Criterio:** `turnosConEscasez === 0`, o bien `poderDeCompra ≥ faltaDePan` (puede comprar lo que le
falta con lo que recauda de verdad, no con una despensa que solo aplaza la quiebra). Se publican
también los resultados desfavorables, con su nombre y su cifra.

La muestra es fija: **un origen por perfil y casa**, elegido como el primero en orden de
identificador de cada perfil, para que no se pueda escoger el favorable. Los perfiles obligatorios
de la muestra son `labor 1`, costa pesquera, salina interior, vega, ferrería y los dos pastos.

## 5. Archivos

- `paquetes/nucleo/src/partidas/{distancias,recorte,ofertas,arranque,fundar,index}.ts`.
- `paquetes/nucleo/src/datos/arranque.ts` (apartados `ajuste` y `recorte`), `datos/casas.ts`
  (`edificioDeOrigen` y `compraElPan` por casa) y sus tipos y validadores en `tipos/reglas.ts` y
  `validacion/validarTablas.ts`.
- `paquetes/nucleo/pruebas/preparacion.test.ts` (recorte, ofertas, arranque y fundación) y
  `herramientas/banco/src/viabilidad.test.ts` (la muestra por perfil sobre el mapa real: la
  viabilidad necesita el catálogo entero y el simulador, que viven en el banco, no en el núcleo).
- `herramientas/banco/src/partida.ts`: pasa a ser el adaptador del mismo preparador, sin copia.
- `docs/05-geografia.md` (§5.7 recorte y ofertas) y `docs/03-economia.md` (arranque por origen).
- T-065: sustituir los puntos transferidos por el contrato que debe consumir el servidor.

## 6. Criterios de aceptación

1. Misma semilla, elecciones y reglas → mismo mundo y estado byte a byte; permutaciones estables.
2. Mundo conexo, referencias válidas, separación y recursos verificables; error explicable cuando
   la configuración sea imposible.
3. Ningún origen ofrecido incumple requisitos estructurales de la casa ni del arranque.
4. La muestra fija por perfil supera el escenario de viabilidad inicial documentado, con costes
   reales y sin privilegios del robot. Se publican también los resultados desfavorables.
5. Banco y servidor tienen un único contrato de preparación. No se incorpora E/S al núcleo.
6. `npm run verificar` pasa. El uso del mapa en T200 se mide después; no se cierra el equilibrio aquí.

## 7. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-049
```

Guardar el manifiesto de T-048 y explicar que cambió el escenario de partida: no atribuir su
resultado a un cambio de balance de una casa.

## 8. Al terminar

Marcar T-049 hecha, actualizar ESTADO y continuar con T-050. Commit y push:
`T-049: preparación pura con recortes y orígenes viables`.

## 9. La horquilla del recorte (medida el 21-09-2026)

Cinco semillas (`1492`, `1492-2`, `1492-3`, `1085`, `1212`) sobre el mundo `v1`, ocho casas:

| Comarcas por jugador | Preparan | Comarcas del recorte | Intentos | Avisos de oferta reducida |
|---:|---|---:|---:|---:|
| 10 | 2 de 5 | 198 | 6,0 | 5 |
| 14 | 5 de 5 | 201 | 4,2 | 11 |
| 18 | 5 de 5 | 207 | 3,0 | 8 |
| 22 | 5 de 5 | 212 | 2,0 | 9 |
| **26** | **5 de 5** | **216** | **1,2** | **8** |
| 30 | 5 de 5 | 250 | 1,2 | 4 |
| 40 | 5 de 5 | 320 | 1,0 | 1 |

Se fija **26 por jugador**: con menos hacen falta reintentos (y el recorte acaba igual de grande,
porque cada reintento crece un 20 %); con más, el mapa se llena de tierra que nadie pisa. Con 10 por
jugador ni siquiera se puede: a los canteros no les quedan orígenes.

Tamaños soportados, con 26 por jugador y las mismas cinco semillas (todas preparan):

| Casas | Comarcas | Intentos | Avisos |
|---:|---:|---:|---:|
| 1 | 42 | 1,2 | 0 |
| 2 | 73 | 2,8 | 1 |
| 4 | 144 | 2,8 | 1 |
| 6 | 194 | 2,2 | 4 |
| 8 | 216 | 1,2 | 8 |

Los avisos son casas que se quedan con dos ofertas en vez de tres, casi siempre los canteros: con
seis orígenes en toda la península, no siempre caben tres a seis jornadas de los demás. Se publica
y no se esconde; el recorte no se agranda solo para taparlo.

**Lo que no arregla el recorte.** En la campaña `1492` el mapa jugado pasa de 403 a 208 comarcas y
la tierra sin usar baja del 82 % al 66 %, pero el criterio de T-047 pide menos del 5 %: los ocho
robots solo pisan unas 70 comarcas en 200 turnos, así que lo que falta ya no es recorte, sino
robots que anden (T-050). Recortar hasta 70 comarcas es imposible: ocho capitales separadas seis
jornadas necesitan unas 200.
