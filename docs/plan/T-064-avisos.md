# T-064 · Avisos de resolución

**Fase:** 3 · Servidor · **Depende de:** T-062 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Una partida por turnos vive de que te enteres de que ha pasado algo. Sin avisos, el jugador
tiene que estar mirando, que es justo lo que no queremos.

## 2. Objetivo

Avisar de la resolución del turno y de lo que exige decisión, por canal en vivo y por correo.

## 3. Alcance

**Entra:** canal SSE para clientes abiertos, correo resumen configurable, y preferencias por partida.

**No entra:** notificaciones push móviles (más adelante).

## 4. Puntos que hay que resolver al detallar

- Qué merece aviso: turno resuelto, escasez inminente, obra detenida, expedición llegada, comarca en peligro de irse, feria que empieza.
- Frecuencia: agrupar por turno; nunca más de un correo por resolución, y con opción de resumen diario.
- El correo lleva la crónica en texto legible: debe poder leerse sin abrir el juego.
- Preferencias por partida (una de 1 hora no puede avisar como una de 24 horas).

## 5. Criterios de aceptación provisionales

1. Un cliente abierto recibe el aviso en menos de 3 segundos tras la resolución.
2. El correo se envía una sola vez por turno y jugador, con reintento si falla.
3. Las preferencias se respetan, incluida la de no recibir nada.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-064: <resumen>`.
