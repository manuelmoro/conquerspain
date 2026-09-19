# T-087 · Móvil, accesibilidad y rendimiento

**Fase:** 4 · Cliente · **Depende de:** T-086 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Pasada final de calidad sobre todo el cliente: que se juegue con una mano, que se entienda sin
color y que vaya fino en un móvil normal.

Lee antes: [docs/08-interfaz.md](../08-interfaz.md) §8.4 y §8.5.

## 2. Objetivo

Cumplir los criterios de móvil, accesibilidad y rendimiento en todas las pantallas.

## 3. Alcance

**Entra:** revisión completa, correcciones, pruebas en dispositivos reales y medición.

**No entra:** funcionalidad nueva.

## 4. Puntos que hay que resolver al detallar

- Recorrido crítico con una mano: leer crónica, dar tres órdenes, salir.
- Contraste, foco, teclado y lectores de pantalla en todas las pantallas.
- Vista de lista equivalente para todo lo que se hace en el mapa.
- Medición de rendimiento y presupuesto de tamaño del paquete.

## 5. Criterios de aceptación provisionales

1. Contraste AA en todos los textos y estados.
2. Todo lo que se puede hacer en el mapa se puede hacer sin el mapa.
3. 60 fps al desplazar el atlas y arranque por debajo de 1,5 s en gama media.
4. El recorrido crítico se completa con una mano en menos de dos minutos.

### Checkpoint humano

Para cerrar, realizar **J-02 y J-03** de [checkpoints-jugabilidad.md](checkpoints-jugabilidad.md):
ciclo completo con casas distintas y prueba con personas ajenas al desarrollo. Requieren T-083,
T-084 y T-085 terminadas, además del alta de T-086. Conservar actas y corregir los bloqueos del
recorrido; los tests automáticos no sustituyen esas sesiones.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-087: <resumen>`.
