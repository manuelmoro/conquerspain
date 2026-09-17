# T-083 · Recuas y rebaños: rutas sobre el mapa

**Fase:** 4 · Cliente · **Depende de:** T-082 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Planificar un viaje de seis jornadas por un puerto que se cierra en dos turnos es una de las
decisiones más bonitas del juego. La interfaz tiene que hacerla fácil.

## 2. Objetivo

Editor de rutas sobre el mapa, con coste por tramo, avisos estacionales y rutas circulares.

## 3. Alcance

**Entra:** lista y ficha de unidades móviles, editor de ruta, carga y descarga, cometidos, rutas permanentes.

**No entra:** contratos ni portazgos (fase 5).

## 4. Puntos que hay que resolver al detallar

- Trazado de ruta tocando comarcas, con el coste en jornadas acumulado y el turno de llegada.
- Aviso si un puerto de la ruta se cierra antes de que llegue la recua.
- Gestión de la carga con el porte disponible.
- Rutas circulares con precios límite, editables sin rehacerlas.

## 5. Criterios de aceptación provisionales

1. El turno de llegada que muestra la interfaz coincide con el real.
2. Se puede montar una ruta circular completa en móvil en menos de un minuto.
3. Los avisos estacionales aparecen antes de confirmar.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-083: <resumen>`.
