# Estado del proyecto

> Este archivo es la aguja del proyecto: dice exactamente dónde estamos y qué toca ahora.
> Se actualiza **al cerrar cada tarea**, y también si una tarea queda a medias.

**Última actualización:** 17 de septiembre de 2026
**Fase actual:** Fase 0 · Cimientos del repositorio

---

## Tarea en curso

Ninguna.

## Siguiente tarea

**[T-001 · Espacio de trabajo, TypeScript y verificación](docs/plan/T-001-espacio-de-trabajo.md)**

Es la primera tarea del plan y no depende de nada. Al terminarla, `npm run verificar` tiene que
funcionar en limpio.

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
| `paquetes/` | No existe todavía: lo crea T-001 |
| `herramientas/` | No existe todavía: lo crea T-011 |

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

## Bitácora

| Fecha | Qué pasó |
|---|---|
| 17-09-2026 | Maqueta visual v0.1 construida y publicada |
| 17-09-2026 | Diseño completo escrito (visión, núcleo, economía, casas, geografía, competición, arquitectura, interfaz, glosario) y plan de tareas creado |

## Riesgos abiertos

| Riesgo | Mitigación prevista |
|---|---|
| El catálogo geográfico es mucho trabajo manual | Se parte en diez regiones, cada una con su tarea y su validación automática |
| El equilibrio entre ocho casas puede irse de las manos | Banco de pruebas con robots por casa desde la fase 2 (T-046) y criterios numéricos en `docs/04` §4.4 |
| La complejidad puede crecer por encima de lo divertido | Cada mecánica nueva debe justificar qué decisión añade; si no añade decisión, se descarta |
| Determinismo roto sin darse cuenta | Tests de reproducción con huella de estado desde T-002 |
