# T-123 · Acuerdos, rupturas y reputación

**Fase:** 6 · Conflicto · **Depende de:** T-121 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Cierre del círculo: si hay conflicto, tiene que haber forma de pactar, y el pacto tiene que
valer algo.

## 2. Objetivo

Acuerdos con efecto mecánico, duración y consecuencias por romperlos.

## 3. Alcance

**Entra:** paso franco, exclusivas de compra, no agresión, no cortejar comarcas concretas, y su ruptura.

**No entra:** alianzas permanentes que conviertan la partida en dos bandos.

## 4. Puntos que hay que resolver al detallar

- Catálogo de acuerdos verificables por el motor.
- Coste de romper: crédito, prestigio y publicidad de la ruptura.
- Límites para evitar que tres jugadores se alíen y cierren la partida a los demás.

## 5. Criterios de aceptación provisionales

1. Todo acuerdo tiene efecto mecánico y caducidad.
2. Romper un acuerdo se anuncia a todos y cuesta crédito y prestigio.
3. Ningún conjunto de acuerdos puede dejar a un jugador sin ninguna opción de juego.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-123: <resumen>`.
