# T-122 · Bandidaje y seguridad de caminos

**Fase:** 6 · Conflicto · **Depende de:** T-120 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Riesgo ambiental, no entre jugadores: da valor a las ventas, las cercas y los caminos
cuidados, y castiga a quien deja su red sin atender.

## 2. Objetivo

Un riesgo moderado, previsible y evitable, que haga interesante invertir en seguridad.

## 3. Alcance

**Entra:** probabilidad por tramo según atención y obras, pérdidas acotadas, avisos previos, medidas de protección.

**No entra:** que un jugador dirija a los bandidos.

## 4. Puntos que hay que resolver al detallar

- Cómo se calcula el riesgo de un tramo (tránsito, ventas, cercas, lealtad de las comarcas vecinas).
- Pérdida máxima por incidente: nunca una recua entera.
- Aviso previo: un tramo peligroso se sabe antes de entrar.

## 5. Criterios de aceptación provisionales

1. El riesgo nunca supera el máximo fijado y siempre se puede reducir a casi cero invirtiendo.
2. Un incidente jamás destruye una recua completa.
3. El mapa muestra los tramos peligrosos antes de enviar la recua.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-122: <resumen>`.
