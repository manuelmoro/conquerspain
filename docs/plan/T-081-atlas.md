# T-081 · Atlas: capas, zoom y modos de lectura

**Fase:** 4 · Cliente · **Depende de:** T-080 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

El mapa es la pantalla principal. La maqueta v0.1 ya validó el aspecto; ahora hay que
construirlo sobre datos reales, con más capas y mejor rendimiento.

Lee antes: [docs/08-interfaz.md](../08-interfaz.md) §8.2.4 y la maqueta.

## 2. Objetivo

Atlas completo, con sus capas, sus tres modos de lectura y rendimiento fluido en móvil.

## 3. Alcance

**Entra:** terreno, comarcas, niebla, caminos y cañadas, recuas y rebaños en ruta, rótulos, avisos, modos económico, logístico y político.

**No entra:** edición de rutas (T-083) ni fichas (T-082).

## 4. Puntos que hay que resolver al detallar

- Capas cacheadas: el terreno y la niebla solo se repintan cuando cambian de verdad.
- Cómo dibujar caminos y cañadas sin ensuciar el mapa; distinguir calidad y estado estacional.
- Rótulos que no se amontonan al alejar; prioridad de etiquetas.
- Los tres modos y cómo se cambia entre ellos con una mano en el móvil.
- Dibujo de recuas en tránsito con su destino y turnos restantes.

## 5. Criterios de aceptación provisionales

1. 60 fps al desplazar en un móvil de gama media con el mapa completo.
2. Los tres modos muestran la información correcta y se entienden sin leyenda (aunque haya leyenda).
3. La niebla y las fronteras coinciden exactamente con la vista del jugador: nada visible que no deba verse.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-081: <resumen>`.
