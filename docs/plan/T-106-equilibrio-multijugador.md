# T-106 · Equilibrio multijugador y métricas de salud

**Fase:** 5 · Multijugador · **Depende de:** T-104 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Segunda ronda de equilibrio, ahora con interacción entre jugadores, que cambia todas las
cuentas del equilibrio en solitario.

Lee antes: [docs/06-competicion.md](../06-competicion.md) §6.8 y [T-047](T-047-equilibrio-v1.md).

## 2. Objetivo

Cumplir las métricas de salud de partidas con rivales, ajustando solo tablas de datos.

## 3. Alcance

**Entra:** partidas automáticas de 8 y 12 robots, medición de las seis métricas, ajustes de datos, bitácora.

**No entra:** cambios de lógica (si hacen falta, tarea aparte).

## 4. Puntos que hay que resolver al detallar

- Escenarios: 8 casas distintas, 12 jugadores con casas repetidas, y un escenario con dos jugadores ausentes.
- Métrica clave: correlación entre número de conexiones y prestigio final (debe ser ≈ 0).
- Detectar dominancias de pareja: combinaciones de dos casas que se ayudan demasiado.

## 5. Criterios de aceptación provisionales

1. Las seis métricas de docs/06 §6.8 se cumplen en tres semillas distintas.
2. Ninguna casa gana en más de una de las tres semillas.
3. La correlación entre conexiones y prestigio se queda por debajo de 0,15.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-106: <resumen>`.
