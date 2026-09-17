# Estado del proyecto

> Este archivo es la aguja del proyecto: dice exactamente dónde estamos y qué toca ahora.
> Se actualiza **al cerrar cada tarea**, y también si una tarea queda a medias.

**Última actualización:** 18 de septiembre de 2026 (tras cerrar la entrega 5 de T-015)
**Fase actual:** Fase 1 · El mundo

---

## Tarea en curso

**[T-015 · Catálogo · regiones 2 a 10](docs/plan/T-015-catalogo-resto-de-regiones.md)** · hechas
las entregas 2 a 5; toca la **entrega 6: Meseta sur** (`06-meseta-sur.jsonc`), con La Mancha, la
Alcarria, los Montes de Toledo, el Campo de Calatrava y la serranía de Cuenca.

> **Cambio de orden (18-09-2026).** T-013 (caminos y cañadas) y T-014 (ferias) se hacen después de
> T-015, no antes: sus datos son puertos, cañadas y ferias de toda la península —Pajares,
> Despeñaperros, Medina del Campo, Sevilla— que caen en comarcas todavía sin escribir, y los
> identificadores provisionales del atlas se renumeran cada vez que el catálogo crece. Escribir esa
> capa ahora sería trabajo para rehacer.

## Siguiente tarea

Las entregas 3 a 10 de T-015, en orden, y después T-013 y T-014.

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
| Guardas de pureza del núcleo | Dos capas activas: reglas de ESLint y `paquetes/nucleo/pruebas/pureza.test.ts` |
| Útiles del núcleo | `paquetes/nucleo/src/utiles/`: milésimas, orden estable, azar con semilla, forma canónica y SHA-256 propio |
| Tipos del dominio | `paquetes/nucleo/src/tipos/`: mundo, estado, órdenes, tablas de reglas y crónica |
| Validación | `paquetes/nucleo/src/validacion/`: combinadores propios y los cuatro validadores, con ruta del campo y mensaje en español |
| Motor | `resolverTurno` recorre las doce fases (todavía vacías), registra sucesos y firma el turno con su huella |
| Partidas de reproducción | `paquetes/nucleo/pruebas/partidas/` + `npm run partidas`: si una huella cambia, el test lo dice y explica cómo regenerarla |
| Catálogo geográfico | `paquetes/mundo/`: formato `.jsonc` con comentarios, validador con nueve reglas, informe de cobertura y **cinco regiones escritas**: 01 Sistema Ibérico (35), 02 Meseta norte (36), 03 cornisa cantábrica (35), 04 Galicia y Minho (38) y 05 Sistema Central y Extremadura (37) |
| Mapa generado | `npm run atlas` produce `mundo.v1.json` (377 comarcas —181 reales y 196 provisionales—, grafo conexo) byte a byte igual en cada ejecución; `--comprobar` entra en `npm run verificar` |

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
| 17-09-2026 | Maqueta visual v0.1 construida y publicada |
| 17-09-2026 | Diseño completo escrito (visión, núcleo, economía, casas, geografía, competición, arquitectura, interfaz, glosario) y plan de tareas creado |
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
| El catálogo geográfico es mucho trabajo manual | Se parte en diez regiones, cada una con su tarea y su validación automática |
| El equilibrio entre ocho casas puede irse de las manos | Banco de pruebas con robots por casa desde la fase 2 (T-046) y criterios numéricos en `docs/04` §4.4 |
| La complejidad puede crecer por encima de lo divertido | Cada mecánica nueva debe justificar qué decisión añade; si no añade decisión, se descarta |
| Determinismo roto sin darse cuenta | Tests de reproducción con huella de estado desde T-002 |
| ~~El atlas se planta si el mapa pasa de 380 comarcas~~ **resuelto el 18-09-2026**: la horquilla es 300–430 mientras quede relleno y 320–380 cuando el catálogo esté completo | Si al terminar T-015 el mapa se pasa de 380, se recortan comarcas en las regiones más densas, no se sube el límite |
| Los nombres del catálogo se escriben en ASCII (`Logronyo`, `Penyafiel`), como el resto del código, pero la interfaz tendrá que enseñarlos con tildes y eñes | Una pasada de ortografía sobre los nombres visibles antes de T-081, anotada como pendiente en T-014 |
