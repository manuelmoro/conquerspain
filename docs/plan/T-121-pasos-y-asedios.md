# T-121 · Disputa de pasos y asedios negociables

**Fase:** 6 · Conflicto · **Depende de:** T-120 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

La guerra del juego es por objetivos: un puerto, una cantera, un mercado. Nunca por la
aniquilación.

## 2. Objetivo

Disputa de puntos concretos del mapa, con asedios lentos, visibles y negociables cada turno.

## 3. Alcance

**Entra:** bloqueo de pasos, asedio de comarca, negociación, condiciones de rendición.

**No entra:** batallas tácticas: el resultado se resuelve con reglas económicas, no con un minijuego.

## 4. Puntos que hay que resolver al detallar

- Cómo se resuelve un enfrentamiento sin azar decisivo: fuerza, abastecimiento, terreno y tiempo.
- Duración mínima de un asedio y oportunidades de negociar.
- Qué se gana exactamente al vencer (control del paso o de la comarca, no su destrucción).

## 5. Criterios de aceptación provisionales

1. Un asedio dura al menos 6 turnos y se puede negociar en cada uno.
2. El defensor con abastecimiento y muralla tiene ventaja clara.
3. El vencedor obtiene el objetivo; el vencido conserva su dominio y puede seguir jugando.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-121: <resumen>`.
