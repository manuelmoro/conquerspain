# T-104 · Clasificación pública y temporadas

**Fase:** 5 · Multijugador · **Depende de:** T-101 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Para que haya competición de verdad hace falta un marcador público y un corte. Las partidas
abiertas siguen sin final.

Lee antes: [docs/06-competicion.md](../06-competicion.md) §6.3 y §6.7.

## 2. Objetivo

Temporadas de 240 turnos con cierre, clasificación pública y archivo consultable.

## 3. Alcance

**Entra:** clasificación en vivo, cierre de temporada, reconocimientos por capítulo, archivo histórico de la partida.

**No entra:** ligas, emparejamiento por nivel ni recompensas entre partidas.

## 4. Puntos que hay que resolver al detallar

- Qué se congela exactamente al cerrar y qué se puede seguir consultando.
- Reconocimientos por capítulo (mejor obra, mejor comerciante, mejor año trashumante…).
- Cómo se presenta la clasificación para que informe sin desanimar al que va último.

## 5. Criterios de aceptación provisionales

1. Una temporada se cierra sola en su turno 240 y publica la clasificación.
2. La partida cerrada se puede consultar entera, con su crónica.
3. La clasificación en vivo se actualiza cada turno con su desglose.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-104: <resumen>`.
