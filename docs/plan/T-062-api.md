# T-062 · API de partida, órdenes y vista por jugador

**Fase:** 3 · Servidor · **Depende de:** T-061 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

La puerta entre el cliente y la autoridad. Su regla fundamental: nunca sale del servidor un
dato que ese jugador no deba conocer.

Lee antes: [docs/07-arquitectura.md](../07-arquitectura.md) §7.4 y [T-044](T-044-cronica-y-niebla.md).

## 2. Objetivo

API REST con la vista filtrada del estado, alta y baja de órdenes, crónicas y clasificación.

## 3. Alcance

**Entra:** rutas, validación de entrada con los validadores del núcleo, control de acceso por participante, límites de tamaño y frecuencia.

**No entra:** cuentas y sesiones (T-063), avisos (T-064).

**Heredado de T-044.** Al jugador solo se le envía `vistaDeJugador(estado, jugador, mundo)` y su
`Cronica` (la devuelve `resolverTurno`, una por jugador). Nunca el estado ni los sucesos crudos: la
semilla, los almacenes ajenos y las influencias exactas solo están ahí. La prueba de fuga de
`pruebas/vista.test.ts` es el modelo para la de la API.

**Heredado de T-032 a T-035.** El motor se fía del `coste` de cada orden y lo reserva al darla de
alta (si ya no cabe, la cancela con `sin-recursos`). El servidor tiene que calcularlo con las
reglas: edificios (`reglas.edificios[e].coste` × `costeEdificioMil` de la casa), formar recua
(`movimiento.costeFormarRecua` × `costeRecuaMil`), roturar (`costeDeRoturar`, que ya aplica la
dehesa y el monasterio). Las obras mayores no reservan nada: se pagan a plazos en la fase 6.

## 4. Puntos que hay que resolver al detallar

- Rutas de [docs/07-arquitectura.md](../07-arquitectura.md) §7.4 y sus códigos de error en español.
- Toda respuesta de estado pasa por `vistaDeJugador`: ninguna ruta devuelve el estado completo.
- Las órdenes entrantes se validan con `validarOrdenEntrante` y luego con las reglas del motor; se rechaza cualquier campo extra.
- Idempotencia en el alta de órdenes (un reintento del cliente no duplica la orden).
- Límite de órdenes por turno y por jugador para evitar abusos, con un número generoso y documentado.
- Versión de reglas en cada respuesta, para que el cliente sepa si debe recargar.

## 5. Criterios de aceptación provisionales

1. Test de fuga: ninguna respuesta contiene datos de otro jugador (se recorre el JSON serializado).
2. Un cliente manipulado no puede dar una orden inválida, ni para otro jugador, ni fuera de plazo.
3. Reenviar la misma orden dos veces no la duplica.
4. Todos los errores tienen mensaje en español y código estable.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-062: <resumen>`.
