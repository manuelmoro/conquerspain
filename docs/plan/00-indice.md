# Plan de trabajo · índice de tareas

Orden por capas técnicas: primero se construye lo que no se puede rehacer (determinismo, datos,
motor), y después lo que se ve. Cada tarea tiene su ficha en esta carpeta, es autosuficiente y se
cierra con criterios verificables.

**Estados:** `pendiente` · `en curso` · `hecha` · `bloqueada`

La tarea en curso y la siguiente están siempre en [ESTADO.md](../../ESTADO.md). Este índice es el
mapa completo; ESTADO.md es la aguja.

---

## Fase 0 · Cimientos del repositorio

| Tarea | Título | Estado | Depende de |
|---|---|---|---|
| [T-001](T-001-espacio-de-trabajo.md) | Espacio de trabajo, TypeScript y verificación | **hecha** | — |
| [T-002](T-002-utiles-deterministas.md) | Útiles deterministas: enteros, orden, azar y huella | **hecha** | T-001 |
| [T-003](T-003-tipos-del-dominio.md) | Tipos del estado, las órdenes y el mundo | **hecha** | T-001 |
| [T-004](T-004-armazon-del-resolutor.md) | Armazón del resolutor: fases, contexto y sucesos | **hecha** | T-002, T-003 |

## Fase 1 · El mundo

| Tarea | Título | Estado | Depende de |
|---|---|---|---|
| [T-010](T-010-esquema-del-catalogo.md) | Esquema del catálogo y cargador validado | **hecha** | T-003 |
| [T-011](T-011-herramienta-atlas.md) | Herramienta `atlas`: generación reproducible del mapa | **hecha** | T-010 |
| [T-012](T-012-catalogo-region-01.md) | Catálogo · región 1: Sistema Ibérico y Alto Duero | **hecha** | T-011 |
| [T-013](T-013-caminos-y-canyadas.md) | Caminos, puertos, vados y cañadas reales | **hecha** | T-015 |
| [T-014](T-014-ferias-y-patrimonio.md) | Ferias, patrimonio y rasgos de comarca | **hecha** | T-015 |
| [T-015](T-015-catalogo-resto-de-regiones.md) | Catálogo · regiones 2 a 10 (nueve entregas) | **hecha** | T-012 |
| [T-016](T-016-ortografia-de-las-notas.md) | Ortografía de las notas del catálogo | **hecha** | T-014 |

> **18-09-2026 · cambio de orden en la fase 1.** T-013 y T-014 se hacen *después* de T-015. Sus
> datos (puertos de Pajares o Despeñaperros, cañadas de ocho a dieciséis comarcas, ferias de Medina,
> Villalón o Sevilla) viven en comarcas que todavía no están escritas, y los identificadores
> provisionales del atlas se renumeran cada vez que el catálogo crece: cualquier dato escrito contra
> ellos habría que rehacerlo.

## Fase 2 · Motor de reglas

