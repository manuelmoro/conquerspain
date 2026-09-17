# T-061 · Reloj de turnos idempotente con auditoría

**Fase:** 3 · Servidor · **Depende de:** T-060 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

El corazón del juego asíncrono: un proceso que resuelve los turnos a su hora, aunque nadie
esté conectado, y que jamás resuelve dos veces el mismo turno.

Lee antes: [docs/07-arquitectura.md](../07-arquitectura.md) §7.4 y [docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.4.

## 2. Objetivo

Resolución programada, transaccional, idempotente y auditada, con bloqueo por partida.

## 3. Alcance

**Entra:** proceso de reloj, cálculo de la próxima resolución, transacción de resolución, auditoría, reintentos, y el avance manual en partidas de prueba.

**No entra:** avisos al jugador (T-064), interfaz (fase 4).

## 4. Puntos que hay que resolver al detallar

- Cálculo de `proxima_resolucion` según el intervalo de la partida, con ancla estable (no deriva por la duración del cálculo).
- Qué pasa si el servidor estuvo caído tres horas: ¿se resuelven los turnos perdidos en cadena o se salta? Decidir y documentar (propuesta: resolver en cadena, porque el mundo debe seguir el calendario).
- Bloqueo por partida para que dos instancias no resuelvan lo mismo.
- Transacción: guardar estado nuevo, crónicas, órdenes ejecutadas y auditoría, o no guardar nada.
- Registro de auditoría: huella de entrada, órdenes, huella de salida, duración, versión de reglas.
- Qué hacer si el motor lanza error en una partida: marcarla `detenida`, avisar y no perder datos.
- Avance manual solo en partidas marcadas como de prueba.

## 5. Criterios de aceptación provisionales

1. Matar el proceso a mitad de una resolución no duplica ni corrompe nada (test con fallo inyectado).
2. Resolver el turno N dos veces es imposible: la segunda vez no hace nada y lo registra.
3. Una partida con intervalo de 1 hora resuelve a la hora en punto con menos de 2 segundos de desviación.
4. La auditoría permite reproducir cualquier turno pasado y obtener la misma huella.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-061: <resumen>`.
