# T-085 · Crónica, hitos y clasificación

**Fase:** 4 · Cliente · **Depende de:** T-082 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

La crónica es lo primero que se lee cada turno y el hilo narrativo de la partida.

Lee antes: [docs/08-interfaz.md](../08-interfaz.md) §8.1 y §8.6.

## 2. Objetivo

Pantalla de crónica con acciones sugeridas, archivo de turnos, hitos y clasificación pública.

## 3. Alcance

**Entra:** crónica del turno, archivo, hitos con su fecha, clasificación con desglose por capítulos.

**No entra:** temporadas (T-104).

## 4. Puntos que hay que resolver al detallar

- Orden de lectura: avisos primero, y cada aviso con su botón de acción.
- Archivo navegable por turnos y por año del calendario.
- Clasificación que enseñe por qué va primero cada uno.

## 5. Criterios de aceptación provisionales

1. Desde la crónica se puede resolver un problema sin buscarlo en el mapa.
2. El archivo permite releer cualquier turno pasado.
3. La clasificación muestra el desglose y la variación respecto al turno anterior.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-085: <resumen>`.
