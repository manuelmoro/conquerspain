# T-086 · Mis partidas, crear partida, elegir casa y origen

**Fase:** 4 · Cliente · **Depende de:** T-085 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

La entrada al juego. La maqueta ya fijó el aspecto de estas pantallas; ahora se conectan al
servidor y se añade la elección de casa.

## 2. Objetivo

Pantallas de partidas, creación, elección de casa y elección de origen, funcionando contra la
API real.

## 3. Alcance

**Entra:** lista de partidas, creación con ritmo y modo, elección de casa con su privilegio y su límite, sorteo de tres orígenes y fundación.

**No entra:** partidas públicas ni emparejamiento.

## 4. Puntos que hay que resolver al detallar

- Cómo explicar ocho casas sin abrumar: una frase de privilegio, una de límite y una nota histórica.
- Comparación de los tres orígenes en móvil sin scroll infinito.
- Estado de la partida en la lista: turno, quincena, cuenta atrás, abastecimiento y si faltan órdenes.

## 5. Criterios de aceptación provisionales

1. Se puede crear una partida y fundar capital en menos de dos minutos, en móvil.
2. La elección de casa explica el límite con la misma claridad que la ventaja.
3. La lista avisa de las partidas que esperan órdenes.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-086: <resumen>`.
