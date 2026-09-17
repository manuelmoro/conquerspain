# T-084 · Mercado, ferias y precios

**Fase:** 4 · Cliente · **Depende de:** T-082 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

El segundo tablero. Hay que poder leer de un vistazo dónde conviene vender y cuándo es la
próxima feria.

## 2. Objetivo

Pantalla de mercado con precios conocidos y fechados, órdenes con precio límite, calendario
de ferias e histórico de precios.

## 3. Alcance

**Entra:** tabla de plazas, ficha de plaza, órdenes de compra y venta, calendario, gráfico de precios.

**No entra:** contratos entre jugadores (T-103).

## 4. Puntos que hay que resolver al detallar

- Cómo mostrar que un precio es antiguo sin que parezca actual (la información fechada es clave).
- Gráfico pequeño de la serie de precios, legible en móvil.
- Órdenes con precio límite explicadas para quien no sepa qué es un límite.

## 5. Criterios de aceptación provisionales

1. Ningún precio se muestra sin su fecha.
2. Se puede dar una orden de venta con límite en tres toques.
3. El calendario de ferias deja claro cuántos turnos faltan y si da tiempo a llegar.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-084: <resumen>`.
