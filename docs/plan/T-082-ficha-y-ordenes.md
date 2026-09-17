# T-082 · Ficha de comarca y bandeja de órdenes con previsión

**Fase:** 4 · Cliente · **Depende de:** T-081 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Donde se juega. Toda acción debe enseñar su coste, su duración y su efecto previsto antes de
confirmarla, y todo bloqueo debe explicar su causa y ofrecer salida.

Lee antes: [docs/08-interfaz.md](../08-interfaz.md) §8.2.5 y §8.3.

## 2. Objetivo

Ficha de comarca completa y bandeja de órdenes con previsión, reserva de recursos y
cancelación.

## 3. Alcance

**Entra:** ficha, acciones, previsión, bandeja, cancelación, colas y plan de temporada en la interfaz.

**No entra:** mercado (T-084) ni crónica (T-085).

## 4. Puntos que hay que resolver al detallar

- Cómo se enseña el desglose de un número (producción = base × potencial × estación…), sin agobiar.
- Presentación de los motivos de bloqueo con su acción de arreglo.
- Bandeja: qué está reservado, qué se puede cancelar y cuánto queda para el corte.
- Edición de colas y del plan de temporada en móvil.

## 5. Criterios de aceptación provisionales

1. Ninguna acción se puede confirmar sin ver antes coste, duración y previsión.
2. Todo bloqueo muestra causa y salida.
3. Reservado, disponible y producido se distinguen visualmente y no se confunden.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-082: <resumen>`.
