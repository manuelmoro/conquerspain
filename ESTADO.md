# Estado del proyecto

> Este archivo es la aguja del proyecto: dice exactamente dónde estamos y qué toca ahora.
> Se actualiza **al cerrar cada tarea**, y también si una tarea queda a medias.

**Última actualización:** 23 de septiembre de 2026 (T-047 en curso; T-052 abierta)
**Fase actual:** Fase 2 · Motor de reglas

---

## Tarea en curso

**[T-047 · Ajuste de equilibrio v1](docs/plan/T-047-equilibrio-v1.md)** — abierta y **en espera de
T-052**. Es una tarea iterativa por naturaleza (ajustar, medir, repetir); esta sesión deja el
diagnóstico medido, siete ensayos aislados, un cambio adoptado y una ficha nueva abierta desde
dentro. Ver **[Dónde va T-047](#dónde-va-t-047)** más abajo.

> **Cambio de orden (18-09-2026).** T-013 (caminos y cañadas) y T-014 (ferias) se hacen después de
> T-015, no antes: sus datos son puertos, cañadas y ferias de toda la península —Pajares,
> Despeñaperros, Medina del Campo, Sevilla— que caen en comarcas todavía sin escribir, y los
> identificadores provisionales del atlas se renumeran cada vez que el catálogo crece. Escribir esa
> capa ahora sería trabajo para rehacer.

## Siguiente tarea

**[T-052 · Geografía de precios](docs/plan/T-052-geografia-de-precios.md)** — abierta el 23-09-2026
**desde dentro de T-047**, porque la medición demostró que lo que falta es lógica del motor y no una
cifra: el precio base de cada recurso es un número global, así que la sal de Añana vale lo mismo que
la de Sevilla. La ficha está detallada y lista para implementar.

Orden: **T-052 → T-047 (se reanuda) → T-060**.

La base contra la que comparar ahora es `herramientas/banco/informes/T-047-hierro-*`
(robots 3, métricas 4, tres semillas: 1492, 1085 y 1212); `npm run banco -- ... --evaluar` termina
con código 2 mientras quede un criterio sin cerrar.

### Cuándo probará el usuario

El usuario prefiere **esperar a la interfaz**, sin priorizar una consola. [Checkpoints de jugabilidad](docs/plan/checkpoints-jugabilidad.md): J-01 tras
T-082; J-02/J-03 antes de cerrar T-087; J-04 antes de cerrar T-106. Todos están pendientes de
sesiones humanas reales. Hoy el banco solo ofrece simulaciones automáticas e informes.

### Dónde va T-047

**Hecho y verificado** (23-09-2026). Todo lo de esta sesión está medido y escrito en la
[bitácora de equilibrio](docs/plan/bitacora-equilibrio.md), incluidos los cuatro ensayos
descartados; no hace falta repetirlos.

- **El diagnóstico, con cifras.** Cuatro de los nueve capítulos del prestigio —comercio, ganadería,
  industria y caminos— dan **cero a todas las casas** en las nueve partidas, así que el prestigio es
  casi exactamente el pan producido. Una capa más abajo: `negociosRentables`, `ventasFuera` e
  `ingresosDeFeria` valen **0** en las nueve. El precio base de cada recurso es un número global y
  los mercaderes menores cubren el cupo entero de la plaza por los dos lados, así que **todas las
  plazas cotizan lo mismo, siempre**: el arbitraje es imposible con cualquier porte.
- **Descartado como explicación:** administrar territorio no frena a nadie (deuda 0 en las ocho
  casas al turno 200, con los monjes a 16 comarcas).
- **Cambio adoptado:** `casas.ferrones.origenes` pasa a una sola tarjeta, `hierro ≥ 1` **y**
  `monte ≥ 2` en la propia comarca. Antes valía con que una vecina tuviera hierro, y en cuatro de
  cada cinco semillas la casa del hierro empezaba con `hierro: 0`. El segundo defecto (hierro sin
  monte, es decir ferrería sin carbonera) lo cazó `solvencia.test.ts`.
- **Archivos tocados:** `paquetes/nucleo/src/datos/casas.ts`,
  `paquetes/nucleo/pruebas/origenes.test.ts`, `docs/plan/bitacora-equilibrio.md`,
  `docs/plan/T-052-geografia-de-precios.md` (nueva), `docs/plan/00-indice.md` y los informes
  `herramientas/banco/informes/T-047-hierro-*` y `E1-bastimento1-1492`.
- **Siete ensayos, un solo cambio de valores.** Los siete dejan las tablas exactamente como estaban
  salvo el origen de los ferrones; los seis descartados están medidos en la bitácora para que nadie
  los repita.
- `npm run verificar` pasa: 58 archivos, **1010 pruebas** en verde, y el atlas coincide.

**Lo que falta, en orden.** Ninguno de los tres es un ajuste suelto: son las tres causas medidas.

1. **La geografía de precios: medida y sacada a [T-052](docs/plan/T-052-geografia-de-precios.md).**
   Se ensayaron las dos palancas de datos que quedaban —liquidez de los menores a 300 y margen a
   20— y ninguna crea un solo negocio: al turno 100 la dispersión entre las diez plazas es de 0,0
   puntos en la lana, 0,4 en el hierro y 0,6 en la sal. El precio de una plaza solo se mueve si
   alguien compra o vende allí, y esos tres recursos no se comercian en ninguna parte. **Ninguna
   cifra puede abaratar la sal donde hay salinas si solo existe un número para la sal**, así que es
   lógica y va en ficha aparte, como manda §3.
2. **Los monjes.** 417–572 % de la mediana y ganan las nueve repeticiones. Su `lealtadMinima: 50`
   está muy por encima de `lealtadDesleal: 20`, así que ninguna penalización territorial les llega:
   ni la deuda de administración, ni la lejanía, ni el abandono. Cualquier valor de
   `lealtadMinima` por encima de 20 los deja igual de inmunes: decidir el privilegio, no la cifra.
3. **El marcador.** 20 por comarca y 1 por cada cinco vecinos frente a 10 por un año trashumante o
   30 por una feria destacada. Mientras los capítulos del oficio valgan un orden de magnitud menos
   que ocupar tierra, ninguna vía compite con crecer. Se ajusta **después** de (1), porque hoy esos
   capítulos valen cero y reescalarlos no movería nada.

**Cómo se trabaja esta tarea** (lo dice §4 de la ficha, y se ha respetado): un solo grupo de valores
por ensayo, informe nuevo con su manifiesto, comparación con `npm run banco:comparar`, anotación en
la bitácora con hipótesis, cambio, resultado y decisión, y revertir el candidato descartado antes
del siguiente. Los robots quedan fijos en la versión 3 mientras dure el ajuste. Una campaña de tres
repeticiones tarda unos 80 segundos, así que se puede iterar de verdad.

## Cómo continuar (resumen)

1. Lee [CLAUDE.md](CLAUDE.md) §1 (protocolo) si no lo has leído en esta sesión.
2. Abre la ficha de la siguiente tarea y léela entera, junto con los documentos de diseño que cite.
3. Impleméntala completa, verifica y cierra siguiendo el apartado «Al terminar» de la ficha.
4. Actualiza este archivo: tarea en curso, siguiente tarea y una línea en la bitácora.

En Claude Code basta con invocar `/sigue-construyendo-conquerspain`, que hace justo esto.

---

## Qué existe hoy

| Pieza | Estado |
|---|---|
| Documentación de diseño (`docs/01` a `docs/09`) | Completa para las fases 0 a 5; la fase 6 (conflicto) está esbozada |
| Plan de tareas (`docs/plan/`) | Índice completo; fichas detalladas de las fases 0 a 2 |
| `maqueta/` | Maqueta visual v0.1 publicada y congelada. Referencia de dirección de arte, **no** es el juego |
| `paquetes/` | `nucleo` y `mundo` implementados y cerrados hasta T-051 (T-050 solo añadió exportaciones de funciones de movimiento, ruta y pastos; T-051 no tocó el motor); el ajuste de equilibrio (T-047) está **en curso**: de momento solo ha cambiado el origen de los ferrones, que ahora exige hierro y monte propios; `servidor` y `cliente`, vacíos salvo su versión (fases 3 y 4) |
| `herramientas/` | `atlas` (T-011) y `banco` (T-046, T-048, T-050 y T-051), los dos en marcha |
| Verificación | `npm run verificar` (tipos + lint + formato + tests) pasa en limpio |
| Casas | Las ocho, en `src/datos/casas.ts`, sobre modificadores, permisos y prohibiciones genéricos que las fases consultan a través de `reglas/casas/`; ningún archivo del motor nombra una casa (lo vigila un test). Lo que necesita a otro jugador está desactivado hasta T-103 |
| Jugar sin estar | Fase 0 (mayordomo) antes del calendario: plan de temporada de seis turnos, colas de obra y de recua que no reservan hasta empezar, reglas del mayordomo con condiciones y acciones cerradas (3 a 6 activas) y rutas permanentes que se detienen solas y reponen en casa. **Demostrado en T-051**: el mismo plan, dejado por bloques de seis turnos o entregado a mano día a día, da **exactamente el mismo dominio**; 144 de 144 filas al 0,0 % en las ocho casas y tres semillas. Los seis escenarios mínimos (obras, comercio con precio límite, feria que cruza el bloque, trashumancia con fecha, gobierno e influencia, y los casos que se tuercen) viven en `escenarios/equivalencia.test.ts` |
| Niebla y crónica | `vistaDeJugador` (lo único que sale del servidor) con las diez reglas de filtrado y prueba de fuga; crónica por plantillas para los 108 tipos de suceso, en el orden avisos → sucesos → economía → rumores → hitos y con acción sugerida; precios fechados por plaza; rumores deterministas y acotados al 5 % |
| Marcador | Prestigio recalculado cada turno por nueve capítulos y penalizaciones sobre el estado y el `registro` del jugador; doce hitos (uno desactivado hasta T-103) con su primicia; clasificación guardada con el puesto anterior. Tabla y catálogo en `src/datos/prestigio.ts` |
| Tradiciones | 72 en `src/datos/tradiciones.ts` (tres por casa y ronda: profundizar, compensar y abrir), cuatro desactivadas hasta T-102, T-103 y T-120. Rondas Renombre, Fama y Linaje que se abren en la fase 11, orden `tradicion` gratuita e irreversible, y composición casa + tradiciones en `reglas/casas` según `COMPOSICION_DE_MODIFICADORES` |
| Guardas de pureza del núcleo | Dos capas activas: reglas de ESLint y `paquetes/nucleo/pruebas/pureza.test.ts` |
| Útiles del núcleo | `paquetes/nucleo/src/utiles/`: milésimas, orden estable, azar con semilla, forma canónica y SHA-256 propio |
| Tipos del dominio | `paquetes/nucleo/src/tipos/`: mundo, estado, órdenes, tablas de reglas y crónica |
| Validación | `paquetes/nucleo/src/validacion/`: combinadores propios y los cuatro validadores, con ruta del campo y mensaje en español |
| Motor | `resolverTurno` recorre las doce fases y firma el turno con su huella. Implementadas: 1 calendario, 2 producción (con los insumos de los edificios), 3 consumo, merma y escasez, 4 movimiento de recuas, 5 cometidos, 6 obras, 7 mercado (plazas, casación, precios y menores), 8 territorio (lealtad, fueros, corte, influencia e incorporación de comarcas), 9 población, 10 acontecimientos y 11 prestigio (registro, hitos, primicias, recuento, clasificación y tradiciones) y 12 crónica (lo que ven las recuas, corresponsales y rumores), con los rebaños en las fases 2 y 4. La crónica de cada jugador se compone con plantillas y `vistaDeJugador` filtra el estado Ciclo de vida de las órdenes en `src/ordenes.ts` |
| Partidas de reproducción | `paquetes/nucleo/pruebas/partidas/` + `npm run partidas`: si una huella cambia, el test lo dice y explica cómo regenerarla |
| Catálogo geográfico | `paquetes/mundo/`: formato `.jsonc` con comentarios, validador con nueve reglas, informe de cobertura **completo**: las diez regiones escritas, 403 comarcas reales de la península, todas con su nota justificando el criterio |
| Banco de pruebas | `npm run banco`: partidas automáticas con un robot por casa (estrategias escritas a mano que solo miran la vista de su jugador, con un test que se lo comprueba manipulando mundo y estado), métricas por jugador y turno, e informe en Markdown con su evaluación, procedencia, ritmo, arbitraje trazado, órdenes por motivo y las cinco alertas antiguas como diagnóstico. Escenarios `normal` y `hambre`. `npm run banco:comparar` enseña qué cambia entre dos informes y avisa si no comparten procedencia. Informes de referencia: `2026-09-19-1492.md` (T-046), `T-048-1492.md`, `T-049-1492.md` y **`T-050-1492.md`, la base nueva** |
| Robots del banco | Previsión exacta de viajes con las funciones del núcleo (`robots/viaje.ts`); recuas que solo salen si pueden volver, se rehacen si se merman y conservan su papel por hueco; expedición arriesgada deliberada; trashumancia planificada con los dos pastos; arbitraje con ganancia neta; tratante que compra por urgencia; `hacerSitio` que derriba lo que no puede trabajar. Cada decisión devuelve también sus **motivos** (catálogo cerrado por categoría: mapa, reglas, recursos, plan). `solvencia.ts` comprueba que el plan de cada casa quepa y tenga insumos en todos los perfiles de origen. La prueba de vía exige la acción distintiva y el informe la enseña partida a partida con su «por qué no» |
| Equivalencia de ejecución | `escenarios/equivalencia.ts`: guiones que se juegan de dos maneras y `planDeRobot`/`jugarPlanAMano`, que toman el plan de un robot y lo entregan día a día. Compara el **dominio** (todo menos la lista de órdenes, la huella del turno, las colas y lo reservado, que son el espejo de las órdenes en vuelo). El informe trae su tabla y, aparte, el diagnóstico de sensibilidad a la frecuencia |
| Evaluación del equilibrio | `equilibrio.ts` juzga los nueve criterios de T-047 §5 por partida y casa: cumple, incumple o no evaluable, con observado sin redondear, unidad, ámbito y evidencia; los umbrales viven en `OBJETIVOS` y su huella va en el manifiesto. Un «cumple» que se apoya en una tarea sin terminar no cierra nada. «Decisiones útiles» se mide desde T-050 (turno sin orden que trabaje ni plan en marcha) y la **ausencia desde T-051** sobre el mismo plan, no sobre dos planes distintos. `--evaluar` sale con código 2 mientras quede uno: hoy son 44 filas de 157, ninguna sin evaluar |
| Procedencia de los informes | Manifiesto JSON con revisión, versiones de banco, métricas, robots y reglas, semillas, turnos, cadencias, escenario, huella del mundo, huella de **las tablas completas** y huella de los objetivos, más la huella final y la integridad de visitas de cada partida |
| Alta de partida | `paquetes/nucleo/src/partidas/`: `prepararPartida` (recorte del mapa a los que juegan, con sal, hierro, pan, feria y pastos dentro, y tres tarjetas de origen por jugador separadas seis jornadas de las de los demás) y `fundarPartida` (estado del turno 1). Puro, sin E/S, y **el banco ya es solo un adaptador**: no hay dos altas. T-065 le pondrá encima la persistencia y la API |
| Arranque por origen | `arranqueDe(comarca, casa, reglas)`: granjas hasta cubrir el año (95 %, o 70 % en las casas que viven de comprar), lonja donde la tierra no da y el mar sí, la primera pieza del oficio si la comarca la admite, y maravedís por el pan que falte. Cada nivel pasa por `impedimentoDeConstruir`; ningún edificio regalado come lo que el arranque no entrega. La viabilidad se prueba con una muestra fija: un origen por perfil y casa, un año entero **sin dar una sola orden** |
| Tablas del juego | `TABLAS_DEL_JUEGO` en `nucleo/src/datos/index.ts`: las tablas reales montadas (con las casas de verdad), más `datos/estaciones.ts`. Hasta ahora solo existían montadas en las pruebas |
| Mapa jugado | Cada partida se juega en un recorte del catálogo: 26 comarcas por jugador (unas 208 con ocho casas), conexo y con los identificadores y la geografía del mundo original |
| Mapa generado | `npm run atlas` produce `mundo.v1.json` (**403 comarcas, ninguna provisional**, 1143 tramos, grafo conexo) con la **capa histórica**: 24 puertos, 14 vados, 4 calzadas romanas y las 9 cañadas reales byte a byte igual en cada ejecución; `--comprobar` entra en `npm run verificar` |

La maqueta publicada está en https://claude.ai/artifact/8JC7wCp9LtAFDs6Sg8jhaN

## Decisiones tomadas (no se reabren sin motivo)

| Decisión | Fecha |
|---|---|
| Espíritu VGA Planets: órdenes, resolución simultánea por un anfitrión, asimetría fuerte | 17-09-2026 |
| Las facciones son **casas de oficio** ibéricas, no reinos ni banderas | 17-09-2026 |
| Anclaje histórico libre en los siglos XIII–XVI | 17-09-2026 |
| TypeScript con motor de reglas puro y determinista compartido entre cliente y servidor | 17-09-2026 |
| Se trabaja **por capas técnicas**, priorizando la calidad sobre ver algo jugable pronto | 17-09-2026 |
| Turno = quincena; 24 turnos por año; el intervalo real lo fija cada partida | 17-09-2026 |
| Siete recursos: pan, madera, piedra, maravedís, sal, hierro, lana | 17-09-2026 |
| Node 22, npm workspaces, TypeScript 6 estricto, Vitest, ESLint 10 y Prettier | 17-09-2026 |
| Solo se emiten declaraciones; el código se ejecuta desde las fuentes y los imports llevan `.ts` | 17-09-2026 |

## Bitácora

| Fecha | Qué pasó |
|---|---|
| 23-09-2026 | **T-052 abierta desde dentro de T-047**: la geografía de precios no es una cifra. Al turno 100, entre las diez plazas de una partida, la dispersión de precios es de **0,0 puntos en la lana, 0,4 en el hierro y 0,6 en la sal**: lo que distingue una comarca de otra cuesta lo mismo en todas partes, y la comisión sola es un 2 % por lado. Se ensayaron y descartaron las dos palancas de datos que quedaban (liquidez de los menores a 300, que además **quita el comprador** y hunde el prestigio a 0 de 24 filas; y margen al 2 %, que no mueve la dispersión). La razón se lee en el código: el precio de una plaza solo cambia si alguien compra o vende allí, y la sal, el hierro y la lana no se comercian en ninguna parte, así que se quedan clavados en su único `precioBaseMil` global. **Ninguna cifra puede abaratar la sal de Añana frente a la de Sevilla.** Ficha [T-052](docs/plan/T-052-geografia-de-precios.md) escrita y detallada: precio base por comarca derivado de sus potenciales, con su tabla de abundancia, los cuatro sitios que hoy usan el número global y criterios de aceptación con cifras. T-047 se reanuda después |
| 23-09-2026 | **T-047 en curso**: el marcador solo paga por crecer. Diagnóstico medido sobre las nueve partidas de T-051: cuatro de los nueve capítulos del prestigio —comercio, ganadería, industria y caminos— dan **cero a todas las casas**, así que el prestigio es casi exactamente el pan producido (monjes 417 %, hortelanos 379 %, ferrones 14 % de la mediana). Una capa más abajo, el comercio **no existe**: `negociosRentables`, `ventasFuera` e `ingresosDeFeria` valen 0 en las nueve, porque el precio base es un número global y los mercaderes menores cubren el cupo entero de la plaza por los dos lados. Cinco ensayos aislados: bastimento a la mitad, colchón del arranque, sal de la lonja y `compraElPan` del ferrón, **descartados con su medida**; adoptado que **la casa del hierro empiece donde hay hierro y monte** (antes bastaba con que lo tuviera una vecina, y en cuatro de cada cinco semillas arrancaba con `hierro: 0`; el segundo defecto, ferrería sin carbonera posible, lo cazó `solvencia.test.ts`). Ferrones de 5–14 % a 28–53 %. El recuento global no se mueve porque los monjes se lo comen: es lo siguiente. 1010 tests en verde |
| 23-09-2026 | **T-051 hecha**: jugar sin estar, demostrado. Arnés de equivalencia que juega el mismo plan de dos maneras —dejado por bloques de seis turnos o entregado a mano día a día— y compara el dominio turno a turno; los seis escenarios mínimos de la ficha y las ocho vías con el plan de sus robots. **144 de 144 filas al 0,0 %** en 1492, 1085 y 1212, con igualdad exacta del dominio en siete de las nueve partidas; el criterio de ausencia pasa de 1 a 48 filas cumpliendo por semilla. Para llegar ahí, los robots dicen el plan entero con lo que el motor ya daba: colas de una obra por turno, el trato de cada turno fechado, viajes completos de ida y vuelta y el regreso del emisario con fecha. Hallazgo escrito en docs/02 §2.5.6: una orden suelta se cancela si al darla no hay con qué pagarla y la misma en cola espera; sin colas, el plan a mano se retrasaba un turno en cada obra apretada. **Ningún cambio del motor ni de las tablas.** 1010 tests en verde |
| 22-09-2026 | **T-050 hecha**: los robots juegan su vía y dicen por qué no. Previsión de viajes con las mismas funciones del motor (el núcleo solo exporta más; ninguna regla cambia), recuas que vuelven y se rehacen sin perder su papel, expedición arriesgada deliberada, trashumancia planificada (en Sayago, Aliste ↔ Bragança con calidad 833 y cinco rebaños), arbitraje con ganancia neta fuera del dominio, solvencia de los planes en todos los perfiles de origen, motivos por categoría y «decisiones útiles» por fin medible. Campaña `T-050-1492`: 15 de 24 vías; las nueve ausentes, explicadas (el arbitraje no paga el camino con porte 10, pastos o plazas que el mapa no da, Bilbao no sostiene a los ferrones); 71 filas cumplen, 86 incumplen, 0 sin evaluar. La ausencia empeora porque el robot diligente juega mejor: es T-051. 1000 tests en verde |
| 21-09-2026 | **T-049 hecha**: el mapa que se juega y con qué se empieza. Recorte conexo por partida (403 → 208 comarcas con ocho casas) con sal, hierro, pan, feria y los dos pastos dentro, crecido desde un centro sorteado entre los orígenes de la casa que menos sitio tiene; tres tarjetas de origen por jugador, separadas seis jornadas de las de cualquier otro, con el orden de elección por escasez y no por llegada; arranque calculado con la comarca delante, con su prueba de viabilidad de un año **sin dar una sola orden** para un origen de cada perfil y casa. El banco pasa a ser un adaptador del mismo contrato que usará el servidor. Tres hallazgos: quitarle las granjas a quien «vive de comprar» lo condena, una carbonera regalada deja al ferrón sin madera para su ferrería, y el recorte **no** puede cerrar el criterio de tierra (hacen falta robots que anden, T-050). 978 tests en verde |
| 21-09-2026 | **T-048 hecha**: el banco ya dice la verdad. `equilibrio.ts` juzga los nueve criterios de T-047 por partida y casa (cumple / incumple / no evaluable), con los umbrales en una sola tabla y sus bordes probados uno a uno; manifiesto de procedencia con huella de las tablas completas, del mundo y de los propios objetivos; rachas de precio que se rompen cuando la plaza cierra; visitas de paso contadas (y avisadas si no se pueden reconstruir); arbitraje seguido carga a carga, que destapa **cero negocios reales** en la campaña de referencia; y órdenes propuestas, de alta, terminadas, canceladas y en espera con su motivo. La base nueva `T-048-1492` coincide con lo que la bitácora había leído a mano: dominio T34/T33/T32 y primera obra mayor T88. **Ninguna tabla del juego cambia.** 948 tests en verde |
| 19-09-2026 | **Checkpoints de jugabilidad añadidos**: primera prueba humana tras T-082, ciclo completo y prueba sin ayuda antes de cerrar T-087, piloto de varios días antes de cerrar T-106. El usuario acepta esperar a la interfaz; no se crea tarea de consola ni se cambia T-048 como siguiente. |
| 19-09-2026 | **Plan revisado por petición del usuario**: T-047 bloqueada, siguiente T-048. Cuatro fichas para métricas auditables, preparación pura de partidas, robots viables y ausencia equivalente; se elimina el ciclo con T-065. Referencia reproducida y dos ensayos de logística descartados, sin cambios de reglas. Evidencia y criterios en `docs/plan/bitacora-equilibrio.md`; no se declara terminado el equilibrio. |
| 19-09-2026 | **T-046 hecha**: el banco de pruebas. Ocho robots (uno por casa) sobre tres piezas comunes —el tablero que filtra el mundo por lo que el jugador conoce, la fábrica de órdenes con los costes del núcleo y los impulsos con sus prioridades— más la vía propia de cada casa; cada robot elige su origen entre los tres sorteados como lo haría un jugador. Ejecutor determinista (mismo informe byte a byte), métricas por jugador y turno, informe con las cinco alertas de salud y `comparar`. **Una partida de 200 turnos con las ocho casas tarda unos 8 s (el criterio pedía menos de 2 minutos).** Seis de las ocho vías salen en el informe de referencia; la de la Mesta y la del mercader no, y el banco dice por qué: con porte 10 no se llega a ninguna feria ni a una segunda plaza. Cinco hallazgos anotados en T-046 §8 para T-047. 899 tests en verde |
| 19-09-2026 | **T-045 hecha**: jugar sin estar. Plan de temporada y colas como campos de toda orden, con los estados `programada` y `en cola`, que no reservan hasta empezar. La cola de obras salta lo que no se puede pagar; la de recua va de una en una. Orden `cola` para reordenar. Mayordomo con ocho condiciones y cuatro acciones cerradas, su límite y su orden por prioridad, y marcado en la crónica. Rutas circulares que se detienen por bastimento o por tres fallos de precio, y que reponen en casa (`humo-02` recorre ahora su medio año entero). **Test de ausencia (§4.5): la misma estrategia cada turno y cada seis turnos da 175 y 175 de prestigio al turno 100, un 0,0 % de diferencia.** 840 tests en verde |
| 19-09-2026 | **T-044 hecha**: la niebla y el parte. `vistaDeJugador` con las diez reglas de §4.1, probadas una a una, y una prueba de fuga que busca identificadores, cifras y la semilla en la vista serializada. Crónica compuesta por plantillas con voz de cronista, con nombres en lugar de identificadores, fecha, resumen económico, clasificación y acción sugerida; un test lee el código fuente y exige plantilla para cada suceso y dato para cada hueco. Precios fechados por plaza (visita, corresponsal, rumor); los corresponsales de los mercaderes funcionan. Rumores por feria, Camino y venta, deterministas y redondeados a dos cifras (±5 %). Las huellas cambian; los sucesos de las fases 1 a 11, idénticos. 816 tests en verde |
| 19-09-2026 | **T-043 hecha**: el marcador. Prestigio recalculado entero cada turno en nueve capítulos (población, territorio, obras, caminos, comercio, exploración, ganadería, industria e hitos) menos penalizaciones, con tres escenarios comprobados a mano (49, 853 y −45). Registro del jugador con lo que no se deduce del estado; doce hitos en su umbral exacto (Buen nombre, desactivado hasta T-103); primicia única con desempate por mérito y hash; clasificación estable guardada con el puesto anterior. Las huellas cambian, pero los sucesos de las fases 1 a 10 son idénticos a los del commit anterior. 778 tests en verde |
| 19-09-2026 | **T-042 hecha**: tradiciones. 72 cartas con nota histórica (una de cada criterio por casa y ronda), rondas que se abren con sus condiciones y no se cierran, orden `tradicion` con sus siete rechazos (incluida la elección ambigua, que anula las dos) y composición con la casa: factores, sumandos y valores fijos, en el orden de las rondas. Siete puntos de extensión nuevos (agotamiento por recurso, avance por tipo de obra mayor, cuadrillas, aperos, administración, influencia y bastimento) y los maravedís de la casa sobre mercado e impuestos. Todas las fases leen la casa a través de `reglas/casas`. `EstadoJugador` gana `rondas` (huellas de `humo-01` y `humo-02` cambiadas; sus sucesos, idénticos). El test de permutaciones destapó que el redondeo hacía depender del orden de elección. 745 tests en verde |
| 19-09-2026 | **T-041 hecha**: las ocho casas de oficio. Cada una es una fila de datos con su privilegio, su herramienta y su límite, sobre puntos de extensión genéricos (producción por edificio y por vega, sostén de la ferrería, coste de obra mayor por tipo, capacidad por casas, gente para fundar puebla, suelo de lealtad, permisos y prohibiciones). Nuevas órdenes `aperos` (que nadie instalaba) y `letra-de-cambio`, edificio `acequia`, y sorteo de tres orígenes de perfiles distintos filtrado por casa, probado con el mundo real. Los tests destaparon tres defectos: el monte de los ferrones no se agotaba más deprisa, la ferrería costaba hierro 1 a todos y nadie instalaba aperos. Vender aperos, el contrato de obra y el portazgo quedan desactivados hasta T-103. 706 tests en verde |
| 19-09-2026 | **T-040 hecha**: la trashumancia funciona. Rebaños que se forman, andan (dos jornadas por turno, una más por cañada) y pastan según la estación y la capacidad de la comarca (reparto proporcional), esquilan en el turno 10 con calidad medida sobre el año entero, pierden ganado a partir del segundo turno sin pasto, abonan la labor de la comarca donde invernan, avisan de los puertos dos turnos antes y solo cruzan tierra ajena por cañada con el paso franco de la Mesta. Año entero de un rebaño: 12 sacas por mil cabezas dando el ciclo completo y menos de 7 quieto en la sierra. `EstadoComarca` gana `turnosDeAbono` y `estiercol` (huellas de `humo-01` y `humo-02` cambiadas a propósito, comprobado con el commit anterior). 644 tests en verde |
| 18-09-2026 | **T-039 hecha**: pasan cosas, pero avisadas. Diez acontecimientos (lluvias, sequía, nieves tempranas, riada, peste de ganado, buen año de feria, carestía de sal, romería, incendio y maestros) sorteados de la semilla con las reglas de la ficha (2 a 4 al año, uno bueno como mínimo, uno malo por región como mucho), calendario del año publicado el primer turno y anuncio exacto a dos turnos; solo lo anunciado ocurre. Los efectos son modificadores que ya consultan producción, obras, mercado, calendario y movimiento (nieves tempranas, riadas). 599 tests en verde |
| 18-09-2026 | **T-038 hecha**: la tierra se gana. Influencia en cada comarca neutral con sus siete fuentes (presencia, vecinas, mercado, comercio, monasterio, camino y regalo) y su desgaste, desglosada en un suceso; orden `regalo` con enfriamiento de cuatro turnos; orden `incorporar` con los cuatro requisitos y motivo, tres turnos, devolución del coste y disputa por influencia, presencia seguida y huella; `previsionIncorporar` que coincide con la fase real. `EstadoComarca` gana `presenciaSeguida`, `ultimoRegalo` y `exDuenyo` (las huellas de `humo-01` y `humo-02` cambian a propósito; comprobado con el commit anterior que solo cambian esos campos). 557 tests en verde |
| 18-09-2026 | **T-037 hecha**: el mercado funciona. Plazas locales y de feria que nacen al abrirse, órdenes con precio límite que ejecuta una recua quieta que trata (y las paradas de ruta), casación entre jugadores con reparto proporcional y desempate por mérito y huella, mercaderes menores como dos líneas del libro cuyo cupo se apaga con el comercio humano, precios con impulso, regresión al base y recorte del 15 %, comisión del 2 % (1 % en feria) y sucesos `mercado.*` para la crónica. Tablas reales de precios base. Escenario: 300 de lana en una feria grande hunden el precio a 43 250 (−13,5 %) y los menores lo devuelven a 49 737 al turno siguiente; sin menores tarda más de diez turnos. 499 tests en verde |
| 18-09-2026 | **T-036 hecha**: la gente crece y la lealtad manda. Crecimiento con sus cuatro condiciones y su motivo, lealtad con todas sus fuentes, cuenta atrás y vuelta a neutral de la comarca desleal, política de fueros, carga fiscal y dehesa, deuda de administración acumulada, distancias por el mejor camino conocido en verano y traslado de la corte. Escenario de 100 turnos: sin fueros ni caminos, 98 turnos en deuda y el dominio se deshace; con ellos, ninguno. 428 tests en verde |
| 18-09-2026 | **T-035 hecha**: se construye. Edificios con cuadrillas y solares, frenazo invernal (piedra al doble, madera +50 %), derribar, roturar, y las siete obras mayores pagadas a plazos según avanzan, con parada por falta de material, abandono con deterioro y sus efectos (puentes y calzadas en el estado de los caminos, monasterio, catedral, muralla, atarazana y acequia). 410 tests en verde |
| 18-09-2026 | **T-034 hecha**: las recuas hacen cosas al llegar. Explorar (con fecha, vecinas oídas y hallazgos de aldeas o noticias de rivales), portear, poblar sin pasar de la capacidad, fundar puebla (influencia ≥ 40, 10 vecinos, dos turnos, desempate por influencia y huella), estar presente, disolver, y paradas de ruta que detienen a la recua para cargar, descargar o tratar. 389 tests en verde |
| 18-09-2026 | **T-033 hecha**: las recuas andan. Rutas por Dijkstra solo por lo explorado y sin puertos cerrados, paso en milésimas por varias comarcas en un turno, bastimento del almacén o de la carga, vuelta atrás si nieva a medio puerto, y el ciclo de vida de las órdenes (alta con reserva, espera, cancelación y retirada). Partida de reproducción nueva `humo-02`. 372 tests en verde |
| 18-09-2026 | **T-032 hecha**: el motor come. Pan de la gente y de las cuadrillas, hierro de los aperos, administración por jornadas a la capital, merma con granero y sal, escasez con sus efectos, emigración a la tercera y avisos de hambre y de aperos; insumos de carbonera y lonja en la fase 2. **Cambio de equilibrio**: un cuarto de pan por vecino (con uno entero, un origen típico no se alimentaba). Tabla `arranque` nueva, pendiente de que el alta (T-065) la ajuste por origen. 331 tests en verde |
| 17-09-2026 | Maqueta visual v0.1 construida y publicada |
| 17-09-2026 | Diseño completo escrito (visión, núcleo, economía, casas, geografía, competición, arquitectura, interfaz, glosario) y plan de tareas creado |
| 18-09-2026 | **T-031 hecha**: el motor produce. Primeras tablas reales del juego (quince edificios y la cadena de producción), cada explotación con su desglose explicable factor a factor, maravedís de mercado e impuestos y agotamiento con regeneración. 307 tests en verde |
| 18-09-2026 | **T-030 hecha**: primera fase real del motor. Calendario, estado estacional (barro, puertos cerrados, pastos, factores) y clima anual reproducible, todo función pura del turno y fuera del estado; la fase 1 publica los cambios como sucesos. 280 tests en verde |
| 18-09-2026 | **T-016 hecha y fase 1 completa**: las 451 notas del catálogo con su ortografía (pasada automática conservadora con el diccionario `es_ES` y dos pasadas a mano) y una guarda que impide volver atrás. 264 tests en verde |
| 18-09-2026 | **T-014 hecha**: once ferias en su propio archivo (tres grandes: Medina ×2 y Sevilla), los diecisiete rasgos en uso, `ComarcaMundo.ferias` pasa a ser lista y **598 nombres visibles corregidos** (Logroño, Sigüenza, Àger, Guimarães…). Las notas pasan a T-016. 262 tests en verde |
| 18-09-2026 | **T-013 hecha**: capa histórica de caminos. 24 puertos de montaña (19 se cierran en invierno), 14 vados, 4 calzadas romanas y las 9 cañadas reales sobre el grafo; `jornadasDeTramo` en el núcleo con su tabla de 17 casos; `Camino` gana `cierraEnInvierno`. 251 tests en verde |
| 18-09-2026 | **T-015 hecha: el catálogo geográfico está completo.** Entrega 10 (centro y sur de Portugal, 41 comarcas) y pasada de remates (36 comarcas repartidas por ocho regiones): **403 comarcas reales, cero provisionales**. Las comprobaciones globales del mapa pasan como test: 12 comarcas con sal, 9 con hierro en cuatro focos, 78 con `labor >= 4`, 69 orígenes y 3,5 jornadas de distancia media. 222 tests en verde |
| 18-09-2026 | **T-015, entrega 9 hecha**: Andalucía, 43 comarcas. Cinco con `labor 5` en el valle del Guadalquivir, la sal de la bahía de Cádiz con `sal 5`, el cobre y el hierro de Riotinto y el mármol de Macael (`piedra 5`, único del mapa). 332 comarcas reales de 398. 211 tests en verde |
| 18-09-2026 | **T-015, entrega 8 hecha**: Levante y Murcia, 31 comarcas. Las cuatro huertas de `labor 5` (València, la Ribera, la Vega Baja y Murcia), diez puertos de mar y la sal de La Mata y San Pedro del Pinatar. 289 comarcas reales de 398. 202 tests en verde |
| 18-09-2026 | **T-015, entrega 7 hecha**: Ebro, Pirineo y Cataluña, 42 comarcas. La montaña de sal de Cardona (`sal 5`), el hierro de la farga en el Ripollès, las vegas de Tudela y Lleida con `labor 5` y las Bardenas y los Monegros como pasto de invierno. 258 comarcas reales de 386. 195 tests en verde |
| 18-09-2026 | **T-015, entrega 6 hecha**: Meseta sur, 35 comarcas. Dieciocho labran a 4 o más y once tienen viñedo; Toledo y Madrid entran en el mapa. 216 comarcas reales de 377. 188 tests en verde |
| 18-09-2026 | **T-015, entrega 5 hecha**: Sistema Central y Extremadura, 37 comarcas. Las dos mitades de la trashumancia en el mismo archivo: nueve comarcas de pasto de verano arriba y catorce de dehesa o pasto de invierno abajo. 181 comarcas reales de 377. 180 tests en verde |
| 18-09-2026 | **T-015, entrega 4 hecha**: Galicia y norte de Portugal, 38 comarcas. Trece pescan y once tienen viñedo; ni sal, ni hierro, ni una sola comarca con `labor >= 4`. La horquilla de comarcas del atlas pasa a ser adaptativa mientras quede relleno. 173 tests en verde |
| 18-09-2026 | **T-015, entrega 3 hecha**: cornisa cantábrica y País Vasco, 35 comarcas. El reverso de la Meseta: una sola comarca con `labor 4`, quince que pescan, el hierro en cinco (Somorrostro, Bilbao, Durango, Oiartzun y Mena) y la sal de Añana con `sal 5`. 166 tests en verde |
| 18-09-2026 | **T-015, entrega 2 hecha**: Meseta norte, 36 comarcas (Tierra de Campos, Cerrato, Torozos, Medina, Segovia, la Armuña…). El granero: 17 comarcas con `labor >= 4` y la sal de Villafáfila como único recurso estratégico. 159 tests en verde |
| 18-09-2026 | **Orden de la fase 1 corregido**: T-013 (caminos y cañadas) y T-014 (ferias) pasan a depender de T-015, porque sus datos viven en comarcas que aún no existen |
| 18-09-2026 | **T-012 hecha**: región 01 escrita, **35 comarcas reales** (las 34 de la ficha más `alfoz-de-clunia`, que tapaba el único hueco provisional interior) y 304 provisionales. Sal en Poza y en Imón, hierro en Sierra Menera y Ojos Negros, seis orígenes de oficio distinto. La revisión de la región vive como test. 151 tests en verde |
| 18-09-2026 | **T-011 hecha**: herramienta `atlas` en TypeScript (descarga verificada, proyección, Voronoi recortado a la costa con geometría real, grafo filtrado por tierra, seis comprobaciones, informe y modo `--comprobar`). 334 comarcas provisionales a la espera del catálogo. 144 tests en verde |
| 18-09-2026 | **T-010 hecha**: esquema del catálogo geográfico (`.jsonc` comentado), validador con sus nueve reglas —incluida la nota obligatoria cuando un potencial se aparta del terreno—, informe de cobertura y cargador. 127 tests en verde |
| 17-09-2026 | **T-004 hecha**: armazón del resolutor (doce fases, contexto con borrador mutable, cambios con invariantes, sucesos, huella encadenada) y arnés de partidas de reproducción. **Fase 0 completa.** 111 tests en verde |
| 17-09-2026 | **T-003 hecha**: tipos del dominio (siete módulos, sin lógica) y capa de validación con combinadores propios. Las órdenes pasan a vivir en el estado; `docs/02` §2.8 actualizado. 90 tests en verde |
| 17-09-2026 | **T-002 hecha**: útiles deterministas (enteros en milésimas con BigInt, orden por punto de código, xoshiro128** con semilla, forma canónica y SHA-256 propio contrastado con `node:crypto`). 58 tests en verde |
| 17-09-2026 | **T-001 hecha**: monorepo con seis paquetes, TypeScript estricto, Vitest, ESLint, Prettier, integración continua y las dos guardas de pureza del núcleo. `npm run verificar` pasa: 7 archivos de test, 10 tests, 0 vulnerabilidades |

## Riesgos abiertos

| Riesgo | Mitigación prevista |
|---|---|
| ~~El catálogo geográfico es mucho trabajo manual~~ **resuelto el 18-09-2026**: las diez regiones están escritas y validadas | Lo que queda es afinarlo con el banco de pruebas (T-046) y la pasada de ortografía de los nombres visibles (T-014) |
| El equilibrio entre ocho casas puede irse de las manos | El banco mide por partida y casa con robots que juegan su vía y planean su bloque: en la base `T-051` solo **3 de las 24 filas de prestigio** entran en la horquilla 80 %–120 % (2 en 1085 y 1212), con monjes y hortelanos arriba y ferrones y Mesta abajo. Es exactamente el trabajo de T-047, con los hallazgos de la bitácora ya medidos |
| La complejidad puede crecer por encima de lo divertido | Cada mecánica nueva debe justificar qué decisión añade; si no añade decisión, se descarta |
| Determinismo roto sin darse cuenta | Tests de reproducción con huella de estado desde T-002 |
| ~~El atlas se planta si el mapa pasa de 380 comarcas~~ **resuelto el 18-09-2026**: la horquilla es 300–430 mientras quede relleno y 320–380 cuando el catálogo esté completo | Si al terminar T-015 el mapa se pasa de 380, se recortan comarcas en las regiones más densas, no se sube el límite |
| El mercader no arbitra en la referencia; la liquidez de menores podría borrar oportunidades, pero no se ha aislado del acceso a plazas y del plan del robot | **Medido (21-09-2026):** con la traza de T-048 no hay **ni un** negocio de arbitraje en toda la campaña, en ninguna casa; lo que se vende sin haberlo comprado es producción propia. Falta aislar la causa: T-050 prueba el plan y el acceso a plazas; después, ensayar liquidez, margen y regresión en T-047 |
| **Nuevo (19-09-2026):** el porte base de 10 cargas con 2 de pan por jornada limita los viajes; la Mesta no vende lana en feria en la referencia, pero no se ha aislado la causa | Los ensayos de porte no bastaron. T-049 acercó las cosas (el mapa jugado es la mitad), pero la causa sigue sin aislar: la revisa T-050 antes de ajustar T-047 |
| **Nuevo (21-09-2026):** el recorte no puede cerrar el criterio de tierra: ocho capitales a seis jornadas necesitan unas 200 comarcas y los robots solo pisan unas 70 | No se recorta más ni se mueve el umbral: T-050 tiene que hacer que los robots anden; si aun así no llega, se decide el caso expresamente en T-047 |
| **Nuevo (21-09-2026):** el cantero termina su primera obra mayor en T61–T72 y el objetivo es T80–T130, porque ahora empieza con su cantera | Es una cifra de equilibrio, no un fallo del alta: se ajusta en T-047 con el resto de las tablas |
| ~~Hay orígenes condenados (`labor 1`)~~ **resuelto en T-049**: el arranque se calcula con la comarca delante y la muestra fija (un origen por perfil y casa) aguanta el primer año sin dar una sola orden | Queda que T-065 persista el resultado. Si mañana se añade una casa o un edificio, la prueba de viabilidad lo vuelve a medir |
| ~~Los informes no comprueban todos los criterios~~ **resuelto en T-048**: los nueve salen con su veredicto, su unidad y su ámbito, y un «no evaluable» pesa igual que un incumplimiento | Queda la otra mitad: los robots no demuestran planes equivalentes de ausencia (T-050 y T-051). Un test preparado o un semáforo verde no cierran el equilibrio |
| ~~Los nombres y las notas del catálogo en ASCII~~ **resuelto en T-014 y T-016** | Una guarda en `catalogo.test.ts` impide volver atrás |
