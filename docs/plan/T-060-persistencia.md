# T-060 · Persistencia y esquema de datos

**Fase:** 3 · Servidor · **Depende de:** T-047 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

El motor ya resuelve turnos en memoria. Para que una partida sobreviva a un reinicio y a
meses de juego, hace falta persistencia seria: estados, órdenes, crónicas y auditoría.

Lee antes: [docs/07-arquitectura.md](../07-arquitectura.md) §7.4.

## 2. Objetivo

Esquema de base de datos y capa de acceso aislada, con SQLite en desarrollo y la puerta
abierta a Postgres sin tocar la lógica.

## 3. Alcance

**Entra:** tablas, migraciones, capa de acceso, guardado de estados y crónicas, registro de auditoría.

**No entra:** API (T-062), reloj (T-061), cuentas (T-063).

## 4. Puntos que hay que resolver al detallar

- Tablas mínimas: `partida`, `participante`, `estado_turno`, `orden`, `cronica`, `auditoria_resolucion`, `cuenta`.
- ¿Se guarda el estado completo por turno o solo cada N turnos más los sucesos? Decidir con cifras: medir el tamaño de un estado de partida grande y proyectar 240 turnos × 12 jugadores.
- Huella del estado guardada en cada turno (viene del núcleo) para detectar corrupción.
- Las órdenes se guardan con su turno, su autor y su estado; nunca se borran (se marcan canceladas).
- Migraciones versionadas y reversibles, con test que las aplica sobre una base vacía y sobre una con datos.
- Capa de acceso con interfaz propia (`Repositorio`), para que el resto del servidor no sepa qué motor hay debajo.

## 5. Criterios de aceptación provisionales

1. Una partida de 240 turnos con 12 jugadores cabe en un tamaño razonable y documentado.
2. Guardar y releer un estado devuelve exactamente el mismo objeto (huella idéntica).
3. Las migraciones se aplican y se revierten en test.
4. Ninguna consulta SQL fuera de la capa de acceso.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-060: <resumen>`.
