# T-100 · Varias plazas por partida y reparto del mapa

**Fase:** 5 · Multijugador · **Depende de:** T-087 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Hasta aquí todo funciona con un jugador. Ahora entran varios en el mismo mundo, que es donde
el juego cobra sentido competitivo.

Lee antes: [docs/06-competicion.md](../06-competicion.md) §6.1.

## 2. Objetivo

Partidas de 2 a 12 plazas, con mapa repartido con justicia y resolución simultánea para todos.

## 3. Alcance

**Entra:** plazas, invitaciones, recorte y reparto del mapa, comprobación de simetría de oportunidades, resolución conjunta.

**No entra:** influencia disputada (T-101) ni mercado común (T-102), que van aparte.

## 4. Puntos que hay que resolver al detallar

- Reparto: cada jugador debe tener a su alcance pan, madera, piedra y al menos un recurso estratégico a menos de X jornadas. Definir X y comprobarlo con un test sobre 100 repartos.
- Distancia mínima entre capitales y anillo neutral suficiente para que la expansión temprana no choque el turno 10.
- Medida de equidad del reparto (suma ponderada de potenciales alcanzables) y umbral de diferencia aceptable entre el mejor y el peor comienzo.
- Salas de espera: cómo se llena una partida y qué pasa si alguien no funda capital.

## 5. Criterios de aceptación provisionales

1. En 100 repartos generados, la diferencia de calidad entre el mejor y el peor comienzo se queda por debajo del umbral fijado.
2. La resolución con 12 jugadores tarda menos de 5 segundos.
3. Barajar el orden de los jugadores no cambia la huella del turno.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-100: <resumen>`.
