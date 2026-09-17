# Estado del proyecto

> Este archivo es la aguja del proyecto: dice exactamente dónde estamos y qué toca ahora.
> Se actualiza **al cerrar cada tarea**, y también si una tarea queda a medias.

**Última actualización:** 17 de septiembre de 2026 (tras cerrar T-002)
**Fase actual:** Fase 0 · Cimientos del repositorio

---

## Tarea en curso

Ninguna.

## Siguiente tarea

**[T-003 · Tipos del estado, las órdenes y el mundo](docs/plan/T-003-tipos-del-dominio.md)**

Fijar la forma de los datos antes de escribir ninguna regla: partida, jugador, comarca, recua,
orden, mundo y tablas de reglas, con validadores en tiempo de ejecución para todo lo que entra de
fuera. Sin lógica de juego dentro.

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
| 17-09-2026 | **T-002 hecha**: útiles deterministas (enteros en milésimas con BigInt, orden por punto de código, xoshiro128** con semilla, forma canónica y SHA-256 propio contrastado con `node:crypto`). 58 tests en verde |
| 17-09-2026 | **T-001 hecha**: monorepo con seis paquetes, TypeScript estricto, Vitest, ESLint, Prettier, integración continua y las dos guardas de pureza del núcleo. `npm run verificar` pasa: 7 archivos de test, 10 tests, 0 vulnerabilidades |

## Riesgos abiertos

| Riesgo | Mitigación prevista |
|---|---|
| El catálogo geográfico es mucho trabajo manual | Se parte en diez regiones, cada una con su tarea y su validación automática |
| El equilibrio entre ocho casas puede irse de las manos | Banco de pruebas con robots por casa desde la fase 2 (T-046) y criterios numéricos en `docs/04` §4.4 |
| La complejidad puede crecer por encima de lo divertido | Cada mecánica nueva debe justificar qué decisión añade; si no añade decisión, se descarta |
| Determinismo roto sin darse cuenta | Tests de reproducción con huella de estado desde T-002 |
