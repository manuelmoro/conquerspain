# T-080 · Armazón del cliente y sincronización

**Fase:** 4 · Cliente · **Depende de:** T-062 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

El cliente definitivo se construye sobre el motor real. La maqueta queda como referencia
visual, no como base de código.

Lee antes: [docs/07-arquitectura.md](../07-arquitectura.md) §7.5 y [docs/08-interfaz.md](../08-interfaz.md).

## 2. Objetivo

Armazón con Vite y TypeScript: estado remoto, órdenes locales pendientes, previsión con el
núcleo compilado al navegador y reconexión.

## 3. Alcance

**Entra:** estructura del proyecto, capa de datos, manejo de sesión, previsión local, canal de avisos, y el esqueleto de pantallas.

**No entra:** el atlas (T-081) ni el resto de pantallas.

## 4. Puntos que hay que resolver al detallar

- Modelo de datos del cliente: `vista` (del servidor) + `pendientes` (órdenes locales aún no confirmadas).
- Previsión: llamar a `preverTurno` del núcleo con la vista y las órdenes pendientes.
- Qué hacer cuando llega un turno nuevo mientras el jugador tiene la pantalla abierta (propuesta: avisar y recargar con un botón, nunca cambiar la pantalla bajo los dedos).
- Tamaño del paquete: el núcleo compilado al navegador no debe pasar de un límite razonable; medirlo.
- Modo sin conexión: leer la última vista guardada y avisar de que está desactualizada.

## 5. Criterios de aceptación provisionales

1. La previsión del cliente coincide exactamente con lo que luego hace el servidor (test comparativo).
2. Perder la conexión y recuperarla no pierde órdenes pendientes.
3. La aplicación arranca y muestra datos en menos de 1,5 segundos en un móvil de gama media.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-080: <resumen>`.