| Tarea | Título | Estado | Depende de |
|---|---|---|---|
| [T-030](T-030-fase-calendario.md) | Fase 1: calendario, estaciones y clima conocido | **hecha** | T-004 |
| [T-031](T-031-fase-produccion.md) | Fase 2: producción | **hecha** | T-030, T-012 |
| [T-032](T-032-fase-consumo.md) | Fase 3: consumo, merma y escasez | **hecha** | T-031 |
| [T-033](T-033-movimiento.md) | Fase 4: movimiento de recuas por el grafo | **hecha** | T-013 |
| [T-034](T-034-cometidos.md) | Fase 5: cometidos (explorar, portear, poblar, presencia) | **hecha** | T-033 |
| [T-035](T-035-obras.md) | Fase 6: obras, cuadrillas y obras mayores | **hecha** | T-031 |
| [T-036](T-036-poblacion-y-lealtad.md) | Fases 8–9: población, lealtad, fueros y administración | **hecha** | T-032 |
| [T-037](T-037-mercado.md) | Fase 7: mercados, ferias y formación de precios | **hecha** | T-032 |
| [T-038](T-038-influencia.md) | Fase 8: influencia e incorporación de comarcas | **hecha** | T-034 |
| [T-039](T-039-acontecimientos.md) | Fase 10: acontecimientos anunciados | **hecha** | T-030 |
| [T-040](T-040-rebanyos.md) | Rebaños, pastos y trashumancia | **hecha** | T-033, T-037 |
| [T-041](T-041-casas.md) | Casas: privilegios y herramientas | **hecha** | T-035, T-037 |
| [T-042](T-042-tradiciones.md) | Tradiciones y ramas de desarrollo | **hecha** | T-041 |
| [T-043](T-043-prestigio-e-hitos.md) | Fase 11: prestigio, hitos y clasificación | **hecha** | T-036 |
| [T-044](T-044-cronica-y-niebla.md) | Fase 12: crónica, niebla e información fechada | **hecha** | T-034 |
| [T-045](T-045-mayordomo-y-colas.md) | Colas, rutas permanentes, mayordomo y plan de temporada | **hecha** | T-044 |
| [T-046](T-046-banco-de-pruebas.md) | Banco de pruebas: robots por casa e informes | **hecha** | T-045 |
| [T-047](T-047-equilibrio-v1.md) | Ajuste de equilibrio v1 hasta cumplir criterios | en curso | T-048, T-049, T-050, T-051, T-052, T-053, T-055, T-056, T-057, T-058 |
| [T-048](T-048-auditoria-del-banco.md) | Métricas auditables del banco | **hecha** | T-046 |
| [T-049](T-049-preparacion-pura-de-partidas.md) | Preparación de partidas sin servidor | **hecha** | T-048 |
| [T-050](T-050-robots-viables.md) | Robots que ejecutan sus vías | **hecha** | T-048, T-049 |
| [T-051](T-051-ausencia-equivalente.md) | Ausencia con planes equivalentes | **hecha** | T-050 |
| [T-052](T-052-geografia-de-precios.md) | Geografía de precios: el precio base, por comarca | **hecha** | T-048, T-050 |
| [T-053](T-053-plazas-donde-comerciar.md) | Plazas donde comerciar: densidad y cómo se abre una | en curso | T-049, T-052 |
| [T-054](T-054-el-precio-y-la-distancia.md) | El precio y la distancia a donde se produce | **hecha** | T-052 |
| [T-055](T-055-la-venta-da-de-comer.md) | La venta da de comer a las recuas | **hecha** | T-053, T-054, T-056, T-057 |
| [T-056](T-056-el-negocio-en-limpio.md) | El negocio se cuenta con el precio que se espera | **hecha** | T-055 (su mecánica), T-057 |
| [T-057](T-057-la-distancia-paga-el-camino.md) | La distancia paga el camino | **hecha** | T-054 |
| [T-058](T-058-la-mesta-conoce-sus-canyadas.md) | La Mesta conoce sus cañadas | **hecha** | T-049 |

> **19-09-2026 · revisión del plan solicitada por el usuario.** Antes de seguir construyendo,
> corregir el diagnóstico del equilibrio: **T-048 → T-049 → T-050 → T-051 → T-047 → T-060**.
> Las fichas nuevas son trabajo pendiente, no implementaciones. T-049 extrae de T-065 el recorte y
> arranque sin servidor, rompiendo su dependencia circular con T-047. Los hallazgos y ensayos
> descartados están en [bitacora-equilibrio.md](bitacora-equilibrio.md). T-046 conserva su cierre
> histórico; T-048 y T-050 corrigen las limitaciones detectadas sin ocultarlas.

> **23-09-2026 · T-052, abierta desde dentro de T-047.** Midiendo el equilibrio se demostró que el
> precio base de cada recurso es un número global: al turno 100 la dispersión entre las diez plazas
> de una partida es de 0,0 puntos en la lana, 0,4 en el hierro y 0,6 en la sal, y no hay un solo
> negocio rentable en las nueve partidas. Ninguna cifra lo arregla —se ensayaron cinco—, así que
> hace falta lógica y va en ficha aparte, como manda T-047 §3. **T-047 se reanuda después**: no
> tiene sentido repartir el prestigio de unas vías comerciales que no existen.

> **23-09-2026 · T-052 hecha, y T-053 abierta desde dentro.** El precio base pasa a ser de cada
> comarca y la dispersión entre plazas sube de 0,6 a 40,4 puntos en la sal. Aun así no aparece ni un
> negocio, y la causa resultó ser otra, medida en el estado del turno 100: **hay diez plazas para
> 208 comarcas**. Ni el precio ni el porte lo arreglan (los dos ensayados y descartados). T-053 se
> ocupa de las plazas; después vuelve T-047.

## Fase 3 · Servidor autoritativo

| Tarea | Título | Estado | Depende de |
|---|---|---|---|
| [T-060](T-060-persistencia.md) | Persistencia y esquema de datos | pendiente | T-047 |
| [T-061](T-061-reloj-de-turnos.md) | Reloj de turnos idempotente con auditoría | pendiente | T-060 |
| [T-062](T-062-api.md) | API de partida, órdenes y vista por jugador | pendiente | T-061 |
| [T-063](T-063-cuentas.md) | Cuentas, sesiones y seguridad | pendiente | T-062 |
| [T-064](T-064-avisos.md) | Avisos de resolución (SSE y correo) | pendiente | T-062 |
| [T-065](T-065-alta-de-partida.md) | Alta de partida: casa, sorteo de orígenes y recorte de mapa | pendiente | T-062, T-049 |

