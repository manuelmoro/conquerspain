# Estado del proyecto

> Este archivo es la aguja del proyecto: dice exactamente dónde estamos y qué toca ahora.
> Se actualiza **al cerrar cada tarea**, y también si una tarea queda a medias.

**Última actualización:** 19 de septiembre de 2026 (tras cerrar T-044)
**Fase actual:** Fase 2 · Motor de reglas

---

## Tarea en curso

Ninguna.

> **Cambio de orden (18-09-2026).** T-013 (caminos y cañadas) y T-014 (ferias) se hacen después de
> T-015, no antes: sus datos son puertos, cañadas y ferias de toda la península —Pajares,
> Despeñaperros, Medina del Campo, Sevilla— que caen en comarcas todavía sin escribir, y los
> identificadores provisionales del atlas se renumeran cada vez que el catálogo crece. Escribir esa
> capa ahora sería trabajo para rehacer.

## Siguiente tarea

**[T-045 · Colas, rutas permanentes, mayordomo y plan de temporada](docs/plan/T-045-mayordomo-y-colas.md)**

Jugar sin estar: órdenes en cola, rutas que se repiten, reglas del mayordomo y plan de temporada.
Lee los apartados «Heredado» de la ficha: la crónica ya trae la acción sugerida de cada aviso.

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
| `paquetes/` | Espacio de trabajo montado: `nucleo`, `mundo`, `servidor` y `cliente`, vacíos salvo su versión |
| `herramientas/` | `atlas` y `banco` creados, vacíos; su contenido llega en T-011 y T-046 |
| Verificación | `npm run verificar` (tipos + lint + formato + tests) pasa en limpio |
| Casas | Las ocho, en `src/datos/casas.ts`, sobre modificadores, permisos y prohibiciones genéricos que las fases consultan a través de `reglas/casas/`; ningún archivo del motor nombra una casa (lo vigila un test). Lo que necesita a otro jugador está desactivado hasta T-103 |
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
| El equilibrio entre ocho casas puede irse de las manos | Banco de pruebas con robots por casa desde la fase 2 (T-046) y criterios numéricos en `docs/04` §4.4 |
| La complejidad puede crecer por encima de lo divertido | Cada mecánica nueva debe justificar qué decisión añade; si no añade decisión, se descarta |
| Determinismo roto sin darse cuenta | Tests de reproducción con huella de estado desde T-002 |
| ~~El atlas se planta si el mapa pasa de 380 comarcas~~ **resuelto el 18-09-2026**: la horquilla es 300–430 mientras quede relleno y 320–380 cuando el catálogo esté completo | Si al terminar T-015 el mapa se pasa de 380, se recortan comarcas en las regiones más densas, no se sube el límite |
| Con la liquidez de los menores al máximo (solitario), cualquier venta hasta el tope de la plaza se absorbe y el precio se recupera en un turno: el mercader de ferias podría quedarse sin arbitraje | Banco de pruebas (T-046) y ajuste de `liquidezMercaderesMenoresMil`, del margen y de los precios base en T-047 |
| ~~Los nombres y las notas del catálogo en ASCII~~ **resuelto en T-014 y T-016** | Una guarda en `catalogo.test.ts` impide volver atrás |