## Fase 4 · Cliente

| Tarea | Título | Estado | Depende de |
|---|---|---|---|
| [T-080](T-080-armazon-cliente.md) | Armazón del cliente y sincronización con el servidor | pendiente | T-062 |
| [T-081](T-081-atlas.md) | Atlas: capas, zoom y modos de lectura | pendiente | T-080 |
| [T-082](T-082-ficha-y-ordenes.md) | Ficha de comarca y bandeja de órdenes con previsión | pendiente | T-081 |
| [T-083](T-083-recuas-en-mapa.md) | Recuas y rebaños: rutas sobre el mapa | pendiente | T-082 |
| [T-084](T-084-mercado-cliente.md) | Mercado, ferias y precios | pendiente | T-082 |
| [T-085](T-085-cronica-cliente.md) | Crónica, hitos y clasificación | pendiente | T-082 |
| [T-086](T-086-alta-y-origen-cliente.md) | Mis partidas, crear partida, elegir casa y origen | pendiente | T-085 |
| [T-087](T-087-movil-y-rendimiento.md) | Móvil, accesibilidad y rendimiento | pendiente | T-086 |

## Fase 5 · Multijugador

| Tarea | Título | Estado | Depende de |
|---|---|---|---|
| [T-100](T-100-varias-plazas.md) | Varias plazas por partida y reparto del mapa | pendiente | T-087 |
| [T-101](T-101-influencia-disputada.md) | Influencia disputada y comarcas que vuelven a neutral | pendiente | T-100 |
| [T-102](T-102-mercado-comun.md) | Mercado común, rumores e información entre jugadores | pendiente | T-100 |
| [T-103](T-103-contratos-y-portazgos.md) | Contratos, portazgos y crédito | pendiente | T-102 |
| [T-104](T-104-temporadas.md) | Clasificación pública y temporadas | pendiente | T-101 |
| [T-105](T-105-amparo-y-ausencia.md) | Amparo del novato, ausencia y administración del concejo | pendiente | T-101 |
| [T-106](T-106-equilibrio-multijugador.md) | Equilibrio multijugador y métricas de salud | pendiente | T-104 |

## Fase 6 · Conflicto (se detalla al llegar)

| Tarea | Título | Estado | Depende de |
|---|---|---|---|
| [T-120](T-120-milicia.md) | Milicia concejil y coste económico de la guerra | pendiente | T-106 |
| [T-121](T-121-pasos-y-asedios.md) | Disputa de pasos y asedios negociables | pendiente | T-120 |
| [T-122](T-122-bandidaje.md) | Bandidaje y seguridad de caminos | pendiente | T-120 |
| [T-123](T-123-diplomacia.md) | Acuerdos, rupturas y reputación | pendiente | T-121 |

---

## Checkpoints de jugabilidad

[Protocolo y estado de las sesiones humanas](checkpoints-jugabilidad.md). Por decisión del usuario
(19-09-2026), se espera a la interfaz; no se adelanta una consola ni cambia la siguiente tarea.

- J-01: al terminar T-082, probar comprensión y órdenes antes de continuar con T-083.
- J-02: tras T-083/T-084/T-085, probar el ciclo completo, casas y ausencia.
- J-03: tras T-086, probar el recorrido con personas ajenas al desarrollo; junto a J-02, antes
  de cerrar T-087.
- J-04: tras T-103, piloto durante varios días; antes de cerrar T-106 y entrar en conflicto.

Las tareas técnicas y los checkpoints tienen estados separados. Un informe de robots no sustituye
una sesión humana. T-047 puede cerrarse técnicamente sin afirmar que la diversión está validada.

## Cómo se escribe una ficha

Toda ficha tiene, en este orden:

1. **Contexto** — qué existe ya y qué documentos de diseño manda seguir.
2. **Objetivo** — una frase.
3. **Alcance** — lo que entra y, explícitamente, lo que no.
4. **Diseño detallado** — firmas, fórmulas, tablas, casos límite.
5. **Archivos** — los que se crean y los que se tocan.
6. **Criterios de aceptación** — lista verificable, sin ambigüedad.
7. **Verificación** — comandos exactos que deben pasar.
8. **Al terminar** — qué actualizar (índice, ESTADO.md, documentos de diseño).

Las fichas de las fases 3 a 6 están esbozadas. **Detallarlas es la primera mitad de la propia
tarea**: antes de escribir código, se completa la ficha con el mismo nivel de detalle que las de las
fases 0 a 2 y se anota en ESTADO.md que la ficha ya está detallada.
